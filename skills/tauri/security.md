# Security

Tauri's security model, CSP, capabilities, scopes, and lifecycle threats.

## Overview

Tauri is designed with security as a top priority. The security of your Tauri application is the sum of:
- Tauri framework security
- Your Rust and npm dependencies
- Your code
- The devices running the final application

## Trust boundaries

Tauri has two main trust boundaries:

1. **Core process (Rust)** — Full system access, trusted code
2. **WebView process (JS)** — Sandboxed, untrusted code with limited permissions

The IPC layer (commands and events) is the bridge between these boundaries. Tauri's permission system controls what the WebView can access.

## (Not) Bundling WebViews

Tauri uses the OS's native webview rather than bundling one. This has security implications:
- **Pro** — Smaller app size, native security updates via OS
- **Con** — WebView behavior may vary across platforms and versions
- **Mitigation** — Test on all target platforms, use CSP, validate all IPC inputs

## Content Security Policy (CSP)

CSP restricts what resources the WebView can load. Configure in `tauri.conf.json`:

```json
{
  "app": {
    "security": {
      "csp": "default-src 'self'; img-src 'self' https://*; script-src 'self'; style-src 'self' 'unsafe-inline'"
    }
  }
}
```

### CSP directives

- `default-src` — Fallback for other directives
- `script-src` — JavaScript sources
- `style-src` — CSS sources
- `img-src` — Image sources
- `connect-src` — AJAX/fetch/WebSocket sources
- `font-src` — Font sources
- `frame-src` — iframe sources

### Tauri-specific CSP

Tauri automatically modifies CSP to allow its IPC. Use `csp` to set your policy:

```json
{
  "app": {
    "security": {
      "csp": "default-src 'self'; script-src 'self'"
    }
  }
}
```

Set to `null` to disable CSP (not recommended for production).

## Capabilities

Capabilities define what permissions the WebView has. They are configured in `src-tauri/capabilities/`:

```json
// src-tauri/capabilities/default.json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Default capability for main window",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "shell:allow-open",
    "dialog:allow-open",
    "fs:allow-read-text-file",
    {
      "identifier": "fs:allow-write-text-file",
      "allow": [
        { "path": "$APPDATA/*" }
      ]
    }
  ]
}
```

### Target platform

Restrict capabilities to specific platforms:

```json
{
  "identifier": "mobile-only",
  "platforms": ["android", "iOS"],
  "permissions": ["..."]
}
```

### Remote API access

Allow remote URLs to access Tauri APIs:

```json
{
  "identifier": "remote",
  "remote": {
    "urls": ["https://*.example.com"]
  },
  "permissions": ["..."]
}
```

### Security boundaries

Capabilities define:
- Which windows get which permissions
- Which plugins can be accessed
- What file paths are accessible (scopes)
- Whether remote URLs can use Tauri APIs

### Configuration files

Capabilities are stored as JSON files in `src-tauri/capabilities/`:
- `default.json` — Default capabilities
- Custom files for specific windows or platforms

### Core permissions

- `core:default` — Basic window management
- `core:window:allow-*` — Window-specific operations
- `core:webview:allow-*` — WebView operations
- `core:app:allow-*` — Application operations

## Command scopes

Scopes restrict what resources commands can access (e.g., file paths, URLs):

```json
{
  "permissions": [
    {
      "identifier": "fs:allow-read-text-file",
      "allow": [
        { "path": "$APPDATA/config.json" },
        { "path": "$DOCUMENT/*" }
      ],
      "deny": [
        { "path": "$APPDATA/secrets/*" }
      ]
    }
  ]
}
```

### Scope variables

| Variable | Description |
|----------|-------------|
| `$APPDATA` | App data directory |
| `$APPCONFIG` | App config directory |
| `$DOCUMENT` | Documents directory |
| `$DOWNLOAD` | Downloads directory |
| `$HOME` | Home directory |
| `$RESOURCE` | Bundled resources directory |
| `$TEMP` | Temp directory |

## Application lifecycle threats

### Upstream threats

- **Keep applications up-to-date** — Update Tauri and dependencies regularly
- **Evaluate dependencies** — Audit Rust crates and npm packages

### Development threats

- **Development server** — The built-in dev server doesn't support encryption. Don't use on untrusted networks.
- **Harden development machines** — Keep dev machines secure
- **Source control** — Ensure proper authentication and authorization for repos

### Buildtime threats

- **Reproducible builds** — Use lockfiles (Cargo.lock, package-lock.json) for reproducible builds
- **CI/CD security** — Secure your build pipeline

### Distribution threats

- **Code signing** — Sign your apps for all platforms
- **Update mechanism** — Use the updater plugin with signature verification

### Runtime threats

- **Input validation** — Validate all IPC inputs in Rust
- **Principle of least privilege** — Only grant necessary permissions
- **Sandbox** — Keep the WebView sandboxed with proper CSP

## Coordinated disclosure

Report security vulnerabilities to the Tauri team via [security@tauri.app](mailto:security@tauri.app) or GitHub Security Advisories.

## Best practices

1. Always set a strict CSP in production
2. Use capabilities to grant only necessary permissions
3. Use scopes to restrict file and URL access
4. Validate all inputs in Rust commands
5. Keep Tauri and dependencies updated
6. Sign your applications
7. Use the updater plugin with signature verification
8. Don't disable DevTools in production unless necessary
9. Audit your npm and Rust dependencies
10. Use `null` CSP only in development
