# Bazel — Reference: Build Encyclopedia, CLI, Query & Starlark API

> **Source**: [Build encyclopedia](https://bazel.build/reference/be) | [Test encyclopedia](https://bazel.build/reference/test-encyclopedia) | [Command-line reference](https://bazel.build/reference/command-line-reference) | [Query reference](https://bazel.build/query/language) | [Glossary](https://bazel.build/reference/glossary) | [Starlark API](https://bazel.build/rules/lib/starlark-overview) | [Global functions](https://bazel.build/rules/lib/globals) | [Providers](https://bazel.build/rules/lib/providers) | [Built-in types](https://bazel.build/rules/lib/builtins) | [Top-level modules](https://bazel.build/rules/lib/toplevel) | [Configuration fragments](https://bazel.build/rules/lib/fragments) | [Core data types](https://bazel.build/rules/lib/core)

## Build Encyclopedia

See: [Build encyclopedia](https://bazel.build/reference/be)

### Common Definitions

See: [Common definitions](https://bazel.build/reference/be/common-definitions)

- [Bourne shell tokenization](https://bazel.build/reference/be/common-definitions)
- [Label expansion](https://bazel.build/reference/be/common-definitions)
- [Typical attributes for most rules](https://bazel.build/reference/be/common-definitions) (`name`, `srcs`, `deps`, `data`, `visibility`, `tags`, `testonly`, `compatible_with`, `restricted_to`, `deprecation`, `features`)
- [Common attributes for all rules](https://bazel.build/reference/be/common-definitions)
- [Common attributes for tests](https://bazel.build/reference/be/common-definitions) (`args`, `env`, `size`, `timeout`, `flaky`, `shard_count`, `local`)
- [Common attributes for binaries](https://bazel.build/reference/be/common-definitions) (`args`, `env`, `output_group`, `stamp`)
- [Configurable attributes](https://bazel.build/reference/be/common-definitions)
- [Implicit output targets](https://bazel.build/reference/be/common-definitions)

### "Make" Variables

See: [Make variables](https://bazel.build/reference/be/make-variables)

Legacy make-variable substitution in genrule commands.

### Functions

See: [BUILD functions](https://bazel.build/reference/be/functions)

| Function | Description |
|----------|-------------|
| `package()` | Set package-level metadata (default_visibility, default_testonly, features) |
| `package_group()` | Define a set of packages for visibility |
| `exports_files()` | Export source files to other packages |
| `glob()` | Match files with patterns |
| `select()` | Choose value based on conditions |
| `workspace()` | Define the workspace (legacy) |

### Language-Specific Native Rules

#### C/C++

See: [C/C++ rules](https://bazel.build/reference/be/c-cpp)

| Rule | Description |
|------|-------------|
| `cc_binary` | C++ executable |
| `cc_import` | Import pre-built C++ library |
| `cc_library` | C++ library |
| `cc_shared_library` | Shared C++ library |
| `cc_static_library` | Static C++ library (output) |
| `cc_test` | C++ test |
| `cc_toolchain` | C++ toolchain target |
| `fdo_prefetch_hints` | FDO prefetch hints |
| `fdo_profile` | FDO profile |
| `memprof_profile` | Memory profiling profile |
| `propeller_optimize` | Propeller optimization profile |

#### Java

See: [Java rules](https://bazel.build/reference/be/java)

| Rule | Description |
|------|-------------|
| `java_binary` | Java executable |
| `java_import` | Import pre-built Java library |
| `java_library` | Java library |
| `java_test` | JUnit test |
| `java_package_configuration` | Package-level Java config |
| `java_plugin` | Java annotation processor |
| `java_runtime` | Java runtime |
| `java_toolchain` | Java toolchain |

#### Objective-C

See: [Objective-C rules](https://bazel.build/reference/be/objective-c)

| Rule | Description |
|------|-------------|
| `objc_import` | Import pre-built ObjC library |
| `objc_library` | Objective-C library |
| `xcode_config` | Xcode version configuration |
| `xcode_version` | Declare a specific Xcode version |

#### Protocol Buffers

See: [Protocol buffer rules](https://bazel.build/reference/be/protocol-buffer)

| Rule | Description |
|------|-------------|
| `cc_proto_library` | C++ protobuf library |
| `java_lite_proto_library` | Java lite protobuf library |
| `java_proto_library` | Java protobuf library |
| `proto_library` | Protocol buffer library |
| `py_proto_library` | Python protobuf library |
| `proto_lang_toolchain` | Proto language toolchain |
| `proto_toolchain` | Proto toolchain |

#### Python

See: [Python rules](https://bazel.build/reference/be/python)

| Rule | Description |
|------|-------------|
| `py_binary` | Python executable |
| `py_library` | Python library |
| `py_test` | Python test |
| `py_runtime` | Python runtime |

#### Shell

See: [Shell rules](https://bazel.build/reference/be/shell)

| Rule | Description |
|------|-------------|
| `sh_binary` | Shell script executable |
| `sh_library` | Shell library |
| `sh_test` | Shell test |

### Language-Agnostic Native Rules

#### General

See: [General rules](https://bazel.build/reference/be/general)

| Rule | Description |
|------|-------------|
| `alias` | Alias for another target |
| `config_setting` | Configuration condition for select() |
| `filegroup` | Group of files |
| `genquery` | Run a bazel query at build time |
| `genrule` | Generic rule with a shell command |
| `starlark_doc_extract` | Extract Starlark doc info |
| `test_suite` | Group of tests |

#### Extra Actions (deprecated)

See: [Extra actions](https://bazel.build/reference/be/extra-actions)

| Rule | Description |
|------|-------------|
| `action_listener` | Listen for actions (deprecated) |
| `extra_action` | Extra action on build events (deprecated) |

#### Platforms and Toolchains

See: [Platforms and toolchains](https://bazel.build/reference/be/platforms-and-toolchains)

| Rule | Description |
|------|-------------|
| `constraint_setting` | Define a constraint dimension |
| `constraint_value` | Define a value for a constraint setting |
| `platform` | Define a platform |
| `toolchain` | Register a toolchain |
| `toolchain_type` | Declare a toolchain type |

#### Workspace

See: [Workspace rules](https://bazel.build/reference/be/workspace)

| Rule | Description |
|------|-------------|
| `bind` | Bind a target in external repo to a label (deprecated) |
| `local_repository` | Define a local repository |
| `new_local_repository` | Define a local repository with new BUILD files |

### Embedded Non-Native Rules

See: [Rules page](https://bazel.build/rules)

These rules are shipped with Bazel but written in Starlark, loadable from `@bazel_tools`:

#### Repository Rules

| Rule | Description |
|------|-------------|
| [git_repository](https://bazel.build/rules/lib/repo/git) | Fetch a Git repository as an external dependency |
| [http_archive](https://bazel.build/rules/lib/repo/http) | Download and extract an archive (tar, zip) |
| [http_file](https://bazel.build/rules/lib/repo/http) | Download a single file |
| [http_jar](https://bazel.build/rules/lib/repo/http) | Download a JAR file |
| [Utility functions on patching](https://bazel.build/rules/lib/repo/utils) | Patch/extract utilities for repository rules |

### Recommended Rules (Non-Native)

See: [Recommended rules](https://bazel.build/community/recommended-rules) | [Rules page](https://bazel.build/rules)

Community-maintained rules following Bazel's [requirements for recommended rules](https://bazel.build/community/recommended-rules):

| Language | Rules |
|----------|-------|
| Android | [bazel-and-android](https://bazel.build/docs/bazel-and-android) |
| C / C++ | [bazel-and-cpp](https://bazel.build/docs/bazel-and-cpp) |
| Docker/OCI | [rules_oci](https://github.com/bazel-contrib/rules_oci) |
| Go | [rules_go](https://github.com/bazelbuild/rules_go) |
| Haskell | [rules_haskell](https://github.com/tweag/rules_haskell) |
| Java | [bazel-and-java](https://bazel.build/docs/bazel-and-java) |
| JavaScript / NodeJS | [rules_nodejs](https://github.com/bazelbuild/rules_nodejs) |
| Maven dep management | [rules_jvm_external](https://github.com/bazelbuild/rules_jvm_external) |
| Objective-C | [bazel-and-apple](https://bazel.build/docs/bazel-and-apple) |
| Package building | [rules_pkg](https://github.com/bazelbuild/rules_pkg) |
| Protocol Buffers | [rules_proto](https://github.com/bazelbuild/rules_proto) |
| Python | [rules_python](https://github.com/bazelbuild/rules_python) |
| Rust | [rules_rust](https://github.com/bazelbuild/rules_rust) |
| Scala | [rules_scala](https://github.com/bazelbuild/rules_scala) |
| Shell | [Shell rules](https://bazel.build/reference/be/shell) |
| Webtesting (WebDriver) | [rules_webtesting](https://github.com/bazelbuild/rules_webtesting) |

Additional utilities: [Skylib](https://github.com/bazelbuild/bazel-skylib) — useful functions for writing rules and macros.

## Test Encyclopedia

See: [Test encyclopedia](https://bazel.build/reference/test-encyclopedia)

### Test Attributes

| Attribute | Description |
|-----------|-------------|
| `args` | Arguments passed to the test |
| `data` | Runtime data files |
| `env` | Environment variables |
| `size` | Test size: `enormous`, `large`, `medium`, `small` |
| `timeout` | Timeout: `short`, `moderate`, `long`, `eternal` |
| `flaky` | Auto-retry up to 3 times |
| `shard_count` | Number of test shards |
| `local` | Force local execution |

### Test Size & Timeout Defaults

| Size | Timeout | Resource hints |
|------|---------|----------------|
| `small` | 1 min | 1 CPU, 10 MB RAM |
| `medium` | 5 min | 1 CPU, 100 MB RAM |
| `large` | 15 min | 1 CPU, 512 MB RAM |
| `enormous` | 60 min | 1 CPU, 2048 MB RAM |

### Test Output

- `--test_output=summary` (default): Summary only
- `--test_output=errors`: Show failed test output
- `--test_output=all`: Show all test output
- `--test_output=streamed`: Stream output in real-time

### Test Filtering

```bash
bazel test //... --test_filter=TestFoo
bazel test //... --test_arg=--gtest_filter=TestFoo.*
```

## Command-Line Reference

See: [Command-line reference](https://bazel.build/reference/command-line-reference)

### Build Commands

| Command | Description |
|---------|-------------|
| `bazel build` | Build targets |
| `bazel test` | Build and test |
| `bazel run` | Build and execute |
| `bazel clean` | Remove outputs |
| `bazel coverage` | Test with coverage |
| `bazel cquery` | Configurable query |
| `bazel query` | Dependency graph query |
| `bazel aquery` | Action graph query |
| `bazel fetch` | Fetch external deps |
| `bazel sync` | Sync external deps |
| `bazel mod` | Module management |
| `bazel info` | Show workspace info |
| `bazel shutdown` | Stop server |
| `bazel version` | Show version |
| `bazel help` | Show help |

### Key Startup Options

| Option | Description |
|--------|-------------|
| `--output_base` | Output directory |
| `--install_base` | Installation directory |
| `--max_idle_secs` | Auto-shutdown timeout |
| `--batch` | Run in batch mode (no server) |
| `--host_jvm_args` | JVM arguments |

### Key Build Options

| Option | Description |
|--------|-------------|
| `--config` | Named config from .bazelrc |
| `--platforms` | Target platforms |
| `--cpu` | Target CPU |
| `--define` | Build defines |
| `--copt` | Compiler options |
| `--linkopt` | Linker options |
| `--jobs` / `-j` | Concurrent jobs |
| `--keep_going` / `-k` | Continue on errors |
| `--stamp` | Stamp binaries |
| `--workspace_status_command` | Status command |
| `--spawn_strategy` | Execution strategy |
| `--strategy` | Per-mnemonic strategy |
| `--test_output` | Test output mode |
| `--test_filter` | Test filter |
| `--test_arg` | Test argument |
| `--test_timeout` | Test timeout |
| `--runs_per_test` | Runs per test |
| `--flaky_test_attempts` | Retry attempts |
| `--remote_cache` | Remote cache |
| `--remote_executor` | Remote executor |
| `--disk_cache` | Disk cache path |
| `--experimental_convenience_symlinks` | Create convenience symlinks |

## Query Reference

See: [Query language](https://bazel.build/query/language)

### Query Functions

| Function | Description |
|----------|-------------|
| `deps(x, depth)` | Dependencies of x (up to depth) |
| `rdeps(x, y, depth)` | Reverse deps of y within x |
| `allrdeps(x)` | All reverse deps |
| `allpaths(x, y)` | All dependency paths from x to y |
| `somepath(x, y)` | One dependency path from x to y |
| `kind(pattern, x)` | Targets matching rule kind |
| `attr(name, pattern, x)` | Targets with matching attribute |
| `filter(pattern, x)` | Targets matching name pattern |
| `labels(attr, x)` | Labels in attribute of x |
| `tests(x)` | Test targets in x |
| `visible(x, y)` | Targets in y visible to x |
| `same_pkg_direct_rdeps(x)` | Same-package reverse deps |
| `siblings(x)` | Siblings of x |
| `target_pattern_filter(x, y)` | Filter by pattern |

### Output Formats

| Format | Flag |
|--------|------|
| Text (default) | `--output=text` |
| Label | `--output=label` |
| Label_kind | `--output=label_kind` |
| Graph (dot) | `--output=graph` |
| XML | `--output=xml` |
| Minrank | `--output=minrank` |
| Maxrank | `--output=maxrank` |
| Starlark | `--output=starlark` (cquery) |

## Glossary

See: [Glossary](https://bazel.build/reference/glossary)

Key terms: Action, Action graph, Aspect, BUILD file, Bazel module, Bzlmod, Configuration, Configured target, Constraint, Depset, Execution platform, File, Genrule, Glob, Hermeticity, Label, Load statement, Macro, Package, Platform, Provider, Repository, Repository rule, Rule, Runfiles, Sandbox, Starlark, Target, Target platform, Test, Toolchain, Visibility, Workspace.

## Starlark API

See: [Starlark API overview](https://bazel.build/rules/lib/starlark-overview)

### Global Functions

See: [Global functions](https://bazel.build/rules/lib/globals)

#### .bzl files

See: [.bzl globals](https://bazel.build/rules/lib/globals/bzl)

| Function | Description |
|----------|-------------|
| `analysis_test` | Create an analysis test rule |
| `aspect` | Define an aspect |
| `depset` | Create a depset |
| `dict` | Create a dictionary |
| `fail` | Abort execution with error |
| `getattr` | Get attribute of an object |
| `hash` | Hash a string |
| `len` | Length of a sequence |
| `list` | Create a list |
| `load` | Load symbols from another file |
| `macro` | Define a symbolic macro |
| `module_extension` | Define a module extension |
| `print` | Print to stderr |
| `provider` | Define a provider |
| `range` | Create a range |
| `repository_rule` | Define a repository rule |
| `rule` | Define a rule |
| `select` | Create a select expression |
| `setattr` | Set attribute on an object |
| `struct` | Create a struct |
| `subrule` | Define a subrule |
| `tag_class` | Define a tag class |
| `transition` | Define a configuration transition |
| `tuple` | Create a tuple |
| `type` | Get type of a value |

#### BUILD files

See: [BUILD globals](https://bazel.build/rules/lib/globals/build)

Includes: `glob`, `exports_files`, `package`, `package_group`, `select`, plus all native rules (`cc_library`, `java_binary`, etc.)

#### MODULE.bazel files

See: [MODULE.bazel globals](https://bazel.build/rules/lib/globals/module)

| Function | Description |
|----------|-------------|
| `module()` | Declare module metadata |
| `bazel_dep()` | Declare a Bazel dependency |
| `register_toolchains()` | Register toolchains |
| `use_extension()` | Use a module extension |
| `use_repo()` | Use a repo from an extension |

#### REPO.bazel files

See: [REPO.bazel globals](https://bazel.build/rules/lib/globals/repo)

#### VENDOR.bazel files

See: [VENDOR.bazel globals](https://bazel.build/rules/lib/globals/vendor)

### Configuration Fragments

See: [Configuration fragments](https://bazel.build/rules/lib/fragments)

| Fragment | Description |
|----------|-------------|
| [apple](https://bazel.build/rules/lib/fragments/apple) | Apple platform config |
| [bazel_android](https://bazel.build/rules/lib/fragments/bazel_android) | Android config |
| [coverage](https://bazel.build/rules/lib/fragments/coverage) | Coverage config |
| [cpp](https://bazel.build/rules/lib/fragments/cpp) | C++ config |
| [java](https://bazel.build/rules/lib/fragments/java) | Java config |
| [objc](https://bazel.build/rules/lib/fragments/objc) | Objective-C config |
| [platform](https://bazel.build/rules/lib/fragments/platform) | Platform config |
| [proto](https://bazel.build/rules/lib/fragments/proto) | Proto config |

### Providers

See: [Providers](https://bazel.build/rules/lib/providers)

| Provider | Description |
|----------|-------------|
| `AnalysisTestResultInfo` | Analysis test result |
| `CcInfo` | C++ compilation/linking info |
| `CcToolchainConfigInfo` | C++ toolchain config |
| `CcToolchainInfo` | C++ toolchain info (deprecated) |
| `ConstraintCollection` | Constraint collection |
| `ConstraintSettingInfo` | Constraint setting info |
| `ConstraintValueInfo` | Constraint value info |
| `DebugPackageInfo` | Debug package info |
| `DefaultInfo` | Default provider (files, runfiles, executable) |
| `ExecutionInfo` | Execution requirements |
| `FeatureFlagInfo` | Feature flag value |
| `FilesToRunProvider` | Files to run |
| `IncompatiblePlatformProvider` | Platform incompatibility |
| `InstrumentedFilesInfo` | Instrumented files for coverage |
| `JavaInfo` | Java compilation info |
| `JavaPluginInfo` | Java plugin info |
| `JavaRuntimeInfo` | Java runtime info |
| `JavaToolchainInfo` | Java toolchain info |
| `ObjcProvider` | Objective-C info |
| `OutputGroupInfo` | Named output groups |
| `PackageSpecificationInfo` | Package specification |
| `PlatformInfo` | Platform info |
| `RunEnvironmentInfo` | Environment for bazel run |
| `TemplateVariableInfo` | Make variables |
| `ToolchainInfo` | Toolchain info |
| `ToolchainTypeInfo` | Toolchain type info |

### Built-in Types

See: [Built-in types](https://bazel.build/rules/lib/builtins)

| Type | Description |
|------|-------------|
| [Action](https://bazel.build/rules/lib/builtins/Action) | Build action |
| [actions](https://bazel.build/rules/lib/builtins/actions) | Actions API (run, run_shell, write, etc.) |
| [Args](https://bazel.build/rules/lib/builtins/Args) | Build command arguments |
| [Aspect](https://bazel.build/rules/lib/builtins/Aspect) | Aspect object |
| [Attribute](https://bazel.build/rules/lib/builtins/Attribute) | Attribute schema |
| [bazel_module](https://bazel.build/rules/lib/builtins/bazel_module) | Bazel module context |
| [bazel_module_tags](https://bazel.build/rules/lib/builtins/bazel_module_tags) | Module tags |
| [BuildSetting](https://bazel.build/rules/lib/builtins/BuildSetting) | Build setting |
| [CcCompilationOutputs](https://bazel.build/rules/lib/builtins/CcCompilationOutputs) | C++ compilation outputs |
| [CcLinkingOutputs](https://bazel.build/rules/lib/builtins/CcLinkingOutputs) | C++ linking outputs |
| [CompilationContext](https://bazel.build/rules/lib/builtins/CompilationContext) | Compilation context |
| [configuration](https://bazel.build/rules/lib/builtins/configuration) | Configuration |
| [ctx](https://bazel.build/rules/lib/builtins/ctx) | Rule context (most important) |
| [depset](https://bazel.build/rules/lib/builtins/depset) | Depset type |
| [DirectoryExpander](https://bazel.build/rules/lib/builtins/DirectoryExpander) | Directory expander |
| [DottedVersion](https://bazel.build/rules/lib/builtins/DottedVersion) | Version string |
| [exec_result](https://bazel.build/rules/lib/builtins/exec_result) | Execution result |
| [ExecGroupCollection](https://bazel.build/rules/lib/builtins/ExecGroupCollection) | Exec group collection |
| [ExecGroupContext](https://bazel.build/rules/lib/builtins/ExecGroupContext) | Exec group context |
| [extension_metadata](https://bazel.build/rules/lib/builtins/extension_metadata) | Extension metadata |
| [FeatureConfiguration](https://bazel.build/rules/lib/builtins/FeatureConfiguration) | C++ feature config |
| [File](https://bazel.build/rules/lib/builtins/File) | File object |
| [fragments](https://bazel.build/rules/lib/builtins/fragments) | Configuration fragments |
| [Label](https://bazel.build/rules/lib/builtins/Label) | Label object |
| [LibraryToLink](https://bazel.build/rules/lib/builtins/LibraryToLink) | Library to link |
| [LinkerInput](https://bazel.build/rules/lib/builtins/LinkerInput) | Linker input |
| [LinkingContext](https://bazel.build/rules/lib/builtins/LinkingContext) | Linking context |
| [macro](https://bazel.build/rules/lib/builtins/macro) | Macro context |
| [module_ctx](https://bazel.build/rules/lib/builtins/module_ctx) | Module extension context |
| [path](https://bazel.build/rules/lib/builtins/path) | Path object |
| [propagation_ctx](https://bazel.build/rules/lib/builtins/propagation_ctx) | Propagation context |
| [Provider](https://bazel.build/rules/lib/builtins/Provider) | Provider type |
| [repository_ctx](https://bazel.build/rules/lib/builtins/repository_ctx) | Repository rule context |
| [repository_os](https://bazel.build/rules/lib/builtins/repository_os) | Repository OS info |
| [repository_rule](https://bazel.build/rules/lib/builtins/repository_rule) | Repository rule type |
| [root](https://bazel.build/rules/lib/builtins/root) | Root object |
| [rule](https://bazel.build/rules/lib/builtins/rule) | Rule type |
| [rule_attributes](https://bazel.build/rules/lib/builtins/rule_attributes) | Rule attributes |
| [runfiles](https://bazel.build/rules/lib/builtins/runfiles) | Runfiles object |
| [struct](https://bazel.build/rules/lib/builtins/struct) | Struct type |
| [Subrule](https://bazel.build/rules/lib/builtins/Subrule) | Subrule type |
| [subrule_ctx](https://bazel.build/rules/lib/builtins/subrule_ctx) | Subrule context |
| [SymlinkEntry](https://bazel.build/rules/lib/builtins/SymlinkEntry) | Symlink entry |
| [tag_class](https://bazel.build/rules/lib/builtins/tag_class) | Tag class type |
| [Target](https://bazel.build/rules/lib/builtins/Target) | Target object |
| [TemplateDict](https://bazel.build/rules/lib/builtins/TemplateDict) | Template dict |
| [wasm_module](https://bazel.build/rules/lib/builtins/wasm_module) | WASM module |

### Top-Level Modules

See: [Top-level modules](https://bazel.build/rules/lib/toplevel)

| Module | Description |
|--------|-------------|
| [apple_common](https://bazel.build/rules/lib/toplevel/apple_common) | Apple platform utilities |
| [attr](https://bazel.build/rules/lib/toplevel/attr) | Attribute schema builders |
| [cc_common](https://bazel.build/rules/lib/toplevel/cc_common) | C++ compilation utilities |
| [config](https://bazel.build/rules/lib/toplevel/config) | Configuration transitions |
| [config_common](https://bazel.build/rules/lib/toplevel/config_common) | Common config utilities |
| [coverage_common](https://bazel.build/rules/lib/toplevel/coverage_common) | Coverage utilities |
| [java_common](https://bazel.build/rules/lib/toplevel/java_common) | Java compilation utilities |
| [native](https://bazel.build/rules/lib/toplevel/native) | Native rule access |
| [platform_common](https://bazel.build/rules/lib/toplevel/platform_common) | Platform utilities |
| [proto](https://bazel.build/rules/lib/toplevel/proto) | Proto utilities |
| [testing](https://bazel.build/rules/lib/toplevel/testing) | Testing utilities |

### Core Starlark Data Types

See: [Core data types](https://bazel.build/rules/lib/core)

- [bool](https://bazel.build/rules/lib/bool) | [dict](https://bazel.build/rules/lib/dict) | [int](https://bazel.build/rules/lib/int) | [list](https://bazel.build/rules/lib/list) | [string](https://bazel.build/rules/lib/string) | [tuple](https://bazel.build/rules/lib/tuple) | [function](https://bazel.build/rules/lib/function) | [None](https://bazel.build/rules/lib/globals)

### attr Module

See: [attr module](https://bazel.build/rules/lib/toplevel/attr)

Key attribute builders:
- `attr.label()`, `attr.label_list()`, `attr.label_keyed_string_dict()`
- `attr.string()`, `attr.string_list()`, `attr.string_dict()`
- `attr.bool()`, `attr.int()`, `attr.int_list()`
- `attr.output()`, `attr.output_list()`
- `attr.license()`
- `attr.label_list_dict()`

All support: `default`, `doc`, `mandatory`, `providers`, `cfg`, `aspects`, `allow_files`, `allow_empty`

### ctx Object

See: [ctx](https://bazel.build/rules/lib/builtins/ctx)

Key members:
- `ctx.attr` — Access to attributes
- `ctx.actions` — Actions API
- `ctx.files` — File-typed attributes
- `ctx.toolchains` — Resolved toolchains
- `ctx.fragments` — Configuration fragments
- `ctx.label` — The target's label
- `ctx.outputs` — Declared outputs
- `ctx.runfiles` — Create runfiles
- `ctx.var` — Build variables
- `ctx.genfiles_dir` — Genfiles directory
- `ctx.bin_dir` — Bin directory
