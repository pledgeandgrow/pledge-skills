# File Formats and Protocols

Git internal file formats, wire protocols, and developer interfaces.

## Repository Layout

The `.git` directory structure:

```
.git/
├── HEAD                 # Symbolic ref to current branch
├── config               # Repository configuration
├── description          # Description for gitweb
├── packed-refs          # Packed refs (branches/tags)
├── index                # Staging area (binary)
├── objects/             # Object database
│   ├── pack/            # Pack files (.pack + .idx)
│   ├── info/            # Object info
│   └── xx/              # Loose objects (first 2 chars of SHA-1)
├── refs/                # References
│   ├── heads/           # Local branches
│   ├── tags/            # Tags
│   └── remotes/         # Remote-tracking branches
├── logs/                # Reflogs
│   └── HEAD             # HEAD reflog
├── hooks/               # Hook scripts
├── info/                # Repository info
│   ├── exclude          # Per-repo exclude patterns
│   └── sparse-checkout  # Sparse checkout patterns
├── branches/            # Deprecated branch shortcuts
├── worktrees/           # Linked worktrees
└── modules/             # Submodule repositories
```

### HEAD file

```
# Normal — points to branch
ref: refs/heads/main

# Detached — points to commit
abc123def456789012345678901234567890abcd
```

### packed-refs format

```
# pack-refs --all output
# pack-refs with: peeled fully-peeled sorted 
abc123def456789012345678901234567890abcd refs/heads/main
def456789012345678901234567890abcd123456 refs/tags/v1.0
^123456789012345678901234567890abcd123456  # Peeled tag object
```

## Git Index Format

The `.git/index` file is a binary file representing the staging area.

### Index structure

```
Header:
  - 4 bytes: "DIRC" signature
  - 4 bytes: version number (2, 3, or 4)
  - 4 bytes: entry count

Entries (sorted by path):
  - ctime seconds, nanoseconds
  - mtime seconds, nanoseconds
  - dev, ino, mode
  - uid, gid
  - size (file size)
  - 20 bytes: SHA-1 of blob
  - 16-bit flags (assume-valid, extended, stage, name length)
  - path name (null-terminated)
  - padding to multiple of 8 bytes

Extensions:
  - Tree cache extension (TREE)
  - Resolve undo extension (REUC)
  - Untracked cache extension (UNTR)

Trailer:
  - 20 bytes: SHA-1 checksum of index content
```

### Index versions

| Version | Features |
|---------|----------|
| 2 | Basic entries |
| 3 | Extended flags (intent-to-add, skip-worktree) |
| 4 | Prefix compression for paths |

```bash
# Write index version 4 (smaller)
git config index.version 4
```

## Pack Format

Pack files store compressed objects efficiently.

### Pack file structure

```
.pack file:
  Header:
    - 4 bytes: "PACK" signature
    - 4 bytes: version (2 or 3)
    - 4 bytes: object count
  
  Objects (each):
    - Variable-length header (type + size)
    - zlib-compressed data (or delta against base)
  
  Trailer:
    - 20 bytes: SHA-1 checksum

.idx file (index):
  Header:
    - 4 bytes: magic (\377tOc)
    - 4 bytes: version (2)
    - Fanout table (256 * 4 bytes)
    - SHA-1 names (20 bytes each)
    - CRC32 checksums
    - 4-byte offsets
    - 8-byte offsets (for large packs)
  Trailer:
    - 20 bytes: pack SHA-1
    - 20 bytes: idx SHA-1
```

### Object types in packs

| Type | Number | Description |
|------|--------|-------------|
| OBJ_COMMIT | 1 | Commit object |
| OBJ_TREE | 2 | Tree object |
| OBJ_BLOB | 3 | Blob object |
| OBJ_TAG | 4 | Tag object |
| OBJ_OFS_DELTA | 6 | Delta with offset base |
| OBJ_REF_DELTA | 7 | Delta with SHA-1 base |

### Delta compression

Git stores objects as deltas against similar objects:
- `OBJ_OFS_DELTA` — base specified by offset in same pack
- `OBJ_REF_DELTA` — base specified by SHA-1

```bash
# Inspect pack file
git verify-pack -v .git/objects/pack/pack-*.idx

# Create pack from objects
git pack-objects --revs < rev-list.txt

# Index a pack file
git index-pack pack-*.pack
```

## Bundle Format

Git bundle files for offline transfer.

### Bundle structure

```
Bundle file:
  Header:
    - "# v2 git bundle" or "# v3 git bundle\n"
    - (v3) capability lines
    - Blank line
  
  Refs section:
    - <SHA-1> <ref-name>
    - (v3) <SHA-1> <ref-name> <symref-target>
    - Blank line
  
  Pack data:
    - Standard pack file (see Pack Format)
```

```bash
# Create bundle
git bundle create repo.bundle --all

# Verify bundle
git bundle verify repo.bundle

# List refs in bundle
git bundle list-heads repo.bundle
```

## Commit-Graph Format

The commit-graph file accelerates commit walks.

### Structure

```
Header:
  - 4 bytes: "CGPH" signature
  - 4 bytes: version (1)
  - 4 bytes: hash version (1=SHA-1, 2=SHA-256)
  - 4 bytes: chunk count

Chunks:
  - OIDF: OID fanout table (256 * 4 bytes)
  - OIDL: OID lookup (20 bytes each)
  - CDAT: Commit data (20 bytes tree + 4 bytes parent1 + 4 bytes parent2)
  - EDGE: Extra edge list (for >2 parents)
  - BIDX: Bloom filter index
  - BDATA: Bloom filter data
  - BFI: Bloom filter index for changed paths

Trailer:
  - 20 bytes: SHA-1 checksum
```

```bash
# Write commit-graph
git commit-graph write

# Write with reachable commits
git commit-graph write --reachable

# Write from stdin
git rev-list --all | git commit-graph write --stdin-commits

# Verify commit-graph
git commit-graph verify
```

## Chunk-based File Format

Several Git files use chunk-based format (commit-graph, multi-pack-index).

```
Header:
  - 4 bytes: signature
  - 4 bytes: version
  - 4 bytes: hash version
  - 4 bytes: chunk count

Chunk table:
  - For each chunk:
    - 4 bytes: chunk ID (4 ASCII chars)
    - 8 bytes: offset
  - Terminated by null chunk ID

Chunk data:
  - Variable-length chunk data at specified offsets
```

## Signature Format

Git cryptographic signature formats.

### GPG signatures

```
# Commit signature
-----BEGIN PGP SIGNATURE-----
iQIzBA...
-----END PGP SIGNATURE-----

# Stored in commit object after message
```

### SSH signatures

```
# SSH signature format (Git 2.34+)
-----BEGIN SSH SIGNATURE-----
U1NIU0lH...
-----END SSH SIGNATURE-----
```

```bash
# Verify commit signature
git verify-commit <hash>

# Verify tag signature
git verify-tag v1.0

# Show signature in log
git log --show-signature
```

## Wire Protocols

### Protocol v0/v1

The original Git protocol for fetch and push.

**Fetch (upload-pack):**
```
Client → Server: git-upload-pack\n
Client → Server: want <SHA-1> <capabilities>\n
Client → Server: have <SHA-1>\n
Client → Server: done\n
Server → Client: PACK data
```

**Push (receive-pack):**
```
Client → Server: git-receive-pack\n
Client → Server: <old-SHA> <new-SHA> <ref-name>\0<capabilities>\n
Server → Client: report-status\n
Client → Server: PACK data
Server → Client: ok/ng status
```

### Protocol v2

Protocol v2 improves efficiency with command-based negotiation.

```
Client → Server: git-upload-pack\n
Client → Server: version 2\n
Client → Server: command=fetch\n
Client → Server: want <SHA-1>\n
Server → Client: packfile\n
Server → Client: PACK data
```

### Protocol capabilities

| Capability | Description |
|-----------|-------------|
| `multi_ack` | Multiple ACK responses during negotiation |
| `side-band` | Multiplex progress with pack data |
| `side-band-64k` | Side-band with 64k window |
| `ofs-delta` | Support offset deltas in packs |
| `shallow` | Support shallow clones |
| `no-progress` | Suppress progress |
| `include-tag` | Include tags in fetch |
| `thin-pack` | Send thin packs (deltas against remote) |
| `agent` | Client/server agent string |
| `symref` | Symbolic ref information |
| `object-format` | Hash algorithm (SHA-1/SHA-256) |
| `partial` | Partial clone support |

### HTTP protocol

```bash
# Smart HTTP uses git-http-backend CGI
# Dumb HTTP serves loose objects and pack files directly

# Smart HTTP request:
GET /info/refs?service=git-upload-pack
POST /git-upload-pack

# Dumb HTTP:
GET /info/refs
GET /objects/<sha>/<sha>
GET /objects/pack/pack-*.pack
GET /objects/pack/pack-*.idx
```

### Common protocol elements

```
# Packet format
<4-byte hex length><payload>

# Flush packet
0000

# Delimiter packet
0001

# Response-end packet
0002
```

## gitnamespaces

Git namespaces allow partitioning refs.

```bash
# Set namespace via env var
GIT_NAMESPACE=feature git fetch origin
GIT_NAMESPACE=feature git push origin main

# Or via extended refspec
git fetch origin 'refs/namespaces/feature/refs/heads/*:refs/heads/*'
```

### Namespace structure

```
refs/namespaces/<namespace>/refs/heads/main
refs/namespaces/<namespace>/refs/tags/v1.0
```

## gitremote-helpers

Helper programs to interact with remote repositories.

```bash
# Git invokes helper based on URL scheme
git clone remote:://path

# Helper protocol:
# capabilities: list supported operations
# list: list refs
# fetch: fetch objects
# push: push objects
# import/export: fast-import/export based sync
```

### Built-in remote helpers

| Helper | Scheme |
|--------|--------|
| `git-remote-http` | http://, https:// |
| `git-remote-https` | https:// |
| `git-remote-ftp` | ftp:// |
| `git-remote-ftps` | ftps:// |
| `git-remote-fd` | fd:: |

## gitmailmap

Map author/committer names and/or email addresses.

```ini
# .mailmap file in repository root
# Format: Proper Name <commit@email.xx>
Proper Name <commit@email.xx>

# Map multiple emails to one name
Proper Name <proper@email.xx> <commit@email.xx>

# Map different names for same email
Proper Name <proper@email.xx> Commit Name <commit@email.xx>
```

```bash
# Mailmap is used automatically by git log, git shortlog, etc.
git log --use-mailmap
git shortlog --use-mailmap
```

## gitdiffcore

How Git generates diffs internally.

### Diff pipeline

```
1. diffcore_generate — generate raw diff
2. diffcore_break — break large rewrites into delete+add
3. diffcore_rename — detect renames and copies
4. diffcore_copy — detect copies
5. diffcore_merge_broken — re-merge broken pairs
6. diffcore_pickaxe — filter by -S/-G patterns
7. diffcore_order — sort by orderfile
8. diffcore_rotate — rotate output
9. diffcore_flush — output
```

### Configuring diff

```bash
# Rename detection
git config diff.renames copies  # Detect renames and copies
git config diff.renameLimit 1000

# Diff algorithm
git config diff.algorithm histogram  # or myers, patience, minimal

# Word diff
git config diff.wordRegex "[a-zA-Z_]+"
```

## Best practices

1. Use `git commit-graph write --reachable` for faster log/diff on large repos
2. Use index version 4 for smaller index files
3. Use `git config diff.algorithm histogram` for better diff quality
4. Use `.mailmap` to normalize author names across history
5. Use protocol v2 (default since Git 2.26) for efficient fetches
6. Use `GIT_NAMESPACE` for multi-tenant Git servers
7. Use `git verify-pack` to inspect pack file contents
8. Use `git pack-refs --all` to optimize repos with many refs
9. Understand the index format for debugging staging issues
10. Use `git bundle` for offline transfer when network is unavailable
