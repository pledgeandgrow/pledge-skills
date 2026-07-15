# Routing

Routing determines how an application responds to a client request at a specific endpoint (URI path + HTTP method).

---

## Route Methods

Route methods are derived from HTTP methods and attached to the `express` app instance:

```js
app.get('/', (req, res) => {
  res.send('GET request to homepage');
});

app.post('/', (req, res) => {
  res.send('POST request to homepage');
});
```

### Supported Methods

`get`, `post`, `put`, `delete`, `patch`, `head`, `options`, `all`

### `app.all()`

Handles all HTTP methods for a path:

```js
app.all('/secret', (req, res, next) => {
  console.log('Accessing the secret section...');
  next();
});
```

### `app.METHOD()`

```js
// All HTTP methods
app.get('/users', getUsers);
app.post('/users', createUser);
app.put('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);
```

---

## Route Paths

Route paths can be strings, string patterns, or regular expressions. Express uses `path-to-regexp` v8 for matching.

### String Paths

```js
app.get('/', handler);           // Exact match
app.get('/about', handler);      // Exact match
app.get('/random.txt', handler); // Exact match
```

### String Patterns

```js
app.get('/ab?cd', handler);      // /acd or /abcd
app.get('/ab+cd', handler);      // /abcd, /abbcd, /abbbcd, ...
app.get('/ab*cd', handler);      // /abcd, /abXcd, /abRANDOMcd, ...
app.get('/ab(cd)?e', handler);   // /abe or /abcde
```

### Wildcards

```js
app.get('/users/*', handler);     // Match any path under /users/
app.get('*', handler);            // Match all paths
```

### Optional Segments

```js
app.get('/users/:id?', handler);  // /users and /users/123
app.get('/api/:version?/data', handler);
```

### Regular Expressions

```js
app.get(/a/, handler);                    // Paths containing 'a'
app.get(/.*fly$/, handler);               // Paths ending with 'fly'
app.get(/^\/users\/(\d+)$/, handler);     // /users/123
```

---

## Route Parameters

Named URL segments that capture values:

```js
app.get('/users/:id', (req, res) => {
  res.send(`User ID: ${req.params.id}`);
});

app.get('/users/:userId/books/:bookId', (req, res) => {
  res.send(`User: ${req.params.userId}, Book: ${req.params.bookId}`);
});
```

### Parameter with Regex Constraint

```js
app.get('/user/:id(\\d+)', (req, res) => {
  // Only matches numeric IDs
  res.send(`User: ${req.params.id}`);
});
```

### Wildcard Parameters

```js
app.get('/files/*path', (req, res) => {
  res.send(`File path: ${req.params.path}`);
});
```

---

## Route Handlers

Handlers can be a single function, an array of functions, or combinations:

### Single Function

```js
app.get('/example', (req, res) => {
  res.send('Hello from example');
});
```

### Multiple Functions

```js
app.get('/example', (req, res, next) => {
  console.log('First handler');
  next();
}, (req, res) => {
  res.send('Second handler');
});
```

### Array of Functions

```js
const cb0 = (req, res, next) => { console.log('CB0'); next(); };
const cb1 = (req, res, next) => { console.log('CB1'); next(); };
const cb2 = (req, res) => { res.send('Hello from C!'); };

app.get('/c', [cb0, cb1, cb2]);
```

### Mixed Array and Function

```js
app.get('/d', [cb0, cb1], (req, res, next) => {
  console.log('Final handler');
  res.send('Hello from D!');
});
```

### Skipping to Next Route

```js
app.get('/user/:id', (req, res, next) => {
  if (req.params.id === '0') next('route'); // Skip to next route
  else next(); // Continue to next middleware
}, (req, res) => {
  res.send('Regular user');
});

app.get('/user/:id', (req, res) => {
  res.send('Special user (id=0)');
});
```

---

## Response Methods

| Method | Description |
|--------|-------------|
| `res.send()` | Send a response |
| `res.json()` | Send JSON response |
| `res.render()` | Render a view template |
| `res.redirect()` | Redirect to another URL |
| `res.sendFile()` | Send a file |
| `res.status()` | Set status code |
| `res.end()` | End response process |
| `res.download()` | Prompt file download |

---

## `app.route()`

Chain route handlers for a single path:

```js
app.route('/book')
  .get((req, res) => {
    res.send('Get a random book');
  })
  .post((req, res) => {
    res.send('Add a book');
  })
  .put((req, res) => {
    res.send('Update the book');
  });
```

---

## Express Router

Create modular, mountable route handlers:

```js
// routes/users.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Users home');
});

router.get('/:id', (req, res) => {
  res.send(`User ${req.params.id}`);
});

export default router;
```

```js
// app.js
import usersRouter from './routes/users.js';

app.use('/users', usersRouter);
// GET /users      → usersRouter.get('/')
// GET /users/123  → usersRouter.get('/:id')
```

### Router-Level Middleware

```js
router.use((req, res, next) => {
  console.log('Router-level middleware');
  next();
});

router.use('/admin', (req, res, next) => {
  // Only for /admin paths within this router
  next();
});
```

### Router with Parameters

```js
router.param('id', (req, res, next, id) => {
  req.user = await getUser(id);
  next();
});

router.get('/:id', (req, res) => {
  res.json(req.user);
});
```

### Nested Routers

```js
// routes/api.js
const apiRouter = express.Router();
const v1Router = express.Router();

v1Router.get('/users', getV1Users);
apiRouter.use('/v1', v1Router);

app.use('/api', apiRouter);
// GET /api/v1/users
```

---

## Route Priority

Routes are matched in the order they are defined:

```js
// This will match first
app.get('/users/special', handler);

// This will match second (if above didn't match)
app.get('/users/:id', handler);
```

### Order Matters

```js
// CORRECT: specific routes before generic
app.get('/users/me', getMe);
app.get('/users/:id', getUser);

// WRONG: generic route catches everything
app.get('/users/:id', getUser);
app.get('/users/me', getMe); // Never reached — :id matches 'me'
```
