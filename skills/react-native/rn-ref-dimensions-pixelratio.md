# Dimensions & PixelRatio API Reference

---

## Dimensions

> **Preferred:** Use `useWindowDimensions()` hook in React components — it updates reactively.

### Methods

```tsx
// Get dimensions
const {width, height} = Dimensions.get('window');
const {width, height} = Dimensions.get('screen');

// Listen for changes
const sub = Dimensions.addEventListener('change', ({window, screen}) => {
  console.log('Window:', window);
});
sub.remove();
```

### ScaledSize Type

```tsx
type ScaledSize = {
  width: number;
  height: number;
  scale: number;       // pixel ratio
  fontScale: number;   // font scaling factor
};
```

### useWindowDimensions Hook (preferred)

```tsx
import {useWindowDimensions} from 'react-native';

const {width, height, scale, fontScale} = useWindowDimensions();
```

Updates reactively when window changes (rotation, keyboard, split view).

### window vs screen

- `window`: App's visible area (excludes status bar on Android if not translucent, excludes navigation bar)
- `screen`: Full device screen dimensions

---

## PixelRatio

Access device pixel density and font scale.

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `get()` | `number` | Device pixel density (1=mdpi, 1.5=hdpi, 2=xhdpi, 3=xxhdpi, 3.5=xxxhdpi) |
| `getFontScale()` | `number` | Font scaling factor (user's font size preference) |
| `getPixelSizeForLayoutSize(layoutSize)` | `number` | Convert dp to px (returns integer) |
| `roundToNearestPixel(layoutSize)` | `number` | Round dp to nearest pixel-aligned value |

### Pixel Density Reference

| Value | Devices |
|-------|---------|
| `1` | mdpi Android |
| `1.5` | hdpi Android |
| `2` | iPhone SE/6S/7/8, iPhone XR/11, xhdpi Android |
| `3` | iPhone 6S+/7+/8+, iPhone X/XS/XS Max, 11 Pro/Pro Max, Pixel, xxhdpi Android |
| `3.5` | Nexus 6, Pixel XL, Pixel 2 XL, xxxhdpi Android |

### Usage

```tsx
import {PixelRatio} from 'react-native';

// Get correctly sized image
const ratio = PixelRatio.get();
const image = ratio >= 3 ? require('./image@3x.png')
            : ratio >= 2 ? require('./image@2x.png')
            : require('./image.png');

// Convert dp to px
const px = PixelRatio.getPixelSizeForLayoutSize(100); // e.g., 300 on 3x device

// Snap to pixel grid
const snapped = PixelRatio.roundToNearestPixel(8.4); // 8.33 on 3x device
```
