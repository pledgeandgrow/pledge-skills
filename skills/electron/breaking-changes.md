# Breaking Changes

Breaking changes are documented here, with deprecation warnings added to JS code at least one major version before the change is made.

## Types of Breaking Changes

- **API Changed**: The signature or behavior of an API has changed
- **Default Changed**: A default value has changed
- **Deprecated**: The API is marked for removal in a future version
- **Removed**: The API has been removed
- **Behavior Changed**: The API's runtime behavior has changed without a signature change

## Recent Breaking Changes

### Electron 44.0

- **Removed**: macOS 12 support
- **Removed**: Windows 32-bit (ia32) and Linux 32-bit ARM (armv7l) support
- **Removed**: `clipboard` module is no longer available in the renderer process

### Electron 43.0

- **Behavior Changed**: Rounded corners on Linux
- **Behavior Changed**: WCO respects the native title bar layout on Linux
- **Behavior Changed**: `NativeImage.toBitmap()` now normalizes color space
- **Behavior Changed**: `chrome.scripting` CSS injection matches more fallback frames
- **Behavior Changed**: Dialog methods default to Downloads directory
- **Removed**: `showHiddenFiles` in Dialogs on Linux

### Electron 42.0

- **Behavior Changed**: macOS notifications now use UNNotification API
- **Behavior Changed**: Offscreen rendering uses 1.0 as default device scale factor
- **Behavior Changed**: Electron no longer downloads itself via postinstall script
- **Removed**: `quotas` object from `Session.clearStorageData(options)`
- **Deprecated**: Passing only an array `hslShift` to `nativeImage.createFromNamedImage()`

### Electron 41.0

- **Behavior Changed**: PDFs no longer create a separate WebContents
- **Behavior Changed**: Updated Cookie Change Cause in the Cookie 'changed' Event
- **Deprecated**: `showHiddenFiles` in Dialogs on Linux

### Electron 40.0

- **Deprecated**: clipboard API access from renderer processes
- **Behavior Changed**: macOS dSYM files now compressed with tar.xz

### Electron 39.0

- **Deprecated**: `--host-rules` command line switch
- **Behavior Changed**: `window.open` popups are always resizable
- **Behavior Changed**: `NSAudioCaptureUsageDescription` required in Info.plist for `desktopCapturer` (macOS ≥14.2)
- **Behavior Changed**: Shared texture OSR paint event data structure

### Electron 38.0

- **Removed**: `ELECTRON_OZONE_PLATFORM_HINT` environment variable
- **Removed**: `ORIGINAL_XDG_CURRENT_DESKTOP` environment variable
- **Removed**: macOS 11 support
- **Removed**: `plugin-crashed` event
- **Deprecated**: `webFrame.routingId` property
- **Deprecated**: `webFrame.findFrameByRoutingId(routingId)`

### Electron 37.0

- **Behavior Changed**: Utility Process unhandled rejection behavior
- **Behavior Changed**: `process.exit()` kills utility process synchronously
- **Behavior Changed**: WebUSB and WebSerial Blocklist Support
- **Removed**: `null` value for session property in `ProtocolResponse`
- **Behavior Changed**: `BrowserWindow.IsVisibleOnAllWorkspaces()` on Linux

### Electron 36.0

- **Behavior Changed**: `app.commandLine`
- **Deprecated**: `NativeImage.getBitmap()`
- **Removed**: `isDefault` and `status` properties on `PrinterInfo`
- **Removed**: `quota` type `syncable` in `Session.clearStorageData(options)`
- **Deprecated**: `null` value for session property in `ProtocolResponse`
- **Deprecated**: `quota` property in `Session.clearStorageData(options)`
- **Deprecated**: Extension methods and events on `session`
- **Removed**: `systemPreferences.isAeroGlassEnabled()`
- **Changed**: GTK 4 is default when running GNOME

### Electron 35.0

- **Behavior Changed**: Dialog API's `defaultPath` option on Linux
- **Deprecated**: `getFromVersionID` on `session.serviceWorkers`
- **Deprecated**: `setPreloads`, `getPreloads` on Session
- **Deprecated**: `level`, `message`, `line`, `sourceId` arguments in `console-message` event
- **Behavior Changed**: `urls` property of `WebRequestFilter`
- **Deprecated**: `systemPreferences.isAeroGlassEnabled()`

### Electron 34.0

- **Behavior Changed**: Menu bar will be hidden during fullscreen on Windows

### Electron 33.0

- **Deprecated**: `document.execCommand("paste")`
- **Behavior Changed**: Frame properties may retrieve detached `WebFrameMain` instances
- **Behavior Changed**: Custom protocol URL handling on Windows
- **Behavior Changed**: `webContents` property on `login` on `app`
- **Deprecated**: `textured` option in `BrowserWindowConstructorOption.type`
- **Removed**: macOS 10.15 support
- **Behavior Changed**: Native modules now require C++20
- **Deprecated**: `systemPreferences.accessibilityDisplayShouldReduceTransparency`

### Electron 32.0

- **Removed**: `File.path`
- **Deprecated**: `clearHistory`, `canGoBack`, `goBack`, `canGoForward`, `goForward`, `goToIndex`, `canGoToOffset`, `goToOffset` on WebContents
- **Behavior Changed**: Directory databases in `userData` will be deleted

### Electron 31.0

- **Removed**: WebSQL support
- **Behavior Changed**: `nativeImage.toDataURL` will preserve PNG colorspace
- **Behavior Changed**: `window.flashFrame(bool)` will flash dock icon continuously on macOS

### Electron 30.0

- **Behavior Changed**: Cross-origin iframes now use Permission Policy to access features
- **Removed**: `--disable-color-correct-rendering` switch
- **Behavior Changed**: `BrowserView.setAutoResize` behavior on macOS
- **Deprecated**: `BrowserView`
- **Removed**: `params.inputFormType` property on `context-menu` on WebContents
- **Removed**: `process.getIOCounters()`

### Electron 29.0

- **Behavior Changed**: `ipcRenderer` can no longer be sent over the `contextBridge`
- **Removed**: `renderer-process-crashed` event on `app`
- **Removed**: `crashed` event on WebContents and `<webview>`
- **Removed**: `gpu-process-crashed` event on `app`

### Electron 28.0

- **Behavior Changed**: `WebContents.backgroundThrottling` set to false affects all WebContents in the host BrowserWindow
- **Removed**: `BrowserWindow.setTrafficLightPosition(position)`
- **Removed**: `BrowserWindow.getTrafficLightPosition()`
- **Removed**: `ipcRenderer.sendTo()`
- **Removed**: `app.runningUnderRosettaTranslation`
- **Deprecated**: `renderer-process-crashed` event on `app`
- **Deprecated**: `crashed` event on WebContents and `<webview>`
- **Deprecated**: `gpu-process-crashed` event on `app`

### Electron 27.0

- **Removed**: macOS 10.13 / 10.14 support
- **Deprecated**: `ipcRenderer.sendTo()`
- **Removed**: Color scheme events in `systemPreferences`
- **Removed**: Some `window.setVibrancy` options on macOS
- **Removed**: `webContents.getPrinters`
- **Removed**: `systemPreferences.{get,set}AppLevelAppearance` and `systemPreferences.appLevelAppearance`
- **Removed**: `alternate-selected-control-text` value for `systemPreferences.getColor`

### Electron 20.0

- **Removed**: macOS 10.11 / 10.12 support
- **Default Changed**: Renderers without `nodeIntegration: true` are sandboxed by default
- **Removed**: `skipTaskbar` on Linux
- **API Changed**: `session.setDevicePermissionHandler(handler)`

### Electron 14.0

- **Removed**: `remote` module
- **Removed**: `app.allowRendererProcessReuse`
- **Removed**: Browser Window Affinity
- **API Changed**: `window.open()`
- **Removed**: `worldSafeExecuteJavaScript`
- **Removed**: BrowserWindowConstructorOptions inheriting from parent windows

### Electron 12.0

- **Removed**: Pepper Flash support
- **Default Changed**: `worldSafeExecuteJavaScript` defaults to `true`
- **Default Changed**: `contextIsolation` defaults to `true`
- **Removed**: `crashReporter.getCrashesDirectory()`
- **Removed**: `crashReporter` methods in the renderer process
- **Default Changed**: `crashReporter.start({ compress: true })`
- **Deprecated**: `remote` module

## Migration Best Practices

1. **Read the breaking changes** before upgrading to a new major version
2. **Address deprecation warnings** — they indicate what will be removed next
3. **Use the Electron version** that matches your dependencies
4. **Test thoroughly** after upgrading
5. **Check platform support** — older OS versions are dropped regularly
