# PanResponder, Share, Vibration, Systrace, Headless JS Reference

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
