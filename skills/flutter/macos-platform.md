# macOS Platform Integration

Content covering integration with macOS in Flutter apps.

## Setup

Configure your development environment to build Flutter apps for macOS:

1. Install Xcode
2. Enable macOS desktop: `flutter config --enable-macos-desktop`
3. Run `flutter doctor` to verify
4. Run your app: `flutter run -d macos`

## Building macOS apps

```bash
# Build release
flutter build macos --release

# The built app is in build/macos/Build/Products/Release/
```

### Build configuration

The macOS build uses Xcode. Configuration files are in `macos/`:

- `macos/Runner.xcodeproj` — Xcode project
- `macos/Runner/` — Source files
- `macos/Runner/MainFlutterWindow.swift` — Main window

## Platform Views

Host native macOS views in your Flutter app:

```dart
// Dart side
class NativeMacView extends StatelessWidget {
  const NativeMacView({super.key});

  @override
  Widget build(BuildContext context) {
    return PlatformViewLink(
      viewType: 'native-mac-view',
      surfaceFactory: (context, controller) {
        return PlatformViewSurface(
          controller: controller,
          hitTestBehavior: PlatformViewHitTestBehavior.opaque,
        );
      },
      onCreatePlatformView: (params) {
        return PlatformViewSurface(
          controller: params.controller,
          hitTestBehavior: PlatformViewHitTestBehavior.opaque,
        );
      },
    );
  }
}
```

## macOS-specific considerations

### Window management

- Use `window_manager` or `macos_window_utils` for custom window controls
- Support window resizing, full-screen, and tabs
- Handle macOS-specific keyboard shortcuts (Cmd+C, Cmd+V, etc.)

```dart
import 'package:macos_window_utils/macos_window_utils.dart';

// Set title bar style
await WindowManipulator.setTitlebarAppearsTransparent(true);
```

### Menu bar

macOS apps typically have a menu bar. Use the `macos_ui` package:

```dart
import 'package:macos_ui/macos_ui.dart';

MacosWindow(
  sidebar: MacosSidebar(),
  child: ContentArea(builder: (context) => MyContent()),
)
```

### Input

- Mouse and keyboard are primary inputs
- Support trackpad gestures (pinch, swipe, scroll)
- Use `Shortcuts` and `Actions` for keyboard shortcuts
- Support context menus (right-click / Ctrl+click)

### Entitlements

Configure entitlements in `macos/Runner/DebugProfile.entitlements` and `Release.entitlements`:

```xml
<!-- Network access -->
<key>com.apple.security.network.client</key>
<true/>

<!-- File access -->
<key>com.apple.security.files.user-selected.read-write</key>
<true/>

<!-- Camera -->
<key>com.apple.security.device.camera</key>
<true/>
```

### Sandbox

macOS apps run in a sandbox by default. Configure sandbox capabilities in entitlements.

## Deploying to macOS App Store

1. Build: `flutter build macos --release`
2. Open `build/macos/Build/Products/Release/Runner.xcarchive` in Xcode
3. Archive and submit via App Store Connect
4. Or use `altool` for command-line submission
