# Dot Shorthands

Learn about the dot shorthand syntax in Dart.

> Dot shorthands require a language version of at least 3.10.

## Overview

Dot shorthand syntax `.foo` lets you write more concise Dart code by omitting the type when the compiler can infer it from context. This provides a clean alternative to writing the full `ContextType.foo` when accessing enum values, static members, or constructors.

An expression can start with:

- **Identifier** — `.myValue`
- **Constructor** — `.new()`
- **Constant creation** — `const .myValue()`

## Examples

```dart
// Use dot shorthand syntax on enums:
enum Status { none, running, stopped, paused }

Status currentStatus = .running; // Instead of Status.running

// Use dot shorthand syntax on a static method:
int port = .parse('8080'); // Instead of int.parse('8080')

// Uses dot shorthand syntax on a constructor:
class Point {
  final int x, y;
  Point(this.x, this.y);
  Point.origin() : x = 0, y = 0;
}

Point origin = .origin(); // Instead of Point.origin()
```

## Context type resolution

Dot shorthands use the **context type** to determine the member the compiler resolves to. The context type is the type that Dart expects an expression to have based on its location.

For example, in `Status currentStatus = .running`, the compiler knows a `Status` is expected, so it infers `.running` to mean `Status.running`.

## Where dot shorthands work

Dot shorthands can be used in any context where the type can be inferred:

- **Variable declarations** — `Status s = .running;`
- **Return statements** — `Status getStatus() => .running;`
- **Function arguments** — `setStatus(.running);`
- **Collection literals** — `List<Status> statuses = [.running, .stopped];`
- **Pattern matching** — `case .running:`

## Expression statements can't start with `.`

Expression statements can't start with a dot, because the compiler can't infer the context type from a standalone expression. This is a compile-time error:

```dart
.foo(); // Error: Expression statements can't start with .
```

Instead, use the full type name:

```dart
MyClass.foo();
```
