# Babel — Getting Started & Learn ES2015

> Babel is a JavaScript compiler — a toolchain primarily used to convert ECMAScript 2015+ code into backwards-compatible JavaScript.

**Documentation**: [babeljs.io/docs](https://babeljs.io/docs/)  
**Learn ES2015**: [babeljs.io/docs/learn](https://babeljs.io/docs/learn)  

## What is Babel?

Babel is a toolchain that is mainly used to:
- **Transform syntax** — Convert ES2015+ syntax to backwards-compatible JavaScript
- **Polyfill features** — Add missing features via [core-js](https://github.com/zloirock/core-js)
- **Source code transformations (codemods)** — Apply custom transformations
- **JSX and React** — Convert JSX syntax
- **Type Annotations** — Strip Flow and TypeScript type annotations
- **Pluggable** — Compose your own transformation pipeline
- **Debuggable** — Source map support for debugging compiled code
- **Spec Compliant** — Stays true to the ECMAScript standard
- **Compact** — Uses the least amount of code possible with no bulky runtime

### Basic Example

```js
// Babel Input: ES2015 arrow function
[1, 2, 3].map(n => n + 1);

// Babel Output: ES5 equivalent
[1, 2, 3].map(function(n) { return n + 1; });
```

### JSX and React

```bash
npm install --save-dev @babel/preset-react
```

```js
// Add @babel/preset-react to your Babel configuration
export default function DiceRoll() {
  const getRandomNumber = () => Math.ceil(Math.random() * 6);
  const [num, setNum] = useState(getRandomNumber());
  const handleClick = () => setNum(getRandomNumber());
  return (
    <div>
      Your dice roll: {num}.
      <button onClick={handleClick}>Click to get a new number</button>
    </div>
  );
}
```

### Type Annotations (Flow and TypeScript)

Babel can strip out type annotations. Babel does **not** do type checking — use Flow or TypeScript separately.

**Flow:**
```bash
npm install --save-dev @babel/preset-flow
```
```js
// @flow
function square(n: number): number {
  return n * n;
}
```

**TypeScript:**
```bash
npm install --save-dev @babel/preset-typescript
```
```ts
function Greeter(greeting: string) {
  this.greeting = greeting;
}
```

### Pluggable

Babel is built out of plugins. Compose your own transformation pipeline:

```js
// A plugin is just a function
export default function({ types: t }) {
  return {
    visitor: {
      Identifier(path) {
        let name = path.node.name;
        // reverse the name: JavaScript -> tpircSavaJ
        path.node.name = [...name].reverse().join("");
      },
    },
  };
}
```

## Usage Guide

### Overview

The entire process to set up Babel:

1. **Install packages:**
```bash
npm install --save-dev @babel/core @babel/cli @babel/preset-env
```

2. **Create a config file** `babel.config.json`:
```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1"
        },
        "useBuiltIns": "usage",
        "corejs": "3.6.5"
      }
    ]
  ]
}
```

3. **Compile code:**
```bash
npx babel src --out-dir lib
```

### Basic Usage with CLI

All Babel modules are published as separate npm packages scoped under `@babel` (since v7):
- **`@babel/core`** — Core compiler
- **`@babel/cli`** — Command-line tool

### Plugins & Presets

Transformations come in the form of **plugins** — small JavaScript programs that instruct Babel on how to carry out transformations.

```bash
npm install --save-dev @babel/plugin-transform-arrow-functions
npx babel src --out-dir lib --plugins=@babel/plugin-transform-arrow-functions
```

```js
// Input
const fn = () => 1;
// Output
var fn = function fn() { return 1; };
```

Instead of adding plugins one by one, use a **preset** — a pre-determined set of plugins:

```bash
npm install --save-dev @babel/preset-env
npx babel src --out-dir lib --presets=@babel/env
```

### Configuration

Create `babel.config.json`:
```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1"
        }
      }
    ]
  ]
}
```

### Polyfill

> **Deprecated**: As of Babel 7.4.0, `@babel/polyfill` is deprecated. Use `core-js/stable` directly:
> ```js
> import "core-js/stable";
> ```

If compiling generators or async functions to ES5 (with `@babel/core` or `@babel/plugin-transform-regenerator` older than 7.18.0), also load the [regenerator runtime](https://github.com/facebook/regenerator/tree/main/packages/runtime).

**Using `useBuiltIns: "usage"`** — Babel inspects code and includes only required polyfills:

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": { "edge": "17", "firefox": "60", "chrome": "67", "safari": "11.1" },
        "useBuiltIns": "usage"
      }
    ]
  ]
}
```

```js
// Input
Promise.resolve().finally();
// Output (Edge 17 doesn't have Promise.prototype.finally)
require("core-js/modules/es.promise.finally");
Promise.resolve().finally();
```

**Using `useBuiltIns: "entry"`** — Replace `import "core-js"` with individual imports:

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": { "edge": "17", "firefox": "60", "chrome": "67", "safari": "11.1" },
        "useBuiltIns": "entry"
      }
    ]
  ]
}
```

## Learn ES2015 (ES6)

### Introduction

A detailed overview of ECMAScript 2015 features. Originally from Luke Hoban's es6features repo.

### ECMAScript 2015 Features

#### Arrows and Lexical This

```js
// ES2015
const nums = [1, 2, 3].map(n => n * 2);
// ES5 equivalent
var nums = [1, 2, 3].map(function(n) { return n * 2; }.bind(this));
```

#### Classes

```js
class SkinnedMesh extends THREE.Mesh {
  constructor(geometry, materials) {
    super(geometry, materials);
    this.idMatrix = SkinnedMesh.defaultMatrix();
  }
  update(camera) {
    super.update();
  }
  static defaultMatrix() {
    return new THREE.Matrix4();
  }
}
```

#### Enhanced Object Literals

```js
const obj = {
  // Shorthand
  foo,
  // Computed property
  ["bar" + baz]: "hello",
  // Methods
  toString() {
    return "obj";
  },
  // __proto__
  __proto__: proto,
};
```

#### Template Strings

```js
const name = "world";
const greeting = `Hello ${name}!`;
```

#### Destructuring

```js
// Array matching
const [a, b, c] = [1, 2, 3];
// Object matching
const { name, age } = person;
// Parameter destructuring
function f({ name, age }) { /* ... */ }
```

#### Default + Rest + Spread

```js
function f(x, y = 12) { return x + y; }
function f(x, ...y) { return x * y.length; }
function f(x, y, z) { return x + y + z; }
f(...[1, 2, 3]);
```

#### Let + Const

```js
let x = 1;
const PI = 3.141593;
```

#### Iterators + For..Of

```js
const arr = [1, 2, 3];
for (const item of arr) {
  console.log(item);
}
```

#### Generators

```js
function* fibonacci() {
  let [prev, curr] = [0, 1];
  while (true) {
    [prev, curr] = [curr, prev + curr];
    yield curr;
  }
}
```

#### Modules

```js
// lib.js
export function sum(x, y) { return x + y; }
export const pi = 3.141593;

// app.js
import * as lib from "lib";
import { sum, pi } from "lib";
```

#### Map + Set + WeakMap + WeakSet

```js
const m = new Map();
m.set("hello", 42);
const s = new Set();
s.add(1).add(2).add(1);
```

#### Proxies

```js
const target = {};
const handler = {
  get(receiver, name) { return `Hello, ${name}!`; }
};
const p = new Proxy(target, handler);
p.world; // "Hello, world!"
```

#### Symbols

```js
const sym = Symbol("my symbol");
```

#### Subclassable Built-ins

```js
class MyArray extends Array {
  constructor(...args) { super(...args); }
}
```

#### Math + Number + String + Object APIs

```js
Number.parseInt("42");
Number.isFinite(Infinity);
Math.sign(-5);
"hello".repeat(3);
Object.assign({}, { a: 1 });
```

#### Binary and Octal Literals

```js
0b111110111; // 503
0o767;       // 503
```

#### Promises

```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve("done"), 1000);
});
p.then(result => console.log(result));
```

#### Reflect API

```js
Reflect.has(Object, "assign"); // true
```

#### Tail Calls

```js
function factorial(n, acc = 1) {
  if (n <= 1) return acc;
  return factorial(n - 1, n * acc);
}
```

## Editors

Babel has editor integrations for syntax highlighting and tooling:
- **VS Code** — Built-in JS/TS support, Babel syntax via extensions
- **Sublime Text** — [babel-sublime](https://github.com/babel/babel-sublime)
- **Atom** — `language-babel` package
- **WebStorm/IntelliJ** — Built-in Babel support
- **Vim** — `vim-jsx` plugin
- **Emacs** — `js2-mode` with JSX support
