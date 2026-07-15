# Redis Pub/Sub

Redis Pub/Sub is a messaging pattern where publishers send messages to channels without knowing subscribers. Messages are delivered at-most-once (fire and forget).

---

## Delivery Semantics

- **At-most-once**: Messages are not persisted. If a subscriber is disconnected, messages are lost.
- **No relation to keyspace**: Pub/Sub operates independently of the database.
- **No scoping by database**: Publishing on db 10 is heard by subscribers on db 1.

For stronger delivery guarantees, use **Redis Streams** (persisted, consumer groups, at-least-once).

---

## Basic Pub/Sub

### Subscribe

```bash
# Subscribe to channels
SUBSCRIBE news alerts

# Pattern subscription (glob-style)
PSUBSCRIBE news.*
PSUBSCRIBE user.*.login
```

### Publish

```bash
# Publish to a channel
PUBLISH news "Breaking: Redis 8 released"
# Returns: number of subscribers received the message

# Publish to pattern-matched channel
PUBLISH news.tech "New Redis feature"
```

### Unsubscribe

```bash
UNSUBSCRIBE news
UNSUBSCRIBE              # unsubscribe from all channels

PUNSUBSCRIBE news.*
PUNSUBSCRIBE             # unsubscribe from all patterns
```

---

## Message Format

Messages are arrays with three elements:

```
# Subscription confirmation
*3
$9
subscribe
$5
news
:1

# Message received
*3
$7
message
$5
news
$24
Breaking: Redis 8 released

# Pattern message
*4
$8
pmessage
$7
news.*
$10
news.tech
$18
New Redis feature
```

---

## Sharded Pub/Sub

Sharded Pub/Sub (Redis 7.0+) routes messages to specific shard channels, enabling scaling in cluster mode.

```bash
# Subscribe to shard channel
SSUBSCRIBE channel1

# Publish to shard channel
SPUBLISH channel1 "Hello"

# Unsubscribe
SUNSUBSCRIBE channel1
```

Unlike regular Pub/Sub, shard channels are mapped to specific slots, so messages stay within the shard. This is more efficient in cluster mode.

---

## Pub/Sub with Client Libraries

### Python (redis-py)

```python
import redis

r = redis.Redis(host='localhost', port=6379, decode_responses=True)

# Publisher
r.publish('news', 'Hello World')

# Subscriber
pubsub = r.pubsub()
pubsub.subscribe('news')

for message in pubsub.listen():
    if message['type'] == 'message':
        print(message['data'])

# Pattern subscription
pubsub.psubscribe('news.*')

# Subscribe and call callback
def handler(message):
    print(message['data'])

pubsub.subscribe(**{'news': handler})
pubsub.run_in_thread(sleep_time=0.001)
```

### JavaScript (node-redis)

```js
import { createClient } from 'redis';

// Subscriber
const subscriber = createClient();
await subscriber.connect();

await subscriber.subscribe('news', (message) => {
  console.log('Received:', message);
});

// Publisher
const publisher = createClient();
await publisher.connect();
await publisher.publish('news', 'Hello World');
```

---

## Keyspace Notifications

Keyspace notifications allow clients to subscribe to events about key changes (expiry, deletion, modification, etc.).

### Configuration

```bash
# Enable keyspace notifications
CONFIG SET notify-keyspace-events KEA

# Or specific events
CONFIG SET notify-keyspace-events Ex   # expired events only
```

### Event Classes

| Character | Event Type |
|-----------|-----------|
| `K` | Keyspace events (`__keyspace@<db>__`) |
| `E` | Keyevent events (`__keyevent@<db>__`) |
| `g` | Generic commands (`DEL`, `EXPIRE`, `RENAME`, ...) |
| `$` | String commands |
| `l` | List commands |
| `s` | Set commands |
| `h` | Hash commands |
| `z` | Sorted set commands |
| `x` | Expired events |
| `e` | Evicted events |
| `t` | Stream commands |
| `d` | Module keyspace events |
| `m` | Key-miss events |
| `n` | New key events |
| `A` | Alias for `g$lshzxd` (all events except `m` and `n`) |

### Subscribing to Keyspace Notifications

```bash
# Subscribe to all events for a specific key
SUBSCRIBE __keyspace@0__:mykey

# Subscribe to all events for a specific command
SUBSCRIBE __keyevent@0__:del

# Subscribe to all keyspace events (pattern)
PSUBSCRIBE __keyspace@0__:*
PSUBSCRIBE __keyevent@0__:expired
```

### Event Examples

```bash
# When key expires
SET mykey "value" EX 1
# After 1 second, notification:
# __keyspace@0__:mykey -> "expired"
# __keyevent@0__:expired -> "mykey"

# When key is deleted
DEL mykey
# __keyspace@0__:mykey -> "del"
# __keyevent@0__:del -> "mykey"
```

### Keyspace Notifications with Python

```python
r = redis.Redis(decode_responses=True)
r.config_set('notify-keyspace-events', 'Ex')

pubsub = r.pubsub()
pubsub.psubscribe('__keyevent@0__:expired')

for message in pubsub.listen():
    if message['type'] == 'pmessage':
        print(f"Key expired: {message['data']}")
```

---

## Pattern Matching

```bash
# Match any channel starting with "user"
PSUBSCRIBE user.*

# Match login events for any user
PSUBSCRIBE user.*.login

# Match all channels
PSUBSCRIBE *

# Wildcards
PSUBSCRIBE h?llo        # matches hello, hallo, hxllo
PSUBSCRIBE h*llo        # matches hhxxllo, hello
PSUBSCRIBE h[ae]llo     # matches hello, hallo
```

---

## Use Cases

### Real-time Notifications

```bash
# Server publishes
PUBLISH user:1000:notifications "New message from Alice"

# Client subscribes
SUBSCRIBE user:1000:notifications
```

### Chat Rooms

```bash
# Join room
SUBSCRIBE room:general

# Send message
PUBLISH room:general "Hello everyone!"
```

### Cache Invalidation

```bash
# On cache update, notify
PUBLISH cache:invalidate "user:1000"

# Subscribers clear their local cache
SUBSCRIBE cache:invalidate
```

### Event-Driven Architecture

```bash
# Service publishes events
PUBLISH events:order "order:1001:created"
PUBLISH events:payment "payment:1001:completed"

# Multiple services subscribe
PSUBSCRIBE events:*
```

---

## Limitations

- Messages are **not persisted** — missed messages are lost
- No **consumer groups** — all subscribers receive all messages
- No **backpressure** — slow subscribers may be disconnected
- Pattern matching can be **CPU-intensive** with many patterns
- In cluster mode, use **Sharded Pub/Sub** for better scaling
