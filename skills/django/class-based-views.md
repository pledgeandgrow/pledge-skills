# Class-Based Views — Django 6.0

## Generic Views

### Display Views

```python
from django.views.generic import ListView, DetailView, TemplateView
from .models import Article

class ArticleListView(ListView):
    model = Article
    template_name = "articles/list.html"
    context_object_name = "articles"
    paginate_by = 10
    ordering = ["-published_at"]

    def get_queryset(self):
        qs = super().get_queryset()
        if not self.request.user.is_superuser:
            qs = qs.filter(published=True)
        return qs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["total_count"] = self.get_queryset().count()
        return context

class ArticleDetailView(DetailView):
    model = Article
    template_name = "articles/detail.html"
    context_object_name = "article"
    slug_field = "slug"
    slug_url_kwarg = "slug"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["related"] = Article.objects.exclude(pk=self.object.pk)[:5]
        return context

class HomePageView(TemplateView):
    template_name = "home.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["featured"] = Article.objects.filter(featured=True)[:3]
        return context
```

### Editing Views

```python
from django.views.generic import CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin

class ArticleCreateView(LoginRequiredMixin, CreateView):
    model = Article
    fields = ["title", "content", "category"]
    template_name = "articles/form.html"
    success_url = reverse_lazy("article-list")

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

class ArticleUpdateView(LoginRequiredMixin, UpdateView):
    model = Article
    fields = ["title", "content", "category"]
    template_name = "articles/form.html"
    success_url = reverse_lazy("article-list")

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(author=self.request.user)

class ArticleDeleteView(LoginRequiredMixin, DeleteView):
    model = Article
    template_name = "articles/confirm_delete.html"
    success_url = reverse_lazy("article-list")
```

### Form View

```python
from django.views.generic import FormView
from .forms import ContactForm

class ContactView(FormView):
    template_name = "contact.html"
    form_class = ContactForm
    success_url = "/thanks/"

    def form_valid(self, form):
        # Process form data
        form.send_email()
        return super().form_valid(form)
```

## Mixins

### Auth Mixins

```python
from django.contrib.auth.mixins import (
    LoginRequiredMixin,
    PermissionRequiredMixin,
    UserPassesTestMixin,
)

class ArticleUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Article
    fields = ["title", "content"]
    login_url = "/login/"
    permission_required = "articles.change_article"
    raise_exception = True

class ArticleDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Article
    success_url = reverse_lazy("article-list")

    def test_func(self):
        article = self.get_object()
        return self.request.user == article.author or self.request.user.is_superuser
```

### Other Mixins

```python
from django.views.generic.dates import (
    YearArchiveView, MonthArchiveView, DayArchiveView,
    DateDetailView, ArchiveIndexView, TodayArchiveView,
)

class ArticleYearArchiveView(YearArchiveView):
    queryset = Article.objects.all()
    date_field = "published_at"
    make_object_list = True
    allow_future = False
    template_name = "articles/year.html"

class ArticleMonthArchiveView(MonthArchiveView):
    queryset = Article.objects.all()
    date_field = "published_at"
    month_format = "%m"
    template_name = "articles/month.html"
```

## Custom Mixins

```python
class StaffRequiredMixin:
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise PermissionDenied
        return super().dispatch(request, *args, **kwargs)

class AuthorRequiredMixin:
    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(author=self.request.user)

class CacheMixin:
    cache_timeout = 60 * 5

    def get_cache_key(self):
        return f"view_{self.__class__.__name__}_{self.request.path}"

    def dispatch(self, request, *args, **kwargs):
        from django.core.cache import cache
        key = self.get_cache_key()
        cached = cache.get(key)
        if cached:
            return cached
        response = super().dispatch(request, *args, **kwargs)
        cache.set(key, response, self.cache_timeout)
        return response
```

## Method Flow

### CreateView flow:
1. `dispatch()` — Route by HTTP method
2. `get()` or `post()` — Handle request
3. `get_form_class()` — Get form class
4. `get_form_kwargs()` — Build form kwargs
5. `get_form()` — Instantiate form
6. `form_valid()` or `form_invalid()` — Handle result
7. `form_valid()` → `save()` → `get_success_url()`

### ListView flow:
1. `dispatch()` — Route by HTTP method
2. `get()` — Handle GET
3. `get_queryset()` — Get objects
4. `get_context_data()` — Build context
5. `get_paginate_by()` — Get pagination size
6. `paginate_queryset()` — Paginate
7. `render_to_response()` — Render template

## Flattened Method Index

### Attributes
- `model` — Model class
- `queryset` — Custom queryset (overrides model)
- `template_name` — Template path
- `template_name_suffix` — Suffix for auto-generated template name
- `context_object_name` — Context variable name
- `paginate_by` — Items per page
- `paginate_orphans` — Min items on last page
- `page_kwarg` — URL parameter for page number
- `ordering` — Default ordering
- `slug_field` — Field for slug lookup
- `slug_url_kwarg` — URL kwarg for slug
- `pk_url_kwarg` — URL kwarg for PK

### Methods (override these)
- `get_queryset()` — Return the queryset
- `get_object()` — Get single object (DetailView)
- `get_context_data(**kwargs)` — Add to context
- `get_template_names()` — Return template list
- `get_paginate_by(queryset)` — Get pagination size
- `get_allow_future()` — Allow future dates (date views)
- `form_valid(form)` — Handle valid form
- `form_invalid(form)` — Handle invalid form
- `get_form_class()` — Get form class
- `get_form_kwargs()` — Get form kwargs
- `get_success_url()` — Get redirect URL after success
- `get_initial()` — Get initial form data
- `dispatch(request, *args, **kwargs)` — Entry point

## URL Configuration

```python
from django.urls import path
from .views import ArticleListView, ArticleDetailView, ArticleCreateView

urlpatterns = [
    path("articles/", ArticleListView.as_view(), name="article-list"),
    path("articles/<int:pk>/", ArticleDetailView.as_view(), name="article-detail"),
    path("articles/create/", ArticleCreateView.as_view(), name="article-create"),
]
```
