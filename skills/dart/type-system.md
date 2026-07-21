# Type System

The Dart language is type safe: it uses a combination of static type checking and runtime checks to ensure that a variable's value always matches the variable's static type, sometimes referred to as **sound typing**. Although types are mandatory, type annotations are optional because of type inference.

## Static Type Checking

One benefit of static type checking is the ability to find bugs at compile time using Dart's static analyzer:

```dart
void printInts(List<int> a) => print(a);

void main() {
  final list = [];
  list.add(1);
  list.add('2');
  printInts(list);
}
// Error: The argument type 'List<dynamic>' can't be assigned to the parameter type 'List<int>'.
```

Adding a type annotation fixes the error:

```dart
void printInts(List<int> a) => print(a);

void main() {
  final list = <int>[];
  list.add(1);
  list.add(2);
  printInts(list); // OK
}
```

## Soundness

Soundness is about ensuring your program can't get into certain invalid states. A sound type system means you can never get into a state where an expression evaluates to a value that doesn't match the expression's static type.

Dart's type system, like the type systems in Java and C#, is sound. It enforces soundness using:
- **Static checking** (compile-time errors)
- **Runtime checks**

For example, assigning a `String` to `int` is a compile-time error. Casting an object to a `String` using `as String` fails with a runtime error if the object isn't a `String`.

## Type Inference

The analyzer can infer types for fields, methods, local variables, and most generic type arguments. When the analyzer doesn't have enough information to infer a specific type, it uses `dynamic`.

```dart
var x = 3; // x is inferred as int
var y = 'hello'; // y is inferred as String
```

## Runtime Checking

Runtime checks deal with the type information that can't be determined at compile time:

```dart
void main() {
  Object o = 'hello';
  if (o is String) {
    // Type promoted to String
    print(o.length);
  }
}
```

## Key Type System Concepts

### Non-nullable by Default

Since Dart 3, types are non-nullable by default:

```dart
int i = 42;     // Can never be null
int? maybeNull; // Can be null
```

### Type Promotion

The analyzer promotes types when it can prove a value has a more specific type:

```dart
Object o = 'hello';
if (o is String) {
  // o is promoted to String here
  print(o.length);
}
```

### `dynamic` vs `Object`

- `dynamic` — disables static type checking; all members are allowed at compile time
- `Object` — only allows members defined on `Object` (like `toString`, `hashCode`)
- `Object?` — same as `Object` but also allows `null`

Prefer `Object` or `Object?` over `dynamic` when possible.

### `Never`

`Never` indicates that an expression can never successfully finish evaluating. Most often used for functions that always throw:

```dart
Never myError() => throw 'Something went wrong';
```

### `void`

`void` indicates that a value is never used. Often used as a return type:

```dart
void main() {
  print('Hello');
}
```

### `Future` and `Stream`

Used in asynchronous programming. `Future` represents a value that will be available later, and `Stream` represents a sequence of asynchronous events.

### `Iterable`

Used in for-in loops and synchronous generator functions.

## Fixing Type Promotion Failures

Sometimes the analyzer can't promote a type even when you know it's safe. Common reasons:

1. **Local variable reassigned** — The analyzer can't be sure the variable hasn't changed
2. **Closures capturing variables** — The variable might change asynchronously
3. **Instance fields** — The analyzer can't guarantee the field hasn't changed between checks

Solutions:
- Use a local variable copy
- Use the `!` null assertion operator
- Use `as` for type casting
- Use pattern matching (`if (x case ...)`)

## Covariance

Dart generic types are covariant. This means `List<Dog>` is a subtype of `List<Animal>` when `Dog` extends `Animal`. This is sound because Dart uses runtime checks to ensure type safety.
