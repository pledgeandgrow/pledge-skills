# Publishing and Deployment

> **Source:** [https://dioxuslabs.com/learn/0.7/guides/deploy/](https://dioxuslabs.com/learn/0.7/guides/deploy/)

## Web: Publishing with GitHub Pages

Edit `Dioxus.toml` to point `out_dir` to the `docs` folder and set `base_path` to your repo name:

```toml
[application]
# ...

[web.app]
base_path = "your_repo"
```

Build and publish:

```bash
# Build the app into the docs directory
dx bundle --out-dir docs

# Move static content from docs/public to docs
mv docs/public/* docs

# Copy index.html to 404.html for client-side routing
cp docs/index.html docs/404.html
```

Then:
- Make sure GitHub Pages is set up to publish from the `docs` directory
- Add and commit with git
- Push to GitHub

## Desktop: Creating an Installer

Dioxus desktop apps use your OS's WebView library, making them portable across platforms.

### Preparing for Bundling

On Windows, hide the terminal window by adding to `main.rs`:

```rust
#![cfg_attr(feature = "bundle", windows_subsystem = "windows")]
```

Add a `bundle` feature in `Cargo.toml`:

```toml
[features]
bundle = []
```

### Adding Assets to the Bundle

Use the `manganis` crate or include assets in `Dioxus.toml`:

```toml
[bundle]
# The list of files to include in the bundle. These can contain globs.
resources = ["main.css", "header.svg", "**/*.png"]
```

### Building

Install the Dioxus CLI, then bundle:

```bash
# Build with all optimizations and assets
dx bundle --release

# If using the bundle feature:
dx bundle --release --features bundle
```

Output is in `dist/bundle/`.

A macOS app built with Dioxus is approximately 4.8 MB — extremely lean because it leverages the platform's native WebView.

> **Note:** Not all CSS works the same on all platforms. View your app's CSS on each platform/browser (Firefox, Chrome, Safari) before publishing.

## Bundle Configuration

> **Source:** [https://dioxuslabs.com/learn/0.7/guides/deploy/config](https://dioxuslabs.com/learn/0.7/guides/deploy/config)

Additional bundle configuration options in `Dioxus.toml`:

```toml
[bundle]
identifier = "com.example.myapp"
publisher = "My Company"
category = "Utility"
short_description = "A Dioxus app"
long_description = "A cross-platform app built with Dioxus"
icon = ["icons/32x32.png", "icons/128x128.png", "icons/icon.icns"]
resources = ["assets/**/*"]
copyright = "Copyright 2024"
```

### Bundle Identifier

The `identifier` field is used as the unique identifier for your app. On macOS, this becomes the bundle identifier. On Linux, it's used for the desktop entry.

### Icons

Provide icons in multiple sizes for different platforms:
- `icons/32x32.png` — Small icon
- `icons/128x128.png` — Standard icon
- `icons/icon.icns` — macOS icon bundle

### Resources

The `resources` field accepts glob patterns for files to include in the bundle:

```toml
[bundle]
resources = ["main.css", "header.svg", "**/*.png", "assets/**/*"]
```
