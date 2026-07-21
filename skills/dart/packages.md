# Packages

The Dart ecosystem uses packages to manage shared software such as libraries and tools. To get Dart packages, you use the **pub** package manager.

## What is a Package?

At a minimum, a Dart package is a directory containing a `pubspec.yaml` file. The pubspec contains metadata about the package. Additionally, a package can contain:
- Dependencies (listed in the pubspec)
- Dart libraries
- Apps
- Resources
- Tests
- Images
- Examples

## Using Packages

### Creating a pubspec

```yaml
name: my_app

dependencies:
  intl: ^0.20.2
  path: ^1.9.1
```

### Getting Dependencies

```bash
dart pub get
```

### Adding Dependencies

```bash
dart pub add vector_math
dart pub add dev:test
```

### Removing Dependencies

```bash
dart pub remove vector_math
```

### Upgrading Dependencies

```bash
dart pub upgrade        # Upgrade within constraints
dart pub upgrade --major-versions  # Upgrade to latest major versions
```

## The pubspec.yaml File

### Required Fields

```yaml
name: my_package
version: 1.0.0
description: A useful Dart package for doing things.
```

### Dependencies

```yaml
dependencies:
  # Hosted on pub.dev
  intl: ^0.20.2
  path: ^1.9.1

  # Git dependency
  transmogrify:
    git:
      url: https://github.com/dart-lang/transmogrify.git
      ref: main

  # Path dependency
  my_local_lib:
    path: ../my_local_lib

  # SDK dependency
  flutter:
    sdk: flutter
```

### Dev Dependencies

```yaml
dev_dependencies:
  test: ^1.24.0
  lints: ^4.0.0
```

### Environment

```yaml
environment:
  sdk: ^3.0.0
  flutter: '>=3.0.0'
```

### Other Fields

```yaml
homepage: https://my-package.dev
repository: https://github.com/user/my_package
issue_tracker: https://github.com/user/my_package/issues
documentation: https://docs.my-package.dev
executables:
  my_tool: main
platforms:
  android:
  ios:
  web:
publish_to: https://pub.dev  # or 'none' to prevent publishing
funding:
  - https://patreon.com/my_package
screenshots:
  - description: 'Main UI'
    path: screenshots/main.png
topics:
  - networking
  - http
  - api
```

## Package Layout

```
my_package/
├── pubspec.yaml          # Package metadata
├── README.md             # Package documentation
├── CHANGELOG.md          # Version history
├── LICENSE               # License file
├── lib/                  # Public library code
│   ├── my_package.dart   # Main library file
│   └── src/              # Private implementation
├── bin/                  # Executable entry points
│   └── my_tool.dart
├── test/                 # Tests
├── example/              # Example usage
├── tool/                 # Development tools
└── benchmark/            # Benchmarks
```

## Publishing Packages

### Pre-publish Checklist

1. Run `dart pub publish --dry-run` to check
2. Ensure `pubspec.yaml` has all required fields
3. Include a `README.md`
4. Include a `LICENSE` file
5. Include a `CHANGELOG.md`

### Publishing

```bash
dart pub publish
```

### Versioning

Follow [semantic versioning](https://semver.org/):
- **MAJOR** — incompatible API changes
- **MINOR** — new functionality, backward compatible
- **PATCH** — bug fixes, backward compatible

### Version Constraints

```yaml
# Caret syntax (recommended) — allows patch and minor updates
dependencies:
  package: ^1.2.3  # >=1.2.3 <2.0.0

# Range
dependencies:
  package: '>=1.0.0 <2.0.0'

# Exact
dependencies:
  package: 1.2.3

# Any
dependencies:
  package: any
```

## Workspaces (Dart 3.6+)

Workspaces allow multiple packages to share dependencies and be developed together:

```yaml
# In the root pubspec.yaml
name: my_workspace
publish_to: none

workspace:
  - packages/client
  - packages/server
  - packages/shared
```

## Package Hooks (Dart 3.6+)

Hooks allow packages to define build-time actions:

```yaml
hooks:
  build:
    script: tool/build.dart
```

## Security

### Audit Dependencies

```bash
dart pub audit
```

### Ignored Advisories

```yaml
ignored_advisories:
  - GHSA-xxxx-xxxx-xxxx
```

### False Secrets

```yaml
false_secrets:
  - test/data/fake_key.txt
```

## Common pub Commands

| Command | Description |
|---------|-------------|
| `dart pub get` | Get dependencies |
| `dart pub add` | Add a dependency |
| `dart pub remove` | Remove a dependency |
| `dart pub upgrade` | Upgrade dependencies |
| `dart pub publish` | Publish to pub.dev |
| `dart pub deps` | Show dependency tree |
| `dart pub outdated` | Check for outdated packages |
| `dart pub cache` | Manage pub cache |
| `dart pub token` | Manage access tokens |
| `dart pub audit` | Check for security advisories |
