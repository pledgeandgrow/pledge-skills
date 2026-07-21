# Packages & Plugins

Content covering using and developing packages and plugins for Flutter apps.

## Using packages

### Finding packages

Browse packages on [pub.dev](https://pub.dev). Look for:
- **Flutter Favorite** — Packages that meet high quality standards
- **Verified publishers** — Packages from verified organizations
- High popularity and maintenance scores

### Adding a package

```bash
flutter pub add package_name
```

Or manually in `pubspec.yaml`:

```yaml
dependencies:
  cached_network_image: ^3.3.0
```

Then run:

```bash
flutter pub get
```

### Importing

```dart
import 'package:cached_network_image/cached_network_image.dart';
```

## Package dependency management

### Version constraints

```yaml
dependencies:
  # Caretaker syntax: ^1.2.3 means >=1.2.3 <2.0.0
  package_a: ^1.2.3

  # Exact version
  package_b: 1.2.3

  # Range
  package_c: '>=1.2.3 <2.0.0'

  # Any version (not recommended)
  package_d: any

  # Git dependency
  package_e:
    git:
      url: https://github.com/user/package_e.git
      ref: main

  # Path dependency
  package_f:
    path: ../package_f
```

### Resolving conflicts

```bash
# Show dependency tree
flutter pub deps

# Outdated packages
flutter pub outdated

# Upgrade within constraints
flutter pub upgrade

# Upgrade ignoring constraints
flutter pub upgrade --major-versions

# Downgrade
flutter pub downgrade
```

### pubspec.lock

The `pubspec.lock` file records exact versions. Commit it for apps, don't commit for packages.

## Developing packages & plugins

### Package types

- **Dart package**: Written in Dart only, no platform-specific code
- **Plugin package**: Contains platform-specific code (Android, iOS, web, etc.)
- **FFI plugin**: Uses `dart:ffi` for native interop
- **Module**: For add-to-app (Flutter module)

### Creating a package

```bash
flutter create --template=package my_package
```

### Creating a plugin

```bash
flutter create --template=plugin --platforms=android,ios,web my_plugin
```

### Package structure

```
my_package/
├── lib/
│   ├── my_package.dart       # Main entry point
│   ├── src/
│   │   ├── feature_a.dart
│   │   └── feature_b.dart
│   └── my_package.dart
├── example/                  # Example app
├── test/                     # Tests
├── CHANGELOG.md
├── README.md
├── LICENSE
└── pubspec.yaml
```

### Plugin structure (federated)

```
my_plugin/
├── lib/
│   ├── my_plugin.dart              # App-facing API
│   └── my_plugin_platform_interface.dart  # Platform interface
├── android/
│   ├── build.gradle
│   └── src/main/kotlin/.../MyPlugin.kt
├── ios/
│   ├── my_plugin.podspec
│   └── Classes/MyPlugin.swift
├── example/
└── pubspec.yaml
```

### Publishing a package

1. Check `pubspec.yaml` is complete
2. Run `flutter pub publish --dry-run` to validate
3. Run `flutter pub publish`

### pubspec.yaml for packages

```yaml
name: my_package
description: A Flutter package for doing X.
version: 1.0.0
homepage: https://github.com/user/my_package

environment:
  sdk: '>=3.0.0 <4.0.0'
  flutter: '>=3.0.0'

dependencies:
  flutter:
    sdk: flutter

dev_dependencies:
  flutter_test:
    sdk: flutter
  mocktail: ^1.0.0
```

## Flutter Favorite program

Packages designated as Flutter Favorite meet these criteria:
- Provides useful functionality
- High code quality
- Good documentation
- Well-maintained
- Follows best practices
- Has tests

## Background processes

For background processes:
- `workmanager` — Background task scheduling
- `flutter_background_service` — Long-running background services
- `firebase_messaging` — Background push notification handling

## Swift Package Manager

Flutter integrates with Swift Package Manager for iOS/macOS dependencies. Configure in `pubspec.yaml`:

```yaml
flutter:
  uses-swift-package-manager: true
```

## Best practices

1. Use Flutter Favorite packages when available
2. Pin versions with caret syntax (`^x.y.z`)
3. Check package maintenance status before using
4. Read the CHANGELOG before upgrading
5. Test after upgrading dependencies
6. Keep `pubspec.lock` committed for apps
7. Document your package with a good README
8. Include examples in your package
9. Write tests for your package
10. Follow semantic versioning
