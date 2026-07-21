# Dioxus 0.7

> **Source:** [https://dioxuslabs.com/learn/0.7/](https://dioxuslabs.com/learn/0.7/)

A fullstack crossplatform app framework for Rust. Supports Web, Desktop, SSR, Liveview, and Mobile with a single codebase.

## Overview

Dioxus is a developer-friendly framework for building cross-platform apps in Rust. You write apps with RSX (Rust JSX), style them with HTML/CSS, enhance with native APIs, and distribute as platform-native bundles. Think of it as a hybrid of Flutter, React Native, and NextJS — cross-platform apps with stellar fullstack support.

### Key Benefits

- **Cross-platform:** Web, Desktop (macOS/Windows/Linux), Mobile (iOS/Android), SSR, Liveview
- **React-inspired:** Components, hooks, signals-based reactivity
- **HTML/CSS native:** Uses standard HTML and CSS everywhere — no custom styling system
- **Hot-reloading:** Subsecond Rust hot-reload via the `subsecond` engine
- **Fullstack:** Server functions, SSR, hydration, websockets, streaming
- **Typesafe routing:** Derive-based router with compile-time route validation
- **Asset bundling:** Linker-based asset bundling with automatic hashing and CDN optimization
- **Blitz renderer:** Open-source WGPU-based HTML/CSS renderer for native platforms

## File Index

| File | Topics |
|------|--------|
| `getting-started.md` | Editor setup (VSCode, rust-analyzer), Rust installation, Dioxus CLI installation (curl, cargo-binstall, cargo install), platform-specific dependencies (macOS, Windows, Linux, WSL, iOS, Android), dx doctor |
| `tutorial.md` | Tutorial overview (HotDog app), tooling setup, creating a new app, components, RSX, styling/assets, state, data fetching, backend, databases, routing, bundling, deployment, next steps |
| `rsx.md` | The rsx! macro, how it expands to templates, HTML/CSS rendering, Blitz renderer, variety of renderers (Web, Webview, Native, Freya), text nodes, elements, Element type, attributes (scope, non-text, event listeners, spreading, conditional, style, class, custom, onresize/onvisible, dangerous_inner_html), conditional rendering (expressions, IntoDynNode, inline if), iteration and lists (iterators, for, keys, Fragment, borrowed state), reconciliation (render, rerender, pure functions) |
| `components.md` | Defining components, #[component] macro, component properties (PartialEq, Clone, Props), #[props(into)], #[props(default)], #[props(extends)], spreading props, children, Option<T>, ReadOnlySignal<T>, EventHandler |
| `styling.md` | CSS styling (inline, stylesheets via asset!()), CSS selectors, conditional styles with classes, CSS custom properties for theming, SCSS support, Tailwind integration, VSCode integration, layout (flexbox, grid, fixed position), icons and SVG (inline, assets, icon libraries, dangerous_inner_html) |
| `assets.md` | Including images (asset! macro), image processing options (size, format Avif), stylesheets, SCSS, arbitrary files, asset hashes, linker-based asset bundling, assets in libraries, including folders, reading assets, public folder |
| `state.md` | State management theory, for web developers (signal-based reactivity, .read()/.write()), for Rustaceans (hooks paradigm, struct state), 3 pillars of reactivity (data flows down, data is tracked, data is derived), hooks (use_signal, use_hook, rules of hooks, use_memo, use_resource, use_effect), global context (provide_context, use_context, context provider components, providing signals, global signals, global memos), reactive stores and collections (Store derive, use_store, lenses, nested stores, reactive collections, Store<HashMap>) |
| `suspense.md` | Suspense component, customizing loading view from children with SuspenseBoundary, Suspense with fullstack (use_server_future, hydration compatibility, reactivity in closures), streaming suspense (out-of-order streaming, ServeConfig) |
| `router.md` | Installing router feature, Routable enum with #[route(..)], rendering Router, Link component, defining routes, nested routes, layouts (dynamic segments, use_route), links and navigation (Link component, NavigationTarget, programmatic navigation, navigator, push/replace/go_back/go_forward, history providers, routing update callback, history buttons) |
| `fullstack.md` | Project setup (server/client split, customizing builds, feature flags, binary-specific imports, separate crates), hot-reload, server functions (#[get], #[post], path/query extractors, custom inputs/outputs, server extractors, error handling, ServerFnError, OrHttpError, custom errors), SSR (vs CSR, hydration, hydration errors, use_loader), middleware (router-level, route-level, caching), websockets (WebsocketOptions, use_websocket, typed messages, CBOR encoding), streaming, assets, SSG |
| `data-fetching.md` | Library dependencies (reqwest, serde), requests from event handlers, async state with use_resource (cancel safety, DropGuard), use_loader hook, avoiding waterfalls, organizing data fetching, dioxus-query library |
| `effects-memos.md` | Multiple reactive scopes, derived state with use_memo, memoizing Elements, running side-effects with use_effect, preferring actions over side-effects, opting out of subscriptions with peek, untracked state with use_reactive, making props reactive with ReadOnlySignal |
| `hoisting.md` | Hoisting signals, hoisting derived values (memos), decaying readable types to ReadSignal, automatic conversion to ReadSignal, hoisting callbacks (EventHandler, Callback with return values) |
| `error-handling.md` | Returning errors from components, anyhow::Error, CapturedError, RenderError, error boundaries, throwing errors from event handlers, adding context, downcasting errors, local error handling with reactive hooks |
| `platforms.md` | Platform-specific code (#[cfg(feature)]), platform-specific dependencies, Web (wasm-bindgen, hydration, JS eval, custom index template), Desktop (WebView, custom assets, Wry integration, use_window), Mobile (Android setup, iOS setup, running apps, dx serve) |
| `tools.md` | Dioxus CLI (dx) installation, commands (new, serve, bundle, build, run, init, doctor, print, translate, fmt, check, config, self-update, tools, components), creating projects (templates, dev server), translating HTML to RSX, configuring projects (Dioxus.toml, config commands), formatting RSX, checking project, doctor |
| `deploy.md` | Web publishing (GitHub Pages, base_path, dx bundle), desktop installer (macOS/Windows/Linux), preparing for bundling (windows_subsystem), adding assets to bundle, building with dx bundle --release, bundle config (identifier, publisher, category, icons, resources) |
| `escape-hatches.md` | Custom element attributes (quoted names), dangerous_inner_html, web components, direct DOM access (eval, document::eval, send/recv), web-sys and event downcasting (as_web_event), onmounted, getElementById, child windows/overlays, using Dioxus in Tauri, native widgets, Dioxus Native |
| `advanced.md` | Custom hooks (composing hooks, use_hook primitive, building custom hooks, use_context/use_context_provider internals, building reactive hooks with needs_update), component lifecycle (use_hook initialization, rerendering, don't mutate state in body, effects, use_drop cleanup), breaking out of Dioxus (eval, web-sys, use_effect for DOM sync, onmounted, event downcasting, spawn, needs_update) |
| `custom-renderer.md` | Custom renderer guide, templates (Template structure, root nodes, node paths, attr paths), mutations (LoadTemplate, HydrateText, AppendChildren, ReplaceWith, InsertAfter, InsertBefore, Remove), node storage (stack, node map), event loop (user input, internal events, apply mutations, handle events), event translation (UserEvent), custom raw elements, conclusion |
| `testing.md` | Component testing (pretty-assertions, dioxus-ssr, assert_rsx_eq), hook testing (VirtualDom, NoOpMutations, MockProxy, driving re-renders), end-to-end testing with Playwright (dx serve, webServer config, example projects) |
| `optimizing.md` | Building in release mode, UPX compression, build configuration (stable .cargo/config.toml, unstable nightly flags, opt-level, lto, codegen-units), wasm-opt, improving Dioxus code (minimize dynamic parts), optimizing asset sizes with asset! macro |
| `antipatterns.md` | Incorrect iterator keys, avoiding interior mutability in props (use Signal instead), avoiding state updates during render (use_effect or use_memo), avoiding large groups of state, non-deterministic code in component body (use hooks), overly permissive PartialEq for props |
| `logging.md` | Dioxus logger (tracing subscriber, launch integration, init function), tracing crate macros (trace, debug, info, warn, error), platform intricacies (tracing-wasm, FmtSubscriber, Android logcat, iOS oslog), viewing logs |

## Quick Start

```bash
# Install the Dioxus CLI
curl -sSL https://dioxus.dev/install.sh | bash
# or: cargo binstall dioxus-cli --force

# Create a new project
dx new my-app
cd my-app

# Run in development mode with hot-reload
dx serve

# Build for production
dx bundle --release
```

```rust
use dioxus::prelude::*;

fn main() {
    dioxus::launch(app);
}

fn app() -> Element {
    let mut count = use_signal(|| 0);

    rsx! {
        h1 { "High-Five counter: {count}" }
        button {
            onclick: move |_| *count.write() += 1,
            "Up high!"
        }
        button {
            onclick: move |_| *count.write() -= 1,
            "Down low!"
        }
    }
}
```

## Cargo.toml Setup

```toml
[dependencies]
dioxus = { version = "0.7", features = ["web"] }

# For fullstack:
# dioxus = { version = "0.7", features = ["fullstack", "router"] }

# For desktop:
# dioxus = { version = "0.7", features = ["desktop"] }
```

## Platform Features

| Feature | Target |
|---------|--------|
| `web` | Browser (WASM) |
| `desktop` | macOS, Windows, Linux (WebView) |
| `mobile` | iOS, Android |
| `fullstack` | Server + Client |
| `router` | Typesafe routing |
