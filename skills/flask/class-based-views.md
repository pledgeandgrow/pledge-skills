# Flask Class-based Views

Class-based views enable reusable, object-oriented view patterns in Flask.

## Basic Reusable View

Convert a view function to a `View` subclass:

```python
from flask.views import View

class UserList(View):
    def dispatch_request(self):
        users = User.query.all()
        return render_template("users.html", objects=users)

app.add_url_rule("/users/", view_func=UserList.as_view("user_list"))
```

- `View.dispatch_request()` is the equivalent of the view function
- `View.as_view()` creates a view function — the first argument is the endpoint name for `url_for()`
- Register with `app.add_url_rule()` — you **cannot** use `@app.route()` on a class

### Parameterized Views

Pass arguments to `as_view()` — they're forwarded to `__init__`:

```python
class ListView(View):
    def __init__(self, model, template):
        self.model = model
        self.template = template

    def dispatch_request(self):
        items = self.model.query.all()
        return render_template(self.template, items=items)

app.add_url_rule(
    "/users/", view_func=ListView.as_view("user_list", User, "users.html"),
)
app.add_url_rule(
    "/stories/", view_func=ListView.as_view("story_list", Story, "stories.html"),
)
```

## URL Variables

URL variables are passed as keyword arguments to `dispatch_request`:

```python
class DetailView(View):
    def __init__(self, model):
        self.model = model
        self.template = f"{model.__name__.lower()}/detail.html"

    def dispatch_request(self, id):
        item = self.model.query.get_or_404(id)
        return render_template(self.template, item=item)

app.add_url_rule(
    "/users/<int:id>", view_func=DetailView.as_view("user_detail", User)
)
```

## View Lifetime and self

By default, a **new instance** is created for every request. Writing to `self` during a request is safe — the next request gets a fresh instance.

For expensive initialization, set `init_every_request = False`:

```python
class ListView(View):
    init_every_request = False

    def __init__(self, model, template):
        self.model = model
        self.template = template

    def dispatch_request(self):
        items = self.model.query.all()
        return render_template(self.template, items=items)
```

Different instances are still created for each `as_view()` call, but not for each request. **Do not write to `self`** when `init_every_request = False` — use `g` instead.

## View Decorators

Decorators must be applied to the view function returned by `as_view()`, not the class. Set `View.decorators`:

```python
class UserList(View):
    decorators = [cache(minutes=2), login_required]

app.add_url_rule('/users/', view_func=UserList.as_view())
```

Order matters — equivalent to:
```python
@app.route("/users/")
@login_required
@cache(minutes=2)
def user_list():
    ...
```

## Method Hints

Set `View.methods` to specify allowed HTTP methods (equivalent to `methods=` in `route()` or `add_url_rule()`):

```python
class MyView(View):
    methods = ["GET", "POST"]

    def dispatch_request(self):
        if request.method == "POST":
            ...
        ...

app.add_url_rule('/my-view', view_func=MyView.as_view('my-view'))
```

## Method Dispatching and APIs

`MethodView` dispatches to different methods based on the HTTP method — each method maps to a class method with the same (lowercase) name:

```python
from flask.views import MethodView

class ItemAPI(MethodView):
    init_every_request = False

    def __init__(self, model):
        self.model = model

    def _get_item(self, id):
        return self.model.query.get_or_404(id)

    def get(self, id):
        item = self._get_item(id)
        return jsonify(item.to_json())

    def patch(self, id):
        item = self._get_item(id)
        item.update_from_json(request.json)
        db.session.commit()
        return jsonify(item.to_json())

    def delete(self, id):
        item = self._get_item(id)
        db.session.delete(item)
        db.session.commit()
        return "", 204

class GroupAPI(MethodView):
    init_every_request = False

    def __init__(self, model):
        self.model = model

    def get(self):
        items = self.model.query.all()
        return jsonify([item.to_json() for item in items])

    def post(self):
        db.session.add(self.model.from_json(request.json))
        db.session.commit()
        return jsonify(item.to_json())
```

`MethodView` automatically sets `View.methods` based on defined methods.

### REST API Registration Helper

```python
def register_api(app, model, name):
    item = ItemAPI.as_view(f"{name}-item", model)
    group = GroupAPI.as_view(f"{name}-group", model)
    app.add_url_rule(f"/{name}/<int:id>", view_func=item)
    app.add_url_rule(f"/{name}/", view_func=group)

register_api(app, User, "users")
register_api(app, Story, "stories")
```

This produces a standard REST API:

| URL | Method | Description |
|-----|--------|-------------|
| `/users/` | GET | List all users |
| `/users/` | POST | Create a new user |
| `/users/<id>` | GET | Show a single user |
| `/users/<id>` | PATCH | Update a user |
| `/users/<id>` | DELETE | Delete a user |
