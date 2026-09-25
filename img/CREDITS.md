# Photography

Every file here is free under the [Unsplash License](https://unsplash.com/license),
which permits commercial use without attribution. Credited anyway:

| File | Photographer | Source |
| --- | --- | --- |
| `hero-mountain.jpg` | Frugal Flyer | https://unsplash.com/photos/ExBkM0ssrHQ |
| `terrain-mountain.jpg` | Frugal Flyer | https://unsplash.com/photos/NQKrhdgEVqQ |
| `terrain-links-2.jpg` | Max Böhme | https://unsplash.com/photos/WuRTF65Yg1U |
| `terrain-coastal.jpg` | Taylor Chausky | https://unsplash.com/photos/c9bOD9mxAP4 |
| `terrain-parkland.jpg` | Bernd Dittrich | https://unsplash.com/photos/3MdsHe3IIOk |
| `terrain-desert.jpg` | Robert Ruggiero | `images.unsplash.com/photo-1671904942522-8e2a0dbb709f` |
| `terrain-links.jpg` | Toby Harvey | `images.unsplash.com/photo-1672871582992-1b30b19878f5` |
| `terrain-coastal-2.jpg` | Tom Schaeffer | `images.unsplash.com/photo-1716464968470-c2162dd998e4` |
| `terrain-parkland-2.jpg` | Cristina Anne Costello | `images.unsplash.com/photo-1684856111070-0433891d6af5` |

The last four are given by their CDN id, which is what they were fetched by; the
others carry the photo-page link recorded when they were first added.

Each is cropped to 1600×900 and re-encoded at quality 72; `*-sm.jpg` are the same
frames as 128px squares for the 46px thumbnails in list rows, so a phone isn't
pulling a 1600px banner per row. The crops were made with `scratchpad/pwtest/crop.js`.

## What these are, and what they are not

They are **terrain photographs matched to where a course is** — not photographs of
the clubs themselves. `index.html` maps each course's region (with a short list of
name overrides, because "Bandon" says more than "Oregon" does) to one of five
terrains, and where a terrain has two frames the course name picks one, so the 58
Virginia clubs aren't all showing the same picture.

| Terrain | Goes to |
| --- | --- |
| Links | Scotland, Bandon, Pebble Beach, Chambers Bay, Whistling Straits, Cabot |
| Desert | Arizona, Nevada, New Mexico, Cabo, Palm Springs, St George |
| High country | Utah, Montana, Colorado, Alberta, Central Oregon, Chamonix |
| Low country | Florida, the Carolina coast, Barbados, Louisiana |
| Parkland | Virginia, Maryland, Texas, Georgia — and the default for anywhere unlisted |

## Why not the clubs' own photos?

Rock Creek Cattle Company's photographs — and Kinloch's, and Farmington's, and every
other private club's — are copyrighted by the clubs and their photographers. This
repository is public, so shipping them here would be republishing someone else's work
without a licence. No free-licensed photograph exists for most of these clubs at all.

The real answer is your own photos from the round. Add them to a rating (✎ on the
rating, then Photos) and they become that course's pictures, replacing the stand-in
everywhere it appears.

## Course data

`us-courses.js` is not photography but belongs in the same ledger: every golf course in
the United States, from **OpenStreetMap**'s `leisure=golf_course`, open data under the
[ODbL](https://www.openstreetmap.org/copyright). That licence asks for attribution, so
the map credits "Courses © OpenStreetMap contributors" alongside the Esri tile credit.

Rebuild it with `scratchpad/osm/pull.sh <dir>` (one Overpass query per state) then
`scratchpad/osm/build.py <dir> us-courses.js`.

## The crest

`crest.png` (512px), plus `crest-180/64/32.png` for app and browser icons, are
drawn vector marks, not photographs: a deep green disc, a gold rim and a Fraunces
"RW". They replace a 1024px photograph of an embossed crest on velvet, which went
to mush at 48px on the hero and was unreadable as a 32px favicon.

To change it, edit the mark in `scratchpad/crest/render.html` and re-render, or
just replace these four PNGs at the same sizes.
