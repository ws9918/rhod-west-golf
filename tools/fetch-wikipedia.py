#!/usr/bin/env python3
"""Fetch the wikitext of every golf-infobox article via Special:Export.

The api.php route is rate-limited to the point of uselessness from a shared
address; Special:Export takes eighty titles per request instead of one."""
import json,urllib.request,urllib.parse,time,os,re,sys
import xml.etree.ElementTree as ET
UA="rhod-west-golf/1.0 (personal golf logbook)"
NS="{http://www.mediawiki.org/xml/export-0.11/}"

def export(titles,tries=6):
    data=urllib.parse.urlencode({"pages":"\n".join(titles),"curonly":"1","action":"submit"}).encode()
    for i in range(tries):
        try:
            r=urllib.request.Request("https://en.wikipedia.org/wiki/Special:Export",data=data,
              headers={"User-Agent":UA,"Content-Type":"application/x-www-form-urlencoded"})
            return urllib.request.urlopen(r,timeout=180).read()
        except Exception as e:
            if i==tries-1: raise
            w=min(120,8*2**i); print("  retry %d (%s) in %ds"%(i+1,e,w),flush=True); time.sleep(w)

def title_list(path):
    """Every article using the golf infobox. Three api.php calls, which is
    within the rate limit that makes fetching the articles that way hopeless."""
    if os.path.exists(path): return json.load(open(path))
    import urllib.request as UR
    titles, seen = [], set()
    for tpl in ["Infobox golf facility", "Infobox golf course"]:
        cont = {}
        while True:
            q = {"action":"query","format":"json","list":"embeddedin",
                 "eititle":"Template:"+tpl,"einamespace":"0","eilimit":"500"}
            q.update(cont)
            u = "https://en.wikipedia.org/w/api.php?" + urllib.parse.urlencode(q)
            d = json.load(UR.urlopen(UR.Request(u, headers={"User-Agent": UA}), timeout=90))
            for e in d["query"]["embeddedin"]:
                if e["title"] not in seen: seen.add(e["title"]); titles.append(e["title"])
            if "continue" not in d: break
            cont = d["continue"]; time.sleep(5)
        time.sleep(5)
    titles.sort(); json.dump(titles, open(path, "w")); return titles

TITLES = sys.argv[1] if len(sys.argv) > 1 else "titles.json"
OUT    = sys.argv[2] if len(sys.argv) > 2 else "raw.json"
titles=title_list(TITLES)
out={}
if os.path.exists(OUT): out=json.load(open(OUT))
todo=[t for t in titles if not (out.get(t) or {}).get("wt")]
print("titles:",len(titles)," to fetch:",len(todo),flush=True)
for i in range(0,len(todo),80):
    chunk=todo[i:i+80]
    xml=export(chunk)
    root=ET.fromstring(xml)
    got=0
    for pg in root.iter(NS+"page"):
        t=pg.findtext(NS+"title")
        wt=pg.findtext(NS+"revision/"+NS+"text") or ""
        if t: out[t]={"wt":wt}; got+=1
    print("  %d/%d (+%d)"%(min(i+80,len(todo)),len(todo),got),flush=True)
    json.dump(out,open(OUT,"w"))
    time.sleep(3)
json.dump(out,open(OUT,"w"))
print("done:",len(out),"pages,",os.path.getsize(OUT),"bytes",flush=True)
