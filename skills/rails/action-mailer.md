# Action Mailer, Action Mailbox, Action Text

## Action Mailer

Action Mailer allows you to send emails from your application using mailer classes and views.

### Generating a Mailer

```bash
$ bin/rails generate mailer UserMailer
```

Creates:
- `app/mailers/user_mailer.rb`
- `app/mailers/application_mailer.rb`
- `app/views/user_mailer/` (view templates)
- `test/mailers/user_mailer_test.rb`

### Application Mailer

```ruby
class ApplicationMailer < ActionMailer::Base
  default from: "noreply@example.com"
  layout "mailer"
end
```

### Creating a Mailer

```ruby
class UserMailer < ApplicationMailer
  def welcome_email(user)
    @user = user
    @url = "https://example.com/login"
    mail(to: @user.email, subject: "Welcome to My App!")
  end

  def password_reset(user)
    @user = user
    mail to: user.email, subject: "Password Reset Instructions"
  end
end
```

### Mailer Views

```erb
<%# app/views/user_mailer/welcome_email.html.erb %>
<h1>Welcome to My App, <%= @user.name %>!</h1>
<p>Click <%= link_to "here", @url %> to log in.</p>
```

```erb
<%# app/views/user_mailer/welcome_email.text.erb %>
Welcome to My App, <%= @user.name %>!
Visit <%= @url %> to log in.
```

### Sending Email

```ruby
# Send immediately
UserMailer.welcome_email(@user).deliver_now

# Send via Active Job (background)
UserMailer.welcome_email(@user).deliver_later

# Send later with wait
UserMailer.welcome_email(@user).deliver_later(wait: 1.hour)
UserMailer.welcome_email(@user).deliver_later(wait_until: 1.day.from_now)
```

### Mailer Options

```ruby
mail(
  to: "user@example.com",
  cc: "boss@example.com",
  bcc: "audit@example.com",
  reply_to: "support@example.com",
  subject: "Hello",
  from: "noreply@example.com",
  delivery_method: :smtp
)
```

### Attachments

```ruby
def invoice_email(user, invoice)
  @user = user
  attachments["invoice.pdf"] = File.read(invoice.path)
  # or
  attachments["report.csv"] = { mime_type: "text/csv", content: csv_data }
  mail(to: @user.email, subject: "Your Invoice")
end
```

### Inline Attachments

```ruby
def welcome_email(user)
  @user = user
  attachments.inline["logo.png"] = File.read("app/assets/images/logo.png")
  mail(to: @user.email, subject: "Welcome")
end
```

```erb
<%= image_tag attachments["logo.png"].url %>
```

### Configuration

```ruby
# config/environments/development.rb
config.action_mailer.delivery_method = :smtp
config.action_mailer.perform_deliveries = true
config.action_mailer.raise_delivery_errors = true
config.action_mailer.default_url_options = { host: "localhost", port: 3000 }

# SMTP settings
config.action_mailer.smtp_settings = {
  address: "smtp.gmail.com",
  port: 587,
  domain: "example.com",
  user_name: ENV["SMTP_USERNAME"],
  password: ENV["SMTP_PASSWORD"],
  authentication: "plain",
  enable_starttls_auto: true
}
```

### Delivery Methods

- `:smtp` — via SMTP server
- `:sendmail` — via local sendmail
- `:test` — appends to `ActionMailer::Base.deliveries` (test env)
- `:file` — saves to file system

### Interceptors

```ruby
class DevelopmentEmailInterceptor
  def self.delivering_email(message)
    message.to = ["dev@example.com"]
    message.cc = []
    message.bcc = []
  end
end

# config/environments/development.rb
config.action_mailer.interceptors = ["DevelopmentEmailInterceptor"]
```

### Previews

```ruby
# test/mailers/previews/user_mailer_preview.rb
class UserMailerPreview < ActionMailer::Preview
  def welcome_email
    UserMailer.welcome_email(User.first)
  end
end
```

Visit `/rails/mailers` to preview emails in the browser.

### Mailer Callbacks

```ruby
class UserMailer < ApplicationMailer
  before_action :set_user

  def welcome_email
    mail(to: @user.email, subject: "Welcome")
  end

  private

  def set_user
    @user = params[:user]
  end
end
```

## Action Mailbox

Action Mailbox routes incoming emails to controller-like mailboxes for processing.

### Installation

```bash
$ bin/rails action_mailbox:install
$ bin/rails db:migrate
```

### Creating a Mailbox

```bash
$ bin/rails generate mailbox Replies
```

```ruby
class RepliesMailbox < ApplicationMailbox
  before_processing :require_user

  def process
    Reply.create!(
      user: user,
      body: mail.body
    )
  end

  private

  def user
    @user ||= User.find_by(email: mail.from)
  end

  def require_user
    unless user
      bounce_with UserMailer.no_account(mail.from)
    end
  end
end
```

### Routing

```ruby
# config/application.rb
config.action_mailbox.routes = {
  replies: "replies@mailbox.example.com",
  support: ->(mail) { mail.to.start_with?("support@") }
}
```

### Inbound Email Processing

Action Mailbox stores incoming emails in `action_mailbox_inbound_emails` table. Mailboxes process them via Active Job.

### Exim, Postfix, Sendmail, Mailgun, Mandrill, Postmark, ReceiveMail, Relay, Resend, Salesforce

Action Mailbox provides ingress configurations for various email providers:

```ruby
# config/environments/production.rb
config.action_mailbox.ingress = :relay
```

## Action Text

Action Text provides rich text content editing and storage using Trix editor.

### Installation

```bash
$ bin/rails action_text:install
$ bin/rails db:migrate
```

Creates `action_text_rich_texts` table.

### Model

```ruby
class Article < ApplicationRecord
  has_rich_text :body
end
```

### Form

```erb
<%= form_with model: @article do |form| %>
  <%= form.rich_text_area :body %>
<% end %>
```

### Display

```erb
<%= @article.body %>
```

### Direct Uploads

Action Text automatically handles direct uploads of attached files (images) via Active Storage.

### Customizing the Editor

```javascript
// app/javascript/application.js
import "trix"
import "@rails/actiontext"
```

```css
/* Custom Trix styles */
.trix-content {
  font-size: 16px;
}
```

### Rendering Rich Text

```erb
<%= @article.body %>
```

Action Text renders the rich text with proper HTML and embedded attachments.

### Plain Text

```ruby
@article.body.to_plain_text
@article.body.to_trix_html
```

### Attachments

```ruby
# Action Text attachments are stored via Active Storage
# You can attach files directly in the Trix editor
# They are stored as action_text-attachments
```

### Custom Attachable Models

```ruby
class Comment < ApplicationRecord
  include ActionText::Attachable

  def to_trix_content_attachment_partial_path
    "comments/comment_attachment"
  end
end
```
