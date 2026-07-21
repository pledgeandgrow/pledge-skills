# FastAPI — Tutorial: Dependencies, Security, Middleware, Databases, Testing

## Dependencies

### What is Dependency Injection

Dependency Injection is a technique where components receive their dependencies rather than creating them. FastAPI provides `Depends()` for this.

### Create a dependency

```python
from typing import Annotated
from fastapi import Depends, FastAPI

async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/items/")
async def read_items(commons: Annotated[dict, Depends(common_parameters)]):
    return commons
```

A dependency is a function that can take the same parameters as a path operation function. It can return anything.

### Classes as Dependencies

```python
class CommonQueryParams:
    def __init__(self, q: str | None = None, skip: int = 0, limit: int = 100):
        self.q = q
        self.skip = skip
        self.limit = limit

@app.get("/items/")
async def read_items(commons: Annotated[CommonQueryParams, Depends(CommonQueryParams)]):
    return commons
```

### Sub-dependencies

Dependencies can themselves depend on other dependencies — FastAPI resolves the full graph.

### Dependencies in path operation decorators

```python
async def verify_token(x_token: Annotated[str, Header()]):
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")

@app.get("/items/", dependencies=[Depends(verify_token)])
async def read_items():
    return [{"item": "Foo"}]
```

### Global Dependencies

```python
app = FastAPI(dependencies=[Depends(verify_token)])
```

### Dependencies with yield

```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/items/")
async def read_items(db: Annotated[Session, Depends(get_db)]):
    return db.query(Item).all()
```

- `yield` dependencies support setup and teardown
- Teardown code runs after the response is sent
- Can be used for DB sessions, transactions, resource cleanup

**Source**: [dependencies](https://fastapi.tiangolo.com/tutorial/dependencies/)

---

## Security

### Security — First Steps

```python
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.get("/items/")
async def read_items(token: Annotated[str, Depends(oauth2_scheme)]):
    return {"token": token}
```

`OAuth2PasswordBearer` declares that the app uses OAuth2 with Password flow and Bearer tokens.

### Get Current User

```python
from fastapi.security import OAuth2PasswordRequestForm

@app.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    user = decode_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return user

@app.get("/users/me")
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user
```

### OAuth2 with Password (and hashing), Bearer with JWT tokens

```python
from passlib.context import CryptContext
from jose import jwt

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
```

**Source**: [security/first-steps](https://fastapi.tiangolo.com/tutorial/security/first-steps/), [security/oauth2-jwt](https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/)

---

## Middleware

```python
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response
```

Middleware runs before and after every request. The `call_next` function passes the request to the next middleware or path operation.

**Source**: [middleware](https://fastapi.tiangolo.com/tutorial/middleware/)

---

## CORS (Cross-Origin Resource Sharing)

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://example.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

- `allow_origins`: specific origins or `["*"]` for all
- `allow_credentials`: allow cookies
- `allow_methods`: HTTP methods allowed
- `allow_headers`: HTTP headers allowed

**Source**: [cors](https://fastapi.tiangolo.com/tutorial/cors/)

---

## SQL (Relational) Databases

### Using SQLAlchemy

```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class DBUser(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Using the dependency in path operations

```python
@app.post("/users/", response_model=User)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = DBUser(email=user.email, hashed_password=get_password_hash(user.password))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
```

**Source**: [sql-databases](https://fastapi.tiangolo.com/tutorial/sql-databases/)

---

## Bigger Applications — Multiple Files

### APIRouter

```python
from fastapi import APIRouter

router = APIRouter(
    prefix="/items",
    tags=["items"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
async def read_items():
    return [{"item": "Foo"}]
```

### Include router

```python
from .routers import items, users

app = FastAPI()
app.include_router(items.router)
app.include_router(users.router)
```

### Prefix and tags per include

```python
app.include_router(items.router, prefix="/api/v1", tags=["items"])
```

**Source**: [bigger-applications](https://fastapi.tiangolo.com/tutorial/bigger-applications/)

---

## Stream JSON Lines

```python
from fastapi.responses import StreamingResponse
import json

@app.get("/stream/")
async def stream_json_lines():
    async def generate():
        for i in range(10):
            yield json.dumps({"id": i}) + "\n"
    return StreamingResponse(generate(), media_type="application/x-ndjson")
```

**Source**: [stream-json-lines](https://fastapi.tiangolo.com/tutorial/stream-json-lines/)

---

## Server-Sent Events (SSE)

```python
@app.get("/events")
async def events():
    async def event_generator():
        while True:
            data = await get_data()
            yield {"event": "message", "data": data}
            await asyncio.sleep(1)
    return EventSourceResponse(event_generator())
```

**Source**: [server-sent-events](https://fastapi.tiangolo.com/tutorial/server-sent-events/)

---

## Background Tasks

```python
from fastapi import BackgroundTasks

def write_notification(email: str, message: str):
    with open("log.txt", "a") as f:
        f.write(f"Notification for {email}: {message}\n")

@app.post("/send-notification/{email}")
async def send_notification(email: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(write_notification, email, "some message")
    return {"message": "Notification sent in background"}
```

- Tasks run after the response is sent
- Can be used with dependencies
- For heavier work, use Celery, RQ, or Dramatiq

**Source**: [background-tasks](https://fastapi.tiangolo.com/tutorial/background-tasks/)

---

## Metadata and Docs URLs

```python
app = FastAPI(
    title="My API",
    summary="A sample API",
    description="Full description with **Markdown** support.",
    version="0.1.0",
    terms_of_service="http://example.com/terms/",
    contact={"name": "Support", "email": "support@example.com"},
    license_info={"name": "MIT", "url": "https://opensource.org/licenses/MIT"},
    openapi_tags=[
        {"name": "items", "description": "Manage items"},
        {"name": "users", "description": "Manage users"},
    ],
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)
```

**Source**: [metadata](https://fastapi.tiangolo.com/tutorial/metadata/)

---

## Frontend

FastAPI can serve frontend applications alongside the API:

```python
from fastapi.staticfiles import StaticFiles

app.mount("/static", StaticFiles(directory="static"), name="static")
```

**Source**: [frontend](https://fastapi.tiangolo.com/tutorial/frontend/)

---

## Static Files

```python
from fastapi.staticfiles import StaticFiles

app.mount("/static", StaticFiles(directory="static"), name="static")
```

**Source**: [static-files](https://fastapi.tiangolo.com/tutorial/static-files/)

---

## Testing

```python
from fastapi.testclient import TestClient

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"msg": "Hello World"}

def test_create_item():
    response = client.post("/items/", json={"name": "Foo", "price": 50.5})
    assert response.status_code == 200
    assert response.json()["name"] == "Foo"
```

- Uses `TestClient` from Starlette (wraps `httpx`)
- No need to run a server — tests call the app directly
- Can use `pytest` fixtures for DB sessions and dependency overrides

**Source**: [testing](https://fastapi.tiangolo.com/tutorial/testing/)

---

## Debugging

Run the dev server with reload:

```bash
fastapi dev main.py
```

Use VS Code or PyCharm debuggers with Uvicorn in `--reload` mode. Set breakpoints in path operation functions.

**Source**: [debugging](https://fastapi.tiangolo.com/tutorial/debugging/)
