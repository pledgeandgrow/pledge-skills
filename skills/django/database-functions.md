# Database Functions Reference — Django 6.0

## Comparison and Conversion Functions

```python
from django.db.models.functions import Cast, Coalesce, Collate, Greatest, Least, NullIf

# Cast — type conversion
Article.objects.annotate(
    views_text=Cast("views", output_field=models.TextField()),
)

# Coalesce — first non-null value
Article.objects.annotate(
    display_name=Coalesce("title", "subtitle", models.Value("Untitled")),
)

# Collate — specify collation
Author.objects.annotate(
    name_collate=Collate("name", "en_US"),
).order_by("name_collate")

# Greatest / Least
Employee.objects.annotate(
    max_salary=Greatest("base_salary", "bonus"),
    min_salary=Least("base_salary", "bonus"),
)

# NullIf — null if two values are equal
Article.objects.annotate(
    custom_title=NullIf("title", "Untitled"),
)
```

## Date Functions

```python
from django.db.models.functions import (
    Extract, ExtractDay, ExtractHour, ExtractMinute, ExtractMonth,
    ExtractQuarter, ExtractSecond, ExtractWeek, ExtractIsoWeekDay,
    ExtractWeekDay, ExtractYear, ExtractIsoYear,
    Now, Trunc, TruncDate, TruncTime,
    TruncDay, TruncHour, TruncMinute, TruncMonth, TruncQuarter,
    TruncSecond, TruncWeek, TruncYear,
)

# Extract components
Article.objects.annotate(
    year=ExtractYear("published_at"),
    month=ExtractMonth("published_at"),
    day=ExtractDay("published_at"),
    hour=ExtractHour("published_at"),
    weekday=ExtractWeekDay("published_at"),  # 1=Sunday, 7=Saturday
    week=ExtractWeek("published_at"),
    quarter=ExtractQuarter("published_at"),
)

# Generic Extract
Article.objects.annotate(
    year=Extract("published_at", "year"),
    month=Extract("published_at", "month"),
)

# Now — current timestamp
Article.objects.filter(published_at__lte=Now())

# Trunc — truncate to specific unit
Article.objects.annotate(
    day=TruncDay("published_at"),       # 2024-01-15 00:00:00
    hour=TruncHour("published_at"),     # 2024-01-15 14:00:00
    month=TruncMonth("published_at"),   # 2024-01-01 00:00:00
    year=TruncYear("published_at"),     # 2024-01-01 00:00:00
).filter(day__gte="2024-01-01")

# Group by month
from django.db.models import Count
Article.objects.annotate(
    month=TruncMonth("published_at"),
).values("month").annotate(
    count=Count("id"),
).order_by("month")
```

## JSON Functions

```python
from django.db.models.functions import JSONArray, JSONObject

# JSONArray — construct JSON array
Article.objects.annotate(
    tags_json=JSONArray("title", "slug"),
)

# JSONObject — construct JSON object
Article.objects.annotate(
    meta=JSONObject(
        title="title",
        author="author__name",
        date="published_at",
    ),
)
```

## Math Functions

```python
from django.db.models.functions import (
    Abs, ACos, ASin, ATan, ATan2, Ceil, Cos, Cot, Degrees,
    Exp, Floor, Ln, Log, Mod, Pi, Power, Radians, Random,
    Round, Sign, Sin, Sqrt, Tan,
)

Product.objects.annotate(
    abs_price=Abs("price_change"),
    rounded=Round("price", 2),  # Round to 2 decimal places
    ceiling=Ceil("price"),
    floor=Floor("price"),
    power=Power("price", 2),    # price^2
    sqrt=Sqrt("price"),
    natural_log=Ln("price"),
    log10=Log(10, "price"),     # log base 10
    mod=Mod("price", 10),       # price % 10
    radians=Radians("angle"),
    degrees=Degrees("angle"),
    random=Random(),            # Random float 0-1
    pi=Pi(),
)
```

## Text Functions

```python
from django.db.models.functions import (
    Chr, Concat, ConcatPair, Left, Length, Lower, LPad, LTrim,
    MD5, Ord, Repeat, Replace, Reverse, Right, RPad, RTrim,
    SHA1, SHA224, SHA256, SHA384, SHA512,
    StrIndex, Substr, Trim, Upper,
)

# Concat — concatenate strings
Author.objects.annotate(
    full_name=Concat("first_name", models.Value(" "), "last_name"),
)

# Length — string length
Article.objects.annotate(
    title_len=Length("title"),
).filter(title_len__gt=50)

# Lower / Upper
Author.objects.annotate(
    name_lower=Lower("name"),
    name_upper=Upper("name"),
)

# Left / Right — first/last N characters
Article.objects.annotate(
    preview=Left("body", 100),
    extension=Right("filename", 4),
)

# Substr — substring
Article.objects.annotate(
    first_word=Substr("title", 1, 10),  # Start at 1, length 10
)

# Replace
Article.objects.annotate(
    clean_body=Replace("body", "old_word", "new_word"),
)

# Reverse
Article.objects.annotate(
    reversed_title=Reverse("title"),
)

# Repeat
Article.objects.annotate(
    repeated=Repeat("title", 3),
)

# Trim / LTrim / RTrim
Article.objects.annotate(
    trimmed=Trim("title"),
    ltrimmed=LTrim("title"),
    rtrimmed=RTrim("title"),
)

# Pad
Article.objects.annotate(
    padded=LPad("title", 50, " "),  # Pad to 50 chars with spaces
    rpadded=RPad("title", 50, "*"),
)

# Hash functions
User.objects.annotate(
    email_hash=MD5("email"),
    secure_hash=SHA256("password"),
)

# Chr / Ord
Article.objects.annotate(
    first_char=Chr("code"),
    ordinal=Ord("first_letter"),
)

# StrIndex — position of substring
Article.objects.annotate(
    pos=StrIndex("body", "django"),
).filter(pos__gt=0)
```

## Window Functions

```python
from django.db.models.functions import (
    CumeDist, DenseRank, FirstValue, Lag, LastValue, Lead,
    NthValue, Ntile, PercentRank, Rank, RowNumber,
)
from django.db.models import Window, F

# RowNumber — sequential row number
Employee.objects.annotate(
    row_num=Window(
        expression=RowNumber(),
        order_by=F("salary").desc(),
    ),
)

# Rank — rank with gaps
Employee.objects.annotate(
    rank=Window(
        expression=Rank(),
        order_by=F("salary").desc(),
    ),
)

# DenseRank — rank without gaps
Employee.objects.annotate(
    dense_rank=Window(
        expression=DenseRank(),
        order_by=F("salary").desc(),
    ),
)

# Lag — previous row value
Sale.objects.annotate(
    prev_amount=Window(
        expression=Lag("amount", offset=1),
        order_by=F("date").asc(),
    ),
    change=F("amount") - F("prev_amount"),
)

# Lead — next row value
Sale.objects.annotate(
    next_amount=Window(
        expression=Lead("amount", offset=1),
        order_by=F("date").asc(),
    ),
)

# FirstValue / LastValue
Sale.objects.annotate(
    first_sale=Window(
        expression=FirstValue("amount"),
        partition_by=[F("region")],
        order_by=F("date").asc(),
    ),
)

# NthValue
Sale.objects.annotate(
    second_sale=Window(
        expression=NthValue("amount", nth=2),
        order_by=F("date").asc(),
    ),
)

# Ntile — divide rows into N buckets
Employee.objects.annotate(
    quartile=Window(
        expression=Ntile(num_buckets=4),
        order_by=F("salary").desc(),
    ),
)

# PercentRank / CumeDist
Employee.objects.annotate(
    percentile=Window(
        expression=PercentRank(),
        order_by=F("salary").asc(),
    ),
    cum_dist=Window(
        expression=CumeDist(),
        order_by=F("salary").asc(),
    ),
)

# Partition by (group within window)
Employee.objects.annotate(
    dept_rank=Window(
        expression=Rank(),
        partition_by=[F("department")],
        order_by=F("salary").desc(),
    ),
)
```

## Using Functions in Annotations

```python
from django.db.models import F, Value, FloatField
from django.db.models.functions import Length, Upper, Concat

# Combine functions
Author.objects.annotate(
    display_name=Concat(
        Upper("first_name"),
        Value(" "),
        Upper("last_name"),
        output_field=models.CharField(),
    ),
    name_length=Length("first_name") + Length("last_name"),
)

# Filter on annotated function
Article.objects.annotate(
    title_len=Length("title"),
).filter(title_len__gte=10)

# Use in aggregation
from django.db.models import Avg
Article.objects.annotate(
    title_len=Length("title"),
).aggregate(
    avg_title_len=Avg("title_len"),
)
```
