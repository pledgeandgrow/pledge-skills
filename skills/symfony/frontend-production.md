# Symfony — Frontend, Production & Ecosystem

> Frontend tools (AssetMapper, Webpack Encore, Symfony UX), production deployment, performance, HTTP cache, Symfony AI, best practices, contributing, and reference documents.

**Frontend**: [symfony.com/doc/current/frontend.html](https://symfony.com/doc/current/frontend.html)  
**AssetMapper**: [symfony.com/doc/current/frontend/asset_mapper.html](https://symfony.com/doc/current/frontend/asset_mapper.html)  
**WebLink**: [symfony.com/doc/current/web_link.html](https://symfony.com/doc/current/web_link.html)  
**Deployment**: [symfony.com/doc/current/deployment.html](https://symfony.com/doc/current/deployment.html)  
**Performance**: [symfony.com/doc/current/performance.html](https://symfony.com/doc/current/performance.html)  
**HTTP Cache**: [symfony.com/doc/current/http_cache.html](https://symfony.com/doc/current/http_cache.html)  
**Best Practices**: [symfony.com/doc/current/best_practices.html](https://symfony.com/doc/current/best_practices.html)  
**Symfony AI**: [symfony.com/doc/current/ai/index.html](https://symfony.com/doc/current/ai/index.html)  

## Front-end Tools

### Two Approaches

1. **PHP & Twig** — Build HTML server-side with AssetMapper (recommended) or Webpack Encore
2. **JavaScript Framework** — Use React, Vue, Svelte with API endpoints

### AssetMapper (Recommended)

AssetMapper lets you write modern JavaScript and CSS without a bundler. Browsers support ES modules natively.

#### Installation

```bash
composer require asset-mapper
```

#### Mapping and Referencing Assets

```twig
<link rel="stylesheet" href="{{ asset('styles/app.css') }}">
<script type="module" src="{{ asset('app.js') }}"></script>
```

#### Importmaps & Writing JavaScript

```js
// assets/app.js
import './styles/app.css';
import { hello } from './hello.js';
hello();
```

```bash
# Add a 3rd party JS package
php bin/console importmap:require chart.js
```

The importmap is generated automatically in `importmap.php`:

```php
return [
    'chart.js' => [
        'url' => 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js',
    ],
];
```

#### Handling CSS

CSS files are imported directly in JavaScript:

```js
import './styles/app.css';
```

#### Using Tailwind CSS

```bash
php bin/console tailwind:install
```

#### Using Sass

```bash
php bin/console sass:install
```

#### Deploying with AssetMapper

```bash
php bin/console asset-map:compile
```

This copies assets to `public/assets/` with content-hashed filenames.

#### Configuration Options

```yaml
# config/packages/asset_mapper.yaml
framework:
    asset_mapper:
        paths:
            - '%kernel.project_dir%/assets/'
        excluded_patterns:
            - '*/assets/styles/_*.css'
        importmap_polyfill: 'es-shim'
```

### Symfony UX / Stimulus

Symfony UX is a set of PHP packages for adding JavaScript functionality:
- **Stimulus** — Modest JavaScript framework
- **Live Components** — Reactive PHP-driven components
- **Chart.js** — Charts integration
- **Dropzone** — File upload with drag-and-drop
- **Cropper.js** — Image cropping
- **Lazy Image** — Lazy loading images
- **Swup** — Page transitions
- **Toggle Password** — Password visibility toggle
- **Typed** — Animated typing effect

```php
// Controller with UX
use Symfony\UX\Turbo\Attribute\Broadcast;

#[Broadcast]
class Notification
{
    public string $message;
}
```

### Webpack Encore

```bash
composer require webpack-encore
npm install
npm run dev
# or for production
npm run build
```

```js
// webpack.config.js
const Encore = require('@symfony/webpack-encore');

Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build')
    .addEntry('app', './assets/app.js')
    .enableStimulusBridge('./assets/controllers.json')
    .enableSassLoader()
    .enableTypeScriptLoader()
    .enableReactPreset()
    .enableVueLoader();

module.exports = Encore.getWebpackConfig();
```

### WebLink

Asset preloading and resource hints:

```php
use Symfony\Component\WebLink\Link;

$response->headers->set('Link', (string) (new Link('preload', '/styles.css')));
```

```twig
{{ preload(asset('styles/app.css'), { as: 'style' }) }}
{{ preload(asset('app.js'), { as: 'script' }) }}
```

#### Sending Early Hints

```php
$response = new Response();
$response->headers->set('Link', '<style.css>; rel=preload; as=style');
```

## Deployment

### Symfony Deployment Basics

1. **Upload code** — Via Git, rsync, or FTP
2. **Install vendors** — `composer install --no-dev --optimize-autoloader`
3. **Run migrations** — `php bin/console doctrine:migrations:migrate`
4. **Clear cache** — `php bin/console cache:clear --env=prod`

### Common Deployment Tasks

```bash
# A) Check requirements
php bin/console about

# B) Configure environment variables
# Set APP_ENV=prod in .env.local or server environment

# C) Install/update vendors
composer install --no-dev --optimize-autoloader

# D) Clear Symfony cache
APP_ENV=prod php bin/console cache:clear

# E) Other tasks
php bin/console assets:install public --no-dev
php bin/console asset-map:compile
```

### Using Platforms as a Service

- **Upsun** (formerly SymfonyCloud) — [docs.upsun.com](https://docs.upsun.com)
- **Platform.sh** — Symfony-optimized PaaS
- **Docker** — `symfony new my_project --docker`

## Performance

### Performance Checklists

- **Restrict enabled locales** — Only enable needed locales
- **Dump service container to single file** — Automatic in prod
- **Use OPcache** — Enable and configure OPcache
- **Use OPcache class preloading** — `php.ini` `opcache.preload`
- **Configure OPcache for max performance**:
  ```ini
  opcache.enable=1
  opcache.memory_consumption=256
  opcache.max_accelerated_files=20000
  opcache.validate_timestamps=0
  ```
- **Don't check PHP file timestamps** — `opcache.validate_timestamps=0` in prod
- **Configure PHP realpath cache**:
  ```ini
  realpath_cache_size=4096K
  realpath_cache_ttl=600
  ```
- **Optimize Composer autoloader** — `composer dump-autoload --optimize --no-dev`
- **Disable XML container dump in debug** — Automatic in prod

### Profiling Symfony Applications

#### Blackfire

```bash
blackfire run php bin/console my:command
```

#### Symfony Stopwatch

```php
use Symfony\Component\Stopwatch\Stopwatch;

$stopwatch = new Stopwatch();
$stopwatch->start('myEvent');
// ... code to profile ...
$event = $stopwatch->stop('myEvent');
$event->getDuration(); // in milliseconds
$event->getMemory();   // in bytes
```

## HTTP Cache

### Symfony Reverse Proxy

```yaml
# config/packages/framework.yaml
framework:
    http_cache: true
```

```bash
# Run the reverse proxy
php bin/console cache:pool:clear cache.http
```

### Making Responses Cacheable

#### Expiration Caching

```php
$response->setPublic();
$response->setMaxAge(600);
$response->setSharedMaxAge(600);
```

#### Validation Caching

```php
$response->setEtag(md5($content));
$response->setLastModified(new \DateTime('2024-01-01'));
$response->isNotModified($request);  # Returns 304 if not modified
```

### Cache Invalidation

```php
$response->headers->addCacheControlDirective('no-cache');
```

### Edge Side Includes (ESI)

```twig
{{ render_esi(controller('App\\Controller\\DefaultController::recentPosts'), {}, {'standalone': true}) }}
```

### HTTP Caching and User Sessions

Responses with session data are private by default. Use `Cache-Control: public` carefully.

## Symfony AI

Symfony AI is a set of components integrating AI capabilities into PHP applications with a unified interface for OpenAI, Anthropic, Google Gemini, Azure, and more.

### Getting Started

```bash
composer require symfony/ai
```

### Key Features

- Unified interface for multiple AI platforms
- Chat/completion support
- Embedding generation
- Vector storage integration
- Tool/function calling
- Structured output

## Best Practices

### Creating the Project

- Use the Symfony binary to create applications
- Use the default directory structure
- Don't create bundles for application code

### Configuration

- Use environment variables for infrastructure config
- Use secrets for sensitive information
- Use parameters for application configuration
- Use short and prefixed parameter names
- Use constants for rarely-changing options

### Business Logic

- Use autowiring to automate service configuration
- Services should be private whenever possible
- Use attributes for Doctrine entity mapping

### Controllers

- Extend `AbstractController`
- Use attributes for routing, caching, security
- Use dependency injection to get services
- Use entity value resolvers when convenient

### Templates

- Use snake_case for template names and variables
- Prefix template fragments with underscore (`_fragment.html.twig`)

### Forms

- Define forms as PHP classes
- Add form buttons in templates, not in form classes
- Define validation constraints on the underlying object
- Use a single action to render and process the form

### Internationalization

- Use XLIFF format for translation files
- Use keys for translations instead of content strings

### Security

- Define a single firewall
- Use the `auto` password hasher
- Use voters for fine-grained security restrictions

### Web Assets

- Use AssetMapper to manage web assets

### Tests

- Smoke test your URLs
- Hard-code URLs in functional tests

## Contributing to Symfony

### Reporting a Bug

1. Check if the bug already exists in [GitHub Issues](https://github.com/symfony/symfony/issues)
2. Write a clear bug report with reproduction steps
3. Include Symfony version, PHP version, and OS

### Set up your Environment

```bash
git clone https://github.com/symfony/symfony.git
cd symfony
composer install
```

### Proposing a Change

1. Choose the correct branch (usually `7.x` or `8.x`)
2. Make your change with tests
3. Submit a Pull Request
4. Respond to feedback

### Running Tests

```bash
phpunit
# Or specific component
phpunit src/Symfony/Component/Form/
```

### Contributing to Documentation

Documentation source is in the `symfony/symfony-docs` repository:

```bash
git clone https://github.com/symfony/symfony-docs.git
```

## Reference Documents

### Configuration Options

All configuration options for bundles and components:
- [FrameworkBundle Configuration](https://symfony.com/doc/current/reference/configuration/framework.html)
- [Doctrine Configuration](https://symfony.com/doc/current/reference/configuration/doctrine.html)
- [Security Configuration](https://symfony.com/doc/current/reference/configuration/security.html)
- [Twig Configuration](https://symfony.com/doc/current/reference/configuration/twig.html)

### Forms and Validation

- [Form Types Reference](https://symfony.com/doc/current/reference/forms/types.html)
- [Validation Constraints Reference](https://symfony.com/doc/current/reference/constraints.html)

### Format Specifications

- [YAML Format](https://symfony.com/doc/current/components/yaml/yaml_format.html)
- [XLIFF Format](https://symfony.com/doc/current/components/translation.html#xliff-translations)

## Create Your Own Framework

Symfony provides a tutorial on building a custom framework using Symfony components:
- [Create your own PHP Framework](https://symfony.com/doc/current/create_framework/index.html)

Topics covered:
- Bootstrapping
- Routing
- HTTP kernel
- Error handling
- The event dispatcher
- HTTP cache
- Templating
- Services container

## Symfony Components

Symfony components are standalone libraries usable in any PHP project:

| Component | Description |
|-----------|-------------|
| HttpFoundation | Request/Response objects |
| HttpKernel | HTTP kernel (core) |
| Routing | URL routing |
| DependencyInjection | Service container |
| EventDispatcher | Event system |
| Console | CLI commands |
| Form | Form handling |
| Validator | Data validation |
| Serializer | Serialization |
| Security | Authentication/authorization |
| Twig | Templating |
| Mailer | Email sending |
| Mime | MIME types |
| Messenger | Message queues |
| HttpClient | HTTP client |
| Cache | Caching |
| Cache Contracts | Cache interfaces |
| Contracts | Abstractions |
| String | String/Unicode utilities |
| UID | UUID/ULID generation |
| YAML | YAML parser |
| Lock | Locking mechanism |
| Workflow | State machines |
| Scheduler | Task scheduling |
| Notifier | Notifications |
| Webhook | Webhook handling |
| Filesystem | File operations |
| Finder | File finder |
| Process | Process execution |
| PropertyInfo | Property metadata |
| OptionsResolver | Options resolution |
| PropertyAccess | Property access |
| Inflector | String inflection |
| Intl | Internationalization |
| Ldap | LDAP client |
| Serializer | Data serialization |
| VarDumper | Debug dumping |
| VarExporter | Variable export |
| Polyfill | PHP polyfills |
