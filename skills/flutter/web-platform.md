# Web Platform Integration

Details of how Flutter supports the creation of web experiences.

## Overview

Flutter delivers the same experiences on the web as on mobile. Building on the portability of Dart, the power of the web platform, the flexibility of the Flutter framework, and the performance of WebAssembly, you can build apps for iOS, Android, and the browser from the same codebase. The web is just another device target for your app.

## WebAssembly

Dart and Flutter can compile to WebAssembly (WasmGC), a binary instruction format that enables fast apps on all major browsers. WasmGC provides near-native performance by allowing the Dart garbage collector to integrate directly with the browser's garbage collector.

### Building with Wasm

```bash
flutter build web --wasm
```

### Browser support for WasmGC

- Chrome 119+
- Firefox 120+
- Safari 17.4+

For browsers without WasmGC support, Flutter falls back to JavaScript compilation automatically.

## Web renderers

| Renderer | Description | Best for |
|----------|-------------|----------|
| CanvasKit (default) | Renders to WebGL/Canvas | Most apps, better performance |
| HTML | Uses DOM elements | Smaller download, text-heavy |
| WasmGC | Compiles to WebAssembly | Best performance (latest) |

```bash
flutter build web --web-renderer canvaskit
flutter build web --web-renderer html
flutter build web --wasm
```

## Building a web app

```bash
# Build for web
flutter build web --release

# Build with specific renderer
flutter build web --web-renderer canvaskit

# Build with Wasm
flutter build web --wasm

# Build with base href (for subdirectory deployment)
flutter build web --base-href "/myapp/"

# Run on web
flutter run -d chrome
flutter run -d web-server --web-port 8080
```

## Web-specific considerations

### Responsive design

Web apps need to handle various screen sizes, including desktop:

```dart
LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth > 1200) {
      return _buildDesktopLayout();
    } else if (constraints.maxWidth > 600) {
      return _buildTabletLayout();
    }
    return _buildMobileLayout();
  },
)
```

### Keyboard and mouse

Handle keyboard and mouse input for desktop web:

```dart
Focus(
  onKeyEvent: (node, event) {
    if (event.logicalKey == LogicalKeyboardKey.enter) {
      // Handle Enter key
    }
    return KeyEventResult.ignored;
  },
  child: MouseRegion(
    onHover: (event) {
      // Handle mouse hover
    },
    child: MyWidget(),
  ),
)
```

### URL strategy

Configure URL strategy (hash vs path):

```dart
import 'package:flutter_web_plugins/url_strategy.dart';

void main() {
  usePathUrlStrategy();  // Use path-based URLs (default)
  runApp(MyApp());
}
```

### SEO

Flutter web renders in a canvas, which limits SEO. For text-rich, static content, consider:
- Using the `jaspr` package for server-side rendered Dart websites
- Embedding Flutter for interactive components within a traditional website

### Platform detection

```dart
import 'package:flutter/foundation.dart';

if (kIsWeb) {
  // Web-specific code
}

// Check web renderer
final isWasm = kIsWeb && const bool.fromEnvironment('dart.library.js_util');
```

## Deploying web apps

### Firebase Hosting

```bash
flutter build web --release
firebase init hosting
firebase deploy
```

### GitHub Pages

```bash
flutter build web --release --base-href "/my-repo/"
# Copy build/web contents to gh-pages branch
```

### Any static server

Copy `build/web` to any web server (nginx, Apache, etc.).

## Web limitations

- No access to native platform APIs
- No `dart:io` (use `http` package instead of `dart:io` HttpClient)
- Limited file system access
- No background processing
- Canvas-based rendering limits SEO
- Large initial download (framework + app)
- Some packages are not web-compatible
