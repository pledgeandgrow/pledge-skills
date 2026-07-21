# Introduction to Ruby

What is Ruby, installation, quickstart, and IRB.

## What is Ruby?

Ruby is a dynamic, open-source programming language with a focus on simplicity and productivity. It features an elegant syntax that is natural to read and easy to write. Created by Yukihiro Matsumoto (Matz) in 1995, Ruby is a pure object-oriented language where everything is an object.

### Key characteristics

- **Pure Object-Oriented** — Everything is an object (numbers, strings, classes, modules)
- **Dynamic Typing** — Types are determined at runtime
- **Duck Typing** — "If it walks like a duck and quacks like a duck, it is a duck"
- **Garbage Collected** — Automatic memory management
- **Blocks and Closures** — First-class support for blocks, Procs, and lambdas
- **Metaprogramming** — Powerful reflection and metaprogramming capabilities
- **Expressive Syntax** — Designed for developer happiness and readability

### Ruby versions

- **Ruby 3.x** — Current stable line (3.0 released Dec 2020, latest 3.4+)
- **Ruby 4.0** — Upcoming, in development (master branch)
- YJIT (Yet Another Ruby JIT) — Built-in JIT compiler since 3.1, production-ready since 3.2

## Installing Ruby

### Package managers

**macOS (Homebrew):**
```bash
brew install ruby
```

**Ubuntu/Debian (apt):**
```bash
sudo apt-get install ruby-full
```

**Windows (Chocolatey):**
```bash
choco install ruby
```

**Windows (RubyInstaller):**
Download from [rubyinstaller.org](https://rubyinstaller.org/)

### Version managers (recommended)

**rbenv:**
```bash
brew install rbenv ruby-build
rbenv install 3.4.1
rbenv global 3.4.1
```

**RVM:**
```bash
\curl -sSL https://get.rvm.io | bash -s stable
rvm install 3.4.1
rvm use 3.4.1 --default
```

**asdf:**
```bash
asdf plugin add ruby
asdf install ruby 3.4.1
asdf global ruby 3.4.1
```

**mise-en-place:**
```bash
mise use ruby@3.4.1
```

### Building from source

```bash
./configure
make
sudo make install
```

### Verifying installation

```bash
ruby -v
# ruby 3.4.1 (2024-12-25 revision ...) [x86_64-linux]
```

## Quickstart: Ruby in Twenty Minutes

### Interactive Ruby (IRB)

```bash
irb
```

### Your first Ruby

```ruby
puts "Hello, World!"
```

### Everything is an object

```ruby
5.times { puts "Ruby is awesome!" }
"Hello".length        # => 5
"Hello".reverse       # => "olleH"
"Hello".upcase        # => "HELLO"
42.even?              # => true
```

### Methods

```ruby
def greet(name)
  "Hello, #{name}!"
end

puts greet("World")  # => Hello, World!
```

### Classes

```ruby
class Greeter
  def initialize(name = "World")
    @name = name
  end

  def say_hi
    puts "Hi, #{@name}!"
  end

  def say_bye
    puts "Bye, #{@name}!"
  end
end

g = Greeter.new("Ruby")
g.say_hi   # => Hi, Ruby!
g.say_bye  # => Bye, Ruby!
```

### Modules

```ruby
module Greeting
  def wave
    puts "👋 Hello!"
  end
end

class Person
  include Greeting
end

Person.new.wave  # => 👋 Hello!
```

## Running Ruby

### Scripts

```bash
ruby my_script.rb
```

### One-liners

```bash
ruby -e 'puts "Hello, World!"'
```

### Executable scripts

```ruby
#!/usr/bin/env ruby
puts "Hello, World!"
```

```bash
chmod +x my_script.rb
./my_script.rb
```

## IRB (Interactive Ruby)

IRB is Ruby's interactive REPL:

```bash
irb
irb(main):001> 2 + 2
=> 4
irb(main):002> [1, 2, 3].map { |n| n * 2 }
=> [2, 4, 6]
irb(main):003> "ruby".upcase
=> "RUBY"
```

### Useful IRB commands

- `irb -r <file>` — Load a file before starting
- `exit` or `quit` — Exit IRB
- `_` — Last result
- `ls` — List methods of an object
- `show_source <method>` — Show source of a method
- `help` — Display help

## Official documentation

- [docs.ruby-lang.org](https://docs.ruby-lang.org/en) — Official RDoc for all Ruby versions
- [rubyapi.org](https://rubyapi.org/) — Community API browser
- [ruby-doc.org](https://ruby-doc.org/) — Legacy docs site
- [C Extension Guide](https://docs.ruby-lang.org/en/master/extension_rdoc.html)

## Community resources

- [Try Ruby](https://try.ruby-lang.org/) — Interactive in-browser tutorial
- [Ruby Style Guide](https://rubystyle.guide/)
- [RuboCop](https://github.com/rubocop/rubocop) — Static code analyzer
- [RubyGems](https://rubygems.org/) — Package repository
- [The Odin Project](https://www.theodinproject.com/paths/full-stack-ruby-on-rails/courses/ruby)
- [Exercism](https://exercism.org/tracks/ruby)
