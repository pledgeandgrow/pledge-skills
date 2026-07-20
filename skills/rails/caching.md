# Caching — Fragment, Russian Doll, SQL, Page, Action Caching

## Overview

Rails provides several caching strategies to improve performance. Rails 8 defaults to **Solid Cache** (database-backed) instead of Redis.

## Configuration

```ruby
# config/environments/production.rb
config.cache_store = :solid_cache_store

# Other options:
# :memory_store     — in-process memory
# :mem_cache_store  — Memcached
# :redis_cache_store — Redis
# :file_store       — filesystem
# :null_store       — no caching (development/test)
```

```ruby
# config/environments/development.rb
config.cache_store = :null_store  # or :memory_store for testing caching in dev
```

## Fragment Caching

Cache parts of a view:

```erb
<% @articles.each do |article| %>
  <% cache article do %>
    <div class="article">
      <h2><%= article.title %></h2>
      <p><%= article.body %></p>
    </div>
  <% end %>
<% end %>
```

### Cache Key

The cache key is based on the model's `id` and `updated_at`:

```
articles/1-20240101120000000000
```

### Custom Cache Key

```ruby
class Article < ApplicationRecord
  def cache_key
    "article/#{id}-#{updated_at}-#{comments_count}"
  end
end
```

### Cache with Options

```erb
<% cache article, expires_in: 1.hour do %>
  <%= render article %>
<% end %>
```

## Russian Doll Caching

Nested fragment caching — outer cache benefits from inner cache stability:

```erb
<% cache @article do %>
  <h1><%= @article.title %></h1>

  <% cache @article.comments do %>
    <% @article.comments.each do |comment| %>
      <% cache comment do %>
        <p><%= comment.body %></p>
      <% end %>
    <% end %>
  <% end %>
<% end %>
```

If a comment changes, only that comment's cache and the comments collection cache are regenerated. The article cache remains valid.

### Touch for Cache Invalidation

```ruby
class Comment < ApplicationRecord
  belongs_to :article, touch: true  # updates article.updated_at on save
end
```

This ensures the article's cache key changes when a comment is added/updated.

## Collection Caching

```erb
<%= render partial: "articles/article", collection: @articles, cached: true %>
```

Rails caches each item individually. On subsequent renders, only changed items are re-rendered.

## SQL Caching

Active Record caches query results within a request:

```ruby
# First call — executes SQL
Article.where(author: "Alice").load

# Second call in same request — returns cached result
Article.where(author: "Alice").load  # no SQL executed
```

SQL cache is per-request and cleared at the end of the request.

## Low-Level Caching

```ruby
# Rails.cache.fetch — read from cache or compute and store
Rails.cache.fetch("user:#{user.id}:stats", expires_in: 1.hour) do
  {
    articles: user.articles.count,
    comments: user.comments.count,
    likes: user.likes.count
  }
end

# Write directly
Rails.cache.write("key", "value", expires_in: 1.hour)

# Read
Rails.cache.read("key")

# Delete
Rails.cache.delete("key")

# Check existence
Rails.cache.exist?("key")

# Fetch without caching (force refresh)
Rails.cache.fetch("key", force: true) { compute_value }

# Clear all
Rails.cache.clear
```

### Cache Namespacing

```ruby
Rails.cache.fetch("articles:#{article.id}") do
  article.to_json
end

# Or use namespace option
config.cache_store = :redis_cache_store, { namespace: "myapp:v1" }
```

## Conditional Caching

```erb
<% cache_if admin?, @article do %>
  <%= render @article %>
<% end %>

<% cache_unless guest?, @article do %>
  <%= render @article %>
<% end %>
```

## Cache Stores

### Solid Cache (Rails 8 Default)

Database-backed cache, no Redis required:

```ruby
config.cache_store = :solid_cache_store
```

Features:
- Uses database tables for storage
- Supports TTL, LRU eviction
- No external dependencies
- Works with PostgreSQL, MySQL, SQLite

### Memory Store

```ruby
config.cache_store = :memory_store, { size: 64.megabytes }
```

### Redis

```ruby
config.cache_store = :redis_cache_store, {
  url: ENV["REDIS_URL"],
  namespace: "cache",
  expires_in: 1.hour,
  pool_size: 5
}
```

### Memcached

```ruby
config.cache_store = :mem_cache_store, "localhost:11211"
```

### File Store

```ruby
config.cache_store = :file_store, Rails.root.join("tmp", "cache")
```

## Action Caching (via third-party gems)

For full-page caching with authentication checks:

```ruby
# Using actionpack-page_caching or actionpack-action_caching gems
class ArticlesController < ApplicationController
  caches_page :index, :show
  caches_action :index, expires_in: 1.hour
end
```

> Note: Page and action caching were removed from Rails 4 core. Use fragment caching or edge caching (CDN) instead.

## ETag / Conditional GET

```ruby
class ArticlesController < ApplicationController
  def show
    @article = Article.find(params[:id])
    fresh_when @article  # sets ETag and Last-Modified
    # or
    if stale? @article
      # only renders if stale
    end
  end
end
```

### Strong ETags

```ruby
fresh_when etag: @article, last_modified: @article.updated_at
```

## Sweeping / Expiration

### Manual Expiration

```ruby
Rails.cache.delete("articles:#{article.id}")
Rails.cache.delete_matched("articles:*")  # memory store only
```

### Automatic via Touch

```ruby
class Comment < ApplicationRecord
  belongs_to :article, touch: true
end

# When comment is saved, article.updated_at changes,
# invalidating all caches keyed on the article
```

## View Caching Best Practices

- Use Russian Doll caching for nested content
- Add `touch: true` to associations for automatic invalidation
- Use `cached: true` with collection rendering
- Keep cache keys simple and model-based
- Set appropriate `expires_in` for low-level caches
- Use ETag/`fresh_when` for expensive controller actions
- Avoid caching user-specific content in shared fragments
