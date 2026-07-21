# Core — Cameras

## Camera (Abstract Base)

Extends `Object3D`. Abstract base class for all cameras. Not intended to be used directly — use `PerspectiveCamera` or `OrthographicCamera`.

**Properties (in addition to Object3D):**
- `isCamera: Boolean` — Read-only flag
- `layers: Layers` — Layer membership (inherited from Object3D). Objects must share at least one layer with camera to be seen
- `matrixWorldInverse: Matrix4` — Inverse of `matrixWorld`
- `projectionMatrix: Matrix4` — Projection matrix
- `projectionMatrixInverse: Matrix4` — Inverse of projection matrix

**Methods:**
- `clone()` — Returns new camera with same properties
- `copy(source, recursive)` — Copy properties from source
- `getWorldDirection(target)` — Returns Vector3 representing world space direction camera is looking (down local -Z axis)

## PerspectiveCamera

Camera with perspective projection. Mimics human eye. Most common camera type.

```javascript
const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);
```

**Constructor:** `PerspectiveCamera(fov, aspect, near, far)`

**Properties:**
- `fov: Float` — Vertical field of view in degrees. Default 50
- `aspect: Float` — Aspect ratio (width/height). Default 1
- `near: Float` — Near clipping plane. Default 0.1. Must be > 0
- `far: Float` — Far clipping plane. Default 2000
- `zoom: Number` — Zoom factor. Default 1
- `view: Object` — Frustum window spec or null (set via `setViewOffset`)
- `filmGauge: Float` — Film size in mm. Default 35
- `filmOffset: Float` — Horizontal off-center offset. Default 0
- `focus: Float` — Object distance for stereoscopy/DOF. Default 10
- `isPerspectiveCamera: Boolean` — Read-only

**Methods:**
- `updateProjectionMatrix()` — Must call after changing fov/aspect/near/far/zoom
- `setViewOffset(fullWidth, fullHeight, x, y, width, height)` — Set sub-camera offset (multi-monitor)
- `clearViewOffset()` — Remove view offset
- `getEffectiveFOV()` — Returns FOV considering zoom
- `getFilmWidth()` — Film width considering aspect
- `getFilmHeight()` — Film height considering aspect
- `getFocalLength()` — Focal length from FOV and filmGauge
- `setFocalLength(focalLength)` — Set FOV from focal length
- `toJSON(meta)` — Serialize

## OrthographicCamera

Camera with orthographic projection. No perspective distortion. Good for CAD, 2D, isometric.

```javascript
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
```

**Constructor:** `OrthographicCamera(left, right, top, bottom, near, far)`

**Properties:**
- `left: Float` — Left frustum plane
- `right: Float` — Right frustum plane
- `top: Float` — Top frustum plane
- `bottom: Float` — Bottom frustum plane
- `near: Float` — Near clipping plane. Default 0.1
- `far: Float` — Far clipping plane. Default 2000
- `zoom: Number` — Zoom factor. Default 1
- `view: Object` — Frustum window spec or null
- `isOrthographicCamera: Boolean` — Read-only

**Methods:**
- `updateProjectionMatrix()` — Must call after changing any frustum parameter
- `setViewOffset(fullWidth, fullHeight, x, y, width, height)`
- `clearViewOffset()`
- `toJSON(meta)`

## StereoCamera

Dual perspective cameras for 3D stereo rendering (VR/AR).

```javascript
const stereo = new THREE.StereoCamera();
stereo.update(camera);
// Use stereo.cameraL and stereo.cameraR for left/right eye
```

**Properties:**
- `cameraL: PerspectiveCamera` — Left eye camera
- `cameraR: PerspectiveCamera` — Right eye camera
- `aspect: Float` — Aspect ratio
- `eyeSep: Float` — Eye separation. Default 0.064

**Methods:**
- `update(camera)` — Update stereo cameras from a perspective camera
- `copy(source)` — Copy from another StereoCamera

## ArrayCamera

Renders the scene from multiple cameras into different viewport regions.

```javascript
const cams = [
  new PerspectiveCamera(75, w/h, 0.1, 1000),
  new PerspectiveCamera(75, w/h, 0.1, 1000)
];
cams[1].position.x = 5;
const arrayCam = new THREE.ArrayCamera(cams);
```

**Constructor:** `ArrayCamera(array)` — `array` is an array of `PerspectiveCamera` instances

**Properties:**
- `cameras: Array` — Array of camera instances

## CubeCamera

Creates 6 cameras (one per face of a cube) for rendering environment maps.

```javascript
const cubeCamera = new THREE.CubeCamera(0.1, 1000, new THREE.WebGLCubeRenderTarget(256));
scene.add(cubeCamera);
// In render loop:
cubeCamera.update(renderer, scene);
// Use cubeCamera.renderTarget.texture as environment map
```

**Constructor:** `CubeCamera(near, far, renderTarget)`

**Properties:**
- `renderTarget: WebGLCubeRenderTarget` — Cube render target

**Methods:**
- `update(renderer, scene)` — Render scene from all 6 directions
- `clear(renderer, color, depth, stencil)` — Clear render target

## Camera Tips

- **Always call `updateProjectionMatrix()`** after changing `fov`, `aspect`, `near`, `far`, `zoom`, or `left/right/top/bottom`
- **Aspect ratio:** Set to canvas width/height. Update on window resize
- **Near plane:** Keep as large as possible to avoid z-fighting. 0.1 is typical minimum
- **Far plane:** Keep as small as possible for depth precision
- **lookAt():** Makes the camera look at a world-space point. Sets rotation via quaternion
