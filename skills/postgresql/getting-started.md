# PostgreSQL Getting Started

## Installation

### From Packages

**macOS (Homebrew):**
```bash
brew install postgresql@17
brew services start postgresql@17
```

**Ubuntu/Debian:**
```bash
sudo apt install postgresql-17
sudo systemctl start postgresql
```

**Windows:** Download the EnterpriseDB installer from https://www.postgresql.org/download/windows/

**Docker:**
```bash
docker run --name pg17 -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres:17
```

### From Source

```bash
./configure --prefix=/usr/local/pgsql
make
make install
initdb -D /usr/local/pgsql/data
pg_ctl -D /usr/local/pgsql/data start
```

### From Binaries

Download binary archive, extract, then:
```bash
initdb -D /path/to/data
pg_ctl -D /path/to/data start
```

## Architectural Fundamentals

PostgreSQL uses a **client/server** architecture:
- **Server process** (postgres) — manages database files, accepts connections, executes queries
- **Client applications** — psql, graphical tools, application libraries
- **Multi-process model** — each connection spawns a separate server process
- **Shared memory** — shared buffer pool, WAL buffers, lock tables

## Creating a Database

```bash
createdb mydb
```

Or via SQL:
```sql
CREATE DATABASE mydb;
```

## Accessing a Database

```bash
psql mydb          # local connection
psql -h host -p 5432 -U user mydb  # remote connection
```

## Tutorial: The SQL Language

### Creating a New Table

```sql
CREATE TABLE weather (
    city      VARCHAR(80),
    temp_lo   INT,           -- low temperature
    temp_hi   INT,           -- high temperature
    prcp      REAL,          -- precipitation
    date      DATE
);
```

### Populating a Table

```sql
INSERT INTO weather VALUES ('San Francisco', 46, 50, 0.25, '1994-11-27');
INSERT INTO weather (city, temp_lo, temp_hi, prcp, date)
    VALUES ('San Francisco', 43, 57, 0.0, '1994-11-29');
```

Use `COPY` for bulk loading:
```sql
COPY weather FROM '/path/to/weather.txt';
```

### Querying a Table

```sql
SELECT * FROM weather;
SELECT city, temp_lo, temp_hi, prcp, date FROM weather;
SELECT city, (temp_hi + temp_lo) / 2 AS temp_avg, date FROM weather;
SELECT * FROM weather WHERE city = 'San Francisco' AND prcp > 0;
SELECT * FROM weather ORDER BY city, temp_lo;
SELECT DISTINCT city FROM weather;
```

### Joins Between Tables

```sql
SELECT weather.city, weather.temp_lo, weather.temp_hi,
       cities.location
FROM weather, cities
WHERE weather.city = cities.city;

-- Modern JOIN syntax
SELECT W.city, W.temp_lo, W.temp_hi, C.location
FROM weather W JOIN cities C ON W.city = C.name;

-- LEFT JOIN
SELECT W.city, W.temp_lo, W.temp_hi, C.location
FROM weather W LEFT JOIN cities C ON W.city = C.name;
```

### Aggregate Functions

```sql
SELECT max(temp_lo) FROM weather;
SELECT city, max(temp_lo), min(temp_lo), avg(temp_lo) FROM weather GROUP BY city;
SELECT city, max(temp_lo) FROM weather GROUP BY city HAVING max(temp_lo) < 40;
```

### Updates

```sql
UPDATE weather SET temp_lo = 18 WHERE city = 'San Francisco';
UPDATE weather SET temp_hi = temp_hi + 2, temp_lo = temp_lo + 2 WHERE date > '1994-11-28';
```

### Deletions

```sql
DELETE FROM weather WHERE city = 'Hayward';
DELETE FROM weather;  -- delete all rows
```

## Tutorial: Advanced Features

### Views

```sql
CREATE VIEW myview AS
    SELECT city, temp_lo, temp_hi, prcp, date, location
    FROM weather, cities
    WHERE city = name;

SELECT * FROM myview;
```

### Foreign Keys

```sql
CREATE TABLE cities (
    city     VARCHAR(80) PRIMARY KEY,
    location POINT
);

CREATE TABLE weather (
    city      VARCHAR(80) REFERENCES cities(city),
    temp_lo   INT,
    temp_hi   INT,
    prcp      REAL,
    date      DATE
);
```

### Transactions

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE name = 'Alice';
UPDATE accounts SET balance = balance + 100 WHERE name = 'Bob';
COMMIT;
-- or ROLLBACK to undo
```

### Window Functions

```sql
SELECT depname, empno, salary,
       avg(salary) OVER (PARTITION BY depname) AS dep_avg
FROM empsalary;

SELECT depname, empno, salary,
       rank() OVER (PARTITION BY depname ORDER BY salary DESC) AS pos
FROM empsalary;
```

### Inheritance

```sql
CREATE TABLE cities (
    name       TEXT PRIMARY KEY,
    population REAL,
    altitude   INT
);

CREATE TABLE capitals (
    state      CHAR(2)
) INHERITS (cities);

SELECT name, altitude FROM cities WHERE altitude > 500;
-- Returns rows from both cities and capitals
SELECT name, altitude FROM ONLY cities WHERE altitude > 500;
-- Returns rows from cities only, not capitals
```

## Conventions

- Commands shown with `#` are superuser prompts
- Commands shown with `$` are shell prompts
- Commands shown with `=>` are psql prompts
- SQL keywords are case-insensitive (convention: UPPERCASE)
- Identifiers are case-folded to lowercase unless quoted with double quotes
