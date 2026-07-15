# Touchable Components Reference (Legacy)

> **Note:** For new code, prefer `Pressable` — it's more future-proof and flexible. See `rn-ref-pressable.md`.

---

## TouchableWithoutFeedback

Base touchable component. All other Touchable components inherit its props.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `accessible` | `boolean` | Discoverable by screen readers |
| `accessibilityLabel` | `string` | Screen reader label |
| `accessibilityHint` | `string` | Additional context |
| `accessibilityRole` | `string` | Role type |
| `accessibilityState` | `object` | State description |
| `accessibilityActions` | `array` | Accessibility actions |
| `accessibilityValue` | `object` | Range value |
| `accessibilityLanguage` | `string` (iOS) | Language for screen reader |
| `accessibilityIgnoresInvertColors` | `boolean` (iOS) | Ignore invert colors |
| `aria-*` | various | ARIA props (see Accessibility guide) |
| `onAccessibilityAction` | `(event) => void` | Accessibility action handler |
| `delayLongPress` | `number` | ms from onPressIn before onLongPress (default: 370) |
| `delayPressIn` | `number` | ms from touch start before onPressIn |
| `delayPressOut` | `number` | ms from touch release before onPressOut |
| `disabled` | `boolean` | Disable all interactions |
| `hitSlop` | `Rect` | How far touch can start away from button |
| `id` | `string` | Locate from native code (precedence over nativeID) |
| `nativeID` | `string` | Native ID |
| `onBlur` | `(event: TargetEvent) => void` | Item loses focus |
| `onFocus` | `(event: TargetEvent) => void` | Item receives focus |
| `onLayout` | `(event: LayoutEvent) => void` | Mount and layout changes |
| `onLongPress` | `(event: PressEvent) => void` | Long press handler |
| `onPress` | `(event: PressEvent) => void` | Touch released (not if cancelled) |
| `onPressIn` | `(event: PressEvent) => void` | Touch started |
| `onPressOut` | `(event: PressEvent) => void` | Touch released |
| `pressRetentionOffset` | `Rect` | How far touch can move off before deactivating |
| `testID` | `string` | Test ID for E2E |
| `touchSoundDisabled` | `boolean` (Android) | Disable touch sound |

### Usage Pattern

```tsx
<TouchableWithoutFeedback onPress={handlePress}>
  <View>
    <Text>Tap me</Text>
  </View>
</TouchableWithoutFeedback>
```

> Must have exactly one child. The child must be a native component.

---

## TouchableOpacity

Wraps view with opacity dimming on press.

### Additional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `activeOpacity` | `number` | `0.2` | Opacity when pressed |
| `style` | `ViewStyle` | — | Style |
| `hasTVPreferredFocus` | `boolean` (iOS) | — | TV preferred focus |
| `nextFocusDown/Forward/Left/Right/Up` | `number` (Android) | — | TV focus navigation |
| `ref` | `ref` | — | Ref to element node |

> Inherits all TouchableWithoutFeedback Props.

```tsx
<TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
  <Text>Tap me</Text>
</TouchableOpacity>
```

---

## TouchableHighlight

Wraps view with highlight underlay on press.

### Additional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `activeOpacity` | `number` | `0.85` | Opacity when pressed (requires underlayColor) |
| `underlayColor` | `color` | — | Color of underlay shown when touch active |
| `onHideUnderlay` | `() => void` | — | Called after underlay hidden |
| `onShowUnderlay` | `() => void` | — | Called after underlay shown |
| `style` | `ViewStyle` | — | Style |
| `hasTVPreferredFocus` | `boolean` (iOS) | — | TV preferred focus |
| `nextFocusDown/Forward/Left/Right/Up` | `number` (Android) | — | TV focus navigation |
| `testOnly_pressed` | `boolean` | — | Show pressed state for testing |
| `ref` | `ref` | — | Ref to element node |

> Inherits all TouchableWithoutFeedback Props.

```tsx
<TouchableHighlight onPress={handlePress} underlayColor="#DDDDDD">
  <Text>Tap me</Text>
</TouchableHighlight>
```

---

## TouchableNativeFeedback (Android)

Wraps view with Android native ripple effect.

### Additional Props

| Prop | Type | Description |
|------|------|-------------|
| `background` | `BackgroundPropType` | Background drawable (use static methods) |
| `useForeground` | `boolean` | Use foreground drawable |
| `hasTVPreferredFocus` | `boolean` (Android) | TV preferred focus |
| `nextFocusDown/Forward/Left/Right/Up` | `number` (Android) | TV focus navigation |

> Inherits all TouchableWithoutFeedback Props.

### Static Methods

```tsx
// Default selectable background
TouchableNativeFeedback.SelectableBackground(rippleRadius: number | null)

// Borderless selectable background (API 21+)
TouchableNativeFeedback.SelectableBackgroundBorderless(rippleRadius: number | null)

// Custom ripple
TouchableNativeFeedback.Ripple(color: ColorValue, borderless: boolean, rippleRadius?: number | null)

// Check if foreground can be used
TouchableNativeFeedback.canUseNativeForeground()
```

### Usage

```tsx
<TouchableNativeFeedback
  background={TouchableNativeFeedback.Ripple('#888888', false)}>
  <View>
    <Text>Tap me</Text>
  </View>
</TouchableNativeFeedback>
```
