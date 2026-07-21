# Language Versioning

Learn how language versioning in Dart enables evolution of the language and how to configure the language versions of your project and its libraries.

## Overview

A single Dart SDK can simultaneously support multiple versions of the Dart language. The compiler determines what version the code is targeting, and it interprets the code according to that version.

Language versioning becomes important on the rare occasions when Dart introduces an incompatible feature like null safety. When Dart introduces a breaking change, code that did compile might no longer compile. Language versioning allows you to set each library's language version to maintain compatibility.

In the case of null safety, Dart SDKs 2.12 through 2.19 allowed you to choose to update your code to use null safety. Dart uses language versioning to permit non-null-safe code to run alongside null-safe code. This decision enabled migration from non-null-safe to null-safe code.

## SDK constraint and default language version

Each package has a default language version equal to the lower bound of the SDK constraint in the `pubspec.yaml` file.

For example, the following entry in a pubspec.yaml file indicates that this package defaults to the Dart 2.18 language version:

```yaml
environment:
  sdk: '>=2.18.0 <3.0.0'
```

## Per-file language version override

You can override the language version for an individual file using a language version override comment at the top of the file:

```dart
// @dart=2.18
import 'some_library.dart';
```

This must be the first line of the file (before any imports or other directives).

## When language versioning matters

Language versioning is most relevant when:

- **Breaking changes** — Dart introduces a feature that changes existing behavior
- **Migration periods** — Gradual migration from old to new language features
- **Package compatibility** — Ensuring packages work with different SDK versions

## Best practices

- Always specify a lower bound in your SDK constraint that matches the language version you need
- Keep your SDK constraint up to date as you adopt new language features
- Use `dart fix` to help migrate code to newer language versions
