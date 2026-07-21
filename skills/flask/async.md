# Flask Async and Await

Flask supports `async` view functions, allowing the use of `async`/`await` syntax within views.

## Basic Usage

```python
@app.route("/data")
async def get_data():
    data = await fetch_data_from_api()
    return jsonify(data)
```

## Performance

Async functions require an event loop. Flask, as a WSGI application, uses one worker per request/response cycle. When an async view is called:

1. Flask starts an event loop in a thread
2. Runs the view function there
3. Returns the result

**Each request still ties up one worker**, even for async views. The benefit is running async code within a view (concurrent database queries, HTTP requests, etc.).

Async is **not inherently faster** than sync code. It's beneficial for concurrent IO-bound tasks, not CPU-bound tasks. Traditional Flask views remain appropriate for most use cases.

## Background Tasks

Async functions run in an event loop until they complete, at which point the loop stops. Spawned tasks that haven't completed are **cancelled**.

You **cannot** spawn background tasks via `asyncio.create_task` in a standard Flask view.

### Workarounds

- Use a **task queue** (Celery, RQ) for background work
- Serve Flask with an **ASGI server** using the `asgiref` `WsgiToAsgi` adapter — this creates a continual event loop

## When to Use Quart Instead

Flask's async support is less performant than async-first frameworks due to its WSGI-based implementation.

**Quart** is a reimplementation of Flask based on ASGI instead of WSGI. It handles:
- Many concurrent requests
- Long-running requests
- Websockets

Without requiring multiple worker processes or threads.

**Gevent** with Flask is another option — it patches low-level Python functions for async-like behavior, whereas `async`/`await` and ASGI use standard modern Python capabilities.

Choose based on your project's specific needs.

## Extensions

Flask extensions predating async support may not work with async views — their decorators won't `await` the function or be awaitable.

### Extension Author Support

Use `flask.Flask.ensure_sync()` to support both sync and async functions:

```python
from functools import wraps
from flask import current_app

def extension(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        # Extension logic...
        return current_app.ensure_sync(func)(*args, **kwargs)
    return wrapper
```

Check extension changelogs for async support status.

## Other Event Loops

Flask currently only supports **asyncio**. Override `flask.Flask.ensure_sync()` to use a different library (e.g., Gevent).

See [Combining with async/await](https://flask.palletsprojects.com/en/stable/gevent/) for examples.
