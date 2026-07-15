# Text Component Reference

Displays text. Unique: children use text layout, not flexbox.

---

## Key Props

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

## Nested Text

Text inside `<Text>` uses text layout (inline), not flexbox:

```tsx
<Text style={{fontWeight: 'bold'}}>
  I am bold
  <Text style={{color: 'red'}}>and red</Text>
</Text>
```

## Limited Style Inheritance

- All text nodes must be inside `<Text>` (not directly in `<View>`)
- Style inheritance only works within text subtrees
- Create wrapper components (e.g., `MyAppText`) for consistent fonts
- `fontFamily` accepts a single font name (not CSS comma-separated)
