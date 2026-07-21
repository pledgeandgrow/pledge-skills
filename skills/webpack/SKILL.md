---
name: webpack-docs
version: "5.x"
tags:
  - webpack
  - bundler
  - module bundler
  - javascript
  - build tool
  - entry
  - output
  - loaders
  - plugins
  - devtool
  - devserver
  - optimization
  - split chunks
  - tree shaking
  - hmr
  - hot module replacement
  - module federation
  - code splitting
  - cache
  - resolve
  - tapable
  - compiler hooks
  - compilation hooks
  - webpack cli
  - webpack config
  - webpack 5
  - asset modules
  - source maps
  - webpack-dev-server
  - terser
  - mini-css-extract
  - html-webpack-plugin
  - babel-loader
  - css-loader
  - ts-loader
  - sass-loader
  - vue-loader
description: |
  webpack 5.x — entry, output, loaders, plugins, HMR, module federation, optimization, devServer, configuration.
---

# webpack Skill

> **webpack** — Static module bundler for modern JavaScript applications.
> **Version**: webpack 5.x (latest) | **Docs**: [webpack.js.org](https://webpack.js.org/)

## Quick Reference

| Topic | File | Sections |
|-------|------|----------|
| Getting Started & Concepts | `getting-started.md` | Core concepts (entry, output, loaders, plugins, mode, browser compatibility), dependency graph, modules, module federation, HMR, guides, migration |
| Configuration | `configuration.md` | All configuration options: entry/context, output, module/rules, resolve, plugins, optimization, devtool, devServer, target, watch, cache, experiments, stats, performance, other options |
| Loaders, Plugins & API | `loaders-plugins-api.md` | Loader interface, plugin API, CLI, Node.js API, module methods, compiler hooks, compilation hooks, built-in plugins, loader catalog, plugin catalog |

## Core Concepts

- **Entry**: Starting point for building the dependency graph (default: `./src/index.js`)
- **Output**: Where to emit bundles and how to name them (default: `./dist/main.js`)
- **Loaders**: Transform non-JS files (CSS, TS, images) into valid modules
- **Plugins**: Perform wider range of tasks: bundle optimization, asset management, env injection
- **Mode**: `development`, `production`, or `none` — enables built-in optimizations
- **Dependency Graph**: webpack builds a graph from entry points, combining every needed module into bundles
- **Modules**: webpack supports ES modules, CommonJS, AMD, and webpack-specific module methods
- **Module Federation**: Multiple webpack builds share modules at runtime
- **HMR (Hot Module Replacement)**: Swap modules without full page reload during development
- **Browser Compatibility**: Supports all ES5-compliant browsers (IE8 and below not supported)

## webpack Versions

| Version | Key Features | Status |
|---------|-------------|--------|
| webpack 5.x | Module Federation, Asset Modules, Cache, experiments (CSS/HTML/TS), Node polyfill removal | Active |
| webpack 4.x | Zero config, mode optimization, WebAssembly support | Maintenance |

## Environment Requirements

- Node.js >= 10.13.0 (webpack 5)
- ES5-compliant browser for output
- `Promise` polyfill needed for `import()` and `require.ensure()` in older browsers

## Quick Start

```bash
# Install
npm install webpack webpack-cli --save-dev

# Build
npx webpack --config webpack.config.js

# Development server
npx webpack serve --mode development
```

```javascript
// webpack.config.js
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.js$/, exclude: /node_modules/, use: "babel-loader" },
    ],
  },
  plugins: [new (await import("html-webpack-plugin")).default()],
  devServer: {
    static: "./dist",
    hot: true,
  },
};
```

## Configuration File Types

| Type | Description |
|------|-------------|
| `webpack.config.js` | Default config file (CommonJS or ESM) |
| `webpack.config.mjs` | ESM config |
| `webpack.config.cjs` | CommonJS config |
| `webpack.config.ts` | TypeScript config (requires `ts-node` or `tsx`) |
| `webpack.config.babel.js` | Babel-compiled config |

## Mode Optimizations

| Mode | Optimizations |
|------|---------------|
| `development` | `eval` devtool, named module IDs, unminified, `process.env.NODE_ENV` = `"development"` |
| `production` | `deterministic` module/chunk IDs, minification (TerserPlugin), `process.env.NODE_ENV` = `"production"` |
| `none` | No optimizations, no `NODE_ENV` |

## Key Loaders

| Category | Loaders |
|----------|---------|
| Transpiling | `babel-loader`, `ts-loader`, `esbuild-loader`, `coffee-loader` |
| Styling | `css-loader`, `style-loader`, `sass-loader`, `less-loader`, `postcss-loader`, `stylus-loader` |
| Files | `raw-loader` (legacy), Asset Modules (built-in) |
| Templating | `html-loader`, `pug-loader`, `markdown-loader`, `handlebars-loader` |
| Frameworks | `vue-loader`, `angular2-template-loader` |

## Key Plugins

| Plugin | Purpose |
|--------|---------|
| `HtmlWebpackPlugin` | Generate HTML file and inject bundles |
| `MiniCssExtractPlugin` | Extract CSS into separate files |
| `DefinePlugin` | Define global constants |
| `EnvironmentPlugin` | Define `process.env` variables |
| `ProvidePlugin` | Auto-load modules |
| `HotModuleReplacementPlugin` | Enable HMR |
| `CopyWebpackPlugin` | Copy files to output |
| `BannerPlugin` | Add banner to bundle |
| `ContextReplacementPlugin` | Replace module context |
| `DllPlugin` | Split bundles for faster builds |
| `IgnorePlugin` | Exclude modules |
| `NormalModuleReplacementPlugin` | Replace module resources |
| `SourceMapDevToolPlugin` | Control source map generation |
| `ProgressPlugin` | Report compilation progress |
| `LimitChunkCountPlugin` | Limit chunk count |
| `MinChunkSizePlugin` | Set minimum chunk size |
| `CompressionWebpackPlugin` | Compress assets (gzip/brotli) |

## Module Federation

```javascript
// Host (consumer)
new ModuleFederationPlugin({
  remotes: { app1: "app1@http://localhost:3001/remoteEntry.js" },
  shared: { react: { singleton: true }, "react-dom": { singleton: true } },
});

// Remote (provider)
new ModuleFederationPlugin({
  name: "app1",
  filename: "remoteEntry.js",
  exposes: { "./Button": "./src/Button" },
  shared: { react: { singleton: true }, "react-dom": { singleton: true } },
});
```

## Documentation Links

### Concepts
- [Concepts](https://webpack.js.org/concepts/) | [Entry Points](https://webpack.js.org/concepts/entry-points/) | [Output](https://webpack.js.org/concepts/output/) | [Loaders](https://webpack.js.org/concepts/loaders/) | [Plugins](https://webpack.js.org/concepts/plugins/) | [Mode](https://webpack.js.org/concepts/mode/) | [Browser Compatibility](https://webpack.js.org/concepts/) | [Dependency Graph](https://webpack.js.org/concepts/dependency-graph/) | [Modules](https://webpack.js.org/concepts/modules/) | [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/) | [Module Federation](https://webpack.js.org/concepts/module-federation/)

### Configuration
- [Configuration](https://webpack.js.org/configuration/) | [Entry & Context](https://webpack.js.org/configuration/entry-context/) | [Output](https://webpack.js.org/configuration/output/) | [Module](https://webpack.js.org/configuration/module/) | [Resolve](https://webpack.js.org/configuration/resolve/) | [Plugins](https://webpack.js.org/configuration/plugins/) | [Optimization](https://webpack.js.org/configuration/optimization/) | [Devtool](https://webpack.js.org/configuration/devtool/) | [DevServer](https://webpack.js.org/configuration/dev-server/) | [Target](https://webpack.js.org/configuration/target/) | [Watch](https://webpack.js.org/configuration/watch/) | [Cache](https://webpack.js.org/configuration/cache/) | [Experiments](https://webpack.js.org/configuration/experiments/) | [Stats](https://webpack.js.org/configuration/stats/) | [Performance](https://webpack.js.org/configuration/performance/) | [Mode](https://webpack.js.org/configuration/mode/) | [Other Options](https://webpack.js.org/configuration/other-options/)

### API
- [API Introduction](https://webpack.js.org/api/) | [CLI](https://webpack.js.org/api/cli/) | [Node.js API](https://webpack.js.org/api/node/) | [Loaders API](https://webpack.js.org/api/loaders/) | [Plugins API](https://webpack.js.org/api/plugins/) | [Module Methods](https://webpack.js.org/api/module-methods/) | [Compiler Hooks](https://webpack.js.org/api/compiler-hooks/) | [Compilation Hooks](https://webpack.js.org/api/compilation-hooks/)

### Guides & Migration
- [Guides](https://webpack.js.org/guides/) | [Getting Started](https://webpack.js.org/guides/getting-started/) | [Migration](https://webpack.js.org/migrate/)

### Loaders & Plugins Catalog
- [Loaders](https://webpack.js.org/loaders/) | [Plugins](https://webpack.js.org/plugins/)

### Other
- [Comparison](https://webpack.js.org/comparison/) | [Glossary](https://webpack.js.org/glossary/) | [Awesome webpack](https://webpack.js.org/awesome-webpack/)

**Source**: [webpack Docs](https://webpack.js.org/) | [Concepts](https://webpack.js.org/concepts/) | [Configuration](https://webpack.js.org/configuration/) | [API](https://webpack.js.org/api/) | [Guides](https://webpack.js.org/guides/) | [Loaders](https://webpack.js.org/loaders/) | [Plugins](https://webpack.js.org/plugins/) | [Migration](https://webpack.js.org/migrate/)
