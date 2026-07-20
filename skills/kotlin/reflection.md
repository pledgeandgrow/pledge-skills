# Reflection

**Docs:** https://kotlinlang.org/docs/reflection.html

## Overview

Kotlin reflection provides runtime access to classes, functions, properties, and constructors. The core API is in `kotlin-reflect`, with JVM-specific features available via `java.lang.reflect` interop.

**Dependency:**
```kotlin
dependencies {
    implementation("org.jetbrains.kotlin:kotlin-reflect:2.4.0")
}
```

## Class References

```kotlin
// Obtain KClass reference
val stringClass: KClass<String> = String::class
val intClass = Int::class

// From an instance
val str = "hello"
val klass: KClass<out String> = str::class

// Simple name and qualified name
val name = String::class.simpleName       // "String"
val qualified = String::class.qualifiedName  // "kotlin.String"

// Check if class is data, sealed, abstract, etc.
val isData = User::class.isData
val isSealed = Result::class.isSealed
val isAbstract = Shape::class.isAbstract
val isCompanion = Foo.Companion::class.isCompanion
```

## Bound Class References

```kotlin
val str = "Hello"
val bound: KClass<out String> = str::class  // bound to the instance

// Useful for type checking at runtime
fun getTypeName(obj: Any): String = obj::class.simpleName ?: "Unknown"
```

## Callable References

### Function References

```kotlin
fun isEven(x: Int): Boolean = x % 2 == 0

// Reference to a function
val predicate: KFunction2<Int, Boolean> = ::isEven

// As a function type
val func: (Int) -> Boolean = ::isEven
func(4)  // true

// Reference to member function
class StringProcessor {
    fun process(s: String): Int = s.length
}
val processor = StringProcessor()
val memberRef: (String) -> Int = processor::process
memberRef("hello")  // 5

// Reference to top-level extension function
fun String.shout(): String = uppercase()
val shoutRef: KFunction1<String, String> = String::shout
```

### Property References

```kotlin
class Person(val name: String, var age: Int)

// Reference to property
val nameProp: KProperty1<Person, String> = Person::name
val ageProp: KMutableProperty1<Person, Int> = Person::age

// Get property value
val person = Person("Alice", 30)
nameProp.get(person)  // "Alice"
ageProp.get(person)   // 30

// Set mutable property
ageProp.set(person, 31)

// Bound property reference
val boundName: KProperty0<String> = person::name
boundName.get()  // "Alice"

val boundAge: KMutableProperty0<Int> = person::age
boundAge.set(32)
boundAge.get()  // 32
```

### Constructor References

```kotlin
class Person(val name: String, val age: Int)

// Reference to constructor
val ctor: KFunction2<String, Int, Person> = ::Person

// Create instance via reference
val person = ctor("Alice", 30)  // Person("Alice", 30)

// Bound constructor reference (on companion object)
class Factory {
    companion object {
        fun create(name: String) = Person(name, 0)
    }
}
val factoryRef = Factory.Companion::create
```

## Inspecting Classes

```kotlin
import kotlin.reflect.full.*

class User(val name: String, var age: Int) {
    fun greet() = "Hi, I'm $name"
    private fun secret() = "secret"
}

val klass = User::class

// Constructors
klass.constructors  // Set<KFunction<*>>
klass.primaryConstructor  // KFunction<*>?

// Members (functions and properties)
klass.members  // Collection<KCallable<*>>
klass.functions  // Collection<KFunction<*>>
klass.properties  // Collection<KProperty1<User, *>>
klass.declaredFunctions  // functions declared in this class (not inherited)

// Find specific member
klass.memberFunctions.find { it.name == "greet" }

// Properties
klass.memberProperties.forEach { prop ->
    println("${prop.name}: ${prop.returnType}")
}

// Type parameters
klass.typeParameters  // List<KTypeParameter>

// Supertypes
klass.supertypes  // List<KType>
klass.supertypes.forEach { println(it) }
```

## KType and Type Information

```kotlin
import kotlin.reflect.full.*

// Get type of a property
val prop = User::name
val type: KType = prop.returnType
type.classifier  // KClass<*>? (e.g., String::class)
type.isMarkedNullable  // false (true for String?)
type.arguments  // List<KTypeProjection> for generics

// Check nullability
val nullableProp: KProperty1<User, String?> = ...
nullableProp.returnType.isMarkedNullable  // true
```

## Annotations via Reflection

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyAnnotation(val value: String)

@MyAnnotation("test")
class AnnotatedClass {
    @MyAnnotation("method")
    fun annotatedMethod() {}
}

// Get class annotations
val annotations = AnnotatedClass::class.annotations
annotations.forEach { println(it) }

// Find specific annotation
val myAnn = AnnotatedClass::class.findAnnotation<MyAnnotation>()
println(myAnn?.value)  // "test"

// Function annotations
val methodAnn = AnnotatedClass::class
    .memberFunctions
    .find { it.name == "annotatedMethod" }
    ?.findAnnotation<MyAnnotation>()
println(methodAnn?.value)  // "method"
```

## Creating Instances

```kotlin
import kotlin.reflect.full.*

class User(val name: String, val age: Int)

// Create instance via primary constructor
val klass = User::class
val ctor = klass.primaryConstructor!!
val params = ctor.parameters
// Call with parameter map
val user = ctor.callBy(mapOf(
    params.elementAt(0) to "Alice",
    params.elementAt(1) to 30
))
// User(name=Alice, age=30)
```

## Java Reflection Interop

```kotlin
// Get Java Class from KClass
val javaClass: Class<String> = String::class.java

// Get KClass from Java Class
val kClass: KClass<String> = String::class.kotlin

// Access Java reflection features
val methods = String::class.java.methods
val fields = String::class.java.declaredFields

// Java field via Kotlin property
val prop = Person::age
val javaField = prop.javaField  // java.lang.reflect.Field?

// Java method via Kotlin function
val func = Person::greet
val javaMethod = func.javaMethod  // java.lang.reflect.Method?
```

## Practical Use Cases

```kotlin
// Object mapping (simplified)
inline fun <reified T : Any> fromMap(map: Map<String, Any?>): T {
    val klass = T::class
    val ctor = klass.primaryConstructor!!
    val params = ctor.parameters.associateWith { p ->
        map[p.name] ?: throw IllegalArgumentException("Missing ${p.name}")
    }
    return ctor.callBy(params)
}

// Serialize to map
fun Any.toMap(): Map<String, Any?> {
    return this::class.memberProperties
        .associate { prop ->
            prop.name to prop.get(this)
        }
}

// Validate non-null properties
fun validateAllNonNull(obj: Any): List<String> {
    return obj::class.memberProperties
        .filter { !it.returnType.isMarkedNullable }
        .filter { it.get(obj) == null }
        .map { it.name }
}
```
