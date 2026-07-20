# Active Storage — File Uploads, Transformations, Attachments

## What is Active Storage?

Active Storage facilitates uploading files to cloud storage services (or local disk) and attaching those files to Active Record models.

## Installation

```bash
$ bin/rails active_storage:install
$ bin/rails db:migrate
```

Creates `active_storage_blobs` and `active_storage_attachments` tables (polymorphic).

## Attaching Files

### has_one_attached

```ruby
class User < ApplicationRecord
  has_one_attached :avatar
end
```

```ruby
user.avatar.attach(params[:avatar])
user.avatar.attached?  # true
user.avatar            # ActiveStorage::Attached::One
user.avatar.blob       # ActiveStorage::Blob
user.avatar.filename   # "photo.jpg"
user.avatar.content_type  # "image/jpeg"
user.avatar.byte_size  # 1234567

# Remove
user.avatar.purge        # sync, runs callbacks
user.avatar.purge_later  # async via Active Job
```

### has_many_attached

```ruby
class Product < ApplicationRecord
  has_many_attached :images
end
```

```ruby
product.images.attach(params[:images])
product.images.attached?  # true
product.images.each { |image| image.variant(resize: "100x100") }

# Attach multiple
product.images.attach(io: file1, filename: "1.jpg", content_type: "image/jpeg")
product.images.attach(io: file2, filename: "2.jpg", content_type: "image/jpeg")

# Remove specific
product.images.first.purge
```

## Uploading Files

### From Form

```erb
<%= form_with model: @user, local: true do |form| %>
  <%= form.file_field :avatar %>
<% end %>
```

```ruby
def create
  @user = User.new(user_params)
  if @user.save
    redirect_to @user
  else
    render :new, status: :unprocessable_entity
  end
end

private

def user_params
  params.expect(user: [:name, :avatar])
end
```

### From URL

```ruby
require "open-uri"

user.avatar.attach(
  io: URI.open("https://example.com/photo.jpg"),
  filename: "photo.jpg",
  content_type: "image/jpeg"
)
```

### From Raw Data

```ruby
user.avatar.attach(
  io: StringIO.new(raw_bytes),
  filename: "document.pdf",
  content_type: "application/pdf"
)
```

## Variants (Image Transformations)

```ruby
user.avatar.variant(resize_to_limit: [100, 100]).processed
user.avatar.variant(resize_to_fill: [100, 100]).processed
user.avatar.variant(resize_and_pad: [100, 100]).processed
user.avatar.variant(crop: [100, 100, 50, 50]).processed
user.avatar.variant(rotate: 90).processed
user.avatar.variant(monochrome: true).processed
user.avatar.variant(quality: 80).processed
user.avatar.variant(format: :png).processed
```

### In Views

```erb
<%= image_tag user.avatar.variant(resize_to_limit: [100, 100]) %>
```

### Variant Options

| Option | Description |
|--------|-------------|
| `resize_to_limit: [w, h]` | Resize, never larger than w×h |
| `resize_to_fit: [w, h]` | Resize, exactly w×h (may distort) |
| `resize_to_fill: [w, h]` | Resize and crop to fill w×h |
| `resize_and_pad: [w, h]` | Resize and pad to w×h |
| `crop: [w, h, x, y]` | Crop from x,y with w×h |
| `rotate: degrees` | Rotate image |
| `monochrome: true` | Grayscale |
| `quality: n` | JPEG quality (1-100) |
| `format: :png` | Convert format |
| `strip: true` | Remove metadata |

## Analyzing Files

```ruby
user.avatar.analyze  # run analysis (usually automatic)
user.avatar.metadata  # { identified: true, width: 800, height: 600, ... }
user.avatar.analyzed?  # true if analysis complete
```

## Previewing Files

For PDFs, videos, and other non-image formats:

```ruby
pdf.preview(resize_to_limit: [100, 100]).processed
# Generates a thumbnail of the first page/frame
```

## Direct Uploads

Active Storage supports direct uploads from the browser to the storage service, bypassing your Rails server.

```erb
<%= form.file_field :avatar, direct_upload: true %>
```

```javascript
// Direct upload events
document.addEventListener("direct-upload:initialize", (event) => {
  const { id, file } = event.detail
  console.log(`Uploading ${file.name}`)
})

document.addEventListener("direct-upload:progress", (event) => {
  const { id, file, progress } = event.detail
  console.log(`${progress}%`)
})

document.addEventListener("direct-upload:error", (event) => {
  event.preventDefault()
  const { id, file, error } = event.detail
  console.error(error)
})
```

## Storage Services

### Configuration

```yaml
# config/storage.yml
test:
  service: Disk
  root: <%= Rails.root.join("tmp/storage") %>

local:
  service: Disk
  root: <%= Rails.root.join("storage") %>

amazon:
  service: S3
  access_key_id: <%= ENV["AWS_ACCESS_KEY_ID"] %>
  secret_access_key: <%= ENV["AWS_SECRET_ACCESS_KEY"] %>
  region: us-east-1
  bucket: my-app-bucket

google:
  service: GCS
  project: my-project
  keyfile: <%= ENV["GOOGLE_KEYFILE"] %>
  bucket: my-app-bucket

azure:
  service: AzureStorage
  storage_account_name: <%= ENV["AZURE_STORAGE_ACCOUNT"] %>
  storage_access_key: <%= ENV["AZURE_STORAGE_KEY"] %>
  container: my-app-container
```

### Per-Environment Selection

```ruby
# config/environments/production.rb
config.active_storage.service = :amazon
config.active_storage.variant_processor = :vips  # or :mini_magick

# config/environments/development.rb
config.active_storage.service = :local

# config/environments/test.rb
config.active_storage.service = :test
```

### Multiple Services

```ruby
user.avatar.variant(resize_to_limit: [100, 100]).url(service: :amazon_backup)
```

## Downloading Files

```ruby
# Download blob
user.avatar.download  # returns binary string

# Stream to a block
user.avatar.open do |file|
  # file is a Tempfile
  process(file)
end
```

## Serving Files

### Disk Service

Files served directly from disk via `ActiveStorage::DiskController`.

### Cloud Service (Redirect)

Files served via redirect to the cloud service's public URL (signed, expiring URLs).

```ruby
# URL for download
url_for(user.avatar)
rails_blob_path(user.avatar, disposition: "attachment")
rails_blob_url(user.avatar)

# Variant URL
url_for(user.avatar.variant(resize_to_limit: [100, 100]))
```

## Validating Attachments

```ruby
class User < ApplicationRecord
  has_one_attached :avatar

  validate :avatar_validation

  private

  def avatar_validation
    if avatar.attached?
      if avatar.blob.byte_size > 5.megabytes
        errors.add(:avatar, "must be less than 5MB")
      end
      unless ["image/jpeg", "image/png", "image/webp"].include?(avatar.blob.content_type)
        errors.add(:avatar, "must be JPEG, PNG, or WebP")
      end
    end
  end
end
```

## Associations and Attachments

```ruby
class Message < ApplicationRecord
  has_one_attached :attachment
  has_many_attached :photos
end

# Eager loading
Message.with_attached_attachment
Message.with_attached_photos
```

## Custom Transformations

```ruby
# Using image_processing gem (vips or mini_magick)
user.avatar.variant(resize_to_limit: [300, 300], saver: { strip: true, quality: 80 })
```

## Mirroring

Active Storage supports mirroring uploads to multiple services for redundancy:

```yaml
# config/storage.yml
mirror:
  service: Mirror
  primary: amazon
  mirrors:
    - google
    - azure
```

## Purging

```ruby
# Synchronous (runs callbacks)
user.avatar.purge

# Asynchronous (via Active Job)
user.avatar.purge_later

# Bulk
user.images.each(&:purge_later)
```
