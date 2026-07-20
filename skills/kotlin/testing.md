# Testing

**Docs:** https://kotlinlang.org/docs/jvm-test-using-junit.html | https://kotlinlang.org/docs/jvm-test-using-kotest.html | https://kotlinlang.org/docs/coroutines-test.html

## Setup

```kotlin
// build.gradle.kts
dependencies {
    testImplementation(kotlin("test"))
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.2")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.10.1")
}

tasks.test {
    useJUnitPlatform()
}
```

## JUnit 5 Basics

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import kotlin.test.assertFalse
import kotlin.test.assertNull
import kotlin.test.assertNotNull
import kotlin.test.assertFailsWith

class CalculatorTest {

    @Test
    fun `addition works`() {
        val calc = Calculator()
        assertEquals(5, calc.add(2, 3))
    }

    @Test
    fun `division by zero throws`() {
        val calc = Calculator()
        assertFailsWith<IllegalArgumentException> {
            calc.divide(10, 0)
        }
    }
}
```

## Assertions

```kotlin
import kotlin.test.*

@Test
fun testAssertions() {
    // Equality
    assertEquals(4, 2 + 2)
    assertEquals("hello", "hello", "Strings should match")
    assertNotEquals(5, 2 + 2)

    // Boolean
    assertTrue(5 > 3)
    assertTrue { list.isNotEmpty() }  // lazy
    assertFalse(3 > 5)

    // Null
    assertNull(null)
    assertNotNull("hello")

    // Exceptions
    assertFailsWith<IllegalArgumentException> {
        require(false) { "fail" }
    }

    // Array/content
    assertContentEquals(intArrayOf(1, 2, 3), intArrayOf(1, 2, 3))

    // Same instance
    assertSame(obj1, obj2)  // referential equality
    assertNotSame(obj1, obj3)
}
```

## JUnit 5 Assertions

```kotlin
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

@Test
fun testJunit5() {
    assertEquals(4, 2 + 2)
    assertEquals(4.0, 2.0 + 2.0, 0.001)  // delta for floating point
    assertTrue(list.isNotEmpty())
    assertNull(null) { "Should be null" }  // with message

    // Assert all
    assertAll(
        { assertEquals(1, result.a) },
        { assertEquals(2, result.b) },
        { assertEquals(3, result.c) }
    )

    // Assert throws
    val exception = assertThrows<IllegalArgumentException> {
        process(-1)
    }
    assertEquals("Invalid input", exception.message)

    // Timeout
    assertTimeout(Duration.ofMillis(100)) {
        fastOperation()
    }
}
```

## Parameterized Tests

```kotlin
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.ValueSource
import org.junit.jupiter.params.provider.CsvSource
import org.junit.jupiter.params.provider.MethodSource

class ParameterizedTests {

    @ParameterizedTest
    @ValueSource(ints = [1, 2, 3, 4, 5])
    fun `positive numbers are valid`(value: Int) {
        assertTrue(value > 0)
    }

    @ParameterizedTest
    @ValueSource(strings = ["", "  ", "\t"])
    fun `blank strings detected`(value: String) {
        assertTrue(value.isBlank())
    }

    @ParameterizedTest
    @CsvSource(
        "1, 2, 3",
        "10, 20, 30",
        "-1, 1, 0"
    )
    fun `addition works`(a: Int, b: Int, expected: Int) {
        assertEquals(expected, a + b)
    }

    @ParameterizedTest
    @MethodSource("provideTestData")
    fun `with method source`(data: TestData) {
        assertEquals(data.expected, process(data.input))
    }

    companion object {
        @JvmStatic
        fun provideTestData() = listOf(
            TestData("input1", "expected1"),
            TestData("input2", "expected2")
        )
    }

    data class TestData(val input: String, val expected: String)
}
```

## Lifecycle Hooks

```kotlin
import org.junit.jupiter.api.*

class LifecycleTest {

    @BeforeAll
    companion object {
        @JvmStatic
        fun setUpAll() {
            println("Before all tests — once")
        }
    }

    @BeforeEach
    fun setUp() {
        println("Before each test")
    }

    @Test
    fun test1() { println("Test 1") }

    @Test
    fun test2() { println("Test 2") }

    @AfterEach
    fun tearDown() {
        println("After each test")
    }

    @AfterAll
    companion object {
        @JvmStatic
        fun tearDownAll() {
            println("After all tests — once")
        }
    }
}
```

## Coroutine Testing

```kotlin
import kotlinx.coroutines.test.*
import kotlinx.coroutines.*

// runTest — no real delays, virtual time
@Test
fun testSuspendFunction() = runTest {
    val result = fetchData()
    assertEquals("data", result)
}

@Test
fun testWithDelay() = runTest {
    // delay uses virtual time — completes instantly
    delay(1000)
    assertTrue(true)
}

// Test dispatchers
@Test
fun testDispatcher() = runTest {
    val dispatcher = StandardTestDispatcher(testScheduler)
    withContext(dispatcher) {
        // runs on test dispatcher
    }
}

// Advance time manually
@Test
fun testManualTimeAdvance() = runTest {
    val deferred = async { delay(1000); "done" }
    advanceTimeBy(1000)  // advance virtual time
    assertEquals("done", deferred.await())
}

// runCurrent — execute pending tasks
@Test
fun testRunCurrent() = runTest {
    var executed = false
    launch { executed = true }
    runCurrent()  // execute launched coroutine
    assertTrue(executed)
}
```

## Testing Flows

```kotlin
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.test.*

@Test
fun testFlow() = runTest {
    val flow = flowOf(1, 2, 3)

    val results = flow.toList()
    assertEquals(listOf(1, 2, 3), results)
}

@Test
fun testFlowEmissions() = runTest {
    val flow = flow {
        emit(1)
        emit(2)
        emit(3)
    }

    flow.test {
        assertEquals(1, awaitItem())
        assertEquals(2, awaitItem())
        assertEquals(3, awaitItem())
        awaitComplete()
    }
}

// With Turbine library
// dependencies { testImplementation("app.cash.turbine:turbine:1.2.0") }
@Test
fun testStateFlow() = runTest {
    val state = MutableStateFlow(0)

    state.test {
        assertEquals(0, awaitItem())

        state.value = 1
        assertEquals(1, awaitItem())

        state.value = 2
        assertEquals(2, awaitItem())

        cancelAndIgnoreRemainingEvents()
    }
}
```

## Mocking

```kotlin
// MockK — Kotlin mocking library
// dependencies { testImplementation("io.mockk:mockk:1.13.13") }

import io.mockk.*

interface UserService {
    fun getUser(id: String): User
    suspend fun fetchUser(id: String): User
}

class UserController(val service: UserService) {
    fun displayName(id: String): String {
        return service.getUser(id).name
    }
}

@Test
fun testWithMock() {
    val mockService = mockk<UserService>()
    val controller = UserController(mockService)

    every { mockService.getUser("1") } returns User("1", "Alice")

    val name = controller.displayName("1")
    assertEquals("Alice", name)

    verify { mockService.getUser("1") }
    verify(exactly = 1) { mockService.getUser(any()) }
}

@Test
fun testWithCoMock() = runTest {
    val mockService = mockk<UserService>()

    coEvery { mockService.fetchUser("1") } returns User("1", "Alice")

    val user = mockService.fetchUser("1")
    assertEquals("Alice", user.name)

    coVerify { mockService.fetchUser("1") }
}
```

## Test Doubles Without Mocking

```kotlin
// Fake implementation
class FakeUserService : UserService {
    private val users = mutableMapOf<String, User>()

    fun addUser(user: User) { users[user.id] = user }

    override fun getUser(id: String): User {
        return users[id] ?: throw NoSuchElementException(id)
    }

    override suspend fun fetchUser(id: String): User = getUser(id)
}

@Test
fun testWithFake() {
    val fake = FakeUserService()
    fake.addUser(User("1", "Alice"))
    val controller = UserController(fake)

    assertEquals("Alice", controller.displayName("1"))
}
```

## Kotest (Alternative)

```kotlin
// dependencies {
//     testImplementation("io.kotest:kotest-runner-junit5:5.9.1")
//     testImplementation("io.kotest:kotest-assertions-core:5.9.1")
// }

import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.shouldBe

class MyTest : StringSpec({
    "addition should work" {
        2 + 2 shouldBe 4
    }

    "strings should match" {
        "hello" shouldBe "hello"
    }
})
```

## Test Tags and Filtering

```kotlin
import org.junit.jupiter.api.Tag
import org.junit.jupiter.api.Tags

@Tags(
    Tag("unit"),
    Tag("fast")
)
class FastTests {

    @Test
    @Tag("smoke")
    fun `smoke test`() { /* ... */ }
}

// build.gradle.kts
tasks.test {
    useJUnitPlatform {
        includeTags("fast", "smoke")
        excludeTags("slow")
    }
}
```

## Nested Tests

```kotlin
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test

class UserTest {

    @Nested
    inner class `when user is created` {
        @Test
        fun `should have default values`() { /* ... */ }

        @Test
        fun `should not be active`() { /* ... */ }
    }

    @Nested
    inner class `when user is activated` {
        @Test
        fun `should be active`() { /* ... */ }
    }
}
```

## Best Practices

- Name tests with backticks for readability: `` `should return user when id exists`()``
- Use `@DisplayName` for complex test names
- Prefer fakes over mocks for simple dependencies
- Test suspend functions with `runTest` (virtual time)
- Use parameterized tests for multiple input combinations
- One assertion concept per test method
- Follow AAA pattern: Arrange, Act, Assert
