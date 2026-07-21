# Async with Gevent in Flask

Gevent provides an event loop based on greenlets (lightweight coroutines) that can make Flask applications concurrent without changing the code structure.

## Enabling Gevent

Apply gevent's monkey-patching as early as possible in your code. This enables gevent's event loop and converts many Python internals to run inside it.

```python
# At the top of your project's module or __init__.py
import gevent.monkey
gevent.monkey.patch_all()
```

### Production Deployment

Use Gunicorn or uWSGI with a gevent worker:

```bash
# Gunicorn with gevent worker
$ gunicorn -k gevent -w 1 'myapp:create_app()'

# uWSGI with gevent
$ uwsgi --http :8000 --gevent 100 --module myapp
```

### Concurrent Tasks

Use `gevent.spawn()` to run tasks concurrently within your code:

```python
import gevent

@app.post("/send")
def send_email():
    gevent.spawn(email.send, to="example@example.example", text="example")
    return "Email is being sent."
```

### Accessing Flask Context in Spawned Functions

If you need to access `request` or other Flask context globals within a spawned function, use `stream_with_context()` or `copy_current_request_context()`:

```python
from flask import stream_with_context, copy_current_request_context

@stream_with_context
def process_data():
    # request is available here
    data = request.json
    ...
```

Prefer passing the exact data you need when spawning, rather than using the decorators:

```python
# Preferred: pass data explicitly
gevent.spawn(email.send, to=email_address, text=body)

# Less preferred: use context decorator
@copy_current_request_context
def process_with_context():
    data = request.json
    ...
gevent.spawn(process_with_context)
```

### Requirements

- `greenlet>=1.0` is required when using gevent
- `PyPy>=7.3.7` is required when using PyPy

## Combining with async/await

Gevent's patching does not interact well with Flask's built-in asyncio support. To use both gevent and asyncio in the same app, override `flask.Flask.async_to_sync()` to run async functions inside gevent:

```python
import gevent.monkey
gevent.monkey.patch_all()

import asyncio
from flask import Flask, request

loop = asyncio.EventLoop()
gevent.spawn(loop.run_forever)

class GeventFlask(Flask):
    def async_to_sync(self, func):
        def run(*args, **kwargs):
            coro = func(*args, **kwargs)
            future = asyncio.run_coroutine_threadsafe(coro, loop)
            return future.result()
        return run

app = GeventFlask(__name__)

@app.get("/")
async def greet():
    await asyncio.sleep(1)
    return f"Hello, {request.args.get('name', 'World')}!"
```

This starts an asyncio event loop in a gevent worker. Async functions are scheduled on that event loop via `run_coroutine_threadsafe`.

This may still have limitations and may need modification when using other asyncio implementations.

## libuv

libuv is another event loop implementation that gevent supports. There's also [uvloop](https://uvloop.readthedocs.io/) that enables libuv in asyncio. If you want to use libuv, use gevent's support, not uvloop.

To enable gevent's libuv support, add the following **before** `gevent.monkey.patch_all()`:

```python
import gevent
gevent.config.loop = "libuv"

import gevent.monkey
gevent.monkey.patch_all()
```

## Key Points

- Apply `gevent.monkey.patch_all()` as early as possible
- Use Gunicorn or uWSGI with gevent workers in production
- Use `gevent.spawn()` for concurrent tasks
- Pass data explicitly to spawned functions rather than relying on context decorators
- Override `async_to_sync()` to combine gevent with async/await
- Use gevent's libuv support (not uvloop) if you need libuv
