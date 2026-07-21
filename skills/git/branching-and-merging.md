# Branching and Merging

Branch management, merging strategies, and related commands.

## Branches in a Nutshell

A branch in Git is simply a lightweight movable pointer to a commit. The default branch name is `master` (or `main` in newer repos).

### Creating branches

```bash
# Create a new branch
git branch feature

# Create and switch to it
git switch -c feature
git checkout -b feature  # Older syntax

# Create branch from specific commit
git branch feature 9fceb02

# Create branch from remote branch
git switch -c feature origin/feature
```

### Switching branches

```bash
# Switch to branch
git switch main
git checkout main  # Older syntax

# Switch to previous branch
git switch -

# Create and switch in one command
git switch -c hotfix
```

### Listing branches

```bash
# List local branches
git branch

# List all branches (local + remote)
git branch -a

# List remote branches only
git branch -r

# List branches with last commit
git branch -v

# List merged branches
git branch --merged

# List unmerged branches
git branch --no-merged
```

### Deleting branches

```bash
# Delete a merged branch
git branch -d feature

# Force delete an unmerged branch
git branch -D feature

# Delete remote branch
git push origin --delete feature
```

### Renaming branches

```bash
# Rename current branch
git branch -m new-name

# Rename specific branch
git branch -m old-name new-name

# Rename remote branch (delete old, push new)
git push origin :old-name new-name
```

## Basic Branching and Merging

### Branch workflow

```bash
# Create and switch to feature branch
git switch -c feature

# Make changes and commit
git add .
git commit -m "Add feature"

# Switch back to main
git switch main

# Merge feature into main
git merge feature

# Delete feature branch (if done)
git branch -d feature
```

### Fast-forward merge

When the current branch has no new commits, Git simply moves the pointer forward:

```bash
git merge feature
# Fast-forward
# 9fceb02 -> a3b5d8e
```

### Three-way merge

When both branches have new commits, Git creates a merge commit:

```bash
git merge feature
# Merge made by the 'ort' strategy
```

### Merge strategies

| Strategy | Description |
|----------|-------------|
| `ort` (default) | Recursive strategy with rename detection |
| `recursive` | Older recursive strategy |
| `octopus` | For merging more than two heads |
| `ours` | Keep current branch, ignore other |
| `subtree` | For subtree projects |

```bash
# Specify strategy
git merge -s ort feature

# No fast-forward (always create merge commit)
git merge --no-ff feature

# Only fast-forward (fail if not possible)
git merge --ff-only feature

# Squash merge (combine all commits into one)
git merge --squash feature
git commit -m "Squash merge feature"
```

## Merge Conflicts

### When conflicts occur

```bash
git merge feature
# Auto-merging file.txt
# CONFLICT (content): Merge conflict in file.txt
# Automatic merge failed; fix conflicts and then commit the result.
```

### Conflict markers

```
<<<<<<< HEAD
Current branch content
=======
Incoming branch content
>>>>>>> feature
```

### Resolving conflicts

```bash
# See conflicted files
git status

# View conflicts
git diff

# Edit files to resolve conflicts, then:
git add file.txt
git commit -m "Merge feature branch"

# Abort merge
git merge --abort

# Use merge tool
git mergetool
```

### Conflict resolution strategies

```bash
# Keep our version (current branch)
git checkout --ours file.txt

# Keep their version (incoming branch)
git checkout --theirs file.txt

# Use a merge tool
git mergetool
```

## git mergetool

```bash
# Launch configured merge tool
git mergetool

# Use specific tool
git mergetool --tool=vimdiff
git mergetool --tool=vscode

# List available tools
git mergetool --tool-help

# Configure default merge tool
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'
```

## git stash

Stash uncommitted changes to work on something else.

```bash
# Stash current changes
git stash
git stash push -m "Work in progress on feature X"

# Stash including untracked files
git stash -u
git stash --include-untracked

# Stash only staged changes
git stash --keep-index

# Stash specific files
git stash push file1.txt file2.txt

# List stashes
git stash list

# Show stash contents
git stash show
git stash show -p stash@{0}

# Apply most recent stash (keeps in stack)
git stash apply

# Apply specific stash
git stash apply stash@{2}

# Apply and drop from stack
git stash pop

# Drop a stash
git stash drop stash@{0}

# Clear all stashes
git stash clear

# Create branch from stash
git stash branch new-branch stash@{0}
```

## git tag

### Lightweight tags

```bash
git tag v1.0-lw
```

### Annotated tags

```bash
git tag -a v1.0 -m "Release version 1.0"
```

### Tagging later

```bash
git tag -a v1.0 -m "Version 1.0" 9fceb02
```

### Sharing tags

```bash
git push origin v1.0
git push origin --tags
```

## git worktree

Manage multiple working trees attached to the same repository.

```bash
# Create a new working tree
git worktree add ../project-feature feature

# Create working tree with new branch
git worktree add -b hotfix ../project-hotfix main

# List working trees
git worktree list

# Remove a working tree
git worktree remove ../project-feature

# Prune stale working tree metadata
git worktree prune
```

## Branch management

### Tracking branches

```bash
# Set up tracking
git branch -u origin/feature
git branch --set-upstream-to=origin/feature feature

# Create tracking branch
git switch -c feature origin/feature
git checkout -b feature origin/feature  # Older syntax
```

### Branch tracking info

```bash
# Show tracking info
git branch -vv

# See which branches are tracking
git remote show origin
```

## Rebasing

### Basic rebase

```bash
# Rebase current branch onto main
git rebase main

# Rebase feature onto main
git switch feature
git rebase main
```

### Interactive rebase

```bash
git rebase -i HEAD~3
```

Interactive rebase editor:
```
pick f7a3a6d Add feature A
squash a5b8c3e Fix typo in A
pick 3d9e2f1 Add feature B
reword 8c1a4b3 Update docs

# Commands:
# pick = use commit
# reword = use commit, edit message
# edit = use commit, stop for amending
# squash = combine with previous commit
# fixup = like squash, discard message
# drop = remove commit
```

### Rebase vs merge

```bash
# Merge: preserves history, creates merge commit
git merge feature

# Rebase: linear history, rewrites commits
git rebase main

# Rebase then merge (recommended for clean history)
git rebase main
git switch main
git merge feature  # Fast-forward
```

### Aborting and continuing rebase

```bash
# Abort rebase
git rebase --abort

# Continue after resolving conflicts
git rebase --continue

# Skip current commit
git rebase --skip
```

## Branching workflows

### Long-running branches

- `main` — stable production code
- `develop` — integration branch
- `feature/*` — individual features
- `hotfix/*` — urgent fixes

### Topic branches

```bash
git switch -c topic/issue-123
# Work on issue
git switch main
git merge topic/issue-123
git branch -d topic/issue-123
```

### Git Flow

```bash
# feature branches
git switch -c feature/new-api develop
# ... work ...
git switch develop
git merge --no-ff feature/new-api
git branch -d feature/new-api

# release branches
git switch -c release-1.2 develop
# ... finalize ...
git switch main
git merge --no-ff release-1.2
git tag -a v1.2 -m "Release 1.2"
git switch develop
git merge --no-ff release-1.2
```

## Remote branches

### Fetching remote branches

```bash
git fetch origin
git fetch --all
git fetch --prune  # Remove deleted remote branches
```

### Pushing to remote branches

```bash
# Push and set upstream
git push -u origin feature

# Push to remote with different name
git push origin local-branch:remote-branch

# Delete remote branch
git push origin --delete feature
```

### Tracking remote branches

```bash
# Auto-tracking on switch
git switch feature  # If origin/feature exists, auto-tracks

# Explicit tracking
git switch -c feature origin/feature
```

## Best practices

1. Use `git switch` and `git restore` instead of `git checkout` (clearer, modern)
2. Use `--no-ff` for merge commits to preserve branch history
3. Rebase feature branches before merging for clean history
4. Never rebase commits that have been pushed to shared branches
5. Delete merged branches to keep branch list clean
6. Use `git stash` before switching branches with uncommitted changes
7. Use annotated tags for releases
8. Use worktrees for parallel work on multiple branches
9. Use `git fetch --prune` to clean up stale remote-tracking branches
10. Write descriptive branch names: `feature/add-auth`, `fix/login-bug`, `hotfix/security-patch`
