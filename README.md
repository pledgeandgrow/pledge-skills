# Pledge Skills — Installable Agent Skill Library

[![skills.sh](https://skills.sh/b/pledgeandgrow/pledge-skills)](https://www.skills.sh/pledgeandgrow/pledge-skills)

A comprehensive, production-ready collection of 20 agent skills covering Next.js, React, React Native, TypeScript, Tailwind CSS, Astro, Bun, Express, Go, Python, Rust, Zig, OXC, Vite, Redis, npm, Django, Kotlin, SWR, and Ruby on Rails. Built from official documentation — every API, hook, component, type, utility class, and language feature.

## Quick Install

```bash
npx pledge-skills add all
```

Or via [skills.sh](https://www.skills.sh/pledgeandgrow/pledge-skills):

```bash
npx skills add pledgeandgrow/pledge-skills
```

## Stats

- **20 skills** — 448 files, ~173,600+ lines total
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
- **Django** — 44 files (10,801+ lines)
- **Kotlin** — 20 files (15,500+ lines)
- **Go** — 21 files (14,000+ lines)
- **Python** — 15 files (20,000+ lines)
- **SWR** — 17 files (5,200+ lines)
- **Ruby on Rails** — 22 files (6,800+ lines)
- **Bun** — 9 files (2,800+ lines)
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
| `django/` | 44 | 10,801 | Django 6.0 — models, ORM, views, templates, forms, admin, auth, middleware, security, testing, caching, async, REST API, GeoDjango, PostgreSQL, email, tasks, logging, signing, utils, composite PKs |
| `kotlin/` | 20 | 15,500 | Kotlin 2.4.0 — coroutines, null safety, data classes, KMP, serialization, DSLs, collections, generics, reflection, annotations, exceptions, type casts, equality, Java interop, testing, Gradle |
| `go/` | 21 | 14,000 | Go 1.26 — language spec, concurrency, stdlib (net, crypto, encoding, testing), modules, database, tools, cgo, FAQ, PGO, Green Tea GC |
| `python/` | 15 | 20,000 | Python 3.13 — types, functions, classes, dataclasses, enums, collections, async/asyncio, typing, stdlib (core, I/O, extended: all modules including threading, multiprocessing, socket, sqlite3, hashlib, ctypes, ssl, http, email, XML, tkinter, curses, pdb, profiling, dis, ast, tokenize, compileall, removed modules), testing, idioms, descriptors, GIL |
| `swr/` | 17 | 5,200 | SWR 2.3 — useSWR, mutation, pagination, prefetching, cache, middleware, suspense, subscription, error handling, TypeScript, Next.js, advanced |
| `rails/` | 22 | 6,800 | Ruby on Rails 8.1 — Active Record, Action View, Action Controller, routing, Active Support, Action Mailer/Mailbox/Text, Active Job, Active Storage, Action Cable, I18n, testing, security, caching, API apps, configuration, debugging, performance, advanced AR, extending Rails, upgrading |
| `bun/` | 9 | 2,800 | Bun 1.2 — runtime, package manager, HTTP server, APIs (File I/O, SQLite, Streams, Workers, Shell), advanced APIs (SQL, S3, Redis, TCP/UDP, Cron, FFI, Image, Archive, WebView, Cookies, CSRF, JSON5), test runner, bundler |
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
npx pledge-skills add django
npx pledge-skills add kotlin
npx pledge-skills add go
npx pledge-skills add python
npx pledge-skills add swr
npx pledge-skills add rails
npx pledge-skills add bun
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
- **Django**: 6.0
- **Kotlin**: 2.4.0
- **Go**: 1.26.0
- **Python**: 3.13
- **SWR**: 2.3.0
- **Ruby on Rails**: 8.1
- **Bun**: 1.2

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

Agent: "How do I set up Django async views?"
→ Read django/async.md

Agent: "How do Go goroutines and channels work?"
→ Read go/concurrency.md

Agent: "How do Python asyncio and async/await work?"
→ Read python/async-asyncio.md

Agent: "How do I use SWR for pagination?"
→ Read swr/pagination.md

Agent: "How do I set up Active Record associations?"
→ Read rails/active-record.md

Agent: "How do I use Bun.serve for an HTTP server?"
→ Read bun/http-server.md
```

## License

MIT
