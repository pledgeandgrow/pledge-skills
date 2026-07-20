# Testing — Django 6.0

## Test Structure

```python
# myapp/tests.py
from django.test import TestCase, SimpleTestCase, TransactionTestCase
from django.test import Client
from django.urls import reverse
from .models import Article

class ArticleModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.article = Article.objects.create(
            title="Test Article",
            content="Test content",
            published=True,
        )

    def test_article_str(self):
        self.assertEqual(str(self.article), "Test Article")

    def test_article_default_published(self):
        article = Article.objects.create(title="New", content="Content")
        self.assertFalse(article.published)
```

## TestCase Types

- **`SimpleTestCase`** — No database access, for utility functions and views without DB
- **`TestCase`** — Database access, wrapped in transaction (rolled back after each test)
- **`TransactionTestCase`** — Database access without transaction wrapping (slower, needed for testing transactions)
- **`LiveServerTestCase`** — Starts a live server for browser testing (Selenium, etc.)

## Test Client

```python
from django.test import TestCase, Client

class ViewTest(TestCase):
    def setUp(self):
        self.client = Client()

    def test_list_view(self):
        response = self.client.get(reverse("article-list"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "articles/list.html")
        self.assertContains(response, "Articles")

    def test_detail_view(self):
        article = Article.objects.create(title="Test", content="Content")
        response = self.client.get(reverse("article-detail", kwargs={"pk": article.pk}))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Test")

    def test_create_view_requires_login(self):
        response = self.client.get(reverse("article-create"))
        self.assertEqual(response.status_code, 302)  # Redirect to login

    def test_post_data(self):
        response = self.client.post(
            reverse("article-create"),
            {"title": "New Article", "content": "Content"},
        )
        self.assertEqual(response.status_code, 302)
        self.assertTrue(Article.objects.filter(title="New Article").exists())
```

## Fixtures

```python
class WithFixturesTest(TestCase):
    fixtures = ["articles.json", "authors.json"]

    def test_with_fixture_data(self):
        self.assertEqual(Article.objects.count(), 5)
```

```json
// articles.json
[
    {
        "model": "myapp.article",
        "pk": 1,
        "fields": {
            "title": "Fixture Article",
            "content": "Content",
            "published": true
        }
    }
]
```

## Testing with Authentication

```python
from django.contrib.auth.models import User
from django.test import TestCase

class AuthViewTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="testpass123",
        )

    def test_login_required_view(self):
        # Not logged in
        response = self.client.get(reverse("dashboard"))
        self.assertEqual(response.status_code, 302)

        # Logged in
        self.client.login(username="testuser", password="testpass123")
        response = self.client.get(reverse("dashboard"))
        self.assertEqual(response.status_code, 200)

    def test_force_login(self):
        self.client.force_login(self.user)
        response = self.client.get(reverse("dashboard"))
        self.assertEqual(response.status_code, 200)
```

## Assertions Reference

```python
# Status codes
self.assertEqual(response.status_code, 200)
self.assertRedirects(response, "/expected-url/", status_code=302, target_status_code=200)

# Templates
self.assertTemplateUsed(response, "template.html")
self.assertTemplateNotUsed(response, "other.html")

# Content
self.assertContains(response, "text", status_code=200)
self.assertNotContains(response, "hidden text")

# Querysets
self.assertQuerySetEqual(
    Article.objects.all(),
    ["<Article: First>", "<Article: Second>"],
    transform=str,
)

# Form errors
self.assertFormError(response, "form", "field_name", "Error message")
self.assertFormsetError(response, "formset", 0, "field", "Error")

# JSON
self.assertJSONEqual(response.content, {"key": "value"})

# Generic
self.assertTrue(condition)
self.assertFalse(condition)
self.assertEqual(a, b)
self.assertNotEqual(a, b)
self.assertIsNone(value)
self.assertIsNotNone(value)
self.assertIn(item, container)
self.assertNotIn(item, container)
self.assertRaises(SomeException, callable)
self.assertRaises(SomeException, callable, args)
self.assertWarns(SomeWarning, callable)
```

## Testing Email

```python
from django.core import mail
from django.test import TestCase

class EmailTest(TestCase):
    def test_send_email(self):
        mail.send_mail(
            "Subject", "Body",
            "from@example.com", ["to@example.com"],
        )
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, "Subject")
        self.assertEqual(mail.outbox[0].to, ["to@example.com"])
```

## Testing Caching

```python
from django.test import TestCase
from django.core.cache import cache

class CacheTest(TestCase):
    def setUp(self):
        cache.clear()

    def test_cache(self):
        cache.set("key", "value", timeout=60)
        self.assertEqual(cache.get("key"), "value")
        self.assertIsNone(cache.get("nonexistent"))
```

## Testing File Uploads

```python
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile

class FileUploadTest(TestCase):
    def test_upload(self):
        file = SimpleUploadedFile(
            "test.txt",
            b"file content",
            content_type="text/plain",
        )
        response = self.client.post(
            reverse("upload"),
            {"file": file},
        )
        self.assertEqual(response.status_code, 200)
```

## Overriding Settings

```python
from django.test import TestCase, override_settings

class SettingsTest(TestCase):
    @override_settings(DEBUG=True, EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
    def test_with_custom_settings(self):
        # DEBUG is True in this test
        pass

    @override_settings(
        MIDDLEWARE=[
            "django.middleware.common.CommonMiddleware",
        ]
    )
    def test_with_custom_middleware(self):
        pass
```

## Async Testing

```python
from django.test import AsyncClient, TransactionTestCase

class AsyncViewTest(TransactionTestCase):
    async def test_async_view(self):
        client = AsyncClient()
        response = await client.get("/api/data/")
        self.assertEqual(response.status_code, 200)

    async def test_async_orm(self):
        article = await Article.objects.acreate(title="Async", content="Content")
        count = await Article.objects.acount()
        self.assertEqual(count, 1)
```

## Running Tests

```bash
# Run all tests
python manage.py test

# Run specific app
python manage.py test myapp

# Run specific test class
python manage.py test myapp.tests.ArticleModelTest

# Run specific test method
python manage.py test myapp.tests.ArticleModelTest.test_article_str

# Verbose output
python manage.py test -v 2

# Keep test database
python manage.py test --keepdb

# Run in parallel
python manage.py test --parallel

# With coverage
coverage run --source=myapp manage.py test
coverage report
coverage html  # Generate HTML report
```

## Test Database

Tests run against a separate database (test_<dbname>). Created and destroyed automatically.

```python
# settings.py
if "test" in sys.argv:
    DATABASES["default"]["ENGINE"] = "django.db.backends.sqlite3"
```
