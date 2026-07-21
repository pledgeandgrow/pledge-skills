# NumPy — Advanced: Interoperability, Performance, MATLAB Users, How-tos, C-API, F2PY, Migration, Glossary

> Interoperability with other array libraries, writing performant multi-core code, MATLAB-to-NumPy conversion, how-tos, C-API extension, F2PY, NumPy 2.0 migration, and glossary.

**Interoperability**: [numpy.org/doc/stable/user/basics.interoperability.html](https://numpy.org/doc/stable/user/basics.interoperability.html)  
**Performant Code**: [numpy.org/doc/stable/user/basics.performant_code.html](https://numpy.org/doc/stable/user/basics.performant_code.html)  
**NumPy for MATLAB Users**: [numpy.org/doc/stable/user/numpy-for-matlab-users.html](https://numpy.org/doc/stable/user/numpy-for-matlab-users.html)  
**How-tos**: [numpy.org/doc/stable/user/howtos_index.html](https://numpy.org/doc/stable/user/howtos_index.html)  
**C-API**: [numpy.org/doc/stable/user/c-info.html](https://numpy.org/doc/stable/user/c-info.html)  
**F2PY**: [numpy.org/doc/stable/f2py/index.html](https://numpy.org/doc/stable/f2py/index.html)  
**Migration Guide**: [numpy.org/doc/stable/numpy_2_0_migration_guide.html](https://numpy.org/doc/stable/numpy_2_0_migration_guide.html)  
**Glossary**: [numpy.org/doc/stable/glossary.html](https://numpy.org/doc/stable/glossary.html)  
**Under-the-hood**: [numpy.org/doc/stable/dev/underthehood.html](https://numpy.org/doc/stable/dev/underthehood.html)  
**Byte-swapping**: [numpy.org/doc/stable/user/byteswapping.html](https://numpy.org/doc/stable/user/byteswapping.html)  
**Custom Array Containers**: [numpy.org/doc/stable/user/basics.dispatch.html](https://numpy.org/doc/stable/user/basics.dispatch.html)  
**Subclassing ndarray**: [numpy.org/doc/stable/user/basics.subclassing.html](https://numpy.org/doc/stable/user/basics.subclassing.html)  
**Internal Organization**: [numpy.org/doc/stable/dev/internals.html](https://numpy.org/doc/stable/dev/internals.html)  
**Memory Alignment**: [numpy.org/doc/stable/dev/alignment.html](https://numpy.org/doc/stable/dev/alignment.html)  

## Interoperability with NumPy

NumPy's ndarray provides both a high-level API and a concrete implementation based on strided in-RAM storage. Other libraries (CuPy for GPU, SciPy sparse, Dask for parallel, TensorFlow, PyTorch) reimplement this API.

### Three Groups of Interoperability Features

1. **Turning a foreign object into an ndarray**
2. **Deferring execution from NumPy to another array library**
3. **Using NumPy functions that return a foreign object**

### Converting Foreign Objects to ndarrays

NumPy tries (in order):
1. **The buffer protocol** (Python C-API)
2. **`__array_interface__` protocol** — describes memory layout
3. **`__array__()` method** — object converts itself to an array

```python
# DLPack protocol (language/device agnostic)
import torch
t = torch.tensor([1, 2, 3])
a = np.from_dlpack(t)  # zero-copy conversion from PyTorch
```

### The `__array_ufunc__` Protocol

Allows foreign objects to override ufunc behavior:

```python
class MyArray:
    def __array_ufunc__(self, ufunc, method, *inputs, **kwargs):
        # Custom implementation
        pass
```

### The `__array_function__` Protocol

Allows foreign objects to override NumPy functions:

```python
class MyArray:
    def __array_function__(self, func, types, args, kwargs):
        # Custom implementation
        pass
```

### Examples of Interoperable Libraries

- **CuPy** — GPU arrays
- **Dask** — Parallel arrays
- **PyTorch / TensorFlow** — Deep learning
- **SciPy sparse** — Sparse arrays
- **Pandas** — Labeled data
- **Xarray** — N-dimensional labeled data
- **JAX** — Automatic differentiation

## Writing Performant NumPy Code with Multi-Core CPUs

### General Concepts

NumPy leverages vectorized operations for performance, but vectorization alone doesn't fully utilize multi-core CPUs. Additional strategies:

### Multiprocessing

**Pros:**
- Bypasses the GIL — true parallelism
- Separate memory spaces prevent accidental data sharing

**Cons:**
- Higher memory usage (separate memory per process)
- Data sharing requires serialization (pickling)

### Using ProcessPoolExecutor

```python
from concurrent.futures import ProcessPoolExecutor
import numpy as np

def process_chunk(chunk):
    return np.sum(chunk ** 2)

data = np.random.rand(1_000_000)
chunks = np.array_split(data, 4)

with ProcessPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(process_chunk, chunks))

total = sum(results)
```

### General Tips

- **Reduce creation overhead**: Use process pools to reuse processes
- **Select appropriate startup methods**: Avoid `fork` on multithreaded processes (Python 3.14+ defaults to `forkserver`)
- **Reduce communication overhead**: Minimize data transfer between processes
- **Use shared memory**: `multiprocessing.shared_memory` for large arrays

### Shared Memory Example

```python
from multiprocessing import shared_memory
import numpy as np

# Create shared memory
shm = shared_memory.SharedMemory(create=True, size=a.nbytes)
b = np.ndarray(a.shape, dtype=a.dtype, buffer=shm.buf)
b[:] = a[:]  # copy data to shared memory

# In another process:
existing_shm = shared_memory.SharedMemory(name=shm.name)
c = np.ndarray(a.shape, dtype=a.dtype, buffer=existing_shm.buf)
```

### Third-Party Libraries for Multi-Core

- **Numba** — JIT compilation, automatic parallelization
- **Cython** — Compiled Python with C extensions
- **Dask** — Parallel computing with task scheduling
- **SciPy** — Some functions support multi-threading via BLAS/LAPACK

### Numba Example

```python
from numba import jit, prange
import numpy as np

@jit(nopython=True, parallel=True)
def parallel_sum(a):
    result = 0.0
    for i in prange(a.shape[0]):
        result += a[i]
    return result
```

## NumPy for MATLAB Users

### Key Differences

| Concept | MATLAB | NumPy |
|---------|--------|-------|
| Basic type | 2D array (double) | N-dimensional array (min type) |
| Multiplication | `*` = matrix product | `*` = elementwise, `@` = matrix |
| Indexing | 1-based | 0-based |
| Slicing | Copy-on-write | View (no copy) |
| Comments | `%` | `#` |

### Common Equivalents

| MATLAB | NumPy | Notes |
|--------|-------|-------|
| `help func` | `help(func)` or `func?` (IPython) | Get help |
| `which func` | `np.source(func)` | Find definition |
| `a = [1 2 3; 4 5 6]` | `a = np.array([[1,2,3],[4,5,6]])` | Create matrix |
| `a'` | `a.T` | Transpose |
| `a * b` | `a @ b` | Matrix multiply |
| `a .* b` | `a * b` | Elementwise multiply |
| `a(1,1)` | `a[0,0]` | First element |
| `a(end)` | `a[-1]` | Last element |
| `1:10` | `np.arange(1, 11)` or `np.r_[1:11]` | Range |
| `linspace(0,1,5)` | `np.linspace(0, 1, 5)` | Linear space |
| `zeros(3,4)` | `np.zeros((3, 4))` | Zeros |
| `ones(3,4)` | `np.ones((3, 4))` | Ones |
| `eye(3)` | `np.eye(3)` | Identity |
| `rand(3,4)` | `np.random.default_rng().random((3, 4))` | Random |
| `[a, b]` | `np.hstack([a, b])` | Horizontal concat |
| `[a; b]` | `np.vstack([a, b])` | Vertical concat |
| `find(a > 5)` | `np.nonzero(a > 5)` | Find indices |
| `sum(a)` | `a.sum()` or `np.sum(a)` | Sum |
| `mean(a)` | `a.mean()` or `np.mean(a)` | Mean |
| `reshape(a, m, n)` | `a.reshape(m, n)` | Reshape |
| `flipud(a)` | `np.flipud(a)` | Flip up-down |
| `sort(a)` | `np.sort(a)` | Sort |

## NumPy How-tos

### Reading and Writing Files

```python
# CSV
np.savetxt('output.csv', a, delimiter=',')
np.loadtxt('input.csv', delimiter=',')

# Binary
np.save('array.npy', a)
np.load('array.npy')

# Compressed
np.savez_compressed('data.npz', a=a, b=b)
```

### How to Index ndarrays

See the Indexing section in `fundamentals.md` for comprehensive coverage.

### Creating Arrays with Regularly-Spaced Values

```python
# Evenly spaced
np.linspace(0, 10, 5)           # 5 points from 0 to 10

# Step-based
np.arange(0, 10, 2)             # [0, 2, 4, 6, 8]

# Logarithmically spaced
np.logspace(0, 3, 4)            # [1, 10, 100, 1000]

# Geometrically spaced
np.geomspace(1, 1000, 4)        # [1, 10, 100, 1000]
```

### Printing NumPy Arrays

```python
# Control print options
np.set_printoptions(
    precision=3,       # decimal places
    threshold=100,     # max elements before summarizing
    edgeitems=3,       # items at beginning/end of each dimension
    linewidth=80,      # max chars per line
    suppress=True,     # suppress scientific notation
)

# Context manager for temporary settings
with np.printoptions(precision=2, suppress=True):
    print(a)
```

### Verifying Bugs and Bug Fixes

```python
# Reproduce with fixed seed
rng = np.random.default_rng(42)
a = rng.random((100, 100))

# Check array properties
assert a.flags['C_CONTIGUOUS']
assert a.dtype == np.float64
```

## Using NumPy C-API

### How to Extend NumPy

Writing C extension modules that interact with NumPy arrays:

```c
#include <Python.h>
#define NPY_NO_DEPRECATED_API NPY_1_7_API_VERSION
#include <numpy/arrayobject.h>

static PyObject* my_function(PyObject* self, PyObject* args) {
    PyObject* array_obj;
    if (!PyArg_ParseTuple(args, "O", &array_obj)) {
        return NULL;
    }
    PyArrayObject* array = (PyArrayObject*)PyArray_FROMANY(
        array_obj, NPY_DOUBLE, 0, 0, NPY_ARRAY_C_CONTIGUOUS);
    if (array == NULL) return NULL;

    double* data = (double*)PyArray_DATA(array);
    npy_intp size = PyArray_SIZE(array);

    for (npy_intp i = 0; i < size; i++) {
        data[i] *= 2;
    }

    return (PyObject*)array;
}
```

### Required Steps

1. Call `import_array()` in module initialization
2. Convert Python objects to `PyArrayObject*` using `PyArray_FROMANY`
3. Access data with `PyArray_DATA`, `PyArray_SIZE`, `PyArray_NDIM`, etc.
4. Handle reference counting properly

### Using Python as Glue

NumPy can interface with compiled libraries:

- **F2PY** — Fortran to Python interface generator
- **Cython** — Write C extensions in Python-like syntax
- **ctypes** — Call shared libraries directly
- **SWIG** — Simplified Wrapper and Interface Generator
- **cffi** — C Foreign Function Interface

### F2PY

```bash
# Compile Fortran module
python -m numpy.f2py -c my_subroutine.f90 -m mymodule
```

```fortran
! my_subroutine.f90
subroutine add(a, b, c, n)
    implicit none
    integer, intent(in) :: n
    real(8), intent(in) :: a(n), b(n)
    real(8), intent(out) :: c(n)
    c = a + b
end subroutine add
```

```python
import mymodule
a = np.array([1.0, 2.0, 3.0])
b = np.array([4.0, 5.0, 6.0])
c = mymodule.add(a, b)  # array([5., 7., 9.])
```

### Writing Custom ufuncs in C

```c
static void double_it(char **args, npy_intp *dimensions,
                      npy_intp *steps, void *data) {
    npy_intp n = dimensions[0];
    char *in = args[0], *out = args[1];
    npy_intp in_step = steps[0], out_step = steps[1];

    for (npy_intp i = 0; i < n; i++) {
        *((double*)out) = *((double*)in) * 2.0;
        in += in_step;
        out += out_step;
    }
}
```

## NumPy 2.0 Migration Guide

### Automated Migration with Ruff

```bash
ruff check path/to/code/ --select NPY201
```

```toml
# pyproject.toml
[tool.ruff.lint]
select = ["NPY201"]
```

### Key Changes in NumPy 2.0

#### Promotion Rules (NEP 50)

Scalar precision is now preserved consistently:

```python
# NumPy 1.x: float64
# NumPy 2.0: float32 (scalar precision preserved)
np.float32(3) + 3.  # float32

# Array + scalar: higher precision scalar is NOT ignored
np.array([3], dtype=np.float32) + np.float64(3)  # float64 array
```

To fix: cast explicitly or use Python scalars via `int()`, `float()`, or `.item()`.

#### Default Integer Change

Default integer is now 64-bit on 64-bit systems (was C `long`):

```python
# Was: np.int_ = C long (could be 32-bit on Windows)
# Now: np.intp (always pointer-sized, 64-bit on 64-bit systems)
```

#### copy Keyword Change

```python
# NumPy 2.0: copy=False raises if copy is needed
np.array(a, copy=False)  # raises if copy required

# Use copy=None to allow copy if needed
np.array(a, copy=None)
```

#### Removed/Relocated Functions

- `np.float_` → use `np.float64`
- `np.complex_` → use `np.complex128`
- `np.int0` → use `np.intp`
- `np.uint0` → use `np.uintp`
- `np.unicode_` → use `np.str_`
- `np.string_` → use `np.bytes_`
- `np.in1d` → use `np.isin`
- `np.row_stack` → use `np.vstack`

#### C API Changes

- `PyArray_Descr` struct changed
- Some functionality moved to headers requiring `import_array()`
- Binary compatibility broken — rebuild extensions

## Glossary

Key NumPy terms:

| Term | Description |
|------|-------------|
| `ndarray` | N-dimensional array object |
| `axis` | A dimension of an array; axis 0 = rows, axis 1 = columns |
| `broadcasting` | Treating arrays of different shapes during arithmetic |
| `copy` | New array with duplicated data buffer and metadata |
| `view` | New array sharing the same data buffer |
| `dtype` | Data type object describing element type |
| `ufunc` | Universal function — element-by-element operation |
| `gufunc` | Generalized ufunc — operates on sub-arrays |
| `stride` | Number of bytes to step to next element along each axis |
| `contiguous` | Array stored in contiguous memory block |
| `C-order` | Row-major order (last index changes fastest) |
| `F-order` | Column-major (Fortran) order (first index changes fastest) |
| `flat` | Iterator over all elements of an array |
| `flatten` | Return a flattened copy of an array |
| `ravel` | Return a flattened view of an array (when possible) |
| `newaxis` | Alias for `None` — expands dimensions by one |
| `Ellipsis` (`...`) | Shorthand for missing full slices |
| `fancy indexing` | Advanced indexing with integer or boolean arrays |
| `mask` | Boolean array used for indexing |
| `scalar` | Single value (0-dimensional array element) |
| `shape` | Tuple of array dimensions |
| `size` | Total number of elements in an array |
| `itemsize` | Size in bytes of one array element |
| `nbytes` | Total bytes consumed by array elements |
| `flags` | Array memory layout information |
| `base` | Base object if array is a view, else `None` |
| `-1` | In reshape: auto-calculate dimension; In indexing: from the right |

## Under-the-hood Documentation for Developers

These documents are intended as a low-level look into NumPy, focused towards developers.

**Source**: [numpy.org/doc/stable/dev/underthehood.html](https://numpy.org/doc/stable/dev/underthehood.html)

### Internal Organization of NumPy Arrays

The NumPy ndarray consists of two parts:
1. **Raw data buffer** — contiguous block of homogeneous data elements
2. **Metadata** — data type (dtype), shape, strides, flags, and other information

Key internal concepts:

- **Strides**: Tuple of bytes to step in each dimension when traversing an array. `strides[i]` = bytes to step from one element to the next along axis `i`.
- **C-order (row-major)**: Last index changes fastest (default in NumPy)
- **F-order (column-major)**: First index changes fastest (Fortran style)
- **Contiguous arrays**: Single segment of memory, can be C-contiguous or F-contiguous

```python
a = np.arange(12).reshape(3, 4)
a.strides          # (32, 8) for int64 — 4 elements * 8 bytes per row, 8 bytes per column
a.flags            # C_CONTIGUOUS=True, F_CONTIGUOUS=False

# Transpose changes strides without copying data (view)
b = a.T
b.strides          # (8, 32) — swapped
b.flags            # C_CONTIGUOUS=False
```

### NumPy C Code Explanations

Low-level documentation explaining how NumPy's C code works internally. Covers:
- How ufuncs are implemented in C
- How broadcasting is handled at the C level
- Memory management and reference counting
- The PyArray_Descr structure and type promotion

**Source**: [numpy.org/doc/stable/dev/internals.code-explanations.html](https://numpy.org/doc/stable/dev/internals.code-explanations.html)

### Memory Alignment

NumPy arrays may be either aligned or unaligned in memory. Unaligned arrays can cause performance penalties or crashes on some platforms.

```python
a = np.arange(10)
a.flags.aligned    # True — data is properly aligned

# Misaligned arrays can occur from slicing or views
# Check alignment:
print(a.flags.aligned)
```

Key points:
- Aligned access is faster on most hardware
- Some C libraries require aligned data
- `np.ascontiguousarray()` can help ensure proper layout
- Buffer protocol and `__array_interface__` expose alignment info

**Source**: [numpy.org/doc/stable/dev/alignment.html](https://numpy.org/doc/stable/dev/alignment.html)

### Byte-Swapping

When data from a big-endian machine is loaded on a little-endian machine (or vice versa), byte order must be handled.

```python
# Big-endian data loaded on little-endian machine
big_end_buffer = bytearray([0, 1, 3, 2])
big_end_arr = np.ndarray(shape=(2,), dtype='>i2', buffer=big_end_buffer)
# array([1, 770], dtype=int16) — interpreted as big-endian

# dtype byte order specifiers:
# '>' = big-endian, '<' = little-endian, '=' = native, '|' = not applicable
```

Two ways to handle byte-order mismatch:

```python
# 1. Change dtype interpretation (no data change)
arr = arr.view(arr.dtype.newbyteorder())

# 2. Swap the actual data bytes
arr = arr.byteswap()
```

Common situations:
1. **Data and dtype endianness don't match** → change dtype to match data: `arr.view(arr.dtype.newbyteorder())`
2. **Data and dtype don't match** → swap data to match dtype: `arr.byteswap()`
3. **Data and dtype match** → swap both: `arr.byteswap().view(arr.dtype.newbyteorder())`

> **Warning**: Scalars do not include byte order information. Extracting a scalar returns native byte order. NumPy does not preserve byte-order in operations like `concatenate`.

**Source**: [numpy.org/doc/stable/user/byteswapping.html](https://numpy.org/doc/stable/user/byteswapping.html)

### Writing Custom Array Containers

NumPy's dispatch mechanism (v1.16+) is the recommended approach for writing custom N-dimensional array containers compatible with the NumPy API.

Applications include:
- **Dask arrays** — distributed across multiple nodes
- **CuPy arrays** — on GPU

Key protocols:
- `__array_ufunc__` — override ufunc behavior
- `__array_function__` — override NumPy functions
- `__array__()` — convert to ndarray

```python
from numpy.testing.overrides import allows_array_ufunc_override

allows_array_ufunc_override(np.add)  # True — np.add can be overridden
```

Testing utilities in `numpy.testing.overrides`:
- `allows_array_ufunc_override(func)` — check if ufunc is overridable
- `allows_array_function_override(func)` — check if function is overridable
- `get_overridable_numpy_array_functions()` — list of overridable functions
- `get_overridable_numpy_ufuncs()` — list of overridable ufuncs

See also [NEP 18](https://numpy.org/neps/nep-0018-array-function-protocol.html).

**Source**: [numpy.org/doc/stable/user/basics.dispatch.html](https://numpy.org/doc/stable/user/basics.dispatch.html)

### Subclassing ndarray

Subclassing ndarray is possible but has complications compared to other Python objects. New instances can arise in three ways:

1. **Explicit constructor call** — `MySubClass(params)`
2. **View casting** — casting an existing ndarray as a subclass
3. **New from template** — creating from a template instance (slicing, ufunc returns, copies)

```python
class MyArray(np.ndarray):
    def __new__(cls, input_array, info=None):
        obj = np.asarray(input_array).view(cls)
        obj.info = info
        return obj

    def __array_finalize__(self, obj):
        if obj is None: return
        self.info = getattr(obj, 'info', None)

    def __array_ufunc__(self, ufunc, method, *inputs, **kwargs):
        # Custom ufunc behavior
        pass

    def __array_wrap__(self, out_arr, context=None, return_scalar=False):
        # Wrap return values
        return np.ndarray.__array_wrap__(self, out_arr, context)
```

Key methods for subclasses:

- **`__new__`** — Controls object creation (ndarray uses `__new__` not `__init__`)
- **`__array_finalize__`** — Called after every new instance creation; propagates subclass attributes
- **`__array_ufunc__`** — Override ufunc behavior for the subclass
- **`__array_wrap__`** — Wrap return values from ufuncs and other functions

When to subclass vs use interoperability protocols:
- **Subclassing**: Quick to implement, many things "just work", but subclass info may be silently lost
- **Interoperability protocols**: More robust, better for libraries with many users

Examples: `np.memmap` (subclass), `np.ma` (masked arrays, subclass), `astropy.units.Quantity` (subclass + protocols)

**Source**: [numpy.org/doc/stable/user/basics.subclassing.html](https://numpy.org/doc/stable/user/basics.subclassing.html)
