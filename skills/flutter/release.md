# Stay Up to Date

Flutter releases, breaking changes, and SDK management.

## Release channels

| Channel | Purpose |
|---------|---------|
| `stable` | Production-ready releases (recommended) |
| `beta` | Pre-release for testing upcoming features |
| `master` | Latest development builds (unstable) |

## Upgrading Flutter

```bash
# Upgrade Flutter SDK
flutter upgrade

# Switch channel
flutter channel beta
flutter upgrade

# Check current version
flutter --version

# Downgrade
flutter downgrade
```

## Breaking changes

Flutter publishes breaking changes with migration guides. Check [breaking changes](https://docs.flutter.dev/release/breaking-changes) before upgrading.

### Flutter fix

Automatically migrate deprecated APIs:

```bash
flutter fix --dry-run    # Preview changes
flutter fix --apply      # Apply fixes
```

## SDK archive

Download previous releases from the [SDK archive](https://docs.flutter.dev/install/archive).

## What's new

See [What's new](https://docs.flutter.dev/release/whats-new) for changes to the Flutter site and documentation.

## Release notes

Each Flutter release includes:
- New features
- Performance improvements
- Bug fixes
- Breaking changes with migration guides

## Supported platforms

Flutter officially supports:
- Android (min API 21+)
- iOS (min iOS 12+)
- Web (Chrome, Safari, Firefox, Edge)
- Windows (Windows 10+)
- macOS (macOS 10.14+)
- Linux (Ubuntu, Debian, Fedora)

See [supported platforms](https://docs.flutter.dev/reference/supported-platforms) for details.

## Best practices

1. Stay on `stable` for production apps
2. Test upgrades in a branch before merging
3. Run `flutter fix` after upgrading
4. Read breaking changes before upgrading
5. Pin Flutter version in CI
6. Test on all target platforms after upgrading
7. Keep dependencies updated with `flutter pub outdated`
8. Subscribe to [Flutter blog](https://blog.flutter.dev) for announcements
