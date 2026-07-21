# Jest — Getting Started & Core Concepts

> Source: https://jestjs.io/docs/getting-started

---

## Installation

Install Jest using your favorite package manager:

```bash
# npm
npm install --save-dev jest

# Yarn
yarn add --dev jest

# pnpm
pnpm add --save-dev jest

# Bun
bun add --dev jest
```

---

## Your First Test

Create a `sum.js` file:

```javascript
function sum(a, b) {
  return a + b;
}
module.exports = sum;
```

Create a test file `sum.test.js`:

```javascript
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

Add the following to your `package.json`:

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

Run the test:

```bash
npm test
# or
yarn test
```

Output:

```
PASS ./sum.test.js
✓ adds 1 + 2 to equal 3 (5ms)
```

---

## Running from Command Line

You can run Jest directly from the CLI with useful options:

```bash
# Run tests matching a pattern
jest my-test --notify --config=config.json

# Run with coverage
jest --coverage

# Run in watch mode
jest --watch

# Run only changed files
jest --onlyChanged

# Run with specific test path pattern
jest --testPathPattern="user"
```

See [Jest CLI Options](https://jestjs.io/docs/cli) for all available options.

---

## Configuration

### Generate a Basic Configuration File

```bash
# npm
npm init jest@latest

# Yarn
yarn create jest

# pnpm
pnpm create jest

# Bun
bunx create-jest
```

Jest will ask questions and create a configuration file tailored to your project.

### Using Babel

```bash
npm install --save-dev babel-jest @babel/core @babel/preset-env
```

Create `babel.config.js`:

```javascript
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
  ],
};
```

Jest sets `process.env.NODE_ENV` to `'test'` if not set. You can use this for conditional config:

```javascript
module.exports = api => {
  const isTest = api.env('test');
  return {
    // conditionally configure presets and plugins
  };
};
```

To disable babel-jest auto-transform:

```javascript
module.exports = {
  transform: {},
};
```

### Using TypeScript

#### Via Babel

```bash
npm install --save-dev @babel/preset-typescript
```

```javascript
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
};
```

**Caveat**: Babel transpilation only — no type-checking. Use `tsc` separately or `ts-jest` for type-checking.

#### Via ts-jest

```bash
npm install --save-dev ts-jest
```

Create a [ts-jest configuration](https://kulshekhar.github.io/ts-jest/docs/getting-started/installation) file.

#### Type Definitions

**Option 1**: Use `@jest/globals` for explicit imports:

```bash
npm install --save-dev @jest/globals
```

```typescript
import { describe, expect, test } from '@jest/globals';
import { sum } from './sum';

describe('sum module', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
```

**Option 2**: Use `@types/jest` for global types:

```bash
npm install --save-dev @types/jest
```

Match versions closely (e.g., Jest 30.x → `@types/jest` 30.x).

### Using with Bundlers

#### Webpack

Jest works with webpack. See the [webpack guide](https://jestjs.io/docs/webpack) for handling static assets, CSS modules, and custom file resolution.

#### Vite

Jest is not directly supported by Vite due to plugin system incompatibilities. Use [Vitest](https://vitest.dev/) as an alternative with a Jest-compatible API.

#### Parcel

Jest works with Parcel with zero configuration. Refer to [Parcel docs](https://parceljs.org/docs/) for setup.

### Using ESLint

Import Jest globals from `@jest/globals` to avoid `no-undef` errors:

```javascript
import { describe, expect, test } from '@jest/globals';
```

Or configure ESLint with the jest environment:

```javascript
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: { ...globals.jest },
    },
  },
]);
```

Or use [eslint-plugin-jest](https://github.com/jest-community/eslint-plugin-jest):

```json
{
  "overrides": [
    {
      "files": ["tests/**/*"],
      "plugins": ["jest"],
      "env": { "jest/globals": true }
    }
  ]
}
```

---

## Using Matchers

Source: https://jestjs.io/docs/using-matchers

### Common Matchers

```javascript
// Exact equality (uses Object.is)
test('two plus two is four', () => {
  expect(2 + 2).toBe(4);
});

// Deep equality (recursive)
test('object assignment', () => {
  const data = { one: 1 };
  data['two'] = 2;
  expect(data).toEqual({ one: 1, two: 2 });
});

// Strict equality (includes undefined keys, array sparseness)
expect(data).toStrictEqual({ one: 1, two: 2 });

// Negation
test('adding positive numbers is not zero', () => {
  for (let a = 1; a < 10; a++) {
    for (let b = 1; b < 10; b++) {
      expect(a + b).not.toBe(0);
    }
  }
});
```

### Truthiness

| Matcher | Matches |
|---------|---------|
| `toBeNull()` | only `null` |
| `toBeUndefined()` | only `undefined` |
| `toBeDefined()` | opposite of `toBeUndefined` |
| `toBeTruthy()` | anything an `if` treats as true |
| `toBeFalsy()` | anything an `if` treats as false |

```javascript
test('null', () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});
```

### Numbers

```javascript
test('two plus two', () => {
  const value = 2 + 2;
  expect(value).toBeGreaterThan(3);
  expect(value).toBeGreaterThanOrEqual(3.5);
  expect(value).toBeLessThan(5);
  expect(value).toBeLessThanOrEqual(4.5);
  expect(value).toBe(4);
  expect(value).toEqual(4);
});

// Floating point
test('adding floating point numbers', () => {
  const value = 0.1 + 0.2;
  expect(value).toBeCloseTo(0.3); // avoids rounding errors
});
```

### Strings

```javascript
test('there is no I in team', () => {
  expect('team').not.toMatch(/I/);
});

test('but there is a "stop" in Christoph', () => {
  expect('Christoph').toMatch(/stop/);
});
```

### Arrays and Iterables

```javascript
const shoppingList = [
  'diapers', 'kleenex', 'trash bags', 'paper towels', 'milk',
];

test('the shopping list has milk on it', () => {
  expect(shoppingList).toContain('milk');
  expect(new Set(shoppingList)).toContain('milk');
});
```

### Exceptions

```javascript
function compileAndroidCode() {
  throw new Error('you are using the wrong JDK!');
}

test('compiling android goes as expected', () => {
  expect(() => compileAndroidCode()).toThrow();
  expect(() => compileAndroidCode()).toThrow(Error);
  expect(() => compileAndroidCode()).toThrow('you are using the wrong JDK');
  expect(() => compileAndroidCode()).toThrow(/JDK/);
  expect(() => compileAndroidCode()).toThrow(/^you are using the wrong JDK!$/);
});
```

---

## Testing Asynchronous Code

Source: https://jestjs.io/docs/asynchronous

### Promises

Return a promise from your test — Jest will wait for it to resolve:

```javascript
test('the data is peanut butter', () => {
  return fetchData().then(data => {
    expect(data).toBe('peanut butter');
  });
});
```

### Async/Await

```javascript
test('the data is peanut butter', async () => {
  const data = await fetchData();
  expect(data).toBe('peanut butter');
});

test('the fetch fails with an error', async () => {
  expect.assertions(1);
  try {
    await fetchData();
  } catch (error) {
    expect(error).toMatch('error');
  }
});
```

### Callbacks

Use the `done` callback to tell Jest when the test is complete:

```javascript
test('the data is peanut butter', done => {
  function callback(error, data) {
    if (error) {
      done(error);
      return;
    }
    try {
      expect(data).toBe('peanut butter');
      done();
    } catch (error) {
      done(error);
    }
  }
  fetchData(callback);
});
```

### .resolves / .rejects

```javascript
test('the data is peanut butter', () => {
  return expect(fetchData()).resolves.toBe('peanut butter');
});

test('the fetch fails with an error', () => {
  return expect(fetchData()).rejects.toMatch('error');
});

// Combined with async/await
test('the data is peanut butter', async () => {
  await expect(fetchData()).resolves.toBe('peanut butter');
});
```

---

## Setup and Teardown

Source: https://jestjs.io/docs/setup-teardown

### Repeating Setup (beforeEach / afterEach)

```javascript
beforeEach(() => {
  initializeCityDatabase();
});

afterEach(() => {
  clearCityDatabase();
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});
```

Async setup:

```javascript
beforeEach(() => {
  return initializeCityDatabase(); // returns a promise
});
```

### One-Time Setup (beforeAll / afterAll)

```javascript
beforeAll(() => {
  return initializeCityDatabase();
});

afterAll(() => {
  return clearCityDatabase();
});
```

### Scoping

Hooks inside `describe` blocks apply only to tests within that block:

```javascript
// Applies to all tests in this file
beforeEach(() => {
  return initializeCityDatabase();
});

describe('matching cities to foods', () => {
  // Applies only to tests in this describe block
  beforeEach(() => {
    return initializeFoodDatabase();
  });

  test('Vienna <3 veal', () => {
    expect(isValidCityFoodPair('Vienna', 'Wiener Schnitzel')).toBe(true);
  });
});
```

### Order of Execution

Jest executes all `describe` handlers first, then runs tests serially:

```
// 1 - beforeAll
// 1 - beforeEach
// 1 - test
// 1 - afterEach
// 2 - beforeAll
// 1 - beforeEach
// 2 - beforeEach
// 2 - test
// 2 - afterEach
// 1 - afterEach
// 2 - afterAll
// 1 - afterAll
```

---

## Mock Functions

Source: https://jestjs.io/docs/mock-functions

### Using a Mock Function

```javascript
const mockFn = jest.fn();

// Mock return values
mockFn.mockReturnValueOnce(10).mockReturnValueOnce('x').mockReturnValue(true);

console.log(mockFn(), mockFn(), mockFn(), mockFn());
// > 10, 'x', true, true
```

### Mocking Modules

```javascript
import axios from 'axios';
import Users from './users';

jest.mock('axios');

test('should fetch users', () => {
  const users = [{ name: 'Bob' }];
  const resp = { data: users };
  axios.get.mockResolvedValue(resp);

  return Users.all().then(data => expect(data).toEqual(users));
});
```

### Mocking Partials

```javascript
import defaultExport, { bar, foo } from '../foo-bar-baz';

jest.mock('../foo-bar-baz', () => {
  const originalModule = jest.requireActual('../foo-bar-baz');
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => 'mocked baz'),
    foo: 'mocked foo',
  };
});

test('should do a partial mock', () => {
  const defaultExportResult = defaultExport();
  expect(defaultExportResult).toBe('mocked baz');
  expect(defaultExport).toHaveBeenCalled();
  expect(foo).toBe('mocked foo');
  expect(bar()).toBe('bar'); // original implementation preserved
});
```

### Mock Implementations

```javascript
const myMockFn = jest
  .fn(() => 'default')
  .mockImplementationOnce(() => 'first call')
  .mockImplementationOnce(() => 'second call');

console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn());
// > 'first call', 'second call', 'default', 'default'
```

### Mock Names

```javascript
const myMockFn = jest
  .fn()
  .mockReturnValue('default')
  .mockImplementation(scalar => 42 + scalar)
  .mockName('add42');
```

### .mock Property

```javascript
const mockFn = jest.fn();
mockFn(1, 2);
mockFn(3, 4);

console.log(mockFn.mock.calls);
// > [[1, 2], [3, 4]]

console.log(mockFn.mock.results);
// > [{ type: 'return', value: undefined }, { type: 'return', value: undefined }]
```

### Custom Matchers for Mocks

```javascript
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith(1, 2);
expect(mockFn).toHaveBeenLastCalledWith(3, 4);
expect(mockFn).toHaveBeenNthCalledWith(1, 1, 2);
expect(mockFn).toHaveReturned();
expect(mockFn).toHaveReturnedTimes(2);
expect(mockFn).toHaveReturnedWith(undefined);
```
