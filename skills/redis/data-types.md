# Redis Data Types Overview

Redis supports multiple data structures. Each is optimized for specific use cases.

---

## Core Data Types

| Type | Description | Max Size | Use Cases |
|------|-------------|----------|-----------|
| **String** | Sequence of bytes | 512MB | Caching, counters, sessions |
| **Hash** | Field-value pairs | 2^32 - 1 fields | Objects, user profiles |
| **List** | Ordered string list | 2^32 - 1 elements | Queues, timelines, logs |
| **Set** | Unordered unique strings | 2^32 - 1 members | Tags, unique visitors, relations |
| **Sorted Set** | Unique strings with scores | 2^32 - 1 members | Leaderboards, rankings, priority queues |
| **Stream** | Append-only log | Unlimited | Event sourcing, messaging, audit logs |

## Extended Data Types

| Type | Description | Use Cases |
|------|-------------|-----------|
| **JSON** | Structured JSON documents | Complex nested data, config, catalogs |
| **Bitmap** | Bit operations on strings | Feature flags, analytics, presence |
| **Bitfield** | Multiple counters in a string | Counters with overflow control |
| **Geospatial** | Lat/lng coordinate indexes | Location search, proximity |
| **Time Series** | Time-stamped data points | Metrics, monitoring, IoT |
| **Vector Set** | Vector embeddings | AI similarity search, recommendations |
| **Array** | Sparse, index-addressable sequences | Sparse data access |

## Probabilistic Data Types

| Type | Description | Use Cases |
|------|-------------|-----------|
| **Bloom Filter** | Probabilistic set membership | Dedup, filtering |
| **Cuckoo Filter** | Set membership with deletion | Dynamic filtering |
| **HyperLogLog** | Cardinality estimation | Unique count (UVs) |
| **Count-Min Sketch** | Frequency estimation | Top items, traffic analysis |
| **t-Digest** | Quantile estimation | Percentiles, latency analysis |
| **Top-K** | Top K frequent items | Trending, leaderboards |

---

## Choosing a Data Type

### Strings vs Hashes

```bash
# String — flat key per field
SET user:1:name "Alice"
SET user:1:age "30"

# Hash — single key, multiple fields
HSET user:1 name "Alice" age 30
```

Use **Hashes** for structured objects — fewer keys, atomic operations on fields.

### Lists vs Streams

```bash
# List — simple queue, no consumer groups
LPUSH queue "task1"
BRPOP queue 0

# Stream — persistent log, consumer groups, replay
XADD events * type "click" user "abc"
XREAD COUNT 10 STREAMS events $
```

Use **Streams** when you need persistence, consumer groups, or replay.

### Sets vs Sorted Sets

```bash
# Set — unique members, no ordering
SADD tags "redis" "database"

# Sorted Set — unique members with scores
ZADD leaderboard 100 "Alice" 200 "Bob"
```

Use **Sorted Sets** when you need ordering or ranking.

### Bitmap vs Set for Feature Flags

```bash
# Bitmap — memory efficient for dense IDs
SETBIT feature:beta 42 1
GETBIT feature:beta 42

# Set — more intuitive, sparse-friendly
SADD feature:beta:users user:42
```

Use **Bitmaps** for dense numeric IDs, **Sets** for sparse or string IDs.

---

## Type Checking

```bash
# Get type of a key
TYPE mykey
# string | hash | list | set | zset | stream | ReJSON-RL (JSON) | ...

# Check if key exists
EXISTS mykey

# Get memory usage
MEMORY USAGE mykey
```

---

## Encoding

Redis automatically chooses internal encodings based on data size:

| Type | Small Encoding | Large Encoding |
|------|---------------|----------------|
| String | int (numeric) | embstr / raw |
| Hash | listpack | hashtable |
| List | listpack | quicklist |
| Set | intset / listpack | hashtable |
| Sorted Set | listpack | skiplist + hashtable |
| Stream | stream | stream |

```bash
# Check internal encoding
OBJECT ENCODING mykey
```

---

## Type-Specific Command Groups

| Type | Command Prefix | Docs |
|------|---------------|------|
| String | `SET`, `GET`, `INCR`, `APPEND` | `strings.md` |
| Hash | `HSET`, `HGET`, `HGETALL` | `hashes.md` |
| List | `LPUSH`, `RPUSH`, `LRANGE`, `LPOP` | `lists.md` |
| Set | `SADD`, `SMEMBERS`, `SINTER` | `sets.md` |
| Sorted Set | `ZADD`, `ZRANGE`, `ZRANK` | `sets.md` |
| Stream | `XADD`, `XREAD`, `XGROUP` | `streams.md` |
| JSON | `JSON.SET`, `JSON.GET`, `JSON.MGET` | `json.md` |
| Bitmap | `SETBIT`, `GETBIT`, `BITCOUNT` | `strings.md` |
| Geospatial | `GEOADD`, `GEOSEARCH`, `GEODIST` | `geospatial.md` |
| Time Series | `TS.CREATE`, `TS.ADD`, `TS.RANGE` | `timeseries.md` |
| Bloom Filter | `BF.ADD`, `BF.EXISTS`, `BF.RESERVE` | `probabilistic.md` |
| HyperLogLog | `PFADD`, `PFCOUNT`, `PFMERGE` | `probabilistic.md` |

---

## Adding Extensions

Redis 8 includes all former Redis Stack modules (JSON, Search, TimeSeries, Bloom, etc.) built-in. For older versions:

```bash
# Load module at startup
redis-server --loadmodule /path/to/rejson.so

# Load module at runtime
MODULE LOAD /path/to/rejson.so

# List loaded modules
MODULE LIST
```
