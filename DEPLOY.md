# Deploy Rhod + West Golf to Railway

The app is now a shared logbook: one backend, one database, so you and Rhod see the
same courses, ratings, photos, dream lists and trips from any device.

Everything is deploy-ready. You just need to sign in to your own accounts — I can't log
into Railway or GitHub for you, or enter a payment method. Pick either path below.

---

## Option A — GitHub + Railway (recommended, ~10 min)

1. **Put this folder on GitHub.**
   - Create a new repo at github.com (e.g. `rhod-west-golf`).
   - Upload everything in this folder, or from a terminal here:
     ```
     git init && git add . && git commit -m "Rhod + West Golf"
     git branch -M main
     git remote add origin https://github.com/<you>/rhod-west-golf.git
     git push -u origin main
     ```

2. **Create the Railway project.**
   - railway.app → **New Project** → **Deploy from GitHub repo** → pick the repo.
   - Railway auto-detects Node, runs `npm start` (which runs `node server.js`).

3. **Add a Volume so data survives redeploys.** (Important.)
   - In the service → **Settings → Volumes** (or right-click the service → Add Volume).
   - Mount path: `/data`
   - Then **Variables** → add `DATA_DIR` = `/data`

4. **(Optional but recommended) Lock it to just you two.**
   - Variables → add `ACCESS_CODE` = some shared word (e.g. `birdie`).
   - First visit will ask each of you for the code once.

5. **Get the URL.**
   - Settings → **Networking → Generate Domain**.
   - Share that link with Rhod. Add it to your phone home screen for an app feel.

---

## Option B — Railway CLI

```
npm i -g @railway/cli
railway login          # opens browser to authenticate (you do this)
railway init           # create a project
railway up             # deploy this folder
```
Then in the dashboard do steps 3–5 above (Volume at `/data`, `DATA_DIR=/data`,
optional `ACCESS_CODE`, Generate Domain).

---

## Notes
- **Volume is essential.** Without a Volume mounted at `/data` (and `DATA_DIR=/data`),
  your ratings and photos reset every time Railway redeploys.
- Data is shared by anyone with the link. The optional `ACCESS_CODE` keeps strangers out.
- Photos are downscaled before upload, so storage stays small.
- Local test: `DATA_DIR=./data node server.js` then open http://localhost:3000
