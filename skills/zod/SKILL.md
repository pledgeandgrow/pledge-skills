---
name: Zod
version: "4.x"
tags:
  - zod
  - zod 4
  - validation
  - schema validation
  - typescript
  - type inference
  - z.infer
  - z.input
  - z.output
  - z.object
  - z.string
  - z.number
  - z.array
  - z.tuple
  - z.union
  - z.discriminatedUnion
  - z.intersection
  - z.record
  - z.map
  - z.set
  - z.enum
  - z.literal
  - z.date
  - z.boolean
  - z.bigint
  - z.file
  - z.instanceof
  - z.custom
  - z.function
  - z.json
  - z.templateLiteral
  - z.coerce
  - z.optional
  - z.nullable
  - z.nullish
  - z.any
  - z.unknown
  - z.never
  - z.nan
  - z.email
  - z.uuid
  - z.url
  - z.httpUrl
  - z.e164
  - z.iso.datetime
  - z.iso.date
  - z.iso.time
  - z.ipv4
  - z.ipv6
  - z.cidrv4
  - z.cidrv6
  - z.mac
  - z.jwt
  - z.hash
  - z.base64
  - z.base64url
  - z.hex
  - z.nanoid
  - z.cuid
  - z.cuid2
  - z.ulid
  - z.stringFormat
  - z.codec
  - z.decode
  - z.encode
  - z.invertCodec
  - z.transform
  - z.preprocess
  - z.pipe
  - z.refine
  - z.superRefine
  - z.check
  - z.property
  - z.stringbool
  - z.strictObject
  - z.looseObject
  - z.partialRecord
  - z.looseRecord
  - z.config
  - z.locales
  - z.NEVER
  - safeParse
  - parseAsync
  - safeParseAsync
  - ZodError
  - ZodMiniType
  - $ZodType
  - $ZodCheck
  - $ZodError
  - $ZodIssue
  - branded types
  - readonly
  - defaults
  - prefaults
  - catch
  - refinements
  - transforms
  - pipes
  - codecs
  - error customization
  - error map
  - internationalization
  - i18n
  - locales
  - tree-shaking
  - zod mini
  - zod core
  - standard schema
  - library authors
  - peer dependencies
  - migration
  - zod 3 to 4
  - codemod
  - trpc
  - react hook form
  - superforms
  - conform
  - nestjs-zod
  - express zod api
  - eslint-plugin-zod
  - zod-openapi
  - prisma-zod-generator
description: |
  Zod 4.x — TypeScript-first schema validation with static type inference. Primitives, strings, objects, refinements.
---

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
