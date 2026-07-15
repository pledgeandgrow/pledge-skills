# Redis Deployment and Operations

Deployment options, management, and operational best practices.

---

## Deployment Options

| Option | Description | Use Case |
|--------|-------------|----------|
| **Redis Open Source** | Self-hosted, free | Dev, testing, production (self-managed) |
| **Redis Cloud** | Fully managed SaaS | Production without ops overhead |
| **Redis Software** | Self-hosted enterprise | Enterprise with support |
| **Redis for Kubernetes** | Operator-based | Cloud-native deployments |

---

## Redis Open Source

### Installation

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install redis-server

# macOS
brew install redis

# From source
wget https://download.redis.io/redis-stable.tar.gz
tar -xzf redis-stable.tar.gz
cd redis-stable && make && sudo make install
```

### systemd Service

```ini
# /etc/systemd/system/redis.service
[Unit]
Description=Redis In-Memory Data Store
After=network.target

[Service]
User=redis
Group=redis
ExecStart=/usr/local/bin/redis-server /etc/redis/redis.conf
ExecStop=/usr/local/bin/redis-cli shutdown
Restart=always
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable redis
sudo systemctl start redis
sudo systemctl status redis
```

### Docker

```bash
# Basic
docker run --name redis -p 6379:6379 -d redis:latest

# With persistence and config
docker run --name redis \
  -p 6379:6379 \
  -v redis-data:/data \
  -v /path/to/redis.conf:/usr/local/etc/redis/redis.conf \
  -d redis:latest redis-server /usr/local/etc/redis/redis.conf
```

### Docker Compose (with replica)

```yaml
services:
  redis-master:
    image: redis:latest
    ports:
      - "6379:6379"
    volumes:
      - redis-master-data:/data
    command: redis-server --appendonly yes --requirepass yourpassword

  redis-replica:
    image: redis:latest
    ports:
      - "6380:6379"
    command: redis-server --replicaof redis-master 6379 --masterauth yourpassword
    depends_on:
      - redis-master

volumes:
  redis-master-data:
```

---

## Redis Cloud

Fully managed Redis service with auto-scaling, high availability, and backups.

### Features

- Automated provisioning and scaling
- Multi-AZ replication
- Automatic failover
- Backups and point-in-time recovery
- Redis Search, JSON, TimeSeries, etc. built-in
- CRDT-based Active-Active replication

### Getting Started

1. Sign up at [redis.com/cloud](https://redis.com/cloud/)
2. Create a database (select plan, region, size)
3. Get connection endpoint and credentials
4. Connect with any Redis client

```python
import redis

r = redis.Redis(
    host='your-endpoint.redns.redis-cloud.com',
    port=12345,
    password='your-password',
    decode_responses=True,
)
```

---

## Redis Software (Enterprise)

Self-hosted enterprise edition with additional features:

- Redis on Flash (use SSD + RAM)
- Active-Active CRDT replication
- Redis Gears (data processing)
- Role-based access control
- LDAP/SAML integration
- 24/7 support

### Installation

```bash
# Download Redis Software
wget https://downloads.redis.io/redis_enterprise/redis_enterprise_server_linux-x86_64-latest.tar.gz
tar -xzf redis_enterprise_server_linux-x86_64-latest.tar.gz
cd redis_enterprise_server_linux-x86_64-*
sudo ./install.sh
```

### Cluster Setup

```bash
# Create cluster
rladmin cluster create name=mycluster username=admin@admin.com password=admin

# Add node
rladmin join cluster name=mycluster username=admin@admin.com password=admin

# Create database
rladmin create db name=mydb size 4gb replication true
```

---

## Redis for Kubernetes

### Redis Operator

```yaml
# redis-cluster.yaml
apiVersion: redis.redis.opstreelabs.in/v1beta1
kind: Redis
metadata:
  name: redis-cluster
spec:
  mode: cluster
  size: 6
  redis:
    replicas: 6
  storage:
    volumeClaimTemplate:
      spec:
        resources:
          requests:
            storage: 10Gi
```

### Helm Chart

```bash
# Add Bitnami repo
helm repo add bitnami https://charts.bitnami.com/bitnami

# Install Redis
helm install my-redis bitnami/redis \
  --set architecture=replication \
  --set auth.password=mypassword \
  --set replica.replicaCount=3

# Install Redis Cluster
helm install my-cluster bitnami/redis-cluster \
  --set cluster.nodes=6 \
  --set cluster.replicas=1
```

### StatefulSet (Manual)

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis
spec:
  serviceName: redis
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:latest
        ports:
        - containerPort: 6379
        volumeMounts:
        - name: data
          mountPath: /data
        command: ["redis-server", "--appendonly", "yes"]
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
```

---

## Operational Tasks

### Backup

```bash
# RDB backup
redis-cli BGSAVE
# Wait for LASTSAVE to update
cp /var/lib/redis/dump.rdb /backup/dump-$(date +%Y%m%d).rdb

# AOF backup
cp -r /var/lib/redis/appendonlydir /backup/aof-$(date +%Y%m%d)/

# Scheduled backup (cron)
0 2 * * * /opt/redis/backup.sh
```

### Restore

```bash
# Stop Redis
sudo systemctl stop redis

# Replace RDB file
cp /backup/dump-20240115.rdb /var/lib/redis/dump.rdb
chown redis:redis /var/lib/redis/dump.rdb

# Start Redis
sudo systemctl start redis
```

### Upgrade

```bash
# 1. Backup
redis-cli BGSAVE

# 2. Stop Redis
sudo systemctl stop redis

# 3. Install new version
sudo apt update && sudo apt install redis-server

# 4. Start Redis
sudo systemctl start redis

# 5. Verify
redis-cli ping
redis-cli info server | grep redis_version
```

### Rolling Upgrade (Cluster)

```bash
# Upgrade one node at a time
# 1. For each master node:
#    a. Failover to a replica
redis-cli -p 7000 cluster failover

#    b. Wait for replica to become master
redis-cli -p 7000 info replication

#    c. Upgrade the old master
#    d. Repeat for all nodes
```

---

## Capacity Planning

| Workload | Memory Estimate |
|----------|----------------|
| 1M small strings (~50 bytes) | ~100MB |
| 1M hashes (10 fields, ~200 bytes) | ~300MB |
| 1M sorted sets (10 members) | ~400MB |
| 1M JSON documents (~1KB) | ~1.5GB |

### Formula

```
Total Memory = (Key count × Average key+value size) × Overhead factor
Overhead factor ≈ 1.2-1.5 (depends on encoding and fragmentation)
```

### Recommendations

- Reserve **30% free memory** for overhead, replication, and AOF rewrite
- Monitor `mem_fragmentation_ratio` (ideal: 1.0-1.5)
- Use `maxmemory` with appropriate eviction policy
- Consider Redis on Flash for large datasets (Enterprise)

---

## Security Hardening Checklist

See `security.md` for comprehensive security configuration.

---

## Best Practices

- **Use systemd or Docker** for process management
- **Enable persistence** (AOF everysec minimum) for data durability
- **Set maxmemory** with appropriate eviction policy
- **Monitor** memory, connections, and performance metrics
- **Regular backups** with tested restore procedures
- **Keep Redis updated** with latest stable version
- **Use connection pooling** in application clients
- **Separate cache and persistent data** into different instances
- **Use replicas** for read scaling and failover
- **Test failover** procedures regularly
