---
name: vue-docs
version: "3.x"
tags:
  - vue
  - vuejs
  - vue 3
  - progressive framework
  - composition api
  - options api
  - reactivity
  - ref
  - reactive
  - computed
  - watch
  - watchEffect
  - components
  - props
  - emits
  - slots
  - provide inject
  - composables
  - custom directives
  - plugins
  - transition
  - transition group
  - keep alive
  - teleport
  - suspense
  - sfc
  - single-file components
  - script setup
  - scoped css
  - css modules
  - vite
  - vue router
  - pinia
  - ssr
  - typescript
  - volar
  - vitest
  - cypress
  - playwright
  - defineCustomElement
  - render function
  - h()
  - style guide
  - accessibility
  - performance
  - security
  - nuxt
  - defineProps
  - defineEmits
  - defineModel
  - defineExpose
  - defineOptions
  - useTemplateRef
  - useId
  - nextTick
  - effectScope
  - shallowRef
  - markRaw
  - toRaw
description: |
  Vue.js 3.x — Composition API, reactivity, components, slots, directives, routing, Pinia, SSR.
---

# Vue.js — The Progressive JavaScript Framework

> **Version**: Vue 3.x (latest) | **Source**: [vuejs.org](https://vuejs.org/)

Vue (pronounced /vjuː/, like "view") is a JavaScript framework for building user interfaces. It builds on top of standard HTML, CSS, and JavaScript and provides a declarative, component-based programming model that helps you efficiently develop user interfaces of any complexity.

## Core Features

- **Declarative Rendering**: Vue extends standard HTML with a template syntax that allows you to declaratively describe HTML output based on JavaScript state
- **Reactivity**: Vue automatically tracks JavaScript state changes and efficiently updates the DOM when changes happen
- **Component-Based**: Build UIs from reusable, composable components
- **Progressive**: Use Vue as little or as much as you need — from enhancing static HTML to full SPAs with SSR

## The Progressive Framework

Vue can be used in different ways depending on your use case:
- Enhancing static HTML without a build step
- Embedding as Web Components on any page
- Single-Page Application (SPA)
- Fullstack / Server-Side Rendering (SSR)
- Jamstack / Static Site Generation (SSG)
- Targeting desktop, mobile, WebGL, and even the terminal

## API Styles

### Options API
Uses an object of options (data, methods, computed, watch) to define component logic:

```javascript
export default {
  data() {
    return { count: 0 };
  },
  methods: {
    increment() { this.count++; }
  },
  template: `<button @click="increment">{{ count }}</button>`
};
```

### Composition API
Uses imported API functions to define component logic:

```vue
<script setup>
import { ref } from 'vue';

const count = ref(0);
function increment() { count.value++; }
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

### Which to Choose?
- **Options API**: Easier to understand for beginners, good for smaller projects
- **Composition API**: Better for larger projects, better TypeScript support, better logic reuse via composables
- Both styles can be used in the same project; components are compatible

## Quick Start

### Prerequisites
- Node.js ^22.18.0 || >=24.12.0
- Familiarity with the command line

### Scaffolding a Project

```bash
npm create vue@latest
# or: pnpm create vue@latest
# or: yarn create vue@latest
# or: bun create vue@latest
```

Prompts include: TypeScript, JSX, Vue Router, Pinia, Vitest, E2E testing (Cypress/Nightwatch/Playwright), ESLint, Prettier, Vue DevTools.

```bash
cd <your-project-name>
npm install
npm run dev
```

### Using Vue from CDN

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<div id="app">{{ message }}</div>
<script>
  const { createApp, ref } = Vue;
  createApp({ setup() { return { message: ref('Hello Vue!') }; } }).mount('#app');
</script>
```

### Frameworks

Vue frameworks that support SSR and other features out-of-the-box:
- [Nuxt](https://nuxt.com/) — Full-stack Vue framework
- [Vike](https://vike.dev/) — Vite-based Vue framework
- [Astro](https://astro.build/) — Content-focused framework
- [Quasar](https://quasar.dev/) — Cross-platform framework

## Ecosystem

| Library | Description | URL |
|---------|-------------|-----|
| Vue Router | Official router for Vue.js | [router.vuejs.org](https://router.vuejs.org/) |
| Pinia | Official state management | [pinia.vuejs.org](https://pinia.vuejs.org/) |
| Vue DevTools | Browser devtools extension | [devtools.vuejs.org](https://devtools.vuejs.org/) |
| Vite | Build tool (powers Vue SFCs) | [vite.dev](https://vite.dev/) |
| Vue CLI | Legacy project scaffolding | [cli.vuejs.org](https://cli.vuejs.org/) |

## File Index

| File | Topics Covered |
|------|----------------|
| [getting-started.md](getting-started.md) | Introduction, quick start, creating an app, template syntax, reactivity fundamentals, computed properties, class/style bindings, conditional/list rendering, event handling, form bindings, watchers, template refs, components basics, lifecycle hooks |
| [components.md](components.md) | Registration, props, events, component v-model, fallthrough attributes, slots, provide/inject, async components, composables, custom directives, plugins |
| [built-ins.md](built-ins.md) | Transition, TransitionGroup, KeepAlive, Teleport, Suspense, SFC, tooling, routing, state management, testing, SSR |
| [api-reference.md](api-reference.md) | Global API, Composition API, Options API, built-in directives/components/special elements/attributes, SFC spec, script setup, CSS features, custom elements, render functions, SSR, TypeScript utility types, custom renderer, compile-time flags |
| [best-practices.md](best-practices.md) | Production deployment, performance, accessibility, security, TypeScript usage, style guide, FAQ, releases, community guide, error reference, extra topics |

## Documentation Links

### Getting Started
- [Introduction](https://vuejs.org/guide/introduction)
- [Quick Start](https://vuejs.org/guide/quick-start)

### Essentials
- [Creating an Application](https://vuejs.org/guide/essentials/application)
- [Template Syntax](https://vuejs.org/guide/essentials/template-syntax)
- [Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals)
- [Computed Properties](https://vuejs.org/guide/essentials/computed)
- [Class and Style Bindings](https://vuejs.org/guide/essentials/class-and-style)
- [Conditional Rendering](https://vuejs.org/guide/essentials/conditional)
- [List Rendering](https://vuejs.org/guide/essentials/list)
- [Event Handling](https://vuejs.org/guide/essentials/event-handling)
- [Form Input Bindings](https://vuejs.org/guide/essentials/forms)
- [Watchers](https://vuejs.org/guide/essentials/watchers)
- [Template Refs](https://vuejs.org/guide/essentials/template-refs)
- [Components Basics](https://vuejs.org/guide/essentials/component-basics)
- [Lifecycle Hooks](https://vuejs.org/guide/essentials/lifecycle)

### Components In-Depth
- [Registration](https://vuejs.org/guide/components/registration)
- [Props](https://vuejs.org/guide/components/props)
- [Events](https://vuejs.org/guide/components/events)
- [Component v-model](https://vuejs.org/guide/components/v-model)
- [Fallthrough Attributes](https://vuejs.org/guide/components/attrs)
- [Slots](https://vuejs.org/guide/components/slots)
- [Provide / inject](https://vuejs.org/guide/components/provide-inject)
- [Async Components](https://vuejs.org/guide/components/async)

### Reusability
- [Composables](https://vuejs.org/guide/reusability/composables)
- [Custom Directives](https://vuejs.org/guide/reusability/custom-directives)
- [Plugins](https://vuejs.org/guide/reusability/plugins)

### Built-in Components
- [Transition](https://vuejs.org/guide/built-ins/transition)
- [TransitionGroup](https://vuejs.org/guide/built-ins/transition-group)
- [KeepAlive](https://vuejs.org/guide/built-ins/keep-alive)
- [Teleport](https://vuejs.org/guide/built-ins/teleport)
- [Suspense](https://vuejs.org/guide/built-ins/suspense)

### Scaling Up
- [Single-File Components](https://vuejs.org/guide/scaling-up/sfc)
- [Tooling](https://vuejs.org/guide/scaling-up/tooling)
- [Routing](https://vuejs.org/guide/scaling-up/routing)
- [State Management](https://vuejs.org/guide/scaling-up/state-management)
- [Testing](https://vuejs.org/guide/scaling-up/testing)
- [Server-Side Rendering (SSR)](https://vuejs.org/guide/scaling-up/ssr)

### Best Practices
- [Production Deployment](https://vuejs.org/guide/best-practices/production-deployment)
- [Performance](https://vuejs.org/guide/best-practices/performance)
- [Accessibility](https://vuejs.org/guide/best-practices/accessibility)
- [Security](https://vuejs.org/guide/best-practices/security)

### TypeScript
- [Overview](https://vuejs.org/guide/typescript/overview)
- [TS with Composition API](https://vuejs.org/guide/typescript/composition-api)
- [TS with Options API](https://vuejs.org/guide/typescript/options-api)

### Extra Topics
- [Ways of Using Vue](https://vuejs.org/guide/extras/ways-of-using-vue)
- [Composition API FAQ](https://vuejs.org/guide/extras/composition-api-faq)
- [Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth)
- [Rendering Mechanism](https://vuejs.org/guide/extras/rendering-mechanism)
- [Render Functions & JSX](https://vuejs.org/guide/extras/render-function)
- [Vue and Web Components](https://vuejs.org/guide/extras/web-components)
- [Animation Techniques](https://vuejs.org/guide/extras/animation)

### API Reference
- [API Reference](https://vuejs.org/api/)

### Other
- [Examples](https://vuejs.org/examples/)
- [Tutorial](https://vuejs.org/tutorial/)
- [Style Guide](https://vuejs.org/style-guide/)
- [Glossary](https://vuejs.org/glossary/)
- [Error Reference](https://vuejs.org/error-reference/)
- [FAQ](https://vuejs.org/about/faq)
- [Team](https://vuejs.org/about/team)
- [Releases](https://vuejs.org/about/releases)
- [Community Guide](https://vuejs.org/about/community-guide)
- [Code of Conduct](https://vuejs.org/about/coc)
- [Playground](https://play.vuejs.org)
