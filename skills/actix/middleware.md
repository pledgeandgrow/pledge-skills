# Middleware

Actix Web's middleware system allows us to add additional behavior to request/response processing. Middleware can hook into an incoming request process, enabling us to modify requests as well as halt request processing to return a response early. Middleware can also hook into response processing.

Typically, middleware is involved in the following actions:

- Pre-process the Request
- Post-process a Response
- Modify application state
- Access external services (redis, logging, sessions)

Middleware is registered for each `App`, scope, or `Resource` and executed in opposite order as registration. A middleware is a type that implements the `Service` trait and `Transform` trait.

## Creating Middleware with Transform and Service Traits

```rust
use std::future::{ready, Ready};
use actix_web::{
    dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform},
    Error,
};
use futures_util::future::LocalBoxFuture;

pub struct SayHi;

impl<S, B> Transform<S, ServiceRequest> for SayHi
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type InitError = ();
    type Transform = SayHiMiddleware<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(SayHiMiddleware { service }))
    }
}

pub struct SayHiMiddleware<S> {
    service: S,
}

impl<S, B> Service<ServiceRequest> for SayHiMiddleware<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    forward_ready!(service);

    fn call(&self, req: ServiceRequest) -> Self::Future {
        println!("Hi from start. You requested: {}", req.path());
        let fut = self.service.call(req);
        Box::pin(async move {
            let res = fut.await?;
            println!("Hi from response");
            Ok(res)
        })
    }
}
```

## Using wrap_fn for Ad-hoc Middleware

```rust
use actix_web::{dev::Service as _, web, App};
use futures_util::future::FutureExt;

#[actix_web::main]
async fn main() {
    let app = App::new()
        .wrap_fn(|req, srv| {
            println!("Hi from start. You requested: {}", req.path());
            srv.call(req).map(|res| {
                println!("Hi from response");
                res
            })
        })
        .route("/index.html", web::get().to(|| async { "Hello, middleware!" }));
}
```

## Using from_fn with wrap

```rust
use actix_web::{
    body::MessageBody,
    dev::{ServiceRequest, ServiceResponse},
    middleware::{from_fn, Next},
    App, Error,
};

async fn my_middleware(
    req: ServiceRequest,
    next: Next<impl MessageBody>,
) -> Result<ServiceResponse<impl MessageBody>, Error> {
    // pre-processing
    next.call(req).await
    // post-processing
}

#[actix_web::main]
async fn main() {
    let app = App::new().wrap(from_fn(my_middleware));
}
```

**Warning:** If you use `wrap()` or `wrap_fn()` multiple times, the last occurrence will be executed first.

## Logging

Logging is implemented as a middleware. It is common to register a logging middleware as the first middleware for the application. Logging middleware must be registered for each application.

The `Logger` middleware uses the standard `log` crate to log information. You should enable logger for `actix_web` package to see access log (`env_logger` or similar).

### Usage

Create `Logger` middleware with the specified format. Default `Logger` can be created with `default` method, it uses the default format:

```rust
use actix_web::middleware::Logger;
use env_logger::Env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    use actix_web::{App, HttpServer};
    env_logger::init_from_env(Env::default().default_filter_or("info"));
    HttpServer::new(|| {
        App::new()
            .wrap(Logger::default())
            .wrap(Logger::new("%a %{User-Agent}i"))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

Example log output:

```
INFO:actix_web::middleware::logger: 127.0.0.1:59934 [02/Dec/2017:00:21:43 -0800] "GET / HTTP/1.1" 302 0 "-" "curl/7.54.0" 0.000397
INFO:actix_web::middleware::logger: 127.0.0.1:59947 [02/Dec/2017:00:22:40 -0800] "GET /index.html HTTP/1.1" 200 0 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:57.0) Gecko/20100101 Firefox/57.0" 0.000646
```

### Format

Default format: `%a %t "%r" %s %b "%{Referer}i" "%{User-Agent}i" %T`

| Variable | Description |
|----------|-------------|
| `%%` | The percent sign |
| `%a` | Remote IP-address (IP-address of proxy if using reverse proxy) |
| `%t` | Time when the request was started to process |
| `%P` | The process ID of the child that serviced the request |
| `%r` | First line of request |
| `%s` | Response status code |
| `%b` | Size of response in bytes, including HTTP headers |
| `%T` | Time taken to serve the request, in seconds with floating fraction in .06f format |
| `%D` | Time taken to serve the request, in milliseconds |
| `%{FOO}i` | request.headers['FOO'] |
| `%{FOO}o` | response.headers['FOO'] |
| `%{FOO}e` | os.environ['FOO'] |

## Default Headers

Set default response headers with `DefaultHeaders` middleware. It does not set the header if response headers already contain a specified header.

```rust
use actix_web::{middleware, web, App, HttpResponse, HttpServer};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .wrap(middleware::DefaultHeaders::new().add(("X-Version", "0.2")))
            .service(
                web::resource("/test")
                    .route(web::get().to(HttpResponse::Ok))
            )
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

## User Sessions

Actix Web provides session management via the `actix-session` middleware. It can use multiple backend types to store session data.

By default, only cookie session backend is implemented. `CookieSessionStore` uses cookies as session storage, limited to storing fewer than 4000 bytes of data.

A cookie may have a security policy of **signed** (viewable but not modifiable by client) or **private** (neither viewable nor modifiable by client).

```rust
use actix_session::{Session, SessionMiddleware, storage::CookieSessionStore};
use actix_web::{web, App, Error, HttpResponse, HttpServer, cookie::Key};

async fn index(session: Session) -> Result<HttpResponse, Error> {
    if let Some(count) = session.get::<i32>("counter")? {
        session.insert("counter", count + 1)?;
    } else {
        session.insert("counter", 1)?;
    }
    Ok(HttpResponse::Ok().body(format!(
        "Count is {:?}!",
        session.get::<i32>("counter")?.unwrap()
    )))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .wrap(
                SessionMiddleware::builder(CookieSessionStore::default(), Key::from(&[0; 64]))
                    .cookie_secure(false)
                    .build()
            )
            .service(web::resource("/").to(index))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

## Error Handlers

`ErrorHandlers` middleware allows custom handlers for responses. Register a custom error handler for a specific status code:

```rust
use actix_web::middleware::{ErrorHandlerResponse, ErrorHandlers};
use actix_web::{
    dev, http::{header, StatusCode}, web, App, HttpResponse, HttpServer, Result,
};

fn add_error_header<B>(mut res: dev::ServiceResponse<B>) -> Result<ErrorHandlerResponse<B>> {
    res.response_mut().headers_mut().insert(
        header::CONTENT_TYPE,
        header::HeaderValue::from_static("Error"),
    );
    Ok(ErrorHandlerResponse::Response(res.map_into_left_body()))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .wrap(
                ErrorHandlers::new()
                    .handler(StatusCode::INTERNAL_SERVER_ERROR, add_error_header),
            )
            .service(web::resource("/").route(web::get().to(HttpResponse::InternalServerError)))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

## CORS

Cross-Origin Resource Sharing (CORS) is configured via the `actix-cors` crate.

**Important:** `allowed_origin("*")` is rejected during startup. Use `allow_any_origin()` for wildcard behavior.

### Allow One Frontend Origin

```rust
use actix_cors::Cors;
use actix_web::{http::header, App};

let cors = Cors::default()
    .allowed_origin("https://app.example.com")
    .allowed_methods(vec!["GET", "POST"])
    .allowed_headers(vec![header::AUTHORIZATION, header::CONTENT_TYPE])
    .max_age(3600);

let app = App::new().wrap(cors);
```

### Allow Several Frontend Origins

```rust
let cors = Cors::default()
    .allowed_origin("https://app.example.com")
    .allowed_origin("https://admin.example.com")
    .allowed_methods(vec!["GET", "POST", "DELETE"]);
```

### Allow Any Origin (Public API)

```rust
let cors = Cors::default()
    .allow_any_origin()
    .send_wildcard()
    .allow_any_method()
    .allow_any_header();
```

### Allow Credentials

Use an explicit origin list instead of `*`:

```rust
let cors = Cors::default()
    .allowed_origin("https://app.example.com")
    .supports_credentials()
    .allowed_methods(vec!["GET", "POST"])
    .allowed_headers(vec![header::AUTHORIZATION, header::CONTENT_TYPE]);
```

### Apply CORS to Only One Scope

```rust
let cors = Cors::default()
    .allowed_origin("https://app.example.com")
    .allowed_methods(vec!["GET", "POST"]);

let app = App::new().service(
    web::scope("/api")
        .wrap(cors)
        .route("/health", web::get().to(|| async { "ok" })),
);
```

### Recommended Config Shape

This shape maps cleanly to the actix-cors builder:

```yaml
cors:
  origins: "*"
  methods: [GET, POST, OPTIONS]
  headers: [AUTHORIZATION, ACCEPT, CONTENT-TYPE]
  expose-headers: [X-REQUEST-ID]
  credentials: false
  send-wildcard: true
  max-age: 3600
  block-on-origin-mismatch: false
```

For tighter production settings, prefer an explicit allowlist:

```yaml
cors:
  origins:
    - https://app.example.com
    - https://admin.example.com
  methods: [GET, POST]
  headers: [AUTHORIZATION, CONTENT-TYPE]
  credentials: true
  max-age: 3600
```

### Translating Config Into Cors

Normalize your config into either a single string or a list of strings, then handle `"*"` explicitly:

```rust
use actix_cors::Cors;
use serde::Deserialize;

#[derive(Debug, Clone, Deserialize)]
#[serde(untagged)]
enum OneOrMany {
    One(String),
    Many(Vec<String>),
}

#[derive(Debug, Clone, Deserialize)]
struct CorsSettings {
    origins: Option<OneOrMany>,
    methods: Option<OneOrMany>,
    headers: Option<OneOrMany>,
    #[serde(rename = "expose-headers")]
    expose_headers: Option<OneOrMany>,
    credentials: bool,
    #[serde(rename = "send-wildcard")]
    send_wildcard: bool,
    #[serde(rename = "max-age")]
    max_age: Option<usize>,
    #[serde(rename = "block-on-origin-mismatch")]
    block_on_origin_mismatch: bool,
}

fn cors_from_settings(settings: &CorsSettings) -> Cors {
    let mut cors = Cors::default();
    match settings.origins.as_ref() {
        None => {}
        Some(OneOrMany::One(origin)) if origin == "*" => {
            cors = cors.allow_any_origin();
        }
        Some(OneOrMany::One(origin)) => {
            cors = cors.allowed_origin(origin);
        }
        Some(OneOrMany::Many(origins)) => {
            for origin in origins {
                cors = cors.allowed_origin(origin);
            }
        }
    }
    match settings.methods.as_ref() {
        None => {}
        Some(OneOrMany::One(method)) if method == "*" => {
            cors = cors.allow_any_method();
        }
        Some(OneOrMany::One(method)) => {
            cors = cors.allowed_methods([method.as_str()]);
        }
        Some(OneOrMany::Many(methods)) => {
            cors = cors.allowed_methods(methods.iter().map(String::as_str));
        }
    }
    match settings.headers.as_ref() {
        None => {}
        Some(OneOrMany::One(header)) if header == "*" => {
            cors = cors.allow_any_header();
        }
        Some(OneOrMany::One(header)) => {
            cors = cors.allowed_header(header.as_str());
        }
        Some(OneOrMany::Many(headers)) => {
            cors = cors.allowed_headers(headers.iter().map(String::as_str));
        }
    }
    match settings.expose_headers.as_ref() {
        None => {}
        Some(OneOrMany::One(header)) if header == "*" => {
            cors = cors.expose_any_header();
        }
        Some(OneOrMany::One(header)) => {
            cors = cors.expose_headers([header.as_str()]);
        }
        Some(OneOrMany::Many(headers)) => {
            cors = cors.expose_headers(headers.iter().map(String::as_str));
        }
    }
    if settings.credentials {
        cors = cors.supports_credentials();
    }
    if settings.send_wildcard {
        cors = cors.send_wildcard();
    }
    if let Some(max_age) = settings.max_age {
        cors = cors.max_age(max_age);
    }
    cors.block_on_origin_mismatch(settings.block_on_origin_mismatch)
}
```

### Mapping Rules

- `origins: "*"` maps to `allow_any_origin()`, not `allowed_origin("*")`.
- `methods: "*"` maps to `allow_any_method()`.
- `headers: "*"` maps to `allow_any_header()`.
- A single origin like `https://app.example.com` maps to one `allowed_origin(...)` call.
- A list of origins maps to repeated `allowed_origin(...)` calls.

### Wildcards, Credentials, and Caches

`allow_any_origin()` and `send_wildcard()` are different:

- `allow_any_origin()` accepts any origin.
- `send_wildcard()` changes the response header from echoing the request origin to sending `Access-Control-Allow-Origin: *`.

That distinction matters because credentials and wildcard responses cannot be combined:

```rust
// This configuration fails during startup
let cors = Cors::default()
    .allow_any_origin()
    .supports_credentials()
    .send_wildcard();
```

If your browser clients need cookies or authorization headers, prefer an explicit origin allowlist instead of `*`.

`actix-cors` also enables the `Vary` header by default. Keep that default unless you fully understand the caching implications. It tells CDNs and proxies that the CORS response can change based on request headers.

### When To Use allowed_origin_fn

Most applications should keep CORS static and startup-configured. Use `allowed_origin_fn` only when your allowlist must depend on request data or pattern matching, such as tenant subdomains:

```rust
use actix_cors::Cors;

let cors = Cors::default().allowed_origin_fn(|origin, _req_head| {
    origin.as_bytes().ends_with(b".example.com")
});
```

### Applying CORS To Your App

Once the builder has been created from config, wrap it like any other middleware:

```rust
use actix_cors::Cors;
use actix_web::{App, HttpServer};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let settings = load_settings();
    HttpServer::new(move || {
        App::new()
            .wrap(cors_from_settings(&settings.cors))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

See the [Cors API docs](https://docs.rs/actix-cors/latest/actix_cors/struct.Cors.html) for the full builder surface.
```
