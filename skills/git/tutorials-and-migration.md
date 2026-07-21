# Tutorials and Migration

Tutorial guides, CVS migration, and developer introduction.

## gittutorial — A Tutorial Introduction to Git

### Importing a new project

```bash
# Initialize repository in existing project
cd my-project
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial import"

# Check status
git status
git log --oneline
```

### Making changes

```bash
# Modify files
echo "new content" >> file.txt

# See what changed
git diff

# Stage and commit
git add file.txt
git commit -m "Update file.txt"

# View history
git log
git log --stat
git log --oneline --graph
```

### Git tracks content, not files

```bash
# Renaming a file
git mv old.txt new.txt
git commit -m "Rename old.txt to new.txt"

# Git detects renames automatically
# Even if you use regular mv:
mv old.txt new.txt
git add -A
git commit -m "Rename old.txt to new.txt"
# Git shows this as a rename in log
```

### Viewing project history

```bash
# Full history
git log

# History with diffs
git log -p

# History with file stats
git log --stat

# One-line history
git log --oneline

# History for specific file
git log -- file.txt
git log --follow -- file.txt  # Follow renames

# History with graph
git log --graph --oneline --all
```

### Managing branches

```bash
# Create branch
git branch feature

# Switch to branch
git switch feature

# Create and switch
git switch -c feature

# List branches
git branch

# Merge branch
git switch main
git merge feature

# Delete branch
git branch -d feature
```

### Using Git for collaboration

```bash
# Clone a shared repository
git clone git@server:/opt/git/project.git

# Make changes
git switch -c my-feature
git add .
git commit -m "Add my feature"

# Push to shared repository
git push origin my-feature

# Pull changes from others
git fetch origin
git merge origin/main
# or
git pull origin main
```

### Exploring history

```bash
# See what changed in a commit
git show <hash>

# Compare two commits
git diff <hash1> <hash2>

# See who changed a line
git blame file.txt

# Find when a bug was introduced
git bisect start
git bisect bad HEAD
git bisect good v1.0
```

## gittutorial-2 — A Tutorial Introduction to Git: Part Two

### Understanding Git internals

```bash
# View objects in the repository
git cat-file -t HEAD          # commit
git cat-file -p HEAD          # commit content

# View tree (directory listing)
git cat-file -p HEAD^{tree}

# View blob (file content)
git cat-file -p <blob-hash>

# See the object database
ls .git/objects/
```

### The index (staging area)

```bash
# View index contents
git ls-files --stage

# The index is a binary file at .git/index
# It maps paths to blob hashes with metadata

# Add to index
git add file.txt

# Remove from index
git rm --cached file.txt

# Reset index to HEAD
git reset HEAD
```

### Commit object structure

```bash
# A commit contains:
# - tree hash (top-level directory snapshot)
# - parent hash(es) (0 for initial, 1 for normal, 2+ for merge)
# - author (name, email, timestamp)
# - committer (name, email, timestamp)
# - message

git cat-file -p HEAD
# tree abc123...
# parent def456...
# author John Doe <john@example.com> 1705312800 +0000
# committer John Doe <john@example.com> 1705312800 +0000
#
# Commit message here
```

### Tree object structure

```bash
# A tree contains entries:
# - mode (100644=file, 100755=executable, 40000=dir, 120000=symlink)
# - type (blob or tree)
# - hash
# - name

git cat-file -p HEAD^{tree}
# 100644 blob abc123...    file.txt
# 040000 tree def456...    src
```

### How commits connect

```
Commit A (initial)
  └── tree
        ├── blob (file1)
        └── blob (file2)

Commit B (child of A)
  ├── parent → Commit A
  └── tree
        ├── blob (file1 modified)
        └── blob (file2)

Commit C (child of B)
  ├── parent → Commit B
  └── tree
        ├── blob (file1)
        └── blob (file3 new)
```

### Tags and branches

```bash
# A branch is a ref pointing to a commit
cat .git/refs/heads/main
# abc123def456...

# A tag is a ref pointing to a commit (or tag object)
cat .git/refs/tags/v1.0
# def456789abc...

# Annotated tag points to tag object
git cat-file -p v1.0
# object abc123...
# type commit
# tag v1.0
# tagger ...
```

## gitcore-tutorial — A Git Core Tutorial for Developers

### Low-level operations

```bash
# Create a blob from file content
git hash-object -w file.txt
# Returns SHA-1 hash

# Update index with a file
git update-index --add file.txt

# Write tree from index
git write-tree
# Returns tree SHA-1

# Create commit from tree
git commit-tree <tree-sha> -m "Message"
# Returns commit SHA-1

# Update a ref
git update-ref refs/heads/main <commit-sha>
```

### Full manual commit workflow

```bash
# 1. Create blob
BLOB=$(git hash-object -w file.txt)

# 2. Update index
git update-index --add --cacheinfo 100644 $BLOB file.txt

# 3. Write tree
TREE=$(git write-tree)

# 4. Create commit
COMMIT=$(echo "My commit" | git commit-tree $TREE)

# 5. Update branch ref
git update-ref refs/heads/main $COMMIT
```

### Reading objects

```bash
# Read any object
git cat-file -p <hash>
git cat-file -t <hash>
git cat-file -s <hash>

# List all objects
git rev-list --all --objects

# Walk commit graph
git rev-list HEAD
git rev-list --count HEAD
```

### The reflog

```bash
# Every time HEAD moves, it's recorded
git reflog

# Reflog entries
# abc1234 HEAD@{0}: commit: Add feature
# def5678 HEAD@{1}: checkout: moving from main to feature
# ghi9012 HEAD@{2}: reset: moving to HEAD~1
```

## gitcvs-migration — Git for CVS Users

### Key concept differences

| CVS | Git |
|-----|-----|
| Centralized | Distributed |
| File-based changes | Project snapshots |
| Network required | Mostly local |
| Expensive branches | Cheap branches |
| File locks | Three-way merge |
| Sequential revision numbers | SHA-1 hashes |
| `cvs update` | `git pull` / `git fetch` + `git merge` |
| `cvs commit` | `git commit` + `git push` |
| `cvs tag` | `git tag` |
| `cvs log` | `git log` |
| `cvs diff` | `git diff` |
| `cvs annotate` | `git blame` |
| `cvs status` | `git status` |
| `cvs add` | `git add` |
| `cvs remove` | `git rm` |
| `cvs checkout` | `git clone` |

### CVS to Git command mapping

```bash
# CVS checkout → Git clone
cvs checkout project    →  git clone url project

# CVS update → Git pull/fetch
cvs update -d           →  git pull
cvs update              →  git fetch && git merge

# CVS commit → Git commit + push
cvs commit -m "msg"     →  git commit -m "msg" && git push

# CVS add → Git add
cvs add file.txt        →  git add file.txt

# CVS remove → Git rm
cvs remove file.txt     →  git rm file.txt

# CVS log → Git log
cvs log file.txt        →  git log -- file.txt

# CVS diff → Git diff
cvs diff                →  git diff
cvs diff -u             →  git diff

# CVS annotate → Git blame
cvs annotate file.txt   →  git blame file.txt

# CVS tag → Git tag
cvs tag v1.0            →  git tag -a v1.0 -m "v1.0"

# CVS status → Git status
cvs status              →  git status
```

### Migration from CVS

```bash
# Method 1: git cvsimport
git cvsimport -C my-project -d :pserver:user@cvs.example.com:/cvsroot project

# Method 2: Using cvs2git tool
# 1. Install cvs2git
# 2. Run conversion
cvs2git --blob-file=git-blob.dat --dump-file=git-dump.dat /path/to/cvsrepo
# 3. Create git repo and load
mkdir my-project && cd my-project
git init
cat ../git-blob.dat ../git-dump.dat | git fast-import

# Method 3: Manual migration
# 1. Export latest CVS state
cvs export -r HEAD project
# 2. Initialize Git
cd project
git init
git add .
git commit -m "Initial import from CVS"
```

### CVS-isms and Git equivalents

```bash
# "Sticky tags" in CVS → branches in Git
cvs update -r branch-1  →  git switch branch-1

# "Watchers" in CVS → no direct equivalent
# Use hooks or external tools

# "Edit/unedit" in CVS → no direct equivalent
# Git doesn't use locks

# "CVSROOT" modules → Git submodules or subtrees
```

## gitdiffcore — Tweaking Diff Output

### How Git generates diffs

```
1. Generate raw diff (pairs of files)
2. diffcore_break: break large changes into delete+add
3. diffcore_rename: detect renames
4. diffcore_copy: detect copies
5. diffcore_merge_broken: re-merge broken pairs
6. diffcore_pickaxe: filter by -S/-G
7. diffcore_order: sort by orderfile
8. diffcore_rotate: rotate output
9. diffcore_flush: output result
```

### Configuring diff behavior

```bash
# Rename detection
git config diff.renames true       # Detect renames (default)
git config diff.renames copies     # Detect renames and copies
git config diff.renames false      # Disable rename detection
git config diff.renameLimit 1000   # Max files to consider

# Diff algorithm
git config diff.algorithm myers      # Default
git config diff.algorithm patience   # Patience diff
git config diff.algorithm histogram  # Histogram diff (recommended)
git config diff.algorithm minimal    # Minimal diff (slow)

# Word-level diff
git config diff.wordRegex "[\\w]+"

# External diff driver
git config diff.external difftool

# Ignoring whitespace
git diff --ignore-space-change
git diff --ignore-all-space
git diff --ignore-blank-lines
```

### Diff orderfile

```bash
# Sort diff output by file pattern order
git diff -O orderfile

# orderfile contents:
# src/main.*
# src/utils/*
# *.md
# *.txt
```

## Best practices

1. Start with `gittutorial` for Git basics
2. Read `gittutorial-2` for internal understanding
3. Use `gitcore-tutorial` for plumbing command knowledge
4. Use `cvs2git` for large CVS migrations (better than `git cvsimport`)
5. Use `histogram` diff algorithm for best quality
6. Enable rename detection with `diff.renames copies`
7. Use `git diff -O` to control diff output order
8. Understand the object model for effective debugging
9. Use `git cat-file -p` to inspect any Git object
10. Map CVS commands to Git equivalents for team transitions
