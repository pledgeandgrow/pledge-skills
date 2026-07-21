# Svelte 5 — Getting Started & Essentials

> Source: [Overview](https://svelte.dev/docs/svelte/overview) | [Getting Started](https://svelte.dev/docs/svelte/getting-started) | [.svelte Files](https://svelte.dev/docs/svelte/svelte-files) | [Runes](https://svelte.dev/docs/svelte/what-are-runes)

## Overview

Svelte is a framework for building web UIs. It compiles declarative components into optimized JavaScript — no virtual DOM, no runtime overhead.

```svelte
<!-- App.svelte -->
<script>
	function greet() {
		alert('Welcome to Svelte!');
	}
</script>

<button onclick={greet}>click me</button>

<style>
	button { font-size: 2em; }
</style>
```

## Getting Started

```sh
npx sv create myapp
cd myapp
npm install
npm run dev
```

Alternatives to SvelteKit: Vite plugin (`@sveltejs/vite-plugin-svelte`), Astro, Rspack, esbuild, Rollup.

Editor tooling: [Svelte VS Code extension](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

See: [Getting Started](https://svelte.dev/docs/svelte/getting-started)

## .svelte Files

A `.svelte` file contains three sections:

- `<script>` — Component logic (JavaScript/TypeScript)
- `<script module>` — Module-level code (runs once, not per instance)
- Markup — HTML template
- `<style>` — Scoped CSS

```svelte
<script>
	let count = $state(0);
</script>

<button onclick={() => count++}>
	clicks: {count}
</button>

<style>
	button { color: red; }
</style>
```

See: [.svelte Files](https://svelte.dev/docs/svelte/svelte-files)

## .svelte.js and .svelte.ts Files

These behave like normal `.js`/`.ts` modules but can use runes — useful for shared reactive logic.

See: [.svelte.js/.svelte.ts Files](https://svelte.dev/docs/svelte/svelte-js-files)

## Runes

Runes are compiler keywords with a `$` prefix. They are part of the Svelte language, not importable functions.

### $state

Creates reactive state. `count` is just a number — update it like any variable.

```svelte
<script>
	let count = $state(0);
</script>

<button onclick={() => count++}>clicks: {count}</button>
```

**Deep state**: Objects/arrays are deeply reactive (proxied).

**$state.raw**: No deep reactivity — for large objects that are only reassigned (e.g. API responses).

**$state.snapshot**: Get a static, non-reactive snapshot of state.

**$state.eager**: Effect that runs synchronously on dependency change (experimental).

**Classes**: Class fields can be marked `$state`:

```js
class Counter {
	count = $state(0);
	increment() { this.count++; }
}
```

**Passing state across modules**: You cannot export reassigned state from `.svelte.js` modules. Use `$state.snapshot` or return getters/setters.

See: [$state](https://svelte.dev/docs/svelte/$state)

### $derived

Computed values that update when dependencies change.

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>

<p>{count} doubled is {doubled}</p>
```

**$derived.by**: For complex computations using a function:

```js
let total = $derived.by(() => items.reduce((sum, item) => sum + item.price, 0));
```

Key rules:
- No side-effects inside `$derived` expressions
- Deriveds are writable (can assign to them)
- Objects/arrays returned are not deeply reactive

See: [$derived](https://svelte.dev/docs/svelte/$derived)

### $effect

Runs side-effects when tracked dependencies change. Browser-only (not during SSR).

```svelte
<script>
	let size = $state(50);
	let canvas;

	$effect(() => {
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = 'red';
		ctx.fillRect(0, 0, size, size);
	});
</script>

<canvas bind:this={canvas} width="100" height="100"></canvas>
```

**$effect.pre**: Runs before DOM updates.
**$effect.tracking**: Boolean — whether code is running inside a tracking context.
**$effect.pending**: Boolean — whether effects are pending.
**$effect.root**: Creates a non-tracked scope that doesn't auto-cleanup.

**When NOT to use $effect**:
- Use `$derived` for computed values
- Use `@attach` for external library sync
- Use event handlers for user interactions
- Use `$inspect` for debugging
- Use `createSubscriber` for external state observation

See: [$effect](https://svelte.dev/docs/svelte/$effect)

### $props

Component inputs via destructuring:

```svelte
<script>
	let { adjective = 'cool', items = [] } = $props();
</script>

<p>this component is {adjective}</p>
```

**Fallback values**: Default values in destructuring.
**Renaming props**: `let { adjective: nice } = $props();`
**Rest props**: `let { a, ...rest } = $props();`
**Updating props**: Props are reactive — use `$derived` for values depending on props.
**Type safety**: Use TypeScript with `let { name }: { name: string } = $props();`
**$props.id()**: Generate unique IDs (SSR-safe).

See: [$props](https://svelte.dev/docs/svelte/$props)

### $bindable

Declares that a prop can be bound with `bind:`:

```svelte
<!-- Child.svelte -->
<script>
	let { value = $bindable() } = $props();
</script>

<input bind:value />
```

```svelte
<!-- Parent.svelte -->
<Child bind:value={count} />
```

See: [$bindable](https://svelte.dev/docs/svelte/$bindable)

### $inspect

Debugging rune that logs values when they change:

```svelte
<script>
	let count = $state(0);
	$inspect(count); // logs on change
</script>
```

**$inspect(...).with**: Custom formatter.
**$inspect.trace(label)**: Traces reactivity dependencies in `$effect`/`$derived.by`.

See: [$inspect](https://svelte.dev/docs/svelte/$inspect)

### $host

Access the host element when compiling as a custom element:

```svelte
<svelte:options customElement="my-stepper" />

<script>
	function dispatch(type) {
		$host().dispatchEvent(new CustomEvent(type));
	}
</script>
```

See: [$host](https://svelte.dev/docs/svelte/$host)

## Basic Markup

### Tags

Standard HTML tags. Self-closing for void elements. Components use PascalCase.

### Element Attributes

```svelte
<img src={imageUrl} alt="description" />
<div class={isActive ? 'active' : ''}>...</div>
```

### Component Props

```svelte
<MyComponent adjective="cool" count={42} />
```

### Spread Attributes

```svelte
<button {...props}>click me</button>
```

### Events

Any `on`-prefixed attribute is an event listener:

```svelte
<button onclick={() => alert('hi')}>click</button>
<button {onclick}>shorthand</button>
```

**Event delegation**: Svelte 5 delegates events for better performance.

See: [Basic Markup](https://svelte.dev/docs/svelte/basic-markup)

## Text Expressions

```svelte
<h1>Hello {name}!</h1>
<p>{a + b}</p>
```

## Comments

```svelte
<!-- HTML comment -->
```

## Control Flow

### {#if ...}

```svelte
{#if condition}
	<p>shown if true</p>
{:else if other}
	<p>else if</p>
{:else}
	<p>else</p>
{/if}
```

### {#each ...}

```svelte
{#each items as item}
	<li>{item.name}</li>
{/each}

{#each items as item, i (item.id)}
	<li>{i}: {item.name}</li>
{/each}
```

**Keyed each blocks**: Always use a unique key (not index) for better performance.
**Else blocks**: Rendered when array is empty/null/undefined.

See: [{#if}](https://svelte.dev/docs/svelte/if) | [{#each}](https://svelte.dev/docs/svelte/each)

### {#key ...}

Destroys and recreates content when expression changes:

```svelte
{#key value}
	<div transition:fade>{value}</div>
{/key}
```

See: [{#key}](https://svelte.dev/docs/svelte/key)

### {#await ...}

```svelte
{#await promise}
	<p>loading...</p>
{:then value}
	<p>{value}</p>
{:catch error}
	<p>Error: {error.message}</p>
{/await}

{#await promise then value}
	<p>{value}</p>
{/await}
```

See: [{#await}](https://svelte.dev/docs/svelte/await)

## Snippets

Reusable markup chunks:

```svelte
{#snippet figure(image)}
	<figure>
		<img src={image.src} alt={image.caption} />
		<figcaption>{image.caption}</figcaption>
	</figure>
{/snippet}

{#each images as image}
	{#if image.href}
		<a href={image.href}>{@render figure(image)}</a>
	{:else}
		{@render figure(image)}
	{/if}
{/each}
```

- Snippets can have parameters with defaults and destructuring
- No rest parameters allowed
- **Snippet scope**: Snippets can access values in their lexical scope
- **Passing snippets to components**: As props, including implicit `children` snippet
- **Typing snippets**: Use TypeScript types for parameters
- **Exporting snippets**: From `<script module>`
- **Programmatic snippets**: `createRawSnippet()`
- **Snippets and slots**: Snippets replace Svelte 4 slots

See: [Snippets](https://svelte.dev/docs/svelte/snippet)

## {@render ...}

Renders a snippet:

```svelte
{@render figure(image)}
```

**Optional snippets**: `{@render children?.()}`

See: [@render](https://svelte.dev/docs/svelte/@render)

## {@html ...}

Renders raw HTML (XSS risk — only use with trusted content):

```svelte
{@html rawHtmlString}
```

See: [@html](https://svelte.dev/docs/svelte/@html)

## {@attach ...}

Attachments (replacing Svelte 4 actions) connect DOM elements to logic:

```svelte
<div {@attach tooltip('Hello')}>hover me</div>
```

- **Attachment factories**: Create reusable attachments
- **Inline attachments**: Define logic inline
- **Conditional attachments**: Conditionally apply
- **Passing attachments to components**: As props
- **Controlling re-runs**: Via dependency tracking
- **Converting actions to attachments**: `fromAction()` from `svelte/attachments`

See: [@attach](https://svelte.dev/docs/svelte/@attach)

## {@const ...} / Declaration Tags

```svelte
{#each boxes as box}
	{const area = box.width * box.height}
	<p>{box.width} * {box.height} = {area}</p>
{/each}
```

> `{@const}` is legacy syntax — use declaration tags (`{const ...}` / `{let ...}`) instead (Svelte 5.56+).

**{@debug ...}**: Logs variables when they change, pauses in devtools.

See: [@const](https://svelte.dev/docs/svelte/@const) | [@debug](https://svelte.dev/docs/svelte/@debug) | [Declaration Tags](https://svelte.dev/docs/svelte/declaration-tags)

## bind:

Two-way data binding:

```svelte
<input bind:value={name} />
<input bind:checked={isChecked} />
<input type="checkbox" bind:group={selectedValues} value={option} />
<select bind:value={selected}>...</select>
```

- **Function bindings**: `bind:value={() => get(), (v) => set(v)}`
- **Input types**: text, checkbox, radio, range, files, select, textarea, contenteditable
- **Media bindings**: `<audio>` and `<video>` (currentTime, duration, paused, etc.)
- **Dimensions**: `bind:clientWidth`, `bind:clientHeight`, `bind:offsetWidth`, etc.
- **bind:this**: Get element/component reference
- **Component bindings**: `bind:property` on components (requires `$bindable`)

See: [bind:](https://svelte.dev/docs/svelte/bind)

## use:

Actions (legacy, superseded by `@attach`):

```svelte
<div use:tooltip={'Hello'}>hover me</div>
```

See: [use:](https://svelte.dev/docs/svelte/use)

## transition:

```svelte
<div transition:fade>fades in and out</div>
<div in:fly={{ y: 100 }}>flies in</div>
<div out:slide>slides out</div>
```

- **Local vs global**: `|local` modifier prevents global transition events
- **Built-in transitions**: fade, fly, slide, blur, scale, draw, crossfade
- **Custom transition functions**: Return `{ delay, duration, easing, css, tick }`
- **Transition events**: `ontransitionstart`, `ontransitionend`

See: [transition:](https://svelte.dev/docs/svelte/transition) | [in:/out:](https://svelte.dev/docs/svelte/transition)

## animate:

```svelte
{#each list as item (item.id)}
	<li animate:flip={{ duration: 300 }}>{item.text}</li>
{/each}
```

See: [animate:](https://svelte.dev/docs/svelte/animate)

## style:

Inline style directives:

```svelte
<div style:color={color}>colored text</div>
<div style:color>shorthand</div>
<div style:--custom-prop={value}>custom property</div>
```

See: [style:](https://svelte.dev/docs/svelte/style)

## class:

```svelte
<div class:active={isActive}>...</div>
<div class:active>shorthand</div>
<div class={[isActive ? 'active' : '', 'base']}>array</div>
<div class={{ active: isActive, disabled: !enabled }}>object</div>
```

See: [class:](https://svelte.dev/docs/svelte/class)

## Await Expressions

Svelte 5 experimental `await` in components (requires `compilerOptions.experimental.async`):

```svelte
<script>
	let data = await fetch('/api').then(r => r.json());
</script>
```

Features: synchronized updates, concurrency control, loading states, error handling, SSR support, forking.

See: [Await Expressions](https://svelte.dev/docs/svelte/await-expressions)

## Styling

### Scoped Styles

CSS in `<style>` is scoped by default (class hash added to elements).

### Specificity

Scoped styles have added specificity due to the hash class.

### Scoped Keyframes

```css
@keyframes my-anim { /* scoped */ }
```

### Global Styles

```css
:global(.my-class) { /* applies globally */ }
```

### Custom Properties

```svelte
<style>
	.box { color: var(--my-color); }
</style>
<div style:--my-color={color}>...</div>
```

See: [Styling](https://svelte.dev/docs/svelte/styling)

**Source**: [Overview](https://svelte.dev/docs/svelte/overview) | [Getting Started](https://svelte.dev/docs/svelte/getting-started) | [.svelte Files](https://svelte.dev/docs/svelte/svelte-files) | [Runes](https://svelte.dev/docs/svelte/what-are-runes) | [$state](https://svelte.dev/docs/svelte/$state) | [$derived](https://svelte.dev/docs/svelte/$derived) | [$effect](https://svelte.dev/docs/svelte/$effect) | [$props](https://svelte.dev/docs/svelte/$props) | [$bindable](https://svelte.dev/docs/svelte/$bindable) | [$inspect](https://svelte.dev/docs/svelte/$inspect) | [$host](https://svelte.dev/docs/svelte/$host) | [Basic Markup](https://svelte.dev/docs/svelte/basic-markup) | [if](https://svelte.dev/docs/svelte/if) | [each](https://svelte.dev/docs/svelte/each) | [key](https://svelte.dev/docs/svelte/key) | [await](https://svelte.dev/docs/svelte/await) | [snippet](https://svelte.dev/docs/svelte/snippet) | [@render](https://svelte.dev/docs/svelte/@render) | [@html](https://svelte.dev/docs/svelte/@html) | [@attach](https://svelte.dev/docs/svelte/@attach) | [@const](https://svelte.dev/docs/svelte/@const) | [@debug](https://svelte.dev/docs/svelte/@debug) | [bind](https://svelte.dev/docs/svelte/bind) | [use](https://svelte.dev/docs/svelte/use) | [transition](https://svelte.dev/docs/svelte/transition) | [animate](https://svelte.dev/docs/svelte/animate) | [style](https://svelte.dev/docs/svelte/style) | [class](https://svelte.dev/docs/svelte/class) | [await-expressions](https://svelte.dev/docs/svelte/await-expressions) | [styling](https://svelte.dev/docs/svelte/styling)
