# iOS Platform Integration

Content covering integration with iOS in Flutter apps.

## Setup

Configure your development environment to build Flutter apps for iOS:

1. Install Xcode
2. Configure iOS simulator or physical device
3. Set up signing in Xcode (Team, Bundle Identifier)
4. Run `flutter doctor` to verify setup
5. Run `open ios/Runner.xcworkspace` to configure in Xcode

## Launch screen

Add a launch screen to your iOS app:

1. Open `ios/Runner.xcworkspace` in Xcode
2. Navigate to `Runner/Assets.xcassets/LaunchImage.imageset`
3. Add launch screen images for all sizes
4. Or use `flutter_native_splash` package:

```bash
dart run flutter_native_splash:create
```

## Platform Views

Host native iOS views in your Flutter app:

```dart
// Dart side
class NativeMapView extends StatelessWidget {
  const NativeMapView({super.key});

  @override
  Widget build(BuildContext context) {
    return UiKitView(
      viewType: 'native-map-view',
      creationParams: {'center': [37.7749, -122.4194]},
      creationParamsCodec: const StandardMessageCodec(),
    );
  }
}
```

```swift
// iOS side
class NativeMapViewFactory: NSObject, FlutterPlatformViewFactory {
  func create(withFrame frame: CGRect, viewIdentifier viewId: Int64, args args: Any?) -> FlutterPlatformView {
    return NativeMapView(frame: frame, viewId: viewId, args: args)
  }
}
```

## App extensions

Add iOS app extensions (e.g., Share Extension, Widget Extension, Notification Extension):

1. Add the extension target in Xcode
2. Configure the extension in Xcode
3. Use platform channels to communicate between Flutter and the extension

## Apple frameworks

Leverage Apple's system APIs through Flutter plugins:

- `path_provider` — File system access
- `connectivity_plus` — Network connectivity (Network framework)
- `local_auth` — Face ID / Touch ID (LocalAuthentication)
- `camera` — AVFoundation
- `video_player` — AVPlayer
- `sensors_plus` — CoreMotion
- `geolocator` — CoreLocation
- `permission_handler` — Info.plist permissions

## Restore state

Restore your app's state after it's been killed by the OS:

```dart
class MyPageState extends State<MyPage> with RestorationMixin<String> {
  final _index = RestorableInt(0);

  @override
  String get restorationId => 'my_page';

  @override
  void restoreState(RestorationBucket? oldBucket, bool initialRestore) {
    registerForRestoration(_index, 'index');
  }
}
```

## iOS App Clip

Add an iOS App Clip target to your Flutter project:

1. Open Xcode
2. File → New → Target → App Clip
3. Configure the App Clip extension
4. Build and test with `flutter build ios --release`

## iOS debugging

iOS-specific debugging techniques:

```bash
# Open iOS simulator
open -a Simulator

# Run on specific iOS device
flutter run -d <device-id>

# View iOS logs
xcrun simctl spawn booted log filter --predicate 'subsystem == "io.flutter"'

# Open in Xcode for native debugging
open ios/Runner.xcworkspace
```

## Flutter on latest iOS

Keep up with Flutter's support for the latest iOS releases:
- Check [Flutter iOS compatibility](https://docs.flutter.dev/platform-integration/ios/ios-latest)
- Test on the latest iOS version
- Handle new iOS permissions and privacy requirements
- Update Info.plist for new iOS features

## Info.plist configuration

Common Info.plist entries:

```xml
<!-- Camera permission -->
<key>NSCameraUsageDescription</key>
<string>Camera access is needed for photos</string>

<!-- Photo library permission -->
<key>NSPhotoLibraryUsageDescription</key>
<string>Photo access is needed for profile pictures</string>

<!-- Location permission -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>Location is needed for maps</string>

<!-- Microphone permission -->
<key>NSMicrophoneUsageDescription</key>
<string>Microphone access is needed for recording</string>
```
