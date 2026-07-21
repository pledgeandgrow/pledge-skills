# Axum — Guides

## Testing Axum Applications

### Using Tower's Test Utilities

Axum apps are Tower services, so you can test them using `tower::ServiceExt`:

```rust
use axum::{body::Body, http::{Request, StatusCode}, routing::get, Router};
use tower::ServiceExt;

#[tokio::test]
async fn hello_world() {
    let app = Router::new().route("/", get(|| async { "Hello, World!" }));

    let response = app
        .oneshot(Request::builder().uri("/").body(Body::empty()).unwrap())
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
    let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
    assert_eq!(&body[..], b"Hello, World!");
}
```

### Testing with State

```rust
use axum::{body::Body, http::Request, routing::get, extract::State, Router};
use tower::ServiceExt;

#[derive(Clone)]
struct AppState { count: std::sync::Arc<std::sync::atomic::AtomicUsize> }

#[tokio::test]
async fn test_with_state() {
    let state = AppState {
        count: std::sync::Arc::new(std::sync::atomic::AtomicUsize::new(0)),
    };

    let app = Router::new()
        .route("/", get(|State(s): State<AppState>| async move {
            s.count.fetch_add(1, std::sync::atomic::Ordering::SeqCst);
            "OK"
        }))
        .with_state(state.clone());

    let _ = app
        .clone()
        .oneshot(Request::builder().uri("/").body(Body::empty()).unwrap())
        .await
        .unwrap();

    assert_eq!(state.count.load(std::sync::atomic::Ordering::SeqCst), 1);
}
```

### Testing JSON Responses

```rust
use axum::{body::Body, http::Request, routing::post, Json, Router};
use serde_json::{json, Value};
use tower::ServiceExt;

#[tokio::test]
async fn test_json() {
    let app = Router::new().route("/users", post(|| async {
        Json(json!({ "id": 1, "name": "John" }))
    }));

    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/users")
                .header("content-type", "application/json")
                .body(Body::empty())
                .unwrap()
        )
        .await
        .unwrap();

    let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
    let value: Value = serde_json::from_slice(&body).unwrap();
    assert_eq!(value["name"], "John");
}
```

### Testing with Path Parameters

```rust
use axum::{body::Body, http::Request, routing::get, extract::Path, Router};
use tower::ServiceExt;

#[tokio::test]
async fn test_path_param() {
    let app = Router::new()
        .route("/users/{id}", get(|Path(id): Path<u32>| async move {
            format!("User {id}")
        }));

    let response = app
        .oneshot(Request::builder().uri("/users/42").body(Body::empty()).unwrap())
        .await
        .unwrap();

    let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
    assert_eq!(&body[..], b"User 42");
}
```

### Testing Middleware

```rust
use axum::{body::Body, http::{Request, StatusCode}, routing::get, middleware, Router};
use tower::{ServiceBuilder, ServiceExt};

#[tokio::test]
async fn test_auth_middleware() {
    async fn auth(req: Request<Body>, next: middleware::Next) -> Result<Response, StatusCode> {
        if req.headers().contains_key("authorization") {
            Ok(next.run(req).await)
        } else {
            Err(StatusCode::UNAUTHORIZED)
        }
    }

    let app = Router::new()
        .route("/", get(|| async { "OK" }))
        .layer(middleware::from_fn(auth));

    // Without auth header → 401
    let response = app
        .clone()
        .oneshot(Request::builder().uri("/").body(Body::empty()).unwrap())
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::UNAUTHORIZED);

    // With auth header → 200
    let response = app
        .oneshot(
            Request::builder()
                .uri("/")
                .header("authorization", "Bearer token")
                .body(Body::empty())
                .unwrap()
        )
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::OK);
}
```

---

## Tower & Tower-HTTP Integration

### Available Middleware

From `tower`:
- `tower::timeout::TimeoutLayer` — request timeouts
- `tower::limit::ConcurrencyLimitLayer` — concurrency limits
- `tower::load_shed::LoadShedLayer` — drop requests when overloaded
- `tower::retry::RetryLayer` — retry failed requests
- `tower::buffer::BufferLayer` — buffer requests

From `tower-http`:
- `tower_http::trace::TraceLayer` — request/response tracing
- `tower_http::compression::CompressionLayer` — response compression
- `tower_http::cors::CorsLayer` — CORS handling
- `tower_http::timeout::TimeoutLayer` — timeout (tower-http version)
- `tower_http::auth::ValidateRequestHeaderLayer` — header-based auth
- `tower_http::services::{ServeDir, ServeFile}` — static file serving
- `tower_http::set_header::SetResponseHeaderLayer` — set response headers
- `tower_http::request_id::RequestIdLayer` — request IDs
- `tower_http::catch_panic::CatchPanicLayer` — panic recovery
- `tower_http::fs::ServeDir` — directory serving

### CORS Example

```rust
use tower_http::cors::{CorsLayer, Any};

let cors = CorsLayer::new()
    .allow_methods(Any)
    .allow_origin(Any)
    .allow_headers(Any);

let app = Router::new()
    .route("/api", get(handler))
    .layer(cors);
```

### Static File Serving

```rust
use tower_http::services::ServeDir;

let app = Router::new()
    .nest_service("/static", ServeDir::new("public"));
```

### Compression

```rust
use tower_http::compression::CompressionLayer;

let app = Router::new()
    .route("/", get(handler))
    .layer(CompressionLayer::new());
```

### Tracing

```rust
use tower_http::trace::TraceLayer;

let app = Router::new()
    .route("/", get(handler))
    .layer(TraceLayer::new_for_http());
```

### Combining Multiple Middleware

```rust
use tower::ServiceBuilder;
use tower_http::{trace::TraceLayer, compression::CompressionLayer, cors::CorsLayer};

let app = Router::new()
    .route("/", get(handler))
    .layer(
        ServiceBuilder::new()
            .layer(TraceLayer::new_for_http())
            .layer(CompressionLayer::new())
            .layer(CorsLayer::permissive())
    );
```

---

## Deployment

### Docker

```dockerfile
FROM rust:latest as builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y libssl1.1 ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/my-app /usr/local/bin/my-app
EXPOSE 3000
CMD ["my-app"]
```

### Using into_make_service with Hyper Directly

```rust
use axum::ServiceExt;

let app = Router::new().route("/", get(handler));
let make_service = app.into_make_service();

let server = hyper::Server::from_tcp(tcp_listener)
    .unwrap()
    .serve(make_service);
```

### Using into_make_service_with_connect_info

```rust
use axum::extract::ConnectInfo;
use std::net::SocketAddr;

let app = Router::new()
    .route("/", get(|ConnectInfo(addr): ConnectInfo<SocketAddr>| async move {
        format!("Hello from {addr}")
    }));

let make_service = app.into_make_service_with_connect_info::<SocketAddr>();
```

### Graceful Shutdown Pattern

```rust
async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
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

    println!("Shutdown signal received");
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/", get(handler));
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .unwrap();
}
```

---

## Best Practices

### State Management

- Use `Arc<T>` for expensive-to-clone state
- Use `#[derive(Clone)]` when all fields are cheap to clone
- Use `FromRef` for substate extraction
- Return `Router<AppState>` from functions, call `with_state` before serving
- Don't use `with_state` inside route functions — set it at the top level

### Error Handling

- Define a single `AppError` enum that implements `IntoResponse`
- Use `?` operator with `From` conversions
- Log errors in the `IntoResponse` implementation
- Return appropriate HTTP status codes
- Don't expose internal error details in production

```rust
impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            AppError::NotFound => (StatusCode::NOT_FOUND, "Resource not found"),
            AppError::Unauthorized => (StatusCode::UNAUTHORIZED, "Unauthorized"),
            AppError::Internal(e) => {
                tracing::error!("Internal error: {e}");
                (StatusCode::INTERNAL_SERVER_ERROR, "Internal server error")
            }
        };
        (status, message).into_response()
    }
}
```

### Routing Organization

- Split routes into modules and merge/nest them
- Use `nest` for API versioning (`/api/v1`, `/api/v2`)
- Use `merge` for combining independent route groups

```rust
mod users;
mod teams;
mod health;

let app = Router::new()
    .merge(users::routes())
    .merge(teams::routes())
    .merge(health::routes());
```

### Middleware Ordering

- Use `ServiceBuilder` for multiple middleware (top-to-bottom execution)
- Put error-handling layers above the layers they handle
- Use `route_layer` for auth middleware to avoid converting 404s to 401s
- Apply backpressure-sensitive middleware around the entire app

### Security

- Set `DefaultBodyLimit` to prevent oversized requests
- Use `tower_http::cors::CorsLayer` for CORS
- Use `ValidateRequestHeaderLayer` for simple auth
- Use `CatchPanicLayer` to prevent panics from crashing the server
- Always validate and sanitize user input

### Performance

- Use `into_make_service()` for zero-copy connection handling
- Avoid `Arc<Mutex<T>>` for hot paths — prefer channels or `ArcSwap`
- Use `&'static str` for static responses
- Enable compression via `CompressionLayer`
- Use connection pooling for databases (e.g., `sqlx`, `deadpool`)

---

## Integration Examples

### With Tracing

```rust
use tracing_subscriber;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let app = Router::new()
        .route("/", get(handler))
        .layer(TraceLayer::new_for_http());

    axum::serve(listener, app).await.unwrap();
}
```

### With SQLx

```rust
use sqlx::PgPool;
use axum::extract::State;

#[derive(Clone)]
struct AppState { pool: PgPool }

async fn get_users(State(state): State<AppState>) -> impl IntoResponse {
    let users = sqlx::query_as::<_, User>("SELECT * FROM users")
        .fetch_all(&state.pool)
        .await;
    match users {
        Ok(users) => Json(users).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}
```

### With Tokio Channels

```rust
use tokio::sync::broadcast;

#[derive(Clone)]
struct AppState {
    tx: broadcast::Sender<String>,
}

async fn sse_handler(State(state): State<AppState>) -> Sse<impl Stream<Item = Result<Event, Infallible>>> {
    let rx = state.tx.subscribe();
    let stream = tokio_stream::wrappers::BroadcastStream::new(rx)
        .filter_map(|r| async move { r.ok() })
        .map(|msg| Ok(Event::default().data(msg)));
    Sse::new(stream)
}
```

### With Reqwest (HTTP Client)

```rust
use reqwest::Client;

#[derive(Clone)]
struct AppState {
    http_client: Client,
}

async fn proxy(State(state): State<AppState>) -> impl IntoResponse {
    let resp = state.http_client.get("https://api.example.com/data")
        .send()
        .await
        .unwrap();
    resp.text().await.unwrap()
}
```

### With Redis

```rust
use redis::Client as RedisClient;

#[derive(Clone)]
struct AppState {
    redis: RedisClient,
}

async fn cache_handler(State(state): State<AppState>) -> impl IntoResponse {
    let mut conn = state.redis.get_multiplexed_async_connection().await.unwrap();
    let val: String = redis::cmd("GET").arg("key").query_async(&mut conn).await.unwrap();
    val
}
```

---

## Common Patterns

### API Versioning

```rust
let v1_routes = Router::new()
    .route("/users", get(get_users_v1));
let v2_routes = Router::new()
    .route("/users", get(get_users_v2));

let app = Router::new()
    .nest("/api/v1", v1_routes)
    .nest("/api/v2", v2_routes);
```

### Shared Middleware for Specific Routes

```rust
let with_auth = Router::new()
    .route("/profile", get(profile))
    .route("/settings", get(settings))
    .layer(middleware::from_fn(auth_middleware));

let public = Router::new()
    .route("/login", post(login))
    .route("/register", post(register));

let app = Router::new()
    .merge(with_auth)
    .merge(public);
```

### Custom Response Headers

```rust
async fn handler() -> impl IntoResponse {
    (
        StatusCode::OK,
        [("x-request-id", "abc123"), ("x-custom", "value")],
        "Hello!",
    )
}
```

### Redirect

```rust
use axum::response::Redirect;

async fn old_route() -> Redirect {
    Redirect::permanent("/new-route")
}

async fn temp_redirect() -> Redirect {
    Redirect::to("/temporary")
}
```

### Streaming Responses

```rust
use axum::body::Body;
use futures::stream;
use http::Response;

async fn stream_handler() -> Response<Body> {
    let stream = stream::iter(vec!["Hello", " ", "World"])
        .map(|chunk| Ok::<_, std::io::Error>(chunk));
    Response::builder()
        .body(Body::from_stream(stream))
        .unwrap()
}
```

---

## Sources

- https://docs.rs/axum/latest/axum/
- https://docs.rs/axum/latest/axum/middleware/index.html
- https://docs.rs/axum/latest/axum/error_handling/index.html
- https://docs.rs/axum/latest/axum/serve/index.html
- https://docs.rs/axum/latest/axum/test_helpers/index.html
- https://docs.rs/axum-extra/latest/axum_extra/
- https://github.com/tokio-rs/axum/tree/main/examples
- https://docs.rs/tower/latest/tower/
- https://docs.rs/tower-http/latest/tower_http/
