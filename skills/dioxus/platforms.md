# Platform Support

> **Sources:** [Platform Support](https://dioxuslabs.com/learn/0.7/guides/platforms/) | [Web](https://dioxuslabs.com/learn/0.7/guides/platforms/web) | [Desktop](https://dioxuslabs.com/learn/0.7/guides/platforms/desktop) | [Mobile](https://dioxuslabs.com/learn/0.7/guides/platforms/mobile)

## Platform-Specific Code

Use Rust features to conditionally include platform-specific code. In `Cargo.toml`:

```toml
[features]
default = []
web = ["dioxus/web"]
desktop = ["dioxus/desktop"]
mobile = ["dioxus/mobile"]
```

Then use `#[cfg]` attributes:

```rust
#[cfg(feature = "web")]
fn web_specific_code() {
    // Code specific to the web platform
}

#[cfg(feature = "desktop")]
fn desktop_specific_code() {
    // Code specific to the desktop platform
}
```

### Platform-Specific Dependencies

```toml
# Optional dependency — only included when the feature is enabled
wasm-bindgen = { version = "*", optional = true }

[features]
default = []
web = ["dioxus/web", "dep:wasm-bindgen"]
desktop = ["dioxus/desktop"]
```

## Web

The Web is the best-supported target platform for Dioxus.

### Support

- Compiled to WASM with access to browser APIs via [wasm-bindgen](https://rustwasm.github.io/docs/wasm-bindgen/introduction.html)
- Provides hydration to resume server-rendered apps

### Running JavaScript

Use `document::eval` to run raw JavaScript:

```rust
use dioxus::prelude::*;

fn app() -> Element {
    let future = use_resource(move || async move {
        let mut eval = document::eval(r#"
            dioxus.send("Hi from JS!");
            let msg = await dioxus.recv();
            console.log(msg);
        "#);
        eval.send("Hi from Rust!").unwrap();
        eval.recv::<String>().await.unwrap()
    });

    match future.read_unchecked().as_ref() {
        Some(v) => rsx! { p { "{v}" } },
        _ => rsx! { p { "hello" } },
    }
}
```

For web-only targets, use `web-sys` and [gloo](https://gloo-rs.web.app/) crates directly.

### Customizing Index Template

Provide a custom `index.html` — must include a `<div>` with `id="main"`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My App</title>
</head>
<body>
    <div id="main"></div>
</body>
</html>
```

Hot reload is still supported. See the [PWA example](https://github.com/DioxusLabs/dioxus/blob/main/examples/10-integrations/pwa/index.html).

## Desktop

Desktop apps run natively and render using the system WebView.

### Examples

- [File Explorer](https://github.com/DioxusLabs/dioxus/tree/main/examples/01-app-demos/file-explorer)
- [Tailwind App](https://github.com/DioxusLabs/dioxus/tree/main/examples/10-integrations/tailwind)

### Running JavaScript

Same `document::eval` approach as web:

```rust
let mut eval = document::eval(r#"
    dioxus.send("Hi from JS!");
"#);
eval.recv::<String>().await.unwrap()
```

### Custom Assets

```rust
fn app() -> Element {
    rsx! {
        div {
            img { src: asset!("/assets/static/scanner.png") }
        }
    }
}
```

### Integrating with Wry

For low-level window control, use Wry APIs through Desktop Config and the [use_window](https://docs.rs/dioxus-desktop/latest/dioxus_desktop/fn.use_window.html) hook.

## Mobile

Mobile is a first-class target with a robust WebView implementation supporting CSS animations and transparency effects.

### Support

- Rendered with platform WebView or experimentally with WGPU
- CSS-based animations and styling (native Android/iOS widgets not currently supported)
- Well-suited for business tools and consumer apps

### Android Setup

Install Rust Android targets:

```bash
rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
```

Install [Android Studio](https://developer.android.com/studio), then install:
- The SDK
- SDK Command line tools
- NDK (side by side)
- CMAKE

Set environment variables (macOS):

```bash
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"
export NDK_HOME="$ANDROID_HOME/ndk/25.2.9519653"
export PATH="$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools"
```

Set environment variables (Windows):

```powershell
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Android\Android Studio\jbr", "User")
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LocalAppData\Android\Sdk", "User")
[System.Environment]::SetEnvironmentVariable("NDK_HOME", "$env:LocalAppData\Android\Sdk\ndk\25.2.9519653", "User")
```

### iOS Setup

Install [XCode](https://apps.apple.com/us/app/xcode/id497799835) and iOS targets:

```bash
rustup target add aarch64-apple-ios aarch64-apple-ios-sim
```

For M1 Macs, use `cargo build --target x86_64-apple-ios` instead of `cargo apple build` for the simulator.

### Running Your App

```bash
# Create a new project
dx new my-app

# Start Android emulator
emulator -avd Pixel_6_API_34 -netdelay none -netspeed full

# Start iOS simulator
open /Applications/Xcode.app/Contents/Developer/Applications/Simulator.app
xcrun simctl boot "iPhone 15 Pro Max"

# Run the app
cd my-app
dx serve
```
