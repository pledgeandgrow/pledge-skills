# API: Response Object (`res`)

The `res` object represents the HTTP response that an Express app sends.

---

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `res.app` | `Express` | Reference to the Express application |
| `res.headersSent` | `boolean` | Whether headers have been sent |
| `res.locals` | `object` | Local variables for views (per-request) |
| `res.req` | `Request` | Reference to the request object |

### `res.locals`

```js
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.authenticated = !!req.user;
  next();
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
  // res.locals.user and res.locals.authenticated available in view
});
```

### `res.headersSent`

```js
app.get('/', (req, res) => {
  res.send('Hello');
  if (!res.headersSent) {
    res.set('X-Custom', 'value'); // Won't run — headers already sent
  }
});
```

---

## Methods

### `res.append(field, value)`

Append a header value:

```js
res.append('Link', '<https://example.com>; rel="preload"');
res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
res.append('Warning', '199 Miscellaneous warning');
```

### `res.attachment(filename)`

Set `Content-Disposition` header to attachment:

```js
res.attachment();
res.attachment('path/to/logo.png');
```

### `res.clearCookie(name, options)`

Clear a cookie:

```js
res.clearCookie('name');
res.clearCookie('token', { path: '/admin' });
```

### `res.cookie(name, value, options)`

Set a cookie:

```js
res.cookie('name', 'value');
res.cookie('token', 'abc123', {
  domain: '.example.com',
  path: '/',
  secure: true,
  httpOnly: true,
  maxAge: 86400000, // 1 day
  sameSite: 'strict',
  signed: true
});
```

| Option | Description |
|--------|-------------|
| `domain` | Cookie domain |
| `encode` | Encoding function (default: `encodeURIComponent`) |
| `expires` | Expiration date |
| `httpOnly` | HTTP-only flag |
| `maxAge` | Max age in ms |
| `path` | Cookie path (default: `/`) |
| `secure` | HTTPS only |
| `signed` | Sign the cookie |
| `sameSite` | `true`, `false`, `'strict'`, `'lax'`, `'none'` |

### `res.download(path, filename, options, callback)`

Prompt file download:

```js
res.download('/report-1234.pdf');
res.download('/report-1234.pdf', 'report.pdf');
res.download('/report-1234.pdf', 'report.pdf', (err) => {
  if (err) console.error(err);
});
```

### `res.end(data, encoding)`

End the response:

```js
res.end();
res.end('data');
res.status(204).end();
```

### `res.format(object)`

Content negotiation:

```js
res.format({
  'text/plain': () => {
    res.send('hey');
  },
  'text/html': () => {
    res.send('<p>hey</p>');
  },
  'application/json': () => {
    res.json({ message: 'hey' });
  },
  default: () => {
    res.status(406).send('Not Acceptable');
  }
});
```

### `res.get(field)`

Get a response header:

```js
res.get('Content-Type'); // 'text/html'
```

### `res.json(body)`

Send a JSON response:

```js
res.json({ user: 'tobi' });
res.json({ error: 'Not found' }, 404); // Express 5
res.status(201).json({ id: 1, name: 'Alice' });
```

### `res.jsonp(body)`

Send JSONP response:

```js
res.jsonp({ user: 'tobi' });
// ?callback=foo → foo({"user":"tobi"});
```

### `res.links(links)`

Set `Link` header:

```js
res.links({
  next: 'http://api.example.com/users?page=2',
  last: 'http://api.example.com/users?page=10'
});
```

### `res.location(path)`

Set `Location` header:

```js
res.location('/foo/bar');
res.location('back'); // Referer or '/'
res.location('http://example.com');
```

### `res.redirect(status, url)`

Redirect:

```js
res.redirect('/foo/bar');
res.redirect('http://example.com');
res.redirect(301, '/new-location');
res.redirect('../login');
res.redirect('back'); // Redirect to Referer
```

### `res.render(view, locals, callback)`

Render a view template:

```js
res.render('index');
res.render('index', { title: 'My App' });
res.render('user', { name: 'Alice' }, (err, html) => {
  if (err) return next(err);
  res.send(html);
});
```

### `res.send(body)`

Send a response:

```js
res.send('Hello World');
res.send(Buffer.from('whoop'));
res.send({ some: 'json' }); // Auto-converted to JSON
res.send('<p>HTML content</p>');
res.send(200); // Express 5: sends "200" as body
```

### `res.sendFile(path, options, callback)`

Send a file:

```js
res.sendFile('/files/report.pdf');
res.sendFile('report.pdf', { root: 'public' });
res.sendFile('report.pdf', (err) => {
  if (err) next(err);
  else console.log('Sent:', 'report.pdf');
});
```

| Option | Description |
|--------|-------------|
| `root` | Root directory for relative paths |
| `dotfiles` | Serve dotfiles (`allow`, `deny`, `ignore`) |
| `headers` | Custom headers |
| `maxAge` | Cache-Control max-age |
| `cacheControl` | Enable cache control |

### `res.sendStatus(statusCode)`

Send status code with status text as body:

```js
res.sendStatus(200); // "OK"
res.sendStatus(404); // "Not Found"
res.sendStatus(500); // "Internal Server Error"
```

### `res.set(field, value)`

Set response headers (alias of `res.header()`):

```js
res.set('Content-Type', 'text/plain');
res.set({
  'Content-Type': 'text/plain',
  'Content-Length': '123',
  'ETag': '12345'
});
```

### `res.status(code)`

Set HTTP status code:

```js
res.status(403).send('Forbidden');
res.status(404).json({ error: 'Not found' });
res.status(201).end();
```

### `res.type(type)`

Set `Content-Type` header:

```js
res.type('.html');        // text/html
res.type('html');         // text/html
res.type('json');         // application/json
res.type('application/json'); // application/json
res.type('png');          // image/png
```

### `res.vary(field)`

Add `Vary` header:

```js
res.vary('User-Agent').render('results');
```
