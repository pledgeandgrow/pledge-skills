# Hoisting State

> **Source:** [https://dioxuslabs.com/learn/0.7/essentials/basics/hoisting](https://dioxuslabs.com/learn/0.7/essentials/basics/hoisting)

## Hoisting Signals

As apps grow, split larger components into smaller ones. Pass state down the tree:

```rust
#[component]
fn EmailAndName() -> Element {
    let mut name = use_signal(|| "name".to_string());
    let mut email = use_signal(|| "email".to_string());
    rsx! {
        Validator { name, email }
        input { oninput: move |e| name.set(e.value()) }
        input { oninput: move |e| email.set(e.value()) }
    }
}

#[component]
fn Validator(name: Signal<String>, email: Signal<String>) -> Element {
    let is_valid = use_memo(move || validate_name_and_email(name, email));
    rsx! {
        if !is_valid() { "Invalid name or email" }
    }
}
```

Hoist derived values (like memos) to where they're needed by multiple components:

```rust
#[component]
fn EmailAndName() -> Element {
    let mut name = use_signal(|| "name".to_string());
    let mut email = use_signal(|| "email".to_string());
    let is_valid = use_memo(move || validate_name_and_email(name, email));
    rsx! {
        Validator { is_valid }
        div {
            class: if !is_valid() { "border-red" },
            input { oninput: move |e| name.set(e.value()) }
            input { oninput: move |e| email.set(e.value()) }
        }
    }
}

#[component]
fn Validator(is_valid: Memo<bool>) -> Element {
    rsx! {
        if !is_valid() { "Invalid name or email" }
    }
}
```

## Decaying Readable Types to ReadSignal

Any `Readable` reactive type (`Signal`, `Memo`) automatically "decays" into `ReadSignal`. This gives wider compatibility:

```rust
// Accepts any Readable type
#[component]
fn Validator(is_valid: ReadSignal<bool>) -> Element {
    use_effect(move || log!("validity change: {is_valid}"));
    rsx! {
        if !is_valid { "Invalid name or email" }
    }
}
```

## Automatic Conversion to ReadSignal

Untracked values passed as properties automatically implement `Into<ReadSignal>`. Plain primitive values are upgraded to reactive values without boilerplate:

```rust
// Accepts memos, signals, and even primitive values!
#[component]
fn Validator(is_valid: ReadSignal<bool>) -> Element {
    rsx! {
        if !is_valid { "Invalid name or email" }
    }
}

// Can be called with a plain bool:
rsx! { Validator { is_valid: true } }

// Or with a memo:
rsx! { Validator { is_valid: validate_name_and_email(name, email) } }
```

As a general rule, wrap every readable component property in `ReadSignal` or `ReadOnlySignal` for maximum compatibility.

## Hoisting Callbacks

Avoid mutable props. Instead of passing a mutable signal, use callbacks to let the parent handle state updates:

```rust
// ✅ Use callbacks instead of mutable props
#[component]
fn Parent() -> Element {
    let mut count = use_signal(|| 0);
    rsx! {
        Incrementer { onclick: move |_| count += 1 }
    }
}

#[component]
fn Incrementer(onclick: EventHandler<MouseEvent>) -> Element {
    rsx! {
        button { onclick, "Increment!" }
    }
}
```

For callbacks that need to return a value, use the `Callback` type:

```rust
#[component]
fn CallbackChild(onclick: Callback<MouseEvent, String>) -> Element {
    let mut current = use_signal(|| "".to_string());
    rsx! {
        button {
            onclick: move |e| current.set(onclick.call(e)),
            "Set Value"
        }
    }
}
```

By hoisting mutation as callbacks, child components are naturally more modular and simple to reason about.
