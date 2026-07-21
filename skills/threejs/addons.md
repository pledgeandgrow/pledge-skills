# Addons

Three.js addons extend core functionality. Import from `three/addons/` (or `three/examples/jsm/`).

```javascript
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
```

---

## Animation

| Class | Description |
|-------|-------------|
| `AnimationClipCreator` | Create animation clips programmatically |
| `CCDIKSolver` | Inverse kinematics solver for skinned meshes |
| `MMDPhysics` | MMD physics simulation |
| `MMDAnimationHelper` | MMD animation helper |
| `MorphAnimMesh` | Mesh with morph target animation |

### CCDIKSolver

```javascript
import { CCDIKSolver } from 'three/addons/animation/CCDIKSolver.js';
const iksolver = new CCDIKSolver(mesh, iks);
iksolver.update(); // Call in render loop
```

---

## Controls

| Class | Import Path | Description |
|-------|-------------|-------------|
| `OrbitControls` | `controls/OrbitControls.js` | Orbit/pan/zoom around target |
| `MapControls` | `controls/MapControls.js` | Like OrbitControls but pan is default |
| `TrackballControls` | `controls/TrackballControls.js` | Free rotation without up constraint |
| `FlyControls` | `controls/FlyControls.js` | Flight simulator controls |
| `FirstPersonControls` | `controls/FirstPersonControls.js` | FPS-style controls |
| `PointerLockControls` | `controls/PointerLockControls.js` | Pointer lock (FPS) |
| `TransformControls` | `controls/TransformControls.js` | Gizmo for translate/rotate/scale |
| `ArcballControls` | `controls/ArcballControls.js` | Arcball rotation with focus point |

### OrbitControls (most common)

```javascript
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 1;
controls.maxDistance = 100;
controls.maxPolarAngle = Math.PI / 2;
controls.update(); // Call in render loop if enableDamping
```

**Key Properties:**
- `enableRotate/Zoom/Pan` — Toggle controls (default true)
- `enableDamping` — Inertia (default false)
- `dampingFactor` — Damping amount (default 0.05)
- `rotateSpeed`, `zoomSpeed`, `panSpeed`
- `minDistance/maxDistance` — Zoom limits
- `minPolarAngle/maxPolarAngle` — Vertical angle limits
- `minAzimuthAngle/maxAzimuthAngle` — Horizontal angle limits
- `target: Vector3` — Orbit center point
- `autoRotate`, `autoRotateSpeed`
- `screenSpacePanning` — Default true

### TransformControls

```javascript
import { TransformControls } from 'three/addons/controls/TransformControls.js';
const controls = new TransformControls(camera, renderer.domElement);
controls.addEventListener('dragging-changed', (e) => { orbitControls.enabled = !e.value; });
scene.add(controls);
controls.attach(mesh);
// Switch modes: controls.setMode('translate' | 'rotate' | 'scale')
```

---

## Curves

| Class | Description |
|-------|-------------|
| `CurveExtras` | Additional curve types |
| `NURBSCurve` | NURBS curve |
| `NURBSSurface` | NURBS surface |
| `NURBSVolume` | NURBS volume |

---

## Effects

| Class | Description |
|-------|-------------|
| `AnaglyphEffect` | Anaglyph 3D (red/cyan glasses) |
| `ParallaxBarrierEffect` | Parallax barrier 3D |
| `StereoEffect` | Side-by-side stereo |
| `OutlineEffect` | Cartoon outline effect |

---

## Environments

| Class | Description |
|-------|-------------|
| `EnvironmentTextureGenerator` | Generate environment textures |
| `RoomEnvironment` | Procedural room environment for PBR |

### RoomEnvironment

```javascript
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
const env = new RoomEnvironment(renderer);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(env, 0.04).texture;
```

---

## Exporters

| Class | Import Path | Exports To |
|-------|-------------|------------|
| `GLTFExporter` | `exporters/GLTFExporter.js` | glTF/GLB |
| `OBJExporter` | `exporters/OBJExporter.js` | OBJ |
| `STLExporter` | `exporters/STLExporter.js` | STL |
| `PLYExporter` | `exporters/PLYExporter.js` | PLY |
| `ColladaExporter` | `exporters/ColladaExporter.js` | COLLADA (DAE) |
| `MMDExporter` | `exporters/MMDExporter.js` | MMD (PMD/PMX) |
| `DRACOExporter` | `exporters/DRACOExporter.js` | DRACO compressed |
| `USDZExporter` | `exporters/USDZExporter.js` | USDZ (AR Quick Look) |

### GLTFExporter

```javascript
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
const exporter = new GLTFExporter();
exporter.parse(scene, (result) => { /* save result */ }, (error) => {}, { binary: true });
// Or async:
const glb = await exporter.parseAsync(scene, { binary: true });
```

---

## Generators

| Class | Description |
|-------|-------------|
| `CityGenerator` | Procedural city generation |
| `ForestGenerator` | Procedural forest generation |
| `RoundedBoxGeometry` | Box with rounded corners |
| `TeapotGeometry` | Utah teapot |
| `ParametricGeometry` | Parametric surface |

---

## Geometries (Addon)

| Class | Import Path | Description |
|-------|-------------|-------------|
| `BoxLineGeometry` | `geometries/BoxLineGeometry.js` | Box as line segments |
| `ConvexGeometry` | `geometries/ConvexGeometry.js` | Convex hull from points |
| `DecalGeometry` | `geometries/DecalGeometry.js` | Decal projection |
| `ParametricGeometry` | `geometries/ParametricGeometry.js` | Parametric surface |
| `RoundedBoxGeometry` | `geometries/RoundedBoxGeometry.js` | Rounded box |
| `TeapotGeometry` | `geometries/TeapotGeometry.js` | Utah teapot |
| `TextGeometry` | `geometries/TextGeometry.js` | 3D text from font |
| `WireframeGeometry2` | `geometries/WireframeGeometry2.js` | Wireframe with Line2 |

### TextGeometry

```javascript
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
const font = await new FontLoader().loadAsync('fonts/helvetiker_regular.typeface.json');
const geo = new TextGeometry('Hello 3D', { font, size: 1, height: 0.2, curveSegments: 12 });
```

### DecalGeometry

```javascript
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';
const decalGeo = new DecalGeometry(mesh, position, orientation, size);
const decalMesh = new THREE.Mesh(decalGeo, decalMaterial);
```

---

## Helpers (Addon)

| Class | Description |
|-------|-------------|
| `LightProbeHelper` | Visualize LightProbe |
| `LightProbeGenerator` | Generate LightProbe from cube map or scene |
| `PositionalAudioHelper` | Visualize PositionalAudio cone |
| `RectAreaLightHelper` | Visualize RectAreaLight |
| `VertexNormalsHelper` | Show vertex normals |
| `VertexTangentsHelper` | Show vertex tangents |

---

## Interaction

| Class | Description |
|-------|-------------|
| `SelectionBox` | Selection box for picking |
| `SelectionHelper` | Helper for selection box interaction |

---

## Lighting

| Class | Description |
|-------|-------------|
| `LightProbeGenerator` | Generate light probes from environment |
| `ClusteredLighting` | Clustered forward rendering for many lights |

---

## Lights (Addon)

| Class | Description |
|-------|-------------|
| `LightProbe` | Light probe (also in core) |
| `RectAreaLight` | Rectangular area light (also in core) |
| `RectAreaLightUniformsLib` | Required init for RectAreaLight |

### RectAreaLightUniformsLib

```javascript
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
RectAreaLightUniformsLib.init();
```

---

## Lines

| Class | Import Path | Description |
|-------|-------------|-------------|
| `Line2` | `lines/Line2.js` | High-quality fat lines |
| `LineSegments2` | `lines/LineSegments2.js` | High-quality fat line segments |
| `LineMaterial` | `lines/LineMaterial.js` | Material for fat lines |
| `LineSegmentsGeometry` | `lines/LineSegmentsGeometry.js` | Geometry for fat lines |
| `WireframeGeometry2` | `lines/WireframeGeometry2.js` | Wireframe for fat lines |

### Line2 (fat lines)

```javascript
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';

const geo = new LineSegmentsGeometry().setPositions(positionsArray);
const mat = new LineMaterial({ color: 0xffffff, linewidth: 5, resolution: new THREE.Vector2(w, h) });
const line = new Line2(geo, mat);
```

---

## Loaders (Addon)

| Class | Import Path | Loads |
|-------|-------------|-------|
| `GLTFLoader` | `loaders/GLTFLoader.js` | glTF/GLB |
| `DRACOLoader` | `loaders/DRACOLoader.js` | DRACO compressed meshes |
| `KTX2Loader` | `loaders/KTX2Loader.js` | KTX2 compressed textures |
| `OBJLoader` | `loaders/OBJLoader.js` | OBJ |
| `MTLLoader` | `loaders/MTLLoader.js` | MTL materials |
| `FBXLoader` | `loaders/FBXLoader.js` | FBX |
| `ColladaLoader` | `loaders/ColladaLoader.js` | COLLADA (DAE) |
| `STLLoader` | `loaders/STLLoader.js` | STL |
| `PLYLoader` | `loaders/PLYLoader.js` | PLY |
| `PCDLoader` | `loaders/PCDLoader.js` | Point Cloud Data |
| `XYZLoader` | `loaders/XYZLoader.js` | XYZ point cloud |
| `TDSLoader` | `loaders/TDSLoader.js` | 3DS |
| `3MFLoader` | `loaders/3MFLoader.js` | 3D Manufacturing Format |
| `AMFLoader` | `loaders/AMFLoader.js` | AMF |
| `BVHLoader` | `loaders/BVHLoader.js` | Biovision Hierarchy (motion capture) |
| `VRMLLoader` | `loaders/VRMLLoader.js` | VRML |
| `VTKLoader` | `loaders/VTKLoader.js` | VTK |
| `LWOLoader` | `loaders/LWOLoader.js` | LightWave Object |
| `LottieLoader` | `loaders/LottieLoader.js` | Lottie animations |
| `MMDLoader` | `loaders/MMDLoader.js` | MMD (PMD/PMX/VMD) |
| `NRRDLoader` | `loaders/NRRDLoader.js` | NRRD volumetric data |
| `PDBLoader` | `loaders/PDBLoader.js` | Protein Data Bank |
| `PRWMLoader` | `loaders/PRWMLoader.js` | PRWM |
| `RGBELoader` | `loaders/RGBELoader.js` | RGBE (HDR) |
| `EXRLoader` | `loaders/EXRLoader.js` | OpenEXR (HDR) |
| `HDRLoader` (deprecated) | — | Use RGBELoader |
| `TGALoader` | `loaders/TGALoader.js` | TGA |
| `DDSLoader` | `loaders/DDSLoader.js` | DDS compressed |
| `KMZLoader` | `loaders/KMZLoader.js` | KMZ (Google Earth) |
| `ColladaLoader` | `loaders/ColladaLoader.js` | COLLADA |
| `BasisTextureLoader` (deprecated) | — | Use KTX2Loader |
| `FontLoader` | `loaders/FontLoader.js` | Typeface JSON fonts |
| `AssimpJSONLoader` (deprecated) | — | Assimp JSON |
| `GCodeLoader` | `loaders/GCodeLoader.js` | G-Code (3D printing) |
| `3DMLLoader` | `loaders/3DMLLoader.js` | 3DML |
| `IFCLoader` | `loaders/IFCLoader.js` | IFC (BIM) |
| `LDRAWLoader` | `loaders/LDRAWLoader.js` | LDraw (LEGO) |
| `VOXLoader` | `loaders/VOXLoader.js` | MagicaVoxel VOX |
| `SVGLoader` | `loaders/SVGLoader.js` | SVG |
| `TiltLoader` | `loaders/TiltLoader.js` | Tilt Brush |
| `USDZLoader` | `loaders/USDZLoader.js` | USDZ |

### GLTFLoader (most common)

```javascript
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/DRACOLoader.js';

const loader = new GLTFLoader();
const draco = new DRACOLoader();
draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
loader.setDRACOLoader(draco);

const gltf = await loader.loadAsync('model.glb');
scene.add(gltf.scene);
// gltf.animations — array of AnimationClips
// gltf.scene — Scene object
// gltf.scenes — Array of scenes
// gltf.cameras — Array of cameras
// gltf.asset — Asset metadata
```

### RGBELoader (HDR environments)

```javascript
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
const loader = new RGBELoader();
const hdrTexture = await loader.loadAsync('environment.hdr');
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromEquirectangular(hdrTexture).texture;
hdrTexture.dispose();
pmrem.dispose();
```

---

## Materials (Addon)

| Class | Description |
|-------|-------------|
| `WoodNodeMaterial` | Procedural wood material (TSL) |
| `MeshPostProcessingMaterial` | Post-processing material |

---

## Math (Addon)

| Class | Description |
|-------|-------------|
| `Capsule` | Capsule geometry helper (math, not visual) |
| `ConvexHull` | Convex hull computation |
| `OBB` | Oriented Bounding Box |
| `MeshSurfaceSampler` | Sample points on mesh surface |
| `ImprovedNoise` | Perlin noise implementation |
| `SimplexNoise` | Simplex noise |
| `Lut` | Lookup table for color mapping |

### MeshSurfaceSampler

```javascript
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
const sampler = new MeshSurfaceSampler(mesh).build();
const tempPosition = new THREE.Vector3();
sampler.sample(tempPosition); // Random point on surface
```

---

## Misc

| Class | Description |
|-------|-------------|
| `GPUComputationRenderer` | GPU compute via fragment shaders (WebGL) |
| `GPGPU` (deprecated) | Legacy GPGPU |
| `MD2Character` | MD2 character |
| `MD2CharacterComplex` | MD2 character complex |
| `WebGLDetector` | Detect WebGL support |
| `WebGPUDetector` | Detect WebGPU support |
| `TimelinerController` | Timeliner animation controller |
| `Volume` | Volumetric data container |
| `VolumeSlice` | Slice of volumetric data |
| `DataUtils` | Data manipulation utilities |
| `TextureUtils` | Texture utilities |
| `BufferGeometryUtils` | Geometry manipulation utilities |

### GPUComputationRenderer

```javascript
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js';
const gpuCompute = new GPUComputationRenderer(width, height, renderer);
const dtPosition = gpuCompute.createTexture();
const positionVariable = gpuCompute.addVariable('texturePosition', positionShader, dtPosition);
gpuCompute.init();
// In render loop:
gpuCompute.compute();
const posTexture = gpuCompute.getCurrentRenderTarget(positionVariable).texture;
```

### BufferGeometryUtils

```javascript
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
const merged = BufferGeometryUtils.mergeGeometries([geo1, geo2, geo3]);
const simplified = BufferGeometryUtils.mergeVertices(geometry, tolerance);
```

---

## Modifiers

| Class | Description |
|-------|-------------|
| `SimplifyModifier` | Mesh simplification |
| `EdgeSplitModifier` | Edge split for sharp edges |
| `SubdivisionModifier` | Subdivision surface |
| `TessellateModifier` | Tessellation modifier |

---

## Objects (Addon)

| Class | Description |
|-------|-------------|
| `Lensflare` | Lens flare effect |
| `MarchingCubes` | Metaball/marching cubes |
| `Reflector` | Planar reflection |
| `Refractor` | Planar refraction |
| `Water` | Water surface with reflections |
| `Sky` | Procedural sky dome |
| `ShadowMesh` | Shadow-only mesh |
| `SkinningEntity` | Skinning entity for WebGPU |

### Reflector

```javascript
import { Reflector } from 'three/addons/objects/Reflector.js';
const reflector = new Reflector(geometry, {
  clipBias: 0.003,
  textureWidth: 1024,
  textureHeight: 1024,
  color: 0x777777
});
scene.add(reflector);
```

### Sky

```javascript
import { Sky } from 'three/addons/objects/Sky.js';
const sky = new Sky();
sky.scale.setScalar(10000);
scene.add(sky);
sky.material.uniforms.turbidity.value = 10;
sky.material.uniforms.rayleigh.value = 2;
sky.material.uniforms.sunPosition.value.copy(sunPosition);
```

---

## Physics

| Class | Description |
|-------|-------------|
| `AmmoPhysics` | Ammo.js physics integration |
| `RapierPhysics` | Rapier physics integration |
| `PhysicsEntity` | Physics entity for WebGPU |

---

## Postprocessing

| Class | Import Path | Description |
|-------|-------------|-------------|
| `EffectComposer` | `postprocessing/EffectComposer.js` | Post-processing pipeline |
| `RenderPass` | `postprocessing/RenderPass.js` | Base render pass |
| `ShaderPass` | `postprocessing/ShaderPass.js` | Custom shader pass |
| `CopyPass` | `postprocessing/CopyPass.js` | Copy buffer |
| `OutputPass` | `postprocessing/OutputPass.js` | Output with tone mapping |
| `MaskPass` | `postprocessing/MaskPass.js` | Stencil mask pass |
| `ClearMaskPass` | `postprocessing/ClearMaskPass.js` | Clear stencil mask |
| `BloomPass` | `postprocessing/BloomPass.js` | Bloom effect |
| `UnrealBloomPass` | `postprocessing/UnrealBloomPass.js` | Unreal-style bloom |
| `FXAAShader` / `FXAAPass` | `postprocessing/FXAA...` | Fast approximate AA |
| `SMAAPass` | `postprocessing/SMAAPass.js` | Subpixel morphological AA |
| `TAARenderPass` | `postprocessing/TAARenderPass.js` | Temporal AA |
| `SSAOPass` | `postprocessing/SSAOPass.js` | Screen-space ambient occlusion |
| `SSRPass` | `postprocessing/SSRPass.js` | Screen-space reflections |
| `OutlinePass` | `postprocessing/OutlinePass.js` | Object outline |
| `AfterimagePass` | `postprocessing/AfterimagePass.js` | Motion trail/afterimage |
| `BokehPass` | `postprocessing/BokehPass.js` | Depth of field |
| `FilmPass` | `postprocessing/FilmPass.js` | Film grain/scanlines |
| `GlitchPass` | `postprocessing/GlitchPass.js` | Glitch effect |
| `HalftonePass` | `postprocessing/HalftonePass.js` | Halftone effect |
| `LUTPass` | `postprocessing/LUTPass.js` | Color LUT |
| `WaterPass` | `postprocessing/WaterPass.js` | Water effect |
| `RenderPixelatedPass` | `postprocessing/RenderPixelatedPass.js` | Pixelated rendering |
| `RGBShiftShader` | `postprocessing/RGBShiftShader.js` | RGB shift |
| `DotScreenPass` | `postprocessing/DotScreenPass.js` | Dot screen |
| `SAOPass` | `postprocessing/SAOPass.js` | Scalable ambient obscurance |
| `TAARenderPass` | `postprocessing/TAARenderPass.js` | Temporal AA render pass |
| `TexturePass` | `postprocessing/TexturePass.js` | Render a texture pass |

### EffectComposer Setup

```javascript
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.8, // strength
  0.4, // radius
  0.85 // threshold
);
composer.addPass(bloomPass);
composer.addPass(new OutputPass());

// In render loop:
composer.render();
```

---

## Renderers (Addon)

| Class | Description |
|-------|-------------|
| `CSS2DRenderer` | Render HTML elements at 3D positions |
| `CSS3DRenderer` | Render HTML elements with 3D transforms |
| `SVGRenderer` | Render scene as SVG |

### CSS2DRenderer

```javascript
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(width, height);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0';
document.body.appendChild(labelRenderer.domElement);

const label = new CSS2DObject(document.createElement('div'));
label.element.textContent = 'Hello';
label.position.set(0, 2, 0);
mesh.add(label);

// In render loop:
labelRenderer.render(scene, camera);
```

---

## Shaders (Addon)

| Shader | Description |
|-------|-------------|
| `ACESFilmicToneMappingShader` | ACES tone mapping |
| `AfterimageShader` | Afterimage effect |
| `BasicShader` | Basic passthrough |
| `BleachBypassShader` | Bleach bypass |
| `BlendShader` | Blend two textures |
| `BokehShader` | Bokeh DoF |
| `BrightnessContrastShader` | Brightness/contrast |
| `ColorCorrectionShader` | Color correction |
| `ConvolutionShader` | Convolution kernel |
| `CopyShader` | Copy texture |
| `DOFMipMapShader` | DoF mip map |
| `DepthLimitedBlurShader` | Depth-aware blur |
| `DigitalGlitch` | Digital glitch |
| `FXAAShader` | FXAA |
| `FilmShader` | Film grain |
| `FocusShader` | Focus/vignette |
| `FreiChenShader` | Frei-Chen edge detection |
| `FresnelShader` | Fresnel effect |
| `HalftoneShader` | Halftone |
| `HorizontalBlurShader` | Horizontal blur |
| `HorizontalTiltShiftShader` | Horizontal tilt shift |
| `HueSaturationShader` | Hue/saturation |
| `KaleidoShader` | Kaleidoscope |
| `LuminosityHighPassShader` | Luminosity high pass (bloom) |
| `LuminosityShader` | Luminosity |
| `MirrorShader` | Mirror |
| `NormalMapShader` | Normal map from height |
| `OceanShader` | Ocean water |
| `ParallaxShader` | Parallax mapping |
| `PixelShader` | Pixelation |
| `RGBShiftShader` | RGB shift |
| `SAOShader` | Scalable AO |
| `SMAAShader` | SMAA |
| `SSAOShader` | SSAO |
| `SepiaShader` | Sepia |
| `SobelShader` | Sobel edge detection |
| `TechnicolorShader` | Technicolor |
| `ToneMappingShader` | Generic tone mapping |
| `ToonShader` | Toon shading |
| `TriangleBlurShader` | Triangle blur |
| `VerticalBlurShader` | Vertical blur |
| `VerticalTiltShiftShader` | Vertical tilt shift |
| `VignetteShader` | Vignette |
| `VolumeShader` | Volume rendering |
| `WaterRefractionShader` | Water refraction |

---

## TSL (Addon)

TSL addons include additional TSL functions and utilities beyond core TSL. See `tsl.md` for the core TSL API.

| Module | Description |
|-------|-------------|
| `tsl/function/...` | Additional TSL functions |
| `tsl/utils/...` | TSL utilities |

---

## Transpiler

| Class | Description |
|-------|-------------|
| `GLSLASTParser` | Parse GLSL to AST |
| `TSAASTParser` | Parse TypeScript to AST |
| `Transpiler` | Transpile between shader languages |

---

## Utils

| Class | Description |
|-------|-------------|
| `BufferGeometryUtils` | Geometry utilities (merge, simplify, etc.) |
| `CameraUtils` | Camera utilities |
| `GeometryCompressionUtils` | Geometry compression |
| `MeshBVHHelper` | BVH visualization |
| `MeshBVH` | Bounding Volume Hierarchy for raycasting |
| `PackedPhongMaterial` | Packed normal material |
| `RoughnessMipmapper` | Generate roughness mipmaps |
| `SceneUtils` | Scene utilities |
| `ShadowMapViewer` | Shadow map preview |
| `ShadowUtils` | Shadow utilities |
| `TextureUtils` | Texture utilities |
| `UVsDebug` | UV visualization |
| `WorkerPool` | Web Worker pool |
| `WebGLTextureUtils` | WebGL texture utilities |

### SceneUtils

```javascript
import * as SceneUtils from 'three/addons/utils/SceneUtils.js';
const object = SceneUtils.createMeshFromGeometry(geometry, material);
const objects = SceneUtils.sortObjects(scene, camera);
```

---

## WebXR

| Class | Import Path | Description |
|-------|-------------|-------------|
| `ARButton` | `webxr/ARButton.js` | AR session button |
| `VRButton` | `webxr/VRButton.js` | VR session button |
| `XRControllerModelFactory` | `webxr/XRControllerModelFactory.js` | Controller 3D model |
| `XRHandModelFactory` | `webxr/XRHandModelFactory.js` | Hand 3D model |
| `XREstimatedLight` | `webxr/XREstimatedLight.js` | Real-world lighting estimation |
| `XRPlanes` | `webxr/XRPlanes.js` | Real-world plane detection |
| `XRGestures` | `webxr/XRGestures.js` | Hand gesture recognition |
| `Text2D` | `webxr/Text2D.js` | 2D text in XR |

### VRButton

```javascript
import { VRButton } from 'three/addons/webxr/VRButton.js';
document.body.appendChild(VRButton.createButton(renderer));
renderer.xr.enabled = true;
```

### XRControllerModelFactory

```javascript
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
const factory = new XRControllerModelFactory();
const controller = renderer.xr.getController(0);
const controllerGrip = renderer.xr.getControllerGrip(0);
controllerGrip.add(factory.createControllerModel(controllerGrip));
scene.add(controller);
scene.add(controllerGrip);
```

---

## Additional Addons

### Exporters (Additional)

| Class | Import Path | Exports To |
|-------|-------------|------------|
| `EXRExporter` | `exporters/EXRExporter.js` | OpenEXR (HDR) |

### Utils (Additional)

| Class | Import Path | Description |
|-------|-------------|-------------|
| `SkeletonUtils` | `utils/SkeletonUtils.js` | Skeleton/skinning utilities |
| `CameraUtils` | `utils/CameraUtils.js` | Camera utilities (e.g., `frameCorners`) |

#### SkeletonUtils

```javascript
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
const cloned = SkeletonUtils.clone(skeletonMesh); // Deep clone with skeleton
SkeletonUtils.retarget(target, source, options); // Retarget animation
```

### ConvexHull Internals

| Class | Description |
|-------|-------------|
| `Face` | A face in the convex hull |
| `HalfEdge` | A half-edge in the convex hull |
| `ConvexHull` | The convex hull computation class |
| `VertexNode` | A vertex node in the convex hull |
| `VertexList` | A linked list of vertex nodes |

### DragControls

Drag and drop objects in 3D space.

```javascript
import { DragControls } from 'three/addons/controls/DragControls.js';
const controls = new DragControls(objects, camera, renderer.domElement);
controls.addEventListener('dragstart', (e) => { orbitControls.enabled = false; });
controls.addEventListener('dragend', (e) => { orbitControls.enabled = true; });
```

### 3DMLoader

Loader for 3D Manufacturing Format (3MF) files.

```javascript
import { ThreeMFLoader } from 'three/addons/loaders/3DMLoader.js';
const loader = new ThreeMFLoader();
loader.load('model.3dm', (object) => scene.add(object));
```

### LookupTable (Lut)

Color lookup table for mapping scalar values to colors. Useful for scientific visualization.

```javascript
import { Lut } from 'three/addons/math/Lut.js';
const lut = new Lut('rainbow', 512); // colormap name, size
lut.setMax(20); // max value
const color = lut.getColor(15); // get color for value
```
