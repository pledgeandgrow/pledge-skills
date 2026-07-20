# Performance and Optimization — Django 6.0

## Database Optimization

### select_related (Single Query for FK/OneToOne)

```python
# Without select_related: N+1 queries
articles = Article.objects.all()
for article in articles:
    print(article.author.name)  # 1 query per article

# With select_related: 1 query (JOIN)
articles = Article.objects.select_related("author")
for article in articles:
    print(article.author.name)  # No extra queries

# Multiple levels
articles = Article.objects.select_related("author", "category", "author__profile")

# All FKs
articles = Article.objects.select_related()  # All non-null FKs
```

### prefetch_related (Separate Query for M2M/Reverse FK)

```python
# Without prefetch_related: N+1 queries
articles = Article.objects.all()
for article in articles:
    print(article.tags.all())  # 1 query per article

# With prefetch_related: 2 queries
articles = Article.objects.prefetch_related("tags")
for article in articles:
    print(article.tags.all())  # Uses prefetched data

# Multiple relations
articles = Article.objects.prefetch_related("tags", "comments", "comments__author")

# With filtering (Prefetch object)
from django.db.models import Prefetch
articles = Article.objects.prefetch_related(
    Prefetch(
        "comments",
        queryset=Comment.objects.filter(approved=True),
        to_attr="approved_comments",
    )
)
for article in articles:
    print(len(article.approved_comments))  # Already filtered
```

### defer and only (Load Specific Fields)

```python
# Don't load heavy fields
articles = Article.objects.defer("content", "metadata")
for article in articles:
    print(article.title)  # No content loaded
    print(article.content)  # Extra query to get content

# Load only specific fields
articles = Article.objects.only("title", "published_at")
for article in articles:
    print(article.title)  # Only title and published_at loaded
```

### Bulk Operations

```python
# Bulk create (1 query instead of N)
Article.objects.bulk_create([
    Article(title="A", content="..."),
    Article(title="B", content="..."),
    Article(title="C", content="..."),
], batch_size=100)

# Bulk update (1 query instead of N)
articles = list(Article.objects.all()[:100])
for article in articles:
    article.title = article.title.upper()
Article.objects.bulk_update(articles, ["title"], batch_size=100)

# bulk_create with ignore_conflicts
Article.objects.bulk_create([...], ignore_conflicts=True)

# bulk_create with update_conflicts (Django 6.0)
Article.objects.bulk_create(
    [...],
    update_conflicts=True,
    unique_fields=["slug"],
    update_fields=["title", "content"],
)
```

### Query Optimization

```python
# Use values() for dicts (less memory)
articles = Article.objects.values("id", "title")
# [{"id": 1, "title": "A"}, ...]

# Use values_list() for tuples
titles = Article.objects.values_list("title", flat=True)
# ["A", "B", "C"]

# Use exists() instead of count() > 0
if Article.objects.filter(published=True).exists():
    pass  # More efficient than count() > 0

# Use count() instead of len(queryset)
count = Article.objects.filter(published=True).count()  # SQL COUNT
# Not: len(Article.objects.filter(published=True))  # Loads all objects

# Use iterator() for large querysets (no caching)
for article in Article.objects.iterator(chunk_size=1000):
    process(article)  # Memory efficient

# Use explain() to analyze queries
print(Article.objects.filter(title="Test").explain(analyze=True))
```

### Indexing

```python
class Article(models.Model):
    title = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(unique=True)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, db_index=True)
    published_at = models.DateTimeField(null=True, db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=["-published_at"], name="published_desc_idx"),
            models.Index(fields=["author", "-published_at"], name="author_date_idx"),
            models.Index(
                fields=["title"],
                name="title_lower_idx",
                condition=Q(title__icontains="django"),  # Partial index (PostgreSQL)
            ),
        ]
```

## Caching Strategies

### View-Level Caching
```python
from django.views.decorators.cache import cache_page

@cache_page(60 * 15)  # 15 minutes
def article_list(request):
    ...
```

### Template Fragment Caching
```html
{% load cache %}
{% cache 500 sidebar request.user.id %}
    {# Expensive sidebar computation #}
{% endcache %}
```

### Low-Level Cache
```python
from django.core.cache import cache

def get_expensive_data():
    data = cache.get("expensive_data")
    if data is None:
        data = compute_expensive_data()
        cache.set("expensive_data", data, timeout=300)
    return data
```

### QuerySet Caching
```python
# QuerySets are cached after first evaluation
qs = Article.objects.filter(published=True)  # No query yet
articles = list(qs)  # Query executed and cached
articles2 = list(qs)  # Uses cache, no new query
```

## Database Connection Pooling

```python
# settings.py
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "CONN_MAX_AGE": 60,  # Reuse connections for 60 seconds
        "CONN_HEALTH_CHECKS": True,  # Check connection health
    }
}

# With django-db-connection-pool
DATABASES = {
    "default": {
        "ENGINE": "dj_db_pool.backends.postgresql",
        "OPTIONS": {
            "pool": {
                "min_size": 5,
                "max_size": 20,
            },
        },
    }
}
```

## Profiling

### Debug Toolbar

```bash
pip install django-debug-toolbar
```

```python
# settings.py
INSTALLED_APPS = [
    # ...
    "debug_toolbar",
]
MIDDLEWARE = [
    "debug_toolbar.middleware.DebugToolbarMiddleware",
    # ...
]
INTERNAL_IPS = ["127.0.0.1"]

# urls.py
if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path("__debug__/", include(debug_toolbar.urls)),
    ] + urlpatterns
```

### Query Counting

```python
from django.db import connection
from django.db import reset_queries

reset_queries()
# ... run code ...
print(f"Queries: {len(connection.queries)}")
for query in connection.queries:
    print(f"  [{query['time']}s] {query['sql'][:100]}")
```

### Logging SQL Queries

```python
LOGGING = {
    "version": 1,
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
        },
    },
    "loggers": {
        "django.db.backends": {
            "handlers": ["console"],
            "level": "DEBUG",
            "propagate": False,
        },
    },
}
```

## Performance Tips

1. **Use `select_related`** for ForeignKey and OneToOneField access
2. **Use `prefetch_related`** for ManyToManyField and reverse ForeignKey access
3. **Use `only()` or `defer()`** to skip unnecessary fields
4. **Use `values()` or `values_list()`** when you don't need model instances
5. **Use `bulk_create()` and `bulk_update()`** for batch operations
6. **Use `exists()`** instead of `count() > 0`
7. **Use `count()`** instead of `len(queryset)`
8. **Use `iterator()`** for large querysets to save memory
9. **Add database indexes** on frequently filtered/ordered fields
10. **Cache expensive computations** at appropriate levels
11. **Enable `CONN_MAX_AGE`** for connection pooling
12. **Use `DEBUG = False`** in production (disables query logging)
13. **Paginate results** — never load all objects at once
14. **Use `F()` expressions** for updates to avoid race conditions
15. **Monitor with `explain()`** to identify slow queries
