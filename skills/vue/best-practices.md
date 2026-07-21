# Vue.js — Best Practices, TypeScript, Style Guide & Community

> Source: [Best Practices](https://vuejs.org/guide/best-practices/production-deployment) | [TypeScript](https://vuejs.org/guide/typescript/overview) | [Style Guide](https://vuejs.org/style-guide/) | [FAQ](https://vuejs.org/about/faq) | [Releases](https://vuejs.org/about/releases) | [Community Guide](https://vuejs.org/about/community-guide) | [Error Reference](https://vuejs.org/error-reference/)

## Production Deployment

### Build with Vite

```bash
npm run build
# Output in dist/
```

### Production Checklist

- **Minification**: Vite automatically minifies production builds
- **Tree-shaking**: Unused code is removed
- **Source maps**: Enable for debugging (`build.sourcemap: true`)
- **Compression**: Enable gzip/brotli on server
- **Base path**: Set `base` in `vite.config.js` for non-root deployment
- **Environment variables**: Use `.env.production` for prod-specific values

### Compile-Time Flags

Configure for production tree-shaking:

```javascript
// vite.config.js
export default {
  define: {
    __VUE_OPTIONS_API__: false, // Disable Options API if not used
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
  }
};
```

### Tracking Runtime Errors

```javascript
app.config.errorHandler = (err, instance, info) => {
  // Send to error tracking service
  trackError(err, info);
};
```

See: [Production Deployment](https://vuejs.org/guide/best-practices/production-deployment)

## Performance

### Overview

Vue's performance is optimized for most common use cases. Key areas:

### Profiling

- **Vue DevTools**: Component inspector and performance timeline
- **Browser DevTools**: Performance tab for flame charts
- **`app.config.performance = true`**: Enable component init/update tracking

### Optimizing Large Lists

- Use `v-memo` for memoizing list items
- Implement virtual scrolling for large lists (e.g., `vue-virtual-scroller`)
- Use `key` properly to avoid unnecessary re-renders

### Reducing Reactivity Overhead

- Use `shallowRef()` / `shallowReactive()` for large objects that don't need deep reactivity
- Use `markRaw()` for non-reactive data (e.g., third-party instances)
- Avoid unnecessary reactive wrapping of static data

### Avoiding Unnecessary Component Re-renders

- Use `computed()` for derived state
- Use `v-once` for static content
- Use `v-memo` for conditional memoization

### Lazy Loading

```javascript
import { defineAsyncComponent } from 'vue';
const AsyncComp = defineAsyncComponent(() => import('./HeavyComponent.vue'));
```

See: [Performance](https://vuejs.org/guide/best-practices/performance)

## Accessibility

### Key Principles

- Use semantic HTML elements
- Ensure keyboard navigation works
- Provide ARIA attributes when needed
- Maintain sufficient color contrast
- Test with screen readers

### Vue-Specific Tips

- Use `v-show` instead of `v-if` for visibility toggles that screen readers need to track
- Use `ref` to manage focus programmatically
- Use `useId()` for SSR-safe unique IDs in ARIA attributes
- Ensure dynamic content updates are announced (use `aria-live`)

See: [Accessibility](https://vuejs.org/guide/best-practices/accessibility)

## Security

### XSS Protection

- Vue automatically escapes text interpolations: `{{ }}`
- `v-html` renders raw HTML — only use with trusted content
- Never use `v-html` with user-provided content

### Best Practices

- Avoid injecting user input into templates
- Sanitize HTML before using `v-html`
- Use CSP (Content Security Policy) headers
- Keep dependencies updated
- Avoid `eval()` and `Function()` in component code

### Reporting Vulnerabilities

Report security issues to: security@vuejs.org

See: [Security](https://vuejs.org/guide/best-practices/security)

## TypeScript

### Overview

Vue provides first-class TypeScript support. Key tools:
- **Volar** (Vue - Official VS Code extension) — type checking in IDE
- **vue-tsc** — command-line type checking
- **Vite** — built-in TypeScript support (esbuild for transpilation)

### Setup

```bash
npm create vue@latest  # Select "Yes" for TypeScript
```

### TS with Composition API

#### Typing Refs

```typescript
import { ref } from 'vue';
const count = ref<number>(0);
const user = ref<{ name: string; age: number } | null>(null);
```

#### Typing Reactive

```typescript
import { reactive } from 'vue';
const state = reactive<{ count: number }>({ count: 0 });
```

#### Typing Computed

```typescript
import { computed, ref } from 'vue';
const double = computed<number>(() => count.value * 2);
```

#### Typing Props (defineProps with TS)

```typescript
// Type-based declaration
const props = defineProps<{
  title: string;
  likes?: number;
  meta?: { author: string };
}>();

// With defaults
const props = withDefaults(defineProps<{
  title: string;
  likes?: number;
}>(), {
  likes: 0,
});
```

#### Typing Emits

```typescript
const emit = defineEmits<{
  (e: 'change', value: string): void;
  (e: 'submit', payload: { id: number }): void;
}>();

// Or with 3.3+ syntax:
const emit = defineEmits<{
  change: [value: string];
  submit: [payload: { id: number }];
}>();
```

#### Typing Template Refs

```typescript
import { ref } from 'vue';
const inputEl = ref<HTMLInputElement | null>(null);
```

#### Typing Provide/Inject

```typescript
import { provide, inject, type InjectionKey } from 'vue';
const key = Symbol() as InjectionKey<string>;
provide(key, 'hello');
const value = inject(key); // typed as string | undefined
```

#### Typing Composables

```typescript
import { ref, type Ref } from 'vue';
export function useCounter(): { count: Ref<number>; increment: () => void } {
  const count = ref(0);
  const increment = () => count.value++;
  return { count, increment };
}
```

See: [TS with Composition API](https://vuejs.org/guide/typescript/composition-api)

### TS with Options API

#### Typing Props

```typescript
import { defineComponent, type PropType } from 'vue';
export default defineComponent({
  props: {
    title: String,
    meta: { type: Object as PropType<{ author: string }>, required: true },
    callback: Function as PropType<(value: string) => void>,
  },
});
```

#### Typing Component Data

```typescript
import { defineComponent } from 'vue';
interface ComponentData {
  count: number;
  name: string;
}
export default defineComponent({
  data(): ComponentData {
    return { count: 0, name: 'Vue' };
  },
});
```

#### Augmenting Global Properties

```typescript
import { defineComponent } from 'vue';
declare module 'vue' {
  interface ComponentCustomProperties {
    $format: (value: number) => string;
  }
}
```

See: [TS with Options API](https://vuejs.org/guide/typescript/options-api)

## Style Guide

### Rule Categories

| Priority | Category | Description |
|----------|----------|-------------|
| **A: Essential** | Error Prevention | Must follow to prevent errors |
| **B: Strongly Recommended** | Readability/UX | Improves readability and developer experience |
| **C: Recommended** | Consistency | Community standard choices |
| **D: Use with Caution** | Risky Features | Potentially risky, use with care |

### Priority A Rules (Essential)

- **Use `:key` with `v-for`**: Always use a unique key for list items
- **Never use `v-if` with `v-for`**: Use a computed property to filter
- **Use component scoping**: Use `scoped` in SFC styles

### Priority B Rules (Strongly Recommended)

- **Component files**: Each component in its own `.vue` file
- **Component naming**: Use PascalCase for component names in templates
- **Prop naming**: Use camelCase in JS, kebab-case in templates
- **Base components**: Prefix with `Base`, `App`, or `V` (e.g., `BaseButton.vue`)
- **Single-instance components**: Prefix with `The` (e.g., `TheHeader.vue`)
- **Tightly coupled components**: Prefix with parent name (e.g., `TodoList.vue`, `TodoListItem.vue`)
- **Order of words**: Start with the most general word
- **Self-closing components**: Self-close components with no content (`<MyComponent />`)
- **Prop name casing**: camelCase in JS, kebab-case in templates
- **Multi-attribute elements**: Multiple attributes on multiple lines
- **Simple expressions**: Keep template expressions simple
- **Simple computed properties**: Keep computed properties simple
- **Quoted attribute values**: Always use double quotes in templates
- **Directive shorthand**: Always use `:` and `@` shorthand

### Priority C Rules (Recommended)

- **Component/instance options order**: Follow recommended order
- **Element attribute order**: Follow recommended order
- **Empty lines**: Use empty lines between blocks
- **Single-file component top-level element order**: `<template>`, `<script>`, `<style>`

### Priority D Rules (Use with Caution)

- **`v-if` + `v-for`**: Never on the same element
- **Element selectors with `scoped`**: Prefer class selectors over element selectors in scoped styles
- **Implicit parent-child communication**: Prefer props/events over `this.$parent`
- **Non-flux state management**: Prefer Pinia over global event bus

See: [Style Guide](https://vuejs.org/style-guide/) | [Rules A](https://vuejs.org/style-guide/rules-essential) | [Rules B](https://vuejs.org/style-guide/rules-strongly-recommended) | [Rules C](https://vuejs.org/style-guide/rules-recommended) | [Rules D](https://vuejs.org/style-guide/rules-use-with-caution)

## FAQ

### General

- **Who maintains Vue?** Evan You and the core team; backed by the Vue.js Foundation
- **Vue 2 vs Vue 3?** Vue 3 has Composition API, better performance, Proxy-based reactivity, Teleport, Suspense, Fragments
- **Is Vue 2 still supported?** Vue 2 reached EOL on Dec 31, 2023; HeroDevs offers extended support
- **License?** MIT License
- **Browser support?** Modern browsers (ES2015+); no IE11 support in Vue 3

### Performance

- **Is Vue fast?** Yes — Vue 3's reactivity is Proxy-based, render is optimized, and tree-shaking reduces bundle size
- **Is Vue lightweight?** Core runtime ~20KB gzipped
- **Does Vue scale?** Yes — used in large apps with proper architecture (Pinia, Vue Router, code splitting)

### Development

- **Options API or Composition API?** Both are supported; Composition API recommended for new projects
- **JavaScript or TypeScript?** Both supported; TypeScript recommended for larger projects
- **Vue vs Web Components?** Vue components can be compiled to Web Components via `defineCustomElement()`

See: [FAQ](https://vuejs.org/about/faq)

## Releases

### Release Cycle

- **Minor releases** (x.y.0): Every ~3-6 months, include new features
- **Patch releases** (x.y.z): As needed, bug fixes and improvements
- **Major releases** (x.0.0): Rare, with migration guide

### Semantic Versioning Edge Cases

- **TypeScript definitions**: May include breaking type changes in minor releases
- **Compiled code compatibility**: Compiled SFCs may not be compatible across major versions

### Pre-Releases

- Alpha, beta, RC releases for testing before stable
- Not recommended for production

### Deprecations

- Deprecated features are documented in release notes
- Removed in next major version

### RFCs

- [RFC repository](https://github.com/vuejs/rfcs) for proposed changes
- Community feedback encouraged

### Experimental Features

- Marked as experimental in docs
- APIs may change or be removed

See: [Releases](https://vuejs.org/about/releases)

## Community Guide

### Resources

- **Code of Conduct**: [CoC](https://vuejs.org/about/coc)
- **Stay in the Know**: [Blog](https://blog.vuejs.org/), [Twitter](https://x.com/vuejs), [Events](https://events.vuejs.org/), [Newsletters](https://vuejs.org/ecosystem/newsletters)
- **Get Support**: [Discord](https://discord.com/invite/HBherRA), [GitHub Discussions](https://github.com/vuejs/core/discussions), [DEV Community](https://dev.to/t/vue), [Stack Overflow](https://stackoverflow.com/questions/tagged/vue.js)
- **Explore the Ecosystem**: [Themes](https://vuejs.org/ecosystem/themes), [UI Components](https://ui-libs.vercel.app/), [Plugins Collection](https://www.vue-plugins.org/)

### What You Can Do

- **Help Fellow Users**: Answer questions on Discord/forums
- **Help Triage Issues**: Reproduce and label issues on GitHub
- **Contribute Code**: Submit PRs to [vuejs/core](https://github.com/vuejs/core) or [vuejs/docs](https://github.com/vuejs/docs)
- **Share Experience**: Write blog posts, give talks
- **Translate Docs**: Contribute to [translation repos](https://github.com/vuejs-translations)
- **Become a Community Leader**: Organize meetups, conferences

See: [Community Guide](https://vuejs.org/about/community-guide)

## Error Reference

### Runtime Errors

In production builds, error handler APIs receive a short code instead of full message:
- `app.config.errorHandler`
- `onErrorCaptured` (Composition API)
- `errorCaptured` (Options API)

### Compiler Errors

Production compiler error codes mapped to original messages.

See: [Error Reference](https://vuejs.org/error-reference/)

## Team

The Vue.js project is maintained by an international team:

- **Core Team Members**: Actively involved in maintaining core projects
- **Core Team Emeriti**: Former active members who made valuable contributions
- **Community Partners**: Key community members with close coordination

Led by **Evan You** (creator of Vue.js).

See: [Team](https://vuejs.org/about/team)

## Additional Resources

| Resource | URL |
|----------|-----|
| Tutorial | [vuejs.org/tutorial](https://vuejs.org/tutorial/) |
| Examples | [vuejs.org/examples](https://vuejs.org/examples/) |
| Playground | [play.vuejs.org](https://play.vuejs.org) |
| Glossary | [vuejs.org/glossary](https://vuejs.org/glossary/) |
| Blog | [blog.vuejs.org](https://blog.vuejs.org/) |
| GitHub | [github.com/vuejs](https://github.com/vuejs/) |
| Discord | [discord.com/invite/HBherRA](https://discord.com/invite/HBherRA) |
| Vue 2 Docs | [v2.vuejs.org](https://v2.vuejs.org) |
| Migration Guide | [v3-migration.vuejs.org](https://v3-migration.vuejs.org/) |
| Vue Mastery | [vuemastery.com](https://www.vuemastery.com/courses/) |
| Vue School | [vueschool.io](https://vueschool.io/) |
| Certification | [certificates.dev/vuejs](https://certificates.dev/vuejs/) |
| Jobs | [vuejobs.com](https://vuejobs.com/) |
| Privacy Policy | [vuejs.org/about/privacy](https://vuejs.org/about/privacy) |
| Governance | [github.com/vuejs/governance](https://github.com/vuejs/governance) |
| Create Vue | [github.com/vuejs/create-vue](https://github.com/vuejs/create-vue) |
| Sponsor | [vuejs.org/sponsor](https://vuejs.org/sponsor/) |
| Partners | [vuejs.org/partners](https://vuejs.org/partners/) |

**Source**: [Production Deployment](https://vuejs.org/guide/best-practices/production-deployment) | [Performance](https://vuejs.org/guide/best-practices/performance) | [Accessibility](https://vuejs.org/guide/best-practices/accessibility) | [Security](https://vuejs.org/guide/best-practices/security) | [TS Overview](https://vuejs.org/guide/typescript/overview) | [TS with Composition API](https://vuejs.org/guide/typescript/composition-api) | [TS with Options API](https://vuejs.org/guide/typescript/options-api) | [Style Guide](https://vuejs.org/style-guide/) | [Rules A](https://vuejs.org/style-guide/rules-essential) | [Rules B](https://vuejs.org/style-guide/rules-strongly-recommended) | [Rules C](https://vuejs.org/style-guide/rules-recommended) | [Rules D](https://vuejs.org/style-guide/rules-use-with-caution) | [FAQ](https://vuejs.org/about/faq) | [Releases](https://vuejs.org/about/releases) | [Community Guide](https://vuejs.org/about/community-guide) | [Error Reference](https://vuejs.org/error-reference/) | [Team](https://vuejs.org/about/team) | [Glossary](https://vuejs.org/glossary/) | [Code of Conduct](https://vuejs.org/about/coc) | [Privacy Policy](https://vuejs.org/about/privacy) | [Tutorial](https://vuejs.org/tutorial/) | [Examples](https://vuejs.org/examples/) | [Playground](https://play.vuejs.org)
