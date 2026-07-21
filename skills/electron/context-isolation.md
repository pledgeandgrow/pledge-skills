# Context Isolation

## What is it?

Context Isolation is a feature that ensures both your preload scripts and Electron's internal logic run in a separate context to the website you load in a `webContents`. This is important for security — it prevents the website from accessing Electron internals or the powerful APIs your preload script has access to.

The `window` object that your preload script has access to is a **different object** than the website's `window`:

```javascript
// In preload script
window.hello = 'wave'

// In renderer (website)
console.log(window.hello) // => undefined
```

Context isolation has been **enabled by default since Electron 12**, and is a recommended security setting for all applications.

## Migration

### Before: Context Isolation Disabled

```javascript
// preload.js — old way
window.myAPI = {
  doSomething: () => { /* ... */ }
}
```

### After: Context Isolation Enabled

Use `contextBridge` to expose APIs:

```javascript
// preload.js — new way
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
  doSomething: () => { /* ... */ }
})
```

## contextBridge API

### contextBridge.exposeInMainWorld(apiKey, api)

Exposes an API to the renderer's main world (the website's context).

```javascript
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  loadPreferences: () => ipcRenderer.invoke('load-prefs')
})
```

### contextBridge.exposeInIsolatedWorld(worldId, apiKey, api)

Exposes an API to an isolated world identified by `worldId`.

### contextBridge.executeInMainWorld(executionScript) [Experimental]

Executes a script in the main world.

## Glossary

- **Main World**: The JavaScript context that your renderer's web content runs in
- **Isolated World**: The JavaScript context that preload scripts and Electron internal logic run in

## Security Considerations

Just enabling `contextIsolation` and using `contextBridge` does **not** automatically mean everything is safe.

### Unsafe Code

```javascript
// ❌ Bad — exposes raw ipcRenderer.send without filtering
contextBridge.exposeInMainWorld('myAPI', {
  send: ipcRenderer.send
})
```

This allows any website to send arbitrary IPC messages.

### Safe Code

```javascript
// ✅ Good — provides one method per IPC message
contextBridge.exposeInMainWorld('myAPI', {
  loadPreferences: () => ipcRenderer.invoke('load-prefs')
})
```

### Rules for Safe API Exposure

1. **Never expose the entire `ipcRenderer` module** — expose specific methods only
2. **Wrap IPC calls in specific functions** — one method per channel
3. **Validate arguments** — don't pass arbitrary user input to privileged APIs
4. **Don't expose Node.js APIs** — `require`, `process`, `fs`, etc. should not be accessible from the renderer

### API Functions

Functions exposed via `contextBridge` are proxied — they run in the isolated world but can be called from the main world. Return values are also proxied.

### Exposing ipcRenderer

The recommended pattern is to expose specific IPC methods:

```javascript
contextBridge.exposeInMainWorld('electronAPI', {
  // One-way: renderer → main
  setTitle: (title) => ipcRenderer.send('set-title', title),
  // Two-way: renderer → main with response
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  // Listen: main → renderer
  onUpdateCounter: (callback) => ipcRenderer.on('update-counter', (_event, value) => callback(value))
})
```

### Exposing Node Global Symbols

Node.js global symbols (`require`, `process`, `Buffer`, etc.) cannot be exposed via `contextBridge`. If you need to expose specific Node functionality, wrap it in a function.

## Usage with TypeScript

When using TypeScript, you can extend the `Window` interface to get type safety:

```typescript
// preload.ts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile')
})

// renderer.d.ts
export interface IElectronAPI {
  openFile: () => Promise<string>
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
```
