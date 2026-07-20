# What's New in Python

**Docs:** https://docs.python.org/3.13/whatsnew/3.13.html | https://docs.python.org/3.12/whatsnew/3.12.html | https://docs.python.org/3.11/whatsnew/3.11.html

## Python 3.13 (October 2024)

### Key Features

```python
# 1. Better Interactive Interpreter (REPL)
# - Multi-line editing with color
# - Command history persistence
# - F1 for help, F2 for history, F3 for paste mode
# - Exit/quit commands work without quotes

# 2. Improved Error Messages
# - Better suggestions for attribute errors
# - More precise error locations in tracebacks
# - Did you mean: ... suggestions

# 3. Free-Threaded CPython (PEP 703)
# - Experimental no-GIL build
# - True parallelism for threading
# - Install: python3.13t (separate build)
# - Not all C extensions work yet

# 4. Experimental JIT Compiler (PEP 744)
# - Copy-and-patch JIT for hot code
# - Enabled via: PYTHON_JIT=1
# - Speeds up certain workloads

# 5. locals() mutation semantics defined
# - In functions, modifying locals() now has defined behavior
# - Changes to locals() are reflected in subsequent reads

# 6. Mobile Platform Support (PEP 730)
# - iOS and Android as supported platforms
# - Experimental

# 7. Deferred Evaluation of Annotations (PEP 649)
# - __annotations__ computed lazily
# - No more need for `from __future__ import annotations`
# - Forward references work without quotes in most cases

# 8. New typing features
from typing import TypeVar, ParamSpec, TypeAliasTuple

# PEP 695 syntax (from 3.12) now more widely usable
class Stack[T]:
    def push(self, item: T) -> None: ...

def first[T](items: list[T]) -> T:
    return items[0]

# 9. Improved modules
# - argparse: deprecated features removed
# - asyncio: performance improvements
# - pathlib: Path.full_match() for glob patterns
# - random: improved performance
# - typing: TypeIs for type narrowing
```

### TypeIs (3.13+)

```python
from typing import TypeIs

def is_str_list(val: list[object]) -> TypeIs[list[str]]:
    return all(isinstance(x, str) for x in val)

def process(items: list[object]) -> None:
    if is_str_list(items):
        # items is now narrowed to list[str]
        for s in items:
            print(s.upper())  # type checker knows s is str
```

### Path.full_match (3.13+)

```python
from pathlib import Path

p = Path("src/main.py")
p.full_match("src/*.py")  # True — full path glob match
p.full_match("src/**/*.py")  # True
```

### Python 3.13 Module Changes

```python
# Removed "dead batteries" (PEP 594)
# These modules are no longer in stdlib:
# aifc, audioop, cgi, cgitb, chunk, crypt, imghdr,
# mailcap, msilib, nis, nntplib, ossaudiodev, pipes,
# sndhdr, spwd, sunau, telnetlib, uu, xdrlib

# Use third-party alternatives:
# cgi -> starlette/fastapi
# imghdr -> puremagic or filetype
# crypt -> bcrypt or passlib
# telnetlib -> telnetlib3 or exscript

# Improved modules
import argparse  # better error messages
import asyncio   # TaskGroup improvements, better timeouts
import copy      # performance improvements
import itertools # batched() added in 3.12
import os        # os.path.isfullpath() (3.13)
import pathlib   # Path.full_match(), improvements
import random    # performance improvements
import sqlite3   # improvements
import typing    # TypeIs, ReadOnly, NoDefault
```

## Python 3.12 (October 2023)

### PEP 695 — Type Parameter Syntax

```python
# New generic syntax — no more TypeVar boilerplate
# Old (still works)
from typing import TypeVar, Generic
T = TypeVar("T")
class Stack(Generic[T]): ...
def first(items: list[T]) -> T: ...

# New (3.12+)
class Stack[T]:
    def push(self, item: T) -> None: ...

def first[T](items: list[T]) -> T:
    return items[0]

# TypeVar with bounds
class Comparable[T: (int, float)]:
    def compare(self, other: T) -> bool: ...

# TypeVar with constraints
def concat[T: (str, bytes)](a: T, b: T) -> T:
    return a + b

# Variadic generics
class Array[*Shape]:
    shape: tuple[*Shape]

# TypeAliasType — recursive type aliases
type Json = dict[str, Json] | list[Json] | str | int | float | bool | None
```

### PEP 701 — f-string Formalization

```python
# f-strings can now contain any valid expression
# Including quotes that match the f-string delimiter

# Nested quotes (same type)
f"{"hello"}"  # OK in 3.12+
f'{'hello'}'  # OK in 3.12+

# Multi-line expressions
f"""{
    result := compute()
}"""  # OK in 3.12+

# Backslashes in f-strings
f"{r'\n'.join(lines)}"  # OK in 3.12+

# Nested f-strings
f"{f"{f"{x}"}"}"  # OK in 3.12+

# Comments in multi-line f-strings
f"""{  # comment
    value
}"""  # OK in 3.12+
```

### PEP 709 — Comprehension Inlining

```python
# Comprehensions are now inlined for performance
# [x for x in items] — no longer creates a separate function
# This means:
# - Faster execution
# - No separate scope (but behavior unchanged)
# - [y := f(x) for x in items] works as expected
```

### PEP 688 — Buffer Protocol

```python
# buffer protocol accessible from Python
# __buffer__ and __release_buffer__ methods
# memoryview improvements
```

### Python 3.12 Other Changes

```python
# Per-interpreter GIL (PEP 684)
# Each sub-interpreter has its own GIL
# Enables true parallelism with sub-interpreters

# Low-impact monitoring (PEP 669)
import sys
# sys.monitoring — tool for profilers/debuggers

# Override decorator (PEP 698)
from typing import override

class Base:
    def method(self) -> None: ...

class Derived(Base):
    @override
    def method(self) -> None:  # type checker verifies override
        ...

# TypedDict for **kwargs (PEP 692)
from typing import TypedDict, Unpack

class Options(TypedDict):
    timeout: int
    retries: int

def configure(**kwargs: Unpack[Options]) -> None:
    pass
```

## Python 3.11 (October 2022)

### Exception Groups and except* (PEP 654)

```python
# ExceptionGroup
try:
    raise ExceptionGroup("Multiple", [
        ValueError("v"),
        TypeError("t"),
    ])
except* ValueError:
    print("handled ValueError")
except* TypeError:
    print("handled TypeError")

# Reraise unhandled
try:
    raise ExceptionGroup("Errors", [
        ValueError("v"),
        KeyError("k"),
    ])
except* ValueError:
    print("handled ValueError")
# KeyError re-raised as ExceptionGroup
```

### Fine-Grained Error Locations (PEP 657)

```python
# Tracebacks now show exact column positions
# File "example.py", line 5
#     x = some_function(arg1, arg2, arg3)
#                              ^^^^^
# NameError: name 'arg1' is not defined
# The ^^^^ points to the exact token
```

### Exception Notes (PEP 678)

```python
try:
    raise ValueError("Invalid input")
except ValueError as e:
    e.add_note("The input must be a positive integer")
    e.add_note(f"Received: {input_value!r}")
    raise
# Traceback shows:
# ValueError: Invalid input
# The input must be a positive integer
# Received: 'abc'
```

### Faster CPython

```python
# Python 3.11 is 10-60% faster than 3.10
# Key optimizations:
# - Specializing adaptive interpreter (PEP 659)
# - Inlined Python function calls
# - Cheaper, lazy Python frames
# - Faster startup (frozen imports)
# - Zero-overhead exceptions
```

### New Type Features (3.11)

```python
from typing import (
    Self, LiteralString, AssertType, reveal_type,
    Never, Required, NotRequired, Unpack,
)

# Self type
class Builder:
    def set_name(self, name: str) -> Self:
        self.name = name
        return self

# LiteralString
def execute(query: LiteralString) -> None: ...

# Variadic generics (PEP 646)
class Array[*Shape]: ...

# Required/NotRequired in TypedDict
class Config(TypedDict):
    host: Required[str]
    port: NotRequired[int]
```

## Python 3.10 (October 2021)

```python
# Structural pattern matching (PEP 634)
match command:
    case "quit":
        exit()
    case _:
        print("unknown")

# Union types with | (PEP 604)
def func(x: int | str | None) -> None: ...

# TypeAlias (PEP 613)
from typing import TypeAlias
Vector: TypeAlias = list[float]

# Parameter specification (PEP 612)
from typing import ParamSpec
P = ParamSpec("P")
def decorator(f: Callable[P, int]) -> Callable[P, int]:
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> int:
        return f(*args, **kwargs)
    return wrapper

# Parenthesized context managers
with (
    open("a") as fa,
    open("b") as fb,
):
    pass

# zip(strict=True)
list(zip([1, 2], [3], strict=True))  # ValueError
```

## Python 3.9 (October 2020)

```python
# Lowercase generics (PEP 585)
list[int]       # instead of List[int]
dict[str, int]  # instead of Dict[str, int]
set[str]        # instead of Set[str]
tuple[int, str] # instead of Tuple[int, str]

# Dict union operators
merged = {"a": 1} | {"b": 2}
d = {"a": 1}
d |= {"b": 2}

# str.removeprefix / removesuffix
"hello world".removeprefix("hello ")  # "world"
"file.txt".removesuffix(".txt")       # "file"

# zoneinfo (PEP 615)
from zoneinfo import ZoneInfo
dt = datetime(2025, 1, 1, tzinfo=ZoneInfo("America/New_York"))

# math.lcm
math.lcm(4, 6)  # 12

# graphlib.TopologicalSorter
from graphlib import TopologicalSorter
ts = TopologicalSorter({"a": {"b"}, "b": {"c"}, "c": set()})
list(ts.static_order())  # ['c', 'b', 'a']
```

## Migration Guide

```python
# 3.8 -> 3.9: Use lowercase generics, dict union, removeprefix/removesuffix
# 3.9 -> 3.10: Use match/case, | union types, parenthesized with
# 3.10 -> 3.11: Use ExceptionGroup, Self type, Required/NotRequired
# 3.11 -> 3.12: Use PEP 695 generics, f-string improvements, @override
# 3.12 -> 3.13: Use TypeIs, Path.full_match, lazy annotations

# Deprecated/removed:
# 3.9: distutils removed (use packaging/setuptools)
# 3.10: asyncore/asynchat removed (use asyncio)
# 3.12: imp removed (use importlib), asynchat/asyncore/smtpd removed
# 3.13: "dead batteries" removed (cgi, imghdr, telnetlib, etc.)
```
