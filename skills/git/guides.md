# Guides — gitignore, gitattributes, hooks, modules, workflows

Git guide files and configuration conventions.

## gitignore

The `.gitignore` file specifies intentionally untracked files that Git should ignore.

### Syntax

```gitignore
# Comments start with #

# Ignore all .log files
*.log

# But keep important.log
!important.log

# Ignore node_modules directory
node_modules/

# Ignore all files in build directory
build/

# Ignore only root-level .env
/.env

# Ignore .env in any directory
.env

# Ignore all .tmp files in src/
src/**/*.tmp

# Negate pattern (re-include)
!src/important.tmp

# Double asterisk matches any number of directories
logs/**/*.txt

# Single asterisk matches one directory level
logs/*/*.txt

# Question mark matches single character
log?.txt

# Character ranges
log[0-9].txt
log[!0-9].txt  # Not a digit
```

### .gitignore locations

```
# ~/.gitignore_global — global (configured with core.excludesfile)
# .gitignore — in repository root (applies to all subdirectories)
# src/.gitignore — in subdirectory (applies to that directory and below)
```

### Common .gitignore patterns

```gitignore
# OS files
.DS_Store
Thumbs.db
desktop.ini

# IDE
.idea/
.vscode/
*.swp
*.swo
*~

# Dependencies
node_modules/
vendor/

# Build artifacts
dist/
build/
*.o
*.class
*.pyc

# Environment
.env
.env.local
*.local

# Logs
*.log
logs/

# Coverage
coverage/
.coverage
htmlcov/
```

### Global gitignore

```bash
# Set global gitignore
git config --global core.excludesfile ~/.gitignore_global
```

### Checking ignore status

```bash
# Check if file is ignored
git check-ignore -v file.txt

# Show which rule matches
git check-ignore -v .env
# .gitignore:5:.env    .env
```

### Ignoring already-tracked files

```bash
# If file is already tracked, .gitignore won't work
# Stop tracking but keep file:
git rm --cached file.txt
echo "file.txt" >> .gitignore
git commit -m "Stop tracking file.txt"
```

## gitattributes

The `.gitattributes` file assigns attributes to file paths.

### Text vs binary

```gitattributes
# Auto-detect text files
*.txt text

# Force binary
*.png binary
*.jpg binary

# Normalize line endings
*.txt text=auto

# CRLF on checkout, LF on checkin (Windows)
*.txt text eol=crlf

# LF always (Unix)
*.sh text eol=lf
```

### Diff and merge

```gitattributes
# Custom diff driver
*.md diff=markdown

# Word-level diff for documents
*.docx diff=word

# Disable diff for binary files
*.pdf binary -diff

# Custom merge driver
*.xml merge=xmlmerge
```

### Export-ignore

```gitattributes
# Exclude from archive
tests/ export-ignore
.gitignore export-ignore
.circleci/ export-ignore
```

### Filter (smudge/clean)

```gitattributes
# Filter through program on checkout (smudge) and checkin (clean)
*.secret filter=encrypt
```

```bash
# Configure filter
git config filter.encrypt.smudge "openssl enc -d -aes-256-cbc -k PASS"
git config filter.encrypt.clean "openssl enc -e -aes-256-cbc -k PASS"
```

### Language-specific

```gitattributes
# C/C++
*.c text diff=cpp
*.h text diff=cpp
*.cpp text diff=cpp

# Python
*.py text diff=python

# JavaScript
*.js text diff=javascript
*.ts text diff=javascript

# Go
*.go text diff=golang
```

## Git Hooks

Hooks are scripts that run automatically on certain Git events.

### Hook locations

```
.git/hooks/
├── applypatch-msg.sample
├── commit-msg.sample
├── post-update.sample
├── pre-applypatch.sample
├── pre-commit.sample
├── pre-merge-commit.sample
├── pre-push.sample
├── pre-rebase.sample
├── pre-receive.sample
├── prepare-commit-msg.sample
├── push-to-checkout.sample
└── update.sample
```

### Client-side hooks

#### pre-commit

```bash
#!/bin/sh
# .git/hooks/pre-commit

# Run tests before commit
npm test || exit 1

# Check for debug statements
if grep -r "console.log" src/; then
    echo "Error: console.log found in src/"
    exit 1
fi

# Format check
npm run lint || exit 1
```

#### prepare-commit-msg

```bash
#!/bin/sh
# .git/hooks/prepare-commit-msg

# Add branch name to commit message
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "[$BRANCH] $(cat $1)" > $1
```

#### commit-msg

```bash
#!/bin/sh
# .git/hooks/commit-msg

# Enforce conventional commits
MSG=$(cat $1)
if ! echo "$MSG" | grep -qE "^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+"; then
    echo "Error: Commit message must follow conventional commits format"
    echo "Example: feat(auth): add login page"
    exit 1
fi
```

#### pre-push

```bash
#!/bin/sh
# .git/hooks/pre-push

# Prevent pushing to main
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" = "main" ]; then
    echo "Error: Direct push to main is not allowed"
    exit 1
fi

# Run full test suite
npm test || exit 1
```

#### pre-rebase

```bash
#!/bin/sh
# .git/hooks/pre-rebase

# Prevent rebasing main
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" = "main" ]; then
    echo "Error: Cannot rebase main branch"
    exit 1
fi
```

### Server-side hooks

#### pre-receive

```bash
#!/bin/sh
# .git/hooks/pre-receive (server-side)

# Reject pushes to main
while read oldrev newrev refname; do
    if [ "$refname" = "refs/heads/main" ]; then
        echo "Error: Push to main is not allowed"
        exit 1
    fi
done
```

#### update

```bash
#!/bin/sh
# .git/hooks/update (server-side)

refname=$1
oldrev=$2
newrev=$3

# Reject force pushes to protected branches
if [ "$refname" = "refs/heads/main" ]; then
    if [ "$oldrev" != "0000000000000000000000000000000000000000" ]; then
        # Check if this is a force push
        if ! git merge-base --is-ancestor $oldrev $newrev; then
            echo "Error: Force push to main is not allowed"
            exit 1
        fi
    fi
fi
```

#### post-receive

```bash
#!/bin/sh
# .git/hooks/post-receive (server-side)

# Deploy after push
while read oldrev newrev refname; do
    if [ "$refname" = "refs/heads/main" ]; then
        # Deploy
        cd /var/www/app
        git --work-tree=/var/www/app --git-dir=/opt/git/app.git checkout -f main
        echo "Deployed to production"
    fi
done
```

### Managing hooks

```bash
# Hooks must be executable
chmod +x .git/hooks/pre-commit

# Use tools for shared hooks
# husky (npm)
npx husky init

# pre-commit (Python)
# .pre-commit-config.yaml
```

## gitmodules

The `.gitmodules` file maps submodule paths to URLs.

```ini
[submodule "libs/dependency"]
    path = libs/dependency
    url = https://github.com/user/dependency.git
    branch = main

[submodule "vendor/framework"]
    path = vendor/framework
    url = https://github.com/user/framework.git
    branch = develop
```

### Submodule commands

```bash
# Add
git submodule add https://github.com/user/lib.git libs/lib

# Initialize
git submodule init

# Update
git submodule update

# Update to latest
git submodule update --remote

# Foreach
git submodule foreach 'git checkout main'

# Status
git submodule status

# Deinit
git submodule deinit libs/lib
```

## Workflows

### Centralized workflow

```
All developers → central repository (main branch)
```

```bash
git clone repo
# work
git push origin main
```

### Feature branch workflow

```bash
git switch -c feature/new-api
# work
git push -u origin feature/new-api
# Pull request / merge
git switch main
git merge feature/new-api
git push origin main
```

### Gitflow workflow

```bash
# Main branches: main, develop
# Feature: feature/*
# Release: release/*
# Hotfix: hotfix/*

# Feature
git switch -c feature/auth develop
# work
git switch develop
git merge --no-ff feature/auth
git branch -d feature/auth

# Release
git switch -c release-1.2 develop
# finalize
git switch main
git merge --no-ff release-1.2
git tag -a v1.2 -m "Release 1.2"
git switch develop
git merge --no-ff release-1.2

# Hotfix
git switch -c hotfix/security main
# fix
git switch main
git merge --no-ff hotfix/security
git tag -a v1.2.1 -m "Hotfix 1.2.1"
git switch develop
git merge --no-ff hotfix/security
```

### Forking workflow (GitHub)

```bash
# Fork on GitHub
git clone git@github.com:me/repo.git
git remote add upstream git@github.com:original/repo.git

# Create feature
git switch -c feature/new-api
# work
git push origin feature/new-api

# Pull request on GitHub

# Sync with upstream
git fetch upstream
git switch main
git merge upstream/main
git push origin main
```

## Best practices

1. Keep `.gitignore` comprehensive — don't commit build artifacts or dependencies
2. Use `.gitattributes` for consistent line endings across platforms
3. Use hooks for automated quality checks (linting, tests)
4. Share hooks using tools like `husky` or `pre-commit`
5. Use server-side hooks for branch protection
6. Use conventional commit messages enforced by `commit-msg` hook
7. Document your workflow — centralized, feature branch, Gitflow, or forking
8. Use submodules for external dependencies, document their usage
9. Keep `.gitmodules` committed and up to date
10. Use `git check-ignore -v` to debug ignore rules
