# Native ↔ React Native Communication Guide

Techniques for communicating between native code and React Native when embedding RN in native apps or vice versa.

---

## Properties

### Passing Properties from Native to React Native

Set initial properties when creating the React Native root view:

**iOS:**
```objc
RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
    moduleName:@"MyApp"
    initialProperties:@{@"prop1": @"value1"}];
```

**Android:**
```kotlin
val reactRootView = ReactRootView(context)
val props = Arguments.createMap().apply {
    putString("prop1", "value1")
}
reactRootView.startReactApplication(reactInstanceManager, "MyApp", props)
```

### Passing Properties from React Native to Native

Use `nativeID` or custom native components with props to pass data back to native.

### Limits of Properties

Properties are set once at creation time. For dynamic updates, use events or native modules.

---

## Calling React Native Functions from Native (Events)

Events allow changing React Native components without a direct reference. Events are handled on a separate thread — no guarantees about execution time.

**Pitfalls:**
- Events can be sent from anywhere → spaghetti-style dependencies
- Events share namespace → name collisions (hard to debug)
- Multiple instances of same component need identifiers (use `reactTag`)

**iOS pattern:** Make native component's `RCTViewManager` a delegate, send events back to JS via the bridge.

**Android pattern:** Use `RCTEventEmitter` to send events from native to JS.

---

## Calling Native Functions from React Native (Native Modules)

**iOS:** Native modules are Objective-C/Swift classes available in JS. One instance per JS bridge. Export arbitrary functions and constants.

**Android:** Native modules are Java/Kotlin classes available in JS. One instance per JS bridge.

**Singleton limitation:** When embedding RN in native, native modules are singletons. To update a specific parent native view, pass an identifier to retrieve the view reference.

> All native modules share the same namespace. Watch out for name collisions.

---

## Layout Computation Flow

### Native Component Embedded in React Native

1. React Native computes layout for the native component
2. Layout is passed to native via `setFrame:` (iOS) / `layout` (Android)
3. Native component updates its frame

### React Native Component Embedded in Native

1. Native provides a frame for the React Native root view
2. React Native computes layout for all its children within that frame
3. Synchronous layout (New Architecture) eliminates "jump" issues
