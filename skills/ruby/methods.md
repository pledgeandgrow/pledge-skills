# Methods

Method definitions, arguments, calling methods, and keyword arguments.

## Defining methods

```ruby
def greet
  "Hello!"
end

def greet(name)
  "Hello, #{name}!"
end

# Default arguments
def greet(name = "World")
  "Hello, #{name}!"
end

# Return values (implicit return of last expression)
def add(a, b)
  a + b
end

# Explicit return
def validate(input)
  return false if input.nil?
  return false if input.empty?
  true
end
```

## Endless methods (Ruby 3.0+)

```ruby
def square(x) = x * x
def greet(name) = "Hello, #{name}!"
def pi = 3.14159
```

## Arguments

### Positional arguments

```ruby
def add(a, b, c)
  a + b + c
end

add(1, 2, 3)
```

### Default arguments

```ruby
def create_user(name, role = "user", active = true)
  # ...
end

create_user("Alice")
create_user("Bob", "admin")
create_user("Carol", "editor", false)
```

### Variable-length arguments (splat)

```ruby
def sum(*numbers)
  numbers.sum
end

sum(1, 2, 3)        # => 6
sum(1, 2, 3, 4, 5)  # => 15

# Splat in the middle
def method(a, *middle, b)
  # a is first, b is last, middle is everything between
end
```

### Keyword arguments

```ruby
def create_user(name:, email:, role: "user", active: true)
  # name and email are required, role and active have defaults
end

create_user(name: "Alice", email: "alice@example.com")
create_user(name: "Bob", email: "bob@example.com", role: "admin")
```

### Double splat (keyword splat)

```ruby
def process(**options)
  options.each { |k, v| puts "#{k}: #{v}" }
end

process(timeout: 30, retry: 3)

# Capturing extra keyword arguments
def configure(host:, port:, **extra)
  # host and port are extracted, extra captures the rest
end
```

### Mixed arguments

```ruby
def complex_method(a, b, *rest, keyword:, **opts)
  # a, b: required positional
  # rest: remaining positional
  # keyword: required keyword
  # opts: remaining keyword arguments
end
```

### Argument forwarding (Ruby 2.7+)

```ruby
def delegate(*args, **kwargs, &block)
  target_method(*args, **kwargs, &block)
end

# Ruby 3.0+ anonymous forwarding
def delegate(...)
  target_method(...)
end
```

### Array decomposition in arguments

```ruby
# Decompose array argument
def process_point((x, y))
  "Point at #{x}, #{y}"
end

process_point([3, 4])  # => "Point at 3, 4"

# Nested decomposition
def process_matrix((a, (b, c)))
  "#{a}, #{b}, #{c}"
end

process_matrix([1, [2, 3]])  # => "1, 2, 3"

# With splat in decomposition
def process((first, *rest))
  "First: #{first}, Rest: #{rest}"
end

process([1, 2, 3, 4])  # => "First: 1, Rest: [2, 3, 4]"
```

### Keyword arguments ordering rules (Ruby 3.0+)

Ruby 3.0 separated positional and keyword arguments:

```ruby
# Ruby 2.x — keyword args could be passed as last hash
def method(a, b: 1)
  # ...
end
method(1, {b: 2})  # Works in 2.x, ArgumentError in 3.0+

# Ruby 3.0+ — must use explicit keyword args
method(1, b: 2)    # Correct in 3.0+

# Splat with keyword args
def method(*args, **kwargs)
  # args is array, kwargs is hash
end

method(1, 2, key: "value")  # args=[1, 2], kwargs={key: "value"}
```

## Calling methods

### Basic calling

```ruby
object.method_name
object.method_name(arg1, arg2)
object.method_name arg1, arg2  # Parentheses optional (but recommended)
```

### Send (dynamic dispatch)

```ruby
object.send(:method_name, arg)
object.public_send(:method_name, arg)  # Respects visibility
object.__send__(:method_name, arg)     # Safe even if send is overridden
```

### Method objects

```ruby
method = "hello".method(:upcase)
method.call    # => "HELLO"
method.()      # => "HELLO"
method[]       # => "HELLO"
```

### Method missing

```ruby
class DynamicProxy
  def method_missing(name, *args, &block)
    puts "Called #{name} with #{args}"
  end

  def respond_to_missing?(name, include_private = false)
    true  # Always respond
  end
end
```

## Blocks

### Yielding to blocks

```ruby
def each_item
  [1, 2, 3].each { |item| yield item }
end

each_item { |item| puts item }
```

### Explicit block parameter

```ruby
def each_item(&block)
  [1, 2, 3].each(&block)
end

each_item { |item| puts item }
```

### Block_given?

```ruby
def maybe_yield
  if block_given?
    yield
  else
    "No block given"
  end
end

maybe_yield { "Block!" }  # => "Block!"
maybe_yield               # => "No block given"
```

### Passing block as argument

```ruby
def run_block(&block)
  block.call
end

my_block = proc { puts "Hello" }
run_block(&my_block)
```

## Method visibility

```ruby
class MyClass
  def public_method
    "I'm public"
  end

  private

  def private_method
    "I'm private"
  end

  protected

  def protected_method
    "I'm protected"
  end

  # Individual visibility
  def another_private; end
  private :another_private
end
```

## Class methods

```ruby
class MyClass
  # Three equivalent ways
  def self.class_method
    "Class method"
  end

  def MyClass.another_way
    "Also a class method"
  end

  class << self
    def yet_another
      "Yet another way"
    end
  end
end
```

## Operator methods

```ruby
class Vector
  attr_reader :x, :y

  def initialize(x, y)
    @x, @y = x, y
  end

  def +(other)
    Vector.new(@x + other.x, @y + other.y)
  end

  def ==(other)
    @x == other.x && @y == other.y
  end

  def -@
    Vector.new(-@x, -@y)  # Unary minus
  end

  def [](index)
    case index
    when 0 then @x
    when 1 then @y
    end
  end

  def to_s
    "(#{@x}, #{@y})"
  end
end

v1 = Vector.new(1, 2)
v2 = Vector.new(3, 4)
v1 + v2       # => (4, 6)
v1 == v2      # => false
-v1           # => (-1, -2)
v1[0]         # => 1
```

## Method aliases

```ruby
class MyClass
  def original_method
    "Original"
  end

  alias :alias_method :original_method
end
```

## Best practices

1. Keep methods short and focused (single responsibility)
2. Use keyword arguments for 3+ parameters
3. Use default arguments to reduce overloads
4. Prefer `public_send` over `send` for safety
5. Always define `respond_to_missing?` when using `method_missing`
6. Use endless methods for trivial one-liners
7. Parentheses are optional but recommended for clarity
8. Use argument forwarding (`...`) for delegation
