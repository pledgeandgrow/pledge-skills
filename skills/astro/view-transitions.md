# View Transitions

Astro's view transitions enable SPA-like navigation with smooth animations between pages.

---

## Enabling View Transitions (SPA Mode)

Import and add `<ClientRouter />` to your shared `<head>` or layout:

```astro
---
// src/layouts/BaseLayout.astro
import { ClientRouter } from 'astro:transitions';
---
<html>
  <head>
    <title>My Site</title>
    <ClientRouter />
  </head>
  <body>
    <slot />
  </body>
</html>
```

This intercepts page navigation and enables:
- Client-side routing (SPA mode)
- Default page transition animations
- Shared state across pages
- Persistent elements
- Fallback for unsupported browsers

---

## Browser-Native vs Astro's `<ClientRouter />`

| Feature | Browser-native VT | Astro `<ClientRouter />` |
|---------|-------------------|--------------------------|
| Cross-document transitions | Yes | Yes |
| Client-side routing | No | Yes |
| Shared state across pages | No | Yes |
| Persistent elements | No | Yes |
| Script re-execution control | N/A | Yes |
| Fallback for old browsers | No | Yes |

---

## Transition Directives

### Naming a Transition

```astro
<div transition:name="hero-image">
  <img src="/hero.jpg" alt="Hero" />
</div>
```

On the next page, an element with the same `transition:name` will animate between positions:

```astro
<!-- Page 1 -->
<div transition:name="hero-image">
  <img src="/hero.jpg" alt="Hero" />
</div>

<!-- Page 2 -->
<div transition:name="hero-image">
  <img src="/hero-large.jpg" alt="Hero" />
</div>
```

### Maintaining State

Persist an element across navigations without re-rendering:

```astro
<video transition:persist autoplay muted loop>
  <source src="/bg.mp4" type="video/mp4" />
</video>
```

```astro
<audio transition:persist controls>
  <source src="/music.mp3" type="audio/mpeg" />
</audio>
```

---

## Built-in Animation Directives

| Directive | Effect |
|-----------|--------|
| `transition:fade` | Fade in/out |
| `transition:slide` | Slide in/out |
| `transition:none` | No animation |

```astro
<div transition:animate="fade">Content</div>
<div transition:animate="slide">Content</div>
```

---

## Customizing Animations

```astro
---
import { fade, slide } from 'astro:transitions';
---
<div transition:animate={fade({ duration: '0.4s' })}>
  Content
</div>
```

Custom animation:

```ts
import type { TransitionAnimations } from 'astro:transitions';

const customAnimation = {
  old: {
    name: 'custom-out',
    duration: '0.3s',
    easing: 'ease-out',
  },
  new: {
    name: 'custom-in',
    duration: '0.3s',
    easing: 'ease-in',
  },
};
```

```astro
<div transition:animate={customAnimation}>Content</div>
```

---

## Router Control

### Preventing Client-Side Navigation

```astro
<a href="/external" data-astro-reload>External link</a>
```

### Trigger Navigation

```ts
import { navigate } from 'astro:transitions/client';

// Programmatic navigation
navigate('/about');
navigate('/about', { history: 'replace' });
```

### Replace History Entries

```ts
navigate('/page', { history: 'replace' });
```

### Transitions with Forms

```astro
<form action="/submit" method="POST">
  <input type="text" name="query" />
  <button type="submit">Search</button>
</form>
```

Form submissions automatically use view transitions when enabled.

---

## Fallback Control

```astro
<ClientRouter fallback="swap" />
```

| Fallback | Behavior |
|----------|----------|
| `animate` | Attempt animation even without native support |
| `swap` | Instant swap (default) |
| `none` | Full page reload |

---

## Script Behavior with View Transitions

### Script Order

Scripts are re-executed in order after navigation.

### Script Re-execution

By default, `<script>` tags re-execute on every navigation. Control with:

```astro
<!-- Re-execute on every navigation (default) -->
<script>console.log('runs every time');</script>

<!-- Run only once -->
<script is:inline>console.log('runs once');</script>
```

---

## Lifecycle Events

| Event | When | Cancelable |
|-------|------|------------|
| `astro:before-preparation` | Before fetching new page | Yes |
| `astro:after-preparation` | After new page is fetched | No |
| `astro:before-swap` | Before DOM swap | Yes |
| `astro:after-swap` | After DOM swap | No |
| `astro:page-load` | After navigation completes | No |

### Listening to Events

```ts
document.addEventListener('astro:before-swap', (event) => {
  // Access new page HTML
  console.log(event.newDocument);
});

document.addEventListener('astro:page-load', () => {
  console.log('Page loaded');
  // Re-initialize third-party libraries
});
```

### Cancelling Navigation

```ts
document.addEventListener('astro:before-preparation', (event) => {
  if (shouldNotNavigate) {
    event.preventDefault();
  }
});
```

---

## Accessibility

### Route Announcement

Astro announces route changes to screen readers automatically.

### `prefers-reduced-motion`

```astro
<style>
  @media (prefers-reduced-motion: no-preference) {
    /* Only animate when user allows motion */
  }
</style>
```

Astro respects `prefers-reduced-motion` — transitions are reduced or disabled when the user has this preference set.
