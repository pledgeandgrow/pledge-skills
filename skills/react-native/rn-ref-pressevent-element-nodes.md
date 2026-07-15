# PressEvent & Element Nodes Reference

---

## PressEvent Object Type

Returned in callbacks from user press interactions (e.g., `onPress` in Button).

### Properties

| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| `changedTouches` | `PressEvent[]` | Both | All PressEvents that changed since last event |
| `force` | `number` | iOS | Amount of force during 3D Touch press (0.0 - 1.0) |
| `identifier` | `number` | Both | Unique numeric identifier assigned to the event |
| `locationX` | `number` | Both | Touch origin X coordinate inside touchable area (relative to element) |
| `locationY` | `number` | Both | Touch origin Y coordinate inside touchable area (relative to element) |
| `pageX` | `number` | Both | Touch origin X coordinate on screen (relative to root view) |
| `pageY` | `number` | Both | Touch origin Y coordinate on screen (relative to root view) |
| `target` | `number` | Both | Node ID of element receiving the PressEvent |
| `timestamp` | `number` | Both | Timestamp when event occurred (milliseconds) |
| `touches` | `PressEvent[]` | Both | All current PressEvents on the screen |

### Used By

`Button`, `Pressable`, `TouchableOpacity`, `TouchableHighlight`, `TouchableWithoutFeedback`, `TouchableNativeFeedback`

---

## Element Nodes

Represent native components in the native view tree (similar to Element nodes on Web). Accessed via refs.

### Web-compatible API (from Element)

**Properties:**
- `childElementCount` — Number of element children
- `children` — Collection of child elements
- `clientHeight`, `clientLeft`, `clientTop`, `clientWidth` — Client dimensions
- `firstElementChild` — First element child
- `id` — Value of `id` or `nativeID` props
- `lastElementChild` — Last element child
- `nextElementSibling` — Next element sibling
- `nodeName` — Node name
- `nodeType` — Node type
- `nodeValue` — Node value
- `previousElementSibling` — Previous element sibling
- `scrollHeight` — Scroll height (only ScrollView returns non-zero for built-in components)
- `scrollLeft` — Scroll left (only ScrollView returns non-zero)
- `scrollTop` — Scroll top (only ScrollView returns non-zero)
- `scrollWidth` — Scroll width
- `tagName` — Normalized native component name prefixed with `RN:` (e.g., `RN:View`)
- `textContent` — Text content

**Methods:**
- `getBoundingClientRect()` — Returns element bounds
- `hasPointerCapture(pointerId)` — Check pointer capture
- `setPointerCapture(pointerId)` — Set pointer capture
- `releasePointerCapture(pointerId)` — Release pointer capture

### Web-compatible API (from Node)

**Properties:**
- `childNodes` — Child nodes collection
- `firstChild` — First child node
- `isConnected` — Whether connected to document
- `lastChild` — Last child node
- `nextSibling` — Next sibling node
- `ownerDocument` — Document node where component was rendered
- `parentElement` — Parent element
- `parentNode` — Parent node
- `previousSibling` — Previous sibling node

**Methods:**
- `compareDocumentPosition(otherNode)` — Compare document position
- `contains(node)` — Check if contains a node
- `getRootNode()` — Get root node (returns self if not mounted)
- `hasChildNodes()` — Check if has child nodes

### Legacy API

- `measure(callback)` — Measure element position/dimensions
- `measureInWindow(callback)` — Measure position relative to window
- `measureLayout(relativeTo, callback)` — Measure layout relative to another node
- `setNativeProps(props)` — Set native props directly (deprecated)
