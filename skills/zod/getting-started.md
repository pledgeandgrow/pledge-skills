# Getting Started

## Installation

```bash
npm install zod
```

Also available as `@zod/zod` on [jsr.io](https://jsr.io/@zod/zod).

Zod provides an MCP server for agents to search docs, and an [llms.txt](https://zod.dev/llms.txt) file.

## Requirements

- TypeScript v5.5+ (older versions may work but are not officially supported)
- `strict: true` in `tsconfig.json` (best practice for all TypeScript projects)

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true
  }
}
```

## Basic Usage

### Defining a Schema

```typescript
import * as z from "zod";

const Player = z.object({
  username: z.string(),
  xp: z.number(),
});
```

### Parsing Data

Use `.parse()` to validate input. Returns a strongly-typed deep clone on success, throws `ZodError` on failure.

```typescript
Player.parse({ username: "billie", xp: 100 }); // => { username: "billie", xp: 100 }
```

For async refinements or transforms, use `.parseAsync()`:

```typescript
await Player.parseAsync({ username: "billie", xp: 100 });
```

### Handling Errors

```typescript
try {
  Player.parse({ username: 42, xp: "100" });
} catch (error) {
  if (error instanceof z.ZodError) {
    error.issues;
    // [
    //   { expected: 'string', code: 'invalid_type', path: ['username'], message: 'Invalid input: expected string' },
    //   { expected: 'number', code: 'invalid_type', path: ['xp'], message: 'Invalid input: expected number' }
    // ]
  }
}
```

Use `.safeParse()` to avoid try/catch — returns a discriminated union:

```typescript
const result = Player.safeParse({ username: 42, xp: "100" });
if (!result.success) {
  result.error; // ZodError instance
} else {
  result.data; // { username: string; xp: number }
}
```

For async schemas, use `.safeParseAsync()`.

### Inferring Types

```typescript
const Player = z.object({ username: z.string(), xp: z.number() });
type Player = z.infer<typeof Player>; // { username: string; xp: number }
```

When input and output types diverge (e.g. via `.transform()`):

```typescript
const mySchema = z.string().transform((val) => val.length);
type MySchemaIn = z.input<typeof mySchema>;  // => string
type MySchemaOut = z.output<typeof mySchema>; // => number (equivalent to z.infer)
```

## Ecosystem

Zod has a thriving ecosystem of libraries and integrations:

### API Libraries
- **tRPC** — End-to-end typesafe APIs
- **upfetch** — Fetch wrapper with Zod validation
- **nestjs-zod** — NestJS integration
- **Express Zod API** — Express + Zod API framework
- **Zod Sockets** — WebSocket validation
- **GQLoom** — GraphQL integration
- **Zod JSON-RPC** — JSON-RPC validation
- **oRPC** — Typesafe API framework

### Form Integrations
- **Superforms** — SvelteKit form validation
- **conform** — React form validation
- **zod-validation-error** — User-friendly error messages
- **regle** — Vue form validation
- **svelte-jsonschema-form** — Svelte JSON Schema forms
- **frrm** / **react-f3** — React form libraries

### Zod to X
- **prisma-zod-generator** — Prisma schema to Zod
- **zod-openapi** — Zod to OpenAPI
- **zod2md** — Zod to Markdown docs
- **fastify-zod-openapi** — Fastify + OpenAPI
- **zod-to-mongo-schema** — Zod to MongoDB schema

### X to Zod
- **orval** / **Hey API** / **kubb** — OpenAPI to Zod
- **DRZL** — Drizzle to Zod
- **valype** — Various formats to Zod

### Mocking Libraries
- **@traversable/zod-test** — Schema-based test data
- **zod-schema-faker** — Fake data generation
- **zocker** — Mock data from Zod schemas

### Powered by Zod
- **Composable Functions** — Function composition with Zod
- **zod-config** — Config validation
- **zod-xlsx** — Excel file validation
- **bupkis** — Mock data generation

### Zod Utilities
- **zod-playground** — Interactive schema testing
- **eslint-plugin-zod** — ESLint rules for Zod
- **eslint-plugin-import-zod** — Import linting
- **babel-plugin-zod-hoist** — Hoist Zod imports
- **Zod AOT** — Ahead-of-time compilation
- **Zod Compare** — Schema comparison

### Community Projects
- **tRPC** — End-to-end typesafe APIs with Zod support
- **React Hook Form** — Hook-based form validation with Zod resolver
- **zshy** — Bundler-free build tool for TypeScript libraries

## Migration from Zod 3 to Zod 4

```bash
npm install zod@^4.0.0
```

A community codemod is available: [zod-v3-to-v4](https://github.com/nicoespeon/zod-v3-to-v4).

### Key Breaking Changes

**Error Customization:**
- Standardized under unified `error` param
- Deprecates `message` parameter
- Drops `invalid_type_error` and `required_error`
- Drops `errorMap`

**ZodError:**
- Updates issue formats
- Changes error map precedence
- Deprecates `.format()` and `.flatten()`
- Drops `.formErrors` and `.errors`
- Deprecates `.addIssue()` and `.addIssues()`

**z.number():**
- No infinite values (NaN, Infinity rejected)
- `.safe()` no longer accepts floats
- `.int()` accepts safe integers only

**z.string() updates:**
- Deprecates `.email()`, `.uuid()`, etc. as methods (use `z.email()`, `z.uuid()` top-level functions)
- Stricter `.uuid()` validation
- No padding in `.base64url()`
- Drops `z.string().ip()` (use `z.ipv4()`, `z.ipv6()`)
- Drops `z.string().cidr()` (use `z.cidrv4()`, `z.cidrv6()`)

**z.coerce:**
- Input type defaults to `unknown`

**z.object():**
- Defaults applied within optional fields
- Deprecates `.strict()` and `.passthrough()` (use `z.strictObject()`, `z.looseObject()`)
- Deprecates `.strip()`
- Drops `.nonstrict()`
- Drops `.deepPartial()`
- Changes `z.unknown()` optionality
- Deprecates `.merge()` (use `.extend()` or spread)

**Other:**
- `z.nativeEnum()` deprecated (use `z.enum()`)
- `z.array()` changes `.nonempty()` type
- `z.promise()` deprecated
- `z.function()` adds `.implementAsync()`
- `.refine()` ignores type predicates, drops `ctx.path`, drops function as second argument
- `z.literal()` drops symbol support
- `z.record()` drops single-argument usage, improves enum support
- `z.intersection()` throws Error on merge conflict
- Static `.create()` factory methods dropped

**Internal Changes:**
- Updates generics
- Adds `z.core` (zod/v4/core)
- Moves `._def` to `._zod`
- Drops `ZodEffects`
- Adds `ZodTransform`
- Drops `ZodPreprocess`
- Drops `ZodBranded`

### Dual Support (Zod 3 + 4)

For libraries supporting both versions:

```json
// package.json
{
  "peerDependencies": {
    "zod": "^3.25.0 || ^4.0.0"
  }
}
```

```typescript
import * as z3 from "zod/v3";
import * as z4 from "zod/v4/core";

// Differentiate at runtime
if ("_zod" in schema) {
  schema._zod.def; // Zod 4
} else {
  schema._def; // Zod 3
}
```
