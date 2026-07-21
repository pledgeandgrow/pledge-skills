# Authentication — HTTP Credentials and TLS Certificates

> **Sources:** [HTTP credentials](https://docs.astral.sh/uv/concepts/authentication/http/) | [TLS certificates](https://docs.astral.sh/uv/concepts/authentication/certificates/)

## HTTP Credentials

### netrc Files

[`.netrc`](https://everything.curl.dev/usingcurl/netrc) files are a plain text format for storing credentials. Reading from `.netrc` is always enabled. The path is loaded from the `NETRC` environment variable, falling back to `~/.netrc`.

### The uv Credentials Store

uv can read and write credentials using `uv auth` commands. Credentials are stored in plaintext in uv's state directory (e.g., `~/.local/share/uv/credentials/credentials.toml` on Unix).

**Native storage (preview):** Set `UV_PREVIEW_FEATURES=native-auth` to use OS-native storage:
- macOS: Keychain Services
- Windows: Windows Credential Manager
- Linux: DBus-based Secret Service API

Currently, uv only retrieves credentials it has added — not those persisted by other applications.

### Keyring Providers

The `subprocess` keyring provider invokes the `keyring` CLI to fetch credentials:

```bash
--keyring-provider subprocess
UV_KEYRING_PROVIDER=subprocess
```

```toml
[tool.uv]
keyring-provider = "subprocess"
```

### Persistence of Credentials

- Authentication found for an index URL is cached for the duration of the command (not across invocations).
- `uv add` will **not** persist index credentials to `pyproject.toml` or `uv.lock`.
- Credentials for direct URLs (e.g., `package @ https://user:pass@example.com/foo.whl`) are persisted since there's no other way to provide them.

## TLS Certificates

### TLS Backend

uv uses `rustls` with `aws-lc-rs` as the cryptography provider. Supported X.509 signature algorithms:
- ECDSA (P-256, P-384, P-521) with SHA-256/384/512
- Ed25519
- RSA PKCS#1 v1.5 (2048-8192 bit) with SHA-256/384/512
- RSA-PSS (2048-8192 bit) with SHA-256/384/512

### System Certificates

By default, uv uses bundled Mozilla root certificates. To use the platform's native certificate store (e.g., for corporate trust roots):

```bash
--system-certs
UV_SYSTEM_CERTS=true
```

```toml
[tool.uv]
system-certs = true
```

Verification is performed by `rustls-platform-verifier`, delegating to the OS certificate verifier.

### Custom Certificates

Use custom CA certificates via environment variables:

- `SSL_CERT_FILE` — Path to a PEM-encoded certificate bundle (e.g., `certs.pem`, `ca-bundle.crt`)
- `SSL_CERT_DIR` — One or more directories containing PEM-encoded certificates (separator: `:` on Unix, `;` on Windows)

When set, these override the default certificate source entirely — only provided certificates are trusted.

For client certificate authentication (mTLS), set `SSL_CLIENT_CERT` to a PEM file containing the certificate followed by the private key.

Notes:
- Certificates usually have `.pem`, `.crt`, or `.cer` extensions, but uv reads any regular file in `SSL_CERT_DIR`
- DER-encoded files are not supported
- Symlinks are resolved; dangling symlinks are ignored

### Insecure Hosts

Disable certificate verification for specific hosts:

```toml
[tool.uv]
allow-insecure-host = ["example.com"]
```

Accepts a hostname (e.g., `localhost`) or hostname-port pair (e.g., `localhost:8080`). Only applies to HTTPS connections.

**Use with caution** — only in trusted environments, as it bypasses SSL verification and exposes to MITM attacks.

## The uv auth CLI

> **Source:** [https://docs.astral.sh/uv/concepts/authentication/cli/](https://docs.astral.sh/uv/concepts/authentication/cli/)

### Logging In

Add credentials for a service:

```bash
$ uv auth login example.com
```

Provide credentials via options or stdin:

```bash
$ echo 'my-password' | uv auth login example.com --password -
$ uv auth login example.com --token my-token
```

Credentials are used for packaging operations requiring HTTPS Basic auth. They are not validated and not used for Git requests.

### Logging Out

```bash
$ uv auth logout example.com
```

Removes credentials from local storage only (does not invalidate with the remote server).

### Showing Credentials

```bash
$ uv auth token example.com
$ uv auth token --username foo example.com
```

### Using Credentials with External Tools

`uv auth helper` supports the Bazel credential helper protocol:

```bash
$ echo '{"uri": "https://example.com/path"}' | uv --preview-features auth-helper auth helper --protocol=bazel get
{"headers":{"Authorization":["Basic ..."]}}
```

If no credentials are found, returns `{"headers": {}}`.

### Configuring the Storage Backend

By default, credentials are stored in plaintext. Enable native OS storage with:

```bash
UV_PREVIEW_FEATURES=native-auth
```

## Third-Party Services

> **Source:** [https://docs.astral.sh/uv/concepts/authentication/third-party/](https://docs.astral.sh/uv/concepts/authentication/third-party/)

### Alternative Package Indexes

Dedicated guides for popular indexes:
- [Azure Artifacts](https://docs.astral.sh/uv/guides/integration/azure/)
- [Google Artifact Registry](https://docs.astral.sh/uv/guides/integration/google/)
- [AWS CodeArtifact](https://docs.astral.sh/uv/guides/integration/aws/)
- [JFrog Artifactory](https://docs.astral.sh/uv/guides/integration/jfrog/)

### Hugging Face Support

If `HF_TOKEN` is set, uv automatically propagates it to requests to `huggingface.co`:

```bash
$ HF_TOKEN=hf_... uv run https://huggingface.co/datasets/<user>/<name>/resolve/<branch>/main.py
```

Disable automatic Hugging Face authentication:

```bash
UV_NO_HF_TOKEN=1
```
