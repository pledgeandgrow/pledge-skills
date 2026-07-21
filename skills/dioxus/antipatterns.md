# Antipatterns

> **Source:** [https://dioxuslabs.com/learn/0.7/guides/tips/antipatterns](https://dioxuslabs.com/learn/0.7/guides/tips/antipatterns)

## Incorrect Iterator Keys

List items must have unique keys associated with the same items across renders. Do not omit keys unless the list will never change:

```rust
// ❌ No keys
rsx! {
    ul {
        for value in data.values() {
            li { "List item: {value}" }
        }
    }
};

// ❌ Using index as keys
rsx! {
    ul {
        for (index, value) in data.values().enumerate() {
            li { key: "{index}", "List item: {value}" }
        }
    }
};

// ✅ Using unique IDs as keys
rsx! {
    ul {
        for (key, value) in props.data.iter() {
            li { key: "{key}", "List item: {value}" }
        }
    }
};
```

## Avoid Interior Mutability in Props

`Mutex`, `RwLock`, or `RefCell` in props make it difficult to track changes. The parent component will not be aware of changes, causing the UI to be out of sync:

```rust
// ❌ Mutex/RwLock/RefCell in props
#[derive(Props, Clone)]
struct BadProps {
    map: Rc<RefCell<HashMap<u32, String>>>,
}

// ✅ Use a signal to pass mutable state
#[component]
fn GoodComponent(map: Signal<HashMap<u32, String>>) -> Element {
    rsx! {
        button {
            onclick: move |_| {
                map.write().insert(0, "Hello".to_string());
            },
            "Mutate map"
        }
        "{map.read().get(&0).unwrap()}"
    }
}
```

## Avoid Updating State During Render

Updating state during render causes re-renders and can lead to infinite loops:

```rust
// ❌ Updating state in render
if first_signal() + 1 != second_signal() {
    second_signal.set(first_signal() + 1);
}

// ✅ Update state in an effect
use_effect(move || {
    if first_signal() + 1 != second_signal() {
        second_signal.set(first_signal() + 1);
    }
});

// ✅ Deriving state with use_memo
let second_signal = use_memo(move || first_signal() + 1);
```

## Avoid Large Groups of State

A single large state struct can cause infinite loops, make reasoning difficult, and lead to performance issues. Break state into smaller, manageable pieces:

```rust
// ❌ Large state struct
let mut all_my_state = use_signal(|| LargeState { users: vec![], logged_in: true, warnings: vec![] });

// ✅ Use multiple signals
let users = use_signal(|| vec![]);
let logged_in = use_signal(|| true);
let mut warnings = use_signal(|| vec![]);
```

Use memos to create derived state when larger states are unavoidable. In child components, use memos to derive only the specific part needed.

## Running Non-Deterministic Code in the Body of a Component

Non-deterministic code in the component body executes on every re-render. Use hooks instead:

```rust
// ❌ Non-deterministic code in body
#[component]
fn BadComponent(name: String) -> Element {
    let my_random_id = rand::random::<u64>();
    rsx! { div { id: "{my_random_id}", "Hello {name}" } }
}

// ✅ Use a hook to run non-deterministic code
fn GoodComponent(name: String) -> Element {
    let my_random_id = use_hook(|| rand::random::<u64>());
    rsx! { div { id: "{my_random_id}", "Hello {name}" } }
}
```

## Overly Permissive PartialEq for Props

`PartialEq` determines if a component should re-render. Returning `true` when props have changed causes stale UI. When unsure, return `false`:

```rust
// ❌ Permissive PartialEq - never re-renders
impl PartialEq for MyProps {
    fn eq(&self, _: &Self) -> bool { true }
}

// ✅ Derive PartialEq
#[derive(Props, Clone, PartialEq)]
struct MyProps {
    name: String,
}

// ✅ Return false if unsure
impl PartialEq for MyProps {
    fn eq(&self, other: &Self) -> bool {
        std::rc::Rc::ptr_eq(&self.name, &other.name)
    }
}
```
