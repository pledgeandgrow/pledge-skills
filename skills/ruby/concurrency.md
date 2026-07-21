# Concurrency

Threads, Fibers, Ractors, Mutex, and async patterns in Ruby.

## Threads

```ruby
# Creating threads
thread = Thread.new do
  puts "Running in a thread"
  sleep(1)
  "result"
end

# Wait for thread to finish
thread.join

# Get return value
value = thread.value  # Blocks until thread finishes

# Thread with arguments
thread = Thread.new(1, 2) do |a, b|
  a + b
end
thread.value  # => 3
```

### Thread variables

```ruby
Thread.current[:name] = "worker-1"
Thread.current[:name]  # => "worker-1"

# Thread-local (fiber-local) variables
Thread.current.thread_variable_set(:request_id, "abc123")
Thread.current.thread_variable_get(:request_id)
```

### Thread status

```ruby
thread = Thread.new { sleep(1) }
thread.status      # => "sleep" / "run" / false / nil
thread.alive?      # => true
thread.stop?       # => false
thread.pending_interrupt?  # => false
```

### Thread exceptions

```ruby
thread = Thread.new do
  raise "Something went wrong"
end

# Default: exception is killed silently (in 2.x, prints to stderr)
# Handle exceptions:
thread = Thread.new do
  raise "error"
end

thread.abort_on_exception = true  # Re-raise in main thread

# Or:
begin
  thread.join
rescue => e
  puts "Thread raised: #{e.message}"
end
```

## Mutex

```ruby
counter = 0
mutex = Mutex.new

threads = 10.times.map do
  Thread.new do
    1000.times do
      mutex.synchronize do
        counter += 1
      end
    end
  end
end

threads.each(&:join)
puts counter  # => 10000 (safe with mutex)
```

### Mutex methods

```ruby
mutex = Mutex.new
mutex.lock          # Lock (blocks if already locked)
mutex.unlock        # Unlock
mutex.try_lock      # Lock if not locked, return false otherwise
mutex.synchronize { }  # Lock, yield, unlock
mutex.owned?        # Check if current thread owns the lock
```

## ConditionVariable

```ruby
mutex = Mutex.new
resource_available = ConditionVariable.new
queue = []

producer = Thread.new do
  loop do
    mutex.synchronize do
      queue << produce_item
      resource_available.signal
    end
  end
end

consumer = Thread.new do
  loop do
    mutex.synchronize do
      resource_available.wait(mutex) while queue.empty?
      item = queue.shift
      process(item)
    end
  end
end
```

## Queue

```ruby
require 'thread'

queue = Queue.new

# Producer
producer = Thread.new do
  10.times do |i|
    queue << i
    sleep(0.1)
  end
end

# Consumer
consumer = Thread.new do
  10.times do
    item = queue.pop  # Blocks if queue is empty
    puts "Processed: #{item}"
  end
end

producer.join
consumer.join
```

### Queue types

```ruby
Queue.new           # Standard FIFO queue
SizedQueue.new(5)   # Bounded queue (blocks when full)
Queue.new.pop(non_block: true)  # Raises ThreadError if empty
```

## Fibers

Fibers are lightweight coroutines (cooperative concurrency).

```ruby
fiber = Fiber.new do
  puts "Start"
  Fiber.yield "first"
  puts "Resumed"
  Fiber.yield "second"
  puts "Done"
  "final"
end

fiber.resume  # => "first" (prints "Start")
fiber.resume  # => "second" (prints "Resumed")
fiber.resume  # => "final" (prints "Done")
fiber.resume  # => FiberError (dead fiber)
```

### Fiber as generator

```ruby
fibonacci = Fiber.new do
  a, b = 0, 1
  loop do
    Fiber.yield a
    a, b = b, a + b
  end
end

10.times { print "#{fibonacci.resume} " }
# => 0 1 1 2 3 5 8 13 21 34
```

### Fiber as enumerator

```ruby
def each_natural
  Fiber.new do
    n = 1
    loop do
      Fiber.yield n
      n += 1
    end
  end
end

gen = each_natural
5.times { puts gen.resume }
```

## Ractor (Ruby 3.0+)

Ractors (Ruby Actors) provide true parallel execution with no shared state.

```ruby
ractor = Ractor.new do
  value = Ractor.receive
  value * 2
end

ractor.send(21)
ractor.take  # => 42
```

### Multiple Ractors

```ruby
ractors = 4.times.map do |i|
  Ractor.new(i) do |id|
    # Each Ractor has its own isolated state
    result = heavy_computation(id)
    result
  end
end

results = ractors.map(&:take)  # Wait for all results
```

### Ractor with pipes

```ruby
pipe = Ractor.new do
  loop do
    msg = Ractor.receive
    Ractor.yield msg * 2
  end
end

pipe.send(5)
pipe.take  # => 10
```

### Ractor limitations

- Objects must be copyable (Marshal) or explicitly marked as shareable
- No shared mutable state
- Communication only via messages
- Use `Ractor.make_shareable(obj)` to freeze and share objects

## Async (with async gem)

```ruby
require 'async'
require 'async/http/internet'

Async do
  internet = Async::HTTP::Internet.new

  # Concurrent requests
  tasks = [
    Async { internet.get("https://api.example.com/users") },
    Async { internet.get("https://api.example.com/posts") },
  ]

  results = tasks.map(&:wait)
  results.each { |response| puts response.read }
ensure
  internet&.close
end
```

## GIL / GVL

Ruby has a Global VM Lock (GVL, also called GIL):
- Only one thread can execute Ruby code at a time
- C extensions can release the GVL for blocking operations
- Ractors bypass the GVL (true parallelism)
- Fibers are cooperative (no GVL concerns)

### Thread vs Fiber vs Ractor

| Feature | Thread | Fiber | Ractor |
|---------|--------|-------|--------|
| Preemptive | Yes | No (cooperative) | Yes |
| Parallel | No (GVL) | No | Yes |
| Shared state | Yes (with mutex) | Yes (same thread) | No (messages) |
| Memory | Separate stacks | Very lightweight | Separate heaps |
| Use case | I/O concurrency | Generators, enumerators | CPU parallelism |

## Best practices

1. Use `Mutex` for shared mutable state across threads
2. Use `Queue` for producer-consumer patterns
3. Use `Fiber` for generators and lazy evaluation
4. Use `Ractor` for CPU-bound parallel work (Ruby 3.0+)
5. Always set `abort_on_exception = true` for debugging
6. Avoid `Thread.abort_on_exception` in production (handle gracefully)
7. Use `Async` gem for high-concurrency I/O
8. Keep critical sections (mutex.synchronize) as short as possible
9. Use `ConditionVariable` for producer-consumer with signaling
10. Prefer immutable data to avoid synchronization issues
