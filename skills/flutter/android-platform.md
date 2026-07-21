# Android Platform Integration

Content covering integration with Android in Flutter apps.

## Setup

Configure your development environment to build Flutter apps for Android:

1. Install Android Studio
2. Accept Android licenses: `flutter doctor --android-licenses`
3. Configure an Android emulator or physical device
4. Run `flutter doctor` to verify setup

## Calling JetPack APIs

Use the latest Android APIs from your Dart code using platform channels or Pigeon:

```dart
const channel = MethodChannel('com.example.app/jetpack');

Future<void> callJetpackApi() async {
  await channel.invokeMethod('callJetpackApi');
}
```

## Splash screen

Add a splash screen to your Android app:

1. Add a `SplashScreen` style in `android/app/src/main/res/values/styles.xml`:

```xml
<style name="LaunchTheme" parent="@android:style/Theme.Light.NoTitleBar">
  <item name="android:windowBackground">@drawable/launch_background</item>
</style>
```

2. Create `launch_background.xml` in `drawable`:

```xml
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
  <item android:drawable="@android:color/white" />
  <item>
    <bitmap android:gravity="center" android:src="@mipmap/ic_launcher" />
  </item>
</layer-list>
```

Or use the `flutter_native_splash` package to automate:

```bash
dart run flutter_native_splash:create
```

## Platform Views

Host native Android views in your Flutter app:

```dart
// Dart side
class NativeMapView extends StatelessWidget {
  const NativeMapView({super.key});

  @override
  Widget build(BuildContext context) {
    return AndroidView(
      viewType: 'native-map-view',
      creationParams: {'center': [37.7749, -122.4194]},
      creationParamsCodec: const StandardMessageCodec(),
    );
  }
}
```

```kotlin
// Android side
class NativeMapViewFactory : PlatformViewFactory(StandardMessageCodec.INSTANCE) {
  override fun create(context: Context, viewId: Int, args: Any?): PlatformView {
    return NativeMapView(context, viewId, args)
  }
}
```

## Restore state

Restore your app's state after it's been killed by the OS:

1. Use `RestorationMixin` on your `State`:

```dart
class MyPageState extends State<MyPage> with RestorationMixin<String> {
  final _counter = RestorableInt(0);

  @override
  String get restorationId => 'my_page';

  @override
  void restoreState(RestorationBucket? oldBucket, bool initialRestore) {
    registerForRestoration(_counter, 'counter');
  }

  @override
  void dispose() {
    _counter.dispose();
    super.dispose();
  }
}
```

## Predictive back gesture

Add the predictive back gesture (Android 14+):

1. Enable in `AndroidManifest.xml`:

```xml
<application
  android:enableOnBackInvokedCallback="true"
  ...>
```

2. Handle back navigation in Flutter with `PopScope`:

```dart
PopScope(
  canPop: false,
  onPopInvokedWithResult: (didPop, result) {
    if (!didPop) {
      // Show confirm dialog
    }
  },
  child: MyWidget(),
)
```

## ChromeOS

Platform-specific considerations for building for ChromeOS:

- Test with touch, mouse, and keyboard input
- Handle window resizing with `MediaQuery` and `LayoutBuilder`
- Support drag-and-drop with `Draggable` and `DragTarget`
- Configure `android:resizeableActivity` in manifest

## Sensitive content

Protect sensitive content in your Flutter app:

- Use `FlagSecure` to prevent screenshots on Android
- Use platform channels to set `FLAG_SECURE`:

```kotlin
window.setFlags(
  WindowManager.LayoutParams.FLAG_SECURE,
  WindowManager.LayoutParams.FLAG_SECURE
)
```

## Launching a Jetpack Compose activity

```kotlin
class ComposeActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContent {
      MyComposeApp()
    }
  }
}
```

Launch from Flutter:

```dart
const channel = MethodChannel('com.example.app/compose');
await channel.invokeMethod('launchCompose');
```
