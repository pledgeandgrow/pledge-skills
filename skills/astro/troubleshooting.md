# Troubleshooting

Common issues, error messages, and debugging techniques for Astro projects.

---

## Debugging

### `console.log()`

Use `console.log()` in component frontmatter — it runs on the server and outputs to the terminal:

```astro
---
const data = await fetchData();
console.log('Data:', data);
---
```

### Debugging Framework Components

Framework components (React, Vue, Svelte) debug differently based on rendering context:

- **Server render:** `console.log()` outputs to terminal
- **Client hydration:** `console.log()` outputs to browser DevTools

### Astro `<Debug />` Component

```astro
---
import Debug from 'astro:components/Debug';
const data = { name: 'Alice', roles: ['admin', 'user'] };
---
<Debug {data} />
```

Renders an interactive JSON viewer in the browser.

---

## Common Error Messages

### `Cannot use import statement outside a module`

**Cause:** Missing or incorrect `type: "module"` in `package.json`.

**Fix:**

```json
{
  "type": "module"
}
```

### `document (or window) is not defined`

**Cause:** Browser-only code running on the server.

**Fix:** Guard with `typeof` check or use `client:only` directive:

```astro
---
// In .astro frontmatter — no window/document access
---
<script>
  // In <script> tags — runs in browser
  if (typeof window !== 'undefined') {
    // Browser-only code
  }
</script>
```

```astro
<MyComponent client:only="react" />
```

### `Expected a default export`

**Cause:** Importing a component that doesn't have a default export.

**Fix:** Ensure components export as default:

```astro
---
// Component.astro — always default export
---
<div>Content</div>
```

```jsx
// React component
export default function MyComponent() {
  return <div>Content</div>;
}
```

### `Refused to execute inline script`

**Cause:** CSP (Content Security Policy) blocking inline scripts.

**Fix:** Use `is:inline` directive or configure CSP:

```astro
<script is:inline>
  // This will not be processed by Astro
</script>
```

---

## Common Gotchas

### My Component Is Not Rendering

**Possible causes:**
- File extension mismatch (e.g., `.jsx` without React integration)
- Missing import statement
- Incorrect file path

**Fix:** Verify the integration is installed and the import path is correct:

```astro
---
import MyComponent from '../components/MyComponent.jsx'; // Check path
---
<MyComponent />
```

### My Component Is Not Interactive

**Cause:** Missing client directive for framework components.

**Fix:** Add a client directive:

```astro
<!-- Not interactive (server-rendered only) -->
<MyComponent />

<!-- Interactive -->
<MyComponent client:load />
<MyComponent client:visible />
```

### Cannot Find Package 'X'

**Cause:** Missing npm dependency.

**Fix:** Install the package:

```bash
npm install package-name
```

### Using Astro with Yarn 2+ (Berry)

**Cause:** Yarn PnP incompatible with Astro's Vite bundler.

**Fix:** Use `nodeLinker: node-modules` in `.yarnrc.yml`:

```yaml
nodeLinker: node-modules
```

### Adding Dependencies in a Monorepo

**Cause:** Hoisting issues in monorepos.

**Fix:** Install in the correct workspace:

```bash
npm install package-name --workspace=my-astro-app
```

### Using `<head>` in a Component

**Cause:** Multiple `<head>` tags when components each add one.

**Fix:** Only include `<head>` in layout components, not in page components:

```astro
<!-- Layout: include <head> -->
<html>
  <head><!-- meta, title, etc. --></head>
  <body><slot /></body>
</html>

<!-- Page: don't include <head> -->
<BaseLayout title="My Page">
  <h1>Content</h1>
</BaseLayout>
```

### An Unexpected `<style>` Is Included

**Cause:** Scoped styles from imported components leaking.

**Fix:** Check `scopedStyleStrategy` config:

```js
export default defineConfig({
  scopedStyleStrategy: 'attribute', // default
  // 'class' or 'where' for different scoping strategies
});
```

### Escaping Special Characters in Markdown

**Cause:** Markdown interpreting code as formatting.

**Fix:** Use backticks or HTML entities:

```md
Use \`{variable}\` to escape curly braces in Markdown.
```

---

## Creating Minimal Reproductions

When reporting issues:

1. **Create a StackBlitz:** Use [astro.new/repro](https://astro.new/repro)
2. **Minimal code:** Remove unrelated code
3. **Clear steps:** Document exact reproduction steps
4. **Include versions:** `astro`, Node.js, OS, browser

```bash
npx astro info
```

---

## Need More Help?

- [Astro Discord](https://astro.build/chat)
- [GitHub Discussions](https://github.com/withastro/astro/discussions)
- [GitHub Issues](https://github.com/withastro/astro/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/astro)
