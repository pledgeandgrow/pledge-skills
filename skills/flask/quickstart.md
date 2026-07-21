# Flask Quickstart

## A Minimal Application

```python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
```

Key steps:
1. Import the `Flask` class — an instance is the WSGI application
2. Create an instance with `__name__` as the first argument (needed to locate templates/static files)
3. Use `@app.route()` decorator to bind a URL to a function
4. The function returns the response body (default content type is HTML)

Run with:
```bash
$ flask --app hello run
 * Serving Flask app 'hello'
 * Running on http://127.0.0.1:5000 (Press CTRL+C to quit)
```

If the file is named `app.py` or `wsgi.py`, `--app` is not required.

**Externally visible server**: Use `--host=0.0.0.0` to listen on all public IPs.

## Debug Mode

```bash
$ flask --app hello run --debug
```

Debug mode enables:
- Automatic reload on code changes
- Interactive debugger in the browser on errors

**Warning**: The debugger allows executing arbitrary Python code from the browser. Never use in production.

## HTML Escaping

Use `markupsafe.escape()` for user-provided values:

```python
from flask import request
from markupsafe import escape

@app.route("/hello")
def hello():
    name = request.args.get("name", "Flask")
    return f"Hello, {escape(name)}!"
```

Jinja templates escape automatically.

## Routing

```python
@app.route('/')
def index():
    return 'Index Page'

@app.route('/hello')
def hello():
    return 'Hello, World'
```

### Variable Rules

`<variable_name>` — passed as keyword argument. Use converters: `<converter:variable_name>`.

```python
@app.route('/user/<username>')
def show_user_profile(username):
    return f'User {username}'

@app.route('/post/<int:post_id>')
def show_post(post_id):
    return f'Post {post_id}'

@app.route('/path/<path:subpath>')
def show_subpath(subpath):
    return f'Subpath {subpath}'
```

**Converter types**:
- `string` (default) — any text without a slash
- `int` — positive integers
- `float` — positive floating point values
- `path` — like string, accepts slashes
- `uuid` — UUID strings

### Unique URLs / Redirection Behavior

- `/projects/` (trailing slash) — accessing `/projects` redirects to `/projects/`
- `/about` (no trailing slash) — accessing `/about/` produces 404

### URL Building

Use `url_for()` to build URLs by function name:

```python
from flask import url_for

with app.test_request_context():
    print(url_for('index'))           # /
    print(url_for('login'))           # /login
    print(url_for('login', next='/')) # /login?next=/
    print(url_for('profile', username='John Doe'))  # /user/John%20Doe
```

Advantages over hard-coding:
1. More descriptive
2. Change URLs in one place
3. Handles escaping of special characters
4. Always absolute paths
5. Handles application root correctly

### HTTP Methods

Default is GET only. Use `methods` argument:

```python
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        return do_the_login()
    else:
        return show_the_login_form()
```

Shorthand decorators:
```python
@app.get('/login')
def login_get():
    return show_the_login_form()

@app.post('/login')
def login_post():
    return do_the_login()
```

GET automatically adds HEAD support. OPTIONS is automatically implemented.

## Static Files

Create a `static` folder — available at `/static`:

```python
url_for('static', filename='style.css')
```

File stored at `static/style.css`.

## Rendering Templates

```python
from flask import render_template

@app.route('/hello/')
@app.route('/hello/<name>')
def hello(name=None):
    return render_template('hello.html', person=name)
```

Flask looks for templates in the `templates` folder:
- Module: `/application.py` + `/templates/hello.html`
- Package: `/application/__init__.py` + `/templates/hello.html`

Template example:
```html
<!doctype html>
<title>Hello from Flask</title>
{% if person %}
  <h1>Hello {{ person }}!</h1>
{% else %}
  <h1>Hello, World!</h1>
{% endif %}
```

Templates have access to: `config`, `request`, `session`, `g`, `url_for()`, `get_flashed_messages()`.

Autoescaping is enabled for `.html`, `.htm`, `.xml`, `.xhtml` templates. Use `Markup` class or `|safe` filter for trusted HTML.

## Accessing Request Data

The global `request` object provides access to request data. It's a context local (thread-safe proxy).

### Context Locals

For testing without a real request:
```python
with app.test_request_context('/hello', method='POST'):
    assert request.path == '/hello'
    assert request.method == 'POST'
```

### The Request Object

```python
from flask import request

@app.route('/login', methods=['POST', 'GET'])
def login():
    error = None
    if request.method == 'POST':
        if valid_login(request.form['username'], request.form['password']):
            return log_the_user_in(request.form['username'])
        else:
            error = 'Invalid username/password'
    return render_template('login.html', error=error)
```

- `request.form` — POST/PUT form data (KeyError → 400 Bad Request)
- `request.args` — URL query parameters (use `.get()` to avoid KeyError)

### File Uploads

```python
from flask import request

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        f = request.files['the_file']
        f.save('/var/www/uploads/uploaded_file.txt')
```

Use `secure_filename()` from Werkzeug:
```python
from werkzeug.utils import secure_filename
file.save(f"/var/www/uploads/{secure_filename(file.filename)}")
```

### Cookies

Reading:
```python
username = request.cookies.get('username')
```

Setting (on response object):
```python
from flask import make_response

resp = make_response(render_template(...))
resp.set_cookie('username', 'the username')
return resp
```

## Redirects and Errors

```python
from flask import abort, redirect, url_for

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login')
def login():
    abort(401)
    this_is_never_executed()
```

Custom error pages:
```python
@app.errorhandler(404)
def page_not_found(error):
    return render_template('page_not_found.html'), 404
```

## About Responses

Return value conversion logic:
1. Response object → returned directly
2. String → response with 200 OK, text/html mimetype
3. Iterator/generator → streaming response
4. dict or list → `jsonify()` called
5. Tuple → `(response, status)`, `(response, headers)`, or `(response, status, headers)`
6. Otherwise → treated as WSGI application

Use `make_response()` to modify the response:
```python
from flask import make_response

resp = make_response(render_template('error.html'), 404)
resp.headers['X-Something'] = 'A value'
return resp
```

### APIs with JSON

```python
@app.route("/me")
def me_api():
    user = get_current_user()
    return {
        "username": user.username,
        "theme": user.theme,
        "image": url_for("user_image", filename=user.image),
    }

@app.route("/users")
def users_api():
    users = get_all_users()
    return [user.to_json() for user in users]
```

For complex types, use a serialization library.

## Sessions

```python
from flask import session

app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

@app.route('/')
def index():
    if 'username' in session:
        return f'Logged in as {session["username"]}'
    return 'You are not logged in'

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        session['username'] = request.form['username']
        return redirect(url_for('index'))
    return '''<form method="post">
        <p><input type=text name=username>
        <p><input type=submit value=Login>
    </form>'''

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))
```

Generate secret key:
```bash
$ python -c 'import secrets; print(secrets.token_hex())'
```

Sessions are cookie-based and cryptographically signed. Users can read but not modify cookie contents. For server-side sessions, use Flask extensions.

## Message Flashing

```python
flash('Logged in successfully')
```

In templates: `get_flashed_messages()`

## Logging

```python
app.logger.debug('A value for debugging')
app.logger.warning('A warning occurred (%d apples)', 42)
app.logger.error('An error occurred')
```

The logger is a standard Python `logging.Logger`.

## Hooking in WSGI Middleware

```python
from werkzeug.middleware.proxy_fix import ProxyFix
app.wsgi_app = ProxyFix(app.wsgi_app)
```

Wrap `app.wsgi_app` (not `app`) so `app` still points to your Flask application.

## Using Flask Extensions

Extensions are packages for common tasks. Example: Flask-SQLAlchemy. See Extensions documentation.
