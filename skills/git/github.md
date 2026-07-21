# GitHub

Using GitHub — account setup, contributing, maintaining, and scripting.

## Account Setup and Configuration

### SSH key setup

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Start SSH agent
eval "$(ssh-agent -s)"

# Add key
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub
# Add to GitHub: Settings → SSH and GPG keys → New SSH key

# Test connection
ssh -T git@github.com
# Hi username! You've successfully authenticated...
```

### Two-factor authentication (2FA)

Enable 2FA in GitHub Settings → Password and authentication:
- TOTP app (Google Authenticator, Authy)
- Security key (YubiKey, etc.)
- SMS (not recommended)

### Personal access tokens

```bash
# Create token: Settings → Developer settings → Personal access tokens
# Use as password for HTTPS

git clone https://github.com/user/repo.git
# Username: your-username
# Password: ghp_your_token_here

# Or embed in URL (not recommended for security)
git remote set-url origin https://your-token@github.com/user/repo.git
```

### Credential helper

```bash
# Use credential helper to cache/store tokens
git config --global credential.helper store
# or
git config --global credential.helper 'cache --timeout=3600'
```

## Contributing to a Project

### Forking

1. Click "Fork" on GitHub repository page
2. Clone your fork
3. Add upstream remote
4. Create feature branch
5. Push to fork
6. Create pull request

```bash
# Fork on GitHub, then:
git clone git@github.com:me/project.git
cd project
git remote add upstream git@github.com:original/project.git

# Create branch
git switch -c feature/new-feature

# Work
git add .
git commit -m "Add new feature"

# Push to fork
git push -u origin feature/new-feature

# Create pull request on GitHub
```

### Keeping fork up to date

```bash
# Fetch upstream
git fetch upstream

# Update main from upstream
git switch main
git merge upstream/main
git push origin main

# Rebase feature on upstream
git switch feature/new-feature
git rebase upstream/main
git push --force-with-lease origin feature/new-feature
```

### Pull request best practices

- Write clear PR title and description
- Reference issues: "Fixes #123" or "Closes #456"
- Keep PRs small and focused
- Respond to review feedback promptly
- Update branch when requested

## Maintaining a Project

### Managing issues

- Use labels: bug, enhancement, good first issue, help wanted
- Use milestones for releases
- Assign issues to contributors
- Close issues with keywords in commits: "Fixes #123"

### Managing pull requests

```bash
# List open PRs via GitHub CLI
gh pr list

# Checkout a PR locally
gh pr checkout 123

# Review a PR
gh pr review 123 --approve --body "LGTM!"
gh pr review 123 --request-changes --body "Please fix X"

# Merge a PR
gh pr merge 123 --merge
gh pr merge 123 --squash
gh pr merge 123 --rebase
```

### Branch protection

Configure in GitHub: Settings → Branches → Branch protection rules:
- Require pull request reviews before merging
- Require status checks to pass
- Require branches to be up to date before merging
- Require signed commits
- Do not allow force pushes
- Do not allow deletions

### Releases

```bash
# Create release with GitHub CLI
gh release create v1.0.0 \
    --title "Release 1.0.0" \
    --notes "First stable release" \
    dist/app-v1.0.0.zip

# List releases
gh release list

# Download release
gh release download v1.0.0
```

## Managing an Organization

### Teams and permissions

- **Owners**: Full access to organization
- **Members**: Basic access
- Custom teams with specific repository permissions

### Organization settings

- Member privileges (default repository permission)
- Billing and plans
- Security (2FA requirement, SSO)
- Audit log

## GitHub CLI (gh)

### Installation

```bash
# macOS
brew install gh

# Linux (Debian/Ubuntu)
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update && sudo apt install gh

# Windows
winget install GitHub.cli
```

### Authentication

```bash
gh auth login
# Follow prompts to authenticate via browser or token
```

### Common commands

```bash
# Repositories
gh repo clone user/repo
gh repo create my-project --public
gh repo fork user/repo --clone

# Pull requests
gh pr create --title "Add feature" --body "Description"
gh pr list
gh pr view 123
gh pr checkout 123
gh pr merge 123 --squash
gh pr close 123

# Issues
gh issue create --title "Bug report" --body "Description"
gh issue list
gh issue view 456
gh issue close 456

# Releases
gh release create v1.0.0 --title "Release" --notes "Notes"
gh release list
gh release download v1.0.0

# Actions
gh run list
gh run view 12345
gh run watch 12345

# Gists
gh gist create file.txt --public
gh gist list

# Search
gh search repos "language:swift"
gh search prs "is:open is:unreviewed"
```

## GitHub Actions

### Basic workflow

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup
        run: |
          npm install
      - name: Test
        run: |
          npm test
```

### Matrix builds

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node: [18, 20, 22]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm install
      - run: npm test
```

## Scripting GitHub

### GitHub API with curl

```bash
# List repos
curl -H "Authorization: token ghp_your_token" \
     https://api.github.com/user/repos

# Create issue
curl -X POST -H "Authorization: token ghp_your_token" \
     -d '{"title":"Bug report","body":"Description"}' \
     https://api.github.com/repos/user/repo/issues

# Create pull request
curl -X POST -H "Authorization: token ghp_your_token" \
     -d '{"title":"Add feature","head":"feature-branch","base":"main"}' \
     https://api.github.com/repos/user/repo/pulls
```

### GitHub API with gh

```bash
# Use API via gh
gh api repos/user/repo/issues
gh api repos/user/repo/pulls --jq '.[].title'
gh api -X POST repos/user/repo/issues \
    -f title="Bug" -f body="Description"
```

## Best practices

1. Use SSH keys for authentication — more secure than passwords
2. Enable 2FA on your GitHub account
3. Use personal access tokens with minimal scopes
4. Fork → branch → PR workflow for external contributions
5. Write clear PR descriptions referencing issues
6. Use branch protection rules for important branches
7. Use GitHub CLI (`gh`) for command-line GitHub operations
8. Use GitHub Actions for CI/CD
9. Use labels and milestones for project management
10. Use `gh api` for scripting GitHub operations
