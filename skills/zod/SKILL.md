# Zod

> TypeScript-first schema validation with static type inference.

**Version:** 4.x | **Docs:** https://zod.dev/ | **npm:** `zod` | **Discord:** https://discord.gg/RcG33DQJdf

## Overview

Zod is a TypeScript-first validation library that lets you define schemas to validate data — from simple strings to complex nested objects. It provides static type inference, immutable APIs, zero external dependencies, and a tiny 2kb core bundle (gzipped).

## Key Benefits

- **TypeScript-first:** Full static type inference via `z.infer<>`
- **Zero dependencies:** No external runtime dependencies
- **Tiny:** 2kb core bundle (gzipped)
- **Immutable API:** Methods return new instances
- **Works everywhere:** Node.js and all modern browsers
- **Built-in JSON Schema conversion**
- **Extensive ecosystem:** tRPC, React Hook Form, Superforms, and more
- **Zod Mini:** Tree-shakable variant for minimal bundle size
- **Codecs:** Bidirectional transformations between schemas
- **Internationalization:** Built-in locale support

## File Index

| File | Topics |
|------|--------|
| [getting-started.md](getting-started.md) | Installation, requirements, basic usage, parsing, error handling, type inference, ecosystem, migration from Zod 3 to 4 |
| [schemas.md](schemas.md) | Complete schema API: primitives, strings, string formats, numbers, dates, enums, objects, arrays, tuples, unions, intersections, records, maps, sets, refinements, transforms, pipes, defaults, branded types, readonly, JSON, functions, custom |
| [errors-and-codecs.md](errors-and-codecs.md) | Error customization, error maps, global errors, internationalization, locales, codecs, bidirectional transforms, useful codec implementations |
| [packages-and-internals.md](packages-and-internals.md) | Zod Core, Zod Mini, library author guidelines, internal changes, versioning, subpaths |

## Quick Start

```bash
npm install zod
```

```typescript
import * as z from "zod";

const User = z.object({
  name: z.string(),
  email: z.email(),
  age: z.number().int().positive(),
});

type User = z.infer<typeof User>;
// => { name: string; email: string; age: number }

const result = User.safeParse({ name: "Alice", email: "alice@example.com", age: 30 });
if (result.success) {
  console.log(result.data); // typed as User
} else {
  console.log(result.error.issues); // ZodError issues
}
```

## Documentation Links

- [Intro](https://zod.dev/) — Features, installation, requirements
- [Basic usage](https://zod.dev/basics) — Schema definition, parsing, errors, type inference
- [Defining schemas](https://zod.dev/api) — Complete API reference
- [Customizing errors](https://zod.dev/error-customization) — Error maps, i18n, locales
- [Codecs](https://zod.dev/codecs) — Bidirectional transforms
- [Ecosystem](https://zod.dev/ecosystem) — Libraries, tools, integrations
- [Migration guide](https://zod.dev/v4/changelog) — Zod 3 to 4 breaking changes
- [For library authors](https://zod.dev/library-authors) — Integration guidelines
- [Zod Core](https://zod.dev/packages/core) — Core package internals
- [Zod Mini](https://zod.dev/packages/mini) — Tree-shakable variant
- [llms.txt](https://zod.dev/llms.txt) — Machine-readable docs
