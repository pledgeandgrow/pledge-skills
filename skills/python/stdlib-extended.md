# Standard Library — Extended

**Docs:** https://docs.python.org/3/library/

## threading — Thread-Based Parallelism

```python
import threading

t = threading.Thread(target=func, args=(1, 2))
t.start()
t.join()

# Daemon thread
t = threading.Thread(target=func, daemon=True)

# Lock
lock = threading.Lock()
with lock:
    shared_resource()

# RLock, Event, Condition, Semaphore, Barrier
rlock = threading.RLock()
event = threading.Event()
event.set(); event.wait(timeout=5)
cond = threading.Condition()
with cond:
    cond.wait(); cond.notify_all()
sem = threading.Semaphore(3)
with sem: limited()
barrier = threading.Barrier(4)
barrier.wait()

# Timer
timer = threading.Timer(5.0, delayed_func)
timer.start(); timer.cancel()

# ThreadLocal
local = threading.local()
local.x = 42  # thread-specific

# Info
threading.current_thread()
threading.active_count()
threading.enumerate()
```

## multiprocessing — Process-Based Parallelism

```python
import multiprocessing as mp

if __name__ == "__main__":
    p = mp.Process(target=func, args=(1,))
    p.start(); p.join()
    p.is_alive(); p.pid; p.exitcode

    # Queue
    q = mp.Queue()
    q.put(42); q.get()

    # Pipe
    parent, child = mp.Pipe()
    parent.send(42); child.recv()

    # Shared memory
    val = mp.Value('i', 0)
    arr = mp.Array('d', [1.0, 2.0])

    # Manager
    manager = mp.Manager()
    shared_dict = manager.dict()
    shared_list = manager.list()

    # Pool
    with mp.Pool(4) as pool:
        results = pool.map(func, range(100))
        results = pool.starmap(func, [(1,2), (3,4)])
        result = pool.apply_async(func, (arg,)).get(timeout=10)
```

## concurrent.futures — High-Level Parallelism

```python
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor, as_completed

with ThreadPoolExecutor(max_workers=4) as executor:
    future = executor.submit(func, arg)
    result = future.result()
    future.done(); future.exception()

    results = executor.map(func, range(100))

    futures = [executor.submit(func, i) for i in range(100)]
    for f in as_completed(futures):
        print(f.result())

# Process pool
with ProcessPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(cpu_heavy, range(100)))

# Callback
future.add_done_callback(lambda f: print(f.result()))
```

## queue — Synchronized Queue

```python
import queue

q = queue.Queue(maxsize=10)
q.put(42); q.get(); q.task_done(); q.join()

lq = queue.LifoQueue()  # stack
pq = queue.PriorityQueue()
pq.put((2, "low")); pq.put((1, "high"))
pq.get()  # (1, "high")

sq = queue.SimpleQueue()  # unbounded
q.qsize(); q.empty(); q.full()
q.put_nowait(42); q.get_nowait()
```

## socket — Low-Level Networking

```python
import socket

# TCP client
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect(("example.com", 80))
    s.sendall(b"GET / HTTP/1.1\r\nHost: example.com\r\n\r\n")
    data = s.recv(4096)

# TCP server
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind(("localhost", 8888))
server.listen(5)
conn, addr = server.accept()
conn.recv(1024); conn.sendall(b"response"); conn.close()

# UDP
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.sendto(b"data", ("host", 9999))
data, addr = s.recvfrom(1024)

# Timeout
s.settimeout(5.0)

# DNS
socket.getaddrinfo("example.com", 80)
socket.gethostname()
```

## hashlib & hmac — Secure Hashes

```python
import hashlib, hmac

hashlib.sha256(b"hello").hexdigest()
h = hashlib.sha256(); h.update(b"a"); h.update(b"b"); h.hexdigest()
hashlib.md5(b"data").hexdigest()  # not for security
hashlib.blake2b(b"data").hexdigest()

# File hashing
with open("file.bin", "rb") as f:
    h = hashlib.sha256()
    for chunk in iter(lambda: f.read(8192), b""):
        h.update(chunk)

# HMAC
hmac.new(key, msg, hashlib.sha256).hexdigest()
hmac.compare_digest(d1, d2)  # constant-time
```

## base64 — Encoding

```python
import base64

base64.b64encode(b"hello")   # b'aGVsbG8='
base64.b64decode(b'aGVsbG8=')  # b'hello'
base64.urlsafe_b64encode(b"data")
base64.b32encode(b"data")
base64.b85encode(b"data")
```

## struct — Binary Data

```python
import struct

packed = struct.pack("i4sf", 42, b"test", 3.14)
values = struct.unpack("i4sf", packed)  # (42, b'test', 3.14)

buf = bytearray(12)
struct.pack_into("i4sf", buf, 0, 42, b"test", 3.14)
struct.unpack_from("i4sf", buf, 0)

# Byte order: < little, > big, ! network
struct.pack(">i", 42)
```

## decimal — Exact Decimal Arithmetic

```python
from decimal import Decimal, getcontext, ROUND_HALF_UP

Decimal("0.1") + Decimal("0.2")  # Decimal('0.3') — exact
getcontext().prec = 50
Decimal("3.14159").quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
Decimal("100") * Decimal("1.05")
```

## fractions — Rational Numbers

```python
from fractions import Fraction

Fraction(1, 3) + Fraction(1, 6)  # Fraction(1, 2)
Fraction(6, 4)  # Fraction(3, 2) — auto-reduces
Fraction("3/7"); Fraction(Decimal("0.5"))  # Fraction(1, 2)
float(Fraction(1, 3))  # 0.333...
```

## statistics — Statistical Functions

```python
import statistics

data = [1, 2, 3, 4, 5, 5, 6, 7, 8, 9]
statistics.mean(data)
statistics.median(data)
statistics.mode(data)
statistics.multimode([1, 1, 2, 2, 3])  # [1, 2]
statistics.stdev(data)   # sample
statistics.pstdev(data)  # population
statistics.variance(data)
statistics.quantiles(data, n=4)
statistics.harmonic_mean([1, 2, 3])
statistics.geometric_mean([1, 2, 3])
```

## time — Time Access

```python
import time

time.time()       # epoch seconds (float)
time.time_ns()    # nanoseconds (int)
time.monotonic()  # unaffected by system time changes
time.perf_counter()  # highest resolution
time.sleep(1.5)

t = time.localtime()  # struct_time
t.tm_year, t.tm_mon, t.tm_mday
time.strftime("%Y-%m-%d %H:%M:%S", t)
time.strptime("2025-07-16", "%Y-%m-%d")
time.gmtime()  # UTC
time.ctime()   # 'Wed Jul 16 14:30:00 2025'
```

## sqlite3 — SQLite Database

```python
import sqlite3

conn = sqlite3.connect("database.db")
conn = sqlite3.connect(":memory:")  # in-memory

cursor = conn.cursor()
cursor.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)")
cursor.execute("INSERT INTO users (name, age) VALUES (?, ?)", ("Alice", 30))
cursor.execute("SELECT * FROM users WHERE age > ?", (25))

rows = cursor.fetchall()
row = cursor.fetchone()
rows = cursor.fetchmany(10)

# Row factory
conn.row_factory = sqlite3.Row
row = cursor.execute("SELECT * FROM users").fetchone()
row["name"]  # access by column name

# Executemany
cursor.executemany("INSERT INTO users VALUES (?, ?, ?)", [
    (1, "Alice", 30), (2, "Bob", 25),
])

# Transaction
conn.commit(); conn.rollback()

with conn:
    conn.execute("INSERT INTO users VALUES (?, ?, ?)", (3, "Carol", 35))

conn.close()

# Autocommit mode (3.12+)
conn = sqlite3.connect("db.db", autocommit=True)

# Context manager — commits on success, rolls back on exception
with sqlite3.connect("db.db") as conn:
    conn.execute("INSERT ...")

# Backup database
src = sqlite3.connect("source.db")
dst = sqlite3.connect("backup.db")
src.backup(dst)
dst.close()
src.close()

# Dump SQL
for line in conn.iterdump():
    print(line)

# Custom adapters — Python type → SQLite
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

def adapt_point(point):
    return f"{point.x};{point.y}"

sqlite3.register_adapter(Point, adapt_point)
conn.execute("INSERT INTO points VALUES (?)", (Point(1, 2),))

# Custom converters — SQLite → Python type
def convert_point(s):
    x, y = map(int, s.split(b";"))
    return Point(x, y)

sqlite3.register_converter("POINT", convert_point)
conn = sqlite3.connect("db.db", detect_types=sqlite3.PARSE_DECLTYPES)
conn.execute("CREATE TABLE points (p POINT)")
conn.execute("SELECT p FROM points").fetchone()[0]  # Point object

# Load extension
conn.enable_load_extension(True)
conn.load_extension("mod_spatialite")

# Constants
sqlite3.PARSE_DECLTYPES   # parse column types
sqlite3.PARSE_COLNAMES    # parse column names
sqlite3.SQLITE_OK         # result codes
sqlite3.complete_statement("SELECT * FROM users;")  # True if complete
```

## inspect — Inspect Live Objects

```python
import inspect

inspect.getsource(func)
inspect.getfile(func)
sig = inspect.signature(func)
for name, param in sig.parameters.items():
    print(name, param.default, param.annotation)

inspect.isfunction(func)
inspect.isclass(MyClass)
inspect.iscoroutine(coro)
inspect.getmembers(obj)
inspect.getmro(MyClass)
inspect.currentframe()
```

## traceback — Stack Traces

```python
import traceback

try:
    risky()
except Exception:
    traceback.print_exc()
    tb_str = traceback.format_exc()

traceback.print_stack()
traceback.format_exception(exc_type, exc_value, tb)
```

## gc — Garbage Collector

```python
import gc

gc.collect()  # returns collected count
gc.enable(); gc.disable(); gc.isenabled()
gc.get_stats(); gc.get_count()
gc.get_threshold(); gc.set_threshold(500, 10, 10)
gc.get_referrers(obj); gc.get_referents(obj)
gc.set_debug(gc.DEBUG_LEAK)
```

## weakref — Weak References

```python
import weakref

ref = weakref.ref(obj)
obj2 = ref()  # obj or None if collected

ref = weakref.ref(obj, lambda r: print("collected"))

d = weakref.WeakValueDictionary()
d["key"] = obj  # doesn't prevent collection

ws = weakref.WeakSet()
ws.add(obj)

weakref.finalize(obj, cleanup_func, arg1)

proxy = weakref.proxy(obj)
proxy.method()  # acts like obj, ReferenceError if collected
```

## types — Dynamic Type Creation

```python
import types

MyClass = types.new_class("MyClass", (Base,), exec_body=lambda ns: ns.update({"x": 42}))
ns = types.SimpleNamespace(x=1, y=2)
ns.z = 3
method = types.MethodType(func, obj)
mod = types.ModuleType("mymodule")

# Read-only dict view
proxy = types.MappingProxyType({"a": 1})
# proxy["b"] = 2  # TypeError
```

## operator — Operators as Functions

```python
import operator

operator.add(1, 2); operator.sub(5, 2); operator.mul(3, 4)
operator.itemgetter("name")({"name": "Alice"})  # "Alice"
operator.attrgetter("age")(person)  # person.age
operator.methodcaller("upper")("hello")  # "HELLO"

sorted(users, key=operator.attrgetter("age"))
sorted(data, key=operator.itemgetter("name"))
```

## zipfile / tarfile — Archives

```python
import zipfile, tarfile

# ZIP read
with zipfile.ZipFile("archive.zip") as zf:
    zf.namelist()
    zf.extractall("output")
    with zf.open("file.txt") as f:
        f.read()

# ZIP write
with zipfile.ZipFile("new.zip", "w") as zf:
    zf.write("file.txt")

# TAR
with tarfile.open("archive.tar.gz", "r:gz") as tf:
    tf.extractall("output")
with tarfile.open("new.tar.gz", "w:gz") as tf:
    tf.add("file.txt")
```

## configparser — Config Files

```python
import configparser

config = configparser.ConfigParser()
config.read("config.ini")
config["database"]["host"]
config.get("database", "port", fallback="5432")
config.getint("database", "port")
config.getboolean("debug", "enabled")

config["new"] = {"key": "value"}
with open("config.ini", "w") as f:
    config.write(f)
```

## tomllib — Parse TOML (3.11+)

```python
import tomllib

with open("pyproject.toml", "rb") as f:
    data = tomllib.load(f)

data = tomllib.loads('name = "test"\nversion = "1.0"')
```

## ipaddress — IP Addresses

```python
import ipaddress

addr = ipaddress.ip_address("192.168.1.1")
addr.is_private; addr.version  # True, 4

net = ipaddress.ip_network("192.168.1.0/24")
net.netmask; net.broadcast_address
ipaddress.ip_address("192.168.1.5") in net  # True
list(net.hosts())
```

## urllib — URL Handling

```python
from urllib.parse import urlparse, urlencode, parse_qs, quote, unquote
from urllib.request import urlopen, Request

parsed = urlparse("https://example.com/path?x=1&y=2#frag")
parsed.scheme; parsed.netloc; parsed.path; parsed.query

urlencode({"q": "python", "page": 2})  # "q=python&page=2"
parse_qs("x=1&y=2")  # {"x": ["1"], "y": ["2"]}
quote("hello world")  # "hello%20world"
unquote("hello%20world")  # "hello world"

with urlopen("https://example.com") as response:
    html = response.read().decode()
    response.status

req = Request("https://example.com", headers={"User-Agent": "MyApp"})
with urlopen(req) as response:
    data = response.read()
```

## ctypes — C Foreign Function Interface

```python
import ctypes
from ctypes import c_int, c_double, c_char_p, POINTER, Structure, byref

libc = ctypes.CDLL("libc.so.6")  # Linux
libc.printf(b"Hello, %s!\n", b"World")

libc.sqrt.argtypes = [c_double]
libc.sqrt.restype = c_double
libc.sqrt(16.0)  # 4.0

# Structure
class Point(Structure):
    _fields_ = [("x", c_int), ("y", c_int)]

p = Point(1, 2)
p.x; p.y
```

## Descriptors

```python
# Descriptor protocol: __get__, __set__, __delete__
class Validated:
    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, obj, objtype=None):
        return obj.__dict__.get(self.name)

    def __set__(self, obj, value):
        if not isinstance(value, (int, float)):
            raise TypeError(f"{self.name} must be numeric")
        obj.__dict__[self.name] = value

class Product:
    price = Validated()

    def __init__(self, price):
        self.price = price

p = Product(10.0)
p.price  # 10.0
# p.price = "abc"  # TypeError

# Non-data descriptor (only __get__) — lower priority than instance dict
# Data descriptor (__get__ + __set__) — higher priority than instance dict

# property is a data descriptor
# classmethod and staticmethod are non-data descriptors
```

## GIL — Global Interpreter Lock

```python
# The GIL ensures only one thread executes Python bytecode at a time
# Implications:
# - threading is good for I/O-bound tasks (network, file, sleep)
# - threading does NOT speed up CPU-bound tasks (GIL serializes them)
# - Use multiprocessing for CPU-bound parallelism
# - Use asyncio for I/O-bound concurrency (single-threaded, cooperative)

# Free-threaded CPython (3.13+, experimental)
# Build: python3.13t — no GIL
# Enables true threading parallelism
# Not all C extensions compatible yet

# Check if free-threaded
import sys
sys._is_gil_enabled()  # True if GIL is on
```

## ssl — TLS/SSL

```python
import ssl, socket

ctx = ssl.create_default_context()
with socket.create_connection(("example.com", 443)) as sock:
    with ctx.wrap_socket(sock, server_hostname="example.com") as ssock:
        ssock.sendall(b"GET / HTTP/1.1\r\nHost: example.com\r\n\r\n")
        data = ssock.recv(4096)
        ssock.version()  # 'TLSv1.3'

# Server
ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ctx.load_cert_chain("cert.pem", "key.pem")
```

## http.client — HTTP Client

```python
import http.client

conn = http.client.HTTPSConnection("example.com")
conn.request("GET", "/path")
response = conn.getresponse()
response.status  # 200
data = response.read().decode()
conn.close()

conn.request("POST", "/users", body='{"name":"Alice"}',
             headers={"Content-Type": "application/json"})
```

## http.server — HTTP Server

```python
from http.server import HTTPServer, BaseHTTPRequestHandler

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(b"Hello!")

    def do_POST(self):
        length = int(self.headers["Content-Length"])
        body = self.rfile.read(length)
        self.send_response(201)
        self.end_headers()

HTTPServer(("localhost", 8080), Handler).serve_forever()
```

## socketserver — Network Server Framework

```python
from socketserver import TCPServer, ThreadingTCPServer, BaseRequestHandler

class EchoHandler(BaseRequestHandler):
    def handle(self):
        while True:
            data = self.request.recv(1024)
            if not data: break
            self.request.sendall(data)

with ThreadingTCPServer(("localhost", 8888), EchoHandler) as server:
    server.serve_forever()
```

## uuid — UUIDs

```python
import uuid

uuid.uuid4()  # random
uuid.uuid1()  # time + MAC
uuid.uuid5(uuid.NAMESPACE_DNS, "example.com")  # SHA-1
str(uuid.uuid4())
```

## webbrowser & mimetypes

```python
import webbrowser, mimetypes

webbrowser.open("https://example.com")
webbrowser.open_new_tab("https://example.com")

mimetypes.guess_type("file.html")  # ('text/html', None)
mimetypes.guess_extension("text/html")  # '.html'
```

## email — Email Handling

```python
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib

msg = MIMEMultipart()
msg["From"] = "alice@example.com"
msg["To"] = "bob@example.com"
msg["Subject"] = "Hello"
msg.attach(MIMEText("Hello, Bob!", "plain"))

with smtplib.SMTP("smtp.example.com", 587) as server:
    server.starttls()
    server.login("user", "password")
    server.send_message(msg)

# Parse email
import email
with open("email.eml") as f:
    msg = email.message_from_file(f)
    msg["Subject"]
    for part in msg.walk():
        part.get_content_type()
        part.get_payload()
```

## smtplib / imaplib / poplib — Mail Protocols

```python
import smtplib, imaplib, poplib

# SMTP
with smtplib.SMTP("smtp.gmail.com", 587) as s:
    s.starttls()
    s.login("user@gmail.com", "app_password")
    s.sendmail("from@a.com", "to@b.com", "Subject: Test\n\nBody")

# IMAP
with imaplib.IMAP4_SSL("imap.gmail.com") as mail:
    mail.login("user@gmail.com", "app_password")
    mail.select("inbox")
    status, messages = mail.search(None, "ALL")
    for num in messages[0].split():
        _, data = mail.fetch(num, "(RFC822)")

# POP3
with poplib.POP3_SSL("pop.gmail.com") as mail:
    mail.login("user", "pass")
    mail.stat()  # (count, size)
```

## html.parser — HTML Parsing

```python
from html.parser import HTMLParser
import html

class MyParser(HTMLParser):
    def handle_starttag(self, tag, attrs):
        print(f"Start: {tag} {attrs}")
    def handle_endtag(self, tag):
        print(f"End: {tag}")
    def handle_data(self, data):
        print(f"Data: {data.strip()}")

parser = MyParser()
parser.feed('<html><body><h1>Title</h1></body></html>')

html.unescape("&lt;hello&gt;")  # "<hello>"
html.escape("<hello>")  # "&lt;hello&gt;"
```

## xml.etree.ElementTree — XML Parsing

```python
import xml.etree.ElementTree as ET

# Parse
tree = ET.parse("file.xml")
root = tree.getroot()
root.tag; root.attrib

for child in root:
    print(child.tag, child.attrib)

elem = root.find("child")
elems = root.findall(".//nested")
elem.text; elem.get("attr")

# Build
root = ET.Element("root")
child = ET.SubElement(root, "child")
child.set("name", "value")
child.text = "content"
ET.ElementTree(root).write("out.xml", encoding="utf-8", xml_declaration=True)

xml_str = ET.tostring(root, encoding="unicode")
ET.fromstring("<root><child/></root>")
```

## string — Constants and Templates

```python
import string
from string import Template

string.ascii_letters; string.digits; string.punctuation; string.whitespace

# Template — safe substitution
t = Template("Hello, $name! You have $count messages.")
t.substitute(name="Alice", count=5)
t.safe_substitute(name="Alice")  # leaves $count as-is
```

## textwrap — Text Wrapping

```python
import textwrap

textwrap.wrap("long text...", width=40)   # list of lines
textwrap.fill("long text...", width=40)   # single string with newlines
textwrap.shorten("long text...", width=40)  # truncate with [...]
textwrap.dedent("  indented\n  text")     # remove common whitespace
textwrap.indent("line1\nline2", "  ")     # add prefix to each line
```

## difflib — Comparing Sequences

```python
import difflib

list(difflib.unified_diff(["a\n","b\n"], ["a\n","c\n"], fromfile="x", tofile="y"))

sm = difflib.SequenceMatcher(None, "hello world", "hello python")
sm.ratio()  # 0.0-1.0 similarity
list(sm.get_opcodes())

difflib.get_close_matches("appel", ["apple", "pear", "banana"])  # ["apple"]
```

## unicodedata — Unicode Database

```python
import unicodedata

unicodedata.name("é")     # 'LATIN SMALL LETTER E WITH ACUTE'
unicodedata.lookup("LATIN SMALL LETTER E WITH ACUTE")  # 'é'
unicodedata.category("A") # 'Lu'
unicodedata.normalize("NFC", "é")  # NFC, NFD, NFKC, NFKD
```

## codecs — Codec Registry

```python
import codecs

codecs.encode("hello", "rot_13")  # 'uryyb'
codecs.decode("uryyb", "rot_13")  # 'hello'

with codecs.open("file.txt", "r", encoding="utf-8") as f:
    f.read()

codecs.BOM_UTF8  # b'\xef\xbb\xbf'
```

## numbers — Numeric ABCs

```python
from numbers import Number, Integral, Rational, Real, Complex

isinstance(42, Integral)   # True
isinstance(3.14, Real)     # True
isinstance(1+2j, Complex)  # True
# Hierarchy: Number -> Complex -> Real -> Rational -> Integral
```

## pdb — Python Debugger

```python
import pdb

# Breakpoint (3.7+)
breakpoint()  # enters pdb
# or: pdb.set_trace()

# Commands: n=next, s=step, c=continue, b=line=set breakpoint,
# p=print, l=list, w=where, u/d=up/down stack, a=args, q=quit

# Post-mortem
import sys
try:
    risky()
except Exception:
    extype, value, tb = sys.exc_info()
    pdb.post_mortem(tb)

# Run under pdb: python -m pdb script.py
```

## profile & cProfile — Profilers

```python
import cProfile, pstats

cProfile.run("my_function()", "profile_stats")
stats = pstats.Stats("profile_stats")
stats.sort_stats("cumulative").print_stats(20)

# Context manager
with cProfile.Profile() as pr:
    my_function()
pr.print_stats()

# CLI: python -m cProfile -s cumulative script.py
```

## timeit — Measure Execution Time

```python
import timeit

timeit.timeit("sum(range(100))", number=10000)
timeit.timeit("math.sqrt(16)", setup="import math", number=100000)

# CLI: python -m timeit -n 10000 -s "import math" "math.sqrt(16)"
```

## tracemalloc — Memory Allocation Tracing

```python
import tracemalloc

tracemalloc.start()
snap1 = tracemalloc.take_snapshot()
# ... run code ...
snap2 = tracemalloc.take_snapshot()

for stat in snap2.compare_to(snap1, "lineno")[:10]:
    print(stat)

for stat in snap2.statistics("lineno")[:10]:
    print(stat)

tracemalloc.stop()
```

## faulthandler — Debug Segfaults

```python
import faulthandler

faulthandler.enable()  # dump traceback on crash
faulthandler.dump_traceback_later(30)  # watchdog: 30s timeout
# CLI: python -X faulthandler script.py
```

## atexit — Exit Handlers

```python
import atexit

@atexit.register
def cleanup():
    print("Cleaning up...")

atexit.register(func, arg1, arg2)
atexit.unregister(func)
# Handlers run in LIFO order on normal exit
# Not called on os._exit() or kill signals
```

## __main__ & runpy — Top-Level Environment

```python
# __name__ == "__main__" when run directly
if __name__ == "__main__":
    main()

# runpy — run modules as scripts
import runpy
runpy.run_module("mypackage.mymodule", run_name="__main__")
runpy.run_path("script.py", run_name="__main__")
# CLI: python -m mypackage.mymodule
```

## __future__ — Future Statements

```python
from __future__ import annotations  # postponed evaluation (3.7+)
# In 3.13+, annotations are lazy by default (PEP 649)
# Historical (already default): print_function, division, absolute_import
```

## pydoc — Documentation Generator

```python
import pydoc

pydoc.render_doc(obj)  # text documentation
pydoc.doc(obj)         # display in pager
# CLI: pydoc mymodule | pydoc -p 1234 | pydoc -b
# help(obj)  # interactive help (uses pydoc)
```

## site & sysconfig — Configuration

```python
import site, sysconfig

site.getusersitepackages()  # user site-packages path
site.getsitepackages()      # system site-packages paths

sysconfig.get_python_version()  # "3.13"
sysconfig.get_platform()        # "linux-x86_64"
sysconfig.get_path("purelib")   # site-packages path
```

## errno — System Error Numbers

```python
import errno

errno.ENOENT  # 2 — No such file or directory
errno.EACCES  # 13 — Permission denied
errno.EEXIST  # 17 — File exists

try:
    open("missing.txt")
except OSError as e:
    if e.errno == errno.ENOENT:
        print("File not found")
```

## platform — Platform Identification

```python
import platform

platform.system()    # "Linux", "Windows", "Darwin"
platform.release()   # "6.5.0"
platform.machine()   # "x86_64", "arm64"
platform.python_version()  # "3.13.0"
platform.platform()  # full platform string
```

## getpass — Password Input

```python
import getpass

password = getpass.getpass("Enter password: ")
getpass.getuser()  # current username
```

## fnmatch & glob — Pattern Matching

```python
import fnmatch, glob

fnmatch.fnmatch("file.txt", "*.txt")  # True
fnmatch.fnmatchcase("FILE.TXT", "*.txt")  # False (case-sensitive)
fnmatch.filter(["a.txt", "b.py", "c.txt"], "*.txt")  # ["a.txt", "c.txt"]

glob.glob("*.py")
glob.glob("**/*.py", recursive=True)
```

## linecache — Random Access to Text Lines

```python
import linecache

linecache.getline("file.txt", 3)  # line 3 (1-indexed)
linecache.getlines("file.txt")    # list of all lines
linecache.clearcache()
```

## shelve — Persistent Object Storage

```python
import shelve

with shelve.open("mydb") as db:
    db["key"] = {"name": "Alice", "age": 30}
    data = db["key"]
    "key" in db
    del db["key"]
    list(db.keys())
```

## marshal & dbm — Low-Level Persistence

```python
import marshal, dbm

# marshal — internal serialization (faster, less portable than pickle)
data = marshal.dumps(func.__code__)
code = marshal.loads(data)

# dbm — simple key-value database
with dbm.open("cache", "c") as db:
    db["key"] = b"value"
    val = db["key"].decode()
```

## Compression — gzip, bz2, lzma, zlib

```python
import gzip, bz2, lzma, zlib

# gzip
with gzip.open("file.gz", "rt") as f:
    f.read()
with gzip.open("out.gz", "wt") as f:
    f.write("compressed")

# bz2 / lzma — same interface
with bz2.open("file.bz2", "rt") as f:
    f.read()
with lzma.open("file.xz", "rt") as f:
    f.read()

# zlib — low-level
compressed = zlib.compress(b"data" * 1000)
zlib.decompress(compressed)
```

## sched — Event Scheduler

```python
import sched, time

scheduler = sched.scheduler(time.time, time.sleep)
scheduler.enter(5, 1, func, (arg1,))       # delay=5s, priority=1
scheduler.enterabs(time.time() + 10, 1, func, (arg1,))  # absolute time
scheduler.run()
scheduler.cancel(event)
scheduler.empty()
```

## signal — Signal Handling

```python
import signal

def handler(signum, frame):
    print(f"Signal {signum} received")

signal.signal(signal.SIGINT, handler)    # Ctrl+C
signal.signal(signal.SIGTERM, handler)   # terminate

# Alarm (Unix)
signal.signal(signal.SIGALRM, lambda s,f: raise_timeout())
signal.alarm(5)  # 5 second alarm
signal.alarm(0)  # cancel

# Ignore / default
signal.signal(signal.SIGINT, signal.SIG_IGN)
signal.signal(signal.SIGINT, signal.SIG_DFL)
```

## mmap — Memory-Mapped Files

```python
import mmap

with open("file.bin", "r+b") as f:
    mm = mmap.mmap(f.fileno(), 0)  # 0 = whole file
    mm.read(100)
    mm.seek(0)
    mm[0:4] = b"new!"  # write if mode allows
    mm.close()

# Read-only
with open("file.bin", "rb") as f:
    with mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ) as mm:
        data = mm[10:20]
```

## tkinter — GUI (Brief)

```python
import tkinter as tk
from tkinter import ttk, messagebox, filedialog

root = tk.Tk()
root.title("My App")
root.geometry("400x300")

ttk.Label(root, text="Hello!").pack(padx=10, pady=10)
ttk.Button(root, text="Click",
           command=lambda: messagebox.showinfo("Hi", "Clicked!")).pack()
ttk.Entry(root, width=30).pack()

root.mainloop()
# ttk widgets: Button, Label, Entry, Combobox, Checkbutton,
# Radiobutton, Scale, Spinbox, Treeview, Notebook, Progressbar, etc.
```

## curses — Terminal UI (Brief)

```python
import curses

def main(stdscr):
    curses.curs_set(0)
    stdscr.addstr(0, 0, "Hello, curses!")
    stdscr.refresh()
    stdscr.getch()

curses.wrapper(main)

# Colors
curses.start_color()
curses.init_pair(1, curses.COLOR_RED, curses.COLOR_WHITE)
stdscr.addstr(0, 0, "Red on White", curses.color_pair(1))
```

## gettext & locale — Internationalization

```python
import gettext, locale

# gettext — message translation
t = gettext.translation("myapp", localedir="locales", languages=["fr"])
_ = t.gettext
print(_("Hello, World!"))  # translated if .mo file exists
# Or without translation: _ = gettext.gettext

# locale
locale.setlocale(locale.LC_ALL, "")
locale.getlocale()
locale.format_string("%.2f", 3.14159)
locale.currency(1234.56)
```

## copyreg — Register Pickle Support

```python
import copyreg

# Register custom pickle handler
def pickle_point(p):
    return Point, (p.x, p.y)

copyreg.pickle(Point, pickle_point)
copyreg.constructor(Point)
```

## pkgutil & importlib.resources — Package Utilities

```python
import pkgutil
from importlib import resources

# Iterate modules in package
for importer, modname, ispkg in pkgutil.iter_modules(["mypackage"]):
    print(modname, ispkg)

# Walk packages recursively
for importer, modname, ispkg in pkgutil.walk_packages(["mypackage"], "mypackage."):
    print(modname)

# Access package data files
with resources.files("mypackage").joinpath("data.txt").open("r") as f:
    content = f.read()
```

## ensurepip & zipapp — Packaging Utilities

```python
import ensurepip

# Bootstrap pip into an environment
ensurepip.bootstrap()

# zipapp — create executable zip archives
import zipapp
zipapp.create_archive("myapp_dir", "myapp.pyz", main="mymodule:main")
# Run: python myapp.pyz
```

## contextvars — Context Variables (3.7+)

```python
import contextvars

# Create context variable
request_id: contextvars.ContextVar[str] = contextvars.ContextVar("request_id")

# Set and get
request_id.set("abc123")
request_id.get()  # "abc123"

# Token for resetting
token = request_id.set("new")
request_id.reset(token)  # back to "abc123"

# Copy context
ctx = contextvars.copy_context()
ctx.run(func)  # run func in copied context
```

## calendar — Calendar Utilities

```python
import calendar

calendar.calendar(2025)           # full year as text
calendar.month(2025, 7)           # July 2025 as text
calendar.monthcalendar(2025, 7)   # weeks as list of lists
calendar.isleap(2025)             # False
calendar.leapdays(2000, 2025)     # 7
calendar.weekday(2025, 7, 16)     # 2 (Wednesday)
calendar.month_name[7]            # "July"
calendar.month_abbr[7]            # "Jul"
calendar.day_name[2]              # "Wednesday"
calendar.day_abbr[2]              # "Wed"

# HTMLCalendar / TextCalendar
calendar.TextCalendar().formatmonth(2025, 7)
calendar.HTMLCalendar().formatmonth(2025, 7)
```

## pprint — Pretty-Print Data Structures

```python
import pprint

data = {"users": [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]}

pprint.pprint(data, width=80, indent=2, sort_dicts=True)
pprint.pformat(data)  # return string instead of printing

# Custom PrettyPrinter
pp = pprint.PrettyPrinter(width=120, depth=3, compact=True)
pp.pprint(data)

# depth — limit nesting level
# compact — fit more items per line
```

## cmath — Complex Number Math

```python
import cmath

cmath.sqrt(-1)    # 1j (complex, unlike math.sqrt which raises)
cmath.phase(1+1j) # 0.785... (π/4)
cmath.polar(1+1j) # (1.414..., 0.785...) — (abs, phase)
cmath.rect(1.414, 0.785)  # (0.999+1j) — from polar
cmath.exp(1j * cmath.pi)  # (-1+0j) — Euler's identity
cmath.log(1+1j)
cmath.sin(1+1j); cmath.cos(1+1j); cmath.tan(1+1j)
cmath.asin(1+1j); cmath.acos(1+1j); cmath.atan(1+1j)
cmath.sinh(1+1j); cmath.cosh(1+1j); cmath.tanh(1+1j)
cmath.isclose(1+0j, 1+1e-10j)
cmath.isinf(complex('inf')); cmath.isnan(complex('nan'))
```

## logging.handlers — Additional Handlers

```python
import logging
import logging.handlers

logger = logging.getLogger("myapp")

# RotatingFileHandler — rotate by size
handler = logging.handlers.RotatingFileHandler(
    "app.log", maxBytes=10_000_000, backupCount=5
)

# TimedRotatingFileHandler — rotate by time
handler = logging.handlers.TimedRotatingFileHandler(
    "app.log", when="midnight", interval=1, backupCount=30
)

# SysLogHandler — send to syslog
handler = logging.handlers.SysLogHandler(address="/dev/log")

# SMTPHandler — email on error
handler = logging.handlers.SMTPHandler(
    mailhost=("smtp.example.com", 587),
    fromaddr="app@example.com",
    toaddrs=["admin@example.com"],
    subject="App Error"
)

# QueueHandler / QueueListener — non-blocking logging
import queue
log_queue = queue.Queue()
queue_handler = logging.handlers.QueueHandler(log_queue)
queue_listener = logging.handlers.QueueListener(
    log_queue, file_handler, console_handler
)
queue_listener.start()
```

## select & selectors — I/O Multiplexing

```python
import select

# select.select — wait for I/O on sockets/streams
readable, writable, exceptional = select.select(
    [sock1, sock2], [], [], timeout=5.0
)
for s in readable:
    data = s.recv(1024)

# selectors — higher-level, more efficient
from selectors import DefaultSelector, EVENT_READ, EVENT_WRITE

selector = DefaultSelector()
selector.register(sock1, EVENT_READ)
selector.register(sock2, EVENT_READ)

events = selector.select(timeout=5.0)
for key, mask in events:
    sock = key.fileobj
    data = sock.recv(1024)

selector.unregister(sock1)
selector.close()
```

## stat — File Status Constants

```python
import stat, os

st = os.stat("file.txt")

# Check file type
stat.S_ISREG(st.st_mode)  # regular file
stat.S_ISDIR(st.st_mode)  # directory
stat.S_ISLNK(st.st_mode)  # symlink (use lstat)

# Check permissions
stat.S_IMODE(st.st_mode)  # permission bits
st.st_mode & stat.S_IRUSR  # user read
st.st_mode & stat.S_IWUSR  # user write
st.st_mode & stat.S_IXUSR  # user execute

# File size and times
st.st_size     # size in bytes
st.st_mtime    # modification time
st.st_atime    # access time
st.st_ctime    # creation/change time
```

## reprlib — Repr with Size Limits

```python
import reprlib

reprlib.repr(list(range(100)))  # '[0, 1, 2, 3, 4, 5, ...]'
reprlib.repr("a" * 100)         # "'aaaaaaa...'"

# Custom Repr
r = reprlib.Repr()
r.maxlist = 5
r.maxstring = 20
r.repr([1, 2, 3, 4, 5, 6, 7, 8])
```

## filecmp — File and Directory Comparison

```python
import filecmp

filecmp.cmp("file1.txt", "file2.txt")          # True/False
filecmp.cmp("f1.txt", "f2.txt", shallow=False)  # deep comparison

# Directory comparison
d = filecmp.dircmp("dir1", "dir2")
d.left_only    # files only in dir1
d.right_only   # files only in dir2
d.diff_files   # files that differ
d.same_files   # identical files
d.common_dirs  # common subdirectories
```

## fileinput — Iterate Over Multiple Input Streams

```python
import fileinput

# Read from files given as args, or stdin if no args
for line in fileinput.input():
    process(line)

# With filenames
for line in fileinput.input(files=("f1.txt", "f2.txt")):
    print(fileinput.filename(), fileinput.lineno(), line, end="")

# inplace=True — redirect stdout to file (for in-place editing)
for line in fileinput.input("f.txt", inplace=True):
    print(line.rstrip().upper())  # overwrites file
```

## cmd — Line-Oriented Command Interpreters

```python
import cmd

class MyShell(cmd.Cmd):
    intro = "Welcome. Type help or ? to list commands.\n"
    prompt = "(myapp) "

    def do_greet(self, arg):
        print(f"Hello, {arg}!")

    def do_quit(self, arg):
        return True  # exit

    def help_greet(self):
        print("Greet someone: greet <name>")

MyShell().cmdloop()
# (myapp) greet Alice
# Hello, Alice!
# (myapp) quit
```

## readline — GNU Readline Interface

```python
import readline

# History file
readline.read_history_file(".python_history")
readline.write_history_file(".python_history")
readline.clear_history()
readline.get_history_length()
readline.set_history_length(1000)

# Completion
readline.parse_and_bind("tab: complete")
readline.set_completer(completer_func)  # func(text, state) -> str

# Add to history
readline.add_history("some command")
```

## rlcompleter — Completion for Readline

```python
import rlcompleter, readline

# Enable tab completion for Python objects
readline.parse_and_bind("tab: complete")
comp = rlcompleter.Completer()
readline.set_completer(comp.complete)

# Direct use
list(comp.complete("import o", 0))  # ['import os']
```

## stringprep — Internet String Preparation (RFC 3454)

```python
import stringprep

# Used for preparing strings for protocol comparison
# Typically used by SASL/XMPP libraries, not directly
stringprep.in_table_a1("\x00")  # True (mapped to nothing)
stringprep.in_table_b1(" ")     # True (space mapped to nothing)
stringprep.in_table_c11("A")    # False (ASCII space)
```

## netrc — .netrc File Processing

```python
import netrc

n = netrc.netrc()
n.hosts  # dict: {hostname: (login, account, password)}
n.authenticators("example.com")  # (login, account, password) or None
n.macros  # dict of macro definitions
```

## plistlib — Apple Property Lists

```python
import plistlib

# Write plist
data = {"name": "Test", "version": 1, "items": [1, 2, 3]}
with open("file.plist", "wb") as f:
    plistlib.dump(data, f)

# Read plist
with open("file.plist", "rb") as f:
    data = plistlib.load(f)

# From/to bytes
plist_bytes = plistlib.dumps(data, fmt=plistlib.FMT_XML)
plistlib.loads(plist_bytes)
plistlib.dumps(data, fmt=plistlib.FMT_BINARY)
```

## mailbox — Mailbox Manipulation

```python
import mailbox

# mbox format
mbox = mailbox.mbox("inbox.mbox")
for key, msg in mbox.iteritems():
    print(msg["Subject"])
    msg.get_payload()

# Add message
mbox.add(mailbox.mboxMessage(open("email.eml").read()))

# Maildir
maildir = mailbox.Maildir("~/Maildir")
for key in maildir.iterkeys():
    msg = maildir[key]

mbox.close()
mbox.flush()
```

## binascii — Binary/ASCII Conversions

```python
import binascii

binascii.hexlify(b"hello")     # b'68656c6c6f'
binascii.unhexlify(b"68656c6c6f")  # b'hello'
binascii.b2a_uu(b"data")       # uuencode
binascii.a2b_uu(encoded)       # uudecode
binascii.crc32(b"data")        # CRC-32 checksum
binascii.b2a_base64(b"data")   # base64 encode
binascii.a2b_base64(b"ZGF0YQ==\n")  # base64 decode
```

## quopri — MIME Quoted-Printable

```python
import quopri

quopri.encodestring(b"Hello = World")  # b'Hello =3D World'
quopri.decodestring(b"Hello =3D World")  # b'Hello = World'
quopri.encode(open("input.txt", "rb"), open("output.qp", "wb"))
quopri.decode(open("input.qp", "rb"), open("output.txt", "wb"))
```

## xml.dom — Document Object Model API

```python
from xml.dom import minidom, pulldom

# minidom — minimal DOM
dom = minidom.parse("file.xml")
root = dom.documentElement
root.tagName
for child in root.childNodes:
    child.tagName; child.getAttribute("name"); child.firstChild.data

# Parse string
dom = minidom.parseString("<root><child/></root>")

# Pretty print
print(dom.toprettyxml(indent="  "))

# pulldom — event-driven DOM
doc = pulldom.parse("file.xml")
for event, node in doc:
    if event == "START_ELEMENT" and node.tagName == "item":
        doc.expandNode(node)  # build full subtree
        process(node)
```

## xml.sax — SAX Parsing

```python
import xml.sax
from xml.sax.handler import ContentHandler

class MyHandler(ContentHandler):
    def startElement(self, name, attrs):
        print(f"Start: {name} {dict(attrs)}")
    def endElement(self, name):
        print(f"End: {name}")
    def characters(self, content):
        print(f"Text: {content.strip()}")

xml.sax.parse("file.xml", MyHandler())
xml.sax.parseString("<root>text</root>", MyHandler())

# xml.sax.saxutils — utilities
from xml.sax.saxutils import escape, unescape, quoteattr
escape("<hello>")  # "&lt;hello&gt;"
quoteattr('"hello"')  # '"&quot;hello&quot;"'
```

## xml.parsers.expat — Fast XML Parsing

```python
import xml.parsers.expat

parser = xml.parsers.expat.ParserCreate()
parser.StartElementHandler = lambda name, attrs: print(f"Start: {name}")
parser.EndElementHandler = lambda name: print(f"End: {name}")
parser.CharacterDataHandler = lambda data: print(f"Text: {data}")
parser.Parse(b"<root><child>text</child></root>")
```

## wsgiref — WSGI Reference Implementation

```python
from wsgiref.simple_server import make_server

def app(environ, start_response):
    status = "200 OK"
    headers = [("Content-Type", "text/plain")]
    start_response(status, headers)
    return [b"Hello, WSGI!"]

with make_server("", 8000, app) as server:
    server.serve_forever()

# WSGI utilities
from wsgiref.util import request_uri, application_uri
from wsgiref.headers import Headers
from wsgiref.validate import validator
from wsgiref.handlers import CGIHandler

# Validate app for WSGI compliance
app = validator(app)
```

## ftplib — FTP Client

```python
from ftplib import FTP, FTP_TLS

with FTP("ftp.example.com") as ftp:
    ftp.login("user", "pass")
    ftp.cwd("/pub")
    ftp.retrlines("LIST")
    ftp.retrbinary("RETR file.txt", open("file.txt", "wb").write)
    ftp.storbinary("STOR upload.txt", open("upload.txt", "rb"))
    ftp.nlst()  # list of filenames
    ftp.mkd("newdir")
    ftp.delete("file.txt")
    ftp.rename("old.txt", "new.txt")

# FTPS (FTP over TLS)
with FTP_TLS("ftp.example.com") as ftps:
    ftps.login("user", "pass")
    ftps.prot_p()  # protect data connection
```

## http.cookies & http.cookiejar

```python
from http.cookies import SimpleCookie, Morsel

# Create cookies
c = SimpleCookie()
c["session"] = "abc123"
c["session"]["path"] = "/"
c["session"]["max-age"] = 3600
c["session"]["secure"] = True
print(c.output(header="Set-Cookie:"))  # Set-Cookie: session=abc123; Path=/; ...

# Parse cookies
c = SimpleCookie()
c.load("session=abc123; user=alice")
c["session"].value  # "abc123"

# CookieJar for HTTP clients
from http.cookiejar import CookieJar, MozillaCookieJar
import urllib.request

jar = CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
response = opener.open("https://example.com/login")
# Cookies automatically stored and sent on subsequent requests

# Load/save cookies
mozilla_jar = MozillaCookieJar("cookies.txt")
mozilla_jar.load()
mozilla_jar.save()
```

## xmlrpc — XML-RPC Client and Server

```python
# Client
import xmlrpc.client

with xmlrpc.client.ServerProxy("http://localhost:8000") as proxy:
    result = proxy.add(2, 3)
    print(result)
    proxy.system.listMethods()

# Server
from xmlrpc.server import SimpleXMLRPCServer

server = SimpleXMLRPCServer(("localhost", 8000))

def add(a, b):
    return a + b

server.register_function(add, "add")
server.register_introspection_functions()
server.serve_forever()
```

## wave — WAV Audio Files

```python
import wave

# Read WAV
with wave.open("audio.wav", "rb") as w:
    channels = w.getnchannels()      # 1=mono, 2=stereo
    sampwidth = w.getsampwidth()     # bytes per sample
    framerate = w.getframerate()     # samples per second
    nframes = w.getnframes()
    frames = w.readframes(nframes)   # raw bytes

# Write WAV
with wave.open("output.wav", "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(44100)
    w.writeframes(raw_audio_bytes)
```

## colorsys — Color System Conversions

```python
import colorsys

# RGB to HLS and back
h, l, s = colorsys.rgb_to_hls(r, g, b)  # r,g,b in 0.0-1.0
r, g, b = colorsys.hls_to_rgb(h, l, s)

# RGB to HSV and back
h, s, v = colorsys.rgb_to_hsv(r, g, b)
r, g, b = colorsys.hsv_to_rgb(h, s, v)

# RGB to YIQ and back
y, i, q = colorsys.rgb_to_yiq(r, g, b)
r, g, b = colorsys.yiq_to_rgb(y, i, q)
```

## turtle — Turtle Graphics

```python
import turtle

t = turtle.Turtle()
t.forward(100)
t.right(90)
t.forward(100)
t.left(90)
t.circle(50)
t.penup(); t.goto(0, 0); t.pendown()
t.color("red"); t.fillcolor("blue")
t.begin_fill(); t.circle(50); t.end_fill()
t.speed(1)  # 1=slow, 10=fast, 0=instant
t.write("Hello!", font=("Arial", 16, "normal"))
turtle.done()
```

## tkinter Extended — Submodules

```python
import tkinter as tk
from tkinter import ttk

# Color chooser
from tkinter import colorchooser
color = colorchooser.askcolor(title="Pick a color")
# ((255, 0, 0), '#ff0000') or (None, None)

# Font
from tkinter import font
custom_font = font.Font(family="Helvetica", size=14, weight="bold")
font.families()  # list available font families
label = tk.Label(root, text="Hi", font=custom_font)

# Dialogs
from tkinter import simpledialog
name = simpledialog.askstring("Input", "Enter name:")
age = simpledialog.askinteger("Input", "Enter age:", minvalue=0)

from tkinter import messagebox
messagebox.showinfo("Title", "Message")
messagebox.askyesno("Confirm", "Are you sure?")
messagebox.askokcancel("Save", "Save changes?")
messagebox.showwarning("Warning", "Careful!")
messagebox.showerror("Error", "Something went wrong")

# File dialog
from tkinter import filedialog
path = filedialog.askopenfilename(filetypes=[("Python", "*.py")])
path = filedialog.asksaveasfilename(defaultextension=".py")
paths = filedialog.askopenfilenames()
dirname = filedialog.askdirectory()

# ScrolledText
from tkinter import scrolledtext
st = scrolledtext.ScrolledText(root, width=60, height=20)
st.pack()
st.insert("1.0", "Hello, World!")

# ttk.Treeview — table/tree widget
tree = ttk.Treeview(root, columns=("name", "age"), show="headings")
tree.heading("name", text="Name")
tree.heading("age", text="Age")
tree.insert("", "end", values=("Alice", 30))
tree.insert("", "end", values=("Bob", 25))
tree.pack()

# ttk.Notebook — tabs
nb = ttk.Notebook(root)
page1 = ttk.Frame(nb); page2 = ttk.Frame(nb)
nb.add(page1, text="Tab 1")
nb.add(page2, text="Tab 2")
nb.pack()

# ttk.Progressbar
pb = ttk.Progressbar(root, mode="determinate", maximum=100)
pb.pack(); pb.start(10); pb["value"] = 50; pb.stop()

# ttk.Combobox
cb = ttk.Combobox(root, values=["Option 1", "Option 2"])
cb.pack(); cb.set("Option 1")

# ttk.Spinbox
sb = ttk.Spinbox(root, from_=0, to=100)
sb.pack()

# Drag and drop (tkinter.dnd — limited support)
# Usually requires third-party tkinterdnd2
```

## curses Extended — Submodules

```python
import curses, curses.textpad, curses.ascii, curses.panel

# textpad — text input widget
def main(stdscr):
    editwin = curses.newwin(5, 40, 2, 2)
    box = curses.textpad.Textbox(editwin)
    stdscr.refresh()
    contents = box.edit()  # returns entered text
    # Ctrl-G to terminate

curses.wrapper(main)

# ascii — character utilities
curses.ascii.isalnum("a")   # True
curses.ascii.isdigit("5")   # True
curses.ascii.toupper("a")   # 'A'
curses.ascii.tolower("A")   # 'a'
curses.ascii.controlchr("\x01")  # True

# panel — stacking panels
win1 = curses.newwin(10, 20, 0, 0)
panel1 = curses.panel.new_panel(win1)
panel1.top()  # bring to front
panel1.bottom()
panel1.hide(); panel1.show()
curses.panel.update_panels()
stdscr.refresh()
```

## logging.config — Logging Configuration

```python
import logging.config

# Dict configuration
logging.config.dictConfig({
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {"format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s"},
        "simple": {"format": "%(levelname)s %(message)s"},
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "simple",
            "level": "INFO",
        },
        "file": {
            "class": "logging.handlers.RotatingFileHandler",
            "formatter": "standard",
            "filename": "app.log",
            "maxBytes": 10000000,
            "backupCount": 5,
            "level": "DEBUG",
        },
    },
    "root": {"handlers": ["console", "file"], "level": "DEBUG"},
    "loggers": {
        "myapp": {"handlers": ["console"], "level": "INFO", "propagate": False},
    },
})

# File configuration
logging.config.fileConfig("logging.conf")

# Example logging.conf:
# [loggers]
# keys=root
# [handlers]
# keys=consoleHandler
# [formatters]
# keys=simpleFormatter
# [logger_root]
# level=DEBUG
# handlers=consoleHandler
# [handler_consoleHandler]
# class=StreamHandler
# level=DEBUG
# formatter=simpleFormatter
# args=(sys.stdout,)
# [formatter_simpleFormatter]
# format=%(asctime)s - %(name)s - %(levelname)s - %(message)s
```

## optparse — Deprecated Option Parser (use argparse)

```python
# Deprecated since 2.7 — use argparse instead
# Only shown for legacy code maintenance

from optparse import OptionParser

parser = OptionParser()
parser.add_option("-f", "--file", dest="filename", help="write to FILE")
parser.add_option("-v", "--verbose", action="store_true", dest="verbose")
options, args = parser.parse_args()
options.filename
options.verbose
```

## _thread — Low-Level Threading (use threading instead)

```python
import _thread

# Start thread
_thread.start_new_thread(func, (arg1, arg2))

# Lock
lock = _thread.allocate_lock()
lock.acquire(); lock.release()

# Exit
_thread.exit()
```

## multiprocessing.shared_memory — Shared Memory

```python
from multiprocessing import shared_memory

# Create shared memory block
shm = shared_memory.SharedMemory(create=True, size=1024)
shm.buf[0:4] = b"data"
shm.buf[0:4].tobytes()  # b'data'

# Attach in another process
shm2 = shared_memory.SharedMemory(name=shm.name)
data = bytes(shm2.buf[0:4])

# Clean up
shm.close()
shm.unlink()  # destroy (only creator should call)
shm2.close()
```

## bdb — Debugger Framework

```python
import bdb

class SimpleTracer(bdb.Bdb):
    def user_line(self, frame):
        print(f"{frame.f_code.co_filename}:{frame.f_lineno}")
        self.set_continue()

tracer = SimpleTracer()
tracer.runcall(my_function, arg1, arg2)
```

## trace — Trace Python Execution

```python
import trace

# Trace execution
tracer = trace.Trace(count=True, trace=True)
tracer.run("my_function()")
results = tracer.results()
results.write_results()

# CLI: python -m trace --trace script.py
# python -m trace --count script.py
# python -m trace --missingfuncs script.py
```

## sys.monitoring — Execution Event Monitoring (3.12+)

```python
import sys.monitoring as monitoring

# Register event handlers
def on_call(code, offset):
    print(f"Call: {code.co_name}")

def on_line(code, lineno):
    print(f"Line: {code.co_filename}:{lineno}")

def on_return(code, retval):
    print(f"Return: {code.co_name} -> {retval}")

# Enable events
monitoring.register_callback(monitoring.events.CALL, on_call)
monitoring.register_callback(monitoring.events.LINE, on_line)
monitoring.register_callback(monitoring.events.PY_RETURN, on_return)

monitoring.get_tool(monitoring.PROFILER_ID)
monitoring.set_events(monitoring.PROFILER_ID,
                       monitoring.events.CALL | monitoring.events.LINE)
```

## code & codeop — Interactive Interpreter

```python
import code

# Interactive console
code.interact(local=globals())

# Custom console
console = code.InteractiveConsole(locals={"x": 42})
console.push("print(x)")
console.push("y = x * 2")
console.push("print(y)")

# Compile single statement
import codeop
compiler = codeop.CommandCompiler()
code_obj = compiler("x = 1", "<input>", "single")
```

## modulefinder — Find Modules Used by Script

```python
import modulefinder

finder = modulefinder.ModuleFinder()
finder.run_script("myscript.py")
for name, mod in finder.modules.items():
    print(name, mod.file)
```

## zipimport — Import from Zip Archives

```python
import zipimport

importer = zipimport.zipimporter("myapp.zip")
mod = importer.load_module("mymodule")
importer.find_module("mymodule")
importer.get_code("mymodule")
importer.get_source("mymodule")
```

## importlib — Extended Import System

```python
import importlib

# Import module by name
mod = importlib.import_module("package.module")

# Reload module
importlib.reload(mod)

# Find spec
spec = importlib.util.find_spec("mymodule")
spec.name; spec.origin; spec.loader

# Create module from spec
spec = importlib.util.spec_from_loader("mymod", loader)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

# Check if module can be imported
importlib.util.find_spec("nonexistent")  # None if not found

# importlib.metadata (3.8+)
import importlib.metadata as meta

# Package metadata
dist = meta.metadata("requests")
dist["Name"]; dist["Version"]; dist["Summary"]

# Entry points
eps = meta.entry_points()
for ep in eps.select(group="console_scripts"):
    print(ep.name, ep.value)

# Version
meta.version("requests")  # "2.31.0"

# Files
for file in meta.files("requests"):
    print(file)
```

## urllib Extended — Submodules

```python
from urllib import robotparser, error, response

# robotparser — robots.txt
rp = robotparser.RobotFileParser()
rp.set_url("https://example.com/robots.txt")
rp.read()
rp.can_fetch("MyBot", "https://example.com/page")  # True/False
rp.crawl_delay("MyBot")

# error — exceptions
from urllib.error import URLError, HTTPError
try:
    urllib.request.urlopen("http://example.com/missing")
except HTTPError as e:
    e.code; e.reason; e.headers
except URLError as e:
    e.reason

# response — response classes (used internally)
# urllib.response.addinfourl — base response class
```

## http — Base HTTP Module

```python
import http

# Status codes
http.HTTPStatus.OK              # 200
http.HTTPStatus.NOT_FOUND       # 404
http.HTTPStatus.INTERNAL_SERVER_ERROR  # 500
http.HTTPStatus(200).phrase     # "OK"
http.HTTPStatus(200).description

# HTTP status ranges
# 1xx — Informational
# 2xx — Success
# 3xx — Redirection
# 4xx — Client Error
# 5xx — Server Error

# HTTP method constants (http.client)
http.client.METHODS_NOT_IN_RFC2616  # set of additional methods
```

## graphlib — Topological Sort (3.9+)

```python
import graphlib

# Topological sort of a DAG
graph = {"D": {"B", "C"}, "C": {"A"}, "B": {"A"}}
ts = graphlib.TopologicalSorter(graph)
list(ts.static_order())  # ['A', 'B', 'C', 'D']

# With initial nodes
ts = graphlib.TopologicalSorter({"A": set(), "B": {"A"}, "C": {"A", "B"}})
ts.add("D", "C")  # D depends on C
list(ts.static_order())

# Parallel execution (iterative)
ts.prepare()
while ts.is_active():
    ready = ts.get_ready()
    process_parallel(ready)
    for node in ready:
        ts.done(node)
```

## zoneinfo — IANA Time Zone Support (3.9+)

```python
from zoneinfo import ZoneInfo
from datetime import datetime

# Create timezone-aware datetime
dt = datetime(2025, 7, 16, 12, 0, tzinfo=ZoneInfo("America/New_York"))
dt.tzname()  # "EDT"
dt.utcoffset()  # -4:00:00

# Convert
dt_utc = dt.astimezone(ZoneInfo("UTC"))
dt_paris = dt.astimezone(ZoneInfo("Europe/Paris"))

# Available zones
import zoneinfo
zoneinfo.available_timezones()  # set of all IANA timezone names

# Set data path
zoneinfo.reset_tzpath("/usr/share/zoneinfo")

# Keyring fallback (for systems without tzdata)
# pip install tzdata  # Windows fallback
```

## collections.abc — Abstract Base Classes

```python
from collections.abc import (
    Container, Iterable, Iterator, Generator,
    Sequence, MutableSequence, Mapping, MutableMapping,
    Set, MutableSet, Hashable, Sized, Callable,
    Awaitable, Coroutine, AsyncIterable, AsyncIterator,
    AsyncGenerator, Reversible, Collection,
    ItemsView, KeysView, ValuesView,
)

# Check protocol membership
isinstance([1, 2], Sequence)    # True
isinstance({}, Mapping)         # True
isinstance(x for x in [], Iterator)  # True

# Custom ABC registration
class MyContainer:
    def __contains__(self, item):
        return True

Container.register(MyContainer)
isinstance(MyContainer(), Container)  # True

# ABCs for type hints (prefer typing module for new code)
# collections.abc is the runtime implementation
# typing re-exports these for annotations
```

## html.entities — HTML Entity Definitions

```python
import html.entities

html.entities.html5  # dict: {"amp": "&", "gt": ">", "lt": "<", ...}
html.entities.entitydefs  # dict: {"amp": b"&", "gt": b">", ...}
html.entities.name2codepoint  # {"amp": 38, "gt": 62, "lt": 60, ...}
html.entities.codepoint2name  # {38: "amp", 62: "gt", 60: "lt", ...}
```

## xml.sax.xmlreader — XML Parser Interface

```python
from xml.sax.xmlreader import XMLReader, Locator, InputSource
from xml.sax import make_parser

# Create parser
parser = make_parser()
parser.setContentHandler(my_handler)
parser.setErrorHandler(my_error_handler)
parser.setFeature("http://xml.org/sax/features/namespaces", True)
parser.setFeature("http://xml.org/sax/features/validation", False)

# InputSource
source = InputSource()
source.setSystemId("file.xml")
source.setByteStream(open("file.xml", "rb"))
parser.parse(source)

# Locator — provides position info during parsing
# handler can access locator via setDocumentLocator
```

## Python Development Mode (devmode)

```python
# Enable via CLI flag
# python -X dev script.py

# Or via environment
# PYTHONDEVMODE=1 python script.py

# Effects:
# - Adds default warning filters (ResourceWarning, DeprecationWarning)
# - Enables debug hooks on memory allocators
# - Enables faulthandler
# - Enables asyncio debug mode
# - io.IOBase destructor logs if not closed

# Related flags:
# python -X faulthandler script.py  # enable faulthandler
# python -X tracemalloc script.py   # enable tracemalloc
# PYTHONMALLOC=debug python script.py  # debug memory allocator
# PYTHONASYNCIODEBUG=1 python script.py  # asyncio debug
# PYTHONUTF8=1 python script.py  # UTF-8 mode
# PYTHONPATHSAFEMODE=1  # safe path mode (3.11+)
```

## builtins — Built-in Objects Module

```python
import builtins

# Access built-in functions by name
builtins.print("hello")
builtins.len([1, 2, 3])
builtins.int("42")
builtins.str(42)

# All built-in names
dir(builtins)
# ['ArithmeticError', 'AssertionError', ..., 'print', 'property', ..., 'zip']

# Override builtins (advanced, not recommended)
# builtins.print = my_print  # affects all print() calls

# Check if name is a builtin
hasattr(builtins, "print")  # True
```

## warnings — Warning Control (Reference)

```python
import warnings

# Warning categories hierarchy:
# Warning
# ├── UserWarning
# ├── DeprecationWarning
# ├── PendingDeprecationWarning
# ├── SyntaxWarning
# ├── RuntimeWarning
# ├── FutureWarning
# ├── ImportWarning
# ├── UnicodeWarning
# ├── BytesWarning
# ├── ResourceWarning
# └── EncodingWarning

# Issue warning
warnings.warn("Deprecated feature", DeprecationWarning, stacklevel=2)
warnings.warn_explicit(
    message="Custom warning",
    category=UserWarning,
    filename="script.py",
    lineno=42,
)

# Filter warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("error", category=RuntimeWarning)
warnings.filterwarnings("always", message=".*deprecated.*")
warnings.filterwarnings("default", module="myapp")

# Simple filter
warnings.simplefilter("ignore")  # ignore all
warnings.simplefilter("error")   # raise as exceptions
warnings.simplefilter("always")  # always show

# Reset
warnings.resetwarnings()

# Context manager
with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    risky_code()

# Record warnings
with warnings.catch_warnings(record=True) as w:
    warnings.simplefilter("always")
    risky_code()
    for warning in w:
        print(warning.category, warning.message)

# CLI: python -W ignore::DeprecationWarning script.py
# python -W error::RuntimeWarning script.py
# python -W all script.py
```

## os.path — Pathname Manipulations

```python
import os.path

# Join and split
os.path.join("dir", "subdir", "file.txt")  # "dir/subdir/file.txt"
os.path.split("/home/user/file.txt")       # ("/home/user", "file.txt")
os.path.splitext("file.txt")               # ("file", ".txt")

# Components
os.path.dirname("/home/user/file.txt")  # "/home/user"
os.path.basename("/home/user/file.txt") # "file.txt"

# Existence and type
os.path.exists("file.txt")   # True/False
os.path.isfile("file.txt")   # True
os.path.isdir("dir")         # True
os.path.islink("link")       # True
os.path.ismount("/")         # True (Unix)

# Properties
os.path.getsize("file.txt")  # size in bytes
os.path.getmtime("file.txt") # modification time
os.path.getatime("file.txt") # access time
os.path.getctime("file.txt") # creation/change time

# Normalization
os.path.normpath("dir/../dir/./file.txt")  # "dir/file.txt"
os.path.abspath("file.txt")  # "/home/user/file.txt"
os.path.realpath("link")     # resolves symlinks
os.path.relpath("/home/user/file", "/home")  # "user/file"

# Expand
os.path.expanduser("~/file.txt")  # "/home/user/file.txt"
os.path.expandvars("$HOME/file")  # "/home/user/file"

# Common prefix
os.path.commonpath(["/a/b/c", "/a/b/d"])  # "/a/b"
os.path.commonprefix(["/a/b/c", "/a/b/d"])  # "/a/b/" (string-based)

# Same file
os.path.samefile("file1.txt", "file2.txt")  # True if same inode

# isdevdrive (3.13+ — Windows Dev Drive detection)
os.path.isdevdrive("C:/data")  # True if on a Dev Drive

# os.PathLike — protocol for path-like objects
import os
class MyPath:
    def __init__(self, path):
        self.path = path
    def __fspath__(self):
        return self.path  # return str or bytes

# Any object with __fspath__ works with os functions
p = MyPath("/home/user/file.txt")
os.path.exists(p)  # True — calls p.__fspath__()
open(p)            # works too

# os.fspath — convert PathLike to str/bytes
os.fspath(p)            # "/home/user/file.txt"
os.fspath(Path("/x"))   # "/x" (3.6+)

# pathlib.Path implements __fspath__
from pathlib import Path
os.fspath(Path("/home"))  # "/home"
```

## Audit Events

```python
# Python 3.8+ emits audit events for security-sensitive operations
# Events can be monitored via sys.audit

import sys

def audit_handler(event, args):
    if event in ("exec", "eval", "compile"):
        print(f"AUDIT: {event} {args}")

sys.addaudithook(audit_handler)

# Common audit events:
# exec, eval, compile — code execution
# import — module import
# open — file open
# subprocess.Popen — subprocess
# os.system, os.exec — OS commands
# socket.__new__ — socket creation
# ctypes.dlopen — shared library load
# urllib.Request — URL request

# CLI: python -X audit script.py (3.13+)
# Cannot remove audit hooks once added
```

## Notes on Availability

```python
# Some modules are platform-specific:
# - curses: Unix only (not Windows)
# - ctypes.CDLL: Unix shared libs; WinDLL for Windows
# - os.fork(): Unix only (not Windows — use multiprocessing)
# - os.kill(): Unix (Windows: os.kill(pid, signal.CTRL_BREAK_EVENT))
# - signal.SIGALRM: Unix only
# - multiprocessing default start method:
#   - Unix: 'fork' (default, changed to 'spawn' in 3.14)
#   - Windows: 'spawn' (always)
#   - macOS: 'spawn' (3.8+)

# Check platform
import sys
sys.platform  # 'linux', 'win32', 'darwin'

# Conditional imports
import sys
if sys.platform == "win32":
    import msvcrt  # Windows-specific
else:
    import fcntl   # Unix-specific
```

## IDLE — Python's IDE

```python
# IDLE is Python's built-in IDE, not a programmatic module
# Launch: python -m idlelib
# or: idle (if installed)

# Features:
# - Syntax highlighting
# - Auto-indentation
# - Interactive shell with command history
# - Multi-window text editor
# - Debugger (with breakpoints and stepping)
# - Search and replace (with regex)
# - Path browser
# - Class browser

# Configuration:
# ~/.idleconfig or %USERPROFILE%\.idlerc\config-main.cfg
# Options > Configure IDLE for GUI configuration
```

## test — Regression Test Package (Internal)

```python
# The test package is for CPython's own test suite
# Not intended for end users, but can be useful for testing utilities

from test.support import (
    run_unittest, check_syntax_error,
    captured_stdout, captured_stderr,
    temp_dir, EnvironmentVarGuard,
    import_helper, os_helper, threading_helper,
    warnings_helper, script_helper,
)

# Example: capture stdout in tests
from test.support import captured_stdout
with captured_stdout() as stdout:
    print("hello")
assert stdout.getvalue() == "hello\n"

# Most users should use pytest fixtures instead
```

## dis — Disassembler for Python Bytecode

```python
import dis

# Disassemble a function
def my_func(x):
    return x * 2 + 1

dis.dis(my_func)
# Prints bytecode instructions with offsets

# Disassemble a code object
dis.dis(my_func.__code__)

# Get bytecode as list
instructions = list(dis.get_instructions(my_func))
# [Instruction(opname='LOAD_FAST', opcode=124, arg=0, argval='x', ...),
#  Instruction(opname='LOAD_CONST', opcode=100, arg=1, argval=2, ...),
#  Instruction(opname='BINARY_MULTIPLY', ...), ...]

# Show bytecode for a string of code
dis.dis("x + y")

# Bytecode constants and names
dis.code_info(my_func)
# Name: my_func
# Filename: <stdin>
# Argument count: 1
# Constants: (None, 2, 1)
# Names: ()
# Varnames: ('x',)

# Stack size
dis.stack_effect(opcode, oparg)  # stack effect of an opcode

# Python 3.13+ uses adaptive/specializing interpreter
# dis.show_caches() shows inline cache entries (3.11+)
```

## py_compile — Compile Python Source to Bytecode

```python
import py_compile

# Compile a .py file to .pyc
py_compile.compile("script.py")
# Creates __pycache__/script.cpython-313.pyc

# Specify output file
py_compile.compile("script.py", cfile="script.pyc")

# Optimize (remove assert, __debug__)
py_compile.compile("script.py", optimize=1)  # -O
py_compile.compile("script.py", optimize=2)  # -OO (also remove docstrings)

# doraise — raise PyCompileError instead of printing
py_compile.compile("script.py", doraise=True)

# CLI: python -m py_compile script.py
# python -m py_compile *.py
```

## compileall — Byte-Compile Python Source Files

```python
import compileall

# Compile all .py files in a directory
compileall.compile_dir("myproject")

# Compile with optimization
compileall.compile_dir("myproject", optimize=1)

# Force recompile (ignore timestamps)
compileall.compile_dir("myproject", force=True)

# Compile to a specific directory
compileall.compile_dir("myproject", cfile_dir="build")

# Compile a single file
compileall.compile_file("script.py")

# Compile all paths in sys.path
compileall.compile_path()

# CLI: python -m compileall myproject/
# python -m compileall -j 4 myproject/  # parallel (4 workers)
# python -m compileall -o 1 myproject/  # optimized
```

## tokenize — Tokenizer for Python Source

```python
import tokenize

# Tokenize a file
with open("script.py", "rb") as f:
    tokens = list(tokenize.tokenize(f.readline))
    for tok in tokens:
        print(tokenize.tok_name[tok.type], tok.string, tok.start, tok.end)

# Token types: ENCODING, NAME, NUMBER, OP, NEWLINE, NL, COMMENT,
#              INDENT, DEDENT, STRING, ENDMARKER

# Untokenize — reconstruct source from tokens
src = tokenize.untokenize(tokens)  # bytes or iterable of tuples

# Generate tokens from string
import io
tokens = list(tokenize.generate_tokens(io.StringIO("x = 1\n").readline))

# detect_encoding — find encoding declaration
with open("script.py", "rb") as f:
    encoding, consumed = tokenize.detect_encoding(f.readline)

# open — open file with detected encoding
with tokenize.open("script.py") as f:
    source = f.read()
```

## tabnanny — Indentation Checker

```python
import tabnanny

# Check a file for ambiguous indentation
tabnanny.check("script.py")
# Prints warnings for tabs after spaces, inconsistent indentation

# Check a directory
tabnanny.check("myproject/")

# Programmatic check
tabnanny.process_tokens(tokens)  # raises NannyNag if ambiguous

# CLI: python -m tabnanny script.py
# python -m tabnanny myproject/
```

## symtable — Symbol Table Analysis

```python
import symtable

# Parse source and get symbol table
src = """
def func(x, y):
    z = x + y
    return z
"""

table = symtable.symtable(src, "<string>", "exec")

# Top-level symbols
table.get_symbols()  # list of Symbol objects

# Find a function symbol
func_sym = table.lookup("func")
func_table = func_sym.get_namespace()  # Function symbol table

# Symbols in function
for sym in func_table.get_symbols():
    print(f"{sym.get_name()}: "
          f"local={sym.is_local()}, "
          f"param={sym.is_parameter()}, "
          f"free={sym.is_free()}, "
          f"global={sym.is_global()}, "
          f"assigned={sym.is_assigned()}, "
          f"referenced={sym.is_referenced()}")

# Nested namespaces
for ns in table.get_children():
    print(ns.get_name(), ns.get_type())  # 'function', 'class', etc.

# Symbol types: 'class', 'function', 'module'
# Symbol flags: is_local, is_global, is_free, is_parameter,
#               is_assigned, is_referenced, is_imported, is_namespace
```

## keyword — Keyword Module (Reference)

```python
import keyword

# All hard keywords (35 in 3.13)
keyword.kwlist  # ['False', 'None', 'True', 'and', ...]

# Soft keywords (contextual)
keyword.softkwlist  # ['match', 'case', 'type', '_'] (3.12+)

# Check
keyword.iskeyword("if")  # True
keyword.issoftkeyword("type")  # True

# Main keyword categories:
# Value keywords: True, False, None
# Operator keywords: and, or, not, in, is
# Control flow: if, elif, else, for, while, break, continue, pass
# Exception: try, except, finally, raise, assert
# Function: def, return, lambda, yield
# Class: class
# Import: import, from, as
# Scope: global, nonlocal, del
# Async: async, await
# Context: with
```

## ast — Abstract Syntax Trees (Reference)

```python
import ast

# Parse source code to AST
tree = ast.parse("x = 1 + 2")
# tree is a Module node

# Dump AST structure
ast.dump(tree, indent=2)
# Module(body=[Assign(targets=[Name(id='x')], value=BinOp(left=Constant(1), op=Add(), right=Constant(2)))])

# Evaluate literal expressions safely
ast.literal_eval("[1, 2, {'a': 3}]")  # [1, 2, {'a': 3}]
# Only handles: strings, bytes, numbers, tuples, lists, dicts, sets, booleans, None

# Compile AST to code object
code = compile(tree, "<string>", "exec")
exec(code)

# Walk AST
for node in ast.walk(tree):
    print(type(node).__name__)

# NodeVisitor — pattern match on node types
class MyVisitor(ast.NodeVisitor):
    def visit_Name(self, node):
        print(f"Name: {node.id}")
        self.generic_visit(node)

    def visit_BinOp(self, node):
        print(f"BinOp: {type(node.op).__name__}")
        self.generic_visit(node)

MyVisitor().visit(tree)

# NodeTransformer — modify AST
class ConstantFolder(ast.NodeTransformer):
    def visit_BinOp(self, node):
        self.generic_visit(node)
        if isinstance(node.left, ast.Constant) and isinstance(node.right, ast.Constant):
            if isinstance(node.op, ast.Add):
                return ast.Constant(value=node.left.value + node.right.value)
        return node

tree = ConstantFolder().visit(ast.parse("1 + 2"))
ast.fix_missing_locations(tree)

# unparse — AST back to source (3.9+)
ast.unparse(tree)  # "x = 3"

# parse with mode
ast.parse("x = 1", mode="exec")   # module
ast.parse("x + 1", mode="eval")   # expression
ast.parse("x = 1", mode="single") # interactive
```

## formatter — Generic Output Formatting (Deprecated)

```python
# Deprecated in 3.13, removed in 3.15
# Was used for text formatting via AbstractFormatter/AbstractWriter
# Use modern alternatives: rich, markdown, etc.
import warnings
warnings.warn("formatter is deprecated", DeprecationWarning)
```

## imghdr & sndhdr — Image/Sound Type Detection (Removed)

```python
# imghdr — removed in 3.13 (deprecated since 3.11)
# sndhdr — removed in 3.13 (deprecated since 3.11)
# Use: pip install filetype, or check magic bytes manually

# Replacement for imghdr:
def detect_image_type(data):
    if data[:8] == b'\x89PNG\r\n\x1a\n':
        return 'png'
    elif data[:3] == b'\xff\xd8\xff':
        return 'jpeg'
    elif data[:6] in (b'GIF87a', b'GIF89a'):
        return 'gif'
    elif data[:2] == b'BM':
        return 'bmp'
    elif data[:4] == b'RIFF' and data[8:12] == b'WEBP':
        return 'webp'
    return None
```

## crypt — Cryptographic Hash Functions (Deprecated)

```python
# Deprecated in 3.13, removed in 3.15
# Was used for Unix password hashing
# Use: passlib, bcrypt, or hashlib for modern hashing
import warnings
warnings.warn("crypt is deprecated", DeprecationWarning)
```

## aifc & sunau & chunk — Audio File Formats (Removed)

```python
# aifc — removed in 3.13 (deprecated since 3.11)
# sunau — removed in 3.13 (deprecated since 3.11)
# chunk — removed in 3.13 (deprecated since 3.11)
# Use: pip install soundfile, pydub, or wave (still available)
```

## nntplib & telnetlib & uu & xdrlib & cgi & cgitb (Removed)

```python
# All removed in 3.13 (deprecated since 3.11)
# nntplib — use pynntp or imap for news
# telnetlib — use telnetlib3 or paramiko
# uu — use base64 module
# xdrlib — use struct module
# cgi — use modern web frameworks (Flask, Django, FastAPI)
# cgitb — use logging and traceback modules
```

## distutils — Build System (Removed)

```python
# distutils — removed in 3.12
# Use: setuptools, pip, build, or hatch instead
# Migrate setup.cfg/distutils.core.setup() to pyproject.toml + setuptools
```
