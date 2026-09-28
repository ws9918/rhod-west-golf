#!/bin/bash
# Pull every leisure=golf_course in the US from OpenStreetMap, a state at a time.
# A single US-wide query times out; per-state keeps each one inside the timeout.
# Back-to-back queries earn a 504 from the public instance, so the pause is
# deliberate. Back off within a state, but RESET between states: carrying the
# backoff forward compounds into minutes of dead waiting before every later query.
OUT="$1"; mkdir -p "$OUT"
BASE_GAP="${GAP:-30}"
STATES="AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY"
for S in $STATES; do
  F="$OUT/$S.json"
  [ -s "$F" ] && continue
  cat > /tmp/ovq-$S.txt <<EOF
[out:json][timeout:300];
area["ISO3166-2"="US-$S"][admin_level=4]->.a;
nwr["leisure"="golf_course"](area.a);
out center tags;
EOF
  gap=$BASE_GAP
  for try in 1 2 3 4 5; do
    sleep $gap
    code=$(curl -sS -o "$F" -w "%{http_code}" --max-time 330 -X POST -d @/tmp/ovq-$S.txt https://overpass.kumi.systems/api/interpreter)
    if [ "$code" = "200" ] && head -c 1 "$F" | grep -q '{'; then
      n=$(python3 -c "import json;print(len(json.load(open('$F'))['elements']))" 2>/dev/null || echo ERR)
      echo "$(date +%H:%M:%S) $S ok $n"; break
    fi
    echo "$(date +%H:%M:%S) $S retry $try (HTTP $code)"; rm -f "$F"
    gap=$((gap+15)); [ $gap -gt 75 ] && gap=75
  done
done
echo "PULL DONE $(ls "$OUT" | wc -l) states"
