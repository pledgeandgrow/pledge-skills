# Babel

> Babel is a JavaScript compiler — a toolchain mainly used to convert ECMAScript 2015+ code into backwards-compatible JavaScript in current and older browsers or environments.

**Version**: Babel 7.x / 8.x  
**Documentation**: [babeljs.io/docs](https://babeljs.io/docs/)  
**GitHub**: [github.com/babel/babel](https://github.com/babel/babel)  

## Quick Reference

| Topic | File |
|-------|------|
| Getting Started & Learn ES2015 (What is Babel, usage guide, installation, plugins & presets intro, configuration intro, polyfill, Learn ES2015 features: arrows, classes, destructuring, template strings, modules, generators, promises, proxies, symbols, etc., editor integrations) | `getting-started.md` |
| Configuration & Options (config file types: babel.config.json/.babelrc.json/package.json/JS configs, project-wide vs file-relative config, monorepos, config function API: api.cache/api.env/api.caller/api.assertVersion, all options: primary/config loading/plugin & preset/output targets/config merging/source maps/misc/code generator/AMD-UMD-SystemJS, print effective configs, config merging, compiler assumptions) | `configuration.md` |
| Plugins & Presets (using plugins, transform/syntax plugins, plugin ordering, plugin options, plugin development, full plugins list by ES version: ES3-ES2026 + TC39 proposals + module formats + React + Flow + TypeScript + misc + syntax-only, presets: official presets, creating presets, preset ordering, preset options, @babel/preset-env with all options, @babel/preset-react with all options, @babel/preset-typescript with all options, @babel/preset-flow) | `plugins-and-presets.md` |
| API & CLI Reference (@babel/cli: all CLI flags and usage, @babel/core: transform/transformSync/transformAsync/transformFile/transformFromAst/parse APIs + advanced APIs, @babel/parser: options and plugins, @babel/generator: options, @babel/traverse: visitor pattern, path object, scope, @babel/types: builders, type checkers, assertions, utilities, @babel/template, @babel/standalone, @babel/register, @babel/eslint-parser) | `api-and-cli.md` |

## Core Concepts

- **What is Babel**: JavaScript compiler for ES2015+ syntax transformation, polyfilling, and codemods
- **Toolchain**: @babel/core (compiler), @babel/cli (command-line), @babel/parser (parser), @babel/generator (code generator), @babel/traverse (AST traversal), @babel/types (AST builders/checkers), @babel/template (template AST generation)
- **Plugins**: Small programs that instruct Babel on how to transform code
- **Presets**: Pre-determined sets of plugins (env, react, typescript, flow)
- **Configuration**: Project-wide (babel.config.json) and file-relative (.babelrc.json) config files
- **Options**: Primary, config loading, plugin/preset, output targets, config merging, source maps, misc, code generator, module formats
- **Compiler Assumptions**: Trade spec compliance for smaller/faster output
- **Polyfill**: Deprecated @babel/polyfill, use core-js directly or useBuiltIns option
- **Learn ES2015**: Complete ES2015 feature reference (arrows, classes, destructuring, modules, generators, promises, etc.)

## Official Documentation Sources

- [What is Babel?](https://babeljs.io/docs/) — Introduction and overview
- [Usage Guide](https://babeljs.io/docs/usage) — Getting started guide
- [Configure Babel](https://babeljs.io/docs/configuration) — Configuration overview
- [Config Files](https://babeljs.io/docs/config-files) — File types, project-wide vs file-relative, monorepos, config function API
- [Options](https://babeljs.io/docs/options) — Full options reference
- [Plugins](https://babeljs.io/docs/plugins) — Using and developing plugins
- [Plugins List](https://babeljs.io/docs/plugins-list) — All available plugins by category
- [Presets](https://babeljs.io/docs/presets) — Using and creating presets
- [Compiler Assumptions](https://babeljs.io/docs/assumptions) — All compiler assumptions
- [@babel/cli](https://babeljs.io/docs/babel-cli) — CLI reference
- [@babel/core](https://babeljs.io/docs/babel-core) — Core API reference
- [@babel/preset-env](https://babeljs.io/docs/babel-preset-env) — Smart preset for ES2015+
- [@babel/preset-react](https://babeljs.io/docs/babel-preset-react) — React JSX preset
- [@babel/preset-typescript](https://babeljs.io/docs/babel-preset-typescript) — TypeScript preset
- [@babel/preset-flow](https://babeljs.io/docs/babel-preset-flow) — Flow preset
- [Learn ES2015](https://babeljs.io/docs/learn) — ES2015 features guide
- [Editors](https://babeljs.io/docs/editors) — Editor integrations
- [@babel/parser](https://babeljs.io/docs/babel-parser) — Parser API
- [@babel/generator](https://babeljs.io/docs/babel-generator) — Code generator API
- [@babel/traverse](https://babeljs.io/docs/babel-traverse) — AST traversal
- [@babel/types](https://babeljs.io/docs/babel-types) — AST node builders and type checkers
- [@babel/template](https://babeljs.io/docs/babel-template) — Template AST generation
- [@babel/standalone](https://babeljs.io/docs/babel-standalone) — Browser-based Babel
- [@babel/register](https://babeljs.io/docs/babel-register) — On-the-fly transpilation
- [@babel/eslint-parser](https://babeljs.io/docs/babel-eslint-parser) — ESLint parser integration
