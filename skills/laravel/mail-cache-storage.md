# Mail, File Storage, Cache, and Rate Limiting

Mail sending, filesystem/storage, cache management, and rate limiting.

## Mail

### Configuration

```env
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=587
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

### Sending Mail

```php
use Illuminate\Support\Facades\Mail;

// Basic
Mail::to($user)->send(new OrderShipped($order));

// Multiple recipients
Mail::to($user)->cc($admin)->bcc($boss)->send(new OrderShipped($order));

// Queue mail
Mail::to($user)->queue(new OrderShipped($order));
Mail::to($user)->later(now()->addMinutes(10), new OrderShipped($order));

// On specific queue
Mail::to($user)->queue(new OrderShipped($order))->onQueue('emails');
```

### Mailables

```bash
php artisan make:mail OrderShipped
php artisan make:mail OrderShipped --markdown=emails.orders.shipped
```

```php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderShipped extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Order $order,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Order Shipped #' . $this->order->id,
            from: new Address('shop@example.com', 'Shop Name'),
            replyTo: [new Address('support@example.com', 'Support')],
            tags: ['order', 'shipment'],
            metadata: ['order_id' => $this->order->id],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.orders.shipped',
            with: ['order' => $this->order],
        );
    }

    public function attachments(): array
    {
        return [
            Attachment::fromPath('/path/to/file.pdf')
                ->as('invoice.pdf')
                ->withMime('application/pdf'),
        ];
    }
}
```

### Markdown Mailables

```blade
{{-- resources/views/emails/orders/shipped.blade.php --}}
@component('mail::message')
# Order Shipped

Your order #{{ $order->id }} has been shipped!

@component('mail::button', ['url' => $url])
Track Order
@endcomponent

@component('mail::panel')
Shipping Address: {{ $order->address }}
@endcomponent

@component('mail::table')
| Item       | Qty | Price |
|------------|-----|-------|
| Product A  | 2   | $20   |
| Product B  | 1   | $15   |
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
```

### Mail Testing

```php
use Illuminate\Support\Facades\Mail;

public function test_order_email(): void
{
    Mail::fake();

    // Perform action
    $order->ship();

    // Assert sent
    Mail::assertSent(OrderShipped::class);
    Mail::assertSent(OrderShipped::class, function ($mail) use ($order) {
        return $mail->order->id === $order->id;
    });

    // Assert queued
    Mail::assertQueued(OrderShipped::class);

    // Assert not sent
    Mail::assertNotSent(AnotherMail::class);

    // Assert sent to recipient
    Mail::assertSent(OrderShipped::class, fn ($mail) => $mail->hasTo($user->email));
}
```

## File Storage

### Configuration

```env
FILESYSTEM_DISK=local
# Or: public, s3

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
```

### Using the Filesystem

```php
use Illuminate\Support\Facades\Storage;

// Write
Storage::put('file.txt', 'contents');
Storage::put('file.txt', $fileContents);

// Read
$contents = Storage::get('file.txt');
$exists = Storage::exists('file.txt');

// Download
return Storage::download('file.txt', 'name.txt', $headers);

// Delete
Storage::delete('file.txt');
Storage::delete(['file1.txt', 'file2.txt']);

// Files and directories
$files = Storage::files('directory');
$allFiles = Storage::allFiles('directory');
$directories = Storage::directories('directory');
$allDirectories = Storage::allDirectories('directory');

// Make directory
Storage::makeDirectory('directory');

// Delete directory
Storage::deleteDirectory('directory');

// URL
$url = Storage::url('file.txt');
$temporaryUrl = Storage::temporaryUrl('file.txt', now()->addMinutes(5));

// Size
$size = Storage::size('file.txt');

// Last modified
$time = Storage::lastModified('file.txt');

// Copy / move
Storage::copy('old.txt', 'new.txt');
Storage::move('old.txt', 'new.txt');
```

### File Uploads

```php
// Store uploaded file
$path = $request->file('photo')->store('photos', 'public');
// Returns: photos/xyz.jpg

// Store with custom name
$path = $request->file('photo')->storeAs('photos', 'custom.jpg', 'public');

// Store on specific disk
$path = $request->file('photo')->store('photos', 's3');

// Get file info
$file = $request->file('photo');
$file->getClientOriginalName();
$file->getClientOriginalExtension();
$file->getClientMimeType();
$file->getSize();
```

### Custom Filesystems

```php
// In AppServiceProvider::boot()
use Illuminate\Support\Facades\Storage;

Storage::extend('sftp-custom', function ($app, $config) {
    return new Filesystem(new SftpAdapter($config));
});
```

### Streaming Downloads

```php
use Illuminate\Support\Facades\Storage;

return response()->stream(function () {
    echo Storage::get('large-file.txt');
}, 200, ['Content-Type' => 'text/plain']);
```

## Cache

### Configuration

```env
CACHE_STORE=database
# Or: file, redis, memcached, array, dynamodb
```

### Using the Cache

```php
use Illuminate\Support\Facades\Cache;

// Get
$value = Cache::get('key');
$value = Cache::get('key', 'default');

// Put
Cache::put('key', 'value', 3600); // Seconds
Cache::put('key', 'value', now()->addMinutes(10));

// Add (only if not exists)
Cache::add('key', 'value', 3600);

// Forever
Cache::forever('key', 'value');

// Remember (get or compute)
$value = Cache::remember('key', 3600, function () {
    return User::all();
});

// Remember forever
$value = Cache::rememberForever('key', function () {
    return User::all();
});

// Forget
Cache::forget('key');

// Has
if (Cache::has('key')) { }

// Missing
if (Cache::missing('key')) { }

// Increment / decrement
Cache::increment('counter');
Cache::increment('counter', 5);
Cache::decrement('counter');

// Tags (Redis/Memcached only)
Cache::tags(['users', 'active'])->put('key', 'value', 3600);
Cache::tags(['users'])->flush();
```

### Cache Locks

```php
// Atomic locks
Cache::lock('processing', 60)->block(5, function () {
    // Lock acquired — process
});

// Manual lock
$lock = Cache::lock('processing', 60);
if ($lock->get()) {
    try {
        // Process
    } finally {
        $lock->release();
    }
}

// Owner-based release
$lock = Cache::lock('processing', 60)->owner();
Cache::restoreLock('processing', $owner)->release();
```

### Cache Tags

```php
// Tagged caching (Redis/Memcached)
Cache::tags(['people', 'authors'])->put('John', $john, 3600);
Cache::tags(['people', 'authors'])->put('Jane', $jane, 3600);

// Flush a tag
Cache::tags(['authors'])->flush();

// Flush multiple tags
Cache::tags(['people', 'authors'])->flush();
```

### Adding Custom Cache Drivers

```php
// In AppServiceProvider::boot()
Cache::extend('custom', function ($app, $config) {
    return Cache::repository(new CustomStore());
});
```

### Cache Events

```php
use Illuminate\Cache\Events\CacheHit;
use Illuminate\Cache\Events\CacheMissed;

Event::listen(CacheHit::class, function ($event) {
    Log::info("Cache hit: {$event->key}");
});

Event::listen(CacheMissed::class, function ($event) {
    Log::info("Cache miss: {$event->key}");
});
```

## Rate Limiting

### Defining Rate Limiters

```php
// In AppServiceProvider::boot()
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});

RateLimiter::for('uploads', function (Request $request) {
    return [
        Limit::perMinute(10)->by($request->user()->id),
        Limit::perDay(100)->by($request->user()->id),
    ];
});

// Custom response
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)
        ->by($request->user()?->id ?: $request->ip())
        ->response(function () {
            return response('Custom rate limit message', 429);
        });
});
```

### Attaching to Routes

```php
// Route middleware
Route::middleware(['throttle:api'])->group(function () {
    Route::get('/data', [DataController::class, 'index']);
});

// Custom limiter
Route::middleware(['throttle:uploads'])->group(function () {
    Route::post('/upload', [UploadController::class, 'store']);
});

// Multiple limiters
Route::middleware(['throttle:10,1', 'throttle:100,1'])->group(function () {
    // 10 per minute AND 100 per minute
});
```

### Manually Attempting Rate Limited Actions

```php
use Illuminate\Support\Facades\RateLimiter;

if (RateLimiter::tooManyAttempts('send-email:'.$user->id, $maxAttempts = 5)) {
    $seconds = RateLimiter::availableIn('send-email:'.$user->id);
    return "Too many attempts. Try again in {$seconds} seconds.";
}

RateLimiter::hit('send-email:'.$user->id, $decaySeconds = 60);

// Send email...

// Clear
RateLimiter::clear('send-email:'.$user->id);
```

## Best Practices

1. Use Markdown mailables for consistent email templates
2. Queue mail sending for better response times
3. Use `Cache::remember()` for expensive database queries
4. Use cache locks for preventing concurrent operations
5. Use tagged caching for grouped cache invalidation
6. Use S3 for production file storage
7. Use `Storage::temporaryUrl()` for time-limited file access
8. Use rate limiting on API endpoints to prevent abuse
9. Use `throttle` middleware with custom rate limiters
10. Use `Cache::add()` for idempotent cache writes (only writes if not exists)
