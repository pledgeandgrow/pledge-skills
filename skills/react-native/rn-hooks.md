# Hooks: PlatformColor, useColorScheme, useWindowDimensions

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
