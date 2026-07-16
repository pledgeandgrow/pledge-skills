# Bun Package Manager

Bun includes a fast, Node.js-compatible package manager — a replacement for `npm`, `yarn`, and `pnpm`.

## bun install

### Install all dependencies

```bash
bun install
```

- Installs all `dependencies`, `devDependencies`, and `optionalDependencies`
- Installs `peerDependencies` by default
- Runs your project's `{pre|post}install` and `{pre|post}prepare` scripts
- Does NOT execute lifecycle scripts of installed dependencies (security)
- Writes a `bun.lock` lockfile to the project root

### Install a specific package

```bash
bun install react
bun install react@19.1.1    # specific version
bun install react@latest    # specific tag
```

### Short form

```bash
bun i react
bun i react@19
```

### Install as dev dependency

```bash
bun install -d @types/bun
bun install --dev typescript
```

### Install as peer dependency

```bash
bun install --peer zod
```

### Install as optional dependency

```bash
bun install --optional nodemon
```

### Install exact version

```bash
bun install --exact react@19.1.1
# or
bun install -E react@19.1.1
```

## bun add

`bun add` is an alias for `bun install` that always saves to `package.json`:

```bash
bun add react
bun add -d @types/react
bun add react@^19
```

## bun remove

```bash
bun remove react
```

Removes from `package.json` and `node_modules`.

## Global packages

```bash
bun install --global cowsay
# or
bun install -g cowsay

cowsay "Bun!"
```

Global packages go into `~/.bun/install/global/node_modules`.

## Production mode

```bash
bun install --production
```

Skips `devDependencies`.

### Frozen lockfile (CI/CD)

```bash
bun install --frozen-lockfile
```

Does not modify `bun.lock`. Fails if lockfile is out of date.

## Omitting dependencies

```bash
bun install --omit dev          # exclude devDependencies
bun install --omit=dev --omit=peer --omit=optional
```

## Workspaces

Monorepo support via `workspaces` in `package.json`:

```json
{
  "name": "my-monorepo",
  "workspaces": ["packages/*"],
  "dependencies": {
    "preact": "^10.5.13"
  }
}
```

```bash
bun install  # installs all workspace dependencies
```

### Install for specific workspaces

```bash
bun install --filter "pkg-*"
bun install --filter '!pkg-c'
bun install --filter './packages/pkg-a'
```

### Workspace dependencies

If package `b` depends on `a`, add it in `package.json`:

```json
{
  "name": "b",
  "dependencies": {
    "a": "workspace:*"
  }
}
```

Bun installs the local `packages/a` directory instead of downloading from npm.

## Overrides and Resolutions

Force a specific version of a transitive dependency:

```json
{
  "name": "my-app",
  "dependencies": { "foo": "^2.0.0" },
  "overrides": { "bar": "~4.4.0" }
}
```

## Lockfile

Bun v1.2+ uses a text-based `bun.lock` format (replacing binary `bun.lockb`).

### Generate lockfile only

```bash
bun install --lockfile-only
```

### Install without saving lockfile

```bash
bun install --no-save
```

### Automatic migration

Bun automatically migrates existing lockfiles:
- `package-lock.json` (npm)
- `yarn.lock` (v1)
- `pnpm-lock.yaml` (pnpm)

## Non-npm dependencies

```json
{
  "dependencies": {
    "dayjs": "git+https://github.com/iamkun/dayjs.git",
    "lodash": "git+ssh://github.com/lodash/lodash.git#4.17.21",
    "moment": "git@github.com:moment/moment.git",
    "zod": "github:colinhacks/zod",
    "react": "https://registry.npmjs.org/react/-/react-18.2.0.tgz",
    "bun-types": "npm:@types/bun"
  }
}
```

## Lifecycle scripts

Bun runs your project's scripts but NOT dependency scripts by default (security).

### Trusted dependencies

Allow specific packages to run lifecycle scripts:

```json
{
  "name": "my-app",
  "trustedDependencies": ["esbuild", "sharp"]
}
```

### Concurrent scripts

```bash
bun install --concurrent-scripts 5
```

## Configuration

### bunfig.toml

```toml
[install]
optional = true
dev = true
peer = true
production = false
frozenLockfile = false
dryRun = false
concurrentScripts = 16
linker = "hoisted"
minimumReleaseAge = 259200
minimumReleaseAgeExcludes = ["@types/node", "typescript"]
```

### Environment variables

| Variable | Description |
|----------|-------------|
| `BUN_CONFIG_REGISTRY` | npm registry URL |
| `BUN_CONFIG_TOKEN` | Registry auth token |
| `BUN_CONFIG_YARN_LOCKFILE` | Write Yarn lockfile |
| `BUN_CONFIG_SKIP_SAVE_LOCKFILE` | Skip saving lockfile |
| `BUN_CONFIG_SKIP_LOAD_LOCKFILE` | Skip loading lockfile |
| `BUN_CONFIG_SKIP_INSTALL_PACKAGES` | Skip installing packages |

## Installation strategies

### Hoisted (default)

Dependencies are hoisted to the top of `node_modules`. Compatible with npm.

### Isolated

Each package gets its own `node_modules`. More strict, similar to pnpm.

## bun pm

Additional package manager commands:

```bash
bun pm ls          # list installed packages
bun pm ls -a       # list all (including transitive)
bun pm cache       # cache management
bun pm cache rm    # clear cache
```

## CLI Usage Summary

```bash
bun install                    # install all
bun install <pkg>              # install a package
bun install -d <pkg>           # install as devDependency
bun install -g <pkg>           # install globally
bun install --production       # skip devDependencies
bun install --frozen-lockfile  # CI/CD mode
bun install --dry-run          # don't actually install
bun add <pkg>                  # alias for install --save
bun remove <pkg>               # remove a package
bun pm ls                      # list installed packages
```
