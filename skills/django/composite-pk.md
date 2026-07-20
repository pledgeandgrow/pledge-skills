# Composite Primary Keys — Django 6.0

## Overview

Django 6.0 introduces native support for composite primary keys (CPK) — primary keys consisting of multiple fields. This is a major feature that allows models to use more than one field as their primary key, which is essential for legacy databases and certain data modeling patterns.

## Defining Composite Primary Keys

### Using Meta.primary_key

```python
class Membership(models.Model):
    group = models.ForeignKey("Group", on_delete=models.CASCADE)
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    role = models.CharField(max_length=50)

    class Meta:
        primary_key = ("group", "user")
```

### Using a Composite Field as Primary Key

```python
class OrderItem(models.Model):
    order = models.ForeignKey("Order", on_delete=models.CASCADE)
    product = models.ForeignKey("Product", on_delete=models.PROTECT)
    quantity = models.IntegerField(default=1)

    class Meta:
        primary_key = ("order", "product")
```

### Single-Field PK Still Default

```python
# Traditional single-field PK — unchanged
class Article(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
```

## Migrating to a Composite Primary Key

### Step 1: Add the Composite PK

```python
# Before — single auto field PK
class OrderItem(models.Model):
    id = models.AutoField(primary_key=True)
    order = models.ForeignKey("Order", on_delete=models.CASCADE)
    product = models.ForeignKey("Product", on_delete=models.PROTECT)
    quantity = models.IntegerField(default=1)

# After — composite PK
class OrderItem(models.Model):
    order = models.ForeignKey("Order", on_delete=models.CASCADE)
    product = models.ForeignKey("Product", on_delete=models.PROTECT)
    quantity = models.IntegerField(default=1)

    class Meta:
        primary_key = ("order", "product")
```

### Step 2: Generate and Run Migration

```bash
python manage.py makemigrations
python manage.py migrate
```

The generated migration will:
1. Drop the old single-field primary key
2. Add the new composite primary key constraint
3. Update all foreign keys referencing this model

### Migration Considerations

```python
# If you have existing data, you may need a data migration
# to ensure the composite PK fields have no NULLs or duplicates

def forwards(apps, schema_editor):
    OrderItem = apps.get_model("myapp", "OrderItem")
    # Check for duplicates before applying CPK
    duplicates = (
        OrderItem.objects
        .values("order", "product")
        .annotate(count=Count("id"))
        .filter(count__gt=1)
    )
    if duplicates.exists():
        raise RuntimeError("Duplicate (order, product) pairs found")

class Migration(migrations.Migration):
    dependencies = [("myapp", "0001_initial")]
    operations = [
        migrations.RunPython(forwards),
        migrations.AlterModelOptions(
            name="orderitem",
            options={"primary_key": ("order", "product")},
        ),
    ]
```

## Composite Primary Keys and Relations

### ForeignKey to a Composite PK Model

```python
class Order(models.Model):
    id = models.AutoField(primary_key=True)
    customer = models.ForeignKey("Customer", on_delete=models.CASCADE)

class OrderItem(models.Model):
    order = models.ForeignKey("Order", on_delete=models.CASCADE)
    product = models.ForeignKey("Product", on_delete=models.PROTECT)
    quantity = models.IntegerField(default=1)

    class Meta:
        primary_key = ("order", "product")

# ForeignKey referencing OrderItem will use both columns
class OrderItemNote(models.Model):
    order_item = models.ForeignKey(
        OrderItem,
        on_delete=models.CASCADE,
        # This creates two columns: order_item_order_id, order_item_product_id
    )
    note = models.TextField()
```

### ManyToMany with Composite PK

```python
# ManyToManyField to a model with composite PK works transparently
class Group(models.Model):
    name = models.CharField(max_length=100)

class User(models.Model):
    name = models.CharField(max_length=100)
    groups = models.ManyToManyField(Group, through="Membership")

class Membership(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=50)

    class Meta:
        primary_key = ("group", "user")
```

### Self-Referential Relations

```python
class Category(models.Model):
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=100)

    class Meta:
        primary_key = ("id", "parent")
        # Note: self-referential CPK requires careful handling
```

## Composite Primary Keys and Database Functions

### Querying by Composite PK

```python
# Get by composite PK values
item = OrderItem.objects.get(order_id=1, product_id=42)

# Filter by composite PK
items = OrderItem.objects.filter(order_id=1, product_id__in=[42, 43, 44])

# Use pk__in with tuples (Django 6.0+)
items = OrderItem.objects.filter(pk__in=[(1, 42), (1, 43), (2, 10)])
```

### Aggregations and Annotations

```python
from django.db.models import Count, Sum

# Group by composite PK
results = (
    OrderItem.objects
    .values("order", "product")  # Groups by composite PK
    .annotate(total=Sum("quantity"))
)

# Distinct on composite PK
items = OrderItem.objects.distinct()
```

### F Expressions with Composite PK Fields

```python
from django.db.models import F

# Update using composite PK fields
OrderItem.objects.filter(
    order_id=1,
    product_id=42,
).update(quantity=F("quantity") + 5)
```

## Composite Primary Keys in Forms

### ModelForm with Composite PK

```python
from django import forms

class OrderItemForm(forms.ModelForm):
    class Meta:
        model = OrderItem
        fields = ["order", "product", "quantity"]

# The form will include both PK fields as regular fields
# since they're not AutoFields
```

### Form Validation

```python
class OrderItemForm(forms.ModelForm):
    class Meta:
        model = OrderItem
        fields = ["order", "product", "quantity"]

    def clean(self):
        cleaned_data = super().clean()
        order = cleaned_data.get("order")
        product = cleaned_data.get("product")
        if order and product:
            # Check for duplicate composite PK
            if OrderItem.objects.filter(
                order=order,
                product=product,
            ).exclude(pk=self.instance.pk).exists():
                raise forms.ValidationError(
                    "An OrderItem with this order and product already exists."
                )
        return cleaned_data
```

### Formset with Composite PK

```python
from django.forms import modelformset_factory

OrderItemFormSet = modelformset_factory(
    OrderItem,
    fields=["order", "product", "quantity"],
    extra=2,
)

# The formset handles composite PKs transparently
# when saving, it uses the composite PK to identify existing instances
```

## Composite Primary Keys in Model Validation

### validate_unique with Composite PK

```python
class OrderItem(models.Model):
    order = models.ForeignKey("Order", on_delete=models.CASCADE)
    product = models.ForeignKey("Product", on_delete=models.PROTECT)
    quantity = models.IntegerField(default=1)

    class Meta:
        primary_key = ("order", "product")

    def clean(self):
        super().clean()
        # validate_unique checks the composite PK
        # Django 6.0 automatically validates uniqueness of (order, product)
```

### Full Clean

```python
item = OrderItem(order=order1, product=product1, quantity=5)
try:
    item.full_clean()  # Validates composite PK uniqueness
except ValidationError as e:
    print(e.message_dict)
```

## Building Composite Primary Key Ready Applications

### Best Practices

```python
# 1. Plan your composite PK from the start
class Enrollment(models.Model):
    student = models.ForeignKey("Student", on_delete=models.CASCADE)
    course = models.ForeignKey("Course", on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        primary_key = ("student", "course")
        # No separate id field needed

# 2. Use meaningful field combinations
class SaleItem(models.Model):
    sale = models.ForeignKey("Sale", on_delete=models.CASCADE)
    line_number = models.PositiveSmallIntegerField()
    product = models.ForeignKey("Product", on_delete=models.PROTECT)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        primary_key = ("sale", "line_number")
        # Natural composite key: sale + line number

# 3. Index additional query patterns
class SaleItem(models.Model):
    sale = models.ForeignKey("Sale", on_delete=models.CASCADE)
    line_number = models.PositiveSmallIntegerField()
    product = models.ForeignKey("Product", on_delete=models.PROTECT)

    class Meta:
        primary_key = ("sale", "line_number")
        indexes = [
            models.Index(fields=["product", "sale"]),  # For reverse lookups
        ]
```

### Admin Integration

```python
from django.contrib import admin

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("order", "product", "quantity")
    list_filter = ("order",)
    search_fields = ("product__name",)
    # Admin handles composite PKs transparently
    # The change form shows both PK fields as editable
```

### Serializing Composite PK Models

```python
from django.core import serializers

# Serialization includes all PK fields
json_data = serializers.serialize("json", OrderItem.objects.all())
# [{"model": "myapp.orderitem", "pk": {"order": 1, "product": 42}, "fields": {"quantity": 5}}]

# Deserialization
for obj in serializers.deserialize("json", json_data):
    obj.save()
```

### Raw SQL with Composite PKs

```python
# Raw queries must include all PK columns
items = OrderItem.objects.raw(
    "SELECT * FROM myapp_orderitem WHERE order_id = %s AND product_id = %s",
    [1, 42],
)
```

## Limitations and Considerations

```python
# 1. Cannot use AutoField/BigAutoField in composite PK
# This is INVALID:
# class MyModel(models.Model):
#     id = models.AutoField(primary_key=True)
#     code = models.CharField(max_length=10, primary_key=True)  # Error!

# 2. All fields in the composite PK must be non-nullable
class ValidModel(models.Model):
    field_a = models.ForeignKey("A", on_delete=models.CASCADE)  # NOT NULL
    field_b = models.CharField(max_length=10)  # NOT NULL

    class Meta:
        primary_key = ("field_a", "field_b")

# 3. Composite PK fields cannot be changed after save
item = OrderItem.objects.get(order_id=1, product_id=42)
item.product = new_product  # This creates a new record on save
# Use .save() carefully — changing PK fields means a new identity

# 4. GenericForeignKey does not support composite PK models
# 5. The .pk attribute returns a tuple for composite PK models
item = OrderItem.objects.get(order_id=1, product_id=42)
print(item.pk)  # (1, 42) — returns a tuple
```
