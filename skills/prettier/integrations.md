# Prettier — Integrations & Plugins

## Integrating with Linters

Linters usually contain not only code quality rules, but also stylistic rules. Most stylistic rules are unnecessary when using Prettier, but worse — they might conflict with Prettier!

Use Prettier for code formatting concerns, and linters for code-quality concerns.

### Recommended: Turn off conflicting linter rules

- **eslint-config-prettier** — turns off all ESLint rules that are unnecessary or might conflict with Prettier
- **stylelint-config-prettier** — turns off all Stylelint rules that might conflict with Prettier

### Not recommended: Run Prettier as a linter rule

- **eslint-plugin-prettier** — runs Prettier as an ESLint rule and reports differences as individual ESLint issues
- **stylelint-prettier** — runs Prettier as a Stylelint rule

Downsides:
- Lots of red squiggly lines in your editor
- Slower than running Prettier directly
- Yet another layer where things may break

### Not recommended: Run Prettier then lint --fix

- **prettier-eslint** — passes Prettier output to `eslint --fix`
- **prettier-stylelint** — passes Prettier output to `stylelint --fix`

These are useful if some aspect of Prettier's output makes it completely unusable to you, but they are much slower than just running Prettier.

**Source**: [Integrating with Linters](https://prettier.io/docs/integrating-with-linters)

---

## Pre-commit Hook

You can use Prettier with a pre-commit tool. This re-formats files that are marked as "staged" via `git add` before you commit.

### Option 1. lint-staged

Use Case: Useful when you want to use other code quality tools along with Prettier (e.g. ESLint, Stylelint) or if you need support for partially staged files (`git add --patch`).

```bash
npx mrm@2 lint-staged
```

This installs husky and lint-staged, then adds configuration to `package.json` that automatically formats supported files in a pre-commit hook.

### Option 2. pretty-quick

Use Case: Great for entire file formatting on changed/staged files.

Install with [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks):

```bash
npm install --save-dev simple-git-hooks pretty-quick
node --eval "fs.writeFileSync('.simple-git-hooks.json',JSON.stringify({'pre-commit':'npx pretty-quick --staged'},undefined,2)+'\n')"
npx simple-git-hooks
```

### Option 3. Husky.Net

Use Case: A dotnet solution to use Prettier along with other code quality tools.

```bash
dotnet new tool-manifest
dotnet tool install husky
dotnet husky install
dotnet husky add pre-commit
```

Add a Prettier task to `task-runner.json`:

```json
{
  "command": "npx",
  "args": ["prettier", "--ignore-unknown", "--write", "${staged}"],
  "pathMode": "absolute"
}
```

### Option 4. git-format-staged

Use Case: Great for formatting partially-staged files when other options don't fit.

Git-format-staged applies the formatter directly to objects in the git object database and merges changes back to the working tree. Guarantees:

1. Changes in commits are always formatted.
2. Unstaged changes are never staged during formatting.
3. Conflicts between formatted, staged changes and unstaged changes leave working tree files untouched.
4. Unstaged changes are not formatted.

Requires Python v3 or v2.7. Use with husky:

```bash
npx husky init
npm install --save-dev git-format-staged
node --eval "fs.writeFileSync('.husky/pre-commit', 'git-format-staged -f \'prettier --ignore-unknown --stdin --stdin-filepath \"{}\"\' .\n')"
```

### Option 5. Shell script

Save as `.git/hooks/pre-commit` and give it execute permission:

```bash
#!/bin/sh
FILES=$(git diff --cached --name-only --diff-filter=ACMR | sed 's| |\\ |g')
[ -z "$FILES" ] && exit 0
echo "$FILES" | xargs ./node_modules/.bin/prettier --ignore-unknown --write
echo "$FILES" | xargs git add
exit 0
```

If git reports modified files after committing, add a post-commit script:

```bash
#!/bin/sh
git update-index -g
```

**Source**: [Pre-commit Hook](https://prettier.io/docs/precommit)

---

## Plugins

Plugins are ways of adding new languages or formatting rules to Prettier. Prettier's own implementations of all languages are expressed using the plugin API.

### Using Plugins

**CLI** — via `--plugin`:

```bash
prettier --write main.foo --plugin=prettier-plugin-foo
```

You can set `--plugin` options multiple times.

**API** — via the `plugins` option:

```javascript
import * as prettierPluginFoo from "prettier-plugin-foo";
await prettier.format("code", {
  parser: "foo",
  plugins: [prettierPluginFoo],
});
```

**Configuration File:**

```javascript
import * as prettierPluginFoo from "prettier-plugin-foo";
const config = { plugins: [prettierPluginFoo] };
export default config;
```

### Official Plugins

- [@prettier/plugin-php](https://github.com/prettier/plugin-php)
- [@prettier/plugin-pug](https://github.com/prettier/plugin-pug)
- [@prettier/plugin-ruby](https://github.com/prettier/plugin-ruby)
- [@prettier/plugin-xml](https://github.com/prettier/plugin-xml)

### Community Plugins

- `prettier-plugin-jte` — JTE templates
- `prettier-plugin-kotlin` — Kotlin
- `prettier-plugin-markdown-html` — Markdown with HTML
- `prettier-plugin-marko` — Marko
- `prettier-plugin-motoko` — Motoko
- `prettier-plugin-mustache` — Mustache
- `prettier-plugin-nginx` — Nginx config
- `prettier-plugin-nunjucks` — Nunjucks
- `prettier-plugin-prisma` — Prisma schema
- `prettier-plugin-properties` — Java properties
- `prettier-plugin-powershell` — PowerShell
- `prettier-plugin-rust` — Rust
- `prettier-plugin-sh` — Shell scripts
- `prettier-plugin-sql` — SQL
- `prettier-plugin-sql-cst` — SQL (CST-based)
- `prettier-plugin-solidity` — Solidity
- `prettier-plugin-svelte` — Svelte
- `prettier-plugin-toml` — TOML
- `prettier-plugin-xquery` — XQuery
- `prettier-plugin-yaml` — YAML

### Developing Plugins

Prettier plugins are regular JavaScript modules with five exports:

- `languages`
- `parsers`
- `printers`
- `options`
- `defaultOptions`

#### languages

An array of language definitions. Must include `name` and `parsers`.

```javascript
export const languages = [
  {
    name: "InterpretedDanceScript",
    parsers: ["dance-parse"],
  },
];
```

#### parsers

Convert code as a string into an AST. The key must match the name in the `parsers` array from `languages`.

```javascript
export const parsers = {
  "dance-parse": {
    parse,
    astFormat: "dance-ast",
    hasPragma,
    hasIgnorePragma,
    locStart,
    locEnd,
    preprocess,
  },
};
```

The `parse` function signature:

```typescript
function parse(text: string, options: object): Promise<AST> | AST;
```

Location extraction functions:

```typescript
function locStart(node: object): number;
function locEnd(node: object): number;
```

Optional pragma detection:

```typescript
function hasPragma(text: string): boolean;
function hasIgnorePragma(text: string): boolean;
```

Optional preprocess (async support added in v3.7.0):

```typescript
function preprocess(text: string, options: object): string | Promise<string>;
```

#### printers

Convert ASTs into a Prettier intermediate representation (Doc). The key must match the `astFormat` that the parser produces.

```javascript
export const printers = {
  "dance-ast": {
    print,
    embed,
    preprocess,
    getVisitorKeys,
    insertPragma,
    canAttachComment,
    isBlockComment,
    printComment,
    getCommentChildNodes,
    hasPrettierIgnore,
    printPrettierIgnored,
    handleComments: { ownLine, endOfLine, remaining },
  },
};
```

##### The printing process

1. AST preprocessing (optional)
2. Comment attachment (optional)
3. Processing embedded languages (optional) — `embed` method called for each node, depth-first
4. Recursive printing — `print(path, options, print): Doc` called for each node

##### print function signature

```typescript
function print(
  path: AstPath,
  options: object,
  print: (selector?: string | number | Array<string | number> | AstPath) => Doc,
): Doc;
```

- `path`: Object to access nodes in the AST. Current node returned by `path.node`.
- `options`: Persistent object containing global options.
- `print`: Callback to recursively print child nodes.

##### Doc builders

```javascript
import * as prettier from "prettier";
const { join, line, ifBreak, group } = prettier.doc.builders;
```

#### (optional) hasPrettierIgnore

A function that determines if a node should be ignored by Prettier.

#### (optional) printPrettierIgnored

A function that returns a Doc for nodes that have been ignored by Prettier.

#### options

An object containing custom options your plugin supports:

```javascript
export const options = {
  openingBraceNewLine: {
    type: "boolean",
    category: "Global",
    default: true,
    description: "Move open brace for code blocks onto new line.",
  },
};
```

#### defaultOptions

Specify different default values for Prettier's core options:

```javascript
export const defaultOptions = {
  tabWidth: 4,
};
```

### Utility functions

Prettier provides utility functions via `prettier.util`:

- `prettier.util.addTrailingComment(node, comment)`
- `prettier.util.addLeadingComment(node, comment)`
- `prettier.util.addDanglingComment(node, comment)`

### Testing Plugins

Since plugins can be resolved using relative paths:

```javascript
import * as prettier from "prettier";
const code = "(add 1 2)";
await prettier.format(code, {
  parser: "lisp",
  plugins: ["./index.js"],
});
```

The `--debug-print-comments` CLI flag helps debug comment attachment issues.

**Source**: [Plugins](https://prettier.io/docs/plugins)

---

## Related Projects

### ESLint Integrations

- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) — turns off all ESLint rules that conflict with Prettier
- [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) — runs Prettier as an ESLint rule
- [prettier-eslint](https://github.com/prettier/prettier-eslint) — passes Prettier output to `eslint --fix`
- [prettier-standard](https://github.com/sheerun/prettier-standard) — uses prettierx and prettier-eslint with standard rules

### stylelint Integrations

- [stylelint-config-prettier](https://github.com/prettier/stylelint-config-prettier) — turns off all conflicting rules
- [stylelint-prettier](https://github.com/prettier/stylelint-prettier) — runs Prettier as a Stylelint rule
- [prettier-stylelint](https://github.com/hugomrdias/prettier-stylelint) — passes Prettier output to `stylelint --fix`

### Forks

- [prettierx](https://github.com/brodybits/prettierx) — less opinionated fork of Prettier

### Misc

- [parallel-prettier](https://github.com/microsoft/parallel-prettier) — alternative CLI that formats files in parallel
- [prettier_d](https://github.com/josephfrazier/prettier_d.js) — runs Prettier as a server to avoid Node.js startup delay
- [pretty-quick](https://github.com/azz/pretty-quick) — formats changed files with Prettier
- [rollup-plugin-prettier](https://github.com/mjeanroy/rollup-plugin-prettier) — use Prettier with Rollup
- [jest-runner-prettier](https://github.com/keplersj/jest-runner-prettier) — Prettier as a Jest runner
- [prettier-chrome](https://github.com/u3u/prettier-chrome) — extension that runs Prettier in the browser
- [spotless](https://github.com/diffplug/spotless) — run Prettier from Gradle or Maven
- [csharpier](https://github.com/belav/csharpier) — port of Prettier for C#
- [Prettier (Swift)](https://github.com/jaywcjlove/Prettier) — Swift version based on Prettier
- [reviewdog-action-prettier](https://github.com/EPMatt/reviewdog-action-prettier) — runs Prettier in GitHub Actions
- monaco-prettier — integrates Prettier into Monaco editor

**Source**: [Related Projects](https://prettier.io/docs/related-projects)
