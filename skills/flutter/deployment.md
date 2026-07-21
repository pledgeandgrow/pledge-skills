# Deployment

Content covering deployment of Flutter apps to all platforms.

## Build modes

Flutter has three build modes:

- **Debug** — `flutter run` — JIT compilation, hot reload, assertions enabled
- **Profile** — `flutter run --profile` — AOT compilation, profiling tools, no hot reload
- **Release** — `flutter build` — AOT compilation, minified, no debugging info

## Android deployment

### Build a release APK/App Bundle

```bash
# App Bundle (recommended for Play Store)
flutter build appbundle --release

# APK
flutter build apk --release
```

### Configure signing

1. Create a keystore:

```bash
keytool -genkey -v -keystore ~/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

2. Reference in `android/app/build.gradle`:

```gradle
signingConfigs {
    release {
        keyAlias 'upload'
        keyPassword 'password'
        storeFile file('/path/to/upload-keystore.jks')
        storePassword 'password'
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
    }
}
```

### Publish to Play Store

1. Build the app bundle: `flutter build appbundle --release`
2. Upload `.aab` to [Play Console](https://play.google.com/console)
3. Set up store listing, pricing, etc.
4. Submit for review

### Flavors (Android)

Configure build flavors in `android/app/build.gradle`:

```gradle
flavorDimensions "default"
productFlavors {
    dev {
        dimension "default"
        applicationIdSuffix ".dev"
    }
    production {
        dimension "default"
    }
}
```

```bash
flutter build appbundle --flavor production --release
```

## iOS deployment

### Build a release iOS app

```bash
flutter build ipa --release
```

### Configure signing

1. Open `ios/Runner.xcworkspace` in Xcode
2. Set team and bundle identifier
3. Configure provisioning profiles

### Publish to App Store

1. Build: `flutter build ipa --release`
2. Open `build/ios/archive/Runner.xcarchive` in Xcode
3. Or use Transporter to upload `.ipa`
4. Submit via [App Store Connect](https://appstoreconnect.apple.com)

### Flavors (iOS/macOS)

Configure schemes and configurations in Xcode, then:

```bash
flutter build ipa --flavor production --release
```

## Web deployment

### Build a web app

```bash
flutter build web --release
```

Options:

```bash
flutter build web --web-renderer canvaskit  # or html
flutter build web --wasm                     # WasmGC compilation
flutter build web --base-href "/myapp/"
```

### Deploy

- **Firebase Hosting**: `firebase deploy`
- **GitHub Pages**: Copy `build/web` to `gh-pages` branch
- **Any static server**: Copy `build/web` contents

## macOS deployment

```bash
flutter build macos --release
```

Publish to the macOS App Store via Xcode or `altool`.

## Windows deployment

```bash
flutter build windows --release
```

Publish to the Microsoft Store via [Partner Center](https://partner.microsoft.com).

## Linux deployment

```bash
flutter build linux --release
```

Publish to the Snap Store:

```bash
snapcraft
snap install myapp --dangerous
```

## Continuous delivery (CD)

### GitHub Actions

```yaml
name: Build and Deploy
on: [push]
jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          channel: stable
      - run: flutter pub get
      - run: flutter test
      - run: flutter build appbundle --release
      - uses: actions/upload-artifact@v4
        with:
          name: app-bundle
          path: build/app/outputs/bundle/release/app-release.aab
```

### Fastlane

Use Fastlane for automated screenshots, beta deployments, and store releases:

```bash
fastlane init
fastlane beta
```

## Obfuscate Dart code

Remove function and class names from the Dart binary:

```bash
flutter build appbundle --release --obfuscate --split-debug-info=build/symbols
```

Keep the `symbols` directory for deobfuscating stack traces.

## Split per ABI (Android)

Build separate APKs per ABI to reduce size:

```bash
flutter build apk --split-per-abi --release
```

## Best practices

1. Always test in release mode before publishing
2. Use App Bundles (`.aab`) for Android, not APKs
3. Keep signing credentials secure (use CI secrets)
4. Set proper version numbers in `pubspec.yaml`
5. Test on real devices, not just emulators
6. Obfuscate code for sensitive apps
7. Set up CD early in the project
8. Keep `symbols` directory for crash deobfuscation
9. Follow platform-specific store guidelines
10. Test deep links and push notifications in production builds
