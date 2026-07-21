# ILE COBOL Divisions Reference

## 1. Identification Division

The Identification Division must be the first division in every COBOL source program. It names the program and provides documentary information.

### Paragraphs (in order)
| Paragraph | Required | Purpose |
|-----------|----------|---------|
| `PROGRAM-ID` | Yes | Names the program; must be first |
| `AUTHOR` | No | Programmer name |
| `INSTALLATION` | No | Organization/location |
| `DATE-WRITTEN` | No | Date program was written |
| `DATE-COMPILED` | No | Compilation date (auto-filled) |
| `SECURITY` | No | Classification level |

### PROGRAM-ID Paragraph
```cobol
       IDENTIFICATION DIVISION.
       PROGRAM-ID. IDSAMPLE.
```
- The program name must follow IBM i naming conventions
- For nested programs, PROGRAM-ID is the only required paragraph
- `INITIAL` attribute: Program is initialized each time it is called
- `RECURSIVE` attribute: Program supports recursive calls (uses LOCAL-STORAGE)

### Example
```cobol
       IDENTIFICATION DIVISION.
       PROGRAM-ID.     IDSAMPLE.
       AUTHOR.         PROGRAMMER NAME.
       INSTALLATION.   COBOL DEVELOPMENT CENTER.
       DATE-WRITTEN.   12/02/94.
       DATE-COMPILED.  12/09/94 12:57:53.
       SECURITY.       NON-CONFIDENTIAL.
```

---

## 2. Environment Division

The Environment Division is optional. It describes the computer environment and file configuration. Cannot be specified in a nested program.

### Configuration Section
Describes source and object computers, special names, and collating sequences.

#### Paragraphs
| Paragraph | Purpose |
|-----------|---------|
| `SOURCE-COMPUTER` | Computer on which source is compiled |
| `OBJECT-COMPUTER` | Computer on which object runs |
| `SPECIAL-NAMES` | Relates environment names to mnemonic names; specifies collating sequences, currency signs, class names, linkage types, date formats |

#### SPECIAL-NAMES Clauses
- **ALPHABET Clause**: Relates alphabet names to character sets or collating sequences
- **CLASS Clause**: Defines class names for sets of characters
- **CURRENCY SIGN Clause**: Defines currency symbol for PICTURE clauses
- **DECIMAL-POINT IS COMMA**: Interchanges comma and period functions
- **LINKAGE TYPE Clause**: Specifies linkage type for CALL/CANCEL/SET...ENTRY
- **LOCALE Clause**: Associates locale with a name
- **FORMAT Clause**: Default date/time format
- **CONSOLE Clause**: Assigns mnemonic to console
- **CRT STATUS Clause**: Defines CRT status data item
- **CURSOR Clause**: Defines cursor position data item
- **PROGRAM STATUS Clause**: Defines program status data item

```cobol
       ENVIRONMENT DIVISION.
       CONFIGURATION SECTION.
       SOURCE-COMPUTER. IBM-ISERIES.
       OBJECT-COMPUTER. IBM-ISERIES.
       SPECIAL-NAMES.
           ALPHABET ALPHA-NAME IS STANDARD-1
           CURRENCY SIGN IS "$"
           CLASS HEX-DIGITS IS "0" THRU "9" "A" THRU "F".
```

### Input-Output Section
Defines files, identifies external storage, assigns files to I/O devices, specifies data transmission information.

#### FILE-CONTROL Paragraph
```cobol
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT FILE-1
               ASSIGN TO DISK-SAMPLE
               ORGANIZATION IS SEQUENTIAL
               ACCESS MODE IS SEQUENTIAL
               FILE STATUS IS FILE-STATUS-CODE.
```

##### SELECT Clause Keywords
- **ASSIGN**: Associates file with external device/file
- **RESERVE**: Allocates I/O buffers
- **ORGANIZATION**: SEQUENTIAL, INDEXED, RELATIVE, LINE SEQUENTIAL
- **ACCESS MODE**: SEQUENTIAL, RANDOM, DYNAMIC
- **RECORD KEY**: Primary key for indexed files
- **ALTERNATE RECORD KEY**: Alternate keys for indexed files
- **RELATIVE KEY**: Key for relative files
- **FILE STATUS**: Status code data item
- **PADDING CHARACTER**: Padding for fixed-length records
- **RECORD DELIMITER**: Delimiter for variable-length records

#### I-O-CONTROL Paragraph
- **RERUN**: Checkpoint/restart specification
- **SAME AREA**: Share I/O area among files
- **SAME RECORD AREA**: Share record area among files
- **SAME SORT AREA**: Share sort work area
- **SAME SORT-MERGE AREA**: Share sort/merge work area
- **MULTIPLE FILE TAPE**: Multiple files on tape
- **COMMITMENT CONTROL**: Commitment control participation

#### File Types on IBM i
- **Database Files**: Physical/logical files in DB2 for i
- **Device Files**: Printer, display, tape, diskette files
- **DDM Files**: Distributed Data Management remote files
- **Distributed Files**: Files across multiple systems
- **Save Files**: Backup/restore files

---

## 3. Data Division

The Data Division describes all data to be processed. Optional in a COBOL source program.

### Structure
Must begin with `DATA DIVISION.` followed by a period and space. Sections must appear in order:

1. **File Section** - Describes externally stored files and sort-merge files
2. **Working-Storage Section** - Describes program-internal data with initial values
3. **Local-Storage Section** - Per-invocation storage for recursive programs
4. **Linkage Section** - Describes data provided by calling programs (no storage allocated)

### File Section
Contains File Description (FD) and Sort Description (SD) entries followed by record description entries.

#### FD/SD Entry Formats
| Format | File Type |
|--------|-----------|
| Format 1 | Sequential file |
| Format 2 | Diskette file |
| Format 3 | Tape file |
| Format 4 | Printer file |
| Format 5 | Sort or merge file (SD) |
| Format 6 | Transaction file (IBM extension) |

#### FD Clauses
- **EXTERNAL**: File shared across programs
- **GLOBAL**: File visible to nested programs
- **BLOCK CONTAINS**: Block size for blocked records
- **RECORD**: Record size (CONTAINS, VARYING)
- **LABEL RECORDS**: STANDARD or OMITTED
- **VALUE OF**: File label value
- **DATA RECORDS**: Names of record descriptions
- **LINAGE**: Page formatting for printer files
- **CODE-SET**: Character set for file data

```cobol
       FILE SECTION.
       FD  FILE-1
           LABEL RECORDS ARE STANDARD
           RECORD CONTAINS 80 CHARACTERS
           BLOCK CONTAINS 10 RECORDS.
       01  RECORD-1.
           05 NAME-FIELD      PIC X(20).
           05 NO-OF-DEP       PIC 9(2).
```

### Working-Storage Section
Describes data items internal to the program. Items can have initial values via VALUE clause.

```cobol
       WORKING-STORAGE SECTION.
       01 COUNTER            PIC 9(4) VALUE 0.
       01 CUSTOMER-RECORD.
           05 CUST-NAME      PIC X(30).
           05 CUST-BALANCE   PIC S9(7)V99 COMP-3.
       77 WORK-PTR           USAGE POINTER.
```

### Local-Storage Section
Provides per-invocation storage. Each time the program is called, local-storage items are reinitialized. Used with RECURSIVE programs.

### Linkage Section
Describes data items provided by the calling program. No storage is allocated; storage exists elsewhere.

Restrictions:
- VALUE clause not allowed (except level-88); treated as comment if specified (IBM extension)
- EXTERNAL clause not allowed
- GLOBAL clause allowed for level-01 items (IBM extension)

```cobol
       LINKAGE SECTION.
       01 INPUT-PARAMETER    PIC X(50).
       01 RETURN-VALUE       PIC S9(9) BINARY.
```

### Data Description Entry
Specifies characteristics of a data item. Five formats:

| Format | Purpose |
|--------|---------|
| Format 1 | Standard data description (all sections) |
| Format 2 | RENAMES (regroups previously defined items, level 66) |
| Format 3 | Condition names (level 88) |
| Format 4 | Boolean data items (IBM extension) |
| Format 5 | Table of type-name entries (IBM extension) |

#### Level Numbers
| Level | Purpose |
|-------|---------|
| 01 | Record or independent item |
| 02-49 | Group/elementary items within a record |
| 66 | RENAMES clause |
| 77 | Independent elementary item (no subdivisions) |
| 88 | Condition name |

#### Key Data Division Clauses

**PICTURE (PIC)**: Specifies data type and editing. Max 90 characters in PICTURE string.

PICTURE symbols:
| Symbol | Meaning |
|--------|---------|
| `X` | Alphanumeric character |
| `9` | Numeric digit |
| `A` | Alphabetic character |
| `S` | Sign (leading) |
| `V` | Implied decimal point |
| `$` | Currency symbol |
| `,` `.` | Editing characters |
| `Z` | Zero suppression |
| `*` | Asterisk fill |
| `B` | Blank insertion |
| `0` | Zero insertion |
| `/` | Slash insertion |
| `CR` `DB` | Credit/Debit editing |
| `P` | Scaling position |

```cobol
05 SALARY        PIC S9(7)V99 COMP-3.
05 SALARY-DISP   PIC $ZZ,ZZ9.99.
05 NAME          PIC X(30).
05 FLAG          PIC X VALUE "Y".
```

**USAGE**: Specifies data representation in storage.

| USAGE | Description |
|-------|-------------|
| `DISPLAY` | Default; one digit per byte (zoned decimal) |
| `BINARY` | Binary representation |
| `COMP` / `COMPUTATIONAL` | Binary (same as BINARY) |
| `COMP-1` | Internal floating-point (4 bytes) |
| `COMP-2` | Internal floating-point (8 bytes, double precision) |
| `COMP-3` / `COMPUTATIONAL-3` | Packed decimal (internal decimal) |
| `COMP-4` | Binary (same as BINARY) |
| `COMP-5` | Binary with native range |
| `PACKED-DECIMAL` | Packed decimal (same as COMP-3) |
| `INDEX` | Index data item for table handling |
| `NATIONAL` | National character (Unicode) |
| `POINTER` | Pointer data item |
| `PROCEDURE-POINTER` | Procedure pointer |
| `DISPLAY-1` | DBCS (Double-Byte Character Set) |

**OCCURS**: Defines tables (arrays). Format 1 = fixed length, Format 2 = variable length.

```cobol
05 MONTH-SALES   PIC 9(7)V99 OCCURS 12 TIMES.
05 SALES-TABLE.
   10 MONTH-SALE  PIC 9(7)V99 OCCURS 12 TIMES
                    INDEXED BY MONTH-INDEX
                    ASCENDING KEY IS MONTH-SALE.
```

**Other important clauses**:
- **BLANK WHEN ZERO**: Display blanks when value is zero
- **EXTERNAL**: Share data across separately compiled programs
- **GLOBAL**: Visible to nested programs
- **JUSTIFIED (JUST)**: Right-justify alphanumeric data
- **LIKE**: Copy attributes from another data item
- **REDEFINES**: Overlay storage with different description
- **RENAMES**: Regroup items (level 66)
- **SIGN**: Specify sign position (leading/trailing, separate/overpunched)
- **SYNCHRONIZED (SYNC)**: Align data on boundary
- **TYPE**: Associate with user-defined type
- **TYPEDEF**: Define a user-defined type
- **VALUE**: Specify initial value
- **FORMAT**: Date/time/timestamp format (IBM extension)

```cobol
01 DATE-FIELD TYPE DATE FORMAT "YYYY-MM-DD".
01 OLD-RECORD REDEFINES NEW-RECORD.
01 EOF-FLAG     PIC X VALUE "N".
   88 END-OF-FILE VALUE "Y".
```

---

## 4. Procedure Division

The Procedure Division is optional. It contains the executable logic: optional declaratives, sections, paragraphs, sentences, and statements.

### Structure
```
PROCEDURE DIVISION [USING ...].
    [DECLARATIVES.
     [section-name SECTION.
      USE ... .
      [paragraphs]
     ...]
    END DECLARATIVES.]
    [section-name SECTION.
     [paragraph-name.]
     [sentences]
    ...]
```

### Formats
- **Format 1**: With Sections and Paragraphs
- **Format 2**: With Paragraphs Only

### Procedure Division Header
The USING phrase specifies parameters received from a calling program:
```cobol
       PROCEDURE DIVISION USING BY VALUE PARAM-1
                                  BY REFERENCE PARAM-2
                                  BY CONTENT PARAM-3.
```

### Declaratives
Special-purpose sections executed when an exception condition occurs.

- Must be at the beginning of the Procedure Division
- Entire Procedure Division must be divided into sections when declaratives are used
- Each declarative section starts with a USE sentence
- USE sentence defines conditions; succeeding paragraphs specify actions
- DECLARATIVES and END DECLARATIVES begin in Area A
- Declarative procedures run as separate invocations
- No reference to nondeclarative procedures from within declaratives

```cobol
       PROCEDURE DIVISION.
       DECLARATIVES.
       ERROR-SECTION SECTION.
           USE AFTER STANDARD ERROR PROCEDURE ON FILE-1.
       ERROR-HANDLER.
           DISPLAY "FILE ERROR: " FILE-STATUS-CODE.
           PERFORM ERROR-RECOVERY.
       END DECLARATIVES.
```

### Procedures
- **Section**: Named grouping of paragraphs (optional)
- **Paragraph**: Named grouping of sentences
- **Sentence**: One or more statements ending with a period
- **Statement**: A COBOL verb with operands

### Procedure Division Statements (Complete List)

#### I/O Statements
| Statement | Purpose |
|-----------|---------|
| `OPEN` | Open a file for processing |
| `CLOSE` | Close a file |
| `READ` | Read a record from a file |
| `WRITE` | Write a record to a file |
| `REWRITE` | Replace a record in a file |
| `DELETE` | Delete a record from a file |
| `START` | Position a file at a specific record |
| `ACCEPT` | Receive data from device/system |
| `DISPLAY` | Output data to display/printer |

#### Arithmetic Statements
| Statement | Purpose |
|-----------|---------|
| `ADD` | Add operands to receiving items |
| `SUBTRACT` | Subtract operands from receiving items |
| `MULTIPLY` | Multiply operands |
| `DIVIDE` | Divide operands |
| `COMPUTE` | Evaluate arithmetic expression |
| `INITIALIZE` | Initialize data items to predefined values |

#### Data Movement Statements
| Statement | Purpose |
|-----------|---------|
| `MOVE` | Move data between items |
| `STRING` | Concatenate strings |
| `UNSTRING` | Split strings into components |
| `INSPECT` | Examine/replace characters in string |

#### Control Statements
| Statement | Purpose |
|-----------|---------|
| `IF` | Conditional execution |
| `EVALUATE` | Multi-way branching (like switch/case) |
| `PERFORM` | Execute a paragraph/section/range |
| `GO TO` | Unconditional branch |
| `GOBACK` | Return to calling program |
| `EXIT` | Exit from a paragraph/section |
| `EXIT PROGRAM` | Exit from a called program |
| `STOP` | Terminate program execution |
| `CONTINUE` | No operation (placeholder) |

#### Table/Sort Statements
| Statement | Purpose |
|-----------|---------|
| `SEARCH` | Search a table (serial or binary) |
| `SET` | Set index/pointer values |
| `SORT` | Sort a file or table |
| `MERGE` | Merge sorted files |
| `RELEASE` | Release record to sort/merge |
| `RETURN` | Retrieve record from sort/merge |

#### Program Control Statements
| Statement | Purpose |
|-----------|---------|
| `CALL` | Call another program |
| `CANCEL` | Cancel (reset) a called program |
| `ENTER` | Enter another language module |
| `ALTER` | Modify a GO TO statement target |

#### Database/Transaction Statements
| Statement | Purpose |
|-----------|---------|
| `COMMIT` | Commit transaction changes |
| `ROLLBACK` | Roll back transaction changes |
| `ACQUIRE` | Acquire a resource |
| `DROP` | Drop a resource |

#### Memory Management (IBM Extension)
| Statement | Purpose |
|-----------|---------|
| `ALLOCATE` | Obtain dynamic storage |
| `FREE` | Release dynamic storage |

#### XML Statements
| Statement | Purpose |
|-----------|---------|
| `XML GENERATE` | Generate XML from data items |
| `XML PARSE` | Parse XML into data items |

### Key Statement Examples

#### IF Statement
```cobol
IF AMOUNT > 1000
    PERFORM HIGH-VALUE-PROCESS
ELSE
    PERFORM LOW-VALUE-PROCESS
END-IF.
```

#### EVALUATE Statement
```cobol
EVALUATE TRUE
    WHEN STATUS-CODE = "00"
        PERFORM SUCCESS-LOGIC
    WHEN STATUS-CODE = "10"
        PERFORM END-OF-FILE-LOGIC
    WHEN OTHER
        PERFORM ERROR-LOGIC
END-EVALUATE.
```

#### PERFORM Statement
```cobol
PERFORM PROCESS-RECORD
PERFORM PROCESS-RECORD UNTIL END-OF-FILE
PERFORM VARYING I FROM 1 BY 1 UNTIL I > 10
    PROCESS TABLE-ITEM(I)
END-PERFORM
PERFORM PARA-1 THRU PARA-3
```

#### CALL Statement
```cobol
CALL "SUBPROG" USING BY REFERENCE PARAM-1
                     BY VALUE PARAM-2
```

#### READ Statement
```cobol
READ FILE-1 RECORD INTO WORK-RECORD
    AT END
        SET END-OF-FILE TO TRUE
    NOT AT END
        PERFORM PROCESS-RECORD
END-READ.
```

#### SEARCH Statement
```cobol
SEARCH TABLE-ENTRY
    AT END
        DISPLAY "NOT FOUND"
    WHEN TABLE-ENTRY(KEY-INDEX) = SEARCH-VALUE
        PERFORM FOUND-LOGIC
END-SEARCH.
```
