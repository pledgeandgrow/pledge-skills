# Artisan Console, Helpers, and Collections

Artisan CLI commands, helper functions, and collection methods.

## Artisan Console

### Writing Commands

```bash
php artisan make:command SendEmails
php artisan make:command SendEmails --command=emails:send
```

```php
namespace App\Console\Commands;

use Illuminate\Console\Command;

class SendEmails extends Command
{
    protected $signature = 'emails:send
                            {user : The user ID}
                            {--queue : Whether to queue the job}
                            {--subject= : Email subject}';

    protected $description = 'Send emails to a user';

    public function handle(): int
    {
        $userId = $this->argument('user');
        $subject = $this->option('subject') ?? 'Default Subject';
        $queued = $this->option('queue');

        // Send email logic...

        $this->info("Email sent to user {$userId}");
        $this->line('Processing complete');

        return self::SUCCESS;
    }
}
```

### Command I/O

```php
// Output
$this->info('Success message');
$this->error('Error message');
$this->line('Plain line');
$this->comment('Comment');

// Table output
$this->table(['Name', 'Email'], [
    ['John', 'john@example.com'],
    ['Jane', 'jane@example.com'],
]);

// Progress bar
$this->withProgressBar($items, function ($item) {
    $this->processItem($item);
});

// Ask for input
$name = $this->ask('What is your name?');
$password = $this->secret('Enter password');
$confirm = $this->confirm('Do you want to continue?');
$choice = $this->choice('Select option', ['A', 'B', 'C'], 'A');

// Anticipate (autocomplete)
$name = $this->anticipate('Name?', ['John', 'Jane', 'Bob']);
```

### Registering Commands

```php
// In routes/console.php or bootstrap/app.php
use App\Console\Commands\SendEmails;

->withCommands([
    SendEmails::class,
])
```

### Calling Commands

```php
use Illuminate\Support\Facades\Artisan;

// From code
Artisan::call('emails:send', ['user' => 1, '--queue' => true]);
$exitCode = Artisan::call('migrate');

// From another command
$this->call('emails:send', ['user' => 1]);
$this->callSilently('emails:send', ['user' => 1]);

// Queue a command
Artisan::queue('emails:send', ['user' => 1])->onConnection('redis');
```

### Common Artisan Commands

```bash
# Application
php artisan serve                    # Start dev server
php artisan serve --port=8080        # Custom port
php artisan serve --host=0.0.0.0     # Custom host

# Database
php artisan migrate                  # Run migrations
php artisan migrate:fresh --seed     # Fresh + seed
php artisan db:seed                  # Run seeders
php artisan db:seed --class=UserSeeder

# Cache
php artisan cache:clear              # Clear application cache
php artisan config:cache             # Cache configuration
php artisan route:cache               # Cache routes
php artisan view:cache                # Compile views
php artisan event:cache               # Cache events
php artisan optimize                  # Cache everything
php artisan optimize:clear            # Clear all caches

# Code generation
php artisan make:model User -mfsc    # Model + migration + factory + seeder + controller
php artisan make:controller PostController --api
php artisan make:middleware CheckAge
php artisan make:migration add_column_to_table
php artisan make:job ProcessPodcast
php artisan make:mail OrderShipped --markdown=emails.orders.shipped
php artisan make:notification InvoicePaid
php artisan make:event OrderShipped
php artisan make:listener SendShipmentNotification --event=OrderShipped
php artisan make:observer UserObserver --model=User
php artisan make:policy PostPolicy --model=Post
php artisan make:request StorePostRequest
php artisan make:resource UserResource
php artisan make:rule ValidPhoneNumber
php artisan make:seeder UserSeeder
php artisan make:test UserTest
php artisan make:command CustomCommand

# Keys
php artisan key:generate              # Generate app key
php artisan jwt:secret                 # JWT secret (if using JWT)

# Maintenance
php artisan down                      # Maintenance mode
php artisan up                        # Exit maintenance mode
php artisan storage:link              # Create storage symlink

# Testing
php artisan test                      # Run tests
php artisan test --parallel           # Run in parallel
php artisan test --coverage           # With coverage

# Tinker
php artisan tinker                    # REPL
```

### Tinker

```bash
# Start Tinker
php artisan tinker

# In Tinker
>>> User::all();
>>> User::find(1);
>>> User::create(['name' => 'John', 'email' => 'john@example.com']);
>>> exit
```

## Helper Functions

### Arrays

```php
Arr::add($array, 'key', 'value');           // Add if not exists
Arr::collapse($arrayOfArrays);              // Collapse into single
Arr::divide($array);                        // [keys, values]
Arr::dot($array);                           // Flatten with dot notation
Arr::except($array, ['key']);               // Remove keys
Arr::first($array, $callback, $default);    // First matching
Arr::flatten($array, $depth);               // Flatten multi-dimensional
Arr::forget($array, 'key');                 // Remove key
Arr::get($array, 'key', $default);          // Get value
Arr::has($array, 'key');                    // Check key exists
Arr::last($array, $callback, $default);     // Last matching
Arr::only($array, ['key1', 'key2']);        // Only specified keys
Arr::pluck($array, 'value', 'key');         // Pluck values
Arr::prepend($array, 'value', 'key');       // Prepend
Arr::query($array);                         // Build query string
Arr::random($array, $count);                // Random items
Arr::set($array, 'key', 'value');           // Set value
Arr::shuffle($array);                       // Shuffle
Arr::sort($array, $callback);               // Sort
Arr::where($array, $callback);              // Filter
Arr::wrap($value);                          // Wrap in array if not
```

### Strings

```php
use Illuminate\Support\Str;

Str::after($string, 'search');              // After first occurrence
Str::afterLast($string, 'search');          // After last occurrence
Str::before($string, 'search');             // Before first occurrence
Str::beforeLast($string, 'search');         // Before last occurrence
Str::between($string, 'start', 'end');      // Between two strings
Str::camel($string);                        // camelCase
Str::contains($string, 'needle');           // Contains substring
Str::containsAll($string, ['a', 'b']);      // Contains all
Str::endsWith($string, 'suffix');           // Ends with
Str::finish($string, 'suffix');             // Ensure ends with
Str::is('pattern*', $string);               // Match pattern
Str::kebab($string);                        // kebab-case
Str::limit($string, 100, '...');            // Limit length
Str::lower($string);                        // Lowercase
Str::plural($string);                       // Pluralize
Str::random(40);                            // Random string
Str::remove('search', $string);             // Remove substring
Str::replace('search', 'replace', $string); // Replace
Str::replaceFirst('search', 'replace', $string);
Str::replaceLast('search', 'replace', $string);
Str::reverse($string);                      // Reverse
Str::singular($string);                     // Singularize
Str::slug($string, '-');                    // URL slug
Str::snake($string);                        // snake_case
Str::start($string, 'prefix');              // Ensure starts with
Str::startsWith($string, 'prefix');         // Starts with
Str::studly($string);                       // StudlyCase
Str::substr($string, $start, $length);      // Substring
Str::title($string);                        // Title Case
Str::ucfirst($string);                      // Upper case first
Str::upper($string);                        // Uppercase
Str::uuid();                                // UUID
Str::ulid();                                // ULID
Str::wordCount($string);                    // Word count
Str::words($string, 10, '...');             // Limit words
```

### Fluent Strings

```php
Str::of('Hello World')
    ->append('!')
    ->camel()
    ->lower()
    ->replace('hello', 'hi')
    ->upper()
    ->toString();

// Chained methods
Str::of('  Laravel Framework  ')
    ->trim()
    ->replace(' ', '-')
    ->lower()
    ->toString(); // "laravel-framework"
```

### Paths and URLs

```php
// Paths
app_path('Services/Payment.php');
base_path('vendor/bin');
config_path('app.php');
database_path('factories');
public_path('js/app.js');
resource_path('views');
storage_path('app');
lang_path('en');

// URLs
url('/profile');
secure_url('/profile');
asset('css/app.css');
route('profile', ['id' => 1]);
action([UserController::class, 'index']);
```

### Miscellaneous Helpers

```php
// Application
app();
app(Payment::class);
app()->make(Payment::class);
config('app.timezone');
config(['app.timezone' => 'UTC']);
env('APP_ENV', 'production');

// Authentication
auth();
auth()->user();
auth()->id();
auth()->check();

// Cache
cache('key', 'default');
cache(['key' => 'value'], 3600);
cache()->remember('key', 3600, fn() => User::all());

// Database
db();
db()->table('users')->get();
db('mysql')->table('users')->get();

// Logging
logger('Message');
logger()->info('Message', $context);
info('Information message');
error('Error message');
debug('Debug message');

// Old input
old('name');
old('name', 'default');

// CSRF
csrf_token();
csrf_field();

// Misc
now();
today();
collect([1, 2, 3]);
dispatch(new JobClass);
event(new EventClass);
fake(); // Faker instance
abort(404);
abort_if($condition, 404);
abort_unless($condition, 404);
throw_if($condition, $exception);
throw_unless($condition, $exception);
tap($user)->update(['name' => 'John']);
optional($user)->name;
retry(3, fn() => doSomething(), 1000);
value($valueOrCallable);
with($user, function ($user) { /* ... */ });
```

## Collections

### Creating Collections

```php
$collection = collect([1, 2, 3, 4, 5]);
$collection = Collection::make([1, 2, 3]);
$collection = User::all(); // Eloquent collection
```

### Available Methods

```php
// Filtering
$filtered = $collection->filter(fn ($item) => $item > 2);
$filtered = $collection->reject(fn ($item) => $item < 3);
$filtered = $collection->where('price', '>', 100);
$filtered = $collection->whereIn('status', ['active', 'pending']);
$filtered = $collection->whereNotIn('status', ['deleted']);
$filtered = $collection->whereNull('deleted_at');
$filtered = $collection->whereNotNull('deleted_at');
$filtered = $collection->whereBetween('price', [10, 100]);
$filtered = $collection->whereInstanceOf(User::class);

// Transforming
$mapped = $collection->map(fn ($item) => $item * 2);
$mapped = $collection->mapWithKeys(fn ($item) => [$item['id'] => $item['name']]);
$plucked = $collection->pluck('name');
$plucked = $collection->pluck('name', 'id');
$flattened = $collection->flatten();
$flattened = $collection->flatten(1); // Depth
$transformed = $collection->transform(fn ($item) => $item * 2); // Mutates

// Aggregates
$count = $collection->count();
$sum = $collection->sum('price');
$sum = $collection->sum(fn ($item) => $item['price']);
$avg = $collection->avg('price');
$min = $collection->min('price');
$max = $collection->max('price');
$median = $collection->median('price');
$mode = $collection->mode('price');

// Sorting
$sorted = $collection->sortBy('name');
$sorted = $collection->sortByDesc('name');
$sorted = $collection->sortBy(fn ($item) => $item['priority']);
$sorted = $collection->sort();
$sorted = $collection->sortDesc();
$sorted = $collection->shuffle();
$reversed = $collection->reverse();

// Grouping
$grouped = $collection->groupBy('role');
$grouped = $collection->groupBy(fn ($item) => $item['category']);

// Chunking and partitioning
$chunks = $collection->chunk(10);
$chunks = $collection->chunkWhile(fn ($item) => $item > 0);
[$even, $odd] = $collection->partition(fn ($item) => $item % 2 === 0);
$sliding = $collection->sliding(2); // Window of 2

// Combining
$combined = $collection->combine(['a', 'b', 'c']);
$zipped = $collection->zip([10, 20, 30]);
$merged = $collection->merge([6, 7, 8]);
$concat = $collection->concat([6, 7, 8]);

// Reducing
$reduced = $collection->reduce(fn ($carry, $item) => $carry + $item, 0);
$reduced = $collection->reduceSpread(fn ($carry, $a, $b) => $carry + $a + $b, 0);

// Searching
$found = $collection->search(fn ($item) => $item === 3);
$first = $collection->first();
$first = $collection->first(fn ($item) => $item > 2);
$last = $collection->last();
$last = $collection->last(fn ($item) => $item > 2);

// Checking
$collection->contains(3);
$collection->contains(fn ($item) => $item > 3);
$collection->contains('name', 'John');
$collection->every(fn ($item) => $item > 0);
$collection->has('key');
$collection->isEmpty();
$collection->isNotEmpty();

// Pagination
$forPage = $collection->forPage(2, 15); // Page 2, 15 items

// Conversion
$collection->toArray();
$collection->toJson();
$collection->all();

// Higher order messages
$collection->each->save();
$collection->filter->is_active->map->name;
$collection->sortBy->name;
```

### Lazy Collections

```php
// Memory-efficient for large datasets
$collection = LazyCollection::make(function () {
    for ($i = 0; $i < 1000000; $i++) {
        yield $i;
    }
});

// Methods work the same as regular collections
$filtered = $collection->filter(fn ($i) => $i % 2 === 0)->take(100);
```

## Best Practices

1. Use custom Artisan commands for automation tasks
2. Use `$this->withProgressBar()` for long-running commands
3. Use `Str::of()` fluent strings for readable string manipulation
4. Use `Arr::` helper methods for complex array operations
5. Use collections instead of raw array functions for better readability
6. Use `LazyCollection` for processing large datasets without memory issues
7. Use `tap()` for side-effect operations without breaking method chains
8. Use `retry()` for operations that may fail transiently
9. Use `dispatch()` helper for dispatching jobs from non-controller code
10. Use `config()` instead of `env()` outside of config files
