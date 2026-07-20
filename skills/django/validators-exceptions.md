# Validators, Exceptions, Apps API & System Checks — Django 6.0

## Built-in Validators

```python
from django.core.validators import (
    validate_email, validate_slug, validate_unicode_slug,
    validate_ipv4_address, validate_ipv6_address, validate_ipv46_address,
    validate_comma_separated_integer_list,
    int_list_validator,
    MaxValueValidator, MinValueValidator,
    MaxLengthValidator, MinLengthValidator,
    DecimalValidator, EmailValidator,
    URLValidator, RegexValidator,
    ProhibitNullCharactersValidator,
    validate_image_extension,
    FileExtensionValidator,
)
from django.core.exceptions import ValidationError

# Usage in model fields
class Article(models.Model):
    title = models.CharField(
        max_length=200,
        validators=[MinLengthValidator(10)],
    )
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )
    email = models.EmailField(validators=[validate_email])
    website = models.URLField(validators=[URLValidator()])
    slug = models.SlugField(validators=[validate_slug])
    custom_code = models.CharField(
        max_length=10,
        validators=[RegexValidator(r"^[A-Z]{3}-\d{4}$")],
    )

# Usage in forms
class MyForm(forms.Form):
    name = forms.CharField(validators=[MinLengthValidator(3)])
    age = forms.IntegerField(validators=[MinValueValidator(18)])

# Manual validation
try:
    validate_email("invalid-email")
except ValidationError as e:
    print(e.messages)  # ["Enter a valid email address."]
```

### RegexValidator

```python
from django.core.validators import RegexValidator

class Article(models.Model):
    code = models.CharField(
        max_length=20,
        validators=[
            RegexValidator(
                regex=r"^[A-Z]{3}-\d{4}$",
                message="Code must be in format ABC-1234",
                code="invalid_code",
            )
        ],
    )

# Inverse match (reject if matches)
no_spam = RegexValidator(
    regex=r"spam",
    message="No spam allowed",
    inverse_match=True,
)
```

### URLValidator

```python
from django.core.validators import URLValidator

# Default schemes: http, https, ftp, ftps
validate_url = URLValidator()
https_only = URLValidator(schemes=["https"])
custom_schemes = URLValidator(schemes=["http", "https", "ssh"])
```

### EmailValidator

```python
from django.core.validators import EmailValidator

strict_email = EmailValidator(
    message="Enter a valid email",
    code="invalid",
    whitelist=["example.com"],  # Allow only these domains
)
```

### Custom Validators

```python
# Function-based validator
def validate_even(value):
    if value % 2 != 0:
        raise ValidationError(
            "%(value)s is not an even number",
            params={"value": value},
        )

# Class-based validator
class EvenValidator:
    message = "%(value)s is not even"
    code = "invalid"

    def __init__(self, message=None, code=None):
        if message is not None:
            self.message = message
        if code is not None:
            self.code = code

    def __call__(self, value):
        if value % 2 != 0:
            raise ValidationError(self.message, code=self.code, params={"value": value})

# Usage
class MyModel(models.Model):
    number = models.IntegerField(validators=[validate_even, EvenValidator()])
```

## Django Exceptions

### Model Exceptions

```python
from django.core.exceptions import (
    ValidationError,             # Validation failed
    ObjectDoesNotExist,          # Base for DoesNotExist
    MultipleObjectsReturned,     # Query returned multiple objects
    FieldError,                  # Invalid field reference
    FieldDoesNotExist,           # Field doesn't exist on model
)

# ObjectDoesNotExist — base class
try:
    Article.objects.get(pk=999)
except Article.DoesNotExist:  # Subclass of ObjectDoesNotExist
    pass

# MultipleObjectsReturned
try:
    Article.objects.get(title="Duplicate")
except Article.MultipleObjectsReturned:
    pass

# ValidationError
try:
    article.full_clean()
except ValidationError as e:
    print(e.message_dict)  # {"title": ["This field is required."]}
    print(e.messages)      # ["This field is required."]
```

### HTTP Exceptions

```python
from django.core.exceptions import (
    PermissionDenied,       # 403 Forbidden
    SuspiciousOperation,    # 400 Bad Request
    BadRequest,             # 400
    DisallowedHost,         # 400
    DisallowedRedirect,     # 400
    TooManyFieldsSent,      # 400
)

# PermissionDenied
def admin_only_view(request):
    if not request.user.is_staff:
        raise PermissionDenied("Staff only")
    # ...

# SuspiciousOperation subclasses
from django.core.exceptions import (
    SuspiciousFileOperation,
    SuspiciousMultipartForm,
    SuspiciousSessionOperation,
)
```

### URL Exceptions

```python
from django.urls.exceptions import (
    NoReverseMatch,    # URL name not found for reverse()
    Resolver404,       # URL doesn't match any pattern
)
```

### Database Exceptions

```python
from django.db import (
    IntegrityError,      # Constraint violation
    OperationalError,    # DB connection issues
    DatabaseError,       # Base DB exception
    DataError,           # Data too long, etc.
    ProgrammingError,    # SQL syntax error
    InternalError,       # DB internal error
    NotSupportedError,   # Feature not supported
    Error,               # Base for all DB errors
)

try:
    Article.objects.create(title="x" * 300)  # Exceeds max_length
except IntegrityError:
    pass
except DataError:
    pass
```

### Transaction Exceptions

```python
from django.db.transaction import TransactionManagementError

# Raised when transaction is used incorrectly
```

## Apps API

### AppConfig

```python
# myapp/apps.py
from django.apps import AppConfig

class MyAppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "myapp"           # Full Python path
    label = "myapp"          # Short label (default: last part of name)
    verbose_name = "My App"  # Human-readable name
    path = "/custom/path"    # Filesystem path (auto-detected by default)

    def ready(self):
        """Called when the app registry is fully populated."""
        # Import signals, register checks, etc.
        from . import signals  # noqa
        from .checks import check_settings  # noqa
```

### App Registry

```python
from django.apps import apps

# Get app config
app_config = apps.get_app_config("myapp")
print(app_config.name)          # "myapp"
print(app_config.label)         # "myapp"
print(app_config.verbose_name)  # "My App"
print(app_config.path)          # "/path/to/myapp"

# Get model
Article = apps.get_model("myapp", "Article")
Article = apps.get_model("myapp.Article")  # Alternative

# List all apps
for app_config in apps.get_app_configs():
    print(app_config.label)

# List all models
for model in apps.get_models():
    print(model._meta.label)

# Check if app is installed
apps.is_installed("django.contrib.auth")
```

### Custom App Config

```python
# myapp/__init__.py
default_app_config = "myapp.apps.MyAppConfig"

# Or in settings.py (Django 6.0 way)
INSTALLED_APPS = [
    "myapp.apps.MyAppConfig",  # Explicit app config
    # ...
]
```

## System Check Framework

### Running Checks

```bash
# Run all checks
python manage.py check

# Run specific check
python manage.py check --tag models
python manage.py check --tag security
python manage.py check --deploy  # Deployment checks

# List all checks
python manage.py check --list-tags
```

### Writing Custom Checks

```python
# myapp/checks.py
from django.core.checks import Error, Warning, register

@register()
def check_example(app_configs, **kwargs):
    errors = []
    if not hasattr(settings, "MY_SETTING"):
        errors.append(
            Error(
                "MY_SETTING is not defined",
                hint="Add MY_SETTING to your settings.py",
                id="myapp.E001",
            )
        )
    return errors

# Check with specific tag
@register("myapp")
def check_another(app_configs, **kwargs):
    errors = []
    # ...
    return errors

# Check for a specific model
from django.core.checks import register, Tags

@register(Tags.models)
def check_my_model(app_configs, **kwargs):
    errors = []
    from .models import MyModel
    if not MyModel._meta.ordering:
        errors.append(
            Warning(
                "MyModel has no ordering specified",
                hint="Set ordering in Meta class",
                id="myapp.W001",
            )
        )
    return errors
```

### Check Message Types

```python
from django.core.checks import Error, Warning, Info, Debug

# Error — critical, should be fixed
Error("Message", hint="Fix hint", id="myapp.E001", obj=SomeModel)

# Warning — non-critical
Warning("Message", hint="Fix hint", id="myapp.W001")

# Info — informational
Info("Message", id="myapp.I001")

# Debug — debug-level
Debug("Message", id="myapp.D001")
```

### Registering Checks in AppConfig

```python
class MyAppConfig(AppConfig):
    name = "myapp"

    def ready(self):
        from . import checks  # noqa
```

### Built-in Check Tags

| Tag | Description |
|-----|-------------|
| `admin` | Admin site checks |
| `async_support` | Async compatibility |
| `caches` | Cache configuration |
| `compatibility` | Backward compatibility |
| `database` | Database configuration |
| `files` | File handling |
| `models` | Model field/relationship checks |
| `security` | Security configuration |
| `sites` | Sites framework |
| `staticfiles` | Static files |
| `templates` | Template configuration |
| `translation` | i18n/l10n |
| `urls` | URL configuration |
