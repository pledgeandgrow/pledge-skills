# Upgrading Rails — Upgrading Guide, Release Notes 8.1/8.0/7.2

## Upgrading Process

### General Steps

1. **Ensure good test coverage** before upgrading
2. **Upgrade one minor version at a time** (7.2 → 8.0 → 8.1)
3. **Run the upgrade checker** after each step
4. **Fix deprecation warnings** before proceeding
5. **Test thoroughly** after each upgrade

### Using the rails-upgrade tool

```bash
$ bin/rails app:update
```

This interactive command updates configuration files, generates new defaults, and shows diffs for review.

### Deprecation Warnings

```ruby
# Enable deprecation warnings in development
config.active_support.deprecation = :log
# or :raise for stricter enforcement

# Check for deprecated behaviors
config.active_support.deprecation = :stderr
```

## Rails 8.1 Release Notes (October 2025)

### Major Features

#### Active Job Continuations

Long-running jobs can be broken into discrete steps, allowing execution to continue from the last completed step after a restart:

```ruby
class ProcessImportJob < ApplicationJob
  include ActiveJob::Continuable

  def perform(import_id)
    @import = Import.find(import_id)

    step :initialize do
      @import.initialize
    end

    step :process do |step|
      @import.records.find_each(start: step.cursor) do |record|
        record.process
        step.advance! from: record.id
      end
    end

    step :finalize
  end

  private

  def finalize
    @import.finalize
  end
end
```

#### Structured Event Reporting

Unified interface for producing structured events:

```ruby
Rails.event.notify("user.signup", user_id: 123, email: "user@example.com")

# With tags
Rails.event.tagged("graphql") do
  Rails.event.notify("user.signup", user_id: 123)
end

# With context
Rails.event.set_context(request_id: "abc123", shop_id: 456)

# Custom subscribers
class LogSubscriber
  def emit(event)
    Rails.logger.info("[#{event[:name]}] #{event[:payload]}")
  end
end
```

#### Local CI

Rails 8.1 includes a local CI system defined in `config/ci.rb` and run by `bin/ci`:

```ruby
# config/ci.rb
CI.run do
  step "Setup", "bin/setup --skip-server"
  step "Style: Ruby", "bin/rubocop"
  step "Security: Gem audit", "bin/bundler-audit"
  step "Security: Importmap audit", "bin/importmap audit"
  step "Security: Brakeman", "bin/brakeman --quiet --no-pager --exit-on-warn --exit-on-error"
  step "Tests: Rails", "bin/rails test"
  step "Tests: Seeds", "env RAILS_ENV=test bin/rails db:seed:replant"

  if success?
    step "Signoff: Ready for merge and deploy.", "gh signoff"
  else
    failure "Signoff: CI failed. Do not merge or deploy.", "Fix the issues and try again."
  end
end
```

#### Markdown Rendering

Built-in markdown response support:

```ruby
class PagesController < ActionController::Base
  def show
    @page = Page.find(params[:id])
    respond_to do |format|
      format.html
      format.md { render markdown: @page }
    end
  end
end
```

#### Command-line Credentials Fetching

Kamal can now grab secrets from encrypted Rails credentials:

```ruby
# .kamal/secrets
KAMAL_REGISTRY_PASSWORD=$(rails credentials:fetch kamal.registry_password)
```

#### Deprecated Associations

Active Record associations can be marked as deprecated:

```ruby
class Author < ApplicationRecord
  has_many :posts, deprecated: true
end
```

Three reporting modes: `:warn` (default), `:raise`, `:notify`.

#### Registry-Free Kamal Deployments

Kamal 2.8 uses a local registry by default for simple deploys — no Docker Hub or GHCR needed to get started.

### Railties Changes

- **Removed**: `rails/console/methods.rb`, `bin/rake stats`, `STATS_DIRECTORIES`

### Notable Component Changes

- **Action Pack**: `params.expect` introduced as preferred strong parameters method
- **Active Record**: Deprecated associations support added
- **Active Job**: Continuations feature added
- **Action View**: Markdown rendering support

## Rails 8.0 Release Notes (November 2024)

### Major Features

#### Kamal 2

Rails comes preconfigured with Kamal 2 for deployment. Kamal takes a fresh Linux box and turns it into an application server with `kamal setup`. Includes Kamal Proxy (replaces Traefik).

#### Thruster

New proxy included in the Dockerfile, sits in front of Puma to provide:
- X-Sendfile acceleration
- Asset caching
- Asset compression

#### Solid Cable

Replaces Redis as the pubsub server for WebSocket messages. Retains messages in the database for a day by default.

#### Solid Cache

Replaces Redis or Memcached for storing HTML fragment caches. Database-backed.

#### Solid Queue

Replaces Redis/Sidekiq/Resque/Delayed Job for background job processing. Built on `FOR UPDATE SKIP LOCKED` (PostgreSQL 9.5+, MySQL 8.0+, also works with SQLite).

#### Propshaft

Default asset pipeline, replacing Sprockets. Simpler, pass-through asset management.

#### Authentication

Built-in authentication system generator:

```bash
$ bin/rails generate authentication
```

Creates a session-based, password-resettable, metadata-tracking authentication system.

### Key Changes

- No more Redis dependency required (Solid Cable, Solid Cache, Solid Queue)
- Propshaft replaces Sprockets
- Default Dockerfile includes Thruster
- Authentication generator built-in

## Rails 7.2 Release Notes (August 2024)

### Major Features

#### Development Containers

New applications include a dev container configuration for Docker-based development.

#### Browser Version Guard

Applications include a browser version guard by default, blocking unsupported browsers.

#### Ruby 3.1 Minimum

Rails 7.2 requires Ruby 3.1 or newer.

#### PWA Files

Default Progressive Web Application (PWA) files included in new applications.

#### Omakase RuboCop

New applications include RuboCop rules by default (omakase style).

#### GitHub CI Workflow

New applications include a GitHub CI workflow by default.

#### Brakeman by Default

New applications include Brakeman (security scanner) by default.

#### Puma Thread Count

New default: `RAILS_MAX_THREADS=3` (was 5).

#### Prevent Jobs in Transactions

Active Job automatically defers enqueuing to after transaction commit:

```ruby
Topic.transaction do
  topic = Topic.create
  NewTopicNotificationJob.perform_later(topic)
  # Job is deferred until after commit
end
```

Can be disabled per-job:

```ruby
class NewTopicNotificationJob < ApplicationJob
  self.enqueue_after_transaction_commit = :never
end
```

#### Per-Transaction Callbacks

```ruby
Article.transaction do |transaction|
  article.update(published: true)
  transaction.after_commit do
    PublishNotificationMailer.with(article: article).deliver_later
  end
end
```

Also: `ActiveRecord.after_all_transactions_commit` for code that may run inside or outside a transaction.

#### YJIT Enabled by Default

YJIT (Ruby's JIT compiler) is enabled by default if running Ruby 3.3+:
- 15-25% latency improvements
- Can be disabled: `Rails.application.config.yjit = false`

#### Other Notable Features

- New Rails guides design
- jemalloc in default Dockerfile for memory optimization
- puma-dev configuration suggested in `bin/setup`

## Upgrade Path Summary

| From | To | Key Breaking Changes |
|------|-----|---------------------|
| 7.1 → 7.2 | Ruby 3.1+ required, YJIT default, Puma threads default 3, jobs deferred after transactions |
| 7.2 → 8.0 | Solid Queue/Cable/Cache replace Redis, Propshaft replaces Sprockets, Kamal 2, Thruster, Authentication generator |
| 8.0 → 8.1 | `params.expect` preferred, deprecated associations, Active Job continuuations, Local CI, markdown rendering |

## Checking Your App

```bash
# Check Rails version
$ bin/rails about

# Check for deprecations
$ bin/rails runner "ActiveSupport::Deprecation.debug = true"

# Run the upgrade generator
$ bin/rails app:update

# Check gem compatibility
$ bundle outdated
$ bundle audit
```
