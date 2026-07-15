# Migration Guides

Migrating between Express versions.

---

## Migrating to Express 5

Express 5 introduces breaking changes and new features.

### Key Changes

| Change | Express 4 | Express 5 |
|--------|-----------|-----------|
| Async error handling | Manual `next(err)` | Automatic for promises |
| Path matching | `path-to-regexp` v1 | `path-to-regexp` v8 |
| `app.del()` | Available | Removed (use `app.delete()`) |
| `app.param(fn)` | Available | Removed |
| `req.host` | Includes port | Hostname only (use `req.hostname`) |
| `req.query` | Mutable object | Read-only getter |
| `res.send(status)` | Sends status text | Removed (use `res.sendStatus()`) |
| `res.json(obj, status)` | Accepted | Removed (use `res.status().json()`) |
| `res.jsonp(obj, status)` | Accepted | Removed |
| `plur` / `plural` middleware | Built-in | Removed |

### Async Error Handling

Express 5 automatically catches rejected promises:

```js
// Express 4 — must catch manually
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await getUser(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Express 5 — automatic
app.get('/users/:id', async (req, res) => {
  const user = await getUser(req.params.id);
  res.json(user);
});
```

### Path Matching Changes

```js
// Express 4 — optional params with ?
app.get('/users/:id?', handler);

// Express 5 — uses path-to-regexp v8 syntax
app.get('/users/:id', handler);       // required
app.get('/users', handler);           // separate route for optional
```

### Wildcard Changes

```js
// Express 4
app.get('/files/*', handler);         // req.params[0] = path

// Express 5 — named wildcards
app.get('/files/*path', handler);     // req.params.path = path
```

### `req.query` is Read-Only

```js
// Express 4 — mutable
req.query.filter = 'active';

// Express 5 — read-only, use `app.set('query parser', fn)`
const query = { ...req.query, filter: 'active' };
```

### Removed Methods

```js
// Express 4 (removed in 5)
app.del('/users/:id', handler);       // Use app.delete()
res.send(200);                        // Use res.sendStatus(200)
res.json({ ok: true }, 201);          // Use res.status(201).json()
```

### Migration Steps

1. Update package: `npm install express@5`
2. Replace `app.del()` with `app.delete()`
3. Replace `res.send(status)` with `res.sendStatus(status)`
4. Replace `res.json(obj, status)` with `res.status(status).json(obj)`
5. Update wildcard routes to named params
6. Remove manual try/catch in async handlers (optional but cleaner)
7. Update `req.host` to `req.hostname`
8. Test all routes — path matching behavior may differ

---

## Migrating to Express 4

### Key Changes from Express 3

| Change | Express 3 | Express 4 |
|--------|-----------|-----------|
| Middleware | Built-in | Separate packages |
| `app.use(router)` | Required | Built-in (`app.router`) |
| `req.host` | Hostname | Includes port |
| `res.sendfile()` | camelCase | `res.sendFile()` (PascalCase) |
| `app.del()` | Available | Available (removed in 5) |

### Removed Built-in Middleware

```js
// Express 3 (built-in)
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session());

// Express 4 (separate packages)
import bodyParser from 'body-parser';     // or use express.json()
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import session from 'express-session';

app.use(express.json());                   // built-in Express 4.16+
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(session({ secret: 'secret' }));
```

### Router Changes

```js
// Express 3
const router = express.Router();
app.use(router);

// Express 4 — router is built-in
app.get('/users', getUsers); // directly on app
// or use express.Router() for modular routing
```

---

## Migration Checklist

### To Express 5

- [ ] Update `express` to v5 in `package.json`
- [ ] Replace `app.del()` → `app.delete()`
- [ ] Replace `res.send(status)` → `res.sendStatus(status)`
- [ ] Replace `res.json(obj, status)` → `res.status(status).json(obj)`
- [ ] Replace `res.jsonp(obj, status)` → `res.status(status).jsonp(obj)`
- [ ] Update wildcard routes (`*` → `*paramName`)
- [ ] Update `req.host` → `req.hostname`
- [ ] Remove manual try/catch in async handlers (optional)
- [ ] Test all route patterns (path-to-regexp v8)
- [ ] Update `req.query` mutations
- [ ] Run full test suite
- [ ] Check all third-party middleware compatibility

### To Express 4

- [ ] Install separate middleware packages
- [ ] Replace `express.bodyParser()` → `express.json()` + `express.urlencoded()`
- [ ] Replace `express.methodOverride()` → `method-override`
- [ ] Replace `express.cookieParser()` → `cookie-parser`
- [ ] Replace `express.session()` → `express-session`
- [ ] Replace `express.compress()` → `compression`
- [ ] Replace `express.csrf()` → `csurf`
- [ ] Replace `res.sendfile()` → `res.sendFile()`
- [ ] Update `app.use(app.router)` — no longer needed
- [ ] Run full test suite
