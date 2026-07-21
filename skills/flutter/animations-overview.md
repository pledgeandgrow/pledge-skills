# Animations API Overview

An overview of animation concepts in Flutter's animation system.

## Animation class

The primary building block of the animation system is the `Animation` class. An animation represents a value of a specific type that can change over the lifetime of the animation.

```dart
abstract class Animation<T> extends Listenable implements ValueListenable<T> {
  T get value;
  AnimationStatus get status;
}
```

Most widgets that perform an animation receive an `Animation` object as a parameter, from which they read the current value and listen for changes.

## AnimationController

`AnimationController` is a special `Animation` that generates a new value each time the hardware is ready for a new frame. It extends `Animation<double>`:

```dart
class MyAnimation extends StatefulWidget {
  @override
  State<MyAnimation> createState() => _MyAnimationState();
}

class _MyAnimationState extends State<MyAnimation>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}
```

### Controller methods

| Method | Description |
|--------|-------------|
| `forward()` | Animate from lower to upper bound |
| `reverse()` | Animate from upper to lower bound |
| `stop()` | Stop the animation |
| `repeat()` | Repeat the animation |
| `reset()` | Reset to the beginning |
| `value` | Current value (0.0 to 1.0) |

### TickerProvider

`AnimationController` requires a `TickerProvider` for vsync. Use:
- `SingleTickerProviderStateMixin` — For a single controller
- `TickerProviderStateMixin` — For multiple controllers

## CurvedAnimation

Apply a curve to an animation:

```dart
final curvedAnimation = CurvedAnimation(
  parent: _controller,
  curve: Curves.easeInOut,
  reverseCurve: Curves.easeOut,
);
```

## Tween

A `Tween` maps a value from one range to another:

```dart
final tween = Tween<double>(begin: 0, end: 100);
final value = tween.evaluate(_controller); // 0.0 to 100.0

// With curve
final animatedValue = tween.animate(curvedAnimation);
```

### Tween types

- `Tween<double>` — Double values
- `ColorTween` — Color transitions
- `IntTween` — Integer values
- `RectTween` — Rect transitions
- `BorderRadiusTween` — BorderRadius transitions
- `SizeTween` — Size transitions
- `OffsetTween` — Offset transitions

## Listening to animations

### addListener

Called every time the animation value changes:

```dart
_controller.addListener(() {
  print('Current value: ${_controller.value}');
});
```

### addStatusListener

Called when the animation status changes:

```dart
_controller.addStatusListener((status) {
  switch (status) {
    case AnimationStatus.completed:
      print('Animation completed');
      break;
    case AnimationStatus.dismissed:
      print('Animation dismissed');
      break;
    case AnimationStatus.forward:
      print('Animation forward');
      break;
    case AnimationStatus.reverse:
      print('Animation reverse');
      break;
  }
});
```

## AnimationStatus

| Status | Description |
|--------|-------------|
| `dismissed` | Animation is at the beginning, not running |
| `forward` | Animation is running forward |
| `reverse` | Animation is running in reverse |
| `completed` | Animation is at the end, not running |

## Combining animations

### TweenSequence

```dart
final animation = TweenSequence<double>([
  TweenSequenceItem(
    tween: Tween<double>(begin: 0, end: 0.5),
    weight: 50,
  ),
  TweenSequenceItem(
    tween: Tween<double>(begin: 0.5, end: 1.0),
    weight: 50,
  ),
]).animate(_controller);
```

### Interval

Stagger animations within a single controller:

```dart
final fadeIn = Tween<double>(begin: 0, end: 1).animate(
  CurvedAnimation(
    parent: _controller,
    curve: const Interval(0.0, 0.5, curve: Curves.easeIn),
  ),
);

final scaleUp = Tween<double>(begin: 0.8, end: 1.0).animate(
  CurvedAnimation(
    parent: _controller,
    curve: const Interval(0.5, 1.0, curve: Curves.easeOut),
  ),
);
```

## Using animations in widgets

### AnimatedBuilder

```dart
AnimatedBuilder(
  animation: _controller,
  builder: (context, child) {
    return Opacity(
      opacity: _controller.value,
      child: child,
    );
  },
  child: const Text('Fade in'),
)
```

### AnimatedWidget

```dart
class MyAnimatedWidget extends AnimatedWidget {
  const MyAnimatedWidget({super.key, required Animation<double> animation})
      : super(listenable: animation);

  @override
  Widget build(BuildContext context) {
    final animation = listenable as Animation<double>;
    return Opacity(opacity: animation.value, child: const Text('Fade'));
  }
}
```

## Best practices

1. Always dispose `AnimationController` in `dispose()`
2. Use `SingleTickerProviderStateMixin` for single controllers
3. Use `CurvedAnimation` for natural motion
4. Use `Interval` for staggered animations
5. Use `AnimatedBuilder` to minimize rebuilds
6. Pass `child` to `AnimatedBuilder` to avoid rebuilding static widgets
7. Pre-warm shaders for smooth first-run animations
