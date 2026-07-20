# Security — Django 6.0

## Overview

Django provides built-in protection against:
- Cross Site Scripting (XSS)
- Cross Site Request Forgery (CSRF)
- SQL Injection
- Clickjacking
- Content Security Policy (CSP)
- SSL/HTTPS
- Host Header Validation
- Session Security

## XSS Protection

Django templates **auto-escape** HTML by default. Specific characters are escaped:
- `<` → `&lt;`
- `>` → `&gt;`
- `'` → `&#39;`
- `"` → `&quot;`
- `&` → `&amp;`

```html
{# Auto-escaped (safe) #}
{{ user_input }}

{# NOT escaped (dangerous — use with caution) #}
{{ user_input|safe }}

{# Disable auto-escaping for block #}
{% autoescape off %}
    {{ content }}
{% endautoescape %}
```

**Caution with:** `mark_safe`, `is_safe` in custom template tags, `safe` filter, `autoescape off`.

## CSRF Protection

```python
# settings.py — enabled by default
MIDDLEWARE = [
    "django.middleware.csrf.CsrfViewMiddleware",
]

# In templates (forms):
# <form method="post">
#     {% csrf_token %}
#     ...
# </form>
```

### Per-View Control

```python
from django.views.decorators.csrf import csrf_exempt, csrf_protect, ensure_csrf_cookie

@csrf_exempt  # Disable CSRF (use with extreme caution)
def api_webhook(request):
    pass

@csrf_protect  # Explicitly enable (if middleware disabled)
def protected_view(request):
    pass

@ensure_csrf_cookie  # Ensure CSRF cookie is set
def set_cookie_view(request):
    pass
```

### AJAX and CSRF

```javascript
// Get CSRF token from cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Include in fetch requests
fetch("/api/endpoint/", {
    method: "POST",
    headers: {
        "X-CSRFToken": getCookie("csrftoken"),
        "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
});
```

### CSRF Settings

```python
# settings.py
CSRF_COOKIE_NAME = "csrftoken"
CSRF_COOKIE_HTTPONLY = False  # Must be False for JS access
CSRF_COOKIE_SECURE = True  # HTTPS only
CSRF_COOKIE_SAMESITE = "Lax"  # or "Strict"
CSRF_COOKIE_AGE = 60 * 60 * 24 * 7  # 1 week
CSRF_TRUSTED_ORIGINS = ["https://example.com", "https://*.example.com"]
CSRF_USE_SESSIONS = False  # Store token in session instead of cookie
CSRF_COOKIE_DOMAIN = ".example.com"
CSRF_HEADER_NAME = "HTTP_X_CSRFTOKEN"
```

## SQL Injection Protection

Django's ORM uses **query parameterization** — SQL code is separated from parameters, which are escaped by the database driver.

```python
# Safe — parameterized
Article.objects.filter(title=user_input)
Article.objects.raw("SELECT * FROM articles WHERE title = %s", [user_input])

# DANGEROUS — string formatting
Article.objects.raw(f"SELECT * FROM articles WHERE title = '{user_input}'")  # NEVER DO THIS

# Be careful with:
# - extra() method
# - RawSQL expressions
# - cursor.execute() with string formatting
```

## Clickjacking Protection

```python
# settings.py — enabled by default
MIDDLEWARE = [
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# Default: DENY (prevents framing entirely)
X_FRAME_OPTIONS = "DENY"
# Or: SAMEORIGIN (allows same-site framing)
X_FRAME_OPTIONS = "SAMEORIGIN"
```

### Per-View Control

```python
from django.views.decorators.clickjacking import xframe_options_exempt, xframe_options_sameorigin, xframe_options_deny

@xframe_options_exempt
def embeddable_view(request):
    pass

@xframe_options_sameorigin
def same_origin_view(request):
    pass
```

## Content Security Policy (CSP) — Django 6.0

```python
# settings.py
MIDDLEWARE = [
    "django.middleware.csp.ContentSecurityPolicyMiddleware",
]

# CSP settings
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "same-origin"

# CSP directives
CSP_DEFAULT_SRC = "'self'"
CSP_SCRIPT_SRC = "'self' 'unsafe-inline' cdnjs.cloudflare.com"
CSP_STYLE_SRC = "'self' 'unsafe-inline' cdnjs.cloudflare.com"
CSP_IMG_SRC = "'self' data: https:"
CSP_FONT_SRC = "'self' cdnjs.cloudflare.com"
CSP_CONNECT_SRC = "'self' https://api.example.com"
CSP_FRAME_SRC = "'none'"
CSP_OBJECT_SRC = "'none'"
CSP_BASE_URI = "'self'"
CSP_REPORT_URI = "/csp-report/"
CSP_REPORT_ONLY = True  # Report but don't enforce (testing phase)
```

## SSL/HTTPS

```python
# settings.py
SECURE_SSL_REDIRECT = True  # Redirect HTTP to HTTPS
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = True  # HTTPS only cookies
CSRF_COOKIE_SECURE = True  # HTTPS only CSRF cookie
SECURE_REDIRECT_EXEMPT = [r"/health-check/"]  # Exempt paths from SSL redirect
```

## Host Header Validation

```python
# settings.py
ALLOWED_HOSTS = ["example.com", "www.example.com", ".example.com"]
# In development:
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0", "[::1]"]
# For testing:
ALLOWED_HOSTS = ["*"]  # Never use in production!
```

## Session Security

```python
# settings.py
SESSION_COOKIE_AGE = 60 * 60 * 24 * 7  # 1 week
SESSION_COOKIE_SECURE = True  # HTTPS only
SESSION_COOKIE_HTTPONLY = True  # Not accessible via JavaScript
SESSION_COOKIE_SAMESITE = "Lax"  # or "Strict"
SESSION_EXPIRE_AT_BROWSER_CLOSE = False
SESSION_SAVE_EVERY_REQUEST = True  # Reset expiry on each request
SESSION_ENGINE = "django.contrib.sessions.backends.db"  # or cache, file, etc.
```

## Security Middleware Stack (Recommended)

```python
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.gzip.GZipMiddleware",
]
```

## Deployment Checklist

```bash
python manage.py check --deploy
```

Key production settings:
```python
DEBUG = False
SECRET_KEY = os.environ["SECRET_KEY"]  # From environment
ALLOWED_HOSTS = ["example.com"]
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "same-origin"
X_FRAME_OPTIONS = "DENY"
```

## User-Uploaded Content Security

- Validate file types and sizes
- Serve uploaded files from a separate domain (not main domain)
- Never serve user-uploaded HTML
- Use `Content-Disposition: attachment` for downloads
- Scan for malicious content
