# SWC Configuration

## .swcrc

SWC can be configured with an `.swcrc` file (similar to `.babelrc` for Babel).

### Default Configuration

```json
{
  "$schema": "https://swc.rs/schema.json",
  "jsc": {
    "parser": {
      "syntax": "ecmascript",
      "jsx": false,
      "dynamicImport": false,
      "privateMethod": false,
      "functionBind": false,
      "exportDefaultFrom": false,
      "exportNamespaceFrom": false,
      "decorators": false,
      "decoratorsBeforeExport": false,
      "topLevelAwait": false,
      "importMeta": false,
      "preserveAllComments": false
    },
    "transform": null,
    "target": "es5",
    "loose": false,
    "externalHelpers": false,
    "keepClassNames": false
  },
  "isModule": false
}
```

### Key Configuration Sections

- **`jsc`**: JavaScript/TypeScript compilation config
- **`env`**: preset-env equivalent (target browsers, polyfills)
- **`module`**: Module system config
- **`minify`**: Enable minification
- **`isModule`**: Whether input is a module (auto-detected if omitted)

## Compilation (jsc)

### jsc.parser

| Option | Description | Default |
|--------|-------------|---------|
| `syntax` | `"ecmascript"`, `"typescript"`, or `"flow"` | `"ecmascript"` |
| `jsx` | Enable JSX parsing | `false` |
| `tsx` | Enable TSX parsing (TypeScript only) | `false` |
| `dynamicImport` | Enable `import()` | `false` |
| `privateMethod` | Enable private class methods | `false` |
| `functionBind` | Enable function bind (`::`) | `false` |
| `exportDefaultFrom` | Enable `export x from "mod"` | `false` |
| `exportNamespaceFrom` | Enable `export * as ns from "mod"` | `false` |
| `decorators` | Enable decorators | `false` |
| `decoratorsBeforeExport` | Decorators before export | `false` |
| `topLevelAwait` | Enable top-level await | `false` |
| `importMeta` | Enable `import.meta` | `false` |
| `preserveAllComments` | Preserve all comments | `false` |

### jsc.transform

React/JSX transform options:
- `react.runtime`: `"automatic"` (default) or `"classic"`
- `react.importSource`: Import source for JSX (default: `"react"`)
- `react.development`: Enable React development mode
- `react.useBuiltins`: Use `Object.assign` for spread
- `react.throwIfNamespace`: Throw on XML namespaces

### jsc.target

ECMAScript target: `"es3"`, `"es5"`, `"es2015"`, `"es2016"`, ..., `"es2022"`, `"esnext"`

### jsc.loose

Enable loose mode (simpler, less spec-compliant transforms).

### jsc.externalHelpers

Use external helpers (`@swc/helpers`) instead of inline. Requires v1.2.50+ and target es2016+.

### jsc.keepClassNames

Preserve class names (useful for debugging). Requires v1.2.50+ and target es2016+.

## env (preset-env equivalent)

SWC's alternative for Babel's preset-env. Set target browsers, use browserslist, control transforms.

> Note: `env` does not work with `jsc.target`.

### env.targets

Possible values:
- **Query string**: `"Chrome >= 48"`
- **Array of queries**: `["last 2 versions", "not dead"]`
- **Version map**: `{ "chrome": "79", "firefox": "75" }`

```json
{
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "tsx": true
    },
    "externalHelpers": true
  },
  "env": {
    "targets": "Chrome >= 48"
  }
}
```

Supported environments: `chrome`, `opera`, `edge`, `firefox`, `safari`, `ie`, `ios`, `android`, `node`, `electron`

If `targets` is not specified, SWC uses browserslist.

### env.mode

- `"usage"`: Import polyfills per-file based on usage
- `"entry"`: Import all polyfills at entry point
- `false` (default): No polyfill injection

### env.coreJs

Version of core-js to use (e.g., `"3.22"`). Recommended to specify minor version. Defaults to `core-js@3.0.0` when undefined.

```json
{
  "jsc": {
    "parser": {
      "syntax": "ecmascript",
      "jsx": true
    }
  },
  "env": {
    "mode": "usage",
    "coreJs": "3.26.1"
  }
}
```

### env.skip

Array of features/modules to skip:

```json
{
  "env": {
    "skip": ["core-js/modules/foo"]
  }
}
```

### env.include

Force-include specific transforms:

```json
{
  "env": {
    "targets": { "chrome": "79" },
    "include": [
      "transform-async-to-generator",
      "transform-regenerator"
    ]
  }
}
```

### env.exclude

Array of features/modules to exclude.

### Other env options

| Option | Type | Description |
|--------|------|-------------|
| `debug` | Bool | Enable debug logging |
| `dynamicImport` | Bool | Enable dynamic import |
| `loose` | Bool | Enable loose mode |
| `shippedProposals` | Bool | Use shipped proposals |
| `forceAllTransforms` | Bool | Force all transforms |
| `bugfixes` | Bool | Enable bugfix passes |
| `path` | string | Currently noop |

## Modules

SWC can transpile ES Modules to CommonJS, UMD, or AMD. By default, module statements remain untouched.

### CommonJS

```json
{
  "$schema": "https://swc.rs/schema.json",
  "module": {
    "type": "commonjs",
    "strict": false,
    "strictMode": true,
    "lazy": false,
    "noInterop": false
  }
}
```

### ES6

```json
{
  "module": {
    "type": "es6",
    "strict": false,
    "strictMode": true,
    "lazy": false,
    "noInterop": false
  }
}
```

### AMD

```json
{
  "module": {
    "type": "amd",
    "moduleId": "foo",
    "strict": false,
    "strictMode": true,
    "lazy": false,
    "noInterop": false
  }
}
```

### UMD

```json
{
  "module": {
    "type": "umd",
    "globals": {},
    "strict": false,
    "strictMode": true,
    "lazy": false,
    "noInterop": false
  }
}
```

### Shared Module Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | string | — | `"commonjs"`, `"es6"`, `"amd"`, `"umd"` |
| `strict` | bool | `false` | Prevent `__esModule` property from being exported |
| `strictMode` | bool | `true` | Emit `'use strict'` directive |
| `lazy` | bool/array | `false` | Lazy-initialize imported modules |
| `noInterop` | bool | `false` | Disable interop |
| `ignoreDynamic` | bool | `false` | Ignore dynamic imports |
| `preserveImportMeta` | bool | `false` | Preserve `import.meta` |
| `outFileExtension` | string | `"js"` | Output file extension |

### lazy option

- `false`: No lazy initialization
- `true`: Lazy-init dependency imports, but not local `./foo` imports
- `Array<string>`: Lazy-initialize imports matching given strings

Imports that can never be lazy:
- `import "foo"` (side-effect imports)
- `export from "foo"` (re-exporting requires up-front execution)

## Minification

Starting with v1.2.67, enable minification in `.swcrc`:

```json
{
  "minify": true,
  "jsc": {
    "minify": {
      "compress": {
        "unused": true
      },
      "mangle": true
    }
  }
}
```

### Minifier Assumptions

SWC Minifier makes assumptions (similar to other minifiers):
- `.toString()` and `.valueOf()` don't have side effects
- `undefined`, `NaN`, `Infinity` have not been redefined
- `arguments.callee`, `arguments.caller`, `Function.prototype.caller` are not used
- `Function.prototype.toString()` and `Error.prototype.stack` contents are not relied upon
- Getting/setting properties on plain objects has no side effects
- Object properties can be added/removed/modified (not frozen/sealed)
- `document.all` is not null
- Assigning properties to a class doesn't have side effects
- Accessing declared top-level identifiers has no side effects
- TDZ violations do not exist (will be ignored)
- Arithmetic expressions may not have side effects

### Comment Handling

If `jsc.minify.compress` is `true` or `{}`, SWC removes all comments (v1.11.11+). To preserve comments, modify `jsc.minify.format`.

### Using with Bundlers

- [swcMinify with Terser Webpack Plugin](https://webpack.js.org/plugins/terser-webpack-plugin/)
- [SWC Minify Webpack Plugin](https://www.npmjs.com/package/swc-minify-webpack-plugin)

## Supported Browsers

Starting with v1.1.10, use browserslist to automatically configure supported browsers.

### Configuration

```json
{
  "env": {
    "targets": {
      "chrome": "79"
    },
    "mode": "entry",
    "coreJs": "3.22"
  }
}
```

### targets

- **Browserslist query**: `"> 0.25%, not dead"`
- **Version object**: `{ "chrome": "58", "ie": "11" }`

If `targets` is not specified, SWC uses browserslist config files (`.browserslistrc` or `package.json` browserslist field).

### path

Directory to load browserslist config from. Useful when build system isn't in project root.

### mode

- `"usage"`: Per-file polyfill imports based on usage
- `"entry"`: All polyfills at entry point
- `undefined` (default): No polyfill injection

> Note: `usage` mode is not as efficient as Babel for dynamic property access like `"foo"["a" + "t"]()`.

### coreJs

Version of core-js (e.g., `"3.22"`). Specify minor version — `"3"` is interpreted as `"3.0"`. Defaults to `core-js@3.0.0` when undefined.

## Bundling Configuration (spack)

> **Note**: This feature will be dropped in v2. Use SWC-based bundlers (Parcel 2, Turbopack, Rspack, fe-farm) instead.

Configure bundling using `spack.config.js`:

```js
const { config } = require("@swc/core/spack");

module.exports = config({
  entry: {
    web: __dirname + "/src/index.ts",
  },
  output: {
    path: __dirname + "/lib",
  },
});
```

### mode

Possible values: `production`, `debug`, `none`. Currently not used, but will behave similarly to webpack.

### entry

Determines the entry of bundling. Can be a file path or a map of bundle name to file path. Must be absolute path (use `__dirname`).

### output

Controls the output directory:

```js
output: {
  path: __dirname + "/lib",
  name: "index.js", // optional
}
```

### options

Optional field to control SWC behavior during bundling.
