# Core — Loaders (Quick Reference)

## Quick Reference Table

| Loader | Import | Loads |
|--------|--------|-------|
| `FileLoader` | core | Raw files (text, JSON, binary) |
| `TextureLoader` | core | Image textures (JPG, PNG, etc.) |
| `CubeTextureLoader` | core | Cube map textures (6 images) |
| `DataTextureLoader` | core | Data textures |
| `CompressedTextureLoader` | core | Compressed textures |
| `ImageLoader` | core | Image elements |
| `ImageBitmapLoader` | core | ImageBitmap objects |
| `ObjectLoader` | core | JSON scenes/objects |
| `BufferGeometryLoader` | core | BufferGeometry from JSON |
| `MaterialLoader` | core | Materials from JSON |
| `AnimationLoader` | core | Animation clips from JSON |
| `AudioLoader` | core | Audio buffers |
| `FontLoader` | core | Fonts for TextGeometry |

## Usage Patterns

### Basic Loading
```javascript
const loader = new THREE.TextureLoader();
loader.load('texture.jpg',
  (texture) => { console.log('Loaded', texture); },
  (progress) => { console.log(`${progress.loaded}/${progress.total}`); },
  (error) => { console.error('Error', error); }
);
```

### Async Loading (Promise-based)
```javascript
const texture = await loader.loadAsync('texture.jpg');
```

### Loading Manager
```javascript
const manager = new THREE.LoadingManager();
manager.onLoad = () => { console.log('All assets loaded'); };
manager.onProgress = (url, loaded, total) => { console.log(`${loaded}/${total}`); };
const loader = new THREE.TextureLoader(manager);
```

## Loader Base Class API

All loaders extend `Loader`:

**Methods:**
- `load(url, onLoad, onProgress, onError)` — Start loading
- `loadAsync(url, onProgress)` — Promise-based loading
- `setPath(path)` — Set base URL path
- `setResourcePath(path)` — Set resource path
- `setCrossOrigin(value)` — Set CORS mode ("anonymous", "use-credentials")
- `setWithCredentials(value)` — Send credentials
- `setRequestHeader(header)` — Custom HTTP headers
- `parse(data)` — Parse loaded data (abstract)

---

## Cache

Simple key-value cache for loaded resources. Used internally by loaders.

**Methods:**
- `Cache.add(url, value)` — Add to cache
- `Cache.get(url)` — Retrieve from cache
- `Cache.remove(url)` — Remove from cache
- `Cache.clear()` — Clear all cached items

---

## Loaders / Managers

### LoadingManager

Manages loading of multiple resources. Tracks progress and dispatches events.

**Constructor:** `new LoadingManager(onLoad, onProgress, onError)`

**Properties:**
- `onLoad: Function` — Called when all items loaded
- `onProgress: Function` — Called on each item load `(url, loaded, total)`
- `onError: Function` — Called on item error
- `onStart: Function` — Called when loading starts
- `itemStart(url)`, `itemEnd(url)`, `itemError(url)` — Internal tracking
- `modifier: Function` — URL modifier function

**Methods:**
- `resolveURL(url)` — Resolve URL through modifier
- `setURLModifier(modifier)` — Set custom URL resolver

### DefaultLoadingManager

A global instance of `LoadingManager` used by all loaders by default. Access via `THREE.DefaultLoadingManager`.
