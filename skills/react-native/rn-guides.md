# React Native Guides

Guide covering styling, flexbox layout, platform-specific code, debugging,
and performance optimization.

---

## Styling

React Native uses JavaScript for styling. All core components accept a `style` prop.
Style names and values match CSS, except using camelCase (`backgroundColor` not `background-color`).

### Inline Styles

```tsx
<View style={{flex: 1, backgroundColor: 'white', padding: 10}}>
  <Text style={{fontSize: 16, color: '#333'}}>Hello</Text>
</View>
```

### StyleSheet.create

```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

<View style={styles.container}>
  <Text style={styles.text}>Hello</Text>
</View>
```

### Style Arrays

```tsx
<View style={[styles.container, {marginTop: 20}]} />
<View style={[styles.container, isActive && styles.active]} />
```

### Known Issues

- `overflow: 'visible'` doesn't work on Android — views are clipped by their parents

---

## Layout with Flexbox

Flexbox is designed to provide consistent layout on different screen sizes.
React Native uses Yoga (https://www.yogalayout.dev/) for flexbox implementation.

### Flex

`flex` defines how items fill available space along the main axis.

```tsx
// Container: flex: 1 (fills all space)
// Children: flex 1, 2, 3 → 1/6, 2/6, 3/6 of space
<View style={{flex: 1}}>
  <View style={{flex: 1, backgroundColor: 'red'}} />
  <View style={{flex: 2, backgroundColor: 'orange'}} />
  <View style={{flex: 3, backgroundColor: 'green'}} />
</View>
```

### Flex Direction

Controls direction children are laid out (the main axis):

| Value | Description |
|-------|-------------|
| `column` (default) | Top to bottom |
| `row` | Left to right |
| `column-reverse` | Bottom to top |
| `row-reverse` | Right to left |

### Layout Direction

| Value | Description |
|-------|-------------|
| `LTR` (default) | Left to right; `start` = left, `end` = right |
| `RTL` | Right to left; `start` = right, `end` = left |

### Justify Content

Align children within the **main axis**:

| Value | Description |
|-------|-------------|
| `flex-start` (default) | Start of container |
| `flex-end` | End of container |
| `center` | Center of container |
| `space-between` | Evenly spaced, no space at edges |
| `space-around` | Evenly spaced, half-space at edges |
| `space-evenly` | Equal space between all items and edges |

### Align Items

Align children along the **cross axis**:

| Value | Description |
|-------|-------------|
| `stretch` (default) | Stretch to fill cross axis |
| `flex-start` | Start of cross axis |
| `flex-end` | End of cross axis |
| `center` | Center of cross axis |
| `baseline` | Along common baseline |

### Align Self

Overrides `alignItems` for a single child. Same options as `alignItems`.

### Align Content

Distribution of lines along cross-axis (only when `flexWrap` is enabled):

| Value | Description |
|-------|-------------|
| `flex-start` (default) | Start of cross axis |
| `flex-end` | End of cross axis |
| `stretch` | Stretch to fill cross axis |
| `center` | Center of cross axis |
| `space-between` | Evenly spaced between lines |
| `space-around` | Evenly spaced around lines |
| `space-evenly` | Equal space everywhere |

### Flex Wrap

Controls what happens when children overflow the container along the main axis:

| Value | Description |
|-------|-------------|
| `nowrap` (default) | Single line (children shrink) |
| `wrap` | Multiple lines |
| `wrap-reverse` | Multiple lines in reverse |

### Flex Basis, Grow, and Shrink

- `flexBasis` — default size before flex grow/shrink applies
- `flexGrow` — how much to grow relative to siblings
- `flexShrink` — how much to shrink relative to siblings

### Gap Properties

```tsx
<View style={{flexDirection: 'row', gap: 10, rowGap: 15, columnGap: 20}}>
  <View /><View /><View />
</View>
```

### Width and Height

```tsx
// Fixed
{width: 200, height: 100}

// Percentage
{width: '50%', height: '100%'}
```

### Position

| Value | Description |
|-------|-------------|
| `relative` (default) | Normal flow, offset by top/right/bottom/left |
| `absolute` | Removed from flow, positioned relative to containing block |
| `static` | Normal flow, ignores top/right/bottom/left. Does NOT form containing block for absolute descendants (New Architecture only) |

### Containing Block

For absolutely positioned elements, the containing block is the nearest ancestor with:
- A position type other than `static`, OR
- A `transform`

Percentage lengths on absolutely positioned elements are relative to the containing block.

---

## Platform-Specific Code

### Platform Module

```tsx
import {Platform, StyleSheet} from 'react-native';

// Simple detection
const height = Platform.OS === 'ios' ? 200 : 100;

// Platform.select
const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {backgroundColor: 'red'},
      android: {backgroundColor: 'green'},
      default: {backgroundColor: 'blue'},
    }),
  },
});

// Platform-specific components
const Component = Platform.select({
  ios: () => require('ComponentIOS'),
  android: () => require('ComponentAndroid'),
})();
```

### Detecting Platform Version

```tsx
// Android (returns API level as number)
if (Platform.Version >= 31) { /* Android 12+ */ }

// iOS (returns version as string)
if (parseInt(Platform.Version, 10) >= 16) { /* iOS 16+ */ }
```

### File Extensions

| Extension | Loaded by |
|-----------|-----------|
| `.ios.js` | React Native on iOS |
| `.android.js` | React Native on Android |
| `.native.js` | React Native (both platforms) |
| `.js` | Web bundlers (webpack, Rollup) |

```tsx
// Files: BigButton.ios.js, BigButton.android.js
import BigButton from './BigButton'; // auto-selects correct file
```

**Tip:** Configure web bundler to ignore `.native.js` extensions to reduce bundle size.

---

## Debugging

### Dev Menu

- **iOS Simulator:** Ctrl+Cmd+Z (or Device > Shake)
- **Android Emulator:** Cmd+M (macOS), Ctrl+M (Windows/Linux)
- **ADB:** `adb shell input keyevent 82`

### React Native DevTools

Built-in debugger (similar to browser devtools):
- Select "Open DevTools" in Dev Menu, or press `j` from CLI
- Panels: Console, React Components Inspector, React Profiler
- Welcome panel on first launch

### LogBox

In-app tool displaying warnings/errors:
- Fatal errors: full-screen error with stack trace
- Console errors and warnings: displayed as toasts/log entries

### Performance Monitor

Toggle "Show Perf Monitor" in Dev Menu to see:
- **JS frame rate** (JavaScript thread)
- **UI frame rate** (main thread)

Target: 60 FPS (16.67ms per frame budget).

---

## Performance

### Frame Basics

- iOS/Android display at least 60 FPS → 16.67ms per frame
- Two frame rates to monitor:
  - **JS thread** — JavaScript execution, React reconciliation
  - **UI thread** — native rendering, animations, gestures
- Dropped frame = UI appears unresponsive

### Common Performance Problems

#### Development Mode
JS performance suffers greatly in dev mode. **Always test performance in release builds.**

#### console.log Statements
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

#### FlatList Performance
- Use `getItemLayout` to skip measurement
- Consider `FlashList` or `Legend List` for better performance
- Use `removeClippedSubviews`, tune `initialNumToRender`, `maxToRenderPerBatch`, `windowSize`

#### JS Thread Overload
- Use `InteractionManager` to defer heavy work after animations
- Use `LayoutAnimation` for fire-and-forget animations (not affected by JS thread drops)
- `Animated` with `useNativeDriver: true` runs on UI thread

#### UI Thread FPS Drops
- `renderToHardwareTextureAndroid` — helps with alpha compositing (text over images)
- `shouldRasterizeIOS` — already enabled by default on iOS
- Don't overuse hardware texture props — monitor memory usage

#### Touch Responsiveness
- Use `Pressable` (preferred over old `TouchableOpacity`, `TouchableHighlight`)
- `onPressIn` for immediate feedback (don't wait for `onPress`)
- `hitSlop` to expand touch area

### Performance Best Practices

1. Use `useNativeDriver: true` for animations
2. Use `React.memo` / `useMemo` / `useCallback` to prevent unnecessary re-renders
3. Avoid inline functions in render for performance-critical components
4. Use `getItemLayout` on FlatList for fixed-height items
5. Remove `console.log` in production
6. Test in release mode, not dev mode
7. Use `InteractionManager.runAfterInteractions` for heavy work after animations

---

## Fast Refresh

Enabled by default — near-instant feedback for component changes. Toggle "Enable Fast Refresh" in Dev Menu.

### How It Works

- **Component-only module edited** → re-render that component only (styles, rendering logic, event handlers, effects all update)
- **Module with non-component exports edited** → re-run that module AND all modules importing it
- **File imported outside React tree** → falls back to full reload

### Error Resilience

- Syntax errors: redbox appears, module prevented from running. Fix and save → auto-recover
- Runtime errors during init: session continues after fix
- Runtime errors in component: React remounts with updated code
- Error boundaries retry rendering on next edit after redbox

### Limitations

- Local state NOT preserved for class components (only function components + Hooks)
- State reset if module has exports beyond React component
- State reset for HOC results that are class components (e.g., `createNavigationContainer(MyScreen)`)

### Tips

- `// @refresh reset` — force remount on every edit (useful for mount-only animations)
- Fast Refresh preserves React local state in function components by default
- Separate non-React exports into their own files to maintain Fast Refresh

---

## TypeScript

### Getting Started

New projects use TypeScript by default. Babel transforms TS during bundling; `tsc` is for type-checking only.

### Adding to Existing Project

```bash
npm install -D typescript @react-native/typescript-config @types/jest @types/react @types/react-test-renderer
```

```json
// tsconfig.json
{ "extends": "@react-native/typescript-config" }
```

Rename `.js` files to `.tsx`. Keep `index.js` as JS entrypoint. Run `npx tsc` to type-check.

### JavaScript Instead of TypeScript

Use `.jsx` extension for plain JS files — not type-checked. JS and TS modules can import each other.

### TypeScript + React Native Example

```tsx
import {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

export type Props = {
  name: string;
  baseEnthusiasmLevel?: number;
};

function Hello({name, baseEnthusiasmLevel = 0}: Props) {
  const [enthusiasmLevel, setEnthusiasmLevel] = useState(baseEnthusiasmLevel);

  const getExclamationMarks = (numChars: number) =>
    numChars > 0 ? Array(numChars + 1).join('!') : '';

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Hello {name} {getExclamationMarks(enthusiasmLevel)}
      </Text>
      <Button
        title="Increase"
        onPress={() => setEnthusiasmLevel(enthusiasmLevel + 1)}
        color="blue"
      />
    </View>
  );
}
```

### Custom Path Aliases

```json
// tsconfig.json
{
  "extends": "@react-native/typescript-config",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Port 8081 already in use | Kill process: `lsof -i :8081` then `kill -9 <PID>` |
| NPM locking error | Delete `node_modules` and `package-lock.json`, run `npm install` |
| Missing React libraries | Run `npm install` in project root |
| `spawnSync ./gradlew EACCES` | Run `chmod +x android/gradlew` |
| Android ENOSPC error | Increase file watcher limit: `echo fs.inotify.max_user_watches=524288 \| sudo tee -a /etc/sysctl.conf` |
| Shell command unresponsive | Increase Java heap size in `android/gradle.properties` |

### React Native Upgrade

Use the [Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) to see changes between versions.

---

## Integration with Existing Apps

React Native can be added to existing native Android/iOS apps:

### Key Concepts

- React Native code lives in a subdirectory of the native project
- NPM dependencies managed separately
- Native code registers a React Native root view

### Android Integration

1. Set up directory structure (e.g., `rn/` inside Android project)
2. Install NPM dependencies in `rn/`
3. Configure `settings.gradle` and `app/build.gradle` to include React Native
4. Add `ReactNativeHost` in Application class
5. Create `index.js` and `App.tsx` entry points

### iOS Integration

1. Install CocoaPods dependencies
2. Configure Podfile to include React Native pods
3. Run `pod install`
4. Add React Native view controller in Swift/Objective-C

### Passing Initial Props

```tsx
// App.tsx
import {Text} from 'react-native';

export default function App({initialProps}: {initialProps?: {name?: string}}) {
  return <Text>Hello {initialProps?.name}</Text>;
}
```

Pass `initialProperties` from native code when creating the React Native root view.

---

## Testing

### Why Test

- Catch mistakes and verify code works
- Ensure code continues to work after refactors/dependency upgrades
- Failing test that exposes a bug is the best way to fix it
- Tests serve as documentation for new team members
- Less manual QA, more automation

### Static Analysis (built-in)

- **ESLint** — linting (catches common errors, style issues)
- **TypeScript** — type checking (ensures correct types)

### Writing Testable Code

- Separate business logic from React components
- Write modular code in small units
- State/data fetching should be independent of components
- Theoretically: components only render, logic works without React

### Test Types

| Type | Description | Tools |
|------|-------------|-------|
| **Unit Tests** | Test individual functions/classes. Fast to write and run. Mock dependencies. | Jest |
| **Integration Tests** | Combine real units and test cooperation. Less mocking than unit tests. | Jest |
| **Component Tests** | Test React component rendering and interactions. JS-only (no native code). | React Native Testing Library |
| **E2E Tests** | Test on device/emulator from user perspective. Highest confidence, slowest. | Detox, Appium, Maestro |

### Unit Test Example

```tsx
import {sum} from '../src/utils';

test('sum adds two numbers', () => {
  expect(sum(1, 2)).toBe(3);
});
```

### Component Test Example

```tsx
import {render, fireEvent} from '@testing-library/react-native';
import MyButton from '../src/MyButton';

test('button calls onPress', () => {
  const onPress = jest.fn();
  const {getByText} = render(<MyButton title="Press" onPress={onPress} />);
  fireEvent.press(getByText('Press'));
  expect(onPress).toHaveBeenCalled();
});
```

### E2E Testing

- Build app in release configuration
- Test from user perspective (tap buttons, type text, assert visibility)
- Highest confidence but slower and more prone to flakiness
- Cover vital flows: authentication, core functionality, payments
- **Detox** — tailored for React Native
- **Appium** — cross-platform mobile testing
- **Maestro** — UI-driven mobile testing

### Jest Watch Mode

```bash
npx jest --watch  # runs tests related to files you're editing
```

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

## Publishing to Google Play Store (Android)

1. **Generate upload key:**
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. **Set up Gradle variables** — place keystore in `android/app/`, add to `~/.gradle/gradle.properties`:
```properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****
```

3. **Add signing config** to `android/app/build.gradle`:
```groovy
signingConfigs {
  release {
    if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
      storeFile file(MYAPP_UPLOAD_STORE_FILE)
      storePassword MYAPP_UPLOAD_STORE_PASSWORD
      keyAlias MYAPP_UPLOAD_KEY_ALIAS
      keyPassword MYAPP_UPLOAD_KEY_PASSWORD
    }
  }
}
buildTypes {
  release {
    signingConfig signingConfigs.release
  }
}
```

4. **Generate release AAB:**
```bash
npx react-native build-android --mode=release
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

---

## Publishing to Apple App Store (iOS)

1. **Configure release scheme** — Xcode → Product → Scheme → Edit Scheme → Run → Build Configuration → Release
2. **Build for release:**
```bash
npm run ios -- --mode="Release"
# or
yarn ios --mode Release
```
3. **Archive** — Xcode → Product → Archive (set device to "Any iOS Device (arm64)")
4. **Distribute** — Click "Distribute App" → App Store Connect → Upload
5. **Submit** — In App Store Connect, fill info, select build, submit for review

**Pro tip:** Skip JS bundling in Debug for faster device builds:
```bash
# In Xcode Build Phase "Bundle React Native code and images"
if [ "${CONFIGURATION}" == "Debug" ]; then export SKIP_BUNDLING=true; fi
```

---

## App Extensions (iOS)

App extensions let you provide custom functionality outside your main app (e.g., Today widgets, Share extensions).

### Memory Considerations

- Extensions load outside regular app sandbox
- Multiple extensions may load simultaneously
- **Strict memory limits** — much lower than the main app
- Today widget: ~48MB limit
- Other extensions: even lower
- **Always test on real device** — Simulator may not enforce memory limits
- Extensions that work in Simulator may fail to load on actual devices

---

## Metro Bundler

React Native uses [Metro](https://metrobundler.dev/) to build JavaScript code and assets.

### Configuring Metro

Configuration in `metro.config.js` — can export either:
- **Object** (recommended): merged on top of Metro's internal defaults
- **Function**: called with defaults, returns final config

```js
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

> Always extend `@react-native/metro-config` or `@expo/metro-config` — they contain essential defaults.

### Common Config Options

```js
module.exports = {
  transformer: {
    async getTransformOptions() {
      return {
        transform: {
          inlineRequires: true,          // auto-inline require() calls
          experimentalImportSupport: false,
        },
      };
    },
  },
  resolver: {
    assetExts: ['png', 'jpg', 'gif'],    // additional asset extensions
    sourceExts: ['js', 'jsx', 'ts', 'tsx'],
  },
  server: {
    port: 8081,                           // dev server port
  },
};
```

### Metro Features

- **Fast Refresh:** Hot-reloads components on save without losing state
- **Tree shaking:** Removes dead code in production builds
- **Code splitting:** Inline requires for lazy loading
- **Asset bundling:** Images, fonts, and other assets

---

## Upgrading React Native

### Expo Projects

```bash
npx expo install --fix
```

### React Native Projects (Upgrade Helper)

1. Go to [Upgrade Helper](https://react-native-community.github.io/upgrade-helper/)
2. Select from/to versions
3. **Upgrade dependencies:**

```bash
npm install react-native@{{VERSION}}
npm install react@{{REACT_VERSION}}
```

4. **Upgrade project files:** Manually apply diffs from Upgrade Helper for non-`package.json` files (iOS/Android native files, configs)
5. Rebuild: `npm run ios` / `npm run android`

### Troubleshooting Upgrades

- Run `npx react-native clean` to clear caches
- iOS: `cd ios && pod install`
- Android: `cd android && ./gradlew clean`
- Metro cache: `npm start -- --reset-cache`

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

---

## Additional Troubleshooting

### Port Already in Use (8081)

```bash
# Find process on port 8081
sudo lsof -i :8081          # macOS/Linux
# Windows: use Resource Monitor

# Kill the process
kill -9 <PID>

# Or use a different port
npm start -- --port=8088
```

### NPM Locking Error (EACCES)

```bash
sudo chown -R $USER ~/.npm
sudo chown -R $USER /usr/local/lib/node_modules
```

### Missing Libraries for React (iOS Manual Setup)

Ensure all relevant dependencies are linked in Xcode → Linked Frameworks and Binaries. If using CocoaPods:

```ruby
pod 'React', :path => '../node_modules/react-native', :subspecs => [
  'RCTText', 'RCTImage', 'RCTNetwork', 'RCTWebSocket',
]
```

Then `pod install` and use the `.xcworkspace` file.

### ShellCommandUnresponsiveException (Android)

```bash
adb kill-server
adb start-server
```

### ENOSPC Error (Linux)

File watcher limit reached. Increase it:

```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### spawnSync EACCES (Gradle)

Make gradlew executable:

```bash
chmod +x android/gradlew
```

---

## TypeScript: Custom Path Aliases

### 1. Configure tsconfig.json

```json
{
  "extends": "@react-native/typescript-config",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "*": ["src/*"],
      "tests": ["tests/*"],
      "@components/*": ["src/components/*"]
    }
  }
}
```

### 2. Install babel-plugin-module-resolver

```bash
npm install --save-dev babel-plugin-module-resolver
```

### 3. Configure babel.config.js

```js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          tests: ['./tests/'],
          '@components': './src/components',
        }
      }
    ]
  ]
};
```

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

## Strict TypeScript API (Opt In)

Preview of the future stable JavaScript API for React Native. Opt in via `tsconfig.json`:

```json
{
  "extends": "@react-native/typescript-config",
  "compilerOptions": {
    "customConditions": ["react-native-strict-api"]
  }
}
```

### Breaking Changes

**Removal of `*Static` types:** Use the non-Static alias instead.

```tsx
// Before
import {Linking, LinkingStatic} from 'react-native';
function foo(linking: LinkingStatic) {}

// After
import {Linking} from 'react-native';
function foo(linking: Linking) {}
```

Affected: `AlertStatic`, `ActionSheetIOSStatic`, `ToastAndroidStatic`, `InteractionManagerStatic`, `UIManagerStatic`, `PlatformStatic`, `SectionListStatic`, `PixelRatioStatic`, `AppStateStatic`, `AccessibilityInfoStatic`, `BackHandlerStatic`, `DevMenuStatic`, `ClipboardStatic`, `PermissionsAndroidStatic`, `ShareStatic`, `DevSettingsStatic`, `I18nManagerStatic`, `EasingStatic`, `PanResponderStatic`, `NativeModulesStatic`, `LogBoxStatic`, `SettingsStatic`, `VibrationStatic`, etc.

**Core components now function components:**
View, Image, TextInput, Modal, Text, TouchableWithoutFeedback, Switch, ActivityIndicator, Button, SafeAreaView — use `React.ComponentRef<typeof View>` for refs:

```tsx
const ref = useRef<React.ComponentRef<typeof View>>(null);
```

**Other changes:**
- `Animated` types are now non-generic with generic `interpolate` method
- `Animated.LegacyRef` removed
- Optional props typed as `type | undefined`
- Deprecated types and leftover component props removed (e.g., `lineBreakMode` on Text, `scrollWithoutAnimationTo` on ScrollView)

---

## PlatformColor

Access native platform colors.

```tsx
import {PlatformColor} from 'react-native';

// iOS
{backgroundColor: PlatformColor('systemBackground')}
{color: PlatformColor('labelColor')}

// Android
{backgroundColor: PlatformColor('?android:colorBackground')}
{color: PlatformColor('?android:attr/textColorPrimary')}
```

### Supported Colors

- **Android:** `R.attr` (`?attr` prefix), `R.color` (`@android:color` prefix)
- **iOS:** `UIColor` standard colors, `UIColor` UI element colors

> Think of PlatformColor as tapping into the local design system's color tokens.

---

## useColorScheme

React hook that provides and subscribes to color scheme updates.

```tsx
import {useColorScheme} from 'react-native';

const colorScheme = useColorScheme();
// 'light' | 'dark' | null
```

### Return Values

| Value | Description |
|-------|-------------|
| `'light'` | Light color scheme |
| `'dark'` | Dark color scheme |
| `null` | Native Appearance module not available |

> May update via user action (theme selection in settings) or schedule (day/night cycle).

---

## useWindowDimensions

React hook for window dimensions — updates reactively on screen size or font scale changes.

```tsx
import {useWindowDimensions} from 'react-native';

const {width, height, scale, fontScale} = useWindowDimensions();
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `width` | `number` | Window width in pixels |
| `height` | `number` | Window height in pixels |
| `scale` | `number` | Pixel ratio (1=standard, 2/3=Retina/high DPI) |
| `fontScale` | `number` | Font scaling factor (user's font size preference) |

> **Preferred over `Dimensions.get()`** in React components — updates reactively.
