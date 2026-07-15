# Redis Search and Query (RediSearch)

Full-text search, secondary indexing, and aggregation queries. Built into Redis 8+ (formerly Redis Stack module).

---

## Creating Indexes

### Hash Index

```bash
FT.CREATE articles_idx ON HASH PREFIX 1 article: SCHEMA
  title TEXT WEIGHT 5.0
  body TEXT WEIGHT 1.0
  author TAG
  published_date NUMERIC SORTABLE
  tags TAG SEPARATOR ","
  url TEXT NOSTEM
```

### JSON Index

```bash
FT.CREATE products_idx ON JSON PREFIX 1 product: SCHEMA
  $.name AS name TEXT WEIGHT 2.0
  $.description AS description TEXT
  $.price AS price NUMERIC SORTABLE
  $.category AS category TAG
  $.in_stock AS in_stock TAG
  $.embedding AS embedding VECTOR FLAT 6 TYPE FLOAT32 DIM 1536 DISTANCE_METRIC COSINE
```

### Index Options

```bash
FT.CREATE my_idx ON HASH PREFIX 2 article: blog: SCHEMA
  title TEXT
  STOPWORDS 2 "the" "an"
  body TEXT PHONETIC dm:en

# With expiration
FT.CREATE my_idx ON HASH PREFIX 1 doc: SCHEMA title TEXT
# Set default TTL for index
FT.CREATE my_idx ON HASH PREFIX 1 doc: SCHEMA title TEXT
```

---

## Search Queries

### Basic Search

```bash
# Simple text search
FT.SEARCH articles_idx "redis database"

# Field-specific
FT.SEARCH articles_idx "@title:redis @body:cache"

# Phrase search
FT.SEARCH articles_idx '"redis cluster"'

# Prefix search
FT.SEARCH articles_idx "redi*"

# Fuzzy search (Levenshtein distance)
FT.SEARCH articles_idx "%redis%"
FT.SEARCH articles_idx "%%redis%%"   # distance up to 2
```

### Tag Queries

```bash
# Single tag
FT.SEARCH articles_idx "@author:{alice}"

# Multiple tags (OR)
FT.SEARCH articles_idx "@author:{alice|bob}"

# Multiple tags (AND — not supported natively, use intersection)
FT.SEARCH articles_idx "@tags:{redis} @tags:{tutorial}"
```

### Numeric Range

```bash
# Range
FT.SEARCH articles_idx "@published_date:[1735689600 1735776000]"

# Open-ended
FT.SEARCH articles_idx "@published_date:[1735689600 +inf]"
FT.SEARCH articles_idx "@published_date:[-inf 1735776000]"

# Exclusive bounds
FT.SEARCH articles_idx "@published_date:[(1735689600 (1735776000]"
```

### Boolean Operators

```bash
# AND (implicit)
FT.SEARCH articles_idx "redis cache"

# Explicit AND
FT.SEARCH articles_idx "redis AND cache"

# OR
FT.SEARCH articles_idx "redis | database"

# NOT
FT.SEARCH articles_idx "redis -mysql"
FT.SEARCH articles_idx "redis NOT mysql"

# Parentheses
FT.SEARCH articles_idx "(redis | memcached) @author:{alice}"
```

### Search Options

```bash
# Return specific fields
FT.SEARCH articles_idx "redis" RETURN 2 title author

# Limit and offset (pagination)
FT.SEARCH articles_idx "redis" LIMIT 10 20   # offset=10, count=20

# Sort by field
FT.SEARCH articles_idx "redis" SORTBY published_date DESC

# With scores
FT.SEARCH articles_idx "redis" WITHSCORES

# With payloads
FT.SEARCH articles_idx "redis" WITHPAYLOADS

# Count only
FT.SEARCH articles_idx "redis" LIMIT 0 0

# No content (just IDs)
FT.SEARCH articles_idx "redis" NOCONTENT

# Highlight
FT.SEARCH articles_idx "redis" HIGHLIGHT FIELDS 2 title body TAGS "<b>" "</b>"

# Summarize
FT.SEARCH articles_idx "redis" SUMMARIZE FIELDS 1 body LEN 80 FRAGS 3

# Explain (query plan)
FT.EXPLAIN articles_idx "@title:redis @body:cache"

# Explain CLI (tree format)
FT.EXPLAINCLI articles_idx "@title:redis"
```

---

## Aggregation

```bash
# Basic aggregation
FT.AGGREGATE articles_idx "*" GROUPBY 1 @author REDUCE COUNT 0 AS article_count

# Sort and limit
FT.AGGREGATE articles_idx "*" GROUPBY 1 @author REDUCE COUNT 0 AS article_count SORTBY 4 @article_count DESC LIMIT 0 10

# Average by group
FT.AGGREGATE articles_idx "*" GROUPBY 1 @author REDUCE AVG 1 @word_count AS avg_words

# Multiple reductions
FT.AGGREGATE articles_idx "*" GROUPBY 1 @author REDUCE COUNT 0 AS total REDUCE MAX 1 @published_date AS latest REDUCE MIN 1 @published_date AS earliest

# Filter results
FT.AGGREGATE articles_idx "*" GROUPBY 1 @author REDUCE COUNT 0 AS total FILTER "@total > 5"

# Apply expressions
FT.AGGREGATE articles_idx "*" APPLY "@price * @quantity" AS total_value GROUPBY 1 @category REDUCE SUM 1 @total_value AS category_total

# Time series aggregation
FT.AGGREGATE articles_idx "*" APPLY "floor(@published_date / 86400)" AS day GROUPBY 1 @day REDUCE COUNT 0 AS daily_count SORTBY 4 @day ASC
```

### Aggregation Pipeline Stages

| Stage | Description |
|-------|-------------|
| `GROUPBY` | Group by fields |
| `REDUCE` | Aggregate function (COUNT, SUM, AVG, MIN, MAX, etc.) |
| `SORTBY` | Sort results |
| `LIMIT` | Paginate |
| `FILTER` | Filter results |
| `APPLY` | Compute expressions |
| `LOAD` | Load additional fields |

### Reduction Functions

| Function | Description |
|----------|-------------|
| `COUNT` | Count of records |
| `SUM` | Sum of numeric field |
| `AVG` | Average of numeric field |
| `MIN` / `MAX` | Minimum / Maximum |
| `TOLIST` | Collect values into list |
| `COUNT_DISTINCT` | Distinct count |
| `QUANTILE` | Approximate quantile |
| `STDDEV` | Standard deviation |

---

## Spellcheck

```bash
# Spellcheck a query
FT.SPELLCHECK articles_idx "resi dtabase" DISTANCE 2

# With custom dictionary
FT.SPELLCHECK articles_idx "resi" TERMS INCLUDE foo.dict EXCLUDE bar.dict DISTANCE 2

# Output: term, suggestion, score
# 1) "resi"  2) "redis"  3) "0.5"
```

### Custom Dictionaries

```bash
# Add terms to dictionary
FT.DICTADD mydict "redis" "database" "cache" "cluster"

# Dump dictionary
FT.DICTDUMP mydict

# Use in spellcheck
FT.SPELLCHECK articles_idx "resi" TERMS INCLUDE mydict
```

---

## Synonyms

```bash
# Add synonym groups
FT.SYNUPDATE articles_idx 0 "fast" "quick" "rapid"
FT.SYNUPDATE articles_idx 0 "big" "large" "huge"

# Dump synonyms
FT.SYNDUMP articles_idx
# 1) "fast"  2) 1) "quick"  2) "rapid"
# 3) "big"   4) 1) "large"  2) "huge"
```

---

## Index Management

```bash
# List all indexes
FT._LIST

# Get index info
FT.INFO articles_idx

# Drop index (keeps data)
FT.DROPINDEX articles_idx

# Drop index and delete documents
FT.DROPINDEX articles_idx DD

# Alias management
FT.ALIASADD myalias articles_idx
FT.ALIASUPDATE myalias new_idx
FT.ALIASDEL myalias
```

---

## Configuration

```bash
# Set runtime config
FT.CONFIG SET TIMEOUT 1000          # query timeout in ms
FT.CONFIG SET MAXSEARCHRESULTS 10000
FT.CONFIG SET MAXAGGREGATERESULTS 10000
FT.CONFIG SET ON_TIMEOUT return     # return|fail

# Get config
FT.CONFIG GET TIMEOUT
FT.CONFIG GET *
```

---

## Python Examples

```python
from redis.commands.search import Search
from redis.commands.search.field import TextField, NumericField, TagField, VectorField
from redis.commands.search.query import Query

# Create index
schema = (
    TextField("title", weight=5.0),
    TextField("body"),
    TagField("author"),
    NumericField("published_date", sortable=True),
)
r.ft("articles_idx").create_index(schema)

# Search
q = Query("redis cache").sort_by("published_date", asc=False).paging(0, 10)
results = r.ft("articles_idx").search(q)

# Aggregation
from redis.commands.search.aggregation import AggregateRequest, Asc, Desc, Count
req = AggregateRequest("*").group_by("@author", Count() == "article_count").sort_by(Desc("@article_count")).limit(0, 10)
results = r.ft("articles_idx").aggregate(req)
```

---

## JavaScript Examples

```js
import { createClient } from 'redis';

const client = createClient();
await client.connect();

// Create index
await client.ft.create('articles_idx', {
  title: { type: 'TEXT', weight: 5.0 },
  body: { type: 'TEXT' },
  author: { type: 'TAG' },
}, {
  prefix: 'article:',
});

// Search
const results = await client.ft.search('articles_idx', 'redis cache', {
  LIMIT: { from: 0, size: 10 },
  SORTBY: { BY: 'published_date', DIRECTION: 'DESC' },
});
```

---

## Performance

| Operation | Complexity |
|-----------|------------|
| `FT.SEARCH` | O(N) where N is number of results |
| `FT.AGGREGATE` | O(N) for scan, O(N log N) for sort |
| Index creation | O(1) (indexing happens on existing data) |
| Document indexing | O(1) per field |

## Limits

- Maximum fields per index: 1024
- Maximum results per query: configurable via `MAXSEARCHRESULTS`
- Text field max length: configurable
- Indexes are per-database, not per-cluster (sharded in cluster mode)
