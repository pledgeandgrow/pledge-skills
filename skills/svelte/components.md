# Svelte 5 — Special Elements, Stores, Context, Lifecycle, Best Practices & Migration

> Source: [svelte:boundary](https://svelte.dev/docs/svelte/svelte-boundary) | [Stores](https://svelte.dev/docs/svelte/stores) | [Context](https://svelte.dev/docs/svelte/context) | [Lifecycle](https://svelte.dev/docs/svelte/lifecycle) | [Best Practices](https://svelte.dev/docs/svelte/best-practices) | [Testing](https://svelte.dev/docs/svelte/testing) | [TypeScript](https://svelte.dev/docs/svelte/typescript) | [Custom Elements](https://svelte.dev/docs/svelte/custom-elements) | [Browser Support](https://svelte.dev/docs/svelte/browser-support) | [Svelte 4 Migration](https://svelte.dev/docs/svelte/v4-migration-guide) | [Svelte 5 Migration](https://svelte.dev/docs/svelte/v5-migration-guide) | [FAQ](https://svelte.dev/docs/svelte/faq)

## Special Elements

### `<svelte:boundary>`

Error boundaries that catch errors in child components:

```svelte
<svelte:boundary>
	<RiskyComponent />
	{#snippet failed(error, reset)}
		<p>Error: {error.message}</p>
		<button onclick={reset}>Retry</button>
	{/snippet}
</svelte:boundary>
```

**Properties**:
- `pending` — Snippet shown during async error recovery
- `failed(error, reset)` — Snippet shown when error occurs; `reset` retries
- `onerror(error, reset)` — Function called on error (for logging, etc.)
- `transformError(error)` — Transform error before passing to `failed`

See: [svelte:boundary](https://svelte.dev/docs/svelte/svelte-boundary)

### `<svelte:window>`

Bind to window properties and events:

```svelte
<svelte:window bind:innerWidth={width} bind:innerHeight={height} onkeydown={handleKey} />
```

### `<svelte:document>`

```svelte
<svelte:document bind:title={title} onvisibilitychange={handleVisibility} />
```

### `<svelte:body>`

```svelte
<svelte:body onmouseenter={handleEnter} />
```

### `<svelte:head>`

Insert elements into `<head>`:

```svelte
<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>
```

### `<svelte:element>`

Dynamic element:

```svelte
<svelte:element this={tagName} {...props} />
```

### `<svelte:options>`

Per-component compiler options:

```svelte
<svelte:options runes={true} customElement="my-element" css="injected" />
```

Options: `runes`, `namespace`, `customElement`, `css`. Legacy: `immutable`, `accessors` (deprecated).

See: [svelte:options](https://svelte.dev/docs/svelte/svelte-options)

## Stores

Stores provide reactive access to values via a simple contract. Access with `$` prefix in components.

### svelte/store

#### writable

```js
import { writable } from 'svelte/store';
const count = writable(0);
count.set(1);
count.update(n => n + 1);
```

#### readable

```js
import { readable } from 'svelte/store';
const time = readable(new Date(), (set) => {
	const interval = setInterval(() => set(new Date()), 1000);
	return () => clearInterval(interval);
});
```

#### derived

```js
import { derived } from 'svelte/store';
const doubled = derived(count, $count => $count * 2);
// Multiple stores: derived([a, b], ([$a, $b]) => $a + $b)
```

#### readonly

Wraps a store to prevent writes.

#### get

```js
import { get } from 'svelte/store';
const value = get(count);
```

#### fromStore / toStore

Convert between runes and stores:
- `fromStore(store)` → `$state`-compatible ref
- `toStore(state)` → store object

### Store Contract

An object with a `.subscribe(subscriber)` method that returns an unsubscribe function. Optionally `.set()` and `.update()` for writable stores.

### When to Use Stores

- Cross-component shared state (though runes + `.svelte.js` modules are often simpler now)
- Integrating with Svelte 4 code
- Complex async state

See: [Stores](https://svelte.dev/docs/svelte/stores)

## Context

Context allows parent components to share values with descendants without prop-drilling.

### createContext (5.40+)

```ts
// context.ts
import { createContext } from 'svelte';
export const [getUserContext, setUserContext] = createContext<User>();
```

```svelte
<!-- Parent.svelte -->
<script>
	import { setUserContext } from './context';
	setUserContext({ name: 'world' });
</script>
```

```svelte
<!-- Child.svelte -->
<script>
	import { getUserContext } from './context';
	const user = getUserContext();
</script>
<h1>hello {user.name}</h1>
```

### setContext / getContext (legacy)

```svelte
<script>
	import { setContext, getContext } from 'svelte';
	setContext('key', value);
	const value = getContext('key');
</script>
```

**Using context with state**: Context can hold reactive state.
**Component testing**: Use `flushSync()` in tests.
**Replacing global state**: Context + runes can replace global state stores.

See: [Context](https://svelte.dev/docs/svelte/context)

## Lifecycle Hooks

### onMount

```svelte
<script>
	import { onMount } from 'svelte';
	onMount(() => {
		console.log('mounted');
		return () => console.log('cleanup'); // optional
	});
</script>
```

### onDestroy

```svelte
<script>
	import { onDestroy } from 'svelte';
	onDestroy(() => console.log('destroyed'));
</script>
```

### tick

Returns a promise that resolves when DOM is updated:

```js
import { tick } from 'svelte';
await tick();
```

### Deprecated: beforeUpdate / afterUpdate

Replaced by `$effect.pre` and `$effect`. Still available but discouraged.

See: [Lifecycle](https://svelte.dev/docs/svelte/lifecycle)

## Imperative Component API

### mount

```js
import { mount } from 'svelte';
const app = mount(App, { target: document.body, props: { name: 'world' } });
```

### unmount

```js
import { unmount } from 'svelte';
unmount(app);
```

### render (SSR)

```js
import { render } from 'svelte/server';
const { body, head } = render(App, { props: {} });
```

### hydrate

```js
import { hydrate } from 'svelte';
const app = hydrate(App, { target: document.body });
```

### Hydratable Data

- **Serialization**: Data serialized for hydration
- **CSP**: Content Security Policy considerations

See: [Imperative API](https://svelte.dev/docs/svelte/imperative-component-api)

## Best Practices

### $state
- Only use for reactive variables
- Use `$state.raw` for large objects that are only reassigned
- Objects/arrays are deeply reactive (proxied) — be aware of overhead

### $derived
- Use `$derived` instead of `$effect` for computed values
- Use `$derived.by` for complex computations
- Deriveds are writable

### $effect
- Avoid updating state inside effects
- Use `@attach` for external library sync
- Use event handlers for user interactions
- Use `$inspect` for debugging
- Use `createSubscriber` for external state
- Never wrap in `if (browser)` — effects don't run on server

### $props
- Treat props as mutable — use `$derived` for values depending on props
- Use fallback values in destructuring

### Events
- Use `on`-prefixed attributes (not `on:` directive)
- Use `<svelte:window>` / `<svelte:document>` for global events
- Avoid `onMount` or `$effect` for event listeners

### Snippets
- Declare in template, not in `<script>`
- Top-level snippets can be referenced in `<script>`
- Use for reusable markup

### Each Blocks
- Always use keyed each blocks with unique keys
- Never use index as key
- Avoid destructuring if you need to mutate items

### Styling
- Use scoped styles (default)
- Use `:global()` for global styles
- Use custom properties for dynamic styling

### Avoid Legacy Features
- Runes mode is recommended for new code
- Legacy mode (`let` reactivity, `$:`, `export let`, `on:`, `<slot>`) still works but is deprecated

See: [Best Practices](https://svelte.dev/docs/svelte/best-practices)

## Testing

### Unit and Component Tests with Vitest

```js
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import MyComponent from './MyComponent.svelte';

describe('MyComponent', () => {
	it('renders', () => {
		const { getByText } = render(MyComponent, { props: { name: 'world' } });
		expect(getByText('hello world')).toBeTruthy();
	});
});
```

**Using runes in test files**: Use `.svelte.js`/`.svelte.ts` test files.
**Component testing**: Use `@testing-library/svelte` or `@vue/test-utils`-style helpers.

### Component Tests with Storybook

Use `@storybook/addon-svelte-csf` for Svelte-native story definitions.

### E2E Tests with Playwright

```bash
npx sv add playwright
```

See: [Testing](https://svelte.dev/docs/svelte/testing)

## TypeScript

### Setup

```bash
npx sv create --types typescript
```

### `<script lang="ts">`

```svelte
<script lang="ts">
	interface Props { name: string; count?: number; }
	let { name, count = 0 }: Props = $props();
</script>
```

### Typing $props

```ts
let { name, items = [] }: { name: string; items: Item[] } = $props();
```

### Generic $props

```svelte
<script lang="ts" generics="T">
	let { items }: { items: T[] } = $props();
</script>
```

### Typing $state

```ts
let count = $state<number>(0);
let user = $state<User | null>(null);
```

### The Component Type

```ts
import type { Component } from 'svelte';
type MyComponent = Component<Props>;
```

### Preprocessor Setup

Use `vitePreprocess` from `@sveltejs/vite-plugin-svelte` for TypeScript support.

### tsconfig.json

Generated by `svelte-kit sync`. Extends `./.svelte-kit/tsconfig.json`.

See: [TypeScript](https://svelte.dev/docs/svelte/typescript)

## Custom Elements

Compile Svelte components as Web Components:

```svelte
<svelte:options customElement="my-element" />

<script>
	let { name = 'world' } = $props();
</script>

<h1>Hello {name}!</h1>
```

**Component lifecycle**: `connectedCallback`, `disconnectedCallback`.
**Component options**: `tag`, `shadow` (open/closed/none), `props` (define which props are exposed).
**Caveats**: No Svelte-specific features outside custom element, limited slot support.

See: [Custom Elements](https://svelte.dev/docs/svelte/custom-elements)

## Browser Support

Svelte 5 targets modern browsers (ES2020+). Exceptions: IE11 not supported.

See: [Browser Support](https://svelte.dev/docs/svelte/browser-support)

## Svelte 4 Migration Guide

Key changes from Svelte 3 to Svelte 4:
- Minimum Node.js version
- Stricter types for Svelte functions
- Custom Elements changes
- `SvelteComponentTyped` deprecated
- Transitions are local by default
- Default slot bindings
- New ESLint package
- Other breaking changes

See: [Svelte 4 Migration](https://svelte.dev/docs/svelte/v4-migration-guide)

## Svelte 5 Migration Guide

### Reactivity Syntax Changes

- `let` → `$state`
- `$:` → `$derived` / `$effect`
- `export let` → `$props`

### Event Changes

- `on:click` → `onclick`
- Component events: `createEventDispatcher` → callback props
- Event modifiers (`|preventDefault`, etc.) → inline handlers
- Multiple event handlers on same element now supported

### Snippets Instead of Slots

- `<slot>` → `{#snippet}` + `{@render}`
- Named slots → named snippets
- Slot props → snippet parameters

### Migration Script

```bash
npx sv migrate svelte-5
```

### Components Are No Longer Classes

- `new Component()` → `mount(Component, {...})`
- `component.$set()` → update props directly
- `component.$on()` → callback props
- `component.$destroy()` → `unmount(component)`

### `<svelte:component>` Removed

Use dynamic components directly:

```svelte
{#if condition}
	<ComponentA />
{:else}
	<ComponentB />
{/if}
```

### Other Breaking Changes

- Whitespace handling changed
- Modern browser required
- `children` prop is reserved
- Bindings to component exports not allowed
- `bind:` needs `$bindable()`
- `accessors` and `immutable` options ignored
- Touch events are passive
- Stricter HTML structure
- CSS scoping uses `:where(...)`
- Error/warning codes renamed
- `beforeUpdate`/`afterUpdate` behavior changes
- `contenteditable` behavior change
- `oneventname` attributes no longer accept strings
- Hydration works differently

See: [Svelte 5 Migration](https://svelte.dev/docs/svelte/v5-migration-guide)

## FAQ

- **Where to start?** Interactive tutorial at [svelte.dev/tutorial](https://svelte.dev/tutorial)
- **Support?** [Discord](https://svelte.dev/chat), [GitHub Discussions](https://github.com/sveltejs/svelte/discussions)
- **VS Code syntax highlighting?** Install Svelte VS Code extension
- **Formatting?** `prettier` with `prettier-plugin-svelte`
- **Documentation?** Use `<!-- @component -->` comments
- **Scaling?** Yes — SvelteKit handles large apps
- **UI component libraries?** shadcn-svelte, Skeleton, Flowbite, Melt UI, etc.
- **Testing?** Vitest, Playwright, Storybook
- **Router?** SvelteKit (full-featured) or `svelte-spa-router` (standalone)
- **Mobile apps?** Svelte Native (NativeScript), Capacitor
- **Hot module reloading?** Built into Vite via `@sveltejs/vite-plugin-svelte`

See: [FAQ](https://svelte.dev/docs/svelte/faq)

**Source**: [svelte:boundary](https://svelte.dev/docs/svelte/svelte-boundary) | [svelte:window](https://svelte.dev/docs/svelte/svelte-window) | [svelte:document](https://svelte.dev/docs/svelte/svelte-document) | [svelte:body](https://svelte.dev/docs/svelte/svelte-body) | [svelte:head](https://svelte.dev/docs/svelte/svelte-head) | [svelte:element](https://svelte.dev/docs/svelte/svelte-element) | [svelte:options](https://svelte.dev/docs/svelte/svelte-options) | [Stores](https://svelte.dev/docs/svelte/stores) | [Context](https://svelte.dev/docs/svelte/context) | [Lifecycle](https://svelte.dev/docs/svelte/lifecycle) | [Imperative API](https://svelte.dev/docs/svelte/imperative-component-api) | [Hydratable Data](https://svelte.dev/docs/svelte/hydratable-data) | [Best Practices](https://svelte.dev/docs/svelte/best-practices) | [Testing](https://svelte.dev/docs/svelte/testing) | [TypeScript](https://svelte.dev/docs/svelte/typescript) | [Custom Elements](https://svelte.dev/docs/svelte/custom-elements) | [Browser Support](https://svelte.dev/docs/svelte/browser-support) | [Svelte 4 Migration](https://svelte.dev/docs/svelte/v4-migration-guide) | [Svelte 5 Migration](https://svelte.dev/docs/svelte/v5-migration-guide) | [FAQ](https://svelte.dev/docs/svelte/faq) | [Legacy Overview](https://svelte.dev/docs/svelte/legacy-overview)
