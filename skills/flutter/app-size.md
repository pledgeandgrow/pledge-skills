# Measuring Your App's Size

How to measure app size for iOS and Android.

## Why app size matters

The APK, app bundle, or IPA version of a Flutter app is self-contained and holds all the code and assets needed to run the app. A larger app:
- Requires more space on the device
- Takes longer to download
- Might break limits for features like Android instant apps

## Debug vs release size

- **Debug builds** (`flutter run`) — Large due to debugging overhead (hot reload, source-level debugging). Not representative of production size.
- **Release builds** (`flutter build apk`, `flutter build ios`) — Built for store upload. Still not representative of end-user download size because stores reprocess and split the package.
- **Store-processed size** — The actual size users download after the store optimizes for their device (DPI filtering, ABI filtering).

## Measuring Android app size

### Using Google Play Console

1. Build an App Bundle:
```bash
flutter build appbundle --release
```

2. Upload the `.aab` to [Google Play Console](https://play.google.com/apps/publish/)

3. Check app size in **Android vitals → App size** tab:
   - **Download size** — Based on XXXHDPI (~640dpi) device on arm64-v8a
   - **Install size** — Actual size on device after installation
   - Toggle between download and install size

### Using analyze-size

```bash
flutter build apk --release --analyze-size
```

This generates a size breakdown showing:
- Dart AOT code size
- Flutter framework size
- Native libraries
- Assets

### Using bundletool

```bash
bundletool build-apks --bundle=app-release.aab --output=app.apks --connected-device
bundletool get-size total --apks=app.apks --dimensions=DOWNLOAD
```

## Measuring iOS app size

### Using App Store Connect

1. Build an IPA:
```bash
flutter build ipa --release
```

2. Upload to [App Store Connect](https://appstoreconnect.apple.com)

3. Check the estimated download size in the App Store Connect build details

### Using Xcode

1. Open the archived app in Xcode
2. Select the archive → **Distribute App** → **Development** or **Ad Hoc**
3. Check the estimated App Store file size

### Using analyze-size

```bash
flutter build ios --release --analyze-size
```

## Reducing app size

### 1. Use App Bundles (Android)

```bash
flutter build appbundle --release  # Instead of flutter build apk
```

App Bundles allow Google Play to generate optimized APKs per device, reducing download size by ~20%.

### 2. Split per ABI (Android)

```bash
flutter build apk --split-per-abi --release
```

Generates separate APKs for arm64-v8a, armeabi-v7a, and x86_64.

### 3. Obfuscate Dart code

```bash
flutter build appbundle --release --obfuscate --split-debug-info=build/symbols
```

Strips debug symbols and function names, reducing Dart code size.

### 4. Compress images

- Use `.webp` instead of `.png` for images
- Compress images before bundling
- Use `cached_network_image` for remote images
- Remove unused assets

### 5. Minimize dependencies

- Remove unused packages
- Check package sizes with `flutter pub deps`
- Prefer lightweight alternatives

### 6. Enable R8/ProGuard (Android)

R8 is enabled by default in release builds. It tree-shakes unused code and shrinks the app.

### 7. Tree shaking

Flutter automatically tree-shakes unused Dart code in release builds. No action needed.

### 8. Use deferred components (Android)

Split large features into deferred components downloaded on demand:

```yaml
flutter:
  deferred-components:
    - name: large_feature
      assets:
        - assets/large/
```

### 9. Remove unused fonts

Only include the font weights you actually use. Material Icons font is included by default — disable if not needed:

```yaml
flutter:
  uses-material-design: false  # Remove Material Icons font
```

## Typical Flutter app sizes

| Build type | Approximate size |
|-----------|-----------------|
| Debug APK | ~50-80 MB |
| Release APK (universal) | ~15-25 MB |
| Release App Bundle (download) | ~8-15 MB |
| Release IPA | ~15-30 MB |
| Release IPA (App Store download) | ~10-20 MB |

Sizes vary based on app complexity, assets, and dependencies.

## Best practices

1. Always measure with release builds, not debug
2. Use App Bundles for Android production
3. Check actual download size in Play Console / App Store Connect
4. Compress all images and assets
5. Remove unused dependencies and assets
6. Obfuscate Dart code for sensitive apps
7. Consider deferred components for large features
8. Monitor app size as part of CI/CD
