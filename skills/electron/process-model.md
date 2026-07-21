# Electron Process Model

Electron inherits its multi-process architecture from Chromium, making it architecturally similar to a modern web browser.

## Why Not a Single Process?

Early browsers used a single process for all functionality. While this meant less overhead per tab, one website crashing or hanging would affect the entire browser.

## The Multi-Process Model

The Chrome team decided each tab would render in its own process, limiting harm from buggy or malicious code. A single browser process controls these processes and the application lifecycle.

Electron applications are structured similarly. As an app developer, you control three types of processes: **main**, **renderer**, and **utility**.

## The Main Process

Each Electron app has a single main process, which acts as the application's entry point. The main process runs in a Node.js environment, meaning it has the ability to `require` modules and use all of Node.js APIs.

### Responsibilities

- **Window management**: Creating and managing application windows (`BrowserWindow` instances)
- **Application lifecycle**: Controlling app lifecycle via events (`ready`, `window-all-closed`, `quit`, etc.)
- **Native APIs**: Access to native operating system APIs (menus, dialogs, clipboard, tray, etc.)

### Example

```javascript
const { app, BrowserWindow } = require('electron/main')

app.whenReady().then(() => {
  const win = new BrowserWindow({ width: 800, height: 600 })
  win.loadFile('index.html')
})
```

## The Renderer Process

Each Electron app spawns a separate renderer process for each open `BrowserWindow` (and each web embed). A renderer is responsible for rendering web content.

### Key Characteristics

- Code behaves according to web standards (as Chromium implements them)
- HTML file is the entry point
- UI styling via CSS
- Executable JavaScript via `<script>` elements
- **No direct access to `require` or Node.js APIs** (by default)
- Use bundler toolchains (webpack, parcel) to include NPM modules
- Can be spawned with full Node.js environment for development (disabled by default for security)

### Example

```html
<!DOCTYPE html>
<html>
  <body>
    <h1>Hello from Electron renderer!</h1>
    <script src="./renderer.js"></script>
  </body>
</html>
```

## Preload Scripts

Preload scripts contain code that executes in a renderer process before its web content begins loading. These scripts run within the renderer context but are granted more privileges by having access to Node.js APIs.

### Attaching a Preload Script

```javascript
const { BrowserWindow } = require('electron')

const win = new BrowserWindow({
  webPreferences: {
    preload: path.join(__dirname, 'preload.js')
  }
})
```

### Context Isolation

Because of `contextIsolation` (enabled by default since Electron 12), preload scripts are isolated from the renderer's main world. You **cannot** directly attach variables to `window`:

```javascript
// ❌ This won't work with context isolation
window.myAPI = { desktop: true }
// console.log(window.myAPI) => undefined in renderer
```

Instead, use `contextBridge` to securely expose APIs:

```javascript
// ✅ Correct way
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
  desktop: true
})
// console.log(window.myAPI) => { desktop: true } in renderer
```

### Main Use Cases

1. **IPC bridging**: Expose `ipcRenderer` helpers to trigger main process tasks from the renderer
2. **Desktop-only logic**: Add custom properties for desktop-specific behavior when wrapping a web app

## The Utility Process

The utility process is a Node.js process that can be spawned from the main process to run CPU-intensive tasks without blocking the main process.

## Process-Specific Module Aliases (TypeScript)

Electron's npm package exports subpaths with TypeScript type definitions:

- `electron/main` — types for all main process modules
- `electron/renderer` — types for all renderer process modules
- `electron/common` — types for modules that can run in both processes

```javascript
const { shell } = require('electron/common')
const { app } = require('electron/main')
```

These aliases have no impact on runtime — they're for typechecking and autocomplete only.
