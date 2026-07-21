# Global Constants & Functions

## Constants

### Color Spaces
- `NoColorSpace` — No color space
- `SRGBColorSpace` — sRGB color space (display)
- `LinearSRGBColorSpace` — Linear sRGB (computation)
- `LinearDisplayP3ColorSpace` — Linear Display P3
- `DisplayP3ColorSpace` — Display P3
- `ACESFilmicToneMapping` — ACES filmic tone mapping curve

### Coordinate Systems
- `WebGLCoordinateSystem` — Right-handed (WebGL default)
- `WebGPUCoordinateSystem` — Left-handed depth (WebGPU)

### Blending Modes
- `NoBlending` — No blending
- `NormalBlending` — Standard alpha blending
- `AdditiveBlending` — Additive blending
- `SubtractiveBlending` — Subtractive blending
- `MultiplyBlending` — Multiply blending
- `CustomBlending` — Custom blend factors

### Blending Factors
- `ZeroFactor`, `OneFactor`
- `SrcColorFactor`, `OneMinusSrcColorFactor`
- `SrcAlphaFactor`, `OneMinusSrcAlphaFactor`
- `DstAlphaFactor`, `OneMinusDstAlphaFactor`
- `DstColorFactor`, `OneMinusDstColorFactor`
- `SrcAlphaSaturateFactor`
- `ConstantColorFactor`, `OneMinusConstantColorFactor`
- `ConstantAlphaFactor`, `OneMinusConstantAlphaFactor`

### Blending Equations
- `AddEquation` — Default
- `SubtractEquation`
- `ReverseSubtractEquation`
- `MinEquation`
- `MaxEquation`

### Side
- `FrontSide` — Render front faces only
- `BackSide` — Render back faces only
- `DoubleSide` — Render both sides
- `TwoPassDoubleSide` — Two-pass double side

### Depth Modes
- `NeverDepth` — Never pass depth test
- `AlwaysDepth` — Always pass
- `LessDepth` — Pass if less
- `LessEqualDepth` — Default, pass if less or equal
- `EqualDepth` — Pass if equal
- `GreaterEqualDepth` — Pass if greater or equal
- `GreaterDepth` — Pass if greater
- `NotEqualDepth` — Pass if not equal

### Stencil Functions
- `NeverStencilFunc`, `AlwaysStencilFunc`, `LessStencilFunc`, `LessEqualStencilFunc`, `EqualStencilFunc`, `GreaterEqualStencilFunc`, `GreaterStencilFunc`, `NotEqualStencilFunc`

### Stencil Operations
- `ZeroStencilOp`, `KeepStencilOp`, `ReplaceStencilOp`, `IncrementStencilOp`, `DecrementStencilOp`, `IncrementWrapStencilOp`, `DecrementWrapStencilOp`, `InvertStencilOp`

### Texture Mapping Modes
- `UVMapping` — Default UV mapping
- `CubeReflectionMapping` — Cube reflection
- `CubeRefractionMapping` — Cube refraction
- `EquirectangularReflectionMapping` — Equirect reflection
- `EquirectangularRefractionMapping` — Equirect refraction
- `CubeUVReflectionMapping` — Cube UV reflection

### Wrapping Modes
- `ClampToEdgeWrapping` — Default, clamp to edge
- `RepeatWrapping` — Repeat texture
- `MirroredRepeatWrapping` — Mirror and repeat

### Filters
- `NearestFilter` — Nearest pixel
- `NearestMipmapNearestFilter`
- `NearestMipmapLinearFilter`
- `LinearFilter` — Bilinear
- `LinearMipmapNearestFilter`
- `LinearMipmapLinearFilter` — Trilinear (default minFilter)

### Texture Formats
- `AlphaFormat`, `RedFormat`, `RedIntegerFormat`, `RGFormat`, `RGIntegerFormat`
- `RGBAFormat` — Default
- `RGBAIntegerFormat`, `LuminanceFormat`, `LuminanceAlphaFormat`
- `DepthFormat`, `DepthStencilFormat`
- `SRGBFormat` (deprecated)

### Data Types
- `UnsignedByteType` — Default
- `ByteType`, `ShortType`, `UnsignedShortType`, `UnsignedShort4444Type`, `UnsignedShort5551Type`, `UnsignedShort565Type`
- `IntType`, `UnsignedIntType`, `UnsignedInt248Type`
- `HalfFloatType`, `FloatType`
- `UnsignedInt5999Type`

### Pixel Types (Compressed)
- `RGB_S3TC_DXT1_Format`, `RGBA_S3TC_DXT1_Format`, `RGBA_S3TC_DXT3_Format`, `RGBA_S3TC_DXT5_Format`
- `RGB_PVRTC_4BPPV1_Format`, `RGB_PVRTC_2BPPV1_Format`, `RGBA_PVRTC_4BPPV1_Format`, `RGBA_PVRTC_2BPPV1_Format`
- `RGB_ETC1_Format`, `RGB_ETC2_Format`, `RGBA_ETC2_EAC_Format`
- `RGBA_ASTC_4x4_Format`, `RGBA_ASTC_5x4_Format`, `RGBA_ASTC_5x5_Format`, `RGBA_ASTC_6x5_Format`, `RGBA_ASTC_6x6_Format`, `RGBA_ASTC_8x5_Format`, `RGBA_ASTC_8x6_Format`, `RGBA_ASTC_8x8_Format`, `RGBA_ASTC_10x5_Format`, `RGBA_ASTC_10x6_Format`, `RGBA_ASTC_10x8_Format`, `RGBA_ASTC_10x10_Format`, `RGBA_ASTC_12x10_Format`, `RGBA_ASTC_12x12_Format`
- `RGBA_BPTC_Format`, `RGB_BPTC_SIGNED_Format`, `RGB_BPTC_UNSIGNED_Format`
- `RED_RGTC1_Format`, `SIGNED_RED_RGTC1_Format`, `RED_GREEN_RGTC2_Format`, `SIGNED_RED_GREEN_RGTC2_Format`

### Texture Constants
- `RepeatWrapping`, `ClampToEdgeWrapping`, `MirroredRepeatWrapping`
- `NearestFilter`, `LinearFilter`, `NearestMipmapNearestFilter`, `LinearMipmapNearestFilter`, `NearestMipmapLinearFilter`, `LinearMipmapLinearFilter`
- `UnsignedByteType`, `ByteType`, `ShortType`, `UnsignedShortType`, `IntType`, `UnsignedIntType`, `FloatType`, `HalfFloatType`
- `RGBAFormat`, `RedFormat`, `RGFormat`, `RedIntegerFormat`, `RGIntegerFormat`, `RGBAIntegerFormat`
- `DepthFormat`, `DepthStencilFormat`
- `AlphaFormat`, `LuminanceFormat`, `LuminanceAlphaFormat`

### Shadow Map Types
- `BasicShadowMap` — No filtering
- `PCFShadowMap` — Percentage-closer filtering (default)
- `PCFSoftShadowMap` — PCF with bilinear filtering
- `VSMShadowMap` — Variance shadow maps

### Tone Mapping
- `NoToneMapping` — Default (no tone mapping)
- `LinearToneMapping`
- `ReinhardToneMapping`
- `CineonToneMapping`
- `ACESFilmicToneMapping` — Popular cinematic
- `AgXToneMapping` — AgX (modern, accurate)
- `NeutralToneMapping` — Neutral (Khronos PBR neutral)

### Animation Blend Modes
- `NormalAnimationBlendMode` — Default
- `AdditiveAnimationBlendMode` — Additive

### Interpolation Modes
- `InterpolateDiscrete` — No interpolation
- `InterpolateLinear` — Linear interpolation
- `InterpolateSmooth` — Smooth (Catmull-Rom)

### Loop Modes
- `LoopOnce` — Play once
- `LoopRepeat` — Repeat
- `LoopPingPong` — Alternate forward/backward

### Buffer Usage
- `StaticDrawUsage` — Default, data set once
- `DynamicDrawUsage` — Data changes frequently
- `StreamDrawUsage` — Data set once, used few times

### Normal Map Types
- `TangentSpaceNormalMap` — Default, tangent space normals
- `ObjectSpaceNormalMap` — Object space normals

### Environment Modes
- `PMREMGenerator` — For generating prefiltered env maps

### Comparison Functions
- `NeverCompare`, `LessCompare`, `EqualCompare`, `LessEqualCompare`, `GreaterCompare`, `NotEqualCompare`, `GreaterEqualCompare`, `AlwaysCompare`

### GLSL Versions
- `GLSL1` — GLSL ES 1.0
- `GLSL3` — GLSL ES 3.0

---

## Global Functions

### `REVISION`

String containing the current Three.js revision number (e.g., `"168"`).

### `CylindricalCoordinates`

Alias for `Cylindrical` class.

### `createCanvasElement()`

Creates a canvas element. Used internally.

### `MathUtils`

See `core-math.md` for full MathUtils API.

### `generateUUID()`

Generates a UUID v4 string. Available via `THREE.MathUtils.generateUUID()`.

### `resolveURL(url, path)`

Resolve a URL relative to a path. Used by loaders.

### `decodeText(array)`

Decode a Uint8Array to a string. Used by loaders.

### `extractUrlBase(url)`

Extract the directory portion of a URL.

### `ImageUtils`

- `ImageUtils.crossOrigin` — Default CORS setting for image loading
- `ImageUtils.loadImage(url, onLoad, onError)` — Load an image

### `ShaderChunk`

Object containing built-in GLSL shader chunks. Used by `ShaderMaterial` and internal shaders.

### `ShaderLib`

Object containing built-in shader programs (e.g., `ShaderLib.meshstandard`, `ShaderLib.basic`).

### `UniformsLib`

Object containing reusable uniform definitions (e.g., `UniformsLib.common`, `UniformsLib.lights`).

### `UniformsUtils`

- `UniformsUtils.clone(uniforms)` — Deep clone uniforms object
- `UniformsUtils.merge(uniforms)` — Merge multiple uniforms objects

### `WebGLUtils`

Internal utility class for WebGL context handling.

### `PropertyBinding`

Resolves property paths on objects for animation. See `core-animation-audio.md`.

### `PropertyBinding.parseTrackName(name)`

Parse a track name like `nodes.name.material.opacity` into parts.

### `PropertyBinding.findNode(root, parsedObjectName)`

Find a node by parsed path.

### `ColorManagement`

Color management configuration.

**Properties:**
- `enabled: Boolean` — Default true. Enable/disable color management
- `workingColorSpace: String` — Default `LinearSRGBColorSpace`

**Methods:**
- `convert(color, sourceColorSpace, targetColorSpace)` — Convert color between spaces
- `fromWorkingColorSpace(color, targetColorSpace)` — Convert from working space
- `toWorkingColorSpace(color, sourceColorSpace)` — Convert to working space

### `PMREMGenerator`

Generates prefiltered MIP mapped environment maps for PBR.

```javascript
const pmremGenerator = new THREE.PMREMGenerator(renderer);
const envMap = pmremGenerator.fromScene(scene).texture;
// Or from equirectangular texture:
const envMap = pmremGenerator.fromEquirectangularTexture(equirectTexture).texture;
pmremGenerator.dispose();
```

**Methods:**
- `fromScene(scene, sigma=0, near=0.1, far=100)` — From a scene
- `fromEquirectangularTexture(texture)` — From equirectangular texture
- `fromCubemap(cubeTexture)` — From cube texture
- `compileCubemapShader()` — Pre-compile cubemap shader
- `compileEquirectangularShader()` — Pre-compile equirect shader
- `dispose()` — Free resources

### `Source`

Represents a single image source for textures. Internal class.

### `BrowserPrint`

Debug printing utility. Internal.

### `SequencerScript`

Script sequencer for animation. Internal.
