# FastAPI — Getting Started

## Python Types Intro

FastAPI uses Python type hints extensively. Type hints allow FastAPI to:
- Define requirements (path params, query params, headers, bodies, dependencies)
- Convert data from request to required type
- Validate data, generating automatic errors when invalid
- Document API using OpenAPI (used by interactive docs UIs)

### Simple Types

```python
def get_item(item_id: int, name: str | None = None) -> dict:
    ...
```

### Generic Types (typing module)

```python
from typing import list, dict, tuple, set

def process(items: list[str], mapping: dict[str, int]) -> tuple[str, int]:
    ...
```

### Classes as Types

```python
class Person:
    def __init__(self, name: str):
        self.name = name

def get_person(p: Person) -> str:
    return p.name
```

### Pydantic Models

```python
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
```

### Type Hints with Metadata Annotations (Annotated)

```python
from typing import Annotated

def read_items(q: Annotated[str | None, "Query parameter"] = None):
    ...
```

**Source**: [python-types](https://fastapi.tiangolo.com/python-types/)

---

## Concurrency and async / await

### Asynchronous Code

Async code tells the program it can "pause" and go do something else while waiting for a result. This is concurrency — not parallelism.

### async and await

```python
async def get_burgers(number: int):
    # Do some asynchronous stuff
    return burgers

# To call it, you must await:
burgers = await get_burgers(2)
```

- `async def` declares an async function (coroutine)
- `await` can only be used inside `async def` functions
- Calling an `async def` function without `await` returns a coroutine object, not the result

### When to use async vs def

- Use `async def` + `await` when calling async libraries (async DB drivers, HTTP clients like `httpx`)
- Use plain `def` for blocking operations (sync DB drivers, CPU-bound work)
- FastAPI handles both correctly — `def` path operations run in a threadpool

### Path operation functions

```python
@app.get('/')
async def root():
    return {"message": "Hello World"}

@app.get('/items/{id}')
def read_item(id: int):  # sync function, runs in threadpool
    return {"id": id}
```

**Source**: [async](https://fastapi.tiangolo.com/async/)

---

## Environment Variables

FastAPI recommends using `pydantic-settings` for environment variable management:

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Awesome API"
    admin_email: str
    items_per_user: int = 50

    model_config = {"env_file": ".env"}

settings = Settings()
```

**Source**: [environment-variables](https://fastapi.tiangolo.com/environment-variables/)

---

## Virtual Environments

Create and activate a virtual environment:

```bash
# Linux/macOS
python -m venv .venv
source .venv/bin/activate

# Windows
python -m venv .venv
.venv\Scripts\activate
```

Install FastAPI:

```bash
pip install fastapi[standard]
```

**Source**: [virtual-environments](https://fastapi.tiangolo.com/virtual-environments/)

---

## First Steps

### Step 1: Import FastAPI

```python
from fastapi import FastAPI

app = FastAPI()
```

`FastAPI` is a class that inherits directly from Starlette. All Starlette functionality is available.

### Step 2: Create a path operation decorator

```python
@app.get("/")
async def root():
    return {"message": "Hello World"}
```

- **Path**: the URL part after the domain (e.g. `/items/foo`)
- **Operation**: HTTP method — `@app.get()`, `@app.post()`, `@app.put()`, `@app.delete()`, `@app.patch()`, `@app.options()`, `@app.head()`, `@app.trace()`

### Step 3: Run the dev server

```bash
fastapi dev main.py
```

### OpenAPI

FastAPI generates an OpenAPI schema automatically at `/openapi.json`. Interactive docs at `/docs` (Swagger UI) and `/redoc` (ReDoc).

### Configure entrypoint in pyproject.toml

```toml
[tool.fastapi]
entrypoint = "main:app"
```

**Source**: [first-steps](https://fastapi.tiangolo.com/tutorial/first-steps/)

---

## Path Parameters

### Path parameters with types

```python
@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}
```

- Automatic data conversion: `item_id` is received as Python `int`
- Automatic data validation: non-integer values return a clear HTTP 422 error
- Validation powered by Pydantic

### Predefined values with Enum

```python
from enum import Enum

class ModelName(str, Enum):
    alexnet = "alexnet"
    resnet = "resnet"
    lenet = "lenet"

@app.get("/models/{model_name}")
async def get_model(model_name: ModelName):
    return {"model": model_name}
```

### Path parameters containing paths

```python
@app.get("/files/{file_path:path}")
async def read_file(file_path: str):
    return {"file_path": file_path}
```

**Source**: [path-params](https://fastapi.tiangolo.com/tutorial/path-params/)

---

## Query Parameters

```python
@app.get("/items/")
async def read_item(skip: int = 0, limit: int = 10, q: str | None = None):
    return {"skip": skip, "limit": limit, "q": q}
```

- Parameters not in the path are automatically interpreted as query parameters
- Default values make parameters optional
- `None` default makes a parameter truly optional
- Required query parameters: declare without a default value

### Multiple path and query parameters

```python
@app.get("/users/{user_id}/items/{item_id}")
async def read_user_item(user_id: int, item_id: str, q: str | None = None, short: bool = False):
    ...
```

**Source**: [query-params](https://fastapi.tiangolo.com/tutorial/query-params/)

---

## Request Body

### Import BaseModel and create a data model

```python
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None
```

### Declare it as a parameter

```python
@app.post("/items/")
async def create_item(item: Item):
    return item
```

FastAPI will:
- Read the body as JSON
- Convert types (if needed)
- Validate the data
- Return clear errors if invalid
- Generate JSON Schema definitions for the model
- Show schemas in interactive docs

### Request body + path + query parameters

```python
@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item, q: str | None = None):
    result = {"item_id": item_id, **item.model_dump()}
    if q:
        result["q"] = q
    return result
```

### Without Pydantic (using Annotated)

```python
from typing import Annotated
from fastapi import Body

@app.post("/items/")
async def create_item(item: Annotated[dict, Body()]):
    return item
```

**Source**: [body](https://fastapi.tiangolo.com/tutorial/body/)
