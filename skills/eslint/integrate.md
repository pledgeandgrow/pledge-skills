# ESLint — Node.js API & Integration

> Integrate ESLint into your tools using the Node.js API. The `ESLint` class provides full programmatic access to linting, configuration, and formatting.

**Documentation**: [eslint.org/docs/latest/integrate/](https://eslint.org/docs/latest/integrate/)

## Integration Tutorial

### Basic Integration

```js
const { ESLint } = require("eslint");

async function lint() {
  // 1. Create an ESLint instance
  const eslint = new ESLint();

  // 2. Lint files
  const results = await eslint.lintFiles(["src/**/*.js"]);

  // 3. Format the results
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);

  // 4. Output results
  console.log(resultText);

  // 5. Apply fixes (optional)
  await ESLint.outputFixes(results);

  // 6. Check for errors
  const errorCount = results.reduce(
    (sum, result) => sum + result.errorCount, 0
  );

  process.exitCode = errorCount > 0 ? 1 : 0;
}

lint();
```

## Node.js API Reference

### ESLint Class

The main class for programmatic ESLint usage.

#### `new ESLint(options)`

```js
const eslint = new ESLint({
  cwd: process.cwd(),              // Working directory
  overrideConfigFile: "eslint.config.js",  // Custom config file
  overrideConfig: { /* ... */ },   // Override configuration object
  flags: ["ts_config"],            // Feature flags
  fix: true,                       // Enable auto-fix
  fixTypes: ["problem"],           // Fix types: "directive", "problem", "suggestion", "layout"
  globals: ["window", "document"], // Additional globals
  ignore: true,                    // Use ignore patterns
  ignorePatterns: ["dist/"],       // Additional ignore patterns
  passOnNoPatterns: false,         // Exit 0 if no patterns
  rulePaths: [],                   // Additional rule directories (deprecated)
  cache: false,                    // Enable caching
  cacheLocation: ".eslintcache",   // Cache file location
  cacheStrategy: "metadata",       // Cache strategy: "metadata" | "content"
});
```

#### `eslint.lintFiles(patterns)`

```js
const results = await eslint.lintFiles(["src/**/*.js", "lib/**/*.js"]);
// Returns: Promise<LintResult[]>
```

#### `eslint.lintText(code, options)`

```js
const results = await eslint.lintText("var foo = 1;", {
  filePath: "test.js",     // Virtual filename
  warnIgnored: true,       // Warn if file is ignored
});
// Returns: Promise<LintResult[]>
```

#### `eslint.getRulesMetaForResults(results)`

```js
const results = await eslint.lintFiles(["src/"]);
const rulesMeta = await eslint.getRulesMetaForResults(results);
// Returns metadata for all rules that triggered messages
```

#### `eslint.calculateConfigForFile(filePath)`

```js
const config = await eslint.calculateConfigForFile("src/index.js");
// Returns the computed configuration for the file
```

#### `eslint.findConfigFile(filePath)`

```js
const configPath = await eslint.findConfigFile("src/index.js");
// Returns the path to the config file
```

#### `eslint.isPathIgnored(filePath)`

```js
const isIgnored = await eslint.isPathIgnored("dist/bundle.js");
// Returns: Promise<boolean>
```

#### `eslint.loadFormatter(nameOrPath)`

```js
const formatter = await eslint.loadFormatter("stylish");
const output = formatter.format(results);

// Custom formatter
const customFormatter = await eslint.loadFormatter("./my-formatter.js");
```

#### `eslint.hasFlag(flagName)`

```js
const hasTsConfig = eslint.hasFlag("ts_config");
// Returns: boolean
```

#### Static Methods

```js
// ESLint version
console.log(ESLint.version);  // "10.0.0"

// Default config
const defaultConfig = ESLint.defaultConfig;

// Apply fixes to files
await ESLint.outputFixes(results);

// Filter error results
const errorResults = ESLint.getErrorResults(results);
```

#### `ESLint.fromOptionsModule(optionsURL)`

Create an ESLint instance from options defined in a module URL.

### LintResult Type

```typescript
interface LintResult {
  filePath: string;
  messages: LintMessage[];
  suppressedMessages: SuppressedLintMessage[];
  errorCount: number;
  fatalErrorCount: number;
  warningCount: number;
  fixableErrorCount: number;
  fixableWarningCount: number;
  source: string | null;
  output: string | null;  // Fixed source if fixable
  usedDeprecatedRules: { ruleId: string; replacedBy: string[] }[];
}
```

### LintMessage Type

```typescript
interface LintMessage {
  ruleId: string | null;
  severity: 1 | 2;  // 1 = warning, 2 = error
  message: string;
  messageId: string;
  line: number;
  column: number;
  endLine: number | undefined;
  endColumn: number | undefined;
  nodeType: string;
  fix: EditInfo | null;
  suggestions: { desc: string; fix: EditInfo }[] | null;
}
```

### SuppressedLintMessage Type

```typescript
interface SuppressedLintMessage extends LintMessage {
  suppressions: {
    kind: string;
    justification: string;
  }[];
}
```

### EditInfo Type

```typescript
interface EditInfo {
  range: [number, number];  // [start, end] offsets
  text: string;             // Replacement text
}
```

### LoadedFormatter Type

```typescript
interface LoadedFormatter {
  format(results: LintResult[]): string;
}
```

### loadESLint()

```js
const { loadESLint } = require("eslint");

async function main() {
  const { ESLint } = await loadESLint();
  const eslint = new ESLint();
  // ...
}
```

## SourceCode

The `SourceCode` object represents parsed source code:

```js
const sourceCode = context.sourceCode;

// Properties
sourceCode.text;          // Full source text
sourceCode.ast;           // Parsed AST
sourceCode.lines;         // Array of source lines
sourceCode.hasBOM;        // Has BOM
sourceCode.parserServices; // Parser services

// Methods
sourceCode.getText(node);         // Get text of a node
sourceCode.getLines();            // Get all lines
sourceCode.getAllComments();      // Get all comments
sourceCode.getComments(node);     // Get comments for a node
sourceCode.getTokens(node);       // Get tokens for a node
sourceCode.getTokenBefore(node);  // Get token before a node
sourceCode.getTokenAfter(node);   // Get token after a node
sourceCode.getTokensBefore(node);
sourceCode.getTokensAfter(node);
sourceCode.getTokensBetween(node1, node2);
sourceCode.getFirstToken(node);
sourceCode.getLastToken(node);
sourceCode.getNodeByRangeIndex(index);
sourceCode.getLocFromIndex(index);
sourceCode.getIndexFromLoc(loc);
sourceCode.splitLines(text);  // Split text into lines
```

### SourceCode#splitLines()

```js
const lines = sourceCode.splitLines(sourceCode.text);
```

## Linter

The `Linter` object provides low-level linting:

```js
const { Linter } = require("eslint");

const linter = new Linter();

// Verify code
const messages = linter.verify(code, config);
const messages = linter.verify(code, config, {
  filename: "test.js",
  allowInlineConfig: true,
  reportUnusedDisableDirectives: true,
});

// Verify and fix
const result = linter.verifyAndFix(code, config);
// result: { output, messages, fixed }
```

### Linter#verify

```js
const messages = linter.verify("var foo = 1;", {
  rules: {
    semi: "error",
  },
});
```

### Linter#verifyAndFix()

```js
const result = linter.verifyAndFix("var foo = 1", {
  rules: { semi: "error" },
}, {
  filename: "test.js",
  fix: true,
});

console.log(result.fixed);   // true
console.log(result.output);  // "var foo = 1;"
console.log(result.messages); // remaining messages
```

### Linter.version

```js
console.log(Linter.version);  // "10.0.0"
```

### Linter#getTimes()

```js
const messages = linter.verify(code, config);
const times = linter.getTimes();
// Returns performance timing data
```

### Linter#getFixPassCount()

```js
const result = linter.verifyAndFix(code, config);
const passCount = linter.getFixPassCount();
// Number of fix passes performed
```

### Linter#hasFlag()

```js
const hasFlag = linter.hasFlag("ts_config");
```

## RuleTester

The `RuleTester` class for testing custom rules:

```js
const { RuleTester } = require("eslint");
const rule = require("./rules/my-rule");

const ruleTester = new RuleTester();

ruleTester.run("my-rule", rule, {
  valid: [
    "validCode()",
    {
      code: "validWithOptions()",
      options: [{ allowFoo: true }],
      languageOptions: { ecmaVersion: 2024 },
    },
  ],
  invalid: [
    {
      code: "foo()",
      errors: [{ messageId: "unexpected" }],
      output: "bar()",
    },
    {
      code: "foo()",
      errors: [{ message: "Unexpected foo" }],
    },
  ],
});
```

### RuleTester.setDefaultConfig(config)

```js
RuleTester.setDefaultConfig({
  languageOptions: {
    ecmaVersion: 2024,
    sourceType: "module",
  },
});
```

### RuleTester.getDefaultConfig()

```js
const config = RuleTester.getDefaultConfig();
```

### RuleTester.resetDefaultConfig()

```js
RuleTester.resetDefaultConfig();
```

### RuleTester#run()

```js
ruleTester.run("rule-name", rule, {
  valid: [/* ... */],
  invalid: [/* ... */],
});
```

### Testing Errors with messageId

```js
{
  code: "foo()",
  errors: [
    {
      messageId: "unexpected",
      data: { name: "foo" },  // Optional: verify placeholder data
      type: "Identifier",     // Optional: verify node type
      line: 1,                // Optional: verify line
      column: 1,              // Optional: verify column
    },
  ],
}
```

### Testing Fixes

```js
{
  code: "var foo = 1",
  errors: [{ messageId: "preferConst" }],
  output: "const foo = 1",  // Expected output after fix
}
```

### Testing Suggestions

```js
{
  code: "let foo = 1;",
  errors: [{
    messageId: "preferConst",
    suggestions: [{
      desc: "Use 'const' instead of 'let'",
      output: "const foo = 1;",
    }],
  }],
}
```

### Customizing RuleTester

```js
class CustomRuleTester extends RuleTester {
  constructor(options) {
    super(options);
    // Custom setup
  }

  run(ruleName, rule, tests) {
    // Custom test runner
    super.run(ruleName, rule, tests);
  }
}
```

## Practical Integration Examples

### Express Middleware

```js
const { ESLint } = require("eslint");

app.post("/lint", async (req, res) => {
  const eslint = new ESLint({ fix: false });
  const results = await eslint.lintText(req.body.code, {
    filePath: "upload.js",
  });
  const formatter = await eslint.loadFormatter("json");
  res.json(JSON.parse(formatter.format(results)));
});
```

### Webpack Plugin

```js
const { ESLint } = require("eslint");

class ESLintWebpackPlugin {
  async apply(compiler) {
    compiler.hooks.emit.tapAsync("ESLintWebpackPlugin", async (compilation, callback) => {
      const eslint = new ESLint();
      const results = await eslint.lintFiles(["src/**/*.js"]);
      // Process results...
      callback();
    });
  }
}
```

### GitHub Action

```yaml
name: Lint
on: [pull_request]
jobs:
  eslint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: npx eslint .
```
