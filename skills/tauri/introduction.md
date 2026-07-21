# Introduction to Tauri

What is Tauri, prerequisites, project creation, and structure.

## What is Tauri?

Tauri is a framework for building tiny, fast binaries for all major desktop and mobile platforms. Developers can integrate any frontend framework that compiles to HTML, JavaScript, and CSS for building their user experience while leveraging languages such as Rust, Swift, and Kotlin for backend logic when needed.

### Why Tauri?

- **Secure Foundation** — Rust-based core with a focus on security
- **Smaller App Size** — Uses the OS's native web renderer, apps can be as small as 600KB
- **Flexible Architecture** — Frontend-independent, bring any web stack
- **Cross Platform** — Build for Linux, macOS, Windows, Android, and iOS from a single codebase

## Prerequisites

### System dependencies

**Linux:**
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

**macOS:**
```bash
xcode-select --install
```

**Windows:**
- Microsoft Visual Studio C++ Build Tools
- WebView2 (pre-installed on Windows 10/11)

### Rust

Install Rust via [rustup](https://rustup.rs/):

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Node.js

Install Node.js (LTS recommended) via [nodejs.org](https://nodejs.org) or nvm/fnm.

### Configure for mobile targets

**Android:**
```bash
rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
```

**iOS (macOS only):**
```bash
rustup target add aarch64-apple-ios x86_64-apple-ios aarch64-apple-ios-sim
```

## Create a project

### Using create-tauri-app

```bash
# Bash
sh <(curl https://create.tauri.app/sh)

# PowerShell
irm https://create.tauri.app/ps | iex

# npm
npm create tauri-app@latest

# yarn
yarn create tauri-app

# pnpm
pnpm create tauri-app

# bun
bun create tauri-app

# cargo
cargo install create-tauri-app --locked
cargo create-tauri-app
```

### Manual setup (Tauri CLI)

```bash
# Install the Tauri CLI
cargo install tauri-cli --version "^2.0"

# Initialize Tauri in an existing project
cargo tauri init
```

## Project structure

```
my-app/
├── src/                    # Frontend source code
│   ├── index.html
│   ├── main.js
│   └── styles.css
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── main.rs         # Entry point
│   │   └── lib.rs          # App logic
│   ├── icons/              # App icons
│   ├── capabilities/       # Permission capabilities
│   ├── Cargo.toml          # Rust dependencies
│   └── tauri.conf.json     # Tauri configuration
├── package.json            # Frontend dependencies
└── node_modules/
```

### Key files

- **`tauri.conf.json`** — Main Tauri configuration (windows, bundle, plugins, security)
- **`Cargo.toml`** — Rust dependencies and metadata
- **`package.json`** — Frontend dependencies and scripts
- **`src-tauri/src/main.rs`** — Rust entry point (calls `app_lib::run()`)
- **`src-tauri/src/lib.rs`** — App logic, commands, and setup
- **`src-tauri/capabilities/`** — Permission definitions for the frontend

## Frontend configuration

Tauri is frontend-independent. Configure your frontend in `tauri.conf.json`:

### With a dev server (framework)

```json
{
  "build": {
    "devUrl": "http://localhost:3000",
    "beforeDevCommand": "npm run dev",
    "frontendDist": "../dist"
  }
}
```

### Without a framework (vanilla)

```json
{
  "build": {
    "frontendDist": "./src"
  }
}
```

### Supported frontend frameworks

Tauri works with any frontend framework: React, Vue, Svelte, SolidJS, Angular, Astro, Yew, Leptos, vanilla HTML/JS/CSS, and more.

## Development workflow

### Start development

```bash
cargo tauri dev
```

This starts the dev server and opens the app window with hot reload.

### Build for production

```bash
cargo tauri build
```

This produces optimized bundles for your target platform.
