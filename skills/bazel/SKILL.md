# Bazel 9.x — Build System Documentation

> **Source**: [bazel.build/docs](https://bazel.build/docs) | [bazel.build/start](https://bazel.build/start) | [bazel.build/reference](https://bazel.build/reference) | [bazel.build/extending](https://bazel.build/extending) | [bazel.build/community](https://bazel.build/community)

## Overview

Bazel is a fast, hermetic, multi-platform build system that uses a high-level build language (Starlark) to describe build properties at a semantic level. It caches all previous work, tracks file content and command changes, and rebuilds only what's necessary. Bazel runs on Linux, macOS, and Windows, and scales to 100k+ source files.

- **Website**: [bazel.build](https://bazel.build/)
- **GitHub**: [github.com/bazelbuild/bazel](https://github.com/bazelbuild/bazel)
- **Releases**: [bazel.build/release](https://bazel.build/release)
- **Install**: [bazel.build/install](https://bazel.build/install)
- **Current LTS**: 9.2.0 | Also: 8.7.0, 7.7.1, 6.6.0

## Core Concepts

- **Repositories**: Directory tree with boundary marker (MODULE.bazel, REPO.bazel, or WORKSPACE)
- **Workspace**: Environment shared by all Bazel commands from the same main repo
- **Packages**: Directory containing a BUILD/BUILD.bazel file
- **Targets**: Files (source/generated) and rules defined in BUILD files
- **Labels**: Canonical identifiers for targets (`//package-name:target-name`)
- **Dependencies**: Declared (BUILD file) vs actual (needed for correct build)
- **Hermeticity**: Builds isolated from external environment
- **Runes/Starlark**: Python-like DSL for writing BUILD files and extensions
- **Action Graph**: DAG of build actions (inputs → outputs)
- **Three Phases**: Loading → Analysis → Execution

## File Index

| File | Coverage |
|------|----------|
| [getting-started.md](getting-started.md) | Intro, installation, first builds (C++/Java/Android/iOS/Go), concepts (repos, workspaces, packages, targets, labels, BUILD files, dependencies, visibility, hermeticity), building programs, bazelrc, scripts, client/server |
| [user-guide.md](user-guide.md) | BUILD style guide, external dependencies (Bzlmod), commands & options, query (bazel query/aquery/cquery), configurable attributes, C++ integration, code coverage, Windows, performance optimization, remote execution (RBE, caching, dynamic execution, sandbox, workers, BEP), tutorials, migration |
| [extending.md](extending.md) | Extension concepts, rules, symbolic macros, legacy macros, depsets, aspects, repository rules, configurations, platforms, toolchains, execution groups, Starlark language, style guide, testing rules, performance, deploying rules, Stardoc |
| [reference.md](reference.md) | Build encyclopedia (all native rules: cc_*, java_*, py_*, sh_*, objc_*, proto_*, general, platforms), test encyclopedia, command-line reference, query reference, glossary, Starlark API (global functions, providers, built-in types, top-level modules, configuration fragments) |

## Quick Start

```bash
# Install Bazel
# macOS: brew install bazel
# Linux: follow bazel.build/install
# Windows: follow bazel.build/install/windows

# Create a workspace
mkdir my-project && cd my-project
touch MODULE.bazel

# Write a BUILD file
mkdir src && cat > src/BUILD << 'EOF'
cc_binary(
    name = "hello",
    srcs = ["hello.cpp"],
)
EOF

# Build
bazel build //src:hello

# Test
bazel test //...
```

## Documentation Links

### About
- [Intro to Bazel](https://bazel.build/about/intro) | [Why Bazel?](https://bazel.build/about/why) | [FAQ](https://bazel.build/about/faq) | [Build basics](https://bazel.build/basics) | [Install](https://bazel.build/install)

### Getting Started
- [C++](https://bazel.build/start/cpp) | [Java](https://bazel.build/start/java) | [Android](https://bazel.build/start/android-app) | [iOS](https://bazel.build/start/ios-app) | [Go](https://bazel.build/start/go)

### Build Concepts
- [Workspaces, packages, & targets](https://bazel.build/concepts/build-ref) | [Labels](https://bazel.build/concepts/labels) | [BUILD files](https://bazel.build/concepts/build-files) | [Dependencies](https://bazel.build/concepts/dependencies) | [Visibility](https://bazel.build/concepts/visibility) | [Hermeticity](https://bazel.build/basics/hermeticity)

### User Guide
- [BUILD style guide](https://bazel.build/build/style-guide) | [Sharing variables](https://bazel.build/build/share-variables) | [External dependencies](https://bazel.build/external/overview) | [Recommended rules](https://bazel.build/community/recommended-rules) | [Building programs](https://bazel.build/run/build) | [Commands and options](https://bazel.build/docs/user-manual) | [bazelrc](https://bazel.build/run/bazelrc) | [Scripts](https://bazel.build/run/scripts) | [Client/server](https://bazel.build/run/client-server) | [Query quickstart](https://bazel.build/query/quickstart) | [Query guide](https://bazel.build/query/guide) | [Query language](https://bazel.build/query/language) | [aquery](https://bazel.build/query/aquery) | [cquery](https://bazel.build/query/cquery)

### Advanced
- [Configurable attributes](https://bazel.build/configure/attributes) | [C++ integration](https://bazel.build/configure/integrate-cpp) | [Code coverage](https://bazel.build/configure/coverage) | [Best practices](https://bazel.build/configure/best-practices) | [Windows](https://bazel.build/configure/windows) | [Performance metrics](https://bazel.build/advanced/performance/build-performance-metrics) | [Performance breakdown](https://bazel.build/advanced/performance/build-performance-breakdown) | [JSON trace profile](https://bazel.build/advanced/performance/json-trace-profile) | [Optimize memory](https://bazel.build/advanced/performance/memory) | [Iteration speed](https://bazel.build/advanced/performance/iteration-speed)

### Remote Distribution
- [RBE overview](https://bazel.build/remote/rbe) | [RBE rules](https://bazel.build/remote/rules) | [RBE CI](https://bazel.build/remote/ci) | [Dynamic execution](https://bazel.build/remote/dynamic) | [Remote caching](https://bazel.build/remote/caching) | [Docker Sandbox](https://bazel.build/remote/sandbox) | [Non-hermetic WORKSPACE rules](https://bazel.build/remote/workspace) | [Remote cache hits](https://bazel.build/remote/cache-remote) | [Local cache hits](https://bazel.build/remote/cache-local) | [Output directories](https://bazel.build/remote/output-directories) | [Persistent workers](https://bazel.build/remote/persistent) | [Multiplex workers](https://bazel.build/remote/multiplex) | [Creating workers](https://bazel.build/remote/creating) | [BEP overview](https://bazel.build/remote/bep) | [BEP examples](https://bazel.build/remote/bep-examples) | [BEP glossary](https://bazel.build/remote/bep-glossary)

### Tutorials
- [C++ use cases](https://bazel.build/tutorials/cpp-use-cases) | [C++ toolchains](https://bazel.build/tutorials/ccp-toolchain-config) | [Dependency graphs](https://bazel.build/tutorials/cpp-dependency) | [Labels to reference targets](https://bazel.build/tutorials/cpp-labels)

### Migrate
- [Overview](https://bazel.build/migrate) | [Maven to Bazel](https://bazel.build/migrate/maven) | [Xcode to Bazel](https://bazel.build/migrate/xcode)

### Reference
- [Build encyclopedia](https://bazel.build/reference/be) | [Test encyclopedia](https://bazel.build/reference/test-encyclopedia) | [Command-line reference](https://bazel.build/reference/command-line-reference) | [Query reference](https://bazel.build/query/language) | [Glossary](https://bazel.build/reference/glossary)

### Extending
- [Overview](https://bazel.build/extending/concepts) | [Rules](https://bazel.build/extending/rules) | [Symbolic macros](https://bazel.build/extending/macros) | [Legacy macros](https://bazel.build/extending/legacy-macros) | [Depsets](https://bazel.build/extending/depsets) | [Aspects](https://bazel.build/extending/aspects) | [Repository rules](https://bazel.build/extending/repo) | [Configurations](https://bazel.build/extending/config) | [Platforms](https://bazel.build/extending/platforms) | [Execution groups](https://bazel.build/extending/exec-groups) | [Auto exec groups](https://bazel.build/extending/auto-exec-groups) | [Toolchains](https://bazel.build/extending/toolchains)

### Writing Rules
- [Creating a rule](https://bazel.build/rules/rules-tutorial) | [Creating a symbolic macro](https://bazel.build/rules/macro-tutorial) | [Creating a legacy macro](https://bazel.build/rules/legacy-macro-tutorial) | [Custom verbs](https://bazel.build/rules/verbs-tutorial) | [Starlark language](https://bazel.build/rules/language) | [Starlark style guide](https://bazel.build/rules/bzl-style) | [Challenges](https://bazel.build/rules/challenges) | [Windows rules](https://bazel.build/rules/windows) | [Example rules](https://github.com/bazelbuild/examples/tree/HEAD/rules)

### Distributing Rules
- [Testing rules](https://bazel.build/rules/testing) | [Lint (buildifier)](https://github.com/bazelbuild/buildtools/tree/master/buildifier) | [Optimizing performance](https://bazel.build/rules/performance) | [Deploy rules](https://bazel.build/rules/deploying) | [Stardoc](https://github.com/bazelbuild/stardoc)

### Starlark API
- [Build file API overview](https://bazel.build/rules/lib/starlark-overview) | [Global functions](https://bazel.build/rules/lib/globals) | [Providers](https://bazel.build/rules/lib/providers) | [Built-in types](https://bazel.build/rules/lib/builtins) | [Top-level modules](https://bazel.build/rules/lib/toplevel) | [Configuration fragments](https://bazel.build/rules/lib/fragments) | [Core data types](https://bazel.build/rules/lib/core)

### Releases
- [Release model](https://bazel.build/release) | [Backward compatibility](https://bazel.build/release/backward-compatibility) | [Rule compatibility](https://bazel.build/release/rule-compatibility) | [Rolling releases](https://bazel.build/release/rolling)

### Community
- [Community & partners](https://bazel.build/community) | [Contributor's guide](https://bazel.build/contribute) | [Contribution policy](https://bazel.build/contribute/policy) | [Patch acceptance](https://bazel.build/contribute/patch-acceptance) | [Maintainer's guide](https://bazel.build/contribute/maintainers-guide) | [Codebase guide](https://bazel.build/contribute/codebase) | [Searching the codebase](https://bazel.build/contribute/search) | [Contribute docs](https://bazel.build/contribute/docs) | [Docs style guide](https://bazel.build/contribute/docs-style-guide) | [Design documents](https://bazel.build/contribute/design-documents) | [Release notes](https://bazel.build/contribute/release-notes) | [SIGs](https://bazel.build/community/sig) | [Bazel experts](https://bazel.build/community/experts) | [Product partners](https://bazel.build/community/partners) | [Users](https://bazel.build/community/users) | [Recommended rules](https://bazel.build/community/recommended-rules) | [RBE services](https://bazel.build/community/remote-execution-services) | [Support](https://bazel.build/help) | [Brand guidelines](https://bazel.build/brand)

**Source**: [bazel.build/docs](https://bazel.build/docs) | [bazel.build/start](https://bazel.build/start) | [bazel.build/reference](https://bazel.build/reference) | [bazel.build/extending](https://bazel.build/extending) | [bazel.build/community](https://bazel.build/community)
