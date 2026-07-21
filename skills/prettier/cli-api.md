# Prettier — CLI, API, Browser & CI

## CLI

Use the `prettier` command to run Prettier from the command line.

```bash
prettier [options] [file/dir/glob ...]
```

To run your locally installed version, prefix with `npx`, `yarn exec`, `pnpm exec`, `bunx`, or `deno x`.

### Basic usage

To format a file in-place, use `--write`:

```bash
prettier . --write
```

This formats all files supported by Prettier in the current directory and its subdirectories.

A more complicated example:

```bash
prettier docs package.json "{app,__{tests,mocks}__}/**/*.js" --write --single-quote --trailing-comma all
```

Always quote globs so Prettier CLI expands them rather than your shell (important for cross-platform usage).

### File patterns

- If the path points to an existing **file**, Prettier proceeds with that file.
- If the path points to an existing **directory**, Prettier recursively finds supported files.
- Otherwise, the entry is resolved as a **glob pattern** using [fast-glob](https://github.com/mrmlnc/fast-glob) syntax.

Prettier CLI ignores `node_modules` by default. Use `--with-node-modules` to opt out.

### --check

```bash
prettier . --check
```

Checks if files are formatted. Outputs a human-friendly message and a list of unformatted files. Returns exit code 1 if files require re-formatting — helpful in CI pipelines.

#### Exit codes

- **0**: All files are formatted
- **1**: Some files are not formatted
- **2**: Something went wrong

### --debug-check

If you're worried Prettier will change code correctness, add `--debug-check`. This prints an error if code correctness might have changed. Cannot be used with `--write`.

### --find-config-path and --config

```bash
prettier --find-config-path path/to/file.js
# path/to/.prettierrc

prettier path/to/file.js --write --config path/to/.prettierrc
```

### --ignore-path

Path to a file containing patterns for files to ignore. By default, Prettier looks for `./.gitignore` and `./.prettierignore`. Multiple values accepted by providing multiple `--ignore-path` options. Specifying `--ignore-path` overrides the default.

### --list-different

```bash
prettier . --single-quote --list-different
```

Prints filenames of files that are different from Prettier formatting. Errors out if there are differences — useful in CI.

### --no-config

Do not look for a configuration file. Default settings will be used.

### --config-precedence

Defines how config file should be evaluated with CLI options:

- `cli-override` (default) — CLI options take precedence over config file
- `file-override` — Config file takes precedence over CLI options
- `prefer-file` — If a config file is found, ignore CLI options. If not, CLI options evaluate normally.

### --no-editorconfig

Don't take `.editorconfig` into account when parsing configuration.

### --with-node-modules

Prettier CLI will ignore `node_modules` by default. Use this flag to opt out.

### --write

Rewrites all processed files in place. Alias: `-w`.

### --log-level

Change the level of logging. Valid options: `error`, `warn`, `log` (default), `debug`, `silent`.

### --stdin-filepath

A path to the file that Prettier CLI will treat like stdin:

```bash
cat abc.css | prettier --stdin-filepath abc.css
```

### --ignore-unknown

With `--ignore-unknown` (or `-u`), Prettier will ignore unknown files matched by patterns.

```bash
prettier "**/*" --write --ignore-unknown
```

### --no-error-on-unmatched-pattern

Prevent errors when pattern is unmatched.

### --cache

If enabled, the following values are used as cache keys and the file is formatted only if one of them has changed:

- Prettier version
- Options
- Node.js version
- File metadata (if `--cache-strategy is metadata`) or file content (if `--cache-strategy is content`)

```bash
prettier . --write --cache
```

Running Prettier without `--cache` will delete the cache. Cache is stored at `./node_modules/.cache/prettier/.prettier-cache`.

### --cache-location

Path to the cache file location. Default: `./node_modules/.cache/prettier/.prettier-cache`.

```bash
prettier . --write --cache --cache-location=path/to/cache-file
```

### --cache-strategy

Strategy for detecting changed files: `metadata` (faster) or `content` (useful for git operations that don't track modification times). Default: `content`.

```bash
prettier . --write --cache --cache-strategy metadata
```

**Source**: [CLI](https://prettier.io/docs/cli)

---

## API

If you want to run Prettier programmatically:

```javascript
import * as prettier from "prettier";
```

All public APIs are asynchronous. For synchronous usage, try [@prettier/sync](https://github.com/prettier/prettier-synchronized).

### prettier.format(source, options)

Formats text using Prettier. `options.parser` must be set, or `options.filepath` can be specified for Prettier to infer the parser from the file extension.

```javascript
await prettier.format("foo ( );", { semi: false, parser: "babel" });
// -> 'foo()\n'
```

### prettier.check(source [, options])

Checks if the file has been formatted with Prettier given those options. Returns `Promise<boolean>`. Similar to `--check` in the CLI.

### prettier.formatWithCursor(source [, options])

Formats code and translates a cursor position from unformatted code to formatted code. Useful for editor integrations.

```javascript
await prettier.formatWithCursor(" 1", { cursorOffset: 2, parser: "babel" });
// -> { formatted: '1;\n', cursorOffset: 1 }
```

### prettier.resolveConfig(fileUrlOrPath [, options])

Resolves configuration for a given source file. The config search starts at the file's directory and continues up. Returns a promise resolving to an options object or `null`.

```javascript
const text = await fs.readFile(filePath, "utf8");
const options = await prettier.resolveConfig(filePath);
const formatted = await prettier.format(text, { ...options, filepath: filePath });
```

If `options.editorconfig` is `true` and an `.editorconfig` file exists, Prettier will parse it and convert its properties to Prettier configuration. Supported EditorConfig properties: `end_of_line`, `indent_style`, `indent_size`/`tab_width`, `max_line_length`.

### prettier.resolveConfigFile([fileUrlOrPath])

Finds the path of the Prettier configuration file that will be used when resolving config. Returns a promise resolving to the path or `null`.

```javascript
const configFile = await prettier.resolveConfigFile(filePath);
```

### prettier.clearConfigCache()

Clears the cache of configuration files and plugins. Generally only needed for editor integrations that know the file system has changed.

### prettier.getFileInfo(fileUrlOrPath [, options])

Used by editor extensions to decide if a file needs formatting. Returns a promise resolving to:

```typescript
{ ignored: boolean; inferredParser: string | null; }
```

Options: `options.ignorePath`, `options.withNodeModules`, `options.plugins`, `options.resolveConfig`.

### prettier.getSupportInfo()

Returns a promise resolving to an object representing the options, parsers, languages, and file types Prettier supports.

### Custom Parser API (removed)

Removed in v3.0.0, superseded by the Plugin API. Use `--plugin` CLI option or the `plugins` API option instead.

**Source**: [API](https://prettier.io/docs/api)

---

## Browser

Prettier can run in the browser using its standalone version. This version doesn't depend on Node.js. It only formats code and has no support for config files, ignore files, CLI usage, or automatic loading of plugins.

### Usage

**ES Modules:**

```javascript
import * as prettier from "prettier/standalone";
await prettier.format("hello ( )", { parser: "babel", plugins: [prettierPluginBabel] });
```

**Global:**

```html
<script src="https://unpkg.com/prettier/standalone"></script>
```

**Worker:**

```javascript
const worker = new Worker("./prettier-worker.js");
```

### Parser plugins for embedded code

When using the standalone version, you need to load parser plugins explicitly for each language you want to format, including embedded languages.

**Source**: [Browser](https://prettier.io/docs/browser)

---

## Run Prettier on CI

### GitHub Actions

To apply autofix for Prettier from GitHub Actions:

1. Install the [autofix.ci](https://github.com/apps/autofix-ci) GitHub App.
2. Make sure you have a pinned version of Prettier installed.
3. Create `.github/workflows/prettier.yml`:

```yaml
name: autofix.ci
on:
  pull_request:
  push:
permissions: {}
jobs:
  prettier:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: |
          yarn
          yarn prettier . --write
      - uses: autofix-ci/action@v1
        with:
          commit-message: "Apply Prettier format"
```

**Source**: [Run Prettier on CI](https://prettier.io/docs/ci)
