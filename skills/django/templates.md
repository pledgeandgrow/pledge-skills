# Templates — Django 6.0

## Django Template Language (DTL)

### Variables

```html
{{ variable }}
{{ variable.attribute }}
{{ variable.method }}
{{ dict.key }}
{{ list.0 }}
```

### Tags

```html
{% load static %}

{% block content %} ... {% endblock %}
{% extends "base.html" %}

{% if condition %} ... {% elif %} ... {% else %} ... {% endif %}
{% for item in items %} ... {% empty %} ... {% endfor %}
{% with value as alias %} ... {% endwith %}

{% url 'view-name' arg1 arg2 %}
{% csrf_token %}
{% include "partial.html" %}
{% include "partial.html" with var="value" only %}

{% comment %} Multi-line comment {% endcomment %}
{# Single-line comment #}
```

### Filters

```html
{{ value|lower }}
{{ value|upper }}
{{ value|title }}
{{ value|length }}
{{ value|default:"nothing" }}
{{ value|default_if_none:"nothing" }}
{{ value|truncatewords:30 }}
{{ value|truncatechars:30 }}
{{ value|date:"Y-m-d" }}
{{ value|time:"H:i" }}
{{ value|timesince }}
{{ value|timeuntil }}
{{ value|floatformat:2 }}
{{ value|add:5 }}
{{ value|slugify }}
{{ value|urlencode }}
{{ value|striptags }}
{{ value|escape }}
{{ value|safe }}
{{ value|linebreaks }}
{{ value|linebreaksbr }}
{{ value|wordwrap:80 }}
{{ value|join:", " }}
{{ value|first }}
{{ value|last }}
{{ value|length_is:5 }}
{{ value|slice:":10" }}
{{ value|divisibleby:3 }}
{{ value|yesno:"yes,no,maybe" }}
{{ list|dictsort:"name" }}
{{ list|dictsortreversed:"name" }}
{{ value|filesizeformat }}
{{ value|pluralize }}
{{ value|pluralize:"es" }}
{{ value|pluralize:"y,ies" }}
{{ value|phone2numeric }}
{{ value|pprint }}
{{ value|random }}
{{ value|rjust:10 }}
{{ value|ljust:10 }}
{{ value|center:10 }}
{{ value|cut:" " }}
{{ value|force_escape }}
{{ value|iriencode }}
{{ value|linenumbers }}
{{ value|make_list }}
{{ value|stringformat:"s" }}
{{ value|unordered_list }}
{{ value|urlize }}
{{ value|urlizetrunc:15 }}
{{ value|wordcount }}
```

### Template Inheritance

```html
<!-- base.html -->
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}Default Title{% endblock %}</title>
    {% block extra_head %}{% endblock %}
</head>
<body>
    {% block content %}{% endblock %}
    {% block footer %}{% endblock %}
</body>
</html>
```

```html
<!-- article_detail.html -->
{% extends "base.html" %}

{% block title %}{{ article.title }}{% endblock %}

{% block content %}
    <h1>{{ article.title }}</h1>
    <p>{{ article.content|linebreaks }}</p>
{% endblock %}
```

### For Loop

```html
{% for article in articles %}
    {{ forloop.counter }}. {{ article.title }}
    {# forloop.counter: 1-indexed #}
    {# forloop.counter0: 0-indexed #}
    {# forloop.revcounter: reverse 1-indexed #}
    {# forloop.revcounter0: reverse 0-indexed #}
    {# forloop.first: True on first iteration #}
    {# forloop.last: True on last iteration #}
    {# forloop.parentloop: parent loop context (nested loops) #}
{% empty %}
    No articles found.
{% endfor %}
```

### If/Else

```html
{% if articles %}
    {% for article in articles %}
        {{ article.title }}
    {% endfor %}
{% elif archived %}
    Archived articles.
{% else %}
    No articles.
{% endif %}

{% if article.published and article.featured %}
    Featured!
{% endif %}

{% if article.category == "tech" or article.category == "science" %}
    STEM article
{% endif %}

{% if not article.draft %}
    Published
{% endif %}
```

### Auto-escaping

```html
{# Auto-escaping is ON by default #}
{{ value }} {# HTML-escaped #}

{{ value|safe }} {# Not escaped — use with caution #}

{% autoescape off %}
    {{ value }} {# Not escaped #}
{% endautoescape %}

{% autoescape on %}
    {{ value }} {# Escaped #}
{% endautoescape %}
```

### Custom Tags and Filters

```python
# templatetags/custom_tags.py
from django import template

register = template.Library()

@register.filter
def multiply(value, arg):
    return value * arg

@register.simple_tag
def current_time(format_string):
    from django.utils import timezone
    return timezone.now().strftime(format_string)

@register.inclusion_tag("tags/article_card.html")
def article_card(article):
    return {"article": article}

@register.assignment_tag  # Deprecated — use simple_tag
def get_articles():
    return Article.objects.all()[:5]
```

```html
{% load custom_tags %}

{{ value|multiply:3 }}
{% current_time "%Y-%m-%d" as now %}
{% article_card article %}
```

### Template Configuration

```python
# settings.py
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,  # Look in app/templates/
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]
```

### Context Processors

Built-in context processors:
- `debug` — Debug info (when `DEBUG=True`)
- `request` — Adds `request` to context
- `auth` — Adds `user`, `perms`, `messages`
- `messages` — Adds messages from messages framework

Custom context processor:
```python
# context_processors.py
def site_settings(request):
    return {"SITE_NAME": "My Site", "DEBUG": settings.DEBUG}

# settings.py
"context_processors": [
    # ...
    "myapp.context_processors.site_settings",
],
```

### Render Shortcut

```python
from django.shortcuts import render

def my_view(request):
    context = {"key": "value", "items": [1, 2, 3]}
    return render(request, "template.html", context)
```

### TemplateResponse

```python
from django.template.response import TemplateResponse

def my_view(request):
    return TemplateResponse(request, "template.html", {"key": "value"})
```

### Multiple Template Engines

```python
# Jinja2 backend
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
    },
]
```
