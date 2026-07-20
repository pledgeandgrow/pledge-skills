# Database Access — Go 1.26

## database/sql

```go
import (
    "database/sql"
    _ "github.com/lib/pq"  // PostgreSQL driver
)

// Open
db, err := sql.Open("postgres", "host=localhost port=5432 user=postgres dbname=mydb sslmode=disable")
defer db.Close()

// Ping — verify connection
err = db.Ping()

// Connection pool settings
db.SetMaxOpenConns(25)
db.SetMaxIdleConns(25)
db.SetConnMaxLifetime(5 * time.Minute)
db.SetConnMaxIdleTime(2 * time.Minute)
```

### Query

```go
// QueryRow — single row
var name string
var age int
err := db.QueryRow("SELECT name, age FROM users WHERE id = $1", userID).Scan(&name, &age)
if err != nil {
    if err == sql.ErrNoRows {
        // no row found
    } else {
        log.Fatal(err)
    }
}

// Query — multiple rows
rows, err := db.Query("SELECT id, name, age FROM users WHERE active = $1", true)
if err != nil {
    log.Fatal(err)
}
defer rows.Close()

for rows.Next() {
    var id int
    var name string
    var age int
    if err := rows.Scan(&id, &name, &age); err != nil {
        log.Fatal(err)
    }
    fmt.Printf("%d: %s (%d)\n", id, name, age)
}

if err = rows.Err(); err != nil {
    log.Fatal(err)
}
```

### Exec

```go
// Insert
result, err := db.Exec(
    "INSERT INTO users (name, age, email) VALUES ($1, $2, $3)",
    "Alice", 30, "alice@example.com",
)

// Get last insert ID (driver-dependent)
id, err := result.LastInsertId()

// Get rows affected
n, err := result.RowsAffected()

// Update
result, err := db.Exec(
    "UPDATE users SET age = $1 WHERE name = $2",
    31, "Alice",
)

// Delete
result, err := db.Exec("DELETE FROM users WHERE id = $1", userID)
```

### Prepared Statements

```go
// Prepare
stmt, err := db.Prepare("SELECT name, age FROM users WHERE id = $1")
defer stmt.Close()

for _, id := range userIDs {
    var name string
    var age int
    err := stmt.QueryRow(id).Scan(&name, &age)
    if err != nil {
        log.Println(err)
        continue
    }
    fmt.Printf("%d: %s (%d)\n", id, name, age)
}

// PrepareContext
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()
stmt, err := db.PrepareContext(ctx, "SELECT name FROM users WHERE id = $1")
```

### Transactions

```go
// Begin transaction
tx, err := db.Begin()
if err != nil {
    log.Fatal(err)
}
defer tx.Rollback()  // safe to call after commit — no-op

// Execute within transaction
_, err = tx.Exec("UPDATE accounts SET balance = balance - 100 WHERE id = $1", fromID)
if err != nil {
    return err
}

_, err = tx.Exec("UPDATE accounts SET balance = balance + 100 WHERE id = $1", toID)
if err != nil {
    return err
}

// Commit
err = tx.Commit()
if err != nil {
    return err
}

// BeginTx with options
tx, err := db.BeginTx(ctx, &sql.TxOptions{
    Isolation: sql.LevelSerializable,
    ReadOnly:  false,
})

// Isolation levels
// sql.LevelDefault
// sql.LevelReadUncommitted
// sql.LevelReadCommitted
// sql.LevelRepeatableRead
// sql.LevelSnapshot
// sql.LevelSerializable
// sql.LevelLinearizable
```

### Context-Aware Queries

```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

// QueryRowContext
var name string
err := db.QueryRowContext(ctx, "SELECT name FROM users WHERE id = $1", id).Scan(&name)

// QueryContext
rows, err := db.QueryContext(ctx, "SELECT * FROM users")

// ExecContext
result, err := db.ExecContext(ctx, "INSERT INTO users (name) VALUES ($1)", "Alice")
```

### Null Types

```go
// sql.NullString — for nullable columns
var name sql.NullString
var age sql.NullInt64
var email sql.NullString
var bio sql.NullString

err := db.QueryRow("SELECT name, age, email, bio FROM users WHERE id = $1", id).
    Scan(&name, &age, &email, &bio)

if name.Valid {
    fmt.Println(name.String)
}
if age.Valid {
    fmt.Println(age.Int64)
}

// Null types
sql.NullString
sql.NullInt64
sql.NullInt32
sql.NullFloat64
sql.NullBool
sql.NullTime
sql.Null[any]  // generic (Go 1.22+)
```

### Scanning to Struct

```go
// Manual mapping
type User struct {
    ID    int
    Name  string
    Age   int
    Email string
}

func scanUser(rows *sql.Rows) (User, error) {
    var u User
    err := rows.Scan(&u.ID, &u.Name, &u.Age, &u.Email)
    return u, err
}

// Using sqlc (code generation)
// Using sqlx (third-party library)
// import "github.com/jmoiron/sqlx"
// db := sqlx.NewDb(sqlDB, "postgres")
// var users []User
// db.Select(&users, "SELECT * FROM users")
```

### Batch Operations

```go
// Bulk insert with transaction
tx, _ := db.Begin()
stmt, _ := tx.Prepare("INSERT INTO users (name, age) VALUES ($1, $2)")
defer stmt.Close()

for _, u := range users {
    _, err := stmt.Exec(u.Name, u.Age)
    if err != nil {
        tx.Rollback()
        return err
    }
}
tx.Commit()
```

### Connection Pool Tuning

```go
db.SetMaxOpenConns(25)          // max open connections
db.SetMaxIdleConns(25)          // max idle connections
db.SetConnMaxLifetime(5 * time.Minute)  // max connection lifetime
db.SetConnMaxIdleTime(2 * time.Minute)  // max idle time

// Monitor pool stats
stats := db.Stats()
stats.MaxOpenConnections
stats.OpenConnections
stats.InUse
stats.Idle
stats.WaitCount
stats.WaitDuration
stats.MaxIdleClosed
stats.MaxLifetimeClosed
```

## database/sql/driver

```go
import "database/sql/driver"

// Implement a custom driver
type MyDriver struct{}

func (d *MyDriver) Open(name string) (driver.Conn, error) {
    // create connection
    return &MyConn{}, nil
}

// Register driver
sql.Register("mydriver", &MyDriver{})

// Driver interfaces
// driver.Driver      — Open(name) (Conn, error)
// driver.Conn        — Prepare, Close, Begin
// driver.Stmt        — NumInput, Exec, Query, Close
// driver.Tx          — Commit, Rollback
// driver.Result      — LastInsertId, RowsAffected
// driver.Rows        — Columns, Close, Next
// driver.Value       — any (int64, float64, bool, []byte, string, time.Time, nil)

// Connector (Go 1.10+)
type MyConnector struct{}
func (c *MyConnector) Connect(ctx context.Context) (driver.Conn, error) { }
func (c *MyConnector) Driver() driver.Driver { }
```

## Common Drivers

```go
// PostgreSQL
import _ "github.com/lib/pq"
// or pure Go:
import _ "github.com/jackc/pgx/v5/stdlib"

// MySQL
import _ "github.com/go-sql-driver/mysql"

// SQLite
import _ "modernc.org/sqlite"  // pure Go
import _ "github.com/mattn/go-sqlite3"  // cgo

// SQL Server
import _ "github.com/microsoft/go-mssqldb"

// Oracle
import _ "github.com/godror/godror"

// ClickHouse
import _ "github.com/ClickHouse/clickhouse-go/v2"
```

## Patterns

### Repository Pattern

```go
type UserRepository interface {
    GetByID(ctx context.Context, id int) (*User, error)
    Create(ctx context.Context, u *User) error
    List(ctx context.Context, limit, offset int) ([]*User, error)
}

type userRepository struct {
    db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
    return &userRepository{db: db}
}

func (r *userRepository) GetByID(ctx context.Context, id int) (*User, error) {
    var u User
    err := r.db.QueryRowContext(ctx,
        "SELECT id, name, email FROM users WHERE id = $1", id,
    ).Scan(&u.ID, &u.Name, &u.Email)
    if err != nil {
        return nil, fmt.Errorf("getting user %d: %w", id, err)
    }
    return &u, nil
}

func (r *userRepository) Create(ctx context.Context, u *User) error {
    return r.db.QueryRowContext(ctx,
        "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id",
        u.Name, u.Email,
    ).Scan(&u.ID)
}
```

### Health Check

```go
func healthHandler(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
        defer cancel()
        
        if err := db.PingContext(ctx); err != nil {
            http.Error(w, "database unavailable", http.StatusServiceUnavailable)
            return
        }
        w.WriteHeader(http.StatusOK)
        fmt.Fprintln(w, "OK")
    }
}
```
