# Patching

Applying patches, cherry-picking, rebasing, and reverting changes.

## git apply

Apply a patch to files in the working directory.

```bash
# Apply a patch file
git apply my-changes.patch

# Check if patch applies cleanly
git apply --check my-changes.patch

# Apply with statistics
git apply --stat my-changes.patch

# Apply in reverse
git apply --reverse my-changes.patch

# Apply with 3-way merge
git apply --3way my-changes.patch

# Ignore whitespace
git apply --ignore-whitespace my-changes.patch

# Apply from specific directory
git apply --directory=src/ my-changes.patch
```

## git cherry-pick

Apply changes from existing commits to the current branch.

```bash
# Cherry-pick a single commit
git cherry-pick abc123

# Cherry-pick multiple commits
git cherry-pick abc123 def456

# Cherry-pick a range
git cherry-pick abc123..def456

# Cherry-pick without committing
git cherry-pick --no-commit abc123

# Cherry-pick and edit commit message
git cherry-pick --edit abc123

# Cherry-pick with original message
git cherry-pick -x abc123

# Cherry-pick with reference to source
git cherry-pick -x abc123  # Adds "cherry picked from commit abc123"

# Abort cherry-pick (on conflict)
git cherry-pick --abort

# Continue after resolving conflicts
git cherry-pick --continue

# Skip current commit
git cherry-pick --skip
```

### Cherry-pick workflow

```bash
# On main branch, need a specific fix from feature
git switch main
git cherry-pick abc123  # Apply just this commit

# If conflicts:
# 1. Resolve conflicts in files
# 2. git add resolved-files
# 3. git cherry-pick --continue
```

## git rebase

Reapply commits on top of another base tip.

### Basic rebase

```bash
# Rebase current branch onto main
git rebase main

# Rebase feature onto main
git switch feature
git rebase main

# Rebase onto specific branch
git rebase origin/main

# Rebase specific commits
git rebase --onto main feature abc123
```

### Interactive rebase

```bash
# Rebase last 3 commits interactively
git rebase -i HEAD~3

# Rebase since specific commit
git rebase -i abc123

# Rebase with autosquash (for fixup commits)
git rebase -i --autosquash HEAD~5

# Rebase with auto-stash
git rebase --autostash main
```

### Interactive rebase commands

```
pick f7a3a6d Add feature A          # Keep commit as-is
reword a5b8c3e Fix typo             # Keep commit, edit message
edit 3d9e2f1 Add feature B          # Stop to amend commit
squash 8c1a4b3 Update tests         # Combine with previous commit
fixup 9e2d5a7 Fix formatting        # Like squash, discard message
exec <command>                      # Run shell command
break                               # Stop rebase
drop 1b3c4d5 Remove this commit     # Remove commit
label <name>                        # Label current HEAD
reset <name>                        # Reset to label
merge <name>                        # Create merge commit
```

### Rebase strategies

```bash
# Rebase with merge strategy
git rebase --merge main

# Rebase with specific strategy
git rebase -s ort main

# Rebase preserving merges
git rebase -r main
git rebase --rebase-merges main
```

### Aborting and continuing

```bash
# Abort rebase entirely
git rebase --abort

# Continue after resolving conflicts
git rebase --continue

# Skip current commit (discard)
git rebase --skip

# Edit todo list
git rebase --edit-todo
```

### Rebase and conflicts

```bash
git rebase main
# CONFLICT (content): Merge conflict in file.txt

# Resolve conflicts
# Edit file.txt, remove conflict markers
git add file.txt
git rebase --continue

# Or abort
git rebase --abort
```

### When NOT to rebase

- Commits that have been pushed to shared branches
- Public/shared branches that others have based work on

### Golden rule of rebasing

**Never rebase commits that exist outside your repository and that people may have based work on.**

## git revert

Create a new commit that undoes a previous commit.

```bash
# Revert a single commit
git revert abc123

# Revert without editing message
git revert --no-edit abc123

# Revert multiple commits
git revert abc123 def456

# Revert a range
git revert abc123..def456

# Revert without committing
git revert --no-commit abc123

# Revert a merge commit
git revert -m 1 abc123  # -m 1 = keep mainline (first parent)

# Abort revert
git revert --abort

# Continue after resolving conflicts
git revert --continue
```

### Revert vs reset

```bash
# git revert — creates NEW commit that undoes changes (safe for shared branches)
git revert abc123

# git reset — moves branch pointer back (rewrites history, dangerous for shared branches)
git reset --hard abc123
```

### Reverting a merge

```bash
# Reverting a merge commit requires -m flag
git revert -m 1 <merge-commit>

# -m 1 means: keep first parent's mainline
# -m 2 means: keep second parent's mainline
```

## Patch workflows

### Creating patches

```bash
# Create patch from commits
git format-patch -1 abc123  # One commit
git format-patch -3         # Last 3 commits
git format-patch main..feature  # All commits in feature not in main

# Create patch with cover letter
git format-patch --cover-letter -3

# Output to directory
git format-patch -o patches/ main..feature
```

### Applying patches

```bash
# Apply with git am (applies commit message too)
git am 0001-Add-feature.patch

# Apply with git apply (just the changes)
git apply 0001-Add-feature.patch

# Apply with 3-way merge
git am --3way 0001-Add-feature.patch

# Abort patch application
git am --abort

# Continue after resolving conflicts
git am --continue

# Skip current patch
git am --skip
```

## Best practices

1. Use `git cherry-pick` to apply specific commits between branches
2. Use `git revert` (not `git reset`) on shared branches to undo changes
3. Use interactive rebase to clean up commits before pushing
4. Use `--autosquash` with fixup commits for automatic reordering
5. Never rebase commits already pushed to shared branches
6. Use `git format-patch` for email-based workflows
7. Use `git apply --check` to verify patches before applying
8. Use `--force-with-lease` after rebasing pushed branches
9. Use `git revert -m 1` to undo merge commits
10. Keep feature branches short-lived to minimize rebase conflicts
