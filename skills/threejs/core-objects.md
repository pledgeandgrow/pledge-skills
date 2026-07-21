# Core — Objects

## Object3D

Base class for most objects in three.js. Provides properties and methods for manipulating objects in 3D space.

```javascript
const obj = new THREE.Object3D();
obj.position.set(0, 5, 0);
obj.rotation.y = Math.PI / 2;
obj.scale.set(2, 2, 2);
scene.add(obj);
```

**Constructor:** `Object3D()` — No arguments

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `animations` | Array | `[]` | Animation clips |
| `castShadow` | Boolean | `false` | Render into shadow map |
| `children` | Array | `[]` | Child objects |
| `customDepthMaterial` | Material | `undefined` | Custom depth material for shadows |
| `customDistanceMaterial` | Material | `undefined` | Custom distance material for PointLight shadows |
| `frustumCulled` | Boolean | `true` | Skip rendering if outside camera frustum |
| `id` | Integer | auto | Unique readonly number |
| `isObject3D` | Boolean | `true` | Read-only flag |
| `layers` | Layers | `new Layers()` | Layer membership for visibility filtering |
| `matrix` | Matrix4 | identity | Local transform matrix |
| `matrixAutoUpdate` | Boolean | `true` | Auto-update matrix from position/rotation/scale |
| `matrixWorld` | Matrix4 | identity | Global transform |
| `matrixWorldAutoUpdate` | Boolean | `true` | Auto-update world matrix |
| `matrixWorldNeedsUpdate` | Boolean | `false` | Force world matrix update next frame |
| `modelViewMatrix` | Matrix4 | identity | Passed to shader |
| `name` | String | `""` | Optional name |
| `normalMatrix` | Matrix3 | identity | Normal matrix for shader |
| `onAfterRender` | Function | `undefined` | Callback after render |
| `onBeforeRender` | Function | `undefined` | Callback before render |
| `parent` | Object3D | `null` | Parent in scene graph |
| `position` | Vector3 | `(0,0,0)` | Local position |
| `quaternion` | Quaternion | identity | Local rotation as quaternion |
| `receiveShadow` | Boolean | `false` | Receive shadows |
| `renderOrder` | Number | `0` | Override render sort order |
| `rotation` | Euler | `(0,0,0)` | Local rotation (Euler angles, radians) |
| `scale` | Vector3 | `(1,1,1)` | Local scale |
| `up` | Vector3 | `(0,1,0)` | Up direction for lookAt |
| `userData` | Object | `{}` | Custom data storage |
| `uuid` | String | auto | UUID |
| `visible` | Boolean | `true` | Whether rendered |

### Static Properties
- `DefaultUp: Vector3` — `(0, 1, 0)` — Default up direction for all new Object3D
- `DefaultMatrixAutoUpdate: Boolean` — `true` — Default for `matrixAutoUpdate`

### Methods

**Scene Graph:**
- `add(...objects)` — Add children (removes from previous parent)
- `remove(...objects)` — Remove children
- `removeFromParent()` — Remove from current parent
- `clear()` — Remove all children
- `attach(object)` — Add child while maintaining world transform

**Transform:**
- `applyMatrix4(matrix)` — Apply matrix to object, update position/rotation/scale
- `applyQuaternion(quaternion)` — Apply rotation
- `rotateOnAxis(axis, angle)` — Rotate around axis in local space
- `rotateOnWorldAxis(axis, angle)` — Rotate around axis in world space
- `rotateX/Y/Z(rad)` — Rotate around local axis
- `translateOnAxis(axis, distance)` — Translate along axis in local space
- `translateX/Y/Z(distance)` — Translate along local axis
- `lookAt(x, y, z)` or `lookAt(vector)` — Rotate to face a world point

**Rotation Setting:**
- `setRotationFromAxisAngle(axis, angle)`
- `setRotationFromEuler(euler)`
- `setRotationFromMatrix(matrix)`
- `setRotationFromQuaternion(quaternion)`

**Search/Query:**
- `getObjectById(id)` — Find child by id (recursive)
- `getObjectByName(name)` — Find child by name (recursive)
- `getObjectByProperty(name, value)` — Find by property (recursive)
- `getObjectsByProperty(name, value)` — Find all by property (recursive)

**World Space:**
- `getWorldPosition(target)` — Returns world position
- `getWorldQuaternion(target)` — Returns world rotation
- `getWorldScale(target)` — Returns world scale
- `getWorldDirection(target)` — Returns world +Z direction
- `localToWorld(vector)` — Convert local to world space
- `worldToLocal(vector)` — Convert world to local space

**Matrix:**
- `updateMatrix()` — Update local matrix from position/rotation/scale
- `updateMatrixWorld(force)` — Update world matrix
- `updateWorldMatrix(updateParents, updateChildren)` — Update world matrix selectively

**Traversal:**
- `traverse(callback)` — Execute callback on this and all descendants
- `traverseVisible(callback)` — Like traverse, but only visible objects
- `traverseAncestors(callback)` — Execute callback on all ancestors

**Other:**
- `clone(recursive)` — Clone object and optionally descendants
- `copy(source, recursive)` — Copy properties from source
- `raycast(raycaster, intersects)` — Abstract, implemented by subclasses
- `toJSON(meta)` — Serialize to JSON

---

## Group

Groups objects together so they can be manipulated as a single unit.

```javascript
const group = new THREE.Group();
group.add(mesh1, mesh2, mesh3);
scene.add(group);
group.position.x = 5; // Moves all children
```

**Properties:**
- `isGroup: Boolean` — Read-only flag

Extends `Object3D` with no additional properties or methods.

---

## Mesh

Class representing triangular polygon mesh objects. Extends `Object3D`.

```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```

**Constructor:** `Mesh(geometry, material)`
- `geometry: BufferGeometry` — Default: new `BufferGeometry()`
- `material: Material` — Default: new `MeshBasicMaterial()`. Can be an array of materials

**Properties:**
- `geometry: BufferGeometry` — Object's structure
- `material: Material` — Object's appearance (single or array)
- `morphTargetInfluences: Array` — Weights (0-1) for morph targets
- `morphTargetDictionary: Object` — Name-indexed morph targets
- `isMesh: Boolean` — Read-only flag

**Methods:**
- `clone()` — Clone mesh and descendants
- `getVertexPosition(vert, target)` — Get vertex position considering morph/skinning
- `raycast(raycaster, intersects)` — Ray-mesh intersection
- `updateMorphTargets()` — Reset morph target influences

---

## SkinnedMesh

Mesh with skeleton-based skinning animation. Extends `Mesh`.

```javascript
const skinnedMesh = new THREE.SkinnedMesh(geometry, material);
skinnedMesh.add(skeleton.bones[0]); // Root bone
skinnedMesh.bind(skeleton);
```

**Constructor:** `SkinnedMesh(geometry, material)`

**Properties:**
- `bindMode: String` — `'attached'` (default) or `'detached'`
- `bindMatrix: Matrix4` — Base bind matrix
- `bindMatrixInverse: Matrix4` — Inverse bind matrix
- `skeleton: Skeleton` — Associated skeleton
- `isSkinnedMesh: Boolean` — Read-only

**Methods:**
- `bind(skeleton, bindMatrix)` — Bind skeleton to mesh
- `compose()` — Compose position/quaternion/scale into matrix (internal)
- `normalizeSkinWeights()` — Normalize skin weights
- `updateMatrixWorld(force)` — Override to handle bind modes

---

## Skeleton

Represents a skeleton for skinned mesh animation.

```javascript
const skeleton = new THREE.Skeleton(bones, boneInverses);
```

**Constructor:** `Skeleton(bones, boneInverses)`

**Properties:**
- `bones: Array` — Array of `Bone` objects
- `boneInverses: Array` — Array of inverse `Matrix4`
- `boneMatrices: Float32Array` — Bone matrices buffer
- `boneTexture: DataTexture` — Bone data texture (for GPU skinning)
- `uuid: String`

**Methods:**
- `calculateInverses()` — Compute boneInverses from bones
- `pose()` — Set bones to bind pose
- `update()` — Update boneMatrices from bones
- `getBoneByName(name)` — Find bone by name

---

## Bone

Represents a bone in a skeleton. Extends `Object3D`.

```javascript
const bone = new THREE.Bone();
bone.position.y = 5;
```

**Properties:**
- `isBone: Boolean` — Read-only flag

---

## Points

Renders points (vertices) as individual elements. Extends `Object3D`.

```javascript
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
const material = new THREE.PointsMaterial({ color: 0xff0000, size: 0.1 });
const points = new THREE.Points(geometry, material);
```

**Constructor:** `Points(geometry, material)`

**Properties:**
- `geometry: BufferGeometry`
- `material: Material` — Default: new `PointsMaterial()`
- `morphTargetInfluences: Array`
- `morphTargetDictionary: Object`
- `isPoints: Boolean` — Read-only

**Methods:**
- `clone()` — Clone points object
- `raycast(raycaster, intersects)` — Ray-point intersection
- `updateMorphTargets()`

---

## Line

Renders a connected line through vertices. Extends `Object3D`.

```javascript
const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
const line = new THREE.Line(geometry, material);
```

**Constructor:** `Line(geometry, material)`

**Properties:**
- `geometry: BufferGeometry`
- `material: Material` — Default: new `LineBasicMaterial()`
- `isLine: Boolean` — Read-only

**Methods:**
- `computeLineDistances()` — Compute distances for dashed lines
- `raycast(raycaster, intersects)`
- `clone()`

---

## LineSegments

Renders line segments between pairs of vertices. Extends `Line`.

```javascript
const lineSegments = new THREE.LineSegments(geometry, lineMaterial);
```

**Properties:**
- `isLineSegments: Boolean` — Read-only

---

## LineLoop

Renders a closed loop (connects last vertex back to first). Extends `Line`.

---

## Sprite

A 2D billboard that always faces the camera. Extends `Object3D`.

```javascript
const sprite = new THREE.Sprite(spriteMaterial);
sprite.scale.set(1, 1, 1);
```

**Constructor:** `Sprite(material)`

**Properties:**
- `material: SpriteMaterial` — Default: new `SpriteMaterial()`
- `center: Vector2` — `(0.5, 0.5)` — Rotation/scale center
- `isSprite: Boolean` — Read-only

**Methods:**
- `raycast(raycaster, intersects)`
- `clone()`

---

## InstancedMesh

Renders multiple instances of a mesh efficiently. Extends `Mesh`.

```javascript
const mesh = new THREE.InstancedMesh(geometry, material, count);
const matrix = new THREE.Matrix4();
for (let i = 0; i < count; i++) {
  matrix.setPosition(x, y, z);
  mesh.setMatrixAt(i, matrix);
}
mesh.instanceMatrix.needsUpdate = true;
```

**Constructor:** `InstancedMesh(geometry, material, count)`

**Properties:**
- `instanceMatrix: InstancedBufferAttribute` — Per-instance matrices
- `instanceColor: InstancedBufferAttribute` — Per-instance colors (null by default)
- `count: Integer` — Number of instances
- `frustumCulled: Boolean` — Default false (instances may not cull correctly)
- `isInstancedMesh: Boolean` — Read-only

**Methods:**
- `getMatrixAt(index, matrix)` — Get instance matrix
- `setMatrixAt(index, matrix)` — Set instance matrix
- `getColorAt(index, color)` — Get instance color
- `setColorAt(index, color)` — Set instance color
- `computeBoundingSphere()` — Compute bounding sphere
- `dispose()` — Free GPU resources
- `copy(source)`

---

## BatchedMesh

Renders multiple geometries in a single draw call with dynamic add/remove. Extends `Mesh`.

```javascript
const batchedMesh = new THREE.BatchedMesh(maxGeometryCount, maxVertexCount, maxIndexCount, material);
const geometryId = batchedMesh.addGeometry(geometry);
batchedMesh.addInstance(geometryId);
```

**Properties:**
- `maxInstanceCount: Integer`
- `instanceCount: Integer`
- `activeInstances: Integer`
- `maxGeometryCount: Integer`
- `activeGeometries: Integer`
- `isBatchedMesh: Boolean` — Read-only

**Methods:**
- `addGeometry(geometry, reservedVertexRange, reservedIndexRange)` — Returns geometry id
- `deleteGeometry(geometryId)` — Remove geometry
- `addInstance(geometryId)` — Returns instance id
- `deleteInstance(instanceId)` — Remove instance
- `setMatrixAt(instanceId, matrix)` — Set instance transform
- `getMatrixAt(instanceId, matrix)` — Get instance transform
- `setColorAt(instanceId, color)` — Set instance color
- `getColorAt(instanceId, color)` — Get instance color
- `getGeometryRangeAt(geometryId, ...)` / `setGeometryRangeAt(geometryId, ...)`
- `getInstanceCount()` / `setInstanceCount(count)`
- `computeBoundingSphere()`
- `dispose()`

---

## LOD (Level of Detail)

Dynamically switches between child objects based on distance to camera. Useful for performance optimization.

**Constructor:** `new LOD()`

**Methods:**
- `addLevel(object, distance, hysteresis)` — Add a detail level at a given distance
- `getCurrentLevel()` — Get current active level
- `getObjectForDistance(distance)` — Get object for a given distance
- `update(camera)` — Update active level based on camera distance
- `removeLevelsToRemove()` — Clean up removed levels

**Properties:**
- `levels: Array` — `[{ object, distance, hysteresis }]` sorted by distance
- `autoUpdate: Boolean` — Default true. Set false to manually call `update()`

```javascript
const lod = new THREE.LOD();
lod.addLevel(highDetailMesh, 0);
lod.addLevel(mediumDetailMesh, 10);
lod.addLevel(lowDetailMesh, 50);
scene.add(lod);
```
