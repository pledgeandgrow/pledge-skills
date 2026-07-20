# URL Routing — Django 6.0

## Overview

URLconfs map URL patterns to Python view functions. Pure Python code, can be constructed dynamically.

## Basic URLconf

```python
# myproject/urls.py
from django.urls import path, include
from django.contrib import admin

urlpatterns = [
    path("admin/", admin.site.urls),
    path("articles/", include("articles.urls")),
    path("api/", include("api.urls")),
]
```

```python
# articles/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("", views.article_list, name="article-list"),
    path("<int:pk>/", views.article_detail, name="article-detail"),
    path("create/", views.article_create, name="article-create"),
]
```

## Path Converters

```python
# Built-in converters:
path("articles/<int:pk>/", views.detail)        # Integer
path("articles/<slug:slug>/", views.detail)     # Slug (letters, numbers, hyphens, underscores)
path("articles/<str:name>/", views.detail)      # String without "/"
path("articles/<path:filepath>/", views.detail) # String with "/"
path("articles/<uuid:uuid>/", views.detail)     # UUID
```

## Custom Path Converters

```python
# converters.py
class FourDigitYearConverter:
    regex = r"[0-9]{4}"

    def to_python(self, value):
        return int(value)

    def to_url(self, value):
        return f"{value:04d}"

# urls.py
from django.urls import path, register_converter
from .converters import FourDigitYearConverter

register_converter(FourDigitYearConverter, "yyyy")

urlpatterns = [
    path("articles/<yyyy:year>/", views.year_archive),
]
```

## Regular Expressions (re_path)

```python
from django.urls import re_path

urlpatterns = [
    re_path(r"^articles/(?P<year>[0-9]{4})/$", views.year_archive),
    re_path(r"^articles/(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/$", views.month_archive),
]
```

## Including Other URLconfs

```python
urlpatterns = [
    path("blog/", include("blog.urls")),
    path("blog/", include("blog.urls", namespace="blog")),
]

# With namespace — also set app_name in included urls.py:
# blog/urls.py
app_name = "blog"
urlpatterns = [
    path("", views.index, name="index"),
]
```

## Passing Extra Options

```python
# To view function
urlpatterns = [
    path("blog/<int:year>/", views.year_archive, {"foo": "bar"}),
]

# To include()
urlpatterns = [
    path("blog/", include("blog.urls"), {"blog_name": "My Blog"}),
]
```

## Reverse Resolution

```python
from django.urls import reverse, reverse_lazy

# In Python code
url = reverse("article-detail", kwargs={"pk": 42})
# Returns: "/articles/42/"

url = reverse("article-list")
# Returns: "/articles/"

# With namespaces
url = reverse("blog:article-detail", kwargs={"pk": 1})

# In templates
# {% url 'article-detail' pk=article.pk %}
# {% url 'blog:article-list' %}

# reverse_lazy (for class-based views)
success_url = reverse_lazy("article-list")
```

## Naming URL Patterns

```python
urlpatterns = [
    path("", views.article_list, name="article-list"),
    path("<int:pk>/", views.article_detail, name="article-detail"),
]
```

## URL Namespaces

### Application Namespaces
```python
# blog/urls.py
app_name = "blog"
urlpatterns = [
    path("", views.index, name="index"),
]

# Reverse with namespace:
reverse("blog:index")
# In template:
# {% url 'blog:index' %}
```

### Instance Namespaces
```python
# myproject/urls.py
urlpatterns = [
    path("blog/", include(("blog.urls", "blog"), namespace="instance-blog")),
]

# Reverse:
reverse("instance-blog:index")
```

## How Django Processes a Request

1. Django determines the root URLconf (`ROOT_URLCONF` setting)
2. Django loads that Python module and looks for `urlpatterns` variable
3. Django runs through each URL pattern in order, stopping at the first match
4. If no match, Django invokes the error handler (404)
5. If match, Django imports and calls the corresponding view

## get_absolute_url

```python
from django.urls import reverse

class Article(models.Model):
    title = models.CharField(max_length=200)

    def get_absolute_url(self):
        return reverse("article-detail", kwargs={"pk": self.pk})
```

## URL Patterns Best Practices

- Use `path()` over `re_path()` when possible (more readable)
- Always name your URL patterns
- Use namespaces for apps with many URLs
- Order matters — more specific patterns first
- Use `include()` to modularize URLs per app
