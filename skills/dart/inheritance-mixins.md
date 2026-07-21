# Inheritance & Mixins

## Extending a Class

Use `extends` to create a subclass, and `super` to refer to the superclass:

```dart
class Television {
  void turnOn() {
    _illuminateDisplay();
    _activateIrSensor();
  }
}

class SmartTelevision extends Television {
  void turnOn() {
    super.turnOn();
    _bootNetworkInterface();
    _initializeMemory();
    _upgradeApps();
  }
}
```

## Overriding Members

Subclasses can override instance methods, getters, and setters. Use `@override`:

```dart
class Television {
  set contrast(int value) {
    // ...
  }
}

class SmartTelevision extends Television {
  @override
  set contrast(num value) {
    // Parameter type can be a supertype
    // ...
  }
}
```

Overriding rules:
- Return type must be the same type or a subtype
- Parameter types must be the same type or a supertype
- If the overridden method accepts n positional parameters, the overriding method must also accept n positional parameters
- A generic method can't override a non-generic one, and vice versa

## covariant Keyword

Use `covariant` to narrow a parameter type in an override (can cause runtime type errors):

```dart
class AnimalShelter {
  void accept(Animal a) {}
}

class DogShelter extends AnimalShelter {
  @override
  void accept(covariant Dog d) {}
}
```

## Overriding == and hashCode

If you override `==`, also override `hashCode`:

```dart
class Person {
  final String name;
  final int age;

  Person(this.name, this.age);

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Person && name == other.name && age == other.age;

  @override
  int get hashCode => Object.hash(name, age);
}
```

## Mixins

Mixins are a way of defining code that can be reused in multiple class hierarchies:

```dart
class Musician extends Performer with Musical {
  // ...
}

class Maestro extends Person with Musical, Aggressive, Demented {
  Maestro(String maestroName) {
    name = maestroName;
    canConduct = true;
  }
}
```

### Defining Mixins

Use the `mixin` declaration:

```dart
mixin Musical {
  bool canPlayPiano = false;
  bool canCompose = false;
  bool canConduct = false;

  void entertainMe() {
    if (canPlayPiano) {
      print('Playing piano');
    } else if (canConduct) {
      print('Waving hands');
    } else {
      print('Humming to self');
    }
  }
}
```

Mixins and mixin classes cannot have an `extends` clause, and must not declare any generative constructors.

### Mixin with Abstract Methods

```dart
mixin Musician {
  void playInstrument(String instrumentName); // Abstract method

  void playPiano() => playInstrument('Piano');
  void playFlute() => playInstrument('Flute');
}

class Virtuoso with Musician {
  @override
  void playInstrument(String instrumentName) {
    print('Plays the $instrumentName beautifully');
  }
}
```

### The on Clause

Use `on` to declare a superclass constraint on a mixin:

```dart
mixin Musician on Performer {
  void playPiano() {
    perform();
    // ...
  }
}

class SingerPerformer extends Performer with Musician {
  // ...
}
```

### Mixin Class

Use `mixin class` to define both a mixin and a class:

```dart
mixin class Musician {
  // Can be used as a class (with extends) or a mixin (with with)
}
```

### class, mixin, or mixin class?

| Declaration | Can be extended? | Can be mixed in? | Can be implemented? |
|-------------|-----------------|-----------------|-------------------|
| `class` | Yes | No | Yes |
| `mixin` | No | Yes | No |
| `mixin class` | Yes | Yes | Yes |
| `abstract class` | Yes | No | Yes |
| `abstract mixin class` | Yes | Yes | Yes |

## Implementing Interfaces

Every class implicitly defines an interface. Use `implements` to implement it:

```dart
class Person {
  final String name;
  Person(this.name);

  String greet(String who) => 'Hello, $who.';
}

class Impostor implements Person {
  final String name = '';

  String greet(String who) => 'Hi $who.';
}
```

You can implement multiple interfaces:

```dart
class MultiImpl implements A, B, C {
  // Must implement all members of A, B, and C
}
```
