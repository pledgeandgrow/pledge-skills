# Bun HTTP Server

`Bun.serve` starts a high-performance HTTP server with built-in routing.

## Basic Setup

```typescript
const server = Bun.serve({
  port: 3000,
  routes: {
    // Static routes
    "/api/status": new Response("OK"),

    // Dynamic routes
    "/users/:id": req => {
      return new Response(`Hello User ${req.params.id}!`);
    },

    // Per-HTTP method handlers
    "/api/posts": {
      GET: () => new Response("List posts"),
      POST: async req => {
        const body = await req.json();
        return Response.json({ created: true, ...body });
      },
    },

    // Wildcard route
    "/api/*": Response.json({ message: "Not found" }, { status: 404 }),

    // Redirect
    "/blog/hello": Response.redirect("/blog/hello/world"),

    // Serve a file
    "/favicon.ico": Bun.file("./favicon.ico"),
  },

  // Fallback for unmatched routes
  fetch(req) {
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at ${server.url}`);
```

## HTML Imports

Import HTML files directly as route handlers:

```typescript
import index from "./index.html";

Bun.serve({
  routes: {
    "/": index,
  },
});
```

Bun's bundler processes the HTML and its referenced assets (JS, CSS, images) automatically.

### Full-stack dev server

```typescript
import frontend from "./index.html";
import figlet from "figlet";

Bun.serve({
  port: 3000,
  routes: {
    "/": frontend,
    "/api/banner": () => new Response(figlet.textSync("Bun!")),
  },
  development: true,  // enable hot reload
});
```

## Configuration

### Port and hostname

```typescript
Bun.serve({
  port: 3000,
  hostname: "0.0.0.0",
  fetch: () => new Response("Hello"),
});
```

### Default port via environment

```bash
PORT=8080 bun run index.ts
```

### Unix domain sockets

```typescript
Bun.serve({
  unix: "/tmp/bun.sock",
  fetch: () => new Response("Hello"),
});
```

### TLS / HTTPS

```typescript
Bun.serve({
  port: 443,
  tls: {
    cert: Bun.file("./cert.pem"),
    key: Bun.file("./key.pem"),
  },
  fetch: () => new Response("Secure Hello"),
});
```

### HTTP/3 (QUIC)

```typescript
Bun.serve({
  port: 3000,
  http3: true,
  fetch: () => new Response("HTTP/3!"),
});
```

## export default syntax

```typescript
export default {
  port: 3000,
  routes: {
    "/": () => new Response("Bun!"),
  },
};
```

Run with:

```bash
bun run index.ts
```

## Hot Route Reloading

```bash
bun run --hot index.ts
```

With `--hot`, route handlers are reloaded without restarting the process.

## Server Lifecycle Methods

### server.stop()

```typescript
server.stop();          // graceful shutdown
server.stop(true);      // force immediate shutdown
```

### server.reload()

```typescript
server.reload({
  routes: {
    "/": () => new Response("Updated!"),
  },
});
```

### server.ref() and server.unref()

```typescript
server.unref();  // don't keep process alive
server.ref();    // keep process alive
```

## Per-Request Controls

### server.timeout()

```typescript
server.timeout(request, 30);  // 30 second timeout for this request
```

### server.requestIP()

```typescript
const ip = server.requestIP(request);
// { address: "127.0.0.1", family: "IPv4", port: 12345 }
```

## Server Metrics

```typescript
const server = Bun.serve({
  port: 3000,
  development: false,
  fetch: () => new Response("Hello"),
});

// Access metrics
console.log(server.pendingRequests);
console.log(server.pendingWebSockets);
console.log(server.subscriberCount("updates"));
```

## WebSockets

```typescript
Bun.serve({
  port: 3000,
  routes: {
    "/ws": (req, server) => {
      if (server.upgrade(req)) {
        return; // upgrade successful
      }
      return new Response("WebSocket upgrade failed", { status: 400 });
    },
  },
  websocket: {
    open(ws) {
      ws.subscribe("updates");
      ws.publish("updates", "New user joined");
    },
    message(ws, message) {
      ws.publish("updates", message);
    },
    close(ws) {
      ws.unsubscribe("updates");
    },
  },
});
```

### WebSocket methods

```typescript
ws.send("Hello");                    // send to this client
ws.publish("topic", "data");         // send to all subscribers of topic
ws.subscribe("topic");               // subscribe to a topic
ws.unsubscribe("topic");             // unsubscribe
ws.close();                          // close connection
```

## Cookies

Bun.serve provides built-in cookie support via `req.cookies` (a `CookieMap`):

### Reading cookies

```typescript
Bun.serve({
  routes: {
    "/profile": req => {
      const userId = req.cookies.get("user_id");
      const theme = req.cookies.get("theme") || "light";
      return Response.json({ userId, theme });
    },
  },
});
```

### Setting cookies

```typescript
Bun.serve({
  routes: {
    "/login": req => {
      req.cookies.set("user_id", "12345", {
        maxAge: 60 * 60 * 24 * 7,  // 1 week
        httpOnly: true,
        secure: true,
        path: "/",
      });
      req.cookies.set("theme", "dark");
      // Modified cookies are automatically applied to the response
      return new Response("Login successful");
    },
  },
});
```

### Deleting cookies

```typescript
Bun.serve({
  routes: {
    "/logout": req => {
      req.cookies.delete("user_id", { path: "/" });
      return new Response("Logged out");
    },
  },
});
```

### CookieMap class

```typescript
// Create standalone
const cookies = new Bun.CookieMap("name=value; foo=bar");
const cookies2 = new Bun.CookieMap({ session: "abc123", theme: "dark" });

// Iterate
for (const [name, value] of req.cookies) {
  console.log(`${name}: ${value}`);
}
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
cookie.toString();
// "name=value; Max-Age=3600; Path=/; HttpOnly; Secure; SameSite=Strict"
```

## Error Handling

```typescript
Bun.serve({
  port: 3000,
  routes: {
    "/": () => new Response("OK"),
  },
  error(request) {
    return new Response("Custom error page", { status: 500 });
  },
});
```

## Practical Example: REST API

```typescript
interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

Bun.serve({
  port: 3000,
  routes: {
    "/api/users": {
      GET: () => Response.json(users),
      POST: async req => {
        const body = await req.json();
        const user = { id: users.length + 1, ...body };
        users.push(user);
        return Response.json(user, { status: 201 });
      },
    },
    "/api/users/:id": {
      GET: req => {
        const user = users.find(u => u.id === +req.params.id);
        if (!user) return Response.json({ error: "Not found" }, { status: 404 });
        return Response.json(user);
      },
      DELETE: req => {
        const idx = users.findIndex(u => u.id === +req.params.id);
        if (idx === -1) return Response.json({ error: "Not found" }, { status: 404 });
        users.splice(idx, 1);
        return new Response(null, { status: 204 });
      },
    },
  },
});
```
