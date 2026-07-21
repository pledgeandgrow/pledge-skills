# PostgreSQL Server Administration

## Server Setup and Operation

### Starting and Stopping

```bash
# Initialize a new cluster
initdb -D /var/lib/postgresql/data

# Start the server
pg_ctl -D /var/lib/postgresql/data start
pg_ctl -D /var/lib/postgresql/data -l logfile start

# Stop the server
pg_ctl -D /var/lib/postgresql/data stop
pg_ctl -D /var/lib/postgresql/data stop -m fast  # default
pg_ctl -D /var/lib/postgresql/data stop -m smart  # wait for connections
pg_ctl -D /var/lib/postgresql/data stop -m immediate  # crash stop

# Reload configuration
pg_ctl -D /var/lib/postgresql/data reload
SELECT pg_reload_conf();

# Server status
pg_ctl -D /var/lib/postgresql/data status
```

### Upgrading

```bash
# In-place upgrade (minor version)
pg_ctl stop
# Replace binaries
pg_ctl start

# Major version upgrade with pg_upgrade
pg_upgrade -b /old/bin -B /new/bin -d /old/data -D /new/data
```

## Server Configuration

### Setting Parameters

- **Configuration file** — `postgresql.conf` or `postgresql.auto.conf`
- **SQL** — `ALTER SYSTEM SET param = value; SELECT pg_reload_conf();`
- **Shell** — `postgres -c param=value`
- **Per-session** — `SET param = value;`
- **Per-transaction** — `SET LOCAL param = value;`
- **Per-role/database** — `ALTER ROLE ... SET param = value; ALTER DATABASE ... SET param = value;`

### File Locations

- `data_directory` — PostgreSQL data directory
- `hba_file` — `pg_hba.conf` path
- `ident_file` — `pg_ident.conf` path
- `external_pid_file` — PID file path

### Connections and Authentication

- `listen_addresses` — TCP/IP addresses to listen on (`*` for all)
- `port` — TCP port (default 5432)
- `max_connections` — maximum simultaneous connections
- `superuser_reserved_connections` — reserved for superusers
- `unix_socket_directories` — Unix socket directories
- `authentication_timeout` — max time for client auth
- `password_encryption` — `scram-sha-256` (default) or `md5`
- `ssl` — enable SSL connections
- `ssl_cert_file`, `ssl_key_file`, `ssl_ca_file` — SSL certificate files

### Resource Consumption

**Memory:**
- `shared_buffers` — shared memory for data pages (recommended 25% of RAM)
- `effective_cache_size` — estimate of OS disk cache (recommended 50-75% of RAM)
- `work_mem` — memory per sort/hash operation
- `maintenance_work_mem` — memory for VACUUM, CREATE INDEX, ALTER TABLE
- `temp_buffers` — memory for temporary tables
- `huge_pages` — use huge pages (`try`, `on`, `off`)

**Disk:**
- `temp_file_limit` — max temporary files per process
- `max_stack_depth` — maximum stack depth

**Kernel Resources:**
- `max_files_per_process` — max open files per server process

**Asynchronous Behavior:**
- `backend_flush_after` — flush after this many blocks written
- `wal_receiver_status_interval` — WAL receiver status interval

### Write Ahead Log (WAL)

- `wal_level` — `minimal`, `replica` (default), `logical`
- `wal_buffers` — shared memory for WAL data
- `wal_writer_delay` — WAL writer delay
- `max_wal_size` — max WAL before checkpoint (default 1GB)
- `min_wal_size` — min WAL to retain (default 80MB)
- `checkpoint_timeout` — max time between checkpoints (default 5min)
- `checkpoint_completion_target` — spread checkpoint I/O (default 0.9)
- `archive_mode` — `off`, `on`, `always`
- `archive_command` — command to archive WAL segments
- `wal_compression` — compress WAL (`off`, `on`, `pglz`, `lz4`, `zstd`)

### Replication

- `max_wal_senders` — max WAL sender processes
- `max_replication_slots` — max replication slots
- `wal_keep_size` — WAL to retain for standby
- `hot_standby` — allow read-only queries on standby
- `hot_standby_feedback` — standby sends feedback to prevent conflicts
- `synchronous_standby_names` — names of synchronous standbys
- `max_logical_replication_workers` — max logical replication workers

### Query Planning

- `enable_seqscan`, `enable_indexscan`, `enable_bitmapscan` — enable/disable plan types
- `random_page_cost` — cost of non-sequentially fetched disk page (default 4.0)
- `cpu_tuple_cost` — cost of processing each row (default 0.01)
- `effective_cache_size` — estimate of memory available for disk caching
- `default_statistics_target` — default statistics target (default 100)
- `geqo` — enable genetic query optimizer
- `geqo_threshold` — tables threshold for GEQO

### Error Reporting and Logging

- `log_destination` — `stderr`, `csvlog`, `jsonlog`, `syslog`, `eventlog`
- `logging_collector` — capture stderr and csvlog to files
- `log_directory` — log file directory
- `log_filename` — log file name pattern
- `log_rotation_age` — max lifetime of log file
- `log_rotation_size` — max size of log file
- `log_min_messages` — minimum message level to log
- `log_min_error_statement` — log statements that cause errors
- `log_statement` — `none`, `ddl`, `mod`, `all`
- `log_connections` — log client connections
- `log_disconnections` — log client disconnections
- `log_duration` — log duration of each completed statement
- `log_line_prefix` — prefix for each log line

### Automatic Vacuuming

- `autovacuum` — enable autovacuum (default on)
- `autovacuum_max_workers` — max autovacuum workers
- `autovacuum_naptime` — delay between autovacuum runs
- `autovacuum_vacuum_threshold` — min row changes before vacuum
- `autovacuum_analyze_threshold` — min row changes before analyze
- `autovacuum_vacuum_scale_factor` — fraction of table before vacuum (default 0.2)
- `autovacuum_analyze_scale_factor` — fraction of table before analyze (default 0.1)
- `autovacuum_vacuum_cost_limit` — cost limit for autovacuum

## Client Authentication

### The pg_hba.conf File

```
# TYPE  DATABASE  USER  ADDRESS         METHOD
local   all       all                   trust
host    all       all   127.0.0.1/32    scram-sha-256
host    all       all   ::1/128         scram-sha-256
host    all       all   0.0.0.0/0       scram-sha-256
hostssl all       all   0.0.0.0/0       cert
```

### Authentication Methods

- **trust** — no authentication required
- **password** — plaintext password (insecure without SSL)
- **scram-sha-256** — SCRAM-SHA-256 authentication (recommended)
- **md5** — MD5 password authentication (legacy)
- **cert** — SSL client certificate authentication
- **peer** — OS-level user mapping (Unix domain sockets only)
- **ident** — ident protocol (RFC 1413)
- **gssapi** — GSSAPI/Kerberos authentication
- **sspi** — Windows SSPI authentication
- **ldap** — LDAP authentication
- **radius** — RADIUS authentication
- **pam** — PAM authentication
- **bsd** — BSD authentication (OpenBSD)

### User Name Maps

`pg_ident.conf` maps OS users to PostgreSQL users:
```
# MAPNAME  SYSTEM-USERNAME  PG-USERNAME
usermap    alice            postgres
```

## Database Roles

### Creating and Managing Roles

```sql
-- Create a role (can be user or group)
CREATE ROLE alice LOGIN PASSWORD 'secret';
CREATE ROLE admins;

-- Role attributes
CREATE ROLE bob LOGIN PASSWORD 'secret' CREATEDB CREATEROLE;
ALTER ROLE alice SET default_transaction_isolation = 'serializable';
ALTER ROLE alice VALID UNTIL '2025-12-31';

-- Role membership
GRANT admins TO alice;
GRANT admins TO bob WITH ADMIN OPTION;
SET ROLE admins;  -- assume role privileges
RESET ROLE;
```

### Predefined Roles

- `pg_read_all_data` — read all tables, sequences, schemas
- `pg_write_all_data` — write all tables, sequences
- `pg_read_all_settings` — read all GUC parameters
- `pg_read_all_stats` — read all pg_stat_* views
- `pg_stat_scan_tables` — use ANALYZE on all tables
- `pg_signal_backend` — signal other backends (cancel/terminate)
- `pg_execute_server_program` — execute server-side programs (COPY)

### Function Security

- Functions run with caller's privileges by default (`SECURITY INVOKER`)
- `SECURITY DEFINER` functions run with owner's privileges
- Must lock down function to prevent abuse (restrict search_path, check arguments)

## Managing Databases

```sql
CREATE DATABASE mydb;
CREATE DATABASE mydb OWNER alice TABLESPACE mytablespace;
ALTER DATABASE mydb SET enable_seqscan = off;
DROP DATABASE mydb;

-- Template databases
CREATE DATABASE newdb TEMPLATE mydb;  -- copy from custom template
```

## Localization

- `lc_messages` — language for error messages
- `lc_monetary` — formatting for monetary amounts
- `lc_numeric` — formatting for numbers
- `lc_time` — formatting for dates and times
- `lc_collate` / `lc_ctype` — set at cluster creation, cannot be changed
- Collation support: `CREATE COLLATION`, ICU collations, per-column collation

## Routine Database Maintenance

### VACUUM

```sql
VACUUM;                    -- mark space reusable, doesn't return to OS
VACUUM FULL;               -- reclaims space to OS, locks table, rewrites
VACUUM ANALYZE;            -- vacuum and update statistics
VACUUM (VERBOSE, ANALYZE) products;  -- with output and stats

-- Autovacuum handles this automatically
-- Tune via autovacuum_vacuum_scale_factor, autovacuum_vacuum_threshold
```

### ANALYZE

```sql
ANALYZE;                   -- update statistics for all tables
ANALYZE products;          -- update statistics for specific table
ANALYZE products (name, price);  -- specific columns
```

### REINDEX

```sql
REINDEX TABLE products;
REINDEX INDEX idx_name;
REINDEX DATABASE mydb;
REINDEX TABLE products CONCURRENTLY;  -- non-blocking
```

## Backup and Restore

### SQL Dump (pg_dump)

```bash
# Dump a database
pg_dump mydb > mydb.sql
pg_dump -Fc mydb > mydb.dump   # custom format (compressed)
pg_dump -Ft mydb > mydb.tar    # tar format
pg_dump -Fd mydb -f mydb_dir   # directory format (parallel)

# Restore
psql -d newdb < mydb.sql
pg_restore -d newdb mydb.dump
pg_restore -d newdb -j 4 mydb.dump  # parallel restore

# Dump all databases
pg_dumpall > all_databases.sql
pg_dumpall --roles-only > roles.sql
```

### File System Level Backup

```bash
# Use pg_basebackup for online backup
pg_basebackup -D /backup -Ft -z -P
pg_basebackup -D /backup -Fp -Xs -P  # plain format with WAL streaming

# Or use rsync/tar on stopped server
```

### Continuous Archiving and PITR

```ini
# postgresql.conf
archive_mode = on
archive_command = 'cp %p /archive/%f'
wal_level = replica
```

```bash
# Create a base backup
pg_basebackup -D /backup/base -Fp -Xs -P

# Restore with PITR
# 1. Stop PostgreSQL
# 2. Restore base backup to data directory
# 3. Create recovery.signal file
# 4. Configure recovery in postgresql.conf or postgresql.auto.conf
```

```ini
# Recovery settings
restore_command = 'cp /archive/%f %p'
recovery_target_time = '2024-03-15 14:30:00'
recovery_target_lsn = '0/7000020'
recovery_target_name = 'my_restore_point'
recovery_target_inclusive = true
recovery_target_action = 'promote'  # or 'pause' or 'shutdown'
```

### Incremental Backups (PostgreSQL 17)

```bash
# Create incremental backup based on a full backup
pg_basebackup -D /backup/incr -Fp -Xs -P --incremental /backup/base/BACKUP_LABEL

# Combine backups
pg_combinebackup /backup/base /backup/incr -o /backup/combined
```

## High Availability, Load Balancing, and Replication

### Comparison of Solutions

| Solution | Type | Sync | Granularity |
|----------|------|------|-------------|
| Warm Standby (log-shipping) | Physical | Async | Entire server |
| Streaming Replication | Physical | Async/Sync | Entire server |
| Logical Replication | Logical | Async | Per-table |
| Third-party (Patroni, repmgr) | Physical | Varies | Entire server |

### Log-Shipping Standby Servers

```bash
# On primary: configure WAL archiving
archive_mode = on
archive_command = 'cp %p /archive/%f'

# On standby: configure recovery
restore_command = 'cp /archive/%f %p'
standby_mode = on  # or create standby.signal
```

### Streaming Replication

```ini
# On primary
wal_level = replica
max_wal_senders = 10

# On standby
primary_conninfo = 'host=primary port=5432 user=replicator password=secret'
```

```sql
-- Create replication user on primary
CREATE ROLE replicator REPLICATION LOGIN PASSWORD 'secret';
```

### Replication Slots

```sql
-- Physical replication slot
SELECT pg_create_physical_replication_slot('standby1');
SELECT * FROM pg_replication_slots;
SELECT pg_drop_replication_slot('standby1');

-- Logical replication slot
SELECT pg_create_logical_replication_slot('my_slot', 'test_decoding');
```

### Cascading Replication

Standby servers can serve as upstream for other standbys:
```ini
# On cascading standby
primary_conninfo = 'host=upstream_standby port=5432'
```

### Synchronous Replication

```ini
# On primary
synchronous_standby_names = 'FIRST 2 (standby1, standby2)'
synchronous_standby_names = 'ANY 2 (standby1, standby2)'
synchronous_commit = on
```

### Failover

```bash
# Promote a standby to primary
pg_ctl promote -D /var/lib/postgresql/data
# Or
SELECT pg_promote();
```

### Hot Standby

- Standby server accepts read-only queries
- `hot_standby = on` (default)
- Conflict resolution: `max_standby_streaming_delay`, `max_standby_archive_delay`
- `hot_standby_feedback = on` — standby sends feedback to prevent conflicts

## Monitoring Database Activity

### Cumulative Statistics Views

| View | Description |
|------|-------------|
| `pg_stat_activity` | current queries and connections |
| `pg_stat_replication` | streaming replication connections |
| `pg_stat_replication_slots` | replication slot statistics |
| `pg_stat_wal_receiver` | WAL receiver status |
| `pg_stat_subscription` | logical replication subscriptions |
| `pg_stat_archiver` | WAL archiver statistics |
| `pg_stat_io` | I/O statistics per backend type |
| `pg_stat_bgwriter` | background writer statistics |
| `pg_stat_checkpointer` | checkpointer statistics |
| `pg_stat_wal` | WAL generation statistics |
| `pg_stat_database` | per-database statistics |
| `pg_stat_all_tables` | per-table statistics |
| `pg_stat_all_indexes` | per-index statistics |
| `pg_statio_all_tables` | per-table I/O statistics |
| `pg_statio_all_indexes` | per-index I/O statistics |
| `pg_statio_all_sequences` | per-sequence I/O statistics |
| `pg_stat_user_functions` | function call statistics |
| `pg_stat_slru` | SLRU statistics |
| `pg_stat_ssl` | SSL connection info |
| `pg_stat_gssapi` | GSSAPI connection info |

```sql
-- See active queries
SELECT pid, usename, application_name, state, query, query_start
FROM pg_stat_activity WHERE state = 'active';

-- Cancel a query
SELECT pg_cancel_backend(pid);

-- Terminate a backend
SELECT pg_terminate_backend(pid);
```

### Progress Reporting

Views: `pg_stat_progress_analyze`, `pg_stat_progress_cluster`, `pg_stat_progress_copy`, `pg_stat_progress_create_index`, `pg_stat_progress_vacuum`, `pg_stat_progress_basebackup`

### Viewing Locks

```sql
SELECT l.locktype, l.relation::regclass, l.pid, l.mode, l.granted,
       a.query, a.query_start
FROM pg_locks l
JOIN pg_stat_activity a ON l.pid = a.pid
WHERE NOT l.granted;
```

### Dynamic Tracing

PostgreSQL supports DTrace probes for dynamic tracing. Compile with `--enable-dtrace` and use built-in probes.

## Reliability and the Write-Ahead Log

- **WAL** — ensures data integrity by writing changes to log before applying to data files
- **Checkpoints** — sync point where all dirty buffers are flushed to disk
- `wal_level` controls how much information is written to WAL
- `full_page_writes` — write full page image on first modification after checkpoint
- `wal_log_hints` — log hint bit changes

## Logical Replication

### Publication

```sql
-- Create a publication
CREATE PUBLICATION my_pub FOR TABLE users, orders;
CREATE PUBLICATION my_pub FOR ALL TABLES;
CREATE PUBLICATION my_pub FOR TABLE users (id, name) WITH (publish = 'insert, update');

-- Alter
ALTER PUBLICATION my_pub ADD TABLE products;
ALTER PUBLICATION my_pub SET TABLE users, orders;
```

### Subscription

```sql
-- Create a subscription
CREATE SUBSCRIPTION my_sub
    CONNECTION 'host=publisher port=5432 dbname=mydb user=repuser'
    PUBLICATION my_pub;

-- With options
CREATE SUBSCRIPTION my_sub
    CONNECTION 'host=publisher port=5432 dbname=mydb user=repuser'
    PUBLICATION my_pub
    WITH (copy_data = true, create_slot = true, enabled = true);
```

### Row Filters (PostgreSQL 15+)

```sql
CREATE PUBLICATION my_pub FOR TABLE users (id, name, region)
    WITH (publish = 'insert, update, delete');

-- Row filter via WHERE clause in publication
CREATE PUBLICATION east_pub FOR TABLE users WHERE (region = 'east');
```

### Column Lists (PostgreSQL 15+)

```sql
CREATE PUBLICATION my_pub FOR TABLE users (id, name, email);
```

### Conflicts

- `unique_violation` — duplicate key on insert
- `foreign_key_violation` — missing referenced row
- `exclusion_violation` — exclusion constraint conflict
- Resolution: delete conflicting data on subscriber or skip transaction

### Monitoring

```sql
SELECT * FROM pg_stat_subscription;
SELECT * FROM pg_stat_subscription_stats;
```

## Just-in-Time Compilation (JIT)

PostgreSQL can JIT-compile query expressions using LLVM:

```ini
# Enable JIT
jit = on
jit_above_cost = 100000        # only JIT expensive queries
jit_inline_above_cost = 500000
jit_optimize_above_cost = 500000
```

JIT speeds up CPU-intensive queries (analytics, large aggregations) but adds compilation overhead.
