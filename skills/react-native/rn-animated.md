# Animated API & LayoutAnimation

The `Animated` library for creating fluid, powerful animations. Focuses on declarative
relationships between inputs and outputs with configurable transforms.

---

## Animated Components

Pre-built animated components: `Animated.View`, `Animated.Text`, `Animated.Image`,
`Animated.ScrollView`, `Animated.FlatList`, `Animated.SectionList`.

Create custom: `Animated.createAnimatedComponent(MyComponent)`

## Animated.Value

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

## Animation Types

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

## Composing Animations

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

## Combining Animated Values

```tsx
const a = new Animated.Value(1);
const b = Animated.divide(1, a);  // inverse: 2x → 0.5x
const sum = Animated.add(a, b);
const product = Animated.multiply(a, b);
```

## Interpolation

```tsx
const opacity = fadeAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 1],
  extrapolate: 'clamp',  // 'extend' | 'identity' | 'clamp'
});
```

## Native Driver

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

## Animated.event

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

## LayoutAnimation API

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
