# Speeding Up Your Build Phase

Building React Native apps can be expensive and take several minutes. Here are techniques to speed up builds.

---

## Build Only One ABI During Development (Android-only)

By default, React Native builds for all ABIs (`armeabi-v7a`, `arm64-v8a`, `x86`, `x86_64`). During development, you only need the ABI matching your device/emulator.

In `android/gradle.properties`:

```properties
# Build only for the active ABI
reactNativeArchitectures=arm64-v8a
```

Or use the CLI flag:

```bash
npx react-native run-android --active-arch-only
```

---

## Enable Configuration Caching (Android-only)

Gradle Configuration Caching avoids re-evaluating the build configuration on every build.

In `android/gradle.properties`:

```properties
org.gradle.configuration-cache=true
```

---

## Using a Maven Mirror (Android-only)

If your organization runs a Maven repository mirror, use it to speed up dependency downloads:

In `android/gradle.properties`:

```properties
hermesEnabled=true
# Use this property to configure a Maven enterprise repository
exclusiveEnterpriseRepository=https://my.internal.proxy.net/
```

By setting this, your build fetches dependencies exclusively from the specified repository.

---

## Use a Compiler Cache

### Local Caches — ccache

[ccache](https://ccache.dev/) wraps C++ compilers, storing compilation results and skipping recompilation when cached.

**Install:**

```bash
brew install ccache  # macOS
```

**Verify it works:**

```bash
# Run two clean builds, second should be much faster
yarn react-native run-android
# delete android/app/build, then run again
yarn react-native run-android

# Check cache hit/miss rate
ccache -s

# Reset stats before a build
ccache --zero-stats

# Wipe cache
ccache --clear
```

**Xcode Specific Setup (iOS):**

Open `ios/Podfile` and uncomment the `ccache_enabled` line:

```ruby
post_install do |installer|
  react_native_post_install(
    installer,
    config[:reactNativePath],
    :mac_catalyst_enabled => false,
    :ccache_enabled => true
  )
end
```

**Using ccache on CI:**

- ccache stores in `/Users/$USER/Library/Caches/ccache` on macOS — save & restore this folder on CI
- On CI, do a full clean build to avoid poisoned cache problems
- ccache relies on timestamps for cache hits — doesn't work well on CI since files are re-downloaded
- Use `compiler_check content` option to rely on file content hashing instead
- If parallelizing native build across 4 ABIs, you likely won't need ccache on CI

### Distributed Caches — sccache

For bigger organizations doing frequent native builds, use [sccache](https://github.com/mozilla/sccache) for distributed compilation caching.

See the [sccache distributed compilation quickstart](https://github.com/mozilla/sccache/blob/main/docs/DistributedQuickstart.md).
