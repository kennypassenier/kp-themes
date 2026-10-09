# The coherence round for the remaining themes — handoff

**Status (2026-10-08, written so that any session, local or cloud, can finish
this round from here).** Kenny asked on 2026-10-08 for the round the nine
finished themes had (anchor → character demo → update rounds → apply) for
formal, light, high-contrast, sepia, retro, dark, deco and phantom. High-contrast
and sepia were dropped from the package on his word (scope-143), and retro on
2026-10-09 (its demos removed; the idea is in docs/FUTURE_THEMES.md). Everything
below is on the branch `claude/eloquent-hamilton-37jler`, published at
<https://kennypassenier.github.io/kp-themes/review-branch/catalogue/changed.html>
(the Pages workflow run with `review_ref` set to that branch; see "Publishing").

## State per theme

| Theme   | Step 1 anchor                                                                                                                                                    | Step 2 character demo                                                                                                                                   | Step 3 updates                                                        | Step 4 apply                                                                                                                                                                      |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| formal  | decided: the double rule (research/formal-anchor/decided.json)                                                                                                   | decided in full, 2026-10-08 (research/formal-character/decided.json; hover = a rule under the label, motifs = plus the seal where picked)               | none needed                                                           | **applied** 2026-10-08 (css/formal-register.css, research/character-\*/formal.css; notes in themes/formal/CHARACTER.md §4; findings under Formal in research/PACKAGE_FINDINGS.md) |
| light   | decided: the glare (research/light-anchor/decided.json)                                                                                                          | decided in full, 2026-10-08 (research/light-character/decided.json; durations = unhurried 200 · 700 (+120) · 3600, busy bar = the bead orbits the line) | none needed                                                           | **applied** 2026-10-08 (css/light-register.css, research/character-\*/light.css; notes in themes/light/CHARACTER.md §4; findings under Light)                                     |
| deco    | decided: the fan opens; the progress bar to be redone (research/deco-anchor/decided.json)                                                                        | built; **not approved on 13 of 19** (6 picks kept, see themes/deco/CHARACTER.md §0)                                                                     | **update 1 published** 2026-10-08 (round r2), waiting for his verdict | after update 1: re-propose §1 of themes/deco/CHARACTER.md from the verdict, then apply                                                                                            |
| dark    | decided after update 1: the line lays the film down, turning (research/dark-anchor/decided.json)                                                                 | **published** 2026-10-08 (themes/dark/CHARACTER.md, research/dark-character), waiting for his verdicts                                                  |                                                                       |                                                                                                                                                                                   |
| retro   | **dropped 2026-10-09** (Kenny: "I am so disappointed in retro that we simply scrap the whole theme for now"); no demo kept, the idea is in docs/FUTURE_THEMES.md |                                                                                                                                                         |                                                                       |                                                                                                                                                                                   |
| phantom | decided after update 1: thrown as a screen, resolves at the slap (research/phantom-anchor/decided.json)                                                          | **published** 2026-10-08 (themes/phantom/CHARACTER.md, research/phantom-character), waiting for his verdicts                                            |                                                                       |                                                                                                                                                                                   |
| pastel  | not started (in Kenny's THEME list, not in his named eight; ask before starting)                                                                                 |                                                                                                                                                         |                                                                       |                                                                                                                                                                                   |

Formal and light are applied to their registers (2026-10-08, no release); tests
run only at a release (Kenny, 2026-09-30) and no release is part of this round.

## Kenny's rules for this round (binding, verbatim where it matters)

- Per theme: (1) an anchor demo with 6–10 bold candidates, one recommended;
  (2) after his pick, the character demo "What makes THEME THEME" with the
  nineteen questions (motion curve, direction, opening, durations, colour,
  corners, surface, warning, live update, loading, busy progress bar, spinner,
  leaving/arriving, buttons in composites, hover, focus, press, voice/type,
  motifs), several visibly different options each, one recommended, all
  following from the anchor; (3) update rounds via `research/<demo>/update.json`
  in the SAME demo (his comment verbatim + the reply), the page's
  `data-review-round` bumped (`2026-10-08-r2` …), "To judge" reads
  "Update N · THEME" (the `rework:` flag in catalogue/pages.js hides the demo
  from To judge until the new round is in; remove the flag with the new round);
  level up clearly on a rejection (5–10 new options if he is unconvinced);
  (4) apply: decided.json, CHARACTER.md §0, README status, archive the demo
  (move it to 'Archived research' in catalogue/pages.js with a comment line; the
  README needs a `**Decided (` line at line start for check:catalogue), apply
  to `css/THEME-register.css` and the `research/character-*` variants, check
  390 and 1280 px, gates, push, look at the live site. Small package issues are
  fixed; larger ones go to research/PACKAGE_FINDINGS.md under a THEME heading.
- Demo rules: one aspect per page/row, element centred, plays by itself,
  replay control, nothing clipped, works inside the review dialog (every demo
  rule hangs on the scene, never on the page: the dialog moves the section into
  its stage), approved picks pre-ticked, options on a row share one duration,
  plain-word descriptions, visual choices only as dialog options, never real
  JobTracker data.
- Design rules: world-class frontend; symmetric motion (every close is its open
  reversed, same duration; timing functions inside `@keyframes` must be
  literal, an eased open closes on the inverse curve
  `cubic-bezier(1−x2, 1−y2, 1−x1, 1−y1)`, `steps(n, jump-end)` ↔
  `steps(n, jump-start)`); honest motion measured as seen (say "measured in
  Chromium" when it was); consistent within a theme, distinct between themes
  (briefs/distinct.md lists every theme's claimed devices); loading animated,
  fills the whole element, shaped like the result; the network graph changes in
  no theme; colours only via tokens (DI9; relative colour syntax is fine); no
  `style=` attributes; other sessions' theme files are not ours; lapis,
  shade-light, shade-dark, high-contrast and sepia are gone.
- Working rules: "Keep going without asking, unless there is a real choice only
  I can make. Tests only at release: no new test specs, never rerun green tests,
  commits pass fmt, lint and gates. Don't release. Other sessions may push to
  main at the same time, so always rebase on origin/main before you push. Work
  lean: use Sonnet for helper agents, run one quick browser check, and skip
  extra passes. Updates go in your status checklist with Brussels time. Reply
  only with a result, a blocker or a choice, keep replies short, and don't list
  commit hashes. Never ask me to check that the package matches what I
  approved." Talk to Kenny in Dutch; code and comments in English. Commit
  messages need an ID in brackets (the hook); this round uses `[scope-141]`
  (every research demo judged in one dialog).

## The pipeline (how the demos are made)

1. **Design** (the designer writes, in English, as data): for an anchor demo
   `research/<theme>-anchor/anchors.js` (THEME, LABEL, UNIT, QUESTION, WHY,
   LOOK, ANCHORS[{key, name, see, follows, why, caps, hero, bar, button}] with
   an implementation comment above each candidate); for a character demo
   `research/<theme>-character/aspects.js` (THEME, LABEL, TITLE, STORY{what, so,
   decided}, ASPECTS[{id, label, rule, question, why, kind: cycle|loop|still,
   scene, options[{key, name, see, verdict}]}]). research/formal-anchor and
   research/light-character are the finished references; briefs/ holds the
   per-theme briefs (what the theme is today, measured from its register and
   its decided picks) and distinct.md (what every theme owns, so nothing is
   borrowed).
2. **Build** by an agent on the template, from a prompt like
   briefs/agent-prompt.md (anchor), briefs/prompt-char-formal.md (character)
   or a section of briefs/prompt-upd-character.md (an update round). The anchor engine is
   research/formal-anchor/{demo.js, demo.css, options.css's `.an-scene`
   block}; the character engine is research/forest-character (demo.js with PART
   helpers and scene builders, one clock `data-xx-phase`, State buttons
   rest/hover/focus/press, gallery iframes). Everything in `@layer
kp.signature`, scoped to the scene.
3. **Check**: tools/shots.mjs (screenshots at 1280 and 390 px mid/hold/out,
   the review dialog, a clipping list and console errors), tools/mirror.mjs
   (every close is its open reversed: samples the computed style of every
   animated part on `in` and on `out` and compares mirrored times),
   tools/freeze.mjs (paused frames at chosen times; the only reliable way to
   see a motion frame, because screenshot latency in Playwright is about 500
   ms). The scripts need the repository's Playwright: copy one to
   `tests/tmp-<name>.mjs`, run it from the repository root against a static
   server (`python3 -m http.server 8743 --bind 127.0.0.1`), delete it after.
   Chromium at `/opt/pw-browsers/chromium` was the only engine in the cloud
   container; `research/_review/measure-motion.mjs` is Firefox-written and
   misreads the out phase in Chromium, which is why mirror.mjs exists.
4. **Commit** per finished demo (`npm run gates` passes apart from the
   Node-22-only `npm test` glob failure and two pre-existing unit tests, KT7 and
   the README gate count, which Kenny said to leave), rebase on origin/main,
   push, publish, report in Dutch, end "waiting on review".

## Publishing

`.github/workflows/pages.yml` takes a `workflow_dispatch` input `review_ref`;
with it set to a branch, the site is built from `main` as usual and that
branch's catalogue, research, examples, css, js and fonts are copied to
`/review-branch/`. Trigger it on the branch itself (the GitHub Actions UI, or
the API: run `pages.yml` with ref = the branch and input `review_ref` = the
branch); the `github-pages` environment allows all branches since 2026-10-08.
Kenny starts from `review-branch/catalogue/changed.html`.

## What remains, in order

1. **Verdicts on the review site** for deco's update 1 (thirteen questions),
   dark and phantom (nineteen each). Then per theme: an update round
   (research/_review/README.md; the rework flag; 5–10 new options where he is
   unconvinced) or step 4, the apply, as briefs/prompt-apply.md describes it
   (formal and light are the worked examples: `git log -- css/formal-register.css
css/light-register.css`).
2. **Deco's §1** in themes/deco/CHARACTER.md is still round one's grammar
   (counted rays); once he answers update 1, re-propose G1–G21 from the
   answers, then apply.
3. **Package findings** under Formal and Light in research/PACKAGE_FINDINGS.md
   (js/motion.js cannot replay a custom-property animation, a leave plays
   element by element, the live update's time cannot be set by a register, a
   menu's line count, the manners' selector list) go to the port session.
4. **Pastel** only if Kenny asks.

## Scratch output

Screenshots and sheets of the tools go to `research/_coherence/out/`
(git-ignored).
