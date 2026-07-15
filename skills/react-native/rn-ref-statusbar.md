# StatusBar Component Reference

Component to control the app's status bar.

---

## Props

| Prop | Type | Platform | Default | Description |
|------|------|----------|---------|-------------|
| `animated` | `boolean` | Both | `false` | Animate transitions for `backgroundColor`, `barStyle`, `hidden` |
| `backgroundColor` | `color` | Android | `'black'` | Status bar background color. **Deprecated** in API 35+ (edge-to-edge) |
| `barStyle` | `'default' \| 'light-content' \| 'dark-content'` | Both | `'default'` | Status bar text color. Android: API 23+ only |
| `hidden` | `boolean` | Both | `false` | Hide status bar |
| `networkActivityIndicatorVisible` | `boolean` | iOS | `false` | Show network activity indicator |
| `showHideTransition` | `'fade' \| 'slide'` | iOS | `'fade'` | Transition effect when showing/hiding |
| `translucent` | `boolean` | Android | `false` | App draws under status bar. **Deprecated** in API 35+ (edge-to-edge) |

## Imperative API

```tsx
import {StatusBar} from 'react-native';

// Set bar style
StatusBar.setBarStyle('light-content', true); // animated
// Set background color (Android)
StatusBar.setBackgroundColor('#000000', true);
// Set hidden
StatusBar.setHidden(true, 'slide');
// Set translucent (Android)
StatusBar.setTranslucent(true);
```

## Stack-Based Navigation

```tsx
// Push/pop stack entries for navigation
const entry = StatusBar.pushStackEntry({barStyle: 'light-content'});
// ... later ...
StatusBar.popStackEntry(entry);
// Or replace
StatusBar.replaceStackEntry(entry, {barStyle: 'dark-content'});
```

## Constants

| Constant | Platform | Description |
|----------|----------|-------------|
| `currentHeight` | Android | Current status bar height |

## StatusBarStyle

| Value | Description |
|-------|-------------|
| `'default'` | Default appearance (dark text on light bg) |
| `'light-content'` | Light text (for dark backgrounds) |
| `'dark-content'` | Dark text (for light backgrounds) |

## StatusBarAnimation

| Value | Description |
|-------|-------------|
| `'none'` | No animation |
| `'fade'` | Fade transition |
| `'slide'` | Slide transition |
