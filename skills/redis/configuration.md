# Redis Configuration Reference

Complete reference for `redis.conf` settings.

---

## Network

```conf
# Network interface to bind (default: all interfaces)
bind 127.0.0.1 ::1

# TCP port (default: 6379)
port 6379

# TLS port (set to 0 to disable)
tls-port 0

# TCP listen backlog
tcp-backlog 511

# TCP keepalive (seconds, 0 = disabled)
tcp-keepalive 300

# Protected mode (blocks external access without auth)
protected-mode yes

# Unix socket (alternative to TCP)
unixsocket /var/run/redis/redis-server.sock
unixsocketperm 700
```

## TLS

```conf
tls-port 6379
port 0
tls-cert-file /etc/redis/redis.crt
tls-key-file /etc/redis/redis.key
tls-ca-cert-file /etc/redis/ca.crt
tls-auth-clients no
tls-auth-clients optional
tls-replication yes
tls-cluster yes
tls-protocols "TLSv1.2 TLSv1.3"
tls-ciphers "DEFAULT:!MEDIUM"
tls-ciphersuites "TLS_AES_256_GCM_SHA384"
```

## General

```conf
# Daemonize (run in background)
daemonize no

# Supervised (systemd/upstart/no)
supervised no

# PID file
pidfile /var/run/redis/redis-server.pid

# Log level: debug, verbose, notice, warning
loglevel notice

# Log file (empty = stdout)
logfile ""

# Syslog
syslog-enabled no
syslog-ident redis
syslog-facility local0

# Databases (default: 16)
databases 16
```

## Security

```conf
# Password
requirepass "your-strong-password"

# ACL file
aclfile /etc/redis/users.acl

# Rename/disable commands
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command CONFIG ""
rename-command DEBUG ""
```

## Memory Management

```conf
# Max memory limit
maxmemory 2gb

# Eviction policy
maxmemory-policy allkeys-lru

# Max memory samples (for LRU/LFU)
maxmemory-samples 5

# Eviction effort (1-10, higher = more thorough)
active-expire-effort 1

# Don't evict on per-client basis
maxmemory-clients no
```

### Eviction Policies

| Policy | Description |
|--------|-------------|
| `noeviction` | Return errors on write |
| `allkeys-lru` | Evict least recently used (any key) |
| `allkeys-lfu` | Evict least frequently used |
| `allkeys-random` | Evict random keys |
| `volatile-lru` | LRU among keys with TTL |
| `volatile-lfu` | LFU among keys with TTL |
| `volatile-random` | Random among keys with TTL |
| `volatile-ttl` | Evict shortest TTL |

## Persistence - RDB

```conf
# Save rules (seconds + minimum changes)
save 900 1
save 300 10
save 60 10000

# Disable RDB
save ""

# RDB file name
dbfilename dump.rdb

# RDB compression
rdbcompression yes
rdbchecksum yes

# Data directory
dir /var/lib/redis

# Stop writes on RDB errors
stop-writes-on-bgsave-error yes
```

## Persistence - AOF

```conf
# Enable AOF
appendonly yes

# AOF file name
appendfilename "appendonly.aof"
appenddirname "appendonlydir"

# fsync policy: always, everysec, no
appendfsync everysec

# Rewrite triggers
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb

# AOF load truncated
aof-load-truncated yes

# Use RDB preamble in AOF
aof-use-rdb-preamble yes
```

## Replication

```conf
# Master host and port
replicaof <master-ip> <master-port>

# Master password
masterauth "master-password"

# Replica authentication
replicaauth "replica-password"

# Read-only replica
replica-read-only yes

# Replica priority (lower = preferred for failover)
replica-priority 100

# Replication backlog
repl-backlog-size 1mb
repl-backlog-ttl 3600

# Diskless replication (sync via socket)
repl-diskless-sync yes
repl-diskless-sync-delay 5
repl-diskless-sync-load rdb-preamble

# Min replicas to write
min-replicas-to-write 0
min-replicas-max-lag 10
```

## Cluster

```conf
# Enable cluster mode
cluster-enabled yes

# Cluster config file (auto-generated)
cluster-config-file nodes-6379.conf

# Node timeout (ms)
cluster-node-timeout 15000

# Cluster port (default: port + 10000)
cluster-port 16379

# Replica migration
cluster-migration-barrier 1

# Require full coverage
cluster-require-full-coverage yes

# Allow reads from replicas
cluster-allow-reads-when-down no
```

## Data Structure Encoding

```conf
# Hash: listpack -> hashtable
hash-max-listpack-entries 128
hash-max-listpack-value 64

# List: listpack -> quicklist
list-max-listpack-size -2
list-compress-depth 0

# Set: intset/listpack -> hashtable
set-max-intset-entries 512
set-max-listpack-entries 128
set-max-listpack-value 64

# Sorted Set: listpack -> skiplist
zset-max-listpack-entries 128
zset-max-listpack-value 64

# Stream
stream-node-max-bytes 4096
stream-node-max-entries 100

# HyperLogLog
hll-sparse-max-bytes 3000
```

## I/O and Threading

```conf
# I/O threads (0 = disabled)
io-threads 4

# I/O threads for reads
io-threads-do-reads no

# Disable transparent huge pages
# (run at OS level: echo never > /sys/kernel/mm/transparent_hugepage/enabled)
```

## Slow Log

```conf
# Log commands slower than 10ms (microseconds)
slowlog-log-slower-than 10000

# Max entries
slowlog-max-len 128
```

## Latency Monitor

```conf
# Log events blocking for 100ms+
latency-monitor-threshold 100
```

## Client Output Buffer

```conf
# Normal clients
client-output-buffer-limit normal 0 0 0

# Replica clients
client-output-buffer-limit replica 256mb 64mb 60

# Pub/Sub clients
client-output-buffer-limit pubsub 32mb 8mb 60

# Client query buffer limit
client-query-buffer-limit 1gb

# Proto max bulk string size
proto-max-bulk-len 512mb
```

## Timeout

```conf
# Close idle connections after N seconds (0 = disabled)
timeout 0
```

## Notify Keyspace Events

```conf
# Keyspace notification settings
# K = Keyspace, E = Keyevent
# g = generic, $ = string, l = list, s = set, h = hash, z = sorted set
# x = expired, e = evicted, t = stream, d = module
# m = key-miss, n = new key, A = alias for g$lshzxd
notify-keyspace-events ""
notify-keyspace-events Ex   # expired events only
notify-keyspace-events KEA  # all events
```

## Active Defragmentation

```conf
# Enable active defrag (Redis 4+)
activedefrag yes

# Fragmentation ratio threshold to start
active-defrag-ignore-bytes 100mb
active-defrag-threshold-lower 10
active-defrag-threshold-upper 100

# CPU limits
active-defrag-cycle-min 1
active-defrag-cycle-max 25
```

## RDB/AOF and Fork Tuning

```conf
# Disable transparent huge pages (OS level)
# echo never > /sys/kernel/mm/transparent_hugepage/enabled

# Disable THP via config
disable-thp yes
```

## Modules

```conf
# Load modules at startup
loadmodule /path/to/module.so
loadmodule /path/to/rejson.so
```

## Includes

```conf
# Include other config files
include /etc/redis/redis-common.conf
include /etc/redis/redis-cluster.conf
```

---

## Viewing and Modifying Config at Runtime

```bash
# Get all config
CONFIG GET *

# Get specific setting
CONFIG GET maxmemory
CONFIG GET save

# Set at runtime
CONFIG SET maxmemory 2gb
CONFIG SET maxmemory-policy allkeys-lru
CONFIG SET notify-keyspace-events KEA
CONFIG SET appendonly yes

# Rewrite config file (persist runtime changes)
CONFIG REWRITE

# Reset statistics
CONFIG RESETSTAT
```

---

## Important Notes

- Changes via `CONFIG SET` are **not persisted** until `CONFIG REWRITE` is called
- Some settings require a **restart** (e.g., `bind`, `port`, `cluster-enabled`)
- Use `CONFIG GET *` to see all current values
- The `dir` setting determines where RDB and AOF files are stored
- Always test config changes in a non-production environment first
