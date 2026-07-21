# SWC Migration Guides

## Migrating from Babel

SWC's compilation supports all ECMAScript features. The SWC CLI is designed to be a **drop-in replacement** for Babel:

```bash
# Old
$ npx babel

# New
$ npx swc
```

### What SWC Supports

- All stage 3 proposals
- preset-env (via `env` config), including bugfix transforms
- All Babel-equivalent transforms

### Key Differences

- SWC is written in Rust (much faster)
- Configuration uses `.swcrc` instead of `.babelrc`
- `env` config replaces `@babel/preset-env`
- SWC does not support Babel plugins — use SWC's Wasm plugin system instead

## Migrating from tsc

If migrating from TypeScript Compiler (tsc), keep the following in mind:

### TypeScript Version

SWC supports the latest stable TypeScript.

### isolatedModules: true

SWC works file-by-file, so transforms that depend on understanding the full type system will not work. Features like `const enums` and `namespaces` may cause runtime problems.

Enable `isolatedModules` in `tsconfig.json` to warn about code that may not be correctly interpreted by SWC.

### importsNotUsedAsValues: "error"

SWC cannot completely discern whether an imported binding is a value or a type.

Setting `importsNotUsedAsValues` to `"error"` ensures TypeScript marks all type imports during type checking, allowing SWC to remove them accurately.

### esModuleInterop: true

TypeScript's import interoperability deviates from ES6 modules spec. SWC adopts an approach similar to Babel (more stringent). Enable `esModuleInterop` to align tsc's behavior with SWC.

### verbatimModuleSyntax: true

Introduced in TypeScript 5.0 to replace `isolatedModules`, `preserveValueImports`, and `importsNotUsedAsValues`. Check the [TypeScript 5.0 release notes](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0-beta/) for details.

### useDefineForClassFields

This involves the semantics of `[[Define]]` vs `[[Set]]`.

- **Who doesn't need to worry**: Those who never use classes, or use classes but never use inheritance
- **Who needs to pay attention**: Decorator users

If set in `tsconfig.json`, use the same value in SWC config. Default depends on `target`:
- `true` if target is ES2022 or higher (including ESNext)
- `false` otherwise

### Known Issues

- **ES6 import hoisting** ([TypeScript#16166](https://github.com/microsoft/TypeScript/issues/16166)): tsc does not hoist ES6 imports. SWC more rigorously preserves ES module semantics, so code relying on tsc's erroneous behavior may break.

### Notes

SWC only transpiles code and does **not** perform type checking. Continue using `tsc` for detecting type errors:

```bash
# Type check with tsc (no emit)
tsc --noEmit

# Transpile with SWC
npx swc src --out-dir dist
```

## @swc-node/* vs @swc/*

| Package | Description |
|---------|-------------|
| `@swc-node/*` | Wraps `@swc/core`, supports `tsconfig.json` |
| `@swc/*` | Official SWC packages, uses `.swcrc` |

Both packages are actively maintained. `@swc-node` is useful when you want to use `tsconfig.json` directly instead of maintaining a separate `.swcrc`.

### @swc-node packages

- `@swc-node/register`: Register hook for Node.js (replaces `ts-node`)
- `@swc-node/core`: Core API with `tsconfig.json` support
- `@swc-node/jest`: Jest transformer with `tsconfig.json` support

### When to use which

- Use `@swc/*` if you want to use `.swcrc` configuration
- Use `@swc-node/*` if you want to reuse `tsconfig.json` configuration
