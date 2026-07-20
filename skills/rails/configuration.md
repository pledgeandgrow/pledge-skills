# Configuration — Configuring Rails, Command Line, Assets, Initialization, Autoloading

## Configuration Files

```
config/
├── application.rb           # Main app config
├── boot.rb                  # Bundler setup
├── environment.rb           # Loads app
├── environments/
│   ├── development.rb       # Dev-specific config
│   ├── production.rb        # Production-specific config
│   └── test.rb              # Test-specific config
├── initializers/
│   ├── assets.rb
│   ├── content_security_policy.rb
│   ├── filter_parameter_logging.rb
│   ├── inflections.rb
│   └── permissions_policy.rb
├── locales/                 # I18n files
├── database.yml             # Database config
├── routes.rb                # Routes
├── storage.yml              # Active Storage config
└── puma.rb                  # Puma server config
```

## Application Configuration

```ruby
# config/application.rb
module MyApp
  class Application < Rails::Application
    config.load_defaults 8.1

    # Time zone
    config.time_zone = "Central Time (US & Canada)"

    # Default locale
    config.i18n.default_locale = :en

    # Generators
    config.generators do |g|
      g.orm :active_record
      g.test_framework :test_unit
      g.stylesheets false
      g.javascripts false
      g.helper false
    end

    # Autoloading
    config.autoload_lib(ignore: %w[assets tasks])

    # Active Record
    config.active_record.schema_format = :ruby

    # Action View
    config.action_view.field_error_proc = Proc.new do |html_tag, instance|
      html_tag
    end
  end
end
```

## Environment Configuration

### Development

```ruby
# config/environments/development.rb
Rails.application.configure do
  config.cache_store = :null_store
  config.cache_classes = false
  config.eager_load = false
  config.consider_all_requests_local = true

  # Active Storage
  config.active_storage.service = :local

  # Mailer
  config.action_mailer.raise_delivery_errors = false
  config.action_mailer.perform_deliveries = false
  config.action_mailer.default_url_options = { host: "localhost", port: 3000 }

  # Assets
  config.assets.debug = true

  # File watcher
  config.file_watcher = ActiveSupport::EventedFileUpdateChecker
end
```

### Production

```ruby
# config/environments/production.rb
Rails.application.configure do
  config.cache_classes = true
  config.eager_load = true
  config.consider_all_requests_local = false

  # Caching
  config.cache_store = :solid_cache_store

  # Active Storage
  config.active_storage.service = :amazon

  # SSL
  config.force_ssl = true

  # Logging
  config.log_level = :info
  config.log_tags = [:request_id]

  # Mailer
  config.action_mailer.perform_deliveries = true
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.delivery_method = :smtp

  # Active Job
  config.active_job.queue_adapter = :solid_queue

  # Assets
  config.assets.compile = false
  config.assets.digest = true
end
```

### Test

```ruby
# config/environments/test.rb
Rails.application.configure do
  config.cache_classes = true
  config.eager_load = false
  config.cache_store = :null_store

  config.active_storage.service = :test
  config.action_mailer.delivery_method = :test
  config.action_mailer.perform_deliveries = false
end
```

## Database Configuration

```yaml
# config/database.yml
default: &default
  adapter: sqlite3
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  timeout: 5000

development:
  <<: *default
  database: storage/development.sqlite3

test:
  <<: *default
  database: storage/test.sqlite3

production:
  adapter: postgresql
  database: my_app_production
  username: my_app
  password: <%= ENV["MY_APP_DATABASE_PASSWORD"] %>
  host: localhost
  pool: 25
```

## Asset Pipeline

### Propshaft (Rails 8 Default)

Propshaft is a simple, pass-through asset pipeline:

```ruby
# config/application.rb
config.assets.excluded_paths << Rails.root.join("app/assets/stylesheets")
```

### Import Maps (Default JS)

```ruby
# config/importmap.rb
pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "trix"
import "trix"
import "@rails/actiontext"
```

```bash
$ bin/importmap pin react react-dom
$ bin/importmap unpin jquery
```

### Bundlers (esbuild, rollup, webpack)

```bash
$ rails new my_app --javascript=esbuild
$ rails new my_app --javascript=rollup
$ rails new my_app --javascript=webpack
```

### CSS

```bash
$ rails new my_app --css=tailwind
$ rails new my_app --css=bootstrap
$ rails new my_app --css=postcss
$ rails new my_app --css=sass
```

## Command Line

### Rails Commands

```bash
$ rails new my_app              # create app
$ rails server                  # start server (alias: rails s)
$ rails console                 # console (alias: rails c)
$ rails generate                # generators (alias: rails g)
$ rails db:migrate              # run migrations
$ rails db:rollback             # rollback migration
$ rails db:seed                 # seed data
$ rails db:setup                # create + migrate + seed
$ rails db:reset                # drop + setup
$ rails test                    # run tests
$ rails routes                  # list routes
$ rails runner "code"           # run Ruby in app context (alias: rails r)
$ rails about                   # app info
$ rails stats                   # code statistics
$ rails notes                   # TODO/FIXME notes
$ rails secrets:setup           # setup secrets
$ rails credentials:edit       # edit encrypted credentials
$ rails dbconsole               # DB console (alias: rails db)
```

### Generators

```bash
$ rails generate model User name:string
$ rails generate controller Users index show
$ rails generate scaffold Article title:string body:text
$ rails generate migration AddNameToUsers name:string
$ rails generate job CleanupJob
$ rails generate mailer UserMailer
$ rails generate channel Chat
$ rails generate resource Comment body:text article:references
$ rails generate authentication
```

### Destroy

```bash
$ rails destroy model User     # reverses generate
$ rails d controller Users     # alias
```

## Initialization

### Initializers

```ruby
# config/initializers/my_init.rb
Rails.application.config.to_prepare do
  # runs before every request in development, once in production
end

Rails.application.config.after_initialize do
  # runs after Rails is fully initialized
  MyService.setup if defined?(MyService)
end
```

### Rails.application.config

```ruby
# Access config anywhere
Rails.application.config.time_zone
Rails.application.config.action_controller.default_url_options
```

## Autoloading

Rails uses Zeitwerk for autoloading:

```ruby
# config/application.rb
config.autoload_lib(ignore: %w[assets tasks])
```

### Convention

- `app/models/article.rb` → `Article`
- `app/controllers/articles_controller.rb` → `ArticlesController`
- `app/jobs/cleanup_job.rb` → `CleanupJob`
- `app/models/admin/user.rb` → `Admin::User`

### Autoload Paths

```ruby
# Add custom autoload paths
config.autoload_paths += %W[#{Rails.root}/lib]
```

### Reloading

```ruby
# Development: code is reloaded on each request
# Production: code is loaded once and cached

# To enable reloading in development:
config.reload_classes_only_on_change = true
config.file_watcher = ActiveSupport::EventedFileUpdateChecker
```

## Puma Configuration

```ruby
# config/puma.rb
max_threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
min_threads_count = ENV.fetch("RAILS_MIN_THREADS") { max_threads_count }
threads min_threads_count, max_threads_count

port ENV.fetch("PORT") { 3000 }
environment ENV.fetch("RAILS_ENV") { "development" }
workers ENV.fetch("WEB_CONCURRENCY") { 2 }

preload_app!

plugin :solid_queue
```

## Environment Variables

```ruby
# Access ENV vars
ENV["DATABASE_URL"]
ENV.fetch("SECRET_KEY") { "default" }

# In config files
database: <%= ENV.fetch("DATABASE_URL") { "sqlite3:db/development.sqlite3" } %>
```

## Rake Tasks

```ruby
# lib/tasks/my_task.rake
namespace :my_app do
  desc "Process something"
  task process: :environment do
    Article.all.each(&:process!)
  end
end
```

```bash
$ bin/rails my_app:process
```

## Gems and Bundler

```ruby
# Gemfile
source "https://rubygems.org"

gem "rails", "~> 8.1.0"
gem "pg"
gem "puma", ">= 5.0"
gem "turbo-rails"
gem "stimulus-rails"
gem "jbuilder"
gem "redis"
gem "bootsnap", require: false

group :development, :test do
  gem "debug"
  gem "brakeman"
end

group :development do
  gem "web-console"
end

group :test do
  gem "capybara"
  gem "selenium-webdriver"
end
```

```bash
$ bundle install
$ bundle update rails
$ bundle outdated
$ bundle exec rails server
```

## Logging

```ruby
# config/environments/production.rb
config.logger = ActiveSupport::Logger.new(STDOUT)
  .tap  { |logger| logger.formatter = ::Logger::Formatter.new }
  .then { |logger| ActiveSupport::TaggedLogging.new(logger) }

config.log_level = :info
config.log_tags = [:request_id]

# In code
Rails.logger.info("Processing article #{@article.id}")
Rails.logger.debug { "Expensive debug: #{compute}" }  # block — only evaluates if debug level
```
