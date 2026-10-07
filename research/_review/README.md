# Demo review kit

Judge every section of a research demo in every theme from one dialog, and
copy one structured answer back into the conversation [scope-141].

## Opting in

```html
<html lang="en" data-review="my-topic" data-review-themes="formal,retro">
    …
    <section data-review-item="spinner" data-review-title="Spinner">
        <div data-review-look>
            <p data-for="formal">What to look at in formal.</p>
            <p data-for="retro">What to look at in retro.</p>
        </div>
        …
    </section>
    …
    <script type="module" src="../_review/review.js"></script>
</html>
```

`data-review-themes` is optional; without it the dialog walks all 22 themes
in the registry's order.

Catalogue blocks can ride along as a last step, each in its own theme
(shown through `block.html`, which copies the block's stages from the
catalogue page itself):

```html
<script type="application/json" data-review-extra>
    [
        {
            "page": "catalogue/field.html",
            "block": "choices",
            "theme": "retro",
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
- field--choices · retro · firefox

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

"To judge" (catalogue/changed.html) then shows the demo as "Updated ·
<themes>", naming the themes the round reopened; "Not started" is only for
a demo never judged in that browser.
Once every pair has its verdict again the demo moves under Decided at once,
without waiting for its archiving. While a session rebuilds a round, it marks
the demo's entry in `catalogue/pages.js` with `rework: '<why>'`; "To judge"
leaves it out until the flag is removed with the new round.

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

```sh
python3 -m http.server 8743 --bind 127.0.0.1   # from the repository root
node research/_review/measure-motion.mjs research/nostromo-character [--aspect opening] [--parts] [--json out.json] [--width 900]
```

No gate runs it. Imported, it lends `table`, `timing` and `reversed` to a
script that measures other motion the same way.
