# REST API Patterns — Django 6.0

## Django REST Framework Integration

### Installation

```bash
pip install djangorestframework
pip install djangorestframework-simplejwt  # JWT auth
pip install django-filter  # Filtering
pip install drf-spectacular  # OpenAPI/Swagger docs
```

### Configuration

```python
# settings.py
INSTALLED_APPS = [
    # ...
    "rest_framework",
    "rest_framework_simplejwt",
    "django_filters",
    "drf_spectacular",
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

SPECTACULAR_SETTINGS = {
    "TITLE": "My API",
    "DESCRIPTION": "API documentation",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
}
```

### Serializers

```python
from rest_framework import serializers
from .models import Article, Author

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ["id", "name", "email"]

class ArticleSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    author_id = serializers.PrimaryKeyRelatedField(
        queryset=Author.objects.all(),
        source="author",
        write_only=True,
    )

    class Meta:
        model = Article
        fields = ["id", "title", "content", "author", "author_id",
                  "published", "created_at"]
        read_only_fields = ["created_at"]
        extra_kwargs = {
            "title": {"required": True, "max_length": 200},
        }

    def validate_title(self, value):
        if "spam" in value.lower():
            raise serializers.ValidationError("Title contains spam.")
        return value

    def validate(self, attrs):
        if attrs.get("published") and not attrs.get("content"):
            raise serializers.ValidationError("Published articles need content.")
        return attrs

    def create(self, validated_data):
        article = Article.objects.create(**validated_data)
        return article

    def update(self, instance, validated_data):
        instance.title = validated_data.get("title", instance.title)
        instance.content = validated_data.get("content", instance.content)
        instance.published = validated_data.get("published", instance.published)
        instance.save()
        return instance
```

### ViewSets

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Article
from .serializers import ArticleSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_fields = ["published", "author", "category"]
    search_fields = ["title", "content", "author__name"]
    ordering_fields = ["created_at", "title", "published_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        qs = super().get_queryset()
        if not self.request.user.is_staff:
            qs = qs.filter(published=True)
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    # Custom action
    @action(detail=True, methods=["post"])
    def publish(self, request, pk=None):
        article = self.get_object()
        article.published = True
        article.save()
        return Response({"status": "published"})

    @action(detail=False, methods=["get"])
    def published(self, request):
        articles = self.get_queryset().filter(published=True)
        serializer = self.get_serializer(articles, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        article = self.get_object()
        # Like logic
        return Response({"status": "liked"})
```

### Function-Based API Views

```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Article
from .serializers import ArticleSerializer

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticatedOrReadOnly])
def article_list(request):
    if request.method == "GET":
        articles = Article.objects.all()
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = ArticleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET", "PUT", "PATCH", "DELETE"])
def article_detail(request, pk):
    try:
        article = Article.objects.get(pk=pk)
    except Article.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = ArticleSerializer(article)
        return Response(serializer.data)

    elif request.method in ("PUT", "PATCH"):
        partial = request.method == "PATCH"
        serializer = ArticleSerializer(article, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        article.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
```

### URL Routing

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet

router = DefaultRouter()
router.register(r"articles", ArticleViewSet, basename="article")

urlpatterns = [
    path("api/", include(router.urls)),
    path("api/articles/<int:pk>/publish/", ArticleViewSet.as_view({"post": "publish"})),
    # DRF auth
    path("api/auth/", include("rest_framework.urls")),
    # JWT
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # OpenAPI schema
    path("api/schema/", SpectacularAPIView.as_view(), name="api-schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="api-schema"), name="api-docs"),
]
```

### JWT Authentication

```python
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
]

# settings.py
from datetime import timedelta

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": os.environ.get("JWT_SECRET_KEY"),
    "AUTH_HEADER_TYPES": ("Bearer",),
}
```

### Permissions

```python
from rest_framework import permissions

class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_staff
```

### Throttling

```python
# settings.py
REST_FRAMEWORK = {
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "100/day",
        "user": "1000/day",
        "burst": "60/min",
    },
}

# Per-view
from rest_framework.throttling import UserRateThrottle

class BurstRateThrottle(UserRateThrottle):
    scope = "burst"

class ArticleViewSet(viewsets.ModelViewSet):
    throttle_classes = [BurstRateThrottle]
```

### Without DRF (Pure Django JSON API)

```python
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Article

@csrf_exempt
@require_http_methods(["GET", "POST"])
def api_articles(request):
    if request.method == "GET":
        articles = list(Article.objects.values("id", "title", "published"))
        return JsonResponse(articles, safe=False)

    elif request.method == "POST":
        data = json.loads(request.body)
        article = Article.objects.create(
            title=data["title"],
            content=data.get("content", ""),
        )
        return JsonResponse({"id": article.id, "title": article.title}, status=201)

@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
def api_article_detail(request, pk):
    try:
        article = Article.objects.get(pk=pk)
    except Article.DoesNotExist:
        return JsonResponse({"error": "Not found"}, status=404)

    if request.method == "GET":
        return JsonResponse({"id": article.id, "title": article.title})

    elif request.method == "PUT":
        data = json.loads(request.body)
        article.title = data.get("title", article.title)
        article.save()
        return JsonResponse({"id": article.id, "title": article.title})

    elif request.method == "DELETE":
        article.delete()
        return JsonResponse({"deleted": True}, status=204)
```
