# Getting Started with Rails

## Rails Philosophy

Rails is an opinionated web application framework written in Ruby. Two guiding principles:

- **Don't Repeat Yourself (DRY)** — Every piece of knowledge has a single, unambiguous, authoritative representation
- **Convention over Configuration** — Rails has opinions about the best way to do things and defaults to them

## Installation

### macOS

```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install Homebrew and dependencies
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
brew install openssl@3 libyaml gmp rust

# Install Mise version manager
curl https://mise.run | sh
echo 'eval "$(~/.local/bin/mise activate)"' >> ~/.zshrc
source ~/.zshrc

# Install Ruby
mise use -g ruby@3
```

### Ubuntu

```bash
sudo apt update
sudo apt install build-essential rustc libssl-dev libyaml-dev zlib1g-dev libgmp-dev git

curl https://mise.run | sh
echo 'eval "$(~/.local/bin/mise activate)"' >> ~/.bashrc
source ~/.bashrc

mise use -g ruby@3
```

### Windows (WSL)

```bash
wsl --install --distribution Ubuntu-24.04
# Then follow Ubuntu instructions inside WSL
```

### Install Rails

```bash
gem install rails
rails --version  # Rails 8.1.0
```

## Creating a New Rails App

```bash
$ rails new store
$ cd store
```

### Customizing with Flags

```bash
rails new my_app --database=postgresql
rails new my_app --api
rails new my_app --skip-test
rails new my_app --css=tailwind
rails new my_app --javascript=esbuild
```

## Directory Structure

```
store/
├── app/
│   ├── models/          # Active Record models
│   ├── controllers/     # Action Controller controllers
│   ├── views/           # Action View templates (ERB, etc.)
│   ├── helpers/         # View helpers
│   ├── javascript/      # JS entry points (import maps or bundlers)
│   ├── assets/          # Static assets (CSS, images)
│   └── jobs/            # Active Job classes
├── bin/                 # Rails executables (rails, rake, setup)
├── config/              # Configuration (routes, environments, database)
│   ├── environments/    # Per-env config (development, production, test)
│   ├── initializers/    # App initializers
│   └── locales/         # I18n translations
├── db/
│   ├── migrate/         # Migration files
│   ├── schema.rb        # Current schema
│   └── seeds.rb         # Seed data
├── lib/                 # Shared code, tasks
├── log/                 # Log files
├── public/              # Static files (404.html, favicon, etc.)
├── storage/             # Active Storage files
├── test/                # Test files (Minitest)
├── tmp/                 # Temporary files, cache
├── Gemfile              # Ruby gem dependencies
├── Gemfile.lock         # Locked gem versions
├── Rakefile             # Rake tasks
└── config.ru            # Rack configuration
```

## MVC Architecture

Rails uses Model-View-Controller (MVC):

- **Model** — Manages data, typically database tables via Active Record
- **View** — Renders responses (HTML, JSON, XML) via Action View
- **Controller** — Handles user requests, logic, and responses via Action Controller

Request flow:
1. Browser sends request
2. Router matches URL to controller#action
3. Controller action runs (interacts with Model)
4. Controller renders View (or returns JSON)
5. Response sent to browser

## Hello, Rails!

```ruby
# config/routes.rb
Rails.application.routes.draw do
  get 'welcome/index'
  root 'welcome#index'
end
```

```ruby
# app/controllers/welcome_controller.rb
class WelcomeController < ApplicationController
  def index
  end
end
```

```erb
<%# app/views/welcome/index.html.erb %>
<h1>Hello, Rails!</h1>
```

## Creating a Database Model

### Generate a Model

```bash
$ bin/rails generate model Product name:string quantity:integer
```

This creates:
- `app/models/product.rb`
- `db/migrate/YYYYMMDDHHMMSS_create_products.rb`
- Test files

### Migration

```ruby
# db/migrate/20240220143807_create_products.rb
class CreateProducts < ActiveRecord::Migration[8.1]
  def change
    create_table :products do |t|
      t.string :name
      t.integer :quantity

      t.timestamps  # creates created_at and updated_at
    end
  end
end
```

### Run Migrations

```bash
$ bin/rails db:migrate
```

## Rails Console

```bash
$ bin/rails console  # or: bin/rails c
```

```ruby
irb> product = Product.new(name: "Keyboard", quantity: 10)
=> #<Product id: nil, name: "Keyboard", quantity: 10, ...>
irb> product.save
=> true
irb> Product.all
=> #<ActiveRecord::Relation [#<Product id: 1, name: "Keyboard", ...>]>
irb> Product.find_by(name: "Keyboard")
=> #<Product id: 1, name: "Keyboard", ...>
```

## Active Record CRUD

### Create

```ruby
product = Product.create(name: "Mouse", quantity: 5)
# Or:
product = Product.new(name: "Mouse", quantity: 5)
product.save
```

### Read

```ruby
Product.all                          # all records
Product.first                        # first record
Product.find(1)                      # by ID (raises if not found)
Product.find_by(name: "Mouse")       # by attribute (nil if not found)
Product.where(quantity: 5)           # filter
Product.where("quantity > ?", 3)     # SQL condition
Product.order(created_at: :desc)     # ordering
Product.limit(10)                    # limit
```

### Update

```ruby
product = Product.find(1)
product.name = "Updated Mouse"
product.save
# Or:
product.update(name: "Updated Mouse")
# Bulk:
Product.update_all(quantity: 0)
```

### Delete

```ruby
product = Product.find(1)
product.destroy       # runs callbacks
product.delete        # skips callbacks
Product.destroy_all   # destroy all (runs callbacks)
Product.delete_all    # delete all (skips callbacks)
```

## Routes

### Resource Routing

```ruby
# config/routes.rb
Rails.application.routes.draw do
  resources :products
  root 'products#index'
end
```

This creates 7 RESTful routes:

| HTTP Method | Path | Controller#Action | Helper |
|-------------|------|-------------------|--------|
| GET | /products | products#index | products_path |
| GET | /products/new | products#new | new_product_path |
| POST | /products | products#create | products_path |
| GET | /products/:id | products#show | product_path(:id) |
| GET | /products/:id/edit | products#edit | edit_product_path(:id) |
| PATCH/PUT | /products/:id | products#update | product_path(:id) |
| DELETE | /products/:id | products#destroy | product_path(:id) |

### View Routes

```bash
$ bin/rails routes
$ bin/rails routes -g products  # filter
```

## Controllers & Actions

```ruby
class ProductsController < ApplicationController
  def index
    @products = Product.all
  end

  def show
    @product = Product.find(params[:id])
  end

  def new
    @product = Product.new
  end

  def create
    @product = Product.new(product_params)
    if @product.save
      redirect_to @product, notice: 'Product created.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @product = Product.find(params[:id])
  end

  def update
    @product = Product.find(params[:id])
    if @product.update(product_params)
      redirect_to @product, notice: 'Product updated.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @product = Product.find(params[:id])
    @product.destroy
    redirect_to products_path, notice: 'Product deleted.'
  end

  private

  def product_params
    params.require(:product).permit(:name, :quantity)
  end
end
```

## Adding Authentication

Rails 8 includes built-in authentication generator:

```bash
$ bin/rails generate authentication
```

This creates:
- `User` model with `has_secure_password`
- `Session` model
- `PasswordsController` for password resets
- `SessionsController` for login/logout
- `Authentication` concern

```ruby
# In controllers:
class ApplicationController < ActionController::Base
  include Authentication
end

# Require authentication:
before_action :authenticate

# Allow unauthenticated access:
allow_unauthenticated_access only: %i[new create]
```

## Caching

```ruby
# Fragment caching in views
<% cache @products do %>
  <%= render @products %>
<% end %>

# Rails 8 uses Solid Cache by default (database-backed)
```

## Rich Text with Action Text

```bash
$ bin/rails action_text:install
$ bin/rails db:migrate
```

```ruby
# app/models/article.rb
class Article < ApplicationRecord
  has_rich_text :body
end
```

```erb
<%# In form %>
<%= form.rich_text_area :body %>
```

## File Uploads with Active Storage

```bash
$ bin/rails active_storage:install
$ bin/rails db:migrate
```

```ruby
class Product < ApplicationRecord
  has_one_attached :featured_image
  has_many_attached :gallery_images
end
```

## Internationalization (I18n)

```ruby
# config/locales/en.yml
en:
  products:
    created: "Product was successfully created."

# In controller:
redirect_to @product, notice: t('products.created')
```

## Action Mailer

```bash
$ bin/rails generate mailer ProductMailer
```

```ruby
class ProductMailer < ApplicationMailer
  def in_stock(product)
    @product = product
    mail to: "customer@example.com", subject: "Product back in stock!"
  end
end
```

## Adding CSS & JavaScript

### Propshaft (Default Asset Pipeline)

Rails 8 uses Propshaft for asset management — a simple, pass-through asset pipeline.

### Import Maps (Default JS)

```ruby
# config/importmap.rb
pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
```

### Hotwire

Rails 8 ships with Hotwire (Turbo + Stimulus) for building modern web applications without writing much JavaScript:
- **Turbo Drive** — intercepts links and form submissions, loads via AJAX
- **Turbo Frames** — update parts of a page without full reload
- **Turbo Streams** — broadcast updates over WebSocket (Action Cable)
- **Stimulus** — lightweight JS framework for adding behavior

## Testing

```ruby
# test/models/product_test.rb
require "test_helper"

class ProductTest < ActiveSupport::TestCase
  test "should not save product without name" do
    product = Product.new
    assert_not product.save
  end
end
```

```bash
$ bin/rails test
$ bin/rails test:system  # system tests
```

## Deploying to Production

Rails 8 uses **Kamal** for deployment:

```bash
$ bin/kamal setup
$ bin/kamal deploy
```

Kamal:
- Provisions a server on any cloud
- Uses Docker for containerized deployment
- Handles zero-downtime deploys with Kamal-proxy
- Manages env vars and secrets via Kamal secrets

### Solid Queue / Solid Cache / Solid Cable

Rails 8 replaces Redis with database-backed adapters:
- **Solid Queue** — background jobs in PostgreSQL/MySQL/SQLite
- **Solid Cache** — fragment caching in the database
- **Solid Cable** — WebSocket pub/sub in the database
