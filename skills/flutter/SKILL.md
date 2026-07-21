---
name: flutter
version: Flutter 3.44
tags: [flutter, ui, widgets, mobile, web, desktop, dart, material, cupertino, state-management, navigation, animations, platform-integration, testing, deployment]
description: Flutter 3.44 — widget catalog, layouts, interactivity, animations, navigation, assets, adaptive/responsive design, accessibility, i18n, state management, data & backend (networking, serialization, Firebase, persistence), app architecture (MVVM, DI), platform integration (Android, iOS, web, Windows, macOS, Linux, platform channels), packages & plugins, deployment (Android, iOS, web, macOS, Windows, Linux, CD), testing (unit, widget, integration), performance, tools (DevTools, hot reload, SDK), add-to-app, releases, FAQ
---

# Flutter Skill

> Flutter 3.44 — Google's UI toolkit for building beautiful, natively compiled applications for mobile, web, desktop, and embedded from a single Dart codebase.

## Quick Reference

| Topic | File |
|------|------|
| Introduction (install, get-started, widget fundamentals, learning pathway) | `introduction.md` |
| Widget Catalog (Material, Cupertino, basics, animation, input, layout, scrolling, text, styling) | `widgets.md` |
| Layouts (Row, Column, Stack, ListView, GridView, constraints, LayoutBuilder, MediaQuery) | `layout.md` |
| Scrolling (ListView, GridView, Slivers, CustomScrollView, ScrollController, physics) | `scrolling.md` |
| Interactivity (StatefulWidget, setState, gestures, input, forms, Dismissible) | `interactivity.md` |
| Animations (implicit, explicit, AnimationController, Tween, Hero, staggered, curves) | `animations.md` |
| Animations API Overview (Animation class, CurvedAnimation, Tween, listeners, status) | `animations-overview.md` |
| Navigation & Routing (Navigator, MaterialPageRoute, go_router, deep linking, nested) | `navigation.md` |
| Deep Linking (App Links, Universal Links, URL strategies, Router widget, testing) | `deep-linking.md` |
| URL Strategies (hash vs path, server config, base href, go_router) | `url-strategies.md` |
| Assets & Images (declaring assets, resolution-aware, fonts, icons, platform assets) | `assets-and-images.md` |
| Adaptive & Responsive Design (MediaQuery, LayoutBuilder, breakpoints, platform detection) | `adaptive-responsive.md` |
| Accessibility & i18n (Semantics, screen readers, ARB files, intl, RTL, large fonts) | `accessibility-i18n.md` |
| State Management (setState, Provider, Riverpod, Bloc, ValueNotifier, InheritedWidget) | `state-management.md` |
| Data & Backend (HTTP, dio, JSON serialization, Firebase, Firestore, Auth, persistence) | `data-backend.md` |
| Firebase (Firestore, Auth, Storage, Cloud Functions, Messaging, Crashlytics, Analytics) | `firebase.md` |
| Networking (HTTP package, dio, WebSockets, interceptors, error handling) | `networking.md` |
| Serialization (JSON, json_serializable, freezed, JsonKey, code generation) | `serialization.md` |
| Persistence (SharedPreferences, sqflite, Hive, Drift, file storage, path_provider) | `persistence.md` |
| App Architecture (MVVM, separation of concerns, repositories, DI, design patterns) | `app-architecture.md` |
| Architectural Overview (engine, embedder, framework layers, threading, rendering pipeline) | `architectural-overview.md` |
| Platform Integration (Android, iOS, web, Windows, macOS, Linux, platform channels, plugins) | `platform-integration.md` |
| Platform Channels (MethodChannel, EventChannel, Pigeon, platform-specific Dart code) | `platform-channels.md` |
| Platform Views (AndroidView, UiKitView, PlatformViewLink, hybrid composition) | `platform-views.md` |
| Android Platform (JetPack APIs, splash screen, Platform Views, restore state, predictive back, ChromeOS) | `android-platform.md` |
| iOS Platform (launch screen, Platform Views, app extensions, Apple frameworks, App Clip, Info.plist) | `ios-platform.md` |
| Web Platform (WebAssembly, renderers, URL strategy, SEO, deployment, browser support) | `web-platform.md` |
| Windows Platform (setup, building, external windows, window management, MSIX deployment) | `windows-platform.md` |
| macOS Platform (setup, building, Platform Views, entitlements, sandbox, App Store deployment) | `macos-platform.md` |
| Linux Platform (setup, building, GTK, themes, Snap/Flatpak/AppImage/deb deployment) | `linux-platform.md` |
| Packages & Plugins (pub.dev, using packages, developing packages, federated plugins, publishing) | `packages-plugins.md` |
| Deployment (Android, iOS, web, macOS, Windows, Linux, signing, flavors, CD, obfuscation) | `deployment.md` |
| Testing & Debugging (unit, widget, integration tests, mocktail, DevTools, build modes, errors) | `testing.md` |
| Performance (metrics, rendering, app size, memory, shader jank, RepaintBoundary) | `performance.md` |
| Performance Profiling (DevTools, frame timeline, widget rebuild profiler, jank diagnosis) | `performance-profiling.md` |
| App Size (measuring, reducing, App Bundles, split APKs, obfuscation, deferred components) | `app-size.md` |
| Tools & Techniques (Flutter SDK CLI, DevTools, hot reload, VS Code, Android Studio, flutter fix) | `tools.md` |
| Add to App (multi-engine, multi-view, Flutter module, Android/iOS/web integration) | `add-to-app.md` |
| Release & Updates (channels, upgrading, breaking changes, SDK archive, what's new) | `release.md` |
| Platform Adaptations (scroll physics, transitions, text selection, fonts, adaptive patterns) | `platform-adaptations.md` |
| FAQ (general, performance, development, platform integration, web, packages, testing) | `faq.md` |
| Glossary (Adaptive, Cupertino, Dart, Declarative, Embedder, Engine, Frame, Hot reload, Impeller, Jank, Material, RenderObject, Sliver, Widget) | `glossary.md` |

---

## Core Concepts

- **Everything is a Widget**: Flutter UI is built by composing widgets. `StatelessWidget` for immutable UI, `StatefulWidget` for stateful UI with `setState()`.
- **Widget Tree**: The framework diffs widget descriptions to determine minimal changes in the render tree.
- **Constraints Flow Down**: Parents pass constraints to children. Children determine their size. Parents position children.
- **Hot Reload**: Inject code changes into the running Dart VM without losing state.
- **Declarative UI**: Widgets describe what the UI should look like given current state. The framework handles the rest.
- **Single Codebase**: Compile to Android, iOS, web, Windows, macOS, Linux, and embedded from one codebase.
- **Skia/Impeller Rendering**: Flutter draws its own widgets, ensuring pixel-perfect consistency across platforms.
- **Material 3 & Cupertino**: Two built-in design systems for Android and iOS aesthetics.

## Official Documentation

- [Flutter docs](https://docs.flutter.dev/)
- [Widget catalog](https://docs.flutter.dev/ui/widgets)
- [API reference](https://api.flutter.dev)
- [Cookbook](https://docs.flutter.dev/cookbook)
- [Sample apps](https://docs.flutter.dev/cookbook)
- [pub.dev](https://pub.dev)
- [Flutter blog](https://blog.flutter.dev)
- [Flutter YouTube](https://www.youtube.com/@flutterdev)
