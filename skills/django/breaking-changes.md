# Breaking Changes — Django 5.x to 6.0 Migration

## Python Version Support

Django 6.0 requires **Python 3.12, 3.13, or 3.14**. Python 3.10 and 3.11 are no longer supported.

## New Features in Django 6.0

### Composite Primary Keys
```python
class OrderItem(models.Model):
    order_id = models.IntegerField()
    line_number = models.IntegerField()
    product = models.CharField(max_length=100)

    pk = models.CompositePrimaryKey("order_id", "line_number")
```

### Tasks Framework
New built-in background task support:
```python
# settings.py
TASKS = {
    "default": {
        "BACKEND": "django.tasks.backends.database.DatabaseBackend",
    }
}

# Usage
from django.tasks import task

@task
def send_welcome_email(user_id):
    user = User.objects.get(pk=user_id)
    send_mail(...)
```

### Content Security Policy (CSP)
Built-in CSP middleware:
```python
MIDDLEWARE = [
    "django.middleware.csp.ContentSecurityPolicyMiddleware",
]
CSP_DEFAULT_SRC = "'self'"
CSP_SCRIPT_SRC = "'self'"
```

### Async ORM Improvements
Full async support for ORM operations:
- `aget()`, `acreate()`, `aupdate()`, `adelete()`
- `acount()`, `aexists()`, `aget_or_create()`, `aupdate_or_create()`
- `afirst()`, `alast()`, `abulk_create()`
- Async iteration: `async for obj in QuerySet:`
- `asave()`, `adelete()` on model instances

### Async Cache
Full async cache API:
- `aset()`, `aget()`, `adelete()`, `aclear()`
- `aget_many()`, `aset_many()`
- `aget_or_set()`, `ahas_key()`, `aincr()`, `adecr()`

### Async Testing
```python
from django.test import AsyncClient, TransactionTestCase

class AsyncTest(TransactionTestCase):
    async def test_async_view(self):
        client = AsyncClient()
        response = await client.get("/api/")
```

## Removed/Deprecated Features

### Removed in 6.0

- **`django.utils.translation.ugettext`** and variants — use `gettext` instead
- **`django.utils.text.unescape_entities()`** — use `html.unescape()`
- **`django.utils.http.is_safe_url()`** — use `url_has_allowed_host_and_scheme()`
- **`BaseCommand.requires_system_checks`** boolean — use `"requires_system_checks"` tag
- **`TestCase` async methods** — use `AsyncClient` with `TransactionTestCase`
- **`django.contrib.postgres.fields.JSONField`** — use `models.JSONField`
- **`django.contrib.postgres.fields.ArrayField`** on non-PostgreSQL databases
- **Support for `pytz`** — Django now uses `zoneinfo` by default
- **`USE_L10N`** setting — deprecated, localization is always on
- **`USE_DEPRECATED_PYTZ`** setting — removed
- **`django.utils.timezone.utc`** — use `datetime.timezone.utc`

### Deprecated (will be removed in future)

- **`Model._meta.get_field_by_name()`** — use `get_field()`
- **`django.contrib.gis.geoip`** — use `geoip2` library
- **`django.utils.encoding.force_text()`** — use `force_str()`
- **`django.utils.translation.ugettext_lazy()`** — use `gettext_lazy()`

## Migration Steps

### 1. Update Python

```bash
# Ensure Python 3.12+
python --version
```

### 2. Update Dependencies

```bash
pip install django==6.0
pip install --upgrade djangorestframework
pip install --upgrade django-filter
# Check all third-party packages for Django 6.0 compatibility
```

### 3. Replace pytz with zoneinfo

```python
# Before (pytz)
import pytz
timezone = pytz.timezone("America/New_York")

# After (zoneinfo)
from zoneinfo import ZoneInfo
timezone = ZoneInfo("America/New_York")

# settings.py
# Remove: USE_DEPRECATED_PYTZ = True
# TIME_ZONE = "UTC" (still works the same)
```

### 4. Replace Deprecated Translation Functions

```python
# Before
from django.utils.translation import ugettext as _, ugettext_lazy as _l

# After
from django.utils.translation import gettext as _, gettext_lazy as _l
```

### 5. Replace Deprecated Utility Functions

```python
# Before
from django.utils.encoding import force_text
from django.utils.http import is_safe_url

# After
from django.utils.encoding import force_str
from django.utils.http import url_has_allowed_host_and_scheme
```

### 6. Update Settings

```python
# Remove these (no longer needed):
# USE_L10N = True  # Always enabled now
# USE_DEPRECATED_PYTZ = True  # Removed
```

### 7. Run Checks

```bash
python manage.py check --deploy
python manage.py test
```

## Database Backend Changes

- **PostgreSQL**: Minimum version 14
- **MySQL**: Minimum version 8.0.11
- **MariaDB**: Minimum version 10.4
- **SQLite**: Minimum version 3.27

## ASGI Changes

- ASGI is now the default for new projects
- `runserver` supports async views natively
- WebSocket support via Django Channels 4.x

## Admin Changes

- New `show_facets` option for ModelAdmin (faceted filtering in sidebar)
- Improved responsive design
- Dark mode support

## Form Changes

- `Form.as_div()` method added (renders with `<div>` wrappers)
- Improved widget template rendering

## URL Changes

- `re_path` with unnamed groups is deprecated — use named groups
- `django.urls.conf.path()` now properly handles `re_path` patterns
