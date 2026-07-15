# Transforms & Colors Reference

---

## Transforms

### Transform Property

`transform` accepts an array of transformation objects or a space-separated string:

```tsx
// Array form (recommended)
{transform: [{rotateX: '45deg'}, {rotateZ: '0.785398rad'}]}

// String form
{transform: 'rotateX(45deg) rotateZ(0.785398rad)'}
```

### Available Transforms

| Transform | Value Type | Description |
|-----------|-----------|-------------|
| `perspective` | `number` | 3D perspective depth |
| `rotate` | `string` | Rotate (deg or rad) |
| `rotateX` | `string` | Rotate around X axis |
| `rotateY` | `string` | Rotate around Y axis |
| `rotateZ` | `string` | Rotate around Z axis |
| `scale` | `number` | Uniform scale |
| `scaleX` | `number` | Scale X axis |
| `scaleY` | `number` | Scale Y axis |
| `translateX` | `number` | Translate X (pixels) |
| `translateY` | `number` | Translate Y (pixels) |
| `skewX` | `string` | Skew X axis (deg) |
| `skewY` | `string` | Skew Y axis (deg) |

### Transform Origin

`transformOrigin` sets the origin point for transformations (default: `center`):

```tsx
{transformOrigin: '0 0'}           // top-left
{transformOrigin: 'center'}        // center (default)
{transformOrigin: '50% 50%'}       // center
{transformOrigin: '0% 100%'}       // bottom-left
```

### Matrix Transform

```tsx
{transform: [{matrix: [1, 0, 0, 1, 0, 0]}]}  // identity matrix
```

> **Deprecated:** `decomposedMatrix`, `rotation`, `scaleX`, `scaleY`, `transformMatrix`, `translateX`, `translateY` as direct style props. Use `transform` array instead.

---

## Color Reference

### RGB (hexadecimal and functional)

```tsx
'#f0f'              // #rgb
'#ff00ff'           // #rrggbb
'#f0ff'             // #rgba (4-digit hex with alpha)
'#ff00ff00'         // #rrggbbaa
'rgb(255, 0, 255)'  // functional
'rgb(255 0 255)'    // space-separated
'rgba(255, 0, 255, 1.0)'  // with alpha
'rgba(255 0 255 / 1.0)'   // space-separated with alpha
```

### HSL

```tsx
'hsl(360, 100%, 100%)'
'hsl(360 100% 100%)'
'hsla(360, 100%, 100%, 1.0)'
'hsla(360 100% 100% / 1.0)'
```

### HWB

```tsx
'hwb(0, 0%, 100%)'
'hwb(360, 100%, 100%)'
'hwb(0 0% 0%)'
```

### Color Ints

```tsx
0xff00ff00  // 0xrrggbbaa (note: different from Android's 0xaarrggbb)
```

### Named Colors

- `transparent` — shortcut for `rgba(0,0,0,0)`
- All CSS3/SVG named colors supported (lowercase only): `aliceblue`, `antiquewhite`, `aqua`, `black`, `blue`, `coral`, `crimson`, `cyan`, `darkblue`, `fuchsia`, `gold`, `gray`, `green`, `hotpink`, `indigo`, `lavender`, `lime`, `magenta`, `maroon`, `navy`, `olive`, `orange`, `orangered`, `orchid`, `palegreen`, `pink`, `plum`, `purple`, `rebeccapurple`, `red`, `royalblue`, `salmon`, `seagreen`, `silver`, `skyblue`, `snow`, `springgreen`, `steelblue`, `tan`, `teal`, `thistle`, `tomato`, `turquoise`, `violet`, `wheat`, `white`, `whitesmoke`, `yellow`, `yellowgreen`, and more (full CSS3/SVG spec)

### PlatformColor

```tsx
import {PlatformColor} from 'react-native';

// Use native platform colors
{backgroundColor: PlatformColor('systemBackground')}
{color: PlatformColor('labelColor')}

// Android
{backgroundColor: PlatformColor('?android:colorBackground')}
{color: PlatformColor('?android:attr/textColorPrimary')}
```

### DynamicColor (iOS)

```tsx
import {DynamicColorIOS} from 'react-native';

{color: DynamicColorIOS({light: 'black', dark: 'white'})}
```

> On Android, use `PlatformColor` with Material You colors instead.
