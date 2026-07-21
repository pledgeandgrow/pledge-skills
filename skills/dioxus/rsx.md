# RSX — Rust JSX

> **Source:** [https://dioxuslabs.com/learn/0.7/essentials/ui/rsx](https://dioxuslabs.com/learn/0.7/essentials/ui/rsx)

## The rsx! Macro

If you're familiar with React's JSX, RSX will feel natural. RSX is a procedural macro that transforms HTML-like syntax into efficient Rust code:

```rust
// This macro...
rsx! {
    div { "hello {world}!" }
}

// Expands to a static template with dynamic values:
// static TEMPLATE: Template = Template {
//     nodes: [ElementNode {
//         tag: div,
//         children: [TextNode { contents: DynamicText(0) }]
//     }]
// };
// TEMPLATE.render([format!("hello {world}")])
```

RSX does heavy lifting: cutting down verbosity of declaring UI and constructing the most efficient representation for rendering.

## Dioxus Renders HTML and CSS

Instead of inventing a custom styling/layout/markup system, Dioxus relies on HTML and CSS everywhere:
- **Web:** websites are already HTML/CSS
- **Desktop/Mobile:** the Blitz renderer converts HTML/CSS to native widgets

The hybrid HTML approach combines the best of Flutter and React Native: maximum code-reuse, familiar markup, and AI tools work immediately.

The rendering engine [Blitz](https://github.com/dioxuslabs/blitz) is open source and often indistinguishable from browser-grade engines.

## A Variety of Renderers

Dioxus is modular — the RSX representation is generic, so renderers can be swapped:

**First-party renderers:**
- **Dioxus-Web:** Renders directly to HTML DOM nodes (WASM)
- **Dioxus-Webview:** Desktop and mobile engine rendering to system webview
- **Dioxus-Native:** Desktop and mobile engine rendering to native elements

Web and Webview are the most mature; Dioxus-Native is still undergoing improvements.

**Third-party renderers:**
- [Freya](https://freyaui.dev) — renders using Google's Skia renderer (CPU-only, cross-platform)

## Text Nodes

Any content surrounded by quotes is rendered as a text node:

```rust
rsx! { "Hello world" }
```

Text nodes implement the same rules as Rust's `format!` macro, including `Display` and `Debug` printing:

```rust
let world = "earth";
rsx! { "Hello {world}!" }
```

RSX lets you embed entire Rust expressions:

```rust
let user = use_signal(|| User { name: "Dioxus".to_string() });
rsx! { "Hello {user.read().name}" }
```

## Elements

The most basic building block of HTML is an element, declared with a tag name and curly braces:

```rust
rsx! { input {} }
```

Elements can take attributes that modify how they're rendered:

```rust
rsx! { input { placeholder: "type something cool!" } }
```

Available HTML elements include:
- **Text and Content:** `p`, `h1`, `span`, `div`, `a`, `pre`, etc.
- **Forms and Input:** `form`, `input`, `textarea`, `select`, `button`, etc.
- **Media and Content:** `img`, `video`, `audio`, `source`, `canvas`, `svg`, `iframe`, etc.
- **Tables:** `table`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`, etc.
- **Semantic Elements:** `details`, `summary`, `dialog`, `progress`, `meter`, `time`, etc.

### The Element Type

The `rsx!` macro returns an `Element` type. Elements can be assigned to variables, cloned, and stored in state:

```rust
let header: Element = rsx! { div { h1 { "Dioxus!" } } }
```

You can create functions that return an `Element`:

```rust
fn create_description(content: &str) -> Element {
    rsx! { span { class: "description", "{content}" } }
}
```

Under the hood, `Element` is an alias for `Result<VNode>`. You can match on it or throw errors:

```rust
fn create_description(content: &str) -> Element {
    if content.is_empty() {
        return Err("Missing description".into());
    }
    rsx! { span { class: "description", "{content}" } }
}
```

## Attributes

### Attribute Scope

Every element has two sets of attributes:
- **Global Attributes:** apply to every element (e.g., `id`, `class`)
- **Specific Attributes:** apply only to one element (e.g., `autoplay` on `video`)

### Non-Text Attributes

Attributes accept many value types:
- **Text:** Formatted text, `String`, or anything implementing `Display`
- **Float:** Floating point numbers
- **Int:** Integer numbers
- **Bool:** Boolean value (`true`/`false`)
- **Listener:** A Rust callback executed when the event is triggered
- **Any:** A type-erased `Rc<dyn Any>`
- **None:** The attribute will be removed entirely

```rust
rsx! { input { type: "checkbox", checked: true } }
```

### Event Listeners

Event handlers start with `on` and accept a closure:

```rust
rsx! {
    input {
        oninput: move |event| {
            println!("Input changed to: {}", event.value());
        },
    }
}
```

### Spreading Attributes

Spread attribute lists into elements with `..` syntax:

```rust
let attributes = vec![
    Attribute { name: "id", namespace: None, volatile: false, value: "cool-button".into_value() }
];
rsx! { button { ..attributes, "button" } }
```

### Conditional Attributes

Set an attribute conditionally with an unterminated `if` statement:

```rust
let number_type = use_signal(|| false);
rsx! { input { type: if number_type() { "number" } } }
```

### Style Attributes

Each CSS style can be passed as a separate attribute:

```rust
rsx! {
    div { width: "20px", height: "20px", background_color: "red", margin: "10px" }
}
```

### Class Attribute

The `class` attribute can be defined multiple times — each class is added to the element's class list:

```rust
rsx! {
    span {
        class: if red { "bg-red-500" },
        class: if blue_border { "border border-blue-500" },
        class: "w-4 h-4 block",
    }
}
```

### Custom Attributes

Surround the attribute name in quotes to use custom attributes outside the pre-defined set:

```rust
rsx! { div { "style": "width: 20px; height: 20px;" } }
```

### onresize and onvisible

Dioxus provides two custom attributes not in the HTML spec:
- `onresize` — watch for changes to an element's size and position
- `onvisible` — handle when an element enters/exits the viewport

```rust
rsx! {
    div {
        onresize: move |data| {
            info!("resized to {:#?}", data.get_border_box_size().unwrap());
        },
    }
}
```

### dangerous_inner_html

Set HTML content directly (beware of XSS attacks from untrusted data):

```rust
let contents = "live <b>dangerously</b>";
rsx! { div { dangerous_inner_html: "{contents}" } }
```

## Conditional Rendering

### Expressions

RSX allows you to compose `Element` objects using plain Rust code:

```rust
let content = "world!";
rsx! { h1 { "Hello" {content} } }
```

Match statements and if blocks work naturally:

```rust
let header = match current_timezone() {
    TimeZone::PST => rsx! { h1 { "Welcome home" } },
    _ => rsx! { h1 { "Bon voyage!" } },
};
rsx! { div { {header} } }
```

### The IntoDynNode Trait

Expressions in RSX are converted via `IntoDynNode` into one of four `DynamicNode` variants:
- **Component:** Functions that take Properties and render an Element
- **Text:** The Rust `String` type
- **Placeholder:** An optimized `None` value
- **List:** A `Vec` of Elements

`Option`, iterators, and empty expressions are all valid:

```rust
let inner = Some(rsx! { "inner" });
rsx! { div { {inner} } }
```

### Inline If Statements

RSX provides syntax sugar for inline `if` statements. The body is RSX, not Rust:

```rust
let logged_in = use_signal(|| false);
rsx! {
    div {
        if logged_in() { "You are logged in" }
        else { "You are not logged in" }
    }
}
```

Inline `if` without `else` returns a placeholder element automatically:

```rust
rsx! {
    div {
        if logged_out() { span { "You should log in!" } }
    }
}
```

## Iteration and Lists

### Iterators and Inline For

Any iterator returning `Element` or `IntoVnode` can be used in RSX:

```rust
rsx! {
    {(0..10).map(|idx| rsx! { "item {idx}" })}
    {users.iter().map(|user| rsx!{ User { id: user.id } })}
}
```

Or use inline `for` blocks (the body is RSX, not Rust):

```rust
rsx! {
    for idx in 0..10 { "Item {idx}" }
    for user in users.iter() { User { id: user.id } }
}
```

For temporary variables inside `for` loops, use an inline expression:

```rust
rsx! {
    for user in users.iter() {
        { let id = user.id(); rsx! { User { id } } }
    }
}
```

### Keys are Required

Each item in a list should have a unique, stable key. Keys identify how items move between renders:

```rust
let mut items = use_signal(|| vec!["Hello", "Dioxus"]);
rsx! {
    ul {
        for item in items.iter() {
            li { key: "{item}", "{item}" }
        }
    }
}
```

> **Never use the index as a key** — it changes when the list mutates and causes state loss or performance issues.

### The Fragment Component

For iterators returning multiple root elements, use `Fragment` to attach a key:

```rust
rsx! {
    for item in items.iter() {
        Fragment {
            key: "{item.id}",
            for child in item.children.iter() {
                div { "{child}" }
            }
        }
    }
}
```

`Fragment` is simply a component that forwards its children:

```rust
#[component]
fn Fragment(children: Element) -> Element { children }
```

### Borrowed State

`Signal` containers cannot provide references to child components. Three strategies:
1. **Use owned data and clone** if it's cheap
2. **Pass the collection and index** to the component
3. **Use a Store** to provide reactive references to slices of data

```rust
fn app() -> Element {
    let mut vec = use_store(|| vec![]);
    rsx! {
        div {
            for count in vec.iter() { Child { count } }
        }
    }
}

#[component]
fn Child(count: ReadSignal<i32>) -> Element {
    rsx! { "{count}" }
}
```

## Reconciliation: How Components Render

### Components Render

When you call `dioxus::launch`, Dioxus sets up the runtime and calls the initial component to create the initial `Element`. Dioxus converts virtual elements into real elements using a platform-specific renderer.

### Components Rerender

Components rerun when state they depend on changes. State is considered changed when:
- The component's properties change (via `PartialEq`)
- Internal state the component depends on changes (e.g., `signal.write()`)

```rust
#[component]
fn Button(name: String) -> Element {
    let mut count = use_signal(|| 0);
    rsx! {
        h3 { "Hello, {name}!" }
        "Count: {count}"
        button { onclick: move |_| count += 1, "Increment" }
    }
}
```

### Components are Functions of State

Components are pure functions: `fn(State) -> Element`. State comes from props, hooks, or context.

### Components are Pure Functions

The body of a component must be pure — no side effects. Don't modify state in the component body:

```rust
// ❌ Don't do this — can cause infinite loops
fn Bad() -> Element {
    let mut count = use_signal(|| 0);
    count += 1;
    rsx! { "{count}" }
}
```

Side effects that modify state should be in event handlers or effects:

```rust
// ✅ Event handlers can modify state
fn Good() -> Element {
    let mut count = use_signal(|| 0);
    rsx! {
        div { h3 { "Count: {count}" }
            button { onclick: move |_| count += 1, "Increment" }
        }
    }
}
```
