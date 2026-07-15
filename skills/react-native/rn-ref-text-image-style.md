# Text Style Props Reference

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
