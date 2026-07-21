# Tools & Techniques

Content covering tools that support developing Flutter apps.

## Flutter SDK

### CLI commands

| Command | Description |
|---------|-------------|
| `flutter create <name>` | Create a new Flutter project |
| `flutter run` | Run app with hot reload |
| `flutter build <target>` | Build for production |
| `flutter test` | Run tests |
| `flutter analyze` | Static analysis |
| `flutter format` | Format code (use `dart format`) |
| `flutter pub get` | Get dependencies |
| `flutter pub add <package>` | Add a dependency |
| `flutter pub upgrade` | Upgrade dependencies |
| `flutter doctor` | Check environment |
| `flutter devices` | List connected devices |
| `flutter clean` | Clean build artifacts |
| `flutter logs` | Show device logs |
| `flutter attach` | Attach to running app |
| `flutter downgrade` | Downgrade Flutter SDK |

### Flutter SDK overview

The Flutter SDK includes:
- **Flutter framework** — Widgets, rendering, animation
- **Dart SDK** — Dart compiler and tools
- **Flutter engine** — C++ engine (Skia/Impeller, text layout)
- **Command-line tools** — `flutter` CLI

## Hot reload

Hot reload injects code changes into the running Dart VM without losing state:

1. Run the app: `flutter run`
2. Press `r` in the terminal for hot reload
3. Press `R` for hot restart (loses state)

In VS Code: `Ctrl+S` triggers hot reload when debugging.

### What hot reload preserves
- State of StatefulWidgets
- Navigation stack
- Animations in progress

### What requires hot restart
- Changes to `main()` or `initState()`
- Changes to widget structure that affect state

## Flutter DevTools

DevTools is a suite of performance and debugging tools:

### Inspector
- Inspect the widget tree
- View widget properties
- Identify layout issues
- Enable/disable debug paint

### Performance
- Frame rendering timeline
- CPU profiler
- Identify janky frames
- Shader compilation analysis

### Memory
- Memory usage over time
- Heap snapshot analysis
- Detect memory leaks

### Network
- HTTP request monitoring
- WebSocket traffic

### Logging
- Console output
- Flutter framework logs
- Platform logs

### Embedder
- DevTools is built into VS Code and Android Studio
- Or run standalone: `dart devtools`

## Flutter Widget Previewer

Preview widgets in real-time, separate from your full app. Available in VS Code with the Flutter extension.

## Flutter Property Editor

View and modify widget properties directly in the editor. Available in VS Code with the Flutter extension.

## Code formatting

```bash
dart format .
dart format lib/ --line-length 100
```

Configure in `analysis_options.yaml`:

```yaml
formatter:
  page_width: 100
```

## Flutter fix

Automatically migrate code to latest APIs:

```bash
flutter fix --apply
```

## Editor support

### Visual Studio Code

Install the Flutter extension:
- Code completion
- Hot reload on save
- Widget inspector
- DevTools integration
- Snippets for common widgets

### Android Studio / IntelliJ

Install the Flutter plugin:
- Code completion
- Hot reload
- Widget inspector
- DevTools integration
- Project templates

## pubspec options (Flutter-specific)

```yaml
flutter:
  uses-material-design: true  # Include Material Icons font

  assets:
    - assets/images/

  fonts:
    - family: Raleway
      fonts:
        - asset: assets/fonts/Raleway-Regular.ttf

  # Platform-specific settings
  plugin:
    platforms:
      android:
        package: com.example.my_plugin
        pluginClass: MyPlugin
      ios:
        pluginClass: MyPlugin

  # Generate plugin platform bindings
  generate: true
```

## Debugging tips

### flutter doctor

```bash
flutter doctor -v  # Verbose output
```

### Verbose logging

```bash
flutter run --verbose
flutter run --observatory-port=8100
```

### Inspect widgets

```dart
// In code
debugPrint('Widget tree: ${debugDumpApp()}');

// Enable debug paint
debugPaintSizeEnabled = true;
```

### Platform-specific debugging

```bash
# Android logs
flutter logs
adb logcat -s flutter

# iOS logs (from macOS)
xcrun simctl spawn booted log filter --predicate 'subsystem == "io.flutter"'
```

## Best practices

1. Run `flutter doctor` regularly
2. Use `flutter analyze` in CI
3. Format code with `dart format`
4. Use `flutter fix` when upgrading
5. Learn DevTools for performance debugging
6. Use hot reload during development
7. Keep the Flutter SDK updated
8. Use the Flutter extension for your editor
9. Clean build artifacts when things break: `flutter clean`
10. Use `--verbose` for detailed error output
