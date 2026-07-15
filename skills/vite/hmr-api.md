# HMR API

Vite's Hot Module Replacement API allows modules to accept updates without reloading the page.

## Required Conditional Guard

HMR API is only available in dev mode. Guard against production:

```ts
if (import.meta.hot) {
  import.meta.hot.accept()
}
```

## IntelliSense for TypeScript

```ts
/// <reference types="vite/client" />
```

---

## hot.accept(cb)

Accept updates to the current module:

```ts
import.meta.hot.accept((newModule) => {
  if (newModule) {
    // newModule is the updated module
    console.log('Module updated')
  }
})
```

---

## hot.accept(deps, cb)

Accept updates to specific dependencies:

```ts
import { foo } from './foo'

import.meta.hot.accept('./foo', (newFooModule) => {
  if (newFooModule) {
    // Re-import or update state
    const newFoo = newFooModule.foo
  }
})
```

Multiple dependencies:

```ts
import.meta.hot.accept(['./foo', './bar'], (mods) => {
  const [newFoo, newBar] = mods
  // mods[0] = new foo module, mods[1] = new bar module
})
```

---

## hot.dispose(cb)

Cleanup before a module is replaced:

```ts
import.meta.hot.dispose((oldModule) => {
  // Cleanup side effects
  clearInterval(timer)
  removeEventListener('click', handler)
})
```

---

## hot.prune(cb)

Called when a module is no longer used (pruned from module graph):

```ts
import.meta.hot.prune((data) => {
  // Cleanup when module is removed
  console.log('Module pruned')
})
```

---

## hot.data

Persistent data across HMR updates:

```ts
// Store data that survives HMR
if (import.meta.hot) {
  if (!import.meta.hot.data.count) {
    import.meta.hot.data.count = 0
  }
  import.meta.hot.data.count++
}

// Dispose: save data
import.meta.hot?.dispose((data) => {
  data.count = count
})
```

---

## hot.decline()

Mark a module as not HMR-able (forces full reload):

```ts
import.meta.hot.decline()
```

---

## hot.invalidate(message?)

Invalidate the current module (forces re-import):

```ts
import.meta.hot.invalidate('Reason for invalidation')
// This triggers a full reload of the module
```

---

## hot.on(event, cb)

Listen for custom HMR events:

```ts
import.meta.hot.on('vite:beforeUpdate', (payload) => {
  console.log('Before update:', payload)
})

import.meta.hot.on('vite:afterUpdate', (payload) => {
  console.log('After update:', payload)
})

import.meta.hot.on('vite:error', (payload) => {
  console.error('HMR error:', payload)
})
```

### Built-in Events

| Event | Description |
|-------|-------------|
| `vite:beforeUpdate` | Before HMR update is applied |
| `vite:afterUpdate` | After HMR update is applied |
| `vite:beforePrune` | Before modules are pruned |
| `vite:beforeFullReload` | Before full page reload |
| `vite:error` | HMR error occurred |
| `vite:invalidate` | Module invalidated |
| `vite:warm-up` | File warmed up |

---

## hot.off(event, cb)

Remove event listener:

```ts
const handler = (payload) => { /* ... */ }
import.meta.hot.on('vite:beforeUpdate', handler)
import.meta.hot.off('vite:beforeUpdate', handler)
```

---

## hot.send(event, data)

Send event to the dev server:

```ts
import.meta.hot.send('my-custom-event', { data: 'hello' })
```

Listen on the server side:

```ts
// In a plugin's configureServer hook
configureServer(server) {
  server.ws.on('my-custom-event', (data, client) => {
    console.log('Received from client:', data)
  })
}
```

---

## Complete Example

```ts
let counter = 0
const timer = setInterval(() => counter++, 1000)

if (import.meta.hot) {
  // Preserve counter across HMR
  if (import.meta.hot.data.counter) {
    counter = import.meta.hot.data.counter
  }

  // Save counter before dispose
  import.meta.hot.dispose((data) => {
    data.counter = counter
    clearInterval(timer)
  })

  // Accept updates
  import.meta.hot.accept((newModule) => {
    console.log('Module updated, counter preserved:', counter)
  })
}
```
