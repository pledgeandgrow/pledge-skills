# Redis Vector Sets

Vector Sets (v8.0+) are a native Redis data type for vector similarity search. They use an HNSW (Hierarchical Navigable Small World) graph for approximate nearest neighbor search.

---

## Overview

Vector Sets store vector embeddings associated with named elements. Unlike the search index-based vector search (FT.SEARCH with VECTOR field), Vector Sets are a standalone data type with their own command set.

| Feature | Vector Sets | Search Index Vectors |
|---------|------------|---------------------|
| Data type | `vectorset` | Hash/JSON with index |
| Algorithm | HNSW | FLAT or HNSW |
| Commands | VADD, VSIM, etc. | FT.CREATE, FT.SEARCH |
| Attributes | JSON attributes per element | Fields in Hash/JSON |
| Use case | Simple similarity search | Complex search + filters |

---

## Basic Operations

### Adding Vectors

```bash
# VADD key vector member
VADD points 1.0 1.0 "pt:A"
VADD points -1.0 -1.0 "pt:B"
VADD points -1.0 1.0 "pt:C"
VADD points 1.0 -1.0 "pt:D"
VADD points 1.0 0 "pt:E"

# Check type
TYPE points
# "vectorset"

# Get cardinality
VCARD points
# (integer) 5

# Get dimensions
VDIM points
# (integer) 2
```

### Similarity Search

```bash
# VSIM — find most similar elements to a query vector
VSIM points 0.9 0.1
# 1) "pt:E"
# 2) "pt:A"
# 3) "pt:D"
# 4) "pt:C"
# 5) "pt:B"

# With scores
VSIM points 0.9 0.1 WITHSCORES
# 1) "pt:E"  2) "0.005"
# 3) "pt:A"  4) "0.02"
# ...

# Limit results
VSIM points 0.9 0.1 COUNT 3

# Search by member (find similar to existing member)
VSIM points ELEMENT "pt:A" COUNT 3
```

### Removing Elements

```bash
VREM points "pt:D"
```

### Getting Vector Embeddings

```bash
# Get the vector for a specific element
VEMB points "pt:A"
# 1) (float) 1.0
# 2) (float) 1.0
```

---

## Attributes

Each element can have JSON attributes for filtering and metadata:

```bash
# Set attributes
VSETATTR points "pt:A" '{"category":"geo","label":"top-right"}'
VSETATTR points "pt:B" '{"category":"geo","label":"bottom-left"}'

# Get attributes
VGETATTR points "pt:A"
# "{\"category\":\"geo\",\"label\":\"top-right\"}"

# Use attributes in VSIM
VSIM points 0.9 0.1 WITHATTRIBS COUNT 3
```

### Filtering by Attributes

```bash
# Filter results by attribute expression
VSIM points 0.9 0.1 FILTER "@.category == 'geo'" COUNT 10
```

---

## HNSW Graph Inspection

```bash
# Get HNSW graph links for an element
VLINKS points "pt:A"
# Returns neighbors at each layer of the HNSW graph

# Get vector set info
VINFO points
# Returns: dim, size, hnsw_max_edges, quantization, etc.
```

---

## Additional Commands

```bash
# Check if element exists (v8.2+)
VISMEMBER points "pt:A"
# (integer) 1

# Get random member
VRANDMEMBER points
VRANDMEMBER points 3    # multiple random members

# Get elements in lexicographic range (v8.4+)
VRANGE points "pt:A" "pt:D"
```

---

## Python Examples

```python
r.vset().vadd("points", [1.0, 1.0], "pt:A")
r.vset().vadd("points", [-1.0, -1.0], "pt:B")
r.vset().vadd("points", [-1.0, 1.0], "pt:C")
r.vset().vadd("points", [1.0, -1.0], "pt:D")
r.vset().vadd("points", [1.0, 0], "pt:E")

# Type
r.type("points")  # "vectorset"

# Similarity search
results = r.vset().vsim("points", [0.9, 0.1])
# ['pt:E', 'pt:A', 'pt:D', 'pt:C', 'pt:B']

# With scores and attributes
results = r.vset().vsim("points", [0.9, 0.1], with_scores=True, with_attribs=True, count=3)

# Set attributes
r.vset().vsetattr("points", "pt:A", '{"category":"geo"}')

# Get attributes
attrs = r.vset().vgetattr("points", "pt:A")

# Remove
r.vset().vrem("points", "pt:D")

# Cardinality
r.vset().vcard("points")

# Dimensions
r.vset().vdim("points")

# Get embedding
r.vset().vemb("points", "pt:A")
```

---

## Use Cases

### Recommendation System

```bash
# Store product embeddings
VADD products 0.1 0.2 0.3 "product:100"
VADD products 0.4 0.5 0.6 "product:101"
VADD products 0.2 0.1 0.4 "product:102"

# Find similar products to a user's preference vector
VSIM products 0.15 0.25 0.35 COUNT 5 WITHSCORES
```

### Image Similarity

```bash
# Store image embeddings (e.g., from a CNN)
VADD images 0.1 0.2 ... 0.9 "img:photo1"
VADD images 0.3 0.1 ... 0.7 "img:photo2"

# Find similar images
VSIM images 0.15 0.15 ... 0.85 COUNT 10
```

### Semantic Search

```bash
# Store text embeddings (e.g., from a transformer model)
VADD docs 0.1 0.2 ... "doc:1"
VADD docs 0.3 0.4 ... "doc:2"

# Search by query embedding
VSIM docs 0.15 0.25 ... COUNT 5 WITHSCORES
```

### Duplicate Detection

```bash
# Store embeddings of items
VADD items 0.1 0.2 ... "item:original"

# Check if a new item is similar to existing ones
VSIM items 0.11 0.21 ... COUNT 1
# If score is very low (high similarity), it's likely a duplicate
```

---

## Endianness (FP32 Format)

Vector Sets store vectors in FP32 (32-bit float) format. When passing raw bytes (e.g., from numpy), be aware of endianness:

```python
import numpy as np
import redis

r = redis.Redis()

# Convert to bytes in little-endian (Redis default)
vec = np.array([1.0, 2.0, 3.0], dtype=np.float32)
vec_bytes = vec.tobytes()  # native endianness

# If on big-endian system, convert:
# vec_bytes = vec.astype('<f4').tobytes()

r.execute_command('VADD', 'myset', 'FP32', vec_bytes, 'item:1')
```

---

## Performance

| Operation | Complexity |
|-----------|------------|
| `VADD` | O(log N) approximate (HNSW insertion) |
| `VSIM` | O(log N) approximate (HNSW search) |
| `VREM` | O(log N) |
| `VCARD` | O(1) |
| `VDIM` | O(1) |
| `VEMB` | O(D) where D is dimensions |
| `VINFO` | O(1) |

### HNSW Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `M` | 16 | Max connections per node per layer |
| `EF_CONSTRUCTION` | 200 | Search width during graph construction |
| `EF_RUNTIME` | 10 | Search width during query (higher = more accurate, slower) |

```bash
# Set EF at query time
VSIM points 0.9 0.1 EF 100 COUNT 10

# Use exact search (bypass HNSW, slower but exact)
VSIM points 0.9 0.1 TRUTH COUNT 10
```

---

## Vector Sets vs Search Index Vectors

| Aspect | Vector Sets | FT.SEARCH with VECTOR |
|--------|------------|----------------------|
| Simplicity | Simple (VADD/VSIM) | More complex (FT.CREATE + HSET + FT.SEARCH) |
| Filtering | Basic attribute filter | Full query language (text, numeric, tag) |
| Hybrid search | Limited | Full support (vector + text + filters) |
| Aggregation | No | Yes (FT.AGGREGATE) |
| Best for | Pure vector similarity | Complex search with vectors |
