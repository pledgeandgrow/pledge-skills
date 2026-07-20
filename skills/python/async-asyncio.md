# Async & Asyncio

**Docs:** https://docs.python.org/3/library/asyncio.html | https://docs.python.org/3/reference/compound_stmts.html#async

## async/await

```python
import asyncio

# async def — coroutine function
async def fetch_data():
    await asyncio.sleep(1)  # non-blocking sleep
    return "data"

# await — pause until coroutine completes
async def main():
    result = await fetch_data()
    print(result)

# Run the event loop
asyncio.run(main())  # Python 3.7+
```

## Coroutines

```python
# Coroutine — async function returns a coroutine object
coro = fetch_data()  # doesn't run yet
# Must be awaited or scheduled

# Coroutine states
import inspect
inspect.iscoroutine(fetch_data())  # True

# Awaitables — coroutines, Tasks, Futures
async def process():
    data = await fetch_data()  # await any awaitable
    return data

# await in sequence (sequential)
async def sequential():
    a = await fetch("url1")  # waits for url1
    b = await fetch("url2")  # then waits for url2
    return [a, b]

# Concurrent with asyncio.gather
async def concurrent():
    a, b = await asyncio.gather(
        fetch("url1"),  # both start at same time
        fetch("url2"),
    )
    return [a, b]
```

## Tasks

```python
import asyncio

# Create task — schedule coroutine to run concurrently
async def main():
    task = asyncio.create_task(fetch_data())
    # Do other work while task runs
    other_work()
    result = await task  # await when needed
    print(result)

# Multiple tasks
async def main():
    tasks = [
        asyncio.create_task(fetch(f"url{i}"))
        for i in range(5)
    ]
    results = await asyncio.gather(*tasks)
    print(results)

# gather with return_exceptions (don't raise on error)
results = await asyncio.gather(*tasks, return_exceptions=True)
# results may contain Exception objects

# TaskGroup — structured concurrency (3.11+)
async def main():
    async with asyncio.TaskGroup() as tg:
        t1 = tg.create_task(fetch("url1"))
        t2 = tg.create_task(fetch("url2"))
    # All tasks complete before exiting the block
    print(t1.result(), t2.result())

# Task methods
task = asyncio.create_task(work())
task.done()        # check if complete
task.cancel()      # request cancellation
task.cancelled()   # check if cancelled
task.result()      # get result (raises if not done)
task.exception()   # get exception (None if none)

# Cancel with timeout
async def main():
    task = asyncio.create_task(long_running())
    try:
        result = await asyncio.wait_for(task, timeout=5.0)
    except asyncio.TimeoutError:
        print("Timed out")
        task.cancel()
```

## Waiting for Tasks

```python
# asyncio.wait — wait for first/first-completed/all
async def main():
    tasks = [asyncio.create_task(work(i)) for i in range(5)]

    # Wait for all
    done, pending = await asyncio.wait(tasks)

    # Wait for first to complete
    done, pending = await asyncio.wait(
        tasks, return_when=asyncio.FIRST_COMPLETED
    )

    # Wait for first exception
    done, pending = await asyncio.wait(
        tasks, return_when=asyncio.FIRST_EXCEPTION
    )

    # Cancel pending
    for task in pending:
        task.cancel()

# asyncio.wait_for — single coroutine with timeout
async def main():
    try:
        result = await asyncio.wait_for(slow_operation(), timeout=2.0)
    except asyncio.TimeoutError:
        print("Timed out")

# asyncio.as_completed — process as they finish
async def main():
    tasks = [fetch_data(i) for i in range(5)]
    for coro in asyncio.as_completed(tasks):
        result = await coro
        print(f"Got: {result}")
```

## Synchronization Primitives

```python
import asyncio

# Lock — mutual exclusion
lock = asyncio.Lock()

async def critical_section():
    async with lock:
        # Only one task at a time
        shared_resource.modify()

# Semaphore — limit concurrency
sem = asyncio.Semaphore(3)  # max 3 concurrent

async def limited():
    async with sem:
        await fetch(url)

# Event — signal between tasks
event = asyncio.Event()

async def waiter():
    await event.wait()  # blocks until set
    print("Event triggered")

async def setter():
    await asyncio.sleep(1)
    event.set()  # wake all waiters

# Condition — lock + event
cond = asyncio.Condition()

async def consumer():
    async with cond:
        await cond.wait()  # releases lock, waits, reacquires
        process()

async def producer():
    async with cond:
        produce()
        cond.notify_all()

# Barrier (3.11+) — wait for N tasks to reach a point
barrier = asyncio.Barrier(3)  # 3 parties

async def worker(wid):
    await do_work()
    await barrier.wait()  # blocks until all 3 reach here
    # All proceed simultaneously after barrier

# Barrier reset
barrier.reset()  # reset to initial state
barrier.abort()  # release all waiting tasks with BrokenBarrierError

# Queue — producer/consumer
queue = asyncio.Queue(maxsize=10)

async def producer():
    for i in range(100):
        await queue.put(i)
    await queue.put(None)  # sentinel

async def consumer():
    while True:
        item = await queue.get()
        if item is None:
            break
        process(item)
        queue.task_done()

# Queue variants
pq = asyncio.PriorityQueue()
pq.put_nowait((3, "low"))
pq.put_nowait((1, "high"))
await pq.get()  # (1, "high") — lowest first

lq = asyncio.LifoQueue()  # stack — last in, first out
lq.put_nowait(1)
lq.put_nowait(2)
await lq.get()  # 2

# Queue methods
queue.qsize()       # approximate size
queue.empty()       # True if empty
queue.full()        # True if full (maxsize reached)
queue.put_nowait(x)  # non-blocking put
queue.get_nowait()   # non-blocking get
await queue.join()   # wait until all items processed
```

## Async Subprocess

```python
import asyncio

async def run_subprocess():
    # Create subprocess
    proc = await asyncio.create_subprocess_exec(
        "ls", "-la",
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )

    # Read output
    stdout, stderr = await proc.communicate()
    print(f"stdout: {stdout.decode()}")
    print(f"return code: {proc.returncode}")

    # Using shell=True equivalent
    proc = await asyncio.create_subprocess_shell(
        "echo hello | tr a-z A-Z",
        stdout=asyncio.subprocess.PIPE,
    )
    stdout, _ = await proc.communicate()
    print(stdout.decode())  # "HELLO\n"

    # Write to stdin
    proc = await asyncio.create_subprocess_exec(
        "cat",
        stdin=asyncio.subprocess.PIPE,
        stdout=asyncio.subprocess.PIPE,
    )
    stdout, _ = await proc.communicate(input=b"hello")
    print(stdout.decode())  # "hello"

    # Wait for process
    await proc.wait()
    print(f"exit code: {proc.returncode}")

    # Send signal / terminate / kill
    proc.send_signal(asyncio.subprocess.SIGTERM)
    proc.terminate()
    proc.kill()
```

## Streams (Network I/O)

```python
import asyncio

# TCP client
async def tcp_client():
    reader, writer = await asyncio.open_connection("example.com", 80)

    writer.write(b"GET / HTTP/1.1\r\nHost: example.com\r\n\r\n")
    await writer.drain()

    data = await reader.read(1024)
    print(data.decode())

    writer.close()
    await writer.wait_closed()

# TCP server
async def handle_client(reader, writer):
    data = await reader.read(100)
    writer.write(data.upper().encode())
    await writer.drain()
    writer.close()
    await writer.wait_closed()

async def tcp_server():
    server = await asyncio.start_server(handle_client, "localhost", 8888)
    async with server:
        await server.serve_forever()

# UDP
async def udp_echo():
    transport, protocol = await asyncio.get_event_loop().create_datagram_endpoint(
        lambda: asyncio.DatagramProtocol(),
        remote_addr=("localhost", 9999),
    )
    transport.sendto(b"Hello")
    data, addr = await protocol.recvfrom(1024)
    transport.close()
```

## Async Generators

```python
import asyncio

# Async generator — yield with await
async def async_range(n):
    for i in range(n):
        await asyncio.sleep(0.1)
        yield i

# Consume async generator
async def main():
    async for num in async_range(5):
        print(num)

# Async comprehension
async def main():
    results = [x async for x in async_range(5)]
    results = [x async for x in async_range(5) if x % 2 == 0]
    total = sum(x async for x in async_range(10))
```

## Running in Threads/Processes

```python
import asyncio
import asyncio

# run_in_executor — run blocking code in thread pool
async def main():
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(None, blocking_function, arg1, arg2)

# With concurrent.futures
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

async def main():
    with ThreadPoolExecutor() as pool:
        result = await asyncio.get_event_loop().run_in_executor(
            pool, cpu_intensive, data
        )

# to_thread — simpler API (3.9+)
async def main():
    result = await asyncio.to_thread(blocking_function, arg1)
```

## Timeout Handling

```python
import asyncio

# asyncio.timeout (3.11+)
async def main():
    try:
        async with asyncio.timeout(5.0):
            await long_operation()
    except TimeoutError:
        print("Timed out")

# asyncio.timeout_at (3.11+)
async def main():
    now = asyncio.get_event_loop().time()
    try:
        async with asyncio.timeout_at(now + 5.0):
            await long_operation()
    except TimeoutError:
        print("Timed out")

# wait_for (all versions)
try:
    result = await asyncio.wait_for(operation(), timeout=5.0)
except asyncio.TimeoutError:
    print("Timed out")
```

## Event Loop

```python
import asyncio

# Get the running event loop
loop = asyncio.get_event_loop()
loop = asyncio.get_running_loop()  # only inside async code

# Run multiple coroutines
async def main():
    await asyncio.gather(task1(), task2(), task3())

# asyncio.run — creates and closes event loop
asyncio.run(main())

# Custom event loop policy (rare)
asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# asyncio.Runner — manages event loop lifecycle (3.11+)
with asyncio.Runner() as runner:
    result = runner.run(main())
    # Can run multiple coroutines in the same loop
    result2 = runner.run(other_coroutine())

# Runner with debug mode
with asyncio.Runner(debug=True) as runner:
    runner.run(main())

# eager_task_factory — start tasks eagerly (3.12+)
async def main():
    loop = asyncio.get_running_loop()
    loop.set_task_factory(asyncio.eager_task_factory)
    # Tasks now start executing immediately upon creation
    # before yielding to the event loop
    task = asyncio.create_task(some_coro())
    # some_coro may have already progressed synchronously

# asyncio.shield — protect from cancellation
async def main():
    task = asyncio.create_task(important_work())
    try:
        result = await asyncio.shield(task)
    except asyncio.CancelledError:
        # The caller was cancelled, but task continues
        result = await task  # still get the result
        raise

# current_task and all_tasks (3.7+)
async def main():
    current = asyncio.current_task()
    all_tasks = asyncio.all_tasks()
    print(f"Running: {current.get_name()}")
    print(f"All tasks: {len(all_tasks)}")

# Task naming (3.8+)
async def main():
    task = asyncio.create_task(work(), name="worker-1")
    print(task.get_name())  # "worker-1"
    task.set_name("worker-renamed")

# Loop time and call_later
async def main():
    loop = asyncio.get_running_loop()
    now = loop.time()  # monotonic time
    loop.call_later(2.0, callback)  # schedule callback in 2 seconds
    loop.call_at(now + 5.0, callback)  # schedule at absolute time

# asyncio.get_event_loop_tqdm — not a real thing, just showing pattern
# For progress bars with asyncio, use tqdm.asyncio.tqdm.gather

# Debug mode
asyncio.run(main(), debug=True)  # enable debug logging
# Or: PYTHONASYNCIODEBUG=1 python script.py
# Debug mode enables:
# - Slow callback detection (>100ms)
# - Coroutine never awaited warnings
# - Unclosed resources warnings
# - Source line info in task reprs
```

## Async Context Managers

```python
import asyncio

# Async context manager
class AsyncResource:
    async def __aenter__(self):
        await self.connect()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()
        return False

    async def connect(self):
        pass

    async def close(self):
        pass

async def main():
    async with AsyncResource() as resource:
        await resource.use()

# contextlib.asynccontextmanager
from contextlib import asynccontextmanager

@asynccontextmanager
async def async_db():
    db = await connect()
    try:
        yield db
    finally:
        await db.close()

async def main():
    async with async_db() as db:
        await db.query("SELECT 1")
```

## Common Patterns

```python
# Rate limiting
async def rate_limited(tasks, max_concurrent=5):
    sem = asyncio.Semaphore(max_concurrent)

    async def limited(task):
        async with sem:
            return await task()

    return await asyncio.gather(*[limited(t) for t in tasks])

# Retry with backoff
async def retry(func, max_retries=3, delay=1.0):
    for attempt in range(max_retries):
        try:
            return await func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            await asyncio.sleep(delay * (2 ** attempt))

# Fire and forget
async def main():
    asyncio.create_task(background_task())  # don't await
    # Task runs in background
    await main_work()

# Graceful shutdown
async def main():
    task = asyncio.create_task(long_running())
    try:
        await main_work()
    finally:
        task.cancel()
        try:
            await task
        except asyncio.CancelledError:
            pass
```
