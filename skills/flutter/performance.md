# Performance

Evaluating and improving the performance of your Flutter app.

## Performance metrics

Key metrics to track:

- **Frame rate** — Target 60fps (or 120fps on high-refresh displays)
- **Jank** — Frames that take longer than 16ms (60fps) or 8ms (120fps)
- **App size** — Download size and install size
- **Memory usage** — Peak and average memory consumption
- **Startup time** — Time to first frame
- **Energy usage** — Battery impact

## Measuring performance

### DevTools Performance view

Use the Performance view in DevTools to:
- Identify janky frames
- Analyze widget rebuilds
- Profile CPU usage
- Track shader compilation

### Flutter performance overlay

Enable the performance overlay:

```dart
MaterialApp(
  showPerformanceOverlay: true,
  home: MyWidget(),
)
```

### Timeline tracing

```dart
import 'dart:developer';

Timeline.startSync('my-operation');
// ... expensive operation
Timeline.finishSync();
```

### Benchmarking

```dart
test('My benchmark', () {
  benchmark(() {
    // Code to benchmark
  });
});
```

## Improving rendering performance

### Avoid expensive operations in build()

```dart
// Bad: expensive computation on every rebuild
@override
Widget build(BuildContext context) {
  final sorted = items.sort((a, b) => a.compareTo(b)); // Expensive!
  return ListView(children: sorted.map((e) => Text(e)).toList());
}

// Good: cache or compute outside build
```

### Use const constructors

```dart
// Good — const widgets are cached and not rebuilt
const Padding(
  padding: EdgeInsets.all(8.0),
  child: Text('Hello'),
)
```

### Use RepaintBoundary

Isolate expensive painting from the rest of the tree:

```dart
RepaintBoundary(
  child: ExpensiveWidget(),
)
```

### Use ListView.builder for long lists

```dart
// Bad: builds all children
ListView(children: items.map((e) => ItemWidget(e)).toList())

// Good: only builds visible children
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ItemWidget(items[index]),
)
```

### Minimize widget tree depth

Flatten widget trees where possible. Avoid unnecessary nesting.

### Use const where possible

Const widgets are canonicalized and never rebuilt:

```dart
const SizedBox(height: 16)
```

### Avoid rebuilding entire subtrees

Use `Selector`, `Consumer`, or granular state management:

```dart
// Only rebuilds when 'count' changes
Selector<MyModel, int>(
  selector: (_, model) => model.count,
  builder: (_, count, __) => Text('$count'),
)
```

## Shader compilation jank

First-time animations may cause shader compilation jank. Pre-warm shaders:

```bash
flutter run --profile --cache-sksl --purge-persistent-cache
```

Or use SkSL warmup in the app:

```dart
class MyShaderWarmup extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Draw all complex animations once
  }
}
```

## App size

### Measuring app size

```bash
flutter build apk --release --analyze-size
flutter build ios --release --analyze-size
```

### Reducing app size

1. Use `--split-per-abi` for Android to build separate APKs
2. Use App Bundles (`.aab`) instead of APKs
3. Remove unused assets
4. Compress images (use `.webp`)
5. Use `--obfuscate` to strip debug symbols
6. Enable R8/ProGuard on Android
7. Use tree-shaking (automatic for release builds)
8. Minimize dependencies

## Memory management

### Dispose resources

```dart
@override
void dispose() {
  _controller.dispose();
  _scrollController.dispose();
  _streamSubscription.cancel();
  super.dispose();
}
```

### Use `const` and `const` constructors

Const widgets don't allocate new instances.

### Avoid memory leaks

- Cancel `StreamSubscription` in `dispose()`
- Dispose `AnimationController`, `TextEditingController`, `ScrollController`
- Remove listeners
- Use `WeakReference` for caches

## Performance best practices

1. Profile in profile mode, not debug mode
2. Use `RepaintBoundary` for complex widgets
3. Prefer `const` widgets
4. Use `ListView.builder` for long lists
5. Avoid expensive work in `build()` methods
6. Cache expensive computations
7. Dispose resources properly
8. Minimize widget tree depth
9. Use granular state management to minimize rebuilds
10. Test on low-end devices
11. Pre-warm shaders for smooth first-run animations
12. Monitor frame rate with performance overlay
