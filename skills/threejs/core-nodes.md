# Core — Nodes

The Node system is Three.js' modern approach to shader programming. It provides a graph-based, composable API for creating materials and effects without writing raw GLSL. Used primarily with `WebGPURenderer` and TSL (Three.js Shading Language).

## Overview

Nodes are building blocks that can be connected to form shader graphs. Each node represents a value, operation, or function that gets compiled into GLSL/WGSL at runtime.

```javascript
import { Fn, vec3, float, uv, texture, normalLocal, positionLocal, time, dot, cos, sin, mul, add } from 'three/tsl';

const displace = Fn(([position]) => {
  const wave = mul(sin(add(mul(position.y, float(2)), time)), float(0.1));
  return add(position, mul(normalLocal, wave));
});
```

## Node Types

### Value Nodes
- `float(value)` — Float value
- `int(value)` — Integer value
- `uint(value)` — Unsigned integer
- `bool(value)` — Boolean value
- `vec2(x, y)` — 2D vector
- `vec3(x, y, z)` — 3D vector
- `vec4(x, y, z, w)` — 4D vector
- `mat2(...)`, `mat3(...)`, `mat4(...)` — Matrices

### Attribute Nodes
- `positionLocal` — Local space position
- `positionWorld` — World space position
- `positionView` — View space position
- `normalLocal` — Local space normal
- `normalWorld` — World space normal
- `normalView` — View space normal
- `uv(index=0)` — UV coordinates
- `tangentLocal/World/View` — Tangent vectors
- `bitangentLocal/World/View` — Bitangent vectors
- `skinning` — Skinning transform
- `morph` — Morph target weights
- `instance(index)` — Instance matrix
- `batchId` — BatchedMesh instance ID
- `geometryId` — Geometry ID in BatchedMesh

### Texture Nodes
- `texture(texture, uv, level)` — Texture sample
- `textureBicubic(texture, uv)` — Bicubic texture sample
- `textureSize(texture, level)` — Texture dimensions
- `textureLoad(texture, coord, level)` — Direct texel fetch
- `textureStore(texture, coord, value)` — Write to texture (compute)
- `samplerTexture(texture)` — Combined sampler+texture
- `sampler(texture)` — Texture sampler

### Math Nodes
- `add(a, b)`, `sub(a, b)`, `mul(a, b)`, `div(a, b)`, `mod(a, b)`
- `dot(a, b)`, `cross(a, b)`, `normalize(v)`, `length(v)`, `distance(a, b)`
- `sin(x)`, `cos(x)`, `tan(x)`, `asin(x)`, `acos(x)`, `atan(x)`, `atan2(y, x)`
- `pow(x, y)`, `exp(x)`, `exp2(x)`, `log(x)`, `log2(x)`, `sqrt(x)`, `inversesqrt(x)`
- `abs(x)`, `sign(x)`, `floor(x)`, `ceil(x)`, `round(x)`, `fract(x)`, `trunc(x)`
- `min(a, b)`, `max(a, b)`, `clamp(x, min, max)`, `saturate(x)`, `mix(a, b, t)`, `lerp(a, b, t)`
- `step(edge, x)`, `smoothstep(edge0, edge1, x)`, `fwidth(x)`
- `reflect(I, N)`, `refract(I, N, eta)`, `faceforward(N, I, Nref)`
- `transpose(m)`, `inverse(m)`, `determinant(m)`
- `all(x)`, `any(x)`, `equal(a, b)`, `notEqual(a, b)`, `lessThan(a, b)`, `greaterThan(a, b)`
- `negate(x)`, `oneMinus(x)`, `reciprocal(x)`

### Conditional Nodes
- `cond(condition, trueNode, falseNode)` — Ternary-like
- `switchNode(value, cases)` — Switch statement
- `If(condition, ...).Elseif(condition, ...).Else(...)` — If/else chain

### Loop Nodes
- `Loop({ start, end, condition, update }, (i) => { ... })` — For loop
- `While(condition, (i) => { ... })` — While loop
- `Break()`, `Continue()` — Loop control

### Function Nodes
- `Fn((args) => { ... })` — Define a TSL function
- `Fn((args) => { ... }).setLayout({ name, type, inputs })` — With explicit layout

### Built-in TSL Functions (see tsl.md for full list)

### Lighting Nodes
- `lightPosition`, `lightDirection`, `lightColor`, `lightIntensity`
- `irradiance`, `radiance`, `ambientOcclusion`
- `diffuseColor`, `specularColor`, `roughness`, `metalness`
- `shadowColor`

### Material Nodes
- `materialColor`, `materialOpacity`, `materialEmissive`
- `materialRoughness`, `materialMetalness`, `materialNormal`
- `materialEnvMap`, `materialEnvMapIntensity`

### Scene Nodes
- `sceneBackground`, `sceneEnvMap`, `sceneFogColor`, `sceneFogDensity`

### Camera Nodes
- `cameraPosition`, `cameraNear`, `cameraFar`
- `cameraProjectionMatrix`, `cameraViewMatrix`, `cameraNormalMatrix`
- `cameraProjectionMatrixInverse`, `cameraViewMatrixInverse`

### Model Nodes
- `modelPosition`, `modelNormal`, `modelViewPosition`
- `modelMatrix`, `modelViewMatrix`, `modelNormalMatrix`
- `modelWorldMatrix`, `modelWorldMatrixInverse`

### Renderer Nodes
- `rendererSceneDepth`, `rendererSceneNormal`
- `viewportResolution`, `viewportTopLeft`, `viewportBottomLeft`
- `screenUV`, `screenUVFlipY`

### Compute Nodes
- `computeNode(workgroupSize, ...)` — Compute shader node
- `workgroupArray(type, length)` — Workgroup shared memory
- `workgroupBarrier()`, `storageBarrier()` — Synchronization

### Uniform Nodes
- `uniform(value)` — Uniform value node
- `uniformArray(array)` — Uniform array
- `uniformGroup()` — Uniform group

### Varying Nodes
- `varying(node)` — Pass value from vertex to fragment shader
- `instanceAttrib(name)` — Per-instance attribute

### Index Nodes
- `drawIndex` — Current draw call index
- `instanceIndex` — Current instance index
- `vertexIndex` — Current vertex index

## Node Material

`NodeMaterial` is the material type that uses nodes instead of GLSL strings.

```javascript
import { NodeMaterial } from 'three/nodes';

const material = new NodeMaterial();
material.colorNode = texture(diffuseTexture);
material.normalNode = texture(normalTexture);
material.outputNode = ...; // Custom output
```

### NodeMaterial Properties
- `colorNode` — Diffuse color
- `normalNode` — Normal map
- `emissiveNode` — Emissive color
- `metalnessNode` — Metalness
- `roughnessNode` — Roughness
- `opacityNode` — Opacity
- `alphaTestNode` — Alpha test
- `positionNode` — Vertex position override
- `outputNode` — Final fragment output
- `vertexNode` — Custom vertex shader
- `fragmentNode` — Custom fragment shader

### NodeMaterial Subclasses
- `NodeMaterials.MeshStandardNodeMaterial` — PBR with nodes
- `NodeMaterials.MeshPhysicalNodeMaterial` — Advanced PBR with nodes
- `NodeMaterials.MeshBasicNodeMaterial` — Basic with nodes
- `NodeMaterials.PointsNodeMaterial` — Points with nodes
- `NodeMaterials.LineBasicNodeMaterial` — Lines with nodes
- `NodeMaterials.SpriteNodeMaterial` — Sprites with nodes

## Node Builder

Internal class that compiles node graphs into shader code. Not typically used directly.

## Node Code

Allows writing raw shader code within the node system.

```javascript
import { nodeObject, Fn } from 'three/tsl';

const customCode = Fn(() => {
  return nodeObject(`
    float result = sin(uv.x * 3.14159);
    return vec4(result, result, result, 1.0);
  `);
});
```

## Node Tips

- **WebGPU vs WebGL:** Nodes work with both `WebGPURenderer` and `WebGLRenderer` (via WebGL2 backend)
- **TSL import:** Use `import { ... } from 'three/tsl'` for TSL functions
- **Node import:** Use `import { ... } from 'three/nodes'` for node classes
- **Composition:** Nodes compose by passing results as inputs to other nodes
- **Caching:** Nodes are cached by default. Use `.append()` to force unique instances
- **Performance:** Node system compiles to efficient shaders, comparable to hand-written GLSL
