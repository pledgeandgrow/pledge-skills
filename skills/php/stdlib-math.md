# Standard Library: Math

## Math Functions

```php
// Basic
abs($n); max($a, $b, $c); max($arr); min($a, $b); min($arr);
sqrt($n); pow($base, $exp); $base ** $exp;
log($n); log($n, 2); log10($n); log2($n); exp($n);

// Rounding
ceil($n); floor($n);
round($n); round($n, 2); round($n, 2, PHP_ROUND_HALF_UP);

// RoundingMode enum (PHP 8.4+)
round($n, 2, RoundingMode::HalfAwayFromZero);
round($n, 2, RoundingMode::HalfTowardsZero);
round($n, 2, RoundingMode::HalfEven);
round($n, 2, RoundingMode::HalfOdd);
round($n, 2, RoundingMode::TowardsZero);
round($n, 2, RoundingMode::AwayFromZero);
round($n, 2, RoundingMode::NegativeInfinity);
round($n, 2, RoundingMode::PositiveInfinity);

// Trigonometry
sin($x); cos($x); tan($x);
asin($x); acos($x); atan($x); atan2($y, $x);
sinh($x); cosh($x); tanh($x);
deg2rad($deg); rad2deg($rad);

// Integer
intdiv($a, $b); // integer division
$fmod = fmod($a, $b); // float modulo
$intdiv = $a % $b; // integer modulo

// Random
rand($min, $max); mt_rand($min, $max);
random_int($min, $max); // cryptographically secure
random_bytes(16); // cryptographically secure bytes
mt_srand($seed); // seed Mersenne Twister

// Constants
M_PI; M_E; M_SQRT2; M_SQRT3; M_LN2; M_LN10;
M_LOG2E; M_LOG10E; M_PI_2; M_PI_4; M_1_PI; M_2_PI;
M_2_SQRTPI; M_SQRTPI; M_EULER;
INF; NAN; PHP_FLOAT_MAX; PHP_FLOAT_MIN; PHP_FLOAT_EPSILON;
PHP_INT_MAX; PHP_INT_MIN;

// Type conversion
intval($str); intval($str, 16); // parse with base
floatval($str); doubleval($str); // alias
```

## RoundingMode Enum (PHP 8.4+)

```php
enum RoundingMode {
    case HalfAwayFromZero;  // default — 0.5 rounds away from zero
    case HalfTowardsZero;   // 0.5 rounds towards zero
    case HalfEven;          // banker's rounding — 0.5 rounds to even
    case HalfOdd;           // 0.5 rounds to odd
    case TowardsZero;       // truncate
    case AwayFromZero;      // always round away from zero
    case NegativeInfinity;  // always round down
    case PositiveInfinity;  // always round up
}

// Usage
$rounded = round(2.5, 0, RoundingMode::HalfEven); // 2
$rounded = round(3.5, 0, RoundingMode::HalfEven); // 4
$rounded = round(-2.5, 0, RoundingMode::HalfEven); // -2
```

## BCMath (Arbitrary Precision)

```php
// BCMath operates on string representations of numbers
bcadd('1.234', '5.678', 4);     // '6.9120'
bcsub('10.000', '3.500', 4);    // '6.5000'
bcmul('2.5', '4.2', 4);         // '10.5000'
bcdiv('10', '3', 4);            // '3.3333'
bcmod('10', '3');               // '1'
bcpow('2', '10', 4);            // '1024.0000'
bcsqrt('144', 4);               // '12.0000'
bccomp('1.5', '1.50', 4);       // 0 (equal)

// Set default scale
bcscale(4);

// BcMath\Number object (PHP 8.4+)
$num = new BcMath\Number('123.456');
$result = $num->add(new BcMath\Number('100'));
echo $result->value; // '223.456000'
```

## GMP (GNU Multiple Precision)

```php
// GMP for large integer math
$gmp = gmp_init('123456789012345678901234567890');
gmp_add($gmp, gmp_init('1'));
gmp_mul($gmp, gmp_init('2'));
gmp_pow($gmp, 2);
gmp_sqrt($gmp);
gmp_gcd($a, $b);
gmp_mod($gmp, gmp_init('7'));
gmp_prob_prime($gmp);

// GMP object (PHP 8.0+ — overloaded operators)
$a = gmp_init('100');
$b = gmp_init('30');
echo $a + $b; // 130
echo $a * $b; // 3000
echo $a % $b; // 10

// GMP as object
$gmp = new GMP('12345678901234567890');
$result = $gmp + 1;
echo gmp_strval($result);
```

## Statistics Extension

```php
// Statistical functions (requires stats extension)
stats_mean($arr);
stats_variance($arr);
stats_standard_deviation($arr);
stats_median($arr);
stats_covariance($arr1, $arr2);
stats_correlation($arr1, $arr2);
stats_stat_binomial_coef($n, $k);
stats_stat_factorial($n);
```

## Trader Extension (Technical Analysis)

```php
// Technical analysis for traders (requires trader extension)
trader_ma($data, 14, TRADER_MA_TYPE_SMA);  // Simple Moving Average
trader_ema($data, 14);                     // Exponential Moving Average
trader_rsi($data, 14);                     // Relative Strength Index
trader_macd($data, 12, 26, 9);             // MACD
trader_bbands($data, 14, 2.0, 2.0);        // Bollinger Bands
trader_atr($high, $low, $close, 14);       // Average True Range
```
