# Flask Signals

Flask uses the **blinker** library for signals — a lightweight event system for decoupled notifications.

## Core Signals

Flask's built-in signals (see the Application Structure and Lifecycle page for execution order):

| Signal | When |
|--------|------|
| `appcontext_pushed` | App context pushed |
| `appcontext_tearing_down` | App context being torn down |
| `appcontext_popped` | App context popped |
| `request_started` | Before `before_request()` functions |
| `request_finished` | After `after_request()` functions |
| `got_request_exception` | Exception begins being handled, before `errorhandler()` |
| `request_tearing_down` | After `teardown_request()` functions |
| `template_rendered` | Template rendered |
| `before_render_template` | Before template rendering |

## Subscribing to Signals

Use `connect()` to subscribe, `disconnect()` to unsubscribe:

```python
from flask import template_rendered
from contextlib import contextmanager

@contextmanager
def captured_templates(app):
    recorded = []
    def record(sender, template, context, **extra):
        recorded.append((template, context))
    template_rendered.connect(record, app)
    try:
        yield recorded
    finally:
        template_rendered.disconnect(record, app)
```

Usage with test client:

```python
with captured_templates(app) as templates:
    rv = app.test_client().get('/')
    assert rv.status_code == 200
    assert len(templates) == 1
    template, context = templates[0]
    assert template.name == 'index.html'
    assert len(context['items']) == 10
```

**Important**: Always include `**extra` in your handler signature so calls don't fail if Flask adds new arguments.

For all core Flask signals, the sender is the application. Always provide a sender unless you want to listen to all applications (especially important for extensions).

### `connected_to()` helper

```python
from flask import template_rendered

def captured_templates(app, recorded, **extra):
    def record(sender, template, context):
        recorded.append((template, context))
    return template_rendered.connected_to(record, app)
```

## Creating Signals

Use blinker's `Namespace`:

```python
from blinker import Namespace

my_signals = Namespace()
model_saved = my_signals.signal('model-saved')
```

The signal name makes it unique and simplifies debugging. Access with `model_saved.name`.

## Sending Signals

Use `send()`:

```python
class Model(object):
    ...
    def save(self):
        model_saved.send(self)
```

**Choosing a sender**:
- From a class: pass `self`
- From a function: pass `current_app._get_current_object()`

**Never pass `current_app` directly as sender** — it's a proxy, not the real application object. Always use `current_app._get_current_object()`.

## Signals and Flask's Request Context

Signals fully support the request context. Context-local variables (`flask.g`, `request`, `session`) are consistently available between `request_started` and `request_finished`.

Note limitations with `request_tearing_down` — the context may be partially torn down.

## Decorator-Based Signal Subscriptions

Use `connect_via()` decorator:

```python
from flask import template_rendered

@template_rendered.connect_via(app)
def when_template_rendered(sender, template, context, **extra):
    print(f'Template {template.name} is rendered with {context}')
```
