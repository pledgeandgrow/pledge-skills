# Performance Profiling

Diagnosing UI performance issues in Flutter.

## Performance fundamentals

Flutter targets 60fps (16ms per frame) or 120fps (8ms per frame) on high-refresh displays. Each frame must complete build, layout, paint, and composite within the frame budget.

## Measuring performance

### Performance overlay

Enable the on-screen performance overlay:

```dart
MaterialApp(
  showPerformanceOverlay: true,
  home: MyWidget(),
)
```

The overlay shows:
- **GPU thread** — Raster time (top graph)
- **UI thread** — Build + layout time (bottom graph)
- Green bars = within budget, Red bars = jank

### DevTools Performance view

Open DevTools for detailed performance analysis:

```bash
flutter run --trace-startup --profile
```

Features:
- Frame timeline (build, layout, paint, raster)
- CPU profiler
- Widget rebuild profiler
- Flutter events timeline

### Profile mode

Always profile in profile mode, not debug mode:

```bash
flutter run --profile
```

Profile mode:
- AOT compilation (like release)
- No debugging overhead
- DevTools and tracing enabled
- No hot reload

## Identifying jank

### UI thread jank

Causes:
- Expensive `build()` methods
- Excessive widget rebuilds
- Synchronous work blocking the UI thread
- Large widget trees

Solutions:
- Move expensive computation off the UI thread
- Use `const` widgets to prevent rebuilds
- Use `RepaintBoundary` to isolate painting
- Use granular state management (`Selector`)

### Raster thread jank

Causes:
- Complex painting operations
- Shader compilation (first run)
- Large images
- Many layers

Solutions:
- Pre-warm shaders
- Optimize images (compress, cache)
- Reduce layer count
- Use `RepaintBoundary`

## Widget rebuild profiler

In DevTools, the widget rebuild profiler shows which widgets rebuild and how often:

1. Open DevTools → Performance
2. Enable "Track widget builds"
3. Interact with your app
4. Identify widgets that rebuild too frequently

## Timeline tracing

Add custom timeline events:

```dart
import 'dart:developer';

Timeline.startSync('my-expensive-operation');
// ... expensive code
Timeline.finishSync();
```

## Common performance issues

### 1. Unnecessary rebuilds

```dart
// Bad: rebuilds entire subtree
Consumer<MyModel>(
  builder: (context, model, child) {
    return Column(
      children: [
        Text(model.title),          // Depends on model
        const SizedBox(height: 16), // Doesn't depend on model
        Text(model.subtitle),       // Depends on model
      ],
    );
  },
)

// Good: use child for static parts
Consumer<MyModel>(
  builder: (context, model, child) {
    return Column(
      children: [
        Text(model.title),
        child!,  // Static widget
        Text(model.subtitle),
      ],
    );
  },
  child: const SizedBox(height: 16),
)
```

### 2. Expensive build methods

```dart
// Bad: sorts on every rebuild
@override
Widget build(BuildContext context) {
  final sorted = items..sort((a, b) => a.compareTo(b));
  return ListView(children: sorted.map((e) => Text(e)).toList());
}

// Good: cache sorted list
List<String> _sortedItems = [];

void _updateItems() {
  _sortedItems = items..sort((a, b) => a.compareTo(b));
}
```

### 3. Missing const

```dart
// Bad: creates new instance each rebuild
Padding(padding: EdgeInsets.all(8.0), child: Text('Hello'))

// Good: cached as const
const Padding(padding: EdgeInsets.all(8.0), child: Text('Hello'))
```

### 4. Long lists without builder

```dart
// Bad: builds all children
ListView(children: items.map((e) => ItemWidget(e)).toList())

// Good: builds only visible children
ListView.builder(itemCount: items.length, itemBuilder: (_, i) => ItemWidget(items[i]))
```

## Shader compilation jank

First-time animations may cause shader compilation jank. Pre-warm shaders:

```bash
flutter run --profile --cache-sksl --purge-persistent-cache
```

Capture the SkSL and bundle it with your app:

```bash
flutter build apk --release --bundle-sksl-path path/to/sksl.json
```

## Best practices

1. Always profile in profile mode
2. Use the performance overlay during development
3. Use `const` widgets everywhere possible
4. Use `RepaintBoundary` for complex widgets
5. Use `ListView.builder` for long lists
6. Minimize widget tree depth
7. Use granular state management
8. Move expensive computation to isolates
9. Pre-warm shaders for smooth first-run
10. Test on low-end devices
