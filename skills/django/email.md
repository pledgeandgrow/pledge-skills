# Email Framework — Django 6.0

## send_mail()

```python
from django.core.mail import send_mail

send_mail(
    subject="Subject here",
    message="Here is the message.",
    from_email="from@example.com",
    recipient_list=["to@example.com"],
    fail_silently=False,
    auth_user=None,       # Override EMAIL_HOST_USER
    auth_password=None,   # Override EMAIL_HOST_PASSWORD
    connection=None,      # Use custom email backend
    html_message=None,    # HTML alternative content
)
```

## send_mass_mail()

```python
from django.core.mail import send_mass_mail

message1 = (
    "Subject here",
    "Here is the message",
    "from@example.com",
    ["first@example.com", "other@example.com"],
)
message2 = (
    "Another Subject",
    "Here is another message",
    "from@example.com",
    ["second@test.com"],
)

send_mass_mail([message1, message2], fail_silently=False)
# Returns number of successfully sent emails
```

**send_mass_mail vs send_mail**: `send_mass_mail` opens a single connection and sends all messages, while `send_mail` opens/closes a connection per call.

## mail_admins() and mail_managers()

```python
from django.core.mail import mail_admins, mail_managers

mail_admins(
    subject="Server error",
    message="Something went wrong",
    fail_silently=False,
    connection=None,
    html_message=None,
)

mail_managers(
    subject="New order",
    message="Order #12345 received",
    fail_silently=False,
    connection=None,
    html_message=None,
)
```

## EmailMessage Class

```python
from django.core.mail import EmailMessage

email = EmailMessage(
    subject="Hello",
    body="Body text here",
    from_email="from@example.com",
    to=["to@example.com"],
    cc=["cc@example.com"],
    bcc=["bcc@example.com"],
    reply_to=["reply@example.com"],
    headers={"Message-ID": "foo123"},
    connection=None,
)

# Attach file
email.attach_file("/path/to/file.pdf")
# Or attach content
email.attach("file.txt", "file content", "text/plain")

# Send
email.send(fail_silently=False)
```

### EmailMessage Attributes

```python
email.subject       # str
email.body          # str (plain text)
email.from_email    # str
email.to            # list of str
email.cc            # list of str
email.bcc           # list of str
email.reply_to      # list of str
email.headers       # dict
email.attachments   # list of (filename, content, mimetype)
email.alternatives  # list of (content, mimetype)
email.connection    # Email backend connection
```

### EmailMessage Methods

```python
email.attach(filename, content, mimetype)  # Attach content
email.attach_file(path)                     # Attach file from disk
email.send(fail_silently=False)             # Send email
email.content_subtype = "html"              # Set content type
```

## EmailMultiAlternatives

```python
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

text_content = render_to_string("email.txt", {"user": user})
html_content = render_to_string("email.html", {"user": user})

msg = EmailMultiAlternatives(
    subject="Welcome!",
    body=text_content,
    from_email="noreply@example.com",
    to=[user.email],
    headers={"List-Unsubscribe": "<mailto:unsub@example.com>"},
)

# Attach HTML alternative
msg.attach_alternative(html_content, "text/html")

# Attach inline image
msg.attach_alternative(html_content, "text/html")
msg.mixed_subtype = "mixed"
msg.attach("logo.png", image_data, "image/png")

msg.send()
```

## Email Backends

### Built-in Backends

```python
# settings.py
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"  # Default
EMAIL_BACKEND =django.core.mail.backends.console.EmailBackend"  # Print to console
EMAIL_BACKEND = "django.core.mail.backends.filebased.EmailBackend"  # Write to file
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"  # In-memory (testing)
EMAIL_BACKEND = "django.core.mail.backends.dummy.EmailBackend"  # Do nothing

# File-based backend
EMAIL_FILE_PATH = "/tmp/app-emails/"
```

### SMTP Settings

```python
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_HOST_USER = "user@example.com"
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_PASSWORD")
EMAIL_USE_TLS = True   # Use TLS (STARTTLS)
EMAIL_USE_SSL = False  # Use SSL (direct)
EMAIL_TIMEOUT = 30     # Connection timeout (seconds)
EMAIL_SSL_KEYFILE = None  # Path to SSL key file
EMAIL_SSL_CERTFILE = None  # Path to SSL cert file
```

### Getting a Connection

```python
from django.core.mail import get_connection

connection = get_connection(
    backend=None,       # Use default backend
    fail_silently=False,
    **kwargs,           # Backend-specific options
)

# Using connection as context manager
from django.core import mail

with mail.get_connection() as connection:
    mail.EmailMessage(
        "Subject 1", "Body 1", "from@example.com",
        ["to1@example.com"], connection=connection,
    ).send()
    mail.EmailMessage(
        "Subject 2", "Body 2", "from@example.com",
        ["to2@example.com"], connection=connection,
    ).send()
```

### Custom Email Backend

```python
from django.core.mail.backends.base import BaseEmailBackend

class MyEmailBackend(BaseEmailBackend):
    def send_messages(self, email_messages):
        for message in email_messages:
            # Custom sending logic
            self._send(message)
        return len(email_messages)

    def _send(self, email_message):
        if not email_message.recipients():
            return False
        # Send via your custom service (API, queue, etc.)
        return True
```

## Preventing Header Injection

Django prevents header injection attacks by rejecting newlines in `subject`, `from_email`, and `recipient_list`:

```python
# This raises BadHeaderError:
send_mail(
    subject="Subject\nBcc: hacker@evil.com",
    message="Message",
    from_email="from@example.com",
    recipient_list=["to@example.com"],
)
```

## Email in Templates

```python
from django.template.loader import render_to_string

html_content = render_to_string("emails/welcome.html", {
    "user": user,
    "site_name": "My Site",
})
text_content = render_to_string("emails/welcome.txt", {
    "user": user,
    "site_name": "My Site",
})
```

## Testing Email

```python
from django.core import mail
from django.test import TestCase

class EmailTest(TestCase):
    def test_send_email(self):
        # Send email
        send_mail("Subject", "Body", "from@example.com", ["to@example.com"])

        # Check outbox
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, "Subject")
        self.assertEqual(mail.outbox[0].to, ["to@example.com"])
        self.assertEqual(mail.outbox[0].from_email, "from@example.com")

    def test_mass_email(self):
        send_mass_mail([
            ("Subject 1", "Body 1", "from@example.com", ["to1@example.com"]),
            ("Subject 2", "Body 2", "from@example.com", ["to2@example.com"]),
        ])
        self.assertEqual(len(mail.outbox), 2)
```

## Email with Attachments

```python
from django.core.mail import EmailMessage
from django.http import HttpResponse
import csv

def send_report_email(request):
    # Generate CSV in memory
    import io
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Name", "Email"])
    writer.writerow(["John", "john@example.com"])

    email = EmailMessage(
        subject="Monthly Report",
        body="Please find the attached report.",
        from_email="reports@example.com",
        to=["manager@example.com"],
    )
    email.attach(
        "report.csv",
        output.getvalue(),
        "text/csv",
    )
    email.send()
    return HttpResponse("Email sent!")
```
