# Variables

## Creating Variables

```dart
var name = 'Bob';
```

Variables store references. The variable `name` contains a reference to a `String` object with a value of `"Bob"`.

The type of the `name` variable is inferred to be `String`, but you can change that type by specifying it. If an object isn't restricted to a single type, specify the `Object` type (or `dynamic` if necessary):

```dart
Object name = 'Bob';
```

Another option is to explicitly declare the type that would be inferred:

```dart
String name = 'Bob';
```

## Default Value

Uninitialized variables that can be null have an initial value of `null`. Even variables with numeric types are initially null:

```dart
int? lineCount;
assert(lineCount == null);
```

With null safety, you must initialize the values of non-nullable variables before you use them:

```dart
int lineCount = 0;
```

## Late Variables

The `late` modifier has two use cases:
1. Declaring a non-nullable variable that's initialized after its declaration
2. Lazily initializing a variable

```dart
late String description;

void main() {
  description = 'Feijoada!';
  print(description);
}
```

If a `late`-marked variable is declared with an initializer, the initializer runs the first time the variable is used:

```dart
late String value = _expensiveComputation();
```

## Final and Const

Use `final` for variables that won't change after initialization:

```dart
final name = 'Bob';
final String nickname = 'Bobby';
```

Use `const` for variables that are compile-time constants:

```dart
const bar = 1000000;
const double atm = 1.01325 * bar;
```

`const` variables are implicitly `final`. The `const` keyword isn't just for declaring constant variables — you can also use it to create constant values:

```dart
var foo = const [];
final bar = const [];
const baz = [];
```

You can change the value of a non-`const` variable even if it previously had a `const` value:

```dart
foo = [1, 2, 3];
```

You can also define constants using expressions:

```dart
const Object i = 3;
const list = [i as int];
const map = {if (i is int) i: 'int'};
const set = {if (list is List<int>) ...list};
```

## Wildcard Variables

Use `_` as a wildcard variable name when you don't need to reference the variable:

```dart
var [_, second, _] = [1, 2, 3];
```

## Type Inference

Dart infers types from initializer expressions:

```dart
var x = 3;       // x is inferred as int
var y = 3.0;     // y is inferred as double
var z = 'hello'; // z is inferred as String
```

For local variables, prefer `var` over explicit type annotations (per Effective Dart style guidelines). For public APIs, use explicit type annotations.
