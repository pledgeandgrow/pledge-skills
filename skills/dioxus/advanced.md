# Advanced Topics

> **Sources:** [Custom Hooks](https://dioxuslabs.com/learn/0.7/essentials/advanced/custom_hooks) | [Component Lifecycle](https://dioxuslabs.com/learn/0.7/essentials/advanced/lifecycle) | [Breaking Out](https://dioxuslabs.com/learn/0.7/essentials/advanced/breaking_out)

## Custom Hooks

### Composing Hooks

Encapsulate business logic by building on existing hooks:

```rust
fn use_settings() -> Signal<AppSettings> {
    consume_context()
}
```

Wrap a hook that persists across reloads with the storage API:

```rust
use gloo_storage::{LocalStorage, Storage};
use serde::{de::DeserializeOwned, Serialize};

pub fn use_persistent<T: Serialize + DeserializeOwned + Default + 'static>(
    key: impl ToString,
    init: impl FnOnce() -> T,
) -> UsePersistent<T> {
    let state = use_signal(move || {
        let key = key.to_string();
        let value = LocalStorage::get(key.as_str()).ok().unwrap_or_else(init);
        StorageEntry { key, value }
    });
    UsePersistent { inner: state }
}
```

### Custom Hook Logic

`use_hook` is the primitive all standard hooks are built on. It accepts a closure that runs only the first time a component renders. The return value is stored and reused on every subsequent render:

```rust
fn use_window_size() -> Signal<(u32, u32)> {
    let mut size = use_signal(|| (800, 600));
    use_hook(|| {
        // Setup code runs once on mount
    });
    size
}
```

A simplified implementation of `use_signal` using `use_hook`:

```rust
fn my_use_signal<T: 'static>(init: impl FnOnce() -> T) -> Signal<T> {
    use_hook(|| {
        let subscribers = Default::default();
        let value = Rc::new(RefCell::new(init()));
        Signal { value, subscribers }
    })
}
```

`use_context` and `use_context_provider` are also built on `use_hook`:

```rust
pub fn use_context<T: 'static + Clone>() -> T {
    use_hook(|| consume_context())
}

pub fn use_context_provider<T: 'static + Clone>(f: impl FnOnce() -> T) -> T {
    use_hook(|| {
        let val = f();
        provide_context(val.clone());
        val
    })
}
```

### Building Reactive Hooks

Combine `needs_update`, `use_hook`, and interior mutability to build hooks that work with the Dioxus reactivity system:

```rust
#[derive(Default)]
struct ReactiveString { inner: Rc<RefCell<String>> }

impl ReactiveString {
    fn get(&self) -> String { self.inner.borrow().to_string() }
    fn set(&mut self, new: String) {
        *self.inner.write() = new;
        dioxus::core::needs_update();
    }
}

fn use_reactive_string(init: impl FnOnce() -> String) -> ReactiveString {
    let inner = use_hook(|| Rc::new(RefCell::new(init())));
    ReactiveString { inner }
}
```

## Component Lifecycle

### Initializing State with use_hook

The closure passed to `use_hook` is called once on first render. On re-renders, the stored value is reused:

```rust
fn UseHook() -> Element {
    let random_number = use_hook(|| {
        let new_random_number = random_number();
        log!("{new_random_number}");
        new_random_number
    });
    rsx! { div { "Random {random_number}" } }
}
```

### Rerendering

Components rerender when tracked values change:

```rust
fn Rerenders() -> Element {
    let mut count = use_signal(|| 0);
    rsx! {
        button { onclick: move |_| count += 1, "Increment" }
        Count { current_count: count() }
    }
}

#[component]
fn Count(current_count: i32) -> Element {
    rsx! { div { "The count is {current_count}" } }
}
```

### Don't Mutate State in the Component Body

Mutating state in the component body can cause infinite loops:

```rust
// ❌ Don't do this
fn Bad() -> Element {
    let mut count = use_signal(|| 0);
    count += 1;
    rsx! { "{count}" }
}
```

Instead, derive state with `use_memo`, `use_resource`, or mutate state in an effect.

### Using Effects

Effects run after the component is rendered:

```rust
fn Effect() -> Element {
    use_effect(|| {
        log!("Effect ran");
        document::eval(&format!(
            "document.getElementById('effect-output').innerText = 'Effect ran'"
        ));
    });
    rsx! { div { id: "effect-output", "This will be changed by the effect" } }
}
```

### Cleaning Up Components with Drop

Before a component is dropped, all hooks are dropped. Use `use_drop` for cleanup:

```rust
fn Child() -> Element {
    dioxus::core::use_drop(|| {
        log!("Child dropped");
    });
    rsx! { div { "Child" } }
}
```

## Breaking Out of Dioxus

### Interacting with JavaScript via eval

Use `document::eval` to run JavaScript in the browser:

```rust
pub fn Eval() -> Element {
    let mut domain = use_signal(String::new);
    rsx! {
        button {
            onclick: move |_| async move {
                domain.set(document::eval("return document.domain").await.unwrap().to_string());
            },
            "Read Domain"
        }
        "Current domain: {domain}"
    }
}
```

### Using web-sys

For typed access to web APIs (web only):

```rust
use web_sys::window;
use wasm_bindgen::JsCast;

pub fn WebSys() -> Element {
    let mut domain = use_signal(String::new);
    rsx! {
        button {
            onclick: move |_| {
                domain.set(window().unwrap().document().unwrap()
                    .dyn_into::<web_sys::HtmlDocument>().unwrap().domain());
            },
            "Read Domain"
        }
        "Current domain: {domain}"
    }
}
```

### Synchronizing DOM Updates with use_effect

If you need to interact with the DOM directly, do so in a `use_effect` hook:

```rust
pub fn Canvas() -> Element {
    let mut count = use_signal(|| 0);
    use_effect(move || {
        let count = count.read();
        document::eval(&format!(r#"
            var c = document.getElementById("dioxus-canvas");
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, c.width, c.height);
            ctx.font = "30px Arial";
            ctx.fillText("{count}", 10, 50);
        "#));
    });
    rsx! {
        button { onclick: move |_| count += 1, "Increment" }
        canvas { id: "dioxus-canvas" }
    }
}
```

### Getting Access to Elements with onmounted

Use the `onmounted` event to get a handle to an element after it's mounted:

```rust
pub fn OnMounted() -> Element {
    let mut input_element = use_signal(|| None);
    rsx! {
        div {
            button {
                onmounted: move |element| input_element.set(Some(element.data())),
                "First button"
            }
            button {
                onclick: move |_| async move {
                    if let Some(header) = input_element() {
                        let _ = header.set_focus(true).await;
                    }
                },
                "Focus first button"
            }
        }
    }
}
```

### Downcasting web-sys Events

Downcast events with `as_web_event` to get the underlying web-sys event:

```rust
pub fn Downcast() -> Element {
    let mut event_text = use_signal(|| 0);
    rsx! {
        div {
            onmousemove: move |event| {
                #[cfg(feature = "web")]
                {
                    use dioxus::web::WebEventExt;
                    event_text.set(event.as_web_event().movement_x());
                }
            },
            "movement_x was {event_text}"
        }
    }
}
```

### spawn

Spawn async tasks outside of hooks:

```rust
#[component]
fn App() -> Element {
    rsx! {
        button {
            onclick: move |_| {
                spawn(async {
                    let result = do_something().await;
                    println!("{result}");
                });
            },
            "Spawn Task"
        }
    }
}
```

### needs_update

Manually queue a component for re-rendering:

```rust
rsx! {
    button {
        onclick: move |_| dioxus::core::needs_update(),
        "Queue for re-rendering"
    }
}
```
