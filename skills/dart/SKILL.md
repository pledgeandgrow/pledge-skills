---
name: dart-docs
version: "Dart 3.12"
tags:
  - dart
  - language
  - oop
  - async
  - null-safety
  - flutter
  - web
  - server
  - ffi
  - isolates
  - patterns
  - records
  - generics
description: >
  Use this skill whenever the user asks about Dart, the client-optimized language
  for fast apps on any platform. Covers the full Dart 3.12 documentation including
  language tour (variables, operators, built-in types, records, collections,
  generics, typedefs, type system, patterns, control flow, error handling,
  functions, metadata, libraries & imports, classes, constructors, primary
  constructors, methods, extending classes, mixins, enums, dot shorthands,
  extension methods, extension types, callable objects, class modifiers,
  concurrency, isolates, null safety, keywords), core libraries (dart:core,
  dart:async, dart:math, dart:convert, dart:io, dart:js_interop, iterables,
  async/await, futures, streams), effective dart (style, documentation, usage,
  design), packages (pub, pubspec, publishing, dependencies, workspaces, hooks,
  versioning, security), development (JSON serialization, server apps, web apps,
  Wasm compilation, Google Cloud), interoperability (C/FFI, Objective-C/Swift,
  Java/Kotlin, JavaScript/dart:js_interop), tools (Dart SDK CLI, dart analyze,
  dart build, dart compile, dart create, dart doc, dart fix, dart format,
  dart pub, dart run, dart test, Dart DevTools, DartPad, static analysis,
  linter rules, testing), and resources (cheatsheet, specification, glossary).
  Use it for code generation, type safety, async programming, null safety,
  patterns, records, FFI, JS interop, package management, or any Dart-related task.
---

# Dart

Dart is a client-optimized language for fast apps on any platform. It is an object-oriented, class-based, garbage-collected language with C-style syntax. Dart supports sound null safety, asynchronous programming with `Future` and `Stream`, concurrency via isolates, pattern matching, records, and more. It compiles to native ARM/x64, JavaScript, and WebAssembly (WasmGC).

**Specification**: [Dart 3.12 Documentation](https://dart.dev/docs)

---

## Quick Reference

| Topic | File |
|------|------|
| Introduction (main, variables, control flow, comments, imports, classes) | `introduction.md` |
| Comments (single-line, multi-line, documentation comments) | `comments.md` |
| Variables (var, final, const, late, type inference, null) | `variables.md` |
| Operators (arithmetic, equality, relational, type test, assignment, logical, bitwise, shift, conditional, cascade, spread) | `operators.md` |
| Methods (instance methods, operators, getters/setters, abstract methods) | `methods.md` |
| Metadata (annotations, @Deprecated, @override, @pragma, custom annotations) | `metadata.md` |
| Built-in Types (int, double, String, bool, List, Set, Map, Runes, Symbol, null) | `built-in-types.md` |
| Records (positional, named fields, type annotations, equality) | `records.md` |
| Collections (lists, sets, maps, spread, collection-if, collection-for) | `collections.md` |
| Generics (generic types, methods, bounds, variance) | `generics.md` |
| Typedefs (type aliases, function type aliases) | `typedefs.md` |
| Type System (sound typing, static checking, runtime checks, type inference) | `type-system.md` |
| Patterns (matching, destructuring, pattern types, switch expressions) | `patterns.md` |
| Pattern Types (logical-or, logical-and, relational, cast, null-check, null-assert, constant, variable, identifier, list, map, record, object) | `pattern-types.md` |
| Control Flow (loops, branches, error handling) | `control-flow.md` |
| Functions (parameters, named, optional, default, closures, generators, async) | `functions.md` |
| Language Versioning (SDK constraints, per-file overrides, migration) | `language-versioning.md` |
| Libraries & Imports (import, export, part, show/hide, deferred, privacy) | `libraries.md` |
| Classes (instance variables, methods, static, abstract, implicit interfaces, noSuchMethod) | `classes.md` |
| Constructors (generative, named, const, factory, redirecting, initializing formals, super) | `constructors.md` |
| Primary Constructors (var/final declaring parameters, scoping, named, const, private named params) | `primary-constructors.md` |
| Inheritance & Mixins (extends, override, super, mixins, mixin class, on clause) | `inheritance-mixins.md` |
| Enums (simple, enhanced, with members, mixins, sealed) | `enums.md` |
| Extension Methods & Types (extensions, extension types) | `extensions.md` |
| Dot Shorthands (.foo syntax, context type inference, enum/static/constructor shorthands) | `dot-shorthands.md` |
| Callable Objects (call() method, emulating functions) | `callable-objects.md` |
| Class Modifiers (abstract, base, final, interface, sealed, mixin) | `class-modifiers.md` |
| Concurrency (event loop, isolates, Isolate.run, message passing) | `concurrency.md` |
| Isolates (Isolate.run, Isolate.spawn, ReceivePort, SendPort, web concurrency) | `isolates.md` |
| Async Programming (Future, async/await, Stream, StreamController, zones) | `async.md` |
| Using Streams (await for, listen, single-subscription, broadcast, error handling) | `using-streams.md` |
| Futures & Error Handling (then, catchError, whenComplete, common pitfalls) | `futures-error-handling.md` |
| Null Safety (non-nullable by default, ? type, ! operator, late, null checks) | `null-safety.md` |
| Keywords (all reserved words, context-dependent keywords) | `keywords.md` |
| Core Libraries (dart:core, dart:async, dart:math, dart:convert, dart:io, dart:js_interop) | `core-libraries.md` |
| Iterable Collections (reading, filtering, mapping, lazy evaluation) | `iterable-collections.md` |
| Creating Streams (async*, StreamController, StreamTransformer, broadcast) | `creating-streams.md` |
| Effective Dart (style, documentation, usage, design best practices) | `effective-dart.md` |
| Packages (pub, pubspec.yaml, dependencies, publishing, workspaces, hooks) | `packages.md` |
| Development (server apps, web apps, Wasm, JSON serialization, Google Cloud) | `development.md` |
| Interoperability (dart:ffi, C interop, JS interop, Objective-C/Swift, Java/Kotlin) | `interop.md` |
| Tools (Dart SDK CLI, dart analyze, build, compile, format, test, DevTools, DartPad) | `tools.md` |
| build_runner (code generation, builders, build/watch/serve/test commands) | `build-runner.md` |
| Static Analysis (analysis_options.yaml, linter rules, diagnostics, analyzer plugins) | `static-analysis.md` |
| Testing (unit, component, integration tests, dart test, test package) | `testing.md` |

---

## Core Concepts

- **Sound Null Safety**: Types are non-nullable by default. Use `?` for nullable types. The analyzer catches null errors at compile time.
- **Type Inference**: Use `var` for local variables; types are inferred from initializers. Use explicit types for public APIs.
- **Object-Oriented**: Every object is an instance of a class. All classes descend from `Object`. Mixin-based inheritance.
- **Async Programming**: `Future` and `Stream` for async operations. `async`/`await` for clean async code.
- **Isolates**: Dart's concurrency model — independent workers with their own memory and event loop. No shared memory between isolates.
- **Patterns & Records**: Pattern matching and destructuring with switch expressions, if-case, variable declarations. Records are anonymous, immutable, aggregate types.
- **Class Modifiers**: `abstract`, `base`, `final`, `interface`, `sealed`, `mixin` control how classes can be used from other libraries.
- **Extension Methods & Types**: Add functionality to existing libraries without modifying them. Extension types for zero-cost wrappers.
- **Generics**: Reified generic types — type parameters are available at runtime. Covariant by default.
- **Libraries & Privacy**: Every Dart file is a library. Identifiers starting with `_` are library-private.
- **FFI & JS Interop**: `dart:ffi` for calling C libraries. `dart:js_interop` for JavaScript/WebAssembly interop.
- **Pub**: Dart's package manager. `pubspec.yaml` defines dependencies and metadata. Packages hosted on pub.dev.

---

## Official Documentation

- [Dart Documentation](https://dart.dev/docs)
- [Dart Language Tour](https://dart.dev/language)
- [Dart Core Libraries](https://dart.dev/libraries)
- [Effective Dart](https://dart.dev/effective-dart)
- [Dart API Reference](https://api.dart.dev)
- [DartPad (Online Editor)](https://dartpad.dev)
- [pub.dev (Package Site)](https://pub.dev)
- [Dart Language Specification](https://dart.dev/resources/language/spec)
- [Dart Cheatsheet](https://dart.dev/resources/dart-cheatsheet)
- [Dart Blog](https://blog.dart.dev)
