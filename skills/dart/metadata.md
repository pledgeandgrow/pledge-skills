# Metadata

Use metadata to provide additional static information about your code. A metadata annotation begins with the character `@`, followed by either a reference to a compile-time constant (such as `deprecated`) or a call to a constant constructor.

## Usage

Metadata can be attached to most Dart program constructs by adding annotations before the construct's declaration or directive.

```dart
@override
void doSomething() {
  // ...
}
```

## Built-in annotations

The following annotations are available to all Dart code:

### @Deprecated

Marks a declaration as deprecated, indicating it should be migrated away from, with a message explaining the replacement and potential removal date.

```dart
class Television {
  /// Use [turnOn] to turn the power on instead.
  @Deprecated('Use turnOn instead')
  void activate() {
    turnOn();
  }

  /// Turns the TV's power on.
  void turnOn() {
    // ...
  }
}
```

Additional specific deprecation annotations:

- `@Deprecated.extend()` — Extending the class is deprecated
- `@Deprecated.implement()` — Implementing the class or mixin is deprecated
- `@Deprecated.subclass()` — Subclassing (extending or implementing) is deprecated
- `@Deprecated.mixin()` — Mixing in the class is deprecated
- `@Deprecated.instantiate()` — Instantiating the class is deprecated
- `@Deprecated.optional()` — Omitting an argument for the parameter is deprecated

### @deprecated

Marks a declaration as deprecated until an unspecified future release. Prefer using `@Deprecated` and providing a deprecation message.

### @override

Marks an instance member as an override or implementation of a member with the same name from a parent class or interface.

```dart
class Cat extends Animal {
  @override
  void makeSound() {
    print('Meow');
  }
}
```

### @pragma

Provides specific instructions or hints about a declaration to Dart tools, such as the compiler or analyzer.

```dart
@pragma('vm:prefer-inline')
int computeValue() {
  // ...
}
```

## Custom annotations

You can create custom annotations by defining a const constructor:

```dart
class Todo {
  final String message;
  const Todo(this.message);
}

@Todo('Implement error handling')
void process() {
  // ...
}
```

The Dart analyzer provides feedback as diagnostics if the `@override` annotation is needed and when using members annotated with `@deprecated` or `@Deprecated`.
