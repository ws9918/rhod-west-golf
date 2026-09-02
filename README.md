# Rhod + West Golf Adventures

Shared golf logbook, rankings, dream lists and road-trip planner. Works as a phone app and, at wider screens, as a web view with a side nav.

## How rating works

**One person, one rating.** West rates a course on his phone, Rhod rates it on his, and the course view shows the two cards **side by side** — divergent categories are highlighted and a summary line calls out the biggest gap. Until both are in, the course shows "waiting on Rhod/West" with a one-tap button to add the missing rating. Every rating can be **adjusted** (✎) or **deleted** (🗑) from the course view or from the rating's recap.

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

**Totality** (0–10) is separate: the whole thing as a gut call — if everything's a 7 but it added up to a 10, it's a 10. Totality is what ranks the courses (the course score is the average across ratings).

Each rating also carries a **verdict** — ✈️ I'd fly there for it · 🚗 I'd drive out of my way if nearby · ➖ Skip it — and **what you'd pay**: not what they charge, what it's worth to you.

Courses not on the Top 100 can be flagged **"Should be Top 100"** (looking at you, Gold Mountain).

## Starting over

**Start fresh** at the bottom of the Courses tab wipes every rating, note, photo and ranking (after a confirm and typing `RESET`) while keeping the course list, Top-100 flags, trips, wishlist and dream progress. The server also does this once automatically on boot if it finds ratings from the pre-Totality scoring system, archiving them first to `state-backup-<timestamp>.json` in the data directory.
