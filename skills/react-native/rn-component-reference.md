# React Native Component Reference

Detailed prop reference for all core components. For usage examples and overview, see `rn-components.md`.

---

## View

Container supporting flexbox layout, styling, touch handling, and accessibility.

### Key Props

| Prop | Type | Platform | Description |
|------|------|----------|-------------|
| `collapsable` | `boolean` | Both | If `false`, prevents View from being removed from native hierarchy as optimization |
| `collapsableChildren` | `boolean` | Both | If `false`, prevents direct children from being removed from native hierarchy |
| `hitSlop` | `Insets` | Both | Expands touch area beyond visual bounds |
| `nativeID` | `string` | Both | Native component ID |
| `id` | `string` | Both | Element ID (for ref resolution) |
| `pointerEvents` | `'auto' \| 'none' \| 'box-none' \| 'box-only'` | Both | Controls touch event targeting |
| `removeClippedSubviews` | `boolean` | Both | Detach off-screen views from native hierarchy |
| `renderToHardwareTextureAndroid` | `boolean` | Android | Render to hardware texture (helps with alpha compositing) |
| `shouldRasterizeIOS` | `boolean` | iOS | Rasterize to bitmap before compositing |
| `needsOffscreenAlphaCompositing` | `boolean` | Both | Offscreen alpha compositing for transparency |
| `focusable` | `boolean` | Android | Whether view is focusable |
| `tabIndex` | `number` | Android | Tab order for keyboard navigation |
| `style` | `ViewStyle` | Both | Style object |
| `testID` | `string` | Both | Test ID for E2E testing |

### Responder Props (Touch Handling)

| Prop | Type | Description |
|------|------|-------------|
| `onStartShouldSetResponder` | `(event) => boolean` | Does view want to become responder on touch start? |
| `onMoveShouldSetResponder` | `(event) => boolean` | Does view want to become responder on move? |
| `onStartShouldSetResponderCapture` | `(event) => boolean` | Parent prevents child from becoming responder on start |
| `onMoveShouldSetResponderCapture` | `(event) => boolean` | Parent prevents child from becoming responder on move |
| `onResponderGrant` | `(event) => void \| boolean` | View is now responding for touch events |
| `onResponderMove` | `(event) => void` | User is moving finger |
| `onResponderRelease` | `(event) => void` | Fired at end of touch |
| `onResponderTerminate` | `(event) => void` | Responder taken from view |
| `onResponderTerminationRequest` | `(event) => boolean` | Another view wants to become responder |
| `onResponderReject` | `(event) => void` | Another responder active, won't release |

### Focus Navigation (Android)

| Prop | Type | Description |
|------|------|-------------|
| `nextFocusDown` | `number` | Next focus down ID |
| `nextFocusForward` | `number` | Next focus forward ID |
| `nextFocusLeft` | `number` | Next focus left ID |
| `nextFocusRight` | `number` | Next focus right ID |
| `nextFocusUp` | `number` | Next focus up ID |

---

## Text

Displays text. Unique: children use text layout, not flexbox.

### Key Props

| Prop | Type | Platform | Description |
|------|------|----------|-------------|
| `numberOfLines` | `number` | Both | Truncate text after N lines with ellipsis |
| `ellipsizeMode` | `'head' \| 'middle' \| 'tail' \| 'clip'` | Both | Truncation mode (default: `tail`) |
| `selectable` | `boolean` | Both | Whether text is selectable |
| `adjustsFontSizeToFit` | `boolean` | Both | Auto-scale font to fit |
| `minimumFontScale` | `number` | Both | Minimum scale when adjustsFontSizeToFit |
| `allowFontScaling` | `boolean` | Both | Whether font scales with Text Size setting |
| `maxFontSizeMultiplier` | `number \| null` | Both | Max font scale multiplier |
| `onPress` | `(event) => void` | Both | Press handler |
| `onLongPress` | `(event) => void` | Both | Long press handler |
| `onTextLayout` | `(event) => void` | Both | Text layout event |
| `android_hyphenationFrequency` | `'none' \| 'short' \| 'full'` | Android | Hyphenation frequency |
| `dataDetectorType` | `'none' \| 'link' \| 'email' \| 'all'` | Android | Auto-detect data types |
| `dynamicTypeRamp` | `string` | iOS | Dynamic Type ramp |
| `lineBreakStrategyIOS` | `'none' \| 'standard' \| 'hangul-word' \| 'push-out'` | iOS | Line break strategy (iOS 14+) |
| `lineBreakModeIOS` | `'wordWrapping' \| 'char' \| 'clip' \| 'head' \| 'middle' \| 'tail'` | iOS | Line break mode |
| `selectionColor` | `color` | Android | Text selection highlight color |
| `suppressHighlighting` | `boolean` | iOS | Suppress highlight on press |
| `textBreakStrategy` | `'simple' \| 'highQuality' \| 'balanced'` | Android | Text break strategy |

### Nested Text

Text inside `<Text>` uses text layout (inline), not flexbox:

```tsx
<Text style={{fontWeight: 'bold'}}>
  I am bold
  <Text style={{color: 'red'}}>and red</Text>
</Text>
```

### Limited Style Inheritance

- All text nodes must be inside `<Text>` (not directly in `<View>`)
- Style inheritance only works within text subtrees
- Create wrapper components (e.g., `MyAppText`) for consistent fonts
- `fontFamily` accepts a single font name (not CSS comma-separated)

---

## Image

Displays images: network, static resources, local disk.

### Key Props

| Prop | Type | Platform | Description |
|------|------|----------|-------------|
| `source` | `ImageSource` | Both | Image source (`require()` or `{uri: '...'} `) |
| `defaultSource` | `ImageSource` | Both | Placeholder while loading |
| `blurRadius` | `number` | Both | Blur filter radius |
| `fadeDuration` | `number` | Android | Fade animation duration (default: 300ms) |
| `resizeMode` | `'cover' \| 'contain' \| 'stretch' \| 'repeat' \| 'center'` | Both | How to resize image |
| `resizeMethod` | `'auto' \| 'resize' \| 'scale'` | Android | Resize method |
| `tintColor` | `color` | Both | Apply color tint |
| `crossOrigin` | `'anonymous' \| 'use-credentials'` | Both | CORS mode |
| `referrerPolicy` | `string` | Both | Referrer policy |
| `alt` | `string` | Both | Alt text for screen readers |
| `progressiveRenderingEnabled` | `boolean` | Android | Progressive JPEG streaming |
| `capInsets` | `Rect` | iOS | Stretchable image corners |

### Events

| Prop | Type | Description |
|------|------|-------------|
| `onLoad` | `(event) => void` | Load completes successfully |
| `onLoadStart` | `() => void` | Load starts |
| `onLoadEnd` | `() => void` | Load succeeds or fails |
| `onError` | `(event) => void` | Load error |
| `onProgress` | `(event) => void` | Download progress (`{loaded, total}`) |
| `onPartialLoad` | `() => void` | Partial load (iOS, progressive JPEG) |
| `onLayout` | `(event) => void` | Layout changes |

### Static Methods

```tsx
// Prefetch remote image
await Image.prefetch(url);

// Get image dimensions before displaying
const {width, height} = await Image.getSize(uri);
const {width, height} = await Image.getSizeWithHeaders(uri, headers);

// Query cache status
const cache = await Image.queryCache(['url1', 'url2']);
// Returns: {url1: 'memory', url2: 'disk/memory'}

// Abort prefetch (Android)
Image.abortPrefetch(requestId);

// Resolve asset source
const source = Image.resolveAssetSource(require('./img.png'));
// Returns: {uri, scale, width, height}
```

### Image Source Types

```tsx
// Static resource
<Image source={require('./my-icon.png')} />

// Network image
<Image source={{uri: 'https://example.com/image.png'}} />

// With dimensions (for proper layout)
<Image source={{uri: 'https://...', width: 200, height: 200}} />

// Base64
<Image source={{uri: 'data:image/png;base64,...'}} />
```

---

## TextInput

Text input via keyboard. Configurable: auto-correction, auto-capitalization, placeholder, keyboard types.

### Key Props

| Prop | Type | Platform | Description |
|------|------|----------|-------------|
| `value` | `string` | Both | Input value |
| `defaultValue` | `string` | Both | Initial value (uncontrolled) |
| `editable` | `boolean` | Both | Whether editable (default: `true`) |
| `maxLength` | `number` | Both | Max character count |
| `multiline` | `boolean` | Both | Multi-line input (default: `false`) |
| `placeholder` | `string` | Both | Placeholder text |
| `placeholderTextColor` | `color` | Both | Placeholder color |
| `secureTextEntry` | `boolean` | Both | Password field |
| `keyboardType` | `KeyboardType` | Both | Keyboard type (see below) |
| `inputMode` | `InputMode` | Both | HTML inputmode (overrides keyboardType) |
| `returnKeyType` | `ReturnKeyType` | Both | Return key label |
| `autoCapitalize` | `'none' \| 'sentences' \| 'words' \| 'characters'` | Both | Auto-capitalization |
| `autoCorrect` | `boolean` | Both | Auto-correction |
| `autoFocus` | `boolean` | Both | Auto-focus on mount |
| `selectTextOnFocus` | `boolean` | Both | Select all text on focus |
| `clearTextOnFocus` | `boolean` | iOS | Clear text on focus |
| `clearButtonMode` | `'never' \| 'while-editing' \| 'unless-editing' \| 'always'` | iOS | Clear button |
| `textAlign` | `'auto' \| 'left' \| 'right' \| 'center' \| 'justify'` | Both | Text alignment |
| `selection` | `{start, end}` | Both | Selection range |
| `selectionColor` | `color` | Both | Selection highlight color |
| `numberOfLines` | `number` | Android | Lines for multiline |
| `rows` | `number` | Android | Rows for multiline |
| `readOnly` | `boolean` | Both | Read-only |
| `contextMenuHidden` | `boolean` | Both | Hide context menu |
| `showSoftInputOnFocus` | `boolean` | Both | Show keyboard on focus |
| `inputAccessoryViewID` | `string` | iOS | Input accessory view ID |
| `inputAccessoryViewButtonLabel` | `string` | iOS | Input accessory button label |
| `disableFullscreenUI` | `boolean` | Android | Disable fullscreen UI |
| `scrollEnabled` | `boolean` | iOS | Scroll enabled for multiline |
| `textContentType` | `TextContentType` | iOS | Autofill content type |
| `passwordRules` | `string` | iOS | Password rules for autofill |
| `cursorColor` | `color` | Android | Cursor color |
| `underlineColorAndroid` | `color` | Android | Underline color |
| `inlineImageLeft` | `string` | Android | Inline image resource name |
| `inlineImagePadding` | `number` | Android | Padding for inline image |

### Keyboard Types

**Cross-platform:** `default`, `number-pad`, `decimal-pad`, `numeric`, `email-address`, `phone-pad`, `url`

**iOS only:** `ascii-capable`, `numbers-and-punctuation`, `name-phone-pad`, `twitter`, `web-search`

**Android only:** `visible-password`

### Input Mode (overrides keyboardType)

`none`, `text`, `decimal`, `numeric`, `tel`, `search`, `email`, `url`

### Events

| Prop | Type | Description |
|------|------|-------------|
| `onChangeText` | `(text: string) => void` | Text changed |
| `onChange` | `(event) => void` | Change event |
| `onFocus` | `(event) => void` | Focus gained |
| `onBlur` | `(event) => void` | Focus lost |
| `onKeyPress` | `(event) => void` | Key press |
| `onSubmitEditing` | `(event) => void` | Submit (return key) |
| `onEndEditing` | `(event) => void` | Editing ended |
| `onContentSizeChange` | `(event) => void` | Content size changed |
| `onSelectionChange` | `(event) => void` | Selection changed |
| `onScroll` | `(event) => void` | Scroll (multiline) |
| `onLayout` | `(event) => void` | Layout changes |
| `onPressIn` | `(event) => void` | Press in |
| `onPressOut` | `(event) => void` | Press out |

### Methods (via ref)

```tsx
const inputRef = useRef<TextInput>(null);

inputRef.current?.focus();
inputRef.current?.blur();
inputRef.current?.clear();
inputRef.current?.isFocused(); // returns boolean
```

### Known Issues

- `onChangeText` fires before `onBlur` on Android — may get stale values
- `submitBehavior` controls what happens on return key for multiline

---

## Pressable

Wrapper detecting press interactions on children. Recommended over legacy Touchable components.

### How It Works

1. `onPressIn` — press activated
2. `onPressOut` — press deactivated
3. Either: `onPress` (finger removed) OR `onLongPress` (held >500ms, then `onPressOut`)

### Key Props

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

### Style Function

```tsx
<Pressable style={({pressed}) => [
  styles.base,
 pressed && styles.pressed
]}>
  <Text>Press me</Text>
</Pressable>
```

### Android Ripple

```tsx
<Pressable android_ripple={{color: 'gray', radius: 50, borderless: false}}>
  <Text>Ripple</Text>
</Pressable>
```

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

## FlatList

Performant interface for rendering flat lists. Inherits VirtualizedList props.

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Array of items to render |
| `renderItem` | `(info) => JSX.Element` | Render function for each item |

### Key Props

| Prop | Type | Description |
|------|------|-------------|
| `keyExtractor` | `(item, index) => string` | Unique key for each item (default: `item.key` or `item.id`) |
| `horizontal` | `boolean` | Horizontal layout |
| `numColumns` | `number` | Number of columns (only with `horizontal={false}`) |
| `inverted` | `boolean` | Reverse scroll direction |
| `columnWrapperStyle` | `StyleProp` | Style for multi-item rows |
| `extraData` | `any` | Marker to trigger re-render |
| `getItemLayout` | `(data, index) => {length, offset, index}` | Skip measurement for fixed-size items |
| `initialNumToRender` | `number` | Initial batch size (default: 10) |
| `initialScrollIndex` | `number` | Start at index (requires `getItemLayout`) |
| `maxToRenderPerBatch` | `number` | Items per batch (default: 10) |
| `updateCellsBatchingPeriod` | `number` | Delay between batches (ms, default: 50) |
| `windowSize` | `number` | Render window in viewport heights (default: 21) |
| `removeClippedSubviews` | `boolean` | Detach off-screen views |

### Component Props

| Prop | Type | Description |
|------|------|-------------|
| `ItemSeparatorComponent` | `ReactComponent \| ReactElement` | Between items (not top/bottom) |
| `ListEmptyComponent` | `ReactComponent \| ReactElement` | When list is empty |
| `ListHeaderComponent` | `ReactComponent \| ReactElement` | At top of list |
| `ListFooterComponent` | `ReactComponent \| ReactElement` | At bottom of list |
| `ListHeaderComponentStyle` | `ViewStyle` | Header style |
| `ListFooterComponentStyle` | `ViewStyle` | Footer style |

### Refresh Props

| Prop | Type | Description |
|------|------|-------------|
| `onRefresh` | `() => void` | Pull-to-refresh handler |
| `refreshing` | `boolean` | Whether refreshing |
| `progressViewOffset` | `number` | Android refresh indicator offset |

### Viewability Props

| Prop | Type | Description |
|------|------|-------------|
| `viewabilityConfig` | `ViewabilityConfig` | Viewability threshold config |
| `onViewableItemsChanged` | `(info) => void` | Viewable items changed |
| `viewabilityConfigCallbackPairs` | `array` | Multiple viewability configs |

### Methods (via ref)

```tsx
const listRef = useRef<FlatList>(null);

listRef.current?.scrollToIndex({index: 0, animated: true});
listRef.current?.scrollToItem({item: myItem, animated: true});
listRef.current?.scrollToOffset({offset: 0, animated: true});
listRef.current?.scrollToEnd({animated: true});
listRef.current?.flashScrollIndicators();
listRef.current?.getScrollResponder();
listRef.current?.getNativeScrollRef();
listRef.current?.getScrollableNode();
```

### renderItem Signature

```tsx
renderItem({
  item: ItemT,
  index: number,
  separators: {
    highlight: () => void;
    unhighlight: () => void;
    updateProps: (select: 'leading' | 'trailing', newProps: any) => void;
  }
}): JSX.Element;
```

### getItemLayout Example

```tsx
<FlatList
  data={items}
  renderItem={renderItem}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

---

## SectionList

Like FlatList but for sectioned lists. Inherits VirtualizedList props.

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `sections` | `Section[]` | Array of `{data: T[], title?: string, key?: string}` |
| `renderItem` | `(info) => JSX.Element` | Render function for items |

### Key Props

| Prop | Type | Description |
|------|------|-------------|
| `renderSectionHeader` | `(info) => JSX.Element` | Section header renderer |
| `renderSectionFooter` | `(info) => JSX.Element` | Section footer renderer |
| `keyExtractor` | `(item, index) => string` | Unique key for items |
| `stickySectionHeadersEnabled` | `boolean` | Sticky section headers (default: `true`) |
| `ItemSeparatorComponent` | `ReactComponent` | Between items |
| `SectionSeparatorComponent` | `ReactComponent` | Between sections |
| `ListEmptyComponent` | `ReactComponent` | Empty list |
| `ListHeaderComponent` | `ReactComponent` | Top of list |
| `ListFooterComponent` | `ReactComponent` | Bottom of list |
| `extraData` | `any` | Re-render trigger |
| `initialNumToRender` | `number` | Initial batch |
| `invertStickyHeaders` | `boolean` | Sticky headers at bottom |
| `onRefresh` | `() => void` | Pull-to-refresh |
| `refreshing` | `boolean` | Refreshing state |

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

---

## StatusBar

Component to control the app's status bar.

### Props

| Prop | Type | Platform | Default | Description |
|------|------|----------|---------|-------------|
| `animated` | `boolean` | Both | `false` | Animate transitions for `backgroundColor`, `barStyle`, `hidden` |
| `backgroundColor` | `color` | Android | `'black'` | Status bar background color. **Deprecated** in API 35+ (edge-to-edge) |
| `barStyle` | `'default' \| 'light-content' \| 'dark-content'` | Both | `'default'` | Status bar text color. Android: API 23+ only |
| `hidden` | `boolean` | Both | `false` | Hide status bar |
| `networkActivityIndicatorVisible` | `boolean` | iOS | `false` | Show network activity indicator |
| `showHideTransition` | `'fade' \| 'slide'` | iOS | `'fade'` | Transition effect when showing/hiding |
| `translucent` | `boolean` | Android | `false` | App draws under status bar. **Deprecated** in API 35+ (edge-to-edge) |

### Imperative API

```tsx
import {StatusBar} from 'react-native';

// Set bar style
StatusBar.setBarStyle('light-content', true); // animated
// Set background color (Android)
StatusBar.setBackgroundColor('#000000', true);
// Set hidden
StatusBar.setHidden(true, 'slide');
// Set translucent (Android)
StatusBar.setTranslucent(true);
```

### Stack-Based Navigation

```tsx
// Push/pop stack entries for navigation
const entry = StatusBar.pushStackEntry({barStyle: 'light-content'});
// ... later ...
StatusBar.popStackEntry(entry);
// Or replace
StatusBar.replaceStackEntry(entry, {barStyle: 'dark-content'});
```

### Constants

| Constant | Platform | Description |
|----------|----------|-------------|
| `currentHeight` | Android | Current status bar height |

### StatusBarStyle

| Value | Description |
|-------|-------------|
| `'default'` | Default appearance (dark text on light bg) |
| `'light-content'` | Light text (for dark backgrounds) |
| `'dark-content'` | Dark text (for light backgrounds) |

### StatusBarAnimation

| Value | Description |
|-------|-------------|
| `'none'` | No animation |
| `'fade'` | Fade transition |
| `'slide'` | Slide transition |

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

---

## ImageBackground

Background image component (like CSS `background-image`). Same props as `Image`, with children layered on top.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `imageStyle` | `ImageStyle` | Style for the inner Image |
| `imageRef` | `ref` | Ref to the inner Image element node |
| `style` | `ViewStyle` | Style for the container View |

> Inherits all Image Props.

### Usage

```tsx
import {ImageBackground, Text} from 'react-native';

<ImageBackground
  source={require('./background.png')}
  style={{flex: 1}}
  imageStyle={{resizeMode: 'cover'}}>
  <Text>Content on top of background</Text>
</ImageBackground>
```
