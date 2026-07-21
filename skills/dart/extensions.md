# Extension Methods & Types

## Extension Methods

Extension methods add functionality to existing libraries. You might use extension methods without even knowing it — when you use code completion in an IDE, it suggests extension methods alongside regular methods.

### Using Extension Methods

```dart
import 'string_apis.dart';

void main() {
  print('42'.parseInt()); // Use an extension method
}
```

### Implementing Extension Methods

```dart
extension NumberParsing on String {
  int parseInt() {
    return int.parse(this);
  }

  double parseDouble() {
    return double.parse(this);
  }
}
```

Extensions can define not just methods, but also getters, setters, and operators.

### Unnamed Extensions

Extensions without names are visible only in the library where they're declared:

```dart
extension on String {
  String capitalize() =>
      isEmpty ? this : '${this[0].toUpperCase()}${substring(1)}';
}
```

### Resolving API Conflicts

If two extensions define the same member, resolve the conflict using `show`/`hide` or by prefixing:

```dart
// Hide conflicting extension
import 'string_apis.dart' hide StringExtensions;

// Or use a prefix
import 'string_apis.dart' as ext;
ext.StringExtensions('42').parseInt();
```

### Static vs Dynamic

Extension methods resolve against the static type of the receiver, not the runtime type. They don't work with `dynamic`:

```dart
dynamic d = '42';
// d.parseInt(); // Error: dynamic doesn't support extension methods
```

## Extension Types (Dart 3.4+)

Extension types provide a way to create zero-cost wrappers around existing types. They are a compile-time abstraction — at runtime, they are identical to the underlying type.

### Declaring Extension Types

```dart
extension type EmailAddress(String value) {
  bool get isValid => value.contains('@');
  String get domain => value.split('@').last;
}
```

### Using Extension Types

```dart
void main() {
  var email = EmailAddress('user@example.com');
  print(email.value);     // 'user@example.com'
  print(email.isValid);   // true
  print(email.domain);    // 'example.com'
}
```

### Representation and Constructors

```dart
extension type EmailAddress(String value) {
  // Primary constructor is implicit
  // Can add additional named constructors
  EmailAddress.invalid() : value = 'invalid@invalid';
}
```

### Implements Clause

Extension types can implement interfaces:

```dart
extension type EmailAddress(String value) implements String {
  // Must implement all String members
  // Or can use implements to allow subtyping
}
```

### When to Use Extension Types

- **Zero-cost wrappers** — no runtime overhead for wrapping a type
- **Type-safe identifiers** — e.g., `UserId` vs `AccountId` both wrapping `int`
- **Interoperability** — wrapping JS types for type safety

## Dot Shorthands (Dart 3.7+)

Dart 3.7+ introduces dot shorthands for more concise code, especially with enum values and static members:

```dart
// Instead of Color.red, can use .red in context where type is known
Color c = .red;

// In switch expressions
String describe(Color c) => switch (c) {
  .red => 'red',
  .green => 'green',
  .blue => 'blue',
};
```
