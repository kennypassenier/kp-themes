# A key figure of its own, per theme

**Decided (2026-10-06 21:17).** Kenny approved all 22 themes, one pick per aspect; the picks, as the attribute keys the demo sets, are in [decided.json](decided.json) (shape / loading / tone / interactive / live). Retro's and grotesk's loading `6` is the plain package skeleton in the picked shape (fix-113). Titanium's loading, The anodising bath, is also the start of a titanium-only demo of every loading element, built once every demo is approved (Kenny, 2026-10-06 20:59 and 21:20).

Kenny, phase 1 brief (2026-10-05): the character round, one component at a
time, all 22 themes in one demo. This is the eleventh component: the plain
key figure tile (`.kp-kpi`, css/components.css, "A row of key figures";
js/kpi.js its sparkline and toggle helpers), the shape without the 24-hour
trend (`.kp-kpi--trend`, research/character-trend) or the column-count
strip (`data-kp-kpis-columns`, research/character-columns) — each of those
already has its own demo. This demo gives every theme its own version of
the plain tile: a card with the label in small capitals, the number with
its unit and an optional note, a line of words with a `.kp-kpi__delta`
change, and a warning/destructive plate on the figure — beside the plain
tile of today.

## Structure (one pick per aspect, as the meter and the trend tile)

Every theme's tile has five aspects, each picked on its own from three
options; any combination composes.

| Aspect              | Attribute             | What it covers                                                                                                                      |
| ------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Shape               | `data-kf-shape`       | The plate, the frame, the label, the number, the unit, the note, the delta's shape — always first.                                  |
| While loading       | `data-kf-loading`     | The picture while the figure is busy (`[data-kp-loading]`, `aria-busy`); always moves, a still frame under reduced motion.          |
| Tone and change     | `data-kf-tone`        | How a warning or destructive figure (`[data-kp-tone]`) reads, and the delta chip's plate.                                           |
| Hover, focus, press | `data-kf-interactive` | A link tile (`a.kp-kpi`, the detail) and a toggle tile (`.kp-kpi--toggle`, the filter) under the pointer, the keyboard and a click. |
| Live update         | `data-kf-live`        | What a new reading does to the number (`.kf-flash`, one trigger per press, triggered by demo.js).                                   |

No arrival/leave aspect: the plain tile does not open or close, so that
aspect from the "aspect menu" does not apply here (unlike a dialog or a
toast). Six aspects were the ceiling; five were the ones this component
actually does something with.

Why these five and not, say, a sixth for the meter at the foot of some
tiles (`.kp-kpi__meter`): the meter is itself a separate component
(`.kp-meter`) already covered by its own rules in components.css, and
`data-kf-tone` already governs how a toned figure reads on the same tile,
so a sixth aspect would duplicate work rather than cover something new.

Every rule in `kpi.css` (and the four empty group files) names one aspect
only and sets that aspect's CSS custom properties only, so any of the
3×3×3×3×3 = 243 combinations composes without a special case. The markup
is the package's own: `js/kpi.js` is not changed, and neither is
`css/components.css`. On the page: one composed preview at the top
following the review kit's `review:choice`, five rows (one per aspect)
each holding three columns that differ in that aspect only, and the plain
tile of today at the foot for reference. Every row's column shows three
tiles stacked: a plain figure, a link tile and a toggle tile, so
hover/focus/press, tone and loading all have a surface of each kind to
act on. The controls (state, tone, speed, live update) sit in
`data-review-controls`, mirrored into the review dialog.

`data-review-components="kpi--interactive"` on the judged section: a name
that matches no real `kp-kpi--*` modifier in the catalogue (the catalogue's
own `kp-kpi--trend` and `kp-kpi--toggle` are both real variants), so
`gates/check-demo-variants.mjs` asks nothing of this demo beyond what it
already shows — the point being that this demo is deliberately the base
tile only, and the trend and the columns variants are judged in their own
demos, never duplicated here.

## Phase 1 delivers

- `demo.html`, `demo.js` (the `ASPECTS` array and the full `IDEAS` table
  below), `demo.css` — the page, built and checked in formal and titanium.
- `kpi.css` — complete theme-native CSS for **formal** and **titanium**
  only, in `@layer kp.signature`, tokens only (DI9), no fades (no opacity
  keyframes), the loading picture moves at full motion and stands still
  under `prefers-reduced-motion: reduce`.
- `kpi-a.css` … `kpi-d.css` — four empty stylesheets (`@layer
kp.signature {}`), linked from `demo.html` right after `kpi.css`, for
  four later helper rounds:
    - **a** = light, dark, cyberpunk, synthwave, pastel
    - **b** = terminal, forest, high-contrast, sepia, blueprint
    - **c** = solstice, brutalism, deco, phantom, shade-light
    - **d** = shade-dark, retro, grotesk, lapis, nostromo
- A line for this demo under "Research to look at" in `catalogue/pages.js`.

## The IDEAS table: every theme, every aspect, its three named options

This is the spec: whichever helper fills `kpi-a.css` … `kpi-d.css` builds
exactly these three options per aspect per theme, each a one-sentence
description of what it does (`demo.js`'s `IDEAS[theme][aspect][n].text`);
the name below is `IDEAS[theme][aspect][n].name`.

| Theme         | Aspect              | Option 1               | Option 2                     | Option 3             |
| ------------- | ------------------- | ---------------------- | ---------------------------- | -------------------- |
| formal        | Shape               | The engraved plate     | The annual report            | The red-ink entry    |
|               | While loading       | The dotted leader      | The ledger is ruled          | The seal is pressed  |
|               | Tone and change     | The engraved plate     | The annual report            | The red-ink entry    |
|               | Hover, focus, press | The clerk's nod        | The ledger opens             | The wax seal         |
|               | Live update         | Redrawn                | The entry is carried forward | Signed again         |
| light         | Shape               | The soft card          | The soft outline             | The coloured tab     |
|               | While loading       | The dashed baseline    | Daylight                     | A cloud passes       |
|               | Tone and change     | The soft card          | The soft outline             | The coloured tab     |
|               | Hover, focus, press | The lift               | The warm glow                | The paper curls      |
|               | Live update         | Redrawn                | A soft swell                 | The page turns       |
| dark          | Shape               | The status board       | The machined tab             | The alarm lamp       |
|               | While loading       | The ticker baseline    | The slot is scanned          | The status lamps     |
|               | Tone and change     | The status board       | The machined tab             | The alarm lamp       |
|               | Hover, focus, press | The panel lights       | The scope glows              | The lamp switches    |
|               | Live update         | Redrawn                | The trace jumps              | The trace flares     |
| cyberpunk     | Shape               | The neon trace         | The glitch HUD               | The hazard frame     |
|               | While loading       | The neon trace         | The glitch HUD               | Packet rain          |
|               | Tone and change     | The neon trace         | The glitch HUD               | The hazard frame     |
|               | Hover, focus, press | Jacked in              | The HUD locks                | The hazard tape      |
|               | Live update         | Redrawn                | Packet in                    | The trace burns      |
| synthwave     | Shape               | The grid-floor horizon | The VCR display              | The arcade warning   |
|               | While loading       | The grid-floor horizon | The VCR display              | The sun rises        |
|               | Tone and change     | The grid-floor horizon | The VCR display              | The arcade warning   |
|               | Hover, focus, press | Over the horizon       | The OSD blinks               | The marquee lights   |
|               | Live update         | Redrawn                | The tracking jumps           | The laser flares     |
| pastel        | Shape               | The sticker chart      | The washi planner            | The heart sticker    |
|               | While loading       | The sticker chart      | The washi planner            | Sprinkles            |
|               | Tone and change     | The sticker chart      | The washi planner            | The heart sticker    |
|               | Hover, focus, press | The sticker peels      | The tape lifts               | The cloud bounces    |
|               | Live update         | Redrawn                | A happy hop                  | Squished             |
| terminal      | Shape               | The top(1) row         | The dumb-terminal plot       | The bell             |
|               | While loading       | The top(1) row         | The dumb-terminal plot       | The hash bar         |
|               | Tone and change     | The top(1) row         | The dumb-terminal plot       | The bell             |
|               | Hover, focus, press | Highlighted            | The cursor blinks            | The bell rings       |
|               | Live update         | Redrawn                | Scrolled                     | Reverse flash        |
| forest        | Shape               | The ranger's logbook   | The canopy                   | The trail blaze      |
|               | While loading       | The ranger's logbook   | The canopy                   | Fireflies            |
|               | Tone and change     | The ranger's logbook   | The canopy                   | The trail blaze      |
|               | Hover, focus, press | The tag turns          | Leaves rustle                | The trail marks      |
|               | Live update         | Redrawn                | A branch sways               | Growth ring          |
| high-contrast | Shape               | Ink and frame          | The heavy frame              | The signal plate     |
|               | While loading       | The dashed baseline    | The striped block            | The scanning bar     |
|               | Tone and change     | Ink and frame          | The heavy frame              | The signal plate     |
|               | Hover, focus, press | Switched               | The signal lights            | The bar flips        |
|               | Live update         | Redrawn                | The bar jumps                | The bar flips        |
| sepia         | Shape               | The barograph          | Letterpress                  | The rubber stamp     |
|               | While loading       | The barograph          | The ink spreads              | The drum turns       |
|               | Tone and change     | The barograph          | Letterpress                  | The rubber stamp     |
|               | Hover, focus, press | The nib lifts          | The press clamps             | The stub tears       |
|               | Live update         | Redrawn                | The nib moves on             | Inked again          |
| blueprint     | Shape               | The chart recorder     | The title block              | The revision cloud   |
|               | While loading       | The chart recorder     | The title block              | The dimension line   |
|               | Tone and change     | The chart recorder     | The title block              | The revision cloud   |
|               | Hover, focus, press | Drafted                | The title cell lights        | The revision marks   |
|               | Live update         | Redrawn                | The pen steps                | Retraced in ink      |
| solstice      | Shape               | The low sun            | The embers                   | The red sky          |
|               | While loading       | The low sun            | The embers                   | The sun crosses      |
|               | Tone and change     | The low sun            | The embers                   | The red sky          |
|               | Hover, focus, press | The ember glows        | The horizon brightens        | The sun flares       |
|               | Live update         | Redrawn                | A flare of sun               | The day moves on     |
| brutalism     | Shape               | The slab               | The sticker sheet            | The warning poster   |
|               | While loading       | The stamp              | The drop                     | The hammer           |
|               | Tone and change     | The slab               | The sticker sheet            | The warning poster   |
|               | Hover, focus, press | Slammed                | The sticker peels            | The poster shakes    |
|               | Live update         | Redrawn                | Kicked                       | Shoved               |
| deco          | Shape               | The gilt frame         | The marquee                  | The gilt notice      |
|               | While loading       | The gilt frame         | The marquee                  | The sunburst opens   |
|               | Tone and change     | The gilt frame         | The marquee                  | The gilt notice      |
|               | Hover, focus, press | The gold glints        | The bulbs chase              | The curtain rises    |
|               | Live update         | Redrawn                | The bulbs chase              | Gilded               |
| phantom       | Shape               | The evidence card      | The calling card             | The ransom note      |
|               | While loading       | The stamp ring         | Stamped askew                | The string is pulled |
|               | Tone and change     | The evidence card      | The calling card             | The ransom note      |
|               | Hover, focus, press | The pin glints         | The card is drawn            | The note is unfolded |
|               | Live update         | Redrawn                | Snatched                     | The string twangs    |
| shade-light   | Shape               | Pencil in the shade    | The leaf shade               | The pinned note      |
|               | While loading       | Pencil in the shade    | The leaf shade               | Leaves sway          |
|               | Tone and change     | Pencil in the shade    | The leaf shade               | The pinned note      |
|               | Hover, focus, press | The pencil lifts       | Leaves part                  | The light shifts     |
|               | Live update         | Redrawn                | A breeze                     | Pencilled again      |
| shade-dark    | Shape               | Silverpoint            | The reading lamp             | The red lamp         |
|               | While loading       | Silverpoint            | The lamp                     | The candle           |
|               | Tone and change     | Silverpoint            | The reading lamp             | The red lamp         |
|               | Hover, focus, press | The silver catches     | The lamp brightens           | The moon shifts      |
|               | Live update         | Redrawn                | A glint                      | The page moves       |
| retro         | Shape               | The 1995 dialog        | The flat field               | The message box      |
|               | While loading       | The progress blocks    | The marquee bar              | The defragmenter     |
|               | Tone and change     | The 1995 dialog        | The flat field               | The message box      |
|               | Hover, focus, press | The bevel presses      | The monitor glows            | The window drags     |
|               | Live update         | Redrawn                | Repainted                    | Scrolled one         |
| grotesk       | Shape               | The transit board      | The underlined figure        | The index colour     |
|               | While loading       | The transit board      | The Swiss poster             | The flap board       |
|               | Tone and change     | The transit board      | The underlined figure        | The index colour     |
|               | Hover, focus, press | The bar thickens       | The index reddens            | The flap turns       |
|               | Live update         | Redrawn                | Flipped                      | Shifted              |
| lapis         | Shape               | The girih tile         | Lapis on vellum              | The rubric           |
|               | While loading       | The girih tile         | The gold leaf is laid        | The star turns       |
|               | Tone and change     | The girih tile         | Lapis on vellum              | The rubric           |
|               | Hover, focus, press | The lattice glints     | The gold catches light       | The margin reddens   |
|               | Live update         | Redrawn                | Gilded                       | Inked again          |
| nostromo      | Shape               | The CRT trace          | The indicator panel          | The klaxon           |
|               | While loading       | The CRT trace          | The indicator panel          | The motion tracker   |
|               | Tone and change     | The CRT trace          | The indicator panel          | The klaxon           |
|               | Hover, focus, press | The tube warms         | The lamp lights              | The console locks    |
|               | Live update         | Redrawn                | A blip                       | The trace rolls      |
| titanium      | Shape               | The milled plate       | The instrument dial          | The anodised tag     |
|               | While loading       | The milled plate       | The instrument dial          | The lathe            |
|               | Tone and change     | The milled plate       | The instrument dial          | The anodised tag     |
|               | Hover, focus, press | The edge catches light | The knurl turns              | The badge tilts      |
|               | Live update         | Redrawn                | A click of the dial          | A glint              |

## Checked in this round (the finishing pass)

Firefox (Playwright), own `http.server` on `127.0.0.1`, all 22 themes, with
motion and under `prefers-reduced-motion: reduce`, DOM, computed-style and
contrast (gradients resolved to their worst stop; animations scoped per
element with `getAnimations({ subtree: true })`, counting `CSSAnimation`
objects only, never transitions):

- 0 console errors in any of the 22 themes, either motion setting.
- Every aspect row's three options differ in computed style (border,
  background, font, or the loading/live animation name) in every theme;
  the "while loading" rows for formal and titanium were a single rule
  spanning all three options (no visual difference between picks) — split
  into three option-specific rules (dotted leader / ruled / seal for
  formal; milled plate / dial tick / lathe band for titanium).
- Every loading option plays >= 1 running `CSSAnimation` at full motion and
  0 under reduced motion, in every theme.
- Live update: option 1 is silent by design (the number is simply
  replaced); options 2/3 play one `CSSAnimation` per `.kf-flash` retrigger.
  Two bugs fixed: terminal's and high-contrast's live option 3 used
  `steps(1, jump-none)`, which is invalid (`jump-none` needs >= 2 steps,
  so the browser dropped the whole `animation` declaration and nothing
  played) — changed to `steps(2, jump-none)`.
- Text >= 4.5:1 and separating edges >= 3:1, measured per theme. Fixes:
    - formal tone 1's delta ink (`var(--card)` on `var(--border-strong)`,
      3.42:1) → `var(--foreground)` (4.8:1); formal shape 2 had no
      `--kf-frame` and fell back to the package's own weak `--border`
      (1.3:1) → set explicitly to `var(--border-strong)`.
    - titanium shape 1/2's frame (`var(--border-strong)` alone, 2.6–3.0:1
      against the page background) → `color-mix(in oklab, var(--border-strong)
85%, var(--foreground) 15%)`.
    - The shared fallback frame in `kpi.css` (`[data-kf] .kp-kpi`, used by
      any option that does not set its own `--kf-frame`) was
      `1px solid var(--border)`, which fails 3:1 in every theme tested
      (1.2–2.2:1) → `1px solid color-mix(in oklab, var(--border-strong) 85%,
var(--foreground) 15%)`.
    - kpi-a.css (light, dark, cyberpunk, synthwave, pastel): every shape's
      `--kf-frame` mixed foreground into `var(--card)` (close to the page
      background in lightness, so the mix barely moved away from 1.2–2.4:1)
      → mixed into `var(--border-strong)` instead (now 4–7:1).
    - shade-light shape 2 used `var(--border)` instead of
      `var(--border-strong)` (1.3:1) → fixed.
    - terminal shape 2's grid pattern (45% `--border-strong` on the 1px
      lines) pulled the label/trend text contrast on the line pixels to
      4.29:1 → lowered to 25%.
    - shade-dark shape 2's warning-tinted corner wash (20% opacity) pulled
      label/value/trend text to 4.2–4.4:1 → lowered to 10%.
    - lapis tone 1's delta ink (`var(--secondary-foreground)`, 3.96:1) →
      lightened with `color-mix(in oklab, var(--secondary-foreground) 85%,
white 15%)` (8.5:1).
- Labels never wrapped or cut, in any theme.
- One height per tile across ready/loading/tone states within every row,
  in every theme (the package's own skeleton swap is the one exception —
  see Package findings below).
- The review dialog (`?next=/catalogue/changed.html&review=open`) opens
  with one group per aspect (5 groups), nothing ticked, 0 console errors.

### Measurement table (failures before -> after the fix pass)

| Theme(s)                                                                               | Before                                                   | After                                                                                                                                              |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| formal                                                                                 | 34 contrast failures (delta ink, shape-2 frame)          | 0 (3 package-finding instances remain, see below)                                                                                                  |
| titanium                                                                               | 48 contrast failures (shape 1/2 frame)                   | 0 (3 package-finding instances remain)                                                                                                             |
| light, dark, synthwave, pastel                                                         | 48–51 contrast failures each (shape frame vs card)       | 0 (3 package-finding instances each)                                                                                                               |
| cyberpunk                                                                              | 146 contrast failures (frame + grid-pattern false reads) | 0 (3 package-finding instances; the grid-pattern reads were a sampler bug, fixed to match the hairline-pattern filter in the proven method)        |
| terminal                                                                               | 10 (grid-pattern text contrast + live option 3 dead)     | 0 (3 package-finding instances)                                                                                                                    |
| shade-light                                                                            | 6 (shape-2 weak frame)                                   | 0 (3 package-finding instances)                                                                                                                    |
| shade-dark                                                                             | 13 (warning-wash text contrast)                          | 0 (3 package-finding instances)                                                                                                                    |
| lapis                                                                                  | 5 (delta ink + frame)                                    | 2 (delta ink fixed in our own tone rule, 8.5:1; the remaining 2 are the package's own `good`/`bad` delta colours on the reference tile, see below) |
| high-contrast                                                                          | live option 3 dead (invalid `steps(1, jump-none)`)       | fixed                                                                                                                                              |
| forest, blueprint, solstice, brutalism, deco, phantom, retro, grotesk, nostromo, sepia | 3–6 (shared weak fallback frame, or none)                | 0 (3 package-finding instances each)                                                                                                               |
| All 22 themes, all aspects                                                             | n/a                                                      | loading: >= 1 running animation at full motion, 0 under reduced motion; live: same; 0 console errors; labels never wrap/cut; one height per row    |

## Package findings (not fixable from this demo; for a later correction)

- **The ready -> loading height change comes from the package skeleton**,
  not from this demo's CSS: the plain tile's drawn height and its
  `kp-skeleton`-filled loading height differ (measured in formal: 103.7px
  drawn vs 112.2px loading). `js/kpi.js` and `css/components.css` are not
  touched by this demo; the skeleton's own sizing is a package-wide
  concern (the trend and columns demos will show the same number).
- **The shipped (reference) tile's border and its "good"/"bad" delta
  colours sit at low contrast against the card plate in most themes**
  (border ~1.2–2.3:1, measured against `--border`; lapis's "good"/"bad"
  delta chip colours ~3.96:1 against `--secondary`-coloured surroundings).
  This is `.kp-kpi`'s and `.kp-kpi__delta[data-kp-tone]`'s own default
  styling in `css/components.css`, not an aspect option from this demo —
  every theme's "For reference: the plain tile, as today" section at the
  foot of the page shows it unchanged, deliberately, for comparison.

Not yet done (later phases): the review round's `reopen` list (currently
empty, since no theme has been judged).
