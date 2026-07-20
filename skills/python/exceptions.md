# Exceptions & Context Managers

**Docs:** https://docs.python.org/3/tutorial/errors.html | https://docs.python.org/3/reference/compound_stmts.html#try

## try/except/else/finally

```python
# Basic try/except
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero")

# Multiple except blocks
try:
    value = int("abc")
except ValueError:
    print("Invalid integer")
except TypeError:
    print("Wrong type")

# Catch multiple exceptions in one block
try:
    risky_operation()
except (ValueError, TypeError, KeyError) as e:
    print(f"Error: {e}")

# else — runs if no exception
try:
    result = int("42")
except ValueError:
    print("Invalid")
else:
    print(f"Success: {result}")

# finally — always runs
try:
    f = open("file.txt")
    data = f.read()
except FileNotFoundError:
    print("File not found")
finally:
    f.close()  # always executed

# Full form
try:
    operation()
except SomeError as e:
    handle(e)
except OtherError:
    handle_other()
else:
    # runs only if no exception
    success()
finally:
    # always runs (even if return/break/continue in try)
    cleanup()
```

## Raising Exceptions

```python
# Raise
raise ValueError("Invalid value")
raise TypeError("Expected str, got int")

# Re-raise
try:
    risky()
except Exception:
    log_error()
    raise  # re-raise the same exception

# Raise from (exception chaining)
try:
    int("abc")
except ValueError as e:
    raise RuntimeError("Parse failed") from e

# Suppress chaining (rare)
raise RuntimeError("New error") from None
```

## Built-in Exception Hierarchy

```python
# BaseException
# ├── SystemExit
# ├── KeyboardInterrupt
# ├── GeneratorExit
# └── Exception
#     ├── StopIteration
#     ├── StopAsyncIteration
#     ├── ArithmeticError
#     │   ├── ZeroDivisionError
#     │   ├── OverflowError
#     │   └── FloatingPointError
#     ├── AssertionError
#     ├── AttributeError
#     ├── BufferError
#     ├── EOFError
#     ├── ImportError
#     │   └── ModuleNotFoundError
#     ├── LookupError
#     │   ├── IndexError
#     │   └── KeyError
#     ├── MemoryError
#     ├── NameError
#     │   └── UnboundLocalError
#     ├── OSError
#     │   ├── FileNotFoundError
#     │   ├── PermissionError
#     │   ├── FileExistsError
#     │   ├── IsADirectoryError
#     │   ├── NotADirectoryError
#     │   ├── TimeoutError
#     │   └── ...
#     ├── ReferenceError
#     ├── RuntimeError
#     │   ├── NotImplementedError
#     │   └── RecursionError
#     ├── StopIteration
#     ├── SyntaxError
#     │   └── IndentationError
#     │       └── TabError
#     ├── SystemError
#     ├── TypeError
#     ├── ValueError
#     │   └── UnicodeError
#     │       ├── UnicodeDecodeError
#     │       ├── UnicodeEncodeError
#     │       └── UnicodeTranslateError
#     └── Warning
#         ├── DeprecationWarning
#         ├── FutureWarning
#         ├── PendingDeprecationWarning
#         ├── RuntimeWarning
#         ├── SyntaxWarning
#         ├── UserWarning
#         └── ...

# Catch by base class
try:
    d = {}
    d["missing"]
except LookupError:  # catches KeyError and IndexError
    print("Lookup failed")

# Don't catch BaseException (catches SystemExit, KeyboardInterrupt)
# Avoid: except: (bare except)
# Use: except Exception:
```

## Custom Exceptions

```python
# Custom exception — inherit from Exception
class DatabaseError(Exception):
    pass

# With additional data
class ValidationError(Exception):
    def __init__(self, field, message):
        self.field = field
        self.message = message
        super().__init__(f"{field}: {message}")

try:
    raise ValidationError("email", "Invalid format")
except ValidationError as e:
    print(e.field)    # "email"
    print(e.message)  # "Invalid format"

# Exception hierarchy
class AppError(Exception):
    """Base for all app errors."""
    pass

class DatabaseError(AppError):
    pass

class ConnectionError(DatabaseError):
    pass

class QueryError(DatabaseError):
    pass

# With __str__ customization
class ConfigError(Exception):
    def __init__(self, key, value, expected_type):
        self.key = key
        self.value = value
        self.expected_type = expected_type

    def __str__(self):
        return f"Config '{self.key}': expected {self.expected_type}, got {type(self.value).__name__}"
```

## Exception Groups (3.11+)

```python
# ExceptionGroup — multiple exceptions at once
try:
    raise ExceptionGroup("Multiple errors", [
        ValueError("bad value"),
        TypeError("bad type"),
    ])
except ExceptionGroup as eg:
    for exc in eg.exceptions:
        print(f"  {type(exc).__name__}: {exc}")

# except* — handle specific types within a group
try:
    raise ExceptionGroup("Errors", [
        ValueError("v1"),
        TypeError("t1"),
        ValueError("v2"),
    ])
except* ValueError as vg:
    print(f"ValueErrors: {vg.exceptions}")
except* TypeError as tg:
    print(f"TypeErrors: {tg.exceptions}")

# Reraising unhandled
try:
    raise ExceptionGroup("Errors", [
        ValueError("v"),
        KeyError("k"),
    ])
except* ValueError:
    print("handled ValueError")
# KeyError is re-raised as ExceptionGroup

# BaseExceptionGroup — can contain BaseException (not just Exception)
try:
    raise BaseExceptionGroup("Fatal", [
        KeyboardInterrupt(),
        ValueError("recoverable"),
    ])
except* ValueError:
    print("handled ValueError")
# KeyboardInterrupt propagates (not caught by except*)

# ExceptionGroup nesting and splitting
eg = ExceptionGroup("outer", [
    ValueError("v1"),
    ExceptionGroup("inner", [
        TypeError("t1"),
        KeyError("k1"),
    ]),
])
# eg.exceptions[1] is itself an ExceptionGroup

# Accessing group properties
eg.exceptions  # tuple of contained exceptions
eg.message     # "outer"
eg.subgroup(ValueError)  # new group with only ValueErrors
eg.split(lambda e: isinstance(e, ValueError))  # (matched, unmatched)
```

## Exception Notes (3.11+)

```python
# add_note — attach additional context to exceptions
try:
    process(data)
except ValueError as e:
    e.add_note(f"Data was: {data!r}")
    e.add_note(f"Length: {len(data)}")
    raise  # notes appear in traceback

# __notes__ — list of note strings
try:
    risky()
except Exception as e:
    print(e.__notes__)  # ["note1", "note2"]
    e.add_note("extra context")
    raise

# Notes appear in traceback after the exception message
# ValueError: bad value
#     Data was: [1, 2, 3]
#     Length: 3
```

## Exception Chaining

```python
# Implicit chaining — __context__ (raised during except block)
try:
    int("abc")
except ValueError:
    raise TypeError("type error")  # TypeError.__context__ = ValueError

# Explicit chaining — __cause__ (use 'from')
try:
    int("abc")
except ValueError as e:
    raise TypeError("type error") from e  # __cause__ = ValueError

# Suppress chaining — from None
try:
    int("abc")
except ValueError:
    raise TypeError("type error") from None  # no chain

# Accessing chain
try:
    ...
except Exception as e:
    e.__context__  # implicitly chained exception
    e.__cause__    # explicitly chained exception (or None)
    e.__suppress_context__  # True if 'from None' was used

# Traceback shows:
# ValueError: bad value
#
# The above exception was the direct cause of the following exception:
#
# Traceback (most recent call last):
#   ...
# TypeError: type error
#
# Or for implicit:
# "During handling of the above exception, another exception occurred:"
```

## Context Managers

```python
# with statement — resource management
with open("file.txt") as f:
    data = f.read()
# f.close() called automatically

# Multiple context managers
with open("input.txt") as fin, open("output.txt", "w") as fout:
    fout.write(fin.read())

# Parenthesized (3.10+)
with (
    open("input.txt") as fin,
    open("output.txt", "w") as fout,
):
    fout.write(fin.read())

# Custom context manager — class with __enter__ and __exit__
class FileManager:
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None

    def __enter__(self):
        self.file = open(self.filename, self.mode)
        return self.file

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.file.close()
        return False  # don't suppress exceptions

with FileManager("data.txt", "r") as f:
    content = f.read()

# Suppress exceptions in __exit__
class SuppressErrors:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is ValueError:
            return True  # suppress ValueError
        return False

# contextlib — utilities
from contextlib import contextmanager, suppress, redirect_stdout, ExitStack

# @contextmanager — generator-based
@contextmanager
def timer():
    import time
    start = time.time()
    try:
        yield
    finally:
        elapsed = time.time() - start
        print(f"Elapsed: {elapsed:.2f}s")

with timer():
    do_something()

# @contextmanager with value
@contextmanager
def open_db(url):
    db = connect(url)
    try:
        yield db
    finally:
        db.close()

with open_db("localhost") as db:
    db.query("SELECT 1")

# suppress — ignore specified exceptions
with suppress(FileNotFoundError):
    os.remove("maybe_missing.txt")

# redirect_stdout
import io
buffer = io.StringIO()
with redirect_stdout(buffer):
    print("captured")
output = buffer.getvalue()  # "captured\n"

# ExitStack — dynamic context management
with ExitStack() as stack:
    files = [stack.enter_context(open(f)) for f in filenames]
    # all files closed on exit

# closing — for objects with close() but no __enter__/__exit__
from contextlib import closing
with closing(urlopen(url)) as response:
    data = response.read()
```

## Warnings

```python
import warnings

# Issue warning
warnings.warn("Deprecated", DeprecationWarning)
warnings.warn("User-facing warning", UserWarning)

# Warning categories
# UserWarning, DeprecationWarning, FutureWarning,
# RuntimeWarning, SyntaxWarning, PendingDeprecationWarning

# Filter warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("error", category=FutureWarning)  # treat as error

# Simplefilter
warnings.simplefilter("ignore")  # ignore all
warnings.simplefilter("always")  # always show

# With context
with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    risky_code()
```

## Assertions

```python
# assert — debugging checks (removed with -O flag)
assert x > 0
assert x > 0, "x must be positive"

# Don't use assert for data validation — use if/raise
# assert can be disabled with python -O

# AssertionError
try:
    assert False, "Always fails"
except AssertionError as e:
    print(e)  # "Always fails"
```

## Exception Best Practices

```python
# Be specific — catch only what you expect
# Bad
try:
    do_something()
except:
    pass  # catches everything including KeyboardInterrupt

# Good
try:
    do_something()
except (ValueError, TypeError) as e:
    log(e)
    raise

# Don't suppress unless intentional
try:
    risky()
except SomeError:
    pass  # OK if truly ignorable

# Clean up in finally
try:
    resource = acquire()
    use(resource)
finally:
    resource.release()

# Use context managers instead of try/finally when possible
with acquire() as resource:
    use(resource)
```
