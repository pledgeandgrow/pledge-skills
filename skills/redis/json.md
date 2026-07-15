# Redis JSON

RedisJSON provides native JSON document storage and querying. Built into Redis 8+ (formerly a Redis Stack module).

---

## Basic Operations

```bash
# Set JSON document at root
JSON.SET doc:1 $ '{"name":"Alice","age":30,"email":"alice@example.com"}'

# Set at specific path
JSON.SET doc:1 $.age 31
JSON.SET doc:1 $.city "Paris"

# Get entire document
JSON.GET doc:1 $

# Get specific path
JSON.GET doc:1 $.name
JSON.GET doc:1 $.age
JSON.GET doc:1 $.name $.age

# Get with formatting
JSON.GET doc:1 INDENT "  " SPACE " " NEWLINE "\n" $
```

---

## Data Types

```bash
# Object
JSON.SET doc:1 $.address '{"city":"Paris","zip":"75001"}'

# Array
JSON.SET doc:1 $.tags '["redis","database","nosql"]'

# Nested array
JSON.SET doc:1 $.scores '[100,200,150]'

# Null
JSON.SET doc:1 $.deleted null

# Boolean
JSON.SET doc:1 $.active true

# Number
JSON.SET doc:1 $.rating 4.5
```

---

## Array Operations

```bash
# Append to array
JSON.ARRAPPEND doc:1 $.tags '"json"'

# Get array length
JSON.ARRLEN doc:1 $.tags

# Get array element by index
JSON.ARRINDEX doc:1 $.tags '"redis"'   # find index of "redis"

# Insert at index
JSON.ARRINSERT doc:1 $.tags 0 '"new-tag"'

# Pop from array
JSON.ARRPOP doc:1 $.tags -1   # pop last element

# Trim array
JSON.ARRTRIM doc:1 $.tags 0 2   # keep first 3

# Get range
JSON.GET doc:1 $.tags[0:2]
```

---

## Object Operations

```bash
# Get object keys
JSON.OBJKEYS doc:1 $.address

# Get object length (key count)
JSON.OBJLEN doc:1 $.address
```

---

## Numeric Operations

```bash
# Increment number
JSON.NUMINCRBY doc:1 $.age 1
JSON.NUMINCRBY doc:1 $.rating 0.5

# Multiply
JSON.NUMMULTBY doc:1 $.score 2
```

---

## String Operations

```bash
# Append string
JSON.STRAPPEND doc:1 $.name '" Smith"'

# Get string length
JSON.STRLEN doc:1 $.name
```

---

## Type and Memory

```bash
# Get type at path
JSON.TYPE doc:1 $.name    # "string"
JSON.TYPE doc:1 $.age     # "integer"
JSON.TYPE doc:1 $.tags    # "array"

# Get memory usage
JSON.MEMORY doc:1 $       # bytes

# Get number of fields/values at path
JSON.GET doc:1 $          # full document
```

---

## Deletion

```bash
# Delete key
DEL doc:1

# Delete specific path (removes field from object)
JSON.DEL doc:1 $.email

# Delete array element
JSON.DEL doc:1 $.tags[0]
```

---

## Multi-Key Operations

```bash
# Get from multiple keys
JSON.MGET doc:1 doc:2 doc:3 $.name
```

---

## Conditional Set

```bash
# Set only if path doesn't exist (NX)
JSON.SET doc:1 $.email "new@example.com" NX

# Set only if path exists (XX)
JSON.SET doc:1 $.age 32 XX
```

---

## Python Examples

```python
import redis

r = redis.Redis(decode_responses=True)

# Set JSON
r.json().set('doc:1', '$', {'name': 'Alice', 'age': 30, 'tags': ['redis', 'db']})

# Get JSON
doc = r.json().get('doc:1', '$')
name = r.json().get('doc:1', '$.name')

# Update field
r.json().set('doc:1', '$.age', 31)

# Append to array
r.json().arrappend('doc:1', '$.tags', 'json')

# Increment
r.json().numincrby('doc:1', '$.age', 1)

# Delete field
r.json().delete('doc:1', '$.tags', 0)  # delete first array element
```

---

## JavaScript Examples

```js
import { createClient } from 'redis';

const client = createClient();
await client.connect();

// Set JSON
await client.json.set('doc:1', '$', { name: 'Alice', age: 30, tags: ['redis', 'db'] });

// Get JSON
const doc = await client.json.get('doc:1', { path: '$' });
const name = await client.json.get('doc:1', { path: '$.name' });

// Update
await client.json.set('doc:1', '$.age', 31);
await client.json.arrAppend('doc:1', '$.tags', 'json');
await client.json.numIncrBy('doc:1', '$.age', 1);
```

---

## Use Cases

### Product Catalog

```bash
JSON.SET product:100 $ '{"name":"Widget","price":19.99,"tags":["gadget","tool"],"stock":50}'
JSON.GET product:100 $.price
JSON.NUMINCRBY product:100 $.stock -1
JSON.ARRAPPEND product:100 $.tags '"sale"'
```

### User Profiles

```bash
JSON.SET user:1000 $ '{"name":"Alice","preferences":{"theme":"dark","notifications":true},"roles":["admin"]}'
JSON.GET user:1000 $.preferences.theme
JSON.SET user:1000 $.preferences.theme "light"
JSON.ARRAPPEND user:1000 $.roles '"editor"'
```

### Configuration Storage

```bash
JSON.SET config:app $ '{"debug":false,"maxConnections":100,"features":{"cache":true,"analytics":false}}'
JSON.GET config:app $.features.cache
JSON.SET config:app $.features.analytics true
```

---

## JSONPath Syntax

| Expression | Description |
|-----------|-------------|
| `$` | Root element |
| `$.field` | Field of root object |
| `$.field.subfield` | Nested field |
| `$[0]` | First array element |
| `$[-1]` | Last array element |
| `$[0:2]` | Array slice (0 to 1) |
| `$.*` | All elements of root |
| `$.field.*` | All elements of field |
| `$..field` | Recursive descent |

---

## Performance

- `JSON.SET`, `JSON.GET` — O(N) where N is document size
- `JSON.ARRAPPEND` — O(1)
- `JSON.NUMINCRBY` — O(1)
- Documents are stored in a compact binary format
- Path-based access avoids full document serialization
