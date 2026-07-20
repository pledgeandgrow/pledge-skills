# Active Support — Core Extensions and Instrumentation

## What is Active Support?

Active Support provides Ruby language extensions and utilities used across Rails. It enriches Ruby's core classes with convenience methods.

## Extensions to All Objects

### blank? and present?

```ruby
nil.blank?                    # true
"".blank?                     # true
"  ".blank?                  # true
[].blank?                     # true
{}.blank?                     # true
false.blank?                  # true
0.blank?                      # false (numbers are never blank)
"text".blank?                # false
[1, 2].blank?                # false

"hello".present?             # true
"".present?                  # false
```

### presence

Returns receiver if `present?`, otherwise `nil`:

```ruby
host = config[:host].presence || "localhost"
name = params[:name].presence || "Anonymous"
```

### deep_dup

Deep copy of objects:

```ruby
original = { a: [1, 2, 3] }
copy = original.deep_dup
copy[:a] << 4
original[:a]  # [1, 2, 3] — unchanged
```

### try

Calls method if not nil:

```ruby
@person.try(:name)           # nil if @person is nil
@person.try(:name, "default")
@person&.name                # Ruby's safe navigation operator (preferred)

# try! raises if method doesn't exist
@person.try!(:nonexistent)   # NoMethodError
```

### in?

```ruby
1.in?([1, 2, 3])             # true
"hello".in?("hello world")   # true
:active.in?(status)          # checks inclusion
```

### with_options

Groups options:

```ruby
class Account < ApplicationRecord
  with_options dependent: :destroy do
    has_many :customers
    has_many :products
    has_many :invoices
  end
end

# Also in routes:
with_options controller: 'admin' do
  get 'admin/dashboard'
  get 'admin/reports'
end
```

### to_param

```ruby
class User
  def to_param
    "#{id}-#{name.parameterize}"
  end
end

user_path(@user)  # /users/42-john-doe
```

### to_query

```ruby
{ name: "John", age: 30 }.to_query  # "age=30&name=John"
["rails", "ruby"].to_query("tags")  # "tags%5B%5D=rails&tags%5B%5D=ruby"
```

### Instance Variables

```ruby
object.instance_values    # hash of instance variables
object.instance_variable_names
```

## Extensions to Module

### Method Delegation

```ruby
class Entry < ApplicationRecord
  delegate :name, :email, to: :user
  delegate :street, :city, to: :address, prefix: true
  delegate :full_name, to: :user, allow_nil: true
end

entry.name          # calls entry.user.name
entry.address_street  # calls entry.address.street
entry.full_name     # nil if user is nil (allow_nil)
```

### Attributes

```ruby
class Person
  attr_accessor :name, :age

  cattr_accessor :default_country
  cattr_reader :count
end

Person.default_country = "US"
```

## Extensions to Class

### Class Attributes

```ruby
class Application
  class_attribute :settings, default: {}
end

class SubApp < Application
  self.settings = { theme: "dark" }
end

Application.settings  # {}
SubApp.settings       # { theme: "dark" }
```

### Descendants

```ruby
ActiveRecord::Base.descendants
# Returns all subclasses
```

## Extensions to String

### Output Safety

```ruby
raw("<b>Bold</b>")         # outputs without escaping
html_safe_string = "Hello".html_safe
html_safe_string + "<b>"   # escapes non-safe parts
```

### remove and squish

```ruby
"Hello World".remove("World")     # "Hello "
"  Hello   World  ".squish       # "Hello World"
```

### truncate

```ruby
"Hello World".truncate(8)              # "Hello..."
"Hello World".truncate(8, omission: "[...]")  # "Hel[...]"
"Hello World".truncate_words(1)        # "Hello..."
```

### starts_with? and ends_with?

```ruby
"hello".starts_with?("he")   # true
"hello".ends_with?("lo")     # true
```

### indent

```ruby
"foo\nbar".indent(2)    # "  foo\n  bar"
"foo".indent(2, '-')    # "--foo"
```

### Inflections

```ruby
"person".pluralize        # "people"
"people".singularize      # "person"
"hello world".titleize    # "Hello World"
"hello_world".camelize    # "HelloWorld"
"HelloWorld".underscore   # "hello_world"
"hello world".parameterize # "hello-world"
"hello".upcase_first      # "Hello"
"Hello".downcase_first    # "hello"
```

### Conversions

```ruby
"42".to_i           # 42
"3.14".to_f         # 3.14
"true".to_b         # true (Rails extension)
```

## Extensions to Numeric

### Bytes

```ruby
1.kilobyte    # 1024
1.megabyte    # 1048576
1.gigabyte    # 1073741824
1.terabyte    # 1099511627776
```

### Time

```ruby
1.second     # 1
1.minute     # 60
1.hour       # 3600
1.day        # 86400
1.week       # 604800
1.fortnight  # 1209600
1.month      # approx 2629800
1.year       # approx 31557600

# Combined with from_now, ago
1.hour.from_now      # Time.current + 1.hour
2.days.ago           # Time.current - 2.days
1.week.from_now
```

### Formatting

```ruby
1234567.to_s(:delimited)        # "1,234,567"
1234567.to_s(:human)            # "1.23 Million"
42.to_s(:rounded, precision: 2) # "42.00"
```

## Extensions to Integer

```ruby
4.multiple_of?(2)     # true
1.ordinal             # "st"
2.ordinal             # "nd"
3.ordinal             # "rd"
1.ordinalize          # "1st"
2.ordinalize          # "2nd"
```

## Extensions to Enumerable

```ruby
[1, 2, 3].index_by(&:to_s)     # { "1" => 1, "2" => 2, "3" => 3 }
[1, 2, 3].index_with { |x| x * 2 }  # { 1 => 2, 2 => 4, 3 => 6 }
[1, 2, 3].many?               # false
[1, 2, 3].exclude?(4)         # true
[1, 2, 3].including(4)        # [1, 2, 3, 4]
[1, 2, 3].excluding(2)        # [1, 3]
[users].pluck(:name)          # ["Alice", "Bob"]
[users].pick(:name)           # "Alice" (first)
```

## Extensions to Array

```ruby
[1, 2, 3].from(1)       # [2, 3]
[1, 2, 3].to(1)         # [1, 2]
[1, 2, 3].second        # 2
[1, 2, 3].third         # 3
[1, 2, 3].last(2)       # [2, 3]
[1, 2, 3, 4].in_groups_of(2)  # [[1, 2], [3, 4]]
[1, 2, 3].in_groups_of(2, false)  # [[1, 2], [3, nil]] vs [[1, 2], [3]]

# Wrapping
Array("hello")    # ["hello"]
Array([1, 2])     # [1, 2]
Array(nil)        # [nil]
Array.wrap("hello")  # ["hello"] (wraps non-arrays)
```

## Extensions to Hash

```ruby
hash = { name: "Alice", age: 30 }

hash.deep_transform_keys(&:to_s)  # { "name" => "Alice", "age" => 30 }
hash.deep_transform_values(&:to_s)

# Slicing
hash.slice(:name)           # { name: "Alice" }
hash.except(:age)           # { name: "Alice" }

# Indifferent access
hash = { name: "Alice" }.with_indifferent_access
hash[:name]   # "Alice"
hash["name"]  # "Alice"

# Deep merge
{ a: { b: 1 } }.deep_merge({ a: { c: 2 } })  # { a: { b: 1, c: 2 } }

# Reverse merge (defaults)
{ name: "Alice" }.reverse_merge(name: "Default", age: 30)  # { name: "Alice", age: 30 }
```

## Extensions to Date and Time

```ruby
Date.today
Date.yesterday
Date.tomorrow

Date.current              # timezone-aware
2.days.ago
3.days.from_now
1.month.ago
1.year.from_now

Time.current
Time.now.beginning_of_day
Time.now.end_of_day
Time.now.beginning_of_week
Time.now.end_of_month

# Date calculations
date = Date.today
date + 1.day
date - 1.week
date.next_month
date.prev_month
date.beginning_of_month
date.end_of_month

# Duration
1.hour.ago
30.minutes.from_now
```

## Active Support Instrumentation

### ActiveSupport::Notifications

Subscribe to events:

```ruby
ActiveSupport::Notifications.subscribe("process_action.action_controller") do |name, started, finished, unique_id, payload|
  Rails.logger.info("Action took #{finished - started}s")
end

# With filter
ActiveSupport::Notifications.subscribe("sql.active_record") do |name, started, finished, unique_id, payload|
  if payload[:sql].include?("SELECT")
    Rails.logger.debug("Query: #{payload[:sql]}")
  end
end
```

### Instrumenting Your Code

```ruby
ActiveSupport::Notifications.instrument("my_event.my_app", user_id: 42) do
  # code to instrument
  perform_expensive_operation
end
```

### Built-in Events

| Event | Payload |
|-------|---------|
| `process_action.action_controller` | controller, action, params, format, method, path, status, view_runtime, db_runtime |
| `sql.active_record` | sql, name, connection_id, binds |
| `render.action_view` | identifier, layout |
| `deliver.action_mailer` | mailer, message_id, subject, to, from |
| `enqueue.active_job` | job, adapter |
| `perform.active_job` | job, adapter |

## Concerns

```ruby
module Commentable
  extend ActiveSupport::Concern

  included do
    has_many :comments, as: :commentable, dependent: :destroy
  end

  def comments_count
    comments.count
  end
end

class Article < ApplicationRecord
  include Commentable
end
```

## ActiveSupport::Cache

```ruby
Rails.cache.fetch("user:#{user.id}", expires_in: 1.hour) do
  user.expensive_computation
end

Rails.cache.write("key", "value", expires_in: 1.hour)
Rails.cache.read("key")
Rails.cache.delete("key")
Rails.cache.exist?("key")
Rails.cache.clear
```

## CurrentAttributes

```ruby
class Current < ActiveSupport::CurrentAttributes
  attribute :user, :request_id

  def user=(user)
    super
    self.request_id = user.request_id if user
  end
end

# Usage anywhere:
Current.user = current_user
Current.user  # available throughout the request
```

## ActiveSupport::MessageEncryptor

```ruby
encryptor = ActiveSupport::MessageEncryptor.new(Rails.application.secret_key_base[0..31])
encrypted = encryptor.encrypt_and_sign("sensitive data")
decrypted = encryptor.decrypt_and_verify(encrypted)
```
