# Sparse Checkout, Scalar, and Partial Clone

Working with subsets of repositories and large repository management.

## git sparse-checkout

Reduce the working tree to a subset of tracked files. Essential for large monorepos.

### Enabling sparse checkout

```bash
# Enable sparse checkout
git sparse-checkout init

# Enable with cone mode (default, directory-based patterns)
git sparse-checkout init --cone

# Disable sparse checkout (restore all files)
git sparse-checkout disable
```

### Setting sparse checkout patterns

```bash
# Add directories to sparse checkout
git sparse-checkout set src/ tests/ docs/

# Add more directories
git sparse-checkout add libs/ vendor/

# View current sparse checkout
git sparse-checkout list

# Reapply patterns (after manual edits to .git/info/sparse-checkout)
git sparse-checkout reapply
```

### Cone mode vs non-cone mode

```bash
# Cone mode (default) — directory-based, recursive
# Patterns are directory names, everything under them is included
git sparse-checkout set --cone src/ tests/

# Non-cone mode — file patterns (like .gitignore)
git sparse-checkout set --no-cone
# Then edit .git/info/sparse-checkout with patterns:
# /src/*
# /tests/*.ts
# !/src/secrets/
```

### Sparse checkout with subdirectories

```bash
# Only checkout specific subdirectories
git sparse-checkout set packages/frontend packages/shared

# Deep paths
git sparse-checkout set src/components src/utils
```

### Checking sparse checkout status

```bash
# Show sparse checkout status
git sparse-checkout list

# Check if sparse checkout is enabled
git config core.sparseCheckout
git config core.sparseCheckoutCone
```

## Partial Clone

Clone repositories without downloading all objects initially.

```bash
# Clone without file contents (blobs downloaded on demand)
git clone --filter=blob:none https://github.com/user/repo.git

# Clone without trees and blobs
git clone --filter=tree:0 https://github.com/user/repo.git

# Clone with blob size limit
git clone --filter=blob:limit=1m https://github.com/user/repo.git

# Combine with shallow clone
git clone --filter=blob:none --depth 1 https://github.com/user/repo.git

# Combine with sparse checkout
git clone --filter=blob:none --no-checkout https://github.com/user/repo.git
cd repo
git sparse-checkout init --cone
git sparse-checkout set src/
git checkout main
```

### Partial clone filters

| Filter | Description |
|--------|-------------|
| `blob:none` | Omit all blobs (file contents) |
| `blob:limit=<size>` | Omit blobs larger than size |
| `tree:0` | Omit all trees and blobs |
| `object:pointers` | Omit all objects except those reachable from refs |

### Promisor remotes

```bash
# Configure promisor remote (for lazy fetching)
git config remote.origin.promisor true

# Partial clone sets up promisor automatically
# Git fetches missing objects on demand when you checkout/file access
```

## git backfill

Download missing objects in a partial clone.

```bash
# Download missing objects for current sparse checkout
git backfill

# Download missing objects for all tracked files
git backfill --all
```

## git maintenance

Run tasks to optimize Git repository data.

```bash
# Run all maintenance tasks
git maintenance run

# Run specific task
git maintenance run --task=commit-graph
git maintenance run --task=loose-objects
git maintenance run --task=incremental-repack
git maintenance run --task=pack-refs
git maintenance run --task=prefetch

# Run all tasks
git maintenance run --task=commit-graph --task=loose-objects --task=incremental-repack --task=pack-refs --task=prefetch

# Enable scheduled maintenance
git maintenance start

# Disable scheduled maintenance
git maintenance stop

# Register repo for maintenance
git maintenance register

# Unregister repo
git maintenance unregister
```

### Maintenance tasks

| Task | Description |
|------|-------------|
| `commit-graph` | Update commit-graph file for faster log/diff |
| `loose-objects` | Pack loose objects into pack files |
| `incremental-repack` | Repack packed objects with newer loose objects |
| `pack-refs` | Pack loose refs into a single file |
| `prefetch` | Prefetch updates from remotes |

## scalar

A tool for managing large Git repositories.

```bash
# Clone a repository with scalar optimizations
scalar clone https://github.com/user/large-repo.git

# Enable scalar on existing repo
scalar register

# Disable scalar
scalar unregister

# Run maintenance
scalar run

# Configure scalar settings
scalar config set scalar.repo /path/to/repo

# List scalar repos
scalar list
```

### What scalar does

- Enables partial clone (`--filter=blob:none`)
- Enables sparse checkout (cone mode)
- Enables filesystem monitor (`core.fsmonitor`)
- Enables untracked cache (`core.untrackedCache`)
- Sets up scheduled maintenance
- Configures feature.manyFiles
- Enables commit graph

## git pack-refs

Pack heads and tags for efficient repository access.

```bash
# Pack all refs
git pack-refs --all

# Pack refs (non-dry-run)
git pack-refs --all --prune

# Dry run
git pack-refs --all --dry-run
```

### What pack-refs does

Moves loose ref files from `.git/refs/heads/*` and `.git/refs/tags/*` into a single packed file `.git/packed-refs`. This improves performance for repos with many branches/tags.

## git prune

Prune all unreachable objects from the object database.

```bash
# Prune unreachable objects
git prune

# Dry run (show what would be pruned)
git prune --dry-run
git prune -n

# Prune objects older than date
git prune --expire="2 weeks ago"

# Prune immediately
git prune --expire=now

# Verbose
git prune -v
```

### prune vs gc

```bash
# git prune — removes unreachable objects
# git gc — runs prune + repack + other optimizations

# gc calls prune internally
git gc --prune=now
```

## git diagnose

Generate a zip archive of diagnostic information.

```bash
# Generate diagnostic archive
git diagnose

# Output to specific file
git diagnose -o diagnostics.zip

# Include specific modes
git diagnose --mode=all
```

## git fast-export

Git data exporter (counterpart to `git fast-import`).

```bash
# Export all history
git fast-export --all

# Export specific branch
git fast-export main

# Export range
git fast-export main..feature

# Export with marks
git fast-export --export-marks=marks.txt --all

# Export with signed tags
git fast-export --signed-tags=strip --all

# Import into another repo
cd /path/to/other-repo
git fast-import < export.fi
```

## Best practices

1. Use `git sparse-checkout` for large monorepos to reduce working directory size
2. Use partial clone (`--filter=blob:none`) to avoid downloading unnecessary history
3. Use `scalar clone` for optimal large repository setup
4. Enable `git maintenance start` for scheduled background optimization
5. Run `git pack-refs --all` periodically for repos with many branches/tags
6. Use `git prune --expire=now` to immediately clean unreachable objects
7. Combine sparse checkout + partial clone for maximum performance
8. Use cone mode for sparse checkout (simpler, faster)
9. Use `git diagnose` to collect info for bug reports
10. Use `git fast-export` / `git fast-import` for repository migration
