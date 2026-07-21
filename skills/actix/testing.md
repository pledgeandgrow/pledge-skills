# Testing

Every application should be well tested. Actix Web provides tools to perform integration tests against your applications and unit test tools for custom extractors and middleware.

## Integration Testing For Applications

Actix Web can be used to run the application with specific handlers in a real HTTP server. `TestRequest::get()`, `TestRequest::post()` and other methods can be used to send requests to the test server.

To create a Service for testing, use the `test::init_service` method which accepts a regular `App` builder.

```rust
#[cfg(test)]
mod tests {
    use actix_web::{http::header::ContentType, test, App};
    use super::*;

    #[actix_web::test]
    async fn test_index_get() {
        let app = test::init_service(App::new().service(index)).await;
        let req = test::TestRequest::default()
            .insert_header(ContentType::plaintext())
            .to_request();
        let resp = test::call_service(&app, req).await;
        assert!(resp.status().is_success());
    }

    #[actix_web::test]
    async fn test_index_post() {
        let app = test::init_service(App::new().service(index)).await;
        let req = test::TestRequest::post().uri("/").to_request();
        let resp = test::call_service(&app, req).await;
        assert!(resp.status().is_client_error());
    }
}
```

### Testing with Application State

For more complex application configuration, initialize application state just like you would in a normal application:

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::{test, web, App};

    #[actix_web::test]
    async fn test_index_get() {
        let app = test::init_service(
            App::new()
                .app_data(web::Data::new(AppState { count: 4 }))
                .service(index),
        )
        .await;
        let req = test::TestRequest::get().uri("/").to_request();
        let resp: AppState = test::call_and_read_body_json(&app, req).await;
        assert_eq!(resp.count, 4);
    }
}
```

## Stream Response Testing

Test streaming responses by polling the body stream:

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::{body, body::MessageBody as _, rt::pin, test, web, App};
    use futures::future;

    #[actix_web::test]
    async fn test_stream_chunk() {
        let app = test::init_service(App::new().route("/", web::get().to(sse))).await;
        let req = test::TestRequest::get().to_request();
        let resp = test::call_service(&app, req).await;
        assert!(resp.status().is_success());

        let body = resp.into_body();
        pin!(body);

        // first chunk
        let bytes = future::poll_fn(|cx| body.as_mut().poll_next(cx)).await;
        assert_eq!(
            bytes.unwrap().unwrap(),
            web::Bytes::from_static(b"data: 5\n\n")
        );

        // second chunk
        let bytes = future::poll_fn(|cx| body.as_mut().poll_next(cx)).await;
        assert_eq!(
            bytes.unwrap().unwrap(),
            web::Bytes::from_static(b"data: 4\n\n")
        );
    }

    #[actix_web::test]
    async fn test_stream_full_payload() {
        let app = test::init_service(App::new().route("/", web::get().to(sse))).await;
        let req = test::TestRequest::get().to_request();
        let resp = test::call_service(&app, req).await;
        assert!(resp.status().is_success());

        let body = resp.into_body();
        let bytes = body::to_bytes(body).await;
        assert_eq!(
            bytes.unwrap(),
            web::Bytes::from_static(b"data: 5\n\ndata: 4\n\ndata: 3\n\ndata: 2\n\ndata: 1\n\n")
        );
    }
}
```

## Unit Testing Extractors

Unit testing has limited value for applications, but can be useful when developing extractors, middleware, and responders. Calling directly into handler functions without routing macros is possible if you want to make assertions on custom `Responder`s.

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::{
        http::{self, header::ContentType},
        test,
    };

    #[actix_web::test]
    async fn test_index_ok() {
        let req = test::TestRequest::default()
            .insert_header(ContentType::plaintext())
            .to_http_request();
        let resp = index(req).await;
        assert_eq!(resp.status(), http::StatusCode::OK);
    }

    #[actix_web::test]
    async fn test_index_not_ok() {
        let req = test::TestRequest::default().to_http_request();
        let resp = index(req).await;
        assert_eq!(resp.status(), http::StatusCode::BAD_REQUEST);
    }
}
```

## Key Testing APIs

| API | Description |
|-----|-------------|
| `test::init_service` | Create a test service from an App builder |
| `test::call_service` | Send a request to the test service and get response |
| `test::call_and_read_body` | Send request and read body as bytes |
| `test::call_and_read_body_json` | Send request and deserialize body as JSON |
| `test::TestRequest` | Build test requests with headers, method, URI, payload |
| `test::TestRequest::default()` | Create a GET request |
| `test::TestRequest::get()` | Create a GET request |
| `test::TestRequest::post()` | Create a POST request |
| `TestRequest::to_request()` | Convert to a `Request` |
| `TestRequest::to_http_request()` | Convert to an `HttpRequest` |
| `#[actix_web::test]` | Attribute macro for async test functions |
