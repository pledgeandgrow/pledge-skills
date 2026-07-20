# Chrono

## Duration

```cpp
#include <chrono>
using namespace std::chrono;
using namespace std::chrono_literals;

// Duration types
seconds s1(42);
milliseconds ms1(500);
microseconds us1(1000);
nanoseconds ns1(1000);

// Literals (C++14)
auto h = 1h;           // 1 hour
auto m = 30min;        // 30 minutes
auto s = 15s;          // 15 seconds
auto ms = 500ms;       // 500 milliseconds
auto us = 200us;       // 200 microseconds
auto ns = 100ns;       // 100 nanoseconds

// Duration arithmetic
auto total = 1h + 30min + 15s;  // 1h 30min 15s
auto diff = 1h - 30min;         // 30min
auto doubled = 2 * 30min;       // 1h
auto half = 30min / 2;          // 15min

// Cast between units
auto ms2 = duration_cast<milliseconds>(s1);  // 42000ms
auto s2 = duration_cast<seconds>(ms1);       // 0s (truncates)
auto sec_d = duration_cast<duration<double>>(s1);  // 42.0s (floating)

// Count (get raw value)
s1.count();   // 42
ms1.count();  // 500

// Custom duration
using frames = duration<int, std::ratio<1, 60>>;  // 60 fps
auto f = frames(30);  // 30 frames = 0.5 seconds
auto ms3 = duration_cast<milliseconds>(f);  // 500ms

// Comparison
1h > 30min;   // true
1s == 1000ms; // true
```

## Time Point and Clocks

```cpp
// Clocks
// system_clock — wall clock, may be adjusted (NTP)
// steady_clock — monotonic, never goes backwards
// high_resolution_clock — highest resolution (usually alias to steady_clock)
// utc_clock (C++20) — UTC clock
// tai_clock (C++20) — TAI clock
// gps_clock (C++20) — GPS clock
// file_clock (C++20) — clock for file_time

// Current time
auto now = system_clock::now();
auto steady_now = steady_clock::now();
auto utc_now = utc_clock::now();  // C++20

// Time point arithmetic
auto start = steady_clock::now();
// ... do work ...
auto end = steady_clock::now();
auto elapsed = end - start;  // duration
auto ms = duration_cast<milliseconds>(elapsed);
std::cout << ms.count() << "ms\n";

// Convert to C time
auto t = system_clock::to_time_t(now);
std::cout << std::ctime(&t);

// Convert from C time
auto tp = system_clock::from_time_t(t);
```

## Calendar (C++20)

```cpp
#include <chrono>

// Year
year y{2024};
y.is_leap();  // true
y + years{1}; // 2025

// Month
month m = January;
m = February;
m + months{1};  // March

// Day
day d{15};
d + days{1};  // 16

// Year-month-day
year_month_day ymd{year{2024}, January, day{15}};
year_month_day ymd2{2024y, January, 15d};  // using literals

// Construction from sys_days
auto today = year_month_day{floor<days>(system_clock::now())};

// Components
ymd.year();   // 2024
ymd.month();  // January
ymd.day();    // 15

// Validity
ymd.ok();  // true if valid date

// Convert to sys_days (time_point)
sys_days sd = ymd;  // convert to system_clock time_point at day granularity

// Weekday
weekday wd{Monday};
auto wd2 = January/15/2024;
auto wd3 = year_month_weekday{2024y, January, Monday[3]};  // 3rd Monday of Jan 2024

// Last day of month
auto last = January/last/2024;  // last day of January 2024
year_month_day_last ymdl{2024y, month_day_last{January}};
ymdl.day();  // 31

// Date arithmetic
auto tomorrow = ymd + days{1};
auto next_month = ymd + months{1};
auto next_year = ymd + years{1};

// Date literals (C++20)
auto d1 = 2024y / January / 15d;
auto d2 = 15d / January / 2024y;
auto d3 = January / 15 / 2024;

// Time of day
hh_mm_ss time{15h + 30min + 45s};
time.hours();    // 15h
time.minutes();  // 30min
time.seconds();  // 45s
time.is_negative();  // false

// Sub-second precision
hh_mm_ss<half_seconds> time2{45s};  // 0:00:45.500
```

## Time Zone (C++20)

```cpp
#include <chrono>

// Get time zones
auto tz = locate_zone("America/New_York");
auto utc = locate_zone("UTC");
auto local = current_zone();  // system local time zone

// Zoned time
zoned_time zt{tz, system_clock::now()};
std::cout << zt;  // "2024-01-15 10:30:45 EST"

// Convert between zones
zoned_time ny{locate_zone("America/New_York"), system_clock::now()};
zoned_time london{locate_zone("Europe/London"), ny};
zoned_time tokyo{locate_zone("Asia/Tokyo"), ny};

// Local time
auto lt = zoned_seconds{current_zone(), system_clock::now()}.get_local_time();

// Parse
year_month_day ymd;
std::istringstream{"2024-01-15"} >> std::chrono::parse("%F", ymd);
```

## Formatting (C++20)

```cpp
#include <chrono>
#include <format>

// Format duration
std::format("{}", 1h + 30min + 15s);  // "1h 30min 15s"
std::format("{:%H:%M:%S}", 15h + 30min + 45s);  // "15:30:45"
std::format("{:%T}", 15h + 30min + 45s);  // "15:30:45"

// Format time_point
auto now = system_clock::now();
std::format("{:%Y-%m-%d %H:%M:%S}", now);  // "2024-01-15 10:30:45"
std::format("{:%F %T}", now);              // "2024-01-15 10:30:45"
std::format("{:%c}", now);                 // locale-dependent
std::format("{:%x}", now);                 // date only
std::format("{:%X}", now);                 // time only

// Format zoned_time
zoned_time zt{locate_zone("America/New_York"), system_clock::now()};
std::format("{:%F %T %Z}", zt);  // "2024-01-15 05:30:45 EST"
```

## Sleep and Timers

```cpp
#include <thread>
#include <chrono>

// Sleep for duration
std::this_thread::sleep_for(100ms);
std::this_thread::sleep_for(2s);
std::this_thread::sleep_for(std::chrono::minutes(1));

// Sleep until time point
auto deadline = steady_clock::now() + 500ms;
std::this_thread::sleep_until(deadline);

// Timer
auto start = steady_clock::now();
// ... work ...
auto elapsed = steady_clock::now() - start;
auto ms = duration_cast<milliseconds>(elapsed);
std::cout << "Elapsed: " << ms.count() << "ms\n";

// High-resolution timer
auto start2 = high_resolution_clock::now();
// ... work ...
auto elapsed2 = high_resolution_clock::now() - start2;
auto ns = duration_cast<nanoseconds>(elapsed2);
std::cout << "Elapsed: " << ns.count() << "ns\n";
```

## Common Patterns

```cpp
// Benchmark function
template<typename Func>
auto benchmark(Func&& func, int iterations = 1000) {
    auto start = steady_clock::now();
    for (int i = 0; i < iterations; ++i) {
        func();
    }
    auto end = steady_clock::now();
    auto total = duration_cast<microseconds>(end - start);
    return total.count() / static_cast<double>(iterations);  // avg microseconds
}

// Timeout with condition variable
std::condition_variable cv;
std::mutex mtx;
bool ready = false;

std::unique_lock<std::mutex> lock(mtx);
if (cv.wait_for(lock, 5s, [] { return ready; })) {
    // condition met within 5s
} else {
    // timeout
}

// Periodic task
auto next = steady_clock::now() + 1s;
while (running) {
    // do work
    std::this_thread::sleep_until(next);
    next += 1s;  // maintain precise interval
}
```
