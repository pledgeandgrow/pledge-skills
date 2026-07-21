# Optimizing

> **Source:** [https://dioxuslabs.com/learn/0.7/guides/tips/optimizing](https://dioxuslabs.com/learn/0.7/guides/tips/optimizing)

## Building in Release Mode

The most effective optimization. Use the `--release` flag for faster and smaller builds:

```bash
dx build --release
```

## UPX

For non-web targets, use [UPX](https://github.com/upx/upx) to compress executables:

```bash
upx --best -o target/release/compressed.exe target/release/your-executable.exe
```

Download a [release](https://github.com/upx/upx/releases) and add the executable to your path.

## Build Configuration

Settings in `.cargo/config.toml` override settings in `Cargo.toml`.

### Stable Configuration

Decreases binary size from ~2.36mb to ~310kb. Add to `.cargo/config.toml`:

```toml
[profile.release]
opt-level = "z"
debug = false
lto = true
codegen-units = 1
panic = "abort"
incremental = false
```

### Unstable Configuration

Decreases binary size from ~310kb to ~234kb. Requires nightly Rust:

```toml
[unstable]
build-std = ["std", "panic_abort", "core", "alloc"]
build-std-features = ["panic_immediate_abort"]

[build]
rustflags = [
    "-Clto",
    "-Zvirtual-function-elimination",
    "-Zlocation-detail=none"
]

[profile.release]
opt-level = "z"
debug = false
lto = true
codegen-units = 1
panic = "abort"
strip = true
incremental = false
```

## wasm-opt

Use `wasm-opt` from the [binaryen](https://github.com/WebAssembly/binaryen/releases) library to optimize WASM files:

```bash
wasm-opt dist/assets/dioxus/APP_NAME_bg.wasm -o dist/assets/dioxus/APP_NAME_bg.wasm -Oz
```

Use `-Oz` for size optimization, `-O4` for speed.

## Improving Dioxus Code

Minimize the number of dynamic parts in your RSX. Dioxus skips parts that are the same as the last render, so keeping dynamic rendering to a minimum speeds up the app.

See [Anti-patterns](antipatterns.md) for patterns to avoid.

## Optimizing the Size of Assets

Assets included with the `asset!` macro are automatically optimized for production in release builds.
