# NumPy

> NumPy is the fundamental package for scientific computing in Python, providing a powerful N-dimensional array object, broadcasting functions, and tools for integrating C/C++ and Fortran code.

**Version**: NumPy 2.5 (current)  
**Documentation**: [numpy.org/doc/stable/user/index.html](https://numpy.org/doc/stable/user/index.html)  
**GitHub**: [github.com/numpy/numpy](https://github.com/numpy/numpy)  

## Quick Reference

| Topic | File |
|-------|------|
| Getting Started & Quickstart (What is NumPy, installation, array creation, printing, arithmetic, matrix product, in-place ops, upcasting, unary operations, universal functions, indexing/slicing/iterating, shape manipulation, stacking/splitting, copies and views, advanced indexing: integer/boolean, ix_, linear algebra, histograms, tips & tricks) | `getting-started.md` |
| Fundamentals (Array creation: 6 mechanisms, intrinsic functions, from disk, raw bytes, library functions; Data types: all numerical types, dtype specification, type conversion, array scalars; Indexing: basic, slicing, ellipsis, newaxis, advanced integer/boolean; Broadcasting: rules, examples, incompatible shapes; Copies and views: views vs copies, key operations table; I/O: genfromtxt, loadtxt, save/load, raw binary, standard formats; Strings and bytes: fixed-width, variable-width StringDType; Structured arrays: field access, datatype creation, subarrays; Universal functions: ufunc methods, type casting, custom ufuncs, error handling, buffer size) | `fundamentals.md` |
| Advanced (Interoperability: buffer protocol, __array__, __array_ufunc__, __array_function__, DLPack; Performant code: multiprocessing, ProcessPoolExecutor, shared memory, Numba, Cython, Dask; NumPy for MATLAB users: key differences, common equivalents table; How-tos: file I/O, indexing, regularly-spaced values, printing, verifying bugs; C-API: extending NumPy, Python as glue, F2PY, custom ufuncs in C; Under-the-hood: internal organization, strides, C code explanations, memory alignment, byte-swapping, custom array containers, subclassing ndarray; NumPy 2.0 migration: Ruff NPY201, promotion rules NEP 50, default integer, copy keyword, removed functions, C API changes; Glossary: all key terms) | `advanced.md` |

## Core Concepts

- **What is NumPy**: Fundamental package for scientific computing in Python — N-dimensional array, broadcasting, C/C++/Fortran integration
- **Why NumPy is Fast**: Vectorization (element-by-element ops in pre-compiled C) and Broadcasting (implicit element-by-element behavior with different shapes)
- **ndarray**: N-dimensional array object — homogeneous data, fixed size, indexed by non-negative integers
- **Data Types**: bool, int (8/16/32/64), uint (8/16/32/64), float (16/32/64/128), complex (64/128/256) — plus platform-dependent types
- **Array Creation**: 6 mechanisms — Python sequences, intrinsic functions, replicating/joining, disk I/O, raw bytes, special libraries
- **Indexing**: Basic (integers, slices, ellipsis, newaxis → returns views) and Advanced (integer arrays, boolean arrays → returns copies)
- **Broadcasting**: Rules for operating on arrays of different shapes — dimensions must be equal or 1
- **Copies vs Views**: Views share data buffer (basic indexing, reshape, ravel); Copies duplicate data (advanced indexing, flatten, copy())
- **Universal Functions (ufunc)**: Element-by-element operations with broadcasting, type casting, reduce/accumulate/outer methods
- **Structured Arrays**: Arrays with named fields of different types — C-struct-like memory layout
- **I/O**: genfromtxt, loadtxt, save/load (npy/npz), tofile/fromfile, HDF5/FITS via external libraries
- **Interoperability**: Protocols (__array__, __array_ufunc__, __array_function__, DLPack) for CuPy, Dask, PyTorch, TensorFlow, etc.
- **Performance**: Multiprocessing, shared memory, Numba JIT, Cython, Dask for multi-core utilization
- **C-API**: Extending NumPy with C extension modules, F2PY for Fortran, custom ufuncs in C
- **NumPy 2.0**: NEP 50 promotion rules, 64-bit default integer, copy keyword changes, removed aliases

## Official Documentation Sources

- [NumPy User Guide](https://numpy.org/doc/stable/user/index.html) — Main user guide
- [What is NumPy?](https://numpy.org/doc/stable/user/whatisnumpy.html) — Introduction
- [NumPy Quickstart](https://numpy.org/doc/stable/user/quickstart.html) — Quickstart tutorial
- [Absolute Basics for Beginners](https://numpy.org/doc/stable/user/absolute_beginners.html) — Beginner guide
- [NumPy Fundamentals](https://numpy.org/doc/stable/user/basics.html) — Fundamentals index
- [Array Creation](https://numpy.org/doc/stable/user/basics.creation.html) — Array creation mechanisms
- [Indexing on ndarrays](https://numpy.org/doc/stable/user/basics.indexing.html) — Indexing reference
- [Data Types](https://numpy.org/doc/stable/user/basics.types.html) — Data type reference
- [Broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html) — Broadcasting rules
- [Copies and Views](https://numpy.org/doc/stable/user/basics.copies.html) — Copy vs view behavior
- [I/O with NumPy](https://numpy.org/doc/stable/user/basics.io.html) — I/O operations
- [Strings and Bytes](https://numpy.org/doc/stable/user/basics.strings.html) — String array handling
- [Structured Arrays](https://numpy.org/doc/stable/user/basics.rec.html) — Structured datatypes
- [Universal Functions](https://numpy.org/doc/stable/user/basics.ufuncs.html) — ufunc basics
- [NumPy for MATLAB Users](https://numpy.org/doc/stable/user/numpy-for-matlab-users.html) — MATLAB conversion
- [NumPy How-tos](https://numpy.org/doc/stable/user/howtos_index.html) — How-to recipes
- [Interoperability](https://numpy.org/doc/stable/user/basics.interoperability.html) — Array library interop
- [Performant Code](https://numpy.org/doc/stable/user/basics.performant_code.html) — Multi-core performance
- [Using NumPy C-API](https://numpy.org/doc/stable/user/c-info.html) — C extension guide
- [F2PY User Guide](https://numpy.org/doc/stable/f2py/index.html) — Fortran interface
- [Glossary](https://numpy.org/doc/stable/glossary.html) — NumPy terminology
- [NumPy 2.0 Migration Guide](https://numpy.org/doc/stable/numpy_2_0_migration_guide.html) — Migration guide
- [Under-the-hood Docs](https://numpy.org/doc/stable/dev/underthehood.html) — Developer-level internals
- [Internal Organization](https://numpy.org/doc/stable/dev/internals.html) — Array memory layout
- [C Code Explanations](https://numpy.org/doc/stable/dev/internals.code-explanations.html) — C internals
- [Memory Alignment](https://numpy.org/doc/stable/dev/alignment.html) — Alignment details
- [Byte-swapping](https://numpy.org/doc/stable/user/byteswapping.html) — Endianness handling
- [Custom Array Containers](https://numpy.org/doc/stable/user/basics.dispatch.html) — Dispatch mechanism
- [Subclassing ndarray](https://numpy.org/doc/stable/user/basics.subclassing.html) — Subclassing guide
- [API Reference](https://numpy.org/doc/stable/reference/index.html) — Full API reference
