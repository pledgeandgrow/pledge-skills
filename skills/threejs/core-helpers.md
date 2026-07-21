# Core — Helpers (Quick Reference)

All helpers extend `Object3D` and can be added to the scene. Remove in production for performance.

## Quick Reference Table

| Helper | Constructor | Visualizes |
|--------|-------------|------------|
| `AxesHelper` | `AxesHelper(size=1)` | X (red), Y (green), Z (blue) axes |
| `BoxHelper` | `BoxHelper(object, color=0xffff00)` | Object bounding box wireframe |
| `Box3Helper` | `Box3Helper(box3, color=0xffff00)` | Box3 wireframe |
| `CameraHelper` | `CameraHelper(camera)` | Camera frustum planes |
| `DirectionalLightHelper` | `DirectionalLightHelper(light, size=1, color)` | DirectionalLight direction |
| `GridHelper` | `GridHelper(size=10, divisions=10, color1, color2)` | XZ plane grid |
| `HemisphereLightHelper` | `HemisphereLightHelper(light, sphereSize, hexColor, groundColor)` | HemisphereLight |
| `PlaneHelper` | `PlaneHelper(plane, size=1, color=0xffff00)` | Plane visualization |
| `PointLightHelper` | `PointLightHelper(light, sphereSize, color)` | PointLight position/range |
| `PolarGridHelper` | `PolarGridHelper(radius, sectors, rings, divisions, color1, color2)` | Polar grid |
| `SkeletonHelper` | `SkeletonHelper(object)` | Skeleton bones as lines |
| `SpotLightHelper` | `SpotLightHelper(light, color=0xffffff)` | SpotLight cone |
| `ArrowHelper` | `ArrowHelper(dir, origin, length, color, headLength, headWidth)` | Arrow vector |
| `FaceNormalsHelper` | `FaceNormalsHelper(mesh, size=1, color=0xffff00, linewidth=1)` | Face normals |
| `VertexNormalsHelper` | `VertexNormalsHelper(mesh, size=1, color=0xffff00, linewidth=1)` | Vertex normals |
| `VertexTangentsHelper` | `VertexTangentsHelper(mesh, size=1, color=0xffff00, linewidth=1)` | Vertex tangents |

## Common Methods

All helpers share these from `Object3D`:
- `position`, `rotation`, `scale` — Transform
- `visible` — Toggle visibility
- `dispose()` — Free resources (where applicable)

Helpers that track objects have an `update()` method:
- `BoxHelper.update()`
- `CameraHelper.update()`
- `DirectionalLightHelper.update()`
- `HemisphereLightHelper.update()`
- `PointLightHelper.update()`
- `SpotLightHelper.update()`
- `FaceNormalsHelper.update()`
- `VertexNormalsHelper.update()`
- `VertexTangentsHelper.update()`
