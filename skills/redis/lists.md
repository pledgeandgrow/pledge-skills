# Redis Lists

Lists are ordered sequences of strings, implemented as linked lists. Efficient for queue and stack operations.

---

## Basic Operations

```bash
# Push to head (left) or tail (right)
LPUSH mylist "item1" "item2"    # head: item2, item1
RPUSH mylist "item3"            # head: item2, item1, item3

# Push only if key exists (avoids creating new key)
LPUSHX mylist "item0"
RPUSHX mylist "item4"

# Pop from head or tail
LPOP mylist        # "item2"
RPOP mylist        # "item4"

# Pop multiple
LPOP mylist 2      # ["item1", "item3"]

# Get length
LLEN mylist

# Get range (0-based, -1 = last element)
LRANGE mylist 0 -1
LRANGE mylist 0 2
LRANGE mylist -3 -1
```

---

## Blocking Operations

```bash
# Block until element available (timeout in seconds, 0 = infinite)
BLPOP mylist 0
BRPOP mylist 5

# Pop from one list, push to another (blocking)
BLMOVE source dest LEFT RIGHT 0

# Blocking pop from multiple lists (returns first available)
BLPOP list1 list2 list3 10

# Blocking multi-pop (Redis 7+)
BLMPOP 0 1 mylist LEFT COUNT 1
```

### Use Case: Task Queue

```bash
# Producer
LPUSH task_queue "task:100" "task:101"

# Consumer (blocks until task available)
BLPOP task_queue 0
# 1) "task_queue"  2) "task:101"
```

---

## Capped Lists

Keep only the most recent N elements:

```bash
# Push and trim in one pipeline
LPUSH logs "log:entry:1000"
LTRIM logs 0 999    # keep first 1000 elements

# Or use LTRIM after RPUSH
RPUSH recent "item1" "item2" "item3"
LTRIM recent -100 -1   # keep last 100 elements
```

### Use Case: Recent Activity Feed

```bash
# Add activity (newest first)
LPUSH feed:user:1000 "post:500" "post:499" "post:498"
LTRIM feed:user:1000 0 49    # keep latest 50
LRANGE feed:user:1000 0 -1   # get all
```

---

## List Manipulation

```bash
# Get element by index
LINDEX mylist 0      # first element
LINDEX mylist -1     # last element

# Set element by index
LSET mylist 0 "new-value"

# Insert before/after a pivot element
LINSERT mylist BEFORE "pivot" "new-item"
LINSERT mylist AFTER "pivot" "new-item"

# Remove elements
LREM mylist 1 "item"        # remove first occurrence from head
LREM mylist -1 "item"       # remove first occurrence from tail
LREM mylist 0 "item"        # remove all occurrences

# Trim list to range
LTRIM mylist 0 99           # keep elements 0-99

# Remove and push to another list
RPOPLPUSH source dest       # deprecated, use LMOVE
LMOVE source dest RIGHT LEFT

# Get length
LLEN mylist

# Find element position
LPOS mylist "item"
LPOS mylist "item" RANK 2   # skip first match
LPOS mylist "item" COUNT 3  # find up to 3 positions
```

---

## Move Between Lists

```bash
# Move element from one list to another
LMOVE source dest LEFT RIGHT   # pop left from source, push right to dest
LMOVE source dest RIGHT LEFT   # pop right from source, push left to dest
```

---

## Multi-Pop

```bash
# Pop multiple elements (Redis 7+)
LMPOP 1 mylist LEFT COUNT 3    # pop up to 3 from left
LMPOP 2 list1 list2 RIGHT COUNT 1  # pop from first non-empty
```

---

## Use Cases

### Message Queue (FIFO)

```bash
LPUSH queue "msg1" "msg2"
BRPOP queue 0    # msg1 first (FIFO)
```

### Stack (LIFO)

```bash
LPUSH stack "item1" "item2"
LPOP stack       # item2 first (LIFO)
```

### Rate Limiter (sliding window)

```bash
# Add timestamp
LPUSH rate:user:1000 1735689600
LTRIM rate:user:1000 0 99    # keep last 100 requests
LLEN rate:user:1000          # count requests in window
```

### Circulating List

```bash
# Move first element to end
LMOVE mylist mylist LEFT RIGHT
```

---

## Performance

- `LPUSH`, `RPUSH`, `LPOP`, `RPOP` — O(1)
- `LLEN` — O(1)
- `LINDEX` — O(N) for linked list encoding, O(1) for quicklist
- `LINSERT`, `LREM` — O(N) where N is list length
- `LRANGE` — O(S+N) where S is start offset, N is range size
- `BLPOP`, `BRPOP` — O(1) when data available, blocks otherwise

## Limits

- Maximum elements: 2^32 - 1
- listpack encoding: up to 128 elements, 64 bytes per entry
- quicklist encoding: linked list of listpacks (default for larger lists)
