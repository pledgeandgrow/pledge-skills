# AccessibilityInfo & AppState API Reference

---

## AccessibilityInfo

Query and subscribe to accessibility state.

### Events

| Event | Platform | Description |
|-------|----------|-------------|
| `screenReaderChanged` | Both | Screen reader toggled |
| `reduceMotionChanged` | Both | Reduce motion toggled |
| `announcementFinished` | iOS | Announcement completed |
| `touchExplorationStateChanged` | Android | Touch exploration toggled |
| `grayscaleStateChanged` | Android | Grayscale toggled |
| `invertColorsStateChanged` | Android | Invert colors toggled |

### Methods

```tsx
import {AccessibilityInfo} from 'react-native';

// Check if screen reader is enabled
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
