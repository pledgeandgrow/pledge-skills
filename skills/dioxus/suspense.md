# Suspense

> **Source:** [https://dioxuslabs.com/learn/0.7/essentials/basics/suspense](https://dioxuslabs.com/learn/0.7/essentials/basics/suspense)

## Overview

Suspense provides a way to handle async data loading in components. When a component is waiting for async data, it can return a `Suspended` future, which triggers a fallback UI.

## Basic Suspense

```rust
use dioxus::prelude::*;

fn app() -> Element {
    rsx! {
        SuspenseBoundary {
            fallback: |_| rsx! { "Loading..." },
            AsyncComponent {}
        }
    }
}

#[component]
fn AsyncComponent() -> Element {
    let data = use_resource(move || async move {
        reqwest::get("https://api.example.com/data")
            .await
            .unwrap()
            .text()
            .await
            .unwrap()
    });

    let data = data()?;

    rsx! {
        div { "Data: {data}" }
    }
}
```

## Customizing the Loading View from Children

The `SuspenseBoundary` component lets you customize the fallback:

```rust
rsx! {
    SuspenseBoundary {
        fallback: |_| rsx! {
            div {
                class: "loading-spinner",
                "Loading..."
            }
        },
        MyComponent {}
    }
}
```

## Customizing the Loading View from Children

Use `with_loading_placeholder` to customize the loading view for specific tasks:

```rust
fn DogGrid() -> Element {
    rsx! {
        SuspenseBoundary {
            fallback: |suspense_context: SuspenseContext| {
                rsx! {
                    div {
                        width: "100%", height: "100%",
                        display: "flex", align_items: "center", justify_content: "center",
                        "Loading..."
                    }
                }
            },
            div {
                display: "flex", flex_direction: "column",
                BreedGallery { breed: "hound" }
                BreedGallery { breed: "poodle" }
                BreedGallery { breed: "beagle" }
            }
        }
    }
}

#[component]
fn BreedGallery(breed: ReadSignal<String>) -> Element {
    let response = use_resource(move || async move {
        reqwest::Client::new()
            .get(format!("https://dog.ceo/api/breed/{breed}/images"))
            .send()
            .await?
            .json::<BreedResponse>()
            .await
    })
    .suspend()?;

    rsx! {
        div {
            display: "flex", flex_direction: "row",
            match &*response.read() {
                Ok(urls) => rsx! {
                    for image in urls.iter().take(3) {
                        img { src: "{image}", width: "100px", height: "100px" }
                    }
                },
                Err(err) => rsx! { "Failed to fetch response: {err}" },
            }
        }
    }
}
```

## Suspense with Fullstack

Dioxus fullstack waits for suspended futures during SSR. Switch suspended resources to `use_server_future` for hydration compatibility:

```rust
#[component]
fn BreedGallery(breed: ReadOnlySignal<String>) -> Element {
    let response = use_server_future(move || async move {
        reqwest::Client::new()
            .get(format!("https://dog.ceo/api/breed/{breed}/images"))
            .send()
            .await
            .map_err(|err| err.to_string())?
            .json::<BreedResponse>()
            .await
            .map_err(|err| err.to_string())
    })?;

    let response_read = response.read();
    let response = response_read.as_ref().unwrap();

    rsx! {
        div {
            display: "flex", flex_direction: "row",
            match response {
                Ok(urls) => rsx! {
                    for image in urls.iter().take(3) {
                        img { src: "{image}", width: "100px", height: "100px" }
                    }
                },
                Err(err) => rsx! { "Failed to fetch response: {err}" },
            }
        }
    }
}
```

Unlike `use_resource`, `use_server_future` is only reactive in the closure, not the future itself. Read signals in the closure before passing to the future:

```rust
let id = use_signal(|| 0);

// ❌ The future inside use_server_future is not reactive
use_server_future(move || {
    async move { println!("{id}"); }
});

// ✅ The closure is reactive — reads subscribe
use_server_future(move || {
    let cloned_id = id();
    async move { println!("{cloned_id}"); }
});
```

## Streaming Suspense

Enable out-of-order streaming to send finished HTML chunks to the client as they resolve:

```rust
fn main() {
    dioxus::LaunchBuilder::new()
        .with_context(server_only! {
            dioxus::server::ServeConfig::builder()
                .enable_out_of_order_streaming()
        })
        .launch(DogGrid);
}
```

With streaming enabled, the server sends loading views in suspense boundaries while waiting for other futures to resolve, then replaces them with resolved content as it becomes available.
