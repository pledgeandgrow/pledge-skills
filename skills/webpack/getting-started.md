# webpack — Getting Started & Concepts

## What is webpack

webpack is a **static module bundler** for modern JavaScript applications. When processing an application, it builds a [dependency graph](https://webpack.js.org/concepts/dependency-graph/) from one or more entry points and combines every module into one or more bundles.

Since v4, webpack requires zero configuration to bundle a project. It defaults to `./src/index.js` as entry and outputs to `./dist/main.js`.

## Installation

```bash
# Install webpack and CLI
npm install webpack webpack-cli --save-dev

# Install dev server
npm install webpack-dev-server --save-dev

# Global install (not recommended)
npm install webpack webpack-cli -g
```

## Core Concepts

### Entry

The entry point indicates which module webpack should use to begin building the dependency graph.

```javascript
// Single entry (shorthand)
export default {
  entry: "./src/index.js",
};

// Object syntax (multiple entries)
export default {
  entry: {
    app: "./src/app.js",
    vendor: "./src/vendor.js",
  },
};

// Entry descriptor object
export default {
  entry: {
    app: {
      import: "./src/app.js",
      dependOn: "shared",
      filename: "app.js",
      layer: "browser",
    },
    shared: ["react", "react-dom"],
  },
};
```

**Entry scenarios**:
- **Single entry**: One app, one bundle
- **Separate app and vendor entries**: Split vendor code for caching
- **Multi-page application**: Multiple entries, multiple HTML pages
- **Dynamic entry**: Function returning entry config

### Output

Tells webpack where to emit bundles and how to name them.

```javascript
import path from "node:path";

export default {
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/assets/",
    clean: true, // Clean output dir before build
    assetModuleFilename: "assets/[hash][ext][query]",
  },
};
```

**Filename templates**:
- `[name]` — Entry chunk name
- `[hash]` — Compilation hash
- `[chunkhash]` — Chunk hash
- `[contenthash]` — Content-based hash
- `[fullhash]` — Full compilation hash

**Library output**:
```javascript
export default {
  output: {
    library: {
      name: "MyLibrary",
      type: "umd", // var, module, commonjs, commonjs2, amd, umd, jsonp, etc.
      export: "default",
    },
  },
};
```

### Loaders

Out of the box, webpack only understands JS and JSON. Loaders transform other file types into valid modules.

```javascript
export default {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
```

**Loader usage methods**:
1. **Configuration** — `module.rules` (recommended)
2. **Inline** — `import Styles from "style-loader!css-loader?modules!./styles.css"`
3. **CLI** — `--module-bind css=style-loader!css-loader`

**Loader features**:
- Loaders can be chained (executed right-to-left)
- Loaders can be synchronous or asynchronous
- Loaders can run in Node.js environment
- Loaders can receive options via `options` or `query`
- Loaders can emit additional files
- Loaders can use `this.callback()` for async

### Plugins

Plugins perform broader tasks: bundle optimization, asset management, env variable injection.

```javascript
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";

export default {
  plugins: [
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
    new webpack.DefinePlugin({ "process.env.NODE_ENV": '"production"' }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
```

**Plugin anatomy**:
```javascript
class MyPlugin {
  apply(compiler) {
    compiler.hooks.done.tap("MyPlugin", (stats) => {
      console.log("Build complete!");
    });
  }
}
```

### Mode

Sets `process.env.NODE_ENV` and enables built-in optimizations.

| Mode | Devtool | Module IDs | Minimize | NODE_ENV |
|------|---------|------------|----------|----------|
| `development` | `eval` | `named` | No | `development` |
| `production` | none | `deterministic` | Yes (TerserPlugin) | `production` |
| `none` | none | `natural` | No | (unset) |

```javascript
export default {
  mode: "production", // or "development" or "none"
};
```

### Browser Compatibility

webpack supports all ES5-compliant browsers (IE8 and below not supported). `Promise` polyfill required for `import()` and `require.ensure()`.

### Environment

webpack 5 requires Node.js >= 10.13.0.

## Dependency Graph

When webpack processes an entry point, it recursively builds a dependency graph by following `import`/`require` statements. Every module in the graph is included in the bundle. Code splitting and dynamic imports create separate chunks.

## Modules

webpack supports multiple module types:

| Module System | Syntax |
|---------------|--------|
| ES Modules | `import`, `export`, `import()` |
| CommonJS | `require()`, `module.exports`, `exports` |
| AMD | `define()`, `require()` |
| CSS/Styles | `@import`, `url()` |
| Assets | `import url from "file.png"` |

**Supported module types**:
- JavaScript (ES modules, CommonJS, AMD)
- Stylesheets (CSS, SASS/SCSS, LESS, Stylus)
- Images and fonts (Asset Modules)
- JSON
- WebAssembly
- TypeScript (via loaders)
- Custom (via loaders)

## Hot Module Replacement (HMR)

HMR exchanges, adds, or removes modules while an application is running without a full page reload.

**How it works**:
1. **Application**: HMR runtime checks for updates
2. **Compiler**: Emits updated chunks and manifest
3. **Module**: Accepts or declines updates via `module.hot.accept()`
4. **Runtime**: Applies updates and notifies

```javascript
// In application code
if (module.hot) {
  module.hot.accept("./print.js", () => {
    // Re-run updated module
    print();
  });
}
```

```javascript
// In webpack config
export default {
  devServer: { hot: true },
  plugins: [new webpack.HotModuleReplacementPlugin()],
};
```

## Module Federation

Module Federation allows multiple webpack builds to share modules at runtime. Each build acts as a container that can expose modules to other builds and consume modules from other builds.

**Key concepts**:
- **Host**: Application that consumes remote modules
- **Remote**: Application that exposes modules
- **Shared**: Dependencies shared between host and remotes

```javascript
// webpack.config.js (Host)
import { ModuleFederationPlugin } from "webpack/container";

export default {
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      remotes: {
        remoteApp: "remoteApp@http://localhost:3001/remoteEntry.js",
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
      },
    }),
  ],
};
```

```javascript
// webpack.config.js (Remote)
export default {
  plugins: [
    new ModuleFederationPlugin({
      name: "remoteApp",
      filename: "remoteEntry.js",
      exposes: {
        "./Button": "./src/components/Button",
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
      },
    }),
  ],
};
```

**Dynamic remote containers**:
```javascript
// Load remote container at runtime
async function loadComponent(scope, module) {
  await __webpack_init_sharing__("default");
  const container = window[scope];
  await container.init(__webpack_share_scopes__.default);
  return container.get(module);
}
```

**Promise-based dynamic remotes**:
```javascript
remotes: {
  app1: `promise new Promise(resolve => {
    const script = document.createElement("script");
    script.src = "http://localhost:3001/remoteEntry.js";
    script.onload = () => {
      const proxy = { get: (request) => window.app1.get(request) };
      proxy.init = (arg) => window.app1.init(arg);
      resolve(proxy);
    };
    document.head.appendChild(script);
  })`,
}
```

**Troubleshooting**:
- "Shared module is not available for eager consumption" — Add bootstrap file
- "Module does not exist in container" — Check `exposes` configuration
- Set `output.uniqueName` to avoid global namespace conflicts

## Guides Overview

| Guide | Description |
|-------|-------------|
| [Getting Started](https://webpack.js.org/guides/getting-started/) | Basic setup and first build |
| [Asset Management](https://webpack.js.org/guides/asset-management/) | Loading CSS, images, fonts |
| [Output Management](https://webpack.js.org/guides/output-management/) | HTML generation, cleaning dist |
| [Code Splitting](https://webpack.js.org/guides/code-splitting/) | Split bundles for lazy loading |
| [Caching](https://webpack.js.org/guides/caching/) | Long-term caching strategies |
| [Authoring Libraries](https://webpack.js.org/guides/author-libraries/) | Building libraries with webpack |
| [Environment Variables](https://webpack.js.org/guides/environment-variables/) | Using env vars in config |
| [Build Performance](https://webpack.js.org/guides/build-performance/) | Optimization tips |
| [Development](https://webpack.js.org/guides/development/) | Dev workflow, source maps |
| [Production](https://webpack.js.org/guides/production/) | Production optimizations |
| [Tree Shaking](https://webpack.js.org/guides/tree-shaking/) | Dead code elimination |
| [Lazy Loading](https://webpack.js.org/guides/lazy-loading/) | Dynamic imports |
| [Shimming](https://webpack.js.org/guides/shimming/) | Polyfills and globals |
| [TypeScript](https://webpack.js.org/guides/typescript/) | TypeScript integration |
| [Progressive Web Application](https://webpack.js.org/guides/progressive-web-application/) | PWA setup with Workbox |
| [Advanced Entry](https://webpack.js.org/guides/public-path/) | Public path configuration |
| [Integration](https://webpack.js.org/guides/integrations/) | Integration with other tools |
| [Module Federation](https://webpack.js.org/concepts/module-federation/) | Micro-frontends |

## Migration

### Migrate to webpack 5

1. Update to latest webpack 4 and plugins
2. Use `stats` to identify deprecated features
3. Update to webpack 5
4. Remove Node.js polyfills (webpack 5 no longer auto-polyfills)
5. Use Asset Modules instead of `file-loader`/`url-loader`
6. Update `optimization` settings
7. Review `experiments` options

```bash
# Check for deprecated features
npx webpack --stats detailed

# Use webpack CLI for migration
npx webpack-cli migrate
```

## Configuration File

webpack automatically uses `webpack.config.js` in the root folder. Since v4.0.0, no config is required.

```javascript
// webpack.config.js (ESM)
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
};
```

**Use a different configuration file**:
```bash
npx webpack --config webpack.prod.config.js
```

**Multiple configurations**:
```javascript
// webpack.config.js — export array for multiple configs
export default [
  { name: "client", entry: "./client.js", /* ... */ },
  { name: "server", entry: "./server.js", /* ... */ },
];
```

**Set up a new webpack project**:
```bash
npx webpack init
```

**Source**: [Concepts](https://webpack.js.org/concepts/) | [Entry Points](https://webpack.js.org/concepts/entry-points/) | [Output](https://webpack.js.org/concepts/output/) | [Loaders](https://webpack.js.org/concepts/loaders/) | [Plugins](https://webpack.js.org/concepts/plugins/) | [Mode](https://webpack.js.org/concepts/mode/) | [Dependency Graph](https://webpack.js.org/concepts/dependency-graph/) | [Modules](https://webpack.js.org/concepts/modules/) | [HMR](https://webpack.js.org/concepts/hot-module-replacement/) | [Module Federation](https://webpack.js.org/concepts/module-federation/) | [Guides](https://webpack.js.org/guides/) | [Getting Started](https://webpack.js.org/guides/getting-started/) | [Migration](https://webpack.js.org/migrate/) | [Configuration](https://webpack.js.org/configuration/) | [Browser Compatibility](https://webpack.js.org/concepts/) | [Environment](https://webpack.js.org/concepts/)
