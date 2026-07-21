# Advanced Topics

## The HTTP Server

The `HttpServer` type is responsible for serving HTTP requests. `HttpServer` accepts an application factory as a parameter, and the application factory must have `Send + Sync` boundaries.

To start the web server it must first be bound to a network socket. Use `HttpServer::bind()` with a socket address tuple or string such as `("127.0.0.1", 8080)` or `"0.0.0.0:8080"`.

After the bind is successful, use `HttpServer::run()` to return a `Server` instance. The `Server` must be awaited or spawned to start processing requests and will run until it receives a shutdown signal (by default, ctrl-c).

```rust
use actix_web::{web, App, HttpResponse, HttpServer};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().route("/", web::get().to(HttpResponse::Ok)))
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}
```

### Multi-Threading

`HttpServer` automatically starts a number of HTTP workers, by default this number is equal to the number of physical CPUs in the system. This number can be overridden with `HttpServer::workers()`.

```rust
HttpServer::new(|| App::new().route("/", web::get().to(HttpResponse::Ok)))
    .workers(4); // Start 4 workers
```

Once the workers are created, they each receive a separate application instance to handle requests. Application state is not shared between the threads, and handlers are free to manipulate their copy of the state with no concurrency concerns. Application state does not need to be `Send` or `Sync`, but application factories must be `Send + Sync`.

To share state between worker threads, use an `Arc`/`Data`. Special care should be taken once sharing and synchronization are introduced — performance costs may be inadvertently introduced as a result of locking the shared state for modifications.

**Blocking the current thread will cause the current worker to stop processing new requests:**

```rust
fn my_handler() -> impl Responder {
    std::thread::sleep(Duration::from_secs(5)); // Bad practice!
    "response"
}
```

**Use async instead:**

```rust
async fn my_handler() -> impl Responder {
    tokio::time::sleep(Duration::from_secs(5)).await; // Ok
    "response"
}
```

The same limitation applies to extractors. When a handler function receives an argument which implements `FromRequest`, and that implementation blocks the current thread, the worker thread will block when running the handler.

### TLS / HTTPS

Actix Web supports two TLS implementations: **rustls** and **openssl**.

**OpenSSL:**

```toml
[dependencies]
actix-web = { version = "4", features = ["openssl"] }
openssl = { version = "0.10" }
```

```rust
use actix_web::{get, App, HttpRequest, HttpServer, Responder};
use openssl::ssl::{SslAcceptor, SslFiletype, SslMethod};

#[get("/")]
async fn index(_req: HttpRequest) -> impl Responder {
    "Welcome!"
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let mut builder = SslAcceptor::mozilla_intermediate(SslMethod::tls()).unwrap();
    builder
        .set_private_key_file("key.pem", SslFiletype::PEM)
        .unwrap();
    builder.set_certificate_chain_file("cert.pem").unwrap();

    HttpServer::new(|| App::new().service(index))
        .bind_openssl("127.0.0.1:8080", builder)?
        .run()
        .await
}
```

Create a self-signed temporary cert for testing:

```bash
openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem \
    -days 365 -sha256 -subj "/C=CN/ST=Fujian/L=Xiamen/O=TVlinux/OU=Org/CN=muro.lxd"
```

**rustls (HTTP/2 with TLS):**

```toml
[dependencies]
actix-web = { version = "4", features = ["rustls-0_23"] }
rustls = "0.23"
rustls-pemfile = "2"
```

```rust
use actix_web::{web, App, HttpRequest, HttpServer, Responder};
use std::io::BufReader;
use std::fs::File;

async fn index(_req: HttpRequest) -> impl Responder {
    "Hello TLS World!"
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    rustls::crypto::aws_lc_rs::default_provider()
        .install_default()
        .unwrap();

    let mut certs_file = BufReader::new(File::open("cert.pem").unwrap());
    let mut key_file = BufReader::new(File::open("key.pem").unwrap());

    let tls_certs = rustls_pemfile::certs(&mut certs_file)
        .collect::<Result<Vec<_>, _>>()
        .unwrap();
    let tls_key = rustls_pemfile::pkcs8_private_keys(&mut key_file)
        .next()
        .unwrap()
        .unwrap();

    let tls_config = rustls::ServerConfig::builder()
        .with_no_client_auth()
        .with_single_cert(tls_certs, rustls::pki_types::PrivateKeyDer::Pkcs8(tls_key))
        .unwrap();

    HttpServer::new(|| App::new().route("/", web::get().to(index)))
        .bind_rustls_0_23(("127.0.0.1", 8443), tls_config)?
        .run()
        .await
}
```

### Keep-Alive

Actix Web keeps connections open to wait for subsequent requests.

- `Duration::from_secs(75)` or `KeepAlive::Timeout(75)` — enables 75 second keep-alive timer
- `KeepAlive::Os` — uses OS keep-alive
- `None` or `KeepAlive::Disabled` — disables keep-alive

```rust
use actix_web::{http::KeepAlive, HttpServer};
use std::time::Duration;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let _one = HttpServer::new(app).keep_alive(Duration::from_secs(75));
    let _two = HttpServer::new(app).keep_alive(KeepAlive::Os);
    let _three = HttpServer::new(app).keep_alive(None);
    Ok(())
}
```

Force closing a connection on a specific response:

```rust
use actix_web::{http, HttpRequest, HttpResponse};

async fn index(_req: HttpRequest) -> HttpResponse {
    let mut resp = HttpResponse::Ok()
        .force_close()
        .finish();
    resp.head_mut().set_connection_type(http::ConnectionType::Close);
    resp
}
```

Keep-alive is off for HTTP/1.0 and is on for HTTP/1.1 and HTTP/2.0.

### Graceful Shutdown

`HttpServer` supports graceful shutdown. After receiving a stop signal, workers have a specific amount of time to finish serving requests. Any workers still alive after the timeout are force-dropped. By default the shutdown timeout is 30 seconds.

Change with `HttpServer::shutdown_timeout()`.

Handled signals:

- **CTRL-C** — available on all OSes
- **SIGINT** — Force shutdown workers (Unix)
- **SIGTERM** — Graceful shutdown workers (Unix)
- **SIGQUIT** — Force shutdown workers (Unix)

Disable signal handling with `HttpServer::disable_signals()`.

## HTTP/2

Actix Web automatically upgrades connections to HTTP/2 if possible.

When either the `rustls` or `openssl` features are enabled, `HttpServer` provides the `bind_rustls()` and `bind_openssl()` methods respectively.

Upgrades to HTTP/2 described in RFC 7540 §3.2 are not supported. Starting HTTP/2 with prior knowledge is supported for both cleartext and TLS connections (RFC 7540 §3.4) when using the lower level `actix-http` service builders.

## Static Files

### Individual File

Serve static files with a custom path pattern and `NamedFile`. To match a path tail, use a `[.*]` regex:

```rust
use actix_files::NamedFile;
use actix_web::HttpRequest;
use std::path::PathBuf;

async fn index(req: HttpRequest) -> actix_web::Result<NamedFile> {
    let path: PathBuf = req.match_info().query("filename").parse().unwrap();
    Ok(NamedFile::open(path)?)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    use actix_web::{web, App, HttpServer};
    HttpServer::new(|| App::new().route("/{filename:.*}", web::get().to(index)))
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}
```

**Security warning:** Matching a path tail with `[.*]` regex and using it to return a `NamedFile` has serious security implications — attackers can insert `../` to access any file the server user has access to.

### Directory

Serve files from specific directories with `Files`:

```rust
use actix_files as fs;
use actix_web::{App, HttpServer};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new().service(fs::Files::new("/static", ".").show_files_listing())
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

By default files listing for sub-directories is disabled. Enable with `Files::show_files_listing()`. Redirect to a specific index file with `Files::index_file()`.

### Configuration

`NamedFile` options:

- `set_content_disposition` — function for mapping file's mime to Content-Disposition type
- `use_etag` — whether ETag shall be calculated and included in headers
- `use_last_modified` — whether file modified timestamp should be used in Last-Modified header

```rust
use actix_files as fs;
use actix_web::http::header::{ContentDisposition, DispositionType};
use actix_web::{get, App, Error, HttpRequest, HttpServer};

#[get("/{filename:.*}")]
async fn index(req: HttpRequest) -> Result<fs::NamedFile, Error> {
    let path: std::path::PathBuf = req.match_info().query("filename").parse().unwrap();
    let file = fs::NamedFile::open(path)?;
    Ok(file
        .use_last_modified(true)
        .set_content_disposition(ContentDisposition {
            disposition: DispositionType::Attachment,
            parameters: vec![],
        }))
}
```

## WebSockets

Actix Web supports a high-level WebSocket interface via the `actix-ws` crate. Using this crate, it's possible to convert a request's `Payload` stream into a stream of `ws::Message`s and then react to them inside a spawned async task.

```rust
use actix_web::{rt, web, App, Error, HttpRequest, HttpResponse, HttpServer};
use actix_ws::AggregatedMessage;
use futures_util::StreamExt as _;

async fn echo(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse, Error> {
    let (res, mut session, stream) = actix_ws::handle(&req, stream)?;

    let mut stream = stream
        .aggregate_continuations()
        .max_continuation_size(2_usize.pow(20));

    rt::spawn(async move {
        while let Some(msg) = stream.next().await {
            match msg {
                Ok(AggregatedMessage::Text(text)) => {
                    session.text(text).await.unwrap();
                }
                Ok(AggregatedMessage::Binary(bin)) => {
                    session.binary(bin).await.unwrap();
                }
                Ok(AggregatedMessage::Ping(msg)) => {
                    session.pong(&msg).await.unwrap();
                }
                _ => {}
            }
        }
    });

    Ok(res)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().route("/echo", web::get().to(echo)))
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}
```

## Auto-Reloading Development Server

During development, use `watchexec` to automatically recompile code on changes:

```bash
watchexec -e rs -r cargo run
```

Watch a specific directory:

```bash
watchexec -w src -r cargo run
```

An old approach used `systemfd` and `listenfd`, but this has many gotchas. `watchexec` is recommended.

## Databases

Actix Web works with async database adapters. Example projects are available for:

- **Postgres** — [examples/databases/postgres](https://github.com/actix/examples/tree/master/databases/postgres)
- **SQLite** — [examples/databases/sqlite](https://github.com/actix/examples/tree/master/databases/sqlite)
- **MongoDB** — [examples/databases/mongodb](https://github.com/actix/examples/tree/master/databases/mongodb)

Common async database crates used with Actix Web:

- `sqlx` — async SQL queries with compile-time checking
- `sea-orm` — async ORM
- `diesel` — with `diesel-async` extension
- `mongodb` — official MongoDB driver

## Architecture Diagrams

### HTTP Server Initialization

When `HttpServer::new(|| App::new()...).bind(...).run().await` is called, the server initializes by:

1. Creating the server with the application factory
2. Binding to the specified socket address
3. Starting the accept loop
4. Spawning worker threads

### Connection Lifecycle

After the server has started listening to all sockets, **Accept** and **Worker** are two main loops responsible for processing incoming client connections.

Once a connection is accepted, application-level protocol processing happens in a protocol-specific **Dispatcher** loop spawned from the Worker.

The main loops:

- **Accept loop** — accepts incoming connections (in `actix-server` crate)
- **Worker loop** — processes connections, spawns dispatchers (in `actix-server` crate)
- **Request loop** — handles HTTP request processing (in `actix-web` and `actix-http` crates)

## Actix Actor Framework

Actix is a Rust library providing a framework for developing concurrent applications using the Actor Model. Actors are objects which encapsulate state and behavior and run within the Actor System provided by the actix library.

Actors communicate exclusively by exchanging messages. The sending actor can optionally wait for the response. Actors are not referenced directly, but by means of addresses.

Any Rust type can be an actor — it only needs to implement the `Actor` trait.

### Quick Start

```toml
[dependencies]
actix = "0.13"
```

### Actor

An actor is a type that implements the `Actor` trait:

```rust
use actix::prelude::*;

struct MyActor {
    count: usize,
}

impl Actor for MyActor {
    type Context = Context<Self>;
}
```

#### Actor Lifecycle

The `Actor` trait provides several methods that control the actor's lifecycle:

- `started()` — called when an actor is started
- `stopping()` — called when an actor is in stopping state
- `stopped()` — called when an actor is stopped

### Message

An actor communicates with other actors by sending messages. A message can be any Rust type which implements the `Message` trait. `Message::Result` defines the return type.

```rust
use actix::prelude::*;

#[derive(Message)]
#[rtype(result = "usize")]
struct Ping(usize);
```

### Handler

To handle a specific message, the actor must implement the `Handler<M>` trait:

```rust
impl Handler<Ping> for MyActor {
    type Result = usize;

    fn handle(&mut self, msg: Ping, _ctx: &mut Context<Self>) -> Self::Result {
        self.count += msg.0;
        self.count
    }
}
```

### Spawning an Actor

Start an actor with `Actor::start()` or `Actor::create()`:

```rust
#[actix::main]
async fn main() {
    let addr = MyActor { count: 10 }.start();
    let res = addr.send(Ping(10)).await;
    println!("RESULT: {}", res.unwrap() == 20);
    System::current().stop();
}
```

### Complete Actor Example

```rust
use actix::prelude::*;

#[derive(Message)]
#[rtype(result = "Result<bool, std::io::Error>")]
struct Ping;

struct MyActor;

impl Actor for MyActor {
    type Context = Context<Self>;

    fn started(&mut self, _ctx: &mut Context<Self>) {
        println!("Actor is alive");
    }

    fn stopped(&mut self, _ctx: &mut Context<Self>) {
        println!("Actor is stopped");
    }
}

impl Handler<Ping> for MyActor {
    type Result = Result<bool, std::io::Error>;

    fn handle(&mut self, _msg: Ping, _ctx: &mut Context<Self>) -> Self::Result {
        println!("Ping received");
        Ok(true)
    }
}

#[actix::main]
async fn main() {
    let addr = MyActor.start();
    let result = addr.send(Ping).await;
    match result {
        Ok(res) => println!("Got result: {}", res.unwrap()),
        Err(err) => println!("Got error: {}", err),
    }
}
```

### Address

Actors communicate exclusively by exchanging messages. Actors cannot be referenced directly, only by their addresses.

Get an actor's address:

- `Actor::start()` returns the address
- `AsyncContext::address()` from within the actor's context

```rust
struct MyActor;
impl Actor for MyActor {
    type Context = Context<Self>;
}

let addr = MyActor.start();
```

From within the actor:

```rust
impl Actor for MyActor {
    type Context = Context<Self>;

    fn started(&mut self, ctx: &mut Context<Self>) {
        let addr = ctx.address();
    }
}
```

### Recipient

A `Recipient` is a specialized version of an address that supports only one type of message. It can be used when the message needs to be sent to a different type of actor.

```rust
use actix::prelude::*;

#[derive(Message)]
#[rtype(result = "()")]
struct OrderShipped(usize);

#[derive(Message)]
#[rtype(result = "()")]
struct Subscribe(pub Recipient<OrderShipped>);

struct OrderEvents {
    subscribers: Vec<Recipient<OrderShipped>>,
}

impl Actor for OrderEvents {
    type Context = Context<Self>;
}

impl Handler<Subscribe> for OrderEvents {
    type Result = ();
    fn handle(&mut self, msg: Subscribe, _: &mut Self::Context) {
        self.subscribers.push(msg.0);
    }
}
```

### Context

Actors maintain an internal execution context. This allows an actor to determine its own `Address`, change mailbox limits, or stop its execution.

#### Mailbox

All messages go to the actor's mailbox first. For `Context` type, the capacity is 16 messages by default and can be increased with `Context::set_mailbox_capacity()`:

```rust
impl Actor for MyActor {
    type Context = Context<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        ctx.set_mailbox_capacity(1);
    }
}
```

`Addr::do_send(M)` bypasses the mailbox queue limit. `AsyncContext::notify(M)` and `AsyncContext::notify_later(M, Duration)` bypass the mailbox entirely.

#### Getting Your Actor's Address

```rust
impl Handler<WhoAmI> for MyActor {
    type Result = Result<actix::Addr<MyActor>, ()>;

    fn handle(&mut self, _msg: WhoAmI, ctx: &mut Context<Self>) -> Self::Result {
        Ok(ctx.address())
    }
}
```

#### Stopping an Actor

Call `Context::stop()` from within the actor's execution context:

```rust
impl Handler<Ping> for MyActor {
    type Result = usize;

    fn handle(&mut self, msg: Ping, ctx: &mut Context<Self>) -> Self::Result {
        self.count += msg.0;
        if self.count > 5 {
            println!("Shutting down ping receiver.");
            ctx.stop();
        }
        self.count
    }
}
```

### Arbiter

Arbiters provide an asynchronous execution context for Actors, functions, and futures. Where an actor contains a `Context` that defines its actor-specific execution state, Arbiters host the environment where an actor runs.

An Arbiter is in control of one thread with one event pool. When you think Arbiter, think "single-threaded event loop".

Actix supports concurrency by spinning up multiple Arbiters using `Arbiter::new`, `ArbiterBuilder`, or `Arbiter::start`. Actors cannot freely move between Arbiters — they are tied to the Arbiter they were spawned in. However, Actors on different Arbiters can still communicate using normal `Addr`/`Recipient` methods.

```rust
use actix::prelude::*;

struct SumActor {}
impl Actor for SumActor {
    type Context = Context<Self>;
}

#[derive(Message)]
#[rtype(result = "usize")]
struct Value(usize, usize);

impl Handler<Value> for SumActor {
    type Result = usize;
    fn handle(&mut self, msg: Value, _ctx: &mut Context<Self>) -> Self::Result {
        msg.0 + msg.1
    }
}

fn main() {
    let system = System::new("single-arbiter-example");
    let execution = async {
        let sum_addr = SumActor {}.start();
        let sum_result = sum_addr.send(Value(6, 7)).await;
        match sum_result {
            Ok(res) => println!("Got: {}", res),
            Err(e) => eprintln!("Error: {:?}", e),
        };
    };
    Arbiter::current().spawn(execution);
    System::current().stop();
    system.run();
}
```

### SyncArbiter

For CPU-bound workloads, `SyncArbiter` provides the ability to launch multiple instances of an Actor on a pool of OS threads.

A `SyncArbiter` can only host a single type of Actor.

**Creating a Sync Actor** — change the context from `Context` to `SyncContext`:

```rust
use actix::prelude::*;

struct MySyncActor;
impl Actor for MySyncActor {
    type Context = SyncContext<Self>;
}
```

**Starting the Sync Arbiter:**

```rust
let addr = SyncArbiter::start(2, || MySyncActor); // 2 threads
```

Sync Actors have no mailbox limits, but you should still use `do_send`, `try_send`, and `send` as normal.
