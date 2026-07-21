# Flask Templates

Flask uses the Jinja2 template engine. Templates are HTML files with Jinja2 syntax for dynamic content.

## Jinja Setup

Unless customized, Flask configures Jinja as follows:

- **Autoescaping enabled** for templates ending in `.html`, `.htm`, `.xml`, `.xhtml`, `.svg` when using `render_template()`
- **Autoescaping enabled** for all strings when using `render_template_string()`
- Templates can opt in/out of autoescaping with the `{% autoescape %}` tag
- Flask injects global functions/helpers into the Jinja context

## Standard Context

The following variables are available in Jinja templates by default:

| Variable | Description |
|----------|-------------|
| `config` | Current configuration object (`flask.Flask.config`) |
| `request` | Current request object (`flask.request`) — unavailable without active request context |
| `session` | Current session object (`flask.session`) — unavailable without active request context |
| `g` | Request-bound global object (`flask.g`) — unavailable without active request context |
| `url_for()` | URL building function |
| `get_flashed_messages()` | Retrieve flashed messages |

### Context Behavior with Imported Templates

These variables are added to the context, not as global variables. They do not appear in imported templates by default.

To access `request` in an imported macro:

```jinja
{# Option 1: pass explicitly #}
{% from '_helpers.html' import my_macro with context %}
```

```jinja
{# Option 2: pass as parameter #}
{% from '_helpers.html' import my_macro %}
{{ my_macro(request) }}
```

## Controlling Autoescaping

Autoescaping escapes special HTML characters: `&`, `>`, `<`, `"`, `'`.

Three ways to disable autoescaping:

### 1. Wrap in Markup (recommended)

```python
from markupsafe import Markup

@app.route("/")
def index():
    return render_template('index.html', content=Markup('<strong>Safe HTML</strong>'))
```

### 2. Use the |safe filter

```jinja
{{ myvariable|safe }}
```

### 3. Disable with autoescape block

```jinja
{% autoescape false %}
    <p>autoescaping is disabled here</p>
    <p>{{ will_not_be_escaped }}</p>
{% endautoescape %}
```

**Be cautious** when disabling autoescaping — only use with trusted content to prevent XSS attacks.

## Registering Filters

Register custom Jinja filters using the `template_filter()` decorator:

```python
@app.template_filter('reverse')
def reverse_filter(s):
    return s[::-1]
```

Or manually:

```python
def reverse_filter(s):
    return s[::-1]

app.jinja_env.filters['reverse'] = reverse_filter
```

Use in templates:

```jinja
{% for x in mylist | reverse %}
{% endfor %}
```

The decorator argument is optional if you want to use the function name as the filter name.

## Context Processors

Context processors inject variables into the template context before rendering. They are functions that return a dictionary.

```python
from flask import g

@app.context_processor
def inject_user():
    return dict(user=g.user)
```

The `user` variable is now available in all templates.

### Functions in Context Processors

Context processors can also make functions available:

```python
@app.context_processor
def utility_processor():
    def format_price(amount, currency="€"):
        return f"{amount:.2f}{currency}"
    return dict(format_price=format_price)
```

Use in templates:

```jinja
{{ format_price(0.33) }}
```

## Streaming Templates

Render templates as a stream of incremental strings instead of one complete string. Useful for:
- Speeding up initial page load
- Saving memory with very large templates

```python
from flask import stream_template

@app.get("/timeline")
def timeline():
    return stream_template("timeline.html")
```

`stream_template()` and `stream_template_string()` automatically apply `stream_with_context()` if a request is active, so `request`, `session`, and `g` remain available.

**Important**: Headers cannot be sent after the body begins. Set all headers before starting the response. If the template accesses `session`, access it in the view too so the `Vary: cookie` header is set.
