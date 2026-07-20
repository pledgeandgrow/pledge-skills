# Idioms & Best Practices

**Docs:** https://peps.python.org/pep-0008/ | https://docs.python.org/3/howto/index.html

## PEP 8 — Style Guide

```python
# Indentation: 4 spaces (not tabs)
# Line length: 79 chars (code), 72 (docstrings/comments)
# Use blank lines:
#   2 blank lines around top-level functions/classes
#   1 blank line between methods

# Imports — one per line, grouped and ordered
import os
import sys

from collections import defaultdict, deque

import third_party_lib

# Naming conventions
module_name.py          # modules — lowercase with underscores
ClassName              # classes — CapWords (PascalCase)
function_name          # functions — lowercase with underscores
variable_name          # variables — lowercase with underscores
CONSTANT_NAME          # constants — UPPER_CASE
_private_name          # internal use — leading underscore
__name_mangling        # double leading — name mangling in classes
__dunder__             # double leading and trailing — magic methods

# Spaces around operators
x = 1
y = x + 2
z = x * (y + 1)

# No spaces inside parentheses
func(arg1, arg2)       # not func( arg1, arg2 )
dict["key"]            # not dict ["key"]

# Spaces after commas
[1, 2, 3]              # not [1,2,3]

# Trailing commas (optional but recommended for multi-line)
items = [
    "first",
    "second",
    "third",  # trailing comma
]
```

## Pythonic Idioms

```python
# EAFP — Easier to Ask Forgiveness than Permission
# Bad (LBYL — Look Before You Leap)
if key in d:
    value = d[key]
else:
    value = default

# Good (EAFP)
try:
    value = d[key]
except KeyError:
    value = default

# Or even better
value = d.get(key, default)

# Duck typing
# Bad
if isinstance(obj, list):
    for item in obj:
        process(item)

# Good — just try to iterate
for item in obj:  # works with any iterable
    process(item)

# Truthiness
# Bad
if len(items) > 0:
    process(items)

if items != []:
    process(items)

# Good
if items:  # empty collections are falsy
    process(items)

# None comparison
# Bad
if x == None:
    pass

# Good
if x is None:
    pass

# Enumerate
# Bad
for i in range(len(items)):
    print(i, items[i])

# Good
for i, item in enumerate(items):
    print(i, item)

# Zip
# Bad
for i in range(len(names)):
    print(names[i], ages[i])

# Good
for name, age in zip(names, ages):
    print(name, age)

# Comprehensions
# Bad
squares = []
for x in range(10):
    squares.append(x * x)

# Good
squares = [x * x for x in range(10)]

# Join strings
# Bad
result = ""
for word in words:
    result += word + " "

# Good
result = " ".join(words)

# Walrus operator
# Bad
n = len(data)
if n > 10:
    print(f"Too long: {n}")

# Good
if (n := len(data)) > 10:
    print(f"Too long: {n}")

# Multiple assignment
# Bad
a = 1
b = 2
c = 3

# Good
a, b, c = 1, 2, 3

# Swap
a, b = b, a

# Unpacking
# Good
first, *rest = items
```

## Context Managers Over try/finally

```python
# Bad
f = open("file.txt")
try:
    data = f.read()
finally:
    f.close()

# Good
with open("file.txt") as f:
    data = f.read()
```

## Use with for Resource Management

```python
# Database connections
with get_connection() as conn:
    with conn.cursor() as cur:
        cur.execute("SELECT 1")

# Locks
with threading.Lock():
    shared_resource.update()

# Temporary files
with tempfile.NamedTemporaryFile() as f:
    f.write(data)
```

## String Formatting

```python
# f-strings (preferred, 3.6+)
name = "Alice"
f"Hello, {name}!"

# .format() (when f-string not available)
"Hello, {}".format(name)

# % formatting (legacy, avoid in new code)
"Hello, %s" % name

# Concatenation (avoid for multiple strings)
"Hello, " + name + "!"

# f-string debugging (3.8+)
x = 42
f"{x=}"  # "x=42"
```

## Performance Tips

```python
# Use local variables — faster than global
# Function locals are faster than module globals

# Use list comprehensions over map/filter
# Faster: [x * 2 for x in items]
# Slower: list(map(lambda x: x * 2, items))

# Use generators for large sequences
# Memory: sum(x for x in range(10**9))  # generator — no list
# vs:     sum([x for x in range(10**9)]) # creates list first

# Use set for membership testing
# O(1): x in my_set
# O(n): x in my_list

# Use dict for lookups
lookup = {item.id: item for item in items}
result = lookup.get(target_id)  # O(1)

# String concatenation
# Fast: " ".join(words)
# Slow: reduce(lambda a, b: a + " " + b, words)

# Use collections.deque for queue operations
# O(1): deque.appendleft(), deque.popleft()
# O(n): list.insert(0, x), list.pop(0)

# Use slots for memory-efficient classes
class Point:
    __slots__ = ('x', 'y')

# Cache expensive calls
from functools import lru_cache

@lru_cache(maxsize=None)
def expensive(x):
    return compute(x)

# Use __slots__ for many instances
# Saves ~40-50% memory per instance

# Avoid repeated attribute lookups in loops
# Bad
for item in items:
    result = obj.expensive_method(item)

# Good
method = obj.expensive_method  # bind once
for item in items:
    result = method(item)
```

## Functional Programming Patterns

```python
# map, filter, reduce
from functools import reduce

list(map(str.upper, words))
list(filter(lambda x: x > 0, numbers))
reduce(lambda a, b: a + b, numbers, 0)

# But comprehensions are often more readable
[x.upper() for x in words]
[x for x in numbers if x > 0]
sum(numbers)  # instead of reduce

# any / all
any(x > 0 for x in numbers)  # True if any positive
all(x > 0 for x in numbers)  # True if all positive

# sorted with key
sorted(users, key=lambda u: u.age)
sorted(users, key=attrgetter("age"))  # operator.attrgetter
sorted(users, key=itemgetter("name"))  # operator.itemgetter

# itertools
from itertools import chain, groupby, islice

# Flatten
list(chain.from_iterable(nested_lists))

# Group
for key, group in groupby(sorted_data, key=keyfunc):
    process(key, list(group))

# Take first N
list(islice(generator, 10))
```

## Error Handling Patterns

```python
# Be specific
try:
    value = d[key]
except KeyError as e:
    logger.error(f"Missing key: {e}")
    raise

# Don't catch Exception blindly
# Bad
try:
    do_something()
except Exception:
    pass  # swallows all errors

# Good
try:
    do_something()
except (ValueError, TypeError) as e:
    logger.warning(f"Expected error: {e}")

# Use custom exceptions
class DomainError(Exception):
    pass

# Don't catch what you can't handle
# Let unexpected exceptions propagate
```

## Naming Conventions

```python
# Variables and functions — snake_case
user_name = "Alice"
def calculate_total(items):
    pass

# Classes — PascalCase
class ShoppingCart:
    pass

# Constants — UPPER_CASE
MAX_RETRIES = 3
DEFAULT_TIMEOUT = 30.0

# Private — leading underscore
_internal_cache = {}
def _helper_function():
    pass

# Name mangling — double leading underscore in class
class MyClass:
    def __init__(self):
        self.__private = "mangled"  # _MyClass__private

# Avoid: l (lowercase L), I (uppercase i), O (uppercase o)
# — easily confused with 1 and 0

# Boolean variables — is_ or has_ prefix
is_active = True
has_permission = False

# Collection names — plural
users = []
items = {}

# Avoid abbreviations unless widely accepted
# Bad: usr_nm = "Alice"
# Good: user_name = "Alice"
```

## Project Structure

```
myproject/
    pyproject.toml
    README.md
    .gitignore
    src/
        mypackage/
            __init__.py
            core.py
            utils.py
            models/
                __init__.py
                user.py
    tests/
        __init__.py
        conftest.py
        test_core.py
        test_utils.py
    docs/
        conf.py
        index.rst
```

## Docstring Conventions (PEP 257)

```python
def function(param1, param2):
    """One-line docstring for simple functions."""
    pass

def complex_function(param1, param2):
    """Multi-line docstring.

    Extended description of the function.

    Args:
        param1: Description of first parameter.
        param2 (int): Description with type.

    Returns:
        Description of return value.

    Raises:
        ValueError: When param1 is invalid.

    Examples:
        >>> complex_function(1, 2)
        3
    """
    pass

class MyClass:
    """Class docstring.

    Attributes:
        name: The name of the instance.
    """

    def method(self):
        """Method docstring."""
        pass
```

## Common Anti-Patterns to Avoid

```python
# 1. Mutable default arguments
def bad(items=[]):  # shared across calls
    pass

def good(items=None):
    if items is None:
        items = []

# 2. Using == with None
if x == None:  # bad
if x is None:  # good

# 3. Bare except
try:
    pass
except:  # catches everything including KeyboardInterrupt
    pass

# Good
except Exception:
    pass

# 4. Not using context managers
f = open("file.txt")
data = f.read()
f.close()  # might not run if read() raises

# Good
with open("file.txt") as f:
    data = f.read()

# 5. Global variables
count = 0
def increment():
    global count  # avoid
    count += 1

# Good — use a class
class Counter:
    def __init__(self):
        self.count = 0
    def increment(self):
        self.count += 1

# 6. String concatenation in loops
result = ""
for word in words:
    result += word  # O(n²)

# Good
result = "".join(words)  # O(n)

# 7. Checking type instead of duck typing
if type(x) == list:  # bad — doesn't handle subclasses
    pass

if isinstance(x, list):  # better
    pass

# Best — just use it
for item in x:  # works with any iterable
    pass
```
