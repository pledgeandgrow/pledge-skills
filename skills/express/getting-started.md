# Getting Started

Installation, hello world, Express generator, static files, and FAQ.

---

## Installation

```bash
mkdir myapp && cd myapp
npm init -y
npm install express
```

### With TypeScript

```bash
npm install express
npm install -D @types/express typescript tsx
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true
  }
}
```

---

## Hello World

```js
import express from 'express';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

### Run

```bash
node app.js
# or with TypeScript
npx tsx app.ts
```

Load `http://localhost:3000/` in a browser.

The `req` (request) and `res` (response) objects are the same objects Node provides, so you can call `req.pipe()`, `req.on('data', callback)`, and anything else you would do without Express.

---

## Express Generator

Scaffold a full app structure:

```bash
npx express-generator myapp
cd myapp
npm install

# With view engine
npx express-generator --view=ejs myapp

# With CSS engine
npx express-generator --css=sass myapp
```

### Generator Options

| Flag | Description |
|------|-------------|
| `--view=<engine>` | View engine (ejs, pug, hbs, hjs, etc.) |
| `--css=<engine>` | CSS engine (sass, less, stylus) |
| `--git` | Add `.gitignore` |
| `--no-view` | No view engine (API only) |
| `-h` | Help |

### Generated Structure

```
myapp/
  app.js
  bin/
    www
  package.json
  public/
    images/
    javascripts/
    stylesheets/
  routes/
    index.js
    users.js
  views/
    error.ejs
    index.ejs
    layout.ejs
```

### Run Generated App

```bash
DEBUG=myapp:* npm start
# or
npm start
```

---

## Basic Routing

```js
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/', (req, res) => {
  res.send('Got a POST request');
});

app.put('/user', (req, res) => {
  res.send('Got a PUT request at /user');
});

app.delete('/user', (req, res) => {
  res.send('Got a DELETE request at /user');
});
```

---

## Serving Static Files

```js
import express from 'express';
const app = express();

app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(express.static('files'));
```

### With Virtual Path Prefix

```js
app.use('/static', express.static('public'));
// Files in public/ served at /static/
```

### Static File Options

```js
app.use(express.static('public', {
  dotfiles: 'ignore',
  etag: true,
  extensions: ['html', 'htm'],
  fallthrough: true,
  index: 'index.html',
  lastModified: true,
  maxAge: '1d',
  redirect: true,
  setHeaders: (res, path, stat) => {
    res.set('x-timestamp', Date.now());
  }
}));
```

### Options Reference

| Option | Default | Description |
|--------|---------|-------------|
| `dotfiles` | `ignore` | Serve dotfiles (`allow`, `deny`, `ignore`) |
| `etag` | `true` | Generate etag |
| `extensions` | `false` | Default file extensions |
| `fallthrough` | `true` | Continue to next middleware on miss |
| `index` | `index.html` | Default file for directory |
| `lastModified` | `true` | Set `Last-Modified` header |
| `maxAge` | `0` | Cache-Control max-age (ms or string) |
| `redirect` | `true` | Redirect to trailing `/` |
| `setHeaders` | — | Function to set custom headers |

---

## FAQ

### How do I handle 404 responses?

In Express, 404 responses are not the result of an error, so the error-handler middleware will not capture them. Add a middleware after all routes:

```js
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});
```

### How do I set up an error handler?

```js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

### How do I render plain HTML?

Set the view engine or just send HTML:

```js
app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});
```

### How do I render HTML with a template engine?

```js
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hello there!' });
});
```

### What template engines are supported?

Express supports any template engine that conforms to the `(path, locals, callback)` signature. Popular choices: EJS, Pug, Handlebars, Nunjucks.

### How do I parse incoming request bodies?

```js
// JSON bodies
app.use(express.json());

// URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Raw bodies
app.use(express.raw());

// Text bodies
app.use(express.text());
```

### What environment variables does Express use?

| Variable | Description |
|----------|-------------|
| `PORT` | Port to listen on |
| `NODE_ENV` | Environment (`development`, `production`, `test`) |
| `DEBUG` | Debug namespaces (e.g., `express:*`) |
| `TRUST_PROXY` | Trust proxy headers |

### How do I use Express with a process manager?

```bash
# PM2
pm2 start app.js --name "myapp"
pm2 startup
pm2 save

# nodemon (development)
nodemon app.js
```
