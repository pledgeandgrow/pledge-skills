# STL Containers

## Sequence Containers

### std::vector — dynamic array

```cpp
#include <vector>

// Creation
std::vector<int> v1;                    // empty
std::vector<int> v2(10);               // 10 elements, value-initialized (0)
std::vector<int> v3(10, 42);           // 10 elements, all 42
std::vector<int> v4{1, 2, 3, 4, 5};    // initializer list
std::vector<int> v5 = {1, 2, 3};       // copy-list-init
std::vector v6{1, 2, 3};               // CTAD (C++17)

// Access
v[0];                  // no bounds checking (UB if out of range)
v.at(2);               // bounds checking (throws std::out_of_range)
v.front();             // first element
v.back();              // last element
v.data();              // raw pointer to array

// Iterators
v.begin(); v.end();    // forward iterators
v.rbegin(); v.rend();  // reverse iterators
v.cbegin(); v.cend();  // const iterators (C++11)
v.crbegin(); v.crend();// const reverse iterators

// Capacity
v.size();              // number of elements
v.empty();             // true if empty
v.capacity();          // allocated space
v.reserve(100);        // pre-allocate (no shrink)
v.shrink_to_fit();     // request capacity reduction (non-binding)
v.max_size();          // theoretical max

// Modifiers
v.push_back(42);       // append (amortized O(1))
v.emplace_back(42);    // construct in place (no copy/move)
v.pop_back();          // remove last
v.insert(v.begin() + 1, 99);  // insert at position
v.insert(v.begin(), {1, 2, 3});  // insert multiple
v.emplace(v.begin() + 1, 99);   // construct in place at position
v.erase(v.begin());    // erase at position
v.erase(v.begin(), v.begin() + 3);  // erase range
v.clear();             // remove all
v.resize(20);          // resize (new elements value-initialized)
v.resize(20, 42);      // resize with fill value
v.swap(v2);            // swap contents (O(1))
v.assign(10, 42);      // replace contents with 10 copies of 42
v.assign({1, 2, 3});   // replace with initializer list

// C++20: constexpr vector
constexpr std::vector<int> cv{1, 2, 3};  // C++20 (with allocator)

// C++23: range constructors
int arr[] = {1, 2, 3, 4, 5};
std::vector v7(std::from_range, arr);  // C++23

// C++23: append_range, assign_range, insert_range
v.append_range(arr);  // C++23
v.insert_range(v.end(), arr);  // C++23
```

### std::array — fixed-size array

```cpp
#include <array>

std::array<int, 5> a1 = {1, 2, 3, 4, 5};
std::array a2{1, 2, 3, 4, 5};  // CTAD (C++17)

a1[0]; a1.at(2); a1.front(); a1.back();
a1.data();  // raw pointer
a1.size(); a1.empty();
a1.fill(42);  // fill all elements with 42
a1.swap(a2);

// Iterators
a1.begin(); a1.end();
a1.rbegin(); a1.rend();

// Structured bindings
auto [a, b, c, d, e] = a1;

// constexpr
constexpr std::array<int, 3> ca = {1, 2, 3};
static_assert(ca[0] == 1);

// std::to_array (C++20)
auto arr = std::to_array({1, 2, 3, 4, 5});  // copies
auto arr2 = std::to_array<int>({1, 2, 3});  // explicit type
```

### std::deque — double-ended queue

```cpp
#include <deque>

std::deque<int> dq = {1, 2, 3};

dq.push_back(4);     // append (O(1))
dq.push_front(0);    // prepend (O(1))
dq.pop_back();       // remove last
dq.pop_front();      // remove first
dq[2]; dq.at(2);
dq.front(); dq.back();
dq.insert(dq.begin() + 2, 99);
dq.erase(dq.begin() + 1);
dq.clear();
// No contiguous storage — data() not available
```

### std::list — doubly-linked list

```cpp
#include <list>

std::list<int> l = {1, 2, 3};

l.push_back(4); l.push_front(0);
l.pop_back(); l.pop_front();
l.front(); l.back();

// O(1) insertion/erasure at known position
l.insert(l.begin(), 99);
l.erase(l.begin());

// List-specific operations
l.splice(l.end(), otherList);  // transfer elements (O(1))
l.splice(l.end(), otherList, otherList.begin());

l.remove(42);              // remove all elements equal to 42
l.remove_if([](int x) { return x % 2 == 0; });
l.unique();                // remove consecutive duplicates
l.unique([](int a, int b) { return a == b; });
l.sort();                  // sort (merge sort, O(n log n))
l.sort(std::greater<>());  // descending
l.merge(otherList);        // merge sorted lists
l.reverse();               // reverse order

// No random access — no operator[], no at()
// Iterators are bidirectional (not random access)
```

### std::forward_list — singly-linked list

```cpp
#include <forward_list>

std::forward_list<int> fl = {1, 2, 3};

fl.push_front(0);
fl.pop_front();
fl.front();

// Insert after (not before — singly linked)
fl.insert_after(fl.begin(), 99);
fl.erase_after(fl.begin());

fl.remove(42);
fl.remove_if([](int x) { return x > 10; });
fl.unique();
fl.sort();
fl.reverse();
fl.merge(otherList);
fl.splice_after(fl.begin(), otherList);

// No size() method (would be O(n))
// No back() — only front()
```

### std::span — view of contiguous data (C++20)

```cpp
#include <span>

// Non-owning view of contiguous data
int arr[] = {1, 2, 3, 4, 5};
std::vector<int> v = {10, 20, 30};

std::span<int> s1(arr, 5);
std::span<int> s2(v);
std::span<int> s3{arr};  // deduces size from array
std::span<const int> s4{v};  // const view

s1.size(); s1.empty();
s1[0]; s1.front(); s1.back();
s1.data();
s1.begin(); s1.end();

// Subviews
s1.first(3);   // first 3 elements
s1.last(2);    // last 2 elements
s1.subspan(1, 3);  // offset 1, count 3

// Fixed extent
std::span<int, 5> fixed{arr};  // size known at compile time
static_assert(fixed.size() == 5);

// Function parameter — efficient, non-owning
void process(std::span<int> data) {
    for (auto& x : data) x *= 2;
}
process(arr);
process(v);
```

## Associative Containers

### std::map — sorted key-value map (red-black tree)

```cpp
#include <map>

std::map<std::string, int> m;
m["alice"] = 30;
m["bob"] = 25;
m.insert({"charlie", 35});
m.emplace("dave", 40);

// Access
m["alice"];           // 30 (creates 0 if not exists)
m.at("alice");        // 30 (throws if not exists)
m.size();
m.empty();

// Find
auto it = m.find("alice");
if (it != m.end()) {
    std::cout << it->first << ": " << it->second;
}

// Contains (C++20)
m.contains("alice");  // true

// Iteration (sorted by key)
for (const auto& [key, value] : m) {
    std::cout << key << ": " << value << '\n';
}

// Erase
m.erase("alice");
m.erase(m.begin());
m.clear();

// Lower/upper bound
m.lower_bound("b");  // first element >= "b"
m.upper_bound("b");  // first element > "b"
auto [lb, ub] = m.equal_range("b");  // [lower, upper)

// Count
m.count("alice");  // 0 or 1

// Custom comparator
std::map<std::string, int, std::greater<>> descMap;
```

### std::multimap — map allowing duplicate keys

```cpp
#include <map>

std::multimap<std::string, int> mm;
mm.insert({"a", 1});
mm.insert({"a", 2});  // duplicate key OK
mm.insert({"a", 3});

// All values for key "a"
auto [begin, end] = mm.equal_range("a");
for (auto it = begin; it != end; ++it) {
    std::cout << it->second << ' ';  // 1 2 3
}

mm.count("a");  // 3
```

### std::set — sorted set of unique keys

```cpp
#include <set>

std::set<int> s = {3, 1, 4, 1, 5, 9, 2, 6};  // {1, 2, 3, 4, 5, 6, 9}
s.insert(42);
s.emplace(100);
s.erase(3);
s.contains(42);  // C++20
s.count(42);     // 0 or 1
s.find(42);

// Iteration (sorted)
for (auto x : s) { std::cout << x << ' '; }

// Lower/upper bound
s.lower_bound(4);  // iterator to 4
s.upper_bound(4);  // iterator to 5
auto [lb, ub] = s.equal_range(4);

// Extract and insert (node-based, no copy)
auto node = s.extract(42);
s.insert(std::move(node));
```

### std::multiset — set allowing duplicates

```cpp
#include <set>

std::multiset<int> ms = {1, 1, 2, 3, 3, 3};
ms.insert(3);  // now four 3s
ms.count(3);   // 4
auto [begin, end] = ms.equal_range(3);
```

## Unordered Associative Containers

### std::unordered_map — hash-based map (average O(1))

```cpp
#include <unordered_map>

std::unordered_map<std::string, int> um;
um["alice"] = 30;
um.emplace("bob", 25);
um.insert({"charlie", 35});

um["alice"]; um.at("alice");
um.find("alice");
um.contains("alice");  // C++20
um.count("alice");
um.erase("alice");
um.clear();

// Iteration (unordered)
for (const auto& [key, value] : um) {
    std::cout << key << ": " << value << '\n';
}

// Bucket interface
um.bucket_count();
um.bucket_size(0);
um.bucket("alice");  // bucket index for key
um.load_factor();
um.max_load_factor();
um.rehash(100);   // set bucket count
um.reserve(100);  // reserve for n elements

// Custom hash
struct PairHash {
    size_t operator()(const std::pair<int, int>& p) const {
        return std::hash<int>{}(p.first) ^ (std::hash<int>{}(p.second) << 1);
    }
};
std::unordered_map<std::pair<int, int>, std::string, PairHash> pm;
```

### std::unordered_set, std::unordered_multimap, std::unordered_multiset

```cpp
#include <unordered_set>

std::unordered_set<int> us = {1, 2, 3, 4, 5};
us.insert(6);
us.contains(3);  // C++20
us.erase(2);

std::unordered_multimap<std::string, int> umm;
umm.insert({"a", 1});
umm.insert({"a", 2});  // duplicate key OK

std::unordered_multiset<int> ums = {1, 1, 2, 3};
ums.count(1);  // 2
```

## Container Adaptors

### std::stack — LIFO

```cpp
#include <stack>

std::stack<int> s;
s.push(1); s.push(2); s.push(3);
s.top();    // 3 (peek)
s.pop();    // remove 3
s.size();
s.empty();

// Underlying container (default: deque)
std::stack<int, std::vector<int>> sv;
std::stack<int, std::list<int>> sl;
```

### std::queue — FIFO

```cpp
#include <queue>

std::queue<int> q;
q.push(1); q.push(2); q.push(3);
q.front();  // 1
q.back();   // 3
q.pop();    // remove 1
q.size();
q.empty();
```

### std::priority_queue — max-heap by default

```cpp
#include <queue>

// Max-heap (default)
std::priority_queue<int> pq;
pq.push(3); pq.push(1); pq.push(4); pq.push(1); pq.push(5);
pq.top();   // 5 (max)
pq.pop();   // remove 5
pq.top();   // 4

// Min-heap
std::priority_queue<int, std::vector<int>, std::greater<>> minHeap;
minHeap.push(3); minHeap.push(1); minHeap.push(4);
minHeap.top();  // 1 (min)

// Custom comparator
struct Compare {
    bool operator()(int a, int b) { return a > b; }  // min-heap
};
std::priority_queue<int, std::vector<int>, Compare> customHeap;
```

## Flat Containers (C++23)

```cpp
#include <flat_map>
#include <flat_set>

// std::flat_map — sorted map backed by contiguous storage (faster iteration)
std::flat_map<std::string, int> fm;
fm["alice"] = 30;
fm["bob"] = 25;
// Backed by std::vector internally — faster iteration, cache-friendly

// std::flat_set
std::flat_set<int> fs = {3, 1, 4, 1, 5, 9};
// Sorted, unique, contiguous storage

// Custom underlying container
std::flat_map<int, int, std::less<>, std::vector<int>, std::vector<int>> fcm;
```

## Container Selection Guide

| Need | Container |
|------|-----------|
| Dynamic array, random access | `vector` |
| Fixed-size array | `array` |
| Fast front/back insertion | `deque` |
| Frequent middle insertion/deletion | `list` |
| Memory-efficient singly-linked list | `forward_list` |
| Sorted key-value map | `map` |
| Fast lookup key-value (unordered) | `unordered_map` |
| Sorted unique elements | `set` |
| Fast lookup unique elements (unordered) | `unordered_set` |
| LIFO | `stack` |
| FIFO | `queue` |
| Priority/max element | `priority_queue` |
| Non-owning view of contiguous data | `span` |
| Cache-friendly sorted map | `flat_map` (C++23) |
| Multiple values per key | `multimap` / `unordered_multimap` |
| Multiple same elements | `multiset` / `unordered_multiset` |

## inplace_vector (C++26)

```cpp
#include <inplace_vector>

// Fixed-capacity vector — no heap allocation, elements stored inline
// Capacity is fixed at compile time, size can vary 0..N
std::inplace_vector<int, 10> iv;
iv.push_back(1);   // OK (size < capacity)
iv.push_back(2);
iv.size();         // 2
iv.capacity();     // 10 (fixed)
iv[0];             // 1

// push_back when full — throws std::bad_alloc (or terminates if noexcept)
std::inplace_vector<int, 2> iv2;
iv2.push_back(1);
iv2.push_back(2);
// iv2.push_back(3);  // throws std::bad_alloc (capacity exceeded)

// try_push_back — returns nullptr if full (no throw)
auto result = iv2.try_push_back(3);  // nullptr (full)

// unchecked_push_back — UB if full (no bounds check)
iv2.unchecked_push_back(3);  // UB! capacity exceeded

// All vector operations supported (except reserve/shrink_to_fit)
iv.pop_back();
iv.clear();
iv.insert(iv.begin(), 42);
iv.erase(iv.begin());

// Use case: embedded, real-time, no-heap environments
// Stack allocation, predictable performance
```

## hive (C++26)

```cpp
#include <hive>

// std::hive — colony container (P0447)
// Linked blocks of elements, not contiguous
// Optimized for: frequent insertion/erasure, traversal, pointer stability
// Better cache performance than std::list for small elements

std::hive<int> h;
h.insert(42);
h.insert(10);
h.insert(20);

// Iterators remain valid after insert/erase (pointer stability)
auto it = h.begin();
h.insert(99);
*it;  // still valid (42)

// Erase
h.erase(it);  // iterator to next element returned

// Splice (move elements between hives)
std::hive<int> h2;
h2.splice(h2.end(), h);

// Properties:
// - O(1) insertion, O(1) erasure
// - Pointers/iterators to elements remain valid after insert/erase
// - Better cache locality than list (block-based storage)
// - Non-contiguous (unlike vector)
// - Use case: game objects, particles, entities with frequent add/remove
```

## std::mdspan (C++23)

```cpp
#include <mdspan>  // C++23

// std::mdspan — multidimensional non-owning array view
// Generalization of std::span to N dimensions

// 2D matrix view
double data[3][4];
std::mdspan<double, std::extents<size_t, 3, 4>> mat(data);
mat[0, 0] = 1.0;  // C++23 multidimensional subscript
mat[2, 3] = 9.0;

// Dynamic extents (runtime-sized dimensions)
std::mdspan<double, std::dextents<size_t, 2>> dyn(data, rows, cols);
dyn[r, c] = value;

// Mixed static and dynamic extents
std::mdspan<double, std::extents<size_t, std::dynamic_extent, 4>> mixed(data, rows);
// rows is runtime, cols is fixed at 4

// 3D tensor
std::mdspan<float, std::dextents<size_t, 3>> tensor(data, N, M, K);
tensor[i, j, k] = 0.0f;

// Layouts
// std::layout_right — row-major (C/C++ default): last index varies fastest
// std::layout_left  — column-major (Fortran): first index varies fastest
// std::layout_stride — arbitrary strides

std::mdspan<double, std::dextents<size_t, 2>, std::layout_left> col_major(data, rows, cols);

// Submdspan (C++26) — slice a subview
auto sub = std::submdspan(mat, std::pair{1, 3}, std::full_extent);
// sub is rows 1-2, all columns

// Properties:
// - Non-owning view (like span)
// - Zero overhead — just pointer + extents
// - Works with any contiguous data (array, vector, raw pointer)
// - Supports custom layouts and accessors
// - Integrates with std::linalg (C++26)
```

## std::flat_map / std::flat_set (C++23)

```cpp
#include <flat_map>   // C++23
#include <flat_set>   // C++23

// std::flat_map — sorted associative container backed by contiguous storage
// Drop-in replacement for std::map with better cache locality

std::flat_map<int, std::string> fm;
fm[1] = "one";
fm[3] = "three";
fm[2] = "two";
// Internally: sorted vector of pairs

// Iteration is sorted
for (const auto& [k, v] : fm) {
    std::cout << k << ": " << v << '\n';  // 1:one 2:two 3:three
}

// Lookup — O(log n) binary search, but faster than map (cache-friendly)
auto it = fm.find(2);
bool has = fm.contains(3);

// Insert — O(n) (may shift elements)
fm.insert({4, "four"});

// Erase — O(n)
fm.erase(1);

// Underlying storage access
auto& underlying = fm.sorted_keys();  // access sorted key storage

// Construct from sorted range (O(n))
std::vector<std::pair<int, std::string>> sorted_data = {{1, "a"}, {2, "b"}, {3, "c"}};
std::flat_map<int, std::string> fm2(std::sorted_unique, sorted_data);

// std::flat_set — same but for keys only
std::flat_set<int> fs = {3, 1, 4, 1, 5};  // {1, 3, 4, 5}

// Advantages over std::map:
// - Better cache locality (contiguous storage)
// - Less memory overhead (no tree nodes)
// - Faster iteration
// - Better for small-to-medium sizes

// Disadvantages:
// - Insert/erase is O(n) (shifts elements)
// - Not stable for iterators on insert/erase

// Use flat_map when:
// - Read-heavy workloads
// - Small maps (< ~100 elements)
// - Cache locality matters
// - Need contiguous memory
```
