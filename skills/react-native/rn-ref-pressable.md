# Pressable Component Reference

Wrapper detecting press interactions on children. Recommended over legacy Touchable components.

---

## How It Works

1. `onPressIn` — press activated
2. `onPressOut` — press deactivated
3. Either: `onPress` (finger removed) OR `onLongPress` (held >500ms, then `onPressOut`)

## Key Props

| Prop | Type | Platform | Description |
|------|------|----------|-------------|
| `children` | `ReactNode \| (state) => ReactNode` | Both | Content or render function |
| `onPress` | `(event) => void` | Both | Press handler |
| `onLongPress` | `(event) => void` | Both | Long press handler |
| `onPressIn` | `(event) => void` | Both | Press in handler |
| `onPressOut` | `(event) => void` | Both | Press out handler |
| `onPressMove` | `(event) => void` | Both | Press move handler |
| `onHoverIn` | `(event) => void` | Both | Hover in (mouse) |
| `onHoverOut` | `(event) => void` | Both | Hover out (mouse) |
| `disabled` | `boolean` | Both | Disable interaction |
| `hitSlop` | `Insets` | Both | Expand touch area (HitRect) |
| `pressRetentionOffset` | `Insets` | Both | Keep press active beyond bounds (PressRect) |
| `delayLongPress` | `number` | Both | Delay before long press (ms, default: 500) |
| `unstable_pressDelay` | `number` | Both | Delay before press registered |
| `style` | `StyleProp \| (state) => StyleProp` | Both | Style or function receiving `{pressed}` |
| `android_ripple` | `RippleConfig` | Android | Ripple effect config |
| `android_disableSound` | `boolean` | Android | Disable press sound |
| `testOnly_pressed` | `boolean` | Both | Force pressed state for testing |

## Style Function

```tsx
<Pressable style={({pressed}) => [
  styles.base,
  pressed && styles.pressed
]}>
  <Text>Press me</Text>
</Pressable>
```

## Android Ripple

```tsx
<Pressable android_ripple={{color: 'gray', radius: 50, borderless: false}}>
  <Text>Ripple</Text>
</Pressable>
```
