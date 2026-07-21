# Patterns for Flask

Common patterns and best practices for Flask applications, covering application structure, databases, file uploads, caching, view decorators, forms, templates, JavaScript integration, streaming, background tasks, and more.

## Large Applications as Packages

Convert a single-file app into a package by creating a folder with `__init__.py`:

```
/yourapplication
    pyproject.toml
    /yourapplication
        __init__.py
        views.py
        /static
        /templates
```

`__init__.py`:
```python
from flask import Flask
app = Flask(__name__)
import yourapplication.views
```

`views.py`:
```python
from yourapplication import app

@app.route('/')
def index():
    return 'Hello World!'
```

Key rules:
- Flask app creation must be in `__init__.py` (so `__name__` resolves correctly)
- View modules must be imported in `__init__.py` after app creation
- Circular imports are fine here since views are imported at the bottom

Install with `pip install -e .` and run with `flask --app yourapplication run`.

## Application Factories

Use a function to create the application, enabling multiple instances and test configurations:

```python
def create_app(config_filename):
    app = Flask(__name__)
    app.config.from_pyfile(config_filename)
    
    from yourapplication.model import db
    db.init_app(app)
    
    from yourapplication.views.admin import admin
    from yourapplication.views.frontend import frontend
    app.register_blueprint(admin)
    app.register_blueprint(frontend)
    
    return app
```

Use `current_app` instead of the app object in blueprints:
```python
from flask import current_app, Blueprint, render_template
admin = Blueprint('admin', __name__, url_prefix='/admin')

@admin.route('/')
def index():
    return render_template(current_app.config['INDEX_TEMPLATE'])
```

Flask auto-detects factories named `create_app` or `make_app`. Pass arguments:
```bash
$ flask --app 'hello:create_app(local_auth=True)' run
```

Factory improvements:
- Accept config values for unit tests without filesystem files
- Call blueprint setup functions for before/after request hooks
- Add WSGI middleware during creation

## Application Dispatching

### Combining Applications

Use `DispatcherMiddleware` to run multiple Flask apps at different URL prefixes:

```python
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from frontend_app import application as frontend
from backend_app import application as backend
application = DispatcherMiddleware(frontend, {'/backend': backend})
```

### Dispatch by Subdomain

Create per-subdomain application instances dynamically:

```python
from threading import Lock

class SubdomainDispatcher:
    def __init__(self, domain, create_app):
        self.domain = domain
        self.create_app = create_app
        self.lock = Lock()
        self.instances = {}

    def get_application(self, host):
        host = host.split(':')[0]
        assert host.endswith(self.domain), 'Configuration error'
        subdomain = host[:-len(self.domain)].rstrip('.')
        with self.lock:
            app = self.instances.get(subdomain)
            if app is None:
                app = self.create_app(subdomain)
                self.instances[subdomain] = app
            return app

    def __call__(self, environ, start_response):
        app = self.get_application(environ['HTTP_HOST'])
        return app(environ, start_response)
```

### Dispatch by Path

Similar to subdomain dispatch but uses URL path prefix instead of host header. Falls back to a default app if the creator function returns `None`.

## URL Processors

### Internationalized Application URLs

Use `url_defaults()` and `url_value_preprocessor()` to handle locale codes automatically:

```python
@app.url_defaults
def add_language_code(endpoint, values):
    if 'lang_code' in values or not g.lang_code:
        return
    if app.url_map.is_endpoint_expecting(endpoint, 'lang_code'):
        values['lang_code'] = g.lang_code

@app.url_value_preprocessor
def pull_lang_code(endpoint, values):
    g.lang_code = values.pop('lang_code', None)

@app.route('/<lang_code>/')
def index():
    ...

@app.route('/<lang_code>/about')
def about():
    ...
```

### Internationalized Blueprint URLs

Blueprints simplify this with per-blueprint URL processors:

```python
bp = Blueprint('frontend', __name__, url_prefix='/<lang_code>')

@bp.url_defaults
def add_language_code(endpoint, values):
    values.setdefault('lang_code', g.lang_code)

@bp.url_value_preprocessor
def pull_lang_code(endpoint, values):
    g.lang_code = values.pop('lang_code')

@bp.route('/')
def index():
    ...
```

## Using SQLite 3 with Flask

### Connect on Demand

```python
import sqlite3
from flask import current_app, g

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row
    return g.db

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()
```

### Easy Querying

```python
def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv
```

Usage:
```python
for user in query_db('select * from users'):
    print(user['username'], 'has the id', user['user_id'])
```

Use `?` placeholders for parameters — never string formatting (SQL injection prevention).

### Initial Schema

```python
def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()
```

## SQLAlchemy in Flask

### Flask-SQLAlchemy Extension (Recommended)

Use [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/) for the easiest setup.

### Declarative Approach

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker, declarative_base

engine = create_engine('sqlite:////tmp/test.db')
db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()

def init_db():
    import yourapplication.models
    Base.metadata.create_all(bind=engine)
```

Teardown:
```python
@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()
```

Model:
```python
from sqlalchemy import Column, Integer, String
from yourapplication.database import Base

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True)
    email = Column(String(120), unique=True)
```

### Manual ORM

Define tables and classes separately, then map them together using `mapper()`.

### SQL Abstraction Layer

Use `create_engine` and `MetaData` directly for raw SQL access without ORM.

## File Uploads

### Basic Upload

```python
import os
from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = '/path/to/the/uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return redirect(url_for('download_file', name=filename))
    return render_template('upload.html')
```

Always use `secure_filename()` to sanitize uploaded filenames:
```python
>>> secure_filename('../../../../home/username/.bashrc')
'home_username_.bashrc'
```

### Serving Uploaded Files

```python
from flask import send_from_directory

@app.route('/uploads/<name>')
def download_file(name):
    return send_from_directory(app.config["UPLOAD_FOLDER"], name)
```

For `build_only` (no view function, just URL generation):
```python
app.add_url_rule("/uploads/<name>", endpoint="download_file", build_only=True)
```

### Limiting File Size

```python
app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000  # 16 MB
```

Larger files raise `RequestEntityTooLarge`.

## Caching

Flask itself does not provide caching. Use [Flask-Caching](https://flask-caching.readthedocs.io/en/latest/):

```python
from flask_caching import Cache

cache = Cache()

def create_app():
    app = Flask(__name__)
    app.config['CACHE_TYPE'] = 'SimpleCache'
    cache.init_app(app)
    return app
```

## View Decorators

### Login Required Decorator

```python
from functools import wraps
from flask import g, request, redirect, url_for

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if g.user is None:
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function
```

Apply as innermost decorator (route is outermost):
```python
@app.route('/secret_page')
@login_required
def secret_page():
    pass
```

### Caching Decorator

```python
from functools import wraps
from flask import request

def cached(timeout=5 * 60, key='view/{}'):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            cache_key = key.format(request.path)
            rv = cache.get(cache_key)
            if rv is not None:
                return rv
            rv = f(*args, **kwargs)
            cache.set(cache_key, rv, timeout=timeout)
            return rv
        return decorated_function
    return decorator
```

### Templating Decorator

```python
from functools import wraps
from flask import request, render_template

def templated(template=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            template_name = template
            if template_name is None:
                template_name = f"{request.endpoint.replace('.', '/')}.html"
            ctx = f(*args, **kwargs)
            if ctx is None:
                ctx = {}
            elif not isinstance(ctx, dict):
                return ctx
            return render_template(template_name, **ctx)
        return decorated_function
    return decorator
```

Usage:
```python
@app.route('/')
@templated('index.html')
def index():
    return dict(value=42)
```

### Endpoint Decorator

```python
from werkzeug.routing import Rule

app.url_map.add(Rule('/', endpoint='index'))

@app.endpoint('index')
def my_index():
    return "Hello world"
```

## Form Validation with WTForms

### Defining Forms

```python
from wtforms import Form, BooleanField, StringField, PasswordField, validators

class RegistrationForm(Form):
    username = StringField('Username', [validators.Length(min=4, max=25)])
    email = StringField('Email Address', [validators.Length(min=6, max=35)])
    password = PasswordField('New Password', [
        validators.DataRequired(),
        validators.EqualTo('confirm', message='Passwords must match')
    ])
    confirm = PasswordField('Repeat Password')
    accept_tos = BooleanField('I accept the TOS', [validators.DataRequired()])
```

### In the View

```python
@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm(request.form)
    if request.method == 'POST' and form.validate():
        user = User(form.username.data, form.email.data, form.password.data)
        db_session.add(user)
        flash('Thanks for registering')
        return redirect(url_for('login'))
    return render_template('register.html', form=form)
```

### Forms in Templates

Macro for rendering fields:
```html
<!-- _formhelpers.html -->
{% macro render_field(field) %}
  <dt>{{ field.label }}
  <dd>{{ field(**kwargs)|safe }}
    {% if field.errors %}
      <ul class=errors>
        {% for error in field.errors %}
          <li>{{ error }}</li>
        {% endfor %}
      </ul>
    {% endif %}
  </dd>
{% endmacro %}
```

Usage:
```html
{% from "_formhelpers.html" import render_field %}
<form method=post>
  <dl>
    {{ render_field(form.username) }}
    {{ render_field(form.email) }}
  </dl>
</form>
```

## Template Inheritance

### Base Template

```html
<!-- layout.html -->
<!doctype html>
<html>
  <head>
    {% block head %}
    <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
    <title>{% block title %}{% endblock %} - My Webpage</title>
    {% endblock %}
  </head>
  <body>
    <div id="content">{% block content %}{% endblock %}</div>
  </body>
</html>
```

### Child Template

```html
{% extends "layout.html" %}
{% block title %}Index{% endblock %}
{% block head %}
  {{ super() }}
  <style type="text/css">.important { color: #336699; }</style>
{% endblock %}
{% block content %}
  <h1>Index</h1>
{% endblock %}
```

- `{% extends %}` must be the first tag
- `{{ super() }}` renders parent block content

## Message Flashing

### Simple Flashing

```python
flash('You were successfully logged in')
```

```html
{% with messages = get_flashed_messages() %}
  {% if messages %}
    <ul class=flashes>
      {% for message in messages %}
        <li>{{ message }}</li>
      {% endfor %}
    </ul>
  {% endif %}
{% endwith %}
```

### Flashing with Categories

```python
flash('Invalid password provided', 'error')
```

```html
{% with messages = get_flashed_messages(with_categories=true) %}
  {% if messages %}
    {% for category, message in messages %}
      <li class="{{ category }}">{{ message }}</li>
    {% endfor %}
  {% endif %}
{% endwith %}
```

### Filtering Flash Messages

```html
{% with errors = get_flashed_messages(category_filter=["error"]) %}
  {% if errors %}
    <div class="alert">
      {% for msg in errors %}<li>{{ msg }}</li>{% endfor %}
    </div>
  {% endif %}
{% endwith %}
```

## JavaScript, fetch, and JSON

### Rendering Templates with Data

Use `tojson` filter to pass data to JavaScript:
```html
<script>
  const chart_data = {{ chart_data|tojson }}
  chartLib.makeChart(chart_data)
</script>
```

Or use `data-` attributes (single quotes required):
```html
<div data-chart='{{ chart_data|tojson }}'></div>
```

### Generating URLs

```javascript
const user_url = {{ url_for("user", id=current_user.id)|tojson }}
fetch(user_url).then(...)
```

For dynamic URLs in JavaScript, set a root variable:
```javascript
const SCRIPT_ROOT = {{ request.script_root|tojson }}
let user_url = `${SCRIPT_ROOT}/user/${user_id}`
```

### Making Requests with fetch

GET request:
```javascript
fetch(room_url)
  .then(response => response.json())
  .then(data => { /* data is parsed JSON */ })
```

POST with form data:
```javascript
let data = new FormData()
data.append("name", "Flask Room")
fetch(room_url, { "method": "POST", "body": data })
```

POST with JSON:
```javascript
fetch(room_url, {
  "method": "POST",
  "headers": {"Content-Type": "application/json"},
  "body": JSON.stringify(data),
})
```

### Following Redirects

```javascript
fetch("/login", {"body": ...}).then(response => {
  if (response.redirected) {
    window.location = response.url
  } else {
    showLoginError()
  }
})
```

### Return JSON from Views

```python
@app.route("/user/<int:id>")
def user_detail(id):
    user = User.query.get_or_404(id)
    return {
        "username": user.username,
        "email": user.email,
    }
```

Or with `jsonify()`:
```python
from flask import jsonify

@app.route("/users")
def user_list():
    users = User.query.order_by(User.name).all()
    return jsonify([u.to_json() for u in users])
```

### Receiving JSON in Views

```python
@app.post("/user/<int:id>")
def user_update(id):
    user = User.query.get_or_404(id)
    user.update_from_json(request.json)
    db.session.commit()
    return user.to_json()
```

Invalid JSON returns 400; wrong Content-Type returns 415.

## Lazily Loading Views

### Centralized URL Map

```python
# views.py (no decorators)
def index(): pass
def user(username): pass

# app setup
app.add_url_rule('/', view_func=views.index)
app.add_url_rule('/user/<username>', view_func=views.user)
```

### LazyView Helper

```python
from werkzeug.utils import import_string, cached_property

class LazyView(object):
    def __init__(self, import_name):
        self.__module__, self.__name__ = import_name.rsplit('.', 1)
        self.import_name = import_name

    @cached_property
    def view(self):
        return import_string(self.import_name)

    def __call__(self, *args, **kwargs):
        return self.view(*args, **kwargs)
```

Usage:
```python
app.add_url_rule('/', view_func=LazyView('yourapplication.views.index'))
app.add_url_rule('/user/<username>', view_func=LazyView('yourapplication.views.user'))
```

Helper function:
```python
def url(import_name, url_rules=[], **options):
    view = LazyView(f"yourapplication.{import_name}")
    for url_rule in url_rules:
        app.add_url_rule(url_rule, view_func=view, **options)
```

Note: `before`/`after` request handlers must be imported upfront to work on the first request.

## MongoDB with MongoEngine

```python
from flask import Flask
from flask_mongoengine import MongoEngine

app = Flask(__name__)
app.config['MONGODB_SETTINGS'] = {"db": "myapp"}
db = MongoEngine(app)
```

### Mapping Documents

```python
import mongoengine as me

class Imdb(me.EmbeddedDocument):
    imdb_id = me.StringField()
    rating = me.DecimalField()
    votes = me.IntField()

class Movie(me.Document):
    title = me.StringField(required=True)
    year = me.IntField()
    imdb = me.EmbeddedDocumentField(Imdb)
```

### Creating Data

```python
bttf = Movie(title="Back To The Future", year=1985)
bttf.imdb = Imdb(imdb_id="tt0088763", rating=8.5)
bttf.save()
```

### Queries

```python
bttf = Movie.objects(title="Back To The Future").get_or_404()
some_theron_movie = Movie.objects(actors__in=["Charlize Theron"]).first()
for recents in Movie.objects(year__gte=2017):
    print(recents.title)
```

## Adding a Favicon

Serve a favicon from the static directory or use a route:
```python
@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')
```

## Streaming Contents

### HTTP Response Behavior

Headers cannot be changed after streaming starts. Set all headers before the generator begins. Access `session` in the view (not the generator) to ensure `Vary: cookie` is set.

### Basic Usage

```python
@app.route('/large.csv')
def generate_large_csv():
    def generate():
        for row in iter_all_rows():
            yield f"{','.join(row)}\n"
    return generate(), {"Content-Type": "text/csv"}
```

### Streaming from Templates

```python
from flask import stream_template

@app.get("/timeline")
def timeline():
    return stream_template("timeline.html")
```

### Streaming with Context

The `request` is not active while the generator runs. Use `stream_with_context()` to keep it active:

```python
from flask import stream_with_context, request
from markupsafe import escape

@app.route('/stream')
def streamed_response():
    def generate():
        yield '<p>Hello '
        yield escape(request.args['name'])
        yield '!</p>'
    return stream_with_context(generate())
```

Can also be used as a decorator. `stream_template()` automatically uses `stream_with_context()` if a request is active.

## Deferred Request Callbacks

It can be useful to defer `after_request` callbacks to execute after the response is returned. This pattern allows adding callbacks during request processing that will still be executed.

## Adding HTTP Method Overrides

Some HTTP proxies don't support all HTTP methods. Use the `X-HTTP-Method-Override` header:

```python
class HTTPMethodOverrideMiddleware(object):
    allowed_methods = frozenset([
        'GET', 'HEAD', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'
    ])
    bodyless_methods = frozenset(['GET', 'HEAD', 'OPTIONS', 'DELETE'])

    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        method = environ.get('HTTP_X_HTTP_METHOD_OVERRIDE', '').upper()
        if method in self.allowed_methods:
            environ['REQUEST_METHOD'] = method
            if method in self.bodyless_methods:
                environ['CONTENT_LENGTH'] = '0'
        return self.app(environ, start_response)
```

Usage:
```python
app.wsgi_app = HTTPMethodOverrideMiddleware(app.wsgi_app)
```

## Request Content Checksums

Calculate checksums of request content to verify data integrity.

## Background Tasks with Celery

### Install

```bash
$ pip install celery
```

### Integrate with Flask

```python
from celery import Celery, Task

def celery_init_app(app: Flask) -> Celery:
    class FlaskTask(Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.config_from_object(app.config["CELERY"])
    celery_app.set_default()
    app.extensions["celery"] = celery_app
    return celery_app
```

### Configuration

```python
app.config.from_mapping(
    CELERY=dict(
        broker_url="redis://localhost",
        result_backend="redis://localhost",
        task_ignore_result=True,
    ),
)
celery_app = celery_init_app(app)
```

### Application Factory Pattern

Create a `make_celery.py` for CLI access:
```python
from example import create_app
flask_app = create_app()
celery_app = flask_app.extensions["celery"]
```

```bash
$ celery -A make_celery worker --loglevel INFO
$ celery -A make_celery beat --loglevel INFO
```

### Defining Tasks

Use `@shared_task` (not `@celery_app.task`) for factory pattern compatibility:

```python
from celery import shared_task

@shared_task(ignore_result=False)
def add_together(a: int, b: int) -> int:
    return a + b
```

### Calling Tasks

```python
result = add_together.delay(a, b)
return {"result_id": result.id}
```

### Getting Results

```python
from celery.result import AsyncResult

@app.get("/result/<id>")
def task_result(id: str) -> dict[str, object]:
    result = AsyncResult(id)
    return {
        "ready": result.ready(),
        "successful": result.successful(),
        "value": result.result if result.ready() else None,
    }
```

### Passing Data to Tasks

Pass minimal serializable data (e.g., user ID, not user object):

```python
@shared_task
def generate_user_archive(user_id: str) -> None:
    user = db.session.get(User, user_id)
    ...

generate_user_archive.delay(current_user.id)
```

## Subclassing Flask

The `Flask` class is designed for subclassing to override internal functionality:

```python
from flask import Flask, Request
from werkzeug.datastructures import ImmutableOrderedMultiDict

class MyRequest(Request):
    parameter_storage_class = ImmutableOrderedMultiDict

class MyFlask(Flask):
    request_class = MyRequest
```

This is the recommended approach for overriding or augmenting Flask's internal behavior.

## Single-Page Applications

Serve an SPA alongside an API using a catch-all endpoint:

```python
from flask import Flask, jsonify

app = Flask(__name__, static_folder='app', static_url_path="/app")

@app.route("/heartbeat")
def heartbeat():
    return jsonify({"status": "healthy"})

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return app.send_static_file("index.html")
```
