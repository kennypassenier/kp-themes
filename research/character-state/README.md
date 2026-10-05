# A state word of its own, per theme

Kenny (form v18, 2026-10-05; and 2026-10-05 20:03: every demo gets separate
options per aspect, as the meter and the trend tile, "and it should be like
this in the future"). The character round's next component: the state word.

`.kp-state-word` (css/components.css, "A state word that keeps its width"
[scope-143]; `setStateWord()` in `js/components.js`) is today plain text,
as wide as the widest word it can show (`data-kp-words`, one per line), so
a button beside it never moves when the state changes; `.kp-state-word--center`
keeps the word in the middle of that width. This demo gives every theme a
dot and a plate of its own, in its own world, beside the plain word of
today.

## Structure: one pick per aspect

Per theme the word has three aspects, each picked on its own from three
options, and any combination composes.

| Aspect | Attribute        | What it covers                                                                 |
| ------ | ---------------- | ------------------------------------------------------------------------------ |
| Shape  | `data-sw-shape`  | the dot and the word's plate (frame, background, font treatment)               |
| Tone   | `data-sw-tone`   | how the state's kind (good, muted, pending, bad) reads on the dot and the word |
| Change | `data-sw-change` | what plays when the word moves to a new state; never a fade                    |

Only three aspects, chosen from what the component really does: shape
always first; the word carries no busy/loading state of its own (it is
plain text, changed in place) and nothing opens or closes, so neither
aspect applies; it does have tones (Running, Stopped, Restarting, Starting
in 3 min, Failed each read as good, muted, pending or bad); and it does
move live, when a consumer calls `setStateWord()` with a new word — that
move is the Change aspect, a state-change motion, never a fade.

The state's kind is set by the demo as `data-sw-kind="good|muted|pending|bad"`
on the same element that carries `data-sw-shape/tone/change`
(Running → good, Stopped → muted, Restarting and Starting in 3 min →
pending, Failed → bad), so a tone option's CSS keys off the kind, not the
word's text. A tone rule names its aspect, its option and the kind
together: `[data-theme='<t>'] [data-sw-tone='<n>'][data-sw-kind='<k>']`.

- `demo.html`: the section judged with the review kit (`../_review/review.js`,
  round `2026-10-05-state-r1`, all 22 themes reopened). At the top "Your
  combination", one chip carrying the picks ticked in the dialog (an aspect
  not ticked yet shows its option 1); under it three rows, one per aspect,
  of three chips that differ in that aspect only; the plain word of today
  below for reference, not as an option (its third row uses
  `.kp-state-word--center`). The controls sit in `data-review-controls`:
  State (Running, Stopped, Restarting, Starting in 3 min, Failed) and the
  speed of every animation.
- `state.css`: in `@layer kp.signature`. The shared part (`[data-sw]`,
  `[data-sw]::before` for the dot, `[data-sw] .kp-state-word` for the
  plate), then one rule per theme, aspect and option, `[data-theme='<t>']
[data-sw-<aspect>='<n>']`, which sets that aspect's knobs only; in a
  register the `[data-sw…]` and `[data-sw-kind…]` parts drop out. Phase 1
  fills this in for formal and titanium only. Every animation sits in one
  `prefers-reduced-motion: no-preference` block at the end; no keyframe
  touches opacity; the Change plays once when the page toggles
  `[data-sw-playing]` off and on, never looping at rest.
- `state-a.css` … `state-d.css`: empty (`@layer kp.signature {}`), one per
  theme group for a later phase: a = light, dark, cyberpunk, synthwave,
  pastel; b = terminal, forest, high-contrast, sepia, blueprint; c =
  solstice, brutalism, deco, phantom, shade-light; d = shade-dark, retro,
  grotesk, lapis, nostromo.
- `demo.js`: `ASPECTS`, the names and descriptions (`IDEAS`, per theme three
  aspects of three options, one sentence each — the spec the four group
  files implement), the review choices built from them, `compose()` (the
  preview takes the picks, each row's chip its own option in its own
  aspect), the state engine (`setWord()`, which calls the package's own
  `setStateWord()` on every chip and the plain reference, then retriggers
  the Change animation), the speed control.
- `demo.css`: the page layout only.

`js/components.js` is not changed; the page calls `setStateWord()` exactly
as a consumer would.

## Three aspects, not six

What the brief's six candidate aspects (shape, loading, arrival/leave,
tone, hover/focus/active, live update) reduce to for this component:

- **Shape**: kept, as always.
- **Loading**: no busy state of its own — `setStateWord()` only ever shows
  a word; dropped.
- **Arrival/leave or open/close**: the word does not open or close;
  dropped.
- **Tone**: kept — the component's whole job is showing a state, and a
  state reads in a tone.
- **Hover/focus/active**: the word itself takes no pointer or keyboard
  interaction (the button beside it does, unchanged); dropped.
- **Live update**: kept, renamed **Change** — the word moving to a new
  state is the one thing a consumer actually triggers live, and the brief's
  own rule for it applies directly: a state-change motion, never a fade.

## Phase 1 checks

Firefox (Playwright), a local `http.server` on a free `127.0.0.1:87xx`
port, DOM and console only (no screenshot lock): formal and titanium, with
and without `prefers-reduced-motion: reduce`.

- 0 console errors and 0 page errors in both themes, both motion settings.
- Every control (State × 5, Speed × 3) is reachable and toggles
  `aria-pressed` correctly; a click moves every chip and the plain
  reference to the new word together.
- The three options of every aspect differ in computed style (shape: the
  dot's `border-radius`/size or the word's `background`/`border`; tone: the
  dot's `background-color` per kind; change: the animation that runs).
- The Change animation runs at full motion and 0 running animations at
  rest, in both themes; under reduced motion, 0 running animations at any
  time.

`node gates/check-catalogue.mjs` and `node gates/check-demo-variants.mjs`
pass; the demo names its component as `data-review-components="state-word"`,
and shows `.kp-state-word--center` (the catalogue's only documented
modifier of this component) on the plain reference row so the variants
check has it.

## Phase 2: all 22 themes, finished

Every theme now has its three aspects in `state.css` (formal, titanium) or
its group file (`state-a..d.css`); no `ideas-*.json` files exist for this
demo (every option was kept from the original `IDEAS`, so there was
nothing to merge). Per-theme names, from `IDEAS` in `demo.js`:

| Theme         | Shape (1 / 2 / 3)                           | Tone (1 / 2 / 3)                                       | Change (1 / 2 / 3)                               |
| ------------- | ------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------ |
| formal        | seal / ledger tab / signet                  | ink rule / red entry / ledger stamp                    | Re-sealed / Entered in the ledger / Turned over  |
| light         | soft dot / daylight pill / sticky note      | soft wash / tinted pill / warm note                    | A soft swell / pill breathes / note flutters     |
| dark          | status lamp / panel tab / console line      | lamp colour / lit well / alarm line                    | lamp flares / Switched over / line jumps         |
| cyberpunk     | neon dot / HUD bracket / data tag           | neon colour / hazard tag / glitch split                | trace burns / Jacked in / A packet in            |
| synthwave     | sunset dot / VCR tag / grid chip            | laser colour / inverse block / grid glow               | laser flares / tracking rolls / Over the horizon |
| pastel        | candy dot / washi tag / sticker chip        | candy colour / taped label / heart sticker             | A happy hop / tape flutters / Popped             |
| terminal      | top(1) row / box-drawn tag / status line    | reverse colour / bracket colour / alert blink          | A blip / Redrawn / cursor blinks faster          |
| forest        | trail marker / wooden tag / leaf chip       | blaze colour / tag stain / autumn leaf                 | A rustle / Blazed again / tag swings             |
| high-contrast | ink dot / framed tag / inverse chip         | dot only / framed colour / inverse colour              | A hard flash / frame redraws / Inverted          |
| sepia         | ink blot / letterpress tag / barograph mark | ink colour only / pressed colour / red-ink entry       | A blot spreads / Pressed again / Signed again    |
| blueprint     | pin mark / title block / grid chip          | pin colour / ruled colour / hatch warning              | A tick redraws / Ruled again / Plotted           |
| solstice      | ember / low sun chip / warm tag             | ember colour only / glowing chip / hot halo            | A glint / sun rises / Rekindled                  |
| brutalism     | block dot / slab tag / sticker chip         | block colour / slab colour / hazard sticker            | A hard slam / slab shifts / Restamped            |
| deco          | gilt dot / marquee tag / sunburst chip      | gold colour only / lit marquee / gold warning          | A bulb lights / marquee chases / Regilded        |
| phantom       | red dot / evidence tag / calling card       | string colour only / stamped colour / slashed warning  | Pinned / Restamped / Re-slashed                  |
| shade-light   | pencil dot / leaf-shade tag / paper chip    | pencil colour only / shaded colour / paper warning     | A soft stroke / leaves shift / Lifted            |
| shade-dark    | silverpoint dot / lamp tag / ink chip       | silver colour only / lamp colour / rim warning         | A glint / lamp dims and lifts / Reinked          |
| retro         | LED dot / bevelled tag / scope chip         | LED colour only / bevel colour / scope warning         | LED blinks / Switched / A trace jumps            |
| grotesk       | colour bar dot / transit tag / index chip   | flat colour only / bar colour / index warning          | A flat swap / bar redraws / Ticked               |
| lapis         | gold dot / girih tag / vellum chip          | gold colour only / lattice colour / rim warning        | A gleam / lattice shifts / Reinked               |
| nostromo      | CRT dot / indicator tag / panel chip        | phosphor colour only / lamp colour / klaxon warning    | A blip / lamp lights / Rescanned                 |
| titanium      | milled dot / dial tag / badge chip          | anodised colour only / machined colour / badge warning | A click of the dial / knurl rolls / A glint      |

### Fixes made in this pass

- **`--success`/`--warning` used alone fall under 3:1 against the card** in
  several themes (the token itself is a pastel/dark _fill_, meant to pair
  with its own `-foreground` as the ink, not to stand alone as a dot, ring
  or frame colour). Measured and fixed in `state.css` (formal, titanium)
  and `state-c.css` (solstice, brutalism, deco): every bare
  `var(--success)`/`var(--warning)` used as `--sw-dot`, `--sw-dot-ring` or
  `--sw-frame` now reads `var(--success-foreground)`/
  `var(--warning-foreground)`; a plate keeps the full pair (the base token
  tinted into the plate's background via `color-mix`, its own
  `-foreground` as the ink on it). `--destructive` needed no change
  anywhere it was checked — it is already a mid-strength/bright accent in
  every theme touched, not a pastel fill.
- **Titanium's "badge chip" (tone 3, bad)**: the ink was
  `--destructive-foreground` (the _dark_ ink meant for text printed on top
  of the bright `--destructive` fill), sitting on a plate that is mostly
  `--muted` (dark) with only a 20% tint of `--destructive` — dark ink on a
  dark plate measured 1.2:1. Now the ink is `--destructive` itself (the
  bright accent, which is what actually reads against that dark plate),
  and the plate's tint was eased from 20% to 12% destructive for a
  comfortable 4.5+:1 margin.
- **Titanium's default ("muted") ring/frame** used
  `var(--border-strong, var(--border))`, which is itself only 2.58:1
  against titanium's card — under the 3:1 a separating ring needs. Swapped
  to `var(--muted-foreground)` (4.75:1), matching the dot's own default
  colour.
- **Formal's shape 2/3 frame and the tone-3 "muted" frame** used
  `var(--border)` (1.36:1 against formal's card) where every other frame
  in the file already uses the `border-strong` fallback pattern (3.43:1);
  brought those three into line.
- **A solid-colour hack inside `background-image`** (three spots in
  `state-b.css`: terminal's "Redrawn", sepia's "Signed again", blueprint's
  "Ruled again" — `linear-gradient(var(--x), var(--x))` used only to get a
  `background-size`-animatable rule under the word): replaced with the
  `box-shadow: inset 0 -Npx 0 0 var(--x)` technique `state.css` already
  uses for formal's "Entered in the ledger", so no colour sits inside
  `background-image` anywhere in this demo.
- A measurement-script bug (not a CSS bug) initially reported near-1:1
  text contrast everywhere in terminal/high-contrast/forest/blueprint and
  wrong figures elsewhere: the first pass checked the word's _parent's_
  background, missing the word's own `background-color` where a tone sets
  it directly (reverse video, inverse chips, …). Fixed in the measurement
  script (not the CSS); re-running on the corrected script showed those
  four themes clean.

### Measurement, Firefox, 22 themes × 2 motion settings

Own `http.server` on `127.0.0.1:87xx`; DOM + computed style + resolved
contrast (ancestor chain, worst gradient stop), per
`__cc`/`__m`-style in-page helpers; animations scoped per element via
`chip.getAnimations({ subtree: true })`, counting only `CSSAnimation`s.

| Check                                                       | Before this pass                                                    | After                                                                       |
| ----------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Console/page errors (44 runs)                               | 0                                                                   | 0                                                                           |
| Every aspect row's 3 options differ (22 themes × 3 aspects) | all differ                                                          | all differ                                                                  |
| Change animation ≥ 1 running at full motion, 0 at rest      | all themes                                                          | all themes                                                                  |
| Change animation: 0 running under reduced motion            | all themes                                                          | all themes                                                                  |
| Text ≥ 4.5:1 (first corrected run)                          | 1 theme borderline (shade-dark, 4.23–4.36) + the titanium bug above | shade-dark unchanged (theme-level, see open points); titanium fixed (≥ 4.6) |
| Dot/ring/frame ≥ 3:1 (first corrected run)                  | formal, titanium, solstice, brutalism, deco failing (see Fixes)     | all fixed; pastel and phantom remain (see open points)                      |
| Labels wrapped or cut                                       | 0                                                                   | 0                                                                           |
| One height per component across states                      | sepia, brutalism differ by 2–4px on tone 3 only (see open points)   | unchanged, by design (see open points)                                      |

### Open points (this demo)

- **Pastel, shape 1 ("candy dot")**: its flat sticker-shadow
  (`color-mix(in oklab, var(--foreground) 15%, transparent)`, 0 blur,
  1px offset) measures 1.32:1 against the card. It is a deliberately
  faint flat-design touch (the IDEAS text says "a flat sticker shadow"),
  not a status ring — the dot's own fill (`--muted-foreground`) carries
  the real contrast. Flagging for Kenny's call rather than brightening it,
  since brightening would turn a subtle flourish into a hard outline.
- **Phantom, shape 2 ("evidence tag")**: its double box-shadow
  (`0 0 0 3px var(--card), 0 0 0 4px var(--foreground)`) is a
  card-coloured spacer plus a foreground ring; the spacer reads 1:1
  against the card by construction (it is meant to look like nothing),
  and the actual ring measured 2.7:1. Close to 3:1 but not there; worth a
  second look together with the measurement method, since the spacer
  shadow confuses a naive "every box-shadow needs 3:1" reading.
- **Sepia's "red-ink entry" and brutalism's "hazard sticker"** (tone 3)
  intentionally thicken the frame for the warning/failed states — that is
  the approved IDEAS text ("ruled off… in red ink", "turns the sticker's
  outline thicker"). It costs 2px (sepia) / 4px (brutalism) of height on
  that one option only, and only for those two kinds. Left as designed
  rather than normalised away, per "an approved demo is implemented
  exactly."
- **Shade-dark's base word ink** measures 4.23–4.36:1 against the card for
  the two tone options that don't recolour it (shape/tone options that
  only tint the dot). That is the theme's own foreground-vs-card ratio,
  not something this component's CSS sets — a package finding, not a fix
  here.
- **Package finding, carried from the groups' own measurement**: the
  _plain_ state word (`.kp-state-word` as shipped, not a demo option) has
  a dot under 3:1 in retro and lapis. Out of scope for this demo (the
  plain word is the package's own styling, unchanged here); for the
  package's README/correction log.
