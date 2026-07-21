# Symfony — Architecture & Services

> Symfony's architecture is based on the HTTP kernel, service container, event dispatcher, and bundle system. This guide covers the framework internals, dependency injection, events, and bundles.

**Service Container**: [symfony.com/doc/current/service_container.html](https://symfony.com/doc/current/service_container.html)  
**Events**: [symfony.com/doc/current/event_dispatcher.html](https://symfony.com/doc/current/event_dispatcher.html)  
**Bundles**: [symfony.com/doc/current/bundles.html](https://symfony.com/doc/current/bundles.html)  
**HTTP Kernel**: [symfony.com/doc/current/components/http_kernel.html](https://symfony.com/doc/current/components/http_kernel.html)  

## Requests and Responses

Symfony is built around the HTTP specification. Every request is a `Request` object, every response is a `Response` object.

```php
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

// Request object
$request = Request::createFromGlobals();
$request->query->get('foo');       // GET parameters
$request->request->get('bar');     // POST parameters
$request->headers->get('User-Agent');
$request->cookies->get('session_id');
$request->files->get('upload');
$request->server->get('HTTP_HOST');

// Response object
$response = new Response('Content', 200, ['Content-Type' => 'text/html']);
$response->setStatusCode(404);
$response->headers->set('X-Custom', 'value');
$response->send();
```

### JSON Response

```php
use Symfony\Component\HttpFoundation\JsonResponse;

return new JsonResponse(['status' => 'ok', 'data' => $items]);
```

### Streamed Response

```php
use Symfony\Component\HttpFoundation\StreamedResponse;

$response = new StreamedResponse(function () {
    echo 'Hello ';
    echo 'World';
});
```

### Binary File Response

```php
use Symfony\Component\HttpFoundation\BinaryFileResponse;

return new BinaryFileResponse('/path/to/file.pdf');
```

## The Kernel

The kernel is the heart of the application. It handles the request lifecycle:

1. **Request** — `Request` object created
2. **Router** — Matches URL to a controller
3. **Controller** — Executes and returns a Response
4. **Response** — Sent to the client

```php
// public/index.php
use App\Kernel;
use Symfony\Component\Dotenv\Dotenv;

require_once dirname(__DIR__).'/vendor/autoload.php';

(new Dotenv())->bootEnv(dirname(__DIR__).'/.env');

$kernel = new Kernel($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']);
$request = Request::createFromGlobals();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
```

### Kernel Configuration

```php
// src/Kernel.php
namespace App;

use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;

class Kernel extends BaseKernel
{
    use MicroKernelTrait;

    protected function configureContainer(ContainerConfigurator $container): void
    {
        $container->import('../config/{packages}/*.yaml');
        $container->import('../config/{packages}/'.$this->environment.'/*.yaml');
        $container->import('../config/{services}.yaml');
        $container->import('../config/{services}_'.$this->environment.'.yaml');
    }

    protected function configureRoutes(RoutingConfigurator $routes): void
    {
        $routes->import('../config/{routes}/'.$this->environment.'/*.yaml');
        $routes->import('../config/{routes}/*.yaml');
        $routes->import('../config/{routes}.yaml');
    }
}
```

## Service Container / Dependency Injection

### Fetching and Using Services

```php
// In a controller
public function sendEmail(MailerInterface $mailer): Response
{
    $mailer->send(new Email());
    // $mailer is injected from the container
}
```

### Creating/Configuring Services

```yaml
# config/services.yaml
services:
    App\Service\TwitterClient:
        arguments:
            $apiKey: '%env(TWITTER_API_KEY)%'
```

### Autowiring

Symfony automatically resolves service dependencies by type:

```yaml
# config/services.yaml
services:
    _defaults:
        autowire: true
        autoconfigure: true

    App\:
        resource: '../src/'
```

```php
namespace App\Service;

use App\Repository\ProductRepository;

class ProductService
{
    public function __construct(
        private ProductRepository $repo, // autowired
    ) {}
}
```

### Injecting Services/Config into a Service

```php
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class MyService
{
    public function __construct(
        #[Autowire('%kernel.project_dir%')] private string $projectDir,
        #[Autowire(service: 'logger')] private LoggerInterface $logger,
    ) {}
}
```

### Binding Arguments by Name or Type

```yaml
# config/services.yaml
services:
    _defaults:
        bind:
            $logger: '@monolog.logger.app'
            string $adminEmail: '%app.admin_email%'
```

### Container Parameters

```yaml
parameters:
    app.max_items: 10
    app.supported_locales: ['en', 'fr', 'de']
```

```php
// Access in services
$this->getParameter('app.max_items');
```

### Public vs Private Services

```yaml
services:
    App\Service\MyService:
        public: true  # Allows $container->get() access
```

By default, all services are private (recommended).

### Service Tags

```yaml
services:
    App\EventSubscriber\MySubscriber:
        tags: ['kernel.event_subscriber']
```

```php
// Auto-tagging with autoconfigure
namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class MySubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return ['kernel.request' => 'onKernelRequest'];
    }
}
```

### Importing Many Services at Once

```yaml
services:
    App\:
        resource: '../src/'
        exclude:
            - '../src/DependencyInjection/'
            - '../src/Entity/'
            - '../src/Kernel.php'
```

### Manually Wiring Arguments

```yaml
services:
    App\Service\MyService:
        arguments:
            - '@App\Repository\UserRepository'
            - '@logger'
            - '%app.api_key%'
```

### Abstract Service Arguments

```yaml
services:
    App\Payment\PaymentProcessor:
        abstract: true
        arguments:
            - '@http_client'
            - '@logger'

    App\Payment\StripeProcessor:
        parent: App\Payment\PaymentProcessor
        arguments: ['%stripe_secret_key%']
```

### Linting Service Definitions

```bash
php bin/console lint:container
```

### Generating Adapters for Functional Interfaces

```php
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;

#[AsTaggedItem(index: 'redis')]
class RedisCache implements CacheInterface { /* ... */ }
```

### Service Decoration

```yaml
services:
    App\Service\MyService:
        decorates: App\Service\OriginalService
        decoration_inner_name: App\Service\OriginalService.inner
```

### Lazy Services

```yaml
services:
    App\Service\HeavyService:
        lazy: true
```

### Service Subscribers

```php
use Symfony\Contracts\Service\ServiceSubscriberInterface;

class MyController implements ServiceSubscriberInterface
{
    public static function getSubscribedServices(): array
    {
        return [
            'logger' => LoggerInterface::class,
            'mailer' => MailerInterface::class,
        ];
    }
}
```

## Events and Event Listeners

### Creating an Event Listener

```php
namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\RequestEvent;

class LocaleListener
{
    public function __construct(private string $defaultLocale = 'en') {}

    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();
        if (!$request->hasPreviousSession()) {
            return;
        }
        $locale = $request->getSession()->get('_locale', $this->defaultLocale);
        $request->setLocale($locale);
    }
}
```

```yaml
# config/services.yaml
services:
    App\EventListener\LocaleListener:
        tags:
            - { name: kernel.event_listener, event: kernel.request }
```

### Defining Event Listeners with PHP Attributes

```php
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

class LocaleListener
{
    #[AsEventListener(event: 'kernel.request')]
    public function onKernelRequest(RequestEvent $event): void { /* ... */ }
}
```

### Creating an Event Subscriber

```php
namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class LocaleSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => ['onKernelRequest', 20],
        ];
    }

    public function onKernelRequest(RequestEvent $event): void { /* ... */ }
}
```

### Listeners vs Subscribers

- **Listeners** are registered via tags, one method per event
- **Subscribers** implement `EventSubscriberInterface`, know their own events
- Subscribers are auto-registered with `autoconfigure: true`

### Core Kernel Events

| Event | When | Use Case |
|-------|------|----------|
| `kernel.request` | Before controller | Modify request, set locale |
| `kernel.controller` | Controller found | Before/after filters |
| `kernel.response` | After controller | Modify response headers |
| `kernel.view` | Controller returns non-Response | Convert data to Response |
| `kernel.exception` | Exception thrown | Convert exception to Response |
| `kernel.terminate` | Response sent | Post-response processing |

### Custom Events

```php
namespace App\Event;

use Symfony\Contracts\EventDispatcher\Event;

class OrderPlacedEvent extends Event
{
    public const NAME = 'order.placed';

    public function __construct(public Order $order) {}
}
```

```php
// Dispatching
$eventDispatcher->dispatch(new OrderPlacedEvent($order), OrderPlacedEvent::NAME);

// Listening
class OrderSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [OrderPlacedEvent::NAME => 'onOrderPlaced'];
    }
}
```

### Debugging Event Listeners

```bash
php bin/console debug:event-dispatcher
php bin/console debug:event-dispatcher kernel.request
```

## Contracts

Symfony Contracts are a set of abstractions (interfaces) that decouple components from implementations:

- `Cache/CacheInterface` — PSR-6 compatible cache
- `EventDispatcher/EventDispatcherInterface`
- `HttpClient/HttpClientInterface`
- `Mailer/MailerInterface`
- `Translation/TranslatorInterface`
- `Service/ServiceSubscriberInterface`

## Bundles

### Creating a Bundle

```php
namespace Acme\TestBundle;

use Symfony\Component\HttpKernel\Bundle\AbstractBundle;

class AcmeTestBundle extends AbstractBundle
{
    public function getPath(): string
    {
        return dirname(__DIR__);
    }
}
```

### Bundle Directory Structure

```
AcmeTestBundle/
├── AcmeTestBundle.php
├── Controller/
├── DependencyInjection/
├── Entity/
├── Resources/
│   ├── config/
│   └── views/
└── Tests/
```

### Registering Bundles

```php
// config/bundles.php
return [
    Symfony\Bundle\FrameworkBundle\FrameworkBundle::class => ['all' => true],
    Symfony\Bundle\TwigBundle\TwigBundle::class => ['all' => true],
    Doctrine\Bundle\DoctrineBundle\DoctrineBundle::class => ['all' => true],
    Symfony\Bundle\MakerBundle\MakerBundle::class => ['dev' => true],
];
```

### Developing a Reusable Bundle

- Use Composer for dependency management
- Register on Packagist
- Use semantic versioning
- Keep configuration minimal
- Use dependency injection for flexibility
