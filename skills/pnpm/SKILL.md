---
name: pnpm
version: "11.x"
tags:
  - pnpm
  - package manager
  - npm
  - node
  - node.js
  - javascript
  - monorepo
  - workspace
  - lockfile
  - pnpm-lock.yaml
  - content-addressable store
  - hard links
  - symlinks
  - node_modules
  - hoisting
  - isolated
  - hoisted
  - pnp
  - plug and play
  - catalogs
  - catalog protocol
  - filtering
  - pnpmfile
  - hooks
  - overrides
  - peer dependencies
  - autoInstallPeers
  - dedupe
  - side effects cache
  - frozen lockfile
  - offline
  - audit
  - vulnerabilities
  - patch
  - patchedDependencies
  - publish
  - sbom
  - licenses
  - import
  - corepack
  - devEngines
  - runtime
  - node version
  - trust policy
  - minimum release age
  - build script security
  - allowBuilds
  - strictDepBuilds
  - verifyDepsBeforeRun
  - resolutionMode
  - time-based
  - lowest-direct
  - gitBranchLockfile
  - virtualStoreDir
  - packageImportMethod
  - clone
  - copy-on-write
  - shamefullyHoist
  - publicHoistPattern
  - hoistPattern
  - linkWorkspacePackages
  - injectWorkspacePackages
  - sharedWorkspaceLockfile
  - saveWorkspaceProtocol
  - workspace protocol
  - changesets
  - rush
  - pnx
  - pnpm dlx
  - pnpx
  - dynamic package execution
  - npm migration
  - package-lock.json
  - yarn.lock
  - npm-shrinkwrap.json
  - XDG
  - PNPM_HOME
  - npmrc
  - registry
  - JSR
  - proxy
  - SSL
  - child concurrency
  - unsafePerm
  - nodeOptions
  - engineStrict
  - pmOnFail
  - recursiveInstall
  - scriptShell
  - shellEmulator
  - enablePrePostScripts
  - optimisticRepeatInstall
  - dedupeDirectDeps
  - extendNodePath
  - deployAllFiles
  - requiredScripts
  - updateNotifier
  - ignoreCompatibilityDb
  - registrySupportsTimeField
  - savePrefix
  - globalDir
  - cacheDir
  - stateDir
  - continuous integration
  - CI
  - GitHub Actions
  - GitLab CI
  - CircleCI
  - Azure Pipelines
  - config dependencies
  - configDependencies
  - package sources
  - JSR
  - git
  - tarball
  - aliases
  - npm: protocol
  - pnpm link
  - pnpm rebuild
  - pnpm pack
  - pnpm deploy
  - pnpm doctor
  - pnpm test
  - configuring
  - global config
  - FAQ
  - finders
  - global packages
  - tab-completion
  - pnpr
  - registry server
  - install-test
description: |
  pnpm 11.x — fast, disk-efficient package manager. Workspaces, catalogs, filtering, hooks, .npmrc, CLI.
---

# pnpm Documentation Skill

## Overview

pnpm is a fast, disk-efficient package manager for JavaScript and Node.js. It uses a content-addressable store to share dependencies across projects, saving disk space and boosting installation speed. pnpm creates a non-flat `node_modules` directory structure that prevents phantom dependencies, and has built-in support for workspaces (monorepos), catalogs, patching, filtering, and more.

## Key Benefits

- **Disk efficient** — content-addressable store with hard links; shared dependencies across projects
- **Fast installations** — three-stage installation: resolution, directory structure calculation, linking
- **Strict node_modules** — non-flat structure prevents access to undeclared dependencies
- **Workspace support** — built-in monorepo support with `pnpm-workspace.yaml`, workspace protocol
- **Catalogs** — reusable dependency version constants across workspace packages
- **Filtering** — rich `--filter` selector syntax for targeting packages by name, relation, or changes
- **Security** — build script approval, trust policies, minimum release age, audit, SBOM generation
- **Patching** — first-class `pnpm patch` command for modifying dependencies
- **Runtime management** — built-in Node.js/Deno/Bun runtime installation via `devEngines`
- **CLI aliases** — `pn` shorthand for `pnpm`, `pnx` for `pnpm dlx`

## File Index

| File | Topics |
|------|--------|
| `getting-started.md` | Motivation (disk space, speed, non-flat node_modules), feature comparison vs npm/Yarn, installation (standalone script, Corepack, npm, Homebrew, winget, Scoop, Choco, Docker), pnpm CLI overview (short aliases, differences vs npm, options, commands, environment variables), npm-to-pnpm migration, supported package sources (trusted: npm registry/JSR/workspace/local file system, exotic: remote tarball/git repository with semver/subdirectory/provider shorthand), aliases (npm: protocol for package aliasing), config dependencies (configDependencies, platform-specific binaries, usage in hooks/updateConfig/patch files), continuous integration (GitHub Actions, GitLab CI, CircleCI, Azure Pipelines, Bitbucket, Jenkins, Semaphore, AppVeyor, Travis, CI best practices) |
| `configuration.md` | Settings in pnpm-workspace.yaml: dependency resolution (overrides, packageExtensions, allowedDeprecatedVersions, supportedArchitectures, minimumReleaseAge, trustPolicy, registries), hoisting (hoist, hoistPattern, publicHoistPattern, shamefullyHoist, hoistingLimits), node-modules (modulesDir, nodeLinker, symlink, virtualStoreDir, packageImportMethod, modulesCacheMaxAge), store (storeDir, verifyStoreIntegrity), network (proxy, maxsockets, strictSsl), lockfile (lockfile, preferFrozenLockfile, gitBranchLockfile), peer dependencies (autoInstallPeers, dedupePeerDependents, strictPeerDependencies), CLI settings (color, loglevel, engineStrict, pmOnFail), build settings (ignoreScripts, childConcurrency, sideEffectsCache, verifyDepsBeforeRun, strictDepBuilds, allowBuilds), Node.js settings (nodeVersion, runtimeOnFail, nodeDownloadMirrors), versioning settings, other settings (savePrefix, tag, globalDir, cacheDir, resolutionMode, extendNodePath, dedupeDirectDeps, optimisticRepeatInstall, enablePrePostScripts, scriptShell), package.json fields (engines, devEngines, dependenciesMeta, peerDependenciesMeta, publishConfig), .npmrc auth |
| `workspaces.md` | Workspace setup (pnpm-workspace.yaml), workspace protocol (workspace:), aliases, relative paths, publishing workspace packages, release workflow (changesets, Rush), troubleshooting (cyclic dependencies), workspace configuration (linkWorkspacePackages, injectWorkspacePackages, dedupeInjectedDeps, syncInjectedDepsAfterScripts, preferWorkspacePackages, sharedWorkspaceLockfile, saveWorkspaceProtocol, includeWorkspaceRoot, ignoreWorkspaceCycles, disallowWorkspaceCycles, failIfNoMatch), catalogs (catalog: protocol, default catalog, named catalogs, advantages, publishing, settings), filtering (--filter syntax: by name, dependencies, dependents, glob, changed files, excluding, multiplicity, --filter-prod, --test-pattern), .pnpmfile.mjs hooks (readPackage, updateConfig, afterAllResolved, beforePacking, preResolution, importPackage, fetchers, custom resolvers, custom fetchers, related configuration) |
| `cli-commands.md` | Full CLI command reference: pnpm install (options: --force, --offline, --prefer-offline, --no-lockfile, --lockfile-only, --dry-run, --fix-lockfile, --update-checksums, --frozen-lockfile, --reporter, --shamefully-hoist, --ignore-scripts, --filter, --resolution-only, --prod, --dev, --no-optional), pnpm add (sources: npm, JSR, workspace, local, remote, git; options: --save-prod, --save-dev, --save-optional, --save-exact, --save-peer, --save-catalog, --global, --workspace, --allow-build, --filter), pnpm update (--recursive, --latest, --global, --workspace, --prod, --dev, --interactive, --no-save, --filter), pnpm remove (--recursive, --global, --filter), pnpm run (--recursive, --if-present, --no-bail, --parallel, --sequential, --stream, --aggregate-output, --resume-from, --report-summary, --filter; regex script matching; environment variables), pnpm exec (--recursive, --parallel, --shell-mode, --report-summary, --filter), pnx/dlx (--package, --allow-build, --shell-mode, --silent; security and trust policies), pnpm publish (--recursive, --json, --tag, --access, --no-git-checks, --publish-branch, --force, --batch, --provenance, --dry-run, --otp, --filter; life cycle scripts), pnpm patch (--edit-dir, --ignore-existing; patchedDependencies, allowUnusedPatches), pnpm audit (--audit-level, --fix, --fix=update, --interactive, --json, --dev, --prod, --ignore, --ignore-unfixable; signatures), pnpm config (set, get, delete, list; --global, --location, --json), pnpm store (status, add, prune, path), pnpm list/ls (--recursive, --json, --long, --parseable, --global, --depth, --prod, --dev, --filter), pnpm why (--recursive, --json, --long, --parseable, --global, --depth, --filter), pnpm import (from npm/Yarn lockfiles), pnpm setup, pnpm root, pnpm sbom, pnpm licenses, pnpm create, pnpm runtime, pnpm with, pnpm recursive, pnpm link/ln (symlink local package, use cases, pnpm link vs file: protocol), pnpm unlink, pnpm rebuild/rb (--recursive, --filter), pnpm pack (--recursive, --out, --pack-destination, --pack-gzip-level, --json, --filter, --dry-run, --skip-manifest-obfuscation; life cycle scripts), pnpm deploy (--dev, --no-optional, --prod, --filter, --legacy; forceLegacyDeploy), pnpm doctor (health checks: versions/install method/global bin/cache/store/filesystem/registry connectivity/install smoke test; --offline, --benchmark, --json), pnpm test (shorthand for pnpm run test) |

## Quick Start

```bash
# Install pnpm
npm install -g pnpm
# or via Corepack
corepack enable pnpm
# or standalone (POSIX)
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Initialize a project
pnpm init

# Install dependencies
pnpm install

# Add a package
pnpm add express
pnpm add -D typescript
pnpm add -g nodemon

# Run scripts
pnpm build
pnpm test
pnpm run "watch:.*"

# Update packages
pnpm update
pnpm update --latest
pnpm update "@babel/*"

# Remove a package
pnpm remove express

# Execute a one-off command
pnx create-vite my-app
pnpm dlx prettier --write .

# Audit for vulnerabilities
pnpm audit
pnpm audit --fix

# Store management
pnpm store path
pnpm store prune

# Workspace setup
# Create pnpm-workspace.yaml in root:
# packages:
#   - packages/*
#   - apps/*
pnpm --filter @myapp/web build
pnpm -r build
```

## Documentation Links

- [Motivation](https://pnpm.io/motivation)
- [Feature Comparison](https://pnpm.io/feature-comparison)
- [Installation](https://pnpm.io/installation)
- [pnpm CLI](https://pnpm.io/pnpm-cli)
- [Workspace](https://pnpm.io/workspaces)
- [Settings (pnpm-workspace.yaml)](https://pnpm.io/settings)
- [Catalogs](https://pnpm.io/catalogs)
- [Filtering](https://pnpm.io/filtering)
- [.pnpmfile.mjs](https://pnpm.io/pnpmfile)
- [package.json](https://pnpm.io/package_json)
- [pnpr (registry server)](https://pnpm.io/pnpr)
- [Supported Package Sources](https://pnpm.io/package-sources)
- [Aliases](https://pnpm.io/aliases)
- [Config Dependencies](https://pnpm.io/config-dependencies)
- [Continuous Integration](https://pnpm.io/continuous-integration)
- [pnpm link](https://pnpm.io/cli/link)
- [pnpm rebuild](https://pnpm.io/cli/rebuild)
- [pnpm pack](https://pnpm.io/cli/pack)
- [pnpm deploy](https://pnpm.io/cli/deploy)
- [pnpm doctor](https://pnpm.io/cli/doctor)
- [pnpm test](https://pnpm.io/cli/test)
- [pnpm dedupe](https://pnpm.io/cli/dedupe)
- [pnpm install-test](https://pnpm.io/cli/install-test)
- [Configuring](https://pnpm.io/configuring)
- [Git Branch Lockfiles](https://pnpm.io/git_branch_lockfiles)
- [Finders](https://pnpm.io/finders)
- [Global Packages](https://pnpm.io/global-packages)
- [Command line tab-completion](https://pnpm.io/completion)
- [FAQ](https://pnpm.io/faq)
