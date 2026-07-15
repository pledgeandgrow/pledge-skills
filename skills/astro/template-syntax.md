# Template Syntax & API Reference

Complete reference for Astro's template expressions, the `Astro` global, and component utilities.

---

## JSX-like Expressions

Astro components support JSX-like expressions in the template section.

### Variables

```astro
---
const name = 'Astro';
const items = ['a', 'b', 'c'];
---
<h1>Hello, {name}!</h1>
<ul>
  {items.map(item => <li>{item}</li>)}
</ul>
```

### Dynamic Attributes

```astro
---
const isActive = true;
const href = '/about';
const className = `nav-link ${isActive ? 'active' : ''}`;
---
<a href={href} class={className}>About</a>
<input type="checkbox" checked={isActive} />
```

### Dynamic HTML

```astro
---
const rawHTML = '<strong>Bold text</strong>';
---
<div set:html={rawHTML} />
```

### Dynamic Tags

```astro
---
const Tag = 'h2';
---
<Tag>Dynamic heading</Tag>

<!-- With variable tag name -->
---
const { tag: Tag = 'div' } = Astro.props;
---
<Tag>Content</Tag>
```

### Fragments

```astro
---
const items = ['a', 'b', 'c'];
---
{items.map(item => (
  <Fragment>
    <dt>{item}</dt>
    <dd>Definition for {item}</dd>
  </Fragment>
))}
```

---

## Differences Between Astro and JSX

### Attributes

Astro uses standard HTML kebab-case, not JSX camelCase:

```astro
<!-- Astro (correct) -->
<div class="box" data-value="3" />

<!-- JSX (wrong in Astro) -->
<div className="box" dataValue="3" />
```

| Feature | Astro | JSX |
|---------|-------|-----|
| `class` | `class="box"` | `className="box"` |
| `for` | `for="name"` | `htmlFor="name"` |
| `tabindex` | `tabindex="0"` | `tabIndex="0"` |
| Data attrs | `data-value="3"` | `data-value="3"` (same) |

### Multiple Elements

Astro templates can have multiple root elements — no wrapper needed:

```astro
---
---
<p>First element</p>
<p>Second element</p>
```

### Comments

Both HTML and JS comments work:

```astro
---
---
<!-- HTML comment (visible in DOM) -->
{/* JS comment (not in DOM) */}
```

### No Reactivity

Astro templates run once during rendering — values are not reactive:

```astro
---
const count = 0;
---
<button>{count}</button>
<!-- count will never change without a client directive + framework -->
```

---

## The `Astro` Global

The `Astro` global is available in all `.astro` component frontmatter and templates.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `Astro.props` | `object` | Component props |
| `Astro.params` | `object` | Route parameters (dynamic routes) |
| `Astro.url` | `URL` | Current request URL |
| `Astro.site` | `URL \| undefined` | Configured site URL |
| `Astro.request` | `Request` | Request object |
| `Astro.response` | `Response` | Response object (for headers/status) |
| `Astro.redirect(path, status?)` | `function` | Redirect to path |
| `Astro.rewrite(path)` | `function` | Rewrite to another route |
| `Astro.locals` | `object` | Mutable per-request data |
| `Astro.clientAddress` | `string` | Client IP address (SSR) |
| `Astro.isPrerendered` | `boolean` | Whether page is prerendered |
| `Astro.generator` | `string` | Astro version string |
| `Astro.cookies` | `AstroCookies` | Cookie API |
| `Astro.session` | `Session \| undefined` | Session object (SSR) |
| `Astro.preferredLocale` | `string \| undefined` | Preferred locale |
| `Astro.preferredLocaleList` | `string[]` | Preferred locale list |
| `Astro.currentLocale` | `string \| undefined` | Current locale |
| `Astro.getActionResult(name)` | `function` | Get action result (forms) |
| `Astro.callAction(action, input)` | `function` | Call action from component |
| `Astro.originPathname` | `string` | Original pathname (before rewrite) |
| `Astro.routePattern` | `string` | Route pattern string |

### `Astro.props`

```astro
---
interface Props {
  title: string;
  items?: string[];
}
const { title, items = [] } = Astro.props;
---
```

### `Astro.params`

```astro
---
// src/pages/blog/[slug].astro
const { slug } = Astro.params;
---
```

### `Astro.url`

```astro
---
const url = Astro.url;
const searchParams = url.searchParams;
const q = searchParams.get('q');
const pathname = url.pathname;
---
```

### `Astro.redirect()`

```astro
---
if (!user) {
  return Astro.redirect('/login', 302);
}
---
```

### `Astro.rewrite()`

```astro
---
return Astro.rewrite('/new-page');
---
```

### `Astro.cookies`

```astro
---
// Get
const theme = Astro.cookies.get('theme')?.value;

// Set
Astro.cookies.set('theme', 'dark', {
  path: '/',
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 365,
});

// Delete
Astro.cookies.delete('theme');

// Has
const hasTheme = Astro.cookies.has('theme');
---
```

### `Astro.response`

```astro
---
Astro.response.headers.set('X-Custom', 'value');
Astro.response.status = 201;
---
```

### `Astro.locals`

```astro
---
// Set in middleware, access in component
const user = Astro.locals.user;
const startTime = Astro.locals.startTime;
---
```

---

## Component Utilities

### `Astro.slots`

Programmatic slot access:

```astro
---
const hasHeader = await Astro.slots.has('header');
const headerContent = await Astro.slots.render('header');
---
{hasHeader && (
  <header set:html={headerContent} />
)}
```

| Method | Returns | Description |
|--------|---------|-------------|
| `Astro.slots.has(name)` | `Promise<boolean>` | Check if slot has content |
| `Astro.slots.render(name)` | `Promise<string>` | Render slot to HTML string |
| `Astro.slots.has('default')` | `Promise<boolean>` | Check default slot |

### `Astro.self`

Recursive component rendering (for tree structures):

```astro
---
// TreeNode.astro
interface Props {
  node: { name: string; children?: Props['node'][] };
}
const { node } = Astro.props;
---
<li>
  {node.name}
  {node.children && (
    <ul>
      {node.children.map(child => (
        <Astro.self node={child} />
      ))}
    </ul>
  )}
</li>
```

---

## `class:list` Directive

Conditional class merging:

```astro
---
const isActive = true;
const isDisabled = false;
---
<button class:list={[
  'btn',
  { active: isActive, disabled: isDisabled },
  'primary',
]}>
  Click
</button>
```

---

## `set:html`

Inject raw HTML:

```astro
---
const content = '<p>Rich <strong>text</strong></p>';
---
<div set:html={content} />
```

---

## `set:text`

Inject text (escaped):

```astro
---
const userInput = '<script>alert("xss")</script>';
---
<div set:text={userInput} />
<!-- Outputs: &lt;script&gt;alert("xss")&lt;/script&gt; -->
```

---

## `is:inline` Directive

Prevent processing of `<script>` or `<style>`:

```astro
<script is:inline>
  console.log('Not processed by Astro');
</script>

<style is:inline>
  .foo { color: red; }
</style>
```

---

## `is:global` Directive

Unscoped styles:

```astro
<style is:global>
  body { margin: 0; }
</style>
```

---

## `define:vars` Directive

Pass frontmatter variables to `<style>`:

```astro
---
const color = 'red';
const padding = '1rem';
---
<style define:vars={{ color, padding }}>
  .box {
    color: var(--color);
    padding: var(--padding);
  }
</style>
```
