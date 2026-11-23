#!/usr/bin/env bash
# Build one episode end to end: voice -> render -> checks.  usage: engine/make.sh episodes/<slug>
set -euo pipefail
EP="${1%/}"; HERE="$(cd "$(dirname "$0")" && pwd)"
command -v edge-tts >/dev/null || pip install -q edge-tts
python3 "$HERE/voice.py" "$EP"
node "$HERE/render.js" "$EP"
ffprobe -v error -show_entries stream=codec_name,width,height -show_entries format=duration -of compact "$EP/video.mp4"
