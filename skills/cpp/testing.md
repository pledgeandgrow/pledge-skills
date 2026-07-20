# Testing and Benchmarking

## Google Test (gtest)

```cpp
#include <gtest/gtest.h>

// Basic test
TEST(MathTest, Addition) {
    EXPECT_EQ(1 + 1, 2);
    ASSERT_EQ(2 * 3, 6);
}

// Test fixture
class VectorTest : public ::testing::Test {
protected:
    void SetUp() override {
        v = {1, 2, 3, 4, 5};
    }
    std::vector<int> v;
};

TEST_F(VectorTest, Size) {
    EXPECT_EQ(v.size(), 5);
}

TEST_F(VectorTest, PushBack) {
    v.push_back(6);
    EXPECT_EQ(v.size(), 6);
    EXPECT_EQ(v.back(), 6);
}

// Assertions
// EXPECT_* — non-fatal (continues test)
// ASSERT_* — fatal (stops test)

// Equality
EXPECT_EQ(actual, expected);   // ==
EXPECT_NE(a, b);               // !=
EXPECT_LT(a, b);               // <
EXPECT_LE(a, b);               // <=
EXPECT_GT(a, b);               // >
EXPECT_GE(a, b);               // >=

// Boolean
EXPECT_TRUE(x);
EXPECT_FALSE(x);

// Floating point
EXPECT_FLOAT_EQ(1.0f, 1.0f);   // float comparison (tolerance)
EXPECT_DOUBLE_EQ(1.0, 1.0);    // double comparison
EXPECT_NEAR(3.14, 3.141, 0.01); // within tolerance

// String
EXPECT_STREQ("hello", "hello");   // C-string ==
EXPECT_STRNE("hello", "world");   // C-string !=
EXPECT_STRCASEEQ("HELLO", "hello"); // case-insensitive

// Exceptions
EXPECT_THROW(func(), std::runtime_error);  // must throw
EXPECT_ANY_THROW(func());                   // must throw something
EXPECT_NO_THROW(func());                    // must not throw

// Custom failure message
EXPECT_EQ(x, 42) << "x should be 42 but was " << x;

// Parameterized tests
class ParamTest : public ::testing::TestWithParam<int> {};
TEST_P(ParamTest, IsPositive) {
    int n = GetParam();
    EXPECT_GT(n, 0);
}
INSTANTIATE_TEST_SUITE_P(Values, ParamTest, ::testing::Values(1, 2, 3, 4, 5));

// Typed tests
template<typename T>
class TypedTest : public ::testing::Test {};
using Types = ::testing::Types<int, double, float>;
TYPED_TEST_SUITE(TypedTest, Types);

TYPED_TEST(TypedTest, DefaultConstruct) {
    TypeParam value{};
    EXPECT_EQ(value, TypeParam{});
}

// Death test (tests that crash/abort)
EXPECT_DEATH({ abort(); }, ".*");

// Main function
int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
```

## Catch2

```cpp
// v3: #include <catch2/catch_test_macros.hpp>
// v2: #define CATCH_CONFIG_MAIN
//      #include <catch.hpp>

#include <catch2/catch_test_macros.hpp>
#include <catch2/catch_approx.hpp>

// Test cases
TEST_CASE("Vector operations", "[vector]") {
    std::vector<int> v{1, 2, 3};
    
    SECTION("size is correct") {
        REQUIRE(v.size() == 3);
    }
    
    SECTION("push_back increases size") {
        v.push_back(4);
        REQUIRE(v.size() == 4);
        REQUIRE(v.back() == 4);
    }
    
    SECTION("clear empties vector") {
        v.clear();
        REQUIRE(v.empty());
    }
}

// Assertions
REQUIRE(x == 42);    // fatal (stops test)
CHECK(x == 42);      // non-fatal (continues)
REQUIRE_FALSE(x);    // !x
CHECK_FALSE(x);

// Floating point
REQUIRE(3.14159 == Catch::Approx(3.14).epsilon(0.01));

// Exceptions
REQUIRE_THROWS_AS(func(), std::runtime_error);
REQUIRE_THROWS(func());
REQUIRE_NOTHROW(func());
REQUIRE_THROWS_WITH(func(), "error message");

// Matchers
REQUIRE_THAT("hello world", Catch::ContainsSubstring("hello"));
REQUIRE_THAT(42, Catch::Range(1, 100));

// BDD-style
SCENARIO("Vector is used as stack", "[vector]") {
    GIVEN("A vector with some items") {
        std::vector<int> v{1, 2, 3};
        
        WHEN("size is queried") {
            auto size = v.size();
            THEN("it returns the number of items") {
                REQUIRE(size == 3);
            }
        }
        
        WHEN("an item is added") {
            v.push_back(4);
            THEN("size increases") {
                REQUIRE(v.size() == 4);
            }
        }
    }
}

// Test case with tags
TEST_CASE("String tests", "[string][unit]") { ... }

// Run specific tags: ./test "[string]" "[unit]"
// Exclude: ./test "[string]" "~[slow]"

// Generators (data-driven)
TEST_CASE("Fibonacci", "[fib]") {
    auto n = GENERATE(0, 1, 2, 3, 4, 5, 10);
    REQUIRE(fib(n) >= 0);
}

// Main (v3)
int main(int argc, char* argv[]) {
    return Catch::Session().run(argc, argv);
}
```

## doctest

```cpp
#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include <doctest.h>

TEST_CASE("Basic math") {
    CHECK(1 + 1 == 2);
    CHECK_EQ(2 * 3, 6);
    CHECK_NE(1, 2);
    CHECK_LT(1, 2);
    CHECK_LE(2, 2);
}

TEST_CASE("Vector") {
    std::vector<int> v{1, 2, 3};
    SUBCASE("size") { CHECK(v.size() == 3); }
    SUBCASE("push") {
        v.push_back(4);
        CHECK(v.size() == 4);
    }
}

// Exceptions
CHECK_THROWS_AS(func(), std::runtime_error);
CHECK_NOTHROW(safeFunc());

// Approx
CHECK(3.14159 == doctest::Approx(3.14).epsilon(0.01));
```

## Google Benchmark

```cpp
#include <benchmark/benchmark.h>

// Basic benchmark
static void BM_VectorPushBack(benchmark::State& state) {
    for (auto _ : state) {
        std::vector<int> v;
        for (int i = 0; i < state.range(0); ++i) {
            v.push_back(i);
        }
    }
    state.SetItemsProcessed(state.range(0));
}
BENCHMARK(BM_VectorPushBack)->Range(8, 8192);

// Benchmark with custom arguments
static void BM_StringConcat(benchmark::State& state) {
    std::string a(state.range(0), 'a');
    std::string b(state.range(0), 'b');
    for (auto _ : state) {
        std::string c = a + b;
        benchmark::DoNotOptimize(c);
    }
}
BENCHMARK(BM_StringConcat)->Arg(10)->Arg(100)->Arg(1000);

// Template benchmark
template<typename Container>
static void BM_ContainerInsert(benchmark::State& state) {
    for (auto _ : state) {
        Container c;
        for (int i = 0; i < state.range(0); ++i) {
            c.insert(c.end(), i);
        }
    }
}
BENCHMARK_TEMPLATE(BM_ContainerInsert, std::vector<int>)->Range(8, 8192);
BENCHMARK_TEMPLATE(BM_ContainerInsert, std::list<int>)->Range(8, 8192);

// Use real-time (not CPU time)
BENCHMARK(BM_Something)->UseRealTime();

// Threaded benchmark
static void BM_Threaded(benchmark::State& state) {
    for (auto _ : state) {
        // parallel work
    }
}
BENCHMARK(BM_Threaded)->ThreadRange(1, 8);

// Custom counters
static void BM_CustomCounter(benchmark::State& state) {
    size_t bytes = 0;
    for (auto _ : state) {
        bytes += process();
    }
    state.SetBytesProcessed(bytes);
    state.SetLabel("MB/s: " + std::to_string(bytes / 1e6));
}
BENCHMARK(BM_CustomCounter);

// Main
BENCHMARK_MAIN();
// or:
// int main(int argc, char** argv) {
//     benchmark::Initialize(&argc, argv);
//     benchmark::RunSpecifiedBenchmarks();
// }
```

## CMake Integration

```cmake
# Google Test
include(FetchContent)
FetchContent_Declare(
    googletest
    GIT_REPOSITORY https://github.com/google/googletest.git
    GIT_TAG v1.14.0
)
FetchContent_MakeAvailable(googletest)

add_executable(tests test_main.cpp)
target_link_libraries(tests GTest::gtest_main)

include(GoogleTest)
gtest_discover_tests(tests)

# Catch2
find_package(Catch2 3 REQUIRED)
add_executable(tests test_main.cpp)
target_link_libraries(tests Catch2::Catch2WithMain)

# doctest
find_package(doctest REQUIRED)
add_executable(tests test_main.cpp)
target_link_libraries(tests doctest::doctest)

# Google Benchmark
find_package(benchmark REQUIRED)
add_executable(bench bench_main.cpp)
target_link_libraries(bench benchmark::benchmark)

# Enable testing
enable_testing()
add_test(NAME tests COMMAND tests)
```

## Test Patterns

```cpp
// Mock with gmock
#include <gmock/gmock.h>

class Database {
public:
    virtual ~Database() = default;
    virtual bool save(const std::string& key, const std::string& value) = 0;
    virtual std::string load(const std::string& key) = 0;
};

class MockDatabase : public Database {
public:
    MOCK_METHOD(bool, save, (const std::string&, const std::string&), (override));
    MOCK_METHOD(std::string, load, (const std::string&), (override));
};

TEST(UserServiceTest, SaveUser) {
    MockDatabase db;
    EXPECT_CALL(db, save("user1", "data")).WillOnce(::testing::Return(true));
    
    UserService service(&db);
    EXPECT_TRUE(service.saveUser("user1", "data"));
}

// Fuzzing (libFuzzer)
extern "C" int LLVMFuzzerTestOneInput(const uint8_t* data, size_t size) {
    if (size < 4) return 0;
    int n;
    std::memcpy(&n, data, sizeof(n));
    try {
        process(n);
    } catch (...) {}
    return 0;
}
// Compile: clang++ -fsanitize=fuzzer -o fuzzer fuzzer.cpp

// Property-based testing (rapidcheck example)
#include <rapidcheck.h>

rc::check("reverse of reverse is identity",
    [](const std::vector<int>& v) {
        auto copy = v;
        std::reverse(copy.begin(), copy.end());
        std::reverse(copy.begin(), copy.end());
        RC_ASSERT(copy == v);
    });
```

## Running Tests

```bash
# Google Test
./test_binary                    # run all
./test_binary --gtest_filter="MathTest.*"  # run specific
./test_binary --gtest_repeat=10  # repeat
./test_binary --gtest_shuffle    # random order
./test_binary --gtest_list_tests # list tests

# Catch2
./test_binary                    # run all
./test_binary "[vector]"         # run tagged
./test_binary "[vector]" "~[slow]"  # exclude
./test_binary --list-tests
./test_binary --reporter=xml     # XML output

# doctest
./test_binary --list-tests
./test_binary --filter="*math*"

# Google Benchmark
./bench_binary                   # run all
./bench_binary --benchmark_filter="Vector.*"
./bench_binary --benchmark_min_time=2s
./bench_binary --benchmark_repetitions=10
```
