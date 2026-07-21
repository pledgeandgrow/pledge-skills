# FastAPI — Advanced User Guide

## Stream Data

```python
from fastapi.responses import StreamingResponse

@app.get("/stream")
async def stream_data():
    async def generate():
        for i in range(100):
            yield f"Line {i}\n"
            await asyncio.sleep(0.1)
    return StreamingResponse(generate(), media_type="text/plain")
```

**Source**: [stream-data](https://fastapi.tiangolo.com/advanced/stream-data/)

---

## Path Operation Advanced Configuration

### OpenAPI operationId

```python
@app.get("/items/", operation_id="read_items")
async def read_items():
    ...
```

### OpenAPI extras

```python
@app.get("/items/", openapi_extra={
    "x-custom-field": "custom value",
})
```

### Custom JSON schema extras on parameters

```python
@app.get("/items/")
async def read_items(q: Annotated[str | None, Query(openapi_extra={"example": "foo"})] = None):
    ...
```

**Source**: [path-operation-advanced-configuration](https://fastapi.tiangolo.com/advanced/path-operation-advanced-configuration/)

---

## Additional Status Codes

```python
@app.post("/items/", response_model=Item, status_code=status.HTTP_201_CREATED)
async def create_item(item: Item):
    ...
```

**Source**: [additional-status-codes](https://fastapi.tiangolo.com/advanced/additional-status-codes/)

---

## Return a Response Directly

```python
from fastapi import Response
from fastapi.responses import JSONResponse

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return JSONResponse(content={"item_id": item_id})

# Or with Response
@app.get("/legacy/")
async def legacy():
    return Response(content="Legacy response", media_type="text/plain")
```

**Source**: [response-directly](https://fastapi.tiangolo.com/advanced/response-directly/)

---

## Custom Response — HTML, Stream, File, others

### Available response classes

- `Response` — base response
- `HTMLResponse` — HTML content
- `PlainTextResponse` — plain text
- `JSONResponse` — JSON (default)
- `RedirectResponse` — HTTP redirect
- `StreamingResponse` — streaming content
- `FileResponse` — file from disk

```python
from fastapi.responses import HTMLResponse, FileResponse, StreamingResponse, RedirectResponse

@app.get("/html/", response_class=HTMLResponse)
async def read_html():
    return "<h1>Hello World</h1>"

@app.get("/file/")
async def read_file():
    return FileResponse("files/example.txt")

@app.get("/redirect/")
async def redirect():
    return RedirectResponse(url="/items/")
```

### Custom response class

```python
class CustomResponse(JSONResponse):
    def render(self, content: any) -> bytes:
        return json.dumps({"data": content}).encode("utf-8")

@app.get("/custom/", response_class=CustomResponse)
async def read_custom():
    return {"message": "Hello"}
```

### Default response class

```python
app = FastAPI(default_response_class=ORJSONResponse)
```

**Source**: [custom-response](https://fastapi.tiangolo.com/advanced/custom-response/)

---

## Additional Responses in OpenAPI

```python
@app.post("/items/", response_model=Item, responses={
    404: {"model": Message, "description": "Item not found"},
    409: {"model": Error, "description": "Conflict"},
})
async def create_item(item: Item):
    ...
```

**Source**: [additional-responses](https://fastapi.tiangolo.com/advanced/additional-responses/)

---

## Response Cookies

```python
@app.post("/cookie/")
async def create_cookie(response: Response):
    response.set_cookie(key="fakesession", value="fake-cookie-session-value")
    return {"message": "Cookie set"}
```

**Source**: [response-cookies](https://fastapi.tiangolo.com/advanced/response-cookies/)

---

## Response Headers

```python
@app.get("/headers/")
async def read_headers(response: Response):
    response.headers["X-Cat"] = "meow"
    return {"message": "Hello World"}
```

**Source**: [response-headers](https://fastapi.tiangolo.com/advanced/response-headers/)

---

## Response — Change Status Code

```python
from fastapi import Response

@app.get("/items/{item_id}", response_model=Item)
async def read_item(item_id: str, response: Response):
    if item_id not in items:
        response.status_code = 404
        return {"message": "Item not found"}
    response.status_code = 200
    return items[item_id]
```

**Source**: [response-change-status-code](https://fastapi.tiangolo.com/advanced/response-change-status-code/)

---

## Advanced Dependencies

### Dependencies with yield and context managers

```python
class DBSession:
    def __init__(self):
        self.db = SessionLocal()
    def __enter__(self):
        return self.db
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.db.close()

def get_db():
    with DBSession() as db:
        yield db
```

### Yield vs return dependencies

- `yield`: setup + teardown (resources cleaned up after response)
- `return`: no teardown
- `yield` dependencies can have `try/except` for error handling

**Source**: [advanced-dependencies](https://fastapi.tiangolo.com/advanced/advanced-dependencies/)

---

## Advanced Security

### OAuth2 Scopes

```python
from fastapi.security import OAuth2PasswordBearer, SecurityScopes

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="token",
    scopes={"me": "Read information about the current user", "items": "Read items"}
)

async def get_current_user(
    security_scopes: SecurityScopes,
    token: Annotated[str, Depends(oauth2_scheme)]
):
    # Decode token and check scopes
    ...

@app.get("/users/me")
async def read_users_me(current_user: Annotated[User, Security(get_current_user, scopes=["me"])]):
    return current_user
```

### HTTP Basic Auth

```python
from fastapi.security import HTTPBasic, HTTPBasicCredentials

security = HTTPBasic()

@app.get("/users/me")
async def read_current_user(credentials: Annotated[HTTPBasicCredentials, Depends(security)]):
    return {"username": credentials.username, "password": credentials.password}
```

**Source**: [oauth2-scopes](https://fastapi.tiangolo.com/advanced/security/oauth2-scopes/), [http-basic-auth](https://fastapi.tiangolo.com/advanced/security/http-basic-auth/)

---

## Using the Request Directly

```python
from fastapi import Request

@app.get("/items/")
async def read_items(request: Request):
    client_host = request.client.host
    return {"client_host": client_host}
```

- Access raw Starlette `Request` object for headers, client info, cookies, etc.
- Use sparingly — prefer typed parameters

**Source**: [using-request-directly](https://fastapi.tiangolo.com/advanced/using-request-directly/)

---

## Using Dataclasses

```python
from dataclasses import dataclass
from typing import Annotated
from fastapi import Body

@dataclass
class Item:
    name: str
    price: float

@app.post("/items/")
async def create_item(item: Item):
    return item
```

FastAPI supports dataclasses for request bodies and response models.

**Source**: [dataclasses](https://fastapi.tiangolo.com/advanced/dataclasses/)

---

## Advanced Middleware

```python
from fastapi.middleware.gzip import GZipMiddleware

app.add_middleware(GZipMiddleware, minimum_size=1000)
```

Available Starlette middleware:
- `GZipMiddleware` — gzip compression
- `HTTPSRedirectMiddleware` — redirect HTTP to HTTPS
- `TrustedHostMiddleware` — restrict host headers
- `SessionMiddleware` — cookie-based sessions

**Source**: [middleware](https://fastapi.tiangolo.com/advanced/middleware/)

---

## Sub Applications — Mounts

```python
sub_app = FastAPI()

@sub_app.get("/")
async def sub_read():
    return {"msg": "Sub app"}

app.mount("/subapi", sub_app)
```

**Source**: [sub-applications](https://fastapi.tiangolo.com/advanced/sub-applications/)

---

## Behind a Proxy

```python
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

app = FastAPI(root_path="/api/v1")
```

- `root_path`: handles reverse proxy path prefixes
- Used when app is served behind a proxy with a path prefix
- OpenAPI and docs URLs respect `root_path`

**Source**: [behind-a-proxy](https://fastapi.tiangolo.com/advanced/behind-a-proxy/)

---

## Templates

```python
from fastapi.templating import Jinja2Templates
from fastapi import Request

templates = Jinja2Templates(directory="templates")

@app.get("/items/{id}")
async def read_item(request: Request, id: str):
    return templates.TemplateResponse("item.html", {"request": request, "id": id})
```

Install: `pip install jinja2`

**Source**: [templates](https://fastapi.tiangolo.com/advanced/templates/)

---

## WebSockets

```python
from fastapi import WebSocket, WebSocketDisconnect

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message: {data}")
    except WebSocketDisconnect:
        print("Client disconnected")
```

- Can use `Depends` and other dependencies in WebSocket endpoints
- Handle multiple clients with connection management
- Install: `pip install websockets`

**Source**: [websockets](https://fastapi.tiangolo.com/advanced/websockets/)

---

## Lifespan Events

```python
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: load ML model, init DB, etc.
    model = load_model()
    app.state.model = model
    yield
    # Shutdown: cleanup resources
    del model

app = FastAPI(lifespan=lifespan)
```

- Replaces deprecated `on_startup` / `on_shutdown` events
- Supports async context manager for setup/teardown
- Resources initialized before serving, cleaned up after

**Source**: [events](https://fastapi.tiangolo.com/advanced/events/)

---

## Testing WebSockets

```python
from fastapi.testclient import TestClient

def test_websocket():
    client = TestClient(app)
    with client.websocket_connect("/ws") as websocket:
        websocket.send_text("Hello")
        data = websocket.receive_text()
        assert data == "Message: Hello"
```

**Source**: [testing-websockets](https://fastapi.tiangolo.com/advanced/testing-websockets/)

---

## Testing Events: lifespan and startup/shutdown

```python
def test_lifespan():
    with TestClient(app) as client:
        # lifespan startup has run
        response = client.get("/")
        assert response.status_code == 200
    # lifespan shutdown has run after the with block
```

**Source**: [testing-events](https://fastapi.tiangolo.com/advanced/testing-events/)

---

## Testing Dependencies with Overrides

```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def override_get_db():
    try:
        yield TestSession()
    finally:
        pass

app.dependency_overrides[get_db] = override_get_db
```

**Source**: [testing-dependencies](https://fastapi.tiangolo.com/advanced/testing-dependencies/)

---

## Async Tests

```python
import pytest
from httpx import AsyncClient, ASGITransport

@pytest.mark.asyncio
async def test_async_read_main():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
```

**Source**: [async-tests](https://fastapi.tiangolo.com/advanced/async-tests/)

---

## Settings and Environment Variables

```python
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    app_name: str = "Awesome API"
    admin_email: str
    items_per_user: int = 50

settings = Settings()

@app.get("/info")
async def info():
    return {"app_name": settings.app_name, "admin_email": settings.admin_email}
```

### Settings as dependency

```python
def get_settings():
    return Settings()

@app.get("/info")
async def info(settings: Annotated[Settings, Depends(get_settings)]):
    return settings
```

**Source**: [settings](https://fastapi.tiangolo.com/advanced/settings/)

---

## OpenAPI Callbacks

```python
@app.post("/items/", callbacks=callback_router.routes)
async def create_item(item: Item):
    ...
```

Callbacks describe webhook calls your API makes to the client after an operation.

**Source**: [openapi-callbacks](https://fastapi.tiangolo.com/advanced/openapi-callbacks/)

---

## OpenAPI Webhooks

```python
def webhook_receiver():
    ...

app.webhooks.add_api_route("/webhook", webhook_receiver, method="POST")
```

Webhooks describe endpoints that your API will call on the client.

**Source**: [openapi-webhooks](https://fastapi.tiangolo.com/advanced/openapi-webhooks/)

---

## Including WSGI — Flask, Django, others

```python
from fastapi import FastAPI
from fastapi.middleware.wsgi import WSGIMiddleware
from flask import Flask as FlaskApp

flask_app = FlaskApp(__name__)

@flask_app.route("/")
def flask_main():
    return "Hello from Flask"

app = FastAPI()
app.mount("/flask", WSGIMiddleware(flask_app))
```

**Source**: [wsgi](https://fastapi.tiangolo.com/advanced/wsgi/)

---

## Generating SDKs

FastAPI's OpenAPI schema can be used to generate client SDKs:
- `openapi-generator` CLI
- Various language-specific generators
- Swagger Codegen

**Source**: [generate-clients](https://fastapi.tiangolo.com/advanced/generate-clients/)

---

## Advanced Python Types

```python
from typing import Annotated, Union
from pydantic import BaseModel

# Union types
class Item(BaseModel):
    name: str
    value: Union[int, str]  # accepts int or str

# Generic models
from typing import Generic, TypeVar
T = TypeVar("T")

class Response(BaseModel, Generic[T]):
    data: T
    count: int
```

**Source**: [advanced-python-types](https://fastapi.tiangolo.com/advanced/advanced-python-types/)

---

## JSON with Bytes as Base64

```python
@app.post("/files/")
async def create_file(file: bytes = File(...)):
    # bytes are automatically encoded/decoded as base64 in JSON
    return {"size": len(file)}
```

**Source**: [json-base64-bytes](https://fastapi.tiangolo.com/advanced/json-base64-bytes/)

---

## Strict Content-Type Checking

```python
app = FastAPI(strict_content_type=True)  # default in newer versions
```

Enforces that requests have the correct `Content-Type` header matching the expected media type.

**Source**: [strict-content-type](https://fastapi.tiangolo.com/advanced/strict-content-type/)

---

## FastAPI CLI

```bash
fastapi dev main.py          # development with reload
fastapi run main.py          # production
fastapi run main.py --port 80
fastapi run main.py --workers 4
```

Configure entrypoint in `pyproject.toml`:
```toml
[tool.fastapi]
entrypoint = "main:app"
```

**Source**: [fastapi-cli](https://fastapi.tiangolo.com/fastapi-cli/)

---

## Editor Support

FastAPI provides editor support through type hints:
- VS Code with Pylance
- PyCharm with Pydantic plugin
- Neovim with pyright
- Sublime Text with LSP

**Source**: [editor-support](https://fastapi.tiangolo.com/editor-support/)
