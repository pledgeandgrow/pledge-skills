# Bun Test Runner

Bun includes a fast, Jest-compatible test runner with TypeScript support.

## Running Tests

```bash
bun test
```

Test file patterns matched:
- `*.test.{js|jsx|ts|tsx|mjs|cjs|mts|cts}`
- `*_test.{js|jsx|ts|tsx|mjs|cjs|mts|cts}`
- `*.spec.{js|jsx|ts|tsx|mjs|cjs|mts|cts}`
- `*_spec.{js|jsx|ts|tsx|mjs|cjs|mts|cts}`

### Filter by file

```bash
bun test ./test/specific-file.test.ts
bun test ./test/utils/
```

### Filter by test name

```bash
bun test --test-name-pattern addition
# or
bun test -t addition
```

## Writing Tests

```typescript
import { expect, test } from "bun:test";

test("2 + 2", () => {
  expect(2 + 2).toBe(4);
});
```

### describe blocks

```typescript
import { describe, expect, test } from "bun:test";

describe("math", () => {
  test("addition", () => {
    expect(1 + 1).toBe(2);
  });

  test("subtraction", () => {
    expect(2 - 1).toBe(1);
  });
});
```

## Assertions

```typescript
expect(value).toBe(expected);           // strict equality
expect(value).toEqual(expected);        // deep equality
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();
expect(value).toBeNaN();
expect(value).toContain(item);
expect(value).toHaveLength(n);
expect(fn).toThrow();
expect(fn).toThrow("error message");
expect(value).toBeGreaterThan(n);
expect(value).toBeGreaterThanOrEqual(n);
expect(value).toBeLessThan(n);
expect(value).toBeLessThanOrEqual(n);
expect(value).toMatch(regex);
expect(value).toMatchObject(partial);
expect(array).toContain(item);
expect(string).toContain(substring);
expect(value).toBeInstanceOf(Class);
expect(value).toHaveProperty("key", value);
expect(value).toMatchSnapshot();
```

### Negation

```typescript
expect(value).not.toBe(expected);
expect(fn).not.toThrow();
```

### expect.assertions

```typescript
test("all assertions called", () => {
  expect.assertions(2);
  expect(1).toBe(1);
  expect(2).toBe(2);
});
```

## Lifecycle Hooks

```typescript
import { beforeAll, beforeEach, afterAll, afterEach, describe, test } from "bun:test";

describe("database", () => {
  beforeAll(async () => {
    // runs once before all tests
  });

  beforeEach(async () => {
    // runs before each test
  });

  afterEach(async () => {
    // runs after each test
  });

  afterAll(async () => {
    // runs once after all tests
  });

  test("query", () => {
    // ...
  });
});
```

### Preload setup files

```bash
bun test --preload ./setup.ts
```

## Async Tests

```typescript
test("async", async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});
```

## Mocks

```typescript
import { test, expect, mock } from "bun:test";

const random = mock(() => Math.random());

test("random mock", () => {
  const val = random();
  expect(val).toBeGreaterThan(0);
  expect(random).toHaveBeenCalled();
  expect(random).toHaveBeenCalledTimes(1);
});
```

### Jest-compatible alias

```typescript
import { test, expect, jest } from "bun:test";

const fn = jest.fn(() => 42);
```

### Mock return values

```typescript
const mockFn = mock(() => "default");
mockFn.mockReturnValue("custom");
mockFn.mockReturnValueOnce("once");
```

### Mock implementations

```typescript
const mockFn = mock((x: number) => x * 2);
mockFn.mockImplementation((x) => x * 3);
```

### Mock modules

```typescript
import { mock } from "bun:test";

mock.module("node:fs", () => ({
  readFileSync: () => "mocked content",
}));
```

## Snapshot Testing

```typescript
import { test, expect } from "bun:test";

test("snapshot", () => {
  expect({ a: 1, b: "hello" }).toMatchSnapshot();
});
```

### Update snapshots

```bash
bun test --update-snapshots
```

## Watch Mode

```bash
bun test --watch
```

Automatically re-runs tests on file changes.

## Concurrent Tests

```typescript
test.concurrent("parallel test 1", () => {
  // runs in parallel
});

test.concurrent("parallel test 2", () => {
  // runs in parallel
});
```

### Serial tests

```typescript
test.serial("sequential test", () => {
  // runs in order
});
```

### CLI flags

```bash
bun test --concurrent           # run all tests concurrently
bun test --max-concurrency 4    # limit concurrency
```

## Timeouts

```typescript
test("slow test", () => {
  // ...
}, 5000);  // 5 second timeout
```

```bash
bun test --timeout 10000  # 10 second global timeout
```

## Retry Failed Tests

```bash
bun test --rerun 3  # retry up to 3 times
```

## Bail Out

```bash
bun test --bail       # stop after 1 failure
bun test --bail=10    # stop after 10 failures
```

## Randomize Order

```bash
bun test --randomize
bun test --randomize --seed 12345  # reproducible random order
```

## UI & DOM Testing

Bun works with DOM testing libraries:

```bash
bun add -d happy-dom
bun add -d @testing-library/react
```

```typescript
// setup.ts
import { GlobalRegistrator } from "happy-dom";

GlobalRegistrator.register();
```

```bash
bun test --preload ./setup.ts
```

## CI/CD Integration

### GitHub Actions

```yaml
- name: Run tests
  run: bun test
```

### JUnit XML reports

```bash
bun test --reporter=junit --reporter-outfile=test-results.xml
```

## Coverage

```bash
bun test --coverage
```

## CLI Usage

```bash
bun test                          # run all tests
bun test <filter>                 # run matching tests
bun test --watch                  # watch mode
bun test --coverage               # with coverage
bun test --bail                   # stop on first failure
bun test --timeout 5000           # set timeout
bun test --update-snapshots       # update snapshots
bun test --preload ./setup.ts     # preload setup file
bun test --concurrent             # run concurrently
bun test --randomize              # randomize order
bun test --rerun 3                # retry failures
```
