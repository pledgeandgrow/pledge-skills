# Generics

If you look at the API documentation for the basic array type, `List`, you'll see that the type is actually `List<E>`. The `<...>` notation marks `List` as a generic (or parameterized) type.

By convention, most type variables have single-letter names, such as `E`, `T`, `S`, `K`, and `V`.

## Why Use Generics

Generics are often required for type safety, but they have more benefits:

- Properly specifying generic types results in better generated code.
- You can use generics to reduce code duplication.

```dart
var names = <String>[];
names.addAll(['Seth', 'Kathy', 'Lars']);
names.add(42); // Error
```

Generic types can save you from creating multiple type-specific interfaces:

```dart
abstract class Cache<T> {
  T getByKey(String key);
  void setByKey(String key, T value);
}
```

## Using Collection Literals

List, set, and map literals can be parameterized:

```dart
var names = <String>['Seth', 'Kathy', 'Lars'];
var uniqueNames = <String>{'Seth', 'Kathy', 'Lars'};
var pages = <String, String>{
  'index.html': 'Homepage',
  'robots.txt': 'Hints for web robots',
  'humans.txt': 'We are people, not machines',
};
```

## Using Generic Constructors

To specify one or more types when using a generic constructor, put the types in angle brackets after the class name:

```dart
var nameSet = Set<String>.from(names);
var views = Map<int, View>();
```

## Generic Collections and the types they contain

Dart generic types are **reified**, meaning generic type information is available at runtime:

```dart
var names = <String>['Seth', 'Kathy', 'Lars'];
assert(names is List<String>);
```

## Restricting the Parameterized Type

Use `extends` to restrict the type parameter:

```dart
class Foo<T extends SomeBaseClass> {
  // Implementation goes here...
  String toString() => "Instance of Foo<$T>";
}
```

## Using Generic Methods

Dart supports generic methods:

```dart
T first<T>(List<T> ts) {
  // ...
  return ts[0];
}
```

## Generic Type Aliases

You can create type aliases for generic types:

```dart
typedef ListMapper<X> = Map<X, List<X>>;

var m = ListMapper<int>();
```

## Covariance

Dart generic types are covariant by default. This means a `List<Animal>` can accept a `List<Dog>` where `Dog` extends `Animal`:

```dart
class Animal {}
class Dog extends Animal {}

void main() {
  List<Animal> animals = <Animal>[];
  List<Dog> dogs = <Dog>[];
  animals = dogs; // OK - covariant
}
```

Use the `covariant` keyword to allow narrowing parameter types in overrides:

```dart
class Animal {}
class Dog extends Animal {}

class AnimalShelter {
  void accept(Animal a) {}
}

class DogShelter extends AnimalShelter {
  @override
  void accept(covariant Dog d) {}
}
```
