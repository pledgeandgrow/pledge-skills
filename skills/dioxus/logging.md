# Logging

> **Source:** [https://dioxuslabs.com/learn/0.7/guides/utilities/logging](https://dioxuslabs.com/learn/0.7/guides/utilities/logging)

## Dioxus Logger

Dioxus provides a first-party logger as part of `launch`. It sets up a tracing subscriber that integrates with the Dioxus CLI and platforms like Web and Mobile. In development mode, the `Debug` level is set; in release, only the `Info` level:

```rust
use dioxus::prelude::*;

fn main() {
    dioxus::launch(|| {
        // Will only log in "dev" mode
        tracing::debug!("Rendering app!");

        // Will log in dev and release
        tracing::info!("Rendering app!");

        rsx! {}
    })
}
```

To override the default or initialize the logger before launch, use the `init` function:

```rust
use tracing::Level;

fn main() {
    dioxus::logger::init(Level::INFO).expect("failed to init logger");
    dioxus::launch(|| rsx! {})
}
```

## The Tracing Crate

The [tracing](https://crates.io/crates/tracing) crate is the logging interface used by dioxus-logger. It provides println-like macros with varying severity levels:

```rust
fn main() {
    tracing::trace!("trace");
    tracing::debug!("debug");
    tracing::info!("info");
    tracing::warn!("warn");
    tracing::error!("error");
}
```

Severity levels (highest severity at bottom):
- `trace!`
- `debug!`
- `info!`
- `warn!`
- `error!`

The `Level` enum represents the maximum log severity for your application.

## Platform Intricacies

- **Web:** Uses `tracing-wasm`
- **Desktop and server:** Uses `tracing-subscriber`'s `FmtSubscriber`
- **Android:** Logs sent to logcat (`adb -d logcat`)
- **iOS:** Logs sent to `oslog`

## Viewing Logs

### Android

```bash
adb -d logcat
```

Requires developer options/USB debugging enabled.

### iOS

Logs are sent to `oslog`. See the [oslog crate](https://crates.io/crates/oslog) for more information.
