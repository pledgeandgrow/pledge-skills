# webpack — Configuration

## Configuration Overview

webpack configuration is a JavaScript object exported from a `webpack.config.js` file. All available configuration options are documented below.

```javascript
export default {
  entry: "./src/index.js",
  output: { filename: "bundle.js", path: "./dist" },
  module: { rules: [] },
  resolve: { extensions: [".js", ".json"] },
  plugins: [],
  optimization: {},
  devtool: "source-map",
  devServer: {},
  target: "web",
  mode: "development",
  cache: { type: "filesystem" },
  experiments: {},
  stats: "normal",
  performance: { hints: "warning" },
  watch: false,
  context: __dirname,
};
```

## Entry and Context

### context

Base directory for resolving entry points and loaders. Default: `process.cwd()`.

```javascript
export default {
  context: path.resolve(__dirname, "app"),
  entry: "./index.js", // resolved relative to context
};
```

### entry

Entry point(s) for the dependency graph.

```javascript
// String
entry: "./src/index.js"

// Array (multiple files merged)
entry: ["./polyfills.js", "./src/index.js"]

// Object (multiple entries)
entry: {
  app: "./src/app.js",
  admin: "./src/admin.js",
}

// Entry descriptor
entry: {
  app: {
    import: "./src/app.js",
    dependOn: "shared",
    filename: "app.js",
    layer: "browser",
    runtime: "app",
    chunkLoading: "import",
    asyncChunks: true,
    publicPath: "/assets/",
  },
  shared: ["react", "react-dom"],
}

// Dynamic entry (function)
entry: () => new Promise((resolve) => resolve("./src/dynamic.js"))

// Multiple entries in different folders
entry: {
  pageA: "./src/pageA/index.js",
  pageB: "./src/pageB/index.js",
}
```

**Runtime chunk**: Use `runtime` to share runtime code between entries.

## Output

### output.filename

Name of the output bundle file.

```javascript
output: {
  filename: "bundle.js",
  // With placeholders
  filename: "[name].[contenthash].js",
  filename: "[name].[chunkhash].js",
  filename: "[name].[hash].js",
}
```

**Template strings**: `[name]`, `[hash]`, `[chunkhash]`, `[contenthash]`, `[fullhash]`, `[id]`, `[query]`, `[ext]`

### output.path

Absolute path to output directory. Default: `path.resolve(__dirname, "dist")`.

### output.publicPath

Public URL of the output files. Default: `auto`.

```javascript
output: {
  publicPath: "/assets/",
  publicPath: "https://cdn.example.com/",
  publicPath: "auto",
}
```

### output.clean

Clean the output directory before each build. Default: `false` in watch mode, `true` otherwise (v5.20+).

### output.assetModuleFilename

Filename for asset modules. Default: `[hash][ext][query]`.

### output.asyncChunks

Enable creating async chunks. Default: `true`.

### output.chunkFilename

Filename for non-initial chunks. Default: `[id].js` or `[id].[contenthash].js` (production).

### output.chunkFormat

Format of chunks: `array-push`, `commonjs`, `module`, `require`. Default: `array-push` (web).

### output.chunkLoadingGlobal

Global variable for chunk loading. Default: `webpackChunkwebpack`.

### output.chunkLoadTimeout

Chunk loading timeout in ms. Default: `120000`.

### output.crossOriginLoading

CORS setting for script tags: `false`, `"anonymous"`, `"use-credentials"`. Default: `false`.

### output.cssChunkFilename / output.cssFilename

Filenames for CSS chunks/files (experiments.css).

### output.devtoolFallbackModuleFilenameTemplate

Fallback filename template for devtool modules.

### output.devtoolModuleFilenameTemplate

Template for module names in source maps. Default: `"webpack://[namespace]/[resourcePath]"`.

### output.devtoolNamespace

Namespace for devtool module names.

### output.enabledChunkLoadingTypes / enabledLibraryTypes / enabledWasmLoadingTypes

Enabled chunk loading, library, and WASM loading types.

### output.environment

Options for the generated runtime environment.

```javascript
output: {
  environment: {
    arrowFunction: true,
    bigIntLiteral: false,
    const: true,
    destructuring: true,
    dynamicImport: true,
    forOf: true,
    module: false,
    optionalChaining: true,
    templateLiteral: true,
  },
}
```

### output.globalObject

Global object reference. Default: `"self"` for web, `"global"` for Node.

### output.hashFunction / hashDigest / hashDigestLength / hashSalt

Hash configuration for content hashing.

### output.iife

Wrap output in IIFE. Default: `true` in production.

### output.library

Expose the bundle as a library.

```javascript
output: {
  library: {
    name: "MyLibrary",
    type: "umd", // var, module, commonjs, commonjs2, amd, umd, jsonp, system, etc.
    export: "default",
    amdContainer: "define",
    auxiliaryComment: "Test Comment",
    umdNamedDefine: true,
  },
}
```

**Library types**: `var`, `module`, `commonjs`, `commonjs2`, `commonjs-module`, `amd`, `amd-require`, `umd`, `umd2`, `jsonp`, `system`, `this`, `window`, `global`, `assign`, `jsonp`, `import`, `require`.

### output.module

Enable ES module output. Default: `false`.

### output.pathinfo

Include path info in bundle. Default: `false` in production, `true` in development.

### output.scriptType

Script type for loading chunks: `false`, `"text/javascript"`, `"module"`.

### output.sourceMapFilename

Source map filename. Default: `"[file].map[query]"`.

### output.strictModuleExceptionHandling

Rethrow exceptions in modules. Default: `false`.

### output.strictModuleErrorHandling

Handle module errors strictly. Default: `false`.

### output.trustedTypes

Trusted Types policy configuration.

### output.uniqueName

Unique name for the webpack instance (for multiple webpack runtimes).

### output.wasmLoading

WASM loading method: `false`, `"fetch-streaming"`, `"fetch"`.

### output.workerChunkFilename / workerChunkLoading / workerPublicPath / workerWasmLoading

Worker-specific output options.

## Module

### module.defaultRules

Default rules for module processing (Asset Modules by default).

### module.generator

Generator options by module type.

```javascript
module: {
  generator: {
    asset: { filename: "assets/[hash][ext][query]" },
    "asset/inline": { dataUrl: { encoding: "base64" } },
    "asset/resource": { filename: "assets/[hash][ext][query]" },
    html: { exportsConvention: "blended", extract: false },
  },
}
```

### module.parser

Parser options by module type.

```javascript
module: {
  parser: {
    css: { namedExports: true, exportsConvention: "as-is", exportType: "es" },
    javascript: {
      url: "relative",
      importExportsPresence: "error",
      exportsPresence: "error",
      importDynamicPresence: "warn",
      commonjsMagicComments: true,
      worker: ["..."],
      parseExpression: false,
    },
    json: { namedExports: true, parse: "json", exportsDepth: Infinity },
    html: { attributes: { list: [], urlFilter: null, rel: null }, comments: false },
  },
}
```

### module.noParse

Regex or array of modules to skip parsing.

```javascript
module: {
  noParse: /jquery|lodash/,
  noParse: [/jquery/, /lodash/],
}
```

### module.unsafeCache

Cache module resolution. Default: `true` in development.

### module.rules

Array of rules for module processing.

```javascript
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      include: path.resolve(__dirname, "src"),
      use: [
        { loader: "babel-loader", options: { presets: ["@babel/preset-env"] } },
      ],
      type: "javascript/auto",
      enforce: "pre",
      sideEffects: false,
      issuer: /src/,
      resourceQuery: /inline/,
      oneOf: [/* nested rules */],
      rules: [/* nested rules */],
      parser: { /* parser options */ },
      generator: { /* generator options */ },
      resolve: { fullySpecified: false },
      layer: "browser",
      scheme: "data",
      mimetype: "application/json",
      compiler: "javascript",
      assert: { type: "json" },
      with: { type: "json" },
      extractSourceMap: true,
    },
  ],
}
```

**Rule conditions**: `test`, `include`, `exclude`, `resource`, `resourceQuery`, `issuer`, `issuerLayer`, `compiler`, `mimetype`, `scheme`, `with`, `assert`

**Rule results**: `loader`, `options`/`query`, `loaders`, `type`, `use`, `parser`, `generator`, `enforce`, `sideEffects`, `layer`, `oneOf`, `rules`, `resolve`

**Rule.type values**: `javascript/auto`, `javascript/esm`, `javascript/dynamic`, `json`, `css/auto`, `css/global`, `css/module`, `asset`, `asset/inline`, `asset/resource`, `asset/source`, `webassembly/async`, `webassembly/sync`, `html`

**UseEntry**:
```javascript
use: [
  "style-loader",
  { loader: "css-loader", options: { modules: true } },
  { loader: "postcss-loader", options: { postcssOptions: { plugins: [] } } },
]
```

## Resolve

### resolve.alias

Create aliases for module imports.

```javascript
resolve: {
  alias: {
    "@": path.resolve(__dirname, "src"),
    utilities: path.resolve(__dirname, "src/utilities/"),
    only$: "src/only-module.js", // exact match
    "react$": "react/dist/react.min.js",
  },
  aliasFields: ["browser"],
}
```

### resolve.byDependency

Resolve options per dependency type.

### resolve.cache / cachePredicate / cacheWithContext

Caching options for module resolution.

### resolve.conditionNames

Conditions for exports field resolution. Default: `["webpack", "development", "browser"]`.

### resolve.descriptionFiles

Files describing modules. Default: `["package.json"]`.

### resolve.enforceExtension

Require extensions in imports. Default: `false`.

### resolve.exportsFields / importsFields

Fields for exports/imports resolution. Default: `["exports"]` / `["imports"]`.

### resolve.extensionAlias

Alias extensions.

```javascript
resolve: {
  extensionAlias: {
    ".js": [".ts", ".js"],
    ".mjs": [".mts", ".mjs"],
  },
}
```

### resolve.extensions

File extensions to resolve. Default: `["...", ".js", ".json", ".wasm"]`.

### resolve.fallback

Fallback modules for when a module is not found.

### resolve.fullySpecified

Require fully specified import paths (including extension).

### resolve.mainFields

Fields in package.json for entry point. Default: `["browser", "module", "main"]`.

### resolve.mainFiles

Default files in directories. Default: `["index"]`.

### resolve.modules

Directories to search for modules. Default: `["node_modules"]`.

### resolve.plugins

Additional resolve plugins.

### resolve.preferAbsolute / preferRelative

Prefer absolute/relative resolution.

### resolve.restrictions

Resolve restrictions (allowed paths).

### resolve.roots

Root directories for absolute paths.

### resolve.symlinks

Resolve symlinks to their real location. Default: `true`.

### resolve.tsconfig

TypeScript config for path resolution.

```javascript
resolve: {
  tsconfig: {
    configFile: "tsconfig.json",
    references: "auto",
    extensions: [".ts"],
  },
}
```

### resolveLoader

Resolve options for loaders (same options as `resolve`).

## Plugins

```javascript
plugins: [
  new HtmlWebpackPlugin({ template: "./src/index.html" }),
  new webpack.DefinePlugin({ "process.env.NODE_ENV": '"production"' }),
  new webpack.ProvidePlugin({ $: "jquery", _: "lodash" }),
  new webpack.EnvironmentPlugin(["NODE_ENV", "DEBUG"]),
  new MiniCssExtractPlugin({ filename: "[name].css" }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|fr/),
  new webpack.IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),
  new webpack.BannerPlugin("Copyright 2024"),
  new webpack.SourceMapDevToolPlugin({ filename: "[file].map" }),
  new webpack.EvalSourceMapDevToolPlugin({}),
  new webpack.NormalModuleReplacementPlugin(/\.css$/, "css-loader"),
  new webpack.ProgressPlugin({}),
  new webpack.LimitChunkCountPlugin({ maxChunks: 5 }),
  new webpack.MinChunkSizePlugin({ minChunkSize: 10000 }),
  new webpack.DllPlugin({ name: "[name]", path: path.join(__dirname, "manifest.json") }),
  new CopyWebpackPlugin({ patterns: [{ from: "public", to: "dist" }] }),
  new CompressionWebpackPlugin({ algorithm: "gzip" }),
]
```

## Optimization

### optimization.checkWasmTypes

Check WASM types. Default: `true` in production.

### optimization.chunkIds

Chunk ID generation: `natural`, `named`, `deterministic`, `size`, `total-size`. Default: `deterministic` in production, `named` in development.

### optimization.concatenateModules

Module concatenation (scope hoisting). Default: `true` in production.

### optimization.emitOnErrors

Emit assets on errors. Default: `false` in production.

### optimization.avoidEntryIife

Avoid IIFE wrappers for entry chunks. Default: `true` in production.

### optimization.flagIncludedChunks

Flag chunks included in other chunks. Default: `true` in production.

### optimization.innerGraph

Analyze inner graph for tree shaking. Default: `true` in production.

### optimization.mangleExports

Mangle exports. Default: `deterministic` in production.

### optimization.mangleWasmImports

Mangle WASM imports. Default: `false`.

### optimization.mergeDuplicateChunks

Merge duplicate chunks. Default: `true`.

### optimization.minimize / minimizer

Enable minification and configure minimizers.

```javascript
optimization: {
  minimize: true,
  minimizer: [
    new TerserPlugin({ parallel: true, extractComments: false }),
    new CssMinimizerPlugin({}),
  ],
}
```

### optimization.moduleIds

Module ID generation: `natural`, `named`, `deterministic`, `size`, `hashed`. Default: `deterministic` in production.

### optimization.nodeEnv

Set `process.env.NODE_ENV`. Default: mode value.

### optimization.portableRecords

Portable records for multiple builds. Default: `false`.

### optimization.providedExports

Track provided exports for tree shaking. Default: `true` in production.

### optimization.realContentHash

Use real content hash. Default: `true` in production.

### optimization.removeAvailableModules / removeEmptyChunks

Remove available/empty modules. Default: `true` in production.

### optimization.runtimeChunk

Create runtime chunk(s).

```javascript
optimization: {
  runtimeChunk: "single", // or "multiple" or object
  runtimeChunk: { name: "runtime" },
}
```

### optimization.sideEffects

Use `sideEffects` in package.json for tree shaking. Default: `true` in production.

### optimization.splitChunks

Code splitting configuration.

```javascript
optimization: {
  splitChunks: {
    chunks: "all", // "async", "initial", "all"
    minSize: 20000,
    minRemainingSize: 0,
    minChunks: 1,
    maxAsyncRequests: 30,
    maxInitialRequests: 30,
    enforceSizeThreshold: 50000,
    cacheGroups: {
      defaultVendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        reuseExistingChunk: true,
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true,
      },
    },
    automaticNameDelimiter: "~",
    name: false,
  },
}
```

### optimization.usedExports

Track used exports for tree shaking. Default: `true` in production.

## Devtool

Source map configuration.

| Devtool | Build | Rebuild | Quality | Production |
|---------|-------|---------|---------|------------|
| `eval` | fastest | fastest | generated | no |
| `eval-cheap-source-map` | fast | fast | transformed | no |
| `eval-cheap-module-source-map` | medium | fast | original (lines) | no |
| `eval-source-map` | slow | slow | original | no |
| `cheap-source-map` | medium | medium | transformed | yes |
| `cheap-module-source-map` | slow | medium | original (lines) | yes |
| `source-map` | slow | slow | original | yes |
| `inline-source-map` | slow | slow | original | yes |
| `hidden-source-map` | slow | slow | original | yes |
| `nosources-source-map` | slow | slow | no sources | yes |
| `eval-nosources-source-map` | fast | fast | no sources | no |
| `inline-cheap-source-map` | medium | medium | transformed | yes |
| `inline-cheap-module-source-map` | slow | medium | original (lines) | yes |

**Development**: `eval-cheap-module-source-map` (best quality/speed balance)
**Production**: `source-map` or `hidden-source-map` (separate file, no reference)

## DevServer

```javascript
devServer: {
  static: {
    directory: path.join(__dirname, "dist"),
    publicPath: "/",
    watch: true,
    serveIndex: true,
  },
  compress: true,
  port: 8080,
  host: "localhost", // or "0.0.0.0", "local-ip", "local-ipv4", "local-ipv6"
  hot: true,
  liveReload: true,
  open: true,
  historyApiFallback: true,
  proxy: {
    "/api": {
      target: "http://localhost:3000",
      pathRewrite: { "^/api": "" },
      secure: false,
      changeOrigin: true,
    },
  },
  headers: { "X-Custom-Header": "yes" },
  client: {
    logging: "info",
    overlay: { errors: true, warnings: false },
    progress: true,
    reconnect: true,
    webSocketTransport: "ws",
    webSocketURL: { hostname: "localhost", port: 8080, pathname: "/ws", protocol: "ws" },
  },
  devMiddleware: { index: true, writeToDisk: false },
  allowedHosts: ["example.com", ".allowed.com"],
  bonjour: false,
  ipc: null,
  onListening: (devServer) => {},
  server: "http", // or "https", "spdy"
  setupExitSignals: true,
  setupMiddlewares: (middlewares, devServer) => middlewares,
  watchFiles: ["src/**/*.js"],
  webSocketServer: "ws",
}
```

**Usage via CLI**: `npx webpack serve`
**Usage via API**: `webpack({ config }, (err, stats) => {})`

## Target

Specify the target environment.

```javascript
target: "web", // default
target: "webworker",
target: "node",
target: "node16",
target: "async-node",
target: "electron-main",
target: "electron-renderer",
target: "es2020",
target: ["web", "es5"], // multiple targets
target: false, // no target (universal)
```

## Watch and WatchOptions

```javascript
watch: true,
watchOptions: {
  aggregateTimeout: 200, // delay before rebuild (ms)
  ignored: /node_modules/,
  poll: 1000, // polling interval (ms), or true for default
  followSymlinks: true,
  stdin: true, // stop watching when stdin ends
},
```

**Troubleshooting**:
- Changes seen but not processed — check `aggregateTimeout`
- Not enough watchers — increase OS watcher limit (`fs.inotify.max_user_watches`)
- macOS fsevents bug — use polling
- Windows paths — use forward slashes
- Vim — set `backupcopy=yes`
- WebStorm — disable safe write

## Cache

```javascript
cache: {
  type: "memory", // or "filesystem"
  // For filesystem cache:
  cacheDirectory: path.resolve(__dirname, ".cache/webpack"),
  cacheLocation: path.resolve(__dirname, ".cache/webpack"),
  buildDependencies: { config: [__filename] },
  managedPaths: [path.resolve(__dirname, "node_modules")],
  immutablePaths: [],
  maxAge: 5184000000, // 60 days in ms
  maxGenerations: 1,
  maxMemoryGenerations: 5,
  compression: "gzip", // or "brotli", false
  hashAlgorithm: "md4",
  idleTimeout: 60000,
  idleTimeoutAfterLargeChanges: 1000,
  idleTimeoutForInitialStore: 5000,
  name: "my-cache",
  profile: false,
  readonly: false,
  store: "pack",
  version: "",
  allowCollectingMemory: true,
  cacheUnaffected: false,
  memoryCacheUnaffected: false,
}
```

**CI/CD cache setup**:
- **GitLab CI/CD**: Use `cache` key with `.cache/webpack` path
- **GitHub Actions**: Use `actions/cache` with `.cache/webpack` path

## Experiments

Experimental features (may change).

```javascript
experiments: {
  backCompat: true,
  buildHttp: { allowedUris: ["https://example.com/"], cacheLocation: false, freeze: false, lockfileLocation: null },
  cacheUnaffected: false,
  deferImport: false,
  sourceImport: false,
  futureDefaults: false,
  lazyCompilation: { imports: true, entries: false, test: undefined },
  outputModule: false, // ESM output
  css: false, // Native CSS support
  html: false, // Native HTML support
  typescript: { name: "..." }, // Native TypeScript support
}
```

## Stats

Statistics output configuration.

**Stats presets**: `"none"`, `"errors-only"`, `"minimal"`, `"normal"`, `"detailed"`, `"errors-warnings"`, `"verbose"`, `"summary"`

```javascript
stats: {
  all: undefined,
  assets: true,
  assetsSort: "size",
  assetsSpace: 15,
  builtAt: true,
  cached: false,
  cachedAssets: false,
  cachedModules: false,
  children: true,
  chunkGroups: true,
  chunkModules: true,
  chunkModulesSpace: 10,
  chunkOrigins: false,
  chunkRelations: false,
  chunks: true,
  chunksSort: "id",
  colors: true,
  context: "../src/",
  dependentModules: false,
  depth: false,
  entrypoints: true,
  env: true,
  errorCause: false,
  errorDetails: true,
  errorErrors: undefined,
  errorStack: false,
  errors: true,
  errorsCount: true,
  errorsSpace: 5,
  exclude: false,
  excludeAssets: [],
  excludeModules: false,
  groupAssetsByChunk: true,
  groupAssetsByEmitStatus: false,
  groupAssetsByExtension: true,
  groupAssetsByInfo: false,
  groupAssetsByPath: false,
  groupModulesByAttributes: false,
  groupModulesByCacheStatus: false,
  groupModulesByExtension: false,
  groupModulesByLayer: false,
  groupModulesByPath: false,
  groupModulesByType: false,
  groupReasonsByOrigin: false,
  hash: true,
  ids: false,
  logging: "info",
  loggingDebug: [],
  loggingTrace: false,
  moduleAssets: true,
  moduleTrace: true,
  modules: true,
  modulesSort: "id",
  modulesSpace: 15,
  nestedModules: false,
  nestedModulesSpace: 10,
  optimizationBailout: false,
  orphanModules: false,
  outputPath: true,
  performance: true,
  preset: "normal",
  providedExports: false,
  publicPath: true,
  reasons: false,
  reasonsSpace: 15,
  relatedAssets: false,
  runtimeModules: true,
  source: false,
  timings: true,
  usedExports: false,
  version: true,
  warnings: true,
  warningsCount: true,
  warningsFilter: [],
  warningsSpace: 5,
}
```

## Performance

Performance hints for asset sizes.

```javascript
performance: {
  hints: "warning", // or "error" or false
  maxAssetSize: 250000, // 250kb
  maxEntrypointSize: 250000,
  assetFilter: (assetFilename) => !assetFilename.endsWith(".map"),
}
```

## Mode

```javascript
mode: "development", // or "production" or "none"
```

**Mode: development** — `eval` devtool, named module IDs, no minification, `NODE_ENV=development`
**Mode: production** — deterministic IDs, minification, `NODE_ENV=production`
**Mode: none** — no optimizations, no `NODE_ENV`

## Other Options

### amd

AMD module configuration.

### bail

Fail on first error. Default: `false`.

### dependencies

Array of dependencies that should not be resolved.

### ignoreWarnings

Array of warnings to ignore.

```javascript
ignoreWarnings: [
  /Failed to parse source map/,
  { module: /node_modules\/some-module/ },
]
```

### loader

Custom loader configuration.

### name

Configuration name (for multiple configs).

### parallelism

Maximum parallel processes. Default: `os.cpus().length - 1`.

### profile

Capture timing information. Default: `false`.

### recordsInputPath / recordsOutputPath / recordsPath

Records file paths for tracking build state across runs.

### snapshot

Snapshot configuration for incremental builds.

```javascript
snapshot: {
  buildDependencies: { hash: true, timestamp: true },
  immutablePaths: [],
  managedPaths: [],
  unmanagedPaths: [],
  module: { hash: true, timestamp: true },
  contextModule: { hash: true, timestamp: true },
  resolve: { hash: true, timestamp: true },
  resolveBuildDependencies: { hash: true, timestamp: true },
}
```

**Source**: [Configuration](https://webpack.js.org/configuration/) | [Entry & Context](https://webpack.js.org/configuration/entry-context/) | [Output](https://webpack.js.org/configuration/output/) | [Module](https://webpack.js.org/configuration/module/) | [Resolve](https://webpack.js.org/configuration/resolve/) | [Plugins](https://webpack.js.org/configuration/plugins/) | [Optimization](https://webpack.js.org/configuration/optimization/) | [Devtool](https://webpack.js.org/configuration/devtool/) | [DevServer](https://webpack.js.org/configuration/dev-server/) | [Target](https://webpack.js.org/configuration/target/) | [Watch](https://webpack.js.org/configuration/watch/) | [Cache](https://webpack.js.org/configuration/cache/) | [Experiments](https://webpack.js.org/configuration/experiments/) | [Stats](https://webpack.js.org/configuration/stats/) | [Performance](https://webpack.js.org/configuration/performance/) | [Mode](https://webpack.js.org/configuration/mode/) | [Other Options](https://webpack.js.org/configuration/other-options/)
