# InteractionManager, Timers, Alert, AppRegistry & DevSettings API Reference

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
