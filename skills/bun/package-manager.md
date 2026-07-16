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

## bun update

Update dependencies to their latest compatible versions.

```bash
bun update                     # update all
bun update react               # update specific package
bun update react@18.0.0        # update to specific version
bun update --latest            # ignore semver ranges, update to latest
bun update --interactive       # interactive mode (-i)
bun update --recursive         # update in all workspaces (-r)
bun update -i -r               # interactive + recursive
```

### --latest vs default

- `bun update` — updates to latest version satisfying `package.json` range (e.g. `^17.0.2` → `17.x.x`)
- `bun update --latest` — ignores range, updates to absolute latest (e.g. `^17.0.2` → `18.x.x`), also updates `package.json`

### Interactive mode

```bash
bun update --interactive
bun update -i
```

Shows a selectable list of outdated packages with keyboard controls.

## bun publish

Publish a package to the npm registry.

```bash
bun publish                         # publish to registry
bun publish --access public         # public access (default for new)
bun publish --access restricted     # restricted access
bun publish --tag alpha             # tag as "alpha" instead of "latest"
bun publish --dry-run               # simulate without publishing
bun publish --tolerate-republish    # allow re-publishing same version
bun publish --gzip-level 9          # compression level (0-9, default 9)
bun publish --auth-type legacy      # use legacy auth (prompts OTP)
bun publish --otp 123456            # provide OTP directly
```

### publishConfig in package.json

```json
{
  "publishConfig": {
    "access": "restricted",
    "tag": "next"
  }
}
```

## bun outdated

Check for outdated dependencies.

```bash
bun outdated                    # show all outdated
bun outdated react              # check specific package
bun outdated --filter 'pkg-*'   # filter by workspace pattern
```

### Version information

- **Current**: The version currently installed
- **Update**: The latest version that satisfies your `package.json` version range
- **Latest**: The latest version published to the registry

## bun why

Explain why a package is installed.

```bash
bun why react                   # why is react installed?
bun why "@types/*"              # glob patterns supported
bun why express --top           # only top-level dependencies
bun why express --depth 2       # limit tree depth
```

Output shows the dependency chain, dependency type (dev/peer/optional/production), and version requirements.

## bun audit

Check installed packages for known security vulnerabilities.

```bash
bun audit                       # check for vulnerabilities
bun audit --json                # JSON output
bun audit --audit-level=high    # minimum severity to report
bun audit --prod                 # only production dependencies
bun audit --ignore CVE-2022-25883  # ignore specific CVEs
```

Severity levels: `low`, `moderate`, `high`, `critical`. Exit code `0` if no vulnerabilities, `1` if found.

## bun info

Display package metadata from the npm registry.

```bash
bun info react                  # basic info
bun info react@18.0.0           # specific version
bun info react version          # specific property
bun info react dependencies     # view dependencies
bun info react repository.url   # nested property
bun info react versions         # all available versions
bun info react --json           # JSON output
```

Alias: `bun pm view react` is equivalent to `bun info react`.

## bun link

Link local packages for development.

```bash
# In the package directory
cd /path/to/cool-pkg
bun link                         # register globally

# In the consumer directory
cd /path/to/my-app
bun link cool-pkg                # link to local package

# Unlink
cd /path/to/cool-pkg
bun unlink                       # remove global link
```

## bun patch

Persistently patch `node_modules` packages in a git-friendly way.

### Workflow

```bash
# Step 1: Prepare package for patching
bun patch react
bun patch react@17.0.2
bun patch node_modules/react

# Step 2: Make your changes to the files in node_modules/

# Step 3: Commit the patch
bun patch --commit react
bun patch --commit react@17.0.2
bun patch --commit node_modules/react
bun patch --commit react --patches-dir=mypatches

# pnpm compatibility alias
bun patch-commit react
```

This generates `.patch` files in `patches/` and adds `patchedDependencies` to `package.json`. Patches are applied automatically on future `bun install`.

## Catalogs

Share common dependency versions across multiple packages in a monorepo.

### Define catalogs in root package.json

```json
{
  "name": "my-monorepo",
  "workspaces": {
    "packages": ["packages/*"],
    "catalog": {
      "react": "^19.0.0",
      "react-dom": "^19.0.0"
    },
    "catalogs": {
      "testing": {
        "jest": "30.0.0",
        "testing-library": "14.0.0"
      }
    }
  }
}
```

### Reference in workspace packages

```json
{
  "name": "app",
  "dependencies": {
    "react": "catalog:",
    "react-dom": "catalog:",
    "jest": "catalog:testing"
  }
}
```

- `catalog:` — references the default `catalog`
- `catalog:testing` — references a named catalog (`catalogs.testing`)

### Benefits

- Single source of truth for shared dependency versions
- Update once in root, applies to all workspaces
- Lockfile tracks resolved versions

## bun --filter

Select packages by pattern in a monorepo.

### Matching by package name

```bash
bun install --filter 'pkg-*'         # packages matching glob
bun install --filter '!pkg-c'        # exclude specific package
bun outdated --filter 'pkg-*'        # outdated for matching packages
```

### Matching by path

```bash
bun install --filter './packages/*'  # packages in ./packages/
bun install --filter '!./'           # exclude root package.json
```

### Running scripts with --filter

```bash
bun --filter '*' dev                 # run "dev" in all workspaces
bun --filter 'pkg-*' build           # run "build" in matching workspaces
bun --filter './packages/*' test     # run "test" in packages/
```

Supports parallel and sequential execution modes, with dependency-order awareness.

## Scopes and Registries

Configure private registries and scoped packages via `.npmrc`:

```ini
# Set default registry
registry=http://localhost:4873/

# Set registry for a specific scope
@myorg:registry=http://localhost:4873/

# Configure auth for a registry
//http://localhost:4873/:_authToken=${NPM_TOKEN}
//http://localhost:4873/:username=myusername
//http://localhost:4873/:_password=${NPM_PASSWORD}
```

### Via bunfig.toml

```toml
[install.scopes]
myorg = { url = "http://localhost:4873/", username = "myusername", password = "$NPM_PASSWORD" }
```

Auth options: `_authToken`, `username`, `_password` (base64), `_auth` (base64 `username:password`), `email`.

## .npmrc Support

Bun supports `.npmrc` files with the following options:

| Option | Description |
|--------|-------------|
| `registry` | Default registry URL |
| `@scope:registry` | Per-scope registry |
| `//url/:_authToken` | Auth token for registry |
| `link-workspace-packages` | Link workspace packages (`true`/`false`) |
| `save-exact` | Save exact versions (no `^`) |
| `ignore-scripts` | Skip lifecycle scripts |
| `dry-run` | Preview without installing |
| `cache` | Cache directory (`false` to disable) |
| `ca` / `cafile` | CA certificates |
| `omit` | Omit dependency types (`dev`/`peer`/`optional`) |
| `install-strategy` / `node-linker` | Installation strategy |
| `public-hoist-pattern` / `hoist-pattern` | Control hoisting |

All `.npmrc` options have equivalent `bunfig.toml` settings.

## Security Scanner API

Scan packages for security vulnerabilities before installation.

### Configuration

```toml
# bunfig.toml
[install.security]
scanner = "@oven/bun-security-scanner"
```

### How it works

- Scans all packages before installation
- Checks for CVEs, malicious packages, license compliance issues
- Displays security warnings and advisories
- Cancels installation if fatal advisories are found

### Security levels

- **Info**: Informational, installation proceeds
- **Warning**: Potential risk, installation proceeds with warning
- **Error**: Fatal, installation cancelled

## Global Cache

Bun stores all downloaded packages in a global cache to minimize re-downloads.

### How it works

- Packages are identified by `name` + `version` from `package.json`
- Cache is shared across all projects
- `bun install` copies from cache to `node_modules` using fast OS-level operations

### Installation backends (`--backend`)

| Backend | Platform | Description |
|---------|----------|-------------|
| `hardlink` | Linux, Windows (default) | Hard links files from cache |
| `clonefile` | macOS (default) | Uses `clonefile()` syscall |
| `clonefile_each_dir` | macOS | Clones each file individually |
| `copyfile` | Fallback | Copies files (slowest) |
| `symlink` | All | Symbolic links (for `file:` deps) |

```bash
bun install --backend hardlink
bun install --backend symlink
```

## Global Virtual Store

Install packages once; every project links to the same copy.

### Enabling

```toml
# bunfig.toml
[install]
linker = "isolated"
globalStore = true
```

```bash
BUN_INSTALL_GLOBAL_STORE=1 bun install --linker isolated
```

### Why it's fast

- Uses `clonefileat()` on macOS, `link()` on Linux, `copyfile()` as fallback
- Packages stored once in a global location
- `node_modules` contains symlinks to the global store
- Eliminates redundant copies across projects

## Isolated Installs

Strict dependency isolation similar to pnpm's approach.

### Enabling

```bash
# Command line
bun install --linker isolated
bun install --linker hoisted    # default

# bunfig.toml
[install]
linker = "isolated"
```

### Default behavior

`configVersion` in `bunfig.toml` controls the default:
- `configVersion = 1` — isolated (from pnpm)
- `configVersion = 0` — hoisted (from npm/yarn, default)

### How it works

- Each package gets its own `node_modules` with only its direct dependencies
- Dependencies are symlinked from a virtual store
- Prevents access to undeclared (phantom) dependencies
- Workspace packages are handled with symlinks

### Comparison with hoisted

| Feature | Hoisted | Isolated |
|---------|---------|----------|
| Phantom deps | Allowed | Prevented |
| Disk usage | Higher | Lower (shared) |
| Compatibility | npm-like | pnpm-like |
| Speed | Fast | Fast (with globalStore) |
