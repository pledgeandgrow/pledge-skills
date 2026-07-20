# Migrations — Django 6.0

## Overview

Migrations are Django's way of propagating model changes to the database schema.

## Commands

```bash
# Create migrations from model changes
python manage.py makemigrations
python manage.py makemigrations myapp

# Apply migrations
python manage.py migrate
python manage.py migrate myapp
python manage.py migrate myapp 0002

# Show migration status
python manage.py showmigrations
python manage.py showmigrations myapp

# Show SQL for a migration
python manage.py sqlmigrate myapp 0001

# Squash migrations
python manage.py squashmigrations myapp 0001 0010

# Create empty migration (for data migrations)
python manage.py makemigrations --empty myapp
```

## Migration Files

Migrations are stored in `app/migrations/` as Python files:

```python
from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ("myapp", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Person",
            fields=[
                ("id", models.BigAutoField(primary_key=True, auto_created=True)),
                ("first_name", models.CharField(max_length=50)),
                ("last_name", models.CharField(max_length=50)),
            ],
        ),
    ]
```

## Operations Reference

### CreateModel
```python
migrations.CreateModel(
    name="Person",
    fields=[...],
    options={"verbose_name": "Person"},
    bases=(models.Model,),
)
```

### DeleteModel
```python
migrations.DeleteModel(name="Person")
```

### RenameModel
```python
migrations.RenameModel(old_name="Person", new_name="People")
```

### AddField
```python
migrations.AddField(
    model_name="person",
    name="email",
    field=models.EmailField(default=""),
)
```

### RemoveField
```python
migrations.RemoveField(model_name="person", name="email")
```

### AlterField
```python
migrations.AlterField(
    model_name="person",
    name="first_name",
    field=models.CharField(max_length=100),
)
```

### RenameField
```python
migrations.RenameField(
    model_name="person",
    old_name="first_name",
    new_name="given_name",
)
```

### AddIndex
```python
migrations.AddIndex(
    model_name="person",
    index=models.Index(fields=["last_name"], name="last_name_idx"),
)
```

### RemoveIndex
```python
migrations.RemoveIndex(model_name="person", name="last_name_idx")
```

### AddConstraint
```python
migrations.AddConstraint(
    model_name="person",
    constraint=models.UniqueConstraint(
        fields=["first_name", "last_name"],
        name="unique_full_name",
    ),
)
```

### RemoveConstraint
```python
migrations.RemoveConstraint(model_name="person", name="unique_full_name")
```

### AlterModelTable
```python
migrations.AlterModelTable(name="person", table="people")
```

### AlterModelOptions
```python
migrations.AlterModelOptions(
    name="person",
    options={"ordering": ["last_name", "first_name"]},
)
```

### AlterUniqueTogether
```python
migrations.AlterUniqueTogether(
    name="person",
    unique_together={("first_name", "last_name")},
)
```

### AlterIndexTogether
```python
migrations.AlterIndexTogether(
    name="person",
    index_together={("first_name", "last_name")},
)
```

### SeparateDatabaseAndState
For operations that need custom SQL alongside Django's state changes:
```python
migrations.SeparateDatabaseAndState(
    state_operations=[
        migrations.AddField("person", "email", models.EmailField()),
    ],
    database_operations=[
        migrations.RunSQL(
            "ALTER TABLE myapp_person ADD COLUMN email varchar(254);",
            "ALTER TABLE myapp_person DROP COLUMN email;",
        ),
    ],
)
```

## Data Migrations

```python
from django.db import migrations

def forwards_func(apps, schema_editor):
    Person = apps.get_model("myapp", "Person")
    Person.objects.filter(first_name="").update(first_name="Unknown")

def reverse_func(apps, schema_editor):
    pass  # No reverse

class Migration(migrations.Migration):
    dependencies = [
        ("myapp", "0002_add_field"),
    ]

    operations = [
        migrations.RunPython(forwards_func, reverse_func),
    ]
```

### RunSQL
```python
migrations.RunSQL(
    sql="UPDATE myapp_person SET first_name = 'Unknown' WHERE first_name = '';",
    reverse_sql="UPDATE myapp_person SET first_name = '' WHERE first_name = 'Unknown';",
)
```

## Squashing Migrations

When migration history gets long, squash to reduce the number of files:

```bash
python manage.py squashmigrations myapp 0001 0010
```

This creates a new migration that replaces the squashed ones. The old migrations are kept for backwards compatibility until all deployments have applied the squashed migration.

## Migration Dependencies

```python
class Migration(migrations.Migration):
    dependencies = [
        # Same app
        ("myapp", "0001_initial"),
        # Different app
        ("otherapp", "0003_add_field"),
        # Latest migration of an app
        ("auth", "__latest__"),
    ]
```

## Tips

- **Never delete migrations** that have been applied to production
- **Use `makemigrations --check`** in CI to detect model/migration drift
- **Use `--name`** to give migrations meaningful names: `makemigrations --name add_email_field`
- **Review generated migrations** before applying
- **Use `RunPython.noop`** for one-way data migrations: `migrations.RunPython(forwards, migrations.RunPython.noop)`
- **Test migrations** with `--plan` flag: `migrate --plan`
