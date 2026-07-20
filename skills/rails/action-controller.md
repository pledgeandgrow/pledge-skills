# Action Controller — Controllers, Parameters, Sessions, Callbacks, CSRF

## Creating a Controller

```bash
$ bin/rails generate controller Articles index show
```

Creates `app/controllers/articles_controller.rb`:

```ruby
class ArticlesController < ApplicationController
  def index
  end

  def show
  end
end
```

### Naming Convention

- Controller: `ArticlesController` → `app/controllers/articles_controller.rb`
- Views: `app/views/articles/`
- Routes helper: `articles_path`, `article_path`

## Parameters

The `params` hash contains query string and POST parameters:

```ruby
class ArticlesController < ApplicationController
  def index
    if params[:status] == "published"
      @articles = Article.published
    else
      @articles = Article.all
    end
  end
end
```

`params` is an `ActionController::Parameters` object (not a plain Hash). Keys `:foo` and `"foo"` are equivalent.

### JSON Parameters

```ruby
# POST /articles with Content-Type: application/json
# { "article": { "title": "Hello", "body": "World" } }
def create
  @article = Article.new(article_params)
  # params[:article] => { "title" => "Hello", "body" => "World" }
end
```

### Routing Parameters

```ruby
# GET /articles/42
def show
  @article = Article.find(params[:id])
end
```

## Strong Parameters

Mass assignment requires explicit permission:

```ruby
class PeopleController < ApplicationController
  def create
    @person = Person.new(person_params)
    if @person.save
      redirect_to @person
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    person = Person.find(params[:id])
    person.update!(person_params)
    redirect_to person
  end

  private

  def person_params
    params.expect(person: [:name, :age])
  end
end
```

### Permitting Nested Parameters

```ruby
def article_params
  params.expect(article: [:title, :body, tags: [], comments_attributes: [:id, :body, :_destroy]])
end
```

### Permitting Values

```ruby
params.permit(:title, :body)
params.expect(article: [:title, :body])
params.require(:article).permit(:title, :body)
```

> Rails 8.1 introduces `params.expect` as the preferred method (raises on missing params).

## Cookies

```ruby
class CommentsController < ApplicationController
  def create
    cookies[:last_comment_time] = Time.current
    cookies[:vote_count] = { value: 1, expires: 1.hour.from_now }
  end
end
```

### Encrypted and Signed Cookies

```ruby
cookies.encrypted[:secret_token] = "sensitive_data"
cookies.signed[:user_id] = current_user.id

# Reading
cookies.encrypted[:secret_token]
cookies.signed[:user_id]
```

### Permanent Cookies

```ruby
cookies.permanent[:remember_me] = "true"  # expires in 20 years
cookies.permanent.signed[:user_id] = current_user.id
```

## Session

Session stores data server-side, keyed by a session cookie:

```ruby
class SessionsController < ApplicationController
  def create
    user = User.authenticate(params[:email], params[:password])
    if user
      session[:user_id] = user.id
      redirect_to root_path, notice: "Logged in!"
    else
      flash.now[:alert] = "Invalid credentials"
      render :new, status: :unprocessable_entity
    end
  end

  def destroy
    session.delete(:user_id)
    redirect_to root_path, notice: "Logged out!"
  end
end
```

### The Flash

The flash is a special part of the session, cleared on the next request:

```ruby
redirect_to articles_path, notice: "Article created successfully."
redirect_to articles_path, alert: "Something went wrong."

# Accessing in views
<%= flash[:notice] %>
<%= flash[:alert] %>

# Display all flash messages
<% flash.each do |type, message| %>
  <div class="<%= type %>"><%= message %></div>
<% end %>

# flash.now (available in current action, not next)
flash.now[:alert] = "Login failed"
```

### Session Storage Options

- `CookieStore` — default, stored in encrypted cookie (4KB limit)
- `ActiveRecordStore` — database-backed
- `MemCacheStore` — Memcached
- `RedisStore` — Redis

```ruby
# config/initializers/session_store.rb
Rails.application.config.session_store :cookie_store, key: "_my_app_session"
```

## Controller Callbacks (Filters)

### before_action

```ruby
class ArticlesController < ApplicationController
  before_action :require_login
  before_action :set_article, only: [:show, :edit, :update, :destroy]

  private

  def set_article
    @article = Article.find(params[:id])
  end

  def require_login
    unless logged_in?
      redirect_to login_path, alert: "Please log in."
    end
  end
end
```

### after_action and around_action

```ruby
class ArticlesController < ApplicationController
  after_action :log_request
  around_action :benchmark_action

  private

  def log_request
    Rails.logger.info("Processed #{params[:controller]}##{params[:action]}")
  end

  def benchmark_action
    start = Time.current
    yield
    Rails.logger.info("Took #{Time.current - start}s")
  end
end
```

### Skipping Callbacks

```ruby
class PublicController < ApplicationController
  skip_before_action :require_login, only: [:index, :show]
end
```

### Halting with throw

```ruby
before_action :check_admin

def check_admin
  throw :abort unless current_user.admin?
end
```

## The Request Object

```ruby
def index
  request.method              # "GET"
  request.get?                # true
  request.post?               # false
  request.path                # "/articles"
  request.url                 # "http://example.com/articles"
  request.remote_ip           # "192.168.1.1"
  request.user_agent          # "Mozilla/5.0..."
  request.headers["Accept"]   # "text/html"
  request.format              # :html or :json
  request.xhr?                # AJAX request?
  request.referer             # referring URL
end
```

## The Response Object

```ruby
response.status        # 200
response.content_type  # "text/html"
response.headers["X-Custom"] = "value"
response.body          # response body string
response.set_header("X-Total-Count", "42")
```

## Rescue

### rescue_from

```ruby
class ApplicationController < ActionController::Base
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :record_invalid

  private

  def record_not_found
    render file: Rails.public_path.join('404.html'), status: :not_found, layout: false
  end

  def record_invalid(e)
    render json: { errors: e.record.errors }, status: :unprocessable_entity
  end
end
```

## Streaming

### send_data

```ruby
def download
  send_data generate_csv, filename: "report.csv", type: "text/csv"
end
```

### send_file

```ruby
def download
  send_file Rails.root.join("files", "report.pdf"),
            filename: "report.pdf",
            type: "application/pdf",
            disposition: "attachment"  # or :inline
end
```

### Live Streaming (SSE)

```ruby
class EventsController < ApplicationController
  include ActionController::Live

  def stream
    response.headers["Content-Type"] = "text/event-stream"
    3.times do |i|
      response.stream.write("data: #{i}\n\n")
      sleep 1
    end
  ensure
    response.stream.close
  end
end
```

## CSRF Protection

Rails includes CSRF protection by default:

```ruby
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception  # default
  # protect_from_forgery with: :null_session  # for APIs
end
```

In forms, the CSRF token is auto-included. For AJAX:

```erb
<%= csrf_meta_tags %>
```

```javascript
// Include token in AJAX headers
document.addEventListener('turbo:fetch-request', (event) => {
  event.detail.fetchOptions.headers['X-CSRF-Token'] = document.querySelector('[name="csrf-token"]').content
})
```

## Authentication in Rails 8

```ruby
class ApplicationController < ActionController::Base
  include Authentication

  before_action :authenticate
  allow_unauthenticated_access only: %i[new create]
end
```

## ActionController::API (API Controllers)

```ruby
classApiController < ActionController::API
  # No layout, no cookies, no flash, no view rendering
  # Includes: render, redirect, strong params, etc.
end
```

## Default Rendering

```ruby
class ArticlesController < ApplicationController
  def index
    @articles = Article.all
    # auto-renders app/views/articles/index.html.erb
  end

  def show
    @article = Article.find(params[:id])
    # auto-renders app/views/articles/show.html.erb
  end
end
```

## respond_to

```ruby
def show
  @article = Article.find(params[:id])
  respond_to do |format|
    format.html
    format.json { render json: @article }
    format.xml  { render xml: @article }
    format.pdf  { send_file @article.pdf.path }
  end
end
```

## Default URL Options

```ruby
class ApplicationController < ActionController::Base
  def default_url_options
    { locale: I18n.locale }
  end
end
```
