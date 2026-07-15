# Networking

---

## Using Fetch

```tsx
// GET request
const getMovies = async () => {
  try {
    const response = await fetch('https://reactnative.dev/movies.json');
    const json = await response.json();
    return json.movies;
  } catch (error) {
    console.error(error);
  }
};

// POST request
fetch('https://mywebsite.com/endpoint/', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstParam: 'yourValue',
    secondParam: 'yourOtherValue',
  }),
});
```

## Using XMLHttpRequest

```tsx
const request = new XMLHttpRequest();
request.onreadystatechange = e => {
  if (request.readyState !== 4) return;
  if (request.status === 200) {
    console.log('success', request.responseText);
  } else {
    console.warn('error');
  }
};
request.open('GET', 'https://mywebsite.com/endpoint/');
request.send();
```

No CORS in native apps — XMLHttpRequest security model differs from web.

## WebSocket Support

```tsx
const ws = new WebSocket('ws://host.com/path');
ws.onopen = () => ws.send('something');
ws.onmessage = e => console.log(e.data);
ws.onerror = e => console.log(e.message);
ws.onclose = e => console.log(e.code, e.reason);
```

## Known Issues with fetch

- `redirect:manual` not working
- `credentials:omit` not working
- Same name headers on Android → only latest present
- Cookie based authentication unstable (especially iOS 302 redirects with Set-Cookie)

## Platform Security Notes

- **iOS 9+:** App Transport Security (ATS) requires HTTPS. Add ATS exception for HTTP.
- **Android API 28+:** Clear text traffic blocked by default. Override with `android:usesCleartextTraffic`.
