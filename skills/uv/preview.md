# Preview Features

> **Source:** [https://docs.astral.sh/uv/concepts/preview/](https://docs.astral.sh/uv/concepts/preview/)

## Enabling Preview Features

Enable all preview features:

```bash
$ uv run --preview ...
$ UV_PREVIEW=1 uv run ...
```

Enable specific features:

```bash
$ uv run --preview-features foo ...
$ uv run --preview-features foo --preview-features bar ...
$ uv run --preview-features foo,bar ...
$ UV_PREVIEW_FEATURES=foo,bar uv run ...
```

In configuration:

```toml
[tool.uv]
preview-features = ["foo", "bar"]
# Or enable all:
preview-features = true
```

Some preview features take effect before configuration files are loaded and cannot be enabled from configuration. Enabling non-existent preview features warns but does not error.

## Using Preview Features

Often, preview features can be used without changing settings if the behavior is gated by user interaction. For example, `pylock.toml` support works with `uv pip install` without enabling the preview feature — a warning is displayed instead. Enable the feature to silence the warning.

## Available Preview Features

| Feature | Description |
|---------|-------------|
| `add-bounds` | Configure default bounds for `uv add` invocations |
| `centralized-project-envs` | Store project virtual environments in the uv cache |
| `no-distutils-patch` | Skip distutils monkeypatch in venvs for Python 3.10+ |
| `json-output` | Allow `--output-format json` for various commands |
| `package-conflicts` | Define workspace conflicts at the package level |
| `pylock` | Install from `pylock.toml` files |
| `python-install-default` | Install `python` and `python3` executables |
| `format` | Use `uv format` |
| `index-exclude-newer` | Set `exclude-newer` on configured package indexes |
| `azure-endpoint` | Sign requests to Azure Blob Storage endpoints with Azure credentials |
| `native-auth` | Store credentials in system-native location (Keychain/Credential Manager/Secret Service) |
| `auth-helper` | Use `uv auth helper` as credential helper for external tools |
| `workspace-metadata` | Use `uv workspace metadata` |
| `workspace-dir` | Use `uv workspace dir` |
| `workspace-list` | Use `uv workspace list` |
| `target-workspace-discovery` | Use directory of `uv run` target for project/workspace discovery |
| `project-directory-must-exist` | Reject invalid `--project` path instead of warning |
| `malware-check` | Check for malware using [OSV](https://osv.dev) before installing packages |

## Disabling Preview Features

```bash
$ uv run --no-preview ...
```
