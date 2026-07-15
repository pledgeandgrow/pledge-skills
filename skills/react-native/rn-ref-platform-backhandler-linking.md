# Platform, BackHandler & Linking API Reference

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
