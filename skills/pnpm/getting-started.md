# pnpm — Getting Started

## Motivation

### Saving Disk Space

When using npm, if you have 100 projects using a dependency, you will have 100 copies of that dependency saved on disk. With pnpm, the dependency is stored in a content-addressable store, so:

1. If you depend on different versions of the dependency, only the files that differ are added to the store. For instance, if a package has 100 files, and a new version changes only one file, `pnpm update` will only add 1 new file to the store.
2. All files are saved in a single place on the disk. When packages are installed, their files are hard-linked from that single place, consuming no additional disk space. This allows sharing dependencies of the same version across projects.

### Boosting Installation Speed

pnpm performs installation in three stages:

1. **Dependency resolution** — all required dependencies are identified and fetched to the store.
2. **Directory structure calculation** — the `node_modules` directory structure is calculated based on the dependencies.
3. **Linking dependencies** — all remaining dependencies are fetched and hard-linked from the store to `node_modules`.

This approach is significantly faster than the traditional three-stage installation process of resolving, fetching, and writing all dependencies to `node_modules`.

### Creating a Non-Flat node_modules Directory

When installing dependencies with npm or Yarn Classic, all packages are hoisted to the root of the modules directory. As a result, source code has access to dependencies that are not added as dependencies to the project (phantom dependencies).

By default, pnpm uses symlinks to add only the direct dependencies of the project into the root of the modules directory. The unique `node_modules` structure:

- **`node_modules/.pnpm/`** — virtual store containing all dependencies (direct and transitive) symlinked from the global store
- **`node_modules/<pkg>`** — symlinks to direct dependencies only, preventing access to undeclared packages

If your tooling doesn't work well with symlinks, set `nodeLinker` to `hoisted`:

```yaml
# pnpm-workspace.yaml
nodeLinker: hoisted
```

This creates a flat `node_modules` similar to npm/Yarn Classic.

## Feature Comparison

| Feature | pnpm | Yarn | npm | Notes |
|---------|------|------|-----|-------|
| Workspace support | Yes | Yes | Yes | Built-in monorepo |
| Hoisted node_modules | Yes | Yes | Yes | Via `nodeLinker: hoisted` |
| Autoinstalling peers | Yes | No | Yes | `autoInstallPeers` |
| Patching dependencies | Yes | Yes | No | `pnpm patch` |
| Managing runtimes | Yes | No | No | `pnpm runtime`, `devEngines` |
| Lockfile | `pnpm-lock.yaml` | `yarn.lock` | `package-lock.json` | |
| Overrides support | Yes | Yes | Yes | `overrides` in pnpm-workspace.yaml |
| Dynamic package execution | `pnpm dlx` / `pnx` | `yarn dlx` | `npx` | |
| Side-effects cache | Yes | No | No | `sideEffectsCache` |
| Catalogs | Yes | No | No | `catalog:` protocol |
| Config dependencies | Yes | No | No | |
| JSR registry support | Yes | No | No | |
| Auto-install before run | Yes | No | No | `verifyDepsBeforeRun` |
| Hooks | Yes | No | No | `.pnpmfile.mjs` |
| Build script security | Yes | No | No | `allowBuilds`, `strictDepBuilds` |
| SBOM generation | `pnpm sbom` | No | `npm sbom` | |
| Listing licenses | `pnpm licenses list` | No | No | |

## Installation

### Prerequisites

If you don't use the standalone script or `@pnpm/exe`, you need Node.js (at least v22) installed on your system.

### Using a Standalone Script

**Windows (PowerShell):**

```powershell
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

Note: Windows Defender may block the executable. On Windows, Microsoft Defender can slow down installations. Add pnpm to the exclusion list:

```powershell
Add-MpPreference -ExclusionPath $(pnpm store path)
```

**POSIX systems:**

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
# or with wget
wget -qO- https://get.pnpm.io/install.sh | sh -
```

Note: The standalone script does not run on Intel Macs (darwin-x64). Use npm, Corepack, or Homebrew instead.

**Installing a specific version:**

```bash
curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=<version> sh -
```

**In a Docker container:**

```bash
# bash
wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -
# sh
wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -
```

### Using Corepack

```bash
# Update Corepack first (fixes outdated signatures)
npm install --global corepack@latest

# Enable pnpm via Corepack
corepack enable pnpm

# Pin pnpm version for a project
corepack use pnpm@latest-11
```

This adds a `packageManager` field to `package.json` for reproducibility.

### Using Other Package Managers

```bash
# npm
npm install -g pnpm

# Homebrew (macOS)
brew install pnpm

# winget (Windows)
winget install pnpm.pnpm

# Scoop (Windows)
scoop install pnpm

# Chocolatey (Windows)
choco install pnpm
```

### Compatibility

pnpm is compatible with Node.js and supports all standard npm registry packages. The `nodeLinker` setting can be adjusted for projects with symlink incompatibilities.

### Updating pnpm

```bash
pnpm self-update
```

### Uninstalling pnpm

Remove the pnpm binary and the store directory:

```bash
pnpm store prune  # clean store first
# Then remove the binary via the method used to install it
```

## pnpm CLI

### Short Aliases

Added in v11.0.0:

- `pn` — short alias for `pnpm`
- `pnx` — short alias for `pnpm dlx`

```bash
pn install
pn add express
pn build
pn test
pnx create-vue my-app
```

### Differences vs npm

Unlike npm, pnpm validates all options. For example, `pnpm install --target_arch x64` will fail as `--target_arch` is not a valid option.

If a dependency uses `npm_config_` environment variables:

```bash
# Option 1: explicitly set the env variable
npm_config_target_arch=x64 pnpm install

# Option 2: force the unknown option with --config.
pnpm install --config.target_arch=x64
```

### Global Options

| Option | Description |
|--------|-------------|
| `-C <path>, --dir <path>` | Run as if pnpm was started in `<path>` instead of the current working directory |
| `-w, --workspace-root` | Run as if pnpm was started in the root of the workspace |

### Commands — npm Equivalents

| npm | pnpm |
|-----|------|
| `npm install` | `pnpm install` |
| `npm i <pkg>` | `pnpm add <pkg>` |
| `npm run <cmd>` | `pnpm <cmd>` |
| `npx <pkg>` | `pnx <pkg>` |

When an unknown command is used, pnpm searches for a script with the given name. So `pnpm run lint` is the same as `pnpm lint`. If no script exists, pnpm executes the command as a shell script (`pnpm eslint` → `pnpm exec eslint`).

### Environment Variables

**pnpm-related:**

- `CI` — influences `--frozen-lockfile` default behavior

**Directory-related (XDG):**

- `XDG_CACHE_HOME` — cache directory
- `XDG_CONFIG_HOME` — config directory
- `XDG_DATA_HOME` — data directory (store, global packages)
- `XDG_STATE_HOME` — state directory

**Other:**

- `PNPM_HOME` — pnpm home directory (store, global bin)
- `HTTPS_PROXY` / `https_proxy` / `HTTP_PROXY` / `http_proxy` — proxy settings

## npm to pnpm Migration

### Quick Migration

```bash
# 1. Remove existing lockfiles and node_modules
rm -rf node_modules package-lock.json yarn.lock

# 2. Install dependencies with pnpm
pnpm install

# 3. Use pnpm commands going forward
pnpm add <pkg>      # instead of npm install <pkg>
pnpm run <script>   # instead of npm run <script>
pnpm remove <pkg>   # instead of npm uninstall <pkg>
```

### Importing from Another Package Manager

pnpm can generate a `pnpm-lock.yaml` from existing lockfiles:

```bash
# From package-lock.json (npm) or yarn.lock (Yarn Classic)
pnpm import

# Then run pnpm install
pnpm install
```

Supported source lockfiles:

- `package-lock.json` (npm v7+)
- `yarn.lock` (Yarn Classic)
- `npm-shrinkwrap.json`

### Common Migration Issues

1. **Phantom dependencies** — code accessing packages not in `package.json` will fail. Fix by adding the missing dependency to `package.json` or using `nodeLinker: hoisted`.
2. **Peer dependency conflicts** — pnpm is stricter about peer deps. Use `autoInstallPeers: true` (default) or add overrides.
3. **Symlink issues** — some tools don't handle symlinks well. Use `nodeLinker: hoisted` as a workaround.
4. **Scripts running in root** — use `--ignore-workspace-root-check` or `-w` flag.

## Supported Package Sources

pnpm supports installing packages from various sources, divided into trusted and exotic sources.

### Trusted Sources

**npm registry:**

```bash
pnpm add package-name              # latest version
pnpm add express@nightly           # by tag
pnpm add express@1.0.0             # by version
pnpm add express@2 react@">=0.1.0 <0.2.0"  # by version range
```

In a workspace, pnpm first checks if other projects use the package and installs the same version range.

**JSR registry** (added v10.9.0):

```bash
pnpm add jsr:@hono/hono
pnpm add jsr:@hono/hono@4
pnpm add jsr:@hono/hono@latest
```

**Workspace packages:** Uses `workspace:` protocol (see Workspaces).

**Local file system:**

```bash
pnpm add ./package.tar.gz    # from tarball
pnpm add ./some-directory    # from directory (creates symlink)
```

### Exotic Sources

**Remote tarball:**

```bash
pnpm add https://example.com/package.tgz
```

**Git repository:**

```bash
# Latest commit from default branch
pnpm add kevva/is-positive

# By commit hash
pnpm add kevva/is-positive#97edff6f525f192a3f83cea1944765f769ae2678

# By branch
pnpm add kevva/is-positive#master

# By tag
pnpm add zkochan/is-negative#2.0.1

# Using semver
pnpm add zkochan/is-negative#semver:1.0.0
pnpm add kevva/is-positive#semver:^2.0.0

# Subdirectory of a Git repo
pnpm add RexSkz/test-git-subfolder-fetch#path:/packages/simple-react-app

# Full Git URL
pnpm add git+ssh://git@github.com:zkochan/is-negative.git#2.0.1
pnpm add https://github.com/zkochan/is-negative.git#2.0.1

# Provider shorthand (defaults to github:)
pnpm add github:zkochan/is-negative
pnpm add bitbucket:pnpmjs/git-resolver
pnpm add gitlab:pnpm/git-resolver

# Combining parameters
pnpm add RexSkz/test-git-subdir-fetch.git#beta\&path:/packages/simple-react-app
```

## Aliases (npm: protocol)

Aliases let you install packages with custom names:

```bash
# Install awesome-lodash under the alias lodash
pnpm add lodash@npm:awesome-lodash

# Install two versions of the same package
pnpm add lodash1@npm:lodash@1
pnpm add lodash2@npm:lodash@2
```

No code changes needed — `require('lodash')` resolves to `awesome-lodash`.

Combined with hooks for global replacement:

```javascript
function readPackage(pkg) {
  if (pkg.dependencies && pkg.dependencies.lodash) {
    pkg.dependencies.lodash = 'npm:awesome-lodash@^1.0.0'
  }
  return pkg
}
export const hooks = { readPackage }
```

## Config Dependencies

Config dependencies allow sharing and centralizing configuration files, settings, and hooks across multiple projects. They are installed before all regular dependencies.

### Adding Config Dependencies

```bash
pnpm add --config my-configs
```

This adds to `pnpm-workspace.yaml`:

```yaml
configDependencies:
  my-configs: "1.0.0"
```

Integrity checksums are stored in `pnpm-lock.yaml`.

**Important:**
- Config dependencies cannot have their own regular `dependencies` (only `optionalDependencies`, one level deep)
- Config dependencies cannot define lifecycle scripts (`preinstall`, `postinstall`, etc.)

### Platform-specific Binaries

Use `optionalDependencies` within config deps for platform-specific binaries:

```yaml
configDependencies:
  my-configs: "1.0.0"
  # In the config package's package.json:
  # "optionalDependencies": {
  #   "my-configs-linux-x64": "1.0.0",
  #   "my-configs-darwin-arm64": "1.0.0"
  # }
```

### Usage

**Installing dependencies used in hooks:** Config dependencies are installed before `.pnpmfile.mjs` hooks load:

```javascript
import { readPackage } from '.pnpm-config/my-hooks'
export const hooks = { readPackage }
```

**Updating pnpm settings dynamically:** Use `updateConfig` hook with config deps:

```javascript
export const hooks = {
  updateConfig(config) {
    config.catalogs.default ??= {}
    config.catalogs.default['is-odd'] = '1.0.0'
    return config
  }
}
```

**Loading patch files:**

```yaml
configDependencies:
  my-patches: "1.0.0"
patchedDependencies:
  react: "node_modules/.pnpm-config/my-patches/react.patch"
```

## Continuous Integration

pnpm works with all major CI systems. Key patterns: install pnpm via Corepack, cache the store, use `--frozen-lockfile`.

### GitHub Actions

```yaml
name: pnpm Example Workflow
on: push
jobs:
  build:
    runs-on: ubuntu-24.04
    strategy:
      matrix:
        node-version: [24]
    steps:
      - uses: actions/checkout@v6
      - name: Install pnpm
        uses: pnpm/action-setup@v6
        with:
          version: 11
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v6
        with:
          node-version: ${{ matrix.node-version }}
          cache: "pnpm"
      - name: Install dependencies
        run: pnpm install
```

### GitLab CI

```yaml
stages:
  - build
build:
  stage: build
  image: node:24.14.1
  before_script:
    - npm install --global corepack@latest
    - corepack enable
    - corepack prepare pnpm@latest-11 --activate
    - pnpm config set store-dir .pnpm-store
  script:
    - pnpm install
  cache:
    key:
      files:
        - pnpm-lock.yaml
    paths:
      - .pnpm-store
```

### CircleCI

```yaml
version: 2.1
jobs:
  build:
    docker:
      - image: node:18
    steps:
      - checkout
      - restore_cache:
          name: Restore pnpm Package Cache
          keys:
            - pnpm-packages-{{ checksum "pnpm-lock.yaml" }}
      - run:
          name: Install pnpm
          command: |
            npm install --global corepack@latest
            corepack enable
            corepack prepare pnpm@latest-11 --activate
            pnpm config set store-dir .pnpm-store
      - run:
          name: Install Dependencies
          command: pnpm install
      - save_cache:
          name: Save pnpm Package Cache
          key: pnpm-packages-{{ checksum "pnpm-lock.yaml" }}
          paths:
            - .pnpm-store
```

### Azure Pipelines

```yaml
variables:
  pnpm_config_cache: $(Pipeline.Workspace)/.pnpm-store
steps:
  - task: Cache@2
    inputs:
      key: 'pnpm | "$(Agent.OS)" | pnpm-lock.yaml'
      path: $(pnpm_config_cache)
    displayName: Cache pnpm
  - script: |
      npm install --global corepack@latest
      corepack enable
      corepack prepare pnpm@latest-11 --activate
      pnpm config set store-dir $(pnpm_config_cache)
    displayName: "Setup pnpm"
  - script: |
      pnpm install
      pnpm run build
    displayName: "pnpm install and build"
```

### Other CI Systems

**Bitbucket Pipelines:** Use `caches: - pnpm` with store at `$BITBUCKET_CLONE_DIR/.pnpm-store`.

**Jenkins:**

```groovy
pipeline {
  agent { docker { image 'node:lts-bullseye-slim' } }
  stages {
    stage('Build') {
      steps {
        sh 'npm install --global corepack@latest'
        sh 'corepack enable'
        sh 'corepack prepare pnpm@latest-11 --activate'
        sh 'pnpm install'
      }
    }
  }
}
```

**Semaphore, AppVeyor, Travis:** Similar Corepack setup with store caching.

### CI Best Practices

- Use `--frozen-lockfile` (default in CI environments) to ensure reproducible builds
- Cache the pnpm store directory (`pnpm store path`) between runs
- Use Corepack to pin pnpm version: `corepack prepare pnpm@latest-11 --activate`
- For monorepos, use filtering: `pnpm --filter "...[origin/main]" test`
