# Jest Skill

> **Jest** — A delightful JavaScript testing framework with a focus on simplicity.
> **Version**: Jest 30.x | **Docs**: [jestjs.io](https://jestjs.io/)

## Quick Reference

| Topic | File | Sections |
|-------|------|----------|
| Getting Started & Core Concepts | `getting-started.md` | Installation, first test, CLI usage, configuration (Babel, TypeScript, bundlers, ESLint), matchers, async testing, setup/teardown, mock functions |
| API Reference | `api.md` | Globals (test, describe, before/after hooks, .each, .concurrent, .failing, .todo), expect matchers, jest object (mock modules, mock functions, fake timers, misc), mock function API, CLI options, configuration options |
| Guides & Advanced | `guides.md` | Snapshot testing, timer mocks, manual mocks, ECMAScript modules, webpack integration, watch plugins, migration guide, testing frameworks (React/Vue/Angular/Express/Next.js), Puppeteer, MongoDB, DynamoDB, architecture |

## Core Concepts

- **Test Runner**: Jest runs tests in parallel with isolated environments for speed and reliability
- **Assertions**: Use `expect()` with matchers like `toBe()`, `toEqual()`, `toContain()`, `toThrow()`
- **Mock Functions**: `jest.fn()` creates mock functions to test code links, capture calls, and configure return values
- **Mock Modules**: `jest.mock()` replaces module dependencies with mocks for isolated testing
- **Snapshot Testing**: Captures serialized output and compares against a reference snapshot file
- **Fake Timers**: `jest.useFakeTimers()` replaces native timer functions for controlled time advancement
- **Code Coverage**: Built-in coverage reporting via `--coverage` flag with Istanbul/V8 providers
- **Watch Mode**: `--watch` re-runs only tests related to changed files for fast development feedback
- **Configuration**: `jest.config.js`, `package.json` "jest" key, or CLI flags; supports projects, transforms, moduleNameMapper
- **Test Environment**: `node` (default) or `jsdom` (browser simulation) or custom environments
- **Parallel Execution**: Worker threads/processes with `--maxWorkers` for optimized CI performance

## Jest Ecosystem

| Library | Description |
|---------|-------------|
| [@jest/globals](https://jestjs.io/docs/api) | Explicit imports for Jest globals (describe, expect, test) |
| [babel-jest](https://github.com/jestjs/jest/tree/main/packages/babel-jest) | Babel integration for transpiling test files |
| [ts-jest](https://github.com/kulshekhar/ts-jest) | TypeScript preprocessor with source map support |
| [@testing-library/react](https://testing-library.com/react) | React testing utilities with Jest |
| [jest-puppeteer](https://github.com/smooth-code/jest-puppeteer) | Jest preset for E2E testing with Puppeteer |
| [jest-environment-jsdom](https://github.com/jestjs/jest/tree/main/packages/jest-environment-jsdom) | Browser-like DOM environment for Jest |
| [eslint-plugin-jest](https://github.com/jest-community/eslint-plugin-jest) | ESLint plugin with Jest-specific rules |
| [identity-obj-proxy](https://github.com/keyanzhang/identity-obj-proxy) | Mock CSS modules in Jest |
| [Vitest](https://vitest.dev/) | Vite-native alternative with Jest-compatible API |

## Common Patterns

```javascript
// Basic test
test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

// Grouping with describe
describe('User service', () => {
  beforeEach(() => setupDatabase());

  test('creates user', async () => {
    const user = await createUser({ name: 'Alice' });
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Alice');
  });
});

// Mocking modules
jest.mock('axios');
test('fetches data', async () => {
  axios.get.mockResolvedValue({ data: { name: 'Bob' } });
  const result = await fetchData();
  expect(result.name).toBe('Bob');
});

// Snapshot testing
it('renders correctly', () => {
  const { container } = render(<Link href="http://example.com">Link</Link>);
  expect(container.firstChild).toMatchSnapshot();
});
```

## Sources

- Official Jest documentation: https://jestjs.io/docs/getting-started
- Jest API reference: https://jestjs.io/docs/api
- Jest configuration: https://jestjs.io/docs/configuration
- Jest CLI options: https://jestjs.io/docs/cli
- Jest GitHub: https://github.com/jestjs/jest
