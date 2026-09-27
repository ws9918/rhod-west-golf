#!/usr/bin/env python3
"""Turn the per-state Overpass dumps into us-courses.js.

Rows are [name, state-code, lat, lng, extras?]; state names live in one table
rather than being repeated ~13,000 times.  extras is omitted when OSM knows
nothing else about the course, and otherwise carries only the facts that change
whether you'd stop there:  h holes, p par, a access (1 = private),
c town, w website (scheme and www. stripped), q wikidata id.
"""
import json, os, re, sys, glob

RAW, OUT = sys.argv[1], sys.argv[2]
STATES = {
 "AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado",
 "CT":"Connecticut","DE":"Delaware","DC":"DC","FL":"Florida","GA":"Georgia","HI":"Hawaii",
 "ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas","KY":"Kentucky",
 "LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan",
 "MN":"Minnesota","MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska",
 "NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico","NY":"New York",
 "NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon",
 "PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota",
 "TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia","WA":"Washington",
 "WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming"}

SKIP = re.compile(r"\b(driving range|practice (range|area|facility)|putt[- ]?putt|mini(ature)? golf|"
                  r"foot ?golf|disc golf|frisbee golf|golf dome|topgolf)\b", re.I)
# a chipping green or a learning centre is not somewhere you play a round --
# unless the name also says it is a club or a course, in which case it is one
PRACTICE = re.compile(r"(chipping|putting|practice)\s+green\s*$|"
                      r"\b(golf\s+academy|learning\s+cent(er|re)|short\s+game\s+(area|cent(er|re)))\b", re.I)
PLAYABLE = re.compile(r"\b(club|course|links|resort|national)\b", re.I)
PART = re.compile(r"^\s*(#|hole\b|no\.?\s*\d)|^\s*\d+\s*(st|nd|rd|th)?\s*(tee|green|fairway|bunker)\b", re.I)
SUBFEATURE = {"tee","green","fairway","bunker","rough","driving_range","clubhouse","pin","hole",
              "water_hazard","lateral_water_hazard","path","cartpath"}
PRIVATE = {"private","permit","members","residents","restricted","no"}

def holes(t):
    for k in ("golf:course","holes","golf:holes"):
        v = (t.get(k) or "").strip().lower()
        m = re.match(r"^(\d+)", v)
        if m:
            n = int(m.group(1))
            if 3 <= n <= 90: return n
    return None

def par(t):
    m = re.match(r"^\s*(\d+)", (t.get("golf:par") or ""))
    if m and 26 <= int(m.group(1)) <= 160: return int(m.group(1))
    return None

def site(t):
    u = (t.get("website") or t.get("contact:website") or "").strip()
    if not u or " " in u: return None
    u = re.sub(r"^https?://", "", u, flags=re.I).rstrip("/")
    if not re.match(r"^[\w.-]+\.[a-z]{2,}", u, re.I) or len(u) > 70: return None
    return u

rows, seen, per_state, dropped = [], {}, {}, {"unnamed":0, "skip":0, "practice":0, "dupe":0}
have = {"h":0,"p":0,"a":0,"c":0,"w":0,"q":0}
for f in sorted(glob.glob(os.path.join(RAW, "*.json"))):
    code = os.path.basename(f)[:-5]
    if code not in STATES: continue
    try: els = json.load(open(f))["elements"]
    except Exception as e:
        print("  !! unreadable", code, e); continue
    n0 = len(rows)
    for e in els:
        t = e.get("tags") or {}
        name = " ".join((t.get("name") or "").split())
        if not name: dropped["unnamed"] += 1; continue
        g = (t.get("golf") or "").strip().lower()
        if g in SUBFEATURE or g.startswith("#") or SKIP.search(name) or PART.match(name) or len(name) < 3:
            dropped["skip"] += 1; continue
        if PRACTICE.search(name) and not PLAYABLE.search(name):
            dropped["practice"] += 1; continue
        c = e.get("center") or e
        lat, lon = c.get("lat"), c.get("lon")
        if lat is None or lon is None: dropped["unnamed"] += 1; continue
        key = (re.sub(r"[^a-z0-9]", "", name.lower()), round(lat, 2), round(lon, 2))
        if key in seen:
            dropped["dupe"] += 1
            # a second element for a course we already have may know more than the first
            ex = seen[key]
            for k, v in (("h",holes(t)),("p",par(t)),("c",(t.get("addr:city") or "").strip() or None),("w",site(t))):
                if v is not None and k not in ex: ex[k] = v; have[k] += 1
            continue
        ex = {}
        v = holes(t)
        if v: ex["h"] = v
        v = par(t)
        if v: ex["p"] = v
        if (t.get("access") or "").strip().lower() in PRIVATE: ex["a"] = 1
        v = (t.get("addr:city") or "").strip()
        if v and len(v) < 40: ex["c"] = " ".join(v.split())
        v = site(t)
        if v: ex["w"] = v
        v = (t.get("wikidata") or "").strip()
        if re.match(r"^Q\d+$", v): ex["q"] = int(v[1:])
        for k in ex: have[k] += 1
        seen[key] = ex
        rows.append([name, code, round(lat, 4), round(lon, 4), ex])
    per_state[code] = len(rows) - n0

rows.sort(key=lambda r: (r[1], r[0]))
KEYS = ("h","p","a","c","w","q")
def enc(r):
    ex = r[4]
    body = json.dumps(r[:4], ensure_ascii=False)[:-1]
    if not ex: return body + "]"
    bits = ",".join("%s:%s" % (k, json.dumps(ex[k], ensure_ascii=False)) for k in KEYS if k in ex)
    return body + ",{" + bits + "}]"

used = {c: STATES[c] for c in sorted(per_state)}
body = ",\n".join(enc(r) for r in rows)
js = ("/* Every golf course in the United States, from OpenStreetMap (leisure=golf_course).\n"
      "   Open data under the ODbL: © OpenStreetMap contributors, credited on the map.\n"
      "   Rows are [name, state, lat, lng, extras?]; extras keys: h holes, p par,\n"
      "   a access (1 = private), c town, w website, q wikidata id.\n"
      "   Rebuild with scratchpad/osm/pull.sh + build2.py. */\n"
      "window.USGOLF={v:2,src:\"OpenStreetMap\",n:%d,\nstates:%s,\nrows:[\n%s\n]};\n"
      % (len(rows), json.dumps(used, ensure_ascii=False), body))
open(OUT, "w", encoding="utf-8").write(js)

print("states:", len(per_state), " courses:", len(rows))
print("dropped:", dropped)
print("with extras:", " ".join("%s:%d" % (k, have[k]) for k in KEYS))
print("bytes:", os.path.getsize(OUT))
