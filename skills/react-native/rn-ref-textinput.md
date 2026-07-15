# TextInput Component Reference

Text input via keyboard. Configurable: auto-correction, auto-capitalization, placeholder, keyboard types.

---

## Key Props

| Prop | Type | Platform | Description |
|------|------|----------|-------------|
| `value` | `string` | Both | Input value |
| `defaultValue` | `string` | Both | Initial value (uncontrolled) |
| `editable` | `boolean` | Both | Whether editable (default: `true`) |
| `maxLength` | `number` | Both | Max character count |
| `multiline` | `boolean` | Both | Multi-line input (default: `false`) |
| `placeholder` | `string` | Both | Placeholder text |
| `placeholderTextColor` | `color` | Both | Placeholder color |
| `secureTextEntry` | `boolean` | Both | Password field |
| `keyboardType` | `KeyboardType` | Both | Keyboard type (see below) |
| `inputMode` | `InputMode` | Both | HTML inputmode (overrides keyboardType) |
| `returnKeyType` | `ReturnKeyType` | Both | Return key label |
| `autoCapitalize` | `'none' \| 'sentences' \| 'words' \| 'characters'` | Both | Auto-capitalization |
| `autoCorrect` | `boolean` | Both | Auto-correction |
| `autoFocus` | `boolean` | Both | Auto-focus on mount |
| `selectTextOnFocus` | `boolean` | Both | Select all text on focus |
| `clearTextOnFocus` | `boolean` | iOS | Clear text on focus |
| `clearButtonMode` | `'never' \| 'while-editing' \| 'unless-editing' \| 'always'` | iOS | Clear button |
| `textAlign` | `'auto' \| 'left' \| 'right' \| 'center' \| 'justify'` | Both | Text alignment |
| `selection` | `{start, end}` | Both | Selection range |
| `selectionColor` | `color` | Both | Selection highlight color |
| `numberOfLines` | `number` | Android | Lines for multiline |
| `rows` | `number` | Android | Rows for multiline |
| `readOnly` | `boolean` | Both | Read-only |
| `contextMenuHidden` | `boolean` | Both | Hide context menu |
| `showSoftInputOnFocus` | `boolean` | Both | Show keyboard on focus |
| `inputAccessoryViewID` | `string` | iOS | Input accessory view ID |
| `inputAccessoryViewButtonLabel` | `string` | iOS | Input accessory button label |
| `disableFullscreenUI` | `boolean` | Android | Disable fullscreen UI |
| `scrollEnabled` | `boolean` | iOS | Scroll enabled for multiline |
| `textContentType` | `TextContentType` | iOS | Autofill content type |
| `passwordRules` | `string` | iOS | Password rules for autofill |
| `cursorColor` | `color` | Android | Cursor color |
| `underlineColorAndroid` | `color` | Android | Underline color |
| `inlineImageLeft` | `string` | Android | Inline image resource name |
| `inlineImagePadding` | `number` | Android | Padding for inline image |

## Keyboard Types

**Cross-platform:** `default`, `number-pad`, `decimal-pad`, `numeric`, `email-address`, `phone-pad`, `url`

**iOS only:** `ascii-capable`, `numbers-and-punctuation`, `name-phone-pad`, `twitter`, `web-search`

**Android only:** `visible-password`

## Input Mode (overrides keyboardType)

`none`, `text`, `decimal`, `numeric`, `tel`, `search`, `email`, `url`

## Events

| Prop | Type | Description |
|------|------|-------------|
| `onChangeText` | `(text: string) => void` | Text changed |
| `onChange` | `(event) => void` | Change event |
| `onFocus` | `(event) => void` | Focus gained |
| `onBlur` | `(event) => void` | Focus lost |
| `onKeyPress` | `(event) => void` | Key press |
| `onSubmitEditing` | `(event) => void` | Submit (return key) |
| `onEndEditing` | `(event) => void` | Editing ended |
| `onContentSizeChange` | `(event) => void` | Content size changed |
| `onSelectionChange` | `(event) => void` | Selection changed |
| `onScroll` | `(event) => void` | Scroll (multiline) |
| `onLayout` | `(event) => void` | Layout changes |
| `onPressIn` | `(event) => void` | Press in |
| `onPressOut` | `(event) => void` | Press out |

## Methods (via ref)

```tsx
const inputRef = useRef<TextInput>(null);

inputRef.current?.focus();
inputRef.current?.blur();
inputRef.current?.clear();
inputRef.current?.isFocused(); // returns boolean
```

## Known Issues

- `onChangeText` fires before `onBlur` on Android — may get stale values
- `submitBehavior` controls what happens on return key for multiline
