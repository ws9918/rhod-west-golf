# Vendored libraries

Copied here so the app has no CDN dependency: it loads from our own server, works
if a CDN is blocked or down, and needs no API key for anything.

| File | Version | Upstream | Licence |
| --- | --- | --- | --- |
| `leaflet.js`, `leaflet.css`, `images/` | 1.9.4 | https://leafletjs.com | BSD-2-Clause |
| `html2canvas.min.js` | 1.4.1 | https://html2canvas.hertzen.com | MIT |

To update, re-download the same paths from unpkg/cdnjs and bump the versions above.

## Map tiles

Tiles are fetched live from keyless, free endpoints and are credited on the map,
as their terms require:

- **Clean** — CARTO Positron, built on OpenStreetMap data (© OpenStreetMap, © CARTO)
- **Terrain / Satellite** — Esri ArcGIS World Topo and World Imagery (Tiles © Esri)

No account, token or API key is involved in any of them.
