# Testing

**Docs:** https://docs.python.org/3/library/unittest.html | https://docs.pytest.org/

## pytest — Third-Party Testing Framework

```python
# Install: pip install pytest

# Basic test function (file: test_example.py)
def test_addition():
    assert 1 + 1 == 2

def test_string():
    assert "hello".upper() == "HELLO"

# Run: pytest test_example.py
# Run all: pytest
# Run verbose: pytest -v
# Run with output: pytest -s
```

### pytest Assertions

```python
def test_examples():
    # Basic
    assert x == y
    assert x != y
    assert x > y
    assert x in y
    assert x is None
    assert x is not None
    assert isinstance(x, int)

    # With message
    assert x == y, f"Expected {y}, got {x}"

    # Approximate float comparison
    assert 0.1 + 0.2 == pytest.approx(0.3)

    # Raises
    with pytest.raises(ValueError):
        int("not a number")

    # Raises with match
    with pytest.raises(ValueError, match="invalid literal"):
        int("abc")

    # Warning
    with pytest.warns(DeprecationWarning):
        deprecated_function()
```

### pytest Fixtures

```python
import pytest

# Basic fixture
@pytest.fixture
def sample_data():
    return [1, 2, 3, 4, 5]

def test_sum(sample_data):
    assert sum(sample_data) == 15

# Fixture with setup and teardown
@pytest.fixture
def db_connection():
    conn = connect_to_db()
    yield conn  # yield — test runs here
    conn.close()  # teardown

def test_query(db_connection):
    assert db_connection.query("SELECT 1") == 1

# Fixture scope
@pytest.fixture(scope="session")  # once per session
def app():
    return create_app()

@pytest.fixture(scope="module")   # once per module
def config():
    return load_config()

@pytest.fixture(scope="function") # once per test (default)
def fresh_list():
    return []

# Fixture params
@pytest.fixture(params=[1, 2, 3])
def number(request):
    return request.param

def test_positive(number):
    assert number > 0  # runs 3 times

# conftest.py — shared fixtures
# Place in tests/ directory — fixtures available to all tests
# tests/conftest.py
@pytest.fixture
def client():
    app = create_app()
    return app.test_client()

# Fixture dependency
@pytest.fixture
def auth_client(client):
    client.post("/login", json={"user": "admin", "pass": "secret"})
    return client

# autouse — automatically used
@pytest.fixture(autouse=True)
def reset_db():
    # runs before every test in this file
    db.reset()
    yield
    db.cleanup()
```

### pytest Markers

```python
import pytest

# Skip
@pytest.mark.skip(reason="Not implemented yet")
def test_future():
    pass

# Skip if condition
@pytest.mark.skipif(sys.platform == "win32", reason="Unix only")
def test_unix_feature():
    pass

# Expected failure
@pytest.mark.xfail(reason="Known bug #123")
def test_known_bug():
    assert broken_function() == "expected"

# Custom markers
@pytest.mark.slow
def test_large_dataset():
    pass

@pytest.mark.integration
def test_database():
    pass

# Run specific markers
# pytest -m slow
# pytest -m "not slow"
# pytest -m "slow or integration"

# Parametrize
@pytest.mark.parametrize("input, expected", [
    ("1", 1),
    ("42", 42),
    ("-5", -5),
])
def test_parse(input, expected):
    assert int(input) == expected

@pytest.mark.parametrize("x", [1, 2, 3])
@pytest.mark.parametrize("y", [10, 20])
def test_grid(x, y):
    # 6 combinations: (1,10), (1,20), (2,10), (2,20), (3,10), (3,20)
    pass
```

### pytest Plugins

```python
# pytest-cov — coverage
# pytest --cov=mypackage --cov-report=html

# pytest-mock — mocker fixture
def test_function(mocker):
    mock = mocker.patch("module.function")
    mock.return_value = "mocked"
    result = call_function()
    mock.assert_called_once()

# pytest-asyncio — async tests
@pytest.mark.asyncio
async def test_async():
    result = await async_function()
    assert result == "expected"

# pytest-xdist — parallel
# pytest -n auto  (run tests in parallel)

# pytest-benchmark — benchmarks
def test_performance(benchmark):
    result = benchmark(my_function, arg1, arg2)
    assert result is not None
```

## unittest — Standard Library

```python
import unittest

class TestStringMethods(unittest.TestCase):

    def setUp(self):
        self.data = [1, 2, 3]

    def tearDown(self):
        pass

    @classmethod
    def setUpClass(cls):
        cls.db = connect()

    @classmethod
    def tearDownClass(cls):
        cls.db.close()

    def test_upper(self):
        self.assertEqual("hello".upper(), "HELLO")

    def test_isupper(self):
        self.assertTrue("HELLO".isupper())
        self.assertFalse("Hello".isupper())

    def test_split(self):
        s = "hello world"
        self.assertEqual(s.split(), ["hello", "world"])
        with self.assertRaises(TypeError):
            s.split(2)

    def test_in(self):
        self.assertIn(2, self.data)
        self.assertNotIn(5, self.data)

# Assertions
self.assertEqual(a, b)
self.assertNotEqual(a, b)
self.assertTrue(x)
self.assertFalse(x)
self.assertIs(a, b)       # identity
self.assertIsNot(a, b)
self.assertIsNone(x)
self.assertIsNotNone(x)
self.assertIn(a, b)
self.assertNotIn(a, b)
self.assertIsInstance(x, int)
self.assertRaises(ValueError)
self.assertRaisesRegex(ValueError, "message")
self.assertGreater(a, b)
self.assertLess(a, b)
self.assertCountEqual(a, b)  # same elements regardless of order
self.assertDictEqual(a, b)
self.assertListEqual(a, b)
self.assertSetEqual(a, b)
self.assertAlmostEqual(0.1 + 0.2, 0.3, places=7)

# Skip
@unittest.skip("reason")
@unittest.skipIf(condition, "reason")
@unittest.skipUnless(condition, "reason")
@unittest.expectedFailure
def test_something(self):
    pass

# Run
if __name__ == "__main__":
    unittest.main()

# Command line
# python -m unittest test_module
# python -m unittest test_module.TestClass
# python -m unittest test_module.TestClass.test_method
# python -m unittest discover  # auto-discover tests
```

## Mocking

```python
from unittest.mock import Mock, MagicMock, patch, call

# Basic Mock
mock = Mock()
mock.method.return_value = 42
result = mock.method(1, 2)
assert result == 42
mock.method.assert_called_once()
mock.method.assert_called_once_with(1, 2)
mock.method.assert_called_with(1, 2)

# Mock attributes
mock = Mock()
mock.configure_mock(**{"data.value": 10})

# MagicMock — supports magic methods
mock = MagicMock()
mock.__len__.return_value = 5
len(mock)  # 5
mock.__getitem__.return_value = "item"
mock[0]  # "item"

# patch — replace objects
@patch("module.function")
def test(mock_func):
    mock_func.return_value = "mocked"
    result = module.function()
    assert result == "mocked"

# patch as context manager
def test():
    with patch("module.function") as mock_func:
        mock_func.return_value = "mocked"
        result = module.function()
        mock_func.assert_called_once()

# patch multiple
@patch("module.func1")
@patch("module.func2")
def test(mock_func2, mock_func1):  # bottom-up order
    pass

# patch.object
with patch.object(MyClass, "method", return_value=42):
    obj = MyClass()
    assert obj.method() == 42

# side_effect — different return values or exceptions
mock = Mock()
mock.side_effect = [1, 2, 3]  # returns 1, then 2, then 3
mock.side_effect = ValueError("error")  # always raises
mock.side_effect = lambda x: x * 2  # dynamic

# call_args and call_count
mock(1, 2, key="value")
mock.call_args        # call(1, 2, key="value")
mock.call_args_list   # [call(1, 2, key="value")]
mock.call_count       # 1
mock.called           # True

# assert calls
mock.assert_called()
mock.assert_called_once()
mock.assert_not_called()
mock.assert_called_with(1, 2, key="value")
mock.assert_called_once_with(1, 2, key="value")
mock.assert_any_call(1, 2, key="value")
mock.assert_has_calls([call(1), call(2)], any_order=True)

# Autospec — mock with same signature as original
mock = patch("module.function", autospec=True)

# create_autospec
mock_func = create_autospec(original_function)
mock_func.return_value = "mocked"
```

## Coverage

```bash
# Install
pip install pytest-cov

# Run with coverage
pytest --cov=mypackage
pytest --cov=mypackage --cov-report=term-missing
pytest --cov=mypackage --cov-report=html
pytest --cov=mypackage --cov-report=xml
pytest --cov=mypackage --cov-branch  # branch coverage

# Minimum coverage
pytest --cov=mypackage --cov-fail-under=80

# Configuration in pyproject.toml
# [tool.coverage.run]
# source = ["mypackage"]
# branch = true
#
# [tool.coverage.report]
# exclude_lines = [
#     "if __name__ == .__main__.:",
#     "if TYPE_CHECKING:",
#     "raise NotImplementedError",
# ]
```

## doctest

```python
# doctest — test examples in docstrings
def add(a, b):
    """Add two numbers.

    >>> add(1, 2)
    3
    >>> add(-1, 1)
    0
    >>> add(0, 0)
    0
    """
    return a + b

# Run doctests
# python -m doctest -v module.py

# In pytest
# pytest --doctest-modules

# In unittest
import doctest
doctest.testmod()
```

## Hypothesis — Property-Based Testing

```python
# pip install hypothesis
from hypothesis import given, strategies as st, assume

@given(st.integers(), st.integers())
def test_addition_commutative(a, b):
    assert a + b == b + a

@given(st.lists(st.integers()))
def test_sum_non_negative(lst):
    assume(all(x >= 0 for x in lst))
    assert sum(lst) >= 0

@given(st.text())
def test_string_roundtrip(s):
    assert s.encode().decode() == s

# Strategies
st.integers(min_value=0, max_value=100)
st.floats(allow_nan=False)
st.text(min_size=1, max_size=10)
st.lists(st.integers(), min_size=1)
st.dictionaries(st.text(), st.integers())
st.emails()
st.from_regex(r"\d{3}-\d{4}")

# Custom strategy
@st.composite
def valid_user(draw):
    return {
        "name": draw(st.text(min_size=1)),
        "age": draw(st.integers(min_value=0, max_value=150)),
    }

@given(valid_user())
def test_user(user):
    assert len(user["name"]) > 0
    assert 0 <= user["age"] <= 150
```
