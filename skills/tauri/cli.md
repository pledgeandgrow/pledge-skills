# CLI Reference

The Tauri Command Line Interface for development, building, and project management.

## Installation

```bash
# Via cargo
cargo install tauri-cli --version "^2"

# Via npm
npm install -D @tauri-apps/cli

# Via pnpm
pnpm add -D @tauri-apps/cli
```

## List of commands

### init

Initialize Tauri in an existing project:

```bash
cargo tauri init
```

Options:
- `--ci` — Skip prompts, use defaults
- `--app-name <NAME>` — Set the app name
- `--window-title <TITLE>` — Set the window title
- `--frontend-dist <PATH>` — Set the frontend dist path
- `--dev-url <URL>` — Set the dev server URL

### dev

Run the app in development mode:

```bash
cargo tauri dev
```

Options:
- `--target <TARGET>` — Build for a specific target
- `--features <FEATURES>` — Cargo features to enable
- `--exit-on-panic` — Exit when the app panics
- `--no-watch` — Don't watch for file changes

### build

Build the app in release mode and create bundles:

```bash
cargo tauri build
```

Options:
- `--target <TARGET>` — Build for a specific target
- `--bundles <BUNDLES>` — Comma-separated list of bundle formats
- `--features <FEATURES>` — Cargo features to enable
- `--debug` — Build in debug mode
- `--no-bundle` — Skip bundling, only compile the binary
- `--ci` — Skip prompts

### bundle

Bundle the app without rebuilding (assumes binary already exists):

```bash
cargo tauri bundle
```

### android

Android-specific commands:

```bash
# Initialize Android project
cargo tauri android init

# Build for Android
cargo tauri android build

# Run on Android device/emulator
cargo tauri android dev

# Open in Android Studio
cargo tauri android android-studio
```

### ios

iOS-specific commands:

```bash
# Initialize iOS project
cargo tauri ios init

# Build for iOS
cargo tauri ios build

# Run on iOS device/simulator
cargo tauri ios dev

# Open in Xcode
cargo tauri ios xcode
```

### migrate

Migrate from Tauri 1 to Tauri 2:

```bash
cargo tauri migrate
```

### info

Display information about the project and environment:

```bash
cargo tauri info
```

### add

Add a plugin to the project:

```bash
cargo tauri add fs
cargo tauri add dialog
cargo tauri add shell
```

### remove

Remove a plugin from the project:

```bash
cargo tauri remove fs
```

### plugin

Plugin development commands:

```bash
# Initialize a new plugin
cargo tauri plugin init my-plugin

# Build a plugin
cargo tauri plugin build
```

### icon

Generate app icons from a source image:

```bash
cargo tauri icon path/to/icon.png
```

Generates all required icon sizes and formats for all platforms.

### signer

Generate signing keys for the updater:

```bash
# Generate a new key pair
cargo tauri signer generate -w ~/.tauri/myapp.key

# Sign a file
cargo tauri signer sign path/to/file
```

### completions

Generate shell completions:

```bash
cargo tauri completions --shell bash
cargo tauri completions --shell zsh
cargo tauri completions --shell fish
cargo tauri completions --shell powershell
```

### permission

Permission management commands:

```bash
# List permissions
cargo tauri permission list

# Generate permission schemas
cargo tauri permission generate
```

### capability

Capability management commands:

```bash
# List capabilities
cargo tauri capability list
```

### inspect

Inspect the application:

```bash
# Inspect the config
cargo tauri inspect config

# Inspect capabilities
cargo tauri inspect capabilities
```

## Common workflows

### Start development

```bash
cargo tauri dev
```

### Build for production

```bash
cargo tauri build
```

### Build for a specific platform

```bash
# Windows from non-Windows (cross-compilation may require additional setup)
cargo tauri build --target x86_64-pc-windows-msvc

# macOS Universal Binary
cargo tauri build --target universal-apple-darwin
```

### Add a plugin and start using it

```bash
cargo tauri add notification
# Then use in code: import { sendNotification } from '@tauri-apps/plugin-notification'
```

### Generate icons

```bash
cargo tauri icon ./source-icon.png
```

## Best practices

1. Use `cargo tauri add` instead of manually adding plugins
2. Use `cargo tauri icon` to generate all required icon formats
3. Use `cargo tauri info` to diagnose environment issues
4. Use `cargo tauri migrate` when upgrading from Tauri 1
5. Set up shell completions for faster CLI usage
