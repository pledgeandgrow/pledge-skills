# Prettier — Options & Configuration

## Options

Prettier ships with a handful of format options. Options are frozen — no new ones will be added.

### Experimental Ternaries

Try Prettier's new ternary formatting before it becomes default.

- `true` — Use curious ternaries, with the question mark after the condition.
- `false` — Retain default behavior; keep question marks on the same line as the consequent.

Default: `false`
CLI: `--experimental-ternaries`
API: `experimentalTernaries: <bool>`

### Experimental Operator Position

- `"start"` — Print operators at the start of new lines when binary expressions wrap.
- `"end"` — Default; print operators at the end of previous lines.

Default: `"end"`
CLI: `--experimental-operator-position <start|end>`
API: `experimentalOperatorPosition: "<start|end>"`

### Print Width

Specify the line length that the printer will wrap on.

Default: `80`
CLI: `--print-width <int>`
API: `printWidth: <int>`

`printWidth` is not a hard upper limit. It tells Prettier roughly how long you'd like lines to be. Don't use it like ESLint's `max-len`.

Setting `max_line_length` in `.editorconfig` will configure this, unless overridden.

### Tab Width

Specify the number of spaces per indentation-level.

Default: `2`
CLI: `--tab-width <int>`
API: `tabWidth: <int>`

Setting `indent_size` or `tab_width` in `.editorconfig` will configure this.

### Tabs

Indent lines with tabs instead of spaces.

Default: `false`
CLI: `--use-tabs`
API: `useTabs: <bool>`

Tabs are used for indentation but Prettier uses spaces to align things (e.g. ternaries). This is known as [SmartTabs](https://www.emacswiki.org/emacs/SmartTabs).

### Semicolons

Print semicolons at the ends of statements.

- `true` — Add a semicolon at the end of every statement.
- `false` — Only add semicolons at the beginning of lines that may introduce ASI failures.

Default: `true`
CLI: `--no-semi`
API: `semi: <bool>`

### Quotes

Use single quotes instead of double quotes.

- JSX quotes ignore this option — see `jsxSingleQuote`.
- If the number of quotes outweighs the other, the less used quote will be used.

Default: `false`
CLI: `--single-quote`
API: `singleQuote: <bool>`

### Quote Props

Change when properties in objects are quoted.

- `"as-needed"` — Only add quotes where required.
- `"consistent"` — If at least one property requires quotes, quote all.
- `"preserve"` — Respect the input use of quotes.

Default: `"as-needed"`
CLI: `--quote-props <as-needed|consistent|preserve>`
API: `quoteProps: "<as-needed|consistent|preserve>"`

Note: Prettier never unquotes numeric property names in Angular, TypeScript, Flow, or Vue.

### JSX Quotes

Use single quotes instead of double quotes in JSX.

Default: `false`
CLI: `--jsx-single-quote`
API: `jsxSingleQuote: <bool>`

### Trailing Commas

Print trailing commas wherever possible in multi-line comma-separated syntactic structures.

- `"all"` — Trailing commas wherever possible (including function parameters and calls).
- `"es5"` — Trailing commas where valid in ES5.
- `"none"` — No trailing commas.

Default: `"all"` (changed from `es5` in v3.0.0)
CLI: `--trailing-comma <all|es5|none>`
API: `trailingComma: "<all|es5|none>"`

### Bracket Spacing

Print spaces between brackets in object literals.

- `true` — `{ foo: bar }`
- `false` — `{foo: bar}`

Default: `true`
CLI: `--no-bracket-spacing`
API: `bracketSpacing: <bool>`

### Object Wrap

Configure how Prettier wraps object literals when they could fit on one line or span multiple lines. First available in v3.5.0.

- `"preserve"` — Keep as multi-line if there is a newline between the opening brace and first property.
- `"collapse"` — Fit to a single line when possible.

Default: `"preserve"`
CLI: `--object-wrap <preserve|collapse>`
API: `objectWrap: "<preserve|collapse>"`

### Bracket Line

Put the `>` of a multi-line HTML (HTML, JSX, Vue, Angular) element at the end of the last line instead of alone on the next line.

Default: `false`
CLI: `--bracket-same-line`
API: `bracketSameLine: <bool>`

### [Deprecated] JSX Brackets

Deprecated in v2.4.0, use `--bracket-same-line` instead.

### Arrow Function Parentheses

Include parentheses around a sole arrow function parameter.

- `"always"` — Always include parens. Example: `(x) => x`
- `"avoid"` — Omit parens when possible. Example: `x => x`

Default: `"always"` (changed from `avoid` in v2.0.0)
CLI: `--arrow-parens <always|avoid>`
API: `arrowParens: "<always|avoid>"`

### Range

Format only a segment of a file.

- `rangeStart` — Character offset (inclusive). Default: `0`
- `rangeEnd` — Character offset (exclusive). Default: `Infinity`

CLI: `--range-start <int>`, `--range-end <int>`
API: `rangeStart: <int>`, `rangeEnd: <int>`

### Parser

Specify which parser to use. Prettier automatically infers from the input file path.

Valid options: `babel`, `babel-flow`, `babel-ts`, `flow`, `typescript`, `espree`, `meriyah`, `acorn`, `css`, `scss`, `less`, `json`, `json5`, `jsonc`, `json-stringify`, `graphql`, `markdown`, `mdx`, `html`, `vue`, `angular`, `lwc`, `mjml`, `glimmer`, `yaml`

Default: `babel`
CLI: `--parser <string>`
API: `parser: "<string>"`

### File Path

Specify the file name to infer which parser to use. Only useful in CLI and API.

CLI: `--stdin-filepath <string>`
API: `filepath: "<string>"`

### Require Pragma

Restrict formatting to files containing a special comment pragma at the top:

```javascript
/**
 * @prettier
 */
```

or

```javascript
/**
 * @format
 */
```

Default: `false`
CLI: `--require-pragma`
API: `requirePragma: <bool>`

### Insert Pragma

Insert a special `@format` marker at the top of files. Works well with `--require-pragma` for incremental adoption.

Default: `false`
CLI: `--insert-pragma`
API: `insertPragma: <bool>`

### Check Ignore Pragma

Allow individual files to opt out of formatting if they contain a special pragma:

```javascript
/**
 * @noprettier
 */
```

or

```javascript
/**
 * @noformat
 */
```

Default: `false`
CLI: `--check-ignore-pragma`
API: `checkIgnorePragma: <bool>`

### Prose Wrap

Control wrapping in Markdown text.

- `"always"` — Wrap prose to the print width.
- `"never"` — Put each prose block on a single line.
- `"preserve"` — Keep existing wrapping as-is.

Default: `"preserve"`
CLI: `--prose-wrap <always|never|preserve>`
API: `proseWrap: "<always|never|preserve>"`

### HTML Whitespace Sensitivity

Specify the global whitespace sensitivity for HTML, Vue, Angular, and Handlebars.

- `"css"` — Respect the default value of CSS display property.
- `"strict"` — Whitespace around all tags is considered significant.
- `"ignore"` — Whitespace around all tags is considered insignificant.

Default: `"css"`
CLI: `--html-whitespace-sensitivity <css|strict|ignore>`
API: `htmlWhitespaceSensitivity: "<css|strict|ignore>"`

### Vue files script and style tags indentation

Whether to indent code inside `<script>` and `<style>` tags in Vue files.

Default: `false`
CLI: `--vue-indent-script-and-style`
API: `vueIndentScriptAndStyle: <bool>`

### End of Line

Valid options: `"lf"`, `"crlf"`, `"cr"`, `"auto"` (maintain existing line endings).

Default: `"lf"` (changed from `auto` in v2.0.0)
CLI: `--end-of-line <lf|crlf|cr|auto>`
API: `endOfLine: "<lf|crlf|cr|auto>"`

Setting `end_of_line` in `.editorconfig` will configure this.

### Embedded Language Formatting

Control whether Prettier formats quoted code embedded in the file.

- `"auto"` — Format embedded code if Prettier can identify it.
- `"off"` — Never automatically format embedded code.

Default: `"auto"`
CLI: `--embedded-language-formatting=<off|auto>`
API: `embeddedLanguageFormatting: "<off|auto>"`

### Single Attribute Per Line

Enforce single attribute per line in HTML, Vue, and JSX.

Default: `false`
CLI: `--single-attribute-per-line`
API: `singleAttributePerLine: <bool>`

**Source**: [Options](https://prettier.io/docs/options)

---

## Configuration File

You can configure Prettier via (in order of precedence):

1. A `"prettier"` key in your `package.json` or `package.yaml` file.
2. A `.prettierrc` file written in JSON or YAML.
3. A `.prettierrc.json`, `.prettierrc.yml`, `.prettierrc.yaml`, or `.prettierrc.json5` file.
4. A `.prettierrc.js`, `prettier.config.js`, `.prettierrc.ts`, or `prettier.config.ts` file that exports an object.
5. A `.prettierrc.mjs`, `prettier.config.mjs`, `.prettierrc.mts`, or `prettier.config.mts` file using `export default`.
6. A `.prettierrc.cjs`, `prettier.config.cjs`, `.prettierrc.cts`, or `prettier.config.cts` file using `module.exports`.
7. A `.prettierrc.toml` file.

The configuration file is resolved starting from the file being formatted, searching up the file tree. Prettier intentionally doesn't support global configuration.

### Basic Configuration

**JSON:**

```json
{
  "trailingComma": "es5",
  "tabWidth": 4,
  "semi": false,
  "singleQuote": true
}
```

**JS (ES Modules):**

```javascript
/** @type {import("prettier").Config} */
const config = {
  trailingComma: "es5",
  tabWidth: 4,
  semi: false,
  singleQuote: true,
};
export default config;
```

**JS (CommonJS):**

```javascript
/** @type {import("prettier").Config} */
const config = {
  trailingComma: "es5",
  tabWidth: 4,
  semi: false,
  singleQuote: true,
};
module.exports = config;
```

**TypeScript (ES Modules):**

```typescript
import { type Config } from "prettier";
const config: Config = { trailingComma: "none" };
export default config;
```

**YAML:**

```yaml
trailingComma: "es5"
tabWidth: 4
semi: false
singleQuote: true
```

**TOML:**

```toml
trailingComma = "es5"
tabWidth = 4
semi = false
singleQuote = true
```

### Configuration Overrides

Overrides let you have different configuration for certain file extensions, folders, and specific files.

```json
{
  "semi": false,
  "overrides": [
    {
      "files": "*.test.js",
      "options": { "semi": true }
    },
    {
      "files": ["*.html", "legacy/**/*.js"],
      "options": { "tabWidth": 4 }
    }
  ]
}
```

`files` is required for each override (string or array of strings). `excludeFiles` may be optionally provided.

### Setting the parser option

Never put `parser` at the top level. Only use it inside `overrides`:

```json
{
  "overrides": [
    {
      "files": ".prettierrc",
      "options": { "parser": "json" }
    }
  ]
}
```

### Configuration Schema

A JSON schema is available at [https://www.schemastore.org/prettierrc.json](https://www.schemastore.org/prettierrc.json).

### EditorConfig

If a `.editorconfig` file is in your project, Prettier will parse it and convert its properties. This configuration will be overridden by `.prettierrc`, etc.

Property mappings:

```ini
# Non-configurable Prettier behaviors
charset = utf-8
insert_final_newline = true

# Configurable Prettier behaviors
end_of_line = lf
indent_style = space
indent_size = 2
max_line_length = 80
```

**Source**: [Configuration File](https://prettier.io/docs/configuration)

---

## Sharing Configurations

In case you have many different projects, it can be helpful to have a shared configuration.

### Creating a Shareable Config

Shareable configs are npm packages that export a single Prettier config file. Create a scoped package named `@username/prettier-config`:

```
prettier-config/
├── index.js
└── package.json
```

Example `package.json`:

```json
{
  "name": "@username/prettier-config",
  "version": "1.0.0",
  "type": "module",
  "exports": "./index.js",
  "peerDependencies": { "prettier": ">=3.0.0" }
}
```

Example `index.js`:

```javascript
/** @type {import("prettier").Config} */
const config = {
  trailingComma: "es5",
  tabWidth: 4,
  singleQuote: true,
};
export default config;
```

### Publishing

```bash
npm publish
```

### Using a Shareable Config

Install it:

```bash
npm install --save-dev @username/prettier-config
```

Reference it in `package.json`:

```json
{
  "name": "my-cool-library",
  "version": "1.0.0",
  "prettier": "@username/prettier-config"
}
```

Or in `.prettierrc`:

```json
"@company/prettier-config"
```

### Extending a Shareable Config

You can extend a shared config by merging it with your own:

```javascript
import baseConfig from "@username/prettier-config";
export default {
  ...baseConfig,
  tabWidth: 2,
};
```

### Include Plugins in Shareable Configurations

You can include plugins in your shared configuration:

```javascript
import * as prettierPluginFoo from "prettier-plugin-foo";
const config = { plugins: [prettierPluginFoo] };
export default config;
```

**Source**: [Sharing configurations](https://prettier.io/docs/sharing-configurations)
