# Embedding External Binaries (Sidecars)

How to bundle and run external binaries with your Tauri app.

## Overview

You may need to embed external binaries to add functionality or prevent users from installing additional dependencies (e.g., Node.js or Python). Tauri calls these **sidecars**.

## Configuration

Add the `externalBin` property to the `bundle` object in `tauri.conf.json`:

```json
{
  "bundle": {
    "externalBin": [
      "/absolute/path/to/sidecar",
      "../relative/path/to/binary",
      "binaries/my-sidecar"
    ]
  }
}
```

Relative paths are relative to `tauri.conf.json` in the `src-tauri` directory. So `binaries/my-sidecar` resolves to `<PROJECT ROOT>/src-tauri/binaries/my-sidecar`.

## Target triple suffix

Binaries must include a target triple suffix for each supported architecture:

```
src-tauri/binaries/my-sidecar-x86_64-unknown-linux-gnu
src-tauri/binaries/my-sidecar-aarch64-apple-darwin
src-tauri/binaries/my-sidecar-x86_64-pc-windows-msvc.exe
```

Find your current target triple:

```bash
rustc --print host-tuple
# e.g., x86_64-unknown-linux-gnu
```

### Script to append target triple

```javascript
import { execSync } from 'child_process';
import fs from 'fs';

const extension = process.platform === 'win32' ? '.exe' : '';
const targetTriple = execSync('rustc --print host-tuple').toString().trim();

fs.renameSync(
  `src-tauri/binaries/sidecar${extension}`,
  `src-tauri/binaries/sidecar-${targetTriple}${extension}`
);
```

## Running from Rust

```rust
use tauri::Manager;

#[tauri::command]
async fn run_sidecar(app: tauri::AppHandle) -> Result<(), String> {
    let sidecar = app.shell()
        .sidecar("my-sidecar")
        .map_err(|e| e.to_string())?;

    let (mut rx, mut child) = sidecar
        .args(["--flag", "value"])
        .spawn()
        .map_err(|e| e.to_string())?;

    // Read output
    tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
            match event {
                tauri_plugin_shell::process::CommandEvent::Stdout(line) => {
                    println!("Sidecar stdout: {}", String::from_utf8_lossy(&line));
                }
                tauri_plugin_shell::process::CommandEvent::Stderr(line) => {
                    eprintln!("Sidecar stderr: {}", String::from_utf8_lossy(&line));
                }
                _ => {}
            }
        }
    });

    Ok(())
}
```

## Running from JavaScript

```javascript
import { Command } from '@tauri-apps/plugin-shell';

const command = Command.sidecar('binaries/my-sidecar', ['--flag', 'value']);

command.on('close', (data) => {
  console.log(`Sidecar exited with code ${data.code}`);
});

command.on('error', (error) => {
  console.error(`Sidecar error: ${error}`);
});

const child = await command.spawn();
```

## Passing arguments

Pass arguments as an array:

```rust
let (rx, child) = sidecar
    .args(["--port", "8080", "--verbose"])
    .spawn()?;
```

```javascript
const command = Command.sidecar('binaries/my-sidecar', [
  '--port', '8080', '--verbose'
]);
```

## Common use cases

- **Python CLI tools** — Bundle with PyInstaller
- **Node.js scripts** — Bundle with `pkg` or `nexe`
- **Database engines** — Bundle SQLite or PostgreSQL
- **FFmpeg** — Bundle for media processing
- **Custom executables** — Any compiled binary

## Best practices

1. Provide binaries for all target architectures
2. Use build scripts to manage binary naming
3. Handle sidecar crashes gracefully
4. Clean up sidecar processes on app exit
5. Use the shell plugin for sidecar management
