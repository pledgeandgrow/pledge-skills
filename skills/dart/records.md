# Records

Records require a language version of at least 3.0.

Records are an anonymous, immutable, aggregate type. Like other collection types, they let you bundle multiple objects into a single object. Unlike other collection types, records are fixed-sized, heterogeneous, and typed.

Records are real values; you can store them in variables, nest them, pass them to and from functions, and store them in data structures such as lists, maps, and sets.

## Record Syntax

Record expressions are comma-delimited lists of named or positional fields, enclosed in parentheses:

```dart
var record = ('first', a: 2, b: true, 'last');
```

Record type annotations are comma-delimited lists of types enclosed in parentheses:

```dart
(int, int) swap((int, int) record) {
  var (a, b) = record;
  return (b, a);
}
```

## Positional Fields

Positional fields go directly inside the parentheses:

```dart
// Record type annotation in a variable declaration:
(String, int) record;

// Initialize it with a record expression:
record = ('A string', 123);
```

## Named Fields

Named fields go inside a curly brace-delimited section of type-and-name pairs, after all positional fields:

```dart
// Record type annotation in a variable declaration:
({int a, bool b}) record;

// Initialize it with a record expression:
record = (a: 123, b: true);
```

The names of named fields in a record type are part of the record's type definition, or its **shape**. Two records with named fields with different names have different types:

```dart
({int a, int b}) recordAB = (a: 1, b: 2);
({int x, int y}) recordXY = (x: 3, y: 4);

// Compile error! These records don't have the same type.
// recordAB = recordXY;
```

In a record type annotation, you can also name the positional fields, but these names are purely for documentation and don't affect the record's type:

```dart
(int a, int b) recordAB = (1, 2);
(int x, int y) recordXY = (3, 4);

recordAB = recordXY; // OK. Positional names don't matter.
```

## Accessing Fields

Positional fields are accessed using the `$<position>` getter:

```dart
var record = ('first', a: 2, b: true, 'last');
print(record.$0); // Prints 'first'
print(record.$1); // Prints 'last'
```

Named fields are accessed using their name:

```dart
print(record.a); // Prints 2
print(record.b); // Prints true
```

## Record Type

The record type annotation is the full set of types of all fields, in order:

```dart
// (String, int) is the type
(String, int) record = ('A string', 123);
```

## Record Equality

Two records are equal if they have the same shape (same set of fields) and all corresponding field values are equal:

```dart
(int x, int y, int z) point = (1, 2, 3);
(int r, int g, int b) color = (1, 2, 3);

print(point == color); // true
```

Named fields are compared by name:

```dart
({int x, int y, int z}) point = (x: 1, y: 2, z: 3);
({int r, int g, int b}) color = (r: 1, g: 2, b: 3);

print(point == color); // false - different named fields
```

## Destructuring Records

Records can be destructured using patterns:

```dart
var (name, age) = ('Alice', 30);
print('$name is $age years old');

// With named fields
var (name: n, age: a) = (name: 'Alice', age: 30);
print('$n is $a years old');

// Shorthand syntax
var (:name, :age) = (name: 'Alice', age: 30);
```

## Use Cases

- **Multiple return values** — return several values from a function without a wrapper class
- **Grouping related values** — lightweight alternative to small classes
- **Pattern matching** — works seamlessly with switch expressions and if-case
