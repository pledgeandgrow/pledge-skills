# Collections

Dart has built-in support for list, set, and map collections.

## Lists

Arrays are `List` objects in Dart. List literals are denoted by comma-separated elements enclosed in square brackets:

```dart
var list = [1, 2, 3];
```

Dart infers that `list` has type `List<int>`. Lists use zero-based indexing:

```dart
var list = [1, 2, 3];
assert(list.length == 3);
assert(list[1] == 2);

list[1] = 1;
assert(list[1] == 1);
```

Constant lists:

```dart
var constantList = const [1, 2, 3];
// constantList[1] = 1; // Error
```

## Sets

A set is an unordered collection of unique items:

```dart
var halogens = {'fluorine', 'chlorine', 'bromine', 'iodine', 'astatine'};
```

To create an empty set, specify the type or use `{}` with a type argument:

```dart
var names = <String>{};
// var names = {}; // This creates a Map, not a Set!
```

Add items to a set:

```dart
var elements = <String>{};
elements.add('fluorine');
elements.addAll(halogens);
```

Check set membership:

```dart
assert(elements.contains('fluorine'));
```

Constant sets:

```dart
final constantSet = const {
  'fluorine',
  'chlorine',
  'bromine',
  'iodine',
  'astatine',
};
```

## Maps

A map is an object that associates keys and values:

```dart
var gifts = {
  'first': 'partridge',
  'second': 'turtledoves',
  'fifth': 'golden rings'
};

var nobleGases = {
  2: 'helium',
  10: 'neon',
  18: 'argon',
};
```

Create an empty map:

```dart
var gifts = <String, String>{};
var nobleGases = <int, String>{};
```

Add key-value pairs:

```dart
gifts['first'] = 'partridge';
gifts['fourth'] = 'calling birds';
```

Retrieve a value:

```dart
assert(gifts['first'] == 'partridge');
```

If a key isn't in the map, `null` is returned:

```dart
assert(gifts['fifth'] == null);
```

Use `.length` to get the number of key-value pairs:

```dart
assert(gifts.length == 2);
```

## Spread Operators

Use `...` to insert all elements of a collection into another:

```dart
var list = [1, 2, 3];
var list2 = [0, ...list]; // [0, 1, 2, 3]
```

Null-aware spread (`...?`) avoids exceptions when the expression to the right might be null:

```dart
var list2 = [0, ...?nullableList];
```

## Collection If

Dart supports `if` inside collection literals:

```dart
var nav = [
  'Home',
  'Furniture',
  'Plants',
  if (promoActive) 'Outlet'
];
```

## Collection For

Dart supports `for` inside collection literals:

```dart
var listOfStrings = [
  for (var i in listOfInts) '#$i'
];
```

## Operators on Collections

### List

- `list.add(value)` — Add one element
- `list.addAll(iterable)` — Add multiple elements
- `list.indexOf(value)` — Find index of element
- `list.removeAt(index)` — Remove by index
- `list.insert(index, value)` — Insert at index
- `list.sublist(start, [end])` — Get a sublist
- `list.reversed` — Get reversed iterable
- `list.sort()` — Sort in place
- `list.shuffle()` — Shuffle in place
- `list.asMap()` — Get map of index to value

### Set

- `set.add(value)` — Add element
- `set.addAll(iterable)` — Add multiple
- `set.contains(value)` — Check membership
- `set.intersection(other)` — Set intersection
- `set.union(other)` — Set union
- `set.difference(other)` — Set difference

### Map

- `map.containsKey(key)` — Check key
- `map.containsValue(value)` — Check value
- `map.putIfAbsent(key, ifAbsent)` — Add if missing
- `map.update(key, update)` — Update value
- `map.remove(key)` — Remove by key
- `map.keys` / `map.values` — Get keys/values
- `map.entries` — Get map entries
