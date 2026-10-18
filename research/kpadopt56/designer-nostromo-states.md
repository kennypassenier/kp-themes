# kpadopt56 designer report, round 2: DEMO_RULES chapter 3 (states) in nostromo and titanium

Branch `theme/t56-d`, helper t56-d, 2026-10-18. Firefox only, the worktree served with `python3 -m http.server`, no test run.
Every section of the eleven pages `research/kpadopt56-<topic>/demo.html` that has loading, empty or failed states (34 of
79) was driven through its state buttons in nostromo, titanium and formal (the reference for "shared"), at 1280 and 390 px.
Per state: the driven component's height against its loaded height and the section height (layout shift), the plate's title
size, the title's and buttons' centre against the plate's centre, the Retry's size, the busy card's size and position over
its component, and a screenshot sheet of every state looked at. Only `css/nostromo-register.css` and
`css/titanium-register.css` were edited (plus the generated files the commit gates force).

## Commits

| theme | fix | commit | measured |
|---|---|---|---|
| nostromo | The empty plate's ink tape, the card state's title and the stateplate's empty title are one tape at heading size (about 20 px); they were 12.8 px (formal 16 and 19 px), the stateplate's had no tape | df321bda | 12.8 px -> 19.5 to 21 px in runs, dated, request inspector, today, quote, passkeys, thread, and the stateplate empties (usual, deplist, console, notices, calm, focus, uses, trace, availability, gallery, entity) |
| nostromo | A failed card's title inherits the klaxon plate's cream; the shared rule gave it the page ink, dark on the solid red alert | bc57a027 | request inspector, today, quote "Could not read ...": dark ink on rgb(129,33,14) -> rgb(237,232,222) |
| nostromo | The quote card keeps its loading room (`--kp-quote-min`) in every state; the busy panel (reel, words, LED window, 128 px) outgrew the quote at rest | 13520302 | quote card 152 -> 178 px on Loading (+26); now Ready, Loading, Empty, Could not read all 178 |
| titanium | The card state's title at heading size in the display face (was 13 px engraved mono) | 02cae4ce | 13 px -> 21 px (request inspector, today, quote) |
| titanium | Retry, Add, Try again in a state plate take the control size; they inherited the plate's 23.7 px | 4b43793a | 23.7 px -> 16 px in a 36 px key (also a shared fault, below) |
| titanium | The picked master-detail row keeps the list's weight (600 wrapped a long name to a fourth line) | 0fd7c2bd | Failed (row picked) 504 against Nothing picked 480 px -> equal; the list 478 / 454 px -> equal |

## Per section: the driven component's height, state against loaded (1280, nostromo / titanium; 390 where it differs)

"=" means every state has the loaded height (no shift). Everything marked "shared" is identical in formal.

| section | loaded -> states | note |
|---|---|---|
| runs-states | 166 = 166 (all four) | 390: Ready 203 -> 166, shared, identical in formal |
| snooze-states | 204 -> 204, Snoozed 248 | the "Snoozed until" line appears, shared |
| sentence-states | 134 -> 134, Wrong time 162 | the reason line appears, shared |
| usual-states | stage 288 = 288 | |
| intent-states | palette 549 -> 549, Failed 556 / 594 -> 594, 553 | the failed plate is a fixed 176 px, the list is not; formal 569 -> 552, shared |
| dated-states | 397 / 405 = 397 / 405 | |
| slider-states | 44 -> 44, Wrong value 68 | message appears, shared |
| time-field | 60 -> Loading 101 / 98, Invalid 83 | a line appears under the field in loading and invalid; formal 108, shared |
| autosize-states | = | busy card compact (184 x 84 in 86 px) |
| rating-states, version-states, ack-states, deplist-states (228), unsaved-states | = | ack "No gate" removes the alerts by design |
| claim-row | checklist 699 / 662 -> Empty, Failed 525 / 523; 390: 1704 -> 691 | plate fills only its own 450 px; formal 673 -> 525, shared |
| master-detail | detail 356 = 356 (nostromo); titanium 404 / 380 -> 404 = 404 after 0fd7c2bd | |
| payload-cell | table 872 / 847 -> 765 / 735 (Loading), 755 / 733 (Binary, Empty), 790 / 764 (Failed) | the last row's cell is one line per state, by the page; formal 823 -> 724..741 |
| request-inspector | 7 requests 1276 / 1232 -> Empty 442, Failed 442 (390: 1841 / 1815 -> 496) | the card's failed alert is a 71 px strip, formal 76; shared |
| interactive-console | 400 = 400 | |
| ops-page | section 5204 -> Page failed 5180 in nostromo, 0 in titanium and formal | in the 388 px frame the Ready alert title wraps to two lines and the failed one to one (24 px); the text differs per state, page |
| notices | 1321 -> 584 (Loading, Nothing waiting, Failed) | formal identical, shared |
| today-states | section = ; card Empty 108 / 97, Failed 71 / 72 | strips not the loaded card; formal 143 and 76, shared |
| calm-tones-states | 346 = 346 | |
| quote-states | 178 = 178 (nostromo, after 13520302; was 152 -> 178); titanium 176 -> Loading 178 (+2, formal +2) | |
| focus-states | 447 .. 466 = | |
| chart-annotations | section = | no busy card (shared) |
| uses-states | matrix 476 -> Loading 464, Empty and Failed 288 | formal identical, shared |
| trace-states | 316 = 316 | the busy card sits in a 136 px strip at the top, shared |
| availability-grid | phone list 1368 / 1512 -> 408; 1280: 366 | the plate is its own height, shared |
| gallery-states | 471 -> 456 | busy card in a 70 to 96 px strip at the top, shared |
| qr-code | 282 = 282 | |
| passkey-list | 1280: 432 = 432; 390: 732 -> 432 on Loading | the loading busy card is 48 x 84 in a 0 px host, shared |
| conversation-thread | 512 = 512 | |
| entity-states | grid 924 -> Nothing, Failed 256 | formal identical, shared |

Chapter-3 checks per theme, all 34 sections at both widths:

- Heading size: after the commits every empty and failed title in both themes is 18 to 24 px (stateplate 23.7 and 18.3 px on a
  phone; the tape or display title 19.5 to 21 px). The titles that are 18 px in every theme (`kp-runs__failure-title`,
  `kp-dated__failure-title`) are shared.
- Centred: dx 0 for every plate. dy is +9 px in nostromo's empty plates (the vent lines sit in the top padding, so the words
  plus vents are balanced) and -1 px in titanium; failed alerts 0 px.
- Retry: 36 px high everywhere in the stateplates (nostromo 90 x 36, titanium 94 x 36 -> 73 x 36); 28 px (the small size) in
  the card failure strip, shared with formal (74 x 28).
- Busy card centred over the whole component: dx 0, dy 0 in 25 of the 34 sections; the others are the shared ones below.
- Loading animates in the theme's own way: nostromo draws the tape reel and the lamp window (`COMPUTING` redraw, hum band, in
  frames); titanium the anodising bath over the card, linear, 2200 ms. Both seen playing, in different frames on repeated
  screenshots.
- No layout shift between states: the section height is equal across states in every section but the shared ones below.

## Shared (same in formal, or in `css/components.css` / `js/`)

1. `.kp-stateplate__action` has no font size, so Retry, Add and Try again are set at the plate's 23.7 px in formal too. Titanium
   is patched in its register (4b43793a); nostromo's key sets its own size. Fix: `font-size: var(--kp-text-md, 1rem)` in
   components.css.
2. The card state's failed alert (`js/card-state.js`, `.kp-card__failure`) is a 71 to 76 px strip with a 28 px Retry, not the
   card's footprint: request inspector (442 of 1276), today, quote. The empty plate is 97 to 143 px. Fix: give the card's
   state grid cell `align-content: stretch` and the plate `block-size: 100%`, and the failure the stateplate layout.
3. Checklist empty and failed (`claim-row`): the Retry key is stretched to the plate's width (369 / 335 / 396 px wide in
   formal / nostromo / titanium). Fix: `justify-self: center` on `.kp-checklist__empty > .kp-button`.
4. The busy card sits in a strip at the top and not over the whole component in `trace-states` (136 of 316 px), `gallery-states`
   (70 to 96 of 456), `passkey-list` (host 0 x 31 px: a 50 x 54 card) and over the grid only in `availability-grid` (802 of
   958 px). No busy card at all on `payload-cell` Loading and `chart-annotations` Loading.
5. State plates do not take the loaded height: notices 584 of 1321, claim-row 525 of 673, uses 288 of 476, availability 408 of
   1368, entity grid 256 of 924, gallery 456 of 471, passkeys phone 432 of 732, intent palette 552 of 569. A floor of the loaded
   height (a `min-block-size` the page sets from its ready render) would hold them.
6. Messages that appear with a state grow the component (+28 snooze "Snoozed until", sentence "Wrong time" +28, slider "Wrong
   value" +24, time field +41 to +48, quote "Could not read" +3 at 390): reserve the line.
7. `kp-runs` at 390: Ready 203 px against 166 px in the three states.
8. Passkey list and conversation thread draw Failed as `.kp-empty` with the whole sentence as its title, not as the alert; in
   nostromo that is a five-line tape. The page should use the alert.
9. `ops-page` Page failed at the phone frame changes the alert's wrapping (24 px); the failed text and the attention text differ.

## Not mine, but seen

- nostromo's calendar busy card (calm-tones-states) is 80 x 92 px and 18 px under the grid's centre (formal 85 x 94, 4 px):
  the calendar's own approved loading; left alone.
- Titanium `.kp-alert--destructive` is a solid orange plate with a chamfer; the titles and texts read at once on it (dark ink),
  so no change.

## DEMO_RULES confirmations (chapters 3 and 4)

- Chapter 3 (states): kept for what a register owns. Every state of the 34 sections was pressed, measured against the loaded
  height and looked at in a sheet; six faults were fixed in the registers and nine are listed as shared above.
- Chapter 4 (motion and loading): kept. Both loading pictures play; no animation was added or changed. The busy-card gate
  (`gates/check-busy-card.mjs`) passes with each commit.
- Measuring scripts (kept in the helper's scratch directory, not in the repository): a state driver that clicks every state
  button and records every component root's height, a plate probe (title size, dx, dy, Retry), a busy-card probe and a sheet
  maker that puts the states side by side.
