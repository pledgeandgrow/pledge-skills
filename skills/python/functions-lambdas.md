# Functions & Lambdas

**Docs:** https://docs.python.org/3/tutorial/controlflow.html#defining-functions | https://docs.python.org/3/reference/compound_stmts.html#function

## Function Definition

```python
# Basic function
def add(a, b):
    return a + b

# No return value (returns None)
def greet(name):
    print(f"Hello, {name}")

result = greet("Alice")  # None

# Return multiple values (tuple)
def min_max(numbers):
    return min(numbers), max(numbers)

low, high = min_max([3, 1, 4, 1, 5])
```

## Parameters

```python
# Positional parameters
def func(a, b, c):
    return a + b + c

func(1, 2, 3)  # positional

# Keyword arguments
func(a=1, b=2, c=3)
func(1, c=3, b=2)  # mixed

# Default values
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}"

greet("Alice")              # "Hello, Alice"
greet("Bob", greeting="Hi") # "Hi, Bob"

# Mutable default argument trap
def bad(items=[]):  # DANGER: shared across calls
    items.append(1)
    return items

bad()  # [1]
bad()  # [1, 1] — not a fresh list each call!

# Correct pattern
def good(items=None):
    if items is None:
        items = []
    items.append(1)
    return items

# Keyword-only arguments (after *)
def func(a, b, *, key, value=None):
    return f"{a}, {b}, {key}, {value}"

func(1, 2, key="k")           # OK
func(1, 2, key="k", value=5)  # OK
# func(1, 2, "k")             # TypeError — key is keyword-only

# Positional-only arguments (before /, 3.8+)
def func(a, b, /, c, d):
    return a + b + c + d

func(1, 2, 3, 4)        # OK
func(1, 2, c=3, d=4)    # OK
# func(a=1, b=2, c=3, d=4)  # TypeError — a, b are positional-only

# Combined: positional-only, regular, keyword-only
def func(a, b, /, c, *, d, e):
    return a + b + c + d + e

func(1, 2, 3, d=4, e=5)  # OK
```

## *args and **kwargs

```python
# *args — variable positional arguments (tuple)
def sum_all(*args):
    return sum(args)

sum_all(1, 2, 3)       # 6
sum_all()              # 0

# **kwargs — variable keyword arguments (dict)
def print_kwargs(**kwargs):
    for key, value in kwargs.items():
        print(f"{key} = {value}")

print_kwargs(a=1, b=2)  # a = 1, b = 2

# Combined
def func(*args, **kwargs):
    print(f"args: {args}")
    print(f"kwargs: {kwargs}")

func(1, 2, x=10, y=20)
# args: (1, 2)
# kwargs: {'x': 10, 'y': 20}

# Full signature
def func(a, b, *args, key="default", **kwargs):
    pass

# Unpacking arguments
def add(a, b, c):
    return a + b + c

args = [1, 2, 3]
add(*args)  # unpack list as positional args

kwargs = {"a": 1, "b": 2, "c": 3}
add(**kwargs)  # unpack dict as keyword args

# Unpacking in calls
add(*[1, 2], c=3)  # OK
add(1, *[2], c=3)  # OK
```

## Lambda Expressions

```python
# Anonymous function — single expression
square = lambda x: x * x
square(5)  # 25

# Multiple parameters
add = lambda a, b: a + b
add(3, 4)  # 7

# With default values
greet = lambda name, greeting="Hello": f"{greeting}, {name}"
greet("Alice")  # "Hello, Alice"

# Used inline
sorted([3, 1, 2], key=lambda x: -x)         # [3, 2, 1]
sorted(users, key=lambda u: u.age)
map(lambda x: x * 2, [1, 2, 3])             # [2, 4, 6]
filter(lambda x: x > 0, [-1, 0, 1, 2])     # [1, 2]

# Immediately invoked lambda (IIFE)
result = (lambda x: x * 2)(21)  # 42

# Conditional in lambda
classify = lambda x: "positive" if x > 0 else "non-positive"
```

## Decorators

```python
# Basic decorator
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print("Before function call")
        result = func(*args, **kwargs)
        print("After function call")
        return result
    return wrapper

@my_decorator
def say_hello(name):
    print(f"Hello, {name}")

say_hello("Alice")
# Before function call
# Hello, Alice
# After function call

# functools.wraps — preserve metadata
from functools import wraps

def my_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

# Decorator with arguments
def repeat(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def greet(name):
    print(f"Hello, {name}")

greet("Alice")  # prints 3 times

# Class decorator
class CountCalls:
    def __init__(self, func):
        self.func = func
        self.count = 0
        wraps(func)(self)

    def __call__(self, *args, **kwargs):
        self.count += 1
        return self.func(*args, **kwargs)

@CountCalls
def say_hi():
    print("Hi!")

say_hi()
say_hi()
say_hi.count  # 2

# Stacking decorators (applied bottom-up)
@decorator_a
@decorator_b
def func():
    pass
# Equivalent to: func = decorator_a(decorator_b(func))

# Common built-in decorators
from functools import lru_cache, cache, partial, singledispatch

# @lru_cache — memoization
@lru_cache(maxsize=128)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# @cache — unbounded cache (3.9+)
@cache
def expensive(x):
    return compute(x)

# @singledispatch — function overloading by type
@singledispatch
def process(data):
    raise TypeError(f"Unsupported type: {type(data)}")

@process.register
def _(data: int):
    return f"Integer: {data}"

@process.register
def _(data: str):
    return f"String: {data}"

@process.register
def _(data: list):
    return f"List of {len(data)} items"

process(42)      # "Integer: 42"
process("hello") # "String: hello"
process([1, 2])  # "List of 2 items"
```

## Generators

```python
# Generator function — uses yield
def count_up(n):
    i = 0
    while i < n:
        yield i
        i += 1

for num in count_up(5):
    print(num)  # 0, 1, 2, 3, 4

# Generator is an iterator
gen = count_up(3)
next(gen)  # 0
next(gen)  # 1
next(gen)  # 2
next(gen)  # StopIteration

# yield from — delegate to sub-generator
def chain_generators(*generators):
    for gen in generators:
        yield from gen

list(chain_generators([1, 2], [3, 4]))  # [1, 2, 3, 4]

# yield with send
def echo():
    while True:
        received = yield
        print(f"Got: {received}")

gen = echo()
next(gen)        # prime the generator
gen.send("hi")   # "Got: hi"
gen.send("bye")  # "Got: bye"

# yield with return (StopIteration.value)
def search(iterable, target):
    for item in iterable:
        if item == target:
            return f"Found {target}"
    return "Not found"

gen = search([1, 2, 3], 2)
try:
    next(gen)
except StopIteration as e:
    print(e.value)  # "Found 2"

# Generator expressions
squares = (x * x for x in range(10))
list(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# Lazy evaluation — memory efficient
sum(x * x for x in range(1_000_000))  # doesn't create a list

# Infinite generator
def natural_numbers():
    n = 1
    while True:
        yield n
        n += 1

# itertools.islice to limit
from itertools import islice
list(islice(natural_numbers(), 5))  # [1, 2, 3, 4, 5]
```

## Scope Resolution (LEGB Rule)

```python
# Python resolves names using the LEGB rule:
# L — Local (inside current function)
# E — Enclosing (outer function, for nested functions)
# G — Global (module level)
# B — Built-in (Python's builtins)

# Local scope
def func():
    x = 1  # local
    print(x)

# Enclosing scope (closure)
def outer():
    x = 2  # enclosing
    def inner():
        print(x)  # finds x in enclosing scope
    inner()

# Global scope
x = 3  # global (module level)
def func():
    print(x)  # finds x in global scope

# Built-in scope
def func():
    print(len)  # finds len in builtins

# global — assign to global from inside function
count = 0
def increment():
    global count
    count += 1

# nonlocal — assign to enclosing scope from nested function
def outer():
    x = 0
    def inner():
        nonlocal x
        x += 1
    inner()
    print(x)  # 1

# Scope inspection
import builtins
dir(builtins)  # all built-in names
globals()  # global namespace
locals()  # local namespace

# Class scope is NOT enclosing for methods
class MyClass:
    x = 1
    def method(self):
        # x is NOT visible here as enclosing
        # Must use self.x or MyClass.x
        pass

# Comprehensions have their own scope (3.0+)
[x for x in range(5)]
# x is NOT leaked to enclosing scope
```

## Closures

```python
# Closure — function that captures variables from enclosing scope
def make_multiplier(factor):
    def multiply(x):
        return x * factor  # captures 'factor'
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)
double(5)  # 10
triple(5)  # 15

# Closure with mutable state
def make_counter():
    count = 0
    def increment():
        nonlocal count
        count += 1
        return count
    return increment

counter = make_counter()
counter()  # 1
counter()  # 2
counter()  # 3

# nonlocal — modify enclosing variable
def outer():
    x = "outer"
    def inner():
        nonlocal x
        x = "inner"
    inner()
    print(x)  # "inner"
```

## Type Hints in Functions

```python
# Basic type hints
def add(a: int, b: int) -> int:
    return a + b

# Optional and default
def greet(name: str, greeting: str = "Hello") -> str:
    return f"{greeting}, {name}"

# Optional (can be None)
from typing import Optional

def find(items: list[int], target: int) -> Optional[int]:
    try:
        return items.index(target)
    except ValueError:
        return None

# Union types
from typing import Union

def process(data: Union[str, bytes]) -> str:
    if isinstance(data, bytes):
        return data.decode()
    return data

# Modern union syntax (3.10+)
def process(data: str | bytes) -> str:
    if isinstance(data, bytes):
        return data.decode()
    return data

# *args and **kwargs typing
def func(*args: int, **kwargs: str) -> None:
    pass

# Callable type
from typing import Callable

def apply(func: Callable[[int], int], value: int) -> int:
    return func(value)
```

## Function Attributes

```python
def func():
    pass

func.__name__       # "func"
func.__doc__        # docstring
func.__module__     # module name
func.__defaults__   # tuple of default values
func.__code__       # code object
func.__annotations__  # dict of annotations

# Custom attributes
func.custom = "value"
```

## Partial Application

```python
from functools import partial

def power(base, exponent):
    return base ** exponent

# Create a partially applied function
square = partial(power, exponent=2)
cube = partial(power, exponent=3)

square(5)  # 25
cube(3)    # 27

# Partial with positional args
int_from_hex = partial(int, base=16)
int_from_hex("ff")  # 255
```
