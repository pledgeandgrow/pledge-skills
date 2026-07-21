# Git Tools

Advanced Git tools and techniques from the Pro Git book.

## Revision Selection

### Single revisions

```bash
git show HEAD              # Current commit
git show HEAD~3            # 3 commits before HEAD
git show HEAD^             # First parent
git show HEAD^2            # Second parent (merge)
git show main~2^2          # Complex navigation
git show v1.0              # Tag
git show abc123            # Hash
```

### Ranges

```bash
# Commits in B not in A
git log A..B

# Commits in either but not both
git log A...B

# Left/right indicator
git log --left-right A...B

# Exclude
git log ^main feature
git log feature --not main
```

### Reflog

```bash
# Show reflog
git reflog

# Reference by reflog position
git show HEAD@{0}
git show HEAD@{yesterday}
git show main@{1.week.ago}
git show HEAD@{5}
```

## Interactive Staging

```bash
# Interactive staging
git add -i
git add --interactive

# Patch mode — stage specific hunks
git add -p
git add --patch

# Select hunks interactively
# Commands in patch mode:
# y - stage this hunk
# n - do not stage this hunk
# a - stage all hunks
# d - do not stage this or other hunks
# s - split hunk into smaller hunks
# e - manually edit hunk
# q - quit
```

## Stashing

```bash
# Stash changes
git stash
git stash push -m "Work in progress"

# Stash untracked files
git stash -u

# Keep index (staged changes stay staged)
git stash --keep-index

# List stashes
git stash list

# Apply stash
git stash apply
git stash apply stash@{2}

# Apply and drop
git stash pop

# Show stash diff
git stash show -p
git stash show -p stash@{1}

# Drop stash
git stash drop stash@{0}

# Clear all
git stash clear

# Create branch from stash
git stash branch new-branch stash@{0}
```

## Cleaning

```bash
# Dry run
git clean -nd

# Remove untracked files
git clean -f

# Remove untracked directories
git clean -fd

# Remove ignored files too
git clean -fdx

# Interactive
git clean -i
```

## Signing Your Work

### GPG signing

```bash
# List GPG keys
gpg --list-secret-keys --keyid-format=long

# Generate GPG key
gpg --full-generate-key

# Configure Git to sign
git config --global user.signingkey <key-id>
git config --global commit.gpgsign true

# Sign a commit
git commit -S -m "Signed commit"

# Sign a tag
git tag -s v1.0 -m "Signed release"

# Verify signature
git verify-commit <hash>
git tag -v v1.0
```

### SSH signing (Git 2.34+)

```bash
# Use SSH key for signing
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub

# Sign commits
git commit -S -m "Signed commit"
```

## Searching

### git grep

```bash
# Search tracked files
git grep "pattern"
git grep -n "pattern"      # With line numbers
git grep -i "pattern"      # Case insensitive
git grep -e "pattern" -- "*.ts"

# Search at specific revision
git grep "pattern" HEAD
git grep "pattern" v1.0
```

### Git log search

```bash
# Search commit messages
git log --grep="pattern"
git log --grep="pattern" -i

# Search code changes (when added/removed)
git log -S "functionName"
git log -S "functionName" --oneline

# Search with regex
git log -G "function\w+" --oneline -p

# Search in specific files
git log -S "pattern" -- src/file.ts
```

### Line-level search

```bash
# Find when a line range was last changed
git log -L 42,50:src/file.ts

# Find function history
git log -L :functionName:src/file.ts
```

## Rewriting History

### Changing last commit

```bash
# Amend last commit
git commit --amend
git commit --amend --no-edit
git commit --amend -m "New message"

# Add files to last commit
git add forgotten-file.txt
git commit --amend --no-edit
```

### Changing multiple commits

```bash
# Interactive rebase
git rebase -i HEAD~3

# Reorder: move lines up/down
# Squash: change pick to squash
# Split: change pick to edit, then:
git rebase -i HEAD~3
# When stopped at commit to split:
git reset HEAD~
git add patch1.txt
git commit -m "First part"
git add patch2.txt
git commit -m "Second part"
git rebase --continue
```

### Filter branch / filter-repo

```bash
# Remove file from all history
git filter-repo --path secrets.txt --invert-paths

# Change author email
git filter-repo --email-callback '
    return email.replace(b"old@ex.com", b"new@ex.com")
'
```

## Reset Demystified

### Three trees of Git

1. **HEAD** — last commit snapshot
2. **Index** — next commit snapshot (staging area)
3. **Working directory** — current files

### Reset modes

```bash
# --soft: move HEAD only
git reset --soft HEAD~1
# HEAD moves, index and working dir unchanged

# --mixed (default): move HEAD, reset index
git reset HEAD~1
git reset --mixed HEAD~1
# HEAD moves, index reset, working dir unchanged

# --hard: move HEAD, reset index AND working dir
git reset --hard HEAD~1
# Everything reset — changes lost!

# Reset specific file
git reset HEAD~1 -- file.txt
```

### Checkout vs reset

```bash
# checkout — switches branches or restores files (doesn't move HEAD for files)
git checkout main          # Switch branch (moves HEAD)
git checkout -- file.txt   # Restore file (doesn't move HEAD)

# reset — moves branch pointer
git reset --hard HEAD~1    # Moves branch pointer
```

## Advanced Merging

### Merge strategies

```bash
# Force merge commit
git merge --no-ff feature

# Only fast-forward
git merge --ff-only feature

# Squash merge
git merge --squash feature

# Octopus merge (3+ branches)
git merge feature1 feature2 feature3

# Our strategy (keep current)
git merge -s ours feature

# Recursive with strategy options
git merge -X ours feature     # Prefer our changes on conflict
git merge -X theirs feature   # Prefer their changes
git merge -X ignore-space-change feature
git merge -X ignore-all-space feature
```

### Conflict resolution

```bash
# Check conflict status
git status

# View conflicts
git diff
git diff --diff-filter=U  # Only conflicted files

# Resolve with ours/theirs
git checkout --ours file.txt
git checkout --theirs file.txt

# Use merge tool
git mergetool

# After resolving
git add file.txt
git commit
```

### Aborting merge

```bash
git merge --abort
git reset --hard HEAD  # Also works
```

## Rerere (Reuse Recorded Resolution)

```bash
# Enable rerere
git config --global rerere.enabled true

# Git remembers how you resolved conflicts
# When same conflict occurs again, it auto-resolves

# View rerere status
git rerere status

# View diff of recorded resolution
git rerere diff

# Forget recorded resolution
git rerere forget file.txt

# Clear all
git rerere clear
```

## Submodules

```bash
# Add submodule
git submodule add https://github.com/user/lib.git libs/lib

# Clone with submodules
git clone --recurse-submodules https://github.com/user/repo.git

# Update submodules
git submodule update --init --recursive
git submodule update --remote

# Foreach
git submodule foreach 'git status'

# Deinit
git submodule deinit libs/lib
git rm libs/lib
```

## Bundling

```bash
# Create bundle
git bundle create repo.bundle --all
git bundle create changes.bundle main..feature

# Verify
git bundle verify repo.bundle

# Clone from bundle
git clone repo.bundle my-repo

# Fetch from bundle
git fetch repo.bundle main:bundle-main
```

## Replace

```bash
# Replace a commit with another
git replace abc123 def456

# List replacements
git replace -l

# Delete replacement
git replace -d abc123

# Push replacements
git push origin refs/replace/abc123
```

## Credential Storage

```bash
# Store (plaintext)
git config --global credential.helper store

# Cache (in memory)
git config --global credential.helper 'cache --timeout=3600'

# OS keychain
git config --global credential.helper osxkeychain  # macOS
git config --global credential.helper manager       # Windows

# Custom helper
git config --global credential.helper '!f() { echo "username=myuser"; echo "password=mypass"; }; f'
```

## Best practices

1. Use `git add -p` for granular staging
2. Enable `rerere.enabled` for repeated rebases
3. Use `git log -S` to find when code was added/removed
4. Use `git log -L` to track specific function history
5. Use SSH signing instead of GPG (simpler setup)
6. Use `git filter-repo` instead of `git filter-branch`
7. Use `--force-with-lease` after rewriting history
8. Use `git stash` before switching branches
9. Use `git clean -nd` to preview before cleaning
10. Use `git merge -X` strategy options for automated conflict resolution
