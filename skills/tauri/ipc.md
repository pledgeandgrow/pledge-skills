# Inter-Process Communication (IPC)

How Tauri facilitates communication between the frontend and backend.

## Overview

Tauri uses Inter-Process Communication (IPC) to bridge the frontend (JavaScript) and backend (Rust). The IPC system is built on two main mechanisms:

1. **Commands** — Call Rust functions from JavaScript
2. **Events** — Send messages between frontend and backend asynchronously

## Commands

Commands are the primary way to call Rust code from the frontend. Define a Rust function, register it as a command, and invoke it from JavaScript.

### Define a command (Rust)

```rust
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### Invoke from JavaScript

```javascript
import { invoke } from '@tauri-apps/api/core';

const greeting = await invoke('greet', { name: 'World' });
console.log(greeting); // "Hello, World!"
```

### Passing arguments

Arguments are passed as a JSON object. Keys must match the Rust function parameter names (in camelCase by default):

```rust
#[tauri::command]
fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

```javascript
const result = await invoke('add', { a: 1, b: 2 });
```

### Returning data

Return types must implement `serde::Serialize`. Common types work out of the box:

```rust
use serde::Serialize;

#[derive(Serialize)]
struct User {
    name: String,
    age: u32,
}

#[tauri::command]
fn get_user() -> User {
    User { name: "Alice".into(), age: 30 }
}
```

### Error handling

Use `Result` to return errors. The error type must implement `serde::Serialize`:

```rust
use serde::Serialize;

#[derive(Debug, Serialize)]
enum Error {
    NotFound,
    Unauthorized,
}

#[tauri::command]
fn get_data(id: String) -> Result<String, Error> {
    if id.is_empty() {
        Err(Error::NotFound)
    } else {
        Ok(format!("Data for {}", id))
    }
}
```

```javascript
try {
  const data = await invoke('get_data', { id: '123' });
} catch (error) {
  console.error(error); // Error::NotFound
}
```

### Async commands

Async commands run on a separate thread, preventing UI blocking:

```rust
#[tauri::command]
async fn fetch_data(url: String) -> Result<String, String> {
    // Long-running operation
    tokio::time::sleep(std::time::Duration::from_secs(1)).await;
    Ok(format!("Fetched from {}", url))
}
```

### Channels

For streaming data from Rust to the frontend, use channels:

```rust
use tauri::ipc::Channel;

#[tauri::command]
async fn download(url: String, on_progress: Channel<DownloadProgress>) -> Result<(), String> {
    for i in 0..100 {
        on_progress.send(DownloadProgress { percent: i }).unwrap();
        tokio::time::sleep(std::time::Duration::from_millis(50)).await;
    }
    Ok(())
}
```

```javascript
import { invoke, Channel } from '@tauri-apps/api/core';

const onProgress = new Channel();
onProgress.onmessage = (message) => {
  console.log(`Progress: ${message.percent}%`);
};

await invoke('download', { url: 'https://example.com', onProgress });
```

### Accessing managed state

```rust
use std::sync::Mutex;
use tauri::State;

struct AppState {
    counter: Mutex<i32>,
}

#[tauri::command]
fn increment(state: State<'_, AppState>) -> i32 {
    let mut counter = state.counter.lock().unwrap();
    *counter += 1;
    *counter
}

pub fn run() {
    tauri::Builder::default()
        .manage(AppState { counter: Mutex::new(0) })
        .invoke_handler(tauri::generate_handler![increment])
        .run(tauri::generate_context!())
        .expect("error");
}
```

### Accessing WebviewWindow in commands

```rust
use tauri::{WebviewWindow, Manager};

#[tauri::command]
fn set_title(window: WebviewWindow, title: String) {
    window.set_title(&title).unwrap();
}
```

### Accessing AppHandle in commands

```rust
use tauri::{AppHandle, Manager};

#[tauri::command]
fn get_app_dir(app: AppHandle) -> String {
    app.path().app_dir().unwrap().to_string_lossy().to_string()
}
```

## Events

Events provide asynchronous communication between the frontend and backend.

### Emit from Rust, listen in JavaScript

```rust
use tauri::{Emitter, Manager};

#[tauri::command]
fn start_processing(app: AppHandle) {
    app.emit("processing-started", ()).unwrap();
}
```

```javascript
import { listen } from '@tauri-apps/api/event';

const unlisten = await listen('processing-started', (event) => {
  console.log('Processing started!');
});

// Stop listening when done
unlisten();
```

### Emit from JavaScript, listen in Rust

```javascript
import { emit } from '@tauri-apps/api/event';

await emit('user-logged-in', { userId: 123, token: 'abc' });
```

```rust
use tauri::Listener;

pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            app.listen("user-logged-in", |event| {
                println!("User logged in: {}", event.payload());
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error");
}
```

### Webview-specific events

Emit to a specific webview window:

```rust
use tauri::{Emitter, Manager};

app.get_webview_window("main")
    .unwrap()
    .emit("download-complete", { url: "https://example.com" })
    .unwrap();
```

### Typed events with serde

```rust
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Clone)]
struct DownloadStarted {
    url: String,
    size: u64,
}

app.emit("download-started", DownloadStarted {
    url: "https://example.com".into(),
    size: 1024,
}).unwrap();
```

## Best practices

1. Use commands for request-response patterns
2. Use events for one-way notifications and streaming
3. Use channels for progressive/streaming data from commands
4. Use async commands for long-running operations
5. Always handle errors properly with `Result` types
6. Use `State` for shared application state
7. Clean up event listeners with `unlisten()` to prevent memory leaks
8. Keep command arguments simple (serializable types)
