# Core — Classes, Loaders & Helpers

## Core Classes

### BufferAttribute

See `core-geometries.md` for full details.

### Clock

See `core-math.md` for full details.

### EventDispatcher

See `core-math.md` for full details.

### Layers

See `core-math.md` for full details.

### Raycaster

See `core-math.md` for full details.

### UniformsGroup

Groups uniforms for efficient GPU upload. Used with `ShaderMaterial`.

```javascript
const group = new THREE.UniformsGroup();
group.add(uniform1).add(uniform2);
```

**Methods:**
- `add(uniform)` — Add a uniform
- `remove(uniform)` — Remove a uniform
- `copy(group)` — Copy from another group
- `clone()` — Clone group
- `dispose()` — Free GPU resources

### WebGLProgram

Internal class representing a compiled shader program. Not typically used directly.

### WebGLRenderTarget

See `core-renderers.md` for full details.

---

## Loaders

### Loader (Abstract Base)

Base class for all loaders.

**Properties:**
- `manager: LoadingManager` — Default `DefaultLoadingManager`
- `crossOrigin: String` — Default "anonymous"
- `withCredentials: Boolean` — Default false
- `path: String` — Base path
- `resourcePath: String` — Resource path
- `requestHeader: Object` — Custom headers

**Methods:**
- `load(url, onLoad, onProgress, onError)` — Load resource (abstract)
- `loadAsync(url, onProgress)` — Promise-based load
- `parse(data)` — Parse data (abstract)
- `setPath(path)` — Set base path
- `setResourcePath(path)` — Set resource path
- `setCrossOrigin(crossOrigin)` — Set CORS mode
- `setWithCredentials(value)` — Set credentials
- `setRequestHeader(header)` — Set request headers

### LoadingManager

Manages loading of multiple resources. Tracks progress and completion.

```javascript
const manager = new THREE.LoadingManager();
manager.onLoad = () => console.log('All loaded');
manager.onProgress = (url, loaded, total) => console.log(`${loaded}/${total}`);
manager.onError = (url) => console.error(`Error: ${url}`);
const loader = new THREE.TextureLoader(manager);
```

**Properties:**
- `onStart: Function` — Called when loading starts
- `onLoad: Function` — Called when all items loaded
- `onProgress: Function(url, loaded, total)` — Progress callback
- `onError: Function(url)` — Error callback
- `itemStart: Function`, `itemEnd: Function`, `itemError: Function`
- `URLModifier: Object` — URL modification functions

**Methods:**
- `addURLModifier(callback)` — Modify URLs before loading
- `resolveURL(url)` — Resolve URL through modifiers
- `setURLModifier(callback)` — Set URL modifier

### DefaultLoadingManager

Global default loading manager instance.

### FileLoader

Low-level loader for files (text, JSON, binary, arraybuffer).

```javascript
const loader = new THREE.FileLoader();
loader.load('data.json', (data) => { ... });
// Or async:
const data = await loader.loadAsync('data.json');
```

**Constructor:** `FileLoader(manager)`

**Properties:**
- `responseType: String` — "", "arraybuffer", "blob", "document", "json", "text"
- `mimeType: String` — Optional MIME type
- `requestHeader: Object`

**Methods:**
- `load(url, onLoad, onProgress, onError)`
- `loadAsync(url, onProgress)`
- `setResponseType(type)`
- `setMimeType(type)`
- `setPath(path)`

### TextureLoader

Loads textures from image URLs.

```javascript
const loader = new THREE.TextureLoader();
const texture = await loader.loadAsync('texture.jpg');
texture.colorSpace = THREE.SRGBColorSpace;
```

### CubeTextureLoader

Loads cube textures (6 images for 6 faces).

```javascript
const loader = new THREE.CubeTextureLoader();
const cubeTexture = await loader.loadAsync([
  'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'
]);
scene.background = cubeTexture;
```

### DataTextureLoader

Base class for loading data textures.

### CompressedTextureLoader

Base class for loading compressed textures (DDS, PVR, KTX, etc.).

### ImageLoader

Loads images. Used internally by TextureLoader.

### ImageBitmapLoader

Loads `ImageBitmap` objects for textures.

### ObjectLoader

Loads JSON objects (scenes, geometries, materials, etc.).

```javascript
const loader = new THREE.ObjectLoader();
const object = await loader.loadAsync('scene.json');
scene.add(object);
```

### JSONLoader (deprecated)

Legacy JSON geometry loader. Use ObjectLoader instead.

### GeometryLoader (deprecated)

Legacy geometry loader.

### MaterialLoader

Loads materials from JSON.

### BufferGeometryLoader

Loads BufferGeometry from JSON.

```javascript
const loader = new THREE.BufferGeometryLoader();
const geometry = await loader.loadAsync('geometry.json');
```

### AnimationLoader

Loads animation clips from JSON.

### AudioLoader

Loads audio buffers.

```javascript
const loader = new THREE.AudioLoader();
const buffer = await loader.loadAsync('sound.mp3');
const audio = new THREE.Audio(listener);
audio.setBuffer(buffer);
```

### FontLoader

Loads fonts for TextGeometry.

```javascript
const loader = new THREE.FontLoader();
const font = await loader.loadAsync('font.json');
const textGeo = new THREE.TextGeometry('Hello', { font, size: 1 });
```

### LoaderUtils

Utility functions for loaders:
- `decodeText(array)` — Decode Uint8Array to string
- `extractUrlBase(url)` — Extract base URL

---

## Helpers

Helpers are visual aids for debugging and visualization. They extend `Object3D` and can be added to the scene.

### AxesHelper

Shows X (red), Y (green), Z (blue) axes.

```javascript
const helper = new THREE.AxesHelper(size); // size default 1
scene.add(helper);
```

### BoxHelper

Shows a wireframe box around an object's bounding box.

```javascript
const helper = new THREE.BoxHelper(object, color); // color default 0xffff00
scene.add(helper);
helper.update(); // Call when object changes
```

### Box3Helper

Shows a wireframe box from a Box3.

```javascript
const helper = new THREE.Box3Helper(box3, color);
```

### CameraHelper

Shows frustum of a camera (near/far planes, aspect).

```javascript
const helper = new THREE.CameraHelper(camera);
scene.add(helper);
```

### DirectionalLightHelper

Visualizes a DirectionalLight's direction and target.

```javascript
const helper = new THREE.DirectionalLightHelper(light, size, color);
helper.update(); // Call when light changes
```

### GridHelper

Shows a grid on the XZ plane.

```javascript
const helper = new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid);
// Defaults: size=10, divisions=10, colors=0x444444/0x888888
scene.add(helper);
```

### HemisphereLightHelper

Visualizes a HemisphereLight.

```javascript
const helper = new THREE.HemisphereLightHelper(light, sphereSize, colorHex, colorGround);
```

### PlaneHelper

Visualizes a Plane.

```javascript
const helper = new THREE.PlaneHelper(plane, size, color);
```

### PointLightHelper

Visualizes a PointLight's position and range.

```javascript
const helper = new THREE.PointLightHelper(light, sphereSize, color);
```

### PolarGridHelper

Shows a polar grid (circular).

```javascript
const helper = new THREE.PolarGridHelper(radius, sectors, rings, divisions, color1, color2);
```

### SkeletonHelper

Shows bones of a skeleton as lines.

```javascript
const helper = new THREE.SkeletonHelper(skinnedMesh);
scene.add(helper);
```

### SpotLightHelper

Visualizes a SpotLight's cone and direction.

```javascript
const helper = new THREE.SpotLightHelper(light, color);
helper.update(); // Call when light changes
```

### ArrowHelper

Shows an arrow from one point to another.

```javascript
const helper = new THREE.ArrowHelper(dir, origin, length, color, headLength, headWidth);
```

### FaceNormalsHelper

Shows face normals of a geometry.

```javascript
const helper = new THREE.FaceNormalsHelper(mesh, size, color, linewidth);
```

### VertexNormalsHelper

Shows vertex normals of a geometry.

```javascript
const helper = new THREE.VertexNormalsHelper(mesh, size, color, linewidth);
```

### VertexTangentsHelper

Shows vertex tangents of a geometry.

```javascript
const helper = new THREE.VertexTangentsHelper(mesh, size, color, linewidth);
```

### RectAreaLightHelper

Visualizes a RectAreaLight.

```javascript
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
const helper = new RectAreaLightHelper(light, color);
```

### LightProbeHelper

Visualizes a LightProbe.

### HemisphereLightHelper

Visualizes a HemisphereLight.

---

## Helper Tips

- **Performance:** Remove helpers in production. They add draw calls
- **Update:** Call `.update()` on helpers when the tracked object changes
- **Colors:** Default colors are usually yellow or white. Customize via constructor
- **Disposal:** Call `.dispose()` on helpers that have geometries/materials when done

---

## Additional Core Classes

### GLBufferAttribute

Wraps a WebGLBuffer directly, bypassing Three.js buffer management. For advanced use cases with custom WebGL code.

**Constructor:** `new GLBufferAttribute(buffer, type, itemSize, elementCount, normalized)`

**Properties:**
- `buffer: WebGLBuffer` — The raw WebGL buffer
- `type: Integer` — WebGL data type (e.g., `gl.FLOAT`)
- `itemSize: Integer` — Components per vertex
- `elementCount: Integer` — Total number of elements
- `version: Integer` — Increment to trigger buffer update
- `normalized: Boolean` — Normalize integer data

### InstancedBufferGeometry

Extends `BufferGeometry` with per-instance data support. Used with `InstancedMesh`.

**Constructor:** `new InstancedBufferGeometry()`

**Properties:**
- `instanceCount: Integer` — Number of instances (default `Infinity`)

### InstancedInterleavedBuffer

Extends `InterleavedBuffer` for instanced data. Has `meshPerAttribute` property controlling how many instances share a value.

### InterleavedBuffer

Stores interleaved vertex attribute data in a single typed array.

**Constructor:** `new InterleavedBuffer(array, stride)`

**Properties:**
- `array: TypedArray` — Interleaved data
- `stride: Integer` — Items per vertex
- `count: Integer` — Number of vertices
- `usage: Integer` — Buffer usage (default `StaticDrawUsage`)
- `updateRange: { start, count }` — Partial update range

**Methods:**
- `clone()`, `setValues(index, array)`, `copyAt(index1, attribute, index2)`

### InterleavedBufferAttribute

Wraps an `InterleavedBuffer` as an attribute for `BufferGeometry.setAttribute()`.

**Constructor:** `new InterleavedBufferAttribute(interleavedBuffer, itemSize, offset, normalized)`

**Properties:**
- `data: InterleavedBuffer` — The underlying buffer
- `offset: Integer` — Offset within the stride
- `itemSize: Integer`, `count: Integer`, `normalized: Boolean`

### Uniform

Container for shader uniform values.

**Constructor:** `new Uniform(value)`

**Properties:**
- `value: Any` — The uniform value (number, vector, array, texture, etc.)

### DataUtils

Utility functions for data encoding/decoding.

**Methods:**
- `DataUtils.toHalfFloat(val)` — Convert float to half-float (16-bit)
- `DataUtils.fromHalfFloat(val)` — Convert half-float to float

### Earcut

Polygon triangulation library (Earcut). Used internally by `ShapeGeometry` and `ExtrudeGeometry`.

**Methods:**
- `Earcut.triangulate(data, holeIndices, dimensions=2)` — Returns triangle indices

### ShapeUtils

Utility functions for 2D shape operations.

**Methods:**
- `ShapeUtils.area(contour)` — Compute polygon area
- `ShapeUtils.isClockWise(pts)` — Check winding order
- `ShapeUtils.triangulateShape(contour, holes)` — Triangulate a shape with holes
