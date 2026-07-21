# ty API Reference

## CLI Reference

### `ty` (top-level)

```
ty <COMMAND>
```

**Commands:**

| Command | Description |
|---------|-------------|
| `ty check` | Check a project for type errors |
| `ty server` | Start the language server |
| `ty version` | Display ty's version |
| `ty explain` | Explain rules and other parts of ty |
| `ty help` | Print help message |
| `ty generate-shell-completion` | Generate shell completions |

### `ty check`

Check a project for type errors.

```
ty check [OPTIONS] [PATHS]...
```

**Arguments:**
- `PATHS` — Files or directories to check (default: working directory)

**Options:**

| Option | Description |
|--------|-------------|
| `--add-ignore` | Add `ty: ignore` comments to suppress all rule diagnostics |
| `--color <auto\|always\|never>` | Control colored output |
| `--config <KEY=VALUE>` | Override a specific configuration option (TOML key=value) |
| `--config-file <PATH>` | Path to a `ty.toml` file (may also set `TY_CONFIG_FILE`) |
| `--error <RULE>` | Treat rule as severity 'error' (repeatable, use 'all' for all rules) |
| `--error-on-warning` | Exit code 1 if any warning-level diagnostics (incompatible with `--exit-zero`, `--exit-zero-on-warning`) |
| `--exclude <PATTERN>` | Glob patterns to exclude from type checking |
| `--exit-zero` | Always exit with code 0, even with errors |
| `--exit-zero-on-warning` | Exit code 0 if no error-level diagnostics |
| `--extra-search-path <PATH>` | Additional module-resolution source path (repeatable) |
| `--fix` | Apply fixes to resolve errors |
| `--force-exclude` | Enforce exclusions even for paths passed on CLI (`--no-force-exclude` to disable) |
| `--help`, `-h` | Print help |
| `--ignore <RULE>` | Disable a rule (repeatable, use 'all' for all rules) |
| `--no-progress` | Hide progress outputs |
| `--output-format <FORMAT>` | Output format: `full`, `concise`, `github`, `gitlab`, `junit` (may also set `TY_OUTPUT_FORMAT`) |
| `--project <DIR>` | Run within the given project directory |
| `--python <PATH>`, `--venv <PATH>` | Path to Python environment or interpreter |
| `--python-platform <PLATFORM>`, `--platform <PLATFORM>` | Target platform: `win32`, `darwin`, `android`, `ios`, `linux`, `all` |
| `--python-version <VERSION>`, `--target-version <VERSION>` | Python version: `3.7`–`3.15` |
| `--quiet`, `-q` | Quiet output (`-qq` for silent) |
| `--respect-ignore-files` | Respect `.gitignore` and other ignore files (`--no-respect-ignore-files` to disable) |
| `--typeshed <DIR>`, `--custom-typeshed-dir <DIR>` | Custom typeshed directory |
| `--verbose`, `-v` | Verbose output (`-vv`, `-vvv` for more) |
| `--warn <RULE>` | Treat rule as severity 'warn' (repeatable, use 'all' for all rules) |
| `--watch`, `-W` | Watch files for changes and recheck |

### `ty server`

Start the language server.

```
ty server
```

**Options:**
- `--help`, `-h` — Print help

### `ty version`

Display ty's version.

```
ty version
```

### `ty explain`

Explain rules and other parts of ty.

```
ty explain <COMMAND>
```

**Subcommands:**
- `ty explain rule [OPTIONS] [RULE]` — Explain a rule (or all rules)
  - `--output-format <text|json>` — Output format (default: `text`)

### `ty generate-shell-completion`

```
ty generate-shell-completion <SHELL>
```

**Arguments:** `bash`, `zsh`, `fish`, `elvish`, `powershell`

---

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | No violations, or only warnings (unless `--error-on-warning`) |
| `1` | One or more error-level violations (or warnings with `--error-on-warning`) |
| `2` | Invalid configuration or command-line arguments |
| `101` | Internal error (panic) |

**Exit code flags:**
- `--exit-zero`: Always exit 0
- `--error-on-warning`: Exit 1 for any warning+ diagnostics
- `--exit-zero-on-warning`: Exit 1 only for error-level diagnostics

---

## Environment Variables

### ty-specific

| Variable | Description |
|----------|-------------|
| `TY_CONFIG_FILE` | Path to a `ty.toml` configuration file |
| `TY_LOG` | Log level for verbose output (e.g., `ty=debug`, `trace`) |
| `TY_LOG_PROFILE` | Set to `"1"` or `"true"` to enable flamegraph profiling (`tracing.folded` file) |
| `TY_MAX_PARALLELISM` | Upper limit for parallel tasks |
| `TY_OUTPUT_FORMAT` | Output format (same values as `--output-format`) |

### Externally-defined

| Variable | Description |
|----------|-------------|
| `CONDA_DEFAULT_ENV` | Name of active Conda environment |
| `CONDA_PREFIX` | Path of active Conda environment |
| `PYTHONPATH` | Additional module search paths |
| `RAYON_NUM_THREADS` | Thread limit (equivalent to `TY_MAX_PARALLELISM`) |
| `VIRTUAL_ENV` | Path to activated virtual environment |
| `XDG_CONFIG_HOME` | User config directory (Unix) |
| `_CONDA_ROOT` | Root install path of Conda |

---

## Configuration Reference

### Configuration Files

- **Project-level**: `pyproject.toml` (`[tool.ty]` table) or `ty.toml` (no prefix)
- **User-level**: `~/.config/ty/ty.toml` (Linux/macOS), `%APPDATA%\ty\ty.toml` (Windows) — must use `ty.toml` format
- **Precedence**: CLI > project config > user config; `ty.toml` > `pyproject.toml` in same directory
- **Merging**: Scalars use project-level value; arrays are merged (project-level appended last)

### `rules` (`[tool.ty.rules]`)

Configures enabled rules and their severity.

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `<rule-name>` | `"ignore" \| "warn" \| "error"` | varies per rule | Severity for a specific rule |
| `all` | `"ignore" \| "warn" \| "error"` | varies | Default severity for all rules |

```toml
[tool.ty.rules]
possibly-unresolved-reference = "warn"
division-by-zero = "ignore"
all = "error"
```

### `analysis` (`[tool.ty.analysis]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `allowed-unresolved-imports` | `list[str]` | `[]` | Module glob patterns to suppress unresolved-import diagnostics |
| `replace-imports-with-any` | `list[str]` | `[]` | Module glob patterns whose imports are replaced with `typing.Any` |
| `respect-type-ignore-comments` | `bool` | `true` | Whether to respect `type: ignore` comments |
| `strict-literal-narrowing` | `bool` | `false` | Preserve broad builtin types instead of narrowing to literals |

**Glob pattern syntax for module patterns:**
- `*` matches zero or more characters except `.`
- `**` matches any number of module components
- `!` prefix excludes matching modules
- Later entries take precedence

### `environment` (`[tool.ty.environment]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `extra-paths` | `list[str]` | `[]` | User-provided paths for module resolution (similar to mypy's `MYPYPATH`) |
| `python` | `str` | `null` | Path to Python environment or interpreter (`.venv/bin/python3`, `.venv`, or `sys.prefix` dir) |
| `python-platform` | `"win32" \| "darwin" \| "android" \| "ios" \| "linux" \| "all" \| str` | `<current-platform>` | Target platform for type analysis |
| `python-version` | `"3.7" \| "3.8" \| ... \| "3.15"` | `"3.14"` | Target Python version for type analysis |
| `root` | `list[str]` | `null` | Root paths for finding first-party modules (priority order) |
| `typeshed` | `str` | `null` | Custom typeshed directory path |

**Python version discovery order:**
1. `project.requires-python` in `pyproject.toml`
2. Activated/configured Python environment
3. Default value (`3.14`)

**Root auto-detection** (if unspecified): `.` is always included, plus `./src`, `./<project-name>`, `./python` if they exist and are not packages.

### `overrides` (`[[tool.ty.overrides]]`)

Configuration overrides applying to specific files based on glob patterns. Later overrides take precedence. Override rules take precedence over global rules for matching files.

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `include` | `list[str]` | `["**"]` | File/directory patterns to include |
| `exclude` | `list[str]` | `[]` | File/directory patterns to exclude |
| `rules` | `dict[RuleName \| "all", "ignore" \| "warn" \| "error"]` | `{...}` | Rule overrides for matching files |
| `analysis.allowed-unresolved-imports` | `list[str]` | `[]` | Same as global `analysis.allowed-unresolved-imports` |
| `analysis.replace-imports-with-any` | `list[str]` | `[]` | Same as global `analysis.replace-imports-with-any` |
| `analysis.respect-type-ignore-comments` | `bool` | `true` | Same as global `analysis.respect-type-ignore-comments` |
| `analysis.strict-literal-narrowing` | `bool` | `false` | Same as global `analysis.strict-literal-narrowing` |

```toml
[[tool.ty.overrides]]
include = ["tests/**", "**/test_*.py"]
[tool.ty.overrides.rules]
possibly-unresolved-reference = "warn"
```

### `src` (`[tool.ty.src]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `exclude` | `list[str]` | `null` | File/directory patterns to exclude from type checking (gitignore-style) |
| `include` | `list[str]` | `null` | Files/directories to check (gitignore-style, reversed) |
| `respect-ignore-files` | `bool` | `true` | Respect `.ignore`, `.gitignore`, `.git/info/exclude`, and global gitignore |
| `root` | `str` | `null` | **Deprecated.** Use `environment.root` instead |

**Default excludes** (when `exclude` is not specified):
`**/.bzr/`, `**/.direnv/`, `**/.eggs/`, `**/.git/`, `**/.git-rewrite/`, `**/.hg/`, `**/.mypy_cache/`, `**/.nox/`, `**/.pants.d/`, `**/.pytype/`, `**/.ruff_cache/`, `**/.svn/`, `**/.tox/`, `**/.venv/`, `**/__pypackages__/`, `**/_build/`, `**/buck-out/`, `**/dist/`, `**/node_modules/`, `**/venv/`

**Glob syntax** (gitignore-style, follows [PEP 639](https://peps.python.org/pep-0639/) portable glob syntax with backslash escaping):
- `src/` matches a directory (including contents) named `src`; `src` matches a file or directory
- `*` matches any sequence except `/`; `**` matches zero or more path components (must form a single path component; `**a` and `b**` are invalid)
- `?` matches any single character except `/`
- `[abc]` or `[0-9]` for character ranges
- `!pattern` negates a pattern
- All patterns are anchored relative to project root (`src` matches `<project_root>/src`, not `<project_root>/test/src`; use `**/src` for any directory named `src`)
- **Warning:** Prefix include patterns like `**/src` can slow down Python file discovery

**Re-include excluded defaults:** Use negated patterns, e.g. `exclude = ["!**/build/"]`

**Explicit targets:** Paths passed as positional arguments to `ty check` are included even if they'd otherwise be excluded by `exclude` filters or ignore files.

**Excluding virtual environment files:** In Python 3.13+, `venv` adds a `.gitignore` to the venv root. For older Python, add `echo "*" > .venv/.gitignore` or add the venv to your project's `.gitignore`/`.ignore`.

### `terminal` (`[tool.ty.terminal]`)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `error-on-warning` | `bool` | `true` | Exit with code 1 even if all diagnostics only have warning severity |
| `output-format` | `"full" \| "concise" \| "github" \| "gitlab" \| "junit"` | `"full"` | Format for diagnostic messages |

---

## File Exclusions

### Default exclusions
By default, ty excludes commonly ignored directories (see `src.exclude` above). Re-include excluded directories with negated patterns: `exclude = ["!**/build/"]`.

By default, ty respects `.ignore`, `.gitignore`, `.git/info/exclude`, and global gitignore files. Disable with `respect-ignore-files = false`.

### Explicit targets
Paths passed as positional arguments to `ty check` are included even if they'd otherwise be excluded.

```bash
ty check src scripts/benchmark.py
```

### Excluding files from virtual environments
In Python 3.13+, the `venv` module adds a `.gitignore` file to the venv root. For older Python versions, add a `.gitignore` to your venv:
```bash
echo "*" > .venv/.gitignore
```
Or add the venv directory to your project's `.gitignore` or `.ignore` file.

---

## Module Discovery

### First-party modules
First-party modules are Python files in your project source code. By default, ty searches in the project root directory or `src/` if present.

Auto-detection: `.` is always included, plus `./src`, `./<project-name>`, `./python` if they exist and are not packages (no `__init__.py`/`__init__.pyi`).

Custom layout example:
```toml
[tool.ty.environment]
root = ["./app"]
```

### Third-party modules
Third-party modules are packages not part of your project or the standard library (e.g., `requests`, `numpy`, `django`). ty searches for them in the configured Python environment's `site-packages`.

### Python environment
Discovery order:
1. `VIRTUAL_ENV` environment variable
2. `.venv` directory in project root or working directory
3. `python3` or `python` in `PATH`
4. `--python` flag or `environment.python` setting (supports non-virtual environments when explicitly configured)

When using project management tools (uv, Poetry), the `run` command usually activates the venv automatically.

### PYTHONPATH
ty respects the `PYTHONPATH` environment variable. Directories are added to the module search path after `extra-paths` and before `site-packages`, mirroring Python interpreter resolution order. Format: `:`-separated on Unix, `;`-separated on Windows. Non-existent entries are ignored.

---

## Python Version

The Python version affects:
- **Allowed syntax**: Syntactic features must be available in the target version (e.g., `match` statements require 3.10+)
- **Standard library type definitions**: Symbols only available in newer versions trigger errors unless guarded by `sys.version_info` checks
- **Conditional type definitions**: First- and third-party module types conditional on Python version

```python
import sys
# `invalid-syntax` error if python-version is 3.9 or lower:
match "echo hello".split():
    case ["echo", message]: print(message)
    case _: print("unknown command")

# `unresolved-attribute` error if python-version is 3.9 or lower:
print(sys.stdlib_module_names)

# OK, because guarded by a version check:
if sys.version_info >= (3, 10):
    print(sys.stdlib_module_names)
```

**Discovery order:**
1. `project.requires-python` in `pyproject.toml` (uses lower bound)
2. Activated/configured Python environment metadata
3. Default: `3.14`

ty officially supports Python 3.10+. Python 3.7–3.9 can be selected but may produce false positives/negatives for standard-library APIs.

---

## Rule Levels

Each rule has a configurable level:

| Level | Behavior |
|-------|----------|
| `error` | Violations reported as errors; ty exits with code 1 |
| `warn` | Violations reported as warnings; exit code depends on `error-on-warning` |
| `ignore` | Rule is turned off |

**CLI configuration:**
```bash
ty check \
  --warn unused-ignore-comment \
  --ignore redundant-cast \
  --error possibly-missing-attribute \
  --error all  # Set all rules to error
```

**Configuration file:**
```toml
[tool.ty.rules]
unused-ignore-comment = "warn"
redundant-cast = "ignore"
all = "error"
```

---

## Suppression

### ty suppression comments

```python
# Inline suppression
a = 10 + "test"  # ty: ignore[unsupported-operator]

# Multiple rules on one line
sum_three_numbers("one", 5)  # ty: ignore[missing-argument, invalid-argument-type]

# Multi-line suppression (first or last line)
sum_three_numbers(  # ty: ignore[missing-argument]
    3, 2
)

# File-level suppression (before any code)
# ty: ignore[invalid-argument-type]
sum_three_numbers(3, 2, "1")
```

### Standard suppression comments

```python
# Suppress all violations on the line
sum_three_numbers("one", 5)  # type: ignore

# Suppress specific ty rule via type: ignore
sum_three_numbers("one", 5, 2)  # type: ignore[arg-type, ty:invalid-argument-type]
```

### Multiple suppression comments

```python
result = calculate()  # ty: ignore[invalid-argument-type]  # fmt: skip
```

### Unused suppression comments

If the `unused-ignore-comment` rule is enabled, ty reports unused `ty: ignore` and `type: ignore` comments. These can only be suppressed with `# ty: ignore[unused-ignore-comment]`.

### `@no_type_check` directive

```python
from typing import no_type_check

@no_type_check
def main():
    sum_three_numbers(1, 2)  # no error
```

> Note: `@no_type_check` on classes is not supported.

---

## Rules Reference

ty provides 80+ rules. Key rules include:

### Error-level (default)

- `abstract-method-in-final-class` — `@final` classes with unimplemented abstract methods
- `call-non-callable` — Calling a non-callable value
- `conflicting-declarations` — Conflicting declarations
- `conflicting-metaclass` — Conflicting metaclass
- `cyclic-class-definition` — Cyclic class definition
- `cyclic-type-alias-definition` — Cyclic type alias
- `division-by-zero` — Division by zero
- `duplicate-base` — Duplicate base class
- `empty-body` — Empty body in function/class
- `index-out-of-bounds` — Index out of bounds
- `invalid-argument-type` — Invalid argument type
- `invalid-assignment` — Invalid assignment
- `invalid-attribute-access` — Invalid attribute access
- `invalid-attribute-override` — Invalid attribute override
- `invalid-await` — Invalid `await`
- `invalid-base` — Invalid base class
- `invalid-context-manager` — Invalid context manager
- `invalid-dataclass` — Invalid dataclass
- `invalid-dataclass-override` — Invalid dataclass override
- `invalid-declaration` — Invalid declaration
- `invalid-exception-caught` — Invalid exception caught
- `invalid-explicit-override` — Invalid explicit `@override`
- `invalid-frozen-dataclass-subclass` — Invalid frozen dataclass subclass
- `invalid-generic-class` — Invalid generic class
- `invalid-generic-enum` — Invalid generic enum
- `invalid-ignore-comment` — Invalid ignore comment
- `invalid-key` — Invalid key
- `invalid-legacy-positional-parameter` — Invalid legacy positional parameter
- `invalid-legacy-type-variable` — Invalid legacy `TypeVariable`
- `invalid-match-pattern` — Invalid match pattern
- `invalid-metaclass` — Invalid metaclass
- `invalid-method-override` — Invalid method override
- `invalid-named-tuple` — Invalid `NamedTuple`
- `invalid-named-tuple-override` — Invalid `NamedTuple` override
- `invalid-newtype` — Invalid `NewType`
- `invalid-overload` — Invalid overload
- `invalid-parameter-default` — Invalid parameter default
- `invalid-paramspec` — Invalid `ParamSpec`
- `invalid-protocol` — Invalid protocol
- `invalid-raise` — Invalid `raise`
- `invalid-return-type` — Invalid return type
- `invalid-super-argument` — Invalid `super()` argument
- `invalid-syntax-in-forward-annotation` — Invalid syntax in forward annotation
- `invalid-total-ordering` — Invalid `@total_ordering`
- `invalid-type-alias-type` — Invalid `TypeAliasType`
- `invalid-type-arguments` — Invalid type arguments
- `invalid-type-checking-constant` — Invalid `typing.TYPE_CHECKING` constant
- `invalid-type-form` — Invalid type form
- `invalid-type-guard-definition` — Invalid `TypeGuard` definition
- `invalid-type-variable-bound` — Invalid `TypeVar` bound
- `invalid-type-variable-constraints` — Invalid `TypeVar` constraints
- `invalid-type-variable-default` — Invalid `TypeVar` default
- `invalid-typed-dict-field` — Invalid `TypedDict` field
- `invalid-typed-dict-header` — Invalid `TypedDict` header
- `invalid-typed-dict-statement` — Invalid `TypedDict` statement
- `invalid-yield` — Invalid `yield`
- `isinstance-against-protocol` — `isinstance` against a protocol
- `isinstance-against-typed-dict` — `isinstance` against a `TypedDict`
- `mismatched-type-name` — Mismatched type name
- `missing-argument` — Missing argument
- `missing-override-decorator` — Missing `@override` decorator
- `missing-typed-dict-key` — Missing `TypedDict` key
- `no-matching-overload` — No matching overload
- `not-iterable` — Value is not iterable
- `not-subscriptable` — Value is not subscriptable
- `override-of-final-method` — Override of `@final` method
- `override-of-final-variable` — Override of `@final` variable
- `parameter-already-assigned` — Parameter already assigned
- `positional-only-parameter-as-kwarg` — Positional-only parameter passed as keyword
- `unresolved-reference` — Unresolved reference
- `unsupported-operator` — Unsupported operator

### Warn-level (default)

- `ambiguous-protocol-member` — Ambiguous protocol member
- `deprecated` — Deprecated functionality
- `ineffective-final` — Ineffective `@final`
- `instance-layout-conflict` — Instance layout conflict
- `invalid-enum-member-annotation` — Invalid enum member annotation
- `possibly-missing-attribute` — Possibly missing attribute
- `possibly-missing-implicit-call` — Possibly missing implicit call
- `possibly-missing-import` — Possibly missing import
- `possibly-missing-submodule` — Possibly missing submodule
- `possibly-unresolved-reference` — Possibly unresolved reference
- `pydantic-discarded-extra-argument` — Pydantic discarded extra argument
- `redundant-cast` — Redundant cast
- `unresolved-import` — Unresolved import

### Ignore-level (default, disabled)

- `blanket-ignore-comment` — Blanket ignore comment without rule code
- `dataclass-field-order` — Dataclass field order
- `escape-character-in-forward-annotation` — Escape character in forward annotation
- `experimental-syntax` — Experimental syntax
- `final-on-non-method` — `@final` on non-method
- `final-without-value` — `@final` without value
- `ignore-comment-unknown-rule` — Ignore comment references unknown rule
- `implicit-concatenated-string-type-annotation` — Implicit concatenated string type annotation
- `inconsistent-mro` — Inconsistent MRO
- `invalid-argument-type` (in some contexts)
- `missing-type-argument` — Missing type argument (e.g., `list` instead of `list[int]`)
- `non-callable-init-subclass` — Non-callable `__init_subclass__`
- `unused-ignore-comment` — Unused ignore comment

> Use `ty explain rule` to get detailed information about any rule.

---

## Type System Features

### Redeclarations

ty allows reusing the same symbol with a different type:
```python
def split_paths(paths: str) -> list[Path]:
    paths: list[str] = paths.split(":")
    return [Path(p) for p in paths]
```

### Intersection Types

ty has first-class support for intersection types, enabling precise type narrowing.

### Top and Bottom Materializations

- **Top materialization**: The "largest" type a gradual type can materialize to (e.g., `Any` → `object`)
- Used when intersecting with `isinstance` checks involving generic classes

### Reachability Based on Types

ty's reachability analysis is based on type inference, detecting unreachable branches in many situations:
```python
PYDANTIC_V2 = pydantic.__version__.startswith("2.")
if PYDANTIC_V2:
    return person.model_dump_json()  # no error when checking with 1.x
else:
    return person.json()
```

### Special Types

- **`Unknown`**: Type that could not be fully inferred; behaves like `Any` but appears implicitly
- **`@Todo`**: Type that cannot yet be inferred precisely due to ty limitations; dynamic type
- **`Divergent`**: Type that arises from divergent control flow

---

## Diagnostics

ty provides rich diagnostics with:
- Context around the error line
- References to related definitions (e.g., `TypedDict` key definitions)
- Spelling suggestions for misspelled `TypedDict` keys
- Backwards compatibility explanations (e.g., "tomllib was added in Python 3.11, but your project targets 3.10")

---

## Typing FAQ

### Why doesn't ty warn about missing type annotations?

ty infers `Unknown` for unannotated symbols. For equivalent of mypy's `disallow_untyped_defs`, use Ruff's `flake8-annotations` (ANN) rules.

### Does ty have a strict mode?

No `--strict` flag, but ty is reasonably strict by default. Recommended stricter configuration:
```toml
[tool.ty.rules]
missing-type-argument = "error"
possibly-unresolved-reference = "warn"

[tool.ruff.lint]
extend-select = ["ANN", "PYI"]
preview = true
```

### Does ty support monorepos?

Yes, via per-package runs (`--project`) or multiple source roots (`environment.root`).

### Does ty support PEP 723 inline-metadata scripts?

Partially. Single scripts can be checked with `uvx --with-requirements script.py ty check script.py`.

### Is there a pre-commit hook?

Yes: [astral-sh/ty-pre-commit](https://github.com/astral-sh/ty-pre-commit).

### Does ty support mypy plugins?

No. ty does not have a plugin system. Consideration is being given to built-in support for popular libraries (pydantic, SQLAlchemy, attrs, django).

---

## Sources

- [CLI reference](https://docs.astral.sh/ty/reference/cli/)
- [Exit codes](https://docs.astral.sh/ty/reference/exit-codes/)
- [Environment variables](https://docs.astral.sh/ty/reference/environment/)
- [Configuration reference](https://docs.astral.sh/ty/reference/configuration/)
- [Rules reference](https://docs.astral.sh/ty/reference/rules/)
- [Suppression](https://docs.astral.sh/ty/suppression/)
- [Type system](https://docs.astral.sh/ty/features/type-system/)
- [Diagnostics](https://docs.astral.sh/ty/features/diagnostics/)
- [Typing FAQ](https://docs.astral.sh/ty/reference/typing-faq/)
- [File exclusions](https://docs.astral.sh/ty/exclusions/)
- [Module discovery](https://docs.astral.sh/ty/modules/)
- [Python version](https://docs.astral.sh/ty/python-version/)
