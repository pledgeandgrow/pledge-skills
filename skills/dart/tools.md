# Tools

The Dart SDK includes a variety of tools for creating, formatting, analyzing, testing, documenting, compiling, and running Dart code.

## The dart CLI

The main command-line interface for Dart:

```bash
dart <command> [arguments]
```

### Common Commands

| Command | Description |
|---------|-------------|
| `dart create` | Create a new Dart project |
| `dart run` | Run a Dart program |
| `dart compile` | Compile Dart to various targets |
| `dart analyze` | Run static analysis |
| `dart test` | Run tests |
| `dart format` | Format Dart code |
| `dart fix` | Apply automated fixes |
| `dart pub` | Package management |
| `dart doc` | Generate API documentation |
| `dart build` | Build a Dart application (Dart 3.5+) |

## dart create

```bash
# Create a console app
dart create my_app

# With a template
dart create -t console-full my_app
dart create -t package my_package
dart create -t server-shelf my_server
dart create -t web my_web_app
```

Templates:
- `console-simple` — Minimal console app
- `console-full` — Console app with tests and CI
- `package` — Reusable package
- `server-shelf` — HTTP server using Shelf
- `web` — Web app

## dart run

```bash
# Run the default entry point
dart run

# Run a specific file
dart run bin/my_script.dart

# Run with arguments
dart run bin/main.dart --verbose --port 8080
```

## dart compile

```bash
# Native executable (AOT)
dart compile exe bin/main.dart -o my_app

# JIT snapshot
dart compile jit-snapshot bin/main.dart

# Kernel snapshot
dart compile kernel bin/main.dart

# JavaScript
dart compile js web/main.dart -o main.js

# WebAssembly
dart compile wasm web/main.dart
```

### Compilation Targets

| Target | Command | Use Case |
|--------|---------|----------|
| AOT executable | `dart compile exe` | Production deployment |
| JIT snapshot | `dart compile jit-snapshot` | Faster startup, needs VM |
| Kernel snapshot | `dart compile kernel` | Portable, needs VM |
| JavaScript | `dart compile js` | Web deployment |
| WebAssembly | `dart compile wasm` | Web (WasmGC) |

## dart analyze

Run static analysis on your code:

```bash
dart analyze
dart analyze lib/
dart analyze --fatal-infos
```

## dart format

Format your code according to Dart style:

```bash
# Format files
dart format .

# Check without modifying
dart format --output none --set-exit-if-changed .

# Specific files
dart format lib/main.dart lib/utils.dart

# Set line length
dart format -l 100 .
```

## dart fix

Apply automated fixes for analysis issues:

```bash
# Preview fixes
dart fix --dry-run

# Apply fixes
dart fix --apply

# Apply specific fixes
dart fix --apply --code=avoid_print
```

## dart doc

Generate API documentation:

```bash
dart doc
dart doc --output docs/
```

Generates HTML documentation from doc comments (`///`).

## dart pub

Package management commands:

```bash
dart pub get           # Get dependencies
dart pub add package   # Add a dependency
dart pub remove package # Remove a dependency
dart pub upgrade       # Upgrade dependencies
dart pub publish       # Publish to pub.dev
dart pub deps          # Show dependency tree
dart pub outdated      # Check for outdated packages
dart pub cache clean   # Clean pub cache
dart pub audit         # Check for security advisories
dart pub token add URL # Add access token
dart pub token list    # List access tokens
```

## dart build (Dart 3.5+)

Build a Dart application with hooks:

```bash
dart build
dart build --output dist/
```

## dart test

Run tests:

```bash
dart test
dart test test/specific_test.dart
dart test --coverage=coverage
dart test -j 4  # Run with 4 parallel workers
```

## Dart DevTools

A suite of debugging and performance tools:

```bash
# Launch DevTools
dart devtools

# In Flutter
flutter pub run devtools
```

Features:
- **Inspector** — Widget tree inspection (Flutter)
- **Performance** — CPU profiler, timeline
- **Memory** — Memory profiling, heap snapshots
- **Network** — HTTP traffic inspection
- **Logging** — View logs and events
- **Debugger** — Set breakpoints, step through code

## DartPad

An online editor for trying Dart without installation:

- URL: [dartpad.dev](https://dartpad.dev)
- Supports Dart core libraries (not `dart:io`)
- Great for learning and experimentation
- Can share code via URL

## IDE Support

### Official Plugins

- **Android Studio / IntelliJ** — [Dart plugin](https://dart.dev/tools/jetbrains-plugin)
- **VS Code** — [Dart extension](https://dart.dev/tools/vs-code)

### Community Plugins

- **Emacs** — [dart-mode](https://github.com/nex3/dart-mode)
- **Vim** — [dart-vim-plugin](https://github.com/dart-lang/dart-vim-plugin)
- **Eclipse** — [dart4e](https://github.com/dart4e/dart4e)

### Language Server Protocol

Dart provides an LSP implementation for any LSP-capable editor.

## webdev

A CLI for building and serving Dart web apps:

```bash
# Install
dart pub global activate webdev

# Serve in development mode
webdev serve

# Build for production
webdev build
```

## dartaotruntime

Run AOT-compiled Dart snapshots:

```bash
dartaotruntime my_app.aot
```

## SDK Structure

The Dart SDK includes:
- `dart` — The main CLI tool
- `dartaotruntime` — AOT runtime
- `dartfmt` — (deprecated, use `dart format`)
- `dartanalyzer` — (deprecated, use `dart analyze`)
- Core libraries (`dart:core`, `dart:async`, etc.)
