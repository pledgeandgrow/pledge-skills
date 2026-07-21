# Configuration Files

Understanding the configuration files in a Tauri project.

## Overview

Tauri projects use several configuration files:
- **`tauri.conf.json`** — Main Tauri configuration
- **`Cargo.toml`** — Rust dependencies and metadata
- **`package.json`** — Frontend dependencies and scripts

## Tauri Config

The `tauri.conf.json` file (located in `src-tauri/`) is the primary configuration file.

### Supported formats

Tauri supports JSON, JSON5, and TOML:
- `tauri.conf.json` (default)
- `tauri.conf.json5`
- `tauri.conf.toml` (requires `toml` feature)

### Basic structure

```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "My App",
  "version": "1.0.0",
  "identifier": "com.example.myapp",
  "build": {
    "frontendDist": "../dist",
    "devUrl": "http://localhost:3000",
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build"
  },
  "app": {
    "windows": [
      {
        "title": "My App",
        "width": 800,
        "height": 600,
        "resizable": true,
        "fullscreen": false
      }
    ],
    "security": {
      "csp": null
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ]
  }
}
```

### Key sections

#### `app`

Application-level configuration:
- `windows` — Array of window configurations
- `security` — CSP and security settings
- `trayIcon` — System tray icon configuration
- `macOSPrivateApi` — Enable macOS private APIs
- `withGlobalTauri` — Expose Tauri API globally

#### `build`

Build configuration:
- `frontendDist` — Path to frontend dist directory or dev server URL
- `devUrl` — Development server URL
- `beforeDevCommand` — Command to run before dev
- `beforeBuildCommand` — Command to run before build

#### `bundle`

Bundle/installer configuration:
- `active` — Enable bundling
- `targets` — Which bundle formats to create ("all", "deb", "rpm", "appimage", "nsis", "msi", "dmg", etc.)
- `icon` — App icons
- `resources` — Additional files to bundle
- `externalBin` — External binaries (sidecars)
- `windows` — Windows-specific bundling (NSIS, MSI, WiX)
- `macOS` — macOS-specific bundling (DMG, signing)
- `linux` — Linux-specific bundling (deb, rpm, appimage)

#### `identifier`

Unique app identifier (reverse domain notation):
```json
"identifier": "com.example.myapp"
```

#### `plugins`

Plugin configuration:
```json
"plugins": {
  "updater": {
    "active": true,
    "endpoints": ["https://example.com/updates.json"],
    "pubkey": "..."
  }
}
```

### Platform-specific configuration

Override config per platform:

```json
{
  "app": {
    "windows": [
      {
        "title": "My App",
        "width": 800,
        "height": 600
      }
    ]
  },
  "bundle": {
    "windows": {
      "webviewInstallMode": {
        "type": "embedBootstrapper"
      }
    }
  }
}
```

### Extending the configuration

Use a JavaScript/TypeScript config file for dynamic configuration:

```javascript
// tauri.conf.js (requires tauri-cli >= 2.0)
export default {
  productName: 'My App',
  version: process.env.APP_VERSION || '1.0.0',
  // ...
};
```

## Cargo.toml

The `Cargo.toml` file in `src-tauri/` manages Rust dependencies:

```toml
[package]
name = "my-app"
version = "1.0.0"
edition = "2021"

[lib]
name = "my_app_lib"
crate-type = ["staticlib", "cdylib", "rlib"]

[build-dependencies]
tauri-build = { version = "2", features = [] }

[dependencies]
tauri = { version = "2", features = [] }
tauri-plugin-shell = "2"
tauri-plugin-dialog = "2"
tauri-plugin-fs = "2"
serde = { version = "1", features = ["derive"] }
serde_json = "1"

[features]
custom-protocol = ["tauri/custom-protocol"]

[profile.release]
panic = "abort"
codegen-units = 1
opt-level = "s"
lto = true
strip = true
```

### Adding Tauri plugins

```bash
# Using the CLI
cargo tauri add fs
cargo tauri add dialog
cargo tauri add shell

# Or manually in Cargo.toml
# [dependencies]
# tauri-plugin-fs = "2"
```

## package.json

The `package.json` manages frontend dependencies and scripts:

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "tauri": "tauri"
  },
  "dependencies": {
    "@tauri-apps/api": "^2",
    "@tauri-apps/plugin-fs": "^2",
    "@tauri-apps/plugin-dialog": "^2",
    "@tauri-apps/plugin-shell": "^2"
  },
  "devDependencies": {
    "@tauri-apps/cli": "^2",
    "vite": "^5"
  }
}
```

### Key dependencies

- `@tauri-apps/api` — Core Tauri JavaScript API
- `@tauri-apps/cli` — Tauri CLI (for `npm run tauri`)
- `@tauri-apps/plugin-*` — JavaScript bindings for Tauri plugins

## Best practices

1. Keep `tauri.conf.json` in version control
2. Use environment-specific configs for dev/production
3. Pin plugin versions to match the Rust crate versions
4. Use `$schema` for IDE autocompletion
5. Set a proper `identifier` early (hard to change later)
6. Configure `beforeDevCommand` and `beforeBuildCommand` to match your frontend tooling
