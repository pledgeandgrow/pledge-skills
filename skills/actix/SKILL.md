# Actix Web — Rust Web Framework

> **Version:** actix-web 4.x | **MSRV:** Rust 1.72+ | **Source:** [https://actix.rs/docs](https://actix.rs/docs)

Actix Web is a powerful, pragmatic, extremely fast Rust web framework for building HTTP servers and web services. It supports HTTP/1, HTTP/2, TLS/HTTPS, WebSockets, and provides a type-safe request extraction and response system.

## Key Benefits

- **Extremely fast** — one of the fastest web frameworks available
- **Type-safe** — extractors (`FromRequest`) and responders (`Responder`) provide compile-time guarantees
- **Async by default** — built on Tokio runtime
- **Flexible routing** — macro-based (`#[get]`, `#[post]`) or manual `web::route()`
- **Middleware system** — composable `Transform` + `Service` traits, `wrap_fn`, `from_fn`
- **WebSocket support** — via `actix-ws` crate
- **HTTP/2 support** — automatic upgrade with TLS
- **Static file serving** — via `actix-files` crate
- **CORS support** — via `actix-cors` crate
- **Session management** — via `actix-session` crate
- **Actor framework** — `actix` crate for actor-based concurrency (WebSocket endpoints)

## File Index

| File | Topics |
|------|--------|
| `getting-started.md` | What is Actix Web, installation, hello world, Cargo.toml setup, actix CLI |
| `application.md` | App instance, scopes, state, shared mutable state, guards, virtual hosting, configure |
| `url-dispatch.md` | Resources, routes, pattern syntax, scoping, match info, URL generation, path normalization, custom guards, default not found |
| `extractors.md` | Path, Query, JSON, Form, Data, HttpRequest, Bytes, Payload, application state extractor |
| `handlers-responses.md` | Request handlers, Responder trait, custom types, streaming, Either, JSON response, content encoding, requests (JSON body, content encoding, chunked, multipart, urlencoded, streaming) |
| `middleware.md` | Middleware system, Transform/Service traits, wrap_fn, from_fn, logging, default headers, user sessions, error handlers, CORS |
| `errors.md` | ResponseError trait, custom error responses, error helpers, error logging, recommended practices |
| `testing.md` | Integration testing, stream response testing, unit testing extractors |
| `advanced-topics.md` | HTTP server (multi-threading, TLS/HTTPS, keep-alive, graceful shutdown), HTTP/2, static files, WebSockets, auto-reloading, databases, architecture diagrams, actix actor framework (Actor, Message, Address, Context, Arbiter, SyncArbiter) |

## Quick Start

```toml
# Cargo.toml
[dependencies]
actix-web = "4"
```

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

## Documentation Links

- [Welcome](https://actix.rs/docs/)
- [What is Actix Web](https://actix.rs/docs/whatis)
- [Getting Started](https://actix.rs/docs/getting-started)
- [Application](https://actix.rs/docs/application)
- [Server](https://actix.rs/docs/server)
- [Extractors](https://actix.rs/docs/extractors)
- [Requests](https://actix.rs/docs/request)
- [Responses](https://actix.rs/docs/response)
- [Errors](https://actix.rs/docs/errors)
- [URL Dispatch](https://actix.rs/docs/url-dispatch)
- [Testing](https://actix.rs/docs/testing)
- [Middleware](https://actix.rs/docs/middleware)
- [CORS](https://actix.rs/docs/cors)
- [Static Files](https://actix.rs/docs/static-files)
- [WebSockets](https://actix.rs/docs/websockets)
- [HTTP/2](https://actix.rs/docs/http2)
- [Auto-Reloading](https://actix.rs/docs/autoreload)
- [Databases](https://actix.rs/docs/databases)
- [HTTP Server Initialization](https://actix.rs/docs/http_server_init)
- [Connection Lifecycle](https://actix.rs/docs/conn_lifecycle)
- [Actix Actor Framework](https://actix.rs/docs/actix)
- [Actix API Docs](https://docs.rs/actix/latest/actix/)
- [Actix Web API Docs](https://docs.rs/actix-web)
