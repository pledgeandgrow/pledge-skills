# Debugging Tauri Apps

Tools and techniques for debugging Tauri applications.

## Development-only code

### In Rust

Use `cfg!(debug_assertions)` or the `debug` feature:

```rust
fn log_debug(msg: &str) {
    #[cfg(debug_assertions)]
    {
        println!("[DEBUG] {}", msg);
    }
}
```

### In JavaScript

```javascript
if (import.meta.env.DEV) {
  console.log('Debug mode');
}
```

## Rust console

Rust output (println!, eprintln!, log) appears in the terminal where you ran `cargo tauri dev`:

```bash
cargo tauri dev
# Rust println! output appears here
```

### Using the log plugin

```rust
use tauri_plugin_log::{Target, TargetKind, LevelFilter};

pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                .targets([
                    Target::new(TargetKind::Stdout),
                    Target::new(TargetKind::LogDir { file_name: None }),
                    Target::new(TargetKind::Webview),
                ])
                .level(LevelFilter::Info)
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error");
}
```

```rust
use log::info;

#[tauri::command]
fn my_command() {
    info!("This logs to stdout, log dir, and webview console");
}
```

## WebView console

JavaScript console output appears in the WebView's DevTools.

### Opening DevTools

- **Development** — DevTools open automatically (or right-click → Inspect)
- **Production** — Disabled by default

### Opening DevTools programmatically

```rust
use tauri::Manager;

#[tauri::command]
fn open_devtools(window: tauri::WebviewWindow) {
    #[cfg(debug_assertions)]
    {
        window.open_devtools();
    }
}
```

### Using the Inspector in production

Enable the inspector in production via config:

```json
{
  "app": {
    "windows": [
      {
        "title": "My App",
        "devtools": true
      }
    ]
  }
}
```

Or at runtime:

```rust
window.open_devtools();
```

## Debugging the core process

### Using a debugger

Attach a debugger (GDB, LLDB, or your IDE's debugger) to the Tauri core process:

```bash
# Run with LLDB (macOS/Linux)
lldb -- ./src-tauri/target/debug/my-app

# Run with GDB (Linux)
gdb -- ./src-tauri/target/debug/my-app
```

### VS Code launch configuration

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "lldb",
      "request": "launch",
      "name": "Debug Tauri Core",
      "program": "${workspaceFolder}/src-tauri/target/debug/my-app",
      "args": [],
      "cwd": "${workspaceFolder}/src-tauri"
    }
  ]
}
```

### Rust Analyzer

Use rust-analyzer in VS Code for inline type checking, error display, and code navigation.

## Mobile debugging

### Android

```bash
# View logs
adb logcat | grep -i tauri

# Use Chrome DevTools for WebView
chrome://inspect/#devices
```

### iOS

- Use Xcode's debugger for the core process
- Use Safari Web Inspector for the WebView:
  - Safari → Develop → [Device Name] → [WebView]

## Common issues

1. **White screen** — Check WebView console for JavaScript errors
2. **Command not found** — Ensure command is registered in `generate_handler!`
3. **Permission denied** — Check capabilities/permissions configuration
4. **Build errors** — Check Rust compiler output in terminal
5. **Plugin not working** — Ensure plugin is added to both Cargo.toml and JS dependencies

## Best practices

1. Use the log plugin for structured logging
2. Keep DevTools enabled during development
3. Use `#[cfg(debug_assertions)]` for dev-only code
4. Set up VS Code/IntelliJ debugging for the core process
5. Test on all target platforms during development
