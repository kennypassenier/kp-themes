# Demo review kit

Judge every section of a research demo in every theme from one dialog, and
copy one structured answer back into the conversation [scope-141].

## Opting in

```html
<html lang="en" data-review="my-topic" data-review-themes="formal,deco">
    …
    <section data-review-item="spinner" data-review-title="Spinner">
        <div data-review-look>
            <p data-for="formal">What to look at in formal.</p>
            <p data-for="deco">What to look at in deco.</p>
        </div>
        …
    </section>
    …
    <script type="module" src="../_review/review.js"></script>
</html>
```

`data-review-themes` is optional; without it the dialog walks all 22 themes
in the registry's order.

A section can name its own themes, `data-review-themes="formal,light"`: the dialog then asks it only in those
themes (a demo of what changed per theme, research/all-themes-applied). Without it a section is asked in every
theme the demo walks.

Catalogue blocks can ride along as a last step, each in its own theme
(shown through `block.html`, which copies the block's stages from the
catalogue page itself):

```html
<script type="application/json" data-review-extra>
    [
        {
            "page": "catalogue/field.html",
            "block": "choices",
            "theme": "deco",
            "engine": "firefox",
            "title": "Fields › Choices",
            "look": "What changed."
        }
    ]
</script>
```

## What the reviewer gets

- A bar at the top of the page: how many steps and pairs are judged,
  "Review in a dialog" and "Copy answer".
- One step per theme: every section of the demo at once, stacked as on
  "Every component, one page", and at the side one row per section with its
  look-at line and a "Not approved" box. The reviewer ticks only what is
  wrong, writes why, and approves the theme in one click (or Up); the dialog
  then loads the next theme's register and switches by itself. Left/Right
  move between steps, Escape closes, and after the last open step the dialog
  closes. Twenty-two themes are twenty-two clicks.
- Full screen on a phone: the sections on top, the rows and buttons below.
- At the foot of the page, the answer:

```
Demo review · signature-elements · 228 of 228 judged, 227 approved, 1 not approved, 0 open

Approved in full: formal, light, dark, …

Catalogue pairs approved:
- field--choices · deco · firefox

Not approved:
- switch · light: the thumb is too small
```

Verdicts and notes live in the browser's localStorage under
`kp-demo-review:<demo id>`, until "Clear all verdicts".

## A second round

After fixing what was not approved, add a round marker with a new id to the
demo, and keep its demo id:

```html
<script type="application/json" data-review-round>
    { "round": "r2" }
</script>
```

On the reviewer's next visit the new round reopens every pair rejected
before it, once, and keeps every approval: the dialog walks only the rejected
pairs, with no stored answer to clear by hand. Name pairs in `"reopen":
["<theme>|<item>", …]` only when something approved was redrawn too.

The Agenda (catalogue/agenda.html) and "To judge" (catalogue/changed.html) then show the demo as "Updated ·
<themes>", naming the themes the round reopened; "Not started" is only for
a demo never judged in that browser.
Once every pair has its verdict again the demo moves under Decided at once,
without waiting for its archiving. While a session rebuilds a round, it marks
the demo's entry in `catalogue/pages.js` with `rework: '<why>'`; "To judge"
leaves it out until the flag is removed with the new round.

A demo republished without a new round id is caught as well: every verdict
carries the round it was given in and a fingerprint of the demo's page and
of the scripts and sheets in its own folder (`progress.js`, `fingerprintOf`).
A verdict of this round on other files is open again, in the dialog and in
"To judge", which then calls the demo updated. Under Decided, "To judge" also
lists every demo in "Archived research", with the decision its `decided.json`
records.

## Keep the round Kenny judged: the previous version

Kenny, 2026-10-13: before and after, "onmisbaar". Every section in the dialog has a **Previous version (V)** button
that shows the section as he saw it in the round before, in the same theme, in place of the current one; V again
brings the current one back. It reads a snapshot kept beside the demo, so it works on the static review site.

**The publish step**, once per round, before the demo's files change for the next round (so `HEAD` still holds the
round he judged):

```sh
node research/_review/snapshot.mjs <topic>            # from HEAD
node research/_review/snapshot.mjs <topic> --from <commit-of-the-judged-round>
```

It writes `research/<topic>/_previous/`: the demo's own folder, every stylesheet of `css/` and the modules the demo
imports, as they stood then, plus `previous.json` (`round`, `commit`). The review kit and the catalogue shell are left
out of the copy, so it never reads or writes verdicts; the fonts come from the live `fonts/`. Commit the folder with the
new round. One snapshot per demo (about 4.5 MB): the next round's run replaces it, and archiving the demo removes it.
Without a snapshot the button stays disabled and says why; a section new in this round says it has no earlier version.

## Play open and close, slowly

Every section in the dialog also has **Play open and close (L)** and a speed, **1×** or **¼×**. The kit presses the
section's own opener, lets the opening play out, closes it the way the demo closes it (the same toggle, the dialog's
own close request, the popover's hide, or the focus leaving a combobox), waits, and repeats until L is pressed again.
The opener is the one the demo marks `data-review-replay`, else the first of the package's openers in the section
(also inside a same-origin window in it): a side navigation toggle, the palette, a dialog or popover button, a
combobox, a menu button. ¼× runs every animation of the section, and of the previous version when it is shown, at a
quarter of its rate (Web Animations `playbackRate`), so a demo needs no speed control of its own.

## Auto-next, across demos

After **Approve** the dialog goes to the next open pair, across themes, as before. Opened from the Agenda
(`catalogue/agenda.html`, `?next=` back to it), the last open pair of a demo no longer ends at the answer: the page goes
back to the Agenda with `?auto=next`, and the Agenda opens the next item that waits by itself, in its order, skipping
what has nothing open. The answer is kept per demo (`progress.js`, `keepAnswer`, under `kp-demo-review:<id>:answer`);
the Agenda shows **Answers to paste** for every answer not yet copied and copies them together in one press. The demo's
own **Copy answer** marks its answer copied too.

## A later round shows only what is open

Kenny, 2026-10-13: "toon je geen al goedgekeurde elementen meer en wis je de vorige commentaar". On the demo page a section
whose every pair is approved is hidden behind one line ("N approved section(s) hidden"); add `?review=all` to the address to
see them again. When a round, an update or a republished demo opens a question again, his earlier words are wiped: the
dialog says only that the question is open again and, with an `update.json`, the session's answer; the comment is not
repeated. The first round, before anything is approved, shows the whole page.

## An update after a verdict

When a session republishes a demo after Kenny's verdict, it writes
`update.json` beside `demo.html`:

```json
{
    "update": 1,
    "picks": { "terminal": { "curve": "cells", "hover": "ring" } },
    "questions": {
        "terminal": { "loading": { "comment": "Kenny's words, verbatim", "reply": "What changed and how, or what is proposed" } }
    }
}
```

`picks` are the questions he approved: the dialog takes them as answered and
no longer walks them. `questions` are the ones the update opens again; the
dialog shows each with his comment and the reply beside it, and "To judge"
calls the demo "Update 1 · Terminal". The next update raises the number and
lists only what it opens again; picks only grow.

## Choices to tick

When a demo asks the reviewer to pick between options, the options go in the
dialog as choices to tick, never as a number typed into a note (Kenny,
2026-10-04). A section lists them in `data-review-choices`:

```html
<section
    data-review-item="leave"
    data-review-choices='[
  { "id": "exit", "label": "Exit for this theme",
    "options": [{ "value": "1", "label": "Exit 1", "hints": { "formal": "Blotted out …" } }, …] },
  { "id": "space", "label": "When the space closes", "once": true,
    "options": [{ "value": "together", "label": "During the exit", "hint": "…" }, …] }]'
></section>
```

A choice is asked per theme, or with `"once": true` once for the whole demo.
Each option may carry a `hint`, or `hints` by theme, shown under its label.
Approving refuses until every choice is ticked; ticking fires `review:choice`
(`{ id, value }`) on the section so the page can show the pick; the picks are
in the answer under "Picked per theme" and "Picked once".

## The pointer, played

A character demo draws the part pointed at with a class of its own,
`<prefix>-pointed` (or `<prefix>-pointed-<part>`). On the `hover` aspect,
or on the aspects the section names in `data-review-point="hover …"`, the
dialog takes that class away and gives it back on a loop, so each option's
hover plays as the pointer arrives and leaves, at the dialog's speed. Replay
starts it over, Pause holds it, and reduced motion keeps the still frame.

## Measuring the motion of a character demo

`measure-motion.mjs` measures what the motion scenes of a character demo
really do, frame by frame, in Firefox (Kenny, 2026-10-07: a dialog that
"measured" 520 ms read as near-instant next to 900 ms stems). It stops the
demo's clock, drives every `.<p>-scene[data-<p>-kind="cycle"]` through
`gap → in` and `hold → out` itself, pauses every animation that starts and
seeks them together in 10 ms steps. Per animated part it reports t50 and t90
(when the part is half and nine tenths of the way, a clip-path counted by the
area it shows), the run from the first visible change to the last, `FRONT`
when nine tenths are done in the first 30 % of the run, and, for every part
that arrives, whether its close is its arrival played backwards (within one
frame and 8 % of each value's range).

A part that turns (a plate going round a part by `translate` or a
`drop-shadow` offset, or a `rotate`) also gets its turn in degrees, positive
clockwise. A leave that is not the arrival played backwards but turns the
same way is a rule broken on purpose (grotesk, update 2: Kenny only likes the
plate going clockwise, so its loop and its leave do not mirror): it is
reported as `clockwise both ways, not mirrored on purpose (in +315°, out
+334°)`, or as `leave drawn by <part>, clockwise`, and not as a mirror fault.

```sh
python3 -m http.server 8743 --bind 127.0.0.1   # from the repository root
node research/_review/measure-motion.mjs research/nostromo-character [--aspect opening] [--parts] [--json out.json] [--width 900]
```

No gate runs it. Imported, it lends `table`, `timing` and `reversed` to a
script that measures other motion the same way.
