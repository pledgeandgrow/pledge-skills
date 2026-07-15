# Redis Sets and Sorted Sets

Sets store unique unordered strings. Sorted Sets add a score for ordering.

---

## Sets

### Basic Operations

```bash
# Add members
SADD myset "member1" "member2" "member3"

# Remove members
SREM myset "member3"

# Check membership
SISMEMBER myset "member1"     # 1
SMISMEMBER myset "m1" "m2"    # 1 0

# Get all members
SMEMBERS myset

# Get count
SCARD myset

# Get random member
SRANDMEMBER myset
SRANDMEMBER myset 3     # 3 random (may have duplicates)
SRANDMEMBER myset -3    # 3 random (with duplicates allowed)

# Pop random member
SPOP myset
SPOP myset 2            # pop 2 random members
```

### Set Operations

```bash
# Intersection
SINTER set1 set2
SINTERCARD 2 set1 set2        # just the count
SINTERSTORE result set1 set2  # store in new key

# Union
SUNION set1 set2
SUNIONSTORE result set1 set2

# Difference
SDIFF set1 set2               # members in set1 but not set2
SDIFFSTORE result set1 set2

# Move member between sets
SMOVE source dest "member1"
```

### Iteration

```bash
SSCAN myset 0
SSCAN myset 0 MATCH "mem*"
SSCAN myset 0 COUNT 10
```

### Use Cases

```bash
# Tags
SADD article:1000:tags "redis" "database" "nosql"
SADD tag:redis article:1000 article:1001
SINTER tag:redis tag:database    # articles with both tags

# Unique visitors
SADD visitors:2024-01-15 "user:1" "user:2" "user:3"
SCARD visitors:2024-01-15        # unique count

# Friends / relationships
SADD user:1:friends "user:2" "user:3" "user:4"
SADD user:2:friends "user:1" "user:3"
SINTER user:1:friends user:2:friends   # mutual friends
SDIFF user:1:friends user:2:friends     # friends of user:1 not friends of user:2
```

---

## Sorted Sets

Sorted Sets (ZSETs) store unique members with an associated score. Members are ordered by score.

### Basic Operations

```bash
# Add members with scores
ZADD leaderboard 100 "Alice" 200 "Bob" 150 "Charlie"

# Add with conditions
ZADD leaderboard NX 300 "Alice"       # only if new member
ZADD leaderboard XX 250 "Alice"       # only if exists
ZADD leaderboard GT 300 "Alice"       # only update if new score is greater
ZADD leaderboard LT 50 "Alice"        # only update if new score is less
ZADD leaderboard CH 100 "Dave"        # return changed elements count

# Get score
ZSCORE leaderboard "Alice"            # "100"

# Get rank (0-based ascending)
ZRANK leaderboard "Bob"               # 2
ZREVRANK leaderboard "Bob"            # 0 (rank in descending)

# Get count
ZCARD leaderboard

# Count members in score range
ZCOUNT leaderboard 100 200
```

### Range Queries

```bash
# By rank (ascending)
ZRANGE leaderboard 0 -1                    # all members
ZRANGE leaderboard 0 -1 WITHSCORES         # all with scores
ZRANGE leaderboard 0 2 WITHSCORES          # top 3 by ascending score

# By rank (descending)
ZREVRANGE leaderboard 0 -1 WITHSCORES      # all, highest first
ZREVRANGE leaderboard 0 2 WITHSCORES       # top 3

# By score range
ZRANGEBYSCORE leaderboard 100 200
ZRANGEBYSCORE leaderboard 100 200 WITHSCORES
ZRANGEBYSCORE leaderboard 100 200 LIMIT 0 10

# By score (modern syntax, Redis 6.2+)
ZRANGE leaderboard 100 200 BYSCORE WITHSCORES
ZRANGE leaderboard 200 100 BYSCORE REV

# By lexicographical order (when scores are equal)
ZRANGE leaderboard 0 -1 BYLEX
ZRANGE leaderboard "[A" "[M" BYLEX        # members from A to M
ZRANGE leaderboard "[N" "+" BYLEX         # members from N to end
```

### Update Scores

```bash
# Increment score
ZINCRBY leaderboard 50 "Alice"    # Alice's score becomes 150

# Bulk increment
ZMSCORE leaderboard "Alice" "Bob"  # get multiple scores
```

### Remove Operations

```bash
# Remove member
ZREM leaderboard "Charlie"

# Remove by rank
ZREMRANGEBYRANK leaderboard 0 2    # remove lowest 3

# Remove by score range
ZREMRANGEBYSCORE leaderboard 0 100  # remove scores 0-100
```

### Pop Operations

```bash
# Pop lowest scoring member
ZPOPMIN leaderboard
ZPOPMIN leaderboard 3          # pop 3 lowest

# Pop highest scoring member
ZPOPMAX leaderboard

# Blocking pop (timeout in seconds)
BZPOPMIN leaderboard 0
BZPOPMAX leaderboard 5

# Blocking multi-pop (Redis 7+)
BZMPOP 0 1 leaderboard MAX COUNT 1
```

### Set Operations

```bash
# Intersection
ZINTER 2 set1 set2                    # members in both (aggregated scores)
ZINTER 2 set1 set2 WITHSCORES
ZINTERSTORE result 2 set1 set2        # store intersection
ZINTER 2 set1 set2 AGGREGATE MAX      # use max score instead of sum
ZINTER 2 set1 set2 WEIGHTS 2 1        # multiply scores by weights

# Union
ZUNION 2 set1 set2 WITHSCORES
ZUNIONSTORE result 2 set1 set2

# Difference
ZDIFF 2 set1 set2
ZDIFFSTORE result 2 set1 set2

# Cardinality of intersection
ZINTERCARD 2 set1 set2
ZINTERCARD 2 set1 set2 LIMIT 100      # stop after 100 matches
```

### Random

```bash
# Get random member
ZRANDMEMBER leaderboard
ZRANDMEMBER leaderboard 3 WITHSCORES
```

### Iteration

```bash
ZSCAN leaderboard 0
ZSCAN leaderboard 0 MATCH "A*"
```

---

## Use Cases

### Leaderboard

```bash
# Add/update player scores
ZADD scores 1000 "player:1" 950 "player:2" 1100 "player:3"

# Get top 10
ZREVRANGE scores 0 9 WITHSCORES

# Get player's rank
ZREVRANK scores "player:1"

# Increment score
ZINCRBY scores 50 "player:2"
```

### Priority Queue

```bash
# Add tasks with priority (lower score = higher priority)
ZADD tasks 1 "urgent:task" 5 "normal:task" 10 "low:task"

# Get highest priority task
ZPOPMIN tasks
```

### Rate Limiter (sliding window)

```bash
# Add request timestamp as member (unique)
ZADD rate:user:1000 1735689600 "req:1735689600"

# Remove old entries
ZREMRANGEBYSCORE rate:user:1000 0 1735689600-60

# Count requests in window
ZCARD rate:user:1000
```

### Time-based ordering

```bash
# Use timestamp as score
ZADD events 1735689600 "event:1" 1735689700 "event:2"
ZRANGE events 0 -1 WITHSCORES   # chronological order
```

---

## Performance

| Operation | Complexity |
|-----------|------------|
| `SADD`, `SREM`, `SISMEMBER` | O(1) |
| `SMEMBERS` | O(N) |
| `SINTER`, `SUNION`, `SDIFF` | O(N*M) where M is set count |
| `ZADD`, `ZSCORE`, `ZRANK` | O(log N) |
| `ZRANGE` | O(log N + S) where S is range size |
| `ZREMRANGEBYRANK` | O(log N + S) |
| `ZINTERSTORE`, `ZUNIONSTORE` | O(N*K + M*log M) |

## Limits

- Sets: 2^32 - 1 members
- Sorted Sets: 2^32 - 1 members
- intset encoding: up to 512 integer-only members
- listpack encoding (sorted sets): up to 128 members
- skiplist encoding: O(log N) operations
