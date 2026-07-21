# Flask Blueprints

Blueprints are a way to organize Flask applications into modular components.

## Why Blueprints?

Blueprints are useful for:

- **Factoring applications** into smaller components — ideal for larger applications
- **URL prefix registration** — mount a blueprint at a specific URL prefix or subdomain
- **Multiple registration** — register the same blueprint multiple times with different URL rules
- **Providing resources** — template filters, static files, templates, and utilities
- **Extension initialization** — register a blueprint when setting up an extension

A blueprint is **not a pluggable app** — it's a set of operations that can be registered on an application. Blueprints provide separation at the Flask level, share application config, and can change an application object when registered. The downside: you cannot unregister a blueprint once the application is created.

## The Concept of Blueprints

Blueprints record operations to execute when registered on an application. Flask associates view functions with blueprints when dispatching requests and generating URLs.

## My First Blueprint

```python
from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound

simple_page = Blueprint('simple_page', __name__, template_folder='templates')

@simple_page.route('/', defaults={'page': 'index'})
@simple_page.route('/<page>')
def show(page):
    try:
        return render_template(f'pages/{page}.html')
    except TemplateNotFound:
        abort(404)
```

When using `@simple_page.route`, the blueprint records the intention to register the function when it's later registered. The endpoint is prefixed with the blueprint name (e.g., `simple_page.show`).

## Registering Blueprints

```python
from flask import Flask
from yourapplication.simple_page import simple_page

app = Flask(__name__)
app.register_blueprint(simple_page)
```

URL rules after registration:
```
>>> app.url_map
Map([
    <Rule '/static/<filename>' (HEAD, OPTIONS, GET) -> static>,
    <Rule '/<page>' (HEAD, OPTIONS, GET) -> simple_page.show>,
    <Rule '/' (HEAD, OPTIONS, GET) -> simple_page.show>
])
```

### Mounting at a URL Prefix

```python
app.register_blueprint(simple_page, url_prefix='/pages')
```

Result:
```
>>> app.url_map
Map([
    <Rule '/static/<filename>' (HEAD, OPTIONS, GET) -> static>,
    <Rule '/pages/<page>' (HEAD, OPTIONS, GET) -> simple_page.show>,
    <Rule '/pages/' (HEAD, OPTIONS, GET) -> simple_page.show>
])
```

Blueprints can be registered multiple times, though not all blueprints respond properly to multiple registrations.

## Nesting Blueprints

Blueprints can be registered on other blueprints:

```python
parent = Blueprint('parent', __name__, url_prefix='/parent')
child = Blueprint('child', __name__, url_prefix='/child')

parent.register_blueprint(child)
app.register_blueprint(parent)
```

- Child blueprint name gains parent's name as prefix: `parent.child.create`
- Child URLs are prefixed with parent's URL prefix: `/parent/child/create`
- Child gains parent's subdomain as prefix
- Parent's `before_request` functions trigger for child
- Parent's error handlers are tried if child doesn't have a matching one

```python
url_for('parent.child.create')  # /parent/child/create
```

## Blueprint Resources

### Blueprint Resource Folder

The resource folder is inferred from the second argument to `Blueprint` (usually `__name__`).

```python
>>> simple_page.root_path
'/Users/username/TestProject/yourapplication'
```

Open resources from the folder:

```python
with simple_page.open_resource('static/style.css') as f:
    code = f.read()
```

### Static Files

```python
admin = Blueprint('admin', __name__, static_folder='static')
```

- Available at `url_prefix + /static` (e.g., `/admin/static` if prefix is `/admin`)
- Endpoint: `blueprint_name.static`
- Generate URLs: `url_for('admin.static', filename='style.css')`
- If no `url_prefix`, blueprint static folder is inaccessible (app's `/static` takes precedence)
- Blueprint static folders are **not** searched as fallback if file not in app's static folder

### Templates

```python
admin = Blueprint('admin', __name__, template_folder='templates')
```

- Template folder is added to the search path with **lower priority** than the app's template folder
- App templates can override blueprint templates
- To avoid accidental overrides, use unique relative paths: `yourapplication/admin/templates/admin/index.html`
- Render with: `render_template('admin/index.html')`
- When multiple blueprints provide the same template path, the first registered takes precedence
- Enable `EXPLAIN_TEMPLATE_LOADING` config to debug template loading

Recommended layout:
```
yourpackage/
    blueprints/
        admin/
            templates/
                admin/
                    index.html
            __init__.py
```

## Building URLs

Prefix endpoint with blueprint name and a dot:

```python
url_for('admin.index')
```

Relative redirects within the same blueprint (prefix with dot only):

```python
url_for('.index')  # Links to admin.index if current request is in admin blueprint
```

## Blueprint Error Handlers

Blueprints support the `errorhandler` decorator:

```python
@simple_page.errorhandler(404)
def page_not_found(e):
    return render_template('pages/404.html')
```

**Caveat for 404 and 405**: These handlers are only invoked from `raise` or `abort` within the blueprint's own view functions — not from invalid URL access. This is because blueprints don't "own" URL space.

For URL-prefix-based error handling, define at the application level:

```python
@app.errorhandler(404)
@app.errorhandler(405)
def _handle_api_error(ex):
    if request.path.startswith('/api/'):
        return jsonify(error=str(ex)), ex.code
    else:
        return ex
```
