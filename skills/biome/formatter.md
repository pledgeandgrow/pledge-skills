# Biome — Formatter

> **Source**: [Formatter](https://biomejs.dev/formatter/) | [Differences with Prettier](https://biomejs.dev/formatter/differences-with-prettier/) | [Option Philosophy](https://biomejs.dev/formatter/option-philosophy/)

## Overview

Biome is an opinionated formatter that supports multiple languages. It follows a similar philosophy to Prettier — only supporting a few options to avoid debates over styles. It deliberately resists adding new options to prevent bike-shedding discussions.

## CLI

```bash
# Check formatting (emits diffs if not formatted)
npx @biomejs/biome format ./src

# Apply formatting
npx @biomejs/biome format --write ./src
```

The command accepts a list of files and directories.

> **Caution**: Glob patterns are expanded by your shell, not Biome. Some shells don't support `**` or `{}`.

## Options

Biome separates language-agnostic options from language-specific options.

### Configuration

Options can be set via CLI or `biome.json`. As of v1.9, Biome supports loading `.editorconfig` files.

### Default Configuration

```json
{
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "ignore": [],
    "attributePosition": "auto",
    "indentStyle": "tab",
    "indentWidth": 2,
    "lineWidth": 80,
    "lineEnding": "lf"
  },
  "javascript": {
    "formatter": {
      "arrowParentheses": "always",
      "bracketSameLine": false,
      "bracketSpacing": true,
      "delimiterSpacing": false,
      "jsxQuoteStyle": "double",
      "quoteProperties": "asNeeded",
      "semicolons": "always",
      "trailingCommas": "all"
    }
  },
  "json": {
    "formatter": {
      "trailingCommas": "none"
    }
  }
}
```

### Language-Agnostic Options

| Option | Default | Description |
|--------|---------|-------------|
| `indentStyle` | `"tab"` | Use spaces or tabs for indentation |
| `indentWidth` | `2` | Number of spaces per indentation level |
| `lineWidth` | `80` | Column width at which Biome wraps code |
| `lineEnding` | `"lf"` | Line ending style (`"lf"`, `"crlf"`, `"cr"`) |
| `attributePosition` | `"auto"` | Position of JSX/HTML attributes |
| `bracketSpacing` | `true` | Spaces inside object literals |
| `delimiterSpacing` | `false` | Spaces around delimiters |
| `expand` | — | Expand or collapse constructs |
| `formatWithErrors` | `false` | Format even when there are syntax errors |
| `trailingNewline` | — | Trailing newline behavior |
| `useEditorconfig` | — | Load `.editorconfig` files |

### JavaScript-Specific Options

| Option | Default | Description |
|--------|---------|-------------|
| `quoteStyle` | `"double"` | Quote style for strings |
| `jsxQuoteStyle` | `"double"` | Quote style for JSX attributes |
| `quoteProperties` | `"asNeeded"` | When to quote object properties |
| `trailingCommas` | `"all"` | Trailing commas in lists |
| `semicolons` | `"always"` | Semicolon usage (`"always"`, `"asNeeded"`) |
| `arrowParentheses` | `"always"` | Parentheses around arrow function params |
| `bracketSameLine` | `false` | JSX bracket on same line |
| `bracketSpacing` | `true` | Spaces inside object literals |
| `operatorLinebreak` | — | Operator line breaking |

### JSON-Specific Options

| Option | Default | Description |
|--------|---------|-------------|
| `trailingCommas` | `"none"` | Trailing commas in JSON |

### CSS-Specific Options

| Option | Default | Description |
|--------|---------|-------------|
| `quoteStyle` | `"double"` | Quote style for strings |

### HTML-Specific Options (Experimental)

| Option | Default | Description |
|--------|---------|-------------|
| `attributePosition` | `"auto"` | Position of attributes |
| `bracketSameLine` | `false` | Bracket on same line |
| `whitespaceSensitivity` | — | Whitespace sensitivity |
| `indentScriptAndStyle` | — | Indent script and style tags |
| `selfCloseVoidElements` | — | Self-close void elements |

## Ignore Code

### Ignore an Entire File

Use `biome-ignore-all format: reason` at the top of the file:

```javascript
// biome-ignore-all format: generated file

const expr1 = [
  (2 * n) / (r - l),
  0,
  (r + l) / (r - l),
  -1,
  0,
];
```

### Ignore Nodes

Use `biome-ignore format: reason` to suppress formatting for a specific node:

```javascript
const expr =
  // biome-ignore format: the array should not be formatted
  [
    (2 * n) / (r - l),
    0,
    (r + l) / (r - l),
    0,
    0,
    (2 * n) / (t - b),
    (t + b) / (t - b),
    0,
    0,
    0,
    -(f + n) / (f - n),
    -(2 * f * n) / (f - n),
    0,
    0,
    -1,
    0,
  ];
```

## Differences with Prettier

See: [Differences with Prettier](https://biomejs.dev/formatter/differences-with-prettier/)

Biome aims to be largely compatible with Prettier but has some intentional differences:

### Known Limitations Compared to Prettier

- Prettier doesn't unquote some object properties that are valid JavaScript identifiers
- Prettier has inconsistent behavior for assignment in computed keys
- Prettier adds trailing commas to type parameters of arrow functions even when not required
- Prettier has inconsistent behavior for parenthesized non-null-asserted optional chains

### Prettier Formats Invalid Syntaxes

Biome does not format invalid syntax, while Prettier does in some cases:
- Duplicate modifiers on class properties
- Assignment to an optional chain
- Incorrect modifier for type parameters of an interface
- Top-level return

## Formatter Option Philosophy

See: [Option Philosophy](https://biomejs.dev/formatter/option-philosophy/)

Biome follows the same [Option Philosophy as Prettier](https://prettier.io/docs/en/option-philosophy):

### Existing Options

Biome started with a strict subset of options targeting the most common style guidelines. When the Prettier Challenge was announced, Biome implemented all Prettier configuration options for compatibility. These options are considered a legacy feature for compatibility, not a baseline feature set.

### New Options

The current set of options is considered stable, sufficient, and not open for additions. Requests for additional configuration options are not likely to be considered.

### Philosophy

- Biome is an opinionated formatter — its own automatic style guide
- Benefits: no bike-shedding, clean code reviews, ecosystem consistency
- Code formatted by Biome will always look the same regardless of project
- New formatting style changes may be applied universally, not as options
