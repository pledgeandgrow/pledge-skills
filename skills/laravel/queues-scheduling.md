# Queues, Task Scheduling, and Background Jobs

Job queues, task scheduling, concurrency, and processes.

## Queues

### Configuration

```env
QUEUE_CONNECTION=database
# Or: sync, redis, sqs, beanstalkd
```

```php
// config/queue.php
'connections' => [
    'database' => [
        'driver' => 'database',
        'table' => 'jobs',
        'queue' => 'default',
        'retry_after' => 90,
        'after_commit' => true,
    ],
    'redis' => [
        'driver' => 'redis',
        'connection' => 'default',
        'queue' => 'default',
        'retry_after' => 90,
        'block_for' => null,
    ],
    'sqs' => [
        'driver' => 'sqs',
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'prefix' => env('SQS_PREFIX'),
        'queue' => env('SQS_QUEUE', 'default'),
        'suffix' => env('SQS_SUFFIX'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],
],
```

### Creating Jobs

```bash
php artisan make:job ProcessPodcast
```

```php
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessPodcast implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Podcast $podcast,
    ) {}

    public function handle(): void
    {
        // Process the podcast
        $this->podcast->process();
    }

    // Queue name
    public $queue = 'podcasts';

    // Connection
    public $connection = 'redis';

    // Delay
    public $delay = 60;

    // Max attempts
    public $tries = 3;

    // Timeout
    public $timeout = 120;

    // Backoff
    public $backoff = [10, 30, 60];

    // Unique job
    public $uniqueFor = 3600; // Lock for 1 hour
    public function uniqueId(): string
    {
        return $this->podcast->id;
    }
}
```

### Dispatching Jobs

```php
use App\Jobs\ProcessPodcast;

// Basic dispatch
ProcessPodcast::dispatch($podcast);

// Delayed dispatch
ProcessPodcast::dispatch($podcast)->delay(now()->addMinutes(10));

// On specific queue
ProcessPodcast::dispatch($podcast)->onQueue('podcasts');

// On specific connection
ProcessPodcast::dispatch($podcast)->onConnection('redis');

// Synchronous
ProcessPodcast::dispatchSync($podcast);

// Bulk dispatch
ProcessPodcast::dispatch([
    $podcast1, $podcast2, $podcast3,
]);

// After response
ProcessPodcast::dispatch($podcast)->afterResponse();

// Conditionally
ProcessPodcast::dispatchIf($condition, $podcast);
ProcessPodcast::dispatchUnless($condition, $podcast);
```

### Job Chaining

```php
use App\Jobs\ProcessPodcast;
use App\Jobs\ReleasePodcast;
use App\Jobs\NotifyUsers;

// Chain jobs — run sequentially, stop on failure
ProcessPodcast::withChain([
    new ReleasePodcast($podcast),
    new NotifyUsers($podcast),
])->dispatch();

// Using Bus facade
use Illuminate\Support\Facades\Bus;

Bus::chain([
    new ProcessPodcast($podcast),
    new ReleasePodcast($podcast),
    new NotifyUsers($podcast),
])->dispatch();

// Chain with delay and connection
Bus::chain([...])
    ->delay(now()->addMinutes(10))
    ->onConnection('redis')
    ->onQueue('podcasts')
    ->dispatch();

// Catch chain failures
Bus::chain([...])
    ->catch(function (ChainFailed $e) {
        // Handle chain failure
    })
    ->dispatch();
```

### Job Batching

```bash
php artisan make:job ImportContacts
php artisan migrate # Creates job_batches table
```

```php
use Illuminate\Bus\Batch;
use Illuminate\Support\Facades\Bus;
use Throwable;

$batch = Bus::batch([
    new ImportContacts(1, 100),
    new ImportContacts(101, 200),
    new ImportContacts(201, 300),
])
    ->then(function (Batch $batch) {
        // All jobs completed successfully
    })
    ->catch(function (Batch $batch, Throwable $e) {
        // First batch failure detected
    })
    ->finally(function (Batch $batch) {
        // The batch has finished executing
    })
    ->name('Contact Import')
    ->onConnection('redis')
    ->dispatch();

// Batch ID
$batchId = $batch->id;

// Inspect batch
$batch = Bus::findBatch($batchId);
$batch->progress();      // Percentage 0-100
$batch->processedJobs(); // Number processed
$batch->failedJobs();    // Number failed
$batch->isFinished();
$batch->isCancelled();

// Cancel batch
$batch->cancel();

// Add jobs to batch
$batch->add([new ImportContacts(301, 400)]);
```

### Job Middleware

```php
// Rate limiting
RateLimited::using('podcasts');

// Preventing overlaps
ShouldBeUnique;

// Throttling exceptions
ThrottlesExceptions::withBackoff(5);

// Custom middleware
class RateLimitedJob
{
    public function handle($job, $next): void
    {
        // Before job
        $next($job);
        // After job
    }
}
```

### Running the Queue Worker

```bash
# Start worker
php artisan queue:work

# Process one job and exit
php artisan queue:work --stop-when-empty

# Process jobs on specific queue
php artisan queue:work --queue=podcasts,default

# With timeout
php artisan queue:work --timeout=60

# With memory limit
php artisan queue:work --memory=128

# Max attempts
php artisan queue:work --max-jobs=1000

# Rest
php artisan queue:work --rest=5

# Daemon mode (deprecated, use queue:work)
php artisan queue:listen

# Restart all workers
php artisan queue:restart
```

### Supervisor Configuration

```ini
// /etc/supervisor/conf.d/laravel-worker.conf
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/my-app/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=8
redirect_stderr=true
stdout_logfile=/var/www/my-app/storage/logs/worker.log
stopwaitsecs=3600
```

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start laravel-worker:*
```

### Dealing With Failed Jobs

```bash
# View failed jobs
php artisan queue:failed

# Retry a failed job
php artisan queue:retry <job-id>

# Retry all failed jobs
php artisan queue:retry all

# Retry with new tags
php artisan queue:retry --queue=podcasts

# Delete failed job
php artisan queue:forget <job-id>

# Flush all failed jobs
php artisan queue:flush
```

### Testing Jobs

```php
use Illuminate\Support\Facades\Queue;
use App\Jobs\ProcessPodcast;

public function test_job_dispatched(): void
{
    Queue::fake();

    // Perform action
    ProcessPodcast::dispatch($podcast);

    // Assert dispatched
    Queue::assertPushed(ProcessPodcast::class);
    Queue::assertPushed(ProcessPodcast::class, function ($job) use ($podcast) {
        return $job->podcast->id === $podcast->id;
    });

    // Assert not pushed
    Queue::assertNotPushed(AnotherJob::class);

    // Assert pushed on queue
    Queue::assertPushedOn('podcasts', ProcessPodcast::class);

    // Assert pushed count
    Queue::assertPushed(ProcessPodcast::class, 2);

    // Assert chain
    Queue::assertPushedWithChain(ProcessPodcast::class, [
        ReleasePodcast::class,
        NotifyUsers::class,
    ]);
}
```

## Task Scheduling

### Defining Schedules

```php
// In routes/console.php or bootstrap/app.php
use Illuminate\Support\Facades\Schedule;

Schedule::command('emails:send --force')->daily();
Schedule->job(new Heartbeat)->everyFiveMinutes();
Schedule->exec('node /home/user/build.js')->daily();

// Artisan command
Schedule::command('reports:daily')->dailyAt('08:00');

// Queued job
Schedule::job(new GenerateReport)->dailyAt('08:00')->onQueue('reports');

// Shell command
Schedule::exec('node /home/user/build.js')->daily();
```

### Schedule Frequency Options

```php
->everySecond();            // Every second (sub-minute)
->everyTwoSeconds();
->everyFiveSeconds();
->everyTenSeconds();
->everyFifteenSeconds();
->everyThirtySeconds();
->everyMinute();
->everyTwoMinutes();
->everyFiveMinutes();
->everyTenMinutes();
->everyFifteenMinutes();
->everyThirtyMinutes();
->hourly();
->hourlyAt(17);             // At :17 each hour
->everyOddHour();
->daily();
->dailyAt('13:00');
->twiceDaily(1, 13);
->twiceDailyAt(1, 13, 15);
->weekly();
->weeklyOn(1, '8:00');      // Monday at 8:00
->monthly();
->monthlyOn(4, '15:00');
->twiceMonthly(1, 16, '13:00');
->lastDayOfMonth('15:00');
->quarterly();
->yearly();
->yearlyOn(6, 1, '17:00');
->cron('* * * * *');         // Custom cron expression
->between('8:00', '17:00'); // Between times
->unlessBetween('22:00', '6:00');
->weekdays();
->weekends();
->sundays();
->mondays();
->tuesdays();
->wednesdays();
->thursdays();
->fridays();
->saturdays();
```

### Additional Options

```php
// Timezone
Schedule::command('report')->dailyAt('08:00')->timezone('America/New_York');

// Prevent overlapping
Schedule::command('report')->daily()->withoutOverlapping();

// Run on one server
Schedule::command('report')->daily()->onOneServer();

// Maintenance mode
Schedule::command('report')->daily()->evenInMaintenanceMode();

// Background tasks
Schedule::command('report')->daily()->runInBackground();

// Output to file
Schedule::command('report')->daily()->appendOutputTo('/path/to/log');

// Send output to email
Schedule::command('report')->daily()->emailOutputTo('admin@example.com');

// Task hooks
Schedule::command('report')
    ->daily()
    ->onSuccess(function () { /* ... */ })
    ->onFailure(function () { /* ... */ })
    ->before(function () { /* ... */ })
    ->after(function () { /* ... */ });
```

### Running the Scheduler

```bash
# Add to crontab
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1

# Run locally
php artisan schedule:work

# List scheduled tasks
php artisan schedule:list

# Test a scheduled command
php artisan schedule:test
```

## Concurrency

### Running Tasks Concurrently

```php
use Illuminate\Support\Facades\Concurrency;

// Run tasks concurrently
$result = Concurrency::run([
    fn () => Service::makeApiCall(),
    fn () => Service::makeAnotherCall(),
    fn () => Service::makeThirdCall(),
]);

// Driver configuration
'concurrency' => [
    'driver' => 'process', // or 'async'
],
```

## Context

### Storing Context

```php
use Illuminate\Support\Facades\Context;

// Add context
Context::add('user_id', $user->id);
Context::add(['order_id' => $order->id, 'source' => 'web']);

// Retrieve context
$userId = Context::get('user_id');
$all = Context::all();

// Check if exists
Context::has('user_id');

// Hidden context (not serialized to jobs)
Context::addHidden('internal_key', 'value');

// Retrieve hidden
Context::getHidden('internal_key');
```

Context is automatically shared with queued jobs and is serialized/deserialized across the queue boundary.

## Processes

### Running Processes

```php
use Illuminate\Support\Facades\Process;

// Run a process
$result = Process::run('ls -la');
echo $result->output();
echo $result->errorOutput();
echo $result->exitCode();

// Run with input
$result = Process::input('hello')->run('cat');

// Foreground process
Process::forever()->run('tail -f /var/log/app.log', function ($type, $buffer) {
    echo $buffer;
});

// Build process
$result = Process::path(__DIR__)->run('npm run build');

// Process pool
$result = Process::pool(function ($pool) {
    $pool->command('cat file1.txt');
    $pool->command('cat file2.txt');
})->start();

// Process with timeout
Process::timeout(60)->run('long-running-command');
```

## Best Practices

1. Use queues for slow operations (emails, API calls, file processing)
2. Use `ShouldBeUnique` to prevent duplicate jobs
3. Use job batching for parallel processing of large datasets
4. Use job chains for sequential dependent operations
5. Use Supervisor to keep queue workers running
6. Use `withoutOverlapping()` for scheduled tasks that shouldn't run concurrently
7. Use `onOneServer()` for distributed scheduled tasks
8. Use `Queue::fake()` in tests to verify job dispatching
9. Use context to share state across queued jobs
10. Use `after_commit` to dispatch jobs only after database transaction commits
