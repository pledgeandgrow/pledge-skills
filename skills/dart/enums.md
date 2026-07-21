# Enumerated Types

Enumerated types, often called enumerations or enums, are a special kind of class used to represent a fixed number of constant values.

All enums automatically extend the `Enum` class. They are also sealed, meaning they cannot be subclassed, implemented, mixed in, or otherwise explicitly instantiated.

## Simple Enums

```dart
enum Color { red, green, blue }
```

You can use trailing commas:

```dart
enum Color {
  red,
  green,
  blue,
}
```

## Using Enum Values

Access enum values with their names:

```dart
assert(Color.red.name == 'red');
```

Get all values:

```dart
for (final color in Color.values) {
  print(color.name);
}
```

Access by index:

```dart
assert(Color.green.index == 1);
```

## Enhanced Enums (Dart 2.17+)

Enums can have fields, methods, and constructors:

```dart
enum Vehicle {
  car(tires: 4),
  bicycle(tires: 2),
  truck(tires: 6);

  const Vehicle({required this.tires});

  final int tires;
}
```

## Enums with Mixins

```dart
mixin Musician {
  void playMusic();
}

enum Genre with Musician {
  rock,
  jazz,
  classical;

  @override
  void playMusic() {
    print('Playing $name music');
  }
}
```

## Enums Implementing Interfaces

```dart
abstract class Describable {
  String describe();
}

enum Shape implements Describable {
  circle,
  square,
  triangle;

  @override
  String describe() => 'A $name shape';
}
```

## Enums with Switch Expressions

Enums work perfectly with switch expressions:

```dart
String describe(Color c) => switch (c) {
  Color.red => 'red',
  Color.green => 'green',
  Color.blue => 'blue',
};
```

Since enums are sealed, the analyzer can verify exhaustiveness.

## Enum Methods

```dart
enum Status {
  active,
  inactive,
  pending;

  bool get isActive => this == active;
  bool get isInactive => this == inactive;

  String get label => switch (this) {
    active => 'Active',
    inactive => 'Inactive',
    pending => 'Pending',
  };
}
```

## Enum Values and byName

Dart 3.6+ provides `byName` for looking up enum values by name:

```dart
var color = Color.byName('red'); // Color.red
```

## Sealed Nature of Enums

Because enums are sealed:
- They cannot be subclassed
- They cannot be implemented (except by other enums or abstract classes/mixins)
- They cannot be mixed in
- All instances are known at compile time, enabling exhaustive switch checks
