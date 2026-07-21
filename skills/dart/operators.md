# Operators

Dart supports the operators shown in the following table, listed in order of precedence from highest to lowest.

## Operator Precedence

| Description | Operator |
|-------------|----------|
| Unary postfix | `expr++` `expr--` `()` `[]` `?[]` `.` `?.` `!` |
| Unary prefix | `-expr` `!expr` `~expr` `++expr` `--expr` `await expr` |
| Multiplicative | `*` `/` `%` `~/` |
| Additive | `+` `-` |
| Shift | `<<` `>>` `>>>` |
| Bitwise AND | `&` |
| Bitwise XOR | `^` |
| Bitwise OR | `\|` |
| Relational/test | `>=` `>` `<=` `<` `as` `is` `is!` |
| Equality | `==` `!=` |
| Logical AND | `&&` |
| Logical OR | `\|\|` |
| Null-aware | `??` |
| Conditional | `expr1 ? expr2 : expr3` |
| Cascade | `..` `?..` |
| Assignment | `=` `*=` `/=` `+=` `-=` `&=` `^=` etc. |
| Spread | `...` `...?` |

## Arithmetic Operators

```dart
assert(2 + 3 == 5);
assert(2 - 3 == -1);
assert(2 * 3 == 6);
assert(5 / 2 == 2.5);    // Result is a double
assert(5 ~/ 2 == 2);     // Result is an int (truncating division)
assert(5 % 2 == 1);      // Remainder

assert('5/2 = ${5 ~/ 2} r ${5 % 2}' == '5/2 = 2 r 1');
```

Dart also supports prefix and postfix increment and decrement:

```dart
var a = 0;
var b = ++a; // Increment a before b gets its value
assert(a == b); // 1 == 1

var c = 0;
var d = c++; // Increment c AFTER d gets its value
assert(c != d); // 1 != 0
```

## Equality and Relational Operators

```dart
assert(2 == 2);
assert(2 != 3);
assert(3 > 2);
assert(2 < 3);
assert(3 >= 3);
assert(2 <= 3);
```

## Type Test Operators

```dart
// as: Type cast
(person as Employee).employeeNumber = 42;

// is: True if object has the specified type
if (person is Employee) {
  person.employeeNumber = 42;
}

// is!: True if object doesn't have the specified type
if (person is! Employee) return;
```

## Assignment Operators

```dart
var a = 5;
a *= 2; // a = a * 2
assert(a == 10);

// ??= assigns only if the variable is null
var b;
b ??= 5;
assert(b == 5);
```

## Logical Operators

```dart
if (!done && (col == 0 || col == 3)) {
  // ...
}
```

## Bitwise and Shift Operators

```dart
final value = 0x22;
final bitmask = 0x0f;

assert((value & bitmask) == 0x02);  // AND
assert((value & ~bitmask) == 0x20); // AND NOT
assert((value | bitmask) == 0x2f);  // OR
assert((value ^ bitmask) == 0x2d);  // XOR
assert((value << 4) == 0x220);      // Left shift
assert((value >> 4) == 0x02);       // Right shift
assert((value >>> 4) == 0x02);      // Unsigned right shift
```

## Conditional Expressions

```dart
var visibility = isPublic ? 'public' : 'private';

// Null-aware variant
String playerName(String? name) => name ?? 'guest';
```

## Cascade Notation

Cascades (`..`, `?..`) allow you to make a sequence of operations on the same object:

```dart
var paint = Paint()
  ..color = Colors.black
  ..strokeCap = StrokeCap.round
  ..strokeWidth = 5.0;
```

## Spread Operators

Used in collection literals to insert multiple elements:

```dart
var list = [1, 2, ...otherList];
var list2 = [0, ...?nullableList]; // Null-aware spread
```

## Operator Overloading

You can implement many operators as class members:

```dart
class Vector {
  final int x, y;
  Vector(this.x, this.y);

  Vector operator +(Vector v) => Vector(x + v.x, y + v.y);
  Vector operator -(Vector v) => Vector(x - v.x, y - v.y);
}
```
