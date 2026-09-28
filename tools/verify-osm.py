#!/usr/bin/env python3
"""Flag states whose Overpass result looks truncated.

Overpass sometimes answers 200 with a partial result. The tell is geography: the
courses it returned cover only a corner of the state. Compare the span of the
results against the state's own bounding box and flag anything that covers less
than THRESH of it in either axis."""
import json, glob, os, sys

THRESH = 0.55
# States whose courses really are clustered, or that are too small for a coverage
# test to say anything: Alaska's are all south-central, DC is one city, the island
# and pocket states have no spread to measure. These only have to be non-empty.
CLUSTERED = {"DC": 3, "AK": 10, "HI": 20, "RI": 8, "DE": 15}
# west, south, east, north — approximate state bounds, generous on purpose
BBOX = {
"AL":(-88.5,30.1,-84.8,35.1),"AK":(-179.9,51.2,179.9,71.5),"AZ":(-114.9,31.3,-109.0,37.1),
"AR":(-94.7,33.0,-89.6,36.5),"CA":(-124.5,32.5,-114.1,42.1),"CO":(-109.1,36.9,-102.0,41.1),
"CT":(-73.8,40.9,-71.7,42.1),"DE":(-75.8,38.4,-74.9,39.9),"DC":(-77.2,38.7,-76.9,39.0),
"FL":(-87.7,24.4,-79.9,31.1),"GA":(-85.7,30.3,-80.8,35.1),"HI":(-160.3,18.8,-154.7,22.3),
"ID":(-117.3,41.9,-111.0,49.0),"IL":(-91.6,36.9,-87.0,42.6),"IN":(-88.1,37.7,-84.7,41.8),
"IA":(-96.7,40.3,-90.1,43.6),"KS":(-102.1,36.9,-94.5,40.1),"KY":(-89.6,36.4,-81.9,39.2),
"LA":(-94.1,28.9,-88.7,33.1),"ME":(-71.1,42.9,-66.9,47.5),"MD":(-79.5,37.8,-74.9,39.8),
"MA":(-73.6,41.2,-69.9,42.9),"MI":(-90.5,41.6,-82.1,48.4),"MN":(-97.3,43.4,-89.4,49.4),
"MS":(-91.7,30.1,-88.1,35.1),"MO":(-95.8,35.9,-89.0,40.7),"MT":(-116.1,44.3,-104.0,49.1),
"NE":(-104.1,39.9,-95.3,43.1),"NV":(-120.1,35.0,-114.0,42.1),"NH":(-72.6,42.6,-70.6,45.4),
"NJ":(-75.6,38.9,-73.8,41.4),"NM":(-109.1,31.3,-103.0,37.1),"NY":(-79.8,40.4,-71.8,45.1),
"NC":(-84.4,33.8,-75.4,36.6),"ND":(-104.1,45.9,-96.5,49.1),"OH":(-84.9,38.4,-80.5,42.4),
"OK":(-103.1,33.6,-94.4,37.1),"OR":(-124.6,41.9,-116.4,46.3),"PA":(-80.6,39.7,-74.6,42.3),
"RI":(-71.9,41.1,-71.1,42.1),"SC":(-83.4,32.0,-78.5,35.3),"SD":(-104.1,42.4,-96.4,46.0),
"TN":(-90.4,34.9,-81.6,36.7),"TX":(-106.7,25.8,-93.5,36.6),"UT":(-114.1,36.9,-109.0,42.1),
"VT":(-73.5,42.7,-71.4,45.1),"VA":(-83.7,36.5,-75.2,39.5),"WA":(-124.8,45.5,-116.9,49.1),
"WV":(-82.7,37.2,-77.7,40.7),"WI":(-92.9,42.4,-86.8,47.1),"WY":(-111.1,40.9,-104.0,45.1)}

raw = sys.argv[1]
bad, ok = [], 0
for st in sorted(BBOX):
    f = os.path.join(raw, st + ".json")
    if not os.path.exists(f): bad.append((st, "missing")); continue
    try: els = json.load(open(f))["elements"]
    except Exception: bad.append((st, "unreadable")); continue
    pts = [(e.get("center") or e) for e in els if (e.get("tags") or {}).get("name")]
    pts = [(p["lat"], p["lon"]) for p in pts if p.get("lat") is not None]
    if st in CLUSTERED:
        if len(pts) < CLUSTERED[st]: bad.append((st, "only %d courses" % len(pts)))
        else: ok += 1
        continue
    if len(pts) < 5: bad.append((st, "only %d courses" % len(pts))); continue
    w, s, e, n = BBOX[st]
    cov_lat = (max(p[0] for p in pts) - min(p[0] for p in pts)) / (n - s)
    cov_lng = (max(p[1] for p in pts) - min(p[1] for p in pts)) / (e - w)
    if min(cov_lat, cov_lng) < THRESH:
        bad.append((st, "%d courses cover only %.0f%%x%.0f%% of the state" % (len(pts), cov_lat*100, cov_lng*100)))
    else: ok += 1

print("complete:", ok, " suspect:", len(bad))
for st, why in bad: print("  %-3s %s" % (st, why))
open(os.path.join(raw, "..", "suspect.txt"), "w").write(" ".join(st for st, _ in bad))
