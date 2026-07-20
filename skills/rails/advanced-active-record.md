# Advanced Active Record — PostgreSQL, Multiple Databases, Encryption, Composite Primary Keys

## PostgreSQL Features

### Column Types

```ruby
# Migration
create_table :articles do |t|
  t.string :title
  t.text :body
  t.integer :views
  t.json :metadata              # JSON column
  t.jsonb :settings             # JSONB (binary JSON, indexable)
  t.uuid :identifier            # UUID
  t.array :tags                 # array column
  t.hstore :properties          # key-value store
  t.bit_varying :flags          # bit string
  t.cidr :network               # CIDR notation
  t.inet :ip_address            # IP address
  t.macaddr :mac                # MAC address
  t.money :price                # money type
  t.datetime :published_at
  t.interval :duration          # time interval
  t.binary :data
  t.serial :sequence            # auto-incrementing integer
end
```

### UUID Primary Keys

```ruby
# Migration
create_table :articles, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
  t.string :title
end
```

### JSON/JSONB

```ruby
# Store JSON
article = Article.create!(settings: { theme: "dark", notifications: true })

# Query JSON
Article.where("settings->>'theme' = ?", "dark")
Article.where("settings @> ?", { notifications: true }.to_json)  # JSONB containment

# Index JSONB
add_index :articles, :settings, using: :gin
```

### Arrays

```ruby
# Migration
create_table :articles do |t|
  t.string :tags, array: true, default: []
end

# Usage
article = Article.create!(tags: ["ruby", "rails"])
Article.where("'ruby' = ANY(tags)")
Article.where("tags @> ARRAY[?]", ["ruby"])
```

### Full-Text Search

```ruby
# Migration
add_index :articles, "to_tsvector('english', title || ' ' || body)",
  using: :gin, name: "index_articles_on_fulltext"

# Query
Article.where("to_tsvector('english', title || ' ' || body) @@ plainto_tsquery(?)", "rails tutorial")
```

### Enumerated Types

```ruby
# Migration
execute "CREATE TYPE article_status AS ENUM ('draft', 'published', 'archived')"
add_column :articles, :status, :article_status, default: 'draft'

# Or use Rails enum (simpler, no PG type)
class Article < ApplicationRecord
  enum :status, { draft: "draft", published: "published", archived: "archived" }
end
```

### Database Views

```ruby
# Migration
execute "CREATE VIEW active_articles AS SELECT * FROM articles WHERE status = 'published'"

# Model
class ActiveArticle < ApplicationRecord
  self.table_name = "active_articles"
  # Read-only by default
end
```

### Scopes with SQL Functions

```ruby
class Article < ApplicationRecord
  scope :recent, -> { where("created_at > NOW() - INTERVAL '7 days'") }
  scope :popular, -> { where("views_count > ?", 100).order(views_count: :desc) }
end
```

## Multiple Databases

### Configuration

```yaml
# config/database.yml
default: &default
  adapter: postgresql
  encoding: unicode
  pool: 5

development:
  primary:
    <<: *default
    database: my_app_development
  primary_replica:
    <<: *default
    database: my_app_development_replica
    replica: true
  animals:
    <<: *default
    database: my_app_animals_development
    migrations_paths: db/animals_migrate
  animals_replica:
    <<: *default
    database: my_app_animals_development_replica
    replica: true
```

### Model Configuration

```ruby
class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
  connects_to database: { writing: :primary, reading: :primary_replica }
end

class Animal < ApplicationRecord
  connects_to database: { writing: :animals, reading: :animals_replica }
end
```

### Automatic Switching

```ruby
# config/application.rb
config.active_record.database_selector = { delay: 2.seconds }
config.active_record.database_resolver = ActiveRecord::Middleware::DatabaseSelector::Resolver
config.active_record.database_resolver_context = ActiveRecord::Middleware::DatabaseSelector::Resolver::Session
```

### Manual Switching

```ruby
ActiveRecord::Base.connected_to(role: :reading) do
  Article.all
end

ActiveRecord::Base.connected_to(role: :writing) do
  Article.create!(...)
end

# Connect to specific database
ActiveRecord::Base.connects_to database: { writing: :primary }
```

### Sharding

```ruby
# config/database.yml
development:
  primary_shard_one:
    database: my_app_shard_one
  primary_shard_two:
    database: my_app_shard_two

# Model
class ApplicationRecord < ActiveRecord::Base
  connects_to shards: {
    default: { writing: :primary, reading: :primary_replica },
    shard_one: { writing: :primary_shard_one },
    shard_two: { writing: :primary_shard_two }
  }
end

# Usage
ActiveRecord::Base.connected_to(shard: :shard_one) do
  Article.first
end
```

## Active Record Encryption

### Setup

```bash
$ bin/rails db:encryption:init
```

Generates key references in credentials:

```yaml
# credentials.yml.enc
active_record_encryption:
  primary_key: ...
  deterministic_key: ...
  key_derivation_salt: ...
```

### Encrypting Attributes

```ruby
class User < ApplicationRecord
  encrypts :email, deterministic: true
  encrypts :name              # non-deterministic by default
  encrypts :ssn, deterministic: true
end
```

### Deterministic vs Non-Deterministic

- **Deterministic** — same plaintext produces same ciphertext, enables querying
- **Non-deterministic** — same plaintext produces different ciphertext each time, more secure

```ruby
# Deterministic — can query
User.where(email: "alice@example.com")  # works

# Non-deterministic — cannot query encrypted value
User.where(name: "Alice")  # won't work
```

### Supporting Previous Encryption Schemes

```ruby
class User < ApplicationRecord
  encrypts :email, deterministic: true
  encrypts :email, deterministic: true, previous_versions: {
    previous_scheme: { key_provider: OldKeyProvider.new }
  }
end
```

### Encrypted Filters

```ruby
# Filter encrypted attributes from logs
config.active_record.encryption.add_to_filter_parameters = true
```

## Composite Primary Keys

### Migration

```ruby
create_table :travel_routes, primary_key: [:origin, :destination] do |t|
  t.string :origin
  t.string :destination
  t.integer :distance
  t.timestamps
end
```

### Model

```ruby
class TravelRoute < ApplicationRecord
  self.primary_key = [:origin, :destination]
end
```

### Usage

```ruby
# Find by composite key
TravelRoute.find(["NYC", "LAX"])

# Where
TravelRoute.where(origin: "NYC", destination: "LAX")

# URL helpers
travel_route_path(["NYC", "LAX"])  # /travel_routes/NYC_LAX

# Form
<%= form_with model: @route do |form| %>
  <%= form.text_field :origin %>
  <%= form.text_field :destination %>
<% end %>
```

### Associations with Composite Keys

```ruby
class TravelRoute < ApplicationRecord
  self.primary_key = [:origin, :destination]
  has_many :schedules, foreign_key: [:origin, :destination]
end

class Schedule < ApplicationRecord
  belongs_to :travel_route, foreign_key: [:origin, :destination]
end
```

## Database Extensions

```ruby
# Migration
enable_extension "pgcrypto"   # for gen_random_uuid()
enable_extension "hstore"
enable_extension "pg_trgm"    # trigram search
enable_extension "unaccent"   # accent-insensitive search
enable_extension "citext"     # case-insensitive text
```

## Upsert

```ruby
# Insert or update on conflict
Article.upsert_on_conflict({ title: "Hello", author: "Alice" }, target: :title, update: [:author])

# Or using Rails 6+ upsert_all
Article.upsert_all(
  [{ title: "Hello", author: "Alice" }, { title: "World", author: "Bob" }],
  unique_by: :title
)
```

## Advisory Locks

```ruby
ActiveRecord::Base.connection.advisory_lock(123)
# ... exclusive work ...
ActiveRecord::Base.connection.advisory_unlock(123)

# With block
ActiveRecord::Base.with_advisory_lock(123) do
  # exclusive work
end
```
