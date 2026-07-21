# Development Workflow

How to develop Tauri applications for desktop and mobile.

## Desktop development

### Starting development

```bash
cargo tauri dev
```

This:
1. Runs `beforeDevCommand` (e.g., `npm run dev`)
2. Starts the dev server at `devUrl`
3. Compiles the Rust backend
4. Opens the app window

### Configuring the dev server

```json
{
  "build": {
    "devUrl": "http://localhost:3000",
    "beforeDevCommand": "npm run dev"
  }
}
```

### Without a framework

If you're not using a framework, Tauri provides a built-in dev server:

```json
{
  "build": {
    "frontendDist": "./src"
  }
}
```

The `src` folder must contain an `index.html` file.

### Plain/Vanilla dev server security

The built-in Tauri dev server does not support mutual authentication or encryption. Never use it on untrusted networks.

## Mobile development

### Android

```bash
# Initialize Android project
cargo tauri android init

# Run on Android device/emulator
cargo tauri android dev

# Build for Android
cargo tauri android build
```

### iOS

```bash
# Initialize iOS project
cargo tauri ios init

# Run on iOS simulator
cargo tauri ios dev

# Build for iOS
cargo tauri ios build
```

### Development server and device selection

When running `cargo tauri android dev` or `cargo tauri ios dev`, Tauri:
1. Starts the frontend dev server
2. Compiles the Rust code for the mobile target
3. Deploys to a connected device or emulator/simulator

### Using Xcode or Android Studio

Open the generated project in the respective IDE:

```bash
# Open in Android Studio
cargo tauri android android-studio

# Open in Xcode
cargo tauri ios xcode
```

This allows you to:
- Use native debugging tools
- Configure signing and capabilities
- Access platform-specific settings
- Run on specific devices/simulators

### Opening the Web Inspector

**Android:**
```bash
# Enable WebView debugging
adb shell am setprop debug.webview.devtools true
# Then use chrome://inspect
```

**iOS:**
- Safari → Develop → [Device] → [WebView]

## Reacting to source code changes

### Hot reload

Tauri supports hot reload for the frontend via your framework's dev server (Vite, Webpack, etc.). Rust changes trigger a full app restart.

### File watching

Tauri watches `src-tauri/` for Rust changes and automatically recompiles and restarts the app.

### Disabling watch mode

```bash
cargo tauri dev --no-watch
```

## Using the Browser DevTools

- **Development** — DevTools are available automatically
- **Right-click** → Inspect Element
- **F12** or **Ctrl+Shift+I** / **Cmd+Option+I**

### Opening DevTools programmatically

```rust
use tauri::Manager;

#[tauri::command]
fn open_devtools(window: tauri::WebviewWindow) {
    #[cfg(debug_assertions)]
    window.open_devtools();
}
```

## Source control

### Files to commit

- `src/` — Frontend source
- `src-tauri/src/` — Rust source
- `src-tauri/Cargo.toml` — Rust dependencies
- `src-tauri/tauri.conf.json` — Tauri config
- `src-tauri/capabilities/` — Permission definitions
- `src-tauri/icons/` — App icons
- `package.json` — Frontend dependencies
- `Cargo.lock` — Rust lockfile

### Files to gitignore

```
node_modules/
dist/
src-tauri/target/
src-tauri/gen/
```

## Build modes

### Debug mode (development)

```bash
cargo tauri dev
```

- Fast compilation
- DevTools enabled
- No optimization
- Larger binary size

### Release mode (production)

```bash
cargo tauri build
```

- Full optimization
- DevTools disabled
- Smaller binary size
- Creates installers/bundles

### Profile mode (performance testing)

```bash
cargo tauri build --debug
```

- Release-like optimization
- DevTools available
- For performance profiling

## Best practices

1. Use `cargo tauri dev` for development
2. Configure `beforeDevCommand` to match your frontend tooling
3. Use Vite or similar for fast frontend hot reload
4. Enable DevTools programmatically only in debug mode
5. Use `cargo tauri info` to diagnose environment issues
6. Set up proper `.gitignore` for Tauri projects
7. Test on all target platforms regularly
8. Use profile mode for performance testing
