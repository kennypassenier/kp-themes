# The data table's busy overlay, of its own, per theme

Phase 1 (Kenny, scratchpad/phase1-brief.md, 2026-10-05): the fourteenth
component of the character round, and the first one that is not a tile or a
chart — the panel that covers a data table while it loads
(`.kp-datatable__busy-overlay` > `.kp-datatable__busy-panel`: a spinner, the
app's words, a live busy counter, `js/datatable.js`'s `busy()`/`fail()`,
fix-80 to fix-85), flat on a phone below `30rem` (`@container kp-table`).

## Structure (one pick per aspect, from the start)

Per theme the overlay has five aspects, each picked on its own from three
options, as the meter, the trend tile, the key figure, the state word and
the page header do:

| Aspect                | Attribute         | What it covers                                                                                                       |
| --------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| Shape                 | `data-bo-shape`   | the overlay's veil and the panel's chrome: its border, radius, shadow and the spinner's own ring                     |
| While loading         | `data-bo-loading` | the picture that plays on the panel while it covers the rows; it always moves (a still frame under reduced motion)   |
| How the panel arrives | `data-bo-arrival` | how the panel comes in when the table turns busy (the layer is drawn fresh every time, so the animation plays again) |
| The failed state      | `data-bo-failure` | the alert that stands in the panel's place when `fail()` is called                                                   |
| On a phone            | `data-bo-phone`   | the panel's own accents in the flat layout a phone gets below 30rem                                                  |

Every rule in `busy.css` (and `busy-a.css` … `busy-d.css`, four empty
groups for the other twenty themes) names one aspect only and sets that
aspect's custom properties only, so any combination composes. Nothing is
ticked for the reviewer.

- `demo.html`: the section judged with the review kit (`../_review/review.js`,
  round `2026-10-05-busy-r1`, no theme reopened yet — phase 1 builds formal
  and titanium only). At the top "Your combination", one data table carrying
  the picks ticked in the dialog (an aspect not ticked yet shows its option
  1); under it five rows, one per aspect, of three tables that differ in
  that aspect only, every other aspect as ticked; the plain overlay of today
  below them for reference, not as an option. The controls sit in
  `data-review-controls`: State (Ready, Loading, Failed), Words (Short, a
  long reason to try wrapping) and the speed of every animation.
- `busy.css`: in `@layer kp.signature`. The shared part (`[data-bo]`), then
  one rule per theme, aspect and option, `[data-theme='<name>']
[data-bo-<aspect>='<n>'] …`, which sets that aspect's custom properties
  only (30 rules for the two themes built so far); in a register the
  `[data-bo…]` part drops out. Every loop sits in one
  `prefers-reduced-motion: no-preference` block at the end; no keyframe
  touches opacity. The failed alert's own entrance is a plain CSS
  transition armed by `@starting-style`, not a keyframe, because it only
  needs to ease away from one closed pose.
- `demo.js`: `ASPECTS`, the names and descriptions (`IDEAS`, per theme five
  aspects of three options), the review choices built from them, `compose()`
  (the preview and each row's table take the ticked picks), `drive()` (calls
  the package's own `state()`/`busy()`/`fail()` through the handle
  `attachDataTables()` returns — nothing here reimplements the overlay),
  the State/Words/Speed controls, and a listener on `kp-datatable-retry`
  so the failed alert's own "Try again" button does something.
- `demo.css`: the page layout only, plus the fixed 334px pane the "On a
  phone" row's three tables sit in, so the flat layout is on the page
  itself rather than something to resize for.

`js/datatable.js` is not changed.

## What `js/datatable.js` does not hand a character

Found while building; a real limitation of the module today, not a choice
a character can make around:

- **The overlay layer cannot leave with an animation.** `drawOverlay()`
  removes the previous `.kp-datatable__busy-overlay` node with a plain
  `.remove()` the instant the table leaves `loading`, with no transition
  window; a CSS `animation` on the layer plays its _arrival_ every time it
  is drawn fresh (which `demo.js`'s `drive()` does by forcing a
  `ready` → `loading` round trip), but there is no DOM node left to animate
  _out_. Only one half of "opposites mirror" exists here.
- **The failed alert's leave is cut by the same rule that makes it safe.**
  `js/datatable.js` only toggles `hidden` on `[data-kp-datatable-failed]`
  (it is built once and kept), which lets `@starting-style` animate its
  _arrival_ the instant it stops being `display: none` — a real, working
  transition, no JS of this layer's own. Its _leave_ cannot be shown the
  same way: the package's base layer sets `[hidden] { display: none
!important }` (KT13, so a layout class can never beat the attribute),
  and that `!important` applies before `transition-behavior:
allow-discrete` gets a frame to delay it. The alert disappears at once,
  the same limitation the overlay has.
- **No hook for "the panel is about to leave".** A register that wanted a
  three-frame wind-down (the spinner slowing, the words fading up before
  the layer is gone) would need a signal from the module a tick before
  `state()`/`busy()` tears the layer down; today there is none.
- **The failed reason is one paragraph, no structure.** `fail(reason)`
  takes a string; a character that wanted to show "what" and "since when"
  as two separate lines (as the busy panel does with its words and its
  clock) would have to split the sentence itself, in the app's own words,
  not in a register.

## The options per theme

The names of the three options of every aspect; each option's one-sentence
spec is in `demo.js` (`IDEAS`) and in the review dialog.

| Theme         | Aspect        | 1                      | 2                       | 3                         |
| ------------- | ------------- | ---------------------- | ----------------------- | ------------------------- |
| formal        | Shape         | The engraved plate     | The docket              | The seal                  |
|               | While loading | The dotted leader      | The ledger is ruled     | The seal is pressed       |
|               | Arrival       | At once                | Engraved                | Entered in the ledger     |
|               | Failed state  | The red-ink entry      | The torn notice         | The voided stamp          |
|               | On a phone    | The folded note        | The docket strip        | The ledger line           |
| light         | Shape         | The soft card          | Daylight                | The paper sheet           |
|               | While loading | The dashed baseline    | Daylight crosses        | A cloud passes            |
|               | Arrival       | At once                | Unfolds                 | Sunrise                   |
|               | Failed state  | The soft alarm         | The outlined notice     | The coloured tab          |
|               | On a phone    | The flat card          | The sheet strip         | The daylight strip        |
| dark          | Shape         | The status board       | The machined panel      | The oscilloscope          |
|               | While loading | The ticker baseline    | The slot is scanned     | The scope sweeps          |
|               | Arrival       | At once                | Switched on             | Machined in               |
|               | Failed state  | The alarm lamp         | The machined tab        | The scope fault           |
|               | On a phone    | The flat board         | The flat slot           | The flat scope            |
| cyberpunk     | Shape         | The neon trace         | The glitch HUD          | The holo card             |
|               | While loading | The neon trace sweeps  | The glitch flickers     | Packet rain               |
|               | Arrival       | At once                | Jacked in               | The neon strikes          |
|               | Failed state  | The neon fault         | The glitch alarm        | The hazard frame          |
|               | On a phone    | The flat trace         | The flat HUD            | The flat holo             |
| synthwave     | Shape         | The grid-floor horizon | The VCR display         | The arcade marquee        |
|               | While loading | The horizon rolls      | The tape tracks         | The marquee chases        |
|               | Arrival       | At once                | Over the horizon        | Tape loads                |
|               | Failed state  | The grid fault         | The VCR warning         | The arcade warning        |
|               | On a phone    | The flat horizon       | The flat display        | The flat marquee          |
| pastel        | Shape         | The sticker chart      | The washi planner       | The cloud card            |
|               | While loading | Sprinkles fall         | The washi flutters      | The cloud drifts          |
|               | Arrival       | At once                | Popped                  | Doodled in                |
|               | Failed state  | The heart sticker      | The torn washi          | The cloud warning         |
|               | On a phone    | The flat sticker       | The flat washi          | The flat cloud            |
| terminal      | Shape         | The top(1) row         | The dumb-terminal plot  | The curses window         |
|               | While loading | The cursor blinks      | The marquee scrolls     | The spinner cycles        |
|               | Arrival       | At once                | Printed                 | Paged in                  |
|               | Failed state  | The bell               | Reverse flash           | The core dump             |
|               | On a phone    | The flat row           | The flat plot           | The flat window           |
| forest        | Shape         | The ranger’s logbook   | The canopy              | The herbarium sheet       |
|               | While loading | The trail is walked    | The canopy sways        | Fireflies drift           |
|               | Arrival       | At once                | Grows                   | The trail is walked in    |
|               | Failed state  | The trail blaze        | The withered canopy     | The warning tag           |
|               | On a phone    | The flat logbook       | The flat canopy         | The flat sheet            |
| high-contrast | Shape         | Ink and frame          | The inverse plate       | The signal board          |
|               | While loading | The dashed baseline    | The striped block       | The scanning bar          |
|               | Arrival       | At once                | Switched                | Dropped                   |
|               | Failed state  | Ink and frame          | The heavy frame         | The signal plate          |
|               | On a phone    | The flat frame         | The flat inverse        | The flat signal           |
| sepia         | Shape         | The barograph          | Letterpress             | The ticket stub           |
|               | While loading | The nib writes         | The ink spreads         | The drum turns            |
|               | Arrival       | At once                | The nib writes it in    | Pressed                   |
|               | Failed state  | The rubber stamp       | Letterpress fault       | The voided stub           |
|               | On a phone    | The flat graph         | The flat press          | The flat stub             |
| blueprint     | Shape         | The chart recorder     | The title block         | The section view          |
|               | While loading | The pen steps          | The cell fills          | The hatch sweeps          |
|               | Arrival       | At once                | Drafted                 | Plotted                   |
|               | Failed state  | The revision cloud     | The red-line fault      | The out-of-tolerance mark |
|               | On a phone    | The flat recorder      | The flat block          | The flat section          |
| solstice      | Shape         | The low sun            | The embers              | The horizon               |
|               | While loading | The sun crosses        | The embers glow         | The horizon line glows    |
|               | Arrival       | At once                | Dawn                    | Kindled                   |
|               | Failed state  | The red sky            | The cold ember          | The warning horizon       |
|               | On a phone    | The flat sun           | The flat embers         | The flat horizon          |
| brutalism     | Shape         | The slab               | The sticker sheet       | The poster block          |
|               | While loading | The stamp              | The hammer              | The drop                  |
|               | Arrival       | At once                | Slammed                 | Shoved in                 |
|               | Failed state  | The warning poster     | The hazard slab         | The stamped fault         |
|               | On a phone    | The flat slab          | The flat sheet          | The flat poster           |
| deco          | Shape         | The gilt frame         | The marquee             | The skyscraper            |
|               | While loading | The sunburst opens     | The bulbs chase         | The steps climb           |
|               | Arrival       | At once                | The curtain rises       | The marquee lights        |
|               | Failed state  | The gilt notice        | The marquee warning     | The red skyscraper        |
|               | On a phone    | The flat gilt          | The flat marquee        | The flat skyscraper       |
| phantom       | Shape         | The evidence card      | The calling card        | The ransom note           |
|               | While loading | The string is pulled   | The slash redraws       | The note trembles         |
|               | Arrival       | At once                | The card is thrown      | Slashed in                |
|               | Failed state  | The calling card       | The stamped ring        | The torn warning          |
|               | On a phone    | The flat evidence      | The flat card           | The flat note             |
| shade-light   | Shape         | Pencil in the shade    | The leaf shade          | The window light          |
|               | While loading | Leaves sway            | The pencil hatches      | The light shifts          |
|               | Arrival       | At once                | Drawn in pencil         | Out of the shade          |
|               | Failed state  | The pinned note        | The withered leaf       | The warning window        |
|               | On a phone    | The flat pencil        | The flat leaf           | The flat window           |
| shade-dark    | Shape         | Silverpoint            | The reading lamp        | The night window          |
|               | While loading | The glint travels      | The lamp flickers       | The moon crosses          |
|               | Arrival       | At once                | Silverpoint             | The lamp is lit           |
|               | Failed state  | The red lamp           | The tarnished point     | The red window            |
|               | On a phone    | The flat point         | The flat lamp           | The flat window           |
| retro         | Shape         | The 1995 dialog        | The performance monitor | The Notepad window        |
|               | While loading | The progress blocks    | The marquee bar         | The defragmenter          |
|               | Arrival       | At once                | Painted                 | Dragged in                |
|               | Failed state  | The message box        | The flat field          | The monitor fault         |
|               | On a phone    | The flat dialog        | The flat monitor        | The flat window           |
| grotesk       | Shape         | The transit board      | The Swiss poster        | The index card            |
|               | While loading | The board flips        | The poster shifts       | The index turns           |
|               | Arrival       | At once                | Set in type             | The board flips in        |
|               | Failed state  | The index colour       | The red bar             | The poster warning        |
|               | On a phone    | The flat board         | The flat poster         | The flat index            |
| lapis         | Shape         | The girih tile         | Lapis on vellum         | The manuscript margin     |
|               | While loading | The star turns         | The gold leaf is laid   | The margin is inked       |
|               | Arrival       | At once                | Illuminated             | Inked                     |
|               | Failed state  | The rubric             | The tarnished tile      | The red vellum            |
|               | On a phone    | The flat tile          | The flat vellum         | The flat margin           |
| nostromo      | Shape         | The CRT trace          | The indicator panel     | The MU-TH-UR screen       |
|               | While loading | The trace rolls        | The lamp blips          | The readout prints        |
|               | Arrival       | At once                | Warmed up               | Printed out               |
|               | Failed state  | The klaxon             | The red trace           | The MU-TH-UR warning      |
|               | On a phone    | The flat trace         | The flat indicator      | The flat readout          |
| titanium      | Shape         | The milled plate       | The instrument dial     | The inspection window     |
|               | While loading | The needle sweeps      | The gauge warms         | The rivets step           |
|               | Arrival       | At once                | Seated                  | Torqued in                |
|               | Failed state  | The alarm lamp         | The hazard band         | The fault tag             |
|               | On a phone    | The flat plate         | The flat dial           | The flat window           |
