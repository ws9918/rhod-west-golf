/* Rhod + West Golf Adventures — shared backend
   Pure Node (no dependencies). Serves the static app and a tiny API:
     GET  /api/state            -> shared state JSON
     PUT  /api/state            -> replace shared state JSON
     PUT  /api/photo/:id        -> store a photo (body {data:"data:image/jpeg;base64,..."})
     GET  /api/photo/:id        -> serve a photo
     DELETE /api/photo/:id      -> delete a photo
   Data persists under DATA_DIR (set a Railway Volume there, e.g. /data).
   Optional shared access code: set ACCESS_CODE; clients send it as x-rw-code.
*/
const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(__dirname, "data"));
const PHOTO_DIR = path.join(DATA_DIR, "photos");
const STATE_FILE = path.join(DATA_DIR, "state.json");
const CODE = (process.env.ACCESS_CODE || "").trim();
const ROOT = __dirname;

fs.mkdirSync(PHOTO_DIR, { recursive: true });

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon"
};

/* Gzip the static text assets. us-courses.js is ~14,000 rows of very repetitive JSON
   and index.html carries all the CSS and JS inline, so this is the difference between
   a fast load and a slow one on a phone. Compressed bodies are cached in memory and
   re-made when the file's mtime moves. */
const COMPRESSIBLE = /^(text\/|application\/(javascript|json|xml)|image\/svg)/;
const gzCache = new Map();
function sendStatic(req, res, file, buf, type) {
  const enc = req.headers["accept-encoding"] || "";
  if (!COMPRESSIBLE.test(type || "") || buf.length < 1024 || !/\bgzip\b/.test(enc))
    return send(res, 200, buf, type);
  let stamp = ""; try { const st = fs.statSync(file); stamp = st.mtimeMs + ":" + st.size; } catch { }
  const hit = gzCache.get(file);
  if (hit && hit.stamp === stamp) {
    res.writeHead(200, { "Content-Type": type, "Content-Encoding": "gzip", "Vary": "Accept-Encoding" });
    return res.end(hit.body);
  }
  zlib.gzip(buf, (err, gz) => {
    if (err) return send(res, 200, buf, type);
    if (gzCache.size > 64) gzCache.clear();
    gzCache.set(file, { stamp, body: gz });
    res.writeHead(200, { "Content-Type": type, "Content-Encoding": "gzip", "Vary": "Accept-Encoding" });
    res.end(gz);
  });
}
function send(res, code, body, type) {
  res.writeHead(code, { "Content-Type": type || "text/plain; charset=utf-8" });
  res.end(body);
}
function readBody(req) {
  return new Promise((resolve) => {
    let d = ""; req.on("data", (c) => { d += c; if (d.length > 30e6) req.destroy(); });
    req.on("end", () => resolve(d));
  });
}
function authed(req) { return !CODE || (req.headers["x-rw-code"] || "") === CODE; }
function safeId(s) { return String(s || "").replace(/[^a-z0-9_-]/gi, "").slice(0, 64); }

/* One-time reset (Sept 2026): the rating system was rebuilt around Totality,
   and the old scores must not seed the new rankings. On boot, if the stored
   state still has any pre-Totality round (no `tot` score), archive the whole
   state to state-backup-<timestamp>.json on the volume, then remove ONLY
   those legacy rounds (new Totality ratings are kept) along with the old
   head-to-head order. Keeps t100 flags, trips, wishlist and dream progress;
   photo files stay on disk (the backup still references them). */
try {
  const st = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  const hasLegacy = st && st.ratings && Object.keys(st.ratings).some(function (n) {
    return ((st.ratings[n] && st.ratings[n].rounds) || []).some(function (r) { return r && typeof r.tot !== "number"; });
  });
  if (hasLegacy) {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    fs.writeFileSync(path.join(DATA_DIR, "state-backup-" + stamp + ".json"), JSON.stringify(st));
    let kept = 0;
    Object.keys(st.ratings).forEach(function (n) {
      const rs = ((st.ratings[n] && st.ratings[n].rounds) || []).filter(function (r) { return r && typeof r.tot === "number"; });
      if (rs.length) { st.ratings[n].rounds = rs; kept += rs.length; } else delete st.ratings[n];
    });
    st.order = []; if (!kept) st.snub = {};
    fs.writeFileSync(STATE_FILE, JSON.stringify(st));
    console.log("One-time reset: removed pre-Totality ratings, kept " + kept + " Totality rating(s) (backup: state-backup-" + stamp + ".json)");
  }
} catch (e) { /* no state yet, or unreadable — nothing to migrate */ }

const server = http.createServer(async (req, res) => {
  const u = decodeURIComponent((req.url || "/").split("?")[0]);

  // ---------- API ----------
  if (u.startsWith("/api/")) {
    // photo reads are public so <img> tags work without headers
    const isPhotoGet = req.method === "GET" && u.startsWith("/api/photo/");
    if (!isPhotoGet && !authed(req)) return send(res, 401, "unauthorized");

    if (u === "/api/state" && req.method === "GET") {
      try { return send(res, 200, fs.readFileSync(STATE_FILE), TYPES[".json"]); }
      catch { return send(res, 200, "{}", TYPES[".json"]); }
    }
    if (u === "/api/state" && req.method === "PUT") {
      const body = await readBody(req);
      try { JSON.parse(body); } catch { return send(res, 400, "bad json"); }
      fs.writeFileSync(STATE_FILE, body); return send(res, 200, "ok");
    }
    if (u.startsWith("/api/photo/")) {
      const id = safeId(u.slice("/api/photo/".length));
      const file = path.join(PHOTO_DIR, id + ".jpg");
      if (req.method === "GET") {
        try { const b = fs.readFileSync(file);
          res.writeHead(200, { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=31536000" });
          return res.end(b);
        } catch { return send(res, 404, "no photo"); }
      }
      if (req.method === "PUT") {
        const body = await readBody(req);
        let data; try { data = JSON.parse(body).data || ""; } catch { return send(res, 400, "bad json"); }
        const b64 = data.indexOf(",") >= 0 ? data.slice(data.indexOf(",") + 1) : data;
        try { fs.writeFileSync(file, Buffer.from(b64, "base64")); return send(res, 200, "ok"); }
        catch { return send(res, 500, "write failed"); }
      }
      if (req.method === "DELETE") { try { fs.unlinkSync(file); } catch {} return send(res, 200, "ok"); }
    }
    return send(res, 404, "not found");
  }

  // ---------- static ----------
  let rel = u === "/" ? "/index.html" : u;
  const full = path.normalize(path.join(ROOT, rel));
  if (!(full === ROOT || full.startsWith(ROOT + path.sep))) return send(res, 403, "forbidden");
  // never serve the data dir (state, backups, photos) as static files
  if (full.startsWith(DATA_DIR + path.sep)) return send(res, 403, "forbidden");
  fs.readFile(full, (err, buf) => {
    if (err) { // SPA-ish fallback to index
      const idxFile = path.join(ROOT, "index.html");
      return fs.readFile(idxFile, (e2, idx) =>
        e2 ? send(res, 404, "not found") : sendStatic(req, res, idxFile, idx, TYPES[".html"]));
    }
    sendStatic(req, res, full, buf, TYPES[path.extname(full).toLowerCase()] || "application/octet-stream");
  });
});

server.listen(PORT, () => console.log("Rhod + West Golf running on :" + PORT + (CODE ? " (access code on)" : "")));
