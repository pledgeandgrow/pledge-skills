# Model Field Reference — Django 6.0

## Field Options (apply to all field types)

### null
```python
field = models.CharField(max_length=100, null=True)
```
If `True`, Django stores empty values as `NULL` in the database. Default: `False`.

### blank
```python
field = models.CharField(max_length=100, blank=True)
```
If `True`, the field is allowed to be blank. Default: `False`. Note: `null` is database-related, `blank` is validation-related.

### choices
```python
from django.db import models

class Article(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED =published", "Published"
        ARCHIVED = "archived", "Archived"

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
    )
```

### db_column
Custom database column name. Defaults to the field's attribute name.

### db_comment
```python
field = models.CharField(max_length=100, db_comment="User's display name")
```

### db_default
```python
field = models.IntegerField(db_default=42)
# Or using expressions:
field = models.DateTimeField(db_default=models.functions.Now())
```

### db_index
If `True`, creates a database index for this field. Default: `False`.

### default
Default value for the field. Can be a value or a callable:
```python
field = models.DateTimeField(default=timezone.now)
field = models.IntegerField(default=0)
```

### editable
If `False`, the field will not be displayed in admin or ModelForm. Default: `True`.

### error_messages
```python
field = models.CharField(
    max_length=100,
    error_messages={
        "required": "Please enter a value.",
        "invalid": "Enter a valid value.",
    },
)
```

### help_text
Text displayed with the form widget. Useful for admin and forms.

### primary_key
If `True`, this field is the primary key. Only one per model. Default: `False`.

### unique
If `True`, the field must be unique across the table. Default: `False`.

### unique_for_date / unique_for_month / unique_for_year
Make field unique relative to a date field.

### verbose_name
Human-readable name. Defaults to the field's attribute name with underscores converted to spaces.

### validators
```python
from django.core.validators import MinValueValidator, MaxValueValidator

field = models.IntegerField(
    validators=[MinValueValidator(0), MaxValueValidator(100)]
)
```

## Field Types

### AutoField
Auto-incrementing integer primary key. Usually automatic.

### BigAutoField
64-bit auto-incrementing primary key (1 to 9223372036854775807). Default for new projects.

### SmallAutoField
Small auto-incrementing integer.

### BigIntegerField
64-bit integer (-9223372036854775808 to 9223372036854775807).

### BinaryField
Raw binary data (`bytes`, `bytearray`, `memoryview`). `editable=False` by default.
```python
field = models.BinaryField(max_length=1024)  # Optional max length in bytes
```

### BooleanField
True/false field. Default widget: `CheckboxInput`. Default value: `None` if not specified.
```python
field = models.BooleanField(default=True)
field = models.BooleanField(null=True)  # NullBooleanSelect widget
```

### CharField
String field for small-to-large strings. Required: `max_length`.
```python
field = models.CharField(max_length=200)
```

### DateField
Date (without time). Options: `auto_now` (updated on save), `auto_now_add` (set on creation).
```python
field = models.DateField()
field = models.DateField(auto_now=True)       # Updated on every save()
field = models.DateField(auto_now_add=True)    # Set only on initial save()
```

### DateTimeField
Date and time. Same options as DateField.

### DecimalField
Fixed-precision decimal. Required: `max_digits`, `decimal_places`.
```python
field = models.DecimalField(max_digits=19, decimal_places=10)
```

### DurationField
Time span (`datetime.timedelta`).

### EmailField
CharField with email validation. `max_length=320` by default.

### FileField
File upload field. Uses `MEDIA_ROOT` and `MEDIA_URL` settings.
```python
field = models.FileField(upload_to="uploads/")
field = models.FileField(upload_to="uploads/%Y/%m/%d/")
# Custom upload_to callable:
def get_upload_path(instance, filename):
    return f"user_{instance.user.id}/{filename}"
field = models.FileField(upload_to=get_upload_path)
```

### FilePathField
File path on the local filesystem.
```python
field = models.FilePathField(
    path="/home/music",
    match=r"\.mp3$",
    recursive=True,
    allow_files=True,
    allow_folders=False,
)
```

### FloatField
Floating-point number (Python `float`).

### GeneratedField
Database-generated computed field (Django 5.1+).
```python
field = models.GeneratedField(
    expression=models.F("price") * models.F("quantity"),
    output_field=models.DecimalField(max_digits=12, decimal_places=2),
    db_persist=True,  # Store in DB vs computed on read
)
```

### GenericIPAddressField
IPv4 or IPv6 address string.
```python
field = models.GenericIPAddressField(protocol="IPv4")
field = models.GenericIPAddressField(protocol="IPv6")
field = models.GenericIPAddressField(protocol="both")
```

### ImageField
FileField with image validation. Requires Pillow.
```python
field = models.ImageField(
    upload_to="images/",
    height_field="height",   # Optional
    width_field="width",     # Optional
)
```

### IntegerField
32-bit integer (-2147483648 to 2147483647).

### JSONField
JSON-encoded data. Uses Python `dict`, `list`, `str`, `int`, `float`, `bool`, `None`.
```python
field = models.JSONField(default=dict)
field = models.JSONField(default=list)

# Querying JSONField:
Model.objects.filter(field__key="value")
Model.objects.filter(field__key__contains="substr")
Model.objects.filter(field__0="first_element")
Model.objects.filter(field__has_key="key_name")
Model.objects.filter(field__has_keys=["key1", "key2"])
Model.objects.filter(field__has_any_keys=["key1", "key2"])
```

### PositiveBigIntegerField
Non-negative 64-bit integer (0 to 9223372036854775807).

### PositiveIntegerField
Non-negative 32-bit integer (0 to 2147483647).

### PositiveSmallIntegerField
Non-negative small integer (0 to 32767).

### SlugField
Short label for URLs. Only letters, numbers, underscores, hyphens.
```python
field = models.SlugField(max_length=50)
# Auto-populate from another field:
field = models.SlugField(max_length=50, allow_unicode=True)
```

### SmallIntegerField
Small integer (-32768 to 32767).

### TextField
Large text field. No `max_length` at database level.
```python
field = models.TextField()
field = models.TextField(blank=True)
```

### TimeField
Time (without date). Options: `auto_now`, `auto_now_add`.

### URLField
CharField with URL validation. `max_length=200` by default.

### UUIDField
Universally unique identifier.
```python
import uuid
field = models.UUIDField(default=uuid.uuid4, editable=False)
```

## Relationship Fields

### ForeignKey (Many-to-One)

```python
models.ForeignKey(
    to="myapp.RelatedModel",     # Can use string reference
    on_delete=models.CASCADE,    # Required
    related_name="children",     # Reverse accessor name
    related_query_name="child",  # Reverse query name
    to_field="name",             # Use non-PK field as target
    limit_choices_to={...},      # Limit form/admin choices
    db_index=True,               # Create index (default True)
    db_constraint=True,          # Create DB constraint
    swappable=True,              # Allow model swapping
    null=True,                   # Allow null
    blank=True,                  # Allow blank in forms
)
```

### ManyToManyField (Many-to-Many)

```python
models.ManyToManyField(
    to="myapp.RelatedModel",
    related_name="items",
    related_query_name="item",
    through="CustomThroughModel",     # Custom intermediary table
    through_fields=("field1", "field2"),  # Specify which fields
    symmetrical=True,              # Self-referential symmetry
    db_table="custom_table",       # Custom table name
    blank=True,
)
```

### OneToOneField (One-to-One)

```python
models.OneToOneField(
    to="myapp.RelatedModel",
    on_delete=models.CASCADE,
    primary_key=True,        # Use as primary key
    parent_link=True,        # Multi-table inheritance link
    related_name="profile",
)
```

## CompositePrimaryKey (Django 6.0)

```python
class OrderItem(models.Model):
    order_id = models.IntegerField()
    line_number = models.IntegerField()
    product = models.CharField(max_length=100)

    pk = models.CompositePrimaryKey("order_id", "line_number")
```

## Field Attribute Reference

### Attributes for all fields
- `name` — Field name in the model
- `verbose_name` — Human-readable name
- `attname` — Database column name
- `is_relation` — Boolean (True for relationship fields)
- `model` — Model class that owns the field
- `unique` — Boolean
- `editable` — Boolean
- `blank` — Boolean
- `has_default()` — Whether a default is set
- `get_default()` — Get the default value
- `get_choices()` — Get choices list
- `save_form_data(instance, data)` — Save form data to instance
- `value_from_object(obj)` — Get field value from model instance

### Attributes for relationship fields
- `is_relation` — Always `True`
- `related_model` — The related model class
- `related_query_name()` — Reverse query name
- `get_accessor_name()` — Reverse accessor name
- `get_path_info()` — Join path information
