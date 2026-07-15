# Performance

---

## Frame Basics

- iOS/Android display at least 60 FPS → 16.67ms per frame
- Two frame rates to monitor:
  - **JS thread** — JavaScript execution, React reconciliation
  - **UI thread** — native rendering, animations, gestures
- Dropped frame = UI appears unresponsive

## Common Performance Problems

### Development Mode
JS performance suffers greatly in dev mode. **Always test performance in release builds.**

### console.log Statements
Remove before bundling — causes big bottleneck in JS thread:
```json
// .babelrc
{
  "env": {
    "production": {
      "plugins": ["transform-remove-console"]
    }
  }
}
```

### FlatList Performance
- Use `getItemLayout` to skip measurement
- Consider `FlashList` or `Legend List` for better performance
- Use `removeClippedSubviews`, tune `initialNumToRender`, `maxToRenderPerBatch`, `windowSize`

### JS Thread Overload
- Use `InteractionManager` to defer heavy work after animations
- Use `LayoutAnimation` for fire-and-forget animations (not affected by JS thread drops)
- `Animated` with `useNativeDriver: true` runs on UI thread

### UI Thread FPS Drops
- `renderToHardwareTextureAndroid` — helps with alpha compositing (text over images)
- `shouldRasterizeIOS` — already enabled by default on iOS
- Don't overuse hardware texture props — monitor memory usage

### Touch Responsiveness
- Use `Pressable` (preferred over old `TouchableOpacity`, `TouchableHighlight`)
- `onPressIn` for immediate feedback (don't wait for `onPress`)
- `hitSlop` to expand touch area

## Performance Best Practices

1. Use `useNativeDriver: true` for animations
2. Use `React.memo` / `useMemo` / `useCallback` to prevent unnecessary re-renders
3. Avoid inline functions in render for performance-critical components
4. Use `getItemLayout` on FlatList for fixed-height items
5. Remove `console.log` in production
6. Test in release mode, not dev mode
7. Use `InteractionManager.runAfterInteractions` for heavy work after animations

---

## Optimizing FlatList Configuration

### Key Props

| Prop | Default | Description |
|------|---------|-------------|
| `removeClippedSubviews` | `false` | Detach off-screen views from native hierarchy. Reduces main thread work but can have bugs with transforms/absolute positioning. |
| `maxToRenderPerBatch` | `10` | Items rendered per batch. Higher = less blank space but more JS blocking. |
| `updateCellsBatchingPeriod` | `50ms` | Delay between batch renders. Combine with `maxToRenderPerBatch` to tune. |
| `initialNumToRender` | `10` | Initial items to render. Match to viewport size for best initial render. |
| `windowSize` | `21` | Render window in viewport heights (10 above + 10 below + 1). Lower = less memory, more blank areas. |

### List Item Optimization

1. **Use basic components** — minimize logic and nesting in list items
2. **Use light components** — avoid heavy images, use thumbnails
3. **Use `React.memo()`** — prevent re-renders when props unchanged:

```tsx
import {memo} from 'react';

const MyListItem = memo(
  ({title}: {title: string}) => (
    <View><Text>{title}</Text></View>
  ),
  (prev, next) => prev.title === next.title,
);
```

4. **Use cached optimized images** — e.g., `@d11/react-native-fast-image`
5. **Use `getItemLayout`** — skip async layout for fixed-height items
6. **Use `keyExtractor`** — for caching and React key tracking
7. **Avoid anonymous functions on `renderItem`** — define outside or use `useCallback`

---

## Speeding Up Builds

### Android: Build One ABI During Development

Default builds all 4 ABIs (`armeabi-v7a`, `arm64-v8a`, `x86`, `x86_64`). Build only the active one:

```bash
yarn react-native run-android --active-arch-only
# or via Gradle:
./gradlew :app:assembleDebug -PreactNativeArchitectures=x86,x86_64
```

Reduces native build time by ~75%. Remove flag for release builds (need all ABIs).

### Android: Enable Configuration Caching (since 0.79)

```properties
# android/gradle.properties
org.gradle.configuration-cache=true
```

Skips Gradle configuration phase on subsequent builds.

### Use ccache (both platforms)

```bash
brew install ccache  # macOS
```

For iOS, uncomment `:ccache_enabled => true` in `ios/Podfile`.

Verify: `ccache -s`. Reset: `ccache --zero-stats`. Clear: `ccache --clear`.

On CI: use `compiler_check content` option (hash-based, not timestamp-based).

---

## Profiling

### Android UI Profiling with System Tracing

1. **Collect a trace:** Use Android Studio Profiler or `systrace` tool
2. **Read the trace:** Look for long frames, jank, UI thread blocking
3. **Find your process:** Filter by package name

### Identifying Culprits

**JavaScript issues:**
- Slow JS thread → check for expensive computations, large list rendering
- Use React DevTools Profiler to identify slow components

**Native UI issues:**
- **Too much GPU work:** Excessive shadows, gradients, opacity layers
- **Creating new views on UI thread:** Avoid creating views during scroll
- **Native CPU hotspots:** Use Android CPU Profiler

### Tools

| Tool | Platform | Purpose |
|------|----------|---------|
| React DevTools Profiler | Both | Component render times |
| Android Studio Profiler | Android | CPU, memory, network |
| Xcode Instruments | iOS | CPU, memory, animations |
| Systrace | Android | System-level trace |
| Hermes Sampling Profiler | Both | JS function profiling |
