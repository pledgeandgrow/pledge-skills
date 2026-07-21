# Symfony — Testing & Errors

> Testing types (unit, integration, application/E2E), assertions, error pages, and debugging.

**Testing**: [symfony.com/doc/current/testing.html](https://symfony.com/doc/current/testing.html)  
**Error Pages**: [symfony.com/doc/current/controller/error_pages.html](https://symfony.com/doc/current/controller/error_pages.html)  

## Testing

### Types of Tests

- **Unit Tests** — Test individual classes/methods in isolation
- **Integration Tests** — Test components with their dependencies
- **Application Tests** — Test the full application via HTTP requests
- **End-to-End (E2E) Tests** — Test through a real browser

### Installation

```bash
composer require --dev phpunit/phpunit symfony/test-pack
```

```xml
<!-- phpunit.xml.dist -->
<phpunit>
    <php>
        <server name="APP_ENV" value="test"/>
        <server name="SHELL_VERBOSITY" value="-1"/>
    </php>
    <testsuites>
        <testsuite name="Project Test Suite">
            <directory>tests</directory>
        </testsuite>
    </testsuites>
</phpunit>
```

### Unit Tests

```php
use PHPUnit\Framework\TestCase;

class CalculatorTest extends TestCase
{
    public function testAdd(): void
    {
        $calculator = new Calculator();
        $result = $calculator->add(2, 3);
        $this->assertEquals(5, $result);
    }
}
```

### Integration Tests

```php
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ProductRepositoryTest extends KernelTestCase
{
    public function testFindAll(): void
    {
        self::bootKernel();
        $repository = static::getContainer()->get(ProductRepository::class);
        $products = $repository->findAll();
        $this->assertCount(5, $products);
    }
}
```

### Set up your Test Environment

```php
// tests/bootstrap.php
require_once dirname(__DIR__).'/vendor/autoload.php';

(new Symfony\Component\Dotenv\Dotenv())->bootEnv(dirname(__DIR__).'/.env');
```

### Customizing Environment Variables

```dotenv
# .env.test
APP_ENV=test
DATABASE_URL="mysql://user:pass@127.0.0.1:3306/db_test"
```

### Retrieving Services in the Test

```php
$container = static::getContainer();
$service = $container->get(MyService::class);
```

### Mocking Dependencies

```php
use PHPUnit\Framework\TestCase;

class MyServiceTest extends TestCase
{
    public function testSomething(): void
    {
        $mockRepository = $this->createMock(ProductRepository::class);
        $mockRepository->method('find')->willReturn(new Product());

        $service = new MyService($mockRepository);
        $result = $service->doSomething(1);
        $this->assertNotNull($result);
    }
}
```

### Configuring a Database for Tests

```php
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class DatabaseTestCase extends KernelTestCase
{
    protected function setUp(): void
    {
        self::bootKernel();
        $em = static::getContainer()->get(EntityManagerInterface::class);
        // Run schema tool or migrations
        $schemaTool = new \Doctrine\ORM\Tools\SchemaTool($em);
        $schemaTool->createSchema($em->getMetadataFactory()->getAllMetadata());
    }
}
```

### Application Tests

```php
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class DefaultControllerTest extends WebTestCase
{
    public function testHomepage(): void
    {
        $client = static::createClient();
        $client->request('GET', '/');

        $this->assertResponseIsSuccessful();
        $this->assertSelectorTextContains('h1', 'Welcome');
    }
}
```

### Making Requests

```php
$client->request('GET', '/blog/my-post');
$client->request('POST', '/api/products', [], [], [
    'CONTENT_TYPE' => 'application/json',
], json_encode(['name' => 'Product 1']));

// With query parameters
$client->request('GET', '/search', ['q' => 'keyword']);
```

### Interacting with the Response

```php
// Click links
$client->clickLink('Click me');

// Submit forms
$client->submitForm('Submit', [
    'product[name]' => 'New Product',
    'product[price]' => '99.99',
]);

// Follow redirects
$client->followRedirect();

// Get the crawler
$crawler = $client->getCrawler();
```

### Response Assertions

```php
$this->assertResponseIsSuccessful();
$this->assertResponseStatusCodeSame(404);
$this->assertResponseRedirects('/expected/url');
$this->assertResponseFormatSame('json');
$this->assertResponseHeaderSame('Content-Type', 'application/json');
```

### Browser Assertions

```php
$this->assertSelectorTextContains('h1', 'Welcome');
$this->assertSelectorTextNotContains('h1', 'Error');
$this->assertSelectorExists('.alert');
$this->assertSelectorNotExists('.error');
$this->assertInputValueSame('product[name]', 'Default');
```

### Crawler Assertions

```php
$this->assertCount(5, $crawler->filter('.product'));
$this->assertEquals(5, $crawler->filter('.product')->count());
```

### Mailer Assertions

```php
use Symfony\Component\Mailer\Test\MailerAssertionsTrait;

$this->assertEmailCount(1);
$this->assertEmailSubjectContains($this->getMailerMessage(0), 'Welcome');
$this->assertEmailTextBodyContains($this->getMailerMessage(0), 'Welcome to our app');
```

### Notifier Assertions

```php
use Symfony\Component\Notifier\Test\NotifierAssertionsTrait;

$this->assertNotificationCount(1);
$this->assertNotificationSubjectContains($this->getNotifierMessage(0), 'Alert');
```

### HttpClient Assertions

```php
$this->assertJson($response->getContent());
$this->assertEquals(['status' => 'ok'], $response->toArray());
```

### Console Assertions

```php
use Symfony\Bundle\FrameworkBundle\Console\Application;

$kernel = self::bootKernel();
$application = new Application($kernel);
$commandTester = new CommandTester($application->find('app:my-command'));
$commandTester->execute([]);
$commandTester->assertCommandIsSuccessful();
$this->assertStringContainsString('Done', $commandTester->getDisplay());
```

### End to End Tests (E2E)

```bash
composer require --dev panther
```

```php
use Symfony\Component\Panther\PantherTestCase;

class E2ETest extends PantherTestCase
{
    public function testHomepage(): void
    {
        $client = static::createPantherClient();
        $crawler = $client->request('GET', '/');

        $this->assertStringContainsString('Welcome', $client->getTitle());
    }
}
```

## Error Pages

### Overriding the Default Error Templates

```
templates/
├── bundles/
│   └── TwigBundle/
│       └── Exception/
│           ├── error.html.twig         # All errors
│           ├── error404.html.twig      # 404 errors
│           ├── error500.html.twig      # 500 errors
│           └── exception_full.html.twig # Dev mode
```

### Example 404 Error Template

```twig
{# templates/bundles/TwigBundle/Exception/error404.html.twig #}
{% extends 'base.html.twig' %}

{% block body %}
    <h1>Page Not Found</h1>
    <p>The requested page couldn't be located. Checkout for any URL misspelling.</p>
    <a href="{{ path('home') }}">Return to homepage</a>
{% endblock %}
```

### Security & 404 Pages

404 pages should not leak information. Keep them generic in production.

### Testing Error Pages during Development

```bash
# In dev, access error pages directly
# /_error/404
# /_error/500
```

### Overriding Error Output for Non-HTML Formats

```twig
{# templates/bundles/TwigBundle/Exception/error.json.twig #}
{
    "error": {
        "code": {{ status_code }},
        "message": "{{ status_text }}"
    }
}
```

### Overriding the Default ErrorController

```php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ErrorController extends AbstractController
{
    public function show(\Throwable $exception): Response
    {
        $statusCode = $exception instanceof HttpException ? $exception->getStatusCode() : 500;
        return $this->render('error/custom.html.twig', [
            'status_code' => $statusCode,
            'exception' => $exception,
        ], new Response('', $statusCode));
    }
}
```

### Working with the kernel.exception Event

```php
namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpFoundation\JsonResponse;

class ApiExceptionListener
{
    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        $request = $event->getRequest();

        if (!str_starts_with($request->getPathInfo(), '/api')) {
            return;
        }

        $response = new JsonResponse([
            'error' => $exception->getMessage(),
            'code' => $exception->getCode(),
        ]);

        $event->setResponse($response);
    }
}
```

### Dumping Error Pages as Static HTML Files

```bash
php bin/console error:dump
```

This generates error pages in `var/errors/` for use with external web servers.
