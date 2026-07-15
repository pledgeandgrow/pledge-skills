# Profiling Guide

Profiling is the process of analyzing an app's performance, resource usage, and behavior to identify potential bottlenecks or inefficiencies.

---

## Profiling Android UI Performance with System Tracing

### 1. Collecting a Trace

1. Connect a device exhibiting the stuttering via USB
2. Open `android` folder in Android Studio
3. Select your device, run your project as **profileable**
4. Get app to the point before the animation/interaction you want to profile
5. Start **"Capture System Activities"** task in Android Studio Profiler
6. Perform the animation/interaction
7. Press **"Stop recording"**
8. Inspect in Android Studio or export and open in [Perfetto](https://perfetto.dev/)

### 2. Reading the Trace

- Use **WASD keys** to strafe and zoom
- Check the checkbox at top right to highlight **16ms frame boundaries** (zebra stripes)
- If you don't see zebra stripes, try a different device (Samsung has known vsync display issues; Nexus series is reliable)

### 3. Find Your Process

Locate your app's process in the trace. Look for the JS thread, UI thread, and Render Thread.

---

## Identifying a Culprit

**Smooth animation (60 FPS):** Each color change is a frame. No thread working close to the frame boundary.

**JS problem:** JS thread executing almost all the time, across frame boundaries.

**Native UI problem:** UI and Render threads have work crossing frame boundaries.

---

## Resolving JavaScript Issues

Look for clues in the specific JS being executed. For example, if `RCTEventEmitter` is called multiple times per frame, investigate:

- Are they actually different events?
- Check `shouldComponentUpdate` / `React.memo` to prevent unnecessary re-renders

---

## Resolving Native UI Issues

### Too Much GPU Work

**Symptom:** Long `DrawFrame` time crossing frame boundaries (waiting for GPU to drain command buffer).

**Mitigations:**
- Use `renderToHardwareTextureAndroid` for complex, static content being animated/transformed (e.g., Navigator slide/alpha animations)
- Make sure you are NOT using `needsOffscreenAlphaCompositing` (disabled by default, greatly increases per-frame GPU load)

### Creating New Views on the UI Thread

**Symptom:** JS thread thinks, then native modules thread does work, followed by expensive traversal on UI thread.

**Mitigations:**
- Postpone creating new UI until after the interaction
- Simplify the UI being created

### Finding Native CPU Hotspots

Use the **CPU hotspot profiler** in Android Studio:

1. Open Android Studio Profiler panel
2. Select **"Find CPU Hotspots (Java/Kotlin Method Recording)"** (NOT "Callstack Sample" — they have similar icons)
3. Perform the interactions
4. Press **"Stop recording"** (keep it short — recording is resource-intensive)
5. Inspect in Android Studio or export to [Firefox Profiler](https://profiler.firefox.com/)

> CPU hotspot profiling is slow — won't give accurate measurements, but shows what native methods are called and where time is spent proportionally.
