# Redis Persistence

Redis provides two persistence mechanisms: RDB snapshots and AOF (Append-Only File).

---

## RDB (Redis Database)

Point-in-time snapshots of the dataset.

### Configuration

```conf
# redis.conf
save 900 1      # Save if at least 1 key changed in 900s
save 300 10     # Save if at least 10 keys changed in 300s
save 60 10000   # Save if at least 10000 keys changed in 60s

# Disable RDB (AOF only)
save ""

# Compression
rdbcompression yes
rdbchecksum yes

# File name and directory
dbfilename dump.rdb
dir /var/lib/redis
```

### Manual Operations

```bash
# Synchronous save (blocks server)
SAVE

# Background save (non-blocking)
BGSAVE

# Check last save time
LASTSAVE

# Debug: force RDB checksum check
DEBUG OBJECT dump.rdb
```

### Advantages

- Compact single-file backup
- Fast disaster recovery (load binary directly)
- Minimal fork overhead for backups
- Ideal for backups and replication

### Disadvantages

- Data loss between snapshots
- Fork can cause latency spike on large datasets
- Not suitable for minimal data loss requirements

---

## AOF (Append-Only File)

Logs every write command. Replay on restart for durability.

### Configuration

```conf
# Enable AOF
appendonly yes
appendfilename "appendonly.aof"
appenddirname "appendonlydir"

# fsync policy
appendfsync always      # Sync every write (safest, slowest)
appendfsync everysec    # Sync once per second (default, balanced)
appendfsync no          # Let OS decide (fastest, risk of data loss)

# Rewrite triggers
auto-aof-rewrite-percentage 100   # Rewrite when size doubles
auto-aof-rewrite-min-size 64mb    # Minimum size to trigger rewrite
```

### fsync Policies

| Policy | Data Loss Risk | Performance |
|--------|---------------|-------------|
| `always` | None | Slowest (every write synced) |
| `everysec` | Up to 1 second | Good (default) |
| `no` | OS-dependent | Fastest |

### AOF Rewrite

```bash
# Manual rewrite (non-blocking)
BGREWRITEAOF

# Check AOF file integrity
redis-check-aof --fix appendonly.aof
```

### AOF Structure (Redis 7+)

Redis 7+ uses a multi-part AOF:

```
appendonlydir/
├── manifest.aof           # Manifest listing base + incremental files
├── appendonly.aof.1.base.rdb   # Base file (RDB format)
├── appendonly.aof.1.incr.aof   # Incremental changes
```

### Advantages

- Minimal data loss (down to 1 second with `everysec`)
- Human-readable log (older format)
- Append-only writes are efficient

### Disadvantages

- Larger file size than RDB
- Slower on restart (replay commands)
- Rewrite can cause latency spikes

---

## Combined Persistence (RDB + AOF)

Use both for optimal recovery:

```conf
save 900 1
save 300 10
save 60 10000
appendonly yes
appendfsync everysec
```

On restart, Redis loads AOF first (more complete). The AOF base file uses RDB format for fast loading, with incremental AOF for recent changes.

---

## Persistence Management

```bash
# Check persistence status
INFO persistence

# Disable persistence (for pure cache)
CONFIG SET save ""
CONFIG SET appendonly no

# Enable AOF at runtime
CONFIG SET appendonly yes

# Check AOF status
INFO persistence | grep aof
```

---

## Backup Strategy

```bash
# 1. Background save
BGSAVE

# 2. Wait for completion
# Check LASTSAVE timestamp

# 3. Copy RDB file
cp /var/lib/redis/dump.rdb /backup/dump-$(date +%Y%m%d).rdb

# 4. Or copy AOF directory
cp -r /var/lib/redis/appendonlydir /backup/

# Automated backup script
#!/bin/bash
redis-cli BGSAVE
while [ $(redis-cli LASTSAVE) -le $LASTSAVE_TIME ]; do sleep 1; done
cp /var/lib/redis/dump.rdb /backup/dump-$(date +%Y%m%d%H%M).rdb
```

---

## Disaster Recovery

```bash
# From RDB backup
# 1. Stop Redis
# 2. Replace dump.rdb with backup
# 3. Start Redis

# From AOF backup
# 1. Stop Redis
# 2. Replace appendonlydir with backup
# 3. Start Redis

# Check AOF file
redis-check-aof --fix /path/to/appendonly.aof

# Check RDB file
redis-check-rdb /path/to/dump.rdb
```

---

## Performance Impact

| Operation | Impact |
|-----------|--------|
| `SAVE` | Blocks all clients (avoid in production) |
| `BGSAVE` | Forks process, may cause latency on large datasets |
| `BGREWRITEAOF` | Forks process, similar to BGSAVE |
| `appendfsync always` | Significant write latency |
| `appendfsync everysec` | Minimal impact (background thread) |

---

## Choosing a Strategy

| Use Case | Strategy |
|----------|----------|
| Pure cache (data reproducible) | No persistence |
| Session store | AOF everysec |
| Database with moderate durability | RDB + AOF everysec |
| Maximum durability | AOF always + frequent RDB |
| Backup-focused | RDB only with frequent saves |
