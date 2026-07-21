# Introduction

## What is Lua

Lua is a powerful, efficient, lightweight, embeddable scripting language. It supports:

- **Procedural programming** — functions, blocks, control structures
- **Object-oriented programming** — via tables and metatables
- **Functional programming** — first-class functions, closures, higher-order functions
- **Data-driven programming** — tables as associative arrays
- **Data description** — table constructors as structured data

Lua combines simple procedural syntax with powerful data description constructs based on associative arrays and extensible semantics.

## Key Characteristics

- **Dynamically typed** — variables have no types; only values do
- **Bytecode interpreted** — runs via a register-based virtual machine
- **Automatic memory management** — generational garbage collection
- **Implemented in clean C** — the common subset of standard C and C++
- **Embeddable** — designed as an extension language for any host program
- **Lightweight** — small footprint, ideal for embedded systems and configuration

## Extension Language

Lua has no notion of a "main" program. It works embedded in a host client (called the embedding program or simply the host). The host program can:

1. **Invoke functions** to execute Lua code
2. **Read and write** Lua variables
3. **Register C functions** to be called by Lua code

Through C functions, Lua can be augmented to cope with different domains, creating customized programming languages sharing a syntactical framework.

The standard distribution includes a host program called `lua`, which uses the Lua library to offer a complete, standalone Lua interpreter for interactive or batch use.

## Design Philosophy

- **Simplicity** — small language with a clean, orthogonal design
- **Efficiency** — fast execution via register-based VM bytecode
- **Portability** — written in clean C, runs on virtually any platform
- **Embeddability** — designed from the ground up to be embedded in host applications
- **Extensibility** — metatables and the C API allow extending the language without changing the core

## Use Cases

- **Configuration files** — Lua's table syntax makes it ideal for structured config
- **Scripting** — extend applications with user-written scripts
- **Rapid prototyping** — dynamic typing and REPL for fast iteration
- **Game development** — widely used as a scripting language in game engines (e.g., Roblox, World of Warcraft, LÖVE)
- **Embedded systems** — 32-bit configuration available for small machines
- **Web development** — OpenResty, Lapis, and other web frameworks
- **Extensions and plugins** — Neovim, Redis, Wireshark, and many more

## Lua Versions

| Version | Year | Key Features |
|---------|------|-------------|
| 5.0 | 2003 | Full lexical scoping, `vararg` expressions |
| 5.1 | 2006 | `module`/`require` (modules), incremental GC |
| 5.2 | 2011 | `goto`/labels, no more `module()`, `_ENV` |
| 5.3 | 2015 | Integer/float subtypes, bitwise operators |
| 5.4 | 2020 | `const`/`toclose` attributes, generational GC |
| 5.5 | 2025 | `global` declarations, named varargs, `table.create`, `luaL_openselectedlibs` |

## License

Lua is free software, provided with no guarantees as stated in its [license](https://www.lua.org/license.html). The implementation is available at [www.lua.org](https://www.lua.org).

## Further Reading

- [Programming in Lua](https://www.lua.org/pil/) — authoritative book by Roberto Ierusalimschy (Lua's chief architect)
- [Lua Technical Notes](https://www.lua.org/notes.html) — detailed technical information
- [Lua Users Wiki](http://lua-users.org/wiki/) — community tutorials and tips
- [Lua FAQ](https://www.lua.org/faq.html) — frequently asked questions
