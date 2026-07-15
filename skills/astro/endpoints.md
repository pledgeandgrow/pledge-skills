# Endpoints & API Routes

Endpoints serve any kind of data (JSON, XML, images, etc.) instead of HTML pages.

---

## Static File Endpoints

Create `.js`/`.ts` files in `src/pages/` that export a `GET` function:

```ts
// src/pages/api/users.json.ts
export async function GET() {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];
  return new Response(JSON.stringify(users), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

### With `params` and Dynamic Routing

```ts
// src/pages/api/users/[id].json.ts
export async function GET({ params }) {
  const user = await getUser(params.id);
  return new Response(JSON.stringify(user), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function getStaticPaths() {
  const users = await getAllUsers();
  return users.map(user => ({
    params: { id: user.id.toString() },
  }));
}
```

### `request` Object

```ts
export async function GET({ request }) {
  const url = new URL(request.url);
  const search = url.searchParams.get('q');
  const results = await searchUsers(search);
  return new Response(JSON.stringify(results));
}
```

---

## Server Endpoints (API Routes)

In SSR mode, endpoints support all HTTP methods:

```ts
// src/pages/api/users/[id].ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, request }) => {
  const user = await getUser(params.id);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify(user), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const user = await createUser(body);
  return new Response(JSON.stringify(user), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const PUT: APIRoute = async ({ params, request }) => {
  const body = await request.json();
  const user = await updateUser(params.id, body);
  return new Response(JSON.stringify(user));
};

export const DELETE: APIRoute = async ({ params }) => {
  await deleteUser(params.id);
  return new Response(null, { status: 204 });
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const body = await request.json();
  const user = await patchUser(params.id, body);
  return new Response(JSON.stringify(user));
};
```

---

## HTTP Methods

| Method | Export Name | Use Case |
|--------|-------------|----------|
| `GET` | `GET` | Retrieve data |
| `POST` | `POST` | Create resource |
| `PUT` | `PUT` | Replace resource |
| `PATCH` | `PATCH` | Partial update |
| `DELETE` | `DELETE` | Remove resource |
| `HEAD` | `HEAD` | Headers only, no body |
| `OPTIONS` | `OPTIONS` | CORS preflight |

---

## Request Object

```ts
export const POST: APIRoute = async ({ request }) => {
  // Method
  console.log(request.method); // 'POST'

  // Headers
  const auth = request.headers.get('Authorization');

  // Body (JSON)
  const data = await request.json();

  // Body (FormData)
  const formData = await request.formData();

  // Body (text)
  const text = await request.text();

  // URL / search params
  const url = new URL(request.url);
  const query = url.searchParams.get('q');

  // Cookies
  // (available via context, not request directly)
};
```

---

## Redirects from Endpoints

```ts
export const GET: APIRoute = async ({ redirect }) => {
  return redirect('/new-location', 301);
};
```

---

## Returning Different Content Types

### JSON

```ts
return new Response(JSON.stringify({ data }), {
  headers: { 'Content-Type': 'application/json' },
});
```

### XML

```ts
return new Response('<?xml version="1.0"?><rss>...</rss>', {
  headers: { 'Content-Type': 'application/xml' },
});
```

### Binary (e.g., generated image)

```ts
const buffer = generateImage();
return new Response(buffer, {
  headers: { 'Content-Type': 'image/png' },
});
```

### Streaming

```ts
export const GET: APIRoute = async () => {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue('data: hello\n\n');
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
};
```
