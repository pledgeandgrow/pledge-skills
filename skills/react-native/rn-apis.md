# React Native APIs

Reference for React Native's built-in APIs: Animated, Navigation, Networking,
Platform, and more.

---

## Animated API

The `Animated` library for creating fluid, powerful animations. Focuses on declarative
relationships between inputs and outputs with configurable transforms.

### Animated Components

Pre-built animated components: `Animated.View`, `Animated.Text`, `Animated.Image`,
`Animated.ScrollView`, `Animated.FlatList`, `Animated.SectionList`.

Create custom: `Animated.createAnimatedComponent(MyComponent)`

### Animated.Value

```tsx
import {Animated} from 'react-native';

// Create animated value
const fadeAnim = useRef(new Animated.Value(0)).current;

// Fade in on mount
useEffect(() => {
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 2000,
    useNativeDriver: true,
  }).start();
}, []);

return (
  <Animated.View style={{opacity: fadeAnim}}>
    <Text>Fade in</Text>
  </Animated.View>
);
```

### Animation Types

**Animated.timing** — animate over time with easing:
```tsx
Animated.timing(value, {
  toValue: 100,
  easing: Easing.back(),
  duration: 2000,
  useNativeDriver: true,
}).start();
```

**Animated.spring** — physics-based spring animation:
```tsx
Animated.spring(value, {
  toValue: {x: 0, y: 0},
  useNativeDriver: true,
}).start();
```

**Animated.decay** — coast to a stop with initial velocity:
```tsx
Animated.decay(position, {
  velocity: {x: gestureState.vx, y: gestureState.vy},
  deceleration: 0.997,
  useNativeDriver: true,
}).start();
```

### Composing Animations

```tsx
// Sequence — play one after another
Animated.sequence([
  Animated.timing(value1, {toValue: 1, useNativeDriver: true}),
  Animated.timing(value2, {toValue: 1, useNativeDriver: true}),
]).start();

// Parallel — play simultaneously
Animated.parallel([
  Animated.spring(position, {toValue: {x: 0, y: 0}, useNativeDriver: true}),
  Animated.timing(twirl, {toValue: 360, useNativeDriver: true}),
]).start();

// Stagger — play with delays between each
Animated.stagger(100, [
  Animated.timing(v1, {toValue: 1, useNativeDriver: true}),
  Animated.timing(v2, {toValue: 1, useNativeDriver: true}),
]).start();
```

### Combining Animated Values

```tsx
const a = new Animated.Value(1);
const b = Animated.divide(1, a);  // inverse: 2x → 0.5x
const sum = Animated.add(a, b);
const product = Animated.multiply(a, b);
```

### Interpolation

```tsx
const opacity = fadeAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 1],
  extrapolate: 'clamp',  // 'extend' | 'identity' | 'clamp'
});
```

### Native Driver

Setting `useNativeDriver: true` sends animation to native before starting, allowing
animation on UI thread without JS bridge overhead.

```tsx
Animated.timing(value, {
  toValue: 1,
  duration: 500,
  useNativeDriver: true,  // <-- required for performance
}).start();
```

**Caveats:**
- Only animates non-layout properties: `transform`, `opacity` (NOT flexbox/position)
- `Animated.event` only works with direct events (not bubbling)
- Works with `ScrollView#onScroll`, NOT `PanResponder`
- Use `isInteraction: false` to prevent blocking `VirtualizedList` rendering

### Animated.event

```tsx
<Animated.ScrollView
  onScroll={Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}],
    {useNativeDriver: true}
  )}
>
  {content}
</Animated.ScrollView>
```

### LayoutAnimation API

Fire-and-forget animations using Core Animation (not affected by JS thread drops):

```tsx
import {LayoutAnimation, UIManager, Platform} from 'react-native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
// Then trigger state update that changes layout
setLayout({height: newHeight});
```

**When to use:** Modal animations, layout changes during network requests.
**When NOT to use:** When animation must be interruptible — use `Animated` instead.

---

## Navigation (React Navigation)

### Installation

```bash
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
```

### Static API (recommended)

```tsx
import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {title: 'Welcome'},
    },
    Profile: {
      screen: ProfileScreen,
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

### Navigation Usage

```tsx
import {useNavigation} from '@react-navigation/native';

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <Button
      title="Go to profile"
      onPress={() => navigation.navigate('Profile', {name: 'Jane'})}
    />
  );
}

function ProfileScreen({route}) {
  return <Text>This is {route.params.name}'s profile</Text>;
}
```

`createNativeStackNavigator` uses native APIs: `UINavigationController` on iOS,
`Fragment` on Android — same performance as native apps.

Other navigator types: tabs (`createBottomTabNavigator`), drawer (`createDrawerNavigator`).

---

## Networking

### Using Fetch

```tsx
// GET request
const getMovies = async () => {
  try {
    const response = await fetch('https://reactnative.dev/movies.json');
    const json = await response.json();
    return json.movies;
  } catch (error) {
    console.error(error);
  }
};

// POST request
fetch('https://mywebsite.com/endpoint/', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstParam: 'yourValue',
    secondParam: 'yourOtherValue',
  }),
});
```

### Using XMLHttpRequest

```tsx
const request = new XMLHttpRequest();
request.onreadystatechange = e => {
  if (request.readyState !== 4) return;
  if (request.status === 200) {
    console.log('success', request.responseText);
  } else {
    console.warn('error');
  }
};
request.open('GET', 'https://mywebsite.com/endpoint/');
request.send();
```

No CORS in native apps — XMLHttpRequest security model differs from web.

### WebSocket Support

```tsx
const ws = new WebSocket('ws://host.com/path');
ws.onopen = () => ws.send('something');
ws.onmessage = e => console.log(e.data);
ws.onerror = e => console.log(e.message);
ws.onclose = e => console.log(e.code, e.reason);
```

### Known Issues with fetch

- `redirect:manual` not working
- `credentials:omit` not working
- Same name headers on Android → only latest present
- Cookie based authentication unstable (especially iOS 302 redirects with Set-Cookie)

### Platform Security Notes

- **iOS 9+:** App Transport Security (ATS) requires HTTPS. Add ATS exception for HTTP.
- **Android API 28+:** Clear text traffic blocked by default. Override with `android:usesCleartextTraffic`.

---

## Platform Module

```tsx
import {Platform} from 'react-native';

// Detect platform
Platform.OS  // 'ios' | 'android'

// Platform-specific styles
const styles = StyleSheet.create({
  height: Platform.OS === 'ios' ? 200 : 100,
});

// Platform.select
const container = {
  flex: 1,
  ...Platform.select({
    ios: {backgroundColor: 'red'},
    android: {backgroundColor: 'green'},
    default: {backgroundColor: 'blue'},
  }),
};

// Platform-specific components
const Component = Platform.select({
  ios: () => require('ComponentIOS'),
  android: () => require('ComponentAndroid'),
})();
```

### Platform Version

```tsx
// Android version
Platform.Version  // number (API level)

// iOS version
Platform.Version  // string (e.g. "16.0")
if (parseInt(Platform.Version, 10) >= 13) { /* iOS 13+ */ }
```

### Platform-Specific Extensions

File extensions for platform-specific code:
- `BigButton.ios.js` — loaded on iOS
- `BigButton.android.js` — loaded on Android
- `BigButton.native.js` — loaded on React Native (both iOS + Android)
- `BigButton.js` — loaded by web bundlers (webpack, Rollup)

```tsx
// Import without extension — React Native picks the right file
import BigButton from './BigButton';
```

---

## Other APIs

### AccessibilityInfo

```tsx
import {AccessibilityInfo} from 'react-native';

// Check if screen reader is enabled
const isScreenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();

// Listen for screen reader changes
AccessibilityInfo.addEventListener('screenReaderChanged', isEnabled => {});
```

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
