# Pledge Skills — Installable Agent Skill Library

[![skills.sh](https://skills.sh/b/pledgeandgrow/pledge-skills)](https://www.skills.sh/pledgeandgrow/pledge-skills)

A comprehensive, production-ready collection of 13 agent skills covering Next.js, React, React Native, TypeScript, Tailwind CSS, Astro, Express, Rust, Zig, OXC, Vite, Redis, and npm. Built from official documentation — every API, hook, component, type, utility class, and language feature.

## Quick Install

```bash
npx pledge-skills add all
```

Or via [skills.sh](https://www.skills.sh/pledgeandgrow/pledge-skills):

```bash
npx skills add pledgeandgrow/pledge-skills
```

## Stats

- **13 skills** — 301 files, ~98,000+ lines total
- **Next.js** — 34 files (6,892+ lines)
- **React Native** — 62 files (18,000+ lines)
- **Astro** — 29 files (10,000+ lines)
- **Redis** — 29 files (12,000+ lines)
- **Zig** — 22 files (5,100+ lines)
- **Vite** — 21 files (5,380+ lines)
- **Express** — 18 files (9,000+ lines)
- **Rust** — 17 files (22,000+ lines)
- **Tailwind CSS** — 17 files (3,092+ lines)
- **TypeScript** — 16 files (2,371+ lines)
- **React** — 15 files (2,744+ lines)
- **npm** — 15 files (4,261+ lines)
- **OXC** — 6 files (5,000+ lines)
- Every official docs page analyzed and covered

## Skills

| Skill | Files | Lines | Description |
|-------|-------|-------|-------------|
| `nextjs/` | 34 | 6,892 | Next.js 16.2.7 — App Router, Server Components, caching, deployment |
| `react-native/` | 62 | 18,000 | React Native 0.86 — core components, APIs, New Architecture, Hermes |
| `astro/` | 29 | 10,000 | Astro 5.x — components, routing, content collections, islands, view transitions |
| `redis/` | 29 | 12,000 | Redis 8.x — all data types, pub/sub, streams, vector search, clustering, Lua |
| `zig/` | 22 | 5,100 | Zig 0.16.0 — types, pointers, structs, comptime, builtins, memory, C interop |
| `vite/` | 21 | 5,380 | Vite 8.x — HMR, plugins, SSR, build config, Environment API, Rolldown |
| `express/` | 18 | 9,000 | Express 5.x — routing, middleware, error handling, security, production |
| `rust/` | 17 | 22,000 | Rust 1.97.0 (Edition 2024) — ownership, traits, async, Cargo, unsafe, FFI |
| `tailwindcss/` | 17 | 3,092 | Tailwind CSS v4 — utility classes, responsive, CSS-first config |
| `typescript/` | 16 | 2,371 | TypeScript 5.x — types, generics, narrowing, TSConfig, JSX, migration |
| `react/` | 15 | 2,744 | React 19.x — hooks, concurrent features, Server Components, React Compiler |
| `npm/` | 15 | 4,261 | npm 12.x — registry, publishing, security, organizations, CLI reference |
| `oxc/` | 6 | 5,000 | OXC — parser, linter (oxlint), formatter, transformer, minifier, AST |

## Install

### Install all skills

```bash
npx pledge-skills add all
```

### Install specific skills

```bash
npx pledge-skills add nextjs
npx pledge-skills add react
npx pledge-skills add react-native
npx pledge-skills add typescript
npx pledge-skills add tailwindcss
npx pledge-skills add astro
npx pledge-skills add express
npx pledge-skills add rust
npx pledge-skills add zig
npx pledge-skills add oxc
npx pledge-skills add vite
npx pledge-skills add redis
npx pledge-skills add npm
```

### Via skills.sh

```bash
npx skills add pledgeandgrow/pledge-skills --all
npx skills add pledgeandgrow/pledge-skills --skill nextjs
npx skills add pledgeandgrow/pledge-skills --skill rust --skill zig
```

### List available skills

```bash
npx pledge-skills list
```

### Manual install (copy folders)

Copy individual skill folders into your agent's skills directory (`.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, etc.).

## Target Versions

- **Next.js**: 16.2.7
- **React**: 19.x
- **React Native**: 0.86
- **TypeScript**: 5.x
- **Tailwind CSS**: v4
- **Astro**: 5.x
- **Express**: 5.x
- **Rust**: 1.97.0 (Edition 2024)
- **Zig**: 0.16.0
- **OXC**: latest
- **Vite**: 8.x
- **Redis**: 8.x
- **npm**: 12.x

## Usage

Point your AI agent to any `<skill>/SKILL.md` as the entry point. Each contains a condensed index with links to all modular files.

```
Agent: "I need to know about Next.js caching"
→ Read nextjs/caching.md

Agent: "How do Rust ownership and borrowing work?"
→ Read rust/ownership-borrowing.md

Agent: "Set up Redis vector search"
→ Read redis/vector-search.md

Agent: "What's new in Vite 8?"
→ Read vite/migration.md
```

## License

MIT
