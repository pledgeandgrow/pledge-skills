# Admin Site — Django 6.0

## Registering Models

```python
from django.contrib import admin
from .models import Article, Author

# Simple registration
admin.site.register(Article)

# Custom ModelAdmin
@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "published_at", "is_published")
    list_filter = ("published", "category", "published_at")
    search_fields = ("title", "content")
    ordering = ("-published_at",)
    date_hierarchy = "published_at"
```

## ModelAdmin Options

```python
@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    # Display
    list_display = ("title", "author", "published_at")
    list_display_links = ("title",)  # Which fields link to edit page
    list_editable = ("published",)   # Editable in list view
    list_select_related = ("author",)  # Optimize FK queries

    # Filtering
    list_filter = ("published", "category", "published_at")
    filter_horizontal = ("tags",)  # M2M horizontal filter
    filter_vertical = ("categories",)  # M2M vertical filter
    date_hierarchy = "published_at"
    show_facets = True  # Django 6.0 — facet filters in sidebar

    # Search
    search_fields = ("title", "content", "author__name")

    # Ordering
    ordering = ("-published_at",)

    # Pagination
    list_per_page = 50
    list_max_show_all = 200

    # Form layout
    fields = ("title", "content", "author", "published")
    exclude = ("created_at",)
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        (None, {
            "fields": ("title", "content")
        }),
        ("Advanced", {
            "classes": ("collapse", "wide"),
            "fields": ("author", "published", "category"),
        }),
    )

    # Inlines
    inlines = [CommentInline, TagInline]

    # Actions
    actions = ["make_published", "make_draft"]

    # Raw ID fields (for large FK/M2M)
    raw_id_fields = ("author",)
    autocomplete_fields = ("author", "category")

    # Save behavior
    save_on_top = True
    save_as = True  # Save as new
    save_as_continue = False

    # Other
    prepopulated_fields = {"slug": ("title",)}
    view_on_site = True
    show_full_result_count = False  # Performance optimization
    sortable_by = ("title", "published_at")
    search_help_text = "Search by title or content"
```

## Inline Models

```python
class CommentInline(admin.TabularInline):
    model = Comment
    extra = 3
    max_num = 10
    can_delete = True
    show_change_link = True
    fk_name = "article"
    verbose_name = "Comment"
    verbose_name_plural = "Comments"
    fields = ("author", "text", "approved")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)

class TagInline(admin.StackedInline):
    model = Article.tags.through
    extra = 1

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    inlines = [CommentInline, TagInline]
```

## Admin Actions

```python
@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    actions = ["make_published", "export_selected"]

    @admin.action(description="Mark selected as published")
    def make_published(self, request, queryset):
        updated = queryset.update(published=True)
        self.message_user(request, f"{updated} articles published.")

    @admin.action(description="Export selected articles")
    def export_selected(self, request, queryset):
        # Custom export logic
        pass

    # Site-wide action (disable)
    def get_actions(self, request):
        actions = super().get_actions(request)
        if "delete_selected" in actions:
            del actions["delete_selected"]
        return actions
```

## Customizing Admin Site

```python
from django.contrib import admin

class MyAdminSite(admin.AdminSite):
    site_header = "My Administration"
    site_title = "My Admin Portal"
    index_title = "Welcome to My Admin"
    site_url = "/"

    def get_urls(self):
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path("my_view/", self.admin_view(self.my_view), name="my_view"),
        ]
        return custom_urls + urls

    def my_view(self, request):
        # Custom admin view
        from django.http import HttpResponse
        return HttpResponse("Custom admin view")

# Use custom admin site
admin_site = MyAdminSite(name="myadmin")

# Register models on custom site
@admin.register(Article, site=admin_site)
class ArticleAdmin(admin.ModelAdmin):
    pass
```

## Admin URL Configuration

```python
# urls.py
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path("admin/", admin.site.urls),
    # Or with custom admin site:
    # path("myadmin/", admin_site.urls),
]
```

## Overriding Admin Templates

```
templates/
    admin/
        base_site.html      # Override site header/title
        change_list.html    # Override list view
        change_form.html    # Override edit form
        index.html          # Override dashboard
        login.html          # Override login page
```

```html
<!-- templates/admin/base_site.html -->
{% extends "admin/base.html" %}

{% block branding %}
    <h1 id="site-name"><a href="{% url 'admin:index' %}">My Admin</a></h1>
{% endblock %}

{% block nav-global %}{% endblock %}
```

## Permissions in Admin

```python
@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(author=request.user)

    def has_change_permission(self, request, obj=None):
        if obj and obj.author != request.user and not request.user.is_superuser:
            return False
        return True

    def has_delete_permission(self, request, obj=None):
        return False  # Disable delete

    def has_view_permission(self, request, obj=None):
        return True

    def has_add_permission(self, request):
        return request.user.has_perm("articles.add_article")

    def has_module_permission(self, request):
        return request.user.has_module_perms("articles")
```

## Admin Documentation

Enable admin docs:
```python
# settings.py
INSTALLED_APPS = [
    # ...
    "django.contrib.admindocs",
]

# urls.py
urlpatterns = [
    path("admin/doc/", include("django.contrib.admindocs.urls")),
    path("admin/", admin.site.urls),
]
```

## Admin Custom Views

```python
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render

@staff_member_required
def custom_admin_view(request):
    context = {
        "title": "Custom Dashboard",
        "opts": {"app_label": "myapp", "model_name": "article"},
    }
    return render(request, "admin/custom_view.html", context)
```
