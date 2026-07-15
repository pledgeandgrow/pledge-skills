# React Native Style Reference

Detailed reference for layout props, view style props, text style props, image style props, transforms, and colors.

---

## Layout Props

All layout props work with the [Yoga](https://github.com/facebook/yoga) layout engine. Default `flexDirection` is `column` (unlike CSS which defaults to `row`).

### Flexbox Properties

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `alignContent` | `'flex-start' \| 'flex-end' \| 'center' \| 'stretch' \| 'space-between' \| 'space-around'` | `flex-start` | Aligns rows in cross direction (when `flexWrap` is enabled) |
| `alignItems` | `'flex-start' \| 'flex-end' \| 'center' \| 'stretch' \| 'baseline'` | `stretch` | Aligns children in cross direction |
| `alignSelf` | `'auto' \| 'flex-start' \| 'flex-end' \| 'center' \| 'stretch' \| 'baseline'` | `auto` | Overrides parent's `alignItems` for this child |
| `flex` | `number` | — | Shorthand: `flex: n` = `flexGrow: n, flexShrink: 1, flexBasis: 0`. `0` = inflexible, `-1` = shrink to min |
| `flexBasis` | `number \| string` | `auto` | Default size along main axis before grow/shrink |
| `flexDirection` | `'row' \| 'row-reverse' \| 'column' \| 'column-reverse'` | `column` | Main axis direction |
| `flexGrow` | `number` | `0` | How much to grow relative to siblings |
| `flexShrink` | `number` | `0` | How much to shrink when insufficient space |
| `flexWrap` | `'wrap' \| 'nowrap' \| 'wrap-reverse'` | `nowrap` | Whether children wrap to next line |
| `justifyContent` | `'flex-start' \| 'flex-end' \| 'center' \| 'space-between' \| 'space-around' \| 'space-evenly'` | `flex-start` | Aligns children along main axis |

### Gap Properties

| Prop | Type | Description |
|------|------|-------------|
| `gap` | `number` | Gap between rows and columns |
| `rowGap` | `number` | Gap between rows |
| `columnGap` | `number` | Gap between columns |

### Position & Dimensions

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'static' \| 'relative' \| 'absolute'` | `relative` | Positioning type |
| `top` | `number \| string` | — | Offset from top edge |
| `bottom` | `number \| string` | — | Offset from bottom edge |
| `left` | `number \| string` | — | Offset from left edge |
| `right` | `number \| string` | — | Offset from right edge |
| `start` | `number \| string` | — | Start edge (left in LTR, right in RTL) |
| `end` | `number \| string` | — | End edge (right in LTR, left in RTL) |
| `width` | `number \| string` | — | Element width |
| `height` | `number \| string` | — | Element height |
| `minWidth` | `number \| string` | — | Minimum width |
| `minHeight` | `number \| string` | — | Minimum height |
| `maxWidth` | `number \| string` | — | Maximum width |
| `maxHeight` | `number \| string` | — | Maximum height |
| `aspectRatio` | `number \| string` | — | Width-to-height ratio |
| `zIndex` | `number` | — | Stack order |
| `display` | `'flex' \| 'none' \| 'contents'` | `flex` | Display type |
| `overflow` | `'visible' \| 'hidden' \| 'scroll'` | `visible` | Content overflow behavior |

### Margin Properties

| Prop | Type | Description |
|------|------|-------------|
| `margin` | `number \| string` | All sides |
| `marginHorizontal` | `number \| string` | Left + Right |
| `marginVertical` | `number \| string` | Top + Bottom |
| `marginTop` | `number \| string` | Top |
| `marginBottom` | `number \| string` | Bottom |
| `marginLeft` | `number \| string` | Left |
| `marginRight` | `number \| string` | Right |
| `marginStart` | `number \| string` | Start (LTR: left, RTL: right) |
| `marginEnd` | `number \| string` | End (LTR: right, RTL: left) |

### Padding Properties

| Prop | Type | Description |
|------|------|-------------|
| `padding` | `number \| string` | All sides |
| `paddingHorizontal` | `number \| string` | Left + Right |
| `paddingVertical` | `number \| string` | Top + Bottom |
| `paddingTop` | `number \| string` | Top |
| `paddingBottom` | `number \| string` | Bottom |
| `paddingLeft` | `number \| string` | Left |
| `paddingRight` | `number \| string` | Right |
| `paddingStart` | `number \| string` | Start (LTR: left, RTL: right) |
| `paddingEnd` | `number \| string` | End (LTR: right, RTL: left) |

### Border Width Properties

| Prop | Type | Description |
|------|------|-------------|
| `borderWidth` | `number` | All sides |
| `borderTopWidth` | `number` | Top |
| `borderBottomWidth` | `number` | Bottom |
| `borderLeftWidth` | `number` | Left |
| `borderRightWidth` | `number` | Right |
| `borderStartWidth` | `number` | Start (LTR: left, RTL: right) |
| `borderEndWidth` | `number` | End (LTR: right, RTL: left) |

### Direction & Box Sizing

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `'inherit' \| 'ltr' \| 'rtl'` | `inherit` | Directional flow (root uses locale) |
| `boxSizing` | `'border-box' \| 'content-box'` | `border-box` | How width/height are computed |

### Inset Shorthands

| Prop | Type | Description |
|------|------|-------------|
| `inset` | `number \| string` | All four edges |
| `insetBlock` | `number \| string` | Top + Bottom |
| `insetInline` | `number \| string` | Left + Right |

---

## View Style Props

### Background

| Prop | Type | Platform | Description |
|------|------|----------|-------------|
| `backgroundColor` | `color` | Both | Background color |
| `experimental_backgroundImage` | `string` | Both | **Experimental.** `linear-gradient()` (0.76+), `radial-gradient()` (0.80+) |
| `backfaceVisibility` | `'visible' \| 'hidden'` | Both | Whether back face is visible when rotated |
| `opacity` | `number` | Both | 0-1 transparency |
| `elevation` | `number` | Android | Z-depth for shadow (Android 5+) |

### Borders

| Prop | Type | Platform | Description |
|------|------|----------|-------------|
| `borderColor` | `color` | Both | All borders color |
| `borderTopColor` | `color` | Both | Top border color |
| `borderBottomColor` | `color` | Both | Bottom border color |
| `borderLeftColor` | `color` | Both | Left border color |
| `borderRightColor` | `color` | Both | Right border color |
| `borderStartColor` | `color` | Both | Start border color |
| `borderEndColor` | `color` | Both | End border color |
| `borderRadius` | `number` | Both | All corners |
| `borderTopLeftRadius` | `number` | Both | Top-left corner |
| `borderTopRightRadius` | `number` | Both | Top-right corner |
| `borderTopStartRadius` | `number` | Both | Top-start corner |
| `borderTopEndRadius` | `number` | Both | Top-end corner |
| `borderBottomLeftRadius` | `number` | Both | Bottom-left corner |
| `borderBottomRightRadius` | `number` | Both | Bottom-right corner |
| `borderBottomStartRadius` | `number` | Both | Bottom-start corner |
| `borderBottomEndRadius` | `number` | Both | Bottom-end corner |
| `borderStyle` | `'solid' \| 'dotted' \| 'dashed'` | Both | Border style |
| `borderCurve` | `'circular' \| 'continuous'` | iOS | Corner curve (iOS 13+) |

### Shadow & Effects

| Prop | Type | Platform | Description |
|------|------|----------|-------------|
| `shadowColor` | `color` | iOS | Shadow color |
| `shadowOffset` | `{width: number, height: number}` | iOS | Shadow offset |
| `shadowOpacity` | `number` | iOS | Shadow opacity (0-1) |
| `shadowRadius` | `number` | iOS | Shadow blur radius |
| `boxShadow` | `string` | Both | CSS-like box shadow (e.g., `'0 2px 4px rgba(0,0,0,0.2)'`) |
| `filter` | `string` | Both | CSS filter (e.g., `'blur(5px)'`, `'brightness(1.5)'`) |

### Other

| Prop | Type | Platform | Description |
|------|------|----------|-------------|
| `overflow` | `'visible' \| 'hidden' \| 'scroll'` | Both | Content overflow |
| `pointerEvents` | `'auto' \| 'none' \| 'box-none' \| 'box-only'` | Both | Touch event targeting |
| `cursor` | `string` | iOS | Cursor type (mouse/trackpad) |
| `mixBlendMode` | `string` | Both | Blend mode with backdrop |
| `overlayColor` | `color` | Android | Overlay color for edge fading |

---

## Text Style Props

| Prop | Type | Platform | Description |
|------|------|----------|-------------|
| `color` | `color` | Both | Text color |
| `fontFamily` | `string` | Both | Font family (single name, not CSS comma list). iOS supports `system-ui`, `ui-sans-serif`, `ui-serif`, `ui-monospace`, `ui-rounded` |
| `fontSize` | `number` | Both | Font size in pixels |
| `fontStyle` | `'normal' \| 'italic'` | Both | Font style |
| `fontWeight` | `'normal' \| 'bold' \| '100'-'900'` | Both | Font weight |
| `fontVariant` | `string[] \| string` | Both | Font variants (`'small-caps'`, `'oldstyle-nums'`, `'lining-nums'`, `'tabular-nums'`, `'proportional-nums'`) |
| `letterSpacing` | `number` | Both | Extra spacing between characters |
| `lineHeight` | `number` | Both | Line height (distance between baselines) |
| `textAlign` | `'auto' \| 'left' \| 'right' \| 'center' \| 'justify'` | Both | Text alignment. `justify` on Android requires API 26+ |
| `textAlignVertical` | `'auto' \| 'top' \| 'bottom' \| 'center'` | Android | Vertical text alignment (alias for `verticalAlign`) |
| `verticalAlign` | `'auto' \| 'top' \| 'bottom' \| 'middle'` | Android | Vertical alignment (takes precedence over `textAlignVertical`) |
| `textDecorationLine` | `'none' \| 'underline' \| 'line-through' \| 'underline line-through'` | Both | Text decoration line |
| `textDecorationColor` | `color` | iOS | Decoration line color |
| `textDecorationStyle` | `'solid' \| 'double' \| 'dotted' \| 'dashed'` | iOS | Decoration line style |
| `textShadowColor` | `color` | Both | Text shadow color |
| `textShadowOffset` | `{width?: number, height?: number}` | Both | Shadow offset |
| `textShadowRadius` | `number` | Both | Shadow blur radius |
| `textTransform` | `'none' \| 'uppercase' \| 'lowercase' \| 'capitalize'` | Both | Text case transform |
| `includeFontPadding` | `boolean` | Android | Extra font padding for ascenders/descenders (default: `true`). Set `false` with `textAlignVertical: 'center'` for best centering |
| `writingDirection` | `'auto' \| 'ltr' \| 'rtl'` | iOS | Writing direction |
| `userSelect` | `'auto' \| 'text' \| 'none' \| 'contain' \| 'all'` | Both | Text selection behavior |

---

## Image Style Props

| Prop | Type | Description |
|------|------|-------------|
| `resizeMode` | `'cover' \| 'contain' \| 'stretch' \| 'repeat' \| 'center'` | How to resize image |
| `objectFit` | `'contain' \| 'cover' \| 'fill' \| 'none' \| 'scale-down'` | CSS-like object-fit |
| `tintColor` | `color` | Apply color tint (all non-transparent pixels) |
| `overlayColor` | `color` | Android: overlay color for edge fading |
| `backfaceVisibility` | `'visible' \| 'hidden'` | Back face visibility |
| `backgroundColor` | `color` | Background color |
| `opacity` | `number` | 0-1 transparency |
| `overflow` | `'visible' \| 'hidden' \| 'scroll'` | Overflow behavior |
| `borderRadius` | `number` | Border radius |
| `borderWidth` | `number` | Border width |
| `borderColor` | `color` | Border color |
| `borderTopLeftRadius` | `number` | Corner radius |
| `borderTopRightRadius` | `number` | Corner radius |
| `borderBottomLeftRadius` | `number` | Corner radius |
| `borderBottomRightRadius` | `number` | Corner radius |

---

## Transforms

### Transform Property

`transform` accepts an array of transformation objects or a space-separated string:

```tsx
// Array form (recommended)
{transform: [{rotateX: '45deg'}, {rotateZ: '0.785398rad'}]}

// String form
{transform: 'rotateX(45deg) rotateZ(0.785398rad)'}
```

### Available Transforms

| Transform | Value Type | Description |
|-----------|-----------|-------------|
| `perspective` | `number` | 3D perspective depth |
| `rotate` | `string` | Rotate (deg or rad) |
| `rotateX` | `string` | Rotate around X axis |
| `rotateY` | `string` | Rotate around Y axis |
| `rotateZ` | `string` | Rotate around Z axis |
| `scale` | `number` | Uniform scale |
| `scaleX` | `number` | Scale X axis |
| `scaleY` | `number` | Scale Y axis |
| `translateX` | `number` | Translate X (pixels) |
| `translateY` | `number` | Translate Y (pixels) |
| `skewX` | `string` | Skew X axis (deg) |
| `skewY` | `string` | Skew Y axis (deg) |

### Transform Origin

`transformOrigin` sets the origin point for transformations (default: `center`):

```tsx
{transformOrigin: '0 0'}           // top-left
{transformOrigin: 'center'}        // center (default)
{transformOrigin: '50% 50%'}       // center
{transformOrigin: '0% 100%'}       // bottom-left
```

### Matrix Transform

```tsx
{transform: [{matrix: [1, 0, 0, 1, 0, 0]}]}  // identity matrix
```

> **Deprecated:** `decomposedMatrix`, `rotation`, `scaleX`, `scaleY`, `transformMatrix`, `translateX`, `translateY` as direct style props. Use `transform` array instead.

---

## Color Reference

### Color Representations

#### RGB (hexadecimal and functional)

```tsx
'#f0f'              // #rgb
'#ff00ff'           // #rrggbb
'#f0ff'             // #rgba (4-digit hex with alpha)
'#ff00ff00'         // #rrggbbaa
'rgb(255, 0, 255)'  // functional
'rgb(255 0 255)'    // space-separated
'rgba(255, 0, 255, 1.0)'  // with alpha
'rgba(255 0 255 / 1.0)'   // space-separated with alpha
```

#### HSL

```tsx
'hsl(360, 100%, 100%)'
'hsl(360 100% 100%)'
'hsla(360, 100%, 100%, 1.0)'
'hsla(360 100% 100% / 1.0)'
```

#### HWB

```tsx
'hwb(0, 0%, 100%)'
'hwb(360, 100%, 100%)'
'hwb(0 0% 0%)'
```

#### Color Ints

```tsx
0xff00ff00  // 0xrrggbbaa (note: different from Android's 0xaarrggbb)
```

#### Named Colors

- `transparent` — shortcut for `rgba(0,0,0,0)`
- All CSS3/SVG named colors supported (lowercase only): `aliceblue`, `antiquewhite`, `aqua`, `black`, `blue`, `coral`, `crimson`, `cyan`, `darkblue`, `fuchsia`, `gold`, `gray`, `green`, `hotpink`, `indigo`, `lavender`, `lime`, `magenta`, `maroon`, `navy`, `olive`, `orange`, `orangered`, `orchid`, `palegreen`, `pink`, `plum`, `purple`, `rebeccapurple`, `red`, `royalblue`, `salmon`, `seagreen`, `silver`, `skyblue`, `snow`, `springgreen`, `steelblue`, `tan`, `teal`, `thistle`, `tomato`, `turquoise`, `violet`, `wheat`, `white`, `whitesmoke`, `yellow`, `yellowgreen`, and more (full CSS3/SVG spec)

### PlatformColor

```tsx
import {PlatformColor} from 'react-native';

// Use native platform colors
{backgroundColor: PlatformColor('systemBackground')}
{color: PlatformColor('labelColor')}

// Android
{backgroundColor: PlatformColor('?android:colorBackground')}
{color: PlatformColor('?android:attr/textColorPrimary')}
```

### DynamicColor (iOS)

```tsx
import {DynamicColorIOS} from 'react-native';

{color: DynamicColorIOS({light: 'black', dark: 'white'})}
```

> On Android, use `PlatformColor` with Material You colors instead.

---

## PanResponder

Reconciles several touches into a single gesture. Makes single-touch gestures resilient to extra touches, can recognize basic multi-touch gestures.

### Usage Pattern

```tsx
import {PanResponder, View} from 'react-native';

const ExampleComponent = () => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        // Gesture started. gestureState.d{x,y} set to zero
      },
      onPanResponderMove: (evt, gestureState) => {
        // gestureState.move{X,Y} = most recent move distance
        // gestureState.d{x,y} = accumulated distance since responder
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // User released all touches — gesture succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component became responder — cancel gesture
      },
      onShouldBlockNativeResponder: (evt, gestureState) => true, // Android only
    }),
  ).current;

  return <View {...panResponder.panHandlers} />;
};
```

### gestureState Fields

| Field | Type | Description |
|-------|------|-------------|
| `stateID` | `number` | ID of gesture state (persists until after release) |
| `moveX` | `number` | Latest X position of touch |
| `moveY` | `number` | Latest Y position of touch |
| `dx` | `number` | Accumulated distance since touch started |
| `dy` | `number` | Accumulated distance since touch started |
| `vx` | `number` | Current velocity (X) |
| `vy` | `number` | Current velocity (Y) |
| `numberActiveTouches` | `number` | Number of touches currently active |

---

## Share

Open a dialog to share text content.

### Methods

```tsx
import {Share} from 'react-native';

// Share content
const result = await Share.share({
  message: 'Check out this app!',
  url: 'https://example.com',
  title: 'Share Title', // iOS only
});

// With options (iOS)
const result = await Share.share(
  {message: 'Hello'},
  {
    dialogTitle: 'Share via',  // Android
    subject: 'Email subject',  // iOS
    tintColor: '#ff0000',      // iOS
    anchor: 6,                 // Android (anchor point for iPad)
    excludedActivityTypes: [],  // iOS
  }
);
```

### Properties

| Property | Platform | Description |
|----------|----------|-------------|
| `sharedAction` | Both | Share action completed (Android always returns this) |
| `dismissedAction` | iOS | User dismissed share dialog |

### ShareContent

```tsx
type ShareContent = {
  message?: string;  // Both
  url?: string;      // iOS only (Android: appended to message)
  title?: string;    // iOS only
};
```

---

## Vibration

Trigger device vibration.

### Methods

```tsx
import {Vibration} from 'react-native';

// Vibrate for default duration (~400ms)
Vibration.vibrate();

// Vibrate for specific duration (Android only, iOS ignores)
Vibration.vibrate(1000); // 1 second (Android)

// Vibrate pattern
Vibration.vibrate([0, 500, 200, 500]); // wait, vibrate, wait, vibrate

// Vibrate pattern with repeat
Vibration.vibrate([0, 500, 200, 500], true); // loops until cancel()

// Stop vibrating
Vibration.cancel();
```

### Platform Differences

- **iOS:** Duration is fixed at ~400ms, pattern numbers represent separation time
- **Android:** Can specify arbitrary duration, pattern odd indices = vibration duration, even = separation time

---

## Systrace

Android marker-based profiling tool.

### Methods

```tsx
import {Systrace} from 'react-native';

// Check if tracing is enabled
Systrace.isEnabled();

// Synchronous events (same call stack)
Systrace.beginEvent('myEvent');
// ... work ...
Systrace.endEvent();

// Async events (can end on another thread)
const cookie = Systrace.beginAsyncEvent('myAsyncEvent');
// ... async work ...
Systrace.endAsyncEvent('myAsyncEvent', cookie);

// Register a counter value
Systrace.counterEvent('myCounter', 42);
```

---

## Headless JS (Android)

Run JS tasks while app is in background (sync data, push notifications, play music).

### JS API

```tsx
// Register task
import {AppRegistry} from 'react-native';
AppRegistry.registerHeadlessTask('SomeTaskName', () => require('SomeTaskName'));

// SomeTaskName.js
module.exports = async taskData => {
  // Do background work (network, timers, etc.)
  // No UI access allowed
};
```

### Platform API (Java/Kotlin)

```java
// Start headless task from native
HeadlessJsTaskConfig config = new HeadlessJsTaskConfig(
  "SomeTaskName",
  Arguments.fromBundle(extras),
  5000,  // timeout in ms
  false  // allow foreground execution
);
HeadlessJsTaskService.getInstance().startTask(config);
```

### Retries

```java
// Java
HeadlessJsRetryPolicy retryPolicy = new LinearCountingRetryPolicy(
  3,    // max retries
  1000  // delay between retries (ms)
);
return new HeadlessJsTaskConfig("SomeTaskName", Arguments.fromBundle(extras), 5000, false, retryPolicy);
```

```kotlin
// Kotlin
val retryPolicy: HeadlessJsTaskRetryPolicy = LinearCountingRetryPolicy(3, 1000)
return HeadlessJsTaskConfig("SomeTaskName", Arguments.fromBundle(extras), 5000, false, retryPolicy)
```

Throw `HeadlessJsTaskError` to trigger retry:

```tsx
import {HeadlessJsTaskError} from 'HeadlessJsTask';
module.exports = async taskData => {
  if (!condition) {
    throw new HeadlessJsTaskError();
  }
};
```

### Caveats

- App crashes if task runs while app is in foreground (by default). Pass `true` as 4th arg to allow.
- Call `HeadlessJsTaskService.acquireWakeLockNow()` before returning from `onReceive()` in `BroadcastReceiver`.
