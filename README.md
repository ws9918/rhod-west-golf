# Rhod + West Golf Adventures

Shared golf logbook, rankings, dream lists and road-trip planner. Works as a phone app and, at wider screens, as a web view with a side nav.

## How rating works

**One person, one rating.** West rates a course on his phone, Rhod rates it on his, and the course view shows the two ratings **head to head**: both ratings with the gap between them, then one opposed bar per category so you can see who leads and by how much. Categories you disagree on are marked, and a closing line settles it ("Agree on 5 of 7. Furthest apart on Experience, 8.0 against 6.0"). Until both are in, the course shows "waiting on Rhod/West" with a one-tap button to add the missing rating. Every rating can be **adjusted** (✎) or **deleted** (🗑) from the course view or from the rating's recap.

Each phone remembers whose ratings it enters (the "Whose rating is this?" toggle at the top of the rate sheet).

## The categories

| Category | Scale | What it means |
| --- | --- | --- |
| Overall Design | 0–10 | Routing, boldness, the design as a whole — not how dramatic it is |
| Memorable Holes | 0–18 | Self-explanatory — how many of the 18 |
| Condition | 0–10 | 1 = Thunderbird (Arizona) · 10 = Augusta |
| Enjoyment | 0–10 | Played alone, would you have enjoyed it? Ignore your score and the company |
| Experience | 0–10 | Everything that doesn't touch a club — clubhouse, turn house, comfort stations, how they treat you |
| Difficulty | 0–10 | Self-explanatory |

**Totality** (0–10) sits alongside them: the whole thing as a gut call — if everything's a 7 but it added up to a 10, it's a 10.

### How the rating is worked out

A rating is a **weighted roll-up of all seven**. Each is read out of 10 first — Memorable
Holes is out of 18, so 9 of them reads 5.0 — then weighted: every category once, **Totality
twice**. A complete rating divides by 8.

```
rating = (design + holes×10/18 + condition + enjoyment + experience + difficulty + 2×totality) / 8
```

Totality therefore moves a rating 2.5 points across its full range, where any other category
moves it 1.25. Anything a rating doesn't carry drops out of both the total and the divisor, so
a part-filled rating still scores on what it has. The **course score** is the average of the
ratings on it, and that is what ranks the courses.

The rate sheet shows the running rating under the Totality slider, so you can see what the
sliders add up to before you save. It also nags if Memorable Holes is still on 0 — it starts
there, and at a full weight a forgotten 0 is expensive.

Each rating also carries a **verdict** — ✈️ I'd fly there for it · 🚗 I'd drive out of my way if nearby · ➖ Skip it — and **what you'd pay**: not what they charge, what it's worth to you.

Courses not on the Top 100 can be flagged **"Should be Top 100"** (looking at you, Gold Mountain).

**💸 Worth it** (a chip on the Courses tab) sorts the rated courses by money: *Pay anything* — you'd pay in the top third of your own figures, or someone's verdict is ✈️ fly — and *Doesn't make sense* — rated at or above your own middle mark but you'd pay in the bottom third, or someone said ➖ skip. Both bars are measured against your own ratings rather than fixed numbers, so they hold up as the scoring changes. It needs at least three courses with a would-pay figure.

## The map

No API key, no account, no billing, for anything in the app.

- **Leaflet** and **html2canvas** are vendored in `vendor/`, so the app has no CDN dependency and keeps working if a CDN is blocked or down.
- **Tiles** come from Esri's public ArcGIS endpoints, which need no key: Light Gray Canvas for *Clean*, World Topo for *Terrain*, World Imagery for *Satellite*.
- Credit is shown on the map, as those terms require.

CARTO used to serve the *Clean* basemap. It now stamps `API KEY REQUIRED` across unkeyed tiles, so it was replaced.

## Photography

Every course has a picture. They are **landscape photographs matched to where a course
is** — links, desert, high country, low country, parkland — not photographs of the clubs
themselves. Region decides the terrain, with a short list of course-name overrides where
the name says more than the state does ("Bandon", "Pebble Beach", "Sand Hollow"), and where
a terrain has two frames the course name picks one, so the 58 Virginia clubs aren't all
showing the same photograph. The stand-in is labelled as one wherever it appears.

All of them are free under the [Unsplash License](https://unsplash.com/license) and
credited in `img/CREDITS.md`, which also lists the region-to-terrain table.

The clubs' own photographs — Rock Creek's, Kinloch's, everyone's — are copyrighted by the
clubs and their photographers, and this repository is public, so they are not shipped here.
For real imagery of a course, add your own photos from the round to a rating (✎ on the
rating, then Photos); they become that course's pictures and replace the stand-in
everywhere.

## Starting over

**Start fresh** at the bottom of the Courses tab wipes every rating, note, photo and ranking (after a confirm and typing `RESET`) while keeping the course list, Top-100 flags, trips, wishlist and dream progress. The server also does this once automatically on boot if it finds ratings from the pre-Totality scoring system, archiving them first to `state-backup-<timestamp>.json` in the data directory.
