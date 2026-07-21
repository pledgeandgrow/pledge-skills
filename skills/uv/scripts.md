# Running Scripts with uv

> **Source:** [https://docs.astral.sh/uv/guides/scripts/](https://docs.astral.sh/uv/guides/scripts/)

## Running a Script Without Dependencies

Execute a script with `uv run`:

```bash
$ uv run example.py
Hello world
```

Standard library modules work without extra configuration:

```python
import os
print(os.path.expanduser("~"))
```

```bash
$ uv run example.py
/Users/astral
```

Arguments can be provided to the script:

```bash
$ uv run example.py hello world!
hello world!
```

Scripts can be read from stdin:

```bash
$ echo 'print("hello world!")' | uv run -
```

Or using here-documents:

```bash
$ uv run - <<EOF
print("hello world!")
EOF
```

If running in a project directory (with `pyproject.toml`), `uv run` will install the current project first. Use `--no-project` to skip this:

```bash
$ uv run --no-project example.py
```

## Running a Script With Dependencies

When a script requires external packages, declare dependencies explicitly. uv creates environments on-demand rather than using a long-lived virtual environment.

Request dependencies per invocation with `--with`:

```bash
$ uv run --with rich example.py
```

Add version constraints:

```bash
$ uv run --with 'rich>12,<13' example.py
```

Multiple dependencies can be requested by repeating `--with`.

If `uv run` is used in a project, `--with` dependencies are included in addition to the project's dependencies. Use `--no-project` to opt out.

## Creating a Python Script

Use `uv init --script` to initialize scripts with inline metadata (PEP 723):

```bash
$ uv init --script example.py --python 3.12
```

## Declaring Script Dependencies

Use `uv add --script` to declare dependencies in the script's inline metadata:

```bash
$ uv add --script example.py 'requests<3' 'rich'
```

This adds a script section at the top:

```python
# /// script
# dependencies = [
#     "requests<3",
#     "rich",
# ]
# ///
import requests
from rich.pretty import pprint

resp = requests.get("https://peps.python.org/api/peps.json")
data = resp.json()
pprint([(k, v["title"]) for k, v in data.items()][:10])
```

uv automatically creates an environment with the dependencies and runs the script:

```bash
$ uv run example.py
[('1', 'PEP Purpose and Guidelines'), ...]
```

When using inline script metadata, the project's dependencies are ignored — `--no-project` is not required.

### Python Version Requirements

uv respects Python version requirements in inline metadata:

```python
# /// script
# requires-python = ">=3.12"
# dependencies = []
# ///
type Point = tuple[float, float]
print(Point)
```

The `dependencies` field must be provided even if empty. uv will search for and download the required Python version if not installed.

## Using a Shebang to Create an Executable File

Add a shebang to make a script executable without `uv run`:

```python
#!/usr/bin/env -S uv run --script
print("Hello, world!")
```

Make it executable and run:

```bash
$ chmod +x greet
$ ./greet
Hello, world!
```

With dependencies:

```python
#!/usr/bin/env -S uv run --script
#
# /// script
# requires-python = ">=3.12"
# dependencies = ["httpx"]
# ///
import httpx
print(httpx.get("https://example.com"))
```

## Using Alternative Package Indexes

Provide an alternative index with `--index`:

```bash
$ uv add --index "https://example.com/simple" --script example.py 'requests<3' 'rich'
```

This includes the index in inline metadata:

```toml
# [[tool.uv.index]]
# url = "https://example.com/simple"
```

## Locking Dependencies

uv supports locking dependencies for PEP 723 scripts using the `uv.lock` file format:

```bash
$ uv lock --script example.py
```

This creates a `.lock` file adjacent to the script (e.g., `example.py.lock`).

Once locked, subsequent operations like `uv run --script`, `uv add --script`, `uv export --script`, and `uv tree --script` will reuse the locked dependencies, updating the lockfile if necessary.

## Improving Reproducibility

Use `exclude-newer` in the `tool.uv` section of inline script metadata to limit uv to only considering distributions released before a specific date:

```python
# /// script
# dependencies = ["requests"]
# [tool.uv]
# exclude-newer = "2023-10-16T00:00:00Z"
# ///
import requests
print(requests.__version__)
```

The date should be specified as an RFC 3339 timestamp (e.g., `2006-12-02T02:07:43Z`).

## Using Different Python Versions

Request arbitrary Python versions per script invocation:

```bash
$ uv run --python 3.10 example.py
3.10.15
```

```bash
$ uv run example.py
3.12.6
```

## Using GUI Scripts

On Windows, uv runs scripts with `.pyw` extension using `pythonw`:

```powershell
PS> uv run example.pyw
```

With dependencies:

```powershell
PS> uv run --with PyQt5 example_pyqt.pyw
```
