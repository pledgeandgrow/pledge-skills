# Actions

Actions are type-safe server functions callable from the client, HTML forms, or Astro components.

---

## Basic Usage

Actions are defined in `src/actions/index.ts`:

```ts
import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';

export const server = {
  like: defineAction({
    input: z.object({ postId: z.string() }),
    handler: async (input) => {
      const likes = await incrementLikes(input.postId);
      return { likes };
    },
  }),

  createPost: defineAction({
    input: z.object({
      title: z.string().min(1),
      content: z.string().min(1),
    }),
    handler: async (input) => {
      const post = await db.posts.create(input);
      return { id: post.id };
    },
  }),
};
```

### Calling Actions from Client

```astro
---
---
<script>
  import { actions } from 'astro:actions';

  async function handleLike() {
    const { data, error } = await actions.like({ postId: '123' });
    if (error) {
      console.error(error.message);
      return;
    }
    console.log('Likes:', data.likes);
  }
</script>

<button onclick="handleLike()">Like</button>
```

---

## Handling Returned Data

Actions return `{ data, error }`:

```ts
const { data, error } = await actions.createPost({
  title: 'Hello',
  content: 'World',
});

if (error) {
  console.error(error.message);
  return;
}
console.log('Created post:', data.id);
```

### Checking for Errors

```ts
const result = await actions.like({ postId: '123' });
if (result.error) {
  // Handle error
  switch (result.error.type) {
    case 'NOT_FOUND':
      // ...
      break;
    case 'UNAUTHORIZED':
      // ...
      break;
  }
}
```

### Accessing Data Directly

```ts
// Throws if error occurs
const { data } = await actions.like({ postId: '123' });
console.log(data.likes);
```

---

## Organizing Actions

Split actions into multiple files:

```ts
// src/actions/blog.ts
import { defineAction } from 'astro:actions';
export const blog = {
  create: defineAction({ /* ... */ }),
  delete: defineAction({ /* ... */ }),
};
```

```ts
// src/actions/index.ts
import { blog } from './blog';
export const server = {
  blog,
};
```

---

## Accepting Form Data

Actions can accept `FormData` from HTML forms:

```ts
export const server = {
  subscribe: defineAction({
    accept: 'form',
    input: z.object({
      email: z.string().email(),
      name: z.string().optional(),
    }),
    handler: async (input) => {
      await addSubscriber(input.email, input.name);
      return { success: true };
    },
  }),
};
```

### Using Validators with Form Inputs

```astro
<form action="/api/actions/subscribe" method="POST">
  <input type="email" name="email" required />
  <input type="text" name="name" />
  <button type="submit">Subscribe</button>
</form>
```

### Validating Form Data

```ts
subscribe: defineAction({
  accept: 'form',
  input: z.object({
    email: z.string().email('Please enter a valid email'),
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  }),
  handler: async (input) => {
    // input is already validated
    return { success: true };
  },
});
```

### Displaying Form Input Errors

```astro
---
import { getActionResult } from 'astro:actions';
const result = getActionResult('subscribe');
---
{result?.error && (
  <p class="error">{result.error.fields?.email}</p>
)}
```

---

## Call Actions from HTML Forms

```astro
<form action="/api/actions/subscribe" method="POST">
  <input type="email" name="email" required />
  <button type="submit">Subscribe</button>
</form>
```

### Redirect on Action Success

```ts
subscribe: defineAction({
  accept: 'form',
  input: z.object({ email: z.string().email() }),
  handler: async (input, context) => {
    await addSubscriber(input.email);
    return context.redirect('/welcome');
  },
});
```

### Handle Form Action Errors

Astro automatically re-renders the page with error data available via `getActionResult()`.

### Persist Action Results with a Session

```ts
import { defineAction } from 'astro:actions';

subscribe: defineAction({
  accept: 'form',
  input: z.object({ email: z.string().email() }),
  handler: async (input, context) => {
    const session = context.session;
    await session?.set('subscribed', true);
    return { success: true };
  },
});
```

---

## Security

### Authorize Users

```ts
deletePost: defineAction({
  input: z.object({ id: z.string() }),
  handler: async (input, context) => {
    const user = context.locals.user;
    if (!user) {
      throw new ActionError({ code: 'UNAUTHORIZED', message: 'Must be logged in' });
    }
    if (!user.isAdmin) {
      throw new ActionError({ code: 'FORBIDDEN', message: 'Admin only' });
    }
    await db.posts.delete(input.id);
    return { success: true };
  },
});
```

### Gate Actions from Middleware

```js
// src/middleware.ts
export function onRequest(context, next) {
  if (context.url.pathname.startsWith('/api/actions/') && !context.locals.user) {
    return new Response('Unauthorized', { status: 401 });
  }
  return next();
}
```

---

## Call Actions from Components and Endpoints

```astro
---
// In an Astro component (server-side)
import { actions } from 'astro:actions';
const result = await actions.like({ postId: '123' });
---
```

```ts
// In a server endpoint
import { actions } from 'astro:actions';

export async function GET(context) {
  const result = await actions.like({ postId: '123' });
  return new Response(JSON.stringify(result));
}
```
