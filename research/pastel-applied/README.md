# Pastel, as applied: what changed

**Decided (Kenny, 14/10/2026 16:50): all 23 blocks approved in round 2 (round 1: 21 of 23; the side navigation and the key figures mended). Pastel is finished: nothing in this demo is open.** What the meters still report is in `_audit/MISSING.md`.

Kenny approved pastel's character in full on 2026-10-14 03:23 (research/pastel-character/decided.json, 19 of 19). This page shows
every pastel component the port changed (css/pastel-register.css, its signature layer; js/loading-pieces.js; themes/pastel/tokens.json),
as the package itself: the real stylesheets, the real markup of the catalogue pages and the real scripts through `js/auto.js`. No scene is
drawn for the page. Loading is the real busy state (`busy()` on the data table, `setCalendarState()` on the month,
`data-kp-indeterminate`, `aria-busy`, `data-kp-loading`).

It is a review-kit demo in plain mode (`research/_review`): one judged block per item, Approve or Not approved with a note, in the review
dialog or under each block. Round `2026-10-14-r1`. Theme: pastel only. The words Kenny reads (the intro, each block's heading and what to
look at) are Dutch; the components' own sample content is the catalogue's.

## How to judge it

The anchor is **printed twice, stuck on**: a part's second pass (a flat sky silhouette, no words) springs from a wide misregistration into
its rest 6 px off register, down and toward the end, and 120 ms later the part swings down onto it from its top-start corner, on the soft
landing (one 8 % overshoot, settled once); one landing is 560 ms and a close is that landing played backwards. A part fixed to the page
then gets a thumbtack at its top centre, which comes out first when it leaves. Look for:

- the sky pass beside every plate, never a soft shadow;
- two radii and the pill: plates 1.2 rem, controls 0.85 rem, chips and the tooltip pills;
- the corner that curls into a fold under the pointer, the dashed plum focus line alone, the press that sticks a part down flat;
- the wobble of a value that changes;
- the pom-pom caterpillar for everything that waits, and the spinner as the caterpillar going round a day sticker.

## The blocks

1 to 20 are the blocks of the cyberpunk and forest applied demos (the bar, tabs, side navigation, palette, date picker, theme menu,
combobox, tour, dialogs, alarm, fields, check pairs, table, tree, legend, calendar, buttons, prose, loading, popover menus), each
explained for pastel. Three blocks are pastel's own:

21. **Key figures, tones, a live change**: the tone stickers, a warning and a failed figure's label on its tone's plate, a key figure that
    acts, and `update()` playing the wobble.
22. **Alerts and toasts**: paper in the hand, its own pass and plate, dismissed and shown again, a toast.
23. **Pinned**: a card leaves (the thumbtack first) and comes back (the thumbtack last).

## How the two passes are two layers

In the demo the pass and the part are sibling boxes, so the part can be invisible while its pass is already there. In the package a part
is one element, and its opacity and its turn carry its pseudo-elements with it, so the register draws the pass outside the part where it
can (the part's own `::backdrop` for a dialog, a popover, a menu, the date picker and the combobox list; its holder's `::after` for the
bar's menus and a tooltip; both placed by CSS anchor positioning, which reads the part's layout box, never its turn) and, where it cannot
(a toast, an alert, the tour's card, the side navigation, the busy panels), lets the part draw its own plate and pass with two registered
numbers carrying the two clocks (`--kp-sig-pa-pass`, `--kp-sig-pa-ink`). See the comment at the head of the signature layer.

## The audit

The measured state lives in `_audit/` (copies of research/all-themes/_audit, pointed at this page; `lib.mjs` re-dresses the page in another
theme when `KP_THEME` names one) and its findings in `_audit/MISSING.md`. Firefox only:

```
node research/pastel-applied/_audit/identity.mjs
node research/pastel-applied/_audit/pairs-meter.mjs --theme pastel --page /research/pastel-applied/demo.html
node research/pastel-applied/_audit/tab-paint.mjs
node research/pastel-applied/_audit/contrast-sweep.mjs
node research/pastel-applied/_audit/edges.mjs pastel
```

## Files

- `demo.html`: the twenty-three blocks, the round marker, the review kit.
- `demo.css`: the page's layout only, colours through the theme's tokens.
- `demo.js`: what the package leaves to an app: the theme menu's markup, the tour's steps, the table's and the month's busy states, a
  replay of the arrivals, the right-to-left switch, the live update, an alert shown again, a toast, a card that leaves and comes back.
- `_audit/`: the audit scripts and `MISSING.md`.
