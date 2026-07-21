# Performance Best Practices

## Measure, Measure, Measure

Before optimizing, measure your app's performance. Use Chrome DevTools (built into Electron) to profile both main and renderer processes.

### Recommended Reading

- [Chrome DevTools: Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Web Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)

## Checklist: Performance Recommendations

### 1. Carelessly Including Modules

Avoid loading modules you don't need. Each `require()` call loads code into memory. Use tree-shaking and bundlers to eliminate unused code.

### 2. Loading and Running Code Too Soon

Defer non-critical code execution:
- Use `app.whenReady()` for app initialization
- Defer window creation until needed
- Lazy-load modules with dynamic `import()`

### 3. Blocking the Main Process

The main process is the parent process and handles the UI thread. **Never block it** with long-running operations.

**Why?** The main process handles window management, OS interactions, and IPC routing. Blocking it freezes the entire app.

**How to avoid:**
- Use **worker threads** for CPU-heavy tasks: `new Worker()` or `utilityProcess`
- Avoid **synchronous IPC** (`ipcRenderer.sendSync`)
- Avoid `@electron/remote` module
- Prefer **asynchronous I/O** — use `fs.promises` instead of `fs.readFileSync`

```javascript
// ❌ Bad — blocks main process
const data = fs.readFileSync('large-file.txt', 'utf8')

// ✅ Good — non-blocking
const data = await fs.promises.readFile('large-file.txt', 'utf8')
```

### 4. Blocking the Renderer Process

Keep the renderer smooth (60fps) by offloading heavy work:

- **`requestIdleCallback()`**: Queue low-priority work for idle periods
- **Web Workers**: Run CPU-intensive code on separate threads

```javascript
// Using requestIdleCallback for small tasks
requestIdleCallback(() => {
  performLowPriorityWork()
})

// Using Web Workers for heavy computation
const worker = new Worker('./heavy-computation.js')
worker.postMessage({ data })
worker.onmessage = (event) => {
  console.log('Result:', event.data)
}
```

### 5. Unnecessary Polyfills

Electron ships with a modern Chromium. Avoid polyfills for features that are already supported (Promise, fetch, async/await, etc.).

### 6. Unnecessary or Blocking Network Requests

- Cache responses when possible
- Use `fetch()` (non-blocking) instead of synchronous XHR
- Defer non-critical network requests

### 7. Bundle Your Code

Use bundlers (webpack, esbuild, Vite) to:
- Tree-shake unused code
- Minify and compress
- Reduce the number of file system reads at runtime

### 8. Disable Default Menu When Not Needed

```javascript
const { Menu } = require('electron')

// If you don't need a default menu
Menu.setApplicationMenu(null)
```

This reduces memory usage and improves startup time.

## Multithreading

### Web Workers

Available in renderer processes for CPU-intensive tasks:

```javascript
const worker = new Worker('./worker.js')
worker.postMessage({ input: data })
worker.onmessage = (event) => {
  console.log('Result:', event.data)
}
```

### Worker Threads (Node.js)

Available in the main process:

```javascript
const { Worker } = require('node:worker_threads')

const worker = new Worker('./worker.js')
worker.postMessage({ input: data })
worker.on('message', (result) => {
  console.log('Result:', result)
})
```

### Utility Process

Electron's `utilityProcess` API for spawning Node.js processes:

```javascript
const { utilityProcess } = require('electron')

const child = utilityProcess.fork('./worker.js')
child.on('message', (data) => {
  console.log('Received:', data)
})
child.postMessage({ input: data })
```

### Available APIs in Multithreaded Contexts

- Web Workers: Web APIs only (no Node.js)
- Worker Threads: Full Node.js APIs
- Utility Process: Full Node.js + limited Electron APIs

### Native Node.js Modules in Workers

Native modules need to be context-aware to work in worker threads. Check that your native dependencies support this.
