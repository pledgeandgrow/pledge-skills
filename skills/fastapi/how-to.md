# FastAPI — How To: Recipes

## General — How To — Recipes

Practical recipes for common FastAPI tasks.

**Source**: [general](https://fastapi.tiangolo.com/how-to/general/)

---

## Migrate from Pydantic v1 to Pydantic v2

Key migration changes:

### Model config

```python
# Pydantic v1
class Config:
    orm_mode = True

# Pydantic v2
model_config = {"from_attributes": True}
```

### Methods renamed

```python
# v1
item.dict()
item.json()

# v2
item.model_dump()
item.model_dump_json()
```

### Validators

```python
# v1
@validator("name")
def validate_name(cls, v):
    return v

# v2
from pydantic import field_validator

@field_validator("name")
@classmethod
def validate_name(cls, v):
    return v
```

**Source**: [migrate-from-pydantic-v1-to-pydantic-v2](https://fastapi.tiangolo.com/how-to/migrate-from-pydantic-v1-to-pydantic-v2/)

---

## GraphQL

FastAPI can work alongside GraphQL using:
- **Strawberry** — code-first GraphQL library
- **Ariadne** — schema-first GraphQL library
- **Graphene** — code-first GraphQL library

```python
from strawberry.fastapi import GraphQLRouter
import strawberry

@strawberry.type
class Query:
    @strawberry.field
    def hello(self) -> str:
        return "Hello World"

schema = strawberry.Schema(Query)
graphql_app = GraphQLRouter(schema)

app = FastAPI()
app.include_router(graphql_app, prefix="/graphql")
```

**Source**: [graphql](https://fastapi.tiangolo.com/how-to/graphql/)

---

## Custom Request and APIRoute class

```python
from fastapi import Request, APIRoute
from fastapi.responses import JSONResponse

class LoggedRoute(APIRoute):
    def get_route_handler(self):
        original_route_handler = super().get_route_handler()

        async def custom_route_handler(request: Request):
            print(f"Request: {request.method} {request.url}")
            response = await original_route_handler(request)
            print(f"Response: {response.status_code}")
            return response

        return custom_route_handler

router = APIRouter(route_class=LoggedRoute)
```

**Source**: [custom-request-and-route](https://fastapi.tiangolo.com/how-to/custom-request-and-route/)

---

## Conditional OpenAPI

```python
from fastapi import FastAPI

app = FastAPI()

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = {
        "openapi": "3.1.0",
        "info": {"title": "Custom API", "version": "1.0.0"},
        "paths": {},
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
```

**Source**: [conditional-openapi](https://fastapi.tiangolo.com/how-to/conditional-openapi/)

---

## Extending OpenAPI

```python
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    from fastapi.openapi.utils import get_openapi
    openapi_schema = get_openapi(
        title="My API",
        version="1.0.0",
        routes=app.routes,
    )
    # Add custom extensions
    openapi_schema["x-custom-meta"] = {"author": "Me"}
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
```

**Source**: [extending-openapi](https://fastapi.tiangolo.com/how-to/extending-openapi/)

---

## Separate OpenAPI Schemas for Input and Output or Not

```python
# Default: separate input/output schemas
app = FastAPI(separate_input_output_schemas=True)

# Combined schemas
app = FastAPI(separate_input_output_schemas=False)
```

When `True` (default), Pydantic models used for request bodies and responses get separate OpenAPI schemas (e.g. `Item-Input`, `Item-Output`).

**Source**: [separate-openapi-schemas](https://fastapi.tiangolo.com/how-to/separate-openapi-schemas/)

---

## Custom Docs UI Static Assets (Self-Hosting)

```python
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html

app = FastAPI(docs_url=None, redoc_url=None, swagger_ui_oauth2_redirect_url=None)

@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=f"{app.title} - Swagger UI",
        swagger_js_url="/static/swagger-ui-bundle.js",
        swagger_css_url="/static/swagger-ui.css",
    )
```

**Source**: [custom-docs-ui-assets](https://fastapi.tiangolo.com/how-to/custom-docs-ui-assets/)

---

## Configure Swagger UI

```python
app = FastAPI(swagger_ui_parameters={
    "deepLinking": True,
    "displayRequestDuration": True,
    "docExpansion": "none",
    "operationsSorter": "method",
    "filter": True,
    "tagsSorter": "alpha",
    "persistAuthorization": True,
})
```

**Source**: [configure-swagger-ui](https://fastapi.tiangolo.com/how-to/configure-swagger-ui/)

---

## Testing a Database

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_create_user():
    response = client.post("/users/", json={"email": "test@test.com", "password": "test"})
    assert response.status_code == 200
```

**Source**: [testing-database](https://fastapi.tiangolo.com/how-to/testing-database/)

---

## Use Old 403 Authentication Error Status Codes

```python
from fastapi import HTTPException

# Override the default 401 to 403
async def get_current_user(token: str = Depends(oauth2_scheme)):
    if not verify_token(token):
        raise HTTPException(status_code=403, detail="Not authenticated")
    ...
```

**Source**: [authentication-error-status-code](https://fastapi.tiangolo.com/how-to/authentication-error-status-code/)
