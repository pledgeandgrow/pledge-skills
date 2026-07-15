# View Component Reference

Container supporting flexbox layout, styling, touch handling, and accessibility.

---

## Key Props

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

## Responder Props (Touch Handling)

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

## Focus Navigation (Android)

| Prop | Type | Description |
|------|------|-------------|
| `nextFocusDown` | `number` | Next focus down ID |
| `nextFocusForward` | `number` | Next focus forward ID |
| `nextFocusLeft` | `number` | Next focus left ID |
| `nextFocusRight` | `number` | Next focus right ID |
| `nextFocusUp` | `number` | Next focus up ID |
