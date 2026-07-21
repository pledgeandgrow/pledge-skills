# Core — Geometries

## BufferGeometry

Base class for all geometries. Stores vertex data (positions, normals, UVs, colors, indices) in buffer attributes.

```javascript
const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
  -1, -1, 1,  1, -1, 1,  1, 1, 1,
   1, 1, 1, -1, 1, 1, -1, -1, 1
]);
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
```

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `attributes` | Object | `{}` | Map of attribute name → BufferAttribute |
| `boundingBox` | Box3 | null | Bounding box (compute with `computeBoundingBox()`) |
| `boundingSphere` | Sphere | null | Bounding sphere (compute with `computeBoundingSphere()`) |
| `drawRange` | Object | `{start:0, count:Infinity}` | Part of geometry to render |
| `groups` | Array | `[]` | Render groups for multi-material |
| `id` | Integer | auto | Unique number |
| `index` | BufferAttribute | null | Index buffer for indexed geometry |
| `isBufferGeometry` | Boolean | true | Read-only |
| `morphAttributes` | Object | `{}` | Morph target attributes |
| `morphTargetsRelative` | Boolean | false | Relative morph targets |
| `name` | String | "" | Optional name |
| `userData` | Object | `{}` | Custom data |
| `uuid` | String | auto | UUID |

### Methods

**Attributes:**
- `setAttribute(name, attribute)` — Set a buffer attribute
- `getAttribute(name)` — Get a buffer attribute
- `hasAttribute(name)` — Check if attribute exists
- `deleteAttribute(name)` — Remove an attribute
- `setIndex(index)` — Set index buffer
- `getIndex()` — Get index buffer

**Bounding:**
- `computeBoundingBox()` — Compute bounding box
- `computeBoundingSphere()` — Compute bounding sphere
- `computeTangents()` — Compute tangent attribute (for normal maps)
- `computeVertexNormals()` — Compute normals by averaging face normals

**Groups:**
- `addGroup(start, count, materialIndex)` — Add a render group
- `clearGroups()` — Remove all groups
- `setDrawRange(start, count)` — Set draw range

**Transform:**
- `applyMatrix4(matrix)` — Apply matrix transform
- `applyQuaternion(quaternion)` — Apply rotation
- `center()` — Center geometry based on bounding box
- `lookAt(vector)` — Rotate to face a point (one-time operation)
- `normalizeNormals()` — Normalize all normal vectors
- `rotateX/Y/Z(radians)` — Rotate geometry (one-time, use Object3D.rotation for animation)
- `scale(x, y, z)` — Scale geometry (one-time, use Object3D.scale for animation)
- `translate(x, y, z)` — Translate geometry (one-time, use Object3D.position for animation)

**Other:**
- `clone()` — Clone geometry
- `copy(source)` — Copy from another geometry
- `dispose()` — Free GPU resources
- `toJSON()` — Serialize to JSON
- `toNonIndexed()` — Convert indexed to non-indexed geometry
- `setFromPoints(points)` — Set attributes from array of Vector3

---

## BufferAttribute

Stores vertex attribute data (positions, normals, UVs, colors, etc.).

```javascript
const positions = new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]);
const attr = new THREE.BufferAttribute(positions, 3);
geometry.setAttribute('position', attr);
```

**Constructor:** `BufferAttribute(array, itemSize, normalized)`

**Properties:**
- `array: TypedArray` — Data array (Float32Array, Uint16Array, etc.)
- `itemSize: Integer` — Components per vertex (3 for position, 2 for UV, etc.)
- `count: Integer` — Number of vertices (array.length / itemSize)
- `normalized: Boolean` — Whether data is normalized
- `name: String` — Default ""
- `usage: Constant` — `StaticDrawUsage` (default), `DynamicDrawUsage`, `StreamDrawUsage`
- `updateRange: Object` — `{offset: 0, count: -1}` — Partial update range
- `version: Integer` — Incremented on `needsUpdate`
- `needsUpdate: Boolean` — Set true to upload to GPU

**Methods:**
- `clone()` — Clone attribute
- `copyArray(array)` — Copy data into array
- `copyAt(index1, attribute, index2)` — Copy item from another attribute
- `set(X, index)` / `setY/Y/Z/W(index, value)` — Set component
- `getXYZ(index)` — Get components
- `setXY/XYS/XYZW(index, ...)` — Set multiple components
- `applyMatrix3(matrix)` / `applyMatrix4(matrix)` — Transform data
- `applyNormalMatrix(matrix)` — Transform normals
- `transformDirection(matrix)` — Transform as direction
- `setUsage(usage)` — Set buffer usage
- `addUpdateRange(start, count)` — Add partial update range
- `clearUpdateRanges()` — Clear update ranges
- `toJSON()` — Serialize

### InstancedBufferAttribute

Per-instance attribute for `InstancedMesh`.

```javascript
const colors = new Float32Array(count * 3);
const colorAttr = new THREE.InstancedBufferAttribute(colors, 3);
```

**Additional Properties:**
- `meshPerAttribute: Integer` — Default 1

---

## Geometry Types

### BoxGeometry

Box shape.

```javascript
new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
```
Defaults: width=1, height=1, depth=1, segments=1

### BoxBufferGeometry (deprecated — use BoxGeometry)

### CircleGeometry

Flat circle (disk).

```javascript
new THREE.CircleGeometry(radius, segments, thetaStart, thetaLength)
```
Defaults: radius=1, segments=32, thetaStart=0, thetaLength=2*PI

### ConeGeometry

Cone shape.

```javascript
new THREE.ConeGeometry(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
```
Defaults: radius=1, height=1, radialSegments=32, heightSegments=1, openEnded=false

### CylinderGeometry

Cylinder shape.

```javascript
new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
```
Defaults: radiusTop=1, radiusBottom=1, height=1, radialSegments=32, heightSegments=1, openEnded=false

### DodecahedronGeometry

12-faced polyhedron.

```javascript
new THREE.DodecahedronGeometry(radius, detail)
```
Defaults: radius=1, detail=0

### EdgesGeometry

Extracts edges from another geometry (only edges where face angle > threshold).

```javascript
const edges = new THREE.EdgesGeometry(geometry, thresholdAngle);
```
Defaults: thresholdAngle=1 (degrees)

### ExtrudeGeometry

Extrudes a 2D shape along Z axis or along a path.

```javascript
const shape = new THREE.Shape();
shape.moveTo(0, 0).lineTo(1, 0).lineTo(1, 1).lineTo(0, 1).lineTo(0, 0);
const geometry = new THREE.ExtrudeGeometry(shape, {
  depth: 1,
  bevelEnabled: true,
  bevelThickness: 0.2,
  bevelSize: 0.2,
  bevelSegments: 3
});
```

### IcosahedronGeometry

20-faced polyhedron.

```javascript
new THREE.IcosahedronGeometry(radius, detail)
```
Defaults: radius=1, detail=0

### LatheGeometry

Creates a surface of revolution from points.

```javascript
const points = [];
for (let i = 0; i < 10; i++) {
  points.push(new THREE.Vector2(Math.sin(i * 0.2) * 5 + 5, (i - 5) * 0.8));
}
const geometry = new THREE.LatheGeometry(points, segments, phiStart, phiLength);
```
Defaults: segments=12, phiStart=0, phiLength=2*PI

### OctahedronGeometry

8-faced polyhedron.

```javascript
new THREE.OctahedronGeometry(radius, detail)
```
Defaults: radius=1, detail=0

### PlaneGeometry

Flat plane.

```javascript
new THREE.PlaneGeometry(width, height, widthSegments, heightSegments)
```
Defaults: width=1, height=1, segments=1

### PolyhedronGeometry

Custom polyhedron from vertices and indices.

```javascript
new THREE.PolyhedronGeometry(vertices, indices, radius, detail)
```

### RingGeometry

Flat ring (annulus).

```javascript
new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength)
```
Defaults: innerRadius=0.5, outerRadius=1, thetaSegments=32, phiSegments=1

### ShapeGeometry

Creates geometry from a 2D Shape (flat).

```javascript
const shape = new THREE.Shape();
shape.moveTo(0, 0).lineTo(1, 0).lineTo(1, 1).lineTo(0, 1).lineTo(0, 0);
const geometry = new THREE.ShapeGeometry(shape, curveSegments);
```
Defaults: curveSegments=12

### SphereGeometry

Sphere shape.

```javascript
new THREE.SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
```
Defaults: radius=1, widthSegments=32, heightSegments=16, phiLength=2*PI, thetaLength=PI

### TetrahedronGeometry

4-faced polyhedron.

```javascript
new THREE.TetrahedronGeometry(radius, detail)
```
Defaults: radius=1, detail=0

### TorusGeometry

Torus (donut) shape.

```javascript
new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc)
```
Defaults: radius=1, tube=0.4, radialSegments=12, tubularSegments=48, arc=2*PI

### TorusKnotGeometry

Torus knot shape.

```javascript
new THREE.TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q)
```
Defaults: radius=1, tube=0.4, tubularSegments=64, radialSegments=8, p=2, q=3

### TubeGeometry

Tube along a 3D curve.

```javascript
const curve = new THREE.CatmullRomCurve3(points);
const geometry = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, closed);
```
Defaults: tubularSegments=64, radius=1, radialSegments=8, closed=false

### WireframeGeometry

Creates wireframe edges from geometry (all edges, not just sharp ones).

```javascript
const wireframe = new THREE.WireframeGeometry(geometry);
```

---

## Shape, Path, Curve

### Shape

2D shape for `ShapeGeometry` and `ExtrudeGeometry`. Extends `Path`.

```javascript
const shape = new THREE.Shape();
shape.moveTo(0, 0);
shape.lineTo(1, 0);
shape.quadraticCurveTo(1, 1, 0, 1);
shape.lineTo(0, 0);

// Holes
const hole = new THREE.Path();
hole.absarc(0.5, 0.5, 0.2, 0, Math.PI * 2, true);
shape.holes.push(hole);
```

### Path

2D path for drawing shapes.

**Methods:** `moveTo`, `lineTo`, `quadraticCurveTo`, `bezierCurveTo`, `absarc`, `absellipse`, `arc`, `ellipse`, `splineThru`, `fromPoints`

### Curve (Abstract)

Base class for 3D curves.

**Methods:**
- `getPoint(t, target)` — Get point at parameter t (0-1)
- `getPoints(divisions)` — Get array of points
- `getTangent(t, target)` — Get tangent at t
- `getLength()` — Get arc length
- `getSpacedPoints(divisions)` — Equally spaced points

### Curve Subclasses
- `CatmullRomCurve3` — Smooth spline through points
- `CubicBezierCurve3` — Cubic Bezier
- `QuadraticBezierCurve3` — Quadratic Bezier
- `LineCurve3` — Straight line
- `ArcCurve` — Circular arc
- `EllipseCurve` — Elliptical arc
- `SplineCurve` — 2D spline

---

## Geometry Tips

- **Indexed vs non-indexed:** Indexed geometry reuses vertices (more efficient). Use `toNonIndexed()` to convert
- **Segments:** More segments = smoother but more vertices. Balance quality vs performance
- **computeVertexNormals():** Call after modifying positions to update normals for correct lighting
- **dispose():** Always call when done with geometry to free GPU memory
- **Custom attributes:** Use `setAttribute('customName', ...)` and access in `ShaderMaterial`
- **Groups:** Use `addGroup(start, count, materialIndex)` for multi-material meshes
- **Bounding:** Call `computeBoundingBox()` and `computeBoundingSphere()` for frustum culling and raycasting

---

## CapsuleGeometry

A capsule (cylinder with hemispheric caps).

**Constructor:** `new CapsuleGeometry(radius, length, capSegments, radialSegments)`

| Parameter | Default | Description |
|-----------|---------|-------------|
| `radius` | 1 | Radius of the capsule |
| `length` | 1 | Length of the middle cylinder section |
| `capSegments` | 4 | Number of hemisphere segments |
| `radialSegments` | 8 | Number of radial segments |

---

## Extras / Core — Curves & Shapes

### Curve

Abstract base class for all curves.

**Methods:**
- `getPoint(t, optionalTarget)` — Get point at parameter t (0-1). Override in subclasses
- `getPointAt(u, optionalTarget)` — Get point at arc-length normalized u
- `getPoints(divisions)` — Array of points
- `getSpacedPoints(divisions)` — Equally spaced points
- `getLength()` — Total arc length
- `getLengths(divisions)` — Array of cumulative lengths
- `getUtoTmapping(u, distance)` — Map arc-length u to parameter t
- `getTangent(t, optionalTarget)` / `getTangentAt(u, optionalTarget)` — Tangent vector
- `computeFrenetFrames(segments, closed)` — Frenet frames (for TubeGeometry)
- `clone()`, `copy(source)`

### CurvePath

Extends `Curve`. A collection of curves forming a path.

**Methods:**
- `add(curve)` — Add a curve
- `closePath()` — Close the path
- `getPoint(t)` — Get point along the entire path
- `createPointsGeometry(divisions)`, `createSpacedPointsGeometry(divisions)`

### Path

Extends `CurvePath`. 2D path for creating shapes. Used by `ShapeGeometry` and `ExtrudeGeometry`.

**Constructor:** `new Path(points)`

**Methods:**
- `moveTo(x, y)`, `lineTo(x, y)`
- `quadraticCurveTo(cpx, cpy, x, y)`
- `bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y)`
- `splineThru(points)`, `arc(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise)`
- `ellipse(...)`, `absarc(...)`, `absellipse(...)`

### Shape

Extends `Path`. A 2D shape with holes. Used by `ShapeGeometry` and `ExtrudeGeometry`.

**Constructor:** `new Shape()`

**Properties:**
- `uuid: String`
- `holes: Array<Path>` — Holes in the shape

**Methods:**
- `getPointsHoles(divisions)` — Points for each hole
- `extractPoints(divisions)` — `{ shape, holes }` combined points
- `extractAllPoints(divisions)`, `extractAllSpacedPoints(divisions)`

### ShapePath

Similar to `Path` but uses `Vector2` points. For programmatic shape building.

**Methods:**
- `moveTo(x, y)`, `lineTo(x, y)`
- `quadraticCurveTo(cpx, cpy, x, y)`
- `bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y)`
- `splineThru(points)`
- `toShapes(isCCW, noHoles)` — Convert to `Shape[]`

### Interpolations

Utility interpolation functions used by curves.

- `Interpolations.CatmullRom(t, p0, p1, p2, p3)` — Catmull-Rom spline interpolation
- `Interpolations.QuadraticBezier(t, p0, p1, p2)` — Quadratic Bezier
- `Interpolations.CubicBezier(t, p0, p1, p2, p3)` — Cubic Bezier

---

## Extras / Curves — All Curve Types

| Curve | Description |
|-------|-------------|
| `ArcCurve` | Circular arc (extends `EllipseCurve`) |
| `CatmullRomCurve3` | 3D Catmull-Rom spline through points |
| `CubicBezierCurve` | 2D cubic Bezier (2 control points) |
| `CubicBezierCurve3` | 3D cubic Bezier |
| `EllipseCurve` | Elliptical arc |
| `LineCurve` | 2D line segment |
| `LineCurve3` | 3D line segment |
| `QuadraticBezierCurve` | 2D quadratic Bezier (1 control point) |
| `QuadraticBezierCurve3` | 3D quadratic Bezier |
| `SplineCurve` | 2D spline through points |
