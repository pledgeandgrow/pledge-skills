# StyleSheet & Deprecated Components Reference

---

## StyleSheet

Creates immutable style references for performance.

```tsx
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  text: {fontSize: 16, color: 'black'},
});

// Static methods
StyleSheet.flatten(style)          // Flatten style array to object
StyleSheet.setStyleAttributePreprocessor(fn)  // Custom attribute processing
```

### Absolute Fill Shorthands

| Property | Value |
|----------|-------|
| `StyleSheet.absoluteFill` | `{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}` |
| `StyleSheet.absoluteFillObject` | Same as above (object form) |
| `StyleSheet.hairlineWidth` | Platform-specific 1px width |

---

## Deprecated Components

| Component | Replacement |
|-----------|-------------|
| `SafeAreaView` | `react-native-safe-area-context` |
| `TextInput` `blurOnSubmit` prop | `submitBehavior` prop |
| `InteractionManager` | `requestIdleCallback` |
| `TouchableHighlight` | `Pressable` |
| `TouchableOpacity` | `Pressable` |
| `TouchableNativeFeedback` | `Pressable` with `android_ripple` |
| `TouchableWithoutFeedback` | `Pressable` |
