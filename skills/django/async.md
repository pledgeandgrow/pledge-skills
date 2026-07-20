# Async Support — Django 6.0

## Overview

Django 6.0 provides full async support for views, middleware, ORM, and cache.

## Async Views

```python
import asyncio
from django.http import HttpResponse, JsonResponse

async def async_view(request):
    await asyncio.sleep(0.1)
    return HttpResponse("Hello from async view!")

async def async_with_orm(request):
    from myapp.models import Article
    # Use async ORM methods (aget, acreate, afilter, etc.)
    articles = []
    async for article in Article.objects.all():
        articles.append(article.title)
    return JsonResponse({"articles": articles})

async def async_create(request):
    from myapp.models import Article
    article = await Article.objects.acreate(
        title="Async Article",
        content="Created asynchronously",
    )
    return JsonResponse({"id": article.id})
```

## Async ORM Methods

```python
import asyncio
from myapp.models import Article

async def main():
    # Create
    article = await Article.objects.acreate(title="New", content="Content")

    # Get
    article = await Article.objects.aget(pk=1)

    # Count
    count = await Article.objects.acount()

    # Exists
    exists = await Article.objects.filter(published=True).aexists()

    # Iterate
    async for article in Article.objects.filter(published=True):
        print(article.title)

    # Update
    updated = await Article.objects.filter(pk=1).aupdate(title="Updated")

    # Delete
    deleted = await Article.objects.filter(pk=1).adelete()

    # Get or create
    article, created = await Article.objects.aget_or_create(
        title="Unique",
        defaults={"content": "Auto-created"},
    )

    # Update or create
    article, created = await Article.objects.aupdate_or_create(
        title="Unique",
        defaults={"content": "Updated"},
    )

    # First / Last
    first = await Article.objects.afirst()
    last = await Article.objects.alast()

    # Bulk create
    await Article.objects.abulk_create([
        Article(title="A", content="..."),
        Article(title="B", content="..."),
    ])

asyncio.run(main())
```

## Async Model Save/Delete

```python
async def async_save_example():
    article = Article(title="Async", content="Content")
    await article.asave()

    article.title = "Updated"
    await article.asave()

    await article.adelete()
```

## Async Middleware

```python
from django.utils.decorators import sync_and_async_middleware

@sync_and_async_middleware
def simple_middleware(get_response):
    async def async_middleware(request):
        # Async pre-processing
        response = await get_response(request)
        # Async post-processing
        return response

    def sync_middleware(request):
        response = get_response(request)
        return response

    # Detect if response handler is async
    import asyncio
    if asyncio.iscoroutinefunction(get_response):
        return async_middleware
    return sync_middleware
```

## Async Cache

```python
from django.core.cache import cache

async def async_cache_example():
    # Set
    await cache.aset("key", "value", timeout=300)

    # Get
    value = await cache.aget("key")

    # Get or set
    value = await cache.aget_or_set("key", "value", timeout=300)

    # Delete
    await cache.adelete("key")

    # Get many
    values = await cache.aget_many(["key1", "key2"])

    # Set many
    await cache.aset_many({"k1": "v1", "k2": "v2"}, timeout=300)

    # Has key
    exists = await cache.ahas_key("key")

    # Incr
    await cache.aincr("counter")

    # Clear
    await cache.aclear()
```

## Async Testing

```python
from django.test import AsyncClient, TransactionTestCase

class AsyncViewTest(TransactionTestCase):
    async def asyncSetUp(self):
        self.client = AsyncClient()

    async def test_async_view(self):
        response = await self.client.get("/api/data/")
        self.assertEqual(response.status_code, 200)

    async def test_async_post(self):
        response = await self.client.post(
            "/api/create/",
            data={"title": "Test"},
        )
        self.assertEqual(response.status_code, 201)
```

## Mixing Sync and Async

```python
from asgiref.sync import sync_to_async, async_to_sync

# Call sync code from async context
async def async_view(request):
    # Wrap sync ORM call
    articles = await sync_to_async(list)(Article.objects.all())
    return JsonResponse({"count": len(articles)})

# Call async code from sync context
def sync_view(request):
    result = async_to_sync(async_function)()
    return JsonResponse({"result": result})

# sync_to_async with thread_sensitive
@sync_to_async(thread_sensitive=True)
def expensive_sync_operation():
    # Runs in the main thread
    pass
```

## Async HTTP Client

```python
import aiohttp
import asyncio
from django.http import JsonResponse

async def fetch_external_api(request):
    async with aiohttp.ClientSession() as session:
        async with session.get("https://api.example.com/data") as resp:
            data = await resp.json()
    return JsonResponse(data)
```

## ASGI Server

```python
# myproject/asgi.py
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
application = get_asgi_application()
```

```bash
# Run with Uvicorn
uvicorn myproject.asgi:application --workers 4 --host 0.0.0.0 --port 8000

# Run with Daphne
daphne myproject.asgi:application --port 8000

# Run with Hypercorn
hypercorn myproject.asgi:application --workers 4 --bind 0.0.0.0:8000
```

## Important Notes

- **Use `TransactionTestCase`** for async tests (not `TestCase`)
- **Avoid `async_to_sync`** in async views — use `sync_to_async` instead
- **Database connections** are managed automatically in async context
- **`DJANGO_ALLOW_ASYNC_UNSAFE`** — allows sync ORM calls in async context (development only!)
- **WebSocket support** — use Django Channels for WebSocket functionality
