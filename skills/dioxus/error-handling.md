# Error Handling

> **Source:** [https://dioxuslabs.com/learn/0.7/essentials/basics/error_handling](https://dioxuslabs.com/learn/0.7/essentials/basics/error_handling)

## Returning Errors from Components

The `Element` type is actually a type alias for `Result<VNode, RenderError>`. You can use `?` to bubble up errors to the nearest error boundary:

```rust
#[component]
fn ThrowsError() -> Element {
    let number: i32 = use_hook(|| "1.234").parse()?;
    todo!()
}
```

`RenderError` is an enum of either `Error(CapturedError)` or `Suspended(SuspendedFuture)`. It automatically implements `From<CapturedError>` which implements `From<anyhow::Error>`.

Use anyhow's `Context` trait to add context to errors:

```rust
fn Counter() -> Element {
    let count = "123".parse::<i32>().context("Could not parse input")?;
    // ...
}
```

## CapturedError, RenderError, and anyhow::Error

### anyhow::Error

Dioxus uses `anyhow::Error` as its core error type. Many APIs take or return `anyhow::Result`:

```rust
#[get("/dogs")]
async fn get_dogs() -> anyhow::Result<i32> {
    Ok(123)
}
```

Use `.downcast_ref::<T>()` to downcast to specific error types. Utilities like `.context()`, `anyhow!()`, and `bail!()` work seamlessly.

### CapturedError

`CapturedError` is a transparent wrapper around `anyhow::Error` that implements `Clone`:

```rust
#[derive(Debug, Clone)]
pub struct CapturedError(pub Arc<anyhow::Error>);
```

Use `dioxus::Ok()` to return `Result<T, CapturedError>`:

```rust
let value = use_resource(|| async move {
    let res = fetch("/dogs")?;
    dioxus::Ok(res)
});
```

## Capturing Errors with ErrorBoundaries

Error boundaries catch and handle errors produced while rendering:

```rust
#[component]
fn Parent() -> Element {
    rsx! {
        ErrorBoundary {
            handle_error: |_| {
                rsx! {
                    "Oops, we encountered an error. Please report this to the developer"
                }
            },
            ThrowsError {}
        }
    }
}
```

## Throwing Errors from Event Handlers

Event handlers can also return errors that bubble up to the nearest error boundary:

```rust
#[component]
fn ThrowsError() -> Element {
    rsx! {
        button {
            onclick: move |_| {
                let number: i32 = "1...234".parse()?;
                tracing::info!("Parsed number: {number}");
                Ok(())
            },
            "Throw error"
        }
    }
}
```

## Adding Context to Errors

Use anyhow's `Context` trait to add information to errors:

```rust
#[component]
fn ThrowsError() -> Element {
    let number: i32 = use_hook(|| "1.234")
        .parse()
        .context("Failed to parse name")?;
    todo!()
}
```

## Downcasting Specific Errors

In error boundary handlers, use `.error()` to get the current error and optionally re-throw it:

```rust
rsx! {
    ErrorBoundary {
        handle_error: |error: ErrorContext| {
            if let Some(err) = error.error() {
                return Err(err.into());
            }
            rsx! { div { "Oops, we encountered an error" } }
        },
    }
}
```

## Local Error Handling

Store errors in reactive hooks for fine-grained control:

```rust
#[component]
pub fn PhoneNumberValidation() -> Element {
    let mut phone_number = use_signal(|| String::new());
    let parsed_phone_number = use_memo(move || phone_number().parse::<PhoneNumber>());
    rsx! {
        input {
            placeholder: "Phone number",
            value: "{phone_number}",
            oninput: move |e| { phone_number.set(e.value()); },
        }
        match parsed_phone_number() {
            Ok(phone_number) => rsx! { div { "Parsed phone number: {phone_number}" } },
            Err(error) => rsx! { div { "Phone number is invalid: {error}" } }
        }
    }
}
```
