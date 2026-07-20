# Ruby on Rails 8.1 — Skill Documentation

## Metadata

- **Target Version**: Rails 8.1.x (October 2025)
- **Ruby Version**: 3.2+ required
- **Source**: [guides.rubyonrails.org](https://guides.rubyonrails.org/)
- **Files**: 22
- **Lines**: ~6,800

---

## Quick Reference

| Topic | File | Description |
|-------|------|-------------|
| Getting Started (installation, quick start, MVC, directory structure) | `getting-started.md` | Install Ruby/Rails, create app, first CRUD |
| Active Record (basics, migrations, validations, callbacks, associations, queries) | `active-record.md` | ORM, CRUD, schema conventions, model lifecycle |
| Action View (layouts, rendering, helpers, form helpers) | `action-view.md` | Templates, partials, form helpers, rendering |
| Action Controller (overview, advanced, CSRF, streaming) | `action-controller.md` | Parameters, sessions, cookies, filters, rescue |
| Routing (RESTful routes, resources, constraints) | `routing.md` | URL routing, resource routing, route helpers |
| Active Support (core extensions, instrumentation) | `active-support.md` | Ruby extensions, `present?`, `try`, `deep_dup` |
| Action Mailer / Mailbox / Text | `action-mailer.md` | Email sending, receiving, rich text content |
| Active Job (background jobs, queues) | `active-job.md` | Job declaration, queuing, execution, callbacks |
| Active Storage (file uploads, variants) | `active-storage.md` | Attachments, transformations, direct uploads |
| Action Cable (WebSockets, real-time) | `action-cable.md` | Channels, streams, broadcasting, connections |
| Internationalization (I18n) | `i18n.md` | Translations, pluralization, locale switching |
| Testing (Minitest, fixtures, integration) | `testing.md` | Unit, functional, integration, system tests |
| Security (CSRF, SQL injection, XSS) | `security.md` | Authentication, session security, production |
| Caching (fragment, Russian doll, SQL) | `caching.md` | Page, action, fragment, query caching |
| API-Only Applications | `api-app.md` | JSON API, `ActionController::API`, rendering |
| Configuration (command line, assets, JS, init, autoloading) | `configuration.md` | Config files, generators, Propshaft, importmaps |
| Debugging & Error Reporting | `debugging.md` | Logger, debugger, error reporting, instrumentation |
| Performance & Threading | `performance.md` | Tuning, concurrency, thread safety, code execution |
| Advanced Active Record (PostgreSQL, multi-DB, encryption, CPK) | `advanced-active-record.md` | PG-specific, multi-database, encryption, composite PKs |
| Extending Rails (plugins, Rack, generators, engines) | `extending-rails.md` | Plugin creation, Rack middleware, custom generators |
| Upgrading & Release Notes | `upgrading.md` | Upgrade steps, Rails 8.1/8.0/7.2 features |

---

## Core Concepts

- **MVC Architecture**: Model (Active Record), View (Action View), Controller (Action Controller)
- **Convention over Configuration**: Sensible defaults — pluralized table names, `id` primary keys, `created_at`/`updated_at` timestamps
- **Don't Repeat Yourself (DRY)**: Single source of truth for data, logic, and presentation
- **RESTful Design**: Resources map to CRUD operations via HTTP verbs
- **Rails Stack**: Puma server, SQLite/PostgreSQL/MySQL, Solid Queue, Solid Cache, Solid Cable (Rails 8 defaults)
- **Hotwire**: Turbo Drive, Turbo Frames, Turbo Streams, Stimulus — built-in, no JS framework required
- **Kamal**: Deployment tool for provisioning and deploying Rails apps to any cloud

---

## Common Patterns

### Generate a scaffold (full CRUD)

```ruby
bin/rails generate scaffold Article title:string body:text
bin/rails db:migrate
```

### Model with validations and associations

```ruby
class Article < ApplicationRecord
  has_many :comments, dependent: :destroy
  belongs_to :user

  validates :title, presence: true, length: { minimum: 5 }
  validates :body, presence: true
end
```

### Controller with strong params

```ruby
class ArticlesController < ApplicationController
  before_action :set_article, only: %i[show edit update destroy]

  def create
    @article = Article.new(article_params)
    if @article.save
      redirect_to @article, notice: 'Article created.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  private

  def set_article
    @article = Article.find(params[:id])
  end

  def article_params
    params.require(:article).permit(:title, :body)
  end
end
```

### Routes

```ruby
Rails.application.routes.draw do
  resources :articles do
    resources :comments
  end
  root 'articles#index'
end
```

### View with form

```erb
<%= form_with model: @article do |form| %>
  <%= form.text_field :title %>
  <%= form.text_area :body %>
  <%= form.submit %>
<% end %>
```
