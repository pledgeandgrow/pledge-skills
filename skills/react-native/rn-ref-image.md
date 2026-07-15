# Image & ImageBackground Component Reference

---

## Image

Displays images: network, static resources, local disk.

### Key Props

| Prop | Type | Platform | Description |
|------|------|----------|-------------|
| `source` | `ImageSource` | Both | Image source (`require()` or `{uri: '...'}`) |
| `defaultSource` | `ImageSource` | Both | Placeholder while loading |
| `blurRadius` | `number` | Both | Blur filter radius |
| `fadeDuration` | `number` | Android | Fade animation duration (default: 300ms) |
| `resizeMode` | `'cover' \| 'contain' \| 'stretch' \| 'repeat' \| 'center'` | Both | How to resize image |
| `resizeMethod` | `'auto' \| 'resize' \| 'scale'` | Android | Resize method |
| `tintColor` | `color` | Both | Apply color tint |
| `crossOrigin` | `'anonymous' \| 'use-credentials'` | Both | CORS mode |
| `referrerPolicy` | `string` | Both | Referrer policy |
| `alt` | `string` | Both | Alt text for screen readers |
| `progressiveRenderingEnabled` | `boolean` | Android | Progressive JPEG streaming |
| `capInsets` | `Rect` | iOS | Stretchable image corners |

### Events

| Prop | Type | Description |
|------|------|-------------|
| `onLoad` | `(event) => void` | Load completes successfully |
| `onLoadStart` | `() => void` | Load starts |
| `onLoadEnd` | `() => void` | Load succeeds or fails |
| `onError` | `(event) => void` | Load error |
| `onProgress` | `(event) => void` | Download progress (`{loaded, total}`) |
| `onPartialLoad` | `() => void` | Partial load (iOS, progressive JPEG) |
| `onLayout` | `(event) => void` | Layout changes |

### Static Methods

```tsx
// Prefetch remote image
await Image.prefetch(url);

// Get image dimensions before displaying
const {width, height} = await Image.getSize(uri);
const {width, height} = await Image.getSizeWithHeaders(uri, headers);

// Query cache status
const cache = await Image.queryCache(['url1', 'url2']);
// Returns: {url1: 'memory', url2: 'disk/memory'}

// Abort prefetch (Android)
Image.abortPrefetch(requestId);

// Resolve asset source
const source = Image.resolveAssetSource(require('./img.png'));
// Returns: {uri, scale, width, height}
```

### Image Source Types

```tsx
// Static resource
<Image source={require('./my-icon.png')} />

// Network image
<Image source={{uri: 'https://example.com/image.png'}} />

// With dimensions (for proper layout)
<Image source={{uri: 'https://...', width: 200, height: 200}} />

// Base64
<Image source={{uri: 'data:image/png;base64,...'}} />
```

---

## ImageBackground

Background image component (like CSS `background-image`). Same props as `Image`, with children layered on top.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `imageStyle` | `ImageStyle` | Style for the inner Image |
| `imageRef` | `ref` | Ref to the inner Image element node |
| `style` | `ViewStyle` | Style for the container View |

> Inherits all Image Props.

### Usage

```tsx
import {ImageBackground, Text} from 'react-native';

<ImageBackground
  source={require('./background.png')}
  style={{flex: 1}}
  imageStyle={{resizeMode: 'cover'}}>
  <Text>Content on top of background</Text>
</ImageBackground>
```
