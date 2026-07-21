# Adaptive and Responsive Design

It's important to create an app that responds to size and orientation changes and maximizes the use of each platform.

## Responsive design

Responsive design means your app adapts to different screen sizes and orientations.

### MediaQuery

```dart
final size = MediaQuery.of(context).size;
final width = size.width;
final height = size.height;
final orientation = MediaQuery.of(context).orientation;

if (width > 600) {
  // Tablet or desktop layout
} else {
  // Phone layout
}
```

### LayoutBuilder

```dart
LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth > 1200) {
      return _buildDesktopLayout();
    } else if (constraints.maxWidth > 600) {
      return _buildTabletLayout();
    } else {
      return _buildPhoneLayout();
    }
  },
)
```

### Breakpoints

Common breakpoint strategy:

| Width | Device | Layout |
|-------|--------|--------|
| < 600 | Phone | Single column |
| 600–900 | Large phone / small tablet | Two column |
| 900–1200 | Tablet | Three column |
| > 1200 | Desktop | Navigation rail + content |

### Responsive widgets

- `FractionallySizedBox` — Size as fraction of parent
- `AspectRatio` — Maintain aspect ratio
- `Flexible` / `Expanded` — Share space in Row/Column
- `Wrap` — Wrap children to next line
- `MediaQuery` — Get screen dimensions
- `LayoutBuilder` — Build based on constraints
- `OrientationBuilder` — Build based on orientation

## Adaptive design

Adaptive design means your app looks and feels native on each platform.

### Platform detection

```dart
import 'dart:io' show Platform;

if (Platform.isAndroid) {
  // Android-specific
} else if (Platform.isIOS) {
  // iOS-specific
} else if (Platform.isWindows) {
  // Windows-specific
} else if (Platform.isMacOS) {
  // macOS-specific
} else if (Platform.isLinux) {
  // Linux-specific
}
```

### Theme adaptation

```dart
import 'package:flutter/foundation.dart';

final isIOS = defaultTargetPlatform == TargetPlatform.iOS;
final isAndroid = defaultTargetPlatform == TargetPlatform.android;

ThemeData get adaptiveTheme(BuildContext context) {
  final platform = Theme.of(context).platform;
  switch (platform) {
    case TargetPlatform.iOS:
    case TargetPlatform.macOS:
      return ThemeData.cupertino();
    default:
      return ThemeData.light();
  }
}
```

### Platform-specific widgets

Use `Platform.isIOS` to choose between Material and Cupertino widgets:

```dart
Widget buildButton(BuildContext context) {
  if (Platform.isIOS) {
    return CupertinoButton.filled(
      onPressed: () {},
      child: const Text('Press'),
    );
  }
  return ElevatedButton(
    onPressed: () {},
    child: const Text('Press'),
  );
}
```

### Adaptive packages

- `adaptive_navigation` — Adaptive navigation scaffold
- `dynamic_color` — Material You dynamic colors
- `flutter_adaptive_scaffold` — Adaptive scaffold layouts

## Automatic platform adaptations

Flutter automatically adapts some behaviors:
- Scroll physics (bouncing on iOS, clamping on Android)
- Text selection handles
- Page transitions
- Default text style

See [platform-adaptations.md](platform-adaptations.md) for more details.

## Best practices

1. **Design mobile-first**, then adapt for larger screens
2. **Use `LayoutBuilder`** for responsive breakpoints
3. **Test on multiple devices** and orientations
4. **Use `MediaQuery`** for safe area and screen dimensions
5. **Consider platform conventions** for navigation and interactions
6. **Use `SafeArea`** to avoid notches and system UI
7. **Handle keyboard** with `MediaQuery.viewInsets`
8. **Use `SingleChildScrollView`** for small content overflow
9. **Use `ListView`/`GridView`** for scrollable content
10. **Consider foldable devices** — use `DisplayFeature` and `MediaQuery.displayFeatures`
