# Views — Django 6.0

## Function-Based Views

```python
from django.http import HttpResponse, HttpRequest
from django.shortcuts import render, get_object_or_404, redirect
from .models import Article

def article_list(request: HttpRequest) -> HttpResponse:
    articles = Article.objects.filter(published=True)
    return render(request, "articles/list.html", {"articles": articles})

def article_detail(request: HttpRequest, pk: int) -> HttpResponse:
    article = get_object_or_404(Article, pk=pk)
    return render(request, "articles/detail.html", {"article": article})
```

## View Decorators

```python
from django.views.decorators.http import require_http_methods, require_GET, require_POST
from django.contrib.auth.decorators import login_required, permission_required
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.views.decorators.cache import cache_page, never_cache
from django.views.decorators.gzip import gzip_page
from django.views.decorators.vary import vary_on_headers, vary_on_cookie

@require_GET
def article_list(request):
    ...

@login_required(login_url="/login/")
@permission_required("articles.view_article", raise_exception=True)
@cache_page(60 * 15)  # Cache for 15 minutes
def article_detail(request, pk):
    ...

@require_POST
@csrf_protect
def create_article(request):
    ...
```

## Shortcuts

```python
from django.shortcuts import render, redirect, get_object_or_404, get_list_or_404

# render(template, context, request, content_type, status)
return render(request, "template.html", {"key": "value"}, status=200)

# redirect(to, permanent=False, *args, **kwargs)
return redirect("article-detail", pk=1)
return redirect("/articles/1/")
return redirect("https://example.com")

# get_object_or_404(Model, **kwargs)
article = get_object_or_404(Article, pk=pk, published=True)

# get_list_or_404(Model, **kwargs)
articles = get_list_or_404(Article, published=True)
```

## Request and Response Objects

### HttpRequest

```python
# Attributes
request.method          # "GET", "POST", etc.
request.GET             # QueryDict for GET params
request.POST            # QueryDict for POST params
request.FILES           # Uploaded files
request.headers         # Case-insensitive dict of headers
request.COOKIES         # Dict of cookies
request.path            # Path without domain: "/articles/1/"
request.path_info       # Same as path
request.META            # Dict of environment/headers
request.body            # Raw body bytes
request.scheme          # "http" or "https"
request.encoding        # Character encoding
request.content_type    # Content-Type header
request.session         # Session dict (if SessionMiddleware enabled)
request.user            # User object (if AuthenticationMiddleware enabled)

# Methods
request.get_host()      # "example.com"
request.get_port()      # "8000"
request.get_full_path() # "/articles/1/?page=2"
request.is_secure()     # True if HTTPS
request.is_ajax()       # Deprecated — use request.headers.get("x-requested-with")
```

### HttpResponse

```python
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect, Http404

# Basic
response = HttpResponse("Hello world")
response = HttpResponse("<h1>HTML</h1>", content_type="text/html")
response = HttpResponse("data", status=201)
response = HttpResponse(b"bytes", content_type="application/octet-stream")

# JsonResponse
return JsonResponse({"key": "value"})
return JsonResponse([1, 2, 3], safe=False)  # For non-dict responses

# Redirect
return HttpResponseRedirect("/articles/")
return redirect("article-list")

# File response
from django.http import FileResponse
return FileResponse(open("file.pdf", "rb"), as_attachment=True, filename="download.pdf")

# Streaming
def stream_csv(request):
    import csv
    rows = [["1", "2", "3"], ["4", "5", "6"]]
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = "attachment; filename=data.csv"
    writer = csv.writer(response)
    for row in rows:
        writer.writerow(row)
    return response
```

## Class-Based Views

```python
from django.views import View
from django.http import HttpResponse

class HelloView(View):
    def get(self, request):
        return HttpResponse("Hello, GET!")

    def post(self, request):
        return HttpResponse("Hello, POST!")
```

### Generic Views

```python
from django.views.generic import (
    TemplateView, ListView, DetailView,
    CreateView, UpdateView, DeleteView,
    FormView, RedirectView,
)

class ArticleListView(ListView):
    model = Article
    template_name = "articles/list.html"
    context_object_name = "articles"
    paginate_by = 10
    ordering = ["-published_at"]

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.user.is_authenticated:
            return qs
        return qs.filter(published=True)

class ArticleDetailView(DetailView):
    model = Article
    template_name = "articles/detail.html"
    context_object_name = "article"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["related"] = Article.objects.exclude(pk=self.object.pk)[:5]
        return context

class ArticleCreateView(CreateView):
    model = Article
    fields = ["title", "content", "published"]
    template_name = "articles/form.html"
    success_url = "/articles/"

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

class ArticleUpdateView(UpdateView):
    model = Article
    fields = ["title", "content"]
    template_name = "articles/form.html"
    success_url = "/articles/"

class ArticleDeleteView(DeleteView):
    model = Article
    template_name = "articles/confirm_delete.html"
    success_url = "/articles/"
```

### Mixins

```python
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin

class ArticleCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    model = Article
    fields = ["title", "content"]
    login_url = "/login/"
    permission_required = "articles.add_article"
    raise_exception = True
```

## Async Views (Django 6.0)

```python
import asyncio
from django.http import HttpResponse, JsonResponse

async def async_view(request):
    await asyncio.sleep(0.1)  # Simulate async work
    return HttpResponse("Async response")

async def async_api(request):
    data = await fetch_data()
    return JsonResponse(data)

# Mix sync and async with sync_to_async / async_to_sync
from asgiref.sync import sync_to_async, async_to_sync

async def async_with_orm(request):
    articles = await sync_to_async(list)(Article.objects.all())
    return JsonResponse({"count": len(articles)})
```

## File Uploads

```python
def upload_file(request):
    if request.method == "POST":
        uploaded_file = request.FILES["file"]
        # Attributes:
        # uploaded_file.name       — File name
        # uploaded_file.size       — Size in bytes
        # uploaded_file.content_type — MIME type
        # uploaded_file.read()     — Read bytes
        # uploaded_file.chunks()   — Generator of chunks
        # uploaded_file.multiple_chunks() — True if > 2.5MB
        with open(f"uploads/{uploaded_file.name}", "wb") as f:
            for chunk in uploaded_file.chunks():
                f.write(chunk)
        return HttpResponse("Uploaded!")
    return render(request, "upload.html")
```

## Generating CSV

```python
import csv
from django.http import HttpResponse

def export_csv(request):
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="articles.csv"'
    writer = csv.writer(response)
    writer.writerow(["Title", "Author", "Date"])
    for article in Article.objects.all():
        writer.writerow([article.title, article.author, article.published_at])
    return response
```

## Error Views

Custom error handlers in `urls.py`:

```python
handler404 = "myapp.views.custom_404"
handler500 = "myapp.views.custom_500"
handler403 = "myapp.views.custom_403"
handler400 = "myapp.views.custom_400"
```

```python
def custom_404(request, exception):
    return render(request, "errors/404.html", status=404)

def custom_500(request):
    return render(request, "errors/500.html", status=500)
```

## Raising Http404

```python
from django.http import Http404

def article_detail(request, pk):
    try:
        article = Article.objects.get(pk=pk)
    except Article.DoesNotExist:
        raise Http404("Article not found")
    return render(request, "articles/detail.html", {"article": article})
```
