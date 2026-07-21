# Class Modifiers

Class modifiers control how a class or mixin can be used, both from within its own library, and from outside the library where it's defined.

Class modifiers (besides `abstract`) require a language version of at least 3.0.

## Available Modifiers

| Modifier | Description |
|----------|-------------|
| `abstract` | Can't be directly instantiated; must be extended |
| `base` | Can only be extended (not implemented) from outside its library |
| `final` | Can't be extended or implemented from outside its library |
| `interface` | Can only be implemented (not extended) from outside its library |
| `sealed` | Can't be extended or implemented from outside its library; all subtypes must be in the same library |
| `mixin` | Declared with `mixin` keyword; can be mixed in with `with` |

## No Modifier (Default)

Without a modifier, a class can be:
- Constructed (new instances)
- Extended (create subtypes)
- Implemented (implement its interface)
- Mixed in (if it's a mixin or mixin class)

## abstract

```dart
abstract class Animal {
  void makeSound(); // Abstract method
}

class Dog extends Animal {
  @override
  void makeSound() => print('Woof!');
}
```

Can be extended and implemented from any library, but can't be instantiated directly.

## base

```dart
base class Animal {
  void makeSound() => print('...');
}

// OK in same library
class Dog extends Animal {}

// In another library:
// class Cat extends Animal {} // OK - can extend
// class Cat implements Animal {} // ERROR - can't implement
```

`base` ensures the library's implementation is inherited, preventing external code from implementing the interface without inheriting the implementation.

## interface

```dart
interface class Animal {
  void makeSound() => print('...');
}

// In another library:
// class Dog extends Animal {} // ERROR - can't extend
class Dog implements Animal {} // OK - can implement
```

`interface` allows external libraries to implement the type but prevents them from extending the implementation.

## final

```dart
final class Animal {
  void makeSound() => print('...');
}

// In another library:
// class Dog extends Animal {} // ERROR
// class Dog implements Animal {} // ERROR
```

`final` completely prevents subtyping from outside the library. Use when you want to ensure no one can create subtypes.

## sealed

```dart
sealed class Shape {}

class Circle extends Shape {}
class Square extends Shape {}
class Triangle extends Shape {}
```

`sealed` means:
- All direct subtypes must be in the same library
- No external subtypes allowed
- Enables exhaustive switch checking (the analyzer knows all subtypes)

## abstract interface

```dart
abstract interface class Animal {
  void makeSound();
}
```

Can be implemented (from any library) but can't be instantiated or extended.

## abstract base

```dart
abstract base class Animal {
  void makeSound();
}
```

Can be extended (from any library) but can't be instantiated or implemented.

## abstract final

```dart
abstract final class Animal {
  void makeSound();
}
```

Can't be instantiated, extended, or implemented from outside the library. Useful for grouping static members.

## mixin

```dart
mixin Musical {
  void playMusic() => print('Playing');
}

class Musician with Musical {}
```

Only `base` can modify a mixin declaration:

```dart
base mixin Musical {
  void playMusic() => print('Playing');
}
```

## mixin class

```dart
mixin class Musical {
  void playMusic() => print('Playing');
}

// Can be extended
class Singer extends Musical {}

// Or mixed in
class Band with Musical {}
```

## Modifier Combinations

| Combination | Extend | Implement | Mix In | Instantiate |
|-------------|--------|-----------|--------|-------------|
| (none) | Yes | Yes | No | Yes |
| `abstract` | Yes | Yes | No | No |
| `base` | Yes | No | No | Yes |
| `interface` | No | Yes | No | Yes |
| `final` | No | No | No | Yes |
| `sealed` | Same lib only | Same lib only | No | No |
| `abstract base` | Yes | No | No | No |
| `abstract interface` | No | Yes | No | No |
| `abstract final` | No | No | No | No |
| `mixin` | No | No | Yes | No |
| `mixin class` | Yes | Yes | Yes | Yes |
| `base mixin` | No | No | Yes | No |
| `base mixin class` | Yes | No | Yes | Yes |

## When to Use Class Modifiers

- **`base`** — When you want to ensure implementation is always inherited
- **`interface`** — When you want to define a contract without coupling to implementation
- **`final`** — When you want to prevent all subtyping
- **`sealed`** — When you want exhaustive pattern matching over a closed set of types
- **`abstract`** — When you want to define a partial implementation that must be completed by subclasses
