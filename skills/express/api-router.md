# API: Router Object

A router is an isolated instance of middleware and routes — think of it as a "mini application" for modular routing.

---

## `express.Router()`

Create a new router:

```js
import express from 'express';
const router = express.Router();

// Add middleware and routes to router
router.use(logger);
router.get('/users', getUsers);

// Mount router on app
app.use('/api', router);
```

### Router Options

```js
const router = express.Router({
  caseSensitive: true,
  mergeParams: true,
  strict: true
});
```

| Option | Default | Description |
|--------|---------|-------------|
| `caseSensitive` | `false` | Case-sensitive routing |
| `mergeParams` | `false` | Merge parent `req.params` |
| `strict` | `false` | Distinguish `/foo` and `/foo/` |

### `mergeParams` Example

```js
const parentRouter = express.Router();
const childRouter = express.Router({ mergeParams: true });

childRouter.get('/comments', (req, res) => {
  // req.params.userId available from parent route
  res.send(`Comments for user ${req.params.userId}`);
});

parentRouter.use('/users/:userId', childRouter);
app.use('/api', parentRouter);
// GET /api/users/42/comments
```

---

## Router Methods

### `router.all(path, ...handlers)`

Handle all HTTP methods:

```js
router.all('*', requireAuth);
router.all('/admin/*', requireAdmin);
```

### `router.METHOD(path, ...handlers)`

Handle specific HTTP methods:

```js
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id', patchUser);
router.head('/users', headHandler);
router.options('/users', optionsHandler);
```

### `router.param(name, callback)`

Add callback triggers for route parameters:

```js
router.param('id', (req, res, next, id) => {
  // Validate or load parameter
  if (!/^\d+$/.test(id)) {
    return res.status(400).send('Invalid ID');
  }
  req.itemId = parseInt(id);
  next();
});

router.get('/items/:id', (req, res) => {
  res.json({ id: req.itemId });
});
```

### `router.route(path)`

Chain route handlers for a single path:

```js
router.route('/users/:id')
  .all(loadUser)
  .get((req, res) => {
    res.json(req.user);
  })
  .put((req, res) => {
    // Update user
    res.json({ updated: true });
  })
  .delete((req, res) => {
    // Delete user
    res.json({ deleted: true });
  });
```

### `router.use([path], ...middleware)`

Mount middleware on the router:

```js
// Runs for all routes in this router
router.use((req, res, next) => {
  console.log('Router middleware');
  next();
});

// Mount on specific path
router.use('/admin', requireAdmin);

// Mount sub-router
const adminRouter = express.Router();
adminRouter.get('/', getAdminDashboard);
router.use('/admin', adminRouter);
```

---

## Modular Routing Pattern

### File Structure

```
routes/
  index.js          # Main router aggregator
  users.js          # User routes
  products.js       # Product routes
  auth.js           # Auth routes
  api/
    v1.js           # API v1
    v2.js           # API v2
```

### `routes/users.js`

```js
import express from 'express';
const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
```

### `routes/index.js`

```js
import express from 'express';
import usersRouter from './users.js';
import productsRouter from './products.js';
import authRouter from './auth.js';

const router = express.Router();

router.use('/users', usersRouter);
router.use('/products', productsRouter);
router.use('/auth', authRouter);

export default router;
```

### `app.js`

```js
import routes from './routes/index.js';
app.use('/api', routes);

// GET  /api/users
// POST /api/users
// GET  /api/products/:id
// POST /api/auth/login
```

### Versioned API Routes

```js
import v1Router from './routes/api/v1.js';
import v2Router from './routes/api/v2.js';

app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);
```
