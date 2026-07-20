# Advanced ORM — Django 6.0

## Conditional Expressions

### When() Objects

```python
from django.db.models import Case, When, Value, F, Q

# When(condition, then=result)
When(account_type=Client.GOLD, then=Value("5%"))
When(account_type=Client.GOLD, then=F("name"))

# With field lookups
from datetime import date
When(
    registered_on__gt=date(2014, 1, 1),
    registered_on__lt=date(2015, 1, 1),
    then="account_type",
)

# With Q objects for complex conditions
When(Q(name__startswith="John") | Q(name__startswith="Paul"), then="name")

# With boolean expressions
from django.db.models import Exists, OuterRef
When(Exists(subquery), then=Value("non unique"))
```

### Case() Expressions

```python
from django.db.models import Case, When, Value

# Annotate with conditional values
Client.objects.annotate(
    discount=Case(
        When(account_type=Client.GOLD, then=Value("5%")),
        When(account_type=Client.PLATINUM, then=Value("10%")),
        default=Value("0%"),
    ),
).values_list("name", "discount")

# Using lookups in conditions
a_month_ago = date.today() - timedelta(days=30)
a_year_ago = date.today() - timedelta(days=365)

Client.objects.annotate(
    discount=Case(
        When(registered_on__lte=a_year_ago, then=Value("10%")),
        When(registered_on__lte=a_month_ago, then=Value("5%")),
        default=Value("0%"),
    ),
)
```

### Conditional Update

```python
Client.objects.update(
    account_type=Case(
        When(registered_on__lte=a_year_ago, then=Value(Client.PLATINUM)),
        When(registered_on__lte=a_month_ago, then=Value(Client.GOLD)),
        default=Value(Client.REGULAR),
    ),
)
```

### Conditional Aggregation

```python
from django.db.models import Count, Q

Client.objects.aggregate(
    regular=Count("pk", filter=Q(account_type=Client.REGULAR)),
    gold=Count("pk", filter=Q(account_type=Client.GOLD)),
    platinum=Count("pk", filter=Q(account_type=Client.PLATINUM)),
)
# {'regular': 2, 'gold': 1, 'platinum': 3}
```

### Conditional Filter

```python
from django.db.models import Exists, OuterRef

non_unique = Client.objects.filter(
    account_type=OuterRef("account_type"),
).exclude(pk=OuterRef("pk")).values("pk")

# Use conditional expression directly in filter
Client.objects.filter(~Exists(non_unique))
```

### If() Expression

```python
from django.db.models.expressions import If

# If(condition, true_value, false_value)
Product.objects.annotate(
    in_stock_label=If(Q(stock__gt=0), Value("Available"), Value("Out of stock")),
)
```

## Custom Model Fields

### Subclassing Field

```python
from django.db import models

class HandField(models.Field):
    description = "A hand of cards (bridge style)"

    def __init__(self, *args, **kwargs):
        kwargs["max_length"] = 104
        super().__init__(*args, **kwargs)
```

### db_type() — Custom Database Types

```python
class MytypeField(models.Field):
    def db_type(self, connection):
        return "mytype"

# Database-specific types
class MyDateField(models.Field):
    def db_type(self, connection):
        if connection.vendor == "mysql":
            return "datetime"
        return "timestamp"
```

### rel_db_type() — For Related Fields

```python
class UnsignedAutoField(models.AutoField):
    def rel_db_type(self, connection):
        return "integer unsigned"
```

### Converting Python Values to DB Values

```python
from django.db import models

class HandField(models.Field):
    def from_db_value(self, value, expression, connection):
        if value is None:
            return value
        return Hand.from_string(value)  # Convert DB string to Python object

    def to_python(self, value):
        if isinstance(value, Hand):
            return value
        if value is None:
            return value
        return Hand.from_string(value)

    def get_prep_value(self, value):
        return str(value)  # Convert Python object to DB-safe value

    def get_db_prep_value(self, value, connection, prepared=False):
        if not prepared:
            value = self.get_prep_value(value)
        return value
```

### Field Deconstruction (for migrations)

```python
class HandField(models.Field):
    def __init__(self, max_length=104, *args, **kwargs):
        self.max_length = max_length
        super().__init__(*args, **kwargs)

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        if self.max_length != 104:
            kwargs["max_length"] = self.max_length
        return name, path, args, kwargs
```

### Useful Methods to Override

```python
class HandField(models.Field):
    def value_to_string(self, obj):
        value = self.value_from_object(obj)
        return self.get_prep_value(value)

    def formfield(self, **kwargs):
        from django.forms import TextInput
        defaults = {"widget": TextInput}
        defaults.update(kwargs)
        return super().formfield(**defaults)

    def get_internal_type(self):
        return "CharField"  # Use existing Django field infrastructure

    def get_choices(self, include_blank=True, **kwargs):
        # Override for custom choices
        return super().get_choices(include_blank, **kwargs)
```

### Writing a FileField Subclass

```python
class ContentTypeRestrictedFileField(models.FileField):
    def __init__(self, *args, **kwargs):
        self.content_types = kwargs.pop("content_types", [])
        super().__init__(*args, **kwargs)

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        kwargs["content_types"] = self.content_types
        return name, path, args, kwargs
```

## Custom Lookups

### Creating a Custom Lookup

```python
from django.db.models import Lookup

class AbsoluteValueLookup(Lookup):
    lookup_name = "abs"

    def as_sql(self, compiler, connection):
        lhs, lhs_params = self.process_lhs(compiler, connection)
        rhs, rhs_params = self.process_rhs(compiler, connection)
        params = lhs_params + rhs_params
        return f"ABS({lhs}) = {rhs}", params

# Register on a field
from django.db.models.fields import IntegerField
IntegerField.register_lookup(AbsoluteValueLookup)

# Usage: Model.objects.filter(field__abs=5)
```

### Custom Transform

```python
from django.db.models import Transform

class AbsoluteValue(Transform):
    lookup_name = "abs"
    function = "ABS"

    @property
    def output_field(self):
        return self.lhs.output_field

IntegerField.register_lookup(AbsoluteValue)

# Usage: Model.objects.filter(field__abs__gt=20)
```

### Lookup with Multiple Values

```python
class AbsoluteValueLessThan(AbsoluteValueLookup):
    lookup_name = "abs__lt"

    def as_sql(self, compiler, connection):
        lhs, lhs_params = self.process_lhs(compiler, connection)
        rhs, rhs_params = self.process_rhs(compiler, connection)
        return f"ABS({lhs}) < {rhs}", lhs_params + rhs_params
```

## SchemaEditor

```python
from django.db.migrations.operations.base import Operation

class AddExtension(Operation):
    def __init__(self, name):
        self.name = name

    def database_forwards(self, app_label, schema_editor, from_state, to_state):
        schema_editor.execute(f"CREATE EXTENSION IF NOT EXISTS {self.name}")

    def database_backwards(self, app_label, schema_editor, from_state, to_state):
        schema_editor.execute(f"DROP EXTENSION IF EXISTS {self.name}")

    def state_forwards(self, app_label, state):
        pass  # No state changes

    def describe(self):
        return f"Creates extension {self.name}"
```

## Writing Migrations

### Data Migration

```python
from django.db import migrations

def forwards(apps, schema_editor):
    Article = apps.get_model("myapp", "Article")
    for article in Article.objects.all():
        article.slug = slugify(article.title)
        article.save()

def backwards(apps, schema_editor):
    Article = apps.get_model("myapp", "Article")
    Article.objects.all().update(slug=None)

class Migration(migrations.Migration):
    dependencies = [
        ("myapp", "0003_auto_20240101_1234"),
    ]
    operations = [
        migrations.RunPython(forwards, backwards),
    ]
```

### RunSQL

```python
class Migration(migrations.Migration):
    operations = [
        migrations.RunSQL(
            sql="CREATE INDEX idx_name ON myapp_article (title);",
            reverse_sql="DROP INDEX idx_name;",
        ),
    ]
```

### Separate Database and State Operations

```python
class Migration(migrations.Migration):
    operations = [
        migrations.SeparateDatabaseAndState(
            state_operations=[
                migrations.AddField("article", "views", models.IntegerField(default=0)),
            ],
            database_operations=[
                migrations.RunSQL(
                    "ALTER TABLE myapp_article ADD COLUMN views INTEGER DEFAULT 0;"
                ),
            ],
        ),
    ]
```

## Legacy Databases

```bash
# Auto-generate models from existing database
python manage.py inspectdb > models.py

# Generate initial migration for existing tables
python manage.py makemigrations --fake-initial

# Fake-apply migration (tables already exist)
python manage.py migrate --fake
```

```python
# For legacy tables that already exist
class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="LegacyTable",
            fields=[...],
            options={
                "db_table": "legacy_table_name",
                "managed": False,  # Django won't create/modify table
            },
        ),
    ]
```
