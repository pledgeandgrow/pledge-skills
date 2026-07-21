# Rolldown — API Reference

> Source: [Options & APIs Reference](https://rolldown.rs/reference) | [Bundler API](https://rolldown.rs/apis/bundler-api) | [Plugin API](https://rolldown.rs/apis/plugin-api) | [CLI](https://rolldown.rs/apis/cli) | [Builtin Plugins](https://rolldown.rs/builtin-plugins/)

## Input Options

All options for the input/resolve/transform phase of the bundling process.

| Option | Description |
|--------|-------------|
| `checks` | Enable additional checks for potential issues |
| `context` | Top-level `this` context for ESM modules |
| `cwd` | Current working directory for resolving relative paths |
| `devtools` | Devtools configuration |
| `experimental` | Enable experimental features |
| `external` | Mark modules as external (string, RegExp, array, or function) |
| `input` | Entry point(s) — string, string array, or object with entry names |
| `logLevel` | Logging level: `'silent'`, `'warn'`, `'info'`, `'debug'` |
| `makeAbsoluteExternalsRelative` | Control whether absolute external paths are made relative |
| `moduleTypes` | Map file extensions to module types (experimental) |
| `onLog` | Custom log handler |
| `onwarn` | Custom warning handler (deprecated, use `onLog`) |
| `optimization` | Optimization options |
| `platform` | Platform preset: `'browser'`, `'node'`, `'neutral'` |
| `plugins` | Array of Rollup-compatible plugins |
| `preserveEntrySignatures` | Control whether entry chunks preserve their export signatures |
| `resolve` | Module resolution configuration (powered by oxc-resolver) |
| `shimMissingExports` | Create shim exports for missing exports instead of erroring |
| `transform` | Transform configuration (TypeScript, JSX, define, inject, syntax lowering) |
| `treeshake` | Tree-shaking configuration |
| `tsconfig` | Path to tsconfig.json for path resolution and TS transform config |
| `watch` | Watch mode configuration |

See: [Input Options](https://rolldown.rs/reference/InputOptions.checks)

## Output Options

All options for the output/generation phase.

| Option | Description |
|--------|-------------|
| `advancedChunks` | Advanced chunk splitting configuration |
| `assetFileNames` | Naming pattern for emitted assets |
| `banner` | String or function to prepend to bundle |
| `chunkFileNames` | Naming pattern for emitted chunks |
| `cleanDir` | Clean output directory before writing |
| `codeSplitting` | Manual code splitting configuration |
| `comments` | Control comment preservation |
| `dir` | Output directory (required for code splitting) |
| `dynamicImportInCjs` | Allow `import()` in CJS output |
| `entryFileNames` | Naming pattern for entry chunks |
| `esModule` | Control `__esModule` interop marker |
| `exports` | Export mode: `'default'`, `'named'`, `'none'`, `'auto'` |
| `extend` | Extend global exports instead of overwriting |
| `externalLiveBindings` | Use live bindings for external imports |
| `file` | Output file (single chunk only, not with code splitting) |
| `footer` | String or function to append to bundle |
| `format` | Output format: `'esm'`, `'cjs'`, `'iife'`, `'umd'`, `'app'` |
| `generatedCode` | Generated code options (`es5`, `es2015`, `es2017`) |
| `globals` | Global variable names for UMD/IIFE external modules |
| `hashCharacters` | Character set for content hashes: `'base64'`, `'base36'`, `'hex'` |
| `inlineDynamicImports` | Inline dynamic imports into single chunk |
| `intro` | String or function to prepend inside bundle wrapper |
| `keepNames` | Preserve original function/class names after minification |
| `legalComments` | Placement of legal comments: `'none'`, `'inline'`, `'eof'`, `'linked'` |
| `manualChunks` | Manual chunk configuration (Rollup-compatible) |
| `minify` | Enable minification (powered by Oxc Minifier) |
| `minifyInternalExports` | Minify internal export names |
| `name` | Bundle name (for UMD/IIFE) |
| `outro` | String or function to append inside bundle wrapper |
| `paths` | Map external module IDs to output paths |
| `plugins` | Output-specific plugins |
| `polyfillRequire` | Polyfill `require` in ESM output |
| `postBanner` | String or function after banner |
| `postFooter` | String or function before footer |
| `preserveModules` | Preserve module structure instead of bundling |
| `preserveModulesRoot` | Root directory for preserved modules |
| `sanitizeFileName` | Sanitize output file names |
| `sourcemap` | Source map generation: `true`, `false`, `'inline'`, `'hidden'` |
| `sourcemapBaseUrl` | Base URL for source map sources |
| `sourcemapDebugIds` | Generate source map debug IDs |
| `sourcemapExcludeSources` | Exclude source content from source maps |
| `sourcemapFileNames` | Naming pattern for source map files |
| `sourcemapIgnoreList` | Predicate for ignoring sources in source map |
| `sourcemapPathTransform` | Transform source map source paths |
| `strict` | Strict mode for generated code |
| `strictExecutionOrder` | Enforce strict execution order |
| `topLevelVar` | Use `var` instead of `const`/`let` at top level |
| `virtualDirname` | Name of virtual directory for preserved modules |

See: [Output Options](https://rolldown.rs/reference/OutputOptions.advancedChunks)

## Programmatic APIs

### rolldown()

Rollup-compatible API. Returns a `RolldownBuild` instance.

```javascript
import { rolldown } from 'rolldown';

const bundle = await rolldown({
  input: 'src/main.js',
});

// Generate in memory
const { output } = await bundle.generate({ format: 'esm' });

// Write to disk
await bundle.write({ file: 'dist/bundle.js' });

// Clean up
await bundle.close();
```

### build() (Experimental)

Simplified API similar to esbuild's `build`. Bundles and writes in a single call.

```javascript
import { build } from 'rolldown';

const result = await build({
  input: 'src/main.js',
  output: { file: 'bundle.js' },
});
```

### watch()

Rollup-compatible watch API.

```javascript
import { watch } from 'rolldown';

const watcher = watch({ /* options */ });
watcher.on('event', (event) => {
  if (event.code === 'BUNDLE_END') {
    console.log(event.duration);
    event.result.close();
  }
});
await watcher.close(); // Returns a promise (different from Rollup)
```

### Interfaces

| Interface | Description |
|-----------|-------------|
| `RolldownBuild` | Result of `rolldown()` — has `generate()`, `write()`, `close()` |
| `RolldownOutput` | Result of `generate()` or `write()` — contains `output` array |
| `RolldownWatcher` | Result of `watch()` — has `on()`, `close()` |
| `WatchOptions` | Options for `watch()` |
| `BuildOptions` | Options for `build()` (same as `RolldownOptions`) |

See: [Programmatic APIs](https://rolldown.rs/reference/Function.rolldown)

## Plugin API

### Overview

Rolldown's plugin API is identical to Rollup's. Plugins are objects with a `name` property and various hook functions.

```javascript
const myPlugin = {
  name: 'my-plugin',
  resolveId(source, importer) {
    // Custom resolution logic
  },
  load(id) {
    // Provide module content
  },
  transform(code, id) {
    // Transform module content
    return { code: transformedCode };
  },
};
```

### Conventions

**Virtual Modules**: Use `\0` prefix for virtual module IDs to prevent other plugins from trying to resolve them.

### Build Hooks

Run during the build phase — locating, providing, and transforming input files.

| Hook | Description |
|------|-------------|
| `options` | Replace or manipulate input options (first hook) |
| `buildStart` | Called before each build, can read options |
| `resolveId` | Custom module resolution |
| `resolveDynamicImport` | Custom dynamic import resolution |
| `load` | Provide module content |
| `transform` | Transform module content |
| `moduleParsed` | Called after module is parsed |
| `buildEnd` | Called after build completes (last hook) |

**Unsupported hooks** (supported by Rollup but not Rolldown):
- `shouldTransformCachedModule` ([#4389](https://github.com/rolldown/rolldown/issues/4389))

### Output Generation Hooks

| Hook | Description |
|------|-------------|
| `outputOptions` | Replace or manipulate output options |
| `renderStart` | Called before output generation |
| `renderChunk` | Transform chunk code |
| `generateBundle` | Modify bundle before writing |
| `writeBundle` | Called after bundle is written |
| `closeBundle` | Called when bundle is closed |
| `banner`/`footer`/`intro`/`outro` | Add text to bundle |

### Watch Mode Hooks

| Hook | Description |
|------|-------------|
| `watchChange` | Called when a file changes in watch mode |
| `closeWatcher` | Called when watcher is closed |

### Plugin Context

The `this` context in plugin hooks provides:

- `this.parse(code)` — Parse code into AST
- `this.resolve(source, importer)` — Resolve a module specifier
- `this.load({ id })` — Load a module
- `this.emitFile(emittedFile)` — Emit an asset or chunk
- `this.getModuleInfo(id)` — Get info about a module
- `this.warn(message)` — Emit a warning
- `this.error(message)` — Emit an error
- `this.meta` — Plugin context metadata (rollupVersion, watchMode)

### Notable Differences from Rollup

**Output Generation Handling**:
- `outputOptions` hook is called before build hooks (Rollup calls after)
- Build hooks are called for each output separately (Rollup calls once for all)
- `closeBundle` is called only after `generate()` or `write()` (Rollup calls regardless)

**Watch Mode Hook Behavior**:
- `options` hook is called once when watcher is created (Rollup calls on every rebuild)

**Sequential Hook Execution**:
- `writeBundle` hook is sequential by default (Rollup requires `sequential: true`)

See: [Plugin API](https://rolldown.rs/apis/plugin-api)

## Plugin Hook Filters

Hook filters allow plugins to declare which modules they care about. Filters are checked in Rust, avoiding unnecessary JS-Rust boundary crossings.

### Basic Usage

```javascript
const myPlugin = {
  name: 'my-plugin',
  transform: {
    filter: {
      moduleType: 'asset/svg',
    },
    handler(code, id) {
      // Only runs for SVG modules
    },
  },
};
```

### Filter Properties

| Property | Description |
|----------|-------------|
| `id` | Filter by module ID |
| `moduleType` | Filter by module type |
| `code` | Filter by module code content |
| `importerId` | Filter by importer module ID |
| `include` | Include modules matching pattern |
| `exclude` | Exclude modules matching pattern |
| `query` | Filter by URL query parameters |
| `queries` | Filter by multiple query parameters |

### Composable Filter Functions

```javascript
import { and, or, not, include, exclude, prefixRegex, exactRegex } from 'rolldown';

// Combine filters
filter: and(
  include(/\.svg$/),
  exclude(/node_modules/)
)

// Regex filters
filter: prefixRegex('src/components/')
filter: exactRegex(/\.svg$/)
```

### Available Filter Functions

`and()`, `or()`, `not()`, `include()`, `exclude()`, `prefixRegex()`, `exactRegex()`, `code()`, `id()`, `moduleType()`, `importerId()`, `query()`, `queries()`

### Interoperability

**Supporting Older Versions**: Use `withFilter()` to add filters conditionally:

```javascript
import { withFilter } from 'rolldown';

const plugin = withFilter(myPlugin, { moduleType: 'asset/svg' });
```

See: [Hook Filters](https://rolldown.rs/apis/plugin-api/hook-filters)

## File URLs

Plugins can reference files using `this.emitFile()` and resolve file URLs using `this.getFileName()` or `import.meta.ROLLUP_FILE_URL_*` references.

See: [File URLs](https://rolldown.rs/apis/plugin-api/file-urls)

## Source Code Transformations

When a plugin transforms source code, it should generate a sourcemap automatically (unless `sourceMap: false`).

```javascript
// With sourcemap
return { code: transformedCode, map: generatedMap };

// Empty sourcemap (no meaningful mapping)
return { code: transformedCode, map: { mappings: '' } };

// Preserve existing sourcemap (no code movement)
return { code: transformedCode, map: null };
```

Rolldown only cares about the `mappings` property — everything else is handled automatically. Use [magic-string](https://github.com/Rich-Harris/magic-string) for elementary transformations.

See: [Source Code Transformations](https://rolldown.rs/apis/plugin-api/transformations)

## Inter-Plugin Communication

### Custom Resolver Options

Plugins can pass options to other plugins via `resolveId`:

```javascript
resolveId(source, importer, options) {
  // options.custom can be read by other plugins
  this.resolve(source, importer, { custom: { myPlugin: { ... } } });
}
```

### Custom Module Meta-Data

Plugins can attach meta-data to modules via `meta`:

```javascript
load(id) {
  return { code: '...', meta: { myPlugin: { custom: 'data' } } };
}
```

### Direct Plugin Communication

Plugins can expose methods and call methods on other plugins:

```javascript
const pluginA = {
  name: 'plugin-a',
  api: { doSomething() { return 'hello'; } },
};

const pluginB = {
  name: 'plugin-b',
  buildStart() {
    const api = this.getPluginByName('plugin-a')?.api;
    if (api) api.doSomething();
  },
};
```

### Descriptive Metadata

**Module descriptions**: Use `meta` to share information about modules between plugins.

**Plugin metadata**: Use `this.meta` to access plugin context metadata.

See: [Inter-plugin Communication](https://rolldown.rs/apis/plugin-api/inter-plugin-communication)

## Command Line Interface

### Configuration Files

Rolldown looks for config files with these names (in order):
- `rolldown.config.{js,cjs,mjs,ts,mts,cts}`

**Config Loaders**:
- `bundle` (default): Bundle the config with Rolldown before importing
- `native`: Import directly, relying on runtime for TypeScript and loader support

**Config Intellisense**: Use `defineConfig()` for type hints and auto-completion.

**Configuration Arrays**: Export an array of configs for multiple builds.

### Command Line Flags

| Flag | Description |
|------|-------------|
| `-c, --config <filename>` | Use specified config file |
| `--configLoader <loader>` | How to load config: `bundle` or `native` |
| `-h, --help` | Show help message |
| `-v, --version` | Show version number |
| `-w, --watch` | Watch mode (rebuild on file changes) |
| `--environment <values>` | Pass settings to config via `process.env` |
| `--input <filename>` | Entry point |
| `--output <filename>` | Output file |
| `--format <format>` | Output format: `esm`, `cjs`, `iife`, `umd` |
| `--minify` / `-m` | Enable minification |
| `--sourcemap` | Enable source maps |
| `--platform <platform>` | Platform preset |
| `--external <id>` | Mark modules as external |
| `--treeshake` | Enable tree-shaking (use `--no-treeshake` to disable) |

**Disabling boolean flags**: Prefix with `--no-` (e.g., `--no-minify`, `--no-codeSplitting`). Passing `false` as value is not supported.

**Object flags**: Use dot-notation for nested fields (e.g., `--codeSplitting.minSize 30000`).

**Environment variables**: `ROLLDOWN_WATCH` and `ROLLUP_WATCH` are set to `true` in watch mode.

See: [CLI](https://rolldown.rs/apis/cli)

## Builtin Plugins

Rust-implemented plugins for common use cases.

### builtin:bundle-analyzer

Analyzes bundle contents and generates reports.

```javascript
import { bundleAnalyzerPlugin } from 'rolldown/experimental';

export default defineConfig({
  plugins: [
    bundleAnalyzerPlugin({
      fileName: 'bundle-analysis.json',
      format: 'json', // 'json' | 'markdown'
    }),
  ],
});
```

**Options**:
- `fileName`: Output file name
- `format`: `'json'` or `'markdown'`

**JSON Format**: Detailed bundle statistics with module sizes, chunk info, and dependency graph.

**Markdown Format**: Human-readable report with optimization suggestions, suitable for piping into LLMs.

See: [bundle-analyzer](https://rolldown.rs/builtin-plugins/bundle-analyzer)

### builtin:esm-external-require

Handles `require()` of external modules in ESM output.

```javascript
import { esmExternalRequirePlugin } from 'rolldown/experimental';

export default defineConfig({
  plugins: [
    esmExternalRequirePlugin({
      external: ['fs', 'path'],
      skipDuplicateCheck: false,
    }),
  ],
});
```

**Options**:
- `external`: Array of module IDs to treat as external
- `skipDuplicateCheck`: Skip checking for duplicate externals

**Why needed**: ESM output with `require()` calls for external modules needs special handling to ensure correct interop.

See: [esm-external-require](https://rolldown.rs/builtin-plugins/esm-external-require)

### builtin:replace

String-based replacement (complements AST-based `transform.define`).

```javascript
import { replacePlugin } from 'rolldown/experimental';

export default defineConfig({
  plugins: [
    replacePlugin({
      values: {
        'process.env.NODE_ENV': '"production"',
        __VERSION__: '"1.0.0"',
      },
      delimiters: ['\\b', '\\b'],
      preventAssignment: false,
      objectGuards: false,
      sourcemap: true,
    }),
  ],
});
```

**Options**:
- `values`: Key-value pairs for replacement
- `delimiters`: Regex delimiters for matching (default: `['\\b', '\\b']`)
- `preventAssignment`: Prevent replacing assignment targets
- `objectGuards`: Prevent replacing object property access
- `sourcemap`: Generate source maps for replacements

**Important Notes**:
- **Replacement Order**: Values are replaced in order of insertion
- **Word Boundaries**: Default delimiters use word boundaries to avoid partial matches

**Migration from `@rollup/plugin-replace`**:

| Feature | `@rollup/plugin-replace` | `replacePlugin` |
|---------|--------------------------|-----------------|
| Replacement method | String-based | String-based |
| AST-based | No | No (use `transform.define` for AST-based) |
| Delimiters | Configurable | Configurable |
| Source maps | Yes | Yes |
| Performance | JS | Rust (faster) |

See: [replace](https://rolldown.rs/builtin-plugins/replace)

## Config

### defineConfig()

Helper for config intellisense. Returns options as-is.

```javascript
import { defineConfig } from 'rolldown';

export default defineConfig({
  input: 'src/main.js',
  output: { file: 'bundle.js' },
});
```

### loadConfig()

Load and resolve a config file programmatically.

### getLogFilter()

Utility for creating log filters.

### withFilter()

Add hook filters to a plugin conditionally.

## Utilities

| Utility | Description |
|----------|-------------|
| `parse(code, options)` | Parse JavaScript/TypeScript code into AST |
| `parseSync(code, options)` | Synchronous parse |
| `parseAst(code)` | Parse AST (synchronous) |
| `parseAstAsync(code)` | Parse AST (asynchronous) |
| `transform(code, options)` | Transform code (TypeScript, JSX, syntax lowering) |
| `transformSync(code, options)` | Synchronous transform |
| `minify(code, options)` | Minify JavaScript code |
| `minifySync(code, options)` | Synchronous minify |
| `Visitor` | AST visitor class for traversing and modifying AST nodes |
| `TsconfigCache` | Cache for tsconfig.json parsing |

See: [Utilities](https://rolldown.rs/reference/Class.Visitor)

## Rust Crates

Rolldown is also available as a Rust crate on [crates.io](https://crates.io/crates/rolldown).

**Maintenance Policy**:
- Crates do not follow semver — breaking changes may be introduced in any version
- No documentation provided for crates
- Issues affecting only Rust crates will not be worked on by the team (PRs accepted)

The JS package is the primary focus.

See: [Rust Crates](https://rolldown.rs/apis/rust-crates)

## Reference URL Index

Every individual reference page on [rolldown.rs/reference](https://rolldown.rs/reference):

### Input Options

- [checks](https://rolldown.rs/reference/InputOptions.checks) | [context](https://rolldown.rs/reference/InputOptions.context) | [cwd](https://rolldown.rs/reference/InputOptions.cwd) | [devtools](https://rolldown.rs/reference/InputOptions.devtools) | [experimental](https://rolldown.rs/reference/InputOptions.experimental) | [external](https://rolldown.rs/reference/InputOptions.external) | [input](https://rolldown.rs/reference/InputOptions.input) | [logLevel](https://rolldown.rs/reference/InputOptions.logLevel) | [makeAbsoluteExternalsRelative](https://rolldown.rs/reference/InputOptions.makeAbsoluteExternalsRelative) | [moduleTypes](https://rolldown.rs/reference/InputOptions.moduleTypes) | [onLog](https://rolldown.rs/reference/InputOptions.onLog) | [onwarn](https://rolldown.rs/reference/InputOptions.onwarn) | [optimization](https://rolldown.rs/reference/InputOptions.optimization) | [platform](https://rolldown.rs/reference/InputOptions.platform) | [plugins](https://rolldown.rs/reference/InputOptions.plugins) | [preserveEntrySignatures](https://rolldown.rs/reference/InputOptions.preserveEntrySignatures) | [resolve](https://rolldown.rs/reference/InputOptions.resolve) | [shimMissingExports](https://rolldown.rs/reference/InputOptions.shimMissingExports) | [transform](https://rolldown.rs/reference/InputOptions.transform) | [treeshake](https://rolldown.rs/reference/InputOptions.treeshake) | [tsconfig](https://rolldown.rs/reference/InputOptions.tsconfig) | [watch](https://rolldown.rs/reference/InputOptions.watch)

### Output Options

- [advancedChunks](https://rolldown.rs/reference/OutputOptions.advancedChunks) | [assetFileNames](https://rolldown.rs/reference/OutputOptions.assetFileNames) | [banner](https://rolldown.rs/reference/OutputOptions.banner) | [chunkFileNames](https://rolldown.rs/reference/OutputOptions.chunkFileNames) | [cleanDir](https://rolldown.rs/reference/OutputOptions.cleanDir) | [codeSplitting](https://rolldown.rs/reference/OutputOptions.codeSplitting) | [comments](https://rolldown.rs/reference/OutputOptions.comments) | [dir](https://rolldown.rs/reference/OutputOptions.dir) | [dynamicImportInCjs](https://rolldown.rs/reference/OutputOptions.dynamicImportInCjs) | [entryFileNames](https://rolldown.rs/reference/OutputOptions.entryFileNames) | [esModule](https://rolldown.rs/reference/OutputOptions.esModule) | [exports](https://rolldown.rs/reference/OutputOptions.exports) | [extend](https://rolldown.rs/reference/OutputOptions.extend) | [externalLiveBindings](https://rolldown.rs/reference/OutputOptions.externalLiveBindings) | [file](https://rolldown.rs/reference/OutputOptions.file) | [footer](https://rolldown.rs/reference/OutputOptions.footer) | [format](https://rolldown.rs/reference/OutputOptions.format) | [generatedCode](https://rolldown.rs/reference/OutputOptions.generatedCode) | [globals](https://rolldown.rs/reference/OutputOptions.globals) | [hashCharacters](https://rolldown.rs/reference/OutputOptions.hashCharacters) | [inlineDynamicImports](https://rolldown.rs/reference/OutputOptions.inlineDynamicImports) | [intro](https://rolldown.rs/reference/OutputOptions.intro) | [keepNames](https://rolldown.rs/reference/OutputOptions.keepNames) | [legalComments](https://rolldown.rs/reference/OutputOptions.legalComments) | [manualChunks](https://rolldown.rs/reference/OutputOptions.manualChunks) | [minify](https://rolldown.rs/reference/OutputOptions.minify) | [minifyInternalExports](https://rolldown.rs/reference/OutputOptions.minifyInternalExports) | [name](https://rolldown.rs/reference/OutputOptions.name) | [outro](https://rolldown.rs/reference/OutputOptions.outro) | [paths](https://rolldown.rs/reference/OutputOptions.paths) | [plugins](https://rolldown.rs/reference/OutputOptions.plugins) | [polyfillRequire](https://rolldown.rs/reference/OutputOptions.polyfillRequire) | [postBanner](https://rolldown.rs/reference/OutputOptions.postBanner) | [postFooter](https://rolldown.rs/reference/OutputOptions.postFooter) | [preserveModules](https://rolldown.rs/reference/OutputOptions.preserveModules) | [preserveModulesRoot](https://rolldown.rs/reference/OutputOptions.preserveModulesRoot) | [sanitizeFileName](https://rolldown.rs/reference/OutputOptions.sanitizeFileName) | [sourcemap](https://rolldown.rs/reference/OutputOptions.sourcemap) | [sourcemapBaseUrl](https://rolldown.rs/reference/OutputOptions.sourcemapBaseUrl) | [sourcemapDebugIds](https://rolldown.rs/reference/OutputOptions.sourcemapDebugIds) | [sourcemapExcludeSources](https://rolldown.rs/reference/OutputOptions.sourcemapExcludeSources) | [sourcemapFileNames](https://rolldown.rs/reference/OutputOptions.sourcemapFileNames) | [sourcemapIgnoreList](https://rolldown.rs/reference/OutputOptions.sourcemapIgnoreList) | [sourcemapPathTransform](https://rolldown.rs/reference/OutputOptions.sourcemapPathTransform) | [strict](https://rolldown.rs/reference/OutputOptions.strict) | [strictExecutionOrder](https://rolldown.rs/reference/OutputOptions.strictExecutionOrder) | [topLevelVar](https://rolldown.rs/reference/OutputOptions.topLevelVar) | [virtualDirname](https://rolldown.rs/reference/OutputOptions.virtualDirname)

### Programmatic APIs

- [rolldown](https://rolldown.rs/reference/Function.rolldown) | [build](https://rolldown.rs/reference/Function.build) | [watch](https://rolldown.rs/reference/Function.watch)

### Interfaces

- [RolldownBuild](https://rolldown.rs/reference/Interface.RolldownBuild) | [RolldownOutput](https://rolldown.rs/reference/Interface.RolldownOutput) | [RolldownWatcher](https://rolldown.rs/reference/Interface.RolldownWatcher) | [WatchOptions](https://rolldown.rs/reference/Interface.WatchOptions) | [Plugin](https://rolldown.rs/reference/Interface.Plugin) | [PluginContext](https://rolldown.rs/reference/Interface.PluginContext) | [PluginContextMeta](https://rolldown.rs/reference/Interface.PluginContextMeta) | [PluginContextResolveOptions](https://rolldown.rs/reference/Interface.PluginContextResolveOptions) | [PluginMeta](https://rolldown.rs/reference/Interface.PluginMeta) | [MinimalPluginContext](https://rolldown.rs/reference/Interface.MinimalPluginContext) | [FunctionPluginHooks](https://rolldown.rs/reference/Interface.FunctionPluginHooks) | [HookFilter](https://rolldown.rs/reference/Interface.HookFilter) | [CustomPluginOptions](https://rolldown.rs/reference/Interface.CustomPluginOptions) | [ModuleInfo](https://rolldown.rs/reference/Interface.ModuleInfo) | [ModuleOptions](https://rolldown.rs/reference/Interface.ModuleOptions) | [NormalizedInputOptions](https://rolldown.rs/reference/Interface.NormalizedInputOptions) | [NormalizedOutputOptions](https://rolldown.rs/reference/Interface.NormalizedOutputOptions) | [OutputAsset](https://rolldown.rs/reference/Interface.OutputAsset) | [OutputBundle](https://rolldown.rs/reference/Interface.OutputBundle) | [OutputChunk](https://rolldown.rs/reference/Interface.OutputChunk) | [PartialResolvedId](https://rolldown.rs/reference/Interface.PartialResolvedId) | [PreRenderedAsset](https://rolldown.rs/reference/Interface.PreRenderedAsset) | [RenderedChunk](https://rolldown.rs/reference/Interface.RenderedChunk) | [RenderedModule](https://rolldown.rs/reference/Interface.RenderedModule) | [ResolvedId](https://rolldown.rs/reference/Interface.ResolvedId) | [ResolveFileUrlArgs](https://rolldown.rs/reference/Interface.ResolveFileUrlArgs) | [RolldownError](https://rolldown.rs/reference/Interface.RolldownError) | [RolldownFsModule](https://rolldown.rs/reference/Interface.RolldownFsModule) | [SourceDescription](https://rolldown.rs/reference/Interface.SourceDescription) | [SourceMap](https://rolldown.rs/reference/Interface.SourceMap) | [TransformPluginContext](https://rolldown.rs/reference/Interface.TransformPluginContext) | [ExistingRawSourceMap](https://rolldown.rs/reference/Interface.ExistingRawSourceMap) | [EmittedAsset](https://rolldown.rs/reference/Interface.EmittedAsset) | [EmittedChunk](https://rolldown.rs/reference/Interface.EmittedChunk) | [EmittedPrebuiltChunk](https://rolldown.rs/reference/Interface.EmittedPrebuiltChunk) | [RolldownDirectoryEntry](https://rolldown.rs/reference/Interface.RolldownDirectoryEntry) | [RolldownFileStats](https://rolldown.rs/reference/Interface.RolldownFileStats) | [MinifyOptions](https://rolldown.rs/reference/Interface.MinifyOptions) | [MinifyResult](https://rolldown.rs/reference/Interface.MinifyResult) | [ParseResult](https://rolldown.rs/reference/Interface.ParseResult) | [ParserOptions](https://rolldown.rs/reference/Interface.ParserOptions) | [TsconfigCompilerOptions](https://rolldown.rs/reference/Interface.TsconfigCompilerOptions) | [TsconfigRawOptions](https://rolldown.rs/reference/Interface.TsconfigRawOptions) | [ChunkingContext](https://rolldown.rs/reference/Interface.ChunkingContext) | [ChunkOptimizationOptions](https://rolldown.rs/reference/Interface.ChunkOptimizationOptions) | [PreRenderedChunk](https://rolldown.rs/reference/Interface.PreRenderedChunk) | [QueryFilterObject](https://rolldown.rs/reference/Interface.QueryFilterObject) | [ResolveIdExtraOptions](https://rolldown.rs/reference/Interface.ResolveIdExtraOptions) | [RolldownLog](https://rolldown.rs/reference/Interface.RolldownLog) | [RolldownMagicString](https://rolldown.rs/reference/Interface.RolldownMagicString) | [RolldownOptions](https://rolldown.rs/reference/Interface.RolldownOptions) | [WatcherFileWatcherOptions](https://rolldown.rs/reference/Interface.WatcherFileWatcherOptions)

### Type Aliases

- [AsyncPluginHooks](https://rolldown.rs/reference/TypeAlias.AsyncPluginHooks) | [BufferEncoding](https://rolldown.rs/reference/TypeAlias.BufferEncoding) | [CodeSplittingNameFunction](https://rolldown.rs/reference/TypeAlias.CodeSplittingNameFunction) | [EmittedFile](https://rolldown.rs/reference/TypeAlias.EmittedFile) | [GeneralHookFilter](https://rolldown.rs/reference/TypeAlias.GeneralHookFilter) | [HookFilterExtension](https://rolldown.rs/reference/TypeAlias.HookFilterExtension) | [ImportKind](https://rolldown.rs/reference/TypeAlias.ImportKind) | [InternalModuleFormat](https://rolldown.rs/reference/TypeAlias.InternalModuleFormat) | [LoadResult](https://rolldown.rs/reference/TypeAlias.LoadResult) | [ModuleType](https://rolldown.rs/reference/TypeAlias.ModuleType) | [ModuleTypeFilter](https://rolldown.rs/reference/TypeAlias.ModuleTypeFilter) | [ObjectHook](https://rolldown.rs/reference/TypeAlias.ObjectHook) | [ResolveIdResult](https://rolldown.rs/reference/TypeAlias.ResolveIdResult) | [SourceMapInput](https://rolldown.rs/reference/TypeAlias.SourceMapInput) | [TransformResult](https://rolldown.rs/reference/TypeAlias.TransformResult) | [ConfigExport](https://rolldown.rs/reference/TypeAlias.ConfigExport) | [GetLogFilter](https://rolldown.rs/reference/TypeAlias.GetLogFilter) | [RolldownOptionsFunction](https://rolldown.rs/reference/TypeAlias.RolldownOptionsFunction) | [BuildOptions](https://rolldown.rs/reference/TypeAlias.BuildOptions) | [RolldownWatcherEvent](https://rolldown.rs/reference/TypeAlias.RolldownWatcherEvent) | [RolldownWatcherWatcherEventMap](https://rolldown.rs/reference/TypeAlias.RolldownWatcherWatcherEventMap) | [VisitorObject](https://rolldown.rs/reference/TypeAlias.VisitorObject) | [AddonFunction](https://rolldown.rs/reference/TypeAlias.AddonFunction) | [AdvancedChunksGroup](https://rolldown.rs/reference/TypeAlias.AdvancedChunksGroup) | [AdvancedChunksOptions](https://rolldown.rs/reference/TypeAlias.AdvancedChunksOptions) | [BuiltinModuleTag](https://rolldown.rs/reference/TypeAlias.BuiltinModuleTag) | [BundleError](https://rolldown.rs/reference/TypeAlias.BundleError) | [ChunkFileNamesFunction](https://rolldown.rs/reference/TypeAlias.ChunkFileNamesFunction) | [CodeSplittingGroup](https://rolldown.rs/reference/TypeAlias.CodeSplittingGroup) | [ExternalOption](https://rolldown.rs/reference/TypeAlias.ExternalOption) | [ExternalOptionFunction](https://rolldown.rs/reference/TypeAlias.ExternalOptionFunction) | [FilterExpression](https://rolldown.rs/reference/TypeAlias.FilterExpression) | [FilterExpressionKind](https://rolldown.rs/reference/TypeAlias.FilterExpressionKind) | [GeneratedCodePreset](https://rolldown.rs/reference/TypeAlias.GeneratedCodePreset) | [GetModuleInfo](https://rolldown.rs/reference/TypeAlias.GetModuleInfo) | [GlobalsFunction](https://rolldown.rs/reference/TypeAlias.GlobalsFunction) | [InputOption](https://rolldown.rs/reference/TypeAlias.InputOption) | [LoggingFunction](https://rolldown.rs/reference/TypeAlias.LoggingFunction) | [LogLevel](https://rolldown.rs/reference/TypeAlias.LogLevel) | [LogLevelOption](https://rolldown.rs/reference/TypeAlias.LogLevelOption) | [LogOrStringHandler](https://rolldown.rs/reference/TypeAlias.LogOrStringHandler) | [MinifyOptions](https://rolldown.rs/reference/TypeAlias.MinifyOptions) | [ModuleFormat](https://rolldown.rs/reference/TypeAlias.ModuleFormat) | [ModuleTypes](https://rolldown.rs/reference/TypeAlias.ModuleTypes) | [PartialNull](https://rolldown.rs/reference/TypeAlias.PartialNull) | [RolldownLogWithString](https://rolldown.rs/reference/TypeAlias.RolldownLogWithString) | [RolldownPlugin](https://rolldown.rs/reference/TypeAlias.RolldownPlugin) | [RolldownPluginOption](https://rolldown.rs/reference/TypeAlias.RolldownPluginOption) | [SourcemapIgnoreListOption](https://rolldown.rs/reference/TypeAlias.SourcemapIgnoreListOption) | [TopLevelFilterExpression](https://rolldown.rs/reference/TypeAlias.TopLevelFilterExpression) | [WarningHandlerWithDefault](https://rolldown.rs/reference/TypeAlias.WarningHandlerWithDefault)

### Config

- [defineConfig](https://rolldown.rs/reference/Function.defineConfig) | [loadConfig](https://rolldown.rs/reference/Function.loadConfig) | [withFilter](https://rolldown.rs/reference/Function.withFilter) | [getLogFilter](https://rolldown.rs/reference/Variable.getLogFilter)

### Builtin Plugin Functions

- [esmExternalRequirePlugin](https://rolldown.rs/reference/Function.esmExternalRequirePlugin) | [replacePlugin](https://rolldown.rs/reference/Function.replacePlugin)

### Utilities

- [minify](https://rolldown.rs/reference/Function.minify) | [minifySync](https://rolldown.rs/reference/Function.minifySync) | [parse](https://rolldown.rs/reference/Function.parse) | [parseSync](https://rolldown.rs/reference/Function.parseSync) | [parseAst](https://rolldown.rs/reference/Function.parseAst) | [parseAstAsync](https://rolldown.rs/reference/Function.parseAstAsync) | [transform](https://rolldown.rs/reference/Function.transform) | [transformSync](https://rolldown.rs/reference/Function.transformSync) | [Visitor](https://rolldown.rs/reference/Class.Visitor) | [TsconfigCache](https://rolldown.rs/reference/Class.TsconfigCache)

### Variables

- [VERSION](https://rolldown.rs/reference/Variable.VERSION) | [RUNTIME_MODULE_ID](https://rolldown.rs/reference/Variable.RUNTIME_MODULE_ID) | [RolldownMagicString](https://rolldown.rs/reference/Variable.RolldownMagicString)

### Filter Functions

- [and](https://rolldown.rs/reference/Function.and) | [or](https://rolldown.rs/reference/Function.or) | [not](https://rolldown.rs/reference/Function.not) | [include](https://rolldown.rs/reference/Function.include) | [exclude](https://rolldown.rs/reference/Function.exclude) | [prefixRegex](https://rolldown.rs/reference/Function.prefixRegex) | [exactRegex](https://rolldown.rs/reference/Function.exactRegex) | [code](https://rolldown.rs/reference/Function.code) | [id](https://rolldown.rs/reference/Function.id) | [moduleType](https://rolldown.rs/reference/Function.moduleType) | [importerId](https://rolldown.rs/reference/Function.importerId) | [query](https://rolldown.rs/reference/Function.query) | [queries](https://rolldown.rs/reference/Function.queries) | [filterVitePlugins](https://rolldown.rs/reference/Function.filterVitePlugins) | [interpreter](https://rolldown.rs/reference/Function.interpreter) | [interpreterImpl](https://rolldown.rs/reference/Function.interpreterImpl) | [exprInterpreter](https://rolldown.rs/reference/Function.exprInterpreter) | [makeIdFiltersToMatchWithQuery](https://rolldown.rs/reference/Function.makeIdFiltersToMatchWithQuery)

**Source**: [Options & APIs Reference](https://rolldown.rs/reference) | [Bundler API](https://rolldown.rs/apis/bundler-api) | [Plugin API](https://rolldown.rs/apis/plugin-api) | [Hook Filters](https://rolldown.rs/apis/plugin-api/hook-filters) | [File URLs](https://rolldown.rs/apis/plugin-api/file-urls) | [Source Code Transformations](https://rolldown.rs/apis/plugin-api/transformations) | [Inter-plugin Communication](https://rolldown.rs/apis/plugin-api/inter-plugin-communication) | [CLI](https://rolldown.rs/apis/cli) | [Rust Crates](https://rolldown.rs/apis/rust-crates) | [Builtin Plugins](https://rolldown.rs/builtin-plugins/) | [bundle-analyzer](https://rolldown.rs/builtin-plugins/bundle-analyzer) | [esm-external-require](https://rolldown.rs/builtin-plugins/esm-external-require) | [replace](https://rolldown.rs/builtin-plugins/replace)
