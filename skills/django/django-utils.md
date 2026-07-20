# Django Utils — Django 6.0

## django.utils.cache

Helpers for controlling caching via HTTP headers.

```python
from django.utils.cache import (
    get_cache_key,
    learn_cache_key,
    patch_cache_control,
    patch_response_headers,
    patch_vary_headers,
    get_max_age,
)

# Add Cache-Control headers to a response
from django.http import HttpResponse
response = HttpResponse("Hello")
patch_cache_control(response, max_age=3600, public=True)
# Cache-Control: max-age=3600, public

# Add Vary headers
patch_vary_headers(response, ["Cookie", "Accept-Encoding"])
# Vary: Cookie, Accept-Encoding

# Patch response with Expires and Cache-Control
patch_response_headers(response, cache_timeout=3600)

# Get max age from response
max_age = get_max_age(response)

# Learn/get cache key for a request
key = get_cache_key(request)
key = learn_cache_key(request, response, timeout=3600)
```

## django.utils.dateparse

Parse strings into datetime/date/time objects.

```python
from django.utils.dateparse import (
    parse_date,
    parse_time,
    parse_datetime,
    parse_duration,
)

# Parse ISO 8601 date
parse_date("2024-01-15")  # datetime.date(2024, 1, 15)

# Parse ISO 8601 time
parse_time("14:30:00")  # datetime.time(14, 30)
parse_time("14:30:00.123456")  # datetime.time(14, 30, 0, 123456)

# Parse ISO 8601 datetime
parse_datetime("2024-01-15T14:30:00")  # datetime.datetime(2024, 1, 15, 14, 30)
parse_datetime("2024-01-15T14:30:00+02:00")  # timezone-aware datetime

# Parse ISO 8601 duration
parse_duration("P1DT2H3M4S")  # datetime.timedelta(days=1, seconds=7384)
parse_duration("PT4H")  # datetime.timedelta(seconds=14400)

# Returns None on invalid input
parse_date("invalid")  # None
```

## django.utils.decorators

Helpers for writing decorators and applying them to functions/methods.

```python
from django.utils.decorators import (
    method_decorator,
    decorator_from_middleware,
    decorator_from_middleware_with_args,
)

# Apply a function decorator to all methods in a class
from django.views.decorators.cache import cache_page

@method_decorator(cache_page(60 * 15), name="dispatch")
class MyListView(ListView):
    model = Article

# Apply different decorators to different methods
@method_decorator(login_required, name="dispatch")
@method_decorator(cache_page(60), name="get")
class MyView(View):
    pass

# Create a decorator from middleware
cache_page = decorator_from_middleware_with_args(CacheMiddleware)(60 * 15)

# decorator_from_middleware (no args)
gzip_page = decorator_from_middleware(GZipMiddleware)
```

## django.utils.encoding

Smart string handling for Python strings and bytes.

```python
from django.utils.encoding import (
    smart_str,
    smart_bytes,
    force_str,
    force_bytes,
    iri_to_uri,
    uri_to_iri,
    filepath_to_uri,
    escape_uri_path,
    repercent_broken_unicode,
    filepath_to_uri,
    make_bytes,
    smart_text,
    force_text,
)

# smart_str — Convert to str, handling lazy objects
smart_str("hello")  # "hello"
smart_str(b"hello")  # "hello"
smart_str(42)  # "42"
smart_str("\xe9")  # "é" (handles encoding)

# force_str — Like smart_str but for immediate evaluation
force_str(lazy_object)  # Forces evaluation of lazy objects

# smart_bytes / force_bytes — Convert to bytes
smart_bytes("hello")  # b"hello"
force_bytes("hello")  # b"hello"

# IRI to URI conversion
iri_to_uri("/café/")  # "/caf%C3%A9/"
uri_to_iri("/caf%C3%A9/")  # "/café/"

# Filepath to URI
filepath_to_uri("media/images/my file.jpg")  # "media/images/my%20file.jpg"
```

## django.utils.feedgenerator

Syndication feed generation utilities.

```python
from django.utils.feedgenerator import (
    Rss201rev2Feed,
    RssUserland091Feed,
    Atom1Feed,
    SyndicationFeed,
)

# Create an RSS feed
feed = Rss201rev2Feed(
    title="My Blog",
    link="https://example.com/blog/",
    description="Latest blog posts",
    language="en",
)

feed.add_item(
    title="First Post",
    link="https://example.com/blog/first-post/",
    description="My first blog post",
    pubdate=datetime(2024, 1, 15, 14, 30),
)

# Write to file
import io
output = io.BytesIO()
feed.write(output, "utf-8")
rss_content = output.getvalue()

# Atom feed
atom_feed = Atom1Feed(
    title="My Blog",
    link="https://example.com/blog/",
    description="Latest blog posts",
)
```

## django.utils.functional

Functional programming helpers including lazy objects.

```python
from django.utils.functional import (
    cached_property,
    lazy,
    lazystr,
    keep_lazy,
    keep_lazy_text,
    SimpleLazyObject,
    lazy_property,
)

# cached_property — Compute once, cache on instance
class MyClass:
    @cached_property
    def expensive_computation(self):
        # Only computed once, then cached
        return [i * 2 for i in range(1000000)]

# SimpleLazyObject — Defer initialization until accessed
user = SimpleLazyObject(lambda: get_user(request))
# get_user() not called until user is accessed
print(user.username)  # Now get_user() is called

# lazy — Make a function lazy
from django.utils.translation import gettext as _
lazy_gettext = lazy(_)
lazy_string = lazy_gettext("Welcome")
# Translation deferred until string is evaluated

# keep_lazy — Keep return value lazy
from django.utils.translation import gettext
from django.utils.safestring import mark_safe

@keep_lazy(str)
def my_function():
    return gettext("Hello")
```

## django.utils.html

HTML escaping and manipulation utilities.

```python
from django.utils.html import (
    escape,
    escapejs,
    format_html,
    format_html_join,
    linebreaks,
    strip_tags,
    remove_tags,
    smart_urlquote,
    urlencode,
    urlize,
    wordwrap,
    conditional_escape,
    mark_safe,
)

# escape — HTML-escape a string
escape("<script>alert('xss')</script>")
# &lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;

# format_html — Safe HTML formatting
format_html('<a href="{}">{}</a>', url, title)
# Escapes arguments automatically

# format_html_join — Join items with safe HTML
items = [("https://a.com", "A"), ("https://b.com", "B")]
html = format_html_join("\n", '<li><a href="{}">{}</a></li>', items)

# linebreaks — Convert newlines to HTML
linebreaks("Line 1\nLine 2")
# <p>Line 1<br>Line 2</p>

# strip_tags — Remove all HTML tags
strip_tags("<p>Hello <b>world</b></p>")  # "Hello world"

# urlize — Convert URLs to links
urlize("Check https://example.com out")
# 'Check <a href="https://example.com">https://example.com</a> out'

# conditional_escape — Escape only if not already marked safe
from django.utils.safestring import mark_safe
conditional_escape(mark_safe("<b>bold</b>"))  # "<b>bold</b>" (not escaped)
conditional_escape("<b>bold</b>")  # "&lt;b&gt;bold&lt;/b&gt;" (escaped)

# wordwrap — Wrap text at given width
wordwrap("Long text here", width=10)
```

## django.utils.http

HTTP utilities for URLs, dates, and encoding.

```python
from django.utils.http import (
    urlencode,
    http_date,
    parse_http_date,
    quote_etag,
    unquote_etag,
    is_safe_url,
    url_has_allowed_host_and_scheme,
    urlsafe_base64_encode,
    urlsafe_base64_decode,
    http_date,
)

# urlencode — Build query strings
urlencode({"q": "django", "page": 2})  # "q=django&page=2"
urlencode([("q", "django"), ("page", 2)])  # "q=django&page=2"
urlencode({"tags": ["python", "web"]})  # "tags=python&tags=web"

# http_date — Format datetime as HTTP date
http_date(datetime(2024, 1, 15, 14, 30, 0))
# "Mon, 15 Jan 2024 14:30:00 GMT"

# parse_http_date — Parse HTTP date string
parse_http_date("Mon, 15 Jan 2024 14:30:00 GMT")  # 1705326600

# quote_etag / unquote_etag
quote_etag('abc123')  # '"abc123"'
unquote_etag('"abc123"')  # 'abc123'

# urlsafe_base64_encode/decode
urlsafe_base64_encode(b"user:42")  # b"dXNlcjo0Mg"
urlsafe_base64_decode(b"dXNlcjo0Mg")  # b"user:42"

# is_safe_url — Check if URL is safe for redirect
is_safe_url("/redirect/here/")  # True (relative)
is_safe_url("https://evil.com/")  # False (absolute, different host)
```

## django.utils.module_loading

Importing modules and checking availability.

```python
from django.utils.module_loading import (
    import_string,
    module_has_submodule,
    import_module,
)

# import_string — Import a class/function by dotted path
MyMiddleware = import_string("myapp.middleware.MyMiddleware")
MyModel = import_string("myapp.models.Article")

# module_has_submodule — Check if module has a submodule
import myapp
if module_has_submodule(myapp, "templatetags"):
    # myapp.templatetags exists
    pass
```

## django.utils.safestring

Mark strings as safe for HTML rendering.

```python
from django.utils.safestring import (
    mark_safe,
    SafeString,
    SafeData,
    SafeBytes,
)

# mark_safe — Mark a string as safe (no auto-escaping)
html = mark_safe("<b>Hello</b>")
# In templates, this won't be escaped

# SafeString — Type for type checking
isinstance(mark_safe("hello"), SafeString)  # True

# Use with format_html for safe HTML construction
from django.utils.html import format_html
safe_html = format_html(
    '<span class="{}">{}</span>',
    "highlight",
    user_input,  # This gets escaped
)
```

## django.utils.text

Text manipulation utilities.

```python
from django.utils.text import (
    slugify,
    camel_case_to_spaces,
    get_text_list,
    smart_split,
    Truncator,
    wrap,
    normalize_newlines,
    phone2numeric,
    compress_string,
    compress_sequence,
    format_lazy,
    capfirst,
)

# slugify — Convert to URL-safe slug
slugify("Hello World!")  # "hello-world"
slugify("Café résumé")  # "cafe-resume"
slugify("Django 6.0 Release", allow_unicode=True)  # "django-60-release"

# camel_case_to_spaces
camel_case_to_spaces("CamelCaseWord")  # "Camel Case Word"

# get_text_list — Join list with "and"
get_text_list(["apple", "banana", "cherry"])
# "apple, banana and cherry"
get_text_list(["apple", "banana"], "or")
# "apple or banana"

# Truncator — Truncate text
from django.utils.text import Truncator
Truncator("This is a long sentence.").chars(10)
# "This is a..."
Truncator("This is a long sentence.").words(3)
# "This is a..."

# smart_split — Split respecting quotes
list(smart_split('hello "world foo" bar'))
# ['hello', '"world foo"', 'bar']

# capfirst
capfirst("hello")  # "Hello"

# wrap — Wrap text to width
wrap("Long text here", width=5)
# ['Long ', 'text ', 'here']

# normalize_newlines
normalize_newlines("line1\r\nline2\rline3\n")
# "line1\nline2\nline3\n"

# format_lazy — Lazy string formatting
from django.utils.translation import gettext_lazy as _
format_lazy(_("Hello {name}"), name=_("World"))
```

## django.utils.timezone

Timezone handling utilities.

```python
from django.utils.timezone import (
    now,
    utc,
    localtime,
    localdate,
    make_naive,
    make_aware,
    get_default_timezone,
    get_current_timezone,
    activate,
    deactivate,
    override,
    is_aware,
    is_naive,
    get_fixed_timezone,
    datetime_aware,
    datetime_naive,
    datetime,
)

# now — Current datetime (timezone-aware if USE_TZ=True)
now()  # datetime.datetime(2024, 1, 15, 14, 30, tzinfo=...)

# utc — UTC timezone object
utc  # datetime.timezone.utc

# localtime — Convert to local timezone
from datetime import datetime
aware_dt = datetime(2024, 1, 15, 12, 0, tzinfo=utc)
localtime(aware_dt)  # Converted to TIME_ZONE setting

# localdate — Get local date
localdate(aware_dt)  # datetime.date(2024, 1, 15)

# make_aware — Make naive datetime timezone-aware
from datetime import datetime
naive_dt = datetime(2024, 1, 15, 14, 30)
aware_dt = make_aware(naive_dt)  # Adds current timezone
# Or with specific timezone
from zoneinfo import ZoneInfo
aware_dt = make_aware(naive_dt, ZoneInfo("America/New_York"))

# make_naive — Convert aware datetime to naive
naive_dt = make_naive(aware_dt)

# is_aware / is_naive
is_aware(aware_dt)  # True
is_naive(naive_dt)  # True

# activate / deactivate — Change current timezone
activate(ZoneInfo("America/New_York"))
get_current_timezone()  # ZoneInfo("America/New_York")
deactivate()  # Reset to default

# override — Context manager for timezone
with override(ZoneInfo("Asia/Tokyo")):
    # Current timezone is Asia/Tokyo inside this block
    print(localtime(now()))

# get_fixed_timezone — Fixed offset timezone
tz = get_fixed_timezone(120)  # UTC+2
```

## django.utils.translation

Translation and internationalization utilities.

```python
from django.utils.translation import (
    gettext,
    gettext_lazy,
    ngettext,
    ngettext_lazy,
    pgettext,
    pgettext_lazy,
    npgettext,
    npgettext_lazy,
    activate,
    deactivate,
    get_language,
    get_language_bidi,
    get_language_info,
    to_locale,
    LANGUAGE_SESSION_KEY,
)

# gettext — Translate a string
gettext("Welcome")  # "Bienvenue" (if French is active)

# gettext_lazy — Lazy translation (for module-level strings)
from django.utils.translation import gettext_lazy as _

class MyModel(models.Model):
    name = models.CharField(_("name"), max_length=100)

    class Meta:
        verbose_name = _("my model")
        verbose_name_plural = _("my models")

# ngettext — Pluralization
ngettext("one item", "%(count)d items", count) % {"count": count}

# pgettext — Contextual translation
pgettext("month name", "May")  # Different from pgettext("permission", "may")

# npgettext — Contextual pluralization
npgettext("animal", "one mouse", "%(count)d mice", count)

# Lazy variants for module-level use
ngettext_lazy("one item", "%(count)d items", "count")
pgettext_lazy("verb", "May")

# activate / deactivate
activate("fr")  # Switch to French
get_language()  # "fr"
deactivate()  # Reset to default

# get_language_bidi — Right-to-left?
get_language_bidi()  # True for Hebrew, Arabic, etc.

# get_language_info
info = get_language_info("fr")
# {'bidi': False, 'code': 'fr', 'name': 'French', 'name_local': 'français'}

# to_locale — Convert language code to locale
to_locale("en-us")  # "en_US"
to_locale("fr")  # "fr"
```
