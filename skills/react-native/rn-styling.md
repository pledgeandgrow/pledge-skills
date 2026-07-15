# Styling in React Native

React Native uses JavaScript for styling. All core components accept a `style` prop.
Style names and values match CSS, except using camelCase (`backgroundColor` not `background-color`).

---

## Inline Styles

```tsx
<View style={{flex: 1, backgroundColor: 'white', padding: 10}}>
  <Text style={{fontSize: 16, color: '#333'}}>Hello</Text>
</View>
```

## StyleSheet.create

```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

<View style={styles.container}>
  <Text style={styles.text}>Hello</Text>
</View>
```

## Style Arrays

```tsx
<View style={[styles.container, {marginTop: 20}]} />
<View style={[styles.container, isActive && styles.active]} />
```

## Known Issues

- `overflow: 'visible'` doesn't work on Android — views are clipped by their parents

---

## Layout with Flexbox

Flexbox is designed to provide consistent layout on different screen sizes.
React Native uses [Yoga](https://www.yogalayout.dev/) for flexbox implementation.

### Flex

`flex` defines how items fill available space along the main axis.

```tsx
// Container: flex: 1 (fills all space)
// Children: flex 1, 2, 3 → 1/6, 2/6, 3/6 of space
<View style={{flex: 1}}>
  <View style={{flex: 1, backgroundColor: 'red'}} />
  <View style={{flex: 2, backgroundColor: 'orange'}} />
  <View style={{flex: 3, backgroundColor: 'green'}} />
</View>
```

### Flex Direction

Controls direction children are laid out (the main axis):

| Value | Description |
|-------|-------------|
| `column` (default) | Top to bottom |
| `row` | Left to right |
| `column-reverse` | Bottom to top |
| `row-reverse` | Right to left |

### Layout Direction

| Value | Description |
|-------|-------------|
| `LTR` (default) | Left to right; `start` = left, `end` = right |
| `RTL` | Right to left; `start` = right, `end` = left |

### Justify Content

Align children within the **main axis**:

| Value | Description |
|-------|-------------|
| `flex-start` (default) | Start of container |
| `flex-end` | End of container |
| `center` | Center of container |
| `space-between` | Evenly spaced, no space at edges |
| `space-around` | Evenly spaced, half-space at edges |
| `space-evenly` | Equal space between all items and edges |

### Align Items

Align children along the **cross axis**:

| Value | Description |
|-------|-------------|
| `stretch` (default) | Stretch to fill cross axis |
| `flex-start` | Start of cross axis |
| `flex-end` | End of cross axis |
| `center` | Center of cross axis |
| `baseline` | Along common baseline |

### Align Self

Overrides `alignItems` for a single child. Same options as `alignItems`.

### Align Content

Distribution of lines along cross-axis (only when `flexWrap` is enabled):

| Value | Description |
|-------|-------------|
| `flex-start` (default) | Start of cross axis |
| `flex-end` | End of cross axis |
| `stretch` | Stretch to fill cross axis |
| `center` | Center of cross axis |
| `space-between` | Evenly spaced between lines |
| `space-around` | Evenly spaced around lines |
| `space-evenly` | Equal space everywhere |

### Flex Wrap

Controls what happens when children overflow the container along the main axis:

| Value | Description |
|-------|-------------|
| `nowrap` (default) | Single line (children shrink) |
| `wrap` | Multiple lines |
| `wrap-reverse` | Multiple lines in reverse |

### Flex Basis, Grow, and Shrink

- `flexBasis` — default size before flex grow/shrink applies
- `flexGrow` — how much to grow relative to siblings
- `flexShrink` — how much to shrink relative to siblings

### Gap Properties

```tsx
<View style={{flexDirection: 'row', gap: 10, rowGap: 15, columnGap: 20}}>
  <View /><View /><View />
</View>
```

### Width and Height

```tsx
// Fixed
{width: 200, height: 100}

// Percentage
{width: '50%', height: '100%'}
```

### Position

| Value | Description |
|-------|-------------|
| `relative` (default) | Normal flow, offset by top/right/bottom/left |
| `absolute` | Removed from flow, positioned relative to containing block |
| `static` | Normal flow, ignores top/right/bottom/left. Does NOT form containing block for absolute descendants (New Architecture only) |

### Containing Block

For absolutely positioned elements, the containing block is the nearest ancestor with:
- A position type other than `static`, OR
- A `transform`

Percentage lengths on absolutely positioned elements are relative to the containing block.
