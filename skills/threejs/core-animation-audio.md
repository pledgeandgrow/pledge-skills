# Core — Animation & Audio

## Animation

### AnimationClip

Represents a reusable set of keyframe tracks. Stored in `Object3D.animations` array.

```javascript
const clip = THREE.AnimationClip.findByName(object.animations, 'dance');
const action = mixer.clipAction(clip);
action.play();
```

**Properties:**
- `name: String` — Name of the clip
- `tracks: Array` — Array of `KeyframeTrack` instances
- `duration: Float` — Total duration (seconds). Auto-calculated from tracks if not set
- `uuid: String` — Unique identifier
- `blendMode: Number` — `NormalAnimationBlendMode` (default) or `AdditiveAnimationBlendMode`

**Methods:**
- `CreateFromMorphTargetSequence(name, morphTargetSequence, fps, noLoop)` — Static factory
- `CreateClipsFromMorphTargetSequences(morphTargets, fps, noLoop)` — Static factory
- `parse(json)` — Static, parse from JSON
- `parseAnimation(animation, bones)` — Static, parse legacy format
- `toJSON()` — Serialize to JSON
- `clone()` — Deep clone
- `trim(start, end)` — Trim tracks to time range
- `validate()` — Check for empty tracks, out-of-order keys, etc.
- `optimize(fps)` — Remove equivalent sequential keys
- `resetDuration()` — Recalculate duration from tracks

### AnimationMixer

Player for animations on a particular object in the scene. Manages the animation timeline.

```javascript
const mixer = new THREE.AnimationMixer(mesh);
const action = mixer.clipAction(clip);
action.play();

// In render loop
const delta = clock.getDelta();
mixer.update(delta);
```

**Properties:**
- `time: Float` — Global mixer time
- `timeScale: Float` — Scaling factor for time (default 1). Negative = reverse

**Methods:**
- `clipAction(clip, root)` — Returns an `AnimationAction` for the clip, creating if needed
- `existingAction(clip, root)` — Returns existing action without creating
- `stopAllAction()` — Deactivates all actions
- `update(deltaTime)` — Advance the mixer by deltaTime seconds
- `getRoot()` — Returns the mixer's root object
- `uncacheClip(clip)` — Free all resources for a clip
- `uncacheRoot(root)` — Free all resources for a root
- `uncacheAction(clip, root)` — Free resources for a specific action

**Events:** `'loop'`, `'finished'`

### AnimationAction

Schedules the playback of an `AnimationClip`. Created via `mixer.clipAction()`.

```javascript
const action = mixer.clipAction(clip);
action.setDuration(2).setLoop(THREE.LoopRepeat, 3).play();
```

**Properties:**
- `time: Float` — Current local time
- `timeScale: Float` — Time scaling factor
- `weight: Float` — Weight (0-1) for blending
- `loopMode: Number` — `LoopOnce`, `LoopRepeat`, `LoopPingPong`
- `repetitions: Number` — Number of repetitions (Infinity default)
- `clampWhenFinished: Boolean` — Keep last frame when finished
- `zeroSlopeAtStart/End: Boolean` — Default true

**Methods:**
- `play()` — Start/restart playback
- `stop()` — Stop playback
- `reset()` — Reset to initial state
- `setDuration(duration)` — Set duration via timeScale
- `setLoop(mode, repetitions)` — Set loop mode
- `setEffectiveWeight(weight)` — Set weight, respecting group weight
- `setEffectiveTimeScale(timeScale)` — Set timeScale, respecting group
- `getEffectiveWeight()` — Get effective weight
- `getEffectiveTimeScale()` — Get effective timeScale
- `setWeight(weight)` — Set weight
- `setTime(time)` — Jump to specific time
- `syncWith(action)` — Sync time/timeScale with another action
- `halt(duration)` — Gradually reduce weight to 0 over duration
- `warp(statTimeScale, endTimeScale, duration)` — Gradually change timeScale
- `crossFadeFrom(fadeOutAction, duration, warp)` — Cross-fade from another action
- `crossFadeTo(fadeInAction, duration, warp)` — Cross-fade to another action
- `fadeIn(duration)` — Increase weight from 0 to 1
- `fadeOut(duration)` — Decrease weight from 1 to 0
- `isRunning()` — Whether action is running
- `isScheduled()` — Whether action is scheduled on mixer
- `startAt(time)` — Set start time
- `stopFading()` — Stop any fading

### AnimationBlendMode
- `NormalAnimationBlendMode` — Default blending
- `AdditiveAnimationBlendMode` — Additive blending for layered animations

### AnimationObjectGroup

Groups multiple objects to be animated together as a single unit.

```javascript
const group = new THREE.AnimationObjectGroup(mesh1, mesh2, mesh3);
const mixer = new THREE.AnimationMixer(group);
```

**Properties:**
- `stats: Object` — `{ bindingsPerObject, knownObjects, totalObjects }`
- `uuid: String`

**Methods:**
- `add(...objects)` — Add objects to the group
- `remove(...objects)` — Remove objects
- `uncache(...objects)` — Remove and free resources

### AnimationPropertyBinding

Internal class that resolves property paths (e.g., `["material","opacity"]`) on objects.

### AnimationUtils

Utility functions for animation:
- `arraySlice(array, from, to)` — Typed array safe slice
- `convertArray(array, type, forceClone)` — Convert array type
- `isTypedArray(object)` — Check if typed array
- `getKeyframeOrder(times)` — Get sort order for times
- `sortedArray(values, stride, order)` — Sort values by order
- `flattenJSON(jsonKeys, times, values, valueDestination)` — Flatten animation JSON
- `subclip(clip, name, startFrame, endFrame, fps)` — Extract sub-clip
- `makeClipAdditive(clip)` — Convert clip to additive
- `makeLoopAdditive(clip, referenceFrame)` — Convert loop clip to additive

### KeyframeTrack

Base class for keyframe tracks. A track is a sequence of keyframes for a specific property.

**Properties:**
- `name: String` — Property path (e.g., `.position` or `.morphTargetInfluences[0]`)
- `times: Float32Array` — Sorted keyframe times
- `values: TypedArray` — Keyframe values
- `ValueBufferType: TypedArray` — Constructor for value array
- `TimeBufferType: Float32Array` — Constructor for time array
- `DefaultInterpolation: InterpolationType` — `InterpolateLinear` (default)

**Methods:**
- `InterpolantFactoryMethodLinear(result)` — Create linear interpolant
- `InterpolantFactoryMethodDiscrete(result)` — Create discrete interpolant
- `InterpolantFactoryMethodSmooth(result)` — Create smooth interpolant
- `shift(timeOffset)` — Shift all times
- `scale(timeScale)` — Scale all times
- `trim(start, end)` — Trim to range
- `validate()` — Validate data
- `clone()` — Clone track

**Interpolation Types:**
- `InterpolateDiscrete` — No interpolation, step function
- `InterpolateLinear` — Linear interpolation
- `InterpolateSmooth` — Smooth (Catmull-Rom) interpolation

### KeyframeTrack Subclasses

| Class | Value Type | Use Case |
|-------|-----------|----------|
| `BooleanKeyframeTrack` | Boolean | Toggle properties |
| `ColorKeyframeTrack` | Color | Color animation |
| `NumberKeyframeTrack` | Number | Scalar animation |
| `QuaternionKeyframeTrack` | Quaternion | Rotation |
| `StringKeyframeTrack` | String | State changes |
| `VectorKeyframeTrack` | Vector | Position/Scale |

### AnimationMixerEvent
- `loop` — Fired when an action loops. `{ action, loopDelta }`
- `finished` — Fired when an action finishes. `{ action, direction }`

---

## Audio

### AudioListener

Represents a virtual listener for positional audio. Must be added to the camera.

```javascript
const listener = new THREE.AudioListener();
camera.add(listener);
```

**Properties:**
- `context: AudioContext` — Web Audio API context
- `gain: GainNode` — Master gain node
- `filter: BiquadFilterNode` — Optional filter
- `timeDelta: Float` — Time delta for doppler

**Methods:**
- `getInput()` — Returns the gain node
- `removeFilter()` — Remove filter
- `setFilter(filter)` — Set filter node
- `getFilter()` — Get filter
- `setMasterVolume(value)` — Set master volume
- `getMasterVolume()` — Get master volume
- `updateMatrixWorld(force)` — Update position/orientation

### Audio

Non-positional audio. Plays audio from an `AudioBuffer`.

```javascript
const audio = new THREE.Audio(listener);
audio.setBuffer(audioBuffer);
audio.setLoop(true).setVolume(0.5).play();
```

**Properties:**
- `context: AudioContext`
- `gain: GainNode`
- `autoplay: Boolean` — Default false
- `buffer: AudioBuffer`
- `loop: Boolean` — Default false
- `loopStart/loopEnd: Float` — Loop points (seconds)
- `offset: Float` — Playback offset
- `duration: Float` — Playback duration
- `sourceType: String` — 'empty', 'audioBufferSourceNode', 'mediaNode', 'mediaStreamSourceNode'
- `isPlaying: Boolean`
- `hasPlaybackControl: Boolean`
- `playbackRate: Float` — Default 1
- `progress: Float` — Playback progress (0-1, read-only)
- `directionalCone` — `{ coneInnerAngle, coneOuterAngle, coneOuterGain }`

**Methods:**
- `play()` — Start playback
- `pause()` — Pause playback
- `stop()` — Stop and reset
- `load(file)` — Load audio file (returns Promise)
- `setBuffer(buffer)` — Set audio buffer
- `setLoop(loop)` — Set loop
- `setLoopStart(loopStart)` — Set loop start
- `setLoopEnd(loopEnd)` — Set loop end
- `setMediaElementSource(mediaElement)` — Use HTML media element
- `setMediaStreamSource(mediaStream)` — Use media stream
- `setNodeSource(audioNode)` — Use custom AudioNode
- `setPlaybackRate(rate)` — Set playback rate
- `setVolume(volume)` — Set volume (0-1)
- `getVolume()` — Get volume
- `onEnded()` — Playback ended callback
- `setDirectionalCone(coneInnerAngle, coneOuterAngle, coneOuterGain)` — Set directional cone

### PositionalAudio

Positional audio that respects 3D position and orientation. Extends `Audio`.

```javascript
const sound = new THREE.PositionalAudio(listener);
sound.setBuffer(buffer);
sound.setRefDistance(20);
sound.setDirectionalCone(180, 230, 0.1);
mesh.add(sound);
```

**Additional Properties:**
- `panner: PannerNode` — Web Audio PannerNode
- `pannerModel: String` — 'equalpower' or 'HRTF'

**Additional Methods:**
- `getOutput()` — Returns panner node
- `getRefDistance()` / `setRefDistance(value)`
- `getRolloffFactor()` / `setRolloffFactor(value)`
- `getDistanceModel()` / `setDistanceModel(value)`
- `getMaxDistance()` / `setMaxDistance(value)`
- `setDirectionalCone(coneInnerAngle, coneOuterAngle, coneOuterGain)`

### AudioAnalyser

Analyzes audio data using AnalyserNode.

```javascript
const analyser = new THREE.AudioAnalyser(audio, 32);
const data = analyser.getFrequencyData();
```

**Properties:**
- `analyser: AnalyserNode`
- `frequencyBinCount: Number` — Half of fftSize
- `data: Uint8Array` — Frequency data buffer

**Methods:**
- `getFrequencyData()` — Returns frequency data (0-255 per bin)
- `getAverageFrequency()` — Returns average frequency

### AudioContext / AudioBuffer

- `THREE.AudioContext` — Reference to the Web Audio API `AudioContext`
- `AudioBuffer` — Loaded audio data, typically via `AudioLoader`

---

## AnimationObjectGroup

Groups multiple objects for synchronized animation playback via a single AnimationMixer.

**Constructor:** `new AnimationObjectGroup(...roots)`

**Properties:**
- `stats: Object` — `{ bindingsPerObject, objects, totalObjects }`
- `uuid: String`

**Methods:**
- `add(...roots)` — Add objects to the group
- `remove(...roots)` — Remove objects from the group
- `uncache(...roots)` — Remove and free cached data

---

## AnimationUtils

Utility functions for animation.

**Methods:**
- `AnimationUtils.arraySlice(array, from, to)` — Slice typed array
- `AnimationUtils.convertArray(array, type)` — Convert array to typed array
- `AnimationUtils.isTypedArray(object)` — Check if typed array
- `AnimationUtils.getKeyframeOrder(times)` — Get sorted keyframe order
- `AnimationUtils.sortedArray(values, times, order)` — Sort array by keyframe order
- `AnimationUtils.flattenJSON(jsonKeys, times, values, valuePropertyName)` — Flatten JSON keyframe data

---

## PropertyMixer

Internally used by AnimationMixer to bind property paths to animated values. Not typically used directly.

**Methods:**
- `binding(name)` — Bind a property path
- `accumulate(time, weight)` — Accumulate animation values
- `apply(time)` — Apply accumulated values to the bound object

---

## Animation / Tracks

All track types extend `KeyframeTrack`:

| Track Type | Value Type | Interpolation |
|------------|------------|---------------|
| `BooleanKeyframeTrack` | Boolean | Discrete |
| `ColorKeyframeTrack` | Color (RGB) | Linear or Interpolant |
| `NumberKeyframeTrack` | Number | Linear or Interpolant |
| `QuaternionKeyframeTrack` | Quaternion | QuaternionLinear |
| `StringKeyframeTrack` | String | Discrete |
| `VectorKeyframeTrack` | Vector (any dimension) | Linear or Interpolant |
