# Handling Application Errors

## Error Logging Tools

Use **Sentry** for error tracking. Install:

```bash
$ pip install sentry-sdk[flask]
```

Initialize:

```python
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init('YOUR_DSN_HERE', integrations=[FlaskIntegration()])
```

Sentry aggregates duplicate errors, captures stack traces and local variables, and sends notifications based on new errors or frequency thresholds.

## Error Handlers

When an error occurs, Flask returns an appropriate HTTP status code:
- **400-499**: Client request errors
- **500-599**: Server/application errors

An error handler is a function that returns a response when an error is raised, similar to how a view returns a response for a matched URL.

**Important**: The status code of the response is not automatically set to the handler's code. Always provide the appropriate HTTP status code in the response.

### Registering

```python
import werkzeug.exceptions

@app.errorhandler(werkzeug.exceptions.BadRequest)
def handle_bad_request(e):
    return 'bad request!', 400

# Or without decorator:
app.register_error_handler(400, handle_bad_request)
```

`HTTPException` subclasses and their HTTP codes are interchangeable when registering handlers.

**Non-standard HTTP codes**: Define a subclass of `HTTPException`:

```python
class InsufficientStorage(werkzeug.exceptions.HTTPException):
    code = 507
    description = 'Not enough storage space.'

app.register_error_handler(InsufficientStorage, handle_507)
raise InsufficientStorage()
```

Handlers can be registered for **any exception class**, not just `HTTPException` subclasses.

### Handling

Default exceptions:
- **500 Internal Server Error** (`InternalServerError`) — unhandled exceptions
- **404 Not Found** (`NotFound`) — unregistered route
- **405 Method Not Allowed** (`MethodNotAllowed`) — wrong HTTP method

Flask looks up handlers by code first, then by class hierarchy (most specific handler wins).

Blueprint handlers take precedence over app-level handlers for requests handled by that blueprint. Blueprints cannot handle 404 routing errors (occur before blueprint is determined).

### Generic Exception Handlers

Handler for `HTTPException` — useful for converting HTML errors to JSON:

```python
from flask import json
from werkzeug.exceptions import HTTPException

@app.errorhandler(HTTPException)
def handle_exception(e):
    response = e.get_response()
    response.data = json.dumps({
        "code": e.code,
        "name": e.name,
        "description": e.description,
    })
    response.content_type = "application/json"
    return response
```

Handler for `Exception` — catches all unhandled errors:

```python
from werkzeug.exceptions import HTTPException

@app.errorhandler(Exception)
def handle_exception(e):
    if isinstance(e, HTTPException):
        return e
    return render_template("500_generic.html", e=e), 500
```

Error handlers respect the exception class hierarchy. If both `HTTPException` and `Exception` handlers are registered, `HTTPException` subclasses use the more specific `HTTPException` handler.

### Unhandled Exceptions

- No handler → 500 Internal Server Error
- Handler for `InternalServerError` → invoked with `InternalServerError` instance
- Original error available as `e.original_exception`
- In debug mode, 500 handler is not used — interactive debugger is shown instead

## Custom Error Pages

Use `abort()` to raise HTTP errors:

```python
from flask import abort, render_template, request

@app.route("/profile")
def user_profile():
    username = request.args.get("username")
    if username is None:
        abort(400)
    user = get_user(username=username)
    if user is None:
        abort(404)
    return render_template("profile.html", user=user)
```

### 404 Page Not Found

```python
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404
```

With application factory:

```python
def create_app():
    app = Flask(__name__)
    app.register_error_handler(404, page_not_found)
    return app
```

### 500 Internal Server Error

```python
@app.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500
```

With blueprints:

```python
blog = Blueprint('blog', __name__)

@blog.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500

# Or:
blog.register_error_handler(500, internal_server_error)
```

## Blueprint Error Handlers

404 and 405 handlers on blueprints are only invoked from `raise`/`abort` within the blueprint's view functions — not from invalid URL access.

For URL-prefix-based error handling, define at application level:

```python
@app.errorhandler(404)
def page_not_found(e):
    if request.path.startswith('/blog/'):
        return render_template("blog/404.html"), 404
    return render_template("404.html"), 404

@app.errorhandler(405)
def method_not_allowed(e):
    if request.path.startswith('/api/'):
        return jsonify(message="Method Not Allowed"), 405
    return render_template("405.html"), 405
```

## Returning API Errors as JSON

```python
from flask import abort, jsonify

@app.errorhandler(404)
def resource_not_found(e):
    return jsonify(error=str(e)), 404

@app.route("/cheese")
def get_one_cheese():
    resource = get_resource()
    if resource is None:
        abort(404, description="Resource not found")
    return jsonify(resource)
```

### Custom Exception Classes for APIs

```python
from flask import jsonify, request

class InvalidAPIUsage(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        super().__init__()
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

@app.errorhandler(InvalidAPIUsage)
def invalid_api_usage(e):
    return jsonify(e.to_dict()), e.status_code

@app.route("/api/user")
def user_api():
    user_id = request.args.get("user_id")
    if not user_id:
        raise InvalidAPIUsage("No user id provided!")
    user = get_user(user_id=user_id)
    if not user:
        raise InvalidAPIUsage("No such user!", status_code=404)
    return jsonify(user.to_dict())
```

## Logging

See [Logging](https://flask.palletsprojects.com/en/stable/logging/) for information about logging exceptions.

## Debugging

See [Debugging Application Errors](https://flask.palletsprojects.com/en/stable/debugging/) for debugging in development and production.
