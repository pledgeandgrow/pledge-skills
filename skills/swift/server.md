# Swift on Server

Server-side Swift — frameworks, deployment, and best practices.

## Why Swift on Server?

### Performance
- Fast performance comparable to C and C++
- Low memory footprint (measured in MB)
- Uses Automatic Reference Counting (ARC) instead of tracing GC
- No JIT compilation — predictable performance
- No non-deterministic GC pauses

### Quick start-up time
- Almost no warm-up operations
- Ideal for serverless (AWS Lambda, Google Cloud Functions)
- Negligible cold start times
- Good for microservices that scale dynamically
- Streamlines continuous delivery pipelines

### Expressive and safe
- Type safety prevents common programming errors
- Optionals eliminate null pointer crashes
- Memory safety features
- Built-in concurrency support (async/await, actors)
- `Sendable` for data-race safety across concurrent tasks

## Supported ecosystem

### Web frameworks

#### Vapor
```swift
import Vapor

let app = try Application(config: .default)
defer { app.shutdown() }

app.get("hello") { req async in
    return "Hello, world!"
}

app.post("users") { req async throws -> User in
    let user = try req.content.decode(User.self)
    try await user.save(on: req.db)
    return user
}

try app.run()
```

#### Hummingbird
```swift
import Hummingbird

let app = HBApplication()

app.router.get("hello") { request, context in
    return "Hello, world!"
}

app.router.post("users") { request, context async throws -> User in
    let user = try await request.decodeJSON(as: User.self)
    try await user.save()
    return user
}

try app.start()
```

#### SwiftNIO (low-level)
```swift
import NIOCore
import NIOPosix

let group = MultiThreadedEventLoopGroup(numberOfThreads: System.coreCount)
defer { try! group.syncShutdownGracefully() }

let channel = try ServerBootstrap(group: group)
    .serverChannelOption(ChannelOptions.backlog, value: 256)
    .childChannelInitializer { channel in
        channel.pipeline.addHandler(MyHandler())
    }
    .bind(host: "localhost", port: 8080)
    .wait()

try channel.closeFuture.wait()
```

### Database drivers

```swift
// Fluent (Vapor ORM)
import Fluent
import FluentPostgresDriver

app.databases.use(.postgres(hostname: "localhost", username: "postgres"), as: .psql)

final class User: Model, Content {
    static let schema = "users"
    @ID var id: UUID?
    @Field var name: String
    @Field var email: String
    init() {}
}

// Migrations
struct CreateUser: Migration {
    func prepare(on database: Database) -> EventLoopFuture<Void> {
        database.schema("users")
            .id()
            .field("name", .string, .required)
            .field("email", .string, .required)
            .create()
    }
    func revert(on database: Database) -> EventLoopFuture<Void> {
        database.schema("users").delete()
    }
}

app.migrations.add(CreateUser())
try app.autoMigrate().wait()
```

### Server ecosystem packages

| Package | Purpose |
|---------|---------|
| **vapor/vapor** | Full-featured web framework |
| **hummingbird-project/hummingbird** | Lightweight web framework |
| **apple/swift-nio** | Low-level event-driven framework |
| **apple/swift-nio-http2** | HTTP/2 support |
| **vapor/fluent** | ORM for databases |
| **vapor/fluent-postgres-driver** | PostgreSQL driver |
| **vapor/fluent-mongo-driver** | MongoDB driver |
| **swift-server/swift-certificates** | TLS certificate handling |
| **swift-server/async-http-client** | Async HTTP client |
| **swift-server/swift-openapi-generator** | OpenAPI code generation |

## Deployment

### Docker

```dockerfile
FROM swift:6.0 as build
WORKDIR /build
COPY Package.swift Package.swift
COPY Sources Sources
RUN swift build -c release --static-swift-stdlib

FROM swift:6.0-slim
WORKDIR /app
COPY --from=build /build/.build/release/MyApp .
EXPOSE 8080
CMD ["./MyApp"]
```

### Static Linux SDK

```bash
# Install static Linux SDK
swift sdk install \
    https://download.swift.org/swift-6.0-static-linux-repo/swift-6.0-RELEASE-static-sdk/swift-6.0-RELEASE-static-sdk-linux.tar.gz

# Build with static SDK
swift build --swift-sdk x86_64-swift-linux-musl -c release
```

### AWS Lambda

```swift
import AWSLambdaRuntime

@main
struct MyLambda: LambdaHandler {
    typealias Request = MyRequest
    typealias Response = MyResponse

    init() {}

    func handle(_ request: Request, context: LambdaContext) async throws -> Response {
        return MyResponse(message: "Hello, \(request.name)!")
    }
}
```

## Development guides

### Project structure

```
MyServer/
├── Package.swift
├── Sources/
│   └── App/
│       ├── configure.swift      # App configuration
│       ├── routes.swift         # Route definitions
│       ├── Controllers/
│       │   └── UserController.swift
│       ├── Models/
│       │   └── User.swift
│       ├── Migrations/
│       │   └── CreateUser.swift
│       └── entrypoint.swift     # Main entry point
├── Tests/
│   └── AppTests/
└── Resources/
```

### Environment configuration

```swift
import Vapor

func configure(_ app: Application) throws {
    // Environment variables
    let port = Environment.get("PORT").flatMap(Int.init) ?? 8080
    app.http.server.configuration.port = port

    // Database configuration
    app.databases.use(.postgres(
        hostname: Environment.get("DATABASE_HOST") ?? "localhost",
        username: Environment.get("DATABASE_USERNAME") ?? "postgres",
        password: Environment.get("DATABASE_PASSWORD") ?? "",
        database: Environment.get("DATABASE_NAME") ?? "myapp"
    ), as: .psql)
}
```

### Middleware

```swift
// Custom middleware
struct LoggingMiddleware: Middleware {
    func respond(to request: Request, chainingTo next: Responder) -> EventLoopFuture<Response> {
        print("Request: \(request.method) \(request.url.path)")
        return next.respond(to: request).map { response in
            print("Response: \(response.status)")
            return response
        }
    }
}

// CORS middleware
let cors = CORSMiddleware(configuration: .init(
    allowedOrigin: .all,
    allowedMethods: [.GET, .POST, .PUT, .DELETE, .OPTIONS],
    allowedHeaders: [.accept, .authorization, .contentType]
))
app.middleware.use(cors)
```

### Error handling

```swift
struct APIError: AbortError {
    var status: HTTPResponseStatus
    var reason: String
    var identifier: String

    init(_ status: HTTPResponseStatus, _ reason: String, _ identifier: String = "") {
        self.status = status
        self.reason = reason
        self.identifier = identifier
    }
}

// Usage
throw APIError(.notFound, "User not found", "user_not_found")
```

## Swift Server Workgroup

The Swift Server Workgroup (SSWG) is a community-driven group that:
- Defines standards for server-side Swift packages
- Reviews and incubates server packages
- Maintains the Swift Server ecosystem

### SSWG incubation levels

| Level | Description |
|-------|-------------|
| **0: Sandbox** | Initial proposal, experimental |
| **1: Incubating** | Under development, seeking feedback |
| **2: Graduated** | Production-ready, stable API |

## Best practices

1. Use async/await for all asynchronous server code
2. Use actors for shared mutable state protection
3. Use `Sendable` conformance for data-race safety
4. Use environment variables for configuration
5. Use Docker for deployment consistency
6. Use the static Linux SDK for minimal container images
7. Prefer Vapor or Hummingbird for web frameworks
8. Use Fluent or direct database drivers for persistence
9. Enable Swift 6 language mode for complete concurrency safety
10. Use SwiftNIO for low-level networking when needed
11. Profile memory usage — Swift's low footprint is a key advantage
12. Use graceful shutdown handlers for cleanup
