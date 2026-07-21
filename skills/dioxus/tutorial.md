# Tutorial

> **Source:** [https://dioxuslabs.com/learn/0.7/tutorial/](https://dioxuslabs.com/learn/0.7/tutorial/)

## What Will We Be Learning?

The tutorial covers core Dioxus features:

1. **Tooling Setup** — Installing Rust, the Dioxus CLI, and platform dependencies
2. **Creating a New App** — Scaffolding a project with `dx new`
3. **How Components Work** — Functions that take Properties and return an Element
4. **Creating UI with RSX** — The `rsx! {}` macro for declarative HTML-like markup
5. **Styling and Assets** — CSS, inline styles, stylesheets, the `asset!()` macro
6. **Adding State** — `use_signal`, reactivity, hooks
7. **Fetching Data** — `use_resource`, async data loading
8. **Adding a Backend** — Server functions, fullstack features
9. **Integrating a Database** — Server-side database queries
10. **App Routing** — `Routable` enum, `Router` component, `Link`
11. **Bundling** — `dx bundle` for platform-native packages
12. **Deployment** — Web (GitHub Pages), Desktop installers
13. **Next Steps** — Building larger apps, exploring the ecosystem

## What Are We Building?

The tutorial builds **HotDog** — a dog photo swipe app:

- Engage with a stream of cute dog photos
- Swipe right to save a dog photo to your collection
- Swipe left to skip
- View saved dog photos later

## Creating a New App

```bash
dx new my-app
cd my-app
dx serve
```

This creates a new Dioxus project with hot-reloading enabled. The default template includes a `main.rs` with a basic component, a `Cargo.toml` with Dioxus dependencies, and a `Dioxus.toml` configuration file.

## Component Basics

A component is a Rust function annotated with `#[component]` that returns an `Element`:

```rust
use dioxus::prelude::*;

fn main() {
    dioxus::launch(app);
}

fn app() -> Element {
    rsx! {
        h1 { "Hello, World!" }
    }
}
```

## Adding State

```rust
use dioxus::prelude::*;

fn app() -> Element {
    let mut count = use_signal(|| 0);

    rsx! {
        h1 { "Count: {count}" }
        button {
            onclick: move |_| *count.write() += 1,
            "Increment"
        }
    }
}
```

## Fetching Data

```rust
use dioxus::prelude::*;

fn app() -> Element {
    let future = use_resource(move || async move {
        reqwest::get("https://dog.ceo/api/breeds/image/random")
            .await
            .unwrap()
            .json::<DogResponse>()
            .await
            .unwrap()
    });

    match future.read().as_ref() {
        Some(Ok(dog)) => rsx! {
            img { src: "{dog.message}", width: "300" }
        },
        Some(Err(_)) => rsx! { p { "Error loading dog" } },
        None => rsx! { p { "Loading..." } },
    }
}

#[derive(serde::Deserialize)]
struct DogResponse {
    message: String,
}
```

## Adding a Backend (Fullstack)

Server functions run on the server but are called from the client:

```rust
#[server]
async fn fetch_dog() -> Result<String, ServerFnError> {
    // This always runs on the server
    let resp = reqwest::get("https://dog.ceo/api/breeds/image/random")
        .await?
        .json::<DogResponse>()
        .await?;
    Ok(resp.message)
}

fn app() -> Element {
    let future = use_resource(fetch_dog);

    match future.read().as_ref() {
        Some(Ok(url)) => rsx! { img { src: "{url}", width: "300" } },
        _ => rsx! { p { "Loading..." } },
    }
}
```

## Adding Routing

```rust
use dioxus::prelude::*;

#[derive(Clone, Routable, Debug, PartialEq)]
enum Route {
    #[route("/")]
    Home {},
    #[route("/saved")]
    Saved {},
}

#[component]
fn Home() -> Element {
    rsx! {
        h1 { "Home" }
        Link { to: Route::Saved {}, "View Saved" }
    }
}

#[component]
fn Saved() -> Element {
    rsx! {
        h1 { "Saved Dogs" }
        Link { to: Route::Home {}, "Back" }
    }
}

fn main() {
    dioxus::launch(|| rsx! {
        Router::<Route> {}
    });
}
```

## Bundling and Deployment

```bash
# Build for production
dx bundle --release

# Output is in dist/bundle/
```

For web deployment to GitHub Pages, configure `Dioxus.toml`:

```toml
[web.app]
base_path = "your_repo"
```

Then:

```bash
dx bundle --out-dir docs
mv docs/public/* docs
cp docs/index.html docs/404.html
```
