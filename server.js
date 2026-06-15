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

const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
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
  if (!full.startsWith(ROOT)) return send(res, 403, "forbidden");
  fs.readFile(full, (err, buf) => {
    if (err) { // SPA-ish fallback to index
      return fs.readFile(path.join(ROOT, "index.html"), (e2, idx) =>
        e2 ? send(res, 404, "not found") : send(res, 200, idx, TYPES[".html"]));
    }
    send(res, 200, buf, TYPES[path.extname(full).toLowerCase()] || "application/octet-stream");
  });
});

server.listen(PORT, () => console.log("Rhod + West Golf running on :" + PORT + (CODE ? " (access code on)" : "")));
