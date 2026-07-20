# Serialization — Django 6.0

## Serializing Data

```python
from django.core.serializers import serialize

# Serialize all objects of a model
json_data = serialize("json", Article.objects.all())

# Serialize specific objects
json_data = serialize("json", Article.objects.filter(published=True))

# Serialize with selected fields only
json_data = serialize("json", Article.objects.all(), fields=["title", "slug"])

# Serialize with natural keys
json_data = serialize("json", Article.objects.all(), use_natural_keys=True)
json_data = serialize("json", Article.objects.all(), use_natural_foreign_keys=True)
```

## JSON Format

```json
[
  {
    "model": "myapp.article",
    "pk": 1,
    "fields": {
      "title": "First Article",
      "slug": "first-article",
      "published": true,
      "author": 1
    }
  }
]
```

### JSONL Format (JSON Lines)

```python
jsonl_data = serialize("jsonl", Article.objects.all())
# One JSON object per line:
# {"model": "myapp.article", "pk": 1, "fields": {"title": "First", ...}}
# {"model": "myapp.article", "pk": 2, "fields": {"title": "Second", ...}}
```

## XML Format

```python
xml_data = serialize("xml", Article.objects.all())
```

```xml
<?xml version="1.0" encoding="utf-8"?>
<django-objects version="1.0">
  <object model="myapp.article" pk="1">
    <field name="title" type="CharField">First Article</field>
    <field name="slug" type="SlugField">first-article</field>
    <field name="published" type="BooleanField">True</field>
  </object>
</django-objects>
```

## YAML Format

```python
yaml_data = serialize("yaml", Article.objects.all())
```

```yaml
- model: myapp.article
  pk: 1
  fields:
    title: First Article
    slug: first-article
    published: true
```

## Deserializing Data

```python
from django.core.serializers import deserialize

# Deserialize from string
for obj in deserialize("json", json_data):
    obj.save()  # Save to database

# Deserialize from file
with open("data.json", "r") as f:
    for obj in deserialize("json", f.read()):
        obj.save()

# Deserialize XML
for obj in deserialize("xml", xml_data):
    obj.save()
```

## Subset of Fields

```python
# Only serialize specific fields
serialize("json", Article.objects.all(), fields=["title", "slug"])
# Foreign keys are serialized as PKs
```

## Inherited Models

```python
# Parent model fields are included automatically
# Only the model queried is serialized, not parent/child separately

class Person(models.Model):
    name = models.CharField(max_length=100)

class Employee(Person):
    salary = models.IntegerField()

# Serializes both Person and Employee fields
serialize("json", Employee.objects.all())
```

## Natural Keys

### Defining Natural Keys

```python
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def natural_key(self):
        return (self.name,)

    class Meta:
        unique_together = [["name"]]

class Article(models.Model):
    title = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def natural_key(self):
        return (self.title, self.category.name)
```

### Serializing with Natural Keys

```python
# Use natural keys for FK references
serialize("json", Article.objects.all(), use_natural_foreign_keys=True)

# Output uses natural key instead of PK:
# {"category": ["Technology"]} instead of {"category": 1}
```

### Deserializing with Natural Keys

```python
# Deserialize using natural keys
for obj in deserialize("json", json_data, handle_forward_references=True):
    obj.save()
```

## DjangoJSONEncoder

```python
from django.core.serializers.json import DjangoJSONEncoder
import json

# Serialize with Django-aware JSON encoder
data = {
    "date": timezone.now(),
    "decimal": Decimal("3.14"),
    "uuid": uuid.uuid4(),
}
json.dumps(data, cls=DjangoJSONEncoder)
# Handles datetime, Decimal, UUID, etc.
```

## GeoJSON Serialization

```python
from django.core.serializers import serialize

# Serialize GIS models as GeoJSON
geojson = serialize(
    "geojson",
    Place.objects.all(),
    geometry_field="point",
    fields=("name", "description"),
    srid=4326,
)
```

## Custom Serializers

```python
# myapp/serializers.py
from django.core.serializers.base import Serializer

class MySerializer(Serializer):
    def start_serialization(self):
        self._current = None
        self.stream.write("[")

    def end_serialization(self):
        self.stream.write("]")

    def start_object(self, obj):
        self._current = {
            "model": obj._meta.label,
            "pk": obj.pk,
        }

    def end_object(self, obj):
        import json
        self.stream.write(json.dumps(self._current))
        self._current = None

    def handle_field(self, obj, field):
        self._current[field.name] = field.value_to_string(obj)

# Register: "myapp.serializers.MySerializer"
```

## dumpdata and loaddata Commands

```bash
# Dump all data
python manage.py dumpdata > backup.json

# Dump specific app
python manage.py dumpdata myapp > myapp.json

# Dump specific model
python manage.py dumpdata myapp.Article > articles.json

# Dump with natural keys
python manage.py dumpdata --natural-foreign --natural-primary

# Dump with indentation
python manage.py dumpdata --indent 2 > backup.json

# Exclude specific app
python manage.py dumpdata --exclude=auth --exclude=contenttypes > data.json

# Load data
python manage.py loaddata backup.json
python manage.py loaddata articles.json --database=users
```

## Fixtures

```
myapp/
    fixtures/
        initial_data.json
        test_articles.json
        sample_users.yaml
```

```python
# In tests
class MyTest(TestCase):
    fixtures = ["test_articles.json", "sample_users.yaml"]

    def setUp(self):
        # Fixtures are loaded before each test
        article = Article.objects.get(slug="test-article")
```
