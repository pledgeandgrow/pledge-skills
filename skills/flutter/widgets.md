# Widget Catalog

A catalog of Flutter's rich set of widgets. Create beautiful apps faster with Flutter's collection of visual, structural, platform, and interactive widgets.

## Design systems

Flutter ships with two design systems as part of the SDK:

- **[Cupertino](https://docs.flutter.dev/ui/widgets/cupertino)** — Beautiful and high-fidelity widgets that align with Apple's Human Interface Guidelines for iOS and macOS
- **[Material design](https://docs.flutter.dev/ui/widgets/material)** — Visual, behavioral, and motion-rich widgets implementing the Material 3 design specification

You can find many more design systems created by the Flutter community on pub.dev, such as `fluent_ui` (Windows), `macos_ui` (macOS), and `yaru` (Ubuntu).

## Widget categories

### Basics
Widgets to know before building your first Flutter app:
- `Container`, `Row`, `Column`, `Stack`, `Padding`, `Center`, `Align`, `SizedBox`, `FractionallySizedBox`
- `Text`, `Image`, `Icon`, `MaterialApp`, `Scaffold`, `AppBar`, `FloatingActionButton`

### Accessibility
- `Semantics`, `MergeSemantics`, `ExcludeSemantics`
- Screen reader support, large fonts, high contrast

### Animation and motion
- `AnimatedContainer`, `AnimatedBuilder`, `AnimatedOpacity`, `AnimatedPositioned`
- `Hero`, `TweenAnimationBuilder`, `AnimatedSwitcher`
- `AnimationController`, `CurvedAnimation`

### Assets, images, and icons
- `Image`, `Image.asset`, `Image.network`, `Icon`
- `AssetImage`, `AssetBundle`

### Async
- `FutureBuilder`, `StreamBuilder`
- Widgets supporting async patterns in Flutter apps

### Input
- `TextField`, `TextFormField`, `Checkbox`, `Radio`, `Switch`, `Slider`
- `DropdownButton`, `DatePicker`, `TimePicker`
- `GestureDetector`, `Dismissible`, `InkWell`

### Interaction models
- `Draggable`, `DragTarget`, `LongPressDraggable`
- `GestureDetector`, `Listener`, `AbsorbPointer`, `IgnorePointer`
- `Navigator`, `Route`, `PageView`, `TabBar`

### Layout
- `Row`, `Column`, `Flex`, `Expanded`, `Flexible`, `Spacer`
- `Stack`, `Positioned`, `IndexedStack`
- `ListView`, `GridView`, `CustomScrollView`, `SliverList`, `SliverGrid`
- `Wrap`, `Flow`, `Table`, `Container`, `Padding`, `Align`, `Center`
- `LayoutBuilder`, `MediaQuery`, `AspectRatio`, `FittedBox`, `IntrinsicHeight`, `IntrinsicWidth`

### Painting and effects
- `Opacity`, `Transform`, `DecoratedBox`, `ClipRRect`, `ClipPath`
- `ShaderMask`, `BackdropFilter`, `CustomPaint`

### Scrolling
- `ListView`, `GridView`, `CustomScrollView`
- `SingleChildScrollView`, `NestedScrollView`
- `ScrollController`, `ScrollPhysics` (`BouncingScrollPhysics`, `ClampingScrollPhysics`)
- `SliverAppBar`, `SliverList`, `SliverGrid`, `SliverToBoxAdapter`, `SliverPersistentHeader`

### Styling
- `Theme`, `ThemeData`, `TextStyle`, `MediaQuery`
- `Padding`, `Visibility`, `ResponsiveFramework`

### Text
- `Text`, `RichText`, `TextSpan`, `DefaultTextStyle`
- `SelectableText`, `EditableText`, `TextField`

## Widget index

For a complete list of all widgets, see the [widget index](https://docs.flutter.dev/reference/widgets).

## Common widget patterns

### Card with list

```dart
Card(
  child: Column(
    mainAxisSize: MainAxisSize.min,
    children: <Widget>[
      const ListTile(
        leading: Icon(Icons.album),
        title: Text('The Enchanted Evening'),
        subtitle: Text('Music by Julie Gable.'),
      ),
      Row(
        children: [
          TextButton(child: const Text('BUY TICKETS'), onPressed: () {}),
          const SizedBox(width: 8),
          TextButton(child: const Text('LISTEN'), onPressed: () {}),
        ],
      ),
    ],
  ),
)
```

### Stack with positioned children

```dart
Stack(
  children: [
    Container(width: 100, height: 100, color: Colors.red),
    Positioned(
      top: 20, left: 20,
      child: Container(width: 60, height: 60, color: Colors.green),
    ),
  ],
)
```
