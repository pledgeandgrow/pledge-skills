# Redis Geospatial Indexes

Redis geospatial indexes allow storing and querying geographic coordinates (latitude/longitude).

---

## Adding Locations

```bash
# GEOADD key longitude latitude member [longitude latitude member ...]
GEOADD places 2.3522 48.8566 "Paris" 13.4050 52.5200 "Berlin" -0.1276 51.5074 "London"

# Add with condition (Redis 6.2+)
GEOADD places NX 9.1898 45.4642 "Milan"     # only if member doesn't exist
GEOADD places CH 2.3522 48.8567 "Paris"      # update if exists, return changed count
```

---

## Querying

### Distance

```bash
# Distance between two members (meters by default)
GEODIST places Paris London
GEODIST places Paris London km
GEODIST places Paris London mi
GEODIST places Paris London ft
```

### Position

```bash
# Get coordinates of members
GEOPOS places Paris London
```

### Hash

```bash
# Geohash string
GEOHASH places Paris London
```

---

## Radius Search (deprecated, use GEOSEARCH)

```bash
# Find members within radius (deprecated in 6.2)
GEORADIUS places 2.3522 48.8566 500 km
GEORADIUS places 2.3522 48.8566 500 km WITHCOORD WITHDIST WITHHASH
GEORADIUS places 2.3522 48.8566 500 km COUNT 10 ASC
GEORADIUS places 2.3522 48.8566 500 km STORE store_key
```

---

## GEOSEARCH (Redis 6.2+)

```bash
# Search from a member's position
GEOSEARCH places FROMMEMBER Paris BYRADIUS 500 km ASC COUNT 10

# Search from coordinates
GEOSEARCH places FROMLONLAT 2.3522 48.8566 BYRADIUS 500 km

# Search within a box (width height)
GEOSEARCH places FROMLONLAT 2.3522 48.8566 BYBOX 1000 800 km

# With additional info
GEOSEARCH places FROMMEMBER Paris BYRADIUS 500 km WITHCOORD WITHDIST WITHHASH

# Sort and limit
GEOSEARCH places FROMMEMBER Paris BYRADIUS 500 km ASC COUNT 5
GEOSEARCH places FROMMEMBER Paris BYRADIUS 500 km DESC COUNT 5

# Any direction (no sorting)
GEOSEARCH places FROMMEMBER Paris BYRADIUS 500 km COUNT 10
```

### GEOSEARCHSTORE

```bash
# Store results in a new key
GEOSEARCHSTORE results places FROMMEMBER Paris BYRADIUS 500 km ASC COUNT 10

# Store with distance
GEOSEARCHSTORE results places FROMMEMBER Paris BYRADIUS 500 km WITHDIST ASC COUNT 10
```

---

## Use Cases

### Nearby Places

```bash
# Add restaurants
GEOADD restaurants 2.3200 48.8600 "Le Bistro" 2.3400 48.8500 "Cafe de Paris" 2.3300 48.8700 "Pizza Roma"

# Find restaurants within 2km of a point
GEOSEARCH restaurants FROMLONLAT 2.3350 48.8600 BYRADIUS 2 km ASC WITHDIST
```

### Driver Tracking

```bash
# Update driver location
GEOADD drivers:active 2.3522 48.8566 "driver:100"

# Find nearest drivers to a passenger
GEOSEARCH drivers:active FROMLONLAT 2.3500 48.8550 BYRADIUS 5 km ASC COUNT 5 WITHCOORD WITHDIST
```

### Store Locator

```bash
# Add stores
GEOADD stores -122.4194 37.7749 "SF Store" -73.9857 40.7484 "NYC Store" -87.6501 41.8500 "Chicago Store"

# Find stores within 100km of user
GEOSEARCH stores FROMLONLAT -122.4000 37.7800 BYRADIUS 100 km WITHCOORD WITHDIST
```

---

## Removing Members

```bash
# Remove a member from the geo index
ZREM places Paris

# The geo index is backed by a sorted set, so ZREM works
```

---

## Python Examples

```python
r.geoadd('places', [(2.3522, 48.8566, 'Paris'), (13.4050, 52.5200, 'Berlin')])

# Search
results = r.geosearch('places', longitude=2.3522, latitude=48.8566, radius=500, unit='km', sortby='ASC', count=10)

# Distance
dist = r.geodist('places', 'Paris', 'London', unit='km')

# Position
pos = r.geopos('places', 'Paris')
```

---

## JavaScript Examples

```js
await client.geoAdd('places', [
  { longitude: 2.3522, latitude: 48.8566, member: 'Paris' },
  { longitude: 13.4050, latitude: 52.5200, member: 'Berlin' },
]);

const results = await client.geoSearch('places', {
  fromMember: 'Paris',
  byRadius: 500,
  unit: 'km',
  sort: 'ASC',
  count: 10,
});

const dist = await client.geoDist('places', 'Paris', 'London', 'km');
```

---

## Limitations

- Coordinates must be within valid ranges: longitude [-180, 180], latitude [-85.05112878, 85.05112878]
- Maximum precision: ~0.5% error in distance calculations
- Geo indexes are backed by sorted sets (score = geohash)
- No support for polygon searches (only circles and boxes)
- `GEORADIUS` and `GEORADIUSBYMEMBER` are deprecated — use `GEOSEARCH`

---

## Performance

| Operation | Complexity |
|-----------|------------|
| `GEOADD` | O(log N) per member |
| `GEODIST` | O(log N) |
| `GEOSEARCH` | O(N + log N) where N is results count |
| `GEOPOS` | O(log N) per member |
| `GEOHASH` | O(log N) per member |
