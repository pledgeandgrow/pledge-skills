# STL Algorithms, Iterators, Ranges

## Iterators

### Iterator Categories

```
InputIterator:        read once, increment         (istream_iterator)
OutputIterator:       write once, increment        (back_insert_iterator, ostream_iterator)
ForwardIterator:      read/write multiple, increment (forward_list::iterator)
BidirectionalIterator: read/write, increment/decrement (list::iterator, map::iterator)
RandomAccessIterator:  read/write, +/- arithmetic    (vector::iterator, deque::iterator)
ContiguousIterator:    contiguous memory (C++20)     (vector::iterator, array::iterator)
```

### Iterator Functions

```cpp
#include <iterator>

std::vector<int> v = {1, 2, 3, 4, 5};

// Advance
auto it = v.begin();
std::advance(it, 3);   // it now points to v[3] (4)
std::advance(it, -1);  // it now points to v[2] (3)

// Distance
auto d = std::distance(v.begin(), v.end());  // 5

// Next/prev (return new iterator, don't modify)
auto next = std::next(v.begin(), 2);  // v[2]
auto prev = std::prev(v.end(), 2);    // v[3]

// Iterator traits
std::iterator_traits<decltype(it)>::value_type;       // int
std::iterator_traits<decltype(it)>::difference_type;  // ptrdiff_t
std::iterator_traits<decltype(it)>::iterator_category; // random_access_iterator_tag
```

### Special Iterators

```cpp
// Insert iterators
std::vector<int> v;
std::fill_n(std::back_inserter(v), 5, 42);  // v = {42, 42, 42, 42, 42}
std::copy(src.begin(), src.end(), std::back_inserter(v));

std::list<int> l;
std::fill_n(std::front_inserter(l), 3, 99);  // l = {99, 99, 99}

std::vector<int> v2(10);
std::fill_n(std::inserter(v2, v2.begin() + 5), 3, 7);

// Stream iterators
#include <iterator>
std::vector<int> v3;
std::copy(std::istream_iterator<int>(std::cin), 
          std::istream_iterator<int>(),
          std::back_inserter(v3));  // read ints from stdin

std::copy(v.begin(), v.end(), 
          std::ostream_iterator<int>(std::cout, " "));  // print "1 2 3 4 5 "

// Move iterator
std::vector<std::string> src = {"a", "b", "c"};
std::vector<std::string> dst(
    std::make_move_iterator(src.begin()),
    std::make_move_iterator(src.end())
);  // moves strings from src to dst

// Counted iterator (C++20)
auto ci = std::counted_iterator(v.begin(), 3);  // iterate 3 elements
auto sentinel = std::default_sentinel;
for (auto it = ci; it != sentinel; ++it) { std::cout << *it; }

// Common view (C++20) — make begin/end same type
auto cv = v | std::views::common;
```

## Algorithms

### Non-modifying Algorithms

```cpp
#include <algorithm>

std::vector<int> v = {1, 2, 3, 4, 5};

// Find
std::find(v.begin(), v.end(), 3);          // iterator to 3
std::find_if(v.begin(), v.end(), [](int x) { return x > 3; });  // iterator to 4
std::find_if_not(v.begin(), v.end(), [](int x) { return x < 0; });  // end (none < 0)

// Adjacent find
std::adjacent_find(v.begin(), v.end());  // find consecutive equal elements

// Count
std::count(v.begin(), v.end(), 3);           // 1
std::count_if(v.begin(), v.end(), [](int x) { return x % 2 == 0; });  // 2

// All/Any/None of
std::all_of(v.begin(), v.end(), [](int x) { return x > 0; });   // true
std::any_of(v.begin(), v.end(), [](int x) { return x > 3; });   // true
std::none_of(v.begin(), v.end(), [](int x) { return x < 0; });  // true

// For each
std::for_each(v.begin(), v.end(), [](int x) { std::cout << x; });

// Mismatch — find first difference
auto [it1, it2] = std::mismatch(v.begin(), v.end(), other.begin());

// Equal
std::equal(v.begin(), v.end(), other.begin());
std::equal(v.begin(), v.end(), other.begin(), other.end());

// Is permutation
std::is_permutation(v.begin(), v.end(), other.begin());

// Search
std::search(v.begin(), v.end(), sub.begin(), sub.end());  // search subrange
std::search_n(v.begin(), v.end(), 3, 42);  // search for 3 consecutive 42s

// Min/Max element
std::min_element(v.begin(), v.end());  // iterator to smallest
std::max_element(v.begin(), v.end());  // iterator to largest
auto [minIt, maxIt] = std::minmax_element(v.begin(), v.end());  // both

// Lexicographical compare
std::lexicographical_compare(v.begin(), v.end(), other.begin(), other.end());

// Fold (C++23)
std::ranges::fold_left(v, 0, std::plus<>());     // sum
std::ranges::fold_right(v, 0, std::plus<>());    // sum (right fold)
std::ranges::fold_left_with_iter(v, 0, std::plus<>());  // sum + iterator
```

### Modifying Algorithms

```cpp
// Copy
std::copy(v.begin(), v.end(), dst.begin());
std::copy_n(v.begin(), 3, dst.begin());
std::copy_if(v.begin(), v.end(), dst.begin(), [](int x) { return x > 2; });
std::copy_backward(v.begin(), v.end(), dst.end());

// Move
std::move(v.begin(), v.end(), dst.begin());
std::move_backward(v.begin(), v.end(), dst.end());

// Transform
std::transform(v.begin(), v.end(), dst.begin(), [](int x) { return x * 2; });
std::transform(v1.begin(), v1.end(), v2.begin(), dst.begin(), std::plus<>());

// Fill
std::fill(v.begin(), v.end(), 42);
std::fill_n(v.begin(), 5, 42);

// Generate
std::generate(v.begin(), v.end(), []() { return rand(); });
std::generate_n(v.begin(), 5, []() { return rand(); });

// Replace
std::replace(v.begin(), v.end(), 0, 42);  // replace 0 with 42
std::replace_if(v.begin(), v.end(), [](int x) { return x < 0; }, 0);
std::replace_copy(v.begin(), v.end(), dst.begin(), 0, 42);

// Remove (erase-remove idiom)
auto newEnd = std::remove(v.begin(), v.end(), 42);  // move non-42 to front
v.erase(newEnd, v.end());  // actually remove
// C++20: std::erase(v, 42);  — direct erase
// C++20: std::erase_if(v, [](int x) { return x % 2 == 0; });

// Unique
auto newEnd2 = std::unique(v.begin(), v.end());  // remove consecutive duplicates
v.erase(newEnd2, v.end());
std::unique_copy(v.begin(), v.end(), dst.begin());

// Reverse
std::reverse(v.begin(), v.end());
std::reverse_copy(v.begin(), v.end(), dst.begin());

// Rotate
std::rotate(v.begin(), v.begin() + 2, v.end());  // rotate left by 2
std::rotate_copy(v.begin(), v.begin() + 2, v.end(), dst.begin());

// Shuffle
#include <random>
std::random_device rd;
std::mt19937 g(rd());
std::shuffle(v.begin(), v.end(), g);

// Sample (C++17)
std::sample(v.begin(), v.end(), dst.begin(), 3, g);  // pick 3 random elements

// Swap
std::swap(a, b);
std::swap_ranges(v1.begin(), v1.end(), v2.begin());
std::iter_swap(it1, it2);

// Clamp (C++17) — constrain value to [lo, hi]
std::clamp(15, 0, 10);   // 10 (above range)
std::clamp(-5, 0, 10);   // 0 (below range)
std::clamp(5, 0, 10);    // 5 (in range)
std::clamp(x, 0.0, 1.0, std::less<>());  // with comparator

// Min/Max with initializer list (C++11)
std::min({3, 1, 4, 1, 5});   // 1
std::max({3, 1, 4, 1, 5});   // 5
std::minmax({3, 1, 4, 1, 5}); // pair(1, 5)
```

### Sorting Algorithms

```cpp
// Sort
std::sort(v.begin(), v.end());                          // ascending
std::sort(v.begin(), v.end(), std::greater<>());        // descending
std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });

// Partial sort
std::partial_sort(v.begin(), v.begin() + 3, v.end());  // top 3 sorted at front
std::partial_sort_copy(v.begin(), v.end(), dst.begin(), dst.end());

// Nth element — partition so nth is in sorted position
std::nth_element(v.begin(), v.begin() + 3, v.end());  // v[3] is 4th smallest

// Is sorted
std::is_sorted(v.begin(), v.end());
std::is_sorted_until(v.begin(), v.end());  // iterator to first unsorted

// Stable sort — preserves relative order of equal elements
std::stable_sort(v.begin(), v.end());

// Merge sorted ranges
std::merge(v1.begin(), v1.end(), v2.begin(), v2.end(), dst.begin());
std::inplace_merge(v.begin(), v.begin() + 5, v.end());
```

### Partition and Binary Search

```cpp
// Partition
auto it = std::partition(v.begin(), v.end(), [](int x) { return x % 2 == 0; });
// even elements before it, odd after
std::stable_partition(v.begin(), v.end(), [](int x) { return x % 2 == 0; });
std::partition_copy(v.begin(), v.end(), even.begin(), odd.begin(), pred);
std::is_partitioned(v.begin(), v.end(), pred);
std::partition_point(v.begin(), v.end(), pred);

// Binary search (on sorted range)
std::lower_bound(v.begin(), v.end(), 42);  // first >= 42
std::upper_bound(v.begin(), v.end(), 42);  // first > 42
std::binary_search(v.begin(), v.end(), 42);  // true if 42 exists
std::equal_range(v.begin(), v.end(), 42);  // [lower, upper)

// Includes (sorted range includes another)
std::includes(v.begin(), v.end(), sub.begin(), sub.end());

// Set operations (on sorted ranges)
std::set_union(a.begin(), a.end(), b.begin(), b.end(), dst.begin());
std::set_intersection(a.begin(), a.end(), b.begin(), b.end(), dst.begin());
std::set_difference(a.begin(), a.end(), b.begin(), b.end(), dst.begin());
std::set_symmetric_difference(a.begin(), a.end(), b.begin(), b.end(), dst.begin());
```

### Heap Operations

```cpp
std::vector<int> v = {3, 1, 4, 1, 5, 9, 2, 6};

// Make heap (max-heap)
std::make_heap(v.begin(), v.end());
v.front();  // 9 (max)

// Push/pop
v.push_back(8);
std::push_heap(v.begin(), v.end());  // restore heap after push
std::pop_heap(v.begin(), v.end());   // move max to end
v.pop_back();                         // remove max

// Sort heap (ascending)
std::sort_heap(v.begin(), v.end());

// Is heap
std::is_heap(v.begin(), v.end());
std::is_heap_until(v.begin(), v.end());
```

### Numeric Algorithms (`<numeric>`)

```cpp
#include <numeric>

std::vector<int> v = {1, 2, 3, 4, 5};

// Accumulate (sum by default)
std::accumulate(v.begin(), v.end(), 0);                    // 15
std::accumulate(v.begin(), v.end(), 1, std::multiplies<>()); // 120 (product)

// Reduce (C++17, parallelizable)
std::reduce(v.begin(), v.end(), 0);  // 15
// std::reduce(execution_policy, v.begin(), v.end(), 0);

// Inner product
std::inner_product(v.begin(), v.end(), v2.begin(), 0);

// Transform reduce (C++17)
std::transform_reduce(v.begin(), v.end(), 0, std::plus<>(), [](int x) { return x * x; });

// Partial sum
std::partial_sum(v.begin(), v.end(), dst.begin());  // {1, 3, 6, 10, 15}

// Exclusive/Inclusive scan (C++17)
std::exclusive_scan(v.begin(), v.end(), dst.begin(), 0);  // {0, 1, 3, 6, 10}
std::inclusive_scan(v.begin(), v.end(), dst.begin());     // {1, 3, 6, 10, 15}

// Adjacent difference
std::adjacent_difference(v.begin(), v.end(), dst.begin());  // {1, 1, 1, 1, 1}

// GCD / LCM (C++17)
std::gcd(12, 18);  // 6
std::lcm(4, 6);    // 12

// Midpoint (C++20)
std::midpoint(1, 10);  // 5 (for integers)
std::midpoint(1.0, 10.0);  // 5.5 (for floats)
```

## Ranges (C++20)

```cpp
#include <ranges>
#include <algorithm>

// Range-based algorithms (take range, not iterator pair)
std::vector<int> v = {5, 3, 1, 4, 2};
std::ranges::sort(v);
std::ranges::find(v, 3);
std::ranges::count(v, 3);
std::ranges::transform(v, v.begin(), [](int x) { return x * 2; });
std::ranges::reverse(v);
std::ranges::unique(v);
std::ranges::min_element(v);
std::ranges::max_element(v);
auto [mn, mx] = std::ranges::minmax_element(v);
std::ranges::copy(v, dst.begin());
std::ranges::fill(v, 42);

// Projection — transform elements before comparison
std::vector<Person> people = {{"Alice", 30}, {"Bob", 25}};
std::ranges::sort(people, {}, &Person::age);  // sort by age
std::ranges::sort(people, std::greater{}, &Person::name);  // sort by name descending

// Views — lazy, composable range adaptors
auto even = v | std::views::filter([](int x) { return x % 2 == 0; });
auto sq = v | std::views::transform([](int x) { return x * x; });
auto first3 = v | std::views::take(3);
auto after2 = v | std::views::drop(2);
auto reversed = v | std::views::reverse;
auto keys = map | std::views::keys;
auto values = map | std::views::values;

// Chaining views
auto result = v 
    | std::views::filter([](int x) { return x > 0; })
    | std::views::transform([](int x) { return x * x; })
    | std::views::take(5)
    | std::views::reverse;

// iota — infinite sequence
for (auto x : std::views::iota(1) | std::views::take(10)) {
    std::cout << x << ' ';  // 1 2 3 4 5 6 7 8 9 10
}

// repeat (C++26)
for (auto x : std::views::repeat(42) | std::views::take(5)) {
    std::cout << x << ' ';  // 42 42 42 42 42
}

// stride (C++23)
for (auto x : std::views::iota(0, 10) | std::views::stride(3)) {
    std::cout << x << ' ';  // 0 3 6 9
}

// chunk (C++23)
for (auto chunk : std::views::iota(0, 10) | std::views::chunk(3)) {
    for (auto x : chunk) std::cout << x << ' ';
    std::cout << "| ";  // 0 1 2 | 3 4 5 | 6 7 8 | 9 |
}

// slide (C++23) — sliding window
for (auto window : v | std::views::slide(3)) {
    for (auto x : window) std::cout << x << ' ';
    std::cout << "| ";
}

// adjacent (C++23)
for (auto [a, b] : v | std::views::pairwise) {  // C++23
    std::cout << a << "+" << b << ' ';
}

// zip (C++23)
for (auto [a, b] : std::views::zip(v1, v2)) {
    std::cout << a << ":" << b << ' ';
}

// join — flatten range of ranges
std::vector<std::vector<int>> nested = {{1, 2}, {3, 4}, {5}};
for (auto x : nested | std::views::join) {
    std::cout << x << ' ';  // 1 2 3 4 5
}

// split
for (auto word : std::string("hello world") | std::views::split(' ')) {
    // word is a subrange
}

// lazy split (C++23)
for (auto word : std::views::lazy_split(std::string("a,b,c"), ',')) { ... }

// common — make begin/end same type
auto c = v | std::views::common;

// counted — view of n elements from iterator
auto cv = std::views::counted(v.begin(), 3);

// elements — get Nth element of tuple-like
std::vector<std::pair<int, std::string>> pv = {{1, "a"}, {2, "b"}};
for (auto x : pv | std::views::elements<0>) { std::cout << x; }  // 1 2

// enumerate (C++23)
for (auto [idx, val] : v | std::views::enumerate) {
    std::cout << idx << ":" << val << ' ';
}

// as_const / as_rvalue (C++23)
for (auto& x : v | std::views::as_const) { /* x is const */ }

// to — convert view to container (C++23)
auto vec = std::views::iota(1, 10) 
    | std::views::filter([](int x) { return x % 2 == 0; })
    | std::ranges::to<std::vector>();  // {2, 4, 6, 8}

auto set = v | std::ranges::to<std::set>();
auto map = std::views::zip(keys, values) | std::ranges::to<std::map>();
```

### Range Concepts and Custom Ranges

```cpp
// Range concepts
static_assert(std::ranges::range<std::vector<int>>);
static_assert(std::ranges::sized_range<std::vector<int>>);
static_assert(std::ranges::input_range<std::vector<int>>);
static_assert(std::ranges::forward_range<std::vector<int>>);
static_assert(std::ranges::bidirectional_range<std::vector<int>>);
static_assert(std::ranges::random_access_range<std::vector<int>>);
static_assert(std::ranges::contiguous_range<std::vector<int>>);
static_assert(std::ranges::common_range<std::vector<int>>);
static_assert(std::ranges::viewable_range<std::vector<int>&>);

// Custom view
struct EvenView : std::ranges::view_interface<EvenView> {
    std::vector<int>* source;
    
    auto begin() const { 
        return std::ranges::find_if(*source, [](int x) { return x % 2 == 0; });
    }
    auto end() const { return source->end(); }
};

// Sentinel-based range (begin and end can be different types)
struct InfiniteRange {
    int* begin() { return &data; }
    std::unreachable_sentinel_t end() { return {}; }
};
```

### Execution Policies (C++17, parallel algorithms)

```cpp
#include <execution>

// Sequential (default)
std::sort(std::execution::seq, v.begin(), v.end());

// Parallel
std::sort(std::execution::par, v.begin(), v.end());

// Parallel + vectorized
std::sort(std::execution::par_unseq, v.begin(), v.end());

// Unsequenced (C++20)
std::sort(std::execution::unseq, v.begin(), v.end());

// Parallel algorithms
std::for_each(std::execution::par, v.begin(), v.end(), func);
std::transform(std::execution::par, v.begin(), v.end(), dst.begin(), op);
std::reduce(std::execution::par, v.begin(), v.end(), 0);
std::fill(std::execution::par, v.begin(), v.end(), 42);
```
