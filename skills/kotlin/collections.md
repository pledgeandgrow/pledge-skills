# Collections

**Docs:** https://kotlinlang.org/docs/collections-overview.html | https://kotlinlang.org/docs/collection-elements.html | https://kotlinlang.org/docs/collection-filtering.html | https://kotlinlang.org/docs/collection-transformations.html | https://kotlinlang.org/docs/sequences.html

## Collection Types

| Type | Read-only | Mutable | Description |
|------|-----------|---------|-------------|
| List | `List<T>` | `MutableList<T>` | Ordered, allows duplicates |
| Set | `Set<T>` | `MutableSet<T>` | Unordered, no duplicates |
| Map | `Map<K,V>` | `MutableMap<K,V>` | Key-value pairs, unique keys |
| ArrayDeque | `ArrayDeque<T>` | `ArrayDeque<T>` | Double-ended queue |

## Creating Collections

```kotlin
// Read-only lists
val list = listOf(1, 2, 3)
val empty = emptyList<Int>()
val mixed = listOf<Any>(1, "two", 3.0)

// Mutable lists
val mutable = mutableListOf(1, 2, 3)
val arrayList = arrayListOf(1, 2, 3)

// Sets
val set = setOf(1, 2, 3)
val mutableSet = mutableSetOf(1, 2, 3)
val hashSet = hashSetOf(1, 2, 3)
val linkedSet = linkedSetOf(1, 2, 3)  // maintains insertion order

// Maps
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
val mutableMap = mutableMapOf("a" to 1, "b" to 2)
val hashMap = hashMapOf("a" to 1, "b" to 2)

// Build patterns
val built = buildList {
    add(1)
    addAll(listOf(2, 3))
    add(4)
}  // [1, 2, 3, 4]

val builtMap = buildMap {
    put("a", 1)
    put("b", 2)
}
```

## List Operations

```kotlin
val list = listOf("apple", "banana", "cherry", "date")

// Access
list[0]              // "apple"
list.first()         // "apple"
list.last()          // "date"
list.firstOrNull()   // "apple" or null if empty
list.lastOrNull()    // "date" or null if empty
list.getOrNull(10)   // null (out of bounds)

// Index
list.indexOf("banana")  // 1
list.lastIndexOf("date") // 3

// Sublist
list.subList(1, 3)   // ["banana", "cherry"]

// Binary search (sorted list)
val sorted = listOf(1, 3, 5, 7, 9)
sorted.binarySearch(5)  // 2
sorted.binarySearch(4)  // -3 (insertion point: -(insertion point) - 1)
```

### Mutable List Operations

```kotlin
val mutable = mutableListOf(1, 2, 3)

mutable.add(4)          // [1, 2, 3, 4]
mutable.add(0, 0)       // [0, 1, 2, 3, 4]
mutable.addAll(listOf(5, 6))  // [0, 1, 2, 3, 4, 5, 6]

mutable.removeAt(0)     // [1, 2, 3, 4, 5, 6]
mutable.remove(3)       // [1, 2, 4, 5, 6]
mutable[0] = 10         // [10, 2, 4, 5, 6]

mutable.clear()         // []
mutable.isEmpty()       // true
```

## Set Operations

```kotlin
val a = setOf(1, 2, 3, 4)
val b = setOf(3, 4, 5, 6)

// Union
a union b              // {1, 2, 3, 4, 5, 6}
a + b                  // {1, 2, 3, 4, 5, 6}

// Intersection
a intersect b          // {3, 4}
a and b                // {3, 4} (infix)

// Difference
a subtract b           // {1, 2}
a - b                  // {1, 2}

// Symmetric difference (Kotlin 1.4+)
a xor b                // {1, 2, 5, 6}

// Mutable set
val mutable = mutableSetOf(1, 2, 3)
mutable.add(4)         // {1, 2, 3, 4}
mutable.remove(2)      // {1, 3, 4}
```

## Map Operations

```kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)

// Access
map["a"]               // 1
map.getValue("a")      // 1 (throws if missing)
map.getOrDefault("z", 0)  // 0
map.getOrElse("z") { 0 } // 0
map.getOrNull("z")     // null (Kotlin 2.4.0+)

// Keys and values
map.keys               // ["a", "b", "c"]
map.values             // [1, 2, 3]

// Check
"a" in map             // true
map.containsKey("a")  // true
map.containsValue(2)  // true

// Iterate
for ((key, value) in map) {
    println("$key = $value")
}

// Transform
map.mapKeys { (k, _) -> k.uppercase() }  // {"A" to 1, "B" to 2, "C" to 3}
map.mapValues { (_, v) -> v * 10 }       // {"a" to 10, "b" to 20, "c" to 30}
```

### Mutable Map Operations

```kotlin
val mutable = mutableMapOf("a" to 1, "b" to 2)

mutable["c"] = 3        // add
mutable.put("d", 4)     // add
mutable.remove("a")     // remove
mutable["b"] = 20       // update
mutable.putIfAbsent("e", 5)  // add only if absent
mutable.compute("a") { _, v -> (v ?: 0) + 1 }
```

## Filtering

```kotlin
val list = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

// Filter by predicate
list.filter { it > 5 }              // [6, 7, 8, 9, 10]
list.filterNot { it > 5 }           // [1, 2, 3, 4, 5]

// Filter by type
val mixed: List<Any> = listOf(1, "a", 2, "b", 3.0)
mixed.filterIsInstance<String>()    // ["a", "b"]
mixed.filterIsInstance<Int>()       // [1, 2]

// Filter indexed
list.filterIndexed { index, value -> index % 2 == 0 }  // [1, 3, 5, 7, 9]

// Filter not null
val nullable: List<Int?> = listOf(1, null, 3, null, 5)
nullable.filterNotNull()            // [1, 3, 5]

// Partition — splits into matching and non-matching
val (even, odd) = list.partition { it % 2 == 0 }
// even = [2, 4, 6, 8, 10], odd = [1, 3, 5, 7, 9]

// Take / drop
list.take(3)            // [1, 2, 3] — first 3
list.takeLast(3)        // [8, 9, 10] — last 3
list.drop(3)            // [4, 5, 6, 7, 8, 9, 10] — skip first 3
list.dropLast(3)        // [1, 2, 3, 4, 5, 6, 7] — skip last 3

// Take/drop while
list.takeWhile { it < 4 }  // [1, 2, 3]
list.dropWhile { it < 4 }  // [4, 5, 6, 7, 8, 9, 10]

// Chunked
list.chunked(3)         // [[1, 2, 3], [4, 5, 6], [7, 8, 9, 10]]

// Windowed (sliding window)
list.windowed(3)        // [[1,2,3], [2,3,4], [3,4,5], ...]
list.windowed(3, step = 3)  // [[1,2,3], [4,5,6], [7,8,9]]
```

## Transformations

```kotlin
val list = listOf(1, 2, 3, 4, 5)

// Map — transform each element
list.map { it * 2 }              // [2, 4, 6, 8, 10]
list.mapIndexed { i, v -> i * v } // [0, 2, 6, 12, 20]

// FlatMap — transform and flatten
list.flatMap { listOf(it, it * 10) }  // [1, 10, 2, 20, 3, 30, 4, 40, 5, 50]

// Flatten — flatten nested collections
val nested = listOf(listOf(1, 2), listOf(3, 4), listOf(5))
nested.flatten()                 // [1, 2, 3, 4, 5]

// Associate — convert to map
list.associateBy { it }          // {1=1, 2=2, 3=3, 4=4, 5=5}
list.associateWith { it * it }   // {1=1, 2=4, 3=9, 4=16, 5=25}
list.associate { it to it * 2 }  // {1=2, 2=4, 3=6, 4=8, 5=10}

// Group by
val words = listOf("one", "two", "three", "four", "five")
words.groupBy { it.length }      // {3=["one", "two"], 5=["three"], 4=["four", "five"]}
words.groupingBy { it.first() }.eachCount()  // {o=1, t=2, f=2}

// Zip — combine two collections pairwise
val names = listOf("Alice", "Bob", "Charlie")
val ages = listOf(30, 25, 35)
names zip ages                   // [("Alice", 30), ("Bob", 25), ("Charlie", 35)]
names.zip(ages) { name, age -> "$name is $age" }  // ["Alice is 30", "Bob is 25", "Charlie is 35"]

// Unzip — split list of pairs
val pairs = listOf("a" to 1, "b" to 2, "c" to 3)
val (keys, values) = pairs.unzip()  // keys=["a","b","c"], values=[1,2,3]
```

## Sorting

```kotlin
val list = listOf(3, 1, 4, 1, 5, 9, 2, 6)

// Sorted (returns new list)
list.sorted()                    // [1, 1, 2, 3, 4, 5, 6, 9]
list.sortedDescending()          // [9, 6, 5, 4, 3, 2, 1, 1]

// Sort by property
data class Person(val name: String, val age: Int)
val people = listOf(Person("Bob", 25), Person("Alice", 30), Person("Charlie", 20))

people.sortedBy { it.age }       // [Charlie(20), Bob(25), Alice(30)]
people.sortedByDescending { it.age }  // [Alice(30), Bob(25), Charlie(20)]
people.sortedBy { it.name }      // [Alice, Bob, Charlie]

// Sort with comparator
people.sortedWith(compareBy({ it.age }, { it.name }))  // by age, then name

// Mutable sort (in-place)
val mutable = mutableListOf(3, 1, 4, 1, 5)
mutable.sort()                   // [1, 1, 3, 4, 5]
mutable.sortDescending()         // [5, 4, 3, 1, 1]

// Reverse
list.reversed()                  // [6, 2, 9, 5, 1, 4, 1, 3]
```

## Aggregation

```kotlin
val list = listOf(1, 2, 3, 4, 5)

// Basic
list.sum()                       // 15
list.sumOf { it * 2 }            // 30
list.average()                   // 3.0
list.count()                     // 5
list.count { it > 2 }            // 3
list.minOrNull()                 // 1
list.maxOrNull()                 // 5
list.minByOrNull { it }          // 1
list.maxByOrNull { -it }         // 1

// Reduce — accumulate (no initial value)
list.reduce { acc, item -> acc + item }  // 15
list.reduceRight { item, acc -> item + acc }  // 15 (right to left)

// Fold — accumulate with initial value
list.fold(0) { acc, item -> acc + item }  // 15
list.fold(1) { acc, item -> acc * item }  // 120
list.foldRight(0) { item, acc -> item + acc }  // 15

// Running fold (returns all intermediate results)
list.runningFold(0) { acc, item -> acc + item }  // [0, 1, 3, 6, 10, 15]
list.runningReduce { acc, item -> acc + item }   // [1, 3, 6, 10, 15]
```

## Searching

```kotlin
val list = listOf(1, 2, 3, 4, 5)

// Find
list.find { it > 3 }             // 4 (first match)
list.findLast { it > 3 }         // 5 (last match)
list.firstOrNull { it > 3 }      // 4
list.lastOrNull { it > 3 }       // 5

// Any / all / none
list.any { it > 3 }              // true
list.any()                       // true (not empty)
list.all { it > 0 }              // true
list.none { it < 0 }             // true
list.none()                      // false (not empty)

// Contains
3 in list                        // true
list.contains(3)                 // true
list.containsAll(listOf(1, 2))   // true

// Binary search (sorted list)
val sorted = listOf(1, 3, 5, 7, 9)
sorted.binarySearch(5)           // 2
sorted.binarySearch(4)           // -3
sorted.binarySearchBy(5) { it }  // 2
```

## Grouping

```kotlin
val words = listOf("one", "two", "three", "four", "five", "six")

// Group by
val byLength = words.groupBy { it.length }
// {3=["one", "two", "six"], 5=["three"], 4=["four", "five"]}

// Group by + transform
val byLengthUpper = words.groupBy({ it.length }, { it.uppercase() })
// {3=["ONE", "TWO", "SIX"], 5=["THREE"], 4=["FOUR", "FIVE"]}

// GroupingBy — for lazy grouping operations
words.groupingBy { it.first() }
    .eachCount()                 // {o=1, t=2, f=2, s=1}
    .fold("") { acc, word -> acc + word }  // {o=one, t=twthree, f=fourfive, s=six}
```

## Sequences

```kotlin
// Lazy evaluation — process elements one at a time through the chain
val seq = sequenceOf(1, 2, 3, 4, 5)

// From collection
val fromList = listOf(1, 2, 3).asSequence()

// Generate
val generated = generateSequence(1) { it + 1 }  // 1, 2, 3, ...
val finite = generateSequence(1) { if (it < 10) it + 1 else null }
finite.take(5).toList()  // [1, 2, 3, 4, 5]

// Yield
val seq2 = sequence {
    yield(1)
    yieldAll(listOf(2, 3, 4))
    yield(5)
}
seq2.toList()  // [1, 2, 3, 4, 5]

// Lazy chain — only processes what's needed
val result = (1..1_000_000).asSequence()
    .map { it * it }
    .filter { it > 10 }
    .take(3)
    .toList()
// [16, 25, 36] — only first few elements processed

// Eager (List) vs Lazy (Sequence)
// List: processes all elements at each step
// Sequence: processes element-by-element through entire chain
```

### When to Use Sequences

- Large or infinite collections
- Multi-step pipelines where early termination helps
- When you want to avoid intermediate collections

## ArrayDeque

```kotlin
// Double-ended queue — efficient add/remove from both ends
val deque = ArrayDeque(listOf(1, 2, 3))

deque.addFirst(0)     // [0, 1, 2, 3]
deque.addLast(4)      // [0, 1, 2, 3, 4]
deque.removeFirst()   // 0, deque = [1, 2, 3, 4]
deque.removeLast()    // 4, deque = [1, 2, 3]
deque.first()         // 1
deque.last()          // 3
```

## Collection Conversion

```kotlin
// To list
setOf(1, 2, 3).toList()
arrayOf(1, 2, 3).toList()
sequenceOf(1, 2, 3).toList()

// To set (removes duplicates)
listOf(1, 1, 2, 3, 3).toSet()  // {1, 2, 3}

// To map
listOf("a" to 1, "b" to 2).toMap()

// To mutable
listOf(1, 2, 3).toMutableList()
setOf(1, 2, 3).toMutableSet()
mapOf("a" to 1).toMutableMap()

// To array
listOf(1, 2, 3).toTypedArray()
listOf(1, 2, 3).toIntArray()
```

## String Representation

```kotlin
val list = listOf("a", "b", "c")

// joinToString — convert collection to string
list.joinToString()              // "a, b, c"
list.joinToString("-")           // "a-b-c"
list.joinToString("")            // "abc"
list.joinToString(", ", "[", "]") // "[a, b, c]"

// With transform
list.joinToString { it.uppercase() }  // "A, B, C"

// With limit (truncates long collections)
(1..100).joinToString(limit = 5, truncated = "...")  // "1, 2, 3, 4, 5, ..."

// joinTo — append to existing Appendable (StringBuilder)
val sb = StringBuilder("Items: ")
list.joinTo(sb, ", ")  // sb = "Items: a, b, c"
```

## Read-Only vs Mutable

```kotlin
// Read-only — cannot modify contents
val readOnly: List<Int> = listOf(1, 2, 3)
// readOnly.add(4)  // ERROR: no add method

// Mutable — can modify
val mutable: MutableList<Int> = mutableListOf(1, 2, 3)
mutable.add(4)  // OK

// Covariance — read-only collections are covariant
val shapes: List<Shape> = listOf(Circle(), Square())  // OK
// val mutableShapes: MutableList<Shape> = mutableListOf<Circle>()  // ERROR

// Casting — read-only to mutable is unsafe
val list: List<Int> = mutableListOf(1, 2, 3)
// (list as MutableList).add(4)  // works at runtime but unsafe
```
