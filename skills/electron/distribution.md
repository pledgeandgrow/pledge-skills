# Distribution — Packaging, Code Signing, and Updates

## Electron Forge

[Electron Forge](https://electronforge.io) is the official tool for packaging and publishing Electron applications. It unifies Electron's build tooling ecosystem into a single extensible interface.

### Getting Started

```bash
# Create a new project
npx @electron-forge/cli create-electron-app my-app

# Or add to existing project
npx @electron-forge/cli import
```

### Package the App

```bash
npm run package
```

Forge automatically detects your platform and packages accordingly. Makers create platform-specific distributables (installers):
- `@electron-forge/maker-squirrel` (Windows, Squirrel-based auto-update)
- `@electron-forge/maker-zip` (cross-platform zip)
- `@electron-forge/maker-dmg` (macOS)
- `@electron-forge/maker-deb` (Linux)
- `@electron-forge/maker-rpm` (Linux)

### Publish the App

Forge Publishers distribute to various sources:
- `@electron-forge/publisher-github` (GitHub Releases)
- `@electron-forge/publisher-s3` (AWS S3)
- `@electron-forge/publisher-nucleus` (Nucleus update server)

```bash
npm run publish
```

## Code Signing

Code signing certifies that an app was created by you. Required for:
- macOS: Gatekeeper, notarization
- Windows: SmartScreen warnings avoidance

### macOS Signing & Notarization

#### Using Electron Forge

Configure in `forge.config.js`:

```javascript
module.exports = {
  packagerConfig: {
    osxSign: {
      identity: 'Developer ID Application: Your Name (TEAM_ID)',
      'hardened-runtime': true,
      'gatekeeper-assess': false,
      entitlements: 'entitlements.plist',
      'entitlements-inherit': 'entitlements.plist',
      'signature-flags': 'library'
    },
    osxNotarize: {
      appleId: 'your@email.com',
      appleIdPassword: 'app-specific-password',
      teamId: 'TEAM_ID'
    }
  }
}
```

#### Using Electron Packager

```bash
npx electron-packager . --osx-sign
```

#### Mac App Store Applications

Use `mas` platform target with a "3rd Party Mac Developer Application" certificate.

### Windows Signing

#### Using Azure Artifact Signing

Configure with `@electron-forge/signer-azure` for cloud-based signing without local certificates.

#### Using Traditional Certificates

```javascript
module.exports = {
  packagerConfig: {
    win: {
      certificateFile: './cert.pfx',
      certificatePassword: 'password'
    }
  }
}
```

EV certificates provide immediate SmartScreen reputation.

#### Windows Store Applications

Use `appx` target with a Windows Store certificate.

## Updating Applications

### Using update.electronjs.org

Free auto-updating service for open-source apps. Requirements:
- macOS or Windows app
- Public GitHub repository
- Builds published to GitHub releases
- Code signed (macOS only)

### Using update-electron-app (Simplest)

```bash
npm install update-electron-app
```

```javascript
// In main process
require('update-electron-app')()
```

Automatically checks for updates from update.electronjs.org using the `repository` field in `package.json`.

### Using Cloud Object Storage (Serverless)

1. **Publish release metadata** to S3/GCS:
   - `RELEASES` file (Windows, Squirrel)
   - `latest.json` or `latest-mac.json` (macOS, Squirrel.Mac)

2. **Read release metadata** in your app via `autoUpdater`

### Using Other Update Services

#### Step 1: Deploy an Update Server

Options:
- [Hazel](https://github.com/electron/hazel) — update server for private GitHub repos
- [Nucleus](https://github.com/atlassian/nucleus) — Atlassian's update server
- Custom server implementing the update feed specification

#### Step 2: Receive Updates in Your App

```javascript
const { autoUpdater } = require('electron')

autoUpdater.setFeedURL({
  url: 'https://your-update-server.com/update/win32/1.0.0'
})

autoUpdater.checkForUpdates()
```

#### Step 3: Notify Users

```javascript
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Available',
    message: 'A new version has been downloaded. Restart to update?',
    buttons: ['Restart', 'Later']
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      autoUpdater.quitAndInstall()
    }
  })
})
```

### Update Server Specification

#### Windows (Squirrel.Windows)

Feed URL format: `https://server.com/update/win32/{version}`
Returns JSON with release info and `RELEASES` file URL.

#### macOS (Squirrel.Mac)

Feed URL format: `https://server.com/update/macos/{version}`
Returns JSON with `url` (zip download), `name` (version), and `notes` (release notes).

### autoUpdater Events

| Event | Description |
|-------|-------------|
| `error` | Update error occurred |
| `checking-for-update` | Started checking for updates |
| `update-available` | Update is available |
| `update-not-available` | No update available |
| `download-progress` | Download progress |
| `update-downloaded` | Update downloaded and ready to install |

### autoUpdater Methods

| Method | Description |
|--------|-------------|
| `autoUpdater.setFeedURL(url)` | Set the update feed URL |
| `autoUpdater.getFeedURL()` | Get current feed URL |
| `autoUpdater.checkForUpdates()` | Check for updates |
| `autoUpdater.quitAndInstall()` | Quit and install update |
