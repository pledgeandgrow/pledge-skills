# Migration from Tauri 1.0

Upgrading from Tauri 1.0 to Tauri 2.0.

## Overview

Tauri 2.0 introduces significant changes including mobile support, a new plugin system, updated APIs, and enhanced security. Use the automated migration tool when possible.

## Automated migration

```bash
cargo tauri migrate
```

This automatically updates most of your project. Review the changes after migration.

## Preparing for mobile

If you plan to support mobile:
1. Install mobile prerequisites (Android SDK, Xcode)
2. Add mobile Rust targets:
   ```bash
   rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
   rustup target add aarch64-apple-ios x86_64-apple-ios aarch64-apple-ios-sim
   ```
3. Initialize mobile projects:
   ```bash
   cargo tauri android init
   cargo tauri ios init
   ```

## Summary of changes

### Tauri configuration

- `tauri.conf.json` structure changed significantly
- `build.distDir` → `build.frontendDist`
- `build.devPath` → `build.devUrl`
- `package.productName` → `productName` (top-level)
- `package.version` → `version` (top-level)
- `tauri.allowlist` → Removed (replaced by capabilities)
- `tauri.windows` → `app.windows`
- `tauri.security` → `app.security`

### New Cargo features

- `tauri` features changed: `window-all`, `dialog-all`, etc. → individual features
- Use `cargo tauri add` to install plugins

### Removed Cargo features

- `tauri = { features = ["api-all"] }` — Removed
- Individual API features replaced by plugins

### Rust crate changes

- `tauri::api` modules moved to plugins
- `tauri::api::file` → `tauri-plugin-fs`
- `tauri::api::dialog` → `tauri-plugin-dialog`
- `tauri::api::shell` → `tauri-plugin-shell`
- `tauri::api::notification` → `tauri-plugin-notification`
- `tauri::api::http` → `tauri-plugin-http`
- `tauri::api::process` → `tauri-plugin-process`
- `tauri::api::clipboard` → `tauri-plugin-clipboard-manager`
- `tauri::api::path` → `tauri::path()` (core)

### JavaScript API changes

- `@tauri-apps/api` reorganized
- `@tauri-apps/api/tauri` → `@tauri-apps/api/core`
- `@tauri-apps/api/window` → `@tauri-apps/api/window` (unchanged)
- `@tauri-apps/api/dialog` → `@tauri-apps/plugin-dialog`
- `@tauri-apps/api/fs` → `@tauri-apps/plugin-fs`
- `@tauri-apps/api/shell` → `@tauri-apps/plugin-shell`
- `@tauri-apps/api/notification` → `@tauri-apps/plugin-notification`
- `@tauri-apps/api/http` → `@tauri-apps/plugin-http`
- `@tauri-apps/api/process` → `@tauri-apps/plugin-process`
- `@tauri-apps/api/clipboard` → `@tauri-apps/plugin-clipboard-manager`

### Environment variable changes

- `TAURI_DIR` → `TAURI_DIR` (unchanged)
- `TAURI_PLATFORM` → `TAURI_PLATFORM` (unchanged)
- `TAURI_FAMILY` → Removed

### Event system

- `app.listen()` → `app.listen()` (unchanged but typed)
- `window.listen()` → `window.listen()` (unchanged)
- Events now support typed payloads

### Multi-webview support

Tauri 2 supports multiple webviews in a single window:

```rust
use tauri::{WebviewBuilder, WebviewUrl};

WebviewBuilder::new("secondary", WebviewUrl::App("secondary.html".into()))
    .build(window)?;
```

### New origin URL on Windows

Windows now uses `http://tauri.localhost` instead of `https://tauri.localhost` by default.

## Detailed migration steps

### Migrate to core module

```javascript
// Before (Tauri 1)
import { invoke } from '@tauri-apps/api/tauri';

// After (Tauri 2)
import { invoke } from '@tauri-apps/api/core';
```

### Migrate to CLI plugin

```bash
# Before
npm install -D @tauri-apps/cli

# After (same, but version 2)
npm install -D @tauri-apps/cli@^2
```

### Migrate to dialog plugin

```bash
cargo tauri add dialog
```

```javascript
// Before
import { open } from '@tauri-apps/api/dialog';

// After
import { open } from '@tauri-apps/plugin-dialog';
```

### Migrate to file system plugin

```bash
cargo tauri add fs
```

```javascript
// Before
import { readTextFile } from '@tauri-apps/api/fs';

// After
import { readTextFile } from '@tauri-apps/plugin-fs';
```

### Migrate to shell plugin

```bash
cargo tauri add shell
```

```javascript
// Before
import { Command } from '@tauri-apps/api/shell';

// After
import { Command } from '@tauri-apps/plugin-shell';
```

### Migrate to notification plugin

```bash
cargo tauri add notification
```

### Migrate to updater plugin

```bash
cargo tauri add updater
```

### Migrate to new window API

```rust
// Before (Tauri 1)
tauri::WindowBuilder::new(app, "main", tauri::WindowUrl::App("index.html".into()))
    .build()?;

// After (Tauri 2)
tauri::WebviewWindowBuilder::new(app, "main", tauri::WebviewUrl::App("index.html".into()))
    .build()?;
```

### Migrate permissions

The `allowlist` system is replaced by **capabilities**:

```json
// Before (tauri.conf.json)
{
  "tauri": {
    "allowlist": {
      "fs": { "all": true },
      "dialog": { "all": true }
    }
  }
}

// After (src-tauri/capabilities/default.json)
{
  "identifier": "default",
  "windows": ["main"],
  "permissions": [
    "fs:default",
    "dialog:default"
  ]
}
```

## Best practices

1. Use `cargo tauri migrate` for automated migration
2. Review all changes after migration
3. Test thoroughly on all platforms
4. Update all imports from `@tauri-apps/api/*` to `@tauri-apps/plugin-*`
5. Convert allowlist to capabilities
6. Update `tauri.conf.json` structure
7. Install plugins with `cargo tauri add`
