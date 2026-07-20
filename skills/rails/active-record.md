# Active Record — Models, Migrations, Validations, Callbacks, Associations, Queries

## What is Active Record?

Active Record is the ORM (Object-Relational Mapping) layer in Rails. It implements the Active Record pattern: objects that wrap database rows, encapsulate database access, and add domain logic.

### Capabilities

- Represent models and their data
- Represent associations between models
- Represent inheritance hierarchies (STI, delegated types)
- Validate models before persistence
- Perform database operations in an object-oriented fashion

## Convention over Configuration

### Naming Conventions

| Model Class | Table Name |
|-------------|-----------|
| `Book` | `books` |
| `BookClub` | `book_clubs` |
| `LineItem` | `line_items` |
| `Person` | `people` |
| `Article` | `articles` |

Rails pluralizes class names using Active Support's `Inflector`.

### Schema Conventions

- **Primary key**: `id` (bigint for PostgreSQL/MySQL, integer for SQLite)
- **Foreign keys**: `singularized_table_name_id` (e.g., `order_id`, `line_item_id`)
- **Timestamps**: `created_at`, `updated_at` (auto-set)
- **Optimistic locking**: `lock_version`
- **STI**: `type` column
- **Polymorphic**: `(association_name)_type` + `(association_name)_id`
- **Counter cache**: `(table_name)_count` (e.g., `comments_count`)

### Overriding Conventions

```ruby
class Book < ApplicationRecord
  self.table_name = "my_books"
  self.primary_key = "book_id"
end
```

## Creating Models

```ruby
# app/models/application_record.rb
class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class
end

# app/models/book.rb
class Book < ApplicationRecord
end
```

Generate a model with migration:

```bash
$ bin/rails generate model Book title:string author:string
```

### Namespaced Models

```bash
$ bin/rails generate model Admin::User name:string
```

Creates `app/models/admin/user.rb`:

```ruby
class Admin::User < ApplicationRecord
end
```

## CRUD Operations

### Create

```ruby
# Create and save
book = Book.create(title: "The Lord of the Rings", author: "J.R.R. Tolkien")

# Instantiate without saving
book = Book.new
book.title = "The Hobbit"
book.author = "J.R.R. Tolkien"
book.save

# Create with block
book = Book.new do |b|
  b.title = "Metaprogramming Ruby 2"
  b.author = "Paolo Perrotta"
end
book.save

# Bulk insert (no callbacks/validations)
Book.insert_all([{ title: "Book 1", author: "Author 1" }, { title: "Book 2", author: "Author 2" }])
```

### Read

```ruby
# All records
Book.all

# Single records
Book.first              # first by id, raises if table empty (in Rails 8)
Book.last               # last by id
Book.take               # random record
Book.find(42)           # by primary key (raises if not found)
Book.find_by(title: "The Hobbit")  # by attribute (nil if not found)
Book.find_by!(title: "The Hobbit") # raises if not found

# Filtering
Book.where(author: "Douglas Adams")
Book.where("quantity > ?", 3)
Book.where(author: "Douglas Adams").order(created_at: :desc)
Book.where(active: true).limit(10)
```

### Update

```ruby
book = Book.find(1)
book.title = "New Title"
book.save

# Shorthand
book.update(title: "New Title")

# Bulk update (no callbacks/validations)
Book.update_all(status: "published")

# Update with validations but skip callbacks
Book.update_counters(1, views_count: 1)
```

### Delete

```ruby
book = Book.find(1)
book.destroy       # runs callbacks
book.delete        # skips callbacks

# Bulk
Book.destroy_by(author: "Douglas Adams")  # runs callbacks
Book.destroy_all                         # runs callbacks
Book.delete_all                          # skips callbacks
```

## Migrations

### Generating Migrations

```bash
# Standalone
$ bin/rails generate migration AddPartNumberToProducts

# Create table
$ bin/rails generate migration CreateProducts name:string part_number:string

# Add column
$ bin/rails generate migration AddQuantityToProducts quantity:integer

# Remove column
$ bin/rails generate migration RemoveQuantityFromProducts quantity:integer
```

### Creating Tables

```ruby
class CreateProducts < ActiveRecord::Migration[8.1]
  def change
    create_table :products do |t|
      t.string :name
      t.text :description
      t.integer :quantity, default: 0
      t.decimal :price, precision: 8, scale: 2
      t.boolean :active, default: true
      t.datetime :published_at
      t.references :category              # creates category_id
      t.references :taggable, polymorphic: true  # creates taggable_id + taggable_type
      t.timestamps                        # created_at + updated_at
    end
  end
end
```

### Changing Tables

```ruby
class ChangeProducts < ActiveRecord::Migration[8.1]
  def change
    add_column :products, :sku, :string
    change_column :products, :price, :decimal, precision: 10, scale: 2
    remove_column :products, :description
    add_index :products, :sku, unique: true
    add_reference :products, :category, foreign_key: true
    rename_column :products, :name, :product_name
  end
end
```

### Foreign Keys

```ruby
add_foreign_key :articles, :authors
add_foreign_key :articles, :authors, column: :author_id, on_delete: :cascade
remove_foreign_key :articles, :authors
```

### Composite Primary Keys

```ruby
create_table :travel_routes, primary_key: [:origin, :destination] do |t|
  t.string :origin
  t.string :destination
  t.integer :distance
end
```

### UUID Primary Keys

```ruby
create_table :users, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
  t.string :name
end
```

### Running Migrations

```bash
$ bin/rails db:migrate                    # run pending
$ bin/rails db:rollback                   # rollback last
$ bin/rails db:rollback STEP=3            # rollback 3
$ bin/rails db:migrate:up VERSION=20240101  # run specific
$ bin/rails db:migrate:down VERSION=20240101  # revert specific
$ bin/rails db:setup                      # create + migrate + seed
$ bin/rails db:reset                      # drop + setup
$ bin/rails db:seed                       # seed only
```

### Schema Dumping

Rails tracks schema in `db/schema.rb` (or `structure.sql` for PG-specific features). This file is the authoritative source for the database structure.

```ruby
# config/application.rb
config.active_record.schema_format = :ruby  # or :sql
```

## Validations

### Built-in Validators

```ruby
class Person < ApplicationRecord
  # Presence
  validates :name, :email, presence: true

  # Absence
  validates :admin_code, absence: true

  # Uniqueness
  validates :email, uniqueness: true
  validates :email, uniqueness: { case_sensitive: false, scope: :account_id }

  # Length
  validates :name, length: { minimum: 2 }
  validates :bio, length: { maximum: 500 }
  validates :password, length: { in: 6..20 }
  validates :code, length: { is: 6 }

  # Numericality
  validates :points, numericality: true
  validates :games_played, numericality: { only_integer: true }
  validates :age, numericality: { greater_than: 0 }
  validates :rating, numericality: { less_than_or_equal_to: 5 }

  # Format
  validates :email, format: { with: /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i }

  # Inclusion / Exclusion
  validates :status, inclusion: { in: %w[draft published archived] }
  validates :username, exclusion: { in: %w[admin root superuser] }

  # Confirmation
  validates :email, confirmation: true
  # validates :email_confirmation presence is needed separately

  # Acceptance (checkbox)
  validates :terms_of_service, acceptance: true

  # Comparison
  validates :end_date, comparison: { greater_than: :start_date }
end
```

### Validation Options

```ruby
validates :name, presence: { message: "must be specified" }
validates :email, uniqueness: true, on: :create
validates :password, presence: true, if: :password_required?
validates :nickname, presence: true, unless: :anonymous?
validates :age, numericality: true, allow_nil: true
validates :bio, presence: true, allow_blank: false
```

### Conditional Validations

```ruby
# Symbol (method name)
validates :password, presence: true, if: :password_required?

# Proc
validates :phone, presence: true, if: -> { step >= 2 }

# Grouping
with_options if: :active? do |active|
  active.validates :name, presence: true
  active.validates :email, presence: true
end
```

### Custom Validations

```ruby
# Custom method
class Invoice < ApplicationRecord
  validate :expiration_date_cannot_be_in_the_past

  private

  def expiration_date_cannot_be_in_the_past
    if expiration_date.present? && expiration_date < Date.today
      errors.add(:expiration_date, "can't be in the past")
    end
  end
end

# Custom validator class
class EmailValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    unless value =~ /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i
      record.errors.add attribute, (options[:message] || "is not an email")
    end
  end
end

class Person < ApplicationRecord
  validates :email, presence: true, email: true
end

# validates_with
class GoodnessValidator < ActiveModel::Validator
  def validate(record)
    if record.name == "Evil"
      record.errors.add :base, "This person is evil"
    end
  end
end

class Person < ApplicationRecord
  validates_with GoodnessValidator
end
```

### Checking Validity

```ruby
person.valid?       # true/false
person.invalid?     # true/false
person.errors       # ActiveModel::Errors object
person.errors[:name]           # array of error messages for :name
person.errors.full_messages    # array of full messages
person.errors.where(:name)     # Error objects
person.errors.add(:name, "custom error")
person.errors.size
person.errors.clear
```

### Skipping Validations

```ruby
Book.save(validate: false)
Book.update_all(...)      # skips validations
Book.insert_all(...)      # skips validations
Book.delete_all(...)      # skips validations
```

## Callbacks

### Object Life Cycle

Callbacks are methods that run at specific points in an object's life cycle.

### Creating an Object — Callback Order

1. `before_validation`
2. `after_validation`
3. `before_save`
4. `around_save`
5. `before_create`
6. `around_create`
7. `after_create`
8. `after_save`
9. `after_commit` / `after_rollback`

### Updating an Object — Callback Order

1. `before_validation`
2. `after_validation`
3. `before_save`
4. `around_save`
5. `before_update`
6. `around_update`
7. `after_update`
8. `after_save`
9. `after_commit` / `after_rollback`

### Destroying an Object — Callback Order

1. `before_destroy`
2. `around_destroy`
3. `after_destroy`
4. `after_commit` / `after_rollback`

> `before_save` / `after_save` run on both create and update, before the more specific `before_create`/`before_update`.

### Registering Callbacks

```ruby
class User < ApplicationRecord
  validates :name, presence: true

  before_validation :titleize_name
  after_validation :log_errors

  before_save :normalize_email
  before_create :generate_token
  after_create :send_welcome_email
  after_update :log_changes
  before_destroy :check_admin_count
  after_destroy :notify_users

  private

  def titleize_name
    self.name = name.downcase.titleize if name.present?
  end

  def log_errors
    Rails.logger.error("Validation failed: #{errors.full_messages.join(', ')}") if errors.any?
  end

  def normalize_email
    self.email = email.downcase.strip
  end

  def generate_token
    self.token = SecureRandom.hex(16)
  end

  def send_welcome_email
    UserMailer.welcome_email(self).deliver_later
  end
end
```

### Around Callbacks

```ruby
class User < ApplicationRecord
  around_create :log_creating

  private

  def log_creating
    Rails.logger.info("Creating user...")
    yield  # performs the create
    Rails.logger.info("User created with ID: #{id}")
  end
end
```

### Conditional Callbacks

```ruby
before_save :normalize_email, if: :email_changed?
after_create :send_welcome_email, unless: :guest?
before_destroy :check_admin_count, if: :admin?
```

### Skipping Callbacks

```ruby
User.insert(...)              # skips all callbacks
User.update_all(...)          # skips all callbacks
User.delete_all(...)          # skips all callbacks
```

### Transaction Callbacks

```ruby
# after_commit runs after the transaction is committed
after_commit :purge_cache, on: [:create, :update]
after_commit :send_notification, on: :create
after_rollback :revert_changes

# Aliases for after_commit
after_create_commit  # same as after_commit on: :create
after_update_commit  # same as after_commit on: :update
after_destroy_commit # same as after_commit on: :destroy
```

## Associations

### Types

| Association | Description |
|------------|-------------|
| `belongs_to` | Child references parent |
| `has_one` | Parent has one child (child has foreign key) |
| `has_many` | Parent has many children |
| `has_many :through` | Many-to-many via join model |
| `has_one :through` | One-to-one via join model |
| `has_and_belongs_to_many` | Many-to-many via join table (no model) |

### belongs_to

```ruby
class Comment < ApplicationRecord
  belongs_to :article
  belongs_to :author, class_name: "User"
  belongs_to :article, optional: true  # allows nil
end
```

### has_one

```ruby
class User < ApplicationRecord
  has_one :profile
  has_one :account, dependent: :destroy
end
```

### has_many

```ruby
class Article < ApplicationRecord
  has_many :comments
  has_many :comments, dependent: :destroy
  has_many :comments, -> { order(created_at: :desc) }
  has_many :approved_comments, -> { where(approved: true) }, class_name: "Comment"
end
```

### has_many :through

```ruby
class Article < ApplicationRecord
  has_many :article_tags
  has_many :tags, through: :article_tags
end

class ArticleTag < ApplicationRecord
  belongs_to :article
  belongs_to :tag
end

class Tag < ApplicationRecord
  has_many :article_tags
  has_many :articles, through: :article_tags
end
```

### has_one :through

```ruby
class Supplier < ApplicationRecord
  has_one :account
  has_one :account_history, through: :account
end

class Account < ApplicationRecord
  belongs_to :supplier
  has_one :account_history
end
```

### has_and_belongs_to_many

```ruby
class Article < ApplicationRecord
  has_and_belongs_to_many :tags
end

class Tag < ApplicationRecord
  has_and_belongs_to_many :articles
end

# Requires a join table migration:
create_join_table :articles, :tags do |t|
  t.index [:article_id, :tag_id]
  t.index [:tag_id, :article_id]
end
```

### Polymorphic Associations

```ruby
class Comment < ApplicationRecord
  belongs_to :commentable, polymorphic: true
end

class Article < ApplicationRecord
  has_many :comments, as: :commentable
end

class Photo < ApplicationRecord
  has_many :comments, as: :commentable
end

# Migration
create_table :comments do |t|
  t.text :body
  t.references :commentable, polymorphic: true
  t.timestamps
end
```

### Self Joins

```ruby
class Employee < ApplicationRecord
  has_many :subordinates, class_name: "Employee", foreign_key: "manager_id"
  belongs_to :manager, class_name: "Employee", optional: true
end
```

### Single Table Inheritance (STI)

```ruby
# Migration
create_table :vehicles do |t|
  t.string :type  # STI column
  t.string :name
  t.integer :wheels
end

# Models
class Vehicle < ApplicationRecord
end

class Car < Vehicle
end

class Motorcycle < Vehicle
end

# Querying
Vehicle.all          # all vehicles
Car.all              # only cars (WHERE type = 'Car')
Vehicle.where(name: "Tesla")  # all vehicles named Tesla
```

### Delegated Types

Alternative to STI — uses separate tables per type:

```ruby
# Migration
create_table :entries do |t|
  t.string :entryable_type
  t.integer :entryable_id
  t.string :name
  t.timestamps
end

create_table :message_entries do |t|
  t.text :content
  t.timestamps
end

create_table :task_entries do |t|
  t.date :due_date
  t.timestamps
end

# Models
class Entry < ApplicationRecord
  delegated_type :entryable, types: %w[MessageEntry TaskEntry]
  delegate :content, to: :entryable
end

module Entryable
  extend ActiveSupport::Concern
  included do
    has_one :entry, as: :entryable, touch: true
  end
end

class MessageEntry < ApplicationRecord
  include Entryable
end

class TaskEntry < ApplicationRecord
  include Entryable
end
```

### Association Options

| Option | Description |
|--------|-------------|
| `:class_name` | Specify a different class name |
| `:foreign_key` | Override foreign key column |
| `:dependent` | `:destroy`, `:delete`, `:nullify`, `:restrict_with_error` |
| `:source` | For `:through` associations, specify source |
| `:counter_cache` | Cache count of associated records |
| `:touch` | Update `updated_at` on parent when child changes |
| `:polymorphic` | Enable polymorphic association |
| `:optional` | Allow `belongs_to` to be nil |

### Counter Cache

```ruby
class Article < ApplicationRecord
  has_many :comments
end

class Comment < ApplicationRecord
  belongs_to :article, counter_cache: true
end

# Requires comments_count column on articles table
article.comments.size  # uses cached count, no SQL query
```

## Query Interface

### Retrieving Single Objects

```ruby
Article.find(1)                    # by ID (raises ActiveRecord::RecordNotFound)
Article.find([1, 2, 3])            # multiple IDs
Article.first                      # first record
Article.last                       # last record
Article.take                       # random record
Article.find_by(title: "Hello")    # first match (nil if not found)
Article.find_by!(title: "Hello")   # first match (raises if not found)
```

### Retrieving Multiple Objects in Batches

```ruby
Article.all.each do |article| ... end  # loads all into memory

# Batch processing (memory efficient)
Article.find_each do |article| ... end           # default batch_size: 1000
Article.find_each(batch_size: 100) do |article| ... end
Article.find_each(start: 1000, finish: 5000) do |article| ... end
Article.find_in_batches(batch_size: 100) do |batch| ... end
```

### Conditions

```ruby
# Hash conditions (preferred)
Article.where(status: "published")
Article.where(status: ["published", "draft"])
Article.where(created_at: (Time.now.midnight - 1.day)..Time.now.midnight)
Article.where(author: "Alice", status: "published")

# String conditions (use placeholders for safety)
Article.where("title LIKE ?", "%Rails%")
Article.where("published_at > ?", 1.week.ago)
Article.where("views_count >= ? AND views_count <= ?", 100, 1000)

# NOT
Article.where.not(status: "draft")

# OR
Article.where(status: "published").or(Article.where(featured: true))

# AND (implicit with multiple where calls)
Article.where(status: "published").where(author: "Alice")
```

### Ordering

```ruby
Article.order(created_at: :desc)
Article.order(:title)
Article.order(author: :asc, created_at: :desc)
Article.order("LENGTH(title) DESC")
```

### Selecting Specific Fields

```ruby
Article.select(:title, :body)
Article.select("title, body")
Article.pluck(:title)          # array of titles (no instantiation)
Article.pluck(:title, :author) # array of arrays
Article.pick(:title)           # first title only (no instantiation)
Article.ids                    # array of IDs
```

### Limit and Offset

```ruby
Article.limit(10)
Article.limit(10).offset(20)  # pagination
```

### Grouping

```ruby
Article.group(:author)
Article.group(:author).count
Article.group(:status).average(:views_count)
Article.group(:author).having("COUNT(*) > 5")
```

### Overriding Conditions

```ruby
Article.where(status: "draft").unscope(where: :status)
Article.where(status: "draft").reselect(:title)
Article.order(created_at: :desc).reorder(:title)
Article.where(status: "draft").rewhere(status: "published")
Article.order(:title).reverse_order
```

### Eager Loading

```ruby
# N+1 problem (bad)
Article.all.each { |a| a.comments.count }  # 1 + N queries

# includes (fixes N+1)
Article.includes(:comments).each { |a| a.comments.count }  # 2 queries

# preload (always separate queries)
Article.preload(:comments)

# eager_load (LEFT JOIN)
Article.eager_load(:comments)

# strict_loading (raises on lazy load)
Article.strict_loading.includes(:comments)
```

### Joins

```ruby
Article.joins(:comments)                          # INNER JOIN
Article.joins(:comments).where(comments: { spam: false })
Article.left_outer_joins(:comments)               # LEFT JOIN
Article.where.associated(:comments)               # has at least one comment
Article.where.missing(:comments)                  # has no comments
```

### Scopes

```ruby
class Article < ApplicationRecord
  scope :published, -> { where(status: "published") }
  scope :recent, -> { order(created_at: :desc).limit(10) }
  scope :by_author, ->(author) { where(author: author) }

  # Default scope (use sparingly)
  default_scope { order(created_at: :desc) }
end

# Usage
Article.published
Article.published.recent
Article.by_author("Alice").published

# Merging scopes
Article.published.merge(Article.recent)

# Removing all scoping
Article.unscoped { Article.all }
```

### Enums

```ruby
class Article < ApplicationRecord
  enum :status, { draft: 0, published: 1, archived: 2 }
  enum :status, [:draft, :published, :archived]  # auto-assigned values
end

# Usage
article.draft!        # sets status to 0
article.published?    # true if status == 1
Article.published     # scope: WHERE status = 1
Article.statuses      # hash mapping
```

### Find or Build

```ruby
# Find or create
Article.find_or_create_by(title: "Hello")
Article.find_or_create_by!(title: "Hello")  # raises on validation error

# Find or initialize (not saved)
Article.find_or_initialize_by(title: "Hello")
```

### Calculations

```ruby
Article.count
Article.where(author: "Alice").count
Article.average(:views_count)
Article.minimum(:views_count)
Article.maximum(:views_count)
Article.sum(:views_count)
```

### Existence

```ruby
Article.exists?(1)
Article.exists?(title: "Hello")
Article.where(author: "Alice").exists?
Article.any?       # at least one record
Article.many?      # more than one record
Article.none?      # zero records
```

### Finding by SQL

```ruby
articles = Article.find_by_sql("SELECT * FROM articles WHERE author = 'Alice'")
results = Article.connection.select_all("SELECT COUNT(*) FROM articles")
```

### Null Relation

```ruby
Article.none  # returns empty relation, chainable
```

### Readonly Objects

```ruby
Article.readonly.first  # cannot be updated or destroyed
```

### Locking

```ruby
# Optimistic (requires lock_version column)
article = Article.find(1)
article.update!(title: "New")  # raises if another process updated since load

# Pessimistic
Article.transaction do
  article = Article.lock.find(1)
  article.update!(title: "New")
end
```

## Active Model

Active Model provides functionality for plain Ruby objects that need to integrate with Rails (forms, validations, etc.) without database persistence.

### Modules

```ruby
class Contact
  include ActiveModel::Model

  attr_accessor :name, :email, :message

  validates :name, :email, :message, presence: true
  validates :email, format: { with: /\A[^@\s]+@([^@\s]+\.)+[^@\s]+\z/ }
end

# Usage
contact = Contact.new(name: "Alice", email: "alice@example.com", message: "Hello")
contact.valid?   # true
contact.errors   # empty

contact = Contact.new(name: "")
contact.valid?   # false
contact.errors.full_messages  # ["Name can't be blank", ...]
```

### SecurePassword

```ruby
class User < ApplicationRecord
  has_secure_password  # requires password_digest column
end

# Usage
user = User.new(name: "Alice", password: "secret", password_confirmation: "secret")
user.authenticate("secret")  # returns user if correct, false otherwise
```

### Attributes API

```ruby
class Person < ApplicationRecord
  attribute :age, :integer, default: 0
  attribute :active, :boolean, default: true
end
```

### Dirty Tracking

```ruby
article = Article.find(1)
article.title_changed?       # true if title was changed
article.title_was            # previous value
article.title_change         # [old, new]
article.changes              # hash of all changes
article.saved_changes        # changes from last save
```

### Naming

```ruby
class Person < ApplicationRecord
end

Person.model_name.name       # "Person"
Person.model_name.singular   # "person"
Person.model_name.plural     # "people"
Person.model_name.element    # "person"
Person.model_name.collection # "people"
```

### Serialization

```ruby
class Article < ApplicationRecord
  serialize :metadata  # stores as YAML
  serialize :metadata, JSON  # stores as JSON
end
```
