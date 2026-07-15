# Redis

Redis is an in-memory data store used as a database, cache, message broker, and streaming engine. It supports multiple data structures, pub/sub, streaming, vector search, and more.

**Version**: Redis 8.x (Redis Open Source replaces Redis Stack)

---

## Quick Reference

| Topic | File |
|------|------|
| Getting Started (install, connect, first commands) | `getting-started.md` |
| Data Types Overview (all types, when to use each) | `data-types.md` |
| Strings (strings, bitmaps, bitfields) | `strings.md` |
| Hashes (field-value pairs, field expiration) | `hashes.md` |
| Lists (linked lists, blocking ops, capped lists) | `lists.md` |
| Sets & Sorted Sets (unique members, leaderboards) | `sets.md` |
| Streams (log data structure, consumer groups) | `streams.md` |
| JSON (store and query JSON documents) | `json.md` |
| Geospatial (geo indexes, GEOSEARCH) | `geospatial.md` |
| Probabilistic (Bloom, Cuckoo, HyperLogLog, CMS, t-digest, Top-K) | `probabilistic.md` |
| Time Series (time series data type) | `timeseries.md` |
| Pub/Sub (channels, pattern matching, keyspace notifications) | `pubsub.md` |
| Commands (command reference by category) | `commands.md` |
| Clients (Python, JavaScript, Java, C#, PHP) | `clients.md` |
| Keys & Patterns (expiration, SCAN, transactions, pipelining) | `keys-patterns.md` |
| Persistence (RDB, AOF, configuration) | `persistence.md` |
| Security (ACL, TLS, best practices) | `security.md` |
| Cluster (clustering, replication, sentinel) | `cluster.md` |
| Performance (memory management, tuning) | `performance.md` |
| AI & Vector (vector database, search and query, RedisVL) | `ai-vector.md` |
| Vector Sets (native vector similarity data type) | `vector-sets.md` |
| Arrays (sparse, index-addressable sequences) | `arrays.md` |
| Search & Query (full-text search, aggregations, spellcheck) | `search.md` |
| Scripting (Lua EVAL, Redis Functions) | `scripting.md` |
| Monitoring (Prometheus, Grafana, Datadog, New Relic) | `monitoring.md` |
| Deployment (Redis Cloud, Kubernetes, Docker, systemd) | `deployment.md` |
| RIOT (Redis I/O Tool, import/export/migration) | `riot.md` |
| Configuration (full redis.conf reference) | `configuration.md` |

---

## Core Concepts

- **In-memory**: All data lives in RAM for sub-millisecond latency
- **Single-threaded**: Commands processed sequentially (fast enough for most workloads)
- **Key-value store**: Values can be strings, hashes, lists, sets, sorted sets, streams, JSON, and more
- **Persistence**: Optional disk persistence via RDB snapshots and/or AOF logs
- **Pub/Sub**: Built-in message broker with pattern matching
- **Clustering**: Horizontal scaling with automatic sharding
- **Vector Search**: Built-in vector similarity search for AI applications

---

## First Command

```bash
redis-cli
127.0.0.1:6379> SET mykey "Hello"
OK
127.0.0.1:6379> GET mykey
"Hello"
127.0.0.1:6379> DEL mykey
(integer) 1
```

---

## Data Types at a Glance

| Type | Description | Use Case |
|------|-------------|----------|
| String | Sequence of bytes (up to 512MB) | Caching, counters, sessions |
| Hash | Field-value pairs | Objects, user profiles |
| List | Ordered list of strings | Queues, timelines |
| Set | Unordered unique strings | Tags, unique visitors |
| Sorted Set | Unique strings with scores | Leaderboards, rankings |
| Stream | Append-only log | Event sourcing, messaging |
| JSON | Structured JSON documents | Complex nested data |
| Bitmap | Bit operations on strings | Feature flags, analytics |
| Geospatial | Latitude/longitude indexes | Location search |
| Time Series | Time-stamped data points | Metrics, monitoring |
| Vector Set | Vector embeddings | AI similarity search |
| Array | Sparse, index-addressable | Sparse data, ring buffers |

---

## Official Documentation

- [Redis Docs](https://redis.io/docs/latest/)
- [Commands Reference](https://redis.io/docs/latest/commands/)
- [Develop Guide](https://redis.io/docs/latest/develop/)
- [Operate Guide](https://redis.io/docs/latest/operate/oss_and_stack/)
