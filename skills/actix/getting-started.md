# Getting Started

## What is Actix Web

Actix Web is part of an ecosystem of crates. Long ago, it was built on top of the `actix` actor framework. Now, Actix Web is largely unrelated to the actor framework and is built using a different system. Though `actix` is still maintained, its usefulness as a general tool is diminishing as the futures and async/await ecosystem matures. At this time, the use of `actix` is only required for WebSocket endpoints.

Actix Web is a powerful and pragmatic framework — a micro-framework with a few twists. If you are already a Rust programmer, you will probably find yourself at home quickly.

An application developed with Actix Web will expose an HTTP server contained within a native executable. You can either put this behind another HTTP server like nginx or serve it up as-is. Even in the complete absence of another HTTP server, Actix Web is powerful enough to provide HTTP/1 and HTTP/2 support as well as TLS (HTTPS). This makes it useful for building small services ready for production.

Actix Web runs on Rust 1.72 or later and works with stable releases.

## Installing Rust

If you don't have Rust yet, use `rustup` to manage your Rust installation:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Update Rust to the latest version:

```bash
rustup update
```

Actix Web has a minimum supported Rust version (MSRV) of 1.72.

## Hello, World!

Start by creating a new binary-based Cargo project:

```bash
cargo new hello-world
cd hello-world
```

Add `actix-web` as a dependency in your `Cargo.toml`:

```toml
[dependencies]
actix-web = "4"
```

Replace the contents of `src/main.rs`:

```rust
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[post("/echo")]
async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}

async fn manual_hello() -> impl Responder {
    HttpResponse::Ok().body("Hey there!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(hello)
            .service(echo)
            .route("/hey", web::get().to(manual_hello))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

Key points:

- Request handlers use async functions that accept zero or more parameters.
- Parameters can be extracted from a request (see `FromRequest` trait).
- The function returns a type that can be converted into an `HttpResponse` (see `Responder` trait).
- Routing macros (`#[get]`, `#[post]`) attach routing information directly to handlers.
- Use `App::service` for handlers using routing macros and `App::route` for manually routed handlers.
- `HttpServer` serves incoming requests using your `App` as an "application factory".
- The `#[actix_web::main]` macro executes the async main function within the actix runtime.

Compile and run:

```bash
cargo run
```

Visit `http://127.0.0.1:8080/` to see the results.

## Routing Macros vs Manual Routing

**Macro-based routing** — attaches method and path directly to the handler:

```rust
#[get("/users/{id}")]
async fn get_user(path: web::Path<u32>) -> impl Responder {
    HttpResponse::Ok().body(format!("User {}", path.into_inner()))
}
```

Register with `App::service`:

```rust
App::new().service(get_user)
```

**Manual routing** — use `web::get()`, `web::post()`, etc.:

```rust
async fn index() -> impl Responder {
    HttpResponse::Ok().body("Hello!")
}

App::new().route("/", web::get().to(index))
```

## Application Factory Pattern

`HttpServer` accepts an application factory (a closure that returns an `App`). This is because `HttpServer` constructs a new `App` instance for each worker thread:

```rust
HttpServer::new(|| {
    // This closure is called for each worker thread
    App::new()
        .service(hello)
        .route("/hey", web::get().to(manual_hello))
})
.bind(("127.0.0.1", 8080))?
.run()
.await
```

## Ecosystem Crates

| Crate | Purpose |
|-------|---------|
| `actix-web` | Core web framework |
| `actix-files` | Static file serving |
| `actix-cors` | CORS middleware |
| `actix-session` | Session management |
| `actix-ws` | WebSocket support |
| `actix-multipart` | Multipart form handling |
| `actix-identity` | Identity/authentication |
| `actix-http` | Low-level HTTP implementation |
| `actix-rt` | Actix runtime (Tokio wrapper) |
| `actix-server` | Generic server framework |
| `actix` | Actor framework (for WebSockets) |
