# Inter-Process Communication (IPC)

Use the `ipcMain` and `ipcRenderer` modules to communicate between Electron processes.

## IPC Channels

IPC channels are named strings used to identify messages between processes. Understanding context-isolated processes is important — preload scripts bridge the renderer and main process securely.

## Pattern 1: Renderer to Main (One-Way)

Use `ipcRenderer.send` paired with `ipcMain.on` for one-way communication.

### Main Process

```javascript
const { app, BrowserWindow, ipcMain } = require('electron/main')

function handleSetTitle(event, title) {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(title)
}

app.whenReady().then(() => {
  ipcMain.on('set-title', handleSetTitle)
  createWindow()
})
```

### Preload Script

```javascript
const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title) => ipcRenderer.send('set-title', title)
})
```

### Renderer

```javascript
const setButton = document.getElementById('btn')
const titleInput = document.getElementById('title')

setButton.addEventListener('click', () => {
  const title = titleInput.value
  window.electronAPI.setTitle(title)
})
```

## Pattern 2: Renderer to Main (Two-Way)

Use `ipcRenderer.invoke` paired with `ipcMain.handle` for request-response communication.

### Main Process

```javascript
const { app, BrowserWindow, ipcMain, dialog } = require('electron/main')

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (!canceled) {
    return filePaths[0]
  }
}

app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen)
  createWindow()
})
```

### Preload Script

```javascript
const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile')
})
```

### Renderer

```javascript
const btn = document.getElementById('btn')
btn.addEventListener('click', async () => {
  const filePath = await window.electronAPI.openFile()
  filePathElement.innerText = filePath
})
```

### Legacy Approaches

- `ipcRenderer.sendSync` — synchronous, blocks the renderer (avoid)
- `remote` module — deprecated and removed in Electron 14

## Pattern 3: Main to Renderer

Send messages from main to renderer via `webContents.send`.

### Main Process

```javascript
const { app, BrowserWindow, Menu, ipcMain } = require('electron/main')

function createWindow() {
  const mainWindow = new BrowserWindow({
    webPreferences: { preload: path.join(__dirname, 'preload.js') }
  })

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        { click: () => mainWindow.webContents.send('update-counter', 1), label: 'Increment' },
        { click: () => mainWindow.webContents.send('update-counter', -1), label: 'Decrement' }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)
  mainWindow.loadFile('index.html')
}
```

### Preload Script

```javascript
const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateCounter: (callback) => ipcRenderer.on('update-counter', (_event, value) => callback(value)),
  counterValue: (value) => ipcRenderer.send('counter-value', value)
})
```

### Renderer

```javascript
window.electronAPI.onUpdateCounter((value) => {
  const oldValue = Number(counterElement.innerText)
  const newValue = oldValue + value
  counterElement.innerText = newValue.toString()
  window.electronAPI.counterValue(newValue)
})
```

## Pattern 4: Renderer to Renderer

There's no direct renderer-to-renderer IPC. Two options:

1. **Main process as message broker**: Send from renderer A → main → forward to renderer B
2. **MessagePort**: Pass a `MessagePort` from the main process to both renderers for direct communication after initial setup

## Object Serialization

Objects sent over IPC are serialized using the Structured Clone Algorithm. This means:
- Functions, DOM elements, and class instances cannot be sent
- Plain objects, arrays, strings, numbers, booleans, null, Date, RegExp, Map, Set, ArrayBuffer, etc. are supported
- Sending non-JS objects over IPC throws an exception (since Electron 9)

## ipcMain API Reference

| Method | Description |
|--------|-------------|
| `ipcMain.on(channel, listener)` | Listen for messages |
| `ipcMain.off(channel, listener)` | Remove listener |
| `ipcMain.once(channel, listener)` | Listen once |
| `ipcMain.handle(channel, listener)` | Handle invoke requests (async) |
| `ipcMain.handleOnce(channel, listener)` | Handle once |
| `ipcMain.removeHandler(channel)` | Remove handler |
| `ipcMain.removeAllListeners([channel])` | Remove all listeners |

## ipcRenderer API Reference

| Method | Description |
|--------|-------------|
| `ipcRenderer.on(channel, listener)` | Listen for messages |
| `ipcRenderer.off(channel, listener)` | Remove listener |
| `ipcRenderer.once(channel, listener)` | Listen once |
| `ipcRenderer.send(channel, ...args)` | Send one-way message |
| `ipcRenderer.invoke(channel, ...args)` | Send and await response |
| `ipcRenderer.sendSync(channel, ...args)` | Send synchronously (avoid) |
| `ipcRenderer.postMessage(channel, message, [transfer])` | Send with transferable objects |
| `ipcRenderer.sendToHost(channel, ...args)` | Send to host element (webview) |

## MessagePorts

`MessagePort` is a web API for passing messages between different contexts. Electron extends this:

- **Main process**: Can receive MessagePorts via `ipcMain.on` event
- **Extension: close event**: Electron adds a `close` event to MessagePort
- **Use cases**:
  - Setting up a MessageChannel between two renderers
  - Worker process communication
  - Reply streams
  - Direct communication between main process and context-isolated page's main world
