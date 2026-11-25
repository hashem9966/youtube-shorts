# Daily YouTube Short: production procedure

This repo is an autopilot for an Arabic science-explainer YouTube Shorts channel. A scheduled session runs once a day and makes **two** Shorts (owner's choice since 2026-11-24). Run steps 2–3 once, then steps 4–10 for video A, then again for video B, then 11–12.
The goal the owner set: steady growth toward YouTube monetization. Optimise for retention (average view duration), returning viewers and consistency, not raw volume.
**Every video also gets an English version** (owner's request, 2026-11-24): same animation, English captions, English voice, English title. Build and publish it too (see "English version" below).
**The owner chose fully automatic publishing.** Publish only if every check below passes. If anything fails, publish nothing and report the failure.

Language for everything the viewer sees or hears in Arabic: **simplified Modern Standard Arabic (فصحى مبسطة)** (owner's choice 2026-11-24, after dialect narration sounded bad).
- `caption`: clear fusha without diacritics, short.
- `tts`: the same sentence **fully vowelled with tashkeel** (e.g. «جَرَّةُ الفَخّارِ تُبَرِّدُ الماء!»), numbers written as words, «،» instead of «…». Diacritics are what make the voice pronounce correctly; never skip them.
- Voice `ar-SA-HamedNeural` at rate `+5%` (the owner listened to samples and picked this). No dialect words in narration or on-screen labels.
- The 2026-11-24 episodes are the reference for wording, tashkeel and labels.
Report to the owner in Arabic.
The skills mention `~/.claude/youtube/voice.md` and asking for the creator's videos: this channel has no voice file and nobody to ask during the run. The voice is the reference episode's style. Skip that step and do not wait for input. The skills' "ship it, or change it?" gate is replaced by the owner's standing approval above.

## Fixed facts
- Metricool brand (blogId): `8317657`, timezone `Asia/Riyadh`, YouTube is the only connected network.
- **Each run makes the NEXT day's content** (owner's standing order, 2026-11-25): the run on day D builds two videos and schedules them for day D+1 as soon as every check passes. Never ask the owner for approval or confirmation, and never stop to wait for a reply; the owner gave permanent approval.
- Publish times (on day D+1): video A at **13:00**, video B at **18:00** Asia/Riyadh (both inside Metricool's best-time window; the peak is 15:00–17:00).
- The two videos of a day must be on different topics and look different (different scenes and visual metaphors), so the channel never reads as mass-produced. YouTube does not monetise repetitive or templated content, so variety matters.
- Video hosting: files committed to `main` are public at
  `https://raw.githubusercontent.com/hashem9966/youtube-shorts/main/<path>`. Metricool downloads the video from that URL.
- Voice: edge-tts `ar-SA-HamedNeural`, rate `+5%` (host `speech.platform.bing.com` is allowed in this environment; `engine/voice.py` passes the session proxy).

## English version
- `script.json` gets an `"en"` block: `{"title", "voice":"en-US-AndrewNeural", "rate":"+10%", "lines":[{"caption","tts"?}...]}` with exactly one entry per Arabic line (timing is shared). Write natural, punchy English for a global audience, not a word-for-word translation; keep each line ≤ 7 words.
- In `scene.js`, write every on-screen word as `T('عربي','English')`, lay out multi-word headlines left-to-right when `LANG==='en'`, and use western digits in English (`T(AR(n), String(n))`). Set `window.HIGHLIGHT` with Arabic and English keywords. See the reference episode.
- Hooks: the English hook is scored directly with `hookscore.py`; titles with `title.py`. Store the English title, description and tags under `"en"` in `meta.json`.
- Build both with `engine/make.sh episodes/<ep>` → `video.mp4` and `video-en.mp4`. Preview English too: `node engine/render.js episodes/<ep> --lang en --preview ...`.
- **Where English goes:** the owner chose to post English on the SAME channel (brand 8317657), at **15:30** (video A) and **21:00** (video B) Asia/Riyadh. If `getBrandSettings` ever shows a second brand for an English channel, ask in the report before moving English there.
- Owner review: the report arrives the day before publishing; the owner may reply with edits. With no reply, the scheduled posts go out.

## Steps

1. **Setup.** `pip install -q edge-tts`. Run from the repo root. **First check `log.md` and Metricool `getScheduledPosts` for tomorrow (D+1):** if tomorrow's videos are already scheduled, do not make new ones; only do steps 2, 11 and 12. Also check that today's posts exist; if a day has nothing scheduled, report it.
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
    - publicationDate `{"dateTime":"<tomorrow>T13:00:00"|"<tomorrow>T18:00:00","timezone":"Asia/Riyadh"}` for video A and B (English: `<tomorrow>T15:30:00` and `<tomorrow>T21:00:00`);
    - firstCommentText: one short question to the viewers about the topic (fusha for Arabic, English for English), to start comments.
    Confirm the response shows the youtube provider PENDING or PUBLISHED.
11. **Log.** Append a row to `log.md` with the date, topic, title, video path, Metricool plannerUrl and status. Commit and push.
12. **Report**, in Arabic and short. The owner asked to be told when the day's content is ready, so first send a push notification with the PushNotification tool (load it with ToolSearch "select:PushNotification"). Make it one Arabic line, e.g. «فيديوهات اليوم جاهزة: <A> و<B>، أول نشر 1:00 الظهر». Then write the final message:
    - tomorrow's two videos: each one's title, publish time and Metricool link;
    - channel numbers: subscribers, views in the last 24 h/7 d, and the best video so far;
    - what the numbers suggest for the next videos (one line);
    - anything that failed or needs the owner.
