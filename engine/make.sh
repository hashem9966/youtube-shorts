#!/usr/bin/env bash
# Build one episode end to end: voice -> render -> checks, for Arabic and (if script.json has "en") English.
# usage: engine/make.sh episodes/<slug> [ar|en|all]   (default all)
set -euo pipefail
EP="${1%/}"; WHICH="${2:-all}"; HERE="$(cd "$(dirname "$0")" && pwd)"
command -v edge-tts >/dev/null || pip install -q edge-tts
langs=(ar); python3 -c "import json,sys;sys.exit(0 if 'en' in json.load(open('$EP/script.json')) else 1)" && langs+=(en)
for L in "${langs[@]}"; do
  [[ "$WHICH" != all && "$WHICH" != "$L" ]] && continue
  python3 "$HERE/voice.py" "$EP" "$L"
  node "$HERE/render.js" "$EP" --lang "$L"
  V="$EP/video.mp4"; [[ $L == ar ]] || V="$EP/video-$L.mp4"
  ffprobe -v error -show_entries stream=codec_name,width,height -show_entries format=duration -of compact "$V"
done
