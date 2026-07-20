# Type Hints & Static Typing

**Docs:** https://docs.python.org/3/library/typing.html | https://mypy.readthedocs.io/ | https://peps.python.org/pep-0484/

## Basic Type Hints

```python
# Variables (3.6+)
x: int = 42
name: str = "Alice"
items: list[int] = [1, 2, 3]  # 3.9+ lowercase generics

# Function signatures
def greet(name: str, times: int = 1) -> str:
    return f"Hello, {name}! " * times

def process(data: list[str]) -> dict[str, int]:
    return {item: len(item) for item in data}

# Multiple return types (3.10+)
def parse(value: str) -> int | None:
    try:
        return int(value)
    except ValueError:
        return None

# Before 3.10 — use Optional and Union
from typing import Optional, Union

def parse(value: str) -> Optional[int]:
    ...
def process(data: Union[str, bytes]) -> str:
    ...
```

## Built-in Generic Types (3.9+)

```python
# Lowercase generics (no import needed in 3.9+)
def func(
    items: list[int],
    mapping: dict[str, int],
    unique: set[str],
    sequence: tuple[int, str, float],  # fixed-length tuple
    variable: tuple[int, ...],         # variable-length tuple
) -> None:
    pass

# Before 3.9 — use typing module
from typing import List, Dict, Set, Tuple
def func(items: List[int], mapping: Dict[str, int]) -> None:
    pass
```

## typing Module

```python
from typing import (
    Any, Optional, Union, Callable, Iterable, Iterator,
    Sequence, Mapping, TypeAlias, Literal, TypeVar, Generic,
    Protocol, TypedDict, Final, ClassVar, NewType, overload,
)

# Any — any type (disables type checking)
def flexible(data: Any) -> Any:
    return data

# Optional — can be None
def find(key: str) -> Optional[int]:  # Union[int, None]
    ...

# Callable
def apply(func: Callable[[int, int], int], a: int, b: int) -> int:
    return func(a, b)

# Callable with no specified args
handler: Callable[..., None]

# Iterable vs Iterator
def consume(items: Iterable[int]) -> None:
    for item in items:
        pass

def gen() -> Iterator[int]:
    yield 1

# Sequence — list, tuple, str (supports indexing and len)
def first(seq: Sequence[int]) -> int:
    return seq[0]

# Mapping — dict-like
def get_value(m: Mapping[str, int], key: str) -> int:
    return m[key]

# TypeAlias (3.10+)
Vector: TypeAlias = list[float]
Matrix: TypeAlias = list[Vector]

# Before 3.10
from typing import List
Vector = List[float]

# PEP 695 — type statement (3.12+) — new alias syntax
type Vector = list[float]
type Matrix = list[Vector]
type Point = tuple[float, float]
type Callback = Callable[[int], str]

# Generic type aliases with PEP 695
type Pair[T] = tuple[T, T]
type Dict[K, V] = dict[K, V]

# Generic type aliases before 3.12
from typing import TypeVar
K = TypeVar("K")
V = TypeVar("V")
DictAlias = dict[K, V]  # works at runtime (3.9+ for subscripting)

# Recursive type aliases (PEP 695 makes these cleaner)
type JSON = None | bool | int | float | str | list[JSON] | dict[str, JSON]
# Before 3.12, recursive aliases need string forward refs:
JSON: TypeAlias = "None | bool | int | float | str | list[JSON] | dict[str, JSON]"

# Literal — specific values
def set_mode(mode: Literal["r", "w", "a"]) -> None:
    pass

def answer() -> Literal[42]:
    return 42

# Final — cannot be reassigned/subclassed
MAX_SIZE: Final[int] = 100

class Config:
    timeout: Final[int] = 30

# ClassVar — class variable, not instance
class Counter:
    total: ClassVar[int] = 0
    count: int  # instance variable

# NewType — distinct type at type-check time
UserId = NewType("UserId", int)
user_id: UserId = UserId(42)
# user_id + 1 is int, but type checker treats UserId as distinct
```

## Type Variables and Generics

```python
from typing import TypeVar, Generic, TypeVarTuple, Unpack

# TypeVar
T = TypeVar("T")

def first(items: list[T]) -> T:
    return items[0]

# TypeVar with bounds
T = TypeVar("T", bound=int)  # must be int or subclass

def double(x: T) -> T:
    return x * 2

# TypeVar with constraints
T = TypeVar("T", str, bytes)  # must be str or bytes

def concat(a: T, b: T) -> T:
    return a + b

# Generic class
T = TypeVar("T")

class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        return self._items.pop()

stack: Stack[int] = Stack()
stack.push(1)
item: int = stack.pop()

# PEP 695 — new generic syntax (3.12+)
class Stack[T]:
    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

def first[T](items: list[T]) -> T:
    return items[0]

# TypeVarTuple — variadic generics (3.11+)
Ts = TypeVarTuple("Ts")

class Array(Generic[Unpack[Ts]]):
    shape: tuple[Unpack[Ts]]
```

## Protocols (Structural Subtyping)

```python
from typing import Protocol, runtime_checkable

# Protocol — duck typing for type checkers
class SupportsClose(Protocol):
    def close(self) -> None: ...

def cleanup(resource: SupportsClose) -> None:
    resource.close()

# Any class with close() method satisfies this protocol
class FileWrapper:
    def close(self) -> None:
        pass

cleanup(FileWrapper())  # OK — has close()

# Protocol with properties
class Named(Protocol):
    name: str

def greet(obj: Named) -> str:
    return f"Hello, {obj.name}"

# runtime_checkable — allows isinstance check
@runtime_checkable
class Drawable(Protocol):
    def draw(self) -> None: ...

isinstance(obj, Drawable)  # checks at runtime

# Protocol with methods and properties
class Sized(Protocol):
    def __len__(self) -> int: ...

# Generic protocol
class Repository(Protocol[T]):
    def get(self, id: int) -> T: ...
    def save(self, item: T) -> None: ...
```

## TypedDict

```python
from typing import TypedDict, Required, NotRequired

# TypedDict — dict with typed keys
class UserDict(TypedDict):
    id: int
    name: str
    email: str

user: UserDict = {"id": 1, "name": "Alice", "email": "alice@mail.com"}
user["name"]  # type checker knows this is str

# Required and NotRequired (3.11+)
class ConfigDict(TypedDict):
    host: Required[str]
    port: Required[int]
    debug: NotRequired[bool]

config: ConfigDict = {"host": "localhost", "port": 8080}

# Total=False — all keys optional
class OptionalUser(TypedDict, total=False):
    name: str
    age: int

# Functional syntax
Point = TypedDict("Point", {"x": int, "y": int})

# ReadOnly (3.13+ — PEP 705) — mark dict values as read-only
from typing import ReadOnly

class FrozenUser(TypedDict):
    id: ReadOnly[int]
    name: ReadOnly[str]
    tags: ReadOnly[list[str]]

# Type checker enforces: FrozenUser fields cannot be mutated
# user["id"] = 99  # Error: ReadOnly field

# Combining ReadOnly with Required/NotRequired
class APIConfig(TypedDict):
    api_key: ReadOnly[Required[str]]
    timeout: ReadOnly[NotRequired[int]]

# NoDefault (3.13+) — sentinel for missing default values
from typing import NoDefault

def search(items: list, key: str, default=NoDefault):
    if default is NoDefault:
        # No default was provided
        raise KeyError(key)
    return items.get(key, default)
```

## Function Overloading

```python
from typing import overload

# @overload — multiple signatures for type checker
@overload
def parse(x: str) -> int: ...
@overload
def parse(x: bytes) -> int: ...
def parse(x: str | bytes) -> int:
    if isinstance(x, bytes):
        x = x.decode()
    return int(x)

# Overload with different return types
@overload
def get(key: str) -> str: ...
@overload
def get(key: int) -> int: ...
def get(key: str | int) -> str | int:
    ...
```

## Type Narrowing

```python
# isinstance narrowing
def process(data: int | str) -> int:
    if isinstance(data, int):
        return data * 2  # narrowed to int
    return len(data)     # narrowed to str

# type() narrowing
def handle(x: int | str) -> None:
    if type(x) is int:
        print(x + 1)  # narrowed
    else:
        print(x.upper())  # narrowed to str

# None narrowing
def maybe_double(x: int | None) -> int:
    if x is None:
        return 0
    return x * 2  # narrowed to int

# Truthiness narrowing
def func(x: str | None) -> str:
    if x:           # narrows to str (non-empty)
        return x
    return ""       # x could be None or ""

# Sequence narrowing
def first(items: list[int] | None) -> int:
    if items is None or len(items) == 0:
        return 0
    return items[0]  # narrowed to non-empty list
```

## Type Checking Tools

```bash
# mypy — static type checker
pip install mypy
mypy mypackage/
mypy --strict mypackage/
mypy --disallow-untyped-defs mypackage/

# pyright — fast type checker (Microsoft)
pip install pyright
pyright mypackage/

# ruff — linter with some type checking
pip install ruff
ruff check mypackage/

# pytype — type inference (Google)
pip install pytype
pytype mypackage/
```

```python
# mypy configuration in pyproject.toml
# [tool.mypy]
# python_version = "3.13"
# strict = true
# warn_return_any = true
# warn_unused_configs = true
# disallow_untyped_defs = true
# disallow_incomplete_defs = true

# Type: ignore comments
result = some_untyped_function()  # type: ignore
result = some_untyped_function()  # type: ignore[no-untyped-call]

# reveal_type — debugging type inference
reveal_type(x)  # mypy prints the inferred type

# cast — explicit type assertion (no runtime effect)
from typing import cast
value = cast(int, some_value)

# TYPE_CHECKING — imports only for type checkers
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from expensive_module import ExpensiveType

def func(x: "ExpensiveType") -> None:
    pass

# assert_type — static assertion of type (3.11+)
from typing import assert_type
x: int = 42
assert_type(x, int)  # passes if type checker agrees

# assert_never — exhaustiveness checking (3.11+)
from typing import assert_never, Literal

def handle(status: Literal["ok", "error", "pending"]) -> str:
    match status:
        case "ok":
            return "success"
        case "error":
            return "failed"
        case "pending":
            return "waiting"
        case _:
            assert_never(status)  # error if any case is missing

# get_overloads / clear_overloads — introspect @overload (3.11+)
from typing import get_overloads, clear_overloads

@overload
def f(x: int) -> int: ...
@overload
def f(x: str) -> str: ...
def f(x):
    return x

get_overloads(f)  # tuple of overload signatures
clear_overloads(f)  # clear cached overloads

# dataclass_transform — decorator for custom dataclass-like decorators (3.11+)
from typing import dataclass_transform

@dataclass_transform(field_specifiers=(field,))
def my_dataclass(cls):
    # Custom dataclass implementation
    return cls

@my_dataclass
class MyModel:
    x: int
    y: str = ""
# Type checker treats this like a dataclass
```

## Special Types

```python
from typing import Self, Never, NoReturn, LiteralString

# Self — returns instance of same class (3.11+)
class Builder:
    def set_name(self, name: str) -> Self:
        self.name = name
        return self

# NoReturn — function never returns (always raises)
def fail() -> NoReturn:
    raise RuntimeError("Always fails")

# Never — bottom type (3.11+)
def unreachable() -> Never:
    raise RuntimeError()

# LiteralString — string literal (3.11+, PEP 675)
def query(sql: LiteralString) -> None:
    pass

query("SELECT * FROM users")  # OK
# query(user_input)  # Error — not a literal
```

## ParamSpec and Concatenate — Decorator Typing

```python
from typing import ParamSpec, Concatenate, Callable, TypeVar
import functools

P = ParamSpec("P")  # parameter specification (3.10+)
R = TypeVar("R")

# Type a decorator that preserves the wrapped function's signature
def log_calls(
    func: Callable[P, R]
) -> Callable[P, R]:
    @functools.wraps(func)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        print(f"Calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@log_calls
def add(a: int, b: int) -> int:
    return a + b
# Type checker knows add(a: int, b: int) -> int

# Concatenate — prepend/remove params in decorator typing
def inject_user(
    func: Callable[Concatenate[str, P], R]
) -> Callable[P, R]:
    @functools.wraps(func)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        return func("default_user", *args, **kwargs)
    return wrapper

@inject_user
def greet(user: str, msg: str) -> str:
    return f"{user}: {msg}"
# greet(msg: str) -> str  — user param removed by decorator
```

## Annotated — Metadata in Type Hints

```python
from typing import Annotated

# Attach metadata to types (3.9+)
PositiveInt = Annotated[int, "must be positive"]
SerializedStr = Annotated[str, "json serializable"]

# Frameworks use Annotated for validation, dependency injection, etc.
# FastAPI example:
def get_user(
    user_id: Annotated[int, "Path parameter"]
) -> dict:
    return {"id": user_id}

# Pydantic example:
from pydantic import BaseModel, Field

class User(BaseModel):
    name: str
    age: Annotated[int, Field(gt=0, lt=150)]  # validation metadata

# Multiple annotations
Annotated[str, "meta1", "meta2", {"key": "value"}]

# Access metadata at runtime
from typing import get_type_hints, get_args, get_origin
hints = get_type_hints(User, include_extras=True)
# hints["age"] -> Annotated[int, Field(...)]
get_args(Annotated[int, "meta"])  # (int, "meta")
get_origin(Annotated[int, "meta"])  # Annotated
```

## TypeGuard and TypeIs — Type Narrowing

```python
from typing import TypeGuard, TypeIs

# TypeGuard — narrows type in if-block (3.10+)
def is_str_list(val: list[object]) -> TypeGuard[list[str]]:
    return all(isinstance(x, str) for x in val)

def process(items: list[object]) -> None:
    if is_str_list(items):
        # items is now narrowed to list[str]
        for s in items:
            s.upper()  # type checker knows s is str

# TypeIs (3.13+ — PEP 742) — stricter narrowing
# TypeIs narrows both the positive AND negative branch
def is_int(val: object) -> TypeIs[int]:
    return isinstance(val, int)

def process(val: str | int) -> str:
    if is_int(val):
        return str(val + 1)  # val is int
    else:
        return val.upper()  # val is str (narrowed by TypeIs)

# Difference: TypeGuard doesn't narrow the else branch
# TypeIs narrows both branches (like isinstance)
```

## override Decorator (3.12+)

```python
from typing import override

class Base:
    def process(self) -> str:
        return "base"

class Derived(Base):
    @override
    def process(self) -> str:
        return "derived"

    @override
    def missing(self) -> None:
        pass  # Error! Base has no 'missing' method
        # Type checker catches this typo

# PEP 698 — explicit override declaration
# Catches accidental overrides and typos
```

## Type Narrowing Reference

```python
# Type checkers narrow types in these contexts:

# isinstance
def f(x: int | str):
    if isinstance(x, int):
        x + 1  # int
    else:
        x.upper()  # str

# is None / is not None
def f(x: int | None):
    if x is not None:
        x + 1  # int

# TypeGuard / TypeIs (see above)

# assert
def f(x: int | str):
    assert isinstance(x, int)
    x + 1  # int (narrowed by assert)

# Equality with literal
def f(x: Literal["a", "b", "c"]):
    if x == "a":
        pass  # x is Literal["a"]
    elif x in ("b", "c"):
        pass  # x is Literal["b", "c"]

# Callable checks
from collections.abc import Callable
def f(x: int | Callable[[], int]):
    if callable(x):
        x()  # Callable[[], int]
    else:
        x + 1  # int

# Pattern matching (match/case)
def f(x: int | str):
    match x:
        case int():
            x + 1  # int
        case str():
            x.upper()  # str
```
