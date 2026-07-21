# PostgreSQL 17 Documentation Skill

## Overview

PostgreSQL is a powerful, open source object-relational database system that uses and extends the SQL language combined with many features that safely store and scale the most complicated data workloads. With more than 35 years of active development, PostgreSQL has earned a strong reputation for reliability, feature robustness, and performance.

## Key Benefits

- **ACID-compliant** — full transactional integrity with MVCC
- **Extensible** — custom types, functions, operators, indexes, procedural languages
- **Standards-compliant** — SQL:2023 conformance with extensive extensions
- **Scalable** — parallel queries, partitioning, logical replication, connection pooling
- **Rich type system** — numeric, text, temporal, geometric, network, JSON, arrays, ranges, custom types
- **Full text search** — built-in tsvector/tsquery with dictionaries and ranking
- **Procedural languages** — PL/pgSQL, PL/Tcl, PL/Perl, PL/Python, and more
- **High availability** — streaming replication, log-shipping, hot standby, logical replication

## File Index

| File | Topics |
|------|--------|
| `getting-started.md` | Installation, architecture, tutorial (SQL basics, joins, aggregates, views, foreign keys, transactions, window functions, inheritance) |
| `sql-language.md` | SQL syntax, data types (40+ types), DDL (tables, constraints, schemas, partitioning, inheritance), DML, queries (CTEs, window functions, GROUPING SETS), functions & operators, indexes (B-Tree, Hash, GiST, SP-GiST, GIN, BRIN), full text search, concurrency control (MVCC, isolation levels, locking), performance tips (EXPLAIN, statistics), parallel query |
| `server-admin.md` | Server configuration (200+ parameters), client authentication (pg_hba.conf, 10+ auth methods), database roles & privileges, managing databases, localization, maintenance (VACUUM, ANALYZE), backup & restore (pg_dump, PITR, file system), high availability & replication (streaming, synchronous, cascading, hot standby), monitoring (pg_stat_activity, pg_stat_statements, progress reporting), WAL, logical replication (publications, subscriptions, row filters), JIT compilation |
| `server-programming.md` | Extending SQL (functions, procedures, aggregates, types, operators, extensions), triggers (row-level, statement-level, INSTEAD OF), event triggers, PL/pgSQL (structure, declarations, control structures, cursors, transaction management, errors), PL/Tcl, PL/Perl, PL/Python, SPI, logical decoding, contrib modules (48 extensions: pg_stat_statements, postgres_fdw, hstore, pgcrypto, pg_trgm, ltree, dblink, citext, unaccent, uuid-ossp, etc.), SQL command reference (140+ commands) |
| `internals-reference.md` | Client interfaces (libpq C API: connection, execution, async, pipeline, COPY, notify, SSL, env vars, .pgpass; large objects; ECPG embedded SQL), internals (architecture, query pipeline, 60+ system catalogs, 36 system views, frontend/backend protocol v3, message types, replication protocol), reference (21 client applications: psql/createdb/pg_dump/etc., 14 server applications: initdb/pg_ctl/postgres/etc.), appendixes (error codes: 30+ classes with common codes, SQL key words: reserved/unreserved, external projects: drivers/ORMs/GUI tools/poolers/HA/monitoring/migration/extensions) |

## Quick Start

```bash
# Install (macOS)
brew install postgresql@17

# Install (Ubuntu/Debian)
sudo apt install postgresql-17

# Install (Windows)
# Download installer from https://www.postgresql.org/download/windows/

# Start the server
pg_ctl -D /usr/local/var/postgres start

# Create a database
createdb mydb

# Connect with psql
psql mydb

# Basic SQL
CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE);
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
SELECT * FROM users;
```

## Documentation Links

- [PostgreSQL 17 Docs](https://www.postgresql.org/docs/17/)
- [Tutorial](https://www.postgresql.org/docs/17/tutorial.html)
- [SQL Language](https://www.postgresql.org/docs/17/sql.html)
- [Server Administration](https://www.postgresql.org/docs/17/admin.html)
- [Client Interfaces](https://www.postgresql.org/docs/17/client-interfaces.html)
- [Server Programming](https://www.postgresql.org/docs/17/server-programming.html)
- [Reference (SQL Commands)](https://www.postgresql.org/docs/17/sql-commands.html)
- [Internals](https://www.postgresql.org/docs/17/internals.html)
- [Appendixes](https://www.postgresql.org/docs/17/appendixes.html)
