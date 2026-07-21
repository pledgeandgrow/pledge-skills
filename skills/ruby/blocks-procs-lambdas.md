# Blocks, Procs, and Lambdas

Ruby's closure system: blocks, Procs, lambdas, and method objects.

## Blocks

Blocks are anonymous chunks of code passed to methods. They are not objects themselves.

### Single-line blocks

```ruby
[1, 2, 3].each { |n| puts n }
[1, 2, 3].map { |n| n * 2 }  # => [2, 4, 6]
```

### Multi-line blocks (do...end)

```ruby
[1, 2, 3].each do |n|
  doubled = n * 2
  puts "#{n} doubled is #{doubled}"
end
```

### Block parameters

```ruby
# Single parameter
[1, 2, 3].each { |n| puts n }

# Multiple parameters
{ a: 1, b: 2 }.each { |key, value| puts "#{key}: #{value}" }

# Splat in block
[[1, 2], [3, 4]].each { |(a, b)| puts "#{a}+#{b}=#{a+b}" }

# Trailing comma (Ruby 3.1+)
[1, 2, 3].each { |n,| puts n }  # Ignores additional args
```

### yield

```ruby
def repeat(n)
  n.times { yield }
end

repeat(3) { puts "Hello" }
# Hello
# Hello
# Hello

# Yield with arguments
def each_with_index
  i = 0
  each do |item|
    yield item, i
    i += 1
  end
end
```

### block_given?

```ruby
def maybe_process
  if block_given?
    yield
  else
    "no block"
  end
end

maybe_process { "processing" }  # => "processing"
maybe_process                    # => "no block"
```

## Procs

Procs are blocks wrapped as objects. They can be stored in variables and passed around.

```ruby
# Creating Procs
my_proc = Proc.new { |name| "Hello, #{name}!" }
my_proc = proc { |name| "Hello, #{name}!" }

# Calling Procs
my_proc.call("Alice")   # => "Hello, Alice!"
my_proc.("Alice")       # => "Hello, Alice!"
my_proc["Alice"]        # => "Hello, Alice!"
my_proc.===("Alice")    # => "Hello, Alice!"
```

### Proc behavior

```ruby
# Procs don't check argument count
my_proc = Proc.new { |a, b| [a, b] }
my_proc.call(1)         # => [1, nil]
my_proc.call(1, 2, 3)   # => [1, 2] (extra args ignored)

# Procs use the calling method's return context
def proc_test
  my_proc = Proc.new { return "from proc" }
  my_proc.call
  "never reached"
end

proc_test  # => "from proc" (returns from the method!)
```

## Lambdas

Lambdas are a special kind of Proc with stricter behavior.

```ruby
# Creating lambdas
my_lambda = lambda { |name| "Hello, #{name}!" }
my_lambda = ->(name) { "Hello, #{name}!" }  # Stabby lambda

# Calling lambdas (same as Procs)
my_lambda.call("Alice")
my_lambda.("Alice")
my_lambda["Alice"]
```

### Lambda vs Proc differences

```ruby
# 1. Argument checking
my_lambda = ->(a, b) { [a, b] }
my_lambda.call(1)      # ArgumentError (wrong number of arguments)
my_lambda.call(1, 2, 3) # ArgumentError

my_proc = Proc.new { |a, b| [a, b] }
my_proc.call(1)         # => [1, nil] (no error)

# 2. Return behavior
def lambda_test
  my_lambda = -> { return "from lambda" }
  my_lambda.call
  "reached"  # This IS reached
end

lambda_test  # => "reached" (lambda returns to caller, not method)

def proc_test
  my_proc = Proc.new { return "from proc" }
  my_proc.call
  "never reached"
end

proc_test  # => "from proc" (proc returns from enclosing method)

# 3. Checking type
proc.lambda?   # => false
lambda.lambda? # => true
```

## Method objects

```ruby
class Calculator
  def add(a, b)
    a + b
  end
end

calc = Calculator.new
add_method = calc.method(:add)

add_method.call(1, 2)   # => 3
add_method.(1, 2)       # => 3
add_method[1, 2]        # => 3

# Method objects behave like lambdas
add_method.lambda?      # => true
```

## Converting between blocks, Procs, and methods

### Block to Proc (&)

```ruby
def run_proc(&block)
  block.call
end

run_proc { puts "Hello" }

my_proc = Proc.new { puts "Hello" }
run_proc(&my_proc)  # Convert Proc to block with &
```

### Proc to block

```ruby
# Symbol#to_proc
[1, 2, 3].map(&:to_s)      # => ["1", "2", "3"]
["a", "b"].map(&:upcase)   # => ["A", "B"]
[1, 2, 3].select(&:even?)  # => [2]

# Equivalent to:
[1, 2, 3].map { |n| n.to_s }
```

### Method to Proc

```ruby
add = calc.method(:add)
[1, 2, 3].map(&add.curry[10])  # => [11, 12, 13]
```

## Currying

```ruby
add = ->(a, b) { a + b }
add_one = add.curry[1]
add_one.call(5)  # => 6

multiply = ->(a, b, c) { a * b * c }
double = multiply.curry[2]
double_triple = double.curry[3]
double_triple.call(4)  # => 24
```

## Closures

Blocks, Procs, and lambdas capture variables from their surrounding scope:

```ruby
counter = 0
increment = proc { counter += 1 }

increment.call  # => 1
increment.call  # => 2
increment.call  # => 3
counter         # => 3
```

## Practical patterns

### Custom iteration

```ruby
def each_pair
  return enum_for(:each_pair) unless block_given?

  i = 0
  while i < size
    yield self[i], self[i + 1] if self[i + 1]
    i += 2
  end
end
```

### Lazy evaluation

```ruby
lazy_squares = (1..Float::INFINITY).lazy.map { |n| n ** 2 }
lazy_squares.first(5)  # => [1, 4, 9, 16, 25]
```

### Higher-order functions

```ruby
def compose(f, g)
  ->(x) { f.call(g.call(x)) }
end

double = ->(n) { n * 2 }
increment = ->(n) { n + 1 }
double_then_increment = compose(increment, double)
double_then_increment.call(5)  # => 11
```

## Best practices

1. Use `{ }` for single-line blocks, `do...end` for multi-line
2. Prefer lambdas over Procs for stricter argument checking
3. Use `&:method_name` shorthand for simple method calls
4. Use `block_given?` to make blocks optional
5. Return `enum_for` when no block is given (enables chaining)
6. Be aware of Proc vs Lambda return behavior differences
7. Use currying for partial application
8. Use `lazy` for infinite sequences
