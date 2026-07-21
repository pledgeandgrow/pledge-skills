# Configuration

Git configuration system — `git config`, settings, and customization.

## Configuration levels

| Level | Flag | File | Scope |
|-------|------|------|-------|
| System | `--system` | `/etc/gitconfig` | All users |
| Global | `--global` | `~/.gitconfig` | Current user |
| Local | `--local` | `.git/config` | Current repo (default) |
| Worktree | `--worktree` | `.git/config.worktree` | Current worktree |

Precedence: local > global > system.

## Basic configuration

### Identity

```bash
git config --global user.name "John Doe"
git config --global user.email "john@example.com"

# Per-repo override
git config user.name "Work Name"
git config user.email "work@company.com"
```

### Editor

```bash
git config --global core.editor "code --wait"     # VS Code
git config --global core.editor "vim"              # Vim
git config --global core.editor "nano"             # Nano
git config --global core.editor "subl -w"          # Sublime
git config --global core.editor "'C:/Program Files/Notepad++/notepad++.exe' -multiInst -notabbar -nosession -noPlugin"
```

### Default branch name

```bash
git config --global init.defaultBranch main
```

### Line endings

```bash
# Windows — auto-convert line endings
git config --global core.autocrlf true

# macOS/Linux — don't auto-convert
git config --global core.autocrlf input

# Disable auto-conversion
git config --global core.autocrlf false
```

## Viewing configuration

```bash
# List all settings
git config --list
git config -l

# List with origin
git config --list --show-origin

# Get specific value
git config user.name
git config user.email
git config core.editor

# Get from specific level
git config --global --get user.name
git config --local --get user.name
```

## Common settings

### Color

```bash
git config --global color.ui auto
git config --global color.branch auto
git config --global color.diff auto
git config --global color.status auto
```

### Aliases

```bash
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.lg "log --graph --oneline --decorate --all"
git config --global alias.amend 'commit --amend --no-edit'
git config --global alias.wip 'commit -am "WIP"'
git config --global alias.aliases 'config --get-regexp alias'
```

### Diff and merge tools

```bash
# Diff tool
git config --global diff.tool vimdiff
git config --global diff.tool vscode
git config --global difftool.vscode.cmd 'code --wait --diff $LOCAL $REMOTE'

# Merge tool
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

# Don't prompt before launching
git config --global difftool.prompt false
git config --global mergetool.prompt false
```

### Pull behavior

```bash
# Rebase by default (recommended)
git config --global pull.rebase true

# Merge by default
git config --global pull.rebase false

# Fast-forward only
git config --global pull.ff only
```

### Push behavior

```bash
# Push current branch to same name on remote
git config --global push.default current

# Push to upstream branch
git config --global push.default upstream

# Push all matching branches
git config --global push.default matching

# Simple (default since Git 2.0)
git config --global push.default simple

# Force with lease by default
git config --global push.forceWithLease true
```

### Credential helpers

```bash
# Store credentials (plaintext, not secure)
git config --global credential.helper store

# Cache in memory for 1 hour
git config --global credential.helper 'cache --timeout=3600'

# OS keychain (macOS)
git config --global credential.helper osxkeychain

# Windows Credential Manager
git config --global credential.helper manager

# Per-host configuration
git config --global credential.https://github.com.username myuser
```

### Signing

```bash
# GPG signing
git config --global user.signingkey ABC12345
git config --global commit.gpgsign true
git config --global tag.gpgsign true

# SSH signing (Git 2.34+)
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
```

### Rebase

```bash
# Auto-stash during rebase
git config --global rebase.autoStash true

# Auto-squash fixup commits
git config --global rebase.autoSquash true

# Update info during rebase
git config --global rebase.updateRefs true
```

### Fetch

```bash
# Prune on fetch
git config --global fetch.prune true

# Prune tags on fetch
git config --global fetch.pruneTags true
```

### Log

```bash
# Better merge display
git config --global log.date iso
git config --global log.decorate auto

# Follow renames in log
git config --global log.follow true
```

### Diff

```bash
# Better rename detection
git config --global diff.renames copies

# Show function in hunk header
git config --global diff.algorithm histogram

# Word diff
git config --global diff.wordDiff true
```

### Core settings

```bash
# File change monitoring (performance)
git config --global core.fsmonitor true

# Untracked cache (performance)
git config --global core.untrackedCache true

# Use built-in file system monitor
git config --global core.fsmonitor true

# Case sensitivity
git config --global core.ignorecase false

# File mode changes (useful when filesystem doesn't track modes)
git config --global core.fileMode false

# Precompose Unicode (macOS)
git config --global core.precomposeunicode true
```

## Configuration file format

```ini
# ~/.gitconfig
[user]
    name = John Doe
    email = john@example.com
    signingkey = ABC12345

[core]
    editor = code --wait
    autocrlf = input
    excludesfile = ~/.gitignore_global

[init]
    defaultBranch = main

[alias]
    co = checkout
    br = branch
    ci = commit
    st = status
    lg = log --graph --oneline --decorate --all

[pull]
    rebase = true

[push]
    default = current
    forceWithLease = true

[credential]
    helper = osxkeychain

[commit]
    gpgsign = true

[diff]
    tool = vscode

[merge]
    tool = vscode
    conflictstyle = zdiff3

[rerere]
    enabled = true
```

### Global gitignore

```bash
# Set global gitignore file
git config --global core.excludesfile ~/.gitignore_global

# Example ~/.gitignore_global
# .DS_Store
# Thumbs.db
# *.swp
# *.swo
# *~
# .idea/
# .vscode/
# node_modules/
```

## Conditional configuration

### IncludeIf (Git 2.13+)

```ini
# ~/.gitconfig
[includeIf "gitdir:~/work/"]
    path = ~/.gitconfig-work

[includeIf "gitdir:~/personal/"]
    path = ~/.gitconfig-personal
```

```ini
# ~/.gitconfig-work
[user]
    name = John Doe
    email = john@company.com

[commit]
    gpgsign = true
```

### By remote URL

```ini
[includeIf "hasconfig:remote.*.url:git@github.com:company/**"]
    path = ~/.gitconfig-work
```

## Performance configuration

```bash
# Enable filesystem monitor (significantly faster on large repos)
git config core.fsmonitor true

# Enable untracked cache
git config core.untrackedCache true

# Use multiple pack threads
git config pack.threads 0  # Auto-detect

# Increase delta window for better compression
git config pack.window 50

# Use bitmap index for faster pack creation
git config repack.writeBitmaps true

# Index version 4 (smaller index)
git config index.version 4
```

## Best practices

1. Set `user.name` and `user.email` globally, override per-repo for work
2. Use `init.defaultBranch main` to modernize default branch
3. Set `pull.rebase true` for linear history
4. Set `push.default current` for predictable push behavior
5. Set `fetch.prune true` to auto-clean stale branches
6. Use `includeIf` for separate work/personal configs
7. Use credential helpers instead of storing passwords in URLs
8. Set `core.fsmonitor true` for large repositories
9. Use SSH signing instead of GPG for simpler setup
10. Set `merge.conflictStyle zdiff3` for better conflict resolution context
