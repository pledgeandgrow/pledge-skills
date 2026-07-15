# View Style Props Reference

---

## Background

| Prop | Type | Platform | Description |
|------|------|----------|-------------|
| `backgroundColor` | `color` | Both | Background color |
| `experimental_backgroundImage` | `string` | Both | **Experimental.** `linear-gradient()` (0.76+), `radial-gradient()` (0.80+) |
| `backfaceVisibility` | `'visible' \| 'hidden'` | Both | Whether back face is visible when rotated |
| `opacity` | `number` | Both | 0-1 transparency |
| `elevation` | `number` | Android | Z-depth for shadow (Android 5+) |

## Borders

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

## Shadow & Effects

| Prop | Type | Platform | Description |
|------|------|----------|-------------|
| `shadowColor` | `color` | iOS | Shadow color |
| `shadowOffset` | `{width: number, height: number}` | iOS | Shadow offset |
| `shadowOpacity` | `number` | iOS | Shadow opacity (0-1) |
| `shadowRadius` | `number` | iOS | Shadow blur radius |
| `boxShadow` | `string` | Both | CSS-like box shadow (e.g., `'0 2px 4px rgba(0,0,0,0.2)'`) |
| `filter` | `string` | Both | CSS filter (e.g., `'blur(5px)'`, `'brightness(1.5)'`) |

## Other

| Prop | Type | Platform | Description |
|------|------|----------|-------------|
| `overflow` | `'visible' \| 'hidden' \| 'scroll'` | Both | Content overflow |
| `pointerEvents` | `'auto' \| 'none' \| 'box-none' \| 'box-only'` | Both | Touch event targeting |
| `cursor` | `string` | iOS | Cursor type (mouse/trackpad) |
| `mixBlendMode` | `string` | Both | Blend mode with backdrop |
| `overlayColor` | `color` | Android | Overlay color for edge fading |
