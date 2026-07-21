# Iterable Collections

An interactive guide to using Iterable objects such as lists and sets.

## What is an Iterable?

A collection is an object that represents a group of objects, which are called elements. Iterables are a kind of collection.

Common collection types:

- **List** — Used to read elements by their indexes
- **Set** — Used to contain elements that can occur only once
- **Map** — Used to read elements using a key

All of these implement the `Iterable` interface.

## Reading elements

### Using the `first` and `last` properties

```dart
Iterable<int> iterable = [1, 2, 3];
print(iterable.first); // 1
print(iterable.last);  // 3
```

### Using `firstWhere()`

```dart
List<String> items = ['apple', 'banana', 'cherry'];
String firstLong = items.firstWhere(
  (item) => item.length > 5,
  orElse: () => 'none',
);
print(firstLong); // banana
```

### Using a `for-in` loop

```dart
for (var item in items) {
  print(item);
}
```

### Using `map()`

The `map()` method transforms each element and returns a new `Iterable`:

```dart
var numbers = [1, 2, 3];
var doubled = numbers.map((n) => n * 2);
print(doubled.toList()); // [2, 4, 6]
```

### Using `where()`

The `where()` method filters elements based on a condition:

```dart
var numbers = [1, 2, 3, 4, 5, 6];
var evens = numbers.where((n) => n.isEven);
print(evens.toList()); // [2, 4, 6]
```

### Using `take()` and `skip()`

```dart
var numbers = [1, 2, 3, 4, 5];
print(numbers.take(2).toList());  // [1, 2]
print(numbers.skip(2).toList());  // [3, 4, 5]
```

## Checking conditions

### `any()`

Returns `true` if at least one element satisfies the condition:

```dart
var numbers = [1, 2, 3, 4, 5];
print(numbers.any((n) => n > 3)); // true
```

### `every()`

Returns `true` if all elements satisfy the condition:

```dart
var numbers = [2, 4, 6, 8];
print(numbers.every((n) => n.isEven)); // true
```

### `contains()`

```dart
var fruits = ['apple', 'banana'];
print(fruits.contains('apple')); // true
```

## Filtering and transforming

### `expand()`

Expands each element into multiple elements:

```dart
var pairs = [[1, 2], [3, 4]];
var flattened = pairs.expand((pair) => pair);
print(flattened.toList()); // [1, 2, 3, 4]
```

### `fold()`

Combines all elements into a single value:

```dart
var numbers = [1, 2, 3, 4];
var sum = numbers.fold(0, (prev, element) => prev + element);
print(sum); // 10
```

### `reduce()`

Combines elements using a function (without initial value):

```dart
var numbers = [1, 2, 3, 4];
var sum = numbers.reduce((prev, element) => prev + element);
print(sum); // 10
```

### `join()`

Joins elements into a string:

```dart
var words = ['Hello', 'World'];
print(words.join(' ')); // Hello World
```

## Converting

### `toList()` and `toSet()`

```dart
var iterable = [1, 2, 2, 3, 3, 3];
var list = iterable.toList();
var set = iterable.toSet();
print(list); // [1, 2, 2, 3, 3, 3]
print(set);  // {1, 2, 3}
```

## Lazy evaluation

Iterables are lazy — the elements are computed only when needed. This means methods like `map()` and `where()` don't process elements until you iterate over the result:

```dart
var numbers = [1, 2, 3];
var mapped = numbers.map((n) {
  print('processing $n');
  return n * 2;
});
// Nothing printed yet!
print(mapped.toList()); // Now processes all elements
```
