# Advanced Views — Django 6.0

## TemplateResponse Objects

### SimpleTemplateResponse

```python
from django.template.response import SimpleTemplateResponse

def my_view(request):
    response = SimpleTemplateResponse(
        template="my_template.html",
        context={"foo": "bar"},
        content_type="text/html",
    )
    return response
```

### TemplateResponse

```python
from django.template.response import TemplateResponse

def my_view(request):
    return TemplateResponse(
        request,
        "my_template.html",
        context={"foo": "bar"},
    )
```

### Differences from render()

```python
# render() — immediately renders to HttpResponse
# TemplateResponse — deferred rendering (rendered after middleware processing)

# TemplateResponse allows middleware to modify the response before rendering
# The template is not rendered until the response is processed
```

### TemplateResponse Attributes

```python
response = TemplateResponse(request, "template.html", context={})

response.template_name   # "template.html"
response.context_data    # {"foo": "bar"}
response.is_rendered     # False
response.content         # Bytes (empty until rendered)

# Force rendering
response.render()
print(response.is_rendered)  # True
print(response.content)      # Rendered HTML bytes
```

### Post-render Callbacks

```python
def my_view(request):
    response = TemplateResponse(request, "template.html", {})
    response.add_post_render_callback(my_callback)
    return response

def my_callback(response):
    # Called after template is rendered
    response["X-Custom-Header"] = "value"
```

## Generating CSV

### Using csv module

```python
import csv
from django.http import HttpResponse, StreamingHttpResponse

def download_csv(request):
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="report.csv"'

    writer = csv.writer(response)
    writer.writerow(["Name", "Email", "Date"])
    for user in User.objects.all():
        writer.writerow([user.name, user.email, user.date_joined])

    return response
```

### Streaming Large CSV

```python
import csv
from django.http import StreamingHttpResponse

class Echo:
    """An object that implements just the write method of the file-like interface."""
    def write(self, value):
        return value

def streaming_csv(request):
    rows = (["Row {}".format(i), str(i)] for i in range(100000))
    pseudo_buffer = Echo()
    writer = csv.writer(pseudo_buffer)
    response = StreamingHttpResponse(
        (writer.writerow(row) for row in rows),
        content_type="text/csv",
    )
    response["Content-Disposition"] = 'attachment; filename="large.csv"'
    return response
```

### Using a Template

```python
# templates/csv_template.txt
{% for row in data %}{% for cell in row %}{% if forloop.last %}{{ cell }}{% else %}"{{ cell }}",{% endif %}{% endfor %}
{% endfor %}

# View
from django.template.loader import render_to_string
from django.http import HttpResponse

def csv_via_template(request):
    data = [["Name", "Email"], ["John", "john@example.com"]]
    csv_content = render_to_string("csv_template.txt", {"data": data})
    response = HttpResponse(csv_content, content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="export.csv"'
    return response
```

## Generating PDF

### Using ReportLab

```python
from io import BytesIO
from reportlab.pdfgen import canvas
from django.http import HttpResponse

def generate_pdf(request):
    buffer = BytesIO()
    p = canvas.Canvas(buffer)

    p.drawString(100, 750, "Hello World!")
    p.drawString(100, 730, "Generated with ReportLab in Django.")

    p.showPage()
    p.save()

    buffer.seek(0)
    response = HttpResponse(buffer, content_type="application/pdf")
    response["Content-Disposition"] = 'attachment; filename="hello.pdf"'
    return response
```

### PDF with Tables

```python
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from io import BytesIO
from django.http import HttpResponse

def generate_invoice_pdf(request, invoice_id):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []

    elements.append(Paragraph(f"Invoice #{invoice_id}", styles["Title"]))

    data = [
        ["Item", "Quantity", "Price", "Total"],
        ["Widget A", "2", "$10.00", "$20.00"],
        ["Widget B", "5", "$5.00", "$25.00"],
        ["", "", "Grand Total:", "$45.00"],
    ]

    table = Table(data)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
    ]))
    elements.append(table)

    doc.build(elements)
    buffer.seek(0)
    return HttpResponse(buffer, content_type="application/pdf")
```

## Conditional Content Processing

### ETag and Last-Modified Headers

```python
from django.http import HttpResponseNotModified
import hashlib

def conditional_view(request):
    article = Article.objects.get(pk=1)

    # Compute ETag
    content = article.body
    etag = hashlib.md5(content.encode()).hexdigest()

    # Check If-None-Match
    if request.headers.get("If-None-Match") == etag:
        return HttpResponseNotModified()

    # Check If-Modified-Since
    if_modified_since = request.META.get("HTTP_IF_MODIFIED_SINCE")
    if if_modified_since:
        from email.utils import parsedate_to_datetime
        ims_date = parsedate_to_datetime(if_modified_since)
        if article.updated_at <= ims_date:
            return HttpResponseNotModified()

    response = HttpResponse(content)
    response["ETag"] = etag
    response["Last-Modified"] = article.updated_at.strftime(
        "%a, %d %b %Y %H:%M:%S GMT"
    )
    return response
```

### Using ConditionalGetMiddleware

```python
# settings.py
MIDDLEWARE = [
    "django.middleware.http.ConditionalGetMiddleware",
    # ...
]

# Automatically adds ETag and handles If-None-Match/If-Modified-Since
# Only works when DEBUG=False
```

### Using condition() Decorator

```python
from django.views.decorators.http import condition

def latest_entry(request, blog_id):
    return Blog.objects.get(pk=blog_id).latest_updated

def etag_func(request, blog_id):
    return str(hash(Blog.objects.get(pk=blog_id).latest_updated))

@condition(last_modified_func=latest_entry, etag_func=etag_func)
def blog_detail(request, blog_id):
    blog = Blog.objects.get(pk=blog_id)
    return render(request, "blog/detail.html", {"blog": blog})
```

### ETag with condition() — Multiple Functions

```python
from django.views.decorators.http import condition, last_modified, etag

@last_modified(latest_entry)
@etag(etag_func)
def blog_detail(request, blog_id):
    # Only renders if ETag/Last-Modified don't match
    return render(request, "blog/detail.html", {"blog": blog})
```
