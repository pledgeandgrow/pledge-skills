# State Management and Reactivity

> **Sources:** [The Basics of State](https://dioxuslabs.com/learn/0.7/essentials/basics/) | [Intro to Reactivity](https://dioxuslabs.com/learn/0.7/essentials/basics/reactivity) | [Hooks](https://dioxuslabs.com/learn/0.7/essentials/basics/hooks)

## The Theory of State Management

State management is the act of:
1. Initializing data for the UI
2. Handling events from the user
3. Updating the data and re-rendering the UI

## For Experienced Web Developers

Dioxus uses signal-based reactivity, inspired by React, Preact, SolidJS, and Svelte. Unlike SolidJS, reads and writes are explicit (`.read()` and `.write()`):

```rust
let mut count = use_signal(|| 0);
rsx! {
    button {
        onclick: move |_| *count.write() += 1,
        "Increment"
    }
    "{count.read().to_string()}"
}
```

In many cases, `.read()` is implicit through formatting:

```rust
rsx! { "Count: {count}" }
```

Unlike Svelte, Dioxus does not do compile-time transformation. Unlike SolidJS, Dioxus components run multiple times. Think of it as a hybrid of React and SolidJS — reactivity is automatically tracked, but components are free to run multiple times.

Dioxus employs "common sense" optimizations like automatic property memoization and automatic reactivity tracking.

## For Experienced Rustaceans

Dioxus uses stateful "hooks" — a paradigm from web development (React). If you prefer not to write React-like code, you can use structs:

```rust
struct EditorState {
    text: String,
}

impl EditorState {
    fn handle_input(&mut self, event: FormEvent) {
        self.text = event.value();
    }
}

#[component]
fn TextEditor() -> Element {
    let mut state = use_signal(EditorState::new);
    rsx! {
        input {
            oninput: move |event| state.write().handle_input(event)
        }
    }
}
```

Benefits of built-in reactive primitives:
- Ability to reference data in `'static` tasks and callbacks
- `.write()` automatically queues a component to re-render
- Values are never "stale", even in async contexts

## Three Pillars of Reactivity

### Pillar 1: Data Flows Down

Unidirectional data flow — child components render purely as a function of their inputs. Components provide values and functions to modify those values, passed down as properties. Child components cannot directly modify parent state.

```rust
#[component]
fn Parent() -> Element {
    let mut count = use_signal(|| 0);
    rsx! {
        Child { count: count(), on_increment: move |_| *count.write() += 1 }
    }
}

#[component]
fn Child(count: i32, on_increment: EventHandler<()>) -> Element {
    rsx! {
        button { onclick: move |_| on_increment.call(()), "Count: {count}" }
    }
}
```

### Pillar 2: Data is Tracked

The Dioxus runtime tracks changes to reactive values. Whenever you call `.set()` or `.write()`, side-effects are queued:

```rust
#[component]
fn Filter() -> Element {
    let mut selection = use_signal(|| "none");
    rsx! {
        div { "{selection}" }
        button {
            onclick: move |_| selection.set("dogs"),
            "Set Filter"
        }
    }
}
```

The core reactive value is the **Signal**. When Signals are used in reactive contexts (every component is one), reads and writes are tracked.

### Pillar 3: Data is Derived

All data is either a source or derived from a source. Perform transformations while rendering or in a memo — do not store derived values in separate signals:

```rust
// ✅ Correct - num_names is derived from names
let names = use_signal(|| vec!["Jane", "Jack", "Jill"]);
let num_names = names.read().len();

// ❌ Wrong - storing derived value in a signal
let names = use_signal(|| vec!["Jane", "Jack", "Jill"]);
let mut num_names = use_signal(|| 0);
num_names.set(names.len());
```

## Hooks

### The use_hook Primitive

All hooks are built on `use_hook`, which stores a value in the component's scope:

```rust
let state = use_hook(|| MyState::new());
```

### Rules of Hooks

- **No Hooks in Conditionals:** Hooks must be called unconditionally at the top level
- **No Hooks in Closures:** Hooks must not be called inside closures
- **No Hooks in Loops:** Hooks must not be called in loops
- **Early Returns:** Be careful with hooks after early returns — they may not run
- **Prefix hook names with `use_`:** Convention for identifying hooks

### Why Hooks?

Hooks solve the problem of holding values across async tasks and callbacks in Rust. The borrow checker doesn't work well with async work, so hooks provide `'static` references that can be used anywhere.

## Common Hooks

### use_signal

The primary state primitive:

```rust
let mut count = use_signal(|| 0);
count.write() // Get &mut access
count.read()  // Get & access
count.set(5)  // Set value directly
count()       // Shorthand for .read() in display contexts
```

### use_memo

For derived/computed values:

```rust
let count = use_signal(|| 0);
let doubled = use_memo(move || count() * 2);
```

### use_resource

For async data loading:

```rust
let data = use_resource(move || async move {
    fetch_data().await
});

match data.read().as_ref() {
    Some(Ok(result)) => rsx! { "Data: {result}" },
    Some(Err(e)) => rsx! { "Error: {e}" },
    None => rsx! { "Loading..." },
}
```

### use_effect

For side effects that run when dependencies change:

```rust
let count = use_signal(|| 0);
use_effect(move || {
    println!("Count changed to: {}", count());
});
```

## Global Context

> **Source:** [https://dioxuslabs.com/learn/0.7/essentials/basics/context](https://dioxuslabs.com/learn/0.7/essentials/basics/context)

### Providing and Consuming Context

Dioxus exposes `provide_context` and `use_context_provider` to share state up the component tree:

```rust
fn app() -> Element {
    use_context_provider(|| "Hello world!".to_string());
    rsx! { Child {} }
}

fn Child() -> Element {
    let title = use_context::<String>();
    rsx! { "{title}" }
}
```

Context objects are indexed by their `TypeId`. Use newtypes to store multiple values of the same type:

```rust
#[derive(Clone)]
struct Title(String);
#[derive(Clone)]
struct Subtitle(String);

use_context_provider(|| Title("Hello world!".to_string()));
use_context_provider(|| Subtitle("Hello world!".to_string()));

let title = use_context::<Title>();
let subtitle = use_context::<Subtitle>();
```

### Context Provider Components

Create a component that provides context to its children:

```rust
#[component]
fn ThemeProvider(children: Element, color: ThemeColor) -> Element {
    use_context_provider(|| ThemeState::new(color));
    children
}
```

### Providing Signals

Bundle signals into a state struct for reactive context:

```rust
#[derive(Clone, Copy)]
struct HeaderContext {
    title: Signal<String>,
    subtitle: Signal<String>,
}

#[component]
fn HeaderProvider(children: Element) -> Element {
    let title = use_signal(|| "Title".to_string());
    let subtitle = use_signal(|| "Subtitle".to_string());
    use_context_provider(|| HeaderContext { title, subtitle });
    children
}
```

Add accessor and mutation methods:

```rust
impl HeaderContext {
    pub fn reset(&mut self) {
        self.title.set("".to_string());
        self.subtitle.set("".to_string());
    }
    pub async fn fetch(&mut self) {
        let data = api::fetch_header_info().await;
        self.title.set(data.title);
        self.subtitle.set(data.subtitle);
    }
    pub fn uppercase_title(&self) -> String {
        self.title.cloned().to_ascii_uppercase()
    }
}
```

### Global Signals

Global signals are available to every component without `use_context_provider`:

```rust
static SONG: GlobalSignal<String> = Signal::global(|| "Drift Away".to_string());

#[component]
fn Player() -> Element {
    rsx! {
        h3 { "Now playing {SONG}" }
        button { onclick: move |_| *SONG.write() = "Vienna".to_string(), "Shuffle" }
    }
}
```

Global signals are local to one app instance (important for SSR/multi-window). Global memos are also available:

```rust
static COUNT: GlobalSignal<i32> = Signal::global(|| 0);
static DOUBLE_COUNT: GlobalMemo<i32> = Memo::global(|| COUNT.cloned() * 2);
```

## Reactive Stores and Collections

> **Source:** [https://dioxuslabs.com/learn/0.7/essentials/basics/collections](https://dioxuslabs.com/learn/0.7/essentials/basics/collections)

### Reactive Stores

Stores isolate reactivity to just a path in a data structure, allowing you to "zoom in" on a portion of data:

```rust
#[derive(Store)]
struct HeaderState {
    title: String,
    subtitle: String,
}

let header = use_store(|| HeaderState {
    title: "Hello, ".to_string(),
    subtitle: "world!".to_string(),
});

// Zoom in with generated `.title()` method
let title = header.title();
rsx! { "{title}" }
```

### Stores are Readable and Writable

Stores and lenses implement the same `Readable` and `Writable` traits as signals:

```rust
let title = header.title().read();
*header.title().write() = "goodbye".to_string();
header.title().set("goodbye!".to_string());
```

### Nested Stores

Stores can lens through multiple levels when nested types also implement `Store`:

```rust
#[derive(Store)]
struct HeaderState {
    title: String,
    other: OtherHeaderState,
}
#[derive(Store)]
struct OtherHeaderState {
    title2: String,
}

let title2 = header.other().title2();
```

### Reactive Collections

`Store<HashMap<K, V>>` implements reactivity on a per-entry basis. When you insert/remove values, only one re-render is queued. Editing an individual entry only re-renders the affected `ListItem`:

```rust
fn app() -> Element {
    let mut users = use_store(|| HashMap::<UserId, UserData>::new());
    rsx! {
        for (id, user) in users.iter() {
            ListItem { key: "{id}", user }
        }
    }
}

#[component]
fn ListItem(user: ReadSignal<UserData>) -> Element {
    rsx! { li { "{user.read().name}" } }
}
```

Derive `Store` on the data type to lens into specific fields:

```rust
#[derive(Store)]
struct UserData { name: String, email: String }

#[component]
fn ListItem(user: ReadStore<UserData>) -> Element {
    rsx! { li { "{user.name()}" } }
}
```
