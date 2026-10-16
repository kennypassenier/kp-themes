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

A demo that asks more than one theme groups its sections into topics (Kenny, 2026-10-16), one attribute per section;
the first section of a topic carries its title:

```html
<section data-review-item="heat" data-review-topic="matrix" data-review-topic-title="Matrix and heat grid">…</section>
<section data-review-item="matrix" data-review-topic="matrix">…</section>
```

A section without `data-review-topic` is a topic of its own. See "Topic steps" below.

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
- A round that asks more than one theme, or one theme with sections in two or more topics: grouped by topic, one
  step per theme within a topic, the topic's sections in that one theme (see "Topic steps" below). A round that asks
  one theme without topics, and a demo of aspect pages:
- One step per theme: every section of the demo at once, stacked as on
  "Every component, one page", and at the side one row per section with its
  look-at line and a "Not approved" box. The reviewer ticks only what is
  wrong, writes why, and approves the theme in one click (or Up); the dialog
  then loads the next theme's register and switches by itself. Left/Right
  move between steps, Escape closes, and after the last open step the page
  goes straight back to the Agenda (or the `?next=` hub). Twenty-two themes
  are twenty-two clicks.
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

## Topic steps

Kenny, 2026-10-16 16:43: "Kunnen we de demo ook indelen zodat we per topic/thema werken. bv een groepering van
gelijksoortige componenten zoals de matrix eerst voor alle thema's, dan de volgende groep etc, zo behoud ik het meeste
context en kan ik het best vergelijken, doe dit vanaf nu altijd waar mogelijk".

When the sections of a demo are asked in more than one theme together, the dialog walks **topic-major, one theme per
step** (Kenny, 2026-10-16 17:44: "misschien best per group, maar dan 1 item per thema per approval, want terminal lijkt
eindeloos lang te zijn en ik geraak niet aan items onder terminal"): all the themes of the first topic, in the demo's
theme order, then all the themes of the next topic, in the page's order. A step shows the topic's sections in that one
theme, section by section under its title, each in a frame of its own at the full width of the stage (the demo itself
at `?theme=<theme>&rv-lane=<item>`, isolated to that section the way the previous version is), under a head that names
the theme and sticks while the section scrolls past. The step's title names topic and theme ("Matrix and heat grid ·
Cyberpunk"), its position line where the theme stands in the topic ("3 of 15 themes"). The frames load as they come
near the view.

- At the side, under the theme's name, one row per section with its look-at line and its "Not approved" box: the
  verdict stays one per section × theme pair, and a pair ticked "Not approved" marks its frame too. Up approves this
  theme for the topic and goes on to the next open step, the next theme of the same topic.
- The demo's controls are mirrored once on top; a press acts on every frame of the step (a frame that loads later
  replays the presses made before it).
- V and L (previous version, play open and close) act on the frame most in view, or on the frame the key was pressed
  in; each frame's head carries its own buttons.
- Only open pairs are shown and a step whose pairs are all approved is skipped; the counters count steps and pairs as
  before, the answer keeps its lines per section and theme (`- matrix · deco: …`), "Still open" names the open steps
  (topic · theme), and after the last open pair the page goes straight back to the Agenda (or `?next=`).
- A frame's theme stays its own: the theme a frame's head stores is put back, and neither the page nor another frame
  takes it over. The topic attributes are left out of the demo's fingerprint, so adding them to a round under way
  reopens nothing.
- A frame takes its document's height (block-tools.js, `isolate`). Nothing in the isolated document may size itself
  by the frame: the catalogue's `body.cat-shell { min-block-size: 100vh }` plus terminal's bezel padding on the root
  made terminal's document two bezels taller than its frame, so the frame grew without end and nothing under it could
  be reached. `isolate` resets the least height of `html` and `body`, and a frame whose document grows by the same
  step five times in a row stops following it.

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

## Finishing a demo, and the answer kept

After **Approve** the dialog goes to the next open pair, across themes. The last open pair judged, the dialog closes and
the page goes straight to the hub it was opened from (`?next=`), else to `catalogue/agenda.html`: no end dialog, no
choice and no copy option (Kenny, 2026-10-16, retiring the small end dialog of that morning with Back to the Agenda,
Copy answer and Stay on this page). The answer is already kept for the Agenda's **Answers to paste**, so leaving loses
nothing. Nothing opens the next item, or the same one again, by itself (Kenny, 2026-10-14, retiring the auto-next of
2026-10-13, which sent a finished demo back to the Agenda, reopened it there and lost his two notes). The answer is kept per demo (`progress.js`, `keepAnswer`, under `kp-demo-review:<id>:answer`); the
Agenda shows **Answers to paste** for every answer not yet copied and copies them together in one press, and the demo's
own **Copy answer** marks its answer copied too. When a round, an update or a republished demo opens questions again
and wipes their words before the answer was copied, that answer is carried along (`carryAnswer`) and stands at the top
of the new one until it is copied.

## A later round shows only what is open

Kenny, 2026-10-13: "toon je geen al goedgekeurde elementen meer en wis je de vorige commentaar". On the demo page a section
whose every pair is approved is hidden behind one line ("N approved section(s) hidden"); add `?review=all` to the address to
see them again. When a round, an update or a republished demo opens a question again, his earlier words are wiped: the
dialog says only that the question is open again and, with an `update.json`, the session's answer; the comment is not
repeated. The first round, before anything is approved, shows the whole page.

## A re-review shows only the open pairs, and the verdicts are recorded

Kenny, 2026-10-13 and again 2026-10-16: a re-review round shows ONLY the pairs (section × theme) he has not approved yet.
Approved sections and themes leave the demo (the page, not just the dialog), old comments are wiped (a reopened pair does
that by itself), because approved items only confuse him. To keep a page honest the verdicts are recorded beside the demo in
`research/<topic>/VERDICTS.json`, one file per demo, per round, per section, per theme:

```json
{
    "demo": "my-topic",
    "rounds": [
        {
            "round": "1",
            "allJudged": false,
            "approved": [{ "item": "keys", "theme": "formal" }],
            "notApproved": [{ "item": "toolbar", "theme": "formal", "note": "Kenny's words" }]
        },
        { "round": "2", "allJudged": true, "notApproved": [] }
    ],
    "reopened": [{ "item": "toolbar", "theme": "formal", "reason": "the component itself was redrawn after the approval" }]
}
```

A round with `"allJudged": true` approved every pair of the page that is not in its `notApproved`; otherwise only the pairs in
`approved` were judged. The latest round that names a pair wins. The session that receives Kenny's answer adds the round
before it touches the demo. To re-review: delete the approved sections from the page, give the others
`data-review-themes` naming only their open themes, and name the redrawn pairs in the round's `reopen`.

**Received rounds are not carried.** The demo's answer is kept in the browser until Kenny copies it, and carried into a
round that reopens questions; the Agenda then says it has not been copied. An answer Claude already received (Kenny
delivered it through a form, so the kit never saw a Copy press) must not come back (Kenny, 2026-10-16: a fresh round starts
empty). When recording a round in `VERDICTS.json`, add `"page": "<id of the page round that answer was given on>"`, and list
the same ids in the new page round's script: `{ "round": "r4", "received": ["r3"], "reopen": [...] }`. The kit stores the
page round id with every answer; on the demo page and on the Agenda it deletes an answer (or carried words) of a received
round. An answer stored without a round id belongs to the round before the current one, so it is dropped as soon as
`received` is non-empty. An answer of a round not listed stays and is still counted as not copied. The gate below refuses a
page whose `received` differs from the `page` ids in `VERDICTS.json`.

`gates/check-rereview.mjs` (in `npm run gates`) refuses a demo with a `VERDICTS.json` whose page still offers a pair whose
latest verdict is approved, and names the pairs. The only way past is a `reopened` entry with a written `reason` (the
component changed after the approval). A demo whose every pair is approved is Decided instead: `decided.json`, the README's
"**Decided (" line and a place under "Archived research" in `catalogue/pages.js`; it is not offered again.

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

## A raised surface keeps its plate

Kenny, 2026-10-16, on the folding bar's More menu in phantom: "het geopende menu heeft geen achtergrond waardoor het niet goed
leesbaar is", and "zie dat het in de toekomst niet meer gebeurt". The menu was fine on the page and see-through in the review dialog:
phantom makes a list inside a dialog bare (it is part of that surface), and the review dialog is a `.kp-dialog`. A menu that floats out
of its own button is never part of the surface its button stands in. `gates/check-raised-plate.mjs` (in `npm run gates`) refuses a
register rule that takes the background from a menu or popover inside another surface without excluding the raised ones. To measure
instead of read, `plate-fixture.html` opens every raised surface on the page, in a card, a dialog, a drawer and a popover:

```sh
python3 -m http.server 8743 --bind 127.0.0.1   # from the repository root
node research/_review/measure-plate.mjs [theme …] [--port 8743]
```

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
