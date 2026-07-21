# Styling Your App

> **Source:** [https://dioxuslabs.com/learn/0.7/essentials/ui/styling](https://dioxuslabs.com/learn/0.7/essentials/ui/styling)

## Dioxus Uses CSS for Styling

Unlike many UI frameworks with custom styling systems, Dioxus embraces HTML and CSS natively. All 1st-party renderers leverage CSS. Dioxus automatically converts CSS to native widget properties when applicable.

## Inline CSS

Use the `style` attribute for inline CSS:

```rust
fn App() -> Element {
    rsx! {
        div {
            style: "background-color: blue; color: white; padding: 20px; border-radius: 8px;",
            "This is a styled div!"
        }
    }
}
```

Set individual CSS properties directly as attributes (snake_case):

```rust
fn App() -> Element {
    rsx! {
        div {
            background_color: "blue",
            color: "white",
            padding: "20px",
            border_radius: "8px",
            "This is a styled div!"
        }
    }
}
```

Dynamic styles with Rust expressions:

```rust
fn App() -> Element {
    let mut is_dark = use_signal(|| false);
    rsx! {
        div {
            background_color: if is_dark() { "black" } else { "white" },
            color: if is_dark() { "white" } else { "black" },
            padding: "20px",
            onclick: move |_| is_dark.toggle(),
            "Click to toggle theme"
        }
    }
}
```

## Stylesheets

For larger apps, organize styles in CSS files using the `asset!()` macro:

```rust
use dioxus::prelude::*;

static MAIN_CSS: Asset = asset!("/assets/main.css");

fn App() -> Element {
    rsx! {
        document::Stylesheet { href: MAIN_CSS }
        div { class: "my-component", "Hello, styled world!" }
    }
}
```

A regular `<link>` element also works (but won't be marked as pre-loadable for SSR):

```rust
rsx! {
    link { href: asset!("/assets/main.css") }
}
```

### CSS Selectors

Use class and ID selectors:

```css
/* assets/main.css */
.my-component {
    background-color: #f0f9ff;
    border: 2px solid #0ea5e9;
    border-radius: 8px;
    padding: 16px;
}

.my-component:hover {
    background-color: #e0f2fe;
    transform: translateY(-2px);
    transition: all 0.2s ease;
}
```

```rust
rsx! {
    div { id: "root-component", class: "my-component" }
}
```

Available CSS selectors:
- **Element selectors:** `div`, `p`, `h1`
- **Class selectors:** `.my-class`
- **ID selectors:** `#my-id`
- **Attribute selectors:** `[type="text"]`
- **Descendant selectors:** `div p`
- **Child selectors:** `div > p`
- **Adjacent sibling:** `h1 + p`
- **General sibling:** `h1 ~ p`
- **Pseudo-class:** `:hover`, `:focus`, `:nth-child()`
- **Pseudo-element:** `::before`, `::after`
- **Universal:** `*`
- **Grouping:** `h1, h2, h3`

### Conditional Styles with Classes

```rust
let is_active = use_signal(|| false);

rsx! {
    button {
        class: if is_active() { "btn active" } else { "btn" },
        onclick: move |_| is_active.toggle(),
        "Toggle"
    }
}
```

### CSS Custom Properties for Theming

```rust
rsx! {
    div {
        style: "--primary-color: #007bff;",
        button {
            background_color: "var(--primary-color)",
            "Themed Button"
        }
    }
}
```

## SCSS

SCSS is supported through the `asset!()` macro — include it the same way as CSS:

```rust
const _: Asset = asset!("/assets/styles.scss");
```

## Tailwind

Dioxus supports Tailwind CSS. See the [Tailwind guide](https://dioxuslabs.com/learn/0.7/guides/utilities/tailwind) for setup details.

### VSCode Integration

The Dioxus VSCode extension provides Tailwind class autocompletion in RSX.

## Laying Out Elements

### Flexbox Layout

```rust
rsx! {
    div {
        display: "flex",
        flex_direction: "row",
        justify_content: "center",
        align_items: "center",
        gap: "16px",
        div { "Item 1" }
        div { "Item 2" }
    }
}
```

### CSS Grid

```rust
rsx! {
    div {
        display: "grid",
        grid_template_columns: "repeat(3, 1fr)",
        gap: "10px",
        div { "Cell 1" }
        div { "Cell 2" }
        div { "Cell 3" }
    }
}
```

### Fixed Position Layout

```rust
rsx! {
    div {
        position: "fixed",
        top: "0",
        right: "0",
        "Fixed element"
    }
}
```

## Icons and SVG

### Inline SVG

```rust
rsx! {
    svg {
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        path { d: "M12 2L2 22h20L12 2z", fill: "currentColor" }
    }
}
```

### SVG Assets

```rust
static ICON: Asset = asset!("/assets/icon.svg");

rsx! {
    img { src: "{ICON}", width: "24", height: "24" }
}
```

### Icon Libraries

Use icon libraries by including their CSS and using class names:

```rust
rsx! {
    i { class: "fas fa-home" }
}
```

### Using dangerous_inner_html for SVG

```rust
let svg = r#"<svg width="24" height="24"><circle cx="12" cy="12" r="10"/></svg>"#;
rsx! {
    div { dangerous_inner_html: "{svg}" }
}
```
