# ILE COBOL Language Structure

## Characters and Character-Strings
The indivisible unit of data in COBOL is the character. The COBOL character set includes:
- **Letters**: A-Z, a-z
- **Digits**: 0-9
- **Special characters**: `+ - * / = $ , . ; " ' ( ) < > :` space
- **IBM extensions**: apostrophe (`'`), underscore (`_`), `#`, `@`, `%`

A **character-string** is a sequence of contiguous characters forming a COBOL word, literal, PICTURE character-string, or comment. Character-strings are delimited by **separators** (punctuation characters).

### Separators
- Space (one or more)
- Period followed by a space
- Comma followed by a space (optional)
- Semicolon followed by a space (optional)
- Apostrophe/quote delimiters for literals
- Pseudo-text delimiters (`==`)

## Sections and Paragraphs
Sections and paragraphs define a program. They are subdivided into clauses and statements.

| Division | Hierarchy |
|----------|-----------|
| Identification | Paragraphs > Entries > Clauses |
| Environment | Sections > Paragraphs > Entries > Clauses > Phrases |
| Data | Sections > Entries > Clauses > Phrases |
| Procedure | Sections > Paragraphs > Sentences > Statements > Phrases |

- **SECTION**: A logical grouping of paragraphs or entries; optional in Procedure Division
- **Paragraph**: A named subdivision of a section containing sentences/statements
- **Sentence**: One or more statements terminated by a period
- **Statement**: A COBOL verb with its operands
- **Clause**: An attribute specification in a data description entry
- **Phrase**: A subdivision of a clause or statement

## Reference Format
COBOL programs use an 80-character source line:

| Area | Columns | Purpose |
|------|---------|---------|
| Sequence Number | 1-6 | Optional numbering |
| Indicator Area | 7 | `*` = comment, `-` = continuation, `/` = page eject |
| Area A | 8-11 | Division/section/paragraph headers, level numbers 01/77 |
| Area B | 12-72 | Statements, clauses, entries |
| Comment Area | 73-80 | Ignored by compiler |

## Figurative Constants
Reserved words naming specific constant values:

| Constant | Value |
|----------|-------|
| `ZERO` / `ZEROS` / `ZEROES` | Numeric 0 or nonnumeric "0" |
| `SPACE` / `SPACES` | Space character(s) |
| `HIGH-VALUE` / `HIGH-VALUES` | Highest collating position |
| `LOW-VALUE` / `LOW-VALUES` | Lowest collating position |
| `QUOTE` / `QUOTES` | Quote character (or apostrophe if APOST) |
| `ALL literal` | Repeating literal |
| `NULL` / `NULLS` | Undefined value (IBM extension) |

Usage example:
```cobol
MOVE SPACE TO DATA-NAME-1
MOVE SPACES TO DATA-NAME-1
MOVE ALL SPACES TO DATA-NAME-1
```

## Special Registers
Compiler-generated storage areas with fixed names:

| Register | Purpose |
|----------|---------|
| `ADDRESS OF` | Address of a linkage section item |
| `DB-FORMAT-NAME` | Database format name |
| `DEBUG-ITEM` | Debug information |
| `FORMAT OF` | Format name of date/time item |
| `LENGTH OF` | Byte length of data item |
| `LINAGE-COUNTER` | Line count for linage files |
| `LOCALE OF` | Locale name of item |
| `RETURN-CODE` | Program return code |
| `SORT-RETURN` | Sort operation status |
| `WHEN-COMPILED` | Compilation date/time |
| `XML-CODE` | XML parsing status |
| `XML-EVENT` | XML parsing event |
| `XML-TEXT` | XML parsed text |
| `XML-NTEXT` | XML parsed national text |

## Data Reference and Name Scoping

### Methods of Data Reference
- **Qualification**: Referencing a data item by its parent (`NAME OF RECORD-1`)
- **Subscripting**: Accessing table elements (`TABLE-ITEM(1)`)
- **Reference modification**: Extracting substring (`STRING-ITEM(1:5)`)
- **Function-identifier**: Using intrinsic function results (`FUNCTION LENGTH(ITEM)`)
- **User-defined data types**: Using TYPEDEF-defined types

### Scope of Names
- A data name is visible within the program where it is defined and in contained (nested) programs
- `GLOBAL` clause extends visibility to all programs in the compilation unit
- `LOCAL-STORAGE` section provides per-invocation storage for recursive programs
- `EXTERNAL` clause makes data items shared across separately compiled programs

## Transfer of Control
- **Implicit transfer**: Sequential execution of statements in order written
- **Explicit transfer**: GO TO, PERFORM, EVALUATE, IF statements
- **Next executable statement**: The statement that executes after the current one completes
- Control transfers implicitly after PERFORM range, SORT/MERGE procedures, and declarative procedures

## Expressions

### Arithmetic Expressions
Built from operands and operators with strict hierarchy and precedence:

**Operands**: numeric literals, numeric identifiers, figurative constant ZERO, numeric functions, parenthesized expressions

**Operators** (in precedence order):
1. Unary `+`, `-`
2. Exponentiation `**`
3. Multiplication `*`, Division `/`
4. Addition `+`, Subtraction `-`

```cobol
COMPUTE RESULT = (A + B) * C / D ** 2
```

### Conditional Expressions
Cause the program to select alternative paths based on truth value. Used in EVALUATE, IF, PERFORM, and SEARCH statements.

**Simple conditions**:
- **Relation conditions**: `IF A > B`, `IF X EQUAL TO Y`
- **Sign conditions**: `IF A IS POSITIVE`, `IF B IS NEGATIVE`
- **Switch-status conditions**: Test mnemonic switches
- **Class conditions**: `IF X IS NUMERIC`, `IF Y IS ALPHABETIC`
- **Condition-name conditions**: Test level-88 condition names

**Complex conditions**: Combined with AND, OR, NOT
```cobol
IF A > 0 AND B < 10 OR C = 5
    PERFORM PROCESS-RECORD
END-IF
```

## Statement Categories

| Category | Description |
|----------|-------------|
| **Imperative** | Execute unconditionally; no conditional evaluation |
| **Conditional** | Evaluate a condition to determine execution path |
| **Delimited scope** | Explicit scope terminators (END-IF, END-READ, etc.) |
| **Compiler-directing** | Direct compiler action (COPY, REPLACE, EJECT, TITLE) |

## Intrinsic Functions
Functions that perform mathematical, character, or logical operations. Grouped into six categories:

### Mathematical
`ACOS`, `ASIN`, `ATAN`, `COS`, `SIN`, `TAN`, `LOG`, `LOG10`, `SQRT`, `FACTORIAL`, `MOD`, `REM`

### Statistical
`MAX`, `MIN`, `MEAN`, `MEDIAN`, `MIDRANGE`, `RANGE`, `STANDARD-DEVIATION`, `VARIANCE`, `SUM`, `ORD-MAX`, `ORD-MIN`

### Date/Time
`CURRENT-DATE`, `DATE-OF-INTEGER`, `DAY-OF-INTEGER`, `INTEGER-OF-DATE`, `INTEGER-OF-DAY`, `DATE-TO-YYYYMMDD`, `DAY-TO-YYYYDDD`, `YEAR-TO-YYYY`, `WHEN-COMPILED`, `ADD-DURATION`, `SUBTRACT-DURATION`, `FIND-DURATION`, `CONVERT-DATE-TIME`, `EXTRACT-DATE-TIME`, `TEST-DATE-TIME`, `LOCALE-DATE`, `LOCALE-TIME`

### Financial
`ANNUITY`, `PRESENT-VALUE`

### Character-Handling
`LENGTH`, `UPPER-CASE`, `LOWER-CASE`, `REVERSE`, `TRIM`, `TRIML`, `TRIMR`, `CHAR`, `ORD`, `NUMVAL`, `NUMVAL-C`, `DISPLAY-OF`, `NATIONAL-OF`, `UTF8STRING`

### General
`INTEGER`, `INTEGER-PART`, `RANDOM`, `PARMS`

Usage:
```cobol
MOVE FUNCTION UPPER-CASE(INPUT-STRING) TO OUTPUT-STRING
COMPUTE AVG = FUNCTION MEAN(TABLE-ITEM(ALL))
IF FUNCTION LENGTH(DATA-ITEM) > 10
    PERFORM LONG-STRING-LOGIC
END-IF
```

## Compiler-Directing Statements

| Statement | Purpose |
|-----------|---------|
| `COPY` | Include source from a library/copybook |
| `REPLACE` | Text substitution in source |
| `EJECT` | Force new page in source listing |
| `TITLE` | Set source listing title |
| `SKIP1/2/3` | Skip lines in source listing |
| `*CONTROL (*CBL)` | Set compiler options in source |
| `PROCESS` | Set compiler processing options |
| `USE` | Define declarative exception procedures |

## Conditional Compilation
Conditional compilation includes or omits selected lines of source code depending on values of literals specified by the DEFINE directive. Enables creating multiple variants of a program without maintaining separate source streams.

### Directives
- **DEFINE**: Defines or undefines a compilation variable (symbolic reference to a literal value)
- **EVALUATE**: Multi-branch method of choosing source lines to include in a compilation group
- **IF**: One-way or two-way conditional compilation

### Rules
- Conditional compilation directives appearing before COPY/REPLACE are processed first
- Not affected by substitutions from REPLACE or REPLACING phrase of COPY
- May appear in copybooks
- Constant conditional expressions evaluated during processing to determine included text
- Compile-time arithmetic expressions allowed in DEFINE and EVALUATE directives

### Predefined Compilation Variables
The compiler automatically defines certain compilation variables that can be referenced in conditional compilation directives.

```cobol
       >>DEFINE VERSION-FLAG AS 2
       >>IF VERSION-FLAG > 1
           *> New feature code here
       >>ELSE
           *> Legacy code here
       >>END-IF
```

## Appendixes Summary

### Appendix A: Compiler Limits
Most compiler limits are very large numbers depending on hardware configuration. Most applications should not encounter them.

### Appendix B: Intermediate Results and Arithmetic Precision
The compiler handles arithmetic statements as successive operations by operator precedence, setting up intermediate fields. Key areas:
- ADD/SUBTRACT with multiple operands
- COMPUTE with series of operations or multiple result fields
- Arithmetic expressions in conditional statements
- GIVING option with multiple result fields
- Intrinsic functions used as operands
- Fixed-point vs floating-point arithmetic selection

### Appendix C: EBCDIC and ASCII Collating Sequences
IBM i uses EBCDIC by default. The ascending collating sequences for both EBCDIC and ASCII are documented with symbol, meaning, ordinal number, decimal representation, and hexadecimal representation for each character.

### Appendix D: Function-Name and Context-Sensitive Word List
Lists all function names (intrinsic functions) and context-sensitive words that have special meaning only in specific contexts.

### Appendix E: Reserved Word List
Complete list of ILE COBOL reserved words that cannot be used as user-defined names.

### Appendix F: File Structure Support Summary and Status Key Values
Summarizes file structure support by organization and access mode, with complete status key values for all file operations.

### Appendix G: PROCESS Statement
Full specification of all PROCESS statement compiler options (covered in PROCESS Statement section above).

### Appendix H: Complex OCCURS DEPENDING ON
Extension to COBOL 85 Standard supporting variable-length records with complex ODO. Basic forms:
- **Variably located item/group**: ODO item followed by nonsubordinate data item
- **Variably located table**: ODO item followed by nonsubordinate OCCURS item
- **Table with variable-length elements**: OCCURS item containing subordinate ODO item
- **Index name for variable-length element table**
- **Element of variable-length element table**

```cobol
01 FIELD-A.
   02 COUNTER-1    PIC S99.
   02 COUNTER-2    PIC S99.
   02 TABLE-1.
      03 RECORD-1 OCCURS 1 TO 5 TIMES
                  DEPENDING ON COUNTER-1 PIC X(3).
   02 EMPLOYEE-NUMBER PIC X(5).
   02 TABLE-2 OCCURS 5 TIMES INDEXED BY INDX.
      03 TABLE-ITEM PIC 99.
      03 RECORD-2 OCCURS 1 TO 3 TIMES
                  DEPENDING ON COUNTER-2.
         04 DATA-NUM PIC S99.
```

Rules:
- ODO object = the DEPENDING ON variable; ODO subject = the OCCURS item
- Length = ODO object value x ODO subject length
- Must set every ODO object in a group before referencing any complex ODO item
- Changing ODO object value affects all dependent items

### Appendix I: ACCEPT/DISPLAY and COBOL/2 Considerations
Covers compatibility considerations for ACCEPT/DISPLAY statements between ILE COBOL and COBOL/2.

## PROCESS Statement
The PROCESS statement (or *CONTROL/*CBL) specifies compiler options. Must appear before the IDENTIFICATION DIVISION.

```cobol
       PROCESS NOMONOPRC NOSTDTRUNC OPTIONS THREAD(SERIALIZE).
```

Key compiler options:
- `APOST` / `QUOTE` - Specify literal delimiter
- `MONOPRC` / `NOMONOPRC` - Monopoly program checking
- `STDTRUNC` / `NOSTDTRUNC` - Standard truncation of binary numbers
- `THREAD(SERIALIZE)` - Thread serialization for multi-threaded programs
- `DBGVIEW` - Debug view generation (*ALL, *SOURCE, *LIST, *NONE)
- `OPTIMIZE` - Optimization level (*FULL, *BASIC, *NONE)
- `OPTION` - Compile options (*GEN, *NOGEN, *LIST)
