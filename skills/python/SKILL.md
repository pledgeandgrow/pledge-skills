---
name: python-docs
version: "3.13"
tags:
  - python
  - language
  - scripting
  - backend
  - async
  - typing
  - data
  - scientific
description: |
  Comprehensive Python 3.13 reference covering all language features: variables, built-in types,
  strings, control flow, functions, lambdas, decorators, classes, inheritance, dataclasses, enums,
  metaclasses, collections (list, dict, set, tuple, comprehensions), modules and packages, pip,
  venv, exceptions, context managers, type hints (generics, protocols, TypedDict), async/await,
  asyncio (tasks, streams, synchronization), standard library (os, sys, math, itertools, functools,
  datetime, json, re, pathlib, logging, csv, pickle, threading, multiprocessing, concurrent.futures,
  socket, sqlite3, hashlib, struct, decimal, inspect, gc, weakref, ctypes), testing (pytest, unittest,
  mocking, fixtures, coverage), idiomatic patterns, PEP 8, performance tips, descriptors, GIL, and
  what's new in Python 3.13 (free-threaded CPython, JIT compiler, improved REPL, better error messages).
  Use whenever the user mentions Python, asyncio, dataclasses, type hints, pytest, decorators,
  context managers, generators, or needs help with any Python code, packaging, or library usage.
---

# Python Expert (3.13)

**Official Documentation:** https://docs.python.org/3/

## Quick Reference

| Topic | File |
|-------|------|
| Variables, built-in types, strings, bytes/bytearray/memoryview, control flow, f-strings, pattern matching, keywords, constants, special attributes, dict views, set methods | `basics-syntax.md` |
| Functions, lambda, *args/**kwargs, decorators, generators, closures, scope resolution (LEGB) | `functions-lambdas.md` |
| Classes, inheritance, dataclasses, enums, metaclasses, properties, slots, dunder methods | `classes-objects.md` |
| List, dict, set, tuple, comprehensions, collections module, sequences | `collections.md` |
| Imports, packages, pip, venv, pyproject.toml, packaging, distribution | `modules-packages.md` |
| try/except, custom exceptions, exception groups, context managers, warnings | `exceptions.md` |
| Type hints, generics, protocols, TypedDict, mypy, pyright, narrowing | `typing.md` |
| async/await, asyncio, tasks, streams, synchronization, async generators | `async-asyncio.md` |
| os, sys, math, itertools, functools, datetime, json, re, argparse, random | `stdlib-core.md` |
| File I/O, pathlib, io, csv, pickle, logging, shutil, tempfile | `stdlib-io.md` |
| threading, multiprocessing, concurrent.futures, queue, socket, ssl, http, socketserver, sqlite3, hashlib/hmac, base64, struct, decimal, fractions, statistics, time, inspect, traceback, gc, weakref, types, operator, zipfile/tarfile, configparser, tomllib, ipaddress, urllib, ctypes, email/smtplib/imaplib/poplib, html.parser/entities, xml.etree/dom/sax/expat, string, textwrap, difflib, unicodedata, codecs, numbers, pdb, cProfile, timeit, tracemalloc, faulthandler, atexit, signal, mmap, sched, tkinter, turtle, curses, gettext/locale, copyreg, pkgutil, importlib, contextvars, graphlib, zoneinfo, calendar, pprint, cmath, logging.config/handlers, select/selectors, stat, reprlib, filecmp, fileinput, cmd, readline, rlcompleter, stringprep, netrc, plistlib, mailbox, binascii, quopri, wsgiref, ftplib, http.cookies/cookiejar, xmlrpc, wave, colorsys, bdb, trace, sys.monitoring, code/codeop, modulefinder, zipimport, optparse, _thread, shared_memory, builtins, warnings, os.path, audit events, devmode, IDLE, test, dis, py_compile, compileall, tokenize, tabnanny, symtable, keyword, ast, removed modules (imghdr, sndhdr, crypt, aifc, sunau, chunk, nntplib, telnetlib, uu, xdrlib, cgi, cgitb, distutils, formatter), descriptors, GIL | `stdlib-extended.md` |
| pytest, unittest, mocking, fixtures, coverage, hypothesis, doctest | `testing.md` |
| PEP 8, idioms, patterns, performance, EAFP, duck typing, naming | `idioms-best-practices.md` |
| Python 3.13 features, free-threaded, JIT, REPL, error messages, 3.12/3.11 changes | `whats-new.md` |

## Core Philosophy

Python is a **high-level, dynamically typed, multi-paradigm** programming language. Key principles:

1. **Readability** — clean syntax, significant indentation, "batteries included" stdlib
2. **Dynamic Typing** — types checked at runtime, duck typing, optional static type hints
3. **Multi-paradigm** — OOP, functional, procedural, imperative styles all supported
4. **Interpreted** — no compilation step, interactive REPL, rapid development
5. **Batteries Included** — comprehensive standard library out of the box
6. **Async** — async/await with asyncio for concurrent I/O-bound code
7. **Extensible** — C FFI, C extensions, ctypes, cffi, rich package ecosystem

## Hello World

```python
print("Hello, World!")

# With command-line args
import sys
print(f"Args: {sys.argv}")
```

## Variables

```python
# Dynamic typing — no declaration needed
x = 42          # int
x = "hello"     # now str — variables can change type
x = [1, 2, 3]   # now list

# Multiple assignment
a, b, c = 1, 2, 3

# Swap
a, b = b, a

# Unpacking
first, *rest = [1, 2, 3, 4]  # first=1, rest=[2, 3, 4]
```

## Built-in Types Quick Reference

| Category | Types | Example |
|----------|-------|---------|
| Numbers | `int`, `float`, `complex` | `x = 42` |
| Boolean | `bool` | `flag = True` |
| Text | `str` | `s = "hello"` |
| Sequences | `list`, `tuple`, `range` | `lst = [1, 2, 3]` |
| Sets | `set`, `frozenset` | `s = {1, 2, 3}` |
| Mappings | `dict` | `d = {"key": "value"}` |
| None | `NoneType` | `x = None` |
| Binary | `bytes`, `bytearray` | `b = b"data"` |

## Operators

| Operator | Description |
|----------|-------------|
| `+` `-` `*` `/` `//` `%` `**` | Arithmetic (floor div, modulo, power) |
| `+=` `-=` `*=` `/=` `//=` `%=` `**=` | Augmented assignment |
| `==` `!=` `<` `>` `<=` `>=` | Comparison |
| `and` `or` `not` | Boolean (short-circuit) |
| `in` `not in` | Membership |
| `is` `is not` | Identity |
| `&` `\|` `^` `~` `<<` `>>` | Bitwise |
| `:=` | Walrus operator (assignment expression) |

## Control Flow Quick Reference

```python
# if/elif/else
if x > 0:
    print("positive")
elif x < 0:
    print("negative")
else:
    print("zero")

# Ternary
status = "ok" if x >= 0 else "error"

# for loop
for item in [1, 2, 3]:
    print(item)

for i in range(5):
    print(i)

# while
while condition:
    do_something()

# match (pattern matching, Python 3.10+)
match command:
    case "quit":
        exit()
    case "go" | "move":
        move()
    case _:
        print("unknown")
```

## Functions Quick Reference

```python
# Basic function
def add(a, b):
    return a + b

# Default parameters
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

# *args and **kwargs
def func(*args, **kwargs):
    print(args)    # tuple
    print(kwargs)  # dict

# Lambda
square = lambda x: x * x

# Generator
def count_up(n):
    i = 0
    while i < n:
        yield i
        i += 1
```

## Classes Quick Reference

```python
# Basic class
class Dog:
    def __init__(self, name):
        self.name = name

    def bark(self):
        return f"{self.name} says woof!"

# Dataclass (auto-generates __init__, __repr__, __eq__)
from dataclasses import dataclass

@dataclass
class User:
    id: int
    name: str
    email: str

# Enum
from enum import Enum

class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3
```

## Async Quick Reference

```python
import asyncio

async def fetch_data():
    await asyncio.sleep(1)
    return "data"

async def main():
    result = await fetch_data()
    print(result)

asyncio.run(main())
```

## Installation & Setup

```bash
# Check version
python --version

# Create virtual environment
python -m venv .venv

# Activate (Linux/macOS)
source .venv/bin/activate

# Activate (Windows)
.venv\Scripts\activate

# Install packages
pip install package_name
pip install -r requirements.txt

# Run a script
python script.py

# Interactive REPL (improved in 3.13)
python
```

## Project Creation

```bash
# Simple project
mkdir myproject && cd myproject
python -m venv .venv
source .venv/bin/activate
pip install -e .

# With pyproject.toml (modern)
# Use: uv init, poetry new, or hatch new
uv init myproject
cd myproject
uv sync
