# Effects and Memos

> **Source:** [https://dioxuslabs.com/learn/0.7/essentials/basics/effects](https://dioxuslabs.com/learn/0.7/essentials/basics/effects)

## Multiple Reactive Scopes

A single Signal can be read in multiple reactive scopes simultaneously. Each component that calls `.read()` on the signal is automatically subscribed to changes. Effects and Memos allow observing changes without re-rendering components.

Memos implement the `Readable` trait (but not `Writable`) and implement the same ergonomic extensions as signals. Both Memos and Effects are `Copy` with the same lifecycle and `Drop` semantics as signals.

## Derived State with Memo

`use_memo` derives state from any tracked value. When a dependency changes, the memo reruns and calculates a new value. The value only updates when `PartialEq` determines the old and new values are not equal:

```rust
fn Memo() -> Element {
    let mut count = use_signal(|| 0);
    let half_count = use_memo(move || count() / 2);
    use_effect(move || {
        log!("{half_count}");
    });
    rsx! {
        button { onclick: move |_| count += 1, "Increment" }
        div { "Count is {count}" }
        div { "Half count is {half_count}" }
    }
}
```

Memos can prevent re-renders by performing expensive computations outside the component's reactive scope:

```rust
let mut loading = use_signal(|| false);
let mut loading_text = use_signal(|| "loading".to_string());
let subheading = use_memo(move || {
    if loading() && loading_text() == "loading" {
        return "The state is loading";
    }
    "The state is not loading"
});
```

## Derived Elements

`use_memo` can memoize `Element` objects, breaking large components into smaller memos:

```rust
let mut loading_text = use_signal(|| "loading".to_string());
let loading_ui = use_memo(move || {
    let num_chars = loading_text.read().chars().count();
    rsx! { "there are {num_chars} characters!" }
});
rsx! {
    h1 { "Demo" }
    {loading_ui}
}
```

## Running Side-Effects

`use_effect` creates a closure that runs any time a tracked value read inside the closure changes:

```rust
fn Effect() -> Element {
    let mut count = use_signal(|| 0);
    use_effect(move || {
        let current_count = count();
        log!("{current_count}");
    });
    rsx! {
        button { onclick: move |_| count += 1, "Increment" }
        div { "Count is {count}" }
    }
}
```

## Prefer Actions over Side-Effects

Side-effects should not be frequently used. The classic valid use case is synchronizing UI state with external state:

```rust
fn Title() -> Element {
    let mut text = use_signal(|| "".to_string());
    use_effect(move || {
        window().unwrap().document().unwrap().set_title(&text());
    });
    rsx! {
        input {
            oninput: move |e| text.set(e.value()),
            placeholder: "Set the document title"
        }
    }
}
```

If you can be reasonably sure the component won't be unmounted, set the document title directly in the handler instead.

## Opting Out of Subscriptions

Use the `peek` method to read a reactive value without subscribing to it:

```rust
fn Peek() -> Element {
    let mut count = use_signal(|| 0);
    let mut toggle = use_signal(|| false);
    use_effect(move || {
        let current_count = count();
        log!("current_count is {current_count}");
        if current_count % 4 == 0 {
            let current_toggle = *toggle.peek();
            toggle.set(!current_toggle);
        }
    });
    rsx! {
        button { onclick: move |_| count += 1, "Change Signal" }
        div { "Count is {count}" }
        div { "Toggle is {toggle}" }
    }
}
```

## Working with Untracked State

When you read an untracked value (like a raw prop) inside a reactive context, it does not subscribe. Use `use_reactive` to manually track non-reactive values:

```rust
#[component]
fn Count(count: i32) -> Element {
    let double_count = use_memo(
        use_reactive!(|(count,)| count * 2),
    );
    rsx! { div { "Double count: {double_count}" } }
}
```

## Making Props Reactive

Wrap props in `ReadOnlySignal<T>` to preserve reactivity. Dioxus automatically converts `T` into `ReadOnlySignal<T>` when passing props:

```rust
#[component]
fn Count(count: ReadOnlySignal<i32>) -> Element {
    let double_count = use_memo(move || count() * 2);
    rsx! { div { "Double count: {double_count}" } }
}
```
