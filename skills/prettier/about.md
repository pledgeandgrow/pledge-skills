# Prettier — About, Philosophy & Rationale

## What is Prettier?

Prettier is an opinionated code formatter with support for:

- JavaScript (including experimental features)
- [JSX](https://facebook.github.io/jsx/)
- [Angular](https://angular.dev/)
- [Vue](https://vuejs.org/)
- [Flow](https://flow.org/)
- [TypeScript](https://www.typescriptlang.org/)
- CSS, Less, and [SCSS](https://sass-lang.com)
- [HTML](https://en.wikipedia.org/wiki/HTML)
- [Ember/Handlebars](https://emberjs.com/)
- [JSON](https://json.org/)
- [GraphQL](https://graphql.org/)
- Markdown, including GFM and [MDX v1](https://mdxjs.com/)
- [YAML](https://yaml.org/)
- [Lightning Web Components (LWC)](https://developer.salesforce.com/developer-centers/lightning-web-components)
- [MJML](https://mjml.io/)

It removes all original styling and ensures that all outputted code conforms to a consistent style. Prettier takes your code and reprints it from scratch by taking the line length into account.

Prettier enforces a consistent code style (i.e. code formatting that won't affect the AST) across your entire codebase because it disregards the original styling by parsing it away and re-printing the parsed AST with its own rules that take the maximum line length into account, wrapping code when necessary.

**Source**: [What is Prettier?](https://prettier.io/docs/)

---

## Why Prettier?

### Building and enforcing a style guide

By far the biggest reason for adopting Prettier is to stop all the on-going debates over styles. Having a common style guide is valuable for a project and team, but getting there is a very painful and unrewarding process. Prettier is the only "style guide" that is fully automatic.

### Helping Newcomers

Prettier is usually introduced by experienced developers but the people that disproportionally benefit from it are newcomers to the codebase. It quickens ramp up time for experienced engineers joining the company and developers coming from a different programming language.

### Writing code

With Prettier editor integration, you can just press a key binding and the code is formatted. This removes the mental energy spent formatting code manually.

### Easy to adopt

Prettier uses the least controversial coding styles and has a polished getting started experience. It's low overhead, mostly bug free, fast, and can format an entire codebase at once.

### Clean up an existing codebase

Running Prettier on an inconsistent codebase is a quick win — the codebase becomes uniform and easier to read without spending hardly any time.

### Ride the hype train

Prettier was built by the same people as React & React Native and has been widely adopted by major JS projects.

**Source**: [Why Prettier?](https://prettier.io/docs/why-prettier)

---

## Prettier vs. Linters

Linters have two categories of rules:

- **Formatting rules**: eg: `max-len`, `no-mixed-spaces-and-tabs`, `keyword-spacing`, `comma-style` — Prettier alleviates the need for this whole category of rules.
- **Code-quality rules**: eg: `no-unused-vars`, `no-extra-bind`, `no-implicit-globals`, `prefer-promise-reject-errors` — Prettier does nothing to help with these. They are the most important ones provided by linters as they are likely to catch real bugs.

**In other words, use Prettier for formatting and linters for catching bugs!**

**Source**: [Prettier vs. Linters](https://prettier.io/docs/comparison)

---

## Option Philosophy

Prettier is not a kitchen-sink code formatter that attempts to print your code in any way you wish. It is opinionated.

The more options Prettier has, the further from the goal of stopping style debates it gets. The debates over styles just turn into debates over which Prettier options to use.

### Why options exist

- A few were added during Prettier's infancy to make it take off.
- A couple were added after "great demand."
- Some were added for compatibility reasons.

### Easier to motivate

- `--trailing-comma=es5` — use trailing commas without transpiling
- `--prose-wrap` — support all quirky Markdown renderers
- `--html-whitespace-sensitivity` — needed due to HTML whitespace rules
- `--end-of-line` — keep CRLFs out of git repositories
- `--quote-props` — important for Google Closure Compiler

### Harder to motivate

`--arrow-parens`, `--jsx-single-quote`, `--bracket-same-line` and `--no-bracket-spacing` cause bike-shedding in teams. They exist as historical artifacts.

### Options are now frozen

Option requests aren't accepted anymore. Prettier has reached a point where the set of options should be "frozen". There may be situations where adding an option can't be avoided because of technical necessity (e.g. compatibility), but for formatting-related options, this is final.

**Source**: [Option Philosophy](https://prettier.io/docs/option-philosophy)

---

## Rationale

### What Prettier is concerned about

- **Correctness**: Prettier tries to guarantee the output is semantically equivalent to the input. Non-standard syntax support is best-effort and experimental.
- **Strings**: Prettier preserves the original quote style (single/double) unless `--single-quote` is used. It does not transform strings to template literals.
- **Empty lines**: Prettier preserves up to 1 empty line between statements (and up to 2 in some cases for Markdown).
- **Multi-line objects**: Prettier formats objects as multi-line if there is a newline prior to the first property. This heuristic can be changed with the `objectWrap` option.
- **Decorators**: Prettier moves decorators to the same line as the decorated class member if possible.
- **Template literals**: Prettier does not convert single/double-quoted strings to template literals or vice versa.
- **Semicolons**: Prettier prints semicolons at the end of every statement by default. Use `--no-semi` to only add semicolons at the beginning of lines that may introduce ASI failures.
- **Print width**: Prettier's `printWidth` is not a hard upper limit. It's a way to say roughly how long you'd like lines to be. Prettier will make both shorter and longer lines but generally strive to meet the specified `printWidth`.
- **JSX**: Prettier wraps JSX elements when they exceed `printWidth`, putting the `>` of multi-line elements at the end of the last line by default.
- **Comments**: Prettier preserves and re-formats comments, attaching them to the appropriate AST nodes.

### Disclaimer about non-standard syntax

Prettier recognizes non-standard syntax (ECMAScript proposals, Markdown extensions) on a best-effort basis. Incompatibilities may be introduced in any release.

### Disclaimer about machine-generated files

Files like `package.json` or `composer.lock` are machine-generated. Prettier uses a formatter based on `JSON.stringify` on such files to avoid conflicts with package managers.

### What Prettier is NOT concerned about

Prettier only prints code. It does not transform it. Out of scope:

- Turning single/double-quoted strings into template literals or vice versa
- Using `+` to break long string literals
- Adding/removing `{}` and `return` where optional
- Turning `?:` into `if-else` statements
- Sorting/moving imports, object keys, class members, JSX keys, CSS properties

**Source**: [Rationale](https://prettier.io/docs/rationale)
