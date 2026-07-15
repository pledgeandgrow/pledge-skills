# Button, Switch & ActivityIndicator Component Reference

---

## Button

A basic button component that renders nicely on any platform. Supports minimal customization.

### Props

| Prop | Type | Platform | Description |
|------|------|----------|-------------|
| `onPress` | `(event: PressEvent) => void` | Both | **Required.** Called when user taps the button |
| `title` | `string` | Both | **Required.** Text to display (Android: uppercased) |
| `accessibilityLabel` | `string` | Both | Text for accessibility features |
| `accessibilityLanguage` | `string` | iOS | Language for screen reader (BCP 47 spec) |
| `accessibilityActions` | `array` | Both | Accessibility actions list |
| `onAccessibilityAction` | `(event) => void` | Both | Accessibility action handler |
| `color` | `color` | Both | Text color (iOS), background color (Android) |
| `disabled` | `boolean` | Both | Disable all interactions |
| `hasTVPreferredFocus` | `boolean` | TV | TV preferred focus |
| `nextFocusDown` | `number` | Android TV | Next focus down |
| `nextFocusForward` | `number` | Android TV | Next focus forward |
| `nextFocusLeft` | `number` | Android TV | Next focus left |
| `nextFocusRight` | `number` | Android TV | Next focus right |
| `nextFocusUp` | `number` | Android TV | Next focus up |
| `testID` | `string` | Both | Test ID for E2E tests |
| `touchSoundDisabled` | `boolean` | Android | Disable touch sound |

### Usage

```tsx
import {Button} from 'react-native';

<Button
  onPress={() => console.log('Pressed')}
  title="Press Me"
  color="#2196F3"
  disabled={false}
  accessibilityLabel="Press me button"
/>
```

---

## Switch

Renders a boolean input (toggle switch).

### Props

| Prop | Type | Platform | Description |
|------|------|----------|-------------|
| `disabled` | `boolean` | Both | If true, user can't toggle the switch |
| `ios_backgroundColor` | `color` | iOS | Custom background color (visible when false or disabled) |
| `onChange` | `(event) => void` | Both | Invoked on value change attempt (receives event) |
| `onValueChange` | `(value: boolean) => void` | Both | Invoked on value change attempt (receives new value) |
| `thumbColor` | `color` | Both | Color of foreground switch grip (iOS: loses drop shadow if set) |
| `trackColor` | `{false?: color, true?: color}` | Both | Custom colors for switch track |
| `value` | `boolean` | Both | Value of the switch |
| `ref` | `ref` | Both | Ref to element node |

> Inherits all View Props.

### Usage

```tsx
import {Switch} from 'react-native';

const [isEnabled, setIsEnabled] = useState(false);

<Switch
  trackColor={{false: '#767577', true: '#81b0ff'}}
  thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
  ios_backgroundColor="#3e3e3e"
  onValueChange={setIsEnabled}
  value={isEnabled}
/>
```

---

## ActivityIndicator

Displays a circular loading indicator.

### Props

| Prop | Type | Platform | Default | Description |
|------|------|----------|---------|-------------|
| `animating` | `boolean` | Both | `true` | Whether to show the indicator |
| `color` | `color` | Both | — | Foreground color of the spinner |
| `hidesWhenStopped` | `boolean` | iOS | `true` | Whether to hide when not animating |
| `size` | `'small' \| 'large' \| number` | Both | `'small'` | Size of the indicator |
| `ref` | `ref` | Both | — | Ref to element node |

> Inherits all View Props.

### Usage

```tsx
import {ActivityIndicator} from 'react-native';

<ActivityIndicator size="large" color="#999999" animating={isLoading} />
```
