---
name: swift-docs
version: "Swift 6.0"
tags:
  - swift
  - programming-language
  - type-safe
  - protocol-oriented
  - concurrency
  - arc
  - generics
  - server-side
  - cross-platform
  - swift-package-manager
  - vapor
  - hummingbird
  - swiftnio
  - docc
  - cxx-interop
  - async-await
  - actors
  - sendable
description: |
  Swift 6.0 — syntax, strings, collections, closures, enums, structs, concurrency, protocols, generics, package manager.
---

# Swift

> Swift is a general-purpose programming language built using a modern approach to safety, performance, and software design patterns.

**Version**: Swift 6.0  
**Documentation**: [swift.org/documentation](https://www.swift.org/documentation/)  
**Language Reference**: [The Swift Programming Language (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/)  

## Quick Reference

| Topic | File |
|-------|------|
| Introduction (what is Swift, installation, features, platform support) | `introduction.md` |
| Guided Tour (quick tour of all Swift features) | `guided-tour.md` |
| Syntax Basics (constants, variables, types, operators, control flow) | `syntax-basics.md` |
| Strings and Characters (literals, interpolation, Unicode, indexing) | `strings-and-characters.md` |
| Collection Types (Array, Set, Dictionary, collection protocols) | `collection-types.md` |
| Functions and Closures (parameters, return types, closures, higher-order) | `functions-and-closures.md` |
| Enumerations (raw values, associated values, recursive enums, patterns) | `enumerations.md` |
| Structures and Classes (properties, methods, subscripts, value vs reference) | `structures-and-classes.md` |
| Inheritance and Initialization (subclassing, init delegation, deinit, optional chaining) | `inheritance-and-initialization.md` |
| Optionals and Error Handling (optional binding, try/catch, defer, Result) | `optionals-and-error-handling.md` |
| Concurrency (async/await, Tasks, Actors, Sendable, structured concurrency) | `concurrency.md` |
| Type Casting and Extensions (is, as?, nested types, protocol extensions) | `type-casting-and-extensions.md` |
| Protocols and Generics (associated types, constraints, opaque/boxed types) | `protocols-and-generics.md` |
| Access Control (private, fileprivate, internal, public, open) | `access-control.md` |
| Advanced Operators (bitwise, overflow, custom operators, precedence, result builders) | `advanced-operators.md` |
| Macros (freestanding, attached, custom macros, SwiftSyntax, compile-time codegen) | `macros.md` |
| Memory Safety and ARC (reference counting, weak/unowned, ownership, noncopyable) | `memory-safety-and-arc.md` |
| API Design Guidelines (naming, conventions, argument labels, documentation) | `api-design-guidelines.md` |
| Standard Library and Core Libraries (Foundation, Dispatch, XCTest, Swift Testing) | `standard-library-and-core-libraries.md` |
| Package Manager (SwiftPM, Package.swift, dependencies, targets, resources) | `package-manager.md` |
| Swift on Server (Vapor, Hummingbird, SwiftNIO, deployment, Docker) | `server.md` |
| C++ Interoperability (importing C++, exposing Swift, containers, reference types) | `cxx-interop.md` |
| Value and Reference Types (semantics, copy-on-write, choosing, composing) | `value-and-reference-types.md` |
| DocC Documentation (documentation comments, articles, tutorials, hosting) | `docc.md` |
| Compiler and Tools (architecture, REPL, LLDB, SourceKit-LSP, profiling) | `compiler-and-tools.md` |
| Cross-Platform Development (Linux, Windows, Android, WebAssembly, Embedded) | `cross-platform.md` |
| Swift Evolution and Contributing (proposals, source code, community) | `evolution-and-contributing.md` |

## Core Concepts

- **Safety First**: Variables always initialized, arrays checked for overflow, memory managed automatically, optionals eliminate nil crashes
- **Value Types by Default**: Structs and enums are value types — copied on assignment, enabling local reasoning
- **Protocol-Oriented Programming**: Protocols with default implementations, associated types, and protocol extensions
- **Strong Type System**: Type inference, generics with constraints, opaque types (`some`), existential types (`any`)
- **Modern Concurrency**: async/await, actors for data-race safety, `Sendable` for concurrency safety, structured concurrency with task groups
- **ARC Memory Management**: Automatic Reference Counting with `weak`/`unowned` for cycle breaking, ownership (`consume`/`borrowing`), `noncopyable` types
- **C++ Interoperability**: Bidirectional interop with C++ since Swift 5.9
- **Macros**: Compile-time code generation for reducing boilerplate (Swift 5.9+)
- **Cross-Platform**: macOS, iOS, Linux, Windows, Android, WebAssembly, embedded

## Official Documentation Sources

- [Swift.org Documentation](https://www.swift.org/documentation/) — Documentation hub
- [The Swift Programming Language (TSPL)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/) — Language reference
- [API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/) — Naming and design conventions
- [Standard Library](https://www.swift.org/documentation/standard-library/) — Standard library docs
- [Core Libraries](https://www.swift.org/documentation/core-libraries/) — Foundation, Dispatch, XCTest, Swift Testing
- [Package Manager](https://www.swift.org/documentation/package-manager/) — SwiftPM docs
- [REPL & Debugger](https://www.swift.org/documentation/lldb/) — LLDB and REPL
- [Swift on Server](https://www.swift.org/documentation/server/) — Server-side Swift
- [C++ Interop](https://www.swift.org/documentation/cxx-interop/) — Mixing Swift and C++
- [Value and Reference Types](https://www.swift.org/documentation/articles/value-and-reference-types.html) — Article
- [DocC](https://www.swift.org/documentation/docc/) — Documentation authoring
- [Concurrency Checking](https://www.swift.org/documentation/concurrency/) — Enabling complete concurrency
- [Static Linux SDK](https://www.swift.org/documentation/articles/static-linux-getting-started.html) — Static linking
- [Swift SDK for Android](https://www.swift.org/documentation/articles/swift-sdk-for-android-getting-started.html) — Android development
- [WebAssembly SDKs](https://www.swift.org/documentation/articles/wasm-getting-started.html) — Wasm targets
- [VS Code Setup](https://www.swift.org/documentation/articles/getting-started-with-vscode-swift.html) — Editor configuration
- [Swift Evolution](https://www.swift.org/swift-evolution/) — Language proposals
- [Compiler Architecture](https://www.swift.org/documentation/swift-compiler/) — Compiler internals
- [Source Code](https://www.swift.org/documentation/source-code/) — Repository guide
- [About Swift](https://www.swift.org/about/) — Overview and features
