# Redis Probabilistic Data Structures

Redis provides several probabilistic data structures for memory-efficient approximate computations.

---

## Bloom Filter

Space-efficient set membership test. May have false positives, never false negatives.

```bash
# Create with error rate and capacity
BF.RESERVE myfilter 0.01 100000   # 1% error rate, 100K items

# Add items
BF.ADD myfilter "item1"
BF.MADD myfilter "item2" "item3" "item4"

# Check existence
BF.EXISTS myfilter "item1"        # 1 (probably exists)
BF.EXISTS myfilter "item5"        # 0 (definitely not exists)
BF.MEXISTS myfilter "item1" "item5"

# Get info
BF.INFO myfilter
BF.INFO myfilter CAPACITY
BF.INFO myfilter SIZE
BF.INFO myfilter FILTERS
```

### Use Cases

- Email/username dedup
- Malicious URL filtering
- Cache penetration prevention
- Hateful content filtering

---

## Cuckoo Filter

Like Bloom Filter but supports deletion.

```bash
# Create
CF.RESERVE myfilter 100000   # capacity

# Add
CF.ADD myfilter "item1"
CF.ADDNX myfilter "item1"     # add only if not exists

# Check
CF.EXISTS myfilter "item1"
CF.MEXISTS myfilter "item1" "item2"

# Delete
CF.DEL myfilter "item1"

# Count
CF.COUNT myfilter

# Info
CF.INFO myfilter
```

---

## HyperLogLog

Estimates cardinality (unique count) with ~0.81% error using minimal memory (~12KB).

```bash
# Add elements
PFADD visitors:2024-01-15 "user:1" "user:2" "user:3" "user:1"  # duplicates ignored

# Get estimated cardinality
PFCOUNT visitors:2024-01-15

# Merge multiple HLLs
PFMERGE visitors:week visitors:2024-01-14 visitors:2024-01-15 visitors:2024-01-16
PFCOUNT visitors:week
```

### Use Cases

```bash
# Unique visitors per day
PFADD uv:2024-01-15 "user:1" "user:2" "user:3"
PFCOUNT uv:2024-01-15

# Weekly unique visitors
PFMERGE uv:week uv:2024-01-14 uv:2024-01-15 uv:2024-01-16
PFCOUNT uv:week

# Unique search terms
PFADD search:terms "redis" "database" "cache"
PFCOUNT search:terms
```

---

## Count-Min Sketch

Estimates frequency of events. Overestimates but never underestimates.

```bash
# Create with error rate and probability
CMS.INITBYPROB mycms 0.01 0.001   # 1% error, 0.1% probability

# Or create with dimensions
CMS.INITBYDIM mycms 2000 6   # width=2000, depth=6

# Increment counts
CMS.INCRBY mycms "item1" 1 "item2" 5 "item3" 3

# Query count
CMS.QUERY mycms "item1"
CMS.QUERY mycms "item2"

# Merge
CMS.MERGE merged 2 cms1 cms2 WEIGHTS 1 1

# Info
CMS.INFO mycms
```

### Use Cases

- Top-K items
- Heavy hitters detection
- Traffic analysis
- Frequency counting

---

## Top-K

Tracks the K most frequent items.

```bash
# Create with K
TOPK.RESERVE mytopk 10 50 4 0.9   # top 10, width=50, depth=4, decay=0.9

# Increment
TOPK.INCRBY mytopk "item1" 1 "item2" 5 "item3" 3 "item1" 2

# Get top K list
TOPK.LIST mytopk

# Query item rank and count
TOPK.QUERY mytopk "item1"

# Info
TOPK.INFO mytopk
```

### Use Cases

- Trending topics
- Most active users
- Popular products
- Leaderboards (approximate)

---

## t-Digest

Estimates quantiles (percentiles) of a data stream.

```bash
# Create with compression parameter
TDIGEST.CREATE mytd COMPRESSION 100

# Add values
TDIGEST.ADD mytd 1 2 3 4 5 6 7 8 9 10

# Get quantile
TDIGEST.QUANTILE mytd 0.5    # median
TDIGEST.QUANTILE mytd 0.95   # 95th percentile
TDIGEST.QUANTILE mytd 0.99   # 99th percentile

# Get value at rank
TDIGEST.BYRANK mytd 5        # value at rank 5

# Get rank of value
TDIGEST.RANK mytd 5

# Get min/max
TDIGEST.MIN mytd
TDIGEST.MAX mytd

# Info
TDIGEST.INFO mytd

# Merge
TDIGEST.MERGE merged 2 td1 td2
```

### Use Cases

- Latency percentiles (p50, p95, p99)
- Response time monitoring
- Resource usage analysis
- A/B testing metrics

---

## Comparison

| Structure | Memory | False Positives | Deletion | Use Case |
|-----------|--------|-----------------|----------|----------|
| Bloom Filter | Low | Yes | No | Membership test |
| Cuckoo Filter | Low | Yes | Yes | Membership with deletion |
| HyperLogLog | ~12KB | N/A (estimation) | No | Cardinality estimation |
| Count-Min Sketch | Medium | Overestimate | No | Frequency estimation |
| Top-K | Low | N/A | Yes (implicit) | Top K items |
| t-Digest | Low | N/A (estimation) | No | Quantile estimation |

---

## Python Examples

```python
# Bloom Filter
r.execute_command('BF.RESERVE', 'myfilter', 0.01, 100000)
r.execute_command('BF.ADD', 'myfilter', 'item1')
exists = r.execute_command('BF.EXISTS', 'myfilter', 'item1')

# HyperLogLog
r.pfadd('visitors', 'user:1', 'user:2', 'user:3')
count = r.pfcount('visitors')

# Top-K
r.execute_command('TOPK.RESERVE', 'mytopk', 10, 50, 4, 0.9)
r.execute_command('TOPK.INCRBY', 'mytopk', 'item1', 1)
top_items = r.execute_command('TOPK.LIST', 'mytopk')
```
