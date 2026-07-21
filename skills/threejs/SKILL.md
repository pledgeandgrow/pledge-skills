---
name: threejs-docs
version: "r168+"
tags:
  - threejs
  - three.js
  - webgl
  - webgpu
  - 3d
  - graphics
  - rendering
  - animation
  - shaders
  - tsl
description: |
  Comprehensive Three.js reference covering core API (objects, cameras, lights, materials,
  geometries, renderers, scenes, textures, math, animation, audio, loaders, helpers, nodes),
  all addons (controls, postprocessing, loaders, exporters, geometries, shaders, WebXR, physics),
  TSL (Three.js Shading Language) functions, and global constants. Use whenever the user
  mentions Three.js, WebGL/WebGPU rendering, 3D scenes, meshes, materials, shaders, or TSL.
---

# Three.js Expert (r168+)

**Official Documentation:** https://threejs.org/docs/

## Quick Reference

| Topic | File |
|-------|------|
| Animation & Audio: `AnimationClip`, `AnimationMixer`, `Audio`, `AudioListener` | `core-animation-audio.md` |
| Cameras: `Camera`, `PerspectiveCamera`, `OrthographicCamera`, `StereoCamera` | `core-cameras.md` |
| Core classes: `BufferAttribute`, `Clock`, `EventDispatcher`, `Raycaster`, `UniformsGroup` | `core-classes.md` |
| Geometries: `BufferGeometry`, `BoxGeometry`, `SphereGeometry`, `PlaneGeometry`, etc. | `core-geometries.md` |
| Helpers: `AxesHelper`, `GridHelper`, `BoxHelper`, `CameraHelper`, etc. | `core-helpers.md` |
| Lights: `Light`, `AmbientLight`, `DirectionalLight`, `PointLight`, `SpotLight`, etc. | `core-lights.md` |
| Loaders: `Loader`, `FileLoader`, `TextureLoader`, `GLTFLoader`, etc. | `core-loaders.md` |
| Materials: `Material`, `MeshBasicMaterial`, `MeshStandardMaterial`, `ShaderMaterial`, etc. | `core-materials.md` |
| Math: `Vector2/3/4`, `Color`, `Matrix3/4`, `Quaternion`, `Euler`, `Plane`, `Box3`, etc. | `core-math.md` |
| Nodes: Node system for shader graph programming | `core-nodes.md` |
| Objects: `Object3D`, `Mesh`, `Group`, `Points`, `Line`, `Sprite`, `Bone`, etc. | `core-objects.md` |
| Renderers, Scenes & Textures: `WebGLRenderer`, `Scene`, `Texture`, `WebGLRenderTarget` | `core-renderers.md` |
| Addons: Controls, Postprocessing, Exporters, Loaders, Shaders, WebXR, etc. | `addons.md` |
| TSL: Three.js Shading Language functions and variables | `tsl.md` |
| Global constants & functions: Blending modes, constants, utilities | `global.md` |

## Core Philosophy

Three.js is a **3D JavaScript library** that wraps WebGL (and now WebGPU) to provide:

1. **Scene Graph** — Hierarchical object system via `Object3D` with parent-child transforms
2. **Renderer** — `WebGLRenderer` (or `WebGPURenderer`) draws scenes to a canvas
3. **Resources** — Geometries (shape), Materials (appearance), Textures (images)
4. **Lighting** — Physically-based lighting with shadows, environment maps
5. **Animation** — Keyframe animation, skinning, morph targets
6. **Shaders** — Custom GLSL shaders or TSL node-based shader graphs

## Minimal Setup

```javascript
import * as THREE from 'three';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

// Render loop
renderer.setAnimationLoop(() => {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
});
```

## Architecture Overview

```
Scene
├── Object3D (base class)
│   ├── Mesh (geometry + material)
│   ├── Group (container)
│   ├── Points (point cloud)
│   ├── Line / LineSegments
│   ├── Sprite (2D billboard)
│   ├── Bone (skeleton)
│   ├── Camera (PerspectiveCamera, OrthographicCamera)
│   └── Light (AmbientLight, DirectionalLight, PointLight, SpotLight, etc.)
├── Fog / FogExp2
├── Background (Color, Texture, CubeTexture)
└── Environment (Texture for PBR)

Renderer
├── WebGLRenderer (WebGL 2.0 backend)
├── WebGPURenderer (WebGPU backend)
├── WebGLRenderTarget (off-screen rendering)
└── ShadowMap (shadow rendering)

Resources
├── BufferGeometry (vertex data: positions, normals, UVs, indices)
├── Material (appearance: MeshBasicMaterial, MeshStandardMaterial, ShaderMaterial, etc.)
├── Texture (image data: Texture, CubeTexture, DataTexture, etc.)
└── BufferAttribute (typed array buffer for geometry attributes)
```

## Key Concepts

### Coordinate System
- **Right-handed** coordinate system (WebGL): +X right, +Y up, +Z toward viewer
- `WebGLCoordinateSystem` (default) vs `WebGPUCoordinateSystem`

### Rendering Pipeline
1. Scene traversal and frustum culling
2. Sorting objects (opaque front-to-back, transparent back-to-front)
3. Shader compilation and material binding
4. Geometry upload to GPU
5. Draw calls (gl.drawArrays / gl.drawElements)
6. Post-processing (if using EffectComposer)

### Memory Management
- Call `.dispose()` on geometries, materials, and textures when no longer needed
- Renderer frees GPU resources; JavaScript GC handles CPU memory
- Textures attached to materials must be disposed separately

### Color Management
- `SRGBColorSpace` for display, `LinearSRGBColorSpace` for computation
- Renderer `outputColorSpace` defaults to `SRGBColorSpace`
- Textures should set `colorSpace = THREE.SRGBColorSpace` for color maps

### Shadows
- Enable `renderer.shadowMap.enabled = true`
- Set `light.castShadow = true` and `mesh.castShadow / receiveShadow = true`
- Shadow map types: `BasicShadowMap`, `PCFShadowMap` (default), `PCFSoftShadowMap`, `VSMShadowMap`

### Tone Mapping
- `NoToneMapping` (default), `ACESFilmicToneMapping`, `AgXToneMapping`, `CineonToneMapping`, `NeutralToneMapping`, `LinearToneMapping`, `ReinhardToneMapping`
- Set via `renderer.toneMapping` and `renderer.toneMappingExposure`
