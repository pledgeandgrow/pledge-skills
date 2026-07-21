# Babel — API & CLI Reference

> Babel's programmatic API and command-line interface. Covers @babel/core, @babel/cli, @babel/parser, @babel/generator, @babel/traverse, @babel/types, @babel/template, @babel/standalone, @babel/register, and @babel/eslint-parser.

**@babel/core**: [babeljs.io/docs/babel-core](https://babeljs.io/docs/babel-core)  
**@babel/cli**: [babeljs.io/docs/babel-cli](https://babeljs.io/docs/babel-cli)  
**@babel/parser**: [babeljs.io/docs/babel-parser](https://babeljs.io/docs/babel-parser)  
**@babel/generator**: [babeljs.io/docs/babel-generator](https://babeljs.io/docs/babel-generator)  

## @babel/cli

### Install

```bash
npm install --save-dev @babel/core @babel/cli
```

### Usage

#### Print Usage

```bash
npx babel --help
```

#### Compile Files

```bash
# Compile and output to stdout
npx babel script.js

# Output to a file
npx babel script.js --out-file script-compiled.js
npx babel script.js -o script-compiled.js

# Watch mode
npx babel script.js --watch --out-file script-compiled.js
npx babel script.js -w -o script-compiled.js
```

#### Compile with Source Maps

```bash
# External source map file
npx babel script.js --out-file script-compiled.js --source-maps
npx babel script.js -o script-compiled.js -s

# Inline source maps
npx babel script.js --out-file script-compiled.js --source-maps inline
```

#### Compile Directories

```bash
# Compile entire src directory to lib directory
npx babel src --out-dir lib
npx babel src -d lib

# Compile directory to single concatenated file
npx babel src --out-file script-compiled.js
```

#### Directories with TypeScript Files

```bash
npx babel src --out-dir lib \
  --extensions .ts,.js,.tsx,.jsx,.cjs,.mjs \
  --presets=@babel/preset-typescript,@babel/preset-env,@babel/preset-react
```

#### Ignore Files

```bash
npx babel src --out-dir lib --ignore "src/**/*.spec.js","src/**/*.test.js"
```

#### Copy Files

```bash
# Copy non-compiled files
npx babel src --out-dir lib --copy-files

# Don't copy ignored files
npx babel src --out-dir lib --copy-files --no-copy-ignored
```

#### Piping Files

```bash
npx babel --out-file script-compiled.js < script.js
```

#### Using Plugins

```bash
npx babel script.js --out-file script-compiled.js \
  --plugins=@babel/transform-class-properties,@babel/transform-modules-amd
```

#### Using Presets

```bash
npx babel script.js --out-file script-compiled.js \
  --presets=@babel/preset-env,@babel/flow
```

#### Using Config Files

```bash
# Ignore .babelrc
npx babel --no-babelrc script.js --out-file script-compiled.js \
  --presets=@babel/preset-env,@babel/preset-react

# Custom config path
npx babel --config-file /path/to/my/babel.config.json --out-dir dist ./src
```

#### Set File Extensions

```bash
# Custom output extension
npx babel src --out-dir lib --out-file-extension .mjs

# Preserve input extension
npx babel src-with-mjs-and-cjs --out-dir lib --keep-file-extension
```

#### Output Levels

```bash
# Verbose
npx babel script.js --out-file script-compiled.js --verbose

# Silent
npx babel script.js --out-file script-compiled.js --silent
```

## @babel/core

### transform

```js
babel.transform(code: string, options?: Object, callback: Function)
```

```js
babel.transform("code();", options, function(err, result) {
  result.code;
  result.map;
  result.ast;
});
```

> Note: In Babel 7+, this is async when a callback is given. For sync behavior, use `transformSync`.

### transformSync

```js
babel.transformSync(code: string, options?: Object)
```

```js
const result = babel.transformSync("code();", options);
result.code;
result.map;
result.ast;
```

### transformAsync

```js
babel.transformAsync(code: string, options?: Object)
```

```js
babel.transformAsync("code();", options).then(result => {
  result.code;
  result.map;
  result.ast;
});
```

### transformFile

```js
babel.transformFile(filename: string, options?: Object, callback: Function)
```

```js
babel.transformFile("filename.js", options, function(err, result) {
  result; // => { code, map, ast }
});
```

### transformFileSync

```js
babel.transformFileSync(filename: string, options?: Object)
```

```js
babel.transformFileSync("filename.js", options).code;
```

### transformFileAsync

```js
babel.transformFileAsync(filename: string, options?: Object)
```

```js
babel.transformFileAsync("filename.js", options).then(result => {
  result.code;
});
```

### transformFromAst

```js
babel.transformFromAst(ast: Object, code?: string, options?: Object, callback: Function)
```

```js
const sourceCode = "if (true) return;";
const parsedAst = babel.parseSync(sourceCode, {
  parserOpts: { allowReturnOutsideFunction: true },
});
babel.transformFromAst(parsedAst, sourceCode, options, function(err, result) {
  const { code, map, ast } = result;
});
```

### transformFromAstSync

```js
babel.transformFromAstSync(ast: Object, code?: string, options?: Object)
```

```js
const { code, map, ast } = babel.transformFromAstSync(parsedAst, sourceCode, options);
```

### transformFromAstAsync

```js
babel.transformFromAstAsync(ast: Object, code?: string, options?: Object)
```

```js
babel
  .parseAsync(sourceCode, { parserOpts: { allowReturnOutsideFunction: true } })
  .then(parsedAst => babel.transformFromAstAsync(parsedAst, sourceCode, options))
  .then(({ code, map, ast }) => { /* ... */ });
```

### parse

```js
babel.parse(code: string, options?: Object, callback: Function)
```

Parses code using Babel's standard behavior. Referenced presets/plugins are loaded so syntax plugins are auto-enabled.

### parseSync

```js
babel.parseSync(code: string, options?: Object)
```

Returns an AST.

### parseAsync

```js
babel.parseAsync(code: string, options?: Object)
```

Returns a Promise for an AST.

### Advanced APIs

#### loadOptions

```js
babel.loadOptions(options?: Object)
```

Loads and merges all options, returning a fully resolved options object.

#### loadPartialConfig

```js
babel.loadPartialConfig(options?: Object)
```

Loads config without fully resolving. Returns `{ options, plugins, presets, fileHandling }`.

#### createConfigItem

```js
babel.createConfigItem(value: string | object | [string, object] | Function, options?: { dirname?: string, type?: "plugin" | "preset" })
```

Creates a config item for programmatic plugin/preset injection.

#### ConfigItem type

```typescript
interface ConfigItem {
  name: string;
  options: object | void;
  plugin: object | void;
  preset: object | void;
  file: { resolved: string, request: string } | void;
}
```

### DEFAULT_EXTENSIONS

```js
babel.DEFAULT_EXTENSIONS: readonly string[];
// [".js", ".jsx", ".es6", ".es", ".mjs", ".cjs"]
```

Used by `@babel/register` and `@babel/cli` to determine which files need transpiling.

## @babel/parser

The Babel parser (formerly Babylon) parses JavaScript/TypeScript/JSX/Flow code into an AST.

### Usage

```js
const parser = require("@babel/parser");

const ast = parser.parse("var foo = 1;", {
  sourceType: "module",
  plugins: ["jsx", "typescript", "decorators-legacy"],
});
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `sourceType` | `"script"` \| `"module"` \| `"unambiguous"` | `"script"` | Source type |
| `sourceFilename` | `string` | — | Filename for source maps |
| `startLine` | `number` | `1` | Starting line number |
| `allowAwaitOutsideFunction` | `boolean` | `false` | Allow `await` outside functions |
| `allowReturnOutsideFunction` | `boolean` | `false` | Allow `return` outside functions |
| `allowImportExportEverywhere` | `boolean` | `false` | Allow imports/exports anywhere |
| `allowSuperOutsideMethod` | `boolean` | `false` | Allow `super` outside methods |
| `allowUndeclaredExports` | `boolean` | `false` | Allow undeclared exports |
| `plugins` | `string[]` | `[]` | Syntax plugins |

### Parser Plugins

- `jsx` — JSX syntax
- `typescript` — TypeScript syntax
- `flow` — Flow syntax
- `decorators-legacy` — Legacy decorators
- `decorators` — Stage 3 decorators
- `classProperties` — Class properties
- `classPrivateProperties` — Private properties
- `classPrivateMethods` — Private methods
- `dynamicImport` — `import()`
- `importMeta` — `import.meta`
- `topLevelAwait` — Top-level await
- `bigInt` — BigInt literals
- `numericSeparator` — Numeric separators
- `optionalChaining` — Optional chaining
- `nullishCoalescing` — Nullish coalescing
- `objectRestSpread` — Object rest/spread
- `asyncGenerators` — Async generators
- `exportDefaultFrom` — `export default from`
- `exportNamespaceFrom` — `export * as ns from`
- `doExpressions` — Do expressions
- `functionBind` — Function bind (`::`)
- `functionSent` — Function sent
- `partialApplication` — Partial application
- `pipelineOperator` — Pipeline operator
- `throwExpressions` — Throw expressions
- `recordAndTuple` — Record and tuple

## @babel/generator

Generates code from an AST.

### Usage

```js
const generate = require("@babel/generator").default;

const output = generate(ast, {
  retainLines: false,
  compact: "auto",
  concise: false,
  comments: true,
});

output.code;
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `retainLines` | `boolean` | `false` | Retain line numbers |
| `compact` | `boolean` \| `"auto"` | `false` | Compact output |
| `minified` | `boolean` | `false` | Minified output |
| `concise` | `boolean` | `false` | Concise output |
| `comments` | `boolean` | `true` | Include comments |
| `jsonCompatibleStrings` | `boolean` | `false` | Escape strings for JSON |
| `jsescOption` | `object` | — | jsesc options |
| `sourceMaps` | `boolean` | `false` | Generate source maps |
| `sourceFileName` | `string` | — | Source filename |
| `sourceRoot` | `string` | — | Source root |

## @babel/traverse

Traverses and modifies an AST.

### Usage

```js
const traverse = require("@babel/traverse").default;

traverse(ast, {
  enter(path) {
    if (path.isIdentifier({ name: "foo" })) {
      path.node.name = "bar";
    }
  },
  exit(path) {
    // Called when leaving a node
  },
});
```

### Visitor Pattern

```js
traverse(ast, {
  FunctionDeclaration(path) {
    // Specific node type visitor
  },
  "FunctionDeclaration|FunctionExpression"(path) {
    // Multiple node types
  },
  Identifier(path) {
    // All identifiers
  },
  VariableDeclarator: {
    enter(path) { /* ... */ },
    exit(path) { /* ... */ },
  },
});
```

### Path Object

```js
path.node;        // Current AST node
path.parent;      // Parent node
path.parentPath;  // Parent path
path.scope;       // Scope object
path.key;         // Key in parent
path.container;   // Container array/object
path.type;        // Node type
path.removed;     // Whether node was removed
path.inList;      // Whether in an array
```

### Path Methods

```js
path.replaceWith(node);
path.replaceWithMultiple(nodes);
path.insertBefore(node);
path.insertAfter(node);
path.remove();
path.stop();
path.skip();
path.skipKeys(keys);
path.get(key);
path.getSibling(index);
path.getParentPath();
path.findParent(callback);
path.find(callback);
path.isNodeType(type);
path.assertNodeType(type);
```

### Scope

```js
path.scope.bindings;       // All bindings
path.scope.getBinding(name);
path.scope.hasBinding(name);
path.scope.generateUidIdentifier(name);
path.scope.rename(oldName, newName);
path.scope.crawl();        // Re-crawl scope
```

## @babel/types

AST node builders and type checkers.

### Usage

```js
const t = require("@babel/types");

// Build nodes
const id = t.identifier("foo");
const str = t.stringLiteral("bar");
const memberExp = t.memberExpression(t.identifier("obj"), t.identifier("prop"));

// Type checking
t.isIdentifier(node);
t.isStringLiteral(node);
t.isMemberExpression(node);
t.assertIdentifier(node);  // Throws if not
```

### Common Builders

```js
t.identifier(name);
t.stringLiteral(value);
t.numericLiteral(value);
t.booleanLiteral(value);
t.nullLiteral();
t.regExpLiteral(pattern, flags);
t.arrayExpression(elements);
t.objectExpression(properties);
t.objectProperty(key, value);
t.functionDeclaration(id, params, body);
t.arrowFunctionExpression(params, body);
t.callExpression(callee, args);
t.memberExpression(object, property);
t.binaryExpression(operator, left, right);
t.blockStatement(body);
t.returnStatement(argument);
t.variableDeclaration(kind, declarations);
t.variableDeclarator(id, init);
t.importDeclaration(specifiers, source);
t.exportNamedDeclaration(declaration, specifiers, source);
t.exportDefaultDeclaration(declaration);
t.classDeclaration(id, superClass, body);
t.classBody(body);
t.classProperty(key, value);
t.jsxElement(openingElement, closingElement, children);
t.jsxIdentifier(name);
t.jsxOpeningElement(name, attributes, selfClosing);
```

### Type Checkers

```js
t.isIdentifier(node, opts?);
t.isStringLiteral(node, opts?);
t.isNumericLiteral(node, opts?);
t.isBooleanLiteral(node, opts?);
t.isNullLiteral(node, opts?);
t.isArrayExpression(node, opts?);
t.isObjectExpression(node, opts?);
t.isFunctionDeclaration(node, opts?);
t.isArrowFunctionExpression(node, opts?);
t.isCallExpression(node, opts?);
t.isMemberExpression(node, opts?);
t.isBinaryExpression(node, opts?);
t.isBlockStatement(node, opts?);
t.isReturnStatement(node, opts?);
t.isVariableDeclaration(node, opts?);
t.isImportDeclaration(node, opts?);
t.isExportDeclaration(node, opts?);
t.isClassDeclaration(node, opts?);
t.isJSXElement(node, opts?);
// ... and many more
```

### Assertions

```js
t.assertIdentifier(node);  // Throws if not an Identifier
t.assertStringLiteral(node);
// ... same pattern as type checkers
```

### Cloning

```js
t.cloneNode(node);
t.cloneDeep(node);
t.cloneWithoutLoc(node);
```

### Utilities

```js
t.addComment(node, type, content);
t.addComments(node, type, comments);
t.removeComments(node);
t.inheritsComments(node, baseNode);
t.validate(node, key, val);
t.shallowEqual(actual, expected);
t.appendToMemberExpression(member, append);
t.prependToMemberExpression(member, prepend);
t.getBindingIdentifiers(node);
t.getOuterBindingIdentifiers(node);
t.isReferenced(node, parent);
t.isScope(node, parent);
t.isImmutable(node);
t.isNodesEqual(a, b);
```

## @babel/template

Generate AST nodes from string templates.

### Usage

```js
const template = require("@babel/template").default;

// Build a statement
const ast = template.statement("var x = 1;")();

// Build an expression
const expr = template.expression("foo + bar")();

// Build with placeholders
const fn = template.statement(`
  function %%name%%(%%params%%) {
    return %%body%%;
  }
`);
const ast = fn({
  name: t.identifier("myFunc"),
  params: [t.identifier("x")],
  body: t.identifier("x"),
});
```

### API

```js
template(code, opts);          // Smart template
template.statement(code, opts); // Statement only
template.expression(code, opts); // Expression only
template.program(code, opts);   // Full program
template.smart(code, opts);     // Smart (auto-detect)
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `placeholderPattern` | `RegExp` | Pattern for placeholders (default: `/^[_$A-Z0-9]+$/`) |
| `preserveComments` | `boolean` | Preserve comments from template |
| `plugins` | `string[]` | Parser plugins |

## @babel/standalone

Babel compiled for use in browsers. No `require`/`import` needed.

### Usage

```html
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel">
const getMessage = () => "Hello World";
document.getElementById('output').innerHTML = getMessage();
</script>
```

### API

```js
Babel.transform(code, options);
Babel.transformFromAst(ast, code, options);
Babel.registerPlugin(name, plugin);
Babel.registerPreset(name, preset);
Babel.availablePlugins;
Babel.availablePresets;
```

## @babel/register

Monkey-patches `require` to transpile files on-the-fly.

### Install

```bash
npm install --save-dev @babel/register
```

### Usage

```js
require("@babel/register");
// All subsequent require()s will be transpiled
require("./app.js");
```

### Options

```js
require("@babel/register")({
  extensions: [".js", ".jsx", ".ts", ".tsx"],
  cache: true,
  presets: ["@babel/preset-env"],
  plugins: [],
  ignore: [/node_modules/],
  only: [/src/],
  cwd: process.cwd(),
  rootMode: "root",
});
```

## @babel/eslint-parser

> Formerly `babel-eslint`. Now `@babel/eslint-parser`.

Allows ESLint to parse code that Babel can parse (JSX, TypeScript, Flow, proposals).

### Install

```bash
npm install --save-dev @babel/core @babel/eslint-parser
```

### Usage (ESLint flat config)

```js
// eslint.config.js
export default [
  {
    languageOptions: {
      parser: require("@babel/eslint-parser"),
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
        },
      },
    },
  },
];
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `requireConfigFile` | `boolean` | Require a Babel config file (default: `true`) |
| `babelOptions` | `object` | Babel options to use |
| `ecmaFeatures` | `object` | Enable ECMAScript features |
