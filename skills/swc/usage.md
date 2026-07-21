# SWC Usage

## @swc/cli

### Basic Commands

```bash
# Transpile one file and emit to stdout
npx swc ./file.js

# Transpile one file and emit to output.js
npx swc ./file.js -o output.js

# Transpile and write to /output dir
npx swc ./my-dir -d output
```

### CLI Flags

| Flag | Description |
|------|-------------|
| `--filename`, `-f` | Filename to use when reading from stdin (used in source maps and errors) |
| `--config-file` | Path to a `.swcrc` file to use |
| `--env-name` | Name of the 'env' to use when loading configs (defaults to `SWC_ENV`, `NODE_ENV`, or `development`) |
| `--no-swcrc` | Disable looking up `.swcrc` files |
| `--ignore` | List of glob paths to not compile |
| `--only` | List of glob paths to only compile |
| `--watch`, `-w` | Automatically recompile files on changes (requires `chokidar`) |
| `--quiet`, `-q` | Suppress compilation output |
| `--source-maps`, `-s` | Enable source maps (`true\|false\|inline\|both`) |
| `--source-map-target` | Define the file for the source map |
| `--source-file-name` | Set `sources[0]` on returned source map |
| `--source-root` | The root from which all sources are relative |
| `--out-file`, `-o` | Compile all input files into a single file |
| `--out-dir`, `-d` | Compile an input directory into an output directory |
| `--copy-files` | When compiling a directory, copy non-compilable files |
| `--include-dotfiles` | Include dotfiles when compiling and copying |

### Watch Mode

Install chokidar first:

```bash
npm install -D chokidar
```

Then use the `-w` flag:

```bash
npx swc input.js -w
```

### Compiling Flow

To compile Flow code with the CLI, point swc at a `.swcrc` that sets `jsc.parser.syntax` to `"flow"`:

```json
{
  "jsc": {
    "parser": {
      "syntax": "flow"
    }
  }
}
```

```bash
npx swc input.js --config-file .swcrc -o output.js
```

For JSX-flavored Flow files, set `jsx: true` and compile `.jsx` inputs.

## @swc/core

Core SWC APIs mainly useful for build tool authors.

### transform()

```js
import swc from "@swc/core";

const output = await swc.transform("const value: number = 1;", {
  jsc: {
    parser: {
      syntax: "typescript",
    },
    target: "es2015",
  },
});

console.log(output.code); // transformed code
console.log(output.map);  // source map (if enabled)
```

Returns `Promise<{ code: string, map?: string }>`.

### transformSync()

Synchronous version of `transform()`:

```js
const output = swc.transformSync(source, options);
```

### transformFile()

Transform a file from disk:

```js
const output = await swc.transformFile("./file.js", {
  jsc: {
    parser: {
      syntax: "typescript",
    },
  },
});
```

### transformFileSync()

Synchronous version of `transformFile()`.

### minify()

```js
const output = await swc.minify("var x = 1;", {
  compress: true,
  mangle: true,
});
```

### minifySync()

Synchronous version of `minify()`.

### bundle()

Bundle multiple files (spack/swcpack — deprecated in v2):

```js
const output = await swc.bundle({
  entry: {
    web: __dirname + "/src/web.ts",
  },
  output: {
    path: __dirname + "/lib",
  },
});
```

### Transforming Flow with @swc/core

```js
import swc from "@swc/core";

await swc.transform("const value: number = 1;", {
  jsc: {
    parser: {
      syntax: "flow",
    },
  },
});
```

## Flow Support

SWC can parse Flow syntax and strip Flow type-only constructs during transform.

### .swcrc for Flow

```json
{
  "$schema": "https://swc.rs/schema.json",
  "jsc": {
    "parser": {
      "syntax": "flow",
      "jsx": false
    }
  }
}
```

### Flow with requireDirective

For Flow code that uses a file pragma:

```json
{
  "jsc": {
    "parser": {
      "syntax": "flow",
      "requireDirective": true
    }
  }
}
```

### Flow Parser Options

```json
{
  "jsc": {
    "parser": {
      "syntax": "flow",
      "all": false,
      "enums": false,
      "decorators": false,
      "components": false,
      "patternMatching": false
    }
  }
}
```

## @swc/wasm

This module allows you to synchronously transform code inside the browser using WebAssembly.

You must first initialize the module before you can use it.

## @swc/jest

Drop-in Rust replacement for ts-jest to make Jest tests run faster.

### Installation

```bash
npm install -D jest @swc/core @swc/jest
```

### Configuration

In `jest.config.js`:

```js
module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
};
```

It will load SWC configuration from `.swcrc` by default. You can also customize:

```js
const fs = require('fs');
const config = JSON.parse(fs.readFileSync(`${__dirname}/.swcrc`, 'utf-8'));

module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { ...config, /* custom configuration */ }],
  },
};
```

### ESM with Jest

For JavaScript, edit `package.json`:

```json
{
  "type": "module"
}
```

For TypeScript, edit `jest.config.js`:

```js
module.exports = {
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};
```

Run with `--experimental-vm-modules`:

```bash
cross-env NODE_OPTIONS=--experimental-vm-modules jest
```

### Custom Target

By default, `jsc.target` is set to the version supported by your Node runtime. Customize:

```js
module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          target: "es2021",
        },
      },
    ],
  },
};
```

## swc-loader

Use SWC with webpack. For Rspack users, use Rspack's builtin:swc-loader (no package install needed).

### Installation

```bash
npm install -D @swc/core swc-loader
```

### Usage

```js
module: {
  rules: [
    {
      test: /\.m?js$/,
      exclude: /(node_modules)/,
      use: {
        // `.swcrc` can be used to configure swc
        loader: "swc-loader"
      }
    }
  ]
}
```

### Options

Loader options are passed through to SWC as if they were part of `.swcrc`:

```js
{
  use: {
    loader: "swc-loader",
    options: {
      env: {
        targets: "defaults",
        debug: true
      }
    }
  }
}
```

### React Development

`jsc.transform.react.development` is automatically set based on webpack `mode`.

### With babel-loader

When used with `babel-loader`, set `parseMap: true`:

```js
module: {
  rules: [
    {
      test: /\.m?js$/,
      exclude: /(node_modules)/,
      use: {
        loader: "swc-loader",
        options: {
          parseMap: true
        }
      }
    }
  ]
}
```

## @swc/html

HTML minification using SWC.

### Installation

```bash
npm install -D @swc/html
```

### minify() / minifySync()

For minifying a whole HTML document:

```js
import { minify } from '@swc/html';

const html = await minify('<div>Hello, world!</div>', {});
```

### minifyFragment() / minifyFragmentSync()

For minifying an HTML fragment:

```js
import { minifyFragment } from '@swc/html';

const html = await minifyFragment('<div>Hello, world!</div>', {});
```

## Bundling (spack/swcpack)

> **Note**: This feature will be dropped in v2. Use SWC-based bundlers like Parcel 2, Turbopack, Rspack, or [fe-farm](https://www.farmfe.org/) instead.

SWC can bundle multiple JavaScript or TypeScript files into one. Currently named `spack`, will be renamed to `swcpack` in v2.

### Usage

```bash
npx spack
```

### spack.config.js

```js
const { config } = require("@swc/core/spack");

module.exports = config({
  entry: {
    web: __dirname + "/src/web.ts",
    android: __dirname + "/src/android.ts",
  },
  output: {
    path: __dirname + "/lib",
  },
  module: {},
});
```

### Features

- **Compact output**: Like rollup, SWC emits compact output
- **Scope hoisting**: Naming collisions between files are automatically handled
- **Tree shaking**: Removes unused exports
- **Import deglobbing**: `import * as lib from "lib"; lib.foo();` becomes `import { foo } from "lib"; foo();`
- **CommonJS interop**: Supports importing CommonJS modules
- **Dead code elimination**: Global inlining, constant propagation, DCE
- **Multi-core**: Uses all CPU cores, optimized by LLVM

## @swc/wasm-typescript

WASM-based SWC for TypeScript transformation in the browser.

### Installation

```bash
npm install @swc/wasm-typescript
# or
yarn add @swc/wasm-typescript
# or
pnpm add @swc/wasm-typescript
# or
bun add @swc/wasm-typescript
# or
deno add npm:@swc/wasm-typescript
```

### Usage

```js
import { transform } from '@swc/wasm-typescript';

const tsSourceCode = `
export function add(a: number, b: number) {
  return a + b;
}
`;
const code = await transform(tsSourceCode, {});
```

### APIs

- `transform(src: string | Uint8Array, opts?: Options): Promise<TransformOutput>`
- `transformSync(src: string, options: Options): string`

### Options Type

```ts
type Options = {
  // Defaults to 'unknown', which automatically detects the module type.
  module?: boolean | 'unknown';
  filename?: string;
  parser?: TsSyntax;
};
```

## Benchmarks

SWC benchmarks evaluate performance on every commit against Babel and esbuild.

### Benchmark Categories

- **Transformations (Parallel)**: Most important — build tool authors run tasks concurrently. Babel and tsx have identical parallel/sync performance.
- **Transformations (Synchronous)**: Less critical than parallel.
- **Transformations (Asynchronous)**: Does not use all CPU cores. One task at a time on Node.js thread pool.

### Tested Targets

Each category benchmarks: es3, es5, es2015, es2016, es2017, es2018, es2019, es2020

Benchmark source: [bench.yml](https://github.com/swc-project/swc/blob/main/.github/workflows/bench.yml)
