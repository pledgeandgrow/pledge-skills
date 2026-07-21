# NumPy — Fundamentals: Data Types, Creation, Indexing, Broadcasting, Copies, I/O, Strings, Structured Arrays, ufuncs

> Core NumPy concepts: array creation mechanisms, data types, indexing (basic/advanced), broadcasting rules, copies vs views, I/O, string arrays, structured arrays, and universal functions.

**Fundamentals**: [numpy.org/doc/stable/user/basics.html](https://numpy.org/doc/stable/user/basics.html)  
**Array Creation**: [numpy.org/doc/stable/user/basics.creation.html](https://numpy.org/doc/stable/user/basics.creation.html)  
**Indexing**: [numpy.org/doc/stable/user/basics.indexing.html](https://numpy.org/doc/stable/user/basics.indexing.html)  
**Data Types**: [numpy.org/doc/stable/user/basics.types.html](https://numpy.org/doc/stable/user/basics.types.html)  
**Broadcasting**: [numpy.org/doc/stable/user/basics.broadcasting.html](https://numpy.org/doc/stable/user/basics.broadcasting.html)  
**Copies and Views**: [numpy.org/doc/stable/user/basics.copies.html](https://numpy.org/doc/stable/user/basics.copies.html)  
**I/O**: [numpy.org/doc/stable/user/basics.io.html](https://numpy.org/doc/stable/user/basics.io.html)  
**Strings/Bytes**: [numpy.org/doc/stable/user/basics.strings.html](https://numpy.org/doc/stable/user/basics.strings.html)  
**Structured Arrays**: [numpy.org/doc/stable/user/basics.rec.html](https://numpy.org/doc/stable/user/basics.rec.html)  
**Universal Functions**: [numpy.org/doc/stable/user/basics.ufuncs.html](https://numpy.org/doc/stable/user/basics.ufuncs.html)  

## Array Creation

There are 6 general mechanisms for creating arrays:

1. **Conversion from Python structures** (lists, tuples)
2. **Intrinsic NumPy functions** (`arange`, `ones`, `zeros`, etc.)
3. **Replicating, joining, or mutating existing arrays**
4. **Reading arrays from disk** (standard or custom formats)
5. **Creating arrays from raw bytes** (strings or buffers)
6. **Special library functions** (e.g., `random`)

### 1. Converting Python Sequences

```python
a1D = np.array([1, 2, 3, 4])
a2D = np.array([[1, 2], [3, 4]])
a3D = np.array([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])

# dtype matters — overflow can occur
np.array([127, 128, 129], dtype=np.int8)  # OverflowError: 128 out of bounds for int8

# Unsigned vs signed arithmetic
a = np.array([2, 3, 4], dtype=np.uint32)
b = np.array([5, 6, 7], dtype=np.uint32)
a - b  # uint32: [4294967293, 4294967293, 4294967293] (underflow!)
a - b.astype(np.int32)  # int64: [-3, -3, -3] (correct)
```

### 2. Intrinsic NumPy Array Creation Functions

#### 1D Array Creation

```python
np.arange(10)           # 0 to 9
np.linspace(0, 100, 5)  # 5 evenly spaced points
np.logspace(0, 3, 4)    # logarithmically spaced
np.geomspace(1, 1000, 4)  # geometrically spaced
```

#### 2D Array Creation

```python
np.eye(3)               # 3x3 identity matrix
np.identity(3)          # same as eye
np.diag([1, 2, 3])      # diagonal matrix
np.tri(3)               # lower triangular
np.vander([1, 2, 3])    # Vandermonde matrix
```

#### General ndarray Creation

```python
np.zeros((2, 3))
np.ones((2, 3))
np.empty((2, 3))
np.full((2, 3), 7)
np.zeros_like(a)
np.ones_like(a)
np.empty_like(a)
np.full_like(a, 7)
```

### 3. Replicating, Joining, or Mutating

```python
np.repeat([1, 2, 3], 3)           # array([1, 1, 1, 2, 2, 2, 3, 3, 3])
np.tile([1, 2], 3)                # array([1, 2, 1, 2, 1, 2])
np.concatenate([a, b])
np.vstack([a, b])
np.hstack([a, b])
np.stack([a, b], axis=0)
```

### 4. Reading from Disk

```python
# CSV/TSV
np.loadtxt('data.csv', delimiter=',', skiprows=1)
np.genfromtxt('data.csv', delimiter=',', names=True)

# Binary
np.fromfile('data.bin', dtype=np.float64)
np.save('array.npy', a)          # NumPy binary format
np.savez('arrays.npz', a=a, b=b)  # Multiple arrays
np.load('array.npy')
```

### 5. From Raw Bytes

```python
np.frombuffer(b'\x01\x02\x03\x04', dtype=np.uint8)
np.fromstring('\x01\x02\x03\x04', dtype=np.uint8)  # deprecated
```

### 6. Special Library Functions

```python
rng = np.random.default_rng()
rng.random((3, 4))               # random floats
rng.normal(0, 1, (3, 4))         # normal distribution
rng.integers(0, 10, size=5)      # random integers
```

## Data Types

NumPy supports a much greater variety of numerical types than Python:

### Basic Numerical Types

| Type | Description |
|------|-------------|
| `np.bool` | Boolean (True/False) |
| `np.int_` | Default integer (platform-dependent, 64-bit on 64-bit systems) |
| `np.int8` | 8-bit signed integer (-128 to 127) |
| `np.int16` | 16-bit signed integer |
| `np.int32` | 32-bit signed integer |
| `np.int64` | 64-bit signed integer |
| `np.uint8` | 8-bit unsigned integer (0 to 255) |
| `np.uint16` | 16-bit unsigned integer |
| `np.uint32` | 32-bit unsigned integer |
| `np.uint64` | 64-bit unsigned integer |
| `np.float16` | Half precision float |
| `np.float32` | Single precision float |
| `np.float64` | Double precision float (Python `float`) |
| `np.complex64` | Complex (two float32) |
| `np.complex128` | Complex (two float64, Python `complex`) |

### Specifying dtype

```python
z = np.arange(3, dtype=np.uint8)  # array([0, 1, 2], dtype=uint8)

# Character codes
np.array([1, 2, 3], dtype='f')    # float32
np.array([1, 2, 3], dtype='d')    # float64

# Check type
z.dtype                          # dtype('uint8')
np.issubdtype(z.dtype, np.integer)  # True
```

### Type Conversion

```python
z = np.arange(3, dtype=np.uint8)
z.astype(np.float64)             # array([0., 1., 2.])

# Overflow on conversion
# np.int64 value 300 → np.int8: 44 (300 - 256)
z.astype(np.float64, casting="same_value")  # prevent overflow
```

### Array Scalars

NumPy returns elements as array scalars (with associated dtype). They differ from Python scalars but can mostly be used interchangeably:

```python
a = np.array([1, 2, 3])
type(a[0])                       # numpy scalar type
int(a[0])                        # convert to Python int
float(a[0])                      # convert to Python float
```

## Indexing on ndarrays

### Basic Indexing

```python
x = np.arange(10)
x[2]                             # 2
x[-2]                            # 8

x = x.reshape((2, 5))
x[1, 3]                          # 8
x[1, -1]                         # 9
x[0]                             # array([0, 1, 2, 3, 4]) — subdimensional
```

### Slicing

```python
x = np.arange(24).reshape(2, 3, 4)
x[1:,-2:,:-1]
# Trailing slices can be omitted:
x[1] == x[1,:,:]                 # True
```

### Ellipsis (...)

Expands to the number of `:` objects needed:

```python
x[..., 0]                        # same as x[:, :, 0]
x[0, ...]                        # same as x[0, :, :]
# Can be used at most once
```

### newaxis (None)

Expands dimensions by one unit-length dimension:

```python
x[:, np.newaxis, :, :].shape     # (2, 1, 3, 1)
x[:, None, :, :].shape           # same — None is alias

# Useful for combining arrays:
x = np.arange(5)
x[:, np.newaxis] + x[np.newaxis, :]
# Creates a 5x5 addition table
```

### Advanced Indexing — Integer

```python
x = np.arange(10)
indices = np.array([1, 3, 5])
x[indices]                       # array([1, 3, 5])

# Multidimensional
y = np.arange(12).reshape(3, 4)
rows = np.array([0, 1, 2])
cols = np.array([1, 2, 3])
y[rows, cols]                    # array([1, 6, 11])
```

### Advanced Indexing — Boolean

```python
a = np.arange(12).reshape(3, 4)
b = a > 4
a[b]                             # array([5, 6, 7, 8, 9, 10, 11])
a[b] = 0                         # assignment with boolean mask

# Per-dimension boolean
b1 = np.array([False, True, True])
b2 = np.array([True, False, True, False])
a[b1, :]                         # selecting rows
a[:, b2]                         # selecting columns
```

**Advanced indexing always returns a copy, basic indexing returns a view.**

## Broadcasting

Broadcasting describes how NumPy treats arrays with different shapes during arithmetic operations.

### Rules

1. If all input arrays do not have the same number of dimensions, a "1" will be repeatedly prepended to the shapes of the smaller arrays.
2. Arrays with a size of 1 along a particular dimension act as if they had the size of the array with the largest shape along that dimension.
3. After application of the rules, the sizes of all arrays must match.

### Examples

```python
# Scalar broadcasting
a = np.array([1.0, 2.0, 3.0])
a * 2.0                          # array([2., 4., 6.])

# Same shape
a * np.array([2.0, 2.0, 2.0])   # array([2., 4., 6.])

# RGB image scaling (256x256x3) * (3,)
Image (3d array): 256 x 256 x 3
Scale (1d array):             3
Result (3d array): 256 x 256 x 3

# Higher dimensions
A (4d array): 8 x 1 x 6 x 1
B (3d array):     7 x 1 x 5
Result (4d):  8 x 7 x 6 x 5
```

### Incompatible Shapes

```python
np.arange(3) + np.arange(4)  # ValueError: operands could not be broadcast together
```

## Copies and Views

The NumPy array has two parts: contiguous data buffer + metadata (dtype, strides, etc.).

### Views

A view shares the same data buffer. Changes to a view reflect in the original:

```python
x = np.arange(10)
y = x[1:3]                      # creates a view
x[1:3] = [10, 11]
y                                # array([10, 11]) — y changed!
```

**Basic indexing always creates views.** `reshape` returns a view where possible.

### Copies

A copy duplicates both data buffer and metadata. Changes to a copy do not affect the original:

```python
d = a.copy()
d[0, 0] = 9999                  # a is not affected
```

**Advanced indexing always creates copies.** `flatten` always returns a copy.

### Key Operations

| Operation | Returns |
|-----------|---------|
| Basic indexing/slicing | View |
| Advanced indexing | Copy |
| `reshape` | View (when possible) |
| `ravel` | View (when possible) |
| `flatten` | Always copy |
| `transpose` | View |
| `copy()` | Always copy |

## I/O with NumPy

### Importing Data with genfromtxt

```python
# CSV with header
np.genfromtxt('data.csv', delimiter=',', names=True, dtype=None)

# Skipping lines and choosing columns
np.genfromtxt('data.csv', delimiter=',', skip_header=1, usecols=(0, 2))

# Choosing the data type
np.genfromtxt('data.csv', delimiter=',', dtype=[('name', 'U10'), ('age', 'i4')])
```

### loadtxt

```python
np.loadtxt('simple.csv', delimiter=',', skiprows=1)
# array([[0., 0.], [1., 1.], [2., 4.], [3., 9.]])
```

### Saving/Loading Binary

```python
np.save('array.npy', a)          # single array
np.savez('arrays.npz', a=a, b=b)  # multiple arrays (zipped)
np.savez_compressed('arrays.npz', a=a, b=b)
np.load('array.npy')
np.load('arrays.npz')['a']
```

### Raw Binary

```python
a.tofile('data.bin')
np.fromfile('data.bin', dtype=np.float64)
```

### Standard Formats

- **HDF5**: `h5py` library
- **FITS**: `astropy` library
- **Images**: PIL/Pillow, OpenCV

## Working with Arrays of Strings and Bytes

### Fixed-Width String Types

```python
# Unicode strings (default)
np.array(["hello", "world"])     # dtype='<U5'
np.array([b"hello", b"world"])   # dtype='|S5' (bytestrings)

# void type for raw bytes
np.array([b"hello", b"world"]).astype(np.void)  # dtype='|V5'
```

### Variable-Width Strings (NumPy 2.0+)

```python
# StringDType for variable-length strings
arr = np.array(["hello", "world"], dtype=np.dtypes.StringDType())
```

### When to Use Each

- **Fixed-width** (`<U`, `|S`, `|V`): Known maximum length, memory-mapped data, C interop
- **Variable-width** (`StringDType`): Unknown lengths, Python strings, more flexible

## Structured Arrays

Structured arrays are ndarrays whose datatype is a composition of simpler datatypes organized as named fields:

```python
x = np.array([('Rex', 9, 81.0), ('Fido', 3, 27.0)],
              dtype=[('name', 'U10'), ('age', 'i4'), ('weight', 'f4')])
# array([('Rex', 9, 81.), ('Fido', 3, 27.)],
#       dtype=[('name', '<U10'), ('age', '<i4'), ('weight', '<f4')])

# Access by field name
x['age']                         # array([9, 3], dtype=int32)
x['age'] = 5                     # modify field

# Access by index
x[1]                             # np.void(('Fido', 3, 27.0), dtype=...)
```

### Structured Datatype Creation

```python
# List of tuples
dt = np.dtype([('name', 'U10'), ('age', 'i4'), ('weight', 'f4')])

# With offsets (C-struct-like)
dt = np.dtype({'names': ['name', 'age'], 'formats': ['U10', 'i4']})

# Nested datatypes
dt = np.dtype([('inner', [('x', 'i4'), ('y', 'i4')]), ('z', 'f8')])
```

### Subarray Datatypes

```python
dt = np.dtype([('id', 'i4'), ('value', 'f4', (3,))])
x = np.array([(1, [1.0, 2.0, 3.0])], dtype=dt)
x['value']                       # array([[1., 2., 3.]])
```

> **Note**: For tabular data analysis, consider pandas or xarray instead of structured arrays for better high-level support.

## Universal Functions (ufunc)

A ufunc operates on ndarrays element-by-element, supporting array broadcasting, type casting, and other features.

### Basic Usage

```python
a = np.arange(6).reshape(3, 2)
np.add(a, a)                     # element-wise addition
np.matmul(a, a.T)                # matrix multiplication (gufunc)

# Common math ufuncs
np.sin(a), np.cos(a), np.exp(a), np.sqrt(a)
np.add(a, b), np.subtract(a, b), np.multiply(a, b), np.divide(a, b)
```

### ufunc Methods

```python
a = np.array([1, 2, 3, 4])
np.add.reduce(a)                 # 10 — sum all elements
np.add.accumulate(a)             # array([1, 3, 6, 10]) — cumulative sum
np.multiply.reduce(a)            # 24 — product of all elements
np.add.outer([1, 2], [3, 4])    # array([[4, 5], [5, 6]])
```

### Output Type

```python
# ufuncs return ndarrays; 0-d results become scalars
# Use out= to write to existing array
result = np.empty(3)
np.add([1, 2, 3], [4, 5, 6], out=result)
```

### Type Casting Rules

ufuncs follow casting rules. Mixed scalar-array operations use special rules to prevent scalars from upcasting arrays:

```python
# Scalar doesn't upcast array (NEP 50 in NumPy 2.0)
np.array([3], dtype=np.float32) + np.float64(3)  # float64 array
np.float32(3) + 3.  # float32 (scalar precision preserved in 2.0)
```

### Custom ufuncs

```python
# Using frompyfunc
def my_func(x, y):
    return x + y

my_ufunc = np.frompyfunc(my_func, 2, 1)  # 2 inputs, 1 output
my_ufunc([1, 2], [3, 4])         # array([4, 6], dtype=object)

# Using vectorize (more options)
vfunc = np.vectorize(my_func)
vfunc([1, 2], [3, 4])            # array([4, 6])
```

### Error Handling

```python
np.seterr(all='warn')            # warn on floating-point errors
np.seterr(divide='raise')        # raise on division by zero
np.seterrcall(callable)          # custom error callback
```

### Buffer Size

```python
np.setbufsize(100000)            # set internal ufunc buffer size
```
