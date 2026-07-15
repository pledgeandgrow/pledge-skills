---
name: TypeScript Expert
version: "5.x"
tags:
  - typescript
  - types
  - generics
  - tsconfig
  - compiler
  - javascript
description: |
  Comprehensive TypeScript reference covering all language features, type system, generics,
  narrowing, classes, modules, utility types, TSConfig, and advanced patterns. Use whenever
  the user mentions TypeScript, types, interfaces, generics, type inference, TSConfig,
  type guards, decorators, or needs help with any TypeScript code, configuration, or migration.
---

# TypeScript Expert (v5.x)

**Official Documentation:** https://www.typescriptlang.org/docs/

## Quick Reference

| Topic | File |
|-------|------|
| Primitives, arrays, objects, unions, enums | `everyday-types.md` |
| Property modifiers, index signatures, tuples, extending types | `object-types.md` |
| Function types, overloads, generics, rest params, `this` | `functions.md` |
| Generic basics, constraints, classes, variance | `generics.md` |
| Type guards, narrowing, discriminated unions, exhaustiveness | `narrowing.md` |
| Classes: fields, constructors, visibility, static, abstract | `classes.md` |
| ES modules, CommonJS, resolution, namespaces | `modules.md` |
| Mapped types, conditional types, template literals, `keyof` | `advanced-types.md` |
| All built-in utility types | `utility-types.md` |
| `tsconfig.json`: compiler options, strict flags, output | `tsconfig.md` |
| Decorators (legacy & TC39 stage 3) | `decorators.md` |
| JSX, React types, intrinsic elements | `jsx.md` |
| `.d.ts` files, ambient declarations, module augmentation | `declaration-files.md` |
| Structural typing, assignability, variance | `type-compatibility.md` |
| Migrating from JS, gradual adoption strategies | `migrating.md` |

## Core Philosophy

TypeScript adds a static type system to JavaScript. Key principles:

1. **Structural typing** — types are compared by shape, not by name
2. **Type erasure** — types are removed at compile time; no runtime overhead
3. **Gradual adoption** — can be added to existing JS projects incrementally
4. **Inference** — types are inferred when not explicitly annotated
5. **Soundness trade-offs** — practical type safety over perfect soundness

## The Type Hierarchy

```
unknown  ← everything is assignable to unknown (top type)
  ├── object
  │     ├── Array, Function, Date, RegExp, etc.
  │     └── {} (empty object type)
  │           ├── { a: string }  ← specific object types
  │           └── Record<string, T>
  ├── string
  ├── number
  ├── boolean
  ├── bigint
  ├── symbol
  └── null / undefined

never  ← assignable to everything (bottom type, empty union)
```

## Installation & Setup

```bash
npm install -D typescript
npx tsc --init    # Create tsconfig.json
```

```json
// tsconfig.json (recommended strict defaults)
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

## Type Declaration Syntax Quick Reference

```ts
// Variables
let name: string = 'Alice'
const age: number = 30

// Arrays
type Names = string[]
type Matrix = Array<number[]>

// Objects
interface Person {
  name: string
  age?: number        // optional
  readonly id: number
}

// Functions
function greet(name: string): string {
  return `Hello, ${name}`
}

// Generics
function identity<T>(value: T): T {
  return value
}

// Unions & Intersections
type Status = 'loading' | 'success' | 'error'
type Employee = Person & { salary: number }
```
