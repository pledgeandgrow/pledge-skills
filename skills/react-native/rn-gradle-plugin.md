# React Native Gradle Plugin (RNGP) Reference

Configuration guide for the React Native Gradle Plugin when building Android apps.

---

## Using the Plugin

The plugin is automatically applied in new React Native projects via `android/app/build.gradle`:

```groovy
apply plugin: "com.facebook.react"
```

## Configuration Options

All options are inside the `react { }` block:

```groovy
apply plugin: "com.facebook.react"

react {
  // Configuration options here
}
```

### Path Configuration

| Option | Default | Description |
|--------|---------|-------------|
| `root` | `..` | Root folder of RN project (where `package.json` lives) |
| `reactNativeDir` | `../node_modules/react-native` | Where `react-native` package lives. Adjust for monorepos |
| `codegenDir` | `../node_modules/react-native-codegen` | Where `react-native-codegen` package lives |
| `cliFile` | `../node_modules/react-native/cli.js` | Entrypoint file for RN CLI |

```groovy
react {
  root = file("../")
  reactNativeDir = file("../node_modules/react-native")
  codegenDir = file("../node_modules/@react-native/codegen")
  cliFile = file("../node_modules/react-native/cli.js")
}
```

### Build Configuration

| Option | Default | Description |
|--------|---------|-------------|
| `debuggableVariants` | `["debug"]` | Variants that are debuggable (won't ship a bundle, need Metro) |
| `nodeExecutableAndArgs` | `["node"]` | Node command and arguments for scripts |
| `bundleCommand` | `"bundle"` | Bundle command name (use `"ram-bundle"` for RAM bundles) |
| `bundleConfig` | — | Path to config file passed to `bundle --config <file>` |
| `bundleAssetName` | `"index.android.bundle"` | Name of generated bundle file |
| `hermesCommand` | — | Custom Hermes compiler command |
| `hermesFlags` | — | Custom Hermes compiler flags |
| `enableBundleCompression` | — | Enable bundle compression |

```groovy
react {
  debuggableVariants = ["liteDebug", "prodDebug"]
  nodeExecutableAndArgs = ["node"]
  bundleCommand = "ram-bundle"
  bundleConfig = file(../rn-cli.config.js)
  bundleAssetName = "MyApplication.android.bundle"
}
```

---

## Using Flavors & Build Variants

Android supports [custom flavors](https://developer.android.com/studio/build/build-variants) for different app versions (e.g., `full`, `lite`) and build types (`debug`, `staging`, `release`).

The combination generates build variants: `fullDebug`, `fullStaging`, `fullRelease`, `liteDebug`, etc.

### Configuring Debuggable Variants

If using custom variants beyond `debug` and `release`, instruct RNGP which are debuggable:

```groovy
react {
  debuggableVariants = ["fullStaging", "fullDebug"]
}
```

**Important:** Variants listed as `debuggableVariants` will NOT ship with a JS bundle — Metro must be running. You cannot publish these to a store.

---

## What the Plugin Does Under the Hood

1. **Creates tasks for each variant** — `createBundle<Variant>JsAndAssets`
2. **Handles JS bundling** — Bundles JS into assets for non-debuggable variants
3. **Integrates Hermes** — Compiles JS to bytecode if Hermes is enabled
4. **Manages Codegen** — Runs Codegen for New Architecture specs
5. **Handles asset copying** — Copies assets from JS to native Android resources
