# Embedding Git

Embedding Git in applications — libgit2, JGit, and Git as a library.

## Command-line Git

### Using Git from scripts

```bash
#!/bin/bash
# Deploy script using Git

REPO=/opt/git/app.git
DEPLOY_DIR=/var/www/app

cd $DEPLOY_DIR
git --git-dir=$REPO --work-tree=$DEPLOY_DIR checkout -f main
echo "Deployed $(date)" >> /var/log/deploy.log
```

### Git as a subprocess

```python
import subprocess

def git(*args):
    result = subprocess.run(
        ['git'] + list(args),
        capture_output=True,
        text=True,
        check=True
    )
    return result.stdout.strip()

# Examples
print(git('rev-parse', 'HEAD'))        # Current commit hash
print(git('branch', '--show-current'))  # Current branch
print(git('status', '--porcelain'))     # Status (machine-readable)
print(git('log', '--oneline', '-5'))    # Last 5 commits
```

### Porcelain output for scripts

```bash
# Machine-readable status
git status --porcelain
# M  file.txt
# A  new-file.txt
# ?? untracked.txt

# Machine-readable log
git log --pretty=format:'%H %s' -5

# Machine-readable branch list
git branch --format='%(refname:short)'

# Machine-readable remote
git remote -v --format='%(name) %(url)'
```

## libgit2

libgit2 is a portable, pure C implementation of Git core methods.

### Features

- No Git binary dependency — embeddable
- Cross-platform (C library)
- Bindings available for many languages
- MIT licensed

### Language bindings

| Language | Library |
|----------|---------|
| Python | `pygit2` |
| Ruby | `rugged` |
| Node.js | `nodegit` |
| Go | `git2go` |
| .NET | `LibGit2Sharp` |
| Swift | `SwiftGit2` |
| PHP | `php-git` |

### pygit2 (Python)

```python
import pygit2

# Open repository
repo = pygit2.Repository('/path/to/repo')

# Get HEAD commit
commit = repo[repo.head.target]
print(commit.message)
print(commit.author.name)
print(commit.author.email)

# List branches
for branch_name in repo.branches.local:
    branch = repo.branches.local[branch_name]
    print(f"{branch_name}: {branch.target}")

# Create a commit
index = repo.index
index.add('file.txt')
index.write()

tree = index.write_tree()
author = pygit2.Signature('John Doe', 'john@example.com')
committer = pygit2.Signature('John Doe', 'john@example.com')

repo.create_commit(
    'HEAD',
    author, committer,
    'Add file.txt',
    tree,
    [repo.head.target]
)

# Clone a repository
pygit2.clone_repository(
    'https://github.com/user/repo.git',
    '/path/to/clone'
)

# Walk commits
for commit in repo.walk(repo.head.target):
    print(commit.id, commit.message)
```

### LibGit2Sharp (.NET/C#)

```csharp
using LibGit2Sharp;

// Clone
Repository.Clone("https://github.com/user/repo.git", "/path/to/clone");

// Open
using var repo = new Repository("/path/to/repo");

// Get HEAD
var commit = repo.Head.Tip;
Console.WriteLine(commit.Message);

// Stage and commit
Commands.Stage(repo, "file.txt");
var signature = repo.Config.BuildSignature(DateTimeOffset.Now);
repo.Commit("Add file.txt", signature, signature);

// List branches
foreach (var branch in repo.Branches)
    Console.WriteLine(branch.FriendlyName);
```

### rugged (Ruby)

```ruby
require 'rugged'

# Open repository
repo = Rugged::Repository.new('/path/to/repo')

# Get HEAD commit
commit = repo.head.target
puts commit.message
puts commit.author[:name]

# Walk commits
repo.walk(repo.head.target) do |c|
  puts "#{c.oid} #{c.message}"
end

# Clone
Rugged::Repository.clone_at(
  'https://github.com/user/repo.git',
  '/path/to/clone'
)
```

### nodegit (Node.js)

```javascript
const NodeGit = require('nodegit');

// Clone
NodeGit.Clone('https://github.com/user/repo.git', '/path/to/clone')
  .then(repo => {
    console.log('Cloned');
    return repo.getHeadCommit();
  })
  .then(commit => {
    console.log(commit.message());
  });

// Open existing
NodeGit.Repository.open('/path/to/repo')
  .then(repo => repo.getHeadCommit())
  .then(commit => {
    console.log(commit.message());
    // Walk history
    return NodeGit.Revwalk.create(repo);
  });
```

## JGit (Java)

JGit is a pure Java implementation of Git.

```java
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.revwalk.RevWalk;
import org.eclipse.jgit.storage.file.FileRepositoryBuilder;

// Open repository
FileRepositoryBuilder builder = new FileRepositoryBuilder();
Repository repo = builder.setGitDir(new File("/path/to/repo/.git"))
    .readEnvironment()
    .findGitDir()
    .build();

// Clone
Git.cloneRepository()
    .setURI("https://github.com/user/repo.git")
    .setDirectory(new File("/path/to/clone"))
    .call();

// Stage and commit
try (Git git = new Git(repo)) {
    git.add().addFilepattern("file.txt").call();
    git.commit().setMessage("Add file.txt").call();
}

// Walk commits
try (RevWalk walk = new RevWalk(repo)) {
    RevCommit commit = walk.parseCommit(repo.resolve("HEAD"));
    System.out.println(commit.getFullMessage());
}

// List branches
try (Git git = new Git(repo)) {
    List<Ref> branches = git.branchList().call();
    for (Ref branch : branches) {
        System.out.println(branch.getName());
    }
}
```

## go-git (Go)

```go
package main

import (
    "fmt"
    "github.com/go-git/go-git/v5"
)

func main() {
    // Clone
    repo, err := git.PlainClone("/path/to/clone", false, &git.CloneOptions{
        URL:      "https://github.com/user/repo.git",
        Progress: os.Stdout,
    })

    // Open
    // repo, err := git.PlainOpen("/path/to/repo")

    // Get HEAD
    ref, _ := repo.Head()
    commit, _ := repo.CommitObject(ref.Hash())
    fmt.Println(commit.Message)

    // Walk commits
    iter, _ := repo.Log(&git.LogOptions{From: ref.Hash()})
    iter.ForEach(func(c *object.Commit) error {
        fmt.Println(c.Hash, c.Message)
        return nil
    })
}
```

## Git as HTTP server

### Smart HTTP backend

```python
# Python CGI for Git smart HTTP
#!/usr/bin/env python3
import os
import subprocess

# Set environment
os.environ['GIT_PROJECT_ROOT'] = '/opt/git'
os.environ['GIT_HTTP_EXPORT_ALL'] = '1'

# Run git-http-backend
subprocess.run(['/usr/lib/git-core/git-http-backend'])
```

### Simple HTTP server with Git

```bash
# Using git http-backend with Apache or nginx
# See server-admin.md for full configuration
```

## Best practices

1. Use `--porcelain` output for scripts — stable format
2. Use libgit2 bindings when you need in-process Git operations
3. Use JGit for Java/JVM applications
4. Use `go-git` for Go applications
5. Use `pygit2` for Python applications
6. Use `rugged` for Ruby applications
7. Use `nodegit` for Node.js applications
8. Use `LibGit2Sharp` for .NET applications
9. Handle errors gracefully — Git commands can fail
10. Use `GIT_DIR` and `GIT_WORK_TREE` env vars for non-standard layouts
