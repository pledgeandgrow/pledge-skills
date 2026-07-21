# App Size

Understanding and minimizing Tauri app size.

## Why Tauri apps are small

Tauri uses the OS's native webview instead of bundling a browser engine (like Electron does with Chromium). This means a Tauri app can be as small as 600KB, compared to 100MB+ for Electron apps.

## Cargo configuration

Optimize the Rust binary for size in `Cargo.toml`:

```toml
[profile.release]
panic = "abort"       # Remove panic unwinding code
codegen-units = 1     # Better optimization at cost of compile time
opt-level = "s"       # Optimize for size
lto = true            # Link-time optimization
strip = true          # Remove debug symbols
```

### Advanced optimization

```toml
[profile.release]
panic = "abort"
codegen-units = 1
opt-level = "z"       # Optimize aggressively for size
lto = "fat"           # Full LTO
strip = "symbols"     # Strip all symbols
```

## Remove unused commands

Tauri's `tauri::generate_handler!` macro only includes commands you explicitly register. However, you can further reduce size by:

1. Only registering commands you actually use
2. Splitting commands into features:

```rust
#[cfg(feature = "file-ops")]
#[tauri::command]
fn read_file(path: String) -> String { /* ... */ }

pub fn run() {
    let mut builder = tauri::Builder::default();
    
    #[cfg(feature = "file-ops")]
    {
        builder = builder.invoke_handler(tauri::generate_handler![read_file]);
    }
    
    builder
        .run(tauri::generate_context!())
        .expect("error");
}
```

## Frontend optimization

1. **Tree-shake** — Remove unused JavaScript (most bundlers do this)
2. **Minify** — Compress JavaScript and CSS
3. **Code-split** — Load features lazily
4. **Compress assets** — Optimize images, use WebP
5. **Remove sourcemaps** — Don't include sourcemaps in production

## Bundle format impact

Different bundle formats have different sizes:

| Format | Platform | Notes |
|--------|----------|-------|
| NSIS | Windows | Smallest Windows installer |
| MSI | Windows | Larger but supports Group Policy |
| DMG | macOS | Compressed disk image |
| App Bundle | macOS | For App Store |
| AppImage | Linux | Self-contained, portable |
| Deb | Linux | Debian package |
| RPM | Linux | Red Hat package |
| APK | Android | Android package |
| IPA | iOS | iOS App Store package |

## Measuring app size

```bash
# Build and check binary size
cargo tauri build

# Check the Rust binary size
ls -lh src-tauri/target/release/my-app

# Analyze binary composition
cargo install cargo-bloat
cargo bloat --release --crates
```

## Typical sizes

| App type | Size |
|----------|------|
| Minimal Tauri app | ~600KB - 3MB |
| With plugins | ~3MB - 10MB |
| With large frontend | ~10MB - 50MB |
| Electron equivalent | ~100MB - 200MB |

## References

- [Tauri App Size](https://v2.tauri.app/concept/size/)
- [Cargo profiles](https://doc.rust-lang.org/cargo/reference/profiles.html)
