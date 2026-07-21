# Handlers, Requests, and Responses

## Request Handlers

A request handler is an async function that accepts zero or more parameters that can be extracted from a request (i.e., `impl FromRequest`) and returns a type that can be converted into an `HttpResponse` (i.e., `impl Responder`).

Request handling happens in two stages:
1. The handler object is called, returning any object that implements the `Responder` trait.
2. `respond_to()` is called on the returned object, converting itself to an `HttpResponse` or `Error`.

By default Actix Web provides `Responder` implementations for standard types such as `&'static str`, `String`, etc.

```rust
async fn index(_req: HttpRequest) -> &'static str {
    "Hello world!"
}

async fn index(_req: HttpRequest) -> String {
    "Hello world!".to_owned()
}

async fn index(_req: HttpRequest) -> impl Responder {
    web::Bytes::from_static(b"Hello world!")
}
```

## Response with Custom Type

To return a custom type directly from a handler, the type needs to implement the `Responder` trait.

```rust
use actix_web::{
    body::BoxBody,
    http::header::ContentType,
    HttpRequest, HttpResponse, Responder,
};
use serde::Serialize;

#[derive(Serialize)]
struct MyObj {
    name: &'static str,
}

impl Responder for MyObj {
    type Body = BoxBody;

    fn respond_to(self, _req: &HttpRequest) -> HttpResponse<Self::Body> {
        let body = serde_json::to_string(&self).unwrap();
        HttpResponse::Ok()
            .content_type(ContentType::json())
            .body(body)
    }
}

async fn index() -> impl Responder {
    MyObj { name: "user" }
}
```

## Streaming Response Body

Response body can be generated asynchronously. The body must implement `Stream<Item = Result<Bytes, Error>>`:

```rust
use actix_web::{get, web, App, Error, HttpResponse, HttpServer};
use futures::{future::ok, stream::once};

#[get("/stream")]
async fn stream() -> HttpResponse {
    let body = once(ok::<_, Error>(web::Bytes::from_static(b"test")));
    HttpResponse::Ok()
        .content_type("application/json")
        .streaming(body)
}
```

## Different Return Types (Either)

The `Either` type allows combining two different responder types into a single type:

```rust
use actix_web::{Either, Error, HttpResponse};

type RegisterResult = Either<HttpResponse, Result<&'static str, Error>>;

async fn index() -> RegisterResult {
    if is_a_variant() {
        Either::Left(HttpResponse::BadRequest().body("Bad data"))
    } else {
        Either::Right(Ok("Hello!"))
    }
}
```

## Response

A builder-like pattern is used to construct an instance of `HttpResponse`. `HttpResponse` provides several methods that return a `HttpResponseBuilder` instance.

The methods `.body()`, `.finish()`, and `.json()` finalize response creation and return a constructed `HttpResponse` instance. If these methods are called on the same builder instance multiple times, the builder will panic.

```rust
use actix_web::{http::header::ContentType, HttpResponse};

async fn index() -> HttpResponse {
    HttpResponse::Ok()
        .content_type(ContentType::plaintext())
        .insert_header(("X-Hdr", "sample"))
        .body("data")
}
```

## JSON Response

The `Json` type allows responding with well-formed JSON data. Return a value of type `Json<T>` where `T` implements `Serialize`.

```rust
use actix_web::{get, web, Responder, Result};
use serde::Serialize;

#[derive(Serialize)]
struct MyObj {
    name: String,
}

#[get("/a/{name}")]
async fn index(name: web::Path<String>) -> Result<impl Responder> {
    let obj = MyObj { name: name.to_string() };
    Ok(web::Json(obj))
}
```

Using `Json` type instead of `.json()` method on `HttpResponse` makes it immediately clear that the function returns JSON.

## Content Encoding

Actix Web can automatically compress payloads with the `Compress` middleware. Supported codecs:

- Brotli
- Gzip
- Deflate
- Identity

A response's `Content-Encoding` header defaults to `ContentEncoding::Auto`, which performs automatic content compression negotiation based on the request's `Accept-Encoding` header.

```rust
use actix_web::{get, middleware, App, HttpResponse, HttpServer};

#[get("/")]
async fn index() -> HttpResponse {
    HttpResponse::Ok().body("data")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .wrap(middleware::Compress::default())
            .service(index)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

Disable compression on a specific handler:

```rust
use actix_web::{get, http::header::ContentEncoding, HttpResponse};

#[get("/")]
async fn index() -> HttpResponse {
    HttpResponse::Ok()
        .insert_header(ContentEncoding::Identity)
        .body("data")
}
```

Serve pre-compressed assets by setting `Content-Encoding` manually:

```rust
#[get("/")]
async fn index() -> HttpResponse {
    HttpResponse::Ok()
        .insert_header(ContentEncoding::Gzip)
        .body(HELLO_WORLD) // pre-compressed gzip bytes
}
```

## JSON Request

There are several options for JSON body deserialization.

**Using `Json` extractor:**

```rust
use actix_web::{web, App, HttpServer, Result};
use serde::Deserialize;

#[derive(Deserialize)]
struct Info {
    username: String,
}

async fn index(info: web::Json<Info>) -> Result<String> {
    Ok(format!("Welcome {}!", info.username))
}
```

**Manual payload loading and deserialization:**

```rust
use actix_web::{error, post, web, App, Error, HttpResponse};
use futures::StreamExt;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct MyObj {
    name: String,
    number: i32,
}

const MAX_SIZE: usize = 262_144; // 256k

#[post("/")]
async fn index_manual(mut payload: web::Payload) -> Result<HttpResponse, Error> {
    let mut body = web::BytesMut::new();
    while let Some(chunk) = payload.next().await {
        let chunk = chunk?;
        if (body.len() + chunk.len()) > MAX_SIZE {
            return Err(error::ErrorBadRequest("overflow"));
        }
        body.extend_from_slice(&chunk);
    }
    let obj = serde_json::from_slice::<MyObj>(&body)?;
    Ok(HttpResponse::Ok().json(obj))
}
```

Accept arbitrary valid JSON using `serde_json::Value` as type `T`.

## Content Encoding (Request)

Actix Web automatically decompresses payloads. Supported codecs:

- Brotli
- Gzip
- Deflate
- Zstd

If request headers contain a `Content-Encoding` header, the request payload is decompressed accordingly. Multiple codecs are not supported (e.g., `Content-Encoding: br, gzip`).

## Chunked Transfer Encoding

Actix automatically decodes chunked encoding. The `web::Payload` extractor already contains the decoded byte stream.

## Multipart Body

Actix Web provides multipart stream support with the external `actix-multipart` crate.

## Urlencoded Body

Actix Web supports `application/x-www-form-urlencoded` encoded bodies with the `web::Form` extractor. The type must implement `Deserialize` from serde.

The UrlEncoded future can resolve into an error in several cases:

- Content type is not `application/x-www-form-urlencoded`
- Transfer encoding is chunked
- Content-length is greater than 256k
- Payload terminates with error

## Streaming Request

`HttpRequest` is a stream of `Bytes` objects. It can be used to read the request body payload:

```rust
use actix_web::{get, web, Error, HttpResponse};
use futures::StreamExt;

#[get("/")]
async fn index(mut body: web::Payload) -> Result<HttpResponse, Error> {
    let mut bytes = web::BytesMut::new();
    while let Some(item) = body.next().await {
        let item = item?;
        println!("Chunk: {:?}", &item);
        bytes.extend_from_slice(&item);
    }
    Ok(HttpResponse::Ok().finish())
}
```
