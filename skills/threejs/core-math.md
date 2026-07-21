# Core — Math

## Vector2

2D vector (x, y).

```javascript
const v = new THREE.Vector2(0, 1);
v.add(new THREE.Vector2(1, 0)).normalize();
```

**Constructor:** `Vector2(x, y)` — Defaults: 0, 0

**Properties:** `x`, `y`, `isVector2: Boolean`

**Key Methods:**
- `add(v)`, `addScalar(s)`, `addScaledVector(v, s)`, `addVectors(a, b)`
- `sub(v)`, `subScalar(s)`, `subVectors(a, b)`
- `multiplyScalar(s)`, `multiplyVectors(a, b)`, `divide(v)`, `divideScalar(s)`
- `dot(v)` — Dot product
- `cross(v)` — Cross product (scalar in 2D)
- `length()`, `lengthSq()`, `manhattanLength()`
- `normalize()` — Unit vector
- `distanceTo(v)`, `distanceToSquared(v)`, `manhattanDistanceTo(v)`
- `angle()` — Angle to positive X axis
- `angleTo(v)` — Angle to another vector
- `applyMatrix3(m)` — Transform by Matrix3
- `min(v)`, `max(v)`, `clamp(min, max)`, `clampLength(min, max)`, `clampScalar(min, max)`
- `floor()`, `ceil()`, `round()`, `roundToZero()`
- `lerp(v, alpha)`, `lerpVectors(v1, v2, alpha)`
- `set(x, y)`, `setComponent(index, value)`, `getComponent(index)`
- `copy(v)`, `clone()`, `equals(v)`
- `fromArray(array, offset)`, `toArray(array, offset)`
- `fromBufferAttribute(attribute, index)`
- `rotateAround(center, angle)` — Rotate around point
- `setLength(length)` — Scale to specific length
- `negate()`

---

## Vector3

3D vector (x, y, z). Most used vector type.

```javascript
const v = new THREE.Vector3(0, 1, 0);
const dist = v.distanceTo(new THREE.Vector3(0, 0, 0));
```

**Constructor:** `Vector3(x, y, z)` — Defaults: 0, 0, 0

**Properties:** `x`, `y`, `z`, `isVector3: Boolean`

**Key Methods (in addition to Vector2 equivalents):**
- `cross(v)`, `crossVectors(a, b)` — Cross product
- `applyAxisAngle(axis, angle)` — Rotate by axis-angle
- `applyEuler(euler)` — Rotate by Euler
- `applyQuaternion(q)` — Rotate by quaternion
- `applyMatrix4(m)` — Transform by Matrix4 (perspective divide)
- `applyNormalMatrix(m)` — Transform by normal matrix
- `project(camera)` — Project to NDC
- `unproject(camera)` — Unproject from NDC
- `setFromMatrixColumn(matrix, index)` — Extract column from matrix
- `setFromMatrixPosition(matrix)` — Extract translation from matrix
- `setFromMatrixScale(matrix)` — Extract scale from matrix
- `setFromSpherical(s)` — Set from spherical coords
- `setFromCylindrical(c)` — Set from cylindrical coords
- `setFromColor(color)` — Set from Color (r, g, b)
- `random()` — Random unit vector
- `randomDirection()` — Random direction on unit sphere

---

## Vector4

4D vector (x, y, z, w).

**Constructor:** `Vector4(x, y, z, w)` — Defaults: 0, 0, 0, 1

Same method set as Vector3 plus `w` component handling.

---

## Color

RGB color with values 0-1 per channel.

```javascript
const c = new THREE.Color(0xff0000);       // hex
const c2 = new THREE.Color('rgb(0, 255, 0)'); // CSS string
const c3 = new THREE.Color(0, 0, 1);          // RGB floats
const c4 = new THREE.Color('skyblue');        // X11 name
```

**Constructor:** `Color(r, g, b)` — r can be hex, CSS string, or Color. g/b optional.

**Properties:** `r`, `g`, `b` (all 0-1), `isColor: Boolean`

**Key Methods:**
- `set(value)` — Set from hex, string, or Color
- `setHex(hex, colorSpace)` — Set from hex
- `setRGB(r, g, b, colorSpace)` — Set RGB
- `setHSL(h, s, l)` — Set from HSL
- `setStyle(style)` — Set from CSS string
- `setNamedColor(name)` — Set from X11 color name
- `getHex(colorSpace)` — Get as hex integer
- `getHexString(colorSpace)` — Get as hex string
- `getHSL(target, colorSpace)` — Get as HSL object
- `getStyle(colorSpace)` — Get as CSS string
- `clone()`, `copy(color)`, `equals(color)`
- `add(color)`, `addColors(c1, c2)`, `addScalar(s)`
- `multiply(color)`, `multiplyScalar(s)`
- `lerp(color, alpha)`, `lerpColors(c1, c2, alpha)`, `lerpHSL(color, alpha)`
- `offsetHSL(h, s, l)`
- `convertLinearToSRGB()`, `convertSRGBToLinear()`
- `copyLinearToSRGB(color)`, `copySRGBToLinear(color)`
- `fromArray(array, offset)`, `toArray(array, offset)`
- `fromBufferAttribute(attribute, index)`
- `getContrast()` — Get contrast color

---

## Euler

Euler angles (rotation in radians around X, Y, Z axes).

```javascript
const e = new THREE.Euler(0, Math.PI/2, 0, 'XYZ');
```

**Constructor:** `Euler(x, y, z, order)` — Defaults: 0, 0, 0, 'XYZ'

**Properties:**
- `x`, `y`, `z` — Angles in radians
- `order: String` — 'XYZ' (default), 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX'
- `isEuler: Boolean`

**Methods:**
- `set(x, y, z, order)`, `copy(e)`, `clone()`
- `setFromQuaternion(q, order)` — Set from quaternion
- `setFromRotationMatrix(m, order)` — Set from matrix
- `setFromVector3(v, order)` — Set from vector
- `toVector3()` — Convert to Vector3
- `fromArray(array)`, `toArray(array, offset)`
- `equals(e)`

---

## Quaternion

Quaternion rotation (x, y, z, w). More efficient than Euler for interpolation.

```javascript
const q = new THREE.Quaternion();
q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
```

**Constructor:** `Quaternion(x, y, z, w)` — Defaults: 0, 0, 0, 1

**Properties:** `x`, `y`, `z`, `w`, `isQuaternion: Boolean`

**Key Methods:**
- `set(x, y, z, w)`, `copy(q)`, `clone()`
- `setFromAxisAngle(axis, angle)` — From axis-angle
- `setFromEuler(euler)` — From Euler angles
- `setFromRotationMatrix(m)` — From rotation matrix
- `setFromUnitVectors(vFrom, vTo)` — Rotation from one direction to another
- `angleTo(q)` — Angle to another quaternion
- `rotateTowards(q, step)` — Rotate towards target by step
- `slerp(qb, t)` — Spherical linear interpolation
- `slerpQuaternions(qa, qb, t)` — SLERP between two quaternions
- `multiply(q)`, `multiplyQuaternions(a, b)`, `premultiply(q)`
- `conjugate()`, `invert()`, `dot(v)`
- `normalize()`, `length()`, `lengthSq()`
- `applyToVector3(v)` — Rotate a vector
- `fromArray(array)`, `toArray(array, offset)`
- `equals(q)`

---

## Matrix3

3x3 matrix. Used for UV transforms and normal matrices.

```javascript
const m = new THREE.Matrix3();
m.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
```

**Properties:** `elements: Float32Array(9)` — Column-major

**Key Methods:**
- `set(n11, n12, n13, n21, n22, n23, n31, n32, n33)`
- `identity()`, `clone()`, `copy(m)`
- `multiply(m)`, `premultiply(m)`, `multiplyMatrices(a, b)`, `multiplyScalar(s)`
- `determinant()`
- `invert()` — Invert in place
- `transpose()`
- `getNormalMatrix(matrix4)` — Normal matrix from Matrix4
- `setFromMatrix4(matrix4)` — Upper 3x3 from Matrix4
- `makeRotationAxis(axis, angle)`
- `makeScale(x, y)`
- `elements` — Column-major Float32Array
- `fromArray(array)`, `toArray(array, offset)`

---

## Matrix4

4x4 matrix. Used for 3D transforms (translation, rotation, scale, projection).

```javascript
const m = new THREE.Matrix4();
m.makeTranslation(1, 2, 3);
m.makeRotationY(Math.PI / 2);
```

**Properties:** `elements: Float32Array(16)` — Column-major

**Key Methods:**
- `set(n11, ..., n44)` — Set all 16 elements
- `identity()`, `clone()`, `copy(m)`
- `multiply(m)`, `premultiply(m)`, `multiplyMatrices(a, b)`, `multiplyScalar(s)`
- `determinant()`
- `invert()` — Invert in place
- `transpose()`
- `makeTranslation(x, y, z)` — Translation matrix
- `makeRotationX/Y/Z(theta)` — Rotation matrix
- `makeRotationAxis(axis, angle)` — Rotation around arbitrary axis
- `makeScale(x, y, z)` — Scale matrix
- `makeShear(xy, xz, yx, yz, zx, zy)` — Shear matrix
- `makeRotationFromEuler(euler)` — Rotation from Euler
- `makeRotationFromQuaternion(q)` — Rotation from quaternion
- `compose(position, quaternion, scale)` — Compose transform
- `decompose(position, quaternion, scale)` — Decompose transform
- `makePerspective(left, right, top, bottom, near, far)` — Perspective projection
- `makeOrthographic(left, right, top, bottom, near, far)` — Orthographic projection
- `makeBasis(xAxis, yAxis, zAxis)` — Create from basis vectors
- `lookAt(eye, target, up)` — View matrix
- `getPosition(target)` — Extract translation
- `getScale(target)` — Extract scale
- `getMaxScaleOnAxis()` — Max scale component
- `fromArray(array)`, `toArray(array, offset)`

---

## Frustum

View frustum for culling. 6 planes.

```javascript
const frustum = new THREE.Frustum();
frustum.setFromProjectionMatrix(camera.projectionMatrix);
if (frustum.containsPoint(point)) { /* visible */ }
```

**Methods:**
- `setFromProjectionMatrix(m)` — Set from projection matrix
- `setFromCamera(camera)` — Set from camera
- `containsPoint(point)` — Point inside frustum
- `intersectsBox(box)` — Box intersects frustum
- `intersectsSphere(sphere)` — Sphere intersects frustum
- `intersectsObject(object)` — Object intersects frustum
- `clone()`, `copy(frustum)`

---

## Box2 / Box3

Axis-aligned bounding boxes.

### Box3 (3D AABB)
```javascript
const box = new THREE.Box3();
box.setFromObject(mesh);
box.setFromPoints(points);
const center = box.getCenter(new THREE.Vector3());
const size = box.getSize(new THREE.Vector3());
```

**Methods:** `set(min, max)`, `setFromObject(object)`, `setFromPoints(points)`, `setFromCenterAndSize(center, size)`, `copy(box)`, `clone()`, `makeEmpty()`, `isEmpty()`, `getCenter(target)`, `getSize(target)`, `expandByPoint(point)`, `expandByVector(vector)`, `expandByScalar(scalar)`, `expandByObject(object)`, `containsPoint(point)`, `containsBox(box)`, `intersectsBox(box)`, `intersectsSphere(sphere)`, `intersectsPlane(plane)`, `clampPoint(point, target)`, `distanceToPoint(point)`, `getBoundingSphere(target)`, `intersect(box)`, `union(box)`, `applyMatrix4(matrix)`, `translate(offset)`, `equals(box)`

### Box2 (2D AABB)
Similar to Box3 but with Vector2. Methods: `setFromPoints`, `getCenter`, `getSize`, `containsPoint`, `intersectsBox`, `union`, `intersect`, etc.

---

## Sphere

Bounding sphere.

```javascript
const sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 1);
```

**Constructor:** `Sphere(center, radius)` — center: Vector3, radius: Float

**Methods:**
- `set(center, radius)`, `setFromPoints(points, center)`, `copy(s)`, `clone()`
- `containsPoint(point)` — Point inside sphere
- `distanceToPoint(point)` — Distance to surface
- `intersectsSphere(sphere)` — Sphere-sphere intersection
- `intersectsBox(box)` — Sphere-box intersection
- `intersectsPlane(plane)` — Sphere-plane intersection
- `clampPoint(point, target)` — Nearest point on sphere
- `getBoundingBox(target)` — Bounding box
- `applyMatrix4(matrix)` — Transform sphere
- `translate(offset)` — Move center
- `equals(sphere)`

---

## Plane

Mathematical plane defined by normal and constant.

```javascript
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -2); // normal Y, distance 2
```

**Constructor:** `Plane(normal, constant)` — normal: Vector3, constant: Float (distance from origin)

**Methods:**
- `set(normal, constant)`, `setFromNormalAndCoplanarPoint(normal, point)`, `setFromCoplanarPoints(a, b, c)`, `copy(p)`, `clone()`
- `normalize()` — Normalize normal, adjust constant
- `negate()` — Flip normal
- `distanceToPoint(point)` — Signed distance
- `intersectLine(line, target)` / `intersectLine3(l0, l1, target)`
- `intersectsLine(line)` / `intersectsBox(box)` / `intersectsSphere(sphere)`
- `coplanarPoint(target)` — Point on plane closest to origin
- `applyMatrix4(matrix, optionalNormalMatrix)` — Transform plane
- `translate(offset)` — Translate plane
- `equals(plane)`

---

## Ray

Ray from origin in a direction. Used for raycasting.

```javascript
const ray = new THREE.Ray(origin, direction);
const hit = ray.intersectSphere(sphere, target);
```

**Constructor:** `Ray(origin, direction)`

**Methods:**
- `set(origin, direction)`, `copy(ray)`, `clone()`
- `at(t, target)` — Point at distance t
- `lookAt(v)` — Set direction toward v
- `recast(t)` — Move origin along ray
- `closestPointToPoint(point, target)` — Closest point on ray
- `distanceToPoint(point)` — Distance to point
- `distanceSqToPoint(point)` — Squared distance
- `distanceSqToSegment(v0, v1, optionalPointOnRay, optionalPointOnSegment)`
- `intersectSphere(sphere, target)`, `intersectsSphere(sphere)`
- `intersectPlane(plane, target)`, `intersectsPlane(plane)`
- `intersectBox(box, target)`, `intersectsBox(box)`
- `intersectTriangle(a, b, c, backfaceCulling, target)`
- `applyMatrix4(matrix)`
- `equals(ray)`

---

## Raycaster

Casts rays and finds intersections with objects.

```javascript
const raycaster = new THREE.Raycaster();
raycaster.setFromCamera(mouse, camera);
const intersects = raycaster.intersectObjects(scene.children);
if (intersects.length > 0) {
  console.log(intersects[0].object, intersects[0].point, intersects[0].distance);
}
```

**Constructor:** `Raycaster(origin, direction, near, far)` — All optional

**Properties:**
- `ray: Ray` — The ray
- `near: Float` — Near distance. Default 0
- `far: Float` — Far distance. Default Infinity
- `camera: Camera` — For perspective correction
- `params: Object` — `{ Mesh: { threshold: 1 }, Line: { threshold: 1 }, Points: { threshold: 1 }, Sprite: { threshold: 1 } }`

**Methods:**
- `set(origin, direction)` — Set ray directly
- `setFromCamera(coords, camera)` — Set ray from mouse NDC and camera
- `intersectObject(object, recursive, intersects)` — Intersect single object (recursive default true)
- `intersectObjects(objects, recursive, intersects)` — Intersect array of objects

**Intersection Result:**
```javascript
{
  distance: Float,      // Distance from ray origin
  point: Vector3,       // Intersection point
  object: Object3D,     // Intersected object
  face: Face3,          // Intersected face (if Mesh)
  faceIndex: Integer,   // Face index
  uv: Vector2,          // UV at intersection
  uv2: Vector2,         // Second UV set
  instanceId: Integer,  // For InstancedMesh
  batchId: Integer,     // For BatchedMesh
  point: Vector3,
  barycoord: Vector3    // Barycentric coordinates
}
```

---

## Other Math Classes

### Clock

Timer for animation.

```javascript
const clock = new THREE.Clock();
// In render loop
const delta = clock.getDelta();  // Seconds since last call
const elapsed = clock.getElapsedTime();  // Total seconds
```

**Properties:**
- `autoStart: Boolean` — Default true
- `startTime: Float`, `oldTime: Float`, `elapsedTime: Float`
- `running: Boolean`

**Methods:**
- `start()`, `stop()`
- `getDelta()` — Time since last call (seconds)
- `getElapsedTime()` — Total elapsed time
- `getOldTime()`, `getStartTime()`
- `running` — Whether clock is running

### Spherical

Spherical coordinates (radius, phi, theta).

```javascript
const sph = new THREE.Spherical(1, Math.PI/2, Math.PI/4);
const v = new THREE.Vector3().setFromSpherical(sph);
```

**Constructor:** `Spherical(radius, phi, theta)` — phi=polar from Y, theta=azimuthal around Y

**Methods:** `set(radius, phi, theta)`, `copy(s)`, `clone()`, `setFromVector3(v)`, `setFromCartesianCoords(x, y, z)`, `makeSafe()` — Clamp phi to avoid gimbal lock

### Cylindrical

Cylindrical coordinates (radius, theta, y).

### Triangle

Triangle defined by 3 points.

**Methods:** `set(a, b, c)`, `setFromPointsAndIndices(points, i0, i1, i2)`, `getArea()`, `getMidpoint(target)`, `getNormal(target)`, `getPlane(target)`, `getBarycoord(point, target)`, `containsPoint(point)`, `closestPointToPoint(point, target)`, `intersectsBox(box)`

### Layers

Object visibility layers (0-31).

```javascript
camera.layers.enable(1);  // See layer 1
mesh.layers.set(1);       // Only on layer 1
```

**Methods:** `set(channel)`, `enable(channel)`, `enableAll()`, `toggle(channel)`, `disable(channel)`, `disableAll()`, `test(layers)`, `isEnabled(channel)`

### EventDispatcher

Base class for event handling. Extended by Object3D and many other classes.

```javascript
object.addEventListener('change', (event) => { ... });
object.dispatchEvent({ type: 'change' });
object.removeEventListener('change', listener);
```

**Methods:**
- `addEventListener(type, listener)` — Register listener
- `hasEventListener(type, listener)` — Check if registered
- `removeEventListener(type, listener)` — Remove listener
- `dispatchEvent(event)` — Fire event to all listeners

### MathUtils

Utility math functions.

- `degToRad(degrees)`, `radToDeg(radians)`
- `clamp(value, min, max)`
- `euclideanModulo(n, m)`
- `mapLinear(x, a1, a2, b1, b2)`
- `inverseLerp(x, y, t)`
- `lerp(x, y, t)`, `damp(x, y, lambda, dt)`
- `pingpong(x, length)`
- `smoothstep(x, min, max)`, `smootherstep(x, min, max)`
- `randInt(min, max)`, `randFloat(min, max)`, `randFloatSpread(range)`
- `seededRandom(seed)`
- `ceilPowerOfTwo(value)`, `floorPowerOfTwo(value)`
- `setQuaternionFromProperEuler(q, x, y, z, order)`
- `generateUUID()`

---

## Line3

Represents a 3D line segment between two points.

**Constructor:** `new Line3(start, end)` (defaults: `Vector3(0,0,0)`, `Vector3(0,0,0)`)

**Properties:**
- `start: Vector3`, `end: Vector3`

**Methods:**
- `set(start, end)`, `clone()`, `copy(line)`
- `delta(target)` — End minus start
- `at(t, target)` — Point at parameter t (0-1)
- `distance()`, `squaredDistance()`
- `closestPointToPoint(point, clampToLine, target)` — Nearest point on line
- `closestPointTParameter(point, clampToLine)` — t parameter of closest point

---

## Interpolant

Abstract base class for interpolation between keyframe values.

**Constructor:** `new Interpolant(parameterPositions, sampleValues, sampleSize, resultBuffer)`

**Properties:**
- `parameterPositions: Array` — Keyframe times
- `sampleValues: TypedArray` — Keyframe values
- `settings: Object` — Interpolation settings
- `valueSize: Integer` — Components per value
- `cacheIndex: Integer`, `boundValues: TypedArray`

**Methods:**
- `evaluate(time)` — Interpolate value at given time

### Math / Interpolants

| Interpolant | Description |
|-------------|-------------|
| `CubicInterpolant` | Cubic spline interpolation |
| `DiscreteInterpolant` | No interpolation (step function) |
| `LinearInterpolant` | Linear interpolation |
| `QuaternionLinearInterpolant` | Spherical linear interpolation for quaternions |

---

## SphericalHarmonics3

Spherical harmonics representation (3rd order, 9 coefficients). Used by `LightProbe`.

**Constructor:** `new SphericalHarmonics3()`

**Properties:**
- `coefficients: Array` — Array of 9 `Vector3` coefficients

**Methods:**
- `set(coefficients)`, `zero()`, `copy(sh)`, `clone()`
- `add(sh)` — Add another spherical harmonics
- `addScaledSH(sh, scale)` — Add scaled spherical harmonics
- `scale(scale)` — Scale all coefficients
- `lerp(sh, alpha)` — Linear interpolation
- `getAt(direction, target)` — Evaluate at direction
- `getIrradianceAt(direction, target)` — Get irradiance at direction
