# Overriding Express API

Customize and extend the Express.js API by overriding methods and properties on the request and response objects.

---

## Overriding Methods

Replace the signature and behavior of existing methods with custom functions:

```js
// Override res.sendStatus
app.response.sendStatus = function (statusCode, type, message) {
  return this.contentType(type)
    .status(statusCode)
    .send(message);
};
```

### TypeScript

```ts
import { type Response } from 'express';

// Augment the type to accept new arguments
declare module 'express-serve-static-core' {
  interface Response {
    sendStatus(statusCode: number, type: string, message: string): this;
  }
}

app.response.sendStatus = function (
  this: Response,
  statusCode: number,
  type: string,
  message: string
) {
  return this.contentType(type)
    .status(statusCode)
    .send(message);
} as Response['sendStatus'];
```

### Usage

```js
res.sendStatus(404, 'application/json', '{"error":"resource not found"}');
```

The `as Response['sendStatus']` cast is needed because replacing a method with a different signature cannot be checked against the original declaration.

---

## Overriding Properties

Express properties fall into two categories:

1. **Assigned properties** (e.g., `req.baseUrl`, `req.originalUrl`) — dynamically assigned during the request cycle, cannot be overridden
2. **Getter properties** (e.g., `req.secure`, `req.ip`) — defined as getters, can be overridden

### Overriding a Getter Property

```js
// Override req.ip to use Client-IP header
Object.defineProperty(app.request, 'ip', {
  configurable: true,
  enumerable: true,
  get() {
    return this.get('Client-IP');
  },
});
```

### TypeScript

```ts
import { type Request } from 'express';

Object.defineProperty(app.request, 'ip', {
  configurable: true,
  enumerable: true,
  get(this: Request) {
    return this.get('Client-IP');
  },
});
```

---

## Extending the API in TypeScript

Add custom properties or methods to request/response using declaration merging:

```ts
// types/express.d.ts
interface User {
  id: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
    interface Response {
      sendError(status: number, message: string): this;
    }
  }
}

export {};
```

### Using Custom Properties

```ts
import { type Request, type Response, type NextFunction } from 'express';

// Middleware sets req.user
app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = { id: '1', name: 'Tobi' };
  next();
});

// Add custom response method
app.response.sendError = function (
  this: Response,
  status: number,
  message: string
) {
  return this.status(status).json({ error: message });
};

// Use in routes
app.get('/', (req: Request, res: Response) => {
  if (!req.user) {
    res.sendError(401, 'unauthorized');
    return;
  }
  res.send(req.user.name);
});
```

### Best Practices

- Declare custom request properties as **optional** (`user?`) — TypeScript cannot know which middleware ran before a handler
- Always check for the value before relying on it (`if (!req.user)`)
- Adding a new method needs no cast (unlike overriding an existing method)
- Place `.d.ts` files in a location covered by `tsconfig.json` `include`
