# Security — Securing Rails Applications

## CSRF (Cross-Site Request Forgery)

Rails includes CSRF protection by default:

```ruby
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception  # default — raises on invalid token
  # protect_from_forgery with: :null_session  # for APIs — clears session
end
```

### How It Works

- Every form includes a hidden `authenticity_token` field
- Every AJAX request includes `X-CSRF-Token` header
- Rails verifies the token on POST/PATCH/PUT/DELETE requests

### In Forms (Automatic)

```erb
<%= form_with model: @article do |form| %>
  <%# CSRF token auto-included %>
<% end %>
```

### For JavaScript

```erb
<%# In layout head %>
<%= csrf_meta_tags %>
```

```javascript
// Turbo automatically includes CSRF token
// For custom fetch requests:
const token = document.querySelector('meta[name="csrf-token"]').content
fetch("/articles", {
  method: "POST",
  headers: { "X-CSRF-Token": token, "Content-Type": "application/json" },
  body: JSON.stringify({ article: { title: "Hello" } })
})
```

### API-Only Apps

```ruby
class ApplicationController < ActionController::API
  # CSRF protection disabled by default in API controllers
  # Use token-based authentication instead
end
```

## SQL Injection

### Safe (Parameterized)

```ruby
Article.where("title = ?", params[:title])           # safe
Article.where(title: params[:title])                  # safe (hash)
Article.where("created_at > ?", params[:date])        # safe
Article.where("title LIKE ?", "%#{params[:q]}%")      # safe
```

### Unsafe (Vulnerable)

```ruby
Article.where("title = '#{params[:title]}'")          # DANGER
Article.where("title LIKE '%#{params[:q]}%'")         # DANGER
Article.order("#{params[:sort]} #{params[:direction]}")  # DANGER
Article.find_by_sql("SELECT * FROM articles WHERE title = '#{params[:title]}'")  # DANGER
```

### Safe Ordering

```ruby
# Whitelist allowed values
direction = %w[asc desc].include?(params[:direction]) ? params[:direction] : "asc"
Article.order(title: direction)

# Or use hash form
Article.order(params[:sort] => params[:direction])  # still validate column name
```

## XSS (Cross-Site Scripting)

Rails escapes HTML by default in ERB:

```erb
<%= @article.title %>     # escaped — safe
<%= raw @article.title %> # NOT escaped — dangerous
<%= @article.title.html_safe %>  # NOT escaped — dangerous
```

### Safe Output

```ruby
# Mark string as safe only if you've sanitized it
def safe_link(text)
  content_tag(:a, sanitize(text), href: "#")
end
```

### Sanitize Helper

```erb
<%= sanitize @article.body %>  # removes dangerous tags
<%= sanitize @article.body, tags: %w[p strong em a], attributes: %w[href] %>
```

### strip_tags

```erb
<%= strip_tags(@user_input) %>  # removes all HTML
```

## Session Security

### Session Storage

```ruby
# CookieStore (default) — encrypted, 4KB limit
config.session_store :cookie_store, key: "_my_app_session"

# For sensitive data, use server-side storage
config.session_store :active_record_store
```

### Session Fixation

```ruby
# Reset session after login to prevent fixation attacks
def create
  user = User.authenticate(params[:email], params[:password])
  if user
    reset_session  # prevent session fixation
    session[:user_id] = user.id
    redirect_to root_path
  end
end
```

### Session Expiry

```ruby
# Force session expiry
class SessionsController < ApplicationController
  before_action :check_session_expiry

  private

  def check_session_expiry
    if session[:expires_at] && session[:expires_at] < Time.current
      reset_session
      redirect_to login_path, alert: "Session expired"
    else
      session[:expires_at] = 30.minutes.from_now
    end
  end
end
```

## Authentication

### Rails 8 Built-in Authentication

```bash
$ bin/rails generate authentication
```

```ruby
class ApplicationController < ActionController::Base
  include Authentication

  before_action :authenticate
  allow_unauthenticated_access only: %i[new create]
end
```

### has_secure_password

```ruby
class User < ApplicationRecord
  has_secure_password  # requires password_digest column
end

# Usage
user = User.new(password: "secret", password_confirmation: "secret")
user.authenticate("secret")  # returns user if correct, false otherwise
user.authenticate("wrong")   # false
```

### Password Requirements

```ruby
class User < ApplicationRecord
  has_secure_password

  validates :password, length: { minimum: 12 }, if: :password_digest_changed?
  validates :password, format: {
    with: /\A(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+\z/,
    message: "must include uppercase, lowercase, number, and special character"
  }, if: :password_digest_changed?
end
```

### Token Authentication (API)

```ruby
class Api::BaseController < ActionController::API
  before_action :authenticate_token

  private

  def authenticate_token
    token = request.headers["Authorization"]&.remove(/^Bearer /)
    @current_user = User.find_by_api_token(token) if token
    render json: { error: "Unauthorized" }, status: :unauthorized unless @current_user
  end
end
```

## Strong Parameters

```ruby
# Prevent mass assignment vulnerabilities
def article_params
  params.expect(article: [:title, :body])
  # Only title and body can be mass-assigned
  # admin flag, user_id, etc. are blocked
end
```

## Mass Assignment Protection

```ruby
# Strong parameters handle this at the controller level
# Never pass raw params to model methods:
User.create(params[:user])  # DANGER — raises ForbiddenAttributesError
User.create(user_params)    # safe
```

## Production Security

### Force SSL

```ruby
# config/environments/production.rb
config.force_ssl = true
```

### Secure Cookies

```ruby
# config/environments/production.rb
config.ssl_options = {
  hsts: { expires: 1.year, subdomains: true, preload: true }
}
```

### Cookie Security

```ruby
cookies.encrypted[:sensitive] = "data"  # encrypted
cookies.signed[:user_id] = 42           # signed (tamper-proof)
cookies.permanent[:remember_me] = "true"  # 20-year expiry
```

### Content Security Policy

```ruby
# config/initializers/content_security_policy.rb
Rails.application.config.content_security_policy do |policy|
  policy.default_src :self, :https
  policy.font_src    :self, :https, :data
  policy.img_src     :self, :https, :data
  policy.object_src  :none
  policy.script_src  :self, :https
  policy.style_src   :self, :https
  policy.connect_src :self, :https, "wss://example.com/cable"
  policy.frame_ancestors :none
end

# Report violations
Rails.application.config.content_security_policy_report_only = true
```

### X-Frame-Options

```ruby
# Prevent clickjacking
config.action_dispatch.default_headers = {
  "X-Frame-Options" => "DENY",
  "X-Content-Type-Options" => "nosniff",
  "X-XSS-Protection" => "0",  # deprecated, use CSP instead
  "Referrer-Policy" => "strict-origin-when-cross-origin"
}
```

## Environment Variables and Secrets

### Rails Encrypted Credentials

```bash
$ bin/rails credentials:edit
# Opens encrypted credentials.yml in your editor
```

```yaml
# credentials.yml.enc (decrypted in editor)
secret_key_base: ...
database:
  password: ...
smtp:
  username: ...
  password: ...
stripe:
  secret_key: ...
```

```ruby
# Access in code
Rails.application.credentials.secret_key_base
Rails.application.credentials.database[:password]
Rails.application.credentials.stripe[:secret_key]
```

### Environment-Specific Credentials

```bash
$ bin/rails credentials:edit --environment production
```

## File Upload Security

```ruby
# Validate file types
def avatar_validation
  if avatar.attached?
    unless ["image/jpeg", "image/png", "image/webp"].include?(avatar.blob.content_type)
      errors.add(:avatar, "must be an image")
    end
    if avatar.blob.byte_size > 5.megabytes
      errors.add(:avatar, "too large")
    end
  end
end
```

## Dependency Security

```bash
# Audit gems for vulnerabilities
$ bundle audit

# Brakeman (security scanner)
$ bundle exec brakeman
```

## Rate Limiting (Rails 7+)

```ruby
class ApplicationController < ActionController::Base
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> { redirect_to too_many_requests_path }
end
```

## Security Checklists

- **CSRF**: `protect_from_forgery` enabled
- **SQL Injection**: Use parameterized queries, never string interpolation
- **XSS**: Don't use `raw` or `html_safe` on user input
- **Sessions**: Use `reset_session` on login, set expiry
- **Passwords**: Use `has_secure_password`, validate strength
- **SSL**: `config.force_ssl = true` in production
- **Headers**: Set CSP, X-Frame-Options, X-Content-Type-Options
- **Secrets**: Use encrypted credentials, never hardcode
- **Mass Assignment**: Always use strong parameters
- **Dependencies**: Run `bundle audit` and `brakeman` regularly
