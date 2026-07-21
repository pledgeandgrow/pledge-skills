# Axum — API Reference

## Routing

### Router

`Router` is the central type used to set up which paths go to which services.

```rust
use axum::{Router, routing::get};

let app = Router::new()
    .route("/", get(root))
    .route("/foo", get(get_foo).post(post_foo))
    .route("/foo/bar", get(foo_bar));
```

### Path Syntax

- **Static**: `/`, `/foo`, `/users/123` — exact match
- **Captures**: `/{key}` — matches any single segment, stored at `key`
  - `/{id}`, `/users/{id}`, `/users/{id}/tweets`
- **Wildcards**: `/{*key}` — matches all remaining segments
  - `/{*key}`, `/assets/{*path}`, `/{id}/{repo}/{*tree}`
  - `/{*key}` does NOT match `/` but matches `/a`, `/a/`, etc.
  - Leading slash is not included in the captured value

### Route Methods

All HTTP method routing functions:

| Function | HTTP Method |
|----------|-------------|
| `get()` | GET |
| `post()` | POST |
| `put()` | PUT |
| `delete()` | DELETE |
| `patch()` | PATCH |
| `head()` | HEAD |
| `options()` | OPTIONS |
| `connect()` | CONNECT |
| `trace()` | TRACE |
| `any()` | Any method |
| `on(method_filter, handler)` | Specific method via `MethodFilter` |

### Method Chaining

```rust
use axum::{Router, routing::{get, post, delete}};

let app = Router::new()
    .route("/", get(get_root).post(post_root).delete(delete_root));

// Or add one by one:
let app = Router::new()
    .route("/", get(get_root))
    .route("/", post(post_root))
    .route("/", delete(delete_root));
```

### Service-Based Routing

```rust
use axum::{Router, routing::any_service, body::Body, extract::Request};
use tower::service_fn;
use http::Response;
use std::convert::Infallible;

let app = Router::new().route(
    "/",
    any_service(service_fn(|_: Request| async {
        let res = Response::new(Body::from("Hi from GET /"));
        Ok::<_, Infallible>(res)
    })),
);
```

Use `route_service` for services with `BoxBody` response:

```rust
let app = Router::new().route_service(
    "/static/Cargo.toml",
    ServeFile::new("Cargo.toml"),
);
```

### Nesting

Nest a `Router` at some path to compose smaller pieces:

```rust
let user_routes = Router::new().route("/{id}", get(get_user));
let team_routes = Router::new().route("/", post(create_team));

let api_routes = Router::new()
    .nest("/users", user_routes)
    .nest("/teams", team_routes);

let app = Router::new().nest("/api", api_routes);
// GET /api/users/{id}
// POST /api/teams
```

**Key behaviors**:
- Nested routes have the matched prefix stripped from the URI. Use `OriginalUri` to get the original.
- Captures from outer routes are available to nested handlers.
- Nested routers inherit the fallback from the outer router unless they have their own.
- Panics if path contains a wildcard or is empty.

### Merging

```rust
let user_routes = Router::new()
    .route("/users", get(users_list))
    .route("/users/{id}", get(users_show));

let team_routes = Router::new()
    .route("/teams", get(teams_list));

let app = Router::new()
    .merge(user_routes)
    .merge(team_routes);
```

- Both routers must have the same state type.
- Only one router can have a fallback (panics if both do).
- Use `reset_fallback()` to remove a fallback before merging.

### Fallback

```rust
use axum::{http::StatusCode, handler::Handler};

let app = Router::new()
    .route("/foo", get(|| async {}))
    .fallback(|| async { (StatusCode::NOT_FOUND, "Not Found") });
```

- Fallback is called when no route matches.
- If a route matches but the method doesn't, `method_not_allowed_fallback` is used instead.
- For accepting all requests without routing overhead, use `handler.into_make_service()` directly.

### Method Not Allowed Fallback

```rust
let app = Router::new()
    .route("/", get(hello_world))
    .fallback(default_fallback)
    .method_not_allowed_fallback(handle_405);
```

### Router<S> Type Parameter

`Router<S>` means a router that is **missing** a state of type `S`. Calling `.with_state(s)` provides that state and typically produces `Router<()>`, which is the only form that can be passed to `serve()`.

```rust
// Missing AppState
let router: Router<AppState> = Router::new()
    .route("/", get(|_: State<AppState>| async {}));

// State provided, now Router<()>
let router: Router<()> = router.with_state(AppState {});

// Can now serve
axum::serve(listener, router).await.unwrap();
```

`with_state` doesn't always return `Router<()>` — you can chain different state types:

```rust
let router: Router<String> = router.with_state(AppState {})
    .route("/needs-string", get(|_: State<String>| async {}));

let final_router: Router<()> = router.with_state("foo".to_owned());
```

### without_v07_checks

Turn off compatibility checks for v0.7 route syntax (colon `:` and asterisk `*` paths):

```rust
let app = Router::<()>::new()
    .without_v07_checks()
    .route("/:colon", get(|| async {}))
    .route("/*asterisk", get(|| async {}));
```

### Key Router Methods

| Method | Description |
|--------|-------------|
| `new()` | Create empty router (404 for all requests) |
| `route(path, method_router)` | Add a route |
| `route_service(path, service)` | Route to a `Service` |
| `nest(path, router)` | Nest a router at a path |
| `nest_service(path, service)` | Like nest but accepts any Service |
| `merge(other)` | Merge two routers |
| `layer(layer)` | Apply middleware to all existing routes |
| `route_layer(layer)` | Apply middleware only if route matches |
| `fallback(handler)` | Set fallback handler |
| `fallback_service(service)` | Set fallback service |
| `method_not_allowed_fallback(handler)` | Handler for 405 cases |
| `with_state(state)` | Provide state, returns `Router<S2>` |
| `has_routes()` | Check if router has any routes |
| `reset_fallback()` | Reset fallback to default |
| `without_v07_checks()` | Disable v0.7 path syntax checks |

---

## Handlers

A handler is an async function that accepts zero or more extractors as arguments and returns something that implements `IntoResponse`.

### Handler Requirements

- Must be async functions
- Take no more than 16 arguments that all implement `Send`
- All except the last argument implement `FromRequestParts`
- The last argument implements `FromRequest`
- Returns something that implements `IntoResponse`
- If a closure is used, it must implement `Clone + Send` and be `'static`
- Returns a future that is `Send`

### Debugging Handler Type Errors

When a function doesn't match the `Handler` trait, Rust gives poor error messages. Use `#[debug_handler]` from `axum-macros` to improve errors:

```rust
use axum::debug_handler;

#[debug_handler]
async fn handler(state: State<AppState>, body: String) -> impl IntoResponse {
    // ...
}
```

### Handler::layer

Apply middleware to individual handlers:

```rust
use axum::handler::Handler;

let app = Router::new()
    .route("/", get(handler.layer(TraceLayer::new_for_http())));
```

---

## Extractors

Extractors are types that implement `FromRequest` or `FromRequestParts`. They pick apart the incoming request to get the parts your handler needs.

### Common Extractors

| Extractor | What It Does | Trait |
|-----------|-------------|-------|
| `Path<T>` | Path parameters, deserialized via serde | `FromRequestParts` |
| `Query<T>` | Query parameters, deserialized via serde | `FromRequestParts` |
| `Json<T>` | Request body as JSON | `FromRequest` |
| `Form<T>` | Request body as form-encoded | `FromRequest` |
| `String` | Request body as UTF-8 string | `FromRequest` |
| `Bytes` | Raw request body | `FromRequest` |
| `HeaderMap` | All request headers | `FromRequestParts` |
| `State<T>` | Application state | `FromRequestParts` |
| `Extension<T>` | Request extension | `FromRequestParts` |
| `Request` | Full request for maximum control | `FromRequest` |
| `Method` | HTTP method | `FromRequestParts` |
| `Uri` | Request URI | `FromRequestParts` |
| `OriginalUri` | Original URI (before nesting strips) | `FromRequestParts` |
| `MatchedPath` | The matched route path | `FromRequestParts` |
| `ConnectInfo` | Connection info (TCP addr) | `FromRequestParts` |
| `Multipart` | Multipart form data | `FromRequest` |
| `WebSocketUpgrade` | WebSocket upgrade | `FromRequestParts` |
| `RawForm` | Raw form body | `FromRequest` |
| `RawQuery` | Raw query string | `FromRequestParts` |
| `RawPathParams` | Raw path params | `FromRequestParts` |
| `NestedPath` | The nested path prefix | `FromRequestParts` |

### Multiple Extractors

```rust
use axum::extract::{Path, Query};
use uuid::Uuid;

#[derive(serde::Deserialize)]
struct Pagination { page: usize, per_page: usize }

async fn get_user_things(
    Path(user_id): Path<Uuid>,
    Query(pagination): Query<Pagination>,
) { /* ... */ }
```

### Order of Extractors

Extractors run left to right. The request body can only be consumed once, so body-consuming extractors must be the **last** argument:

```rust
async fn handler(
    method: Method,           // OK, doesn't consume body
    headers: HeaderMap,        // OK, doesn't consume body
    State(state): State<AppState>, // OK, doesn't consume body
    body: String,              // MUST be last — consumes body
) { /* ... */ }
```

You cannot consume the request body twice:

```rust
// ERROR: String and Json both consume the body
async fn handler(string_body: String, json_body: Json<Payload>) {}
```

### Handling Extractor Rejections

Wrap in `Result<T, T::Rejection>` to handle failures:

```rust
use axum::extract::{Json, rejection::JsonRejection};

async fn create_user(payload: Result<Json<Value>, JsonRejection>) {
    match payload {
        Ok(Json(payload)) => { /* valid JSON */ }
        Err(JsonRejection::MissingJsonContentType(_)) => { /* no content-type */ }
        Err(JsonRejection::JsonDataError(_)) => { /* deserialization error */ }
        Err(JsonRejection::JsonSyntaxError(_)) => { /* syntax error */ }
        Err(JsonRejection::BytesRejection(_)) => { /* body extraction failed */ }
        Err(_) => { /* catch-all (non_exhaustive) */ }
    }
}
```

### Optional Extractors

Some extractors implement `OptionalFromRequest` / `OptionalFromRequestParts`, allowing use inside `Option`:

```rust
use axum_extra::{headers::UserAgent, TypedHeader};

async fn foo(user_agent: Option<TypedHeader<UserAgent>>) {
    if let Some(TypedHeader(user_agent)) = user_agent {
        // Client sent user agent
    } else {
        // No user agent header
    }
}
```

### Customizing Extractor Responses

1. Use `Result<T, T::Rejection>` for per-handler customization
2. Create a custom extractor that wraps a built-in and returns a different rejection response

### Custom Extractors

#### FromRequestParts (no body access)

```rust
use axum::{
    extract::FromRequestParts,
    http::{StatusCode, header::{HeaderValue, USER_AGENT}, request::Parts},
};

struct ExtractUserAgent(HeaderValue);

impl<S> FromRequestParts<S> for ExtractUserAgent
where S: Send + Sync,
{
    type Rejection = (StatusCode, &'static str);

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        if let Some(user_agent) = parts.headers.get(USER_AGENT) {
            Ok(ExtractUserAgent(user_agent.clone()))
        } else {
            Err((StatusCode::BAD_REQUEST, "`User-Agent` header is missing"))
        }
    }
}
```

#### FromRequest (with body access)

```rust
use axum::{
    extract::{Request, FromRequest},
    response::{Response, IntoResponse},
    body::Bytes,
};

struct ValidatedBody(Bytes);

impl<S> FromRequest<S> for ValidatedBody
where Bytes: FromRequest<S>, S: Send + Sync,
{
    type Rejection = Response;

    async fn from_request(req: Request, state: &S) -> Result<Self, Self::Rejection> {
        let body = Bytes::from_request(req, state)
            .await
            .map_err(IntoResponse::into_response)?;
        // do validation...
        Ok(Self(body))
    }
}
```

### Wrapping Extractors

To generically wrap another extractor, implement both `FromRequest` and `FromRequestParts`:

```rust
struct Timing<E> { extractor: E, duration: Duration }

impl<S, T> FromRequestParts<S> for Timing<T>
where S: Send + Sync, T: FromRequestParts<S>,
{
    type Rejection = T::Rejection;
    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let start = Instant::now();
        let extractor = T::from_request_parts(parts, state).await?;
        Ok(Timing { extractor, duration: start.elapsed() })
    }
}

impl<S, T> FromRequest<S> for Timing<T>
where S: Send + Sync, T: FromRequest<S>,
{
    type Rejection = T::Rejection;
    async fn from_request(req: Request, state: &S) -> Result<Self, Self::Rejection> {
        let start = Instant::now();
        let extractor = T::from_request(req, state).await?;
        Ok(Timing { extractor, duration: start.elapsed() })
    }
}
```

### Accessing Other Extractors in Custom Implementations

```rust
use axum::RequestPartsExt;

impl<S> FromRequestParts<S> for AuthenticatedUser
where S: Send + Sync,
{
    type Rejection = Response;

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        // Call directly
        let headers = HeaderMap::from_request_parts(parts, state).await.map_err(|err| match err {})?;
        // Or use extract
        let Extension(state) = parts.extract::<Extension<State>>().await.map_err(|e| e.into_response())?;
        unimplemented!()
    }
}
```

### Request Body Limits

By default, `Bytes`, `String`, `Json`, and `Form` do not accept bodies larger than **2MB**. Use `DefaultBodyLimit` to change or disable:

```rust
use axum::extract::DefaultBodyLimit;

// Disable limit
let app = Router::new().layer(DefaultBodyLimit::disable());

// Set custom limit
let app = Router::new().layer(DefaultBodyLimit::max(1024 * 1024 * 5)); // 5MB
```

### Logging Rejections

All built-in extractors log rejections. Enable with:

```sh
RUST_LOG=info,axum::rejection=trace cargo run
```

---

## Responses

Anything that implements `IntoResponse` can be returned from handlers.

### Built-in IntoResponse Implementations

| Type | Content-Type | Notes |
|------|-------------|-------|
| `()` | — | Empty response, 200 OK |
| `&'static str` | `text/plain; charset=utf-8` | 200 OK |
| `String` | `text/plain; charset=utf-8` | 200 OK |
| `Vec<u8>` | `application/octet-stream` | 200 OK |
| `Json<T>` | `application/json` | T: `serde::Serialize` |
| `Html<&'static str>` | `text/html` | — |
| `StatusCode` | — | Empty body with status |
| `HeaderMap` | — | Empty body with headers |
| `[(HeaderName, &'static str); N]` | — | Empty body with headers |
| `Response` | — | Full control |

### Tuple Responses

Build complex responses from parts. T1..Tn must implement `IntoResponseParts`:

```rust
// (StatusCode, impl IntoResponse)
async fn handler() -> (StatusCode, &'static str) {
    (StatusCode::OK, "Hello!")
}

// (StatusCode, headers, body)
async fn handler() -> (StatusCode, [(HeaderName, &'static str); 1], &'static str) {
    (StatusCode::OK, [("x-foo", "bar")], "Hello!")
}
```

`IntoResponseParts` only allows setting headers and extensions — you cannot accidentally override the status or body.

### Low-Level Response

```rust
use axum::{body::Body, response::Response, http::StatusCode};

async fn handler() -> Response {
    Response::builder()
        .status(StatusCode::NOT_FOUND)
        .header("x-foo", "custom header")
        .body(Body::from("not found"))
        .unwrap()
}
```

### Returning Different Response Types

Use `.into_response()` to convert different types into `Response`:

```rust
use axum::{response::{IntoResponse, Redirect, Response}, http::StatusCode};

async fn handle() -> Response {
    if something() {
        "All good!".into_response()
    } else if something_else() {
        (StatusCode::INTERNAL_SERVER_ERROR, "Something went wrong...").into_response()
    } else {
        Redirect::to("/").into_response()
    }
}
```

### impl IntoResponse Caveats

- Can only return a single type (no branching with different types)
- Can cause type inference issues with `Result` and `?`
- Use concrete error types like `Result<impl IntoResponse, StatusCode>` instead of `Result<impl IntoResponse, impl IntoResponse>`

### IntoResponseParts

Implement `IntoResponseParts` to create custom response parts (headers/extensions):

```rust
use axum::response::{IntoResponseParts, ResponseParts};

struct CustomHeader;

impl IntoResponseParts for CustomHeader {
    type Error = std::convert::Infallible;

    fn into_response_parts(self, mut parts: ResponseParts) -> Result<ResponseParts, Self::Error> {
        parts.headers.insert("x-custom", "value".parse().unwrap());
        Ok(parts)
    }
}
```

---

## Error Handling

### Axum's Error Handling Model

Axum is based on `tower::Service` which has an associated `Error` type. Axum requires all services to have `Infallible` as their error type. This means:

- Handlers always produce a response
- `Result<T, E>` where `E: IntoResponse` is not an "error" — `Err(e)` becomes a response
- Extractor rejections produce responses without calling the handler

```rust
use axum::http::StatusCode;

async fn handler() -> Result<String, StatusCode> {
    // Err(StatusCode::NOT_FOUND) is NOT an error — it becomes a 404 response
    Ok("Hello".to_string())
}
```

### Custom Error Types

Use intermediate error types that convert to `Response` to use `?` in handlers:

```rust
use axum::{
    response::{IntoResponse, Response},
    http::StatusCode,
};

enum AppError {
    NotFound,
    InternalError(String),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        match self {
            AppError::NotFound => (StatusCode::NOT_FOUND, "Not Found").into_response(),
            AppError::InternalError(msg) => {
                (StatusCode::INTERNAL_SERVER_ERROR, msg).into_response()
            }
        }
    }
}

async fn handler() -> Result<String, AppError> {
    do_something()?;
    Ok("Success".to_string())
}

fn do_something() -> Result<(), AppError> {
    Err(AppError::NotFound)
}
```

### Anyhow Error Handling

```rust
use axum::{response::{IntoResponse, Response}, http::StatusCode};

struct AppError(anyhow::Error);

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        (StatusCode::INTERNAL_SERVER_ERROR, format!("Something went wrong: {}", self.0))
            .into_response()
    }
}

impl<E: Into<anyhow::Error>> From<E> for AppError {
    fn from(err: E) -> Self {
        Self(err.into())
    }
}

async fn handler() -> Result<String, AppError> {
    something_that_might_fail()?;
    Ok("OK".to_string())
}
```

### Routing to Fallible Services

Use `HandleError` to convert service errors into responses:

```rust
use axum::{Router, body::Body, http::{Request, Response, StatusCode}, error_handling::HandleError};

let some_fallible_service = tower::service_fn(|_req| async {
    Ok::<_, anyhow::Error>(Response::new(Body::empty()))
});

let app = Router::new().route_service(
    "/",
    HandleError::new(some_fallible_service, handle_anyhow_error),
);

async fn handle_anyhow_error(err: anyhow::Error) -> (StatusCode, String) {
    (StatusCode::INTERNAL_SERVER_ERROR, format!("Something went wrong: {err}"))
}
```

### Applying Fallible Middleware

Use `HandleErrorLayer` for middleware that might produce errors:

```rust
use axum::{Router, BoxError, routing::get, http::StatusCode, error_handling::HandleErrorLayer};
use std::time::Duration;
use tower::ServiceBuilder;

let app = Router::new()
    .route("/", get(|| async {}))
    .layer(
        ServiceBuilder::new()
            .layer(HandleErrorLayer::new(handle_timeout_error))
            .timeout(Duration::from_secs(30))
    );

async fn handle_timeout_error(err: BoxError) -> (StatusCode, String) {
    if err.is::<tower::timeout::error::Elapsed>() {
        (StatusCode::REQUEST_TIMEOUT, "Request took too long".to_string())
    } else {
        (StatusCode::INTERNAL_SERVER_ERROR, format!("Unhandled internal error: {err}"))
    }
}
```

---

## Middleware

Axum doesn't have its own middleware system — it uses Tower's `Layer` and `Service`.

### Applying Middleware

Middleware can be added at multiple levels:
- **Router**: `Router::layer()` and `Router::route_layer()`
- **MethodRouter**: `MethodRouter::layer()` and `MethodRouter::route_layer()`
- **Handler**: `Handler::layer()`

```rust
use axum::{routing::get, Router};
use tower_http::trace::TraceLayer;

let app = Router::new()
    .route("/foo", get(|| async {}))
    .route("/bar", get(|| async {}))
    .layer(TraceLayer::new_for_http());
```

### route_layer vs layer

- `layer()`: Applies to all existing routes, runs even if no route matches (after routing)
- `route_layer()`: Only runs if a request matches a route (useful for auth — avoids converting 404 to 401)

```rust
use tower_http::validate_request::ValidateRequestHeaderLayer;

let app = Router::new()
    .route("/foo", get(|| async {}))
    .route_layer(ValidateRequestHeaderLayer::bearer("password"));
// GET /foo with invalid token → 401
// GET /not-found with invalid token → 404 (route_layer didn't run)
```

### Ordering

Middleware added with `Router::layer` executes bottom-to-top (last added runs first):

```rust
let app = Router::new()
    .route("/", get(handler))
    .layer(layer_one)    // runs third on request
    .layer(layer_two)    // runs second on request
    .layer(layer_three); // runs first on request
```

With `tower::ServiceBuilder`, middleware runs top-to-bottom (first added runs first):

```rust
use tower::ServiceBuilder;

let app = Router::new()
    .route("/", get(handler))
    .layer(
        ServiceBuilder::new()
            .layer(layer_one)    // runs first on request
            .layer(layer_two)    // runs second
            .layer(layer_three), // runs third
    );
```

`ServiceBuilder` is recommended for multiple middleware.

### Writing Middleware

#### from_fn (async/await syntax)

```rust
use axum::{
    middleware::{self, Next},
    extract::Request,
    response::Response,
    http::StatusCode,
};

async fn auth(req: Request, next: Next) -> Result<Response, StatusCode> {
    if req.headers().contains_key("authorization") {
        Ok(next.run(req).await)
    } else {
        Err(StatusCode::UNAUTHORIZED)
    }
}

let app = Router::new()
    .route("/", get(handler))
    .layer(middleware::from_fn(auth));
```

#### from_fn_with_state (state in middleware)

```rust
use axum::middleware::from_fn_with_state;

async fn my_middleware(state: MyState, req: Request, next: Next) -> Response {
    // use state
    next.run(req).await
}

let app = Router::new()
    .route("/", get(handler))
    .layer(from_fn_with_state(my_state, my_middleware));
```

#### from_extractor

```rust
use axum::middleware::from_extractor;

let app = Router::new()
    .route("/", get(handler))
    .layer(from_extractor::<MyExtractor>());
```

Use when a type is sometimes an extractor and sometimes middleware.

#### map_request / map_response

```rust
use axum::middleware::{map_request, map_response};

let app = Router::new()
    .route("/", get(handler))
    .layer(map_request(|req: Request| async { req }))
    .layer(map_response(|res: Response| async { res }));
```

#### Custom tower::Layer

```rust
use tower::{Layer, Service};
use std::task::{Context, Poll};

#[derive(Clone)]
struct MyLayer { state: AppState }

impl<S> Layer<S> for MyLayer {
    type Service = MyService<S>;
    fn layer(&self, inner: S) -> Self::Service {
        MyService { inner, state: self.state.clone() }
    }
}

#[derive(Clone)]
struct MyService<S> { inner: S, state: AppState }

impl<S, B> Service<Request<B>> for MyService<S>
where S: Service<Request<B>>,
{
    type Response = S::Response;
    type Error = S::Error;
    type Future = S::Future;

    fn poll_ready(&mut self, cx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        self.inner.poll_ready(cx)
    }

    fn call(&mut self, req: Request<B>) -> Self::Future {
        // Do something with self.state
        self.inner.call(req)
    }
}
```

### Commonly Used Middleware

From `tower` and `tower-http`:
- `TraceLayer` — request/response tracing
- `TimeoutLayer` — request timeouts
- `CompressionLayer` — response compression
- `CorsLayer` — CORS headers
- `ValidateRequestHeaderLayer` — auth header validation
- `ServeDir` / `ServeFile` — static file serving
- `RequestIdLayer` — request IDs
- `SetResponseHeaderLayer` — set response headers
- `AddExtensionLayer` — add request extensions

### Passing State from Middleware to Handlers

Use request extensions:

```rust
async fn auth(mut req: Request, next: Next) -> Result<Response, StatusCode> {
    let current_user = authorize(req.headers()).await
        .ok_or(StatusCode::UNAUTHORIZED)?;
    req.extensions_mut().insert(current_user);
    Ok(next.run(req).await)
}

async fn handler(Extension(user): Extension<CurrentUser>) {
    // ...
}
```

### Rewriting Request URI in Middleware

`Router::layer` runs after routing, so it can't rewrite URIs. Wrap the entire Router instead:

```rust
use tower::Layer;
use axum::ServiceExt;

let middleware = tower::util::MapRequestLayer::new(rewrite_request_uri);
let app = Router::new();
let app_with_middleware = middleware.layer(app);

axum::serve(listener, app_with_middleware.into_make_service()).await.unwrap();
```

### Backpressure

Axum expects all services to not care about backpressure (always ready). Avoid routing to services that care about backpressure. If needed, apply backpressure-sensitive middleware around the entire app:

```rust
let app = ServiceBuilder::new()
    .layer(some_backpressure_sensitive_middleware)
    .service(app);
```

---

## Sharing State with Handlers

### Using State Extractor (Recommended)

```rust
use axum::{extract::State, routing::get, Router};
use std::sync::Arc;

#[derive(Clone)]
struct AppState { /* ... */ }

let state = AppState { /* ... */ };

let app = Router::new()
    .route("/", get(handler))
    .with_state(state);

async fn handler(State(state): State<AppState>) { /* ... */ }
```

State is cloned for every request. Wrap in `Arc` for cheap clones, or `#[derive(Clone)]` if all fields are cheap to clone.

### Substates with FromRef

When a handler only needs part of the state:

```rust
use axum::{extract::{State, FromRef}};

#[derive(Clone)]
struct AppState { api_state: ApiState }

#[derive(Clone)]
struct ApiState {}

impl FromRef<AppState> for ApiState {
    fn from_ref(app_state: &AppState) -> ApiState {
        app_state.api_state.clone()
    }
}

// Or use #[derive(FromRef)] with the macros feature

async fn handler(State(api_state): State<ApiState>) {
    // Only receives ApiState, not full AppState
}
```

### Using Request Extensions

```rust
use axum::{extract::Extension, routing::get, Router};

let app = Router::new()
    .route("/", get(handler))
    .layer(Extension(shared_state));

async fn handler(Extension(state): Extension<Arc<AppState>>) { /* ... */ }
```

Downside: runtime errors (500) if extension doesn't exist.

### Using Closure Captures

```rust
let shared_state = Arc::new(AppState { /* ... */ });

let app = Router::new()
    .route("/users", post({
        let state = Arc::clone(&shared_state);
        move |body| create_user(body, state)
    }));
```

Most verbose but most flexible.

### Using Task-Local Variables

```rust
use tokio::task_local;

task_local! {
    pub static USER: CurrentUser;
}

async fn auth(req: Request, next: Next) -> Result<Response, StatusCode> {
    let current_user = authorize(req).await.ok_or(StatusCode::UNAUTHORIZED)?;
    Ok(USER.scope(current_user, next.run(req)).await)
}

struct UserResponse;
impl IntoResponse for UserResponse {
    fn into_response(self) -> Response {
        let current_user = USER.with(|u| u.clone());
        (StatusCode::OK, current_user.name).into_response()
    }
}
```

Only works with executors that support task-local variables (Tokio's `task_local`).

---

## Serving

### Basic Serving

```rust
use axum::serve;
use tokio::net::TcpListener;

let listener = TcpListener::bind("0.0.0.0:3000").await.unwrap();
serve(listener, app).await.unwrap();
```

### Graceful Shutdown

```rust
serve(listener, app)
    .with_graceful_shutdown(shutdown_signal())
    .await
    .unwrap();
```

### IntoMakeService

For integration with other Tower-based servers:

```rust
use axum::ServiceExt;

let make_service = app.into_make_service();
```

### ConnectInfo

Get the client's address (requires `tokio` feature):

```rust
use axum::extract::ConnectInfo;
use std::net::SocketAddr;

async fn handler(ConnectInfo(addr): ConnectInfo<SocketAddr>) {
    println!("Connection from {addr}");
}

let app = Router::new()
    .route("/", get(handler))
    .into_make_service_with_connect_info::<SocketAddr>();
```

### Serve Struct

The `serve` function returns a `Serve` struct which can be configured:
- `.with_graceful_shutdown(future)` — graceful shutdown
- `IncomingStream` — represents an incoming connection
- `TapIo` — tap into IO for custom handling via `ListenerExt::tap_io`

### Listener Trait

`axum::serve` accepts any type implementing the `Listener` trait, not just `TcpListener`.

---

## Body

Axum's body type is `axum::body::Body` (re-exported from `hyper::body`).

```rust
use axum::body::Body;

let body = Body::from("Hello");
let body = Body::from(vec![1, 2, 3]);
let body = Body::empty();
```

### Body Utilities

- `Body::from(String)` — from string
- `Body::from(Vec<u8>)` — from bytes
- `Body::from(&'static [u8])` — from static bytes
- `Body::empty()` — empty body
- `Bytes` — extracted via `Bytes` extractor

---

## WebSocket Support

Requires the `ws` feature flag.

```rust
use axum::extract::ws::{WebSocket, WebSocketUpgrade, Message};

async fn ws_handler(ws: WebSocketUpgrade) -> impl IntoResponse {
    ws.on_upgrade(handle_socket)
}

async fn handle_socket(mut socket: WebSocket) {
    while let Some(msg) = socket.recv().await {
        let msg = if let Ok(msg) = msg {
            msg
        } else {
            break;
        };
        if socket.send(Message::Pong(msg.into())).await.is_err() {
            break;
        }
    }
}

let app = Router::new().route("/ws", get(ws_handler));
```

---

## Server-Sent Events (SSE)

Requires the `tokio` feature.

```rust
use axum::response::sse::{Event, Sse};
use futures::stream::Stream;
use std::time::Duration;
use tokio_stream::StreamExt;

async fn sse_handler() -> Sse<impl Stream<Item = Result<Event, std::convert::Infallible>>> {
    let stream = futures::stream::iter(1..=10)
        .map(|n| Ok(Event::default().data(format!("Message {n}"))));
    Sse::new(stream).keep_alive(Duration::from_secs(15))
}

let app = Router::new().route("/sse", get(sse_handler));
```

---

## Multipart Form Data

Requires the `multipart` feature.

```rust
use axum::extract::Multipart;

async fn upload(mut multipart: Multipart) {
    while let Some(field) = multipart.next_field().await.unwrap() {
        let name = field.name().unwrap_or("unknown").to_string();
        let data = field.bytes().await.unwrap();
        println!("Field {name}: {} bytes", data.len());
    }
}

let app = Router::new().route("/upload", post(upload));
```

---

## Re-exports

Axum re-exports key types at the crate root:
- `http` crate (re-exported)
- `Json` — JSON extractor/response
- `Form` — Form extractor (requires `form` feature)
- `Extension` — Extension extractor and layer
- `Router` — The main router type
- `Error` — Box error type
- `BoxError` — Type alias for `Box<dyn std::error::Error + Send + Sync>`

---

## Debug Macros

### debug_handler

Improves error messages for handler type errors:

```rust
use axum::debug_handler;

#[debug_handler]
async fn my_handler(state: State<AppState>, body: Json<Payload>) -> impl IntoResponse {
    // ...
}
```

### debug_middleware

Improves error messages for middleware:

```rust
use axum::debug_middleware;

#[debug_middleware]
async fn my_middleware(req: Request, next: Next) -> Response {
    // ...
}
```

Both require the `macros` feature.

---

## Key Traits

| Trait | Description |
|-------|-------------|
| `Handler<T, S>` | Implemented for async functions usable as handlers |
| `FromRequest<S>` | Extract from full request (can consume body) |
| `FromRequestParts<S>` | Extract from request parts (no body) |
| `OptionalFromRequest<S>` | Like FromRequest but returns Option |
| `OptionalFromRequestParts<S>` | Like FromRequestParts but returns Option |
| `IntoResponse` | Convert into HTTP response |
| `IntoResponseParts` | Convert into response parts (headers/extensions) |
| `FromRef<T>` | Extract substate from a reference to state |
| `Service<Request>` | Tower service trait (axum's foundation) |
| `Layer<Route>` | Tower layer trait for middleware |
| `RequestExt` | Extension methods on Request |
| `RequestPartsExt` | Extension methods on request Parts |
| `ServiceExt` | Extension methods on Service |
| `Listener` | Trait for types that can be served (TcpListener, etc.) |
| `HandlerWithoutStateExt` | Extension for handlers with no state — `into_make_service()` |

---

## MethodRouter

`MethodRouter` is the type returned by `get()`, `post()`, `any()`, etc. It routes based on the HTTP method.

### Building a MethodRouter

```rust
use axum::routing::{get, post, MethodRouter};

// Empty — returns 405 Method Not Allowed for all requests
let router: MethodRouter<()> = MethodRouter::new();

// With handlers
let router: MethodRouter<()> = get(get_handler).post(post_handler).delete(delete_handler);

// Any method
let router: MethodRouter<()> = MethodRouter::new().any(any_handler);
```

### MethodRouter Methods

| Method | Description |
|--------|-------------|
| `new()` | Create empty MethodRouter (405 for all) |
| `get(h)` / `post(h)` / etc. | Add handler for a method |
| `any(h)` | Add handler for any method |
| `on(filter, h)` | Add handler for a `MethodFilter` |
| `fallback(h)` | Handler for unmatched methods |
| `layer(l)` | Apply middleware to all handlers |
| `route_layer(l)` | Apply middleware only if method matches |
| `merge(other)` | Merge two MethodRouters |

### Service Variants

Each method function has a `_service` variant that accepts a `Service` instead of a handler:

```rust
use axum::routing::{get_service, post_service, any_service};

let router = get_service(my_service).post_service(another_service);
```

### MethodFilter

Used with `on()` for method-specific routing:

```rust
use axum::routing::on;
use axum::routing::MethodFilter;

let router = on(MethodFilter::GET, handler);
```

`MethodFilter` variants: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `HEAD`, `OPTIONS`, `CONNECT`, `TRACE`.

---

## Body Module

Axum's body type is `axum::body::Body`.

### Re-exports

- `pub use http_body::Body as HttpBody` — The `Body` trait from `http-body`
- `pub use bytes::Bytes` — The `Bytes` type from the `bytes` crate

### Body Struct

```rust
use axum::body::Body;

let body = Body::from("Hello");
let body = Body::from(vec![1, 2, 3]);
let body = Body::from(&'static [u8; 5]);
let body = Body::empty();
```

### BodyDataStream

A streaming body that implements `tokio::io::AsyncRead`:

```rust
use axum::body::BodyDataStream;

// Can be used as an async reader for streaming body data
```

### to_bytes Function

```rust
use axum::body::to_bytes;

let bytes = to_bytes(body, limit).await.unwrap();
```

Collects the body into `Bytes` with a maximum size limit. Use `usize::MAX` for no limit (not recommended in production).

---

## Test Helpers

Axum provides a `test_helpers` module (gated behind `__private` — primarily for axum's own tests but usable by others).

### TestClient

```rust
use axum::test_helpers::TestClient;

let app = Router::new().route("/", get(|| async { "Hello!" }));
let client = TestClient::new(app);

let response = client.get("/").send().await;
assert_eq!(response.status(), StatusCode::OK);
let text = response.text().await;
assert_eq!(text, "Hello!");
```

### RequestBuilder

```rust
use axum::test_helpers::RequestBuilder;

// Build requests for testing
```

### TestResponse

```rust
use axum::test_helpers::TestResponse;

// Provides methods like .status(), .text(), .bytes(), .json()
```

> **Note**: `test_helpers` is behind the `__private` feature gate and primarily intended for axum's own test suite. For production testing, prefer `tower::ServiceExt::oneshot` as shown in the guides.

---

## HandlerWithoutStateExt

Handlers with no state can be served directly without a `Router`, avoiding routing overhead:

```rust
use axum::handler::HandlerWithoutStateExt;

async fn handler() -> &'static str { "Hello!" }

// No Router needed — handler runs for all requests
let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
axum::serve(listener, handler.into_make_service()).await.unwrap();
```

This is faster than `Router::new().fallback(handler)` because it skips routing entirely.

---

## axum-extra

`axum-extra` is a separate crate providing additional extractors, responses, and utilities for axum.

### Feature Flags

| Feature | Description |
|---------|-------------|
| `async-read-body` | `AsyncReadBody` — body as `tokio::io::AsyncRead` |
| `attachment` | `Attachment` — file download response with Content-Disposition |
| `cached` | `Cached<T>` — cache extractor results across calls |
| `cookie` | `CookieJar` — cookie management |
| `cookie-private` | `PrivateCookieJar` — encrypted cookies |
| `cookie-signed` | `SignedCookieJar` — signed cookies |
| `cookie-key-expansion` | `Key::derive_from` for cookie keys |
| `erased-json` | `ErasedJson` — type-erased JSON response |
| `error-response` | `InternalServerError` — generic error response |
| `form` | Alternative `Form` with customizable rejection |
| `handler` | Additional handler utilities |
| `json-deserializer` | `JsonDeserializer<T>` — flexible JSON deserialization |
| `json-lines` | `JsonLines<T>` — JSON Lines (NDJSON) support |
| `middleware` | Additional middleware utilities |
| `multipart` | Alternative `Multipart` with customizable rejection |
| `optional-path` | `OptionalPath<T>` — optional path parameters |
| `protobuf` | `Protobuf<T>` — Protocol Buffers support |
| `query` | Alternative `Query` with customizable rejection |
| `routing` | Additional routing utilities |
| `typed-routing` | `TypedPath` — type-safe routing |
| `typed-header` | `TypedHeader<T>` — typed header extraction via `headers` crate |
| `file-stream` | `FileStream` — streaming file responses |
| `with-rejection` | `WithRejection<T, R>` — customize extractor rejection type |

### TypedHeader

Extract typed headers using the `headers` crate:

```rust
use axum_extra::TypedHeader;
use headers::{UserAgent, ContentType};

async fn handler(
    TypedHeader(user_agent): TypedHeader<UserAgent>,
    TypedHeader(content_type): TypedHeader<ContentType>,
) {
    // user_agent.as_str(), content_type.essence()
}
```

### CookieJar

```rust
use axum_extra::extract::cookie::CookieJar;

async fn handler(jar: CookieJar) {
    let cookie = jar.get("session").map(|c| c.value().to_string());
}
```

### WithRejection

Wrap an extractor to customize its rejection type:

```rust
use axum_extra::extract::WithRejection;
use axum::extract::Json;

struct MyRejection(StatusCode);

impl IntoResponse for MyRejection {
    fn into_response(self) -> Response {
        self.0.into_response()
    }

async fn handler(
    WithRejection(Json(payload), _): WithRejection<Json<Payload>, MyRejection>,
) {
    // If JSON extraction fails, MyRejection is returned instead of JsonRejection
}
```

### Cached

Cache extractor results so calling the same extractor multiple times doesn't re-extract:

```rust
use axum_extra::extract::Cached;
use axum::extract::Json;

async fn handler(
    Cached(Json(payload)): Cached<Json<Payload>>,
) {
    // JSON body is cached — subsequent Cached<Json<T>> calls reuse it
}
```

### OptionalPath

```rust
use axum_extra::extract::OptionalPath;

async fn handler(OptionalPath(maybe_id): OptionalPath<u32>) {
    if let Some(id) = maybe_id {
        // Path matched with id
    } else {
        // No path parameter
    }
}
```

### Either

Return one of multiple response types:

```rust
use axum_extra::response::Either;

async fn handler(condition: bool) -> Either<String, Json<Vec<u8>>> {
    if condition {
        Either::E1("text response")
    } else {
        Either::E2(Json(vec![1, 2, 3]))
    }
}
```

Supports `Either::E1` through `Either::E7` for up to 7 variants.

### TypedPath (Type-Safe Routing)

```rust
use axum_extra::routing::TypedPath;
use serde::Deserialize;

#[derive(TypedPath, Deserialize)]
#[typed_path("/users/{id}")]
struct UserPath { id: u32 }

async fn get_user(UserPath { id }: UserPath) -> impl IntoResponse {
    // Type-safe path matching
}
```

### Protobuf

```rust
use axum_extra::protobuf::Protobuf;

async fn handler(Protobuf(payload): Protobuf<MyProtoMessage>) -> Protobuf<MyResponse> {
    Protobuf(MyResponse { /* ... */ })
}
```

### JsonLines (NDJSON)

```rust
use axum_extra::json_lines::JsonLines;

async fn handler(JsonLines(stream): JsonLines<impl Stream<Item = MyType>>) {
    // Stream NDJSON responses
}
```

### Attachment

```rust
use axum_extra::response::Attachment;
use axum::body::Body;

async fn download() -> Attachment<Body> {
    Attachment::new(Body::from(file_bytes))
        .filename("report.pdf")
        .content_type("application/pdf")
}
```

---

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
