# A new divider for cyberpunk: six options

**Decided (scope-96, 2026-09-15):** Data stream. Kenny chose option 3 over the recommended circuit bus; it replaces the razor tear in
`css/cyberpunk-register.css`, and `gates/generate-tear.mjs` and `gates/tear.json` went with the tear. The demo is archived.

Kenny, judging `catalogue/page-effects.html#dividers` in cyberpunk (2026-09-15): "Ik wil enkel voor dit thema een nieuwe divider, geef me
een paar opties die bij het thema passen". Demo: [`demo.html`](demo.html) (46468 bytes, `wc -c`), in the catalogue under "Research to
look at". A full-page capture at 1280px, reduced motion: [`screenshot.png`](screenshot.png) (740045 bytes). A firefox check sits beside
it: [`verify.spec.mjs`](verify.spec.mjs) with [`playwright.config.mjs`](playwright.config.mjs), run as
`KP_TEST_PORT=4619 npx playwright test -c research/cyberpunk-dividers/playwright.config.mjs` (8 tests, 8 passed).

**Scope (scope-95, fix-35).** Cyberpunk only: no knob, no attribute, no block in every theme. Each option is written as
`[data-theme='cyberpunk'] .cd-<option> [data-kp-divider]` and goes into `css/cyberpunk-register.css` by dropping `.cd-<option>`,
replacing the razor tear's rules (lines 209–255). The demo's rules are unlayered and first clear the tear's pseudo-elements; the register
would not need that. Every option answers both seams the tear answers: after a hero (yellow above, `--background` below) and after an app
surface (`--background` above, `--sidebar-background` below, `data-kp-divider="alt"`). Nothing names a colour (DI9): tokens and relative
colours of them only. Block 7 follows the theme menu and the spec proves synthwave and nostromo paint exactly what they paint without the
option classes.

**Seams.** A tiled mask never draws on its tile edge (every motif sits inside its tile), `mask-repeat: space` keeps tiles whole at both
ends, and any line that must run the full width is one untiled gradient. The two untiled shapes (glitch, HUD) have no tile at all. The
spec reads device pixels at `layout.css.devPixelsPerPx=2.222`, at 1024, 997 and 853px wide, with every animation parked mid-loop: no
column of one or two device pixels darker than the ink on both sides. The check was proven by planting a 0.45px gap in the circuit bus: it
failed on every tile edge. One fault found and fixed while building: the HUD tab's `clip-path` ended on a fraction of a device pixel and
let a void row show under the hero, so the lip is also painted on the element itself.

## Options

| #   | Name            | Look                                                                                                                          | Reference                                                                                                     | Cost   | Motion                                                       | Recommendation                     |
| --- | --------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------ | ---------------------------------- |
| 0   | Razor tear      | As shipped: a generated 44px tear, yellow into void, cyan hairline on the ridge                                               | `css/cyberpunk-register.css`, `gates/generate-tear.mjs`                                                       | —      | none                                                         | the one to replace                 |
| 1   | Hazard chevrons | 30px band of yellow chevrons between two faint rules; cyan and reversed at the footer                                         | [OSHA 1910.144, yellow for caution](https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.144)  | small  | none                                                         | runner-up: loud, very readable     |
| 2   | Circuit bus     | Cyan bus line, 45° stubs to ring pads and vias per 180px; yellow and flipped at the footer                                    | [HUDS+GUIS: Cyberpunk 2077](https://www.hudsandguis.com/home/2019/cyberpunk-2077)                             | small  | a pulse runs along the bus, 4000ms loop                      | **recommended**                    |
| 3   | Data stream     | Three rows of muted yellow dashes (144px) with cyan packets (216px) under a scan hairline                                     | [Interface In Game: Cyberpunk 2077](https://interfaceingame.com/articles/cyberpunk-2077-ux-ui-critique/)      | small  | two layers drift one tile per 8000ms loop; footer flows left | if Kenny wants motion first        |
| 4   | Glitch slice    | The hero's edge cut into displaced slices, cyan hairline on the cut, cyan/red/yellow ghost slices                             | [CSS-Tricks: glitch effect](https://css-tricks.com/glitch-effect-text-images-svg/)                            | small  | ghosts jump 6–10px for 250ms every 5000ms                    | closest to the tear, straight cuts |
| 5   | HUD bracket     | 3px lip with a centred cut-corner tab and three status squares, cyan outline, L-brackets at both ends; mirrored at the footer | the register's own navbar notch (`--kp-nav-notch`)                                                            | medium | none                                                         | good once, heavy if repeated       |
| 6   | Index ruler     | Yellow hairline with 9px ticks, a long tick per 45px, a fixed cyan barcode block at one end                                   | [MDN `mask-repeat: space`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-repeat) | small  | none                                                         | the quiet choice                   |

Cost: small is one rule set of two pseudo-elements and one or two data URIs, replacing the tear block; medium (HUD) adds two mirrored
`clip-path` polygons and a lip on the element. Every option retires `--fx-tear*`; grep finds them in `css/cyberpunk-register.css` only, so
`gates/generate-tear.mjs`, `gates/tear.json` and the two lines of `gates/gates.test.mjs` that name the tear could go with it. Every animation sits inside
`@media (prefers-reduced-motion: no-preference)` with literal durations, and none flashes. The spec checks that under reduced motion no
divider animates.

## Recommendation

**2 · Circuit bus.** It says cyberpunk in the theme's own vocabulary (the register already speaks of HUD chrome, and traces with pads are a
staple of the genre's interface art), yet it is a thin line that does not fight the yellow hero or the text around it. It
keeps the tear's two strengths: a cyan line that reads on the void, and a yellow version for the footer seam. Its seam safety is structural:
the bus is one gradient and every stub sits inside its tile. The pulse is optional and costs one keyframe. The runner-up is **1 · Hazard
chevrons**, the boldest and simplest, if Kenny wants the divider to be a statement rather than a line. **4 · Glitch slice** is the choice
if what he disliked was only the tear's jagged spikes and not the idea of a broken edge.
