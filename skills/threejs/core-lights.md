# Core — Lights

## Light (Abstract Base)

Extends `Object3D`. Abstract base class for all lights.

**Constructor:** `Light(color, intensity)`
- `color: Integer` — Hex color. Default 0xffffff (white)
- `intensity: Float` — Light strength. Default 1

**Properties:**
- `color: Color` — Light color
- `intensity: Float` — Light intensity
- `isLight: Boolean` — Read-only

**Methods:**
- `dispose()` — Free GPU resources (abstract, implemented by subclasses)
- `copy(source)` — Copy color and intensity
- `toJSON(meta)` — Serialize

---

## AmbientLight

Globally illuminates all objects equally. No direction. Cannot cast shadows.

```javascript
const light = new THREE.AmbientLight(0x404040, 0.5); // soft white, low intensity
scene.add(light);
```

**Properties:**
- `isAmbientLight: Boolean` — Read-only

---

## DirectionalLight

Light from a specific direction. All rays are parallel. Emits from a position toward target. Can cast shadows.

```javascript
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7);
light.target.position.set(0, 0, 0);
scene.add(light);
scene.add(light.target); // target must be added to scene

light.castShadow = true;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 50;
light.shadow.camera.left = -10;
light.shadow.camera.right = 10;
light.shadow.camera.top = 10;
light.shadow.camera.bottom = -10;
```

**Constructor:** `DirectionalLight(color, intensity)`

**Properties:**
- `target: Object3D` — Target object. Default: new `Object3D()` at origin
- `isDirectionalLight: Boolean` — Read-only
- `shadow: DirectionalLightShadow` — Shadow configuration

**Shadow Properties:**
- `shadow.mapSize: Vector2` — Shadow map resolution. Default (512, 512)
- `shadow.camera: OrthographicCamera` — Shadow camera (orthographic)
- `shadow.bias: Float` — Shadow bias. Default 0
- `shadow.normalBias: Float` — Normal bias to reduce acne. Default 0
- `shadow.radius: Float` — Shadow blur radius. Default 1

---

## PointLight

Light emitted from a single point in all directions. Can cast shadows.

```javascript
const light = new THREE.PointLight(0xff0000, 1, 100);
light.position.set(50, 50, 50);
light.castShadow = true;
```

**Constructor:** `PointLight(color, intensity, distance, decay)`

**Properties:**
- `distance: Float` — Max range (0 = infinite). Default 0
- `decay: Float` — Physical light decay (0 = none, 1 = linear, 2 = physical inverse-square). Default 2
- `power: Float` — Light power in lumens (alternative to intensity)
- `shadow: PointLightShadow` — Shadow configuration
- `isPointLight: Boolean` — Read-only

---

## SpotLight

Light from a point in a specific direction with a cone shape. Can cast shadows.

```javascript
const light = new THREE.SpotLight(0xffffff, 1, 100, Math.PI / 6, 0.5, 1);
light.position.set(0, 20, 0);
light.target.position.set(0, 0, 0);
scene.add(light);
scene.add(light.target);
```

**Constructor:** `SpotLight(color, intensity, distance, angle, penumbra, decay)`

**Properties:**
- `angle: Float` — Spot cone angle (radians, max Math.PI/2). Default Math.PI/3
- `penumbra: Float` — Edge softness (0-1). Default 0
- `distance: Float` — Max range. Default 0 (infinite)
- `decay: Float` — Light decay. Default 2
- `power: Float` — Power in lumens
- `target: Object3D` — Aim target
- `shadow: SpotLightShadow` — Shadow configuration
- `isSpotLight: Boolean` — Read-only

---

## HemisphereLight

Light from above (sky) and below (ground). No shadows.

```javascript
const light = new THREE.HemisphereLight(0x88ccff, 0x443322, 0.5);
scene.add(light);
```

**Constructor:** `HemisphereLight(skyColor, groundColor, intensity)`

**Properties:**
- `color: Color` — Sky color (top hemisphere)
- `groundColor: Color` — Ground color (bottom hemisphere)
- `position: Vector3` — Default (0, 1, 0) (above)
- `isHemisphereLight: Boolean` — Read-only

---

## RectAreaLight

Light emitted from a rectangular area. No shadows. Requires `RectAreaLightUniformsLib` init.

```javascript
const light = new THREE.RectAreaLight(0xffffff, 5, 10, 10);
light.position.set(0, 5, 0);
light.lookAt(0, 0, 0);
```

**Constructor:** `RectAreaLight(color, intensity, width, height)`

**Properties:**
- `width: Float` — Light width. Default 10
- `height: Float` — Light height. Default 10
- `power: Float` — Power in lumens
- `isRectAreaLight: Boolean` — Read-only

---

## LightProbe

Light probe for image-based lighting (IBL). Uses spherical harmonics.

```javascript
const lightProbe = new THREE.LightProbe(three.SphericalHarmonics3.fromArray(coefficients), intensity);
```

**Constructor:** `LightProbe(sh, intensity)`

**Properties:**
- `sh: SphericalHarmonics3` — Spherical harmonics coefficients
- `isLightProbe: Boolean` — Read-only

---

## SpotLight / PointLight / DirectionalLight Shadow Properties

All shadow-casting lights share these via `light.shadow`:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mapSize` | Vector2 | (512, 512) | Shadow map resolution |
| `camera` | Camera | varies | Shadow camera (Orthographic for Directional, Perspective for Spot/Point) |
| `bias` | Float | 0 | Shadow depth bias |
| `normalBias` | Float | 0 | Normal bias to reduce shadow acne |
| `radius` | Float | 1 | Shadow blur (PCFSoft only) |
| `blurSamples` | Integer | 8 | VSM blur samples |

---

## Light Tips

- **Intensity units:** In physically correct mode (default since r155), intensity depends on light type. Directional/Spot/Hemisphere/Ambient use direct intensity. Point/Spot lights use candela (intensity) with decay
- **Shadows:** Only DirectionalLight, PointLight, and SpotLight cast shadows. Must enable `renderer.shadowMap.enabled = true` and `light.castShadow = true`
- **Shadow quality:** Increase `shadow.mapSize` (e.g., 2048x2048). Use `PCFSoftShadowMap` or `VSMShadowMap` for softer shadows
- **Shadow acne:** Increase `shadow.normalBias` or `shadow.bias` slightly
- **Performance:** Fewer lights = better. AmbientLight + 1-2 directional/spot lights is typical
- **Environment maps:** Use `PMREMGenerator` to create environment maps from equirectangular/cube textures for PBR
- **Decay:** Use `decay: 2` (physical inverse-square) with appropriate `intensity` and `distance` for realistic falloff

---

## Light Probes

### AmbientLightProbe

Extends `Light`. Provides ambient lighting from a spherical harmonics representation.

**Constructor:** `new AmbientLightProbe(color, intensity)`

### HemisphereLightProbe

Extends `Light`. Provides hemisphere lighting from two spherical harmonics representations (sky/ground).

**Constructor:** `new HemisphereLightProbe(skyColor, groundColor, intensity)`

---

## Lights / Shadows

### LightShadow

Base class for all shadow types. Not used directly — used by `DirectionalLightShadow`, `PointLightShadow`, `SpotLightShadow`.

**Constructor:** `new LightShadow(camera)`

**Properties:**
- `camera: Camera` — Shadow camera (OrthographicCamera for DirectionalLight, PerspectiveCamera for PointLight/SpotLight)
- `bias: Float` — Shadow depth bias (default 0)
- `normalBias: Float` — Normal bias to reduce shadow acne (default 0)
- `radius: Float` — Shadow blur radius (PCFSoftShadowMap only, default 1)
- `mapSize: Vector2` — Shadow map resolution (default 512x512)
- `map: WebGLRenderTarget` — Shadow map texture
- `matrix: Matrix4` — Shadow camera matrix
- `blurSamples: Integer` — VSM blur samples (default 8)

**Methods:**
- `getFrustum()` — Get shadow camera frustum
- `updateMatrices(light)` — Update shadow matrices
- `copy(source)`, `clone()`

### DirectionalLightShadow

Extends `LightShadow` with an `OrthographicCamera`. Used by `DirectionalLight`.

### PointLightShadow

Extends `LightShadow` with a `PerspectiveCamera`. Used by `PointLight`. Has 6 cube faces for omnidirectional shadows.

### SpotLightShadow

Extends `LightShadow` with a `PerspectiveCamera`. Used by `SpotLight`.
