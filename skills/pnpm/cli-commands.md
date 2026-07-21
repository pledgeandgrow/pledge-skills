# pnpm — CLI Commands Reference

## pnpm install

**Aliases:** `pnpm i`

Installs all dependencies of a project. In a workspace, installs all workspace dependencies.

### Usage

```bash
pnpm install [options]
```

### TL;DR

```bash
pnpm i --offline          # use only packages in store
pnpm i --frozen-lockfile  # don't modify lockfile (CI)
pnpm i --lockfile-only    # update lockfile only, no node_modules
pnpm i --dry-run          # report changes without writing
```

### Options for Filtering Dependencies

| Option | Description |
|--------|-------------|
| `--prod, -P` | Install only `dependencies` and `optionalDependencies` |
| `--dev, -D` | Install only `devDependencies` |
| `--no-optional` | Skip `optionalDependencies` |
| `--no-runtime` | Skip runtime installation |

### Options

| Option | Description |
|--------|-------------|
| `--force` | Force reinstall: refetch modified packages, recreate lockfile and modules directory |
| `--offline` | Use only packages available in store; fail if not found |
| `--prefer-offline` | Bypass staleness checks for cached data; request missing from server |
| `--no-lockfile` | Don't read or generate `pnpm-lock.yaml` |
| `--lockfile-only` | Update only `pnpm-lock.yaml` and `package.json`; don't write to `node_modules` |
| `--dry-run` | Full dependency resolution report without writing to disk (v11.8.0+) |
| `--fix-lockfile` | Fix broken lockfile entries automatically |
| `--update-checksums` | Refresh integrity values from registry when tarball hash doesn't match (v11.4.0+) |
| `--frozen-lockfile` | Don't generate lockfile; fail if out of sync. Default `true` in CI |
| `--merge-git-branch-lockfiles` | Merge all git branch lockfiles |
| `--reporter=<name>` | Set reporter: `default`, `append-only`, `ndjson`, `silent` |
| `--shamefully-hoist` | Hoist dependencies to root `node_modules` (like npm) |
| `--ignore-scripts` | Don't execute install scripts |
| `--filter <selector>` | Filter packages (see Filtering) |
| `--resolution-only` | Re-resolve and update lockfile without touching `node_modules` |
| `--cpu=<name>` | CPU architecture for optional deps |
| `--os=<name>` | OS for optional deps |
| `--libc=<name>` | libc for optional deps |

## pnpm add \<pkg\>

**Aliases:** `pnpm i <pkg>`

Installs a package and any packages that it depends on.

### Usage

```bash
pnpm add <pkg> [options]
pnpm add <pkg>@<version>
pnpm add <pkg>@<tag>
pnpm add <github-user>/<repo>
pnpm add <git-url>
pnpm add <tarball-url>
pnpm add <path>
pnpm add <alias>@npm:<pkg>
```

### TL;DR

```bash
pnpm add sax              # to dependencies
pnpm add -D sax           # to devDependencies
pnpm add -O sax           # to optionalDependencies
pnpm add -g sax           # globally
pnpm add sax@next         # specific tag
pnpm add sax@3.0.0        # specific version
pnpm add sax --save-peer  # as peer dependency
pnpm add sax --save-catalog  # using catalog
```

### Supported Package Sources

- **npm registry** — `pnpm add pkg`
- **JSR registry** — `pnpm add jsr:@scope/pkg`
- **Workspace packages** — `pnpm add workspace:pkg` or `pnpm add pkg --workspace`
- **Local file system** — `pnpm add ./path/to/pkg` or `pnpm add ./pkg.tgz`
- **Remote tarballs** — `pnpm add https://example.com/pkg.tgz`
- **Git repositories** — `pnpm add user/repo`, `pnpm add github:user/repo`, `pnpm add git+https://...`

### Options

| Option | Description |
|--------|-------------|
| `--save-prod, -P` | Save to `dependencies` |
| `--save-dev, -D` | Save to `devDependencies` |
| `--save-optional, -O` | Save to `optionalDependencies` |
| `--save-exact, -E` | Save exact version (no prefix) |
| `--save-peer` | Save to `peerDependencies` |
| `--save-catalog` | Save using `catalog:` protocol |
| `--save-catalog-name <name>` | Save using named catalog |
| `--config` | Pass unknown config options as `npm_config_*` env vars |
| `--ignore-workspace-root-check` | Allow adding from workspace root |
| `--global, -g` | Install globally |
| `--workspace` | Only link from workspace packages |
| `--allow-build` | Allow the added package to run build scripts |
| `--filter <selector>` | Filter packages |
| `--cpu`, `--os`, `--libc` | Architecture for optional deps |

## pnpm update

**Aliases:** `pnpm up`, `pnpm upgrade`

Updates packages to their latest version respecting the version range in `package.json`.

### Usage

```bash
pnpm update [pkg...] [options]
pnpm up                    # update all
pnpm up --latest           # update to latest (may cross major versions)
pnpm up foo@2              # update foo to v2
pnpm up "@babel/*"         # update all babel packages
pnpm up "@babel/*" "!@babel/core"  # update babel except core
```

### Options

| Option | Description |
|--------|-------------|
| `--recursive, -r` | Update in all workspace packages |
| `--latest, -L` | Update to latest stable versions (may cross major versions) |
| `--global, -g` | Update global packages |
| `--workspace` | Only update workspace packages |
| `--prod, -P` | Only update `dependencies` and `optionalDependencies` |
| `--dev, -D` | Only update `devDependencies` |
| `--no-optional` | Don't update `optionalDependencies` |
| `--interactive, -i` | Show outdated deps and select which to update |
| `--no-save` | Don't update version ranges in `package.json` |
| `--filter <selector>` | Filter packages |

## pnpm remove

**Aliases:** `pnpm rm`, `pnpm uninstall`, `pnpm un`

Removes packages from `node_modules` and `package.json`.

### Usage

```bash
pnpm remove <pkg> [options]
pnpm remove foo bar baz
```

### Options

| Option | Description |
|--------|-------------|
| `--recursive, -r` | Remove from all workspace packages |
| `--global, -g` | Remove global package |
| `--save-dev, -D` | Remove from `devDependencies` |
| `--save-optional, -O` | Remove from `optionalDependencies` |
| `--save-prod, -P` | Remove from `dependencies` |
| `--filter <selector>` | Filter packages |

## pnpm run

**Aliases:** `pnpm run-script`

Runs a script defined in `package.json`.

### Usage

```bash
pnpm run <script> [args...]
pnpm <script> [args...]           # shorthand
pnpm run "/<regex>/"              # run scripts matching regex
```

### Running Multiple Scripts

Use a regex to run multiple scripts:

```bash
pnpm run "/^watch:.*/"           # run all scripts starting with "watch:"
pnpm run --sequential "/^build:.*/"  # run one at a time
```

Matched scripts run in lexicographical order. Regex flags are not supported.

### Environment

pnpm sets these environment variables for scripts:

- `npm_command` — name of the executed command (e.g., `run-script`)
- `node_modules/.bin` is added to `PATH`
- Workspace root's `node_modules/.bin` is also added to `PATH`

### Options

| Option | Description |
|--------|-------------|
| `--recursive, -r` | Run script in all workspace packages |
| `--if-present` | Don't exit non-zero if script is undefined |
| `--no-bail` | Continue running remaining scripts even if one fails |
| `--parallel` | Run in all matching packages immediately (disregard topological order) |
| `--sequential, -s` | Run scripts one by one (v11.14.0+) |
| `--stream` | Stream output from child processes with package prefix |
| `--aggregate-output` | Aggregate output from parallel processes, print when finished |
| `--resume-from <package_name>` | Resume execution from a specific project |
| `--report-summary` | Record results to `pnpm-exec-summary.json` |
| `--reporter-hide-prefix` | Hide workspace prefix from output |
| `--filter <selector>` | Filter packages |

### pnpm-workspace.yaml Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `enablePrePostScripts` | `true` | Run pre/post scripts automatically |
| `scriptShell` | `null` | Shell for running scripts |
| `shellEmulator` | `false` | Use pnpm's shell emulator |

## pnpm exec

Execute a shell command in the scope of a project.

### Usage

```bash
pnpm exec <command> [args...]
pnpm eslint src --fix
```

### Options

| Option | Description |
|--------|-------------|
| `--recursive, -r` | Execute in all workspace packages |
| `--no-reporter-hide-prefix` | Show package prefix in output |
| `--resume-from <package_name>` | Resume from a specific project |
| `--parallel` | Run in parallel across packages |
| `--shell-mode, -c` | Run in shell mode |
| `--report-summary` | Record results to `pnpm-exec-summary.json` |
| `--filter <selector>` | Filter packages |

## pnx (pnpm dlx, pnpx)

**Aliases:** `pnpm dlx`, `pnpx`

Fetches a package from the registry without installing it as a dependency, and runs its binary.

### Usage

```bash
pnx <pkg> [args...]
pnpm dlx <pkg> [args...]
pnpx <pkg> [args...]

# Examples
pnx create-vite my-app
pnpm dlx prettier --write .
pnpx cowsay "Hello pnpm!"
```

### Options

| Option | Description |
|--------|-------------|
| `--package <name>` | Package to install (when different from the command name) |
| `--allow-build` | Allow the package to run build scripts |
| `--shell-mode, -c` | Run in shell mode |
| `--silent, -s` | Suppress output |

### Security and Trust Policies

Since v11.0.0, `pnx` honors project-level security and trust policy settings:

- `minimumReleaseAge`, `minimumReleaseAgeExclude`, `minimumReleaseAgeStrict`
- `trustPolicy`, `trustPolicyExclude`, `trustPolicyIgnoreAfter`

`pnx` will refuse to execute freshly published or insufficiently trusted packages.

## pnpm publish

Publishes a package to the registry.

### Usage

```bash
pnpm publish [options]
pnpm publish --tag next
pnpm publish --access public
pnpm publish --dry-run
```

### Options

| Option | Description |
|--------|-------------|
| `--recursive, -r` | Publish all workspace packages |
| `--json` | Output in JSON format |
| `--tag <tag>` | Tag for the published version (default: `latest`) |
| `--access <public\|restricted>` | Access level for scoped packages |
| `--no-git-checks` | Skip git checks (dirty tree, unknown files) |
| `--publish-branch <branch>` | Branch to publish from (default: `master`/`main`) |
| `--force` | Force publish even if package already exists |
| `--batch` | Publish multiple packages in batch |
| `--skip-manifest-obfuscation` | Skip manifest obfuscation |
| `--report-summary` | Save report to `pnpm-publish-summary.json` |
| `--dry-run` | Simulate without publishing |
| `--otp` | One-time password for 2FA |
| `--provenance` | Generate provenance attestation |
| `--filter <selector>` | Filter packages |

### Life Cycle Scripts

- `prepublishOnly` — runs before publish
- `prepublish` — runs before publish (deprecated)
- `prepare` — runs after install and before publish
- `postpublish` — runs after publish

## pnpm patch \<pkg\>

Prepare a package for patching (inspired by Yarn's patch command).

### Usage

```bash
# 1. Create a patch for a package
pnpm patch <pkg>@<version>

# 2. Edit files in the temporary directory

# 3. Generate patch file
pnpm patch-commit <temp_dir>
```

### Options

| Option | Description |
|--------|-------------|
| `--edit-dir <dir>` | Directory to extract the package for editing |
| `--ignore-existing` | Ignore existing patches and create new one |

### Configuration

```yaml
# pnpm-workspace.yaml
patchedDependencies:
  "express@4.18.2": "patches/express@4.18.2.patch"

allowUnusedPatches: false
```

## pnpm audit

Checks for known security issues with installed packages.

### Usage

```bash
pnpm audit [options]
pnpm audit --fix           # add overrides for vulnerabilities
pnpm audit --fix=update    # fix by updating packages in lockfile
pnpm audit --json          # JSON output
```

### Commands

| Command | Description |
|--------|-------------|
| `signatures` | Verify package signatures |

### Options

| Option | Description |
|--------|-------------|
| `--audit-level <severity>` | Minimum severity: `low`, `moderate`, `high`, `critical` (default: `low`) |
| `--fix` | Add overrides to fix vulnerabilities |
| `--fix=update` | Fix by updating packages in lockfile (v11.0.0+) |
| `--interactive, -i` | Review and select which fixes to apply (v11.0.0+) |
| `--json` | JSON output |
| `--dev, -D` | Only audit dev dependencies |
| `--prod, -P` | Only audit production dependencies |
| `--no-optional` | Don't audit `optionalDependencies` |
| `--ignore-registry-errors` | Exit 0 if registry responds non-200 |
| `--ignore-unfixable` | Ignore advisories with no resolution |
| `--ignore <vulnerability>` | Ignore by GitHub advisory ID (GHSA) |

### Configuration

```yaml
# pnpm-workspace.yaml
auditConfig:
  ignoreCves:
    - "CVE-2024-1234"
  ignoreGhsas:
    - "GHSA-xxxx-xxxx-xxxx"
```

## pnpm config

**Aliases:** `pnpm c`

Read and edit pnpm configuration.

### Commands

| Command | Description |
|--------|-------------|
| `set <key> <value>` | Set a config key |
| `get <key>` | Print config value (supports property paths) |
| `delete <key>` | Remove a config key |
| `list` | Show all config settings (JSON object) |

### Usage

```bash
# Set
pnpm config set --location=project nodeVersion 22.0.0
pnpm config set --location=project --json catalog '{ "react": "19" }'

# Get
pnpm config get nodeVersion
pnpm config get --json packageExtensions
pnpm config get 'packageExtensions["@babel/parser"].peerDependencies["@babel/types"]'
pnpm config get catalog.react

# Delete
pnpm config delete nodeVersion

# List all
pnpm config list
```

### Options

| Option | Description |
|--------|-------------|
| `--global, -g` | Use global config |
| `--location` | `project` or `global` |
| `--json` | Parse/set value as JSON |

## pnpm store

Managing the package store.

### Commands

| Command | Description |
|--------|-------------|
| `status` | Check for modified packages in the store |
| `add <pkg>` | Add a package to the store directly |
| `prune` | Remove unreferenced packages from the store |
| `path` | Print the path to the active store directory |

### Usage

```bash
pnpm store path        # /Users/me/Library/pnpm/store
pnpm store status      # check integrity
pnpm store prune       # clean up unused packages
pnpm store add pkg     # add to store without modifying projects
```

## pnpm list

**Aliases:** `pnpm ls`

Lists installed packages.

### Usage

```bash
pnpm list [options]
pnpm list --depth 0    # direct dependencies only
pnpm list --json       # JSON output
pnpm list --long       # extended info
pnpm list -r           # all workspace packages
```

### Options

| Option | Description |
|--------|-------------|
| `--recursive, -r` | List in all workspace packages |
| `--json` | JSON output |
| `--long` | Extended info |
| `--lockfile-only` | Read from lockfile |
| `--parseable` | Parseable output |
| `--global, -g` | List global packages |
| `--depth <number>` | Max depth of dependency tree |
| `--prod, -P` | Only `dependencies` and `optionalDependencies` |
| `--dev, -D` | Only `devDependencies` |
| `--no-optional` | Exclude `optionalDependencies` |
| `--only-projects` | Only show workspace packages |
| `--exclude-peers` | Exclude peer dependencies |
| `--filter <selector>` | Filter packages |
| `--find-by <finder_name>` | Custom finder |

## pnpm why

Shows all packages that depend on the specified package.

### Usage

```bash
pnpm why <pkg> [options]
pnpm why express
pnpm why --json react
```

### Options

| Option | Description |
|--------|-------------|
| `--recursive, -r` | Search in all workspace packages |
| `--json` | JSON output |
| `--long` | Extended info |
| `--parseable` | Parseable output |
| `--global, -g` | Search global packages |
| `--prod, -P` | Only production dependencies |
| `--dev, -D` | Only dev dependencies |
| `--depth <number>` | Max depth |
| `--only-projects` | Only workspace packages |
| `--exclude-peers` | Exclude peer dependencies |
| `--filter <selector>` | Filter packages |
| `--find-by <finder_name>` | Custom finder |

## pnpm import

Generates a `pnpm-lock.yaml` from another package manager's lockfile.

### Usage

```bash
pnpm import
```

Supported source lockfiles:

- `package-lock.json` (npm v7+)
- `yarn.lock` (Yarn Classic)
- `npm-shrinkwrap.json`

## pnpm setup

Configures pnpm in the environment (sets `PNPM_HOME`, updates shell config):

```bash
pnpm setup
```

After running, restart your shell or source your shell config.

## pnpm root

Prints the effective `node_modules` directory:

```bash
pnpm root           # project node_modules
pnpm root -g        # global node_modules
```

## pnpm sbom

Generates a Software Bill of Materials (SBOM):

```bash
pnpm sbom
pnpm sbom --json > sbom.json
```

## pnpm licenses

Lists licenses of installed packages:

```bash
pnpm licenses list
pnpm licenses list --json
```

## pnpm create

Creates a new project from a template:

```bash
pnpm create vite my-app
pnpm create next-app
```

## pnpm runtime

Manages Node.js/Deno/Bun runtimes:

```bash
pnpm runtime add node@22
pnpm runtime use node@22
pnpm runtime list
```

## pnpm with

Run pnpm at a specific version without changing settings:

```bash
pnpm with 10 install
pnpm with latest-11 add express
```

## pnpm recursive

**Aliases:** `pnpm -r`, `pnpm --recursive`

Runs a command in all workspace packages:

```bash
pnpm -r build
pnpm -r test
pnpm -r --filter "...[origin/master]" test
pnpm -r run lint
```

### Options

| Option | Description |
|--------|-------------|
| `--workspace-concurrency <number>` | Max parallel packages (default: 4) |
| `--sort` | Sort packages topologically |
| `--no-sort` | Don't sort packages |
| `--reverse` | Reverse sort order |

## Command Summary Table

| Command | Alias | Description |
|---------|-------|-------------|
| `pnpm install` | `pnpm i` | Install dependencies |
| `pnpm add <pkg>` | `pnpm i <pkg>` | Add a package |
| `pnpm update` | `pnpm up`, `pnpm upgrade` | Update packages |
| `pnpm remove` | `pnpm rm`, `pnpm un` | Remove packages |
| `pnpm run <script>` | — | Run a script |
| `pnpm exec <cmd>` | — | Execute a command |
| `pnx <pkg>` | `pnpm dlx`, `pnpx` | Run a one-off package |
| `pnpm publish` | — | Publish to registry |
| `pnpm patch <pkg>` | — | Patch a dependency |
| `pnpm audit` | — | Check for vulnerabilities |
| `pnpm config` | `pnpm c` | Read/edit config |
| `pnpm store` | — | Manage the store |
| `pnpm list` | `pnpm ls` | List packages |
| `pnpm why` | — | Show dependents |
| `pnpm import` | — | Import lockfile |
| `pnpm setup` | — | Configure environment |
| `pnpm root` | — | Print node_modules path |
| `pnpm sbom` | — | Generate SBOM |
| `pnpm licenses` | — | List licenses |
| `pnpm create` | — | Create from template |
| `pnpm runtime` | — | Manage runtimes |
| `pnpm with` | — | Run specific pnpm version |
| `pnpm -r` | `pnpm --recursive` | Run in all packages |
| `pnpm link` | `pnpm ln` | Link local package |
| `pnpm unlink` | — | Remove linked package |
| `pnpm rebuild` | `pnpm rb` | Rebuild packages |
| `pnpm pack` | — | Create tarball from package |
| `pnpm deploy` | — | Deploy workspace package |
| `pnpm doctor` | — | Health check pnpm installation |
| `pnpm test` | `pnpm t`, `pnpm tst` | Run test script |
| `pnpm dedupe` | — | Deduplicate lockfile deps |
| `pnpm install-test` | `pnpm it` | Install + run tests |

## pnpm link

**Aliases:** `pnpm ln`

Links a local package as a symlink. Does not install the linked package's dependencies.

### Usage

```bash
# Link a local package into current project
pnpm link ~/projects/foo

# Link current package globally
pnpm link -g
```

### Use Cases

**Replace an installed package with a local version:**

```bash
cd ~/projects/foo
pnpm install          # install foo's dependencies
cd ~/projects/my-project
pnpm link ~/projects/foo  # link foo to my-project
```

**Add a binary globally:**

```bash
cd ~/projects/foo
pnpm install
pnpm add -g .         # register foo's bins globally
```

### pnpm link vs file: protocol

| Feature | `pnpm link` | `file:` protocol |
|---------|-------------|------------------|
| Linking | Symlinked from source | Hard-linked to node_modules |
| Source deps | Not installed (install manually) | Installed by pnpm |
| Source code changes | Reflected immediately | Reflected immediately |
| Peer deps | May not resolve correctly | Better peer dep resolution |

For peer dependencies, prefer `file:` protocol.

## pnpm rebuild

**Aliases:** `pnpm rb`

Rebuild packages (re-run install scripts).

### Usage

```bash
pnpm rebuild [pkg...]
```

### Options

| Option | Description |
|--------|-------------|
| `--recursive, -r` | Rebuild in all workspace packages |
| `--filter <selector>` | Filter packages |

## pnpm pack

Creates a tarball from a package.

### Usage

```bash
pnpm pack [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--recursive, -r` | Pack all workspace packages |
| `--out <path>` | Custom output path (`%s` for name, `%v` for version) |
| `--pack-destination <dir>` | Directory for tarballs (default: cwd) |
| `--pack-gzip-level <level>` | Custom compression level |
| `--json` | JSON output |
| `--filter <selector>` | Filter packages |
| `--dry-run` | Show contents without creating tarball |
| `--skip-manifest-obfuscation` | Keep `packageManager` field and lifecycle scripts in manifest |

### Life Cycle Scripts

- `prepack` — runs before packing
- `postpack` — runs after packing

## pnpm deploy

Deploys a package from a workspace. Copies the deployed package and installs all dependencies (including workspace deps) into an isolated `node_modules` at the target directory. The result is a portable package.

### Usage

```bash
pnpm deploy <target-dir> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--dev, -D` | Include dev dependencies |
| `--no-optional` | Exclude optional dependencies |
| `--prod, -P` | Exclude dev dependencies |
| `--filter <selector>` | Filter packages |
| `--legacy` | Use legacy deploy mode |

### Configuration

```yaml
# pnpm-workspace.yaml
forceLegacyDeploy: false
```

### Files Included

Only files matching the `files` field in `package.json` (or all files if not set) are copied. `publishConfig.directory` is respected.

## pnpm doctor

Added in v11.14.0. Health check for the pnpm installation.

### Usage

```bash
pnpm doctor [options]
```

### Checks

| Check | Description |
|-------|-------------|
| **Versions** | Reports running pnpm and Node.js versions |
| **Install method** | Reports how pnpm was installed (npm package vs `@pnpm/exe` standalone) |
| **Global bin directory** | Checks if global bin dir is on `PATH` and writable |
| **Cache directory** | Checks if cache directory is writable |
| **Store directory** | Checks if store directory is writable |
| **Filesystem** | Probes which link strategies work: reflink (CoW), hardlink, symlink |
| **Registry connectivity** | Pings configured registry with 15s timeout |
| **Install smoke test** | Installs a throwaway package offline to verify end-to-end install |

### Options

| Option | Description |
|--------|-------------|
| `--offline` | Skip registry connectivity check |
| `--benchmark` | Run with benchmarking |
| `--json` | JSON output |

## pnpm test

**Aliases:** `pnpm t`, `pnpm tst`, `pnpm run test`

Runs the `test` script defined in `package.json`.

### Usage

```bash
pnpm test [args...]
```

This is a shorthand for `pnpm run test`. All options from `pnpm run` apply.

## pnpm dedupe

Performs an install removing older dependencies in the lockfile if a newer version can be used.

### Usage

```bash
pnpm dedupe
```

### Options

| Option | Description |
|--------|-------------|
| `--check` | Check if dedupe would result in changes without installing or editing lockfile. Exits non-zero if changes are possible. |

## pnpm install-test

**Aliases:** `pnpm it`

Installs dependencies and runs the `test` script.

### Usage

```bash
pnpm install-test [args...]
```

This is equivalent to running `pnpm install` followed by `pnpm test`. All options from `pnpm install` apply.
