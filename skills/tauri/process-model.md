# Process Model

Understanding Tauri's multi-process architecture.

## Why multiple processes?

Tauri uses a multi-process model similar to modern browsers. This separation provides:
- **Security** — The webview process is sandboxed
- **Stability** — A webview crash doesn't kill the core process
- **Performance** — The core process can handle system operations without blocking the UI

## The Core Process

The core process is the main Rust process that runs your application logic:
- Manages windows and webviews
- Handles IPC (commands and events)
- Manages application state
- Runs plugins and sidecars
- Handles system integration (tray, notifications, etc.)

The core process is compiled as a native binary and has full access to the system.

## The WebView Process

The webview process runs the platform's native webview engine:
- Renders the frontend (HTML/CSS/JS)
- Executes JavaScript
- Handles user input
- Communicates with the core process via IPC

The webview process has limited system access, controlled by Tauri's permission system (capabilities and scopes).

### Platform webviews

| Platform | WebView Engine |
|----------|---------------|
| Linux | WebKitGTK |
| macOS | WKWebView (WebKit) |
| Windows | WebView2 (Chromium) |
| Android | Android WebView |
| iOS | WKWebView (WebKit) |

## Process communication

```
┌──────────────┐     IPC (Commands/Events)     ┌──────────────┐
│  Core Process │◄───────────────────────────►│  WebView     │
│  (Rust)       │                              │  (JS/HTML)   │
└──────────────┘                              └──────────────┘
       │
       │ Sidecar / Shell
       ▼
┌──────────────┐
│  External     │
│  Binaries     │
└──────────────┘
```

## Mobile process model

On mobile platforms, the process model is slightly different:
- **Android** — The core process runs as a native library within the app process
- **iOS** — The core process runs as a native framework within the app process

The webview is embedded within the app's main activity/ViewController.

## Multiple windows

Each window in Tauri gets its own webview. All webviews share the same core process:

```rust
use tauri::{WebviewWindowBuilder, Manager};

// Create a new window
WebviewWindowBuilder::new(
    &app,
    "secondary",
    tauri::WebviewUrl::App("index.html".into()),
)
.title("Secondary Window")
.build()?;
```

All windows share the same IPC handler and state, enabling communication between windows via events.
