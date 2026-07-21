# Data Fetching

> **Source:** [https://dioxuslabs.com/learn/0.7/essentials/basics/resources](https://dioxuslabs.com/learn/0.7/essentials/basics/resources)

## Library Dependencies

Dioxus does not provide a built-in HTTP client. Use the [reqwest](https://docs.rs/reqwest/latest/reqwest/) library for async network requests:

```toml
[dependencies]
dioxus = { version = "0.7" }
reqwest = { version = "*", features = ["json"] }
serde = { version = "1", features = ["derive"] }
```

```bash
cargo add reqwest --features json
cargo add serde --features derive
```

## Requests from Event Handlers

The simplest way to request data is by attaching an async closure to an `EventHandler`:

```rust
#[derive(serde::Deserialize)]
struct DogApi {
    message: String,
}

let mut img_src = use_signal(|| "image.png".to_string());
let fetch_new = move |_| async move {
    let response = reqwest::get("https://dog.ceo/api/breeds/image/random")
        .await
        .unwrap()
        .json::<DogApi>()
        .await
        .unwrap();
    img_src.set(response.message);
};

rsx! {
    img { src: img_src }
    button { onclick: fetch_new, "Fetch a new dog!" }
}
```

To prevent multiple simultaneous requests, add a "loading" Signal:

```rust
let mut img_src = use_signal(|| "image.png".to_string());
let mut loading = use_signal(|| false);
let fetch_new = move |_| async move {
    if loading() { return; }
    loading.set(true);
    let response = reqwest::get("https://dog.ceo/api/breeds/image/random")
        .await
        .unwrap()
        .json::<DogApi>()
        .await
        .unwrap();
    img_src.set(response.message);
    loading.set(false);
};
```

## Asynchronous State with use_resource

The `use_resource` hook derives asynchronous state. It accepts an async closure and tracks `.read()` calls of any contained Signals. If another action calls `.write()` on tracked signals, the resource immediately restarts:

```rust
let mut breed = use_signal(|| "hound".to_string());
let dogs = use_resource(move || async move {
    reqwest::Client::new()
        .get(format!("https://dog.ceo/api/breed/{breed}/images"))
        .send()
        .await?
        .json::<BreedResponse>()
        .await
});

rsx! {
    input {
        value: "{breed}",
        oninput: move |evt| breed.set(evt.value()),
    }
    div {
        display: "flex",
        flex_direction: "row",
        if let Some(response) = &*dogs.read() {
            match response {
                Ok(urls) => rsx! {
                    for image in urls.iter().take(3) {
                        img { src: "{image}", width: "100px", height: "100px" }
                    }
                },
                Err(err) => rsx! { "Failed to fetch response: {err}" },
            }
        } else {
            "Loading..."
        }
    }
}
```

Unlike `use_memo`, the resource's output is not memoized with `PartialEq`. Any components/reactive hooks that read the output will rerun if the future reruns even if the value is the same.

### Cancel Safety

The future passed to `use_resource` must be cancel safe. Cancel safe futures can be stopped at any await point without causing issues. Use a `DropGuard` to restore global state if the future is cancelled:

```rust
static RESOURCES_RUNNING: GlobalSignal<HashSet<String>> = Signal::global(|| HashSet::new());

let dogs = use_resource(move || async move {
    RESOURCES_RUNNING.write().insert(breed());

    struct DropGuard(String);
    impl Drop for DropGuard {
        fn drop(&mut self) {
            RESOURCES_RUNNING.write().remove(&self.0);
        }
    }
    let _guard = DropGuard(breed());

    reqwest::Client::new()
        .get(format!("https://dog.ceo/api/breed/{breed}/images"))
        .send()
        .await?
        .json::<BreedResponse>()
        .await
});
```

## Asynchronous State with use_loader

The `use_loader` hook is designed for reactive futures that return `Result<T, E>`. It returns `Result<Loader<T>, Loading>` which tightly integrates with Error Boundaries and Suspense — useful for SSR:

```rust
let breed_list = use_loader(move || async move {
    reqwest::get("https://dog.ceo/api/breeds/list/all")
        .await?
        .json::<ListBreeds>()
        .await
})?;
```

Use `use_resource` for client-side fetching and `use_loader` for hybrid client/server fetching.

## Avoiding Waterfalls

The "waterfall" effect occurs when requests run sequentially. To avoid this, hoist data loading logic higher in the component tree and avoid returning early before unrelated requests:

```rust
// Start all requests at the same time
let poodle_img = use_resource(|| fetch_dog_image("poodle"));
let golden_retriever_img = use_resource(|| fetch_dog_image("golden retriever"));
let pug_img = use_resource(|| fetch_dog_image("pug"));

// Then handle loading states
let poodle_img = match poodle_img() {
    Some(Ok(src)) => src,
    _ => { return rsx! { p { "Loading or error..." } }; }
};
// ...
```

## Organizing Data Fetching

Limit yourself to a few sources of data fetching. Centralized loading states are easier to reason about than many fragmented sources. Load a user's "name" and "id" in one request rather than two.

## Libraries for Data Fetching

Libraries like [dioxus-query](https://crates.io/crates/dioxus-query) provide advanced features: caching, invalidation, and polling. See the [dioxus awesome](https://dioxuslabs.com/awesome/) list for more.
