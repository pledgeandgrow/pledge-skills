# Working with the Shell in Flask

Flask provides tools for interacting with your application in an interactive Python shell, useful for debugging and experimentation.

## Command Line Interface

The `flask shell` command is the recommended way to work with the shell. It automatically initializes with a loaded application context.

```bash
$ flask shell
```

The shell automatically provides:
- `app` — the Flask application instance
- An active application context

For more information about CLI configuration, see the [CLI documentation](https://flask.palletsprojects.com/en/stable/cli/).

## Creating a Request Context

To work with request-specific objects (`request`, `session`) in the shell, create a request context manually using `test_request_context()`:

```python
>>> ctx = app.test_request_context()
>>> ctx.push()
```

Now you can work with the `request` object until you pop the context:

```python
>>> from flask import request
>>> request.method
'GET'
>>> ctx.pop()
```

Normally you would use the `with` statement, but in the shell, `push()` and `pop()` are more convenient:

```python
>>> with app.test_request_context():
...     # request is active here
...     pass
```

## Firing Before/After Request

Creating a request context alone does not run `before_request` functions. This means:
- Database connections set up in `before_request` callbacks won't be available
- `g` object won't be populated (e.g., current user)

To run before-request functions manually:

```python
>>> ctx = app.test_request_context()
>>> ctx.push()
>>> app.preprocess_request()
```

Note: `preprocess_request()` might return a response object — ignore it if so.

To run after-request functions, you need a response object:

```python
>>> app.process_response(app.response_class())
<Response 0 bytes [200 OK]>
>>> ctx.pop()
```

`teardown_request()` functions are automatically called when the context is popped, making this the right place to clean up resources like database connections.

## Improving the Shell Experience

Create a module with helper functions and utilities for star-import into your interactive session:

```python
# shelltools.py
from myapp import app, db, User, Post
from flask import request, session, g

def init_db():
    """Initialize the database."""
    db.create_all()

def drop_db():
    """Drop all tables."""
    db.drop_all()

def make_request_context(path='/', method='GET'):
    """Create and push a request context."""
    ctx = app.test_request_context(path, method=method)
    ctx.push()
    return ctx
```

Then in the shell:
```python
>>> from shelltools import *
>>> init_db()
>>> ctx = make_request_context('/user/1')
```

## Key Points

- Use `flask shell` for automatic application context setup
- Use `test_request_context()` to access request-specific objects
- Manually call `preprocess_request()` to trigger `before_request` callbacks
- Manually call `process_response()` to trigger `after_request` callbacks
- `teardown_request()` runs automatically when context is popped
- Create a `shelltools` module for commonly used imports and helpers
