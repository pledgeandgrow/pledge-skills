# Axum — Getting Started

## Philosophy

Axum is designed to be ergonomic, modular, and type-safe. It builds on top of Tokio (async runtime), Hyper (HTTP), and Tower (service/middleware abstraction). Unlike other frameworks, axum does not have its own middleware system — it uses `tower::Service` directly, which means the entire Tower ecosystem works out of the box.

### High-Level Features

- Route requests to handlers with a macro-free API
- Declaratively parse requests using extractors
- Simple and predictable error handling model
- Generate responses with minimal boilerplate
- Full advantage of the `tower` and `tower-http` ecosystem

### Compatibility

Axum is designed to work with Tokio and Hyper. Runtime and transport layer independence is not a goal.

## Installation

### Cargo Dependencies

```toml
[dependencies]
axum = "<latest>"
tokio = { version = "<latest>", features = ["full"] }
tower = "<latest>"
```

The `full` feature for tokio isn't necessary but it's the easiest way to get started. Tower isn't strictly required either but is helpful for testing and middleware.

### Quick Install

```sh
cargo add axum
cargo add tokio --features macros,rt-multi-thread
cargo add tower
```

## Hello World

```rust
use axum::{routing::get, Router};

#[tokio::main]
async fn main() {
    let app = Router::new().route("/", get(|| async { "Hello, World!" }));
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

> Using `#[tokio::main]` requires tokio's `macros` and `rt-multi-thread` features.

## Project Structure

A typical axum project looks like:

```
my-app/
├── Cargo.toml
├── src/
│   ├── main.rs          # Entry point, server setup
│   ├── routes/
│   │   ├── mod.rs
│   │   ├── users.rs     # User-related handlers
│   │   └── health.rs    # Health check handler
│   ├── state.rs         # AppState definition
│   ├── error.rs         # Custom error types
│   └── models.rs        # Domain types
```

### Example: Multi-Route App

```rust
use axum::{Router, routing::{get, post}, extract::State};

#[derive(Clone)]
struct AppState {
    db: String, // Replace with real DB pool
}

#[tokio::main]
async fn main() {
    let state = AppState { db: "pool".to_string() };

    let app = Router::new()
        .route("/", get(root))
        .route("/users", post(create_user))
        .route("/health", get(health))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> &'static str { "Welcome!" }

async fn health() -> &'static str { "OK" }

async fn create_user(State(state): State<AppState>) -> &'static str {
    // Use state.db to create user
    "User created"
}
```

## Basic CRUD Example

```rust
use axum::{
    Router, routing::{get, post, delete},
    extract::{Path, State, Json},
    response::IntoResponse,
    http::StatusCode,
};
use std::sync::Arc;
use std::collections::HashMap;
use std::sync::Mutex;
use serde::{Serialize, Deserialize};

#[derive(Clone)]
struct AppState {
    users: Arc<Mutex<HashMap<u64, User>>>,
}

#[derive(Serialize, Deserialize, Clone)]
struct User {
    id: u64,
    name: String,
    email: String,
}

#[derive(Deserialize)]
struct CreateUserRequest {
    name: String,
    email: String,
}

#[tokio::main]
async fn main() {
    let state = AppState {
        users: Arc::new(Mutex::new(HashMap::new())),
    };

    let app = Router::new()
        .route("/users", post(create_user))
        .route("/users/{id}", get(get_user).delete(delete_user))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn create_user(
    State(state): State<AppState>,
    Json(req): Json<CreateUserRequest>,
) -> (StatusCode, Json<User>) {
    let mut users = state.users.lock().unwrap();
    let id = (users.len() as u64) + 1;
    let user = User { id, name: req.name, email: req.email };
    users.insert(id, user.clone());
    (StatusCode::CREATED, Json(user))
}

async fn get_user(
    State(state): State<AppState>,
    Path(id): Path<u64>,
) -> Result<Json<User>, StatusCode> {
    let users = state.users.lock().unwrap();
    users.get(&id)
        .cloned()
        .map(Json)
        .ok_or(StatusCode::NOT_FOUND)
}

async fn delete_user(
    State(state): State<AppState>,
    Path(id): Path<u64>,
) -> StatusCode {
    let mut users = state.users.lock().unwrap();
    if users.remove(&id).is_some() {
        StatusCode::NO_CONTENT
    } else {
        StatusCode::NOT_FOUND
    }
}
```

## Adding Middleware

```rust
use axum::Router;
use tower::ServiceBuilder;
use tower_http::trace::TraceLayer;
use std::time::Duration;
use tower::timeout::TimeoutLayer;

let app = Router::new()
    .route("/", get(|| async { "Hello!" }))
    .layer(
        ServiceBuilder::new()
            .layer(TraceLayer::new_for_http())
            .layer(TimeoutLayer::new(Duration::from_secs(30)))
    );
```

## Serving the Application

### Basic Serving

```rust
let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
axum::serve(listener, app).await.unwrap();
```

### With Graceful Shutdown

```rust
async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c().await.expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }
}

let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
axum::serve(listener, app)
    .with_graceful_shutdown(shutdown_signal())
    .await
    .unwrap();
```

## Feature Flags

Axum uses feature flags to reduce compilation time and optional dependencies:

| Feature | Enables |
|---------|---------|
| `http1` | HTTP/1.1 support in `axum::serve` |
| `http2` | HTTP/2 support in `axum::serve` |
| `json` | `Json` extractor and response |
| `macros` | `#[debug_handler]`, `#[derive(FromRef)]` |
| `matched-path` | `MatchedPath` extractor |
| `multipart` | `Multipart` extractor for file uploads |
| `original-uri` | `OriginalUri` extractor |
| `tokio` | `axum::serve`, SSE, `connect_info` |
| `tracing` | Tracing support (default) |
| `ws` | WebSocket support via `extract::ws` |
| `form` | `Form` extractor |
| `query` | `Query` extractor |

## Building Integrations

Library authors that want to provide `FromRequest`, `FromRequestParts`, or `IntoResponse` implementations should depend on `axum-core` instead of axum. `axum-core` contains core types and traits and is less likely to receive breaking changes.

## Sources

- https://docs.rs/axum/latest/axum/
- https://docs.rs/axum/latest/axum/struct.Router.html
- https://docs.rs/axum/latest/axum/serve/index.html
- https://github.com/tokio-rs/axum/tree/main/examples
