# Symfony — Advanced Topics

> Console commands, Mailer, Messenger (queues), Scheduler, Notifier, Serializer, Translation, HTTP Client, Sessions, Cache, Logging, Workflows, Webhooks, and other utilities.

**Console**: [symfony.com/doc/current/console.html](https://symfony.com/doc/current/console.html)  
**Mailer**: [symfony.com/doc/current/mailer.html](https://symfony.com/doc/current/mailer.html)  
**Messenger**: [symfony.com/doc/current/messenger.html](https://symfony.com/doc/current/messenger.html)  
**Scheduler**: [symfony.com/doc/current/scheduler.html](https://symfony.com/doc/current/scheduler.html)  
**Notifier**: [symfony.com/doc/current/notifier.html](https://symfony.com/doc/current/notifier.html)  
**Serializer**: [symfony.com/doc/current/serializer.html](https://symfony.com/doc/current/serializer.html)  
**Translation**: [symfony.com/doc/current/translation.html](https://symfony.com/doc/current/translation.html)  
**HTTP Client**: [symfony.com/doc/current/http_client.html](https://symfony.com/doc/current/http_client.html)  
**Sessions**: [symfony.com/doc/current/session.html](https://symfony.com/doc/current/session.html)  
**Cache**: [symfony.com/doc/current/cache.html](https://symfony.com/doc/current/cache.html)  
**Logging**: [symfony.com/doc/current/logging.html](https://symfony.com/doc/current/logging.html)  
**Workflow**: [symfony.com/doc/current/workflow.html](https://symfony.com/doc/current/workflow.html)  
**Webhook**: [symfony.com/doc/current/webhook.html](https://symfony.com/doc/current/webhook.html)  

## Console Commands

### Running Commands

```bash
php bin/console list              # List all commands
php bin/console cache:clear       # Clear cache
php bin/console make:controller   # Make controller
```

### Creating a Command

```php
namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'app:send-emails',
    description: 'Sends pending emails',
)]
class SendEmailsCommand extends Command
{
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $output->writeln('Sending emails...');
        return Command::SUCCESS;
    }
}
```

### Method-based Commands

```php
namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class AppCommand
{
    #[AsCommand(name: 'app:do-something', description: 'Does something')]
    public function doSomething(InputInterface $input, OutputInterface $output): int
    {
        $output->writeln('Done!');
        return Command::SUCCESS;
    }
}
```

### Command with Arguments and Options

```php
#[AsCommand(name: 'app:create-user')]
class CreateUserCommand extends Command
{
    protected function configure(): void
    {
        $this
            ->addArgument('email', InputArgument::REQUIRED, 'User email')
            ->addOption('admin', null, InputOption::VALUE_NONE, 'Set as admin');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $email = $input->getArgument('email');
        $isAdmin = $input->getOption('admin');
        // ...
        return Command::SUCCESS;
    }
}
```

### Console Output

```php
$output->writeln('Plain text');
$output->writeln('<info>Green text</info>');
$output->writeln('<error>Red text</error>');
$output->writeln('<comment>Yellow text</comment>');

// Tables
$table = new Table($output);
$table->setHeaders(['ID', 'Name', 'Email'])
    ->setRows($users)
    ->render();

// Progress bar
$progressBar = new ProgressBar($output, 100);
$progressBar->start();
for ($i = 0; $i < 100; $i++) {
    $progressBar->advance();
}
$progressBar->finish();
```

### Testing Commands

```php
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class MyCommandTest extends KernelTestCase
{
    public function testExecute(): void
    {
        $kernel = self::bootKernel();
        $application = new Application($kernel);

        $command = $application->find('app:my-command');
        $commandTester = new CommandTester($command);
        $commandTester->execute([]);
        $commandTester->assertCommandIsSuccessful();
        $this->assertStringContainsString('Done', $commandTester->getDisplay());
    }
}
```

## Mailer

### Installation

```bash
composer require mailer
```

### Transport Setup

```dotenv
# .env
MAILER_DSN=smtp://user:pass@smtp.example.com:587
# Or null transport (dev)
MAILER_DSN=null://null
```

### Creating & Sending Messages

```php
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class MailerController
{
    public function sendEmail(MailerInterface $mailer): Response
    {
        $email = (new Email())
            ->from('hello@example.com')
            ->to('you@example.com')
            ->subject('Time for Symfony Mailer!')
            ->text('Sending emails is fun again.')
            ->html('<p>See Twig integration for better HTML support.</p>');

        $mailer->send($email);
        return new Response('Email sent!');
    }
}
```

### Twig: HTML & CSS

```php
$email = (new TemplatedEmail())
    ->from('hello@example.com')
    ->to('you@example.com')
    ->htmlTemplate('emails/welcome.html.twig')
    ->context(['name' => $user->getName()]);
```

```twig
{# templates/emails/welcome.html.twig #}
<h1>Welcome {{ name }}!</h1>
<p>Thanks for signing up.</p>
```

### File Attachments

```php
$email->attachFromPath('/path/to/file.pdf');
$email->attach(fopen('/path/to/file.pdf', 'r'), 'document.pdf');
```

### Embedding Images

```php
$email->embedFromPath('/path/to/logo.png', 'logo');
```

```twig
<img src="{{ email.embed('@images/logo.png') }}" alt="Logo">
```

### Inlining CSS Styles

```bash
composer require twig/cssinliner-extra
```

### Multiple Email Transports

```yaml
# config/packages/mailer.yaml
framework:
    mailer:
        transports:
            main: '%env(MAILER_DSN)%'
            alternative: '%env(MAILER_DSN_ALT)%'
```

### Sending Messages Async

```bash
composer require messenger
```

```php
$mailer->send($email);  # Sent via Messenger if configured
```

### Development & Debugging

```yaml
# config/packages/dev/mailer.yaml
framework:
    mailer:
        envelope:
            recipients: ['dev@example.com']  # Always send to this address
```

## Messenger: Sync & Queued Message Handling

### Installation

```bash
composer require messenger
```

### Creating a Message & Handler

```php
namespace App\Message;

class SendEmailMessage
{
    public function __construct(public readonly int $userId) {}
}
```

```php
namespace App\MessageHandler;

use App\Message\SendEmailMessage;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class SendEmailHandler
{
    public function __invoke(SendEmailMessage $message): void
    {
        // Send email to user $message->userId
    }
}
```

### Dispatching the Message

```php
use Symfony\Component\Messenger\MessageBusInterface;

class MyController
{
    public function __construct(private MessageBusInterface $bus) {}

    public function index(): Response
    {
        $this->bus->dispatch(new SendEmailMessage(42));
        return new Response('Message dispatched!');
    }
}
```

### Transports: Async/Queued Messages

```yaml
# config/packages/messenger.yaml
framework:
    messenger:
        transports:
            async: '%env(MESSENGER_TRANSPORT_DSN)%'
            failed: 'doctrine://default?queue_name=failed'

        routing:
            App\Message\SendEmailMessage: async
```

### Consuming Messages (Running the Worker)

```bash
php bin/console messenger:consume async
php bin/console messenger:consume async --time-limit=3600
php bin/console messenger:consume async --memory-limit=128M
```

### Supervisor Configuration

```ini
[program:messenger-worker]
command=php /path/to/app/bin/console messenger:consume async --env=prod
numprocs=4
autostart=true
autorestart=true
process_name=%(program_name)s_%(process_num)02d
```

### Retries & Failures

```yaml
framework:
    messenger:
        transports:
            async:
                dsn: '%env(MESSENGER_TRANSPORT_DSN)%'
                retry_strategy:
                    max_retries: 3
                    multiplier: 2
                    max_delay: 0
                    delay: 1000
```

### Transport Configuration

| Transport | DSN |
|-----------|-----|
| AMQP | `amqp://guest:guest@localhost:5672/%2f/messages` |
| Doctrine | `doctrine://default` |
| Redis | `redis://localhost:6379/messages` |
| In Memory | `in-memory://` |
| Amazon SQS | `sqs://` |
| Beanstalkd | `beanstalkd://localhost:11300` |

### Envelopes & Stamps

```php
use Symfony\Component\Messenger\Envelope;
use Symfony\Component\Messenger\Stamp\DelayStamp;

$envelope = new Envelope(new SendEmailMessage(42), [
    new DelayStamp(5000),  # 5 second delay
]);
$bus->dispatch($envelope);
```

### Multiple Buses

```yaml
framework:
    messenger:
        buses:
            command.bus:
                middleware:
                    - validation
                    - doctrine_transaction
            event.bus:
                default_middleware: allow_no_handlers
```

## Scheduler

### Installation

```bash
composer require scheduler
```

### Scheduling Recurring Messages

```php
namespace App\Scheduler;

use App\Message\SendReportMessage;
use Symfony\Component\Scheduler\Attribute\AsSchedule;
use Symfony\Component\Scheduler\RecurringMessage;
use Symfony\Component\Scheduler\Schedule;

#[AsSchedule('default')]
class MainSchedule
{
    public function __invoke(Schedule $schedule): void
    {
        $schedule->add(
            RecurringMessage::every('1 hour', new SendReportMessage()),
            RecurringMessage::cron('0 0 * * *', new CleanupMessage()),
        );
    }
}
```

### Cron Expression Triggers

```php
RecurringMessage::cron('*/15 * * * *', new MyMessage());
```

### Periodical Triggers

```php
use Symfony\Component\Scheduler\Trigger\PeriodicalTrigger;

RecurringMessage::trigger(
    new PeriodicalTrigger('1 hour', new \DateTimeImmutable('2024-01-01 00:00:00')),
    new MyMessage()
);
```

### Consuming Messages

```bash
php bin/console scheduler:consume
```

## Notifier

### Installation

```bash
composer require notifier
```

### Channels

- **SMS** — Twilio, Vonage, etc.
- **Chat** — Slack, Telegram, etc.
- **Email** — Via Mailer
- **Push** — Expo, Firebase
- **Desktop** — Web Push

### Creating & Sending Notifications

```php
use Symfony\Component\Notifier\Notification\Notification;
use Symfony\Component\Notifier\NotifierInterface;

public function notify(NotifierInterface $notifier): Response
{
    $notification = (new Notification('New Invoice', ['email']))
        ->content('A new invoice has been generated.');

    $notifier->send($notification, new Recipient('user@example.com'));
    return new Response('Notification sent!');
}
```

### SMS Channel

```dotenv
# .env
TWILIO_DSN=twilio://SID:TOKEN@default?from=NUMBER
```

### Chat Channel (Slack)

```dotenv
# .env
SLACK_DSN=slack://TOKEN@default?channel=CHANNEL
```

## Serializer

### Installation

```bash
composer require serializer
```

### Serializing an Object

```php
use Symfony\Component\Serializer\SerializerInterface;

class ApiController
{
    public function __construct(private SerializerInterface $serializer) {}

    public function api(Product $product): Response
    {
        $json = $this->serializer->serialize($product, 'json', [
            'groups' => ['product:read'],
        ]);
        return new JsonResponse($json, 200, [], true);
    }
}
```

### Deserializing an Object

```php
$product = $this->serializer->deserialize($jsonContent, Product::class, 'json');
```

### Serialization Groups

```php
use Symfony\Component\Serializer\Annotation\Groups;

class Product
{
    #[Groups(['product:read', 'product:write'])]
    private ?string $name = null;

    #[Groups(['product:read'])]
    private ?float $price = null;

    #[Groups(['product:write'])]
    private ?string $internalCode = null;
}
```

### Ignoring Properties

```php
use Symfony\Component\Serializer\Annotation\Ignore;

class Product
{
    #[Ignore]
    private ?string $secretField = null;
}
```

### Converting Property Names (CamelCase to snake_case)

```php
use Symfony\Component\Serializer\NameConverter\CamelCaseToSnakeCaseNameConverter;

$serializer = new Serializer($normalizers, [new JsonEncoder(
    new CamelCaseToSnakeCaseNameConverter()
)]);
```

### Handling Circular References

```php
use Symfony\Component\Serializer\Annotation\MaxDepth;

class Category
{
    #[MaxDepth(1)]
    private Collection $products;
}
```

### Built-in Normalizers

- `ObjectNormalizer` — Default object normalization
- `GetSetMethodNormalizer` — Uses getters/setters
- `PropertyNormalizer` — Uses public properties
- `DateTimeNormalizer` — DateTime objects
- `ConstraintViolationListNormalizer` — Validation errors
- `DataUriNormalizer` — Data URIs
- `JsonSerializableNormalizer` — JsonSerializable objects

## Translation / i18n

### Installation

```bash
composer require translation
```

### Configuration

```yaml
# config/packages/translation.yaml
framework:
    default_locale: 'en'
    translator:
        default_path: '%kernel.project_dir%/translations'
        fallbacks: ['en']
```

### Basic Translation

```php
use Symfony\Contracts\Translation\TranslatorInterface;

public function index(TranslatorInterface $translator): Response
{
    $message = $translator->trans('Welcome to our application');
    return new Response($message);
}
```

### Translations in Templates

```twig
{# Using Twig filter #}
{{ 'Welcome to our application'|trans }}

{# With parameters #}
{{ 'Hello %name%'|trans({'%name%': user.name}) }}

{# Using Twig tag #}
{% trans with {'%name%': user.name} %}Hello %name%{% endtrans %}

{# With domain #}
{{ 'Welcome'|trans({}, 'messages') }}
```

### Translation Resource/File Names and Locations

```
translations/
├── messages.en.yaml
├── messages.fr.yaml
├── messages.en.xlf
├── messages.fr.xlf
├── security.en.yaml
└── validators.en.yaml
```

```yaml
# translations/messages.en.yaml
Welcome to our application: Welcome to our application
Hello %name%: Hello %name%
```

### Translatable Objects

```php
use Symfony\Component\Translation\TranslatableMessage;

$message = new TranslatableMessage('Hello %name%', ['%name%' => $user->getName()]);
```

### Translation Providers

```bash
composer require translation-provider
```

Providers: Crowdin, Lokalise, Phrase

### Handling the User's Locale

```php
class LocaleSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [KernelEvents::REQUEST => ['setLocale', 20]];
    }

    public function setLocale(RequestEvent $event): void
    {
        $request = $event->getRequest();
        $locale = $request->getSession()->get('_locale', 'en');
        $request->setLocale($locale);
    }
}
```

### Extracting Translation Contents

```bash
php bin/console translation:extract en
php bin/console translation:extract fr --output-format=xlf
```

## HTTP Client

### Installation

```bash
composer require http-client
```

### Basic Usage

```php
use Symfony\Contracts\HttpClient\HttpClientInterface;

class MyService
{
    public function __construct(private HttpClientInterface $httpClient) {}

    public function fetchApiData(): array
    {
        $response = $this->httpClient->request('GET', 'https://api.example.com/data');
        return $response->toArray();
    }
}
```

### Configuration

```yaml
# config/packages/http_client.yaml
framework:
    http_client:
        max_redirects: 7
        http_version: '2.0'
```

### Authentication

```php
$response = $this->httpClient->request('GET', 'https://api.example.com', [
    'auth_basic' => ['username', 'password'],
    // or
    'auth_bearer' => 'token',
    // or
    'headers' => ['Authorization: Bearer token'],
]);
```

### Query String Parameters

```php
$response = $this->httpClient->request('GET', 'https://api.example.com', [
    'query' => ['page' => 1, 'limit' => 10],
]);
```

### Uploading Data

```php
$response = $this->httpClient->request('POST', 'https://api.example.com/upload', [
    'body' => ['file' => fopen('/path/to/file', 'r')],
]);
```

### Streaming Responses

```php
$response = $this->httpClient->request('GET', 'https://example.com/large-file');
foreach ($this->httpClient->stream($response) as $chunk) {
    echo $chunk->getContent();
}
```

### Concurrent Requests

```php
$responses = [];
$responses[] = $this->httpClient->request('GET', 'https://api.example.com/1');
$responses[] = $this->httpClient->request('GET', 'https://api.example.com/2');

foreach ($this->httpClient->stream($responses) as $response => $chunk) {
    // Process as they arrive
}
```

### Scoping Client

```yaml
services:
    App\Service\GithubClient:
        arguments:
            - '@http_client'
        tags:
            - { name: 'http_client.client', scope: 'github' }
```

### Testing

```php
use Symfony\Component\HttpClient\MockHttpClient;
use Symfony\Component\HttpClient\Response\MockResponse;

$mockClient = new MockHttpClient([
    new MockResponse('{"status": "ok"}', ['http_code' => 200]),
]);
```

## Sessions

### Basic Usage

```php
use Symfony\Component\HttpFoundation\Request;

public function index(Request $request): Response
{
    $session = $request->getSession();
    $session->set('user_id', 42);
    $userId = $session->get('user_id');
    $session->remove('user_id');
}
```

### Flash Messages

```php
$this->addFlash('success', 'Item created!');
$this->addFlash('error', 'Something went wrong.');
```

```twig
{% for label, messages in app.flashes %}
    {% for message in messages %}
        <div class="flash-{{ label }}">{{ message }}</div>
    {% endfor %}
{% endfor %}
```

### Session Storage

```yaml
# config/packages/framework.yaml
framework:
    session:
        handler_id: session.handler.native
        cookie_secure: auto
        cookie_samesite: 'lax'
```

### Store Sessions in Redis

```yaml
framework:
    session:
        handler_id: RedisSessionHandler
```

### Store Sessions in Database

```bash
php bin/console make:entity Session
```

## Cache

### Configuring Cache

```yaml
# config/packages/cache.yaml
framework:
    cache:
        app: cache.adapter.filesystem
        system: cache.adapter.system
        pools:
            cache.my_pool:
                adapter: cache.adapter.redis
                provider: redis://localhost
```

### Using Cache

```php
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class MyService
{
    public function __construct(private CacheInterface $cache) {}

    public function getExpensiveData(): array
    {
        return $this->cache->get('expensive_data', function (ItemInterface $item): array {
            $item->expiresAfter(3600);
            return $this->computeExpensiveData();
        });
    }
}
```

### Cache Tags

```php
use Symfony\Contracts\Cache\TagAwareCacheInterface;

class MyService
{
    public function __construct(private TagAwareCacheInterface $cache) {}

    public function getData(): mixed
    {
        return $this->cache->get('my_key', function (ItemInterface $item) {
            $item->tag(['category_1', 'category_2']);
            return $this->computeData();
        });
    }

    public function invalidateCategory(): void
    {
        $this->cache->invalidateTags(['category_1']);
    }
}
```

### Clearing the Cache

```bash
php bin/console cache:clear
php bin/console cache:pool:clear cache.my_pool
```

## Logging

### Logging a Message

```php
use Psr\Log\LoggerInterface;

class MyService
{
    public function __construct(private LoggerInterface $logger) {}

    public function doSomething(): void
    {
        $this->logger->info('Doing something');
        $this->logger->error('An error occurred', ['context' => 'value']);
        $this->logger->debug('Debug info');
        $this->logger->warning('Warning message');
    }
}
```

### Monolog

```bash
composer require monolog
```

```yaml
# config/packages/monolog.yaml
monolog:
    handlers:
        main:
            type: stream
            path: '%kernel.logs_dir%/%kernel.environment%.log'
            level: debug
        console:
            type: console
            process_psr_3_messages: false
```

### Where Logs are Stored

- **Dev**: `var/log/dev.log`
- **Prod**: `var/log/prod.log`

## Workflow

### Installation

```bash
composer require workflow
```

### Configuration

```yaml
# config/packages/workflow.yaml
framework:
    workflows:
        blog_publishing:
            type: 'workflow'
            marking_store:
                type: 'method'
                property: 'status'
            supports:
                - App\Entity\BlogPost
            places:
                - draft
                - reviewed
                - rejected
                - published
            transitions:
                to_review:
                    from: draft
                    to: reviewed
                publish:
                    from: reviewed
                    to: published
                reject:
                    from: reviewed
                    to: rejected
```

### Using Events

```php
use Symfony\Component\Workflow\Event\Event;

class BlogPostSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            'workflow.blog_publishing.transition.publish' => 'onPublish',
            'workflow.blog_publishing.guard.to_review' => 'guardToReview',
        ];
    }

    public function onPublish(Event $event): void { /* ... */ }
    public function guardToReview(Event $event): void { /* ... */ }
}
```

### Accessing the Workflow

```php
use Symfony\Component\Workflow\Registry;

class MyController
{
    public function __construct(private Registry $workflowRegistry) {}

    public function publish(BlogPost $post): Response
    {
        $workflow = $this->workflowRegistry->get($post, 'blog_publishing');
        if ($workflow->can($post, 'publish')) {
            $workflow->apply($post, 'publish');
        }
        return new Response('Published!');
    }
}
```

## Webhook

### Installation

```bash
composer require webhook
```

### Consuming Webhooks

```yaml
# config/packages/webhook.yaml
framework:
    webhook:
        consuming:
            enabled: true
```

### Sending Webhooks

```php
use Symfony\Component\Webhook\Webhook;
use Symfony\Component\Webhook\WebhookManagerInterface;

class MyService
{
    public function __construct(private WebhookManagerInterface $webhookManager) {}

    public function sendWebhook(): void
    {
        $webhook = new Webhook('my.event', ['data' => 'value']);
        $this->webhookManager->send($webhook);
    }
}
```
