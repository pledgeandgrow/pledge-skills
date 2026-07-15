# Redis Strings, Bitmaps, and Bitfields

Strings are the most basic Redis data type — a sequence of bytes up to 512MB.

---

## Basic Operations

```bash
SET key "value"
GET key
DEL key

# Set only if key doesn't exist (NX) or already exists (XX)
SET key "value" NX
SET key "value" XX

# Set with expiration (seconds / milliseconds)
SET key "value" EX 3600
SET key "value" PX 60000

# Set with expiration and condition
SET key "value" EX 3600 NX

# Get and set atomically
SET key "new" GET  # returns old value

# Set multiple keys
MSET key1 "val1" key2 "val2"
MGET key1 key2
```

---

## Expiration

```bash
# Set TTL after creation
EXPIRE key 3600        # seconds
PEXPIRE key 60000      # milliseconds
EXPIREAT key 1735689600  # Unix timestamp (seconds)
PEXPIREAT key 1735689600000  # Unix timestamp (ms)

# Get remaining TTL
TTL key    # seconds (-1 = no expiry, -2 = key doesn't exist)
PTTL key   # milliseconds

# Remove expiration
PERSIST key

# Get expiration time
EXPIRETIME key     # Unix timestamp (seconds)
PEXPIRETIME key    # Unix timestamp (ms)
```

---

## Counters

```bash
# Increment / decrement
INCR counter
DECR counter
INCRBY counter 10
DECRBY counter 5

# Float increment
INCRBYFLOAT price 1.5
```

```python
r.set('counter', 100)
r.incr('counter')        # 101
r.incrby('counter', 10)  # 111
r.decr('counter')        # 110
```

---

## String Manipulation

```bash
# Append to existing value
APPEND key " world"     # "hello" -> "hello world"

# Get substring
GETRANGE key 0 4        # first 5 chars
SETRANGE key 6 "Redis"  # overwrite at offset

# Get length
STRLEN key

# Get and delete
GETDEL key              # returns value, deletes key

# Get and set new value
GETSET key "new-value"
```

---

## Bitmaps

Bitmaps are string values treated as bit arrays. Efficient for boolean state on numeric IDs.

```bash
# Set bit at position
SETBIT user:active 42 1

# Get bit at position
GETBIT user:active 42   # 1

# Count set bits
BITCOUNT user:active

# Count bits in range
BITCOUNT user:active 0 100  # byte range

# Bitwise operations between keys
BITOP AND result key1 key2
BITOP OR result key1 key2
BITOP XOR result key1 key2
BITOP NOT result key1

# Find first set bit
BITPOS user:active 1     # first set bit
BITPOS user:active 0     # first clear bit
```

### Use Case: Daily Active Users

```bash
# Mark user 42 as active on 2024-01-15
SETBIT active:2024-01-15 42 1

# Count active users
BITCOUNT active:2024-01-15

# Users active on both days
BITOP AND active:both active:2024-01-14 active:2024-01-15
BITCOUNT active:both

# Users active on either day
BITOP OR active:either active:2024-01-14 active:2024-01-15
BITCOUNT active:either
```

---

## Bitfields

Bitfields encode multiple counters in a single string with atomic operations.

```bash
# Set unsigned 8-bit value at offset 0
BITFIELD mykey SET u8 0 100

# Get unsigned 8-bit value at offset 0
BITFIELD mykey GET u8 0

# Increment with overflow control
BITFIELD mykey INCRBY u8 0 1
BITFIELD mykey INCRBY u8 0 1 OVERFLOW WRAP   # wrap around
BITFIELD mykey INCRBY u8 0 1 OVERFLOW SAT    # saturate at max
BITFIELD mykey INCRBY u8 0 1 OVERFLOW FAIL   # do nothing on overflow

# Multiple operations
BITFIELD mykey SET u8 0 100 SET u16 8 5000 GET u8 0 GET u16 8
```

### Type Codes

| Code | Type | Range |
|------|------|-------|
| `u8` | Unsigned 8-bit | 0 to 255 |
| `u16` | Unsigned 16-bit | 0 to 65,535 |
| `u32` | Unsigned 32-bit | 0 to 4,294,967,295 |
| `u64` | Unsigned 64-bit | 0 to 2^64 - 1 |
| `i8` | Signed 8-bit | -128 to 127 |
| `i16` | Signed 16-bit | -32,768 to 32,767 |
| `i32` | Signed 32-bit | -2^31 to 2^31 - 1 |
| `i64` | Signed 64-bit | -2^63 to 2^63 - 1 |

---

## Performance

- String operations are O(1) except `GETRANGE`, `SETRANGE`, `STRLEN` (O(N) where N is string length)
- Bitmaps: `SETBIT`/`GETBIT` are O(1), `BITCOUNT` is O(N), `BITOP` is O(N)
- Bitfields: O(1) per sub-command
- Maximum value size: 512MB per key

---

## Limits

- Keyspace: 2^32 keys per database (default 16 databases)
- Key name: 512MB (keep keys short for memory efficiency)
- Value: 512MB per string
- Listpack encoding: up to 128 elements or 64 bytes per entry (configurable)
