# Null Safety

The Dart language enforces sound null safety, making it impossible to unintentionally access a member on a `null` value.

In Dart, types are non-nullable by default. Variables of non-nullable types must be initialized and can only be assigned non-null values.

## Non-Nullable by Default

```dart
// None of these can ever be null.
var i = 42;                    // Inferred to be an int.
String name = getFileName();   // String, not nullable
final b = Foo();               // Foo, not nullable
```

## Nullable Types

Add `?` to make a type nullable:

```dart
int? aNullableInt = null;
String? maybeString;
```

## Null Assertion Operator (`!`)

Use `!` to assert that a nullable expression is not null:

```dart
int? maybeInt = 5;
int definitelyInt = maybeInt!; // Throws if maybeInt is null
```

## Null-Aware Operators

### `?.` — Null-aware access

```dart
String? name;
int? length = name?.length; // null if name is null
```

### `??` — Null-aware coalescing

```dart
String name = maybeName ?? 'default';
```

### `??=` — Null-aware assignment

```dart
var value;
value ??= 'default'; // Only assigns if value is null
```

### `?..` — Null-aware cascade

```dart
var paint = Paint()
  ?..color = Colors.black
  ..strokeWidth = 5.0;
```

## Type Promotion

The analyzer promotes nullable types to non-nullable when it can prove safety:

```dart
String? maybeString = 'hello';

if (maybeString != null) {
  // maybeString is promoted to String here
  print(maybeString.length);
}
```

### Promotion with `is`

```dart
Object value = 'hello';
if (value is String) {
  // value is promoted to String
  print(value.length);
}
```

### Promotion Failures

Promotion can fail for:
- Instance fields (analyzer can't guarantee they haven't changed)
- Captured local variables in closures
- Variables reassigned after the null check

## Late Variables

Use `late` for variables that are initialized after declaration but before use:

```dart
late String description;

void main() {
  description = 'Hello';
  print(description);
}
```

`late` with an initializer is lazy:

```dart
late int value = _expensiveComputation();
```

## Required Named Parameters

Named parameters are optional by default. Use `required` to make them non-nullable and mandatory:

```dart
void scrollTo({required int x, required int y}) {
  // x and y are guaranteed non-null
}
```

## Null Safety Design Principles

1. **Non-nullable by default** — Unless you explicitly say a variable can be null, it can't be
2. **Fully sound** — If the type system says a value is non-nullable, it's guaranteed at runtime
3. **Incremental migration** — Dart 2.12 allowed gradual migration; Dart 3 requires null safety

## Benefits

- **Fewer bugs** — null reference errors caught at compile time
- **Smaller binaries** — compiler can optimize away null checks
- **Faster execution** — fewer runtime null checks needed
- **Better DX** — IDEs can provide better autocomplete and warnings

## Common Patterns

### Default Values

```dart
int computeValue(int? input) {
  return input ?? 0;
}
```

### Early Return

```dart
void process(String? data) {
  if (data == null) return;
  // data is promoted to String
  print(data.length);
}
```

### Null-Check Pattern (Dart 3.0+)

```dart
void process(String? data) {
  if (data case String s) {
    print(s.length);
  }
}
```

### Nullable Collections

```dart
List<int?>? maybeList; // Can be null, and can contain nulls
List<int>? maybeList2; // Can be null, but elements are non-null
List<int?> maybeList3; // Can't be null, but elements can be null
```

## Migration to Null Safety

Dart has enforced sound null safety since Dart 3 (May 2023). For migration help, see the [dart-community/migrate-to-null-safety](https://github.com/dart-community/migrate-to-null-safety) repository.
