# QuerySets — Django 6.0

## Creating Objects

```python
from myapp.models import Blog, Entry

# Create and save in one step
b = Blog.objects.create(name="Beatles Blog", tagline="All the latest news")

# Create then save
b = Blog(name="Beatles Blog", tagline="All the latest news")
b.save()

# Save with ForeignKey
e = Entry(blog=b, headline="Hello", body_text="...")
e.save()
```

## Saving ForeignKey and ManyToManyField

```python
# ForeignKey — set directly
entry.blog = blog
entry.save()

# ManyToManyField — use add()
e = Entry.objects.get(id=1)
e.authors.add(author1, author2)
# Or create and add:
e.authors.create(name="New Author")

# Remove
e.authors.remove(author1)

# Clear all
e.authors.clear()

# Set (replaces all)
e.authors.set([author1, author2])
```

## Retrieving Objects

```python
# All objects
all_entries = Entry.objects.all()

# Filter
Entry.objects.filter(pub_date__year=2024)
Entry.objects.exclude(pub_date__gte=datetime.date.today())
Entry.objects.filter(headline__startswith="What")

# Get single object (raises DoesNotExist or MultipleObjectsReturned)
entry = Entry.objects.get(pk=1)

# Get with fallback
entry = Entry.objects.get(pk=1, headline="Hello")

# latest() / earliest()
latest = Entry.objects.latest("pub_date")
earliest = Entry.objects.earliest("pub_date")

# first() / last()
first = Entry.objects.first()
last = Entry.objects.last()

# exists()
if Entry.objects.filter(pub_date__year=2024).exists():
    print("Found entries")

# count()
count = Entry.objects.filter(pub_date__year=2024).count()
```

## Field Lookups

Format: `field__lookuptype=value`

```python
# exact (default)
Entry.objects.get(id__exact=14)
Entry.objects.get(id=14)  # __exact is implied

# iexact (case-insensitive)
Blog.objects.get(name__iexact="beatles blog")

# contains / icontains
Entry.objects.filter(headline__contains="Lennon")
Entry.objects.filter(headline__icontains="lennon")

# startswith / istartswith / endswith / iendswith
Entry.objects.filter(headline__startswith="What")
Entry.objects.filter(headline__iendswith="world")

# gt / gte / lt / lte
Entry.objects.filter(id__gt=4)
Entry.objects.filter(pub_date__lte="2024-01-01")

# in
Entry.objects.filter(id__in=[1, 2, 3])
Entry.objects.filter(headline__in=["A", "B", "C"])

# isnull
Entry.objects.filter(pub_date__isnull=True)

# range
Entry.objects.filter(pub_date__range=("2024-01-01", "2024-12-31"))

# date / year / month / day / week / week_day / iso_year / iso_week_day / quarter
Entry.objects.filter(pub_date__date=datetime.date.today())
Entry.objects.filter(pub_date__year=2024)
Entry.objects.filter(pub_date__month=1)
Entry.objects.filter(pub_date__day=15)
Entry.objects.filter(pub_date__week=2)
Entry.objects.filter(pub_date__week_day=1)  # Sunday=1
Entry.objects.filter(pub_date__quarter=1)

# time / hour / minute / second
Entry.objects.filter(pub_date__time=datetime.time(10, 30))
Entry.objects.filter(pub_date__hour=10)
Entry.objects.filter(pub_date__minute=30)

# regex / iregex
Entry.objects.filter(headline__regex=r"^(An|The)")
Entry.objects.filter(headline__iregex=r"^(an|the)")
```

## Lookups That Span Relationships

```python
# Follow FK
Entry.objects.filter(blog__name="Beatles Blog")

# Multiple levels
Entry.objects.filter(blog__name__icontains="beatles")

# Reverse FK (using related_name)
Blog.objects.filter(entries__headline__icontains="Lennon")

# M2M
Pizza.objects.filter(toppings__name__startswith="P")
```

## Filters Can Reference Fields (F Expressions)

```python
from django.db.models import F

# Compare fields
Entry.objects.filter(n_comments__gt=F("n_pingbacks"))
Entry.objects.filter(n_comments__gt=F("n_pingbacks") * 2)
Entry.objects.filter(rating__lt=F("n_comments") + F("n_pingbacks"))

# With timedelta
from datetime import timedelta
Entry.objects.filter(mod_date__gt=F("pub_date") + timedelta(days=3))

# Transform
Entry.objects.filter(pub_date__year=F("mod_date__year"))
```

## The pk Lookup Shortcut

```python
# These three are equivalent
Entry.objects.get(id__exact=14)
Entry.objects.get(id=14)
Entry.objects.get(pk=14)

# pk works with lookups
Entry.objects.filter(pk__in=[1, 4, 7])
Entry.objects.filter(pk__gt=14)
```

## Q Objects (Complex Lookups)

```python
from django.db.models import Q

# OR
Q(question__startswith="Who") | Q(question__startswith="What")

# AND (implicit)
Poll.objects.get(
    Q(question__startswith="Who"),
    Q(pub_date=date(2005, 5, 2)) | Q(pub_date=date(2005, 5, 6)),
)

# NOT
Q(question__startswith="Who") | ~Q(pub_date__year=2005)

# XOR (^) — Django 6.0
Q(name__startswith="A") ^ Q(name__startswith="B")

# Mix Q objects and keyword arguments
# Q objects must come BEFORE keyword arguments
Poll.objects.get(
    Q(pub_date=date(2005, 5, 2)) | Q(pub_date=date(2005, 5, 6)),
    question__startswith="Who",
)
```

## Limiting QuerySets

```python
# Slice (LIMIT + OFFSET)
Entry.objects.all()[:5]      # LIMIT 5
Entry.objects.all()[5:10]    # OFFSET 5 LIMIT 5

# Negative indexing not supported
# Entry.objects.all()[-1]  # ERROR
```

## Caching and QuerySets

```python
# QuerySet is lazy — not evaluated until used
queryset = Entry.objects.filter(headline__startswith="What")
# No DB hit yet

# Evaluates on iteration
for entry in queryset:
    print(entry.headline)

# Cached after first evaluation
print([e.headline for e in queryset])  # DB hit
print([e.headline for e in queryset])  # Uses cache

# Force evaluation
list(queryset)

# exists() — doesn't cache, efficient check
queryset.exists()
```

## Asynchronous Queries (Django 6.0)

```python
import asyncio
from myapp.models import Entry

async def main():
    # Async QuerySet methods
    entries = Entry.objects.filter(pub_date__year=2024)
    async for entry in entries:
        print(entry.headline)

    # Async get
    entry = await Entry.objects.aget(pk=1)

    # Async create
    entry = await Entry.objects.acreate(headline="Async entry")

    # Async count
    count = await Entry.objects.filter(pub_date__year=2024).acount()

    # Async exists
    exists = await Entry.objects.filter(headline__contains="Lennon").aexists()

asyncio.run(main())
```

## Updating Multiple Objects

```python
# Bulk update
Entry.objects.filter(pub_date__year=2024).update(
    headline="Everything is the same",
)

# Using F expressions
Entry.objects.all().update(n_pingbacks=F("n_comments"))
```

## Deleting Objects

```python
# Delete specific
entry.delete()

# Bulk delete
Entry.objects.filter(pub_date__year=2024).delete()

# Delete returns count: (total_deleted, {model: count})
result = Entry.objects.filter(pub_date__year=2024).delete()
# (42, {'app.Entry': 42})
```

## Copying Model Instances

```python
entry = Entry.objects.get(pk=1)
entry.pk = None  # Clear PK
entry.save()     # Creates new instance
```

## Aggregation

```python
from django.db.models import Count, Sum, Avg, Max, Min, Q

# Aggregate
total = Entry.objects.aggregate(Sum("n_comments"))
# Returns: {'n_comments__sum': 123}

# Annotate
blogs = Blog.objects.annotate(entry_count=Count("entry"))
for blog in blogs:
    print(blog.entry_count)

# Multiple aggregations
stats = Entry.objects.aggregate(
    total_comments=Sum("n_comments"),
    avg_rating=Avg("rating"),
    max_rating=Max("rating"),
)

# Group by with values
from django.db.models import Count
Entry.objects.values("pub_date__year").annotate(
    count=Count("id")
).order_by("pub_date__year")
```

## Query Expressions

```python
from django.db.models import F, Value, Func, ExpressionWrapper, fields
from django.db.models.functions import Concat, Lower, Upper, Length, Substr

# F expressions
Entry.objects.filter(n_comments__gt=F("n_pingbacks"))

# ExpressionWrapper for complex expressions
ExpressionWrapper(
    F("price") * F("quantity"),
    output_field=fields.DecimalField(max_digits=10, decimal_places=2),
)

# Database functions
Entry.objects.annotate(
    name_lower=Lower("headline"),
    name_length=Length("headline"),
    full_name=Concat("first_name", Value(" "), "last_name"),
)

# Conditional expressions
from django.db.models import Case, When, Value, IntegerField

Entry.objects.annotate(
    priority=Case(
        When(pub_date__year=2024, then=Value(1)),
        When(pub_date__year=2023, then=Value(2)),
        default=Value(3),
        output_field=IntegerField(),
    )
)
```

## Raw SQL (Fallback)

```python
# raw()
for entry in Entry.objects.raw("SELECT * FROM blog_entry WHERE headline = %s", ["Lennon"]):
    print(entry)

# execute custom SQL
from django.db import connection

with connection.cursor() as cursor:
    cursor.execute("UPDATE blog_entry SET headline = %s WHERE id = %s", ["New headline", 1])
    cursor.execute("SELECT id, headline FROM blog_entry")
    rows = cursor.fetchall()
```

## QuerySet Methods Reference

### Methods that return QuerySets
- `filter(**kwargs)` — Filter by conditions
- `exclude(**kwargs)` — Exclude by conditions
- `annotate(*args, **kwargs)` — Add annotations
- `alias(*args, **kwargs)` — Add aliases (not selected)
- `order_by(*fields)` — Order results
- `reverse()` — Reverse ordering
- `distinct(*fields)` — Distinct results
- `values(*fields)` — Return dicts
- `values_list(*fields, flat=False)` — Return tuples
- `dates(field, kind, order)` — Distinct dates
- `datetimes(field, kind, order)` — Distinct datetimes
- `none()` — Empty QuerySet
- `all()` — All objects
- `union(*other_qs)` — SQL UNION
- `intersection(*other_qs)` — SQL INTERSECT
- `difference(*other_qs)` — SQL EXCEPT
- `select_related(*fields)` — JOIN FK/OneToOne (single query)
- `prefetch_related(*lookups)` — Separate query for M2M/reverse
- `extra(select, where, params, tables, order_by)` — Extra SQL (avoid)
- `defer(*fields)` — Don't load fields
- `only(*fields)` — Load only these fields
- `using(alias)` — Use specific database
- `select_for_update()` — Row-level locking

### Methods that don't return QuerySets
- `get(**kwargs)` — Single object
- `create(**kwargs)` — Create and save
- `get_or_create(defaults, **kwargs)` — Get or create
- `update_or_create(defaults, **kwargs)` — Update or create
- `bulk_create(objs, batch_size)` — Bulk insert
- `bulk_update(objs, fields, batch_size)` — Bulk update
- `count()` — Count
- `in_bulk(id_list)` — Dict of objects by PK
- `iterator(chunk_size)` — Iterator (no caching)
- `latest(field_name)` — Latest by field
- `earliest(field_name)` — Earliest by field
- `first()` — First object
- `last()` — Last object
- `aggregate(*args)` — Aggregate
- `exists()` — Check existence
- `update(**kwargs)` — Bulk update
- `delete()` — Bulk delete
- `as_manager()` — Create manager from QuerySet
- `explain(format)` — SQL EXPLAIN
