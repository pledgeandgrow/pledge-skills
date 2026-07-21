# Gems and Bundler

RubyGems package management, Bundler dependency management, and publishing.

## RubyGems

### Installing gems

```bash
# Install a gem
gem install rails
gem install rails -v 7.1.0
gem install rails --pre

# Install from source
gem install ./my_gem-1.0.0.gem

# Install from Git
gem install specific_gem --source https://github.com/user/repo.git
```

### Managing gems

```bash
# List installed gems
gem list
gem list rails

# Update gems
gem update
gem update rails

# Uninstall
gem uninstall rails
gem uninstall rails -v 7.0.0

# Search
gem search rails
gem search rails --remote

# Show info
gem info rails
gem dependency rails
```

### Gem sources

```bash
# List sources
gem sources

# Add a source
gem sources --add https://gems.example.com/

# Remove a source
gem sources --remove https://gems.example.com/
```

## Bundler

Bundler manages gem dependencies for projects.

### Gemfile

```ruby
# Gemfile
source 'https://rubygems.org'

ruby '3.4.1'

# Production gems
gem 'rails', '~> 7.1'
gem 'pg', '~> 1.5'
gem 'puma', '~> 6.0'
gem 'sass-rails'
gem 'bootsnap', require: false

# Gem with specific version
gem 'sidekiq', '7.2.0'

# Gem from Git
gem 'rails', git: 'https://github.com/rails/rails.git', branch: 'main'
gem 'custom_gem', git: 'git@github.com:user/custom_gem.git', tag: 'v1.0'

# Gem from path (local development)
gem 'my_engine', path: '../my_engine'

# Gem with require override
gem 'redis', require: ['redis', 'redis/connection/hiredis']

# Gem with platform
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw]

# Group gems
group :development, :test do
  gem 'rspec-rails', '~> 6.0'
  gem 'factory_bot_rails'
  gem 'pry-rails'
  gem 'rubocop', require: false
end

group :production do
  gem 'newrelic_rpm'
  gem 'lograge'
end
```

### Bundler commands

```bash
# Install gems from Gemfile
bundle install
bundle install --without production
bundle install --path vendor/bundle

# Update gems
bundle update              # Update all
bundle update rails        # Update specific gem
bundle update --conservative rails

# Execute commands in bundle context
bundle exec rails server
bundle exec rspec
bundle exec rake db:migrate

# Check for outdated gems
bundle outdated

# Show gem dependencies
bundle show rails
bundle list
bundle info rails

# Lock and check
bundle lock
bundle check

# Add a gem to Gemfile
bundle add sidekiq --version "~> 7.0"

# Remove a gem
bundle remove sidekiq

# Clean old gems
bundle clean
```

### Gemfile.lock

The `Gemfile.lock` file locks exact versions. Always commit it to version control.

### Gem groups

```ruby
# Install without specific groups
bundle install --without test development

# Require specific groups
Bundler.require(:default, :development)
Bundler.require(*Rails.groups)
```

## Creating a gem

### Gem structure

```
my_gem/
├── lib/
│   ├── my_gem/
│   │   ├── version.rb
│   │   └── core.rb
│   └── my_gem.rb
├── spec/
│   ├── spec_helper.rb
│   └── my_gem_spec.rb
├── Gemfile
├── my_gem.gemspec
├── Rakefile
└── README.md
```

### gemspec

```ruby
# my_gem.gemspec
require_relative 'lib/my_gem/version'

Gem::Specification.new do |spec|
  spec.name = 'my_gem'
  spec.version = MyGem::VERSION
  spec.authors = ['Your Name']
  spec.email = ['you@example.com']

  spec.summary = 'A short summary of my gem'
  spec.description = 'A longer description of what my gem does'
  spec.homepage = 'https://github.com/you/my_gem'
  spec.license = 'MIT'
  spec.required_ruby_version = '>= 3.0'

  spec.metadata = {
    'homepage_uri' => spec.homepage,
    'source_code_uri' => 'https://github.com/you/my_gem',
    'changelog_uri' => 'https://github.com/you/my_gem/blob/main/CHANGELOG.md'
  }

  spec.files = Dir.chdir(__dir__) do
    Dir['{lib}/**/*', 'README.md', 'LICENSE']
  end

  spec.require_paths = ['lib']

  # Runtime dependencies
  spec.add_dependency 'json', '~> 2.6'
  spec.add_dependency 'net-http', '~> 0.4'

  # Development dependencies
  spec.add_development_dependency 'bundler', '~> 2.0'
  spec.add_development_dependency 'rake', '~> 13.0'
  spec.add_development_dependency 'rspec', '~> 3.12'
end
```

### version.rb

```ruby
module MyGem
  VERSION = '1.0.0'
end
```

### entry point (my_gem.rb)

```ruby
require_relative 'my_gem/version'
require_relative 'my_gem/core'

module MyGem
  class Error < StandardError; end
end
```

### Building and publishing

```bash
# Build the gem
gem build my_gem.gemspec
# Creates my_gem-1.0.0.gem

# Install locally for testing
gem install ./my_gem-1.0.0.gem

# Push to RubyGems.org
gem push my_gem-1.0.0.gem

# Yank a version (remove from index)
gem yank my_gem -v 1.0.0
```

### Using Bundler to create a gem

```bash
bundle gem my_gem
bundle gem my_gem --test=rspec
bundle gem my_gem --test=minitest --ci=github
```

## Gem versioning

Ruby follows [SemVer](https://semver.org/):

- **Major** (1.0.0 → 2.0.0) — Breaking changes
- **Minor** (1.0.0 → 1.1.0) — New features, backward compatible
- **Patch** (1.0.0 → 1.0.1) — Bug fixes, backward compatible

### Version operators in Gemfile

```ruby
gem 'rails', '7.1.0'           # Exactly 7.1.0
gem 'rails', '>= 7.0'          # 7.0 or higher
gem 'rails', '~> 7.1'          # >= 7.1, < 8.0 (pessimistic)
gem 'rails', '~> 7.1.0'        # >= 7.1.0, < 7.2.0
gem 'rails', '< 8.0'           # Less than 8.0
gem 'rails', '>= 7.0', '< 8.0' # Range
```

## Best practices

1. Always commit `Gemfile.lock`
2. Use `~>` (pessimistic version) for dependencies
3. Group gems by environment (development, test, production)
4. Use `bundle exec` to run commands in the bundle context
5. Pin Ruby version in Gemfile with `ruby '3.4.1'`
6. Keep gem dependencies minimal
7. Set `required_ruby_version` in gemspec
8. Use `bundle add` instead of manually editing Gemfile
9. Run `bundle outdated` regularly
10. Use `bundle audit` to check for security vulnerabilities
