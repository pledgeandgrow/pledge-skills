# GeoDjango — Django 6.0

## Overview

GeoDjango is Django's geographic framework for building GIS (Geographic Information System) web applications.

## Installation

```bash
# System dependencies (Ubuntu/Debian)
sudo apt install gdal-bin libgdal-dev geos binutils proj-data libproj-dev

# Python dependencies
pip install GDAL  # If needed
```

```python
# settings.py
INSTALLED_APPS = [
    # ...
    "django.contrib.gis",
]

DATABASES = {
    "default": {
        "ENGINE": "django.contrib.gis.db.backends.postgis",  # PostGIS
        # "ENGINE": "django.contrib.gis.db.backends.spatialite",  # SpatiaLite
        # "ENGINE": "django.contrib.gis.db.backends.mysql",  # MySQL
        # "ENGINE": "django.contrib.gis.db.backends.oracle",  # Oracle
        "NAME": "geo_db",
        # ...
    },
}
```

## Model API

### Spatial Field Types

```python
from django.contrib.gis.db import models

class Place(models.Model):
    name = models.CharField(max_length=100)
    point = models.PointField()           # A point (lon, lat)
    line = models.LineStringField()       # A line
    polygon = models.PolygonField()       # A polygon
    multipoint = models.MultiPointField()
    multiline = models.MultiLineStringField()
    multipolygon = models.MultiPolygonField()
    geom = models.GeometryField()         # Any geometry type
    raster = models.RasterField()         # Raster data
```

### Creating Objects

```python
from django.contrib.gis.geos import Point, LineString, Polygon, GEOSGeometry

# Point (longitude, latitude)
place = Place.objects.create(
    name="Eiffel Tower",
    point=Point(2.2945, 48.8584, srid=4326),
)

# From WKT (Well-Known Text)
point = GEOSGeometry("POINT(2.2945 48.8584)")
line = GEOSGeometry("LINESTRING(0 0, 1 1, 2 2)")
polygon = GEOSGeometry("POLYGON((0 0, 0 10, 10 10, 10 0, 0 0))")

# From GeoJSON
geom = GEOSGeometry('{"type": "Point", "coordinates": [2.2945, 48.8584]}')
```

### Spatial Field Options

```python
class Place(models.Model):
    point = models.PointField(
        srid=4326,           # Spatial Reference System (default 4326 = WGS84)
        geography=True,      # Use geography type (lat/lon calculations)
        dim=2,               # 2D or 3D
    )
```

## Spatial Queries

### Distance Lookups

```python
from django.contrib.gis.measure import D  # Distance
from django.contrib.gis.geos import Point

eiffel = Point(2.2945, 48.8584, srid=4326)

# Within distance (in meters with geography=True)
Place.objects.filter(point__distance_lte=(eiffel, D(km=5)))
Place.objects.filter(point__distance_lt=(eiffel, D(km=1)))
Place.objects.filter(point__distance_gte=(eiffel, D(m=100)))

# Distance in various units
D(km=5)     # 5 kilometers
D(mi=3)     # 3 miles
D(m=100)    # 100 meters
D(ft=500)   # 500 feet
```

### Spatial Lookups

```python
# Containment
Place.objects.filter(polygon__contains=point)
Place.objects.filter(polygon__contains_properly=point)

# Within
Place.objects.filter(point__within=polygon)

### overlaps
Place.objects.filter(polygon__overlaps=other_polygon)

### intersects
Place.objects.filter(polygon__intersects=line)

### touches
Place.objects.filter(polygon__touches=other_polygon)

### crosses
Place.objects.filter(line__crosses=polygon)

### disjoint
Place.objects.filter(point__disjoint=polygon)

### equals
Place.objects.filter(polygon__equals=other_polygon)

### exact / same_as
Place.objects.filter(point__exact=point)

### isempty
Place.objects.filter(polygon__isempty=True)

### isvalid
Place.objects.filter(polygon__isvalid=True)

### relate (DE-9IM pattern)
Place.objects.filter(polygon__relate=(other, "T*T***FF*"))
```

### Bounding Box Lookups

```python
from django.contrib.gis.geos import GEOSGeometry

bbox = GEOSGeometry("POLYGON((0 0, 0 10, 10 10, 10 0, 0 0))")

Place.objects.filter(point__bbcontains=bbox)
Place.objects.filter(point__bboverlaps=bbox)
Place.objects.filter(point__contained=bbox)
Place.objects.filter(point__left=bbox)
Place.objects.filter(point__right=bbox)
Place.objects.filter(point__overlaps_left=bbox)
Place.objects.filter(point__overlaps_right=bbox)
Place.objects.filter(point__overlaps_above=bbox)
Place.objects.filter(point__overlaps_below=bbox)
Place.objects.filter(point__strictly_above=bbox)
Place.objects.filter(point__strictly_below=bbox)
```

### Distance Annotations

```python
from django.contrib.gis.db.models.functions import Distance

# Annotate with distance
places = Place.objects.annotate(
    distance=Distance("point", eiffel),
).order_by("distance")

# Filter and order by distance
nearby = Place.objects.filter(
    point__distance_lte=(eiffel, D(km=5)),
).annotate(
    distance=Distance("point", eiffel),
).order_by("distance")
```

## GIS Database Functions

```python
from django.contrib.gis.db.models.functions import (
    Area, AsGeoJSON, AsGML, AsKML, AsSVG,
    Azimuth, BoundingCircle, Centroid, Difference,
    Distance, Envelope, ForcePolygonCW, GeoHash,
    Intersection, IsValid, Length, MakeValid,
    MemUnion, NumGeometries, NumPoints, Perimeter,
    PointOnSurface, Reverse, Scale, SnapToGrid,
    SymDifference, Transform, Translate, Union,
    Within,
)

# Get area
State.objects.annotate(area=Area("polygon"))

# Get centroid
State.objects.annotate(center=Centroid("polygon"))

# Get GeoJSON
Place.objects.annotate(geojson=AsGeoJSON("point"))

# Transform to different SRID
Place.objects.annotate(
    web_mercator=Transform("point", srid=3857),
)

# Union of all geometries
City.objects.aggregate(union=Union("polygon"))
```

## GEOS API

```python
from django.contrib.gis.geos import (
    Point, LineString, LinearRing, Polygon,
    MultiPoint, MultiLineString, MultiPolygon,
    GeometryCollection, GEOSGeometry,
)

# Create geometry
p = Point(1, 1)
p = Point(1, 1, srid=4326)

# Geometry properties
p.coords       # (1.0, 1.0)
p.x, p.y       # 1.0, 1.0
p.srid         # 4326
p.geom_type    # "Point"
p.dimension    # 0
p.empty        # False
p.valid        # True
p.valid_reason # "Valid Geometry"

# Geometry operations
p.distance(Point(2, 2))  # Distance to another geometry
p.within(polygon)         # Is p within polygon?
p.contains(other_point)   # Does p contain another point?
p.intersects(line)        # Does p intersect line?
p.area                    # Area (0 for points)
p.length                  # Length (0 for points)
p.buffer(0.5)             # Buffer around geometry
p.centroid                # Centroid point
p.envelope                # Bounding box
p.boundary                # Boundary
p.convex_hull             # Convex hull
p.simplify()              # Simplify geometry
p.transform(3857)         # Transform SRID
p.union(other_geom)       # Union
p.intersection(other)     # Intersection
p.difference(other)       # Difference
p.sym_difference(other)   # Symmetric difference

# WKT/WKB I/O
p.wkt    # "POINT (1 1)"
p.wkb    # Binary WKB
p.hexewkb # Hex EWKB
p.geojson # '{"type": "Point", "coordinates": [1, 1]}'
```

## GIS Forms

```python
from django.contrib.gis import forms

class PlaceForm(forms.Form):
    point = forms.PointField(widget=forms.OSMWidget(
        attrs={"map_width": 800, "map_height": 500},
    ))
    polygon = forms.PolygonField()
    geom = forms.GeometryField()

# OSMWidget — OpenStreetMap-based map widget
# LeafletWidget — Leaflet.js map (requires django-leaflet)
```

## GIS Admin

```python
from django.contrib.gis.admin import GISModelAdmin

@admin.register(Place)
class PlaceAdmin(GISModelAdmin):
    list_display = ("name",)
    gis_widget_kwargs = {
        "attrs": {
            "map_width": 800,
            "map_height": 500,
            "default_lat": 48.8584,
            "default_lon": 2.2945,
            "default_zoom": 10,
        },
    }
```

## Measurement API

```python
from django.contrib.gis.measure import D, Distance
from django.contrib.gis.measure import A, Area

# Distance
d = D(km=5)
d.km   # 5.0
d.m    # 5000.0
d.mi   # 3.10686...
d.ft   # 16404.2...

# Area
a = A(ha=10)  # 10 hectares
a.sq_km  # 0.1
a.sq_m   # 100000.0
a.acres  # 24.7105...
```

## LayerMapping (Data Import)

```python
from django.contrib.gis.utils import LayerMapping
from .models import WorldBorder

world_mapping = {
    "fips": "FIPS",
    "iso2": "ISO2",
    "name": "NAME",
    "pop2005": "POP2005",
    "geom": "POLYGON",
}

lm = LayerMapping(
    WorldBorder,
    "data/TM_WORLD_BORDERS.shp",
    world_mapping,
    transform=False,
)
lm.save(verbose=True)
```

## GeoJSON Serializer

```python
from django.core.serializers import serialize

# Serialize model instances as GeoJSON
geojson = serialize(
    "geojson",
    Place.objects.all(),
    geometry_field="point",
    fields=("name",),
)
```
