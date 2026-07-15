# Redis for AI and Vector Search

Redis provides built-in vector similarity search, full-text search, and AI development tools.

---

## Vector Search

Redis supports vector embeddings for similarity search, recommendation systems, and AI applications.

### Creating a Vector Index

```bash
# Create a search index with vector field
FT.CREATE my_index ON HASH PREFIX 1 doc: SCHEMA
  title TEXT
  content TEXT
  embedding VECTOR FLAT 6   # FLAT or HNSW algorithm
    TYPE FLOAT32
    DIM 1536                # dimensions (e.g., OpenAI embeddings)
    DISTANCE_METRIC COSINE  # COSINE, L2, IP (inner product)
```

### HNSW Index (for larger datasets)

```bash
FT.CREATE my_index ON HASH PREFIX 1 doc: SCHEMA
  embedding VECTOR HNSW 6
    TYPE FLOAT32
    DIM 1536
    DISTANCE_METRIC COSINE
    M 16                    # max connections per node
    EF_CONSTRUCTION 200     # build-time search width
```

### Storing Vectors

```python
import redis
import numpy as np

r = redis.Redis(decode_responses=False)

# Store document with embedding
embedding = np.random.rand(1536).astype(np.float32).tobytes()
r.hset('doc:1', mapping={
    'title': 'Redis Guide',
    'content': 'Redis is an in-memory database',
    'embedding': embedding,
})
```

### Vector Search Query

```bash
# KNN search (find 5 nearest neighbors)
FT.SEARCH my_index "*=>[KNN 5 @embedding $vec]" PARAMS 2 vec $blob LIMIT 0 5
```

```python
query_vector = np.random.rand(1536).astype(np.float32).tobytes()

results = r.ft('my_index').search(
    Query("*=>[KNN 5 @embedding $vec]")
        .add_param("vec", query_vector)
        .return_fields("title", "content", "__embedding_score"),
    params={"vec": query_vector}
)
```

### Hybrid Search (Vector + Filter)

```bash
# Vector search with text filter
FT.SEARCH my_index "(@title:redis)=>[KNN 5 @embedding $vec]" PARAMS 2 vec $blob LIMIT 0 5

# Vector search with numeric filter
FT.SEARCH my_index "(@price:[0 100])=>[KNN 5 @embedding $vec]" PARAMS 2 vec $blob LIMIT 0 5
```

---

## Full-Text Search

### Creating a Text Index

```bash
FT.CREATE articles_idx ON HASH PREFIX 1 article: SCHEMA
  title TEXT WEIGHT 5.0
  body TEXT WEIGHT 1.0
  author TAG
  published_date NUMERIC SORTABLE
  tags TAG SEPARATOR ","
```

### Search Queries

```bash
# Basic search
FT.SEARCH articles_idx "redis database"

# Field-specific search
FT.SEARCH articles_idx "@title:redis @body:cache"

# Phrase search
FT.SEARCH articles_idx '"redis cluster"'

# Prefix search
FT.SEARCH articles_idx "redi*"

# Fuzzy search
FT.SEARCH articles_idx "%redis%"

# Tag search
FT.SEARCH articles_idx "@author:{alice,bob}"

# Numeric range
FT.SEARCH articles_idx "@published_date:[1735689600 1735776000]"

# Combined
FT.SEARCH articles_idx "@title:redis @tags:{tutorial} @published_date:[1735689600 +inf]"
```

### Search Options

```bash
# Return specific fields
FT.SEARCH articles_idx "redis" RETURN 2 title author

# Limit and offset
FT.SEARCH articles_idx "redis" LIMIT 0 10

# Sort by field
FT.SEARCH articles_idx "redis" SORTBY published_date DESC

# With scores
FT.SEARCH articles_idx "redis" WITHSCORES

# Count only
FT.SEARCH articles_idx "redis" LIMIT 0 0

# Highlight and summarize
FT.SEARCH articles_idx "redis" HIGHLIGHT FIELDS 1 body TAGS "<b>" "</b>"
FT.SEARCH articles_idx "redis" SUMMARIZE FIELDS 1 body LEN 50
```

### Aggregation

```bash
# Group and count
FT.AGGREGATE articles_idx "*" GROUPBY 1 @author REDUCE COUNT 0 AS article_count

# Average by group
FT.AGGREGATE articles_idx "*" GROUPBY 1 @author REDUCE AVG 1 @word_count AS avg_words

# Sort and limit
FT.AGGREGATE articles_idx "*" SORTBY 4 @avg_words DESC LIMIT 0 10
```

---

## RedisVL (Vector Library)

Python library for vector search with Redis.

```bash
pip install redisvl
```

```python
from redisvl.index import SearchIndex
from redisvl.query import VectorQuery, FilterQuery
from redisvl.query.filter import Tag, Num

# Define schema
schema = {
    "index": {
        "name": "documents",
        "prefix": "doc",
        "storage_type": "hash",
    },
    "fields": [
        {"name": "title", "type": "text"},
        {"name": "content", "type": "text"},
        {"name": "category", "type": "tag"},
        {"name": "embedding", "type": "vector", "dims": 1536, "distance_metric": "cosine", "algorithm": "flat"}
    ]
}

# Create index
index = SearchIndex.from_dict(schema, redis_url="redis://localhost:6379")
index.create(overwrite=True)

# Load data
data = [
    {"id": "doc1", "title": "Redis Guide", "content": "Redis is fast", "category": "database", "embedding": [0.1, 0.2, ...]},
    {"id": "doc2", "title": "AI Tutorial", "content": "Machine learning basics", "category": "ai", "embedding": [0.3, 0.4, ...]},
]
index.load(data)

# Vector search
query = VectorQuery(
    vector=[0.1, 0.2, ...],
    vector_field_name="embedding",
    num_results=5,
    return_fields=["title", "content", "category"],
)
results = index.search(query)

# Filtered search
filter = Tag("category") == "database"
filtered_query = VectorQuery(
    vector=[0.1, 0.2, ...],
    vector_field_name="embedding",
    num_results=5,
    filter_expression=filter,
    return_fields=["title", "content"],
)
results = index.search(filtered_query)
```

---

## AI Use Cases

### Semantic Search

```python
# 1. Generate embeddings with OpenAI
import openai
response = openai.embeddings.create(input="What is Redis?", model="text-embedding-3-small")
embedding = response.data[0].embedding

# 2. Search Redis
from redisvl.query import VectorQuery
query = VectorQuery(vector=embedding, vector_field_name="embedding", num_results=5)
results = index.search(query)
```

### RAG (Retrieval-Augmented Generation)

```python
# 1. Store documents with embeddings
for doc in documents:
    embedding = get_embedding(doc['content'])
    index.load([{"id": doc['id'], "content": doc['content'], "embedding": embedding}])

# 2. Retrieve relevant documents
query_embedding = get_embedding(user_question)
query = VectorQuery(vector=query_embedding, vector_field_name="embedding", num_results=3)
results = index.search(query)

# 3. Generate answer with context
context = "\n".join([r['content'] for r in results])
answer = llm.generate(f"Context: {context}\nQuestion: {user_question}")
```

### Recommendation System

```python
# Store item embeddings
for item in items:
    r.hset(f"item:{item['id']}", mapping={
        "name": item['name'],
        "embedding": item['embedding'],
    })

# Find similar items
query = VectorQuery(
    vector=user_preference_vector,
    vector_field_name="embedding",
    num_results=10,
)
recommendations = index.search(query)
```

### Chatbot Memory

```python
# Store conversation with embeddings
r.hset(f"chat:{session_id}:msg:{msg_id}", mapping={
    "role": "user",
    "content": message,
    "embedding": get_embedding(message),
    "timestamp": time.time(),
})

# Retrieve relevant past conversations
query = VectorQuery(
    vector=get_embedding(current_question),
    vector_field_name="embedding",
    num_results=5,
    filter_expression=Tag("session") == session_id,
)
context = index.search(query)
```

---

## Distance Metrics

| Metric | Formula | Use Case |
|--------|---------|----------|
| `COSINE` | 1 - (A·B / \|A\|\|B\|) | Text embeddings (normalized) |
| `L2` | sqrt(Σ(Ai - Bi)²) | Image embeddings |
| `IP` | Σ(Ai * Bi) | Inner product (when normalized = cosine) |

---

## Index Algorithms

| Algorithm | Build Time | Search Time | Memory | Use Case |
|-----------|-----------|-------------|--------|----------|
| `FLAT` | O(1) | O(N) | O(N) | Small datasets, exact search |
| `HNSW` | O(N log N) | O(log N) | O(N * M) | Large datasets, approximate search |
