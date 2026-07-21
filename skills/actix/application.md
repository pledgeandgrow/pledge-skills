# Application

`actix-web` provides various primitives to build web servers and applications with Rust. It provides routing, middleware, pre-processing of requests, post-processing of responses, etc.

All actix-web servers are built around the `App` instance. It is used for registering routes for resources and middleware. It also stores application state shared across all handlers within the same scope.

## Writing an Application

An application's scope acts as a namespace for all routes — all routes for a specific application scope have the same URL path prefix. The application prefix always contains a leading `/` slash. If a supplied prefix does not contain a leading slash, it is automatically inserted.

For an application with scope `/app`, any request with the paths `/app`, `/app/`, or `/app/test` would match; however, the path `/application` would not match.

```rust
use actix_web::{web, App, HttpServer, Responder};

async fn index() -> impl Responder {
    "Hello world!"
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new().service(
            web::scope("/app")
                .route("/index.html", web::get().to(index)),
        )
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

## State

Application state is shared with all routes and resources within the same scope. State can be accessed with the `web::Data<T>` extractor where `T` is the type of the state. State is also accessible for middleware.

```rust
use actix_web::{get, web, App, HttpServer};

struct AppState {
    app_name: String,
}

#[get("/")]
async fn index(data: web::Data<AppState>) -> String {
    let app_name = &data.app_name;
    format!("Hello {app_name}!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .app_data(web::Data::new(AppState {
                app_name: String::from("Actix Web"),
            }))
            .service(index)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

Any number of state types could be registered within the application.

## Shared Mutable State

`HttpServer` accepts an application factory rather than an application instance. An `HttpServer` constructs an application instance for each thread. Therefore, application data must be constructed multiple times. If you want to share data between different threads, a shareable object should be used, e.g. `Send + Sync`.

Internally, `web::Data` uses `Arc`. To avoid creating two `Arc`s, create your `Data` before registering it using `App::app_data()`.

```rust
use actix_web::{web, App, HttpServer};
use std::sync::Mutex;

struct AppStateWithCounter {
    counter: Mutex<i32>,
}

async fn index(data: web::Data<AppStateWithCounter>) -> String {
    let mut counter = data.counter.lock().unwrap();
    *counter += 1;
    format!("Request number: {counter}")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let counter = web::Data::new(AppStateWithCounter {
        counter: Mutex::new(0),
    });
    HttpServer::new(move || {
        App::new()
            .app_data(counter.clone())
            .route("/", web::get().to(index))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

Key takeaways:

- State initialized inside the closure passed to `HttpServer::new` is local to the worker thread and may become de-synced if modified.
- To achieve globally shared state, it must be created outside of the closure passed to `HttpServer::new` and moved/cloned in.

## Using an Application Scope to Compose Applications

The `web::scope()` method allows setting a resource group prefix. This scope represents a resource prefix that will be prepended to all resource patterns added by the resource configuration.

```rust
#[actix_web::main]
async fn main() {
    let scope = web::scope("/users").service(show_users);
    App::new().service(scope);
}
```

In the above example, the `show_users` route will have an effective route pattern of `/users/show` instead of `/show`.

## Application Guards and Virtual Hosting

A guard is a simple function that accepts a request object reference and returns true or false. Formally, a guard is any object that implements the `Guard` trait.

The `Host` guard can be used as a filter based on request header information for virtual hosting:

```rust
use actix_web::{guard, web, App, HttpResponse, HttpServer};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(
                web::scope("/")
                    .guard(guard::Host("www.rust-lang.org"))
                    .route("", web::to(|| async { HttpResponse::Ok().body("www") })),
            )
            .service(
                web::scope("/")
                    .guard(guard::Host("users.rust-lang.org"))
                    .route("", web::to(|| async { HttpResponse::Ok().body("user") })),
            )
            .route("/", web::to(HttpResponse::Ok))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

## Configure

For simplicity and reusability, both `App` and `web::Scope` provide the `configure` method. This function is useful for moving parts of the configuration to a different module or even library.

```rust
use actix_web::{web, App, HttpResponse, HttpServer};

fn scoped_config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::resource("/test")
            .route(web::get().to(|| async { HttpResponse::Ok().body("test") }))
            .route(web::head().to(HttpResponse::MethodNotAllowed)),
    );
}

fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::resource("/app")
            .route(web::get().to(|| async { HttpResponse::Ok().body("app") }))
            .route(web::head().to(HttpResponse::MethodNotAllowed)),
    );
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .configure(config)
            .service(web::scope("/api").configure(scoped_config))
            .route("/", web::get().to(|| async { HttpResponse::Ok().body("/") }))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

Result:

- `/` returns `"/"`
- `/app` returns `"app"`
- `/api/test` returns `"test"`

Each `ServiceConfig` can have its own data, routes, and services.
