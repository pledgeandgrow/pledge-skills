# Active Job — Background Jobs, Queuing, Execution

## What is Active Job?

Active Job is a framework for declaring jobs and making them run on a variety of queuing backends. It provides a consistent API regardless of the queue adapter.

## Creating a Job

```bash
$ bin/rails generate job CleanupGuests
$ bin/rails generate job process_photo source_id:integer
```

```ruby
class CleanupGuestsJob < ApplicationJob
  queue_as :default

  def perform(*args)
    Guest.where("created_at < ?", 1.week.ago).destroy_all
  end
end
```

## Enqueuing Jobs

```ruby
# Enqueue for immediate processing
CleanupGuestsJob.perform_later

# With arguments
ProcessPhotoJob.perform_later(photo.id)

# Enqueue with wait
CleanupGuestsJob.set(wait: 1.hour).perform_later

# Enqueue for specific time
CleanupGuestsJob.set(wait_until: Date.tomorrow.noon).perform_later

# Set queue
CleanupGuestsJob.set(queue: :low_priority).perform_later

# Set priority (adapter-dependent)
CleanupGuestsJob.set(priority: 10).perform_later
```

## Queue Adapters

Rails 8 defaults to **Solid Queue** (database-backed). Other adapters:

| Adapter | Config Value |
|---------|-------------|
| Solid Queue (Rails 8 default) | `:solid_queue` |
| Sidekiq | `:sidekiq` |
| Resque | `:resque` |
| Delayed Job | `:delayed_job` |
| Sneakers | `:sneakers` |
| Inline (synchronous) | `:inline` |
| Async (in-process) | `:async` |
| Test | `:test` |

```ruby
# config/environments/production.rb
config.active_job.queue_adapter = :solid_queue
```

## Queue Configuration

```ruby
class ApplicationJob < ActiveJob::Base
  queue_as :default  # default queue
end

class ProcessPhotoJob < ApplicationJob
  queue_as :high_priority
end

# Global default
config.active_job.queue_name = :default
```

## Job Arguments

```ruby
class ExportJob < ApplicationJob
  def perform(user, options = {})
    # user is serialized/deserialized automatically
    # Supported types: String, Integer, Float, NilClass, TrueClass, FalseClass,
    #   Symbol, Array, Hash, Date, Time, DateTime, ActiveSupport::TimeWithZone,
    #   Active Record models (by reference via GlobalID)
  end
end

ExportJob.perform_later(current_user, format: "csv")
```

### GlobalID

Active Record models are serialized as GlobalID references:

```ruby
class NotifyJob < ApplicationJob
  def perform(user)
    user.notify!
  end
end

NotifyJob.perform_later(User.find(42))
# User is found by GlobalID when job runs
```

### Serializing Custom Objects

```ruby
class Product
  include GlobalID::Identification

  def self.find(id)
    # custom lookup
  end
end
```

## Callbacks

```ruby
class ProcessUploadJob < ApplicationJob
  before_perform :log_start
  after_perform :log_complete
  around_perform :benchmark
  before_enqueue :check_queue

  def perform(upload)
    # process
  end

  private

  def log_start
    Rails.logger.info("Starting job #{self.class.name}")
  end

  def log_complete
    Rails.logger.info("Completed job #{self.class.name}")
  end

  def benchmark
    start = Time.current
    yield
    Rails.logger.info("Job took #{Time.current - start}s")
  end
end
```

## Exceptions and Retries

```ruby
class ProcessPhotoJob < ApplicationJob
  retry_on ActiveRecord::RecordNotFound, wait: 5.seconds, attempts: 3
  retry_on StandardError, wait: :exponentially_longer, attempts: 5
  retry_on Timeout::Error, wait: 30.seconds, attempts: 3

  discard_on ActiveJob::DeserializationError
  discard_on CustomNonRetryableError

  def perform(photo)
    photo.process!
  end
end
```

### Custom Retry Logic

```ruby
class ProcessPhotoJob < ApplicationJob
  retry_on SomeError, wait: ->(executions) { executions * 10.seconds }, attempts: 5

  rescue_from(StandardError) do |exception|
    # Custom error handling
    Bugsnag.notify(exception)
    raise exception  # re-raise to trigger retry
  end
end
```

## Job Priority and Concurrency

```ruby
# In the job class
class HighPriorityJob < ApplicationJob
  queue_with_priority 1  # lower = higher priority
end

# Using Proc
class DynamicPriorityJob < ApplicationJob
  queue_with_priority -> { user.priority_level }
end
```

## Batches (Rails 7.1+)

```ruby
class BulkEmailJob < ApplicationJob
  def perform(users)
    users.each do |user|
      NotificationJob.perform_later(user)
    end
  end
end
```

## Testing Jobs

```ruby
require "test_helper"

class CleanupGuestsJobTest < ActiveJob::TestCase
  test "removes old guests" do
    assert_difference "Guest.count", -3 do
      CleanupGuestsJob.perform_now
    end
  end
end
```

### Test Helpers

```ruby
# Assert enqueued
assert_enqueued_with(job: MyJob, args: [1, 2])
assert_enqueued_jobs(3)

# Assert performed
assert_performed_with(job: MyJob)
assert_performed_jobs(3)

# In test environment, jobs are not actually run unless you:
perform_enqueued_jobs do
  MyJob.perform_later
end

# Flush jobs
perform_enqueued_jobs(only: MyJob)
```

## Running the Queue Worker

### Solid Queue (Rails 8 default)

```bash
$ bin/jobs start
# or
$ bundle exec rake solid_queue:start
```

### Sidekiq

```bash
$ bundle exec sidekiq
```

## Configuration

```ruby
# config/environments/production.rb
config.active_job.queue_adapter = :solid_queue
config.active_job.queue_name = :default
config.active_job.queue_name_prefix = "my_app_#{Rails.env}"
```

## Solid Queue (Rails 8)

Solid Queue is the default queue adapter in Rails 8. It's database-backed, replacing Redis:

```ruby
# config/environments/production.rb
config.active_job.queue_adapter = :solid_queue
```

Features:
- Database-backed queues (PostgreSQL, MySQL, SQLite)
- Supports delayed jobs, priorities, concurrency controls
- No external dependencies (no Redis required)
- Web dashboard available

### Concurrency Controls

```ruby
class ProcessPaymentJob < ApplicationJob
  limits_by concurrency: 5  # max 5 concurrent jobs of this type

  def perform(payment)
    payment.process!
  end
end
```
