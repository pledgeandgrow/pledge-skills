# Administration

Repository maintenance, cleanup, and administration commands.

## git clean

Remove untracked files from the working tree.

```bash
# Dry run — show what would be removed
git clean -n
git clean --dry-run

# Remove untracked files
git clean -f

# Remove untracked files and directories
git clean -fd

# Remove ignored files too
git clean -fdx

# Remove only ignored files
git clean -fX

# Remove untracked files interactively
git clean -i

# Remove files in specific path
git clean -f -- src/

# Force (required when clean.requireForce is not false)
git clean -ff
```

### Clean safety

```bash
# Always check first with dry run
git clean -nd

# Then execute
git clean -f
```

## git gc

Cleanup unnecessary files and optimize the local repository.

```bash
# Run garbage collection
git gc

# Aggressive optimization (more thorough)
git gc --aggressive

# Auto mode (only run if needed)
git gc --auto

# Prune objects older than date
git gc --prune=now
git gc --prune="2 weeks ago"

# Keep newest objects only
git gc --keep-newest
```

### What gc does

1. Packs loose objects into pack files
2. Removes unreachable objects (after grace period)
3. Compresses file revisions
4. Runs `git reflog expire` and `git prune`

## git fsck

Verify the connectivity and validity of objects in the database.

```bash
# Check repository
git fsck

# Check with full output
git fsck --full

# Check for dangling objects
git fsck --dangling

# Check for unreachable objects
git fsck --unreachable

# Don't show dangling objects
git fsck --no-dangling

# Check connectivity only (faster)
git fsck --connectivity-only

# Show progress
git fsck --progress

# Strict check (slower, more thorough)
git fsck --strict
```

### Finding and recovering lost commits

```bash
# Find dangling commits
git fsck --lost-found

# Show reflog to find lost commits
git reflog

# Recover a lost commit
git cherry-pick <lost-commit-hash>
# or
git reset --hard <lost-commit-hash>
```

## git reflog

Manage reflog information (record of when branch tips change).

```bash
# Show reflog
git reflog
git reflog show

# Show reflog for specific branch
git reflog show feature

# Show reflog with dates
git reflog --date=iso

# Show reflog with relative dates
git reflog --date=relative

# Expire old reflog entries
git reflog expire --expire=now --all

# Expire entries older than 90 days (default)
git reflog expire --expire=90.days.ago --all

# Expire unreachable entries
git reflog expire --expire-unreachable=30.days.ago --all

# Delete specific reflog entry
git reflog delete HEAD@{5}

# Show all reflogs
git reflog show --all
```

### Using reflog to recover

```bash
# Accidentally did git reset --hard HEAD~3
git reflog
# abc1234 HEAD@{0}: reset: moving to HEAD~3
# def5678 HEAD@{1}: commit: Add feature
# ghi9012 HEAD@{2}: commit: Fix bug
# jkl3456 HEAD@{3}: commit: Initial commit

# Recover to previous state
git reset --hard def5678
# or
git switch -c recovery def5678
```

## git filter-branch

Rewrite branches by filtering commits. **Deprecated — use git-filter-repo instead.**

```bash
# Remove a file from all commits
git filter-branch --tree-filter 'rm -f secrets.txt' HEAD

# Remove a directory from all commits
git filter-branch --tree-filter 'rm -rf secrets/' HEAD

# Rewrite author email
git filter-branch --commit-filter '
    if [ "$GIT_AUTHOR_EMAIL" = "old@example.com" ]; then
        GIT_AUTHOR_EMAIL="new@example.com"
        GIT_COMMITTER_EMAIL="new@example.com"
    fi
    git commit-tree "$@"
' HEAD

# Remove empty commits
git filter-branch --prune-empty HEAD

# Apply to all branches
git filter-branch --tree-filter 'rm -f secrets.txt' -- --all
```

### Recommended: git-filter-repo

```bash
# Install git-filter-repo
pip install git-filter-repo

# Remove a file from history
git filter-repo --path secrets.txt --invert-paths

# Remove a directory
git filter-repo --path secrets/ --invert-paths

# Replace email
git filter-repo --email-callback '
    return email.replace(b"old@example.com", b"new@example.com")
'
```

## git instaweb

Start a local web interface for the repository.

```bash
# Start web interface
git instaweb

# Start on specific port
git instaweb --httpd=webrick --port=1234

# Stop web interface
git instaweb --stop

# Restart
git instaweb --restart
```

## git archive

Create an archive of files from a named tree.

```bash
# Create tar archive of HEAD
git archive --format=tar --output=project.tar HEAD

# Create zip archive
git archive --format=zip --output=project.zip HEAD

# Archive specific branch
git archive --format=zip --output=release.zip v1.0

# Archive specific directory
git archive --format=tar --output=src.tar HEAD:src/

# Archive with prefix (for extraction)
git archive --format=tar --prefix=project-1.0/ --output=project.tar v1.0

# List files that would be archived
git archive --list HEAD
```

## git bundle

Move objects and refs by archive (for offline transfer).

```bash
# Create a bundle of the entire repo
git bundle create repo.bundle --all

# Create a bundle of specific branch
git bundle create feature.bundle feature

# Create a bundle of commits not in origin
git bundle create changes.bundle origin/main..HEAD

# Create a bundle with specific ref
git bundle create release.bundle v1.0

# Verify a bundle
git bundle verify repo.bundle

# Clone from a bundle
git clone repo.bundle my-repo

# Fetch from a bundle
git fetch repo.bundle main:bundle-main
```

### Offline workflow with bundles

```bash
# On machine with internet:
git bundle create full.bundle --all

# Transfer bundle via USB/email

# On offline machine:
git clone full.bundle my-project
cd my-project
# Make changes
git bundle create changes.bundle main..HEAD

# Transfer changes bundle back

# On original machine:
git fetch changes.bundle HEAD:offline-work
git merge offline-work
```

## Repository maintenance

### Regular maintenance

```bash
# Optimize repository
git gc

# Check integrity
git fsck

# Prune remote-tracking branches
git fetch --prune

# Expire reflog entries
git reflog expire --expire=90.days.ago --all

# Repack objects
git repack -d

# Count objects
git count-objects -v
```

### Counting objects

```bash
git count-objects -v
# count: 42
# size: 204
# in-pack: 1024
# packs: 1
# size-pack: 5120
# prune-packable: 0
# garbage: 0
# size-garbage: 0
```

### Repacking

```bash
# Repack all objects
git repack

# Remove redundant packs
git repack -d

# Maximum compression
git repack -a -d --window=250 --depth=250
```

## Best practices

1. Run `git gc --auto` periodically (Git does this automatically after some commands)
2. Use `git clean -nd` (dry run) before `git clean -f` to verify
3. Use `git filter-repo` instead of `git filter-branch` (faster, safer)
4. Use `git reflog` to recover from accidental resets/deletes
5. Run `git fsck` if you suspect repository corruption
6. Use `git archive` for distributing snapshots without .git
7. Use `git bundle` for offline git transfers
8. Run `git count-objects -v` to check repository size
9. Use `git gc --aggressive` occasionally for large repos
10. Use `git fetch --prune` to clean up stale remote branches
