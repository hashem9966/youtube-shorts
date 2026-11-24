#!/usr/bin/env python3
"""Generate images with the open-source FLUX model via Pollinations (free tier: about 1 image / 45 s per IP).
usage: python3 gen_image.py OUT.jpg WIDTH HEIGHT SEED "prompt..."
Retries on rate limits. Needs host image.pollinations.ai allowed in the environment."""
import sys, time, urllib.parse, urllib.request, json
out, w, h, seed, prompt = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5]
url = f"https://image.pollinations.ai/prompt/{urllib.parse.quote(prompt)}?width={w}&height={h}&seed={seed}&nologo=true&model=flux"
for attempt in range(8):
    try:
        with urllib.request.urlopen(url, timeout=240) as r:
            data = r.read()
            if r.headers.get('Content-Type','').startswith('image/'):
                open(out, 'wb').write(data); print('ok', out, len(data)); sys.exit(0)
            msg = data[:200]
    except urllib.error.HTTPError as e:
        msg = e.read()[:200]
    except Exception as e:
        msg = str(e)
    print('retry', attempt, msg, flush=True); time.sleep(50)
sys.exit('failed: ' + str(msg))
