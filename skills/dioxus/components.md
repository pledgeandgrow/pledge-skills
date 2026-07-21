# Components and Properties

> **Source:** [https://dioxuslabs.com/learn/0.7/essentials/ui/components](https://dioxuslabs.com/learn/0.7/essentials/ui/components)

## Defining Components

A component is a function that returns an `Element`. To use a component from another component, annotate it with `#[component]`:

```rust
fn app() -> Element {
    rsx! { "hello world!" }
}
```

The `#[component]` macro provides metadata to the RSX macro, turning function arguments into component properties. Requirements:
- Must start with a capital letter (`MyComponent`) or contain an underscore (`my_component`)
- Arguments must implement `PartialEq` and `Clone`
- Must return an `Element`

```rust
#[component]
pub fn MyComponent(name: String) -> Element {
    rsx! {
        div {
            h3 { "Hello, {name}!" }
        }
    }
}
```

## Using Components in RSX

```rust
rsx! {
    MyComponent { name: "World" }
}
```

## Component Properties

Properties can be defined inline (as function arguments) or extracted to a struct:

```rust
#[derive(PartialEq, Clone, Props)]
struct CardProps {
    title: String,
    content: String,
}

#[component]
fn Card(props: CardProps) -> Element {
    rsx! {
        h1 { "{props.title}" }
        span { "{props.content}" }
    }
}
```

### PartialEq

Used by the Dioxus runtime to determine if a component needs re-rendering. For advanced use cases, customize `PartialEq` for performance:

```rust
#[derive(Clone, Props)]
struct DatasetViewer {
    id: Uuid,
    contents: Vec<u8>,
}

impl PartialEq for DatasetViewer {
    fn eq(&self, other: &Self) -> bool {
        self.id.eq(&other.id) // Compare by ID, not contents
    }
}
```

### Clone

Required for unidirectional data flow — prevents child components from modifying input properties. For expensive-to-clone values, wrap in `ReadSignal<T>`:

```rust
// Instead of:
struct CardProps { content: String }
// Use:
struct CardProps { content: ReadSignal<String> }
```

### Props

The `Props` derive macro implements the `Properties` trait, providing a strongly-typed builder:

```rust
let props = CardProps::builder()
    .content("body".to_string())
    .build();
```

## The #[component] Macro Attributes

### #[props(into)]

Accepts any type that implements `Into<T>`:

```rust
#[component]
fn Link(
    #[props(into)] to: NavigationTarget,
) -> Element {
    // ...
}
```

### #[props(default)]

Makes a field optional with a default value:

```rust
#[component]
fn Link(
    #[props(default)] new_tab: bool,
    #[props(into)] to: NavigationTarget,
) -> Element {
    // ...
}
```

### #[props(extends = GlobalAttributes)]

Spreads global HTML attributes.

### Special Property Types

- **`Option<T>`** — Automatically optional, defaults to `None`
- **`ReadOnlySignal<T>`** — Auto-converts `T` into `ReadOnlySignal<T>`
- **`String`** — Accepts formatted strings
- **`children: Element`** — Accepts child elements
- **`EventHandler<T>`** — Enforces closures

Documentation comments on props become inline docs when calling the component:

```rust
#[component]
fn Link(
    /// When `true`, the target route opens in a new tab.
    #[props(default)] new_tab: bool,
    /// The navigation target.
    #[props(into)] to: NavigationTarget,
) -> Element {
    // ...
}
```

## Spreading Props

Create properties manually and spread them:

```rust
let props = CardProps::lorem_ipsum();

rsx! {
    Card { ..props }
}
```

Override specific fields while spreading:

```rust
rsx! {
    Card { title: "Chapter 1", ..props }
}
```

## Children

The special `children: Element` field accepts nested child elements:

```rust
#[component]
fn RedDiv(children: Element) -> Element {
    rsx! {
        div {
            background_color: "red",
            {children}
        }
    }
}
```

Usage:

```rust
rsx! {
    RedDiv {
        h1 { "Lorem Ipsum Dolor" }
        p { "..." }
    }
}
```
