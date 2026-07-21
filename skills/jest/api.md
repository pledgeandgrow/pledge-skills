# Jest — API Reference

> Source: https://jestjs.io/docs/api

---

## Globals

Jest injects these methods and objects into the global environment. You can also import them explicitly from `@jest/globals`.

### Hooks

#### afterAll(fn, timeout)

Runs after all tests in a file. If inside a `describe` block, runs after all tests in that block.

```javascript
afterAll(() => {
  clearDatabase();
});

// Async
afterAll(async () => {
  await clearDatabase();
});

// With timeout
afterAll(() => clearDatabase(), 10000);
```

#### afterEach(fn, timeout)

Runs after each test.

```javascript
afterEach(() => {
  clearMocks();
});
```

#### beforeAll(fn, timeout)

Runs before all tests in a file or `describe` block.

```javascript
beforeAll(() => {
  initializeDatabase();
});
```

#### beforeEach(fn, timeout)

Runs before each test.

```javascript
beforeEach(() => {
  resetState();
});
```

### describe(name, fn)

Groups related tests.

```javascript
describe('User service', () => {
  test('creates user', () => {});
  test('deletes user', () => {});
});
```

**Aliases**: `describe.only`, `describe.skip`, `describe.each`

```javascript
// Only run this describe block
describe.only('critical tests', () => { ... });

// Skip this describe block
describe.skip('flaky tests', () => { ... });

// Data-driven tests
describe.each([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3],
])('.add(%i, %i)', (a, b, expected) => {
  test(`returns ${expected}`, () => {
    expect(a + b).toBe(expected);
  });
});

// Tagged template syntax
describe.each`
  a    | b    | expected
  ${1} | ${1} | ${2}
  ${1} | ${2} | ${3}
`('$a + $b', ({ a, b, expected }) => {
  test(`returns ${expected}`, () => {
    expect(a + b).toBe(expected);
  });
});
```

### test(name, fn, timeout)

The core test function. **Alias**: `it(name, fn, timeout)`

```javascript
test('did not rain', () => {
  expect(inchesOfRain()).toBe(0);
});

// With timeout
test('slow operation', () => {
  // ...
}, 10000);
```

**Variants**:

| Method | Description |
|--------|-------------|
| `test.only(name, fn, timeout)` | Run only this test |
| `test.skip(name, fn)` | Skip this test |
| `test.todo(name)` | Plan a test (not implemented yet) |
| `test.concurrent(name, fn, timeout)` | Run test concurrently |
| `test.failing(name, fn, timeout)` | Expected to fail — passes if test fails |
| `test.each(table)(name, fn, timeout)` | Data-driven testing |
| `test.only.each(table)(name, fn)` | Run only these data-driven tests |
| `test.skip.each(table)(name, fn)` | Skip these data-driven tests |

```javascript
// test.todo
test.todo('need to write test for edge case');

// test.concurrent
test.concurrent('async test', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});

// test.failing — test that should fail
test.failing('this will pass if the test fails', () => {
  expect(1).toBe(2); // fails, so test.failing passes
});

// test.each
test.each([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3],
])('.add(%i, %i) = %i', (a, b, expected) => {
  expect(a + b).toBe(expected);
});

// Tagged template
test.each`
  a    | b    | expected
  ${1} | ${1} | ${2}
  ${1} | ${2} | ${3}
`('returns $expected when $a + $b', ({ a, b, expected }) => {
  expect(a + b).toBe(expected);
});
```

---

## Expect

Source: https://jestjs.io/docs/expect

### expect(value)

Creates an assertion. The `expect` function is typically used with a matcher.

```javascript
expect(2 + 2).toBe(4);
```

### Modifiers

| Modifier | Description |
|----------|-------------|
| `.not` | Negates the matcher |
| `.resolves` | Unwraps a resolved promise |
| `.rejects` | Unwraps a rejected promise |

```javascript
expect(1).not.toBe(2);
await expect(Promise.resolve('ok')).resolves.toBe('ok');
await expect(Promise.reject('err')).rejects.toBe('err');
```

### Matchers

#### Equality

| Matcher | Description |
|---------|-------------|
| `.toBe(value)` | Exact equality (Object.is) |
| `.toEqual(value)` | Deep equality (recursive) |
| `.toStrictEqual(value)` | Strict deep equality (includes undefined) |

#### Truthiness

| Matcher | Description |
|---------|-------------|
| `.toBeNull()` | Is `null` |
| `.toBeUndefined()` | Is `undefined` |
| `.toBeDefined()` | Is not `undefined` |
| `.toBeTruthy()` | Is truthy |
| `.toBeFalsy()` | Is falsy |
| `.toBeNaN()` | Is `NaN` |

#### Numbers

| Matcher | Description |
|---------|-------------|
| `.toBeGreaterThan(number \| bigint)` | `>` |
| `.toBeGreaterThanOrEqual(number \| bigint)` | `>=` |
| `.toBeLessThan(number \| bigint)` | `<` |
| `.toBeLessThanOrEqual(number \| bigint)` | `<=` |
| `.toBeCloseTo(number, numDigits?)` | Floating point approximate equality |

#### Strings

| Matcher | Description |
|---------|-------------|
| `.toMatch(regexp \| string)` | Matches a regex or string |

#### Arrays/Iterables

| Matcher | Description |
|---------|-------------|
| `.toContain(item)` | Contains item (uses includes) |
| `.toContainEqual(item)` | Contains item (deep equality) |
| `.toHaveLength(number)` | Has specific length |

#### Objects

| Matcher | Description |
|---------|-------------|
| `.toHaveProperty(keyPath, value?)` | Has property at path with optional value |
| `.toMatchObject(object)` | Matches subset of object properties |
| `.toBeInstanceOf(Class)` | Is instance of class |

#### Mocks

| Matcher | Description |
|---------|-------------|
| `.toHaveBeenCalled()` | Was called at least once |
| `.toHaveBeenCalledTimes(number)` | Was called exactly N times |
| `.toHaveBeenCalledWith(arg1, arg2, ...)` | Was called with specific args |
| `.toHaveBeenLastCalledWith(arg1, arg2, ...)` | Last call had specific args |
| `.toHaveBeenNthCalledWith(nthCall, arg1, arg2, ...)` | Nth call had specific args |
| `.toHaveReturned()` | Returned at least once |
| `.toHaveReturnedTimes(number)` | Returned exactly N times |
| `.toHaveReturnedWith(value)` | Returned specific value |
| `.toHaveLastReturnedWith(value)` | Last return was specific value |
| `.toHaveNthReturnedWith(nthCall, value)` | Nth return was specific value |

#### Snapshots

| Matcher | Description |
|---------|-------------|
| `.toMatchSnapshot(propertyMatchers?, hint?)` | Matches stored snapshot file |
| `.toMatchInlineSnapshot(propertyMatchers?, inlineSnapshot)` | Matches inline snapshot |

#### Exceptions

| Matcher | Description |
|---------|-------------|
| `.toThrow(error?)` | Throws an error |
| `.toThrowErrorMatchingSnapshot(hint?)` | Throws error matching snapshot |
| `.toThrowErrorMatchingInlineSnapshot(inlineSnapshot)` | Throws error matching inline snapshot |

### Asymmetric Matchers

```javascript
// Any value except null/undefined
expect.anything()

// Any value of a specific type
expect.any(Function)
expect.any(Number)
expect.any(String)
expect.any(Object)
expect.any(Array)

// Array containing items
expect.arrayContaining([1, 2, 3])

// Object containing keys
expect.objectContaining({ name: 'Alice' })

// String matching pattern
expect.stringMatching(/^A/)

// String containing substring
expect.stringContaining('hello')

// Array of specific values
expect.arrayOf(expect.any(Number))

// Close to a number
expect.closeTo(0.3, 5)

// Negated asymmetric matchers
expect.not.arrayContaining([4])
expect.not.objectContaining({ age: 99 })
expect.not.stringMatching(/error/)
expect.not.stringContaining('error')
expect.not.arrayOf(expect.any(String))
```

### Assertion Count

```javascript
// Verify exactly N assertions were called
expect.assertions(2);

// Verify at least one assertion was called
expect.hasAssertions();
```

### Extend Utilities

```javascript
// Custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    }
    return {
      message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
      pass: false,
    };
  },
});

// Usage
expect(5).toBeWithinRange(1, 10);

// Add equality testers
expect.addEqualityTesters([
  (a, b) => {
    // custom equality logic
    return undefined; // return true/false/undefined
  },
]);

// Add snapshot serializer
expect.addSnapshotSerializer({
  serialize(val, config, indentation, depth, refs, printer) {
    return `Custom: ${val}`;
  },
  test(val) {
    return val && val._isCustom;
  },
});
```

---

## The Jest Object

Source: https://jestjs.io/docs/jest-object

### Mock Modules

| Method | Description |
|--------|-------------|
| `jest.mock(moduleName, factory, options)` | Mock a module |
| `jest.unmock(moduleName)` | Unmock a module |
| `jest.doMock(moduleName, factory, options)` | Mock module (for dynamic imports) |
| `jest.dontMock(moduleName)` | Unmock module (for dynamic imports) |
| `jest.createMockFromModule(moduleName)` | Create a mock from module shape |
| `jest.requireActual(moduleName)` | Get the actual (unmocked) module |
| `jest.requireMock(moduleName)` | Get the mock module |
| `jest.disableAutomock()` | Disable auto-mocking |
| `jest.enableAutomock()` | Enable auto-mocking |
| `jest.resetModules()` | Reset module registry |
| `jest.isolateModules(fn)` | Isolate module registry for a callback |
| `jest.isolateModulesAsync(fn)` | Async version of isolateModules |
| `jest.setMock(moduleName, moduleExports)` | Set a module's exports |
| `jest.deepUnmock(moduleName)` | Deep unmock a module |
| `jest.onGenerateMock(cb)` | Callback for mock generation |
| `jest.mocked(source, options?)` | Type-safe mock assertion helper |
| `jest.Mocked<Source>` | TypeScript type for mocked module |

```javascript
// Mock a module with factory
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
}));

// Partial mock with requireActual
jest.mock('../utils', () => {
  const actual = jest.requireActual('../utils');
  return { ...actual, formatDate: jest.fn(() => 'mocked-date') };
});

// Reset modules between tests
beforeEach(() => {
  jest.resetModules();
});
```

### Mock Functions

| Method | Description |
|--------|-------------|
| `jest.fn(implementation?)` | Create a mock function |
| `jest.isMockFunction(fn)` | Check if function is a mock |
| `jest.spyOn(object, methodName)` | Spy on a method |
| `jest.spyOn(object, methodName, accessType?)` | Spy on getter/setter |
| `jest.replaceProperty(object, propertyKey, value)` | Replace object property |
| `jest.clearAllMocks()` | Clear all mock calls/instances |
| `jest.resetAllMocks()` | Reset all mocks (clear + remove implementation) |
| `jest.restoreAllMocks()` | Restore all spies to original implementation |

```javascript
// Create mock function
const mockFn = jest.fn((x) => x * 2);

// Spy on method
const spy = jest.spyOn(console, 'log');
spy.mockImplementation(() => {});

// Spy on getter
jest.spyOn(obj, 'value', 'get');

// Replace property
const replaced = jest.replaceProperty(config, 'apiKey', 'test-key');
// later:
replaced.restore();
```

### Fake Timers

| Method | Description |
|--------|-------------|
| `jest.useFakeTimers(fakeTimersConfig?)` | Enable fake timers |
| `jest.useRealTimers()` | Restore real timers |
| `jest.runAllTimers()` | Run all pending timers |
| `jest.runAllTimersAsync()` | Async version of runAllTimers |
| `jest.runAllTicks()` | Run all microtasks |
| `jest.runAllImmediates()` | Run all setImmediate callbacks |
| `jest.advanceTimersByTime(msToRun)` | Advance time by ms |
| `jest.advanceTimersByTimeAsync(msToRun)` | Async version |
| `jest.runOnlyPendingTimers()` | Run only currently pending timers |
| `jest.runOnlyPendingTimersAsync()` | Async version |
| `jest.advanceTimersToNextTimer(steps)` | Advance to next timer |
| `jest.advanceTimersToNextTimerAsync(steps)` | Async version |
| `jest.advanceTimersToNextFrame()` | Advance to next animation frame |
| `jest.clearAllTimers()` | Clear all pending timers |
| `jest.getTimerCount()` | Get number of pending timers |
| `jest.now()` | Get current fake time |
| `jest.setSystemTime(now?)` | Set the system time |
| `jest.setTimerTickMode(mode)` | Set timer tick mode |
| `jest.getRealSystemTime()` | Get real system time |

```javascript
jest.useFakeTimers();

test('calls callback after 1 second', () => {
  const callback = jest.fn();
  setTimeout(callback, 1000);

  expect(callback).not.toHaveBeenCalled();
  jest.advanceTimersByTime(1000);
  expect(callback).toHaveBeenCalled();
});

// Configure fake timers
jest.useFakeTimers({
  now: new Date('2024-01-01'),
  doNotFake: ['performance'],
  timerLimit: 1000,
});
```

### Misc

| Method | Description |
|--------|-------------|
| `jest.getSeed()` | Get the random seed |
| `jest.isEnvironmentTornDown()` | Check if environment is torn down |
| `jest.retryTimes(numRetries, options?)` | Set retry count for failed tests |
| `jest.setTimeout(timeout)` | Set default test timeout |

```javascript
jest.retryTimes(3);
jest.setTimeout(10000); // 10 second default timeout
```

---

## Mock Function API

Source: https://jestjs.io/docs/mock-function-api

### .mock Property

```javascript
const mockFn = jest.fn();
mockFn('first', 'second');

mockFn.mock.calls;       // [['first', 'second']]
mockFn.mock.results;     // [{ type: 'return', value: undefined }]
mockFn.mock.instances;   // [MockFunction{}] (for `new` calls)
mockFn.mock.contexts;    // [this context for each call]
mockFn.mock.lastCall;    // ['first', 'second']
```

### Methods

| Method | Description |
|--------|-------------|
| `mockFn.getMockImplementation()` | Get the implementation function |
| `mockFn.getMockName()` | Get the mock name |
| `mockFn.mockClear()` | Clear calls/instances (keep implementation) |
| `mockFn.mockReset()` | Clear everything (remove implementation) |
| `mockFn.mockRestore()` | Restore original (spies only) |
| `mockFn.mockImplementation(fn)` | Set implementation |
| `mockFn.mockImplementationOnce(fn)` | Set next implementation |
| `mockFn.mockName(name)` | Set mock name |
| `mockFn.mockReturnThis()` | Return `this` for chaining |
| `mockFn.mockReturnValue(value)` | Set return value |
| `mockFn.mockReturnValueOnce(value)` | Set next return value |
| `mockFn.mockResolvedValue(value)` | Set resolved promise value |
| `mockFn.mockResolvedValueOnce(value)` | Set next resolved value |
| `mockFn.mockRejectedValue(value)` | Set rejected promise value |
| `mockFn.mockRejectedValueOnce(value)` | Set next rejected value |
| `mockFn.withImplementation(fn, callback)` | Temporarily use implementation |

```javascript
// mockReturnValue chain
const fn = jest.fn();
fn.mockReturnValue('default')
  .mockReturnValueOnce('first')
  .mockReturnValueOnce('second');

console.log(fn(), fn(), fn()); // 'first', 'second', 'default'

// mockResolvedValue
const asyncFn = jest.fn();
asyncFn.mockResolvedValue({ data: 'mocked' });

// withImplementation (temporary)
const mockFn = jest.fn(() => 'original');
mockFn.withImplementation(
  () => 'temporary',
  () => {
    // mockFn returns 'temporary' here
    expect(mockFn()).toBe('temporary');
  }
);
// mockFn returns 'original' again
```

### Replaced Properties

| Method | Description |
|--------|-------------|
| `replacedProperty.replaceValue(value)` | Replace the value |
| `replacedProperty.restore()` | Restore original value |

### TypeScript Usage

```typescript
// Typed mock function
const mockFn = jest.fn<(x: number) => number>();
mockFn.mockImplementation((x) => x * 2);

// Typed mock module
jest.mock('./userService');
const userService = jest.mocked(await import('./userService'));

// Spy types
const spy: jest.Spied<typeof obj> = jest.spyOn(obj, 'method');
```

---

## CLI Options

Source: https://jestjs.io/docs/cli

CLI options take precedence over configuration file values.

### Common Options

| Option | Description |
|--------|-------------|
| `jest <regexForTestFiles>` | Run tests matching pattern |
| `--bail[=<n>]` | Stop after N failures |
| `--cache` | Enable/disable cache |
| `--ci` | Run in CI mode |
| `--clearCache` | Clear Jest cache |
| `--clearMocks` | Clear mock calls before each test |
| `--collectCoverageFrom=<glob>` | Specify coverage collection |
| `--colors` | Force colored output |
| `--config=<path>` | Path to config file |
| `--coverage[=<boolean>]` | Collect coverage |
| `--coverageDirectory=<path>` | Coverage output directory |
| `--coverageProvider=<provider>` | `babel` or `v8` |
| `--debug` | Print debug info |
| `--detectOpenHandles` | Detect open handles |
| `--env=<environment>` | Test environment (node, jsdom) |
| `--errorOnDeprecated` | Error on deprecated APIs |
| `--expand` | Expand coverage diffs |
| `--findRelatedTests <files>` | Find tests related to source files |
| `--forceExit` | Force exit after tests |
| `--json` | Output JSON results |
| `--listTests` | List all test files |
| `--maxWorkers=<num>\|<string>` | Max worker threads |
| `--notify` | OS notification on completion |
| `--onlyChanged` | Run only changed files |
| `--onlyFailures` | Run only failed tests |
| `--outputFile=<filename>` | Write results to file |
| `--passWithNoTests` | Don't fail if no tests found |
| `--randomize` | Randomize test order |
| `--reporters` | Specify reporters |
| `--resetMocks` | Reset mocks before each test |
| `--restoreMocks` | Restore mocks before each test |
| `--runInBand` | Run tests serially in same process |
| `--runTestsByPath` | Run tests by exact path |
| `--seed=<num>` | Set random seed |
| `--selectProjects <projects>` | Run specific projects |
| `--shard` | Split test run into shards |
| `--showConfig` | Print resolved config |
| `--silent` | Suppress console output |
| `--testNamePattern=<regex>` | Run tests matching name pattern |
| `--testPathIgnorePatterns=<regex>` | Ignore test paths |
| `--testPathPatterns=<regex>` | Test path patterns |
| `--testTimeout=<number>` | Default test timeout (ms) |
| `--updateSnapshot` | Update snapshots |
| `--verbose` | Verbose output |
| `--version` | Print version |
| `--watch` | Watch mode (changed files) |
| `--watchAll` | Watch mode (all files) |
| `--watchman` | Use watchman for file watching |
| `--workerThreads` | Use worker threads |
| `--maxConcurrency=<num>` | Max concurrent tests |
| `--logHeapUsage` | Log memory usage |
| `--noStackTrace` | Disable stack traces |
| `--useStderr` | Output to stderr |
| `--changedSince=<branch>` | Run tests changed since branch |
| `--changedFilesWithAncestor` | Run tests changed since last commit |
| `--lastCommit` | Run tests changed in last commit |
| `--ignoreProjects <projects>` | Ignore specific projects |
| `--injectGlobals` | Inject globals (default true) |
| `--openHandlesTimeout=<ms>` | Timeout for open handles detection |
| `--projects <paths>` | Run specific project paths |
| `--setupFilesAfterEnv <paths>` | Setup files after environment |
| `--testEnvironmentOptions=<json>` | Test environment options |
| `--testLocationInResults` | Include test location in results |
| `--testMatch <globs>` | Test file glob patterns |
| `--testRunner=<path>` | Test runner path |
| `--testSequencer=<path>` | Test sequencer path |
| `--waitForUnhandledRejections` | Wait for unhandled rejections |
| `--workerGracefulExitTimeout=<num>` | Graceful exit timeout for workers |

---

## Configuration Options

Source: https://jestjs.io/docs/configuration

### Key Configuration Options

```javascript
// jest.config.js
const config = {
  // Basic
  testEnvironment: 'node', // or 'jsdom'
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  testPathIgnorePatterns: ['/node_modules/'],
  testRegex: '.*\\.test\\.(js|ts)$',

  // Coverage
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{js,ts}', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8', // or 'babel'
  coverageReporters: ['text', 'lcov', 'clover'],
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },

  // Modules
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  moduleDirectories: ['node_modules', 'src'],

  // Transforms
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/', '\\.pnp\\.[^\\/]+$'],

  // Setup
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setupAfterEnv.js'],

  // Mocks
  clearMocks: true,
  resetMocks: false,
  restoreMocks: false,

  // Timers
  fakeTimers: {
    enableGlobally: false,
  },

  // Projects (monorepo)
  projects: [
    '<rootDir>/packages/server',
    '<rootDir>/packages/client',
  ],

  // Watch
  watchPathIgnorePatterns: ['/node_modules/'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],

  // Workers
  maxWorkers: '50%',
  workerThreads: false,
  workerIdleMemoryLimit: 0,

  // Misc
  verbose: false,
  bail: 0,
  cache: true,
  cacheDirectory: '/tmp/jest_cache',
  displayName: 'my-project',
  errorOnDeprecated: false,
  globals: {
    __DEV__: true,
  },
  globalSetup: '<rootDir>/jest.globalSetup.js',
  globalTeardown: '<rootDir>/jest.globalTeardown.js',
  preset: 'ts-jest',
  reporters: ['default', 'jest-junit'],
  resetModules: false,
  rootDir: '.',
  runtime: 'jest-runtime',
  runner: 'jest-runner',
  sandboxInjectedGlobals: [],
  slowTestThreshold: 5,
  snapshotFormat: { escapeString: false, printBasicPrototype: false },
  snapshotSerializers: ['my-serializer-module'],
  testFailureExitCode: 1,
  testResultsProcessor: 'jest-junit',
  testRunner: 'jest-circus/runner',
  testSequencer: '@jest/test-sequencer',
  testTimeout: 5000,
  notify: false,
  notifyMode: 'failure-change',
  openHandlesTimeout: 1000,
  maxConcurrency: 5,
  randomize: false,
  showSeed: false,
  unmockedModulePathPatterns: [],
  waitForUnhandledRejections: false,
  workerGracefulExitTimeout: 1000,
  injectGlobals: true,
  haste: {},
  automock: false,
  dependencyExtractor: undefined,
  extensionsToTreatAsEsm: ['.ts'],
  forceCoverageMatch: [],
  modulePathIgnorePatterns: [],
  modulePaths: [],
  prettierPath: 'prettier',
  resolver: undefined,
  snapshotResolver: undefined,
};

module.exports = config;
```
