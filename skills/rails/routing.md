# Rails Routing — From the Outside In

## Purpose of the Router

The Rails router:
1. **Recognizes URLs** and dispatches them to controller actions
2. **Generates paths and URLs** from code (helpers)

## Resource Routing

A single line creates 7 RESTful routes:

```ruby
# config/routes.rb
Rails.application.routes.draw do
  resources :articles
  root 'articles#index'
end
```

### Routes Created

| HTTP Method | Path | Controller#Action | Helper |
|-------------|------|-------------------|--------|
| GET | /articles | articles#index | `articles_path` |
| GET | /articles/new | articles#new | `new_article_path` |
| POST | /articles | articles#create | `articles_path` |
| GET | /articles/:id | articles#show | `article_path(:id)` |
| GET | /articles/:id/edit | articles#edit | `edit_article_path(:id)` |
| PATCH/PUT | /articles/:id | articles#update | `article_path(:id)` |
| DELETE | /articles/:id | articles#destroy | `article_path(:id)` |

Each `_path` helper has a corresponding `_url` helper (includes host, port, protocol).

### Multiple Resources

```ruby
resources :photos, :books, :videos
```

### Singular Resources

For resources where there's only one (e.g., user profile):

```ruby
resource :profile
```

Creates 6 routes (no `:id` in URL):

| HTTP Method | Path | Controller#Action | Helper |
|-------------|------|-------------------|--------|
| GET | /profile/new | profiles#new | `new_profile_path` |
| POST | /profile | profiles#create | `profile_path` |
| GET | /profile | profiles#show | `profile_path` |
| GET | /profile/edit | profiles#edit | `edit_profile_path` |
| PATCH/PUT | /profile | profiles#update | `profile_path` |
| DELETE | /profile | profiles#destroy | `profile_path` |

## Nested Resources

```ruby
resources :articles do
  resources :comments
end
```

Creates routes like `/articles/:article_id/comments/:id`.

Helpers: `article_comments_path(@article)`, `article_comment_path(@article, @comment)`

### Shallow Nesting

Avoid deep nesting (rule of thumb: 1 level max):

```ruby
resources :articles do
  resources :comments, shallow: true
end
```

Collection actions (`index`, `new`, `create`) stay nested. Member actions (`show`, `edit`, `update`, `destroy`) use shallow paths (`/comments/:id` instead of `/articles/:article_id/comments/:id`).

### Shallow Scope

```ruby
shallow do
  resources :articles do
    resources :comments
    resources :quotes
  end
end
```

## Controller Namespaces and Routing

```ruby
namespace :admin do
  resources :articles, :comments
end
```

Routes to `Admin::ArticlesController` at `/admin/articles`.

### Scope

```ruby
scope module: 'admin' do
  resources :articles  # routes to Admin::ArticlesController at /articles
end

scope path: '/admin', as: 'admin' do
  resources :articles  # routes at /admin/articles, helpers: admin_articles_path
end
```

## Routing Concerns

```ruby
concern :commentable do
  resources :comments
end

resources :articles, concerns: :commentable
resources :photos, concerns: :commentable
```

## Adding Member and Collection Routes

### Member Routes

```ruby
resources :photos do
  member do
    get 'preview'
  end
end
# GET /photos/:id/preview → photos#preview
# Helper: preview_photo_path(@photo)

# Shorthand:
resources :photos do
  get 'preview', on: :member
end
```

### Collection Routes

```ruby
resources :photos do
  collection do
    get 'search'
  end
end
# GET /photos/search → photos#search
# Helper: search_photos_path

# Shorthand:
resources :photos do
  get 'search', on: :collection
end
```

## Non-Resourceful Routes

### Basic

```ruby
get 'welcome/index'
get 'about', to: 'pages#about'
post 'webhook', to: 'webhooks#receive'
```

### Dynamic Segments

```ruby
get 'articles/:year/:month', to: 'articles#archive'
# /articles/2024/01 → params[:year] = "2024", params[:month] = "01"
```

### Default Parameters

```ruby
get 'photos/:id', to: 'photos#show', defaults: { id: '1' }
```

### Named Routes

```ruby
get 'about', to: 'pages#about', as: :about
# about_path → "/about"
```

### HTTP Verb Constraints

```ruby
get    'articles', to: 'articles#index'
post   'articles', to: 'articles#create'
patch  'articles/:id', to: 'articles#update'
delete 'articles/:id', to: 'articles#destroy'
match  'articles', to: 'articles#index', via: [:get, :post]
```

### Segment Constraints

```ruby
get 'articles/:id', to: 'articles#show', constraints: { id: /\d+/ }
get 'articles/:permalink', to: 'articles#show', constraints: { permalink: /[a-z\-]+/ }
```

### Request-Based Constraints

```ruby
get 'admin', to: 'admin#index', constraints: { subdomain: 'admin' }
get 'photos', to: 'photos#index', constraints: { ip: '192.168.1.0/24' }
```

### Advanced Constraints (Class)

```ruby
class IpRestrictor
  def matches?(request)
    request.remote_ip == '127.0.0.1'
  end
end

get 'admin', to: 'admin#index', constraints: IpRestrictor.new
```

### Wildcard Segments

```ruby
get 'files/*path', to: 'files#show'
# /files/docs/readme.txt → params[:path] = "docs/readme.txt"
```

### Redirection

```ruby
get '/old-path', to: redirect('/new-path')
get '/users/:id', to: redirect('/profiles/%{id}')
get '/legacy', to: redirect(path: '/new', status: 301)
```

### Root Route

```ruby
root 'articles#index'
# Or:
root to: 'articles#index'
```

## Customizing Resourceful Routes

### Specifying a Controller

```ruby
resources :articles, controller: 'posts'
resources :articles, controller: 'admin/articles'
```

### Overriding Named Helpers

```ruby
resources :articles, as: 'posts'
# post_path instead of article_path
```

### Restricting Routes

```ruby
resources :articles, only: [:index, :show]
resources :comments, except: [:destroy]
```

### Renaming Route Parameter

```ruby
resources :articles, param: :slug
# /articles/:slug instead of /articles/:id
```

### Path Names

```ruby
resources :articles, path_names: { new: 'create', edit: 'modify' }
# /articles/create instead of /articles/new
```

### Path Prefix

```ruby
resources :articles, path: '/blog'
# /blog instead of /articles
```

## Creating Paths and URLs from Objects

```ruby
# If Article model has to_param returning a slug:
class Article < ApplicationRecord
  def to_param
    "#{id}-#{title.parameterize}"
  end
end

article_path(@article)  # /articles/42-hello-world
```

## resolve

```ruby
resolve('Article') { [:articles, object] }
```

## Direct Routes

```ruby
direct :homepage do
  { controller: 'pages', action: 'index' }
end
homepage_path  # "/"

direct :comment do |comment|
  { controller: 'comments', action: 'show', id: comment.id }
end
```

## Routing to Rack Applications

```ruby
mount Sidekiq::Web => '/sidekiq'
mount Healthcheck::Engine => '/health'
```

## Inspecting Routes

```bash
$ bin/rails routes
$ bin/rails routes -g articles    # filter
$ bin/rails routes -c articles    # filter by controller
$ bin/rails routes --expanded     # expanded format
```

### In Console

```ruby
Rails.application.routes.routes
Rails.application.routes.url_helpers.articles_path
```

## Breaking Up Large Route Files

```ruby
# config/routes.rb
Rails.application.routes.draw do
  draw :admin
  draw :api
  resources :articles
end

# config/routes/admin.rb
namespace :admin do
  resources :articles, :users
end
```

## Unicode Character Routes

```ruby
get 'café', to: 'cafes#show'
# /café works
```
