# Core — Renderers, Scenes & Textures

## WebGLRenderer

The WebGL renderer displays scenes using WebGL. This is the primary renderer for Three.js.

```javascript
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
document.body.appendChild(renderer.domElement);
```

**Constructor:** `WebGLRenderer(parameters)` — All parameters optional

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `canvas` | DOMElement | new canvas | Canvas for output |
| `context` | WebGLRenderingContext | null | Existing WebGL context |
| `precision` | String | "highp" | Shader precision: "highp", "mediump", "lowp" |
| `alpha` | Boolean | false | Transparent canvas |
| `premultipliedAlpha` | Boolean | true | Premultiplied alpha |
| `antialias` | Boolean | false | MSAA antialiasing |
| `stencil` | Boolean | true | Stencil buffer |
| `preserveDrawingBuffer` | Boolean | false | Preserve buffer for screenshots |
| `powerPreference` | String | "default" | "high-performance", "low-power" |
| `failIfMajorPerformanceCaveat` | Boolean | false | Fail on software rendering |
| `depth` | Boolean | true | Depth buffer |
| `logarithmicDepthBuffer` | Boolean | false | Log depth buffer (large scale ranges) |

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `autoClear` | Boolean | true | Auto-clear before render |
| `autoClearColor` | Boolean | true | Clear color buffer |
| `autoClearDepth` | Boolean | true | Clear depth buffer |
| `autoClearStencil` | Boolean | true | Clear stencil buffer |
| `debug.checkShaderErrors` | Boolean | true | Check shader compilation errors |
| `capabilities` | Object | — | GPU capabilities (maxTextureSize, isWebGL2, etc.) |
| `clippingPlanes` | Array | `[]` | Global clipping planes |
| `domElement` | DOMElement | — | Output canvas |
| `extensions` | Object | — | WebGL extension checker |
| `info` | Object | — | Render statistics (calls, triangles, memory) |
| `localClippingEnabled` | Boolean | false | Enable object-level clipping |
| `outputColorSpace` | String | SRGBColorSpace | Output color space |
| `shadowMap` | Object | — | Shadow map config |
| `shadowMap.enabled` | Boolean | false | Enable shadows |
| `shadowMap.type` | Constant | PCFShadowMap | Shadow map type |
| `sortObjects` | Boolean | true | Sort objects before render |
| `toneMapping` | Constant | NoToneMapping | Tone mapping mode |
| `toneMappingExposure` | Number | 1 | Exposure level |
| `xr` | WebXRManager | — | WebXR interface |

### Methods

**Rendering:**
- `render(scene, camera)` — Render a scene with a camera
- `compile(scene, camera)` — Precompile shaders
- `setAnimationLoop(callback)` — Set render loop callback (use for WebXR)
- `renderBufferDirect(camera, scene, geometry, material, object, group)` — Low-level render

**Clearing:**
- `clear(color, depth, stencil)` — Clear buffers (defaults true)
- `clearColor()` — Clear color only
- `clearDepth()` — Clear depth only
- `clearStencil()` — Clear stencil only

**Size & Viewport:**
- `setSize(width, height, updateStyle)` — Resize canvas
- `setPixelRatio(value)` — Set device pixel ratio
- `getPixelRatio()` — Get pixel ratio
- `getSize(target)` — Get canvas size
- `getDrawingBufferSize(target)` — Get drawing buffer size
- `setViewport(x, y, width, height)` or `setViewport(vector)` — Set viewport
- `getViewport(target)` — Get viewport
- `setScissor(x, y, width, height)` — Set scissor region
- `setScissorTest(boolean)` — Enable scissor test

**Render Target:**
- `setRenderTarget(renderTarget, activeCubeFace, activeMipmapLevel)` — Set render target (null = canvas)
- `getRenderTarget()` — Get current render target
- `readRenderTargetPixels(renderTarget, x, y, width, height, buffer, activeCubeFaceIndex)` — Read pixels

**Color:**
- `setClearColor(color, alpha)` — Set clear color
- `getClearColor(target)` — Get clear color
- `setClearAlpha(alpha)` — Set clear alpha
- `getClearAlpha()` — Get clear alpha

**Texture:**
- `initTexture(texture)` — Preload texture to GPU
- `copyFramebufferToTexture(position, texture, level)` — Copy framebuffer to texture
- `copyTextureToTexture(position, srcTexture, dstTexture, level)` — Copy texture to texture
- `copyTextureToTexture3D(sourceBox, position, srcTexture, dstTexture, level)` — Copy to 3D texture

**Context:**
- `getContext()` — Get WebGL context
- `getContextAttributes()` — Get context attributes
- `forceContextLoss()` — Simulate context loss
- `forceContextRestore()` — Simulate context restore
- `resetGLState()` — Reset GL state
- `resetState()` — Reset internal state
- `dispose()` — Free GPU resources

**Sorting:**
- `setOpaqueSort(method)` — Custom opaque sort function
- `setTransparentSort(method)` — Custom transparent sort function

---

## WebGPURenderer

WebGPU-based renderer. Modern alternative to WebGLRenderer with compute shader support.

```javascript
const renderer = new THREE.WebGPURenderer({ antialias: true });
await renderer.init();
```

**Constructor:** `WebGPURenderer(parameters)`

**Key differences from WebGLRenderer:**
- Uses WebGPU API instead of WebGL
- Supports compute shaders via TSL
- Node-based material system (TSL)
- `init()` returns a Promise (must await)
- `setAnimationLoop(callback)` — async callback support

---

## Scene

Container for objects, lights, and cameras. Extends `Object3D`.

```javascript
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.environment = environmentTexture;
scene.fog = new THREE.Fog(0x000000, 1, 1000);
```

**Constructor:** `Scene()` — No arguments

**Properties:**
- `background: Object` — `null` (default), `Color`, `Texture`, or `CubeTexture`
- `backgroundBlurriness: Float` — Background blur (0-1). Default 0
- `backgroundIntensity: Float` — Background color attenuation. Default 1
- `environment: Texture` — Environment map for PBR materials. Default null
- `fog: Fog` — Fog instance. Default null
- `isScene: Boolean` — Read-only
- `overrideMaterial: Material` — Force all objects to use this material. Default null

**Methods:**
- `toJSON(meta)` — Serialize to JSON

---

## Fog

Exponential fog — denser with distance. Linear fog with near/far.

```javascript
const fog = new THREE.Fog(0x000000, 1, 1000); // color, near, far
```

**Constructor:** `Fog(color, near, far)`

**Properties:**
- `name: String` — Default ""
- `color: Color` — Fog color
- `near: Float` — Near fog distance. Default 1
- `far: Float` — Far fog distance. Default 1000
- `isFog: Boolean` — Read-only

**Methods:**
- `clone()` — Clone fog
- `toJSON()` — Serialize

## FogExp2

Exponential squared fog — denser with distance.

```javascript
const fog = new THREE.FogExp2(0x000000, 0.02); // color, density
```

**Constructor:** `FogExp2(color, density)`

**Properties:**
- `density: Float` — Fog density. Default 0.00025
- `isFogExp2: Boolean` — Read-only

---

## Texture

Base class for textures. Image data used by materials.

```javascript
const texture = new THREE.Texture(image);
texture.needsUpdate = true;
```

**Constructor:** `Texture(image, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy)`

**Properties:**
- `image: Image` — Image data (HTMLImageElement, HTMLCanvasElement, HTMLVideoElement, etc.)
- `mapping: Number` — `UVMapping` (default), `CubeReflectionMapping`, `CubeRefractionMapping`, `EquirectangularReflectionMapping`, `EquirectangularRefractionMapping`
- `wrapS/wrapT: Number` — `ClampToEdgeWrapping` (default), `RepeatWrapping`, `MirroredRepeatWrapping`
- `magFilter: Number` — `LinearFilter` (default), `NearestFilter`
- `minFilter: Number` — `LinearMipmapLinearFilter` (default), `NearestFilter`, `NearestMipmapNearestFilter`, etc.
- `format: Number` — `RGBAFormat` (default), `RedFormat`, `RGFormat`, etc.
- `type: Number` — `UnsignedByteType` (default), `FloatType`, `HalfFloatType`, etc.
- `anisotropy: Number` — Anisotropic filtering level. Default 1
- `colorSpace: String` — `NoColorSpace` (default), `SRGBColorSpace`, `LinearSRGBColorSpace`
- `matrix: Matrix3` — UV transform matrix
- `matrixAutoUpdate: Boolean` — Default true
- `offset: Vector2` — UV offset. Default (0, 0)
- `repeat: Vector2` — UV repeat. Default (1, 1)
- `center: Vector2` — Rotation center. Default (0.5, 0.5)
- `rotation: Float` — Rotation in radians. Default 0
- `flipY: Boolean` — Default true
- `generateMipmaps: Boolean` — Default true
- `premultiplyAlpha: Boolean` — Default false
- `unpackAlignment: Number` — Default 4
- `needsUpdate: Boolean` — Set true when texture changes
- `onUpdate: Function` — Callback when texture updates
- `isTexture: Boolean` — Read-only

**Methods:**
- `updateMatrix()` — Update UV transform matrix
- `clone()` — Clone texture
- `copy(source)` — Copy from source
- `toJSON(meta)` — Serialize
- `dispose()` — Free GPU resources

### Texture Subclasses

| Class | Description |
|-------|-------------|
| `CanvasTexture` | Texture from a canvas element |
| `CompressedTexture` | GPU-compressed texture (S3TC, ETC, ASTC, etc.) |
| `CubeTexture` | 6-face cube map texture |
| `DataTexture` | Texture from raw data (typed array) |
| `DataArrayTexture` | 2D array texture |
| `Data3DTexture` | 3D volume texture |
| `DepthTexture` | Depth buffer texture |
| `FramebufferTexture` | Framebuffer capture texture |
| `VideoTexture` | Texture from a video element |
| `Source` | Represents a single image source |

---

## WebGLRenderTarget

Off-screen render target. Used for post-processing, reflections, etc.

```javascript
const renderTarget = new THREE.WebGLRenderTarget(width, height, {
  format: THREE.RGBAFormat,
  type: THREE.UnsignedByteType
});
renderer.setRenderTarget(renderTarget);
renderer.render(scene, camera);
renderer.setRenderTarget(null);
```

**Constructor:** `WebGLRenderTarget(width, height, options)`

**Properties:**
- `width/height: Integer` — Dimensions
- `depth: Integer` — Default 1
- `scissor: Vector4` — Scissor region
- `scissorTest: Boolean` — Default false
- `viewport: Vector4` — Viewport region
- `texture: Texture` — Color attachment texture
- `depthBuffer: Boolean` — Default true
- `stencilBuffer: Boolean` — Default false
- `depthTexture: DepthTexture` — Optional depth texture
- `samples: Integer` — MSAA sample count. Default 0

**Methods:**
- `setSize(width, height, depth)` — Resize
- `clone()` — Clone render target
- `copy(source)` — Copy from source
- `dispose()` — Free GPU resources

### WebGLRenderTarget Subclasses
- `WebGLCubeRenderTarget` — Cube map render target (6 faces)
- `WebGL3DRenderTarget` — 3D texture render target
- `WebGLArrayRenderTarget` — 2D array texture render target
- `WebGLMultipleRenderTargets` — Multiple color attachments (MRT)

---

## RenderTarget Tips

- **Read pixels:** Use `renderer.readRenderTargetPixels()` for CPU-side pixel access
- **CubeCamera:** Uses `WebGLCubeRenderTarget` internally for environment maps
- **Post-processing:** `EffectComposer` uses render targets for ping-pong buffers
- **MRT:** `WebGLMultipleRenderTargets` for G-buffer / deferred rendering
- **Depth texture:** Set `depthTexture` for shadow mapping or SSAO

---

## WebGL1Renderer

Legacy renderer for WebGL1-only contexts. Extends `WebGLRenderer`. Use only when WebGL2 is unavailable.

**Constructor:** `new WebGL1Renderer(parameters)` — Same parameters as `WebGLRenderer`

---

## WebXRManager

Manages WebXR (VR/AR) sessions. Access via `renderer.xr`. Not constructed directly.

**Properties:**
- `enabled: Boolean` — Enable XR rendering
- `isPresenting: Boolean` — True when in an XR session
- `camera: ArrayCamera` — XR camera (left/right eyes)
- `controller0/1/2/3` — XR controllers
- `getController(index)` — Get controller
- `getControllerGrip(index)` — Get controller grip
- `getHand(index)` — Get hand input source
- `setReferenceSpaceType(type)` — `'local'`, `'local-floor'`, `'bounded-floor'`, `'unbounded'`
- `setPoseTarget(target)` — Set pose target object
- `setFoveation(value)` — Set foveation level (0-1)
- `getFoveation()` — Get current foveation

**Events:**
- `sessionstart`, `sessionend`

---

## Additional Textures

### CompressedArrayTexture

Extends `CompressedTexture` for compressed texture arrays.

### Data3DTexture

3D texture for volumetric data.

**Constructor:** `new Data3DTexture(data, width, height, depth)`

### DataArrayTexture

2D array texture (texture layers).

**Constructor:** `new DataArrayTexture(data, width, height, depth)`

### FramebufferTexture

Texture created from a framebuffer. Used for post-processing.

**Constructor:** `new FramebufferTexture(width, height)`

### Source

Represents a single image source (HTMLImageElement, HTMLCanvasElement, HTMLVideoElement, etc.). Internal class used by `Texture`.

**Properties:**
- `data: Any` — The image/canvas/video element
- `uuid: String`
- `version: Integer` — Increment to trigger texture upload
- `ready: Boolean`

**Methods:**
- `toDataURL(type)` — Get base64 data URL
