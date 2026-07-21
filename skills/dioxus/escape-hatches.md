# Escape Hatches

> **Source:** [https://dioxuslabs.com/learn/0.7/essentials/ui/escape](https://dioxuslabs.com/learn/0.7/essentials/ui/escape)

## Custom Element Attributes

Dioxus declares element attributes as constants. For missing or custom attributes, wrap the name in quotes:

```rust
rsx! {
    div {
        "data-my-button-id": 123,
        "aria-label": "Close button",
    }
}
```

Custom attributes are handy for data attributes and custom CSS selectors.

## Dangerous Inner HTML

Set the HTML `textContent` of an element directly with `dangerous_inner_html`:

```rust
let contents = "live <b>dangerously</b>";
rsx! {
    div {
        dangerous_inner_html: "{contents}"
    }
}
```

> **Warning:** Called "dangerous" because passing untrusted data can expose [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks. Always sanitize HTML from untrusted sources.

Use case: pre-render markdown to HTML and include it directly, avoiding a markdown-to-Dioxus converter at runtime.

## Web Components

Web components (elements with a dash in the name) are rendered directly without type checking:

```rust
rsx! {
    my-web-component {}
}
```

Each attribute must be wrapped in quotes since web components are untyped. Wrap in a Dioxus component for type safety:

```rust
#[component]
fn MyWebComponent(name: String, age: i32) -> Element {
    rsx! {
        my-web-component {
            "name": "hello, {name}",
            "age": age + 10
        }
    }
}
```

## Direct DOM Access

### Eval

Evaluate arbitrary JavaScript via `document::eval`:

```rust
use dioxus::prelude::*;

fn app() -> Element {
    rsx! {
        button {
            onclick: move |_| async move {
                let mut eval = document::eval(r#"
                    for(let i = 0; i < 10; i++) {
                        dioxus.send(i);
                    }
                "#);
                for _ in 0..10 {
                    let value: i32 = eval.recv().await.unwrap();
                    println!("Received {}", value);
                }
            },
            "Log Count"
        }
    }
}
```

- Use `dioxus.send()` in JavaScript to send values to Rust
- Use `eval.recv()` in Rust to receive values from JavaScript
- Use `eval.send()` in Rust to send values to JavaScript

### Using web-sys and Event Downcasting

On web, use [web-sys](https://docs.rs/web-sys/latest/web_sys/) for strongly-typed JavaScript calls:

```rust
rsx! {
    let alert_it = move |_| {
        let window = web_sys::window().unwrap();
        window.alert_with_message("Hello from Rust!");
    };
    button {
        onclick: alert_it,
        "Click to alert"
    }
}
```

> **Note:** `web-sys` is not portable to Dioxus Desktop and Mobile renderers. For cross-platform, use `document::eval` instead.

Downcast events with `as_web_event` to access the underlying web-sys event:

```rust
rsx! {
    div {
        onmousemove: move |event| {
            #[cfg(feature = "web")]
            {
                use dioxus::web::WebEventExt;
                event_text.set(event.as_web_event().movement_x());
            }
        },
    }
}
```

### Using onmounted

Use the `onmounted` event to get a handle to an element after it's mounted:

```rust
rsx! {
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
```

### Using getElementById

Get direct handles to DOM nodes:

```rust
let id = use_hook(|| Uuid::new_v4());
let set_div_contents = move |_| async move {
    document::eval(format!(r#"
        document.getElementById("div-{id}").innerText = "one-two-three"
    "#)).await;
};

rsx! {
    div { id: "div-{id}" }
    button {
        onclick: set_div_contents,
        "Set Div Directly"
    }
}
```

## Child Windows and Overlays

Dioxus desktop supports creating child windows and overlays for multi-window applications.

## Using Dioxus in Tauri

Dioxus can be used within Tauri for cases where you need `web-sys` on desktop. This combines Dioxus's reactive UI with Tauri's system-level APIs.

## Native Widgets

For platform-native widgets that go beyond HTML/CSS, Dioxus provides escape hatches to integrate with native UI toolkits.

## Dioxus Native

The Dioxus-Native renderer renders to native elements instead of HTML/CSS. This is still undergoing substantial improvements but offers deeper native integration.
