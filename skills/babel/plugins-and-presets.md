# Babel — Plugins & Presets

> Plugins and presets are the core building blocks of Babel's transformation pipeline. This guide covers using, creating, and ordering plugins and presets, plus the full plugin list and official presets.

**Plugins**: [babeljs.io/docs/plugins](https://babeljs.io/docs/plugins)  
**Plugins List**: [babeljs.io/docs/plugins-list](https://babeljs.io/docs/plugins-list)  
**Presets**: [babeljs.io/docs/presets](https://babeljs.io/docs/presets)  
**@babel/preset-env**: [babeljs.io/docs/babel-preset-env](https://babeljs.io/docs/babel-preset-env)  
**@babel/preset-react**: [babeljs.io/docs/babel-preset-react](https://babeljs.io/docs/babel-preset-react)  
**@babel/preset-typescript**: [babeljs.io/docs/babel-preset-typescript](https://babeljs.io/docs/babel-preset-typescript)  
**@babel/preset-flow**: [babeljs.io/docs/babel-preset-flow](https://babeljs.io/docs/babel-preset-flow)  

## Plugins

### Using a Plugin

```json
{
  "plugins": ["babel-plugin-myPlugin", "@babel/plugin-transform-runtime"]
}
```

Specify a relative/absolute path:
```json
{
  "plugins": ["./node_modules/asdf/plugin"]
}
```

### Transform Plugins

Transform plugins apply transformations to your code. They automatically enable the corresponding syntax plugin.

### Syntax Plugins

Most syntax is transformable. For rare cases, use syntax plugins to only allow parsing (no transform):

```json
{
  "parserOpts": {
    "plugins": ["jsx", "flow"]
  }
}
```

### Plugin Ordering

Ordering matters:
- **Plugins run before Presets**
- **Plugin ordering is first to last**
- **Preset ordering is reversed (last to first)**

```json
{
  "plugins": ["transform-decorators-legacy", "transform-class-properties"]
}
```
Runs `transform-decorators-legacy` then `transform-class-properties`.

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```
Runs `@babel/preset-react` then `@babel/preset-env`.

### Plugin Options

```json
{
  "plugins": [
    ["transform-async-to-module-method", {
      "module": "bluebird",
      "method": "coroutine"
    }]
  ]
}
```

No options (all equivalent):
```json
{
  "plugins": ["pluginA", ["pluginA"], ["pluginA", {}]]
}
```

### Plugin Development

```js
export default function() {
  return {
    visitor: {
      Identifier(path) {
        const name = path.node.name;
        // reverse the name: JavaScript -> tpircSavaJ
        path.node.name = name.split("").reverse().join("");
      },
    },
  };
}
```

Refer to the [babel-handbook](https://github.com/thejameskyle/babel-handbook) for detailed plugin development.

## Plugins List

### TC39 Proposals

#### Stage 3
- `proposal-decorators` — Decorators
- `proposal-import-wasm-source` — Import WASM source

#### Early Stages
- `proposal-do-expressions` — Do expressions
- `proposal-export-default-from` — Export default from
- `proposal-function-bind` — Function bind (`::`)
- `proposal-function-sent` — Function sent
- `proposal-partial-application` — Partial application
- `proposal-pipeline-operator` — Pipeline operator (`|>`)
- `proposal-throw-expressions` — Throw expressions
- `proposal-record-and-tuple` — Record and tuple

### ES2026
- `transform-explicit-resource-management` — `using` declarations

### ES2025
- `transform-duplicate-named-capturing-groups-regex` — Duplicate named capturing groups
- `transform-json-modules` — JSON modules
- `transform-regexp-modifiers` — RegExp modifiers

### ES2024
- `transform-unicode-sets-regex` — Unicode sets in regex

### ES2022
- `transform-class-properties` — Class properties
- `transform-class-static-block` — Class static blocks
- `transform-private-property-in-object` — Private property in object
- `transform-private-methods` — Private methods

### ES2021
- `transform-logical-assignment-operators` — `||=`, `&&=`, `??=`
- `transform-numeric-separator` — `1_000_000`

### ES2020
- `transform-dynamic-import` — `import()`
- `transform-export-namespace-from` — `export * as ns from`
- `transform-nullish-coalescing-operator` — `??`
- `transform-optional-chaining` — `?.`

### ES2019
- `transform-optional-catch-binding` — Optional catch binding
- `transform-json-strings` — JSON strings

### ES2018
- `transform-async-generator-functions` — Async generators
- `transform-dotall-regex` — `s` flag in regex
- `transform-named-capturing-groups-regex` — Named capturing groups
- `transform-object-rest-spread` — Object rest/spread
- `transform-unicode-property-regex` — Unicode property regex

### ES2017
- `transform-async-to-generator` — `async`/`await`

### ES2016
- `transform-exponentiation-operator` — `**`

### ES2015
- `transform-arrow-functions` — Arrow functions
- `transform-block-scoped-functions` — Block-scoped functions
- `transform-block-scoping` — `let`/`const`
- `transform-classes` — Classes
- `transform-computed-properties` — Computed properties
- `transform-destructuring` — Destructuring
- `transform-duplicate-keys` — Duplicate keys in objects
- `transform-for-of` — `for..of`
- `transform-function-name` — Function name
- `transform-instanceof` — `instanceof`
- `transform-literals` — Literals
- `transform-new-target` — `new.target`
- `transform-object-super` — `super` in objects
- `transform-parameters` — Default/rest/spread parameters
- `transform-shorthand-properties` — Shorthand properties
- `transform-spread` — Spread
- `transform-sticky-regex` — Sticky regex
- `transform-template-literals` — Template literals
- `transform-typeof-symbol` — `typeof Symbol`
- `transform-unicode-escapes` — Unicode escapes
- `transform-unicode-regex` — Unicode regex

### ES5
- `transform-property-mutators` — Property mutators

### ES3
- `transform-member-expression-literals` — Member expression literals
- `transform-property-literals` — Property literals
- `transform-reserved-words` — Reserved words

### Module Formats
- `transform-modules-amd` — AMD modules
- `transform-modules-commonjs` — CommonJS modules
- `transform-modules-systemjs` — SystemJS modules
- `transform-modules-umd` — UMD modules

### React
- `transform-react-constant-elements` — Constant elements
- `transform-react-inline-elements` — Inline elements

#### React Preset Plugins
- `transform-react-display-name` — Display name
- `transform-react-jsx` — JSX transform (automatic runtime)
- `transform-react-jsx-compat` — JSX compat
- `transform-react-jsx-self` — JSX self (dev)
- `transform-react-jsx-source` — JSX source (dev)

### Flow
- `transform-flow-strip-types` — Strip Flow types

### TypeScript
- `transform-typescript` — Strip TypeScript types

### Misc
- `external-helpers` — External helpers
- `transform-jscript` — JScript compat
- `transform-object-assign` — `Object.assign`
- `transform-object-set-prototype-of-to-assign` — `setPrototypeOf` to assign
- `transform-proto-to-assign` — `__proto__` to assign
- `transform-regenerator` — Regenerator (generators)
- `transform-runtime` — Runtime helpers
- `transform-strict-mode` — Strict mode

### Syntax Only
- `syntax-bigint` — BigInt (ES2020)
- `syntax-dynamic-import` — Dynamic import (ES2020)
- `syntax-import-meta` — `import.meta` (ES2020)
- `syntax-top-level-await` — Top-level await (ES2022)

## Presets

### Official Presets

| Preset | Description |
|--------|-------------|
| `@babel/preset-env` | Smart preset for ES2015+ syntax |
| `@babel/preset-typescript` | TypeScript type stripping |
| `@babel/preset-react` | React JSX transform |
| `@babel/preset-flow` | Flow type stripping |

### Other Integrations

Frameworks with their own Babel configuration:
- Next.js
- Nuxt.js
- Parcel
- Jest
- Gatsby

### Using a Preset

```json
{
  "presets": ["babel-preset-myPreset", "@babel/preset-env"]
}
```

Relative/absolute path:
```json
{
  "presets": ["./myProject/myPreset"]
}
```

### Creating a Preset

```js
module.exports = function() {
  return {
    plugins: [
      require("@babel/plugin-transform-arrow-functions"),
      require("@babel/plugin-transform-classes"),
    ],
  };
};
```

### Preset Ordering

Presets run in **reverse** order (last to first):
```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```
Runs `@babel/preset-react` then `@babel/preset-env`.

### Preset Options

```json
{
  "presets": [
    ["env", { "loose": true, "modules": false }]
  ]
}
```

### Stage-X (Experimental Presets)

> **Deprecated** as of Babel 7. Stage-X presets are no longer published. Use individual proposal plugins instead.

TC39 proposal stages:
- **Stage 0** — Strawman: just an idea
- **Stage 1** — Proposal: worth working on
- **Stage 2** — Draft: initial spec
- **Stage 3** — Candidate: complete spec, initial browser implementations
- **Stage 4** — Finished: added to next yearly release

## @babel/preset-env

A smart preset that allows using the latest JavaScript without micromanaging syntax transforms and browser polyfills.

### Install

```bash
npm install --save-dev @babel/preset-env
```

### How Does it Work?

`@babel/preset-env` uses:
- **browserslist** — Target browser configuration
- **compat-table** — Feature compatibility data
- **electron-to-chromium** — Electron version mapping

It maintains mappings of which browser versions support which syntax/features, and maps those to Babel plugins and core-js polyfills.

- Only includes Stage 3+ proposals (not earlier stages)
- `shippedProposals` option includes Stage 3 proposals with browser implementations

### Browserslist Integration

Use a `.browserslistrc` file to specify targets:

```
> 0.25%
not dead
```

```json
{
  "presets": [
    ["@babel/preset-env", {
      "useBuiltIns": "entry",
      "corejs": "3.22"
    }]
  ]
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `targets` | `string` \| `string[]` \| `object` | `{}` | Compilation targets |
| `bugfixes` | — | — | Removed in Babel 8 (always enabled) |
| `loose` | — | — | Removed in Babel 8 (use `assumptions`) |
| `spec` | — | — | Removed in Babel 8 (use `assumptions`) |
| `modules` | `"amd"` \| `"umd"` \| `"systemjs"` \| `"commonjs"` \| `"cjs"` \| `"auto"` \| `false` | `"auto"` | Module transformation |
| `debug` | `boolean` | `false` | Print enabled plugins/polyfills |
| `include` | `string[]` | `[]` | Always include these plugins |
| `exclude` | `string[]` | `[]` | Always exclude these plugins |
| `useBuiltIns` | — | — | Removed in Babel 8 (use `babel-plugin-polyfill-corejs3`) |
| `corejs` | — | — | Removed in Babel 8 |
| `forceAllTransforms` | `boolean` | `false` | Apply all transforms (for production) |
| `configPath` | `string` | `cwd` | Path to browserslist config |
| `ignoreBrowserslistConfig` | `boolean` | `false` | Ignore browserslist config |
| `browserslistEnv` | `string` | — | Browserslist environment |
| `shippedProposals` | `boolean` | `false` | Include shipped Stage 3 proposals |

#### modules: "auto"

By default, uses `caller` data to determine whether to transform ES modules. Generally specified by bundler plugins (`babel-loader`, `@rollup/plugin-babel`).

### useBuiltIns (Babel 7)

#### useBuiltIns: "entry"

Replaces `import "core-js"` with individual imports based on environment:

```js
// In
import "core-js";
// Out
import "core-js/modules/es.string.pad-start";
import "core-js/modules/es.string.pad-end";
```

#### useBuiltIns: "usage"

Adds polyfill imports only when features are used:

```js
// In
var a = new Promise();
// Out (if environment doesn't support it)
import "core-js/modules/es.promise";
var a = new Promise();
```

#### useBuiltIns: false

Don't add polyfills automatically.

### Caveats

#### Ineffective browserslist queries

Some browserslist queries may not work as expected. Use `npx browserslist` to verify.

## @babel/preset-react

### Installation

```bash
npm install --save-dev @babel/preset-react
```

### Usage

```json
{
  "presets": ["@babel/preset-react"]
}
```

Via CLI:
```bash
npx babel --presets=@babel/preset-react
```

Via Node API:
```js
require("@babel/core").transformSync("code", {
  presets: ["@babel/preset-react"],
});
```

### Options

#### Both Runtimes

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `runtime` | `"classic"` \| `"automatic"` | `"automatic"` | JSX runtime |
| `development` | `boolean` | `true` if env is "development" | Development mode |
| `developmentSourceSelf` | `boolean` | `false` | Generate `__source`/`__self` (React < 19.2) |
| `throwIfNamespace` | `boolean` | `true` | Throw on XML namespaced tags |
| `pure` | `boolean` | `true` | Mark top-level React calls as pure |

#### React Automatic Runtime

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `importSource` | `string` | `"react"` | Import source for JSX functions |

#### React Classic Runtime

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pragma` | `string` | `"React.createElement"` | JSX pragma function |
| `pragmaFrag` | `string` | `"React.Fragment"` | JSX fragment pragma |

```js
// babel.config.js
module.exports = {
  presets: [
    ["@babel/preset-react", {
      development: process.env.BABEL_ENV === "development",
    }],
  ],
};
```

## @babel/preset-typescript

### Installation

```bash
npm install --save-dev @babel/preset-typescript
```

### Usage

```json
{
  "presets": ["@babel/preset-typescript"]
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `jsxPragma` | `string` | `"React"` | JSX pragma (not removed as type import) |
| `jsxPragmaFrag` | `string` | `"React.Fragment"` | JSX fragment pragma |
| `allowNamespaces` | `boolean` | — | Enable TypeScript namespaces |
| `allowDeclareFields` | `boolean` | `false` | Only remove `declare` fields |
| `disallowAmbiguousJSXLike` | `boolean` | `true` for `.mts`/`.cts` | Disallow JSX-ambiguous syntax |
| `ignoreExtensions` | `boolean` | `false` | Don't auto-detect TS extensions |
| `onlyRemoveTypeImports` | `boolean` | `false` | Only remove type-only imports |
| `optimizeConstEnums` | `boolean` | `false` | Optimize const enums |
| `rewriteImportExtensions` | `boolean` | `false` | Rewrite `.ts`/`.tsx` to `.js`/`.jsx` |

```ts
// allowDeclareFields: true
class A {
  declare foo: string;  // Removed
  bar: string;          // Initialized to undefined
  prop?: string;        // Initialized to undefined
  prop1!: string;       // Initialized to undefined
}
```

## @babel/preset-flow

### Installation

```bash
npm install --save-dev @babel/preset-flow
```

### Usage

```json
{
  "presets": ["@babel/preset-flow"]
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `all` | `boolean` | `false` | Strip all types (not just Flow-annotated files) |
| `allowDeclareFields` | `boolean` | `false` | Only remove `declare` fields |
