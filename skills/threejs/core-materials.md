# Core — Materials

## Material (Abstract Base)

Abstract base class for materials. Describes object appearance. Renderer-independent.

```javascript
const material = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  metalness: 0.5,
  roughness: 0.8,
  transparent: true,
  opacity: 0.8
});
```

**Constructor:** `Material()` — No arguments (use subclass constructors)

### Common Properties (inherited by all materials)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `alphaTest` | Float | 0 | Discard fragments with opacity below this |
| `alphaToCoverage` | Boolean | false | Alpha to coverage (requires MSAA) |
| `blendDst` | Integer | OneMinusSrcAlphaFactor | Blending destination factor |
| `blendDstAlpha` | Integer | null | Separate alpha blend destination |
| `blendEquation` | Integer | AddEquation | Blending equation |
| `blendEquationAlpha` | Integer | null | Separate alpha blend equation |
| `blending` | Blending | NormalBlending | Blending mode |
| `blendSrc` | Integer | SrcAlphaFactor | Blending source factor |
| `blendSrcAlpha` | Integer | null | Separate alpha blend source |
| `clipIntersection` | Boolean | false | Clip intersection instead of union |
| `clippingPlanes` | Array | null | User-defined clipping planes |
| `clipShadows` | Boolean | false | Clip shadows by clipping planes |
| `colorWrite` | Boolean | true | Whether to write color |
| `defines` | Object | undefined | Custom shader defines |
| `depthFunc` | Integer | LessEqualDepth | Depth test function |
| `depthTest` | Boolean | true | Enable depth testing |
| `depthWrite` | Boolean | true | Write to depth buffer |
| `isMaterial` | Boolean | true | Read-only flag |
| `name` | String | "" | Material name |
| `needsUpdate` | Boolean | false | Force shader recompilation |
| `opacity` | Float | 1.0 | Transparency (0-1). Requires `transparent: true` |
| `polygonOffset` | Boolean | false | Polygon offset for z-fighting |
| `polygonOffsetFactor` | Integer | 0 | Polygon offset factor |
| `polygonOffsetUnits` | Integer | 0 | Polygon offset units |
| `precision` | String | null | Override shader precision |
| `premultipliedAlpha` | Boolean | false | Premultiplied alpha |
| `dithering` | Boolean | false | Dithering to reduce banding |
| `shadowSide` | Integer | null | Which side casts shadows |
| `side` | Integer | FrontSide | FrontSide, BackSide, DoubleSide |
| `toneMapped` | Boolean | true | Apply tone mapping |
| `transparent` | Boolean | false | Transparent material |
| `vertexColors` | Boolean | false | Use vertex colors |
| `visible` | Boolean | true | Material visible |
| `userData` | Object | {} | Custom data |

### Common Methods
- `clone()` — Return new material with same parameters
- `copy(material)` — Copy parameters from another material
- `dispose()` — Free GPU resources
- `onBeforeCompile(shader, renderer)` — Modify shader before compilation
- `customProgramCacheKey()` — Cache key for onBeforeCompile variants
- `setValues(values)` — Set multiple properties from object
- `toJSON(meta)` — Serialize to JSON

### Blending Modes
- `NoBlending` — No blending
- `NormalBlending` — Default alpha blending
- `AdditiveBlending` — Additive
- `SubtractiveBlending` — Subtractive
- `MultiplyBlending` — Multiply
- `CustomBlending` — Custom blend factors/equation

### Side Constants
- `FrontSide` — Render front faces only (default)
- `BackSide` — Render back faces only
- `DoubleSide` — Render both sides
- `TwoPassDoubleSide` — Two-pass double side

---

## MeshBasicMaterial

Simple shaded (flat or wireframe) material. **Not affected by lights.**

```javascript
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
```

**Properties:**
- `color: Color` — Default white (0xffffff)
- `map: Texture` — Color map
- `alphaMap: Texture` — Alpha map (grayscale)
- `aoMap: Texture` — Ambient occlusion map (red channel)
- `aoMapIntensity: Float` — Default 1
- `envMap: Texture` — Environment map
- `combine: Integer` — `MultiplyOperation` (default), `MixOperation`, `AddOperation`
- `reflectivity: Float` — Default 1
- `refractionRatio: Float` — Default 0.98
- `lightMap: Texture` — Light map
- `lightMapIntensity: Float` — Default 1
- `specularMap: Texture` — Specular map
- `fog: Boolean` — Default true
- `wireframe: Boolean` — Default false
- `wireframeLinecap: String` — "round" (default), "butt", "square"
- `wireframeLinejoin: String` — "round" (default), "bevel", "miter"
- `wireframeLinewidth: Float` — Default 1 (always 1 in WebGL)

---

## MeshStandardMaterial

PBR material using Metallic-Roughness workflow. Most common material for realistic rendering.

```javascript
const material = new THREE.MeshStandardMaterial({
  color: 0xaaaaaa,
  metalness: 0.5,
  roughness: 0.5,
  envMap: environmentMap
});
```

**Properties (in addition to common):**
- `color: Color` — Diffuse color. Default white
- `map: Texture` — Color/diffuse map
- `alphaMap: Texture` — Alpha map
- `aoMap: Texture` — Ambient occlusion map (red channel, requires 2nd UV set)
- `aoMapIntensity: Float` — Default 1
- `bumpMap: Texture` — Bump map (grayscale)
- `bumpScale: Float` — Default 1
- `displacementMap: Texture` — Displacement map (affects vertex positions)
- `displacementScale: Float` — Default 1
- `displacementBias: Float` — Default 0
- `emissive: Color` — Emissive color. Default black
- `emissiveMap: Texture` — Emissive map
- `emissiveIntensity: Float` — Default 1
- `envMap: Texture` — Environment map (use PMREMGenerator)
- `envMapIntensity: Float` — Default 1
- `flatShading: Boolean` — Default false
- `fog: Boolean` — Default true
- `lightMap: Texture` — Light map
- `lightMapIntensity: Float` — Default 1
- `metalness: Float` — 0 (non-metal) to 1 (metal). Default 0
- `metalnessMap: Texture` — Metalness map (blue channel)
- `normalMap: Texture` — Normal map
- `normalMapType: Integer` — `TangentSpaceNormalMap` (default), `ObjectSpaceNormalMap`
- `normalScale: Vector2` — Default (1, 1)
- `roughness: Float` — 0 (smooth) to 1 (rough). Default 1
- `roughnessMap: Texture` — Roughness map (green channel)

---

## MeshPhysicalMaterial

Extends `MeshStandardMaterial` with advanced PBR features.

```javascript
const material = new THREE.MeshPhysicalMaterial({
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
  transmission: 0.8,
  thickness: 0.5,
  ior: 1.5
});
```

**Additional Properties:**
- `clearcoat: Float` — Clear coat layer (0-1). Default 0
- `clearcoatMap: Texture` — Clear coat strength map
- `clearcoatRoughness: Float` — Default 0
- `clearcoatRoughnessMap: Texture` — Clear coat roughness map
- `clearcoatNormalScale: Vector2` — Default (1, 1)
- `clearcoatNormalMap: Texture` — Clear coat normal map
- `ior: Float` — Index of refraction (1-2.333). Default 1.5
- `reflectivity: Float` — Reflectivity (0-1). Default 0.5
- `sheen: Float` — Sheen layer (0-1). Default 0
- `sheenColor: Color` — Sheen color. Default white
- `sheenRoughness: Float` — Default 1
- `sheenRoughnessMap: Texture`
- `sheenColorMap: Texture`
- `specularIntensity: Float` — Default 1
- `specularColor: Color` — Default white
- `specularColorMap: Texture`
- `specularIntensityMap: Texture`
- `transmission: Float` — Light transmission (0-1). Default 0
- `transmissionMap: Texture` — Transmission map
- `thickness: Float` — Volume thickness. Default 0
- `attenuationDistance: Float` — Default Infinity
- `attenuationColor: Color` — Default white
- `iridescence: Float` — Iridescence (0-1). Default 0
- `iridescenceIOR: Float` — Default 1.3
- `iridescenceThicknessRange: Array` — `[100, 400]` (default)
- `iridescenceMap: Texture`
- `iridescenceThicknessMap: Texture`
- `anisotropy: Float` — Anisotropy (-1 to 1). Default 0
- `anisotropyRotation: Float` — Default 0
- `anisotropyMap: Texture`

---

## MeshLambertMaterial

Non-PBR material with Lambertian diffuse shading. Cheaper than Standard/Physical. Does not support specular highlights.

**Properties:**
- `color: Color`, `map`, `alphaMap`, `aoMap`, `aoMapIntensity`, `bumpMap`, `bumpScale`, `displacementMap`, `displacementScale`, `displacementBias`, `emissive`, `emissiveMap`, `emissiveIntensity`, `envMap`, `envMapIntensity`, `flatShading`, `fog`, `lightMap`, `lightMapIntensity`, `normalMap`, `normalMapType`, `normalScale`, `specularMap`, `wireframe`, `wireframeLinecap`, `wireframeLinejoin`, `wireframeLinewidth`

---

## MeshPhongMaterial

Non-PBR material with Phong specular shading. Shinier than Lambert, cheaper than Standard.

**Properties (in addition to Lambert):**
- `specular: Color` — Specular color. Default `0x111111`
- `shininess: Float` — Shininess. Default 30
- `specularMap: Texture`

---

## MeshNormalMaterial

Maps normals to RGB colors. Useful for debugging.

```javascript
const material = new THREE.MeshNormalMaterial({ flatShading: true });
```

**Properties:**
- `bumpMap`, `bumpScale`, `normalMap`, `normalMapType`, `normalScale`
- `flatShading: Boolean` — Default false
- `wireframe: Boolean` — Default false
- `transparent: Boolean` — Default false
- `opacity: Float` — Default 1

---

## MeshMatcapMaterial

Uses a Matcap (material capture) texture for lighting. No lights needed.

**Properties:**
- `color: Color`, `matcap: Texture`, `map`, `alphaMap`, `bumpMap`, `bumpScale`, `displacementMap`, `displacementScale`, `displacementBias`, `normalMap`, `normalMapType`, `normalScale`, `flatShading`, `fog`, `wireframe`, `wireframeLinecap`, `wireframeLinejoin`, `wireframeLinewidth`

---

## MeshToonMaterial

Cartoon/cel-shaded material. Requires lights.

**Properties:**
- `color: Color`, `map`, `gradientMap: Texture`, `alphaMap`, `aoMap`, `aoMapIntensity`, `bumpMap`, `bumpScale`, `displacementMap`, `displacementScale`, `displacementBias`, `emissive`, `emissiveMap`, `emissiveIntensity`, `lightMap`, `lightMapIntensity`, `normalMap`, `normalMapType`, `normalScale`, `fog`, `wireframe`, `wireframeLinecap`, `wireframeLinejoin`, `wireframeLinewidth`

---

## MeshDepthMaterial

Renders depth as grayscale. Used for shadow maps and depth pre-pass.

**Properties:**
- `depthPacking: Integer` — `BasicDepthPacking` (default), `RGBADepthPacking`
- `map: Texture`, `alphaMap`, `displacementMap`, `displacementScale`, `displacementBias`, `fog`, `wireframe`, `wireframeLinecap`, `wireframeLinejoin`, `wireframeLinewidth`

---

## MeshDistanceMaterial

Used internally for PointLight shadow maps.

**Properties:**
- `map`, `alphaMap`, `displacementMap`, `displacementScale`, `displacementBias`, `fog`, `referencePosition: Vector3`, `nearDistance: Float`, `farDistance: Float`

---

## ShaderMaterial / RawShaderMaterial

Custom shaders written in GLSL.

```javascript
const material = new THREE.ShaderMaterial({
  uniforms: { time: { value: 0 } },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    varying vec2 vUv;
    void main() {
      gl_FragColor = vec4(vUv, 0.5 + 0.5 * sin(time), 1.0);
    }
  `
});
```

**ShaderMaterial Properties:**
- `uniforms: Object` — Uniform variables
- `vertexShader: String` — GLSL vertex shader
- `fragmentShader: String` — GLSL fragment shader
- `linewidth: Float` — Line width (always 1 in WebGL)
- `wireframe: Boolean` — Default false
- `wireframeLinewidth: Float` — Default 1
- `lights: Boolean` — Whether shader uses lights. Default false
- `clipping: Boolean` — Whether shader uses clipping. Default false
- `fog: Boolean` — Whether shader supports fog. Default false
- `extensions` — Object with WebGL extension toggles
- `glslVersion: String` — `GLSL1` (default), `GLSL3`
- `defines: Object` — Shader defines
- `attributes: Object` — Custom attributes (deprecated, use BufferGeometry)

**RawShaderMaterial:** Same as ShaderMaterial but does not prepend built-in uniforms/attributes. You must declare everything yourself.

---

## LineBasicMaterial

For `Line` and `LineSegments`.

**Properties:**
- `color: Color` — Default white
- `linewidth: Float` — Default 1 (always 1 in WebGL)
- `linecap: String` — "round" (default), "butt", "square"
- `linejoin: String` — "round" (default), "bevel", "miter"
- `map: Texture`, `fog: Boolean`, `blending`, `transparent`, `opacity`

---

## LineDashedMaterial

For dashed lines. Requires `computeLineDistances()` on the line.

**Properties (in addition to LineBasicMaterial):**
- `scale: Float` — Default 1
- `dashSize: Float` — Default 3
- `gapSize: Float` — Default 1

---

## PointsMaterial

For `Points` objects.

**Properties:**
- `color: Color` — Default white
- `map: Texture` — Point texture
- `alphaMap: Texture`
- `size: Float` — Point size. Default 1
- `sizeAttenuation: Boolean` — Size decreases with distance. Default true
- `fog: Boolean` — Default true
- `blending`, `transparent`, `opacity`, `vertexColors`, `depthTest`, `depthWrite`

---

## SpriteMaterial

For `Sprite` objects.

**Properties:**
- `color: Color` — Default white
- `map: Texture` — Sprite texture
- `alphaMap: Texture`
- `rotation: Float` — Rotation in radians. Default 0
- `sizeAttenuation: Boolean` — Default true
- `transparent: Boolean` — Default true
- `fog: Boolean` — Default true
- `blending`, `opacity`, `depthTest`, `depthWrite`

---

## ShadowMaterial

Invisible material that receives shadows. Used for shadow-only rendering.

**Properties:**
- `color: Color` — Shadow color. Default black
- `transparent: Boolean` — Default true
- `opacity: Float` — Default 0.5
- `fog: Boolean` — Default true

---

## Material Tips

- **PBR workflow:** Use `MeshStandardMaterial` or `MeshPhysicalMaterial` with an environment map for best results
- **Performance:** `MeshBasicMaterial` is cheapest (no lighting). `MeshLambertMaterial` < `MeshPhongMaterial` < `MeshStandardMaterial` < `MeshPhysicalMaterial`
- **Texture color space:** Set `texture.colorSpace = THREE.SRGBColorSpace` for color maps, leave as `NoColorSpace` for data maps (normal, roughness, metalness, AO)
- **Custom shaders:** Use `ShaderMaterial` for built-in uniforms, `RawShaderMaterial` for full control
- **onBeforeCompile:** Modify built-in material shaders without writing full GLSL
- **Dispose:** Always call `.dispose()` when done with materials. Dispose textures separately
- **needsUpdate:** Set `material.needsUpdate = true` when changing shader-affecting properties (like adding/removing textures)
