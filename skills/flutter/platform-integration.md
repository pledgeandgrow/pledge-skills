# Platform Integration

Learn how to develop for different platforms and integrate with platform-specific features in Flutter apps.

## Supported platforms

Flutter enables building for multiple platforms from a single codebase:

| Platform | Setup | Status |
|----------|-------|--------|
| Android | Any device | Stable |
| iOS | macOS only | Stable |
| Web | Any device | Stable |
| Windows | Windows only | Stable |
| macOS | macOS only | Stable |
| Linux | Linux only | Stable |
| Embedded | Varies | Experimental |

## Platform setup

### Android

1. Install Android Studio
2. Accept Android licenses: `flutter doctor --android-licenses`
3. Configure an Android emulator or physical device

### iOS

1. Install Xcode
2. Configure iOS simulator or physical device
3. Set up signing in Xcode

### Web

1. Run `flutter config --enable-web`
2. Use `flutter run -d chrome` or `flutter build web`

### Windows

1. Install Visual Studio with Desktop development workload
2. Run `flutter config --enable-windows-desktop`

### macOS

1. Install Xcode
2. Run `flutter config --enable-macos-desktop`

### Linux

1. Install `clang`, `cmake`, `ninja-build`, `pkg-config`
2. Run `flutter config --enable-linux-desktop`

## Platform channels

Platform channels allow calling platform-specific code from Dart:

### MethodChannel

**Dart side:**

```dart
import 'package:flutter/services.dart';

const platform = MethodChannel('com.example.app/battery');

Future<int> getBatteryLevel() async {
  final result = await platform.invokeMethod('getBatteryLevel');
  return result;
}
```

**Android (Kotlin):**

```kotlin
class MainActivity : FlutterActivity() {
    private val CHANNEL = "com.example.app/battery"

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL)
            .setMethodCallHandler { call, result ->
                if (call.method == "getBatteryLevel") {
                    val level = getBatteryLevel()
                    result.success(level)
                } else {
                    result.notImplemented()
                }
            }
    }
}
```

**iOS (Swift):**

```swift
class AppDelegate: FlutterAppDelegate {
    override func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: ...
    ) -> Bool {
        let controller = window?.rootViewController as! FlutterViewController
        let channel = FlutterMethodChannel(
            name: "com.example.app/battery",
            binaryMessenger: controller.binaryMessenger
        )
        channel.setMethodCallHandler { call, result in
            if call.method == "getBatteryLevel" {
                result(self.getBatteryLevel())
            } else {
                result(FlutterMethodNotImplemented)
            }
        }
        return super.application(application, didFinishLaunchingWithOptions: launchOptions)
    }
}
```

### EventChannel

For streaming data from platform to Dart:

```dart
const eventChannel = EventChannel('com.example.app/sensor');

Stream<dynamic> get sensorStream =>
    eventChannel.receiveBroadcastStream();
```

### BasicMessageChannel

For passing strings or binary messages:

```dart
const channel = BasicMessageChannel<String>('com.example.app/text', StringCodec());
```

## Packages and plugins

For many platform integrations, use existing plugins from pub.dev:

- `camera` — Camera access
- `geolocator` — Location services
- `permission_handler` — Runtime permissions
- `url_launcher` — Open URLs
- `share_plus` — Share content
- `path_provider` — File system paths
- `image_picker` — Pick images/videos
- `local_notifications` — Local notifications
- `flutter_local_notifications` — Scheduled notifications

## Platform-specific code

### Conditional imports

```dart
import 'platform_specific_io.dart'
    if (dart.library.html) 'platform_specific_web.dart';
```

### Platform check

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
  // Running on web
} else {
  // Running on native
}
```

## Federated plugins

When developing plugins, use the federated plugin structure:

- **App-facing package**: The API users interact with
- **Platform interface**: Defines the contract
- **Platform implementations**: Android, iOS, web, etc.

This allows different teams to maintain different platform implementations.

## Adaptive and responsive design

When building for multiple platforms, consider adaptive design — see [adaptive-responsive.md](adaptive-responsive.md).
