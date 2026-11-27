# How Money Moves: autopilot procedure

The owner gave Claude **full control** of this channel (content, design, production, management) on 2026-11-27. The one goal is **at least $5,000 a month** from the channel.
- Never ask the owner for approval and never wait for a reply.
- When something truly needs the owner (a login, a payment, a YouTube setting, a disconnected tool), send a PushNotification in Arabic right away, then carry on with everything else.
- Report to the owner in short Arabic.
Read `money/PLAN.md` first: niche, quality rules and the video list.

## Fixed facts
- Publish with the **Metricool Money** connector (`mcp__Metricool_Money__*`), brand **8401702**, timezone Asia/Riyadh. Never use the other Metricool connector or brand 8317657, which is the Arabic channel.
- Hosting: commit files to `main`. Their public URL is `https://raw.githubusercontent.com/hashem9966/youtube-shorts/main/<path>`. Before scheduling, check the URL returns HTTP 200.
- Audience: US, UK and EU. Publish at **22:00 Asia/Riyadh** (14:00 New York).
- Engine: `money/engine/voice_long.py` (narration and timeline), `money/engine/render_long.js` (16:9 render, previews, thumbnail, SRT) and `money/engine/longlib.js` (drawing kit). Episode 01 is the reference: `money/episodes/01-credit-cards/`.

## Weekly rhythm (the scheduled run fires Mon, Wed and Thu)
- **Monday:** make one long video and schedule it for **Tuesday 22:00**.
- **Thursday:** make one long video and schedule it for **Friday 22:00**.
- **Wednesday:**
  - Make **three Shorts** (English, 9:16, 30–45 s) with the Shorts engine in `engine/`, built from the strongest facts of the latest long videos. Each one ends with "Full video on the channel". Schedule them for Wed, Sat and Sun at 21:00 Asia/Riyadh.
  - Then do the weekly review.

## Making a long video
1. **Topic:** take the next unmade row in PLAN.md, unless analytics show a clear winner pattern to repeat (see the weekly review). Never repeat a topic in `money/log.md`.
2. **Research:** use WebSearch, primary sources first (central banks, government statistics, SEC filings, CFPB, BLS, IMF, World Bank, company reports). Every number in the script needs a source in `script.json.sources`. Mark advocacy or estimated figures as estimates in narration. Cut anything you cannot verify.
3. **Script:** 1,100–1,400 words, which is about 7–9 minutes at rate -6%. Aim for 8+ minutes once the channel is monetized, for mid-rolls.
   - Hook in the first 15 s: a question the title promises, plus proof the payoff exists.
   - 8–12 beats with chapter names.
   - A payoff, one subscribe line and the line "not financial advice".
   - Explain how things work; never give personal investment advice.
   - Write all original wording.
4. **Animation:** `scene.js` with one function per beat visual, using longlib.js. Every beat needs moving visuals that match the words: charts, flows and icons. Vary the visuals between episodes so the channel never looks templated.
5. **Check:** run voice_long.py, then render_long.js `--preview` at the start and end of every beat. Look at every frame: no overlaps, nothing under the subtitles, numbers exactly as sourced. Fix and preview again.
6. **Render:** full render, then ffprobe to confirm 1920×1080, h264 and aac.
7. **Package:** follow the `yt-package` and `yt-seo` skills.
   - Title: at most 60 chars, matching what people search for.
   - Thumbnail: at most 3 big words plus one strong visual.
   - Description: 2 search-rich lines, chapters from the beat starts, sources, the disclaimer and 3 hashtags.
   - Tags: at most 15.
   - Save all of it in `meta.json`.
8. **Publish:** commit the episode (`build/` is ignored), push, check the raw URL, then call `createScheduledPost` with:
   - type `video`, category EDUCATION, madeForKids false;
   - isAiGeneratedContent false (animation, nothing realistic);
   - a firstCommentText question.
9. **Log:** add a row to `money/log.md`: date, title, file, plannerUrl and status. Commit and push.

## Weekly review (Wednesday)
- Use Metricool Money analytics: views, average view duration, likes and comments per video, subscribers.
- Pick ONE change for next week and write it in `money/log.md` under "Reviews". Then reorder PLAN.md's list or add topics, keeping at least 8 ahead. Changes can be things like: topics that pull views, a different title style, a shorter intro.
- Track the path to monetization: subscribers toward 1,000 and watch hours toward 4,000. Estimate when each will be reached at the current pace.

## Report (end of every run)
- First send a PushNotification, one Arabic line, e.g. «فيديو How Money Moves الجديد جاهز ومجدول الثلاثاء 10 مساءً».
- Then write a final Arabic message with: what was made and scheduled, its links, the channel numbers, and the next step.
