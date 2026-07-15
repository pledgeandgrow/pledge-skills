# API: express() & Application Object

## `express()`

Creates an Express application:

```js
import express from 'express';
const app = express();
```

### Express Object Methods

| Method | Description |
|--------|-------------|
| `express.json()` | Built-in JSON body parser middleware |
| `express.raw()` | Parse bodies as Buffer |
| `express.static()` | Serve static files |
| `express.text()` | Parse bodies as string |
| `express.urlencoded()` | Parse URL-encoded bodies |
| `express.Router()` | Create a new router |

### `express.json()`

```js
app.use(express.json({
  limit: '100kb',
  strict: true,
  type: 'application/json',
  verify: (req, res, buf, encoding) => { }
}));
```

### `express.raw()`

```js
app.use(express.raw({ type: 'application/octet-stream', limit: '10mb' }));
```

### `express.static()`

```js
app.use(express.static('public', {
  maxAge: '1d',
  etag: true,
  index: 'index.html'
}));
```

### `express.text()`

```js
app.use(express.text({ type: 'text/plain' }));
```

### `express.urlencoded()`

```js
app.use(express.urlencoded({ extended: true }));
```

| Option | Default | Description |
|--------|---------|-------------|
| `extended` | `false` | Use `qs` (true) or `querystring` (false) |
| `limit` | `'100kb'` | Maximum body size |
| `parameterLimit` | `1000` | Max number of parameters |
| `type` | `'application/x-www-form-urlencoded'` | Content type to parse |
| `verify` | — | Verification function |

---

## Application Object

The `app` object has properties and methods for configuring the application.

### Properties

#### `app.locals`

Application-level local variables, available in all views:

```js
app.locals.title = 'My App';
app.locals.email = 'admin@example.com';

// In views: <%= title %>, <%= email %>
```

#### `app.mountpath`

The path pattern on which a sub-app is mounted:

```js
const admin = express();
admin.get('/', (req, res) => {
  console.log(admin.mountpath); // '/admin'
  res.send('Admin Homepage');
});

app.use('/admin', admin);
```

#### `app.router`

The built-in router instance (Express 5):

```js
app.router.get('/foo', (req, res) => {
  res.send('Hello from foo');
});
```

### Events

#### `app.on('mount', callback)`

Fired when a sub-app is mounted on a parent app:

```js
admin.on('mount', (parent) => {
  console.log('Admin mounted on parent:', parent.mountpath);
});

app.use('/admin', admin);
```

### Methods

#### `app.all(path, ...handlers)`

Handles all HTTP methods:

```js
app.all('/api/*', requireAuth);
app.all('/api/*', setHeaders);
```

#### `app.delete(path, ...handlers)`

```js
app.delete('/users/:id', deleteUser);
```

#### `app.disable(name)`

```js
app.disable('trust proxy');
// Same as app.set('trust proxy', false)
```

#### `app.disabled(name)`

```js
if (app.disabled('trust proxy')) {
  // ...
}
```

#### `app.enable(name)`

```js
app.enable('case sensitive routing');
```

#### `app.enabled(name)`

```js
if (app.enabled('etag')) {
  // ...
}
```

#### `app.engine(ext, callback)`

Register a template engine:

```js
app.engine('ejs', require('ejs').renderFile);
app.engine('html', require('ejs').renderFile);
```

#### `app.get(name)` — Setting

Retrieve a setting value:

```js
const env = app.get('env'); // 'development' or 'production'
const title = app.get('title');
```

#### `app.get(path, ...handlers)` — Route

Handle GET requests:

```js
app.get('/users', getUsers);
app.get('/users/:id', getUserById);
```

#### `app.listen(port, callback)`

Start the server:

```js
app.listen(3000, () => {
  console.log('Server running on port 3000');
});

// Custom server
const server = http.createServer(app);
server.listen(3000);
```

#### `app.METHOD(path, ...handlers)`

Handle any HTTP method:

```js
app.post('/users', createUser);
app.put('/users/:id', updateUser);
app.patch('/users/:id', patchUser);
app.delete('/users/:id', deleteUser);
app.options('/users', corsHandler);
app.head('/users', headHandler);
```

#### `app.param(name, callback)`

Add callback triggers to route parameters:

```js
app.param('id', (req, res, next, id) => {
  req.user = users.find(u => u.id === id);
  if (!req.user) return res.status(404).send('User not found');
  next();
});

app.get('/users/:id', (req, res) => {
  res.json(req.user);
});
```

#### `app.path()`

Returns the canonical path of the app:

```js
const admin = express();
app.use('/admin', admin);
admin.path(); // '/admin'
```

#### `app.post(path, ...handlers)`

```js
app.post('/users', express.json(), createUser);
```

#### `app.put(path, ...handlers)`

```js
app.put('/users/:id', express.json(), updateUser);
```

#### `app.query()`

Custom query parser (Express 5):

```js
app.query((str) => {
  // Custom query parsing
  return parseQueryString(str);
});
```

#### `app.render(view, locals, callback)`

Render a view and send the result via callback:

```js
app.render('email', { user: 'Alice' }, (err, html) => {
  if (err) console.error(err);
  else sendEmail(html);
});
```

#### `app.route(path)`

Chain route handlers for a single path:

```js
app.route('/items')
  .get(getItems)
  .post(createItem)
  .put(updateItem)
  .delete(deleteItem);
```

#### `app.set(name, value)`

Set application settings:

```js
app.set('title', 'My App');
app.set('view engine', 'ejs');
app.set('views', './views');
app.set('trust proxy', true);
app.set('case sensitive routing', true);
app.set('strict routing', false);
app.set('x-powered-by', false);
```

### Common Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `env` | `process.env.NODE_ENV` | Environment mode |
| `view engine` | — | Default template engine |
| `views` | `./views` | Views directory |
| `trust proxy` | `false` | Trust proxy headers |
| `case sensitive routing` | `false` | Case-sensitive paths |
| `strict routing` | `false` | Distinguish `/foo` and `/foo/` |
| `x-powered-by` | `true` | Include `X-Powered-By` header |
| `etag` | `true` | Generate ETag |
| `query parser` | `extended` | Query string parser |

#### `app.use([path], ...middleware)`

Mount middleware:

```js
app.use(express.json());
app.use('/api', apiRouter);
app.use('/static', express.static('public'));
app.use((err, req, res, next) => { /* error handler */ });
```
