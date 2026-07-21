---
name: eslint-docs
version: "ESLint 10.x"
tags:
  - eslint
  - linter
  - javascript
  - linting
  - code-quality
  - flat-config
  - rules
  - plugins
  - formatters
  - parsers
  - processors
  - shareable-configs
  - nodejs-api
  - rule-tester
  - cli
  - static-analysis
  - code-style
  - eslint-plugin
  - eslint-config
description: |
  ESLint 10.x — flat config, rules, plugins, formatters, parsers, CLI, Node.js API, custom rules, migration.
---

# ESLint

> ESLint is a pluggable and configurable JavaScript linter for identifying and reporting on patterns in JavaScript code. Maintain your code quality with ease.

**Version**: ESLint 10.x (latest)  
**Documentation**: [eslint.org/docs/latest](https://eslint.org/docs/latest/)  
**Rules Reference**: [eslint.org/docs/latest/rules/](https://eslint.org/docs/latest/rules/)  
**API Reference**: [eslint.org/docs/latest/integrate/nodejs-api](https://eslint.org/docs/latest/integrate/nodejs-api)  

## Quick Reference

| Topic | File |
|-------|------|
| Getting Started & Core Concepts (prerequisites, installation, config wizard, manual setup, what is ESLint, rules, fixes, suggestions, configuration files, shareable configs, plugins, parsers, processors, formatters, integrations, CLI & API overview) | `getting-started-and-core-concepts.md` |
| Configuration (flat config files, configuration objects, files/ignores, cascading, linter options, rules, shared settings, extending configs, language options, parser options, globals, rule severities, disabling rules, plugins, processors, languages, custom parsers, ignore files, .gitignore, combining configs) | `configure.md` |
| CLI & Formatters (all CLI flags, exit codes, examples, built-in formatters: stylish/json/json-with-metadata/html, custom formatters, editor/build/CI integrations, rule deprecation, migration guides v1-v10, flat config migration) | `cli-and-formatters.md` |
| Rules Reference (all built-in rules by category: Possible Problems, Suggestions, Layout & Formatting, Deprecated, Removed; rule metadata indicators; configuring rules) | `rules-reference.md` |
| Extending ESLint (ways to extend, creating plugins, plugin structure, meta data, rules/processors/configs in plugins, testing plugins, custom rules: structure, context object, reporting, options, source code, schemas, scopes, code paths, unit tests, naming, runtime rules, performance; custom formatters; custom parsers; custom processors; shareable configs) | `extend.md` |
| Node.js API & Integration (ESLint class, lintFiles, lintText, loadFormatter, outputFixes, LintResult/LintMessage/EditInfo types, SourceCode, Linter, RuleTester, practical integration examples) | `integrate.md` |
| Contribute & Maintain (code of conduct, AI policy, report bugs, propose rules, rule changes, request changes, architecture, development environment, running tests, working on issues, pull requests, core rules, governance, security vulnerabilities, maintaining ESLint, managing issues, reviewing PRs, managing releases, working groups, best practices) | `contribute-and-maintain.md` |

## Core Concepts

- **Getting Started**: Prerequisites, quick start, manual setup, configuration
- **Core Concepts**: Rules, rule fixes, rule suggestions, configuration files, shareable configs, plugins, parsers, processors, formatters, integrations, CLI & API
- **Configure**: Configuration files (flat config), language options, rules, plugins, parser, ignore files, combining configs
- **CLI**: All command-line flags, exit codes, caching, concurrency, MCP server
- **Rules**: Possible Problems, Suggestions, Layout & Formatting, Deprecated, Removed
- **Formatters**: stylish, json, json-with-metadata, html, custom formatters
- **Extend**: Plugins, custom rules, custom formatters, custom parsers, custom processors, shareable configs
- **Integrate**: Node.js API (ESLint class, Linter, RuleTester, SourceCode)
- **Contribute**: Code of conduct, AI policy, bugs, rules, architecture, development, tests, PRs, governance
- **Maintain**: Team structure, issue management, PR review, releases, working groups
- **Migrating**: Migration guides for v1.0 through v10.0, flat config migration

## Official Documentation Sources

- [Getting Started](https://eslint.org/docs/latest/use/getting-started) — Installation and setup
- [Core Concepts](https://eslint.org/docs/latest/use/core-concepts) — Main components overview
- [Configure ESLint](https://eslint.org/docs/latest/use/configure/) — Configuration overview
- [Configuration Files](https://eslint.org/docs/latest/use/configure/configuration-files) — Flat config format
- [Configure Language Options](https://eslint.org/docs/latest/use/configure/language-options) — JavaScript options, globals
- [Configure Rules](https://eslint.org/docs/latest/use/configure/rules) — Rule severities, disabling
- [Configure Plugins](https://eslint.org/docs/latest/use/configure/plugins) — Plugin configuration
- [Configure a Parser](https://eslint.org/docs/latest/use/configure/parser) — Custom parser
- [Ignore Files](https://eslint.org/docs/latest/use/configure/ignore) — Ignoring files and directories
- [Command Line Interface](https://eslint.org/docs/latest/use/command-line-interface) — CLI reference
- [Rules Reference](https://eslint.org/docs/latest/rules/) — All built-in rules
- [Formatters](https://eslint.org/docs/latest/use/formatters) — Output formatters
- [Integrations](https://eslint.org/docs/latest/use/integrations) — Editor and build tool integrations
- [Rule Deprecation](https://eslint.org/docs/latest/use/rule-deprecation) — Deprecation policy
- [Migrate to 10.x](https://eslint.org/docs/latest/use/migrate-to-10.0.0) — Migration to v10
- [Migrate to 9.x](https://eslint.org/docs/latest/use/migrate-to-9.0.0) — Migration to v9
- [Ways to Extend](https://eslint.org/docs/latest/extend/ways-to-extend) — Extension overview
- [Create Plugins](https://eslint.org/docs/latest/extend/plugins) — Plugin authoring
- [Custom Rule Tutorial](https://eslint.org/docs/latest/extend/custom-rule-tutorial) — Step-by-step rule creation
- [Custom Rules](https://eslint.org/docs/latest/extend/custom-rules) — Rule API reference
- [Custom Formatters](https://eslint.org/docs/latest/extend/custom-formatters) — Formatter authoring
- [Custom Parsers](https://eslint.org/docs/latest/extend/custom-parsers) — Parser authoring
- [Custom Processors](https://eslint.org/docs/latest/extend/custom-processors) — Processor authoring
- [Shareable Configs](https://eslint.org/docs/latest/extend/shareable-configs) — Config sharing
- [Integration Tutorial](https://eslint.org/docs/latest/integrate/integration-tutorial) — Node.js API tutorial
- [Node.js API](https://eslint.org/docs/latest/integrate/nodejs-api) — Full API reference
- [Code of Conduct](https://eslint.org/conduct) — Community standards
- [AI Usage Policy](https://eslint.org/docs/latest/contribute/ai-policy) — AI contribution policy
- [Report Bugs](https://eslint.org/docs/latest/contribute/report-bugs) — Bug reporting
- [Propose a New Rule](https://eslint.org/docs/latest/contribute/propose-new-rule) — Rule proposals
- [Propose a Rule Change](https://eslint.org/docs/latest/contribute/propose-rule-change) — Rule changes
- [Request a Change](https://eslint.org/docs/latest/contribute/request-change) — Feature requests
- [Architecture](https://eslint.org/docs/latest/contribute/architecture) — ESLint architecture
- [Development Environment](https://eslint.org/docs/latest/contribute/development-environment) — Dev setup
- [Run the Tests](https://eslint.org/docs/latest/contribute/tests) — Testing
- [Work on Issues](https://eslint.org/docs/latest/contribute/work-on-issue) — Issue workflow
- [Pull Requests](https://eslint.org/docs/latest/contribute/pull-requests) — PR submission
- [Core Rules](https://eslint.org/docs/latest/contribute/core-rules) — Contributing rules
- [Governance](https://eslint.org/docs/latest/contribute/governance) — Project governance
- [Security Vulnerability](https://eslint.org/docs/latest/contribute/report-security-vulnerability) — Security reporting
- [How ESLint is Maintained](https://eslint.org/docs/latest/maintain/overview) — Maintenance overview
- [Manage Issues](https://eslint.org/docs/latest/maintain/manage-issues) — Issue management
- [Review Pull Requests](https://eslint.org/docs/latest/maintain/review-pull-requests) — PR review process
- [Manage Releases](https://eslint.org/docs/latest/maintain/manage-releases) — Release process
- [Working Groups](https://eslint.org/docs/latest/maintain/working-groups) — Working groups
