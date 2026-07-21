# Sharing and Updating Projects

Fetching, pulling, pushing, remotes, and submodules.

## Working with Remotes

### Showing remotes

```bash
# List remotes
git remote

# List remotes with URLs
git remote -v

# Show details of a remote
git remote show origin
```

### Adding remotes

```bash
git remote add origin https://github.com/user/repo.git
git remote add upstream https://github.com/original/repo.git
git remote add fork https://github.com/me/repo.git
```

### Modifying remotes

```bash
# Rename
git remote rename origin upstream

# Change URL
git remote set-url origin git@github.com:user/repo.git

# Remove
git remote remove origin
```

## git fetch

Download objects and refs from a remote repository. Does NOT merge.

```bash
# Fetch from origin (default remote)
git fetch

# Fetch from specific remote
git fetch origin

# Fetch from all remotes
git fetch --all

# Fetch and prune deleted branches
git fetch --prune
git fetch -p

# Fetch specific branch
git fetch origin main

# Fetch tags
git fetch --tags

# Fetch with submodules
git fetch --recurse-submodules

# Dry run
git fetch --dry-run

# Fetch with force (update tags too)
git fetch --force
```

### Fetch vs pull

```bash
# git fetch — downloads, does NOT merge
git fetch origin
git merge origin/main  # Manual merge

# git pull — fetch + merge in one step
git pull origin main
```

## git pull

Fetch from and integrate with another repository or local branch.

```bash
# Pull from default remote
git pull

# Pull from specific remote/branch
git pull origin main

# Pull with rebase (recommended)
git pull --rebase
git pull --rebase origin main

# Pull with merge (default)
git pull --no-rebase

# Pull with squash
git pull --squash

# Pull only if fast-forward possible
git pull --ff-only

# Allow unrelated histories
git pull --allow-unrelated-histories

# Configure default pull strategy
git config --global pull.rebase true   # Rebase by default
git config --global pull.rebase false  # Merge by default
git config --global pull.ff only       # Fast-forward only
```

### Pull with rebase workflow

```bash
# Recommended: rebase instead of merge
git pull --rebase origin main

# If conflicts occur:
# 1. Resolve conflicts
# 2. git add resolved-files
# 3. git rebase --continue
```

## git push

Update remote refs along with associated objects.

```bash
# Push current branch to origin
git push origin main

# Push and set upstream
git push -u origin feature
git push --set-upstream origin feature

# Push all branches
git push --all

# Push all tags
git push --tags

# Push specific tag
git push origin v1.0

# Delete remote branch
git push origin --delete feature

# Force push (dangerous — overwrites remote history)
git push --force origin feature

# Force with lease (safer — checks remote hasn't changed)
git push --force-with-lease origin feature

# Push with atomic (all or nothing)
git push --atomic origin main feature

# Dry run
git push --dry-run

# Push with tags
git push --follow-tags
```

### Force push safety

```bash
# DANGEROUS: overwrites remote, can lose others' work
git push --force origin feature

# SAFER: only force if no one else pushed
git push --force-with-lease origin feature

# SAFEST: force only if your local ref matches remote
git push --force-with-lease=feature:origin/feature origin feature
```

### Pushing with lease and refspec

```bash
# Force push only if remote is at expected commit
git push --force-with-lease=refs/heads/main:abc123 origin main
```

## Remote-tracking branches

```bash
# Remote-tracking branches are read-only references
origin/main
origin/feature
upstream/develop

# They update only on git fetch

# Create local branch from remote-tracking
git switch -c feature origin/feature

# Check out remote branch directly (detached HEAD)
git switch --detach origin/feature
```

### Pruning remote branches

```bash
# Remove stale remote-tracking branches
git fetch --prune
git remote prune origin

# Show what would be pruned
git remote prune --dry-run origin
```

## git submodule

Submodules allow embedding a Git repository inside another.

### Adding submodules

```bash
# Add a submodule
git submodule add https://github.com/user/dependency.git libs/dependency

# Add specific branch
git submodule add -b main https://github.com/user/dependency.git libs/dependency

# This creates:
# - .gitmodules file
# - The submodule directory with checked out files
# - A gitlink entry in the index
```

### .gitmodules file

```ini
[submodule "libs/dependency"]
    path = libs/dependency
    url = https://github.com/user/dependency.git
    branch = main
```

### Cloning with submodules

```bash
# Clone and initialize submodules
git clone --recurse-submodules https://github.com/user/repo.git

# If already cloned without submodules
git submodule update --init --recursive
```

### Working with submodules

```bash
# Initialize submodules
git submodule init

# Update submodules to recorded commit
git submodule update

# Initialize and update in one command
git submodule update --init

# Update recursively (nested submodules)
git submodule update --init --recursive

# Update to latest remote branch
git submodule update --remote
git submodule update --remote --merge

# Foreach — run command in each submodule
git submodule foreach 'git status'
git submodule foreach --recursive 'git checkout main'
```

### Pulling changes from submodules

```bash
# Update all submodules to latest
git submodule update --remote

# Update specific submodule
git submodule update --remote libs/dependency

# Stage submodule changes
git add libs/dependency
git commit -m "Update dependency submodule"
```

### Deleting submodules

```bash
# Remove submodule
git submodule deinit libs/dependency
git rm libs/dependency
git commit -m "Remove dependency submodule"

# Clean up .git/modules
rm -rf .git/modules/libs/dependency
```

### Submodule best practices

```bash
# Always use --recurse-submodules when cloning
git clone --recurse-submodules <url>

# Use --recursive for nested submodules
git submodule update --init --recursive

# After pulling main repo changes
git pull --recurse-submodules

# Check submodule status
git submodule status
```

## Refspecs

A refspec maps remote branches to local refs.

```bash
# Default refspec
+refs/heads/*:refs/remotes/origin/*

# Push refspec — push local branch to different remote name
git push origin local-branch:remote-branch

# Fetch refspec — fetch remote branch to specific local ref
git fetch origin remote-branch:local-branch

# Delete remote branch using refspec
git push origin :remote-branch  # Push nothing to remote-branch = delete
```

### Configuring refspecs

```ini
# .git/config
[remote "origin"]
    url = https://github.com/user/repo.git
    fetch = +refs/heads/*:refs/remotes/origin/*
    fetch = +refs/pull/*/head:refs/remotes/origin/pr/*
```

## Best practices

1. Use `git fetch` + `git merge` instead of `git pull` for more control
2. Configure `pull.rebase true` for linear history
3. Always use `--force-with-lease` instead of `--force`
4. Use `git fetch --prune` to clean stale remote-tracking branches
5. Use `--recurse-submodules` when cloning and pulling
6. Keep `.gitmodules` committed and up to date
7. Use SSH URLs for remotes to avoid repeated credential prompts
8. Set upstream with `-u` on first push for easier future commands
9. Use `git push --follow-tags` to push commits and tags together
10. Document submodule usage for team members
