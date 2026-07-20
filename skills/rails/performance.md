# Performance & Threading — Tuning, Concurrency, Code Execution

## Performance Profiling

### Measuring Time

```ruby
# Basic timing
start = Time.current
result = expensive_operation
Rails.logger.info("Took #{Time.current - start}s")

# Benchmark
require "benchmark"
elapsed = Benchmark.realtime do
  expensive_operation
end
puts "Took #{elapsed}s"
```

### ActiveSupport::Notifications

```ruby
# Instrument custom events
ActiveSupport::Notifications.instrument("my_operation.my_app") do
  expensive_operation
end

# Subscribe and measure
ActiveSupport::Notifications.subscribe("my_operation.my_app") do |name, started, finished, unique_id, payload|
  duration = ((finished - started) * 1000).round
  Rails.logger.info("my_operation took #{duration}ms")
end
```

### Built-in Instrumentation

```ruby
# Controller action timing
ActiveSupport::Notifications.subscribe("process_action.action_controller") do |name, started, finished, unique_id, payload|
  total = ((finished - started) * 1000).round
  db = payload[:db_runtime].round
  view = payload[:view_runtime].round
  Rails.logger.info("[#{payload[:method]} #{payload[:path]}] total=#{total}ms db=#{db}ms view=#{view}ms")
end
```

## Database Performance

### N+1 Queries

```ruby
# Bad — N+1 queries
Article.all.each { |a| puts a.author.name }
# 1 query for articles + N queries for authors

# Good — eager loading
Article.includes(:author).each { |a| puts a.author.name }
# 2 queries total

# preload (always separate queries)
Article.preload(:author)

# eager_load (LEFT JOIN)
Article.eager_load(:author)

# strict_loading (prevents lazy loading)
Article.strict_loading.includes(:author)
```

### Indexes

```ruby
# Migration
add_index :articles, :author_id
add_index :articles, :title
add_index :articles, [:author_id, :status]  # composite index
add_index :articles, :title, unique: true
add_index :articles, :body, type: :fulltext  # MySQL only
```

### Query Optimization

```ruby
# Select only needed columns
Article.select(:id, :title).each { |a| puts a.title }

# Use pluck for arrays
Article.pluck(:title)  # ["Title 1", "Title 2", ...] — no instantiation

# Use ids
Article.ids  # [1, 2, 3, ...]

# Batch processing
Article.find_each(batch_size: 500) do |article|
  article.process!
end

# Update in bulk
Article.where(active: true).update_all(status: "published")

# Delete in bulk
Article.where("created_at < ?", 1.year.ago).delete_all
```

### Connection Pooling

```yaml
# config/database.yml
production:
  pool: 25  # max connections per process
```

```ruby
# Check pool stats
ActiveRecord::Base.connection_pool.stat
```

## Caching for Performance

```ruby
# Low-level caching
Rails.cache.fetch("expensive:#{params[:id]}", expires_in: 1.hour) do
  compute_expensive_result
end

# Fragment caching in views
<% cache @article do %>
  <%= render @article %>
<% end %>

# Russian doll caching
<% cache @article do %>
  <% cache @article.comments.each do |comment| %>
    <% cache comment do %>
      <%= render comment %>
    <% end %>
  <% end %>
<% end %>
```

## View Performance

```ruby
# Use collection rendering
<%= render @articles %>  # faster than manual loop

# With caching
<%= render partial: "article", collection: @articles, cached: true %>

# Avoid repeated computations in views
# Bad:
<%= Article.where(published: true).count %>  # runs query each render

# Good:
# Set in controller: @published_count = Article.where(published: true).count
<%= @published_count %>
```

## Threading and Concurrency

### Puma Configuration

```ruby
# config/puma.rb
threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
threads threads_count, threads_count

workers ENV.fetch("WEB_CONCURRENCY") { 2 }
preload_app!

# Solid Queue plugin
plugin :solid_queue
```

### Thread Safety

Rails is thread-safe by default. However, be careful with:

```ruby
# Bad — shared mutable state
class ApplicationController < ActionController::Base
  @@counter = 0  # shared across threads, not thread-safe

  def index
    @@counter += 1  # race condition
  end
end

# Good — use thread-local or request-local storage
class ApplicationController < ActionController::Base
  def index
    RequestStore.store[:counter] = (RequestStore.store[:counter] || 0) + 1
  end
end

# Good — use CurrentAttributes (Rails 7+)
class Current < ActiveSupport::CurrentAttributes
  attribute :request_id, :user
end
```

### Active Record and Threads

Each thread checks out its own connection from the pool:

```ruby
Thread.new do
  ActiveRecord::Base.connection_pool.with_connection do
    Article.find(1)
  end
end
```

### Concurrent Ruby

```ruby
# Gemfile
gem "concurrent-ruby"

require "concurrent"

# Parallel execution
promises = Article.all.map do |article|
  Concurrent::Promises.future { article.process! }
end
Concurrent::Promises.zip(*promises).value!
```

## Background Processing

Move expensive work to background jobs:

```ruby
# Bad — blocks request
def create
  @article = Article.create!(article_params)
  @article.generate_pdf  # slow, blocks response
  redirect_to @article
end

# Good — async
def create
  @article = Article.create!(article_params)
  GeneratePdfJob.perform_later(@article)  # non-blocking
  redirect_to @article
end
```

## Asset Performance

### Compression

```ruby
# config/environments/production.rb
config.assets.css_compressor = :cssmin  # or :sass
config.assets.js_compressor = :terser    # or :uglifier
```

### Gzip

Rails automatically serves gzipped assets when the client supports them.

### CDN

```ruby
# config/environments/production.rb
config.asset_host = "https://cdn.example.com"
```

## Memory Management

### Loading Less Data

```ruby
# Bad — loads all records into memory
Article.all.map(&:title)

# Good — pluck
Article.pluck(:title)

# Bad — loads all columns
Article.all

# Good — select only needed
Article.select(:id, :title).all
```

### Garbage Collection

```ruby
# Force GC
GC.start

# Disable GC temporarily (for benchmarks)
GC.disable
# ... benchmark code ...
GC.enable

# Tune GC (environment variables)
RUBY_GC_HEAP_INIT_SLOTS=1000000
RUBY_GC_HEAP_GROWTH_FACTOR=1.1
```

## HTTP Performance

### ETag and Conditional GET

```ruby
def show
  @article = Article.find(params[:id])
  fresh_when @article, public: true
  # Client gets 304 Not Modified if cache is valid
end
```

### HTTP/2 Push (Preload)

```erb
<%= preload_link_tag "/fonts/inter.woff2", as: "font", type: "font/woff2", crossorigin: "anonymous" %>
```

## Profiling Tools

### rack-mini-profiler

```ruby
# Gemfile (development)
gem "rack-mini-profiler"
```

Shows timing for every SQL query, view render, and controller action in a popup.

### Memory Profiler

```ruby
# Gemfile (development)
gem "memory_profiler"
```

```ruby
report = MemoryProfiler.report do
  Article.all.each(&:title)
end
report.pretty_print(scale_bytes: true)
```

### StackProf

```ruby
# Gemfile
gem "stackprof"
```

```ruby
StackProf.run(mode: :cpu, out: "prof.dump") do
  Article.all.each(&:process!)
end

# Analyze
# $ stackprof prof.dump --text
# $ stackprof prof.dump --d3-flamegraph > flame.html
```

## Summary Checklist

- **Database**: Use `includes`/`preload`, add indexes, use `pluck`/`select`, batch processing
- **Caching**: Fragment caching, Russian doll, low-level cache, ETag
- **Views**: Collection rendering, avoid queries in views
- **Background**: Move expensive work to Active Job
- **Threading**: Configure Puma properly, avoid shared mutable state
- **Assets**: Compress, use CDN, gzip
- **Memory**: Load less data, use `pluck`, tune GC
- **Profiling**: Use rack-mini-profiler, stackprof, bullet
