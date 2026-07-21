# Tools and Ecosystem

Ruby tooling: IRB, Rake, RuboCop, RDoc, debuggers, and editors.

## Rake

Rake is Ruby's build tool (like Make for Ruby).

### Rakefile basics

```ruby
# Rakefile
task default: :test

desc "Run tests"
task :test do
  sh "rspec"
end

desc "Build gem"
task :build do
  sh "gem build my_gem.gemspec"
end

desc "Clean build artifacts"
task :clean do
  sh "rm -f *.gem"
end
```

### File tasks

```ruby
file "output.txt" => "input.txt" do |t|
  sh "transform #{t.prerequisites.first} > #{t.name}"
end
```

### Namespace and prerequisites

```ruby
namespace :db do
  desc "Create database"
  task :create => :environment do
    create_database
  end

  desc "Drop database"
  task :drop => :environment do
    drop_database
  end

  desc "Migrate database"
  task :migrate => :environment do
    migrate
  end
end

task :environment do
  require './config/environment'
end
```

### Running Rake

```bash
rake              # Run default task
rake test         # Run specific task
rake db:migrate   # Namespaced task
rake -T           # List all tasks
rake -P           # Show task prerequisites
rake -f custom.rake  # Use custom file
```

## RuboCop

Static code analyzer and formatter.

### Installation

```bash
gem install rubocop
gem install rubocop-rails   # Rails-specific cops
gem install rubocop-rspec   # RSpec-specific cops
gem install rubocop-performance
```

### Configuration (.rubocop.yml)

```yaml
AllCops:
  NewCops: enable
  TargetRubyVersion: 3.4
  Exclude:
    - 'db/schema.rb'
    - 'vendor/**/*'

Style/Documentation:
  Enabled: false

Metrics/MethodLength:
  Max: 20

Metrics/AbcSize:
  Max: 20

Style/FrozenStringLiteralComment:
  Enabled: true

Layout/LineLength:
  Max: 120
```

### Usage

```bash
rubocop                    # Check all files
rubocop --auto-correct    # Auto-fix safe issues
rubocop --auto-correct-all  # Auto-fix all issues
rubocop --format simple   # Simple output
rubocop --format json     # JSON output
rubocop --only Style/StringLiterals  # Specific cop
rubocop --except Metrics  # Exclude category
```

## RDoc / YARD

### RDoc (built-in)

```ruby
# RDoc comment format
#
# Adds two numbers together.
#
# +a+:: The first number
# +b+:: The second number
#
# Returns the sum of +a+ and +b+.
def add(a, b)
  a + b
end
```

```bash
rdoc lib/         # Generate docs
rdoc --main README.md
ri String#upcase  # View method docs in terminal
```

### YARD (more powerful)

```ruby
# Adds two numbers together.
#
# @param a [Integer] The first number
# @param b [Integer] The second number
# @return [Integer] The sum of a and b
# @raise [ArgumentError] if arguments are not integers
# @example Adding two numbers
#   add(2, 3) #=> 5
def add(a, b)
  a + b
end
```

```bash
gem install yard
yard doc lib/         # Generate docs
yard server           # Preview docs
yard stats --list-undoc  # Show undocumented methods
```

## Debugging

### IRB

```bash
irb                     # Start REPL
irb -r my_file.rb       # Load file first
irb -e 'puts "hello"'   # One-liner
```

### debug gem (Ruby 3.1+)

```bash
gem install debug

# Debug a script
rdbg target.rb
rdbg --command target.rb  # With REPL

# Remote debugging
rdbg --open target.rb
# Then connect from another terminal
```

```ruby
# In code
require 'debug'
binding.break  # Set breakpoint (Ruby 3.1+)
# or
binding.b      # Shorthand
```

### Debug commands

```
step     # Step into
next     # Step over
finish   # Step out
continue # Continue execution
break    # Show breakpoints
break <file>:<line>  # Set breakpoint
info     # Show frame info
list     # Show source code
var local  # Show local variables
p expression  # Evaluate expression
```

### Pry (alternative debugger)

```bash
gem install pry pry-byebug
```

```ruby
require 'pry'
binding.pry  # Start Pry session

# Pry commands
ls              # List methods
show-method     # Show method source
whereami        # Show current location
next            # Step over
step            # Step into
continue        # Continue
exit            # Exit Pry
```

## Benchmarking

```ruby
require 'benchmark'

# Measure time
time = Benchmark.measure do
  1000.times { "hello".upcase }
end
puts time

# Compare
Benchmark.bm do |x|
  x.report("map: ")    { 1000.times { [1,2,3].map { |n| n*2 } } }
  x.report("collect: ") { 1000.times { [1,2,3].collect { |n| n*2 } } }
end

# Benchmark.b ips (iterations per second)
require 'benchmark/ips'
Benchmark.ips do |x|
  x.report("map")    { [1,2,3].map { |n| n*2 } }
  x.report("collect") { [1,2,3].collect { |n| n*2 } }
end
```

## Performance profiling

```ruby
require 'profile'
# Run with: ruby -rprofile script.rb

# Stackprof (sampling profiler)
require 'stackprof'
StackProf.run(mode: :cpu) do
  heavy_computation
end
report = StackProf::Report.new(raw)
report.print_text
```

## Editors and IDEs

### VS Code

- Ruby extension
- Ruby LSP (Shopify's language server)
- Solargraph (language server)
- Rufo (formatter)

### RubyMine

- Full IDE by JetBrains
- Built-in debugger, refactoring, testing
- Rails support

### Neovim / Vim

- vim-ruby plugin
- LSP via nvim-lspconfig
- Treesitter for syntax highlighting

### Zed

- Built-in Ruby support
- LSP integration

## Other tools

### Binstubs

```bash
bundle binstubs rspec   # Create bin/rspec
bin/rspec               # Run without bundle exec
```

### Spring (Rails preloader)

```bash
spring rails server
spring rails console
spring stop            # Stop Spring
```

### Foreman (process manager)

```bash
# Procfile
web: bundle exec rails server
worker: bundle exec sidekiq
```

```bash
foreman start
```

## Best practices

1. Use `Rake` for task automation
2. Use `RuboCop` for consistent code style
3. Use `YARD` for documentation generation
4. Use `debug` gem (Ruby 3.1+) or `pry-byebug` for debugging
5. Use `Benchmark.ips` for accurate performance comparisons
6. Use `stackprof` for production profiling
7. Use `binstubs` to avoid `bundle exec` prefix
8. Configure `AllCops: NewCops: enable` in RuboCop
9. Keep `.rubocop.yml` in version control
10. Use `Ruby LSP` for modern editor integration
