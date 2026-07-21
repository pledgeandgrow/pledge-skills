# Libraries & Imports

The `import` and `library` directives help you create a modular and shareable code base. Libraries not only provide APIs, but are a unit of privacy: identifiers that start with an underscore (`_`) are visible only inside the library.

Every Dart file (plus its parts) is a library, even if it doesn't use a `library` directive.

## Using Libraries

### Importing Built-in Libraries

```dart
import 'dart:html';
import 'dart:math';
```

### Importing Package Libraries

```dart
import 'package:test/test.dart';
```

### Importing File Libraries

```dart
import 'package:my_app/src/utils.dart';
import '../lib/utils.dart';
```

## Specifying a Library Prefix

If you import two libraries that have conflicting identifiers, specify a prefix:

```dart
import 'package:lib1/lib1.dart';
import 'package:lib2/lib2.dart' as lib2;

// Uses Element from lib1.
Element element1 = Element();

// Uses Element from lib2.
lib2.Element element2 = lib2.Element();
```

## Importing Only Part of a Library

```dart
// Import only foo.
import 'package:lib1/lib1.dart' show foo;

// Import all names EXCEPT foo.
import 'package:lib2/lib2.dart' hide foo;
```

## Lazily Loading a Library

Deferred loading (lazy loading) allows a web app to load a library only when needed:

```dart
import 'package:greetings/hello.dart' deferred as hello;
```

Use the library after loading it:

```dart
Future<void> greet() async {
  await hello.loadLibrary();
  hello.printGreeting();
}
```

## The library Directive

The `library` directive can name a library:

```dart
library my_lib;
```

## Parts and Part Files

Use `part` to split a library across multiple files:

```dart
// In my_lib.dart
library my_lib;
part 'src/part1.dart';
part 'src/part2.dart';
```

```dart
// In src/part1.dart
part of '../my_lib.dart';
```

## Privacy

Dart uses underscores instead of access modifier keywords like `public`, `protected`, or `private`:

- Identifiers starting with `_` are library-private
- Privacy is at the library level, not the class level

```dart
// In my_lib.dart
String _privateVar = 'private'; // Only visible in this library
String publicVar = 'public';    // Visible everywhere
```

## Exporting

Use `export` to re-export all names from a library:

```dart
// In my_package.dart
export 'src/implementation.dart';
```

## The library Directive (Dart 3.0+)

Dart 3.0+ supports a more flexible `library` directive:

```dart
library;

// Or with a name:
library my_package;
```

## Configuration-Specific Imports

Use conditional imports to import different libraries based on the platform:

```dart
import 'default_impl.dart'
    if (dart.library.html) 'web_impl.dart'
    if (dart.library.io) 'io_impl.dart';
```

## Import Directives Summary

| Directive | Purpose |
|-----------|---------|
| `import 'uri'` | Import a library |
| `import 'uri' as prefix` | Import with a prefix |
| `import 'uri' show name1, name2` | Import only specific names |
| `import 'uri' hide name1, name2` | Import all except specific names |
| `import 'uri' deferred as prefix` | Defer loading (web only) |
| `export 'uri'` | Re-export a library |
| `part 'uri'` | Include a part file |
| `part of 'uri'` | Declare as part of a library |
