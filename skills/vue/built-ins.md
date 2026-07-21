# Vue.js — Built-in Components, Scaling Up & Extra Topics

> Source: [Built-in Components](https://vuejs.org/guide/built-ins/transition) | [Scaling Up](https://vuejs.org/guide/scaling-up/sfc) | [Extra Topics](https://vuejs.org/guide/extras/ways-of-using-vue)

## Transition

### Basic Usage

```html
<Transition name="fade">
  <div v-if="show">Hello</div>
</Transition>
```

```css
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
```

### Transition Classes

| Class | Description |
|-------|-------------|
| `v-enter-from` | Starting state for enter |
| `v-enter-active` | Active state for enter |
| `v-enter-to` | Ending state for enter |
| `v-leave-from` | Starting state for leave |
| `v-leave-active` | Active state for leave |
| `v-leave-to` | Ending state for leave |

### Named Transitions

Use `name` prop to prefix classes: `name="fade"` → `.fade-enter-active`, etc.

### CSS Transitions/Animations

```css
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in { /* ... */ }
```

### Custom Transition Classes

```html
<Transition
  enter-active-class="animate__animated animate__tada"
  leave-active-class="animate__animated animate__bounce"
>
  <div v-if="show">Content</div>
</Transition>
```

### JavaScript Hooks

```html
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @enter-cancelled="onEnterCancelled"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  @leave-cancelled="onLeaveCancelled"
>
  <div v-if="show">Content</div>
</Transition>
```

### Transition Props

| Prop | Description |
|------|-------------|
| `name` | Transition class name prefix |
| `appear` | Apply transition on initial render |
| `persisted` | For `v-show` transitions |
| `css` | Whether to use CSS transition classes |
| `type` | `'transition'` or `'animation'` |
| `duration` | Explicit duration |
| `mode` | `'in-out'` or `'out-in'` |
| `enter-from-class` | Custom enter-from class |
| `enter-active-class` | Custom enter-active class |
| `enter-to-class` | Custom enter-to class |
| `leave-from-class` | Custom leave-from class |
| `leave-active-class` | Custom leave-active class |
| `leave-to-class` | Custom leave-to class |

See: [Transition](https://vuejs.org/guide/built-ins/transition)

## TransitionGroup

For transitioning lists of elements.

```html
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item.id">{{ item.text }}</li>
</TransitionGroup>
```

### Differences from `<Transition>`

- Renders an actual element (via `tag` prop, default `<span>`)
- Does not have `mode` prop
- Each child must have a unique `key`
- CSS classes apply to individual children
- Additional move class: `.list-move` for position changes

### List Move Transitions

```css
.list-move {
  transition: transform 0.8s ease;
}
```

### Staggering List Transitions

Use JavaScript hooks with data attributes for stagger delays.

See: [TransitionGroup](https://vuejs.org/guide/built-ins/transition-group)

## KeepAlive

Caches component instances when dynamically switching between components.

```html
<KeepAlive>
  <component :is="currentComponent" />
</KeepAlive>
```

### Props

| Prop | Description |
|------|-------------|
| `include` | String, RegExp, or array — only cache matching components |
| `exclude` | String, RegExp, or array — don't cache matching components |
| `max` | Number — max number of cached instances |

```html
<KeepAlive :include="['a', 'b']" :max="10">
  <component :is="currentComponent" />
</KeepAlive>
```

### Lifecycle Hooks for Kept-Alive Components

- `onActivated()` / `activated` — Called when component is inserted from cache
- `onDeactivated()` / `deactivated` — Called when component is removed to cache

See: [KeepAlive](https://vuejs.org/guide/built-ins/keep-alive)

## Teleport

Renders component content to a different part of the DOM.

```html
<Teleport to="body">
  <div class="modal">Modal content</div>
</Teleport>
```

### Props

| Prop | Description |
|------|-------------|
| `to` | CSS selector or DOM element — target for teleport |
| `disabled` | Boolean — disable teleporting |

```html
<Teleport to="#modals" :disabled="!isMobile">
  <div class="modal">Content</div>
</Teleport>
```

See: [Teleport](https://vuejs.org/guide/built-ins/teleport)

## Suspense

Coordinates async dependencies in a component tree.

```html
<Suspense>
  <template #default>
    <AsyncComponent />
  </template>
  <template #fallback>
    <LoadingSpinner />
  </template>
</Suspense>
```

### Async Setup

```vue
<script setup>
const data = await fetch('/api/data').then(r => r.json());
</script>
```

### Events

- `@resolve` — When default slot content resolves
- `@pending` — When default slot content starts pending
- `@fallback` — When fallback content is shown

### Combining with Other Components

```html
<Suspense>
  <template #default>
    <KeepAlive>
      <component :is="currentTab" />
    </KeepAlive>
  </template>
  <template #fallback>
    <Loading />
  </template>
</Suspense>
```

> **Note**: Suspense is an experimental feature. APIs may change.

See: [Suspense](https://vuejs.org/guide/built-ins/suspense)

## Single-File Components (SFC)

### Structure

```vue
<template>
  <div class="hello">{{ msg }}</div>
</template>

<script setup>
import { ref } from 'vue';
const msg = ref('Hello Vue!');
</script>

<style scoped>
.hello { color: red; }
</style>
```

### Language Blocks

- `<template>` — Component template (HTML)
- `<script setup>` — Component logic (JavaScript/TypeScript)
- `<style>` — Component styles (CSS/SCSS/etc.)
- `<script>` — Normal `<script>` for side effects or non-setup options
- Custom blocks — e.g., `<docs>`, `<i18n>` (via plugins)

### Pre-Processors

```vue
<template lang="pug">...</template>
<script setup lang="ts">...</script>
<style lang="scss">...</style>
```

### `src` Imports

```vue
<template src="./template.html"></template>
<script setup src="./script.js"></script>
<style src="./style.css"></style>
```

### Automatic Name Inference

SFCs automatically infer component name from filename (e.g., `HelloWorld.vue` → `HelloWorld`).

See: [Single-File Components](https://vuejs.org/guide/scaling-up/sfc)

## Tooling

### IDE Support

- **VS Code** + **Vue - Official** extension (formerly Volar)
- Vim/Neovim with coc-volar
- JetBrains IDEs with Vue.js plugin

### Build Tools

| Tool | Description |
|------|-------------|
| Vite | Default build tool, powers `create-vue` |
| Vue CLI | Legacy full-featured CLI (maintenance mode) |
| webpack | Via `vue-loader` |

### Type Checking

- `vue-tsc` for TypeScript type checking
- `Volar` for IDE type support

### Linting

- ESLint with `eslint-plugin-vue`
- Prettier with `@vue/eslint-config-prettier`

### Testing

- Vitest for unit testing
- Cypress / Playwright for E2E
- `@vue/test-utils` for component testing

See: [Tooling](https://vuejs.org/guide/scaling-up/tooling)

## Routing

### Vue Router

```javascript
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/users/:id', component: User, props: true },
  ],
});

const app = createApp(App);
app.use(router);
```

### Using in Components

```vue
<script setup>
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
// router.push('/about')
// route.params.id
</script>

<template>
  <router-link to="/about">About</router-link>
  <router-view />
</template>
```

See: [Routing](https://vuejs.org/guide/scaling-up/routing) | [Vue Router Docs](https://router.vuejs.org/)

## State Management

### Pinia (Official)

```javascript
// stores/counter.js
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: { double: (state) => state.count * 2 },
  actions: {
    increment() { this.count++; },
    async fetchCount() {
      const res = await fetch('/api/count');
      this.count = await res.json();
    },
  },
});
```

```vue
<script setup>
import { useCounterStore } from './stores/counter';
const counter = useCounterStore();
// counter.count, counter.double, counter.increment()
</script>
```

### Setup Store Syntax

```javascript
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  const double = computed(() => count.value * 2);
  function increment() { count.value++; }
  return { count, double, increment };
});
```

See: [State Management](https://vuejs.org/guide/scaling-up/state-management) | [Pinia Docs](https://pinia.vuejs.org/)

## Testing

### Component Testing with Vitest + @vue/test-utils

```javascript
import { mount } from '@vue/test-utils';
import MyComponent from './MyComponent.vue';

test('renders message', () => {
  const wrapper = mount(MyComponent, {
    props: { msg: 'Hello' }
  });
  expect(wrapper.text()).toContain('Hello');
});
```

### E2E Testing

- **Cypress**: `npm create vue@latest` → select Cypress
- **Playwright**: `npm create vue@latest` → select Playwright
- **Nightwatch**: `npm create vue@latest` → select Nightwatch

See: [Testing](https://vuejs.org/guide/scaling-up/testing)

## Server-Side Rendering (SSR)

### Basic SSR

```javascript
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';

const app = createSSRApp({ /* ... */ });
const html = await renderToString(app);
```

### Using Nuxt

For full SSR support, use [Nuxt](https://nuxt.com/) which provides:
- File-based routing
- Auto-imports
- Data fetching
- SSR/SSG
- API routes

### SSR Considerations

- Use `createSSRApp()` instead of `createApp()`
- Avoid `window`/`document` in setup (use `onMounted`)
- Use `onServerPrefetch()` for async data on server
- Handle hydration mismatches

See: [SSR](https://vuejs.org/guide/scaling-up/ssr)

## Extra Topics

### Ways of Using Vue

- **Standalone Script**: Enhance static HTML via CDN
- **Embedded Web Components**: Use `defineCustomElement()`
- **Single-Page Application (SPA)**: Full client-side app with Vite
- **Fullstack / SSR**: Server-rendered with Nuxt or custom SSR
- **JAMStack / SSG**: Static site generation
- **Beyond the Web**: Desktop (Electron), Mobile (NativeScript), WebGL, Terminal

See: [Ways of Using Vue](https://vuejs.org/guide/extras/ways-of-using-vue)

### Composition API FAQ

- **Can I use both APIs?** Yes, in the same project and even the same component
- **Is Composition API better?** Depends on use case — better for logic reuse and TS, Options API simpler for small components
- **Is Options API deprecated?** No, both are first-class supported

See: [Composition API FAQ](https://vuejs.org/guide/extras/composition-api-faq)

### Reactivity in Depth

Vue's reactivity system uses:
- **Proxy-based** reactivity (Vue 3) — tracks property access and mutations
- **Effect scope** — manages dependency tracking and cleanup
- **Dependency collection** — automatically detected during effect execution

See: [Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth)

### Rendering Mechanism

Vue's rendering pipeline:
1. **Compile** templates → render functions (at build time with SFCs)
2. **Generate VNodes** from render functions
3. **Patch** VNodes to real DOM (diffing algorithm)

See: [Rendering Mechanism](https://vuejs.org/guide/extras/rendering-mechanism)

### Render Functions & JSX

```javascript
import { h } from 'vue';

const App = {
  render() {
    return h('div', { class: 'container' }, [
      h('h1', 'Title'),
      h('p', 'Content'),
    ]);
  }
};
```

With JSX:
```javascript
const App = () => <div class="container"><h1>Title</h1></div>;
```

See: [Render Functions & JSX](https://vuejs.org/guide/extras/render-function)

### Vue and Web Components

```javascript
import { defineCustomElement } from 'vue';

const MyVueElement = defineCustomElement({
  /* Vue component options */
});

customElements.define('my-vue-element', MyVueElement);
```

See: [Vue and Web Components](https://vuejs.org/guide/extras/web-components)

### Animation Techniques

- CSS transitions/animations with `<Transition>`
- List animations with `<TransitionGroup>`
- JavaScript-driven animations via hooks
- State-driven animations with watchers
- Reusable animation composables

See: [Animation Techniques](https://vuejs.org/guide/extras/animation)

**Source**: [Transition](https://vuejs.org/guide/built-ins/transition) | [TransitionGroup](https://vuejs.org/guide/built-ins/transition-group) | [KeepAlive](https://vuejs.org/guide/built-ins/keep-alive) | [Teleport](https://vuejs.org/guide/built-ins/teleport) | [Suspense](https://vuejs.org/guide/built-ins/suspense) | [SFC](https://vuejs.org/guide/scaling-up/sfc) | [Tooling](https://vuejs.org/guide/scaling-up/tooling) | [Routing](https://vuejs.org/guide/scaling-up/routing) | [State Management](https://vuejs.org/guide/scaling-up/state-management) | [Testing](https://vuejs.org/guide/scaling-up/testing) | [SSR](https://vuejs.org/guide/scaling-up/ssr) | [Ways of Using Vue](https://vuejs.org/guide/extras/ways-of-using-vue) | [Composition API FAQ](https://vuejs.org/guide/extras/composition-api-faq) | [Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth) | [Rendering Mechanism](https://vuejs.org/guide/extras/rendering-mechanism) | [Render Functions & JSX](https://vuejs.org/guide/extras/render-function) | [Vue and Web Components](https://vuejs.org/guide/extras/web-components) | [Animation Techniques](https://vuejs.org/guide/extras/animation)
