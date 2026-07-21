# Distribution

Building, bundling, signing, and distributing Tauri applications.

## Building

### Build command

```bash
cargo tauri build
```

This compiles the Rust backend in release mode, builds the frontend, and creates platform-specific bundles.

### Build for specific targets

```bash
# Build for specific target
cargo tauri build --target aarch64-apple-darwin

# Build for Android
cargo tauri android build

# Build for iOS
cargo tauri ios build
```

## Bundling

### Bundle targets

Control which bundle formats are generated:

```json
{
  "bundle": {
    "targets": ["deb", "rpm", "appimage", "nsis", "dmg"]
  }
}
```

Or via CLI:

```bash
cargo tauri build --bundles deb,rpm
cargo tauri build --bundles nsis
cargo tauri build --bundles dmg
```

### Windows bundles

- **NSIS** — Default Windows installer (.exe)
- **MSI** — Windows Installer (.msi)
- **WiX** — Alternative MSI builder

```json
{
  "bundle": {
    "windows": {
      "nsis": {
        "installerIcon": "icons/icon.ico",
        "installMode": "perMachine"
      },
      "webviewInstallMode": {
        "type": "embedBootstrapper"
      }
    }
  }
}
```

### macOS bundles

- **DMG** — Disk image
- **App Bundle** — For App Store

```json
{
  "bundle": {
    "macOS": {
      "signingIdentity": "Developer ID Application: Your Name (TEAMID)",
      "entitlements": "entitlements.plist"
    }
  }
}
```

### Linux bundles

- **AppImage** — Portable Linux app
- **Deb** — Debian package
- **RPM** — Red Hat package

```json
{
  "bundle": {
    "linux": {
      "deb": {
        "depends": ["libwebkit2gtk-4.1-0"]
      }
    }
  }
}
```

### Android bundles

```bash
# APK
cargo tauri android build

# App Bundle (for Play Store)
cargo tauri android build --aab
```

### iOS bundles

```bash
cargo tauri ios build
```

## Versioning

Set the version in `tauri.conf.json`:

```json
{
  "version": "1.0.0"
}
```

Or read from `Cargo.toml`:

```json
{
  "version": "../Cargo.toml"
}
```

## Signing

### Windows code signing

```bash
# Set environment variables
set TAURI_SIGNING_PRIVATE_KEY=path/to/key.pvk
set TAURI_SIGNING_PRIVATE_KEY_PASSWORD=your_password

cargo tauri build
```

### macOS code signing

```json
{
  "bundle": {
    "macOS": {
      "signingIdentity": "Developer ID Application: Your Name (TEAMID)"
    }
  }
}
```

```bash
# Notarize your app
xcrun notarytool submit my-app.dmg --apple-id you@email.com --team-id TEAMID --password app-specific-password
```

### Updater signing

Generate a key pair for the updater plugin:

```bash
cargo tauri signer generate -w ~/.tauri/myapp.key
```

```json
{
  "plugins": {
    "updater": {
      "pubkey": "PUBLIC_KEY_HERE",
      "endpoints": ["https://example.com/updates.json"]
    }
  }
}
```

## Distributing

### Linux

- **AppImage** — Distribute directly or via AppImageHub
- **Snap** — Publish to Snap Store
- **Flatpak** — Publish to Flathub
- **Deb/RPM** — Distribute via package repositories

### macOS

- **Direct download** — Distribute DMG from your website
- **Mac App Store** — Submit app bundle via App Store Connect
- **Homebrew** — Create a Homebrew cask

### Windows

- **Direct download** — Distribute NSIS/MSI from your website
- **Microsoft Store** — Submit via Partner Center
- **Winget** — Create a winget manifest

### Android

- **Google Play Store** — Upload AAB via Play Console
- **Direct download** — Distribute APK directly
- **F-Droid** — Submit for inclusion in F-Droid

### iOS

- **App Store** — Upload via App Store Connect
- **TestFlight** — Beta testing via TestFlight
- **Ad Hoc** — Direct distribution to registered devices

### Cloud services

- **GitHub Releases** — Upload bundles to GitHub releases
- **tauri-action** — GitHub Action for cross-platform builds
- **Custom update server** — Host update JSON for the updater plugin

## CI/CD with GitHub Actions

```yaml
name: Release
on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    strategy:
      matrix:
        platform: [macos-latest, ubuntu-latest, windows-latest]
    runs-on: ${{ matrix.platform }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - uses: dtolnay/rust-toolchain@stable
      - run: npm install
      - uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tagName: ${{ github.ref_name }}
          releaseName: 'App ${{ github.ref_name }}'
          releaseDraft: true
```

## Best practices

1. Always sign your applications for all platforms
2. Use the updater plugin for automatic updates
3. Set up CI/CD with tauri-action for cross-platform builds
4. Test your bundles on clean systems
5. Notarize macOS apps for Gatekeeper
6. Use App Bundles (.aab) for Google Play
7. Keep your signing keys secure
8. Version your releases semantically
