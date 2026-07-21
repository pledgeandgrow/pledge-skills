# Extractors

Actix Web provides a facility for type-safe request information access called extractors (i.e., `impl FromRequest`). There are lots of built-in extractor implementations.

## Path

`Path` provides information that is extracted from the request's path. Parts of the path that are extractable are called "dynamic segments" and are marked with curly braces.

For a resource registered at `/users/{user_id}/{friend}`, two segments can be deserialized.

**Tuple extraction:**

```rust
use actix_web::{get, web, App, HttpServer, Result};

#[get("/users/{user_id}/{friend}")]
async fn index(path: web::Path<(u32, String)>) -> Result<String> {
    let (user_id, friend) = path.into_inner();
    Ok(format!("Welcome {}, user_id {}!", friend, user_id))
}
```

**Struct extraction with serde:**

```rust
use actix_web::{get, web, Result};
use serde::Deserialize;

#[derive(Deserialize)]
struct Info {
    user_id: u32,
    friend: String,
}

#[get("/users/{user_id}/{friend}")]
async fn index(info: web::Path<Info>) -> Result<String> {
    Ok(format!("Welcome {}, user_id {}!", info.friend, info.user_id))
}
```

**Non-type-safe alternative using `match_info`:**

```rust
use actix_web::{get, HttpRequest, Result};

#[get("/users/{user_id}/{friend}")]
async fn index(req: HttpRequest) -> Result<String> {
    let name: String = req.match_info().get("friend").unwrap().parse().unwrap();
    let userid: i32 = req.match_info().query("user_id").parse().unwrap();
    Ok(format!("Welcome {}, user_id {}!", name, userid))
}
```

## Query

The `Query<T>` type provides extraction functionality for the request's query parameters. Underneath it uses `serde_urlencoded` crate.

```rust
use actix_web::{get, web, App, HttpServer};
use serde::Deserialize;

#[derive(Deserialize)]
struct Info {
    username: String,
}

#[get("/")]
async fn index(info: web::Query<Info>) -> String {
    format!("Welcome {}!", info.username)
}
```

If query deserialization fails, a 400 Bad Request error response is returned.

## JSON

`Json<T>` allows deserialization of a request body into a struct. The type `T` must implement `serde::Deserialize`.

```rust
use actix_web::{post, web, App, HttpServer, Result};
use serde::Deserialize;

#[derive(Deserialize)]
struct Info {
    username: String,
}

#[post("/submit")]
async fn submit(info: web::Json<Info>) -> Result<String> {
    Ok(format!("Welcome {}!", info.username))
}
```

### Configuring JSON Extraction

Configure the extraction process by passing a configuration object to `.app_data()`:

```rust
use actix_web::{error, web, App, HttpResponse, HttpServer, Responder};
use serde::Deserialize;

#[derive(Deserialize)]
struct Info {
    username: String,
}

async fn index(info: web::Json<Info>) -> impl Responder {
    format!("Welcome {}!", info.username)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let json_config = web::JsonConfig::default()
            .limit(4096) // 4kb max payload
            .error_handler(|err, _req| {
                error::InternalError::from_response(
                    err,
                    HttpResponse::Conflict().finish(),
                )
                .into()
            });
        App::new().service(
            web::resource("/")
                .app_data(json_config)
                .route(web::post().to(index)),
        )
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

## URL-Encoded Forms

A URL-encoded form body can be extracted to a struct, much like `Json<T>`. The type must implement `serde::Deserialize`.

```rust
use actix_web::{post, web, App, HttpServer, Result};
use serde::Deserialize;

#[derive(Deserialize)]
struct FormData {
    username: String,
}

#[post("/")]
async fn index(form: web::Form<FormData>) -> Result<String> {
    Ok(format!("Welcome {}!", form.username))
}
```

### Optional Form Data

Wrap the extractor in `Option` to handle invalid input yourself:

```rust
#[post("/maybe")]
async fn maybe(form: Option<web::Form<FormData>>) -> Result<String> {
    let Some(form) = form else {
        return Ok("Missing or invalid form data.".to_string());
    };
    Ok(format!("Welcome {}!", form.username))
}
```

## Other Extractors

- **`Data`** — For accessing pieces of application state.
- **`HttpRequest`** — HttpRequest is itself an extractor, for access to other parts of the request.
- **`String`** — Convert a request's payload to a String.
- **`Bytes`** — Convert a request's payload into Bytes.
- **`Payload`** — Low-level payload extractor primarily for building other extractors.

## Application State Extractor

Application state is accessible from the handler with the `web::Data` extractor; however, state is accessible as a read-only reference. If you need mutable access to state, it must be implemented.

**Per-thread state with `Cell`:**

```rust
use actix_web::{web, App, HttpServer, Responder};
use std::cell::Cell;

#[derive(Clone)]
struct AppState {
    count: Cell<usize>,
}

async fn show_count(data: web::Data<AppState>) -> impl Responder {
    format!("count: {}", data.count.get())
}

async fn add_one(data: web::Data<AppState>) -> impl Responder {
    let count = data.count.get();
    data.count.set(count + 1);
    format!("count: {}", data.count.get())
}
```

**Global shared state with `Arc<AtomicUsize>`:**

```rust
use actix_web::{get, web, App, HttpServer, Responder};
use std::{
    cell::Cell,
    sync::atomic::{AtomicUsize, Ordering},
    sync::Arc,
};

#[derive(Clone)]
struct AppState {
    local_count: Cell<usize>,
    global_count: Arc<AtomicUsize>,
}

#[get("/")]
async fn show_count(data: web::Data<AppState>) -> impl Responder {
    format!(
        "global_count: {}\nlocal_count: {}",
        data.global_count.load(Ordering::Relaxed),
        data.local_count.get()
    )
}

#[get("/add")]
async fn add_one(data: web::Data<AppState>) -> impl Responder {
    data.global_count.fetch_add(1, Ordering::Relaxed);
    let local_count = data.local_count.get();
    data.local_count.set(local_count + 1);
    format!(
        "global_count: {}\nlocal_count: {}",
        data.global_count.load(Ordering::Relaxed),
        data.local_count.get()
    )
}
```

For shared state across all threads, use `web::Data` and `app_data` as described in the Application chapter's Shared Mutable State section.
