---
name: lua-docs
version: "Lua 5.5"
tags:
  - lua
  - scripting
  - embedded
  - coroutines
  - metatables
  - patterns
  - c-api
  - tables
  - closures
  - garbage-collection
description: >
  Use this skill whenever the user asks about Lua, the lightweight embeddable
  scripting language. Covers the full Lua 5.5 reference manual including values
  and types, metatables and metamethods, garbage collection, weak tables,
  coroutines, lexical conventions, variables, statements, control structures,
  expressions, operators, table constructors, function definitions, multiple
  results, the C API (stack, registry, C closures, error handling), the
  auxiliary library, all standard libraries (basic, coroutine, modules, string
  manipulation, patterns, UTF-8, table, math, I/O, OS, debug), the standalone
  interpreter, and incompatibilities with previous versions. Use it for code
  generation, embedding Lua in C applications, metaprogramming with metatables,
  pattern matching, coroutine-based concurrency, or any Lua-related task.
---

# Lua

Lua is a powerful, efficient, lightweight, embeddable scripting language. It supports procedural programming, object-oriented programming, functional programming, data-driven programming, and data description. Lua combines simple procedural syntax with powerful data description constructs based on associative arrays and extensible semantics. It is dynamically typed, runs by interpreting bytecode with a register-based virtual machine, and has automatic memory management with generational garbage collection.

**Specification**: [Lua 5.5 Reference Manual](https://www.lua.org/manual/5.5/)

---

## Quick Reference

| Topic | File |
|------|------|
| Introduction (what is Lua, design, embedding, extension language) | `introduction.md` |
| Values & Types (nil, boolean, number, string, function, userdata, thread, table; metatables; metamethods; GC; weak tables) | `types.md` |
| Syntax (lexical conventions, identifiers, keywords, strings, comments, variables, scoping) | `syntax.md` |
| Statements & Expressions (blocks, chunks, assignment, control structures, for loops, operators, precedence, table constructors, function definitions, multiple results) | `expressions.md` |
| Coroutines (create, resume, yield, wrap, states, collaborative multithreading) | `coroutines.md` |
| Standard Libraries (basic, string, table, math, I/O, OS, UTF-8, debug, modules) | `standard-libraries.md` |
| Patterns (character classes, pattern items, captures, balanced match, frontier) | `patterns.md` |
| C API (stack, registry, C closures, error handling, status codes, yields, debug interface, auxiliary library) | `c-api.md` |
| Standalone Interpreter (CLI options, arg table, environment variables, interactive mode) | `standalone.md` |
| Migration & Syntax (incompatibilities with 5.4, complete syntax grammar) | `migration.md` |

---

## Core Concepts

- **Values and Types**: Eight basic types — nil, boolean, number, string, function, userdata, thread, table. All values are first-class.
- **Tables**: The sole data-structuring mechanism — arrays, lists, sets, records, graphs, trees. Associative arrays with any key type (except nil and NaN).
- **Metatables & Metamethods**: Extensible semantics — operator overloading, indexing control, calls, GC finalizers, `tostring`, `pairs`, length.
- **Coroutines**: Collaborative multithreading — `coroutine.create`, `resume`, `yield`, `wrap`, `close`.
- **Closures**: Functions capture upvalues (external local variables) from their lexical scope.
- **Garbage Collection**: Incremental and generational modes, GC metamethods (`__gc`), weak tables (`__mode`).
- **C API**: Stack-based interaction — push/pop values, registry, C closures, error handling, continuation functions.
- **Patterns**: Lightweight pattern matching (not full regex) — character classes, captures, balanced match, frontier patterns.
- **Modules**: `require`, `package.path`, `package.cpath`, searchers, preload.
- **`_ENV`**: Every chunk compiled in scope of `_ENV`; global variables are `_ENV.var`.

---

## Official Documentation

- [Lua 5.5 Reference Manual](https://www.lua.org/manual/5.5/)
- [Lua Documentation](https://www.lua.org/docs.html)
- [Programming in Lua (4th edition)](https://www.lua.org/pil/)
- [Lua Users Wiki](http://lua-users.org/wiki/)
- [Lua FAQ](https://www.lua.org/faq.html)
- [Lua License](https://www.lua.org/license.html)
