# webpack — Loaders, Plugins & API

## Loader Interface

Loaders are transformations applied to source files. They export a function that receives source content and returns transformed content.

### Basic Loader

```javascript
// Synchronous loader
export default function(source) {
  return source + "// Appended comment";
}

// Using this.callback (sync)
export default function(source) {
  this.callback(null, source, map, meta);
  return;
}

// Asynchronous loader
export default function(source) {
  const callback = this.async();
  setTimeout(() => {
    callback(null, source + "// Async appended");
  }, 100);
}
```

### Raw Loader

```javascript
export default function(source) {
  // source is Buffer when raw=true
}
export default.raw = true;
```

### Pitching Loader

Pitching loaders run before the loader chain (left to right). If a pitch returns a value, remaining loaders are skipped.

```javascript
export default function(source) {
  // Normal execution (right to left)
  return source;
}
export default.pitch = function(remainingRequest, precedingRequest, data) {
  // Runs before loaders (left to right)
  // If returns a value, skips remaining loaders
  return "module.exports = 'pitched'";
};
```

### Loader Context Properties

| Property | Description |
|----------|-------------|
| `this.addContextDependency(path)` | Add context dependency |
| `this.addDependency(path)` | Add file dependency |
| `this.addMissingDependency(path)` | Add missing dependency |
| `this.async()` | Get callback function for async |
| `this.cacheable()` | Mark loader as cacheable |
| `this.callback(err, content, map, meta)` | Return result |
| `this.clearDependencies()` | Clear all dependencies |
| `this.context` | Directory of resource |
| `this.data` | Data shared between pitch and normal |
| `this.emitError(error)` | Emit error |
| `this.emitFile(name, content, sourceMap)` | Emit additional file |
| `this.emitWarning(warning)` | Emit warning |
| `this.environment` | Environment info |
| `this.fs` | File system access |
| `this.getOptions(schema)` | Get loader options |
| `this.getResolve(options)` | Get resolve function |
| `this.hot` | HMR enabled |
| `this.importModule(request, options, callback)` | Import module |
| `this.loaderIndex` | Index in loader chain |
| `this.loadModule(request, callback)` | Load another module |
| `this.loaders` | Array of loader objects |
| `this.mode` | Current mode |
| `this.query` | Loader options (legacy) |
| `this.request` | Full request string |
| `this.resolve(context, request, callback)` | Resolve a request |
| `this.resource` | Resource path with query |
| `this.resourcePath` | Resource path |
| `this.resourceQuery` | Resource query string |
| `this.rootContext` | Root context directory |
| `this.sourceMap` | Should generate source map |
| `this.target` | Compilation target |
| `this.utils` | Utility functions |
| `this.version` | Loader API version |
| `this.webpack` | true if running under webpack |

### Webpack-specific Properties

| Property | Description |
|----------|-------------|
| `this._compilation` | Current compilation |
| `this._compiler` | Current compiler |

### Inline matchResource

```javascript
// In source code
import "./style.css?matchResource=style.css!css-loader";
```

### Error Reporting

```javascript
export default function(source) {
  this.emitError(new Error("Loader error"));
  this.emitWarning(new Warning("Loader warning"));
  return source;
}
```

### Logging

```javascript
export default function(source) {
  const logger = this.getLogger("my-loader");
  logger.info("Processing file");
  logger.warn("Potential issue");
  logger.error("Error occurred");
  return source;
}
```

## Plugin API

### Tapable

webpack's plugin system is built on `tapable`, a hook-based event system.

**Hook types**:
| Hook Type | Execution | Return |
|-----------|-----------|--------|
| `SyncHook` | Sequential, sync | undefined |
| `SyncBailHook` | Sequential, bail on non-undefined return | first non-undefined |
| `SyncWaterfallHook` | Sequential, pass result to next | last result |
| `SyncLoopHook` | Loop until returns undefined | undefined |
| `AsyncParallelHook` | Parallel, async | Promise |
| `AsyncParallelBailHook` | Parallel, bail on result | Promise |
| `AsyncSeriesHook` | Sequential, async | Promise |
| `AsyncSeriesBailHook` | Sequential, bail on result | Promise |
| `AsyncSeriesWaterfallHook` | Sequential, pass result | Promise |

### Plugin Types

```javascript
// Basic plugin
class MyPlugin {
  apply(compiler) {
    compiler.hooks.done.tap("MyPlugin", (stats) => {
      console.log("Build done");
    });
  }
}

// Async plugin
class AsyncPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync("AsyncPlugin", (compilation, callback) => {
      setTimeout(callback, 1000);
    });
  }
}

// Promise-based plugin
class PromisePlugin {
  apply(compiler) {
    compiler.hooks.emit.tapPromise("PromisePlugin", (compilation) => {
      return new Promise((resolve) => setTimeout(resolve, 1000));
    });
  }
}
```

### Custom Hooks

```javascript
import { SyncHook, AsyncSeriesHook } from "tapable";

class MyPlugin {
  static getHooks(compilation) {
    return {
      myCustomHook: new SyncHook(["arg1", "arg2"]),
      myAsyncHook: new AsyncSeriesHook(["data"]),
    };
  }

  apply(compiler) {
    compiler.hooks.compilation.tap("MyPlugin", (compilation) => {
      const hooks = MyPlugin.getHooks(compilation);
      hooks.myCustomHook.call("value1", "value2");
    });
  }
}
```

### Reporting Progress

```javascript
class ProgressPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("ProgressPlugin", (compilation) => {
      compilation.hooks.optimizeModules.tap("ProgressPlugin", () => {
        // Report progress
      });
    });
  }
}
```

## CLI (Command Line Interface)

### Commands

```bash
npx webpack build [options]    # Build (default)
npx webpack watch [options]    # Watch mode
npx webpack serve [options]    # Dev server
npx webpack init [scaffold]    # Initialize project
npx webpack loader [scaffold]  # Create loader scaffold
npx webpack plugin [scaffold]  # Create plugin scaffold
npx webpack info [options]     # System info
npx webpack configtest [config] # Validate config
```

### Flags

```bash
# Core flags
--config <path>          # Config file path
--config-name <name>     # Config name to use
--mode <mode>            # development, production, none
--watch / -w             # Watch mode
--entry <path>           # Entry point
--output-path <path>     # Output directory
--output-filename <name> # Output filename
--stats <preset>         # Stats preset
--json                   # Output stats as JSON

# Environment
--env <key=value>        # Environment variable
--node-env <value>       # Set NODE_ENV

# Optimization
--optimize-minimize      # Enable minification
--optimize               # Enable optimizations

# Dev server
--port <port>            # Dev server port
--hot                    # Enable HMR
--open                   # Open browser

# Merge/Extend
--merge                  # Merge configs
--extends <path>         # Extend config

# Negated flags
--no-watch               # Disable watch
--no-hot                 # Disable HMR
```

### Usage

```bash
# With config file
npx webpack --config webpack.prod.js --mode production

# Without config file
npx webpack --entry ./src/index.js --output-filename bundle.js

# Default configurations (auto-detected)
# webpack.config.js, webpack.config.mjs, webpack.config.cjs, webpack.config.ts
```

### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Error |
| 2 | Configuration error |

### CLI Environment Variables

- `WEBPACK_PACKAGE` — Custom webpack package path
- `WEBPACK_CLI_PACKAGE` — Custom webpack CLI package path

## Node.js API

### Installation

```bash
npm install webpack
```

### webpack()

```javascript
import webpack from "webpack";

// Callback style
webpack(config, (err, stats) => {
  if (err) { console.error(err); return; }
  console.log(stats.toString({ colors: true }));
});

// Promise style (multi-compiler)
webpack([config1, config2], (err, stats) => {
  // ...
});
```

### Compiler Instance

```javascript
const compiler = webpack(config);

// Run once
compiler.run((err, stats) => {
  if (err) { console.error(err); return; }
  const info = stats.toJson();
  if (stats.hasErrors()) console.error(info.errors);
  if (stats.hasWarnings()) console.warn(info.warnings);
  compiler.close((closeErr) => {});
});
```

### Watching

```javascript
const watching = compiler.watch({ aggregateTimeout: 300 }, (err, stats) => {
  // Called on each rebuild
});

// Close watching
watching.close((closeErr) => {});

// Invalidate watching (force rebuild)
watching.invalidate(() => {});
```

### Stats Object

```javascript
stats.hasErrors();       // boolean
stats.hasWarnings();     // boolean
stats.toJson(options);   // JSON object
stats.toString(options); // formatted string
stats.toString({ colors: true, modules: true, chunks: true });
```

### MultiCompiler

```javascript
const multiCompiler = webpack([config1, config2]);
multiCompiler.run((err, stats) => {
  // stats is array of Stats objects
});
```

### Error Handling

```javascript
webpack(config, (err, stats) => {
  if (err) {
    // Fatal webpack error
    console.error(err.stack || err);
    if (err.details) console.error(err.details);
    return;
  }
  const info = stats.toJson();
  if (stats.hasErrors()) console.error(info.errors);
  if (stats.hasWarnings()) console.warn(info.warnings);
});
```

### Custom File Systems

```javascript
import webpack from "webpack";
import MemoryFileSystem from "memory-fs";

const compiler = webpack(config);
compiler.outputFileSystem = new MemoryFileSystem();
compiler.run((err, stats) => {});
```

## Module Methods

### ES6 (Recommended)

```javascript
// import
import MyModule from "./my-module";
import { namedExport } from "./my-module";
import * as ModuleName from "./my-module";

// export
export default MyModule;
export { namedExport };
export { name1 as alias1 };

// Dynamic import() — creates separate chunk
import("./module").then((module) => {
  module.doSomething();
});

// Dynamic expressions in import()
import(`./locales/${language}.json`).then((locale) => {
  console.log(locale);
});

// webpack-mode: "eager" — no separate chunk
import(/* webpackMode: "eager" */ "./module");

// webpackChunkName
import(/* webpackChunkName: "my-chunk" */ "./module");

// webpackPrefetch
import(/* webpackPrefetch: true */ "./module");

// webpackPreload
import(/* webpackPreload: true */ "./module");

// webpackInclude / webpackExclude
import(/* webpackInclude: /\.json$/ */ `./locales/${lang}.json`);

// webpackIgnore
import(/* webpackIgnore: true */ "./module");
```

### CommonJS

```javascript
// require
const module = require("./module");
require(["./module1", "./module2"], (mod1, mod2) => {});

// require.resolve
const path = require.resolve("./module");

// require.cache
delete require.cache[require.resolve("./module")];

// require.ensure (legacy, use import() instead)
require.ensure(["./module"], (require) => {
  const module = require("./module");
});
```

### AMD

```javascript
// define with factory
define(["dependency"], (dependency) => {
  return { myModule: true };
});

// define with value
define({ myModule: true });

// require (AMD version)
require(["dependency"], (dependency) => {
  dependency.doSomething();
});
```

### Labeled Modules

```javascript
// export label
export: { myExport };

// require label
require: "dependency";
```

### Webpack-specific

```javascript
// require.context — create context module
const context = require.context("./dir", false, /\.js$/);
context.keys().forEach(context); // Execute each
context("./file.js"); // Get specific module

// require.include
require.include("./module");

// require.resolveWeak — resolve without loading
const id = require.resolveWeak("./module");
```

## Compiler Hooks

The `Compiler` instance extends `Tapable` and provides hooks for the build lifecycle.

### Lifecycle Hooks (in order)

| Hook | Type | Description |
|------|------|-------------|
| `environment` | SyncHook | Environment setup |
| `afterEnvironment` | SyncHook | After environment setup |
| `entryOption` | SyncBailHook | After entry config |
| `afterPlugins` | SyncHook | After plugins applied |
| `afterResolvers` | SyncHook | After resolvers applied |
| `validate` | SyncBailHook | Validate config |
| `initialize` | SyncHook | Initialize compiler |
| `beforeRun` | AsyncSeriesHook | Before run starts |
| `run` | AsyncSeriesHook | Start compilation |
| `watchRun` | AsyncSeriesHook | Start watch compilation |
| `normalModuleFactory` | SyncHook | Normal module factory created |
| `contextModuleFactory` | SyncHook | Context module factory created |
| `beforeCompile` | AsyncSeriesHook | Before compilation |
| `compile` | SyncHook | Compilation started |
| `thisCompilation` | SyncHook | New compilation created |
| `compilation` | SyncHook | Compilation created |
| `make` | AsyncSeriesHook | Add entries to graph |
| `afterCompile` | AsyncSeriesHook | After compilation |
| `shouldEmit` | SyncBailHook | Decide whether to emit |
| `emit` | AsyncSeriesHook | Emit assets |
| `afterEmit` | AsyncSeriesHook | After assets emitted |
| `assetEmitted` | AsyncSeriesHook | Each asset emitted |
| `done` | SyncHook | Compilation done |
| `additionalPass` | SyncBailHook | Additional pass needed |
| `failed` | SyncHook | Compilation failed |
| `invalid` | SyncHook | Watch invalidation |
| `watchClose` | SyncHook | Watch closed |
| `shutdown` | AsyncSeriesHook | Compiler shutdown |
| `infrastructureLog` | SyncBailHook | Infrastructure logging |
| `log` | SyncBailHook | Logging |

### Watching

The `Watching` object has `close()` and `invalidate()` methods.

## Compilation Hooks

The `Compilation` object provides hooks for the compilation process.

### Module/Chunk Hooks

| Hook | Type | Description |
|------|------|-------------|
| `buildModule` | SyncHook | Module build started |
| `rebuildModule` | SyncHook | Module rebuild |
| `failedModule` | SyncHook | Module build failed |
| `succeedModule` | SyncHook | Module build succeeded |
| `finishModules` | AsyncSeriesHook | All modules finished |
| `finishRebuildingModule` | SyncHook | Module rebuild finished |
| `seal` | SyncHook | Compilation sealed |
| `unseal` | SyncHook | Compilation unsealed |
| `optimizeDependencies` | SyncHook | Optimize dependencies |
| `afterOptimizeDependencies` | SyncHook | After dep optimization |
| `optimize` | SyncHook | Optimization started |
| `optimizeModules` | SyncBailHook | Optimize modules |
| `afterOptimizeModules` | SyncHook | After module optimization |
| `optimizeChunks` | SyncBailHook | Optimize chunks |
| `afterOptimizeChunks` | SyncHook | After chunk optimization |
| `optimizeTree` | AsyncSeriesHook | Optimize tree |
| `afterOptimizeTree` | SyncHook | After tree optimization |
| `optimizeChunkModules` | AsyncSeriesBailHook | Optimize chunk modules |
| `afterOptimizeChunkModules` | SyncHook | After chunk module optimization |
| `shouldRecord` | SyncBailHook | Should record |

### ID/Hash Hooks

| Hook | Type | Description |
|------|------|-------------|
| `reviveModules` | SyncHook | Revive modules |
| `beforeModuleIds` | SyncHook | Before module IDs |
| `moduleIds` | SyncHook | Module IDs assigned |
| `optimizeModuleIds` | SyncBailHook | Optimize module IDs |
| `afterOptimizeModuleIds` | SyncHook | After module ID optimization |
| `reviveChunks` | SyncHook | Revive chunks |
| `beforeChunkIds` | SyncHook | Before chunk IDs |
| `chunkIds` | SyncHook | Chunk IDs assigned |
| `optimizeChunkIds` | SyncBailHook | Optimize chunk IDs |
| `afterOptimizeChunkIds` | SyncHook | After chunk ID optimization |
| `recordModules` | SyncHook | Record modules |
| `recordChunks` | SyncHook | Record chunks |
| `beforeModuleHash` | SyncHook | Before module hash |
| `afterModuleHash` | SyncHook | After module hash |
| `beforeHash` | SyncHook | Before hash |
| `afterHash` | SyncHook | After hash |
| `recordHash` | SyncHook | Record hash |
| `record` | SyncHook | Record |

### Asset Hooks

| Hook | Type | Description |
|------|------|-------------|
| `beforeModuleAssets` | SyncHook | Before module assets |
| `additionalChunkAssets` | SyncHook | Additional chunk assets |
| `shouldGenerateChunkAssets` | SyncBailHook | Should generate chunk assets |
| `beforeChunkAssets` | SyncHook | Before chunk assets |
| `additionalAssets` | SyncHook | Additional assets |
| `optimizeChunkAssets` | AsyncSeriesHook | Optimize chunk assets |
| `afterOptimizeChunkAssets` | SyncHook | After chunk asset optimization |
| `optimizeAssets` | AsyncSeriesHook | Optimize assets |
| `afterOptimizeAssets` | SyncHook | After asset optimization |

### processAssets Stages

| Stage | Description |
|-------|-------------|
| `PROCESS_ASSETS_STAGE_ADDITIONAL` | Add additional assets |
| `PROCESS_ASSETS_STAGE_PRE_PROCESS` | Pre-process |
| `PROCESS_ASSETS_STAGE_DERIVED` | Derived assets |
| `PROCESS_ASSETS_STAGE_ADDITIONS` | Additions |
| `PROCESS_ASSETS_STAGE_NONE` | No processing |
| `PROCESS_ASSETS_STAGE_DEV_TOOLING` | Dev tooling |
| `PROCESS_ASSETS_STAGE_OPTIMIZE` | Optimization |
| `PROCESS_ASSETS_STAGE_OPTIMIZE_COUNT` | Count optimization |
| `PROCESS_ASSETS_STAGE_OPTIMIZE_COMPATIBILITY` | Compatibility optimization |
| `PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE` | Size optimization |
| `PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER` | Transfer optimization |
| `PROCESS_ASSETS_STAGE_ANALYSE` | Analysis |
| `PROCESS_ASSETS_STAGE_REPORT` | Reporting |

### Other Compilation Hooks

`afterProcessAssets`, `needAdditionalSeal`, `afterSeal`, `chunkHash`, `moduleAsset`, `chunkAsset`, `assetPath`, `needAdditionalPass`, `childCompiler`, `normalModuleLoader`, `statsPreset`, `statsNormalize`, `statsFactory`, `statsPrinter`

### CSS Modules Plugin Hooks

`CssModulesPlugin.getCompilationHooks(compilation)` provides `orderModules` hook.

## Built-in Plugins Catalog

### Core Plugins

| Plugin | Description |
|--------|-------------|
| [BannerPlugin](https://webpack.js.org/plugins/banner-plugin) | Add banner to generated files |
| [ChunksWebpackPlugin](https://webpack.js.org/plugins/chunks-webpack-plugin/) | Create chunk files for lazy loading |
| [CompressionWebpackPlugin](https://webpack.js.org/plugins/compression-webpack-plugin) | Compress assets (gzip/brotli) |
| [ContextReplacementPlugin](https://webpack.js.org/plugins/context-replacement-plugin) | Replace module context |
| [CopyWebpackPlugin](https://webpack.js.org/plugins/copy-webpack-plugin) | Copy files to output |
| [DefinePlugin](https://webpack.js.org/plugins/define-plugin) | Define global constants |
| [DllPlugin](https://webpack.js.org/plugins/dll-plugin) | Split bundles for faster builds |
| [EnvironmentPlugin](https://webpack.js.org/plugins/environment-plugin) | Define process.env variables |
| [EslintWebpackPlugin](https://webpack.js.org/plugins/eslint-webpack-plugin) | ESLint integration |
| [HotModuleReplacementPlugin](https://webpack.js.org/plugins/hot-module-replacement-plugin) | Enable HMR |
| [HtmlWebpackPlugin](https://webpack.js.org/plugins/html-webpack-plugin) | Generate HTML files |
| [IgnorePlugin](https://webpack.js.org/plugins/ignore-plugin) | Exclude modules |
| [LimitChunkCountPlugin](https://webpack.js.org/plugins/limit-chunk-count-plugin) | Limit chunk count |
| [MergeDuplicateChunksPlugin](https://webpack.js.org/plugins/merge-duplicate-chunks-plugin) | Merge duplicate chunks |
| [MinChunkSizePlugin](https://webpack.js.org/plugins/min-chunk-size-plugin) | Minimum chunk size |
| [MiniCssExtractPlugin](https://webpack.js.org/plugins/mini-css-extract-plugin) | Extract CSS to files |
| [NoEmitOnErrorsPlugin](https://webpack.js.org/configuration/optimization/) | No emit on errors |
| [NormalModuleReplacementPlugin](https://webpack.js.org/plugins/normal-module-replacement-plugin) | Replace module resources |
| [ProgressPlugin](https://webpack.js.org/plugins/progress-plugin) | Report compilation progress |
| [ProvidePlugin](https://webpack.js.org/plugins/provide-plugin) | Auto-load modules |
| [SourceMapDevToolPlugin](https://webpack.js.org/plugins/source-map-dev-tool-plugin) | Source map generation |
| [EvalSourceMapDevToolPlugin](https://webpack.js.org/plugins/eval-source-map-dev-tool-plugin) | Eval source map generation |
| [SvgChunkWebpackPlugin](https://webpack.js.org/plugins/svg-chunk-webpack-plugin/) | SVG chunk optimization |
| [MinimizerPlugin](https://webpack.js.org/plugins/minimizer-webpack-plugin/) | Custom minimizer |

## Loaders Catalog

### Files
- `ref-loader` — Create dependencies between files manually

### JSON
- `cson-loader` — Load and transpile CSON files

### Transpiling
- `babel-loader` — Transpile ES2015+ to ES5 using Babel
- `esbuild-loader` — Transpile using esbuild
- `buble-loader` — Transpile using Bublé
- `traceur-loader` — Transpile using Traceur
- `ts-loader` — Load TypeScript
- `coffee-loader` — Load CoffeeScript
- `fengari-loader` — Load Lua using fengari
- `elm-webpack-loader` — Load Elm

### Templating
- `html-loader` — Export HTML as string
- `pug-loader` — Load Pug/Jade templates
- `markdown-loader` — Compile Markdown to HTML
- `react-markdown-loader` — Compile Markdown to React Component
- `posthtml-loader` — Transform HTML using PostHTML
- `handlebars-loader` — Compile Handlebars to HTML
- `markup-inline-loader` — Inline SVG/MathML to HTML
- `twig-loader` — Compile Twig templates
- `remark-loader` — Load markdown through remark

### Styling
- `style-loader` — Add CSS exports to DOM
- `css-loader` — Load CSS with resolved imports
- `css-utility-loader` — Parse legacy CSS to utility classes
- `less-loader` — Load and compile LESS
- `sass-loader` — Load and compile SASS/SCSS
- `postcss-loader` — Transform CSS using PostCSS
- `stylus-loader` — Load and compile Stylus

### Frameworks
- `vue-loader` — Load and compile Vue Components
- `angular2-template-loader` — Load and compile Angular Components

### For more third-party loaders
See [awesome-webpack](https://webpack.js.org/awesome-webpack/)

**Source**: [Loaders API](https://webpack.js.org/api/loaders/) | [Plugins API](https://webpack.js.org/api/plugins/) | [CLI](https://webpack.js.org/api/cli/) | [Node.js API](https://webpack.js.org/api/node/) | [Module Methods](https://webpack.js.org/api/module-methods/) | [Compiler Hooks](https://webpack.js.org/api/compiler-hooks/) | [Compilation Hooks](https://webpack.js.org/api/compilation-hooks/) | [Loaders Catalog](https://webpack.js.org/loaders/) | [Plugins Catalog](https://webpack.js.org/plugins/) | [API Introduction](https://webpack.js.org/api/)
