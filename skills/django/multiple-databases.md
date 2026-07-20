# Multiple Databases — Django 6.0

## Defining Multiple Databases

```python
# settings.py
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "myapp",
        "USER": "user",
        "PASSWORD": "pass",
        "HOST": "localhost",
        "PORT": "5432",
    },
    "users": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "users_db",
        "USER": "user",
        "PASSWORD": "pass",
        "HOST": "localhost",
        "PORT": "5432",
    },
    "analytics": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "analytics_db",
        "USER": "user",
        "PASSWORD": "pass",
        "HOST": "localhost",
        "PORT": "3306",
    },
}
```

## Synchronizing Databases

```bash
# Migrate all databases
python manage.py migrate

# Migrate specific database
python manage.py migrate --database=users
python manage.py migrate --database=analytics

# Run specific app migration on specific database
python manage.py migrate auth --database=users

# Create superuser on specific database
python manage.py createsuperuser --database=users

# Dump data from specific database
python manage.py dumpdata --database=analytics > analytics.json

# Load data to specific database
python manage.py loaddata data.json --database=users
```

## Database Routers

```python
# myapp/routers.py

class AuthRouter:
    """Routes auth and contenttypes to auth_db."""

    route_app_labels = {"auth", "contenttypes"}

    def db_for_read(self, model, **hints):
        if model._meta.app_label in self.route_app_labels:
            return "auth_db"
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label in self.route_app_labels:
            return "auth_db"
        return None

    def allow_relation(self, obj1, obj2, **hints):
        if (
            obj1._meta.app_label in self.route_app_labels or
            obj2._meta.app_label in self.route_app_labels
        ):
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label in self.route_app_labels:
            return db == "auth_db"
        return None


class PrimaryReplicaRouter:
    """Routes other apps to primary/replica setup."""

    def db_for_read(self, model, **hints):
        import random
        return random.choice(["replica1", "replica2"])

    def db_for_write(self, model, **hints):
        return "primary"

    def allow_relation(self, obj1, obj2, **hints):
        db_set = {"primary", "replica1", "replica2"}
        if obj1._state.db in db_set and obj2._state.db in db_set:
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        return True
```

### Router Methods

| Method | Purpose | Return |
|--------|---------|--------|
| `db_for_read(model, **hints)` | Database for reading | DB name or `None` |
| `db_for_write(model, **hints)` | Database for writing | DB name or `None` |
| `allow_relation(obj1, obj2, **hints)` | Allow FK/M2M relation | `True`/`False`/`None` |
| `allow_migrate(db, app_label, **hints)` | Allow migration on DB | `True`/`False`/`None` |

### Installing Routers

```python
# settings.py
DATABASE_ROUTERS = [
    "myapp.routers.AuthRouter",
    "myapp.routers.PrimaryReplicaRouter",
]
```

Routers are processed in order. The first non-`None` return value is used.

## Manually Selecting a Database

### QuerySet

```python
# Query from specific database
Article.objects.using("analytics").filter(published=True)

# Get
article = Article.objects.using("analytics").get(pk=1)

# Filter
articles = Article.objects.using("replica1").filter(author=user)

# Count
count = Article.objects.using("analytics").count()
```

### Save

```python
# Save to specific database
article = Article(title="New", content="Content")
article.save(using="users")

# Move object between databases
article.save(using="analytics")  # Saves to analytics
article.save(using="users", update_fields=["title"])  # Update on users
```

### Delete

```python
# Delete from specific database
article.delete(using="analytics")

# Delete from all databases (if replicated)
article.delete(using="users")
article.delete(using="analytics")
```

### Using Managers

```python
class ArticleManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().using("analytics")

    def create(self, **kwargs):
        return super().create(using="users", **kwargs)

class Article(models.Model):
    # ...
    objects = ArticleManager()
```

## Raw Cursors

```python
from django.db import connections

# Use specific database cursor
with connections["analytics"].cursor() as cursor:
    cursor.execute("SELECT COUNT(*) FROM myapp_article")
    row = cursor.fetchone()
    print(row[0])
```

## Multiple Databases in Admin

```python
# admin.py
from django.contrib import admin
from .models import Article

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    using = "analytics"  # Specify database

    def get_queryset(self, request):
        return super().get_queryset(request).using(self.using)

    def save_model(self, request, obj, form, change):
        obj.save(using=self.using)

    def delete_model(self, request, obj):
        obj.delete(using=self.using)
```

## Limitations

### Cross-Database Relations

Django does **not** support cross-database foreign keys or many-to-many relationships:

```python
# This will NOT work if User is on "users" DB and Article is on "default" DB
class Article(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)  # Cross-DB FK fails
```

**Workaround**: Use integer fields instead of FKs:

```python
class Article(models.Model):
    author_id = models.IntegerField()  # Reference by ID, no FK constraint
```

### Contrib Apps

Django's contrib apps (auth, sessions, admin, etc.) expect to be on the same database. Use routers to keep them together.

## Primary/Replica Setup

```python
DATABASES = {
    "default": {},
    "primary": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "primary_db",
        # ...
    },
    "replica1": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "replica1_db",
        # ...
    },
    "replica2": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "replica2_db",
        # ...
    },
}

DATABASE_ROUTERS = ["myapp.routers.PrimaryReplicaRouter"]
```

### Read-Only Replica Pattern

```python
class PrimaryReplicaRouter:
    def db_for_read(self, model, **hints):
        """Reads go to random replica."""
        import random
        return random.choice(["replica1", "replica2"])

    def db_for_write(self, model, **hints):
        """Writes go to primary."""
        return "primary"

    def allow_relation(self, obj1, obj2, **hints):
        db_set = {"primary", "replica1", "replica2"}
        if obj1._state.db in db_set and obj2._state.db in db_set:
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        return True
```

### Forcing Read from Primary

```python
# During a request that just wrote, force reads from primary
Article.objects.using("primary").get(pk=article.pk)
```
