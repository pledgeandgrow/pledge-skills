# Add Flutter to an Existing App

Adding Flutter as a library to an existing Android, iOS, macOS, or web app.

## Overview

If you already have an app that's not written in Flutter, Flutter can be integrated into your existing application piecemeal, as a module. This feature is known as "add-to-app". The module can be imported into your existing app to render part of your app using Flutter, while the rest can be rendered using existing technology.

## Supported platforms

Add-to-app is supported on:
- **Android** — Multi-engine
- **iOS** — Multi-engine
- **macOS** — Multi-engine
- **Web** — Multi-view

## Two flavors

### Multi-engine (Android, iOS, macOS)

Allows running one or more instances of Flutter, each rendering a widget embedded into the host application. Each instance is a separate Dart program, running in isolation from other programs. Having multiple Flutter instances allows each instance to maintain independent application and UI state while using minimal memory resources.

### Multi-view (Web)

Allows creating multiple `FlutterView`s, each rendering a widget embedded into the host application. In this mode there's only one Dart program and all views and widgets can share objects.

## Common use cases

1. **Hybrid navigation stacks** — An app is made of multiple screens, some rendered by Flutter, others by another framework. The user can navigate freely between them.
2. **Partial-screen views** — A screen renders multiple widgets, some by Flutter, others by another framework.

## Creating a Flutter module

```bash
flutter create --template module my_flutter_module
```

This creates a Flutter module that can be embedded in an existing app.

## Android integration

### Add as dependency

In `settings.gradle`:

```gradle
setBinding(new Binding([gradle.this]))
evaluate(new File(
  settingsDir.parentFile,
  'my_flutter_module/.android/include_flutter.groovy'
))
```

In `app/build.gradle`:

```gradle
dependencies {
  implementation project(':flutter')
}
```

### Add Flutter to an Activity

```kotlin
class FlutterActivity : FlutterActivity() {
    // Flutter provides FlutterActivity and FlutterFragment
}
```

### Using FlutterFragment

```kotlin
val flutterFragment = FlutterFragment.withNewEngine()
    .initialRoute("/main")
    .build<FlutterFragment>()

supportFragmentManager
    .beginTransaction()
    .replace(R.id.flutter_container, flutterFragment)
    .commit()
```

## iOS integration

### Add as dependency

Using CocoaPods, add to `Podfile`:

```ruby
flutter_application_path = '../my_flutter_module'
eval(File.read(File.join(flutter_application_path, '.ios', 'Flutter', 'podhelper.rb')), binding)
```

### Add Flutter to a ViewController

```swift
import Flutter

class FlutterViewController: FlutterViewController {
    // Use FlutterViewController directly
}
```

### Using FlutterEngine

```swift
let flutterEngine = FlutterEngine(name: "my_engine")
flutterEngine.run(withEntrypoint: "main")

let flutterVC = FlutterViewController(
    engine: flutterEngine,
    nibName: nil,
    bundle: nil
)
present(flutterVC, animated: true)
```

## Web integration

Embed Flutter in an existing web app using multi-view:

```dart
// In Flutter module
@pragma('vm:entry-point')
void main() {
  runApp(MyApp());
}
```

```html
<!-- In host HTML -->
<div id="flutter-view-1"></div>
<script src="flutter.js"></script>
<script>
  _flutter.buildConfig = { ... };
  _flutter.loader.loadEntrypoint({
    onEntrypointLoaded: async (engineInitializer) => {
      const appRunner = await engineInitializer.initializeEngine({
        hostElement: document.getElementById('flutter-view-1'),
      });
      await appRunner.runApp();
    }
  });
</script>
```

## Multiple Flutters

For multiple Flutter instances on Android/iOS:

```kotlin
// Each engine is independent
val engine1 = FlutterEngine(context)
engine1.dartExecutor.executeDartEntrypoint(
    DartExecutor.DartEntrypoint(
        FlutterInjector.instance().flutterLoader().findAppBundlePath(),
        "main"
    )
)

val engine2 = FlutterEngine(context)
engine2.dartExecutor.executeDartEntrypoint(
    DartExecutor.DartEntrypoint(
        FlutterInjector.instance().flutterLoader().findAppBundlePath(),
        "secondary"
    )
)
```

```dart
// In Dart
@pragma('vm:entry-point')
void main() => runApp(MyApp());

@pragma('vm:entry-point')
void secondary() => runApp(MySecondaryApp());
```

## Communication between Flutter and native

Use platform channels or `MethodChannel`:

```dart
// Flutter side
const channel = MethodChannel('com.example.hybrid');

channel.setMethodCallHandler((call) async {
  switch (call.method) {
    case 'navigate':
      // Handle navigation from native
      break;
  }
});

// Send data to native
await channel.invokeMethod('dataFromFlutter', {'data': 'hello'});
```

## Best practices

1. Use add-to-app for gradual migration, not greenfield
2. Share logic via Dart packages, not platform channels
3. Minimize platform channel calls — batch data
4. Use pre-warmed engines for faster startup
5. Consider memory impact of multiple engines
6. Test on low-end devices
7. Use a single engine where possible for shared state
8. Keep Flutter module dependencies minimal
