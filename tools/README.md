# Rebuilding the datasets

Two of the files the app loads are generated, not hand-written. Everything here
is stdlib Python and `curl` — no packages to install.

## `us-courses.js` — every golf course in the US

    tools/pull-osm.sh   raw/                 # one Overpass query per state
    tools/verify-osm.py raw/ suspect.txt     # find states that came back truncated
    tools/pull-osm.sh   raw/ suspect.txt     # re-pull just those, and verify again
    tools/build-us-courses.py raw/ us-courses.js

Overpass answers a truncated query with HTTP 200 and partial data, so
`verify-osm.py` exists: it flags any state whose courses sit inside an
implausibly small slice of its bounding box. The first full pull had holes in a
third of the country and looked fine until this caught them. Re-pull until it
reports `suspect: 0`.

`build-us-courses.py` drops driving ranges, chipping greens, learning centres,
individual hole features (`#4 Green`, `golf=tee`) and duplicate node/way pairs
for the same course, then writes rows of `[name, state, lat, lng, extras?]`.
Source: OpenStreetMap, ODbL — credited on the map, as the licence requires.

## `notable.js` — who built the ones worth a detour

    tools/fetch-wikipedia.py titles.json raw.json
    tools/build-notable.py   raw.json notable.js us-courses.js

`fetch-wikipedia.py` lists the articles using `Template:Infobox golf facility`
and pulls their wikitext through `Special:Export`, eighty at a time. (`api.php`
rate-limits a shared address far below what fetching a thousand articles needs;
Special:Export does the same job in a dozen requests.)

`build-notable.py` reads the infoboxes for designer, year opened, public or
private, and tournaments hosted, and joins each article to the course it
describes in `us-courses.js` — so a row speaks the same name the app does, and a
club with several named courses becomes one row per course, each with its own
architect. Nothing is inferred: a course with no article gets no entry.
Source: Wikipedia, CC BY-SA 4.0.

## Why architects come from Wikipedia and not OpenStreetMap

OSM has an `architect` or `designer` tag on **15** of its 13,000 US courses.
Wikidata has `P84` on **11**. Wikipedia's infoboxes have one on **419**, and
they are the 419 you would actually turn off a highway for.
