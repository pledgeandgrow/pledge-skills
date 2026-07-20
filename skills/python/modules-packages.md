# Modules & Packages

**Docs:** https://docs.python.org/3/tutorial/modules.html | https://docs.python.org/3/reference/import.html

## Modules

```python
# A module is a .py file containing definitions and statements

# math_utils.py
# def add(a, b): return a + b
# PI = 3.14159

# Importing
import math_utils
math_utils.add(1, 2)

# Import specific names
from math_utils import add, PI
add(1, 2)
PI

# Import with alias
import math_utils as mu
mu.add(1, 2)

from math_utils import add as plus
plus(1, 2)

# Import all names (not recommended — pollutes namespace)
from math_utils import *

# __all__ — controls what * imports
# In math_utils.py:
# __all__ = ["add", "PI"]  # only these are imported with *
```

## Packages

```
# Package structure:
myproject/
    __init__.py          # makes myproject a package
    utils/
        __init__.py
        math_utils.py
        string_utils.py
    models/
        __init__.py
        user.py
        product.py
```

```python
# Import from package
from myproject.utils.math_utils import add
from myproject.models.user import User

# Relative imports (within a package)
# In myproject/models/user.py:
from . import product          # same package
from ..utils.math_utils import add  # parent package

# __init__.py can contain package-level code
# myproject/__init__.py:
# __version__ = "1.0.0"
# from .models.user import User
```

## The import System

```python
import sys
import importlib

# Search path (sys.path)
sys.path  # list of directories Python searches for modules

# Add to path
sys.path.insert(0, "/path/to/modules")

# Find module spec
importlib.util.find_spec("json")

# Reload module (after editing)
importlib.reload(my_module)

# Module attributes
import json
json.__name__      # "json"
json.__file__      # path to module
json.__package__   # package name
json.__doc__       # module docstring

# Built-in modules
sys.builtin_module_names  # tuple of built-in module names

# Check if module is available
try:
    import nonexistent
except ImportError:
    print("Module not found")
```

## pip — Package Installer

```bash
# Install
pip install package_name
pip install package_name==1.2.3       # specific version
pip install "package_name>=1.0,<2.0"  # version range
pip install -r requirements.txt        # from file
pip install -e .                       # editable (local dev)
pip install ./package_directory        # from directory
pip install git+https://github.com/user/repo.git  # from git

# Uninstall
pip uninstall package_name

# List installed
pip list
pip list --outdated

# Show details
pip show package_name

# Freeze (export installed packages)
pip freeze > requirements.txt

# Upgrade
pip install --upgrade package_name

# Search (removed in pip 25+, use pip index or web)
pip index versions package_name

# Clear cache
pip cache purge
```

## Virtual Environments

```bash
# Create virtual environment
python -m venv .venv

# Activate (Linux/macOS)
source .venv/bin/activate

# Activate (Windows)
.venv\Scripts\activate

# Deactivate
deactivate

# Check which Python
which python  # should point to .venv/bin/python

# venv with specific Python version
python3.13 -m venv .venv

# Upgrade pip in venv
pip install --upgrade pip
```

```python
# venv module API
import venv
venv.create(".venv", with_pip=True)

# virtualenv (third-party, more features)
# pip install virtualenv
# virtualenv .venv

# uv (fast alternative, Rust-based)
# uv venv
# uv pip install package_name
```

## pyproject.toml (Modern Packaging)

```toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "my-package"
version = "1.0.0"
description = "A Python package"
readme = "README.md"
license = { text = "MIT" }
requires-python = ">=3.11"
authors = [{ name = "Alice", email = "alice@example.com" }]
keywords = ["example", "package"]
classifiers = [
    "Development Status :: 4 - Beta",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.13",
]

dependencies = [
    "requests>=2.31",
    "pydantic>=2.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0",
    "mypy>=1.0",
    "ruff>=0.1",
]
docs = [
    "sphinx>=7.0",
]

[project.scripts]
my-cli = "my_package.cli:main"

[project.urls]
Homepage = "https://github.com/user/my-package"
Documentation = "https://my-package.readthedocs.io"

# Tool configs can also go here
[tool.ruff]
line-length = 100

[tool.mypy]
strict = true

[tool.pytest.ini_options]
testpaths = ["tests"]
```

## requirements.txt

```text
# Pin exact versions for reproducibility
requests==2.31.0
pydantic==2.5.0

# Version ranges
django>=4.2,<5.0

# With extras
fastapi[all]>=0.100

# From git
git+https://github.com/user/repo.git@main

# From local path
./local-package

# Editable
-e ./my-local-package

# Hashes for security
requests==2.31.0 \
    --hash=sha256:abc123...
```

## __name__ == "__main__"

```python
# Module can be run as script or imported
def main():
    print("Running")

if __name__ == "__main__":
    main()

# When run directly: __name__ is "__main__"
# When imported: __name__ is the module name
```

## Namespace Packages

```python
# Namespace packages — split a package across directories
# No __init__.py needed (PEP 420)

# Directory structure:
# /path1/myproject/utils.py
# /path2/myproject/models.py

# Both paths in sys.path
# import myproject.utils  # from path1
# import myproject.models # from path2
```

## sys Module Essentials

```python
import sys

# Command-line arguments
sys.argv  # ['script.py', 'arg1', 'arg2']

# Exit
sys.exit(0)         # success
sys.exit(1)         # error
sys.exit("msg")     # error with message

# Platform info
sys.platform        # 'linux', 'win32', 'darwin'
sys.version         # Python version string
sys.version_info    # sys.version_info(major=3, minor=13, ...)

# Recursion limit
sys.getrecursionlimit()   # 1000
sys.setrecursionlimit(2000)

# Standard streams
sys.stdin
sys.stdout
sys.stderr

# Modules
sys.modules  # dict of loaded modules
```

## Environment Variables

```python
import os

# Read
os.environ.get("HOME")
os.environ["HOME"]  # KeyError if missing
os.getenv("HOME", "/default")  # with default

# Set
os.environ["MY_VAR"] = "value"

# Check
"HOME" in os.environ
```
