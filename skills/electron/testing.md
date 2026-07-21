# Automated Testing

Test automation validates that your application code works as intended. Electron doesn't maintain its own testing solution, but supports several approaches.

## Using the WebDriver Interface

WebDriver is an open source tool for automated testing of web apps. ChromeDriver implements WebDriver's wire protocol for Chromium.

### With WebdriverIO

WebdriverIO is a test automation framework that works with ChromeDriver.

Setup:
```bash
npm install --save-dev webdriverio @wdio/cli chromedriver
```

Configure `wdio.conf.js`:
```javascript
exports.config = {
  services: ['chromedriver'],
  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      binary: '/path/to/electron/binary',
      args: ['app=/path/to/your/app']
    }
  }]
}
```

### With Selenium

Selenium WebDriver can drive Electron via ChromeDriver.

```javascript
const webdriver = require('selenium-webdriver')
const chromedriver = require('chromedriver')

const driver = new webdriver.Builder()
  .usingServer('http://localhost:9515')
  .forBrowser('chrome')
  .setChromeOptions(new webdriver.chrome.Options()
    .setChromeBinaryPath('/path/to/electron')
    .addArguments('app=/path/to/your/app'))
  .build()
```

## Using Playwright

Microsoft Playwright has experimental Electron support via Chrome DevTools Protocol (CDP).

### Install Dependencies

```bash
npm install --save-dev @playwright/test
```

### Write Tests

```javascript
const { _electron: electron } = require('@playwright/test')

const test = async () => {
  const electronApp = await electron.launch({ args: ['.'] })

  // Get the first window
  const window = await electronApp.firstWindow()

  // Test the window title
  const title = await window.title()
  console.log('Window title:', title)

  // Interact with the page
  await window.click('button#my-button')

  // Take a screenshot
  await window.screenshot({ path: 'screenshot.png' })

  // Close the app
  await electronApp.close()
}

test()
```

### Playwright Electron Features

- `electron.launch()` — start Electron app
- `electronApp.firstWindow()` — get first BrowserWindow
- `electronApp.windows()` — get all windows
- `electronApp.evaluate()` — evaluate in main process
- Standard Playwright page methods work on windows

## Using a Custom Test Driver

Write your own driver using Node.js' IPC-over-STDIO. Custom drivers have lower overhead and let you expose custom methods.

### Spawning the App

```javascript
const electronPath = require('electron')
const childProcess = require('node:child_process')

const env = { /* ... */ }
const stdio = ['inherit', 'inherit', 'inherit', 'ipc']
const appProcess = childProcess.spawn(electronPath, ['./app'], { stdio, env })

// Listen for IPC messages
appProcess.on('message', (msg) => { /* ... */ })

// Send IPC messages
appProcess.send({ my: 'message' })
```

### In the Electron App

```javascript
// Listen for messages from the test suite
process.on('message', (msg) => { /* ... */ })

// Send messages to the test suite
process.send({ my: 'message' })
```

### TestDriver Class (RPC Pattern)

```javascript
class TestDriver {
  constructor({ path, args, env }) {
    this.rpcCalls = []
    env.APP_TEST_DRIVER = 1
    this.process = childProcess.spawn(path, args, {
      stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
      env
    })

    this.process.on('message', (message) => {
      const rpcCall = this.rpcCalls[message.msgId]
      if (!rpcCall) return
      this.rpcCalls[message.msgId] = null
      if (message.reject) rpcCall.reject(message.reject)
      else rpcCall.resolve(message.resolve)
    })

    this.isReady = this.rpc('isReady').catch((err) => {
      console.error('Application failed to start', err)
      this.stop()
      process.exit(1)
    })
  }

  async rpc(cmd, ...args) {
    const msgId = this.rpcCalls.length
    this.process.send({ msgId, cmd, args })
    return new Promise((resolve, reject) =>
      this.rpcCalls.push({ resolve, reject })
    )
  }

  stop() {
    this.process.kill()
  }
}

module.exports = { TestDriver }
```

### App-Side RPC Handler

```javascript
if (process.env.APP_TEST_DRIVER) {
  process.on('message', async (msg) => {
    const [cmd, ...args] = [msg.cmd, ...msg.args]
    try {
      const result = await handleCommand(cmd, ...args)
      process.send({ msgId: msg.msgId, resolve: result })
    } catch (err) {
      process.send({ msgId: msg.msgId, reject: err.message })
    }
  })
}
```

## Application Debugging

### Renderer Process Debugging

Use Chromium DevTools — the most comprehensive tool for debugging renderer processes:

```javascript
const { BrowserWindow } = require('electron')
const win = new BrowserWindow()
win.webContents.openDevTools()
```

DevTools are available for all renderer processes, including `BrowserWindow`, `BrowserView`, and `<webview>`.

### Main Process Debugging

The main process cannot use DevTools directly. Use the `--inspect` or `--inspect-brk` command line switches:

```bash
# Start with inspector waiting to attach
electron --inspect=5858 .

# Start with inspector paused on first line
electron --inspect-brk=5858 .
```

Then attach an external debugger (Chrome DevTools, VS Code, etc.) via `chrome://inspect` or `node --inspect` protocol.

### VS Code Integration

`.vscode/launch.json` for debugging both processes:

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

### V8 Crashes

If the V8 engine crashes, check:
- Crash reports in `~/Library/Logs/Electron/` (macOS) or `%APPDATA%\Electron\logs\` (Windows)
- Use `crashReporter` to collect crash data
- Check for native module ABI mismatches
