# Platform-Specific Code

---

## Platform Module

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

## Detecting Platform Version

```tsx
// Android (returns API level as number)
if (Platform.Version >= 31) { /* Android 12+ */ }

// iOS (returns version as string)
if (parseInt(Platform.Version, 10) >= 16) { /* iOS 16+ */ }
```

## File Extensions

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
