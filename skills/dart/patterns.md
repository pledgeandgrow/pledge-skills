# Patterns

Patterns require a language version of at least 3.0.

Patterns are a syntactic category in the Dart language, like statements and expressions. A pattern represents the shape of a set of values that it might match against actual values.

## What Patterns Do

A pattern can:
1. **Match** a value — check whether a value has a certain shape, is a certain constant, is equal to something, or has a certain type
2. **Destructure** a value — break a value into its constituent parts and bind variables to them

## Matching

Pattern matching tests whether a value has the form you expect:

```dart
switch (number) {
  // Constant pattern matches if 1 == number.
  case 1:
    print('one');
}
```

Patterns match recursively on their subpatterns:

```dart
const a = 'a';
const b = 'b';
switch (obj) {
  // List pattern [a, b] matches if obj is a list with two fields,
  // then if its fields match the constant subpatterns 'a' and 'b'.
  case [a, b]:
    print('$a, $b');
}
```

## Destructuring

When an object and pattern match, the pattern can access the object's data and extract it in parts:

```dart
var numList = [1, 2, 3];
// List pattern [a, b, c] destructures the three elements
var [a, b, c] = numList;
print(a + b + c); // 6
```

You can nest any kind of pattern inside a destructuring pattern:

```dart
switch (list) {
  case ['a' || 'b', var c]:
    print(c);
}
```

## Pattern Types

### Constant Patterns

Matches against a constant value:

```dart
switch (number) {
  case 0:
    print('zero');
  case 1:
    print('one');
}
```

### Variable Patterns

Binds a variable to the matched value:

```dart
switch (list) {
  case [var a, var b]:
    print('$a, $b');
}
```

### Wildcard Patterns

Use `_` to ignore parts of a matched value:

```dart
switch (list) {
  case [_, var second, _]:
    print(second);
}
```

### Logical Patterns

- **OR pattern** (`||`) — matches if either subpattern matches
- **AND pattern** (`&&`) — matches if both subpatterns match

```dart
switch (char) {
  case 'a' || 'e' || 'i' || 'o' || 'u':
    print('vowel');
}

switch (value) {
  case int x && x > 0:
    print('positive integer');
}
```

### Relational Patterns

```dart
switch (number) {
  case < 0:
    print('negative');
  case >= 0:
    print('non-negative');
}
```

### Cast Patterns

```dart
switch (obj) {
  case (int x):
    print('integer: $x');
}
```

### Null-Check Patterns

```dart
switch (maybeString) {
  case String s:
    print('non-null string: $s');
}
```

### Null-Assert Patterns

```dart
switch (maybeString) {
  case String s!:
    print('non-null string: $s');
}
```

### List Patterns

```dart
switch (list) {
  case []:
    print('empty list');
  case [var a]:
    print('single element: $a');
  case [var a, var b]:
    print('two elements: $a, $b');
  case [var a, ..., var z]:
    print('first: $a, last: $z');
}
```

### Map Patterns

```dart
switch (map) {
  case {'key': var value}:
    print('value: $value');
}
```

### Record Patterns

```dart
switch (record) {
  case (var x, var y):
    print('x: $x, y: $y');
  case (var x, :var name):
    print('$x: $name');
}
```

### Object Patterns

```dart
switch (point) {
  case Point(x: var px, y: var py):
    print('x: $px, y: $py');
  case Point(:var x, :var y) when x == y:
    print('on diagonal');
}
```

### Identifier Patterns (Dot Shorthands)

Dart 3.7+ supports dot shorthands for object patterns:

```dart
switch (point) {
  case Point(:var x, :var y):
    print('x: $x, y: $y');
}
```

## Where Patterns Appear

### Variable Declaration

```dart
var (a, b) = (1, 2);
var [x, y, z] = [1, 2, 3];
var {name: n, age: a} = {'name': 'Alice', 'age': 30};
```

### Assignment

```dart
var (a, b) = (1, 2);
(a, b) = (b, a); // Swap
```

### Switch Statements

```dart
switch (obj) {
  case [var a, var b]:
    print('list: $a, $b');
  case {'key': var value}:
    print('map: $value');
  case _:
    print('default');
}
```

### Switch Expressions

```dart
var description = switch (color) {
  Color.red => 'red',
  Color.green => 'green',
  Color.blue => 'blue',
};
```

### If-Case

```dart
if (pair case [int x, int y]) {
  return Point(x, y);
}
```

### For-In Loops

```dart
for (final Candidate(:name, :yearsExperience) in candidates) {
  print('$name has $yearsExperience years of experience');
}
```

## Guard Clauses

Use `when` to add a condition to a pattern:

```dart
switch (pair) {
  case [int x, int y] when x > y:
    print('x is greater');
}
```

## Exhaustiveness Checking

The analyzer verifies that switch expressions and sealed type switches cover all cases:

```dart
sealed class Animal {}
class Dog extends Animal {}
class Cat extends Animal {}

String describe(Animal a) => switch (a) {
  Dog() => 'dog',
  Cat() => 'cat',
}; // No default needed — all cases covered
```
