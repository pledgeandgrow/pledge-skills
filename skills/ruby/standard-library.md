# Standard Library

Ruby's built-in standard libraries and modules.

## Enumerable

```ruby
# Enumerable is included by Array, Hash, Range, Set, and others

# Iteration
[1, 2, 3].each { |n| puts n }
[1, 2, 3].each_with_index { |n, i| puts "#{i}: #{n}" }
[1, 2, 3].each_with_object([]) { |n, acc| acc << n * 2 }  # => [2, 4, 6]

# Transformation
[1, 2, 3].map { |n| n * 2 }            # => [2, 4, 6]
[1, 2, 3].flat_map { |n| [n, n * 2] }  # => [1, 2, 2, 4, 3, 6]
[1, 2, 3].collect { |n| n ** 2 }       # => [1, 4, 9] (alias for map)

# Filtering
[1, 2, 3, 4].select { |n| n.even? }     # => [2, 4]
[1, 2, 3, 4].reject { |n| n.even? }     # => [1, 3]
[1, 2, 3, 4].filter { |n| n.even? }     # => [2, 4] (Ruby 2.6+)

# Searching
[1, 2, 3].find { |n| n > 1 }           # => 2 (first match)
[1, 2, 3].find_all { |n| n > 1 }       # => [2, 3]
[1, 2, 3].detect { |n| n > 1 }         # => 2 (alias for find)

# Aggregation
[1, 2, 3].sum                           # => 6
[1, 2, 3].reduce(:+)                    # => 6
[1, 2, 3].inject(0) { |sum, n| sum + n } # => 6
[1, 2, 3].min                           # => 1
[1, 2, 3].max                           # => 3
[1, 2, 3].minmax                        # => [1, 3]
[1, 2, 3].min_by { |n| -n }            # => 3
[1, 2, 3].max_by { |n| n * 2 }         # => 3

# Sorting
[3, 1, 2].sort                         # => [1, 2, 3]
[3, 1, 2].sort_by { |n| -n }           # => [3, 2, 1]
[3, 1, 2].sort { |a, b| b <=> a }      # => [3, 2, 1]

# Grouping
[1, 2, 3, 4].partition(&:even?)        # => [[2, 4], [1, 3]]
[1, 2, 3, 4].group_by(&:even?)         # => {false=>[1, 3], true=>[2, 4]}
[1, 2, 3].chunk { |n| n.even? }.to_a   # => [[false, [1]], [true, [2]], [false, [3]]]
[1, 1, 2, 2, 3].chunk_while { |a, b| a == b }.to_a  # => [[1, 1], [2, 2], [3]]
[1, 2, 3].slice_when { |a, b| b > 2 }.to_a  # => [[1, 2], [3]]

# Counting
[1, 2, 3].count                        # => 3
[1, 1, 2].count(1)                     # => 2
[1, 2, 3].count { |n| n > 1 }          # => 2
[1, 1, 2, 2, 3].tally                  # => {1=>2, 2=>2, 3=>1}

# Boolean checks
[1, 2, 3].all? { |n| n > 0 }           # => true
[1, 2, 3].any? { |n| n > 2 }           # => true
[1, 2, 3].none? { |n| n > 3 }          # => true
[1, 2, 3].one? { |n| n > 2 }           # => true
[1, 2, 3].include?(2)                  # => true

# Combining
[1, 2, 3].zip([4, 5, 6])               # => [[1, 4], [2, 5], [3, 6]]
[1, 2, 3].each_slice(2).to_a           # => [[1, 2], [3]]
[1, 2, 3, 4].each_cons(2).to_a         # => [[1, 2], [2, 3], [3, 4]]

# First/Last
[1, 2, 3, 4, 5].first(3)               # => [1, 2, 3]
[1, 2, 3, 4, 5].first                  # => 1
[1, 2, 3, 4, 5].take(3)                # => [1, 2, 3]
[1, 2, 3, 4, 5].take_while { |n| n < 4 } # => [1, 2, 3]
[1, 2, 3, 4, 5].drop(2)                # => [3, 4, 5]
[1, 2, 3, 4, 5].drop_while { |n| n < 4 } # => [4, 5]

# Lazy
(1..Float::INFINITY).lazy.select(&:even?).first(5)  # => [2, 4, 6, 8, 10]
```

## Comparable

```ruby
# Include Comparable and define <=>
class Money
  include Comparable

  attr_reader :amount

  def initialize(amount)
    @amount = amount
  end

  def <=>(other)
    amount <=> other.amount
  end
end

m1 = Money.new(100)
m2 = Money.new(200)

m1 < m2      # => true
m1 == m2     # => false
m1.between?(Money.new(50), Money.new(300))  # => true
[m2, m1].sort  # => [m1, m2]
m1.clamp(Money.new(150), Money.new(300))  # => Money.new(150)
```

## JSON

```ruby
require 'json'

# Parsing
JSON.parse('{"name":"Alice","age":30}')  # => {"name"=>"Alice", "age"=>30}
JSON.parse('[1, 2, 3]')                   # => [1, 2, 3]
JSON('{"key":"value"}')                   # => {"key"=>"value"}

# Generating
JSON.generate({ name: "Alice", age: 30 })  # => '{"name":"Alice","age":30}'
{ name: "Alice" }.to_json                  # => '{"name":"Alice"}'
JSON.pretty_generate({ name: "Alice" })    # Formatted with indentation

# With options
JSON.generate({ name: "Alice" }, { indent: "  " })
JSON.parse(json, symbolize_names: true)    # => {name: "Alice", age: 30}
```

## YAML

```ruby
require 'yaml'

# Parsing
YAML.load_file("config.yml")     # Load from file
YAML.load(yaml_string)           # Parse string
YAML.safe_load(yaml_string)      # Safe parse (no arbitrary objects)

# Generating
YAML.dump(object)                # Serialize to YAML string
YAML.dump(object, File.open("out.yml", "w"))  # To file

# Configuration file example
config = YAML.load_file("config.yml")
# config.yml:
# development:
#   adapter: postgresql
#   host: localhost
```

## CSV

```ruby
require 'csv'

# Reading
CSV.read("data.csv")                    # => [["a", "b"], ["c", "d"]]
CSV.read("data.csv", headers: true)     # With headers
CSV.foreach("data.csv") { |row| puts row }
CSV.foreach("data.csv", headers: true) { |row| puts row["Name"] }

# Writing
CSV.open("output.csv", "w") do |csv|
  csv << ["Name", "Age", "City"]
  csv << ["Alice", 30, "NYC"]
  csv << ["Bob", 25, "LA"]
end

# Parsing
CSV.parse("a,b,c\n1,2,3")  # => [["a", "b", "c"], ["1", "2", "3"]]
CSV.parse_line("a,b,c")    # => ["a", "b", "c"]
```

## Set

```ruby
require 'set'

set = Set.new([1, 2, 3])
set.add(4)
set.delete(2)
set.include?(3)   # => true
set.size          # => 3

# Set operations
Set.new([1, 2, 3]) | Set.new([3, 4, 5])   # Union: #<Set: {1, 2, 3, 4, 5}>
Set.new([1, 2, 3]) & Set.new([2, 3, 4])   # Intersection: #<Set: {2, 3}>
Set.new([1, 2, 3]) - Set.new([2])         # Difference: #<Set: {1, 3}>
Set.new([1, 2]).subset?(Set.new([1, 2, 3]))  # => true
Set.new([1, 2, 3]).superset?(Set.new([1, 2]))  # => true
Set.new([1, 2]).disjoint?(Set.new([3, 4]))  # => true
```

## Time and Date

```ruby
require 'time'

# Time
Time.now              # => 2024-01-15 12:00:00 +0900
Time.now.utc          # => 2024-01-15 03:00:00 UTC
Time.now.to_i         # Unix timestamp
Time.at(1705276800)   # From timestamp
Time.now.strftime("%Y-%m-%d %H:%M:%S")  # => "2024-01-15 12:00:00"
Time.parse("2024-01-15")  # Parse string

# Time arithmetic
now = Time.now
tomorrow = now + 86400  # + 1 day in seconds
now < tomorrow          # => true

# Date
require 'date'
Date.today             # => #<Date: 2024-01-15>
Date.new(2024, 1, 15)  # Create specific date
Date.today.next_day    # => #<Date: 2024-01-16>
Date.today.prev_month  # => #<Date: 2023-12-15>
(Date.today..Date.today + 7).to_a  # Array of dates

# DateTime (deprecated, use Time instead)
```

## URI and Net::HTTP

```ruby
require 'uri'
require 'net/http'

uri = URI("https://api.example.com/path?query=1")
uri.scheme    # => "https"
uri.host      # => "api.example.com"
uri.path      # => "/path"
uri.query     # => "query=1"
uri.port      # => 443

# Build URI
URI::HTTP.build(host: 'example.com', path: '/api', query: 'q=1')
```

## OpenStruct

```ruby
require 'ostruct'

person = OpenStruct.new(name: "Alice", age: 30)
person.name     # => "Alice"
person.age      # => 30
person.email = "alice@example.com"  # Dynamic attribute
person.email    # => "alice@example.com"
```

## Forwardable

```ruby
require 'forwardable'

class Queue
  extend Forwardable

  def initialize
    @queue = []
  end

  def_delegators :@queue, :push, :pop, :size, :empty?, :first, :last
end

q = Queue.new
q.push(1)
q.push(2)
q.pop      # => 2
q.size     # => 1
```

## Singleton

```ruby
require 'singleton'

class Database
  include Singleton

  def connect
    @connection ||= establish_connection
  end
end

Database.instance.connect  # Always returns same instance
```

## Logger

```ruby
require 'logger'

logger = Logger.new($stdout)
logger = Logger.new("app.log", "daily")  # Daily rotation

logger.level = Logger::INFO

logger.debug("Debug message")
logger.info("Info message")
logger.warn("Warning message")
logger.error("Error message")
logger.fatal("Fatal message")

# With progname
logger.info("MyApp") { "Processing started" }
```

## Tempfile

```ruby
require 'tempfile'

Tempfile.create("prefix") do |f|
  f.write("temporary content")
  f.rewind
  puts f.read
end  # File is automatically deleted

# Without block (manual cleanup)
temp = Tempfile.new("prefix")
temp.write("data")
temp.close
temp.unlink  # Delete
```

## Best practices

1. Use `require` for standard library modules
2. Prefer `JSON` over `YAML` for data interchange
3. Use `Set` for uniqueness and set operations
4. Use `CSV.foreach` for memory-efficient CSV reading
5. Use `Logger` for structured logging
6. Use `Tempfile` for temporary files (auto-cleanup)
7. Use `Forwardable` for clean delegation
8. Use `Enumerable` methods over manual loops
9. Use `lazy` for processing large/infinite collections
10. Use `Time` instead of `DateTime` (deprecated)
