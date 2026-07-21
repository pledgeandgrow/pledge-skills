# pnpm — Configuration & Settings

## Configuration Sources

pnpm gets its configuration from:

1. **Command line** — flags passed to pnpm commands
2. **Environment variables** — `PNPM_CONFIG_*` and XDG variables
3. **`pnpm-workspace.yaml`** — per-project configuration (primary config file)
4. **Global config** — `~/.config/pnpm/config.yaml`
5. **`.npmrc`** — auth and registry settings only

Only auth and registry settings are read from `.npmrc` files. All other settings (like `hoistPattern`, `nodeLinker`, `shamefullyHoist`, etc.) must be configured in `pnpm-workspace.yaml` or the global config.

The `pnpm config` command can read and edit project and global configuration files.

### Environment Variable Expansion

Values in configuration files may contain env variables using `${NAME}` syntax:

```yaml
# With fallback
httpsProxy: "${HTTPS_PROXY:-http://default-proxy:8080}"

# Simple expansion
nodeOptions: "${NODE_OPTIONS:-} --experimental-vm-modules"
```

Since v11.5.3, env variables are not expanded in registry URL settings (`registry`, `registries`, `namedRegistries`) in `pnpm-workspace.yaml` for security reasons.

## Settings Reference (pnpm-workspace.yaml)

### Dependency Resolution Settings

#### overrides

Override any dependency in the dependency graph, including peer dependencies:

```yaml
overrides:
  "foo": "^1.0.0"
  "quux": "npm:@myorg/quux@^1.0.0"
  "bar@^2.1.0": "3.0.0"
  "qar@1>zoo": "2"           # override zoo only within qar@1
  "foo@1.0.0>bar": "-"       # remove bar from foo@1.0.0
```

**Convergence overrides** (v11.13.0+): A selector with an empty range (`"pkg@"`) rewrites a dependency edge only when its version satisfies the declared range:

```yaml
overrides:
  "form-data@": 4.0.6  # pins to 4.0.6 only for edges that already satisfy ^4.0.x
```

Rules for convergence overrides:
- Value must be an exact version (no ranges, dist-tags, or `-` removal)
- Only plain semver edges participate (not `workspace:`, `catalog:`, `npm:`, git/URL)
- Cannot be combined with a parent selector (`"parent>pkg@"` is rejected)
- Regular overrides always win over convergence overrides

**Overriding peer dependencies:**
- Semver ranges, `workspace:`, `catalog:` — peer dep is overridden and remains a peer
- `link:` or `file:` protocols — peer dep is moved to `dependencies`
- Removal (`-`) — peer dep is removed entirely

#### packageExtensions

Extend dependencies with missing peer dependencies or additional metadata:

```yaml
packageExtensions:
  "@babel/parser":
    peerDependencies:
      "@babel/types": "*"
```

#### allowedDeprecatedVersions

Allow specific deprecated versions without warnings:

```yaml
allowedDeprecatedVersions:
  "request": "*"
```

#### supportedArchitectures

Specify which architectures to install optional dependencies for:

```yaml
supportedArchitectures:
  os:
    - "linux"
    - "win32"
  cpu:
    - "x64"
    - "arm64"
  libc:
    - "glibc"
    - "musl"
```

#### minimumReleaseAge

Only install packages that have been published for at least N hours:

```yaml
minimumReleaseAge: 168  # 7 days
```

Related settings: `minimumReleaseAgeExclude`, `minimumReleaseAgeIgnoreMissingTime`, `minimumReleaseAgeStrict`.

#### trustPolicy / trustPolicyExclude / trustPolicyIgnoreAfter

Trust policies for package verification:

```yaml
trustPolicy:
  "trusted-publisher": true
trustPolicyExclude:
  "untrusted-publisher": true
trustPolicyIgnoreAfter: "30d"
```

#### registries / namedRegistries

Configure custom registries:

```yaml
registries:
  default: "https://registry.npmjs.org/"
  @myorg: "https://npm.myorg.com/"

namedRegistries:
  myorg:
    url: "https://npm.myorg.com/"
    authHeader: "Bearer ${NPM_TOKEN}"
```

### Dependency Hoisting Settings

#### hoist

- **Default:** `true`
- **Type:** boolean

When `true`, all dependencies are hoisted to `node_modules/.pnpm/node_modules`. This makes unlisted dependencies accessible to all packages inside `node_modules`.

#### hoistWorkspacePackages

- **Default:** `true`
- **Type:** boolean

When `true`, workspace packages are symlinked to the hoisted directory or root `node_modules`.

#### hoistPattern

- **Default:** `['*']`
- **Type:** string[]

Controls which packages are hoisted to `node_modules/.pnpm/node_modules`:

```yaml
hoistPattern:
  - "*eslint*"
  - "*babel*"
  # Exclude patterns with !
  - "*types*"
  - "!@types/react"
```

#### publicHoistPattern

- **Default:** `[]`
- **Type:** string[]

Hoists dependencies to the root `node_modules` directory (accessible to application code):

```yaml
publicHoistPattern:
  - "*plugin*"
```

Note: Setting `shamefullyHoist: true` is equivalent to `publicHoistPattern: ["*"]`.

#### shamefullyHoist

- **Default:** `false`
- **Type:** boolean

Creates a flat `node_modules` similar to npm/Yarn Classic. Useful for tooling that requires hoisted dependencies.

#### hoistingLimits

- **Added in:** v11.5.0
- **Default:** `none`
- **Type:** `none`, `workspaces`, `dependencies`

Controls how far dependencies are hoisted when using `nodeLinker: hoisted`:

- `none` — hoist as far as possible (default)
- `workspaces` — hoist only to each workspace package
- `dependencies` — hoist only to each workspace package's direct dependencies

### Node-Modules Settings

#### modulesDir

- **Default:** `node_modules`
- **Type:** path

The directory in which dependencies will be installed.

#### nodeLinker

- **Default:** `isolated`
- **Type:** `isolated`, `hoisted`, `pnp`

Defines the linker for installing Node packages:

- **`isolated`** — dependencies are symlinked from a virtual store at `node_modules/.pnpm` (pnpm's default, strict)
- **`hoisted`** — flat `node_modules` without symlinks (same as npm/Yarn Classic). Use when:
  - Tooling doesn't work well with symlinks (e.g., React Native)
  - Deploying to serverless providers that don't support symlinks (e.g., AWS Lambda)
  - Publishing with `bundledDependencies`
  - Running Node.js with `--preserve-symlinks`
- **`pnp`** — no `node_modules`. Plug'n'Play (used by Yarn Berry). Recommended to also set `symlink: false`.

#### symlink

- **Default:** `true`
- **Type:** boolean

When `false`, pnpm creates a virtual store directory without symlinks. Useful with `nodeLinker: pnp`.

#### enableModulesDir

- **Default:** `true`
- **Type:** boolean

When `false`, pnpm will not write files to the modules directory. Useful for FUSE-mounted modules directories.

#### virtualStoreDir

- **Default:** `node_modules/.pnpm`
- **Type:** path

The directory with links to the store. Can solve long path issues on Windows:

```yaml
virtualStoreDir: "C:\\my-project-store"
```

Or set to `.pnpm` and add to `.gitignore` for cleaner stacktraces.

#### virtualStoreDirMaxLength

- **Default:** 120 (Linux/macOS), 60 (Windows)
- **Type:** number

Maximum allowed length of directory names inside the virtual store.

#### virtualStoreOnly

- **Added in:** v11.0.0
- **Default:** `false`
- **Type:** boolean

When `true`, pnpm populates the virtual store without creating importer symlinks, hoisting, bin links, or running lifecycle scripts. Useful for pre-populating a store (e.g., Nix builds).

#### packageImportMethod

- **Default:** `auto`
- **Type:** `auto`, `hardlink`, `copy`, `clone`, `clone-or-copy`

Controls how packages are imported from the store:

- `auto` — try clone → hardlink → copy (fallback chain)
- `hardlink` — hard link packages from the store
- `copy` — copy packages from the store
- `clone` — copy-on-write (CoW) clone from the store (fastest, requires CoW filesystem like Btrfs)
- `clone-or-copy` — try clone, fallback to copy

#### modulesCacheMaxAge

- **Default:** 10080 (7 days in minutes)
- **Type:** number

Time after which orphan packages are removed from the modules directory.

#### dlxCacheMaxAge

- **Default:** 1440 (1 day in minutes)
- **Type:** number

Time after which dlx cache expires.

#### enableGlobalVirtualStore

- **Default:** `false`
- **Type:** boolean

When enabled, the virtual store is placed in the global store directory instead of per-project `node_modules/.pnpm`.

### Store Settings

#### storeDir

- **Default:** Platform-dependent (`~/AppData/Local/pnpm/store` on Windows, `~/Library/pnpm/store` on macOS, `~/.local/share/pnpm/store` on Linux)
- **Type:** path

The location where all packages are saved on disk. The store should always be on the same disk as the installation for hard-linking to work.

#### verifyStoreIntegrity

- **Default:** `true`
- **Type:** boolean

When `true`, file content is checked before linking from the store to `node_modules`.

#### strictStorePkgContentCheck

- **Default:** `true`
- **Type:** boolean

Strict validation of package names and versions in the store. Set to `false` if registries allow the same content under different names/versions.

### Network Settings

| Setting | Default | Type | Description |
|---------|---------|------|-------------|
| `httpsProxy` | `null` | url | Proxy for HTTPS requests |
| `httpProxy` | `null` | url | Proxy for HTTP requests |
| `noProxy` | `null` | string | Comma-separated domains to bypass proxy |
| `localAddress` | `undefined` | IP | Local interface IP for registry connections |
| `maxsockets` | `networkConcurrency * 3` | number | Max connections per origin |
| `strictSsl` | `true` | boolean | SSL key validation for HTTPS registry requests |

### Lockfile Settings

#### lockfile

- **Default:** `true`
- **Type:** boolean

When `false`, pnpm won't read or generate `pnpm-lock.yaml`.

#### preferFrozenLockfile

- **Default:** `true`
- **Type:** boolean

When `true` and the lockfile satisfies `package.json`, a headless installation is performed (skips dependency resolution).

#### lockfileIncludeTarballUrl

- **Default:** `false`
- **Type:** boolean

Adds the full tarball URL to every entry in `pnpm-lock.yaml`.

#### gitBranchLockfile

- **Default:** `false`
- **Type:** boolean

Generates lockfiles named by branch (e.g., `pnpm-lock.feature-foo.yaml`) to avoid merge conflicts.

#### mergeGitBranchLockfilesBranchPattern

- **Default:** `null`
- **Type:** array or null

Automatically merge git branch lockfiles for matching branches:

```yaml
mergeGitBranchLockfilesBranchPattern:
  - main
  - release*
```

#### peersSuffixMaxLength

- **Default:** 1000
- **Type:** number

Max length of peer IDs suffix in lockfile dependency keys.

### Peer Dependency Settings

#### autoInstallPeers

- **Default:** `true`
- **Type:** boolean

When `true`, missing non-optional peer dependencies are automatically installed. If conflicting versions are required, pnpm prints a warning and does not install any version.

#### dedupePeerDependents

- **Default:** `true`
- **Type:** boolean

Deduplicates packages with peer dependencies after peer resolution. When `true`, packages with the same non-conflicting peer deps share a single instance.

#### dedupePeers

- **Default:** `true`
- **Type:** boolean

Deduplicates peer dependencies.

#### strictPeerDependencies

- **Default:** `false`
- **Type:** boolean

When `true`, pnpm fails if a peer dependency is not satisfied.

#### resolvePeersFromWorkspaceRoot

- **Default:** `false`
- **Type:** boolean

When `true`, peer dependencies are resolved from the workspace root.

#### peerDependencyRules

Rules for handling peer dependency warnings:

```yaml
peerDependencyRules:
  allowedVersions:
    "react": "18"
  ignoreMissing:
    - "express"
```

### CLI Settings

#### color

- **Default:** `auto`
- **Type:** `auto`, `always`, `never`

Controls colors in output.

#### loglevel

- **Default:** `info`
- **Type:** `debug`, `info`, `warn`, `error`

Minimum log level to show. Use `--silent` to turn off all output.

#### recursiveInstall

- **Default:** `true`
- **Type:** boolean

When `true`, `pnpm install` behaves like `pnpm install -r` (installs all workspace packages).

#### engineStrict

- **Default:** `false`
- **Type:** boolean

When `true`, pnpm won't install packages incompatible with the current Node version.

#### pmOnFail

- **Added in:** v11.0.0
- **Default:** `download`
- **Type:** `download`, `error`, `warn`, `ignore`

Overrides `onFail` behavior for `packageManager` and `devEngines.packageManager`:

- `download` — download and run the declared pnpm version (default)
- `error` — fail the command
- `warn` — print a warning but continue
- `ignore` — skip the check entirely (for asdf, mise, Volta users)

#### ignoreWorkspaceRootCheck

- **Default:** `false`
- **Type:** boolean

When `true`, `pnpm install`/`pnpm add` from the root folder won't error without `-w` flag.

### Build Settings

#### ignoreScripts

- **Default:** `false`
- **Type:** boolean

Do not execute any scripts defined in `package.json` and its dependencies. Does not prevent `.pnpmfile.mjs` execution.

#### childConcurrency

- **Default:** 5
- **Type:** number

Maximum number of child processes for building `node_modules`.

#### sideEffectsCache

- **Default:** `true`
- **Type:** boolean

Use and cache results of install hooks. When scripts modify package contents, pnpm saves the prebuilt version for faster future installs.

#### sideEffectsCacheReadonly

- **Default:** `false`
- **Type:** boolean

Only use the side effects cache if present; don't create it for new packages.

#### verifyDepsBeforeRun

- **Default:** `install`
- **Type:** `install`, `warn`, `error`, `prompt`, `false`

Checks dependency state before running scripts:

- `install` — auto-run install if `node_modules` is outdated
- `warn` — print a warning
- `prompt` — prompt user for permission
- `error` — throw an error
- `false` — disable checks

#### strictDepBuilds

- **Added in:** v10.3.0
- **Default:** `true`
- **Type:** boolean

When `true`, installation exits with non-zero code if any dependencies have unreviewed build scripts.

#### allowBuilds / dangerouslyAllowAllBuilds

```yaml
# Allow specific packages to run build scripts
allowBuilds:
  "esbuild": true
  "sharp": true

# Allow all packages (dangerous!)
dangerouslyAllowAllBuilds: true
```

#### unsafePerm

- **Default:** `false` if running as root, else `true`
- **Type:** boolean

Enable UID/GID switching when running package scripts.

#### nodeOptions

- **Default:** `null`
- **Type:** string

Options passed to Node.js via `NODE_OPTIONS` for lifecycle scripts.

### Node.js Settings

#### nodeVersion

- **Default:** value from `node -v` (without `v` prefix)
- **Type:** exact semver version

Node.js version for checking `engines` setting:

```yaml
nodeVersion: 22.0.0
engineStrict: true
```

#### runtimeOnFail

- **Added in:** v11.0.0
- **Default:** `undefined`
- **Type:** `download`, `error`, `warn`, `ignore`

Overrides `onFail` for `devEngines.runtime` in the root project's `package.json`.

#### nodeDownloadMirrors

- **Added in:** v11.0.0
- **Type:** Record<string, string>

Custom Node.js download mirrors:

```yaml
nodeDownloadMirrors:
  release: "https://npmmirror.com/mirrors/node/"
  rc: "https://npmmirror.com/mirrors/node-rc/"
  nightly: "https://npmmirror.com/mirrors/node-nightly/"
```

### Versioning Settings

```yaml
versioning:
  fixed:
    - "web-app"
    - "api-server"
  ignore:
    - "docs"
  maxBump: "minor"
  lanes:
    - name: "feature-lane"
      packages: ["web-app"]
  epics:
    - name: "auth-epic"
      issues: [1, 2, 3]
  changelog:
    storage: "changelog.md"
```

### Other Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `savePrefix` | `^` | Version prefix for installed packages (`^`, `~`, or ``) |
| `tag` | `latest` | Default tag for `pnpm add` without version |
| `globalDir` | Platform-dependent | Directory for global packages |
| `globalBinDir` | Platform-dependent | Directory for global bin files |
| `npmrcAuthFile` | `~/.npmrc` | Path to registry auth tokens file |
| `stateDir` | Platform-dependent | Directory for `pnpm-state.json` |
| `cacheDir` | Platform-dependent | Cache directory (metadata, dlx cache) |
| `useStderr` | `false` | Write all output to stderr |
| `updateNotifier` | `true` | Show update notifications |
| `preferSymlinkedExecutables` | `true` (POSIX with hoisted) | Symlinks for executables instead of shims |
| `ignoreCompatibilityDb` | `false` | Disable automatic dependency patching |
| `resolutionMode` | `highest` | `highest`, `time-based`, or `lowest-direct` |
| `registrySupportsTimeField` | `false` | Registry returns `time` field in metadata |
| `extendNodePath` | `true` | Set `NODE_PATH` in command shims |
| `deployAllFiles` | `false` | Copy all files when deploying (ignore `files` field) |
| `dedupeDirectDeps` | `false` | Don't symlink already-rooted deps to subprojects |
| `optimisticRepeatInstall` | `true` | Fast check before installation |
| `requiredScripts` | `undefined` | Scripts required in every workspace package |
| `enablePrePostScripts` | `true` | Run pre/post scripts automatically |
| `scriptShell` | `null` | Shell for `pnpm run` scripts |
| `shellEmulator` | `false` | Use pnpm's shell emulator |
| `catalogMode` | — | Catalog behavior mode |
| `ci` | — | CI-specific settings |
| `cleanupUnusedCatalogs` | — | Remove unused catalog entries |

## package.json Fields

### engines

```json
{
  "engines": {
    "node": ">=22",
    "pnpm": ">=11"
  }
}
```

### engines.runtime

Added in v10.21.0. Specifies the Node.js runtime required by a dependency:

```json
{
  "engines": {
    "runtime": {
      "name": "node",
      "version": "^24.11.0",
      "onFail": "download"
    }
  }
}
```

### devEngines.runtime

Added in v10.14. Specifies JavaScript runtime engines for the project (Node.js, Deno, Bun):

```json
{
  "devEngines": {
    "runtime": {
      "name": "node",
      "version": "^24.4.0",
      "onFail": "download"
    }
  }
}
```

Multiple runtimes:

```json
{
  "devEngines": {
    "runtime": [
      { "name": "node", "version": "^24.4.0", "onFail": "download" },
      { "name": "deno", "version": "^2.4.3", "onFail": "download" }
    ]
  }
}
```

### devEngines.packageManager

Added in v11.0.0. Specifies pnpm version via ranges:

```json
{
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": ">=11.0.0 <12.0.0",
      "onFail": "download"
    }
  }
}
```

### dependenciesMeta

Additional metadata for dependencies:

```json
{
  "dependenciesMeta": {
    "my-workspace-pkg": {
      "injected": true
    }
  }
}
```

`dependenciesMeta.*.injected` — when `true`, the workspace dependency is hard-linked instead of symlinked.

### peerDependenciesMeta

```json
{
  "peerDependenciesMeta": {
    "react": {
      "optional": true
    }
  }
}
```

### publishConfig

```json
{
  "publishConfig": {
    "directory": "dist",
    "linkDirectory": true,
    "executableFiles": ["./bin/run.js"]
  }
}
```

## .npmrc (Auth Only)

pnpm reads auth and registry settings from `.npmrc`:

```ini
# Registry
registry=https://registry.npmjs.org/

# Auth token
//registry.npmjs.org/:_authToken=${NPM_TOKEN}

# Scoped registry
@myorg:registry=https://npm.myorg.com/
//npm.myorg.com/:_authToken=${MYORG_TOKEN}
```

## Configuration Sources

pnpm settings are divided into categories and loaded from multiple sources.

### Local Project Configuration

Project-level settings go in `pnpm-workspace.yaml`:

```yaml
nodeVersion: "22"
saveExact: true
```

### Global Configuration

The global YAML config file (`config.yaml`) is located at:
- If `$XDG_CONFIG_HOME` is set: `$XDG_CONFIG_HOME/pnpm/config.yaml`
- Windows: `~/AppData/Local/pnpm/config/config.yaml`
- macOS: `~/Library/Preferences/pnpm/config.yaml`
- Linux: `~/.config/pnpm/config.yaml`

The global rc file (for registry and auth settings only) is at:
- If `$XDG_CONFIG_HOME` is set: `$XDG_CONFIG_HOME/pnpm/rc`
- Windows: `~/AppData/Local/pnpm/config/rc`
- macOS: `~/Library/Preferences/pnpm/rc`
- Linux: `~/.config/pnpm/rc`

### Environment Variables

Environment variables whose names start with `pnpm_config_` (or `PNPM_CONFIG_`) are loaded into configuration. These override settings from `pnpm-workspace.yaml` but not CLI arguments.

pnpm no longer reads `npm_config_*` environment variables. Use `pnpm_config_*` instead (e.g., `pnpm_config_registry` instead of `npm_config_registry`).

```bash
pnpm_config_save_exact=true pnpm add foo
```

Other relevant environment variables:
- `CI` — influences install behavior (frozen lockfile in CI)
- `XDG_CACHE_HOME`, `XDG_CONFIG_HOME`, `XDG_DATA_HOME`, `XDG_STATE_HOME` — control pnpm directories

## Git Branch Lockfiles

Git branch lockfiles allow you to totally avoid lockfile merge conflicts and solve it later.

### Usage

Enable in `pnpm-workspace.yaml`:

```yaml
gitBranchLockfile: true
```

The lockfile name will be generated based on the current branch name. For example, branch `feature-1` produces `pnpm-lock.feature-1.yaml`.

```
<project_folder>/
├── pnpm-lock.yaml
├── pnpm-lock.feature-1.yaml
├── pnpm-lock.<branch_name>.yaml
```

Note: `/` in branch names is converted to `!` (e.g., `feature/1` → `pnpm-lock.feature!1.yaml`).

### Merging

```bash
pnpm install --merge-git-branch-lockfiles
```

All git branch lockfiles will be merged into one `pnpm-lock.yaml`.

### Branch Matching

Configure automatic merging on specific branches:

```yaml
mergeGitBranchLockfilesBranchPattern:
  - main
  - release*
```

## Finders

Added in v10.16.0. Finders let you search for dependencies matching custom criteria in `.pnpmfile.mjs`.

### Defining Finder Functions

Finder functions are declared under the `finders` export. Each receives a context object and returns:
- `true` — include this dependency
- `false` — skip it
- `string` — include and print the string as additional info

```javascript
export const finders = {
  react17: (ctx) => {
    return ctx.readManifest().peerDependencies?.react === "^17.0.0"
  }
}
```

### Using Finders

```bash
pnpm why --find-by=react17
```

### Returning Extra Metadata

```javascript
export const finders = {
  react17: (ctx) => {
    const manifest = ctx.readManifest()
    if (manifest.peerDependencies?.react === "^17.0.0") {
      return `license: ${manifest.license}`
    }
    return false
  }
}
```

Example use cases: find packages by license, detect minimum Node.js version, list dependencies with binaries, print funding URLs.

## Global Packages

In pnpm v11, global package management was redesigned for better isolation and reliability.

### Installing Global Packages

```bash
pnpm add -g <pkg>
pnpm add -g typescript prettier eslint
```

### Isolated Installations

Each globally installed package gets its own isolated installation directory with its own `package.json`, `node_modules/`, and lockfile. This prevents global packages from interfering with each other.

Stored at `{pnpmHomeDir}/global/v11/{hash}/`, where hash is derived from the set of packages installed together.

**Space-separated** = separate isolated installs:
```bash
pnpm add -g eslint prettier  # each gets own node_modules
```

**Comma-separated** = single install group:
```bash
pnpm add -g eslint,prettier  # shared node_modules, removed together
```

**Mixed:**
```bash
pnpm add -g eslint,prettier typescript  # eslint+prettier grouped, typescript separate
```

### Directory Layout

```
{pnpmHomeDir}/global/v11/
├── {hash-A} → symlink → ./{hash-A-target}/
├── {hash-A-target}/
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── node_modules/
│       ├── <pkg>/
│       └── .pnpm/
├── {hash-B} → symlink → ./{hash-B-target}/
└── store/  ← shared global virtual store
```

### Listing Global Packages

```bash
pnpm list -g
pnpm list -g --json
pnpm list -g --parseable
```

`--depth>0` only works with a single install group or a positional argument: `pnpm list -g eslint --depth=1`.

### Managing Global Packages

```bash
pnpm add -g <pkg>
pnpm remove -g <pkg>
pnpm update -g [pkg]
pnpm list -g
```

`pnpm install -g` (without arguments) is not supported.

### Binaries Location

Globally installed binaries are stored in `$PNPM_HOME/bin/`. After upgrading to pnpm v11, run `pnpm setup` to update shell configuration.

```bash
pnpm bin -g  # check global bin directory
```

### Build Script Approval

Global packages with build scripts require approval. Pre-approve with `--allow-build`:

```bash
pnpm add -g --allow-build=esbuild esbuild
```

## Command Line Tab-Completion

[pnpm-shell-completion](https://github.com/g-plane/pnpm-shell-completion) is a shell plugin maintained by Pig Fang.

Features:
- Completion for `pnpm --filter <package>`
- Completion for `pnpm remove` (including workspace packages with `--filter`)
- Completion for scripts in `package.json`

Note: Completion for pnpm v9+ is incompatible with older pnpm versions.

## pnpr (Registry Server)

pnpr is a pnpm-compatible npm registry server, written in Rust. It is a separate product from the pnpm CLI.

### Use Cases

- **Private registry** — host organization's private packages with per-package access rules
- **Caching proxy** — mirror upstream registry (e.g., npmjs.org) for faster installs and resilience
- **Credential gateway** — hold one upstream token server-side, fan out to team via pnpr's own auth
- **Install accelerator** — resolve dependency graph server-side, hand pnpm a ready-to-use lockfile

### Relationship to pnpm

pnpr is separate from the pnpm CLI. You can use either without the other, but they're designed to work together — pnpm can offload dependency resolution to a pnpr server.

### License

pnpr is source-available under PolyForm Shield License 1.0.0 (not MIT). You may run, modify, and self-host for any purpose except providing a competing product.

## FAQ

### Why does node_modules use disk space if packages are in a global store?

pnpm creates hard links from the global store. Hard links point to the same place on disk. So 1MB in the store and 1MB in `node_modules` is the same 1MB, not 2MB.

### Does it work on Windows?

Yes. If Developer Mode is off, pnpm uses junctions instead of symbolic links.

### What about circular symlinks?

Circular symlinks are avoided because parent packages are placed in the same `node_modules` folder as their dependencies. foo's dependencies are not in `foo/node_modules`, but foo is alongside its dependencies in `node_modules`.

### Why hard links instead of symlinking to the global store?

A package can have different dependency sets across projects. Hard linking foo@1.0.0 to each project allows different dependency trees. Direct symlinking would work with Node's `--preserve-symlinks` but comes with many issues.

### Does pnpm work across Btrfs subvolumes?

Btrfs doesn't allow cross-subvolume hardlinks, but it permits reflinks. pnpm uses reflinks in this case.

### Does pnpm work across multiple drives/filesystems?

The store should be on the same drive and filesystem as installations, otherwise packages will be copied, not linked.

- **Store path specified:** Copying occurs between store and projects on different disks.
- **Store path NOT specified:** Multiple stores are created (one per drive/filesystem).

### What does pnpm stand for?

pnpm stands for "performant npm."

### pnpm does not work with my project?

Usually a dependency requires packages not declared in `package.json` (phantom dependency). Solutions:

1. **Use `nodeLinker: hoisted`** — creates flat `node_modules` like npm
2. **Add missing dependency** — `pnpm add iterall` to add the missing package
3. **Use hooks** — add missing deps via `.pnpmfile.mjs`:

```javascript
export const hooks = {
  readPackage: (pkg) => {
    if (pkg.name === "inspectpack") {
      pkg.dependencies['babel-traverse'] = '^6.26.0';
    }
    return pkg;
  }
}
```

Use `npmrcAuthFile` setting to point to a custom auth file.
