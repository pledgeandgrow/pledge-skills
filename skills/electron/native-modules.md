# Native Node Modules

Native Node.js modules are supported by Electron, but since Electron has a different application binary interface (ABI) from a given Node.js binary (due to differences such as using Chromium's BoringSSL instead of OpenSSL), native modules need to be recompiled for Electron.

## How to Install Native Modules

### Installing Modules and Rebuilding for Electron

#### Using npm (Recommended)

Install `@electron/rebuild` and rebuild native modules:

```bash
npm install --save-dev @electron/rebuild

# Rebuild all native modules
npx @electron/rebuild

# Or via npm script
./node_modules/.bin/electron-rebuild
```

#### Using electron-builder

`electron-builder` can automatically rebuild native modules during packaging:

```json
{
  "build": {
    "npmRebuild": true
  }
}
```

#### Manually Building for Electron

Set environment variables to build against Electron's headers:

```bash
# Set Electron version
export npm_config_target=43.1.1
export npm_config_arch=x64
export npm_config_target_arch=x64
export npm_config_disturl=https://electronjs.org/headers
export npm_config_runtime=electron
export npm_config_build_from_source=true

# Then install
npm install your-native-module
```

#### Manually Building for a Custom Build of Electron

If you're building Electron from source:

```bash
export npm_config_target=$(node -p "require('electron/package.json').version")
export npm_config_arch=x64
export npm_config_disturl=https://your-custom-headers-server.com
export npm_config_runtime=electron
```

## Troubleshooting

### Common Error

If native modules aren't recompiled, you'll see:
```
Error: The module '/path/to/module.node' was compiled against a different
Node.js version using NODE_MODULE_VERSION XYZ. This version of Electron
requires NODE_MODULE_VERSION ABC.
```

### Solutions

1. Run `npx @electron/rebuild` after installing native modules
2. Delete `node_modules` and reinstall with the correct environment variables
3. Use `electron-builder` with `npmRebuild: true`

### A Note About win_delay_load_hook

On Windows, native modules need the `win_delay_load_hook` to work with Electron. This hook delays loading of the module until it's needed, which is required because Electron's executable is not named `node.exe`.

If you're building a native module, ensure your `binding.gyp` includes:
```python
{
  'target_name': 'your_module',
  'conditions': [
    ['OS=="win"', {
      'msvs_settings': {
        'VCLinkerTool': {
          'DelayLoadDLLs': ['node.exe'],
          # ... other settings
        }
      }
    }]
  ]
}
```

## Modules That Rely on prebuild

Some modules ship pre-built binaries via `prebuild` or `node-pre-gyp`. These may need special handling:

### prebuild

Modules using `prebuild` can install pre-built Electron binaries:
```bash
npm install your-module --build-from-source=false --runtime=electron --target=43.1.1
```

### node-pre-gyp

Modules using `node-pre-gyp` may not have Electron pre-built binaries. In this case:
1. Force building from source
2. Use `@electron/rebuild` to recompile

## Best Practices

- Always run `@electron/rebuild` after `npm install` when adding native modules
- Consider using `electron-builder` for automated rebuilding
- Pin your Electron version to ensure consistent ABI
- Test native modules on all target platforms
- Consider alternatives — many native modules have pure JavaScript equivalents
