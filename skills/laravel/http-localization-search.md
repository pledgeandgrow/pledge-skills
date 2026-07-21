# HTTP Client, Localization, Strings, Images, and Search

HTTP client, localization, string helpers, image processing, and search.

## HTTP Client

### Making Requests

```php
use Illuminate\Support\Facades\Http;

// GET
$response = Http::get('https://api.example.com/users');
$response = Http::get('https://api.example.com/users', ['page' => 1]);

// POST
$response = Http::post('https://api.example.com/users', [
    'name' => 'John',
    'email' => 'john@example.com',
]);

// PUT / PATCH / DELETE
$response = Http::put('https://api.example.com/users/1', $data);
$response = Http::patch('https://api.example.com/users/1', $data);
$response = Http::delete('https://api.example.com/users/1');

// With headers
$response = Http::withHeaders([
    'Authorization' => 'Bearer ' . $token,
    'Accept' => 'application/json',
])->get('https://api.example.com/users');

// With basic auth
$response = Http::withBasicAuth('user', 'pass')->get('https://api.example.com');

// With bearer token
$response = Http::withToken($token)->get('https://api.example.com/users');

// With query parameters
$response = Http::withQueryParameters(['page' => 1])->get('https://api.example.com/users');

// Multipart (file upload)
$response = Http::attach(
    'file', file_get_contents('photo.jpg'), 'photo.jpg'
)->post('https://api.example.com/upload');

// Multiple attachments
$response = Http::asMultipart()->attach('file1', $content1, 'file1.jpg')
    ->attach('file2', $content2, 'file2.jpg')
    ->post('https://api.example.com/upload');

// JSON
$response = Http::asJson()->post('https://api.example.com/users', $data);
$response = Http::asForm()->post('https://api.example.com/login', $data);
```

### Working With Responses

```php
$response = Http::get('https://api.example.com/users');

// Status
$response->status();      // 200
$response->successful();  // true if 2xx
$response->failed();      // true if 4xx or 5xx
$response->clientError(); // true if 4xx
$response->serverError(); // true if 5xx
$response->ok();          // 200
$response->created();     // 201
$response->noContent();   // 204

// Body
$body = $response->body();       // String
$json = $response->json();       // Array
$object = $response->object();   // Object
$collection = $response->collect(); // Collection

// Headers
$header = $response->header('Content-Type');
$headers = $response->headers();

// Close connection
$response->close();
```

### Error Handling

```php
// Throw on client/server errors
$response = Http::post('https://api.example.com/users', $data);
$response->throw(); // Throws Illuminate\Http\Client\RequestException

// Chain after throw
$response = Http::post('https://api.example.com/users', $data)
    ->throw()
    ->json();

// Custom exception handling
$response = Http::post('https://api.example.com/users', $data)
    ->throw(function ($response, $e) {
        // Custom handling
    })
    ->json();
```

### Concurrent Requests

```php
use Illuminate\Http\Client\Pool;

$responses = Http::pool(fn (Pool $pool) => [
    $pool->as('users')->get('https://api.example.com/users'),
    $pool->as('posts')->get('https://api.example.com/posts'),
    $pool->as('comments')->get('https://api.example.com/comments'),
]);

$responses['users']->json();
$responses['posts']->json();
$responses['comments']->json();
```

### Testing HTTP Client

```php
use Illuminate\Support\Facades\Http;

public function test_api_call(): void
{
    Http::fake([
        'api.example.com/users' => Http::response(['name' => 'John'], 200),
        'api.example.com/posts' => Http::response(['title' => 'Post'], 200),
    ]);

    // Wildcard
    Http::fake([
        'api.example.com/*' => Http::response(['status' => 'ok'], 200),
    ]);

    // Any URL
    Http::fake([
        '*' => Http::response(['status' => 'ok'], 200),
    ]);

    // Sequence
    Http::fake([
        'api.example.com/users' => Http::sequence()
            ->push(['name' => 'John'], 200)
            ->push(['name' => 'Jane'], 200)
            ->pushResponse(Http::response(null, 500)),
    ]);

    // Perform request
    $response = Http::get('https://api.example.com/users');

    // Assert
    Http::assertSent(function ($request) {
        return $request->url() === 'https://api.example.com/users'
            && $request->method() === 'GET';
    });

    Http::assertNotSent(function ($request) {
        return $request->url() === 'https://api.example.com/posts';
    });
}
```

## Localization

### Configuration

```bash
# Publish language files
php artisan lang:publish
```

```env
APP_LOCALE=en
APP_FALLBACK_LOCALE=en
```

### Language Files

```
lang/
├── en/
│   ├── messages.php
│   └── validation.php
├── fr/
│   ├── messages.php
│   └── validation.php
```

```php
// lang/en/messages.php
return [
    'welcome' => 'Welcome to our application!',
    'goodbye' => 'Goodbye!',
];

// lang/fr/messages.php
return [
    'welcome' => 'Bienvenue dans notre application!',
    'goodbye' => 'Au revoir!',
];
```

### Retrieving Translation Strings

```php
// In code
echo __('messages.welcome');
echo trans('messages.welcome');

// In Blade
{{ __('messages.welcome') }}
@lang('messages.welcome')

// With parameters
echo __('messages.welcome', ['name' => 'John']);
// "Welcome, John!"

// Pluralization
echo trans_choice('messages.apples', 10);
// lang/en/messages.php: 'apples' => '{0} No apples|{1} One apple|[2,*] :count apples'
```

### JSON Translation Files

```
lang/
├── en.json
├── fr.json
```

```json
// lang/fr.json
{
    "Welcome to our application!": "Bienvenue dans notre application!"
}
```

```php
echo __('Welcome to our application!');
```

### Setting Locale

```php
// At runtime
App::setLocale('fr');

// In middleware
public function handle(Request $request, Closure $next): mixed
{
    if ($user = $request->user()) {
        App::setLocale($user->locale);
    }
    return $next($request);
}

// Fallback locale
App::setFallbackLocale('en');
```

### Retrieving Available Locales

```php
$locales = config('app.available_locales', ['en', 'fr', 'es']);
```

## Strings

### Fluent Strings

```php
use Illuminate\Support\Str;

// Chaining
$result = Str::of('  Hello World  ')
    ->trim()
    ->replace(' ', '-')
    ->lower()
    ->toString(); // "hello-world"

// Methods
Str::of('Hello')->append('!')->upper(); // "HELLO!"
Str::of('laravel')->camel(); // "laravel"
Str::of('laravel')->snake(); // "laravel"
Str::of('laravel')->studly(); // "Laravel"
Str::of('laravel')->kebab(); // "laravel"
Str::of('Hello World')->slug(); // "hello-world"
Str::of('Hello')->repeat(3); // "HelloHelloHello"
Str::of('Hello')->wrap('"'); // '"Hello"'
Str::of('Hello World')->wordCount(); // 2
Str::of('Hello World')->words(1, '...'); // "Hello..."
Str::of('Hello World')->limit(5, '...'); // "Hello..."
Str::of('Hello')->when(true, fn ($str) => $str->append('!'));
Str::of('Hello')->unless(false, fn ($str) => $str->append('!'));
Str::of('Hello')->tap(function ($str) { /* side effect */ })->upper();
```

### String Helpers

```php
// Random strings
Str::random(40);                    // Random alphanumeric
Str::uuid();                        // UUID v4
Str::ulid();                        // ULID
Str::password(16);                  // Random password

// String manipulation
Str::after('hello@example.com', '@'); // "example.com"
Str::before('hello@example.com', '@'); // "hello"
Str::between('This is [my] text', '[', ']'); // "my"
Str::camel('foo_bar'); // "fooBar"
Str::kebab('fooBar'); // "foo-bar"
Str::snake('FooBar'); // "foo_bar"
Str::studly('foo_bar'); // "FooBar"
Str::title('foo bar'); // "Foo Bar"
Str::slug('Laravel Framework', '-'); // "laravel-framework"
Str::plural('apple'); // "apples"
Str::singular('apples'); // "apple"
Str::limit('Lorem ipsum...', 10, '...'); // "Lorem ipsu..."
Str::words('Lorem ipsum dolor', 2, '...'); // "Lorem ipsum..."
Str::mask('john@example.com', '*', 3); // "joh************"
Str::replace('search', 'replace', 'text');
Str::replaceFirst('search', 'replace', 'text');
Str::replaceLast('search', 'replace', 'text');
Str::remove('search', 'text');
Str::reverse('Hello'); // "olleH"
```

## Images

### Image Manipulation

```php
use Illuminate\Support\Facades\Image;

// Resize
$img = Image::make('photo.jpg')->resize(300, 200);
$img->save('photo_small.jpg');

// Crop
$img = Image::make('photo.jpg')->crop(100, 100, 25, 25);

// Fit
$img = Image::make('photo.jpg')->fit(300, 200);

// Watermark
$img = Image::make('photo.jpg')->insert('watermark.png', 'bottom-right', 10, 10);

// Encode
$data = Image::make('photo.jpg')->encode('png', 90);

// Blur, grayscale, etc.
$img = Image::make('photo.jpg')->blur(5)->grayscale();
```

## Search

### Scout (Full-Text Search)

```bash
composer require laravel/scout
php artisan vendor:publish --provider="Laravel\Scout\ScoutServiceProvider"
```

```php
// Model uses Searchable trait
use Laravel\Scout\Searchable;

class Post extends Model
{
    use Searchable;

    // Define searchable attributes
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'body' => $this->body,
            'tags' => $this->tags->pluck('name')->toArray(),
        ];
    }
}
```

```php
// Search
$results = Post::search('laravel')->get();
$results = Post::search('laravel')->paginate(15);
$results = Post::search('laravel')->where('published', 1)->get();

// Within a specific model
$results = Post::search('laravel')
    ->query(fn ($query) => $query->with('author'))
    ->get();
```

### Search Engines

| Engine | Package |
|--------|---------|
| Algolia | `algolia/algoliasearch-client-php` |
| Meilisearch | `meilisearch/meilisearch-php` |
| Typesense | `typesense/typesense-php` |
| Database | Built-in (MySQL/PostgreSQL) |

```env
SCOUT_DRIVER=database
# Or: algolia, meilisearch, typesense, collection
```

## Best Practices

1. Use `Http::fake()` in tests to mock external API calls
2. Use concurrent requests with `Http::pool()` for parallel API calls
3. Use `throw()` to automatically throw exceptions on failed HTTP requests
4. Store language files in `lang/` directory with JSON for simple translations
5. Use `trans_choice()` for pluralization
6. Use Scout for full-text search with Algolia/Meilisearch/Typesense
7. Use `toSearchableArray()` to customize what data is indexed
8. Use `Str::of()` fluent strings for readable string manipulation
9. Use `Str::uuid()` or `Str::ulid()` for unique identifiers
10. Set locale based on user preference in middleware
