# Components

Astro components (`.astro` files) are the building blocks of any Astro project. They render to static HTML with no client-side runtime.

---

## Component Structure

An Astro component has two parts: **Component Script** (frontmatter) and **Component Template** (HTML + expressions).

```astro
---
// Component Script (JavaScript/TypeScript)
import Button from './Button.astro';
const { title } = Astro.props;
---
<!-- Component Template (HTML + JS Expressions) -->
<h1>{title}</h1>
<Button>Click me</Button>
```

### Component Script (Frontmatter)

- Wrapped between `---` fences
- Runs on the **server only** — no browser JS
- Standard JS/TS: imports, variables, functions, async/await
- Code is **stripped** from the final HTML output

```astro
---
import { getCollection } from 'astro:content';
const posts = await getCollection('blog');
const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---
```

### Component Template

- Standard HTML with JSX-like expressions
- `{expression}` for dynamic content
- `set:html={rawHtml}` for unescaped HTML injection
- `class:list={[{ active: isActive }, 'base']}` for conditional classes

---

## Component Props

Props are passed as attributes and accessed via `Astro.props`:

```astro
---
// Card.astro
interface Props {
  title: string;
  description?: string;
  tags?: string[];
}
const { title, description = '', tags = [] } = Astro.props;
---
<div class="card">
  <h2>{title}</h2>
  {description && <p>{description}</p>}
  {tags.length > 0 && (
    <ul>
      {tags.map(tag => <li>{tag}</li>)}
    </ul>
  )}
</div>
```

```astro
---
import Card from './Card.astro';
---
<Card title="Hello" description="World" tags={['a', 'b']} />
```

### Rest Props

```astro
---
const { title, ...rest } = Astro.props;
---
<h1 {...rest}>{title}</h1>
```

---

## Slots

Slots allow passing content into components (similar to Vue slots or React children).

### Default Slot

```astro
---
// Container.astro
---
<div class="container">
  <slot />
</div>
```

```astro
---
import Container from './Container.astro';
---
<Container>
  <p>This goes in the slot</p>
</Container>
```

### Named Slots

```astro
---
// Layout.astro
---
<header>
  <slot name="header" />
</header>
<main>
  <slot />
</main>
<footer>
  <slot name="footer" />
</footer>
```

```astro
---
import Layout from './Layout.astro';
---
<Layout>
  <h1 slot="header">Page Title</h1>
  <p>Main content</p>
  <p slot="footer">Copyright 2024</p>
</Layout>
```

### Fallback Content

```astro
---
<slot>
  <p>Default content if nothing is passed</p>
</slot>
---
```

### Transferring Slots

Use `slot` attribute on a component to forward slots to another component:

```astro
---
import BaseLayout from './BaseLayout.astro';
---
<BaseLayout>
  <slot name="header" slot="header" />
  <slot />
  <slot name="footer" slot="footer" />
</BaseLayout>
```

---

## Fragments

Use `<Fragment>` to group elements without adding a wrapper DOM node:

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

## HTML Components

Astro components can also be `.html` files with no frontmatter — useful for static content:

```html
<!-- src/components/Raw.html -->
<div class="banner">
  <p>Static HTML content</p>
</div>
```

---

## Dynamic Components

Components can be rendered dynamically using variables:

```astro
---
import Header from './Header.astro';
import Footer from './Footer.astro';
const components = { Header, Footer };
const Component = components[Astro.props.name];
---
<Component />
```

---

## Client Directives

Add interactivity to framework components (React, Vue, Svelte, etc.):

| Directive | Behavior |
|-----------|----------|
| `client:load` | Hydrate immediately on page load |
| `client:idle` | Hydrate when browser is idle |
| `client:visible` | Hydrate when visible in viewport |
| `client:media="(max-width: 50em)"` | Hydrate when media query matches |
| `client:only="react"` | Skip server render, render only on client |

```astro
---
import Counter from './Counter.jsx';
---
<Counter client:visible />
<Counter client:load />
<Counter client:only="react" />
```
