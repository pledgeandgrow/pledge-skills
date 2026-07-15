# Troubleshooting

## CLI

### Error: Cannot find module 'C:\foo\bar&baz\vite\bin\vite.js'

This happens when the project path contains special characters like `&`. Use a path without special characters.

---

## Config

### This package is ESM only

If your `package.json` has `"type": "module"`, Vite config can use ESM syntax. If not, Vite auto-pre-processes the config file.

For CJS projects, use `.cjs` extension:

```js
// vite.config.cjs
module.exports = {
  // config
}
```

---

## Dev Server

### Requests are stalled forever

This can happen when there are too many concurrent requests. Solutions:

- Restart your browser
- Change browser connection limits (temporary)
- Use HTTP/2

### Vite crashes with ENOSPC error

On Linux, this is caused by the inotify watcher limit. Fix:

```bash
# Temporary
echo 65536 | sudo tee -a /proc/sys/fs/inotify/max_user_watches

# Permanent
echo "fs.inotify.max_user_watches=65536" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Network requests stop loading

If network requests stop loading after some time, it may be caused by browser extensions. Try in incognito mode.

### 431 Request Header Fields Too Large

Clear cookies and local storage for the dev server domain.

### Dev Containers / VS Code Port Forwarding

If using VS Code Dev Containers, ensure port forwarding is configured correctly. Use `--host 0.0.0.0` to allow external access.

---

## HMR

### Vite detects a file change but the HMR is not working

1. Check if the file is imported by the module graph
2. Ensure the framework plugin is installed (e.g., `@vitejs/plugin-react`)
3. Check for circular dependencies that may break HMR

### Vite does not detect a file change

1. Ensure the file is within the project root
2. Check `server.watch` configuration
3. On WSL2, ensure files are on the Linux filesystem (not Windows mount)

### A full reload happens instead of HMR

This happens when:
- The changed file doesn't have HMR boundaries
- The framework plugin doesn't support HMR for that file type
- There's a syntax error in the file

---

## Build

### Built file does not work because of CORS error

Ensure `base` is configured correctly for your deployment path:

```ts
export default defineConfig({
  base: '/my-app/',
})
```

### No such file or directory error due to case sensitivity

Linux is case-sensitive, macOS/Windows are not. Ensure consistent casing in import paths.

### Failed to fetch dynamically imported module error

This happens when a chunk from a previous deployment is no longer available. Handle with:

```ts
window.addEventListener('vite:preloadError', () => {
  window.location.reload()
})
```

---

## Optimized Dependencies

### Outdated pre-bundled deps when linking to a local package

When you link a local package, Vite may use a cached version. Force re-optimization:

```bash
vite --force
```

Or delete the cache:

```bash
rm -rf node_modules/.vite
```

---

## Performance Bottlenecks

Profile Vite's performance:

```bash
vite --profile
```

This generates a CPU profile. See `performance.md` for optimization tips.

---

## Others

### Module externalized for browser compatibility

This warning appears when a Node.js-only module is imported in client code. Either:
- Move the import to SSR-only code
- Use a browser-compatible alternative
- Add the package to `optimizeDeps.include`

### Syntax Error / Type Error happens

1. Check for syntax errors in the file
2. Ensure TypeScript config is correct
3. Try clearing the Vite cache: `vite --force`

### Browser extensions

Some browser extensions (e.g., ad blockers, React DevTools) can interfere with Vite's dev server. Test in incognito mode.

### Cross drive links on Windows

If your project is on a different drive than `node_modules`, symlinks may not work. Use `mklink /D` with absolute paths.

### Default import unexpectedly returns an object

Some CJS packages export an object as default. Use:

```ts
import pkg from 'some-cjs-package'
// or
import { named } from 'some-cjs-package'
```
