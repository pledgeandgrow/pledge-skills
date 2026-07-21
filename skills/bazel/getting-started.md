# Bazel — Getting Started & Core Concepts

> **Source**: [Intro](https://bazel.build/about/intro) | [Install](https://bazel.build/install) | [Build programs](https://bazel.build/run/build) | [Concepts](https://bazel.build/concepts/build-ref) | [Labels](https://bazel.build/concepts/labels) | [Dependencies](https://bazel.build/concepts/dependencies) | [BUILD files](https://bazel.build/concepts/build-files) | [Visibility](https://bazel.build/concepts/visibility) | [Hermeticity](https://bazel.build/basics/hermeticity) | [bazelrc](https://bazel.build/run/bazelrc) | [Scripts](https://bazel.build/run/scripts) | [Client/server](https://bazel.build/run/client-server)

## What is Bazel?

Bazel is a fast, hermetic, multi-platform build system. It uses an abstract, human-readable language (Starlark) to describe build properties at a high semantic level — operating on concepts of libraries, binaries, scripts, and data sets rather than individual compiler/linker calls.

### Key Benefits

- **High-level build language**: Abstract, human-readable description of build properties
- **Fast and reliable**: Caches all previous work, tracks changes to file content and build commands, rebuilds only what's needed
- **Multi-platform**: Runs on Linux, macOS, Windows; builds for desktop, server, and mobile from the same project
- **Scales**: Handles 100k+ source files, multiple repositories, tens of thousands of users
- **Extensible**: Many languages supported via rules; extendable to any language/framework

### Bazel Build Process

1. **Loading phase**: Load and evaluate all extensions and BUILD files needed for the build. Macros are evaluated, rules instantiated into a graph.
2. **Analysis phase**: Rule implementation functions execute, actions instantiated. Action graph generated from the loading phase graph.
3. **Execution phase**: Actions executed when outputs are required. Tests run in this phase. Cached artifacts reused.

### Action Graph

The action graph represents build artifacts, their relationships, and the build actions Bazel will perform. Enables change tracking (file content + actions) and dependency tracing.

### Why Bazel?

See: [Why Bazel?](https://bazel.build/about/why)

- **Reproducible builds**: Hermeticity ensures same inputs → same outputs, anywhere
- **Incremental builds**: Only rebuilds what changed, caching at action level
- **Multi-language**: C++, Java, Python, Go, Android, iOS, and more in one build
- **Scalable**: Handles 100k+ source files across multiple repositories
- **Fast**: Parallel execution, remote caching, remote execution support
- **Correct**: Strict dependency tracking catches missing deps, diamond deps

### FAQ

See: [FAQ](https://bazel.build/about/faq)

Common questions covered:
- What makes Bazel different from Make, Maven, Gradle, etc.?
- How does Bazel handle incremental builds?
- What is hermeticity and why does it matter?
- How does Bazel handle external dependencies?
- What languages does Bazel support?
- How does Bazel compare to other build systems?

## Installation

See: [Install Bazel](https://bazel.build/install)

- **macOS**: `brew install bazel` (or use Bazelisk)
- **Linux**: Download from GitHub releases or use package manager
- **Windows**: See [Windows guide](https://bazel.build/configure/windows)
- **Bazelisk**: Recommended version manager — `npm install -g @bazel/bazelisk`

## First Build Guides

### C++ Quick Start

See: [C++ tutorial](https://bazel.build/start/cpp)

```bash
mkdir cpp-tutorial && cd cpp-tutorial
touch MODULE.bazel
mkdir -p src/main/cpp
cat > src/main/cpp/BUILD << 'EOF'
cc_binary(
    name = "hello-world",
    srcs = ["hello-world.cc"],
)
EOF
bazel build //src/main/cpp:hello-world
```

### Java Quick Start

See: [Java tutorial](https://bazel.build/start/java)

```python
java_binary(
    name = "ProjectRunner",
    srcs = glob(["src/main/java/com/example/*.java"]),
)
```

### Other Languages
- [Android](https://bazel.build/start/android-app)
- [iOS](https://bazel.build/start/ios-app)
- [Go](https://bazel.build/start/go)

## Core Concepts

### Repositories

A repository (repo) is a directory tree with a boundary marker file at its root:
- `MODULE.bazel` (modern, Bzlmod)
- `REPO.bazel`
- `WORKSPACE` / `WORKSPACE.bazel` (legacy)

The repo where the current Bazel command runs is the **main repo**. Other (external) repos are defined by repo rules.

### Workspace

The workspace is the environment shared by all Bazel commands run from the same main repo. It encompasses the main repo and all defined external repos.

### Packages

A package is a directory containing a file named `BUILD` or `BUILD.bazel`. It includes all files in its directory plus subdirectories beneath it, except those containing their own BUILD file.

```
src/my/app/
├── BUILD          # defines package my/app
├── app.cc
├── data/
│   └── input.txt  # belongs to my/app
└── tests/
    └── BUILD      # defines package my/app/tests
```

### Targets

Targets are defined in BUILD files. Two principal kinds:

1. **Files**: Source files (written by people, checked in) or generated files (produced by rules)
2. **Rules**: Specify relationships between inputs and outputs. Rule inputs can be source files, outputs of other rules, or other rules.

**Package groups** limit accessibility of certain rules via `package_group`.

### Labels

Labels are canonical identifiers for targets: `@repo//package-name:target-name`

- **Target names**: Characters from `a–z A–Z 0–9` and `!%-@^_"#$&'()*-+,;<=>?[]{|}~/.`
- **Package names**: Directory path relative to repo root. Must not start/end with `/`, contain `//`, or contain `/./ ` or `/../`
- **Shorthand**: `//foo/bar/wiz` = `//foo/bar/wiz:wiz`
- **Root package**: `//:foo` (best to leave empty)

### BUILD Files

See: [BUILD files](https://bazel.build/concepts/build-files)

BUILD files use Starlark syntax to declare targets by calling rules:

```python
load("//tools:rules.bzl", "my_rule")

my_rule(
    name = "my_target",
    srcs = ["source.py"],
    deps = ["//other:target"],
)
```

### Dependencies

See: [Dependencies](https://bazel.build/concepts/dependencies)

- **Actual dependency**: Y must be present, built, and up-to-date for X to build correctly
- **Declared dependency**: Dependency edge from X to Y in X's BUILD file
- The graph of actual dependencies must be a subgraph of declared dependencies
- BUILD file writers must explicitly declare all actual direct dependencies — no more, no less

**Three types of dependencies**:
- `srcs`: Source files directly consumed by the rule
- `deps`: Other rules that provide headers, libraries, or compilation inputs
- `data`: Files needed at runtime (not for compilation)

### Visibility

See: [Visibility](https://bazel.build/concepts/visibility)

Controls which packages can depend on a target. Default visibility is `//visibility:public` or specified via `package(default_visibility = [...])`.

### Hermeticity

See: [Hermeticity](https://bazel.build/basics/hermeticity)

Hermetic builds are isolated from external environment — deterministic and reproducible. Achieved through sandboxing, explicit dependencies, and fixed toolchains.

## Building Programs with Bazel

See: [Build programs](https://bazel.build/run/build)

### Basic Commands

```bash
bazel build //foo:foo          # Build a single target
bazel build //foo/...          # Build all targets under foo
bazel test //...               # Test all targets
bazel run //foo:foo            # Build and run
bazel clean                    # Clean outputs
bazel shutdown                 # Stop Bazel server
```

### Configuration and Cross-Compilation

```bash
bazel build //myapp:app \
    --platforms=//platforms:linux_x64
```

### Correct Incremental Rebuilds

Bazel tracks changes to file content and build commands. Only rebuilds what's changed. Uses dependency analysis to determine which files must be loaded, rules analyzed, and actions executed.

### Fetching External Dependencies

```bash
bazel fetch //...              # Fetch all external deps
bazel sync                     # Sync external deps
```

## bazelrc Configuration

See: [bazelrc](https://bazel.build/run/bazelrc)

`.bazelrc` files configure default options:

```
# Common flags
build --strategy=Genrule=stamp
build --color=yes
test --test_output=errors

# Import user-specific overrides
try-import %workspace%/user.bazelrc
```

**Precedence**: command line > .bazelrc (workspace) > .bazelrc (home) > system-wide

## Calling Bazel from Scripts

See: [Scripts](https://bazel.build/run/scripts)

Use `--script_location` to output a self-contained script. Use `--announce_rc` to show applied flags. Exit codes:
- `0`: Success
- `1`: Build/test failure
- `2`: Bad flags or environment error
- `3`: Build interrupted
- `8`: No tests found

## Client/Server Implementation

See: [Client/server](https://bazel.build/run/client-server)

Bazel runs as a client/server process. The server persists across invocations, caching state. The client communicates with the server via gRPC.

- `bazel shutdown` — stop the server
- `bazel info` — show server info
- `--max_idle_secs` — auto-shutdown timeout

## External Dependencies (Bzlmod)

See: [External dependencies overview](https://bazel.build/external/overview)

Bazel's modern external dependency system uses **Bazel modules** (versioned Bazel projects) with `MODULE.bazel`:

```python
module(name = "my-module", version = "1.0")
bazel_dep(name = "rules_cc", version = "0.1.1")
bazel_dep(name = "platforms", version = "0.0.11")
```

Dependencies resolved via [Bazel Central Registry (BCR)](https://bcr.bazel.build/). Module extensions can define additional repos.

### Key Concepts

- **Module**: Versioned Bazel project with MODULE.bazel
- **Repository**: Directory tree with source files
- **Canonical vs Apparent repo names**: `@rules_cc~` vs `@rules_cc`
- **Repository rule**: Defines how to fetch a repo's sources
- **Module extension**: Customizes data consumed after module resolution

### Legacy WORKSPACE System

The legacy system uses `WORKSPACE` files. Being phased out in favor of Bzlmod. See [shortcomings](https://bazel.build/external/overview#shortcomings-of-workspace).

## Release Model

See: [Release model](https://bazel.build/release)

- **Semantic versioning**: major.minor.patch
- **Major releases** = LTS releases with breaking changes
- **Minor releases**: Backward-compatible bug fixes backported from main
- **Patch releases**: Critical bug fixes
- **Support stages**: Rolling → Active → Maintenance → Deprecated
- **Current LTS**: 9.2.0

See also: [Backward compatibility](https://bazel.build/release/backward-compatibility) | [Rule compatibility](https://bazel.build/release/rule-compatibility) | [Rolling releases](https://bazel.build/release/rolling)
