# Fullstack

> **Sources:** [Fullstack Overview](https://dioxuslabs.com/learn/0.7/essentials/fullstack/) | [Project Setup](https://dioxuslabs.com/learn/0.7/essentials/fullstack/project_setup) | [SSR](https://dioxuslabs.com/learn/0.7/essentials/fullstack/ssr) | [Server Functions](https://dioxuslabs.com/learn/0.7/essentials/fullstack/server_functions) | [Middleware](https://dioxuslabs.com/learn/0.7/essentials/fullstack/middleware) | [Websockets](https://dioxuslabs.com/learn/0.7/essentials/fullstack/websockets)

## Project Setup

For fullstack projects, use the fullstack feature:

```toml
[dependencies]
dioxus = { version = "0.7", features = ["fullstack", "router"] }
```

Create a fullstack project:

```bash
dx new --template fullstack my-app
```

### Server/Client Split

Dioxus fullstack builds a single binary that serves both the client (WASM) and server (native Rust). The `dx` tool handles the split automatically:
- Server code is compiled natively
- Client code is compiled to WASM
- Both share the same crate

### Customizing Builds

Use feature flags to control server-only and client-only dependencies:

```toml
[dependencies]
dioxus = { version = "0.7", features = ["fullstack", "router"] }

# Server-only dependencies
[target.'cfg(not(target_arch = "wasm32"))'.dependencies]
tokio = "1"
sqlx = "0.8"

# Client-only dependencies
[target.'cfg(target_arch = "wasm32")'.dependencies]
gloo-storage = "0.3"
```

### Binary-Specific Imports

Use conditional compilation for platform-specific code:

```rust
#[cfg(not(target_arch = "wasm32"))]
fn server_only_function() { /* ... */ }

#[cfg(target_arch = "wasm32")]
fn client_only_function() { /* ... */ }
```

### Separate Frontend and Backend Crates

For larger projects, split into separate crates in a workspace:

```
my-app/
├── Cargo.toml        # workspace
├── frontend/         # client crate
│   └── Cargo.toml
└── backend/          # server crate
    └── Cargo.toml
```

## Hot-Reload

Dioxus Fullstack ships with full Rust hot-reload support via the [subsecond](https://crates.io/crates/subsecond) engine. You can add new endpoints, pages, and logic without manually rebuilding.

**Limitations:** Code that runs only once will not be hot-reloadable and requires a restart.

## Server Functions

Server functions let you define functions that always run on the server. When called from the client, Dioxus serializes arguments, sends them to the server, runs the function, and returns the result:

```rust
#[server]
async fn fetch_dog(breed: String) -> Result<String, ServerFnError> {
    DB.execute("SELECT url FROM dogs WHERE id = ?1", &breed)
        .map_err(|e| ServerFnError::new(e.to_string()))
}
```

### HTTP Method Attributes

```rust
#[get("/api/dog/{breed}")]
async fn fetch_dog(breed: String) -> Result<String, ServerFnError> { /* ... */ }

#[post("/api/save")]
async fn save_dog(data: DogData) -> Result<(), ServerFnError> { /* ... */ }
```

### Path and Query Extractors

```rust
#[get("/api/dog/{breed}?limit&offset")]
async fn fetch_dogs(
    breed: String,
    limit: Option<u32>,
    offset: Option<u32>,
) -> Result<Vec<String>, ServerFnError> { /* ... */ }
```

### Custom Inputs and Outputs

Implement `FromRequest`/`IntoRequest` for custom request types and `IntoResponse`/`FromResponse` for custom response types. This enables types like `WebsocketOptions` and `Websocket`.

### Server Extractors

Hoist function arguments into the macro for server-only extractors (auth, headers, cookies):

```rust
#[post("/api/user/login", auth: auth::Session)]
pub async fn login() -> Result<()> {
    auth.login_user(2);
    Ok(())
}

#[get("/api/headers", headers: dioxus::fullstack::HeaderMap)]
async fn get_headers() -> Result<String> {
    Ok(format!("{:#?}", headers))
}
```

### Handling Errors

Acceptable error types: `anyhow::Error`, `ServerFnError`, `StatusCode`, `HttpError`, and custom errors implementing `Serialize`, `Deserialize`, and `AsStatusCode`.

```rust
match login().await {
    Err(ServerFnError::ServerError { code, .. }) => {
        if code == 404 { /* handle not found */ }
        if code == 401 { /* handle unauthorized */ }
    }
    _ => { /* */ }
}
```

Ergonomic error handling with `OrHttpError`:

```rust
authenticate_user()
    .or_unauthorized("You must be logged in to view this resource")?;
```

## Server Side Rendering

### SSR vs CSR

- **CSR:** Server sends skeleton HTML; client loads JS/WASM and fetches data
- **SSR:** Server renders complete HTML with content; client hydrates into interactive app

Dioxus employs a hybrid approach: default to CSR, with SSR as an enhancement.

### Hydration

The server renders initial HTML and serializes data. The client:
1. Deserializes server data
2. Re-runs components with deserialized data
3. Hydrates HTML with event listeners and effects

### Hydration Errors

Common causes and fixes:
- Non-deterministic data: use `use_server_cached` or `use_server_future`
- Async loading: use `use_server_future` instead of `use_resource().suspend()`
- Client-only data: use `use_effect` to modify after hydration
- Side effects in server-cached hooks: return values instead of mutating signals

```rust
// ❌ Random number differs between server and client
let random: u8 = use_hook(|| rand::random());

// ✅ Same random number serialized on server, deserialized on client
let random: u8 = use_server_cached(|| rand::random());
```

### use_loader for SSR

The `use_loader` hook is designed for isomorphic data loading in both CSR and SSR. It returns `Result<Loader<T>, Loading>` and integrates with Error Boundaries and Suspense.

## Middleware

### What is Middleware?

Middleware functions are called before and after request handling. Dioxus is built on Axum, integrating with `tower` and `tower-http` ecosystems.

Use cases: logging, rate limiting, validation, compression, CORS, authentication, caching.

### Middleware on the Router

```rust
dioxus::serve(|| async move {
    use axum::{extract::Request, middleware::Next};
    use dioxus::server::axum;
    Ok(dioxus::server::router(app)
        .layer(axum::middleware::from_fn(
            |request: Request, next: Next| async move {
                println!("Request: {} {}", request.method(), request.uri().path());
                let res = next.run(request).await;
                println!("Response: {}", res.status());
                res
            },
        )))
});
```

Use `ServiceBuilder` to stack multiple middleware efficiently.

### Middleware on Individual Routes

```rust
#[post("/api/timeout")]
#[middleware(TimeoutLayer::new(Duration::from_secs(1)))]
pub async fn timeout() -> Result<(), ServerFnError> { /* ... */ }
```

### Caching and Middleware

Add `Cache-Control` headers for CDN caching. Be careful that session/auth middleware doesn't accidentally cache personalized content.

## Websockets

### Websocket and WebsocketOptions

```rust
#[get("/api/uppercase_ws")]
async fn uppercase_ws(options: WebSocketOptions) -> Result<Websocket> {
    Ok(options.on_upgrade(move |mut socket| async move {
        _ = socket.send("Hello!".to_string()).await;
        while let Ok(msg) = socket.recv().await {
            _ = socket.send(msg.to_ascii_uppercase()).await;
        }
    }))
}
```

The `Websocket` type is generic over input, output, and encoding (`JsonEncoding` default, `CborEncoding` for binary).

### Connecting to a Websocket

```rust
use_future(move || async move {
    let socket = uppercase_ws(WebSocketOptions::new()).await;
    while let Ok(msg) = socket.recv().await {
        messages.push(msg);
    }
});
```

### The use_websocket Hook

`use_websocket` wraps the websocket with signal-based reactivity for `.status()`, `.send()`, and `.recv()`:

```rust
let mut socket = use_websocket(|| uppercase_ws(WebSocketOptions::new()));

rsx! {
    input {
        oninput: move |e| async move {
            _ = socket.send(ClientEvent::TextInput(e.value())).await;
        },
    }
}
```

## Streaming

The `Streaming<T>` wrapper sends arbitrary bytes, text, JSON, and chunked file contents:

```rust
#[get("/stream")]
async fn stream_data() -> Streaming<String> {
    Streaming::new(async_stream::stream! {
        for i in 0..10 {
            yield format!("Item {i}");
            tokio::time::sleep(Duration::from_secs(1)).await;
        }
    })
}
```

## Assets

Dioxus Fullstack integrates with the `dx` build tool — assets are pre-optimized for CDN deployment:
- Assets are hashed for infinite client caching
- CDNs reduce bandwidth and speed up time-to-first-byte
- Automatic optimization of images, CSS, and other assets

## Static Site Generation

```bash
dx build --ssg
```

Generates static HTML files for all routes, combining SSR benefits (SEO, fast load) with static hosting simplicity.
