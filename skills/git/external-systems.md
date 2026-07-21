# External Systems

Interoperability with other version control systems.

## git svn

Bidirectional bridge between Git and Subversion.

### Cloning from SVN

```bash
# Clone SVN repository (standard layout: trunk/branches/tags)
git svn clone -s https://svn.example.com/project
git svn clone --stdlayout https://svn.example.com/project

# Clone with explicit layout
git svn clone \
    --trunk=trunk \
    --branches=branches \
    --tags=tags \
    https://svn.example.com/project

# Clone only trunk (no branches/tags)
git svn clone -T https://svn.example.com/project/trunk project

# Shallow clone (only recent history)
git svn clone -s -r1000:HEAD https://svn.example.com/project

# Clone with authors file
git svn clone -s --authors-file=authors.txt https://svn.example.com/project
```

### Authors file

```
# authors.txt
svnuser = John Doe <john@example.com>
another = Jane Smith <jane@example.com>
```

### Working with SVN

```bash
# Fetch changes from SVN
git svn fetch

# Rebase local commits on top of SVN changes
git svn rebase

# Push (dcommit) changes back to SVN
git svn dcommit

# Show SVN revision info
git svn info

# Create a Git branch from SVN branch
git svn branch -m "New branch" new-branch

# Create a tag from SVN tag
git svn tag v1.0
```

### SVN to Git migration workflow

```bash
# 1. Create authors file
echo "svnuser = Git User <user@example.com>" > authors.txt

# 2. Clone with standard layout
git svn clone --stdlayout --authors-file=authors.txt \
    https://svn.example.com/project

# 3. Convert SVN branches to Git branches
cd project
git for-each-ref refs/remotes/origin/ --format="%(refname:short)" | \
    while read branch; do
        git branch "$branch" "refs/remotes/origin/$branch"
    done

# 4. Push to new Git remote
git remote add origin git@github.com:user/project.git
git push -u origin --all
git push origin --tags
```

### git svn limitations

- SVN properties are not preserved
- Merge history is not preserved
- `git svn dcommit` creates one SVN commit per Git commit
- Large SVN repos can be slow to clone

## git fast-import

Fast stream-based data import for Git.

### Basic usage

```bash
# Import from fast-import stream
git fast-import < import.fi

# With statistics
git fast-import --stats < import.fi

# With progress
git fast-import --progress < import.fi
```

### Fast-import stream format

```
# Create a blob (file content)
blob
mark :1
data 13
Hello, World!

# Create a commit
commit refs/heads/main
mark :2
author John Doe <john@example.com> 1705312800 +0000
committer John Doe <john@example.com> 1705312800 +0000
data 14
Initial commit
M 100644 :1 hello.txt

# Create a tag
tag v1.0
from :2
tagger John Doe <john@example.com> 1705312800 +0000
data 10
v1.0 release
```

### Importing from other VCS

```bash
# From Mercurial
hg-fast-export.sh -r /path/to/hg/repo | git fast-import

# From Perforce
git p4 clone //depot/path@all p4-import

# From CSV
# Use custom script to generate fast-import stream
```

## git p4

Import from and submit to Perforce repositories.

```bash
# Clone from Perforce
git p4 clone //depot/path@all my-project

# Clone specific revision
git p4 clone //depot/path@12345 my-project

# Sync (fetch) changes from Perforce
git p4 sync

# Submit changes back to Perforce
git p4 submit

# Rebase on top of Perforce changes
git p4 rebase
```

## Migrating to Git

### From SVN

```bash
# Use git svn clone (see above) or svn2git tool
gem install svn2git
svn2git https://svn.example.com/project --authors authors.txt
```

### From Mercurial

```bash
# Using hg-fast-export
git init git-repo
cd git-repo
hg-fast-export.sh -r /path/to/hg/repo
git checkout main
```

### From Perforce

```bash
# Using git p4
git p4 clone //depot/project@all
```

### From CVS

```bash
# Using git-cvsimport
git cvsimport -C my-project -d :pserver:anonymous@cvs.example.com:/cvsroot project
```

## Best practices

1. Use `git svn` for bidirectional SVN-Git workflow
2. Use `git fast-import` for bulk imports from other VCS
3. Create an authors file to map SVN users to Git authors
4. Use `--stdlayout` when cloning SVN repos with trunk/branches/tags
5. Use `git svn rebase` (not `merge`) to incorporate SVN changes
6. Use `git svn dcommit` to push back to SVN
7. For one-way migration, use specialized tools (svn2git, hg-fast-export)
8. Test migration on a branch before final import
9. Preserve tags and branches during migration
10. Document the migration process for team reference
