# Vue.js — Components In-Depth & Reusability

> Source: [Components In-Depth](https://vuejs.org/guide/components/registration) | [Reusability](https://vuejs.org/guide/reusability/composables)

## Registration

### Global Registration

```javascript
import MyComponent from './MyComponent.vue';
app.component('MyComponent', MyComponent);
```

### Local Registration (Recommended)

```vue
<script setup>
import ComponentA from './ComponentA.vue';
</script>

<template>
  <ComponentA />
</template>
```

### Local Registration without `<script setup>`

```javascript
import ComponentA from './ComponentA.vue';
export default {
  components: { ComponentA }
};
```

See: [Registration](https://vuejs.org/guide/components/registration)

## Props

### Declaring Props

```javascript
// Array syntax
defineProps(['title', 'likes']);

// Object syntax (with types)
defineProps({
  title: String,
  likes: Number,
  meta: Object,
  callback: Function,
  isPublished: Boolean,
});
```

### Props with Validation

```javascript
defineProps({
  age: {
    type: Number,
    required: true,
    validator: (value) => value >= 0,
    default: 0,
  },
  author: {
    type: Object,
    default: () => ({ name: 'Unknown' }),
  },
});
```

### Static vs Dynamic Props

```html
<BlogPost title="Static" />
<BlogPost :title="dynamicTitle" />
<BlogPost :title="post.title + ' by ' + post.author" />
<BlogPost v-bind="post" /> <!-- multiple props from object -->
```

### One-Way Data Flow

Props are read-only. To sync changes back to parent, use events or `v-model`.

### Prop Casing

- `kebab-case` in templates: `<BlogPost post-title="..." />`
- `camelCase` in JS: `defineProps(['postTitle'])`

See: [Props](https://vuejs.org/guide/components/props)

## Events

### Emitting Events

```vue
<script setup>
const emit = defineEmits(['change', 'submit']);
emit('change', value);
emit('submit', { data: 'payload' });
</script>
```

### Event Validation

```javascript
defineEmits({
  // No validation
  click: null,
  // With validation
  submit: ({ email, password }) => {
    if (!email || !password) {
      warn('Invalid submit payload!');
      return false;
    }
    return true;
  }
});
```

### Listening to Events

```html
<MyComponent @change="handleChange" />
<MyComponent @submit="handleSubmit" />
```

### Event Modifiers

Vue provides `.emit` modifier for `v-model` but for custom events, modifiers are not supported directly.

### `v-model` Arguments

```html
<MyComponent v-model:title="title" />
<MyComponent v-model:title="title" v-model:content="content" />
```

See: [Events](https://vuejs.org/guide/components/events)

## Component v-model

### Basic Usage

```html
<CustomInput v-model="searchText" />
```

### Under the Hood

```html
<CustomInput
  :modelValue="searchText"
  @update:modelValue="newValue => searchText = newValue"
/>
```

### Component Implementation

```vue
<!-- CustomInput.vue -->
<script setup>
defineProps(['modelValue']);
defineEmits(['update:modelValue']);
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

### Multiple v-model Bindings

```html
<UserForm v-model:first-name="firstName" v-model:last-name="lastName" />
```

### Handling v-model Modifiers

```vue
<script setup>
const [model, modifiers] = defineModel({
  set: (value) => {
    if (modifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  }
});
</script>
```

See: [Component v-model](https://vuejs.org/guide/components/v-model)

## Fallthrough Attributes

Attributes that are passed to a component but are not declared as props fall through to the root element.

```html
<!-- Parent -->
<MyButton class="large" id="submit-btn" />

<!-- MyButton.vue -->
<button class="btn">Click</button>
<!-- Result: <button class="btn large" id="submit-btn">Click</button> -->
```

### `inheritAttrs: false`

```javascript
defineOptions({ inheritAttrs: false });
```

### `$attrs` in Templates

```html
<button>Custom button</button>
<!-- attrs not applied to root -->
```

```javascript
const attrs = useAttrs();
// attrs.class, attrs.id, attrs.onClick, etc.
```

### Multiple Root Elements

When a component has multiple root elements, fallthrough attributes are not applied automatically. Use `$attrs` to bind explicitly.

See: [Fallthrough Attributes](https://vuejs.org/guide/components/attrs)

## Slots

### Basic Slots

```vue
<!-- Parent -->
<FancyButton>Click me</FancyButton>

<!-- Child -->
<button class="fancy"><slot /></button>
```

### Named Slots

```vue
<!-- Parent -->
<BaseLayout>
  <template #header>
    <h1>Page Title</h1>
  </template>
  <template #default>
    <p>Main content</p>
  </template>
  <template #footer>
    <p>Footer</p>
  </template>
</BaseLayout>

<!-- Child (BaseLayout.vue) -->
<div class="container">
  <header><slot name="header" /></header>
  <main><slot /></main>
  <footer><slot name="footer" /></footer>
</div>
```

### Slot Props (Scoped Slots)

```vue
<!-- Parent -->
<FancyList>
  <template #item="{ body, username }">
    <div class="item">
      <p>{{ body }}</p>
      <p>by {{ username }}</p>
    </div>
  </template>
</FancyList>

<!-- Child (FancyList.vue) -->
<ul>
  <li v-for="item in items">
    <slot name="item" v-bind="item" />
  </li>
</ul>
```

### Default Slot Props

```vue
<!-- Parent -->
<MyList v-slot="item">
  {{ item.body }}
</MyList>
```

### Renderless Components

Components that only contain a slot and no template of their own — they provide logic and let the parent decide rendering.

See: [Slots](https://vuejs.org/guide/components/slots)

## Provide / inject

### Providing

```vue
<script setup>
import { provide, ref } from 'vue';
const message = ref('hello');
provide('message', message);
// Provide with reactive value
provide('config', { readonly: true });
</script>
```

### Injecting

```vue
<script setup>
import { inject } from 'vue';
const message = inject('message');
// With default value
const config = inject('config', { readonly: false });
</script>
```

### Using Symbols

```javascript
// keys.js
export const MyKey = Symbol();
// Provider
import { MyKey } from './keys.js';
provide(MyKey, value);
// Consumer
import { MyKey } from './keys.js';
const value = inject(MyKey);
```

### Making Injected Values Readonly

```javascript
import { provide, readonly, ref } from 'vue';
const count = ref(0);
provide('count', readonly(count));
provide('updateCount', (v) => count.value = v);
```

See: [Provide / inject](https://vuejs.org/guide/components/provide-inject)

## Async Components

### Basic Usage

```javascript
import { defineAsyncComponent } from 'vue';
const AsyncComp = defineAsyncComponent(() => import('./MyComponent.vue'));
```

### With Options

```javascript
const AsyncComp = defineAsyncComponent({
  loader: () => import('./MyComponent.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 200,
  timeout: 3000,
  suspensible: false,
  onError(err, retry, fail, attempts) {
    if (attempts <= 3) retry();
    else fail();
  }
});
```

### Async Components with `<script setup>`

```vue
<script setup>
import { defineAsyncComponent } from 'vue';
const AdminPage = defineAsyncComponent(() => import('./AdminPage.vue'));
</script>
```

See: [Async Components](https://vuejs.org/guide/components/async)

## Composables

### What is a Composable?

A composable is a function that leverages Vue's Composition API to encapsulate and reuse stateful logic.

### Example: Mouse Tracker

```javascript
// composables/useMouse.js
import { ref, onMounted, onUnmounted } from 'vue';

export function useMouse() {
  const x = ref(0);
  const y = ref(0);

  function update(event) {
    x.value = event.pageX;
    y.value = event.pageY;
  }

  onMounted(() => window.addEventListener('mousemove', update));
  onUnmounted(() => window.removeEventListener('mousemove', update));

  return { x, y };
}
```

```vue
<script setup>
import { useMouse } from './composables/useMouse';
const { x, y } = useMouse();
</script>
```

### Example: Fetch Data

```javascript
import { ref, watchEffect } from 'vue';

export function useFetch(url) {
  const data = ref(null);
  const error = ref(null);

  watchEffect(async () => {
    try {
      const res = await fetch(url.value);
      data.value = await res.json();
    } catch (e) {
      error.value = e;
    }
  });

  return { data, error };
}
```

### Conventions

- Name composable functions as `useXxx`
- Always use `ref`/`reactive` for state
- Return refs and functions for consumers to use
- Handle cleanup in `onUnmounted`

See: [Composables](https://vuejs.org/guide/reusability/composables)

## Custom Directives

### Registering a Custom Directive

```vue
<script setup>
const vFocus = {
  mounted: (el) => el.focus()
};
</script>

<template>
  <input v-focus />
</template>
```

### Global Registration

```javascript
app.directive('focus', {
  mounted: (el) => el.focus()
});
```

### Directive Hooks

| Hook | Description |
|------|-------------|
| `created` | Before element's attributes or event listeners are applied |
| `beforeMount` | Before element is inserted into DOM |
| `mounted` | When element is inserted |
| `beforeUpdate` | Before the element is updated |
| `updated` | After element and children are updated |
| `beforeUnmount` | Before element is unmounted |
| `unmounted` | When element is removed |

### Hook Arguments

```javascript
const myDirective = {
  mounted(el, binding, vnode, prevVnode) {
    // el: DOM element
    // binding.value, binding.oldValue, binding.arg, binding.modifiers
    // vnode: Virtual DOM node
    // prevVnode: Previous virtual node (update hooks only)
  }
};
```

### Function Shorthand

```javascript
app.directive('color', (el, binding) => {
  el.style.color = binding.value;
});
```

### Object Literals

```html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

See: [Custom Directives](https://vuejs.org/guide/reusability/custom-directives)

## Plugins

### Writing a Plugin

```javascript
import { translate } from './translations';

const i18nPlugin = {
  install(app, options) {
    app.config.globalProperties.$translate = (key) => {
      return translate(key, options.locale);
    };
    app.provide('i18n', options);
    app.directive('translate', (el, binding) => {
      el.textContent = translate(binding.value, options.locale);
    });
    app.mixin({
      computed: {
        locale() { return options.locale; }
      }
    });
  }
};

export default i18nPlugin;
```

### Using a Plugin

```javascript
import i18nPlugin from './i18n';
app.use(i18nPlugin, { locale: 'en' });
```

### Common Plugin Patterns

- Add global methods/properties via `app.config.globalProperties`
- Register components/directives via `app.component()` / `app.directive()`
- Provide via `app.provide()`
- Add mixins via `app.mixin()` (use sparingly)

See: [Plugins](https://vuejs.org/guide/reusability/plugins)

**Source**: [Registration](https://vuejs.org/guide/components/registration) | [Props](https://vuejs.org/guide/components/props) | [Events](https://vuejs.org/guide/components/events) | [Component v-model](https://vuejs.org/guide/components/v-model) | [Fallthrough Attributes](https://vuejs.org/guide/components/attrs) | [Slots](https://vuejs.org/guide/components/slots) | [Provide / inject](https://vuejs.org/guide/components/provide-inject) | [Async Components](https://vuejs.org/guide/components/async) | [Composables](https://vuejs.org/guide/reusability/composables) | [Custom Directives](https://vuejs.org/guide/reusability/custom-directives) | [Plugins](https://vuejs.org/guide/reusability/plugins)
