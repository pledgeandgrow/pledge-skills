# Flask Debugging and Logging

## Debugging Application Errors

### In Production

**Never** run the development server or enable the built-in debugger in production. The debugger allows executing arbitrary Python code from the browser — protected by a pin, but that should not be relied on for security.

Use instead:
- **Sentry** — error logging and tracking (`pip install sentry-sdk[flask]`)
- **Logging** — configure logging and notifications
- **External debugger** — temporarily, if you have server access (match `request.remote_addr` to your IP)

### The Built-In Debugger

The Werkzeug development server provides an interactive traceback in the browser when an unhandled error occurs.

Enabled by default in debug mode:

```bash
$ flask --app hello run --debug
```

From Python code:

```python
app.run(debug=True)
```

**Warning**: The debugger allows executing arbitrary Python code. Do not use in production.

### External Debuggers

IDE debuggers offer more powerful debugging — step through code before errors, remote mode, etc.

When using an external debugger, keep debug mode enabled but disable the built-in debugger and reloader:

```bash
$ flask --app hello run --debug --no-debugger --no-reload
```

From Python:

```python
app.run(debug=True, use_debugger=False, use_reloader=False)
```

To let all errors propagate to the external debugger (crashes the server on any error):

```python
app.run(
    debug=True,
    passthrough_errors=True,
    use_debugger=False,
    use_reloader=False
)
```

**Caveats** if not disabling built-in debugger/reloader:
- Built-in debugger catches unhandled exceptions before external debugger
- Reloader may cause unexpected reload during breakpoints
- Development server still catches unhandled exceptions if built-in debugger is disabled

## Logging

### Basic Configuration

Configure logging **as early as possible** when the program starts. If `app.logger` is accessed before configuration, Flask adds a default handler.

```python
from logging.config import dictConfig

dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://flask.logging.wsgi_errors_stream',
        'formatter': 'default'
    }},
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})

app = Flask(__name__)
```

### Default Configuration

If you don't configure logging, Flask adds a `StreamHandler` to `app.logger`:
- During requests: writes to `environ['wsgi.errors']` (usually `sys.stderr`)
- Outside requests: writes to `sys.stderr`

### Removing the Default Handler

```python
from flask.logging import default_handler

app.logger.removeHandler(default_handler)
```

### Email Errors to Admins

```python
import logging
from logging.handlers import SMTPHandler

mail_handler = SMTPHandler(
    mailhost='127.0.0.1',
    fromaddr='server-error@example.com',
    toaddrs=['admin@example.com'],
    subject='Application Error'
)
mail_handler.setLevel(logging.ERROR)
mail_handler.setFormatter(logging.Formatter(
    '[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
))

if not app.debug:
    app.logger.addHandler(mail_handler)
```

### Injecting Request Information

Subclass `logging.Formatter` to add request data:

```python
from flask import has_request_context, request
from flask.logging import default_handler

class RequestFormatter(logging.Formatter):
    def format(self, record):
        if has_request_context():
            record.url = request.url
            record.remote_addr = request.remote_addr
        else:
            record.url = None
            record.remote_addr = None
        return super().format(record)

formatter = RequestFormatter(
    '[%(asctime)s] %(remote_addr)s requested %(url)s\n'
    '%(levelname)s in %(module)s: %(message)s'
)
default_handler.setFormatter(formatter)
mail_handler.setFormatter(formatter)
```

### Other Libraries

Add handlers to the root logger to capture messages from all libraries:

```python
from flask.logging import default_handler

root = logging.getLogger()
root.addHandler(default_handler)
root.addHandler(mail_handler)
```

Or configure specific loggers:

```python
for logger in (
    logging.getLogger(app.name),
    logging.getLogger('sqlalchemy'),
    logging.getLogger('other_package'),
):
    logger.addHandler(default_handler)
    logger.addHandler(mail_handler)
```
