# Custom Management Commands — Django 6.0

## Creating a Custom Command

```python
# myapp/management/commands/greet.py
from django.core.management.base import BaseCommand
from myapp.models import User

class Command(BaseCommand):
    help = "Greets a user by ID"

    def add_arguments(self, parser):
        parser.add_argument("user_id", type=int, help="User ID to greet")
        parser.add_argument("--loud", action="store_true", help="Use uppercase")

    def handle(self, *args, **options):
        user_id = options["user_id"]
        loud = options["loud"]
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            self.stderr.write(self.style.ERROR(f"User {user_id} not found"))
            return
        greeting = f"Hello, {user.first_name}!"
        if loud:
            greeting = greeting.upper()
        self.stdout.write(self.style.SUCCESS(greeting))
```

```bash
python manage.py greet 1
python manage.py greet 1 --loud
python manage.py help greet
```

## Command Structure

```
myapp/
    management/
        __init__.py
        commands/
            __init__.py
            greet.py        # Command name = filename
            cleanup.py
            sync_data.py
```

## BaseCommand Attributes

```python
class Command(BaseCommand):
    help = "Short description shown in help output"
    requires_migrations_check = False  # Warn if migrations are out of sync
    requires_system_checks = "__all__"  # or list of tags, or [] to skip
    stealth_options = ("--dry-run",)  # Hidden from help output
    suppressed_base_arguments = {"--verbosity"}  # Hide from help
```

## BaseCommand Methods

```python
class Command(BaseCommand):
    def add_arguments(self, parser):
        """Add command-line arguments."""
        # Positional argument
        parser.add_argument("name", type=str)

        # Optional flag
        parser.add_argument("--force", action="store_true", default=False)

        # Optional with value
        parser.add_argument("--limit", type=int, default=100)

        # Multiple values
        parser.add_argument("--ids", nargs="+", type=int)

        # Choice
        parser.add_argument("--mode", choices=["fast", "slow"], default="fast")

    def handle(self, *args, **options):
        """Main command logic."""
        name = options["name"]
        force = options["force"]
        limit = options["limit"]

        # Output
        self.stdout.write("Processing...")
        self.stdout.write(self.style.SUCCESS("Done!"))
        self.stderr.write(self.style.ERROR("Error!"))

        # Verbosity
        if options["verbosity"] >= 2:
            self.stdout.write("Verbose output")

    def get_version(self):
        """Return command version."""
        return "1.0.0"
```

## Styled Output

```python
class Command(BaseCommand):
    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Success message"))
        self.stdout.write(self.style.ERROR("Error message"))
        self.stdout.write(self.style.WARNING("Warning message"))
        self.stdout.write(self.style.NOTICE("Notice message"))
        self.stdout.write(self.style.HTTP_INFO("HTTP info"))
        self.stdout.write(self.style.HTTP_SUCCESS("HTTP success"))
        self.stdout.write(self.style.HTTP_ERROR("HTTP error"))
        self.stdout.write(self.style.HTTP_REDIRECT("HTTP redirect"))
        self.stdout.write(self.style.MIGRATE_HEADING("Migration heading"))
        self.stdout.write(self.style.MIGRATE_SUCCESS("Migration success"))
        self.stdout.write(self.style.SQL_FIELD("SQL field"))
        self.stdout.write(self.style.SQL_KEYWORD("SQL keyword"))
        self.stdout.write(self.style.SQL_TABLE("SQL table"))
```

## Practical Examples

### Data Cleanup Command

```python
class Command(BaseCommand):
    help = "Delete old inactive accounts"

    def add_arguments(self, parser):
        parser.add_argument("--days", type=int, default=365, help="Days of inactivity")
        parser.add_argument("--dry-run", action="store_true", help="Don't actually delete")

    def handle(self, *args, **options):
        days = options["days"]
        dry_run = options["dry_run"]
        cutoff = timezone.now() - timedelta(days=days)

        users = User.objects.filter(last_login__lt=cutoff, is_active=False)
        count = users.count()

        if dry_run:
            self.stdout.write(f"Would delete {count} users (dry run)")
            for user in users[:10]:
                self.stdout.write(f"  - {user.email}")
            return

        deleted = users.delete()
        self.stdout.write(self.style.SUCCESS(f"Deleted {count} users"))
```

### Import Data Command

```python
import csv

class Command(BaseCommand):
    help = "Import products from CSV file"

    def add_arguments(self, parser):
        parser.add_argument("file_path", type=str, help="Path to CSV file")
        parser.add_argument("--delimiter", type=str, default=",")

    def handle(self, *args, **options):
        file_path = options["file_path"]
        delimiter = options["delimiter"]

        created = 0
        updated = 0
        with open(file_path, newline="") as csvfile:
            reader = csv.DictReader(csvfile, delimiter=delimiter)
            for row in reader:
                obj, created_flag = Product.objects.update_or_create(
                    sku=row["sku"],
                    defaults={
                        "name": row["name"],
                        "price": row["price"],
                    },
                )
                if created_flag:
                    created += 1
                else:
                    updated += 1

        self.stdout.write(self.style.SUCCESS(
            f"Import complete: {created} created, {updated} updated"
        ))
```

### Scheduled Task Command

```python
class Command(BaseCommand):
    help = "Send daily digest emails"

    def handle(self, *args, **options):
        from django.core.mail import send_mass_mail
        from myapp.models import User, Article

        articles = Article.objects.filter(
            published_at__gte=timezone.now() - timedelta(days=1),
        )

        if not articles:
            self.stdout.write("No new articles today.")
            return

        messages = []
        for user in User.objects.filter(daily_digest=True):
            body = "\n".join(f"- {a.title}" for a in articles)
            messages.append((
                "Daily Digest",
                body,
                "noreply@example.com",
                [user.email],
            ))

        sent = send_mass_mail(messages)
        self.stdout.write(self.style.SUCCESS(f"Sent {sent} digest emails"))
```

## Testing Commands

```python
from django.core.management import call_command
from django.test import TestCase
from io import StringIO

class CommandTest(TestCase):
    def test_greet_command(self):
        user = User.objects.create(first_name="John")
        out = StringIO()
        call_command("greet", str(user.pk), stdout=out)
        self.assertIn("Hello, John!", out.getvalue())

    def test_greet_loud(self):
        user = User.objects.create(first_name="John")
        out = StringIO()
        call_command("greet", str(user.pk), "--loud", stdout=out)
        self.assertIn("HELLO, JOHN!", out.getvalue())

    def test_greet_user_not_found(self):
        out = StringIO()
        err = StringIO()
        call_command("greet", "99999", stdout=out, stderr=err)
        self.assertIn("not found", err.getvalue())
```

## Command Exceptions

```python
from django.core.management.base import CommandError

class Command(BaseCommand):
    def handle(self, *args, **options):
        if not options.get("file_path"):
            raise CommandError("File path is required")
        # CommandError exits with non-zero status and prints error
```

## Programmatic Execution

```python
from django.core.management import call_command

# Call from code
call_command("migrate", "myapp", verbosity=0)
call_command("loaddata", "fixtures.json")
call_command("greet", "1", loud=True)

# Capture output
from io import StringIO
out = StringIO()
call_command("greet", "1", stdout=out)
print(out.getvalue())
```
