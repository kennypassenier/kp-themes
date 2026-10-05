# A menu button of its own, per theme

Phase 1 of the character round for the menu button
(`.kp-menu-button` with its `.kp-menu--rich`, `js/menu-button.js`, scope-143;
catalogue block `menu-button` in `catalogue/overlays.html`). As the trend
tile, the meter and the other character demos (round 2): nothing is bundled,
each theme's menu button has five aspects, each picked on its own from three
options, and any combination composes.

## Structure

| Aspect                                    | Attribute          | What it covers                                                                              |
| ----------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------- |
| Shape                                     | `data-mb-shape`    | the plate, the group headings, and how a label sits over its hint                           |
| While loading                             | `data-mb-loading`  | the one entry a fill waits behind (`[aria-busy='true'] [data-kp-loading]`); it always moves |
| Open and close                            | `data-mb-open`     | how the menu arrives when opened, and leaves the same way in reverse                        |
| A destructive entry and a disabled reason | `data-mb-tone`     | `.kp-menu__item--destructive` and `[aria-disabled='true'] .kp-menu__reason`                 |
| Hover, focus and a press                  | `data-mb-interact` | `.kp-menu__item:hover`, `:focus-visible` and `:active`                                      |

Chosen from what the menu button actually does: it has a shape (always
first), a loading state (`setMenu(wrapper, 'loading')`), it moves when it
opens and closes, it has a destructive entry and a disabled entry with a
reason (its tones), and it is interactive down to one entry. No live-update
aspect: a refill while open waits until the menu closes (the module's own
behaviour, not a character), so there is nothing to show moving on its own.

- `demo.html`: the section judged with the review kit (`../_review/review.js`,
  round `2026-10-05-character-menu-p1`, all 22 themes reopened). At the top
  "Your combination", one menu button carrying the picks ticked in the
  dialog (an aspect not ticked yet shows its option 1); under it five rows,
  one per aspect, of three menu buttons that differ in that aspect only,
  every other aspect as ticked; the plain menu button of today below them
  for reference, not as an option. The controls sit in
  `data-review-controls`: Open, Close, Loading/Filled, Focus the second
  entry, and the speed of every animation.
- `demo.js`: `ASPECTS`, the names and descriptions (`IDEAS`, per theme five
  aspects of three options — the spec other helpers implement in
  `menu-a.css`..`menu-d.css`), `GROUPS` (one fixed menu: a disabled entry
  with its reason, a destructive entry), the rows and the preview
  (`compose()`), the review choices built from `IDEAS`, the speed control,
  and the animated _leave_ on Close. `js/menu-button.js` hides the menu at
  once on close, with no leave hook of its own: the Close control marks the
  menu `data-mb-leaving`, waits for the CSS animation (or a timeout) and
  only then calls the real `closeMenu()`, so a leave is seen before the menu
  vanishes (skipped under reduced motion, which closes it at once). The
  arrival needs no such trick: a CSS animation on `.kp-menu:not([hidden])`
  restarts by itself whenever `openMenu()` lifts `hidden`.
- `menu.css`: the shared mechanism (`:root { --mb-speed }`, the demo's own
  `[data-mb]` positioning) plus formal and titanium, in
  `@layer kp.signature`. One selector per theme, aspect and option
  (`[data-theme='<name>'] [data-mb-<aspect>='<n>'] .kp-menu-button >
.kp-menu …`) — the aspect attribute sits on the strip around the button
  (`compose()` in `demo.js`), not on `.kp-menu-button` itself, so this is a
  descendant combinator, not a compound selector on the component; a
  compound selector is for an attribute or class that sits on the
  component itself, which this one does not. Every
  animation sits inside one `@media (prefers-reduced-motion: no-preference)`
  block at the end, so a loading picture always animates at full motion and
  stands still under reduced motion; no keyframe touches `opacity`. The
  speed control sets `--mb-speed` on the root; every `animation-duration` is
  `calc(<base> / var(--mb-speed, 1))`.
- `menu-a.css`..`menu-d.css`: one file per group of five themes (a: light,
  dark, cyberpunk, synthwave, pastel; b: terminal, forest, high-contrast,
  sepia, blueprint; c: solstice, brutalism, deco, phantom, shade-light; d:
  shade-dark, retro, grotesk, lapis, nostromo), linked from `demo.html`
  after `menu.css`; all twenty are built out from the `IDEAS` spec.
- `demo.css`: the page layout only.

`js/menu-button.js` is not changed.

## The options per theme (phase 1 spec)

The name of each aspect's three options; the one-sentence description of
what each one does is in `demo.js` (`IDEAS`) and shown in the review dialog.

| Theme         | Shape                                                          | While loading                                                     | Open and close                                       | Tone (destructive / disabled)                                 | Interact                                                       |
| ------------- | -------------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------- |
| formal        | The engraved plate / The ledger page / The certificate         | The dotted leader / The seal is pressed / The nib sweeps          | Unrolled / The frame draws in / Pressed open         | The red-ink entry / The struck entry / The void stamp         | The quill underline / The margin mark / The wax seal           |
| light         | The soft card / Daylight / The paper sheet                     | The dashed baseline / Daylight / A cloud passes                   | Unfolds / Sunrise / A soft pop                       | The coloured tab / The soft outline / The warm edge           | The soft lift / The glow / The round pill                      |
| dark          | The status board / The machined panel / The oscilloscope       | The ticker baseline / The slot is scanned / The status lamp       | Switched on / Slid out / Powered up                  | The alarm lamp / The machined tab / The red rim               | The lit slot / The scan line / The panel glow                  |
| cyberpunk     | The neon trace / The glitch HUD / The holo card                | The packet runs / The glitch bar / Packet rain                    | Jacked in / The neon strikes / Booted                | The hazard frame / The cut-corner chip / The warning scanline | The RGB split / The cyan edge / The data flicker               |
| synthwave     | The grid-floor horizon / The VCR display / The arcade marquee  | The grid drives / The tracking rolls / The sun rises              | Over the horizon / Tape loads / Neon strikes         | The arcade warning / The inverse block / The laser edge       | The laser sweep / The glass glow / The VCR flicker             |
| pastel        | The sticker chart / The washi planner / The cloud card         | The candy hop / The tape drifts / Sprinkles                       | Popped / Unwrapped / Bounced in                      | The heart sticker / The taped label / The candy band          | The happy hop / The sticker peel / The soft bubble             |
| terminal      | The top(1) row / The dumb-terminal plot / The curses window    | The block caret / The dots march / The hash bar                   | Printed / Paged in / Booted                          | The bell / Reverse video / The warning glyph                  | Reverse on hover / The caret moves / The underline cursor      |
| forest        | The ranger's logbook / The canopy / The herbarium sheet        | The trail of light / The canopy sways / Fireflies                 | Grows / The trail is walked / Unfurled               | The trail blaze / The fallen leaf / The warning moss          | The branch sways / The leaf tag lifts / The dew glints         |
| high-contrast | Ink and frame / The inverse plate / The signal board           | The dashed baseline / The striped block / The scanning bar        | Switched / Dropped / Flipped                         | The signal plate / The heavy frame / The struck block         | The bar flips / The frame thickens / The block inverts         |
| sepia         | The barograph / Letterpress / The ticket stub                  | The nib sweeps / The ink spreads / The drum turns                 | The nib writes / Pressed / Unrolled                  | The rubber stamp / The printed border / The red ink entry     | The nib lingers / The paper warms / The stamp presses          |
| blueprint     | The chart recorder / The title block / The section view        | The pen sweeps / The dash marches / The dimension line            | Drafted / Plotted / Unfolded                         | The revision cloud / The dimension flag / The hatched warning | The pen underlines / The grid highlights / The dimension ticks |
| solstice      | The low sun / The embers / The horizon                         | The glow rises / The heat glows / The sun crosses                 | Dawn / Kindled / The horizon opens                   | The red sky / The glowing chip / The ember edge               | The flare / The ember glows / The sun crosses                  |
| brutalism     | The slab / The sticker sheet / The poster block                | The stamp / The drop / The hammer                                 | Slammed / Shoved in / Stamped                        | The warning poster / The askew sticker / The hazard block     | Kicked / The block drops / The stamp presses                   |
| deco          | The gilt frame / The marquee / The skyscraper                  | The glint runs / The bulbs chase / The sunburst opens             | The curtain rises / The marquee lights / Unveiled    | The gilt notice / The marquee plaque / The gold warning rule  | The bulbs chase / Gilded / The curtain parts                   |
| phantom       | The evidence card / The calling card / The ransom note         | The stamp ring / Stamped askew / The string is pulled             | The card is thrown / Slashed in / Pinned             | The calling card / The red slash / The ransom cut             | Snatched / The string twangs / The halftone shifts             |
| shade-light   | Pencil in the shade / The leaf shade / The window light        | The hatching sweeps / The cloud passes / Leaves sway              | Drawn in pencil / Out of the shade / The light falls | The pinned note / The graphite warning / The shaded band      | A breeze / Pencilled again / The shade lifts                   |
| shade-dark    | Silverpoint / The reading lamp / The night window              | The silver hatches / The lamp swells / The candle flickers        | Silverpoint drawn / The lamp is lit / Moonrise       | The red lamp / The silver warning / The night flare           | A glint / The lamp brightens / The silver traces               |
| retro         | The 1995 dialog / The performance monitor / The Notepad window | The progress blocks / The marquee bar / The defragmenter          | Painted / Dragged in / Switched                      | The message box / The flat field / The error beep             | The bevel presses / Repainted / The highlight bar              |
| grotesk       | The transit board / The Swiss poster / The index card          | The line runs / Three blocks cut in / The flap board              | Set in type / The board flips / Snapped in           | The index colour / The underlined figure / The red margin     | Flipped / The bar runs / Shifted                               |
| lapis         | The girih tile / Lapis on vellum / The manuscript margin       | The glint runs the frame / The gold leaf is laid / The star turns | Illuminated / Inked / Unrolled                       | The rubric / The gold-ruled warning / The lapis mark          | Gilded / Inked again / The star glints                         |
| nostromo      | The CRT trace / The indicator panel / The MU-TH-UR screen      | The sweep runs / The lamps scan / The motion tracker              | Warmed up / Printed out / Pinged                     | The klaxon / The lit indicator lamp / The red ping            | A blip / The scanline sweeps / The lamp lights                 |
| titanium      | The milled plate / The instrument dial / The anodised badge    | The cutter runs / The knurl rolls / The lathe turns               | Milled / Seated / Torqued open                       | The anodised tag / The machined tab / The torque warning      | A click of the dial / A glint / The knurl catches              |

All 22 themes are built in full: formal and titanium in `menu.css`, the
other twenty across `menu-a.css` (light, dark, cyberpunk, synthwave,
pastel), `menu-b.css` (terminal, forest, high-contrast, sepia, blueprint),
`menu-c.css` (solstice, brutalism, deco, phantom, shade-light) and
`menu-d.css` (shade-dark, retro, grotesk, lapis, nostromo).

## Measured (all 22 themes × 2 motion settings)

Firefox (Playwright), own `http.server`, every theme, with and without
`prefers-reduced-motion: reduce` — 44 runs.

- Console: 0 errors across all 44 runs.
- Every control (Open, Close, Loading/Filled, Focus the second entry, the
  three speeds) changes something observable.
- The three options of every aspect row differ, checked per aspect in the
  state that actually shows it: shape and tone closed (border/background/
  font on the menu, and the destructive item/label/disabled reason for
  tone), loading filled and open (`aria-busy='true'` before `openMenu()`,
  since a fill while open waits until it closes), open/close by
  `animation-name` at full motion (at reduced motion every option
  legitimately plays none, by design), interact by hovering each option's
  entry. One real collision turned up and was fixed: high-contrast's
  interact options 1 ("the bar flips") and 3 ("the block inverts") painted
  identically on hover (both a plain ink/paper flip) — option 3 now also
  rings the inverted entry in a 2px inset frame on hover, so the two read
  apart before either is pressed.
- Loading: every option ≥ 1 running `CSSAnimation` at full motion, 0 at
  reduced motion, in all 22 themes. Firefox's `getAnimations()` under-counts
  `::before`/`::after`-targeted animations (seal, lamp, sprinkle, candle,
  swell and the like): those were confirmed instead by reading
  `animation-name` off `getComputedStyle(el, '::after')`/`'::before'`.
- Text ≥ 4.5:1 and separating edges ≥ 3:1, measured by walking the ink's
  actual ancestor plate and resolving gradient stops to their worst colour
  stop. The destructive label and the disabled reason read under 4.5:1 in
  nine themes' tone rows (cyberpunk, synthwave, sepia, blueprint, solstice,
  deco, phantom, lapis, titanium) — the package's own destructive/disabled
  ink against that theme's menu plate, not something the three options
  introduced (the same low ratio repeated identically across all three).
  Fixed in the demo by setting that text to `var(--foreground)` in exactly
  the option(s) that measured under 4.5:1 (synthwave's inverse-block option
  2 and sepia's options 1–2 already read fine and were left alone); every
  tone option now measures ≥ 4.5:1 in all 22 themes.
- Labels (`.kp-menu__heading`, `.kp-menu__label`, `.kp-menu__hint`,
  `.kp-menu__reason`) never wrapped or cut (`scrollWidth` ≤ `clientWidth`)
  in any of the 44 runs.
- One height per component across the three states within a row, closed,
  in all 44 runs (the trigger button's own height never moves with the
  aspect).
- The catalogue's side navigation (15rem, sticky) no longer crowds an open
  menu at normal widths: `demo.css`'s three-column `.mb-trio` now stacks to
  one column up to 100rem (not 60rem), comfortably clearing the nav plus
  the package's own `--kp-menu-rich-max` (26rem) at 1280px; a strip with an
  open menu is also lifted a step in the stacking order so the next row's
  heading never paints over it. Checked at 1280px (no overlap, no
  horizontal scroll) and at 334px (single column, same as before).

## Package findings (not fixed here — `research/character-menu` is a demo,

not `js/menu-button.js` or `css/components.css`)

- The package's own destructive-entry label and disabled-reason ink read
  under 4.5:1 against the menu plate in nine of the 22 themes (cyberpunk,
  synthwave, sepia, blueprint, solstice, deco, phantom, lapis, titanium) —
  see "Measured" above. The demo works around it per option; the package
  default does not.
- The design token `--border-strong`, used for the group-separator rule
  this demo relies on, reads under the 3:1 separating-edge bar against the
  menu's own plate in three themes: formal (2.97:1), dark (2.11:1) and
  titanium (1.97:1). Not a selector bug — the token itself, measured the
  same way against a plain plate, is this low in these three themes.

## Not built

- Phone width and the catalogue's own menu-button block beyond the
  334px/1280px layout check above: those are catalogue-wide concerns, not
  this demo's.
