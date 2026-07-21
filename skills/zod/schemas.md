# Schema API Reference

Complete reference for all Zod schema types, methods, and validation features.

## Primitives

```typescript
z.string();
z.number();
z.bigint();
z.boolean();
z.symbol();
z.undefined();
z.null();
```

### Coercion

```typescript
z.coerce.string();  // String(input)
z.coerce.number();  // Number(input)
z.coerce.boolean(); // Boolean(input)
z.coerce.bigint();  // BigInt(input)
```

Input type is `unknown` by default. Pass a generic for a specific input type:

```typescript
const B = z.coerce.number<number>();
type BInput = z.input<typeof B>; // => number
```

## Literals

```typescript
const tuna = z.literal("tuna");
const twelve = z.literal(12);
const twobig = z.literal(2n);
const tru = z.literal(true);
```

Multiple literal values:

```typescript
const colors = z.literal(["red", "green", "blue"]);
colors.values; // => Set<"red" | "green" | "blue">
```

## Strings

```typescript
// Validations
z.string().max(5);
z.string().min(5);
z.string().length(5);
z.string().regex(/^[a-z]+$/);
z.string().startsWith("aaa");
z.string().endsWith("zzz");
z.string().includes("---");
z.string().uppercase();
z.string().lowercase();

// Transforms
z.string().trim();
z.string().toLowerCase();
z.string().toUpperCase();
z.string().normalize();
```

## String Formats

Top-level functions (Zod 4 replaces string method variants):

```typescript
z.email();
z.uuid();
z.url();
z.httpUrl();        // http or https URLs only
z.hostname();
z.e164();           // E.164 phone numbers
z.emoji();
z.base64();
z.base64url();
z.hex();
z.jwt();
z.nanoid();
z.cuid();
z.cuid2();
z.ulid();
z.ipv4();
z.ipv6();
z.mac();
z.cidrv4();         // IPv4 CIDR block
z.cidrv6();         // IPv6 CIDR block
z.hash("sha256");   // or "sha1", "sha384", "sha512", "md5"
z.iso.date();
z.iso.time();
z.iso.datetime();
z.iso.duration();
```

### Emails

```typescript
z.email();
z.email({ pattern: /your regex here/ });

// Built-in regexes
z.email({ pattern: z.regexes.email });        // default
z.email({ pattern: z.regexes.html5Email });   // browser input[type=email]
z.email({ pattern: z.regexes.rfc5322Email }); // RFC 5322
z.email({ pattern: z.regexes.unicodeEmail }); // Unicode-friendly
```

### UUIDs

```typescript
z.uuid();
z.uuid({ version: "v4" }); // v1-v8
z.uuidv4(); z.uuidv6(); z.uuidv7();
z.guid(); // any UUID-like identifier
```

### URLs

```typescript
const schema = z.url();
schema.parse("https://example.com"); // ✅
schema.parse("mailto:test@example.com"); // ✅

// Constrain hostname/protocol
z.url({ hostname: /^example\.com$/ });
z.url({ protocol: /^https$/ });

// Recommended web URL schema
const httpUrl = z.url({ protocol: /^https?$/, hostname: z.regexes.domain });

// Normalize URLs
z.url({ normalize: true });
```

### Phone Numbers (E.164)

```typescript
const phone = z.e164();
phone.parse("+15555555555"); // ✅
phone.parse("555-555-5555"); // ❌
```

### ISO Datetimes

```typescript
const datetime = z.iso.datetime();
datetime.parse("2020-01-01T06:15:00Z"); // ✅

// Allow timezone offsets
z.iso.datetime({ offset: true });

// Allow unqualified (timezone-less)
z.iso.datetime({ local: true });

// Constrain precision
z.iso.datetime({ precision: -1 }); // minute precision
z.iso.datetime({ precision: 0 });  // second precision
z.iso.datetime({ precision: 3 });  // millisecond precision
```

### ISO Dates and Times

```typescript
z.iso.date();  // YYYY-MM-DD
z.iso.time();  // HH:MM[:SS[.s+]]
z.iso.time({ precision: 3 }); // millisecond precision
```

### IP Addresses, CIDR, MAC, JWT, Hashes

```typescript
z.ipv4();
z.ipv6();
z.cidrv4(); // "192.168.0.0/24"
z.cidrv6(); // "2001:db8::/32"
z.mac();    // colon-delimited by default
z.mac({ delimiter: "-" });
z.jwt();
z.jwt({ alg: "HS256" });
z.hash("sha256", { enc: "hex" });      // default
z.hash("sha256", { enc: "base64" });
z.hash("sha256", { enc: "base64url" });
```

### Custom Formats

```typescript
const coolId = z.stringFormat("cool-id", (val) => {
  return val.length === 100 && val.startsWith("cool-");
});
// Also accepts regex:
z.stringFormat("cool-id", /^cool-[a-z0-9]{95}$/);
```

Produces `"invalid_format"` issues (more descriptive than `"custom"` errors).

## Template Literals

```typescript
z.templateLiteral(["hello, ", z.string(), "!"]); // `hello, ${string}!`
z.templateLiteral(["hi there"]);                   // `hi there`
z.templateLiteral(["email: ", z.string()]);        // `email: ${string}`
z.templateLiteral(["high", z.literal(5)]);         // `high5`
z.templateLiteral([z.number(), z.enum(["px", "em", "rem"])]); // `${number}px` | ...
```

## Numbers

```typescript
z.number(); // any finite number (NaN, Infinity rejected)

z.number().gt(5);
z.number().gte(5);    // alias .min(5)
z.number().lt(5);
z.number().lte(5);    // alias .max(5)
z.number().positive();
z.number().nonnegative();
z.number().negative();
z.number().nonpositive();
z.number().multipleOf(5); // alias .step(5)

z.nan(); // validates NaN specifically
```

## Integers

```typescript
z.int();    // safe integer range
z.int32();  // int32 range
```

## BigInts

```typescript
z.bigint();
z.bigint().gt(5n);
z.bigint().gte(5n);  // alias .min(5n)
z.bigint().lt(5n);
z.bigint().lte(5n);  // alias .max(5n)
z.bigint().positive();
z.bigint().nonnegative();
z.bigint().negative();
z.bigint().nonpositive();
z.bigint().multipleOf(5n); // alias .step(5n)
```

## Booleans

```typescript
z.boolean().parse(true);  // => true
z.boolean().parse(false); // => false
```

## Dates

```typescript
z.date(); // validates Date instances

z.date().min(new Date("1900-01-01"), { error: "Too old!" });
z.date().max(new Date(), { error: "Too young!" });

z.date({ error: issue => issue.input === undefined ? "Required" : "Invalid date" });
```

## Enums

```typescript
const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]);
FishEnum.parse("Salmon"); // ✅
FishEnum.parse("Swordfish"); // ❌

// Enum-like objects
const Fish = { Salmon: 0, Tuna: 1 } as const;
const FishEnum = z.enum(Fish);

// TypeScript enums
enum Fish { Salmon = 0, Tuna = 1 }
const FishEnum = z.enum(Fish);

// Methods
FishEnum.enum;     // => { Salmon: "Salmon", Tuna: "Tuna", Trout: "Trout" }
FishEnum.exclude(["Salmon", "Trout"]); // new enum without those values
FishEnum.extract(["Salmon", "Trout"]); // new enum with only those values
```

> **Note:** `z.nativeEnum()` is deprecated. Use `z.enum()` for all enum types.

## Stringbools

Parse "boolish" string values to booleans (useful for environment variables):

```typescript
const strbool = z.stringbool();
strbool.parse("true");  // => true
strbool.parse("1");     // => true
strbool.parse("yes");   // => true
strbool.parse("on");    // => true
strbool.parse("false"); // => false
strbool.parse("0");     // => false

// Custom truthy/falsy values
z.stringbool({
  truthy: ["true", "1", "yes", "on", "y", "enabled"],
  falsy: ["false", "0", "no", "off", "n", "disabled"],
});

// Case-sensitive
z.stringbool({ case: "sensitive" });
```

## Optionals, Nullables, Nullish

```typescript
z.optional(z.literal("yoda")); // or z.literal("yoda").optional()
z.nullable(z.literal("yoda")); // or z.literal("yoda").nullable()
z.nullish(z.literal("yoda"));  // both optional and nullable

// Unwrap
optionalYoda.unwrap();  // inner schema
nullableYoda.unwrap();   // inner schema
```

## Unknown, Any, Never

```typescript
z.any();     // allows any value, inferred type: any
z.unknown(); // allows any value, inferred type: unknown
z.never();   // no value passes, inferred type: never
```

## Objects

```typescript
const Person = z.object({
  name: z.string(),
  age: z.number(),
});
type Person = z.infer<typeof Person>; // { name: string; age: number }

// Optional properties
const Dog = z.object({ name: z.string(), age: z.number().optional() });

// Unknown keys stripped by default
Dog.parse({ name: "Yeller", extraKey: true }); // => { name: "Yeller" }
```

### Strict and Loose Objects

```typescript
z.strictObject({ name: z.string() }); // throws on unknown keys
z.looseObject({ name: z.string() });  // passes unknown keys through
```

### Object Methods

```typescript
// Catchall — validate unrecognized keys
z.object({ name: z.string() }).catchall(z.string());

// Access internal schemas
Dog.shape.name; // => string schema
Dog.shape.age;  // => number schema

// Keys as enum
Dog.keyof(); // => ZodEnum<["name", "age"]>

// Extend — add/overwrite fields
Dog.extend({ breed: z.string() });

// Alternative: spread syntax (more tsc-efficient)
z.object({ ...Dog.shape, breed: z.string() });

// Safe extend — prevents overwriting with non-assignable schema
z.object({ a: z.string() }).safeExtend({ a: z.string().min(5) }); // ✅
z.object({ a: z.string() }).safeExtend({ a: z.number() });        // ❌

// Pick / Omit
Recipe.pick({ title: true });
Recipe.omit({ id: true });

// Partial — make all or some properties optional
Recipe.partial();
Recipe.partial({ ingredients: true });

// Required — make all or some properties required
Recipe.required();
Recipe.required({ description: true });
```

### Recursive Objects

```typescript
const Category = z.object({
  name: z.string(),
  get subcategories() { return z.array(Category) }
});

// Mutually recursive
const User = z.object({
  email: z.email(),
  get posts() { return z.array(Post) }
});
const Post = z.object({
  title: z.string(),
  get author() { return User }
});
```

### Circularity Errors

For complex recursive types that trigger TypeScript errors, add type annotations:

```typescript
const Activity = z.object({
  name: z.string(),
  get subcategories(): z.ZodNullable<z.ZodArray<typeof Activity>> {
    return z.nullable(z.array(Activity));
  },
});
```

## Arrays

```typescript
const stringArray = z.array(z.string()); // or z.string().array()
stringArray.unwrap(); // => string schema

z.array(z.string()).min(5);
z.array(z.string()).max(5);
z.array(z.string()).length(5);
```

## Tuples

```typescript
const MyTuple = z.tuple([z.string(), z.number(), z.boolean()]);
// => [string, number, boolean]

// Variadic (rest) argument
const variadicTuple = z.tuple([z.string()], z.number());
// => [string, ...number[]]
```

## Unions

```typescript
const stringOrNumber = z.union([z.string(), z.number()]);
stringOrNumber.options; // [ZodString, ZodNumber]
```

### Exclusive Unions (XOR)

Exactly one option must match — fails if zero or multiple match:

```typescript
const schema = z.xor([z.string(), z.number()]);
schema.parse("hello"); // ✅
schema.parse(42);      // ✅
schema.parse(true);    // ❌ (zero matches)

// Mutual exclusivity
const payment = z.xor([
  z.object({ type: z.literal("card"), cardNumber: z.string() }),
  z.object({ type: z.literal("bank"), accountNumber: z.string() }),
]);
```

## Discriminated Unions

More efficient than regular unions for objects sharing a discriminator key:

```typescript
const MyResult = z.discriminatedUnion("status", [
  z.object({ status: z.literal("success"), data: z.string() }),
  z.object({ status: z.literal("failed"), error: z.string() }),
]);
```

## Intersections

```typescript
const Person = z.object({ name: z.string() });
const Employee = z.object({ role: z.string() });
const EmployedPerson = z.intersection(Person, Employee);
// => Person & Employee
```

> **Tip:** Prefer `A.extend(B)` over `z.intersection(A, B)` for objects — returns an object schema with `.pick()`, `.omit()`, etc.

## Records

```typescript
// Standard record
const IdCache = z.record(z.string(), z.string()); // Record<string, string>

// Enum keys (exhaustive — all keys required)
const Keys = z.enum(["id", "name", "email"]);
const Person = z.record(Keys, z.string()); // { id: string; name: string; email: string }

// Partial record (keys optional)
const Person = z.partialRecord(Keys.or(z.never()), z.string());

// Loose record (non-matching keys pass through)
z.looseRecord(z.string().regex(/_phone$/), z.e164());

// Numeric keys
z.record(z.number(), z.string());
z.record(z.int().step(1).min(0).max(10), z.string());
```

## Maps

```typescript
const StringNumberMap = z.map(z.string(), z.number());
// Map<string, number>
```

## Sets

```typescript
const NumberSet = z.set(z.number()); // Set<number>

z.set(z.string()).min(5);
z.set(z.string()).max(5);
z.set(z.string()).size(5);
```

## Files

```typescript
const fileSchema = z.file();
fileSchema.min(10_000);              // min size in bytes
fileSchema.max(1_000_000);           // max size in bytes
fileSchema.mime("image/png");        // MIME type
fileSchema.mime(["image/png", "image/jpeg"]); // multiple MIME types
```

## Promises

> **Deprecated:** `z.promise()` is deprecated. If you suspect a value is a Promise, `await` it before parsing.

## Instanceof

```typescript
class Test { name: string; }
const TestSchema = z.instanceof(Test);
TestSchema.parse(new Test()); // ✅
TestSchema.parse("whatever"); // ❌
```

### Property Validation

```typescript
const schema = z.instanceof(URL).check(
  z.property("protocol", z.literal("https:", "Only HTTPS allowed"))
);

// Works with any type
z.string().check(z.property("length", z.number().min(10)));
```

## Refinements

Custom validation beyond built-in APIs.

### .refine()

```typescript
const myString = z.string().refine((val) => val.length <= 255);

// Custom error
z.string().refine((val) => val.length > 8, { error: "Too short!" });

// Abort — stop further checks on failure
z.string().refine((val) => val.length > 8, { error: "Too short!", abort: true });

// Custom path
z.object({ password: z.string(), confirm: z.string() })
  .refine((data) => data.password === data.confirm, {
    error: "Passwords don't match",
    path: ["confirm"],
  });

// Async refinement (requires .parseAsync)
z.string().refine(async (id) => { return true; });

// When — control when refinement runs
z.object({ password: z.string().min(8), confirmPassword: z.string() })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
    when(payload) { return /* boolean */; },
  });
```

### .superRefine()

Create multiple issues with any internal issue type:

```typescript
const UniqueStringArray = z.array(z.string()).superRefine((val, ctx) => {
  if (val.length > 3) {
    ctx.addIssue({ code: "too_big", maximum: 3, origin: "array", inclusive: true, message: "Too many items", input: val });
  }
  if (val.length !== new Set(val).size) {
    ctx.addIssue({ code: "custom", message: "No duplicates allowed.", input: val });
  }
});
```

### .check()

Lower-level, more performant but more verbose than `.superRefine()`.

## Pipes

Chain schemas together:

```typescript
const stringToLength = z.string().pipe(z.transform(val => val.length));
stringToLength.parse("hello"); // => 5
```

## Transforms

Unidirectional data transformation:

```typescript
const castToString = z.transform((val) => String(val));
castToString.parse(123); // => "123"

// With validation issues
const coercedInt = z.transform((val, ctx) => {
  try {
    return Number.parseInt(String(val));
  } catch {
    ctx.issues.push({ code: "custom", message: "Not a number", input: val });
    return z.NEVER;
  }
});

// Async transforms (requires .parseAsync)
z.string().transform(async (id) => { return db.getUserById(id); });
```

### .transform() — convenience method

```typescript
const stringToLength = z.string().transform(val => val.length);
```

### .preprocess() — transform before validation

```typescript
const coercedInt = z.preprocess((val) => {
  if (typeof val === "string") return Number.parseInt(val);
  return val;
}, z.int());

// Narrow input type
const trimmed = z.preprocess(
  (val: string | null | undefined) => val?.trim() ?? "",
  z.string()
);
```

## Defaults

```typescript
z.string().default("tuna");
z.number().default(Math.random); // function re-executed each time
```

## Prefaults

Pre-parse default — input is parsed (not short-circuited):

```typescript
z.string().transform(val => val.length).prefault("tuna");
// undefined => parses "tuna" => 4

z.string().trim().toUpperCase().prefault(" tuna ");
// undefined => "TUNA" (vs .default(" tuna ") => " tuna ")
```

## Catch

Fallback value on validation error:

```typescript
const numberWithCatch = z.number().catch(42);
numberWithCatch.parse(5);     // => 5
numberWithCatch.parse("tuna"); // => 42

// Function form
z.number().catch((ctx) => {
  ctx.error; // the caught ZodError
  return Math.random();
});
```

## Branded Types

Simulate nominal typing in TypeScript:

```typescript
const Cat = z.object({ name: z.string() }).brand<"Cat">();
const Dog = z.object({ name: z.string() }).brand<"Dog">();

const pluto = Dog.parse({ name: "pluto" });
const simba: Cat = pluto; // ❌ not allowed

// Brand direction (Zod 4.2+)
z.string().brand<"Cat", "out">();   // output branded (default)
z.string().brand<"Cat", "in">();    // input branded
z.string().brand<"Cat", "inout">(); // both branded
```

## Readonly

```typescript
const ReadonlyUser = z.object({ name: z.string() }).readonly();
// => Readonly<{ name: string }>

z.array(z.string()).readonly();       // readonly string[]
z.tuple([z.string(), z.number()]).readonly(); // readonly [string, number]
z.map(z.string(), z.date()).readonly(); // ReadonlyMap<string, Date>
z.set(z.string()).readonly();        // ReadonlySet<string>
```

Result is frozen with `Object.freeze()`.

## JSON

```typescript
const jsonSchema = z.json(); // any JSON-encodable value
```

Equivalent to: `z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(jsonSchema), z.record(z.string(), jsonSchema)])`

## Functions

```typescript
const MyFunction = z.function({
  input: [z.string()],
  output: z.number(),
});

const computeTrimmedLength = MyFunction.implement((input) => {
  return input.trim().length;
});

computeTrimmedLength("sandwich"); // => 8
computeTrimmedLength(42);         // throws ZodError

// Async implementation
const asyncFn = MyFunction.implementAsync(async (input) => input.trim().length);

// Output-only validation (omit output field)
const InputOnly = z.function({ input: [z.string()] });
```

## Custom

```typescript
import { Decimal } from "decimal.js";
const decimalSchema = z.custom<Decimal>((val) => Decimal.isDecimal(val));

// No validation function — accepts anything (dangerous!)
z.custom<{ arg: string }>();

// Custom error
z.custom<...>((val) => ..., "custom error message");
```

## Apply

Incorporate external functions into method chains:

```typescript
function setCommonNumberChecks<T extends z.ZodNumber>(schema: T) {
  return schema.min(0).max(100);
}

const schema = z.number()
  .apply(setCommonNumberChecks)
  .nullable();
```
