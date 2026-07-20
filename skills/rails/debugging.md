# Debugging & Error Reporting

## Rails Logger

```ruby
Rails.logger.debug("Debug message")
Rails.logger.info("Info message")
Rails.logger.warn("Warning message")
Rails.logger.error("Error message")
Rails.logger.fatal("Fatal message")

# Block form (lazy evaluation)
Rails.logger.debug { "Expensive: #{compute_something}" }

# Tagged logging
Rails.logger.tagged("Billing") { Rails.logger.info("Processing invoice") }
# [Billing] Processing invoice
```

### Log Levels

```ruby
# config/environments/production.rb
config.log_level = :info  # :debug, :info, :warn, :error, :fatal

# config/environments/development.rb
config.log_level = :debug
```

### Filter Sensitive Parameters

```ruby
# config/initializers/filter_parameter_logging.rb
Rails.application.config.filter_parameters += [
  :password,
  :password_confirmation,
  :credit_card_number,
  :api_token
]
```

## Debug Gem (Ruby Debugger)

```ruby
# Gemfile (development, test)
gem "debug"
```

### Using the Debugger

```ruby
class ArticlesController < ApplicationController
  def show
    @article = Article.find(params[:id])
    debugger  # execution pauses here
    render :show
  end
end
```

### Breakpoints via `binding.break`

```ruby
def complex_method
  result = compute
  binding.break  # pause execution, open debugger
  process(result)
end
```

### Debugger Commands

```
(rdbg) next          # step over
(rdbg) step          # step into
(rdbg) continue      # resume execution
(rdbg) break         # list breakpoints
(rdbg) break 42      # set breakpoint at line 42
(rdbg) info          # show frame info
(rdbg) p expression  # evaluate expression
(rdbg) var local     # show local variables
(rdbg) up            # move up the call stack
(rdbg) down          # move down the call stack
(rdbg) finish        # finish current frame
(rdbg) quit          # exit debugger
```

### Remote Debugging

```bash
$ rdbg --open --command -- rails server
# Then connect from another terminal:
$ rdbg --attach
```

## Rails Console

```bash
$ bin/rails console
$ bin/rails console --sandbox  # changes rolled back on exit
$ bin/rails console -e production
```

```ruby
# Inspect objects
irb> pp Article.first  # pretty print
irb> ap Article.first  # awesome_print if installed

# Show SQL queries
irb> ActiveRecord::Base.logger = Logger.new(STDOUT)

# Reload code
irb> reload!

# App object (URL helpers)
irb> app.articles_path
irb> app.get "/articles"
irb> app.response.body

# Helper object
irb> helper.truncate("Hello World", length: 10)
irb> helper.number_to_currency(1234.56)
```

## Inspecting SQL

### In Logs

Rails logs all SQL queries in development:

```sql
Article Load (0.3ms)  SELECT "articles".* FROM "articles" WHERE "articles"."id" = ? LIMIT ? [["id", 1], ["LIMIT", 1]]
```

### In Console

```ruby
ActiveRecord::Base.logger = Logger.new(STDOUT)
Article.first  # SQL is printed
```

### EXPLAIN

```ruby
Article.where(author: "Alice").explain
# EXPLAIN SELECT "articles".* FROM "articles" WHERE "articles"."author" = 'Alice'
# => QUERY PLAN
# => Seq Scan on articles  (cost=0.00..12.50 rows=1 width=...)
```

## Source Location

```ruby
# Find where a method is defined
Article.method(:find_by).source_location
# => ["/path/to/activerecord/lib/active_record/querying.rb", 42]

# Show source
Article.method(:find_by).source

# Show instance method source
Article.new.method(:save).source_location
```

## View Source

```erb
<%= debug(@article) %>
<%= simple_format(@article.attributes.to_yaml) %>

<%= @article.inspect %>
```

## Error Reporting

### ActionDispatch::ExceptionWrapper

```ruby
# config/environments/production.rb
config.action_dispatch.show_exceptions = :all  # :none, :rescuable, :all
```

### Custom Error Pages

```ruby
# config/routes.rb
Rails.application.routes.draw do
  get "404", to: "errors#not_found"
  get "500", to: "errors#internal_server_error"
end
```

```ruby
class ErrorsController < ApplicationController
  def not_found
    render status: 404
  end

  def internal_server_error
    render status: 500
  end
end
```

### rescue_from

```ruby
class ApplicationController < ActionController::Base
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from StandardError, with: :server_error

  private

  def not_found
    render file: Rails.public_path.join("404.html"), status: :not_found, layout: false
  end

  def server_error(e)
    Rails.logger.error(e.full_message)
    render file: Rails.public_path.join("500.html"), status: :internal_server_error, layout: false
  end
end
```

### Error Reporting Services

```ruby
# Sentry
# Gemfile
gem "sentry-rails"

# config/initializers/sentry.rb
Sentry.init do |config|
  config.dsn = ENV["SENTRY_DSN"]
  config.breadcrumbs_logger = [:active_support_logger]
end
```

## ActiveSupport::Notifications

Subscribe to events for debugging:

```ruby
# Subscribe to SQL queries
ActiveSupport::Notifications.subscribe("sql.active_record") do |name, started, finished, unique_id, payload|
  Rails.logger.debug("[SQL] #{payload[:sql]} (#{((finished - started) * 1000).round}ms)")
end

# Subscribe to controller actions
ActiveSupport::Notifications.subscribe("process_action.action_controller") do |name, started, finished, unique_id, payload|
  duration = ((finished - started) * 1000).round
  Rails.logger.info("[#{payload[:method]} #{payload[:path]}] #{payload[:status]} — #{duration}ms")
end
```

## Bullet (N+1 Query Detection)

```ruby
# Gemfile (development)
group :development do
  gem "bullet"
end

# config/environments/development.rb
config.after_initialize do
  Bullet.enable = true
  Bullet.alert = true       # browser alert
  Bullet.bullet_logger = true  # log file
  Bullet.console = true     # console warning
  Bullet.rails_logger = true
end
```

## Web Console

```ruby
# Gemfile (development)
group :development do
  gem "web-console"
end
```

```ruby
# In any controller action, add:
def show
  @article = Article.find(params[:id])
  console  # opens web console in browser
end
```

## Common Debugging Tips

- Use `pp` (pretty print) for complex objects
- Use `@article.attributes` to see all model attributes
- Use `@article.errors.full_messages` to see validation errors
- Use `Article.where(...).to_sql` to see the SQL that would be executed
- Use `Article.where(...).explain` to see the query plan
- Check `Rails.application.routes.routes` for routing issues
- Use `binding.break` to pause execution at any point
- Use `reload!` in console to pick up code changes
