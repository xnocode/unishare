#!/usr/bin/env python3
"""Sequentially check all routes return 200 (gentle on the dev server)."""
import os, sys, time, urllib.request

routes = []
for d in sorted(os.listdir('src/app')):
    p = os.path.join('src/app', d)
    if os.path.isdir(p) and d != 'api' and os.path.exists(os.path.join(p, 'page.tsx')):
        routes.append('/' + d)
routes.insert(0, '/')

if len(sys.argv) > 1:
    routes = [r for r in routes if any(k in r for k in sys.argv[1:])]

bad = []
for r in routes:
    try:
        with urllib.request.urlopen('http://localhost:3000' + r, timeout=90) as resp:
            s = resp.status
    except Exception as e:
        s = str(e)[:50]
    if s != 200:
        bad.append((r, s))
        print(f"FAIL {r} -> {s}")
    time.sleep(0.4)

print(f"checked {len(routes)} routes, failures: {len(bad)}")
