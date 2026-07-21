# Core Types

Ruby's built-in data types: String, Integer, Float, Array, Hash, Symbol, Range, Regexp, and more.

## String

```ruby
s = "Hello, World!"

# Concatenation
"Hello" + " " + "World"    # => "Hello World"
"Hello" << " " << "World"  # => "Hello World" (mutates receiver)
"#{greeting}, #{name}!"    # Interpolation

# Multiplication
"ab" * 3   # => "ababab"

# Access
s[0]          # => "H"
s[0..4]       # => "Hello"
s[-1]         # => "!"
s["World"]    # => "World" (substring)
s.length      # => 13
s.size        # => 13

# Transformation
s.upcase         # => "HELLO, WORLD!"
s.downcase       # => "hello, world!"
s.capitalize     # => "Hello, world!"
s.swapcase       # => "hELLO, wORLD!"
s.reverse        # => "!dlroW ,olleH"
s.strip          # => Remove leading/trailing whitespace
s.chomp          # => Remove trailing newline
s.chop           # => Remove last character
s.tr("aeiou", "*")  # Replace characters

# Search
s.include?("World")   # => true
s.start_with?("Hello") # => true
s.end_with?("!")       # => true
s.index("World")       # => 7
s.match?(/\w+/)        # => true

# Split and join
"a,b,c".split(",")          # => ["a", "b", "c"]
["a", "b", "c"].join(",")   # => "a,b,c"

# Replace
s.sub("World", "Ruby")      # Replace first occurrence
s.gsub("o", "0")            # Replace all occurrences

# Format
sprintf("%05d", 42)         # => "00042"
"%-10s" % "hello"           # => "hello     "
```

## Integer and Float

```ruby
# Integer methods
42.even?          # => true
42.odd?           # => false
42.times { |i| puts i }
42.upto(50) { |n| puts n }
50.downto(42) { |n| puts n }
42.divmod(5)      # => [8, 2] (quotient and remainder)
42.gcd(56)        # => 14 (greatest common divisor)
42.lcm(56)        # => 168 (least common multiple)
42.prime?         # => false (requires 'prime')
42.bit_length     # => 6
42.digits         # => [2, 4] (digits in reverse)
42.to_s(2)        # => "101010" (binary)
42.to_s(16)       # => "2a" (hex)

# Float methods
3.14.round        # => 3
3.14.round(1)     # => 3.1
3.5.floor         # => 3
3.5.ceil          # => 4
3.5.truncate      # => 3
3.14.to_i         # => 3
3.14.to_r         # => (157/50) (rational)
Float::INFINITY   # => Infinity
Float::NAN        # => NaN
```

## Array

```ruby
arr = [3, 1, 4, 1, 5, 9, 2, 6]

# Access
arr[0]          # => 3
arr[-1]         # => 6
arr[0..2]       # => [3, 1, 4]
arr.first       # => 3
arr.last        # => 6
arr.length      # => 8
arr.size        # => 8

# Adding
arr << 7              # Append
arr.push(7)            # Append
arr.unshift(0)         # Prepend
arr.insert(2, 99)      # Insert at index

# Removing
arr.pop              # Remove last
arr.shift            # Remove first
arr.delete(1)        # Remove all 1s
arr.delete_at(2)     # Remove at index

# Iteration
arr.each { |n| puts n }
arr.each_with_index { |n, i| puts "#{i}: #{n}" }
arr.reverse_each { |n| puts n }

# Transformation
arr.map { |n| n * 2 }          # => [6, 2, 8, ...]
arr.select { |n| n > 3 }       # => [4, 5, 9, 6]
arr.reject { |n| n > 3 }       # => [3, 1, 1, 2]
arr.filter { |n| n > 3 }       # Same as select (Ruby 2.6+)
arr.flat_map { |n| [n, n*2] }  # Flatten after mapping

# Aggregation
arr.sum             # => 31
arr.min             # => 1
arr.max             # => 9
arr.sort            # => [1, 1, 2, 3, 4, 5, 6, 9]
arr.sort_by { |n| -n }  # Descending
arr.uniq            # => [3, 1, 4, 5, 9, 2, 6]
arr.reduce(:+)      # => 31
arr.reduce(0) { |sum, n| sum + n }

# Searching
arr.include?(5)     # => true
arr.find { |n| n > 4 }  # => 5 (first match)
arr.find_all { |n| n > 4 }  # Same as select
arr.any? { |n| n > 8 }  # => true
arr.all? { |n| n > 0 }  # => true
arr.none? { |n| n < 0 } # => true
arr.count(1)        # => 2 (count of 1s)
arr.count { |n| n > 3 } # => 4

# Combining
arr.zip([10, 20, 30])  # => [[3, 10], [1, 20], [4, 30], ...]
arr.each_slice(3) { |slice| p slice }  # => [3, 1, 4], [1, 5, 9], [2, 6]
arr.each_cons(2) { |pair| p pair }     # => [3, 1], [1, 4], [4, 1], ...

# Set operations
[1, 2, 3] | [3, 4, 5]   # => [1, 2, 3, 4, 5] (union)
[1, 2, 3] & [2, 3, 4]   # => [2, 3] (intersection)
[1, 2, 3] - [2, 3]      # => [1] (difference)

# Destructive (in-place) methods
arr.map! { |n| n * 2 }
arr.sort!
arr.uniq!
arr.reverse!

# Other useful methods
arr.flatten          # Flatten nested arrays
arr.compact          # Remove nils
arr.join(",")        # Join to string
arr.sample           # Random element
arr.shuffle          # Shuffle elements
arr.partition { |n| n > 3 }  # => [[4, 5, 9, 6], [3, 1, 1, 2]]
arr.group_by { |n| n % 2 }   # => {1=>[3, 1, 1, 5, 9], 0=>[4, 2, 6]}
arr.chunk { |n| n.even? }    # Group consecutive elements
arr.tally            # => {3=>1, 1=>2, 4=>1, 5=>1, 9=>1, 2=>1, 6=>1}
```

## Hash

```ruby
h = { name: "Alice", age: 30, city: "NYC" }

# Access
h[:name]           # => "Alice"
h.fetch(:name)     # => "Alice"
h.fetch(:missing, "default")  # => "default"
h.fetch(:missing) { |key| "no #{key}" }
h.keys             # => [:name, :age, :city]
h.values           # => ["Alice", 30, "NYC"]
h.length           # => 3

# Adding/Updating
h[:email] = "alice@example.com"
h.store(:phone, "555-1234")
h.merge(another: "hash")    # Non-destructive merge
h.merge!(another: "hash")   # Destructive merge

# Checking
h.key?(:name)      # => true
h.value?("Alice")  # => true
h.empty?           # => false
h.include?(:name)  # => true (alias for key?)
h.member?(:name)   # => true (alias for key?)

# Iteration
h.each { |key, value| puts "#{key}: #{value}" }
h.each_key { |key| puts key }
h.each_value { |value| puts value }
h.each_pair { |key, value| puts "#{key}: #{value}" }

# Transformation
h.transform_keys { |k| k.to_s }     # => {"name"=>"Alice", ...}
h.transform_values { |v| v.to_s }   # => {:name=>"Alice", ...}
h.filter { |k, v| v.is_a?(String) } # => {:name=>"Alice", :city=>"NYC"}
h.map { |k, v| [k, v.to_s] }.to_h   # Transform to new hash

# Extraction
h.to_a             # => [[:name, "Alice"], [:age, 30], [:city, "NYC"]]
h.to_h             # Self (for conversion from other types)
h.invert           # => {"Alice"=>:name, 30=>:age, "NYC"=>:city}
h.min_by { |k, v| v }  # => [:age, 30]

# Default values
h = Hash.new(0)
h[:count] += 1    # => 1 (default 0)
h = Hash.new { |hash, key| hash[key] = [] }
h[:items] << "first"  # => ["first"]

# Destructive
h.delete(:age)     # => 30 (removes key)
h.delete_if { |k, v| v.nil? }
h.keep_if { |k, v| v.is_a?(String) }
h.reject! { |k, v| v.nil? }
h.select! { |k, v| v.is_a?(String) }
```

## Symbol

```ruby
:my_symbol
:name.to_s         # => "name"
"string".to_sym    # => :string

# Symbols are immutable and interned (same symbol = same object)
:name.equal?(:name)  # => true
```

## Range

```ruby
(1..5).to_a          # => [1, 2, 3, 4, 5]
(1...5).to_a         # => [1, 2, 3, 4]
('a'..'e').to_a      # => ['a', 'b', 'c', 'd', 'e']

(1..5).include?(3)   # => true
(1..5).cover?(3)     # => true (faster for ranges)
(1..5).min           # => 1
(1..5).max           # => 5
(1..5).sum           # => 15
(1..5).step(2).to_a  # => [1, 3, 5]
(1..).first(5)       # => [1, 2, 3, 4, 5] (endless range)
(..5).last(5)        # => [1, 2, 3, 4, 5] (beginless range)
```

## Regexp

```ruby
pattern = /\d+/
"abc123def" =~ /\d+/  # => 3 (index of match)
"abc123def"[/\d+/]    # => "123"
"abc123def".match?(/\d+/)  # => true

# Capture groups
md = "2024-01-15".match(/(\d{4})-(\d{2})-(\d{2})/)
md[1]  # => "2024"
md[2]  # => "01"
md[3]  # => "15"

# Named captures
md = "2024-01-15".match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/)
md[:year]   # => "2024"
md[:month]  # => "01"

# Global substitution
"hello world".gsub(/\w+/) { |word| word.capitalize }
# => "Hello World"

# Scan (find all matches)
"1 2 3".scan(/\d/)  # => ["1", "2", "3"]
```

## Nil

```ruby
nil.nil?              # => true
nil.to_s              # => ""
nil.to_a              # => []
nil.to_i              # => 0
nil.to_f              # => 0.0
nil&.upcase           # => nil (safe navigation)
nil || "default"      # => "default"
```

## Boolean

```ruby
# In Ruby, only `false` and `nil` are falsy. Everything else is truthy.
if 0 then "truthy" end    # => "truthy" (0 is truthy in Ruby!)
if "" then "truthy" end   # => "truthy" (empty string is truthy!)
if [] then "truthy" end   # => "truthy" (empty array is truthy!)
```

## Type checking

```ruby
"hello".is_a?(String)      # => true
"hello".instance_of?(String)  # => true (exact class, not subclass)
42.is_a?(Integer)          # => true
42.is_a?(Numeric)          # => true (parent class)
[].is_a?(Array)            # => true
"hello".class              # => String
42.class                   # => Integer
"hello".respond_to?(:upcase)  # => true
"hello".frozen?            # => false
```

## Best practices

1. Use `fetch` with defaults for hash access to avoid nil errors
2. Prefer `match?` over `match` for boolean checks (faster)
3. Use `freeze` for string constants
4. Use `dig` for deeply nested data: `hash.dig(:a, :b, :c)`
5. Use `then` / `yield_self` for method chaining
6. Prefer `Array.wrap` or `[*item]` for safe array coercion
7. Use `deep_dup` (ActiveSupport) or manual dup for deep copies
8. Use `freeze` to make objects immutable
