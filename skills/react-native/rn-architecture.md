# React Native Architecture

Internal architecture of React Native, covering the New Architecture (enabled by
default since 0.76), the Fabric renderer, the render pipeline, threading model,
and key concepts.

---

## The New Architecture

Since 0.76, the New Architecture is **enabled by default** in all React Native projects.

### Why a New Architecture?

The legacy architecture had fundamental limitations:

1. **Asynchronous bridge** — JS↔native communication required JSON serialization, causing latency and making certain features impossible
2. **No synchronous layout** — layout was async, causing "jump" issues when embedding React Native views in host views
3. **No concurrent React features** — couldn't use React 18 concurrent features
4. **No direct JS↔native memory references** — couldn't efficiently pass large data (images, frames, databases)

### Key Innovations

#### JSI (JavaScript Interface)

JSI replaces the async bridge. It allows JavaScript to hold references to C++ objects and vice-versa, enabling direct method invocation without serialization costs.

- Enables real-time frame processing (e.g., VisionCamera processes ~30MB frames at 2GB/s)
- Can expose complex instance-based types: databases, images, audio samples
- Removes serialization from ALL native-JS interop, including core component rendering

#### Synchronous Layout and Effects

The new renderer can measure and render synchronously, eliminating layout "jump" when embedding React Native views in host views.

#### Concurrent Renderer Support

Enables React 18 Concurrent Features on React Native, including:
- `useTransition`
- `useDeferredValue`
- Suspense for data fetching

### What to Expect

Enabling the New Architecture may not immediately improve performance — code may need refactoring to leverage new capabilities. It's "opting into the future of React Native."

Active research areas:
- Event loop model updates
- Node and layout APIs (DOM traversal)
- Styling and layout conformance (Yoga 2.0)

### Opting Out

If needed, you can still opt out of the New Architecture (not recommended for new projects).

---

## Fabric (New Renderer)

Fabric is React Native's new rendering system — a conceptual evolution of the legacy render system.

### Motivations and Benefits

- **Synchronous measurement and rendering** — no more layout "jump" when embedding in host views
- **Multi-priority and synchronous events** — prioritize user interactions
- **React Suspense integration** — intuitive data fetching
- **React Concurrent Features** — enabled on React Native
- **Server-side rendering** — easier to implement

### Technical Benefits

- **Type safety** — code generation ensures JS↔native prop type safety. Mismatches trigger build errors.
- **Shared C++ core** — renderer implemented in C++, shared across platforms. Increases consistency.
- **Better host platform interoperability** — synchronous, thread-safe layout calculation
- **Improved performance** — cross-platform improvements benefit all platforms (e.g., view flattening now on both Android and iOS)
- **Faster startup** — host components lazily initialized by default
- **Less serialization** — JSI allows direct access to JavaScript values instead of JSON serialization

---

## Render Pipeline

The renderer goes through a sequence of work to render React logic to a host platform.
Three phases: **Render**, **Commit**, **Mount**.

### Phase 1: Render

React element tree → React shadow tree

- As each React Element is invoked, the renderer synchronously creates a React Shadow Node
- Only for React Host Components (e.g., `<View>`, `<Text>`), NOT composite components
- Parent-child relationships are mirrored between element tree and shadow tree
- Operations are synchronous and thread-safe (JS → C++ via JSI)
- The React Shadow Tree is **immutable** — updates create new trees (with cloning for performance)

### Phase 2: Commit

Two operations:
1. **Layout Calculation** — Yoga calculates position and size of each shadow node
   - Most calculation in C++, but some components (Text, TextInput) need host platform measurement
2. **Tree Promotion** — new shadow tree promoted as "next tree" to be mounted
   - Executes asynchronously on a background thread

### Phase 3: Mount

Shadow tree → Host view tree with rendered pixels

Three steps:
1. **Tree Diffing** — computes diff between previous and next tree in C++. Produces atomic mutations (`createView`, `updateView`, `removeView`, `deleteView`). Also where **view flattening** occurs.
2. **Tree Promotion** — "next tree" atomically promoted to "previously rendered tree"
3. **View Mounting** — atomic mutations applied to host views on UI thread

**Stats:** Typical shadow tree ~600-1000 nodes (before flattening) → ~200 nodes after view flattening.

---

## View Flattening

View flattening is an optimization by the React Native renderer to avoid deep layout trees.

The algorithm merges compatible shadow nodes during the tree diffing step, reducing the
number of host views that need to be created. Originally an Android-only optimization,
now available on both Android and iOS with the new renderer.

This reduces the host view tree from ~600-1000 nodes to ~200 nodes in typical apps.

---

## Threading Model

The renderer distributes work across multiple threads:

### Threads

| Thread | Responsibility |
|--------|---------------|
| **JavaScript thread** | JS execution, React reconciliation, business logic |
| **UI thread** | Native rendering, view mounting, native animations |
| **Background thread** | Layout calculation (Yoga), tree diffing |

### Render Scenarios

1. **Render in JS Thread** — most common scenario; most of pipeline runs on JS thread
2. **Render in UI Thread** — high priority event triggers synchronous full pipeline on UI thread
3. **Continuous event interruption** — low priority UI event interrupts render phase, merges state; render continues on JS thread
4. **Discrete event interruption** — high priority UI event interrupts render phase; render phase executes synchronously on UI thread
5. **C++ State update** — update originating on UI thread, skips rendering phase entirely

The render phase is **interruptible** — React and the renderer can pause and merge state from UI thread events.

---

## Bundled Hermes

Hermes is the JavaScript engine optimized for React Native:
- Pre-compiled bytecode for faster startup
- Reduced memory footprint
- Integrated with the New Architecture via JSI

---

## Glossary

| Term | Definition |
|------|-----------|
| **Host Platform** | The platform running React Native (Android, iOS) |
| **Host View** | Native view created by the renderer (e.g., `UIView`, `ViewGroup`) |
| **React Shadow Node** | Immutable C++ object representing a host component in the shadow tree |
| **React Shadow Tree** | Tree of shadow nodes mirroring the React element tree |
| **Host View Tree** | Tree of native views rendered on screen |
| **React Composite Component** | React components that are not host components (your custom components) |
| **React Host Component** | React components backed by host views (e.g., `<View>`, `<Text>`) |
| **React Element Tree** | Plain JS objects describing what should appear on screen (props, styles, children) |
| **JSI** | JavaScript Interface — lightweight API to embed JS engine in C++. Direct JS↔C++ memory references |
| **JNI** | Java Native Interface — API for C++↔Java communication (Android) |
| **Fabric** | The new React Native renderer — exists in JS, targets C++ interfaces |
| **Yoga** | Cross-platform flexbox layout engine (Yoga 2.0 adds styling/layout conformance) |
| **Codegen** | Type-safe code generation for JS↔native contracts |
| **TurboModule** | Native module using JSI for synchronous, type-safe access |
| **React Native Framework** | Cohesive framework built on React Native (e.g., Expo) — adds routing, store publishing, etc. |
| **Dev Menu** | In-app developer menu for debugging features (dev builds only) |

---

## Bundled Hermes

### What is Bundled Hermes?

Since React Native 0.69.0, every RN version is built alongside a specific Hermes version. This ensures full ABI compatibility — no more guessing which Hermes version works with which RN version.

### Why Bundled Hermes?

Historically, React Native and Hermes had separate release processes. Both share the JSI code — if copies get out of sync, builds break. Bundled Hermes ensures only one copy of JSI is used.

### Impact on App Developers

- **iOS:** Hermes enabled by default, no configuration needed
- **Android:** Hermes enabled by default, no configuration needed
- **Alternative engines:** Still possible to use other JS engines, but Hermes is recommended

### Impact on Contributors

- Hermes is downloaded and built as part of the RN build process
- Single JSI copy eliminates ABI incompatibility
- Extension developers may need to update build configurations

---

## Cross-Platform Implementation

The React Native renderer uses a shared C++ core implementation across platforms:

- **Core renderer logic** is in C++, shared between Android and iOS
- **Platform-specific code** is minimized to host view creation and mounting
- **Yoga** handles layout calculation in C++ (some components delegate to host platform for text measurement)
- **View flattening** originally Android-only, now available on both platforms
- **JSI** provides the JS↔C++ bridge on all platforms
- **JNI** connects C++ core to Android's Java layer

This architecture makes it easier to:
- Adopt React Native on new platforms
- Maintain consistency across platforms
- Share performance improvements across platforms

---

## Codegen

### What is Codegen?

Codegen is a build-time tool that generates boilerplate code for JS↔native contracts. It's not mandatory (you can write the code manually), but it saves significant time and ensures type safety.

### How Codegen Works

1. Codegen scripts live inside the `react-native` NPM package
2. Apps invoke Codegen at build time
3. Codegen crawls project folders (starting from a directory specified in `package.json`)
4. It looks for spec files — JS files written in Flow or TypeScript containing component/module specifications
5. For each spec file found, Codegen generates:
   - **C++ glue code** (shared across platforms)
   - **Java code** (Android)
   - **Objective-C++ code** (iOS)

This ensures type-safe contracts between JavaScript and native code — mismatches trigger build errors.

---

## Using Hermes

### Confirming Hermes is in Use

```tsx
const isHermes = () => !!global.HermesInternal;
```

### Benefits (measured in release builds)

- Faster startup (pre-compiled bytecode)
- Decreased memory usage
- Smaller app size

### Building with Hermes Bytecode

```bash
# Android
npm run android -- --mode="release"
yarn android --mode release

# iOS
npm run ios -- --mode="Release"
yarn ios --mode Release
```

### Switching Back to JavaScriptCore

Hermes is recommended, but you can opt out using the [community JavaScriptCore guide](https://github.com/react-native-community/javascriptcore).
