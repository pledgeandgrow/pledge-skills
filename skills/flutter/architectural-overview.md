# Flutter Architectural Overview

A high-level overview of the architecture of Flutter, including the core principles and concepts that form its design.

## Overview

Flutter is a cross-platform UI toolkit that uses a single codebase to build apps for mobile, web, and desktop. Flutter's architecture is designed to be:
- **Composable** — Everything is a widget
- **Declarative** — UI is a function of state
- **Fast** — Compiles to native code, renders with its own engine
- **Portable** — Same Dart code runs on all platforms

## Architecture layers

```
┌──────────────────────────────────────────────────┐
│                  Your Flutter App                 │
├──────────────────────────────────────────────────┤
│              Material / Cupertino                 │
│           (Design-specific widgets)               │
├──────────────────────────────────────────────────┤
│              Widget Layer (Dart)                  │
│   (StatelessWidget, StatefulWidget, RenderObject) │
├──────────────────────────────────────────────────┤
│              Rendering Layer (Dart)               │
│  (RenderObject, RenderBox, RenderSliver, etc.)    │
├──────────────────────────────────────────────────┤
│              Flutter Engine (C/C++)               │
│   (Skia/Impeller, Text Layout, Dart Runtime)      │
├──────────────────────────────────────────────────┤
│              Platform Embedder                    │
│   (Android, iOS, Windows, macOS, Linux, Web)      │
├──────────────────────────────────────────────────┤
│              Operating System                     │
└──────────────────────────────────────────────────┘
```

## The embedder

The embedder is the platform-specific code that hosts the Flutter engine. It handles:
- Platform-specific rendering surfaces (GL, Metal, Vulkan, Canvas)
- Input events (touch, mouse, keyboard)
- Platform plugins
- Threading model
- Accessibility integration

Each platform has its own embedder:
- **Android** — Java/Kotlin embedder
- **iOS** — Objective-C/Swift embedder
- **Windows** — C++ embedder
- **macOS** — Objective-C embedder
- **Linux** — C embedder
- **Web** — Dart/JS embedder

## The engine

The Flutter engine is written in C/C++ and provides:
- **Graphics** — Skia (2D) or Impeller (2D/3D) rendering
- **Text** — Text layout and shaping
- **Dart runtime** — JIT and AOT compilation, garbage collection
- **Platform channels** — Communication with platform code
- **Accessibility** — Bridge to platform accessibility services

## The framework (Dart)

The Flutter framework is written in Dart and provides:

### Foundation
- `ChangeNotifier`, `ValueNotifier`
- `Diagnostics` (for inspector)
- `Binding` classes (WidgetsBinding, RendererBinding, etc.)

### Rendering
- `RenderObject` — Base class for rendering
- `RenderBox` — 2D rendering with box constraints
- `RenderSliver` — Sliver-based scrolling rendering
- `Layer` — Compositing layers

### Widgets
- `Widget` — Immutable description of UI
- `StatelessWidget` — No internal state
- `StatefulWidget` — Has mutable state
- `InheritedWidget` — Propagate data down the tree
- `RenderObjectWidget` — Bridge between widgets and render objects

### Material & Cupertino
- Material Design 3 widgets
- Cupertino (iOS-style) widgets

## The widget tree

Flutter builds a tree of widgets. Each widget is an immutable description of part of the UI. When state changes, Flutter creates a new widget tree and diffs it against the old one to determine minimal changes.

### Element tree

The framework maintains an `Element` tree that mirrors the widget tree. Elements are mutable and hold state. When a widget rebuilds, the framework compares the new widget with the old one and updates the element if possible (using `canUpdate()`).

### RenderObject tree

The framework also maintains a `RenderObject` tree that handles layout, painting, and hit-testing. `RenderObjectWidget`s create `RenderObject`s.

## Threading model

Flutter uses a single-threaded execution model with an event loop:

1. **UI Thread** — Runs Dart code, builds widgets, handles input
2. **Raster Thread** — Executes graphics commands (Skia/Impeller)
3. **IO Thread** — Handles async I/O (image decoding, file I/O)
4. **Platform Thread** — Hosts the platform embedder

Use `compute()` or `Isolate.run()` for CPU-intensive work off the UI thread.

## Build, layout, paint, composite

The rendering pipeline:

1. **Build** — Widgets are built into an element tree
2. **Layout** — `RenderObject`s compute sizes and positions
3. **Paint** — `RenderObject`s record painting commands
4. **Composite** — Layers are composited and sent to the engine

## Hot reload

Hot reload works by injecting modified Dart source into the running Dart VM. The VM recompiles the changed code and the framework triggers a rebuild. State is preserved because the element tree is not recreated.

## Key concepts

- **Widget** — Immutable configuration
- **Element** — Mutable instance of a widget in the tree
- **RenderObject** — Handles layout, painting, hit-testing
- **BuildContext** — Handle to the element's location in the tree
- **Key** — Identity for widgets (useful in collections)
- **GlobalKey** — Unique key that can access the element from anywhere

## Further reading

- [Flutter architectural overview](https://docs.flutter.dev/resources/architectural-overview)
- [Inside Flutter](https://docs.flutter.dev/resources/inside-flutter)
- [Widget catalog](https://docs.flutter.dev/ui/widgets)
