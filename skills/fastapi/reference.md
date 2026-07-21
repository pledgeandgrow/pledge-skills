# FastAPI — API Reference

## FastAPI class

`fastapi.FastAPI` — the main application class.

```python
FastAPI(
    *,
    debug=False,
    routes=None,
    title="FastAPI",
    summary=None,
    description="",
    version="0.1.0",
    openapi_url="/openapi.json",
    openapi_tags=None,
    servers=None,
    dependencies=None,
    default_response_class=JSONResponse,
    redirect_slashes=True,
    docs_url="/docs",
    redoc_url="/redoc",
    swagger_ui_oauth2_redirect_url="/docs/oauth2-redirect",
    swagger_ui_init_oauth=None,
    middleware=None,
    exception_handlers=None,
    on_startup=None,
    on_shutdown=None,
    lifespan=None,
    terms_of_service=None,
    contact=None,
    license_info=None,
    openapi_prefix="",
    root_path="",
    root_path_in_servers=True,
    responses=None,
    callbacks=None,
    webhooks=None,
    deprecated=None,
    include_in_schema=True,
    swagger_ui_parameters=None,
    generate_unique_id_function=generate_unique_id,
    separate_input_output_schemas=True,
    openapi_external_docs=None,
    strict_content_type=True,
    **extra
)
```

### Instance attributes

- `openapi_version` — OpenAPI version string
- `webhooks` — Webhook routes
- `state` — Application state object
- `dependency_overrides` — Dict for overriding dependencies in tests

### Methods

- `get(path, ...)` — Register GET route
- `post(path, ...)` — Register POST route
- `put(path, ...)` — Register PUT route
- `delete(path, ...)` — Register DELETE route
- `patch(path, ...)` — Register PATCH route
- `options(path, ...)` — Register OPTIONS route
- `head(path, ...)` — Register HEAD route
- `trace(path, ...)` — Register TRACE route
- `websocket(path)` — Register WebSocket route
- `include_router(router, ...)` — Include an APIRouter
- `middleware(middleware_type)` — Add middleware decorator
- `exception_handler(exc_class)` — Register exception handler
- `on_event(event_type)` — Register startup/shutdown event (deprecated, use lifespan)
- `openapi()` — Get or generate OpenAPI schema
- `frontend(...)` — Serve frontend

**Source**: [fastapi](https://fastapi.tiangolo.com/reference/fastapi/)

---

## Request Parameters

### Path

```python
from fastapi import Path

Path(
    default=...,
    *,
    alias=None,
    title=None,
    description=None,
    ge=None,
    gt=None,
    le=None,
    lt=None,
    pattern=None,
    min_length=None,
    max_length=None,
    ...
)
```

### Query

```python
from fastapi import Query

Query(
    default=...,
    *,
    alias=None,
    title=None,
    description=None,
    min_length=None,
    max_length=None,
    pattern=None,
    ge=None,
    gt=None,
    le=None,
    lt=None,
    ...
)
```

### Header

```python
from fastapi import Header

Header(default=..., *, alias=None, convert_underscores=True, ...)
```

### Cookie

```python
from fastapi import Cookie

Cookie(default=..., *, alias=None, ...)
```

### Body

```python
from fastapi import Body

Body(default=..., *, embed=False, media_type="application/json", alias=None, ...)
```

### Form

```python
from fastapi import Form

Form(default=..., *, alias=None, media_type="application/x-www-form-urlencoded", ...)
```

### File

```python
from fastapi import File

File(default=..., *, alias=None, media_type="multipart/form-data", ...)
```

**Source**: [parameters](https://fastapi.tiangolo.com/reference/parameters/)

---

## Status Codes

```python
from fastapi import status

status.HTTP_200_OK
status.HTTP_201_CREATED
status.HTTP_204_NO_CONTENT
status.HTTP_400_BAD_REQUEST
status.HTTP_401_UNAUTHORIZED
status.HTTP_403_FORBIDDEN
status.HTTP_404_NOT_FOUND
status.HTTP_409_CONFLICT
status.HTTP_422_UNPROCESSABLE_ENTITY
status.HTTP_500_INTERNAL_SERVER_ERROR
```

**Source**: [status](https://fastapi.tiangolo.com/reference/status/)

---

## UploadFile class

```python
from fastapi import UploadFile

upload_file = UploadFile(
    filename="example.txt",
    file=SpooledTemporaryFile,
    content_type="text/plain",
    headers=None,
)
```

### Attributes

- `filename: str` — original filename
- `content_type: str` — MIME type
- `file: SpooledTemporaryFile` — file-like object
- `headers: Headers` — file headers

### Methods

- `async write(data)` — write to file
- `async read(size=-1)` — read from file
- `async seek(offset)` — seek in file
- `async close()` — close file

**Source**: [uploadfile](https://fastapi.tiangolo.com/reference/uploadfile/)

---

## Exceptions — HTTPException and WebSocketException

```python
from fastapi import HTTPException, WebSocketException

HTTPException(
    status_code=404,
    detail="Item not found",
    headers={"X-Error": "Custom header"}
)

WebSocketException(code=1008, reason="Policy violation")
```

**Source**: [exceptions](https://fastapi.tiangolo.com/reference/exceptions/)

---

## Dependencies — Depends() and Security()

```python
from fastapi import Depends, Security

Depends(dependency=None, *, use_cache=True)

Security(dependency=None, *, scopes=None, use_cache=True)
```

- `Depends` — declare a dependency
- `Security` — declare a security dependency with OAuth2 scopes

**Source**: [dependencies](https://fastapi.tiangolo.com/reference/dependencies/)

---

## APIRouter class

```python
from fastapi import APIRouter

router = APIRouter(
    prefix="/items",
    tags=["items"],
    dependencies=[Depends(verify_token)],
    responses={404: {"description": "Not found"}},
    default_response_class=JSONResponse,
)
```

### Methods

Same as `FastAPI`: `get`, `post`, `put`, `delete`, `patch`, `options`, `head`, `trace`, `websocket`, `add_api_route`, `include_router`

**Source**: [apirouter](https://fastapi.tiangolo.com/reference/apirouter/)

---

## Background Tasks — BackgroundTasks

```python
from fastapi import BackgroundTasks

tasks = BackgroundTasks()
tasks.add_task(func, arg1, arg2, kwarg1=value)
```

**Source**: [background](https://fastapi.tiangolo.com/reference/background/)

---

## Request class

```python
from fastapi import Request

request.url          # URL object
request.method       # HTTP method
request.headers      # Headers (case-insensitive dict)
request.query_params # Query parameters
request.path_params  # Path parameters
request.cookies      # Cookies
request.body()       # async: raw body bytes
request.json()       # async: parsed JSON
request.form()       # async: parsed form data
request.client       # Client info (host, port)
request.state        # Mutable state object
```

**Source**: [request](https://fastapi.tiangolo.com/reference/request/)

---

## WebSockets

```python
from fastapi import WebSocket, WebSocketDisconnect

websocket = WebSocket(scope, receive, send)

await websocket.accept(subprotocol=None)
await websocket.receive_text()
await websocket.receive_bytes()
await websocket.receive_json()
await websocket.send_text(data)
await websocket.send_bytes(data)
await websocket.send_json(data)
await websocket.close(code=1000, reason=None)
```

**Source**: [websockets](https://fastapi.tiangolo.com/reference/websockets/)

---

## HTTPConnection class

```python
from fastapi import HTTPConnection

# Base class for Request and WebSocket
connection.url
connection.headers
connection.query_params
connection.cookies
connection.client
connection.state
```

**Source**: [httpconnection](https://fastapi.tiangolo.com/reference/httpconnection/)

---

## Response class

```python
from fastapi import Response

response = Response(
    content="Hello",
    media_type="text/plain",
    status_code=200,
    headers=None,
    background=None,
)
```

### Attributes

- `status_code: int`
- `headers: Headers`
- `media_type: str | None`
- `background: BackgroundTask | None`

**Source**: [response](https://fastapi.tiangolo.com/reference/response/)

---

## Custom Response Classes

```python
from fastapi.responses import (
    Response,
    HTMLResponse,
    PlainTextResponse,
    JSONResponse,
    RedirectResponse,
    StreamingResponse,
    FileResponse,
)
```

### HTMLResponse

```python
HTMLResponse(content="<h1>Hello</h1>", status_code=200)
```

### PlainTextResponse

```python
PlainTextResponse(content="Hello", status_code=200)
```

### JSONResponse

```python
JSONResponse(content={"key": "value"}, status_code=200)
```

### RedirectResponse

```python
RedirectResponse(url="/new-path", status_code=307)
```

### StreamingResponse

```python
StreamingResponse(content=generator(), media_type="text/plain")
```

### FileResponse

```python
FileResponse(
    path="files/example.pdf",
    media_type="application/pdf",
    filename="example.pdf",
)
```

**Source**: [responses](https://fastapi.tiangolo.com/reference/responses/)

---

## Middleware

```python
from fastapi.middleware import Middleware

# Built-in middleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.wsgi import WSGIMiddleware
from fastapi.middleware.sessions import SessionMiddleware
```

**Source**: [middleware](https://fastapi.tiangolo.com/reference/middleware/)

---

## OpenAPI

### OpenAPI docs

```python
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html, get_swagger_ui_oauth2_redirect_html
```

### OpenAPI models

```python
from fastapi.openapi.models import (
    OpenAPI,
    Info,
    Server,
    PathItem,
    Operation,
    Response,
    Parameter,
    RequestBody,
    Schema,
    SecurityScheme,
    Tag,
    ExternalDocumentation,
    Components,
    Example,
    Encoding,
    MediaType,
    Callback,
    Discriminator,
    XML,
    Contact,
    License,
    Link,
    Header,
    OAuthFlow,
    OAuthFlows,
    SecurityRequirement,
)
```

**Source**: [openapi/docs](https://fastapi.tiangolo.com/reference/openapi/docs/), [openapi/models](https://fastapi.tiangolo.com/reference/openapi/models/)

---

## Security Tools

```python
from fastapi.security import (
    OAuth2,
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm,
    OAuth2AuthorizationCodeBearer,
    OAuth2ImplicitBearer,
    HTTPBasic,
    HTTPBasicCredentials,
    HTTPBearer,
    HTTPBearerCredentials,
    HTTPDigest,
    HTTPDigestCredentials,
    APIKeyHeader,
    APIKeyQuery,
    APIKeyCookie,
    SecurityScopes,
)
```

**Source**: [security](https://fastapi.tiangolo.com/reference/security/)

---

## Encoders — jsonable_encoder

```python
from fastapi.encoders import jsonable_encoder

json_compatible_data = jsonable_encoder(
    obj,
    include=None,
    exclude=None,
    by_alias=False,
    exclude_unset=False,
    exclude_defaults=False,
    exclude_none=False,
    custom_encoder=None,
    sqlalchemy_safe=True,
)
```

Converts Pydantic models, dataclasses, datetimes, UUIDs, etc. to JSON-compatible Python types.

**Source**: [encoders](https://fastapi.tiangolo.com/reference/encoders/)

---

## Static Files — StaticFiles

```python
from fastapi.staticfiles import StaticFiles

app.mount("/static", StaticFiles(directory="static", html=False), name="static")
```

**Source**: [staticfiles](https://fastapi.tiangolo.com/reference/staticfiles/)

---

## Templating — Jinja2Templates

```python
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="templates")

@router.get("/page")
async def page(request: Request):
    return templates.TemplateResponse("page.html", {"request": request, "data": "value"})
```

**Source**: [templating](https://fastapi.tiangolo.com/reference/templating/)

---

## Test Client — TestClient

```python
from fastapi.testclient import TestClient

client = TestClient(app)

# Synchronous
response = client.get("/")
response = client.post("/items/", json={"name": "Foo"})
response = client.put("/items/1", json={"name": "Bar"})
response = client.delete("/items/1")

# WebSocket
with client.websocket_connect("/ws") as ws:
    ws.send_text("Hello")
    data = ws.receive_text()
```

**Source**: [testclient](https://fastapi.tiangolo.com/reference/testclient/)
