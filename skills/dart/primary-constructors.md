# Primary Constructors

Create classes concisely by declaring parameters and fields in the class header.

> Primary constructors require a language version of at least 3.13.

## Overview

Primary constructors provide a concise way to declare a class's fields and its main constructor in a single line. They reduce the boilerplate of declaring fields, passing parameters, and assigning them in the constructor body. This shorthand changes how you write the declaration, but it doesn't change runtime behavior.

## Basic usage

Consider this traditional class:

```dart
// Current syntax.
class Point {
  int x;
  int y;

  Point(this.x, this.y);
}
```

Using a primary constructor makes the same class much more concise:

```dart
// Using a primary constructor.
class Point(var int x, var int y);
```

Declaring a parameter with `var` or `final` implicitly induces an instance variable for that parameter. If you omit the modifier, the parameter doesn't create a field:

```dart
// Declares both fields x and y.
class Point(var int x, var int y);

// Doesn't declare a field.
class User(String name);
```

## Declaring parameters

Parameters with `var` or `final` modifiers are called **declaring parameters** — they implicitly induce a field. Parameters without modifiers behave like traditional constructor parameters.

For extension types, the primary constructor must have exactly one parameter, which is always a declaring parameter (even without the modifier). You can use `final`, but not `var`.

Mixin classes can only have a primary constructor with no parameters, body, or initializer list.

## Scoping rules

Primary constructor parameters are available in different parts of the class declaration using two distinct scopes:

- **Primary initializer scope**: Applies to non-late field initializers and the initializer list (after `this :`). A parameter name refers directly to the constructor parameter.
- **Primary parameter scope**: Applies to the body block (inside `{ ... }`). A declaring parameter's name refers to the induced instance variable, while a non-declaring parameter's name refers to the constructor parameter.

```dart
class DeltaPoint(final int x, int delta) {
  // Accesses 'x' and 'delta' parameters directly!
  final int y = x + delta;
}
```

## Constructor body

Add a body to the primary constructor using `this` followed by a block:

```dart
class Point(var int x, var int y) {
  this : assert(x >= 0 && y >= 0) {
    print('Point initialized at ($x, $y)');
  }
}
```

The block can specify an initializer list after `this` and/or a function body. To provide only an initializer list: `this : assert(x >= 0);`

## Private named parameters

When you use a private name (with a leading underscore) for a named parameter, the compiler makes the parameter name public for callers by removing the underscore:

```dart
// Variant using a private named parameter.
class User({required var String _name});
```

Callers use the public name: `User(name: 'John Doe')`

## Semicolon instead of empty body

An empty body `{}` can be replaced with a semicolon `;`:

```dart
class Point(var int x, var int y);
```

## Constant primary constructors

Place `const` before the class name to declare a constant primary constructor:

```dart
class const ConstPoint(final int x, final int y) {
  final int z;
  this : z = x + y;
}
```

Constraints:
- No body block (compile-time error)
- Every instance variable must be `final`, can't be `late`, and must be definitely initialized
- Initializing expressions must be potentially constant

## Named primary constructors

Append a dot (`.`) and a name after the class name:

```dart
// A named primary constructor.
class Point.custom(var int x, var int y);

// A private named primary constructor.
class Point._(var int x, var int y);
```

## In-body constructors

Any other constructors declared inside the class body are called **in-body constructors**. A class with a primary constructor can't have any other non-redirecting generative in-body constructors, to ensure the primary constructor executes on every new instance.
