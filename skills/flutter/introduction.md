# Flutter Introduction

Flutter is Google's UI toolkit for building beautiful, natively compiled applications for mobile, web, desktop, and embedded from a single Dart codebase. It uses a widget-based architecture inspired by React, where UI is described declaratively and the framework handles diffing and rendering.

## Key characteristics

- **Single codebase**: Compile to Android, iOS, web, Windows, macOS, Linux, and embedded
- **Widget-based**: Everything is a widget — composition over inheritance
- **Hot reload**: See changes instantly during development
- **Dart language**: Client-optimized, null-safe, AOT compiled
- **Skia/Impeller rendering**: Own rendering engine, not native widgets
- **Material 3 & Cupertino**: Built-in design systems for Android and iOS

## Installation

### Quick start (recommended)

Use VS Code or another Code OSS-based editor to quickly install and set up Flutter:

1. Install the Flutter SDK
2. Install the Flutter extension for VS Code
3. Run `flutter doctor` to verify setup
4. Create and run your first app

### Custom setup

1. Install the Flutter SDK from [docs.flutter.dev/install](https://docs.flutter.dev/install)
2. Set up target platform tooling (Android Studio, Xcode, etc.)
3. Add Flutter to your `PATH`
4. Run `flutter doctor`

### Try online

Use [DartPad](https://dartpad.dev) to quickly build and run simple single-file Flutter apps on the web without any local setup.

## The minimal Flutter app

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(
    const Center(
      child: Text(
        'Hello, world!',
        textDirection: TextDirection.ltr,
        style: TextStyle(color: Colors.blue),
      ),
    ),
  );
}
```

The `runApp()` function takes the given `Widget` and makes it the root of the widget tree. The framework forces the root widget to cover the screen.

## Widget fundamentals

When writing an app, you'll author new widgets that are subclasses of either `StatelessWidget` or `StatefulWidget`, depending on whether your widget manages any state.

A widget's main job is to implement a `build()` function, which describes the widget in terms of other, lower-level widgets. The framework builds those widgets in turn until the process bottoms out in widgets that represent the underlying `RenderObject`, which computes and describes the geometry of the widget.

### StatelessWidget

```dart
class MyWidget extends StatelessWidget {
  const MyWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return const Text('Hello, world!');
  }
}
```

### StatefulWidget

```dart
class CounterWidget extends StatefulWidget {
  const CounterWidget({super.key});

  @override
  State<CounterWidget> createState() => _CounterWidgetState();
}

class _CounterWidgetState extends State<CounterWidget> {
  int _count = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Count: $_count'),
        ElevatedButton(
          onPressed: () => setState(() => _count++),
          child: const Text('Increment'),
        ),
      ],
    );
  }
}
```

## Learning pathway

1. Install Flutter and run `flutter doctor`
2. Create your first app with `flutter create my_app`
3. Learn widget basics — `Container`, `Row`, `Column`, `Text`, `Image`
4. Understand layout and constraints
5. Add interactivity with `StatefulWidget`
6. Learn navigation and routing
7. Explore state management options
8. Build for your target platform

## Coming from another platform

Flutter provides guides for developers coming from:
- **Android** — [flutter-for/android-devs](https://docs.flutter.dev/flutter-for/android-devs)
- **SwiftUI** — [flutter-for/swiftui-devs](https://docs.flutter.dev/flutter-for/swiftui-devs)
- **UIKit** — [flutter-for/uikit-devs](https://docs.flutter.dev/flutter-for/uikit-devs)
- **React Native** — [flutter-for/react-native-devs](https://docs.flutter.dev/flutter-for/react-native-devs)
- **Xamarin.Forms** — [flutter-for/xamarin-forms-devs](https://docs.flutter.dev/flutter-for/xamarin-forms-devs)

## Flutter version

The documentation reflects Flutter 3.44.0. Flutter ships on three channels:

- **stable** — Recommended for production
- **beta** — Pre-release for testing
- **master** — Latest development builds

Upgrade with `flutter upgrade`. Check [breaking changes](https://docs.flutter.dev/release/breaking-changes) when upgrading.
