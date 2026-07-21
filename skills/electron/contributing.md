# Developing & Contributing to Electron

Guides for working on the Electron project itself. For app development guides, see the tutorial sections.

## Getting Started

Electron's [build-tools](https://github.com/electron/build-tools) automate much of the setup for compiling Electron from source. For manual builds, see the build instructions below.

## Issues in Electron

Three ways to contribute to issues:
1. **Open an issue** — Report bugs in the [electron/electron issue tracker](https://github.com/electron/electron/issues)
2. **Triage issues** — Provide reproducible test cases or suggestions
3. **Resolve issues** — Open a pull request with a concrete fix

### Submitting a Bug Report

- Fill out the issue template completely
- Provide a description and a simple reproducible test case
- See [How to create a Minimal, Complete, and Verifiable example](https://stackoverflow.com/help/mcve)

### Asking for General Help

Use the [Electron community resources](https://www.electronjs.org/community) for programming help. The issue tracker is for bugs only.

## Pull Requests

### Setting Up Your Local Environment

1. **Fork** the electron/electron repository on GitHub
2. **Build** Electron from source (see build instructions below)
3. **Branch** — Create a new branch for your changes

### Making Changes

4. **Code** — Make your changes in `shell/` (C/C++), `lib/` (TypeScript), `docs/`, or `spec/`
5. **Commit** — Follow the coding style and commit guidelines
6. **Rebase** — Keep your branch up to date with main
7. **Test** — Run `npm run test` and `npm run lint`
8. **Push** — Push to your fork
9. **Open PR** — Open a pull request against electron/electron
10. **Discuss and update** — Address review feedback
11. **Land** — A maintainer will merge your PR

### Continuous Integration Testing

All PRs are tested via CI. Ensure your PR passes all checks before requesting review.

## Coding Style

### General Code

- End files with a newline
- Place requires in order: Node built-ins → Electron modules → Local modules
- Place class properties before instance properties
- Use `path.join()` for filenames, `os.tmpdir()` instead of `/tmp`
- Use plain `return` (not `return null` or `return undefined`)

### C++ and Python

- Follow Chromium's [Coding Style](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/styleguide/styleguide.md)
- Run `script/cpplint.py` to check compliance
- Python 3.9 is used
- Get acquainted with Chromium's [Important Abstractions and Data Structures](https://www.chromium.org/developers/coding-style/important-abstractions-and-data-structures)

### JavaScript

- Follow the project's ESLint configuration
- Run `npm run lint` to check

### Documentation

- Follow the [documentation style guide](https://www.electronjs.org/docs/latest/development/style-guide)
- Run `npm run lint:docs` to verify formatting
- Headings, markdown rules, word choices, and API reference formats are specified

## Source Code Directory Structure

Electron's source is separated into parts following Chromium's conventions:

- `shell/` — C/C++ code for the Electron browser process
- `lib/` — TypeScript/JavaScript implementation of Electron's APIs
- `docs/` — Documentation source
- `spec/` — Tests (Electron app with its own package.json)
- `patches/` — Patches to upstream projects (Chromium, Node.js)

## Build Instructions

### Using @electron/build-tools (Recommended)

```bash
npm install -g @electron/build-tools

# Initialize and bootstrap a checkout
e init --root=~/electron --bootstrap testing

# After initial sync, authenticate with RBE
e d rbe login

# Build
e build

# Run the built Electron
e start
```

### Manual Setup (Advanced)

#### Prerequisites by Platform

- **macOS**: Xcode, Python 3.9, Node.js; ARM64 requires additional steps
- **Windows**: Visual Studio 2019+ with C++ tools, Python 3.9, Node.js; exclude source tree from Windows Security
- **Linux**: `clang`, `libgtk-3-dev`, `libnotify-dev`, and many other system libraries

#### Building

1. Get the code: `gclient sync`
2. Generate build files with GN
3. Build with Ninja: `ninja -C out/Testing electron`

### Reclient (Remote Execution)

Reclient integrates with the build system to enable remote execution and caching, dramatically improving build times. Available to Electron contributors via `e d rbe login`.

## Testing

### Linting

```bash
npm run lint          # Code linting
npm run lint:docs     # Documentation linting
```

Many checks are included as precommit hooks.

### Unit Tests

```bash
# Run all tests
npm run test

# Run specific tests matching a pattern
npm run test -- -g ipc
```

The unit tests are an Electron app in the `spec/` folder with its own `package.json`.

### Node.js Smoke Tests

For changes affecting Node.js embedding:

```bash
# Run all Node.js tests
node script/node-spec-runner.js

# Run a single test
node script/node-spec-runner.js parallel/test-crypto-keygen
```

## Debugging Electron (Development)

### Generic Debugging

- **Printing stacktraces**: Use `LOG(ERROR)` in C++ or `console.error` in JS
- **Breakpoint debugging**: Use `--inspect` flag or a debugger (GDB, LLDB)
- **Platform-specific**: Different approaches per OS

### Debugging with the Symbol Server

Download debug symbols for Electron releases to debug crashes in pre-built binaries.

## Patches in Electron

Electron is built on Chromium and Node.js. Sometimes patches to upstream projects are necessary.

### Patch Justification

Every patch must describe its reason:
1. **Temporary** — Intended to be upstreamed eventually
2. **Electron-specific** — Cannot be upstreamed (e.g., Chrome Profile references)
3. **Fundamentally incompatible** — Electron-specific functionality changes

### Patch System

- All patches live in `patches/` directory
- Each subdirectory has a `.patches` file listing application order
- `patches/config.json` describes which patchset applies to what project
- Tools: `git-import-patches` and `git-export-patches`

```
patches/
├── config.json
├── chromium/
│   ├── .patches
│   ├── accelerator.patch
│   ⋮
├── node/
│   ├── .patches
│   ├── add_openssl_is_boringssl_guard_to_oaep_hash_check.patch
│   ⋮
⋮
```

## Chromium Development

Resources for contributing to Chromium:
- [Build instructions](https://chromium.googlesource.com/chromium/src/+/main/docs/) (Windows, macOS, Linux)
- [Contributing guide](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/docs/contributing.md)
- Code resources, informational resources, and social links available in the docs

## V8 Development

Resources for learning and using V8:
- [V8 Tracing](https://v8.dev/docs/trace)
- [V8 Profiler](https://v8.dev/docs/profile) — flags: `--prof`, `--trace-ic`, `--trace-opt`, `--trace-deopt`, `--print-bytecode`, `--print-opt-code`
- [V8 Interpreter Design](https://docs.google.com/document/d/11T2CRex9hXxoJwbYqVQ32yIPMh0uouUZLdyrtmMoL44/)
- [Optimizing compiler (TurboFan)](https://v8.dev/docs/turbofan)
- [V8 GDB Debugging](https://v8.dev/docs/gdb-jit)

## Creating a New Electron API Module

Checklist for adding a new API module:

1. **Add files to project configuration** — Update `BUILD.gn` files
2. **Create API documentation** — Add docs in `docs/api/`
3. **Set up ObjectTemplateBuilder and Wrappable** — C++ boilerplate
4. **Link with Node** — Register the module in the Node binding
5. **Expose to TypeScript** — Add type definitions
6. **Export as a module** — Make it available via `require('electron')`

## Using clang-tidy on C++ Code

`clang-tidy` automatically checks C/C++/Objective-C code for style violations, programming errors, and best practices. Configure and run via the build system.

## Governance

Electron has a governance system with working groups responsible for APIs, releases, and upgrades. See the [governance repo](https://github.com/electron/governance) for details.
