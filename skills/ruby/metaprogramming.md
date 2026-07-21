# Metaprogramming

Reflection, dynamic method definition, eval, and advanced Ruby metaprogramming.

## Reflection

### Introspection

```ruby
string = "hello"

string.class                   # => String
string.is_a?(Object)           # => true
string.instance_variables      # => []
string.methods                 # => [:upcase, :downcase, ...]
string.public_methods
string.private_methods
string.singleton_methods       # => []

# Class introspection
String.ancestors               # => [String, Comparable, Object, ...]
String.instance_methods        # => [:upcase, ...]
String.superclass              # => Object
String.included_modules        # => [Comparable, Kernel]
String.constants               # => [:VERSION, ...]
```

### Object methods

```ruby
obj.respond_to?(:method_name)      # Check if responds to method
obj.send(:method_name, arg)        # Call method dynamically
obj.public_send(:method_name)      # Call respecting visibility
obj.method(:method_name)           # Get Method object
obj.instance_variable_get(:@var)   # Get instance variable
obj.instance_variable_set(:@var, value)  # Set instance variable
obj.instance_variable_defined?(:@var)    # Check if defined
```

### Class methods

```ruby
klass = MyClass
klass.instance_method(:method_name)  # UnboundMethod
klass.method_defined?(:method_name)  # Check if method exists
klass.private_method_defined?(:m)
klass.protected_method_defined?(:m)
klass.const_get(:CONSTANT_NAME)
klass.const_set(:NEW_CONST, value)
klass.name                    # => "MyClass"
klass.method_defined?(:m)
```

## Dynamic method definition

### define_method

```ruby
class DynamicClass
  define_method :greet do |name|
    "Hello, #{name}!"
  end
end

DynamicClass.new.greet("Alice")  # => "Hello, Alice!"

# Define multiple methods
[:admin, :editor, :viewer].each do |role|
  define_method("is_#{role}?") do
    self.role == role
  end
end
```

### method_missing

```ruby
class FlexibleHash
  def initialize
    @data = {}
  end

  def method_missing(name, *args, &block)
    if name.to_s.end_with?('=')
      @data[name.to_s.chomp('=').to_sym] = args.first
    elsif @data.key?(name)
      @data[name]
    else
      super
    end
  end

  def respond_to_missing?(name, include_private = false)
    name.to_s.end_with?('=') || @data.key?(name) || super
  end
end

h = FlexibleHash.new
h.name = "Alice"
h.name  # => "Alice"
```

### remove_method / undef_method

```ruby
class MyClass
  def method_to_remove; end

  # Remove method (can be redefined by ancestors)
  remove_method :method_to_remove

  # Undef method (cannot be found in ancestors)
  undef_method :method_to_remove
end
```

## eval

```ruby
result = eval("1 + 2")  # => 3

eval("x = 10")
eval("x + 5")  # => 15

# With binding
def evaluate_in_context
  x = 42
  binding.eval("x")  # => 42
end

# eval with file and line info
eval(code, binding, "my_code.rb", 1)
```

### instance_eval and class_eval

```ruby
# instance_eval — changes `self` to the receiver
"hello".instance_eval do
  upcase  # => "HELLO" (self is "hello")
end

# class_eval (module_eval) — evaluates in class context
String.class_eval do
  def shout
    upcase + "!!!"
  end
end

"hello".shout  # => "HELLO!!!"

# With block
Integer.class_eval do
  define_method(:double) { self * 2 }
end

5.double  # => 10
```

### instance_exec and class_exec

```ruby
# Like instance_eval but can take arguments
obj.instance_exec(1, 2) do |a, b|
  a + b
end
```

## Open classes (Monkey patching)

```ruby
class String
  def palindrome?
    cleaned = downcase.gsub(/[^a-z]/, '')
    cleaned == cleaned.reverse
  end
end

"A man, a plan, a canal: Panama".palindrome?  # => true
```

## Refinements (safer monkey patching)

```ruby
module StringExtensions
  refine String do
    def shout
      upcase + "!!!"
    end
  end
end

module MyApp
  using StringExtensions

  "hello".shout  # => "HELLO!!!" (only within this module)
end

"hello".shout  # NoMethodError (outside the using scope)
```

## const_get and const_set

```ruby
# Dynamic constant access
class_name = "User"
klass = Object.const_get(class_name)

# Set new constant
Object.const_set(:DYNAMIC_CONST, 42)
DYNAMIC_CONST  # => 42
```

## define_singleton_method

```ruby
obj = Object.new
obj.define_singleton_method(:custom) do
  "I'm unique to this object"
end

obj.custom  # => "I'm unique to this object"
```

## Class macros

```ruby
class ActiveRecord
  def self.has_many(name)
    define_method(name) do
      instance_variable_get("@#{name}") || []
    end

    define_method("#{name}=") do |value|
      instance_variable_set("@#{name}", value)
    end
  end
end

class User < ActiveRecord
  has_many :posts
  has_many :comments
end

user = User.new
user.posts = [1, 2, 3]
user.posts  # => [1, 2, 3]
```

## attr_accessor with hooks

```ruby
class SmartAttr
  def self.attr_with_default(name, default)
    define_method(name) do
      instance_variable_get("@#{name}") || default
    end

    define_method("#{name}=") do |value|
      old_value = instance_variable_get("@#{name}")
      instance_variable_set("@#{name}", value)
      send("#{name}_changed", old_value, value) if respond_to?("#{name}_changed")
    end
  end
end
```

## TracePoint

```ruby
trace = TracePoint.new(:call, :return) do |tp|
  puts "#{tp.event}: #{tp.defined_class}##{tp.method_id}"
end

trace.enable
some_method()
trace.disable
```

## Best practices

1. **Avoid monkey patching** — Use refinements when possible
2. **Always define `respond_to_missing?`** when using `method_missing`
3. **Prefer `define_method`** over `eval` for dynamic methods
4. **Use `public_send`** instead of `send` to respect visibility
5. **Be cautious with `eval`** — security risk with user input
6. **Keep metaprogramming minimal** — it makes code harder to understand
7. **Document dynamic methods** — they won't show up in `methods` normally
8. **Use `class_eval` with blocks** instead of strings when possible
9. **Test metaprogrammed code thoroughly** — edge cases are common
10. **Consider performance** — `method_missing` is slower than defined methods
