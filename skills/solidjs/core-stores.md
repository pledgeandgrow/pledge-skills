# SolidJS Stores

## createStore

```tsx
import { createStore } from "solid-js/store";
```

Stores use JavaScript's `Proxy` mechanism to create deeply reactive data structures. Unlike signals (which are single values), stores manage objects, arrays, and nested structures with fine-grained reactivity at every level.

### Creating a Store

```tsx
import { createStore } from "solid-js/store";

const [store, setStore] = createStore({
  userCount: 3,
  users: [
    { id: 0, username: "felix909", location: "England", loggedIn: false },
    { id: 1, username: "tracy634", location: "Canada", loggedIn: true },
    { id: 2, username: "johny123", location: "India", loggedIn: true },
  ],
});
```

### Accessing Store Values

Store values are accessed directly (no getter function needed). Accessing a property within a tracking scope creates a reactive dependency:

```tsx
function App() {
  return (
    <div>
      <h1>Hello, {store.users[0].username}</h1>
      <p>User count: {store.userCount}</p>
    </div>
  );
}
```

### Modifying Store Values

Use the setter function with **path syntax** — the initial arguments specify the path to the target, and the last argument provides the new value:

```tsx
// Update a single property
setStore("userCount", 5);

// Update nested property
setStore("users", 0, "username", "newUsername");

// Update with a function
setStore("users", (currentUsers) => [
  ...currentUsers,
  { id: 3, username: "michael584", location: "Nigeria", loggedIn: false },
]);

// Shallow merge objects
setStore("users", 0, { id: 109 });
// Equivalent to:
setStore("users", 0, (user) => ({ ...user, id: 109 }));
```

---

## Path Syntax

Path syntax provides flexible ways to target values within a store.

### String Keys

```tsx
setStore("users", 0, "username", "newName");
```

### Array of Keys

Select multiple properties at once:

```tsx
setStore(["users", "userCount"], (prev) => ({
  users: [...prev.users, newUser],
  userCount: prev.users.length + 1,
}));
```

### Filtering Functions

Use functions to dynamically select items:

```tsx
// Update all users where loggedIn is false
setStore("users", (u) => !u.loggedIn, "loggedIn", true);
```

---

## Modifying Arrays

### Appending New Values

```tsx
setStore("users", (currentUsers) => [...currentUsers, newUser]);
```

### Modifying Multiple Elements

```tsx
setStore("users", { id: 1 }, "loggedIn", false);
setStore("users", { id: 2 }, "loggedIn", false);
```

### Dynamic Value Assignment

```tsx
// Set a property based on a condition
setStore("users", (u) => u.id === 0, "location", "USA");
```

### Filtering Values

```tsx
setStore("users", (users) => users.filter((u) => u.loggedIn));
```

---

## Nested Stores

You can create derived stores from existing store properties:

```tsx
const [store, setStore] = createStore({ users: [...] });
const [users, setUsers] = createStore(store.users);

setUsers((currentUsers) => [...currentUsers, newUser]);
// Changes through setUsers update store.users and vice versa
```

---

## Store Utilities

### produce

```tsx
import { produce } from "solid-js/store";
```

Provides a way to work with store data as if it were a mutable JavaScript object. Make multiple changes at once without multiple setter calls:

```tsx
import { produce } from "solid-js/store";

// Without produce — multiple setter calls
setStore("users", 0, "username", "newUsername");
setStore("users", 0, "location", "newLocation");

// With produce — single call, mutable draft
setStore(
  "users",
  0,
  produce((user) => {
    user.username = "newUsername";
    user.location = "newLocation";
  })
);
```

**Key points:**
- `produce` creates a temporary draft, applies changes, then produces a new immutable version
- Works with arrays and objects only (not Sets or Maps)
- Useful for batch modifications to a single store entry

### reconcile

```tsx
import { reconcile } from "solid-js/store";
```

Merges new data into an existing store by diffing. Only changed values trigger updates, avoiding unnecessary re-renders:

```tsx
import { createStore, reconcile } from "solid-js/store";

const [data, setData] = createStore({
  animals: ["cat", "dog", "bird", "gorilla"],
});

const newData = ["cat", "dog", "bird", "gorilla", "koala"];
setData("animals", reconcile(newData));
// Only 'koala' (the new addition) triggers an update
```

**Use cases:**
- Integrating API responses into existing store data
- Replacing store data while preserving reactivity for unchanged items
- Diffing large datasets efficiently

### unwrap

```tsx
import { unwrap } from "solid-js/store";
```

Extracts raw (non-reactive) data from a store. Returns a plain JavaScript object without proxy wrappers:

```tsx
import { unwrap } from "solid-js/store";

const rawData = unwrap(store);
// rawData is a plain object — no reactivity
```

**Use cases:**
- Serializing store data for persistence
- Passing data to non-reactive code
- Debugging and inspection

---

## Top-Level Array Stores

Stores can be arrays directly:

```tsx
const [items, setItems] = createStore([
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
]);

setItems(0, "name", "Updated Item 1");
setItems((items) => [...items, { id: 3, name: "Item 3" }]);
```

---

## Store vs. Signal: When to Use What

| Feature | `createSignal` | `createStore` |
|---------|---------------|---------------|
| Single values | ✅ Best choice | Overkill |
| Objects/arrays | Manual spreading needed | ✅ Deep reactivity |
| Nested updates | Not supported | ✅ Path syntax |
| Performance | Faster for simple values | Better for complex structures |
| Memory | Less overhead | Proxy overhead |
| Use case | Primitives, toggles, counters | Complex state, forms, lists |

---

## Common Patterns

### Form State

```tsx
const [form, setForm] = createStore({
  email: "",
  password: "",
  remember: false,
});

const updateField = (field, value) => setForm(field, value);

<input
  value={form.email}
  onInput={(e) => updateField("email", e.currentTarget.value)}
/>;
```

### Todo List

```tsx
const [todos, setTodos] = createStore([
  { id: 1, text: "Learn Solid", done: false },
]);

const addTodo = (text) =>
  setTodos((todos) => [...todos, { id: Date.now(), text, done: false }]);

const toggleTodo = (id) =>
  setTodos(
    (t) => t.id === id,
    "done",
    (done) => !done
  );

const removeTodo = (id) =>
  setTodos((todos) => todos.filter((t) => t.id !== id));
```

### Syncing Store Values

```tsx
const [store, setStore] = createStore({ users: [], userCount: 0 });

createEffect(() => {
  setStore("userCount", store.users.length);
});
```
