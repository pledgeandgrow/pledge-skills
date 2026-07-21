# NumPy — Getting Started & Quickstart

> Introduction to NumPy, installation, array basics, arithmetic, indexing, shape manipulation, stacking/splitting, copies/views, and advanced indexing.

**What is NumPy**: [numpy.org/doc/stable/user/whatisnumpy.html](https://numpy.org/doc/stable/user/whatisnumpy.html)  
**Quickstart**: [numpy.org/doc/stable/user/quickstart.html](https://numpy.org/doc/stable/user/quickstart.html)  
**Absolute Basics**: [numpy.org/doc/stable/user/absolute_beginners.html](https://numpy.org/doc/stable/user/absolute_beginners.html)  

## What is NumPy?

NumPy is the fundamental package for scientific computing in Python. It provides:
- A powerful N-dimensional array object (`ndarray`)
- Sophisticated broadcasting functions
- Tools for integrating C/C++ and Fortran code
- Linear algebra, Fourier transform, and random number capabilities

### Why is NumPy Fast?

**Vectorization** — Element-by-element operations are the "default mode" when an ndarray is involved, executed by pre-compiled C code:

```python
import numpy as np
# Instead of looping:
# for (i = 0; i < rows; i++) { for (j = 0; j < columns; j++) { c[i][j] = a[i][j]*b[i][j]; } }

# NumPy does this at near-C speeds:
c = a * b
```

Advantages of vectorization:
- More concise and easier to read
- Fewer lines of code → fewer bugs
- Closely resembles standard mathematical notation
- More "Pythonic" code

**Broadcasting** — Implicit element-by-element behavior of operations. Arrays of different shapes can be operated on provided the smaller array is "expandable" to the shape of the larger.

## Installation

```bash
pip install numpy
```

```python
import numpy as np
```

## The Basics

### Array Creation

```python
import numpy as np

# From a Python list
a = np.array([2, 3, 4])
a.dtype  # dtype('int64')

b = np.array([1.2, 3.5, 5.1])
b.dtype  # dtype('float64')

# 2D array from nested lists
b = np.array([(1.5, 2, 3), (4, 5, 6)])
# array([[1.5, 2. , 3. ], [4. , 5. , 6. ]])

# Explicit dtype
c = np.array([[1, 2], [3, 4]], dtype=np.complex128)
# array([[1.+0.j, 2.+0.j], [3.+0.j, 4.+0.j]])

# Common mistake — must pass a single sequence
a = np.array(1, 2, 3, 4)       # WRONG — TypeError
a = np.array([1, 2, 3, 4])     # RIGHT
```

### Placeholder Arrays

```python
np.zeros((3, 4))              # 3x4 array of zeros
np.ones((2, 3, 4), dtype=np.int16)  # 2x3x4 array of ones
np.empty((2, 3))              # Uninitialized array
```

### Sequences

```python
np.arange(10, 30, 5)          # array([10, 15, 20, 25])
np.arange(0, 2, 0.3)          # array([0., 0.3, 0.6, 0.9, 1.2, 1.5, 1.8])

# linspace — specify number of elements instead of step
np.linspace(0, 2, 9)          # array([0., 0.25, 0.5, 0.75, 1., 1.25, 1.5, 1.75, 2.])
x = np.linspace(0, 2 * np.pi, 100)
f = np.sin(x)
```

### Printing Arrays

```python
a = np.arange(6)              # 1d
print(a)                      # [0 1 2 3 4 5]

b = np.arange(12).reshape(4, 3)  # 2d
print(b)
# [[ 0  1  2]
#  [ 3  4  5]
#  [ 6  7  8]
#  [ 9 10 11]]

c = np.arange(24).reshape(2, 3, 4)  # 3d
# Large arrays are automatically skipped:
print(np.arange(10000))
# [   0    1    2 ... 9997 9998 9999]
```

### Basic Arithmetic (Elementwise)

```python
a = np.array([20, 30, 40, 50])
b = np.arange(4)
c = a - b                     # array([20, 29, 38, 47])
b**2                          # array([0, 1, 4, 9])
10 * np.sin(a)                # array([9.129..., -9.880..., 7.451..., -2.623...])
a < 35                        # array([ True, True, False, False])
```

### Matrix Product

```python
A = np.array([[1, 1], [0, 1]])
B = np.array([[2, 0], [3, 4]])

A * B       # elementwise product: array([[2, 0], [0, 4]])
A @ B       # matrix product: array([[5, 4], [3, 4]])
A.dot(B)    # another matrix product: array([[5, 4], [3, 4]])
```

### In-Place Operations

```python
a = np.ones((2, 3), dtype=np.int_)
b = np.random.default_rng(1).random((2, 3))
a *= 3                        # modifies a in place
b += a                        # modifies b in place
# a += b  # ERROR: cannot cast float64 to int64
```

### Upcasting

```python
a = np.ones(3, dtype=np.int32)
b = np.linspace(0, np.pi, 3)
c = a + b                     # upcast to float64
d = np.exp(c * 1j)            # upcast to complex128
```

### Unary Operations (axis parameter)

```python
b = np.arange(12).reshape(3, 4)
b.sum()                       # 66 — sum of all elements
b.sum(axis=0)                 # array([12, 15, 18, 21]) — sum of each column
b.min(axis=1)                 # array([0, 4, 8]) — min of each row
b.cumsum(axis=1)              # cumulative sum along each row
```

## Universal Functions (ufunc)

```python
B = np.arange(3)
np.exp(B)                     # array([1., 2.71828183, 7.3890561])
np.sqrt(B)                    # array([0., 1., 1.41421356])
np.add(B, np.array([2., -1., 4.]))  # array([2., 0., 6.])
```

## Indexing, Slicing, and Iterating

### 1D Arrays

```python
a = np.arange(10)**3
a[2]                          # 8
a[2:5]                        # array([8, 27, 64])
a[:6:2] = 1000                # set every 2nd element to 1000
a[::-1]                       # reversed array

for i in a:
    print(i**(1 / 3.))
```

### Multidimensional Arrays

```python
b = np.fromfunction(lambda x, y: 10 * x + y, (5, 4), dtype=np.int_)
b[2, 3]                       # 23
b[0:5, 1]                     # each row in second column
b[:, 1]                       # same thing
b[1:3, :]                     # second and third row
b[-1]                         # last row (equivalent to b[-1, :])
```

### Dots (...) and Ellipsis

```python
c = np.array([[[0, 1, 2], [10, 12, 13]], [[100, 101, 102], [110, 112, 113]]])
c.shape                       # (2, 2, 3)
c[1, ...]                     # same as c[1, :, :]
c[..., 2]                     # same as c[:, :, 2]
```

### Iterating

```python
for row in b:
    print(row)

for element in b.flat:
    print(element)
```

## Shape Manipulation

```python
a = np.floor(10 * np.random.default_rng(1).random((3, 4)))
a.shape                       # (3, 4)

a.ravel()                     # flattened array
a.reshape(6, 2)               # returns modified shape
a.T                           # transposed
a.T.shape                     # (4, 3)

a.resize((2, 6))              # modifies array in-place
a.reshape(3, -1)              # -1 = auto-calculate dimension
```

## Stacking Arrays

```python
a = np.floor(10 * np.random.default_rng(1).random((2, 2)))
b = np.floor(10 * np.random.default_rng(2).random((2, 2)))

np.vstack((a, b))             # vertical stack
np.hstack((a, b))             # horizontal stack
np.column_stack((a, b))       # stack 1D as columns into 2D

# r_ and c_ for range literals
np.r_[1:4, 0, 4]              # array([1, 2, 3, 0, 4])
```

## Splitting Arrays

```python
a = np.floor(10 * np.random.default_rng(1).random((2, 12)))

np.hsplit(a, 3)               # split into 3 equal parts
np.hsplit(a, (3, 4))          # split after 3rd and 4th column
np.vsplit(a, 2)               # vertical split
np.array_split(a, 3, axis=1)  # split along specified axis
```

## Copies and Views

### No Copy (Assignment)

```python
a = np.array([[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]])
b = a                         # no new object created
b is a                        # True
```

### View (Shallow Copy)

```python
c = a.view()
c is a                        # False
c.base is a                   # True
c.flags.owndata               # False

c = c.reshape((2, 6))         # a's shape doesn't change
c[0, 4] = 1234                # a's data changes!

# Slicing returns a view:
s = a[:, 1:3]
s[:] = 10                     # modifies a
```

### Copy (Deep Copy)

```python
d = a.copy()
d is a                        # False
d.base is a                   # False
d[0, 0] = 9999                # a is not affected

# Important: copy after slicing to release memory
a = np.arange(int(1e8))
b = a[:100].copy()
del a                         # memory of a can be released
```

## Advanced Indexing

### Integer Array Indexing

```python
a = np.arange(12)**2
i = np.array([1, 1, 3, 8, 5])
a[i]                          # array([1, 1, 9, 64, 25])

j = np.array([[3, 4], [9, 7]])
a[j]                          # 2D result: array([[9, 16], [81, 49]])
```

### Boolean Indexing

```python
a = np.arange(12).reshape(3, 4)
b = a > 4
a[b]                          # 1d array with selected elements: array([5, 6, 7, 8, 9, 10, 11])
a[b] = 0                      # All elements > 4 become 0

# Per-dimension boolean selection
b1 = np.array([False, True, True])   # row selection
b2 = np.array([True, False, True, False])  # column selection
a[b1, :]                      # selecting rows
a[:, b2]                      # selecting columns
a[b1, b2]                     # array([4, 10])
```

### ix_ Function

```python
a = np.array([2, 3, 4, 5])
b = np.array([8, 5, 4])
c = np.array([5, 4, 6, 8, 3])
ax, bx, cx = np.ix_(a, b, c)
result = ax + bx * cx         # 3D result via broadcasting
```

## Linear Algebra

```python
import numpy as np
from numpy.linalg import inv, solve, eig

A = np.array([[1, 2], [3, 4]])
A.T                           # transpose
A @ A                         # matrix product
inv(A)                        # inverse
solve(A, [1, 2])              # solve Ax = b
eig(A)                        # eigenvalues and eigenvectors
np.trace(A)                   # trace
np.linalg.det(A)              # determinant
np.linalg.svd(A)              # singular value decomposition
```

## Histograms

```python
import numpy as np
import matplotlib.pyplot as plt

rg = np.random.default_rng(1)
mu, sigma = 2, 0.5
v = rg.normal(mu, sigma, 10000)

plt.hist(v, bins=50, density=True)  # matplotlib version (plots)

# NumPy version (data only, no plot):
n, bins = np.histogram(v, bins=50, density=True)
plt.plot(0.5 * (bins[1:] + bins[:-1]), n)
```

## Tips and Tricks

### "Automatic" Reshaping

```python
a = np.arange(30)
b = a.reshape((2, -1, 3))     # -1 means "whatever is needed"
b.shape                       # (2, 5, 3)
```

### Vector Stacking

```python
x = np.arange(0, 10, 2)
y = np.arange(5)
m = np.vstack([x, y])         # 2D array from row vectors
xy = np.hstack([x, y])        # concatenated 1D array
```
