# Style Guide

Ruby style conventions: source code layout, naming, formatting, and best practices.

## Source code layout

### Indentation

- Use **2 spaces** per indentation level (no tabs)
- Indent `when` clauses at the same level as `case`

```ruby
case
when stage == :init
  initialize
when stage == :running
  process
end
```

### Line length

- Limit lines to **80 characters** where reasonable
- Break long chains with continuation

```ruby
# Good
result = collection
  .select { |item| item.valid? }
  .map { |item| item.transform }
  .compact
```

### Spaces

```ruby
# Around operators
sum = 1 + 2
x = y * z

# No spaces inside brackets (for method calls)
do_something(arg1, arg2)

# Spaces inside braces for hash literals
{ key: value }

# No space after bang
!array.empty?

# No space inside range literals
(1..5)

# Space around equals in keyword args
def method(arg:, opt: default)
```

### Empty lines

- One empty line between methods
- Two or more empty lines should be avoided
- Empty lines around access modifiers
- Empty lines around attribute accessors

```ruby
class MyClass
  attr_reader :name

  def initialize(name)
    @name = name
  end

  private

  def secret_method
    # ...
  end
end
```

### Trailing commas

```ruby
# Good — trailing comma in multi-line
arr = [
  1,
  2,
  3,
]

hash = {
  name: "Alice",
  age: 30,
}
```

## Naming conventions

### Variables and methods

- Use `snake_case` for variables, methods, and symbols
- Use `?` suffix for predicate methods (return boolean)
- Use `!` suffix for dangerous methods (mutate receiver, raise)

```ruby
first_name = "Alice"
user.active?        # Predicate
user.save!          # Dangerous (raises on failure)
array.sort          # Safe (returns new array)
array.sort!         # Dangerous (mutates in place)
```

### Classes and modules

- Use `CamelCase` (PascalCase) for classes and modules

```ruby
class UserAccount
  # ...
end

module PaymentGateway
  # ...
end
```

### Constants

- Use `SCREAMING_SNAKE_CASE` for constants

```ruby
MAX_RETRIES = 3
DEFAULT_TIMEOUT = 30
```

### Files

- Use `snake_case` for filenames
- One class per file (when practical)

```ruby
# user_account.rb
class UserAccount
  # ...
end
```

### Other naming rules

- Use `other` as the parameter for `==` and similar comparisons
- Prefix unused variables with `_`
- Avoid abbreviations (use `database` not `db`)

```ruby
def ==(other)
  self.value == other.value
end

_unused, used = compute_values
```

## Flow of control

### if vs unless

```ruby
# Good — use unless for negative conditions
do_something unless condition

# Bad — don't use unless with else
unless condition
  do_this
else
  do_that  # Confusing
end

# Use if/else instead
if condition
  do_that
else
  do_this
end
```

### Ternary operator

```ruby
# Good — single line
result = condition ? "yes" : "no"

# Bad — nested ternary
condition ? a : (other ? b : c)

# Bad — multi-line ternary
result = condition ?
  "yes" :
  "no"
```

### case vs if-else

```ruby
# Good — use case for multiple comparisons
case status
when :active then "Active"
when :inactive then "Inactive"
when :pending then "Pending"
else "Unknown"
end
```

### Loops

```ruby
# Avoid for loops — use each
[1, 2, 3].each { |n| puts n }

# Avoid while with explicit counter
# Use times, upto, or each
3.times { |i| puts i }
```

### return

```ruby
# Good — implicit return (last expression)
def add(a, b)
  a + b
end

# Good — early return for guard clauses
def process(data)
  return nil if data.nil?
  return [] if data.empty?

  data.map { |item| transform(item) }
end

# Bad — explicit return at the end
def add(a, b)
  return a + b
end
```

## Strings

```ruby
# Prefer double quotes for interpolation
name = "Alice"
greeting = "Hello, #{name}!"

# Prefer string interpolation over concatenation
"Hello, #{name}!"  # Good
"Hello, " + name + "!"  # Bad

# Use %q for strings with single quotes
%q{It's a string with 'quotes'}

# Use heredocs for multi-line
text = <<~HEREDOC
  Multi-line text
  with indentation
HEREDOC
```

## Collections

```ruby
# Use literal syntax
arr = []           # Good (not Array.new)
hash = {}          # Good (not Hash.new)

# Use %w for string arrays
COLORS = %w[red green blue]  # Good

# Use symbols as hash keys
{ name: "Alice" }  # Good
{ :name => "Alice" }  # Old syntax (avoid in new code)

# Use fetch with default
hash.fetch(:key, "default")

# Don't modify collections while iterating
# Build a new collection instead
```

## Blocks

```ruby
# Single-line: use braces
arr.map { |n| n * 2 }

# Multi-line: use do...end
arr.each do |item|
  process(item)
  log(item)
end

# Prefer &method shorthand
arr.map(&:upcase)  # Good

# Use explicit block argument when needed
def method(&block)
  block.call
end
```

## Methods

```ruby
# Keep methods short (under 10 lines ideally)
# Use keyword arguments for 3+ parameters

def create_user(name:, email:, role: "user", active: true)
  # ...
end

# Avoid single-line methods (use endless methods in 3.0+)
def square(x) = x * x  # Good (Ruby 3.0+)

# Use parentheses for method definitions with args
def method(arg1, arg2)  # Good
def method arg1, arg2   # Bad
```

## Classes and modules

```ruby
# Use Struct for simple value objects
Person = Struct.new(:name, :age) do
  def greet
    "Hello, I'm #{name}"
  end
end

# Use Data.define for immutable value objects (Ruby 3.2+)
Point = Data.define(:x, :y)

# Avoid class variables (@@)
# Use class instance variables instead
class Counter
  @count = 0  # Class instance variable

  class << self
    attr_accessor :count
  end
end

# Use attr_accessor family
class Product
  attr_reader :sku
  attr_accessor :price
end

# Define to_s
class Person
  def to_s
    "#{name} (#{age})"
  end
end
```

## Exceptions

```ruby
# Use raise (not fail) for raising
raise ArgumentError, "Invalid input"

# Don't rescue Exception — rescue StandardError
begin
  risky
rescue StandardError => e
  handle(e)
end

# Don't use exceptions for control flow
# Return values or use pattern matching instead
```

## Comments

```ruby
# Write comments in English
# Write self-documenting code first
# Use comments to explain WHY, not WHAT

# Good
# Using binary search because the array is sorted
index = array.bsearch { |x| x >= target }

# Bad
# Loop through the array
array.each { |item| process(item) }
```

### Annotations

```ruby
# TODO: Not yet implemented
# FIXME: Known bug
# OPTIMIZE: Performance issue
# HACK: Workaround
# REVIEW: Needs review
```

## Magic comments

```ruby
# frozen_string_literal: true
# encoding: utf-8
# shareable_constant_value: literal

# Magic comments must be at the top (or after shebang)
#!/usr/bin/env ruby
# frozen_string_literal: true
```

## Metaprogramming

```ruby
# Avoid needless metaprogramming
# Prefer explicit code over dynamic code

# Don't monkey patch core classes
# Use refinements instead

# Always define respond_to_missing? with method_missing
class Dynamic
  def method_missing(name, *)
    # ...
  end

  def respond_to_missing?(name, include_private = false)
    # ...
  end
end

# Prefer public_send over send
object.public_send(:method)
```

## Tools

### RuboCop

```bash
# Install
gem install rubocop

# Check code
rubocop
rubocop --auto-correct
rubocop --auto-correct-all

# Configuration (.rubocop.yml)
```

```yaml
# .rubocop.yml
AllCops:
  NewCops: enable
  TargetRubyVersion: 3.4

Style/Documentation:
  Enabled: false

Metrics/MethodLength:
  Max: 20
```

## Best practices summary

1. Use 2 spaces for indentation (no tabs)
2. Limit lines to 80 characters
3. Use meaningful variable and method names
4. Prefer `snake_case` for methods/variables, `CamelCase` for classes
5. Use `?` and `!` suffixes appropriately
6. Prefer implicit returns
7. Use keyword arguments for 3+ parameters
8. Keep methods short and focused
9. Write self-documenting code (comments explain WHY)
10. Use RuboCop for automated style enforcement
