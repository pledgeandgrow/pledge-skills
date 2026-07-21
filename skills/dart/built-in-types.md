# Built-in Types

The Dart language has special support for the following types:

- **Numbers** (`int`, `double`)
- **Strings** (`String`)
- **Booleans** (`bool`)
- **Records** (`(value1, value2)`)
- **Functions** (`Function`)
- **Lists** (`List`, also known as arrays)
- **Sets** (`Set`)
- **Maps** (`Map`)
- **Runes** (`Runes`; often replaced by the `characters` API)
- **Symbols** (`Symbol`)
- **The value null** (`Null`)

## Numbers

Dart numbers come in two flavors:

- **`int`** — Integer values no larger than 64 bits, platform-dependent
- **`double`** — 64-bit floating-point numbers (IEEE 754 standard)

```dart
int x = 1;
int hex = 0xDEADBEEF;
double y = 1.1;
double exponents = 1.42e5;
```

All numbers are subtypes of `num`. You can convert between types:

```dart
// String -> int
var one = int.parse('1');
// String -> double
var onePointOne = double.parse('1.1');
// int -> String
String oneAsString = 1.toString();
// double -> String
String piAsString = 3.14159.toStringAsFixed(2); // '3.14'
```

## Strings

A Dart string is a sequence of UTF-16 code units. You can use either single or double quotes:

```dart
var s1 = 'Single quotes work well for string literals.';
var s2 = "Double quotes work just as well.";
```

String interpolation:

```dart
var s = 'string interpolation';
assert('Dart has $s, which is very handy.' ==
    'Dart has string interpolation, which is very handy.');
```

Multiline strings:

```dart
var s1 = '''
You can create
multi-line strings like this one.
''';
```

Raw strings:

```dart
var s = r'In a raw string, not even \n gets special treatment.';
```

## Booleans

```dart
bool isTrue = true;
bool isFalse = false;
```

Dart's type safety means you can't use code like `if (nonbooleanValue)` or `assert (nonbooleanValue)`. Instead, explicitly check for values:

```dart
// Check for an empty string.
var fullName = '';
assert(fullName.isEmpty);

// Check for zero.
var hitPoints = 0;
assert(hitPoints <= 0);

// Check for null.
var unicorn;
assert(unicorn == null);

// Check for NaN.
var iMeantToDoThis = 0 / 0;
assert(iMeantToDoThis.isNaN);
```

## Lists

In Dart, arrays are `List` objects:

```dart
var list = [1, 2, 3];
```

Lists use zero-based indexing. See `collections.md` for more detail.

## Sets

A set in Dart is an unordered collection of unique items:

```dart
var halogens = {'fluorine', 'chlorine', 'bromine', 'iodine', 'astatine'};
```

See `collections.md` for more detail.

## Maps

A map is an object that associates keys and values:

```dart
var gifts = {
  'first': 'partridge',
  'second': 'turtledoves',
  'fifth': 'golden rings'
};
```

See `collections.md` for more detail.

## Runes and Grapheme Clusters

In Dart, runes expose the Unicode code points of a string. You can use the `characters` package to manipulate strings at the grapheme cluster level:

```dart
import 'package:characters/characters.dart';

var hi = 'Hi 🇩🇰';
print(hi);              // 'Hi 🇩🇰'
print(hi.runes.length); // 6
print(hi.characters.length); // 4 (with characters package)
```

## Symbols

A `Symbol` object represents an operator or identifier declared in a Dart program:

```dart
#radix
#bar
```

## Special Types

- **`Object`** — The superclass of all Dart classes except `Null`
- **`Enum`** — The superclass of all enums
- **`Future` and `Stream`** — Used in asynchronous programming
- **`Iterable`** — Used in for-in loops and synchronous generator functions
- **`Never`** — Indicates that an expression can never finish evaluating (always throws)
- **`dynamic`** — Disables static checking (prefer `Object` or `Object?`)
- **`void`** — Indicates that a value is never used (often a return type)

The `Object`, `Object?`, `Null`, and `Never` classes have special roles in the class hierarchy.
