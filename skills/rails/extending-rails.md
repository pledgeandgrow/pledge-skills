# Extending Rails — Plugins, Rack, Generators, Engines, Threading

## Rails Plugins

Plugins are gems that extend Rails functionality. They can add helpers, models, controllers, routes, and more.

### Creating a Plugin

```bash
$ rails plugin new api_boost
```

Creates a gem structure:

```
api_boost/
├── lib/
│   ├── api_boost/
│   │   ├── version.rb
│   │   ├── railtie.rb
│   │   └── core_ext.rb
│   └── api_boost.rb
├── test/
├── api_boost.gemspec
└── Gemfile
```

### Gemspec

```ruby
# api_boost.gemspec
require_relative "lib/api_boost/version"

Gem::Specification.new do |spec|
  spec.name = "api_boost"
  spec.version = ApiBoost::VERSION
  spec.authors = ["Your Name"]
  spec.email = ["you@example.com"]
  spec.summary = "A Rails plugin for API optimization"
  spec.description = "Boost your Rails API performance"
  spec.homepage = "https://github.com/you/api_boost"
  spec.license = "MIT"

  spec.required_ruby_version = ">= 3.2.0"
  spec.add_dependency "rails", ">= 8.0"
  spec.add_development_dependency "sqlite3"

  spec.files = Dir.chdir(__dir__) do
    Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]
  end
end
```

### Railtie

Railties integrate your plugin with Rails:

```ruby
# lib/api_boost/railtie.rb
module ApiBoost
  class Railtie < Rails::Railtie
    # Configuration
    config.api_boost = ActiveSupport::OrderedOptions.new
    config.api_boost.enabled = true

    # Initializer
    initializer "api_boost.configure" do |app|
      if app.config.api_boost.enabled
        # Add middleware, helpers, etc.
        ActiveSupport.on_load(:action_controller) do
          include ApiBoost::ControllerAdditions
        end
      end
    end

    # Rake tasks
    rake_tasks do
      load "api_boost/tasks/api_boost.rake"
    end

    # Generators
    generators do
      require "api_boost/generators/install_generator"
    end
  end
end
```

### Extending Core Classes

> Use sparingly — prefer utility modules or composition.

```ruby
# lib/api_boost/core_ext.rb
ApiBoost::RateLimit = Data.define(:requests, :per)

class Integer
  def requests_per_hour
    ApiBoost::RateLimit.new(self, :hour)
  end
end
```

### Adding Methods to ApplicationRecord

```ruby
# lib/api_boost/active_record_additions.rb
module ApiBoost
  module ActiveRecordAdditions
    def cached_count(key, expires_in: 1.hour)
      Rails.cache.fetch("#{model_name}/#{key}", expires_in: expires_in) do
        yield
      end
    end
  end
end

# In railtie:
ActiveSupport.on_load(:active_record) do
  extend ApiBoost::ActiveRecordAdditions
end
```

### acts_as Pattern

```ruby
module ActsAsCommentable
  extend ActiveSupport::Concern

  module ClassMethods
    def acts_as_commentable
      has_many :comments, as: :commentable, dependent: :destroy
      include ActsAsCommentable::InstanceMethods
    end
  end

  module InstanceMethods
    def comments_count
      comments.count
    end
  end
end

# In railtie:
ActiveSupport.on_load(:active_record) do
  include ActsAsCommentable
end

# Usage in app:
class Article < ApplicationRecord
  acts_as_commentable
end
```

### Publishing

```bash
$ gem build api_boost.gemspec
$ gem push api_boost-0.1.0.gem
```

## Rails on Rack

Rails is built on top of Rack, a Ruby web server interface.

### Rack Basics

A Rack application is any Ruby object that responds to `call(env)` and returns `[status, headers, body]`:

```ruby
# config.ru
run lambda { |env| [200, { "Content-Type" => "text/plain" }, ["Hello"]] }
```

### Rails Middleware Stack

```bash
$ bin/rails middleware
```

```
use Rack::Sendfile
use ActionDispatch::Static
use ActionDispatch::Executor
use ActiveSupport::Cache::Strategy::LocalCache
use Rack::Runtime
use Rack::MethodOverride
use ActionDispatch::RequestId
use ActionDispatch::RemoteIp
use Sprockets::Rails::StaticAssets
use Rails::Rack::Logger
use ActionDispatch::ShowExceptions
use ActionDispatch::DebugExceptions
use ActionDispatch::ActionableExceptions
use ActionDispatch::Reloader
use ActionDispatch::Callbacks
use ActionDispatch::Cookies
use ActionDispatch::Session::CookieStore
use ActionDispatch::Flash
use ActionDispatch::ContentSecurityPolicy::Middleware
use ActionDispatch::PermissionsPolicy::Middleware
use Rack::Head
use Rack::ConditionalGet
use Rack::ETag
use Rack::TempfileReaper
run MyApp::Application.routes
```

### Adding Middleware

```ruby
# config/application.rb
config.middleware.use MyCustomMiddleware
config.middleware.insert_before Rack::Runtime, MyEarlyMiddleware
config.middleware.insert_after ActionDispatch::Flash, MyLateMiddleware
config.middleware.delete Rack::ETag
```

### Custom Rack Middleware

```ruby
class RequestTimer
  def initialize(app)
    @app = app
  end

  def call(env)
    start = Time.current
    status, headers, body = @app.call(env)
    headers["X-Response-Time"] = "#{Time.current - start}s"
    [status, headers, body]
  end
end

# config/application.rb
config.middleware.use RequestTimer
```

### Rack Endpoints in Routes

```ruby
# config/routes.rb
Rails.application.routes.draw do
  # Mount a Rack app
  mount Sidekiq::Web => "/sidekiq"

  # Route to a Rack app
  get "/health", to: ->(env) {
    [200, { "Content-Type" => "application/json" }, [{ status: "ok" }.to_json]]
  }

  # Route to a class
  get "/api", to: MyRackApp
end
```

## Generators

### Custom Generators

```ruby
# lib/generators/my_generator/my_generator_generator.rb
class MyGeneratorGenerator < Rails::Generators::NamedBase
  source_root File.expand_path("templates", __dir__)

  argument :name, type: :string

  def create_model_file
    template "model.rb.tt", File.join("app/models", class_path, "#{file_name}.rb")
  end

  def create_test_file
    template "test.rb.tt", File.join("test/models", class_path, "#{file_name}_test.rb")
  end
end
```

```
<%# lib/generators/my_generator/templates/model.rb.tt %>
class <%= class_name %> < ApplicationRecord
end
```

### Customizing Scaffold Generator

```ruby
# config/application.rb
config.generators do |g|
  g.orm :active_record
  g.test_framework :test_unit, fixture: true
  g.stylesheets false
  g.javascripts false
  g.helper false
  g.template_engine :erb
  g.scaffold_controller :scaffold_controller
end
```

### Generator Hooks

```ruby
# Hook into existing generators
Rails::Generators::ModelGenerator.hook_for :my_extension, type: :boolean do |generator|
  generator.invoke "my_extension:model"
end
```

## Engines

Engines are mini-applications that can be mounted inside a host Rails app.

### Creating an Engine

```bash
$ rails plugin new blorgh --mountable
```

```
blorgh/
├── app/
│   ├── controllers/
│   │   └── blorgh/
│   ├── models/
│   │   └── blorgh/
│   ├── views/
│   │   └── blorgh/
│   ├── helpers/
│   │   └── blorgh/
│   └── assets/
├── config/
│   └── routes.rb
├── lib/
│   ├── blorgh/
│   │   └── engine.rb
│   └── blorgh.rb
├── test/
└── blorgh.gemspec
```

### Engine Definition

```ruby
# lib/blorgh/engine.rb
module Blorgh
  class Engine < ::Rails::Engine
    isolate_namespace Blorgh

    # Configuration
    config.blorgh = ActiveSupport::OrderedOptions.new
    config.blorgh.default_title = "Untitled"

    # Initializers
    initializer "blorgh.configure" do |app|
      app.config.active_record.table_name_prefix = "blorgh_"
    end
  end
end
```

### Engine Routes

```ruby
# config/routes.rb (in the engine)
Blorgh::Engine.routes.draw do
  resources :articles do
    resources :comments
  end
  root "articles#index"
end
```

### Mounting in Host App

```ruby
# host app: config/routes.rb
Rails.application.routes.draw do
  mount Blorgh::Engine => "/blog"
end
```

### Engine Models

```ruby
# app/models/blorgh/article.rb
module Blorgh
  class Article < ApplicationRecord
    # Use a class from the host app
    belongs_to :author, class_name: Blorgh.author_class

    has_many :comments
  end
end

# Configure from host app
# config/initializers/blorgh.rb
Blorgh.author_class = "User"
```

### Overriding Engine Functionality

```ruby
# Host app can override engine models
# app/models/blorgh/article.rb (in host app)
module Blorgh
  class Article < ApplicationRecord
    def custom_method
      "overridden"
    end
  end
end
```

### Overriding Engine Views

Place views in the host app at the same path:
- Engine: `app/views/blorgh/articles/index.html.erb`
- Host override: `app/views/blorgh/articles/index.html.erb` (host app wins)

### Engine Helpers

```ruby
# Engine helpers
module Blorgh
  module ApplicationHelper
    def article_title(article)
      article.title.presence || "Untitled"
    end
  end
end
```

### Testing Engines

```ruby
# test/test_helper.rb (in engine)
require File.expand_path("../dummy/config/environment", __FILE__)
require "rails/test_help"

# test/models/blorgh/article_test.rb
require "test_helper"

module Blorgh
  class ArticleTest < ActiveSupport::TestCase
    test "valid article" do
      article = Article.new(title: "Hello")
      assert article.valid?
    end
  end
end
```

## Threading and Code Execution

Rails is thread-safe by default. Key considerations:

### Thread-Safety Rules

- **No shared mutable state** — avoid class variables for mutable data
- **Use CurrentAttributes** for request-scoped state
- **Connection pooling** — each thread gets its own DB connection

### Load and Configuration Hooks

```ruby
# Load hooks for extending Rails frameworks
ActiveSupport.on_load(:action_controller) do
  # Runs when ActionController::Base is loaded
  include MyControllerExtension
end

ActiveSupport.on_load(:active_record) do
  # Runs when ActiveRecord::Base is loaded
  include MyModelExtension
end

ActiveSupport.on_load(:action_view) do
  # Runs when ActionView::Base is loaded
  include MyViewHelper
end
```

### Reload Hooks

```ruby
# Run code on every reload in development
Rails.application.reloader.to_run do
  # Called before each request in development
end

Rails.application.reloader.to_complete do
  # Called after each request in development
end
```

### Thread-Pooled Operations

```ruby
# Using Concurrent Ruby
require "concurrent"

pool = Concurrent::FixedThreadPool.new(5)
futures = items.map do |item|
  Concurrent::Future.execute(executor: pool) { process(item) }
end
results = futures.map(&:value)
```

## Installing Rails Core Development Dependencies

This section covers how to set up your machine for contributing to Rails core development.

### Other Ways to Set Up Your Environment

If you don't want to set up Rails for development on your local machine, you can use:
- **GitHub Codespaces**
- **VS Code Remote Plugin**
- **rails-dev-box** (Vagrant-based VM)

### Local Development

#### Install Git

Ruby on Rails uses Git for source code control. Install from [git-scm.com](https://git-scm.com/).

#### Clone the Ruby on Rails Repository

```bash
$ git clone https://github.com/rails/rails.git
$ cd rails
```

#### Install Additional Tools and Services

Some Rails tests depend on additional tools:

- **Action Cable** depends on Redis
- **Active Record** depends on SQLite3, MySQL, and PostgreSQL
- **Active Storage** depends on Yarn (and Node.js), ImageMagick, libvips, FFmpeg, muPDF, Poppler, and on macOS also XQuartz
- **Active Support** depends on memcached and Redis
- **Railties** depend on a JavaScript runtime (Node.js)

> Active Record tests must pass for at least MySQL, PostgreSQL, and SQLite3. Patches will be rejected if tested against a single adapter, unless the change and tests are adapter specific.

##### macOS

```bash
$ brew bundle
```

Start services:

```bash
$ brew services list
$ brew services start mysql
```

##### Ubuntu

```bash
$ sudo apt-get update
$ sudo apt-get install sqlite3 libsqlite3-dev mysql-server libmysqlclient-dev \
  postgresql postgresql-client postgresql-contrib libpq-dev redis-server \
  memcached imagemagick ffmpeg mupdf mupdf-tools libxml2-dev libvips42 \
  poppler-utils libyaml-dev libffi-dev

# Install Node.js
$ sudo mkdir -p /etc/apt/keyrings
$ curl --fail --silent --show-error --location https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
$ echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
$ sudo apt-get update
$ sudo apt-get install -y nodejs

# Install Yarn
$ sudo npm install --global yarn
```

##### Fedora or CentOS

```bash
$ sudo dnf install sqlite-devel sqlite-libs mysql-server mysql-devel \
  postgresql-server postgresql-devel redis memcached ImageMagick ffmpeg \
  mupdf libxml2-devel vips poppler-utils

# Install Node.js
$ sudo dnf install https://rpm.nodesource.com/pub_20/nodistro/repo/nodesource-release-nodistro-1.noarch.rpm -y
$ sudo dnf install nodejs -y --setopt=nodesource-nodejs.module_hotfixes=1

# Install Yarn
$ sudo npm install --global yarn
```

##### Arch Linux

```bash
$ sudo pacman -S sqlite mariadb libmariadbclient mariadb-clients \
  postgresql postgresql-libs redis memcached imagemagick ffmpeg mupdf \
  mupdf-tools poppler yarn libxml2 libvips

$ sudo mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql
$ sudo systemctl start redis mariadb memcached
```

> On Arch Linux, MySQL isn't supported — use MariaDB instead.

##### Debian

```bash
$ sudo apt-get install sqlite3 libsqlite3-dev default-mysql-server \
  default-libmysqlclient-dev postgresql postgresql-client \
  postgresql-contrib libpq-dev redis-server memcached imagemagick \
  ffmpeg mupdf mupdf-tools libxml2-dev libvips42 poppler-utils
```

> On Debian, MariaDB is the default MySQL server.

##### FreeBSD

```bash
$ sudo pkg install sqlite3 mysql80-client mysql80-server \
  postgresql11-client postgresql11-server memcached imagemagick6 \
  ffmpeg mupdf yarn libxml2 vips poppler-utils

# Redis via ports
$ portmaster databases/redis
```

#### Database Configuration

PostgreSQL authentication setup:

```bash
# Linux/BSD
$ sudo -u postgres createuser --superuser $USER

# macOS
$ createuser --superuser $USER
```

MySQL creates users when databases are created. The task assumes user `root` with no password.

Create test databases:

```bash
$ cd activerecord
$ bundle exec rake db:create
```

Or create separately:

```bash
$ cd activerecord
$ bundle exec rake db:mysql:build
$ bundle exec rake db:postgresql:build
```

Drop databases:

```bash
$ cd activerecord
$ bundle exec rake db:drop
```

Check `activerecord/test/config.yml` or `activerecord/test/config.example.yml` for default connection information. You can edit `activerecord/test/config.yml` for local credentials, but do not push those changes to Rails.

#### Install JavaScript Dependencies

```bash
$ yarn install
```

#### Install Gem Dependencies

```bash
$ bundle install
```

Skip database gems if you don't need Active Record tests:

```bash
$ bundle config set without db
$ bundle install
```

#### Contribute to Rails

After setting up everything, see the [Contributing to Ruby on Rails](https://guides.rubyonrails.org/contributing_to_ruby_on_rails.html) guide.
