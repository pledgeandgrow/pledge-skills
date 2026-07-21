# Packages and Internals

## Package Structure

Zod 4 is split into multiple sub-packages:

| Package | Import Path | Description |
|---------|------------|-------------|
| **Zod (Classic)** | `zod` or `zod/v4` | Full-featured Zod with method-chaining API |
| **Zod Mini** | `zod/mini` | Tree-shakable variant with functional API |
| **Zod Core** | `zod/v4/core` | Shared core classes, not for direct use |
| **Zod 3** | `zod/v3` | Legacy Zod 3 (for dual-support) |

### Permalink Subpaths

- `zod/v4/core` — Permanent link to Zod 4 core (will remain forever)
- `zod/v3` — Permanent link to Zod 3

> **Do not** import from `zod`, `zod/v4`, or `zod/v4/mini` in library code. Use `zod/v4/core` to support both Zod and Zod Mini.

## Zod Core

The core sub-package exports base classes and utilities consumed by Zod and Zod Mini:

```typescript
import * as z from "zod/v4/core";

// Base class for all schemas
z.$ZodType;

// Subclasses implementing common parsers
z.$ZodString;
z.$ZodObject;
z.$ZodArray;
// ... etc

// Base class for all checks
z.$ZodCheck;
z.$ZodCheckMinLength;
z.$ZodCheckMaxLength;

// Base class for all errors
z.$ZodError;

// Issue formats (types only)
{} as z.$ZodIssue;

// Utilities
z.util.isValidJWT(...);
```

### Key Properties

- **Schemas:** `$ZodType` base class with `$`-prefixed subclasses
- **Internals:** `._zod.def` for schema definitions (replaces `._def` from Zod 3)
- **Parsing:** `z.parse()`, `z.safeParse()`, `z.parseAsync()`, `z.safeParseAsync()` — top-level functions (no methods on `$ZodType`)
- **Checks:** `$ZodCheck` base class with subclasses for common validations
- **Errors:** `$ZodError` base class with `.issues` array
- **Issues:** Typed discriminated union of all possible issue types

## Zod Mini

Tree-shakable variant of Zod using a functional API instead of methods:

```typescript
import * as z from "zod/mini";

// Regular Zod: method chaining
// z.string().min(5).max(10).trim()

// Zod Mini: functional API
z.string().check(z.minLength(5), z.maxLength(10), z.trim());

// Regular Zod: z.string().optional().nullable()
// Zod Mini:
z.nullable(z.optional(z.string()));
```

### Tree-Shaking Benefits

| Schema | Zod | Zod Mini | Reduction |
|--------|-----|----------|-----------|
| `z.boolean().parse(true)` | 5.91kb | 2.12kb | 64% |
| Object with 3 fields | 13.1kb | 4.0kb | ~70% |

### When (Not) to Use Zod Mini

**Use regular Zod unless** you have uncommonly strict bundle size constraints. Bundle size on the scale of Zod (5-10kb) is only meaningful for:
- Front-end bundles for users on slow mobile networks
- Rural or developing area optimization

Considerations:
- **DX:** Regular Zod has better developer experience with method chaining
- **Backend development:** Bundle size irrelevant on server
- **Internet speed:** Only matters for client-side bundles

### ZodMiniType

All Zod Mini schemas extend `z.ZodMiniType` which extends `z.core.$ZodType`. Implements fewer methods than regular Zod but retains useful ones:

- `.parse()` / `.safeParse()` / `.parseAsync()` / `.safeParseAsync()`
- `.check()` — add checks functionally
- `.register()` — register metadata
- `.brand()` — branded types
- `.clone(def)` — clone with modified definition

### No Default Locale

Zod Mini does not load any locale by default. All error messages read "Invalid input":

```typescript
import * as z from "zod/mini";
z.config(z.locales.en()); // load English locale
```

## For Library Authors

### Do I Need to Depend on Zod?

If your library accepts user-defined schemas for black-box validation, consider [Standard Schema](https://standardschema.dev/) — a shared interface implemented by most popular validation libraries including Zod. If you need Zod-specific functionality, depend on Zod.

### Peer Dependencies

```json
// package.json
{
  "peerDependencies": {
    "zod": "^4.0.0"
  },
  "devDependencies": {
    "zod": "^4.0.0"
  }
}
```

### Which Subpaths to Import

- ✅ `zod/v4/core` — Build against shared base classes
- ❌ `zod` — Exports Zod 3 in 3.x, Zod 4 in 4.x (ambiguous)
- ❌ `zod/v4` — Zod Classic specific, won't work with Zod Mini
- ❌ `zod/v4/mini` — Zod Mini specific, won't work with Zod Classic

### Supporting Zod 3 + Zod 4

```json
{
  "peerDependencies": {
    "zod": "^3.25.0 || ^4.0.0"
  }
}
```

```typescript
import * as z3 from "zod/v3";
import * as z4 from "zod/v4/core";

type Schema = z3.ZodTypeAny | z4.$ZodType;

// Differentiate at runtime
if ("_zod" in schema) {
  schema._zod.def; // Zod 4
} else {
  schema._def;     // Zod 3
}
```

### Supporting Zod + Zod Mini

Import only from `zod/v4/core`:

```typescript
import * as z4 from "zod/v4/core";

export function acceptObjectSchema<T extends z4.$ZodObject>(schema: T) {
  z4.parse(schema, { /* data */ });
  schema._zod.def.shape;
}
```

Works with both:
```typescript
import * as z from "zod";
acceptObjectSchema(z.object({ name: z.string() }));

import * as zm from "zod/mini";
acceptObjectSchema(zm.object({ name: zm.string() }));
```

### Accepting User-Defined Schemas

**Incorrect** — loses type information:
```typescript
function inferSchema<T>(schema: z4.$ZodType<T>) { return schema; }
inferSchema(z.string()); // => $ZodType<string> (lost ZodString)
```

**Correct** — generic extends base class:
```typescript
function inferSchema<T extends z4.$ZodType>(schema: T) { return schema; }
inferSchema(z.string()); // => ZodString ✅
```

Constrain to specific subclass:
```typescript
function inferSchema<T extends z4.$ZodObject>(schema: T) { return schema; }
```

Constrain output type:
```typescript
function inferSchema<T extends z4.$ZodType<string>>(schema: T) { return schema; }
inferSchema(z.string());  // ✅
inferSchema(z.number());  // ❌
```

Parse with top-level functions (no methods on `$ZodType`):
```typescript
function parseData<T extends z4.$ZodType>(data: unknown, schema: T): z4.output<T> {
  return z.parse(schema, data);
}
```

## Internal Changes (Zod 3 → 4)

### Updated Generics
Schema classes use updated generic parameters for better type inference.

### Added z.core
The `zod/v4/core` sub-package provides shared base classes.

### Moved `._def` to `._zod`
Schema definitions are now accessed via `schema._zod.def` instead of `schema._def`.

### Dropped ZodEffects
The `ZodEffects` wrapper class is removed. Transforms and refinements are handled differently.

### Added ZodTransform
New `ZodTransform` class for transform schemas.

### Dropped ZodPreprocess
`ZodPreprocess` is removed. Use `z.preprocess()` which returns a `ZodTransform`.

### Dropped ZodBranded
`ZodBranded` wrapper is removed. Branding is handled via type-level constructs only.

## Standard Schema

Zod implements the [Standard Schema](https://standardschema.dev/) spec — a shared interface for TypeScript validation libraries. This allows libraries to accept any compliant validator (Zod, Valibot, ArkType, etc.) without direct dependencies.

Key features:
- Extract inferred input/output types
- Validate inputs
- Get back standardized errors
- Works as a "black box" validator interface
