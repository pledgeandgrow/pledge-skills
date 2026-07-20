# Numerics

## Math Functions

```cpp
#include <cmath>

// Basic
std::abs(-5);       // 5 (absolute value)
std::fabs(-3.14);   // 3.14
std::fmod(7.5, 3.0); // 1.5 (floating-point remainder)
std::fma(2.0, 3.0, 1.0); // 7.0 (fused multiply-add, single rounding)

// Power
std::pow(2, 10);    // 1024
std::sqrt(16);      // 4
std::cbrt(27);      // 3 (cube root)
std::hypot(3, 4);   // 5 (sqrt(x² + y²))
std::hypot(3, 4, 5); // 7.07 (3D hypot, C++17)

// Exponential/logarithmic
std::exp(1);        // 2.718 (e^x)
std::exp2(3);       // 8 (2^x)
std::log(2.718);    // 1 (natural log)
std::log2(8);       // 3
std::log10(1000);   // 3

// Trigonometric
std::sin(M_PI/2);   // 1
std::cos(0);        // 1
std::tan(M_PI/4);   // 1
std::asin(1);       // M_PI/2
std::acos(1);       // 0
std::atan(1);       // M_PI/4
std::atan2(1, 1);   // M_PI/4 (atan(y/x) with quadrant)

// Hyperbolic
std::sinh(0);       // 0
std::cosh(0);       // 1
std::tanh(0);       // 0
std::asinh(0);      // 0
std::acosh(1);      // 0
std::atanh(0);      // 0

// Rounding
std::ceil(3.2);     // 4
std::floor(3.8);    // 3
std::trunc(3.8);    // 3 (toward zero)
std::round(3.5);    // 4 (nearest, ties away from zero)
std::nearbyint(3.5); // 4 (using current rounding mode)
std::rint(3.5);     // 4 (using current rounding mode, may raise FE_INEXACT)

// Floating-point manipulation
std::frexp(3.14, &exp);  // mantissa, exp (x = mantissa * 2^exp)
std::ldexp(0.785, 2);    // 3.14 (mantissa * 2^exp)
std::modf(3.14, &intpart); // fractional part, intpart = 3
std::copysign(3.0, -1.0); // -3.0 (copy sign)
std::nextafter(1.0, 2.0); // next representable value after 1.0
std::nexttoward(1.0, 2.0L); // next after 1.0 toward 2.0

// Classification
std::isnan(x);      // true if NaN
std::isinf(x);      // true if infinity
std::isfinite(x);   // true if not inf/NaN
std::isnormal(x);   // true if normal (not zero, subnormal, inf, NaN)
std::isnan(x);      // true if NaN
std::fpclassify(x); // FP_NAN, FP_INFINITE, FP_NORMAL, FP_SUBNORMAL, FP_ZERO

// Special functions (C++11/C++17)
std::beta(1.0, 2.0);     // beta function
std::erf(1.0);           // error function
std::erfc(1.0);          // complementary error function
std::lgamma(1.0);        // log gamma
std::tgamma(1.0);        // gamma function
std::comp_ellint_1(0.5); // complete elliptic integral
std::comp_ellint_2(0.5);
std::comp_ellint_3(0.5, 0.3);
std::assoc_laguerre(2, 1, 0.5);  // associated Laguerre
std::assoc_legendre(2, 1, 0.5);  // associated Legendre
std::hermite(3, 0.5);    // Hermite polynomial
std::laguerre(3, 0.5);   // Laguerre polynomial
std::legendre(3, 0.5);   // Legendre polynomial
std::sph_bessel(3, 0.5); // spherical Bessel
std::sph_legendre(3, 2, 0.5); // spherical Legendre
std::sph_neumann(3, 0.5); // spherical Neumann

// Constants (C++20)
#include <numbers>
std::numbers::pi;           // 3.14159265358979323846
std::numbers::e;            // 2.71828182845904523536
std::numbers::sqrt2;        // 1.41421356237309504880
std::numbers::ln2;          // 0.69314718055994530942
std::numbers::ln10;         // 2.30258509299404568402
std::numbers::log2e;        // 1.44269504088896340736
std::numbers::log10e;       // 0.43429448190325182765
std::numbers::pi_v<double>; // template version
```

## std::complex

```cpp
#include <complex>

// Creation
std::complex<double> z1(3.0, 4.0);  // 3 + 4i
std::complex<double> z2 = 1.0;      // 1 + 0i
auto z3 = 3.0 + 4.0i;               // using namespace std::complex_literals

// Access
z1.real();  // 3.0
z1.imag();  // 4.0
z1.real(5.0);  // set real part
z1.imag(6.0);  // set imag part

// Operations
z1 + z2; z1 - z2; z1 * z2; z1 / z2;
z1 += z2; z1 -= z2;

// Functions
std::abs(z1);      // 5.0 (magnitude)
std::arg(z1);      // 0.927 (phase angle in radians)
std::norm(z1);     // 25.0 (squared magnitude)
std::conj(z1);     // 3 - 4i (conjugate)
std::proj(z1);     // projection
std::polar(5.0, 0.927); // construct from polar (r, theta)

// Exponential/log
std::exp(z1);  std::log(z1);  std::log10(z1);
std::pow(z1, 2);

// Trigonometric
std::sin(z1); std::cos(z1); std::tan(z1);
std::sinh(z1); std::cosh(z1); std::tanh(z1);
std::asin(z1); std::acos(z1); std::atan(z1);
std::asinh(z1); std::acosh(z1); std::atanh(z1);

// sqrt
std::sqrt(z1);
```

## Random Number Generation

```cpp
#include <random>

// Random device (non-deterministic, if available)
std::random_device rd;

// Engines (deterministic PRNGs)
std::mt19937 mt(rd());           // Mersenne Twister 32-bit
std::mt19937_64 mt64(rd());      // Mersenne Twister 64-bit
std::linear_congruential_engine<uint32_t, 16807, 0, 2147483647> lcg(rd());
std::ranlux24_base ranlux(rd());

// Seeding
std::mt19937 seeded(42);  // fixed seed for reproducibility
seeded.seed(123);
seeded.discard(1000);  // skip 1000 values

// Distributions
std::uniform_int_distribution<int> dist(1, 100);
int n = dist(mt);  // random int in [1, 100]

std::uniform_real_distribution<double> rdist(0.0, 1.0);
double d = rdist(mt);  // random double in [0, 1)

std::normal_distribution<double> ndist(0.0, 1.0);  // mean=0, stddev=1
double g = ndist(mt);  // Gaussian random

std::bernoulli_distribution bd(0.7);  // 70% true
bool b = bd(mt);

std::binomial_distribution<int> bindist(10, 0.5);
std::poisson_distribution<int> pdist(4.0);
std::exponential_distribution<double> edist(1.0);
std::gamma_distribution<double> gdist(1.0, 1.0);
std::weibull_distribution<double> wdist(2.0, 1.0);
std::extreme_value_distribution<double> evdist(0.0, 1.0);
std::lognormal_distribution<double> lndist(0.0, 1.0);
std::chi_squared_distribution<double> csd(1.0);
std::cauchy_distribution<double> cdist(0.0, 1.0);
std::fisher_f_distribution<double> ffd(1.0, 1.0);
std::student_t_distribution<double> std(1.0);
std::discrete_distribution<int> dd({1, 2, 3, 4});  // weighted
std::piecewise_constant_distribution<double> pcd;
std::piecewise_linear_distribution<double> pld;

// Practical: random element from container
template<typename T>
auto randomElement(const std::vector<T>& v, std::mt19937& gen) {
    std::uniform_int_distribution<size_t> dist(0, v.size() - 1);
    return v[dist(gen)];
}

// Practical: shuffle
std::vector<int> v = {1, 2, 3, 4, 5};
std::shuffle(v.begin(), v.end(), mt);
```

## std::valarray

```cpp
#include <valarray>

// Mathematical array (element-wise operations)
std::valarray<double> a = {1, 2, 3, 4, 5};
std::valarray<double> b = {10, 20, 30, 40, 50};

// Element-wise arithmetic
a + b;   // {11, 22, 33, 44, 55}
a * b;   // {10, 40, 90, 160, 250}
a * 2;   // {2, 4, 6, 8, 10}
std::sin(a);  // {sin(1), sin(2), sin(3), sin(4), sin(5)}

// Slices
a[std::slice(0, 3, 1)];  // first 3 elements
a[std::gslice(0, {2, 3}, {2, 1})];  // generalized slice
a[std::mask_array(a > 2)];  // elements where condition is true
a[std::indirect_array({0, 2, 4})];  // specific indices

// Methods
a.sum();   // 15
a.min();   // 1
a.max();   // 5
a.size();  // 5
a.apply([](double x) { return x * x; });
a.cshift(2);  // circular shift left by 2
a.shift(2);   // shift left by 2 (fill with 0)
```

## std::ratio

```cpp
#include <ratio>

// Compile-time rational numbers
using half = std::ratio<1, 2>;
using third = std::ratio<1, 3>;
using two_thirds = std::ratio<2, 3>;

// Properties
half::num;   // 1
half::den;   // 2

// Arithmetic (compile-time)
using sum = std::ratio_add<half, third>;  // 5/6
using diff = std::ratio_subtract<half, third>;
using product = std::ratio_multiply<half, third>;  // 1/6
using quotient = std::ratio_divide<half, third>;  // 3/2

// Comparison
std::ratio_equal<half, std::ratio<2, 4>>::value;  // true (1/2 == 2/4)
std::ratio_less<half, third>::value;  // false (1/2 > 1/3)

// Standard ratios
std::atto;   // 10^-18
std::femto;  // 10^-15
std::pico;   // 10^-12
std::nano;   // 10^-9
std::micro;  // 10^-6
std::milli;  // 10^-3
std::centi;  // 10^-2
std::deci;   // 10^-1
std::deca;   // 10^1
std::hecto;  // 10^2
std::kilo;   // 10^3
std::mega;   // 10^6
std::giga;   // 10^9
std::tera;   // 10^12
std::peta;   // 10^15
std::exa;    // 10^18
```

## Numeric Limits

```cpp
#include <limits>

// See types.md for full details
std::numeric_limits<int>::max();
std::numeric_limits<int>::min();
std::numeric_limits<int>::digits;       // bits in value
std::numeric_limits<int>::digits10;     // decimal digits
std::numeric_limits<double>::epsilon();
std::numeric_limits<double>::infinity();
std::numeric_limits<double>::quiet_NaN();
std::numeric_limits<double>::denorm_min();
std::numeric_limits<double>::is_integer;
std::numeric_limits<double>::is_signed;
std::numeric_limits<double>::has_infinity;
std::numeric_limits<double>::has_quiet_NaN;
std::numeric_limits<double>::round_error();
std::numeric_limits<double>::min_exponent;
std::numeric_limits<double>::max_exponent();
```

## Integer Power (C++26)

```cpp
// std::powi (C++26) — integer power
// auto r = std::powi(2, 10);  // 1024 (integer result, no floating-point)
```

## Bit Operations (C++20)

```cpp
#include <bit>

// See operators.md for full details
std::popcount(0b1011u);    // 3
std::countl_zero(0b0001u); // 3
std::countr_zero(0b1000u); // 3
std::has_single_bit(0b0100u); // true
std::bit_ceil(5u);   // 8
std::bit_floor(5u);  // 4
std::bit_width(5u);  // 3
std::rotl(0b1010u, 2);
std::rotr(0b1010u, 2);
std::byteswap(0x1234u); // 0x3412 (C++23)
std::bit_cast<float>(0x40490FDBu); // 3.14159... (reinterpret bits)
```
