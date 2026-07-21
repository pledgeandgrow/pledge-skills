# Typedefs

A type alias — or typedef — is a shorthand way to refer to a type.

## Function Type Aliases

```dart
typedef IntList = List<int>;
IntList il = [1, 2, 3];
```

Type aliases can also refer to function types:

```dart
typedef Compare<T> = int Function(T a, T b);

int sort(int a, int b) => a - b;

void main() {
  assert(sort is Compare<int>); // True!
}
```

## Type Aliases for Function Types

Most functions can be written using explicit function types:

```dart
class SortedCollection {
  Function compare;

  SortedCollection(this.compare);
}

// Initial, broken implementation.
int sort(Object a, Object b) => 0;
```

Using a typedef makes the intent clearer:

```dart
typedef Compare = int Function(Object a, Object b);

class SortedCollection {
  Compare compare;

  SortedCollection(this.compare);
}
```

## Generic Type Aliases

Type aliases can be generic:

```dart
typedef ListMapper<X> = Map<X, List<X>>;

Map<String, List<String>> m1 = {};
ListMapper<String> m2 = {};
```

## New Type Aliases (Dart 3.0+)

Dart 3.0 introduced a new syntax for type aliases that supports more types:

```dart
// Alias for a record type
typedef Point = ({int x, int y});

// Alias for a nullable type
typedef IntOrNull = int?;
```

## When to Use Typedefs

- To give descriptive names to complex function types
- To create shorthand for frequently used generic types
- To document the intended use of a type
- To make refactoring easier (change the alias, not every usage)
