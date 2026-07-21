# Errors and Codecs

## Error Customization

Validation errors are surfaced as instances of `z.core.$ZodError`. The `ZodError` class in the `zod` package is a subclass with additional convenience methods.

Every issue contains a `message` property and structured metadata:

```typescript
const result = z.string().safeParse(12);
result.error.issues;
// [{ expected: 'string', code: 'invalid_type', path: [], message: 'Invalid input: expected string, received number' }]
```

### The `error` Param

Virtually every Zod API accepts an optional error message:

```typescript
z.string("Not a string!");
z.string().min(5, "Too short!");
z.uuid("Bad UUID!");
z.array(z.string(), "Not an array!");

// Or as params object
z.string({ error: "Bad!" });
z.string().min(5, { error: "Too short!" });
```

### Error Maps (Functions)

The `error` param accepts a function (error map) that runs at parse time:

```typescript
z.string({ error: () => `[${Date.now()}]: Validation failure.` });

z.string({ error: (iss) => iss.input === undefined ? "Field is required." : "Invalid input." });

// Access issue metadata
z.string({ error: (iss) => {
  iss.code;   // issue code
  iss.input;  // the input data
  iss.inst;   // the schema/check that originated this issue
  iss.path;   // the path of the error
}});

// Additional properties per API
z.string().min(5, { error: (iss) => {
  iss.minimum;   // the minimum value
  iss.inclusive; // whether the minimum is inclusive
  return `Password must have ${iss.minimum} characters or more`;
}});
```

Return `undefined` to defer to the default message (next error map in precedence chain):

```typescript
z.int64({ error: (issue) => {
  if (issue.code === "too_big") {
    return { message: `Value must be <${issue.maximum}` };
  }
  return undefined; // fall back to default
}});
```

### Per-Parse Error Customization

Customize errors per parse call (highest precedence):

```typescript
z.string().parse(123, { error: () => "Custom per-parse error" });
```

#### Include Input in Issues

```typescript
z.string().parse(123, { reportInput: true });
```

### Global Error Customization

```typescript
z.config({
  customError: (iss) => {
    return "globally modified error";
  },
});

// With issue codes
z.config({
  customError: (iss) => {
    if (iss.code === "invalid_type") return `invalid type, expected ${iss.expected}`;
    if (iss.code === "too_small") return `minimum is ${iss.minimum}`;
  },
});
```

Global errors have lower precedence than schema-level or per-parse errors.

### Internationalization

Zod provides built-in locales exported from `zod/v4/core`:

```typescript
import * as z from "zod";
import { en } from "zod/locales";
z.config(en());

// Or via z.locales
z.config(z.locales.en());
```

Lazy-load locales with dynamic imports:

```typescript
async function loadLocale(locale: string) {
  const { default: locale } = await import(`zod/v4/locales/${locale}.js`);
  z.config(locale());
}
await loadLocale("fr");
```

> **Note:** Regular Zod loads `en` locale automatically. Zod Mini does not load any locale by default — all messages read "Invalid input".

### Error Precedence (highest to lowest)

1. Per-parse error customization
2. Schema-level error param
3. Global error map (`z.config({ customError })`)
4. Default locale messages

## Codecs

Introduced in Zod 4. Codecs are special schemas that implement bidirectional transformations between two other schemas.

### Defining a Codec

```typescript
const stringToDate = z.codec(
  z.iso.datetime(), // input schema: ISO date string
  z.date(),         // output schema: Date object
  {
    decode: (isoString) => new Date(isoString), // ISO string → Date
    encode: (date) => date.toISOString(),       // Date → ISO string
  }
);
```

### Using Codecs

```typescript
// Forward (decode)
stringToDate.parse("2024-01-15T10:30:00.000Z"); // => Date
z.decode(stringToDate, "2024-01-15T10:30:00.000Z"); // => Date (strongly-typed input)

// Backward (encode)
z.encode(stringToDate, new Date("2024-01-15")); // => "2024-01-15T00:00:00.000Z"
```

`.parse()` accepts `unknown`; `z.decode()` and `z.encode()` have strongly-typed inputs:

```typescript
stringToDate.parse(12345);     // no TypeScript error (fails at runtime)
stringToDate.decode(12345);    // ❌ TypeScript error
stringToDate.encode(12345);    // ❌ TypeScript error
```

### Inverting Codecs

```typescript
const dateToString = z.invertCodec(stringToDate);
z.decode(dateToString, new Date("2024-01-15")); // => string
z.encode(dateToString, "2024-01-15T00:00:00.000Z"); // => Date
```

`z.invertCodec()` only inverts the top-level codec, not nested codecs.

### Composability

Codecs are regular schemas — nest them inside objects, arrays, pipes, etc.:

```typescript
const payloadSchema = z.object({ startDate: stringToDate });
payloadSchema.decode({ startDate: "2024-01-15T10:30:00.000Z" });
// => { startDate: Date }
```

### Async and Safe Variants

```typescript
await z.decodeAsync(codec, input);
const result = z.safeDecode(codec, input);
const result = z.safeEncode(codec, output);
```

### How Encoding Works

Encoding processes schemas in reverse order through:
- **Codecs:** calls the `encode` function
- **Pipes:** processes in reverse pipe order
- **Refinements:** runs in reverse
- **Defaults and prefaults:** applies if output is `undefined`
- **Catch:** applies fallback on error
- **Stringbool:** converts boolean back to string
- **Transforms:** not reversed (unidirectional)

### Useful Codec Implementations

Copy/paste these into your project as needed:

#### stringToNumber

```typescript
const stringToNumber = z.codec(
  z.string().regex(/^-?\d+(\.\d+)?$/),
  z.number(),
  { decode: (s) => Number(s), encode: (n) => String(n) }
);
```

#### stringToInt

```typescript
const stringToInt = z.codec(
  z.string().regex(/^-?\d+$/),
  z.int(),
  { decode: (s) => parseInt(s, 10), encode: (n) => String(n) }
);
```

#### stringToBigInt

```typescript
const stringToBigInt = z.codec(
  z.string().regex(/^-?\d+$/),
  z.bigint(),
  { decode: (s) => BigInt(s), encode: (n) => String(n) }
);
```

#### numberToBigInt

```typescript
const numberToBigInt = z.codec(
  z.number(),
  z.bigint(),
  { decode: (n) => BigInt(n), encode: (b) => Number(b) }
);
```

#### isoDatetimeToDate

```typescript
const isoDatetimeToDate = z.codec(
  z.iso.datetime(),
  z.date(),
  { decode: (s) => new Date(s), encode: (d) => d.toISOString() }
);
```

#### epochSecondsToDate

```typescript
const epochSecondsToDate = z.codec(
  z.number().int(),
  z.date(),
  { decode: (s) => new Date(s * 1000), encode: (d) => Math.floor(d.getTime() / 1000) }
);
```

#### epochMillisToDate

```typescript
const epochMillisToDate = z.codec(
  z.number().int(),
  z.date(),
  { decode: (ms) => new Date(ms), encode: (d) => d.getTime() }
);
```

#### jsonCodec

```typescript
const jsonCodec = z.codec(
  z.string(),
  z.json(),
  { decode: (s) => JSON.parse(s), encode: (v) => JSON.stringify(v) }
);
```

#### utf8ToBytes / bytesToUtf8

```typescript
const utf8ToBytes = z.codec(
  z.string(),
  z.instanceof(Uint8Array),
  { decode: (s) => new TextEncoder().encode(s), encode: (b) => new TextDecoder().decode(b) }
);
```

#### base64ToBytes / base64urlToBytes / hexToBytes

```typescript
const base64ToBytes = z.codec(
  z.string().base64(),
  z.instanceof(Uint8Array),
  { decode: (s) => Uint8Array.from(atob(s), c => c.charCodeAt(0)), encode: (b) => btoa(String.fromCharCode(...b)) }
);
```

#### stringToURL / stringToHttpURL

```typescript
const stringToURL = z.codec(
  z.url(),
  z.instanceof(URL),
  { decode: (s) => new URL(s), encode: (u) => u.href }
);

const stringToHttpURL = z.codec(
  z.url({ protocol: /^https?$/, hostname: z.regexes.domain }),
  z.instanceof(URL),
  { decode: (s) => new URL(s), encode: (u) => u.href }
);
```

#### uriComponent

```typescript
const uriComponent = z.codec(
  z.string(),
  z.string(),
  { decode: (s) => decodeURIComponent(s), encode: (s) => encodeURIComponent(s) }
);
```

#### stringToBoolean

```typescript
const stringToBoolean = z.codec(
  z.stringbool(),
  z.boolean(),
  { decode: (s) => s, encode: (b) => String(b) }
);
```
