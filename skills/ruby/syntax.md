# Ruby Syntax

Code layout, literals, assignment, control expressions, pattern matching, operators, and comments.

## Code layout

### Source encoding

Ruby source files default to UTF-8. Use a magic comment to change:

```ruby
# encoding: utf-8
# or
# -*- coding: utf-8 -*-
```

### Line breaks

Ruby expressions can be broken across lines:

```ruby
# Backslash continuation
result = 1 + 2 + \
         3 + 4

# Implicit continuation (after operator or comma)
result = 1 + 2 +
         3 + 4

array = [1, 2, 3,
         4, 5, 6]
```

## Literals

### Numbers

```ruby
123          # Integer
1_234        # Integer with underscore separator (1234)
0xff         # Hexadecimal (255)
0b1010       # Binary (10)
0o777        # Octal (511)
3.14         # Float
1.0e10       # Scientific notation
1r           # Rational (1/1)
1i           # Complex (0+1i)
```

### Strings

```ruby
'Single quotes — no interpolation, fewer escapes'
"Double quotes — interpolation #{1 + 1} and escapes \n"

# Heredocs
text = <<~HEREDOC
  Squiggly heredoc — strips leading whitespace
  Multiple lines
HEREDOC

# Frozen string literals
"hello".frozen?  # => false (with # frozen_string_literal: true, => true)
```

### Symbols

```ruby
:my_symbol
:"symbol with spaces"
```

### Arrays

```ruby
[1, 2, 3]
%w[apple banana cherry]      # => ["apple", "banana", "cherry"]
%i[apple banana cherry]      # => [:apple, :banana, :cherry]
Array.new(3, 0)              # => [0, 0, 0]
```

### Hashes

```ruby
{ name: "Alice", age: 30 }           # New syntax (symbol keys)
{ :name => "Alice", :age => 30 }     # Hash rocket syntax
{ "name" => "Alice", "age" => 30 }   # String keys
Hash.new(0)                           # Default value
```

### Ranges

```ruby
1..5      # Inclusive: 1, 2, 3, 4, 5
1...5     # Exclusive: 1, 2, 3, 4
('a'..'z').to_a  # => ['a', 'b', ..., 'z']
```

### Regular expressions

```ruby
/pattern/
/pattern/i    # Case-insensitive
/pattern/x    # Extended (allows whitespace and comments)
%r{/usr/local/}  # Alternative delimiter
```

### Nil, true, false

```ruby
nil        # Nothing / no value
true       # Boolean true
false      # Boolean false
nil.nil?   # => true
```

### Character literals

```ruby
?a          # => "a" (String, since Ruby 1.9)
?\n         # => "\n"
?\u{41}     # => "A"
```

### Backtick literals (shell commands)

```ruby
`ls -la`           # Execute shell command, returns output as string
`echo #{name}`     # Interpolation supported
%x{ls -la}         # Alternative syntax
%x(ls -la)         # Alternative delimiters
system("ls -la")   # Returns true/false, output to stdout
`ls`.split("\n")   # Capture and process output
```

## Assignment

### Simple assignment

```ruby
x = 10
name = "Alice"
```

### Multiple assignment

```ruby
a, b, c = 1, 2, 3
a, b = b, a          # Swap values
a, *rest = [1, 2, 3, 4]  # a=1, rest=[2, 3, 4]
```

### Compound assignment

```ruby
x += 1      # x = x + 1
x -= 1      # x = x - 1
x *= 2      # x = x * 2
x /= 2      # x = x / 2
x %= 3      # x = x % 3
x **= 2     # x = x ** 2
x ||= 10    # x = x || 10 (assign if nil or false)
x &&= 10    # x = x && 10 (assign if truthy)
```

### Parallel assignment with splat

```ruby
first, *middle, last = [1, 2, 3, 4, 5]
# first=1, middle=[2, 3, 4], last=5
```

### Array decomposition

```ruby
# Nested decomposition
(a, (b, c)), d = [1, [2, 3], 4]
# a=1, b=2, c=3, d=4

# With splat in decomposition
a, (*b, c), d = [1, [2, 3, 4], 5]
# a=1, b=[2, 3], c=4, d=5
```

### Variable types and scope

```ruby
# Local variables — scoped to method/block/module
local_var = 1

# Instance variables — per-object, accessible within instance methods
@instance_var = 2

# Class variables — shared across class and all instances
@@class_var = 3

# Global variables — accessible anywhere
$global_var = 4

# Constants — start with uppercase, warn on reassignment
CONSTANT = 5

# Local variable scope rules
x = 1
1.times do
  x = 2  # Modifies outer x (blocks share scope)
end
x  # => 2

# Blocks, procs, and lambdas capture local variables (closures)
counter = 0
increment = proc { counter += 1 }
increment.call
counter  # => 1

# eval creates local variables in the eval's scope
eval("y = 10")
defined?(y)  # => nil (y is not visible outside eval)
```

## Control expressions

### if / elsif / else

```ruby
if score >= 90
  grade = "A"
elsif score >= 80
  grade = "B"
elsif score >= 70
  grade = "C"
else
  grade = "F"
end
```

### Modifier if

```ruby
puts "Adult" if age >= 18
```

### unless

```ruby
unless logged_in?
  redirect_to_login
end

# Modifier form
puts "Not empty" unless array.empty?
```

### case / when

```ruby
case status
when :active
  "Account is active"
when :suspended, :banned
  "Account is not available"
when :pending
  "Awaiting approval"
else
  "Unknown status"
end

# Case with class matching
case object
when String then "It's a string"
when Integer then "It's a number"
when Array then "It's an array"
else "Something else"
end

# Case with ranges
case score
when 90..100 then "A"
when 80..89  then "B"
when 70..79  then "C"
else "F"
end
```

### while / until

```ruby
while i < 10
  puts i
  i += 1
end

# Modifier form
puts i += 1 while i < 10

until done?
  work
end
```

### for / in

```ruby
for item in collection
  puts item
end

for key, value in hash
  puts "#{key}: #{value}"
end
```

### break, next, redo, retry

```ruby
# break — exit loop
while true
  break if condition
end

# next — skip to next iteration
[1, 2, 3, 4].each do |n|
  next if n.even?
  puts n
end

# redo — re-run current iteration
# retry — re-run rescue block
```

### loop

```ruby
loop do
  break if done?
  do_something
end
```

### Ternary operator

```ruby
result = condition ? "yes" : "no"
```

### throw / catch

Unlike `raise`/`rescue`, `throw`/`catch` is for control flow (not error handling):

```ruby
catch(:done) do
  100.times do |i|
    throw :done if i == 42
  end
end

# With return value
catch(:found) do
  items.each do |item|
    throw :found, item if item.match?
  end
  nil  # Default if not thrown
end

# Nested catch
catch(:outer) do
  catch(:inner) do
    throw :outer, "escaped inner"
  end
end
```

### Flip-flop (deprecated)

```ruby
# Flip-flop operator — toggles between true and false
# Deprecated in Ruby 2.6+, removed in 3.0+ unless explicitly enabled
(1..20).each do |i|
  puts i if (i == 3)..(i == 8)  # Prints 3 through 8
end
```

### defined?

```ruby
defined?(x)         # => "local-variable" or nil
defined?(puts)      # => "method"
defined?(String)    # => "constant"
defined?(@name)     # => "instance-variable" or nil
defined?($0)        # => "global-variable"
defined?(yield)     # => "yield" if block given, else nil
defined?(super)     # => "super" if super method exists
```

### alias and undef

```ruby
# alias — creates a new name for an existing method
class MyClass
  def original_method
    "original"
  end

  alias :alias_method :original_method
end

# undef — removes a method definition
class Parent
  def inherited_method; end
end

class Child < Parent
  undef :inherited_method  # Remove inherited method
end
```

### BEGIN and END blocks

```ruby
# BEGIN — runs before the main script
BEGIN {
  puts "Runs first"
}

# END — runs after the main script
END {
  puts "Runs last"
}

puts "Main script"
# Output:
# Runs first
# Main script
# Runs last
```

## Pattern matching

```ruby
case point
in [Integer, Integer]
  "2D point"
in [Integer, Integer, Integer]
  "3D point"
in {x:, y:}
  "Point with x and y"
in {x:, y:, **rest}
  "Point with extra: #{rest}"
end

# Array pattern
case [1, 2, 3]
in [_, *rest]
  "First element ignored, rest: #{rest}"
end

# Hash pattern with guards
case user
in {role: "admin", age: Integer => age} if age >= 21
  "Adult admin"
in {role: "admin"}
  "Admin"
else
  "Other"
end

# As pattern (binding)
case config
in {timeout: Integer => t}
  puts "Timeout is #{t}"
end

# Find pattern
case [1, 2, 3, 4, 5]
in [*, middle, *]
  "Middle element: #{middle}"  # 3
end

# Variable pinning (^) — match against existing variable's value
expected = 42
case value
in ^expected
  "Matched expected value"
else
  "Different value"
end

# Variable pinning with pattern
x = 1
case [1, 2]
in [^x, ^x]      # Won't match: x is pinned to 1 for both
  "both equal to x"
in [^x, Integer => y]
  "first is x (#{x}), second is #{y}"
end

# deconstruct / deconstruct_keys
# Custom objects can participate in pattern matching by implementing:
class Point
  attr_reader :x, :y

  def initialize(x, y)
    @x, @y = x, y
  end

  # For array pattern matching
  def deconstruct
    [@x, @y]
  end

  # For hash pattern matching
  def deconstruct_keys(keys)
    {x: @x, y: @y}
  end
end

case Point.new(3, 4)
in [Integer, Integer]
  "Array pattern matched"
in {x:, y:}
  "Hash pattern: x=#{x}, y=#{y}"
end
```

## Operators

### Arithmetic

```ruby
1 + 2     # 3
10 - 3    # 7
4 * 5     # 20
10 / 3    # 3 (integer division)
10.0 / 3  # 3.333...
10 % 3    # 1
2 ** 10   # 1024
```

### Comparison

```ruby
1 == 1      # true (value equality)
1 != 2      # true
1 < 2       # true
1 > 2       # false
1 <= 1      # true
1 >= 1      # true
1 <=> 2     # -1 (spaceship: -1, 0, or 1)
"a" == "a"  # true
"a".equal?("a")  # false (identity check)
```

### Logical

```ruby
true && false   # false
true || false   # true
!true           # false
true and false  # false (lower precedence)
true or false   # true  (lower precedence)
not true        # false (lower precedence)
```

### Bitwise

```ruby
5 & 3    # 1   (AND)
5 | 3    # 7   (OR)
5 ^ 3    # 6   (XOR)
~5       # -6  (NOT)
5 << 2   # 20  (left shift)
5 >> 1   # 2   (right shift)
```

### Safe navigation

```ruby
user&.profile&.name  # nil if any step is nil
```

### Range operators

```ruby
(1..5).to_a     # [1, 2, 3, 4, 5]   (inclusive)
(1...5).to_a    # [1, 2, 3, 4]       (exclusive)
```

## Comments

```ruby
# Single-line comment

=begin
Multi-line comment
(also called embedded document)
=end

# Magic comments
# frozen_string_literal: true
# encoding: utf-8
# shareable_constant_value: literal
# warn_indent: true
# warn_past_scope: true

# Magic comment alternative syntax
# -*- frozen-string-literal: true -*-
# encoding: utf-8

# shareable_constant_value modes:
# shareable_constant_value: none      # Default (not shareable)
# shareable_constant_value: literal   # Literals become shareable (frozen)
# shareable_constant_value: experimental_copy  # Deep copy on assignment
# shareable_constant_value: experimental_everything  # All constants shareable
```

## Operator precedence

From highest to lowest (partial list):

| Precedence | Operators |
|-----------|-----------|
| Highest | `!`, `~`, `+@` (unary) |
| | `**` |
| | `-@` (unary minus) |
| | `*`, `/`, `%` |
| | `+`, `-` |
| | `<<`, `>>` |
| | `&` |
| | `\|`, `^` |
| | `>`, `>=`, `<`, `<=` |
| | `<=>`, `==`, `!=`, `===`, `=~`, `!~` |
| | `&&` |
| | `\|\|` |
| | `..`, `...` |
| | `? :` (ternary) |
| | `=`, `+=`, `-=`, etc. |
| Lowest | `not`, `and`, `or` |
