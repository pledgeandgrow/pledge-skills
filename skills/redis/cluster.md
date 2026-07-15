# Redis Cluster, Replication, and Sentinel

Scaling Redis with clustering, replication, and high availability.

---

## Replication

Redis replication uses a master-replica model. Replicas asynchronously copy the master's dataset.

### Configuration

```conf
# On replica — redis.conf
replicaof 10.0.0.1 6379

# With authentication
masterauth "master-password"
replicaauth "replica-password"

# Read-only mode (default)
replica-read-only yes

# Replica priority (lower = preferred for failover)
replica-priority 100
```

### Runtime Commands

```bash
# Become a replica
REPLICAOF 10.0.0.1 6379

# Stop being a replica (become master)
REPLICAOF NO ONE

# Check replication info
INFO replication
ROLE
```

### Replication Info

```bash
INFO replication
# role:master
# connected_slaves:2
# slave0:ip=10.0.0.2,port=6379,state=online,offset=123456,lag=0
# slave1:ip=10.0.0.3,port=6379,state=online,offset=123456,lag=1
# master_repl_offset:123456
# repl_backlog_size:1048576
```

### How Replication Works

1. Replica connects to master and sends `PSYNC` command
2. Master performs a background save (BGSAVE) and buffers new commands
3. Master sends RDB file to replica
4. Replica loads RDB and processes buffered commands
5. Master streams commands to replica in real-time

### Partial Resynchronization

If a replica disconnects briefly, it can resume without full sync:

```conf
# redis.conf (master)
repl-backlog-size 1mb       # Circular buffer for partial sync
repl-backlog-ttl 3600       # Backlog retention after all replicas disconnect
```

---

## Sentinel

Redis Sentinel provides high availability, monitoring, and automatic failover.

### Architecture

```
        Sentinel 1    Sentinel 2    Sentinel 3
            |              |              |
            +----- Master ----- Replica 1
                      |
                  Replica 2
```

### Configuration

```conf
# sentinel.conf
port 26379
sentinel monitor mymaster 10.0.0.1 6379 2
sentinel down-after-milliseconds mymaster 5000
sentinel failover-timeout mymaster 60000
sentinel parallel-syncs mymaster 1
sentinel auth-pass mymaster "your-password"
```

- `quorum` (2): Number of Sentinels that must agree master is down
- `down-after-milliseconds` (5000): Time before marking master as down
- `failover-timeout` (60000): Failover timeout
- `parallel-syncs` (1): Number of replicas to reconfigure simultaneously

### Sentinel Commands

```bash
# Connect to sentinel
redis-cli -p 26379

# Get master info
SENTINEL get-master-addr-by-name mymaster

# List masters
SENTINEL masters

# List replicas
SENTINEL replicas mymaster

# List other sentinels
SENTINEL sentinels mymaster

# Check if master is down
SENTINEL ckquorum mymaster

# Force failover
SENTINEL failover mymaster

# Reset
SENTINEL reset mymaster
```

### Client Connection with Sentinel

```python
from redis.sentinel import Sentinel

sentinel = Sentinel([
    ('localhost', 26379),
    ('localhost', 26380),
    ('localhost', 26381),
], socket_timeout=0.1)

# Get master connection
master = sentinel.master_for('mymaster', socket_timeout=0.1)
master.set('key', 'value')

# Get replica connection (for reads)
replica = sentinel.replica_for('mymaster', socket_timeout=0.1)
replica.get('key')
```

---

## Redis Cluster

Redis Cluster provides horizontal scaling with automatic sharding across multiple nodes.

### Architecture

```
  Node A (slots 0-5460)     Node B (slots 5461-10922)     Node C (slots 10923-16383)
    | Replica A                 | Replica B                   | Replica C
```

- 16,384 hash slots distributed across nodes
- Each key maps to a slot: `slot = CRC16(key) mod 16384`
- Each node handles a subset of slots
- Each master can have replicas for failover

### Creating a Cluster

```bash
# Start 6 Redis instances (3 masters + 3 replicas)
# redis-7000.conf
port 7000
cluster-enabled yes
cluster-config-file nodes-7000.conf
cluster-node-timeout 5000
appendonly yes

# Create cluster
redis-cli --cluster create 127.0.0.1:7000 127.0.0.1:7001 127.0.0.1:7002 \
  127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005 \
  --cluster-replicas 1
```

### Cluster Commands

```bash
# Cluster info
CLUSTER INFO

# List nodes
CLUSTER NODES

# Cluster slots
CLUSTER SLOTS

# My ID
CLUSTER MYID

# Count keys in slot
CLUSTER COUNTKEYSINSLOT 1234

# Get keys in slot
CLUSTER GETKEYSINSLOT 1234 10

# Key's slot
CLUSTER KEYSLOT mykey

# Add node
CLUSTER MEET 127.0.0.1 7006

# Reshard (interactive)
redis-cli --cluster reshard 127.0.0.1:7000

# Rebalance
redis-cli --cluster rebalance 127.0.0.1:7000

# Check cluster
redis-cli --cluster check 127.0.0.1:7000

# Fix cluster
redis-cli --cluster fix 127.0.0.1:7000
```

### Hash Tags

For multi-key operations, keys must be on the same slot:

```bash
# Keys with same hash tag go to same slot
SET {user:1000}:name "Alice"
SET {user:1000}:age 30
MGET {user:1000}:name {user:1000}:age   # works (same slot)
```

The part between `{` and `}` is used for slot calculation.

### Connecting with Cluster Clients

```python
from redis.cluster import RedisCluster

rc = RedisCluster(host='localhost', port=7000, decode_responses=True)
rc.set('key', 'value')
rc.get('key')
```

```js
import { createCluster } from 'redis';

const cluster = createCluster({
  rootNodes: [
    { url: 'redis://localhost:7000' },
    { url: 'redis://localhost:7001' },
    { url: 'redis://localhost:7002' },
  ],
});
await cluster.connect();
await cluster.set('key', 'value');
```

```java
import redis.clients.jedis.JedisCluster;
import redis.clients.jedis.HostAndPort;

Set<HostAndPort> nodes = Set.of(
    new HostAndPort("localhost", 7000),
    new HostAndPort("localhost", 7001),
    new HostAndPort("localhost", 7002)
);
try (JedisCluster cluster = new JedisCluster(nodes)) {
    cluster.set("key", "value");
}
```

### Cluster Limitations

- Only database 0 is supported
- Multi-key commands require keys on the same slot (use hash tags)
- `MULTI`/`EXEC` transactions only work within same slot
- `DBSIZE` returns per-node count
- Pub/Sub broadcasts across all nodes (use Sharded Pub/Sub for efficiency)

---

## Choosing a Deployment Model

| Model | Use Case | Sharding | HA | Complexity |
|-------|----------|----------|-----|------------|
| Single | Dev/testing | No | No | Low |
| Master-Replica | Read scaling, backup | No | Manual | Medium |
| Sentinel | HA without sharding | No | Automatic | Medium |
| Cluster | Scale + HA | Yes | Automatic | High |
