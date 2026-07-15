# Accessibility Guide

Create mobile apps accessible to assistive technology with React Native's suite of APIs designed to work with Android and iOS.

---

## Accessibility Properties

### Core Properties

| Prop | Platform | Description |
|------|----------|-------------|
| `accessible` | Both | View discoverable by screen readers. Default `true` for touchable elements |
| `accessibilityLabel` | Both | Screen reader verbalizes this string |
| `accessibilityLabelledBy` | Android | ID of element that labels this element |
| `accessibilityHint` | Both | Additional context for action result |
| `accessibilityLanguage` | iOS | Language for screen reader (BCP 47 spec) |
| `accessibilityIgnoresInvertColors` | iOS | Whether view ignores invert colors setting |
| `accessibilityLiveRegion` | Android | Announce changes (`none`, `polite`, `assertive`) |
| `accessibilityRole` | Both | Role type (e.g., `button`, `image`, `text`, `adjustable`) |
| `accessibilityShowsLargeContentViewer` | iOS | Whether large content viewer is shown |
| `accessibilityLargeContentTitle` | iOS | Title for large content viewer |
| `accessibilityState` | Both | State description (`disabled`, `selected`, `checked`) |
| `accessibilityValue` | Both | Range value for sliders/progress bars |
| `accessibilityViewIsModal` | iOS | VoiceOver ignores sibling views |
| `accessibilityElementsHidden` | iOS | Hide element and children from VoiceOver |
| `importantForAccessibility` | Android | Control focus behavior |
| `onAccessibilityEscape` | iOS | Called when user performs escape gesture |
| `onAccessibilityTap` | iOS | Called when user double-taps accessible element |
| `onMagicTap` | iOS | Called when user performs two-finger magic tap |
| `role` | Both | New prop replacing `accessibilityRole` (recommended) |

### ARIA Props (both platforms unless noted)

`aria-busy`, `aria-checked`, `aria-disabled`, `aria-expanded`, `aria-hidden`, `aria-label`, `aria-labelledby` (Android), `aria-live` (Android), `aria-modal` (iOS), `aria-selected`, `aria-valuemax`, `aria-valuemin`, `aria-valuenow`, `aria-valuetext`

### experimental_accessibilityOrder

Array of nativeIDs to override the default accessibility order of children.

---

## Accessibility Actions

Allow assistive technology to programmatically invoke component actions.

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

---

## Checking if a Screen Reader is Enabled

```tsx
import {AccessibilityInfo} from 'react-native';

const isScreenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
AccessibilityInfo.addEventListener('screenReaderChanged', isEnabled => {
  console.log('Screen reader:', isEnabled);
});
```

---

## Sending Accessibility Events (Android)

```tsx
import {AccessibilityInfo} from 'react-native';

// Announce a change
AccessibilityInfo.announceForAccessibility('Page loaded');

// Accessibility focus
AccessibilityInfo.setAccessibilityFocus(reactTag);
```

---

## Testing

### TalkBack (Android)
1. Settings → Accessibility → TalkBack → Turn on
2. Navigate by swiping right/left
3. Double-tap to activate

### VoiceOver (iOS)
1. Settings → Accessibility → VoiceOver → Turn on
2. Navigate by swiping right/left
3. Double-tap to activate
4. Three-finger swipe to scroll

### Additional Resources
- [Apple Accessibility Guide](https://developer.apple.com/accessibility/)
- [Google Accessibility Guide](https://developer.android.com/guide/topics/ui/accessibility)
- [WCAG Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)
