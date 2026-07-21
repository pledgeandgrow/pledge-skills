# Automatic Platform Adaptations

Learn more about Flutter's platform adaptiveness.

## Overview

Flutter automatically adapts several behaviors to match platform conventions. While Flutter draws its own widgets (not native widgets), it respects platform-specific patterns for interactions, animations, and visual elements.

## Automatic adaptations

### Scroll physics

| Platform | Scroll behavior |
|----------|----------------|
| iOS/macOS | Bouncing scroll physics (overscroll bounce) |
| Android | Clamping scroll physics (overscroll glow) |

### Page transitions

| Platform | Transition |
|----------|-----------|
| iOS/macOS | Slide from right (Cupertino) |
| Android | Fade/slide (Material) |

### Text selection

- iOS: Different selection handles and toolbar
- Android: Material-style selection handles and toolbar

### Default text style

- iOS: San Francisco font
- Android: Roboto font

### Status bar style

Flutter respects platform-specific status bar styling.

### Safe area

`SafeArea` automatically handles notches, home indicators, and status bars per platform.

## Platform-specific widgets

### Material (Android-style)

```dart
MaterialApp(
  theme: ThemeData.light(),
  home: Scaffold(
    appBar: AppBar(title: Text('Material')),
    body: Center(child: Text('Hello')),
  ),
)
```

### Cupertino (iOS-style)

```dart
CupertinoApp(
  theme: CupertinoThemeData(),
  home: CupertinoPageScaffold(
    navigationBar: CupertinoNavigationBar(title: Text('Cupertino')),
    child: Center(child: Text('Hello')),
  ),
)
```

## Adaptive patterns

### Navigation

| Platform | Navigation pattern |
|----------|-------------------|
| Phone | Bottom navigation bar |
| Tablet | Navigation rail |
| Desktop | Navigation drawer or sidebar |

### Buttons

```dart
// Use platform-aware button
Platform.isIOS
    ? CupertinoButton.filled(onPressed: () {}, child: Text('Press'))
    : ElevatedButton(onPressed: () {}, child: Text('Press'))
```

### Dialogs

```dart
showDialog(
  context: context,
  builder: (context) {
    if (Platform.isIOS) {
      return CupertinoAlertDialog(...);
    }
    return AlertDialog(...);
  },
)
```

### Date pickers

```dart
if (Platform.isIOS) {
  showCupertinoDatePicker(...);
} else {
  showDatePicker(...);
}
```

## Platform adaptations table

| Feature | Android | iOS |
|---------|---------|-----|
| Scroll physics | Clamping (glow) | Bouncing |
| Transitions | Material | Cupertino slide |
| Selection | Material handles | iOS handles |
| Font | Roboto | San Francisco |
| Back button | AppBar leading | Cupertino back |
| Tabs | Material TabBar | Cupertino segmented |
| Switches | Material | Cupertino |
| Sliders | Material | Cupertino |

## Using Theme.platform

```dart
final platform = Theme.of(context).platform;
switch (platform) {
  case TargetPlatform.iOS:
  case TargetPlatform.macOS:
    // Cupertino style
    break;
  default:
    // Material style
}
```

## Best practices

1. Use `Platform.isIOS` / `Platform.isAndroid` for platform-specific widgets
2. Use `Theme.of(context).platform` for theme-aware adaptations
3. Test on both platforms to verify adaptations
4. Consider `defaultTargetPlatform` for non-IO platform checks
5. Use `kIsWeb` to check for web platform
6. Don't over-adapt — Material works on iOS and vice versa
7. Use `SafeArea` to handle notches and system UI
8. Consider adaptive packages like `adaptive_navigation`
