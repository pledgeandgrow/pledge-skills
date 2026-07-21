---
name: tauri
version: Tauri 2.0
tags: [tauri, desktop, mobile, rust, webview, cross-platform, ipc, security, bundling, plugins]
description: Tauri 2.0 — cross-platform app toolkit with Rust backend and native webview frontend. Covers architecture, IPC (commands, events, channels), process model, app size, calling Rust from frontend, configuration files, sidecar binaries, debugging, security (CSP, capabilities, scopes, lifecycle threats), distribution (bundling, signing, CI/CD), official plugins (fs, dialog, notification, shell, updater, clipboard, global-shortcut, process, store, websocket, http, log), CLI reference, config reference, migration from Tauri 1, and development workflow for desktop and mobile
---

# Tauri Skill

> Tauri 2.0 — Create small, fast, secure, cross-platform applications for desktop and mobile from a single codebase. Rust backend + any frontend framework + native webview.

## Quick Reference

| Topic | File |
|------|------|
| Introduction (what is Tauri, prerequisites, create project, project structure, frontend config) | `introduction.md` |
| Development Workflow (dev server, mobile dev, hot reload, DevTools, build modes, source control) | `develop.md` |
| Architecture (core ecosystem, tooling, upstream crates, WRY, TAO, plugin system) | `architecture.md` |
| Process Model (core process, webview process, multi-window, mobile process model) | `process-model.md` |
| Inter-Process Communication (commands, events, channels, state, typed payloads) | `ipc.md` |
| Calling Rust from the Frontend (commands, arguments, errors, async, channels, state, events) | `calling-rust.md` |
| Configuration Files (tauri.conf.json, Cargo.toml, package.json, platform-specific config) | `configuration-files.md` |
| Configuration Reference (app, build, bundle, security, windows, plugins, all config options) | `config-reference.md` |
| App Size (cargo optimization, frontend optimization, bundle formats, measuring size) | `app-size.md` |
| Sidecar (embedding external binaries, target triples, running from Rust/JS) | `sidecar.md` |
| Debugging (Rust console, WebView console, DevTools, mobile debugging, log plugin) | `debug.md` |
| Security (CSP, capabilities, scopes, lifecycle threats, trust boundaries, best practices) | `security.md` |
| Distribution (building, bundling, signing, versioning, CI/CD, platform stores) | `distribute.md` |
| Plugins (fs, dialog, notification, shell, updater, clipboard, global-shortcut, process, store, websocket, http, log, sql, upload, localhost, single-instance, positioner, autostart, window-state, barcode-scanner, biometric, nfc, haptics, deep-link, community plugins) | `plugins.md` |
| CLI Reference (init, dev, build, bundle, android, ios, migrate, add, remove, icon, signer, completions) | `cli.md` |
| Migration from Tauri 1.0 (automated migration, config changes, API changes, plugin migration) | `migration.md` |

---

## Core Concepts

- **Frontend-Independent**: Bring any web stack — React, Vue, Svelte, SolidJS, vanilla JS, or even Rust web frameworks like Yew and Leptos.
- **Rust Backend**: Application logic runs in a compiled Rust binary with full system access.
- **Native WebView**: Uses the OS's native webview (WebKitGTK, WKWebView, WebView2) instead of bundling Chromium — apps as small as 600KB.
- **IPC (Commands & Events)**: Call Rust functions from JS via `invoke()`, or communicate asynchronously via events.
- **Capabilities & Scopes**: Permission system controls what the WebView can access (files, URLs, system APIs).
- **Cross-Platform**: Build for Linux, macOS, Windows, Android, and iOS from a single codebase.
- **Plugin System**: Official plugins for common functionality (fs, dialog, notification, shell, updater, etc.) plus a thriving community ecosystem.
- **Security First**: CSP, signed updates, scoped permissions, and Rust's memory safety at the core.

## Official Documentation

- [Tauri docs](https://v2.tauri.app/)
- [Getting started](https://v2.tauri.app/start/)
- [Develop](https://v2.tauri.app/develop/)
- [Security](https://v2.tauri.app/security/)
- [Distribute](https://v2.tauri.app/distribute/)
- [Plugins](https://v2.tauri.app/plugin/)
- [Configuration reference](https://v2.tauri.app/reference/config/)
- [CLI reference](https://v2.tauri.app/reference/cli/)
- [GitHub](https://github.com/tauri-apps/tauri)
