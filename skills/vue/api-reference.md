# Vue.js — API Reference

> Source: [API Reference](https://vuejs.org/api/)

## Global API

### Application

| API | Description |
|-----|-------------|
| `createApp()` | Create an application instance |
| `createSSRApp()` | Create an SSR application instance |
| `app.mount()` | Mount app to a container element |
| `app.unmount()` | Unmount the app |
| `app.onUnmount()` | Register unmount callback |
| `app.component()` | Register or retrieve a global component |
| `app.directive()` | Register or retrieve a global directive |
| `app.use()` | Install a plugin |
| `app.mixin()` | Apply a global mixin (discouraged) |
| `app.provide()` | Provide a value to all components |
| `app.runWithContext()` | Execute function with app context |
| `app.version` | Vue version the app was created with |
| `app.config` | App-level config object |
| `app.config.errorHandler` | Global error handler |
| `app.config.warnHandler` | Global warning handler |
| `app.config.performance` | Enable performance tracking |
| `app.config.compilerOptions` | Runtime compiler options |
| `app.config.globalProperties` | Global properties accessible in all components |
| `app.config.optionMergeStrategies` | Custom option merge strategies |
| `app.config.idPrefix` | Prefix for `useId()` generated IDs |
| `app.config.throwUnhandledErrorInProduction` | Throw unhandled errors in production |

See: [Application API](https://vuejs.org/api/application)

### General

| API | Description |
|-----|-------------|
| `version` | Current Vue version string |
| `nextTick()` | Wait for next DOM update cycle |
| `defineComponent()` | Type-helper for component definitions |
| `defineAsyncComponent()` | Define an async component |

See: [General API](https://vuejs.org/api/general)

## Composition API

### `setup()`

- [Basic Usage](https://vuejs.org/api/composition-api-setup)
- [Accessing Props](https://vuejs.org/api/composition-api-setup)
- [Setup Context](https://vuejs.org/api/composition-api-setup) — `attrs`, `slots`, `emit`, `expose`
- [Usage with Render Functions](https://vuejs.org/api/composition-api-setup)

> **Note**: `<script setup>` is the recommended way to use Composition API in SFCs.

See: [setup()](https://vuejs.org/api/composition-api-setup)

### Reactivity: Core

| API | Description |
|-----|-------------|
| `ref()` | Reactive reference wrapping a value |
| `computed()` | Computed property |
| `reactive()` | Create a reactive object proxy |
| `readonly()` | Create a readonly proxy of an object |
| `watchEffect()` | Watch and auto-track dependencies |
| `watchPostEffect()` | Like `watchEffect` but flushes after DOM updates |
| `watchSyncEffect()` | Like `watchEffect` but flushes synchronously |
| `watch()` | Watch specific reactive sources |
| `onWatcherCleanup()` | Register cleanup in watcher callback |

See: [Reactivity: Core](https://vuejs.org/api/reactivity-core)

### Reactivity: Utilities

| API | Description |
|-----|-------------|
| `isRef()` | Check if value is a ref |
| `unref()` | Unwrap a ref |
| `toRef()` | Create a ref from a reactive property |
| `toValue()` | Normalize refs/getters to values |
| `toRefs()` | Convert reactive object to refs |
| `isProxy()` | Check if value is a reactive proxy |
| `isReactive()` | Check if value is a reactive object |
| `isReadonly()` | Check if value is a readonly proxy |
| `isShallow()` | Check if value is a shallow proxy |

See: [Reactivity: Utilities](https://vuejs.org/api/reactivity-utilities)

### Reactivity: Advanced

| API | Description |
|-----|-------------|
| `shallowRef()` | Ref without deep reactivity |
| `triggerRef()` | Manually trigger shallow ref effects |
| `customRef()` | Custom ref with track/trigger control |
| `shallowReactive()` | Reactive without deep reactivity |
| `shallowReadonly()` | Readonly without deep conversion |
| `toRaw()` | Get raw original object from proxy |
| `markRaw()` | Mark object as never reactive |
| `effectScope()` | Create an effect scope |
| `getCurrentScope()` | Get current effect scope |
| `onScopeDispose()` | Register dispose callback on scope |

See: [Reactivity: Advanced](https://vuejs.org/api/reactivity-advanced)

### Lifecycle Hooks

| Hook | Description |
|------|-------------|
| `onMounted()` | Called after component mount |
| `onUpdated()` | Called after component update |
| `onUnmounted()` | Called after component unmount |
| `onBeforeMount()` | Called before component mount |
| `onBeforeUpdate()` | Called before component update |
| `onBeforeUnmount()` | Called before component unmount |
| `onErrorCaptured()` | Capture errors from child components |
| `onRenderTracked()` | Dev only — track render dependency |
| `onRenderTriggered()` | Dev only — trigger render re-run |
| `onActivated()` | Called when kept-alive component activated |
| `onDeactivated()` | Called when kept-alive component deactivated |
| `onServerPrefetch()` | Called before SSR render |

See: [Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle)

### Dependency Injection

| API | Description |
|-----|-------------|
| `provide()` | Provide a value to descendants |
| `inject()` | Inject a value from ancestor |
| `hasInjectionContext()` | Check if injection context exists |

See: [Dependency Injection](https://vuejs.org/api/composition-api-dependency-injection)

### Helpers

| API | Description |
|-----|-------------|
| `useAttrs()` | Access fallthrough attributes |
| `useSlots()` | Access slots in setup |
| `useModel()` | Two-way binding helper for props |
| `useTemplateRef()` | Get template ref by name (3.5+) |
| `useId()` | Generate unique ID for SSR-safe usage |

See: [Helpers](https://vuejs.org/api/composition-api-helpers)

## Options API

### Options: State

| Option | Description |
|--------|-------------|
| `data` | Function returning initial component state |
| `props` | Component props declaration |
| `computed` | Computed properties |
| `methods` | Component methods |
| `watch` | Watchers declaration |
| `emits` | Declare emitted events |
| `expose` | Expose public properties |

See: [Options: State](https://vuejs.org/api/options-state)

### Options: Rendering

| Option | Description |
|--------|-------------|
| `template` | String template |
| `render` | Render function |
| `compilerOptions` | Runtime compiler options |
| `slots` | Access slots in render function |

See: [Options: Rendering](https://vuejs.org/api/options-rendering)

### Options: Lifecycle

| Option | Description |
|--------|-------------|
| `beforeCreate` | Before instance creation |
| `created` | After instance creation |
| `beforeMount` | Before DOM mount |
| `mounted` | After DOM mount |
| `beforeUpdate` | Before reactive data change |
| `updated` | After reactive data change |
| `beforeUnmount` | Before component unmount |
| `unmounted` | After component unmount |
| `errorCaptured` | Capture child errors |
| `renderTracked` | Dev — render dependency tracked |
| `renderTriggered` | Dev — render re-run triggered |
| `activated` | Kept-alive component activated |
| `deactivated` | Kept-alive component deactivated |
| `serverPrefetch` | Before SSR render |

See: [Options: Lifecycle](https://vuejs.org/api/options-lifecycle)

### Options: Composition

| Option | Description |
|--------|-------------|
| `provide` | Provide values to descendants |
| `inject` | Inject values from ancestors |
| `mixins` | Array of mixin objects |
| `extends` | Extend another component |

See: [Options: Composition](https://vuejs.org/api/options-composition)

### Options: Misc

| Option | Description |
|--------|-------------|
| `name` | Component name |
| `inheritAttrs` | Enable/disable attribute fallthrough |
| `components` | Local component registration |
| `directives` | Local directive registration |

See: [Options: Misc](https://vuejs.org/api/options-misc)

### Component Instance

| Property | Description |
|----------|-------------|
| `$data` | Reactive data object |
| `$props` | Component props |
| `$el` | Root DOM element |
| `$options` | Resolved component options |
| `$parent` | Parent component instance |
| `$root` | Root component instance |
| `$slots` | Slots object |
| `$refs` | Template refs |
| `$attrs` | Fallthrough attributes |
| `$watch()` | Watch a property |
| `$emit()` | Emit an event |
| `$forceUpdate()` | Force re-render |
| `$nextTick()` | Wait for next DOM update |

See: [Component Instance](https://vuejs.org/api/component-instance)

## Built-ins

### Directives

| Directive | Description |
|-----------|-------------|
| `v-text` | Set element's text content |
| `v-html` | Set element's innerHTML |
| `v-show` | Toggle visibility via `display` |
| `v-if` | Conditionally render (create/destroy) |
| `v-else` | Else block for `v-if` |
| `v-else-if` | Else-if block for `v-if` |
| `v-for` | Render list from array/number/object |
| `v-on` (`@`) | Attach event listener |
| `v-bind` (`:`) | Bind attribute/prop |
| `v-model` | Two-way binding on form inputs |
| `v-slot` (`#`) | Declare slot content |
| `v-pre` | Skip compilation for element |
| `v-once` | Render element only once |
| `v-memo` | Memoize subtree based on deps |
| `v-cloak` | Hide until compiled (use with CSS) |

See: [Built-in Directives](https://vuejs.org/api/built-in-directives)

### Components

| Component | Description |
|-----------|-------------|
| `<Transition>` | Animate single element/component enter/leave |
| `<TransitionGroup>` | Animate list of elements |
| `<KeepAlive>` | Cache component instances |
| `<Teleport>` | Render content to another DOM location |
| `<Suspense>` | Handle async component dependencies |

See: [Built-in Components](https://vuejs.org/api/built-in-components)

### Special Elements

| Element | Description |
|---------|-------------|
| `<component>` | Render dynamic component with `is` prop |
| `<slot>` | Declare slot content distribution |
| `<template>` | Template wrapper (no DOM output) |

See: [Special Elements](https://vuejs.org/api/built-in-special-elements)

### Special Attributes

| Attribute | Description |
|-----------|-------------|
| `key` | Hint for Vue's node identity tracking |
| `ref` | Register element/component reference |
| `is` | Specify component type for `<component>` |

See: [Special Attributes](https://vuejs.org/api/built-in-special-attributes)

## Single-File Component

### Syntax Specification

- [Overview](https://vuejs.org/api/sfc-spec)
- [Language Blocks](https://vuejs.org/api/sfc-spec) — `<template>`, `<script>`, `<style>`, custom blocks
- [Automatic Name Inference](https://vuejs.org/api/sfc-spec)
- [Pre-Processors](https://vuejs.org/api/sfc-spec) — `lang="pug"`, `lang="scss"`, etc.
- [src Imports](https://vuejs.org/api/sfc-spec)
- [Comments](https://vuejs.org/api/sfc-spec)

See: [SFC Syntax Specification](https://vuejs.org/api/sfc-spec)

### `<script setup>`

| Feature | Description |
|---------|-------------|
| Basic Syntax | Top-level bindings exposed to template |
| Reactivity | `ref`/`reactive` auto-exposed |
| Using Components | Import directly, use in template |
| Using Custom Directives | `vXxx` naming convention |
| `defineProps()` | Declare props (compiler macro) |
| `defineEmits()` | Declare emits (compiler macro) |
| `defineModel()` | Declare v-model (compiler macro) |
| `defineExpose()` | Expose component API |
| `defineOptions()` | Declare component options |
| `defineSlots()` | Type-check slots |
| `useSlots()` / `useAttrs()` | Access slots/attrs in setup |
| Normal `<script>` | Use alongside `<script setup>` |
| Top-level `await` | Async setup support |
| Import Statements | Auto-exposed to template |
| Generics | `<script setup lang="ts" generic="T">` |
| Restrictions | No `src` import, must be top-level |

See: [`<script setup>`](https://vuejs.org/api/sfc-script-setup)

### CSS Features

| Feature | Description |
|---------|-------------|
| Scoped CSS | `<style scoped>` — add data attributes for scoping |
| CSS Modules | `<style module>` — import as `styleModule.className` |
| `v-bind()` in CSS | Use component state in CSS: `color: v-bind(themeColor)` |

See: [SFC CSS Features](https://vuejs.org/api/sfc-css-features)

## Advanced APIs

### Custom Elements

| API | Description |
|-----|-------------|
| `defineCustomElement()` | Define a Vue component as a custom element |
| `useHost()` | Access host custom element in CE |
| `useShadowRoot()` | Access shadow root in CE |
| `this.$host` | Access host element (Options API) |

See: [Custom Elements](https://vuejs.org/api/custom-elements)

### Render Function

| API | Description |
|-----|-------------|
| `h()` | Create VNodes |
| `mergeProps()` | Merge multiple props objects |
| `cloneVNode()` | Clone a VNode |
| `isVNode()` | Check if value is a VNode |
| `resolveComponent()` | Resolve a component by name |
| `resolveDirective()` | Resolve a directive by name |
| `withDirectives()` | Apply directives to a VNode |
| `withModifiers()` | Add event modifiers to handler |

See: [Render Function](https://vuejs.org/api/render-function)

### Server-Side Rendering

| API | Description |
|-----|-------------|
| `renderToString()` | Render app to string |
| `renderToNodeStream()` | Render to Node.js readable stream |
| `pipeToNodeWritable()` | Pipe to Node.js writable stream |
| `renderToWebStream()` | Render to Web ReadableStream |
| `pipeToWebWritable()` | Pipe to Web WritableStream |
| `renderToSimpleStream()` | Simplified stream rendering |
| `useSSRContext()` | Access SSR context |
| `data-allow-mismatch` | Attribute to suppress hydration mismatch warnings |

See: [SSR API](https://vuejs.org/api/ssr)

### TypeScript Utility Types

| Type | Description |
|------|-------------|
| `PropType<T>` | Type for prop definitions |
| `MaybeRef<T>` | `T | Ref<T>` |
| `MaybeRefOrGetter<T>` | `T | Ref<T> | (() => T)` |
| `ExtractPropTypes<T>` | Extract props from runtime props object |
| `ExtractPublicPropTypes<T>` | Extract public props from TS props interface |
| `ComponentCustomProperties` | Augment component instance type |
| `ComponentCustomOptions` | Augment component options type |
| `ComponentCustomProps` | Augment component props type |
| `CSSProperties` | Augment CSS properties |

See: [TypeScript Utility Types](https://vuejs.org/api/utility-types)

### Custom Renderer

| API | Description |
|-----|-------------|
| `createRenderer()` | Create a custom renderer |

See: [Custom Renderer](https://vuejs.org/api/custom-renderer)

### Compile-Time Flags

| Flag | Description |
|------|-------------|
| `__VUE_OPTIONS_API__` | Enable/disable Options API (tree-shaking) |
| `__VUE_PROD_DEVTOOLS__` | Enable devtools in production |
| `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__` | Show hydration mismatch details in prod |
| Configuration Guides | How to configure flags per build tool |

See: [Compile-Time Flags](https://vuejs.org/api/compile-time-flags)

**Source**: [API Reference](https://vuejs.org/api/) | [Application](https://vuejs.org/api/application) | [General](https://vuejs.org/api/general) | [setup()](https://vuejs.org/api/composition-api-setup) | [Reactivity: Core](https://vuejs.org/api/reactivity-core) | [Reactivity: Utilities](https://vuejs.org/api/reactivity-utilities) | [Reactivity: Advanced](https://vuejs.org/api/reactivity-advanced) | [Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle) | [Dependency Injection](https://vuejs.org/api/composition-api-dependency-injection) | [Helpers](https://vuejs.org/api/composition-api-helpers) | [Options: State](https://vuejs.org/api/options-state) | [Options: Rendering](https://vuejs.org/api/options-rendering) | [Options: Lifecycle](https://vuejs.org/api/options-lifecycle) | [Options: Composition](https://vuejs.org/api/options-composition) | [Options: Misc](https://vuejs.org/api/options-misc) | [Component Instance](https://vuejs.org/api/component-instance) | [Built-in Directives](https://vuejs.org/api/built-in-directives) | [Built-in Components](https://vuejs.org/api/built-in-components) | [Special Elements](https://vuejs.org/api/built-in-special-elements) | [Special Attributes](https://vuejs.org/api/built-in-special-attributes) | [SFC Spec](https://vuejs.org/api/sfc-spec) | [script setup](https://vuejs.org/api/sfc-script-setup) | [SFC CSS Features](https://vuejs.org/api/sfc-css-features) | [Custom Elements](https://vuejs.org/api/custom-elements) | [Render Function](https://vuejs.org/api/render-function) | [SSR](https://vuejs.org/api/ssr) | [Utility Types](https://vuejs.org/api/utility-types) | [Custom Renderer](https://vuejs.org/api/custom-renderer) | [Compile-Time Flags](https://vuejs.org/api/compile-time-flags)
