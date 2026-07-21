# Configuration Reference

Complete reference for `tauri.conf.json` configuration options.

## File formats

Tauri supports JSON, JSON5, and TOML configuration files:
- `tauri.conf.json` (default)
- `tauri.conf.json5`
- `tauri.conf.toml`

Use `$schema` for autocompletion:

```json
{
  "$schema": "https://schema.tauri.app/config/2"
}
```

## Platform-specific configuration

Override settings per platform using platform-specific config files:
- `tauri.linux.conf.json`
- `tauri.macos.conf.json`
- `tauri.windows.conf.json`
- `tauri.android.conf.json`
- `tauri.ios.conf.json`

Merge with `--config` flag:

```bash
cargo tauri build --config tauri.macos.conf.json
```

## Configuration structure

### app

Application-level settings:

```json
{
  "app": {
    "windows": [
      {
        "label": "main",
        "title": "My App",
        "width": 800,
        "height": 600,
        "minWidth": 400,
        "minHeight": 300,
        "maxWidth": 1920,
        "maxHeight": 1080,
        "resizable": true,
        "fullscreen": false,
        "center": true,
        "decorations": true,
        "transparent": false,
        "alwaysOnTop": false,
        "skipTaskbar": false,
        "theme": "Dark",
        "titleBarStyle": "Visible",
        "hidden": false,
        "maximized": false,
        "url": "index.html",
        "userAgent": "",
        "zoomHotkeysEnabled": false,
        "browserAcceleratorKeys": true,
        "devtools": false
      }
    ],
    "security": {
      "csp": "default-src 'self'",
      "devCsp": null,
      "freezePrototype": false,
      "dangerousDisableAssetCspModification": false,
      "assetProtocol": {
        "enable": true,
        "scope": []
      }
    },
    "trayIcon": {
      "iconPath": "icons/tray.png",
      "iconAsTemplate": false,
      "menuOnLeftClick": false,
      "title": "My App",
      "tooltip": "My App"
    },
    "macOSPrivateApi": false,
    "withGlobalTauri": false,
    "pattern": {
      "use": "Brownfield"
    }
  }
}
```

### build

Build settings:

```json
{
  "build": {
    "frontendDist": "../dist",
    "devUrl": "http://localhost:3000",
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "runner": "",
    "features": []
  }
}
```

### bundle

Bundle/installer settings:

```json
{
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ],
    "resources": [],
    "externalBin": [],
    "copyright": "",
    "category": "Utility",
    "shortDescription": "My App",
    "longDescription": "A great application",
    "publisher": "My Company",
    "homepage": "https://example.com",
    "windows": {
      "nsis": {
        "installerIcon": "icons/icon.ico",
        "installMode": "currentUser",
        "languages": ["English"],
        "displayLanguageSelector": false
      },
      "msi": {
        "wix": {}
      },
      "webviewInstallMode": {
        "type": "downloadBootstrapper"
      }
    },
    "macOS": {
      "signingIdentity": null,
      "providerShortName": null,
      "entitlements": null,
      "minimumSystemVersion": "10.15"
    },
    "linux": {
      "deb": {
        "depends": []
      },
      "rpm": {
        "depends": []
      },
      "appimage": {
        "bundleMediaFramework": false
      }
    },
    "iOS": {
      "minimumSystemVersion": "13.0"
    },
    "android": {
      "minSdkVersion": 24
    }
  }
}
```

### identifier

Unique app identifier (reverse domain notation):

```json
{
  "identifier": "com.example.myapp"
}
```

### mainBinaryName

Custom binary name:

```json
{
  "mainBinaryName": "my-app"
}
```

### plugins

Plugin configuration:

```json
{
  "plugins": {
    "updater": {
      "active": true,
      "endpoints": ["https://example.com/updates.json"],
      "pubkey": "PUBLIC_KEY",
      "windows": {
        "installMode": "passive"
      }
    },
    "shell": {
      "scope": [
        {
          "name": "open",
          "cmd": "open",
          "args": true
        }
      ]
    }
  }
}
```

### productName

Display name for the application:

```json
{
  "productName": "My Awesome App"
}
```

### version

App version:

```json
{
  "version": "1.0.0"
}
```

## Definitions

### WindowConfig

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| label | string | — | Unique window identifier |
| url | string | "index.html" | WebView URL |
| title | string | — | Window title |
| width | number | 800 | Window width |
| height | number | 600 | Window height |
| minWidth | number | — | Minimum width |
| minHeight | number | — | Minimum height |
| maxWidth | number | — | Maximum width |
| maxHeight | number | — | Maximum height |
| resizable | boolean | true | Allow resizing |
| fullscreen | boolean | false | Start fullscreen |
| center | boolean | false | Center on screen |
| decorations | boolean | true | Show window decorations |
| transparent | boolean | false | Transparent window |
| alwaysOnTop | boolean | false | Keep above other windows |
| skipTaskbar | boolean | false | Skip taskbar |
| theme | "Light"\|"Dark" | — | Window theme |
| titleBarStyle | "Visible"\|"Transparent"\|"Overlay" | "Visible" | Title bar style |
| hidden | boolean | false | Start hidden |
| maximized | boolean | false | Start maximized |
| devtools | boolean | false | Enable devtools |

### SecurityConfig

| Field | Type | Description |
|-------|------|-------------|
| csp | string\|null | Content Security Policy |
| devCsp | string\|null | CSP for development |
| freezePrototype | boolean | Freeze Object.prototype |
| dangerousDisableAssetCspModification | boolean | Disable automatic CSP modification |
| assetProtocol | object | Asset protocol config |

### BundleConfig

| Field | Type | Description |
|-------|------|-------------|
| active | boolean | Enable bundling |
| targets | string\|string[] | Bundle formats |
| icon | string[] | Icon paths |
| resources | string[] | Additional resources |
| externalBin | string[] | Sidecar binaries |
| copyright | string | Copyright notice |
| category | string | App category |
| windows | object | Windows-specific config |
| macOS | object | macOS-specific config |
| linux | object | Linux-specific config |

### BuildConfig

| Field | Type | Description |
|-------|------|-------------|
| frontendDist | string | Frontend dist path |
| devUrl | string | Dev server URL |
| beforeDevCommand | string | Command before dev |
| beforeBuildCommand | string | Command before build |
| runner | string | Custom binary runner |
| features | string[] | Cargo features |

## Best practices

1. Use `$schema` for IDE autocompletion
2. Set `identifier` early (hard to change)
3. Use platform-specific config files for platform overrides
4. Configure CSP for production security
5. Set appropriate window defaults
6. Use `cargo tauri inspect config` to validate configuration
