# Testing

> **Source:** [https://dioxuslabs.com/learn/0.7/guides/testing/web](https://dioxuslabs.com/learn/0.7/guides/testing/web)

## Component Testing

Use a combination of `pretty-assertions` and `dioxus-ssr` to check that two snippets of RSX are equal:

```rust
use dioxus::prelude::*;

#[test]
fn test() {
    assert_rsx_eq(
        rsx! {
            div { "Hello world" }
            div { "Hello world" }
        },
        rsx! {
            for _ in 0..2 {
                div { "Hello world" }
            }
        },
    )
}

fn assert_rsx_eq(first: Element, second: Element) {
    let first = dioxus_ssr::render_element(first);
    let second = dioxus_ssr::render_element(second);
    pretty_assertions::assert_str_eq!(first, second);
}
```

## Hook Testing

Dioxus does not currently have a full hook testing library, but you can build a bespoke testing framework by manually driving the virtual dom:

```rust
use futures::FutureExt;
use dioxus::{dioxus_core::NoOpMutations, prelude::*};

#[test]
fn test() {
    test_hook(
        || use_signal(|| 0),
        |mut value, mut proxy| match proxy.generation {
            0 => { value.set(1); }
            1 => { assert_eq!(*value.read(), 1); value.set(2); }
            2 => { proxy.rerun(); }
            3 => {}
            _ => todo!(),
        },
        |proxy| assert_eq!(proxy.generation, 4),
    );
}
```

The `test_hook` function drives the virtual dom by:
1. Creating a `VirtualDom` with a mock component that calls the hook
2. Rebuilding the dom in place
3. Processing work with `wait_for_work` and `render_immediate`
4. Running final checks in the root scope

The `MockProxy` struct provides:
- `generation`: the current render generation count
- `rerun()`: triggers a re-render of the component

## End to End Testing

Use [Playwright](https://playwright.dev/) for end-to-end tests. In your `playwright.config.js`, run `dx serve` instead of the default build command:

```javascript
// playwright.config.js
webServer: [
    {
        cwd: path.join(process.cwd(), 'playwright-tests', 'web'),
        command: 'dx serve',
        port: 8080,
        timeout: 10 * 60 * 1000,
        reuseExistingServer: !process.env.CI,
        stdout: "pipe",
    },
],
```

### Example Projects

- [Web example](https://github.com/DioxusLabs/dioxus/tree/main/packages/playwright-tests/web)
- [Liveview example](https://github.com/DioxusLabs/dioxus/tree/main/packages/playwright-tests/liveview)
- [Fullstack example](https://github.com/DioxusLabs/dioxus/tree/main/packages/playwright-tests/fullstack)
