# Introduction to Animations

How to perform animations in Flutter. Well-designed animations make a UI feel more intuitive, contribute to the polished look and feel of an app, and improve the user experience.

## Animation approaches

Flutter offers different approaches to animation:

1. **Pre-packaged implicit animations** — Easiest, use built-in animated widgets
2. **Custom implicit animations** — `TweenAnimationBuilder`
3. **Built-in explicit animations** — Control the animation yourself with built-in classes
4. **Custom explicit animations** — `AnimatedBuilder` and `AnimatedWidget` from scratch

## Implicit animations

Implicit animations are the easiest. You set a target value and the framework animates to it.

### AnimatedContainer

```dart
AnimatedContainer(
  duration: const Duration(milliseconds: 300),
  curve: Curves.easeInOut,
  width: _isExpanded ? 200 : 100,
  height: _isExpanded ? 200 : 100,
  color: _isExpanded ? Colors.blue : Colors.red,
  child: const Center(child: Text('Animate')),
)
```

### Other implicit animation widgets

- `AnimatedOpacity` — Animate opacity changes
- `AnimatedPositioned` — Animate position in a Stack
- `AnimatedPadding` — Animate padding
- `AnimatedAlign` — Animate alignment
- `AnimatedSwitcher` — Cross-fade between widgets
- `AnimatedDefaultTextStyle` — Animate text style changes
- `AnimatedFractionallySizedBox` — Animate fractional sizing

### AnimatedSwitcher

```dart
AnimatedSwitcher(
  duration: const Duration(milliseconds: 500),
  child: _count % 2 == 0
      ? const Icon(Icons.looks_one, key: ValueKey('one'))
      : const Icon(Icons.looks_two, key: ValueKey('two')),
)
```

## Custom implicit animations

### TweenAnimationBuilder

```dart
TweenAnimationBuilder<double>(
  tween: Tween<double>(begin: 0, end: _targetValue),
  duration: const Duration(seconds: 1),
  builder: (context, value, child) {
    return Opacity(opacity: value, child: child);
  },
  child: const Text('Fade in'),
)
```

## Explicit animations

With explicit animations, you control the animation using an `AnimationController`.

### AnimationController

```dart
class _MyWidgetState extends State<MyWidget> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Transform.rotate(
          angle: _controller.value * 2 * pi,
          child: child,
        );
      },
      child: const FlutterLogo(size: 100),
    );
  }
}
```

### CurvedAnimation

```dart
final animation = CurvedAnimation(
  parent: _controller,
  curve: Curves.easeInOut,
);
```

### Tween

```dart
final tween = Tween<double>(begin: 0, end: 100);
final value = tween.evaluate(_controller);
```

## Built-in explicit animation widgets

- `RotationTransition` — Rotate a widget
- `ScaleTransition` — Scale a widget
- `FadeTransition` — Fade a widget
- `SlideTransition` — Slide a widget
- `SizeTransition` — Animate size

```dart
FadeTransition(
  opacity: _controller,
  child: const FlutterLogo(size: 100),
)
```

## Hero animations

`Hero` animations share an element between two screens:

```dart
// Screen 1
Hero(
  tag: 'image-hero',
  child: Image.network('https://example.com/image.jpg'),
)

// Screen 2
Hero(
  tag: 'image-hero',
  child: Image.network('https://example.com/image.jpg'),
)
```

## Staggered animations

Use `Interval` to stagger animations:

```dart
final fadeIn = Tween<double>(begin: 0, end: 1).animate(
  CurvedAnimation(
    parent: _controller,
    curve: const Interval(0.0, 0.5, curve: Curves.easeIn),
  ),
);

final slide = Tween<Offset>(
  begin: const Offset(0, 0.5),
  end: Offset.zero,
).animate(
  CurvedAnimation(
    parent: _controller,
    curve: const Interval(0.5, 1.0, curve: Curves.easeOut),
  ),
);
```

## Animation curves

Common curves:
- `Curves.linear` — Constant speed
- `Curves.easeIn` / `Curves.easeOut` / `Curves.easeInOut`
- `Curves.bounceIn` / `Curves.bounceOut`
- `Curves.elasticIn` / `Curves.elasticOut`
- `Curves.fastOutSlowIn`

## Choosing an animation widget

Decision tree:
1. Need a simple animation? → Use implicit (`AnimatedContainer`, etc.)
2. Need custom implicit? → `TweenAnimationBuilder`
3. Need explicit control? → `AnimationController` + `AnimatedBuilder`
4. Transitioning between screens? → `Hero`
5. Shared element transitions? → `Hero` with unique tags
