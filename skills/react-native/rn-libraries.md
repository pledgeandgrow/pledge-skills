# Using Libraries & Out-of-Tree Platforms

---

## Using Libraries

### Selecting a Package Manager

- **npm** — comes with Node.js
- **Yarn Classic** — faster installs, Workspaces support

Both work great with React Native.

### Installing a Library

```bash
npm install react-native-webview
# or
yarn add react-native-webview
```

### Linking Native Code

**iOS (CocoaPods):**

```bash
cd ios && pod install
# or from project root:
npx pod-install
```

Then rebuild: `npm run ios`

**Android (Gradle):**

Just rebuild: `npm run android`

### Finding Libraries

| Source | Description |
|--------|-------------|
| [React Native Directory](https://reactnative.directory) | Searchable database of RN-specific libraries (first place to look) |
| [npm registry](https://www.npmjs.com) | General JS libraries (may not all be RN-compatible) |
| [Expo SDK](https://docs.expo.dev/versions/latest/) | TypeScript libraries, iOS/Android/Web support |

### Determining Library Compatibility

- Does it work with React Native? (not all npm packages do)
- Does it support your target platforms? (iOS, Android, Web, etc.)
- Does it work with your React Native version? (check peer dependencies)

---

## Out-of-Tree Platforms

React Native is not only for Android and iOS — partners and community maintain additional platforms:

### Partner Platforms

| Platform | Maintainer | Description |
|----------|------------|-------------|
| [React Native macOS](https://github.com/microsoft/react-native-macos) | Microsoft | macOS via Cocoa |
| [React Native Windows](https://github.com/microsoft/react-native-windows) | Microsoft | Universal Windows Platform (UWP) |
| [React Native visionOS](https://github.com/callstack/react-native-visionos) | Callstack | Apple visionOS |

### Community Platforms

| Platform | Description |
|----------|-------------|
| [React Native tvOS](https://github.com/react-native-tvos/react-native-tvos) | Apple TV and Android TV |
| [React Native Web](https://github.com/necolas/react-native-web) | Web using React DOM |
| [React Native Skia](https://github.com/react-native-skia/react-native-skia) | Skia renderer (Linux, macOS) |

### Creating Your Own Platform

Creating a custom React Native platform involves:
- Forking the React Native repository
- Implementing a custom renderer (analogous to Fabric)
- Implementing native module bindings (analogous to TurboModules)
- Configuring Metro for bundling
