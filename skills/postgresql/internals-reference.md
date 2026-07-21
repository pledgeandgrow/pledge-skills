# PostgreSQL Client Interfaces, Internals & Reference

## Client Interfaces

### libpq — C Library

libpq is the C application programmer's interface to PostgreSQL. It is a set of library functions that allow client programs to pass queries to the PostgreSQL backend server and receive results.

#### Database Connection Control Functions

```c
#include <libpq-fe.h>

// Connect to database
PGconn *conn = PQconnectdb("host=localhost port=5432 dbname=mydb user=postgres password=secret");

// Connect with parameters
PGconn *conn = PQconnectdbParams(
    (const char *[]){"host", "port", "dbname", "user", NULL},
    (const char *[]){"localhost", "5432", "mydb", "postgres", NULL},
    0  /* expand_dbname */
);

// Check connection status
ConnStatusType status = PQstatus(conn);
if (status != CONNECTION_OK) {
    fprintf(stderr, "Connection failed: %s", PQerrorMessage(conn));
}

// Close connection
PQfinish(conn);
```

**Connection String Parameters:**
`host`, `hostaddr`, `port`, `dbname`, `user`, `password`, `passfile`, `channel_binding`, `connect_timeout`, `client_encoding`, `options`, `application_name`, `fallback_application_name`, `keepalives`, `keepalives_idle`, `keepalives_interval`, `keepalives_count`, `tcp_user_timeout`, `sslmode` (`disable`/`allow`/`prefer`/`require`/`verify-ca`/`verify-full`), `sslcompression`, `sslcert`, `sslkey`, `sslpassword`, `sslrootcert`, `sslcrl`, `sslcrldir`, `requirepeer`, `krbsrvname`, `gsslib`, `gssdelegation`, `service`, `target_session_attrs` (`any`/`read-write`/`read-only`/`primary`/`standby`/`prefer-standby`)

#### Connection Status Functions

```c
const char *db = PQdb(conn);           // database name
const char *user = PQuser(conn);       // user name
const char *host = PQhost(conn);       // host name
const char *port = PQport(conn);       // port
ConnStatusType status = PQstatus(conn);  // CONNECTION_OK / CONNECTION_BAD
int proto = PQprotocolVersion(conn);   // 3 for v3 protocol
int server_ver = PQserverVersion(conn); // server version as integer
char *ssl = PQgetssl(conn);            // SSL structure (deprecated)
char *ssl = PQsslStruct(conn, "OpenSSL"); // SSL structure
const char *info = PQparameterStatus(conn, "server_version");
```

#### Command Execution Functions

```c
// Synchronous query execution
PGresult *res = PQexec(conn, "SELECT * FROM users");
PGresult *res = PQexecParams(conn,
    "SELECT * FROM users WHERE id = $1",
    1,              /* nParams */
    NULL,           /* paramTypes */
    (const char *[]){"42"},  /* paramValues */
    NULL,           /* paramLengths */
    NULL,           /* paramFormats */
    0               /* resultFormat: 0=text, 1=binary */
);

// Prepared statements
PGresult *res = PQprepare(conn, "stmt", "SELECT * FROM users WHERE id = $1", 1, NULL);
PGresult *res = PQexecPrepared(conn, "stmt", 1, (const char *[]){"42"}, NULL, NULL, 0);

// Check result status
ExecStatusType status = PQresultStatus(res);
if (status == PGRES_TUPLES_OK) {
    int rows = PQntuples(res);
    int cols = PQnfields(res);
    char *val = PQgetvalue(res, 0, 0);
    int isnull = PQgetisnull(res, 0, 0);
}

// Clear result
PQclear(res);
```

**Result Status Codes:** `PGRES_EMPTY_QUERY`, `PGRES_COMMAND_OK`, `PGRES_TUPLES_OK`, `PGRES_COPY_OUT`, `PGRES_COPY_IN`, `PGRES_BAD_RESPONSE`, `PGRES_NONFATAL_ERROR`, `PGRES_FATAL_ERROR`, `PGRES_COPY_BOTH`, `PGRES_SINGLE_TUPLE`, `PGRES_PIPELINE_SYNC`, `PGRES_PIPELINE_ABORTED`

#### Asynchronous Command Processing

```c
// Submit query without waiting for result
int ret = PQsendQuery(conn, "SELECT * FROM users");
int ret = PQsendQueryParams(conn, "SELECT * FROM users WHERE id = $1", 1, NULL,
    (const char *[]){"42"}, NULL, NULL, 0);

// Check if result is ready
int ready = PQconsumeInput(conn);
int busy = PQisBusy(conn);

// Get result
PGresult *res = PQgetResult(conn);

// Non-blocking connection
int ret = PQconnectStart(conninfo);
PostgresPollingStatusType poll = PQconnectPoll(conn);
```

#### Pipeline Mode

```c
// Enter pipeline mode
int ret = PQenterPipelineMode(conn);

// Send multiple queries without waiting
PQsendQueryParams(conn, "INSERT INTO logs VALUES($1)", 1, NULL, ...);
PQsendQueryParams(conn, "INSERT INTO logs VALUES($1)", 1, NULL, ...);

// Sync pipeline
PQpipelineSync(conn);

// Get results for each query
while ((res = PQgetResult(conn)) != NULL) {
    /* process result */
    PQclear(res);
}

// Exit pipeline mode
PQexitPipelineMode(conn);
```

#### Canceling Queries

```c
PGcancel *cancel = PQgetCancel(conn);
char errbuf[256];
int ret = PQcancel(cancel, errbuf, sizeof(errbuf));
PQfreeCancel(cancel);
```

#### Asynchronous Notification (LISTEN/NOTIFY)

```c
// After executing LISTEN, check for notifications
int ret = PQconsumeInput(conn);
PGnotify *notify = PQnotifies(conn);
if (notify) {
    printf("Async notification: relname=%s, be_pid=%d, extra=%s\n",
           notify->relname, notify->be_pid, notify->extra);
    PQfreemem(notify);
}
```

#### COPY Command Functions

```c
// Start COPY
PGresult *res = PQexec(conn, "COPY mytable FROM STDIN");
if (PQresultStatus(res) == PGRES_COPY_IN) {
    // Send data
    const char *data = "1\tAlice\n2\tBob\n";
    int ret = PQputCopyData(conn, data, strlen(data));
    // End COPY
    int ret = PQputCopyEnd(conn, NULL);  /* NULL = success, error msg = failure */
}
```

#### Environment Variables

`PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`, `PGPASSFILE`, `PGSERVICE`, `PGSERVICEFILE`, `PGREALM`, `PGOPTIONS`, `PGAPPNAME`, `PGSSLMODE`, `PGSSLCERT`, `PGSSLKEY`, `PGSSLROOTCERT`, `PGSSLCRL`, `PGREQUIRESSL`, `PGCHANNELBINDING`, `PGCONNECT_TIMEOUT`, `PGCLIENTENCODING`, `PGDATESTYLE`, `PGTZ`, `PGSYSCONFDIR`, `PGLOCALEDIR`

#### Password File (.pgpass)

```
# Format: hostname:port:database:username:password
localhost:5432:mydb:postgres:secret
*:5432:*:*:mypassword
```

#### SSL Support

```c
// Check SSL status
int ssl_in_use = PQsslInUse(conn);
const char *cipher = PQsslAttribute(conn, "cipher");
const char *protocol = PQsslAttribute(conn, "protocol");
const char *version = PQsslAttribute(conn, "version");
```

### Large Objects

PostgreSQL provides a large object mechanism for storing data that cannot fit in a normal row.

```sql
-- Server-side functions
SELECT lo_create(0);                    -- create new large object, returns OID
SELECT lo_import('/path/to/file');       -- import file as large object
SELECT lo_export(oid, '/path/to/file');  -- export large object to file
SELECT lo_unlink(oid);                   -- delete large object

-- lo_read, lo_write, lo_lseek, lo_tell, lo_truncate, lo_close
```

```c
/* C API via libpq */
Oid loid = lo_creat(conn, INV_READ | INV_WRITE);
int fd = lo_open(conn, loid, INV_READ | INV_WRITE);
int bytes = lo_write(conn, fd, data, datalen);
int pos = lo_lseek(conn, fd, 0, SEEK_END);
lo_close(conn, fd);
```

### ECPG — Embedded SQL in C

```c
/* Embedded SQL example */
EXEC SQL WHENEVER SQLERROR sqlprint;
EXEC SQL CONNECT TO mydb@localhost AS conn1 USER postgres;
EXEC SQL SELECT name INTO :name FROM users WHERE id = 42;
EXEC SQL INSERT INTO logs VALUES (:message);
EXEC SQL DISCONNECT conn1;
```

**Key ECPG concepts:**
- **Host variables** — C variables shared with SQL, declared in `EXEC SQL BEGIN DECLARE SECTION`
- **Indicator variables** — detect NULL values: `:val INDICATOR :ind`
- **Dynamic SQL** — `EXEC SQL PREPARE`, `EXEC SQL EXECUTE`, `sqlda` descriptors
- **pgtypes library** — C types for numeric, date, timestamp, interval
- **Error handling** — `sqlca` structure, `WHENEVER SQLERROR`, `SQLSTATE` codes
- **Preprocessor** — `ecpg` converts `.pgc` files to `.c` files
- **Cursor operations** — `DECLARE`, `OPEN`, `FETCH`, `CLOSE`
- **Transaction management** — `EXEC SQL COMMIT`, `EXEC SQL ROLLBACK`

## Internals

### Overview of PostgreSQL Internals

PostgreSQL architecture:
- **Postmaster** — main server process, listens for connections, forks backend processes
- **Backend** — per-connection process, handles query parsing, planning, execution
- **Utility processes** — background writer, checkpointer, WAL writer, WAL receiver, autovacuum launcher/workers, stats collector, logical replication launcher/workers, archiver
- **Shared memory** — shared buffer pool, WAL buffer pool, lock tables, process shared structures
- **Local memory** — work_mem, maintenance_work_mem, temp_buffers per backend

### Query Processing Pipeline

1. **Parser** — SQL text → parse tree (gram.y, scan.l)
2. **Analyzer/Rewriter** — parse tree → query tree, apply rules/views
3. **Planner/Optimizer** — query tree → plan tree
4. **Executor** — plan tree → result rows

### System Catalogs

System catalogs are tables where PostgreSQL stores schema metadata. They reside in the `pg_catalog` schema.

**Key System Catalogs:**

| Catalog | Description |
|---------|-------------|
| `pg_aggregate` | Aggregate functions |
| `pg_am` | Access methods (index types) |
| `pg_amop` | Operator entries in opfamilies |
| `pg_amproc` | Support functions for opfamilies |
| `pg_attrdef` | Column default values |
| `pg_attribute` | Table columns |
| `pg_authid` | Roles (authorization identifiers) |
| `pg_auth_members` | Role membership |
| `pg_cast` | Type casts |
| `pg_class` | Tables, indexes, sequences, views, composite types |
| `pg_collation` | Collations |
| `pg_constraint` | Check, unique, primary key, foreign key, exclusion constraints |
| `pg_conversion` | Encoding conversions |
| `pg_database` | Databases within cluster |
| `pg_db_role_setting` | Per-database role settings |
| `pg_default_acl` | Default ACLs for newly created objects |
| `pg_depend` | Dependencies between objects |
| `pg_description` | Comments on database objects |
| `pg_enum` | Enum label values |
| `pg_event_trigger` | Event triggers |
| `pg_extension` | Installed extensions |
| `pg_foreign_data_wrapper` | Foreign data wrappers |
| `pg_foreign_server` | Foreign servers |
| `pg_foreign_table` | Foreign table metadata |
| `pg_index` | Index-specific metadata |
| `pg_inherits` | Table inheritance hierarchy |
| `pg_init_privs` | Initial privileges |
| `pg_language` | Procedural languages |
| `pg_largeobject` | Large object data pages |
| `pg_largeobject_metadata` | Large object metadata |
| `pg_namespace` | Schemas |
| `pg_opclass` | Operator classes for indexes |
| `pg_operator` | Operators |
| `pg_opfamily` | Operator families |
| `pg_parameter_acl` | Configuration parameter ACLs |
| `pg_partitioned_table` | Partitioned table metadata |
| `pg_policy` | Row security policies |
| `pg_proc` | Functions and procedures |
| `pg_publication` | Logical replication publications |
| `pg_publication_namespace` | Schemas in publications |
| `pg_publication_rel` | Tables in publications |
| `pg_range` | Range type metadata |
| `pg_replication_origin` | Replication origins |
| `pg_rewrite` | Query rewrite rules |
| `pg_seclabel` | Security labels |
| `pg_sequence` | Sequence metadata |
| `pg_shdepend` | Shared dependencies |
| `pg_shdescription` | Shared comments |
| `pg_shseclabel` | Shared security labels |
| `pg_statistic` | Planner statistics |
| `pg_statistic_ext` | Extended statistics |
| `pg_statistic_ext_data` | Extended statistics data |
| `pg_subscription` | Logical replication subscriptions |
| `pg_subscription_rel` | Subscription relation states |
| `pg_tablespace` | Tablespaces |
| `pg_transform` | Type transforms |
| `pg_trigger` | Triggers |
| `pg_ts_config` | Text search configurations |
| `pg_ts_dict` | Text search dictionaries |
| `pg_ts_parser` | Text search parsers |
| `pg_ts_template` | Text search templates |
| `pg_type` | Data types |
| `pg_user_mapping` | User mappings for foreign servers |

**Common catalog queries:**

```sql
-- List all tables
SELECT relname, relkind FROM pg_class WHERE relkind IN ('r', 'p') AND relnamespace = 'public'::regnamespace;

-- List all indexes on a table
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'users';

-- List all functions
SELECT proname, prokind FROM pg_proc WHERE pronamespace = 'public'::regnamespace;

-- List all constraints on a table
SELECT conname, contype, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'users'::regclass;

-- List all extensions
SELECT extname, extversion FROM pg_extension;

-- List all roles
SELECT rolname, rolsuper, rolcreaterole, rolcreatedb, rolcanlogin FROM pg_authid;
```

### System Views

System views provide convenient access to commonly used queries on system catalogs and internal server state.

**Key System Views:**

| View | Description |
|------|-------------|
| `pg_available_extensions` | Available extensions |
| `pg_available_extension_versions` | Available extension versions |
| `pg_backend_memory_contexts` | Memory contexts of current backend |
| `pg_config` | Compile-time configuration parameters |
| `pg_cursors` | Currently available cursors |
| `pg_file_settings` | Configuration file contents |
| `pg_group` | Roles with members (compatibility view) |
| `pg_hba_file_rules` | Summary of pg_hba.conf |
| `pg_ident_file_mappings` | Summary of pg_ident.conf |
| `pg_indexes` | Indexes on tables |
| `pg_locks` | Locks held by active processes |
| `pg_matviews` | Materialized views |
| `pg_policies` | Row security policies |
| `pg_prepared_statements` | Prepared statements |
| `pg_prepared_xacts` | Prepared transactions |
| `pg_publication_tables` | Tables in publications |
| `pg_replication_origin_status` | Replication origin progress |
| `pg_replication_slots` | Replication slots |
| `pg_roles` | Database roles (without passwords) |
| `pg_rules` | Rewrite rules |
| `pg_seclabels` | Security labels |
| `pg_sequences` | Sequences |
| `pg_settings` | Configuration parameters |
| `pg_shadow` | Roles with passwords (superuser-only) |
| `pg_shmem_allocations` | Shared memory allocations |
| `pg_stats` | Planner statistics |
| `pg_stats_ext` | Extended statistics |
| `pg_stats_ext_exprs` | Extended statistics on expressions |
| `pg_tables` | Tables |
| `pg_timezone_abbrevs` | Time zone abbreviations |
| `pg_timezone_names` | Time zone names |
| `pg_user` | Database users (compatibility view) |
| `pg_user_mappings` | User mappings |
| `pg_views` | Views |
| `pg_wait_events` | Wait event names and descriptions |

### Frontend/Backend Protocol

PostgreSQL uses a message-based protocol (version 3.0) for communication between clients and servers over TCP/IP or Unix-domain sockets.

**Protocol flow:**
1. **Start-up** — client sends StartupMessage with protocol version and parameters
2. **Authentication** — server requests authentication (AuthenticationOk, AuthenticationCleartextPassword, AuthenticationMD5Password, AuthenticationSASL, AuthenticationSCRAM-SHA-256, etc.)
3. **Simple Query** — client sends Query message, server returns RowDescription, DataRow(s), CommandComplete, ReadyForQuery
4. **Extended Query** — Parse, Bind, Describe, Execute, Sync messages for prepared statements
5. **Pipelining** — multiple extended query cycles before Sync
6. **COPY Operations** — CopyData, CopyDone, CopyFail messages
7. **Termination** — client sends Terminate message

**Key message types:**
- `R` — Authentication request
- `K` — Backend key data
- `S` — Parameter status
- `Z` — Ready for query
- `Q` — Simple query
- `P` — Parse
- `B` — Bind
- `D` — Describe
- `E` — Execute
- `S` — Sync
- `T` — Row description
- `C` — Command complete
- `D` — Data row
- `I` — Empty query response
- `N` — Notice response
- `E` — Error response
- `A` — Notification response
- `W` — Copy data
- `c` — Copy done
- `f` — Copy fail

**Streaming Replication Protocol:** extensions to the wire protocol for physical replication (START_REPLICATION, base backup commands)

**Logical Replication Protocol:** protocol for logical replication (BEGIN, RELATION, INSERT, UPDATE, DELETE, COMMIT messages)

### How PostgreSQL Processes a Query

1. **TCP connection** accepted by postmaster
2. **Backend process** forked
3. **Authentication** via configured method
4. **Query received** and parsed
5. **Rewrite** — views and rules expanded
6. **Planning** — generate optimal execution plan
7. **Execution** — executor processes plan tree
8. **Result sent** to client
9. **Ready for next query**

## Reference: Client Applications

| Command | Description |
|---------|-------------|
| `clusterdb` | Cluster (reorder) tables in a database |
| `createdb` | Create a new database |
| `createuser` | Create a new database role |
| `dropdb` | Remove a database |
| `dropuser` | Remove a database role |
| `ecpg` | Embedded SQL C preprocessor |
| `pg_amcheck` | Check objects in a database for corruption |
| `pg_basebackup` | Take a base backup of a cluster |
| `pgbench` | Benchmark PostgreSQL with TPC-B-like workload |
| `pg_combinebackup` | Combine multiple backups (incremental) |
| `pg_config` | Show PostgreSQL compile-time configuration |
| `pg_dump` | Extract a database into a script file or archive |
| `pg_dumpall` | Extract all databases into a script file |
| `pg_isready` | Check connection status of a PostgreSQL server |
| `pg_receivewal` | Stream WAL changes to files |
| `pg_recvlogical` | Control logical replication decoding |
| `pg_restore` | Restore a database from an archive |
| `pg_verifybackup` | Verify integrity of a base backup |
| `psql` | PostgreSQL interactive terminal |
| `reindexdb` | Rebuild indexes in a database |
| `vacuumdb` | Garbage-collect and analyze a database |

### psql — Interactive Terminal

```bash
# Connect
psql -h host -p 5432 -U user -d mydb
psql "postgresql://user:pass@host:5432/mydb"

# Execute SQL from file
psql -f script.sql mydb

# Execute single command
psql -c "SELECT * FROM users" mydb

# Copy data
psql -c "\copy users FROM 'users.csv' WITH (FORMAT csv, HEADER true)"
```

**Key psql meta-commands:**
- `\d [table]` — describe table, index, sequence, or view
- `\dt [pattern]` — list tables
- `\di [pattern]` — list indexes
- `\dv [pattern]` — list views
- `\df [pattern]` — list functions
- `\dn [pattern]` — list schemas
- `\du [pattern]` — list roles
- `\dx [pattern]` — list extensions
- `\db [pattern]` — list tablespaces
- `\l` — list databases
- `\c dbname` — connect to database
- `\e` — edit query buffer
- `\ef [func]` — edit function definition
- `\i file` — execute commands from file
- `\o file` — send query results to file
- `\pset format` — set output format (aligned, html, latex, csv, etc.)
- `\x` — toggle expanded display
- `\timing` — toggle query timing
- `\echo` — print message
- `\set` — set psql variable
- `\timing on` — show query execution time
- `\password [user]` — change password
- `\h [command]` — SQL command help
- `\?` — psql command help
- `\q` — quit
- `\watch [seconds]` — repeat query at interval

## Reference: Server Applications

| Command | Description |
|---------|-------------|
| `initdb` | Create a new PostgreSQL cluster |
| `pg_archivecleanup` | Clean up WAL archive files |
| `pg_checksums` | Enable/disable/check data checksums |
| `pg_controldata` | Display control information of a cluster |
| `pg_createsubscriber` | Create a logical subscriber from a physical standby |
| `pg_ctl` | Initialize, start, stop, or control a PostgreSQL server |
| `pg_resetwal` | Reset WAL log of a cluster |
| `pg_rewind` | Synchronize a cluster with another copy of the cluster |
| `pg_test_fsync` | Test fastest fsync method |
| `pg_test_timing` | Measure timing overhead |
| `pg_upgrade` | Upgrade cluster to a new major version |
| `pg_waldump` | Print WAL log contents in human-readable form |
| `pg_walsummary` | Summarize WAL contents |
| `postgres` | PostgreSQL server binary |

## Appendix: Error Codes

PostgreSQL error codes follow the SQL standard's SQLSTATE conventions. The first two characters denote an error class; the last three indicate a specific condition.

**Key Error Classes:**

| Class | Description |
|-------|-------------|
| `00` | Successful completion |
| `01` | Warning |
| `02` | No data |
| `08` | Connection exception |
| `09` | Triggered action exception |
| `0A` | Feature not supported |
| `0B` | Invalid transaction initiation |
| `0F` | Locator exception |
| `0L` | Invalid grantor |
| `0P` | Invalid role specification |
| `0Z` | Diagnostics exception |
| `20` | Case not found |
| `21` | Cardinality violation |
| `22` | Data exception |
| `23` | Integrity constraint violation |
| `24` | Invalid cursor state |
| `25` | Invalid transaction state |
| `26` | Invalid SQL statement name |
| `28` | Invalid authorization specification |
| `2B` | Dependent privilege descriptions still exist |
| `2D` | Invalid transaction termination |
| `2F` | SQL routine exception |
| `34` | Invalid cursor name |
| `38` | External routine exception |
| `39` | External routine invocation exception |
| `3B` | Savepoint exception |
| `3D` | Invalid catalog name |
| `3F` | Invalid schema name |
| `40` | Transaction rollback |
| `42` | Syntax error or access rule violation |
| `44` | WITH CHECK OPTION violation |
| `53` | Insufficient resources |
| `54` | Program limit exceeded |
| `55` | Object not in prerequisite state |
| `57` | Operator intervention |
| `58` | System error |
| `72` | Snapshot failure |
| `F0` | Configuration file error |
| `HV` | Foreign Data Wrapper error |
| `P0` | PL/pgSQL error |
| `XX` | Internal error |

**Common Error Codes:**

| Code | Condition Name | Description |
|------|---------------|-------------|
| `00000` | `successful_completion` | No error |
| `23505` | `unique_violation` | Duplicate key value violates unique constraint |
| `23503` | `foreign_key_violation` | Foreign key constraint violation |
| `23502` | `not_null_violation` | NOT NULL constraint violation |
| `23514` | `check_violation` | CHECK constraint violation |
| `23P01` | `exclusion_violation` | Exclusion constraint violation |
| `42P01` | `undefined_table` | Table does not exist |
| `42703` | `undefined_column` | Column does not exist |
| `42883` | `undefined_function` | Function does not exist |
| `42P07` | `duplicate_table` | Table already exists |
| `42701` | `duplicate_column` | Column already exists |
| `42601` | `syntax_error` | Syntax error in SQL statement |
| `42830` | `invalid_foreign_key` | Invalid foreign key definition |
| `22001` | `string_data_right_truncation` | String too long for column |
| `22012` | `division_by_zero` | Division by zero |
| `22003` | `numeric_value_out_of_range` | Numeric value out of range |
| `22008` | `datetime_field_overflow` | Date/time field overflow |
| `08006` | `connection_failure` | Connection failure |
| `08003` | `connection_does_not_exist` | Connection does not exist |
| `08001` | `sqlclient_unable_to_establish_sqlconnection` | Client unable to establish connection |
| `57P03` | `cannot_connect_now` | Server is starting up |
| `57P01` | `admin_shutdown` | Server shutdown by administrator |
| `57P02` | `crash_shutdown` | Server crash |
| `40001` | `serialization_failure` | Serialization failure (Serializable isolation) |
| `40P01` | `deadlock_detected` | Deadlock detected |
| `55P03` | `lock_not_available` | Lock not available (NOWAIT) |
| `53300` | `too_many_connections` | Too many connections |

**Using error codes in PL/pgSQL:**

```sql
BEGIN
    INSERT INTO users (email) VALUES ('alice@example.com');
EXCEPTION
    WHEN unique_violation THEN
        RAISE NOTICE 'User already exists';
    WHEN not_null_violation THEN
        RAISE NOTICE 'Missing required field';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Unexpected error: %, SQLSTATE: %', SQLERRM, SQLSTATE;
END;
```

## Appendix: SQL Key Words

PostgreSQL classifies SQL key words as:
- **Reserved** — cannot be used as identifiers (e.g., `SELECT`, `FROM`, `WHERE`, `CREATE`, `TABLE`, `INSERT`, `UPDATE`, `DELETE`, `JOIN`, `GROUP`, `ORDER`, `HAVING`, `LIMIT`, `OFFSET`, `UNION`, `INTERSECT`, `EXCEPT`, `PRIMARY`, `FOREIGN`, `REFERENCES`, `CONSTRAINT`, `CHECK`, `UNIQUE`, `DEFAULT`, `NULL`, `NOT`, `AND`, `OR`, `BETWEEN`, `IN`, `LIKE`, `ILIKE`, `AS`, `CASE`, `WHEN`, `THEN`, `ELSE`, `END`, `CAST`, `DISTINCT`, `ALL`, `EXISTS`, `SOME`, `ANY`, `GRANT`, `REVOKE`, `SET`, `SHOW`, `BEGIN`, `COMMIT`, `ROLLBACK`, `SAVEPOINT`, `TRUNCATE`, `VACUUM`, `ANALYZE`, `EXPLAIN`, `COPY`, `MERGE`)
- **Unreserved** — can be used as identifiers (e.g., `ABORT`, `ACTION`, `AFTER`, `AGGREGATE`, `BACKWARD`, `CACHE`, `CALL`, `CASCADE`, `CHAIN`, `COLUMNS`, `COMMENTS`, `CONFIGURATION`, `CONFLICT`, `CONNECTION`, `CONSTRAINTS`, `CONTENT`, `CONVERSION`, `CURRENT`, `CURSOR`, `CYCLE`, `DATA`, `DATABASE`, `DAY`, `DAYS`, `DEFAULTS`, `DEFERRED`, `DEFINER`, `DICTIONARY`, `DISABLE`, `DOCUMENT`, `EACH`, `ENABLE`, `ENCODING`, `ENCRYPTED`, `ENUM`, `ESCAPE`, `EVENT`, `EXCLUDE`, `EXCLUDING`, `EXTENSION`, `EXTERNAL`, `FAMILY`, `FILTER`, `FIRST`, `FOLLOWING`, `FORWARD`, `FUNCTION`, `FUNCTIONS`, `GLOBAL`, `GRANTED`, `HANDLER`, `HEADER`, `HOLD`, `HOUR`, `HOURS`, `IDENTITY`, `IF`, `IMMEDIATE`, `IMMUTABLE`, `IMPLICIT`, `INCLUDING`, `INCREMENT`, `INDEX`, `INDEXES`, `INHERIT`, `INHERITS`, `INLINE`, `INPUT`, `INSENSITIVE`, `INSTEAD`, `INVOKER`, `ISOLATION`, `KEY`, `LABEL`, `LANGUAGE`, `LARGE`, `LAST`, `LEAKPROOF`, `LEVEL`, `LISTEN`, `LOAD`, `LOCAL`, `LOCATION`, `LOCK`, `LOCKED`, `LOGGED`, `MAPPING`, `MATCH`, `MATCHED`, `MATERIALIZED`, `MAXVALUE`, `METHOD`, `MINUTE`, `MINUTES`, `MINVALUE`, `MODE`, `MONTH`, `MONTHS`, `MOVE`, `NAME`, `NAMES`, `NEW`, `NEXT`, `NO`, `NOTHING`, `NOTIFY`, `NOWAIT`, `NULLS`, `OBJECT`, `OF`, `OFF`, `OIDS`, `OLD`, `OPERATOR`, `OPTION`, `OPTIONS`, `OVERRIDING`, `OWNED`, `OWNER`, `PARALLEL`, `PARSER`, `PARTIAL`, `PARTITION`, `PASSING`, `PASSWORD`, `PLANS`, `POLICY`, `PRECEDING`, `PREPARE`, `PREPARED`, `PRESERVE`, `PRIOR`, `PRIVILEGES`, `PROCEDURAL`, `PROCEDURE`, `PROGRAM`, `PUBLICATION`, `QUOTE`, `RANGE`, `READ`, `REASSIGN`, `RECHECK`, `RECURSIVE`, `REF`, `REFERENCING`, `REFRESH`, `REINDEX`, `RELATIVE`, `RELEASE`, `RENAME`, `REPEATABLE`, `REPLACE`, `REPLICA`, `RESET`, `RESTART`, `RETURNING`, `ROLE`, `ROLLBACK`, `ROW`, `ROWS`, `RULE`, `SCHEMA`, `SCHEMAS`, `SCROLL`, `SEARCH`, `SECOND`, `SECONDS`, `SECRET`, `SECURITY`, `SEQUENCE`, `SEQUENCES`, `SERIALIZABLE`, `SERVER`, `SESSION`, `SET`, `SETS`, `SHARE`, `SIMPLE`, `SKIP`, `SNAPSHOT`, `SQL`, `STABLE`, `STANDALONE`, `START`, `STATEMENT`, `STATISTICS`, `STDIN`, `STDOUT`, `STORAGE`, `STORED`, `STRATEGIES`, `STREAM`, `SUBSCRIPTION`, `SYSID`, `SYSTEM`, `TABLES`, `TABLESPACE`, `TEMP`, `TEMPLATE`, `TEMPORARY`, `TEXT`, `TRANSACTION`, `TRANSFORM`, `TRIGGER`, `TRUNCATE`, `TRUSTED`, `TYPE`, `TYPES`, `UNBOUNDED`, `UNCOMMITTED`, `UNENCRYPTED`, `UNKNOWN`, `UNLISTEN`, `UNLOGGED`, `UNTIL`, `UPDATE`, `VACUUM`, `VALID`, `VALIDATE`, `VALIDATOR`, `VALUE`, `VARIABLE`, `VARYING`, `VERBOSE`, `VERSION`, `VIEW`, `VIEWS`, `VIRTUAL`, `VOLATILE`, `WHITESPACE`, `WITHIN`, `WITHOUT`, `WORK`, `WRAPPER`, `WRITE`, `XML`, `YEAR`, `YEARS`, `YES`, `ZONE`)

## Appendix: External Projects

Popular PostgreSQL client libraries and tools not included in core:
- **Drivers** — psycopg2/psycopg3 (Python), pg (Node.js), pgx (Go), JDBC (Java), Npgsql (.NET), libpqxx (C++), rust-postgres (Rust)
- **ORMs** — SQLAlchemy (Python), Prisma (Node.js), TypeORM (Node.js), Hibernate (Java), Entity Framework (.NET), Django ORM (Python), ActiveRecord (Ruby)
- **GUI Tools** — pgAdmin, DBeaver, DataGrip, Postico, TablePlus
- **Connection Poolers** — PgBouncer, pgcat, Odyssey
- **High Availability** — Patroni, repmgr, Stolon
- **Monitoring** — pg_stat_statements, pgBadger, Prometheus postgres_exporter, Grafana
- **Migration** — pgloader, Flyway, Liquibase, Sqitch, Alembic
- **Extensions** — PostGIS, TimescaleDB, pgvector, Citus, pg_partman, pg_cron, pgjwt
