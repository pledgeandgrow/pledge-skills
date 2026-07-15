# Gesture Responder System, JavaScript Environment, JS Loading & Profiling

---

## Gesture Responder System

Manages the lifecycle of gestures. A touch can go through several phases as the app determines user intent (scrolling, sliding, tapping).

### Responder Lifecycle

A view becomes the touch responder by implementing negotiation methods:

**Asking to become responder:**
- `onStartShouldSetResponder: (evt) => true` — Want to become responder on touch start?
- `onMoveShouldSetResponder: (evt) => true` — Want to claim touch on move?

**If view returns true:**
- `onResponderGrant: (evt) => {}` — View is now responding (highlight)
- `onResponderReject: (evt) => {}` — Another view is responder and won't release

**While responding:**
- `onResponderMove: (evt) => {}` — User moving finger
- `onResponderRelease: (evt) => {}` — Touch ended ("touchUp")
- `onResponderTerminationRequest: (evt) => true` — Another view wants responder, release?
- `onResponderTerminate: (evt) => {}` — Responder taken (by view or OS)

### Capture Phase (Parent Priority)

- `onStartShouldSetResponderCapture: (evt) => true` — Parent prevents child from becoming responder on start
- `onMoveShouldSetResponderCapture: (evt) => true` — Parent prevents child on move

### Synthetic Touch Event

```tsx
evt.nativeEvent = {
  changedTouches: TouchEvent[],  // changed since last event
  identifier: number,            // touch ID
  locationX: number,             // X relative to element
  locationY: number,             // Y relative to element
  pageX: number,                 // X relative to root
  pageY: number,                 // Y relative to root
  target: number,                // node ID
  timestamp: number,             // time (for velocity)
  touches: TouchEvent[],         // all current touches
};
```

### Best Practices

- Use `Pressable` or `Touchable*` components for most use cases
- Use `PanResponder` for complex gestures
- The gesture responder system is the low-level foundation; prefer higher-level APIs

---

## JavaScript Environment

### JavaScript Runtimes

| Runtime | When Used | Notes |
|---------|-----------|-------|
| **Hermes** | Default (since 0.70+) | Optimized for RN, bytecode in release, on-demand loading |
| **JavaScriptCore** | If Hermes disabled | Safari's engine. No JIT on iOS (no writable executable memory) |
| **V8** | Chrome debugging | Code runs in Chrome, communicates via WebSockets |

> Avoid relying on specifics of any runtime.

### Polyfills Available

**Browser APIs:**
- `CommonJS require`
- `console.{log, warn, error, info, debug, trace, table, group, groupCollapsed, groupEnd}`
- `XMLHttpRequest`, `fetch`
- `{set, clear}{Timeout, Interval, Immediate}`, `{request, cancel}AnimationFrame`

**ES2015 (ES6):**
- `Array.from`, `Array.prototype.{find, findIndex}`
- `Object.assign`
- `String.prototype.{startsWith, endsWith, repeat, includes}`

**ES2016 (ES7):**
- `Array.prototype.includes`

**ES2017 (ES8):**
- `Object.{entries, values}`

**RN-specific:**
- `__DEV__` — boolean, true in dev mode

---

## Optimizing JavaScript Loading

### Recommended: Use Hermes

Hermes compiles JS to bytecode ahead of time in release builds. Bytecode loads on-demand without parsing.

### Recommended: Lazy-load Large Components

Use React's `lazy()` API to defer loading screen-level components:

```tsx
import {lazy, Suspense} from 'react';

const SettingsScreen = lazy(() => import('./SettingsScreen'));

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SettingsScreen />
    </Suspense>
  );
}
```

**Tip:** Avoid module side effects — lazy-loaded modules should not initialize globals or patch APIs.

### Advanced: Inline `require()` Calls

Defer loading without `lazy()` or `import()`:

```tsx
let VeryExpensive = null;

function App() {
  const [needs, setNeeds] = useState(false);
  const onPress = useCallback(() => {
    if (VeryExpensive == null) {
      VeryExpensive = require('./VeryExpensive').default;
    }
    setNeeds(true);
  }, []);
  return needs ? <VeryExpensive /> : null;
}
```

### Advanced: Automatic Inline Requires

React Native CLI automatically inlines `require()` calls (not `import`) in your code and `node_modules`.

**Enable in Metro config (Expo projects):**

```js
// metro.config.js
module.exports = {
  transformer: {
    async getTransformOptions() {
      return {
        transform: {
          inlineRequires: true,
        },
      };
    },
  },
};
```

**Disable all inline requires:**

```js
module.exports = {
  transformer: {
    async getTransformOptions() {
      return {
        transform: {
          inlineRequires: false,
        },
      };
    },
  },
};
```

**Exclude specific modules:**

```js
module.exports = {
  transformer: {
    async getTransformOptions() {
      return {
        transform: {
          inlineRequires: {
            blockList: {
              [require.resolve('./src/DoNotInline.js')]: true,
            },
          },
          nonInlinedRequires: ['react'],
        },
      };
    },
  },
};
```

### Pitfalls of Inline Requires

- Changes module evaluation order
- Modules with side effects (logging init, global patches) may break
- Can cause some modules to never be evaluated
- Exclude side-effect modules or disable entirely if issues arise

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
