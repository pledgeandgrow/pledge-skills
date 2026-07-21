# Integrations — Jupyter and marimo

> **Sources:** [Jupyter](https://docs.astral.sh/uv/guides/integration/jupyter/) | [marimo](https://docs.astral.sh/uv/guides/integration/marimo/)

## Jupyter

### Using Jupyter Within a Project

Start a Jupyter server with access to the project's virtual environment:

```bash
$ uv run --with jupyter jupyter lab
```

Default URL: `http://localhost:8888/lab`. Within a notebook, `import` your project's modules normally.

### Creating a Kernel

For installing packages from within notebooks, create a dedicated kernel:

```bash
$ uv add --dev ipykernel
$ uv run ipython kernel install --user --env VIRTUAL_ENV $(pwd)/.venv --name=project
```

Start the server and select the project kernel from the dropdown:

```bash
$ uv run --with jupyter jupyter lab
```

Use `!uv add pydantic` to add deps to the project, or `!uv pip install pydantic` to install into the venv without persisting to `pyproject.toml`/`uv.lock`.

### Installing Packages Without a Kernel

`!uv add pydantic` works without a kernel (modifies project env). However, `!uv pip install` installs into Jupyter's isolated environment, not the project — deps may disappear on restart.

For `%pip` magic support, seed pip into the venv first:

```bash
$ uv venv --seed
$ uv run --with jupyter jupyter lab
```

### Using Jupyter as a Standalone Tool

```bash
$ uv tool run jupyter lab
```

Runs in an isolated environment.

### Using Jupyter with a Non-Project Environment

```bash
$ uv venv --seed
$ uv pip install pydantic
$ uv pip install jupyterlab
$ .venv/bin/jupyter lab       # macOS/Linux
$ .venv\Scripts\jupyter lab   # Windows
```

### Using Jupyter from VS Code

```bash
$ uv init project
$ cd project
$ uv add --dev ipykernel
$ code .
```

Create a notebook via command palette → "Create: New Jupyter Notebook". Select kernel → "Python Environments" → `.venv/bin/python` (or `.venv\Scripts\python` on Windows).

Add `uv` as a dev dependency to manipulate the env from within notebooks:

```bash
$ uv add --dev uv
```

## marimo

### Using marimo as a Standalone Tool

```bash
$ uvx marimo edit
$ uvx marimo edit my_notebook.py
```

### Using marimo with Inline Script Metadata

marimo notebooks are Python scripts — they support PEP 723 inline metadata:

```bash
$ uv add --script my_notebook.py numpy
$ uvx marimo edit --sandbox my_notebook.py
```

With `--sandbox`, marimo uses uv to start in an isolated environment with the script's deps. Packages installed from the UI are added to the script metadata automatically.

Run without opening an interactive session:

```bash
$ uv run my_notebook.py
```

### Using marimo Within a Project

```bash
$ uv run marimo edit my_notebook.py    # if marimo is a project dep
$ uv run --with marimo marimo edit my_notebook.py  # if not
```

### Using marimo in a Non-Project Environment

```bash
$ uv venv
$ uv pip install numpy
$ uv pip install marimo
$ uv run marimo edit
```

### Running marimo Notebooks as Scripts

```bash
$ uv run my_notebook.py
```

Executes as a Python script without opening a browser session.
