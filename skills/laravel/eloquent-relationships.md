# Eloquent Relationships, Collections, and Resources

Eloquent relationships, collections, mutators/casts, API resources, serialization, and factories.

## Eloquent Relationships

### One to One (Has One)

```php
class User extends Model
{
    public function phone(): HasOne
    {
        return $this->hasOne(Phone::class);
    }

    // With foreign key
    public function phone(): HasOne
    {
        return $this->hasOne(Phone::class, 'user_id');
    }

    // Of many
    public function latestOrder(): HasOne
    {
        return $this->hasOne(Order::class)->latestOfMany();
    }

    public function oldestOrder(): HasOne
    {
        return $this->hasOne(Order::class)->oldestOfMany();
    }
}

// Usage
$phone = $user->phone;
$phone = $user->phone()->where('active', 1)->first();
```

### Has One Through

```php
class Mechanic extends Model
{
    public function carOwner(): HasOneThrough
    {
        return $this->hasOneThrough(Owner::class, Car::class);
    }
}
```

### One to Many (Has Many)

```php
class Post extends Model
{
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}

// Usage
$comments = $post->comments;
$comments = $post->comments()->where('approved', 1)->get();
$comment = $post->comments()->firstOrCreate(['body' => 'New comment']);
```

### Has Many Through

```php
class Project extends Model
{
    public function deployments(): HasManyThrough
    {
        return $this->hasManyThrough(Deployment::class, Environment::class);
    }
}
```

### Many to Many (Belongs to Many)

```php
class User extends Model
{
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    // With pivot data
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class)->withPivot('expires_at');
    }

    // With timestamps
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class)->withTimestamps();
    }

    // Filtering by pivot
    public function activeRoles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class)->wherePivot('active', 1);
    }
}

// Usage
$roles = $user->roles;
$role = $user->roles()->where('name', 'admin')->first();

// Attach / detach
$user->roles()->attach($roleId);
$user->roles()->attach($roleId, ['expires_at' => now()->addYear()]);
$user->roles()->detach($roleId);
$user->roles()->detach(); // All

// Sync
$user->roles()->sync([1, 2, 3]);
$user->roles()->syncWithoutDetaching([1, 2, 3]);
$user->roles()->toggle([1, 2, 3]);

// Update pivot
$user->roles()->updateExistingPivot($roleId, ['expires_at' => now()]);

// Pivot attribute
foreach ($user->roles as $role) {
    echo $role->pivot->expires_at;
}
```

### One to Many (Inverse) / Belongs To

```php
class Comment extends Model
{
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    // With custom foreign key
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class, 'post_id');
    }

    // With default
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->withDefault([
            'name' => 'Guest',
        ]);
    }
}

// Usage
$post = $comment->post;
```

### Has One of Many

```php
class User extends Model
{
    public function latestOrder(): HasOne
    {
        return $this->hasOne(Order::class)->latestOfMany();
    }

    public function oldestOrder(): HasOne
    {
        return $this->hasOne(Order::class)->oldestOfMany();
    }

    // Custom
    public function highestOrder(): HasOne
    {
        return $this->hasOne(Order::class)->ofMany('total', 'max');
    }
}
```

### Polymorphic Relationships

#### One to One (Polymorphic)

```php
class Post extends Model
{
    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable');
    }
}

class User extends Model
{
    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable');
    }
}

class Image extends Model
{
    public function imageable(): MorphTo
    {
        return $this->morphTo();
    }
}

// Usage
$post->image;
$image->imageable; // Returns Post or User
```

#### One to Many (Polymorphic)

```php
class Post extends Model
{
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}

class Video extends Model
{
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}

class Comment extends Model
{
    public function commentable(): MorphTo
    {
        return $this->morphTo();
    }
}

// Usage
$post->comments;
$post->comments()->create(['body' => 'Great post!']);
```

#### Many to Many (Polymorphic)

```php
class Post extends Model
{
    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }
}

class Tag extends Model
{
    public function posts(): MorphedByMany
    {
        return $this->morphedByMany(Post::class, 'taggable');
    }
}
```

### Querying Relationships

```php
// Relationship methods vs dynamic properties
$comments = $post->comments(); // Returns query builder
$comments = $post->comments;   // Returns collection (loads from DB)

// Querying relationship existence
$users = User::has('posts')->get();
$users = User::has('posts', '>=', 3)->get();
$users = User::whereHas('posts', function ($query) {
    $query->where('published', 1);
})->get();

// Querying relationship absence
$users = User::doesntHave('posts')->get();
$users = User::whereDoesntHave('posts', function ($query) {
    $query->where('draft', 1);
})->get();

// Querying morph to relationships
use Illuminate\Database\Eloquent\Builder;
$comments = Comment::whereHasMorph('commentable', [Post::class, Video::class], function (Builder $query) {
    $query->where('title', 'like', '%laravel%');
})->get();
```

### Aggregating Related Models

```php
// Count
$users = User::withCount('posts')->get();
$users = User::withCount(['posts', 'comments as comments_count'])->get();

// With conditions
$users = User::withCount(['posts' => function ($query) {
    $query->where('published', 1);
}])->get();

// Other aggregates
$users = User::withMax('posts', 'views')->get();
$users = User::withMin('posts', 'views')->get();
$users = User::withSum('posts', 'views')->get();
$users = User::withAvg('posts', 'views')->get();
```

### Eager Loading

```php
// Eager load
$books = Book::with('author')->get();
$books = Book::with('author', 'publisher')->get();

// Nested eager loading
$books = Book::with('author.contacts')->get();

// Constrained eager loading
$users = User::with(['posts' => function ($query) {
    $query->where('published', 1)->orderBy('created_at', 'desc');
}])->get();

// Lazy eager loading (after the fact)
$books = Book::get();
$books->load('author', 'publisher');

// Prevent lazy loading (prevent N+1)
Model::preventLazyLoading();

// Automatic eager loading via model
class Book extends Model
{
    protected $with = ['author', 'publisher'];
}
```

### Inserting and Updating Related Models

```php
// Save
$post = new Post(['title' => 'New Post']);
$user->posts()->save($post);

// Save many
$user->posts()->saveMany([
    new Post(['title' => 'Post 1']),
    new Post(['title' => 'Post 2']),
]);

// Create
$post = $user->posts()->create(['title' => 'New Post']);

// Belongs to (associate)
$comment->post()->associate($post);
$comment->save();
$comment->post()->dissociate();
$comment->save();

// Many to many
$user->roles()->attach($roleId);
$user->roles()->sync([1, 2, 3]);
```

### Touching Parent Timestamps

```php
class Comment extends Model
{
    protected $touches = ['post'];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
```

## Eloquent Collections

### Available Methods

```php
$users = User::where('active', 1)->get();

// Find
$user = $users->find(1);
$user = $users->first();
$user = $users->last();

// Filtering
$active = $users->filter(function ($user) {
    return $user->is_active;
});
$inactive = $users->reject(function ($user) {
    return $user->is_active;
});

// Transforming
$names = $users->map(function ($user) {
    return $user->name;
});
$emails = $users->pluck('email');

// Aggregates
$count = $users->count();
$sum = $users->sum('votes');
$max = $users->max('votes');
$min = $users->min('votes');
$avg = $users->avg('votes');

// Sorting
$sorted = $users->sortBy('name');
$sorted = $users->sortByDesc('name');
$sorted = $users->sortBy('name', SORT_NATURAL);

// Grouping
$grouped = $users->groupBy('role');

// Chunking
$chunks = $users->chunk(10);

// Diff / intersect
$diff = $users->diff($otherUsers);
$intersect = $users->intersect($otherUsers);

// Add / remove
$users->add($newUser);
$users->forget(0);

// Contains
if ($users->contains(1)) { } // By ID
if ($users->contains('name', 'John')) { }

// Load relationships
$users->load('posts', 'comments');
$users->loadCount('posts');
```

### Custom Collections

```php
class User extends Model
{
    public function newCollection(array $models = []): UserCollection
    {
        return new UserCollection($models);
    }
}

class UserCollection extends Collection
{
    public function active(): static
    {
        return $this->filter(fn ($user) => $user->is_active);
    }
}
```

## Mutators and Casts

### Accessors and Mutators

```php
class User extends Model
{
    // Accessor
    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => ucfirst($value),
        );
    }

    // Mutator
    protected function name(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) => strtolower($value),
        );
    }

    // Both
    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => ucfirst($value),
            set: fn (string $value) => strtolower($value),
        );
    }
}
```

### Casts

```php
class User extends Model
{
    protected function casts(): array
    {
        return [
            'is_admin' => 'boolean',
            'email_verified_at' => 'datetime',
            'options' => 'array',
            'settings' => AsCollection::class,
            'tags' => AsArrayObject::class,
            'status' => UserStatus::class, // Enum cast
            'roles' => AsEnumCollection::class.':'.Role::class,
            'birthday' => 'date:Y-m-d',
            'created_at' => 'datetime:Y-m-d H:i',
            'price' => 'decimal:2',
        ];
    }
}
```

### Custom Casts

```php
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class JsonCast implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        return json_decode($value, true);
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        return json_encode($value);
    }
}

// Usage
protected function casts(): array
{
    return [
        'config' => JsonCast::class,
    ];
}
```

## API Resources

### Generating Resources

```bash
php artisan make:resource UserResource
php artisan make:resource UserCollection
```

### Resource Classes

```php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'created_at' => $this->created_at->toISOString(),
            'posts' => PostResource::collection($this->whenLoaded('posts')),
            'role' => $this->when($this->role, $this->role->name),
            'links' => [
                'self' => route('users.show', $this->id),
            ],
        ];
    }

    public function with(Request $request): array
    {
        return [
            'meta' => [
                'version' => '1.0',
            ],
        ];
    }
}
```

### Using Resources

```php
// Single resource
return new UserResource($user);

// Collection
return UserResource::collection($users);

// With additional data
return UserResource::collection($users)->additional([
    'meta' => ['total' => $users->total()],
]);

// In controller
public function show(User $user): UserResource
{
    return new UserResource($user);
}

public function index(): AnonymousResourceCollection
{
    return UserResource::collection(User::paginate());
}
```

### Resource Responses

```php
return (new UserResource($user))
    ->response()
    ->header('X-Total-Count', 100);
```

## Serialization

### Serializing to Array

```php
$user = User::find(1);
$array = $user->toArray();
```

### Serializing to JSON

```php
$json = $user->toJson();
$json = $user->toJson(JSON_PRETTY_PRINT);
```

### Hiding Attributes

```php
class User extends Model
{
    protected $hidden = ['password', 'remember_token'];

    // Or visible (whitelist)
    protected $visible = ['id', 'name', 'email'];
}
```

### Appending Values

```php
class User extends Model
{
    protected $appends = ['is_admin'];

    protected function isAdmin(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->role === 'admin',
        );
    }
}
```

### Date Serialization

```php
// Global date format
protected $dateFormat = 'Y-m-d H:i:s';

// Per-cast date format
protected function casts(): array
{
    return [
        'birthday' => 'date:Y-m-d',
        'created_at' => 'datetime:Y-m-d H:i',
    ];
}
```

## Factories

### Generating Factories

```bash
php artisan make:factory UserFactory --model=User
```

### Factory Definition

```php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => bcrypt('password'),
            'remember_token' => Str::random(10),
        ];
    }

    // States
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
        ]);
    }
}
```

### Using Factories

```php
// Single model
$user = User::factory()->create();
$user = User::factory()->create(['name' => 'John']);
$user = User::factory()->unverified()->create();

// Multiple
$users = User::factory()->count(10)->create();

// Make (don't persist)
$user = User::factory()->make();

// With relationships
$user = User::factory()
    ->has(Post::factory()->count(3))
    ->create();

// Belongs to
$post = Post::factory()
    ->for(User::factory()->admin())
    ->create();

// Multiple with sequence
$users = User::factory()->count(3)->sequence(
    ['name' => 'John'],
    ['name' => 'Jane'],
    ['name' => 'Bob'],
)->create();
```

## Best Practices

1. Use eager loading (`with()`) to prevent N+1 queries
2. Use `withCount()` instead of loading relationships just to count
3. Define relationships with proper return types (HasOne, HasMany, etc.)
4. Use API resources for consistent JSON API responses
5. Use factories with states for different test scenarios
6. Use `whenLoaded()` to conditionally include relationships in resources
7. Use custom casts for complex attribute transformations
8. Use `preventLazyLoading()` in development to catch N+1 issues
9. Use `load()` for conditional eager loading after initial query
10. Use `touches` to automatically update parent timestamps
