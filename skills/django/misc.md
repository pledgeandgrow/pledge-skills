# Miscellaneous — Django 6.0

## Cryptographic Signing

### Signer — Basic Signing

```python
from django.core.signing import Signer

signer = Signer()
value = signer.sign("My string")
# 'My string:v9G-nxfz3iQGTXrePqYPlGvH79WTcIgj1QIQSUODTW0'

original = signer.unsign(value)
# 'My string'

# With custom key
signer = Signer(key="my-other-secret")

# With custom separator (cannot use URL-safe base64 chars: alphanumeric, -, _)
signer = Signer(sep="/")

# With custom algorithm
signer = Signer(algorithm="sha512")
```

### TimestampSigner — Time-limited Signing

```python
from django.core.signing import TimestampSigner

signer = TimestampSigner()
value = signer.sign("My string")
# 'My string:1stLrZ:v9G-nxfz3iQGTXrePqYPlGvH79WTcIgj1QIQSUODTW0'
# Format: value:timestamp:signature

# Unsign with max age (seconds)
try:
    original = signer.unsign(value, max_age=60)  # Valid for 60 seconds
except signing.SignatureExpired:
    print("Signature expired")
except signing.BadSignature:
    print("Invalid signature")
```

### Signing Complex Data Structures

```python
from django.core import signing

# Sign objects (dict, list, tuple)
signer = signing.TimestampSigner()
signed_obj = signer.sign_object({"message": "Hello!"})
# 'eyJtZXNzYWdlIjoiSGVsbG8hIn0:bzb48DBk...'

obj = signer.unsign_object(signed_obj)
# {'message': 'Hello!'}

# Using dumps() / loads() shortcuts
value = signing.dumps({"foo": "bar"})
# 'eyJmb28iOiJiYXIifQ:1stLsC:JItq2ZVjmAK6ivrWI...'

data = signing.loads(value)
# {'foo': 'bar'}

# With max_age
data = signing.loads(value, max_age=3600)  # 1 hour

# With salt (domain separation)
value = signing.dumps({"foo": "bar"}, salt="myapp-password-reset")
data = signing.loads(value, salt="myapp-password-reset")
```

### Exceptions

```python
from django.core import signing

try:
    signer.unsign(tampered_value)
except signing.BadSignature:
    print("Invalid signature")

try:
    signer.unsign(expired_value, max_age=60)
except signing.SignatureExpired:
    print("Signature expired")
```

### Practical Use Cases

#### Password Reset Tokens

```python
from django.core.signing import TimestampSigner

def generate_reset_token(user):
    signer = TimestampSigner(salt="password-reset")
    return signer.sign_object({"user_id": user.pk, "email": user.email})

def verify_reset_token(token, max_age=3600):
    signer = TimestampSigner(salt="password-reset")
    try:
        data = signer.unsign_object(token, max_age=max_age)
        return data
    except signing.BadSignature:
        return None
```

#### Signed Cookies

```python
from django.core.signing import dumps, loads

response = HttpResponse("Cookie set")
response.set_signed_cookie("user_pref", dumps({"theme": "dark"}))

# Reading
def my_view(request):
    try:
        data = loads(request.get_signed_cookie("user_pref"))
        theme = data.get("theme", "light")
    except signing.BadSignature:
        theme = "light"
```

#### Signed URLs

```python
from django.core.signing import TimestampSigner
from django.urls import reverse

def generate_invite_link(email):
    signer = TimestampSigner(salt="invite")
    token = signer.sign(email)
    return reverse("accept-invite") + f"?token={token}"

def verify_invite_link(token, max_age=7 * 86400):  # 7 days
    signer = TimestampSigner(salt="invite")
    try:
        return signer.unsign(token, max_age=max_age)
    except signing.BadSignature:
        return None
```

## Unicode in Django

### Unicode Strings

Django uses UTF-8 encoding throughout. All strings are Unicode by default.

```python
# Django handles Unicode in models, templates, forms, and database
class Article(models.Model):
    title = models.CharField(max_length=200)  # Supports Unicode
    # Can store: "日本語のタイトル", "Tïtlé wîth àccénts", etc.
```

### DEFAULT_CHARSET

```python
# settings.py
DEFAULT_CHARSET = "utf-8"  # Default, used for HTTP responses
```

### Unicode in Templates

```html
{# Templates handle Unicode natively #}
<h1>{{ article.title }}</h1>
{# Works with any Unicode characters #}
```

### Unicode in URLs

```python
from django.urls import path

# Django handles Unicode in URL patterns
urlpatterns = [
    path("café/", views.cafe_view, name="cafe"),
    path("日本語/", views.japanese_view, name="japanese"),
]
```

### Database Encoding

```python
# Ensure your database uses UTF-8
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "OPTIONS": {
            "charset": "utf8",
        },
    },
}
```

### Unicode Normalization

```python
import unicodedata

# Normalize Unicode strings for comparison
normalized = unicodedata.normalize("NFC", "café")  # Composed form
normalized = unicodedata.normalize("NFD", "café")  # Decomposed form
```

## Admin Documentation Generator

### Setup

```python
# settings.py
INSTALLED_APPS = [
    # ...
    "django.contrib.admindocs",
]

# urls.py
urlpatterns = [
    path("admin/doc/", include("django.contrib.admindocs.urls")),
    path("admin/", admin.site.urls),
]
```

### Requirements

- `docutils` must be installed: `pip install docutils`
- Admin docs are available at `/admin/doc/`

### Documenting Models

```python
# myapp/models.py

class Article(models.Model):
    """
    Represents a news article on the site.

    :title: The headline of the article (max 200 chars)
    :body: The main content of the article
    :published: Whether the article is visible to public
    """

    title = models.CharField(
        max_length=200,
        help_text="The headline of the article.",
    )
    body = models.TextField(
        help_text="The main content of the article.",
    )
    published = models.BooleanField(
        default=False,
        help_text="Whether the article is visible to the public.",
    )

    class Meta:
        verbose_name = "Article"
        verbose_name_plural = "Articles"
```

### Documenting Views

```python
def article_detail(request, article_id):
    """
    Display a single article.

    **Context:**
    ``article``
        The :model:`myapp.Article` instance being displayed.

    **Template:**
    :template:`myapp/article_detail.html`
    """
    article = get_object_or_404(Article, pk=article_id)
    return render(request, "myapp/article_detail.html", {"article": article})
```

### Documenting Template Tags

```python
# myapp/templatetags/myapp_tags.py

def do_current_time(parser, token):
    """
    Formats the current time according to the given format string.

    Usage::
        {% current_time "%Y-%m-%d %I:%M %p" %}

    This tag uses the same syntax as Django's :tfilter:`date` filter.
    """
    # ...
```

### What Admin Docs Provides

- **Model reference**: All models with fields, help text, and docstrings
- **View reference**: All views with their docstrings and templates
- **Template tags reference**: All loaded template tags with documentation
- **Template filters reference**: All loaded template filters
- **Template reference**: All templates in template directories

## Composite Primary Keys (Django 6.0)

Composite primary keys are a major new feature in Django 6.0. See the dedicated reference file `composite-pk.md` for full coverage including:

- Defining composite PKs with `Meta.primary_key`
- Migrating from single-field to composite PKs
- Relations (ForeignKey, ManyToMany) with composite PK models
- Querying by composite PK values
- Forms and validation with composite PKs
- Admin integration
- Serialization
- Limitations and best practices

```python
# Quick example
class Membership(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=50)

    class Meta:
        primary_key = ("group", "user")  # Django 6.0 composite PK
```
