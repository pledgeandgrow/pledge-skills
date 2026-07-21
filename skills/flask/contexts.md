# Flask Contexts and Application Lifecycle

## The Application Context

### Purpose

The application context provides access to the `current_app` proxy, avoiding circular import issues. Instead of importing the `app` instance directly, use `current_app` which points to the application handling the current activity.

Flask automatically pushes an application context when:
- Handling a request (view functions, error handlers)
- Running CLI commands (`@app.cli.command()`)

### Lifetime

- Created and destroyed as necessary
- Pushed before request context, popped after request context
- Typically same lifetime as a request

### Manually Push a Context

Accessing `current_app` outside an application context raises:

```
RuntimeError: Working outside of application context.
```

Push manually:

```python
def create_app():
    app = Flask(__name__)
    with app.app_context():
        init_db()
    return app
```

If you see this error outside configuration code, move the code into a view function or CLI command.

### Storing Data

Use the `g` object for storing common data during a request or CLI command. It's a simple namespace object with the same lifetime as the application context.

**Note**: `g` stands for "global" — global within a context, not between requests. Use `session` or a database for data across requests.

Common pattern for resource management:

```python
from flask import g

def get_db():
    if 'db' not in g:
        g.db = connect_to_database()
    return g.db

@app.teardown_appcontext
def teardown_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()
```

Create a context local proxy:

```python
from werkzeug.local import LocalProxy
db = LocalProxy(get_db)
```

### Events and Signals

- `teardown_appcontext()` functions called when context is popped
- Signals: `appcontext_pushed`, `appcontext_tearing_down`, `appcontext_popped`

## The Request Context

### Purpose

Flask creates a `Request` object from the WSGI environment. Since a worker handles one request at a time, request data is global to that worker — Flask calls this "context local".

The `request` proxy points to the current request object.

### Lifetime

- Request context is pushed (which also pushes an app context)
- When request ends, request context is popped, then app context
- Context is unique to each thread/worker — `request` cannot be passed to another thread
- Implemented using Python's `contextvars` and Werkzeug's `LocalProxy`

### Manually Push a Context

Accessing `request` outside a request context raises:

```
RuntimeError: Working outside of request context.
```

Use `test_request_context()` for testing:

```python
def generate_report(year):
    format = request.args.get("format")
    ...

with app.test_request_context(
    "/make_report/2017", query_string={"format": "short"}
):
    generate_report()
```

### How the Context Works

1. `Flask.wsgi_app()` is called for each request
2. `RequestContext` is created and pushed (creates `AppContext` first if needed)
3. `current_app`, `g`, `request`, `session` proxies become available
4. After dispatch, request context is popped, then app context
5. `teardown_request()` and `teardown_appcontext()` execute before popping

Contexts work like stacks — other contexts can be pushed during a request (advanced pattern for internal redirects).

### Callbacks and Errors

Request dispatch stages (all with active contexts):

1. **`before_request()`** functions called — if one returns a value, others are skipped and the return value becomes the response
2. **View function** called (if `before_request` didn't return a response)
3. Return value converted to **`Response`** object
4. **`after_request()`** functions called — each can modify the response
5. Contexts popped — **`teardown_request()`** and **`teardown_appcontext()`** called (even on unhandled exceptions)

Error handling:
- Exceptions matched with `errorhandler()` functions
- No handler → 500 Internal Server Error
- Debug mode → exceptions propagated to WSGI server (interactive debugger)

Blueprints can add blueprint-specific handlers for these events.

### Teardown Callbacks

Teardown callbacks are independent of request dispatch — called by contexts when popped. They run even if:
- There was an unhandled exception
- Contexts were manually pushed

No guarantee other dispatch parts ran first — write teardown functions to be self-contained.

During testing, use `test_client()` as a `with` block to preserve contexts:

```python
with app.test_client() as client:
    client.get('/')
    # contexts still active here
    print(request.path)
# contexts popped after with block
```

### Signals

| Signal | When |
|--------|------|
| `request_started` | Before `before_request()` functions |
| `request_finished` | After `after_request()` functions |
| `got_request_exception` | When exception begins being handled, before `errorhandler()` |
| `request_tearing_down` | After `teardown_request()` functions |

### Notes on Proxies

Flask objects like `request`, `session`, `current_app`, and `g` are proxies. Important notes:

- Proxies cannot fake their type as the actual object — use the proxied object for instance checks
- Need the underlying object for signals or background threads

Access the underlying object:

```python
app = current_app._get_current_object()
my_signal.send(app)
```

## Application Structure and Lifecycle

### Application Setup

The "application setup phase" is code outside view functions — creating the app, configuring, registering routes, blueprints, extensions.

```python
from flask import Flask

app = Flask(__name__)
app.config.from_mapping(SECRET_KEY="dev")
app.config.from_prefixed_env()

@app.route("/")
def index():
    return "Hello, World!"
```

**All setup must complete before serving.** WSGI servers divide work across workers — changes in one worker can't propagate to others.

Flask shows an error if setup methods are called after the first request:

```
The setup method 'route' can no longer be called on the application.
```

Do **not** modify the Flask app or Blueprint objects from within view functions:
- Adding routes, error handlers, before_request
- Registering blueprints
- Loading configuration
- Setting up Jinja environment
- Setting session interface or JSON provider
- Creating/initializing extensions

### Serving the Application

Flask is a WSGI application. The WSGI server handles HTTP and calls Flask.

Request flow:
1. Client makes HTTP request
2. WSGI server receives request
3. Server converts HTTP to WSGI `environ` dict
4. Server calls Flask (the WSGI application) with `environ`
5. Flask routes to view function, handles errors
6. Flask converts return value to WSGI response data
7. Server creates and sends HTTP response
8. Client receives response

#### Middleware

Middleware wraps a WSGI application. Common example: Werkzeug's `ProxyFix`:

```python
from werkzeug.middleware.proxy_fix import ProxyFix
app.wsgi_app = ProxyFix(app.wsgi_app)
```

### How a Request is Handled (Full Lifecycle)

1. WSGI server calls `Flask.wsgi_app()`
2. `RequestContext` created (converts environ to `Request`), `AppContext` created
3. App context pushed → `current_app`, `g` available
4. `appcontext_pushed` signal sent
5. Request context pushed → `request`, `session` available
6. Session opened (loads existing data via `session_interface`)
7. URL matched against registered rules (404/405/redirect stored if no match)
8. `request_started` signal sent
9. `url_value_preprocessor()` functions called
10. `before_request()` functions called (return value = response, skip rest)
11. If URL didn't match, error raised now
12. View function called → returns response value
13. If exception raised, matching `errorhandler()` called
14. Response value converted to `Response` object
15. `after_this_request()` functions called, then cleared
16. `after_request()` functions called (can modify response)
17. Session saved via `session_interface`
18. `request_finished` signal sent
19. Unhandled exceptions converted to 500 (HTTP exceptions keep their code)
20. Response status, headers, body returned to WSGI server
21. `teardown_request()` functions called
22. `request_tearing_down` signal sent
23. Request context popped → `request`, `session` unavailable
24. `teardown_appcontext()` functions called
25. `appcontext_tearing_down` signal sent
26. App context popped → `current_app`, `g` unavailable
27. `appcontext_popped` signal sent
