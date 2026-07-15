# Redis Scripting and Programmability

Redis supports server-side scripting via Lua 5.1 and Redis Functions (v7.0+). Scripts enable data locality, reduce network traffic, and provide atomic execution.

---

## Overview

Redis provides two scripting mechanisms:

| Feature | EVAL Scripts | Redis Functions |
|---------|-------------|-----------------|
| Since | Redis 2.6 | Redis 7.0 |
| Storage | Ephemeral (cached only) | Persistent (AOF + replicated) |
| Management | Application-side | Database-side (administrative) |
| Naming | SHA1 hash | User-defined names |
| Libraries | No | Yes (multiple functions per library) |

Both execute **atomically** — the server blocks all other commands during execution.

---

## EVAL Scripts

### Basic Usage

```bash
# Simple script (no keys, no args)
EVAL "return 'Hello, scripting!'" 0

# With key arguments
EVAL "return redis.call('SET', KEYS[1], ARGV[1])" 1 mykey "myvalue"

# With multiple keys and args
EVAL "return { KEYS[1], KEYS[2], ARGV[1], ARGV[2] }" 2 key1 key2 arg1 arg2
# 1) "key1"  2) "key2"  3) "arg1"  4) "arg2"
```

### Parameterization

- `KEYS[n]` — key name arguments (must declare count as 2nd param to EVAL)
- `ARGV[n]` — regular arguments

```bash
# numkeys=1, so KEYS[1]=mykey, ARGV[1]=counter
EVAL "local current = redis.call('GET', KEYS[1]) or 0; current = current + ARGV[1]; redis.call('SET', KEYS[1], current); return current" 1 mykey 5
```

### Calling Redis Commands from Lua

```lua
-- redis.call() — returns error to client on failure
local val = redis.call('GET', KEYS[1])

-- redis.pcall() — returns error to script for handling
local ok, err = pcall(redis.call, 'GET', KEYS[1])
```

```bash
# Example: atomic compare-and-set
EVAL "if redis.call('GET', KEYS[1]) == ARGV[1] then return redis.call('SET', KEYS[1], ARGV[2]) else return 0 end" 1 mykey oldval newval
```

### Script Cache and EVALSHA

```bash
# Load script into cache (returns SHA1)
SCRIPT LOAD "return redis.call('GET', KEYS[1])"
# "c664a3bf70bd1d45c4284ffebb65a6f2299bfc9f"

# Execute cached script by SHA1
EVALSHA c664a3bf70bd1d45c4284ffebb65a6f2299bfc9f 1 mykey

# Check if script exists in cache
SCRIPT EXISTS c664a3bf70bd1d45c4284ffebb65a6f2299bfc9f

# Flush cache
SCRIPT FLUSH

# Kill running script
SCRIPT KILL
```

### EVAL Flags (Redis 7.0+)

```bash
# Read-only script (can't write)
EVAL_RO "return redis.call('GET', KEYS[1])" 1 mykey

# Specify flags via shebang
EVAL "#!lua flags=allow-omit\nreturn 1" 0
```

Available flags:
- `allow-omit` — script can be omitted from replication
- `no-writes` — read-only script
- `allow-stale` — can run on stale replica
- `no-cluster` — disallow in cluster mode

---

## Redis Functions

Functions are persistent, named, and replicated — first-class database objects.

### Loading a Library

```bash
# Load a simple library
FUNCTION LOAD "#!lua name=mylib
redis.register_function('knockknock', function()
  return 'Who\\'s there?'
end)"

# Call the function
FCALL knockknock 0
# "Who's there?"
```

### Functions with Keys and Arguments

```bash
FUNCTION LOAD "#!lua name=mylib
redis.register_function('set_value', function(keys, args)
  redis.call('SET', keys[1], args[1])
  return 'OK'
end)"

# FCALL function_name numkeys key [key ...] arg [arg ...]
FCALL set_value 1 mykey "hello"
```

### Multiple Functions in a Library

```bash
FUNCTION LOAD "#!lua name=counter
redis.register_function('increment', function(keys, args)
  local current = redis.call('GET', keys[1]) or 0
  current = current + args[1]
  redis.call('SET', keys[1], current)
  return current
end)

redis.register_function('reset', function(keys, args)
  redis.call('DEL', keys[1])
  return 'OK'
end)"

FCALL increment 1 counter 5    # 5
FCALL increment 1 counter 3    # 8
FCALL reset 1 counter           # OK
```

### Code Reuse Within a Library

```bash
FUNCTION LOAD "#!lua name=mathlib
local function add(a, b)
  return a + b
end

redis.register_function('add_values', function(keys, args)
  return add(tonumber(args[1]), tonumber(args[2]))
end)

redis.register_function('double', function(keys, args)
  return add(tonumber(args[1]), tonumber(args[1]))
end)"

FCALL add_values 0 3 7    # 10
FCALL double 0 5           # 10
```

### Function Management Commands

```bash
# List all libraries
FUNCTION LIST

# List with code
FUNCTION LIST WITHCODE

# Get function info
FUNCTION DUMP

# Delete a library
FUNCTION DELETE mylib

# Flush all functions
FUNCTION FLUSH

# Restore functions from dump
FUNCTION RESTORE <dump-data>

# Stats
FUNCTION STATS
```

### Function Flags

```bash
FUNCTION LOAD "#!lua name=readonly_lib
redis.register_function{function_name='safe_get', callback=function(keys, args)
  return redis.call('GET', keys[1])
end, flags={'no-writes'}}"
```

Available flags:
- `no-writes` — read-only function
- `allow-omit` — can be omitted from replication
- `allow-stale` — can run on stale replica
- `no-cluster` — disallow in cluster mode

---

## Lua API Reference

### Global Variables

| Variable | Description |
|----------|-------------|
| `KEYS[n]` | Key name arguments (1-indexed) |
| `ARGV[n]` | Regular arguments (1-indexed) |
| `redis` | Redis API object |

### redis.call() vs redis.pcall()

```lua
-- redis.call() — raises error, returns to client
local val = redis.call('GET', KEYS[1])

-- redis.pcall() — catches error, returns error object
local result = redis.pcall('GET', KEYS[1])
if result['err'] then
  -- handle error
end
```

### Status Reply

```lua
local ok = redis.call('SET', KEYS[1], 'val')
-- ok = {ok = 'OK'}
```

### Error Reply

```lua
local err = redis.pcall('INCR', KEYS[1])
-- if KEYS[1] holds a non-integer:
-- err = {err = 'ERR value is not an integer or out of range'}
```

### Type Conversion

| Lua Type | Redis Type |
|----------|-----------|
| `true` | 1 (integer) |
| `false` | nil |
| `number` | integer reply |
| `string` | bulk string |
| `table` | array reply |
| `nil` | nil reply |

---

## Debugging

```bash
# Start Lua debugger
TFCALL myfunc 0  # Use TFCALL for trace mode (debug)

# Or use ldb (Lua debugger)
redis-cli --ldb --eval myscript.lua 1 mykey , arg1 arg2
```

---

## Use Cases

### Atomic Compare-and-Set (CAS)

```bash
EVAL "if redis.call('GET', KEYS[1]) == ARGV[1] then redis.call('SET', KEYS[1], ARGV[2]); return 1 else return 0 end" 1 mykey oldval newval
```

### Rate Limiter (Sliding Window)

```lua
-- rate_limiter.lua
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

-- Remove old entries
redis.call('ZREMRANGEBYSCORE', key, 0, now - window)

-- Count current entries
local count = redis.call('ZCARD', key)

if count < limit then
  redis.call('ZADD', key, now, now)
  redis.call('EXPIRE', key, window)
  return 1
else
  return 0
end
```

```bash
SCRIPT LOAD "$(cat rate_limiter.lua)"
EVALSHA <sha> 1 rate:user:1000 100 60 1735689600
```

### Atomic Decrement with Floor

```bash
EVAL "local val = redis.call('GET', KEYS[1]) or 0; if tonumber(val) <= 0 then return 0 end; return redis.call('DECR', KEYS[1])" 1 counter
```

### Distributed Lock Release

```bash
EVAL "if redis.call('GET', KEYS[1]) == ARGV[1] then return redis.call('DEL', KEYS[1]) else return 0 end" 1 lock:resource1 mytoken
```

---

## Performance Considerations

- Scripts execute **atomically** — all other clients are blocked during execution
- Keep scripts **short and fast** to avoid latency
- Scripts are **cached** by SHA1 — avoid generating unique scripts dynamically
- Use `EVALSHA` instead of `EVAL` for repeated execution (saves bandwidth)
- Functions are **persisted and replicated** — survive restarts
- Use `no-writes` flag for read-only scripts (allows execution on replicas)

---

## Client Library Examples

### Python

```python
# Register script
script = r.register_script("""
if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('DEL', KEYS[1])
else
  return 0
end
""")
result = script(keys=['lock:resource1'], args=['mytoken'])

# Functions
r.execute_command('FUNCTION LOAD', '#!lua name=mylib\nredis.register_function("myfunc", function(keys, args) return "hello" end)')
r.execute_command('FCALL', 'myfunc', 0)
```

### JavaScript (node-redis)

```js
// EVAL
const result = await client.eval(
  "return redis.call('SET', KEYS[1], ARGV[1])",
  { keys: ['mykey'], arguments: ['myvalue'] }
);

// EVALSHA
const sha = await client.scriptLoad("return redis.call('GET', KEYS[1])");
const result = await client.evalSha(sha, { keys: ['mykey'] });
```
