# Background Tasks Framework — Django 6.0

## Overview

Django 6.0 introduces a built-in background task framework for running asynchronous operations without external tools like Celery.

## Configuration

```python
# settings.py
TASKS = {
    "default": {
        "BACKEND": "django.tasks.backends.database.DatabaseBackend",
        "OPTIONS": {},
    }
}

# Add to INSTALLED_APPS
INSTALLED_APPS = [
    # ...
    "django.contrib.tasks",
]
```

## Defining Tasks

```python
from django.tasks import task

@task
def send_welcome_email(user_id):
    from django.contrib.auth.models import User
    user = User.objects.get(pk=user_id)
    send_mail(
        "Welcome!",
        f"Hello {user.first_name}, welcome to our site.",
        "noreply@example.com",
        [user.email],
    )

# Task with additional options
@task(queue="emails", priority=10)
def send_notification(user_id, message):
    # Send push notification, email, SMS, etc.
    pass
```

## Running Tasks

```python
# Enqueue a task (returns a TaskResult)
result = send_welcome_email(user_id=42)

# The task runs asynchronously
# result.status — "pending", "running", "complete", "failed"
# result.id — unique task ID

# Check status
print(result.status)

# Get result (if complete)
if result.status == "complete":
    print(result.result)
```

## Task Decorator Options

```python
@task(
    queue="default",           # Queue name
    priority=0,                # Priority (higher = more important)
    max_retries=3,             # Max retry attempts
    retry_delay=60,            # Delay between retries (seconds)
    timeout=300,               # Task timeout (seconds)
    unique=False,              # Prevent duplicate tasks
)
def my_task(data):
    pass
```

## Database Backend

The default `DatabaseBackend` stores task results in the database:

```bash
# Run migrations to create task tables
python manage.py migrate
```

### Running Workers

```bash
# Run a worker process
python manage.py runtasks

# Run with specific queue
python manage.py runtasks --queue=emails

# Run with concurrency
python manage.py runtasks --workers=4
```

## Task Results

```python
from django.tasks import get_task_result

# Get result by ID
result = get_task_result(result_id="abc123")
print(result.status)    # "complete", "failed", etc.
print(result.result)    # Return value (if complete)
print(result.error)     # Error message (if failed)
print(result.created_at)
print(result.started_at)
print(result.completed_at)
```

## Error Handling

```python
@task(max_retries=3, retry_delay=60)
def risky_task(data):
    try:
        # Potentially failing operation
        process(data)
    except Exception as e:
        # Task will be retried automatically
        raise

# Manual retry
@task
def manual_retry_task(data):
    result = do_something(data)
    if result.needs_retry:
        # Re-enqueue the task
        raise RetryTask(delay=120)
```

## Task Chains and Groups

```python
from django.tasks import group, chain

# Chain: run tasks sequentially
chain_result = chain(
    fetch_data.s(url="https://api.example.com"),
    process_data.s(),
    save_result.s(),
)

# Group: run tasks in parallel
group_result = group(
    send_email.s(user_id=1),
    send_email.s(user_id=2),
    send_email.s(user_id=3),
)
```

## Scheduled Tasks

```python
from django.tasks import schedule

# Run every 5 minutes
@task
def cleanup_expired_sessions():
    from django.contrib.sessions.models import Session
    Session.objects.filter(expire_date__lt=timezone.now()).delete()

schedule(cleanup_expired_sessions, interval=300)  # Every 5 minutes

# Cron-like scheduling
@task
def daily_report():
    generate_report()

schedule(daily_report, cron="0 9 * * *")  # Daily at 9 AM
```

## Monitoring

```python
from django.tasks import get_all_results

# Get all task results
results = get_all_results(status="failed", limit=100)
for result in results:
    print(f"{result.task_name}: {result.error}")

# Get results for specific task
results = get_all_results(task_name="send_welcome_email", status="complete")
```

## Comparison with Celery

| Feature | Django Tasks (6.0) | Celery |
|---------|-------------------|--------|
| Built-in | Yes | No (external) |
| Database backend | Yes | Yes (with django-celery-results) |
| Redis/RabbitMQ | Planned | Yes |
| Task chaining | Yes | Yes |
| Scheduled tasks | Yes | Yes (Celery Beat) |
| Web monitoring | No (use admin) | Yes (Flower) |
| Maturity | New | Mature |
| Complexity | Low | Medium-High |

## When to Use Django Tasks vs Celery

- **Django Tasks**: Simple background work, small-to-medium apps, no external dependencies
- **Celery**: High throughput, complex workflows, distributed across machines, mature ecosystem
