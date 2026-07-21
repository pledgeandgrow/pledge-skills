# Classes and Modules

Object-oriented programming in Ruby: classes, modules, inheritance, mixins, and more.

## Classes

### Basic class

```ruby
class Person
  attr_accessor :name, :age

  def initialize(name, age)
    @name = name
    @age = age
  end

  def greet
    "Hello, I'm #{@name}!"
  end
end

person = Person.new("Alice", 30)
person.name   # => "Alice"
person.greet  # => "Hello, I'm Alice!"
```

### Attribute accessors

```ruby
class Product
  attr_reader :sku          # Read-only
  attr_writer :stock        # Write-only
  attr_accessor :price      # Read/write
end
```

### Constructor

```ruby
class Point
  def initialize(x = 0, y = 0)
    @x = x
    @y = y
  end
end
```

## Inheritance

```ruby
class Animal
  def initialize(name)
    @name = name
  end

  def speak
    "Some sound"
  end
end

class Dog < Animal
  def speak
    "Woof!"
  end
end

class Cat < Animal
  def speak
    "Meow!"
  end
end

Dog.new("Rex").speak  # => "Woof!"
Cat.new("Whiskers").speak  # => "Meow!"
```

### super

```ruby
class Base
  def initialize(name)
    @name = name
  end
end

class Derived < Base
  def initialize(name, age)
    super(name)       # Pass all arguments to parent
    @age = age
  end

  def greet
    super              # Call parent's greet (no args)
    puts "I'm #{@age} years old"
  end

  def custom
    super()            # Explicitly pass no arguments
  end
end
```

## Modules

### Namespacing

```ruby
module Commerce
  class Order
    # ...
  end

  class Product
    # ...
  end
end

order = Commerce::Order.new
```

### Mixins (include)

```ruby
module Walkable
  def walk
    "#{name} is walking"
  end
end

class Person
  include Walkable

  attr_reader :name

  def initialize(name)
    @name = name
  end
end

Person.new("Alice").walk  # => "Alice is walking"
```

### Extend (class methods)

```ruby
module Findable
  def find(id)
    # ...
  end
end

class User
  extend Findable
end

User.find(1)
```

### include vs extend vs prepend

```ruby
# include — adds module methods as instance methods
class A
  include M  # A.new.m_method
end

# extend — adds module methods as class methods
class B
  extend M   # B.m_method
end

# prepend — inserts module BEFORE the class in method lookup
module C
  def method
    super     # Calls the original method
    "enhanced"
  end
end

class D
  prepend C
end
```

### Enumerable mixin

```ruby
class Collection
  include Enumerable

  def initialize(items)
    @items = items
  end

  def each
    @items.each { |item| yield item }
  end
end

col = Collection.new([1, 2, 3, 4, 5])
col.map { |n| n * 2 }     # => [2, 4, 6, 8, 10]
col.select(&:even?)       # => [2, 4]
col.reduce(:+)            # => 15
col.min                  # => 1
col.max                  # => 5
col.sort                 # => [1, 2, 3, 4, 5]
col.include?(3)          # => true
```

### Comparable mixin

```ruby
class Temperature
  include Comparable

  attr_reader :celsius

  def initialize(celsius)
    @celsius = celsius
  end

  def <=>(other)
    celsius <=> other.celsius
  end
end

t1 = Temperature.new(20)
t2 = Temperature.new(30)

t1 < t2    # => true
t1 == t2   # => false
t1.between?(Temperature.new(10), Temperature.new(40))  # => true
```

## Constants

```ruby
class Configuration
  DEFAULT_PORT = 3000
  MAX_RETRIES = 3
  VERSION = "1.0.0"
end

Configuration::DEFAULT_PORT  # => 3000
```

## Class variables vs instance variables vs class instance variables

```ruby
class Counter
  @@count = 0        # Class variable (shared with subclasses)

  @total = 0         # Class instance variable (not shared)

  def initialize
    @@count += 1
  end

  def self.count
    @@count
  end
end
```

## Struct

```ruby
Person = Struct.new(:name, :age) do
  def greet
    "Hello, I'm #{name}!"
  end
end

p = Person.new("Alice", 30)
p.name    # => "Alice"
p.age     # => 30
p.greet   # => "Hello, I'm Alice!"
p == Person.new("Alice", 30)  # => true
```

## Data (Ruby 3.2+)

```ruby
class Point < Data.define(:x, :y)
  def distance_to(other)
    Math.sqrt((x - other.x)**2 + (y - other.y)**2)
  end
end

p1 = Point.new(x: 0, y: 0)
p2 = Point.new(x: 3, y: 4)
p1.distance_to(p2)  # => 5.0
p1.x = 10  # Error — Data objects are immutable
```

## Access modifiers

```ruby
class BankAccount
  def initialize(balance)
    @balance = balance
  end

  # Public by default
  def deposit(amount)
    @balance += amount
  end

  # Private — cannot be called with explicit receiver
  private

  def validate_amount(amount)
    amount > 0
  end

  # Protected — can be called by instances of same class
  protected

  def compare_balance(other)
    @balance <=> other.balance
  end
end
```

## Singleton class

```ruby
class Person
  def name
    "Alice"
  end
end

# Add a method to a single instance
person = Person.new
def person.custom_method
  "Only this instance has this method"
end
```

## Refinements

Refinements are a safer alternative to monkey-patching — they apply scoped, temporary modifications to classes.

### Basic usage

```ruby
module StringRefinements
  refine String do
    def shout
      upcase + "!!!"
    end
  end
end

using StringRefinements

"hello".shout  # => "HELLO!!!"
# Only active within the scope where `using` is called
```

### Scope rules

`using` applies to the entire file (when at top level) or to the entire module/class body:

```ruby
# Top-level using — applies to rest of file
using StringRefinements
"hello".shout  # Works

# Inside a module — applies to the module body only
module MyApp
  using StringRefinements
  "hello".shout  # Works here
end

"hello".shout  # NoMethodError (outside module scope)
```

### super in refinements

Refined methods can call the original method via `super`:

```ruby
module LoggingRefinements
  refine String do
    def upcase
      puts "Calling upcase on #{self}"
      super  # Calls the original String#upcase
    end
  end
end

using LoggingRefinements
"hello".upcase
# Output: Calling upcase on hello
# => "HELLO"
```

### Method lookup with refinements

Refined methods take priority in the lookup chain:

```ruby
module ExampleRefinement
  refine Integer do
    def to_s
      "Number: #{super}"
    end
  end
end

using ExampleRefinement
5.to_s  # => "Number: 5"
```

### Refinement inheritance via include

When a module that uses a refinement is included, the refinement is inherited:

```ruby
module SharedBehavior
  refine String do
    def emphasized
      "*** #{self} ***"
    end
  end
end

module UsefulStuff
  using SharedBehavior

  def self.format(text)
    text.emphasized
  end
end

UsefulStuff.format("hello")  # => "*** hello ***"
```

### Refining multiple classes

```ruby
module Formatters
  refine String do
    def titleize
      split.map(&:capitalize).join(" ")
    end
  end

  refine Array do
    def titleize
      map(&:titleize).join(", ")
    end
  end
end

using Formatters
"hello world".titleize  # => "Hello World"
["hello", "world"].titleize  # => "Hello, World"
```

## Method lookup path

```ruby
class MyClass
  include ModuleA
  include ModuleB
  prepend ModuleC
end

# Lookup order (first to last):
# 1. ModuleC (prepended)
# 2. MyClass
# 3. ModuleB (last included)
# 4. ModuleA (first included)
# 5. Object
# 6. Kernel
# 7. BasicObject
```

## Best practices

1. Prefer composition over inheritance
2. Use modules for shared behavior (mixins)
3. Keep classes small and focused (SRP)
4. Use `attr_accessor` / `attr_reader` / `attr_writer` instead of manual getters/setters
5. Use `Struct` for simple value objects
6. Use `Data.define` for immutable value objects (Ruby 3.2+)
7. Avoid class variables (`@@`) — use class instance variables instead
8. Use `private` and `protected` appropriately
9. Use refinements instead of monkey-patching when possible
10. Define `to_s` for meaningful string representation
