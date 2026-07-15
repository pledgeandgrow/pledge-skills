# Redis I/O Tool (RIOT)

RIOT is a command-line tool for streaming data between Redis and external sources/destinations.

---

## Overview

RIOT supports:
- Import from CSV, JSON, XML, databases (JDBC)
- Export to CSV, JSON, databases
- Redis-to-Redis migration and replication
- File generation for bulk loading
- Stream processing pipelines

---

## Installation

```bash
# Download
wget https://github.com/redis/riot/releases/latest/download/riot-redis-<version>.tar.gz
tar -xzf riot-redis-<version>.tar.gz
cd riot-redis-<version>

# Or via Docker
docker run --rm redis/riot-redis:latest --help
```

---

## Import

### CSV Import

```bash
# Import CSV into Redis hashes
riot -h localhost -p 6379 import csv \
  --file data.csv \
  --header \
  --key-separator : \
  --keys id \
  --hash

# With key prefix
riot import csv \
  --file users.csv \
  --header \
  --keys id \
  --key-prefix user: \
  --hash
```

### JSON Import

```bash
# Import JSON lines into Redis hashes
riot import json \
  --file data.json \
  --keys id \
  --key-prefix product: \
  --hash

# Import JSON array
riot import json \
  --file products.json \
  --root-element products \
  --keys sku \
  --key-prefix product: \
  --hash
```

### Database Import (JDBC)

```bash
# Import from SQL database
riot import jdbc \
  --url "jdbc:postgresql://localhost:5432/mydb" \
  --username user \
  --password pass \
  --sql "SELECT id, name, email FROM users" \
  --keys id \
  --key-prefix user: \
  --hash
```

### Generator (Synthetic Data)

```bash
# Generate synthetic data
riot generate \
  --count 100000 \
  --key-prefix test: \
  --hash \
  --field name --field-type random \
  --field email --field-type email
```

---

## Export

### CSV Export

```bash
# Export Redis hashes to CSV
riot export csv \
  --file output.csv \
  --scan match "user:*" \
  --header
```

### JSON Export

```bash
# Export to JSON
riot export json \
  --file output.json \
  --scan match "product:*"
```

### Database Export (JDBC)

```bash
# Export to SQL database
riot export jdbc \
  --url "jdbc:postgresql://localhost:5432/mydb" \
  --username user \
  --password pass \
  --table users \
  --scan match "user:*"
```

---

## Redis-to-Redis Migration

```bash
# Migrate all keys from source to destination
riot replicate \
  --source redis://source-host:6379 \
  --target redis://dest-host:6379 \
  --scan match "*"

# With authentication
riot replicate \
  --source "redis://:password@source-host:6379" \
  --target "redis://:password@dest-host:6379"

# Migrate specific key patterns
riot replicate \
  --source redis://source:6379 \
  --target redis://dest:6379 \
  --scan match "user:*" \
  --scan match "session:*"

# Live replication (continuous)
riot replicate \
  --source redis://source:6379 \
  --target redis://dest:6379 \
  --live
```

---

## Stream Processing

```bash
# Read from Redis Stream, write to Redis Hash
riot stream \
  --source redis://localhost:6379 \
  --stream events \
  --consumer-group riot \
  --consumer consumer1 \
  --target redis://localhost:6379 \
  --write-hash event: \
  --keys id
```

---

## Common Options

| Option | Description |
|--------|-------------|
| `-h, --host` | Redis host |
| `-p, --port` | Redis port |
| `-a, --password` | Redis password |
| `--tls` | Enable TLS |
| `--batch` | Batch size (default: 50) |
| `--threads` | Number of threads |
| `--dry-run` | Preview without executing |
| `--help` | Show help |

---

## Examples

### Migrate from Redis to Redis Cloud

```bash
riot replicate \
  --source "redis://localhost:6379" \
  --target "redis://:password@your-endpoint.redns.redis-cloud.com:12345" \
  --batch 100 \
  --threads 4
```

### Import CSV with Expiration

```bash
riot import csv \
  --file sessions.csv \
  --header \
  --keys session_id \
  --key-prefix session: \
  --hash \
  --ttl 3600
```

### Export Keyspace to JSON

```bash
riot export json \
  --file dump.json \
  --scan match "*" \
  --batch 500
```

### Generate Test Data

```bash
# Generate 1M hashes with random fields
riot generate \
  --count 1000000 \
  --key-prefix test:user: \
  --hash \
  --field id --field-type sequence \
  --field name --field-type firstname \
  --field email --field-type email \
  --field age --field-type random-int --min 18 --max 80
```
