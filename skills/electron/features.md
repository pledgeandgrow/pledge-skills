# Electron Features — Examples & How-Tos

## Dark Mode

### Overview

Electron apps automatically adapt native interfaces (file picker, window border, dialogs, context menus) to the OS theme.

### Automatically Update Native Interfaces

Native interfaces update automatically by default. No code needed.

### Automatically Update Your Own Interfaces

Use CSS `prefers-color-scheme` media query:

```css
@media (prefers-color-scheme: dark) {
  body { background: #1e1e1e; color: #e0e0e0; }
}
```

### Manually Update Your Own Interfaces

```javascript
const { nativeTheme } = require('electron')

// Check current theme
console.log(nativeTheme.shouldUseDarkColors)

// Listen for theme changes
nativeTheme.on('updated', () => {
  console.log('Theme changed:', nativeTheme.shouldUseDarkColors)
})
```

### macOS Settings

```javascript
const { systemPreferences } = require('electron')

// Get current appearance
const appearance = systemPreferences.getUserDefault('AppleInterfaceStyle', 'string')
```

## Notifications

### Show Notifications in the Main Process

```javascript
const { Notification } = require('electron')

new Notification({
  title: 'Basic Notification',
  body: 'Notification from the main process'
}).show()
```

### Show Notifications in the Renderer Process

```javascript
const myNotification = new window.Notification('Notification', {
  body: 'Notification from the renderer process'
})
myNotification.onclick = () => { console.log('Notification clicked') }
```

### Platform Considerations

- **Windows**: Requires app user model ID for proper notification display
- **macOS**: Notifications require signing; uses UNNotification API (since Electron 42)
- **Linux**: Uses libnotify

## Web Embeds

Three options for embedding web content in a BrowserWindow:

### Iframes

- Standard HTML `<iframe>` tag
- Same-origin policy applies
- Limited access to Electron APIs
- Good for same-origin content

### WebViews (`<webview>`)

- Electron-specific tag
- Runs in a separate process with its own renderer
- Has access to Electron APIs (if enabled)
- **Note**: Not recommended for untrusted content; use WebContentsView instead

### WebContentsView

- Programmatic API for embedding web content
- Most flexible and secure option
- Can position and resize independently
- Recommended for embedding third-party content

## Keyboard Shortcuts

### Accelerators

Accelerator strings define keyboard shortcuts:
- **Modifiers**: `CommandOrControl` (Cmd on macOS, Ctrl on others), `Control`, `Command`, `Alt`, `Shift`, `Meta`
- **Key codes**: `A` through `Z`, `0` through `9`, `F1` through `F24`, `Space`, `Tab`, etc.
- **Cross-platform**: Use `CommandOrControl` for cross-platform shortcuts

### Local Shortcuts (Menu)

```javascript
const { Menu } = require('electron')

const menu = Menu.buildFromTemplate([
  {
    label: 'File',
    submenu: [
      {
        label: 'Save',
        accelerator: 'CommandOrControl+S',
        click: () => { /* save */ }
      }
    ]
  }
])
Menu.setApplicationMenu(menu)
```

### Global Shortcuts

```javascript
const { globalShortcut } = require('electron')

app.whenReady().then(() => {
  globalShortcut.register('CommandOrControl+Shift+D', () => {
    console.log('Global shortcut triggered')
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
```

### Shortcuts Within a Window (Renderer)

Use standard web APIs in the renderer:
```javascript
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    // Save
  }
})
```

## SpellChecker

### Enabling the Spellchecker

Enabled by default since Electron 8. Powered by Hunspell (Windows/Linux) and native APIs (macOS).

### Setting Languages

```javascript
const { session } = require('electron')

session.defaultSession.setSpellCheckerLanguages(['en-US'])
```

### Context Menu Integration

```javascript
const { session } = require('electron')

session.defaultSession.on('spellcheck-changed', (event, words) => {
  // Build context menu with suggestions
})
```

### Privacy

The spellchecker does **not** use any Google services. Dictionary downloads are from Chromium's CDN.

## Progress Bars

### Overview

Show progress in the OS taskbar/dock:

```javascript
const { BrowserWindow } = require('electron')

const win = BrowserWindow.getFocusedWindow()

// Set progress (0 to 1)
win.setProgressBar(0.5)

// Indeterminate state
win.setProgressBar(-1) // macOS only

// Complete
win.setProgressBar(1)
```

## macOS Dock

### Dock API

```javascript
const { app } = require('electron')

// Hide dock icon
app.dock.hide()

// Show dock icon
app.dock.show()

// Set badge
app.dock.setBadge('New')
```

### Attaching a Context Menu

```javascript
const { Menu } = require('electron')

const menu = Menu.buildFromTemplate([
  { label: 'New Window', click: () => createWindow() }
])

app.dock.setMenu(menu)
```

## Windows Taskbar

### JumpList

```javascript
const { app } = require('electron')

app.setJumpList([
  {
    type: 'tasks',
    items: [
      { type: 'task', title: 'New Window', program: process.execPath, args: '--new-window' }
    ]
  }
])
```

### Thumbnail Toolbars

```javascript
const win = BrowserWindow.getFocusedWindow()
win.setThumbarButtons([
  {
    tooltip: 'Play',
    icon: playIcon,
    click: () => { /* play */ }
  }
])
```

### Icon Overlays

```javascript
win.setOverlayIcon(overlayIcon, 'Status description')
```

### Flash Frame

```javascript
win.flashFrame(true) // Flash taskbar button
```

## Window Customization

### Custom Title Bar

Remove the default title bar:
```javascript
const win = new BrowserWindow({
  titleBarStyle: 'hidden', // macOS
  frame: false // Windows/Linux
})
```

### Native Window Controls (Windows/Linux)

```javascript
const win = new BrowserWindow({
  titleBarStyle: 'hidden',
  titleBarOverlay: {
    color: '#2b2b2b',
    symbolColor: '#ffffff',
    height: 40
  }
})
```

### Custom Traffic Lights (macOS)

```javascript
const win = new BrowserWindow({
  titleBarStyle: 'hiddenInset',
  trafficLightPosition: { x: 10, y: 10 }
})
```

## Accessibility

Electron apps automatically enable accessibility features when assistive technology is detected.

### Manually Enabling

```javascript
const { app } = require('electron')

app.setAccessibilitySupportEnabled(true)
```

### Third-Party Software

On macOS, use VoiceOver. On Windows, use JAWS or NVDA.

## Multithreading

### Web Workers (Renderer)

```javascript
const worker = new Worker('./worker.js')
worker.postMessage({ data })
worker.onmessage = (e) => console.log(e.data)
```

### Worker Threads (Main Process)

```javascript
const { Worker } = require('node:worker_threads')
const worker = new Worker('./worker.js')
```

### Utility Process

```javascript
const { utilityProcess } = require('electron')
const child = utilityProcess.fork('./worker.js')
```

## Message Ports

### Setting Up MessageChannel Between Two Renderers

```javascript
const { BrowserWindow, MessageChannelMain } = require('electron')

const { port1, port2 } = MessageChannelMain.create()
win1.webContents.postMessage('port', null, [port1])
win2.webContents.postMessage('port', null, [port2])
```

### Communicating with Context-Isolated Page

```javascript
// Main process
const { port1, port2 } = MessageChannelMain.create()
mainWindow.webContents.postMessage('port', null, [port2])

// Preload
ipcRenderer.on('port', (event) => {
  const [port] = event.ports
  port.onmessage = (e) => console.log(e.data)
  port.postMessage('Hello from renderer')
})
```

## Custom Window Interactions

### Custom Draggable Regions

When the default title bar is removed, use the `app-region` CSS property to define draggable areas:

```css
/* Make the whole window draggable */
body { app-region: drag; }

/* Make buttons clickable again */
button { app-region: no-drag; }
```

- `app-region: drag` marks a rectangular area as draggable
- `app-region: no-drag` re-enables pointer events in overlapping areas
- Draggable areas ignore all pointer events (clicks, mouse enter/exit)

### Click-Through Windows

Create windows that let mouse events pass through:

```javascript
const win = new BrowserWindow({
  transparent: true,
  frame: false,
  alwaysOnTop: true
})
```

On macOS/Windows, forward mouse events with `win.setIgnoreMouseEvents(true, { forward: true })`.

## Custom Window Styles

### Frameless Windows

Remove all OS chrome (including window controls):

```javascript
const win = new BrowserWindow({
  width: 300,
  height: 200,
  frame: false
})
```

On Wayland (Linux), frameless windows have GTK drop shadows by default. Set `hasShadow: false` for fully frameless.

### Transparent Windows

```javascript
const win = new BrowserWindow({
  width: 100,
  height: 100,
  resizable: false,
  frame: false,
  transparent: true
})
```

**Limitations:**
- Transparent windows are not resizable on some platforms
- CSS background must use `rgba(0, 0, 0, 0)` for transparency
- May have issues with hardware acceleration on some systems

## Recent Documents

Provide a list of recent documents via Windows JumpList or macOS Dock.

### Managing Recent Documents

```javascript
const { app } = require('electron')

// Add a document to recent list
app.addRecentDocument('/path/to/file.txt')

// Clear recent documents
app.clearRecentDocuments()
```

### Platform Notes

- **Windows**: Shows in JumpList, limited to 10 items
- **macOS**: Shows in Dock menu, requires app to be the default handler for the file type

## Online/Offline Event Detection

### Renderer Process

```javascript
// Use standard HTML5 API
console.log(navigator.onLine) // true or false

window.addEventListener('online', () => { console.log('Online') })
window.addEventListener('offline', () => { console.log('Offline') })
```

### Main Process

```javascript
const { net } = require('electron')

// Check online status
console.log(net.isOnline())
console.log(net.online) // Property alias

// Listen for changes
net.on('online', () => { console.log('Online') })
```

**Note**: `true` doesn't guarantee internet connectivity (e.g., virtual Ethernet adapters). Treat `false` as a strong offline indicator.

## Deep Links (Custom Protocol Handler)

Set your app as the default handler for a specific protocol (e.g., `electron-fiddle://`).

### Registering the Protocol

```javascript
const { app, protocol } = require('electron')

app.whenReady().then(() => {
  protocol.registerSchemesAsPrivileged([{
    scheme: 'electron-fiddle',
    privileges: { standard: true, secure: true }
  }])
})
```

### Handling Deep Links

```javascript
// Windows: Handle second-instance deep links
app.on('second-instance', (event, argv) => {
  const url = argv.find(arg => arg.startsWith('electron-fiddle://'))
  if (url) handleDeepLink(url)
})

// macOS: Handle open-url event
app.on('open-url', (event, url) => {
  event.preventDefault()
  handleDeepLink(url)
})
```

### Packaging Notes

- **Windows**: Register protocol in installer or via `app.setAsDefaultProtocolClient()`
- **macOS**: Add `CFBundleURLTypes` to `Info.plist`
- Call `app.setAsDefaultProtocolClient('electron-fiddle')` at runtime

## Tray Menu

### Creating a Tray Icon

```javascript
const { nativeImage } = require('electron/common')
const { app, Tray, Menu } = require('electron/main')

let tray

app.whenReady().then(() => {
  const icon = nativeImage.createFromDataURL('data:image/png;base64,...')
  tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    { role: 'quit' }
  ])
  tray.setContextMenu(contextMenu)
})
```

### Minimizing to Tray

Keep the app running when all windows are closed:

```javascript
app.on('window-all-closed', () => {
  // Don't quit — keep tray icon alive
})
```

### Notes

- Save a reference to the `Tray` object globally to avoid garbage collection
- `enabled` and `visibility` properties are not available for top-level tray menu items on macOS
- Icon formats vary per OS (see Tray API docs)

## Windows on ARM

### Running a Basic App

```bash
set npm_config_arch=arm64
npm install
```

### General Considerations

- **Architecture-specific code**: Use `process.arch` to detect arm64
- **Native modules**: Must be cross-compiled for arm64; set `npm_config_arch=arm64`
- **Testing**: Test on actual ARM hardware or use Windows ARM VM

### Development Prerequisites

- Node.js with ARM support
- Visual Studio 2017+ with ARM components
- Link against the correct `node.lib` for ARM

### Cross-Compiling Native Modules

```bash
npm config set arch arm64
npm config set target_arch arm64
npm rebuild
```

## In-App Purchases (macOS)

Add in-app purchases to Mac App Store applications using the `inAppPurchase` module.

### Preparing

1. Sign the **Paid Applications Agreement** in App Store Connect
2. Create your in-app purchases in App Store Connect
3. Change `CFBundleIdentifier` to match your App Store app ID

### Code Example

```javascript
const { inAppPurchase } = require('electron')

// Check if payments are allowed
const canMakePayments = inAppPurchase.canMakePayments()

// Get products
inAppPurchase.getProducts(['com.example.product1'])
  .then(products => {
    console.log(products)
  })

// Purchase a product
inAppPurchase.purchaseProduct('com.example.product1', 1)
  .then(result => {
    console.log('Purchase result:', result)
  })
```

## Menus

### Available Menu Types

- **Application Menu** — Top-level menu bar (single per app)
- **Context Menu** — Right-click menus
- **Dock Menu** — macOS Dock right-click menu
- **Tray Menu** — System tray icon menu
- **Keyboard Shortcuts** — Accelerator-based shortcuts

### Building Menus

Two approaches — constructor or template helper:

```javascript
const { Menu, MenuItem } = require('electron')

// Constructor approach
const submenu = new Menu()
submenu.append(new MenuItem({ label: 'Hello' }))
submenu.append(new MenuItem({ type: 'separator' }))
submenu.append(new MenuItem({ label: 'Electron', type: 'checkbox', checked: true }))
const menu = new Menu()
menu.append(new MenuItem({ label: 'Menu', submenu }))
Menu.setApplicationMenu(menu)

// Template helper (preferred)
const menu2 = Menu.buildFromTemplate([
  { label: 'Menu', submenu: [
    { label: 'Hello' },
    { type: 'separator' },
    { label: 'Electron', type: 'checkbox', checked: true }
  ]}
])
Menu.setApplicationMenu(menu2)
```

### Menu Item Types

- `normal` (default) — Standard menu item
- `separator` — Horizontal line
- `checkbox` — Toggles `checked` on click
- `radio` — Toggles `checked`, unchecks adjacent radio items
- `submenu` — Auto-assigned when `submenu` property is set
- `palette` — Horizontal alignment (macOS 14+)
- `header` — Section header (macOS 14+)

### Roles

Roles give menu items predefined native behaviors. Recommended over manual `click` handlers.

**Edit roles**: `undo`, `redo`, `cut`, `copy`, `paste`, `pasteAndMatchStyle`, `selectAll`, `delete`

**Window roles**: `about`, `minimize`, `close`, `quit`, `reload`, `forceReload`, `toggleDevTools`, `togglefullscreen`, `resetZoom`, `zoomIn`, `zoomOut`, `toggleSpellChecker`

**Default menu roles**: `fileMenu`, `editMenu`, `viewMenu`, `windowMenu`

**macOS-only roles**: `hide`, `hideOthers`, `unhide`, `front`, `zoom`, `showSubstitutions`, `toggleSmartQuotes`, `toggleSmartDashes`, `startSpeaking`, `stopSpeaking`, and more

### Accelerators

Accelerator strings define keyboard shortcuts (e.g., `CommandOrControl+Shift+D`). Labels and accelerators default to appropriate platform values when using roles.

### Advanced Configuration

- **Programmatic item positioning**: Use `menu.insert(position, item)`
- **Icons**: Set `icon` property with `nativeImage` or path
- **Sublabels** (macOS): `toolTip` property
- **Tooltips** (macOS): Native tooltips on menu items

## Context Menu

### Using the context-menu Event (Main Process)

```javascript
const { app, BrowserWindow, Menu } = require('electron/main')

function createWindow() {
  const win = new BrowserWindow()
  const menu = Menu.buildFromTemplate([
    { role: 'copy' },
    { role: 'cut' },
    { role: 'paste' },
    { role: 'selectall' }
  ])

  win.webContents.on('context-menu', (_event, params) => {
    // Only show context menu for editable elements
    if (params.isEditable) {
      menu.popup()
    }
  })

  win.loadFile('index.html')
}
```

The `params` object provides attributes to distinguish element types:
- `params.isEditable` — Check for editable elements (`<textarea/>`, `<input/>`)
- `params.linkURL` — Check for links
- `params.selectionText` — Get selected text
- `params.mediaType` — Check for images, video, etc.

### Using the contextmenu Event (Renderer Process)

```javascript
// In renderer process
window.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  // Send IPC to main process to show native menu
  ipcRenderer.send('show-context-menu')
})
```

### macOS Additional Menu Items

macOS may inject additional menu items (e.g., Writing Tools, Services) into context menus automatically.
