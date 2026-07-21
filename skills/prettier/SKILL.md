# Prettier — Code Formatter

> Opinionated code formatter that enforces a consistent style across your entire codebase.

**Version**: 3.9.5 | **Language**: JavaScript/TypeScript | **License**: MIT

## Quick Reference

| Topic | File |
|-------|------|
| About, Philosophy & Rationale (What is Prettier, Why Prettier, Prettier vs Linters, Option Philosophy, Rationale) | `about.md` |
| Getting Started (Install, Ignoring Code, Editor Integration, Watching For Changes) | `getting-started.md` |
| CLI, API, Browser & CI (CLI commands & flags, JavaScript API, Browser standalone, CI with GitHub Actions) | `cli-api.md` |
| Options & Configuration (All format options, Configuration files, Sharing configurations, EditorConfig) | `options-config.md` |
| Integrations & Plugins (Linters integration, Pre-commit hooks, Plugins API, Related projects) | `integrations.md` |
| Technical Details & Enterprise (Printer algorithm, IR/Doc, Tidelift subscription) | `technical.md` |

## Core Concepts

- **Opinionated formatting**: Prettier removes all original styling and reprints code from scratch, taking line length into account.
- **AST-based**: Parses code into an AST, then re-prints with its own rules. Formatting won't affect the AST.
- **Supported languages**: JavaScript, JSX, Angular, Vue, Flow, TypeScript, CSS/Less/SCSS, HTML, Ember/Handlebars, JSON, GraphQL, Markdown/GFM/MDX, YAML, LWC, MJML.
- **Options are frozen**: No new formatting options will be added. The existing set is final.
- **Use Prettier for formatting, linters for bugs**: Prettier handles formatting rules; linters handle code-quality rules.

## Official Documentation

- [What is Prettier?](https://prettier.io/docs/) — Introduction
- [Why Prettier?](https://prettier.io/docs/why-prettier) — Motivation
- [Prettier vs. Linters](https://prettier.io/docs/comparison) — Comparison
- [Option Philosophy](https://prettier.io/docs/option-philosophy) — Why options are frozen
- [Rationale](https://prettier.io/docs/rationale) — Design decisions
- [Install](https://prettier.io/docs/install) — Getting started
- [Ignoring Code](https://prettier.io/docs/ignore) — .prettierignore & inline comments
- [Editor Integration](https://prettier.io/docs/editors) — VS Code, Vim, Emacs, etc.
- [WebStorm Setup](https://prettier.io/docs/webstorm) — JetBrains IDEs
- [Vim Setup](https://prettier.io/docs/vim) — vim-prettier, Neoformat, ALE, coc-prettier
- [Watching For Changes](https://prettier.io/docs/watching-files) — File watcher setup
- [CLI](https://prettier.io/docs/cli) — Command-line usage
- [API](https://prettier.io/docs/api) — Programmatic usage
- [Browser](https://prettier.io/docs/browser) — Standalone browser build
- [Run Prettier on CI](https://prettier.io/docs/ci) — GitHub Actions
- [Options](https://prettier.io/docs/options) — All format options
- [Configuration File](https://prettier.io/docs/configuration) — Config files & overrides
- [Sharing configurations](https://prettier.io/docs/sharing-configurations) — Shareable configs
- [Integrating with Linters](https://prettier.io/docs/integrating-with-linters) — ESLint/Stylelint
- [Pre-commit Hook](https://prettier.io/docs/precommit) — Git hooks
- [Plugins](https://prettier.io/docs/plugins) — Plugin API & development
- [Related Projects](https://prettier.io/docs/related-projects) — Ecosystem
- [Technical Details](https://prettier.io/docs/technical-details) — Printer algorithm
- [For Enterprise](https://prettier.io/docs/for-enterprise) — Tidelift subscription
