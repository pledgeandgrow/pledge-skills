# Template Engines

Using and developing template engines for server-side rendering in Express.

---

## Using Template Engines

### Setting a View Engine

```js
app.set('view engine', 'ejs');
app.set('views', './views');
```

### Rendering Views

```js
app.get('/', (req, res) => {
  res.render('index', { title: 'My App', user: 'Alice' });
});
```

---

## Popular Template Engines

### EJS

```bash
npm install ejs
```

```js
app.set('view engine', 'ejs');
```

```html
<!-- views/index.ejs -->
<h1><%= title %></h1>
<p>Hello, <%= user %>!</p>

<% if (items.length) { %>
  <ul>
    <% items.forEach(item => { %>
      <li><%= item %></li>
    <% }); %>
  </ul>
<% } %>

<%- include('partials/header') %>
```

### Pug (formerly Jade)

```bash
npm install pug
```

```js
app.set('view engine', 'pug');
app.set('views', './views');
```

```pug
//- views/index.pug
h1= title
p Hello, #{user}!

if items.length
  ul
    each item in items
      li= item

extends layout
block content
  h1 Page Title
```

### Handlebars (hbs)

```bash
npm install hbs
```

```js
app.set('view engine', 'hbs');
```

```html
<!-- views/index.hbs -->
<h1>{{title}}</h1>
<p>Hello, {{user}}!</p>

{{#if items.length}}
  <ul>
    {{#each items}}
      <li>{{this}}</li>
    {{/each}}
  </ul>
{{/if}}

{{> header}}
```

### Nunjucks

```bash
npm install nunjucks
```

```js
import nunjucks from 'nunjucks';

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.set('view engine', 'njk');
```

```html
<!-- views/index.njk -->
<h1>{{ title }}</h1>
<p>Hello, {{ user }}!</p>

{% if items.length %}
  <ul>
    {% for item in items %}
      <li>{{ item }}</li>
    {% endfor %}
  </ul>
{% endif %}
```

---

## Template Engine Configuration

### Custom Views Directory

```js
app.set('views', [
  path.join(__dirname, 'views'),
  path.join(__dirname, 'templates')
]);
```

### Custom File Extension

```js
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
```

### Cache in Production

```js
app.set('view cache', true); // Enabled by default in production
```

---

## `app.engine()`

Register a custom template engine:

```js
app.engine('ejs', require('ejs').renderFile);
app.engine('html', require('ejs').renderFile);
```

### Custom Engine Example

```js
app.engine('md', (path, options, callback) => {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) return callback(err);
    const html = marked(data);
    callback(null, html);
  });
});

app.set('view engine', 'md');
```

---

## `res.render()`

```js
// Basic
res.render('index');

// With locals
res.render('index', { title: 'My App', items: [...] });

// With callback
res.render('index', { title: 'My App' }, (err, html) => {
  if (err) return next(err);
  // Do something with html
  res.send(html);
});
```

### `res.locals`

```js
app.use((req, res, next) => {
  res.locals.title = 'My App';
  res.locals.user = req.user;
  next();
});

// res.locals available in all rendered views
```

---

## Developing Template Engines

A template engine must conform to the `(path, options, callback)` signature:

```js
const myEngine = (path, options, callback) => {
  fs.readFile(path, 'utf8', (err, content) => {
    if (err) return callback(err);

    // Replace template variables
    let rendered = content;
    for (const key in options) {
      rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), options[key]);
    }

    callback(null, rendered);
  });
};

app.engine('tpl', myEngine);
app.set('view engine', 'tpl');
```

### Template File

```html
<!-- views/index.tpl -->
<h1>{{title}}</h1>
<p>Hello, {{name}}!</p>
```

### Using with `res.render()`

```js
app.get('/', (req, res) => {
  res.render('index', { title: 'My App', name: 'Alice' });
});
```

---

## Layouts and Partials

### EJS Layouts

```bash
npm install express-ejs-layouts
```

```js
import expressLayouts from 'express-ejs-layouts';
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');
```

```html
<!-- views/layouts/main.ejs -->
<!DOCTYPE html>
<html>
<head><title><%= title %></title></head>
<body>
  <%- body %>
</body>
</html>
```

### Pug Layouts (built-in)

```pug
//- views/layouts/main.pug
doctype html
html
  head
    title= title
  body
    block content
```

```pug
//- views/index.pug
extends layouts/main
block content
  h1 Hello World
```

### Handlebars Partials

```js
import hbs from 'hbs';
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('uppercase', (str) => str.toUpperCase());
```
