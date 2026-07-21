# Glossary

A glossary reference for terminology used across docs.flutter.dev.

## Adaptive

Designing an app to look and feel native on each platform. Adaptive apps adjust their appearance, navigation patterns, and interactions to match platform conventions while sharing the same codebase.

**Related docs**: [Adaptive and responsive design](https://docs.flutter.dev/ui/adaptive-responsive), [Platform adaptations](https://docs.flutter.dev/resources/platform-adaptations)

## Agent skill

A structured set of markdown files that document a technology, framework, or language for AI agents. Each skill contains a `SKILL.md` entry point and individual topic files.

## Cupertino

A set of Flutter widgets that implement Apple's iOS design language. Cupertino widgets provide high-fidelity iOS-style UI components like `CupertinoNavigationBar`, `CupertinoButton`, `CupertinoSwitch`, etc.

**Related docs**: [Cupertino widgets](https://docs.flutter.dev/ui/widgets/cupertino)

## Dart

The programming language used by Flutter. Dart is a client-optimized language for fast apps on any platform, featuring sound null safety, async programming, and AOT compilation.

**Related docs**: [dart.dev](https://dart.dev)

## Declarative

A programming paradigm where UI is described as a function of state. Flutter uses a declarative model: widgets describe what the UI should look like given the current state, and the framework handles updating the actual UI.

**Related docs**: [Building user interfaces](https://docs.flutter.dev/ui)

## Embedder

The platform-specific code that hosts the Flutter engine. The embedder handles rendering surfaces, input events, and platform integration for each target platform (Android, iOS, Windows, macOS, Linux, web).

**Related docs**: [Architectural overview](https://docs.flutter.dev/resources/architectural-overview)

## Engine

The Flutter engine, written in C/C++, provides the low-level rendering (Skia/Impeller), text layout, Dart runtime, and platform channel infrastructure. The engine is embedded into each platform by the embedder.

**Related docs**: [Architectural overview](https://docs.flutter.dev/resources/architectural-overview)

## Frame

A single rendering cycle in Flutter. Each frame involves building widgets, laying out render objects, painting, and compositing. Flutter targets 60 frames per second (or 120fps on high-refresh displays).

**Related docs**: [Performance](https://docs.flutter.dev/perf)

## Hot reload

A Flutter feature that injects updated Dart source code into the running Dart VM without losing app state. Hot reload allows developers to see code changes instantly during development.

**Related docs**: [Hot reload](https://docs.flutter.dev/tools/hot-reload)

## Hot restart

Restarts the Flutter app, resetting all state. Unlike hot reload, hot restart loses all app state and starts fresh. Useful when changes affect `main()` or `initState()`.

## Impeller

Flutter's modern rendering backend, replacing Skia on iOS/macOS and Android. Impeller pre-compiles shaders to eliminate shader compilation jank and provides better performance.

**Related docs**: [Impeller](https://docs.flutter.dev/perf/impeller)

## Jank

When a frame takes longer than the budget (16ms for 60fps, 8ms for 120fps), causing a visible stutter. Common causes include expensive `build()` methods, shader compilation, and main thread blocking.

**Related docs**: [Performance profiling](https://docs.flutter.dev/perf/ui-performance)

## Material

Google's design system. Flutter includes a comprehensive set of Material 3 widgets that implement the Material Design specification.

**Related docs**: [Material widgets](https://docs.flutter.dev/ui/widgets/material)

## Null safety

A Dart feature that prevents null reference errors at compile time. With sound null safety, the compiler guarantees that values marked as non-nullable are never null.

**Related docs**: [Null safety](https://dart.dev/null-safety)

## Prop drilling

Passing data through multiple layers of widgets to reach a deeply nested child. Can be avoided with `InheritedWidget`, `Provider`, or other state management solutions.

**Related docs**: [State management](https://docs.flutter.dev/data-and-backend/state-mgmt)

## pub

The package manager for Dart and Flutter. `pub.dev` hosts thousands of packages. Use `flutter pub get`, `flutter pub add`, and `flutter pub publish` to manage packages.

**Related docs**: [Packages & plugins](https://docs.flutter.dev/packages-and-plugins)

## RenderObject

The low-level object in Flutter's rendering tree that handles layout, painting, and hit-testing. `RenderBox` and `RenderSliver` are common subclasses. Widgets create render objects via `RenderObjectWidget`.

**Related docs**: [Building user interfaces](https://docs.flutter.dev/ui)

## Sliver

A portion of a scrollable area. Slivers are used with `CustomScrollView` to create complex scrolling effects. Common slivers include `SliverList`, `SliverGrid`, `SliverAppBar`, and `SliverPersistentHeader`.

**Related docs**: [Scrolling](https://docs.flutter.dev/ui/scrolling)

## Viewport

The visible area of a scrollable widget. The viewport determines which slivers are visible and needs to be rendered. `Viewport` is the widget that manages this.

## Widget

The basic building block of Flutter UIs. Widgets are immutable descriptions of part of the UI. Everything in Flutter is a widget — layout, styling, animations, and even the app itself.

**Related docs**: [Widget catalog](https://docs.flutter.dev/ui/widgets)
