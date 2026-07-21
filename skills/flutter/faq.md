# FAQ

Frequently asked questions and answers about Flutter.

## General

### What is Flutter?

Flutter is Google's UI toolkit for building beautiful, natively compiled applications for mobile, web, desktop, and embedded from a single Dart codebase.

### What programming language does Flutter use?

Flutter uses Dart, a client-optimized language for fast apps on any platform. Dart supports sound null safety, async programming, and AOT compilation.

### Why does Flutter use Dart?

Dart was chosen because:
- AOT compiles to native code for fast startup and performance
- JIT compiles for fast development cycles (hot reload)
- Null safety prevents null errors at compile time
- Object-oriented with familiar C-style syntax
- No separate layout language (UI is code)

### What platforms does Flutter support?

Android, iOS, web, Windows, macOS, Linux, and embedded devices.

### Is Flutter free and open source?

Yes, Flutter is free and open source, licensed under a BSD-style license.

## Performance

### Is Flutter fast?

Yes. Flutter compiles to native ARM code (mobile/desktop) and JavaScript/WasmGC (web). It uses its own rendering engine (Skia/Impeller) for consistent performance across platforms.

### Why does my app jank?

Common causes:
- Expensive operations in `build()` methods
- Long lists without `ListView.builder`
- Excessive widget rebuilds
- Shader compilation on first run
- Main thread blocking

See [performance.md](performance.md) for optimization tips.

### How do I reduce app size?

- Use App Bundles (`.aab`) for Android
- Use `--split-per-abi`
- Compress images
- Remove unused assets
- Use `--obfuscate`
- Minimize dependencies

## Development

### What's the difference between StatelessWidget and StatefulWidget?

- `StatelessWidget` — Immutable, no internal state, rebuilds when parent rebuilds
- `StatefulWidget` — Has mutable state, calls `setState()` to trigger rebuild

### Should I use hot reload or hot restart?

- **Hot reload** (`r`) — Injects code changes, preserves state. Use for most changes.
- **Hot restart** (`R`) — Restarts app, loses state. Use for changes to `main()` or `initState()`.

### What is the equivalent of a ListView in Flutter?

`ListView` is the scrolling widget. Use `ListView.builder` for long lists:

```dart
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ListTile(title: Text(items[index])),
)
```

### How do I navigate between screens?

Use `Navigator.push()` and `Navigator.pop()`, or the `go_router` package for declarative routing. See [navigation.md](navigation.md).

### What state management should I use?

Start with `setState()` for local state. Use `Provider` for app-level state. Consider `Riverpod` or `Bloc` for complex apps. See [state-management.md](state-management.md).

## Platform integration

### Can I use native platform APIs?

Yes, through platform channels or existing plugins from pub.dev. See [platform-integration.md](platform-integration.md).

### Can I add Flutter to an existing app?

Yes, using add-to-app. Flutter can be embedded as a module in existing Android, iOS, macOS, and web apps. See [add-to-app.md](add-to-app.md).

### Does Flutter use native widgets?

No, Flutter draws its own widgets using its rendering engine (Skia/Impeller). This ensures pixel-perfect consistency across platforms. Cupertino and Material widgets mimic native look and feel.

## Web

### Can Flutter build web apps?

Yes. Flutter compiles to JavaScript and WasmGC for web. Use `flutter build web`.

### Does Flutter web support SEO?

Flutter web renders in a canvas, which limits SEO. For content-heavy sites, consider server-side rendering or a different framework.

### What web renderer should I use?

- **CanvasKit** (default) — Better performance, larger download
- **HTML** — Smaller download, uses DOM elements
- **WasmGC** — Latest, best performance (requires browser support)

## Packages

### Where do I find Flutter packages?

Browse [pub.dev](https://pub.dev) for Flutter and Dart packages.

### What are Flutter Favorite packages?

Flutter Favorite packages meet high quality standards set by the Flutter team. See [packages-plugins.md](packages-plugins.md).

## Testing

### How do I test my Flutter app?

Flutter supports unit tests, widget tests, and integration tests. See [testing.md](testing.md).

### Can I run Flutter tests in CI?

Yes, use `flutter test` for unit/widget tests and `flutter test integration_test/` for integration tests. Works with GitHub Actions, GitLab CI, etc.
