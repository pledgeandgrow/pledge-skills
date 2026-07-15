# Modal Component Reference

The Modal component is a basic way to present content above an enclosing view.

---

## Props

| Prop | Type | Platform | Default | Description |
|------|------|----------|---------|-------------|
| `animationType` | `'none' \| 'slide' \| 'fade'` | Both | `'none'` | How the modal animates in |
| `backdropColor` | `color` | Both | `'white'` | Background color of modal container. Ignored if `transparent` is true |
| `hardwareAccelerated` | `boolean` | Android | `false` | Force hardware acceleration for underlying window |
| `navigationBarTranslucent` | `boolean` | Android | `false` | Modal goes under system navigation bar (requires `statusBarTranslucent` also true) |
| `onDismiss` | `() => void` | iOS | — | Called once modal has been dismissed |
| `onOrientationChange` | `(event) => void` | iOS | — | Called when orientation changes while modal is displayed. Also called on initial render |
| `allowSwipeDismissal` | `boolean` | iOS | `false` | Whether modal can be dismissed by swiping down (requires `onRequestClose`) |
| `onRequestClose` | `() => void` | Both | — | Called when user taps hardware back (Android) or menu button (Apple TV). On iOS, called when Modal dismissed via drag gesture with `presentationStyle` of `pageSheet`/`formSheet` |
| `onShow` | `() => void` | Both | — | Called once modal has been shown |
| `presentationStyle` | `'fullScreen' \| 'pageSheet' \| 'formSheet' \| 'overFullScreen'` | iOS | `'fullScreen'` | How modal appears (larger devices) |
| `statusBarTranslucent` | `boolean` | Android | `false` | Whether modal goes under system status bar |
| `supportedOrientations` | `Orientation[]` | iOS | `['portrait']` | Allowed orientations. Restricted by Info.plist. Ignored with `pageSheet`/`formSheet` |
| `transparent` | `boolean` | Both | `false` | Whether modal fills entire view or renders over transparent background |
| `visible` | `boolean` | Both | `true` | Whether modal is visible |
| `ref` | `ref` | Both | — | Ref to element node |

> Inherits all View Props.

### Deprecated Props

| Prop | Replacement |
|-----|-------------|
| `animated` | Use `animationType` instead |

### supportedOrientations Values

`'portrait'`, `'portrait-upside-down'`, `'landscape'`, `'landscape-left'`, `'landscape-right'`

### Usage

```tsx
import {Modal, View, Text, Button} from 'react-native';

const [visible, setVisible] = useState(false);

<Modal
  animationType="slide"
  transparent={false}
  visible={visible}
  onRequestClose={() => setVisible(false)}>
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>Hello Modal!</Text>
    <Button title="Close" onPress={() => setVisible(false)} />
  </View>
</Modal>
```
