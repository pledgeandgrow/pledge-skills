# Linux Platform Integration

Content covering integration with Linux in Flutter apps.

## Setup

Configure your development environment to build Flutter apps for Linux desktop:

1. Install dependencies:
   - `clang`
   - `cmake`
   - `ninja-build`
   - `pkg-config`

   ```bash
   sudo apt install clang cmake ninja-build pkg-config
   ```

2. Enable Linux desktop: `flutter config --enable-linux-desktop`
3. Run `flutter doctor` to verify
4. Run your app: `flutter run -d linux`

## Building Linux apps

```bash
# Build release
flutter build linux --release

# The built executable is in build/linux/x64/release/bundle/
```

### Build configuration

The Linux build uses CMake. Configuration files are in `linux/`:

- `linux/CMakeLists.txt` — Top-level CMake config
- `linux/my_application.cc` — Application setup

## Linux-specific considerations

### Window management

- Use `window_manager` for custom window controls
- Support window resizing and full-screen
- Handle desktop keyboard shortcuts

```dart
import 'package:window_manager/window_manager.dart';

await windowManager.setSize(Size(800, 600));
await windowManager.setTitle('My Linux App');
```

### Input

- Mouse and keyboard are primary inputs
- Support scroll wheel
- Use `Shortcuts` and `Actions` for keyboard shortcuts
- Support context menus (right-click)

### GTK integration

Flutter on Linux uses GTK for window management. The `my_application.cc` file handles GTK setup:

```cpp
static void my_application_activate(GApplication* application) {
  MyApplication* self = MY_APPLICATION(application);
  // GTK window setup
}
```

### Themes

- Use `yaru` package for Ubuntu-inspired widgets
- Support light and dark themes
- Respect system theme settings

```dart
import 'package:yaru/yaru.dart';

MaterialApp(
  theme: yaruLight,
  darkTheme: yaruDark,
  home: MyWidget(),
)
```

### File system

```dart
import 'dart:io';

// Linux paths
final home = Platform.environment['HOME'];
final config = Platform.environment['XDG_CONFIG_HOME'] ?? '$home/.config';
```

## Deploying Linux apps

### Snap Store

```bash
# Build the app
flutter build linux --release

# Create snapcraft.yaml
snapcraft
snap install myapp --dangerous

# Publish to Snap Store
snapcraft login
snapcraft push myapp_1.0.0_amd64.snap
```

### Flatpak

Create a Flatpak manifest and build:

```bash
flatpak-builder build-dir com.example.MyApp.json
flatpak build-export repo build-dir
```

### AppImage

Use `appimage-builder` to create portable AppImage bundles.

### Debian package

Use `dpkg-deb` to create `.deb` packages:

```bash
dpkg-deb --build myapp_1.0.0_amd64
```
