# Axum 0.8.x — Rust Web Framework

## Overview

Axum is a ergonomic and modular web framework built with Tokio, Hyper, and Tower. It provides a macro-free API for routing, declarative request parsing via extractors, predictable error handling, and seamless integration with the Tower ecosystem of middleware and services.

## Key Principles

- **Macro-free routing**: Routes are defined via `Router::new().route(path, method_router)`.
- **Extractors**: Request parsing is done via types implementing `FromRequest` / `FromRequestParts`.
- **IntoResponse**: Anything implementing `IntoResponse` can be returned from handlers.
- **Tower integration**: No bespoke middleware system — uses `tower::Service` and `tower::Layer` directly.
- **Type-safe state**: State is threaded through the type system via `Router<S>` and `with_state()`.
- **Infallible by design**: All services must have `Infallible` as their error type — errors become responses.

## Skill File Structure

| File | Contents |
|------|----------|
| `SKILL.md` | This file — overview, quick reference, feature flags |
| `getting-started.md` | Installation, Hello World, project setup, Cargo dependencies |
| `api.md` | Full API reference: Router, routing, handlers, extractors, responses, middleware, error handling, state, serving |
| `guides.md` | Testing, deployment, Tower middleware integrations, best practices, examples |

## Quick Reference

### Hello World

```rust
use axum::{routing::get, Router};

#[tokio::main]
async fn main() {
    let app = Router::new().route("/", get(|| async { "Hello, World!" }));
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

### Routing

```rust
use axum::{Router, routing::{get, post, delete}};

let app = Router::new()
    .route("/", get(root))
    .route("/users", get(list_users).post(create_user))
    .route("/users/{id}", get(show_user).delete(delete_user))
    .route("/assets/{*path}", get(serve_asset));
```

### Extractors

```rust
use axum::extract::{Path, Query, State, Json};
use std::collections::HashMap;

async fn handler(
    Path(id): Path<u32>,
    Query(params): Query<HashMap<String, String>>,
    State(db): State<DbPool>,
    Json(body): Json<CreateUser>,
) -> impl IntoResponse {
    // ...
}
```

### Responses

```rust
use axum::{response::{Html, Json, IntoResponse}, http::StatusCode};

async fn html_handler() -> Html<&'static str> { Html("<p>Hello</p>") }
async fn json_handler() -> Json<Vec<String>> { Json(vec!["foo".into()]) }
async fn status_handler() -> StatusCode { StatusCode::NOT_FOUND }
async fn tuple_handler() -> impl IntoResponse {
    (StatusCode::OK, [("x-foo", "bar")], "Hello!")
}
```

### State

```rust
use axum::{Router, routing::get, extract::State};
use std::sync::Arc;

#[derive(Clone)]
struct AppState { db: DbPool }

let app = Router::new()
    .route("/", get(handler))
    .with_state(AppState { db });

async fn handler(State(state): State<AppState>) { /* ... */ }
```

### Middleware

```rust
use axum::middleware::from_fn;
use tower::ServiceBuilder;

let app = Router::new()
    .route("/", get(handler))
    .layer(ServiceBuilder::new()
        .layer(TraceLayer::new_for_http())
        .layer(TimeoutLayer::new(Duration::from_secs(30))));
```

## Feature Flags

| Feature | Description |
|---------|-------------|
| `http1` | Enable HTTP/1.1 support via `axum::serve` |
| `http2` | Enable HTTP/2 support |
| `json` | Enable `Json` extractor/response |
| `macros` | Enable `debug_handler`, `debug_middleware`, `FromRef` derive |
| `matched-path` | Enable `MatchedPath` extractor |
| `multipart` | Enable `Multipart` extractor for `multipart/form-data` |
| `original-uri` | Enable `OriginalUri` extractor |
| `tokio` | Enable `axum::serve`, SSE, `connect_info` |
| `tower-log` | Enable Tower's `log` support |
| `tracing` | Enable `tracing` support (default) |
| `ws` | Enable WebSocket support via `extract::ws` |
| `form` | Enable `Form` extractor |
| `query` | Enable `Query` extractor |

## Required Dependencies

```toml
[dependencies]
axum = "<latest>"
tokio = { version = "<latest>", features = ["full"] }
tower = "<latest>"
```

## Supported Rust Version

Axum 0.8.x requires Rust 1.75+.

## Sources

- https://docs.rs/axum/latest/axum/
- https://docs.rs/axum/latest/axum/struct.Router.html
- https://docs.rs/axum/latest/axum/routing/index.html
- https://docs.rs/axum/latest/axum/handler/index.html
- https://docs.rs/axum/latest/axum/extract/index.html
- https://docs.rs/axum/latest/axum/response/index.html
- https://docs.rs/axum/latest/axum/middleware/index.html
- https://docs.rs/axum/latest/axum/error_handling/index.html
- https://docs.rs/axum/latest/axum/serve/index.html
- https://docs.rs/axum/latest/axum/body/index.html
- https://docs.rs/axum/latest/axum/routing/method_routing/index.html
- https://docs.rs/axum/latest/axum/test_helpers/index.html
- https://docs.rs/axum-extra/latest/axum_extra/
- https://github.com/tokio-rs/axum/tree/main/examples
