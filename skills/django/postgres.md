# django.contrib.postgres — Django 6.0

## Overview

PostgreSQL-specific extensions for Django: specialized fields, full-text search, aggregates, constraints, indexes, and more.

## Installation

```python
INSTALLED_APPS = [
    # ...
    "django.contrib.postgres",
]
```

## Model Fields

### ArrayField

```python
from django.contrib.postgres.fields import ArrayField
from django.db import models

class Player(models.Model):
    name = models.CharField(max_length=100)
    scores = ArrayField(models.IntegerField(), size=5)  # Max 5 elements
    tags = ArrayField(models.CharField(max_length=50), blank=True, default=list)

# Querying ArrayField
Player.objects.filter(scores__contains=[10])       # Contains 10
Player.objects.filter(scores__contained_by=[1, 2, 3, 10, 20])  # Subset of
Player.objects.filter(scores__overlap=[1, 2])      # Shares any element
Player.objects.filter(scores__len=5)               # Array length
Player.objects.filter(scores__0=10)                # First element = 10
Player.objects.filter(scores__1__gte=5)            # Second element >= 5
```

### HStoreField

```python
from django.contrib.postgres.fields import HStoreField

class Document(models.Model):
    title = models.CharField(max_length=200)
    metadata = HStoreField()

# Requires HStoreExtension
from django.contrib.postgres.operations import HStoreExtension

class Migration(migrations.Migration):
    operations = [
        HStoreExtension(),
        # ... create model ...
    ]

# Querying HStoreField
Document.objects.filter(metadata__author="John")
Document.objects.filter(metadata__has_key="author")
Document.objects.filter(metadata__has_keys=["author", "title"])
Document.objects.filter(metadata__has_any_keys=["author", "title"])
Document.objects.filter(metadata__contains={"author": "John"})
```

### Range Fields

```python
from django.contrib.postgres.fields import (
    IntegerRangeField, BigIntegerRangeField,
    DecimalRangeField, DateTimeRangeField, DateRangeField,
)

class Event(models.Model):
    name = models.CharField(max_length=100)
    start_end = DateTimeRangeField()
    age_range = IntegerRangeField()  # e.g., [18, 65)

# Querying Range Fields
Event.objects.filter(start_end__contains="2024-06-15")
Event.objects.filter(start_end__overlap="2024-06-01/2024-06-30")
Event.objects.filter(start_end__fully_lt="2024-01-01")
Event.objects.filter(start_end__fully_gt="2024-12-31")
Event.objects.filter(start_end__startswith="2024-06-01")
Event.objects.filter(start_end__endswith="2024-06-30")
Event.objects.filter(start_end__isempty=False)
```

## Full-Text Search

### Basic Search

```python
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank

# Simple search lookup
Article.objects.filter(body__search="django framework")
# Searches all text fields

# SearchVector for specific fields
Article.objects.annotate(
    search=SearchVector("title", "body"),
).filter(search="django framework")

# Weighted search
Article.objects.annotate(
    search=SearchVector("title", weight="A") + SearchVector("body", weight="B"),
).filter(search="django")

# SearchQuery for complex queries
query = SearchQuery("django web framework", search_type="phrase")
# search_type: "plain" (default), "phrase", "raw", "websearch"

# Boolean search
query = SearchQuery("django") & SearchQuery("framework")  # AND
query = SearchQuery("django") | SearchQuery("flask")      # OR
query = ~SearchQuery("flask")                              # NOT

# Websearch syntax
query = SearchQuery('"django framework" -flask', search_type="websearch")

# SearchRank for ordering
Article.objects.annotate(
    rank=SearchRank(SearchVector("title", "body"), query),
).filter(search=query).order_by("-rank")

# SearchHeadline for highlighted results
from django.contrib.postgres.search import SearchHeadline
Article.objects.annotate(
    headline=SearchHeadline("body", query),
).filter(search=query)
```

### SearchVectorField

```python
from django.contrib.postgres.search import SearchVectorField

class Article(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    search_vector = SearchVectorField(null=True, blank=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update search vector (or use trigger)
        from django.contrib.postgres.search import SearchVector
        Article.objects.filter(pk=self.pk).update(
            search_vector=SearchVector("title", "body")
        )
```

## Trigram Similarity

```python
from django.contrib.postgres.search import TrigramSimilarity

# Requires TrigramExtension
from django.contrib.postgres.operations import TrigramExtension

# Find similar strings
Author.objects.annotate(
    similarity=TrigramSimilarity("name", "John"),
).filter(similarity__gt=0.3).order_by("-similarity")

# Trigram lookup
Author.objects.filter(name__trigram_similar="John")
```

## PostgreSQL Aggregates

```python
from django.contrib.postgres.aggregates import (
    ArrayAgg, BitOr, BitAnd, BoolAnd, BoolOr,
    Corr, CovarPop, RegrAvgX, RegrAvgY, RegrCount,
    RegrIntercept, RegrR2, RegrSlope, RegrSXX, RegrSXY, RegrSYY,
    StatAggregate, StringAgg,
    PercentileDisc, PercentileCont, Mode,
)

# ArrayAgg — collect values into array
Author.objects.annotate(books=ArrayAgg("book__title"))

# StringAgg — join strings with delimiter
Author.objects.annotate(
    book_titles=StringAgg("book__title", delimiter=", "),
)

# BoolAnd / BoolOr — boolean aggregation
Book.objects.aggregate(all_published=BoolAnd("published"))

# PercentileDisc — median
Employee.objects.annotate(
    median_salary=PercentileDisc("salary", 0.5),
)

# Mode — most frequent value
Employee.objects.annotate(
    most_common_dept=Mode("department"),
)
```

## PostgreSQL Indexes

```python
from django.contrib.postgres.indexes import (
    BloomIndex, BrinIndex, BTreeIndex, GinIndex, GistIndex,
    HashIndex, SpGistIndex, OpClass,
)

class Article(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    tags = ArrayField(models.CharField(max_length=50))

    class Meta:
        indexes = [
            # GIN index for full-text search and arrays
            GinIndex(fields=["tags"], name="tags_gin_idx"),
            # BRIN index for large sorted tables
            BrinIndex(fields=["created_at"], name="created_brin_idx"),
            # B-tree index with opclass
            BTreeIndex(
                fields=["title"],
                name="title_btree_idx",
                opclasses=[OpClass("varchar_pattern_ops")],
            ),
            # Bloom index (multi-column)
            BloomIndex(fields=["title", "body"], name="title_body_bloom_idx"),
        ]
```

## PostgreSQL Constraints

```python
from django.contrib.postgres.constraints import ExclusionConstraint

class Reservation(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    time_range = DateTimeRangeField()

    class Meta:
        constraints = [
            ExclusionConstraint(
                name="no_overlapping_reservations",
                expressions=[
                    ("room", "="),
                    ("time_range", "&&"),
                ],
            ),
        ]
```

## Database Functions

```python
from django.contrib.postgres.functions import RandomUUID, TransactionNow

# RandomUUID — generate UUID
User.objects.create(id=RandomUUID())

# TransactionNow — transaction-scoped timestamp
Log.objects.create(timestamp=TransactionNow())
```

## Migration Operations

```python
from django.contrib.postgres.operations import (
    CreateExtension, BloomExtension, BtreeGinExtension,
    BtreeGistExtension, CITextExtension, CryptoExtension,
    HStoreExtension, TrigramExtension, UnaccentExtension,
)

class Migration(migrations.Migration):
    operations = [
        CreateExtension("pg_trgm"),
        TrigramExtension(),
        HStoreExtension(),
        CITextExtension(),
        CryptoExtension(),
        UnaccentExtension(),
        # ... model operations ...
    ]
```

## Validators

```python
from django.contrib.postgres.validators import KeysValidator

class Document(models.Model):
    metadata = HStoreField(validators=[
        KeysValidator(
            keys=["author", "title"],
            strict=True,  # Only these keys allowed
            message="Must contain 'author' and 'title'.",
        )
    ])
```

## Form Fields

```python
from django.contrib.postgres.forms import (
    SimpleArrayField, SplitArrayField,
)
from django.contrib.postgres.forms.ranges import (
    IntegerRangeField, DateRangeField, DateTimeRangeField,
)

class SearchForm(forms.Form):
    keywords = SimpleArrayField(forms.CharField(max_length=50))
    age_range = IntegerRangeField()
```
