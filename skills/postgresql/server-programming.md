# PostgreSQL Server Programming

## Extending SQL

### How Extensibility Works

PostgreSQL is extensible at multiple levels:
- **Functions** — SQL, PL/pgSQL, C, and other procedural languages
- **Aggregates** — custom aggregate functions
- **Data types** — base types, composite types, domains, enums
- **Operators** — custom operators on types
- **Operator classes** — for custom index support
- **Extensions** — packages of related objects

### The PostgreSQL Type System

- **Base Types** — implemented in C (e.g., `int4`, `text`, `timestamp`)
- **Container Types** — arrays, composite types
- **Domains** — base type with constraints
- **Pseudo-Types** — `any`, `anyelement`, `anyarray`, `void`, `record`, `trigger`
- **Polymorphic Types** — `anyelement`, `anyarray`, `anyenum`, `anyrange`, `anycompatible`, `anycompatiblearray`

### User-Defined Functions

```sql
-- SQL function
CREATE FUNCTION add(integer, integer) RETURNS integer AS $$
    SELECT $1 + $2;
$$ LANGUAGE SQL;

-- With default arguments
CREATE FUNCTION add(a integer, b integer DEFAULT 10) RETURNS integer AS $$
    SELECT a + b;
$$ LANGUAGE SQL;

-- Variadic
CREATE FUNCTION min_variadic(VARIADIC numeric[]) RETURNS numeric AS $$
    SELECT min(v) FROM unnest($1) v;
$$ LANGUAGE SQL;

-- Set-returning function
CREATE FUNCTION get_children(parent_id integer) RETURNS SETOF integer AS $$
    SELECT id FROM tree WHERE parent = $1;
$$ LANGUAGE SQL;

-- Table function
CREATE FUNCTION get_users() RETURNS TABLE(id integer, name text) AS $$
    SELECT id, name FROM users;
$$ LANGUAGE SQL;

-- Volatility categories
-- IMMUTABLE: same input always gives same output (e.g., abs)
-- STABLE: same input gives same output within a query (e.g., now())
-- VOLATILE: can return different results (default, e.g., random)
CREATE FUNCTION square(n integer) RETURNS integer AS $$
    SELECT n * n;
$$ LANGUAGE SQL IMMUTABLE;
```

### User-Defined Procedures

```sql
CREATE PROCEDURE transfer(account_from integer, account_to integer, amount numeric) AS $$
BEGIN
    UPDATE accounts SET balance = balance - amount WHERE id = account_from;
    UPDATE accounts SET balance = balance + amount WHERE id = account_to;
    COMMIT;
END;
$$ LANGUAGE plpgsql;

CALL transfer(1, 2, 100.00);
```

### Function Overloading

PostgreSQL supports function overloading — multiple functions with the same name but different argument types.

### User-Defined Aggregates

```sql
-- Simple aggregate
CREATE AGGREGATE sum(double precision) (
    SFUNC = float8pl,
    STYPE = double precision,
    INITCOND = '0'
);

-- With moving-aggregate mode
CREATE AGGREGATE avg(numeric) (
    SFUNC = numeric_avg_accum,
    STYPE = internal,
    MFINALFUNC = numeric_avg_final,
    MSFUNC = numeric_avg_accum,
    MSTYPE = internal
);
```

### User-Defined Types

```sql
-- Composite type
CREATE TYPE complex AS (r double precision, i double precision);

-- Enum type
CREATE TYPE bug_status AS ENUM ('new', 'open', 'closed');

-- Base type (requires C functions)
CREATE TYPE box;
CREATE FUNCTION box_in(cstring) RETURNS box AS ...
CREATE FUNCTION box_out(box) RETURNS cstring AS ...
CREATE TYPE box (
    INTERNALLENGTH = 16,
    INPUT = box_in,
    OUTPUT = box_out
);
```

### User-Defined Operators

```sql
CREATE OPERATOR === (
    LEFTARG = complex,
    RIGHTARG = complex,
    PROCEDURE = complex_eq,
    COMMUTATOR = ===,
    NEGATOR = !==,
    RESTRICT = eqsel,
    JOIN = eqjoinsel,
    HASHES,
    MERGES
);
```

### Packaging Extensions

```sql
-- Extension control file: myext.control
-- [myext.control]
-- module_path = '$libdir/myext'
-- default_version = '1.0'

-- Extension SQL file: myext--1.0.sql
CREATE EXTENSION myext;

-- Update extension
ALTER EXTENSION myext UPDATE TO '1.1';

-- PGXS build infrastructure
# Makefile
MODULES = myext
EXTENSION = myext
DATA = myext--1.0.sql
PG_CONFIG = pg_config
PGXS := $(shell $(PG_CONFIG) --pgxs)
include $(PGXS)
```

## Triggers

### Overview of Trigger Behavior

- **BEFORE** triggers — fire before the operation, can modify or cancel the operation (return NULL to skip)
- **AFTER** triggers — fire after the operation, cannot modify the row
- **INSTEAD OF** triggers — for views, replace the operation
- **Row-level** (`FOR EACH ROW`) — fire once per row
- **Statement-level** (`FOR EACH STATEMENT`) — fire once per statement
- **Transition tables** — `OLD TABLE` and `NEW TABLE` for statement-level access to changed rows

```sql
-- Create trigger function
CREATE FUNCTION update_modified() RETURNS trigger AS $$
BEGIN
    NEW.modified_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_modified BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_modified();

-- Statement-level trigger with transition tables
CREATE TRIGGER audit_changes AFTER INSERT OR UPDATE OR DELETE ON products
    REFERENCING NEW TABLE AS new_rows OLD TABLE AS old_rows
    FOR EACH STATEMENT EXECUTE FUNCTION audit_products();
```

### Trigger Types

- `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE` (statement-level only)
- `BEFORE`, `AFTER`, `INSTEAD OF`
- `FOR EACH ROW`, `FOR EACH STATEMENT`
- `WHEN` clause for conditional firing

### Special Trigger Variables

- `NEW` — new row value (INSERT, UPDATE)
- `OLD` — old row value (UPDATE, DELETE)
- `TG_OP` — operation type (`INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`)
- `TG_WHEN` — `BEFORE`, `AFTER`, `INSTEAD OF`
- `TG_LEVEL` — `ROW`, `STATEMENT`
- `TG_TABLE_NAME`, `TG_TABLE_SCHEMA`
- `TG_ARGV[]` — trigger arguments

## Event Triggers

```sql
CREATE FUNCTION log_ddl() RETURNS event_trigger AS $$
BEGIN
    INSERT INTO ddl_log (event, tag, user) VALUES (TG_EVENT, TG_TAG, current_user);
END;
$$ LANGUAGE plpgsql;

CREATE EVENT TRIGGER log_ddl_events ON ddl_command_end
    EXECUTE FUNCTION log_ddl();
```

Event triggers fire on DDL commands: `ddl_command_start`, `ddl_command_end`, `sql_drop`, `table_rewrite`. `TG_TAG` identifies the command (e.g., `CREATE TABLE`, `ALTER TABLE`).

## The Rule System

```sql
-- Rewrite rules for views
CREATE VIEW myview AS SELECT id, name FROM products;

-- INSTEAD rule for insertable view
CREATE RULE myview_insert AS ON INSERT TO myview DO INSTEAD
    INSERT INTO products (id, name) VALUES (NEW.id, NEW.name);
```

## PL/pgSQL — SQL Procedural Language

### Structure

```sql
CREATE FUNCTION somefunc(integer, text) RETURNS integer AS $$
<<outerblock>>
DECLARE
    quantity  integer := 30;
    pi        constant real := 3.14159;
    rec       record;
    cur       refcursor;
BEGIN
    -- Statements
    RETURN quantity;
END;
$$ LANGUAGE plpgsql;
```

### Declarations

```sql
-- Function parameters
DECLARE
    -- Named parameters (can use $1, $2 or names)
    name ALIAS FOR $1;
    -- Copying types
    myvar users.name%TYPE;
    -- Row types
    user_row users%ROWTYPE;
    -- Record types
    rec record;
```

### Basic Statements

```sql
-- Assignment
variable := expression;
user_id := 42;

-- Execute SQL command
UPDATE accounts SET balance = 0 WHERE id = user_id;

-- Single-row result
SELECT name INTO user_name FROM users WHERE id = user_id;
-- Or with FOUND check
SELECT name INTO user_name FROM users WHERE id = user_id;
IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
END IF;

-- Dynamic SQL
EXECUTE 'SELECT count(*) FROM ' || table_name INTO row_count;

-- GET DIAGNOSTICS
GET DIAGNOSTICS var = ROW_COUNT;

-- PERFORM (discard result)
PERFORM 1;
```

### Control Structures

```sql
-- RETURN
RETURN expression;
RETURN NEXT expression;  -- for set-returning functions
RETURN QUERY SELECT ...;  -- for set-returning functions

-- Conditionals
IF x > 0 THEN
    RETURN 'positive';
ELSIF x < 0 THEN
    RETURN 'negative';
ELSE
    RETURN 'zero';
END IF;

-- CASE
CASE WHEN x > 0 THEN ...
     WHEN x < 0 THEN ...
     ELSE ...
END CASE;

-- Simple LOOP
LOOP
    -- statements
    EXIT WHEN count > 10;
    CONTINUE WHEN count % 2 = 0;
END LOOP;

-- WHILE
WHILE count < 10 LOOP
    count := count + 1;
END LOOP;

-- FOR (integer)
FOR i IN 1..10 LOOP
    -- statements
END LOOP;

FOR i IN REVERSE 10..1 LOOP
    -- statements
END LOOP;

-- FOR (query result)
FOR rec IN SELECT * FROM users LOOP
    -- statements using rec
END LOOP;

-- FOR (array)
FOR rec IN SELECT * FROM unnest(my_array) LOOP
    -- statements
END LOOP;

-- Trapping errors
BEGIN
    -- statements
EXCEPTION
    WHEN division_by_zero THEN
        RAISE NOTICE 'Division by zero';
    WHEN OTHERS THEN
        RAISE NOTICE 'Error: %', SQLERRM;
END;
```

### Cursors

```sql
-- Declare
cur CURSOR (key integer) FOR SELECT * FROM users WHERE id = key;

-- Open
OPEN cur(42);

-- Fetch
FETCH cur INTO rec;
FETCH NEXT FROM cur INTO rec;
FETCH 10 FROM cur;  -- batch fetch

-- Loop through cursor
FOR rec IN cur LOOP
    -- statements
END LOOP;

-- Close
CLOSE cur;
```

### Transaction Management

```sql
-- In procedures (not functions)
BEGIN
    -- statements
    COMMIT;
    -- more statements
    ROLLBACK;
END;
```

### Errors and Messages

```sql
-- Raise errors
RAISE EXCEPTION 'User % not found', user_id USING HINT = 'Check the user ID';
RAISE WARNING 'Deprecated feature used';
RAISE NOTICE 'Processing row %', row_id;
RAISE DEBUG 'Internal value: %', internal_var;
RAISE LOG 'Query: %', query_text;
RAISE INFO 'Information: %', info_text;

-- Assertions
ASSERT count > 0, 'Count must be positive';
```

### Trigger Functions in PL/pgSQL

```sql
CREATE FUNCTION audit_trigger() RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit (op, old_data) VALUES (TG_OP, row_to_json(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit (op, old_data, new_data) VALUES (TG_OP, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit (op, new_data) VALUES (TG_OP, row_to_json(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

### PL/pgSQL Under the Hood

- **Variable substitution** — PL/pgSQL variables are substituted into SQL queries at parse time
- **Plan caching** — query plans are cached for reuse across calls
- Custom plans vs generic plans (prepared statements)

## PL/Tcl

```sql
CREATE FUNCTION tcl_max(integer, integer) RETURNS integer AS $$
    if {$1 > $2} {return $1}
    return $2
$$ LANGUAGE pltcl;
```

## PL/Perl

```sql
CREATE FUNCTION perl_max(integer, integer) RETURNS integer AS $$
    my ($x, $y) = @_;
    return $x > $y ? $x : $y;
$$ LANGUAGE plperl;
```

## PL/Python

```sql
CREATE FUNCTION pymax(a integer, b integer) RETURNS integer AS $$
    if a > b:
        return a
    return b
$$ LANGUAGE plpython3u;
```

## Server Programming Interface (SPI)

SPI allows server-side functions to execute SQL commands:

```sql
-- In C or PL/pgSQL
-- SPI_connect(), SPI_execute(), SPI_finish()
-- In PL/pgSQL, EXECUTE uses SPI internally
```

## Logical Decoding

Logical decoding extracts changes from WAL in a user-defined format:

```sql
-- Create a logical replication slot
SELECT pg_create_logical_replication_slot('my_slot', 'test_decoding');

-- Peek at changes
SELECT * FROM pg_logical_slot_peek_changes('my_slot', NULL, NULL);

-- Consume changes
SELECT * FROM pg_logical_slot_get_changes('my_slot', NULL, NULL);

-- Drop slot
SELECT pg_drop_replication_slot('my_slot');
```

Output plugins: `test_decoding`, `pgoutput` (for logical replication), custom plugins.

## Contrib Modules and Extensions

### Key Contrib Extensions

| Extension | Description |
|-----------|-------------|
| `pg_stat_statements` | Track SQL planning and execution statistics |
| `postgres_fdw` | Foreign Data Wrapper for remote PostgreSQL servers |
| `pgcrypto` | Cryptographic functions (hashing, encryption, PGP) |
| `pg_trgm` | Trigram-based text similarity and fuzzy search |
| `hstore` | Key-value store data type |
| `ltree` | Hierarchical tree-like data type |
| `dblink` | Connect to and query other PostgreSQL databases |
| `citext` | Case-insensitive text type |
| `unaccent` | Text search dictionary that removes diacritics |
| `uuid-ossp` | UUID generation functions |
| `btree_gin` | GIN operator classes with B-tree behavior |
| `btree_gist` | GiST operator classes with B-tree behavior |
| `bloom` | Bloom filter index access method |
| `tablefunc` | Crosstab and pivot table functions |
| `intarray` | Integer array manipulation |
| `pgstattuple` | Tuple-level statistics |
| `pg_buffercache` | Inspect buffer cache state |
| `pg_prewarm` | Preload relation data into buffer cache |
| `pg_visibility` | Visibility map information |
| `pg_walinspect` | Low-level WAL inspection |
| `pageinspect` | Low-level database page inspection |
| `fuzzystrmatch` | String similarity (Soundex, Levenshtein, Metaphone) |
| `earthdistance` | Great-circle distance calculations |
| `file_fdw` | Access data files as foreign tables |
| `amcheck` | Verify table and index consistency |
| `auto_explain` | Log execution plans of slow queries |
| `passwordcheck` | Verify password strength |
| `pg_freespacemap` | Examine free space map |
| `pgrowlocks` | Show row locking information |
| `pg_surgery` | Low-level surgery on relation data |
| `sslinfo` | Client SSL information |
| `tcn` | Trigger function for change notifications |
| `tsm_system_rows` | SYSTEM_ROWS sampling for TABLESAMPLE |
| `tsm_system_time` | SYSTEM_TIME sampling for TABLESAMPLE |
| `seg` | Line segment / floating point interval data type |
| `cube` | Multi-dimensional cube data type |
| `isn` | International standard numbers (ISBN, EAN, UPC) |
| `dict_int` | Full-text search dictionary for integers |
| `dict_xsyn` | Synonym full-text search dictionary |
| `intagg` | Integer aggregator and enumerator |
| `lo` | Large object management |
| `refint` | Referential integrity functions |
| `autoinc` | Autoincrementing field functions |
| `moddatetime` | Track last modification time |
| `insert_username` | Track who changed a table |
| `sepgsql` | SELinux mandatory access control |
| `xml2` | XPath querying and XSLT |

```sql
-- Install a contrib extension
CREATE EXTENSION pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS hstore;
CREATE EXTENSION postgres_fdw;

-- List installed extensions
SELECT * FROM pg_available_extensions;
SELECT * FROM pg_extension;
```

### pg_stat_statements

```sql
-- Enable
CREATE EXTENSION pg_stat_statements;
-- Add to shared_preload_libraries in postgresql.conf:
-- shared_preload_libraries = 'pg_stat_statements'

-- Query top queries by total time
SELECT query, calls, total_exec_time, mean_exec_time, rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;

-- Reset statistics
SELECT pg_stat_statements_reset();
```

### postgres_fdw

```sql
CREATE EXTENSION postgres_fdw;
CREATE SERVER remote_server
    FOREIGN DATA WRAPPER postgres_fdw
    OPTIONS (host 'remote.host', port '5432', dbname 'remotedb');
CREATE USER MAPPING FOR local_user
    SERVER remote_server
    OPTIONS (user 'remote_user', password 'secret');
CREATE FOREIGN TABLE remote_users (id int, name text)
    SERVER remote_server
    OPTIONS (schema_name 'public', table_name 'users');

-- Import entire schema
IMPORT FOREIGN SCHEMA public FROM SERVER remote_server INTO remote_schema;
```

### pgcrypto

```sql
CREATE EXTENSION pgcrypto;
-- Hashing
SELECT digest('data', 'sha256');
SELECT hmac('data', 'key', 'sha256');
-- Password hashing
SELECT crypt('password', gen_salt('bf'));
SELECT crypt('password', gen_salt('md5'));
-- PGP encryption
SELECT pgp_sym_encrypt('secret', 'password');
SELECT pgp_sym_decrypt(encrypted_data, 'password');
```

### hstore

```sql
CREATE EXTENSION hstore;
SELECT 'a=>1, b=>2'::hstore;
SELECT hstore('a', '1') || hstore('b', '2');
SELECT 'a=>1'::hstore ? 'a';  -- true
SELECT 'a=>1'::hstore -> 'a';  -- 1
CREATE INDEX idx_hstore ON items USING GIN (attrs);
```

### pg_trgm

```sql
CREATE EXTENSION pg_trgm;
SELECT similarity('hello', 'hallo');  -- 0.5
SELECT 'hello' % 'hallo';  -- similarity threshold
SELECT show_trgm('hello');
CREATE INDEX idx_trgm ON items USING GIN (name gin_trgm_ops);
-- Supports ILIKE and similarity searches
```

## SQL Command Reference

PostgreSQL supports 140+ SQL commands. Key categories:

### Data Definition (DDL)
`CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`, `CREATE INDEX`, `ALTER INDEX`, `DROP INDEX`, `CREATE VIEW`, `ALTER VIEW`, `DROP VIEW`, `CREATE MATERIALIZED VIEW`, `REFRESH MATERIALIZED VIEW`, `CREATE TYPE`, `ALTER TYPE`, `DROP TYPE`, `CREATE DOMAIN`, `CREATE SCHEMA`, `ALTER SCHEMA`, `CREATE SEQUENCE`, `CREATE TABLESPACE`, `CREATE EXTENSION`, `ALTER EXTENSION`, `DROP EXTENSION`, `CREATE FUNCTION`, `ALTER FUNCTION`, `DROP FUNCTION`, `CREATE PROCEDURE`, `CREATE AGGREGATE`, `CREATE OPERATOR`, `CREATE CAST`, `CREATE COLLATION`, `CREATE CONVERSION`, `CREATE TEXT SEARCH CONFIGURATION/DICTIONARY/PARSER/TEMPLATE`, `CREATE TRIGGER`, `ALTER TRIGGER`, `DROP TRIGGER`, `CREATE EVENT TRIGGER`, `CREATE RULE`, `CREATE POLICY`, `CREATE PUBLICATION`, `CREATE SUBSCRIPTION`

### Data Manipulation (DML)
`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `MERGE`, `VALUES`, `COPY`, `CALL`, `DO`

### Transaction Control
`BEGIN`, `START TRANSACTION`, `COMMIT`, `ROLLBACK`, `SAVEPOINT`, `RELEASE SAVEPOINT`, `ROLLBACK TO SAVEPOINT`, `END`, `SET TRANSACTION`, `SET CONSTRAINTS`, `PREPARE TRANSACTION`, `COMMIT PREPARED`, `ROLLBACK PREPARED`

### Access Control
`GRANT`, `REVOKE`, `CREATE ROLE`, `ALTER ROLE`, `DROP ROLE`, `CREATE USER`, `ALTER USER`, `DROP USER`, `ALTER DEFAULT PRIVILEGES`, `ALTER SYSTEM`, `SET ROLE`

### Database Management
`CREATE DATABASE`, `ALTER DATABASE`, `DROP DATABASE`, `CLUSTER`, `VACUUM`, `ANALYZE`, `REINDEX`, `TRUNCATE`, `COMMENT`, `SECURITY LABEL`

### Session Control
`SET`, `RESET`, `SHOW`, `DISCARD`, `LISTEN`, `NOTIFY`, `UNLISTEN`, `LOAD`, `LOCK`, `CHECKPOINT`

### Cursors
`DECLARE`, `FETCH`, `MOVE`, `CLOSE`

### Prepared Statements
`PREPARE`, `EXECUTE`, `DEALLOCATE`

### Query Analysis
`EXPLAIN`

### Access Methods
`CREATE ACCESS METHOD`, `DROP ACCESS METHOD`

### Foreign Data
`CREATE FOREIGN DATA WRAPPER`, `CREATE SERVER`, `CREATE USER MAPPING`, `CREATE FOREIGN TABLE`, `IMPORT FOREIGN SCHEMA`

### Statistics
`CREATE STATISTICS`, `ALTER STATISTICS`, `DROP STATISTICS`
