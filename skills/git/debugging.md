# Debugging

Bisect, blame, and grep for finding bugs and tracking changes.

## git bisect

Binary search to find the commit that introduced a bug.

### Basic bisect workflow

```bash
# Start bisect
git bisect start

# Mark current (bad) commit
git bisect bad

# Mark known-good commit
git bisect good v1.0
# or
git bisect good abc123

# Git checks out a commit in the middle
# Test the code, then mark:
git bisect good  # If bug not present
git bisect bad   # If bug present

# Repeat until Git identifies the culprit
# Git will show: "abc123 is the first bad commit"

# When done
git bisect reset
```

### Automatic bisect

```bash
# Provide a script to test automatically
git bisect start
git bisect bad HEAD
git bisect good v1.0
git bisect run ./test-script.sh

# Git will automatically test each commit
# Script exit codes:
# 0 = good (bug not present)
# 1-124 = bad (bug present)
# 125 = skip (cannot test this commit)
# 126-127 = error (stop bisect)
```

### Bisect with specific paths

```bash
# Only bisect commits that changed specific file
git bisect start -- src/broken-file.ts
git bisect bad HEAD
git bisect good v1.0
```

### Bisect log and replay

```bash
# Log the bisect process
git bisect log > bisect.log

# Replay a bisect
git bisect replay bisect.log

# Visualize bisect
git bisect visualize
git bisect view
```

### Bisect terms

```bash
# Use custom terms instead of good/bad
git bisect start --term-old=fixed --term-new=broken
git bisect broken HEAD
git bisect fixed v1.0
```

## git blame

Show what revision and author last modified each line of a file.

```bash
# Basic blame
git blame file.txt

# Specific line range
git blame -L 10,20 file.txt

# Show full hash
git blame -l file.txt

# Show email addresses
git blame -e file.txt

# Show raw timestamp
git blame -t file.txt

# Don't show author name
git blame -w file.txt  # Ignore whitespace changes

# Detect moved/copied lines within file
git blame -M file.txt

# Detect moved/copied lines from other files
git blame -C file.txt
git blame -C -C file.txt  # More aggressive
git blame -C -C -C file.txt  # Very aggressive

# Show only line numbers and commit
git blame -s file.txt

# Show porcelain output (for scripts)
git blame --porcelain file.txt
```

### Blame output format

```
abc1234d (John Doe 2024-01-15 10:30:00 +0000  42) const x = 42;
^       ^              ^                    ^              ^  ^
commit   author         date                 line number    content
```

### Following renames

```bash
# Follow file renames
git blame -C -C -- file.txt

# Use log to follow renames
git log --follow -- file.txt
```

## git grep

Search for patterns in tracked files.

```bash
# Search for pattern
git grep "functionName"

# Search in specific files
git grep "functionName" -- "*.ts"

# Case insensitive
git grep -i "functionname"

# Search at specific commit
git grep "functionName" abc123

# Search in all branches
git grep "functionName" $(git rev-list --all)

# Show line numbers
git grep -n "functionName"

# Show count of matches
git grep -c "functionName"

# Show only filenames
git grep -l "functionName"

# Show only first match per file
git grep -l --max-count 1 "functionName"

# Use extended regex
git grep -E "function[A-Z]"

# Use Perl regex
git grep -P "function\w+"

# Search in specific directory
git grep "functionName" -- src/

# Invert match
git grep -v "functionName"

# Show context lines
git grep -C 3 "functionName"  # 3 lines before and after
git grep -B 2 "functionName"  # 2 lines before
git grep -A 2 "functionName"  # 2 lines after

# Match whole word
git grep -w "function"

# Multiple patterns
git grep -e "pattern1" -e "pattern2"
```

### Searching across history

```bash
# Search in all tracked files (working tree)
git grep "pattern"

# Search at a specific revision
git grep "pattern" HEAD
git grep "pattern" v1.0

# Find when a string was introduced
git log -S "pattern" --oneline

# Find commits that changed matching lines
git log -G "pattern" --oneline -p
```

## Debugging techniques

### Finding when a bug was introduced

```bash
# Method 1: bisect
git bisect start
git bisect bad HEAD
git bisect good v1.0
git bisect run npm test

# Method 2: log + grep
git log --oneline -S "buggyFunction" -- src/

# Method 3: blame
git blame -L 42,50 -- src/broken-file.ts
```

### Finding who changed a line

```bash
# See who changed specific lines
git blame -L 42,50 -- src/file.ts

# See the commit that changed it
git show abc123 -- src/file.ts
```

### Finding deleted code

```bash
# Find when code was removed
git log -S "removedFunction" --oneline

# Find the commit that deleted it
git log -p -S "removedFunction" -- src/ | grep -B5 "removedFunction"
```

### Debugging merge conflicts

```bash
# See what changed on each side
git log --merge --oneline
git log --left-right --oneline HEAD...MERGE_HEAD

# See common ancestor
git merge-base HEAD MERGE_HEAD
```

## Best practices

1. Use `git bisect run` with automated tests for fast bug isolation
2. Use `git blame -w` to ignore whitespace-only changes
3. Use `git blame -C -C` to track code moved from other files
4. Use `git grep` instead of `grep` — it only searches tracked files
5. Use `git log -S` to find when code was added or removed
6. Use `git bisect log` to save and replay bisect sessions
7. Mark commits as `skip` in bisect if they don't compile
8. Use `git blame -L` to focus on specific line ranges
9. Use `git grep -P` for complex Perl-compatible regex patterns
10. Combine `git log -G` with `-p` to see actual changes matching a pattern
