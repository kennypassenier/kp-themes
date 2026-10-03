# Signature elements: which other elements can carry a theme's identity

Kenny, 2026-10-03, after asking for a progress bar with an identity per theme
(pacman's ILoveCandy bar): "en zoek uit voor welke andere elementen/effecten
dit ook kan". This round inventories the candidates, measures how much the 22
registers differ on each today, and drafts ten of them in three contrasting
themes (formal, cyberpunk, retro) plus one more theme each.

- `demo.html` + `demo.css` show the package look and the signature side by side
  (`?theme=<name>`). The markup in both columns is identical: every signature is
  CSS on the package's own classes, scoped `[data-theme='<theme>'] .sx-sig`. The
  element's API and ARIA are the same in every theme.
- `measure.sh` (grep) and `measure.mjs` (rule parser) produce the counts below.
- `shoot.mjs` takes the screenshots in `out/`: `<theme>-desktop.png` (1280x900)
  and `<theme>-phone.png` (390x844) for formal, cyberpunk and retro, and
  `<candidate>-<theme>.png` close-ups for formal and cyberpunk.

## The rules every draft follows

- **Same element, same API.** No markup changes, no new classes, no theme
  `if`s (DI9). A signature restyles the element and its `::before`/`::after`.
- **Colour only from theme custom properties.** Tokens (`--primary`,
  `--accent`, …), relative colours of them, and the register's own stacks
  (`--kp-sunken`, `--kp-raised`, `--kp-ramp`, `--kp-brush`). No literals.
- **Motion animates `transform`, `opacity` and `clip-path` only**, all inside
  `prefers-reduced-motion: no-preference`. The rest state, which is what
  reduced motion shows, is fully readable. Every entrance plays once.
- **No `clip-path` on a focusable element.** It clips the focus ring that DI2
  makes a system constant. Notches and shears go on pseudo-elements, or on
  elements that never take focus (a tooltip, a skeleton, an empty state).
- **Every skeleton line starts at the inline-start edge**, in every theme: no
  indent, no drop cap that pushes lines in, no right alignment (Kenny,
  2026-10-03, twice). `check-flush.mjs` measures it in all 22 themes and must
  pass before a skeleton is shown; the package's skeleton takes the same check
  as a test when it ships.
- **A busy indicator moves.** Spinner and skeleton loop seamlessly while busy
  (Kenny, 2026-10-03), whatever a theme's "nothing loops" note says.
- **The focus ring is left alone.** DI2: "the one thing a theme may not express
  differently". It was on the brief's list. It is measured below and ruled out.

## How the registers differ today

`measure.mjs` reads every leaf rule in the 22 registers and sorts each register,
per element, into: **any** (some rule names the element), **shape** (a rule gives
it its own shape or motion: an animation, a `::before`/`::after`, `clip-path`,
`mask`, `transform`, `content` or a gradient), and **motion** (a rule declares
an animation or transition). `measure.sh` is the plain grep version:

```sh
# selector lines only (end in "{" or ","), per register
command grep -E '<pattern>' css/<theme>-register.css | command grep -cE '[{,][[:space:]]*$'
# e.g. pattern 'kp-spinner', 'kp-skeleton', '::selection', 'kp-tooltip'
node research/signature-elements/measure.mjs
```

| element                     | any   | shape    | motion   | reading                                                            |
| --------------------------- | ----- | -------- | -------- | ------------------------------------------------------------------ |
| spinner                     | 22/22 | **0/22** | 0/22     | every theme recolours the same rotating ring                       |
| progress (native)           | 22/22 | 1/22     | 0/22     | in hand: research/progress-signature                               |
| tooltip                     | 22/22 | **2/22** | 0/22     | mostly one line in a shared popover selector list                  |
| toast                       | 22/22 | 3/22     | 1/22     | restyled, but nothing arrives in a theme's own way                 |
| empty state                 | 22/22 | 4/22     | 0/22     | nearly all a dashed box                                            |
| pagination                  | 22/22 | 4/22     | 0/22     |                                                                    |
| breadcrumb                  | 22/22 | 4/22     | 0/22     |                                                                    |
| timeline                    | 22/22 | 3/22     | 0/22     |                                                                    |
| back-to-top                 | 22/22 | 1/22     | 0/22     |                                                                    |
| wizard steps                | 22/22 | 7/22     | 0/22     | cyberpunk's rule targets `.kp-wizard__step`, which nothing renders |
| tabs / accordion / tag      | 22/22 | 7/22     | 0-1/22   | the same seven loud themes each time                               |
| checkbox / radio            | 18/22 | 7/22     | 0/22     | **0/22 have a radio rule**                                         |
| switch                      | 22/22 | 8/22     | 1/22     | the thumb moves by `inset-inline-start` (layout) in all 22         |
| link (`a`)                  | 22/22 | 8/22     | 4/22     | one base rule: underline, 2px on hover                             |
| badge                       | 22/22 | 9/22     | 0/22     |                                                                    |
| alert                       | 22/22 | 9/22     | 0/22     |                                                                    |
| skeleton                    | 22/22 | 10/22    | **0/22** | a texture in 10, its own motion in none                            |
| dialog                      | 22/22 | 11/22    | 6/22     | the six entrances are all a fade or a rise                         |
| dialog `::backdrop`         | 8/22  | 2/22     | 3/22     |                                                                    |
| `::selection`               | 2/22  | 0/22     | 0/22     | the base layer already paints it in the primary pair for all       |
| caret                       | 5/22  | 2/22     | 0/22     |                                                                    |
| cursor                      | 5/22  | 1/22     | 0/22     |                                                                    |
| scrollbar                   | 16/22 | 1/22     | 0/22     | coloured in 16, shaped only in retro                               |
| table row hover             | 17/22 | 0/22     | 0/22     |                                                                    |
| card hover                  | 1/22  | 1/22     | 0/22     |                                                                    |
| range slider                | 0/22  | 0/22     | 0/22     | no general component; only inside the colour picker                |
| divider (`data-kp-divider`) | 22/22 | 21/22    | 2/22     | already a signature in every theme                                 |
| `<mark>` / reveals          | 22/22 | 19/22    | 22/22    | already a signature (the hook vocabulary, S45)                     |
| focus ring                  | 22/22 | n/a      | n/a      | out of bounds: DI2                                                 |

The pattern is clear. The places with a per-theme identity are the hook
vocabulary (divider, mark, reveals), and that is because each theme was asked
for one. Everything that signals **waiting** (spinner, skeleton) or
**arriving** (toast, tooltip, dialog) is still the package's look with a new
colour. Those are the gaps.

### Three findings on the way

1. **Retro and cyberpunk draw a radio as a square.** Their registers give
   `.kp-field__check` `appearance: none` and a square well, and no register
   anywhere has a `[type='radio']` rule. A radio group in those themes looks
   like a set of checkboxes and is ticked like one (`out/retro-desktop.png`,
   section 4, left column). This is a legibility fault in its own right, not
   only a signature gap.
2. **Cyberpunk's wizard rule is dead.** `[data-theme='cyberpunk'] .kp-wizard__step`
   matches nothing. The package renders `.kp-wizard__steps li`.
3. **The switch thumb animates a layout property.** `inset-inline-start` is
   transitioned in `css/components.css`, so every flip lays out again for
   150ms. Every draft here moves the thumb with `transform`. A package fix
   should do the same, and multiply the distance by -1 under `:dir(rtl)`.

## The ten candidates

Ordered as in the demo. The ranking is at the end.

### 1 · Spinner: effort small

**Today:** 22/22 registers recolour it, **0/22** give it a shape or motion of
its own. It is the same 2px ring turning in every theme. **The idea:** keep one
inline element that stays the same size, and let its pseudo-elements draw the
theme's own busy sign. Formal: a watch dial, a hairline ring with a single navy
hand that sweeps round and settles each turn. Cyberpunk: a notched sensor window
with a signal-yellow scan line and a breathing cyan core. Retro: the 1995
hourglass, navy sand running down in five snaps, then the glass turning over.
Terminal: `| / - \` in one character cell. It is the closest relative of the
progress bar, used everywhere, and needs no markup. **Risk:** accessibility is
low, because `role="status"` and the label carry the meaning and the shape is
decoration. The retro hourglass is narrower than the ring (0.75 of the size),
so a theme that changes the footprint must keep it constant over time. All
motion is a transform on a pseudo-element. Performance is negligible.

### 2 · Skeleton placeholder: effort small

**Today:** 22/22 style it, 10/22 give it a texture, **0/22** their own motion.
They all share the package's opacity pulse. **The idea:** loading should look
like the theme waiting. Formal: ruled ledger lines with the first line indented
like a paragraph, breathing slowly. Cyberpunk: notched, hatched data slots with
a scan head (yellow leading edge) sweeping each line in turn. Retro: sunken
wells of the 50% dither brush, stepping through four strengths, not fading.
Blueprint: a section hatch between two dimension ticks. **Risk:** low. The
skeleton is decoration under `aria-busy`. Opacity and transform only. The
cyberpunk sweep is one `translateX` per line on its own layer. The hatch and
texture opacities stay under DI9's 6% texture ceiling where they read as a
texture.

### 3 · Switch: effort medium

**Today:** 22/22 tint it, 8/22 reshape the track or thumb, and the thumb moves
by a layout property in all 22. **The idea:** the switch already has an approved
geometry and knobs (`--kp-switch-*`), so a signature mainly changes track and
thumb. Formal: a double-ruled slot, framed twice as formal frames what matters,
with a navy ink dot on the paper thumb when on. Cyberpunk: a sheared plate, and
the track charges with hazard stripes that stop short of the thumb (they first
ran under it, and the yellow plate disappeared on yellow; fixed). Retro: a
raised button in a sunken slot that turns title-bar navy, with no easing.
Terminal: a block cursor stepping across a bracketed cell. **Risk:** state must
not rest on colour or position alone. The On/Off words stay, so DI4 holds. The
track boundary must keep 3:1 (DI1). The formal inner rule sits inside the
measured border, not in place of it. `clip-path` must not land on the input,
because it would clip the focus ring. The cyberpunk shear is on `::before` for
that reason. Medium, because the thumb change to `transform` belongs in the
package first.

### 4 · Checkbox tick and radio: effort medium

**Today:** 18/22 style `.kp-field__check`, 7/22 draw their own tick, **0/22**
have a radio rule. **The idea:** the tick is the most-seen state change in a
form. Formal: the tick draws itself as a pen stroke (a `clip-path` reveal), and
the radio's ink dot grows. Cyberpunk: the whole cell lights signal-yellow with
an ink tick sliced in over three frames, and the radio becomes a diamond, which
is still clearly not a box. Retro: keeps the register's pixel tick and gives the
radio its round sunken well with an ink pip. Terminal: `[x]` and `(*)`.
**Risk:** this is the riskiest of the ten for accessibility. A custom control
must stay a native `input` (it does: `appearance: none` keeps role, state and
keyboard). The radio-versus-checkbox shape difference is load-bearing (see
finding 1). The terminal text control is 3ch by 1.25em, under the 24px target
of WCAG 2.5.8 unless the label is part of the target, which in the package it
is. Windows forced-colours mode drops backgrounds. A tick drawn with borders
survives that, but one drawn with a background gradient (retro's register) does
not, so it needs a `forced-colors` fallback. Medium, because the radio rule is a
fix every theme needs anyway.

### 5 · Toast entrance: effort small

**Today:** 22/22 restyle it, 3/22 give it a shape, 1/22 any entrance motion.
**The idea:** the moment a toast arrives is the theme's voice in one third of a
second. Formal: it rises 8px and a navy rule draws once across its top ("a
rule that draws once" is formal's own motion verb). Cyberpunk: one slice
burst, three horizontal cuts out of register settling in 360ms, after which the
register's notch and cyan edge come back. Retro: a little window with a raised
bevel and a title-bar ramp, dropping in three snaps. Terminal: typed out left
to right behind a `>` prompt. **Risk:** the toast is a live region. Its text is
announced on insertion whatever the animation does, so the motion is visual
only. The cyberpunk burst must be measured by `check-motion` against DI5 (four
position changes, no luminance flip, once). Do not put `overflow: hidden` on the
toast to hold the rule, because it clips the close button's focus ring. The
formal rule is inset by the radius for this reason. Performance: one animation
per toast, transform and clip-path, on its own compositor layer.

### 6 · Dialog open: effort medium

**Today:** 22/22 restyle it, 11/22 give it a shape, 6/22 an entrance, and all
six are a fade or a rise. 8/22 touch `::backdrop`. **The idea:** opening a modal
is the biggest single change on the screen. Formal: a sheet laid on the desk,
framed twice (a rule inside a rule) over a paper-tinted backdrop, rising 14px.
Cyberpunk: CRT power-on, a yellow line that stretches to full width and then
opens to full height. Retro: the Windows 3.1 zoom, from a quarter size to full
in four hard frames. Deco: a sunburst opens from the top centre inside a gold
double frame. **Risk:** focus moves into the dialog at `showModal()`, before
the animation ends. A clip or a scale must never hide the focused control for
longer than the entrance (at most 380ms here). The cyberpunk and deco
entrances use `fill-mode: backwards` so the register's own notch `clip-path`
returns afterwards. Exit animations need `transition-behavior: allow-discrete`
on `display`/`overlay`, which is a second step. Medium, because it touches the
top layer and the overlay script.

### 7 · Tooltip: effort small

**Today:** 22/22 style it, but nearly always as one line in a shared popover
selector list. **2/22** give it a shape and **0/22** an entrance. **The idea:**
a tooltip is a tiny piece of the theme's voice. Formal: a small-caps marginal
note with a pointer, dropping 3px into place. Cyberpunk: a machine readout with
a cyan `>` prompt and a notched corner, wiped in over four frames. Retro: the
1995 balloon, pale yellow with a 1px ink border in the DOS face, appearing after
the hover delay with no fade at all. Blueprint: a drawing annotation whose
leader line and node draw first. **Risk:** small caps and uppercase cut reading
speed on long text, but a tooltip is short by contract. The retro yellow is a
mix of `--warning` and `--popover`, and its contrast with ink must go into the
gate (DI9: every new surface pair is gated). The tooltip never takes focus, so
`clip-path` is allowed here. Pointers and leaders must follow the anchor
position (`position-area`), which the draft does not yet do for flipped
placements.

### 8 · Wizard steps: effort small

**Today:** 22/22 style the wizard, 7/22 reshape the step markers, and one of
those rules is dead (finding 2). **The idea:** progress through a task in the
theme's own numbering. Formal: roman numerals in the display face, joined by a
hairline like a table of contents. Cyberpunk: a chevron run of plates
(`01 ▸ 02 ▸ 03`), the current one yellow and the done ones cyan. Retro:
installer panels, done ones sunken and the current one a raised title-bar plate.
Deco: diamonds on a gold double rule. **Risk:** `aria-current="step"` and the
check glyph on done steps carry the state (DI4). Every draft keeps both. Roman
numerals read slower for some people. The step's name is beside every numeral,
so the numeral is never the only label. On the phone the formal rule between
steps can end up at the end of a row when the list wraps. Static, no motion.

### 9 · Empty state: effort small

**Today:** 22/22 style it, nearly all as a dashed box, 4/22 give it a shape of
its own. **The idea:** an empty list is a moment the theme can speak, and it is
static. Formal: a blank ledger page, a double rule above, three faint ruled
lines, the title in italic display type. Cyberpunk: a dead channel, a notched
frame with faint scanlines and a `///` readout. Retro: an empty list view, a
white sunken well with a dither icon and the title in the DOS face. Terminal: an
empty prompt whose block cursor blinks five times and then stays lit (WCAG
2.2.2: nothing blinks for more than five seconds). **Risk:** low. Glyph
prefixes such as `///` and `>` are not words, so KT5 (no `content` words) holds.
The ruled lines sit below the text, never behind it. The scanlines are at 5%,
under DI9's ceiling.

### 10 · Link hover: effort medium

**Today:** one base rule for all (underline, 2px on hover). 8/22 registers add a
shape and 4/22 motion. **The idea:** the most frequent hover on any page.
Formal: the underline doubles under the pointer, the same double rule formal
uses to frame what matters. Cyberpunk: a dotted cyan underline at rest, and a
yellow bar that sweeps in beneath under the pointer. Retro: the link becomes the
selection bar, navy with white text, as a 1995 menu item does. Synthwave: a
horizon underline, pink into cyan, that glows. **Risk:** links must stay
underlined (DI4, TH31). The cyberpunk bar is an absolutely positioned
`::after`, which follows only one line box. A link that wraps needs the
`text-decoration` fallback, so it is right for navigation and wrong for body
text. Synthwave's gradient underline is a background, so it needs a
`forced-colors` fallback to `text-decoration` (in the draft). Hover changes are
paint-only except the cyberpunk transform. Medium, because links appear in body
copy, navigation and tables, and each needs checking.

## Not drafted, and why

- **Focus ring:** DI2 forbids it. Not a candidate.
- **`::selection` and caret:** cheap and visible, but the base layer already
  paints selection in each theme's primary pair. A signature would only change
  shape (`caret-shape: block` has no Firefox support) or alpha. Small effort and
  a small win: worth a line in a register, not a round.
- **Scrollbar:** coloured in 16/22, shaped only in retro. Firefox styles only
  `scrollbar-color` and `scrollbar-width`, so a signature works in Chromium only.
- **Range slider:** there is no general component (only the colour picker's
  sliders). It needs a component first.
- **Pagination, breadcrumb, timeline, tabs:** 3 to 7 of 22 shaped. These are
  good follow-ups once the pattern from the ten is approved. They are lower
  frequency and static, so they speak less for the theme.
- **Table row hover, card hover, cursor:** a row hover is functional, and a
  signature there competes with the row's data. Custom cursors hurt
  predictability.

## Ranked recommendation

Ranked by visibility × identity gained ÷ (risk + effort):

1. **Spinner**: 0/22 shaped today, everywhere, pure decoration, no markup. Small.
2. **Skeleton**: 0/22 with own motion. It pairs with the spinner and the
   progress bar as one "waiting" family. Small.
3. **Toast entrance**: 1/22 motion. The theme's voice in a third of a second,
   live region unaffected. Small.
4. **Tooltip**: 2/22 shaped. Seen on every icon button. Never focusable, so
   free to clip. Small.
5. **Checkbox and radio**: 0/22 radio rule. Do it for the fix (finding 1) and
   get the signature with it. Medium.
6. **Switch**: 8/22 shaped. Do it with the `transform` fix (finding 3). Medium.
7. **Dialog open**: 6/22 entrances, all alike. Biggest moment on screen, but
   it touches the top layer and focus timing. Medium.
8. **Empty state**: 4/22 shaped. Static, safe, quick. Lower frequency. Small.
9. **Wizard steps**: 7/22 shaped, one dead rule. Static. Small.
10. **Link hover**: 8/22 shaped. High frequency, but the most edge cases
    (wrapping, forced colours, tables). Medium.

Suggested grouping for a round: **"waiting"** (progress bar + spinner +
skeleton), then **"arriving"** (toast + tooltip + dialog), then **"choosing"**
(checkbox/radio + switch, carrying findings 1 and 3). Each group gives every
theme one coherent motion verb across several elements, which is what makes a
signature read as the theme rather than as a gadget.
