# Constructors

Constructors are special functions that create instances of classes.

## Types of Constructors

| Type | Description |
|------|-------------|
| Generative | Creates new instances and initializes instance variables |
| Default | Used when no constructor is specified; no arguments, no name |
| Named | Clarifies purpose or allows multiple constructors |
| Constant | Creates compile-time constant instances |
| Factory | Creates a subtype instance or returns cached instance |
| Redirecting | Forwards calls to another constructor in the same class |

## Generative Constructors

```dart
class Point {
  double x;
  double y;

  // Generative constructor with initializing formal parameters
  Point(this.x, this.y);
}
```

## Initializing Formal Parameters

Use `this.` shorthand to set instance variables:

```dart
class Point {
  double x;
  double y;

  Point(this.x, this.y);
}
```

With default values:

```dart
class Point {
  double x;
  double y;

  Point(this.x = 0, this.y = 0);
}
```

## Default Constructor

If you don't declare a constructor, Dart uses the default constructor — a generative constructor without arguments or name.

## Named Constructors

```dart
const double xOrigin = 0;
const double yOrigin = 0;

class Point {
  final double x;
  final double y;

  Point(this.x, this.y);

  // Named constructor
  Point.origin() : x = xOrigin, y = yOrigin;
}
```

A subclass doesn't inherit a superclass's named constructor.

## Initializer Lists

Use initializer lists to set instance variables before the constructor body:

```dart
class Point {
  final double x;
  final double y;
  final double distanceFromOrigin;

  Point(double x, double y)
      : x = x,
        y = y,
        distanceFromOrigin = sqrt(x * x + y * y);
}
```

Initializer lists can also use `assert`:

```dart
class NonNegativePoint {
  final double x;
  final double y;

  NonNegativePoint(double x, double y)
      : assert(x >= 0),
        assert(y >= 0),
        x = x,
        y = y;
}
```

## Super Constructor Calls

Call a superclass constructor using `super`:

```dart
class Vector2 {
  final double x;
  final double y;

  Vector2(this.x, this.y);
}

class Vector3 extends Vector2 {
  final double z;

  Vector3(double x, double y, this.z) : super(x, y);
}
```

## Super Parameters

Dart 2.17+ supports super-initializer parameters:

```dart
class Vector3 extends Vector2 {
  final double z;

  Vector3(super.x, super.y, this.z);
}
```

## Redirecting Constructors

A redirecting constructor has an empty body and uses `this` instead of the class name:

```dart
class Point {
  double x, y;

  Point(this.x, this.y);

  // Delegates to the main constructor
  Point.alongXAxis(double x) : this(x, 0);
}
```

## Constant Constructors

Make objects compile-time constants with `const`:

```dart
class ImmutablePoint {
  static const ImmutablePoint origin = ImmutablePoint(0, 0);

  final double x, y;

  const ImmutablePoint(this.x, this.y);
}
```

Constant constructors don't always create constants — they might be invoked in a non-const context.

## Factory Constructors

Use `factory` when you don't always create a new instance:

```dart
class Logger {
  final String name;
  bool mute = false;

  static final Map<String, Logger> _cache = {};

  factory Logger(String name) {
    return _cache.putIfAbsent(name, () => Logger._internal(name));
  }

  Logger._internal(this.name);

  void log(String msg) {
    if (!mute) print(msg);
  }
}
```

Factory constructors can also return subtypes:

```dart
class Shape {
  factory Shape(String type) {
    switch (type) {
      case 'circle':
        return Circle();
      case 'square':
        return Square();
      default:
        throw 'Unknown shape';
    }
  }
}

class Circle implements Shape {}
class Square implements Shape {}
```

## Primary Constructors (Dart 3.5+)

Dart 3.5+ introduces primary constructors, which allow declaring a constructor in the class header:

```dart
class Point(double x, double y) {
  double get distanceFromOrigin => sqrt(x * x + y * y);
}
```
