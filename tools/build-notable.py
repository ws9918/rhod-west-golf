#!/usr/bin/env python3
"""Turn the fetched Wikipedia golf infoboxes into notable.js.

Only US courses (by coordinate box) and only the facts that help you choose a
stop: who designed it, when it opened, whether you can get on, and the
tournaments it has hosted.  Everything here is quoted from the article's own
infobox -- nothing is inferred."""
import json, re, os, sys, math, collections

RAW, OUT = sys.argv[1], sys.argv[2]
NAME_RE = re.compile(r"[^a-z0-9]")

def strip(s):
    if not s: return ""
    s = re.sub(r"<ref[^>]*?/>", "", s)
    s = re.sub(r"<ref.*?</ref>", "", s, flags=re.S|re.I)
    s = re.sub(r"<!--.*?-->", "", s, flags=re.S)
    s = re.sub(r"\{\{\s*(convert|cvt)\s*\|([^|}]*)\|([^|}]*)[^}]*\}\}", r"\2 \3", s, flags=re.I)
    s = re.sub(r"\{\{\s*(nowrap|nobr|small)\s*\|([^{}]*)\}\}", r"\2", s, flags=re.I)
    s = re.sub(r"\{\{\s*(break|br|-|crlf|plainlist|plain list|ubl|unbulleted list)\s*(\|)?", "; ", s, flags=re.I)
    s = re.sub(r"\{\{[^{}]*\}\}", " ", s)          # any remaining simple template
    s = re.sub(r"\[\[[^\]|]*\|([^\]]*)\]\]", r"\1", s)
    s = re.sub(r"\[\[([^\]]*)\]\]", r"\1", s)
    s = re.sub(r"\[https?://\S+\s+([^\]]*)\]", r"\1", s)
    s = re.sub(r"\[https?://\S+\]", "", s)
    s = re.sub(r"<br\s*/?>", "; ", s, flags=re.I)
    s = re.sub(r"<[^>]+>", "", s)
    s = s.replace("&nbsp;", " ").replace("&ndash;", "-").replace("&mdash;", "-").replace("&amp;", "&")
    s = re.sub(r"'{2,}", "", s)
    s = re.sub(r"\s*[*\u2022]+\s*", "; ", s)      # a bulleted list is still a list
    s = re.sub(r"[{}\[\]|]+", " ", s)             # stray markup from a template we unwrapped
    s = re.sub(r"\s+", " ", s).strip(" ;,-")
    return s

def fields(wt):
    """Split the infobox into |key = value pairs, ignoring nested braces."""
    m = re.search(r"\{\{\s*Infobox golf (facility|course)", wt, re.I)
    if not m: return {}
    i, depth, buf = m.end(), 1, []
    while i < len(wt) and depth:
        c = wt[i]
        if wt.startswith("{{", i): depth += 1; buf.append("{{"); i += 2; continue
        if wt.startswith("}}", i):
            depth -= 1
            if not depth: break
            buf.append("}}"); i += 2; continue
        buf.append(c); i += 1
    body = "".join(buf)
    out, d, cur = {}, 0, ""
    for ch in body + "|":
        if ch == "|" and d == 0:
            if "=" in cur:
                k, v = cur.split("=", 1)
                out[k.strip().lower()] = v.strip()
            cur = ""; continue
        if ch == "{" or ch == "[": d += 1
        elif ch == "}" or ch == "]": d = max(0, d-1)
        cur += ch
    return out

def year(f):
    for k in ("established", "opened", "built", "constructed"):
        v = f.get(k) or ""
        m = re.search(r"\|\s*(1[6-9]\d\d|20\d\d)\b", v) or re.search(r"\b(1[6-9]\d\d|20\d\d)\b", strip(v))
        if m: return int(m.group(1))
    return None

TYPE = [("resort", r"\bresort\b"), ("public", r"\bpublic|municipal|muni\b"),
        ("semi", r"\bsemi[- ]?private\b"), ("private", r"\bprivate\b"), ("daily", r"\bdaily[- ]fee\b")]
def kind(f):
    t = strip(f.get("type") or "").lower()
    if not t: return None
    if re.search(r"semi[- ]?private", t): return "semi-private"
    for lbl, pat in TYPE:
        if re.search(pat, t): return {"semi":"semi-private","daily":"daily fee"}.get(lbl, lbl)
    return None

BAD_DESIGNER = re.compile(r"^(unknown|n/?a|tbd|various|see below|original|redesign|"
                          r"first nine|second nine|front nine|back nine|\d+)?$", re.I)
RENO = re.compile(r"\b(renovat|restor|remodel|redesign|rebuil|revis|update)", re.I)
# "Hugh Wilson (1912) Gil Hanse & Jim Wagner (2014 renovation)" is two designers,
# not one -- the year in brackets is doing the work a line break should have done.
SPLIT_AFTER_YEAR = re.compile(r"(?<=\))[\s,]+(?=[A-Z\d])")

def designers(f):
    """designerN, tied to courseN where the article names its courses."""
    out = []
    for i in range(0, 30):
        sfx = str(i) if i else ""
        rawv = f.get("designer" + sfx)
        if not rawv: continue
        scope = strip(f.get("course" + sfx) or "")
        if len(scope) > 60: scope = ""
        # keep the line breaks the article used, then split runs the editor ran together
        segs = []
        for line in strip(rawv).split(";"):
            segs += [x for x in SPLIT_AFTER_YEAR.split(line.strip()) if x.strip()]
        pend = None
        for seg in segs:
            seg = seg.strip(" ,")
            if pend is not None:                      # "Leroy Culver:" then "First Nine"
                if seg and len(seg) < 40 and not seg.endswith(":"):
                    out.append([pend, seg if not scope else scope, 0]); pend = None; continue
                out.append([pend, scope, 0]); pend = None
            if seg.endswith(":"):
                nm = seg[:-1].strip()
                if nm and not BAD_DESIGNER.match(nm): pend = nm
                continue
            reno = 1 if RENO.search(seg) else 0
            nm = re.sub(r"\s*\((?!\d)[^)]*\)", "", seg)            # "(renovation)" with no year
            nm = re.sub(r"\s*\(\s*\d{4}[^)]*\)", "", nm).strip(" ,;.")
            nm = re.sub(r"^(designed by|architect|designer)s?:?\s*", "", nm, flags=re.I).strip(" ,;")
            if not nm or BAD_DESIGNER.match(nm) or len(nm) > 70: continue
            nm = re.sub(r"[\s,]+(and|with|&|plus)$", "", nm, flags=re.I).strip(" ,;&")
            if not nm or BAD_DESIGNER.match(nm) or not re.search(r"[A-Za-z]{3}", nm): continue
            out.append([nm, scope, reno])
        if pend is not None: out.append([pend, scope, 0])
    seen, uniq = set(), []
    for nm, sc, rv in out:
        k = (nm.lower(), sc.lower())
        if k in seen: continue
        seen.add(k); uniq.append([nm, sc] if not rv else [nm, sc, 1])
    # the original architects first: they are the reason you'd drive there
    uniq.sort(key=lambda e: len(e) > 2)
    return uniq[:6]

TOURN = re.compile(r"(U\.?S\.? Open|U\.?S\.? Women's Open|U\.?S\.? Amateur|PGA Championship|The Open Championship|"
                   r"Masters Tournament|Ryder Cup|Presidents Cup|Solheim Cup|Walker Cup|Curtis Cup|"
                   r"U\.?S\.? Senior Open|Women's PGA Championship|KPMG Women's PGA|The Players Championship|"
                   r"WGC[- ]|Tour Championship|FedEx|U\.?S\.? Junior Amateur|Western Open|Wanamaker)", re.I)
CANON = {"us open":"U.S. Open","u.s. open":"U.S. Open","the open championship":"The Open Championship"}
def majors(f):
    t = strip(f.get("tournaments") or "")
    if not t: return []
    out, seen = [], set()
    for part in re.split(r"[;,]| and ", t):
        part = part.strip(" .")
        m = TOURN.search(part)
        if not m: continue
        nm = re.sub(r"^U\.?S\.?", "U.S.", m.group(1).strip("- "), flags=re.I)
        if nm.lower() in seen: continue
        seen.add(nm.lower()); out.append(nm)
    return out[:4]

DEC = re.compile(r"\{\{\s*coord\s*\|\s*(-?\d+(?:\.\d+)?)\s*\|\s*(-?\d+(?:\.\d+)?)\s*[|}]", re.I)
DMS = re.compile(r"\{\{\s*coord\s*\|\s*(\d+)\s*\|\s*(\d+(?:\.\d+)?)\s*(?:\|\s*(\d+(?:\.\d+)?)\s*)?\|\s*([NS])\s*"
                 r"\|\s*(\d+)\s*\|\s*(\d+(?:\.\d+)?)\s*(?:\|\s*(\d+(?:\.\d+)?)\s*)?\|\s*([EW])", re.I)
DECH = re.compile(r"\{\{\s*coord\s*\|\s*(\d+(?:\.\d+)?)\s*\|\s*([NS])\s*\|\s*(\d+(?:\.\d+)?)\s*\|\s*([EW])", re.I)
def coords(wt):
    wt = re.sub(r"<!--.*?-->", "", wt, flags=re.S)
    m = DECH.search(wt)
    if m:
        la, lo = float(m.group(1)), float(m.group(3))
        if m.group(2).upper() == "S": la = -la
        if m.group(4).upper() == "W": lo = -lo
        return la, lo
    m = DMS.search(wt)
    if m:
        g = m.groups()
        la = int(g[0]) + float(g[1])/60 + (float(g[2]) if g[2] else 0)/3600
        lo = int(g[4]) + float(g[5])/60 + (float(g[6]) if g[6] else 0)/3600
        if g[3].upper() == "S": la = -la
        if g[7].upper() == "W": lo = -lo
        return la, lo
    m = DEC.search(wt)
    if m:
        la, lo = float(m.group(1)), float(m.group(2))
        if -90 <= la <= 90 and -180 <= lo <= 180: return la, lo
    return None, None

# Join to the OpenStreetMap dataset: it is the app's spine, so a Wikipedia row
# that lands on an OSM course inherits that course's name and state and is
# certainly in the US.  Rows with nowhere to land have to prove they are
# American from their own coordinates.
US_ROWS = []
if len(sys.argv) > 3:
    js = open(sys.argv[3], encoding="utf-8").read()
    body = js[js.index("rows:[")+6 : js.rindex("]}")]
    for line in body.splitlines():
        line = line.strip().rstrip(",")
        if not line.startswith("["): continue
        m = re.match(r'\[("(?:[^"\\]|\\.)*"),\s*"([A-Z]{2})",\s*(-?[\d.]+),\s*(-?[\d.]+)', line)
        if m: US_ROWS.append((json.loads(m.group(1)), m.group(2), float(m.group(3)), float(m.group(4))))
print("osm rows for the join:", len(US_ROWS))

GRID = {}
for nm, st, la, lo in US_ROWS:
    GRID.setdefault((round(la*4), round(lo*4)), []).append((nm, st, la, lo))
def tokens(n):
    drop = {"the","golf","club","course","courses","cc","gc","links","country","at","of","and","resort","no"}
    return {w for w in NAME_RE.sub(" ", n.lower()).split() if w and w not in drop}
BY_TOK = {}
def build_tok():
    for nm, st, la, lo in US_ROWS:
        BY_TOK.setdefault(" ".join(sorted(tokens(nm))), []).append((nm, st, la, lo))
def by_name(name):
    """the one US course with this name, or nothing -- a tie is no answer at all"""
    if not BY_TOK: build_tok()
    hits = BY_TOK.get(" ".join(sorted(tokens(name))) ) or []
    return hits[0] if len(hits) == 1 else None
def scope_match(la, lo, base, scope):
    """The OSM course a multi-course article means by "Dogwood Course".

    Resorts are the places worth a detour, and an article that names each of its
    courses knows who built each one -- so Bandon Trails should say Coore and
    Crenshaw, not whoever built Bandon Dunes."""
    mark = tokens(scope) - tokens(base)
    if not mark: return None
    best, bd = None, 6.0
    for dla in range(-2, 3):
        for dlo in range(-2, 3):
            for nm, st, a, o in GRID.get((round(la*4)+dla, round(lo*4)+dlo), []):
                have = tokens(nm)
                if not (mark <= have): continue
                d = math.hypot((a-la)*69.055, (o-lo)*69.172*math.cos(la*math.pi/180))
                if d < bd: bd, best = d, (nm, st, a, o)
    return best

def nearest(la, lo, name):
    """the OSM course this article is about: close by, and the names agree"""
    want, best, bd = tokens(name), None, 4.0
    for dla in (-1,0,1):
        for dlo in (-1,0,1):
            for nm, st, a, o in GRID.get((round(la*4)+dla, round(lo*4)+dlo), []):
                d = ((a-la)*69.055)**2 + ((o-lo)*69.172*math.cos(la*math.pi/180))**2
                d = math.sqrt(d)
                if d > bd: continue
                have = tokens(nm)
                if want and have and not (want & have): continue
                bd, best = d, (nm, st, a, o)
    return best

def lead_with(d, name):
    """Pinehurst No. 2 is a Donald Ross course even though the article starts at No. 1."""
    if len(d) < 2: return d
    want = tokens(name)
    if not want: return d
    def hit(e):
        sc = tokens(e[1]) if len(e) > 1 and e[1] else set()
        return 1 if sc and (sc <= want or len(sc & want) >= max(1, len(sc) - 1)) else 0
    if not any(hit(e) for e in d): return d
    mine = [e for e in d if hit(e) or not (len(e) > 1 and e[1])]
    return sorted(mine, key=lambda e: len(e) > 2)

raw = json.load(open(RAW))
rows, stats = [], collections.Counter()
for title, rec in sorted(raw.items()):
    wt = rec.get("wt") or ""
    lat, lng = rec.get("lat"), rec.get("lng")
    if lat is None: lat, lng = coords(wt)
    f = fields(wt)
    if not f: stats["no infobox"] += 1; continue
    name = strip(f.get("name") or "") or re.sub(r"\s*\([^)]*\)$", "", title)
    st = None
    if lat is None:
        hit = by_name(name)
        if not hit: stats["no coords"] += 1; continue
        name, st, lat, lng = hit; stats["named into OSM"] += 1
        d, y, k, mj = designers(f), year(f), kind(f), majors(f)
        if not (d or y or k or mj): stats["nothing useful"] += 1; continue
        r = {"n": name, "s": st, "lat": round(lat, 4), "lng": round(lng, 4)}
        if d: r["d"] = d; stats["designer"] += 1
        if y: r["y"] = y; stats["year"] += 1
        if k: r["k"] = k; stats["type"] += 1
        if mj: r["m"] = mj; stats["tournaments"] += 1
        if title != name: r["t"] = title
        rows.append(r); continue
    hit = nearest(lat, lng, name) if US_ROWS else None
    if hit:
        name, st, lat, lng = hit          # speak the dataset's names, so lookups line up
        stats["joined to OSM"] += 1
    else:
        # no OSM course here, so the article has to look American on its own:
        # lower 48 south of the border, Alaska, or Hawaii
        if not ((24 <= lat <= 49 and -125 <= lng <= -66) or (51 <= lat <= 72 and -170 <= lng <= -129)
                or (18 <= lat <= 23 and -161 <= lng <= -154)):
            stats["not US"] += 1; continue
        loc = strip(f.get("location") or "") + " " + strip(f.get("pushpin_map") or "")
        if not re.search(r"\b(U\.?S\.?A?\b|United States|Alabama|Alaska|Arizona|Arkansas|California|Colorado|"
                         r"Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|"
                         r"Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|"
                         r"Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|"
                         r"Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|"
                         r"Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming)\b", loc, re.I):
            stats["not US"] += 1; continue
        stats["US by coords only"] += 1
    d_all, y, k, mj = designers(f), year(f), kind(f), majors(f)
    d = lead_with(d_all, name)
    if not (d or y or k or mj): stats["nothing useful"] += 1; continue
    r = {"n": name, "lat": round(lat, 4), "lng": round(lng, 4), "_all": d_all}
    if st: r["s"] = st
    if title != name: r["t"] = title
    if d: r["d"] = d; stats["designer"] += 1
    if y: r["y"] = y; stats["year"] += 1
    if k: r["k"] = k; stats["type"] += 1
    if mj: r["m"] = mj; stats["tournaments"] += 1
    rows.append(r)

# one row per named course, so each gets its own architect
if US_ROWS:
    taken = {r["n"] for r in rows}
    extra = []
    for r in list(rows):
        d = r.get("_all") or r.get("d") or []
        scopes = []
        for e in d:
            sc = e[1] if len(e) > 1 else ""
            if sc and sc not in scopes: scopes.append(sc)
        if len(scopes) < 2: continue
        for sc in scopes:
            hit = scope_match(r["lat"], r["lng"], r["n"], sc)
            if not hit or hit[0] in taken: continue
            nm, st, la, lo = hit
            mine = [e for e in d if (len(e) > 1 and e[1] == sc)]
            if not mine: continue
            q = {"n": nm, "s": st, "lat": round(la, 4), "lng": round(lo, 4), "d": mine}
            if "k" in r: q["k"] = r["k"]
            q["t"] = r.get("t") or r["n"]
            taken.add(nm); extra.append(q); stats["course rows split out"] += 1
    rows += extra

for r in rows: r.pop("_all", None)
rows.sort(key=lambda r: r["n"].lower())
KEYS = ("n","s","lat","lng","d","y","k","m","t")
def enc(r): return "{" + ",".join("%s:%s" % (k, json.dumps(r[k], ensure_ascii=False)) for k in KEYS if k in r) + "}"
js = ("/* What Wikipedia's golf infoboxes know about the notable US courses: who designed\n"
      "   them, the year they opened, whether you can get on, and the tournaments they've\n"
      "   hosted.  Quoted from the articles, not inferred -- a course missing from here\n"
      "   simply has no Wikipedia article, which is itself most of what \"notable\" means.\n"
      "   CC BY-SA 4.0, Wikipedia contributors.  Rebuild: scratchpad/wiki/pull.py + parse.py.\n"
      "   Keys: n name, s state, d [[designer, course]...], y year, k access, m tournaments, t article. */\n"
      "window.NOTABLE={v:1,src:\"Wikipedia\",n:%d,rows:[\n%s\n]};\n"
      % (len(rows), ",\n".join(enc(r) for r in rows)))
open(OUT, "w", encoding="utf-8").write(js)
print("pages:", len(raw), " US rows:", len(rows))
print(" ", dict(stats))
print("bytes:", os.path.getsize(OUT))
