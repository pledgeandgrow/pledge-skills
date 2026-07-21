# URL Dispatch

URL dispatch provides a simple way for mapping URLs to handler code using a simple pattern matching language. If one of the patterns matches the path information associated with a request, a particular handler object is invoked.

A request handler is a function that accepts zero or more parameters that can be extracted from a request (i.e., `impl FromRequest`) and returns a type that can be converted into an `HttpResponse` (i.e., `impl Responder`).

## Resource Configuration

Resource contains a set of routes. Each route in turn has a set of guards and a handler. New routes can be created with `Resource::route()` method. By default the route does not contain any guards, so matches all requests.

```rust
App::new().service(
    web::resource("/path").route(
        web::route()
            .guard(guard::Get())
            .guard(guard::Header("content-type", "text/plain"))
            .to(HttpResponse::Ok),
    ),
)
```

Route configuration methods:

- `Route::guard()` — registers a new guard. Any number of guards can be registered.
- `Route::method()` — registers a method guard.
- `Route::to()` — registers an async handler function. Only one handler can be registered.

## Route Matching

When a request enters the system, for each resource configuration declaration, actix checks the request's path against the pattern declared. This checking happens in the order that the routes were declared via `App::service()`. If resource can not be found, the default resource is used.

If any guard returns `false` during a check, that route is skipped and route matching continues through the ordered set of routes. If no route matches, a NOT FOUND response is returned.

## Resource Pattern Syntax

The pattern used in route configuration may start with a slash character. If it does not, an implicit slash will be prepended.

A variable part (replacement marker) is specified in the form `{identifier}`, which matches any characters up to the next slash character.

```
foo/{baz}/{bar}
```

Matches:

- `foo/1/2` -> `Params {'baz': '1', 'bar': '2'}`
- `foo/abc/def` -> `Params {'baz': 'abc', 'bar': 'def'}`

Does not match:

- `foo/1/2/` — trailing slash
- `bar/abc/def` — first segment literal mismatch

### Tail Match

Custom regex can be used for tail matching:

```
foo/{bar}/{tail:.*}
```

Matches:

- `foo/1/2/` -> `Params {'bar': '1', 'tail': '2/'}`
- `foo/abc/def/a/b/c` -> `Params {'bar': 'abc', 'tail': 'def/a/b/c'}`

### Regex in Replacement Markers

Replacement markers can specify a regular expression:

- `{foo}` is equivalent to `{foo:[^/]+}`
- `{foo:\d+}` matches only digits

### URL Decoding

Path will be URL-unquoted and decoded into valid unicode string before matching pattern. Values representing matched path segments will be URL-unquoted too.

Use decoded values in patterns:

```
/Foo Bar/{baz}
```

Not:

```
/Foo%20Bar/{baz}
```

## Scoping Routes

Scoping helps you organize routes sharing common root paths. You can nest scopes within scopes.

```rust
#[get("/show")]
async fn show_users() -> HttpResponse {
    HttpResponse::Ok().body("Show users")
}

#[get("/show/{id}")]
async fn user_detail(path: web::Path<(u32,)>) -> HttpResponse {
    HttpResponse::Ok().body(format!("User detail: {}", path.into_inner().0))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new().service(
            web::scope("/users")
                .service(show_users)
                .service(user_detail),
        )
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

## Match Information

All values representing matched path segments are available in `HttpRequest::match_info`. Specific values can be retrieved with `Path::get()`.

```rust
use actix_web::{get, App, HttpRequest, HttpServer, Result};

#[get("/a/{v1}/{v2}/")]
async fn index(req: HttpRequest) -> Result<String> {
    let v1: u8 = req.match_info().get("v1").unwrap().parse().unwrap();
    let v2: u8 = req.match_info().query("v2").parse().unwrap();
    let (v3, v4): (u8, u8) = req.match_info().load().unwrap();
    Ok(format!("Values {} {} {} {}", v1, v2, v3, v4))
}
```

### Path Information Extractor

`Path` extracts information — the destination type can be defined as a tuple or a struct implementing `serde::Deserialize`.

**Tuple approach:**

```rust
use actix_web::{get, web, App, HttpServer, Result};

#[get("/{username}/{id}/index.html")]
async fn index(info: web::Path<(String, u32)>) -> Result<String> {
    let info = info.into_inner();
    Ok(format!("Welcome {}! id: {}", info.0, info.1))
}
```

**Struct approach with serde:**

```rust
use actix_web::{get, web, App, HttpServer, Result};
use serde::Deserialize;

#[derive(Deserialize)]
struct Info {
    username: String,
}

#[get("/{username}/index.html")]
async fn index(info: web::Path<Info>) -> Result<String> {
    Ok(format!("Welcome {}!", info.username))
}
```

## Generating Resource URLs

Use `HttpRequest::url_for()` to generate URLs based on resource patterns:

```rust
use actix_web::{get, guard, http::header, HttpRequest, HttpResponse, Result};

#[get("/test/")]
async fn index(req: HttpRequest) -> Result<HttpResponse> {
    let url = req.url_for("foo", ["1", "2", "3"])?;
    Ok(HttpResponse::Found()
        .insert_header((header::LOCATION, url.as_str()))
        .finish())
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    use actix_web::{web, App, HttpServer};
    HttpServer::new(|| {
        App::new()
            .service(
                web::resource("/test/{a}/{b}/{c}")
                    .name("foo")
                    .guard(guard::Get())
                    .to(HttpResponse::Ok),
            )
            .service(index)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

`url_for()` can only be called for named resources.

## External Resources

Resources that are valid URLs can be registered as external resources. They are useful for URL generation only and are never considered for matching at request time.

```rust
use actix_web::{get, App, HttpRequest, HttpServer, Responder};

#[get("/")]
async fn index(req: HttpRequest) -> impl Responder {
    let url = req.url_for("youtube", ["oHg5SJYRHA0"]).unwrap();
    url.to_string()
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(index)
            .external_resource("youtube", "https://youtube.com/watch/{video_id}")
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

## Path Normalization

By normalizing:

- Add a trailing slash to the path.
- Replace multiple slashes with one.

The handler returns as soon as it finds a path that resolves correctly.

```rust
use actix_web::{middleware, web, App, HttpResponse, HttpServer};

async fn index() -> HttpResponse {
    HttpResponse::Ok().body("Hello")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .wrap(middleware::NormalizePath::default())
            .route("/resource/", web::to(index))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

`//resource///` will be redirected to `/resource/`.

Register path normalization only for GET requests:

```rust
use actix_web::{http::Method, middleware, web, App, HttpServer};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .wrap(middleware::NormalizePath::default())
            .service(index)
            .default_service(web::route().method(Method::GET))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

## Custom Route Guard

A guard is any object that implements the `Guard` trait:

```rust
use actix_web::{
    guard::{Guard, GuardContext},
    http, HttpResponse,
};

struct ContentTypeHeader;

impl Guard for ContentTypeHeader {
    fn check(&self, req: &GuardContext) -> bool {
        req.head()
            .headers()
            .contains_key(http::header::CONTENT_TYPE)
    }
}
```

Guards cannot access or modify the request object, but can store extra information in request extensions.

## Changing the Default Not Found Response

Override the NOT FOUND response with `App::default_service()`:

```rust
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(web::resource("/").route(web::get().to(index)))
            .default_service(
                web::route()
                    .guard(guard::Not(guard::Get()))
                    .to(HttpResponse::MethodNotAllowed),
            )
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```
