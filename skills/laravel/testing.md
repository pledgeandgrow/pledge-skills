# Testing

PHPUnit/Pest testing, HTTP tests, console tests, browser tests (Dusk), database testing, and mocking.

## Testing Getting Started

### Creating Tests

```bash
php artisan make:test UserTest
php artisan make:test UserTest --pest
php artisan make:test UserTest --unit
```

### Running Tests

```bash
# Run all tests
php artisan test

# Run with filter
php artisan test --filter=UserTest

# Run in parallel
php artisan test --parallel

# With coverage
php artisan test --coverage

# With minimum coverage
php artisan test --coverage --min=80

# Stop on first failure
php artisan test --stop-on-failure

# Using Pest directly
./vendor/bin/pest
./vendor/bin/pest --parallel
```

### Environment

```env
# .env.testing (or phpunit.xml)
APP_ENV=testing
DB_CONNECTION=sqlite
DB_DATABASE=:memory:
CACHE_STORE=array
SESSION_DRIVER=array
QUEUE_CONNECTION=sync
```

### Test Structure (PHPUnit)

```php
namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
    }
}
```

### Test Structure (Pest)

```php
use function Pest\Laravel\{post, assertDatabaseHas};

it('can register a user', function () {
    $response = post('/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertCreated();
    assertDatabaseHas('users', ['email' => 'john@example.com']);
});
```

## HTTP Tests

### Making Requests

```php
public function test_get_users(): void
{
    // GET
    $response = $this->get('/users');
    $response = $this->getJson('/api/users');

    // POST
    $response = $this->post('/users', ['name' => 'John']);
    $response = $this->postJson('/api/users', ['name' => 'John']);

    // PUT / PATCH / DELETE
    $response = $this->put('/users/1', ['name' => 'Jane']);
    $response = $this->patch('/users/1', ['name' => 'Jane']);
    $response = $this->delete('/users/1');
    $response = $this->deleteJson('/api/users/1');

    // With headers
    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $token,
    ])->get('/api/users');

    // With session
    $response = $this->withSession(['key' => 'value'])->get('/dashboard');

    // Acting as user
    $response = $this->actingAs($user)->get('/profile');

    // With file upload
    $response = $this->post('/upload', [
        'photo' => Illuminate\Http\UploadedFile::fake()->image('photo.jpg'),
    ]);
}
```

### Assertions

```php
// Status assertions
$response->assertStatus(200);
$response->assertOk();
$response->assertCreated();
$response->assertNoContent();
$response->assertNotFound();
$response->assertForbidden();
$response->assertUnauthorized();
$response->assertUnprocessable();
$response->assertRedirect('/home');
$response->assertRedirectToRoute('home');

// JSON assertions
$response->assertJson(['key' => 'value']);
$response->assertJsonPath('data.name', 'John');
$response->assertJsonStructure(['data' => ['id', 'name', 'email']]);
$response->assertJsonCount(3, 'data');
$response->assertJsonMissing(['key' => 'value']);
$response->assertJsonValidationErrors(['email', 'password']);
$response->assertJsonFragment(['name' => 'John']);

// View assertions
$response->assertViewIs('users.index');
$response->assertViewHas('users');
$response->assertViewHas('users', fn ($users) => $users->count() === 10);

// Session assertions
$response->assertSessionHas('status', 'Task completed!');
$response->assertSessionHasErrors(['email']);
$response->assertSessionHasNoErrors();
$response->assertSessionMissing('key');

// Cookie assertions
$response->assertCookie('name', 'value');
$response->assertCookieExpired('name');
$response->assertCookieNotExpired('name');
$response->assertCookieMissing('name');

// Header assertions
$response->assertHeader('Content-Type', 'application/json');
$response->assertHeaderMissing('X-Custom');

// Other
$response->assertSee('Hello World');
$response->assertSeeText('Hello World');
$response->assertDontSee('Goodbye');
$response->assertDownload('file.pdf');
$response->assertStreamedContent('content');
```

## Database Testing

### RefreshDatabase

```php
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_user(): void
    {
        // Database is fresh for each test
        User::factory()->create(['email' => 'john@example.com']);

        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
        $this->assertDatabaseMissing('users', ['email' => 'jane@example.com']);
    }
}
```

### Database Assertions

```php
$this->assertDatabaseHas('users', ['email' => 'john@example.com']);
$this->assertDatabaseMissing('users', ['email' => 'jane@example.com']);
$this->assertDatabaseCount('users', 5);
$this->assertSoftDeleted('users', ['id' => 1]);
$this->assertNotSoftDeleted('users', ['id' => 1]);
$this->assertModelExists($user);
$this->assertModelMissing($deletedUser);
```

### Using Factories in Tests

```php
public function test_user_can_login(): void
{
    $user = User::factory()->create([
        'email' => 'john@example.com',
        'password' => bcrypt('password'),
    ]);

    $response = $this->post('/login', [
        'email' => 'john@example.com',
        'password' => 'password',
    ]);

    $response->assertRedirect('/dashboard');
    $this->assertAuthenticatedAs($user);
}
```

## Console Tests

```php
use Illuminate\Foundation\Testing\RefreshDatabase;

class ConsoleTest extends TestCase
{
    use RefreshDatabase;

    public function test_artisan_command(): void
    {
        // Run command
        $this->artisan('emails:send', ['user' => 1])
            ->assertSuccessful()
            ->expectsOutput('Email sent to user 1')
            ->doesntExpectOutput('Error')
            ->expectsOutputToContain('Email sent');

        // Confirm prompt
        $this->artisan('migrate:fresh')
            ->expectsConfirmation('Do you really want to run migrations?', 'yes')
            ->assertSuccessful();

        // Choice prompt
        $this->artisan('make:model')
            ->expectsChoice('Which type of model?', 'Standard', ['Standard', 'Pivot'])
            ->assertSuccessful();
    }
}
```

## Browser Tests (Dusk)

### Installation

```bash
composer require laravel/dusk --dev
php artisan dusk:install
```

### Writing Dusk Tests

```bash
php artisan dusk:make LoginTest
```

```php
namespace Tests\Browser;

use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class LoginTest extends DuskTestCase
{
    public function test_user_can_login(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/login')
                ->type('email', 'john@example.com')
                ->type('password', 'password')
                ->press('Login')
                ->assertPathIs('/dashboard')
                ->assertSee('Welcome, John');
        });
    }
}
```

### Dusk Browser Methods

```php
$browser->visit('/page');
$browser->visitRoute('home');
$browser->click('@selector');
$browser->clickLink('Text');
$browser->type('field', 'value');
$browser->select('field', 'value');
$browser->check('field');
$browser->uncheck('field');
$browser->radio('field', 'value');
$browser->attach('file', '/path/to/file');
$browser->press('Button Text');
$browser->submit('#form-id');
$browser->drag('@from', '@to');
$browser->dragUp('@element', 100);
$browser->scrollTo('@element');
$browser->scrollToTop();
$browser->scrollToBottom();
$browser->screenshot('filename');
$browser->waitFor('@element');
$browser->waitForText('Loading complete');
$browser->waitForDialog();
$browser->acceptDialog();
$browser->typeInDialog('value');
$browser->assertPathIs('/dashboard');
$browser->assertSee('Welcome');
$browser->assertDontSee('Error');
$browser->assertVisible('@element');
$browser->assertPresent('@element');
$browser->assertMissing('@element');
$browser->assertInputValue('field', 'value');
$browser->assertChecked('field');
$browser->assertSelected('field', 'value');
$browser->assertTitle('Page Title');
$browser->assertUrlIs('https://example.com');
$browser->with('@form', function ($form) {
    $form->type('email', 'john@example.com');
});
$browser->withinFrame('@iframe', function ($frame) {
    $frame->assertSee('Content');
});
```

### Running Dusk Tests

```bash
php artisan dusk
php artisan dusk --filter=LoginTest
php artisan dusk:failures  # Show last failures
```

## Mocking

### Mocking Facades

```php
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

public function test_cache(): void
{
    Cache::shouldReceive('get')
        ->once()
        ->with('key')
        ->andReturn('value');

    $this->assertEquals('value', Cache::get('key'));
}

public function test_queue(): void
{
    Queue::fake();
    // ... dispatch jobs
    Queue::assertPushed(ProcessPodcast::class);
}

public function test_mail(): void
{
    Mail::fake();
    // ... send mail
    Mail::assertSent(OrderShipped::class);
}

public function test_events(): void
{
    Event::fake();
    // ... dispatch events
    Event::assertDispatched(OrderShipped::class);
}

public function test_http(): void
{
    Http::fake([
        'api.example.com/*' => Http::response(['ok' => true], 200),
    ]);
    // ... make HTTP requests
    Http::assertSent(fn ($request) => $request->url() === 'https://api.example.com/users');
}

public function test_storage(): void
{
    Storage::fake('public');
    // ... upload files
    Storage::disk('public')->assertExists('photo.jpg');
}
```

### Mocking Objects

```php
use Mockery;

public function test_service(): void
{
    $mock = Mockery::mock(PaymentService::class);
    $mock->shouldReceive('charge')
        ->once()
        ->with(100)
        ->andReturn(true);

    $this->app->instance(PaymentService::class, $mock);

    // Test using the mocked service
    $response = $this->post('/pay', ['amount' => 100]);
    $response->assertOk();
}
```

### Time Manipulation

```php
use Illuminate\Support\Facades\Date;

public function test_scheduled_task(): void
{
    // Travel to a specific time
    $this->travelTo(now()->addHour());
    $this->assertTrue($task->isDue());

    // Travel forward
    $this->travel(5)->minutes();
    $this->travel(1)->day();

    // Travel back
    $this->travelBack();

    // Freeze time
    $this->freezeTime();

    // Using Date facade
    Date::setTestNow('2024-01-01 00:00:00');
    Date::setTestNow();
}
```

## Best Practices

1. Use `RefreshDatabase` trait for tests that modify the database
2. Use factories for test data — never hardcode test data
3. Use `actingAs()` for authenticated route testing
4. Use `Http::fake()` to mock external API calls
5. Use `Queue::fake()` and `Mail::fake()` to test without side effects
6. Use time manipulation (`$this->travel()`) for time-sensitive tests
7. Use Pest for more readable test syntax
8. Run tests in parallel with `--parallel` for faster CI
9. Use Dusk for JavaScript-dependent browser testing
10. Use `assertJsonStructure()` for API response structure validation
