# Assets

> **Source:** [https://dioxuslabs.com/learn/0.7/essentials/ui/assets](https://dioxuslabs.com/learn/0.7/essentials/ui/assets)

## Including Images

Use the `asset!()` macro to include images:

```rust
use dioxus::prelude::*;

fn App() -> Element {
    let ferrous = asset!("/assets/static/ferrous_wave.png");
    rsx! {
        img { src: "{ferrous}" }
    }
}
```

The path is relative to the package root, not your machine. The asset macro is `const`, so it can be used inline or as a static:

```rust
// As a static item
static FERROUS: Asset = asset!("/assets/static/ferrous_wave.png");

// Or inline
rsx! {
    img { src: asset!("/assets/static/ferrous_wave.png") }
}
```

## Customizing Image Processing Options

Optimize, resize, and preload images:

```rust
pub const ENUM_ROUTER_IMG: Asset = asset!(
    "/assets/static/enum_router.png",
    ImageAssetOptions::new()
        .with_size(ImageSize::Manual { width: 52, height: 52 })
        .with_format(ImageFormat::Avif)
);

fn EnumRouter() -> Element {
    rsx! {
        img { src: "{ENUM_ROUTER_IMG}" }
    }
}
```

Choosing an optimized format (like Avif) and reasonable quality can significantly reduce image size.

## Including Stylesheets

```rust
const _: Asset = asset!("/assets/tailwind.css");
```

CSS files are automatically minified and bundled. Files ending in `.css` are bundled even if not explicitly included in `<head>`.

## SCSS Support

SCSS is supported through the `asset!()` macro — include it the same way as a regular CSS file:

```rust
const _: Asset = asset!("/assets/styles.scss");
```

Read more about asset options in the [manganis documentation](https://docs.rs/manganis/latest/manganis).

## Including Arbitrary Files

For unrecognized file extensions, the asset is copied without changes:

```rust
const PATH_TO_BUNDLED_CARGO_TOML: Asset = asset!("/Cargo.toml");
```

These files are automatically included in the final build.

## Asset Hashes

The asset macro automatically attaches a hash to the asset name after bundling, enabling infinite caching on CDNs:

```rust
// prints "/assets/ferrous_wave-dxhx13xj2j.png"
println!("{}", asset!("/assets/static/ferrous_wave.png"))
```

Disable hashing with `AssetOptions`:

```rust
let ferrous = asset!(
    "/assets/static/ferrous_wave.png",
    AssetOptions::builder().with_hash_suffix(false)
);
```

## Linker-based Asset Bundling

Dioxus uses linker-based asset bundling — assets are automatically discovered and bundled by the `dx` build tool. This integrates with CDNs to speed up load performance and reduce infrastructure costs.

### Assets Must Be Used

Assets must be referenced in code to be bundled. Unused assets are not included.

### Assets in Libraries

Assets in library crates work the same way — paths are relative to the package root.

## Including Folders

Include entire folders of assets:

```rust
const ASSETS: Asset = asset!("/assets/icons");
```

## Reading Assets

Access asset contents at runtime:

```rust
let contents = std::fs::read_to_string(asset!("/data/config.json").to_string()).unwrap();
```

## The Public Folder

Files in the `public` directory are served as-is without processing. Use this for files that should not be hashed or optimized:

```
public/
  favicon.ico
  robots.txt
  manifest.json
```
