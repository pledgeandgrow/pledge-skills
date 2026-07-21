# Vue.js — Getting Started & Essentials

> Source: [Introduction](https://vuejs.org/guide/introduction) | [Quick Start](https://vuejs.org/guide/quick-start) | [Essentials](https://vuejs.org/guide/essentials/application)

## What is Vue?

Vue (pronounced /vjuː/, like "view") is a JavaScript framework for building user interfaces. It builds on top of standard HTML, CSS, and JavaScript and provides a declarative, component-based programming model.

### Two Core Features

1. **Declarative Rendering**: Vue extends standard HTML with a template syntax that allows you to declaratively describe HTML output based on JavaScript state
2. **Reactivity**: Vue automatically tracks JavaScript state changes and efficiently updates the DOM when changes happen

### Prerequisites

- Basic familiarity with HTML, CSS, and JavaScript
- Node.js ^22.18.0 || >=24.12.0 (for project scaffolding)

## Quick Start

### Try Vue Online

- [Vue Playground](https://play.vuejs.org) — Online REPL
- No build step required for experimentation

### Creating a Vue Application

```bash
npm create vue@latest
# or: pnpm create vue@latest
# or: yarn create vue@latest
# or: bun create vue@latest
```

Project scaffolding prompts:
- Project name
- TypeScript support
- JSX Support
- Vue Router (SPA development)
- Pinia (state management)
- Vitest (unit testing)
- E2E Testing (Cypress / Nightwatch / Playwright)
- ESLint (code quality)
- Prettier (code formatting)
- Vue DevTools 7 extension (experimental)

```bash
cd <your-project-name>
npm install
npm run dev
```

### Using Vue from CDN

**Global Build**:
```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<div id="app">{{ message }}</div>
<script>
  const { createApp, ref } = Vue;
  createApp({ setup() { return { message: ref('Hello!') }; } }).mount('#app');
</script>
```

**ES Module Build**:
```html
<script type="module">
  import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
  createApp({ setup() { return { count: ref(0) }; } }).mount('#app');
</script>
```

**Enabling Import Maps**:
```html
<script type="importmap">
  { "imports": { "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js" } }
</script>
<script type="module">
  import { createApp, ref } from 'vue';
  createApp({ setup() { return { count: ref(0) }; } }).mount('#app');
</script>
```

### Frameworks

Vue frameworks with SSR and other features out-of-the-box:
- [Nuxt](https://nuxt.com/) — Full-stack Vue framework
- [Vike](https://vike.dev/) — Vite-based
- [Astro](https://astro.build/) — Content-focused
- [Quasar](https://quasar.dev/) — Cross-platform

> **Tip**: Use a framework only if you need SSR. Otherwise, Vite (used by `create-vue`) is simpler.

## Creating an Application

```javascript
import { createApp } from 'vue';
const app = createApp({ /* options */ });
app.mount('#app');
```

### App Config

```javascript
app.config.errorHandler = (err, instance, info) => { /* ... */ };
app.config.warnHandler = (msg, instance, trace) => { /* ... */ };
app.config.globalProperties.$format = (value) => { /* ... */ };
```

### Multiple Apps

```javascript
const app1 = createApp(/* ... */);
const app2 = createApp(/* ... });
app1.mount('#app1');
app2.mount('#app2');
```

See: [Creating an Application](https://vuejs.org/guide/essentials/application)

## Template Syntax

### Text Interpolation

```html
<span>{{ msg }}</span>
```

### Raw HTML

```html
<span v-html="rawHtml"></span>
```

### Attribute Bindings

```html
<div v-bind:id="dynamicId"></div>
<div :id="dynamicId"></div>
<button :disabled="isButtonDisabled">Button</button>
```

### Bindings with Same Name Shorthand

```html
<!-- Same as :id="id" -->
<div :id></div>
```

### Boolean Attributes

```html
<button :disabled="isDisabled">Button</button>
```

### Dynamically Binding Multiple Attributes

```html
<div v-bind="objectOfAttrs"></div>
```

### Using JavaScript Expressions

```html
{{ number + 1 }}
{{ ok ? 'YES' : 'NO' }}
{{ message.split('').reverse().join('') }}
<div :id="`list-${id}`"></div>
```

### Directives

| Directive | Description |
|-----------|-------------|
| `v-text` | Set text content |
| `v-html` | Set innerHTML |
| `v-show` | Toggle display |
| `v-if` / `v-else` / `v-else-if` | Conditional rendering |
| `v-for` | List rendering |
| `v-on` / `@` | Event listener |
| `v-bind` / `:` | Attribute binding |
| `v-model` | Two-way binding |
| `v-slot` / `#` | Slot content |
| `v-pre` | Skip compilation |
| `v-once` | Render once |
| `v-memo` | Memoize subtree |
| `v-cloak` | Hide until compiled |

### Directive Arguments & Modifiers

```html
<a v-bind:href="url"> ... </a>
<a :href="url"> ... </a>
<button v-on:click="doThis"> ... </button>
<button @click="doThis"> ... </button>
<form @submit.prevent="onSubmit"> ... </form>
```

See: [Template Syntax](https://vuejs.org/guide/essentials/template-syntax)

## Reactivity Fundamentals

### `ref()`

```javascript
import { ref } from 'vue';
const count = ref(0);
console.log(count.value); // 0
count.value++;
```

```html
<button @click="count++">{{ count }}</button>
```

### `reactive()`

```javascript
import { reactive } from 'vue';
const state = reactive({ count: 0 });
state.count++;
```

### Ref vs Reactive

- Use `ref()` for primitives and objects that need reassignment
- Use `reactive()` for objects/arrays that are mutated, not reassigned
- `ref()` unwraps automatically in templates; `.value` needed in JS
- `reactive()` doesn't need `.value` but cannot be reassigned

### Destructuring Reactive Objects

```javascript
import { toRefs, toRef } from 'vue';
const state = reactive({ count: 0, name: 'Vue' });
const { count, name } = toRefs(state);
const count2 = toRef(state, 'count');
```

See: [Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals)

## Computed Properties

```javascript
import { ref, computed } from 'vue';
const count = ref(0);
const double = computed(() => count.value * 2);
```

### Computed vs Methods

- Computed properties are cached based on their reactive dependencies
- Methods always re-run when re-render happens

### Writable Computed

```javascript
const fullName = computed({
  get() { return firstName.value + ' ' + lastName.value; },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(' ');
  }
});
```

See: [Computed Properties](https://vuejs.org/guide/essentials/computed)

## Class and Style Bindings

### Binding HTML Classes

```html
<div :class="{ active: isActive }"></div>
<div :class="['active', errorClass]"></div>
<div :class="[{ active: isActive }, errorClass]"></div>
```

### Binding Inline Styles

```html
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
<div :style="[{ color: activeColor }, { fontSize: fontSize + 'px' }]"></div>
```

See: [Class and Style Bindings](https://vuejs.org/guide/essentials/class-and-style)

## Conditional Rendering

```html
<div v-if="type === 'A'">A</div>
<div v-else-if="type === 'B'">B</div>
<div v-else>Not A/B</div>
<template v-if="show">
  <h1>Title</h1>
  <p>Paragraph</p>
</template>
<div v-show="isShown">Always in DOM</div>
```

### `v-if` vs `v-show`

- `v-if`: Toggles by creating/destroying elements; higher initial cost, lower toggle cost
- `v-show`: Toggles via CSS `display`; lower initial cost, higher toggle cost

See: [Conditional Rendering](https://vuejs.org/guide/essentials/conditional)

## List Rendering

```html
<li v-for="(item, index) in items" :key="item.id">
  {{ item.name }} - {{ index }}
</li>

<li v-for="item in items" :key="item.id">
  {{ item.name }}
</li>

<div v-for="(value, key, index) in object" :key="key">
  {{ key }}: {{ value }} - {{ index }}
</div>

<span v-for="n in 10" :key="n">{{ n }}</span>
```

### `v-for` with `v-if`

`v-if` has higher priority than `v-for`. Don't use them on the same element — use a computed property to filter.

### Key

Always use `:key` with `v-for` for stable identity of nodes.

See: [List Rendering](https://vuejs.org/guide/essentials/list)

## Event Handling

```html
<button v-on:click="counter += 1">Add</button>
<button @click="counter += 1">Add</button>
<button @click="doThis('hello', $event)">Click</button>
<button @click="doThis">Click</button>
```

### Event Modifiers

```html
<a @click.prevent="doThis">...</a>
<span @click.stop="doThis">...</span>
<form @submit.prevent="onSubmit">...</form>
<div @click.capture="doThis">...</div>
<div @click.self="doThis">...</div>
<a @click.once="doThis">...</a>
<div @scroll.passive="onScroll">...</div>
```

| Modifier | Description |
|----------|-------------|
| `.stop` | `event.stopPropagation()` |
| `.prevent` | `event.preventDefault()` |
| `.self` | Only if target is the element itself |
| `.capture` | Use capture mode |
| `.once` | Trigger at most once |
| `.passive` | `passive: true` listener |

### Key Modifiers

```html
<input @keyup.enter="submit" />
<input @keyup.page-down="onPageDown" />
```

Common keys: `.enter`, `.tab`, `.delete`, `.esc`, `.space`, `.up`, `.down`, `.left`, `.right`

### System Modifier Keys

```html
<input @keyup.alt.enter="clear" />
<div @click.ctrl="doSomething">...</div>
```

Modifiers: `.ctrl`, `.alt`, `.shift`, `.meta`, `.exact`

### Mouse Button Modifiers

`.left`, `.right`, `.middle`

See: [Event Handling](https://vuejs.org/guide/essentials/event-handling)

## Form Input Bindings

### Text

```html
<input v-model="text" />
<textarea v-model="message"></textarea>
```

### Checkbox

```html
<input type="checkbox" v-model="checked" />
<input type="checkbox" value="A" v-model="checkedNames" />
```

### Radio

```html
<input type="radio" value="One" v-model="picked" />
```

### Select

```html
<select v-model="selected">
  <option disabled value="">Select one</option>
  <option>A</option>
  <option>B</option>
</select>
```

### Modifiers

```html
<input v-model.lazy="msg" />
<input v-model.number="age" />
<input v-model.trim="msg" />
```

See: [Form Input Bindings](https://vuejs.org/guide/essentials/forms)

## Watchers

### `watch()`

```javascript
import { ref, watch } from 'vue';
const count = ref(0);
watch(count, (newValue, oldValue) => {
  console.log(`Changed from ${oldValue} to ${newValue}`);
});
```

### Watching Multiple Sources

```javascript
watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
  /* ... */
});
```

### Deep Watcher

```javascript
watch(obj, (newValue, oldValue) => { /* ... */ }, { deep: true });
```

### Immediate Watcher

```javascript
watch(count, (newValue) => { /* runs immediately */ }, { immediate: true });
```

### `watchEffect()`

```javascript
import { watchEffect } from 'vue';
watchEffect(() => {
  // Automatically tracks dependencies
  console.log(count.value);
});
```

### `watchPostEffect()` and `watchSyncEffect()`

- `watchPostEffect()`: Flushes after DOM updates
- `watchSyncEffect()`: Flushes synchronously before component updates

### Stopping a Watcher

```javascript
const stop = watch(count, () => { /* ... */ });
stop(); // Stop watching
```

See: [Watchers](https://vuejs.org/guide/essentials/watchers)

## Template Refs

```vue
<script setup>
import { ref, onMounted } from 'vue';
const inputEl = ref(null);
onMounted(() => { inputEl.value.focus(); });
</script>

<template>
  <input ref="inputEl" />
</template>
```

### `useTemplateRef()` (3.5+)

```javascript
import { useTemplateRef } from 'vue';
const inputEl = useTemplateRef('inputEl');
```

### Refs in v-for

```html
<li v-for="item in list" :ref="setItemRef">{{ item }}</li>
```

### Function Refs

```html
<input :ref="(el) => { /* el is the DOM element */ }" />
```

See: [Template Refs](https://vuejs.org/guide/essentials/template-refs)

## Components Basics

### Defining a Component

```vue
<!-- ButtonCounter.vue -->
<script setup>
import { ref } from 'vue';
const count = ref(0);
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

### Using a Component

```vue
<script setup>
import ButtonCounter from './ButtonCounter.vue';
</script>

<template>
  <ButtonCounter />
</template>
```

### Passing Props

```vue
<!-- Parent -->
<BlogPost title="My journey" />
<BlogPost :title="post.title" />

<!-- Child (BlogPost.vue) -->
<script setup>
defineProps(['title']);
</script>
```

### Listening to Events

```vue
<!-- Parent -->
<BlogPost @enlarge-text="postFontSize += 0.1" />

<!-- Child -->
<script setup>
const emit = defineEmits(['enlarge-text']);
emit('enlarge-text');
</script>
```

### Slots

```vue
<!-- Parent -->
<FancyButton>
  Click me!
</FancyButton>

<!-- Child (FancyButton.vue) -->
<button class="fancy-btn">
  <slot />
</button>
```

See: [Components Basics](https://vuejs.org/guide/essentials/component-basics)

## Lifecycle Hooks

### Composition API

```javascript
import { onMounted, onUpdated, onUnmounted } from 'vue';

onMounted(() => { console.log('mounted'); });
onUpdated(() => { console.log('updated'); });
onUnmounted(() => { console.log('unmounted'); });
```

### Lifecycle Diagram

```
beforeCreate → created → beforeMount → mounted
                                         ↓
                                    beforeUpdate → updated
                                         ↓
                                    beforeUnmount → unmounted
```

### All Hooks

| Composition API | Options API | Description |
|----------------|-------------|-------------|
| `onBeforeMount` | `beforeMount` | Before DOM mount |
| `onMounted` | `mounted` | After DOM mount |
| `onBeforeUpdate` | `beforeUpdate` | Before reactive data change |
| `onUpdated` | `updated` | After reactive data change |
| `onBeforeUnmount` | `beforeUnmount` | Before component unmount |
| `onUnmounted` | `unmounted` | After component unmount |
| `onErrorCaptured` | `errorCaptured` | Captures child component errors |
| `onActivated` | `activated` | When kept-alive component is activated |
| `onDeactivated` | `deactivated` | When kept-alive component is deactivated |
| `onServerPrefetch` | `serverPrefetch` | Before SSR render |

See: [Lifecycle Hooks](https://vuejs.org/guide/essentials/lifecycle)

**Source**: [Introduction](https://vuejs.org/guide/introduction) | [Quick Start](https://vuejs.org/guide/quick-start) | [Application](https://vuejs.org/guide/essentials/application) | [Template Syntax](https://vuejs.org/guide/essentials/template-syntax) | [Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals) | [Computed Properties](https://vuejs.org/guide/essentials/computed) | [Class and Style](https://vuejs.org/guide/essentials/class-and-style) | [Conditional Rendering](https://vuejs.org/guide/essentials/conditional) | [List Rendering](https://vuejs.org/guide/essentials/list) | [Event Handling](https://vuejs.org/guide/essentials/event-handling) | [Form Input Bindings](https://vuejs.org/guide/essentials/forms) | [Watchers](https://vuejs.org/guide/essentials/watchers) | [Template Refs](https://vuejs.org/guide/essentials/template-refs) | [Components Basics](https://vuejs.org/guide/essentials/component-basics) | [Lifecycle Hooks](https://vuejs.org/guide/essentials/lifecycle)
