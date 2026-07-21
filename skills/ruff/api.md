# Ruff — API Reference

## CLI Commands

### Top-Level Commands

```
Usage: ruff [OPTIONS] <COMMAND>

Commands:
  check     Run Ruff on the given files or directories
  rule      Explain a rule (or all rules)
  config    List or describe the available configuration options
  linter    List all supported upstream linters
  clean     Clear any caches in the current directory and any subdirectories
  format    Run the Ruff formatter on the given files or directories
  server    Run the language server
  analyze   Run analysis over Python source code
  version   Display Ruff's version
  help      Print this message or the help of the given subcommand(s)

Global Options:
  --config <CONFIG_OPTION>   Path to TOML config file or inline TOML KEY=VALUE override
  --isolated                 Ignore all configuration files
  --color <WHEN>             Control colored output: auto, always, never
  -h, --help                 Print help
  -V, --version              Print version

Log Levels:
  -v, --verbose              Enable verbose logging
  -q, --quiet                Print diagnostics only
  -s, --silent               Disable all logging (still exits 1 on violations)
```

### `ruff check` — Linter

```
Usage: ruff check [OPTIONS] [FILES]...

Arguments:
  [FILES]...    List of files or directories to check, or `-` for stdin [default: .]

Options:
  --fix                          Apply fixes to resolve lint violations
  --unsafe-fixes                 Include fixes that may not retain original intent
  --show-fixes                   Show enumeration of all fixed violations
  --diff                         Output diff for each changed file (no writing)
  -w, --watch                    Re-run whenever files change
  --fix-only                     Apply fixes but don't report leftover violations
  --ignore-noqa                  Ignore any `# noqa` comments
  --output-format <FORMAT>       Output format: concise, full, json, json-lines,
                                 junit, grouped, github, gitlab, pylint, rdjson,
                                 azure, sarif [env: RUFF_OUTPUT_FORMAT=]
  -o, --output-file <FILE>       Write output to file (default: stdout)
  --target-version <VERSION>     Min Python version: py37–py315
  --preview                      Enable preview mode (unstable rules/fixes)
  --extension <EXTENSION>        Map file extensions to language types
  --statistics                   Show counts per rule with violations
  --add-noqa[=<REASON>]          Auto-add `# noqa` directives to failing lines
  --add-ignore[=<REASON>]        Auto-add `ruff:ignore` comments (preview)
  --show-files                   List files Ruff will check
  --show-settings                Show settings Ruff will use

Rule Selection:
  --select <RULE_CODE>           Enable rule codes (or ALL)
  --ignore <RULE_CODE>           Disable rule codes
  --extend-select <RULE_CODE>    Add rule codes on top of existing selection
  --per-file-ignores <MAPPING>   File pattern → rule codes to exclude
  --extend-per-file-ignores      Add per-file ignores on top
  --fixable <RULE_CODE>          Rules eligible for fix
  --unfixable <RULE_CODE>        Rules ineligible for fix
  --extend-fixable <RULE_CODE>   Add fixable rules on top

File Selection:
  --exclude <FILE_PATTERN>       Omit files/directories from analysis
  --extend-exclude <FILE_PATTERN> Add exclusions on top
  --respect-gitignore            Respect .gitignore (default: true)
  --force-exclude                Enforce exclusions even for direct paths

Miscellaneous:
  -n, --no-cache                 Disable cache reads [env: RUFF_NO_CACHE=]
  --cache-dir <CACHE_DIR>        Path to cache directory [env: RUFF_CACHE_DIR=]
  --stdin-filename <NAME>        Filename when reading from stdin
  -e, --exit-zero                Exit 0 even with violations
  --exit-non-zero-on-fix         Exit non-zero if files modified via fix
```

### `ruff format` — Formatter

```
Usage: ruff format [OPTIONS] [FILES]...

Arguments:
  [FILES]...    List of files or directories to format, or `-` for stdin [default: .]

Options:
  --check                       Don't write; exit non-zero if files would change
  --diff                        Don't write; show diff and exit non-zero
  --target-version <VERSION>    Min Python version: py37–py315
  --preview                     Enable preview formatting style
  --extension <EXTENSION>       Map file extensions to language types
  --output-format <FORMAT>      Output format when used with --check
  --line-length <N>             Set the line length
  --range <RANGE>               Format only within range: start_line:start_col-end_line:end_col
  --exit-non-zero-on-format     Exit non-zero if files were modified

File Selection:
  --exclude <FILE_PATTERN>      Omit files/directories
  --extend-exclude <FILE_PATTERN> Add exclusions
  --force-exclude               Enforce exclusions for direct paths
  --respect-gitignore           Respect .gitignore

Miscellaneous:
  -n, --no-cache                Disable cache reads
  --cache-dir <CACHE_DIR>       Path to cache directory
  --stdin-filename <NAME>       Filename when reading from stdin
```

### `ruff rule` — Rule Explainer

```bash
# Explain a specific rule
ruff rule F401

# Explain all rules
ruff rule --all
```

### `ruff config` — Configuration Explorer

```bash
# List all configuration options
ruff config

# Describe a specific option
ruff config line-length
```

### `ruff linter` — Supported Linters

```bash
# List all supported upstream linters
ruff linter
```

### `ruff clean` — Clear Cache

```bash
ruff clean
```

### `ruff server` — Language Server

```bash
ruff server
```

Starts the built-in language server (LSP) for editor integration. Written in Rust, available since v0.4.5, stabilized in v0.5.3. Supports diagnostics, code actions, and formatting.

### `ruff analyze` — Code Analysis

```bash
ruff analyze path/to/code/
```

---

## Configuration

### Config File Formats

Ruff supports three configuration file formats, discovered in priority order:

1. **`.ruff.toml`** — Ruff-specific TOML format (no `[tool.ruff]` prefix needed)
2. **`ruff.toml`** — Same as above
3. **`pyproject.toml`** — Standard Python project config (requires `[tool.ruff]` prefix)

### Config File Discovery

Ruff searches up the directory tree from each file being checked, using the closest configuration file. This enables per-directory configuration. A `--config` flag on the CLI overrides all discovered configs.

### Hierarchical Configuration

```toml
# Parent: pyproject.toml
[tool.ruff]
line-length = 88
target-version = "py310"

[tool.ruff.lint]
select = ["E4", "E7", "E9", "F", "B"]
ignore = ["E501"]

# Child: tests/pyproject.toml
[tool.ruff]
extend = "../pyproject.toml"
src = ["../src"]

[tool.ruff.lint]
# Inherits select from parent, adds ignores
ignore = ["E402", "S101"]
```

**Merging behavior for rule selection:**
- If child specifies `lint.select`: new baseline, parent's `lint.ignore` discarded.
- If child omits `lint.select`: parent's selection inherited, both parent and child `lint.ignore` accumulated.

### Python File Discovery

- **Default includes**: `*.py`, `*.pyi`, `*.ipynb`, `pyproject.toml` (and `*.pyw` in preview mode)
- **Custom includes**: Use `include` setting (must match files, not directories)
- **Custom extensions**: Use `extend-include` or `extension` mapping
- **Excludes**: `exclude` (replaces defaults), `extend-exclude` (adds to defaults)
- **Gitignore**: Respected by default (`respect-gitignore = true`)
- **Force exclude**: `force-exclude = true` enforces exclusions even for direct paths

```toml
[tool.ruff]
include = ["pyproject.toml", "src/**/*.py", "scripts/**/*.py"]
extend-include = ["*.pyw"]
extend-exclude = ["tests", "src/bad.py"]

# Custom extension mapping
[tool.ruff]
extension = { rpy = "python", ipy = "ipynb", mdx = "markdown" }
```

### Section-Specific Excludes

```toml
# Exclude .pyi from formatting but still lint them
[tool.ruff.format]
exclude = ["*.pyi"]

# Exclude .ipynb from linting but still format them
[tool.ruff.lint]
exclude = ["*.ipynb"]
```

### The `--config` CLI Flag

The `--config` flag has two uses:

1. **Point to a config file**:
```bash
ruff check path/to/directory --config path/to/ruff.toml
```

2. **Inline TOML overrides** (for settings without dedicated CLI flags):
```bash
ruff check path/to/file \
  --config "lint.dummy-variable-rgx = '__.*'" \
  --config "lint.per-file-ignores = {'some_file.py' = ['F841']}"
```

Inline overrides use `lint.` prefix for linter settings and `format.` prefix for formatter settings. Dedicated CLI flags take priority over `--config` overrides.

---

## Settings Reference

### Top-Level Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `builtins` | `list[str]` | `[]` | Builtins to treat as defined references |
| `cache-dir` | `str` | `.ruff_cache` | Cache directory path |
| `exclude` | `list[str]` | (see below) | File patterns to exclude |
| `extend` | `str` | `null` | Path to base config file to merge |
| `extend-exclude` | `list[str]` | `[]` | Additional patterns to exclude |
| `extend-include` | `list[str]` | `[]` | Additional patterns to include |
| `extension` | `dict[str, str]` | `{}` | Custom file extension → language mapping |
| `fix` | `bool` | `false` | Enable fix by default |
| `fix-only` | `bool` | `false` | Fix only, don't report leftover violations |
| `force-exclude` | `bool` | `false` | Enforce exclude patterns even for explicitly passed paths |
| `include` | `list[str]` | `["*.py", "*.pyi", "*.pyw", "*.ipynb", "*.md", "**/pyproject.toml", "**/ruff.toml", "**/.ruff.toml"]` | File patterns to include |
| `indent-width` | `int` | `4` | Number of spaces per indentation level |
| `line-length` | `int` | `88` | Maximum line length |
| `namespace-packages` | `list[str]` | `[]` | Directories to treat as namespace packages |
| `output-format` | `"full" \| "concise" \| "grouped" \| "json" \| "junit" \| "github" \| "gitlab" \| "pylint" \| "azure"` | `"full"` | Output serialization format |
| `per-file-target-version` | `dict[str, str]` | `{}` | Per-file Python version overrides |
| `preview` | `bool` | `false` | Enable preview mode globally |
| `required-version` | `str` | `null` | Minimum Ruff version required (PEP 440 specifier) |
| `respect-gitignore` | `bool` | `true` | Respect .gitignore files |
| `show-fixes` | `bool` | `false` | Show enumeration of fixed violations |
| `src` | `list[str]` | `[".", "src"]` | Source directories for first-party import detection |
| `target-version` | `"py37" \| "py38" \| "py39" \| "py310" \| "py311" \| "py312" \| "py313" \| "py314"` | `"py310"` | Minimum Python version to support |
| `task-tags` | `list[str]` | `["TODO", "FIXME", "XXX"]` | Tags recognized in TODO comments |
| `unsafe-fixes` | `bool` | `null` | Enable unsafe fixes (null = show hint) |

**Default `exclude`**: `[".bzr", ".direnv", ".eggs", ".git", ".git-rewrite", ".hg", ".mypy_cache", ".nox", ".pants.d", ".pytype", ".ruff_cache", ".svn", ".tox", ".venv", "__pypackages__", "_build", "buck-out", "dist", "node_modules", "venv"]`

### Lint Settings (`[tool.ruff.lint]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `allowed-confusables` | `list[str]` | `[]` | Unicode chars to ignore for RUF001–RUF003 |
| `dummy-variable-rgx` | `str` | `"^(_+\|(_+[a-zA-Z0-9_]*[a-zA-Z0-9]+?))$"` | Regex for dummy variables |
| `exclude` | `list[str]` | `[]` | Patterns to exclude from linting only |
| `explicit-preview-rules` | `bool` | `false` | Require exact codes for preview rules |
| `extend-fixable` | `list[str]` | `[]` | Additional fixable rule codes |
| `extend-ignore` | `list[str]` | `[]` | Additional ignored rule codes |
| `extend-per-file-ignores` | `dict[str, list[str]]` | `{}` | Additional per-file ignores |
| `extend-select` | `list[str]` | `[]` | Additional selected rule codes |
| `extend-safe-fixes` | `list[str]` | `[]` | Rules to treat as safe fixes |
| `extend-unsafe-fixes` | `list[str]` | `[]` | Rules to treat as unsafe fixes |
| `external` | `list[str]` | `[]` | External codes to suppress F821 |
| `fixable` | `list[str]` | `["ALL"]` | Rules eligible for fix |
| `future-annotations` | `bool` | `false` | Allow `from __future__ import annotations` to simplify fixes |
| `ignore` | `list[str]` | `[]` | Rule codes to disable |
| `ignore-init-module-imports` | `bool` | `true` | Avoid checking `__init__.py` imports (deprecated) |
| `logger-objects` | `list[str]` | `[]` | Objects treated as loggers |
| `per-file-ignores` | `dict[str, list[str]]` | `{}` | File pattern → rule codes to ignore |
| `preview` | `bool` | `false` | Enable preview lint rules |
| `select` | `list[str]` | `["E4", "E7", "E9", "F"]` | Rule codes to enable |
| `task-tags` | `list[str]` | `["TODO", "FIXME", "XXX"]` | Tags for TODO comments |
| `typing-modules` | `list[str]` | `[]` | Modules to treat as typing-related |
| `typing-extensions` | `bool` | `true` | Allow imports from `typing_extensions` for older Python |
| `unfixable` | `list[str]` | `[]` | Rules ineligible for fix |
| `unsafe-fixes` | `bool` | `false` | Enable unsafe fixes by default |

### Format Settings (`[tool.ruff.format]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `docstring-code-format` | `bool` | `false` | Format code snippets in docstrings |
| `docstring-code-line-length` | `int \| "dynamic"` | `"dynamic"` | Line length for docstring code |
| `exclude` | `list[str]` | `[]` | Patterns to exclude from formatting only |
| `indent-style` | `"space" \| "tab"` | `"space"` | Indentation style |
| `line-ending` | `"auto" \| "lf" \| "cr-lf" \| "native"` | `"auto"` | Line ending style |
| `nested-string-quote-style` | `"alternating" \| "preferred"` | `"alternating"` | Quote style for nested strings in f-strings (Python 3.12+) |
| `preview` | `bool` | `false` | Enable preview formatting style |
| `quote-style` | `"double" \| "single" \| "preserve"` | `"double"` | Quote style preference |
| `skip-magic-trailing-comma` | `bool` | `false` | Ignore magic trailing commas |

### isort Settings (`[tool.ruff.lint.isort]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `case-sensitive` | `bool` | `false` | Case-sensitive import sorting |
| `classes` | `list[str]` | `[]` | Tokens always treated as classes |
| `combine-as-imports` | `bool` | `false` | Combine `as` imports on same line |
| `constants` | `list[str]` | `[]` | Tokens always treated as constants |
| `default-section` | `str` | `"third-party"` | Default section for unmatched imports |
| `detect-same-package` | `bool` | `true` | Auto-detect same-package imports as first-party |
| `extra-standard-library` | `list[str]` | `[]` | Additional standard library modules |
| `force-single-line` | `bool` | `false` | Force each import on its own line |
| `force-sort-within-sections` | `bool` | `false` | Force sort within sections |
| `force-wrap-aliases` | `bool` | `false` | Force wrapping aliased imports |
| `forced-separate` | `list[str]` | `[]` | Modules to force into separate sections |
| `from-first` | `bool` | `false` | Sort `from` imports before straight imports |
| `import-heading` | `dict[str, str]` | `{}` | Section → heading comment text |
| `known-first-party` | `list[str]` | `[]` | Modules to treat as first-party |
| `known-local-folder` | `list[str]` | `[]` | Modules to treat as local |
| `known-third-party` | `list[str]` | `[]` | Modules to treat as third-party |
| `length-sort` | `bool` | `false` | Sort imports by length |
| `length-sort-straight` | `bool` | `false` | Sort straight imports by length |
| `lines-after-imports` | `int` | `-1` | Blank lines after imports (-1 = auto) |
| `lines-between-types` | `int` | `0` | Lines between straight and from imports |
| `no-lines-before` | `list[str]` | `[]` | Sections with no blank line before |
| `order-by-type` | `bool` | `true` | Order imports by type (CONST, Class, func) |
| `relative-imports-order` | `"furthest-to-closest" \| "closest-to-furthest"` | `"furthest-to-closest"` | Relative import order |
| `required-imports` | `list[str]` | `[]` | Imports to always include |
| `section-order` | `list[str]` | `["future", "standard-library", "third-party", "first-party", "local-folder"]` | Section ordering |
| `sections` | `dict[str, list[str]]` | `{}` | Custom section definitions |
| `single-line-exclusions` | `list[str]` | `[]` | Modules excluded from single-line |
| `split-on-trailing-comma` | `bool` | `true` | Split imports on trailing comma |
| `variables` | `list[str]` | `[]` | Tokens always recognized as variables for order-by-type |

### flake8-bugbear Settings (`[tool.ruff.lint.flake8-bugbear]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `extend-immutable-calls` | `list[str]` | `[]` | Calls to treat as immutable for B008 |

### flake8-bandit Settings (`[tool.ruff.lint.flake8-bandit]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `allowed-markup-calls` | `list[str]` | `[]` | Calls safe to pass to `markupsafe.Markup` |
| `check-typed-exception` | `bool` | `false` | Disallow S110 for specific exception types |
| `extend-markup-names` | `list[str]` | `[]` | Additional callables like `markupsafe.Markup` |
| `hardcoded-tmp-directory` | `list[str]` | `["/tmp", "/var/tmp", "/dev/shm"]` | Directories considered temporary (S108) |
| `hardcoded-tmp-directory-extend` | `list[str]` | `[]` | Additional temp directories |

### flake8-boolean-trap Settings (`[tool.ruff.lint.flake8-boolean-trap]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `extend-allowed-calls` | `list[str]` | `[]` | Additional calls allowed to use boolean traps |

### flake8-builtins Settings (`[tool.ruff.lint.flake8-builtins]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `allowed-modules` | `list[str]` | `[]` | Builtin module names to allow |
| `ignorelist` | `list[str]` | `[]` | Builtins to ignore for shadowing checks |
| `strict-checking` | `bool` | `false` | Compare module names instead of full paths |

### flake8-comprehensions Settings (`[tool.ruff.lint.flake8-comprehensions]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `allow-dict-calls-with-keyword-arguments` | `bool` | `false` | Allow `dict(a=1, b=2)` calls |

### flake8-copyright Settings (`[tool.ruff.lint.flake8-copyright]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `author` | `str` | `null` | Author to enforce in copyright notice |
| `min-file-size` | `int` | `0` | Min file size (bytes) for copyright enforcement |
| `notice-rgx` | `str` | `"(?i)Copyright\\s+..."` | Regex for copyright notice matching |

### flake8-errmsg Settings (`[tool.ruff.lint.flake8-errmsg]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `max-string-length` | `int` | `0` | Max string length in exception messages |

### flake8-annotations Settings (`[tool.ruff.lint.flake8-annotations`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `allow-star-arg-any` | `bool` | `false` | Allow `*args: Any` without annotation |
| `ignore-fully-untyped` | `bool` | `false` | Skip fully untyped functions |
| `mypy-init-return` | `bool` | `false` | Allow omitted return type if `-> None` |
| `suppress-dummy-args` | `bool` | `false` | Skip dummy variable args |
| `suppress-none-returning` | `bool` | `false` | Skip functions returning None implicitly |

### flake8-quotes Settings (`[tool.ruff.lint.flake8-quotes]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `avoid-escape` | `bool` | `true` | Allow quotes that would otherwise require escaping |
| `docstring-quotes` | `str` | `"double"` | Quote style for docstrings |
| `inline-quotes` | `str` | `"double"` | Quote style for inline strings |
| `multiline-quotes` | `str` | `"double"` | Quote style for multiline strings |

### flake8-tidy-imports Settings (`[tool.ruff.lint.flake8-tidy-imports]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `ban-lazy` | `"all" \| list[str] \| {include, exclude}` | `[]` | Modules that may not be imported lazily (Python 3.15+) |
| `ban-relative-imports` | `"all" \| "parents" \| "never"` | `"parents"` | Ban relative imports |
| `banned-api` | `dict[str, str]` | `{}` | Banned APIs with messages |
| `banned-module-level-imports` | `list[str]` | `[]` | Modules banned at module level |
| `require-lazy` | `"all" \| list[str] \| {include, exclude}` | `[]` | Modules that must be imported lazily (Python 3.15+) |

### flake8-import-conventions Settings (`[tool.ruff.lint.flake8-import-conventions]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `aliases` | `dict[str, str]` | `{"altair": "alt", "matplotlib": "mpl", ...}` | Conventional import aliases |
| `banned-aliases` | `dict[str, list[str]]` | `{}` | Banned aliases for imports |
| `banned-from` | `list[str]` | `[]` | Modules banned from `from ... import` syntax |
| `extend-aliases` | `dict[str, str]` | `{}` | Additional aliases |

### flake8-pytest-style Settings (`[tool.ruff.lint.flake8-pytest-style]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `fixture-parentheses` | `bool` | `false` | Require parentheses for fixtures |
| `mark-parentheses` | `bool` | `false` | Require parentheses for marks |
| `parametrize-names-type` | `"csv" \| "tuple" \| "list"` | `"tuple"` | Parametrize names type |
| `parametrize-values-row-type` | `"tuple" \| "list"` | `"tuple"` | Parametrize values row type |
| `parametrize-values-type` | `"tuple" \| "list"` | `"list"` | Parametrize values type |
| `raises-extend-require-match-for` | `list[str]` | `[]` | Additional raises require match |
| `raises-require-match-for` | `list[str]` | `["BaseException", "Exception", ...]` | Raises that require match |
| `warns-extend-require-match-for` | `list[str]` | `[]` | Additional warns require match |
| `warns-require-match-for` | `list[str]` | `[]` | Warns that require match |

### flake8-type-checking Settings (`[tool.ruff.lint.flake8-type-checking]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `exempt-modules` | `list[str]` | `["typing"]` | Modules exempt from runtime evaluation |
| `quote-annotations` | `bool` | `false` | Always quote forward-reference annotations |
| `runtime-evaluated-base-classes` | `list[str]` | `[]` | Base classes evaluated at runtime |
| `runtime-evaluated-decorators` | `list[str]` | `[]` | Decorators evaluated at runtime |
| `strict` | `bool` | `false` | Strict mode for type-checking imports |

### pep8-naming Settings (`[tool.ruff.lint.pep8-naming]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `classmethod-decorators` | `list[str]` | `[]` | Decorators that make methods classmethods |
| `extend-ignore-names` | `list[str]` | `[]` | Additional names to ignore |
| `ignore-names` | `list[str]` | `[]` | Names to ignore for naming rules |
| `staticmethod-decorators` | `list[str]` | `[]` | Decorators that make methods staticmethods |

### pycodestyle Settings (`[tool.ruff.lint.pycodestyle]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `ignore-overlong-task-comments` | `bool` | `false` | Ignore E501 for task comments |
| `max-doc-length` | `int \| null` | `null` | Max docstring/comment line length |
| `max-line-length` | `int \| null` | `null` | Max line length (overrides line-length) |

### pydocstyle Settings (`[tool.ruff.lint.pydocstyle]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `convention` | `"google" \| "numpy" \| "pep257" \| null` | `null` | Docstring convention |
| `ignore-decorators` | `list[str]` | `[]` | Decorators that skip docstring checks |
| `ignore-var-parameters` | `bool` | `false` | Ignore missing docs for *args/**kwargs |
| `property-decorators` | `list[str]` | `[]` | Decorators that indicate a method is a property |

### pydoclint Settings (`[tool.ruff.lint.pydoclint]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `convention` | `"google" \| "numpy" \| null` | `null` | Docstring convention for linting |
| `ignore-one-line-docstrings` | `bool` | `false` | Skip docstrings that fit on a single line |
| `ignore-var-parameters` | `bool` | `false` | Ignore *args/**kwargs in docstrings |

### mccabe Settings (`[tool.ruff.lint.mccabe]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `max-complexity` | `int` | `10` | Max cyclomatic complexity |

### pylint Settings (`[tool.ruff.lint.pylint]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `allow-dunder-method-names` | `list[str]` | `[]` | Allowed dunder method names |
| `allow-magic-value-types` | `list[str]` | `["str", "bytes"]` | Allowed magic value types |
| `max-args` | `int` | `5` | Max function arguments |
| `max-bool-expr` | `int` | `5` | Max boolean expressions in condition |
| `max-branches` | `int` | `12` | Max branches per function |
| `max-locals` | `int` | `15` | Max local variables |
| `max-nested-blocks` | `int` | `5` | Max nested blocks |
| `max-positional-args` | `int` | `5` | Max positional arguments |
| `max-public-methods` | `int` | `20` | Max public methods per class |
| `max-returns` | `int` | `6` | Max return statements |
| `max-statements` | `int` | `50` | Max statements per function |
| `max-statements-in-try` | `int` | `5` | Max statements in a try clause body (W0717) |

### flake8-gettext Settings (`[tool.ruff.lint.flake8-gettext`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `extend-function-names` | `list[str]` | `[]` | Additional i18n function names |
| `function-names` | `list[str]` | `["_", "gettext", "ngettext"]` | Function names considered i18n calls |

### flake8-implicit-str-concat Settings (`[tool.ruff.lint.flake8-implicit-str-concat]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `allow-multiline` | `bool` | `true` | Allow implicit concatenation for multiline strings |

### flake8-self Settings (`[tool.ruff.lint.flake8-self]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `extend-ignore-names` | `list[str]` | `[]` | Additional names to ignore for flake8-self |
| `ignore-names` | `list[str]` | `["_make", "_asdict", ...]` | Names to ignore for flake8-self violations |

### pyupgrade Settings (`[tool.ruff.lint.pyupgrade]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `keep-runtime-typing` | `bool` | `false` | Preserve runtime typing even with `__future__` annotations |

### flake8-unused-arguments Settings (`[tool.ruff.lint.flake8-unused-arguments]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `ignore-variadic-names` | `bool` | `false` | Ignore unused *args/**kwargs |
| `ignore-var-names` | `bool` | `false` | Ignore unused variable names |

### pyflakes Settings (`[tool.ruff.lint.pyflakes]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `allowed-unused-imports` | `list[str]` | `[]` | Modules to ignore for unused imports |
| `extend-generics` | `list[str]` | `[]` | Additional functions/classes to treat as generic |

### Ruff-specific Settings (`[tool.ruff.lint.ruff]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `allowed-confusables` | `list[str]` | `[]` | Allowed confusable Unicode chars |
| `parenthesize-tuple-in-subscript` | `bool` | `false` | Parenthesize tuple in subscript (RUF031) |
| `strictly-empty-init-modules` | `bool` | `false` | Require `__init__.py` to contain no code (RUF067) |

### analyze Settings (`[tool.ruff.analyze]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `detect-string-imports` | `bool` | `false` | Detect imports from string literals |
| `direction` | `"dependencies" \| "dependents"` | `"dependencies"` | Graph direction |
| `exclude` | `list[str]` | `[]` | Files to exclude from analysis |
| `extension` | `dict[str, str]` | `{}` | Custom extension mapping |
| `include` | `list[str]` | `[]` | Files to include in analysis |
| `include-dependencies` | `dict[str, list[str]]` | `{}` | Manual file → dependencies mapping |
| `preview` | `bool` | `false` | Enable preview analysis |
| `string-imports-min-dots` | `int` | `2` | Min dots in string to consider valid import |

---

## Rules Reference

### Legend

- 🧪 — Preview rule (unstable, requires `--preview`)
- ⚠️ — Deprecated rule (will be removed)
- ❌ — Removed rule (documentation only)
- 🛠️ — Auto-fixable via `--fix`

### Rule Categories

Ruff organizes rules by their originating linter/plugin. Each category has a prefix code:

| Prefix | Category | Origin | Description |
|--------|----------|--------|-------------|
| `AIR` | Airflow | apache-airflow | Airflow-specific rules |
| `ANN` | flake8-annotations | flake8-annotations | Type annotation checks |
| `ARG` | flake8-unused-arguments | flake8-unused-arguments | Unused function arguments |
| `ASYNC` | flake8-async | flake8-async | Async/await best practices |
| `B` | flake8-bugbear | flake8-bugbear | Common bug patterns |
| `BLE` | flake8-blind-except | flake8-blind-except | Blind except clauses |
| `C4` | flake8-comprehensions | flake8-comprehensions | Comprehension improvements |
| `C90` | mccabe | mccabe | Cyclomatic complexity |
| `COM` | flake8-commas | flake8-commas | Trailing comma conventions |
| `CPY` | flake8-copyright | flake8-copyright | Copyright header checks |
| `D` | pydocstyle | pydocstyle | Docstring conventions |
| `DOC` | pydoclint | pydoclint | Docstring content linting |
| `DTZ` | flake8-datetimez | flake8-datetimez | Datetime timezone checks |
| `E` | pycodestyle (errors) | pycodestyle | PEP 8 error rules |
| `EM` | flake8-errmsg | flake8-errmsg | Error message strings |
| `ERA` | eradicate | eradicate | Commented-out code |
| `EXE` | flake8-executable | flake8-executable | File executable checks |
| `F` | Pyflakes | pyflakes | Basic Python errors (default) |
| `FA` | flake8-future-annotations | flake8-future-annotations | Future annotations |
| `FAST` | FastAPI | fastapi | FastAPI-specific rules |
| `FBT` | flake8-boolean-trap | flake8-boolean-trap | Boolean trap anti-pattern |
| `FIX` | flake8-fixme | flake8-fixme | FIXME/TODO/XXX comments |
| `FLY` | flynt | flynt | f-string conversion |
| `FURB` | refurb | refurb | Code modernization |
| `G` | flake8-logging-format | flake8-logging-format | Logging format strings |
| `I` | isort | isort | Import sorting |
| `ICN` | flake8-import-conventions | flake8-import-conventions | Import naming conventions |
| `INP` | flake8-no-pep420 | flake8-no-pep420 | Missing `__init__.py` |
| `INT` | flake8-gettext | flake8-gettext | Gettext checks |
| `ISC` | flake8-implicit-str-concat | flake8-implicit-str-concat | Implicit string concatenation |
| `LOG` | flake8-logging | flake8-logging | Logging best practices |
| `N` | pep8-naming | pep8-naming | Naming conventions |
| `NPY` | NumPy-specific | numpy | NumPy deprecation checks |
| `PD` | pandas-vet | pandas-vet | Pandas best practices |
| `PERF` | Perflint | perflint | Performance anti-patterns |
| `PGH` | pygrep-hooks | pygrep-hooks | Generic pygrep hooks |
| `PIE` | flake8-pie | flake8-pie | Misc Python improvements |
| `PL` | Pylint | pylint | Pylint rules |
| `PT` | flake8-pytest-style | flake8-pytest-style | Pytest style |
| `PTH` | flake8-use-pathlib | flake8-use-pathlib | pathlib usage |
| `PYI` | flake8-pyi | flake8-pyi | Type stub file checks |
| `Q` | flake8-quotes | flake8-quotes | Quote style enforcement |
| `RET` | flake8-return | flake8-return | Return statement checks |
| `RSE` | flake8-raise | flake8-raise | Raise statement checks |
| `RUF` | Ruff-specific | ruff | Ruff-native rules |
| `S` | flake8-bandit | flake8-bandit | Security checks |
| `SIM` | flake8-simplify | flake8-simplify | Code simplification |
| `SLOT` | flake8-slots | flake8-slots | `__slots__` usage |
| `T10` | flake8-debugger | flake8-debugger | Debugger imports |
| `T20` | flake8-print | flake8-print | Print statements |
| `TC` | flake8-type-checking | flake8-type-checking | Type checking imports |
| `TID` | flake8-tidy-imports | flake8-tidy-imports | Tidy import practices |
| `TRY` | tryceratops | tryceratops | Try/except best practices |
| `UP` | pyupgrade | pyupgrade | Python version upgrades |
| `W` | pycodestyle (warnings) | pycodestyle | PEP 8 warning rules |
| `YTT` | flake8-2020 | flake8-2020 | sys.version checks |

### Default Rule Set

By default, Ruff enables:
- **`F`** — Pyflakes (unused imports, undefined names, etc.)
- **`E4`** — pycodestyle import-related errors
- **`E7`** — pycodestyle statement-related errors
- **`E9`** — pycodestyle runtime errors

In preview mode, the default set expands to include `B`, `UP`, and `RUF` categories.

### Commonly Used Rule Sets

```toml
[tool.ruff.lint]
select = [
    "F",     # Pyflakes (default)
    "E",     # pycodestyle errors
    "W",     # pycodestyle warnings
    "I",     # isort (import sorting)
    "B",     # flake8-bugbear
    "C4",    # flake8-comprehensions
    "UP",    # pyupgrade
    "N",     # pep8-naming
    "SIM",   # flake8-simplify
    "S",     # flake8-bandit (security)
    "D",     # pydocstyle
    "PT",    # flake8-pytest-style
    "PTH",   # flake8-use-pathlib
    "RUF",   # Ruff-specific
]
```

### Rule Selection Syntax

- **By full code**: `F401`, `E501`, `B008`
- **By prefix**: `E` (all E rules), `E5` (all E5xx rules), `E50` (all E50x rules)
- **`ALL`**: Selects all stable rules (not preview rules unless `--preview` is enabled)
- **`ALL` with preview**: `--select ALL --preview` selects all rules including preview
- **By rule name** (preview): Human-readable names like `unused-import` accepted in preview mode

**Rule selection guidelines:**
- Prefer `lint.select` over `lint.extend-select` to make your rule set explicit
- Use `ALL` with discretion — it implicitly enables new rules on upgrade
- Start with a small set (`select = ["E", "F"]`) and add categories incrementally
- When `ALL` is enabled, Ruff auto-disables conflicting rules (e.g., D203 vs. D211)

**Recommended popular rule set:**

```toml
[tool.ruff.lint]
select = [
    "E",    # pycodestyle
    "F",    # Pyflakes
    "UP",   # pyupgrade
    "B",    # flake8-bugbear
    "SIM",  # flake8-simplify
    "I",    # isort
]
```

**Rule resolution priority** (highest to lowest):
1. CLI options (e.g., `--select`)
2. Current `pyproject.toml` / `ruff.toml`
3. Inherited config files

Ruff uses the highest-priority `select` as the baseline, then applies `extend-select` and `ignore` adjustments.

### Per-File Ignores

```toml
[tool.ruff.lint.per-file-ignores]
"__init__.py" = ["E402"]           # Allow imports not at top
"**/{tests,docs,tools}/*" = ["E402", "S101"]  # Tests can use assert
"*_test.py" = ["S101"]
```

### Error Suppression

Ruff supports several mechanisms for suppressing lint errors.

#### Line-Level (`# noqa`)

```python
# Ignore F841
x = 1  # noqa: F841

# Ignore E741 and F841
i = 1  # noqa: E741, F841

# Ignore all violations on this line
x = 1  # noqa
```

For multi-line strings (like docstrings), the `noqa` goes after the closing triple quote:
```python
"""Lorem ipsum dolor sit amet.
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
"""  # noqa: E501
```

For import sorting, `noqa` goes at the end of the first line in the import block:
```python
import os  # noqa: I001
import abc
```

#### Line-Level (`# ruff: ignore` — Preview)

In preview mode, `# ruff: ignore` comments cover an entire logical line (multi-line statement):

```python
# ruff: ignore[unused-function-argument]
# Covers the entire function signature
def foo(
    arg1,
    arg2,
):
    pass
```

Placing inside a multi-line statement covers only that physical line:
```python
def foo(
    arg1,
    arg2,  # ruff: ignore[unused-function-argument]  # Only covers arg2
):
    pass
```

Ignore comments can be stacked:
```python
# ruff: ignore[ambiguous-variable-name]
# ruff: ignore[unused-variable]
i = 1
```

#### Block-Level (`# ruff: disable` / `# ruff: enable`)

Range suppression disables rules within a block:

```python
# ruff: disable[E501]
VALUE_1 = "Lorem ipsum dolor sit amet ..."
VALUE_2 = "Lorem ipsum dolor sit amet ..."
# ruff: enable[E501]
```

Both `disable` and `enable` must have matching codes in the same order. If no matching `enable` is found, Ruff treats it as an implicit range (ends at less-indented scope). RUF104 is produced for implicit ranges.

```python
def foo():
    # ruff: disable[E741, F841]
    i = 1
    # ruff: enable[E741, F841]
```

In preview mode, rule names (e.g., `unused-import`) can be used instead of codes (e.g., `F401`).

#### File-Level

```python
# Ignore all violations in this file
# ruff: noqa

# Ignore specific rule in this file
# ruff: noqa: F841
```

Ruff also respects Flake8's `# flake8: noqa` directive.

#### File-Ignore (Preview)

```python
# ruff: file-ignore[unused-import, unused-function-argument]
```

#### Detecting Unused Suppressions

Ruff implements RUF100 (`unused-noqa`) to flag unused suppression comments:

```bash
ruff check /path/to/file.py --extend-select RUF100
# Auto-remove unused suppressions:
ruff check /path/to/file.py --extend-select RUF100 --fix
```

#### Inserting Suppression Comments

```bash
# Add # noqa: {code} to all failing lines
ruff check /path/to/file.py --add-noqa

# Add # ruff: ignore comments with human-readable names (preview)
ruff check /path/to/file.py --add-ignore --preview
```

#### isort Action Comments

Ruff respects isort's action comments:

- `# isort: skip_file` — Skip import sorting for entire file
- `# isort: skip` — Skip import sorting for a single import
- `# isort: split` — Split import group at this point
- `# isort: on` / `# isort: off` — Enable/disable import sorting for a block

Ruff also accepts `# ruff:` prefixed variants (e.g., `# ruff: isort: skip_file`). Unlike isort, Ruff does not respect action comments within docstrings.

### Fix Safety

Ruff labels fixes as **safe** and **unsafe**:

- **Safe fixes**: Retain the meaning and intent of your code. Only remove comments when deleting entire statements/expressions.
- **Unsafe fixes**: Could lead to changed runtime behavior, removal of comments, or both.

Example: RUF015 (`unnecessary-iterable-allocation-for-first-element`) replaces `list(...)[0]` with `next(iter(...))` for performance. However, empty collections raise `IndexError` vs. `StopIteration`, so the fix is unsafe.

```bash
# Apply only safe fixes (default)
ruff check --fix

# Show unsafe fixes
ruff check --unsafe-fixes

# Apply safe and unsafe fixes
ruff check --fix --unsafe-fixes
```

Adjust fix safety per rule:

```toml
[tool.ruff.lint]
extend-safe-fixes = ["F601"]    # Promote unsafe to safe
extend-unsafe-fixes = ["UP034"] # Demote safe to unsafe
```

### Disabling Fixes

Control which rules can be fixed:

```toml
[tool.ruff.lint]
# Fix all rules except F401
fixable = ["ALL"]
unfixable = ["F401"]

# Only fix F401
fixable = ["F401"]
```

### Linter Exit Codes

`ruff check` exit codes:

| Code | Meaning |
|------|---------|
| `0` | No violations found, or all violations fixed automatically |
| `1` | Violations were found |
| `2` | Abnormal termination (invalid config, CLI options, or internal error) |

Special flags:
- `--exit-zero`: Exit 0 even with violations (still exits 2 on abnormal termination)
- `--exit-non-zero-on-fix`: Exit 1 if violations were found, even if all were fixed

### Preview Rules

Preview rules are unstable and only active when preview mode is enabled:

```toml
[tool.ruff.lint]
preview = true
select = ["E4", "E7", "E9", "F"]
```

To select individual preview rules without enabling all preview rules:

```toml
[tool.ruff.lint]
preview = true
explicit-preview-rules = true
select = ["ALL", "HYP001"]  # Only HYP001 from preview, not all HYP
```

### Deprecated Rules

When preview mode is enabled, deprecated rules are automatically disabled. Explicitly selecting a deprecated rule raises an error.

---

## Formatter

### Philosophy

The Ruff formatter is designed as a drop-in replacement for [Black](https://github.com/psf/black). It targets >99.9% identical output on Black-formatted code. The formatter innovates on performance and unified toolchain integration rather than code style.

### Usage

```bash
ruff format                     # Format all files in place
ruff format --check             # CI mode: exit non-zero if changes needed
ruff format --diff              # Show diff without writing
ruff format path/to/file.py     # Format a single file
ruff format --line-length 100   # Override line length
```

### Configuration

```toml
[tool.ruff]
line-length = 100

[tool.ruff.format]
quote-style = "single"          # "double", "single", or "preserve"
indent-style = "tab"            # "space" or "tab"
line-ending = "lf"              # "auto", "lf", "cr-lf", "native"
docstring-code-format = true    # Format code in docstrings
docstring-code-line-length = 60 # Line length for docstring code ("dynamic" or int)
skip-magic-trailing-comma = false  # Ignore magic trailing commas
```

### Docstring Code Formatting

When `docstring-code-format = true`, Ruff formats Python code examples in docstrings. Supported formats:

- **doctest** format (`>>>`)
- **Markdown fenced code blocks** with info strings: `python`, `py`, `python3`, `py3` (or no info string)
- **reStructuredText literal blocks**
- **reStructuredText `code-block` and `sourcecode` directives**

```toml
[tool.ruff.format]
docstring-code-format = true
docstring-code-line-length = "dynamic"  # Default: respects surrounding line length
# Or fixed: docstring-code-line-length = 40
```

### Markdown Code Formatting (Preview)

In preview mode, Ruff can format Python code blocks in Markdown files:

```toml
[tool.ruff]
extension = { mdx = "markdown", qmd = "markdown" }
```

Markdown code blocks with `python`, `py`, `python3`, `py3`, or `pyi` info strings are formatted. Quarto-style `{python}` blocks are also supported.

Format suppression in Markdown via HTML comments:

```html
<!-- fmt:off -->
```py
print( 'hello' )
```
<!-- fmt:on -->
```

Also supports `<!-- blacken-docs:off -->` and `<!-- blacken-docs:on -->`.

### Format Suppression

```python
# fmt: off
not_formatted = 3
also_not_formatted = 4
# fmt: on

# fmt: skip on a single statement
x = [1, 2, 3]  # fmt: skip

# YAPF compatibility
# yapf: disable
...
# yapf: enable
```

`# fmt: off` and `# fmt: on` are enforced at the statement level — they cannot be used within expressions.

`# fmt: skip` suppresses formatting for a case header, decorator, function definition, class definition, or preceding statements on the same logical line.

### Conflicting Lint Rules

When using the formatter, avoid these lint rules (they conflict with the formatter):

| Rule | Code | Reason |
|------|------|--------|
| `tab-indentation` | W191 | Formatter controls indentation |
| `indentation-with-invalid-multiple` | E111 | Formatter controls indentation |
| `indentation-with-invalid-multiple-comment` | E114 | Formatter controls indentation |
| `over-indented` | E117 | Formatter controls indentation |
| `incorrect-blank-line-before-class` | D203 | Formatter controls blank lines |
| `docstring-tab-indentation` | D206 | Formatter controls indentation |
| `triple-single-quotes` | D300 | Formatter controls quote style |
| `bad-quotes-inline-string` | Q000 | Formatter controls quotes |
| `bad-quotes-multiline-string` | Q001 | Formatter controls quotes |
| `bad-quotes-docstring` | Q002 | Formatter controls quotes |
| `avoidable-escaped-quote` | Q003 | Formatter controls quotes |
| `unnecessary-escaped-quote` | Q004 | Formatter controls quotes |
| `missing-trailing-comma` | COM812 | Formatter controls commas |
| `prohibited-trailing-comma` | COM819 | Formatter controls commas |
| `multi-line-implicit-string-concatenation` | ISC002 | Formatter controls formatting |

Also avoid these isort settings when using the formatter (non-default values are incompatible):
- `force-single-line`
- `force-wrap-aliases`
- `lines-after-imports`
- `lines-between-types`
- `split-on-trailing-comma`

### Exit Codes

**`ruff format`:**
- `0`: Success, regardless of whether files were formatted
- `1`: Success, files were formatted, and `--exit-non-zero-on-format` was specified
- `2`: Abnormal termination (invalid config, CLI options, or internal error)

**`ruff format --check`:**
- `0`: Success, no files would be formatted
- `1`: Success, one or more files would be formatted
- `2`: Abnormal termination

### Style Guide

The formatter adheres to Black's (stable) code style. Key style decisions:

- **Double quotes** by default (configurable)
- **4-space indentation** by default (configurable)
- **Trailing commas** in collections that are split across lines
- **Magic trailing comma**: A trailing comma after the last element forces multiline
- **String prefix normalization**: Normalizes string prefixes (e.g., `u"..."` → `"..."`)
- **Docstring normalization**: Converts `'''...'''` to `"""..."""`, strips leading whitespace

#### Intentional Deviations from Black

Ruff's formatter has the following known deviations from Black's stable style:

1. **Trailing end-of-line comments**: Black collapses statements with end-of-line comments; Ruff (like Prettier) expands them to keep comments near their original position. Only impacts unformatted code — already Black-formatted code produces identical output.

2. **Pragma comments ignored for line width**: `# type`, `# noqa`, `# pyright`, `# pylint` comments are ignored when computing line width, preventing Ruff from moving pragma comments and changing their meaning. (Similar to Pyink, deviation from Black.)

3. **Line width vs. line length**: Ruff uses Unicode width for all tokens; Black uses Unicode width for strings and character width for other tokens.

4. **Parenthesizing long nested-expressions**: Black 24+ parenthesizes long conditional expressions and type annotations in function parameters; Ruff matches Black 23's behavior (no extra parentheses). Under review for alternative approaches.

5. **Call expressions with single multiline string argument**: Ruff preserves the indentation of a single multiline-string argument; Black removes it.

6. **Blank lines at the start of a block**: Ruff always removes blank lines at the start of a block; Black 24+ allows them.

7. **F-strings**: Ruff formats expression parts in f-strings (normalizes quotes, removes spaces around operators); Black does not format f-string expressions.

8. **Implicit concatenated strings**: Ruff merges implicitly concatenated strings if they fit on a single line; Black keeps them split. Rare cases where merging isn't possible are preserved (ISC001 compatibility).

9. **`assert` statements**: Ruff prefers breaking the message over breaking the assertion; Black keeps the assertion parenthesized.

10. **`global`/`nonlocal` names**: Ruff breaks long `global`/`nonlocal` statements across multiple lines using continuations; Black does not.

11. **Trailing own-line comments on imports**: Black enforces an empty line between an import and a trailing comment; Ruff leaves comments in-place.

12. **Parentheses around awaited collections**: Ruff removes `await ([1, 2, 3])` → `await [1, 2, 3]`; Black preserves them.

13. **Implicit string concatenations in attribute accesses**: Ruff gives implicit concatenations lower priority when breaking lines, avoiding splits unless necessary; Black splits more often.

14. **Own-line comments on expressions**: Ruff associates comments with the entire expression, preserving formatting; Black associates with a sub-expression, causing expansion.

15. **Tuples are parenthesized when expanded**: Ruff always inserts parentheses around tuples that expand over multiple lines; Black removes them more often. Exception: `for` loops.

16. **Single-element tuples are always parenthesized**: `((a, b),)` in Ruff vs `(a, b),` in Black. Adds visual distinction and avoids accidental tuples.

17. **Parentheses around call-chain assignment values**: Ruff removes redundant parentheses in assignment values from call chains; Black preserves them.

18. **Call chain calls break differently**: Ruff only expands arguments if necessary to fit line width; Black occasionally expands the last call's arguments.

19. **Single `with` item (Python 3.8 or older)**: Ruff uses parenthesized layout matching `if`/`while` statements; Black uses a different layout.

20. **Last context manager in `with` may be collapsed**: Ruff may collapse the last context manager onto a single line if it fits; Black breaks differently. For Python 3.9+, parentheses are inserted for clearer breaks.

21. **Preserving parentheses around single-element lists**: Ruff preserves at least one set of parentheses around single-element lists; Black 2025+ removes them.

22. **Long lambda expressions**: Ruff adds parentheses around the lambda body and breaks it over multiple lines; Black breaks the call inside the lambda body.

23. **Blank line between function and decorated class in stubs**: Ruff enforces a single blank line in `.pyi` files; Black does not.

24. **Escaped quote in triple-quoted docstring**: Ruff avoids adding extra space when the last quote is escaped; Black adds the space.

**Preview-only deviations** (not listed above):
- F-string formatting (more aggressive splitting)
- Fluent layout for method chains (better line breaking)

---

## Supported Linters

Ruff re-implements rules from the following upstream linters and plugins:

### Flake8 Plugins

- flake8-2020, flake8-annotations, flake8-async, flake8-bandit
- flake8-blind-except, flake8-boolean-trap, flake8-bugbear
- flake8-builtins, flake8-commas, flake8-comprehensions
- flake8-copyright, flake8-datetimez, flake8-debugger
- flake8-django, flake8-docstrings, flake8-eradicate
- flake8-errmsg, flake8-executable, flake8-gettext
- flake8-implicit-str-concat, flake8-import-conventions
- flake8-logging, flake8-logging-format, flake8-no-pep420
- flake8-pie, flake8-print, flake8-pytest-style
- flake8-quotes, flake8-raise, flake8-return
- flake8-self, flake8-simplify, flake8-slots
- flake8-super, flake8-tidy-imports, flake8-todos
- flake8-type-checking, flake8-use-pathlib

### Standalone Tools

- **isort** — Import sorting
- **Black** — Code formatting (formatter is a drop-in replacement)
- **pyupgrade** — Python version modernization (most rules)
- **mccabe** — Cyclomatic complexity
- **pep8-naming** — Naming conventions
- **pydocstyle** — Docstring conventions
- **pandas-vet** — Pandas best practices
- **tryceratops** — Try/except best practices
- **perflint** — Performance anti-patterns
- **flynt** — f-string conversion
- **eradicate** — Commented-out code detection
- **yesqa** — Unused noqa detection
- **refurb** — Code modernization
- **pygrep-hooks** — Generic pygrep hooks

### Framework-Specific

- **Airflow** (AIR) — Apache Airflow rules
- **FastAPI** (FAST) — FastAPI-specific rules
- **NumPy** (NPY) — NumPy deprecation checks
- **Django** (DJ) — Django-specific rules (via flake8-django)

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `RUFF_OUTPUT_FORMAT` | Default output format for check/format |
| `RUFF_OUTPUT_FILE` | Default output file path |
| `RUFF_NO_CACHE` | Set to disable cache |
| `RUFF_CACHE_DIR` | Custom cache directory |
| `RUFF_LOG_LEVEL` | Logging level |
| `RUFF_RESPECT_GITIGNORE` | Whether to respect .gitignore |
| `RUFF_SHOW_FIXES` | Whether to show fixes |

---

## Sources

- [Ruff Documentation Home](https://docs.astral.sh/ruff/)
- [Installation Guide](https://docs.astral.sh/ruff/installation/)
- [Configuration Guide](https://docs.astral.sh/ruff/configuration/)
- [The Ruff Linter](https://docs.astral.sh/ruff/linter/)
- [Rules Reference](https://docs.astral.sh/ruff/rules/)
- [Settings Reference](https://docs.astral.sh/ruff/settings/)
- [Formatter Guide](https://docs.astral.sh/ruff/formatter/)
- [Known Deviations from Black](https://docs.astral.sh/ruff/formatter/black/)
- [Preview Mode](https://docs.astral.sh/ruff/preview/)
- [FAQ](https://docs.astral.sh/ruff/faq/)
