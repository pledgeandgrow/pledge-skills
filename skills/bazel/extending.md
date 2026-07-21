# Bazel — Extending: Rules, Macros, Aspects, Toolchains & Starlark

> **Source**: [Extension overview](https://bazel.build/extending/concepts) | [Rules](https://bazel.build/extending/rules) | [Symbolic macros](https://bazel.build/extending/macros) | [Legacy macros](https://bazel.build/extending/legacy-macros) | [Depsets](https://bazel.build/extending/depsets) | [Aspects](https://bazel.build/extending/aspects) | [Repository rules](https://bazel.build/extending/repo) | [Configurations](https://bazel.build/extending/config) | [Platforms](https://bazel.build/extending/platforms) | [Toolchains](https://bazel.build/extending/toolchains) | [Execution groups](https://bazel.build/extending/exec-groups) | [Starlark language](https://bazel.build/rules/language) | [Starlark style guide](https://bazel.build/rules/bzl-style) | [Testing rules](https://bazel.build/rules/testing) | [Performance](https://bazel.build/rules/performance) | [Deploying](https://bazel.build/rules/deploying)

## Extension Overview

See: [Extension overview](https://bazel.build/extending/concepts)

### Macros and Rules

- **Macro**: A function that instantiates rules. Useful when BUILD files get repetitive or complex. Evaluated during the loading phase.
  - **Symbolic macros** (new in Bazel 8): Defined with `macro()`, have special visibility semantics
  - **Legacy macros**: Plain Starlark functions that call rules
- **Rule**: More powerful than a macro. Can access Bazel internals, pass information to other rules, have full control over actions.

**When to use**: Start with a symbolic macro for simple logic. If a macro becomes complex, make it a rule. New language support = rule.

### Evaluation Model (Three Phases)

1. **Loading phase**: Load and evaluate extensions and BUILD files. Macros evaluated, rules instantiated into a graph.
2. **Analysis phase**: Rule implementation functions execute, actions instantiated. Action graph generated.
3. **Execution phase**: Actions executed when outputs required. Tests run.

Bazel uses parallelism for reading, parsing, evaluating `.bzl` and BUILD files. Each file read at most once per build, result cached and reused.

## Rules

See: [Rules](https://bazel.build/extending/rules)

### Rule Creation

```python
# In a .bzl file
example_library = rule(
    implementation = _example_library_impl,
    attrs = {
        "deps": attr.label_list(),
        "srcs": attr.label_list(allow_files=True),
    },
    outputs = {
        "jar": "%{name}.jar",
    },
)
```

### Target Instantiation

```python
# In a BUILD file
load("//some/pkg:rules.bzl", "example_library")

example_library(
    name = "example_target",
    deps = [":another_target"],
)
```

### Attributes

Defined via the `attr` module:

| Attribute Type | Description |
|----------------|-------------|
| `attr.label()` | Single dependency |
| `attr.label_list()` | Multiple dependencies |
| `attr.string()` | String value |
| `attr.string_list()` | List of strings |
| `attr.bool()` | Boolean |
| `attr.int()` | Integer |
| `attr.label_keyed_string_dict()` | Dict of labels to strings |
| `attr.output()` | Output file |

**Private attributes**: Prefixed with `_`, not visible to users. Used for implicit dependencies.

**Common attributes** (implicitly added): `name`, `visibility`, `tags`, `testonly`, `compatible_with`, `restricted_to`.

### Implementation Function

```python
def _example_library_impl(ctx):
    # Access attributes
    srcs = ctx.files.srcs
    deps = ctx.attr.deps

    # Declare outputs
    output = ctx.outputs.jar

    # Create actions
    ctx.actions.run(
        inputs = srcs,
        outputs = [output],
        executable = ctx.executable._compiler,
        arguments = [output.path] + [s.path for s in srcs],
    )

    # Return providers
    return [DefaultInfo(files = depset([output]))]
```

### Providers

Providers pass information from a rule to its dependents:

```python
MyInfo = provider(
    doc = "Information about my rule",
    fields = ["transitive_srcs", "compile_flags"],
)

def _my_rule_impl(ctx):
    return [MyInfo(
        transitive_srcs = depset(ctx.files.srcs),
        compile_flags = ["-Wall"],
    )]
```

**Built-in providers**:
- `DefaultInfo`: files, runfiles, data_runfiles, executable
- `OutputGroupInfo`: named output groups
- `RunEnvironmentInfo`: environment variables for `bazel run`
- `CcInfo`: C++ compilation/linking info
- `JavaInfo`: Java compilation info

### Executable Rules and Test Rules

```python
# Executable rule
my_binary = rule(
    implementation = _impl,
    executable = True,
)

# Test rule (name must end in _test)
my_test = rule(
    implementation = _impl,
    test = True,
)
```

### Advanced Topics

- **Requesting output files**: Use `ctx.actions.run` or `ctx.actions.run_shell`
- **Configurations**: Rules can access configuration fragments via `ctx.fragments`
- **Configuration fragments**: `cpp`, `java`, `platform`, `proto`, etc.
- **Runfiles symlinks**: Use `ctx.runfiles(symlinks={...})`
- **Code coverage**: Use `InstrumentedFilesInfo` provider
- **Validation actions**: Use `ctx.actions.run` with `mnemonic = "Validation"` for checks that don't produce outputs

### Deprecated Features

- **Predeclared outputs**: Use `outputs` parameter (deprecated, use `ctx.actions.declare_file` instead)
- **Legacy providers**: Old dict-based providers (migrate to `provider()` objects)
- **Runfiles features to avoid**: Legacy runfiles symlinks

## Symbolic Macros

See: [Symbolic macros](https://bazel.build/extending/macros)

### Definition

```python
# In a .bzl file
def _my_macro_impl(name, **kwargs):
    native.cc_library(
        name = name,
        srcs = kwargs.pop("srcs", []),
        deps = kwargs.pop("deps", []),
        **kwargs,
    )

my_macro = macro(
    implementation = _my_macro_impl,
    attrs = {
        "srcs": attr.label_list(allow_files=True),
        "deps": attr.label_list(),
    },
)
```

### Key Features

- **Attributes**: Defined via `attrs` parameter, same as rules
- **Implementation**: Function that creates targets
- **Naming conventions**: Targets created in macros get namespaced
- **Visibility**: Internal targets hidden from rest of package
- **Selects**: Can use `select()` in macro attributes
- **Finalizers**: Special macros that run after all other macros
- **Laziness**: Macros are lazily evaluated

See also: [Creating a symbolic macro](https://bazel.build/rules/macro-tutorial) | [Migration troubleshooting](https://bazel.build/extending/macros#migration-troubleshooting)

## Legacy Macros

See: [Legacy macros](https://bazel.build/extending/legacy-macros) | [Creating a legacy macro](https://bazel.build/rules/legacy-macro-tutorial)

Plain Starlark functions that call rules:

```python
def my_legacy_macro(name, srcs=[], deps=[]):
    native.cc_library(
        name = name + "_lib",
        srcs = srcs,
        deps = deps,
    )
    native.cc_binary(
        name = name,
        deps = [":" + name + "_lib"],
    )
```

## Depsets

See: [Depsets](https://bazel.build/extending/depsets)

Depsets are DAGs for efficiently collecting transitive data:

```python
# Create a depset
s = depset(["a", "b", "c"])
t = depset(["d", "e"], transitive = [s])
print(t.to_list())  # ["d", "e", "a", "b", "c"]
```

### Key Properties

- **Efficient**: O(1) union, no copying of contents
- **Immutable**: Cannot be modified after creation
- **Reference equality**: Equal only to itself
- **Order**: `preorder`, `postorder`, `topological` (default: `preorder`)
- **No removal**: Can't remove elements; must rebuild

### Order

```python
s = depset(["a"], transitive = [depset(["b"])])
# preorder: [a, b]  (parent before children)
# postorder: [b, a]  (children before parent)
# topological: [a, b]  (like preorder but deterministic)
```

### Performance

Use depsets for transitive collections (files, flags, etc.) to avoid O(n²) copying. Never call `to_list()` in a loop over dependencies.

## Aspects

See: [Aspects](https://bazel.build/extending/aspects)

Aspects propagate along dependency edges, creating a "shadow graph":

```python
def _print_aspect_impl(target, ctx):
    if hasattr(ctx.rule.attr, 'srcs'):
        for src in ctx.rule.attr.srcs:
            for f in src.files.to_list():
                print(f.path)
    return []

print_aspect = aspect(
    implementation = _print_aspect_impl,
    attr_aspects = ['deps'],
    required_providers = [CcInfo],
)
```

### Key Concepts

- **attr_aspects**: Which attributes to propagate along
- **required_providers**: Only propagate to targets with these providers
- **required_aspect_providers**: Only propagate through aspects with these providers
- **Aspect application**: Applied via command line or from a rule

### Invoking from Command Line

```bash
bazel build //foo:foo --aspects=//tools:print_aspect.bzl%print_aspect
```

### Invoking from a Rule

```python
my_rule = rule(
    implementation = _impl,
    attrs = {
        "deps": attr.label_list(aspects = [print_aspect]),
    },
)
```

## Repository Rules

See: [Repository rules](https://bazel.build/extending/repo)

Define how to fetch external repositories:

```python
def _my_repo_impl(ctx):
    ctx.file("BUILD", """
filegroup(
    name = "srcs",
    srcs = glob(["**"]),
    visibility = ["//visibility:public"],
)
""")
    ctx.download_and_extract(
        url = ctx.attr.url,
        sha256 = ctx.attr.sha256,
    )

my_repo = repository_rule(
    implementation = _my_repo_impl,
    attrs = {
        "url": attr.string(),
        "sha256": attr.string(),
    },
)
```

### module_ctx vs repository_ctx

- `repository_ctx`: For `repository_rule` (legacy WORKSPACE-based)
- `module_ctx`: For module extensions (Bzlmod-based)

## Configurations

See: [Configurations](https://bazel.build/extending/config)

Configurations represent different build variants (target platform, build mode, etc.):

- **Configured targets**: Target + configuration
- **Configuration transitions**: Rules can change the configuration of dependencies
- **Split transitions**: Produce multiple configurations from one input

```python
def _my_transition_impl(settings, attr):
    return {
        "//command_line_option:cpu": "k8",
    }

my_transition = transition(
    implementation = _my_transition_impl,
    inputs = [],
    outputs = ["//command_line_option:cpu"],
)
```

## Platforms

See: [Platforms](https://bazel.build/extending/platforms)

Platforms describe the execution and target environments:

```python
platform(
    name = "linux_x64",
    constraint_values = [
        "@platforms//os:linux",
        "@platforms//cpu:x86_64",
    ],
)
```

### Key Concepts

- **Constraint setting**: A dimension (e.g., OS, CPU)
- **Constraint value**: A specific value for a setting (e.g., linux, x86_64)
- **Platform**: A set of constraint values
- **Platform-based toolchain resolution**: Bazel selects toolchains based on platform constraints

## Execution Groups

See: [Execution groups](https://bazel.build/extending/exec-groups) | [Auto exec groups](https://bazel.build/extending/auto-exec-groups)

Allow different actions in a rule to run on different platforms:

```python
my_rule = rule(
    implementation = _impl,
    attrs = {
        "_compiler": attr.label(
            cfg = "exec",
            exec_group = "compile_group",
        ),
    },
    exec_groups = {
        "compile_group": exec_group(
            toolchains = ["//toolchains:my_toolchain"],
        ),
    },
)
```

## Toolchains

See: [Toolchains](https://bazel.build/extending/toolchains)

### Motivation

Toolchains decouple rules from specific tools, enabling cross-compilation and platform-aware builds.

### Writing Rules That Use Toolchains

```python
my_rule = rule(
    implementation = _impl,
    toolchains = ["//toolchains:my_toolchain_type"],
    attrs = {
        "srcs": attr.label_list(allow_files=True),
    },
)

def _impl(ctx):
    toolchain = ctx.toolchains["//toolchains:my_toolchain_type"]
    # Use toolchain info
```

### Defining Toolchains

```python
# Define a toolchain type
my_toolchain_type = rule(
    attrs = {
        "compiler": attr.label(),
    },
    provides = [MyToolchainInfo],
)

# Register a toolchain
toolchain(
    name = "my_toolchain_linux",
    exec_compatible_with = ["@platforms//os:linux"],
    target_compatible_with = ["@platforms//os:linux"],
    toolchain = "//toolchains:my_toolchain_impl",
    toolchain_type = "//toolchains:my_toolchain_type",
)
```

### Registering Toolchains

```python
# In MODULE.bazel
register_toolchains("//toolchains:my_toolchain_linux")
```

### Toolchain Resolution

Bazel selects a toolchain by matching:
1. Target platform constraints
2. Execution platform constraints
3. Toolchain type

### Debugging Toolchains

```bash
bazel build //foo --toolchain_resolution_debug
```

## Starlark Language

See: [Starlark language](https://bazel.build/rules/language) | [Starlark style guide](https://bazel.build/rules/bzl-style)

### Syntax

Python3-inspired syntax:

```python
def fizz_buzz(n):
    """Print Fizz Buzz numbers from 1 to n."""
    for i in range(1, n + 1):
        s = ""
        if i % 3 == 0:
            s += "Fizz"
        if i % 5 == 0:
            s += "Buzz"
        print(s if s else i)

fizz_buzz(20)
```

### Supported Types

- `None`, `bool`, `dict`, `tuple`, `function`, `int`, `list`, `string`

### Type Annotations (Experimental)

```python
def foo(x: int, y: str) -> bool:
    return y == str(x)
```

### Differences from Python

- Global variables are immutable
- No `for` at top level (use functions or list comprehensions)
- No `if` at top level (use if-expressions)
- Deterministic dictionary iteration order
- No recursion
- `int` limited to 32-bit signed
- No modifying collections during iteration
- No cross-type comparison operators
- Strings use double-quotes in `repr()`
- Strings aren't iterable

### Unsupported Python Features

`class`, `import`, `while`, `yield`, `is`, `try/raise/except/finally`, `global`, `nonlocal`, generators, implicit string concatenation, chained comparisons

### Mutability

- BUILD files: All global values are frozen (immutable)
- `.bzl` files: Global values are mutable during evaluation, then frozen
- `load()` statements: Only define values and functions, no side effects

## Starlark Style Guide

See: [Starlark style guide](https://bazel.build/rules/bzl-style)

- **Order**: `load()` → constants → functions → rules/providers
- **Naming**: `lower_with_underscores` for functions/vars, `UpperCamel` for providers
- **Defaults**: Don't use mutable default arguments
- **Docstrings**: Use triple-quoted docstrings for public functions and rules
- **Line length**: 80 characters max

## Testing Rules

See: [Testing rules](https://bazel.build/rules/testing)

Use `analysis_test` to test rule behavior:

```python
def _my_analysis_test_impl(ctx):
    env = analysistest.begin(ctx)
    target = analysistest.target_under_test(env)
    # Assert target has expected providers
    return analysistest.end(env)

my_analysis_test = analysistest.make(_my_analysis_test_impl)
```

## Optimizing Rule Performance

See: [Optimizing performance](https://bazel.build/rules/performance)

- Use `depset` for transitive collections
- Avoid `to_list()` in loops
- Minimize `ctx.actions.run` calls
- Use `ctx.actions.run_shell` sparingly
- Avoid large `glob()` patterns
- Use `ctx.actions.declare_directory` for tree artifacts

## Deploying Rules

See: [Deploy rules](https://bazel.build/rules/deploying)

- Publish to [Bazel Central Registry](https://bcr.bazel.build/)
- Use `MODULE.bazel` for module metadata
- Version with semver
- Include Stardoc documentation

## Stardoc

See: [Stardoc](https://github.com/bazelbuild/stardoc)

Generate documentation for Starlark rules:

```python
stardoc(
    name = "my_rules_docs",
    input = "my_rules.bzl",
    out = "my_rules.md",
)
```

## Custom Verbs

See: [Custom verbs](https://bazel.build/rules/verbs-tutorial)

Create custom Bazel commands (verbs) that integrate with the build system.

## Writing Rules for Windows

See: [Windows rules](https://bazel.build/rules/windows)

- Use forward slashes in paths
- Handle case-insensitive filesystems
- Use `ctx.actions.run` with Windows-compatible tools
- Test with `--cpu=x64_windows`

## Challenges

See: [Challenges](https://bazel.build/rules/challenges)

Common pitfalls when writing rules: hermeticity, sandboxing, remote execution compatibility, and cross-platform support.
