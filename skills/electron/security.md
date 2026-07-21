# Security Considerations

## Preface

Security is everyone's responsibility. Electron security is important because Electron applications have access to powerful native APIs and Node.js, making them more powerful than regular web apps. If untrusted content gains access to these APIs, it can compromise the user's system.

## General Guidelines

### Isolation for Untrusted Content

If your application loads untrusted content (web pages from the internet), it's crucial to:
- Keep untrusted content isolated from privileged APIs
- Never enable Node.js integration for remote content
- Use context isolation and process sandboxing

## Checklist: Security Recommendations

1. **Only load secure content** — Use HTTPS, avoid loading content from unknown sources
2. **Do not enable Node.js integration for remote content** — `nodeIntegration: false` (default)
3. **Enable context isolation in all renderers** — `contextIsolation: true` (default since Electron 12)
4. **Enable process sandboxing** — `sandbox: true` in webPreferences
5. **Handle session permission requests from remote content** — Use `ses.setPermissionRequestHandler()` to control which permissions remote content can access
6. **Do not disable webSecurity** — `webSecurity: true` (default); disabling it disables same-origin policy
7. **Define a Content-Security-Policy** — Use restrictive rules like `script-src 'self'`
8. **Do not enable allowRunningInsecureContent** — Keep `allowRunningInsecureContent: false`
9. **Do not enable experimental features** — `experimentalFeatures: false`
10. **Do not use enableBlinkFeatures** — Avoid enabling Blink features that aren't production-ready
11. **`<webview>`: Do not use allowpopups** — Popups from webviews can bypass security restrictions
12. **`<webview>`: Verify options and params** — Check all options before creating webview elements
13. **Disable or limit navigation** — Only allow navigation to trusted URLs
14. **Disable or limit creation of new windows** — Control `window.open()` behavior
15. **Do not use `shell.openExternal` with untrusted content** — Can open malicious URLs in default apps
16. **Use a current version of Electron** — Stay up-to-date with security patches
17. **Validate the sender of all IPC messages** — Check `event.senderFrame` to verify message origin
18. **Avoid `file://` protocol** — Prefer custom protocols for local content
19. **Check which fuses you can change** — Use Electron Fuses to disable dangerous features at build time
20. **Do not expose Electron APIs to untrusted web content** — Only expose minimal, specific APIs via contextBridge

## Process Sandboxing

One key security feature in Chromium is that processes can be executed within a sandbox. The sandbox limits the harm that malicious code can cause by limiting access to most system resources — sandboxed processes can only freely use CPU cycles and memory.

### Sandbox Behavior in Electron

#### Renderer Processes

When sandboxed, renderer processes:
- Cannot directly access Node.js APIs
- Can only use Chromium's web APIs
- Communicate with the main process via IPC

#### Preload Scripts

Even in sandboxed renderers, preload scripts:
- Have access to a **limited subset** of Electron and Node.js APIs
- Can use `ipcRenderer`, `crashReporter`, `desktopCapturer`, `nativeImage`
- Have access to `require` but only for specific modules

### Configuring the Sandbox

#### Disabling for a Single Process

```javascript
const win = new BrowserWindow({
  webPreferences: {
    sandbox: false
  }
})
```

#### Enabling Globally

```javascript
app.enableSandbox()
// Or via command line: --enable-sandbox
```

#### Disabling Chromium's Sandbox (Testing Only)

```bash
# Command line flag — NOT for production
--no-sandbox
```

### Rendering Untrusted Content

If you need to render untrusted content:
- Always enable sandboxing
- Use context isolation
- Do not enable Node.js integration
- Limit navigation and new window creation
- Define a strict CSP

## Content Security Policy Example

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';" />
```

## IPC Sender Validation

```javascript
ipcMain.handle('privileged-action', (event, ...args) => {
  // Validate sender
  const senderFrame = event.senderFrame
  if (!senderFrame || senderFrame.url !== 'https://trusted-origin.com') {
    return null
  }
  // Proceed with privileged action
})
```
