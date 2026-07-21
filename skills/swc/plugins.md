# SWC Plugins

SWC plugins are written in Rust and compiled to WebAssembly (`.wasm`).

## Selecting swc_core Version

Wasm plugins are **not backwards compatible**. You must select the appropriate version of `swc_core` for your plugin.

Use the [webapp](https://plugins.swc.rs) to find compatible versions — select your framework and version, and it shows compatible `swc_core` versions.

### Compatibility Table

| swc_core | @swc/core | Next.js | Rspack |
|----------|-----------|---------|--------|
| v0.98.x | 1.7.x | 15.0.0-canary.122+ | — |
| v0.95.x–v0.96.x | 1.6.x | 15.0.0-canary.37–116 | — |
| v0.91.x–v0.93.x | 1.5.x | 15.0.0-canary.29–36 | — |
| v0.90.x | 1.4.x | 14.1.1-canary.52–15.0.0-canary.28 | 0.6.0+ |
| v0.88.x–v0.89.x | 1.3.106–107 | — | 0.5.8–0.5.9 |
| v0.82.x–v0.87.x | 1.3.81–105 | ~14.1.0 | — |
| v0.79.x–v0.81.x | 1.3.68–80 | 13.4.10-canary.1+ | — |
| v0.78.x | 1.3.63–67 | 13.4.8–13.4.10-canary.0 | — |

> **Note**: Next.js v13.2.4–v13.3.1 cannot execute SWC Wasm plugins due to a [next-swc bug](https://github.com/vercel/next.js/issues/46989).

### Recent API Changes

- Replace `chain!` macro with **tuples**: Use `(` instead of `chain!(`
- For `chain!` with 13+ arguments: Use nested tuples
- Replace `-> impl Fold` with `-> impl Pass`
- `as_folder` is now `visit_mut_pass` and returns `impl VisitMut + Pass`
- Use `Program.apply` and `Program.mutate` to apply `Pass` to program:
  - `fn apply(self, impl Pass) -> Self`
  - `fn mutate(&mut self, impl Pass)`
- Replace `noop()` with `noop_pass()` (lives in `swc_ecma_ast`)

## Getting Started with Plugin Development

### Prerequisites

1. **Install Rust**: Follow [rust-lang.org/tools/install](https://www.rust-lang.org/tools/install)
2. **Add wasm target**: SWC supports two kinds of `.wasm` files:
   - `wasm32-wasip1` (recommended for plugins)
   - `wasm32-unknown-unknown`
3. **Install swc_cli**:

```bash
cargo install swc_cli
```

### Create a New Plugin

```bash
swc plugin new --target-type wasm32-wasip1 my-first-plugin
# You should run: rustup target add wasm32-wasip1
```

Then open `my-first-plugin` with your preferred Rust IDE.

### IDE Configuration

For VS Code, install the **rust-analyzer** extension for code completion, navigation, and analysis.

## Plugin Cheatsheet

Key types and traits for SWC plugin development:

- `swc_ecma_ast`: AST node definitions
- `swc_ecma_visit`: `VisitMut` trait for traversing/mutating AST
- `swc_common`: Common utilities (Span, SyntaxContext)
- `swc_ecma_utils`: Utility functions for AST manipulation
- `swc_ecma_transforms`: Transform implementations

### Key API Changes

- `Span.ctxt` was removed → `ctxt: SyntaxContext` added to AST nodes
- `IdentName` used instead of `Ident` in places like `MemberProp` (no ctxt/optional needed)

## Plugin Compatibility

Wasm plugins must match the `swc_core` version of the runtime they're loaded in. Use [plugins.swc.rs](https://plugins.swc.rs) to find the right version.

## Publishing Plugins

1. Build the plugin: `cargo build --release --target wasm32-wasip1`
2. The `.wasm` file is in `target/wasm32-wasip1/release/`
3. Publish to npm with the `.wasm` file
4. Users configure plugins in `.swcrc`:

```json
{
  "jsc": {
    "experimental": {
      "plugins": [
        ["@your-org/your-plugin", {}]
      ]
    }
  }
}
```

## Registering Plugins

Plugins are registered in `.swcrc` under `jsc.experimental.plugins`:

```json
{
  "jsc": {
    "experimental": {
      "plugins": [
        ["plugin-name", { "pluginOption": "value" }]
      ]
    }
  }
}
```

Each plugin entry is a tuple of `[pluginName, options]`.

## Plugin Cheatsheet

Known hard points for implementing ECMAScript plugins. See [rustdoc](https://rustdoc.swc.rs/swc) for details.

### JsWord (String Interning)

`JsWord` is an interned string type. Create from `&str` or `String` using `.into()`. Access as `&str` via `&val`. See [swc_atoms rustdoc](https://rustdoc.swc.rs/swc_atoms/).

### Ident, Id, Mark, SyntaxContext

SWC uses a special system for managing variables. See [Ident rustdoc](https://rustdoc.swc.rs/swc_ecma_ast/struct.Ident.html).

### AST Inspection

Use [SWC Playground](https://play.swc.rs) to get AST from input code.

### Error Handling

See [rustdoc for Handler](https://rustdoc.swc.rs/swc_common/errors/struct.Handler.html).

### Matching on Box<T>

All expressions are stored as `Box<Expr>` for performance. Use `match` with `**expr` to dereference:

```rust
use swc_core::ast::*;
use swc_core::visit::{VisitMut, VisitMutWith};

struct MatchExample;

impl VisitMut for MatchExample {
    fn visit_mut_callee(&mut self, callee: &mut Callee) {
        callee.visit_mut_children_with(self);
        if let Callee::Expr(expr) = callee {
            if let Expr::Ident(i) = &mut **expr {
                i.sym = "foo".into();
            }
        }
    }
}
```

### Changing ExportDefaultDecl to ExportDefaultExpr

Do this from `visit_mut_module_decl`.

### Injecting New Statements

Store values in your struct, inject from `visit_mut_stmts` or `visit_mut_module_items`:

```rust
struct MyPlugin {
    stmts: Vec<Stmt>,
}
```

### Limitations

Hygiene and resolver are handled before your Wasm plugin is called. You can't access them from Wasm plugins. ([Tracking issue #9132](https://github.com/swc-project/swc/issues/9132))

## Plugin Compatibility

### History

Wasm plugins were **not compatible** between `@swc/core` versions. Any AST change required plugin recompilation.

### Why?

Wasm plugins can't directly manipulate Rust AST in the host. The host serializes the AST using [rkyv](https://rkyv.org/) and transmits bytes to the Wasm runtime. The plugin deserializes, transforms, and re-serializes. Since serialization logic is compiled into both host and plugin, any AST change breaks compatibility.

### New Compatibility (v1.15.0+)

Starting from `@swc/core` v1.15.0, Wasm plugins are compatible between versions to some extent.

## Publishing Plugins

### Building Wasm

```bash
cargo build-wasi --release      # wasm32-wasi target
cargo build-wasm32 --release    # wasm32-unknown-unknown target
```

Output: `target/wasm32-wasi/release/your_plugin_name.wasm`

### npm Package

In `package.json`:

```json
{
  "main": "your_plugin_name.wasm",
  "scripts": {
    "prepack": "cargo prepublish --release && cp target/wasm32-wasi/release/your_plugin_name.wasm ."
  }
}
```

### Optimizing Binary Size

In `Cargo.toml`:

```toml
[profile.release]
codegen-units = 1
lto = true
opt-level = "s"
strip = "symbols"
```

### Removing Logs for Release

```toml
tracing = { version = "0.1", features = ["release_max_level_info"] }
```

### Reference

Official plugins repository: [swc-project/plugins](https://github.com/swc-project/plugins)

## Registering Plugins on plugins.swc.rs

To list your plugin on [plugins.swc.rs](https://plugins.swc.rs):

1. Submit a PR to [swc-project/crawl-core-version](https://github.com/swc-project/crawl-core-version/tree/main/pkgs/plugins)
2. Create `pkgs/plugins/your-plugin.yml`:

```yaml
repo: https://github.com/your-org/your-plugin-repo.git
packages:
  - "@your-org/swc-plugin-foo"
  - "@your-org/swc-plugin-bar"
```

3. Commit and open a PR against `main`

### Rules

- Only `.yml` files are crawled
- Package names must exactly match npm package names
- One file can include multiple packages from the same repo
- `repo` must be a cloneable Git URL

### Update Schedule

Data is updated by the Auto Update workflow (daily, or manual). After it runs, your plugin appears on plugins.swc.rs.

## Contributing: String Management

SWC interns strings (via [hstr](https://github.com/swc-project/hstr)) to reduce allocations and improve performance.

- Strings not too short nor too long are interned
- Hash becomes O(1) after interning
- `eq` becomes much faster

## Contributing: Variable Management

SWC uses syntax context to manage variables.

### Processing Order

```
GLOBALS.set(&Default::default(), || {
    resolver → your_pass → hygiene → fixer (optional)
})
```

1. **resolver**: Resolves identifiers
2. **your_pass**: Your custom transforms
3. **hygiene**: Renames private identifiers if conflicts
4. **fixer**: Adds necessary parentheses (optional)

### Private Identifiers

Use `Ident::new_private` (requires `GLOBALS` access):

```rust
let id = Ident::new_private("my_var");
```

### Full Example

```rust
GLOBALS.set(&Default::default(), || {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    program.mutate(resolver(unresolved_mark, top_level_mark, is_typescript));
    program.mutate(your_pass);
    program.mutate(hygiene());
});
```

## Contributing: Profiling the Minifier

### Using samply (cross-platform)

```bash
CARGO_PROFILE_RELEASE_DEBUG=1 RUST_LOG=off ddt profile samply cargo --release --features concurrent --example minify-all -- ~/projects/minifier-inputs
```

### Using XCode Instruments (mac only)

```bash
CARGO_PROFILE_RELEASE_DEBUG=1 RUST_LOG=off ddt profile instruments cargo -t time --release --features concurrent --example minify-all -- ~/projects/minifier-inputs
```

## Contributing: Debugging Next.js App

Extract SWC minifier inputs from a Next.js app:

1. Clone SWC repo: `git clone https://github.com/swc-project/swc.git ~/projects/swc`
2. Do everything except `next build`
3. Run: `~/projects/swc/crates/swc_ecma_minifier/scripts/next/add-test.sh`

This copies all minifier inputs into the SWC test directory.

## Contributing: Debugging Size Difference (SWC vs Terser)

Use `dbg-swc` to find files where SWC output is larger than Terser:

```bash
cargo install dbg-swc
dbg-swc es minifier ensure-size path/to/your/minifier/inputs
```
