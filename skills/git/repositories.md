# Repositories — init and clone

Creating and obtaining Git repositories.

## Creating a New Repository

### git init

Initialize a new Git repository in the current directory:

```bash
# Create new repository in current directory
git init

# Create new repository in specified directory
git init my-project
cd my-project

# Initialize as bare repository (for servers)
git init --bare

# Specify initial branch name
git init --initial-branch=main
git init -b main
```

After `git init`, the directory gets a `.git/` subdirectory containing the repository metadata. No files are tracked yet.

### Initial setup after init

```bash
git init
git config user.name "Your Name"
git config user.email "you@example.com"
echo "# My Project" > README.md
git add README.md
git commit -m "Initial commit"
```

## Cloning an Existing Repository

### git clone

Clone a repository from a remote URL:

```bash
# Basic clone
git clone https://github.com/user/repo.git

# Clone into specific directory
git clone https://github.com/user/repo.git my-directory

# Clone via SSH
git clone git@github.com:user/repo.git

# Clone specific branch
git clone --branch main https://github.com/user/repo.git
git clone -b develop https://github.com/user/repo.git

# Shallow clone (only latest commit)
git clone --depth 1 https://github.com/user/repo.git

# Shallow clone with history
git clone --depth 10 https://github.com/user/repo.git

# Clone without checkout (just .git data)
git clone --no-checkout https://github.com/user/repo.git

# Clone as bare (for mirroring)
git clone --bare https://github.com/user/repo.git

# Clone with submodules
git clone --recurse-submodules https://github.com/user/repo.git

# Clone only specific branch (saves bandwidth)
git clone --single-branch --branch main https://github.com/user/repo.git
```

### Clone protocols

| Protocol | URL format | Notes |
|----------|-----------|-------|
| HTTPS | `https://github.com/user/repo.git` | Works everywhere, requires token/credentials |
| SSH | `git@github.com:user/repo.git` | Requires SSH key, preferred for frequent use |
| Git | `git://github.com/user/repo.git` | Unauthenticated, read-only |
| Local | `/path/to/repo` or `file:///path/to/repo` | Fast, same machine |

### What clone creates

```bash
git clone https://github.com/user/repo.git
# Creates:
# - repo/ directory
# - .git/ directory (full repository data)
# - Checks out default branch (main or master)
# - Sets up 'origin' remote
# - Sets up remote-tracking branches
```

## Recording Changes to the Repository

### File lifecycle

```
Untracked ──git add──> Staged ──git commit──> Committed
    │                      │
    └── modify──> Modified ──git add──> Staged
```

### Checking repository status

```bash
git status
git status --short    # Compact output
git status -s         # Same as --short
```

Short status codes:
- `??` — untracked file
- `A` — added (staged)
- `M` — modified
- `D` — deleted
- `R` — renamed
- `C` — copied
- `U` — conflict (unmerged)

First column = staging area, second column = working directory.

### Tracking new files

```bash
# Track a single file
git add README.md

# Track all files in current directory
git add .

# Track all changes (including deletions)
git add -A

# Track specific directory
git add src/

# Track interactively
git add -i
git add -p   # Patch mode — stage hunks individually
```

### Staging modified files

```bash
# Stage a modified file
git add modified-file.txt

# Stage all modified files
git add -u

# Stage specific lines (interactive)
git add -p file.txt
```

### Viewing changes

```bash
# See unstaged changes
git diff

# See staged changes
git diff --staged
git diff --cached   # Same as --staged

# See both staged and unstaged
git diff HEAD

# See changes in specific file
git diff -- file.txt

# See word-level differences
git diff --word-diff

# See summary of changes
git diff --stat
```

### Committing changes

```bash
# Commit with message
git commit -m "Add feature X"

# Commit with multi-line message
git commit -m "Add feature X

This feature does A, B, and C.
Fixes #123."

# Stage all tracked files and commit
git commit -am "Update files"

# Amend the last commit
git commit --amend -m "New message"
git commit --amend --no-edit  # Keep original message

# Sign commits with GPG
git commit -S -m "Signed commit"

# Author and date overrides
git commit --author="John Doe <john@example.com>" --date="2024-01-15T10:00:00"
```

### Removing files

```bash
# Remove from Git and filesystem
git rm file.txt

# Remove from staging but keep in working directory
git rm --cached file.txt

# Remove directory recursively
git rm -r old-directory/

# Remove with force (even if modified)
git rm -f file.txt
```

### Moving files

```bash
# Rename a file (Git detects renames)
git mv old-name.txt new-name.txt

# Git automatically detects renames even with regular mv
mv old-name.txt new-name.txt
git add -A
# Git will show this as a rename
```

## Viewing commit history

```bash
# Basic log
git log

# Compact one-line per commit
git log --oneline

# Show stats (files changed)
git log --stat

# Show patch/diff for each commit
git log -p

# Limit number of commits
git log -5

# Show graph of branches
git log --graph --oneline --all

# Filter by author
git log --author="John"

# Filter by date
git log --since="2 weeks ago"
git log --until="2024-01-01"
git log --since="2024-01-01" --until="2024-06-01"

# Filter by message
git log --grep="fix"

# Show commits for specific file
git log -- file.txt

# Show commits in a range
git log main..feature

# Format output
git log --pretty=format:"%h - %an, %ar : %s"
git log --pretty=format:"%h %s" --graph
```

### Useful format placeholders

| Placeholder | Description |
|------------|-------------|
| `%H` | Full commit hash |
| `%h` | Abbreviated commit hash |
| `%T` | Full tree hash |
| `%t` | Abbreviated tree hash |
| `%an` | Author name |
| `%ae` | Author email |
| `%ad` | Author date |
| `%ar` | Author date, relative |
| `%cn` | Committer name |
| `%s` | Subject (first line) |
| `%b` | Body (full message) |

## Undoing things

### Undo last commit (keep changes)

```bash
# Undo last commit, keep changes staged
git reset --soft HEAD~1

# Undo last commit, keep changes unstaged
git reset --mixed HEAD~1  # default
git reset HEAD~1

# Undo last commit, discard all changes
git reset --hard HEAD~1
```

### Unstage a file

```bash
git restore --staged file.txt
# Older syntax (still works):
git reset HEAD file.txt
```

### Unmodify a file

```bash
# Discard changes in working directory
git restore file.txt
# Older syntax:
git checkout -- file.txt
```

## Working with remotes

### Showing remotes

```bash
git remote -v
git remote show origin
```

### Adding remotes

```bash
git remote add origin https://github.com/user/repo.git
git remote add upstream https://github.com/original/repo.git
```

### Fetching and pulling

```bash
git fetch origin
git fetch --all
git pull origin main
git pull --rebase origin main
```

### Pushing

```bash
git push origin main
git push -u origin main  # Set upstream
git push --force origin main  # Force push (dangerous)
git push --force-with-lease origin main  # Safer force push
```

### Renaming and removing remotes

```bash
git remote rename origin upstream
git remote remove upstream
```

## Tagging

### List tags

```bash
git tag
git tag -l "v1.*"
```

### Create tags

```bash
# Lightweight tag
git tag v1.0

# Annotated tag (recommended)
git tag -a v1.0 -m "Version 1.0 release"

# Tag specific commit
git tag -a v1.0 -m "Version 1.0" 9fceb02

# Signed tag (GPG)
git tag -s v1.0 -m "Signed version 1.0"
```

### Push tags

```bash
# Push single tag
git push origin v1.0

# Push all tags
git push origin --tags
```

### Delete tags

```bash
git tag -d v1.0                    # Local
git push origin --delete v1.0      # Remote
```

## Git Aliases

```bash
# Create aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'

# Use aliases
git co main
git ci -m "message"
git st
```

## git notes

Add or inspect object notes — annotate commits without changing them.

```bash
# Add a note to a commit
git notes add -m "Reviewed by Jane" <commit-hash>

# Add note to HEAD
git notes add -m "Note about this commit"

# View notes for a commit
git notes show <commit-hash>

# View notes in log
git log --notes

# List all notes
git notes list

# Remove a note
git notes remove <commit-hash>

# Edit a note
git notes edit <commit-hash>

# Append to existing note
git notes append -m "Additional info" <commit-hash>

# Copy notes from one commit to another
git notes copy <from-commit> <to-commit>

# Merge notes from a remote
git notes merge origin/refs/notes/commits

# Push notes to remote
git push origin refs/notes/commits

# Fetch notes
git fetch origin refs/notes/*:refs/notes/*
```

### Notes ref configuration

```bash
# Default notes ref: refs/notes/commits
# Change notes ref
git config notes.ref refs/notes/reviews

# Display notes from multiple refs
git config notes.displayRef refs/notes/commits
git config notes.displayRef refs/notes/reviews
```

## Best practices

1. Use `git clone --depth 1` for CI to save time
2. Use `git clone --recurse-submodules` when submodules are present
3. Write meaningful commit messages — imperative mood, explain why
4. Commit small, focused changes — one logical change per commit
5. Use `git add -p` to stage only relevant hunks
6. Use annotated tags for releases, not lightweight tags
7. Set up aliases for frequently used commands
8. Use `git status -s` for a cleaner status view
9. Never use `git push --force` on shared branches — use `--force-with-lease`
10. Use `git restore` instead of `git checkout --` (clearer, modern syntax)
