# Basics & Syntax

**Docs:** https://docs.python.org/3/tutorial/introduction.html | https://docs.python.org/3/reference/lexical_analysis.html

## Variables and Assignment

```python
# Dynamic typing — no type declaration needed
x = 42           # int
name = "Alice"   # str
pi = 3.14159     # float
items = [1, 2]   # list

# Multiple assignment
a, b, c = 1, 2, 3

# Swap variables
a, b = b, a

# Chained assignment
x = y = z = 0

# Walrus operator (:=) — assignment expression (3.8+)
if (n := len(data)) > 10:
    print(f"Too long: {n}")

# While with walrus
while (chunk := read_chunk()) is not None:
    process(chunk)
```

## Numbers

```python
# Integers — arbitrary precision
x = 42
big = 10 ** 100  # no overflow

# Underscore separators
million = 1_000_000
binary = 0b_1010_1010
hex_val = 0xFF_FF

# Float (IEEE 754 double)
f = 3.14
inf = float('inf')
nan = float('nan')

# Complex
z = 3 + 4j
z.real   # 3.0
z.imag   # 4.0
abs(z)   # 5.0

# Arithmetic
7 / 2     # 3.5  — true division
7 // 2    # 3    — floor division
7 % 2     # 1    — modulo
2 ** 10   # 1024 — power
divmod(7, 2)  # (3, 1) — quotient and remainder

# Bitwise
5 & 3    # 1   — AND
5 | 3    # 7   — OR
5 ^ 3    # 6   — XOR
~5       # -6  — NOT
5 << 2   # 20  — left shift
5 >> 1   # 2   — right shift

# Boolean is subclass of int
isinstance(True, int)  # True
True + True            # 2
True == 1              # True

# int methods
(42).bit_length()      # 6
int("ff", 16)          # 255
int("0b1010", 2)       # 10
bin(42)                # '0b101010'
hex(255)               # '0xff'
oct(8)                 # '0o10'
```

## Booleans

```python
# Truthy and falsy values
# Falsy: False, None, 0, 0.0, 0j, "", [], {}, (), set(), range(0)
# Truthy: everything else

bool(0)        # False
bool("")       # False
bool([])       # False
bool(None)     # False
bool(1)        # True
bool("text")   # True
bool([0])      # True (non-empty list)

# Short-circuit evaluation
result = x and y   # if x is falsy, returns x; else returns y
result = x or y    # if x is truthy, returns x; else returns y
default = value or "fallback"

# not
not True    # False
not []      # True
```

## Strings

```python
# Single, double, triple quotes
s1 = 'hello'
s2 = "world"
s3 = '''multi
line'''
s4 = """also
multi line"""

# Raw strings — no escape processing
path = r"C:\Users\name"
regex = r"\d+\.\d+"

# Byte strings
b = b"data"
b[0]  # 100 (int, not char)

# f-strings (formatted string literals)
name = "Alice"
age = 30
f"Hello, {name}! You are {age}."  # "Hello, Alice! You are 30."

# f-string expressions
f"{2 + 3}"           # "5"
f"{name.upper()}"    # "ALICE"
f"{age:>5}"          # "   30" (right-align, width 5)
f"{age:05d}"         # "00030" (zero-padded)
f"{3.14159:.2f}"     # "3.14" (2 decimal places)
f"{1000000:,}"       # "1,000,000" (thousands separator)
f"{0.15:.1%}"        # "15.0%" (percentage)
f"{255:#x}"          # "0xff" (hex with prefix)
f"{42:b}"            # "101010" (binary)
f"{name!r}"          # "'Alice'" (repr)
f"{name!s}"          # "Alice" (str, default)

# Nested f-strings (3.12+)
width = 10
f"{name:{width}}"    # "Alice     "

# f-string with = (debug format, 3.8+)
x = 42
f"{x=}"              # "x=42"
f"{x = }"            # "x = 42"

# String methods
"hello".upper()              # "HELLO"
"HELLO".lower()              # "hello"
"Hello World".title()        # "Hello World"
"hello".capitalize()         # "Hello"
"  hi  ".strip()             # "hi"
"  hi  ".lstrip()            # "hi  "
"  hi  ".rstrip()            # "  hi"
"hello world".split()        # ["hello", "world"]
"a,b,c".split(",")           # ["a", "b", "c"]
",".join(["a", "b", "c"])    # "a,b,c"
"hello".replace("l", "L")    # "heLLo"
"hello".startswith("he")     # True
"hello".endswith("lo")       # True
"hello".find("l")            # 2 (index or -1)
"hello".index("l")           # 2 (raises ValueError if not found)
"hello".count("l")           # 2
"hello"[1:4]                 # "ell" (slicing)
"hello"[::-1]                # "olleh" (reverse)
"hello".zfill(8)             # "000hello"
"42".rjust(5, "0")           # "00042"
"42".ljust(5, "-")           # "42---"
"hello".encode("utf-8")      # b'hello'
b"hello".decode("utf-8")     # "hello"

# String formatting alternatives
"{} {}".format("hello", "world")           # "hello world"
"{1} {0}".format("world", "hello")         # "hello world"
"{name} is {age}".format(name="Alice", age=30)  # "Alice is 30"
"%s is %d" % ("Alice", 30)                 # "Alice is 30" (old style)

# String checking
"abc".isalpha()     # True
"123".isdigit()     # True
"abc123".isalnum()  # True
"hello".islower()   # True
"HELLO".isupper()   # True
"   ".isspace()     # True
```

## Binary Types — bytes, bytearray, memoryview

```python
# bytes — immutable binary sequence
b = b"hello"
b = bytes([104, 101, 108, 108, 111])  # from iterable of ints
b = bytes("hello", "utf-8")            # from string with encoding
b = "hello".encode("utf-8")            # same thing

# Indexing returns int (not bytes)
b[0]  # 104 (ASCII code for 'h')
b[0:3]  # b'hel' (slicing returns bytes)

# Methods
b.upper()        # b'HELLO'
b.lower()        # b'hello'
b.split(b",")    # [b'a', b'b']
b.strip()        # b'hello'
b.replace(b"l", b"L")  # b'heLLo'
b.decode("utf-8")  # "hello" — convert to str
b.hex()          # "68656c6c6f"
b.find(b"ell")   # 1
b.count(b"l")    # 2
b.startswith(b"he")  # True

# Class methods
bytes.fromhex("68656c6c6f")  # b"hello"
bytes.fromhex("68 65 6c 6c 6f")  # spaces allowed

# bytearray — mutable binary sequence
ba = bytearray(b"hello")
ba[0] = 72  # modify in place
ba.append(33)  # append byte
ba.extend(b"!!")
ba.insert(0, 62)
ba.remove(72)
ba.pop()
ba.reverse()
ba.clear()
del ba[0:2]
ba.decode("utf-8")  # convert to str

# memoryview — view into bytes/bytearray without copying
mv = memoryview(b"hello world")
mv[0]  # 104
mv[0:5]  # <memory at ...> — cast to bytes
mv[0:5].tobytes()  # b"hello"
mv[0:5].tolist()   # [104, 101, 108, 108, 111]
mv[6:11].tobytes()  # b"world"

# memoryview of bytearray is mutable
ba = bytearray(b"hello")
mv = memoryview(ba)
mv[0] = 72  # modifies ba in place

# Cast memoryview to different format
mv = memoryview(b"\x01\x02\x03\x04")
mv.cast("H")  # interpret as unsigned shorts
mv.cast("H").tolist()  # [513, 1027] (depends on endianness)

# Format chars: 'B' (uint8), 'b' (int8), 'H' (uint16), 'h' (int16),
# 'I' (uint32), 'i' (int32), 'f' (float), 'd' (double)

# Slicing memoryview creates another memoryview (zero-copy)
# nbytes property
mv.nbytes  # number of bytes after casting
mv.readonly  # True if underlying object is immutable
mv.contiguous  # True if memory is contiguous
mv.format  # 'B' for bytes, 'H' after cast, etc.
mv.itemsize  # 1 for bytes, 2 for 'H', etc.
mv.ndim  # number of dimensions
mv.shape  # tuple of dimensions
mv.strides  # tuple of strides

# Release memoryview resources
mv.release()  # release underlying buffer (3.12+ improves this)

# Buffer protocol — __buffer__ (3.12+ PEP 688)
# Custom classes can implement the buffer protocol
class MyBuffer:
    def __init__(self, data):
        self._data = bytearray(data)

    def __buffer__(self, flags):
        return memoryview(self._data)

# Objects implementing __buffer__ can be used with memoryview
buf = MyBuffer(b"hello")
mv = memoryview(buf)  # works with __buffer__
mv.tobytes()  # b"hello"

# bytearray also has fromhex
bytearray.fromhex("68656c6c6f")  # bytearray(b"hello")
```

## None

```python
x = None
x is None      # True (always use 'is' not '==')
x is not None  # False

# None is falsy
bool(None)  # False

# Default argument sentinel
def func(value=None):
    if value is None:
        value = []
```

## Control Flow

### if / elif / else

```python
if x > 0:
    print("positive")
elif x < 0:
    print("negative")
else:
    print("zero")

# Conditional expression (ternary)
status = "ok" if x >= 0 else "error"

# Nested ternary
grade = "A" if score >= 90 else "B" if score >= 80 else "C"
```

### for Loops

```python
# Iterate over any iterable
for item in [1, 2, 3]:
    print(item)

for char in "hello":
    print(char)

for key in {"a": 1, "b": 2}:
    print(key)

# range(start, stop, step)
for i in range(5):        # 0, 1, 2, 3, 4
for i in range(2, 8):     # 2, 3, 4, 5, 6, 7
for i in range(0, 10, 2): # 0, 2, 4, 6, 8
for i in range(10, 0, -1):# 10, 9, 8, ..., 1

# enumerate — index + value
for i, item in enumerate(["a", "b", "c"]):
    print(f"{i}: {item}")

# zip — iterate multiple iterables in parallel
for a, b in zip([1, 2, 3], ["a", "b", "c"]):
    print(a, b)

# zip_strict (3.10+) — raises if lengths differ
for a, b in zip([1, 2], ["a", "b", "c"], strict=True):
    pass  # ValueError

# break and continue
for i in range(10):
    if i == 3:
        continue  # skip
    if i == 7:
        break     # exit loop
    print(i)

# for-else (else runs if no break)
for item in items:
    if item == target:
        print("found")
        break
else:
    print("not found")
```

### while Loops

```python
while condition:
    do_something()

# while-else
while n > 0:
    n -= 1
else:
    print("done")

# With walrus
while (line := file.readline()) != "":
    process(line)
```

### match (Pattern Matching, 3.10+)

```python
# Basic match
match command:
    case "quit":
        exit()
    case "go" | "move":  # OR pattern
        move()
    case _:
        print("unknown")

# Match with values
match point:
    case (0, 0):
        print("origin")
    case (0, y):
        print(f"y-axis: {y}")
    case (x, 0):
        print(f"x-axis: {x}")
    case (x, y):
        print(f"point: ({x}, {y})")

# Match with classes
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

match p:
    case Point(x=0, y=0):
        print("origin")
    case Point(x=x, y=y):
        print(f"({x}, {y})")

# Match with guards
match n:
    case n if n < 0:
        print("negative")
    case 0:
        print("zero")
    case n if n > 0:
        print("positive")

# Match with mapping patterns
match config:
    case {"host": str(host), "port": int(port)}:
        connect(host, port)
    case {"url": str(url)}:
        connect_url(url)

# Match with sequence patterns
match data:
    case [first, *rest]:
        print(f"first={first}, rest={rest}")
    case []:
        print("empty")
    case [*_, last]:
        print(f"last={last}")
```

### pass, break, continue

```python
# pass — no-op placeholder
class Empty:
    pass

def todo():
    pass

# break — exit nearest loop
for i in range(10):
    if i == 5:
        break

# continue — skip to next iteration
for i in range(10):
    if i % 2 == 0:
        continue
    print(i)  # 1, 3, 5, 7, 9
```

### del Statement

```python
# Delete variable
x = 42
del x  # name 'x' is no longer defined

# Delete list item
items = [1, 2, 3, 4]
del items[1]      # [1, 3, 4]
del items[0:2]    # [4]

# Delete dict key
d = {"a": 1, "b": 2}
del d["a"]  # {"b": 2}

# Delete attribute
class Obj:
    pass
obj = Obj()
obj.x = 10
del obj.x  # removes attribute

# Delete slice (custom __delitem__)
del obj[0:5]
```

### Chained Comparisons

```python
# Python allows chaining comparison operators
x = 5
0 < x < 10       # True — equivalent to (0 < x) and (x < 10)
0 < x <= 5       # True
10 > x > 0       # True
1 == 1 == 1      # True
"a" < "b" < "c"  # True

# Each operand evaluated only once
# Short-circuits on first False
0 < f() < 10  # f() called once

# Common pattern: range check
if 0 <= value < 100:
    print("in range")

# Not equivalent to math notation:
# 0 < x < 10  is NOT  (0 < x) < 10
```

### Extended (Star) Unpacking

```python
# Star in assignment — capture remaining items
first, *rest = [1, 2, 3, 4, 5]
# first=1, rest=[2, 3, 4, 5]

*init, last = [1, 2, 3, 4, 5]
# init=[1, 2, 3, 4], last=5

first, *middle, last = [1, 2, 3, 4, 5]
# first=1, middle=[2, 3, 4], last=5

# Works with any iterable
a, *b, c = "hello"
# a='h', b=['e','l','l'], c='o'

# Star in function call — unpack iterable as positional args
args = [3, 5]
result = range(*args)  # range(3, 5)

# Double star — unpack dict as keyword args
kwargs = {"host": "localhost", "port": 8080}
connect(**kwargs)  # connect(host="localhost", port=8080)

# Combining
def func(a, b, c, d):
    pass
args = [1, 2]
kwargs = {"c": 3, "d": 4}
func(*args, **kwargs)  # func(1, 2, c=3, d=4)

# Star in list/tuple/set literals
a = [1, 2]
b = [3, 4]
merged = [*a, *b]  # [1, 2, 3, 4]

# Double star in dict literals
d1 = {"a": 1}
d2 = {"b": 2}
merged = {**d1, **d2}  # {"a": 1, "b": 2}

# Star in for loop
pairs = [(1, "a"), (2, "b")]
for num, *rest in pairs:
    pass  # rest is always [] here

# Unpacking in return
def minmax(items):
    return min(items), max(items)  # returns tuple
low, high = minmax([3, 1, 4, 1, 5])
```

### Augmented Assignment

```python
# All augmented assignment operators:
x += 1    # x = x + 1
x -= 1    # x = x - 1
x *= 2    # x = x * 2
x /= 2    # x = x / 2
x //= 2   # x = x // 2 (floor division)
x %= 3    # x = x % 3 (modulo)
x **= 2   # x = x ** 2 (power)
x @= B    # x = x @ B (matrix multiply, 3.5+)

# Bitwise
x &= 0xFF  # x = x & 0xFF
x |= 0x10  # x = x | 0x10
x ^= 0xFF  # x = x ^ 0xFF
x <<= 4   # x = x << 4
x >>= 4   # x = x >> 4

# In-place for mutable objects
lst = [1, 2, 3]
lst += [4, 5]     # extends in place (same object)
lst = lst + [4, 5]  # creates new list

# Works with any type that supports the operator
from collections import Counter
c = Counter()
c += Counter("hello")  # Counter({'l': 2, 'h': 1, 'e': 1, 'o': 1})
```

### match Statement — Additional Patterns

```python
# **rest in mapping patterns
match config:
    case {"host": str(h), **rest}:
        print(f"host={h}, extra={rest}")

# Match with literal patterns
match status:
    case 200 | 201 | 202:
        print("success")
    case 400 | 404:
        print("client error")
    case 500 | 502 | 503:
        print("server error")

# Match with capture and wildcard
match data:
    case [1, 2, *rest] if len(rest) > 2:
        print("long tail")
    case [first, *_]:
        print(f"starts with {first}")

# Match with enum
from enum import Enum
class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3

match c:
    case Color.RED:
        print("red")
    case Color.GREEN | Color.BLUE:
        print("not red")

# Nested patterns
match event:
    case {"type": "click", "target": ("button", name)}:
        print(f"clicked {name}")
    case {"type": "key", "key": str(k), "mods": [*mods]}:
        print(f"key {k} with {mods}")

# Irrefutable pattern (always matches)
match value:
    case [x]:
        print(f"single: {x}")
    case _:  # wildcard — always matches
        print("anything")
```

## Type Conversion

```python
# Explicit conversion
int("42")       # 42
int(3.9)        # 3 (truncates)
float("3.14")   # 3.14
float(42)       # 42.0
str(42)         # "42"
bool(1)         # True
list("abc")     # ['a', 'b', 'c']
list((1, 2))    # [1, 2]
tuple([1, 2])   # (1, 2)
set([1, 1, 2])  # {1, 2}
dict([("a", 1)])  # {"a": 1}
chr(65)         # 'A'
ord('A')        # 65
hex(255)        # '0xff'
oct(8)          # '0o10'
bin(42)         # '0b101010'
```

## Built-in Functions Reference

```python
# Common builtins
len([1, 2, 3])        # 3
type(42)              # <class 'int'>
isinstance(42, int)   # True
issubclass(bool, int) # True
id(42)                # memory address (int)
hash("hello")         # hash value (int)
repr("hello")         # "'hello'"
str(42)               # "42"
dir(obj)              # list of attributes
vars(obj)             # __dict__
globals()             # global namespace dict
locals()              # local namespace dict

# Iteration
iter([1, 2, 3])       # iterator object
next(it)              # next value
next(it, default)     # next or default

# Functional
map(str, [1, 2, 3])        # iterator: "1", "2", "3"
filter(None, [0, 1, 2])    # iterator: 1, 2
sorted([3, 1, 2])          # [1, 2, 3]
sorted(items, key=lambda x: x.name)
sorted(items, reverse=True)
reversed([1, 2, 3])        # iterator: 3, 2, 1
enumerate(["a", "b"])      # iterator: (0, "a"), (1, "b")
zip([1, 2], ["a", "b"])    # iterator: (1, "a"), (2, "b")
any([False, True, False])  # True
all([True, True, False])   # False
sum([1, 2, 3])             # 6
sum([[1], [2]], [])        # [1, 2] (not recommended, use itertools.chain)
min([3, 1, 2])             # 1
max([3, 1, 2])             # 3
abs(-5)                    # 5
round(3.14159, 2)          # 3.14
pow(2, 10)                 # 1024
pow(2, 10, 100)            # 24 (modular exponentiation)
divmod(7, 2)               # (3, 1)

# Input/output
print("hello", end="\n")
print("a", "b", sep=", ")
input("prompt: ")

# Attribute access
getattr(obj, "attr", default)
setattr(obj, "attr", value)
hasattr(obj, "attr")
delattr(obj, "attr")

# Callable
callable(func)  # True
```

## Comments and Docstrings

```python
# Single-line comment

# Multi-line comments use multiple # lines
# There are no block comments in Python

"""Triple-quoted strings can be used as docstrings."""

def function():
    """One-line docstring."""
    pass

def complex_function(param):
    """Multi-line docstring.

    Detailed description here.

    Args:
        param: Description of parameter.

    Returns:
        Description of return value.

    Raises:
        ValueError: When param is invalid.
    """
    pass

# Module docstring (at top of file)
"""This module provides utilities for data processing."""
```

## Indentation and Code Blocks

```python
# Python uses indentation (not braces) for code blocks
# 4 spaces per level (PEP 8)
# Must be consistent within a block

if x > 0:
    print("positive")    # 4 spaces
    if x > 100:
        print("large")   # 8 spaces

# Tabs vs spaces: don't mix — use spaces (PEP 8)
# Python 3 disallows mixing tabs and spaces
```

## Keywords (Full List)

```python
# Python 3.13 keywords (35 total):
import keyword
keyword.kwlist
# ['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await',
#  'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except',
#  'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is',
#  'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try',
#  'while', 'with', 'yield']

# Soft keywords (contextual, can be used as names):
# match, case, type, _ (in pattern matching and type statement)

keyword.iskeyword("class")  # True
keyword.issoftkeyword("type")  # True (3.12+)
```

## Built-in Constants

```python
# Boolean constants
True; False

# None
None

# Ellipsis — used in slicing and type hints
...
Ellipsis  # same as ...

# NotImplemented — returned by comparison methods when not supported
NotImplemented

# __debug__ — True unless running with -O flag
__debug__  # True

# Constants added by site module
quit; exit; copyright; credits; license
```

## Special Attributes

```python
# Object attributes
obj.__class__      # class of object
obj.__dict__       # instance attribute dict
obj.__doc__        # docstring
obj.__module__     # module where class is defined

# Class attributes
cls.__name__       # class name
cls.__qualname__   # qualified name (e.g., "Outer.Inner")
cls.__bases__      # tuple of base classes
cls.__mro__        # method resolution order
cls.__subclasses__()  # list of direct subclasses
cls.__dict__       # class namespace

# Module attributes
mod.__name__       # module name
mod.__file__       # file path
mod.__path__       # package path (for packages)
mod.__package__    # parent package
mod.__spec__       # import spec
mod.__loader__     # loader object
mod.__builtins__   # builtins namespace

# Function attributes
func.__name__      # function name
func.__qualname__  # qualified name
func.__code__      # code object
func.__defaults__  # default argument values
func.__kwdefaults__  # keyword-only defaults
func.__annotations__  # type annotations
func.__globals__   # global namespace
func.__closure__   # closure variables (cells)
func.__module__    # module name

# Code object attributes
code = func.__code__
code.co_argcount       # number of positional args
code.co_kwonlyargcount  # keyword-only args
code.co_varnames       # local variable names
code.co_consts         # constants used
code.co_names          # non-local names
code.co_filename       # source filename
code.co_firstlineno    # first line number
code.co_freevars       # free variable names
code.co_cellvars       # cell variable names

# Python 3.13+ class attributes
cls.__firstlineno__      # first line number of class definition
cls.__static_attributes__  # tuple of static attribute names (3.13+)

# Generator/coroutine attributes
gen.__name__        # generator name
gen.__qualname__    # qualified name
gen.gi_frame        # current frame (None if exhausted)
gen.gi_code         # code object
gen.gi_yieldfrom    # object being yielded from (or None)

# Async generator attributes
agen.ag_await       # object being awaited (or None)
agen.ag_frame       # current frame
agen.ag_code        # code object
```

## Dict Views

```python
d = {"a": 1, "b": 2, "c": 3}

# View objects — dynamic views of dict entries
d.keys()   # dict_keys(['a', 'b', 'c'])
d.values() # dict_values([1, 2, 3])
d.items()  # dict_items([('a', 1), ('b', 2), ('c', 3)])

# Views are dynamic — reflect dict changes
keys = d.keys()
d["d"] = 4
list(keys)  # ['a', 'b', 'c', 'd'] — updated automatically

# Set-like operations on keys and items
d.keys() & {"a", "b", "e"}  # {'a', 'b'}
d.keys() | {"e", "f"}        # {'a', 'b', 'c', 'd', 'e', 'f'}
d.keys() - {"a"}             # {'b', 'c', 'd'}
d.items() & {"a": 1}.items() # {('a', 1)}

# Reversed (3.8+)
list(reversed(d))         # ['c', 'b', 'a']
list(reversed(d.keys()))  # ['c', 'b', 'a']
list(reversed(d.values()))
list(reversed(d.items()))

# Bitwise OR for dict merging (3.9+)
merged = {"a": 1} | {"b": 2}  # {'a': 1, 'b': 2}
d |= {"e": 5}  # in-place update
```

## Set and Frozenset Methods (Complete)

```python
s = {1, 2, 3}
fs = frozenset({1, 2, 3})

# Basic operations
s.add(4)           # add element
s.discard(4)       # remove if present (no error if absent)
s.remove(4)        # remove (KeyError if absent)
s.pop()            # remove and return arbitrary element
s.clear()          # empty the set
s.update({4, 5})   # add multiple
s.intersection_update({1, 2})  # &=
s.difference_update({1})       # -=
s.symmetric_difference_update({1, 6})  # ^=

# Set operations (return new set)
s.union({4, 5})                    # |
s.intersection({2, 3, 4})         # &
s.difference({2})                  # -
s.symmetric_difference({2, 4})    # ^

# Predicates
s.isdisjoint({4, 5})  # True if no common elements
s.issubset({1, 2, 3, 4})  # <=
s.issuperset({1, 2})       # >=
s < {1, 2, 3, 4}  # proper subset
s > {1}           # proper superset

# frozenset is immutable — no add/remove/discard/etc.
# frozenset is hashable — can be a dict key or set element
{frozenset({1, 2}), frozenset({3, 4})}  # valid
```
