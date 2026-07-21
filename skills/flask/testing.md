# Testing Flask Applications

## Identifying Tests

- Tests go in the `tests` folder
- Test functions start with `test_`
- Test modules start with `test_`
- Test classes start with `Test`

Test the code you write, not library code. Extract complex behaviors into separate functions for individual testing.

## Fixtures

Use pytest fixtures for reusable test setup. Place in `tests/conftest.py`:

```python
import pytest
from my_project import create_app

@pytest.fixture()
def app():
    app = create_app()
    app.config.update({
        "TESTING": True,
    })
    # other setup can go here
    yield app
    # clean up / reset resources here

@pytest.fixture()
def client(app):
    return app.test_client()

@pytest.fixture()
def runner(app):
    return app.test_cli_runner()
```

If not using an application factory, import and configure the app directly. Use the `app` fixture for setup/teardown of resources like databases.

## Sending Requests with the Test Client

The test client makes requests without running a live server. It extends Werkzeug's client.

```python
def test_request_example(client):
    response = client.get("/posts")
    assert b"<h2>Hello, World!</h2>" in response.data
```

Common methods: `client.get()`, `client.post()`. Key arguments: `path`, `query_string`, `headers`, `data`, `json`.

Response properties:
- `response.data` — bytes returned by the view
- `response.text` — string (Werkzeug 2.1+)
- `response.get_data(as_text=True)` — string

### Query Strings and Headers

```python
response = client.get("/posts", query_string={"page": "2"})
response = client.get("/posts", headers={"X-Custom": "value"})
```

### Form Data

Pass a dict to `data` — Content-Type is set automatically:

```python
response = client.post("/login", data={
    "username": "flask",
    "password": "secret",
})
```

File uploads — open in `"rb"` mode:

```python
from pathlib import Path

resources = Path(__file__).parent / "resources"

response = client.post("/user/2/edit", data={
    "name": "Flask",
    "theme": "dark",
    "picture": (resources / "picture.png").open("rb"),
})
```

Use `(file, filename, content_type)` tuple to customize file metadata. File objects are closed automatically after the request.

### JSON Data

Pass an object to `json` — Content-Type is set to `application/json`:

```python
def test_json_data(client):
    response = client.post("/graphql", json={
        "query": """query User($id: String!) { user(id: $id) { name } }""",
        "variables": {"id": 2},
    })
    assert response.json["data"]["user"]["name"] == "Flask"
```

`response.json` contains the deserialized JSON response.

## Following Redirects

```python
def test_logout_redirect(client):
    response = client.get("/logout", follow_redirects=True)
    assert len(response.history) == 1
    assert response.request.path == "/index"
```

`response.history` is a tuple of redirect responses. Each has a `request` attribute.

## Accessing and Modifying the Session

Use the client in a `with` block to keep context active after request:

```python
from flask import session

def test_access_session(client):
    with client:
        client.post("/auth/login", data={"username": "flask"})
        assert session["user_id"] == 1
    # session is no longer accessible
```

Set session values before making a request:

```python
def test_modify_session(client):
    with client.session_transaction() as session:
        session["user_id"] = 1
    # session is saved now

    response = client.get("/users/me")
    assert response.json["username"] == "flask"
```

## Running Commands with the CLI Runner

```python
import click

@app.cli.command("hello")
@click.option("--name", default="World")
def hello_command(name):
    click.echo(f"Hello, {name}!")

def test_hello_command(runner):
    result = runner.invoke(args="hello")
    assert "World" in result.output

    result = runner.invoke(args=["hello", "--name", "Flask"])
    assert "Flask" in result.output
```

The runner extends Click's runner. Use `invoke()` with `args` as a string or list.

## Tests that Depend on an Active Context

### Application Context

For functions that access `current_app` (e.g., database queries):

```python
def test_db_post_model(app):
    with app.app_context():
        post = db.session.query(Post).get(1)
```

### Request Context

For functions that access `request`:

```python
def test_validate_user_edit(app):
    with app.test_request_context(
        "/user/2/edit", method="POST", data={"name": ""}
    ):
        messages = validate_edit_user()
        assert messages["name"][0] == "Name cannot be empty."
```

`test_request_context()` doesn't run Flask dispatching — `before_request` functions are not called. Call them manually if needed:

```python
def test_auth_token(app):
    with app.test_request_context("/user/2/edit", headers={"X-Auth-Token": "1"}):
        app.preprocess_request()
        assert g.user.name == "Flask"
```
