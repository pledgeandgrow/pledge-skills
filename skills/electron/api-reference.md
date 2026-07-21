# API Reference — Key Modules

## app

Control your application's event lifecycle. The `app` object is the main entry point and controls application-level behavior.

### Key Events

| Event | Description |
|-------|-------------|
| `will-finish-launching` | Emitted before the app finishes launching |
| `ready` | App is ready to create windows (use `app.whenReady()`) |
| `window-all-closed` | All windows closed (quit on Windows/Linux) |
| `before-quit` | App is about to quit (preventable) |
| `will-quit` | App will quit after windows closed (preventable) |
| `quit` | App is quitting |
| `activate` (macOS) | App is activated (create window if none exist) |
| `open-file` (macOS) | Open a file |
| `open-url` (macOS) | Open a URL |
| `certificate-error` | Certificate error occurred |
| `login` | HTTP authentication required |
| `render-process-gone` | A renderer process crashed |
| `second-instance` | Second instance attempted to launch |

### Key Methods

| Method | Description |
|--------|-------------|
| `app.quit()` | Quit the app |
| `app.exit([exitCode])` | Exit immediately without firing `before-quit` |
| `app.relaunch([options])` | Relaunch the app |
| `app.isReady()` | Check if app is ready |
| `app.whenReady()` | Promise that resolves when app is ready |
| `app.getPath(name)` | Get path (e.g., `userData`, `temp`, `documents`) |
| `app.setPath(name, path)` | Set a path |
| `app.getVersion()` | Get app version |
| `app.getName()` | Get app name |
| `app.setName(name)` | Set app name |
| `app.getLocale()` | Get current locale |
| `app.requestSingleInstanceLock()` | Ensure single instance |
| `app.setAppUserModelId(id)` | Set Windows app user model ID (for notifications) |
| `app.enableSandbox()` | Enable sandbox globally |
| `app.disableHardwareAcceleration()` | Disable GPU |
| `app.setAboutPanelOptions(options)` | Configure about panel |
| `app.setProxy(config)` | Set proxy settings |

### Key Properties

| Property | Description |
|----------|-------------|
| `app.applicationMenu` | The application menu |
| `app.commandLine` | Read-only command line switches |
| `app.dock` (macOS) | The dock object |
| `app.isPackaged` | Whether app is packaged (asar) |
| `app.name` | App name |
| `app.userAgentFallback` | Fallback user agent |

### Platform-Specific

- **macOS**: `app.hide()`, `app.show()`, `app.isActive()`, `app.setActivationPolicy()`
- **Windows**: `app.setAppUserModelId()`, `app.setJumpList()`, `app.getUserTasks()`
- **Linux**: `app.setBadgeCount()` (also macOS)

## BrowserWindow

Create and control browser windows. Extends `BaseWindow`.

### Constructor Options

```javascript
const win = new BrowserWindow({
  width: 800,
  height: 600,
  x: 100,
  y: 100,
  show: true,
  frame: true,
  titleBarStyle: 'default', // 'hidden', 'hiddenInset', 'customButtonsOnHover'
  transparent: false,
  resizable: true,
  minimizable: true,
  maximizable: true,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true, // default
    nodeIntegration: false, // default
    sandbox: false,
    webSecurity: true, // default
    allowRunningInsecureContent: false, // default
    devTools: true,
    spellcheck: true
  }
})
```

### Window Customization

- `ready-to-show` event: Show window gracefully after content loads
- `backgroundColor` option: Set background color to prevent flash
- Parent/child windows: `parent` option
- Modal windows: `modal: true`

### Instance Methods

| Method | Description |
|--------|-------------|
| `win.loadFile(path)` | Load a local HTML file |
| `win.loadURL(url)` | Load a URL |
| `win.reload()` | Reload the page |
| `win.show()` | Show the window |
| `win.hide()` | Hide the window |
| `win.close()` | Close the window |
| `win.destroy()` | Destroy without firing close event |
| `win.focus()` | Focus the window |
| `win.setFullScreen(flag)` | Toggle fullscreen |
| `win.setMenuBarVisibility(visible)` | Toggle menu bar |
| `win.setProgressBar(progress)` | Set progress bar (0-1) |
| `win.flashFrame(flag)` | Flash the frame |
| `win.setMinimumSize(width, height)` | Set minimum size |
| `win.setMaximumSize(width, height)` | Set maximum size |
| `win.setBounds(bounds)` | Set window bounds |
| `win.getBounds()` | Get window bounds |
| `win.setPosition(x, y)` | Set position |
| `win.setSize(width, height)` | Set size |
| `win.webContents` | Access the WebContents instance |

### Static Methods

| Method | Description |
|--------|-------------|
| `BrowserWindow.getAllWindows()` | Get all windows |
| `BrowserWindow.getFocusedWindow()` | Get focused window |
| `BrowserWindow.fromWebContents(webContents)` | Get window from WebContents |
| `BrowserWindow.fromId(id)` | Get window by ID |

### Instance Events

| Event | Description |
|-------|-------------|
| `close` | Window is closing (preventable) |
| `closed` | Window is closed |
| `focus` | Window gained focus |
| `blur` | Window lost focus |
| `show` | Window is shown |
| `hide` | Window is hidden |
| `maximize` | Window is maximized |
| `unmaximize` | Window is unmaximized |
| `minimize` | Window is minimized |
| `restore` | Window is restored |
| `resize` | Window is resized |
| `move` | Window is moved |
| `enter-full-screen` | Entered fullscreen |
| `leave-full-screen` | Left fullscreen |
| `ready-to-show` | Page is ready to show |

## ipcMain

Communicate asynchronously from the main process to renderer processes.

### Methods

| Method | Description |
|--------|-------------|
| `ipcMain.on(channel, listener)` | Listen for messages |
| `ipcMain.off(channel, listener)` | Remove listener |
| `ipcMain.once(channel, listener)` | Listen once |
| `ipcMain.handle(channel, listener)` | Handle `invoke` requests (returns value) |
| `ipcMain.handleOnce(channel, listener)` | Handle once |
| `ipcMain.removeHandler(channel)` | Remove handler |
| `ipcMain.removeAllListeners([channel])` | Remove all listeners |

### Sending Messages

```javascript
// To sender
event.reply('channel', data)

// To specific webContents
win.webContents.send('channel', data)
```

## ipcRenderer

Communicate asynchronously from a renderer process to the main process.

### Methods

| Method | Description |
|--------|-------------|
| `ipcRenderer.on(channel, listener)` | Listen for messages |
| `ipcRenderer.off(channel, listener)` | Remove listener |
| `ipcRenderer.once(channel, listener)` | Listen once |
| `ipcRenderer.send(channel, ...args)` | Send one-way message |
| `ipcRenderer.invoke(channel, ...args)` | Send and await response |
| `ipcRenderer.sendSync(channel, ...args)` | Send synchronously (avoid) |
| `ipcRenderer.postMessage(channel, message, [transfer])` | Send with transferables |
| `ipcRenderer.sendToHost(channel, ...args)` | Send to host (webview) |

## contextBridge

Create a safe bridge between isolated contexts.

### Methods

| Method | Description |
|--------|-------------|
| `contextBridge.exposeInMainWorld(apiKey, api)` | Expose API to renderer's main world |
| `contextBridge.exposeInIsolatedWorld(worldId, apiKey, api)` | Expose to isolated world |
| `contextBridge.executeInMainWorld(executionScript)` | Execute in main world (experimental) |

## Menu

Create native application menus and context menus.

### Static Methods

| Method | Description |
|--------|-------------|
| `Menu.setApplicationMenu(menu)` | Set the application menu |
| `Menu.getApplicationMenu()` | Get the application menu |
| `Menu.buildFromTemplate(template)` | Build menu from template |
| `Menu.sendActionToFirstResponder(action)` (macOS) | Send to first responder |

### Menu Item Template

```javascript
{
  label: 'File',
  submenu: [
    {
      label: 'Save',
      accelerator: 'CommandOrControl+S',
      click: () => save(),
      role: 'save' // Optional: uses predefined behavior
    },
    { type: 'separator' },
    { role: 'quit' }
  ]
}
```

## dialog

Display native system dialogs.

### Methods

| Method | Description |
|--------|-------------|
| `dialog.showOpenDialog([window, ]options)` | Open file dialog |
| `dialog.showSaveDialog([window, ]options)` | Save file dialog |
| `dialog.showMessageBox([window, ]options)` | Message box |
| `dialog.showErrorBox(title, content)` | Error box |
| `dialog.showCertificateTrustDialog([window, ]options)` | Certificate dialog |

## shell

Manage files and URLs using their default applications.

### Methods

| Method | Description |
|--------|-------------|
| `shell.showItemInFolder(fullPath)` | Show file in folder |
| `shell.openPath(path)` | Open file with default app |
| `shell.openExternal(url)` | Open URL in default browser |
| `shell.trashItem(path)` | Move to trash |
| `shell.beep()` | Play system beep |

## session

Manage browser sessions, cookies, cache, and proxy settings.

### Key Methods

| Method | Description |
|--------|-------------|
| `session.defaultSession` | The default session |
| `session.fromPartition(partition)` | Create session from partition |
| `ses.setPermissionRequestHandler(handler)` | Control permission requests |
| `ses.clearStorageData(options)` | Clear storage data |
| `ses.setProxy(config)` | Set proxy |
| `ses.cookies` | Cookie management |

## webContents

Render and control web content. Each `BrowserWindow` has a `webContents` property.

### Key Methods

| Method | Description |
|--------|-------------|
| `contents.loadURL(url)` | Load a URL |
| `contents.loadFile(path)` | Load a local file |
| `contents.reload()` | Reload |
| `contents.send(channel, ...args)` | Send IPC message to renderer |
| `contents.executeJavaScript(code)` | Execute JS in page |
| `contents.openDevTools()` | Open DevTools |
| `contents.closeDevTools()` | Close DevTools |
| `contents.print(options)` | Print page |
| `contents.printToPDF(options)` | Generate PDF |
| `contents.capturePage([rect])` | Capture screenshot |

### Key Events

| Event | Description |
|-------|-------------|
| `did-finish-load` | Page finished loading |
| `did-fail-load` | Page failed to load |
| `console-message` | Console message from page |
| `context-menu` | Context menu requested |
| `new-window` | New window requested (deprecated) |

## Tray

Add icons and context menus to the system notification area.

```javascript
const { Tray, Menu } = require('electron')

const tray = new Tray('icon.png')
tray.setToolTip('My App')
tray.setContextMenu(Menu.buildFromTemplate([
  { label: 'Quit', click: () => app.quit() }
]))
```

## nativeImage

Create tray, dock, and application icons using files or programmatic data.

```javascript
const { nativeImage } = require('electron')

const image = nativeImage.createFromPath('icon.png')
const emptyImage = nativeImage.createEmpty()
```

## crashReporter

Submit crash reports to a remote server.

```javascript
const { crashReporter } = require('electron')

crashReporter.start({
  productName: 'My App',
  companyName: 'My Company',
  submitURL: 'https://your-crash-server.com/submit',
  uploadToServer: true
})
```

## autoUpdater

Enable apps to automatically update themselves.

```javascript
const { autoUpdater } = require('electron')

autoUpdater.setFeedURL({ url: 'https://update-server.com/update' })
autoUpdater.checkForUpdates()
autoUpdater.on('update-downloaded', () => autoUpdater.quitAndInstall())
```

## powerMonitor

Monitor power state changes.

| Event | Description |
|-------|-------------|
| `suspend` | System is suspending |
| `resume` | System is resuming |
| `on-ac` | On AC power |
| `on-battery` | On battery power |
| `lock-screen` | Screen locked |
| `unlock-screen` | Screen unlocked |

## screen

Retrieve information about screen size, displays, cursor position, etc.

```javascript
const { screen } = require('electron')

const primaryDisplay = screen.getPrimaryDisplay()
const { width, height } = primaryDisplay.bounds
const cursorPosition = screen.getCursorScreenPoint()
```

## clipboard

Provide methods to do copy/paste operations on the system clipboard.

```javascript
const { clipboard } = require('electron')

clipboard.writeText('Hello')
const text = clipboard.readText()
```

## globalShortcut

Register and unregister global keyboard shortcuts.

```javascript
const { globalShortcut } = require('electron')

globalShortcut.register('CommandOrControl+Shift+D', () => {
  console.log('Triggered')
})
```

## BaseWindow

Create and control windows without a web content area. BaseWindow is the foundation for window creation, used with WebContentsView for flexible layouts.

```javascript
const { BaseWindow, WebContentsView } = require('electron')

const win = new BaseWindow({ width: 800, height: 600 })
const view = new WebContentsView()
win.contentView.addChildView(view)
```

### Parent and Child Windows

```javascript
const parent = new BaseWindow()
const child = new BaseWindow({ parent })
// Child always shows on top of parent
```

### Modal Windows

```javascript
const child = new BaseWindow({ parent, modal: true })
```

### Resource Management

When using BaseWindow + WebContentsView, you must manually close webContents:

```javascript
win.on('closed', () => {
  view.webContents.close()
})
```

### Platform Notices

- macOS: Modal windows displayed as sheets; child windows maintain relative position
- Linux: Modal type changed to `dialog`; some desktop environments don't support hiding modal windows

## WebContentsView

A View that displays WebContents. Extends View. Used with BaseWindow for composable layouts.

```javascript
const { BaseWindow, WebContentsView } = require('electron')

const win = new BaseWindow({ width: 800, height: 600 })
const view = new WebContentsView()
win.contentView.addChildView(view)
view.webContents.loadURL('https://example.com')
```

### Instance Properties

- `view.webContents` — The WebContents associated with this view

## utilityProcess

Creates a child process with Node.js and Message ports enabled. Uses Chromium's Services API instead of `child_process.fork`.

```javascript
const { utilityProcess } = require('electron')

const child = utilityProcess.fork('./child.js', [], {
  stdio: 'pipe'
})

child.on('message', (msg) => console.log(msg))
child.postMessage('Hello from parent')
```

### Methods

- `utilityProcess.fork(modulePath[, args][, options])` — Spawn a utility process

### Options

- `stdio` — `pipe`, `inherit`, `overlapped`, or `ignore`
- `serviceName` — macOS service name
- `allowLoadingUnsignedLibraries` — macOS code signing option

### Instance Events

- `spawn` — Process spawned
- `exit` — Process exited (code provided)
- `message` — Message received from child

## net

Issue HTTP/HTTPS requests using Chromium's native networking library.

```javascript
const { net } = require('electron')

// Make a request
const request = net.request({
  method: 'GET',
  protocol: 'https:',
  hostname: 'example.com',
  path: '/'
})

request.on('response', (response) => {
  response.on('data', (chunk) => console.log(chunk.toString()))
})

request.end()
```

### Methods

- `net.request(options)` — Create a ClientRequest
- `net.fetch(input[, init])` — Fetch API (Promise-based, uses Chromium's network stack)
- `net.isOnline()` — Returns boolean online status
- `net.resolveHost(host[, options])` — Resolve a hostname

### Properties

- `net.online` — Readonly boolean, same as `net.isOnline()`

## inAppPurchase

macOS Mac App Store in-app purchases.

```javascript
const { inAppPurchase } = require('electron')

// Check if payments are allowed
inAppPurchase.canMakePayments()

// Get products
inAppPurchase.getProducts(['com.example.product1'])

// Purchase
inAppPurchase.purchaseProduct('com.example.product1', 1)
```

## MenuItem

Add items to native application menus and context menus.

```javascript
const { Menu, MenuItem } = require('electron')

const menu = new Menu()
menu.append(new MenuItem({
  label: 'MenuItem1',
  type: 'checkbox',
  checked: true,
  click: () => console.log('clicked')
}))
```

### Instance Properties

- `label`, `type` (`normal`, `separator`, `submenu`, `checkbox`, `radio`)
- `role` — Predefined behavior (e.g., `copy`, `paste`, `quit`)
- `accelerator` — Keyboard shortcut string
- `icon` — nativeImage or path
- `enabled`, `visible`, `checked`
- `submenu` — Nested Menu

## View

Create and layout native views. Base class for WebContentsView.

```javascript
const { BaseWindow, View } = require('electron')
const win = new BaseWindow()
const view = new View()
win.contentView.addChildView(view)
```

### Instance Methods

- `addChildView(view)` / `removeChildView(view)`
- `setBounds(bounds)` — Position and size

### Instance Properties

- `bounds` — Readonly rectangle

## contentTracing

Collect tracing data from Chromium to find performance bottlenecks.

```javascript
const { contentTracing } = require('electron')

contentTracing.startRecording({
  categoryFilter: '*',
  traceOptions: 'record-until-full,enable-sampling'
})

contentTracing.stopRecording().then(result => {
  console.log('Trace saved to:', result)
})
```

### Methods

- `getCategories()` — Get available tracing categories
- `startRecording(options)` — Start tracing
- `stopRecording([resultFilePath])` — Stop and save trace
- `getTraceBufferUsage()` — Get buffer usage percentage
- `enableHeapProfiling([options])` — Experimental heap profiling

## desktopCapturer

Access media sources for screen/audio capture via `navigator.mediaDevices.getUserMedia`.

```javascript
const { desktopCapturer } = require('electron')

desktopCapturer.getSources({ types: ['window', 'screen'] })
  .then(sources => {
    sources.forEach(source => {
      console.log(source.name, source.id)
    })
  })
```

### Caveats

- **Linux**: Uses PipeWire or X11 depending on session type
- **macOS 14.2+**: Requires screen recording permission
- **macOS 12.7.6 or lower**: Different permission flow

## powerSaveBlocker

Block the system from entering low-power (sleep) mode.

```javascript
const { powerSaveBlocker } = require('electron')

const id = powerSaveBlocker.start('prevent-display-sleep')
console.log(powerSaveBlocker.isStarted(id)) // true
powerSaveBlocker.stop(id)
```

### Methods

- `start(type)` — `prevent-app-suspension` or `prevent-display-sleep`
- `stop(id)` — Stop blocking
- `isStarted(id)` — Check if blocker is active

## process

Extensions to the Node.js `process` object.

### Events

- `loaded` — Emitted when Electron has loaded its internal preloads

### Key Properties

- `process.sandboxed` — Whether renderer is sandboxed
- `process.contextIsolated` — Whether context isolation is enabled
- `process.type` — `browser` (main) or `renderer`
- `process.versions.electron` / `process.versions.chrome`
- `process.mas` — macOS App Store build
- `process.windowsStore` — Windows Store build
- `process.resourcesPath` — Path to resources directory
- `process.parentPort` — For utility processes

### Methods

- `crash()`, `hang()`
- `getCreationTime()`, `getCPUUsage()`
- `getHeapStatistics()`, `getBlinkMemoryInfo()`
- `getProcessMemoryInfo()`, `getSystemMemoryInfo()`
- `getSystemVersion()`
- `takeHeapSnapshot(filePath)`
- `setFdLimit(maxDescriptors)` — macOS/Linux

## protocol

Register custom protocols and intercept existing protocol requests.

```javascript
const { app, protocol, net } = require('electron')

app.whenReady().then(() => {
  protocol.handle('app', (request) => {
    return net.fetch('file://' + request.url.slice('app://'.length))
  })
})
```

### Methods

- `registerSchemesAsPrivileged(customSchemes)` — Must be called before app ready
- `handle(scheme, handler)` — Register a handler for a scheme (modern API)
- `unhandle(scheme)` — Unregister a handler
- `isProtocolHandled(scheme)` — Check if handled

### Custom Sessions

Protocols are registered per-session. Use `session.fromPartition()` to register for custom partitions.

### Deprecated Methods

`registerFileProtocol`, `registerBufferProtocol`, `registerStringProtocol`, `registerHttpProtocol`, `registerStreamProtocol`, `unregisterProtocol`, `interceptFileProtocol`, `interceptStringProtocol`, `interceptBufferProtocol`, `interceptHttpProtocol`, `interceptStreamProtocol`, `uninterceptProtocol` — all deprecated in favor of `protocol.handle()`.

## pushNotifications (macOS)

Process APNS push notifications in the main process.

### Events

- `received-apns-notification` — Emitted when app receives a remote notification while running

### Methods

- `registerForAPNSNotifications()` — Register for APNS
- `unregisterForAPNSNotifications()` — Unregister

## ShareMenu (macOS)

Create a Share Menu for sharing information to apps, social media, and services.

```javascript
const { ShareMenu } = require('electron')

const shareMenu = new ShareMenu({
  text: 'Hello World',
  urls: ['https://example.com']
})
shareMenu.popup()
```

## TouchBar (macOS)

Create TouchBar layouts for native macOS applications.

```javascript
const { TouchBar, TouchBarButton, TouchBarLabel } = require('electron')

const touchBar = new TouchBar({
  items: [
    new TouchBarButton({ label: 'Click me', click: () => {} }),
    new TouchBarLabel({ label: 'Hello' })
  ]
})
win.setTouchBar(touchBar)
```

### TouchBar Sub-classes

- **TouchBarButton** — Button with label/icon/click handler
- **TouchBarColorPicker** — Color picker with available colors
- **TouchBarGroup** — Group of TouchBar items
- **TouchBarLabel** — Text label with customizable color
- **TouchBarPopover** — Collapsible popover containing other items
- **TouchBarScrubber** — Scrollable selector with items
- **TouchBarSegmentedControl** — Button group with selected state
- **TouchBarSlider** — Slider with min/max/value
- **TouchBarSpacer** — Spacer between items (`small`, `large`, `flexible`)
- **TouchBarOtherItemsProxy** — Proxy for Chromium-inherited TouchBar items

## WebRequest

Intercept and modify request contents at various stages of their lifecycle. Accessed via `session.defaultSession.webRequest`.

```javascript
const { session } = require('electron')

session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
  if (details.url.startsWith('https://blocked.com')) {
    callback({ cancel: true })
  } else {
    callback({})
  }
})
```

### Instance Methods

- `onBeforeRequest([filter,] listener)` — Cancel or redirect requests
- `onBeforeSendHeaders([filter,] listener)` — Modify request headers
- `onHeadersReceived([filter,] listener)` — Modify response headers
- `onResponseStarted([filter,] listener)` — Response started
- `onBeforeRedirect([filter,] listener)` — Before redirect
- `onCompleted([filter,] listener)` — Request completed
- `onErrorOccurred([filter,] listener)` — Request failed

## CommandLine

Manipulate Chromium's command line arguments. Accessed via `app.commandLine`.

```javascript
const { app } = require('electron')

app.commandLine.appendSwitch('remote-debugging-port', '8315')
app.commandLine.appendArgument('--enable-experimental-web-platform-features')

console.log(app.commandLine.hasSwitch('remote-debugging-port')) // true
console.log(app.commandLine.getSwitchValue('remote-debugging-port')) // '8315'
app.commandLine.removeSwitch('remote-debugging-port')
```

### Instance Methods

- `appendSwitch(switch[, value])` — Append a Chromium switch
- `appendArgument(value)` — Append a raw argument
- `hasSwitch(switch)` — Check if switch exists
- `getSwitchValue(switch)` — Get switch value
- `removeSwitch(switch)` — Remove a switch

## ClientRequest

Make HTTP/HTTPS requests using Chromium's native networking library. Created by `net.request()`.

```javascript
const { net } = require('electron')

const request = net.request({
  method: 'POST',
  url: 'https://example.com/api'
})

request.setHeader('Content-Type', 'application/json')
request.write(JSON.stringify({ key: 'value' }))

request.on('response', (response) => {
  response.on('data', (chunk) => console.log(chunk.toString()))
})

request.end()
```

### Instance Events

- `response` — Received response headers
- `login` — Authentication required
- `finish` — Request finished sending
- `abort` — Request aborted
- `error` — Request error

### Instance Methods

- `setHeader(name, value)`, `getHeader(name)`, `removeHeader(name)`
- `write(chunk[, encoding][, callback])` — Write body data
- `end([chunk][, callback])` — Finish sending

## Cookies

Query and modify a session's cookies. Accessed via `session.defaultSession.cookies`.

```javascript
const { session } = require('electron')

// Get cookies
session.defaultSession.cookies.get({ url: 'https://example.com' })
  .then(cookies => console.log(cookies))

// Set a cookie
session.defaultSession.cookies.set({
  url: 'https://example.com',
  name: 'session',
  value: 'abc123',
  expirationDate: Date.now() / 1000 + 3600
})
```

### Instance Events

- `changed` — Cookie added/removed/changed

### Instance Methods

- `get(filter)` — Get cookies matching filter
- `set(details)` — Set a cookie
- `remove(url, name)` — Remove a cookie
- `flushStore()` — Flush cookie store to disk

## DownloadItem

Control file downloads from remote sources.

```javascript
win.webContents.session.on('will-download', (event, item) => {
  item.setSavePath('/path/to/save/file.zip')
  item.on('updated', (event, state) => {
    console.log(`Progress: ${item.getReceivedBytes()}/${item.getTotalBytes()}`)
  })
  item.once('done', (event, state) => {
    console.log('Download complete:', state)
  })
})
```

### Instance Events

- `updated` — Download progress/state changed
- `done` — Download completed or interrupted

### Instance Methods

- `setSavePath(path)`, `getSavePath()`
- `pause()`, `resume()`, `cancel()`
- `getReceivedBytes()`, `getTotalBytes()`
- `getState()` — `progressing`, `completed`, `interrupted`, `cancelled`

## Notification

Create OS desktop notifications.

```javascript
const { Notification } = require('electron')

const notification = new Notification({
  title: 'Basic Notification',
  body: 'Notification from the Main process',
  icon: '/path/to/icon.png'
})

notification.on('click', () => console.log('Notification clicked'))
notification.show()
```

### Static Methods

- `Notification.isSupported()` — Check if notifications are supported

### Instance Events

- `show`, `click`, `close`, `action` (macOS), `reply` (macOS)

### Instance Properties

- `title`, `body`, `silent`, `icon`, `hasReply` (macOS), `replyPlaceholder` (macOS)

## safeStorage

Encrypt and decrypt strings for secure local storage.

```javascript
const { safeStorage } = require('electron')

if (safeStorage.isEncryptionAvailable()) {
  const encrypted = safeStorage.encryptString('secret data')
  // Store encrypted buffer...
  const decrypted = safeStorage.decryptString(encrypted)
  console.log(decrypted) // 'secret data'
}
```

### Methods

- `isEncryptionAvailable()` — Check if encryption is available
- `encryptString(plainText)` — Returns Buffer with encrypted data
- `decryptString(encrypted)` — Returns decrypted string
- `getSelectedStorageBackend()` — Linux only (gnome-keyring, kwallet, etc.)

## webFrame

Customize the rendering of the current web page (renderer process).

```javascript
const { webFrame } = require('electron')

webFrame.setZoomFactor(2.0) // 2x zoom
webFrame.setZoomLevel(1.5)

// Insert CSS
webFrame.insertCSS('body { background: red; }')

// Execute JavaScript in isolated world
webFrame.executeJavaScriptInIsolatedWorld(1, [{ code: 'document.title' }])
```

### Key Methods

- `setZoomFactor(factor)`, `getZoomFactor()`
- `setZoomLevel(level)`, `getZoomLevel()`
- `insertCSS(css)` — Inject CSS into page
- `executeJavaScript(code)` — Execute JS in page
- `executeJavaScriptInIsolatedWorld(worldId, scripts)` — Execute in isolated world
- `setSpellCheckProvider(language, provider)` — Custom spell checker

### Properties

- `webFrame.top` — Top frame in frame hierarchy
- `webFrame.opener` — Frame that opened this frame
- `webFrame.parent` — Parent frame
- `webFrame.frameToken` — Unique frame identifier

## webFrameMain

Control web pages and iframes from the main process.

```javascript
const { webFrameMain } = require('electron')

// Get a frame by process and routing ID
const frame = webFrameMain.fromId(processId, routingId)
```

### Methods

- `fromId(processId, routingId)` — Get frame by ID
- `fromFrameToken(processId, frameToken)` — Get frame by token

### Instance Properties

- `url`, `origin`, `name`
- `firstChild`, `nextSibling`, `parent`, `top`
- `frameToken`, `processId`, `routingId`

## ServiceWorkers

Query and receive events from a session's active service workers. Accessed via `session.defaultSession.serviceWorkers`.

```javascript
const { session } = require('electron')

session.defaultSession.serviceWorkers.on('console-message', (event, level, message, line, sourceId) => {
  console.log('ServiceWorker:', message)
})
```

### Instance Events

- `console-message` — Service worker console output
- `registration-completed` — Service worker registered

### Instance Methods

- `getAllRunning()` — Get all running service worker info

## FAQ

Common Electron questions and answers:

- **Installation issues**: Electron downloads binaries from GitHub releases; use `ELECTRON_MIRROR` for custom mirrors
- **Chromium upgrades**: Electron follows Chromium's release schedule
- **Node.js upgrades**: Electron upgrades Node.js with each major version
- **Sharing data between web pages**: Use IPC, `ipcRenderer.sendTo`, or shared storage
- **Tray disappearing**: Keep a global reference to the Tray object to prevent GC
- **jQuery/RequireJS/Meteor/AngularJS**: Use `nodeIntegration: false` or wrap in `require`
- **`require('electron').xxx is undefined`**: Check you're in the correct process (main vs renderer)
- **Blurry fonts**: Enable `backgroundColor` option or set `thinFrame` on macOS
- **Class inheritance**: Electron built-in classes cannot be subclassed

## Glossary

Key Electron terminology:

- **ASAR**: Archive format for bundling app files into a single `.asar` file
- **Context Isolation**: Preload scripts run in separate JS context from web content
- **CRT**: C Runtime Library used by Chromium on Windows
- **DMG**: macOS disk image format for app distribution
- **IDL**: Interface Definition Language used to define Electron APIs
- **IPC**: Inter-Process Communication between main and renderer
- **Main Process**: Node.js process that manages windows and app lifecycle
- **MAS**: Mac App Store
- **Mojo**: Chromium's inter-process communication system
- **MSI**: Windows Installer package format
- **Native Modules**: C++ addons compiled for Node.js/Electron
- **Notarization**: macOS process of verifying app identity with Apple
- **OSR**: Off-Screen Rendering
- **Preload Script**: Script run before web content loads
- **Renderer Process**: Process that renders web content
- **Sandbox**: Security feature limiting renderer process capabilities
- **Squirrel**: Framework for auto-updating Electron apps
- **Userland**: Community-maintained npm packages
- **Utility Process**: Child process with Node.js enabled
- **V8**: JavaScript engine used by Chromium and Node.js
- **Webview**: `<webview>` tag for embedding web content
