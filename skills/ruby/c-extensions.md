# C Extensions

Writing C extensions for Ruby: the Ruby C API, extconf.rb, and native extensions.

## Overview

Ruby C extensions allow you to write performance-critical code in C and call it from Ruby. The official guide is at [docs.ruby-lang.org/en/master/extension_rdoc.html](https://docs.ruby-lang.org/en/master/extension_rdoc.html).

## Basic structure

### Directory layout

```
my_extension/
├── ext/
│   └── my_extension/
│       ├── extconf.rb
│       ├── my_extension.c
│       └── my_extension.h
├── lib/
│   └── my_extension.rb
├── test/
└── my_extension.gemspec
```

### extconf.rb

```ruby
require 'mkmf'

# Check for required libraries
have_header('stdio.h')
have_library('crypto')

# Optional: check for pkg-config
pkg_config('openssl')

# Create Makefile
create_makefile('my_extension/my_extension')
```

### Basic C extension

```c
// my_extension.c
#include "ruby.h"

// A simple method that returns a string
static VALUE
rb_hello(VALUE self) {
    return rb_str_new_cstr("Hello from C!");
}

// A method that adds two integers
static VALUE
rb_add(VALUE self, VALUE a, VALUE b) {
    int result = NUM2INT(a) + NUM2INT(b);
    return INT2NUM(result);
}

// Initialize the extension
void
Init_my_extension(void) {
    VALUE mMyExtension = rb_define_module("MyExtension");

    rb_define_module_function(mMyExtension, "hello", rb_hello, 0);
    rb_define_module_function(mMyExtension, "add", rb_add, 2);
}
```

### Using from Ruby

```ruby
require 'my_extension'

MyExtension.hello  # => "Hello from C!"
MyExtension.add(2, 3)  # => 5
```

## Ruby C API

### Data type conversion

```c
// Ruby to C
int i = NUM2INT(value);        // Integer to int
long l = NUM2LONG(value);      // Integer to long
double d = NUM2DBL(value);     // Float to double
char *s = StringValueCStr(value);  // String to char*
VALUE str = StringValue(value);    // Ensure it's a String

// C to Ruby
VALUE num = INT2NUM(42);       // int to Integer
VALUE lng = LONG2NUM(42L);     // long to Integer
VALUE dbl = DBL2NUM(3.14);     // double to Float
VALUE str = rb_str_new_cstr("hello");  // char* to String
VALUE sym = ID2SYM(rb_intern("name")); // to Symbol
```

### Checking types

```c
if (TYPE(value) == T_STRING) { }
if (RB_TYPE_P(value, T_ARRAY)) { }
if (FIXNUM_P(value)) { }      // Small integer
if (NIL_P(value)) { }         // nil
Check_Type(value, T_STRING);  // Raises if wrong type
```

### Defining classes and methods

```c
void Init_my_extension(void) {
    // Define a class
    VALUE cMyClass = rb_define_class("MyClass", rb_cObject);

    // Define instance methods
    rb_define_method(cMyClass, "method_name", my_method, argc);
    rb_define_method(cMyClass, "method_with_args", my_method, 1);

    // Define class methods
    rb_define_singleton_method(cMyClass, "create", my_create, 0);

    // Define module
    VALUE mMyModule = rb_define_module("MyModule");
    rb_define_module_function(mMyModule, "func", my_func, 0);

    // Define constants
    rb_define_const(cMyClass, "VERSION", rb_str_new_cstr("1.0.0"));

    // Define attribute accessors
    rb_define_attr(cMyClass, "name", 1, 1);  // readable, writable
}
```

### Method arguments

```c
// Fixed number of arguments
static VALUE
rb_method(VALUE self, VALUE arg1, VALUE arg2) {
    // ...
}
// argc = 2 when defining

// Variable arguments
static VALUE
rb_method(int argc, VALUE *argv, VALUE self) {
    VALUE a, b, c;
    rb_scan_args(argc, argv, "21", &a, &b, &c);
    // "21" = 2 required, 1 optional
    // ...
}
// argc = -1 when defining

// Keyword arguments
static VALUE
rb_method(int argc, VALUE *argv, VALUE self) {
    VALUE kwargs;
    rb_scan_args(argc, argv, ":", &kwargs);
    // or use rb_get_kwargs
}
```

### Working with blocks

```c
static VALUE
rb_with_block(VALUE self) {
    if (rb_block_given_p()) {
        return rb_yield(INT2NUM(42));
    }
    return Qnil;
}
```

### Raising exceptions

```c
rb_raise(rb_eArgError, "invalid argument: %d", value);
rb_raise(rb_eRuntimeError, "something went wrong");

// Check type and raise
Check_Type(value, T_STRING);

// Raise if nil
if (NIL_P(value)) {
    rb_raise(rb_eArgError, "value cannot be nil");
}
```

### Instance variables

```c
// Get
VALUE ivar = rb_iv_get(self, "@name");

// Set
rb_iv_set(self, "@name", rb_str_new_cstr("Alice"));

// With ID (faster)
ID id_name = rb_intern("@name");
VALUE ivar = rb_ivar_get(self, id_name);
rb_ivar_set(self, id_name, value);
```

### Garbage collection

```c
// Mark objects to prevent GC
static void
my_mark(void *ptr) {
    MyStruct *s = (MyStruct *)ptr;
    rb_gc_mark(s->ruby_object);
}

// Free resources
static void
my_free(void *ptr) {
    xfree(ptr);
}

// Allocate
static VALUE
my_alloc(VALUE klass) {
    MyStruct *ptr = ALLOC(MyStruct);
    return Data_Wrap_Struct(klass, my_mark, my_free, ptr);
}
```

### TypedData (modern approach)

```c
static size_t
my_size(const void *ptr) {
    return sizeof(MyStruct);
}

static const rb_data_type_t my_type = {
    "MyClass",
    { my_mark, my_free, my_size },
    NULL, NULL, RUBY_TYPED_FREE_IMMEDIATELY
};

static VALUE
my_alloc(VALUE klass) {
    MyStruct *ptr;
    return TypedData_Make_Struct(klass, MyStruct, &my_type, ptr);
}

// Access data
MyStruct *ptr;
TypedData_Get_Struct(self, MyStruct, &my_type, ptr);
```

## Building

```bash
# From the extension directory
ruby extconf.rb
make
make install

# In a gem
gem build my_gem.gemspec
gem install ./my_gem-1.0.0.gem --verbose
```

## Debugging

```bash
# Build with debug symbols
CFLAGS="-g -O0" ruby extconf.rb
make

# Use GDB
gdb ruby
run -e "require 'my_extension'; MyExtension.test"

# Use LLDB
lldb ruby
run -e "require 'my_extension'"
```

## ffi (Alternative to C extensions)

For simpler extensions, consider the `ffi` gem:

```ruby
require 'ffi'

module MyLib
  extend FFI::Library
  ffi_lib 'c'

  attach_function :strlen, [:string], :size_t
  attach_function :malloc, [:size_t], :pointer
end

MyLib.strlen("hello")  # => 5
```

## Generational GC and write barriers

Ruby uses a generational garbage collector. C extensions must implement write barriers for objects that reference other Ruby objects:

```c
// Write barrier — called when an object starts referencing another
static void
my_mark(void *ptr) {
    MyStruct *s = (MyStruct *)ptr;
    rb_gc_mark(s->child);
    // For generational GC, use write barriers:
    rb_gc_write_barrier(s->parent, s->child);
}

// RB_GC_GUARD — prevent premature GC of local variables
static VALUE
rb_method(VALUE self) {
    VALUE tmp = rb_str_new_cstr("temp");
    // Do something that might trigger GC...
    rb_funcall(tmp, rb_intern("length"), 0);
    RB_GC_GUARD(tmp);  // Ensure tmp isn't collected before this point
    return tmp;
}
```

## Ractor support in C extensions

For Ractor-safe C extensions, data must be marked as shareable:

```c
// Mark TypedData as Ractor-shareable
static const rb_data_type_t my_type = {
    "MyClass",
    { my_mark, my_free, my_size },
    NULL, NULL,
    RUBY_TYPED_FREE_IMMEDIATELY | RUBY_TYPED_WB_PROTECTED  // Write barrier protected
};

// Check if running in a Ractor
if (rb_ractor_single_p()) {
    // Single Ractor mode — safe
} else {
    // Multiple Ractors — ensure shareability
}
```

## Best practices

1. Use TypedData over Data_Wrap_Struct (modern API)
2. Always implement `mark` and `free` functions for GC
3. Use `rb_scan_args` for flexible argument parsing
4. Check types with `Check_Type` or `RB_TYPE_P`
5. Use `StringValueCStr` for safe string access
6. Handle blocks with `rb_block_given_p` and `rb_yield`
7. Use `rb_raise` for exceptions (not C's `abort`)
8. Prefer `ffi` for simple bindings (no compilation needed)
9. Profile before optimizing — Ruby may be fast enough
10. Test on all target platforms (Linux, macOS, Windows)
11. Implement write barriers for generational GC compatibility
12. Use `RB_GC_GUARD` to protect local variables from premature GC
13. Mark data types as `RUBY_TYPED_WB_PROTECTED` for Ractor support
