# Caching — Django 6.0

## Setting Up the Cache

```python
# settings.py
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
    }
}
```

## Cache Backends

### Redis (Recommended)
```python
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "OPTIONS": {
            "db": 1,
            "parser": "hiredis",
        },
    }
}
```

### Memcached
```python
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.memcached.PyMemcacheCache",
        "LOCATION": "127.0.0.1:11211",
    }
}

# Multiple servers:
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.memcached.PyMemcacheCache",
        "LOCATION": ["127.0.0.1:11211", "127.0.0.1:11212"],
    }
}
```

### Database
```python
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.db.DatabaseCache",
        "LOCATION": "my_cache_table",
    }
}
# Create cache table:
# python manage.py createcachetable
```

### Filesystem
```python
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.filebased.FileBasedCache",
        "LOCATION": "/var/tmp/django_cache",
    }
}
```

### Local Memory (Development)
```python
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "unique-snowflake",
    }
}
```

### Dummy (Development)
```python
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.dummy.DummyCache",
    }
}
```

## Cache Arguments

```python
CACHES = {
    "default": {
        "BACKEND": "...",
        "LOCATION": "...",
        "TIMEOUT": 300,  # Default timeout: 5 minutes (300 seconds)
        "KEY_PREFIX": "myapp_",
        "VERSION": 1,
        "OPTIONS": {
            "MAX_ENTRIES": 1000,
            "CULL_FREQUENCY": 3,  # Delete 1/3 when full
        },
    }
}
```

## Per-Site Cache

```python
# settings.py
MIDDLEWARE = [
    "django.middleware.cache.UpdateCacheMiddleware",  # Near top
    # ... other middleware ...
    "django.middleware.cache.FetchFromCacheMiddleware",  # Near bottom
]

CACHE_MIDDLEWARE_ALIAS = "default"
CACHE_MIDDLEWARE_SECONDS = 600  # 10 minutes
CACHE_MIDDLEWARE_KEY_PREFIX = "site_"
```

## Per-View Cache

```python
from django.views.decorators.cache import cache_page

@cache_page(60 * 15)  # Cache for 15 minutes
def article_detail(request, pk):
    article = get_object_or_404(Article, pk=pk)
    return render(request, "articles/detail.html", {"article": article})

# With cache alias
@cache_page(60 * 15, cache="special_cache")
def special_view(request):
    ...

# In URLconf
urlpatterns = [
    path("article/<int:pk>/", cache_page(60 * 15)(views.article_detail)),
]
```

## Template Fragment Caching

```html
{% load cache %}

{% cache 500 sidebar request.user.username %}
    <!-- Expensive sidebar content -->
    {% for article in articles %}
        {{ article.title }}
    {% endfor %}
{% endcache %}

{# With cache name (for multiple fragments) #}
{% cache 500 sidebar request.user.username %}
    ...
{% endcache %}
```

## Low-Level Cache API

```python
from django.core.cache import cache

# Set
cache.set("key", "value", timeout=300)  # 5 minutes
cache.set("key", "value")  # Uses default timeout

# Get
value = cache.get("key")  # Returns None if not found
value = cache.get("key", "default_value")  # With default

# Get or set
value = cache.get_or_set("key", "value", timeout=300)
value = cache.get_or_set("key", lambda: expensive_computation(), timeout=300)

# Add (only if key doesn't exist)
cache.add("key", "value", timeout=300)  # Returns True if added

# Get many
values = cache.get_many(["key1", "key2", "key3"])  # Returns dict

# Set many
cache.set_many({"key1": "val1", "key2": "val2"}, timeout=300)

# Delete
cache.delete("key")
cache.delete_many(["key1", "key2"])

# Clear all
cache.clear()

# Has key
cache.has_key("key")  # Returns True/False

# Touch (update timeout)
cache.touch("key", timeout=300)

# Incr / decr
cache.incr("counter")  # +1
cache.incr("counter", 5)  # +5
cache.decr("counter")  # -1
```

## Cache Key Prefixing

```python
# Global prefix
CACHES = {
    "default": {
        "BACKEND": "...",
        "KEY_PREFIX": "myapp_",
    }
}

# Per-call prefix (with custom cache)
from django.core.cache import caches
my_cache = caches["special"]
my_cache.set("key", "value")
```

## Cache Versioning

```python
CACHES = {
    "default": {
        "BACKEND": "...",
        "VERSION": 2,
    }
}

# Version is prepended to keys
cache.set("key", "value")  # Stored as "2:key"
cache.get("key")  # Looks for "2:key"

# Specific version
cache.set("key", "value", version=3)
cache.get("key", version=3)
```

## Async Cache (Django 6.0)

```python
import asyncio
from django.core.cache import cache

async def async_cache_operations():
    # Async set
    await cache.aset("key", "value", timeout=300)

    # Async get
    value = await cache.aget("key")

    # Async get or set
    value = await cache.aget_or_set("key", "value", timeout=300)

    # Async delete
    await cache.adelete("key")

    # Async get many
    values = await cache.aget_many(["key1", "key2"])

    # Async set many
    await cache.aset_many({"k1": "v1", "k2": "v2"}, timeout=300)

    # Async has key
    exists = await cache.ahas_key("key")

    # Async incr
    await cache.aincr("counter")

asyncio.run(async_cache_operations())
```

## Using Vary Headers

```python
from django.views.decorators.vary import vary_on_headers, vary_on_cookie

@vary_on_headers("User-Agent")
def article_list(request):
    # Different cache per User-Agent
    ...

@vary_on_cookie
def personalized_view(request):
    # Different cache per cookie
    ...
```

## Controlling Cache Headers

```python
from django.views.decorators.cache import never_cache, cache_control

@never_cache
def fresh_data(request):
    # Never cached
    ...

@cache_control(max_age=3600, public=True)
def public_data(request):
    # Cache for 1 hour, publicly cacheable
    ...

@cache_control(private=True, no_cache=True)
def private_data(request):
    # Private, must revalidate
    ...
```

## Downstream Caches

Use `Vary` header to tell downstream caches (CDN, proxy) to vary by:
```python
from django.shortcuts import get_object_or_404
from django.http import HttpResponse

def article_detail(request, pk):
    article = get_object_or_404(Article, pk=pk)
    response = HttpResponse(article.content)
    response["Vary"] = "Cookie, Accept-Encoding"
    return response
```
