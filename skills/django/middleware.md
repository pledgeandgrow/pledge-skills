# Middleware — Django 6.0

## Overview

Middleware is a framework of hooks into Django's request/response processing. It's a light, low-level "plugin" system for globally altering Django's input or output.

## Middleware Order

```python
MIDDLEWARE = [
    # Security first
    "django.middleware.security.SecurityMiddleware",

    # Clickjacking protection
    "django.middleware.clickjacking.XFrameOptionsMiddleware",

    # Sessions (before auth)
    "django.contrib.sessions.middleware.SessionMiddleware",

    # Common (handles URL rewriting, etc.)
    "django.middleware.common.CommonMiddleware",

    # CSRF (before auth)
    "django.middleware.csrf.CsrfViewMiddleware",

    # Authentication
    "django.contrib.auth.middleware.AuthenticationMiddleware",

    # Messages (after sessions and auth)
    "django.contrib.messages.middleware.MessageMiddleware",

    # Compression (last)
    "django.middleware.gzip.GZipMiddleware",

    # Django 6.0
    "django.middleware.csp.ContentSecurityPolicyMiddleware",
]
```

## Writing Custom Middleware

### Function-Based Middleware

```python
def simple_middleware(get_response):
    # One-time configuration and initialization.
    def middleware(request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        response = get_response(request)
        # Code to be executed for each request/response after
        # the view is called.
        return response
    return middleware
```

### Async-Supporting Middleware

```python
import asyncio
from django.utils.decorators import sync_and_async_middleware

@sync_and_async_middleware
def simple_middleware(get_response):
    if asyncio.iscoroutinefunction(get_response):
        async def middleware(request):
            # Async pre-processing
            response = await get_response(request)
            # Async post-processing
            return response
    else:
        def middleware(request):
            # Sync pre-processing
            response = get_response(request)
            # Sync post-processing
            return response
    return middleware
```

### Class-Based Middleware

```python
class SimpleMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        response = self.get_response(request)
        # Code to be executed for each request/response after
        # the view is called.
        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        # Called just before Django calls the view.
        # Return None to continue, or HttpResponse to short-circuit.
        return None

    def process_exception(self, request, exception):
        # Called when a view raises an exception.
        # Return None to let Django handle it, or HttpResponse to override.
        return None

    def process_template_response(self, request, response):
        # Called for TemplateResponse objects.
        # Must return a response object.
        return response
```

## Practical Middleware Examples

### Request Timing

```python
import time

class TimingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        response = self.get_response(request)
        duration = time.time() - start_time
        response["X-Response-Time"] = f"{duration:.3f}s"
        return response
```

### CORS Middleware

```python
class CORSMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        if request.method == "OPTIONS":
            from django.http import HttpResponse
            response = HttpResponse()
            response["Access-Control-Allow-Origin"] = "*"
            response["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
            response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
            return response
        return None
```

### Maintenance Mode

```python
class MaintenanceModeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        from django.conf import settings
        from django.http import HttpResponse

        if getattr(settings, "MAINTENANCE_MODE", False):
            if not request.user.is_superuser:
                return HttpResponse("Site under maintenance", status=503)

        return self.get_response(request)
```

### Request Logging

```python
import logging

logger = logging.getLogger(__name__)

class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        logger.info(
            f"{request.method} {request.path} - {response.status_code} "
            f"({request.META.get('REMOTE_ADDR')})"
        )
        return response
```

### API Versioning

```python
class APIVersionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        version = request.headers.get("X-API-Version", "v1")
        request.api_version = version
        response = self.get_response(request)
        response["X-API-Version"] = version
        return response
```

## Built-in Middleware Reference

### SecurityMiddleware
- SSL redirect
- HSTS (HTTP Strict Transport Security)
- Content type nosniff
- Referrer policy

### SessionMiddleware
- Enables session support
- Adds `request.session`

### CommonMiddleware
- URL rewriting (appends slash, adds www)
- Disallows URLs visited by a different method than allowed
- Content length header

### CsrfViewMiddleware
- CSRF protection for POST forms
- Adds `request.csrf_processing_done`

### AuthenticationMiddleware
- Adds `request.user` (from session)
- Uses `AUTHENTICATION_BACKENDS`

### MessageMiddleware
- Adds `request._messages` (messages framework)
- Stores messages in session

### XFrameOptionsMiddleware
- Sets `X-Frame-Options` header
- Clickjacking protection

### GZipMiddleware
- Compresses responses for clients that accept gzip
- Must be last in middleware stack

### LocaleMiddleware
- Language detection based on URL, session, cookie, Accept-Language
- Adds `request.LANGUAGE_CODE`

### ConditionalGetMiddleware
- Support for conditional GET (ETag, Last-Modified)

### ContentSecurityPolicyMiddleware (Django 6.0)
- Sets CSP headers
- Configurable via CSP_* settings

## Middleware Hooks

### process_request(request)
Called for each request, before view. Return `None` to continue, or `HttpResponse` to short-circuit.

### process_view(request, view_func, view_args, view_kwargs)
Called just before the view. Return `None` to continue, or `HttpResponse` to short-circuit.

### process_response(request, response)
Called after view returns. Must return an `HttpResponse` object.

### process_exception(request, exception)
Called when a view raises an exception. Return `None` to let Django handle, or `HttpResponse` to override.

### process_template_response(request, response)
Called for `TemplateResponse` objects. Must return a response.
