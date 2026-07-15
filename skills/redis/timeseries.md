# Redis Time Series

RedisTimeSeries provides time series data storage with downsampling, aggregation, and labeling.

---

## Creating Time Series

```bash
# Create a time series
TS.CREATE temperature:room1 RETENTION 86400000   # 24 hours in ms

# With labels
TS.CREATE temperature:room1 RETENTION 86400000 LABELS room "room1" sensor "temp" type "indoor"

# With duplicate policy
TS.CREATE temperature:room1 RETENTION 86400000 DUPLICATE_POLICY LAST
# Options: BLOCK, FIRST, LAST, MIN, MAX, SUM
```

---

## Adding Data

```bash
# Add with auto-timestamp (current time)
TS.ADD temperature:room1 * 22.5

# Add with specific timestamp
TS.ADD temperature:room1 1735689600000 22.5

# Add with retention override
TS.ADD temperature:room1 * 22.5 RETENTION 3600000

# Bulk add
TS.MADD temperature:room1 1735689600000 22.5 temperature:room1 1735689660000 22.7 temperature:room2 1735689600000 20.1
```

---

## Querying

### Range Query

```bash
# Get all data
TS.RANGE temperature:room1 - +

# Get with time range
TS.RANGE temperature:room1 1735689600000 1735693200000

# With aggregation
TS.RANGE temperature:room1 - + AGGREGATION avg 60000   # 1-min averages
TS.RANGE temperature:room1 - + AGGREGATION max 3600000  # 1-hour max
TS.RANGE temperature:room1 - + AGGREGATION sum 60000    # 1-min sums

# Aggregation types: avg, sum, min, max, range, count, first, last, std.p, std.s, var.p, var.s, twa
```

### Reverse Range

```bash
TS.REVRANGE temperature:room1 - + COUNT 10   # latest 10 entries
```

### Multi-Range (MRANGE)

```bash
# Query multiple series by filter
TS.MRANGE - + AGGREGATION avg 60000 FILTER room=(room1,room2)

# With labels
TS.MRANGE - + WITHLABELS AGGREGATION avg 60000 FILTER type=indoor

# Group by label
TS.MRANGE - + AGGREGATION avg 60000 FILTER type=indoor GROUPBY room REDUCE avg
```

### Latest Value

```bash
TS.GET temperature:room1
```

---

## Downsampling and Compaction

### Rules

```bash
# Create compaction rule (downsample to 1-minute averages)
TS.CREATERULE temperature:room1 temperature:room1:1min AGGREGATION avg 60000

# Create multiple rules
TS.CREATERULE temperature:room1 temperature:room1:5min AGGREGATION avg 300000
TS.CREATERULE temperature:room1 temperature:room1:1hour AGGREGATION max 3600000

# Delete rule
TS.DELETERULE temperature:room1 temperature:room1:1min
```

---

## Labels and Filtering

```bash
# Add labels to existing series
TS.ALTER temperature:room1 LABELS room "room1" floor "1"

# Query by label
TS.QUERYINDEX type=indoor
TS.QUERYINDEX room=(room1,room2)

# MRANGE with filters
TS.MRANGE - + FILTER type=indoor
TS.MRANGE - + FILTER type=indoor room=room1
```

---

## Info

```bash
TS.INFO temperature:room1
# Returns: totalSamples, memoryUsage, firstTimestamp, lastTimestamp, retentionTime, chunkSize, duplicatePolicy, labels, sourceKey, rules
```

---

## Deletion

```bash
# Delete data in range
TS.DEL temperature:room1 1735689600000 1735693200000

# Delete entire series
DEL temperature:room1
```

---

## Use Cases

### IoT Sensor Data

```bash
# Create series with labels
TS.CREATE sensor:temp:001 RETENTION 604800000 LABELS device "sensor:001" type "temperature" location "factory"

# Add readings
TS.ADD sensor:temp:001 * 22.5
TS.ADD sensor:temp:001 * 22.7

# Query last hour average
TS.RANGE sensor:temp:001 (1735686000000) + AGGREGATION avg 60000

# Downsample
TS.CREATERULE sensor:temp:001 sensor:temp:001:1h AGGREGATION avg 3600000
```

### Application Metrics

```bash
# Create metrics series
TS.CREATE metric:api:latency RETENTION 86400000 LABELS service "api" metric "latency"
TS.CREATE metric:api:requests RETENTION 86400000 LABELS service "api" metric "requests"

# Record metrics
TS.ADD metric:api:latency * 45.2
TS.ADD metric:api:requests * 1

# Get p95 latency (using aggregation)
TS.RANGE metric:api:latency - + AGGREGATION avg 60000
```

### Stock Prices

```bash
TS.CREATE stock:AAPL RETENTION 2592000000 LABELS symbol "AAPL" type "stock"
TS.ADD stock:AAPL * 150.25

# Daily high
TS.CREATERULE stock:AAPL stock:AAPL:daily AGGREGATION max 86400000
```

---

## Python Examples

```python
# Create
r.execute_command('TS.CREATE', 'temperature:room1', 'RETENTION', 86400000, 'LABELS', 'room', 'room1')

# Add
r.execute_command('TS.ADD', 'temperature:room1', '*', 22.5)

# Range
results = r.execute_command('TS.RANGE', 'temperature:room1', '-', '+', 'AGGREGATION', 'avg', 60000)
```

---

## Performance

| Operation | Complexity |
|-----------|------------|
| `TS.ADD` | O(1) |
| `TS.RANGE` | O(N) where N is number of samples |
| `TS.MRANGE` | O(N * K) where K is number of series |
| `TS.GET` | O(1) |
| `TS.QUERYINDEX` | O(N) where N is number of series |

## Limits

- Timestamp: 64-bit integer (milliseconds)
- Maximum labels per series: 128
- Maximum series: limited by memory
- Chunk size: configurable (default 4096 bytes)
