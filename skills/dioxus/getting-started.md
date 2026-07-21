# Getting Started

> **Source:** [https://dioxuslabs.com/learn/0.7/getting_started/](https://dioxuslabs.com/learn/0.7/getting_started/)

## Pick an Editor

VSCode is recommended — Dioxus ships with its [own VSCode extension](https://marketplace.visualstudio.com/items?itemName=DioxusLabs.dioxus) for RSX syntax highlighting, code navigation, and folding.

The build tool `dx` is standalone and used through a terminal. Most editors support the Rust-Analyzer LSP plugin for syntax highlighting, code navigation, folding, and more. Installation instructions are available for VSCode, Zed, Emacs, and Vim at [rust-analyzer.github.io](https://rust-analyzer.github.io/manual.html).

## Install Rust

Install the Rust compiler via [rustup](https://rust-lang.org):

```bash
rustup toolchain install stable
rustup target add wasm32-unknown-unknown
```

The `wasm32-unknown-unknown` target is required for web apps. The [official Rust book](https://doc.rust-lang.org/book/ch01-00-getting-started.html) is recommended reading, though Dioxus can serve as a great first Rust project.

## Install the Dioxus CLI

Dioxus ships with its own build tool (`dx`) that leverages cargo to provide integrated hot-reloading, bundling, and development servers.

**Prebuilt binary (recommended):**

```bash
curl -sSL https://dioxus.dev/install.sh | bash
```

**Via cargo-binstall:**

```bash
cargo binstall dioxus-cli --force
```

**From source (can take up to 10 minutes):**

```bash
cargo install dioxus-cli
```

If you get an OpenSSL error on installation, ensure the dependencies listed at [docs.rs/openssl](https://docs.rs/openssl/latest/openssl/) are installed.

## Platform-Specific Dependencies

Use `dx doctor` to check if your setup is properly configured:

```bash
dx doctor
```

### macOS

No extra dependencies required. For iOS apps, see the iOS section below.

### Windows

Windows apps depend on WebView2 — installed on all modern Windows distributions. If you have Edge installed, Dioxus will work fine. If not, [install WebView2 through Microsoft](https://developer.microsoft.com/en-us/microsoft-edge/webview2/). Three options:
1. A tiny "evergreen" bootstrapper (recommended) — fetches installer from Microsoft's CDN
2. A tiny installer that fetches WebView2 from Microsoft's CDN
3. A statically linked version for offline users

### Linux

WebView Linux apps require WebkitGtk and xdotool.

**Ubuntu:**

```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
    build-essential \
    curl \
    wget \
    file \
    libxdo-dev \
    libssl-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    lld
```

**Arch:**

```bash
sudo pacman -Syu
sudo pacman -S --needed \
    webkit2gtk-4.1 \
    base-devel \
    curl \
    wget \
    file \
    openssl \
    appmenu-gtk-module \
    libappindicator-gtk3 \
    librsvg \
    xdotool
```

**Fedora:**

```bash
sudo dnf install libxdo-devel
```

For other Linux targets, check the [Tauri docs](https://tauri.app/start/prerequisites/) which cover the same dependencies.

### WSL

Development in WSL for Dioxus desktop is possible but tricky:

1. Update your kernel to the latest version and update WSL to version 2
2. Add `export DISPLAY=:0` to `~/.zshrc`
3. Install Tauri's Linux dependencies
4. Install `zenity` for file dialogs to work

When running Dioxus desktop on WSL, you may get warnings from `libEGL`. There is currently no way to silence these, but the app should still render.

### iOS

Building iOS apps requires macOS with XCode installed:

- [Mac App Store](https://apps.apple.com/gb/app/xcode/id497799835?mt=12)
- [Apple Developer website](https://developer.apple.com/xcode/resources/)

Download the iOS SDK and install simulators. See the [dedicated guide for iOS development](https://dioxuslabs.com/learn/0.7/guides/platforms/mobile).

### Android

Android apps require the Android SDK and NDK. See the [dedicated guide for Android development](https://dioxuslabs.com/learn/0.7/guides/platforms/mobile).
