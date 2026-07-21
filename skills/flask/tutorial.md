# Flask Tutorial — Building Flaskr (Blog Application)

The Flask tutorial walks through building a complete blog application called "Flaskr" from scratch. It covers project layout, application factory, SQLite database, authentication with blueprints, templates, static files, blog CRUD views, making the project installable, testing, and deployment.

## Project Layout

A Flask application can start as a single file but grows into a package as the project gets bigger.

```
flask-tutorial/
├── flaskr/                  # Application package
│   ├── __init__.py          # Application factory
│   ├── db.py                # Database connection helpers
│   ├── schema.sql           # SQL schema for tables
│   ├── auth.py              # Authentication blueprint
│   ├── blog.py              # Blog blueprint
│   ├── templates/           # Jinja2 templates
│   │   ├── base.html
│   │   ├── auth/
│   │   │   ├── login.html
│   │   │   └── register.html
│   │   └── blog/
│   │       ├── create.html
│   │       ├── index.html
│   │       └── update.html
│   └── static/
│       └── style.css
├── tests/                   # Test modules
│   ├── conftest.py          # Pytest fixtures
│   ├── data.sql             # Test data
│   ├── test_factory.py
│   ├── test_db.py
│   ├── test_auth.py
│   └── test_blog.py
├── .venv/                   # Virtual environment
├── pyproject.toml           # Project metadata
└── MANIFEST.in
```

Files to ignore in version control (`.gitignore`):
```
.venv/
*.pyc
__pycache__/
instance/
.pytest_cache/
.coverage
htmlcov/
dist/
build/
*.egg-info/
```

## Application Setup (Factory)

The `__init__.py` file serves as the application factory and marks the directory as a Python package.

```python
import os
from flask import Flask

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    os.makedirs(app.instance_path, exist_ok=True)

    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    return app
```

Key points:
- `__name__` tells Flask where the app is located
- `instance_relative_config=True` makes config files relative to the instance folder
- `SECRET_KEY='dev'` is a placeholder; override with a random value in production
- `test_config` allows tests to configure the app independently
- `os.makedirs()` ensures the instance folder exists

Run the application:
```bash
$ flask --app flaskr run --debug
```

## Database (SQLite)

### Connection Pattern

```python
# flaskr/db.py
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

- `g` is unique per request; stores the connection for reuse
- `current_app` points to the Flask application handling the request
- `sqlite3.Row` returns rows that behave like dicts (access by column name)

### Schema

```sql
-- flaskr/schema.sql
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS post;
CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);
CREATE TABLE post (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES user (id)
);
```

### Initialization

```python
def init_db():
    db = get_db()
    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))

@click.command('init-db')
def init_db_command():
    init_db()
    click.echo('Initialized the database.')
```

### Register with Application

```python
def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
```

Call from the factory:
```python
def create_app():
    app = ...
    from . import db
    db.init_app(app)
    return app
```

Run initialization:
```bash
$ flask --app flaskr init-db
```

## Blueprints and Views (Authentication)

### Creating a Blueprint

```python
# flaskr/auth.py
bp = Blueprint('auth', __name__, url_prefix='/auth')
```

Register in factory:
```python
from . import auth
app.register_blueprint(auth.bp)
```

### Register View

```python
@bp.route('/register', methods=('GET', 'POST'))
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        db = get_db()
        error = None
        if not username:
            error = 'Username is required.'
        elif not password:
            error = 'Password is required.'
        if error is None:
            try:
                db.execute(
                    "INSERT INTO user (username, password) VALUES (?, ?)",
                    (username, generate_password_hash(password)),
                )
                db.commit()
            except db.IntegrityError:
                error = f"User {username} is already registered."
            else:
                return redirect(url_for("auth.login"))
        flash(error)
    return render_template('auth/register.html')
```

### Login View

```python
@bp.route('/login', methods=('GET', 'POST'))
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        db = get_db()
        error = None
        user = db.execute(
            'SELECT * FROM user WHERE username = ?', (username,)
        ).fetchone()
        if user is None:
            error = 'Incorrect username.'
        elif not check_password_hash(user['password'], password):
            error = 'Incorrect password.'
        if error is None:
            session.clear()
            session['user_id'] = user['id']
            return redirect(url_for('index'))
        flash(error)
    return render_template('auth/login.html')
```

### Loading Logged-in User

```python
@bp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')
    if user_id is None:
        g.user = None
    else:
        g.user = get_db().execute(
            'SELECT * FROM user WHERE id = ?', (user_id,)
        ).fetchone()
```

### Logout

```python
@bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))
```

### Authentication Decorator

```python
def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('auth.login'))
        return view(**kwargs)
    return wrapped_view
```

### Endpoints and URLs

- Blueprint endpoints are prefixed: `auth.login`, `auth.register`
- `url_for('auth.login')` generates `/auth/login`
- `url_for('index')` generates `/`

## Templates

### Base Layout

```html
<!-- flaskr/templates/base.html -->
<!doctype html>
<title>{% block title %}{% endblock %} - Flaskr</title>
<link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
<nav>
  <h1>Flaskr</h1>
  <ul>
    {% if g.user %}
      <li><span>{{ g.user['username'] }}</span>
      <li><a href="{{ url_for('auth.logout') }}">Log Out</a>
    {% else %}
      <li><a href="{{ url_for('auth.register') }}">Register</a>
      <li><a href="{{ url_for('auth.login') }}">Log In</a>
    {% endif %}
  </ul>
</nav>
<section class="content">
  <header>{% block header %}{% endblock %}</header>
  {% for message in get_flashed_messages() %}
    <div class="flash">{{ message }}</div>
  {% endfor %}
  {% block content %}{% endblock %}
</section>
```

Key patterns:
- `g` is automatically available in templates
- `url_for()` generates URLs to views
- `get_flashed_messages()` displays flash messages
- Three blocks: `title`, `header`, `content`
- Nesting `{% block title %}` inside `{% block header %}` avoids duplication

### Register Template

```html
{% extends 'base.html' %}
{% block header %}
  <h1>{% block title %}Register{% endblock %}</h1>
{% endblock %}
{% block content %}
  <form method="post">
    <label for="username">Username</label>
    <input name="username" id="username" required>
    <label for="password">Password</label>
    <input type="password" name="password" id="password" required>
    <input type="submit" value="Register">
  </form>
{% endblock %}
```

## Static Files

Flask automatically serves files from the `static` directory:
```html
<link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
```

Static files can include CSS, JavaScript, images, etc.

## Blog Blueprint

### Blueprint Setup

```python
# flaskr/blog.py
bp = Blueprint('blog', __name__)
```

No `url_prefix` — blog is the main feature, so its index is at `/`.

Register in factory:
```python
from . import blog
app.register_blueprint(blog.bp)
app.add_url_rule('/', endpoint='index')
```

`app.add_url_rule('/', endpoint='index')` makes both `url_for('index')` and `url_for('blog.index')` work.

### Index View

```python
@bp.route('/')
def index():
    db = get_db()
    posts = db.execute(
        'SELECT p.id, title, body, created, author_id, username'
        ' FROM post p JOIN user u ON p.author_id = u.id'
        ' ORDER BY created DESC'
    ).fetchall()
    return render_template('blog/index.html', posts=posts)
```

### Create View

```python
@bp.route('/create', methods=('GET', 'POST'))
@login_required
def create():
    if request.method == 'POST':
        title = request.form['title']
        body = request.form['body']
        error = None
        if not title:
            error = 'Title is required.'
        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                'INSERT INTO post (title, body, author_id)'
                ' VALUES (?, ?, ?)',
                (title, body, g.user['id'])
            )
            db.commit()
            return redirect(url_for('blog.index'))
    return render_template('blog/create.html')
```

### Get Post Helper

```python
def get_post(id, check_author=True):
    post = get_db().execute(
        'SELECT p.id, title, body, created, author_id, username'
        ' FROM post p JOIN user u ON p.author_id = u.id'
        ' WHERE p.id = ?',
        (id,)
    ).fetchone()
    if post is None:
        abort(404, f"Post id {id} doesn't exist.")
    if check_author and post['author_id'] != g.user['id']:
        abort(403)
    return post
```

### Update View

```python
@bp.route('/<int:id>/update', methods=('GET', 'POST'))
@login_required
def update(id):
    post = get_post(id)
    if request.method == 'POST':
        title = request.form['title']
        body = request.form['body']
        error = None
        if not title:
            error = 'Title is required.'
        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                'UPDATE post SET title = ?, body = ?'
                ' WHERE id = ?',
                (title, body, id)
            )
            db.commit()
            return redirect(url_for('blog.index'))
    return render_template('blog/update.html', post=post)
```

### Delete View

```python
@bp.route('/<int:id>/delete', methods=('POST',))
@login_required
def delete(id):
    get_post(id)
    db = get_db()
    db.execute('DELETE FROM post WHERE id = ?', (id,))
    db.commit()
    return redirect(url_for('blog.index'))
```

### Update Template Pattern

```html
<input name="title" id="title" value="{{ request.form['title'] or post['title'] }}" required>
```

This pattern shows original post data when the form hasn't been submitted, but shows invalid submitted data for correction.

## Make the Project Installable

### pyproject.toml

```toml
[project]
name = "flaskr"
version = "1.0.0"
description = "The basic blog app built in the Flask tutorial."
dependencies = [
    "flask",
]
[build-system]
requires = ["flit_core<4"]
build-backend = "flit_core.buildapi"
```

### Install in editable mode

```bash
$ pip install -e .
```

This allows running `flask --app flaskr run` from any directory.

## Test Coverage

### Fixtures (conftest.py)

```python
import os
import tempfile
import pytest
from flaskr import create_app
from flaskr.db import get_db, init_db

with open(os.path.join(os.path.dirname(__file__), 'data.sql'), 'rb') as f:
    _data_sql = f.read().decode('utf8')

@pytest.fixture
def app():
    db_fd, db_path = tempfile.mkstemp()
    app = create_app({
        'TESTING': True,
        'DATABASE': db_path,
    })
    with app.app_context():
        init_db()
        get_db().executescript(_data_sql)
    yield app
    os.close(db_fd)
    os.unlink(db_path)

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def runner(app):
    return app.test_cli_runner()
```

### Auth Actions Fixture

```python
class AuthActions(object):
    def __init__(self, client):
        self._client = client
    def login(self, username='test', password='test'):
        return self._client.post(
            '/auth/login', data={'username': username, 'password': password}
        )
    def logout(self):
        return self._client.get('/auth/logout')

@pytest.fixture
def auth(client):
    return AuthActions(client)
```

### Test Examples

```python
# Factory test
def test_config():
    assert not create_app().testing
    assert create_app({'TESTING': True}).testing

# Auth test with session access
def test_login(client, auth):
    assert client.get('/auth/login').status_code == 200
    response = auth.login()
    assert response.headers["Location"] == "/"
    with client:
        client.get('/')
        assert session['user_id'] == 1
        assert g.user['username'] == 'test'

# Parameterized validation test
@pytest.mark.parametrize(('username', 'password', 'message'), (
    ('', '', b'Username is required.'),
    ('a', '', b'Password is required.'),
    ('test', 'test', b'already registered'),
))
def test_register_validate_input(client, username, password, message):
    response = client.post(
        '/auth/register', data={'username': username, 'password': password}
    )
    assert message in response.data
```

### Running Tests

```bash
$ pytest
$ coverage run -m pytest
$ coverage report
$ coverage html
```

Add to `pyproject.toml`:
```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
[tool.coverage.run]
branch = true
source = ["flaskr"]
```

## Deploy to Production

### Build and Install

```bash
$ pip install build
$ python -m build --wheel
# Output: dist/flaskr-1.0.0-py3-none-any.whl

# On the target machine:
$ pip install flaskr-1.0.0-py3-none-any.whl
$ flask --app flaskr init-db
```

When installed (not editable), instance folder is at `.venv/var/flaskr-instance`.

### Configure Secret Key

```bash
$ python -c 'import secrets; print(secrets.token_hex())'
```

Create `config.py` in the instance folder:
```python
SECRET_KEY = '192b9bdd22ab9ed4d12e236c78afcb9a393ec15f71bbf5dc987d54727823bcbf'
```

### Run with Production Server

```bash
$ pip install waitress
$ waitress-serve --call 'flaskr:create_app'
```

## Keep Developing

Ideas for extending Flaskr:
- Detail view for a single post
- Like/unlike a post
- Comments
- Tags with filtering
- Search box
- Paged display (5 posts per page)
- Image uploads
- Markdown formatting
- RSS feed
