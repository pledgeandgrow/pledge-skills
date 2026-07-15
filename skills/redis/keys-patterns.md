# Redis Keys, Expiration, Transactions, and Pipelining

Core patterns for working with keys, managing lifecycle, and optimizing command execution.

---

## Key Naming Conventions

```bash
# Use colons as namespace separators
user:1000:profile
session:abc123
cache:api:users:1000
queue:email:pending

# Common patterns
object-type:id:field      # user:1000:name
object-type:id            # user:1000
service:entity:action     # cache:product:invalidate
```

### Best Practices

- Keep keys short but descriptive
- Use consistent separators (colons are conventional)
- Include type prefix for clarity
- Avoid very long keys (wastes memory)
- Use hashes for structured data instead of many flat keys

---

## Key Expiration

```bash
# Set TTL at creation
SET key "value" EX 3600        # 1 hour
SETEX key 3600 "value"         # 1 hour (deprecated, use SET EX)
PSETEX key 60000 "value"       # 60 seconds in ms

# Set TTL on existing key
EXPIRE key 3600                # seconds
PEXPIRE key 60000              # milliseconds
EXPIREAT key 1735689600        # Unix timestamp (seconds)
PEXPIREAT key 1735689600000    # Unix timestamp (ms)

# Conditional expiration (Redis 7+)
EXPIRE key 3600 NX             # only if no TTL set
EXPIRE key 3600 XX             # only if TTL already set
EXPIRE key 3600 GT             # only if new TTL > current TTL
EXPIRE key 3600 LT             # only if new TTL < current TTL

# Check TTL
TTL key                        # -1 = no expiry, -2 = key doesn't exist
PTTL key                       # milliseconds
EXPIRETIME key                 # Unix timestamp (seconds)
PEXPIRETIME key                # Unix timestamp (ms)

# Remove TTL
PERSIST key
```

### Expiration Strategy

Redis uses two mechanisms for key expiration:

1. **Lazy expiration**: Keys are checked on access. Expired keys are deleted on read.
2. **Active expiration**: Background task samples keys with TTL and deletes expired ones.

```bash
# Configure active expiration frequency
CONFIG SET active-expire-effort 1   # 1-10, higher = more aggressive
```

---

## SCAN

`SCAN` iterates over keys without blocking the server. Use instead of `KEYS` in production.

```bash
# Basic scan
SCAN 0                          # returns cursor + keys
SCAN 0 MATCH user:*             # pattern match
SCAN 0 COUNT 100                # hint for batch size
SCAN 0 TYPE hash                # filter by type

# Type-specific scan
HSCAN myhash 0 MATCH "na*"
SSCAN myset 0 COUNT 10
ZSCAN myzset 0
SSCAN myset 0
```

### Python Example

```python
cursor = 0
while True:
    cursor, keys = r.scan(cursor, match='user:*', count=100)
    for key in keys:
        print(key)
    if cursor == 0:
        break
```

### JavaScript Example

```js
let cursor = 0;
do {
  const reply = await client.scan(cursor, { MATCH: 'user:*', COUNT: 100 });
  cursor = reply.cursor;
  for (const key of reply.keys) {
    console.log(key);
  }
} while (cursor !== 0);
```

---

## Transactions

Redis transactions use `MULTI`/`EXEC` for atomic command execution.

```bash
# Start transaction
MULTI
# Queue commands (returns QUEUED)
SET key1 "val1"
INCR counter
GET key1
# Execute all queued commands atomically
EXEC
# Returns: [OK, 1, "val1"]

# Cancel transaction
MULTI
SET key "val"
DISCARD
```

### Optimistic Locking with WATCH

```bash
# Watch a key for changes
WATCH balance
val = GET balance
MULTI
SET balance (val - 100)
EXEC
# If balance changed between WATCH and EXEC, EXEC returns nil (transaction aborted)
```

### Python Example

```python
pipe = r.pipeline(transaction=True)
pipe.set('key1', 'val1')
pipe.incr('counter')
results = pipe.execute()
```

### JavaScript Example

```js
const results = await client.multi()
  .set('key1', 'val1')
  .incr('counter')
  .exec();
```

### Transaction Limitations

- Commands are queued but **not executed** until `EXEC`
- **No rollback**: If a command fails during EXEC, other commands still execute
- `WATCH` only detects changes, not reads
- Commands with syntax errors are detected at queue time (EXEC fails entirely)
- Runtime errors (e.g., wrong type) affect only the failing command

---

## Pipelining

Pipelining sends multiple commands without waiting for responses, reducing round-trip time.

```bash
# redis-cli pipeline
(echo -e "SET key1 val1\nSET key2 val2\nGET key1\n"; sleep 0.1) | redis-cli
```

### Python

```python
pipe = r.pipeline(transaction=False)  # pipeline without transaction
pipe.set('key1', 'val1')
pipe.set('key2', 'val2')
pipe.get('key1')
results = pipe.execute()
# [True, True, 'val1']
```

### JavaScript (node-redis)

```js
const results = await client.multi()
  .set('key1', 'val1')
  .set('key2', 'val2')
  .get('key1')
  .exec();
```

### JavaScript (ioredis)

```js
const pipeline = redis.pipeline();
pipeline.set('key1', 'val1');
pipeline.set('key2', 'val2');
pipeline.get('key1');
const results = await pipeline.exec();
```

### Java (Jedis)

```java
Pipeline pipe = jedis.pipelined();
pipe.set("key1", "val1");
pipe.set("key2", "val2");
Response<String> r = pipe.get("key1");
pipe.sync();
System.out.println(r.get());
```

### Pipeline vs Transaction

| Feature | Pipeline | Transaction (MULTI/EXEC) |
|---------|----------|--------------------------|
| Atomic | No | Yes |
| Reduces RTT | Yes | Yes |
| WATCH support | No | Yes |
| Commands interleaved | Possible | No (all or nothing) |

---

## Pub/Sub vs Keyspace Notifications

See `pubsub.md` for details on Pub/Sub and keyspace notifications.

---

## Key Eviction

When `maxmemory` is reached, Redis evicts keys based on the configured policy:

| Policy | Description |
|--------|-------------|
| `noeviction` | Return errors on write (default) |
| `allkeys-lru` | Evict least recently used (any key) |
| `allkeys-lfu` | Evict least frequently used (any key) |
| `allkeys-random` | Evict random keys |
| `volatile-lru` | Evict LRU among keys with TTL |
| `volatile-lfu` | Evict LFU among keys with TTL |
| `volatile-random` | Evict random keys with TTL |
| `volatile-ttl` | Evict keys with shortest TTL |

```bash
CONFIG SET maxmemory 256mb
CONFIG SET maxmemory-policy allkeys-lru
```

---

## Database Selection

Redis supports multiple logical databases (default: 16).

```bash
SELECT 0    # default
SELECT 1
SELECT 15

# Move key to another DB
MOVE mykey 1

# Swap databases
SWAPDB 0 1
```

**Note**: In Redis Cluster, only DB 0 is supported.
