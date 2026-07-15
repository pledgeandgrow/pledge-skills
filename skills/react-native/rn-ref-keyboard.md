# Keyboard API Reference

Control keyboard events and dismiss keyboard.

---

## Events

| Event | Platform | Description |
|-------|----------|-------------|
| `keyboardWillShow` | iOS | Keyboard about to show |
| `keyboardDidShow` | Both | Keyboard shown |
| `keyboardWillHide` | iOS | Keyboard about to hide |
| `keyboardDidHide` | Both | Keyboard hidden |
| `keyboardWillChangeFrame` | iOS | Keyboard frame about to change |
| `keyboardDidChangeFrame` | iOS | Keyboard frame changed |

> Android only fires `keyboardDidShow` and `keyboardDidHide`. Won't fire on Android 10- if `windowSoftInputMode` is `adjustResize` or `adjustNothing`.

## Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `addListener(event, callback)` | `EmitterSubscription` | Listen for keyboard events |
| `dismiss()` | `void` | Dismiss active keyboard |
| `isVisible()` | `boolean` | Is keyboard last known to be visible? |
| `metrics()` | `Object \| undefined` | Keyboard metrics `{height, width, screenX, screenY}` |
| `scheduleLayoutAnimation(event)` | `void` | Sync TextInput size with keyboard movement |

## KeyboardEvent

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

## Usage

```tsx
import {Keyboard} from 'react-native';

useEffect(() => {
  const showSub = Keyboard.addListener('keyboardDidShow', e => {
    console.log('Keyboard height:', e.endCoordinates.height);
  });
  const hideSub = Keyboard.addListener('keyboardDidHide', () => {
    console.log('Keyboard hidden');
  });
  return () => {
    showSub.remove();
    hideSub.remove();
  };
}, []);

Keyboard.dismiss();
const visible = Keyboard.isVisible();
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
