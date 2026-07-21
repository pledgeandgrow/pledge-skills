# Electron Tutorial — Building Your First App

## Prerequisites

### Required Tools

- **Node.js and npm**: Install the latest LTS version. Electron bundles its own Node.js runtime, so end users don't need Node.js installed
- **Code editor**: VS Code recommended
- **Command line**: Terminal/PowerShell
- **Git and GitHub**: For version control and publishing

### Assumptions

Familiarity with Node.js and front-end web development basics. Recommended resources:
- [Getting started with the Web (MDN)](https://developer.mozilla.org/en-US/docs/Learn/)
- [Introduction to Node.js](https://nodejs.dev/en/learn/)

### Quick Start with Electron Forge

For a single-command boilerplate:
```bash
npx @electron-forge/cli create-electron-app my-app
```

## Building Your First App

### Project Setup

```bash
mkdir my-electron-app && cd my-electron-app
npm init
```

Key `package.json` fields:
```json
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron ."
  },
  "devDependencies": {
    "electron": "^43.1.1"
  }
}
```

Install Electron:
```bash
npm install --save-dev electron
```

**Windows note**: Do not use WSL (Windows Subsystem for Linux) — you'll encounter issues running the app.

### .gitignore

```
node_modules/
dist/
out/
*.log
```

### Running the App

The `main` script in `package.json` is the entry point — it controls the main process.

Minimal `main.js`:
```javascript
console.log('Hello from Electron 👋')
```

Run with:
```bash
npm run start
```

### Loading a Web Page

Create `index.html`:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'" />
    <title>Hello from Electron renderer!</title>
  </head>
  <body>
    <h1>Hello from Electron renderer!</h1>
    <p>👋</p>
  </body>
</html>
```

Update `main.js` to create a BrowserWindow:
```javascript
const { app, BrowserWindow } = require('electron/main')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})
```

### Managing Window Lifecycle

Different platforms have different conventions:

```javascript
// Quit when all windows are closed (Windows & Linux)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// Open a window if none are open (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
```

Platform values: `win32` (Windows), `linux` (Linux), `darwin` (macOS)

### Final Starter Code

```javascript
// main.js
const { app, BrowserWindow } = require('electron/main')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
```

### Debugging from VS Code

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Main Process",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
      "windows": {
        "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron.cmd"
      },
      "args": ["."],
      "outputCapture": "std"
    }
  ]
}
```

## Publishing and Updating

### Using update.electronjs.org

Free auto-updating service for open-source apps. Requirements:
- App runs on macOS or Windows
- App has a public GitHub repository
- Builds published to GitHub releases
- Builds are code signed (macOS only)

### Publishing a GitHub Release

1. Generate a GitHub personal access token with repo permissions
2. Configure GitHub Publisher in `forge.config.js`:
```javascript
module.exports = {
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'your-username',
          name: 'your-repo'
        },
        prerelease: false,
        draft: true
      }
    }
  ]
}
```

3. Run the publish command:
```bash
npm run publish
```

### Instrumenting Auto-Update

Install `update-electron-app`:
```bash
npm install update-electron-app
```

Add to main process:
```javascript
require('update-electron-app')()
```

This automatically:
- Checks for updates from update.electronjs.org
- Uses the `repository` field in `package.json` to find the feed
- Downloads and installs updates when available

### Alternative: Custom Update Server

For private repos or non-GitHub hosting:
- Use `autoUpdater` module directly
- Deploy your own update server (Squirrel.Mac, Squirrel.Windows)
- Use cloud object storage (S3, etc.) with release metadata files
