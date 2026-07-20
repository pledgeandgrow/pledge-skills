# django.contrib Packages — Django 6.0

## Contenttypes Framework

Tracks all models in your Django project, enabling generic relationships.

### ContentType Model

```python
from django.contrib.contenttypes.models import ContentType

# Get ContentType for a model
ct = ContentType.objects.get_for_model(Article)
# ct.app_label, ct.model, ct.model_class()

# Get by app_label and model
ct = ContentType.objects.get(app_label="myapp", model="article")

# Get the model class
model_class = ct.model_class()

# Get object from ContentType
article = ct.get_object_for_this_type(pk=1)
```

### Generic Relations

```python
from django.contrib.contenttypes.fields import (
    GenericForeignKey, GenericRelation,
)
from django.contrib.contenttypes.models import ContentType

class TaggedItem(models.Model):
    tag = models.SlugField()
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveBigIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    class Meta:
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
        ]

# Usage
article = Article.objects.get(pk=1)
TaggedItem.objects.create(tag="django", content_object=article)

# Query tags for an object
tags = TaggedItem.objects.filter(content_type=ContentType.objects.get_for_model(article), object_id=article.pk)

# Reverse generic relation
class Article(models.Model):
    title = models.CharField(max_length=200)
    tags = GenericRelation("TaggedItem")

# Query via reverse relation
article.tags.all()  # All TaggedItems for this article
```

### GenericPrefetch

```python
from django.contrib.contenttypes.prefetch import GenericPrefetch

# Prefetch generic relations efficiently
TaggedItem.objects.prefetch_related(
    GenericPrefetch("content_object", [Article.objects.all(), Video.objects.all()])
)
```

## Sitemaps Framework

```python
# settings.py
INSTALLED_APPS = [
    # ...
    "django.contrib.sitemaps",
]

# urls.py
from django.contrib.sitemaps.views import sitemap
from .sitemaps import ArticleSitemap, StaticViewSitemap

sitemaps = {
    "articles": ArticleSitemap,
    "static": StaticViewSitemap,
}

urlpatterns = [
    path("sitemap.xml", sitemap, {"sitemaps": sitemaps}, name="sitemap"),
]
```

### Sitemap Classes

```python
from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .models import Article

class ArticleSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8
    protocol = "https"

    def items(self):
        return Article.objects.filter(published=True)

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        return f"/articles/{obj.slug}/"

# Static views sitemap
class StaticViewSitemap(Sitemap):
    priority = 0.5
    changefreq = "monthly"

    def items(self):
        return ["home", "about", "contact"]

    def location(self, item):
        return reverse(item)
```

### Sitemap Class Reference

| Attribute/Method | Type | Description |
|-----------------|------|-------------|
| `items()` | Method (required) | Returns list/QuerySet of objects |
| `location(obj)` | Method/attr | URL path for object |
| `lastmod(obj)` | Method/attr | Last modified datetime |
| `changefreq` | Attribute | "always", "hourly", "daily", "weekly", "monthly", "yearly", "never" |
| `priority` | Attribute | 0.0 to 1.0 (default 0.5) |
| `protocol` | Attribute | "http" or "https" |
| `limit` | Attribute | Max items per sitemap page (default 50000) |

### Sitemap Index

```python
from django.contrib.sitemaps.views import index, sitemap

urlpatterns = [
    path("sitemap.xml", index, {"sitemaps": sitemaps}, name="sitemap-index"),
    path("sitemap-<section>.xml", sitemap, {"sitemaps": sitemaps}, name="sitemap-section"),
]
```

## Syndication (RSS/Atom Feeds)

```python
# settings.py
INSTALLED_APPS = [
    # ...
    "django.contrib.syndication",
]

# feeds.py
from django.contrib.syndication.views import Feed
from django.urls import reverse
from .models import Article

class LatestArticlesFeed(Feed):
    title = "My Site News"
    link = "/articles/"
    description = "Latest articles from my site."
    author_email = "editor@example.com"
    author_name = "Editor"
    feed_type = "rss"  # or "atom"

    def items(self):
        return Article.objects.order_by("-published_at")[:20]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return item.summary

    def item_link(self, item):
        return reverse("article-detail", args=[item.slug])

    def item_pubdate(self, item):
        return item.published_at

    def item_updateddate(self, item):
        return item.updated_at

    def item_author_name(self, item):
        return item.author.name

    def item_categories(self, item):
        return [tag.name for tag in item.tags.all()]

# urls.py
from .feeds import LatestArticlesFeed

urlpatterns = [
    path("feed/latest/", LatestArticlesFeed(), name="latest-feed"),
]
```

### Atom and RSS in Tandem

```python
from django.contrib.syndication.views import Feed

class RssFeed(Feed):
    feed_type = "rss"
    title = "My Site"
    link = "/"
    description = "RSS feed"

class AtomFeed(Feed):
    feed_type = "atom"
    title = "My Site"
    link = "/"
    subtitle = "Atom feed"  # Atom uses subtitle instead of description

urlpatterns = [
    path("feed/rss/", RssFeed(), name="rss-feed"),
    path("feed/atom/", AtomFeed(), name="atom-feed"),
]
```

### Feed with Templates

```python
class ArticleFeed(Feed):
    title_template = "feeds/article_title.html"
    description_template = "feeds/article_description.html"

    def items(self):
        return Article.objects.order_by("-published_at")[:20]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["site_name"] = "My Site"
        return context
```

```html
<!-- feeds/article_title.html -->
{{ obj.title }}

<!-- feeds/article_description.html -->
<p>{{ obj.summary }}</p>
<p>Read more at {{ site_domain }}{{ obj.get_absolute_url }}</p>
```

## Sites Framework

```python
# settings.py
INSTALLED_APPS = [
    # ...
    "django.contrib.sites",
]
SITE_ID = 1

# Usage
from django.contrib.sites.models import Site

current_site = Site.objects.get_current()
print(current_site.name)    # "example.com"
print(current_site.domain)  # "example.com"

# In models
from django.contrib.sites.models import Site
from django.contrib.sites.managers import CurrentSiteManager

class Article(models.Model):
    title = models.CharField(max_length=200)
    site = models.ForeignKey(Site, on_delete=models.CASCADE)
    objects = models.Manager()
    on_site = CurrentSiteManager()  # Filters by current site

# Query current site's articles
Article.on_site.all()
```

## Flatpages

```python
# settings.py
INSTALLED_APPS = [
    "django.contrib.flatpages",
]
MIDDLEWARE = [
    "django.contrib.flatpages.middleware.FlatpageFallbackMiddleware",
]

# urls.py
urlpatterns = [
    path("pages/", include("django.contrib.flatpages.urls")),
]

# Usage via admin or code
from django.contrib.flatpages.models import FlatPage

page = FlatPage.objects.create(
    url="/about/",
    title="About Us",
    content="<p>About our company.</p>",
)
page.sites.add(current_site)
```

## Redirects

```python
# settings.py
INSTALLED_APPS = [
    "django.contrib.redirects",
]
MIDDLEWARE = [
    "django.contrib.redirects.middleware.RedirectFallbackMiddleware",
]

# Usage
from django.contrib.redirects.models import Redirect

Redirect.objects.create(
    old_path="/old-page/",
    new_path="/new-page/",
    site=current_site,
)
```

## Humanize

```python
# settings.py
INSTALLED_APPS = [
    "django.contrib.humanize",
]

# Template usage
{% load humanize %}

{{ 12000|intcomma }}          {# 12,000 #}
{{ 12000|intword }}           {# 12 thousand #}
{{ 1000000|intword }}         {# 1.0 million #}
{{ 5|apnumber }}              {# five #}
{{ 3|ordinal }}               {# 3rd #}
{{ 2|ordinal }}               {# 2nd #}
{{ "2024-01-15"|naturaltime }} {# 6 months ago #}
{{ "2024-01-15"|naturalday }}  {# Jan 15 #}
{{ "2024-01-15"|naturalday }}  {# Jan 15 2024 #}
```

## Messages Framework
(See `signals.md` for messages framework reference)

## Admin
(See `admin.md` for admin reference)

## Auth
(See `authentication.md` for auth reference)

## Sessions
(See `signals.md` for sessions reference)

## Static Files

```python
# settings.py
INSTALLED_APPS = [
    "django.contrib.staticfiles",
]
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]

# Management commands
# python manage.py collectstatic
# python manage.py findstatic path/to/file.css
# python manage.py runserver  # Serves static files in dev
```

## External Packages

Django maintains several packages outside the main distribution:

### django-localflavor

```python
# pip install django-localflavor
# Country-specific form fields and widgets

from localflavor.us.forms import USStateSelect, USZipCodeField
from localflavor.us.models import USStateField, USZipCodeField

class Address(models.Model):
    state = USStateField()
    zip_code = USZipCodeField()

class AddressForm(forms.Form):
    state = forms.CharField(widget=USStateSelect())
    zip_code = USZipCodeField()
```

### django-contrib-comments

```python
# pip install django-contrib-comments
# Framework for attaching comments to any model

INSTALLED_APPS = [
    "django_comments",
]

# urls.py
urlpatterns = [
    path("comments/", include("django_comments.urls")),
]

# Template tags
{% load comments %}
{% get_comment_count for object as comment_count %}
{% render_comment_list for object %}
{% render_comment_form for object %}
```

### django-formtools

```python
# pip install django-formtools
# Form wizards, form previews, and session-stored forms

from formtools.wizard.views import SessionWizardView

class ContactWizard(SessionWizardView):
    template_name = "contact_wizard.html"

    def done(self, form_list, **kwargs):
        return render(self.request, "done.html", {
            "form_data": [form.cleaned_data for form in form_list],
        })

# urls.py
urlpatterns = [
    path("contact/", ContactWizard.as_view([
        ("step1", Step1Form),
        ("step2", Step2Form),
    ])),
]
```

## How to Delete a Django Application

```python
# 1. Remove the app from INSTALLED_APPS
# 2. Remove all references to the app's models (foreign keys, imports)
# 3. Create a migration to remove the app's tables
#    python manage.py makemigrations
# 4. Run the migration
#    python manage.py migrate
# 5. Remove the app's migrations directory or mark as deleted

# To remove an app's tables without removing the app itself:
from django.db import migrations

class Migration(migrations.Migration):
    operations = [
        migrations.DeleteModel("MyModel"),
    ]

# To completely remove an app from migration history:
# python manage.py migrate myapp zero
# Then delete the app's migrations folder
```
