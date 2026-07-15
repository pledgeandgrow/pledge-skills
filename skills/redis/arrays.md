# Redis Arrays

Redis Arrays (v8.8+) are sparse, index-addressable sequences. Unlike lists, arrays support O(1) random access at arbitrary indices and are memory-efficient for sparse data.

---

## Basic Operations

```bash
# Set values at specific indices
ARSET events:1 0 "login" "click" "purchase"
# Returns: 3 (number of values set)

# Get value at index
ARGET events:1 0       # "login"
ARGET events:1 1       # "click"
ARGET events:1 999     # (nil) — unset index

# Get range of values
ARGETRANGE events:1 0 2
# 1) "login"  2) "click"  3) "purchase"
```

---

## Array Length vs Element Count

Arrays expose two distinct size measurements:

```bash
# Set sparse values
ARSET sparse 0 "a"
ARSET sparse 1000000 "b"

# ARLEN — logical length (highest set index + 1)
ARLEN sparse        # 1000001

# ARCOUNT — number of non-empty elements
ARCOUNT sparse      # 2
```

---

## Sequential Insertion

```bash
# ARINSERT appends at the current cursor position
ARINSERT events:1 "logout"
ARINSERT events:1 "signup"

# ARSEEK sets the cursor to a specific index
ARSEEK events:1 0
ARINSERT events:1 "first"   # inserts at index 0
```

---

## Ring Buffer Mode

`ARRING` turns an array into a fixed-size circular buffer. Each insert wraps at `insert_idx % size`, overwriting the oldest entry:

```bash
# Create ring buffer of size 3
ARRING readings 3 "v0"    # index 0
ARRING readings 3 "v1"    # index 1
ARRING readings 3 "v2"    # index 2
ARRING readings 3 "v3"    # wraps to index 0 (overwrites v0)

ARGET readings 0    # "v3" (overwritten)
ARGET readings 1    # "v1"
ARGET readings 2    # "v2"
```

### Use Case: Sliding Window Metrics

```bash
# Keep last 100 sensor readings
ARRING sensor:temp 100 "22.5"
ARRING sensor:temp 100 "22.7"
ARRING sensor:temp 100 "22.6"

# Read last N values
ARGETRANGE sensor:temp 0 99
```

---

## Aggregate Operations

```bash
# Perform aggregate operations on a range
AROP events:1 0 10 SUM
AROP events:1 0 10 COUNT
AROP events:1 0 10 MIN
AROP events:1 0 10 MAX
AROP events:1 0 10 AVG
```

---

## Searching Elements

```bash
# Search with textual predicates
ARGREP events:1 0 100 "login"

# Scan elements in a range (returns index-value pairs)
ARSCAN events:1 0 100
```

---

## Deleting Elements

```bash
# Delete at specific indices
ARDEL events:1 0 5 10

# Delete a range
ARDELRANGE events:1 0 50

# Delete multiple ranges
ARDELRANGE events:1 0 10 50 60
```

---

## Introspection

```bash
# Get array metadata
ARINFO events:1

# With full slice details
ARINFO events:1 FULL
```

---

## Python Examples

```python
r.arset("events:1", 0, "login", "click", "purchase")
# Returns: 3

val = r.arget("events:1", 0)   # "login"
val = r.arget("events:1", 999) # None

# Sparse array
r.arset("sparse", 0, "a")
r.arset("sparse", 1000000, "b")
r.arlen("sparse")     # 1000001
r.arcount("sparse")   # 2

# Ring buffer
r.arring("readings", 3, "v0")  # 0
r.arring("readings", 3, "v1")  # 1
r.arring("readings", 3, "v2")  # 2
r.arring("readings", 3, "v3")  # 0 (wraps)
r.arget("readings", 0)         # "v3"
```

---

## Performance

| Operation | Complexity |
|-----------|------------|
| `ARSET` | O(N) where N is number of values |
| `ARGET` | O(1) |
| `ARGETRANGE` | O(N) where N is range length |
| `ARLEN` | O(1) |
| `ARCOUNT` | O(1) |
| `ARDEL` | O(N) where N is number of indices |
| `ARINSERT` | O(1) |
| `ARRING` | O(M) normally, O(N+M) on resize |
| `ARSCAN` | O(P) where P is visited positions |
| `AROP` | O(P) where P is visited positions |
| `ARGREP` | O(P * C) where C is predicate cost |

---

## Arrays vs Lists

| Feature | Arrays | Lists |
|---------|--------|-------|
| Random access by index | O(1) | O(N) |
| Sparse data | Memory-efficient | Wastes memory |
| Append | O(1) via ARINSERT | O(1) via RPUSH |
| Pop from end | Not built-in | O(1) via RPOP |
| Blocking operations | No | Yes (BLPOP, BRPOP) |
| Ring buffer | Built-in (ARRING) | Manual (LMOVE) |
| Aggregate operations | Built-in (AROP) | No |

### When to Use Arrays

- **Sparse data**: indices 0 and 1,000,000 with nothing in between
- **Random access**: need O(1) reads at arbitrary positions
- **Ring buffers**: fixed-size circular logs
- **Index-addressed storage**: positional data with gaps

### When to Use Lists

- **Queues/stacks**: FIFO/LIFO patterns
- **Blocking operations**: consumers need to wait for data
- **Sequential access**: mostly iterate in order
- **Dense data**: few or no gaps

---

## Limits

- Maximum index: 2^32 - 1
- Values stored as strings
- Ring buffer size must be specified at first ARRING call
- ARINSERT cursor is per-key and persistent
