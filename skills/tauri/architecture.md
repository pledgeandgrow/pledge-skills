# Tauri Architecture

High-level overview of Tauri's architecture, core ecosystem, and tooling.

## Overview

Tauri is a toolkit, not a framework. It combines a Rust core with the platform's native webview to create small, secure, cross-platform applications. The architecture is modular, with clear separation between the frontend, the Rust backend, and the platform-specific webview.

### What Tauri is not

- **Not a browser** — Tauri uses the OS's native webview, not a bundled Chromium
- **Not a frontend framework** — Bring your own frontend stack
- **Not an Electron alternative** — Tauri apps are much smaller and use less memory
- **Not a Rust web framework** — Tauri is for desktop and mobile apps, not web servers

## Core ecosystem

### tauri

The main crate that provides the API for creating windows, managing state, handling IPC, and more.

### tauri-runtime

A thin abstraction over the windowing and event loop libraries. Supports multiple backends.

### tauri-macros

Procedural macros for generating command handlers and event types.

### tauri-utils

Common utilities used across Tauri crates (configuration parsing, platform detection, etc.).

### tauri-build

Build-time utilities for generating context, icons, and configuration.

### tauri-codegen

Code generation for compile-time configuration embedding.

### tauri-runtime-wry

The default runtime backend using [wry](https://github.com/tauri-apps/wry), which wraps platform webviews:
- **Linux** — WebKitGTK
- **macOS** — WKWebView
- **Windows** — WebView2 (Chromium)
- **Android** — Android WebView
- **iOS** — WKWebView

## Tauri tooling

### API (JavaScript/TypeScript)

The `@tauri-apps/api` package provides JavaScript bindings for Tauri's core functionality:
- Window management
- Event system
- IPC (invoke commands)
- Path utilities
- Application metadata

### Bundler (Rust/Shell)

The Tauri bundler compiles your Rust code, bundles the frontend, and creates platform-specific installers:
- **Windows** — NSIS, MSI, WiX
- **macOS** — DMG, App Bundle
- **Linux** — AppImage, Deb, RPM
- **Android** — APK, AAB
- **iOS** — IPA

### cli.rs (Rust)

The Rust CLI (`cargo tauri`) provides commands for development, building, and project management.

### cli.js (JavaScript)

The JavaScript CLI (`@tauri-apps/cli`) provides the same functionality as the Rust CLI via npm/npx.

### create-tauri-app

A scaffolding tool for creating new Tauri projects with various frontend templates.

## Upstream crates

### TAO

Window creation library (forked from `winit`). Provides cross-platform window management with additional features like tray icons and window effects.

### WRY

Webview rendering library. Wraps platform-specific webview APIs into a unified interface. This is the key abstraction that lets Tauri use native webviews instead of bundling a browser engine.

## Additional tooling

### tauri-action

GitHub Action for building and publishing Tauri apps across platforms in CI/CD.

### tauri-vscode

VS Code extension for Tauri development with configuration validation and snippets.

## Plugins

Tauri has a plugin system for extending functionality:
- **Official plugins** — File system, dialog, notification, shell, updater, clipboard, HTTP, global shortcut, process, store, log, WebSocket, and more
- **Community plugins** — BLE, MQTT, serial port, device info, and more
- **Custom plugins** — Create your own using the plugin API

## Architecture diagram

```
┌─────────────────────────────────────────────┐
│              Your Frontend (JS/TS)            │
│         (React, Vue, Svelte, vanilla, etc.)   │
├─────────────────────────────────────────────┤
│           @tauri-apps/api (JS bindings)       │
├─────────────────────────────────────────────┤
│              Tauri Core (Rust)                │
│   (Commands, Events, State, Window Mgmt)      │
├─────────────────────────────────────────────┤
│           tauri-runtime / WRY                 │
│    (Cross-platform webview abstraction)       │
├─────────────────────────────────────────────┤
│         Platform Native Webview               │
│  WebKitGTK | WKWebView | WebView2 | Android   │
├─────────────────────────────────────────────┤
│              Operating System                 │
│     Linux | macOS | Windows | Android | iOS   │
└─────────────────────────────────────────────┘
```

## License

Tauri is dual-licensed under MIT and Apache 2.0.
