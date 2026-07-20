# Standard Library: Date and Time

## Date/Time Functions

```php
// Current time
time();              // Unix timestamp (seconds)
microtime(true);     // float with microseconds
hrtime(true);        // nanoseconds (array or int)
date('Y-m-d H:i:s'); // formatted current date
date_default_timezone_get();
date_default_timezone_set('UTC');

// Format a timestamp
date('Y-m-d', $timestamp);    // 2024-01-15
date('l, F j, Y', $timestamp); // Monday, January 15, 2024
gmdate('Y-m-d H:i:s');        // UTC formatted

// Parse
strtotime('2024-01-15');
strtotime('next Monday');
strtotime('+1 week');
strtotime('2024-01-15 +1 month');

// Check date
checkdate($month, $day, $year); // bool

// Get date parts
getdate($timestamp); // ['year' => ..., 'mon' => ..., 'mday' => ..., ...]
gettimeofday(); // ['sec' => ..., 'usec' => ..., ...]

// Format constants
DATE_ATOM;  // 'Y-m-d\TH:i:sP'
DATE_RFC2822; // 'D, d M Y H:i:s O'
DATE_ISO8601;
DATE_W3C;
DATE_RSS;
DATE_COOKIE;
```

## DateTime Class

```php
$dt = new DateTime('2024-01-15 10:30:00');
$dt = new DateTime('now', new DateTimeZone('UTC'));
$dt = new DateTime('@' . time()); // from timestamp

// Modify
$dt->modify('+1 day');
$dt->modify('next Monday');
$dt->add(new DateInterval('P1Y2M3D')); // 1 year, 2 months, 3 days
$dt->sub(new DateInterval('PT1H')); // subtract 1 hour

// Format
echo $dt->format('Y-m-d H:i:s');
echo $dt->format(DateTimeInterface::ATOM);

// Get/set timezone
$dt->setTimezone(new DateTimeZone('America/New_York'));
echo $dt->getTimezone()->getName();

// Diff
$diff = $dt->diff(new DateTime('2024-12-31'));
echo $diff->days;   // total days
echo $diff->m;      // months
echo $diff->invert; // 1 if $dt > target

// Get timestamp
$ts = $dt->getTimestamp();
$dt->setTimestamp(time());
```

## DateTimeImmutable (Preferred)

```php
// DateTimeImmutable — returns new instance on modification (safer)
$dt = new DateTimeImmutable('2024-01-15');
$tomorrow = $dt->modify('+1 day'); // new instance, $dt unchanged

$added = $dt->add(new DateInterval('P1D'));
$subtracted = $dt->sub(new DateInterval('P1D'));

// Best practice: use DateTimeImmutable over DateTime
```

## DateTimeInterface

Interface implemented by both `DateTime` and `DateTimeImmutable`.

```php
interface DateTimeInterface {
    public function format(string $format): string;
    public function getTimezone(): DateTimeZone;
    public function getOffset(): int;
    public function getTimestamp(): int;
    public function diff(DateTimeInterface $target, bool $absolute = false): DateInterval;
    public function __wakeup(): void;
}
```

## DateTimeZone

```php
$tz = new DateTimeZone('UTC');
$tz = new DateTimeZone('America/New_York');
$tz = new DateTimeZone('Europe/Paris');

// List all timezones
$timezones = DateTimeZone::listIdentifiers();
$timezones = DateTimeZone::listIdentifiers(DateTimeZone::PER_COUNTRY, 'US');

// Get offset
$offset = $tz->getOffset(new DateTime('now', $tz)); // seconds from UTC

// Location
$location = $tz->getLocation(); // ['country_code' => 'US', 'latitude' => ..., ...]

// Transitions (DST changes)
$transitions = $tz->getTransitions(strtotime('2024-01-01'), strtotime('2024-12-31'));
```

## DateInterval

```php
// Create from specification (ISO 8601 duration)
$interval = new DateInterval('P1Y2M3DT4H5M6S');
// P1Y = 1 year, 2M = 2 months, 3D = 3 days
// T4H = 4 hours, 5M = 5 minutes, 6S = 6 seconds

// Create from string (PHP 8.3+ — fromDateString)
$interval = DateInterval::createFromDateString('1 year 2 months 3 days');

// Properties
$interval->y; // years
$interval->m; // months
$interval->d; // days
$interval->h; // hours
$interval->i; // minutes
$interval->s; // seconds
$interval->f; // microseconds
$interval->invert; // 1 if negative
$interval->days; // total days (only from diff())

// Format
echo $interval->format('%y years, %m months, %d days');
```

## DatePeriod

```php
// Iterate over a period
$period = new DatePeriod(
    new DateTime('2024-01-01'),
    new DateInterval('P1D'), // 1 day
    new DateTime('2024-01-10'),
    DatePeriod::EXCLUDE_START_DATE
);

foreach ($period as $date) {
    echo $date->format('Y-m-d') . "\n";
}

// With recurrences
$period = new DatePeriod(
    new DateTime('2024-01-01'),
    new DateInterval('P1W'),
    4 // 4 recurrences
);
```

## Calendar Functions

```php
// Julian day count conversions
$jd = gregoriantojd(1, 15, 2024);
$gregorian = jdtogregorian($jd);
$dayOfWeek = jddayofweek($jd); // 0=Sunday

// Easter date
$easter = easter_date(2024);

// French Republican calendar
$french = jdtofrench($jd);
```

## HRTime (High Resolution Timing)

```php
use HRTime\StopWatch;
use HRTime\PerformanceCounter;

$stopwatch = new StopWatch();
$stopwatch->start();
// ... code to measure ...
$stopwatch->stop();
echo $stopwatch->getLastElapsedTime(HRTime\Unit::NANOSECOND);
echo $stopwatch->getTotalElapsedTime(HRTime\Unit::MICROSECOND);

// PerformanceCounter
$ticks = PerformanceCounter::getTicks();
$frequency = PerformanceCounter::getFrequency();
```

## Date/Time Error Classes (PHP 8.3+)

```
DateError
├── DateObjectError
└── DateRangeError

DateException
├── DateInvalidOperationException
├── DateInvalidTimeZoneException
├── DateMalformedIntervalStringException
├── DateMalformedPeriodStringException
└── DateMalformedStringException
```
