# Babel — Configuration & Options

> Babel can be configured through project-wide config files, file-relative config files, or programmatic options. This guide covers all configuration formats, options, and compiler assumptions.

**Configure Babel**: [babeljs.io/docs/configuration](https://babeljs.io/docs/configuration)  
**Config Files**: [babeljs.io/docs/config-files](https://babeljs.io/docs/config-files)  
**Options**: [babeljs.io/docs/options](https://babeljs.io/docs/options)  
**Assumptions**: [babeljs.io/docs/assumptions](https://babeljs.io/docs/assumptions)  

## Configure Babel

### What's Your Use Case?

| Use Case | Recommended Config |
|----------|-------------------|
| Monorepo or compiling `node_modules` | `babel.config.json` (project-wide) |
| Configuration for a single part of a project | `.babelrc.json` (file-relative) |
| Quick setup / general use | `babel.config.json` (recommended) |

### Configuration File Types

Babel has two parallel config file formats:

**Project-wide configuration:**
- `babel.config.json`
- `babel.config.js`
- `babel.config.cjs`
- `babel.config.mjs`
- `babel.config.cts`

**File-relative configuration:**
- `.babelrc.json`
- `.babelrc.js`
- `.babelrc.cjs`
- `.babelrc.mjs`
- `.babelrc.cts`
- `.babelrc` (alias for `.babelrc.json`)
- `package.json` with `"babel"` key

### babel.config.json

Create at the root of your project:

```json
{
  "presets": [...],
  "plugins": [...]
}
```

### .babelrc.json

Create in your project directory:

```json
{
  "presets": [...],
  "plugins": [...]
}
```

### package.json

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "babel": {
    "presets": [...],
    "plugins": [...]
  }
}
```

### JavaScript Configuration Files

```js
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  const presets = [...];
  const plugins = [...];
  return { presets, plugins };
};
```

Dynamic configuration based on environment:

```js
module.exports = function (api) {
  api.cache(true);
  const presets = [...];
  const plugins = [...];
  if (process.env["ENV"] === "prod") {
    plugins.push(...);
  }
  return { presets, plugins };
};
```

## Config Files

### Project-Wide Configuration

New in Babel 7.x. Babel has a concept of a "root" directory (defaults to `cwd`). Babel automatically searches for `babel.config.json` in the root directory.

- Ideal for configuration that must apply broadly
- Allows plugins/presets to apply to files in `node_modules` or symlinked packages
- Can be disabled by setting `configFile` to `false`

### File-Relative Configuration

Babel loads `.babelrc.json` by searching up the directory structure from the file being compiled.

- Allows independent configurations for subsections of a package
- Merged over project-wide config values
- Searching stops at a directory containing `package.json`
- `.babelrc.json` files only apply within their own package
- Can be disabled by setting `babelrc` to `false`

### Monorepos

**Root `babel.config.json` file:**
- Place at monorepo root
- Use `babelrcRoots` to enable `.babelrc.json` in subpackages

**Subpackage `.babelrc.json` files:**
- Each package can have its own overrides
- Must configure `babelrcRoots` in root config

### Supported File Extensions

| Extension | Min Version | Type |
|-----------|-------------|------|
| `.json` | v7.7.0 | Static JSON |
| `.js` | v7.0.0 | JavaScript (CommonJS) |
| `.cjs` | v7.7.0 | CommonJS |
| `.mjs` | v7.8.0 | ES Module |
| `.cts` | v7.21.0 | TypeScript |

### Config Function API

JS config files may export a function that receives a `ConfigAPI`:

```js
/**
 * @param {import("@babel/core").ConfigAPI} api
 * @returns {import("@babel/core").InputOptions}
 */
module.exports = function(api) {
  return {};
};
```

#### api.version

Type: `string` — The Babel version string.

#### api.cache

JS configs compute config on the fly. Babel expects users to manage caching:

- `api.cache.forever()` — Permacache, never call again
- `api.cache.never()` — Don't cache, re-execute every time
- `api.cache.using(() => process.env.NODE_ENV)` — Cache based on value
- `api.cache.invalidate(() => process.env.NODE_ENV)` — Cache + invalidate on change
- `api.cache(true)` — Same as `forever()`
- `api.cache(false)` — Same as `never()`

Best practices:
- Callbacks should be small and side-effect free
- Return values with smallest range possible (e.g. boolean instead of string)

#### api.env(...)

Quick way to check `envName` (takes `NODE_ENV` into account):

- `api.env("production")` — `true` if envName === "production"
- `api.env(["development", "test"])` — `true` if envName is in array
- `api.env()` — Returns current envName string
- `api.env(envName => envName.startsWith("test-"))` — Predicate check

#### api.caller(cb)

Check caller data:
```js
api.caller(caller => caller && caller.name === "babel-loader");
```

#### api.assertVersion(range)

Assert Babel version:
```js
api.assertVersion("^7.0.0");
```

#### api.addExternalDependency(name)

Tell Babel about external dependencies for cache invalidation.

## Options

### Primary Options

| Option | Type | Description |
|--------|------|-------------|
| `cwd` | `string` | Working directory (default: `process.cwd()`) |
| `caller` | `object` | Caller data (name, supportsStaticESM, etc.) |
| `filename` | `string` | Filename being compiled |
| `filenameRelative` | `string` | Relative filename |
| `code` | `string` | Source code to transform |
| `ast` | `boolean` | Include AST in result |
| `cloneInputAst` | `boolean` | Clone input AST (default: `true`) |

### Config Loading Options

| Option | Type | Description |
|--------|------|-------------|
| `root` | `string` | Root directory (default: `cwd`) |
| `rootMode` | `"root"` \| `"upward"` \| `"upward-optional"` | How to determine root |
| `envName` | `string` | Environment name (default: `BABEL_ENV` or `NODE_ENV`) |
| `configFile` | `string` \| `false` | Path to config file or disable |
| `babelrc` | `boolean` | Enable `.babelrc` files (default: `true`) |
| `babelrcRoots` | `string` \| `string[]` \| `boolean` | Packages with `.babelrc` files |

### Plugin and Preset Options

| Option | Type | Description |
|--------|------|-------------|
| `plugins` | `PluginEntry[]` | Plugins to use |
| `presets` | `PresetEntry[]` | Presets to use |
| `passPerPreset` | `boolean` | Run each pass per preset |

### Output Targets

| Option | Type | Description |
|--------|------|-------------|
| `targets` | `string` \| `string[]` \| `object` | Compilation targets |
| `browserslistConfigFile` | `string` \| `false` | Browserslist config file |
| `browserslistEnv` | `string` | Browserslist environment |

### Config Merging Options

| Option | Type | Description |
|--------|------|-------------|
| `extends` | `string` | Path to config to extend |
| `env` | `object` | Environment-specific config |
| `overrides` | `object[]` | Override configurations |
| `test` | `MatchPattern` | Test pattern for overrides |
| `include` | `MatchPattern` | Include pattern |
| `exclude` | `MatchPattern` | Exclude pattern |
| `ignore` | `MatchPattern[]` | Files to ignore |
| `only` | `MatchPattern[]` | Files to include |

### Source Map Options

| Option | Type | Description |
|--------|------|-------------|
| `inputSourceMap` | `object` \| `boolean` | Input source map |
| `sourceMaps` | `boolean` \| `"inline"` \| `"both"` | Generate source maps |
| `sourceMap` | `boolean` | (Deprecated) Generate source map |
| `sourceFileName` | `string` | Source filename for map |
| `sourceRoot` | `string` | Source root for map |

### Misc Options

| Option | Type | Description |
|--------|------|-------------|
| `sourceType` | `"script"` \| `"module"` \| `"unambiguous"` | Source type |
| `assumptions` | `object` | Compiler assumptions |
| `highlightCode` | `boolean` | Highlight code in errors |
| `parserOpts` | `object` | Parser options |
| `generatorOpts` | `object` | Generator options |

### Code Generator Options

| Option | Type | Description |
|--------|------|-------------|
| `retainLines` | `boolean` | Retain line numbers |
| `compact` | `boolean` \| `"auto"` | Compact output |
| `minified` | `boolean` | Minified output |
| `auxiliaryCommentBefore` | `string` | Comment before helpers |
| `auxiliaryCommentAfter` | `string` | Comment after helpers |
| `comments` | `boolean` | Include comments |
| `shouldPrintComment` | `function` | Custom comment filter |

### AMD/UMD/SystemJS Module Options

| Option | Type | Description |
|--------|------|-------------|
| `moduleIds` | `boolean` | Include module IDs |
| `moduleId` | `string` | Module ID |
| `getModuleId` | `function` | Custom module ID function |
| `moduleRoot` | `string` | Module root |

### Options Concepts

#### MatchPattern

```js
// String glob pattern
"src/**/*.js"
// RegExp
/src\//
// Function
(filename) => filename.includes("test")
// Array of above
["src/**/*.js", /test\//]
```

#### Merging

Config merging follows these rules:
- Plugins/presets are concatenated
- Object options are merged with later ones taking precedence
- `env` and `overrides` are applied contextually

#### Plugin/Preset Entries

```js
// String (npm package or path)
"plugin-name"
// Array with options
["plugin-name", { option: true }]
// Object with explicit properties
{ plugins: [...], presets: [...] }
```

#### Name Normalization

Babel normalizes plugin/preset names:
- `babel-plugin-foo` → `foo`
- `@babel/plugin-foo` → `@babel/foo`
- `@scope/babel-plugin-foo` → `@scope/foo`

### Print Effective Configs

```bash
# *nix or WSL
BABEL_SHOW_CONFIG_FOR=./src/myComponent.jsx npm start

# PowerShell
$env:BABEL_SHOW_CONFIG_FOR = ".\src\myComponent.jsx"; npm start
```

Priority order (ascending):
```
babel.config.json < .babelrc < programmatic options
```

### How Babel Merges Config Items

1. Project-wide config (`babel.config.json`)
2. File-relative config (`.babelrc.json`)
3. Programmatic options from CLI/API

Each config source can have `overrides` and `env` items, applied in ascending priority order.

## Compiler Assumptions

By default, Babel compiles code to match native behavior. Assumptions allow trading spec compliance for smaller/faster output.

### Available Assumptions

| Assumption | Description |
|------------|-------------|
| `arrayLikeIsIterable` | Treat array-like objects as iterables when spreading |
| `constantReexports` | Re-exported bindings don't change |
| `constantSuper` | Super class is never changed via `Object.setPrototypeOf` |
| `enumerableModuleMeta` | `__esModule` can be enumerable |
| `ignoreFunctionLength` | Code doesn't rely on `function.length` |
| `ignoreToPrimitiveHint` | `[Symbol.toPrimitive]` doesn't change behavior based on hint |
| `iterableIsArray` | Iterables are always arrays |
| `mutableTemplateObject` | Don't freeze tagged template objects |
| `noClassCalls` | Classes are always instantiated with `new` |
| `noDocumentAll` | `document.all` doesn't exist |
| `noIncompleteNsImportDetection` | Don't detect incomplete namespace imports |
| `noNewArrows` | Arrow functions are never called with `new` |
| `noUninitializedPrivateFieldAccess` | No access to uninitialized private fields |
| `objectRestNoSymbols` | Object rest doesn't include symbol properties |
| `privateFieldsAsProperties` | Private fields as `WeakMap` with properties |
| `privateFieldsAsSymbols` | Private fields as `Symbol` properties |
| `pureGetters` | Getters have no side effects |
| `setClassMethods` | Class methods are assigned to prototype |
| `setComputedProperties` | Computed properties use simple assignment |
| `setPublicClassFields` | Public class fields use assignment |
| `setSpreadProperties` | Spread uses `Object.assign` |
| `skipForOfIteratorClosing` | Skip iterator closing in `for..of` |
| `superIsCallableConstructor` | Super is always a callable constructor |

### Migrating from `loose` and `spec` Modes

In Babel 8, `@babel/preset-env`'s `loose` and `spec` options are removed. Use top-level `assumptions` instead:

```js
// Before (Babel 7)
{
  "presets": [
    ["@babel/preset-env", { "loose": true }]
  ]
}

// After (Babel 8)
{
  "presets": ["@babel/preset-env"],
  "assumptions": {
    "arrayLikeIsIterable": true,
    "constantReexports": true,
    "constantSuper": true,
    "enumerableModuleMeta": true,
    "ignoreFunctionLength": true,
    "ignoreToPrimitiveHint": true,
    "iterableIsArray": true,
    "mutableTemplateObject": true,
    "noClassCalls": true,
    "noDocumentAll": true,
    "noNewArrows": true,
    "objectRestNoSymbols": true,
    "privateFieldsAsProperties": true,
    "pureGetters": true,
    "setClassMethods": true,
    "setComputedProperties": true,
    "setPublicClassFields": true,
    "setSpreadProperties": true,
    "skipForOfIteratorClosing": true,
    "superIsCallableConstructor": true
  }
}
```
