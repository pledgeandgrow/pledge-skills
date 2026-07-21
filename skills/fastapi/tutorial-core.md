# FastAPI — Tutorial: Validations, Body, Forms, Files, Errors

## Query Parameters and String Validations

```python
from typing import Annotated
from fastapi import FastAPI, Query

@app.get("/items/")
async def read_items(q: Annotated[str | None, Query(min_length=3, max_length=50)] = None):
    return {"q": q}
```

### Additional validations

- `min_length`, `max_length`, `pattern` (regex) for strings
- `ge`, `gt`, `le`, `lt` for numbers (greater/less than or equal)
- `alias` to use a different parameter name in the API vs Python

### Query parameter lists

```python
@app.get("/items/")
async def read_items(q: Annotated[list[str] | None, Query()] = None):
    return {"q": q}
```

**Source**: [query-params-str-validations](https://fastapi.tiangolo.com/tutorial/query-params-str-validations/)

---

## Path Parameters and Numeric Validations

```python
from typing import Annotated
from fastapi import Path

@app.get("/items/{item_id}")
async def read_items(item_id: Annotated[int, Path(gt=0, le=1000)]):
    return {"item_id": item_id}
```

- Same numeric validations: `ge`, `gt`, `le`, `lt`
- Path parameters are always required (can't have defaults)

**Source**: [path-params-numeric-validations](https://fastapi.tiangolo.com/tutorial/path-params-numeric-validations/)

---

## Query Parameter Models

Use Pydantic models for query parameters:

```python
from pydantic import BaseModel, Field
from typing import Annotated
from fastapi import Query

class FilterParams(BaseModel):
    limit: int = Field(default=100, gt=0, le=1000)
    offset: int = Field(default=0, ge=0)
    q: str | None = None

@app.get("/items/")
async def read_items(filter: Annotated[FilterParams, Query()]):
    return filter
```

**Source**: [query-param-models](https://fastapi.tiangolo.com/tutorial/query-param-models/)

---

## Body — Multiple Parameters

```python
from pydantic import BaseModel
from typing import Annotated
from fastapi import Body

class Item(BaseModel):
    name: str
    price: float

class User(BaseModel):
    username: str
    full_name: str | None = None

@app.put("/items/{item_id}")
async def update_item(
    item_id: int,
    item: Item,
    user: User,
    importance: Annotated[int, Body(gt=0)]
):
    return {"item_id": item_id, "item": item, "user": user, "importance": importance}
```

### Embed a single body parameter

```python
@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Annotated[Item, Body(embed=True)]):
    ...
```

**Source**: [body-multiple-params](https://fastapi.tiangolo.com/tutorial/body-multiple-params/)

---

## Body — Fields

Use `Field` for validation inside Pydantic models:

```python
from pydantic import BaseModel, Field

class Item(BaseModel):
    name: str
    price: float = Field(gt=0, description="The price must be greater than zero")
    tax: float | None = Field(default=None, ge=0)
```

**Source**: [body-fields](https://fastapi.tiangolo.com/tutorial/body-fields/)

---

## Body — Nested Models

```python
class Image(BaseModel):
    url: str
    name: str

class Item(BaseModel):
    name: str
    images: list[Image] | None = None

@app.post("/items/")
async def create_item(item: Item):
    return item
```

Supports arbitrarily deep nesting, lists of models, dicts with model values, sets, tuples.

**Source**: [body-nested-models](https://fastapi.tiangolo.com/tutorial/body-nested-models/)

---

## Declare Request Example Data

```python
from pydantic import BaseModel, Field
from typing import Annotated
from fastapi import Body

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float

@app.put("/items/{item_id}")
async def update_item(
    item_id: int,
    item: Annotated[
        Item,
        Body(
            openapi_examples={
                "normal": {"summary": "Normal example", "value": {"name": "Foo", "price": 35.4}},
                "invalid": {"summary": "Invalid example", "value": {"name": "Foo", "price": "not a number"}},
            },
        ),
    ],
):
    ...
```

**Source**: [schema-extra-example](https://fastapi.tiangolo.com/tutorial/schema-extra-example/)

---

## Extra Data Types

```python
from datetime import datetime, time, timedelta
from uuid import UUID

@app.put("/items/{item_id}")
async def read_items(
    item_id: UUID,
    start_datetime: datetime | None = None,
    end_datetime: datetime | None = None,
    repeat_at: time | None = None,
    process_after: timedelta | None = None,
):
    ...
```

Supported types: `UUID`, `datetime`, `date`, `time`, `timedelta`, `Decimal`, `bytes`, `HttpUrl`, etc.

**Source**: [extra-data-types](https://fastapi.tiangolo.com/tutorial/extra-data-types/)

---

## Cookie Parameters

```python
from typing import Annotated
from fastapi import Cookie

@app.get("/items/")
async def read_items(ads_id: Annotated[str | None, Cookie()] = None):
    return {"ads_id": ads_id}
```

**Source**: [cookie-params](https://fastapi.tiangolo.com/tutorial/cookie-params/)

---

## Header Parameters

```python
from typing import Annotated
from fastapi import Header

@app.get("/items/")
async def read_items(user_agent: Annotated[str | None, Header()] = None):
    return {"User-Agent": user_agent}
```

- Automatic conversion: `user_agent` param maps to `User-Agent` header
- Use `convert_underscores=False` to disable automatic conversion

**Source**: [header-params](https://fastapi.tiangolo.com/tutorial/header-params/)

---

## Cookie Parameter Models & Header Parameter Models

Use Pydantic models for structured cookie/header parameters:

```python
class CookieParams(BaseModel):
    session_id: str
    ads_id: str | None = None

@app.get("/items/")
async def read_items(cookies: Annotated[CookieParams, Cookie()]):
    return cookies
```

**Source**: [cookie-param-models](https://fastapi.tiangolo.com/tutorial/cookie-param-models/), [header-param-models](https://fastapi.tiangolo.com/tutorial/header-param-models/)

---

## Response Model — Return Type

```python
class Item(BaseModel):
    name: str
    price: float
    tax: float | None = None

@app.post("/items/", response_model=Item)
async def create_item(item: Item) -> Item:
    return item
```

- `response_model` filters output data (e.g. removes passwords)
- Can use `response_model_exclude_unset`, `response_model_exclude_defaults`, `response_model_exclude_none`

**Source**: [response-model](https://fastapi.tiangolo.com/tutorial/response-model/)

---

## Extra Models

```python
class UserBase(BaseModel):
    username: str
    email: str
    full_name: str | None = None

class UserIn(UserBase):
    password: str

class UserOut(UserBase):
    pass

@app.post("/user/", response_model=UserOut)
async def create_user(user: UserIn) -> UserOut:
    return user
```

**Source**: [extra-models](https://fastapi.tiangolo.com/tutorial/extra-models/)

---

## Response Status Code

```python
@app.post("/items/", status_code=201)
async def create_item(item: Item):
    return item
```

Use `status` module for named codes:

```python
from fastapi import status

@app.post("/items/", status_code=status.HTTP_201_CREATED)
```

**Source**: [response-status-code](https://fastapi.tiangolo.com/tutorial/response-status-code/)

---

## Form Data

```python
from typing import Annotated
from fastapi import Form

@app.post("/login/")
async def login(username: Annotated[str, Form()], password: Annotated[str, Form()]):
    return {"username": username}
```

Install `python-multipart`: `pip install python-multipart`

**Source**: [request-forms](https://fastapi.tiangolo.com/tutorial/request-forms/)

---

## Form Models

```python
class FormData(BaseModel):
    username: str
    password: str
    model_config = {"extra": "forbid"}

@app.post("/login/")
async def login(data: Annotated[FormData, Form()]):
    return data
```

**Source**: [request-form-models](https://fastapi.tiangolo.com/tutorial/request-form-models/)

---

## Request Files

```python
from typing import Annotated
from fastapi import UploadFile

@app.post("/files/")
async def create_file(file: Annotated[bytes, File()]):
    return {"file_size": len(file)}

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    return {"filename": file.filename}
```

- `File()` for `bytes` (entire file in memory)
- `UploadFile` for large files (spooled to disk)
- `UploadFile` attributes: `filename`, `content_type`, `file` (SpooledTemporaryFile)
- Methods: `write()`, `read()`, `seek()`, `close()`

**Source**: [request-files](https://fastapi.tiangolo.com/tutorial/request-files/)

---

## Request Forms and Files

```python
@app.post("/items/")
async def create_item(
    file: Annotated[bytes, File()],
    token: Annotated[str, Form()],
):
    return {"file_size": len(file), "token": token}
```

**Source**: [request-forms-and-files](https://fastapi.tiangolo.com/tutorial/request-forms-and-files/)

---

## Handling Errors

### HTTPException

```python
from fastapi import HTTPException

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"item": items[item_id]}
```

### Custom exception handlers

```python
from fastapi import Request
from fastapi.responses import JSONResponse

class UnicornException(Exception):
    def __init__(self, name: str):
        self.name = name

@app.exception_handler(UnicornException)
async def unicorn_exception_handler(request: Request, exc: UnicornException):
    return JSONResponse(
        status_code=418,
        content={"message": f"Oops, {exc.name} did it again."},
    )
```

### Override default exception handlers

```python
from fastapi.exceptions import RequestValidationError
from fastapi.encoders import jsonable_encoder

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(status_code=400, content=jsonable_encoder({"detail": exc.errors()}))
```

**Source**: [handling-errors](https://fastapi.tiangolo.com/tutorial/handling-errors/)

---

## Path Operation Configuration

```python
@app.post(
    "/items/",
    response_model=Item,
    status_code=status.HTTP_201_CREATED,
    tags=["items"],
    summary="Create an item",
    description="Create an item with all the information",
    response_description="The created item",
    deprecated=False,
)
async def create_item(item: Item):
    ...
```

- `tags`: group operations in docs
- `deprecated=True`: mark as deprecated
- `responses`: custom responses with status codes
- `openapi_extra`: extra OpenAPI schema data

**Source**: [path-operation-configuration](https://fastapi.tiangolo.com/tutorial/path-operation-configuration/)

---

## JSON Compatible Encoder

```python
from fastapi.encoders import jsonable_encoder

fake_db = {}

@app.put("/items/{item_id}")
def update_item(item_id: str, item: Item):
    json_compatible_item_data = jsonable_encoder(item)
    fake_db[item_id] = json_compatible_item_data
```

`jsonable_encoder` converts Pydantic models, datetimes, UUIDs, etc. to JSON-compatible dicts.

**Source**: [encoder](https://fastapi.tiangolo.com/tutorial/encoder/)

---

## Body — Updates

### PUT (full update) vs PATCH (partial update)

```python
# PUT — replace entire resource
@app.put("/items/{item_id}")
async def update_item(item_id: str, item: Item):
    stored_item_data = items[item_id]
    stored_item_model = Item(**stored_item_data)
    update_data = item.model_dump(exclude_unset=True)
    updated_item = stored_item_model.model_copy(update=update_data)
    items[item_id] = jsonable_encoder(updated_item)
    return updated_item

# PATCH — partial update with exclude_unset
@app.patch("/items/{item_id}")
async def update_item(item_id: str, item: Item):
    stored_item_data = items[item_id]
    update_data = item.model_dump(exclude_unset=True)
    stored_item_data.update(update_data)
    items[item_id] = stored_item_data
    return stored_item_data
```

**Source**: [body-updates](https://fastapi.tiangolo.com/tutorial/body-updates/)
