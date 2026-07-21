# Router

> **Source:** [https://dioxuslabs.com/learn/0.7/essentials/router/](https://dioxuslabs.com/learn/0.7/essentials/router/)

## Installing the Router

Add the `router` feature to your Dioxus dependency:

```toml
[dependencies]
dioxus = { version = "0.7", features = ["router"] }
```

## Creating a Routable Enum

The core of the router is a `Routable` enum. Each variant is a page in your app that handles:
1. Parsing a route from a URL
2. Displaying a route as a URL
3. Rendering a route as a component

```rust
use dioxus::prelude::*;

#[derive(Clone, Debug, PartialEq, Routable)]
enum Route {
    #[route("/")]
    Home,
    #[route("/about")]
    About,
    #[route("/user/:id")]
    User { id: u32 },
}

#[component]
fn Home() -> Element {
    rsx! { "Welcome to the home page!" }
}

#[component]
fn About() -> Element {
    rsx! { "This is the about page." }
}

#[component]
fn User(id: u32) -> Element {
    rsx! { "User page for user with id: {id}" }
}
```

By default, each variant renders a component with the same name. Specify a different component as the second argument to `#[route]`:

```rust
#[derive(Routable, Clone)]
#[rustfmt::skip]
enum Route {
    #[route("/", HomePage)]
    Index {},
}

#[component]
fn HomePage() -> Element {
    rsx! { "Welcome home!" }
}
```

## Rendering the Router

Use the `Router` component with your `Routable` enum as a generic:

```rust
fn main() {
    dioxus::launch(|| rsx! {
        Router::<Route> {}
    });
}
```

## Linking to Routes

Use the `Link` component with a `to` prop:

```rust
#[component]
fn Home() -> Element {
    rsx! {
        div {
            "Welcome to the home page!"
            Link { to: Route::About, "Go to About Page" }
        }
    }
}
```

Link with unchecked string route:

```rust
rsx! {
    Link { to: "/about", "About" }
}
```

## Defining Routes

### Route Segments

Static segments:

```rust
#[route("/users/list")]
UserList,
```

Dynamic segments:

```rust
#[route("/user/:id")]
User { id: u32 },
```

Multiple dynamic segments:

```rust
#[route("/post/:category/:slug")]
Post { category: String, slug: String },
```

### Nested Routes

```rust
#[derive(Routable, Clone)]
enum Route {
    #[route("/")]
    Home {},
    #[route("/blog")]
    Blog {
        // Child routes are nested
        #[child("/blog")]
        BlogChild { .. },
    },
}
```

### Query Parameters

```rust
#[route("/search")]
Search {
    // Query parameters are parsed from the URL
    q: String,
},
```

## Layouts

Layouts wrap child routes with shared UI (navigation, sidebars, etc.):

```rust
#[component]
fn Navbar(children: Element) -> Element {
    rsx! {
        nav { "My App" }
        {children}
    }
}
```

### Layouts with Dynamic Segments

Combine layouts with nested routes to create dynamic layouts. Layout components must accept a prop for each dynamic segment in the route:

```rust
#[derive(Routable, Clone)]
#[rustfmt::skip]
enum Route {
    #[nest("/:name")]
    #[layout(Wrapper)]
    #[route("/")]
    Index { name: String },
}

#[component]
fn Wrapper(name: String) -> Element {
    rsx! {
        header { "Welcome {name}!" }
        Outlet::<Route> {}
        footer { "footer" }
    }
}

#[component]
fn Index(name: String) -> Element {
    rsx! { h1 { "This is a homepage for {name}" } }
}
```

To get the full route, use the `use_route` hook:

```rust
#[component]
fn Wrapper() -> Element {
    let full_route = use_route::<Route>();
    rsx! {
        header { "Welcome to {full_route}!" }
        Outlet::<Route> {}
        footer { "footer" }
    }
}
```

## Links and Navigation

> **Source:** [https://dioxuslabs.com/learn/0.7/essentials/router/navigation](https://dioxuslabs.com/learn/0.7/essentials/router/navigation)

### The Link Component

Use the `Link` component instead of anchor tags for client-side navigation:

```rust
#[component]
fn NavBar() -> Element {
    rsx! {
        nav {
            Link { to: Route::Home {}, "Home" }
        }
        Outlet::<Route> {}
    }
}
```

The `to` prop accepts a `NavigationTarget`:
- **Internal:** Pass a variant of the `Routable` enum — type-safe, cannot fail
- **External:** Navigate to URLs outside the app via `NavigationTarget::External`

### Programmatic Navigation

Use the `navigator()` function to get a `Navigator` for programmatic navigation:

```rust
#[component]
fn Home() -> Element {
    let nav = navigator();
    // push — like a regular anchor tag
    nav.push(Route::PageNotFound { route: vec![] });
    // replace — replaces current history entry (back button won't restore)
    nav.replace(Route::Home {});
    // go back / forward
    nav.go_back();
    nav.go_forward();

    rsx! { h1 { "Welcome to the Dioxus Blog!" } }
}
```

### History Providers

The router uses a history provider to track the current route. On web, this is the browser's history API. On desktop/mobile, Dioxus provides a custom history provider.

### Routing Update Callback

You can register a callback that fires whenever the route changes. This is useful for analytics, scroll restoration, or other side effects.

### History Buttons

The router supports browser history buttons (back/forward) out of the box on web.
