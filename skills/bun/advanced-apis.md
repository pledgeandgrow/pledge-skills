# Bun Advanced APIs — SQL, S3, Redis, TCP/UDP, Cron, FFI, Image, Archive, and more

## SQL (PostgreSQL, MySQL, SQLite)

Bun provides native bindings for SQL databases through a unified Promise-based tagged template API.

### Features

- Tagged template literals protect against SQL injection
- Transactions, named & positional parameters
- Connection pooling, BigInt support
- SASL (SCRAM-SHA-256), MD5, and Clear Text authentication
- TLS support, automatic configuration with environment variables

### Basic Usage

```typescript
import { sql } from "bun";

// Query
const users = await sql`SELECT * FROM users WHERE active = ${true}`;

// Insert
const [user] = await sql`
  INSERT INTO users (name, email) VALUES (${name}, ${email})
  RETURNING *
`;

// Object helper for inserts
const userData = { name: "Alice", email: "alice@example.com" };
const [newUser] = await sql`
  INSERT INTO users ${sql(userData)} RETURNING *
`;
```

### SQL Fragments

```typescript
// Dynamic table names
const table = "users";
const rows = await sql`SELECT * FROM ${sql(table)} WHERE id = ${1}`;

// Conditional queries
const active = true;
const results = await sql`
  SELECT * FROM users
  ${active ? sql`WHERE active = ${active}` : sql``}
`;

// Dynamic columns in updates
const updates = { name: "Bob", email: "bob@example.com" };
await sql`UPDATE users SET ${sql(updates)} WHERE id = ${1}`;

// sql.array helper
const ids = [1, 2, 3];
const users = await sql`SELECT * FROM users WHERE id IN ${sql.array(ids)}`;
```

### Query Result Formats

```typescript
// Default: array of objects
const users = await sql`SELECT * FROM users`;

// Values format: array of arrays
const rows = await sql`SELECT id, name FROM users`.values();

// Raw format: no parsing
const raw = await sql`SELECT 1`.raw();
```

### Transactions

```typescript
// Basic transaction
await sql.begin(async tx => {
  await tx`INSERT INTO users (name) VALUES (${"Alice"})`;
  await tx`INSERT INTO users (name) VALUES (${"Bob"})`;
});

// Savepoints
await sql.begin(async tx => {
  await tx`INSERT INTO users (name) VALUES (${"Alice"})`;
  await tx.savepoint(async sp => {
    await sp`INSERT INTO users (name) VALUES (${"Bob"})`;
  });
});
```

### Environment Variables

Bun auto-detects database URLs from environment variables:

```bash
# PostgreSQL
DATABASE_URL=postgres://user:pass@localhost:5432/mydb

# MySQL
DATABASE_URL=mysql://user:pass@localhost:3306/mydb

# SQLite
DATABASE_URL=sqlite://mydb.sqlite
```

### Connection Options

```typescript
import { sql } from "bun";

const pg = sql({
  url: "postgres://user:pass@localhost:5432/mydb",
  max: 10,              // connection pool size
  idleTimeout: 30,      // seconds
  connectionTimeout: 30, // seconds
  tls: { rejectUnauthorized: true },
});
```

---

## S3 (Object Storage)

Bun provides fast, native bindings for S3-compatible object storage.

### Client Setup

```typescript
import { S3Client } from "bun";

const client = new S3Client({
  accessKeyId: "your-access-key",
  secretAccessKey: "your-secret-key",
  bucket: "my-bucket",
  // endpoint: "https://s3.us-east-1.amazonaws.com",  // AWS S3
  // endpoint: "https://<account-id>.r2.cloudflarestorage.com",  // Cloudflare R2
  // endpoint: "https://<region>.digitaloceanspaces.com",  // DigitalOcean
  // endpoint: "http://localhost:9000",  // MinIO
});

// Bun.s3 is a global singleton
import { s3 } from "bun";
```

### Reading from S3

```typescript
const s3file = client.file("123.json");

const text = await s3file.text();
const json = await s3file.json();
const buffer = await s3file.arrayBuffer();
const partial = await s3file.slice(0, 1024).text();
const stream = s3file.stream();
```

### Writing to S3

```typescript
// Write a string
await s3file.write("Hello World!");

// Write with content type
await s3file.write(JSON.stringify({ name: "John" }), {
  type: "application/json",
});

// Write with content encoding (pre-compressed)
await s3file.write(compressedData, {
  type: "application/json",
  contentEncoding: "gzip",
});

// Streaming write
const writer = s3file.writer({ type: "application/json" });
writer.write("Hello");
writer.write(" World!");
await writer.end();

// Using Bun.write
await Bun.write(s3file, "Hello World!");
```

### Presigning URLs

```typescript
const url = client.presign("file.pdf", {
  expiresIn: 3600,  // 1 hour
  method: "GET",
});
```

### S3-Compatible Services

| Service | Endpoint |
|---------|----------|
| AWS S3 | `https://s3.<region>.amazonaws.com` |
| Cloudflare R2 | `https://<account-id>.r2.cloudflarestorage.com` |
| DigitalOcean Spaces | `https://<region>.digitaloceanspaces.com` |
| MinIO | `http://localhost:9000` |
| Supabase | `https://<project>.supabase.co/storage/v1/s3` |
| Google Cloud Storage | `https://storage.googleapis.com` |

### s3:// protocol

```typescript
const file = Bun.file("s3://my-bucket/path/to/file.txt");
await file.text();
```

### Static methods

```typescript
await S3Client.write("bucket/key", "data");
await S3Client.delete("bucket/key");
await S3Client.exists("bucket/key");
const size = await S3Client.size("bucket/key");
const stat = await S3Client.stat("bucket/key");
const list = await S3Client.list("bucket/prefix/");
```

---

## Redis

Bun includes a native Redis client with a Promise-based API.

### Getting Started

```typescript
import { RedisClient } from "bun";

const redis = new RedisClient("redis://localhost:6379");

// Or from environment variable
// REDIS_URL=redis://localhost:6379
```

### String Operations

```typescript
await redis.set("key", "value");
const value = await redis.get("key");
await redis.del("key");
await redis.incr("counter");
await redis.expire("key", 60);  // 60 seconds
```

### Hash Operations

```typescript
await redis.hset("user:1", { name: "Alice", age: 30 });
const user = await redis.hgetall("user:1");
const name = await redis.hget("user:1", "name");
```

### Set Operations

```typescript
await redis.sadd("tags", "web", "api", "backend");
const tags = await redis.smembers("tags");
const isMember = await redis.sismember("tags", "web");
```

### Pub/Sub

```typescript
// Subscribe
const sub = new RedisClient("redis://localhost:6379");
await sub.subscribe("updates");
sub.on("message", (channel, message) => {
  console.log(`${channel}: ${message}`);
});

// Publish
await redis.publish("updates", "Hello!");
```

### Pipelining

```typescript
const results = await redis.pipeline([
  ["set", "key1", "value1"],
  ["set", "key2", "value2"],
  ["get", "key1"],
]);
```

---

## TCP

Bun provides native TCP sockets for performance-sensitive systems.

### Start a server (Bun.listen)

```typescript
Bun.listen({
  hostname: "localhost",
  port: 8080,
  socket: {
    data(socket, data) {},       // message received
    open(socket) {},             // socket opened
    close(socket, error) {},     // socket closed
    drain(socket) {},            // ready for more data
    error(socket, error) {},     // error handler
  },
});
```

### With typed socket data

```typescript
type SocketData = { sessionId: string };

Bun.listen<SocketData>({
  hostname: "localhost",
  port: 8080,
  socket: {
    data(socket, data) {
      socket.write(`${socket.data.sessionId}: ack`);
    },
    open(socket) {
      socket.data = { sessionId: "abcd" };
    },
  },
});
```

### TLS

```typescript
Bun.listen({
  hostname: "localhost",
  port: 8080,
  socket: { data(socket, data) {} },
  tls: {
    key: Bun.file("./key.pem"),
    cert: Bun.file("./cert.pem"),
  },
});
```

### Create a connection (Bun.connect)

```typescript
const socket = await Bun.connect({
  hostname: "localhost",
  port: 8080,
  socket: {
    data(socket, data) {},
    open(socket) {},
    close(socket, error) {},
    drain(socket) {},
    error(socket, error) {},
    connectError(socket, error) {},  // connection failed
    end(socket) {},                  // closed by server
    timeout(socket) {},              // timed out
  },
});

// With TLS
const socket = await Bun.connect({
  hostname: "localhost",
  port: 443,
  tls: true,
  socket: { /* handlers */ },
});
```

### Server lifecycle

```typescript
const server = Bun.listen({ /* config */ });
server.stop(true);   // stop, close active connections
server.unref();      // let process exit even if listening
```

---

## UDP

```typescript
// Bind a UDP socket
const socket = await Bun.udpSocket({
  port: 41234,
});

// Send a datagram
socket.send("Hello, world!", 41234, "127.0.0.1");

// Receive datagrams
const server = await Bun.udpSocket({
  socket: {
    data(socket, buf, port, addr) {
      console.log(`message from ${addr}:${port}:`);
      console.log(buf.toString());
    },
  },
});
```

### Connected UDP

```typescript
const client = await Bun.udpSocket({
  connect: {
    port: server.port,
    hostname: "127.0.0.1",
  },
});
client.send("Hello");
```

### Send many packets

```typescript
// Unconnected: [data, port, addr, data, port, addr, ...]
socket.sendMany(["Hello", 41234, "127.0.0.1", "foo", 53, "1.1.1.1"]);

// Connected: [data, data, ...]
socket.sendMany(["foo", "bar", "baz"]);
```

### Socket options

```typescript
socket.setBroadcast(true);  // enable broadcasting
socket.setTTL(64);          // set IP TTL
```

### Multicast

```typescript
const socket = await Bun.udpSocket({
  port: 41234,
  socket: {
    data(socket, buf, port, addr) {},
  },
});
socket.addMembership("224.0.0.1");
```

---

## DNS

```typescript
const result = await Bun.dns.resolve("example.com", "A");
// ["93.184.216.34"]

const mx = await Bun.dns.resolve("example.com", "MX");
const txt = await Bun.dns.resolve("example.com", "TXT");
const cname = await Bun.dns.resolve("www.example.com", "CNAME");
```

---

## Cron

Schedule tasks with cron expressions.

### In-process cron

```typescript
const job = Bun.cron("0 * * * *", async () => {
  await cleanupTempFiles();
});

const job2 = Bun.cron("*/5 * * * *", async () => {
  await syncToDatabase();
});
```

### OS-level cron

```typescript
await Bun.cron("./worker.ts", "30 2 * * MON", "weekly-report");
```

### Parse cron expression

```typescript
const next = Bun.cron.parse("*/15 * * * *");
console.log(next);  // next quarter-hour boundary

const next2 = Bun.cron.parse("30 9 * * MON-FRI");
```

### Cron expression syntax

```
┌──────── minute (0-59)
│ ┌────── hour (0-23)
│ │ ┌──── day of month (1-31)
│ │ │ ┌── month (1-12 or JAN-DEC)
│ │ │ │ ┌ day of week (0-6 or SUN-SAT)
│ │ │ │ │
* * * * *
```

Special characters:
- `*` — any value
- `,` — list separator
- `-` — range
- `/` — step values
- `?` — "no specific value" (for day fields)

Predefined nicknames:
- `@yearly` / `@annually` — `0 0 1 1 *`
- `@monthly` — `0 0 1 * *`
- `@weekly` — `0 0 * * 0`
- `@daily` / `@midnight` — `0 0 * * *`
- `@hourly` — `0 * * * *`

### Remove a cron job

```typescript
job.stop();
```

---

## WebView

Control a headless browser from Bun — zero dependencies on macOS (WebKit), Chrome DevTools Protocol elsewhere.

```typescript
const view = new Bun.WebView({
  width: 1280,
  height: 720,
  url: "https://bun.com",
});
```

### Navigation

```typescript
await view.navigate("https://example.com");
view.url;  // current URL

// History
await view.goBack();
await view.goForward();
await view.reload();
```

### Evaluate JavaScript

```typescript
const result = await view.evaluate("document.title");
```

### Screenshots

```typescript
const screenshot = await view.screenshot();
// Returns Blob (PNG by default)
```

### Input simulation

```typescript
await view.click(100, 200);          // x, y coordinates
await view.type("Hello, world!");     // type text
await view.press("Enter");            // press key
await view.scroll(0, 500);            // scroll down
await view.resize(1920, 1080);        // resize viewport
```

### Console capture

```typescript
view.on("console", (message) => {
  console.log("[WebView]", message);
});
```

### Lifecycle

```typescript
view.close();              // close the view
Bun.WebView.killAll();     // kill all browser processes
```

---

## FFI (Foreign Function Interface)

Call native libraries from JavaScript.

```typescript
import { dlopen, FFIType, suffix } from "bun:ffi";

const path = `libsqlite3.${suffix}`;
const { symbols: { sqlite3_libversion } } = dlopen(path, {
  sqlite3_libversion: {
    args: [],
    returns: FFIType.cstring,
  },
});

console.log(`SQLite 3 version: ${sqlite3_libversion()}`);
```

### FFI Types

```typescript
enum FFIType {
  cstring = "cstring",
  function = "function",
  i32 = "i32",
  i64 = "i64",
  f32 = "f32",
  f64 = "f64",
  ptr = "ptr",
  void = "void",
  bool = "bool",
}
```

### Callbacks

```typescript
import { dlopen, FFIType, JSCallback } from "bun:ffi";

const callback = new JSCallback((a, b) => a + b, {
  args: [FFIType.i32, FFIType.i32],
  returns: FFIType.i32,
});
```

### C Compiler (cc)

Compile and run C from JavaScript:

```typescript
import { cc } from "bun:ffi";
import source from "./hello.c" with { type: "file" };

const { symbols: { hello } } = cc({
  source,
  symbols: {
    hello: { args: [], returns: "int" },
  },
});

console.log("Answer:", hello());  // 42
```

```c
// hello.c
int hello() { return 42; }
```

---

## Transpiler

Programmatically transpile JavaScript and TypeScript.

```typescript
const transpiler = new Bun.Transpiler({ loader: "tsx" });

const code = `
  export function Home(props: {title: string}) {
    return <p>{props.title}</p>;
  }
`;

// Sync
const result = transpiler.transformSync(code);

// Async
const result2 = await transpiler.transform(code);
```

### Scan imports

```typescript
const transpiler = new Bun.Transpiler({ loader: "tsx" });

const result = transpiler.scan(code);
// {
//   "exports": ["name"],
//   "imports": [
//     { "kind": "import-statement", "path": "react" },
//     { "kind": "dynamic-import", "path": "./loader" }
//   ]
// }

const imports = transpiler.scanImports(code);
// [
//   { "kind": "import-statement", "path": "react" },
//   { "kind": "require-call", "path": "./cjs.js" },
//   { "kind": "dynamic-import", "path": "./loader" }
// ]
```

Import kinds: `import-statement`, `require-call`, `require-resolve`, `dynamic-import`, `import-rule`, `url-token`.

---

## Image Processing

Decode, transform, and encode images with a fast native pipeline.

```typescript
const img = new Bun.Image("./photo.jpg");
// or: Bun.file("photo.jpg").image()
// or: new Bun.Image(buffer)
// or: new Bun.Image(Bun.file("photo.jpg"))
```

### Metadata

```typescript
const { width, height, format } = await img.metadata();
// { width: 1920, height: 1080, format: "jpeg" }
```

### Resize

```typescript
img.resize(800);                                    // width 800, keep aspect ratio
img.resize(800, 600);                               // exactly 800×600
img.resize(800, 600, { fit: "inside" });            // fit within 800×600
img.resize(800, 600, { withoutEnlargement: true }); // never upscale
img.resize(800, 600, { filter: "mitchell" });
```

Fit options: `"fill"`, `"inside"`, `"outside"`, `"cover"`, `"contain"`
Filters: `"lanczos3"`, `"lanczos2"`, `"mitchell"`, `"cubic"`, `"bilinear"`, `"linear"`, `"box"`, `"nearest"`

### Rotate and flip

```typescript
img.rotate(90);  // 90° clockwise (multiples of 90 only)
img.flip();      // mirror vertically
img.flop();      // mirror horizontally
```

### Modulate

```typescript
img.modulate({
  brightness: 1.2,   // 1 = unchanged
  saturation: 0,     // 0 = greyscale, 1 = unchanged
});
```

### Output formats

```typescript
await img.jpeg({ quality: 85 });              // 1–100, default 80
await img.png({ compressionLevel: 6 });        // zlib level 0–9
await img.png({ palette: true, colors: 64 });  // indexed PNG
await img.webp({ quality: 80 });
await img.webp({ lossless: true });
await img.heic({ quality: 80 });               // macOS / Windows only
await img.avif({ quality: 60 });               // macOS / Windows only
```

### Bun.serve integration

```typescript
Bun.serve({
  routes: {
    "/photo.jpg": async (req) => {
      const img = new Bun.Image(Bun.file("./photo.jpg"));
      const resized = img.resize(400, 300);
      return new Response(await resized.jpeg({ quality: 80 }));
    },
  },
});
```

---

## Archive (tar)

Create and extract tar archives.

### Quickstart

```typescript
// Create
const archive = new Bun.Archive({
  "hello.txt": "Hello, World!",
  "data.json": JSON.stringify({ foo: "bar" }),
  "nested/file.txt": "Nested content",
});
await Bun.write("bundle.tar", archive);

// Extract
const tarball = await Bun.file("package.tar.gz").bytes();
const archive = new Bun.Archive(tarball);
const entryCount = await archive.extract("./output");

// Read contents
const files = await archive.files();
for (const [path, file] of files) {
  console.log(`${path}: ${await file.text()}`);
}
```

### Creating archives

Supported content types: strings, Blobs, `ArrayBufferView` (Uint8Array), `ArrayBuffer`.

```typescript
const archive = new Bun.Archive({
  "text.txt": "Plain text",
  "blob.bin": new Blob([data]),
  "bytes.bin": new Uint8Array([1, 2, 3, 4]),
  "buffer.bin": new ArrayBuffer(8),
});
```

### Compression

```typescript
// Gzip compressed
await Bun.write("bundle.tar.gz", archive.gzip());

// Zstd compressed
await Bun.write("bundle.tar.zst", archive.zstd());
```

### Extracting

```typescript
const archive = new Bun.Archive(await Bun.file("file.tar").bytes());
const count = await archive.extract("./output");

// Filter extracted files
const count = await archive.extract("./output", {
  filter: (path) => path.endsWith(".ts"),
});
```

---

## Binary Data

### ArrayBuffer

```typescript
const buf = new ArrayBuffer(8);
buf.byteLength;  // 8
const slice = buf.slice(0, 4);  // new ArrayBuffer
```

### DataView

```typescript
const view = new DataView(new ArrayBuffer(8));
view.setInt32(0, 42);
view.getFloat64(0);
```

### TypedArray (Uint8Array)

```typescript
const arr = new Uint8Array([1, 2, 3, 4]);
arr.byteLength;  // 4
arr[0];          // 1
```

### Buffer (Node.js)

```typescript
import { Buffer } from "node:buffer";
const buf = Buffer.from("Hello");
buf.toString();  // "Hello"
```

### Blob

```typescript
const blob = new Blob(["Hello, world!"], { type: "text/plain" });
await blob.text();  // "Hello, world!"
blob.size;          // 13
blob.type;          // "text/plain"
```

### Conversion

```typescript
// ArrayBuffer to Uint8Array
const buf = new ArrayBuffer(8);
const arr = new Uint8Array(buf);

// Uint8Array to Buffer
const buf = Buffer.from(arr);

// Blob to ArrayBuffer
const buf = await blob.arrayBuffer();

// ReadableStream to Uint8Array
const reader = stream.getReader();
const chunks = [];
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  chunks.push(value);
}
const result = new Uint8Array(chunks.reduce((acc, c) => acc + c.length, 0));
let offset = 0;
for (const chunk of chunks) {
  result.set(chunk, offset);
  offset += chunk.length;
}
```

---

## Cookies (CookieMap)

### CookieMap class

```typescript
// Empty
const cookies = new Bun.CookieMap();

// From cookie string
const cookies1 = new Bun.CookieMap("name=value; foo=bar");

// From object
const cookies2 = new Bun.CookieMap({ session: "abc123", theme: "dark" });

// From array of pairs
const cookies3 = new Bun.CookieMap([
  ["session", "abc123"],
  ["theme", "dark"],
]);
```

### In HTTP servers

```typescript
Bun.serve({
  routes: {
    "/profile": req => {
      const userId = req.cookies.get("user_id");
      const theme = req.cookies.get("theme") || "light";
      return Response.json({ userId, theme });
    },
    "/login": req => {
      req.cookies.set("user_id", "12345", {
        maxAge: 60 * 60 * 24 * 7,  // 1 week
        httpOnly: true,
        secure: true,
        path: "/",
      });
      return new Response("Login successful");
    },
    "/logout": req => {
      req.cookies.delete("user_id", { path: "/" });
      return new Response("Logged out");
    },
  },
});
```

### Cookie class

```typescript
const cookie = new Bun.Cookie("name", "value", {
  maxAge: 3600,
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  path: "/",
});

cookie.name;   // "name"
cookie.value;  // "value"
cookie.toString();  // "name=value; Max-Age=3600; Path=/; HttpOnly; Secure; SameSite=Strict"
```

---

## CSRF Protection

```typescript
// Generate a token
const token = Bun.CSRF.generate("my-secret-key");

// With options
const token = Bun.CSRF.generate("my-secret", {
  sessionId: "user-session-id",
  expiresIn: 60 * 60 * 1000,  // 1 hour
  encoding: "hex",
  algorithm: "sha512",
});

// Verify
const isValid = Bun.CSRF.verify(token, { secret: "my-secret-key" });

// With session binding
const isValid = Bun.CSRF.verify(token, {
  secret: "my-secret",
  sessionId: "user-session-id",
  maxAge: 60 * 1000,  // reject tokens older than 1 minute
});
```

### With Bun.serve

```typescript
Bun.serve({
  routes: {
    "/form": () => {
      const token = Bun.CSRF.generate("secret");
      return new Response(`<form><input type="hidden" name="_csrf" value="${token}"></form>`, {
        headers: { "Content-Type": "text/html" },
      });
    },
    "/submit": async req => {
      const body = await req.formData();
      const token = body.get("_csrf") as string;
      if (!Bun.CSRF.verify(token, { secret: "secret" })) {
        return new Response("Invalid CSRF token", { status: 403 });
      }
      return new Response("OK");
    },
  },
});
```

---

## JSON5

```typescript
import { JSON5 } from "bun";

const data = JSON5.parse(`{
  // comments supported
  name: 'my-app',
  version: '1.0.0',
  debug: true,
  tags: ['web', 'api',],  // trailing commas OK
}`);

const str = JSON5.stringify({ name: "my-app" });
// {name:'my-app'}

const pretty = JSON5.stringify(data, null, 2);
```

Supported JSON5 features: comments (`//` and `/* */`), trailing commas, unquoted keys, single-quoted strings, multi-line strings, hex numbers (`0xFF`), leading/trailing decimals (`.5`, `5.`), `Infinity`/`NaN`, explicit `+` sign.

### Import JSON5 files

```typescript
// ES module
import config from "./config.json5";

// CommonJS
const config = require("./config.json5");
```

---

## JSONL

```typescript
import { JSONL } from "bun";

const data = JSONL.parse(`{"name":"Alice"}\n{"name":"Bob"}\n{"name":"Charlie"}`);
// [{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }]

const text = JSONL.stringify([{ a: 1 }, { b: 2 }]);
// '{"a":1}\n{"b":2}'
```

---

## Node-API

Bun supports Node-API (N-API) for native add-ons:

```typescript
// Native .node addons work in Bun
import addon from "./build/Release/addon.node";
console.log(addon.hello());  // "world"
```

Bun implements the Node-API specification so most native Node.js addons work without modification.

---

## Node.js Compatibility

Bun implements built-in Node.js modules:

**Fully supported**: `node:assert`, `node:buffer`, `node:console`, `node:events`, `node:fs`, `node:path`, `node:process`, `node:stream`, `node:url`, `node:util`, `node:tty`, `node:string_decoder`, `node:timers`, `node:zlib`, `node:os`, `node:querystring`, `node:punycode`, `node:readline`, `node:diagnostics_channel`, `node:dgram`, `node:crypto`, `node:http`, `node:https`, `node:net`, `node:tls`, `node:child_process`, `node:worker_threads`, `node:async_hooks`, `node:module`, `node:vm`, `node:wasi`

**Partial**: `node:cluster`, `node:domain`, `node:http2`, `node:inspector`, `node:perf_hooks`, `node:repl`, `node:test`, `node:v8`, `node:sqlite`

**Node.js globals**: `Buffer`, `process`, `__dirname`, `__filename`, `require()`, `module`, `exports`, `global`, `clearImmediate`, `clearInterval`, `clearTimeout`, `setImmediate`, `setInterval`, `setTimeout`, `queueMicrotask`, `structuredClone`, `atob`, `btoa`, `fetch`, `URL`, `URLSearchParams`, `TextEncoder`, `TextDecoder`, `AbortController`, `AbortSignal`, `Blob`, `Crypto`, `SubtleCrypto`, `Event`, `EventTarget`, `CustomEvent`, `MessageChannel`, `MessagePort`, `ReadableStream`, `WritableStream`, `TransformStream`, `FormData`, `Headers`, `Request`, `Response`, `WebAssembly`
