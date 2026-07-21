# Introduction to Dart

Dart is a client-optimized language for fast apps on any platform. It is object-oriented, class-based, and garbage-collected with C-style syntax.

## Hello World

Every app requires the top-level `main()` function, where execution starts. Functions that don't explicitly return a value have the `void` return type:

```dart
void main() {
  print('Hello, World!');
}
```

## Variables

Even in type-safe Dart code, you can declare most variables without explicitly specifying their type using `var`. Thanks to type inference, these variables' types are determined by their initial values:

```dart
var name = 'Voyager I';
var year = 1977;
var antennaDiameter = 3.7;
var flybyObjects = ['Jupiter', 'Saturn', 'Uranus', 'Neptune'];
var image = {
  'tags': ['saturn'],
  'url': '//path/to/saturn.jpg',
};
```

## Control Flow

Dart supports the usual control flow statements:

```dart
if (year >= 2001) {
  print('21st century');
} else if (year >= 1901) {
  print('20th century');
}

for (final object in flybyObjects) {
  print(object);
}

for (int month = 1; month <= 12; month++) {
  print(month);
}

while (year < 2016) {
  year += 1;
}
```

## Functions

```dart
int fibonacci(int n) {
  if (n == 0 || n == 1) return n;
  return fibonacci(n - 2) + fibonacci(n - 1);
}

var result = fibonacci(20);
```

## Imports

```dart
// Importing core libraries
import 'dart:math';

// Importing external packages
import 'package:test/test.dart';

// Importing a file
import 'package:my_app/src/utils.dart';
```

## Classes

Dart is an object-oriented language with classes and mixin-based inheritance:

```dart
class Spacecraft {
  String name;
  DateTime? launchDate;

  Spacecraft(this.name, this.launchDate);

  int? get launchYear => launchDate?.year;

  void describe() {
    print('Spacecraft: $name');
    if (launchDate != null) {
      int years = DateTime.now().difference(launchDate!).inDays ~/ 365;
      print('Launched: $launchYear ($years years ago)');
    } else {
      print('Not launched yet');
    }
  }
}
```

## Inheritance

```dart
class Orbiter extends Spacecraft {
  double altitude;

  Orbiter(String name, DateTime launchDate, this.altitude)
      : super(name, launchDate);

  @override
  void describe() {
    super.describe();
    print('Altitude: $altitude km');
  }
}
```

## Mixins

Mixins are a way to reuse code across class hierarchies:

```dart
mixin Piloted {
  int astronauts = 1;

  void describeCrew() {
    print('Number of astronauts: $astronauts');
  }
}

class PilotedCraft extends Spacecraft with Piloted {
  // ...
}
```

## Interfaces and Abstract Classes

Dart has no `interface` keyword; every class implicitly defines an interface:

```dart
class MockSpaceship implements Spacecraft {
  @override
  String name = 'Mock';

  @override
  DateTime? launchDate;

  @override
  int? get launchYear => launchDate?.year;

  @override
  void describe() {
    print('Mock spacecraft');
  }
}
```

## Async

Use `async` and `await` for asynchronous programming:

```dart
Future<void> printWithDelay(String message) async {
  await Future.delayed(Duration(seconds: 1));
  print(message);
}
```

## Key Characteristics

- **Client-optimized** — optimized for UI development (Flutter)
- **Sound null safety** — non-nullable by default since Dart 3
- **AOT compilation** — compiles to native ARM/x64, JS, and WasmGC
- **Type inference** — types inferred from initializers
- **Object-oriented** — classes, mixins, extension methods
- **Concurrency** — isolates with independent memory
- **Pattern matching** — records, patterns, switch expressions (Dart 3+)

## Platform Support

| Platform | Compilation | Use Case |
|----------|------------|----------|
| Native (ARM/x64) | AOT | Mobile (Flutter), desktop, server |
| JavaScript | dart2js / dart compile js | Web apps |
| WebAssembly (WasmGC) | dart compile wasm | Web apps (newer) |
| VM (JIT) | dart run | Development, CLI tools |

## Dart Versions

| Version | Year | Key Features |
|---------|------|-------------|
| 2.0 | 2018 | Sound type system |
| 2.12 | 2021 | Sound null safety |
| 3.0 | 2023 | Records, patterns, sealed classes, class modifiers |
| 3.2 | 2023 | WasmGC support (stable) |
| 3.4 | 2024 | Extension types |
| 3.5 | 2024 | Primary constructors |
| 3.7 | 2025 | Dot shorthands |
| 3.12 | 2026 | Latest stable |

## License

Dart is licensed under a [3-Clause BSD License](https://opensource.org/licenses/BSD-3-Clause).
