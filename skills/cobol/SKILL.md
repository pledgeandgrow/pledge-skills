---
name: ile-cobol-docs
version: "7.4"
tags:
  - cobol
  - ile cobol
  - ibm i
  - as400
  - iseries
  - business programming
  - mainframe
  - enterprise
  - file handling
  - database
  - db2
  - compiler
  - debugging
  - activation group
  - service program
  - module
  - binding
  - commitment control
  - nested programs
  - recursive
  - picture clause
  - usage clause
  - occurs clause
  - redefines
  - indexed file
  - sequential file
  - relative file
  - declaratives
  - intrinsic function
  - copy
  - process statement
  - strdbg
  - crtbndcbl
  - crtcblmod
description: |
  IBM ILE COBOL 7.4/7.5 — language structure, four divisions, data description, file handling, DB2, debugging.
---

# ILE COBOL Language Skill

## Overview
IBM ILE COBOL (Integrated Language Environment COBOL) is a programming language available on IBM i systems. It is based on the ANSI COBOL standard with IBM extensions. ILE COBOL provides structured programming capabilities, file handling, database access, interlanguage communication, and integration with the IBM i operating system.

This skill covers IBM ILE COBOL for IBM i 7.4 (also applicable to 7.5). Source: IBM ILE COBOL Language Reference and ILE COBOL Programmer's Guide.

## Key Concepts
- **COBOL Source Program**: A syntactically correct set of COBOL statements organized into four divisions
- **Nesting**: COBOL programs may contain other COBOL programs (nested programs); contained programs can reference resources of their containing program
- **Run Unit**: A set of one or more programs functioning as a unit at run time; in ILE, composed of program objects and service programs in a single ILE activation group
- **ILE Architecture**: Module creation, binding, message handling, exception handling, and debugging across multiple languages
- **Reference Format**: 80-character source line with specific column areas (Sequence, Indicator, Area A, Area B, Comment)

## Source Program Structure
A COBOL source program consists of four divisions, written in this order:

1. **Identification Division** (required) - Names the program and provides documentary information
2. **Environment Division** (optional) - Describes computer environment, files, and I/O configuration
3. **Data Division** (optional) - Describes all data to be processed
4. **Procedure Division** (optional) - Contains the executable logic

The end of a COBOL source program is indicated by the END PROGRAM header or by the absence of additional source lines.

### Example Program
```cobol
       IDENTIFICATION DIVISION.
       PROGRAM-ID.     IDSAMPLE.
       AUTHOR.         PROGRAMMER NAME.
       INSTALLATION.   COBOL DEVELOPMENT CENTER.
       DATE-WRITTEN.   12/02/94.
       DATE-COMPILED.  12/09/94 12:57:53.
       SECURITY.       NON-CONFIDENTIAL.

       ENVIRONMENT DIVISION.
       CONFIGURATION SECTION.
       SOURCE-COMPUTER. IBM-ISERIES.
       OBJECT-COMPUTER. IBM-ISERIES.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT FILE-1 ASSIGN TO DISK-SAMPLE.

       DATA DIVISION.
       FILE SECTION.
       FD  FILE-1
           LABEL RECORDS ARE STANDARD.
       01  RECORD-1.
           05 NAME-FIELD      PIC X(20).
           05 NO-OF-DEP       PIC 9(2).

       WORKING-STORAGE SECTION.
       01 WORK-RECORD.
           05 NAME-FIELD      PIC X(20).
           05 NO-OF-DEPENDENTS PIC 9(2).
           05 RECORD-NO       PIC 9(4).
       77 KOUNT               PIC 9(2) VALUE 0.

       PROCEDURE DIVISION.
       STEP-1.
           OPEN OUTPUT FILE-1.
           MOVE ZERO TO KOUNT.
       STEP-2.
           ADD 1 TO KOUNT.
           MOVE "SAMPLE NAME" TO NAME-FIELD.
           WRITE RECORD-1 FROM WORK-RECORD.
       STEP-3.
           CLOSE FILE-1.
           STOP RUN.
```

## Language Structure Hierarchy
- **Division** > **Section** > **Paragraph** > **Entry** > **Clause** > **Phrase**
- Identification Division: Paragraphs > Entries > Clauses
- Environment Division: Sections > Paragraphs > Entries > Clauses > Phrases
- Data Division: Sections > Entries > Clauses > Phrases
- Procedure Division: Sections > Paragraphs > Sentences > Statements > Phrases

## Character Set
COBOL characters include:
- Letters A-Z, a-z
- Digits 0-9
- Special characters: `+ - * / = $ , . ; " ' ( ) < > :` and space
- IBM extensions: apostrophe (`'`) and underscore (`_`)
- DBCS (Double-Byte Character Set) characters valid in certain character-strings
- `#` and `@` valid in IBM i system names

## Reference Format (80-column source line)
| Area | Columns | Purpose |
|------|---------|---------|
| Sequence Number | 1-6 | Optional sequence numbering |
| Indicator Area | 7 | Comment (`*`), continuation (`-`), etc. |
| Area A | 8-11 | Division headers, section names, paragraph names |
| Area B | 12-72 | Statements, clauses, entries |
| Comment Area | 73-80 | Ignored by compiler |

## Skill File Index
- **language.md** - Language structure, characters, reference format, data references, figurative constants, special registers, expressions, intrinsic functions
- **divisions.md** - Four divisions detailed: Identification, Environment, Data, Procedure; all clauses and statements
- **programming.md** - Programmer's guide: compiling, running, debugging, I/O, file handling, error handling, ILE concepts

## IBM i References
- ILE COBOL Language Reference: https://www.ibm.com/docs/en/i/7.4.0?topic=cobol-ile-language-reference
- ILE COBOL Programmer's Guide: https://www.ibm.com/docs/en/i/7.4.0?topic=cobol-ile-programmers-guide
- ILE Concepts: https://www.ibm.com/docs/en/i/7.5.0?topic=languages-ile-concepts
