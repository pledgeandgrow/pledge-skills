# Plugins

Official and community plugins for extending Tauri applications.

## Overview

Tauri plugins provide additional functionality like file system access, dialogs, notifications, and more. Each plugin has a Rust crate and a JavaScript package.

## Installing plugins

```bash
# Using the Tauri CLI (recommended)
cargo tauri add fs
cargo tauri add dialog
cargo tauri add shell

# This automatically:
# 1. Adds the Rust crate to Cargo.toml
# 2. Adds the JS package to package.json
# 3. Registers the plugin in your code
```

### Manual installation

```bash
# Rust
cargo add tauri-plugin-fs

# JavaScript
npm install @tauri-apps/plugin-fs
```

Register in Rust:

```rust
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .run(tauri::generate_context!())
        .expect("error");
}
```

## Official plugins

### File System

Access the file system with scope-based permissions.

**Supported platforms:** Windows, macOS, Linux, Android, iOS

```bash
cargo tauri add fs
```

```javascript
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';

// Read
const content = await readTextFile('config.json');

// Write
await writeTextFile('output.txt', 'Hello, World!');
```

**Key APIs:** `readTextFile`, `writeTextFile`, `readDir`, `remove`, `copy`, `rename`, `exists`, `mkdir`, `readFile`, `writeFile`

### Dialog

Native system dialogs for file opening, saving, and messages.

**Supported platforms:** Windows, macOS, Linux, Android, iOS

```bash
cargo tauri add dialog
```

```javascript
import { open, save, message, ask, confirm } from '@tauri-apps/plugin-dialog';

// File open dialog
const filePath = await open({
  filters: [{ name: 'Images', extensions: ['png', 'jpg'] }],
});

// Save dialog
const savePath = await save({ defaultPath: 'untitled.txt' });

// Message dialog
await message('Operation complete', { title: 'Success', type: 'info' });

// Yes/No dialog
const confirmed = await ask('Are you sure?', { type: 'warning' });
```

### Notifications

Send native system notifications.

**Supported platforms:** Windows, macOS, Linux, Android, iOS

```bash
cargo tauri add notification
```

```javascript
import { sendNotification } from '@tauri-apps/plugin-notification';

await sendNotification({
  title: 'Download Complete',
  body: 'Your file has been downloaded successfully.',
});
```

### Shell

Access the system shell, spawn child processes, and open URLs/files.

**Supported platforms:** Windows, macOS, Linux, Android (partial), iOS (partial)

```bash
cargo tauri add shell
```

```javascript
import { Command, open } from '@tauri-apps/plugin-shell';

// Open URL in default browser
await open('https://example.com');

// Run a command
const command = Command.create('echo', ['hello']);
const output = await command.execute();
console.log(output.stdout);
```

### Updater

In-app automatic updates with signature verification.

**Supported platforms:** Windows, macOS, Linux

```bash
cargo tauri add updater
```

```javascript
import { check } from '@tauri-apps/plugin-updater';

const update = await check();
if (update) {
  console.log(`Update available: ${update.version}`);
  await update.downloadAndInstall();
  await relaunch();
}
```

### Clipboard

Read and write to the system clipboard.

**Supported platforms:** Windows, macOS, Linux, Android, iOS

```bash
cargo tauri add clipboard-manager
```

```javascript
import { writeText, readText } from '@tauri-apps/plugin-clipboard-manager';

await writeText('Hello from Tauri!');
const text = await readText();
```

### Global Shortcut

Register global keyboard shortcuts.

**Supported platforms:** Windows, macOS, Linux

```bash
cargo tauri add global-shortcut
```

```javascript
import { register } from '@tauri-apps/plugin-global-shortcut';

await register('CommandOrControl+Shift+D', () => {
  console.log('Shortcut triggered!');
});
```

### Process

Access and control the current process.

**Supported platforms:** Windows, macOS, Linux, Android, iOS

```bash
cargo tauri add process
```

```javascript
import { exit, relaunch } from '@tauri-apps/plugin-process';

// Exit the app
await exit(0);

// Relaunch the app
await relaunch();
```

### Store

Persistent key-value storage.

**Supported platforms:** Windows, macOS, Linux, Android, iOS

```bash
cargo tauri add store
```

```javascript
import { LazyStore } from '@tauri-apps/plugin-store';

const store = new LazyStore('settings.json');

await store.set('theme', 'dark');
await store.save();

const theme = await store.get('theme');
```

### WebSocket

WebSocket connections via Rust client.

**Supported platforms:** Windows, macOS, Linux, Android, iOS

```bash
cargo tauri add websocket
```

```javascript
import { WebSocket } from '@tauri-apps/plugin-websocket';

const ws = await WebSocket.connect('wss://example.com/ws');

ws.addListener((msg) => {
  console.log('Received:', msg);
});

await ws.send('Hello');
```

### HTTP

Make HTTP requests from the Rust backend.

**Supported platforms:** Windows, macOS, Linux, Android, iOS

```bash
cargo tauri add http
```

```javascript
import { fetch } from '@tauri-apps/plugin-http';

const response = await fetch('https://api.example.com/data');
const data = await response.json();
```

### Log

Structured logging to stdout, log files, and WebView console.

**Supported platforms:** Windows, macOS, Linux, Android, iOS

```bash
cargo tauri add log
```

```rust
use log::info;

info!("Application started");
```

```javascript
import { info, error } from '@tauri-apps/plugin-log';

info('Hello from JS');
error('Something went wrong');
```

### SQL

Interface with SQL databases (SQLite, MySQL, PostgreSQL) via sqlx.

**Supported platforms:** Windows, macOS, Linux, Android, iOS

```bash
cargo tauri add sql
```

```javascript
import Database from '@tauri-apps/plugin-sql';

// Load existing database or create new one
const db = await Database.load('sqlite:database.db');

// Execute queries
await db.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)');
await db.execute('INSERT INTO users (name) VALUES ($1)', ['Alice']);
const result = await db.select('SELECT * FROM users');
```

**Key APIs:** `Database.load`, `db.execute`, `db.select`, migrations support

### Upload

File uploads through HTTP with progress tracking.

**Supported platforms:** Windows, macOS, Linux, Android, iOS

```bash
cargo tauri add upload
```

```javascript
import { upload } from '@tauri-apps/plugin-upload';

await upload(
  'https://example.com/upload',
  'path/to/file.txt',
  (progress, total) => {
    console.log(`Uploaded ${progress} of ${total} bytes`);
  }
);
```

### Localhost

Use a localhost server in production apps (instead of static frontend).

**Supported platforms:** Windows, macOS, Linux

```bash
cargo tauri add localhost
```

```rust
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_localhost::Builder::new()
            .port(3000)
            .build())
        .run(tauri::generate_context!())
        .expect("error");
}
```

### Single Instance

Ensure only one instance of your app is running.

**Supported platforms:** Windows, macOS, Linux

```bash
cargo tauri add single-instance
```

```rust
pub fn run() {
    let mut builder = tauri::Builder::default();
    
    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            // Called when a second instance tries to launch
            app.get_webview_window("main")
                .unwrap()
                .set_focus()
                .unwrap();
        }));
    }
    
    builder
        .run(tauri::generate_context!())
        .expect("error");
}
```

### Positioner

Move windows to common screen positions (tray center, top-left, etc.).

**Supported platforms:** Windows, macOS, Linux

```bash
cargo tauri add positioner
```

```javascript
import { Position, moveWindow } from '@tauri-apps/plugin-positioner';

await moveWindow(Position.TrayCenter);
await moveWindow(Position.TopRight);
```

### Autostart

Automatically launch your app at system startup.

**Supported platforms:** Windows, macOS, Linux

```bash
cargo tauri add autostart
```

```javascript
import { enable, disable, isEnabled } from '@tauri-apps/plugin-autostart';

await enable();
const enabled = await isEnabled();
await disable();
```

### Window State

Persist and restore window sizes and positions across sessions.

**Supported platforms:** Windows, macOS, Linux

```bash
cargo tauri add window-state
```

```rust
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error");
}
```

### Barcode Scanner

Scan QR codes and barcodes using the device camera (mobile only).

**Supported platforms:** Android, iOS

```bash
cargo tauri add barcode-scanner
```

```javascript
import { scan, startScan, stopScan, closeScanner } from '@tauri-apps/plugin-barcode-scanner';

// One-shot scan
const result = await scan({ formats: ['QR_CODE'] });
console.log(result.content);

// Continuous scanning
await startScan({ formats: ['QR_CODE'], windowed: true });
```

### Biometric

Prompt the user for biometric authentication (fingerprint, Face ID) on mobile.

**Supported platforms:** Android, iOS

```bash
cargo tauri add biometric
```

```javascript
import { getStatus, authenticate } from '@tauri-apps/plugin-biometric';

const status = await getStatus();
if (status.available) {
  await authenticate('Please authenticate to continue');
}
```

### NFC

Read and write NFC tags on mobile devices.

**Supported platforms:** Android, iOS

```bash
cargo tauri add nfc
```

```javascript
import { scan, write } from '@tauri-apps/plugin-nfc';

// Scan NFC tag
const tag = await scan();

// Write to NFC tag
await write({ kind: 'text', data: 'Hello NFC' });
```

### Haptics

Haptic feedback and vibrations on mobile devices.

**Supported platforms:** Android, iOS

```bash
cargo tauri add haptics
```

```javascript
import { vibrate, impact, notification, selectionChanged } from '@tauri-apps/plugin-haptics';

await impact('medium');
await notification('success');
await selectionChanged();
```

### HTTP Client

Access the HTTP client written in Rust from JavaScript.

**Supported platforms:** Windows, macOS, Linux, Android, iOS

```bash
cargo tauri add http
```

```javascript
import { fetch } from '@tauri-apps/plugin-http';

const response = await fetch('https://api.example.com/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'value' }),
});
const data = await response.json();
```

### Deep Link

Handle custom URL schemes and universal links.

**Supported platforms:** Windows, macOS, Linux, Android, iOS

```bash
cargo tauri add deep-link
```

```javascript
import { getCurrent, onOpenUrl, register } from '@tauri-apps/plugin-deep-link';

// Get the URL that opened the app
const url = await getCurrent();

// Listen for future deep links
await onOpenUrl((urls) => {
  console.log('Received deep link:', urls);
});

// Register a custom scheme (desktop)
await register('myapp');
```

## Community plugins

Notable community plugins:
- `tauri-plugin-blec` — Bluetooth Low Energy
- `tauri-plugin-clipboard` — Advanced clipboard support
- `tauri-plugin-context-menu` — Native context menus
- `tauri-plugin-device-info` — Device information
- `tauri-plugin-mqtt` — MQTT client
- `tauri-plugin-serialport` — Serial port communication
- `tauri-plugin-system-info` — System information
- `tauri-plugin-tcp` / `tauri-plugin-udp` — TCP/UDP networking
- `tauri-plugin-theme` — Theme management
- `tauri-specta` — Type-safe IPC with Specta
- `taurpc` — tRPC-like IPC for Tauri

## Creating custom plugins

```bash
cargo tauri plugin init my-plugin
```

This creates a plugin project with:
- Rust crate structure
- JavaScript package
- Permission definitions
- Example usage

## Best practices

1. Use `cargo tauri add` for installing plugins
2. Configure permissions in capabilities files
3. Use scopes to restrict file/URL access
4. Keep plugins updated
5. Check platform support before using a plugin
6. Consider creating a custom plugin for app-specific functionality
