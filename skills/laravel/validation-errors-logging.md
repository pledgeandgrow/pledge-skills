# Validation, Error Handling, and Logging

Request validation, error handling, and logging configuration.

## Validation

### Validation Quickstart

```php
use Illuminate\Http\Request;

Route::post('/users', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:8|confirmed',
        'age' => 'required|integer|min:18|max:120',
        'role' => 'required|in:admin,editor,user',
    ]);

    // $validated contains only the validated data
    User::create($validated);
});
```

### Displaying Validation Errors

```blade
{{-- Display all errors --}}
@if ($errors->any())
    <div class="alert alert-danger">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

{{-- Display error for specific field --}}
@error('email')
    <div class="error">{{ $message }}</div>
@enderror

{{-- Inline error in form --}}
<input type="email" name="email" value="{{ old('email') }}">
@error('email')
    <span class="text-red">{{ $message }}</span>
@enderror
```

### Form Request Validation

```bash
php artisan make:request StoreUserRequest
```

```php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Or $this->user()->can('create', User::class)
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'A name is required.',
            'email.unique' => 'This email is already taken.',
        ];
    }

    public function attributes(): array
    {
        return [
            'email' => 'email address',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => strtolower($this->email),
        ]);
    }
}
```

```php
// In controller
public function store(StoreUserRequest $request)
{
    // Validation passes automatically
    $validated = $request->validated();
    return User::create($validated);
}
```

### Manually Creating Validators

```php
use Illuminate\Support\Facades\Validator;

$validator = Validator::make($request->all(), [
    'title' => 'required|string|max:255',
    'body' => 'required|string',
]);

if ($validator->fails()) {
    return redirect('posts/create')
        ->withErrors($validator)
        ->withInput();
}

$validated = $validator->validated();
```

### Named Error Bagss

```php
$validator = Validator::make($request->all(), $rules)->validateWithBag('post');

return redirect()->back()->withErrors($validator, 'post');
```

### Working With Validated Input

```php
// In form request
public function rules(): array { /* ... */ }

// After validation
$validated = $this->validated(); // Array of validated data
$validated = $this->safe()->only(['name', 'email']);
$validated = $this->safe()->except(['password']);
```

### Available Validation Rules

| Rule | Description |
|------|-------------|
| `accepted` | Field must be yes, on, 1, or true |
| `active_url` | Must be a valid active URL |
| `after:date` | Must be a date after given date |
| `after_or_equal:date` | Must be after or equal to date |
| `alpha` | Must contain only letters |
| `alpha_dash` | Letters, numbers, dashes, underscores |
| `alpha_num` | Letters and numbers only |
| `array` | Must be an array |
| `before:date` | Must be a date before given date |
| `between:min,max` | Value between min and max |
| `boolean` | Must be boolean |
| `confirmed` | Must have matching `_confirmation` field |
| `date` | Must be a valid date |
| `date_equals:date` | Must equal given date |
| `date_format:format` | Must match date format |
| `different:field` | Must be different from another field |
| `digits:value` | Must have exactly N digits |
| `dimensions` | Image must meet dimension constraints |
| `distinct` | Array values must be unique |
| `email` | Must be a valid email |
| `ends_with:values` | Must end with one of given values |
| `exclude_if:field,value` | Exclude field if condition met |
| `exists:table,column` | Must exist in database |
| `file` | Must be a successfully uploaded file |
| `filled` | Must not be empty when present |
| `gt:field` | Must be greater than field |
| `gte:field` | Must be greater than or equal to field |
| `image` | Must be an image (jpeg, png, bmp, gif, svg, webp) |
| `in:values` | Must be in list of values |
| `integer` | Must be an integer |
| `ip` | Must be a valid IP address |
| `json` | Must be valid JSON string |
| `lt:field` | Must be less than field |
| `lte:field` | Must be less than or equal to field |
| `max:value` | Must not exceed value |
| `mimes:foo,bar` | Must have one of listed MIME types |
| `mimetypes:text/plain` | Must match MIME type |
| `min:value` | Must be at least value |
| `multiple_of:value` | Must be a multiple of value |
| `not_in:values` | Must not be in list |
| `not_regex:pattern` | Must not match pattern |
| `nullable` | Field may be null |
| `numeric` | Must be numeric |
| `password` | Must match current user's password |
| `present` | Must be present in input |
| `prohibited` | Must be empty |
| `regex:pattern` | Must match pattern |
| `required` | Must be present and not empty |
| `required_if:field,value` | Required if field equals value |
| `required_unless:field,value` | Required unless field equals value |
| `required_with:fields` | Required if any listed field is present |
| `required_with_all:fields` | Required if all listed fields present |
| `required_without:fields` | Required if any listed field is absent |
| `same:field` | Must match another field |
| `size:value` | Must have exact size |
| `starts_with:values` | Must start with one of values |
| `string` | Must be a string |
| `timezone` | Must be a valid timezone |
| `unique:table,column` | Must be unique in database |
| `url` | Must be a valid URL |
| `uuid` | Must be a valid UUID |

### Conditionally Adding Rules

```php
public function rules(): array
{
    return [
        'password' => $this->isMethod('POST')
            ? 'required|string|min:8|confirmed'
            : 'sometimes|string|min:8|confirmed',
    ];
}

// Using Validator::sometimes
$validator->sometimes('email', 'required|email', function ($input) {
    return $input->subscribe === true;
});
```

### Validating Arrays

```php
$validated = $request->validate([
    'users' => 'required|array',
    'users.*.name' => 'required|string|max:255',
    'users.*.email' => 'required|email',
    'users.*.role' => 'required|in:admin,editor,user',
]);
```

### Validating Files

```php
$validated = $request->validate([
    'photo' => 'required|image|mimes:jpeg,png|max:2048', // 2MB max
    'document' => 'required|file|mimes:pdf,doc,docx|max:10240',
    'video' => 'required|file|mimetypes:video/mp4|max:51200',
]);
```

### Validating Passwords

```php
$validated = $request->validate([
    'password' => 'required|password', // Must match current user's password
    'new_password' => 'required|string|min:8|confirmed|different:password',
]);
```

### Custom Validation Rules

```bash
php artisan make:rule Uppercase
```

```php
namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class Uppercase implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (strtoupper($value) !== $value) {
            $fail('The :attribute must be uppercase.');
        }
    }
}

// Usage
$rules = [
    'code' => ['required', 'string', new Uppercase],
];
```

#### Using Closures

```php
$rules = [
    'code' => [
        'required',
        'string',
        function (string $attribute, mixed $value, Closure $fail) {
            if ($value !== strtoupper($value)) {
                $fail('The :attribute must be uppercase.');
            }
        },
    ],
];
```

## Error Handling

### Exception Handler

```php
// bootstrap/app.php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->reportable(function (InvalidOrderException $e) {
        // Send to external service
    });

    $exceptions->renderable(function (InvalidOrderException $e, Request $request) {
        return response()->view('errors.invalid-order', [], 400);
    });

    // Don't report certain exceptions
    $exceptions->dontReport([
        InvalidOrderException::class,
    ]);
})
```

### Reporting Exceptions

```php
use Illuminate\Support\Facades\Log;

// Report an exception
report(new CustomException('Something went wrong'));

// Log context
Log::error('Order failed', [
    'order_id' => $order->id,
    'user_id' => $user->id,
]);

// Add global context
context(['user_id' => $user->id]);
```

### HTTP Exceptions

```php
// Abort with status code
abort(404);
abort(403, 'Unauthorized action.');
abort(419, 'Page expired');

// Throw HTTP exception
throw new \Symfony\Component\HttpKernel\Exception\HttpException(429, 'Too many requests');
```

### Custom Error Pages

```
resources/views/errors/
├── 404.blade.php
├── 403.blade.php
├── 419.blade.php
├── 500.blade.php
└── 503.blade.php
```

```blade
{{-- resources/views/errors/404.blade.php --}}
@extends('layouts.app')

@section('content')
    <h1>Page Not Found</h1>
    <p>The page you requested could not be found.</p>
@endsection
```

### Exception Ignoring

```php
$exceptions->dontReport([
    \Illuminate\Auth\AuthenticationException::class,
    \Illuminate\Auth\Access\AuthorizationException::class,
    \Symfony\Component\HttpKernel\Exception\HttpException::class,
]);
```

## Logging

### Configuration

```env
LOG_CHANNEL=stack
LOG_STACK=single
LOG_LEVEL=debug
LOG_DAILY_DAYS=7
```

### Writing Log Messages

```php
use Illuminate\Support\Facades\Log;

Log::emergency($message, $context);
Log::alert($message, $context);
Log::critical($message, $context);
Log::error($message, $context);
Log::warning($message, $context);
Log::notice($message, $context);
Log::info($message, $context);
Log::debug($message, $context);
```

### Log Channels

```php
// Write to specific channel
Log::channel('slack')->error('Something went wrong!');

// Stack channels
Log::stack(['single', 'slack'])->info('Message');
```

### Configuring Log Channels

```php
// config/logging.php
'channels' => [
    'stack' => [
        'driver' => 'stack',
        'channels' => ['single', 'slack'],
    ],
    'single' => [
        'driver' => 'single',
        'path' => storage_path('logs/laravel.log'),
        'level' => 'debug',
    ],
    'daily' => [
        'driver' => 'daily',
        'path' => storage_path('logs/laravel.log'),
        'level' => 'debug',
        'days' => 14,
    ],
    'slack' => [
        'driver' => 'slack',
        'url' => env('LOG_SLACK_WEBHOOK_URL'),
        'username' => 'Laravel Log',
        'level' => 'critical',
    ],
    'papertrail' => [
        'driver' => 'monolog',
        'level' => 'debug',
        'handler' => SyslogUdpHandler::class,
        'handler_with' => [
            'host' => 'logs.papertrailapp.com',
            'port' => 12345,
        ],
    ],
],
```

### Contextual Information

```php
// Add context to all subsequent log entries
Log::withContext(['user_id' => $user->id]);
Log::info('Order created', ['order_id' => $order->id]);

// Share context across channels
context(['request_id' => Str::uuid()]);
```

## Best Practices

1. Use Form Requests for validation in controllers
2. Use custom validation rules for reusable validation logic
3. Use `$validator->sometimes()` for conditional validation
4. Create custom error pages for common HTTP errors (403, 404, 419, 500, 503)
5. Use `abort()` for simple HTTP error responses
6. Use structured logging with context for debugging
7. Configure log channels for different environments
8. Use `LOG_LEVEL=error` in production
9. Report critical exceptions to external services (Sentry, Bugsnag)
10. Use `dontReport` to suppress non-critical exceptions
