# Git Authentication — Credentials for Private Repositories

> **Source:** [https://docs.astral.sh/uv/concepts/authentication/git/](https://docs.astral.sh/uv/concepts/authentication/git/)

When dependencies are sourced from Git repositories, uv needs to authenticate to fetch them.

## SSH Authentication

Use the `ssh://` protocol with SSH keys:

- `git+ssh://git@<hostname>/...` (e.g., `git+ssh://git@github.com/astral-sh/uv`)

SSH authentication requires using the username `git`.

See the [GitHub SSH documentation](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/about-ssh) for configuring SSH keys.

Example in `pyproject.toml`:

```toml
[tool.uv.sources]
private-pkg = { git = "git+ssh://git@github.com/org/private-pkg.git" }
```

## HTTP Authentication

Authenticate over HTTP Basic authentication using a password or token:

- `git+https://<user>:<token>@<hostname>/...` (e.g., `git+https://git:ghp_xxxx@github.com/astral-sh/uv`)
- `git+https://<token>@<hostname>/...` (e.g., `git+https://ghp_xxxx@github.com/astral-sh/uv`)
- `git+https://<user>@<hostname>/...` (e.g., `git+https://user@github.com/astral-sh/uv`)

When using a GitHub personal access token, the username is arbitrary. GitHub doesn't allow account name and password in URLs.

If no credentials are present in the URL and authentication is needed, the Git credential helper will be queried.

## Persistence of Credentials

When using `uv add`, uv will **not** persist Git credentials to `pyproject.toml` or `uv.lock`. These files are often included in source control and distributions, so including credentials is unsafe.

If you have a Git credential helper configured, credentials may be automatically persisted for subsequent fetches. Without a credential helper, uv will fail to fetch the dependency on machines without seeded credentials.

Force uv to persist Git credentials with `--raw`:

```bash
$ uv add --raw "git+https://user:token@github.com/org/private-pkg.git"
```

**Strongly prefer setting up a credential helper instead of using `--raw`.**

## Git Credential Helpers

Git credential helpers store and retrieve Git credentials. See the [Git documentation](https://git-scm.com/doc/credential-helpers) for details.

### GitHub (gh CLI)

The simplest way to set up a credential helper for GitHub:

```bash
$ gh auth login
```

When using `gh auth login --with-token` (non-interactive, e.g., in CI), also run:

```bash
$ gh auth setup-git
```

This configures the credential helper automatically.

### Other Credential Helpers

Git supports various credential helpers:

- `cache` — In-memory credential cache with timeout
- `store` — Store credentials in plaintext (not recommended)
- OS-specific helpers — `osxkeychain` (macOS), `manager-core` (Windows), `libsecret` (Linux)
