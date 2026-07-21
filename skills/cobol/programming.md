# ILE COBOL Programmer's Guide

## Compiling ILE COBOL Programs

### Creating Programs with CRTBNDCBL
The `CRTBNDCBL` command creates a program object from COBOL source in one step:

```
CRTBNDCBL PGM(MYLIB/MYPROG)
          SRCFILE(MYLIB/QCBLLESRC)
          SRCMBR(MYPROG)
          DBGVIEW(*ALL)
          OPTIMIZE(*FULL)
          ACTGRP(*NEW)
```

Key parameters:
- **PGM**: Target program object and library
- **SRCFILE/SRCMBR**: Source file and member
- **DBGVIEW**: Debug view (*ALL, *SOURCE, *LIST, *NONE)
- **OPTIMIZE**: Optimization level (*FULL, *BASIC, *NONE)
- **ACTGRP**: Activation group (*NEW, *CALLER, named group)
- **OPTION**: Compile options (*GEN, *NOGEN, *LIST, *XREF)
- **TGTRLS**: Target release compatibility

### Creating Modules with CRTCBLMOD
The `CRTCBLMOD` command creates a module object (for multi-module programs):

```
CRTCBLMOD MODULE(MYLIB/MYMOD)
          SRCFILE(MYLIB/QCBLLESRC)
          SRCMBR(MYMOD)
          DBGVIEW(*ALL)
```

### Binding Modules with CRTPGM
After creating modules, bind them into a program:

```
CRTPGM PGM(MYLIB/MYPROG)
       MODULE(MYLIB/MYMOD MYLIB/MYMOD2)
       ACTGRP(MYGRP)
       BNDSRVPGM(MYLIB/MYSRV)
```

### Creating Service Programs with CRTSRVPGM
Service programs provide reusable procedures:

```
CRTSRVPGM SRVPGM(MYLIB/MYSRV)
          MODULE(MYLIB/MYMOD)
          ACTGRP(*CALLER)
          EXPORT(*ALL)
```

### PROCESS Statement (Compiler Options in Source)
Compiler options can be specified in the source file before the IDENTIFICATION DIVISION:

```cobol
       PROCESS NOMONOPRC NOSTDTRUNC OPTIONS THREAD(SERIALIZE)
              DBGVIEW(*ALL) OPTIMIZE(*FULL).
```

Or using the older *CONTROL/*CBL format:
```cobol
       *CONTROL SOURCE APOST NOMONOPRC
```

### Key Compiler Options

| Option | Values | Purpose |
|--------|--------|---------|
| `APOST` / `QUOTE` | - | Literal delimiter character |
| `MONOPRC` / `NOMONOPRC` | - | Monopoly program checking |
| `STDTRUNC` / `NOSTDTRUNC` | - | Binary number truncation |
| `THREAD` | (SERIALIZE) | Multi-threaded program support |
| `DBGVIEW` | *ALL, *SOURCE, *LIST, *NONE | Debug view generation |
| `OPTIMIZE` | *FULL, *BASIC, *NONE | Optimization level |
| `OPTION` | *GEN, *NOGEN, *LIST | Compilation action |
| `SRTSEQ` | *HEX, *LANGIDSHR | Sort sequence |
| `LANGID` | *JOBRUN, specific | Language identifier |
| `CVTOPT` | *VARCHAR, *GRAPHIC | Data type conversion options |
| `FLAG` | *STD, *EXTENDED | Diagnostic flag level |
| `TGTRLS` | *PRV, *CURRENT | Target OS release |

---

## Running ILE COBOL Programs

### Calling Programs
Use the `CALL` command to run a COBOL program:

```
CALL PGM(MYLIB/MYPROG) PARM('ARG1' 123)
```

### Activation Groups
ILE programs run in activation groups - substructures within a job:

- ***NEW**: New activation group created and destroyed on each call
- ***CALLER**: Runs in the caller's activation group
- **Named group**: Persistent activation group shared by multiple programs

Best practices:
- Use named activation groups for applications with multiple programs
- All run unit participants must run in the same activation group
- The oldest invocation in the activation group is the main program
- Use *CALLER for service programs

### COBOL Run Unit
A COBOL run unit is a set of one or more programs functioning as a unit at run time:
- Independent entity that can execute without coordination with other run units
- Composed of program objects and service programs in a single ILE activation group
- Each ILE COBOL compilation unit must be compiled and bound into a single program object
- STOP RUN affects the entire run unit

---

## Debugging ILE COBOL Programs

### Starting the Debugger
Use the `STRDBG` (Start Debug) command:

```
STRDBG PGM(MYLIB/MYPROG) UPDPROD(*NO) OPMSRC(*YES)
```

Parameters:
- **PGM**: Program to debug (up to 20 programs)
- **SRVPGM**: Service programs to debug (up to 20)
- **UPDPROD**: Allow updates to production files (*NO is default)
- **OPMSRC**: Enable OPM source debug (*YES to debug OPM programs)

### Debug Commands

| Command | Purpose |
|---------|---------|
| `ATTR` | Display variable attributes (size, type) |
| `BREAK` | Set breakpoint (conditional: `BREAK line WHEN expr`) |
| `CLEAR` | Remove breakpoints or watch conditions |
| `DISPLAY` | Display equated names or different source module |
| `EQUATE` | Assign shorthand name to expression/variable |
| `EVAL` | Display or change variable value |
| `QUAL` | Define scope of variables |
| `SET` | Change debug options (UPDPROD, case sensitivity) |
| `STEP` | Execute one or more statements |
| `TBREAK` | Thread-specific breakpoint |
| `THREAD` | Display/change debugged thread |
| `WATCH` | Breakpoint when storage location changes |
| `FIND` | Search source for line number or text |
| `UP/DOWN` | Scroll source view |
| `LEFT/RIGHT` | Scroll source horizontally |
| `TOP/BOTTOM` | Go to first/last line |
| `NEXT/PREVIOUS` | Go to next/previous breakpoint |

### Ending Debug
```
ENDDBG
```

### Debug Views
The `DBGVIEW` parameter controls what debug information is generated:

| Value | Description |
|-------|-------------|
| `*ALL` | All available debug views |
| `*SOURCE` | Source view only |
| `*LIST` | Listing view |
| *`CLRLIST` | Compiler listing with no source |
| `*NONE` | No debug data |

### Rational Developer for i
IBM recommends using Rational Developer for i (RDi) for graphical debugging:
- Set breakpoints in source before running
- Control program execution (run, step, examine variables)
- View call stack
- Debug multiple applications in different languages simultaneously
- Watch conditions and service entry point breakpoints

---

## File Handling and I/O

### File Organization Types

| Organization | Description |
|--------------|-------------|
| **SEQUENTIAL** | Records in sequential order |
| **INDEXED** | Records accessed by key via index |
| **RELATIVE** | Records accessed by relative record number |
| **LINE SEQUENTIAL** | Sequential with line delimiters |

### Access Modes

| Mode | Available For | Description |
|------|---------------|-------------|
| **SEQUENTIAL** | All organizations | Process records in order |
| **RANDOM** | Indexed, Relative | Access by key/record number |
| **DYNAMIC** | Indexed, Relative | Mix sequential and random |

### File Operations

#### Opening Files
```cobol
OPEN INPUT FILE-1          *> Read only
OPEN OUTPUT FILE-2         *> Write only (creates/overwrites)
OPEN I-O FILE-3            *> Input and output (update)
OPEN EXTEND FILE-4         *> Append to existing file
```

#### Reading Records
```cobol
*> Sequential read
READ FILE-1 NEXT RECORD
    AT END SET EOF TO TRUE
END-READ.

*> Random read by key
MOVE "CUST001" TO CUST-KEY.
READ FILE-1 RECORD
    INVALID KEY PERFORM KEY-NOT-FOUND
END-READ.
```

#### Writing Records
```cobol
WRITE RECORD-1 FROM WORK-RECORD
    INVALID KEY DISPLAY "DUPLICATE KEY"
END-WRITE.
```

#### Updating Records
```cobol
REWRITE RECORD-1 FROM WORK-RECORD
    INVALID KEY PERFORM KEY-NOT-FOUND
END-REWRITE.
```

#### Deleting Records
```cobol
DELETE FILE-1 RECORD
    INVALID KEY PERFORM KEY-NOT-FOUND
END-DELETE.
```

### File Status Codes
Two-character status code indicates result of I/O operation:

| Code | Meaning |
|------|---------|
| `00` | Successful |
| `04` | Record length mismatch |
| `10` | End of file |
| `22` | Duplicate key |
| `23` | Key not found |
| `30` | File not found |
| `34` | File write error (disk full) |
| `35` | File not open |
| `41` | File already open |
| `42` | File not open |
| `47` | READ on file not open for input |
| `48` | WRITE on file not open for output |
| `91` | File locked |
| `92` | File in use |
| `9N` | IBM i specific error (N = reason code) |

### Commitment Control
For transactional integrity with database files:

```cobol
*> Enable commitment control
COMMIT.                  *> Commit all changes since last commit
ROLLBACK.                *> Roll back all changes since last commit
```

CL commands for commitment control:
- `STRCMTCTL`: Start commitment control
- `ENDCMTCTL`: End commitment control

---

## Error and Exception Handling

### Declaratives for File Errors
```cobol
       PROCEDURE DIVISION.
       DECLARATIVES.
       FILE-ERROR SECTION.
           USE AFTER STANDARD ERROR PROCEDURE ON FILE-1.
       ERROR-ROUTINE.
           EVALUATE FILE-STATUS-CODE
               WHEN "23"  DISPLAY "RECORD NOT FOUND"
               WHEN "22"  DISPLAY "DUPLICATE KEY"
               WHEN OTHER DISPLAY "FILE ERROR: " FILE-STATUS-CODE
           END-EVALUATE.
       END DECLARATIVES.
```

### File Status Checking
```cobol
       FILE-CONTROL.
           SELECT FILE-1
               ASSIGN TO DISK-SAMPLE
               FILE STATUS IS FILE-STATUS-CODE.

       WORKING-STORAGE SECTION.
       01 FILE-STATUS-CODE  PIC XX VALUE "00".
          88 FS-OK          VALUE "00".
          88 FS-EOF         VALUE "10".
          88 FS-DUP-KEY     VALUE "22".
          88 FS-NOT-FOUND   VALUE "23".
```

### EVALUATE for Error Handling
```cobol
READ FILE-1 NEXT RECORD
    AT END
        SET EOF TO TRUE
    NOT AT END
        PERFORM PROCESS-RECORD
END-READ

IF NOT FS-OK AND NOT FS-EOF
    PERFORM ERROR-HANDLER
END-IF
```

---

## ILE Interlanguage Communication

### Calling Programs
```cobol
CALL "OTHERPROG" USING BY REFERENCE PARAM-1
                       BY VALUE PARAM-2
                       BY CONTENT PARAM-3
```

Parameter passing modes:
- **BY REFERENCE**: Caller and callee share same storage (default)
- **BY VALUE**: Value copied; callee cannot modify caller's data
- **BY CONTENT**: Pointer to value passed; callee cannot modify pointer

### Calling Service Programs
Service program procedures are called using prototype definitions:

```cobol
CALL "SRVPGM/PROCEDURE" USING BY VALUE ARG-1.
```

### Nested Programs
COBOL programs can contain other COBOL programs:
- Contained programs can reference resources of containing program
- GLOBAL clause extends visibility
- INITIAL attribute reinitializes on each call
- RECURSIVE attribute enables recursive calls

```cobol
       IDENTIFICATION DIVISION.
       PROGRAM-ID. OUTER-PROG.
       ...
       PROCEDURE DIVISION.
       MAIN-LOGIC.
           CALL "INNER-PROG".
           GOBACK.

       IDENTIFICATION DIVISION.
       PROGRAM-ID. INNER-PROG.
       ...
       PROCEDURE DIVISION.
           DISPLAY "Inside nested program".
           GOBACK.
       END PROGRAM INNER-PROG.
       END PROGRAM OUTER-PROG.
```

---

## COBOL and the eBusiness World

### COBOL and XML
ILE COBOL provides XML GENERATE and XML PARSE statements for producing and consuming XML data:
- **XML GENERATE**: Converts COBOL data structures into XML text
- **XML PARSE**: Parses XML text into COBOL data structures, with event-driven processing via special registers (XML-CODE, XML-EVENT, XML-TEXT, XML-NTEXT)

### COBOL and MQSeries
ILE COBOL can integrate with IBM MQSeries for message queue operations:
- Send and receive messages via MQSeries APIs
- Use CALL statements to invoke MQSeries API programs
- Support for distributed application communication

### COBOL and Java Programs
ILE COBOL can interoperate with Java programs:
- Call Java methods from COBOL using CALL statement
- Use the Java Native Interface (JNI) from COBOL
- Access Java objects and classes
- Run COBOL and Java in the same ILE activation group

---

## Accessing Externally Attached Devices

ILE COBOL accesses external hardware through device files. Device files provide access to displays, printers, tapes, diskettes, and remote systems via communications lines.

### Types of Device Files

| Device Type | Description |
|-------------|-------------|
| **Printer files** | Output to printers; support LINAGE, line spacing, form control |
| **Tape files** | Sequential file storage on magnetic tape |
| **Diskette files** | Sequential file storage on diskette media |
| **Display files** | Interactive workstation display I/O |
| **ICF files** | Intersystem Communications Function for program-to-program communication |

### Accessing Printer Devices
- Use FD entry with printer file format (Format 4)
- LINAGE clause for page formatting
- WRITE...AFTER ADVANCING for line/form control
- END-PAGE declarative for page overflow handling

### Accessing Tape Devices
- Sequential organization only
- BLOCK CONTAINS clause for blocking factor
- LABEL RECORDS ARE STANDARD for tape labels
- OPEN INPUT/OUTPUT/EXTEND for tape operations

### Accessing Diskette Devices
- Sequential organization
- Format 2 FD entry for diskette files
- LABEL RECORDS ARE STANDARD

### Accessing Display Devices and ICF Files
- Display files for workstation interaction
- ICF files for program-to-program communication
- Externally described via DDS (Data Description Specifications)
- Format 2 COPY statement for external file descriptions
- Indicator usage for function keys, attention keys, display attributes

---

## Using Transaction Files

TRANSACTION files support workstations and program-to-program communication. They enable communication with:
- One or more workstations
- One or more programs on a remote system
- One or more devices on a remote system

### Key Concepts
- TRANSACTION files are usually externally described
- Program-described display files support only simple formatting
- Use Format 2 COPY statement for external file descriptions
- Do not send packed/binary/float data (COMP, COMP-1-5) to display stations as output (may contain control characters causing unpredictable results)

### Subfile Transaction Files
Subfiles enable displaying lists of records on workstation screens:
- Define subfile in DDS with SFL keyword
- Load subfile with WRITE to subfile record format
- Display subfile with WRITE to subfile control format
- Read user selections with READ from subfile record format

### Indicators with Transaction Files
- Indicators control display attributes and function key responses
- Defined in DDS and referenced in COBOL via ACCEPT/DISPLAY
- Used for function key detection, error highlighting, input validation

### Defining Transaction Files Using DDS
DDS (Data Description Specifications) define:
- Record formats and field layouts
- Display attributes (color, highlighting, reverse image)
- Function key assignments
- Validity checking rules
- Help text specifications

---

## Using DISK and DATABASE Files

### DISK vs DATABASE Files

| Feature | DISK Files | DATABASE Files |
|---------|-----------|----------------|
| Description | Program-described | Externally described via DDS |
| Creation | Created in program | Created with CRTPF/CRTLF |
| Fields | Defined in FD entry | Defined in DDS, referenced via COPY |
| Flexibility | Limited | Full DB2 for i integration |

### File Organization and Access Paths
- **Sequential**: Records in arrival sequence
- **Indexed**: Keyed access path maintained by system
- **Relative**: Access by relative record number
- **Arrival sequence**: Physical order of records

### File Processing Methods
- **Sequential processing**: READ NEXT through file
- **Random processing**: READ by key (indexed) or relative record number (relative)
- **Dynamic processing**: Mix of sequential and random access

### IBM i System Files
Special system files available:
- QSYS.LIB objects
- Source physical files (QCBLLESRC, etc.)
- Save files for backup/restore

### DDM Files (Distributed Data Management)
- Access files on remote IBM i systems
- Transparent to COBOL program (same file operations)
- DDM files defined with CRTDDMF command
- Support for non-IBM i systems via DDM
- Direct (relative) file support available

### Distributed Files
- Files spread across multiple IBM i systems
- Transparent access from COBOL programs
- System manages data distribution

### Processing Files with Constraints
- Referential constraints: Parent/child file relationships
- Unique constraints: No duplicate keys
- Check constraints: Validation rules on fields
- Constraint violations return file status errors

---

## ILE Concepts

### Modules and Binding
- **Module**: Compiled unit that has not been linked into an executable
- **Program Object**: Executable created by binding one or more modules
- **Service Program**: Reusable collection of procedures, bound dynamically

### Activation Groups
Substructures within a job that manage resources:
- Static and automatic variables
- Open files and commitment control
- Shared resources among programs in the same group

### Exception Handling
- **Declaratives**: COBOL-level exception handling via USE statements
- **ILE condition handlers**: Language-independent exception management
- **Message handling**: Send, receive, and monitor messages

### Multi-threading
ILE COBOL supports multi-threaded programs with `THREAD(SERIALIZE)` option:
- Each thread has its own storage for LOCAL-STORAGE items
- WORKING-STORAGE is shared across threads
- Serialization prevents concurrent access conflicts

---

## Data Types and Usage

### Numeric Data
| USAGE | Storage | Range |
|-------|---------|-------|
| DISPLAY (zoned) | 1 byte/digit | 1-18 digits |
| COMP/COMP-4/BINARY | 2/4/8 bytes | 4/9/18 digits |
| COMP-3 (packed) | 1 byte/2 digits + sign | 1-18 digits |
| COMP-1 (float) | 4 bytes | IEEE single |
| COMP-2 (float) | 8 bytes | IEEE double |
| COMP-5 (binary) | 2/4/8 bytes | Native range |

### Date/Time Data (IBM Extension)
```cobol
01 ORDER-DATE    TYPE DATE FORMAT "YYYY-MM-DD".
01 ORDER-TIME    TYPE TIME FORMAT "HH:MM:SS".
01 TIMESTAMP     TYPE TIMESTAMP FORMAT "YYYY-MM-DD HH:MM:SS.UUUUUU".
```

Date/time intrinsic functions:
- `CURRENT-DATE`: Returns 21-char field (date, time, GMT offset)
- `CONVERT-DATE-TIME`: Convert between formats
- `EXTRACT-DATE-TIME`: Extract component from date/time
- `ADD-DURATION` / `SUBTRACT-DURATION`: Date arithmetic
- `FIND-DURATION`: Calculate duration between two dates/times
- `TEST-DATE-TIME`: Validate date/time values

### Pointers and Dynamic Storage
```cobol
       WORKING-STORAGE SECTION.
       01 MY-PTR        USAGE POINTER.
       01 MY-DATA       PIC X(100) BASED.

       PROCEDURE DIVISION.
       ALLOCATE MY-DATA.                    *> Allocate dynamic storage
       SET ADDRESS OF MY-DATA TO MY-PTR.   *> Associate pointer
       ...
       FREE MY-DATA.                        *> Release dynamic storage
```

---

## Best Practices

### Coding Standards
- Use meaningful data names and paragraph names
- Use scope terminators (END-IF, END-READ, END-PERFORM) for clarity
- Use EVALUATE instead of nested IFs for multi-way branching
- Use PERFORM with THRU carefully; prefer explicit paragraph ranges
- Use reference modification instead of redefining for substring access
- Use intrinsic functions instead of manual calculations

### Performance
- Use COMP/COMP-3 for numeric data in arithmetic operations
- Use COMP-5 for binary data requiring full native range
- Use OPTIMIZE(*FULL) for production programs
- Minimize file I/O by using appropriate access modes
- Use COMMIT/ROLLBACK for transactional database operations

### Debugging
- Compile with DBGVIEW(*ALL) for development
- Use UPDPROD(*NO) to protect production data during debugging
- Set conditional breakpoints for targeted debugging
- Use WATCH to detect when variables change
- Use EVAL to inspect and modify variables at runtime
