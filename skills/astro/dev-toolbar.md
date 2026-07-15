# Dev Toolbar

The Astro dev toolbar is an overlay in development mode providing debugging and inspection tools.

---

## Built-in Apps

The dev toolbar includes several built-in apps:

### Astro Menu

Quick access to:
- Documentation links
- Astro integration directory
- Discord community
- Project settings

### Inspect

Inspect page elements and see:
- Component source file path
- Framework used (React, Vue, Svelte, etc.)
- Rendering strategy (static, client island)

Click any element on the page to see which component rendered it and where the source file is located.

### Audit

Run performance and accessibility audits:
- Lighthouse-style checks
- Image optimization suggestions
- Accessibility issues
- Performance metrics

### Settings

Configure dev toolbar options:
- Toggle toolbar visibility
- Change placement (bottom, top)
- Enable/disable individual apps
- Theme (light/dark)

---

## Extending the Dev Toolbar

Astro integrations can add custom apps to the dev toolbar:

```ts
// Custom dev toolbar app
import type { DevToolbarApp } from 'astro';

const myApp: DevToolbarApp = {
  id: 'my-app',
  name: 'My App',
  icon: 'icon.png',
  init(canvas, eventTarget) {
    // Render custom UI
    const div = document.createElement('div');
    div.textContent = 'Hello from my app!';
    canvas.appendChild(div);
  },
};

export default myApp;
```

### Installing Dev Toolbar Apps

Install additional dev toolbar apps like any other Astro integration:

```bash
npx astro add some-toolbar-app
```

### Creating a Dev Toolbar App

Dev toolbar apps are Astro integrations that register a toolbar app:

```ts
import type { AstroIntegration } from 'astro';

const myToolbarApp: AstroIntegration = {
  name: 'my-toolbar-app',
  hooks: {
    'astro:config:setup': ({ addDevToolbarApp }) => {
      addDevToolbarApp({
        id: 'my-app',
        name: 'My App',
        icon: 'data:image/svg+xml,...',
        entrypoint: './my-app.ts',
      });
    },
  },
};

export default myToolbarApp;
```

---

## Disabling the Dev Toolbar

### Per-Project

```js
// astro.config.mjs
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
});
```

### Per-User

```bash
npx astro preferences disable devToolbar
```

Re-enable:

```bash
npx astro preferences enable devToolbar
```

### Placement

```js
export default defineConfig({
  devToolbar: {
    enabled: true,
    placement: 'bottom', // 'bottom' | 'top'
  },
});
```
