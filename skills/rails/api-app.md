# API-Only Applications — JSON API, ActionController::API

## Creating an API-Only App

```bash
$ rails new my_api --api
```

An API-only Rails app:
- Uses `ActionController::API` instead of `ActionController::Base`
- Skips view rendering, layouts, cookies, flash
- No CSRF protection (use token auth instead)
- Lighter middleware stack

### Converting Existing App

```ruby
# config/application.rb
config.api_only = true
```

## API Controller

```ruby
class ApplicationController < ActionController::API
  # Includes: render, redirect, strong params, rescue_from
  # Excludes: cookies, session, flash, layouts, view rendering
end

class Api::V1::ArticlesController < ApplicationController
  before_action :set_article, only: [:show, :update, :destroy]
  before_action :authenticate_token

  def index
    articles = Article.all
    render json: articles
  end

  def show
    render json: @article
  end

  def create
    article = Article.new(article_params)
    if article.save
      render json: article, status: :created, location: api_v1_article_url(article)
    else
      render json: article.errors, status: :unprocessable_entity
    end
  end

  def update
    if @article.update(article_params)
      render json: @article
    else
      render json: @article.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @article.destroy
    head :no_content
  end

  private

  def set_article
    @article = Article.find(params[:id])
  end

  def article_params
    params.expect(article: [:title, :body])
  end

  def authenticate_token
    token = request.headers["Authorization"]&.remove(/^Bearer /)
    @current_user = User.find_by(api_token: token) if token
    render json: { error: "Unauthorized" }, status: :unauthorized unless @current_user
  end
end
```

## Rendering JSON

### Using render json

```ruby
render json: @article
render json: @article, status: :created
render json: @article, include: :comments
render json: @article, only: [:id, :title, :body]
render json: @article, except: [:created_at, :updated_at]
render json: @article, methods: :display_name
render json: { status: "ok", data: @article }
render json: @article.errors, status: :unprocessable_entity
```

### Using Jbuilder

```ruby
# app/views/api/v1/articles/show.json.jbuilder
json.extract! @article, :id, :title, :body, :created_at, :updated_at
json.author do
  json.extract! @article.author, :id, :name, :email
end
json.comments @article.comments do |comment|
  json.extract! comment, :id, :body
  json.author comment.author.name
end
```

```ruby
# app/views/api/v1/articles/index.json.jbuilder
json.array! @articles, :id, :title, :body
```

### Using Active Model Serializers

```ruby
# Gemfile
gem "active_model_serializers"
```

```ruby
class ArticleSerializer < ActiveModel::Serializer
  attributes :id, :title, :body, :created_at
  has_one :author
  has_many :comments
end

# Controller
render json: @article  # uses serializer automatically
```

## Routing for APIs

```ruby
# config/routes.rb
Rails.application.routes.draw do
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :articles
      resources :comments, only: [:index, :create]
    end
  end
end
```

### Versioning

```ruby
namespace :api do
  namespace :v1 do
    resources :articles
  end

  namespace :v2 do
    resources :articles
  end
end
```

## Authentication

### Token-Based

```ruby
class Api::BaseController < ActionController::API
  before_action :authenticate

  private

  def authenticate
    token = request.headers["Authorization"]&.remove(/^Bearer /)
    @current_user = User.find_by(api_token: token)
    render json: { error: "Unauthorized" }, status: :unauthorized unless @current_user
  end

  def current_user
    @current_user
  end
end
```

### Using has_secure_password + JWT

```ruby
class Api::TokensController < Api::BaseController
  skip_before_action :authenticate, only: :create

  def create
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      token = JWT.encode({ user_id: user.id, exp: 24.hours.from_now.to_i },
                         Rails.application.credentials.secret_key_base)
      render json: { token: token }
    else
      render json: { error: "Invalid credentials" }, status: :unauthorized
    end
  end
end
```

## Rate Limiting

```ruby
class Api::V1::ArticlesController < Api::BaseController
  rate_limit to: 100, within: 1.minute, by: -> { current_user&.id || request.remote_ip }
end
```

## CORS (Cross-Origin Resource Sharing)

```ruby
# Gemfile
gem "rack-cors"
```

```ruby
# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "https://frontend.example.com"

    resource "*",
      headers: :any,
      methods: [:get, :post, :patch, :put, :delete, :options],
      credentials: true
  end
end
```

## Error Handling

```ruby
class Api::BaseController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActiveRecord::RecordInvalid, with: :record_invalid
  rescue_from ActionController::ParameterMissing, with: :param_missing

  private

  def not_found
    render json: { error: "Not found" }, status: :not_found
  end

  def record_invalid(e)
    render json: { errors: e.record.errors }, status: :unprocessable_entity
  end

  def param_missing(e)
    render json: { error: e.message }, status: :bad_request
  end
end
```

## Pagination

```ruby
# Gemfile
gem "pagy"
```

```ruby
class Api::V1::ArticlesController < Api::BaseController
  def index
    @pagy, @articles = pagy(Article.all, items: 20)
    render json: {
      data: @articles,
      pagination: {
        page: @pagy.page,
        pages: @pagy.pages,
        count: @pagy.count
      }
    }
  end
end
```

## Testing API Endpoints

```ruby
require "test_helper"

class Api::V1::ArticlesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_articles_url, as: :json
    assert_response :success
    json = response.parsed_body
    assert_kind_of Array, json
  end

  test "should create article" do
    assert_difference("Article.count") do
      post api_v1_articles_url,
        params: { article: { title: "New", body: "Body" } },
        as: :json,
        headers: { "Authorization" => "Bearer #{users(:alice).api_token}" }
    end
    assert_response :created
  end

  test "should return 401 without token" do
    get api_v1_articles_url, as: :json
    assert_response :unauthorized
  end
end
```

## Adding Back Features

If you need cookies or sessions in an API app:

```ruby
class ApplicationController < ActionController::API
  # Add back specific features
  include ActionController::Cookies
  include ActionController::Flash
end
```
