# Redis Streams

Streams are an append-only log data structure with consumer group support. Ideal for event sourcing, messaging, and audit logs.

---

## Basic Operations

### Adding Entries

```bash
# Auto-generate ID (timestamp-order)
XADD events * type "click" user "abc" url "/home"
# Returns: 1735689600000-0

# Specify ID (must be greater than last)
XADD events 1735689600000-0 type "click" user "abc"

# Max length (trim while adding)
XADD events MAXLEN 1000 * type "click" user "abc"
XADD events MAXLEN ~ 1000 * type "click" user "abc"   # approximate trim

# Trim with min-id
XADD events MINID 1735680000000 * type "click"
```

### Reading Entries

```bash
# Read from specific ID
XREAD COUNT 10 STREAMS events 0

# Read new entries only (block for new)
XREAD BLOCK 0 STREAMS events $

# Read from multiple streams
XREAD COUNT 5 STREAMS events1 events2 0 0

# Read with blocking timeout (ms)
XREAD BLOCK 5000 STREAMS events $
```

### Getting Stream Info

```bash
# Stream length
XLEN events

# Get range
XRANGE events - +              # all entries
XRANGE events 1735689600000-0 + COUNT 10
XRANGE events - 1735689700000-0

# Reverse range
XREVRANGE events + - COUNT 5   # latest 5 entries

# Stream info
XINFO STREAM events
XINFO STREAM events FULL       # detailed info
```

---

## Consumer Groups

Consumer groups allow multiple consumers to process different entries from the same stream.

### Creating Consumer Groups

```bash
# Create group starting from beginning
XGROUP CREATE events group1 0

# Create group starting from latest
XGROUP CREATE events group1 $

# Create group starting from specific ID
XGROUP CREATE events group1 1735689600000-0

# Create with MKSTREAM (create stream if not exists)
XGROUP CREATE newstream group1 0 MKSTREAM
```

### Reading as a Consumer

```bash
# Read for consumer in group
XREADGROUP GROUP group1 consumer1 COUNT 10 STREAMS events >

# Read with blocking
XREADGROUP GROUP group1 consumer1 BLOCK 0 STREAMS events >

# Read specific entries (not new)
XREADGROUP GROUP group1 consumer1 STREAMS events 0
```

The `>` special ID means "messages never delivered to this group".
Using `0` means "read pending messages for this consumer".

### Acknowledging

```bash
# Acknowledge processed entry
XACK events group1 1735689600000-0

# Acknowledge multiple
XACK events group1 1735689600000-0 1735689600001-0
```

### Pending Entries (PEL)

```bash
# List pending entries for group
XPENDING events group1

# Detailed pending
XPENDING events group1 - + 10

# Pending for specific consumer
XPENDING events group1 - + 10 consumer1
```

### Claiming Entries

```bash
# Claim pending entries (for crashed consumer recovery)
XCLAIM events group1 consumer2 5000 1735689600000-0

# Auto-claim (claim entries idle longer than min-idle-time)
XAUTOCLAIM events group1 consumer2 5000 0

# Claim with options
XCLAIM events group1 consumer2 5000 1735689600000-0 RETRYCOUNT 3 FORCE
```

### Consumer Management

```bash
# List consumers in group
XINFO CONSUMERS events group1

# List all groups
XINFO GROUPS events

# Create consumer explicitly
XGROUP CREATECONSUMER events group1 consumer3

# Delete consumer
XGROUP DELCONSUMER events group1 consumer3

# Destroy group
XGROUP DESTROY events group1

# Set group's last-delivered ID
XGROUP SETID events group1 $
```

---

## Trimming

```bash
# Trim to max length
XTRIM events MAXLEN 1000
XTRIM events MAXLEN ~ 1000    # approximate

# Trim by min ID
XTRIM events MINID 1735680000000-0
XTRIM events MINID ~ 1735680000000-0

# Trim with limit
XTRIM events MAXLEN 1000 LIMIT 100
```

---

## Deleting Entries

```bash
# Delete specific entry
XDEL events 1735689600000-0

# Delete multiple
XDEL events 1735689600000-0 1735689600001-0
```

---

## Stream Configuration

```bash
# Set configuration
XCFGSET events MAXLEN 10000

# Set retention
XCFGSET events RETENTION 86400000   # 24 hours in ms
```

---

## Use Cases

### Event Sourcing

```bash
# Append events
XADD orders * event "created" orderId "1001" amount 50.00
XADD orders * event "paid" orderId "1001"
XADD orders * event "shipped" orderId "1001"

# Replay events
XRANGE orders - +
```

### Message Queue with Consumer Groups

```bash
# Producer
XADD tasks * type "email" to "user@example.com"

# Consumer group
XGROUP CREATE tasks workers 0 MKSTREAM

# Worker 1
XREADGROUP GROUP workers worker1 COUNT 10 BLOCK 0 STREAMS tasks >
# process...
XACK tasks workers 1735689600000-0

# Worker 2
XREADGROUP GROUP workers worker2 COUNT 10 BLOCK 0 STREAMS tasks >
```

### Activity Log

```bash
XADD activity:1000 * action "login" ip "10.0.0.1"
XADD activity:1000 * action "view" page "/products"
XADD activity:1000 * action "purchase" item "sku:500"

# Get recent activity
XREVRANGE activity:1000 + - COUNT 20
```

### Sensor Data

```bash
XADD sensor:temp * temp 22.5 humidity 45
XADD sensor:temp * temp 23.0 humidity 44

# Read latest
XREVRANGE sensor:temp + - COUNT 1
```

---

## Delivery Semantics

| Pattern | Semantics | How |
|---------|-----------|-----|
| At-most-once | Fire and forget | `XREAD` without groups |
| At-least-once | Ack-based | `XREADGROUP` + `XACK` |
| Exactly-once | Requires idempotent consumers | `XREADGROUP` + dedup logic |

---

## Performance

| Operation | Complexity |
|-----------|------------|
| `XADD` | O(1) (O(N) with trimming) |
| `XREAD` | O(N) where N is count |
| `XRANGE` | O(N) where N is range size |
| `XLEN` | O(1) |
| `XACK` | O(1) per entry |
| `XPENDING` | O(1) for summary, O(N) for detailed |
| `XCLAIM` | O(1) per entry |

## Limits

- Maximum stream length: unlimited (practical limit is memory)
- Entry ID: `<milliseconds>-<sequence>` format
- Fields per entry: no hard limit
- Consumer groups per stream: no hard limit
