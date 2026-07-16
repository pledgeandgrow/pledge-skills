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
