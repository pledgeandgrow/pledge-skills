# Distributed Git

Distributed workflows, contributing to projects, and maintaining projects.

## Distributed Workflows

### Centralized workflow

One central repository, each developer clones and pushes directly to main.

```bash
git clone https://github.com/team/project.git
# Make changes
git push origin main
```

### Integration manager workflow

Each developer has their own public fork. Contributor pushes to fork, integration manager pulls from forks.

```bash
# Contributor
git clone git@github.com:me/project.git
git remote add upstream git@github.com:original/project.git
git switch -c feature
# work
git push origin feature
# Create pull request

# Integration manager
git remote add contributor git@github.com:contributor/project.git
git fetch contributor
git diff main contributor/feature
git merge contributor/feature
git push origin main
```

### Dictator and lieutenants workflow

Single dictator (maintainer) integrates work from multiple lieutenants (subsystem maintainers), each managing their own area.

```
Developers → Lieutenant (subsystem) → Dictator (main) → Public repo
```

## Contributing to a Project

### Commit guidelines

- **Small commits**: One logical change per commit
- **Message format**: Imperative mood ("Add feature" not "Added feature")
- **Message structure**: First line ≤ 50 chars, blank line, detailed body wrapped at 72

```
Add user authentication with JWT

Implement login and registration endpoints using JWT tokens.
Includes token refresh, expiration handling, and middleware
for protected routes.

Fixes #123
```

### Private small team

```bash
# Clone
git clone git@github.com:team/project.git
cd project

# Create topic branch
git switch -c feature/new-api

# Work and commit
git add .
git commit -m "Add new API endpoint"

# Keep up to date
git fetch origin
git rebase origin/main  # or git merge origin/main

# Push
git push -u origin feature/new-api

# Create pull request on GitHub
```

### Private managed team

```bash
# Fork the project on GitHub
git clone git@github.com:me/project.git
cd project

# Add upstream
git remote add upstream git@github.com:team/project.git

# Create topic branch
git switch -c feature/new-api

# Work
git add .
git commit -m "Add new API endpoint"

# Push to your fork
git push origin feature/new-api

# Create pull request from me/project to team/project

# After review, update based on feedback
git switch feature/new-api
# make changes
git push origin feature/new-api  # PR auto-updates

# Sync with upstream
git fetch upstream
git rebase upstream/main
git push --force-with-lease origin feature/new-api
```

### Public project (email-based)

```bash
# Clone
git clone https://github.com/project/repo.git
cd repo

# Create branch
git switch -c fix/bug-123

# Work and commit
git add .
git commit -s -m "Fix bug #123: null pointer in parser"

# Create patches
git format-patch --cover-letter -o patches/ main

# Send patches
git send-email --to=maintainer@example.com patches/*.patch

# After feedback, revise
git switch fix/bug-123
# make changes
git commit --amend
git format-patch --subject-prefix="PATCH v2" -o patches-v2/ main
git send-email --to=maintainer@example.com patches-v2/*.patch
```

### Keeping up to date

```bash
# Rebase on upstream
git fetch upstream
git rebase upstream/main

# Or merge
git merge upstream/main

# Resolve conflicts and continue
git add .
git rebase --continue  # or git commit (for merge)
```

## Maintaining a Project

### Accepting patches

#### Via pull request

```bash
# Review PR on GitHub
# Fetch the PR branch
git fetch origin pull/123/head:pr-123
git switch pr-123

# Review
git log main..HEAD --oneline
git diff main...HEAD

# Test
npm test

# Merge
git switch main
git merge --no-ff pr-123
git push origin main

# Or rebase merge for clean history
git rebase main pr-123
git switch main
git merge --ff-only pr-123
git push origin main
```

#### Via email patch

```bash
# Apply patch
git am < 0001-Fix-bug.patch

# If conflicts
# resolve, then:
git add .
git am --continue

# Review
git log --oneline -3
git diff HEAD~1

# Test
npm test

# Push
git push origin main
```

### Reviewing work

```bash
# See what's in a branch
git log main..feature --oneline

# See diff
git diff main...feature

# See files changed
git diff --stat main...feature

# See commits with diffs
git log -p main..feature

# Check for whitespace errors
git diff --check main...feature
```

### Integrating contributions

#### Merge

```bash
# Simple merge
git merge feature

# No fast-forward (preserves branch history)
git merge --no-ff feature

# Squash merge
git merge --squash feature
git commit -m "Add feature (from contributor)"
```

#### Rebase + merge

```bash
# Rebase feature on main
git switch feature
git rebase main

# Fast-forward merge
git switch main
git merge --ff-only feature
```

#### Cherry-pick

```bash
# Pick specific commits
git cherry-pick abc123
git cherry-pick abc123..def456
```

### Tagging releases

```bash
# Annotated tag
git tag -a v1.2.0 -m "Release 1.2.0"

# Signed tag
git tag -s v1.2.0 -m "Release 1.2.0"

# Push tags
git push origin --tags

# Tag specific commit
git tag -a v1.2.0 -m "Release 1.2.0" abc123
```

### Generating release notes

```bash
# Shortlog since last release
git shortlog v1.1.0..v1.2.0 --no-merges

# Changelog
git log v1.1.0..v1.2.0 --oneline --no-merges

# Detailed changelog
git log v1.1.0..v1.2.0 --format="* %s (%an)" --no-merges
```

## Best practices

1. Use topic branches — one branch per feature or fix
2. Write clear, descriptive commit messages (imperative mood)
3. Keep commits small and focused — one logical change per commit
4. Rebase before merging for clean, linear history
5. Use `--no-ff` to preserve branch context in merge commits
6. Review code with `git diff main...feature` before merging
7. Use `git log --check` to catch whitespace errors
8. Tag releases with annotated or signed tags
9. Use `git shortlog` for release notes
10. Document contribution guidelines in CONTRIBUTING.md
