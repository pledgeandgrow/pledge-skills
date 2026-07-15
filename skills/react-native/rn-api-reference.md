# React Native API Reference

Detailed API reference for core modules. For usage examples and overview, see `rn-apis.md`.

---

## AccessibilityInfo

Query and control accessibility features.

### Events

| Event | Platform | Description |
|-------|----------|-------------|
| `screenReaderChanged` | Both | Screen reader enabled/disabled |
| `announcementFinished` | Both | Announcement completed (`{announcement, success}`) |
| `reduceMotionChanged` | Both | Reduce motion toggled |
| `boldTextChanged` | iOS | Bold text toggled |
| `grayscaleChanged` | iOS | Grayscale toggled |
| `invertColorsChanged` | iOS | Invert colors toggled |
| `reduceTransparencyChanged` | iOS | Reduce transparency toggled |
| `accessibilityServiceChanged` | Android | Accessibility service toggled |

### Methods

| Method | Platform | Returns | Description |
|--------|----------|---------|-------------|
| `isScreenReaderEnabled()` | Both | `Promise<boolean>` | Is screen reader (TalkBack/VoiceOver) active? |
| `isReduceMotionEnabled()` | Both | `Promise<boolean>` | Is reduce motion enabled? |
| `isBoldTextEnabled()` | iOS | `Promise<boolean>` | Is bold text enabled? |
| `isGrayscaleEnabled()` | iOS | `Promise<boolean>` | Is grayscale enabled? |
| `isInvertColorsEnabled()` | iOS | `Promise<boolean>` | Is invert colors enabled? |
| `isReduceTransparencyEnabled()` | iOS | `Promise<boolean>` | Is reduce transparency enabled? |
| `isDarkerSystemColorsEnabled()` | iOS | `Promise<boolean>` | Are darker system colors enabled? |
| `prefersCrossFadeTransitions()` | iOS | `Promise<boolean>` | Prefers cross-fade transitions? |
| `isHighTextContrastEnabled()` | Android | `Promise<boolean>` | Is high text contrast enabled? |
| `isAccessibilityServiceEnabled()` | Android | `Promise<boolean>` | Any accessibility service enabled? |
| `getRecommendedTimeoutMillis(ms)` | Android | `Promise<number>` | Get recommended timeout (accessibility timeout setting) |
| `announceForAccessibility(str)` | Both | `void` | Announce string via screen reader |
| `announceForAccessibilityWithOptions(str, {queue})` | iOS | `void` | Announce with queue option |
| `sendAccessibilityEvent(host, eventType)` | Both | `void` | Trigger accessibility event (`'click'`, `'focus'`, `'viewHoverEnter'`, `'windowStateChange'`) |
| `setAccessibilityFocus(reactTag)` | Both | `void` | **Deprecated.** Use `sendAccessibilityEvent` with `'focus'` |

### Usage

```tsx
import {AccessibilityInfo} from 'react-native';

// Check screen reader
const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();

// Listen for changes
const sub = AccessibilityInfo.addEventListener('screenReaderChanged', enabled => {
  console.log('Screen reader:', enabled);
});
// Cleanup
sub.remove();

// Announce
AccessibilityInfo.announceForAccessibility('Page loaded');
```

---

## AppState

Tells if app is in foreground or background, notifies on state changes.

### App States

| State | Description |
|-------|-------------|
| `active` | App running in foreground |
| `background` | App running in background |
| `inactive` | App transitioning between states (iOS only) |

### Events

| Event | Platform | Description |
|-------|----------|-------------|
| `change` | Both | App state changed. Listener receives new state. |
| `memoryWarning` | iOS | Memory warning from OS |
| `focus` | Android | App gained focus (user interacting) |
| `blur` | Android | App lost focus (e.g., notification drawer pulled) |

### Methods

```tsx
// Add listener
const sub = AppState.addEventListener('change', nextAppState => {
  console.log('New state:', nextAppState);
});
sub.remove();

// Get current state
const state = AppState.currentState; // 'active' | 'background' | 'inactive'
```

### Usage

```tsx
import {AppState} from 'react-native';

useEffect(() => {
  const sub = AppState.addEventListener('change', nextAppState => {
    if (nextAppState === 'active') {
      // App came back to foreground
    }
  });
  return () => sub.remove();
}, []);
```

---

## Dimensions

> **Preferred:** Use `useWindowDimensions()` hook in React components — it updates reactively.

### Methods

```tsx
// Get dimensions
const {width, height} = Dimensions.get('window');
const {width, height} = Dimensions.get('screen');

// Listen for changes
const sub = Dimensions.addEventListener('change', ({window, screen}) => {
  console.log('Window:', window);
});
sub.remove();
```

### ScaledSize Type

```tsx
type ScaledSize = {
  width: number;
  height: number;
  scale: number;       // pixel ratio
  fontScale: number;   // font scaling factor
};
```

### useWindowDimensions Hook (preferred)

```tsx
import {useWindowDimensions} from 'react-native';

const {width, height, scale, fontScale} = useWindowDimensions();
```

Updates reactively when window changes (rotation, keyboard, split view).

### window vs screen

- `window`: App's visible area (excludes status bar on Android if not translucent, excludes navigation bar)
- `screen`: Full device screen dimensions

---

## PixelRatio

Access device pixel density and font scale.

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `get()` | `number` | Device pixel density (1=mdpi, 1.5=hdpi, 2=xhdpi, 3=xxhdpi, 3.5=xxxhdpi) |
| `getFontScale()` | `number` | Font scaling factor (user's font size preference) |
| `getPixelSizeForLayoutSize(layoutSize)` | `number` | Convert dp to px (returns integer) |
| `roundToNearestPixel(layoutSize)` | `number` | Round dp to nearest pixel-aligned value |

### Pixel Density Reference

| Value | Devices |
|-------|---------|
| `1` | mdpi Android |
| `1.5` | hdpi Android |
| `2` | iPhone SE/6S/7/8, iPhone XR/11, xhdpi Android |
| `3` | iPhone 6S+/7+/8+, iPhone X/XS/XS Max, 11 Pro/Pro Max, Pixel, xxhdpi Android |
| `3.5` | Nexus 6, Pixel XL, Pixel 2 XL, xxxhdpi Android |

### Usage

```tsx
import {PixelRatio} from 'react-native';

// Get correctly sized image
const ratio = PixelRatio.get();
const image = ratio >= 3 ? require('./image@3x.png')
            : ratio >= 2 ? require('./image@2x.png')
            : require('./image.png');

// Convert dp to px
const px = PixelRatio.getPixelSizeForLayoutSize(100); // e.g., 300 on 3x device

// Snap to pixel grid
const snapped = PixelRatio.roundToNearestPixel(8.4); // 8.33 on 3x device
```

---

## Keyboard

Control keyboard events and dismiss keyboard.

### Events

| Event | Platform | Description |
|-------|----------|-------------|
| `keyboardWillShow` | iOS | Keyboard about to show |
| `keyboardDidShow` | Both | Keyboard shown |
| `keyboardWillHide` | iOS | Keyboard about to hide |
| `keyboardDidHide` | Both | Keyboard hidden |
| `keyboardWillChangeFrame` | iOS | Keyboard frame about to change |
| `keyboardDidChangeFrame` | iOS | Keyboard frame changed |

> Android only fires `keyboardDidShow` and `keyboardDidHide`. Won't fire on Android 10- if `windowSoftInputMode` is `adjustResize` or `adjustNothing`.

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `addListener(event, callback)` | `EmitterSubscription` | Listen for keyboard events |
| `dismiss()` | `void` | Dismiss active keyboard |
| `isVisible()` | `boolean` | Is keyboard last known to be visible? |
| `metrics()` | `Object \| undefined` | Keyboard metrics `{height, width, screenX, screenY}` |
| `scheduleLayoutAnimation(event)` | `void` | Sync TextInput size with keyboard movement |

### KeyboardEvent

```tsx
type KeyboardEvent = {
  endCoordinates: {
    height: number;
    width: number;
    screenX: number;
    screenY: number;
  };
  duration: number;    // animation duration (iOS)
  easing: string;      // animation easing (iOS)
  startCoordinates: {  // (iOS)
    height: number;
    width: number;
    screenX: number;
    screenY: number;
  };
  isEventFromTextInput: boolean; // (Android)
};
```

---

## Platform

Access platform-specific information and implement platform-specific code.

### Properties

```tsx
Platform.OS          // 'ios' | 'android' | 'web' | 'macos' | 'windows'
Platform.Version     // iOS: string (e.g., '17.0'), Android: number (API level)
Platform.isTV        // boolean
Platform.isTesting   // boolean
```

### Platform.select

```tsx
import {Platform} from 'react-native';

const value = Platform.select({
  ios: 'iOS value',
  android: 'Android value',
  default: 'fallback',
});

// Shorthand with specific keys
const Component = Platform.select({
  ios: () => require('./IOSComponent').default,
  android: () => require('./AndroidComponent').default,
})();
```

### Platform-specific Extensions

```
MyComponent.ios.js     // loaded on iOS
MyComponent.android.js // loaded on Android
MyComponent.native.js  // loaded on any native platform (not web)
MyComponent.js         // fallback / web
```

### Platform.Version

```tsx
// iOS: string (e.g., '17.0')
if (Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 13) {
  // iOS 13+
}

// Android: number (API level)
if (Platform.OS === 'android' && Platform.Version >= 33) {
  // Android API 33+ (Android 13)
}
```

---

## BackHandler (Android)

Detect hardware back button press.

### Methods

```tsx
// Add listener (returns subscription)
const sub = BackHandler.addEventListener('hardwareBackPress', () => {
  // Return true to prevent default behavior (exit app)
  return true;
});
sub.remove();

// Exit app (Android only)
BackHandler.exitApp();
```

---

## Linking

Open URLs, deep links, and app links.

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `openURL(url)` | `Promise<void>` | Open URL in system app (browser, phone, etc.) |
| `canOpenURL(url)` | `Promise<boolean>` | Check if URL can be opened |
| `openSettings()` | `Promise<void>` | Open app settings |
| `getInitialURL()` | `Promise<string \| null>` | Get URL that launched the app |
| `addEventListener(type, handler)` | `EmitterSubscription` | Listen for `url` events |

### Usage

```tsx
import {Linking} from 'react-native';

// Open URL
await Linking.openURL('https://example.com');
await Linking.openURL('tel:+1234567890');
await Linking.openURL('mailto:support@example.com');
await Linking.openURL('sms:+1234567890');

// Check if can open
const canOpen = await Linking.canOpenURL('https://example.com');

// Open app settings
await Linking.openSettings();

// Handle deep link
useEffect(() => {
  const sub = Linking.addEventListener('url', ({url}) => {
    console.log('Deep link:', url);
  });
  return () => sub.remove();
}, []);

// Get initial URL (that launched app)
const initialUrl = await Linking.getInitialURL();
```

---

## ToastAndroid (Android)

Show toast notifications.

### Methods

```tsx
ToastAndroid.show('Message', ToastAndroid.SHORT);
ToastAndroid.show('Message', ToastAndroid.LONG);

ToastAndroid.showWithGravity('Message', ToastAndroid.SHORT, ToastAndroid.TOP);
ToastAndroid.showWithGravity('Message', ToastAndroid.LONG, ToastAndroid.CENTER);
ToastAndroid.showWithGravity('Message', ToastAndroid.SHORT, ToastAndroid.BOTTOM);

ToastAndroid.showWithGravityAndOffset(
  'Message', ToastAndroid.LONG, ToastAndroid.TOP, 200, 0
);
```

### Constants

| Constant | Value |
|----------|-------|
| `SHORT` | `0` |
| `LONG` | `1` |
| `TOP` | `3` |
| `BOTTOM` | `1` |
| `CENTER` | `2` |

---

## PermissionsAndroid (Android)

Request Android runtime permissions.

### Common Permissions

```tsx
PermissionsAndroid.PERMISSIONS.CAMERA
PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
PermissionsAndroid.PERMISSIONS.READ_CONTACTS
PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS
PermissionsAndroid.PERMISSIONS.CALL_PHONE
PermissionsAndroid.PERMISSIONS.READ_SMS
PermissionsAndroid.PERMISSIONS.SEND_SMS
PermissionsAndroid.PERMISSIONS.RECEIVE_SMS
```

### Methods

```tsx
// Request single permission
const granted = await PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.CAMERA,
  {
    title: 'Camera Permission',
    message: 'App needs camera access',
    buttonNeutral: 'Ask Me Later',
    buttonNegative: 'Cancel',
    buttonPositive: 'OK',
  }
);
// granted === PermissionsAndroid.RESULTS.GRANTED

// Request multiple permissions
const results = await PermissionsAndroid.requestMultiple([
  PermissionsAndroid.PERMISSIONS.CAMERA,
  PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
]);
// results: { 'android.permission.CAMERA': 'granted', ... }

// Check permission
const status = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
```

### Result Values

| Result | Description |
|--------|-------------|
| `GRANTED` | Permission granted |
| `DENIED` | Permission denied (can ask again) |
| `NEVER_ASK_AGAIN` | Denied with "never ask again" |

---

## ActionSheetIOS (iOS)

Show iOS action sheets and share sheets.

### Methods

```tsx
// Show action sheet
ActionSheetIOS.showActionSheetWithOptions(
  {
    options: ['Option 1', 'Option 2', 'Cancel'],
    cancelButtonIndex: 2,
    destructiveButtonIndex: 1,
    title: 'Choose an option',
    message: 'Select one',
  },
  buttonIndex => {
    console.log('Selected:', buttonIndex);
  }
);

// Show share sheet
ActionSheetIOS.showShareActionSheetWithOptions(
  {
    message: 'Share this text',
    url: 'https://example.com',
  },
  error => console.error(error),
  success => console.log('Shared:', success)
);
```

---

## InteractionManager (Deprecated)

> **Deprecated.** Use `requestIdleCallback` instead.

### Methods

```tsx
// Schedule after interactions
InteractionManager.runAfterInteractions(() => {
  // heavy work
});

// Manual interaction handle
const handle = InteractionManager.createInteractionHandle();
// ... do work ...
InteractionManager.clearInteractionHandle(handle);

// Set deadline
InteractionManager.setDeadline(1000); // 1 second
```

---

## Timers

React Native implements browser timers:

| Function | Description |
|----------|-------------|
| `setTimeout(fn, ms)` | Execute once after delay |
| `clearTimeout(id)` | Cancel timeout |
| `setInterval(fn, ms)` | Execute repeatedly |
| `clearInterval(id)` | Cancel interval |
| `setImmediate(fn)` | Execute at end of current JS block |
| `clearImmediate(id)` | Cancel immediate |
| `requestAnimationFrame(fn)` | Execute after next frame paint |
| `cancelAnimationFrame(id)` | Cancel animation frame |

**Notes:**
- `requestAnimationFrame(fn)` ≠ `setTimeout(fn, 0)` — rAF fires after frame flush, setTimeout fires ASAP
- `setImmediate` runs at end of current JS execution block, before batched response to native
- `Promise` uses `setImmediate` for asynchronicity
- Android debugging: time drift between debugger and device can break animations. Fix: `adb shell "date \`date +%m%d%H%M%Y.%S%3N\`"` (requires root)

---

## Alert

Launches an alert dialog with the specified title and message.

### Methods

```tsx
import {Alert} from 'react-native';

// Basic alert
Alert.alert('Title', 'Message');

// With buttons
Alert.alert(
  'Delete Item',
  'Are you sure?',
  [
    {text: 'Cancel', onPress: () => {}, style: 'cancel'},
    {text: 'OK', onPress: () => {}},
  ],
  {cancelable: false}
);

// iOS prompt (iOS only)
Alert.prompt(
  'Enter Password',
  'Enter your password to continue',
  (text) => console.log('Entered:', text),
  'secure-text',
  '',
  'default'
);
```

### AlertButton

```tsx
type AlertButton = {
  text: string;
  onPress?: (text?: string) => void;
  style?: 'default' | 'cancel' | 'destructive'; // iOS
};
```

### AlertOptions

```tsx
type AlertOptions = {
  cancelable?: boolean;          // Android: dismissable via tap outside
  userInterfaceStyle?: 'unspecified' | 'light' | 'dark'; // iOS 13+
};
```

### Platform Differences

- **iOS:** Supports up to 3 buttons. `prompt()` available.
- **Android:** Supports up to 3 buttons. No `prompt()`. Can be dismissed by tapping outside if `cancelable: true` (default).

### AlertType (iOS prompt)

| Type | Description |
|------|-------------|
| `'default'` | Plain text input |
| `'login-password'` | Login + password fields |
| `'secure-text'` | Secure text entry |
| `'plain-text'` | Plain text (default) |

---

## AppRegistry

Registers apps and headless tasks. Required for native code projects (Expo handles this automatically).

### Key Methods

```tsx
import {AppRegistry} from 'react-native';

// Register app component
AppRegistry.registerComponent('AppName', () => App);

// Register headless task (background)
AppRegistry.registerHeadlessTask('TaskName', () => require('./TaskName'));

// Register cancellable headless task
AppRegistry.registerCancellableHeadlessTask(
  'TaskName',
  () => require('./TaskName'),     // task provider
  () => cancelFunction              // cancel provider
);

// Run application
AppRegistry.runApplication('AppName', {initialProps: {}});
```

### Other Methods

| Method | Description |
|--------|-------------|
| `getAppKeys()` | Returns array of registered app keys |
| `getRegistry()` | Returns `{sections, runnables}` |
| `getRunnable(appKey)` | Returns Runnable for app key |
| `registerConfig(config[])` | Register multiple configs |
| `registerRunnable(appKey, func)` | Register a runnable |
| `registerSection(appKey, component)` | Register a section |
| `setWrapperComponentProvider(provider)` | Wrap all components with provider |
| `setComponentProviderInstrumentationHook(hook)` | Instrument component creation |
| `unmountApplicationComponentAtRootTag(rootTag)` | Unmount app at root tag |

---

## DevSettings

Customize dev settings (dev mode only).

### Methods

```tsx
import {DevSettings} from 'react-native';

// Add custom menu item to Dev Menu
DevSettings.addMenuItem('Show Secret Screen', () => {
  Alert.alert('Secret dev screen!');
});

// Reload the app
DevSettings.reload();
DevSettings.reload('Manual reload reason');
```

---

## KeyboardAvoidingView

Component that adjusts its height, position, or bottom padding based on keyboard height to remain visible.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `behavior` | `'height' \| 'position' \| 'padding'` | — | How to react to keyboard. Recommended on both platforms. |
| `contentContainerStyle` | `ViewStyle` | — | Style for content container (when `behavior='position'`) |
| `enabled` | `boolean` | `true` | Enable/disable KeyboardAvoidingView |
| `keyboardVerticalOffset` | `number` | `0` | Distance between top of screen and RN view (may be non-zero) |

### Usage

```tsx
import {KeyboardAvoidingView, ScrollView, Platform} from 'react-native';

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
  style={{flex: 1}}>
  <ScrollView contentContainerStyle={{flexGrow: 1}}>
    <TextInput placeholder="Enter text" />
  </ScrollView>
</KeyboardAvoidingView>
```

> Inherits all View Props.

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
