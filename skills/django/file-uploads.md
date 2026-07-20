# File Uploads and Storage — Django 6.0

## Model Fields for Files

### FileField

```python
class Document(models.Model):
    file = models.FileField(upload_to="documents/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

# With date-based path
class Document(models.Model):
    file = models.FileField(upload_to="documents/%Y/%m/%d/")

# With callable upload_to
def user_directory_path(instance, filename):
    return f"user_{instance.user.id}/{filename}"

class Document(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to=user_directory_path)
```

### ImageField

```python
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(
        upload_to="avatars/",
        height_field="avatar_height",
        width_field="avatar_width",
    )
    avatar_height = models.PositiveIntegerField(null=True)
    avatar_width = models.PositiveIntegerField(null=True)
```

## Handling Uploads in Views

```python
from django.shortcuts import render, redirect
from django.core.files.storage import FileSystemStorage

def upload_file(request):
    if request.method == "POST" and request.FILES["file"]:
        uploaded_file = request.FILES["file"]

        # File attributes
        print(uploaded_file.name)           # Original filename
        print(uploaded_file.size)           # Size in bytes
        print(uploaded_file.content_type)   # MIME type
        print(uploaded_file.charset)        # Charset (for text)

        # Read file
        # content = uploaded_file.read()    # Read all (loads into memory)
        # for chunk in uploaded_file.chunks():
        #     process(chunk)                # Read in chunks (memory efficient)

        # Save with FileSystemStorage
        fs = FileSystemStorage()
        filename = fs.save(uploaded_file.name, uploaded_file)
        uploaded_file_url = fs.url(filename)
        return render(request, "upload.html", {"url": uploaded_file_url})

    return render(request, "upload.html")
```

## ModelForm with FileField

```python
class DocumentForm(forms.ModelForm):
    class Meta:
        model = Document
        fields = ["file"]

def upload_document(request):
    if request.method == "POST":
        form = DocumentForm(request.POST, request.FILES)
        if form.is_valid():
            document = form.save()
            return redirect("document-detail", pk=document.pk)
    else:
        form = DocumentForm()
    return render(request, "upload.html", {"form": form})
```

## Storage API

```python
from django.core.files.storage import default_storage

# Save file
path = default_storage.save("uploads/file.txt", ContentFile("file content"))

# Read file
content = default_storage.open(path).read()

# Check existence
exists = default_storage.exists(path)

# Delete file
default_storage.delete(path)

# Get URL
url = default_storage.url(path)

# Get path
file_path = default_storage.path(path)

# List directory
files = default_storage.listdir("uploads/")

# Get file size
size = default_storage.size(path)
```

## Custom Storage Backend

```python
from django.core.files.storage import FileSystemStorage

class MediaFileSystemStorage(FileSystemStorage):
    def _save(self, name, content):
        # Custom save logic
        name = name.replace(" ", "_")
        return super()._save(name, content)

    def url(self, name):
        # Custom URL generation
        return f"https://cdn.example.com/{name}"

# Use in model
class Document(models.Model):
    file = models.FileField(storage=MediaFileSystemStorage())
```

## Serving Media Files

```python
# settings.py
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# urls.py (development only)
from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

## File Upload Validation

```python
def validate_file_size(file):
    max_size = 5 * 1024 * 1024  # 5 MB
    if file.size > max_size:
        raise ValidationError(f"File too large. Max size: {max_size // 1024 // 1024} MB")

def validate_file_extension(file):
    import os
    ext = os.path.splitext(file.name)[1]
    valid_extensions = [".pdf", ".doc", ".docx", ".txt"]
    if ext.lower() not in valid_extensions:
        raise ValidationError(f"Unsupported file type: {ext}")

class DocumentForm(forms.Form):
    file = forms.FileField(
        validators=[validate_file_size, validate_file_extension],
        widget=forms.ClearableFileInput(attrs={"accept": ".pdf,.doc,.docx,.txt"}),
    )
```

## Multiple File Upload

```python
class UploadForm(forms.Form):
    files = forms.FileField(widget=forms.ClearableFileInput(attrs={"multiple": True}))

def upload_multiple(request):
    if request.method == "POST":
        form = UploadForm(request.POST, request.FILES)
        if form.is_valid():
            files = request.FILES.getlist("files")
            for f in files:
                Document.objects.create(file=f)
            return redirect("success")
    else:
        form = UploadForm()
    return render(request, "upload.html", {"form": form})
```

## Settings

```python
# settings.py
FILE_UPLOAD_MAX_MEMORY_SIZE = 2621440  # 2.5 MB (in-memory threshold)
FILE_UPLOAD_TEMP_DIR = None  # System temp dir
FILE_UPLOAD_PERMISSIONS = 0o644
FILE_UPLOAD_HANDLERS = [
    "django.core.files.uploadhandler.MemoryFileUploadHandler",
    "django.core.files.uploadhandler.TemporaryFileUploadHandler",
]
DATA_UPLOAD_MAX_MEMORY_SIZE = 2621440  # 2.5 MB
DATA_UPLOAD_MAX_NUMBER_FIELDS = 1000
```

## Cloud Storage (S3)

```bash
pip install django-storages boto3
```

```python
# settings.py
INSTALLED_APPS = [
    # ...
    "storages",
]

DEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"

AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = "my-bucket"
AWS_S3_REGION_NAME = "us-east-1"
AWS_S3_FILE_OVERWRITE = False
AWS_DEFAULT_ACL = "private"  # or "public-read"
AWS_QUERYSTRING_AUTH = True  # Signed URLs
AWS_QUERYSTRING_EXPIRE = 3600  # URL expiry in seconds
```
