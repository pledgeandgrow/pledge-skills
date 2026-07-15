# Redis Monitoring and Observability

Tools and integrations for monitoring Redis instances.

---

## Built-in Monitoring

### INFO Command

```bash
# All sections
INFO

# Specific sections
INFO server
INFO clients
INFO memory
INFO persistence
INFO stats
INFO replication
INFO cpu
INFO commandstats
INFO latencystats
INFO cluster
INFO keyspace
```

### Key Metrics

| Metric | Section | Description |
|--------|---------|-------------|
| `used_memory` | memory | Total allocated memory (bytes) |
| `used_memory_rss` | memory | RSS as seen by OS |
| `mem_fragmentation_ratio` | memory | RSS / used_memory (ideal ~1.0) |
| `connected_clients` | clients | Active client connections |
| `blocked_clients` | clients | Blocked clients (BLPOP, etc.) |
| `total_commands_processed` | stats | Total commands processed |
| `instantaneous_ops_per_sec` | stats | Current ops/sec |
| `keys pace_hits` | stats | Keyspace hits |
| `keyspace_misses` | stats | Keyspace misses |
| `expired_keys` | stats | Keys expired |
| `evicted_keys` | stats | Keys evicted by maxmemory |
| `rejected_connections` | stats | Connections rejected |
| `latest_fork_usec` | stats | Last fork duration (microseconds) |
| `uptime_in_seconds` | server | Server uptime |
| `role` | replication | master or slave |
| `connected_slaves` | replication | Number of connected replicas |

### MEMORY Command

```bash
# Memory stats
MEMORY STATS

# Usage of a specific key
MEMORY USAGE mykey

# Detailed memory doctor
MEMORY DOCTOR

# MALLOC stats
MEMORY MALLOC-STATS

# Purge memory (flush memory pools)
MEMORY PURGE
```

### LATENCY Monitoring

```conf
# redis.conf
latency-monitor-threshold 100   # Log events blocking for 100ms+
```

```bash
# View latest latency events
LATENCY LATEST

# History of a specific event
LATENCY HISTORY command

# Graph of latency events
LATENCY GRAPH command

# Reset latency data
LATENCY RESET
```

### SLOWLOG

```conf
# redis.conf
slowlog-log-slower-than 10000   # 10ms in microseconds
slowlog-max-len 128
```

```bash
SLOWLOG GET 10
SLOWLOG LEN
SLOWLOG RESET
```

### CLIENT Monitoring

```bash
# List all clients
CLIENT LIST

# List with specific filters (Redis 7+)
CLIENT LIST TYPE pubsub

# Client info for current connection
CLIENT INFO

# Get client ID
CLIENT ID

# Track connections over time
CLIENT NO-EVICT ON   # prevent this client from being evicted
```

### MONITOR (Debug Only)

```bash
# Monitor all commands (WARNING: significant performance impact)
MONITOR
```

---

## Redis Insight

Redis Insight is a free GUI tool for Redis.

### Features

- Browse and edit data
- CLI built-in
- Memory analysis
- Slow log viewer
- Pub/Sub monitor
- Stream visualization
- Performance profiling

### Running

```bash
# Docker
docker run -d --name redisinsight -p 5540:5540 redis/redisinsight:latest

# Access at http://localhost:5540
```

---

## Prometheus and Grafana

### Redis Exporter

```bash
# Run Redis exporter
docker run -d --name redis-exporter \
  -e REDIS_ADDR=redis://localhost:6379 \
  -e REDIS_PASSWORD=yourpassword \
  -p 9121:9121 \
  oliver006/redis_exporter
```

### Prometheus Configuration

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'redis'
    static_configs:
      - targets: ['localhost:9121']
```

### Grafana Dashboard

Import the official Redis dashboard:
1. Open Grafana → Dashboards → Import
2. Use dashboard ID: **763** (Redis Dashboard for Prometheus)
3. Or ID: **11835** (Redis Overview)

### Key Metrics to Alert On

| Metric | Alert Condition | Description |
|--------|----------------|-------------|
| `redis_memory_used_bytes` | > 80% of maxmemory | Memory pressure |
| `redis_connected_clients` | > 1000 | Too many connections |
| `redis_rejected_connections` | > 0 | Connections being rejected |
| `redis_evicted_keys_total` | rate > 0 | Keys being evicted |
| `redis_keyspace_misses_total` | rate high | Cache miss rate |
| `redis_command_call_duration_seconds` | p99 > 100ms | Slow commands |
| `redis_up` | == 0 | Server down |
| `redis_replication_offset_diff` | > 1000 | Replica lag |

---

## Datadog

### Integration

```yaml
# datadog.yaml (Agent config)
init_config:
instances:
  - host: localhost
    port: 6379
    password: yourpassword
    # Optional: collect more metrics
    command_stats: true
    latency_stats: true
```

### Key Datadog Metrics

| Metric | Description |
|--------|-------------|
| `redis.net.clients` | Connected clients |
| `redis.mem.used` | Memory used |
| `redis.mem.fragmentation_ratio` | Fragmentation ratio |
| `redis.persist.rdb.last_save_time` | Last RDB save |
| `redis.stats.commands` | Commands processed |
| `redis.stats.evicted_keys` | Evicted keys |
| `redis.stats.expired_keys` | Expired keys |
| `redis.replication.backlog_histlen` | Replication backlog |

---

## Dynatrace

### Configuration

1. Go to **Settings → Integration → Problem notifications**
2. Add Redis as a custom extension
3. Configure connection details (host, port, password)

### OneAgent Extension

```yaml
# dynatrace extension config
name: custom.redis.monitoring
version: 1.0
metrics:
  - key: redis.memory.used
    metadata:
      displayName: Redis Memory Used
  - key: redis.clients.connected
    metadata:
      displayName: Connected Clients
```

---

## New Relic

### Integration

```yaml
# newrelic.yml
integrations:
  - name: nri-redis
    env:
      HOSTNAME: localhost
      PORT: 6379
      PASSWORD: yourpassword
    interval: 15s
```

### NRQL Queries

```sql
-- Memory usage
SELECT latest(redis.memory.used) / latest(redis.memory.max) * 100 AS 'Memory %'

-- Ops per second
SELECT rate(count(*), 1 second) FROM redis.sample

-- Cache hit ratio
SELECT sum(redis.keyspace.hits) / (sum(redis.keyspace.hits) + sum(redis.keyspace.misses)) * 100 AS 'Hit Ratio %'

-- Connected clients
SELECT latest(redis.net.clients) AS 'Connected Clients'
```

---

## Custom Monitoring Scripts

### Bash Health Check

```bash
#!/bin/bash
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASS="yourpassword"

# Ping check
PING=$(redis-cli -h $REDIS_HOST -p $REDIS_PORT -a $REDIS_PASS ping 2>/dev/null)
if [ "$PING" != "PONG" ]; then
  echo "CRITICAL: Redis not responding to PING"
  exit 2
fi

# Memory check
MEM=$(redis-cli -h $REDIS_HOST -p $REDIS_PORT -a $REDIS_PASS info memory 2>/dev/null | grep used_memory: | cut -d: -f2 | tr -d '\r')
MAX=$(redis-cli -h $REDIS_HOST -p $REDIS_PORT -a $REDIS_PASS config get maxmemory 2>/dev/null | tail -1)
if [ "$MAX" -gt 0 ] && [ "$MEM" -gt $((MAX * 80 / 100)) ]; then
  echo "WARNING: Memory usage above 80%"
  exit 1
fi

# Replication check
ROLE=$(redis-cli -h $REDIS_HOST -p $REDIS_PORT -a $REDIS_PASS info replication 2>/dev/null | grep role: | cut -d: -f2 | tr -d '\r')
echo "OK: Redis is $ROLE, memory: $MEM bytes"
exit 0
```

### Python Monitoring

```python
import redis
import time

r = redis.Redis(host='localhost', port=6379)

def collect_metrics():
    info = r.info()
    return {
        'used_memory': info['used_memory'],
        'connected_clients': info['connected_clients'],
        'ops_per_sec': info['instantaneous_ops_per_sec'],
        'keyspace_hits': info['keyspace_hits'],
        'keyspace_misses': info['keyspace_misses'],
        'evicted_keys': info['evicted_keys'],
        'uptime': info['uptime_in_seconds'],
    }

while True:
    metrics = collect_metrics()
    print(f"Memory: {metrics['used_memory']}, Clients: {metrics['connected_clients']}, Ops/s: {metrics['ops_per_sec']}")
    time.sleep(10)
```

---

## Monitoring Checklist

- [ ] `INFO` metrics collected regularly
- [ ] Memory usage monitored (used_memory, fragmentation ratio)
- [ ] Connected clients tracked
- [ ] Ops/sec tracked
- [ ] Keyspace hit/miss ratio monitored
- [ ] Evicted keys alerted on
- [ ] Slow log configured and reviewed
- [ ] Latency monitoring enabled
- [ ] Replication lag monitored (if applicable)
- [ ] Prometheus/Grafana or equivalent dashboard set up
- [ ] Alerts configured for critical metrics
- [ ] Redis Insight available for debugging
