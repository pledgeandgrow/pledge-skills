# Standard Library — Core

**Docs:** https://docs.python.org/3/library/

## os — Operating System Interface

```python
import os

# Environment
os.getcwd()                    # current working directory
os.chdir("/path")              # change directory
os.environ["HOME"]             # environment variables
os.getenv("PATH", "/default")  # get with default

# Files and directories
os.listdir(".")                # list directory contents
os.mkdir("newdir")             # create directory
os.makedirs("a/b/c")           # recursive mkdir
os.remove("file.txt")          # remove file
os.rmdir("emptydir")           # remove empty directory
os.removedirs("a/b/c")         # recursive rmdir
os.rename("old.txt", "new.txt")
os.replace("old.txt", "new.txt")  # atomic on POSIX

# Path operations
os.path.join("dir", "file.txt")    # "dir/file.txt" (platform-aware)
os.path.split("/home/user/file")   # ("/home/user", "file")
os.path.splitext("file.tar.gz")    # ("file.tar", ".gz")
os.path.basename("/path/file.txt") # "file.txt"
os.path.dirname("/path/file.txt")  # "/path"
os.path.abspath("file.txt")        # absolute path
os.path.exists("file.txt")         # True/False
os.path.isfile("file.txt")         # True if file
os.path.isdir("dir")               # True if directory
os.path.getsize("file.txt")        # size in bytes
os.path.getmtime("file.txt")       # modification time

# Process
os.getpid()                    # current process ID
os.getppid()                   # parent process ID
os.system("ls -la")            # run shell command (deprecated)
os.urandom(16)                 # cryptographic random bytes

# Walk directory tree
for root, dirs, files in os.walk("."):
    for file in files:
        print(os.path.join(root, file))
```

## sys — System-Specific

```python
import sys

# Version info
sys.version           # "3.13.0 (main, ...)"
sys.version_info      # sys.version_info(major=3, minor=13, ...)
sys.platform          # "linux", "win32", "darwin"

# Arguments
sys.argv  # ["script.py", "--flag", "value"]

# Exit
sys.exit(0)
sys.exit("Error message")

# Paths
sys.path  # module search paths

# Limits
sys.getrecursionlimit()   # 1000
sys.setrecursionlimit(3000)
sys.maxsize               # max int (platform dependent)

# I/O
sys.stdin, sys.stdout, sys.stderr

# Modules
sys.modules  # dict of loaded modules
sys.builtin_module_names  # built-in modules
```

## math — Mathematical Functions

```python
import math

# Constants
math.pi       # 3.141592653589793
math.e        # 2.718281828459045
math.tau      # 6.283185307179586
math.inf      # float('inf')
math.nan      # float('nan')

# Functions
math.sqrt(16)     # 4.0
math.pow(2, 10)   # 1024.0
math.log(100, 10) # 2.0
math.log2(8)      # 3.0
math.log10(1000)  # 3.0
math.exp(1)       # 2.718...

# Rounding
math.ceil(3.2)    # 4
math.floor(3.8)   # 3
math.trunc(3.9)   # 3
math.fabs(-5)     # 5.0
math.factorial(5) # 120
math.gcd(12, 8)   # 4
math.lcm(4, 6)    # 12 (3.9+)

# Trigonometry
math.sin(math.pi / 2)  # 1.0
math.cos(0)            # 1.0
math.tan(0)            # 0.0
math.asin(1)           # 1.5707...
math.degrees(math.pi)  # 180.0
math.radians(180)      # 3.14159...

# Hyperbolic
math.sinh(0), math.cosh(0), math.tanh(0)

# Special
math.isclose(0.1 + 0.2, 0.3)  # True (handles float precision)
math.isfinite(42)    # True
math.isinf(math.inf) # True
math.isnan(math.nan) # True
math.copysign(3, -1) # -3.0
math.fmod(7, 3)      # 1.0
math.hypot(3, 4)     # 5.0 (Euclidean distance)
math.dist((0,0), (3,4))  # 5.0 (3.8+)

# comb and perm (3.8+)
math.comb(5, 2)  # 10 (combinations)
math.perm(5, 2)  # 20 (permutations)
```

## itertools — Iterator Functions

```python
import itertools

# Infinite iterators
itertools.count(10)        # 10, 11, 12, ...
itertools.count(10, 0.5)  # 10, 10.5, 11.0, ...
itertools.cycle("ABC")    # A, B, C, A, B, C, ...
itertools.repeat(42, 3)   # 42, 42, 42

# Terminating iterators
itertools.accumulate([1, 2, 3, 4])  # 1, 3, 6, 10
itertools.chain([1, 2], [3, 4])     # 1, 2, 3, 4
itertools.chain.from_iterable([[1,2], [3,4]])  # 1, 2, 3, 4
itertools.compress("ABCDEF", [1,0,1,0,1,0])  # A, C, E
itertools.dropwhile(lambda x: x < 3, [1,2,3,4,5])  # 3, 4, 5
itertools.takewhile(lambda x: x < 3, [1,2,3,4,5])  # 1, 2
itertools.filterfalse(lambda x: x % 2, [1,2,3,4])  # 2, 4
itertools.islice(range(10), 2, 8, 2)  # 2, 4, 6
itertools.starmap(pow, [(2,3), (3,2)])  # 8, 9
itertools.tee(range(5), 2)  # two independent iterators
itertools.zip_longest([1,2], [3,4,5], fillvalue=0)  # (1,3), (2,4), (0,5)

# Combinatorial
itertools.product("AB", "12")  # A1, A2, B1, B2
itertools.product("AB", repeat=2)  # AA, AB, BA, BB
itertools.permutations("ABC")  # ABC, ACB, BAC, BCA, CAB, CBA
itertools.combinations("ABC", 2)  # AB, AC, BC
itertools.combinations_with_replacement("ABC", 2)  # AA, AB, AC, BB, BC, CC

# groupby — group consecutive elements
data = [("A", 1), ("A", 2), ("B", 3), ("B", 4)]
for key, group in itertools.groupby(data, key=lambda x: x[0]):
    print(key, list(group))
# A [("A", 1), ("A", 2)]
# B [("B", 3), ("B", 4)]

# pairwise (3.10+)
list(itertools.pairwise([1, 2, 3, 4]))  # [(1,2), (2,3), (3,4)]

# batched (3.12+)
list(itertools.batched(range(10), 3))  # [(0,1,2), (3,4,5), (6,7,8), (9,)]
```

## functools — Higher-Order Functions

```python
import functools

# @lru_cache — LRU memoization
@functools.lru_cache(maxsize=128)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

fibonacci.cache_info()  # CacheInfo(hits=..., misses=..., maxsize=128, currsize=...)
fibonacci.cache_clear()

# @cache — unbounded cache (3.9+)
@functools.cache
def expensive(x):
    return compute(x)

# @cached_property
class DataSet:
    @functools.cached_property
    def stats(self):
        return compute_expensive_stats()  # computed once, cached

# @total_ordering — fill in missing comparison methods
@functools.total_ordering
class Student:
    def __init__(self, name, grade):
        self.name = name
        self.grade = grade

    def __eq__(self, other):
        return self.grade == other.grade

    def __lt__(self, other):
        return self.grade < other.grade
    # __le__, __gt__, __ge__ auto-generated

# @wraps — preserve function metadata in decorators
@functools.wraps(func)
def wrapper(*args, **kwargs):
    return func(*args, **kwargs)

# reduce
functools.reduce(lambda a, b: a + b, [1, 2, 3, 4])  # 10
functools.reduce(lambda a, b: a * b, [1, 2, 3, 4], 1)  # 24

# partial
double = functools.partial(lambda x, y: x * y, 2)
double(5)  # 10

# singledispatch — overload by type
@functools.singledispatch
def process(data):
    return str(data)

@process.register
def _(data: int):
    return f"int: {data}"

@process.register
def _(data: list):
    return f"list of {len(data)}"

# singledispatchmethod (3.8+) — for class methods
class Processor:
    @functools.singledispatchmethod
    def process(self, data):
        return str(data)

    @process.register
    def _(self, data: int):
        return f"int: {data}"
```

## datetime — Date and Time

```python
from datetime import datetime, date, time, timedelta, timezone, tzinfo

# Current
now = datetime.now()          # local time
utc_now = datetime.now(timezone.utc)  # UTC
today = date.today()
current_time = time.now()

# Create
dt = datetime(2025, 7, 16, 14, 30, 0)
d = date(2025, 7, 16)
t = time(14, 30, 0)

# From ISO string
datetime.fromisoformat("2025-07-16T14:30:00")
date.fromisoformat("2025-07-16")

# From string with format
datetime.strptime("16/07/2025 14:30", "%d/%m/%Y %H:%M")

# Format to string
dt.strftime("%Y-%m-%d %H:%M:%S")  # "2025-07-16 14:30:00"
dt.strftime("%B %d, %Y")          # "July 16, 2025"
dt.isoformat()                    # "2025-07-16T14:30:00"

# Access components
dt.year, dt.month, dt.day
dt.hour, dt.minute, dt.second
dt.weekday()  # 0=Monday, 6=Sunday
dt.isoweekday()  # 1=Monday, 7=Sunday

# Timedelta — duration
delta = timedelta(days=7, hours=3)
future = now + delta
past = now - timedelta(days=30)

# Difference
diff = datetime(2025, 12, 31) - datetime(2025, 1, 1)
diff.days  # 364
diff.total_seconds()

# Timezone
from zoneinfo import ZoneInfo  # 3.9+

dt_tz = datetime(2025, 7, 16, 14, 30, tzinfo=ZoneInfo("America/New_York"))
dt_utc = dt_tz.astimezone(timezone.utc)

# Timezone-aware now
ny_time = datetime.now(ZoneInfo("America/New_York"))

# Timestamp
dt.timestamp()  # Unix timestamp (float)
datetime.fromtimestamp(1234567890)

# Common format codes
# %Y — year (4 digit), %m — month (01-12), %d — day (01-31)
# %H — hour (24h), %M — minute, %S — second
# %I — hour (12h), %p — AM/PM
# %A — weekday name, %a — abbreviated weekday
# %B — month name, %b — abbreviated month
# %j — day of year, %U — week number (Sunday first)
# %Z — timezone name, %z — UTC offset
```

## json — JSON Encoding/Decoding

```python
import json

# Parse JSON string
data = json.loads('{"name": "Alice", "age": 30}')
data["name"]  # "Alice"

# Parse JSON file
with open("data.json") as f:
    data = json.load(f)

# Serialize to JSON string
json.dumps({"name": "Alice", "age": 30})  # '{"name": "Alice", "age": 30}'

# Pretty print
json.dumps(data, indent=2)
json.dumps(data, indent=2, sort_keys=True)

# Serialize to file
with open("output.json", "w") as f:
    json.dump(data, f, indent=2)

# Custom serialization
from datetime import datetime

class MyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

json.dumps({"time": datetime.now()}, cls=MyEncoder)

# Custom deserialization
def as_datetime(dct):
    if "time" in dct:
        dct["time"] = datetime.fromisoformat(dct["time"])
    return dct

json.loads('{"time": "2025-07-16T14:30:00"}', object_hook=as_datetime)

# Non-standard but useful
json.dumps(float("inf"))  # "Infinity" (not valid JSON)
json.dumps(float("nan"))  # "NaN"
# Use allow_nan=False to enforce strict JSON
```

## re — Regular Expressions

```python
import re

# Patterns
pattern = r"\d+"  # raw string recommended
re.findall(r"\d+", "abc123def456")  # ["123", "456"]
re.search(r"\d+", "abc123def")      # <Match object>
re.match(r"\d+", "123abc")          # <Match object> (match at start)
re.fullmatch(r"\d+", "123")         # <Match object> (entire string)

# Match object
m = re.search(r"(\w+)@(\w+)\.(\w+)", "user@example.com")
m.group(0)  # "user@example.com" (full match)
m.group(1)  # "user" (first group)
m.group(2)  # "example"
m.group(3)  # "com"
m.groups()  # ("user", "example", "com")
m.start()   # 0
m.end()     # 15
m.span()    # (0, 15)

# Named groups
m = re.search(r"(?P<user>\w+)@(?P<domain>\w+\.\w+)", "user@example.com")
m.group("user")    # "user"
m.group("domain")  # "example.com"

# Substitute
re.sub(r"\d+", "#", "abc123def456")  # "abc#def#"
re.sub(r"(\w+)@(\w+)", r"\2/\1", "user@example")  # "example/user"
re.sub(r"\d+", lambda m: str(int(m.group()) * 2), "abc10def20")  # "abc20def40"

# Split
re.split(r"[,\s]+", "a, b, c d")  # ["a", "b", "c", "d"]
re.split(r"(\d+)", "abc123def456")  # ["abc", "123", "def", "456", ""]

# Compile (reuse pattern)
email_re = re.compile(r"[\w.]+@[\w]+\.[\w]+")
email_re.search("contact: alice@example.com")
email_re.findall("alice@a.com bob@b.com")

# Flags
re.IGNORECASE  # case insensitive
re.MULTILINE   # ^ and $ match line boundaries
re.DOTALL      # . matches newlines
re.VERBOSE     # allow whitespace and comments in pattern

pattern = re.compile(r"""
    ^                   # start of line
    (?P<user>[\w.]+)    # username
    @                   # at sign
    (?P<domain>[\w.]+)  # domain
    $                   # end of line
""", re.VERBOSE | re.IGNORECASE)

# Common patterns
r"\d"        # digit
r"\w"        # word character [a-zA-Z0-9_]
r"\s"        # whitespace
r"."         # any char (except newline)
r"[a-z]"     # character range
r"[^abc]"    # negated set
r"a+"        # one or more
r"a*"        # zero or more
r"a?"        # zero or one
r"a{3}"      # exactly 3
r"a{2,5}"    # between 2 and 5
r"^abc"      # start of string
r"abc$"      # end of string
r"\bword\b"  # word boundary
r"(?:abc)"   # non-capturing group
r"(?=abc)"   # lookahead
r"(?!abc)"   # negative lookahead
r"(?<=abc)"  # lookbehind
```

## argparse — Command-Line Arguments

```python
import argparse

parser = argparse.ArgumentParser(description="Process some data")

# Positional argument
parser.add_argument("input", help="Input file path")

# Optional argument
parser.add_argument("-o", "--output", default="out.txt", help="Output file")
parser.add_argument("-v", "--verbose", action="store_true", help="Verbose mode")
parser.add_argument("-n", "--count", type=int, default=1, help="Repeat count")
parser.add_argument("--mode", choices=["fast", "slow"], default="fast")

# Mutually exclusive
group = parser.add_mutually_exclusive_group()
group.add_argument("--quiet", action="store_true")
group.add_argument("--verbose", action="store_true")

# Parse
args = parser.parse_args()
print(args.input)
print(args.output)
print(args.verbose)

# nargs
parser.add_argument("files", nargs="+")  # one or more
parser.add_argument("files", nargs="*")  # zero or more
parser.add_argument("files", nargs="?")  # zero or one (optional)

# Subcommands
subparsers = parser.add_subparsers(dest="command")

init_parser = subparsers.add_parser("init")
init_parser.add_argument("--name", required=True)

run_parser = subparsers.add_parser("run")
run_parser.add_argument("script")
```

## random — Random Numbers

```python
import random

# Basic
random.random()          # 0.0 <= x < 1.0
random.randint(1, 10)   # integer 1-10 inclusive
random.uniform(1.0, 10.0)  # float in range

# From sequence
random.choice(["a", "b", "c"])       # single random element
random.choices(["a", "b", "c"], k=5) # 5 random (with replacement)
random.sample(range(100), k=10)      # 10 unique random
random.shuffle(my_list)              # shuffle in-place

# Range
random.randrange(0, 100, 2)  # even number 0-98

# Seed for reproducibility
random.seed(42)
random.random()  # deterministic

# Random string
import string
"".join(random.choices(string.ascii_letters + string.digits, k=16))

# secrets — cryptographically secure (use instead of random for security)
import secrets
secrets.token_hex(16)   # 32-char hex string
secrets.token_urlsafe(16)  # URL-safe token
secrets.choice("abcdef")
secrets.randbelow(100)
```
