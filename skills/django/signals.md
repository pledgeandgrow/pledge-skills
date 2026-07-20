# Signals, Sessions, Messages, Pagination — Django 6.0

## Signals

Signals allow decoupled applications to get notified when actions occur elsewhere.

### Built-in Signals

```python
from django.db.models.signals import (
    pre_save, post_save,
    pre_delete, post_delete,
    pre_init, post_init,
    m2m_changed,
    class_prepared,
)
from django.core.signals import (
    request_started, request_finished,
    got_request_exception,
    setting_changed,
)
from django.contrib.auth.signals import (
    user_logged_in, user_logged_out, user_login_failed,
)

# Model signals
def article_saved(sender, instance, created, **kwargs):
    if created:
        print(f"New article: {instance.title}")
    else:
        print(f"Updated article: {instance.title}")

post_save.connect(article_saved, sender=Article)

# Or using @receiver decorator
from django.dispatch import receiver

@receiver(post_save, sender=Article)
def notify_subscribers(sender, instance, created, **kwargs):
    if created:
        send_notification(instance)

@receiver(pre_delete, sender=Article)
def cleanup_files(sender, instance, **kwargs):
    if instance.image:
        instance.image.delete(save=False)

# Auth signals
@receiver(user_logged_in)
def on_login(sender, request, user, **kwargs):
    # Update last activity, log event, etc.
    pass

@receiver(user_logged_out)
def on_logout(sender, request, user, **kwargs):
    pass

@receiver(user_login_failed)
def on_login_failed(sender, credentials, request, **kwargs):
    # Log failed login attempt
    pass

# Request signals
@receiver(request_started)
def on_request_started(sender, environ, **kwargs):
    pass

@receiver(request_finished)
def on_request_finished(sender, **kwargs):
    pass

# M2M changed signal
@receiver(m2m_changed, sender=Article.tags.through)
def tags_changed(sender, instance, action, reverse, model, pk_set, **kwargs):
    if action == "post_add":
        print(f"Tags added to {instance}: {pk_set}")
    elif action == "post_remove":
        print(f"Tags removed from {instance}: {pk_set}")
    elif action == "post_clear":
        print(f"All tags cleared from {instance}")
```

### Signal Arguments

| Signal | Arguments |
|--------|-----------|
| `pre_save` | sender, instance, raw, using, update_fields |
| `post_save` | sender, instance, created, raw, using, update_fields |
| `pre_delete` | sender, instance, using |
| `post_delete` | sender, instance, using |
| `m2m_changed` | sender, instance, action, reverse, model, pk_set, using |
| `user_logged_in` | sender, request, user |
| `user_logged_out` | sender, request, user |
| `user_login_failed` | sender, credentials, request |
| `request_started` | sender, environ |
| `request_finished` | sender |

### Custom Signals

```python
from django.dispatch import Signal

# Define signal
article_published = Signal()

# Send signal
article_published.send(
    sender=Article,
    instance=article,
    published_at=timezone.now(),
)

# Receive signal
@receiver(article_published, sender=Article)
def on_article_published(sender, instance, **kwargs):
    send_email_notifications(instance)

# Using providing_args (deprecated in favor of type hints)
# article_published = Signal()
```

### Disconnecting Signals

```python
post_save.disconnect(article_saved, sender=Article)
```

### Signals in ready()

```python
# myapp/apps.py
from django.apps import AppConfig

class MyAppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "myapp"

    def ready(self):
        from . import signals  # noqa
```

## Sessions

### Session Backends

```python
# settings.py
SESSION_ENGINE = "django.contrib.sessions.backends.db"          # Database
SESSION_ENGINE = "django.contrib.sessions.backends.cached_db"    # DB + cache
SESSION_ENGINE = "django.contrib.sessions.backends.cache"        # Cache only
SESSION_ENGINE = "django.contrib.sessions.backends.file"         # File system
SESSION_ENGINE = "django.contrib.sessions.backends.signed_cookies"  # Cookies
```

### Using Sessions

```python
def my_view(request):
    # Set
    request.session["key"] = "value"
    request.session["user_id"] = 42
    request.session["preferences"] = {"theme": "dark", "lang": "en"}

    # Get
    value = request.session.get("key", "default")
    user_id = request.session.get("user_id")

    # Delete
    del request.session["key"]
    request.session.pop("key", None)

    # Check
    if "key" in request.session:
        pass

    # Session methods
    request.session.set_expiry(3600)  # 1 hour
    request.session.set_expiry(0)     # At browser close
    request.session.set_expiry(None)  # Use global setting
    request.session.flush()           # Delete session + regenerate key
    request.session.cycle_key()       # New session key (keep data)
    request.session.clear()           # Remove all data
    request.session.has_key("key")
    request.session.keys()
    request.session.items()
    request.session.get_expiry_age()
    request.session.get_expire_at_browser_close()

    # Session attributes
    request.session.session_key  # Current session key
    request.session.modified     # Whether session was modified
    request.session.accessed     # Whether session was accessed
```

### Session Settings

```python
SESSION_COOKIE_NAME = "sessionid"
SESSION_COOKIE_AGE = 60 * 60 * 24 * 7  # 1 week
SESSION_COOKIE_SECURE = True   # HTTPS only
SESSION_COOKIE_HTTPONLY = True  # Not accessible via JS
SESSION_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_DOMAIN = ".example.com"
SESSION_COOKIE_PATH = "/"
SESSION_SAVE_EVERY_REQUEST = False
SESSION_EXPIRE_AT_BROWSER_CLOSE = False
SESSION_SERIALIZATION_FORMAT = "json"
```

## Messages Framework

```python
from django.contrib import messages

def my_view(request):
    # Add messages
    messages.debug(request, "Debug message (only with DEBUG=True)")
    messages.info(request, "Informational message")
    messages.success(request, "Operation completed successfully!")
    messages.warning(request, "This is a warning")
    messages.error(request, "Something went wrong")

    # With extra tags
    messages.success(request, "Saved!", extra_tags="alert-success")

    # With fail_silently (useful when no messages middleware)
    messages.info(request, "Info", fail_silently=True)
```

### Displaying Messages in Templates

```html
{% if messages %}
<ul class="messages">
    {% for message in messages %}
        <li class="{{ message.tags }}">
            {{ message }}
        </li>
    {% endfor %}
</ul>
{% endif %}

{# Message attributes #}
{# message.level - numeric level (10=DEBUG, 20=INFO, 25=SUCCESS, 30=WARNING, 40=ERROR) #}
{# message.level_tag - string tag ("debug", "info", "success", "warning", "error") #}
{# message.tags - all tags combined #}
{# message.extra_tags - extra tags string #}
{# message.message - the message text #}
```

### Message Levels

```python
# settings.py
from django.contrib.messages import constants as messages

MESSAGE_TAGS = {
    messages.DEBUG: "alert-secondary",
    messages.INFO: "alert-info",
    messages.SUCCESS: "alert-success",
    messages.WARNING: "alert-warning",
    messages.ERROR: "alert-danger",
}

# Custom levels
MESSAGE_LEVEL = messages.INFO  # Minimum level to display
```

## Pagination

### In Views

```python
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import render
from .models import Article

def article_list(request):
    article_list = Article.objects.all()
    paginator = Paginator(article_list, 25)  # 25 per page

    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    return render(request, "articles/list.html", {"page_obj": page_obj})

# With class-based views (automatic):
class ArticleListView(ListView):
    model = Article
    paginate_by = 25
```

### In Templates

```html
{% if page_obj.has_other_pages %}
<nav aria-label="Page navigation">
    <ul class="pagination">
        {% if page_obj.has_previous %}
            <li><a href="?page=1">&laquo; First</a></li>
            <li><a href="?page={{ page_obj.previous_page_number }}">Previous</a></li>
        {% endif %}

        <li class="active">
            <span>Page {{ page_obj.number }} of {{ page_obj.paginator.num_pages }}</span>
        </li>

        {% if page_obj.has_next %}
            <li><a href="?page={{ page_obj.next_page_number }}">Next</a></li>
            <li><a href="?page={{ page_obj.paginator.num_pages }}">Last &raquo;</a></li>
        {% endif %}
    </ul>
</nav>
{% endif %}

{# Iterate over items #}
{% for article in page_obj %}
    {{ article.title }}
{% endfor %}
```

### Paginator API

```python
paginator = Paginator(object_list, per_page, orphans=0, allow_empty_first_page=True)

# Attributes
paginator.count          # Total objects
paginator.num_pages      # Total pages
paginator.page_range     # range(1, num_pages + 1)
paginator.per_page       # Items per page
paginator.object_list    # The full queryset

# Methods
page = paginator.page(page_number)  # Get a Page object
paginator.get_page(page_number)     # Get page (handles invalid gracefully)

# Page object
page.object_list        # Items on this page
page.number             # Current page number
page.has_next()         # Has next page
page.has_previous()     # Has previous page
page.has_other_pages()  # Has next or previous
page.next_page_number() # Next page number
page.previous_page_number()  # Previous page number
page.start_index()      # 1-based index of first item
page.end_index()        # 1-based index of last item
page.paginator          # The Paginator object
```
