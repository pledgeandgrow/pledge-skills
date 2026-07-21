# Windows Platform Integration

Content covering integration with Windows in Flutter apps.

## Setup

Configure your development environment to build Flutter apps for Windows:

1. Install Visual Studio 2022 with the "Desktop development with C++" workload
2. Enable Windows desktop: `flutter config --enable-windows-desktop`
3. Run `flutter doctor` to verify
4. Create or run your app: `flutter create my_app && cd my_app && flutter run -d windows`

## Building Windows apps

```bash
# Build release
flutter build windows --release

# The built executable is in build/windows/x64/runner/Release/
```

### Build configuration

The Windows build uses CMake. Configuration files are in `windows/`:

- `windows/CMakeLists.txt` — Top-level CMake config
- `windows/runner/CMakeLists.txt` — Runner app CMake config
- `windows/runner/main.cpp` — Entry point
- `windows/runner/flutter_window.cpp` — Flutter window

## External windows

Add external windows to your Flutter Windows app using multi-window patterns:

```cpp
// In native code
Win32Window::MessageHandler message_handler = [&](HWND hwnd, UINT message, WPARAM wparam, LPARAM lparam) {
  // Handle window messages
};
```

Use platform channels to communicate between Flutter and native Windows code:

```dart
const channel = MethodChannel('com.example.app/windows');
await channel.invokeMethod('createExternalWindow', {'title': 'My Window'});
```

## Windows-specific considerations

### Window management

- Handle window resizing with `MediaQuery` and `LayoutBuilder`
- Support keyboard shortcuts and menus
- Handle DPI scaling for high-resolution displays
- Support window minimization, maximization, and restoration

### Input

- Mouse and keyboard are primary inputs
- Use `Shortcuts` and `Actions` for keyboard shortcuts
- Use `MouseRegion` for hover effects
- Support context menus (right-click)

```dart
Shortcuts(
  shortcuts: {
    LogicalKeySet(LogicalKeyboardKey.control, LogicalKeyboardKey.s): SaveIntent(),
  },
  child: Actions(
    actions: {
      SaveIntent: CallbackAction<SaveIntent>(
        onInvoke: (intent) => _saveFile(),
      ),
    },
    child: MyWidget(),
  ),
)
```

### File system

```dart
import 'dart:io';

// Windows paths
final documents = Platform.environment['USERPROFILE'];
```

### Title bar

Customize the Windows title bar:

```cpp
// In flutter_window.cpp
// Remove default title bar and use custom one
```

Or use packages like `window_manager` for custom window controls:

```dart
import 'package:window_manager/window_manager.dart';

await windowManager.setTitleBarStyle(TitleBarStyle.hidden);
```

## Deploying to Microsoft Store

1. Build: `flutter build windows --release`
2. Package as MSIX using `msix` package
3. Submit to [Partner Center](https://partner.microsoft.com)
