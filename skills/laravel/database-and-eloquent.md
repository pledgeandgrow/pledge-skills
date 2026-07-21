# Database and Eloquent ORM

Database configuration, query builder, migrations, seeding, Redis, MongoDB, and the Eloquent ORM.

## Database Configuration

### Configuration

```env
DB_CONNECTION=sqlite
# Or MySQL
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
# Or PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=laravel
```

### Multiple Database Connections

```php
// config/database.php
'connections' => [
    'mysql' => [/* ... */],
    'mysql_read' => [
        'driver' => 'mysql',
        'host' => env('DB_READ_HOST', '127.0.0.1'),
        // ... same as mysql but different host
    ],
],
```

```php
// Using multiple connections
$users = DB::connection('mysql_read')->select('SELECT * FROM users');
$writeDb = DB::connection('mysql');
```

### Running Raw SQL

```php
use Illuminate\Support\Facades\DB;

// Select
$users = DB::select('SELECT * FROM users WHERE active = ?', [1]);
$users = DB::select('SELECT * FROM users WHERE active = :active', ['active' => 1]);

// Insert
DB::insert('INSERT INTO users (name, email) VALUES (?, ?)', ['Taylor', 'taylor@example.com']);

// Update
$affected = DB::update('UPDATE users SET votes = 100 WHERE name = ?', ['Taylor']);

// Delete
$deleted = DB::delete('DELETE FROM users WHERE inactive = 1');

// Statement
DB::statement('DROP TABLE users');
```

## Query Builder

### Retrieving Results

```php
// Get all rows
$users = DB::table('users')->get();

// Get single row
$user = DB::table('users')->where('id', 1)->first();

// Get single column value
$name = DB::table('users')->where('id', 1)->value('name');

// Get column of values
$names = DB::table('users')->pluck('name');

// Chunk results
DB::table('users')->orderBy('id')->chunk(100, function ($users) {
    foreach ($users as $user) {
        // Process user
    }
});

// Lazy collections
$users = DB::table('users')->orderBy('id')->lazy()->each(function ($user) {
    // Process user
});

// Aggregates
$count = DB::table('users')->count();
$max = DB::table('users')->max('votes');
$min = DB::table('users')->min('votes');
$avg = DB::table('users')->avg('votes');
$sum = DB::table('users')->sum('votes');
```

### Selects

```php
$users = DB::table('users')
    ->select('name', 'email as user_email')
    ->distinct()
    ->get();

// Add select clause
$query = DB::table('users')->select('name');
$query->addSelect('email');
```

### Where Clauses

```php
// Basic where
$users = DB::table('users')->where('votes', 100)->get();
$users = DB::table('users')->where('votes', '>=', 100)->get();
$users = DB::table('users')->where('votes', '<>', 100)->get();
$users = DB::table('users')->where('name', 'like', 'T%')->get();

// Array of conditions
$users = DB::table('users')->where([
    ['status', '=', 'active'],
    ['votes', '>', 100],
])->get();

// Or where
$users = DB::table('users')
    ->where('votes', '>', 100)
    ->orWhere('name', 'John')
    ->get();

// Where in
$users = DB::table('users')->whereIn('id', [1, 2, 3])->get();
$users = DB::table('users')->whereNotIn('id', [1, 2, 3])->get();

// Where null
$users = DB::table('users')->whereNull('deleted_at')->get();
$users = DB::table('users')->whereNotNull('deleted_at')->get();

// Where between
$users = DB::table('users')->whereBetween('votes', [1, 100])->get();
$users = DB::table('users')->whereNotBetween('votes', [1, 100])->get();

// Where date
$users = DB::table('users')->whereDate('created_at', '2024-01-01')->get();
$users = DB::table('users')->whereMonth('created_at', 1)->get();
$users = DB::table('users')->whereYear('created_at', 2024)->get();

// Where exists
$users = DB::table('users')
    ->whereExists(function ($query) {
        $query->select(DB::raw(1))
            ->from('orders')
            ->whereColumn('orders.user_id', 'users.id');
    })
    ->get();

// JSON where
$users = DB::table('users')->whereJsonContains('options->languages', ['en'])->get();
$users = DB::table('users')->whereJsonLength('options->languages', 0)->get();
```

### Ordering, Grouping, Limit

```php
$users = DB::table('users')
    ->orderBy('name', 'desc')
    ->latest()  // orderBy('created_at', 'desc')
    ->oldest()  // orderBy('created_at', 'asc')
    ->inRandomOrder()
    ->get();

// Group by
$users = DB::table('users')
    ->select('account_id', DB::raw('count(*) as total'))
    ->groupBy('account_id')
    ->having('total', '>', 10)
    ->get();

// Limit / offset
$users = DB::table('users')->skip(10)->take(5)->get();
$users = DB::table('users')->offset(10)->limit(5)->get();
```

### Joins

```php
// Inner join
$users = DB::table('users')
    ->join('contacts', 'users.id', '=', 'contacts.user_id')
    ->select('users.*', 'contacts.phone')
    ->get();

// Left join
$users = DB::table('users')
    ->leftJoin('posts', 'users.id', '=', 'posts.user_id')
    ->get();

// Cross join
$users = DB::table('users')
    ->crossJoin('departments')
    ->get();

// Advanced join
$users = DB::table('users')
    ->join('contacts', function ($join) {
        $join->on('users.id', '=', 'contacts.user_id')
             ->where('contacts.active', 1);
    })
    ->get();

// Subquery joins
$users = DB::table('users')
    ->leftJoinSub(
        DB::table('posts')->select('user_id', DB::raw('MAX(created_at) as last_post')),
        'latest_posts',
        'users.id',
        '=',
        'latest_posts.user_id'
    )
    ->get();
```

### Inserts

```php
// Single insert
$id = DB::table('users')->insertGetId([
    'name' => 'John',
    'email' => 'john@example.com',
    'votes' => 0,
]);

// Multiple insert
DB::table('users')->insert([
    ['name' => 'John', 'email' => 'john@example.com'],
    ['name' => 'Jane', 'email' => 'jane@example.com'],
]);

// Upsert (insert or update)
DB::table('users')->upsert([
    ['id' => 1, 'name' => 'John', 'email' => 'john@example.com'],
    ['id' => 2, 'name' => 'Jane', 'email' => 'jane@example.com'],
], ['id'], ['name', 'email']);
```

### Updates

```php
$affected = DB::table('users')
    ->where('id', 1)
    ->update(['votes' => 1]);

// Update or insert
DB::table('users')->updateOrInsert(
    ['email' => 'john@example.com'],
    ['name' => 'John', 'votes' => 1]
);

// Increment / decrement
DB::table('users')->increment('votes');
DB::table('users')->increment('votes', 5);
DB::table('users')->decrement('votes');
```

### Deletes

```php
$deleted = DB::table('users')->where('votes', '<', 100)->delete();
DB::table('users')->truncate();
```

### Transactions

```php
DB::transaction(function () {
    DB::table('users')->update(['votes' => 1]);
    DB::table('posts')->delete();
});

// Manual transactions
DB::beginTransaction();
try {
    // Operations
    DB::commit();
} catch (\Exception $e) {
    DB::rollBack();
    throw $e;
}
```

## Migrations

### Generating Migrations

```bash
# Create migration
php artisan make:migration create_users_table

# With table name
php artisan make:migration add_votes_to_users_table --table=users

# Create table
php artisan make:migration create_users_table --create=users

# Squash migrations
php artisan schema:dump
php artisan schema:dump --prune
```

### Migration Structure

```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
```

### Running Migrations

```bash
php artisan migrate              # Run pending
php artisan migrate --force      # Force in production
php artisan migrate:rollback     # Roll back last batch
php artisan migrate:rollback --step=5  # Roll back 5 steps
php artisan migrate:reset        # Roll back all
php artisan migrate:refresh      # Roll back all + re-run
php artisan migrate:fresh        # Drop all tables + re-run
php artisan migrate:fresh --seed # Fresh + seed
php artisan migrate:status       # Show migration status
```

### Available Column Types

```php
$table->id();                        // Big incrementing ID
$table->ulid('id');                  // ULID primary key
$table->uuid('id');                  // UUID primary key
$table->bigIncrements('id');         // Big auto-increment
$table->binary('data');              // BLOB
$table->boolean('confirmed');        // BOOLEAN
$table->char('name', 100);           // CHAR with length
$table->date('created_at');          // DATE
$table->dateTime('created_at');      // DATETIME
$table->decimal('amount', 8, 2);     // DECIMAL
$table->double('amount', 8, 2);      // DOUBLE
$table->enum('type', ['foo', 'bar']); // ENUM
$table->float('amount');             // FLOAT
$table->foreignId('user_id');        // Foreign key (big int)
$table->foreignUlid('user_id');      // Foreign ULID
$table->foreignUuid('user_id');      // Foreign UUID
$table->integer('votes');            // INTEGER
$table->ipAddress('visitor');        // IP address
$table->json('options');             // JSON
$table->jsonb('options');            // JSONB (PostgreSQL)
$table->longText('description');     // LONG TEXT
$table->macAddress('device');        // MAC address
$table->mediumInteger('votes');      // MEDIUM INT
$table->mediumText('body');          // MEDIUM TEXT
$table->morphs('taggable');          // polymorphic (id + type)
$table->rememberToken();             // remember_token (100 chars)
$table->smallInteger('votes');       // SMALL INT
$table->string('name', 100);         // VARCHAR
$table->text('body');                // TEXT
$table->time('sunrise');             // TIME
$table->timestamp('added_on');       // TIMESTAMP
$table->timestamps();                // created_at + updated_at
$table->tinyInteger('votes');        // TINY INT
$table->unsignedInteger('votes');    // Unsigned INT
$table->year('birth_year');          // YEAR
```

### Column Modifiers

```php
$table->string('name')->after('id');        // After column (MySQL)
$table->string('name')->autoIncrement();    // Auto-increment
$table->string('name')->charset('utf8mb4'); // Character set
$table->string('name')->collation('utf8mb4_unicode_ci');
$table->string('name')->comment('User name');
$table->string('name')->default('Guest');
$table->string('name')->nullable();
$table->string('name')->storedAs('expression'); // Generated column
$table->string('name')->useCurrent();       // Use CURRENT_TIMESTAMP
$table->string('name')->useCurrentOnUpdate();
```

### Indexes

```php
$table->index('email');                    // Basic index
$table->index(['account_id', 'created_at']); // Composite index
$table->unique('email');                   // Unique index
$table->unique(['email', 'account_id']);   // Composite unique
$table->fullText('body');                  // Full text index
$table->spatialIndex('location');          // Spatial index
$table->renameIndex('old', 'new');         // Rename index
$table->dropIndex(['email']);              // Drop index
$table->dropUnique(['email']);             // Drop unique
```

### Foreign Key Constraints

```php
$table->foreignId('user_id')
    ->constrained()
    ->onDelete('cascade')
    ->onUpdate('cascade');

// Custom table
$table->foreignId('user_id')->constrained('users');

// Drop foreign key
$table->dropForeign(['user_id']);
```

## Pagination

### Paginating Query Builder Results

```php
// Basic pagination
$users = DB::table('users')->paginate(15);

// Simple pagination (no count query — more efficient for large datasets)
$users = DB::table('users')->simplePaginate(15);

// Cursor pagination (most efficient for large datasets)
$users = DB::table('users')->orderBy('id')->cursorPaginate(15);

// With query parameters
$users = DB::table('users')->where('active', 1)->paginate(15);

// With appended query string
$users = DB::table('users')->paginate(15);
$users->appends(['sort' => 'name', 'order' => 'asc']);

// With fragment
$users = DB::table('users')->paginate(15)->fragment('users');
```

### Paginating Eloquent Results

```php
// Basic
$users = User::paginate(15);

// With constraints
$users = User::where('active', 1)->orderBy('name')->paginate(15);

// Simple pagination
$users = User::simplePaginate(15);

// Cursor pagination
$users = User::orderBy('id')->cursorPaginate(15);

// Per-page selection
$users = User::paginate($request->input('per_page', 15));
```

### Pagination Methods

```php
$users = User::paginate(15);

// Data
$users->items();        // Array of items
$users->data;           // Data key (for JSON)

// Metadata
$users->total();        // Total items
$users->perPage();      // Items per page
$users->currentPage();  // Current page number
$users->lastPage();     // Last page number
$users->firstItem();    // First item number on page
$users->lastItem();     // Last item number on page
$users->hasPages();     // Has more pages
$users->hasMorePages(); // Has next page
$users->onFirstPage();  // Is first page

// Links
$users->links();        // Render pagination links
$users->url($page);     // URL for specific page
$users->previousPageUrl();
$users->nextPageUrl();
$users->path();         // Base URL
```

### Cursor Pagination

```php
// Cursor pagination — most efficient for large datasets
$users = User::orderBy('id')->cursorPaginate(15);

// Cursor methods
$users->cursor();           // Current cursor
$users->nextCursor();       // Next cursor
$users->previousCursor();   // Previous cursor
$users->hasMorePages();     // Has more pages
```

### Customizing Pagination Views

```php
// Use custom view
$users->links('vendor.pagination.custom');

// Use Tailwind (default)
$users->links('pagination::tailwind');

// Use Bootstrap
$users->links('pagination::bootstrap-4');

// Use simple views
$users->links('pagination::simple-tailwind');
```

### JSON Pagination Response

```php
// Returns JSON with data, links, meta
return User::paginate(15);

// Response structure:
// {
//   "data": [...],
//   "links": { "first": "...", "last": "...", "prev": "...", "next": "..." },
//   "meta": { "current_page": 1, "last_page": 5, "per_page": 15, "total": 75 }
// }
```

### Custom Paginators

```php
// Create custom paginator
$paginator = new \Illuminate\Pagination\LengthAwarePaginator(
    $items, $total, $perPage, $currentPage
);

// Simple paginator
$paginator = new \Illuminate\Pagination\Paginator(
    $items, $perPage, $currentPage
);
```

## Seeding

### Creating Seeders

```bash
php artisan make:seeder UserSeeder
```

```php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);
    }
}
```

### Running Seeders

```bash
php artisan db:seed                    # Run all seeders
php artisan db:seed --class=UserSeeder # Run specific seeder
php artisan migrate:fresh --seed       # Fresh migrate + seed
```

### DatabaseSeeder

```php
namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            PostSeeder::class,
            CommentSeeder::class,
        ]);
    }
}
```

## Redis

### Configuration

```env
REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### Using Redis

```php
use Illuminate\Support\Facades\Redis;

// Basic commands
Redis::set('key', 'value', 'EX', 60); // Set with TTL
$value = Redis::get('key');
Redis::del('key');
Redis::exists('key');

// Increment
Redis::incr('counter');
Redis::incrby('counter', 5);
Redis::decr('counter');

// Lists
Redis::lpush('list', 'item');
Redis::rpush('list', 'item');
Redis::lpop('list');
Redis::lrange('list', 0, -1);

// Hashes
Redis::hset('hash', 'field', 'value');
Redis::hget('hash', 'field');
Redis::hgetall('hash');

// Sets
Redis::sadd('set', 'member');
Redis::smembers('set');

// Sorted sets
Redis::zadd('sorted', 1, 'member');
Redis::zrange('sorted', 0, -1, 'WITHSCORES');

// Pipeline
Redis::pipeline(function ($pipe) {
    for ($i = 0; $i < 100; $i++) {
        $pipe->set("key:$i", $i);
    }
});
```

## MongoDB

### Configuration

```env
MONGODB_CONNECTION=mongodb
MONGODB_HOST=127.0.0.1
MONGODB_PORT=27017
MONGODB_DATABASE=laravel
MONGODB_USERNAME=
MONGODB_PASSWORD=
```

```php
// config/database.php
'mongodb' => [
    'driver' => 'mongodb',
    'host' => env('MONGODB_HOST', '127.0.0.1'),
    'port' => env('MONGODB_PORT', 27017),
    'database' => env('MONGODB_DATABASE', 'laravel'),
    'username' => env('MONGODB_USERNAME'),
    'password' => env('MONGODB_PASSWORD'),
],
```

## Eloquent ORM

### Defining Models

```bash
php artisan make:model User
php artisan make:model User -m    # With migration
php artisan make:model User -mf   # With migration + factory
php artisan make:model User -mfs  # With migration, factory, seeder
php artisan make:model User -a    # All (migration, factory, seeder, controller)
```

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'users';           // Custom table name
    protected $primaryKey = 'id';         // Custom primary key
    public $incrementing = false;         // Non-incrementing key
    protected $keyType = 'string';        // String primary key
    public $timestamps = false;           // Disable timestamps
    protected $dateFormat = 'U';          // Unix timestamp format

    // Mass assignable attributes
    protected $fillable = ['name', 'email', 'password'];

    // Guarded attributes (inverse of fillable)
    protected $guarded = ['id'];

    // Hidden attributes (not in JSON output)
    protected $hidden = ['password', 'remember_token'];

    // Visible attributes (only these in JSON output)
    protected $visible = ['id', 'name', 'email'];

    // Appended attributes (computed accessors)
    protected $appends = ['is_admin'];

    // Casts
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'is_active' => 'boolean',
            'options' => 'array',
            'settings' => AsCollection::class,
            'tags' => AsArrayObject::class,
            'metadata' => AsEnumCollection::class.':'.UserStatus::class,
        ];
    }

    // Default attribute values
    protected $attributes = [
        'is_active' => true,
    ];
}
```

### UUID and ULID Keys

```php
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Concerns\HasUlids;

class User extends Model
{
    use HasUuids; // or HasUlids
}
```

### Retrieving Models

```php
// All records
$users = User::all();

// With specific columns
$users = User::select('name', 'email')->get();

// Find by primary key
$user = User::find(1);
$users = User::find([1, 2, 3]);

// Find or fail
$user = User::findOrFail(1);
$user = User::where('email', 'x@y.com')->firstOrFail();

// First
$user = User::where('active', 1)->first();

// Latest / oldest
$user = User::latest()->first();
$user = User::oldest()->first();

// Count
$count = User::where('active', 1)->count();

// Chunking
User::chunk(200, function ($users) {
    foreach ($users as $user) {
        // Process
    }
});

// Cursor (memory efficient)
foreach (User::cursor() as $user) {
    // Process
}

// Lazy collections
$users = User::lazy()->each(function ($user) {
    // Process
});
```

### Inserting and Updating

```php
// Create
$user = User::create(['name' => 'John', 'email' => 'john@example.com']);

// Create with relationships
$user = User::create([
    'name' => 'John',
    'email' => 'john@example.com',
    'profile' => ['bio' => 'Developer'],
]);

// Update
$user = User::find(1);
$user->name = 'Jane';
$user->save();

// Mass update
User::where('active', 0)->update(['active' => 1]);

// Update specific fields
$user->update(['name' => 'Jane']);

// Fill then save
$user->fill(['name' => 'Jane'])->save();

// Upsert
User::upsert([
    ['id' => 1, 'name' => 'John'],
    ['id' => 2, 'name' => 'Jane'],
], ['id'], ['name']);

// firstOrCreate
$user = User::firstOrCreate(['email' => 'x@y.com'], ['name' => 'John']);

// updateOrCreate
$user = User::updateOrCreate(['email' => 'x@y.com'], ['name' => 'Jane']);

// firstOrNew (doesn't save)
$user = User::firstOrNew(['email' => 'x@y.com'], ['name' => 'John']);
```

### Deleting Models

```php
// Delete single
$user = User::find(1);
$user->delete();

// Delete by query
User::where('active', 0)->delete();

// Destroy by ID
User::destroy(1);
User::destroy([1, 2, 3]);

// Truncate (reset auto-increment)
User::truncate();
```

### Soft Deleting

```php
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Model
{
    use SoftDeletes;
}
```

```bash
# Add soft delete column
php artisan make:migration add_deleted_at_to_users_table --table=users
```

```php
// Soft delete
$user->delete(); // Sets deleted_at

// Force delete (permanent)
$user->forceDelete();

// Restore
$user->restore();

// Query including soft deleted
$users = User::withTrashed()->get();

// Only soft deleted
$users = User::onlyTrashed()->get();

// Check if trashed
if ($user->trashed()) { }
```

### Pruning Models

```php
use Illuminate\Database\Eloquent\Prunable;

class User extends Model
{
    use Prunable;

    public function prunable(): Builder
    {
        return static::where('created_at', '<', now()->subYear());
    }
}
```

```bash
# Run pruning
php artisan model:prune

# Preview what would be pruned
php artisan model:prune --pretend
```

### Query Scopes

#### Global Scopes

```php
use Illuminate\Database\Eloquent\Builder;

class User extends Model
{
    protected static function booted(): void
    {
        static::addGlobalScope('active', function (Builder $builder) {
            $builder->where('active', 1);
        });
    }
}

// Remove global scope
$users = User::withoutGlobalScope('active')->get();
$users = User::withoutGlobalScopes()->get();
```

#### Local Scopes

```php
class User extends Model
{
    public function scopePopular(Builder $query): Builder
    {
        return $query->where('votes', '>', 100);
    }

    public function scopeOfType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }
}

// Usage
$users = User::popular()->get();
$users = User::popular()->ofType('admin')->get();
```

### Eloquent Events

```php
class User extends Model
{
    protected $dispatchesEvents = [
        'created' => UserCreated::class,
        'updated' => UserUpdated::class,
        'deleted' => UserDeleted::class,
    ];
}

// Using closures
User::creating(function (User $user) {
    $user->token = Str::random(60);
});

User::created(function (User $user) {
    // Send welcome email
});

// Muting events
User::withoutEvents(function () {
    $user = User::find(1);
    $user->name = 'Jane';
    $user->save();
});
```

### Observers

```bash
php artisan make:observer UserObserver --model=User
```

```php
namespace App\Observers;

use App\Models\User;

class UserObserver
{
    public function creating(User $user): void { /* ... */ }
    public function created(User $user): void { /* ... */ }
    public function updating(User $user): void { /* ... */ }
    public function updated(User $user): void { /* ... */ }
    public function saving(User $user): void { /* ... */ }
    public function saved(User $user): void { /* ... */ }
    public function deleting(User $user): void { /* ... */ }
    public function deleted(User $user): void { /* ... */ }
    public function restoring(User $user): void { /* ... */ }
    public function restored(User $user): void { /* ... */ }
    public function forceDeleting(User $user): void { /* ... */ }
    public function forceDeleted(User $user): void { /* ... */ }
}
```

```php
// Register observer (in AppServiceProvider::boot())
use App\Models\User;
use App\Observers\UserObserver;

User::observe(UserObserver::class);
```

## Best Practices

1. Use migrations for all schema changes — never modify schema manually
2. Use factories for test data generation
3. Use soft deletes for important data (users, orders, posts)
4. Use `fillable` or `guarded` to prevent mass assignment vulnerabilities
5. Use Eloquent casts for type casting (dates, booleans, JSON, enums)
6. Use query scopes for reusable query conditions
7. Use eager loading (`with()`) to prevent N+1 query problems
8. Use transactions for multi-step database operations
9. Use `chunk()` or `lazy()` for processing large datasets
10. Use `upsert()` for batch insert-or-update operations
