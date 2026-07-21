# Effective Dart

Best practices for building consistent, maintainable, and efficient Dart libraries.

## Overarching Themes

1. **Be consistent** — When it comes to formatting and casing, arguments about which is better are subjective. Being consistent is objectively helpful.
2. **Be brief** — Dart was designed to be familiar but improved. Use features like string interpolation and initializing formals to express intent more simply.

## Style Guide

### Names

- Use `UpperCamelCase` for type names (classes, enums, typedefs, type parameters)
- Use `lowerCamelCase` for other identifiers (variables, parameters, function names, constants)
- Prefer `lowerCamelCase` for constant variables, even when using `static const`
- Use `lowercase_with_underscores` for package names, directories, source files, and import prefixes

```dart
// Good
class SliderMenu { ... }
class HttpRequest { ... }
typedef Predicate<T> = bool Function(T value);

const defaultTimeout = 1000;
final urlScheme = RegExp('^https://');

// Files
my_package.dart
http_connection.dart
```

### Ordering

- Keep imports ordered: `dart:` first, then `package:`, then relative
- Use `package:` imports for files within `lib/`
- Use relative imports for files outside `lib/`
- Don't import files from `src/` of other packages

### Formatting

- Use `dart format` to format code
- Put the `>` at the end of multi-line generic types
- Put the `)` at the end of multi-line function/constructor calls
- Use trailing commas for multi-line collection/call literals

## Documentation

### Comments

- **DO** format comments like sentences
- **DON'T** use block comments (`/* */`) for documentation; use `///`
- **DO** use `///` doc comments to document members and types
- **DO** put doc comments before metadata annotations

```dart
/// The number of characters in this chunk.
///
/// The value is always greater than zero.
@override
int get length => _content.length;
```

### Writing Doc Comments

- **DO** use prose to explain what members do
- **PREFER** starting doc comments with a third-person verb
- **CONSIDER** including code samples in doc comments
- **AVOID** redundant mentioning of parameter names

```dart
/// Deletes the file at [path] from the filesystem.
///
/// Throws an [IOException] if the file cannot be found.
/// Returns `true` if the file was deleted, `false` otherwise.
bool deleteFile(String path) { ... }
```

### Markdown

- **AVOID** using markdown excessively
- **PREFER** brief, clear prose over elaborate formatting
- **DO** use `[code references]` to link to identifiers

## Usage Guide

### Strings

- **DO** use adjacency to concatenate string literals
- **PREFER** using interpolation to compose strings and values
- **AVOID** using curly braces in interpolation when not needed

```dart
// Good
'Hello, $name! Your score is ${score.toStringAsFixed(2)}.'

// Bad
'Hello, ' + name + '! Your score is ' + score.toStringAsFixed(2) + '.'
```

### Collections

- **DO** use collection literals when possible
- **DON'T** use `.length` to see if a collection is empty
- **CONSIDER** using higher-order methods to replace `for` loops

```dart
// Good
var list = <int>[];
var set = <String>{};
var map = <String, int>{};

// Bad
var list = List<int>.empty();
var set = Set<String>();
var map = Map<String, int>();
```

```dart
// Good
if (list.isEmpty) print('empty');

// Bad
if (list.length == 0) print('empty');
```

### Functions

- **DO** use a function declaration to bind a name to a function
- **DON'T** create a lambda when a tear-off will do
- **DO** use `=>` for short, single-expression functions

```dart
// Good
names.forEach(print);

// Bad
names.forEach((name) {
  print(name);
});
```

### Parameters

- **DO** use `=` to separate named parameters from their default values
- **DON'T** use `:` for default values (deprecated)
- **AVOID** positional parameters that can't be optional or have defaults

### Variables

- **DO** follow a consistent rule for `var` and `final` on local variables
- **AVOID** saving the result of an operation in a variable if you're only going to use it once
- **PREFER** using `final`, `const`, or `var` over explicit type annotations for local variables

### Asynchrony

- **PREFER** `async`/`await` over using raw futures
- **AVOID** using `async` when it has no useful effect
- **DO** catch errors with `try`/`catch` in async functions

```dart
// Good
Future<void> doWork() async {
  try {
    var result = await asyncOperation();
    print(result);
  } catch (e) {
    print('Error: $e');
  }
}
```

## Design Guide

### Names

- **DO** use terms consistently
- **AVOID** abbreviations (except well-known ones like `url`, `uri`, `id`)
- **PREFER** being explicit over implicit in names

### Libraries

- **PREFER** declaring private APIs at the top level
- **CONSIDER** producing multiple smaller libraries over one large library

### Classes and Mixins

- **AVOID** defining a one-member abstract class when a simple function will do
- **AVOID** defining a class that only contains static members
- **PREFER** using extension methods over utility classes

### Constructors

- **DO** use initializing formals when possible
- **DON'T** use `this.` prefix for non-initializing formal parameters
- **DO** use `const` constructors for immutable objects

### Members

- **PREFER** making fields `final`
- **AVOID** returning `null` from methods that return collections
- **DO** use `=>` for simple getters

### Types

- **PREFER** type annotations on public APIs
- **PREFER** using `Object` or `Object?` over `dynamic`
- **AVOID** using `dynamic` when you can use `Object` or `Object?`
- **DO** use `Future<void>` as the return type of asynchronous members that don't return values
- **AVOID** using `void` as a return type for synchronous methods that don't return values (use `void` only for `Future<void>`)

### Parameters

- **DO** use inclusive parameter types
- **AVOID** mandatory parameters that can be optional
- **PREFER** named parameters for optional parameters

### Equality

- **DO** override `hashCode` if you override `==`
- **DO** make `==` take `Object` as parameter (not your type)
- **AVOID** overriding `==` if the class is mutable
