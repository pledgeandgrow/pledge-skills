# Writing Custom Platform-Specific Code

Learn how to write custom platform-specific code in your Flutter app.

## Overview

You can use platform-specific code in your Flutter app. Two common approaches:

1. **Platform channels** — Pass messages between Flutter and platform code
2. **Pigeon package** — Generate type-safe platform-specific code

## Supported platforms and languages

| Platform | Languages |
|----------|-----------|
| Android | Kotlin, Java |
| iOS | Swift, Objective-C |
| Windows | C++ |
| macOS | Objective-C |
| Linux | C |
| Web | JS interoperability (dart:js_interop) |

## Platform channels

### MethodChannel

Call platform-specific methods from Dart:

**Dart side:**

```dart
import 'package:flutter/services.dart';

const platform = MethodChannel('com.example.app/battery');

Future<int> getBatteryLevel() async {
  final result = await platform.invokeMethod('getBatteryLevel');
  return result as int;
}
```

**Android (Kotlin):**

```kotlin
class MainActivity : FlutterActivity() {
    private val CHANNEL = "com.example.app/battery"

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL)
            .setMethodCallHandler { call, result ->
                when (call.method) {
                    "getBatteryLevel" -> {
                        val level = getBatteryLevel()
                        result.success(level)
                    }
                    else -> result.notImplemented()
                }
            }
    }

    private fun getBatteryLevel(): Int {
        val batteryManager = getSystemService(Context.BATTERY_SERVICE) as BatteryManager
        return batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
    }
}
```

**iOS (Swift):**

```swift
class AppDelegate: FlutterAppDelegate {
    override func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        let controller = window?.rootViewController as! FlutterViewController
        let channel = FlutterMethodChannel(
            name: "com.example.app/battery",
            binaryMessenger: controller.binaryMessenger
        )
        channel.setMethodCallHandler { call, result in
            switch call.method {
            case "getBatteryLevel":
                result(self.getBatteryLevel())
            default:
                result(FlutterMethodNotImplemented)
            }
        }
        return super.application(application, didFinishLaunchingWithOptions: launchOptions)
    }
}
```

### EventChannel

Stream data from platform to Dart:

```dart
const eventChannel = EventChannel('com.example.app/sensor');

Stream<dynamic> get sensorStream =>
    eventChannel.receiveBroadcastStream();

// Usage
sensorStream.listen((data) {
  print('Sensor value: $data');
});
```

### BasicMessageChannel

Pass strings or binary messages:

```dart
const channel = BasicMessageChannel<String>(
  'com.example.app/text',
  StringCodec(),
);

channel.setMessageHandler((message) async {
  print('Received: $message');
  return 'Reply from Dart';
});
```

## Pigeon (type-safe channels)

Pigeon generates type-safe platform channel code:

```yaml
dev_dependencies:
  pigeon: ^22.0.0
```

### Define the API

```dart
// pigeons/api.dart
import 'package:pigeon/pigeon.dart';

@HostApi()
abstract class BatteryApi {
  int getBatteryLevel();
  String getDeviceModel();
}
```

### Configure and generate

```dart
// pigeons/api.dart (continued)
@ConfigurePigeon(PigeonOptions(
  dartOut: 'lib/src/messages.g.dart',
  kotlinOut: 'android/src/main/kotlin/com/example/Messages.g.kt',
  kotlinOptions: KotlinOptions(package: 'com.example'),
  swiftOut: 'ios/Classes/Messages.g.swift',
))
```

```bash
dart run pigeon --input pigeons/api.dart
```

### Use generated code

```dart
// Dart side
final api = BatteryApi();
final level = await api.getBatteryLevel();
```

## Platform-specific Dart code

Use `defaultTargetPlatform` to write platform-specific Dart code:

```dart
import 'package:flutter/foundation.dart';

if (defaultTargetPlatform == TargetPlatform.iOS) {
  // iOS-specific Dart code
} else if (defaultTargetPlatform == TargetPlatform.android) {
  // Android-specific Dart code
}
```

### Platform check with dart:io

```dart
import 'dart:io' show Platform;

if (Platform.isAndroid) { /* Android */ }
if (Platform.isIOS) { /* iOS */ }
if (Platform.isWindows) { /* Windows */ }
if (Platform.isMacOS) { /* macOS */ }
if (Platform.isLinux) { /* Linux */ }
```

### kIsWeb

```dart
import 'package:flutter/foundation.dart';

if (kIsWeb) {
  // Web-specific code (uses dart:js_interop instead of platform channels)
}
```

## Best practices

1. Use Pigeon for type-safe platform channels
2. Keep platform channel calls minimal — batch data
3. Handle errors properly on both sides
4. Use `defaultTargetPlatform` for Dart-only platform checks
5. Use `kIsWeb` to check for web platform
6. Consider existing plugins before writing custom channels
7. Use federated plugin structure for cross-platform plugins
8. Test on all target platforms
