# Calling Rust from the Frontend

Tauri's command system for calling Rust functions from JavaScript.

## Commands

Tauri provides a command system for calling Rust functions from your web app. Commands can accept arguments, return values, return errors, and be async.

### Basic example

**Rust:**
```rust
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

**JavaScript:**
```javascript
import { invoke } from '@tauri-apps/api/core';

const greeting = await invoke('greet', { name: 'World' });
```

### Passing arguments

Arguments are serialized as JSON. Use camelCase in JavaScript, snake_case in Rust (Tauri converts automatically):

```rust
#[tauri::command]
fn process_data(user_id: i32, file_name: String) -> bool {
    // user_id comes from userId in JS
    // file_name comes from fileName in JS
    true
}
```

```javascript
await invoke('process_data', { userId: 42, fileName: 'test.txt' });
```

### Returning data

Return types must implement `serde::Serialize`:

```rust
use serde::Serialize;

#[derive(Serialize)]
struct Person {
    name: String,
    age: u32,
    emails: Vec<String>,
}

#[tauri::command]
fn get_person() -> Person {
    Person {
        name: "Alice".into(),
        age: 30,
        emails: vec!["alice@example.com".into()],
    }
}
```

### Error handling

```rust
use serde::Serialize;

#[derive(Debug, Serialize)]
struct CustomError {
    message: String,
    code: i32,
}

#[tauri::command]
fn risky_operation() -> Result<String, CustomError> {
    Err(CustomError {
        message: "Something went wrong".into(),
        code: 500,
    })
}
```

```javascript
try {
  const result = await invoke('risky_operation');
} catch (error) {
  console.error(`${error.message} (code: ${error.code})`);
}
```

### Async commands

```rust
#[tauri::command]
async fn long_task() -> Result<String, String> {
    tokio::time::sleep(std::time::Duration::from_secs(2)).await;
    Ok("Done!".into())
}
```

### Channels

Stream data progressively from Rust to JS:

```rust
use tauri::ipc::Channel;
use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Progress {
    percent: u32,
    message: String,
}

#[tauri::command]
async fn process_large_file(
    path: String,
    on_progress: Channel<Progress>,
) -> Result<(), String> {
    for i in 0..=100 {
        on_progress.send(Progress {
            percent: i,
            message: format!("Processing... {}%", i),
        }).map_err(|e| e.to_string())?;
        tokio::time::sleep(std::time::Duration::from_millis(50)).await;
    }
    Ok(())
}
```

```javascript
import { invoke, Channel } from '@tauri-apps/api/core';

const onProgress = new Channel();
onProgress.onmessage = (msg) => {
  console.log(`${msg.percent}% - ${msg.message}`);
};

await invoke('process_large_file', {
  path: '/data/large.bin',
  onProgress,
});
```

### Accessing the WebviewWindow in commands

```rust
use tauri::WebviewWindow;

#[tauri::command]
fn close_window(window: WebviewWindow) {
    window.close().unwrap();
}
```

### Accessing an AppHandle in commands

```rust
use tauri::AppHandle;

#[tauri::command]
fn get_version(app: AppHandle) -> String {
    app.package_info().version.to_string()
}
```

### Accessing managed state

```rust
use std::sync::Mutex;
use tauri::State;

struct DbConnection {
    connected: Mutex<bool>,
}

#[tauri::command]
fn is_connected(state: State<'_, DbConnection>) -> bool {
    *state.connected.lock().unwrap()
}

pub fn run() {
    tauri::Builder::default()
        .manage(DbConnection { connected: Mutex::new(true) })
        .invoke_handler(tauri::generate_handler![is_connected])
        .run(tauri::generate_context!())
        .expect("error");
}
```

### Accessing raw request

```rust
use tauri::ipc::{Request, Response};

#[tauri::command]
async fn raw_handler(request: Request<'_>) -> Result<Response, String> {
    let body = request.body();
    // Process raw request body
    Ok(Response::new("OK".into()))
}
```

### Creating multiple commands

```rust
tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
        greet,
        add,
        get_user,
        delete_user,
        process_file,
    ])
    .run(tauri::generate_context!())
    .expect("error");
```

## Event system

### Global events

**Emit from Rust:**
```rust
use tauri::Emitter;

app.emit("backend-event", { message: "Hello from Rust" })?;
```

**Listen in JavaScript:**
```javascript
import { listen } from '@tauri-apps/api/event';

const unlisten = await listen('backend-event', (event) => {
  console.log(event.payload.message);
});
```

### Webview events

**Emit to specific webview:**
```rust
use tauri::{Emitter, Manager};

app.get_webview_window("main")
    .unwrap()
    .emit("window-event", { data: 42 })?;
```

### Listening to events in Rust

```rust
use tauri::Listener;

pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            app.listen("frontend-event", |event| {
                println!("Received: {}", event.payload());
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error");
}
```

## Complete example

```rust
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::State;

#[derive(Serialize, Deserialize)]
struct Todo {
    id: u32,
    text: String,
    done: bool,
}

struct TodoState {
    todos: Mutex<Vec<Todo>>,
    next_id: Mutex<u32>,
}

#[tauri::command]
fn get_todos(state: State<'_, TodoState>) -> Vec<Todo> {
    state.todos.lock().unwrap().clone()
}

#[tauri::command]
fn add_todo(text: String, state: State<'_, TodoState>) -> Result<Todo, String> {
    let mut id_lock = state.next_id.lock().unwrap();
    let todo = Todo { id: *id_lock, text, done: false };
    *id_lock += 1;
    state.todos.lock().unwrap().push(todo.clone());
    Ok(todo)
}

#[tauri::command]
fn toggle_todo(id: u32, state: State<'_, TodoState>) -> Result<(), String> {
    let mut todos = state.todos.lock().unwrap();
    let todo = todos.iter_mut().find(|t| t.id == id)
        .ok_or("Todo not found")?;
    todo.done = !todo.done;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(TodoState {
            todos: Mutex::new(vec![]),
            next_id: Mutex::new(1),
        })
        .invoke_handler(tauri::generate_handler![get_todos, add_todo, toggle_todo])
        .run(tauri::generate_context!())
        .expect("error");
}
```
