# Layout Props Reference

All layout props work with the [Yoga](https://github.com/facebook/yoga) layout engine. Default `flexDirection` is `column` (unlike CSS which defaults to `row`).

---

## Flexbox Properties

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

## Gap Properties

| Prop | Type | Description |
|------|------|-------------|
| `gap` | `number` | Gap between rows and columns |
| `rowGap` | `number` | Gap between rows |
| `columnGap` | `number` | Gap between columns |

## Position & Dimensions

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

## Margin Properties

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

## Padding Properties

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

## Border Width Properties

| Prop | Type | Description |
|------|------|-------------|
| `borderWidth` | `number` | All sides |
| `borderTopWidth` | `number` | Top |
| `borderBottomWidth` | `number` | Bottom |
| `borderLeftWidth` | `number` | Left |
| `borderRightWidth` | `number` | Right |
| `borderStartWidth` | `number` | Start (LTR: left, RTL: right) |
| `borderEndWidth` | `number` | End (LTR: right, RTL: left) |

## Direction & Box Sizing

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `'inherit' \| 'ltr' \| 'rtl'` | `inherit` | Directional flow (root uses locale) |
| `boxSizing` | `'border-box' \| 'content-box'` | `border-box` | How width/height are computed |

## Inset Shorthands

| Prop | Type | Description |
|------|------|-------------|
| `inset` | `number \| string` | All four edges |
| `insetBlock` | `number \| string` | Top + Bottom |
| `insetInline` | `number \| string` | Left + Right |
