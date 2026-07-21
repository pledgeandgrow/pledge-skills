# ESLint — Configuration

> ESLint is designed to be flexible and configurable. You can turn off every rule and run only with basic syntax validation, or mix and match the bundled rules and your custom rules to fit the needs of your project.

## Configuration Methods

1. **Configuration Comments** — use JavaScript comments to embed configuration directly into a file
2. **Configuration Files** — use a JavaScript file (`eslint.config.js`) to specify configuration for an entire directory tree

## Configuration Files

### File Format

The ESLint configuration file may be named:
- `eslint.config.js`
- `eslint.config.mjs`
- `eslint.config.cjs`
- `eslint.config.ts` (requires additional setup)
- `eslint.config.mts` (requires additional setup)
- `eslint.config.cts` (requires additional setup)

It should be placed in the root directory and export an array of configuration objects:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    rules: {
      semi: "error",
      "prefer-const": "error",
    },
  },
]);
```

### Configuration Objects

Each configuration object contains:

| Property | Description |
|----------|-------------|
| `name` | Name for error messages and config inspector |
| `basePath` | Path to a subdirectory the config applies to |
| `files` | Array of glob patterns for files to apply to |
| `ignores` | Array of glob patterns for files to exclude |
| `extends` | Array of strings, config objects, or config arrays to inherit from |
| `language` | Language for linting (e.g. `"js/js"`, `"markdown/commonmark"`) |
| `languageOptions` | Settings for the language (ecmaVersion, sourceType, globals, parser, parserOptions) |
| `linterOptions` | Linting process settings (noInlineConfig, reportUnusedDisableDirectives, reportUnusedInlineConfigs) |
| `processor` | Object or string for a plugin processor |
| `plugins` | Object mapping plugin names to plugin objects |
| `rules` | Object mapping rule names to severity/config |

### Specify Files and Ignores

```js
export default defineConfig([
  // Global ignores (no other keys)
  {
    ignores: ["**/dist/**", "**/node_modules/**"],
  },
  // Apply to specific files
  {
    files: ["src/**/*.js"],
    rules: {
      semi: "error",
    },
  },
  // AND operation: all patterns must match
  {
    files: ["src/**/*.js", "src/**/*.ts"],
    rules: { "no-console": "warn" },
  },
  // Exclude with ignores within a config object
  {
    files: ["**/*.js"],
    ignores: ["**/*.test.js"],
    rules: { "no-var": "error" },
  },
]);
```

### Cascading Configuration Objects

Configuration objects are applied in order, with later objects overriding earlier ones:

```js
export default defineConfig([
  { rules: { semi: "error" } },
  { rules: { semi: "off" } },  // Overrides previous
]);
```

### Configure Linter Options

```js
{
  linterOptions: {
    noInlineConfig: true,                         // Prevent inline config comments
    reportUnusedDisableDirectives: "warn",        // Report unused eslint-disable
    reportUnusedInlineConfigs: "off",             // Report unused inline configs
  },
}
```

### Configure Rules

```js
{
  rules: {
    "semi": "error",                              // "off" | "warn" | "error" | 0 | 1 | 2
    "prefer-const": ["error", { destructuring: "any" }],
    "no-console": "off",
  },
}
```

### Configure Shared Settings

```js
{
  settings: {
    "import/resolver": {
      node: { extensions: [".js", ".jsx"] },
    },
  },
}
```

### Extending Configurations

The `extends` key inherits all traits of another configuration:

```js
// Use configurations from plugins
import examplePlugin from "eslint-plugin-example";

export default defineConfig([
  {
    files: ["**/*.js"],
    plugins: { example: examplePlugin },
    extends: ["example/recommended"],
  },
]);

// Use predefined configurations
import js from "@eslint/js";

export default defineConfig([
  {
    files: ["**/*.js"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: { "no-unused-vars": "warn" },
  },
]);

// Use a shareable configuration package
import standard from "eslint-config-standard";

export default defineConfig([
  {
    files: ["**/*.js"],
    extends: [standard],
  },
]);
```

**Predefined configurations:**
- `js/recommended` — rules ESLint recommends to avoid potential errors
- `js/all` — all rules shipped with ESLint (not recommended for production)

### Configuration Naming Conventions

Plugin configs follow the pattern `pluginName/configName`:
- `js/recommended`
- `js/all`
- `example/recommended`

### Configuration File Resolution

ESLint searches for config files starting from the directory of the file being linted, up to the root directory.

### TypeScript Configuration Files

ESLint supports TypeScript config files (`eslint.config.ts`, `.mts`, `.cts`):
- **Native TypeScript Support**: Available with `--flag ts_config`
- **Configuration File Precedence**: `.js` > `.mjs` > `.cjs` > `.ts` > `.mts` > `.cts`

## Configure Language Options

### Specify JavaScript Options

```js
{
  languageOptions: {
    ecmaVersion: "latest",        // 5, 6, ... 2024, "latest"
    sourceType: "module",         // "script" | "module" | "commonjs"
    globals: { ... },             // Additional global variables
    parser: espree,               // Custom parser
    parserOptions: { ... },       // Parser-specific options
  },
}
```

### Specify Parser Options

```js
{
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
        globalReturn: true,
        impliedStrict: true,
      },
    },
  },
}
```

### Specify Globals

```js
// Using configuration comments
/* global var1, var2 */
/* global var1: writable, var2: readonly */

// Using configuration files
{
  languageOptions: {
    globals: {
      var1: "writable",
      var2: "readonly",
      Promise: "off",
    },
  },
}

// Using globals package
import globals from "globals";

{
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
      ...globals.es2025,
    },
  },
}
```

**Predefined global variables:**
- `globals.browser` — browser environment
- `globals.node` — Node.js environment
- `globals.es2025` — ES2025 globals
- `globals.worker` — Web Worker environment
- `globals.commonjs` — CommonJS environment

## Configure Rules

### Rule Severities

- `"off"` or `0` — turn the rule off
- `"warn"` or `1` — turn the rule on as a warning (doesn't affect exit code)
- `"error"` or `2` — turn the rule on as an error (triggers exit code 1)

```js
// Configuration file
{
  rules: {
    "semi": "error",
    "no-unused-vars": "warn",
    "no-console": "off",
    " quotes": ["error", "double", { "avoidEscape": true }],
  },
}
```

```js
// Configuration comments
/* eslint eqeqeq: "off" */
/* eslint semi: ["error", "always"] */
/* eslint-disable no-console */
/* eslint-enable no-console */
/* eslint-disable-next-line no-unused-vars */
// eslint-disable-line no-unused-vars
```

### Rules from Plugins

```js
{
  plugins: {
    react: reactPlugin,
  },
  rules: {
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
  },
}
```

### Disable Rules

```js
// Configuration file
{
  rules: {
    "no-console": "off",
  },
}

// Inline comments
/* eslint-disable */                  // Disable all rules
/* eslint-enable */                   // Re-enable all rules
/* eslint-disable no-console */       // Disable specific rule
/* eslint-enable no-console */        // Re-enable specific rule
/* eslint-disable-next-line */        // Disable next line
/* eslint-disable-next-line no-console */
// eslint-disable-line no-console     // Disable current line
```

## Configure Plugins

```js
// Configure a plugin
import eslintPluginExample from "eslint-plugin-example";

export default defineConfig([
  {
    plugins: {
      example: eslintPluginExample,
    },
    rules: {
      "example/rule-name": "error",
    },
  },
]);

// Configure a local plugin
const localPlugin = {
  rules: {
    "my-rule": { /* ... */ },
  },
};

export default defineConfig([
  {
    plugins: { local: localPlugin },
    rules: { "local/my-rule": "error" },
  },
]);

// Configure a virtual plugin
export default defineConfig([
  {
    plugins: {
      virtual: {
        rules: {
          "no-foo": {
            create(context) {
              return { Identifier(node) { if (node.name === "foo") { /* ... */ } } };
            },
          },
        },
      },
    },
    rules: { "virtual/no-foo": "error" },
  },
]);
```

### Use Plugin Rules

```js
{
  plugins: { example: eslintPluginExample },
  rules: {
    "example/rule-name": "error",
  },
}
```

### Specify a Processor

```js
{
  processor: "example/processor-name",
}

// Or as an object
{
  processor: {
    preprocess(text, filename) { /* ... */ return [text]; },
    postprocess(messages, filename) { /* ... */ return messages.flat(); },
  },
}
```

### Specify a Language

```js
{
  language: "markdown/commonmark",
}
```

## Configure a Parser

```js
// Use a custom parser
import tsParser from "@typescript-eslint/parser";

export default defineConfig([
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  },
]);
```

### Configure Parser Options

```js
{
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true },
      ecmaVersion: "latest",
      sourceType: "module",
      project: "./tsconfig.json",
    },
  },
}
```

## Ignore Files

### Ignore Files in Configuration

```js
export default defineConfig([
  // Global ignores
  {
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      "*.min.js",
      "coverage/",
    ],
  },
]);
```

### Ignore Directories

```js
{
  ignores: ["dist/**", "build/**"],
}
```

### Unignore Files and Directories

```js
{
  ignores: ["!dist/important.js"],
}
```

### Ignored File Warnings

ESLint warns when explicitly linting an ignored file. Use `--no-warn-ignored` to suppress.

### Include .gitignore Files

```js
import includeIgnoreFile from "eslint-define-config";

export default defineConfig([
  includeIgnoreFile(".gitignore"),
]);
```

### Glob Pattern Resolution

- Patterns are relative to the config file's directory
- `**` matches any number of directories
- `*` matches any number of characters (except `/`)
- `?` matches a single character

## Combine Configs

```js
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);
```
