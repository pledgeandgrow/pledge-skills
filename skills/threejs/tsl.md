# TSL — Three.js Shading Language

TSL is Three.js' node-based shader language. It provides a composable, type-safe API for writing shaders without raw GLSL. Import from `three/tsl`.

```javascript
import { Fn, vec3, float, uv, texture, time, sin, cos, mul, add, positionLocal, normalLocal } from 'three/tsl';
```

## Value Constructors

| Function | Description |
|----------|-------------|
| `float(value)` | Create float node |
| `int(value)` | Create int node |
| `uint(value)` | Create uint node |
| `bool(value)` | Create bool node |
| `vec2(x, y)` | Create vec2 |
| `vec3(x, y, z)` | Create vec3 |
| `vec4(x, y, z, w)` | Create vec4 |
| `mat2(...)`, `mat3(...)`, `mat4(...)` | Create matrices |

## Swizzle & Access

```javascript
const v = vec3(1, 2, 3);
v.x // float(1)
v.xy // vec2(1, 2)
v.xyz // vec3(1, 2, 3)
v.r, v.g, v.b // equivalent to .x, .y, .z
v.rg // equivalent to .xy
```

## Math Functions

### Basic Arithmetic
- `add(a, b)` or `a.add(b)` — Addition
- `sub(a, b)` or `a.sub(b)` — Subtraction
- `mul(a, b)` or `a.mul(b)` — Multiplication
- `div(a, b)` or `a.div(b)` — Division
- `mod(a, b)` — Modulo
- `negate(x)` — Negation
- `oneMinus(x)` — 1 - x
- `reciprocal(x)` — 1 / x
- `abs(x)` — Absolute value
- `sign(x)` — Sign function

### Trigonometric
- `radians(degrees)`, `degrees(radians)`
- `sin(x)`, `cos(x)`, `tan(x)`
- `asin(x)`, `acos(x)`, `atan(x)`, `atan2(y, x)`
- `sinh(x)`, `cosh(x)`, `tanh(x)`

### Exponential
- `pow(x, y)`, `exp(x)`, `exp2(x)`
- `log(x)`, `log2(x)`
- `sqrt(x)`, `inversesqrt(x)`

### Rounding
- `floor(x)`, `ceil(x)`, `round(x)`, `roundEven(x)`
- `fract(x)`, `trunc(x)`
- `sign(x)`

### Interpolation & Clamping
- `mix(a, b, t)` or `lerp(a, b, t)` — Linear interpolation
- `clamp(x, min, max)` — Clamp value
- `saturate(x)` — Clamp to 0-1
- `smoothstep(edge0, edge1, x)` — Smooth step
- `step(edge, x)` — Step function
- `fwidth(x)` — Derivative width
- `smoothstep(edge0, edge1, x)` — Hermite interpolation

### Vector Operations
- `dot(a, b)` — Dot product
- `cross(a, b)` — Cross product
- `normalize(v)` — Normalize vector
- `length(v)` — Vector length
- `lengthSq(v)` — Squared length
- `distance(a, b)` — Distance between points
- `distanceSq(a, b)` — Squared distance

### Matrix Operations
- `transpose(m)` — Matrix transpose
- `inverse(m)` — Matrix inverse
- `determinant(m)` — Matrix determinant
- `mul(a, b)` — Matrix multiplication (also matrix-vector)

### Geometric
- `reflect(I, N)` — Reflect vector
- `refract(I, N, eta)` — Refract vector
- `faceforward(N, I, Nref)` — Face forward

### Comparison & Logic
- `equal(a, b)`, `notEqual(a, b)`
- `lessThan(a, b)`, `lessThanEqual(a, b)`
- `greaterThan(a, b)`, `greaterThanEqual(a, b)`
- `all(x)`, `any(x)`, `not(x)`
- `and(a, b)`, `or(a, b)`, `xor(a, b)`

### Bitwise
- `bitcast(value, toType)` — Reinterpret bits
- `firstBitLSB(x)`, `firstBitMSB(x)` — Find first set bit
- `bitCount(x)` — Count set bits

## Conditionals

```javascript
// Ternary
const result = cond(condition, trueValue, falseValue);

// If/Else chain
const result = If(condition)
  .Then(trueValue)
  .Elseif(anotherCondition, anotherValue)
  .Else(falseValue);

// Switch
const result = switchNode(value, {
  0: caseZeroValue,
  1: caseOneValue,
  default: defaultValue
});
```

## Loops

```javascript
// For loop
Loop({ start: 0, end: 10, type: 'int' }, ({ i }) => {
  sum.add(i);
});

// While loop
While(condition, () => {
  // ...
});

// Loop control
Break();
Continue();
```

## Functions

```javascript
// Basic function
const myFunc = Fn(([x, y]) => {
  return add(x, y);
});

// With layout (for WGSL compatibility)
const myFunc = Fn(([x, y]) => {
  return add(x, y);
}).setLayout({
  name: 'myFunc',
  type: 'float',
  inputs: [
    { name: 'x', type: 'float' },
    { name: 'y', type: 'float' }
  ]
});

// Call function
const result = myFunc(float(1), float(2));
```

## Built-in Variables

### Geometry Attributes
- `positionLocal` — Local space position (vec3)
- `positionWorld` — World space position (vec3)
- `positionView` — View space position (vec3)
- `positionWorldDirection` — World position direction (vec3)
- `normalLocal` — Local space normal (vec3)
- `normalWorld` — World space normal (vec3)
- `normalView` — View space normal (vec3)
- `uv(index=0)` — UV coordinates (vec2)
- `tangentLocal/World/View` — Tangent (vec4, .w = handedness)
- `bitangentLocal/World/View` — Bitangent (vec3)

### Instance & Batch
- `instanceMatrix` — Instance transform matrix
- `instance(index)` — Instance attribute
- `batchId` — BatchedMesh batch ID

### Indices
- `vertexIndex` — Current vertex index
- `instanceIndex` — Current instance index
- `drawIndex` — Current draw call index

### Camera
- `cameraPosition` — Camera world position (vec3)
- `cameraNear` — Camera near plane (float)
- `cameraFar` — Camera far plane (float)
- `cameraProjectionMatrix` — Projection matrix (mat4)
- `cameraProjectionMatrixInverse` — Inverse projection (mat4)
- `cameraViewMatrix` — View matrix (mat4)
- `cameraWorldMatrix` — Camera world matrix (mat4)
- `cameraNormalMatrix` — Camera normal matrix (mat3)

### Model
- `modelMatrix` — Model matrix (mat4)
- `modelViewMatrix` — Model-view matrix (mat4)
- `modelWorldMatrix` — World matrix (mat4)
- `modelWorldMatrixInverse` — Inverse world matrix (mat4)
- `modelNormalMatrix` — Normal matrix (mat3)

### Renderer
- `screenUV` — Screen UV (vec2, 0-1)
- `viewportResolution` — Viewport size (vec2)
- `viewportTopLeft` — Viewport top-left (vec2)
- `viewportBottomLeft` — Viewport bottom-left (vec2)
- `rendererSceneDepth` — Scene depth texture
- `rendererSceneNormal` — Scene normal texture

### Material
- `materialColor` — Material diffuse color
- `materialOpacity` — Material opacity
- `materialEmissive` — Emissive color
- `materialRoughness` — Roughness
- `materialMetalness` — Metalness
- `materialNormal` — Normal map
- `materialEnvMap` — Environment map
- `materialEnvMapIntensity` — Environment intensity
- `materialLineWidth` — Line width
- `materialPointSize` — Point size
- `materialSide` — Render side

### Scene
- `sceneBackground` — Scene background
- `sceneEnvMap` — Scene environment map
- `sceneFogColor` — Fog color
- `sceneFogDensity` — Fog density
- `sceneFogNear` — Fog near
- `sceneFogFar` — Fog far

### Time
- `time` — Elapsed time (float, seconds)
- `deltaTime` — Frame delta time (float, seconds)
- `frameId` — Frame counter (int)

## Texture Sampling

```javascript
// Basic sampling
const color = texture(myTexture, uv(0));

// With mip level
const color = texture(myTexture, uv(0), level);

// Bicubic (higher quality)
const color = textureBicubic(myTexture, uv(0));

// Direct texel fetch
const color = textureLoad(myTexture, coord, level);

// Texture size
const size = textureSize(myTexture, level);

// Store (compute shaders)
textureStore(myTexture, coord, value);
```

## Lighting

### Built-in Lighting Functions
- `lightPosition` — Light position
- `lightDirection` — Light direction
- `lightColor` — Light color
- `lightIntensity` — Light intensity
- `lightTarget` — Light target position
- `shadowColor` — Shadow color (after shadow test)
- `irradiance` — Diffuse irradiance
- `radiance` — Specular radiance
- `ambientOcclusion` — AO value

### PBR Helpers
- `diffuseColor` — Diffuse color (color * materialColor)
- `specularColor` — Specular color (F0)
- `roughness` — Effective roughness
- `metalness` — Effective metalness
- `reflectivity` — Reflectivity at normal incidence

### Environment
- `envMap` — Environment map sample
- `envMapSize` — Environment map size
- `envMapIntensity` — Environment intensity

## Compute Shaders

```javascript
import { computeNode, storage, workgroupArray, workgroupBarrier, storageBarrier } from 'three/tsl';

// Declare storage buffer
const buffer = storage(new Float32Array(1024), 'float', 1024);

// Compute node
const compute = computeNode({ x: 64, y: 64 }, () => {
  const idx = instanceIndex;
  buffer.element(idx).assign(float(42));
  workgroupBarrier();
});

// Run compute
renderer.compute(compute);
```

## Varying

```javascript
// Pass value from vertex to fragment shader
const myVar = varying(float(0), 'myVar');

// In vertex shader:
myVar.assign(positionLocal.y);

// In fragment shader:
const v = myVar; // Read interpolated value
```

## Uniforms

```javascript
// Single uniform
const myUniform = uniform(1.0);
// Change at runtime:
myUniform.value = 2.0;

// Uniform array
const arr = uniformArray([1, 2, 3, 4]);

// Uniform group
const group = uniformGroup();
```

## Common Patterns

### Vertex Displacement
```javascript
material.positionNode = Fn(() => {
  const wave = mul(sin(add(mul(positionLocal.y, float(2)), time)), float(0.1));
  return add(positionLocal, mul(normalLocal, wave));
})();
```

### Custom Fragment Color
```javascript
material.outputNode = Fn(() => {
  const c = texture(diffuseMap, uv(0));
  const fog = mix(c, sceneFogColor, saturate(distance(cameraPosition, positionWorld) / 100));
  return fog;
})();
```

### Procedural Normal
```javascript
material.normalNode = Fn(() => {
  const eps = float(0.01);
  const h = texture(heightMap, uv(0));
  const hx = texture(heightMap, add(uv(0), vec2(eps, 0)));
  const hy = texture(heightMap, add(uv(0), vec2(0, eps)));
  return normalize(vec3(sub(h.x, hx.x), sub(h.y, hy.x), float(1)));
})();
```
