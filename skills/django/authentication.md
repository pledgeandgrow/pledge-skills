# Authentication — Django 6.0

## Built-in Auth System

Django provides `django.contrib.auth` with:
- Users, Groups, Permissions
- Password hashing and verification
- Forms for login, password change/reset
- Middleware for session-based auth
- Template tags for auth

## User Model

```python
from django.contrib.auth.models import User

# Create user
user = User.objects.create_user(username="john", email="john@example.com", password="secret")
user = User.objects.create_superuser(username="admin", email="admin@example.com", password="secret")

# Get user
user = User.objects.get(username="john")

# Attributes
user.username       # Unique username
user.email          # Email address
user.first_name     # First name
user.last_name      # Last name
user.password       # Hashed password (never access directly)
user.is_staff       # Can access admin
user.is_active      # Account is active
user.is_superuser   # Has all permissions
user.date_joined    # DateTime
user.last_login     # DateTime

# Methods
user.set_password("new_password")  # Hash and set password
user.check_password("raw_password")  # Verify password (returns bool)
user.get_username()  # Get username
user.get_full_name()  # "First Last"
user.get_short_name()  # "First"
user.has_perm("app.action")  # Check permission
user.has_perms(["perm1", "perm2"])
user.has_module_perms("app_label")
user.email_user("Subject", "Message")
user.get_user_permissions()
user.get_group_permissions()
user.get_all_permissions()
```

## Custom User Model

```python
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    username = None  # Remove username field
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email
```

```python
# settings.py
AUTH_USER_MODEL = "myapp.CustomUser"
```

## Login and Logout

```python
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect("dashboard")
        else:
            return render(request, "login.html", {"error": "Invalid credentials"})
    return render(request, "login.html")

def logout_view(request):
    logout(request)
    return redirect("home")

@login_required
def dashboard(request):
    return render(request, "dashboard.html", {"user": request.user})
```

## Auth URLs (Built-in)

```python
# urls.py
urlpatterns = [
    path("accounts/", include("django.contrib.auth.urls")),
]
```

Provides these URLs:
- `accounts/login/` — Login view
- `accounts/logout/` — Logout view
- `accounts/password_change/` — Password change
- `accounts/password_change/done/` — Password change done
- `accounts/password_reset/` — Password reset request
- `accounts/password_reset/done/` — Password reset sent
- `accounts/reset/<uidb64>/<token>/` — Password reset confirm
- `accounts/reset/done/` — Password reset complete

## Groups and Permissions

```python
from django.contrib.auth.models import Group, Permission

# Create group
editors = Group.objects.create(name="Editors")
editors.permissions.add(
    Permission.objects.get(codename="add_article"),
    Permission.objects.get(codename="change_article"),
)

# Add user to group
user.groups.add(editors)

# Check group membership
user.groups.filter(name="Editors").exists()
user.has_perm("articles.add_article")

# Custom permissions on model
class Article(models.Model):
    class Meta:
        permissions = [
            ("can_publish", "Can publish articles"),
            ("can_edit_all", "Can edit all articles"),
        ]
```

## Authentication Backends

```python
# Custom backend
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model

class EmailBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        try:
            user = UserModel.objects.get(email=username)
        except UserModel.DoesNotExist:
            return None
        if user.check_password(password) and user.is_active:
            return user
        return None

    def get_user(self, user_id):
        UserModel = get_user_model()
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None
```

```python
# settings.py
AUTHENTICATION_BACKENDS = [
    "myapp.backends.EmailBackend",
    "django.contrib.auth.backends.ModelBackend",  # Fallback
]
```

## Password Management

```python
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm

def change_password(request):
    if request.method == "POST":
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)  # Keep user logged in
            return redirect("password_change_done")
    else:
        form = PasswordChangeForm(request.user)
    return render(request, "change_password.html", {"form": form})
```

### Password Hashers

```python
# settings.py
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
    "django.contrib.auth.hashers.ScryptPasswordHasher",
]
```

### Password Validation

```python
# settings.py
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
     "OPTIONS": {"min_length": 8}},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]
```

## Template Tags

```html
{% load static %}

{% if user.is_authenticated %}
    Welcome, {{ user.get_full_name }}!
    <a href="{% url 'logout' %}">Logout</a>
{% else %}
    <a href="{% url 'login' %}">Login</a>
{% endif %}

{% if perms.articles.add_article %}
    <a href="{% url 'article-create' %}">New Article</a>
{% endif %}
```

## Login Required Mixin (Class-Based Views)

```python
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin

class ArticleCreateView(LoginRequiredMixin, CreateView):
    model = Article
    fields = ["title", "content"]
    login_url = "/login/"
    redirect_field_name = "next"

class ArticleUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Article
    fields = ["title", "content"]
    permission_required = "articles.change_article"
    raise_exception = True
```

## Signals

```python
from django.contrib.auth.signals import user_logged_in, user_logged_out, user_login_failed

def on_login(sender, request, user, **kwargs):
    # Log login event
    pass

user_logged_in.connect(on_login)
```

## Session-Based Auth

Django uses sessions for authentication. The `SessionMiddleware` and `AuthenticationMiddleware` handle this automatically.

```python
# Session auth is automatic with login()
# Manual session access:
request.session["key"] = "value"
value = request.session.get("key")
del request.session["key"]
```

## REMOTE_USER Authentication

For environments where authentication is handled externally (e.g., SSO, Apache auth, nginx auth).

```python
# settings.py
MIDDLEWARE = [
    # Must be before AuthenticationMiddleware
    "django.contrib.auth.middleware.RemoteUserMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
]

AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.RemoteUserBackend",
    "django.contrib.auth.backends.ModelBackend",
]

# Custom header (default: REMOTE_USER)
REMOTE_USER_HEADER = "HTTP_X_FORWARDED_USER"
```

```python
# Custom RemoteUserBackend to create users with specific attributes
from django.contrib.auth.backends import RemoteUserBackend

class CustomRemoteUserBackend(RemoteUserBackend):
    def configure_user(self, request, user, created=True):
        if created:
            user.email = f"{user.username}@example.com"
            user.is_staff = True
            user.save()
        return user

    def clean_username(self, username):
        # Normalize username (e.g., strip domain)
        return username.split("@")[0].lower()
```

```python
# Persistent REMOTE_USER (don't re-authenticate every request)
# settings.py
MIDDLEWARE = [
    "django.contrib.auth.middleware.PersistentRemoteUserMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
]
# Only prompts for external auth on first visit, then uses session
```
