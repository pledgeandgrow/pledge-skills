# Bun APIs — File I/O, SQLite, Streams, Fetch, Workers, Shell, Utilities

## File I/O

### Reading files (Bun.file)

```typescript
const file = Bun.file("foo.txt");

file.size;                    // number of bytes
file.type;                    // MIME type (e.g. "text/plain;charset=utf-8")

await file.text();           // contents as string
await file.json();           // contents as parsed JSON
await file.arrayBuffer();    // contents as ArrayBuffer
await file.bytes();          // contents as Uint8Array
file.stream();               // ReadableStream
await file.exists();         // boolean
```

### File from file descriptor

```typescript
const file = Bun.file(1234);  // file descriptor
```

### File from URL

```typescript
const file = Bun.file(new URL("./data.txt", import.meta.url));
```

### Stdin/stdout/stderr

```typescript
Bun.stdin;   // readonly BunFile
Bun.stdout;  // BunFile
Bun.stderr;  // BunFile
```

### Custom MIME type

```typescript
const file = Bun.file("data.json", { type: "application/json" });
file.type; // => "application/json;charset=utf-8"
```

### Deleting files

```typescript
const file = Bun.file("foo.txt");
await file.delete();
```

### Writing files (Bun.write)

```typescript
// Write a string
await Bun.write("output.txt", "Hello, world!");

// Write a BunFile (copy)
const input = Bun.file("input.txt");
await Bun.write("output.txt", input);

// Write Uint8Array
const data = new TextEncoder().encode("datadatadata");
await Bun.write("output.txt", data);

// Write a Response
const response = await fetch("https://bun.sh");
await Bun.write("index.html", response);

// Write to stdout
await Bun.write(Bun.stdout, "Hello!\n");
```

### Incremental writing with FileSink

```typescript
const file = Bun.file("output.txt");
const writer = file.writer();

writer.write("it was the best of times\n");
writer.write("it was the worst of times\n");
writer.flush();  // write buffer to disk
writer.end();    // close the file
```

### Directories

```typescript
// Create
await Bun.mkdir("path/to/dir", { recursive: true });

// Read
const entries = await Bun.readdir("./my-dir");
for (const entry of entries) {
  console.log(entry);
}
```

---

## SQLite

Bun natively implements a high-performance SQLite3 driver.

### Database

```typescript
import { Database } from "bun:sqlite";

const db = new Database("mydb.sqlite");

// In-memory
const memDb = new Database(":memory:");

// Read-only
const roDb = new Database("mydb.sqlite", { readonly: true });
```

### Queries

```typescript
// Run a query
db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");

// Query with parameters
const query = db.query("SELECT * FROM users WHERE id = ?");
const user = query.get(1);           // first row
const allUsers = query.all();        // all rows
query.run(1);                        // execute without returning rows
```

### Parameter binding

```typescript
const stmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
stmt.run("Alice", "alice@example.com");

// Named parameters
const stmt2 = db.prepare("SELECT * FROM users WHERE name = $name");
stmt2.all({ $name: "Alice" });
```

### .all(), .get(), .run()

```typescript
const query = db.query("SELECT * FROM users");

query.all();   // all rows as array
query.get();   // first row as object
query.run();   // execute, return metadata
```

### Iterate

```typescript
for (const row of db.query("SELECT * FROM users").iterate()) {
  console.log(row);
}
```

### Map results to a class

```typescript
class User {
  id: number;
  name: string;
  constructor(row: any) {
    this.id = row.id;
    this.name = row.name;
  }
}

const users = db.query("SELECT * FROM users").as(User).all();
// users: User[]
```

### Transactions

```typescript
db.transaction(() => {
  db.query("INSERT INTO users (name) VALUES (?)").run("Alice");
  db.query("INSERT INTO users (name) VALUES (?)").run("Bob");
})();
```

### Using statement

```typescript
using db = new Database("mydb.sqlite");
// db is automatically closed when out of scope
```

### Close

```typescript
db.close();
db.close(true);  // throw on error
```

### WAL mode

```typescript
db.exec("PRAGMA journal_mode = WAL");
```

### Load extension

```typescript
db.loadExtension("path/to/extension.so");
```

---

## Streams

Bun implements Web-standard Streams API:

### ReadableStream

```typescript
const stream = new ReadableStream({
  start(controller) {
    controller.enqueue("Hello");
    controller.enqueue("World");
    controller.close();
  },
});

for await (const chunk of stream) {
  console.log(chunk);
}
```

### ReadableStream from file

```typescript
const file = Bun.file("large.txt");
const stream = file.stream();

for await (const chunk of stream) {
  console.log(chunk);  // Uint8Array
}
```

### TransformStream

```typescript
const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

readable.pipeThrough(transform).pipeTo(writable);
```

---

## Fetch

Bun implements the Web-standard `fetch` API:

```typescript
const response = await fetch("https://api.example.com/data");
const data = await response.json();
```

### With options

```typescript
const response = await fetch("https://api.example.com/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Alice" }),
});
```

### Streaming response

```typescript
const response = await fetch("https://example.com/large-file");
const reader = response.body!.getReader();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log(value);  // Uint8Array
}
```

---

## Workers

Run JavaScript on a separate thread:

### Main thread

```typescript
const worker = new Worker(new URL("./worker.ts", import.meta.url));

worker.postMessage("Hello from main");

worker.onmessage = (event) => {
  console.log("From worker:", event.data);
};
```

### Worker thread (worker.ts)

```typescript
self.onmessage = (event) => {
  console.log("From main:", event.data);
  self.postMessage("Hello from worker");
};
```

### Terminate

```typescript
worker.terminate();
```

### Managing lifetime

```typescript
worker.unref();  // don't keep process alive waiting for worker
worker.ref();    // keep process alive
```

### Preload modules

```typescript
const worker = new Worker(new URL("./worker.ts", import.meta.url), {
  preload: ["./polyfill.ts"],
});
```

---

## Shell (Bun.shell)

Bun includes a shell for running commands:

```typescript
import { $ } from "bun";

// Run a command
const result = await $`echo "Hello"`;
console.log(result.stdout.toString());

// Pipe
const files = await $`ls -la | grep ".ts"`;

// Capture output
const text = (await $`echo "Hello"`).text();
```

### Shell with templates

```typescript
const name = "world";
await $`echo "Hello, ${name}!"`;
```

### Change directory

```typescript
$.cwd("/tmp");
await $`pwd`;  // /tmp
```

---

## Bun.spawn

Spawn child processes:

```typescript
const proc = Bun.spawn(["echo", "Hello"], {
  stdout: "pipe",
});

const output = await new Response(proc.stdout).text();
console.log(output);  // "Hello"
```

### With stdin

```typescript
const proc = Bun.spawn(["cat"], {
  stdin: "pipe",
});

proc.stdin!.write("Hello");
proc.stdin!.end();

const output = await new Response(proc.stdout).text();
```

### Wait for exit

```typescript
const proc = Bun.spawn(["ls", "-la"]);
const exitCode = await proc.exited;
```

---

## Utilities

### Hashing

```typescript
const hash = new Bun.CryptoHasher("sha256");
hash.update("Hello");
hash.digest("hex");  // hex string

// One-shot
const digest = Bun.hash("Hello", "sha256");
```

### Glob

```typescript
import { Glob } from "bun";

const glob = new Glob("**/*.ts");
for await (const path of glob.scan("./src")) {
  console.log(path);
}
```

### Semver

```typescript
import { Semver } from "bun";

Semver.satisfies("1.2.3", "^1.0.0");  // true
Semver.gt("1.2.3", "1.0.0");          // true
```

### Color

```typescript
import { Color } from "bun";

const c = new Color("#ff0000");
c.red;   // 255
c.green; // 0
c.blue;  // 0
```

### HTMLRewriter

```typescript
const rewriter = new HTMLRewriter()
  .on("h1", {
    element(el) {
      el.setInnerContent("Modified!");
    },
  });

const response = await fetch("https://example.com");
const modified = rewriter.transform(response);
```

### TOML

```typescript
import { TOML } from "bun";

const toml = TOML.parse(await Bun.file("config.toml").text());
```

### YAML

```typescript
import { YAML } from "bun";

const yaml = YAML.parse(await Bun.file("config.yaml").text());
```

### Markdown

```typescript
import { Markdown } from "bun";

const html = Markdown.parse("# Hello\n\n**Bold** text");
```

### Secrets

```typescript
import { secrets } from "bun";

const token = secrets.get("API_TOKEN");
secrets.set("API_TOKEN", "new-value");
```

### Console

```typescript
console.log("Hello");
console.table([{ a: 1, b: 2 }, { a: 3, b: 4 }]);
console.dir(obj, { depth: 5 });
```

---

## Utils (Bun utility functions)

### Bun.version

```typescript
Bun.version;  // => "1.3.3"
```

### Bun.revision

```typescript
Bun.revision;  // => "f02561530fda1ee9396f51c8bc99b38716e38296"
```

### Bun.env

```typescript
Bun.env;  // alias for process.env
```

### Bun.main

```typescript
Bun.main;  // => "/path/to/script.ts"

if (import.meta.path === Bun.main) {
  // this script is being directly executed
}
```

### Bun.sleep() / Bun.sleepSync()

```typescript
await Bun.sleep(1000);           // async, Promise-based
await Bun.sleep(new Date(Date.now() + 1000));  // sleep until Date

Bun.sleepSync(1000);             // sync, blocks thread
```

### Bun.which()

```typescript
const ls = Bun.which("ls");  // => "/usr/bin/ls"

// With custom PATH
const ls = Bun.which("ls", {
  PATH: "/usr/local/bin:/usr/bin:/bin",
});
```

### Bun.randomUUIDv7()

```typescript
import { randomUUIDv7 } from "bun";

const id = randomUUIDv7();  // => "0192ce11-26d5-7dc3-9305-1426de888c5a"
const buffer = randomUUIDv7("buffer");  // 16-byte Buffer
const base64 = randomUUIDv7("base64");
const base64url = randomUUIDv7("base64url");
```

### Bun.deepEquals()

```typescript
Bun.deepEquals({ a: 1, b: 2 }, { a: 1, b: 2 });  // true

// Strict mode (3rd arg)
Bun.deepEquals({ a: 1 }, { a: 1, b: undefined }, true);  // false
```

### Bun.escapeHTML()

```typescript
Bun.escapeHTML('<script>alert("xss")</script>');
// => "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
```

Escapes: `"` → `&quot;`, `&` → `&amp;`, `'` → `&#x27;`, `<` → `&lt;`, `>` → `&gt;`

### Bun.stringWidth()

```typescript
Bun.stringWidth("hello");  // => 5
Bun.stringWidth("你好");    // => 4 (wide characters)
```

### Bun.fileURLToPath() / Bun.pathToFileURL()

```typescript
Bun.fileURLToPath(new URL("file:///foo/bar.ts"));  // => "/foo/bar.ts"
Bun.pathToFileURL("/foo/bar.ts");  // => URL "file:///foo/bar.ts"
```

### Bun.inspect()

```typescript
const str = Bun.inspect({ foo: "bar" });
// => '{\n  foo: "bar"\n}'

Bun.inspect(new Uint8Array([1, 2, 3]));
// => "Uint8Array(3) [ 1, 2, 3 ]"

Bun.inspect.custom;  // Symbol for custom inspect

Bun.inspect.table([{ a: 1 }, { a: 2 }]);
```

### Bun.stripANSI() / Bun.wrapAnsi()

```typescript
Bun.stripANSI("\x1b[31mred\x1b[0m");  // => "red"

Bun.wrapAnsi("long text here", 20, {
  start: 0,
  end: 0,
});
```

### Compression

```typescript
// Gzip
const compressed = Bun.gzipSync(Buffer.from("hello".repeat(100)));
const decompressed = Bun.gunzipSync(compressed);

// Deflate
const deflated = Bun.deflateSync(data);
const inflated = Bun.inflateSync(deflated);

// Zstd
const zstd = Bun.zstdCompressSync(data);
const decompressed = Bun.zstdDecompressSync(zstd);

// Async variants
const zstdAsync = await Bun.zstdCompress(data);
const decompressedAsync = await Bun.zstdDecompress(zstdAsync);
```

### Bun.nanoseconds()

```typescript
Bun.nanoseconds();  // high-resolution timestamp in nanoseconds
```

### Bun.readableStreamTo*()

```typescript
const bytes = await Bun.readableStreamToBytes(stream);
const blob = await Bun.readableStreamToBlob(stream);
const json = await Bun.readableStreamToJSON(stream);
const formData = await Bun.readableStreamToFormData(stream);
const array = await Bun.readableStreamToArray(stream);
```

### Bun.resolveSync()

```typescript
Bun.resolveSync("./foo", "/path/to/dir");  // => "/path/to/dir/foo.ts"
```

### bun:jsc

```typescript
import { serialize, deserialize, estimateShallowMemoryUsageOf } from "bun:jsc";

const serialized = serialize({ foo: "bar" });
const obj = deserialize(serialized);
estimateShallowMemoryUsageOf(obj);  // bytes
```

---

## Globals

Bun implements all standard Web globals and Node.js globals:

**Web globals**: `AbortController`, `AbortSignal`, `Blob`, `ByteLengthQueuingStrategy`, `CountQueuingStrategy`, `Crypto`, `SubtleCrypto`, `CryptoKey`, `CustomEvent`, `DOMException`, `Event`, `EventTarget`, `ErrorEvent`, `CloseEvent`, `MessageEvent`, `MessageChannel`, `MessagePort`, `PerformanceEntry`, `PerformanceMark`, `PerformanceMeasure`, `PerformanceObserver`, `performance`, `ReadableStream`, `ReadableStreamBYOBReader`, `ReadableStreamDefaultReader`, `WritableStream`, `WritableStreamDefaultWriter`, `TransformStream`, `CompressionStream`, `DecompressionStream`, `TextDecoder`, `TextEncoder`, `TextDecoderStream`, `TextEncoderStream`, `URL`, `URLSearchParams`, `FormData`, `Headers`, `Request`, `Response`, `fetch`, `queueMicrotask`, `structuredClone`, `reportError`, `ShadowRealm`, `BroadcastChannel`, `confirm`, `prompt`, `WebAssembly`, `Atomics`

**Node.js globals**: `Buffer`, `process`, `global`, `globalThis`, `__dirname`, `__filename`, `require()`, `module`, `exports`, `setImmediate()`, `clearImmediate()`, `setInterval()`, `clearInterval()`, `setTimeout()`, `clearTimeout()`, `atob()`, `btoa()`

---

## Bun APIs Reference

All APIs available on the `Bun` global object:

**Core**: `Bun.serve`, `Bun.file`, `Bun.write`, `Bun.listen`, `Bun.connect`, `Bun.udpSocket`, `Bun.dns`, `Bun.cron`, `Bun.WebView`, `Bun.Transpiler`, `Bun.spawn`, `Bun.spawnSync`, `Bun.shell`, `Bun.peek`

**Data**: `bun:sqlite`, `sql` (PostgreSQL/MySQL), `Bun.S3Client`, `Bun.s3`, `Bun.RedisClient`, `Bun.Archive`, `Bun.Image`, `Bun.CookieMap`, `Bun.Cookie`, `Bun.CSRF`

**Utilities**: `Bun.version`, `Bun.revision`, `Bun.env`, `Bun.main`, `Bun.sleep`, `Bun.sleepSync`, `Bun.which`, `Bun.randomUUIDv7`, `Bun.deepEquals`, `Bun.escapeHTML`, `Bun.stringWidth`, `Bun.inspect`, `Bun.stripANSI`, `Bun.wrapAnsi`, `Bun.nanoseconds`, `Bun.resolveSync`, `Bun.fileURLToPath`, `Bun.pathToFileURL`

**Compression**: `Bun.gzipSync`, `Bun.gunzipSync`, `Bun.deflateSync`, `Bun.inflateSync`, `Bun.zstdCompress`, `Bun.zstdCompressSync`, `Bun.zstdDecompress`, `Bun.zstdDecompressSync`

**Streams**: `Bun.readableStreamToBytes`, `Bun.readableStreamToBlob`, `Bun.readableStreamToJSON`, `Bun.readableStreamToFormData`, `Bun.readableStreamToArray`

**Parsing**: `Bun.TOML`, `Bun.YAML`, `Bun.Markdown`, `Bun.JSON5`, `Bun.JSONL`, `Bun.HTMLRewriter`

**Other**: `Bun.semver`, `Bun.color`, `Bun.mmap`, `Bun.gc`, `Bun.generateHeapSnapshot`, `Bun.ArrayBufferSink`, `Bun.allocUnsafe`, `Bun.concatArrayBuffers`, `bun:ffi`, `bun:jsc`, `bun:sqlite`

---

## Web APIs

Bun implements Web-standard APIs for server-side JavaScript:

- **confirm()** / **prompt()** — interactive prompts (terminal)
- **ShadowRealm** — JavaScript sandbox with no access to host objects
- **EventTarget** / **Event** — DOM event system
- **ErrorEvent** / **CloseEvent** / **MessageEvent** — typed events
- **EventSource** — Server-Sent Events (SSE) client
- **CustomEvent** — events with custom data
- **BroadcastChannel** — cross-tab/cross-worker communication
