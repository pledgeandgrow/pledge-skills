# Inspection and Comparison

Viewing history, diffs, and comparing changes.

## git show

Show various types of objects (commits, tags, trees, blobs).

```bash
# Show latest commit
git show

# Show specific commit
git show abc123

# Show specific commit with full diff
git show abc123 --stat

# Show a tag
git show v1.0

# Show specific file at a commit
git show abc123:file.txt

# Show a merge commit with all parents
git show -m abc123

# Show commit with raw diff
git show --raw abc123

# Show commit with specific format
git show --format=fuller abc123

# Show only the commit message
git show -s --format=%B abc123
```

## git log

Show commit logs.

### Basic usage

```bash
git log
git log --oneline
git log -5  # Last 5 commits
```

### Formatting output

```bash
# Custom format
git log --pretty=format:"%h - %an, %ar : %s"

# Full format
git log --pretty=full

# Fuller format (with dates)
git log --pretty=fuller

# Oneline with hash and subject
git log --oneline

# With graph
git log --graph --oneline --all

# With decoration (branch names)
git log --oneline --decorate
```

### Filtering

```bash
# By number
git log -10

# By author
git log --author="John"
git log --author="john@example.com"

# By date
git log --since="2 weeks ago"
git log --since="2024-01-01"
git log --until="2024-06-01"
git log --since="2024-01-01" --until="2024-06-01"

# By message
git log --grep="fix"
git log --grep="fix" -i  # Case insensitive
git log --grep="fix|bug" --extended-regexp

# By file
git log -- file.txt
git log --follow -- file.txt  # Follow renames

# By commit range
git log main..feature
git log origin/main..HEAD

# By commit content (SLOC)
git log -S "functionName"  # When function was added/removed
git log -G "functionName"  # When function changed (regex)

# Merge commits only
git log --merges
git log --no-merges

# First parent only (mainline history)
git log --first-parent
```

### Limiting output

```bash
# Skip first N
git log --skip 10 -5

# Limit by date range
git log --since="1 day ago" --until="now"

# Show commits touching specific directory
git log -- src/
```

## git diff

Show changes between commits, commit and working tree, etc.

### Working directory changes

```bash
# Unstaged changes
git diff

# Staged changes
git diff --staged
git diff --cached  # Same as --staged

# Both staged and unstaged
git diff HEAD

# Specific file
git diff -- file.txt

# Multiple files
git diff -- file1.txt file2.txt

# Specific directory
git diff -- src/
```

### Between commits

```bash
# Between two commits
git diff abc123 def456

# Between branches
git diff main feature

# Between remote and local
git diff origin/main HEAD

# Between tags
git diff v1.0 v2.0
```

### Diff output formats

```bash
# Stat summary
git diff --stat

# Short stat
git diff --shortstat

# Summary (creations/deletions)
git diff --summary

# Name only
git diff --name-only

# Name and status
git diff --name-status

# Raw format
git diff --raw

# Patch format (for git apply)
git diff > my-changes.patch
```

### Word and line differences

```bash
# Word-level diff
git diff --word-diff

# Word-level diff with color
git diff --word-diff=color

# Show only changed lines (no context)
git diff --unified=0

# More context lines
git diff --unified=10
```

### Comparing branches

```bash
# Files different between branches
git diff --name-only main..feature

# Commits in feature not in main
git log main..feature

# Commits in either but not both
git log main...feature --left-right
```

## git difftool

```bash
# Launch visual diff tool
git difftool

# Use specific tool
git difftool --tool=vimdiff
git difftool --tool=vscode

# List available tools
git difftool --tool-help

# Configure default
git config --global diff.tool vscode
git config --global difftool.vscode.cmd 'code --wait --diff $LOCAL $REMOTE'
```

## git range-diff

Compare two commit ranges (e.g., before and after rebase).

```bash
# Compare original vs rebased commits
git range-diff origin/main..HEAD @{u}..HEAD

# Compare two ranges
git range-diff old-base..old-tip new-base..new-tip

# Show creation/deletion
git range-diff --creation-factor=100
```

## git shortlog

Summarize git log output by author.

```bash
# Summary by author
git shortlog

# With counts only
git shortlog -s

# With counts and subject
git shortlog -s -n  # Sorted by count

# By email
git shortlog -e

# Formatted
git shortlog --format="%h %s" -n

# Specific range
git shortlog v1.0..v2.0
```

## git describe

Give an object a human-readable name based on tags.

```bash
# Describe current commit
git describe
# v1.0-3-gabc1234  (3 commits after v1.0, hash abc1234)

# Describe specific commit
git describe abc123

# With tags only (no annotated tags)
git describe --tags

# With always long format
git describe --long

# Match specific tag pattern
git describe --match "v1.*"
```

## Revision selection

### Referring to commits

```bash
# Full hash
git show 9fceb024d6a5d7f4c1e3b8e2a7c6f5d4e3b2a1c0

# Abbreviated hash (minimum 7 chars)
git show 9fceb02

# Branch name
git show main

# Tag
git show v1.0

# Relative to HEAD
git show HEAD      # Current commit
git show HEAD~1    # One before HEAD (parent)
git show HEAD~2    # Two before HEAD
git show HEAD^     # First parent of HEAD
git show HEAD^2    # Second parent (merge commits)

# Relative to branch
git show main~3
git show feature@{yesterday}
git show feature@{1.week.ago}
```

### Reflog references

```bash
# Show reflog
git reflog

# Reference by reflog position
git show HEAD@{0}   # Current
git show HEAD@{1}   # Previous position
git show HEAD@{5}   # 5 positions ago
```

### Range syntax

```bash
# Double-dot: commits in B not in A
git log A..B

# Triple-dot: commits in either but not both
git log A...B

# Exclude
git log ^main feature
git log feature --not main

# Range with --left-right
git log --left-right main...feature
```

## Best practices

1. Use `git log --oneline --graph --all` for a visual overview
2. Use `git log -S` to find when code was added or removed
3. Use `git diff --stat` for a quick overview of changes
4. Use `git show <commit>:<file>` to view file content at a specific commit
5. Use `git describe` for version identification
6. Use `git shortlog -s -n` to see contributor statistics
7. Use `--follow` with `git log` to track file renames
8. Use `git range-diff` to verify rebase results
9. Use `git log --first-parent` on merge-heavy branches for clean history
10. Use `git log --grep` to find commits by message content
