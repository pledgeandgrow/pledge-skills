---
name: electron-docs
version: "43.x"
tags:
  - electron
  - desktop
  - cross-platform
  - chromium
  - node.js
  - ipc
  - main-process
  - renderer-process
  - preload
  - context-bridge
  - context-isolation
  - browserwindow
  - security
  - sandbox
  - performance
  - testing
  - playwright
  - webdriver
  - native-modules
  - distribution
  - code-signing
  - auto-updater
  - forge
  - fuses
  - breaking-changes
  - dark-mode
  - notifications
  - web-embeds
  - keyboard-shortcuts
  - spellchecker
  - progress-bar
  - dock
  - taskbar
  - window-customization
  - accessibility
  - multithreading
  - message-ports
  - menu
  - dialog
  - shell
  - session
  - webcontents
  - tray
  - nativeimage
  - crashreporter
  - powermonitor
  - screen
  - clipboard
  - globalshortcut
  - basewindow
  - webcontentsview
  - utilityprocess
  - net
  - inapppurchase
  - menus
  - context-menu
  - menu-roles
  - menu-item
  - deep-links
  - recent-documents
  - online-offline
  - windows-arm
  - contributing
  - build-instructions
  - patches
  - coding-style
  - clang-tidy
  - reclient
  - debugging-main-process
  - menuitem
  - view
  - contenttracing
  - desktopcapturer
  - powersaveblocker
  - process
  - protocol
  - pushnotifications
  - sharemenu
  - touchbar
  - webrequest
  - commandline
  - clientrequest
  - cookies
  - downloaditem
  - notification
  - safestorage
  - webframe
  - webframemain
  - serviceworkers
  - faq
  - glossary
description: |
  Electron 43.x — process model, IPC, security, performance, distribution, auto-updater, Forge, native modules.
---

# Electron Skill

Electron is a framework for building desktop applications using JavaScript, HTML, and CSS. By embedding Chromium and Node.js into its binary, Electron allows you to maintain one JavaScript codebase and create cross-platform apps that work on Windows, macOS, and Linux. This skill covers the Electron latest documentation.

## When to Use

- Building cross-platform desktop applications with web technologies
- Creating apps that need native OS integration (menus, notifications, dock, taskbar)
- Wrapping web applications as desktop apps with Node.js backend capabilities
- Apps requiring inter-process communication between main and renderer processes
- Distributing auto-updating desktop applications

## Skill Files

- **`introduction.md`** — What is Electron, why choose web technologies, why choose Electron (enterprise-grade, mature, stability/security/performance, developer experience), when to choose something else, Electron Fiddle, docs structure
- **`tutorial.md`** — Prerequisites (Node.js, npm, code editor, git), building first app (project setup, BrowserWindow, window lifecycle, platform differences), publishing and updating (GitHub releases, update.electronjs.org, autoUpdater, update-electron-app)
- **`process-model.md`** — Multi-process architecture (main process, renderer process, utility process), preload scripts, contextBridge, process-specific module aliases (TypeScript: electron/main, electron/renderer, electron/common)
- **`ipc.md`** — Inter-process communication: Pattern 1 (renderer→main one-way with ipcMain.on/ipcRenderer.send), Pattern 2 (renderer→main two-way with ipcMain.handle/ipcRenderer.invoke), Pattern 3 (main→renderer with webContents.send), Pattern 4 (renderer→renderer via MessagePort), object serialization
- **`context-isolation.md`** — Context isolation feature, migration from window.X pattern, contextBridge.exposeInMainWorld, security considerations (safe vs unsafe API exposure), TypeScript usage
- **`security.md`** — 20-item security checklist (secure content, Node.js integration, context isolation, sandboxing, permission requests, webSecurity, CSP, navigation limits, IPC validation, fuses), process sandboxing (renderer behavior, preload scripts, configuring sandbox)
- **`performance.md`** — 8-item performance checklist (module inclusion, code loading, blocking main process, blocking renderer, polyfills, network requests, bundling, Menu.setApplicationMenu), worker threads, requestIdleCallback, Web Workers
- **`distribution.md`** — Electron Forge (packaging and publishing), code signing (macOS notarization, Windows certificates, Azure Artifact Signing), auto-updating (update.electronjs.org, GitHub releases, custom update servers, autoUpdater module)
- **`testing.md`** — Automated testing with WebDriver (WebdriverIO, Selenium), Playwright (CDP support, Electron experimental), custom test driver (IPC-over-STDIO, TestDriver class, RPC pattern), application debugging (renderer DevTools, main process --inspect, VS Code integration, V8 crashes)
- **`native-modules.md`** — Native Node.js modules, ABI differences, electron-rebuild, npm rebuild, manual building, troubleshooting, prebuild/node-pre-gyp, win_delay_load_hook
- **`features.md`** — Dark mode (native interfaces, CSS prefers-color-scheme), notifications (main/renderer process, platform considerations), web embeds (iframe, webview, WebContentsView), keyboard shortcuts (accelerators, local/global shortcuts), spellchecker, progress bars, macOS Dock, Windows taskbar (JumpList, thumbnail toolbars, icon overlays, flash frame), window customization (custom title bar, traffic lights, custom draggable regions, click-through windows, frameless windows, transparent windows), accessibility, multithreading (Web Workers, worker threads), message ports, recent documents (JumpList/Dock), online/offline event detection (navigator.onLine, net.isOnline), deep links (custom protocol handler, setAsDefaultProtocolClient), tray menu (Tray icon, context menu, minimizing to tray), Windows on ARM (cross-compilation, native modules), in-app purchases (macOS Mac App Store, inAppPurchase module), menus (application menu, building menus, item types, roles, accelerators, advanced configuration), context menu (context-menu event, params, renderer process, macOS additional items)
- **`fuses.md`** — Electron Fuses (package-time feature toggles): runAsNode, cookieEncryption, nodeOptions, nodeCliInspect, embeddedAsarIntegrityValidation, onlyLoadAppFromAsar, loadBrowserProcessSpecificV8Snapshot, grantFileProtocolExtraPrivileges, wasmTrapHandlers; flipping fuses (easy way with @electron/fuses, hard way)
- **`breaking-changes.md`** — Breaking changes by version (44.0 down to 2.0), types of breaking changes, deprecated/removed/changed APIs, platform support removals, default value changes
- **`api-reference.md`** — Key API modules: app (events, methods, properties), BrowserWindow (options, events, methods), BaseWindow (parent/child windows, modal windows, resource management, platform notices), WebContentsView (View extension, webContents property), View (base class, addChildView, setBounds), ipcMain (on, handle, off), ipcRenderer (send, invoke, on, sendSync), contextBridge (exposeInMainWorld, exposeInIsolatedWorld), Menu, MenuItem (label, type, role, accelerator, icon), dialog (open/save/message/certificate dialogs), shell (openPath, openExternal, trashItem, showItemInFolder), session (fromPartition, defaultSession, cookies, webRequest, serviceWorkers), webContents (loadURL, executeJavaScript, events, methods), Tray (icon, context menu, platform considerations), nativeImage (createFromPath, createFromBuffer, template images), crashReporter (start, getUploadedReports), autoUpdater (setFeedURL, checkForUpdates, events), powerMonitor (suspend, resume, on-battery, idle), systemPreferences (getColor, getUserDefault, TouchID, media access), screen (getCursorScreenPoint, getPrimaryDisplay, getAllDisplays), clipboard (readText, writeText, readImage, writeHTML), globalShortcut (register, unregister), utilityProcess (fork, stdio, serviceName, events), net (request, fetch, isOnline, resolveHost, online property), inAppPurchase (canMakePayments, getProducts, purchaseProduct), contentTracing (startRecording, stopRecording), desktopCapturer (getSources, platform caveats), powerSaveBlocker (start, stop, isStarted), process (sandboxed, contextIsolated, versions, getHeapStatistics), protocol (handle, registerSchemesAsPrivileged, deprecated methods), pushNotifications (APNS, macOS), ShareMenu (macOS sharing), TouchBar + sub-classes (Button, ColorPicker, Group, Label, Popover, Scrubber, SegmentedControl, Slider, Spacer, OtherItemsProxy), WebRequest (onBeforeRequest, onHeadersReceived, onCompleted), CommandLine (appendSwitch, appendArgument, hasSwitch), ClientRequest (headers, write, end, response event), Cookies (get, set, remove, changed event), DownloadItem (setSavePath, pause, resume, progress), Notification (show, click, isSupported), safeStorage (encryptString, decryptString, isEncryptionAvailable), webFrame (setZoomFactor, insertCSS, executeJavaScript, spell check), webFrameMain (fromId, fromFrameToken, frame hierarchy), ServiceWorkers (console-message, getAllRunning), FAQ (installation, Chromium/Node upgrades, jQuery, tray, class inheritance), Glossary (ASAR, context isolation, IPC, main/renderer process, sandbox, Squirrel, V8, webview)
- **`contributing.md`** — Developing Electron itself: issues (bug reports, triaging), pull requests (fork, build, branch, code, commit, rebase, test, push, PR workflow), coding style (general, C++/Python, JavaScript, documentation), source code directory structure, build instructions (build-tools, manual setup for macOS/Windows/Linux, Reclient remote execution), testing (linting, unit tests, Node.js smoke tests), debugging (generic, stacktraces, breakpoints, symbol server), patches (justification, patch system, git-import/export-patches), Chromium development resources, V8 development resources, creating new API modules, clang-tidy, governance

## Key Concepts

- **Main Process**: Entry point, runs in Node.js, controls app lifecycle, creates windows, has access to native APIs
- **Renderer Process**: Each BrowserWindow gets its own renderer, renders web content, follows web standards
- **Preload Scripts**: Run before web content loads, have Node.js access, bridge main and renderer via contextBridge
- **Context Isolation**: Preload scripts and Electron internals run in separate context from web content (enabled by default since Electron 12)
- **IPC**: Inter-process communication between main and renderer processes via ipcMain/ipcRenderer modules
- **Sandboxing**: Renderer processes can be sandboxed to limit system access
- **Auto-Update**: Built-in Squirrel framework + autoUpdater module for application updates
- **Fuses**: Package-time feature toggles for security and functionality control

## Common Patterns

```javascript
// main.js - Main process
const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog()
    if (!canceled) return filePaths[0]
  })
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
```

```javascript
// preload.js - Preload script with contextBridge
const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile')
})
```

```javascript
// renderer.js - Renderer process
const btn = document.getElementById('btn')
btn.addEventListener('click', async () => {
  const filePath = await window.electronAPI.openFile()
  console.log(filePath)
})
```

## Version

Electron latest (43.x) — requires Node.js (bundled separately from system Node.js)
