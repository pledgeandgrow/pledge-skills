# Event Types & Node Types Reference

---

## PressEvent

Returned in callbacks from user press interactions (e.g., `onPress` in Button).

| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| `changedTouches` | `PressEvent[]` | Both | All PressEvents that changed since last event |
| `force` | `number` | iOS | Force during 3D Touch press (0.0 - 1.0) |
| `identifier` | `number` | Both | Unique numeric identifier |
| `locationX` | `number` | Both | Touch origin X relative to element |
| `locationY` | `number` | Both | Touch origin Y relative to element |
| `pageX` | `number` | Both | Touch origin X relative to root view |
| `pageY` | `number` | Both | Touch origin Y relative to root view |
| `target` | `number` | Both | Node ID of element receiving the PressEvent |
| `timestamp` | `number` | Both | Timestamp in milliseconds |
| `touches` | `PressEvent[]` | Both | All current PressEvents on screen |

**Used by:** Button, Pressable, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback

---

## LayoutEvent

Returned in `onLayout` callbacks (e.g., View, TouchableWithoutFeedback).

```tsx
type LayoutEvent = {
  nativeEvent: {
    layout: {
      x: number;      // X coordinate inside parent
      y: number;      // Y coordinate inside parent
      width: number;   // Width after layout changes
      height: number;  // Height after layout changes
      target: number;  // Node ID of element receiving event
    };
  };
};
```

**Used by:** View, Text, Image, TextInput, ScrollView, TouchableWithoutFeedback, and most components with `onLayout`

---

## TargetEvent

Returned in `onFocus` / `onBlur` callbacks.

```tsx
type TargetEvent = {
  nativeEvent: {
    target: number;  // Node ID of element receiving event
  };
};
```

**Used by:** TouchableWithoutFeedback (`onFocus`, `onBlur`), TextInput (focus events)

---

## Text Nodes

Represent raw text content in the tree (similar to Text nodes on Web). Not directly accessible via refs, but accessible via `childNodes` on element refs.

### Web-compatible API (from Node)

**Properties:**
- `childNodes`, `firstChild`, `isConnected`, `lastChild`, `nextSibling`
- `nodeName`, `nodeType`, `nodeValue`
- `ownerDocument` — Document node where component was rendered
- `parentElement`, `parentNode`, `previousSibling`
- `textContent`

**Methods:**
- `compareDocumentPosition(otherNode)`
- `contains(node)`
- `getRootNode()` — Returns self if not mounted
- `hasChildNodes()`

---

## Document Nodes

Represent the root of a React Native tree (similar to Document on Web). Accessed via `ownerDocument` on element/text nodes.

---

## Rect Type

Used by `hitSlop` and `pressRetentionOffset`:

```tsx
type Rect = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};
```
