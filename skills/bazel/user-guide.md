# Bazel — User Guide: Advanced, Remote & Tutorials

> **Source**: [BUILD style guide](https://bazel.build/build/style-guide) | [Sharing variables](https://bazel.build/build/share-variables) | [External dependencies](https://bazel.build/external/overview) | [Building programs](https://bazel.build/run/build) | [Commands & options](https://bazel.build/docs/user-manual) | [bazelrc](https://bazel.build/run/bazelrc) | [Scripts](https://bazel.build/run/scripts) | [Client/server](https://bazel.build/run/client-server) | [Query](https://bazel.build/query/guide) | [aquery](https://bazel.build/query/aquery) | [cquery](https://bazel.build/query/cquery) | [Configurable attributes](https://bazel.build/configure/attributes) | [C++ integration](https://bazel.build/configure/integrate-cpp) | [Code coverage](https://bazel.build/configure/coverage) | [Best practices](https://bazel.build/configure/best-practices) | [Windows](https://bazel.build/configure/windows) | [Performance](https://bazel.build/advanced/performance/build-performance-metrics) | [RBE](https://bazel.build/remote/rbe) | [Remote caching](https://bazel.build/remote/caching) | [BEP](https://bazel.build/remote/bep)

## BUILD Style Guide

See: [BUILD style guide](https://bazel.build/build/style-guide)

- **Order**: `name` first, then required attributes, then optional attributes
- **Visibility**: Use `default_visibility` in `package()` directive
- **Naming**: Use lowercase with underscores for target names
- **Comments**: Use `#` comments sparingly
- **Quoting**: Always quote strings with double quotes
- **Globs**: Use `glob()` for file patterns, prefer explicit lists for small sets

### Sharing Variables

See: [Sharing variables](https://bazel.build/build/share-variables)

Use `.bzl` files to share common definitions:

```python
# //tools:defaults.bzl"
COPTS = ["-Wall", "-Werror"]

# In BUILD files:
load("//tools:defaults.bzl", "COPTS")
cc_library(name = "foo", copts = COPTS, ...)
```

## External Dependencies

See: [External dependencies overview](https://bazel.build/external/overview)

### Bzlmod (Modern)

```python
# MODULE.bazel
module(name = "my-module", version = "1.0")
bazel_dep(name = "rules_cc", version = "0.1.1")
bazel_dep(name = "platforms", version = "0.0.11")
```

- Dependencies resolved via [Bazel Central Registry](https://bcr.bazel.build/)
- Module extensions define additional repos
- Tags provide customized data to extensions

### Legacy WORKSPACE

```python
# WORKSPACE
load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
http_archive(
    name = "rules_cc",
    sha256 = "...",
    urls = ["https://github.com/bazelbuild/rules_cc/releases/download/0.1.1/rules_cc-0.1.1.tar.gz"],
)
```

See: [External dependencies overview](https://bazel.build/external/overview) for migration from WORKSPACE to Bzlmod.

## Commands and Options

See: [Commands and options](https://bazel.build/docs/user-manual) | [Command-line reference](https://bazel.build/reference/command-line-reference)

### Key Commands

| Command | Description |
|---------|-------------|
| `bazel build` | Build specified targets |
| `bazel test` | Build and run tests |
| `bazel run` | Build and execute a target |
| `bazel clean` | Remove output files |
| `bazel query` | Query the dependency graph |
| `bazel aquery` | Query the action graph |
| `bazel cquery` | Configurable query |
| `bazel fetch` | Fetch external dependencies |
| `bazel sync` | Sync external dependencies |
| `bazel coverage` | Run tests with coverage |
| `bazel shutdown` | Stop the Bazel server |
| `bazel info` | Show server/workspace info |
| `bazel mod` | Module management |

### Important Flags

| Flag | Description |
|------|-------------|
| `--config` | Use a named config from .bazelrc |
| `--platforms` | Set target platforms |
| `--define` | Set build defines |
| `--copt` | Pass compiler options |
| `--linkopt` | Pass linker options |
| `--jobs` / `-j` | Number of concurrent jobs |
| `--local_ram_resources` | RAM resource limit |
| `--remote_cache` | Remote cache endpoint |
| `--remote_executor` | Remote execution endpoint |
| `--test_output` | Test output mode |
| `--test_filter` | Filter tests to run |
| `--stamp` | Stamp binaries with build info |
| `--workspace_status_command` | Custom status command |

## Query

### bazel query

See: [Query quickstart](https://bazel.build/query/quickstart) | [Query guide](https://bazel.build/query/guide) | [Query language](https://bazel.build/query/language)

Query the dependency graph of targets:

```bash
# All dependencies of //foo
bazel query "deps(//foo)"

# Dependency path between two targets
bazel query "somepath(//foo:foo, //third_party/zlib:zlibonly)"

# All paths
bazel query "allpaths(//foo, third_party/...)" --output graph | dot -Tsvg > /tmp/deps.svg

# Reverse dependencies
bazel query "rdeps(//..., //bar:bar)"

# All targets in a package
bazel query "//foo/..."
```

### Key Query Functions

| Function | Description |
|----------|-------------|
| `deps(x)` | All dependencies of x |
| `rdeps(x, y)` | Reverse deps of y within x |
| `allpaths(x, y)` | All dependency paths from x to y |
| `somepath(x, y)` | One dependency path from x to y |
| `kind("rule", x)` | Targets of a specific rule kind |
| `attr(name, value, x)` | Targets with matching attribute |
| `filter(pattern, x)` | Targets matching name pattern |
| `labels(name, x)` | Labels in an attribute |
| `tests(x)` | Test targets in x |
| `visible(x, y)` | Targets in y visible to x |

### aquery (Action Graph Query)

See: [aquery](https://bazel.build/query/aquery)

Query the action graph (post-analysis):

```bash
bazel aquery "mnemonic('CppCompile', deps(//foo))"
bazel aquery --output=text "//foo"
```

### cquery (Configurable Query)

See: [cquery](https://bazel.build/query/cquery)

Query with configuration awareness:

```bash
bazel cquery "deps(//foo)" --output=starlark
```

## Configurable Attributes

See: [Configurable attributes](https://bazel.build/configure/attributes)

Use `select()` for platform/configuration-specific values:

```python
cc_library(
    name = "foo",
    srcs = ["foo.cc"],
    copts = select({
        ":linux": ["-DLINUX"],
        ":windows": ["-DWIN32"],
        "//conditions:default": [],
    }),
)

config_setting(
    name = "linux",
    constraint_values = ["@platforms//os:linux"],
)
```

## C++ Integration

See: [C++ integration](https://bazel.build/configure/integrate-cpp) | [C++ toolchains](https://bazel.build/tutorials/ccp-toolchain-config)

- `cc_library`, `cc_binary`, `cc_test`, `cc_import`, `cc_shared_library`, `cc_static_library`
- Custom toolchains via `cc_toolchain` and `CcToolchainConfigInfo`
- Platform-specific compilation with `select()`

## Code Coverage

See: [Code coverage](https://bazel.build/configure/coverage)

```bash
bazel coverage //...
bazel coverage //... --combined_report=lcov
```

Supports lcov, gcov, and custom coverage tools.

## Best Practices

See: [Best practices](https://bazel.build/configure/best-practices)

- **Always green**: `bazel build //...` and `bazel test //...` should succeed on stable branch
- **Tag targets**: Use tags like `"requires-osx"` for conditional targets
- **Third-party deps**: Declare via MODULE.bazel or in `third_party/` directory
- **Build from source**: Prefer building from source over depending on pre-built binaries
- **Versioning**: Don't include version in target name (`//guava`, not `//guava-20.0`)
- **bazelrc**: Use `.bazelrc` for project options, `try-import` for per-user overrides
- **Packages**: Keep packages small and focused

## Using Bazel on Windows

See: [Windows](https://bazel.build/configure/windows)

- Requires MSYS2, Visual Studio Build Tools, or Windows SDK
- Use `--cpu=x64_windows` for native Windows builds
- Path handling: Bazel normalizes paths to forward slashes
- Symlinks: Requires admin or developer mode for symlink creation

## Performance Optimization

See: [Performance metrics](https://bazel.build/advanced/performance/build-performance-metrics) | [Performance breakdown](https://bazel.build/advanced/performance/build-performance-breakdown) | [JSON trace profile](https://bazel.build/advanced/performance/json-trace-profile) | [Optimize memory](https://bazel.build/advanced/performance/memory) | [Iteration speed](https://bazel.build/advanced/performance/iteration-speed)

### Analyzing Performance

```bash
# Generate JSON trace profile
bazel build //foo --profile=/tmp/profile.json.gz

# Analyze profile
bazel analyze-profile /tmp/profile.json.gz

# Build event protocol for metrics
bazel build //foo --build_event_json_file=/tmp/bep.json
```

### Optimization Tips

- Use `--experimental_check_external_repository_files=false` for external repos
- Keep packages small to reduce analysis overhead
- Use `--discard_analysis_cache` for large builds with many unchanged files
- Use remote caching/execution for CI
- Profile with `--profile` and analyze with `analyze-profile`

## Remote Execution (RBE)

See: [RBE overview](https://bazel.build/remote/rbe) | [RBE rules](https://bazel.build/remote/rules) | [RBE CI](https://bazel.build/remote/ci)

Remote Build Execution (RBE) sends build actions to a remote cluster:

```bash
bazel build //foo \
    --remote_executor=grpcs://remote.example.com:443 \
    --remote_instance_name=main
```

### Requirements

- Build must be hermetic (sandboxed, no local filesystem access)
- All tools and dependencies must be declared
- See [Adapting rules for RBE](https://bazel.build/remote/rules)

### Dynamic Execution

See: [Dynamic execution](https://bazel.build/remote/dynamic)

Runs actions both locally and remotely, using whichever finishes first:

```bash
bazel build //foo --experimental_dynamic_local_load_factor=0
```

## Remote Caching

See: [Remote caching](https://bazel.build/remote/caching)

Share build outputs across machines:

```bash
bazel build //foo \
    --remote_cache=grpcs://cache.example.com:443 \
    --remote_upload_local_results=true
```

### Cache Backends

- **nginx**: HTTP/2 reverse proxy with disk cache
- **bazel-remote**: Open-source cache server
- **Google Cloud Storage**: Cloud-based cache
- **Disk cache**: `--disk_cache=/path/to/cache`

### Key Flags

| Flag | Description |
|------|-------------|
| `--remote_cache` | Remote cache endpoint |
| `--remote_upload_local_results` | Upload to cache |
| `--remote_download_outputs` | Download outputs |
| `--disk_cache` | Local disk cache path |
| `--noremote_upload_local_results` | Don't upload |

See also: [Remote cache hits](https://bazel.build/remote/cache-remote) | [Local cache hits](https://bazel.build/remote/cache-local)

## Docker Sandbox

See: [Docker Sandbox](https://bazel.build/remote/sandbox)

Run actions in Docker containers for isolation:

```bash
bazel build //foo --experimental_docker_image=my-image --spawn_strategy=docker
```

## Persistent Workers

See: [Persistent workers](https://bazel.build/remote/persistent) | [Multiplex workers](https://bazel.build/remote/multiplex) | [Creating workers](https://bazel.build/remote/creating)

Long-running worker processes for tools that support them (e.g., Java compiler):

```bash
bazel build //foo --strategy=Javac=worker
```

## Build Event Protocol (BEP)

See: [BEP overview](https://bazel.build/remote/bep) | [BEP examples](https://bazel.build/remote/bep-examples) | [BEP glossary](https://bazel.build/remote/bep-glossary)

BEP streams structured build events as a DAG:

```bash
bazel build //foo --build_event_json_file=/tmp/bep.json
bazel build //foo --bes_backend=grpcs://bes.example.com:443
```

### Build Event Graph Structure

1. `BuildStarted` (root)
2. Command metadata (children of root)
3. Data events (files built, test results)
4. `BuildFinished`
5. Summary events (metrics, profiling)

### Build Event Service (BES)

Stream BEP to a remote service:

```bash
bazel build //foo \
    --bes_backend=grpcs://bes.example.com:443 \
    --bes_results_url=https://bes.example.com/results/
```

## Output Directory Layout

See: [Output directories](https://bazel.build/remote/output-directories)

Bazel output directory structure:
- `bazel-out/` — Build outputs
- `bazel-bin/` — Convenience symlink to bin output
- `bazel-testlogs/` — Test outputs
- `bazel-info/` — Server info

## Non-hermetic WORKSPACE Rules

See: [Non-hermetic WORKSPACE rules](https://bazel.build/remote/workspace)

Guidelines for writing repository rules that work with remote execution.

## Tutorials

### C++ Use Cases

See: [C++ use cases](https://bazel.build/tutorials/cpp-use-cases)

### Configuring C++ Toolchains

See: [C++ toolchains](https://bazel.build/tutorials/ccp-toolchain-config)

### Dependency Graphs

See: [Dependency graphs](https://bazel.build/tutorials/cpp-dependency)

### Using Labels to Reference Targets

See: [Labels tutorial](https://bazel.build/tutorials/cpp-labels)

## Migration

See: [Migration overview](https://bazel.build/migrate) | [Maven to Bazel](https://bazel.build/migrate/maven) | [Xcode to Bazel](https://bazel.build/migrate/xcode)

### Maven to Bazel

1. Create MODULE.bazel
2. Add `rules_jvm_external` dependency
3. Replace Maven dependencies with Bazel targets
4. Create BUILD files for Java targets

### Xcode to Bazel

1. Use `rules_xcodeproj` or `rules_apple`
2. Migrate build settings to Starlark rules
3. Replace Xcode project with BUILD files
