# Daily YouTube Short: production procedure

This repo is an autopilot for an Arabic science-explainer YouTube Shorts channel. A scheduled session runs once a day and makes **two** Shorts (owner's choice since 2026-11-24). Run steps 2–3 once, then steps 4–10 for video A, then again for video B, then 11–12.
The goal the owner set: steady growth toward YouTube monetization. Optimise for retention (average view duration), returning viewers and consistency, not raw volume.
**The owner chose fully automatic publishing.** Publish only if every check below passes. If anything fails, publish nothing and report the failure.

Language for everything the viewer sees or hears: **Hijazi Arabic dialect** (the owner's choice since 2026-11-24), kept clear and easy for any Arab viewer.
Use Hijazi words naturally: «إيش» (what), «ليش» (why), «كدا» (not «كذا»), «دحين» (now), «مرّة» (very), «زي» (like), «حق» (belonging to), «بس», «يعني», «عشان», «يطلع/ينزل», «تشوف». Avoid Najdi markers such as «وش», «ذحين», «كذا», «مب». Keep science terms in plain standard Arabic.
The 2026-11-23 reference episode is in a general Saudi dialect; copy its structure and pacing, not its wording.
The TTS voice (`ar-SA-HamedNeural`) has a general Saudi accent; there is no Hijazi-specific voice, so the dialect comes from the wording. Spell the `tts` text the way a Hijazi speaker says it (e.g. «كدا», «دحين»).
Report to the owner in Arabic.
The skills mention `~/.claude/youtube/voice.md` and asking for the creator's videos: this channel has no voice file and nobody to ask during the run. The voice is the reference episode's style. Skip that step and do not wait for input. The skills' "ship it, or change it?" gate is replaced by the owner's standing approval above.

## Fixed facts
- Metricool brand (blogId): `8317657`, timezone `Asia/Riyadh`, YouTube is the only connected network.
- Publish times: video A at **13:00**, video B at **18:00** Asia/Riyadh (both inside Metricool's best-time window; the peak is 15:00–17:00). If a slot has already passed, use now + 20 minutes, and keep B at least 4 hours after A.
- The two videos of a day must be on different topics and look different (different scenes and visual metaphors), so the channel never reads as mass-produced. YouTube does not monetise repetitive or templated content, so variety matters.
- Video hosting: files committed to `main` are public at
  `https://raw.githubusercontent.com/hashem9966/youtube-shorts/main/<path>`. Metricool downloads the video from that URL.
- Voice: edge-tts `ar-SA-HamedNeural`, rate `+25%` (host `speech.platform.bing.com` is allowed in this environment; `engine/voice.py` passes the session proxy).

## Steps

1. **Setup.** `pip install -q edge-tts`. Run from the repo root.
2. **Look at the channel first.** Use Metricool `getAnalyticsDataByMetrics` (brandId 8317657, last 14 days) with
   `YTVP17,YTVP05,YTVP06,YTVP08,YTVP09,YTVP11,YTVP12` (title, url, views, avg view duration, likes, comments, shares)
   and `YTEV01,YTEV05` (subscribers, gained). Append today's numbers to `log.md`.
   If competitors are set up in Metricool, also pull `YTCV06,YTCV04,YTCV07` (competitor video title, url, views) for the last 30 days.
3. **Pick the topic.**
   - First, what our own channel shows works: which of our past topics/hook styles got the most views and longest average view duration.
   - Then competitor videos with the most views (step 2), and the `yt-viral` skill's way of judging: rank by how far a video beat its own channel's median, then name the formula. Make our own version of the *idea*; never copy a video's script, visuals, title or branding.
   - Otherwise take the first unchecked topic in `topics.md`.
   - Never repeat a topic that is already in `log.md`. Tick the chosen topics in `topics.md`.
   - Choose two topics per run: one from the strongest-performing pattern so far, and one that tests something new (a new subject area or hook formula). Say in the report which test it is.
   - **Every Friday**, also do a short channel review in the spirit of the `yt-audit` skill: retention and views per video, which hooks and topics win, and ONE change to apply next week. Reorder `topics.md` to match, and add new topics when fewer than 15 remain.
4. **Facts.** Write down each factual claim the video makes. Verify any claim you are not certain of with WebSearch; prefer encyclopedias, universities and official agencies. Use round, well-established numbers only, with «حوالي» where appropriate. Never invent a number. If a claim cannot be verified, cut it.
   Avoid medical advice, religion, politics, and anything dangerous to try at home.
5. **Script (follow the `yt-script` skill).** Write 5 hooks, translate each to English and score them with
   `python3 .claude/skills/yt-script/hookscore.py --hook "..."` (the scorer only reads English), keep the best.
   The structure is a hook (≤4 s, an open question), then the mechanism in 3–5 beats with one idea per beat, a one-line payoff, and a last line that loops back to the first.
   14–18 caption lines, each ≤ 6 words; total voice ≈ 30–40 s (the final video must stay under 60 s).
6. **Build the episode** in `episodes/<YYYY-MM-DD>-<slug>/`:
   - `script.json`: same schema as the reference episode. `caption` is what's shown, `tts` is what's spoken (write numbers as words, e.g. «أربعمية», and use «،» instead of «…»), `at` = [start,end] in DESIGN time (0–30 s), `scene_start` true on the first line of each scene, `sfx` in design time (whoosh at scene changes; pop/ding/spark/boom where they fit).
   - `scene.js`: original animation drawn with the helpers in `engine/lib.js` (txt, stroked, chip, rr, arrow, glow, drop, bolt, flames, burst, barrel, sceneAlpha, seg/eo/back…). Define scene functions on design time, then `drawScenes(t)` and `drawCover()` and export both on `window`. Read the reference episode's `scene.js` before writing.
   - Layout rules: 1080×1920. Keep visuals inside x 90–940 and y 260–1300. Captions are drawn by the engine at y≈1430, so nothing important may sit at y 1330–1530. Keep the bottom 380 px empty for the Shorts UI. Keep the palette consistent across episodes.
   - Every beat must show something moving that matches what is being said.
7. **Check visually before rendering.** `python3 engine/voice.py episodes/<ep>`, then
   `node engine/render.js episodes/<ep> --preview 1,5,10,15,20,25,29` and view each PNG in `build/preview/` plus `cover.png`. Fix overlapping or clipped text, empty frames, and anything unreadable. Repeat until it is clean.
8. **Render.** `engine/make.sh episodes/<ep>`. Confirm 1080×1920, H.264 + AAC, and duration < 60 s.
9. **Package (follow `yt-package` and `yt-seo`).**
   - **Title:** write 10, run `python3 .claude/skills/yt-package/title.py <file>`, pick the best. It must carry a concrete number or name, stay ≤ 60 chars, and its words must match the real duration if a duration is mentioned.
   - **Cover text:** ≤ 3 words, different words from the title.
   - **Description:** the first 2 lines contain the words people search for. Add 2–3 hashtags, including `#shorts`.
   - **Tags:** ≤ 15.
   - Save it all in `episodes/<ep>/meta.json`: title, description, tags, hooks with their scores, and the facts checked with their sources.
10. **Publish.** `git add` the episode (keep `build/` out; it is gitignored), commit, then `git push origin HEAD:main`.
    `curl -sI` the raw video URL and require HTTP 200 and a `video/mp4` or `application/octet-stream` content type.
    Then Metricool `createScheduledPost` with:
    - providers `[{"network":"youtube"}]`, media `[raw video URL]`, text = description, autoPublish true;
    - youtubeData `{"title":…, "type":"short", "privacy":"public", "tags":[…], "category":"EDUCATION", "madeForKids":false, "isAiGeneratedContent":false}`;
    - publicationDate `{"dateTime":"<today>T13:00:00"|"<today>T18:00:00","timezone":"Asia/Riyadh"}` for video A and B;
    - firstCommentText: one short question to the viewers about the topic, in Hijazi Arabic, to start comments.
    Confirm the response shows the youtube provider PENDING or PUBLISHED.
11. **Log.** Append a row to `log.md` with the date, topic, title, video path, Metricool plannerUrl and status. Commit and push.
12. **Report** (the final message is sent to the owner's phone), in Arabic and short:
    - today's two videos: each one's title, publish time and Metricool link;
    - channel numbers: subscribers, views in the last 24 h/7 d, and the best video so far;
    - what the numbers suggest for the next videos (one line);
    - anything that failed or needs the owner.
