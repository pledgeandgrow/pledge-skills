# Standard Library — I/O

**Docs:** https://docs.python.org/3/library/io.html | https://docs.python.org/3/library/pathlib.html

## File I/O

```python
# Open file — context manager (recommended)
with open("file.txt", "r") as f:
    content = f.read()       # entire file as string
    # or
    lines = f.readlines()    # list of lines
    # or iterate
    for line in f:
        process(line)

# Modes: r (read), w (write/truncate), a (append),
#         r+ (read+write), x (exclusive create)
#         b (binary), t (text, default)

# Binary
with open("data.bin", "rb") as f:
    data = f.read()  # bytes

# Write
with open("output.txt", "w") as f:
    f.write("Hello\n")
    f.writelines(["line1\n", "line2\n"])

# Append
with open("log.txt", "a") as f:
    f.write("New entry\n")

# Encoding (always specify for text)
with open("file.txt", "r", encoding="utf-8") as f:
    content = f.read()

# Newline handling
with open("file.txt", "r", newline="") as f:  # no translation
    content = f.read()

# Read line by line
with open("file.txt") as f:
    first_line = f.readline()
    rest = f.readlines()

# seek and tell
with open("file.txt") as f:
    f.seek(0)       # go to beginning
    f.seek(10)      # go to byte 10
    pos = f.tell()  # current position
```

## pathlib — Object-Oriented Paths

```python
from pathlib import Path, PurePath, PurePosixPath, PureWindowsPath

# Create
p = Path("file.txt")
p = Path("/home/user/file.txt")
p = Path("dir") / "subdir" / "file.txt"  # / operator joins paths
p = Path.cwd()    # current working directory
p = Path.home()   # home directory

# Properties
p.name       # "file.txt"
p.stem       # "file" (name without extension)
p.suffix     # ".txt"
p.suffixes   # [".tar", ".gz"] for "file.tar.gz"
p.parent     # Path("/home/user")
p.parents    # sequence of all parents
p.parts      # ("home", "user", "file.txt")
p.anchor     # "/" or "C:\\" (root/drive)

# Operations
p.with_name("new.txt")       # Path("/home/user/new.txt")
p.with_suffix(".md")         # change extension
p.with_stem("newname")       # 3.9+
p.joinpath("sub", "file")    # Path(".../sub/file")
p.relative_to("/home")       # Path("user/file.txt")

# Resolve and absolute
p.absolute()    # absolute path (no symlink resolution)
p.resolve()     # absolute path with symlinks resolved

# Check existence
p.exists()      # True/False
p.is_file()
p.is_dir()
p.is_symlink()

# File info
p.stat().st_size     # size in bytes
p.stat().st_mtime    # modification time

# Directory listing
for child in Path(".").iterdir():
    print(child)

# Glob
for f in Path(".").glob("*.py"):
    print(f)

for f in Path(".").rglob("*.py"):  # recursive
    print(f)

# Create
p.mkdir()                    # create directory
p.mkdir(parents=True, exist_ok=True)  # like mkdir -p
p.touch()                    # create empty file
p.rmdir()                    # remove empty directory
p.unlink()                   # remove file
p.unlink(missing_ok=True)    # 3.8+ — no error if missing

# Rename/move
p.rename("new_name.txt")
p.replace("target.txt")      # atomic replace

# Read/write (3.5+ convenience methods)
content = p.read_text(encoding="utf-8")
data = p.read_bytes()
p.write_text("content", encoding="utf-8")
p.write_bytes(b"binary data")

# Open
with p.open("r") as f:
    content = f.read()

# Owner and permissions
p.owner()   # username
p.group()   # group name
p.chmod(0o755)

# Temporary
import tempfile
with tempfile.TemporaryDirectory() as tmpdir:
    tmp_path = Path(tmpdir) / "file.txt"
    tmp_path.write_text("temp")
# directory and contents deleted on exit

# Pattern matching (3.12+)
p = Path("/home/user/file.txt")
p.match("*.txt")           # True — match against name
p.full_match("*.txt")      # True — match against full path (3.13+)
p.full_match("/home/**/*.txt")  # True — full path glob (3.13+)

# Path.parser — access the underlying parser (3.13+)
Path.parser                # PurePosixPath or PureWindowsPath parser
Path.parser.join("a", "b")  # platform-specific join

# Case sensitivity
p.match("*.TXT", case_sensitive=False)  # 3.12+

# Walk (3.12+)
for dirpath, dirnames, filenames in Path(".").walk():
    for f in filenames:
        print(dirpath / f)

# Copy (3.13+ — shutil.copy into Path)
# Path objects work natively with shutil functions

# Pure paths — no filesystem access
pp = PurePosixPath("/usr/bin/python")
pp = PureWindowsPath("C:\\Users\\file.txt")
pp.as_posix()  # "C:/Users/file.txt" (Windows)
pp.drive       # "C:" (Windows)
pp.root        # "\\" (Windows) or "/" (POSIX)
```

## io — Core I/O Tools

```python
import io

# StringIO — in-memory text stream
buffer = io.StringIO()
buffer.write("hello\n")
buffer.write("world")
buffer.getvalue()  # "hello\nworld"
buffer.seek(0)
buffer.read()      # "hello\nworld"

# BytesIO — in-memory binary stream
bio = io.BytesIO()
bio.write(b"binary data")
bio.getvalue()  # b"binary data"

# From existing data
sio = io.StringIO("initial\ndata")
sio.read()  # "initial\ndata"

# StringIO as file replacement
from contextlib import redirect_stdout
output = io.StringIO()
with redirect_stdout(output):
    print("captured")
result = output.getvalue()
```

## csv — CSV File I/O

```python
import csv

# Read
with open("data.csv", newline="", encoding="utf-8") as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)  # list of strings

# DictReader — use header row as keys
with open("data.csv", newline="") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], row["age"])  # dict access

# Write
with open("output.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["name", "age", "city"])
    writer.writerow(["Alice", 30, "NYC"])
    writer.writerows([
        ["Bob", 25, "LA"],
        ["Carol", 35, "SF"],
    ])

# DictWriter
with open("output.csv", "w", newline="") as f:
    fieldnames = ["name", "age", "city"]
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerow({"name": "Alice", "age": 30, "city": "NYC"})

# CSV dialects
csv.register_dialect("custom", delimiter=";", quoting=csv.QUOTE_ALL)
with open("data.csv", newline="") as f:
    reader = csv.reader(f, dialect="custom")
```

## pickle — Object Serialization

```python
import pickle

# Serialize to bytes
data = {"name": "Alice", "items": [1, 2, 3]}
serialized = pickle.dumps(data)

# Deserialize from bytes
restored = pickle.loads(serialized)

# File-based
with open("data.pkl", "wb") as f:
    pickle.dump(data, f)

with open("data.pkl", "rb") as f:
    data = pickle.load(f)

# Protocol versions
pickle.dumps(obj, protocol=pickle.HIGHEST_PROTOCOL)
pickle.DEFAULT_PROTOCOL  # 5 (3.8+)

# Security: NEVER unpickle untrusted data — can execute arbitrary code
# Use json for untrusted data

# pickle vs json
# pickle: Python-specific, supports most objects, NOT secure
# json: language-independent, limited types, secure
```

## logging — Logging Framework

```python
import logging

# Basic configuration
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    filename="app.log",
)

# Log levels
logging.debug("Detailed debug info")
logging.info("General information")
logging.warning("Warning message")
logging.error("Error occurred")
logging.critical("Critical failure")

# Named loggers
logger = logging.getLogger(__name__)
logger.info("Module-specific message")

# Logger hierarchy
# "app" -> "app.database" -> "app.database.connection"
db_logger = logging.getLogger("app.database")
db_logger.setLevel(logging.DEBUG)

# Handlers
console_handler = logging.StreamHandler()
file_handler = logging.FileHandler("app.log")

# Formatters
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
console_handler.setFormatter(formatter)

# Add handler to logger
logger.addHandler(console_handler)
logger.addHandler(file_handler)

# Structured logging (3.2+ for basic, improved in 3.12+)
# In Python 3.12+, logging has better performance

# LogRecord attributes
# %(asctime)s   — time
# %(name)s      — logger name
# %(levelname)s — level name
# %(message)s   — message
# %(filename)s  — source file
# %(lineno)d    — line number
# %(funcName)s  — function name
# %(process)d   — process ID
# %(thread)d    — thread ID

# Exception logging
try:
    risky()
except Exception:
    logging.exception("Failed")  # includes traceback

# Or
logger.error("Failed", exc_info=True)

# DictConfig
logging.config.dictConfig({
    "version": 1,
    "formatters": {
        "detailed": {
            "format": "%(asctime)s %(name)s %(levelname)s %(message)s"
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "detailed",
            "level": "INFO",
        }
    },
    "root": {
        "handlers": ["console"],
        "level": "DEBUG",
    }
})
```

## shutil — High-Level File Operations

```python
import shutil

# Copy
shutil.copy("src.txt", "dst.txt")        # copy content + permissions
shutil.copy2("src.txt", "dst.txt")       # copy + metadata (timestamps)
shutil.copyfile("src.txt", "dst.txt")    # copy content only

# Copy directory tree
shutil.copytree("src_dir", "dst_dir")
shutil.copytree("src_dir", "dst_dir", symlinks=True)

# Remove directory tree
shutil.rmtree("directory")

# Move
shutil.move("src", "dst")

# Disk usage
shutil.disk_usage("/")  # (total, used, free) in bytes

# Which — find executable
shutil.which("python")  # "/usr/bin/python"

# Make archive
shutil.make_archive("archive", "zip", "directory")
shutil.make_archive("backup", "gztar", "/path/to/dir")

# Unpack archive
shutil.unpack_archive("archive.zip", "extract_dir")
```

## tempfile — Temporary Files

```python
import tempfile

# Temporary file (auto-deleted)
with tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=False) as f:
    f.write("temporary data")
    print(f.name)  # file path

# Temporary file (auto-deleted on close)
with tempfile.TemporaryFile(mode="w+") as f:
    f.write("data")
    f.seek(0)
    f.read()
# file deleted on close

# Temporary directory
with tempfile.TemporaryDirectory() as tmpdir:
    filepath = f"{tmpdir}/file.txt"
    with open(filepath, "w") as f:
        f.write("temp")
# directory and contents deleted on exit

# mkstemp — low-level, must close and unlink manually
fd, path = tempfile.mkstemp(suffix=".tmp")
import os
os.close(fd)
os.unlink(path)

# mkdtemp — manual cleanup
dirname = tempfile.mkdtemp()
# must call shutil.rmtree(dirname) manually
```

## subprocess — Running External Commands

```python
import subprocess

# Run command (3.5+)
result = subprocess.run(
    ["ls", "-la"],
    capture_output=True,
    text=True,
    check=True,  # raise CalledProcessError on non-zero exit
)
print(result.stdout)
print(result.stderr)
print(result.returncode)

# Shell=True (security risk with user input)
result = subprocess.run("ls -la | grep .py", shell=True, capture_output=True, text=True)

# Pipe to another command
p1 = subprocess.Popen(["ls", "-la"], stdout=subprocess.PIPE)
p2 = subprocess.Popen(["grep", "py"], stdin=p1.stdout, stdout=subprocess.PIPE)
p1.stdout.close()
output = p2.communicate()[0]

# Input
result = subprocess.run(
    ["python", "-c", "print(input())"],
    input="hello",
    text=True,
    capture_output=True,
)

# Timeout
try:
    result = subprocess.run(["sleep", "10"], timeout=5)
except subprocess.TimeoutExpired:
    print("Timed out")
```
