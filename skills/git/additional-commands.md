# Additional Commands

Commands not covered in detail in other files — ancillary, interrogation, and plumbing commands.

## Ancillary Porcelain Commands

### git annotate

Annotate file lines with commit information (similar to `git blame`).

```bash
# Annotate a file
git annotate file.txt

# Annotate specific lines
git annotate -L 10,20 file.txt

# Difference from git blame:
# - annotate uses simpler output format
# - blame is more feature-rich and preferred
```

### git merge-tree

Perform merge without touching index or working tree.

```bash
# Merge two branches without touching working tree
git merge-tree main feature

# Three-way merge of two trees
git merge-tree --write-tree main feature

# With merge base
git merge-tree <base> <branch1> <branch2>

# Output: merged tree SHA + conflict information
```

### git show-branch

Show branches and their commits (older, pre-`git branch -v`).

```bash
# Show all branches
git show-branch

# Show specific branches
git show-branch main feature

# Show remote branches
git show-branch -r

# Show all (local + remote)
git show-branch -a

# List branches
git show-branch --list
```

### git whatchanged

Show logs with differences each commit introduces.

```bash
# Show commits with diffs
git whatchanged

# Limit number
git whatchanged -5

# Specific file
git whatchanged -- file.txt

# With rename detection
git whatchanged -M -C

# Note: git whatchanged is similar to git log --raw
# git log is preferred for most use cases
```

### git version

Display version information about Git.

```bash
git version
# git version 2.49.0

# With build info
git version --build-options
```

### git verify-commit

Check the GPG signature of commits.

```bash
# Verify a commit's signature
git verify-commit <hash>

# Show signature in log
git log --show-signature
```

### git verify-tag

Check the GPG signature of tags.

```bash
# Verify a tag's signature
git verify-tag v1.0

# Verify with raw output
git verify-tag --raw v1.0
```

### git diagnose

Generate diagnostic information archive.

```bash
# Generate diagnostic zip
git diagnose

# Output to specific file
git diagnose -o diag.zip
```

## Interrogation Plumbing Commands

### git cherry

Find commits yet to be applied to upstream.

```bash
# Find commits not in upstream
git cherry main

# With verbose output
git cherry -v main

# Find commits not in remote
git cherry origin/main

# Limit to specific range
git cherry main feature..HEAD
```

### git ls-remote

List references in a remote repository.

```bash
# List all refs on remote
git ls-remote origin

# List heads only
git ls-remote --heads origin

# List tags only
git ls-remote --tags origin

# Specific pattern
git ls-remote origin 'refs/heads/main'

# With URL (no remote configured)
git ls-remote https://github.com/user/repo.git

# Sort refs
git ls-remote --sort=-committerdate origin

# Quit on error
git ls-remote --exit-code origin
```

### git name-rev

Find symbolic names for given revisions.

```bash
# Name a commit
git name-rev abc123
# abc123 tags/v1.0~3

# Name all commits in log
git log --pretty=format:'%h %s %d' | git name-rev --stdin

# Name HEAD
git name-rev HEAD

# With refs
git name-rev --refs=refs/tags/* abc123

# Exclude refs
git name-rev --refs=refs/heads/* --exclude=refs/heads/wip abc123
```

### git for-each-repo

Run a Git command on a list of repositories.

```bash
# Run command on multiple repos
git for-each-repo --config=maint.repo -- git fetch

# With explicit repos
git for-each-repo /path/to/repo1 /path/to/repo2 -- git status
```

### git var

Show a Git logical variable.

```bash
# Show author identity
git var GIT_AUTHOR_IDENT

# Show committer identity
git var GIT_COMMITTER_IDENT

# Show editor
git var GIT_EDITOR

# Show pager
git var GIT_PAGER

# Show default ident
git var GIT_DEFAULT_IDENT
```

### git get-tar-commit-id

Extract commit ID from an archive created by `git archive`.

```bash
# Extract commit ID from tar archive
git get-tar-commit-id < project.tar
# abc123def456...
```

## Manipulation Plumbing Commands

### git commit-graph

Write and verify Git commit-graph files.

```bash
# Write commit-graph
git commit-graph write

# Write with reachable commits
git commit-graph write --reachable

# Write from stdin commits
git rev-list --all | git commit-graph write --stdin-commits

# Write from stdin pack
git commit-graph write --stdin-packs

# Split commit-graph into multiple files
git commit-graph write --split

# Verify commit-graph
git commit-graph verify
```

### git pack-objects

Create a packed archive of objects.

```bash
# Pack objects from rev-list
git rev-list --all --objects | git pack-objects --revs pack

# Pack with delta compression
git pack-objects --delta-base-offset pack

# Standard pack
git rev-list --objects --all | git pack-objects --revs --stdout > pack.pack

# Thin pack (for transfer)
git pack-objects --thin pack

# With progress
git pack-objects --progress pack
```

### git index-pack

Build pack index file for an existing packed archive.

```bash
# Index a pack file
git index-pack pack-abc123.pack

# With verification
git index-pack --verify pack-abc123.pack

# Fix thin pack
git index-pack --fix-thin pack-abc123.pack

# With SHA-1
git index-pack --strict pack-abc123.pack
```

### git unpack-objects

Unpack objects from a packed archive.

```bash
# Unpack pack into loose objects
git unpack-objects < pack-abc123.pack

# Dry run
git unpack-objects -n < pack-abc123.pack

# With progress
git unpack-objects -r < pack-abc123.pack
```

### git merge-file

Run a three-way file merge.

```bash
# Three-way merge
git merge-file current.txt base.txt other.txt

# With markers
git merge-file -p current.txt base.txt other.txt > merged.txt

# With diff3-style conflicts
git merge-file --diff3 current.txt base.txt other.txt

# Quiet (exit code only)
git merge-file --quiet current.txt base.txt other.txt
# Exit: 0=no conflicts, >0=number of conflicts
```

### git merge-index

Run a merge for files needing merging.

```bash
# Run merge for all unmerged files
git merge-index git-merge-one-file -a

# For specific file
git merge-index git-merge-one-file file.txt
```

### git mktag

Creates a tag object with extra validation.

```bash
# Create tag object from stdin
echo "object abc123
type commit
tag v1.0
tagger John Doe <john@example.com> 1705312800 +0000

Release 1.0" | git mktag
```

### git mktree

Build a tree-object from ls-tree formatted text.

```bash
# Create tree from ls-tree output
git ls-tree HEAD | git mktree

# From custom input
echo "100644 blob abc123\tfile.txt" | git mktree

# With missing objects allowed
echo "100644 blob abc123\tfile.txt" | git mktree --missing
```

### git multi-pack-index

Write and verify multi-pack-indexes.

```bash
# Write multi-pack-index
git multi-pack-index write

# Write for specific pack directory
git multi-pack-index write --object-dir=.git/objects

# Verify
git multi-pack-index verify

# Expire packs
git multi-pack-index expire

# Repack
git multi-pack-index repack
```

## Internal Helper Commands

### git check-attr

Display gitattributes information.

```bash
# Check attributes for file
git check-attr -a file.txt

# Check specific attribute
git check-attr diff file.txt
git check-attr text file.txt
git check-attr filter file.txt

# For all files
git check-attr -a -- $(git ls-files)
```

### git check-mailmap

Show canonical names and email addresses.

```bash
# Check canonical name/email
git check-mailmap "John Doe <john@example.com>"

# From stdin
echo "john@example.com" | git check-mailmap --stdin
```

### git check-ref-format

Ensures that a reference name is well formed.

```bash
# Check if ref name is valid
git check-ref-format refs/heads/main && echo "Valid"
git check-ref-format refs/heads/feature/x && echo "Valid"

# Check branch name
git check-ref-format --branch feature/new-api

# Normalize ref
git check-ref-format --normalize refs/heads/main
```

### git interpret-trailers

Add or parse structured information in commit messages.

```bash
# Add trailer to commit message
git interpret-trailer --trailer "Signed-off-by: John Doe <john@example.com>" < msg.txt

# Parse existing trailers
git interpret-trailer --parse < msg.txt

# Only show trailers
git interpret-trailer --only-trailers < msg.txt

# With unfold (join multiline values)
git interpret-trailer --only-trailers --unfold < msg.txt
```

### git stripspace

Remove unnecessary whitespace.

```bash
# Strip trailing whitespace and collapse blank lines
git stripspace < file.txt

# Remove only trailing whitespace
git stripspace --strip-comments < file.txt

# Add comment characters
git stripspace --comment-lines < file.txt

# Verify clean (no trailing whitespace)
git stripspace < file.txt > cleaned.txt
```

### git patch-id

Compute unique IDs for patches.

```bash
# Compute patch ID
git diff main..feature | git patch-id

# With stable output
git format-patch -1 abc123 | git patch-id --stable

# From git log
git log -p --no-merges | git patch-id
```

### git credential

Retrieve and store user credentials.

```bash
# Fill (retrieve) credentials
echo "protocol=https
host=github.com" | git credential fill

# Approve (store) credentials
echo "protocol=https
host=github.com
username=user
password=token" | git credential approve

# Reject (clear) credentials
echo "protocol=https
host=github.com" | git credential reject
```

### git hook

Run Git hooks.

```bash
# Run a specific hook
git hook run pre-commit

# Run with arguments
git hook run pre-commit -- file1.txt file2.txt
```

### git fmt-merge-msg

Produce a merge commit message.

```bash
# Generate merge message
git fmt-merge-msg --log --no-color < .git/FETCH_HEAD

# With custom message
git fmt-merge-msg -m "Merge feature branch" < .git/FETCH_HEAD
```

### git mailinfo

Extracts patch and authorship from a single e-mail message.

```bash
# Extract patch from email
git mailinfo < email.txt > commit-msg.txt

# With scissors (cut everything before --- line)
git mailinfo --scissors < email.txt > commit-msg.txt
```

### git mailsplit

Simple UNIX mbox splitter program.

```bash
# Split mbox into individual messages
git mailsplit -o patches/ mbox

# Split with specific prefix
git mailsplit -o patches/ -b 4 mbox
```

## GUI Tools

### git gui

A portable graphical interface to Git.

```bash
# Launch git gui
git gui

# Launch for specific repository
git gui /path/to/repo

# Create a new commit
git gui citool

# Browse branch history
git gui blame file.txt
```

### gitk

The Git repository browser.

```bash
# Launch gitk
gitk

# Launch for specific branch
gitk main

# Launch for all branches
gitk --all

# With file filter
gitk -- file.txt

# Since specific date
gitk --since="2 weeks ago"
```

### git citool

Graphical alternative to git-commit.

```bash
# Launch commit GUI
git citool

# Launch and commit one file
git citool file.txt
```

## CVS Migration

### gitcvs-migration

Git for CVS users — migration guide.

```bash
# Import from CVS
git cvsimport -C my-project -d :pserver:anonymous@cvs.example.com:/cvsroot project

# Key differences CVS → Git:
# - CVS is centralized, Git is distributed
# - CVS tracks file revisions, Git tracks project snapshots
# - CVS branches are expensive, Git branches are cheap
# - CVS needs network for most operations, Git is local
# - CVS uses file-level locks, Git uses three-way merge
```

### git cvsexportcommit

Export a single commit to a CVS checkout.

```bash
git cvsexportcommit -v -u -c <commit-hash>
```

### git cvsserver

A CVS server emulator for Git.

```bash
# Start CVS pserver
git cvsserver --export-all /path/to/repo

# Via inetd
git cvsserver pserver /path/to/repo
```

## Additional External System Commands

### git quiltimport

Applies a quilt patchset onto the current branch.

```bash
# Import quilt patches
git quiltimport /path/to/patches

# With author
git quiltimport --author "John Doe <john@example.com>" /path/to/patches
```

### git archimport

Import a GNU Arch repository into Git.

```bash
# Import from Arch archive
git archimport arch@example.com--2004/project--main--1.0
```

## Additional Plumbing Commands

### git refs

Low-level access to refs (Git 2.45+).

```bash
# List refs
git refs list

# Migrate refs between backends
git refs migrate --ref-format=reftable
git refs migrate --ref-format=files

# Verify refs
git refs verify
```

### git replay

EXPERIMENTAL: Replay commits on a new base, works with bare repos too.

```bash
# Replay commits onto another base
git replay --onto main feature

# Replay between branches
git replay origin/main..feature --onto origin/main
```

### git history

EXPERIMENTAL: Rewrite history.

```bash
# Rewrite history (experimental)
git history rewrite --message="New message" HEAD~3..HEAD
```

## Best practices

1. Use `git blame` instead of `git annotate` (more features)
2. Use `git log` instead of `git whatchanged` (more flexible)
3. Use `git commit-graph write --reachable` for faster operations
4. Use `git ls-remote` to inspect remote refs without cloning
5. Use `git interpret-trailers` for structured commit metadata
6. Use `.mailmap` to normalize author names
7. Use `git check-ref-format` to validate branch names in scripts
8. Use `git credential` for custom credential helpers
9. Use `git name-rev` for human-readable commit names in scripts
10. Use `git merge-tree` for testing merges without side effects
