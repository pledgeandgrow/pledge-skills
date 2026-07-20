# Testing Rails Applications — Minitest, Fixtures, Integration, System Tests

## Test Directory Structure

```
test/
├── controllers/       # Functional tests
│   └── articles_controller_test.rb
├── models/            # Unit tests
│   └── article_test.rb
├── integration/       # Integration tests
│   └── user_flow_test.rb
├── system/            # System tests (browser-based)
│   └── articles_test.rb
├── jobs/              # Job tests
├── mailers/           # Mailer tests
├── channels/          # Action Cable tests
├── fixtures/          # Test data
│   ├── articles.yml
│   └── users.yml
└── test_helper.rb
```

## Running Tests

```bash
$ bin/rails test                    # all tests
$ bin/rails test test/models/       # specific directory
$ bin/rails test test/models/article_test.rb  # specific file
$ bin/rails test test/models/article_test.rb:12  # specific line
$ bin/rails test:system             # system tests only
$ bin/rails test --name test_truth  # specific test
```

## Fixtures

Fixtures are sample data in YAML format, loaded before each test:

```yaml
# test/fixtures/articles.yml
one:
  title: "My First Article"
  body: "This is the body"
  author: alice
  published: true

two:
  title: "Second Article"
  body: "Another body"
  author: bob
  published: false

published:
  title: "Published Article"
  body: "Published body"
  author: alice
  published: true
```

```yaml
# test/fixtures/users.yml
alice:
  name: "Alice"
  email: "alice@example.com"

bob:
  name: "Bob"
  email: "bob@example.com"
```

### Using Fixtures

```ruby
require "test_helper"

class ArticleTest < ActiveSupport::TestCase
  test "fixtures are loaded" do
    assert_equal "My First Article", articles(:one).title
    assert_equal "Alice", users(:alice).name
  end
end
```

### ERB in Fixtures

```yaml
<% 1.upto(100) do |i| %>
article_<%= i %>:
  title: "Article <%= i %>"
  body: "Body <%= i %>"
  published: true
<% end %>
```

### Associations in Fixtures

```yaml
# test/fixtures/comments.yml
one:
  article: one          # references articles(:one)
  body: "Great article!"

two:
  article: two
  body: "Nice post"
```

## Unit Tests (Models)

```ruby
require "test_helper"

class ArticleTest < ActiveSupport::TestCase
  # fixtures are auto-loaded

  test "should not save without title" do
    article = Article.new(body: "Body")
    assert_not article.save
    assert_not_nil article.errors[:title]
  end

  test "should save with valid attributes" do
    article = Article.new(title: "Title", body: "Body", author: users(:alice))
    assert article.save
  end

  test "title should be at least 5 characters" do
    article = Article.new(title: "Hi", body: "Body")
    assert_not article.valid?
    assert_includes article.errors[:title], "is too short"
  end

  test "published scope returns only published articles" do
    published = Article.published
    assert_includes published, articles(:one)
    assert_not_includes published, articles(:two)
  end
end
```

### Setup and Teardown

```ruby
class ArticleTest < ActiveSupport::TestCase
  setup do
    @article = articles(:one)
  end

  teardown do
    # cleanup after each test
  end

  test "title is present" do
    assert_not_nil @article.title
  end
end
```

## Functional Tests (Controllers)

```ruby
require "test_helper"

class ArticlesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get articles_url
    assert_response :success
    assert_select "h1", "Articles"
  end

  test "should get new" do
    get new_article_url
    assert_response :success
  end

  test "should create article" do
    assert_difference("Article.count") do
      post articles_url, params: { article: { title: "New", body: "Body" } }
    end
    assert_redirected_to article_url(Article.last)
  end

  test "should show article" do
    get article_url(articles(:one))
    assert_response :success
  end

  test "should get edit" do
    get edit_article_url(articles(:one))
    assert_response :success
  end

  test "should update article" do
    patch article_url(articles(:one)), params: { article: { title: "Updated" } }
    assert_redirected_to article_url(articles(:one))
  end

  test "should destroy article" do
    assert_difference("Article.count", -1) do
      delete article_url(articles(:one))
    end
    assert_redirected_to articles_url
  end

  test "should not create invalid article" do
    assert_no_difference("Article.count") do
      post articles_url, params: { article: { title: "", body: "" } }
    end
    assert_response :unprocessable_entity
  end
end
```

### Testing JSON API

```ruby
test "should get index as JSON" do
  get articles_url, as: :json
  assert_response :success
  json = response.parsed_body
  assert_equal 3, json.length
end
```

### Testing with Authentication

```ruby
test "should require authentication" do
  get articles_url
  assert_response :redirect
end

test "should get index when authenticated" do
  sign_in users(:alice)
  get articles_url
  assert_response :success
end
```

## Integration Tests

Test across multiple controllers and actions:

```ruby
require "test_helper"

class UserFlowTest < ActionDispatch::IntegrationTest
  test "user can create and view article" do
    get new_article_url
    assert_response :success

    post articles_url, params: { article: { title: "Integration Test", body: "Body" } }
    assert_redirected_to article_url(Article.last)

    follow_redirect!
    assert_response :success
    assert_select "h1", "Integration Test"
  end
end
```

## System Tests

Browser-based tests using Capybara:

```ruby
require "test_helper"

class ArticlesTest < ActionSystemTestCase
  driven_by :selenium, using: :headless_chrome, screen_size: [1400, 1400]

  test "visiting the index" do
    visit articles_url
    assert_selector "h1", text: "Articles"
  end

  test "creating an article" do
    visit articles_url
    click_on "New Article"

    fill_in "Title", with: "System Test Article"
    fill_in "Body", with: "This is a test body"
    click_on "Create Article"

    assert_text "Article was successfully created"
    assert_text "System Test Article"
  end

  test "destroying an article" do
    visit articles_url
    accept_confirm do
      click_on "Destroy", match: :first
    end
    assert_text "Article was successfully destroyed"
  end
end
```

### System Test Configuration

```ruby
# test/application_system_test_case.rb
class ApplicationSystemTestCase < ActionSystemTestCase
  driven_by :selenium, using: :headless_chrome, screen_size: [1400, 1400]
end
```

## Assertions Reference

### Standard Assertions

```ruby
assert true                       # passes if true
assert_equal 1, Article.count     # passes if equal
assert_not_nil object             # passes if not nil
assert_nil object                 # passes if nil
assert_raises(NoMethodError) { ... }
assert_instance_of String, "hi"
assert_includes array, item
assert_match /pattern/, string
assert_respond_to object, :method
assert_difference("Article.count", 1) { ... }
assert_no_difference("Article.count") { ... }
```

### Rails-Specific Assertions

```ruby
assert_response :success          # 200
assert_response :redirect         # 3xx
assert_response :not_found        # 404
assert_response :unprocessable_entity  # 422
assert_response :created          # 201

assert_redirected_to article_path(article)
assert_select "h1", "Title"       # CSS selector in HTML
assert_select "div.article", count: 3
assert_select "form input[name='article[title]']"

assert_dom_equal expected, actual
assert_not_dom_equal expected, actual

# Flash
assert_equal "Created", flash[:notice]

# Cookies
assert_equal "value", cookies[:key]
```

## Testing Mailers

```ruby
require "test_helper"

class UserMailerTest < ActionMailer::TestCase
  test "welcome email" do
    user = users(:alice)
    email = UserMailer.welcome_email(user)

    assert_emails 1 do
      email.deliver_now
    end

    assert_equal ["noreply@example.com"], email.from
    assert_equal [user.email], email.to
    assert_equal "Welcome to My App!", email.subject
    assert_includes email.body.encoded, "Welcome"
  end
end
```

## Testing Jobs

```ruby
require "test_helper"

class CleanupJobTest < ActiveJob::TestCase
  test "removes old guests" do
    assert_difference("Guest.count", -3) do
      CleanupJob.perform_now
    end
  end

  test "enqueued with correct queue" do
    assert_enqueued_with(job: CleanupJob, queue: :default) do
      CleanupJob.perform_later
    end
  end
end
```

## Testing Channels

```ruby
require "test_helper"

class ChatChannelTest < ActionCable::Channel::TestCase
  test "subscribes to room" do
    stub_connection(current_user: users(:alice))
    subscribe room: "general"
    assert subscription.confirmed?
    assert_has_stream "chat:general"
  end
end
```

## Minitest Spec Syntax

```ruby
require "test_helper"

class ArticleSpec < ActiveSupport::TestCase
  # Use spec syntax
  describe Article do
    let(:article) { Article.new(title: "Title", body: "Body") }

    it "is valid with valid attributes" do
      _(article).must_be :valid?
    end

    it "is invalid without title" do
      article.title = nil
      _(article).wont_be :valid?
    end
  end
end
```

## RSpec (Third-Party)

```ruby
# Gemfile
group :development, :test do
  gem "rspec-rails"
end
```

```bash
$ bin/rails generate rspec:install
```

```ruby
require "rails_helper"

RSpec.describe Article, type: :model do
  it "is valid with valid attributes" do
    article = Article.new(title: "Title", body: "Body")
    expect(article).to be_valid
  end

  it "is invalid without a title" do
    article = Article.new(title: nil)
    expect(article).to_not be_valid
    expect(article.errors[:title]).to include("can't be blank")
  end

  describe "scopes" do
    it "returns published articles" do
      expect(Article.published).to include(articles(:one))
    end
  end
end
```

## Mocking and Stubbing

```ruby
# Using Minitest::Mock
test "calls external API" do
  api = Minitest::Mock.new
  api.expect :fetch, { status: "ok" }, ["key"]

  service = MyService.new(api)
  result = service.call

  assert_equal "ok", result[:status]
  api.verify
end
```

## Parallel Testing

```ruby
# test/test_helper.rb
parallelize(workers: :number_of_processors) unless ENV["CI"]
```

## Factory Bot (Alternative to Fixtures)

```ruby
# Gemfile
group :development, :test do
  gem "factory_bot_rails"
end
```

```ruby
# test/factories/articles.rb
FactoryBot.define do
  factory :article do
    title { "Test Article" }
    body { "Test body" }
    author { association :user }
    published { false }

    trait :published do
      published { true }
    end
  end
end
```

```ruby
test "factory creates valid article" do
  article = FactoryBot.create(:article, :published)
  assert article.valid?
  assert article.published
end
```
