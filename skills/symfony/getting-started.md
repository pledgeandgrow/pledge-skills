# Symfony — Getting Started

> Symfony is a set of PHP Components, a Web Application framework, a Philosophy, and a Community — all working together to help you build web applications faster and with less code.

**Documentation**: [symfony.com/doc](https://symfony.com/doc)  
**Version**: Symfony 8.x (current)  

## Setup & Installation

### Technical Requirements

Before creating your first Symfony application:
- **PHP 8.2+** required (check with `php -v`)
- Install PHP extensions: Ctype, Iconv, PCRE, Session, SimpleXML, Tokenizer
- Composer 2+

### Creating Symfony Applications

```bash
# Create a new Symfony application
symfony new my_project --version=current
cd my_project

# Or use Composer
composer create-project symfony/skeleton my_project
cd my_project
```

### Setting up an Existing Project

```bash
git clone some-repo my_project
cd my_project
composer install
```

### Running Symfony Applications

```bash
# Using the Symfony binary (recommended)
symfony server:start

# Using PHP's built-in server
php -S 127.0.0.1:8000 -t public/
```

### Symfony Docker Integration

```bash
symfony new my_project --docker
```

### Installing Packages

```bash
composer require logger # installs symfony/monolog-bundle
composer require orm # installs doctrine
composer require webapp # installs webapp recipes (forms, validator, etc.)
```

#### Symfony Packs

Packs are metapackages that install multiple related packages:

```bash
composer require debug # dev pack (profiler, debug bundle)
composer require --dev maker # dev pack (maker bundle)
```

### Checking Security Vulnerabilities

```bash
symfony check:security
# or
composer audit
```

### Symfony LTS Versions

Symfony releases a new minor version every 6 months and a new major version every 2 years. LTS versions receive 3 years of support.

## Creating Pages

Creating a new page is a two-step process:
1. Create a **route** (URL path)
2. Create a **controller** (PHP function that builds the page)

```php
// src/Controller/LuckyController.php
namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class LuckyController
{
    #[Route('/lucky/number')]
    public function number(): Response
    {
        $number = random_int(0, 100);

        return new Response(
            '<html><body>Lucky number: '.$number.'</body></html>'
        );
    }
}
```

### The Web Debug Toolbar

Symfony provides a debug toolbar at the bottom of each page in dev mode, showing profiling data, route info, and more.

## Routing

### Creating Routes as Attributes

```php
use Symfony\Component\Routing\Attribute\Route;

class BlogController
{
    #[Route('/blog', name: 'blog_list')]
    public function list(): Response { /* ... */ }

    #[Route('/blog/{slug}', name: 'blog_show')]
    public function show(string $slug): Response { /* ... */ }
}
```

### Creating Routes in YAML

```yaml
# config/routes.yaml
blog_list:
    path: /blog
    controller: App\Controller\BlogController::list

blog_show:
    path: /blog/{slug}
    controller: App\Controller\BlogController::show
```

### Matching HTTP Methods

```php
#[Route('/api/posts/{id}', methods: ['GET', 'HEAD'])]
public function show(int $id): Response { /* ... */ }

#[Route('/api/posts/{id}', methods: ['PUT', 'PATCH'])]
public function edit(int $id): Response { /* ... */ }
```

### Route Parameters

```php
#[Route('/blog/{slug}', name: 'blog_show')]
// {slug} is a required parameter

#[Route('/blog/{page}', name: 'blog_list')]
// Optional parameter with default value
public function list(int $page = 1): Response { /* ... */ }
```

#### Parameters Validation

```php
#[Route('/blog/{page}', name: 'blog_list', requirements: ['page' => '\d+'])]
public function list(int $page): Response { /* ... */ }
```

#### Parameter Conversion

```php
#[Route('/blog/{slug}', name: 'blog_show')]
public function show(BlogPost $post): Response
{
    // $post is automatically fetched from database by slug
}
```

### Route Groups and Prefixes

```php
#[Route('/api', name: 'api_')]
class ApiController extends AbstractController
{
    #[Route('/users', name: 'users')]
    public function users(): Response { /* ... */ }

    #[Route('/products', name: 'products')]
    public function products(): Response { /* ... */ }
}
```

### Sub-Domain Routing

```php
#[Route('/', name: 'mobile_homepage', host: 'm.example.com')]
public function mobileHomepage(): Response { /* ... */ }
```

### Localized Routes (i18n)

```php
#[Route([
    'en' => '/about',
    'fr' => '/a-propos',
], name: 'about')]
public function about(): Response { /* ... */ }
```

### Generating URLs

```php
// In controllers
$url = $this->generateUrl('blog_show', ['slug' => 'my-post']);

// With absolute URL
$url = $this->generateUrl('blog_show', ['slug' => 'my-post'], UrlGeneratorInterface::ABSOLUTE_URL);
```

```twig
{# In Twig templates #}
{{ path('blog_show', {slug: 'my-post'}) }}
{{ url('blog_show', {slug: 'my-post'}) }}
```

### Signing URIs

```php
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

// Generate a signed URL
$url = $this->generateUrl('blog_show', ['slug' => 'my-post'], UrlGeneratorInterface::ABSOLUTE_URL);
$signedUrl = $this->container->get('uri_signer')->sign($url);
```

### Debugging Routes

```bash
php bin/console debug:router
php bin/console router:match /blog/my-post
```

## Controllers

### A Basic Controller

```php
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DefaultController extends AbstractController
{
    #[Route('/hello/{name}', name: 'hello')]
    public function index(string $name): Response
    {
        return new Response("Hello $name!");
    }
}
```

### The Base Controller Class

`AbstractController` provides helper methods:
- `$this->render()` — Render a Twig template
- `$this->redirectToRoute()` — Redirect to a route
- `$this->json()` — Return JSON response
- `$this->file()` — Return a file download
- `$this->getUser()` — Get the current user
- `$this->isGranted()` — Check permissions
- `$this->denyAccessUnlessGranted()` — Deny access

### Rendering Templates

```php
return $this->render('blog/show.html.twig', [
    'post' => $post,
    'title' => $post->getTitle(),
]);
```

### Redirecting

```php
return $this->redirectToRoute('blog_list');
return $this->redirect('https://example.com');
```

### The Request Object

```php
use Symfony\Component\HttpFoundation\Request;

public function index(Request $request): Response
{
    $page = $request->query->get('page', 1);
    $method = $request->getMethod();
    $content = $request->getContent();
}
```

### MapQueryParameter

```php
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;

public function list(
    #[MapQueryParameter] int $page = 1,
    #[MapQueryParameter(filter: FILTER_VALIDATE_REGEXP, options: ['regexp' => '/^\w+$/'])] string $sort = 'title',
): Response { /* ... */ }
```

### MapRequestPayload

```php
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;

public function create(#[MapRequestPayload] MyDto $dto): Response
{
    // Validates and maps request body to DTO
}
```

### Managing the Session

```php
public function index(Request $request): Response
{
    $session = $request->getSession();
    $session->set('foo', 'bar');
    $value = $session->get('foo', 'default');
}
```

### Flash Messages

```php
$this->addFlash('success', 'Post created successfully!');

// In Twig
{% for message in app.flashes('success') %}
    <div class="flash-notice">{{ message }}</div>
{% endfor %}
```

### Returning JSON Response

```php
return $this->json(['name' => $post->getTitle(), 'content' => $post->getContent()]);
```

### Streaming File Responses

```php
return $this->file('/path/to/file.pdf');
return $this->file('/path/to/file.pdf', 'custom_name.pdf');
```

### Sending Early Hints

```php
use Symfony\Component\WebLink\Link;

public function index(): Response
{
    $response = new Response();
    $response->headers->set('Link', (string) (new Link('preload', '/styles.css')));
    return $response;
}
```

## Templates / Twig

### Installation

```bash
composer require twig
```

### Twig Templating Language

Twig is a flexible, fast, and secure template engine:
- `{% %}` — Statements (logic, loops, conditions)
- `{{ }}` — Expressions (output)
- `{# #}` — Comments

```twig
{# templates/blog/show.html.twig #}
{% extends 'base.html.twig' %}

{% block title %}{{ post.title }}{% endblock %}

{% block body %}
    <h1>{{ post.title }}</h1>
    <p>{{ post.content }}</p>
{% endblock %}
```

### Template Naming and Location

Templates are stored in `templates/` directory. Names use `bundle:controller:template` format (legacy) or `blog/show.html.twig` (modern).

### Linking to Pages

```twig
<a href="{{ path('blog_show', {slug: post.slug}) }}">{{ post.title }}</a>
<a href="{{ url('blog_show', {slug: post.slug}) }}">Absolute URL</a>
```

### Linking to Assets

```twig
<link rel="stylesheet" href="{{ asset('styles/app.css') }}">
<script src="{{ asset('app.js') }}"></script>
```

### Template Inheritance and Layouts

```twig
{# templates/base.html.twig #}
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}Welcome{% endblock %}</title>
    {% block stylesheets %}{% endblock %}
</head>
<body>
    {% block body %}{% endblock %}
</body>
</html>
```

### Including Templates

```twig
{{ include('blog/_post.html.twig', {post: post}) }}
```

### Embedding Controllers

```twig
{{ render(controller('App\\Controller\\BlogController::recentPosts')) }}
```

### Global Variables

- `app.user` — Current user object
- `app.request` — Request object
- `app.session` — Session object
- `app.flashes` — Flash messages
- `app.environment` — Current environment

### Output Escaping

Twig auto-escapes HTML by default:
```twig
{{ post.content|raw }} {# Disable escaping #}
```

### Writing a Twig Extension

```php
namespace App\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class AppExtension extends AbstractExtension
{
    public function getFilters(): array
    {
        return [
            new TwigFilter('price', [$this, 'formatPrice']),
        ];
    }

    public function formatPrice(float $number): string
    {
        return '$' . number_format($number, 2);
    }
}
```

## Configuration / Env Vars

### Configuration Files

```
your-project/
├── config/
│   ├── packages/
│   │   ├── cache.yaml
│   │   ├── doctrine.yaml
│   │   ├── framework.yaml
│   │   ├── routing.yaml
│   │   └── twig.yaml
│   ├── routes/
│   │   └── attributes.yaml
│   ├── bundles.php
│   ├── preload.php
│   ├── routes.yaml
│   └── services.yaml
```

### Configuration Formats

Symfony supports YAML (default), XML, and PHP configuration formats.

### Importing Configuration Files

```yaml
# config/services.yaml
imports:
    - { resource: 'packages/*' }
    - { resource: 'routes/*' }
```

### Configuration Parameters

```yaml
# config/services.yaml
parameters:
    app.admin_email: 'admin@example.com'
    app.items_per_page: 20

services:
    App\Service\MyService:
        arguments:
            $adminEmail: '%app.admin_email%'
```

### Configuration Environments

- **dev** — Development (debug enabled)
- **prod** — Production (optimized)
- **test** — Testing (PHPUnit)

```bash
# Selecting the active environment
APP_ENV=dev
APP_DEBUG=1
```

### Environment Variables

```bash
# .env
DATABASE_URL="mysql://user:password@127.0.0.1:3306/db_name"
MAILER_DSN="smtp://localhost"
```

```dotenv
# .env.local (overrides .env, gitignored)
DATABASE_URL="mysql://user:password@production:3306/db_name"
```

### Accessing Configuration Parameters

```php
// In controllers
$value = $this->getParameter('app.admin_email');

// In services
public function __construct(
    #[Autowire('%app.admin_email%')] private string $adminEmail,
) {}
```

### Encrypting Environment Variables (Secrets)

```bash
# Initialize secrets
php bin/console secrets:generate-keys

# Set a secret
php bin/console secrets:set DATABASE_PASSWORD

# List secrets
php bin/console secrets:list
```

### Creating a New Environment

```bash
# Create config/packages/staging/ directory
# Override specific settings for staging environment
# Run with APP_ENV=staging
```
