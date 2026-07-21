# ESLint — Extending ESLint

> Ways to extend ESLint: create plugins, custom rules, custom formatters, custom parsers, custom processors, and shareable configurations.

**Documentation**: [eslint.org/docs/latest/extend/](https://eslint.org/docs/latest/extend/)

## Ways to Extend ESLint

| Extension Type | Description |
|----------------|-------------|
| **Plugins** | Packages with custom rules, configs, processors, languages |
| **Shareable Configs** | npm packages exporting configuration arrays |
| **Custom Rules** | Rules that validate specific code patterns |
| **Custom Formatters** | Custom output formatting for lint results |
| **Custom Parsers** | Parse non-standard JavaScript syntax |
| **Custom Processors** | Extract code from non-JS files for linting |

## Create Plugins

### Plugin Structure

```js
// eslint-plugin-example/index.js
const plugin = {
  meta: {
    name: "eslint-plugin-example",
    version: "1.0.0",
  },
  rules: {
    "no-foo": {
      meta: {
        type: "problem",
        docs: {
          description: "Disallow foo",
          category: "Possible Errors",
          recommended: false,
        },
        schema: [],  // No options
        messages: {
          unexpected: "Unexpected use of 'foo'",
        },
      },
      create(context) {
        return {
          Identifier(node) {
            if (node.name === "foo") {
              context.report({
                node,
                messageId: "unexpected",
              });
            }
          },
        };
      },
    },
  },
  configs: {
    recommended: {
      plugins: ["example"],
      rules: {
        "example/no-foo": "error",
      },
    },
  },
  processors: {
    "example-processor": {
      meta: {
        name: "example-processor",
      },
      preprocess(text, filename) {
        return [text];
      },
      postprocess(messages, filename) {
        return messages.flat();
      },
    },
  },
};

module.exports = plugin;
```

### Meta Data in Plugins

```js
{
  meta: {
    name: "eslint-plugin-example",  // Plugin name
    version: "1.0.0",               // Plugin version
  },
}
```

### Rules in Plugins

Rules in plugins follow the same structure as custom rules. They are referenced as `pluginName/ruleName`.

### Processors in Plugins

```js
{
  processors: {
    "markdown": {
      meta: { name: "markdown" },
      preprocess(text, filename) {
        // Extract code blocks from markdown
        return codeBlocks.map(block => ({ text: block.code, filename: block.filename }));
      },
      postprocess(messages, filename) {
        // Map messages back to original file
        return messages.flat();
      },
    },
  },
}
```

### Configs in Plugins

```js
{
  configs: {
    recommended: {
      plugins: ["example"],
      rules: {
        "example/no-foo": "error",
        "example/no-bar": "warn",
      },
    },
    strict: {
      plugins: ["example"],
      rules: {
        "example/no-foo": "error",
        "example/no-bar": "error",
      },
    },
  },
}
```

### Testing a Plugin

Use `RuleTester` for testing rules:

```js
const { RuleTester } = require("eslint");
const rule = require("../../../lib/rules/no-foo");

const ruleTester = new RuleTester();

ruleTester.run("no-foo", rule, {
  valid: [
    "bar()",
    "baz()",
  ],
  invalid: [
    {
      code: "foo()",
      errors: [{ messageId: "unexpected" }],
    },
  ],
});
```

### Linting a Plugin

Plugins should lint themselves:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
  js.configs.recommended,
  {
    files: ["lib/**/*.js"],
    rules: {
      "no-console": "off",
    },
  },
]);
```

### Share Plugins

Publish to npm with the `eslint-plugin-*` naming convention:

```json
{
  "name": "eslint-plugin-example",
  "version": "1.0.0",
  "main": "index.js",
  "peerDependencies": {
    "eslint": ">=9.0.0"
  }
}
```

## Custom Rules

### Rule Structure

```js
module.exports = {
  meta: {
    type: "problem",  // "problem" | "suggestion" | "layout"
    docs: {
      description: "Description of the rule",
      category: "Possible Errors",
      recommended: false,
      url: "https://github.com/your-repo/blob/main/docs/rules/your-rule.md",
    },
    schema: [
      {
        type: "object",
        properties: {
          option: { type: "boolean" },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      messageId: "Error message with {{placeholder}}",
    },
    hasSuggestions: true,  // Enable suggestions
    fixable: "code",       // Enable auto-fix: "code" | "whitespace" | null
  },
  create(context) {
    return {
      // AST selectors
      Identifier(node) { /* ... */ },
      CallExpression(node) { /* ... */ },
      "BinaryExpression[operator='+']"(node) { /* ... */ },
    };
  },
};
```

### The Context Object

```js
create(context) {
  return {
    Identifier(node) {
      // Report problems
      context.report({
        node,
        message: "Unexpected identifier",
        // Or use messageId
        messageId: "unexpected",
        data: { name: node.name },  // For placeholder substitution
        // Fix
        fix(fixer) {
          return fixer.replaceText(node, "bar");
        },
        // Suggestions
        suggest: [
          {
            desc: "Replace 'foo' with 'bar'",
            fix(fixer) {
              return fixer.replaceText(node, "bar");
            },
          },
        ],
      });
    },
  };
}
```

### Report Problems

```js
context.report({
  node,                    // AST node
  message: "Error message",  // OR
  messageId: "messageId",    // With messages in meta
  data: { key: value },      // Placeholder data
  fix(fixer) { /* ... */ },  // Auto-fix function
  suggest: [ /* ... */ ],    // Manual suggestions
});
```

### Accessing Options Passed to a Rule

```js
create(context) {
  const options = context.options[0] || {};
  const { allowFoo = false } = options;

  return {
    Identifier(node) {
      if (!allowFoo && node.name === "foo") {
        context.report({ node, messageId: "unexpected" });
      }
    },
  };
}
```

### Accessing the Source Code

```js
create(context) {
  const sourceCode = context.sourceCode;

  return {
    Identifier(node) {
      const text = sourceCode.getText(node);
      const lines = sourceCode.getLines();
      const comments = sourceCode.getAllComments();
      const tokens = sourceCode.getTokens(node);
      const ast = sourceCode.ast;
    },
  };
}
```

### Options Schemas

Use JSON Schema to validate rule options:

```js
meta: {
  schema: {
    type: "object",
    properties: {
      option1: { type: "boolean" },
      option2: { type: "string", enum: ["a", "b", "c"] },
      option3: { type: "array", items: { type: "string" } },
    },
    additionalProperties: false,
  },
}
```

### Option Defaults

```js
create(context) {
  const [options = {}] = context.options;
  const { severity = "warn", allow = [] } = options;
  // ...
}
```

### Accessing Shebangs

```js
create(context) {
  const sourceCode = context.sourceCode;
  if (sourceCode.ast.body.length > 0) {
    const firstNode = sourceCode.ast.body[0];
    // Check for shebang comment
  }
}
```

### Accessing Variable Scopes

```js
create(context) {
  return {
    Program(node) {
      const scope = context.sourceCode.getScope(node);
      const variables = scope.variables;
      // ...
    },
  };
}
```

### Marking Variables as Used

```js
create(context) {
  return {
    Identifier(node) {
      context.sourceCode.markVariableAsUsed(node.name);
    },
  };
}
```

### Accessing Code Paths

```js
create(context) {
  return {
    onCodePathStart(codePath, node) { /* ... */ },
    onCodePathEnd(codePath, node) { /* ... */ },
    onCodePathSegmentStart(segment, node) { /* ... */ },
    onCodePathSegmentEnd(segment, node) { /* ... */ },
    onCodePathSegmentLoop(fromSegment, toSegment, node) { /* ... */ },
  };
}
```

### Rule Unit Tests

```js
const { RuleTester } = require("eslint");
const rule = require("../../../lib/rules/my-rule");

const ruleTester = new RuleTester();

ruleTester.run("my-rule", rule, {
  valid: [
    "validCode()",
    {
      code: "validWithOptions()",
      options: [{ allowFoo: true }],
    },
  ],
  invalid: [
    {
      code: "foo()",
      errors: [{ messageId: "unexpected" }],
      output: "bar()",  // If fixable
    },
  ],
});
```

### Rule Naming Conventions

- Use kebab-case for rule names
- Reference as `pluginName/ruleName`
- Rule files: `lib/rules/rule-name.js`

### Runtime Rules

Rules can be defined directly in configuration:

```js
export default defineConfig([
  {
    plugins: {
      local: {
        rules: {
          "no-foo": {
            create(context) {
              return { Identifier(node) { /* ... */ } };
            },
          },
        },
      },
    },
    rules: { "local/no-foo": "error" },
  },
]);
```

### Profile Rule Performance

Use `--stats` flag to see rule performance:

```bash
npx eslint --stats .
```

## Custom Formatters

### Create a Custom Formatter

```js
// formatter.js
module.exports = function (results, context) {
  // results: LintResult[]
  // context: { cwd, maxWarnings, fix, rulesMeta }
  let output = "";
  let errorCount = 0;
  let warningCount = 0;

  for (const result of results) {
    for (const message of result.messages) {
      const severity = message.severity === 2 ? "Error" : "Warning";
      output += `${result.filePath}:${message.line}:${message.column} ${severity} ${message.message}\n`;
      if (message.severity === 2) errorCount++;
      else warningCount++;
    }
  }

  output += `\n${errorCount} errors, ${warningCount} warnings\n`;
  return output;
};
```

### The results Argument

```js
{
  filePath: "/path/to/file.js",
  messages: [{
    ruleId: "no-undef",
    severity: 2,
    message: "'foo' is not defined",
    line: 10,
    column: 3,
    messageId: "unexpected",
    nodeType: "Identifier",
    fix: { range: [0, 10], text: "bar" },
    suggestions: [{ desc: "Replace", fix: { range: [0, 10], text: "bar" } }],
  }],
  errorCount: 1,
  warningCount: 0,
  fixableErrorCount: 0,
  fixableWarningCount: 0,
  source: "source code text",
}
```

### The context Argument

```js
{
  cwd: "/current/working/directory",
  maxWarnings: -1,
  fix: false,
  rulesMeta: {
    "no-undef": {
      type: "problem",
      docs: { description: "..." },
      hasSuggestions: false,
      // ...
    },
  },
}
```

### Passing Arguments to Formatters

```bash
npx eslint --format ./formatter.js --formatter-option foo .
```

### Formatting for Terminals

Check if output is a TTY:

```js
module.exports = function (results, context) {
  const isTTY = process.stdout.isTTY;
  // Use colors only if TTY
  // ...
};
```

### Packaging a Custom Formatter

Name: `eslint-formatter-*`

```json
{
  "name": "eslint-formatter-pretty",
  "main": "index.js"
}
```

```bash
npx eslint --format pretty .
```

## Custom Parsers

### Create a Custom Parser

```js
// custom-parser.js
module.exports = {
  parse(code, options) {
    // Return ESTree-compatible AST
    return {
      type: "Program",
      body: [],
      sourceType: "module",
      // ...
    };
  },

  // OR use parseForESLint for more control
  parseForESLint(code, options) {
    return {
      ast: {
        type: "Program",
        body: [],
        sourceType: "module",
      },
      visitorKeys: { /* ... */ },
      services: { /* ... */ },
    };
  },
};
```

### Methods in Custom Parsers

- `parse(code, options)` — returns AST
- `parseForESLint(code, options)` — returns object with `ast`, `visitorKeys`, `services`

### parse Return Object

Must be an ESTree-compatible AST with:
- `type: "Program"`
- `body: [...]`
- `sourceType: "module" | "script"`

### parseForESLint Return Object

```js
{
  ast: { /* ESTree AST */ },
  visitorKeys: { /* Custom visitor keys */ },
  services: { /* Additional services */ },
}
```

### Meta Data in Custom Parsers

```js
module.exports = {
  parseForESLint(code, options) { /* ... */ },
  meta: {
    name: "custom-parser",
    version: "1.0.0",
  },
};
```

### AST Specification

All nodes must have:
- `type` — node type string
- `range` — `[start, end]` offset pair
- `loc` — `{ start: { line, column }, end: { line, column } }`

Key node types:
- `Program` — root node
- `Literal` — literal values
- `Identifier` — identifiers
- `ExpressionStatement` — expression statements
- `BlockStatement` — block statements
- `FunctionDeclaration` — function declarations
- `VariableDeclaration` — variable declarations

### Packaging a Custom Parser

Name: `eslint-parser-*` or any npm package

```json
{
  "name": "custom-eslint-parser",
  "main": "index.js"
}
```

## Custom Processors

### Custom Processor Specification

```js
const processor = {
  meta: {
    name: "markdown-processor",
  },

  preprocess(text, filename) {
    // Extract code blocks from non-JS files
    // Return array of { text, filename } objects
    const codeBlocks = extractCodeBlocks(text);
    return codeBlocks.map((block, index) => ({
      text: block.code,
      filename: `${filename}#${index}.js`,
    }));
  },

  postprocess(messages, filename) {
    // Map messages back to original file
    // messages is an array of arrays (one per preprocess output)
    return messages.flat().map(message => ({
      ...message,
      line: message.line + offset,
      column: message.column,
    }));
  },

  supportsAutofix: true,  // Enable auto-fix in processed files
};
```

### How meta Objects are Used

- `meta.name` — identifies the processor in error messages
- `meta.supportsAutofix` — enables auto-fix support

### Specify Processor in Config Files

```js
export default defineConfig([
  {
    files: ["**/*.md"],
    processor: "markdown/markdown-processor",
  },
]);
```

## Shareable Configurations

### Create a Shareable Config

```js
// eslint-config-myconfig/index.js
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    rules: {
      "no-console": "warn",
      "prefer-const": "error",
      "no-var": "error",
    },
  },
];
```

### Publishing a Shareable Config

Name: `eslint-config-*`

```json
{
  "name": "eslint-config-myconfig",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "peerDependencies": {
    "eslint": ">=9.0.0"
  }
}
```

### Use a Shareable Config

```js
import myConfig from "eslint-config-myconfig";

export default defineConfig([
  ...myConfig,
  {
    rules: {
      "no-console": "off",  // Override
    },
  },
]);
```

### Overriding Settings from Shareable Configs

Place your config after the shareable config to override:

```js
export default defineConfig([
  ...myConfig,
  {
    rules: {
      "no-console": "off",
    },
  },
]);
```

### Sharing Multiple Configs

```js
// eslint-config-myconfig/index.js
export default {
  base: [/* ... */],
  react: [/* ... */],
  node: [/* ... */],
};
```

```js
import myConfig from "eslint-config-myconfig";

export default defineConfig([
  ...myConfig.base,
  ...myConfig.react,
]);
```
