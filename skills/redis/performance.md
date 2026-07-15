# Redis Performance and Optimization

Memory management, tuning, and performance best practices.

---

## Memory Management

### Maxmemory Configuration

```conf
# redis.conf
maxmemory 2gb
maxmemory-policy allkeys-lru
```

### Eviction Policies

| Policy | Description | Best For |
|--------|-------------|----------|
| `noeviction` | Return errors on writes | Database (not cache) |
| `allkeys-lru` | Evict least recently used | Cache with mixed access |
| `allkeys-lfu` | Evict least frequently used | Cache with hot keys |
| `allkeys-random` | Evict random keys | Uniform access cache |
| `volatile-lru` | Evict LRU among keys with TTL | Mixed cache + persistent |
| `volatile-lfu` | Evict LFU among keys with TTL | Mixed cache + persistent |
| `volatile-random` | Evict random keys with TTL | Mixed cache + persistent |
| `volatile-ttl` | Evict shortest TTL keys | Session cache |

### Memory Info

```bash
INFO memory
MEMORY STATS
MEMORY DOCTOR
MEMORY USAGE mykey
```

Key metrics:
- `used_memory`: Total bytes allocated
- `used_memory_rss`: RSS as seen by OS
- `mem_fragmentation_ratio`: RSS / used_memory (ideal: ~1.0)
- `maxmemory`: Configured limit

### Memory Optimization

```bash
# Check encoding
OBJECT ENCODING mykey

# Configure listpack thresholds (smaller = more memory efficient)
hash-max-listpack-entries 128
hash-max-listpack-value 64
list-max-listpack-size -2
set-max-intset-entries 512
set-max-listpack-entries 128
set-max-listpack-value 64
zset-max-listpack-entries 128
zset-max-listpack-value 64

# Use ziplist for small objects (memory efficient)
# Redis automatically chooses encoding based on size
```

---

## Pipelining

Reduce round-trip time by batching commands:

```python
# Without pipelining: 100 round trips
for i in range(100):
    r.set(f'key{i}', f'val{i}')

# With pipelining: 1 round trip
pipe = r.pipeline()
for i in range(100):
    pipe.set(f'key{i}', f'val{i}')
pipe.execute()
```

**Performance**: 100x improvement for 100 commands over localhost.

---

## Connection Pooling

```python
pool = redis.ConnectionPool(
    host='localhost',
    port=6379,
    max_connections=50,
    socket_timeout=5,
    socket_connect_timeout=5,
    retry_on_timeout=True,
)
r = redis.Redis(connection_pool=pool)
```

---

## Benchmarking

```bash
# Basic benchmark
redis-benchmark -h localhost -p 6379 -n 100000 -c 50

# Specific command
redis-benchmark -t set,get,incr -n 100000 -c 50

# With pipelining
redis-benchmark -t set -n 100000 -c 50 -P 16

# With data size
redis-benchmark -t set -n 100000 -c 50 -d 100

# CSV output
redis-benchmark -t set -n 100000 -c 50 --csv

# Lua script
redis-benchmark -n 100000 -c 50 eval "return redis.call('set', KEYS[1], 'val')" 1 testkey
```

---

## Slow Log

```conf
# redis.conf
slowlog-log-slower-than 10000   # Log commands slower than 10ms (microseconds)
slowlog-max-len 128             # Maximum entries to keep
```

```bash
# View slow log
SLOWLOG GET 10

# Reset
SLOWLOG RESET

# Get length
SLOWLOG LEN
```

---

## Latency Monitoring

```conf
# redis.conf
latency-monitor-threshold 100   # Log events blocking for 100ms+
```

```bash
# View latency events
LATENCY HISTORY event
LATENCY LATEST
LATENCY RESET
LATENCY GRAPH event
```

---

## CPU and I/O

### Single-Threaded Model

Redis processes commands in a single thread. To utilize multiple cores:

1. **Multiple Redis instances** on the same machine (different ports)
2. **Redis Cluster** for automatic sharding
3. **I/O threads** for network I/O (Redis 6+):

```conf
# redis.conf
io-threads 4
io-threads-do-reads yes
```

### Fork Overhead

`BGSAVE` and `BGREWRITEAOF` fork the process. On large datasets, this can cause latency:

```bash
# Check fork time
INFO stats | grep latest_fork_usec

# Mitigation
# 1. Use smaller RDB snapshots
# 2. Disable transparent huge pages
echo never > /sys/kernel/mm/transparent_hugepage/enabled
# 3. Increase AOF rewrite threshold to reduce frequency
auto-aof-rewrite-percentage 200
```

---

## Key Design Best Practices

```bash
# Bad: many small keys
SET user:1000:name "Alice"
SET user:1000:age "30"
SET user:1000:email "alice@example.com"

# Good: single hash
HSET user:1000 name "Alice" age 30 email "alice@example.com"
```

- Use **hashes** for structured objects (fewer keys, less overhead)
- Keep **key names short** (each byte counts in memory)
- Use **appropriate data types** (sets for unique, sorted sets for ranking)
- Avoid `KEYS` in production — use `SCAN`
- Set **TTL** on cache keys to prevent memory growth

---

## Performance Checklist

- [ ] `maxmemory` configured with appropriate eviction policy
- [ ] Pipelining used for bulk operations
- [ ] Connection pooling enabled
- [ ] `KEYS` replaced with `SCAN`
- [ ] Hashes used for structured objects
- [ ] Slow log configured and monitored
- [ ] Latency monitoring enabled
- [ ] Transparent huge pages disabled
- [ ] AOF fsync policy set to `everysec` (not `always`)
- [ ] I/O threads enabled (multi-core machines)
- [ ] `redis-benchmark` run to baseline performance
- [ ] Memory fragmentation ratio monitored (~1.0 ideal)
