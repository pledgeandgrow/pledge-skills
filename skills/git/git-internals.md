# Git Internals

Plumbing and porcelain, Git objects, references, packfiles, and internals.

## Plumbing and Porcelain

Git is divided into two layers:

- **Porcelain**: User-friendly commands (`git add`, `git commit`, `git push`)
- **Plumbing**: Low-level commands for scripting and internals

## Git Objects

Git is a content-addressable filesystem — objects are stored by SHA-1 hash of content.

### Blob (file content)

```bash
# Create a blob from file content
git hash-object -w file.txt
# Returns: 3b18e512dba79e4c8300dd08aeb37f8e728b8dad

# The blob stores the content, not the filename
```

### Tree (directory listing)

A tree object contains:
- Mode (100644 for file, 100755 for executable, 40000 for directory, 120000 for symlink)
- Object type (blob or tree)
- SHA-1 hash
- Filename

```bash
# View a tree object
git cat-file -p master^{tree}

# Output:
# 100644 blob 3b18e512dba79e4c8300dd08aeb37f8e728b8dad file.txt
# 040000 tree 99f1a6d12cb4b6f19c8655fce46fdb669d8ad5e7 src
```

### Commit

A commit object contains:
- Tree SHA-1 (top-level tree)
- Parent commit SHA-1(s) (zero for initial, one for normal, multiple for merge)
- Author name, email, timestamp
- Committer name, email, timestamp
- Commit message

```bash
# View a commit object
git cat-file -p HEAD

# Output:
# tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904
# parent abc123def456...
# author John Doe <john@example.com> 1705312800 +0000
# committer John Doe <john@example.com> 1705312800 +0000
#
# Initial commit
```

### Object relationships

```
Commit
  ├── tree (root directory)
  │     ├── blob (file content)
  │     └── tree (subdirectory)
  │           └── blob (file content)
  └── parent (previous commit)
```

### Examining objects

```bash
# Show object type
git cat-file -t abc123
# commit

# Show object content
git cat-file -p abc123

# Show object size
git cat-file -s abc123

# Pretty-print (for blobs, trees, commits)
git cat-file -p HEAD
git cat-file -p HEAD^{tree}
```

## Git References

References (refs) are names pointing to commit SHA-1s.

### Branches

```bash
# Branch is a file containing a commit SHA
cat .git/refs/heads/main
# abc123def456789...

# Create a branch manually
echo "abc123def456..." > .git/refs/heads/new-branch
```

### HEAD

```bash
# HEAD points to current branch
cat .git/HEAD
# ref: refs/heads/main

# Detached HEAD (points directly to commit)
# ref: abc123def456...
```

### Tags

```bash
# Lightweight tag — just a ref
cat .git/refs/tags/v1.0
# abc123def456...

# Annotated tag — points to tag object
git cat-file -p v1.0
# object abc123def456...
# type commit
# tag v1.0
# tagger John Doe <john@example.com> 1705312800 +0000
#
# Release 1.0
```

### Remote branches

```bash
# Remote-tracking branches
cat .git/refs/remotes/origin/main
# abc123def456...
```

### Symbolic refs

```bash
# Show what HEAD points to
git symbolic-ref HEAD
# refs/heads/main

# Set HEAD to a branch
git symbolic-ref HEAD refs/heads/main

# Detached HEAD
git symbolic-ref HEAD  # Fails if detached
```

## Packfiles

Loose objects are compressed into packfiles for efficiency.

```bash
# View pack files
ls .git/objects/pack/
# pack-abc123...idx  pack-abc123...pack

# Show pack contents
git verify-pack -v .git/objects/pack/pack-abc123...idx

# Count objects
git count-objects -v

# Pack loose objects
git repack -d

# Garbage collect (packs and prunes)
git gc
```

### Pack format

- `.pack` — compressed objects
- `.idx` — index for quick lookup by SHA-1
- Delta compression — stores differences between similar objects

## The Refspec

A refspec maps remote refs to local refs.

```bash
# Default fetch refspec
+refs/heads/*:refs/remotes/origin/*

# Custom refspec in .git/config
[remote "origin"]
    url = https://github.com/user/repo.git
    fetch = +refs/heads/*:refs/remotes/origin/*
    fetch = +refs/pull/*/head:refs/remotes/origin/pr/*

# Push refspec
git push origin local-branch:remote-branch

# Delete remote ref
git push origin :remote-branch
```

### Refspec syntax

```
+<src>:<dst>

+ = force update (optional)
src = source ref (on remote)
dst = destination ref (local for fetch, remote for push)
```

## Transfer Protocols

### Smart protocol

```bash
# Git smart protocol uses pack negotiation
# Client: git-upload-pack (fetch) or git-receive-pack (push)
# Server: git-upload-pack or git-receive-pack

# Example fetch negotiation:
# 1. Client sends wants (commits it needs)
# 2. Server sends haves (commits it has)
# 3. Client and server negotiate minimal pack
# 4. Server sends packfile
```

### Dumb protocol

```bash
# Dumb HTTP — just fetches loose objects and pack files
# No negotiation — downloads all objects
# Requires git update-server-info
```

## Plumbing commands

### git cat-file

```bash
# Show type
git cat-file -t <hash>

# Show content
git cat-file -p <hash>

# Show size
git cat-file -s <hash>

# Batch check
git cat-file --batch-check
```

### git hash-object

```bash
# Compute hash without writing
git hash-object file.txt

# Write blob to object store
git hash-object -w file.txt

# Use stdin
echo "content" | git hash-object -w --stdin
```

### git write-tree

```bash
# Write tree from index
git write-tree
# Returns tree SHA-1
```

### git commit-tree

```bash
# Create commit from tree
git commit-tree <tree-sha> -m "Commit message"

# With parent
git commit-tree <tree-sha> -p <parent-sha> -m "Commit message"
```

### git update-index

```bash
# Add file to index
git update-index --add file.txt

# Update file in index
git update-index file.txt

# Cache refresh
git update-index --refresh

# Assume unchanged (performance)
git update-index --assume-unchanged file.txt

# No assume unchanged
git update-index --no-assume-unchanged file.txt

# Skip worktree
git update-index --skip-worktree file.txt
```

### git read-tree

```bash
# Read tree into index
git read-tree <tree-sha>

# Read tree and update working directory
git read-tree --reset -u <tree-sha>
```

### git ls-files

```bash
# List all files in index
git ls-files

# List staged files
git ls-files --stage

# List modified files
git ls-files --modified

# List unmerged files
git ls-files --unmerged

# List others (untracked)
git ls-files --others
```

### git ls-tree

```bash
# List tree contents
git ls-tree HEAD

# Recursive
git ls-tree -r HEAD

# Show only names
git ls-tree --name-only HEAD

# Show long format
git ls-tree -l HEAD
```

### git rev-parse

```bash
# Parse revision to SHA-1
git rev-parse HEAD
git rev-parse main
git rev-parse v1.0

# Parse with navigation
git rev-parse HEAD~3
git rev-parse HEAD^2
git rev-parse main@{yesterday}

# Show git directory
git rev-parse --git-dir

# Show toplevel
git rev-parse --show-toplevel

# Show prefix (subdirectory)
git rev-parse --show-prefix
```

### git rev-list

```bash
# List commits in reverse chronological order
git rev-list HEAD

# Count commits
git rev-list --count HEAD

# List commits since date
git rev-list --since="2024-01-01" HEAD

# List commits by author
git rev-list --author="John" HEAD

# List commits touching path
git rev-list HEAD -- src/

# List commits in range
git rev-list main..feature

# List all commits
git rev-list --all
```

### git for-each-ref

```bash
# List all refs
git for-each-ref

# List with format
git for-each-ref --format='%(refname:short) %(objecttype) %(objectname:short)'

# List only branches
git for-each-ref refs/heads/

# List sorted by date
git for-each-ref --sort=-committerdate refs/heads/

# List with subject
git for-each-ref --format='%(refname:short) %(subject)' refs/heads/
```

### git show-ref

```bash
# Show all refs
git show-ref

# Show specific ref
git show-ref refs/heads/main

# Show heads only
git show-ref --heads

# Show tags only
git show-ref --tags

# Verify ref exists
git show-ref --verify refs/heads/main
```

### git symbolic-ref

```bash
# Show what HEAD points to
git symbolic-ref HEAD

# Set HEAD
git symbolic-ref HEAD refs/heads/main

# Delete symbolic ref
git symbolic-ref --delete HEAD
```

### git merge-base

```bash
# Find common ancestor
git merge-base main feature

# Find all common ancestors
git merge-base --all main feature

# Is ancestor check
git merge-base --is-ancestor abc123 def456 && echo "Yes"
```

### git check-ignore

```bash
# Check if file is ignored
git check-ignore file.txt

# Verbose — show which rule ignores
git check-ignore -v file.txt

# Check multiple files
git check-ignore -v *.tmp *.log
```

### git count-objects

```bash
# Count objects
git count-objects

# Verbose
git count-objects -v

# Human readable
git count-objects -vH
```

### git verify-pack

```bash
# Verify pack file
git verify-pack .git/objects/pack/pack-abc123.idx

# Verbose
git verify-pack -v .git/objects/pack/pack-abc123.idx

# Show only statistics
git verify-pack --stat .git/objects/pack/pack-abc123.idx
```

## Environment variables

```bash
# Git directory location
GIT_DIR=/path/to/.git

# Working tree
GIT_WORK_TREE=/path/to/project

# Index file
GIT_INDEX_FILE=/path/to/index

# Object directory
GIT_OBJECT_DIRECTORY=/path/to/objects

# Author/committer info
GIT_AUTHOR_NAME="John Doe"
GIT_AUTHOR_EMAIL="john@example.com"
GIT_AUTHOR_DATE="2024-01-15T10:00:00"
GIT_COMMITTER_NAME="John Doe"
GIT_COMMITTER_EMAIL="john@example.com"
GIT_COMMITTER_DATE="2024-01-15T10:00:00"

# Editor
GIT_EDITOR=vim

# Pager
GIT_PAGER=less

# SSH command
GIT_SSH_COMMAND="ssh -i ~/.ssh/custom_key"

# Proxy
http_proxy=http://proxy:8080
https_proxy=http://proxy:8080
```

## Best practices

1. Use porcelain commands for daily work, plumbing for scripts
2. Use `git cat-file -p` to inspect any Git object
3. Use `git rev-parse` to resolve any reference to a SHA-1
4. Use `git for-each-ref --sort` for custom ref listings
5. Use `git hash-object -w` to manually create blobs
6. Use `git count-objects -vH` to monitor repository size
7. Use `git verify-pack` to inspect pack file contents
8. Use environment variables for CI/CD and scripting
9. Use `GIT_SSH_COMMAND` for custom SSH keys
10. Understand the object model to debug Git issues effectively
