# Electron Fuses

## What are Fuses?

Electron Fuses are package-time feature toggles that allow you to enable or disable certain Electron features at build time. Unlike runtime flags, fuses are embedded in the Electron binary and cannot be changed at runtime without modifying the binary.

This makes fuses more secure than command-line switches, which can be modified by users.

## Current Fuses

| Fuse | Default | Description |
|------|---------|-------------|
| `runAsNode` | Enabled | Allows the app to run as a Node.js process via `ELECTRON_RUN_AS_NODE` |
| `cookieEncryption` | Disabled | Enables encryption of cookies using OS-level keychain |
| `nodeOptions` | Enabled | Allows `NODE_OPTIONS` and `NODE_EXTRA_CA_CERTS` environment variables |
| `nodeCliInspect` | Enabled | Allows `--inspect`, `--inspect-brk`, and `--remote-debugging-port` CLI flags |
| `embeddedAsarIntegrityValidation` | Disabled | Validates ASAR archive integrity at runtime |
| `onlyLoadAppFromAsar` | Disabled | Prevents loading app from a folder; requires ASAR archive |
| `loadBrowserProcessSpecificV8Snapshot` | Disabled | Loads a separate V8 snapshot for the browser process |
| `grantFileProtocolExtraPrivileges` | Enabled | Grants `file://` protocol extra privileges |
| `wasmTrapHandlers` | Enabled | Enables WebAssembly trap handlers |

## How to Flip Fuses

### The Easy Way — @electron/fuses

```bash
npm install --save-dev @electron/fuses
```

```javascript
const { flipFuses } = require('@electron/fuses')

await flipFuses(
  require('electron'),
  {
    version: '43.1.1',
    resetDefaultFuses: true,
    fuseWireVersion: 1,
    fuses: {
      runAsNode: false,
      enableCookieEncryption: true,
      enableNodeOptionsInspect: false,
      embeddedAsarIntegrityValidation: true,
      onlyLoadAppFromAsar: true,
      loadBrowserProcessSpecificV8Snapshot: false,
      grantFileProtocolExtraPrivileges: false
    }
  }
)
```

### The Hard Way — Manual Binary Editing

Fuses are stored in the Electron binary at a specific offset. The fuse wire is a sequence of bytes:

1. Find the `dL7pKGdnNz796PbbjQWNKmHXBZaB9tsX` sentinel string in the binary
2. The fuse wire follows the sentinel
3. Each fuse is a single byte:
   - `0` = `REMOVED` (feature disabled, cannot be re-enabled)
   - `1` = `DISABLED` (feature disabled)
   - `2` = `ENABLED` (feature enabled)

```javascript
const fs = require('fs')
const path = require('path')

const electronPath = path.join(__dirname, 'node_modules/electron/dist/Electron.app/Contents/MacOS/Electron')
const buffer = fs.readFileSync(electronPath)

const sentinel = Buffer.from('dL7pKGdnNz796PbbjQWNKmHXBZaB9tsX')
const sentinelIndex = buffer.indexOf(sentinel)

if (sentinelIndex === -1) {
  throw new Error('Fuse sentinel not found')
}

// Fuse values start after the sentinel
const fuseIndex = sentinelIndex + sentinel.length

// Example: Disable runAsNode (fuse 0)
buffer.writeUInt8(0, fuseIndex + 0) // 0 = REMOVED

fs.writeFileSync(electronPath, buffer)
```

## Security Benefits

Fuses are particularly useful for security hardening:

- **Disable `runAsNode`**: Prevents users from running your app as a Node.js REPL
- **Enable `cookieEncryption`**: Protects cookies at rest using OS keychain
- **Disable `nodeCliInspect`**: Prevents debugger attachment
- **Enable `embeddedAsarIntegrityValidation`**: Detects tampered ASAR archives
- **Enable `onlyLoadAppFromAsar`**: Prevents loading code from directories (easier to tamper with)
- **Disable `grantFileProtocolExtraPrivileges`**: Limits `file://` protocol access

## Integration with Electron Forge

```javascript
// forge.config.js
module.exports = {
  packagerConfig: {
    afterCopy: [
      async (buildPath, electronVersion, platform, arch, callback) => {
        const { flipFuses } = require('@electron/fuses')
        await flipFuses(path.join(buildPath, '..'), {
          version: electronVersion,
          fuses: {
            runAsNode: false,
            enableCookieEncryption: true
          }
        })
        callback()
      }
    ]
  }
}
```
