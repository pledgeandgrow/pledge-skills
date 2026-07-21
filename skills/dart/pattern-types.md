# Pattern Types

Pattern type reference in Dart. For an overview of how patterns work, see the [Patterns](patterns.md) page.

## Pattern precedence

Pattern evaluation adheres to precedence rules (similar to operator precedence). You can use parenthesized patterns to evaluate lower-precedence patterns first.

Pattern types in ascending order of precedence:

1. **Logical-or** patterns (lowest precedence)
2. **Logical-and** patterns
3. **Relational** patterns
4. **Cast, null-check, null-assert** patterns (same level)
5. **Constant, variable, wildcard, identifier** patterns
6. **Parenthesized, list, map, record, object** patterns (highest precedence)

## Logical-or patterns

```
subpattern1 || subpattern2
```

Matches if any of the branches match. Branches are evaluated left-to-right. Once a branch matches, the rest are not evaluated.

```dart
var isPrimary = switch (color) {
  Color.red || Color.yellow || Color.blue => true,
  _ => false,
};
```

Subpatterns in a logical-or pattern can bind variables, but the branches must define the same set of variables, because only one branch will be evaluated.

## Logical-and patterns

```
subpattern1 && subpattern2
```

Matches only if both subpatterns match. If the left branch does not match, the right branch is not evaluated.

```dart
switch ((1, 2)) {
  case (var a, var b) && (var c, var d): // Error: both subpatterns attempt to bind 'b'
}
```

Subpatterns in a logical-and pattern can bind variables, but the variables in each subpattern must not overlap.

## Relational patterns

```
== expression
< expression
> expression
<= expression
>= expression
```

Compare the matched value to a given constant. The pattern matches when the comparison returns `true`.

```dart
String asciiCharType(int char) {
  const space = 32;
  const zero = 48;
  const nine = 57;

  return switch (char) {
    < space => 'control',
    == space => 'space',
    > space && < zero => 'punctuation',
    >= zero && <= nine => 'digit',
    _ => '',
  };
}
```

## Cast patterns

```
foo as String
```

Insert a type cast in the middle of destructuring, before passing the value to another subpattern:

```dart
(num, Object) record = (1, 's');
var (i as int, s as String) = record;
```

Cast patterns throw if the value doesn't have the stated type.

## Null-check patterns

```
subpattern?
```

Match first if the value is not null, then match the inner pattern. Bind a variable whose type is the non-nullable base type:

```dart
String? maybeString = 'nullable with base type String';
switch (maybeString) {
  case var s?:
    // 's' has type non-nullable String here.
}
```

## Null-assert patterns

```
subpattern!
```

Match if the object is not null, then on the value. Throw if the matched value is null:

```dart
List<String?> row = ['user', null];
switch (row) {
  case ['user', var name!]:
    // 'name' is a non-nullable string here.
}
```

For variable declaration patterns:

```dart
(int?, int?) position = (2, 3);
var (x!, y!) = position;
```

## Constant patterns

```
123, null, 'string', math.pi, SomeClass.constant, const Thing(1, 2), const (1 + 2)
```

Match when the value is equal to the constant:

```dart
switch (number) {
  case 1: // Matches if 1 == number.
    // ...
}
```

Simple literals and references to named constants can be used directly. More complex constant expressions must be parenthesized and prefixed with `const`.

## Variable patterns

```
var bar, String str, final int _
```

Bind new variables to values that have been matched or destructured:

```dart
switch ((1, 2)) {
  case (var a, var b):
    // 'a' and 'b' are in scope in the case body.
}
```

A typed variable pattern only matches if the matched value has the declared type.

## Identifier patterns

```
foo, _
```

Behave like a constant pattern or variable pattern depending on context:

- **Declaration context**: declares a new variable — `var (a, b) = (1, 2);`
- **Assignment context**: assigns to existing variable — `(a, b) = (3, 4);`
- **Matching context**: treated as a named constant pattern
- **Wildcard `_`**: matches any value and discards it

## Parenthesized patterns

```
(subpattern)
```

Control pattern precedence and insert a lower-precedence pattern where a higher precedence one is expected:

```dart
// x || y && z is the same as x || (y && z)
x || y && z => 'matches true',
(x || y) && z => 'matches nothing',
```

## List patterns

```
[subpattern1, subpattern2]
```

Match values that implement `List`, then recursively match subpatterns against the list's elements by position:

```dart
const a = 'a';
const b = 'b';
switch (obj) {
  case [a, b]:
    print('$a, $b');
}
```

### Rest element

List patterns can contain a rest element (`...`) to match lists of arbitrary lengths:

```dart
var [a, b, ..., c, d] = [1, 2, 3, 4, 5, 6, 7];
print('$a $b $c $d'); // 1 2 6 7
```

A rest element can have a subpattern that collects elements into a new list:

```dart
var [a, b, ...rest, c, d] = [1, 2, 3, 4, 5, 6, 7];
print('$a $b $rest $c $d'); // 1 2 [3, 4, 5] 6 7
```

## Map patterns

```
{"key": subpattern1, someConst: subpattern2}
```

Match values that implement `Map`, then recursively match subpatterns against the map's keys. Map patterns don't require matching the entire map — extra keys are ignored.

```dart
final {'foo': int? foo} = {};
```

Trying to match a key that doesn't exist throws a `StateError`.

## Record patterns

```
(subpattern1, subpattern2)
(x: subpattern1, y: subpattern2)
```

Match a record object and destructure its fields. If the value isn't a record with the same shape, the match fails.

```dart
var (myString: foo, myNumber: bar) = (myString: 'string', myNumber: 1);
```

The getter name can be omitted and inferred from the variable pattern:

```dart
var (:untyped, :int typed) = record;
```

## Object patterns

```
SomeClass(x: subpattern1, y: subpattern2)
```

Check the matched value against a named type and destructure using getters on the object's properties. Refuted if the value doesn't have the same type.

```dart
switch (shape) {
  case Rect(width: var w, height: var h):
    // ...
}
```

The getter name can be omitted:

```dart
var Point(:x, :y) = Point(1, 2);
```

Object patterns don't require matching the entire object — extra fields are ignored.
