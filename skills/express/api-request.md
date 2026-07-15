# API: Request Object (`req`)

The `req` object represents the HTTP request and has properties for the query string, parameters, body, headers, and more.

---

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `req.app` | `Express` | Reference to the Express application |
| `req.baseUrl` | `string` | The base path of the router |
| `req.body` | `object` | Parsed body (requires body-parsing middleware) |
| `req.cookies` | `object` | Cookies (requires `cookie-parser`) |
| `req.fresh` | `boolean` | Whether request is "fresh" (cache) |
| `req.host` | `string` | Host header (deprecated, use `req.hostname`) |
| `req.hostname` | `string` | Hostname from Host header |
| `req.ip` | `string` | Client IP address |
| `req.ips` | `string[]` | Array of IPs (when behind proxy) |
| `req.method` | `string` | HTTP method (`GET`, `POST`, etc.) |
| `req.originalUrl` | `string` | Original URL (preserves full path) |
| `req.params` | `object` | Route parameters |
| `req.path` | `string` | URL path (without query string) |
| `req.protocol` | `string` | `http` or `https` |
| `req.query` | `object` | Parsed query string |
| `req.res` | `Response` | Reference to response object |
| `req.route` | `object` | Matched route info |
| `req.secure` | `boolean` | Whether TLS connection |
| `req.signedCookies` | `object` | Signed cookies (requires `cookie-parser`) |
| `req.stale` | `boolean` | Whether request is "stale" (opposite of `fresh`) |
| `req.subdomains` | `string[]` | Subdomains |
| `req.xhr` | `boolean` | Whether XHR request |

---

## Property Details

### `req.app`

```js
app.get('/', (req, res) => {
  console.log(req.app.get('env'));
});
```

### `req.baseUrl`

```js
const router = express.Router();
router.get('/admin', (req, res) => {
  console.log(req.baseUrl); // '/admin' (mount path)
});
app.use('/admin', router);
```

### `req.body`

Requires body-parsing middleware:

```js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/users', (req, res) => {
  console.log(req.body.name);
  console.log(req.body.email);
});
```

### `req.cookies` / `req.signedCookies`

Requires `cookie-parser`:

```js
import cookieParser from 'cookie-parser';
app.use(cookieParser('secret-key'));

app.get('/', (req, res) => {
  console.log('Cookies:', req.cookies);
  console.log('Signed:', req.signedCookies);
});
```

### `req.hostname` / `req.ip`

```js
app.get('/', (req, res) => {
  console.log(req.hostname); // 'example.com'
  console.log(req.ip);       // '127.0.0.1'
  console.log(req.ips);      // ['127.0.0.1'] (behind proxy)
});
```

### `req.params`

```js
app.get('/users/:userId/books/:bookId', (req, res) => {
  res.send(req.params);
  // { userId: '42', bookId: '7' }
});
```

### `req.query`

```js
// GET /search?q=express&page=2
app.get('/search', (req, res) => {
  console.log(req.query.q);    // 'express'
  console.log(req.query.page); // '2'
});
```

### `req.route`

```js
app.get('/users/:id', (req, res) => {
  console.log(req.route);
  // { path: '/users/:id', methods: { get: true } }
});
```

### `req.protocol` / `req.secure`

```js
app.get('/', (req, res) => {
  console.log(req.protocol); // 'https' or 'http'
  console.log(req.secure);   // true if https
});
```

### `req.originalUrl` vs `req.url`

```js
// GET /admin/users?page=2 with mount at /admin
app.use('/admin', (req, res) => {
  console.log(req.originalUrl); // '/admin/users?page=2'
  console.log(req.url);         // '/users?page=2'
  console.log(req.baseUrl);     // '/admin'
  console.log(req.path);        // '/users'
});
```

---

## Methods

### `req.accepts(types)`

Checks if the specified content types are acceptable:

```js
app.get('/', (req, res) => {
  const accepted = req.accepts(['json', 'html']);
  if (accepted === 'json') {
    res.json({ data: 'value' });
  } else if (accepted === 'html') {
    res.send('<p>Value</p>');
  } else {
    res.status(406).send('Not Acceptable');
  }
});
```

### `req.acceptsCharsets(charsets)`

```js
const charset = req.acceptsCharsets(['utf-8', 'iso-8859-1']);
```

### `req.acceptsEncodings(encodings)`

```js
const encoding = req.acceptsEncodings(['gzip', 'deflate', 'br']);
```

### `req.acceptsLanguages(languages)`

```js
const lang = req.acceptsLanguages(['en', 'fr', 'es']);
```

### `req.get(field)`

Get a request header:

```js
app.get('/', (req, res) => {
  const contentType = req.get('Content-Type');
  const auth = req.get('Authorization');
  const userAgent = req.get('User-Agent');
});
```

### `req.is(type)`

Check the Content-Type header:

```js
app.post('/', (req, res) => {
  if (req.is('json')) {
    // Handle JSON
  } else if (req.is('urlencoded')) {
    // Handle form data
  } else {
    res.status(415).send('Unsupported Media Type');
  }
});
```

### `req.range(size, options)`

Parse the `Range` header:

```js
app.get('/video', (req, res) => {
  const range = req.range(1000); // total size: 1000 bytes
  // range: [{ start: 0, end: 499 }, { start: 500, end: 999 }]
});
```
