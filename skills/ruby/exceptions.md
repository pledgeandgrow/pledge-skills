# Exceptions

Error handling in Ruby: raise, rescue, retry, custom exceptions.

## Raising exceptions

```ruby
raise "Something went wrong"                    # RuntimeError
raise ArgumentError, "Invalid argument"         # Specific class
raise ArgumentError.new("Invalid argument")     # Instance
raise StandardError, "message", backtrace_array # With backtrace

# Using fail (alias for raise)
fail "Connection lost"
```

## Rescuing exceptions

```ruby
begin
  risky_operation
rescue
  # Catches StandardError (default)
  puts "An error occurred"
end

# Rescue specific types
begin
  risky_operation
rescue ArgumentError => e
  puts "Argument error: #{e.message}"
rescue TypeError => e
  puts "Type error: #{e.message}"
rescue => e
  puts "Other error: #{e.message}"
end

# Rescue multiple types
begin
  risky_operation
rescue ArgumentError, TypeError => e
  puts "Error: #{e.message}"
end
```

## Ensure and else

```ruby
begin
  file = File.open("data.txt")
  result = process(file)
rescue Errno::ENOENT
  puts "File not found"
rescue => e
  puts "Error: #{e.message}"
else
  # Runs only if no exception was raised
  puts "Success: #{result}"
ensure
  # Always runs, regardless of exception
  file&.close
end
```

## Retry

```ruby
attempts = 0
begin
  connect_to_server
rescue ConnectionError => e
  attempts += 1
  retry if attempts < 3
  raise  # Re-raise after max attempts
end
```

## Implicit begin (method-level)

```ruby
def divide(a, b)
  a / b
rescue ZeroDivisionError
  0
end

# Equivalent to:
def divide(a, b)
  begin
    a / b
  rescue ZeroDivisionError
    0
  end
end
```

## Rescue modifier

```ruby
result = risky_operation rescue "default"
result = json_parse(input) rescue nil
```

## Custom exceptions

```ruby
class ApplicationError < StandardError; end

class ValidationError < ApplicationError
  attr_reader :field

  def initialize(field, message)
    @field = field
    super(message)
  end
end

class NotFoundError < ApplicationError; end
class UnauthorizedError < ApplicationError; end

# Usage
raise ValidationError.new("email", "Invalid email format")
```

## Exception hierarchy

```
Exception
├── NoMemoryError
├── ScriptError
│   ├── LoadError
│   ├── NotImplementedError
│   └── SyntaxError
├── SecurityError
├── SignalException
│   └── Interrupt
├── StandardError          ← rescue catches this by default
│   ├── ArgumentError
│   ├── EncodingError
│   ├── FiberError
│   ├── IOError
│   │   └── EOFError
│   ├── IndexError
│   │   ├── KeyError
│   │   └── StopIteration
│   ├── LocalJumpError
│   ├── NameError
│   │   └── NoMethodError
│   ├── RangeError
│   │   └── FloatDomainError
│   ├── RegexpError
│   ├── RuntimeError
│   │   └── FrozenError
│   ├── SystemCallError
│   ├── ThreadError
│   ├── TypeError
│   └── ZeroDivisionError
└── SystemExit
```

## Best practices

1. **Never rescue `Exception`** — rescue `StandardError` instead (or specific types)
2. Always provide meaningful error messages
3. Create custom exception hierarchies for your application
4. Use `ensure` for cleanup (closing files, connections)
5. Don't use exceptions for control flow
6. Rescue specific exceptions, not broad ones
7. Re-raise exceptions when you can't handle them
8. Use `rescue` modifier for simple default values
9. Log exceptions before re-raising if needed
10. Inherit custom exceptions from `StandardError`, not `Exception`
