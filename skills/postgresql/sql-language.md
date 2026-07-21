# PostgreSQL SQL Language

## SQL Syntax

### Lexical Structure

- **Identifiers** — must begin with a letter or underscore, contain letters, digits, underscores; case-folded to lowercase unless quoted with double quotes
- **Constants** — string constants in single quotes, escaped quotes via `''` or `\'`; dollar-quoted strings `$$tag$$`; numeric constants; bit string constants `B'1001'`; hex constants `X'1FF'`
- **Operators** — `+`, `-`, `*`, `/`, `%`, `^`, `|/`, `||/`, `!`, `!!`, `@`, `~`, `&`, `|`, `#`, `<<`, `>>`, `||`
- **Special characters** — `*` (all columns), `.` (schema/table qualifier), `::` (type cast), `[]` (array subscript), `()` (grouping), `,` (separator), `;` (statement terminator)
- **Comments** — `--` single line, `/* */` multi-line
- **Operator precedence** — `::` > `[]` > `+`/`-` (unary) > `^` > `*`/`/`/`%` > `+`/`-` > (all other operators) > `BETWEEN`/`IN`/`LIKE` > comparison operators > `IS` > `NOT` > `AND` > `OR`

### Value Expressions

- **Column references** — `column`, `table.column`, `schema.table.column`
- **Positional parameters** — `$1`, `$2` (used in function definitions and prepared statements)
- **Subscripts** — `array_column[1]`, `two_d_array[1][2]`
- **Field selection** — `composite_column.field`, `(col1, col2).field1`
- **Operator invocations** — `a + b`, `a OPERATOR(schema.op) b`
- **Function calls** — `function(args)`, `function(named_arg => value)`
- **Aggregate expressions** — `SUM(x)`, `COUNT(*)`, `AVG(x) FILTER (WHERE x > 0)`, `array_agg(x ORDER BY y)`
- **Window function calls** — `avg(x) OVER (PARTITION BY y ORDER BY z)`, `row_number() OVER ()`, `lag(x) OVER (ORDER BY y)`
- **Type casts** — `CAST(x AS type)`, `x::type`, `type 'string'`
- **Collation expressions** — `expr COLLATE "en_US"`
- **Scalar subqueries** — `(SELECT max(x) FROM t)`
- **Array constructors** — `ARRAY[1, 2, 3]`, `ARRAY(SELECT col FROM t)`
- **Row constructors** — `ROW(1, 2.5, 'foo')`, `(1, 2.5, 'foo')`

### Calling Functions

- **Positional notation** — `func(1, 2, 3)`
- **Named notation** — `func(arg1 => 1, arg2 => 2, arg3 => 3)`
- **Mixed notation** — `func(1, arg3 => 3, arg2 => 2)`

## Data Types

### Numeric Types

| Type | Size | Range |
|------|------|-------|
| `smallint` / `int2` | 2 bytes | -32768 to +32767 |
| `integer` / `int` / `int4` | 4 bytes | -2147483648 to +2147483647 |
| `bigint` / `int8` | 8 bytes | -9223372036854775808 to +9223372036854775807 |
| `decimal` / `numeric` | variable | up to 131072 digits before, 16383 after decimal point |
| `real` / `float4` | 4 bytes | 6 decimal digits precision |
| `double precision` / `float8` | 8 bytes | 15 decimal digits precision |
| `smallserial` / `serial2` | 2 bytes | autoincrement 1 to 32767 |
| `serial` / `serial4` | 4 bytes | autoincrement 1 to 2147483647 |
| `bigserial` / `serial8` | 8 bytes | autoincrement 1 to 9223372036854775807 |

```sql
-- Numeric type with precision and scale
NUMERIC(precision, scale)
NUMERIC(precision)  -- scale defaults to 0
NUMERIC  -- arbitrary precision and scale
```

### Monetary Types

- `money` — 8 bytes, stores currency amounts with fixed fractional precision

### Character Types

| Type | Description |
|------|-------------|
| `character varying(n)` / `varchar(n)` | variable-length with limit |
| `character(n)` / `char(n)` | fixed-length, blank-padded |
| `text` | variable-length, no limit |

### Binary Data Types

- `bytea` — binary string, hex format `\x` prefix or escape format

### Date/Time Types

| Type | Size | Description |
|------|------|-------------|
| `date` | 4 bytes | date only |
| `time [without time zone]` | 8 bytes | time of day |
| `time with time zone` / `timetz` | 12 bytes | time of day with time zone |
| `timestamp [without time zone]` | 8 bytes | date and time |
| `timestamp with time zone` / `timestamptz` | 8 bytes | date and time with time zone |
| `interval` | 16 bytes | time interval |

```sql
-- Interval with fields
INTERVAL '1 year 2 months 3 days 4 hours'
INTERVAL '1' YEAR TO MONTH
```

### Boolean Type

- `boolean` / `bool` — `TRUE`/`t`/`true`/`y`/`yes`/`on`/`1`, `FALSE`/`f`/`false`/`n`/`no`/`off`/`0`, `NULL`

### Enumerated Types

```sql
CREATE TYPE mood AS ENUM ('sad', 'ok', 'happy');
CREATE TABLE person (name TEXT, current_mood mood);
INSERT INTO person VALUES ('Moe', 'happy');
```

### Geometric Types

| Type | Size | Description |
|------|------|-------------|
| `point` | 16 bytes | `(x, y)` |
| `line` | 24 bytes | `{A, B, C}` (Ax + By + C = 0) |
| `lseg` | 32 bytes | line segment `((x1,y1),(x2,y2))` |
| `box` | 32 bytes | rectangle `((x1,y1),(x2,y2))` |
| `path` | 16+16n bytes | open or closed path |
| `polygon` | 16+16n bytes | polygon (similar to closed path) |
| `circle` | 24 bytes | `<(x,y),r>` |

### Network Address Types

| Type | Size | Description |
|------|------|-------------|
| `cidr` | 7 or 19 bytes | IPv4 or IPv6 network |
| `inet` | 7 or 19 bytes | IPv4 or IPv6 host and network |
| `macaddr` | 6 bytes | MAC address |
| `macaddr8` | 8 bytes | MAC address (EUI-64) |

### Bit String Types

- `bit(n)` — fixed-length bit string
- `bit varying(n)` / `varbit(n)` — variable-length bit string

### Text Search Types

- `tsvector` — sorted list of distinct lexemes: `'a:1 b:2'::tsvector`
- `tsquery` — stores lexemes to search for: `'fat & rat'::tsquery`

### UUID Type

- `uuid` — 128-bit identifier: `6b8a1e00-3f4a-11e9-b210-d663bd873d93`

### XML Type

- `xml` — stores XML data, input validation
- Functions: `xmlparse`, `xmlserialize`, `xpath`, `xmlexists`, `xmltable`

### JSON Types

- `json` — stored as text, preserves input formatting
- `jsonb` — binary representation, faster processing, indexable, no whitespace preservation

```sql
-- JSONB indexing
CREATE INDEX idx ON items USING GIN (jsonb_col);

-- Containment operator
SELECT * FROM items WHERE jsonb_col @> '{"tags": ["food"]}';

-- Key existence
SELECT * FROM items WHERE jsonb_col ? 'tags';

-- jsonpath type
SELECT * FROM items WHERE jsonb_col @? '$.tags[*] ? (@ == "food")';
```

### Arrays

```sql
CREATE TABLE sal_emp (
    name      TEXT,
    pay_by_quarter  INTEGER[],
    schedule        TEXT[][]
);

INSERT INTO sal_emp VALUES ('Bill', '{10000, 10000, 10000, 10000}',
    '{{"meeting", "lunch"}, {"training", "presentation"}}');

-- Accessing arrays
SELECT pay_by_quarter[1] FROM sal_emp WHERE name = 'Bill';
SELECT schedule[1][2] FROM sal_emp WHERE name = 'Bill';

-- Array functions
SELECT array_append(ARRAY[1,2], 3);     -- {1,2,3}
SELECT array_prepend(1, ARRAY[2,3]);    -- {1,2,3}
SELECT array_cat(ARRAY[1,2], ARRAY[3,4]); -- {1,2,3,4}
SELECT array_length(ARRAY[1,2,3], 1);   -- 3
SELECT unnest(ARRAY[1,2,3]);            -- 1\n2\n3
```

### Composite Types

```sql
CREATE TYPE inventory_item AS (
    name TEXT,
    supplier_id INTEGER,
    price NUMERIC
);

CREATE TABLE on_hand (item inventory_item, count INTEGER);
INSERT INTO on_hand VALUES (ROW('fuzzy dice', 42, 1.99), 1000);
SELECT (item).name FROM on_hand;
```

### Range Types

Built-in ranges: `int4range`, `int8range`, `numrange`, `tsrange`, `tstzrange`, `daterange`

```sql
SELECT int4range(1, 10);  -- [1,10)
SELECT '[1,10]'::int4range;  -- [1,11) (inclusive upper bound converted)
SELECT daterange('2024-01-01', '2024-12-31');

-- Operators
SELECT int4range(1,5) && int4range(3,7);  -- overlap: true
SELECT int4range(1,5) @> 3;  -- contains: true
SELECT int4range(1,5) + int4range(3,7);  -- union: [1,7)
```

### Domain Types

```sql
CREATE DOMAIN posint AS INTEGER CHECK (VALUE > 0);
CREATE TABLE mytable (id posint);
```

### Other Types

- `oid` — object identifier (4-byte unsigned integer)
- `pg_lsn` — Log Sequence Number
- Pseudo-types: `any`, `anyelement`, `anyarray`, `anyenum`, `anyrange`, `void`, `trigger`, `language_handler`, `internal`, `cstring`, `record`

## Data Definition (DDL)

### Table Basics

```sql
CREATE TABLE products (
    product_no    INTEGER,
    name          TEXT,
    price         NUMERIC
);
```

### Default Values

```sql
CREATE TABLE products (
    product_no    INTEGER,
    name          TEXT,
    price         NUMERIC DEFAULT 9.99
);
```

### Identity Columns

```sql
CREATE TABLE products (
    product_no    INTEGER GENERATED ALWAYS AS IDENTITY,
    name          TEXT
);

-- Or BY DEFAULT (allows manual override)
CREATE TABLE products (
    product_no    INTEGER GENERATED BY DEFAULT AS IDENTITY,
    name          TEXT
);
```

### Generated Columns

```sql
CREATE TABLE products (
    width   INTEGER,
    height  INTEGER,
    area    INTEGER GENERATED ALWAYS AS (width * height) STORED
);
```

### Constraints

```sql
CREATE TABLE products (
    product_no    INTEGER CONSTRAINT product_no_pk PRIMARY KEY,
    name          TEXT CONSTRAINT name_notnull NOT NULL,
    price         NUMERIC CONSTRAINT price_positive CHECK (price > 0),
    category      TEXT NOT NULL DEFAULT 'misc',
    UNIQUE (name),
    -- Foreign key
    supplier_id   INTEGER REFERENCES suppliers(supplier_id)
        ON DELETE CASCADE ON UPDATE SET NULL,
    -- Exclusion constraint
    EXCLUDE USING GIST (room WITH =, during WITH &&)
);
```

### System Columns

- `tableoid` — OID of table containing row
- `xmin` — transaction ID of inserting transaction
- `cmin` — command identifier within inserting transaction
- `xmax` — transaction ID of deleting/locking transaction
- `cmax` — command identifier within deleting transaction
- `ctid` — physical location of row within table (page, offset)
- `oid` — object identifier (only if table created WITH OIDS, deprecated)

### Modifying Tables (ALTER TABLE)

```sql
ALTER TABLE products ADD COLUMN description TEXT;
ALTER TABLE products DROP COLUMN description;
ALTER TABLE products ADD CONSTRAINT name_unique UNIQUE (name);
ALTER TABLE products DROP CONSTRAINT name_unique;
ALTER TABLE products ALTER COLUMN price SET DEFAULT 0;
ALTER TABLE products ALTER COLUMN price TYPE NUMERIC(10,2);
ALTER TABLE products RENAME COLUMN product_no TO id;
ALTER TABLE products RENAME TO inventory;
```

### Privileges

```sql
GRANT SELECT, INSERT, UPDATE ON products TO webuser;
GRANT ALL PRIVILEGES ON products TO admin;
REVOKE INSERT ON products FROM webuser;
GRANT USAGE ON SCHEMA myschema TO webuser;
GRANT CREATE ON DATABASE mydb TO developer;
```

### Row Security Policies

```sql
CREATE POLICY emp_policy ON employees
    FOR SELECT
    USING (manager = current_user);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
```

### Schemas

```sql
CREATE SCHEMA myschema;
CREATE TABLE myschema.mytable (...);

-- Search path
SET search_path TO myschema, public;
SHOW search_path;

-- Public schema
-- Default schema, all users have CREATE privilege by default
```

### Inheritance

```sql
CREATE TABLE persons (name TEXT, city TEXT);
CREATE TABLE employees (salary NUMERIC) INHERITS (persons);
-- Caveats: no unique constraints across parent+children, CHECK constraints inherited
```

### Table Partitioning

```sql
-- Declarative partitioning
CREATE TABLE measurement (
    city_id     INT NOT NULL,
    logdate     DATE NOT NULL,
    peaktemp    INT,
    unitsales   INT
) PARTITION BY RANGE (logdate);

CREATE TABLE measurement_y2024 PARTITION OF measurement
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE measurement_y2025 PARTITION OF measurement
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- List partitioning
CREATE TABLE cities PARTITION BY LIST (region);
CREATE TABLE cities_east PARTITION OF cities FOR VALUES IN ('NY', 'MA', 'PA');

-- Hash partitioning
CREATE TABLE orders PARTITION BY HASH (order_id);
CREATE TABLE orders_p1 PARTITION OF orders FOR VALUES WITH (MODULUS 4, REMAINDER 0);
```

### Foreign Data

```sql
CREATE EXTENSION postgres_fdw;
CREATE SERVER foreign_server
    FOREIGN DATA WRAPPER postgres_fdw
    OPTIONS (host 'remote_host', dbname 'remote_db', port '5432');
CREATE USER MAPPING FOR local_user
    SERVER foreign_server
    OPTIONS (user 'remote_user', password 'secret');
CREATE FOREIGN TABLE foreign_table (id INT, name TEXT)
    SERVER foreign_server
    OPTIONS (schema_name 'public', table_name 'remote_table');
```

## Data Manipulation (DML)

### INSERT

```sql
INSERT INTO products VALUES (1, 'Cheese', 9.99);
INSERT INTO products (name, price) VALUES ('Cheese', 9.99);
INSERT INTO products SELECT * FROM temp_products;
INSERT INTO products VALUES (1, 'Cheese', 9.99)
    ON CONFLICT (product_no) DO UPDATE SET price = EXCLUDED.price;
INSERT INTO products VALUES (1, 'Cheese', 9.99)
    ON CONFLICT (product_no) DO NOTHING;
-- MERGE
MERGE INTO target t USING source s ON t.id = s.id
    WHEN MATCHED THEN UPDATE SET name = s.name
    WHEN NOT MATCHED THEN INSERT VALUES (s.id, s.name);
```

### UPDATE

```sql
UPDATE products SET price = 10 WHERE product_no = 1;
UPDATE products SET price = price * 1.10;
UPDATE products SET price = sub.new_price
    FROM (SELECT id, new_price FROM temp) sub
    WHERE products.product_no = sub.id;
```

### DELETE

```sql
DELETE FROM products WHERE product_no = 1;
DELETE FROM products USING suppliers WHERE products.supplier_id = suppliers.id AND suppliers.name = 'Acme';
```

### RETURNING

```sql
INSERT INTO products VALUES (DEFAULT, 'Cheese', 9.99) RETURNING product_no;
UPDATE products SET price = 10 WHERE product_no = 1 RETURNING *;
DELETE FROM products WHERE price < 5 RETURNING name, price;
```

## Queries

### Table Expressions

```sql
-- FROM clause with joins
SELECT * FROM t1 CROSS JOIN t2;
SELECT * FROM t1 INNER JOIN t2 ON t1.id = t2.id;
SELECT * FROM t1 LEFT JOIN t2 ON t1.id = t2.id;
SELECT * FROM t1 RIGHT JOIN t2 ON t1.id = t2.id;
SELECT * FROM t1 FULL JOIN t2 ON t1.id = t2.id;

-- WHERE clause
SELECT * FROM weather WHERE temp_lo < 40 AND temp_hi > 50;

-- GROUP BY and HAVING
SELECT city, count(*), max(temp_lo) FROM weather
    GROUP BY city HAVING count(*) > 1;

-- GROUPING SETS, CUBE, ROLLUP
SELECT brand, size, sum(sales) FROM items GROUP BY GROUPING SETS ((brand), (size), ());
SELECT brand, size, sum(sales) FROM items GROUP BY CUBE (brand, size);
SELECT brand, size, sum(sales) FROM items GROUP BY ROLLUP (brand, size);
```

### Select Lists

```sql
SELECT a, b AS label, a + b AS sum FROM t;
SELECT DISTINCT city FROM weather;
SELECT DISTINCT ON (city) city, temp_lo, date FROM weather ORDER BY city, date DESC;
```

### Combining Queries

```sql
SELECT * FROM t1 UNION SELECT * FROM t2;
SELECT * FROM t1 UNION ALL SELECT * FROM t2;
SELECT * FROM t1 INTERSECT SELECT * FROM t2;
SELECT * FROM t1 EXCEPT SELECT * FROM t2;
```

### Sorting

```sql
SELECT * FROM weather ORDER BY city ASC, temp_lo DESC;
SELECT * FROM weather ORDER BY 1, 2;  -- by column position
```

### LIMIT and OFFSET

```sql
SELECT * FROM weather LIMIT 10;
SELECT * FROM weather LIMIT 10 OFFSET 5;
SELECT * FROM weather FETCH FIRST 10 ROWS ONLY;
```

### VALUES Lists

```sql
VALUES (1, 'one'), (2, 'two'), (3, 'three');
SELECT * FROM (VALUES (1, 'one'), (2, 'two')) AS t(num, label);
```

### WITH Queries (Common Table Expressions)

```sql
-- Non-recursive CTE
WITH regional_sales AS (
    SELECT region, SUM(amount) AS total_sales FROM orders GROUP BY region
)
SELECT region, sum FROM regional_sales WHERE sum > (SELECT avg(sum) FROM regional_sales);

-- Recursive CTE
WITH RECURSIVE included_parts(sub_part, part, quantity) AS (
    SELECT sub_part, part, quantity FROM parts WHERE part = 'product'
    UNION ALL
    SELECT p.sub_part, p.part, p.quantity
    FROM included_parts pr, parts p
    WHERE p.part = pr.sub_part
)
SELECT * FROM included_parts;

-- Data-modifying statements in WITH
WITH moved AS (
    DELETE FROM products WHERE outdated = true RETURNING *
)
INSERT INTO archive SELECT * FROM moved;

-- CTE materialization control
WITH cte AS MATERIALIZED (SELECT * FROM big_table WHERE complex_condition)
SELECT * FROM cte WHERE cte.col = 1;
```

## Functions and Operators

### Logical Operators

- `AND`, `OR`, `NOT`
- `NULL` handling: `NULL AND true` = `NULL`, `NULL OR true` = `true`

### Comparison Operators

| Operator | Description |
|----------|-------------|
| `<` | less than |
| `>` | greater than |
| `<=` | less than or equal |
| `>=` | greater than or equal |
| `=` | equal |
| `<>` / `!=` | not equal |
| `IS NULL` / `IS NOT NULL` | null test |
| `IS DISTINCT FROM` | not equal, treating NULL as a comparable value |
| `IS NOT DISTINCT FROM` | equal, treating NULL as a comparable value |
| `BETWEEN` | between a range |
| `NOT BETWEEN` | not between a range |
| `IN` | equal to any value in a list |
| `NOT IN` | not equal to any value in a list |
| `LIKE` | simple pattern matching |
| `ILIKE` | case-insensitive LIKE |
| `SIMILAR TO` | SQL regex matching |
| `~` | POSIX regex match (case-sensitive) |
| `~*` | POSIX regex match (case-insensitive) |
| `!~` | POSIX regex non-match (case-sensitive) |
| `!~*` | POSIX regex non-match (case-insensitive) |

### Mathematical Functions

`abs`, `cbrt`, `ceil`/`ceiling`, `degrees`, `div`, `exp`, `floor`, `ln`, `log`, `mod`, `pi`, `power`, `radians`, `round`, `sign`, `sqrt`, `trunc`, `random`, `setseed`, `gcd`, `lcm`, `factorial`

### String Functions

`length`, `char_length`, `octet_length`, `bit_length`, `position`, `substring`, `substr`, `trim`, `ltrim`, `rtrim`, `btrim`, `lpad`, `rpad`, `left`, `right`, `replace`, `translate`, `split_part`, `concat`, `concat_ws`, `format`, `repeat`, `reverse`, `ascii`, `chr`, `starts_with`, `initcap`, `lower`, `upper`, `overlay`, `strpos`

```sql
-- format() function
SELECT format('Hello %s, your balance is %s', name, balance);
```

### Date/Time Functions

`age`, `current_date`, `current_time`, `current_timestamp`, `now`, `transaction_timestamp`, `statement_timestamp`, `clock_timestamp`, `date_part`/`extract`, `date_trunc`, `date_bin`, `isfinite`, `justify_days`, `justify_hours`, `justify_interval`, `make_date`, `make_interval`, `make_time`, `make_timestamp`, `make_timestamptz`, `now`, `to_char`, `to_date`, `to_number`, `to_timestamp`

```sql
-- EXTRACT / date_part
SELECT EXTRACT(YEAR FROM timestamp '2024-03-15 10:30:00');  -- 2024
SELECT date_part('month', timestamp '2024-03-15');  -- 3

-- date_trunc
SELECT date_trunc('hour', timestamp '2024-03-15 10:33:15');  -- 2024-03-15 10:00:00

-- date_bin (PostgreSQL 14+)
SELECT date_bin('15 minutes', timestamp '2024-03-15 10:37:00', timestamp '2001-01-01');
-- 2024-03-15 10:30:00

-- AT TIME ZONE
SELECT timestamp '2024-03-15 10:00:00' AT TIME ZONE 'America/New_York';
```

### Conditional Expressions

```sql
-- CASE
SELECT CASE WHEN x < 0 THEN 'negative' WHEN x > 0 THEN 'positive' ELSE 'zero' END;

-- COALESCE
SELECT COALESCE(col1, col2, 'default');

-- NULLIF
SELECT NULLIF(value, 0);  -- returns NULL if value = 0

-- GREATEST and LEAST
SELECT GREATEST(1, 2, 3);  -- 3
SELECT LEAST(1, 2, 3);     -- 1
```

### JSON Functions

```sql
-- Processing
SELECT jsonb_build_object('name', 'Alice', 'age', 30);
SELECT jsonb_agg(name) FROM users;
SELECT jsonb_object_agg(name, value) FROM kv;

-- Accessing
SELECT data->'name' FROM items;       -- returns jsonb
SELECT data->>'name' FROM items;      -- returns text
SELECT data#>'{a,b}' FROM items;      -- path accessor
SELECT data#>>'{a,b}' FROM items;     -- path accessor as text

-- SQL/JSON path
SELECT jsonb_path_query(data, '$.items[*] ? (@.price < 100)');
SELECT jsonb_path_exists(data, '$.tags[*] ? (@ == "food")');
SELECT jsonb_path_match(data, '$.active ? (@ == true)');

-- JSON_TABLE
SELECT * FROM JSON_TABLE(data, '$.items[*]'
    COLUMNS (
        id INT PATH '$.id',
        name TEXT PATH '$.name',
        price NUMERIC PATH '$.price'
    )
);
```

### Sequence Functions

```sql
SELECT nextval('my_sequence');
SELECT currval('my_sequence');
SELECT lastval();
SELECT setval('my_sequence', 42);
SELECT setval('my_sequence', 42, false);  -- not yet used
```

### Array Functions

`array_append`, `array_prepend`, `array_cat`, `array_ndims`, `array_dims`, `array_fill`, `array_length`, `array_lower`, `array_upper`, `array_remove`, `array_replace`, `array_to_string`, `string_to_array`, `unnest`, `array_agg`, `array_position`, `array_positions`, `array_contains`

### Aggregate Functions

`avg`, `count`, `max`, `min`, `sum`, `bool_and`/`every`, `bool_or`, `array_agg`, `string_agg`, `json_agg`, `jsonb_agg`, `json_object_agg`, `jsonb_object_agg`, `percentile_cont`, `percentile_disc`, `mode`, `rank`, `dense_rank`, `percent_rank`, `cume_dist`, `first_value`, `last_value`, `nth_value`, `lag`, `lead`, `ntile`, `row_number`, `corr`, `covar_pop`, `covar_samp`, `regr_avgx`, `regr_avgy`, `regr_count`, `regr_intercept`, `regr_r2`, `regr_slope`, `regr_sxx`, `regr_sxy`, `regr_syy`, `stddev`, `stddev_pop`, `stddev_samp`, `variance`, `var_pop`, `var_samp`, `grouping`, `ordered_set_agg`

### Subquery Expressions

`EXISTS`, `IN`, `NOT IN`, `ANY`/`SOME`, `ALL`, `UNIQUE`

## Type Conversion

- `CAST(x AS type)` or `x::type`
- Implicit casts via assignment
- `CREATE CAST` for custom casts
- Common casts: `text::integer`, `text::date`, `text::timestamp`, `integer::text`

## Indexes

### Index Types

- **B-Tree** — default, supports `=`, `<`, `>`, `<=`, `>=`, `BETWEEN`, `IN`, `IS NULL`, `LIKE` (prefix only), pattern matching
- **Hash** — only supports `=` comparisons, not for replication
- **GiST** — infrastructure for custom index strategies; used for geometric, range, full text search, trigram
- **SP-GiST** — space-partitioned GiST; for non-balanced tree structures
- **GIN** — inverted indexes; best for arrays, JSONB, full text search; fast lookup, slow update
- **BRIN** — block range index; very small, good for naturally ordered large tables

```sql
-- B-Tree (default)
CREATE INDEX idx_name ON products (name);
CREATE UNIQUE INDEX idx_unique_name ON products (name);

-- Hash
CREATE INDEX idx_hash ON products USING HASH (name);

-- GIN (for JSONB, arrays, full text search)
CREATE INDEX idx_gin ON products USING GIN (tags);
CREATE INDEX idx_fts ON documents USING GIN (to_tsvector('english', body));

-- GiST (for geometric, range types)
CREATE INDEX idx_gist ON events USING GIST (during);

-- BRIN (for large naturally-ordered tables)
CREATE INDEX idx_brin ON log (timestamp);
```

### Index Features

```sql
-- Multicolumn index
CREATE INDEX idx_multi ON products (category, price);

-- Index on expression
CREATE INDEX idx_lower_name ON products (lower(name));

-- Partial index
CREATE INDEX idx_active ON products (name) WHERE active = true;

-- Covering index (INCLUDE)
CREATE INDEX idx_covering ON products (id) INCLUDE (name, price);

-- Index with operator class
CREATE INDEX idx_collate ON products (name COLLATE "C");
```

### Examining Index Usage

```sql
EXPLAIN SELECT * FROM products WHERE name = 'Cheese';
EXPLAIN ANALYZE SELECT * FROM products WHERE name = 'Cheese';
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM products WHERE name = 'Cheese';
```

## Full Text Search

### Basic Text Matching

```sql
-- to_tsvector and to_tsquery
SELECT to_tsvector('english', 'a fat cat sat on a mat');
-- 'cat':2 'fat':1 'mat':5 'sat':3

SELECT to_tsquery('english', 'fat & rat');
-- 'fat' & 'rat'

SELECT plainto_tsquery('english', 'fat rat');
-- 'fat' & 'rat'

SELECT phraseto_tsquery('english', 'fat cat');
-- 'fat' <-> 'cat'

-- Matching
SELECT * FROM documents
    WHERE to_tsvector('english', body) @@ to_tsquery('english', 'fat & rat');
```

### Tables and Indexes

```sql
-- GIN index for fast full text search
CREATE INDEX idx_fts ON documents USING GIN (to_tsvector('english', body));

-- tsvector column with trigger
CREATE TABLE docs (id SERIAL PRIMARY KEY, body TEXT, tsv tsvector);
CREATE TRIGGER tsv_update BEFORE INSERT OR UPDATE ON docs
    FOR EACH ROW EXECUTE FUNCTION tsvector_update_trigger(tsv, 'pg_catalog.english', body);
CREATE INDEX idx_tsv ON docs USING GIN (tsv);
```

### Controlling Text Search

- **Parsing** — `to_tsvector`, `ts_parse`, `ts_headline`
- **Ranking** — `ts_rank`, `ts_rank_cd`
- **Highlighting** — `ts_headline`
- **Dictionaries** — stop words, simple, synonym, thesaurus, Ispell, Snowball (stemming)
- **Configurations** — `pg_catalog.english`, `pg_catalog.simple`, custom configurations

```sql
-- Ranking
SELECT title, ts_rank(tsv, query) AS rank
FROM docs, to_tsquery('english', 'fat & rat') query
WHERE tsv @@ query ORDER BY rank DESC;

-- Highlighting
SELECT ts_headline('english', body, to_tsquery('english', 'fat & rat'))
FROM docs WHERE tsv @@ to_tsquery('english', 'fat & rat');
```

## Concurrency Control (MVCC)

### Transaction Isolation Levels

| Level | Dirty Read | Non-Repeatable Read | Phantom Read | Serialization Anomaly |
|-------|-----------|--------------------|--------------|-----------------------|
| Read Uncommitted | Not possible | Possible | Possible | Possible |
| Read Committed (default) | Not possible | Possible | Possible | Possible |
| Repeatable Read | Not possible | Not possible | Not possible in PG | Possible |
| Serializable | Not possible | Not possible | Not possible | Not possible |

```sql
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- Or at session level
SET default_transaction_isolation = 'serializable';
```

### Explicit Locking

```sql
-- Table-level locks
LOCK TABLE products IN ACCESS EXCLUSIVE MODE;

-- Row-level locks (via SELECT ... FOR ...)
SELECT * FROM products WHERE id = 1 FOR UPDATE;           -- lock for update
SELECT * FROM products WHERE id = 1 FOR NO KEY UPDATE;    -- lock, allow key updates
SELECT * FROM products WHERE id = 1 FOR SHARE;            -- shared lock
SELECT * FROM products WHERE id = 1 FOR KEY SHARE;        -- minimal shared lock

-- NOWAIT option
SELECT * FROM products WHERE id = 1 FOR UPDATE NOWAIT;

-- SKIP LOCKED option
SELECT * FROM queue ORDER BY priority FOR UPDATE SKIP LOCKED LIMIT 10;
```

### Advisory Locks

```sql
-- Application-level locks
SELECT pg_advisory_lock(12345);
SELECT pg_advisory_unlock(12345);
SELECT pg_advisory_xact_lock(12345);  -- released at transaction end
SELECT pg_try_advisory_lock(12345);
```

### Deadlocks

PostgreSQL automatically detects deadlocks and aborts one transaction. Use consistent lock ordering to prevent deadlocks.

## Performance Tips

### Using EXPLAIN

```sql
EXPLAIN SELECT * FROM products WHERE name = 'Cheese';
EXPLAIN ANALYZE SELECT * FROM products WHERE name = 'Cheese';
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT * FROM products WHERE name = 'Cheese';
```

Key plan node types: `Seq Scan`, `Index Scan`, `Index Only Scan`, `Bitmap Heap Scan`, `Bitmap Index Scan`, `Hash Join`, `Nested Loop`, `Merge Join`, `Sort`, `Aggregate`, `HashAggregate`, `Gather`, `Gather Merge`, `Limit`, `WindowAgg`

### Statistics Used by the Planner

- **Single-column statistics** — `pg_statistic` / `pg_stats` view, most common values, histogram bounds, correlation
- **Extended statistics** — `CREATE STATISTICS` for multivariate statistics:
  - `DEPENDENCIES` — functional dependencies between columns
  - `MCV` (most common values) — multivariate most common values
  - `NDISTINCT` — distinct counts for groups of columns

```sql
CREATE STATISTICS stats_dep (dependencies) ON col1, col2 FROM mytable;
CREATE STATISTICS stats_mcv (mcv) ON col1, col2 FROM mytable;
CREATE STATISTICS stats_ndistinct (ndistinct) ON col1, col2 FROM mytable;
ANALYZE mytable;
```

### Populating a Database

- Use `COPY` instead of `INSERT` for bulk data
- Disable autocommit / use transactions
- Remove indexes and foreign keys temporarily
- Increase `maintenance_work_mem` and `max_wal_size`
- Disable WAL archival and streaming replication during bulk load
- Run `ANALYZE` afterwards

### Non-Durable Settings

For maximum performance when durability is not critical:
- `synchronous_commit = off`
- `fsync = off`
- `full_page_writes = off`

## Parallel Query

PostgreSQL can use multiple CPUs for query execution.

- **Parallel Scans** — parallel sequential scan, parallel index scan, parallel bitmap heap scan
- **Parallel Joins** — parallel hash join, parallel nested loop
- **Parallel Aggregation** — partial aggregation in workers, final aggregation in leader
- **Parallel Append** — for scanning partitions or UNION ALL
- **Configuration** — `max_parallel_workers_per_gather`, `max_parallel_workers`, `min_parallel_table_scan_size`, `min_parallel_index_scan_size`, `parallel_setup_cost`, `parallel_tuple_cost`

```sql
SET max_parallel_workers_per_gather = 4;
SET max_parallel_workers = 8;
```

- **Parallel Safety** — functions labeled `PARALLEL SAFE`, `PARALLEL RESTRICTED`, `PARALLEL UNSAFE`
