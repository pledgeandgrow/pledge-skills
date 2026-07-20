# Action View — Templates, Layouts, Rendering, Helpers, Forms

## What is Action View?

Action View is responsible for generating HTML (and other formats) for web responses. Templates are stored in `app/views/<controller_name>/`.

## Templates

### ERB (Embedded Ruby)

`.html.erb` files mix HTML with Ruby:

```erb
<h1><%= @article.title %></h1>
<p><%= @article.body %></p>

<% @article.comments.each do |comment| %>
  <div><%= comment.body %></div>
<% end %>

<%# This is a comment %>
```

- `<%= ... %>` — outputs the result
- `<% ... %>` — executes without output
- `<%# ... %>` — comment

### Jbuilder (JSON)

`.json.jbuilder` files build JSON responses:

```ruby
json.extract! @article, :id, :title, :body
json.author @article.author.name
json.comments @article.comments do |comment|
  json.extract! comment, :id, :body
end
```

### Builder (XML)

`.xml.builder` files build XML:

```ruby
xml.article do
  xml.title @article.title
  xml.body @article.body
end
```

## Rendering

### Default Rendering (Convention Over Configuration)

Rails automatically renders the template matching the controller action:

```ruby
class ArticlesController < ApplicationController
  def index
    @articles = Article.all
    # automatically renders app/views/articles/index.html.erb
  end
end
```

### Explicit Rendering

```ruby
# Render same controller's action
render :edit
render "edit"
render action: :edit

# Render another controller's template
render "products/show"
render template: "products/show"

# Render with status
render :new, status: :unprocessable_entity

# Render inline
render inline: "<p>Hello</p>"

# Render text
render plain: "OK"

# Render JSON
render json: @article
render json: { status: "ok" }

# Render XML
render xml: @article

# Render nothing (head only)
head :ok
head :not_found
head :created, location: article_url(@article)
```

### Redirecting

```ruby
redirect_to @article
redirect_to articles_path
redirect_to articles_path, notice: "Created successfully."
redirect_to articles_path, alert: "Something went wrong."
redirect_back fallback_location: articles_path
```

## Layouts

Layouts wrap templates. The default layout is `app/views/layouts/application.html.erb`:

```erb
<!DOCTYPE html>
<html>
  <head>
    <title><%= content_for?(:title) ? yield(:title) : "Store" %></title>
    <%= csrf_meta_tags %>
    <%= csp_meta_tag %>
    <%= stylesheet_link_tag "application" %>
    <%= javascript_importmap_tags %>
    <%= yield :head %>
  </head>
  <body>
    <%= yield %>
  </body>
</html>
```

### yield and content_for

```erb
<%# In layout: %>
<%= yield :head %>
<%= yield %>

<%# In template: %>
<% content_for :head do %>
  <meta name="description" content="Article page">
<% end %>

<h1>Article</h1>
```

### Multiple Layouts

```ruby
class ArticlesController < ApplicationController
  layout "admin"  # uses app/views/layouts/admin.html.erb

  # Per-action layout
  layout "public", only: [:index, :show]

  # Conditional layout
  layout :resolve_layout

  private

  def resolve_layout
    if admin?
      "admin"
    else
      "public"
    end
  end
end
```

### Disabling Layout

```ruby
render :index, layout: false
```

## Partials

Partials are reusable view fragments, prefixed with `_`:

```erb
<%# app/views/articles/_article.html.erb %>
<div class="article">
  <h2><%= article.title %></h2>
  <p><%= article.body %></p>
</div>
```

### Rendering Partials

```erb
<%= render "article" %>
<%= render "articles/article" %>
<%= render partial: "article", locals: { article: @article } %>
```

### Rendering Collections

```erb
<%= render @articles %>
<%# Renders _article.html.erb for each article in @articles %>

<%= render @articles, spacer_template: "article_divider" %>
```

### Passing Local Variables

```erb
<%= render "shared/header", title: "Welcome", user: current_user %>

<%# In _header.html.erb: %>
<h1><%= title %></h1>
<p>Hello, <%= user.name %></p>
```

### Strict Locals

```erb
<%# app/views/articles/_article.html.erb %>
<%# strict_locals: article, show_actions: false %>
<div class="article">
  <h2><%= article.title %></h2>
  <% if show_actions %>
    <%= link_to "Edit", edit_article_path(article) %>
  <% end %>
</div>
```

### Collection Counter Variables

```erb
<%# In _article.html.erb rendered as a collection: %>
<%= article_counter %>      # 0-based index
<%= article_iteration %>    # iteration info (index, size, first?, last?)
```

### Partial Layouts

```erb
<%= render layout: "card", locals: { title: "Article" } do %>
  <p>Content here</p>
<% end %>
```

## Form Helpers

### form_with (Model-Bound Forms)

```erb
<%= form_with model: @article do |form| %>
  <div>
    <%= form.label :title %>
    <%= form.text_field :title %>
  </div>

  <div>
    <%= form.label :body %>
    <%= form.text_area :body %>
  </div>

  <%= form.submit %>
<% end %>
```

Key behaviors:
- **Action**: auto-set based on model (POST for new, PATCH for existing)
- **Field names**: scoped as `article[title]` → accessible via `params[:article]`
- **Submit text**: auto-generated ("Create Article" / "Update Article")
- **CSRF**: authenticity token auto-included

### Form Field Helpers

```erb
<%= form.text_field :title %>
<%= form.text_area :body, rows: 10 %>
<%= form.password_field :password %>
<%= form.email_field :email %>
<%= form.number_field :quantity %>
<%= form.date_field :published_on %>
<%= form.time_field :opens_at %>
<%= form.datetime_field :starts_at %>
<%= form.check_box :published %>
<%= form.radio_button :status, "draft" %>
<%= form.radio_button :status, "published" %>
<%= form.select :category, ["Tech", "News", "Sports"] %>
<%= form.select :category, Category.all.map { |c| [c.name, c.id] } %>
<%= form.collection_select :category_id, Category.all, :id, :name %>
<%= form.file_field :attachment %>
<%= form.hidden_field :user_id %>
<%= form.color_field :background %>
<%= form.range_field :priority, min: 1, max: 10 %>
<%= form.search_field :query %>
<%= form.telephone_field :phone %>
<%= form.url_field :website %>
```

### Date and Time Helpers

```erb
<%= form.date_select :birth_date, start_year: 1950 %>
<%= form.time_select :opens_at %>
<%= form.datetime_select :starts_at %>
<%= form.time_zone_select :time_zone %>
```

### Collection Helpers

```erb
<%= form.collection_select :author_id, Author.all, :id, :name %>
<%= form.collection_radio_buttons :author_id, Author.all, :id, :name %>
<%= form.collection_check_boxes :tag_ids, Tag.all, :id, :name %>
```

### File Uploads

```erb
<%= form_with model: @article, local: true do |form| %>
  <%= form.file_field :image %>
<% end %>
```

### Forms without a Model

```erb
<%= form_with url: search_path, method: :get do |form| %>
  <%= form.text_field :query, placeholder: "Search..." %>
  <%= form.submit "Search" %>
<% end %>
```

### Nested Forms (Complex Forms)

```ruby
# Model
class Person < ApplicationRecord
  has_many :addresses
  accepts_nested_attributes_for :addresses,
    allow_destroy: true,
    reject_if: :all_blank
end
```

```erb
<%= form_with model: @person do |form| %>
  <%= form.text_field :name %>

  <%= form.fields_for :addresses do |address_form| %>
    <%= address_form.text_field :street %>
    <%= address_form.text_field :city %>
    <%= address_form.check_box :_destroy if address_form.object.persisted? %>
  <% end %>

  <%= form.submit %>
<% end %>
```

```ruby
# Controller — strong params
def person_params
  params.require(:person).permit(
    :name,
    addresses_attributes: [:id, :street, :city, :_destroy]
  )
end
```

### Custom Form Builders

```ruby
class FormattedFormBuilder < ActionView::Helpers::FormBuilder
  def text_field(attribute, options = {})
    label(attribute) + super(attribute, options.merge(class: "form-input"))
  end
end
```

```erb
<%= form_with model: @article, builder: FormattedFormBuilder do |form| %>
  <%= form.text_field :title %>
<% end %>
```

## View Helpers

### Asset Tags

```erb
<%= stylesheet_link_tag "application" %>
<%= javascript_importmap_tags %>
<%= image_tag "logo.png", alt: "Logo" %>
<%= favicon_link_tag "favicon.ico" %>
<%= preload_link_tag "fonts/inter.woff2" %>
```

### URL Helpers

```erb
<%= link_to "Show", article_path(@article) %>
<%= link_to "Articles", articles_path %>
<%= link_to "Delete", article_path(@article), data: { turbo_method: :delete, turbo_confirm: "Sure?" } %>
<%= button_to "Delete", article_path(@article), method: :delete %>
<%= link_to "External", "https://example.com" %>
<%= mail_to "info@example.com" %>
```

### Formatting Helpers

```erb
<%= number_to_currency(1234.56) %>           # $1,234.56
<%= number_to_percentage(75.5) %>            # 75.500%
<%= number_to_human(1_000_000) %>            # 1 Million
<%= number_with_delimiter(1234567) %>        # 1,234,567
<%= distance_of_time_in_words(from, to) %>   # about 2 hours
<%= time_ago_in_words(article.created_at) %> # 3 days ago
<%= truncate(article.body, length: 100) %>   # First 100 chars...
<%= pluralize(comments.size, "comment") %>   # 3 comments
<%= highlight(article.body, "Rails") %>      # highlights "Rails"
<%= simple_format(article.body) %>           # wraps in <p> tags
<%= sanitize(user_input) %>                  # removes dangerous HTML
<%= strip_tags(html_content) %>              # removes all HTML tags
```

### CSRF Meta Tags

```erb
<%= csrf_meta_tags %>   # for non-form AJAX requests
<%= csp_meta_tag %>     # Content Security Policy nonce
```

### Content Tag Helper

```erb
<%= content_tag :div, class: "card" do %>
  <h2>Title</h2>
  <p>Content</p>
<% end %>
```

### Tag Builder

```erb
<%= tag.div class: "container" do %>
  <%= tag.span "Hello", class: "greeting" %>
<% end %>
```

### Localized Views

Rails supports locale-specific templates:
- `app/views/articles/index.en.html.erb`
- `app/views/articles/index.fr.html.erb`

Rails picks the template based on `I18n.locale`.

### Turbo Frames and Streams

```erb
<%# Turbo Frame %>
<%= turbo_frame_tag "article_#{@article.id}" do %>
  <%= render @article %>
<% end %>

<%# Turbo Stream (broadcast from server) %>
<%= turbo_stream.append "messages", @message %>
<%= turbo_stream.replace "message_#{@message.id}", @message %>
<%= turbo_stream.remove "message_#{@old_message.id}" %>
```
