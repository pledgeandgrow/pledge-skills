# Error Handling

Express handles errors from synchronous and asynchronous code differently.

---

## Catching Errors

### Synchronous Errors

Express automatically catches errors thrown in synchronous route handlers and middleware:

```js
app.get('/', (req, res) => {
  throw new Error('BROKEN'); // Express catches this automatically
});
```

### Asynchronous Errors (Express 4)

In Express 4, you must pass errors to `next()`:

```js
app.get('/', (req, res, next) => {
  fs.readFile('/file-does-not-exist', (err, data) => {
    if (err) {
      next(err); // Pass errors to Express
    } else {
      res.send(data);
    }
  });
});
```

### Asynchronous Errors (Express 5)

Express 5 automatically catches rejected promises and thrown errors in async handlers:

```js
app.get('/user/:id', async (req, res) => {
  const user = await getUserById(req.params.id);
  res.send(user);
});
```

If `getUserById` throws or rejects, Express calls `next(err)` automatically.

### Promises with `next()`

```js
app.get('/', (req, res, next) => {
  Promise.resolve()
    .then(() => {
      throw new Error('Async error');
    })
    .catch(next); // Pass to Express error handler
});
```

### Simplified Error Passing

```js
app.get('/', [
  function (req, res, next) {
    fs.writeFile('/inaccessible-path', 'data', next);
  },
  function (req, res) {
    res.send('OK');
  }
]);
```

---

## The Default Error Handler

Express has a built-in error handler that handles errors when no custom error handler is defined. In development mode, it includes the stack trace; in production, it omits it.

```bash
NODE_ENV=production node app.js  # No stack traces
NODE_ENV=development node app.js # Stack traces shown
```

---

## Writing Error Handlers

Error-handling middleware has **4 parameters** (`err`, `req`, `res`, `next`):

```js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

### Custom Error Handler

```js
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: {
      message,
      status,
      // Include stack in development only
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});
```

### Multiple Error Handlers

```js
// 404 handler (not an error — just no route matched)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Validation error handler
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.details
    });
  }
  next(err);
});

// Generic error handler (catch-all)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
```

---

## Error Handling Patterns

### Custom Error Classes

```js
class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.name = this.constructor.name;
    this.status = status || 500;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message || 'Not Found', 404);
  }
}

class ValidationError extends AppError {
  constructor(message, details) {
    super(message || 'Validation Error', 400);
    this.details = details;
  }
}

class UnauthorizedError extends AppError {
  constructor(message) {
    super(message || 'Unauthorized', 401);
  }
}
```

### Using Custom Errors

```js
app.get('/users/:id', async (req, res) => {
  const user = await getUser(req.params.id);
  if (!user) throw new NotFoundError('User not found');
  res.json(user);
});

app.post('/users', async (req, res) => {
  if (!req.body.email) {
    throw new ValidationError('Email is required', { field: 'email' });
  }
  const user = await createUser(req.body);
  res.status(201).json(user);
});
```

### Async Wrapper (Express 4)

```js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await getUser(req.params.id);
  if (!user) throw new NotFoundError('User not found');
  res.json(user);
}));
```

### Error Handler for Custom Errors

```js
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: {
        type: err.name,
        message: err.message,
        ...(err.details && { details: err.details })
      }
    });
  }

  // Unknown errors
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: {
      type: 'InternalServerError',
      message: 'An unexpected error occurred'
    }
  });
});
```

---

## Best Practices

- Always define error-handling middleware **after** all routes
- Set `NODE_ENV=production` in production to hide stack traces
- Use custom error classes for different error types
- Log errors with context (URL, method, user, etc.)
- Never expose internal error details to clients in production
- Use async/await with Express 5 for automatic error catching
- Handle unhandled promise rejections and uncaught exceptions:

```js
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});
```
