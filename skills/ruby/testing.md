# Testing

Ruby testing frameworks: Minitest, RSpec, and testing best practices.

## Minitest

Minitest is Ruby's built-in testing framework.

### Unit tests

```ruby
require 'minitest/autorun'

class CalculatorTest < Minitest::Test
  def setup
    @calc = Calculator.new
  end

  def test_addition
    assert_equal 5, @calc.add(2, 3)
  end

  def test_division_by_zero
    assert_raises(ZeroDivisionError) { @calc.divide(1, 0) }
  end

  def teardown
    @calc = nil
  end
end
```

### Spec-style tests

```ruby
require 'minitest/autorun'

describe Calculator do
  before { @calc = Calculator.new }

  it "adds two numbers" do
    _(@calc.add(2, 3)).must_equal 5
  end

  it "raises on division by zero" do
    _ { @calc.divide(1, 0) }.must_raise ZeroDivisionError
  end
end
```

### Minitest assertions

```ruby
assert true                      # Truthy
assert_equal expected, actual    # Equality
assert_nil object                # nil
assert_in_delta 3.14, 3.141, 0.01  # Float comparison
assert_match /pattern/, string   # Regex match
assert_instance_of String, obj   # Instance type
assert_kind_of Numeric, 42       # Kind (includes subclasses)
assert_respond_to obj, :method   # Responds to method
assert_same a, b                 # Identity (equal?)
assert_raises(ErrorClass) { }    # Raises exception
assert_throws(:symbol) { }       # Throws symbol
assert_output("expected\n") { }  # Stdout output
assert_silent { }                # No output
assert_includes collection, item # Collection includes item
assert_empty collection          # Collection is empty
refute false                     # Falsy
refute_equal 1, 2                # Not equal
refute_nil obj                   # Not nil
```

### Minitest mocks

```ruby
require 'minitest/mock'

def test_mocking
  user = Minitest::Mock.new
  user.expect(:name, "Alice")
  user.expect(:save, true)

  assert_equal "Alice", user.name
  assert user.save
  user.verify  # Verify all expectations were met
end
```

### Minitest stubs

```ruby
def test_stubbing
  User.stub(:find, User.new(name: "Mock")) do
    user = User.find(1)
    assert_equal "Mock", user.name
  end
end
```

### Benchmarks

```ruby
require 'minitest/benchmark'

class BenchTest < Minitest::Benchmark
  def bench_array_push
    assert_performance_linear(0.99) do |n|
      a = []
      n.times { a << 1 }
    end
  end
end
```

## RSpec

RSpec is a popular BDD testing framework.

### Basic structure

```ruby
require 'spec_helper'

RSpec.describe Calculator do
  subject { described_class.new }

  describe '#add' do
    it 'returns the sum of two numbers' do
      expect(subject.add(2, 3)).to eq(5)
    end

    it 'handles negative numbers' do
      expect(subject.add(-1, -2)).to eq(-3)
    end
  end

  describe '#divide' do
    it 'raises ZeroDivisionError when dividing by zero' do
      expect { subject.divide(1, 0) }.to raise_error(ZeroDivisionError)
    end
  end
end
```

### Context and let

```ruby
RSpec.describe User do
  let(:user) { User.new(name: "Alice", age: 30) }

  context 'when adult' do
    it { expect(user.adult?).to be true }
  end

  context 'when minor' do
    let(:user) { User.new(name: "Bob", age: 15) }
    it { expect(user.adult?).to be false }
  end
end
```

### Matchers

```ruby
# Equality
expect(value).to eq(expected)
expect(value).to eql(expected)     # Value + type
expect(value).to equal(expected)   # Identity (same object)
expect(value).to be(expected)      # Identity (same object)

# Truthiness
expect(value).to be_truthy
expect(value).to be_falsey
expect(value).to be_nil
expect(value).to be(true)

# Comparisons
expect(value).to be > 5
expect(value).to be >= 5
expect(value).to be < 10
expect(value).to be_between(1, 10)
expect(value).to be_within(0.01).of(3.14)

# Collections
expect(array).to include(item)
expect(array).to be_empty
expect(array).to have_attributes(size: 5)
expect(hash).to include(key: value)
expect(array).to match_array([1, 2, 3])
expect(array).to contain_exactly(1, 2, 3)

# Strings
expect(string).to start_with("Hello")
expect(string).to end_with("!")
expect(string).to match(/pattern/)
expect(string).to include("substring")

# Errors
expect { code }.to raise_error(ErrorClass)
expect { code }.to raise_error(ErrorClass, "message")
expect { code }.not_to raise_error

# Output
expect { puts "hello" }.to output("hello\n").to_stdout
expect { warn "warning" }.to output(/warning/).to_stderr

# Change
expect { user.save! }.to change(User, :count).by(1)
expect { user.delete }.to change(User, :count).from(5).to(4)

# Type checking
expect(value).to be_an(Integer)
expect(value).to be_an_instance_of(String)
expect(value).to be_a_kind_of(Numeric)

# Predicate methods
expect(obj).to be_valid       # calls obj.valid?
expect(obj).to be_empty       # calls obj.empty?
expect(array).to have(3).items
```

### Doubles and mocks

```ruby
RSpec.describe OrderProcessor do
  let(:payment_gateway) { double('PaymentGateway') }
  let(:processor) { OrderProcessor.new(payment_gateway) }

  it 'processes payment' do
    allow(payment_gateway).to receive(:charge).and_return(success: true)
    # or
    expect(payment_gateway).to receive(:charge).with(100).and_return(success: true)

    result = processor.process(order_amount: 100)
    expect(result[:success]).to be true
  end

  it 'handles payment failure' do
    allow(payment_gateway).to receive(:charge).and_raise(PaymentError)
    expect { processor.process(order_amount: 100) }.to raise_error(PaymentError)
  end
end
```

### Shared examples

```ruby
RSpec.shared_examples 'a validatable' do
  it 'is valid with valid attributes' do
    expect(subject).to be_valid
  end

  it 'is invalid without required fields' do
    subject.required_field = nil
    expect(subject).not_to be_valid
  end
end

RSpec.describe User do
  include_examples 'a validatable'
end

RSpec.describe Product do
  include_examples 'a validatable'
end
```

### Hooks

```ruby
RSpec.describe MyService do
  before(:all) { setup_database }      # Once before all tests
  before(:each) { reset_state }        # Before each test
  after(:each) { cleanup }             # After each test
  after(:all) { teardown_database }    # Once after all tests
  around(:each) do |example|
    Database.transaction do
      example.run
      raise ActiveRecord::Rollback
    end
  end
end
```

## Running tests

### Minitest

```bash
# Run all tests
ruby -Ilib -e 'Dir["test/**/*_test.rb"].each { |f| require f }'

# Run specific test
ruby test/calculator_test.rb

# With Rake
rake test
rake test TEST=test/specific_test.rb
```

### RSpec

```bash
# Run all specs
rspec

# Run specific file
rspec spec/models/user_spec.rb

# Run specific test by line number
rspec spec/models/user_spec.rb:42

# Run by name pattern
rspec -e "addition"

# Run with format
rspec --format documentation
rspec --format json
rspec --format html --out results.html

# Run with seed (random order)
rspec --seed 12345

# Run only failing tests
rspec --only-failures
rspec --next-failure
```

## Best practices

1. Test behavior, not implementation
2. One assertion per test when possible
3. Use descriptive test names
4. Keep tests fast (use mocks for external dependencies)
5. Use `before`/`setup` for common initialization
6. Use shared examples for common patterns
7. Test edge cases and error conditions
8. Keep tests independent (no test order dependencies)
9. Use factories over fixtures for flexibility
10. Run tests in random order to catch order dependencies
