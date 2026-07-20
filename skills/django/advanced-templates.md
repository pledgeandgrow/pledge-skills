# Advanced Templates — Django 6.0

## Template API

### Template Loading

```python
from django.template.loader import get_template, select_template, render_to_string

# Load a single template
template = get_template("myapp/detail.html")

# Load first available from a list
template = select_template(["myapp/custom.html", "myapp/detail.html"])

# Render to string
content = render_to_string("myapp/detail.html", {"foo": "bar"})
```

### Custom Template Loader

```python
from django.template import Origin, TemplateDoesNotExist
from django.template.loaders.base import Loader

class CustomLoader(Loader):
    def get_contents(self, origin):
        # Return template source string
        try:
            return self._get_template_source(origin.name)
        except FileNotFoundError:
            raise TemplateDoesNotExist(origin)

    def get_template_sources(self, template_name):
        # Yield Origin objects for candidate template paths
        yield Origin(
            name=f"custom:{template_name}",
            template_name=template_name,
            loader=self,
        )

    def _get_template_source(self, name):
        # Your custom logic to fetch template content
        return "Hello {{ name }}!"
```

```python
# settings.py
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "OPTIONS": {
            "loaders": [
                "myapp.template_loaders.CustomLoader",
                "django.template.loaders.filesystem.Loader",
                "django.template.loaders.app_directories.Loader",
            ],
        },
    },
]
```

## Custom Template Backend (Jinja2)

### Configuring Jinja2

```python
# settings.py
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.jinja2.Jinja2",
        "DIRS": [BASE_DIR / "jinja2_templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "environment": "myapp.jinja2.environment",
        },
    },
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        # ...
    },
]
```

### Jinja2 Environment Setup

```python
# myapp/jinja2.py
from jinja2 import Environment

def environment(**options):
    env = Environment(**options)
    env.globals.update({
        "static": "django.templatetags.static.static",
        "url": "django.urls.reverse",
    })
    return env
```

### Using Jinja2 Templates

```jinja2
{# jinja2_templates/myapp/detail.html #}
{% extends "base.html" %}

{% block content %}
  <h1>{{ object.title }}</h1>
  <p>{{ object.body }}</p>
  <a href="{{ url('article-list') }}">Back to list</a>
  <img src="{{ static('images/logo.png') }}">
{% endblock %}
```

### Jinja2 vs Django Template Language

| Feature | DTL | Jinja2 |
|---------|-----|--------|
| Auto-escape | Yes | Yes |
| Filter syntax | `{{ value\|filter }}` | `{{ value\|filter }}` |
| Tag syntax | `{% tag %}` | `{% tag %}` |
| Function calls | No | Yes: `{{ func(arg) }}` |
| Expressions | Limited | Full Python expressions |
| CSRF | Built-in `{% csrf_token %}` | Manual: `{{ csrf_input }}` |
| Static files | `{% load static %}` | `{{ static('path') }}` |
| URL reversing | `{% url 'name' %}` | `{{ url('name') }}` |

## Template Engines API

### DjangoTemplates Backend

```python
from django.template import engines

django_engine = engines["django"]
template = django_engine.from_string("Hello {{ name }}!")
rendered = template.render({"name": "World"})
```

### Jinja2 Backend

```python
jinja_engine = engines["jinja2"]
template = jinja_engine.from_string("Hello {{ name }}!")
rendered = template.render({"name": "World"})
```

### Listing All Engines

```python
from django.template import engines

for alias, engine in engines.all():
    print(f"{alias}: {engine}")
```

## Custom Template Tags

### Simple Tags

```python
# myapp/templatetags/myapp_tags.py
from django import template

register = template.Library()

@register.simple_tag
def current_time(format_string="%H:%M"):
    from django.utils import timezone
    return timezone.now().strftime(format_string)

# With takes_context
@register.simple_tag(takes_context=True)
def current_user_name(context):
    user = context["request"].user
    return user.get_full_name() or user.username

# Usage in template:
# {% load myapp_tags %}
# {% current_time "%Y-%m-%d" %}
# {% current_user_name %}
```

### Inclusion Tags

```python
@register.inclusion_tag("tags/pagination.html")
def show_pagination(page_obj):
    return {
        "page_obj": page_obj,
        "page_range": page_obj.paginator.page_range,
    }

# Usage: {% show_pagination page_obj %}
```

### Assignment Tags

```python
@register.simple_tag
def get_recent_articles(limit=5):
    return Article.objects.order_by("-published_at")[:limit]

# Usage: {% get_recent_articles 5 as recent %}{{ recent }}
```

## Template Rendering Context

### RequestContext

```python
from django.template import RequestContext, Template

def manual_render(request):
    template = Template("Hello {{ user.username }}!")
    context = RequestContext(request, {"extra": "data"})
    return HttpResponse(template.render(context))
```

### Context Processors

```python
# myapp/context_processors.py
def site_settings(request):
    return {
        "SITE_NAME": "My Site",
        "DEBUG": settings.DEBUG,
    }

# settings.py
TEMPLATES = [
    {
        # ...
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "myapp.context_processors.site_settings",
            ],
        },
    },
]
```

## Template Inheritance with Engines

### DTL Inheritance

```html
<!-- base.html -->
<!DOCTYPE html>
<html>
<head><title>{% block title %}Default{% endblock %}</title></head>
<body>{% block content %}{% endblock %}</body>
</html>

<!-- child.html -->
{% extends "base.html" %}
{% block title %}Child Page{% endblock %}
{% block content %}<p>Hello!</p>{% endblock %}
```

### Multi-level Inheritance

```html
{% extends "base.html" %}
{% block content %}
  {{ block.super }}  {# Include parent block content #}
  <p>Additional content</p>
{% endblock %}
```
