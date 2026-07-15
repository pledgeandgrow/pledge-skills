---
name: React Native Docs
version: "0.86"
tags:
  - react-native
  - mobile
  - ios
  - android
  - react
  - javascript
  - typescript
  - expo
  - fabric
  - jsi
description: |
  Comprehensive React Native reference covering core components, APIs, styling, flexbox,
  navigation, networking, animations, platform-specific code, debugging, performance,
  TypeScript integration, Fast Refresh, environment setup, React fundamentals,
  running on devices, and the New Architecture (Fabric, JSI, TurboModules, Hermes).
  Use whenever the user mentions React Native, mobile development with React, Expo,
  native modules, or needs help building cross-platform iOS/Android apps.
---

# React Native Expert (v0.86)

**Official Documentation:** https://reactnative.dev/docs/getting-started
**GitHub:** https://github.com/facebook/react-native
**Packages Directory:** https://reactnative.directory/

## What is React Native?

React Native lets you build iOS and Android apps using JavaScript and React. It renders using real native components — not web views — so apps look, feel, and perform like native apps.

## Quick Reference

### Core & Overview

| Topic | File |
|------|------|
| Core Components (View, Text, Image, TextInput, Pressable, ScrollView, FlatList, Touchables, etc.) | `rn-components.md` |
| Architecture (New Architecture, Fabric, JSI, Codegen, Render Pipeline, Threading, Hermes, Cross-Platform) | `rn-architecture.md` |

### Component Reference (per component)

| Topic | File |
|------|------|
| View (props, responder, focus navigation) | `rn-ref-view.md` |
| Text (props, nested text, style inheritance) | `rn-ref-text.md` |
| Image & ImageBackground (props, events, static methods) | `rn-ref-image.md` |
| TextInput (props, keyboard types, events, methods) | `rn-ref-textinput.md` |
| Pressable (props, style function, Android ripple) | `rn-ref-pressable.md` |
| ScrollView & RefreshControl (props, methods, events) | `rn-ref-scrollview.md` |
| FlatList & SectionList (props, methods, renderItem) | `rn-ref-lists.md` |
| StatusBar (props, imperative API, constants) | `rn-ref-statusbar.md` |
| StyleSheet & Deprecated Components | `rn-ref-stylesheet.md` |
| Button, Switch & ActivityIndicator | `rn-ref-button-switch-activityindicator.md` |
| Modal (props, animation, presentation) | `rn-ref-modal.md` |
| DrawerLayoutAndroid (Android only) | `rn-ref-drawerlayoutandroid.md` |
| VirtualizedList (base list, props, methods) | `rn-ref-virtualizedlist.md` |
| Touchable Components (legacy: Highlight, Opacity, WithoutFeedback, NativeFeedback) | `rn-ref-touchables.md` |

### Style Reference

| Topic | File |
|------|------|
| Layout Props (Flexbox, gap, position, margin, padding, border, box sizing) | `rn-ref-layout-props.md` |
| View Style Props (background, borders, shadow, effects) | `rn-ref-view-style.md` |
| Text & Image Style Props | `rn-ref-text-image-style.md` |
| Transforms & Colors (transform, transformOrigin, color formats, PlatformColor) | `rn-ref-transforms-colors.md` |
| PanResponder, Share, Vibration, Systrace, Headless JS | `rn-ref-panresponder-share-vibration.md` |

### API Reference (per module)

| Topic | File |
|------|------|
| AccessibilityInfo & AppState | `rn-ref-accessibility-appstate.md` |
| Dimensions & PixelRatio | `rn-ref-dimensions-pixelratio.md` |
| Keyboard & KeyboardAvoidingView | `rn-ref-keyboard.md` |
| Platform, BackHandler & Linking | `rn-ref-platform-backhandler-linking.md` |
| ToastAndroid, PermissionsAndroid, ActionSheetIOS | `rn-ref-platform-apis.md` |
| InteractionManager, Timers, Alert, AppRegistry, DevSettings | `rn-ref-timers-alert-appregistry.md` |
| Gesture Responder, JavaScript Environment, JS Loading, Profiling | `rn-ref-gesture-jsenv-profiling.md` |
| Event Types (PressEvent, LayoutEvent, TargetEvent, Text/Document Nodes, Rect) | `rn-ref-event-types.md` |
| PressEvent & Element Nodes (web-compatible API, legacy measure) | `rn-ref-pressevent-element-nodes.md` |

### APIs & Concepts

| Topic | File |
|------|------|
| Animated API & LayoutAnimation | `rn-animated.md` |
| Navigation (React Navigation) | `rn-navigation.md` |
| Networking (fetch, XMLHttpRequest, WebSocket) | `rn-networking.md` |
| React Fundamentals, Timers, Keyboard, Accessibility, Misc APIs | `rn-react-fundamentals.md` |
| Accessibility Guide (properties, actions, testing) | `rn-accessibility.md` |

### Guides

| Topic | File |
|------|------|
| Styling (inline, StyleSheet, arrays, Flexbox) | `rn-styling.md` |
| Platform-Specific Code (Platform module, extensions, PlatformColor) | `rn-platform-specific.md` |
| Debugging (Dev Menu, DevTools, LogBox, Perf Monitor) | `rn-debugging.md` |
| Performance (frame basics, FlatList, JS/UI threads, profiling) | `rn-performance.md` |
| Fast Refresh | `rn-fast-refresh.md` |
| TypeScript (setup, path aliases, strict API) | `rn-typescript.md` |
| Testing (unit, component, E2E, Jest) | `rn-testing.md` |
| Publishing (Google Play, App Store, App Extensions) | `rn-publishing.md` |
| Troubleshooting (common issues, upgrades) | `rn-troubleshooting.md` |
| Metro Bundler & Upgrading | `rn-metro.md` |
| Using Libraries & Out-of-Tree Platforms | `rn-libraries.md` |
| Hooks (PlatformColor, useColorScheme, useWindowDimensions) | `rn-hooks.md` |
| Integration with Existing Apps | `rn-integration.md` |
| Environment Setup & Running on Device | `rn-environment-setup.md` |
| Optimizing FlatList Configuration (props, list items, memo) | `rn-flatlist-optimization.md` |
| Security (secure storage, OAuth2/PKCE, SSL pinning) | `rn-security.md` |
| Native ↔ React Native Communication (properties, events, native modules) | `rn-native-communication.md` |
| React Native Gradle Plugin (RNGP configuration, flavors, variants) | `rn-gradle-plugin.md` |
| Profiling (Android System Tracing, CPU hotspots, GPU work) | `rn-profiling.md` |
| Speeding Up Build Phase (ABI, ccache, Maven mirror, sccache) | `rn-build-speed.md` |
| Architecture Glossary (Fabric, JSI, JNI, Shadow Tree, Yoga, Host Views) | `rn-architecture-glossary.md` |

## Core Components Mapping

| React Native | Android | iOS | Web |
|--------------|---------|-----|-----|
| `<View>` | `<ViewGroup>` | `<UIView>` | `<div>` |
| `<Text>` | `<TextView>` | `<UITextView>` | `<p>` |
| `<Image>` | `<ImageView>` | `<UIImageView>` | `<img>` |
| `<ScrollView>` | `<ScrollView>` | `<UIScrollView>` | `<div>` |
| `<TextInput>` | `<EditText>` | `<UITextField>` | `<input type="text">` |

## Hello World

```tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello, World!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

## Key Ecosystem Libraries

| Library | Purpose |
|---------|---------|
| `@react-navigation/native` | Navigation (screens, tabs, drawers) |
| `@react-navigation/native-stack` | Native stack navigator |
| `react-native-reanimated` | Advanced animations |
| `expo` | Managed development workflow |
| `axios` | HTTP client |
| `react-native-gesture-handler` | Gesture handling |
| `react-native-screens` | Native screen management |
| `react-native-safe-area-context` | Safe area insets (replaces deprecated `SafeAreaView`) |
| `@react-native-clipboard/clipboard` | Clipboard access |
| `@d11/react-native-fast-image` | Cached optimized images |
| `@testing-library/react-native` | Component testing |
| `detox` | E2E testing for React Native |
| `jest` | Unit/integration testing (built-in) |

## New Architecture (enabled by default since 0.76)

- **JSI (JavaScript Interface)** — direct JS↔C++ memory references, no async bridge
- **Fabric** — new renderer with synchronous layout, concurrent features
- **TurboModules** — type-safe native modules via JSI
- **Codegen** — type-safe JS↔native prop contracts

## Prerequisites

- JavaScript fundamentals
- React basics (components, props, state, hooks)
- Android/iOS development knowledge helpful but not required

## Environment Setup

**macOS (for iOS + Android):**
```bash
brew install node        # Node 22.11.0+
brew install watchman    # File watcher for fast refresh
brew install --cask zulu@17  # JDK 17
# Set JAVA_HOME in ~/.zshrc
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```

**iOS:** Install Xcode + Command Line Tools + CocoaPods
**Android:** Install Android Studio + Android SDK

**Create new project:**
```bash
npx @react-native-community/cli@latest init MyApp
# or with Expo:
npx create-expo-app MyApp
```

## TypeScript

New React Native projects target TypeScript by default. Babel transforms TS during bundling; `tsc` is for type-checking only.

```bash
npm install -D typescript @react-native/typescript-config @types/jest @types/react @types/react-test-renderer
```

```json
// tsconfig.json
{ "extends": "@react-native/typescript-config" }
```

Use `.tsx` for component files. Keep `index.js` as JS entrypoint. Use `.jsx` for plain JS files.

## Fast Refresh

Enabled by default — near-instant feedback for component changes:
- Edits to React component-only modules → re-render that component only
- Edits to non-component exports → re-run module + importers
- Falls back to full reload if file imported outside React tree
- Preserves local state in function components (not class components)
- `// @refresh reset` — force remount on every edit
- Error resilient: syntax/runtime errors show redbox, auto-recover on fix

## Running on Device

**Android:**
1. Enable USB Debugging (Settings → Developer options)
2. `adb devices` to verify connection
3. `npm run android` (or `yarn android --mode release`)
4. `adb reverse tcp:8081 tcp:8081` to connect dev server

**iOS:**
1. Plug in via USB
2. Configure code signing in Xcode
3. Build and run from Xcode or `npm run ios`

## Hermes JavaScript Engine

Bundled with React Native since 0.69.0 — each RN version ships a compatible Hermes version:
- Pre-compiled bytecode for faster startup
- Reduced memory footprint
- Integrated with New Architecture via JSI
- Single JSI copy ensures ABI compatibility

## Dev Menu Access

- **iOS Simulator:** Ctrl+Cmd+Z (or Device > Shake)
- **Android Emulator:** Cmd+M (macOS) or Ctrl+M (Windows/Linux)
- **ADB:** `adb shell input keyevent 82`

## References

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Docs](https://react.dev/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Expo](https://docs.expo.dev/)
- [Native Directory](https://reactnative.directory/)
- [Yoga Layout](https://www.yogalayout.dev/docs/styling/flex-direction)
- [New Architecture](https://reactnative.dev/architecture/landing-page)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React + TypeScript Cheatsheets](https://github.com/typescript-cheatsheets/react-typescript-cheatsheet)
- [React as a UI Runtime](https://overreacted.io/react-as-a-ui-runtime/)
- [React Fiber Architecture](https://github.com/acdlite/react-fiber-architecture)
- [Upgrade Helper](https://react-native-community.github.io/upgrade-helper/)
