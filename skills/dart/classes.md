# Classes

Dart is an object-oriented language with classes and mixin-based inheritance. Every object is an instance of a class, and all classes except `Null` descend from `Object`. Mixin-based inheritance means that although every class has exactly one superclass, a class body can be reused in multiple class hierarchies.

## Using Class Members

Objects have members consisting of functions and data (methods and instance variables):

```dart
var p = Point(2, 2);

// Get the value of y.
assert(p.y == 2);

// Invoke distanceTo() on p.
double distance = p.distanceTo(Point(4, 4));
```

Use `?.` instead of `.` to avoid an exception when the leftmost operand is null:

```dart
var a = p?.y; // If p is non-null, get y; otherwise, null.
```

## Using Constructors

Use a constructor to create an object:

```dart
var p1 = Point(2, 2);
var p2 = Point.fromJson({'x': 1, 'y': 2});
```

Use `const` for compile-time constants:

```dart
var p = const ImmutablePoint(0, 0);
```

## Getting an Object's Type

Get an object's type at runtime using the `runtimeType` property:

```dart
print('The type of a is ${a.runtimeType}');
```

## Instance Variables

```dart
class Point {
  double x; // Initialize to null (if nullable) or must be initialized
  double y;
  double z = 0; // With initializer
}
```

## Implicit Interfaces

Every class implicitly defines an interface containing all the instance members of the class and of any interfaces it implements. You can create a class that implements the interface without inheriting the implementation:

```dart
class Person {
  final String name;
  Person(this.name);

  String greet(String who) => 'Hello, $who. I am $name.';
}

class Impostor implements Person {
  final String name = '';

  String greet(String who) => 'Hi $who. Do you know who I am?';
}
```

## Class Variables and Methods

Use `static` for class-level variables and methods:

```dart
class Queue {
  static const initialCapacity = 16;
  static List<List<int>> emptyLists = [];

  static int nextId = 0;
  static int getId() => nextId++;
}
```

## Abstract Classes

Use `abstract` to define an abstract class that can't be instantiated:

```dart
abstract class Animal {
  void makeSound(); // Abstract method, no implementation
}

class Dog extends Animal {
  @override
  void makeSound() => print('Woof!');
}
```

## noSuchMethod()

Override `noSuchMethod()` to handle attempts to use non-existent members:

```dart
class MockAnimal implements Animal {
  @override
  void makeSound() => print('Mock sound');

  @override
  dynamic noSuchMethod(Invocation invocation) {
    return super.noSuchMethod(invocation);
  }
}
```

## Extension Types

Extension types provide zero-cost wrappers around existing types:

```dart
extension type EmailAddress(String value) {
  bool isValid() => value.contains('@');
}
```

## Metadata

Use metadata annotations to add additional information:

```dart
@override
void toString() => 'MyClass';

@Deprecated('Use newMethod() instead')
void oldMethod() {}
```

Define your own metadata annotations:

```dart
class Todo {
  final String who;
  final String what;

  const Todo(this.who, this.what);
}

@Todo('Dash', 'Implement this method')
void doSomething() {}
```

## Implicit Getters and Setters

Dart provides implicit getters and setters for instance variables. You can also define explicit ones:

```dart
class Rectangle {
  double _width;
  double _height;

  Rectangle(this._width, this._height);

  double get width => _width;
  set width(double value) {
    if (value >= 0) _width = value;
  }

  double get area => _width * _height;
}
```

## Static Methods

Static methods don't operate on an instance and don't have access to `this`:

```dart
class MathUtils {
  static double square(double x) => x * x;
}

print(MathUtils.square(4)); // 16
```
