# Jest — Guides & Advanced Topics

---

## Snapshot Testing

Source: https://jestjs.io/docs/snapshot-testing

Snapshot tests render a component, take a snapshot, then compare it to a reference snapshot file stored alongside the test.

### Basic Usage

```javascript
import { render } from '@testing-library/react';
import Link from '../Link';

it('renders correctly', () => {
  const { container } = render(
    <Link page="http://www.facebook.com">Facebook</Link>,
  );
  expect(container.firstChild).toMatchSnapshot();
});
```

The first run creates a snapshot file (`__snapshots__/link.test.js.snap`):

```javascript
exports[`renders correctly 1`] = `<a href="http://www.facebook.com">Facebook</a>`;
```

On subsequent runs, Jest compares the rendered output with the stored snapshot.

### Updating Snapshots

```bash
# Update all outdated snapshots
jest --updateSnapshot

# Interactive snapshot mode (watch mode)
jest --watch
# Press 'u' to update failing snapshots
```

### Inline Snapshots

```javascript
it('renders correctly', () => {
  expect(container.firstChild).toMatchInlineSnapshot();
});
```

The snapshot is written directly into the test file instead of a separate `.snap` file.

### Property Matchers

Use asymmetric matchers for dynamic values in snapshots:

```javascript
it('renders with dynamic date', () => {
  expect(component).toMatchSnapshot({
    createdAt: expect.any(Date),
    id: expect.any(String),
  });
});
```

### Best Practices

1. **Treat snapshots as code** — Commit and review snapshot files
2. **Tests should be deterministic** — Don't use random/time-based data without mocking
3. **Use descriptive snapshot names** — `toMatchSnapshot('renders user profile')`
4. **Don't over-snapshot** — Use for serializable output, not logic
5. **Review snapshots in code review** — Ensure changes are intentional

### FAQ

- **Snapshots are auto-written on CI?** No, Jest fails on missing snapshots in CI mode
- **Should snapshot files be committed?** Yes, they should be reviewed alongside code
- **Only for React?** No, any serializable value can be snapshotted
- **Replaces unit testing?** No, it complements other testing strategies

---

## Timer Mocks

Source: https://jestjs.io/docs/timer-mocks

Replace native timer functions (`setTimeout`, `setInterval`, `clearTimeout`, `clearInterval`) to control time in tests.

### Enable Fake Timers

```javascript
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});
```

### Run All Timers

```javascript
jest.useFakeTimers();

test('calls the callback after 1 second', () => {
  const callback = jest.fn();
  timerGame(callback);

  expect(callback).not.toHaveBeenCalled();

  // Fast-forward until all timers have been executed
  jest.runAllTimers();

  expect(callback).toHaveBeenCalled();
  expect(callback).toHaveBeenCalledTimes(1);
});
```

### Run Pending Timers

For recursive timers, use `runOnlyPendingTimers` to run only the currently pending ones:

```javascript
test('runs pending timers only', () => {
  jest.useFakeTimers();
  const callback = jest.fn();

  recursiveTimer(callback);

  jest.runOnlyPendingTimers();
  expect(callback).toHaveBeenCalledTimes(1);

  jest.runOnlyPendingTimers();
  expect(callback).toHaveBeenCalledTimes(2);
});
```

### Advance Timers by Time

```javascript
test('advances timers by time', () => {
  jest.useFakeTimers();
  const callback = jest.fn();

  setTimeout(callback, 1000);

  jest.advanceTimersByTime(500);
  expect(callback).not.toHaveBeenCalled();

  jest.advanceTimersByTime(500);
  expect(callback).toHaveBeenCalled();
});
```

### Advance Timers to Next Frame

```javascript
jest.useFakeTimers();

test('animation frame', () => {
  const cb = jest.fn();
  requestAnimationFrame(cb);

  jest.advanceTimersToNextFrame();
  expect(cb).toHaveBeenCalled();
});
```

### Selective Faking

```javascript
jest.useFakeTimers({
  doNotFake: ['setInterval', 'clearInterval'],
});
```

### Spying on Timers

```javascript
jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

test('waits 1 second', () => {
  timerGame();
  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
});
```

---

## Manual Mocks

Source: https://jestjs.io/docs/manual-mocks

Manual mocks stub out functionality with mock data for fast, non-flaky tests.

### Mocking User Modules

Create a `__mocks__` directory adjacent to the module:

```
src/
  utils/
    __mocks__/
      database.js    # Manual mock for database.js
    database.js      # Real implementation
```

```javascript
// src/utils/__mocks__/database.js
const mockData = { users: [{ id: 1, name: 'Alice' }] };

module.exports = {
  query: jest.fn(() => Promise.resolve(mockData)),
  connect: jest.fn(),
  disconnect: jest.fn(),
};
```

```javascript
// In test file
jest.mock('./database');

test('queries users', async () => {
  const db = require('./database');
  const users = await db.query('SELECT * FROM users');
  expect(users).toHaveLength(1);
});
```

### Mocking Node Modules

Create `__mocks__` at the project root (not adjacent):

```
project/
  __mocks__/
    fs.js           # Mock for Node's fs module
  src/
  package.json
```

```javascript
// __mocks__/fs.js
const path = require('path');
const fs = jest.requireActual('fs');

const mockFiles = {};
module.exports = {
  ...fs,
  readFile: jest.fn((filePath, cb) => {
    cb(null, mockFiles[filePath] || '');
  }),
  writeFile: jest.fn((filePath, content, cb) => {
    mockFiles[filePath] = content;
    cb(null);
  }),
};
```

### Mocking Methods Not in JSDOM

```javascript
// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

---

## ECMAScript Modules (ESM)

Source: https://jestjs.io/docs/ecmascript-modules

Jest has experimental ESM support.

### Enabling ESM

1. Disable code transforms or configure transformer to emit ESM:

```javascript
// jest.config.js
module.exports = {
  transform: {},
};
```

2. Run Node with `--experimental-vm-modules`:

```bash
# Direct
node --experimental-vm-modules node_modules/jest/bin/jest.js

# Via npx
NODE_OPTIONS="$NODE_OPTIONS --experimental-vm-modules" npx jest

# Windows (use cross-env)
cross-env NODE_OPTIONS="--experimental-vm-modules" npx jest

# Yarn
yarn node --experimental-vm-modules $(yarn bin jest)
```

3. Follow Node's ESM activation logic (`type: "module"` in `package.json` or `.mjs` files)

4. Configure extensions to treat as ESM:

```javascript
module.exports = {
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};
```

### Differences Between ESM and CJS

| Feature | CJS | ESM |
|---------|-----|-----|
| Module mocking | `jest.mock()` | Limited support |
| `require()` | Available | Not available |
| `__dirname`/`__filename` | Available | Not available |
| Module resolution | CJS algorithm | ESM algorithm |

### Module Mocking in ESM

```javascript
// ESM mock with factory
jest.mock('axios', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));
```

### Module Unmocking in ESM

```javascript
jest.unmock('axios');
```

---

## Using with Webpack

Source: https://jestjs.io/docs/webpack

### Handling Static Assets

```javascript
// jest.config.js
module.exports = {
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
  },
};
```

```javascript
// __mocks__/fileMock.js
module.exports = 'test-file-stub';

// __mocks__/styleMock.js
module.exports = {};
```

### Mocking CSS Modules

```bash
npm install --save-dev identity-obj-proxy
```

```javascript
module.exports = {
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
};
```

### Custom File Transform

```javascript
// fileTransformer.js
const path = require('path');

module.exports = {
  process(sourceText, sourcePath, options) {
    return {
      code: `module.exports = ${JSON.stringify(path.basename(sourcePath))};`,
    };
  },
};
```

```javascript
module.exports = {
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  transform: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/fileTransformer.js',
  },
};
```

---

## Watch Plugins

Source: https://jestjs.io/docs/watch-plugins

The watch plugin system allows hooking into Jest's watch mode with custom menu prompts.

### Watch Plugin Interface

```javascript
class MyWatchPlugin {
  constructor({ config, stdin, stdout }) {
    this._config = config;
    this._stdin = stdin;
    this._stdout = stdout;
  }

  // Hook into Jest events
  apply(jestHooks) {
    jestHooks.onFileChange(({ projects }) => {
      this._projects = projects;
    });
    jestHooks.shouldRunTestSuiteForPath(path) {
      return true; // or false to skip
    }
  }

  // Menu integration
  getUsageInfo(globalConfig) {
    return {
      key: 'm', // key to press
      prompt: 'run my custom command',
    };
  }

  // Run when key is pressed
  async run(globalConfig, updateConfigAndRun) {
    this._stdout.write('Custom action triggered\n');
    // Optionally restart tests
    updateConfigAndRun({ testPathPattern: 'custom' });
  }
}

module.exports = MyWatchPlugin;
```

### Configuration

```javascript
// jest.config.js
module.exports = {
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
    ['my-watch-plugin', { customOption: true }],
  ],
};
```

### Choosing a Key

- Avoid keys already in use (`a`, `f`, `o`, `p`, `q`, `t`, `u`, `w`, `Enter`)
- Use lowercase letters or special characters
- When conflicts happen, Jest displays both plugins' prompts

---

## Migration Guide

Source: https://jestjs.io/docs/migration-guide

### jest-codemods

Use [jest-codemods](https://github.com/skovhus/jest-codemods) to automatically migrate from other test frameworks:

```bash
# Migrate from Jasmine/Mocha/Jasmine
npx jest-codemods

# Specify transformer
npx jest-codemods --transform=jasmine
```

### Common Migration Steps

1. **Install Jest**: `npm install --save-dev jest`
2. **Update test script**: `"test": "jest"`
3. **Rename test files**: `*.spec.js` → `*.test.js` (or configure `testMatch`)
4. **Update imports**: Replace framework-specific imports with Jest globals
5. **Update assertions**: `expect(x).to.equal(y)` → `expect(x).toBe(y)`
6. **Update mocks**: `sinon.stub()` → `jest.fn()` / `jest.spyOn()`
7. **Run codemods**: `npx jest-codemods`

### Assertion Mapping

| Mocha/Chai | Jest |
|------------|------|
| `expect(x).to.equal(y)` | `expect(x).toBe(y)` |
| `expect(x).to.eql(y)` | `expect(x).toEqual(y)` |
| `expect(x).to.be.ok` | `expect(x).toBeTruthy()` |
| `expect(fn).to.throw()` | `expect(fn).toThrow()` |
| `sinon.stub(obj, 'method')` | `jest.spyOn(obj, 'method')` |
| `sinon.spy()` | `jest.fn()` |

---

## Testing Web Frameworks

Source: https://jestjs.io/docs/testing-frameworks

### React

- [Testing React with Jest and React Testing Library](https://testing-library.com/react)
- [Jest + React tutorial](https://jestjs.io/docs/tutorial-react)

```javascript
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### Vue.js

- [Vue Test Utils](https://vue-test-utils.vuejs.org/)
- [vue-jest](https://github.com/vuejs/vue-jest)

### Angular

- [Jest preset for Angular](https://github.com/thymikee/jest-preset-angular)

### Express.js

```javascript
const request = require('supertest');
const app = require('../app');

test('GET /api/users returns 200', async () => {
  const response = await request(app).get('/api/users');
  expect(response.statusCode).toBe(200);
  expect(response.body).toBeInstanceOf(Array);
});
```

### Next.js

- [Jest with Next.js](https://nextjs.org/docs/pages/building-your-application/testing/jest)

### NestJS

- [Testing NestJS with Jest](https://docs.nestjs.com/fundamentals/testing)

---

## Using with Puppeteer

Source: https://jestjs.io/docs/puppeteer

### Using jest-puppeteer Preset

```bash
npm install --save-dev jest-puppeteer puppeteer
```

```javascript
// jest.config.js
module.exports = {
  preset: 'jest-puppeteer',
};
```

```javascript
describe('Google', () => {
  beforeAll(async () => {
    await page.goto('https://google.com');
  });

  it('should display "google" text on page', async () => {
    await expect(page).toMatch('google');
  });
});
```

### Custom Example without Preset

```javascript
const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
});

afterAll(async () => {
  await browser.close();
});

test('loads page', async () => {
  await page.goto('http://localhost:3000');
  const title = await page.title();
  expect(title).toBe('My App');
});
```

---

## Using with MongoDB

Source: https://jestjs.io/docs/mongodb

### Using jest-mongodb Preset

```bash
npm install --save-dev @shelf/jest-mongodb
```

```javascript
// jest.config.js
module.exports = {
  preset: '@shelf/jest-mongodb',
};
```

```javascript
const { MongoClient } = require('mongodb');

describe('insert', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
    });
    db = await connection.db(global.__MONGO_DB_NAME__);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should insert a doc into collection', async () => {
    const users = db.collection('users');
    const mockUser = { _id: 'someUserId', name: 'Alice' };
    await users.insertOne(mockUser);

    const insertedUser = await users.findOne({ _id: 'someUserId' });
    expect(insertedUser).toEqual(mockUser);
  });
});
```

---

## Using with DynamoDB

Source: https://jestjs.io/docs/dynamodb

### Using jest-dynamodb Preset

```bash
npm install --save-dev @shelf/jest-dynamodb
```

```javascript
// jest.config.js
module.exports = {
  preset: '@shelf/jest-dynamodb',
};
```

```javascript
const { DocumentClient } = require('aws-sdk/clients/dynamodb');

describe('DynamoDB operations', () => {
  const docClient = new DocumentClient({
    endpoint: 'http://localhost:8000',
    region: 'local-env',
  });

  it('should put item', async () => {
    await docClient.put({
      TableName: 'users',
      Item: { id: '1', name: 'Alice' },
    }).promise();

    const { Item } = await docClient.get({
      TableName: 'users',
      Key: { id: '1' },
    }).promise();

    expect(Item).toEqual({ id: '1', name: 'Alice' });
  });
});
```

---

## Architecture

Source: https://jestjs.io/docs/architecture

Jest is built as a monorepo with multiple reusable packages:

| Package | Description |
|---------|-------------|
| `jest` | Core CLI and runner |
| `jest-cli` | Command-line interface |
| `jest-config` | Configuration handling |
| `jest-runner` | Test runner |
| `jest-test-runner` | Default test runner |
| `jest-environment-node` | Node.js test environment |
| `jest-environment-jsdom` | Browser-like (JSDOM) environment |
| `jest-jasmine2` | Legacy Jasmine-based runner |
| `jest-circus` | Default test runner (replaces jasmine2) |
| `jest-mock` | Mock function implementation |
| `jest-haste-map` | Module dependency graph |
| `jest-resolve` | Module resolution |
| `jest-runtime` | Test runtime environment |
| `jest-worker` | Parallel test execution |
| `jest-snapshot` | Snapshot testing |
| `jest-transform` | Code transformation |
| `expect` | Assertion library |
| `pretty-format` | Snapshot serialization |
| `jest-watch` | Watch mode |

### How Jest Works

1. **Configuration** — Jest reads config from `jest.config.js`, `package.json`, or CLI
2. **Haste Map** — Builds a dependency graph of all files
3. **Test Discovery** — Finds test files matching `testMatch`/`testRegex`
4. **Test Sequencing** — Orders tests for optimal execution
5. **Worker Spawning** — Spawns worker processes/threads for parallel execution
6. **Environment Setup** — Creates test environment (node/jsdom) per worker
7. **Module Resolution** — Resolves and transforms modules
8. **Test Execution** — Runs tests in isolated contexts
9. **Result Collection** — Aggregates results from all workers
10. **Report Generation** — Outputs results, coverage, snapshots
