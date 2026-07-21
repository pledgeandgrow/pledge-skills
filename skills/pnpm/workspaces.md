# pnpm — Workspaces, Catalogs, Filtering & Hooks

## Workspaces

pnpm has built-in support for monorepositories (multi-package repositories). A workspace must have a `pnpm-workspace.yaml` file in its root.

### Setup

Create a `pnpm-workspace.yaml` file:

```yaml
packages:
  - "packages/*"
  - "apps/*"
  - "tools/*"
  # Exclude directories
  - "!**/test/**"
```

Workspace structure:

```
my-monorepo/
├── pnpm-workspace.yaml
├── package.json
├── pnpm-lock.yaml      # shared lockfile
├── node_modules/       # shared at root
├── packages/
│   ├── ui-components/
│   │   ├── package.json
│   │   └── node_modules/   # symlinks to root
│   ├── utils/
│   │   ├── package.json
│   │   └── node_modules/
│   └── api/
│       ├── package.json
│       └── node_modules/
└── apps/
    ├── web/
    │   ├── package.json
    │   └── node_modules/
    └── mobile/
        ├── package.json
        └── node_modules/
```

### Workspace Protocol (workspace:)

When `linkWorkspacePackages` is `true`, pnpm links packages from the workspace if versions match. The `workspace:` protocol makes this explicit and prevents accidental registry resolution:

```json
{
  "dependencies": {
    "foo": "workspace:*",
    "bar": "workspace:^2.0.0",
    "qar": "workspace:~",
    "zoo": "workspace:^1.5.0"
  }
}
```

If `bar@2.0.0` is not in the workspace, installation fails.

#### Referencing Workspace Packages Through Aliases

```json
{
  "dependencies": {
    "bar": "workspace:foo@*"
  }
}
```

Before publish, aliases are converted: `"bar": "workspace:foo@*"` → `"bar": "npm:foo@1.0.0"`.

#### Referencing Through Relative Paths

```json
{
  "dependencies": {
    "foo": "workspace:../foo"
  }
}
```

Before publishing, these specs are converted to regular version specs.

#### Publishing Workspace Packages

When a workspace package is packed or published, `workspace:` dependencies are dynamically replaced:

| Spec | Replacement (if version is 1.5.0) |
|------|-----------------------------------|
| `workspace:*` | `1.5.0` |
| `workspace:` | `1.5.0` (bare = `workspace:*`) |
| `workspace:~` | `~1.5.0` |
| `workspace:^` | `^1.5.0` |
| `workspace:^1.5.0` | `^1.5.0` |

This allows local development with workspace linking while publishing to the registry with proper semver ranges.

### Release Workflow

pnpm does not provide built-in versioning for workspaces. Recommended tools:

- **[Changesets](https://github.com/changesets/changesets)** — versioning and changelog management
- **[Rush](https://rushjs.io)** — scalable monorepo management

### Troubleshooting

**Cyclic workspace dependencies:** pnpm warns about cycles between workspace dependencies. Inspect `dependencies`, `optionalDependencies`, and `devDependencies` for cycles.

Settings to control cycle behavior:

- `ignoreWorkspaceCycles: true` — suppress cycle warnings
- `disallowWorkspaceCycles: true` — fail installation if cycles exist

### Workspace Configuration

| Setting | Default | Type | Description |
|---------|---------|------|-------------|
| `linkWorkspacePackages` | `false` | `true`, `false`, `deep` | Link local workspace packages instead of downloading from registry |
| `injectWorkspacePackages` | `false` | boolean | Hard-link workspace dependencies instead of symlinking |
| `dedupeInjectedDeps` | `true` | boolean | Symlink injected deps when possible to avoid duplication |
| `syncInjectedDepsAfterScripts` | `undefined` | string[] | Scripts that trigger synchronization of injected dependencies |
| `preferWorkspacePackages` | `false` | boolean | Prefer local workspace packages over registry, even if newer |
| `sharedWorkspaceLockfile` | `true` | boolean | Single `pnpm-lock.yaml` at workspace root |
| `saveWorkspaceProtocol` | `rolling` | `true`, `false`, `rolling` | How workspace deps are saved to `package.json` |
| `includeWorkspaceRoot` | `false` | boolean | Include workspace root in recursive commands |
| `ignoreWorkspaceCycles` | `false` | boolean | Suppress cycle warnings |
| `disallowWorkspaceCycles` | `false` | boolean | Fail on cyclic dependencies |
| `failIfNoMatch` | `false` | boolean | Exit non-zero if no packages match filters |

#### saveWorkspaceProtocol

Controls how workspace dependencies are added to `package.json`:

| `savePrefix` | `saveWorkspaceProtocol: true` | `saveWorkspaceProtocol: false` | `saveWorkspaceProtocol: rolling` |
|--------------|-------------------------------|-------------------------------|---------------------------------|
| `""` | `workspace:1.0.0` | `1.0.0` | `workspace:*` |
| `~` | `workspace:~1.0.0` | `~1.0.0` | `workspace:~` |
| `^` | `workspace:^1.0.0` | `^1.0.0` | `workspace:^` |

**`rolling`** (default): uses `workspace:*`/`workspace:~`/`workspace:^` (rolling ranges that always match the latest workspace version).

## Catalogs

Catalogs are a workspace feature for defining dependency version ranges as reusable constants. Constants defined in catalogs can be referenced in `package.json` files.

### The Catalog Protocol (catalog:)

Define a catalog in `pnpm-workspace.yaml`:

```yaml
packages:
  - "packages/*"

catalog:
  react: ^18.3.1
  redux: ^5.0.1
  typescript: ^5.6.0
```

Reference it in `package.json`:

```json
{
  "name": "@example/app",
  "dependencies": {
    "react": "catalog:",
    "redux": "catalog:"
  },
  "devDependencies": {
    "typescript": "catalog:"
  }
}
```

This is equivalent to writing the version range directly (`^18.3.1`).

### Where catalog: Can Be Used

- **`package.json`:** `dependencies`, `devDependencies`, `peerDependencies`, `optionalDependencies`
- **`pnpm-workspace.yaml`:** `overrides`

### Advantages

- **Maintain unique versions** — one version of a dependency across the workspace
- **Easier upgrades** — edit only the catalog entry in `pnpm-workspace.yaml`
- **Fewer merge conflicts** — `package.json` files don't need editing when upgrading

### Default Catalog

The top-level `catalog` field creates a catalog named `default`:

```yaml
catalog:
  react: ^18.2.0
  react-dom: ^18.2.0
```

Referenced via `catalog:default` or the shorthand `catalog:`.

### Named Catalogs

Multiple catalogs with custom names under the `catalogs` key:

```yaml
catalog:
  react: ^16.14.0
  react-dom: ^16.14.0

catalogs:
  react17:
    react: ^17.0.2
    react-dom: ^17.0.2
  react18:
    react: ^18.2.0
    react-dom: ^18.2.0
```

Reference named catalogs with `catalog:<name>`:

```json
{
  "dependencies": {
    "react": "catalog:react18",
    "react-dom": "catalog:react18"
  }
}
```

### Publishing

When publishing, `catalog:` references are replaced with the actual version ranges, just like `workspace:` protocol.

### Catalog Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `catalogMode` | — | Catalog behavior mode |
| `cleanupUnusedCatalogs` | — | Remove unused catalog entries |

### Migration

Use the codemod to migrate an existing workspace to catalogs:

```bash
pnpx codemod pnpm/catalog
```

## Filtering

Filtering allows you to restrict commands to specific subsets of packages using the `--filter` (or `-F`) flag:

```bash
pnpm --filter <package_selector> <command>
```

### Matching

#### --filter <package_name>

Select an exact package or pattern:

```bash
pnpm --filter "@babel/core" test
pnpm --filter "@babel/*" test
pnpm --filter "*core" test
```

#### --filter <package_name>...

Select a package and all its dependencies (direct and transitive):

```bash
pnpm --filter foo... test
pnpm --filter "@babel/preset-*..." test
```

#### --filter <package_name>^...

Select ONLY the dependencies of a package (not the package itself):

```bash
pnpm --filter "foo^..." test
```

#### --filter ...<package_name>

Select a package and all its dependents (packages that depend on it):

```bash
pnpm --filter ...foo test
```

#### --filter "...^<package_name>"

Select ONLY the dependents of a package (not the package itself):

```bash
pnpm --filter "...^foo" test
```

#### --filter ./<glob> or --filter {<glob>}

Glob pattern relative to the current directory:

```bash
pnpm --filter "./packages/**" build
pnpm --filter "...{packages/**}" test
pnpm --filter "{packages/**}..." build
pnpm --filter "...{packages/**}..." test
```

#### --filter "[<since>]"

Select packages changed since a commit/branch:

```bash
pnpm --filter "...[origin/master]" test
pnpm --filter "{packages/**}[origin/master]" build
```

### Excluding

Prefix with `!` to exclude:

```bash
pnpm --filter "!@babel/core" --filter "@babel/*" test
```

### Multiplicity

Multiple `--filter` flags are combined with OR logic. Use `!` for NOT:

```bash
pnpm --filter "@babel/*" --filter "!@babel/core" test
```

### Additional Filter Options

| Option | Description |
|--------|-------------|
| `--filter-prod <pattern>` | Same as `--filter` but only considers `dependencies` and `optionalDependencies` |
| `--test-pattern <glob>` | Only run on packages with files matching the glob |
| `--changed-files-ignore-pattern <glob>` | Ignore changed files matching the glob when using `[<since>]` |
| `--fail-if-no-match` | Exit non-zero if no packages match |

## .pnpmfile.mjs Hooks

pnpm lets you hook directly into the installation process via `.pnpmfile.mjs`.

### hooks.readPackage(pkg, context)

Mutate a dependency's `package.json` after parsing and prior to resolution. Mutations affect the lockfile but are not saved to the filesystem.

```javascript
function readPackage(pkg, context) {
  // Override the manifest of foo@1.x
  if (pkg.name === 'foo' && pkg.version.startsWith('1.')) {
    pkg.dependencies = { ...pkg.dependencies, bar: '^2.0.0' }
    context.log('bar@1 => bar@2 in dependencies of foo')
  }
  // Change any packages using baz to use baz@1.2.3
  if (pkg.dependencies?.baz) {
    pkg.dependencies.baz = '1.2.3'
  }
  return pkg
}

export const hooks = { readPackage }
```

**Arguments:**
- `pkg` — the manifest of the package (registry response or `package.json` content)
- `context` — context object with `#log(msg)` method for debug logging

**Known limitations:** Removing the `scripts` field via `readPackage` won't prevent building. Use `allowBuilds` setting to ignore builds.

### hooks.updateConfig(config)

Added in v10.8.0. Modify configuration settings used by pnpm. Useful with `configDependencies` for sharing settings across repositories.

```javascript
export const hooks = {
  updateConfig(config) {
    return Object.assign(config, {
      enablePrePostScripts: false,
      optimisticRepeatInstall: true,
      resolutionMode: 'lowest-direct',
      verifyDepsBeforeRun: 'install',
    })
  }
}
```

### hooks.afterAllResolved(lockfile, context)

Mutate the lockfile after resolution:

```javascript
function afterAllResolved(lockfile, context) {
  // Modify lockfile
  return lockfile
}

export const hooks = { afterAllResolved }
```

### hooks.beforePacking(pkg)

Modify a package before packing:

```javascript
function beforePacking(pkg) {
  // Modify package before packing
  return pkg
}

export const hooks = { beforePacking }
```

### hooks.preResolution(options)

Called before resolution:

```javascript
async function preResolution(options) {
  // Perform pre-resolution tasks
}

export const hooks = { preResolution }
```

### hooks.importPackage(destinationDir, options)

Control how a package is imported from the store:

```javascript
async function importPackage(destinationDir, options) {
  // Custom import logic
  return undefined // return undefined for default behavior
}

export const hooks = { importPackage }
```

### hooks.fetchers

Custom fetchers for controlling how packages are fetched from the store.

### Custom Resolvers

Define custom resolvers to override how package specifiers are resolved:

```javascript
const resolvers = {
  // Custom resolution logic
}

export const hooks = { resolvers }
```

### Custom Fetchers

Define custom fetchers to control how packages are fetched:

```javascript
const fetchers = {
  // Custom fetch logic
}

export const hooks = { fetchers }
```

### Related Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `ignorePnpmfile` | `false` | Ignore `.pnpmfile.mjs` during installation |
| `pnpmfile` | `.pnpmfile.mjs` | Path to the pnpmfile |
| `globalPnpmfile` | `false` | Use a global pnpmfile |
