# ScrollView & RefreshControl Component Reference

---

## ScrollView

Wraps platform ScrollView with touch responder integration.

### Key Props

| Prop | Type | Platform | Description |
|------|------|----------|-------------|
| `horizontal` | `boolean` | Both | Horizontal scroll |
| `pagingEnabled` | `boolean` | Both | Snap to pages |
| `scrollEnabled` | `boolean` | Both | Enable scrolling |
| `showsHorizontalScrollIndicator` | `boolean` | Both | Show horizontal scrollbar |
| `showsVerticalScrollIndicator` | `boolean` | Both | Show vertical scrollbar |
| `contentContainerStyle` | `StyleProp` | Both | Style for content container |
| `keyboardDismissMode` | `'none' \| 'on-drag' \| 'interactive'` | Both | Keyboard dismiss on drag |
| `keyboardShouldPersistTaps` | `'never' \| 'always' \| 'handled'` | Both | Keep keyboard on tap |
| `removeClippedSubviews` | `boolean` | Both | Detach off-screen views |
| `scrollEventThrottle` | `number` | Both | Scroll event throttle (ms) |
| `decelerationRate` | `'fast' \| 'normal' \| number` | Both | Deceleration rate |
| `disableIntervalMomentum` | `boolean` | Both | Stop at next index |
| `disableScrollViewPanResponder` | `boolean` | Both | Disable JS pan responder |
| `invertStickyHeaders` | `boolean` | Both | Sticky headers at bottom |
| `stickyHeaderIndices` | `number[]` | Both | Sticky header indices |
| `stickyHeaderHiddenOnScroll` | `boolean` | Both | Hide sticky headers on scroll |
| `snapToAlignment` | `'start' \| 'center' \| 'end'` | Both | Snap alignment |
| `snapToInterval` | `number` | Both | Snap interval (pixels) |
| `snapToOffsets` | `number[]` | Both | Snap offsets |
| `snapToStart` | `boolean` | Both | Snap to start |
| `snapToEnd` | `boolean` | Both | Snap to end |
| `refreshControl` | `ReactElement` | Both | RefreshControl component |
| `contentInset` | `Insets` | iOS | Content inset |
| `contentInsetAdjustmentBehavior` | `'never' \| 'automatic' \| 'scrollableAxes'` | iOS | Inset adjustment |
| `bounces` | `boolean` | iOS | Bounce on overscroll |
| `bouncesZoom` | `boolean` | iOS | Bounce zoom |
| `alwaysBounceHorizontal` | `boolean` | iOS | Always bounce horizontal |
| `alwaysBounceVertical` | `boolean` | iOS | Always bounce vertical |
| `centerContent` | `boolean` | iOS | Center content |
| `maximumZoomScale` | `number` | iOS | Max zoom scale |
| `minimumZoomScale` | `number` | iOS | Min zoom scale |
| `zoomScale` | `number` | iOS | Current zoom scale |
| `pinchGestureEnabled` | `boolean` | iOS | Enable pinch zoom |
| `directionalLockEnabled` | `boolean` | iOS | Lock to one direction |
| `indicatorStyle` | `'default' \| 'black' \| 'white'` | iOS | Scrollbar style |
| `scrollsToTop` | `boolean` | iOS | Scroll to top on status bar tap |
| `onScrollToTop` | `(event) => void` | iOS | Status bar tap handler |
| `nestedScrollEnabled` | `boolean` | Android | Nested scrolling |
| `overScrollMode` | `'auto' \| 'always' \| 'never'` | Android | Overscroll mode |
| `persistentScrollbar` | `boolean` | Android | Persistent scrollbar |
| `fadingEdgeLength` | `number` | Android | Fading edge length |
| `endFillColor` | `color` | Android | Fill empty space color |
| `scrollPerfTag` | `string` | Android | Performance tag |
| `scrollsChildToFocus` | `boolean` | Android | Scroll child to focus |

### Methods (via ref)

```tsx
const scrollRef = useRef<ScrollView>(null);

scrollRef.current?.scrollTo({x: 0, y: 0, animated: true});
scrollRef.current?.scrollToEnd({animated: true});
scrollRef.current?.flashScrollIndicators();
```

### Events

| Prop | Type | Description |
|------|------|-------------|
| `onScroll` | `(event) => void` | Scroll event (throttled by `scrollEventThrottle`) |
| `onScrollBeginDrag` | `(event) => void` | Drag started |
| `onScrollEndDrag` | `(event) => void` | Drag ended |
| `onMomentumScrollBegin` | `(event) => void` | Momentum scroll started |
| `onMomentumScrollEnd` | `(event) => void` | Momentum scroll ended |
| `onContentSizeChange` | `(event) => void` | Content size changed |

---

## RefreshControl

Used inside ScrollView/FlatList to add pull-to-refresh functionality.

### Props

| Prop | Type | Platform | Default | Description |
|------|------|----------|---------|-------------|
| `refreshing` | `boolean` | Both | — | **Required.** Whether indicating active refresh |
| `onRefresh` | `() => void` | Both | — | Called when view starts refreshing |
| `colors` | `color[]` | Android | — | Colors for refresh indicator |
| `enabled` | `boolean` | Android | `true` | Enable/disable pull to refresh |
| `progressBackgroundColor` | `color` | Android | — | Background color of refresh indicator |
| `progressViewOffset` | `number` | Android | `0` | Progress view top offset |
| `size` | `'default' \| 'large'` | Android | `'default'` | Size of refresh indicator |
| `tintColor` | `color` | iOS | — | Color of refresh indicator |
| `title` | `string` | iOS | — | Title under refresh indicator |
| `titleColor` | `color` | iOS | — | Color of refresh indicator title |

> Inherits all View Props.

### Usage

```tsx
import {ScrollView, RefreshControl} from 'react-native';

const [refreshing, setRefreshing] = useState(false);

const onRefresh = useCallback(async () => {
  setRefreshing(true);
  await fetchData();
  setRefreshing(false);
}, []);

<ScrollView
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
/>
```
