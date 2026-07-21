---
name: ruby
version: Ruby 3.4 / 4.0 (master)
description: Ruby programming language — syntax, core types, OOP, blocks/procs/lambdas, exceptions, I/O, concurrency, metaprogramming, gems, testing, style guide, C extensions, and tooling
tags: [ruby, programming-language, oop, dynamic-typing, metaprogramming, rails, gems, bundler, minitest, rspec, rubocop]
---

# Ruby

A dynamic, open-source programming language focused on simplicity and productivity. Pure object-oriented, with elegant syntax, powerful metaprogramming, and a rich ecosystem.

## Quick Reference

| Topic | File |
|-------|------|
| Introduction (what is Ruby, installation, quickstart, IRB) | `introduction.md` |
| Syntax (literals, assignment, control flow, pattern matching, operators, comments) | `syntax.md` |
| Methods (definitions, arguments, keyword args, blocks, visibility, operator methods) | `methods.md` |
| Classes and Modules (inheritance, mixins, Struct, Data, access modifiers, refinements) | `classes-and-modules.md` |
| Core Types (String, Integer, Float, Array, Hash, Symbol, Range, Regexp, Nil) | `core-types.md` |
| Blocks, Procs, and Lambdas (closures, currying, yield, method objects) | `blocks-procs-lambdas.md` |
| Exceptions (raise, rescue, retry, custom exceptions, hierarchy) | `exceptions.md` |
| I/O and Files (File, FileUtils, Dir, Pathname, IO, networking) | `io-and-files.md` |
| Concurrency (Threads, Mutex, Fibers, Ractors, Queue, Async) | `concurrency.md` |
| Metaprogramming (reflection, define_method, method_missing, eval, refinements) | `metaprogramming.md` |
| Gems and Bundler (RubyGems, Gemfile, gemspec, publishing, versioning) | `gems-and-bundler.md` |
| Testing (Minitest, RSpec, matchers, mocks, shared examples) | `testing.md` |
| Standard Library (Enumerable, Comparable, JSON, YAML, CSV, Set, Time, Logger) | `standard-library.md` |
| Style Guide (layout, naming, flow control, collections, comments, RuboCop) | `style-guide.md` |
| C Extensions (C API, extconf.rb, TypedData, GC, FFI alternative) | `c-extensions.md` |
| Tools and Ecosystem (Rake, RuboCop, YARD, debug, Pry, benchmarking, editors) | `tools.md` |

---

## Core Concepts

- **Pure Object-Oriented**: Everything is an object — numbers, strings, classes, modules, even `nil`.
- **Dynamic Typing**: Types determined at runtime. Duck typing: focus on what an object can do, not what it is.
- **Blocks & Closures**: First-class support for blocks, Procs, and lambdas — Ruby's way of passing code around.
- **Metaprogramming**: Powerful reflection and dynamic code generation. Open classes, `method_missing`, `define_method`, refinements.
- **Expressive Syntax**: Designed for developer happiness. Natural language-like constructs, optional parentheses, implicit returns.
- **Rich Standard Library**: Enumerable, Comparable, JSON, YAML, CSV, Set, Logger, and more built-in.
- **Gem Ecosystem**: RubyGems + Bundler for dependency management. Thousands of gems on rubygems.org.
- **Testing Culture**: Built-in Minitest, popular RSpec, strong TDD/BDD traditions.

## Official Documentation

- [ruby-lang.org](https://www.ruby-lang.org/en/documentation/) — Official documentation hub
- [docs.ruby-lang.org](https://docs.ruby-lang.org/en) — RDoc API reference
- [rubyapi.org](https://rubyapi.org/) — Community API browser
- [C Extension Guide](https://docs.ruby-lang.org/en/master/extension_rdoc.html) — Writing C extensions
- [Ruby Style Guide](https://rubystyle.guide/) — Community style guide
- [Try Ruby](https://try.ruby-lang.org/) — Interactive in-browser tutorial
