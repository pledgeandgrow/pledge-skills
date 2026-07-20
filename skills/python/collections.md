# Collections & Data Structures

**Docs:** https://docs.python.org/3/tutorial/datastructures.html | https://docs.python.org/3/library/collections.html

## Lists

```python
# Creation
fruits = ["apple", "banana", "cherry"]
empty = []
mixed = [1, "two", 3.0, [4]]

# From other iterables
list("abc")           # ['a', 'b', 'c']
list((1, 2, 3))       # [1, 2, 3]
list(range(5))        # [0, 1, 2, 3, 4]
list({"a": 1})        # ['a'] (keys)

# Indexing and slicing
fruits[0]             # "apple"
fruits[-1]            # "cherry"
fruits[1:3]           # ["banana", "cherry"]
fruits[:2]            # ["apple", "banana"]
fruits[::2]           # ["apple", "cherry"]
fruits[::-1]          # ["cherry", "banana", "apple"]

# Modification
fruits.append("date")
fruits.insert(1, "apricot")
fruits.extend(["elderberry", "fig"])
fruits.remove("banana")     # by value
del fruits[0]               # by index
popped = fruits.pop()       # remove and return last
popped = fruits.pop(0)     # remove and return at index

# Searching
"apple" in fruits          # True
fruits.index("cherry")     # position
fruits.count("apple")      # occurrences

# Sorting
fruits.sort()              # in-place
fruits.sort(reverse=True)
fruits.sort(key=len)
fruits.sort(key=lambda x: (len(x), x))  # multiple keys

sorted_fruits = sorted(fruits)  # new list
sorted(fruits, key=len, reverse=True)

# Reversing
fruits.reverse()           # in-place
reversed_fruits = list(reversed(fruits))  # new list

# Other operations
len(fruits)
fruits.clear()
fruits.copy()              # shallow copy

# List unpacking
first, second, *rest = [1, 2, 3, 4, 5]  # first=1, second=2, rest=[3,4,5]
*init, last = [1, 2, 3, 4, 5]           # init=[1,2,3,4], last=5
first, *middle, last = [1, 2, 3, 4, 5]  # first=1, middle=[2,3,4], last=5
```

## Dictionaries

```python
# Creation
person = {"name": "Alice", "age": 30}
empty = {}
from_pairs = dict([("a", 1), ("b", 2)])
from_kwargs = dict(name="Alice", age=30)

# Python 3.7+ — insertion order preserved

# Access
person["name"]          # "Alice"
person.get("email")     # None (no KeyError)
person.get("email", "N/A")  # "N/A" (default)

# Modification
person["email"] = "alice@mail.com"
person.update({"age": 31, "city": "NYC"})
del person["city"]
value = person.pop("email")  # remove and return

# Iteration
for key in person:           # keys
    print(key)
for key, value in person.items():
    print(f"{key}: {value}")
for value in person.values():
    print(value)

# Checking
"name" in person       # True
len(person)

# Dictionary comprehension
squares = {x: x**2 for x in range(5)}  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
even_squares = {x: x**2 for x in range(5) if x % 2 == 0}

# Merge dictionaries (3.9+)
merged = {"a": 1} | {"b": 2}  # {"a": 1, "b": 2}
# Update (3.9+)
d = {"a": 1}
d |= {"a": 2, "b": 3}  # {"a": 2, "b": 3}

# setdefault
person.setdefault("name", "Unknown")  # returns existing value
person.setdefault("phone", "N/A")     # sets and returns new value

# Dictionary views
keys = person.keys()      # dict_keys (view)
values = person.values()  # dict_values (view)
items = person.items()    # dict_items (view)
# Views are dynamic — reflect changes

# Nested dictionaries
config = {
    "database": {"host": "localhost", "port": 5432},
    "cache": {"enabled": True}
}
config["database"]["host"]  # "localhost"
```

## Sets

```python
# Creation
fruits = {"apple", "banana", "cherry"}
empty = set()  # NOT {} (that's a dict)
from_list = set([1, 2, 2, 3])  # {1, 2, 3}

# Operations
fruits.add("date")
fruits.remove("banana")  # KeyError if missing
fruits.discard("banana")  # no error if missing
fruits.pop()  # remove arbitrary element
fruits.clear()

# Set operations
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

a | b    # {1, 2, 3, 4, 5, 6}  — union
a & b    # {3, 4}              — intersection
a - b    # {1, 2}              — difference
a ^ b    # {1, 2, 5, 6}        — symmetric difference

a.union(b)           # same as a | b
a.intersection(b)    # same as a & b
a.difference(b)      # same as a - b
a.symmetric_difference(b)  # same as a ^ b

# Update in-place
a |= b    # update with union
a &= b    # update with intersection
a -= b    # update with difference

# Checking
1 in a           # True
a.issubset(b)    # False
a.issuperset(b)  # False
a.isdisjoint(b)  # False (share elements 3, 4)

# Frozenset — immutable set
fs = frozenset([1, 2, 3])
# fs.add(4)  # AttributeError
hash(fs)  # frozensets are hashable (can be dict keys)
```

## Tuples

```python
# Creation
point = (1, 2)
single = (1,)    # single element — comma required
empty = ()
no_parens = 1, 2, 3  # parentheses optional

# Immutable — can't modify
# point[0] = 3  # TypeError

# Packing and unpacking
packed = 1, "two", 3.0
a, b, c = packed
a, *rest = (1, 2, 3, 4)  # a=1, rest=[2, 3, 4]

# Named tuples
from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(1, 2)
p.x       # 1
p.y       # 2
p[0]      # 1 (also indexable)
x, y = p  # unpacking

# With defaults
Person = namedtuple("Person", ["name", "age", "city"], defaults=["Unknown"])
person = Person("Alice", 30)  # city="Unknown"

# _replace — create copy with changes
p2 = p._replace(x=10)  # Point(x=10, y=2)

# _asdict
p._asdict()  # {'x': 1, 'y': 2}

# Named tuple with typing (3.6+)
from typing import NamedTuple

class TypedPoint(NamedTuple):
    x: float
    y: float
    label: str = "point"

tp = TypedPoint(1.0, 2.0)
```

## Comprehensions

```python
# List comprehension
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]
pairs = [(x, y) for x in range(3) for y in range(3)]

# With function calls
words = ["hello", "world"]
lengths = [len(w) for w in words]
upper = [w.upper() for w in words]

# Conditional expression in comprehension
classified = ["even" if x % 2 == 0 else "odd" for x in range(5)]

# Dict comprehension
square_map = {x: x**2 for x in range(5)}
word_len = {w: len(w) for w in words}

# Set comprehension
unique = {x % 3 for x in range(10)}  # {0, 1, 2}

# Generator expression (lazy — use () instead of [])
squares_gen = (x**2 for x in range(10))
next(squares_gen)  # 0
list(squares_gen)  # [1, 4, 9, 16, 25, 36, 49, 64, 81]

# Nested comprehension
matrix = [[i * 3 + j for j in range(3)] for i in range(3)]
# [[0, 1, 2], [3, 4, 5], [6, 7, 8]]

# Flattening
flat = [item for row in matrix for item in row]
# [0, 1, 2, 3, 4, 5, 6, 7, 8]

# Walrus in comprehension
results = [y for x in data if (y := func(x)) is not None]
```

## collections Module

```python
from collections import Counter, defaultdict, deque, OrderedDict, ChainMap

# Counter — counting hashable objects
words = ["apple", "banana", "apple", "cherry", "apple"]
counter = Counter(words)
counter["apple"]   # 3
counter.most_common(2)  # [("apple", 3), ("banana", 1)]
counter.update(["banana", "banana"])
counter.most_common()  # [("apple", 3), ("banana", 3), ("cherry", 1)]

# Counter operations
c1 = Counter(a=3, b=1)
c2 = Counter(a=1, b=2)
c1 + c2  # Counter({'a': 4, 'b': 3})
c1 - c2  # Counter({'a': 2})
c1 & c2  # Counter({'a': 1, 'b': 1}) — min
c1 | c2  # Counter({'a': 3, 'b': 2}) — max

# defaultdict — dict with default factory
dd = defaultdict(list)
dd["a"].append(1)  # no KeyError — creates empty list
dd["a"].append(2)
dd["b"]  # [] (auto-created)

dd_int = defaultdict(int)
dd_int["count"] += 1  # starts at 0

dd_set = defaultdict(set)
dd_set["group1"].add("item1")

# deque — double-ended queue
dq = deque([1, 2, 3])
dq.append(4)         # [1, 2, 3, 4]
dq.appendleft(0)     # [0, 1, 2, 3, 4]
dq.pop()             # 4
dq.popleft()         # 0
dq.extend([5, 6])
dq.extendleft([-1, -2])  # [-2, -1, ...]
dq.rotate(1)         # rotate right
dq.rotate(-1)        # rotate left

# maxlen — bounded deque
bounded = deque(maxlen=3)
bounded.extend([1, 2, 3, 4])  # deque([2, 3, 4])

# OrderedDict — ordered dict (less needed since 3.7, but has extras)
od = OrderedDict()
od["a"] = 1
od["b"] = 2
od.move_to_end("a")  # move to end
od.popitem(last=False)  # FIFO pop

# ChainMap — combine multiple dicts
defaults = {"theme": "dark", "lang": "en"}
user_prefs = {"theme": "light"}
config = ChainMap(user_prefs, defaults)
config["theme"]  # "light" (from user_prefs)
config["lang"]   # "en" (from defaults)
```

## array Module

```python
from array import array

# Typed array — more memory efficient than list for numbers
ints = array('i', [1, 2, 3, 4])  # signed int
floats = array('d', [1.0, 2.0])  # double

ints.append(5)
ints.extend([6, 7])
ints[0]  # 1

# Type codes: 'b' (signed char), 'B' (unsigned char), 'i' (signed int),
# 'I' (unsigned int), 'l' (signed long), 'f' (float), 'd' (double)
```

## bisect Module

```python
import bisect

# Maintain sorted list efficiently
sorted_list = []
bisect.insort(sorted_list, 3)
bisect.insort(sorted_list, 1)
bisect.insort(sorted_list, 2)
# sorted_list = [1, 2, 3]

# Find insertion point
bisect.bisect([1, 2, 3, 3, 4], 3)     # 4 (rightmost)
bisect.bisect_left([1, 2, 3, 3, 4], 3)  # 2 (leftmost)
```

## heapq Module

```python
import heapq

# Min-heap
heap = []
heapq.heappush(heap, 3)
heapq.heappush(heap, 1)
heapq.heappush(heap, 2)
heapq.heappop(heap)  # 1 (smallest)

# Heapify existing list
nums = [3, 1, 4, 1, 5, 9, 2, 6]
heapq.heapify(nums)  # in-place

# n smallest / largest
heapq.nsmallest(3, nums)  # [1, 1, 2]
heapq.nlargest(3, nums)   # [9, 6, 5]

# Priority queue
heapq.heappush(heap, (priority, item))

# Merge multiple sorted iterables
list(heapq.merge([1, 3, 5], [2, 4, 6]))  # [1, 2, 3, 4, 5, 6]

# nlargest/nsmallest with key
heapq.nlargest(3, students, key=lambda s: s.grade)
```

## UserDict, UserList, UserString

```python
from collections import UserDict, UserList, UserString

# UserDict — easier dict subclassing
# (subclassing dict directly can have issues with methods that
# don't call overridden methods)
class CountingDict(UserDict):
    def __init__(self):
        super().__init__()
        self.access_count = 0

    def __getitem__(self, key):
        self.access_count += 1
        return super().__getitem__(key)

    def __setitem__(self, key, value):
        self.access_count += 1
        super().__setitem__(key, value)

cd = CountingDict()
cd["a"] = 1
cd["a"]  # access_count = 2
# UserDict stores items in self.data (a real dict)

# UserList — easier list subclassing
class SortedList(UserList):
    def append(self, item):
        super().append(item)
        self.data.sort()

    def extend(self, items):
        super().extend(items)
        self.data.sort()

sl = SortedList([3, 1, 2])
sl.append(0)  # [0, 1, 2, 3]
# UserList stores items in self.data (a real list)

# UserString — easier string subclassing
class WordString(UserString):
    @property
    def words(self):
        return self.data.split()

    def word_count(self):
        return len(self.words)

ws = WordString("hello world foo")
ws.word_count()  # 3
ws.upper()  # "HELLO WORLD FOO" (returns str, not WordString)
# UserString stores string in self.data
```

## copy Module

```python
import copy

# Shallow copy — new container, same elements
original = [[1, 2], [3, 4]]
shallow = copy.copy(original)
shallow[0][0] = 99
# original[0][0] is also 99 — nested objects are shared

# Deep copy — fully independent recursive copy
original = [[1, 2], [3, 4]]
deep = copy.deepcopy(original)
deep[0][0] = 99
# original unchanged — completely independent

# Object-specific copy behavior
class Node:
    def __init__(self, value, children=None):
        self.value = value
        self.children = children or []

    def __copy__(self):
        # Custom shallow copy
        return Node(self.value, self.children[:])

    def __deepcopy__(self, memo):
        # Custom deep copy
        return Node(
            self.value,
            [copy.deepcopy(c, memo) for c in self.children]
        )

# copy.copy() calls __copy__ if defined
# copy.deepcopy() calls __deepcopy__ if defined
# memo dict prevents infinite recursion on circular refs

# Copy vs slice vs list()
lst = [1, 2, 3]
a = copy.copy(lst)   # shallow copy
b = lst[:]            # same as shallow copy
c = list(lst)         # same as shallow copy
d = lst.copy()        # same (3.3+)
```
