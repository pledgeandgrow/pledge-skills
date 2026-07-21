# Introduction to Git

Git is a free and open source distributed version control system.

## What is Version Control?

Version control is a system that records changes to files over time so you can recall specific versions later. It allows you to:
- Revert files or entire projects to a previous state
- Compare changes over time
- See who last modified something causing a problem
- Recover from mistakes or lost files

### Types of Version Control Systems

**Local VCS**: Simple database storing patch sets on local disk (e.g., RCS).

**Centralized VCS (CVCS)**: Single server containing all versioned files, clients check out files (e.g., Subversion, CVS). Single point of failure.

**Distributed VCS (DVCS)**: Clients fully mirror the repository (e.g., Git, Mercurial). Every clone is a full backup. No single point of failure.

## A Short History of Git

Git was created in 2005 by Linus Torvalds for Linux kernel development after the BitKeeper VCS relationship broke down. Goals:
- Speed
- Simple design
- Strong support for non-linear development (thousands of parallel branches)
- Fully distributed
- Able to handle large projects like the Linux kernel efficiently

## Git Basics

### Snapshots, Not Differences

Unlike other VCSs that store file-based changes (deltas), Git stores data as **snapshots** of the project over time. Every commit stores a full snapshot of all tracked files. Unchanged files are not re-stored — just a link to the previous identical file.

### Nearly Every Operation Is Local

Most operations in Git need only files and resources local to the repository. No network needed for:
- Viewing project history
- Comparing changes
- Committing changes

### Git Has Integrity

Everything in Git is checksummed using SHA-1 hash. You can't change file contents without Git knowing about it.

```bash
# SHA-1 hashes are 40-character hex strings
24b9da6552252987aa493b52f8696cd6d3b00373
# Often abbreviated to first 7+ characters
24b9da6
```

### Git Generally Only Adds Data

Git rarely deletes data. Once you commit, it's very difficult to lose data.

### The Three States

Git has three main states for files:

1. **Modified**: Changed but not committed to database
2. **Staged**: Marked a modified file in its current version to go into next commit snapshot
3. **Committed**: Data safely stored in local database

This introduces three sections of a Git project:

- **Working directory**: Single checkout of one version of the project
- **Staging area (index)**: File storing information about what will go into next commit
- **Git directory (repository)**: Where Git stores metadata and object database

```
Working Directory ──git add──> Staging Area ──git commit──> Git Directory
     │                              │                              │
  (modify files)              (prepare commit)             (store snapshot)
```

## Installing Git

### Linux

```bash
# Debian/Ubuntu
sudo apt install git

# Fedora
sudo dnf install git

# CentOS/RHEL
sudo yum install git

# Arch
sudo pacman -S git
```

### macOS

```bash
# Via Homebrew
brew install git

# Via Xcode Command Line Tools
xcode-select --install
```

### Windows

Download from [git-scm.com/download/win](https://git-scm.com/download/win) or:

```powershell
winget install Git.Git
```

### From source

```bash
# Install dependencies (Ubuntu/Debian)
sudo apt install dh-autoreconf libcurl4-gnutls-dev libexpat1-dev \
    gettext libz-dev libssl-dev

# Clone and build
git clone https://github.com/git/git.git
cd git
make prefix=/usr/local all
sudo make prefix=/usr/local install
```

## First-Time Git Setup

```bash
# Set your identity (required)
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com

# Set default editor
git config --global core.editor "code --wait"  # VS Code
git config --global core.editor "vim"           # Vim
git config --global core.editor "nano"          # Nano

# Check settings
git config --list

# Check specific setting
git config user.name
```

### Configuration levels

| Level | File | Scope |
|-------|------|-------|
| `--system` | `/etc/gitconfig` | All users on system |
| `--global` | `~/.gitconfig` | Current user |
| `--local` | `.git/config` | Current repository (default) |

## Getting Help

```bash
# Three ways to get help
git help <command>
git <command> --help
man git-<command>

# Quick help
git <command> -h

# List all commands
git help -a

# List guides
git help -g
```

## Git Version

```bash
git --version
# git version 2.49.0
```

## Best practices

1. Always set `user.name` and `user.email` before first commit
2. Use `--global` for personal settings, `--local` for project-specific
3. Read `git help <command>` when unsure of options
4. Keep Git updated for security patches and features
5. Use `git config --list` to verify settings
