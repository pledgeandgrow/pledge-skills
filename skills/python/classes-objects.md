# Classes & Objects

**Docs:** https://docs.python.org/3/tutorial/classes.html | https://docs.python.org/3/reference/datamodel.html

## Class Definition

```python
class Dog:
    # Class variable (shared by all instances)
    species = "Canis familiaris"

    # Constructor
    def __init__(self, name, age):
        # Instance variables
        self.name = name
        self.age = age

    # Instance method
    def bark(self):
        return f"{self.name} says woof!"

    # String representation
    def __repr__(self):
        return f"Dog(name={self.name!r}, age={self.age})"

    def __str__(self):
        return f"{self.name}, a {self.age}-year-old dog"

dog = Dog("Buddy", 3)
dog.bark()       # "Buddy says woof!"
str(dog)         # "Buddy, a 3-year-old dog"
repr(dog)        # "Dog(name='Buddy', age=3)"
Dog.species      # "Canis familiaris" (class variable)
dog.species      # "Canis familiaris" (accessed via instance)
```

## Inheritance

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError("Subclass must implement speak")

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)  # call parent constructor
        self.breed = breed

    def speak(self):
        return f"{self.name} says woof"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says meow"

# Multiple inheritance
class Swimmer:
    def swim(self):
        return "swimming"

class Flyer:
    def fly(self):
        return "flying"

class Duck(Swimmer, Flyer):
    pass

duck = Duck()
duck.swim()  # "swimming"
duck.fly()   # "flying"

# MRO (Method Resolution Order)
Duck.__mro__  # (Duck, Swimmer, Flyer, object)

# super() in multiple inheritance
class A:
    def method(self):
        return "A"

class B(A):
    def method(self):
        return f"B -> {super().method()}"

class C(A):
    def method(self):
        return f"C -> {super().method()}"

class D(B, C):
    def method(self):
        return f"D -> {super().method()}"

D().method()  # "D -> B -> C -> A"

# isinstance and issubclass
isinstance(dog, Animal)   # True
isinstance(dog, Dog)      # True
issubclass(Dog, Animal)   # True
issubclass(Dog, object)   # True (everything inherits from object)
```

## Properties

```python
class Temperature:
    def __init__(self, celsius=0):
        self.celsius = celsius  # uses the setter

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Below absolute zero")
        self._celsius = value

    @celsius.deleter
    def celsius(self):
        del self._celsius

    # Computed property
    @property
    def fahrenheit(self):
        return self._celsius * 9 / 5 + 32

    @fahrenheit.setter
    def fahrenheit(self, value):
        self.celsius = (value - 32) * 5 / 9

t = Temperature(100)
t.fahrenheit    # 212.0
t.celsius = 0
t.fahrenheit    # 32.0
t.fahrenheit = 212
t.celsius       # 100.0
```

## Class Methods and Static Methods

```python
class MyClass:
    count = 0

    def __init__(self):
        MyClass.count += 1

    # Instance method — receives self
    def instance_method(self):
        return f"instance: {self}"

    # Class method — receives cls
    @classmethod
    def class_method(cls):
        return f"class: {cls}, count: {cls.count}"

    # Static method — receives neither
    @staticmethod
    def static_method(x):
        return x * 2

    # Alternative constructor via classmethod
    @classmethod
    def from_string(cls, string):
        return cls()

MyClass.class_method()      # "class: <class 'MyClass'>, count: 0"
MyClass.static_method(5)    # 10
```

## Dataclasses

```python
from dataclasses import dataclass, field
from typing import List

# Basic dataclass — auto-generates __init__, __repr__, __eq__
@dataclass
class User:
    id: int
    name: str
    email: str

user = User(1, "Alice", "alice@mail.com")
repr(user)  # "User(id=1, name='Alice', email='alice@mail.com')"
user == User(1, "Alice", "alice@mail.com")  # True

# With default values
@dataclass
class Config:
    host: str = "localhost"
    port: int = 8080
    debug: bool = False

# Mutable defaults use field(default_factory=...)
@dataclass
class ShoppingCart:
    items: List[str] = field(default_factory=list)
    total: float = 0.0

cart = ShoppingCart()
cart.items.append("apple")

# Frozen dataclass (immutable)
@dataclass(frozen=True)
class Point:
    x: float
    y: float

p = Point(1.0, 2.0)
# p.x = 3.0  # FrozenInstanceError

# Slots dataclass (memory efficient, 3.10+)
@dataclass(slots=True)
class Efficient:
    x: int
    y: int

# post_init — custom initialization
@dataclass
class ValidatedUser:
    name: str
    email: str

    def __post_init__(self):
        if "@" not in self.email:
            raise ValueError("Invalid email")

# field with metadata
@dataclass
class Product:
    name: str = field(metadata={"description": "Product name"})
    price: float = field(default=0.0, metadata={"unit": "USD"})

# KW_ONLY (3.10+)
@dataclass
class Point:
    x: int
    _: KW_ONLY
    y: int

Point(1, y=2)  # x is positional, y is keyword-only

# field() options
@dataclass
class Advanced:
    # default_factory — mutable default
    tags: list[str] = field(default_factory=list)

    # Exclude from repr
    password: str = field(repr=False)

    # Exclude from comparison
    timestamp: float = field(compare=False)

    # Exclude from init (set manually)
    id: int = field(init=False, default=0)

    # Include in hash
    key: str = field(hash=True)

    # kw_only (3.10+)
    secret: str = field(kw_only=True)

# weakref_slot (3.11+)
@dataclass(weakref_slot=True)
class WeakRefable:
    x: int

import weakref
weakref.ref(WeakRefable(1))  # works

# Dataclass functions
from dataclasses import asdict, astuple, fields, is_dataclass, replace, MISSING

@dataclass
class User:
    id: int
    name: str

u = User(1, "Alice")
asdict(u)   # {"id": 1, "name": "Alice"}
astuple(u)  # (1, "Alice")
fields(User)  # (Field(name='id',...), Field(name='name',...))
is_dataclass(User)  # True
is_dataclass(u)     # True

# replace — create copy with changes
u2 = replace(u, name="Bob")  # User(id=1, name="Bob")

# MISSING sentinel
field().default is MISSING  # True if no default

# make_dataclass — create dataclass dynamically
from dataclasses import make_dataclass
DynamicUser = make_dataclass(
    "DynamicUser",
    [("id", int), ("name", str), ("email", str, field(default=""))],
)
DynamicUser(1, "Alice")  # DynamicUser(id=1, name='Alice', email='')
```

## Enums

```python
from enum import Enum, IntEnum, StrEnum, auto, Flag, IntFlag

# Basic enum
class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3

Color.RED          # <Color.RED: 1>
Color.RED.name     # "RED"
Color.RED.value    # 1
Color["RED"]       # Color.RED (by name)
Color(1)           # Color.RED (by value)
list(Color)        # [Color.RED, Color.GREEN, Color.BLUE]

# auto() — automatic values
class Status(Enum):
    PENDING = auto()
    ACTIVE = auto()
    CLOSED = auto()

# IntEnum — comparable with int
class Priority(IntEnum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3

Priority.HIGH > Priority.LOW  # True
Priority.HIGH == 3             # True

# StrEnum (3.11+) — str subclass
class Role(StrEnum):
    ADMIN = "admin"
    USER = "user"

# Flag — bitwise operations
class Permission(Flag):
    READ = auto()
    WRITE = auto()
    EXECUTE = auto()

perm = Permission.READ | Permission.WRITE
Permission.READ in perm  # True

# IntFlag — bitwise with int comparison
class Capability(IntFlag):
    READ = 1
    WRITE = 2
    EXECUTE = 4

cap = Capability.READ | Capability.WRITE
cap & Capability.READ  # Capability.READ

# Enum with methods
class Planet(Enum):
    MERCURY = (3.303e23, 2.4397e6)
    EARTH = (5.976e24, 6.37814e6)

    def __init__(self, mass, radius):
        self.mass = mass
        self.radius = radius

    @property
    def surface_gravity(self):
        G = 6.67300E-11
        return G * self.mass / (self.radius ** 2)

Planet.EARTH.surface_gravity  # 9.8...

# ReprEnum (3.12+) — use repr() instead of str() for members
from enum import ReprEnum
class MyEnum(ReprEnum):
    A = 1
    B = 2
repr(MyEnum.A)  # "MyEnum.A" (not "1")

# enum.member and enum.nonmember (3.12+)
# Explicitly mark attributes as members or non-members
from enum import member, nonmember

class MyFlag(Enum):
    READ = member(auto())    # definitely a member
    WRITE = member(auto())   # definitely a member
    _lookup = nonmember({})  # NOT a member (regular attribute)

# EnumType — the metaclass for all enums
from enum import EnumType
isinstance(Color, EnumType)  # True

# EnumCheck and verify (3.12+) — validate enum constraints
from enum import EnumCheck, verify

@verify(EnumCheck.UNIQUE)        # no duplicate values
@verify(EnumCheck.CONTINUOUS)    # values are 0, 1, 2, ... (no gaps)
@verify(EnumCheck.NAMED_FLAGS)   # flag members must have names
class Strict(Enum):
    A = 1
    B = 2
    C = 3

# BoundaryType for Flag (3.11+)
from enum import CONFORM, EJECT, KEEP, BoundaryType
class StrictFlag(Flag, boundary=CONFORM):
    READ = 1
    WRITE = 2
```

## Metaclasses

```python
# type is the default metaclass
type(int)    # <class 'type'>
type(str)    # <class 'type'>
type(type)   # <class 'type'>

# Custom metaclass
class SingletonMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class Database(metaclass=SingletonMeta):
    def __init__(self):
        self.connected = False

db1 = Database()
db2 = Database()
db1 is db2  # True — same instance

# Metaclass with __new__ and __init__
class ValidatorMeta(type):
    def __new__(mcs, name, bases, namespace):
        # Modify class creation
        cls = super().__new__(mcs, name, bases, namespace)
        return cls

# __init_subclass__ — simpler alternative to metaclasses
class Plugin:
    plugins = []

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        Plugin.plugins.append(cls)

class MyPlugin(Plugin):
    pass

Plugin.plugins  # [<class '__main__.MyPlugin'>]
```

## Slots

```python
# __slots__ — restrict attributes, save memory
class Point:
    __slots__ = ('x', 'y')

    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(1, 2)
p.x = 3       # OK
# p.z = 4     # AttributeError — not in slots
# p.__dict__  # AttributeError — no __dict__

# Benefits:
# - Faster attribute access
# - Less memory (no per-instance __dict__)
# - Prevents accidental attribute creation

# Slots with inheritance
class Point3D(Point):
    __slots__ = ('z',)

    def __init__(self, x, y, z):
        super().__init__(x, y)
        self.z = z
```

## Dunder (Magic) Methods

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    # String representations
    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

    def __str__(self):
        return f"({self.x}, {self.y})"

    # Arithmetic
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        return Vector(self.x - other.x, self.y - other.y)

    def __mul__(self, scalar):
        return Vector(self.x * scalar, self.y * scalar)

    __rmul__ = __mul__  # reflected: scalar * vector

    def __neg__(self):
        return Vector(-self.x, -self.y)

    def __abs__(self):
        return (self.x ** 2 + self.y ** 2) ** 0.5

    # Comparison
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __lt__(self, other):
        return abs(self) < abs(other)

    def __hash__(self):
        return hash((self.x, self.y))

    # Container protocol
    def __getitem__(self, index):
        return (self.x, self.y)[index]

    def __len__(self):
        return 2

    def __contains__(self, item):
        return item in (self.x, self.y)

    # Iteration
    def __iter__(self):
        yield self.x
        yield self.y

    # Callable
    def __call__(self, scalar):
        return Vector(self.x * scalar, self.y * scalar)

    # Context manager
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        return False

    # Boolean conversion
    def __bool__(self):
        return self.x != 0 or self.y != 0

v1 = Vector(1, 2)
v2 = Vector(3, 4)
v1 + v2        # Vector(4, 6)
v1 * 3         # Vector(3, 6)
3 * v1         # Vector(3, 6) (via __rmul__)
abs(v2)        # 5.0
v1 < v2        # True
list(v1)       # [1, 2]
v1[0]          # 1
bool(v1)       # True
v1(2)          # Vector(2, 4)
```

## Abstract Base Classes

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

    @abstractmethod
    def perimeter(self):
        pass

    # Concrete method
    def describe(self):
        return f"Area: {self.area()}, Perimeter: {self.perimeter()}"

# Shape()  # TypeError — can't instantiate abstract class

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2

    def perimeter(self):
        return 2 * 3.14159 * self.radius

circle = Circle(5)
circle.describe()  # "Area: 78.5..., Perimeter: 31.4..."

# Abstract property
class Database(ABC):
    @property
    @abstractmethod
    def connected(self):
        pass

# Abstract class method
class Plugin(ABC):
    @classmethod
    @abstractmethod
    def name(cls):
        pass
```

## Copying Objects

```python
import copy

obj = [[1, 2], [3, 4]]

# Shallow copy — new container, same elements
shallow = copy.copy(obj)
shallow is obj          # False
shallow[0] is obj[0]   # True (same inner list)

# Deep copy — fully independent
deep = copy.deepcopy(obj)
deep is obj             # False
deep[0] is obj[0]      # False (new inner list)

# Copy methods
list.copy()             # shallow copy
dict.copy()             # shallow copy
set.copy()              # shallow copy

# Slicing creates shallow copy
copy_list = obj[:]
```

## Class Relationships

```python
# Composition — "has-a"
class Engine:
    def start(self):
        return "engine started"

class Car:
    def __init__(self):
        self.engine = Engine()  # composition

    def start(self):
        return self.engine.start()

# Aggregation — "has-a" but doesn't own
class Department:
    def __init__(self, employees):
        self.employees = employees  # employees exist independently

# Inheritance — "is-a"
class Vehicle:
    pass

class Truck(Vehicle):
    pass
```

## Advanced Class Features

```python
# __class_getitem__ — enable class subscripting (PEP 560)
class MyList:
    def __class_getitem__(cls, item):
        return f"MyList[{item.__name__}]"

MyList[int]  # "MyList[int]"
# Used by Generic, TypedDict, etc.

# __subclasshook__ — customize isinstance for ABCs
from abc import ABCMeta

class MyVirtualABC(metaclass=ABCMeta):
    @classmethod
    def __subclasshook__(cls, subclass):
        if cls is MyVirtualABC:
            return hasattr(subclass, "required_method")
        return NotImplemented

class NotInherited:
    def required_method(self):
        pass

isinstance(NotInherited(), MyVirtualABC)  # True — virtual subclass

# __init_subclass__ with keyword arguments
class Tagged:
    tag = None

    def __init_subclass__(cls, tag=None, **kwargs):
        super().__init_subclass__(**kwargs)
        cls.tag = tag

class Foo(Tagged, tag="foo"):
    pass

class Bar(Tagged, tag="bar"):
    pass

Foo.tag  # "foo"
Bar.tag  # "bar"

# __subclasshook__ vs register
# register — explicitly declare a class as virtual subclass
MyVirtualABC.register(NotInherited)
# __subclasshook__ — dynamically determine subclass status

# __class_getitem__ for custom generics
from typing import TypeVar, Generic

T = TypeVar("T")

class Repository(Generic[T]):
    def __class_getitem__(cls, item):
        # Custom behavior when subscripted
        return super().__class_getitem__(item)

# __del__ — destructor (avoid if possible, use context managers)
class Resource:
    def __del__(self):
        # Called when object is garbage collected
        # NOT guaranteed to be called at program exit
        # Use context managers or atexit instead
        self.cleanup()

# __slots__ with __dict__ — allow some dynamic attributes
class Partial:
    __slots__ = ("x", "y", "__dict__")
    # x and y are slotted, but other attrs go in __dict__

# Weak references with __slots__
class Slotted:
    __slots__ = ("value", "__weakref__")
    # Without __weakref__ in slots, weakref.ref() fails

# Pickle support with __slots__
class Picklable:
    __slots__ = ("x", "y")

    def __getstate__(self):
        return (self.x, self.y)

    def __setstate__(self, state):
        self.x, self.y = state

    def __getnewargs__(self):
        return ()  # args for __new__

# __reduce__ and __reduce_ex__ — control pickling
class CustomPickler:
    def __reduce__(self):
        return (self.__class__, (self.arg1, self.arg2))
```
