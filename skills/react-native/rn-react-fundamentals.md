# React Fundamentals, Timers, Keyboard, Accessibility & Misc APIs

---

## React Fundamentals (in React Native Context)

### Components

```tsx
// Function component with TypeScript
import {Text} from 'react-native';

export type Props = {
  name: string;
  baseEnthusiasmLevel?: number;
};

function Hello({name, baseEnthusiasmLevel = 0}: Props) {
  return <Text>Hello {name}!</Text>;
}

export default Hello;
```

### JSX

JSX lets you write elements inside JavaScript. Use curly braces for JS expressions:

```tsx
const name = 'Whiskers';
<Text>Hello, {name}!</Text>

// Any JS expression works:
<Text>{getFullName('Rum', 'Tum', 'Tugger')}</Text>
```

### Props

Props configure how a component renders. Pass them as attributes:

```tsx
<Cat name="Munkustrap" />
<Cat name="Spot" />

// Access in component:
const Cat = (props: {name: string}) => {
  return <Text>Hello, I am {props.name}</Text>;
};
```

### State (useState)

State is a component's personal data storage for data that changes over time:

```tsx
import {useState} from 'react';
import {Button, Text, View} from 'react-native';

const Cat = () => {
  const [isHungry, setIsHungry] = useState(true);

  return (
    <View>
      <Text>{isHungry ? 'Give me food!' : 'Thank you!'}</Text>
      <Button
        onPress={() => setIsHungry(false)}
        disabled={!isHungry}
        title={isHungry ? 'Feed me' : 'Done'}
      />
    </View>
  );
};
```

Pattern: `[<getter>, <setter>] = useState(<initialValue>)`

### Fragment

Use `<>...</>` to group multiple elements without a wrapper View:

```tsx
const Cafe = () => {
  return (
    <>
      <Cat name="Munkustrap" />
      <Cat name="Spot" />
    </>
  );
};
```

---

## Timers

React Native implements the browser timers:

- `setTimeout` / `clearTimeout`
- `setInterval` / `clearInterval`
- `setImmediate` / `clearImmediate`
- `requestAnimationFrame` / `cancelAnimationFrame`

```tsx
// requestAnimationFrame fires after all frames flushed
// setTimeout(fn, 0) fires as quickly as possible (>1000x/sec on older devices)
requestAnimationFrame(() => console.log('after frame'));
setTimeout(() => console.log('asap'), 0);

// setImmediate runs at end of current JS execution block
// Promise implementation uses setImmediate for asynchronicity
setImmediate(() => console.log('end of block'));
```

**Android debugging note:** If debugger/device time drifts, animations/events may break. Fix with:
```bash
adb shell "date `date +%m%d%H%M%Y.%S%3N`"  # requires root on real device
```

---

## Keyboard Module

Control keyboard events and dismiss the keyboard.

```tsx
import {Keyboard, TextInput} from 'react-native';

// Listen for keyboard events
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

// Dismiss keyboard
Keyboard.dismiss();

// Check if keyboard is visible
const visible = Keyboard.isVisible();

// Sync TextInput size with keyboard movements
Keyboard.scheduleLayoutAnimation(event);
```

**Events:** `keyboardWillShow`, `keyboardDidShow`, `keyboardWillHide`, `keyboardDidHide`, `keyboardWillChangeFrame`, `keyboardDidChangeFrame`

> Android only fires `keyboardDidShow` and `keyboardDidHide`. Events won't fire on Android 10- if `windowSoftInputMode` is `adjustResize` or `adjustNothing`.

---

## Accessibility

### Core Properties

| Prop | Platform | Description |
|------|----------|-------------|
| `accessible` | Both | View discoverable by screen readers. Default `true` for touchable elements |
| `accessibilityLabel` | Both | Screen reader verbalizes this string |
| `accessibilityHint` | Both | Additional context for action result |
| `accessibilityRole` | Both | Role type (e.g., `button`, `image`, `text`, `adjustable`) |
| `accessibilityState` | Both | State description (`disabled`, `selected`, `checked`) |
| `accessibilityValue` | Both | Range value for sliders/progress bars |
| `accessibilityLiveRegion` | Android | Announce changes (`none`, `polite`, `assertive`) |
| `accessibilityViewIsModal` | iOS | VoiceOver ignores sibling views |
| `accessibilityElementsHidden` | iOS | Hide element and children from VoiceOver |
| `importantForAccessibility` | Android | Control focus behavior |

### ARIA Props (both platforms)

`aria-busy`, `aria-checked`, `aria-disabled`, `aria-expanded`, `aria-hidden`, `aria-label`, `aria-labelledby` (Android), `aria-live` (Android), `aria-modal` (iOS), `aria-selected`, `aria-valuemax`, `aria-valuemin`, `aria-valuenow`, `aria-valuetext`

### Accessibility Actions

```tsx
<View
  accessible={true}
  accessibilityActions={[
    {name: 'cut', label: 'cut'},
    {name: 'copy', label: 'copy'},
    {name: 'paste', label: 'paste'},
  ]}
  onAccessibilityAction={event => {
    switch (event.nativeEvent.actionName) {
      case 'cut': Alert.alert('Alert', 'cut action'); break;
      case 'copy': Alert.alert('Alert', 'copy action'); break;
    }
  }}
/>
```

**Standard action names:** `activate`, `increment`, `decrement`, `longpress` (Android), `expand` (Android), `collapse` (Android), `magicTap` (iOS), `escape` (iOS)

### Check Screen Reader

```tsx
import {AccessibilityInfo} from 'react-native';

const isScreenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
AccessibilityInfo.addEventListener('screenReaderChanged', isEnabled => {});
```

---

## Other APIs

### AppState

```tsx
import {AppState} from 'react-native';

const appState = useRef(AppState.currentState);

useEffect(() => {
  const subscription = AppState.addEventListener('change', nextAppState => {
    appState.current = nextAppState;
  });
  return () => subscription.remove();
}, []);
```

### BackHandler (Android)

```tsx
import {BackHandler} from 'react-native';

useEffect(() => {
  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    () => {
      // Return true to prevent default behavior
      return true;
    }
  );
  return () => backHandler.remove();
}, []);
```

### Clipboard

```tsx
// Use @react-native-clipboard/clipboard community package
import Clipboard from '@react-native-clipboard/clipboard';

Clipboard.setString('hello');
const text = await Clipboard.getString();
```

### PermissionsAndroid

```tsx
import {PermissionsAndroid} from 'react-native';

const granted = await PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.CAMERA,
  {
    title: 'Camera Permission',
    message: 'App needs access to your camera',
    buttonNeutral: 'Ask Me Later',
    buttonNegative: 'Cancel',
    buttonPositive: 'OK',
  }
);
```

### ToastAndroid

```tsx
import {ToastAndroid} from 'react-native';

ToastAndroid.show('Message', ToastAndroid.SHORT);
ToastAndroid.showWithGravity('Message', ToastAndroid.LONG, ToastAndroid.TOP);
```

### ActionSheetIOS

```tsx
import {ActionSheetIOS} from 'react-native';

ActionSheetIOS.showActionSheetWithOptions(
  {
    options: ['Option 1', 'Option 2', 'Cancel'],
    cancelButtonIndex: 2,
    destructiveButtonIndex: 1,
  },
  buttonIndex => {
    console.log(buttonIndex);
  }
);
```

### InteractionManager (Deprecated)

> **Note:** InteractionManager is deprecated. Use `requestIdleCallback` instead.

```tsx
import {InteractionManager} from 'react-native';

// Schedule work after animations complete
InteractionManager.runAfterInteractions(() => {
  // heavy work here
});

// Advanced: create interaction handle
const handle = InteractionManager.createInteractionHandle();
// ... do work ...
InteractionManager.clearInteractionHandle(handle);

// Set deadline for runAfterInteractions tasks
InteractionManager.setDeadline(1000); // 1 second
```
