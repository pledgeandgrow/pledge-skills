# Redis Hashes

Hashes are field-value pairs, like dictionaries or maps. Ideal for representing objects.

---

## Basic Operations

```bash
# Set single field
HSET user:1 name "Alice"

# Set multiple fields
HSET user:1 name "Alice" age 30 email "alice@example.com"

# Get single field
HGET user:1 name           # "Alice"

# Get multiple fields
HMGET user:1 name age email

# Get all fields and values
HGETALL user:1
# 1) "name"  2) "Alice"  3) "age"  4) "30"  5) "email"  6) "alice@example.com"

# Get all fields
HKEYS user:1

# Get all values
HVALS user:1

# Get number of fields
HLEN user:1

# Delete fields
HDEL user:1 email
```

---

## Conditional Operations

```bash
# Set only if field doesn't exist
HSETNX user:1 status "active"   # sets only if 'status' doesn't exist

# Set only if field exists (Redis 7.4+)
HSET user:1 name "Bob" XX
```

---

## Numeric Operations

```bash
# Increment integer field
HINCRBY user:1 age 1
HINCRBY user:1 login_count 5

# Increment float field
HINCRBYFLOAT user:1 score 1.5
```

---

## Field Existence

```bash
# Check if field exists
HEXISTS user:1 name        # 1
HEXISTS user:1 phone       # 0

# Get field length (string)
HSTRLEN user:1 name        # 5 (length of "Alice")
```

---

## Iteration

```bash
# Scan hash fields with cursor
HSCAN user:1 0
HSCAN user:1 0 MATCH "na*"
HSCAN user:1 0 COUNT 10
```

---

## Field Expiration

Redis 7.4+ supports per-field TTL:

```bash
# Expire specific field after 3600 seconds
HEXPIRE user:1 3600 FIELDS 1 session_token

# Expire in milliseconds
HPEXPIRE user:1 60000 FIELDS 1 session_token

# Expire at Unix timestamp
HEXPIREAT user:1 1735689600 FIELDS 1 session_token
HPEXPIREAT user:1 1735689600000 FIELDS 1 session_token

# Get field TTL
HTTL user:1 FIELDS 1 session_token
HPTTL user:1 FIELDS 1 session_token

# Get field expiration time
HEXPIRETIME user:1 FIELDS 1 session_token
HPEXPIRETIME user:1 FIELDS 1 session_token

# Remove expiration from field
HPERSIST user:1 FIELDS 1 session_token
```

### Field Expiration Use Cases

- Session tokens that expire per-user
- Temporary verification codes
- Time-limited feature flags per object
- Cache fields with different TTLs

---

## Bulk Operations

```bash
# Get and delete fields
HGETDEL user:1 FIELDS 2 name email

# Get and expire fields
HGETEX user:1 EX 3600 FIELDS 1 session_token

# Set with expiration
HSETEX user:1 EX 3600 FIELDS 1 temp_code "12345"
```

---

## Random Field

```bash
# Get random field
HRANDFIELD user:1

# Get random field with value
HRANDFIELD user:1 1 WITHVALUES

# Get multiple random fields
HRANDFIELD user:1 3
HRANDFIELD user:1 -3   # allow duplicates
```

---

## Use Cases

### User Profile

```bash
HSET user:1000 name "Alice" email "alice@example.com" age 30 role "admin"
HGET user:1000 email
HINCRBY user:1000 login_count 1
```

### Shopping Cart

```bash
HSET cart:user:1000 item:501 2 item:502 1
HINCRBY cart:user:1000 item:501 1   # add one more
HGETALL cart:user:1000
HDEL cart:user:1000 item:502
```

### Object Cache

```bash
# Cache API response as hash
HSET cache:api:users:1000 data '{"name":"Alice"}' cached_at 1735689600
HEXPIRE cache:api:users:1000 300 FIELDS 1 data  # 5 min TTL
```

---

## Performance

- `HSET`, `HGET`, `HDEL`, `HEXISTS` — O(1) per field
- `HGETALL`, `HKEYS`, `HVALS` — O(N) where N is number of fields
- `HSCAN` — O(1) per call, O(N) total for full iteration
- listpack encoding: up to 128 fields, 64 bytes per entry (configurable via `hash-max-listpack-entries`, `hash-max-listpack-value`)
- hashtable encoding: O(1) average case for all operations

---

## Limits

- Maximum fields per hash: 2^32 - 1
- Field name + value: each up to 512MB
- Memory efficiency: listpack encoding uses ~10x less memory than hashtable for small hashes
