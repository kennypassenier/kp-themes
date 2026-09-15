# dark's dialog shadow: five options

Kenny, 2026-09-16, the gestures-and-shadows form (`scope-101`), asked for the options rather than an answer: _"toon alle opties in een
demo"_. Demo: [`demo.html`](demo.html) (78837 bytes, `wc -c`), in the catalogue under "Research to look at". A firefox check sits beside it:
[`verify.spec.mjs`](verify.spec.mjs) with [`playwright.config.mjs`](playwright.config.mjs), run from the repository root as
`KP_TEST_PORT=4662 npx playwright test -c research/dark-dialog-shadow/playwright.config.mjs` (7 tests, 7 passed). Nothing in
`css/dark-register.css` is touched: every option is a rule in the demo's own `<style>`, written as
`[data-theme='dark'] .ds-<option> .kp-dialog` so it goes into the register by dropping the wrapper class.

## The fault

`css/dark-register.css:1587` casts the dialog's shadow in the theme's **own background token**:
`filter: drop-shadow(0 12px 28px hsl(from var(--background) h s l / 0.45))`. The popover family (line 915) and the bar's dropdown (line 631)
carry the same colour as a `box-shadow`. On dark's own ground that is 45 % of the ground over the ground: about two of 255. Measured on the
demo, at devicePixelRatio 1, in a 24px band round the panel: the shadow moves 43.6 % of the dialog's band by at least one step of CIE L*,
but only where the theme's pool of pointer light gives it something to take away; it passes ΔL\* 3 on 0.4 % of the band and peaks at 4.34 of 100. Beside the popover, away from that pool, it peaks at 2.33 and not one pixel passes 3. The shape is right — since `f73cdfa4` the plate
and the chamfer live on `.kp-dialog::before` and the unclipped dialog casts a drop-shadow that follows the cut — and the colour is invisible.

Three properties of the surfaces decide what an option may be, all measured while building the page:

1. **A `clip-path` clips the element's own box-shadow and filter.** The dialog escaped that by moving its chamfer to a pseudo-element
   (`scope-100`); `.kp-card` did not, so **the card cannot cast anything at all today**. In the demo it is wrapped in a mock `.ds-elev`; in
   the register it needs the dialog's restructure first. That cost is the same for options 2 to 5 and is listed once, not per option.
2. **`.kp-popover` is `overflow: auto`**, so it clips a pseudo-element: option 3's halo measured 0 of 17616 band pixels there. A box-shadow
   is not a descendant and is not clipped, so the popover family can only be dressed with box-shadows.
3. **A modal dialog clips its pseudo-elements too.** `dialog:modal { overflow: auto }` in the UA stylesheet
   ([HTML Standard, §15.3.3](https://html.spec.whatwg.org/multipage/rendering.html#flow-content-3)) makes the top-layer dialog a scroll
   container. Proven on the page with the halo forced solid red: full halo on `<dialog open>`, nothing outside the box after `showModal()`
   (`js/components.js:162`), only the two cut corners left. Filters survive, which is why options 1, 2, 4 and 5 open unchanged.

## The options

Separation is the **dialog's** band: device pixels differing from the ground without the shadow by ΔL\* ≥ 3 (the column that matters),
share of the band, and the largest ΔL\* anywhere in it. dPR 1 / dPR 2.222, firefox, 1280px wide, every option parked on the same patch of
ground. The demo prints the same figures for the card and the popover; the spec re-measures all of them and fails if the page prints
anything else.

| #   | Option                    | What it is                                                                                 | Separation, dPR 1 → 2.222       | Reference                                                                                                                                                                     | Cost   | Recommendation                         |
| --- | ------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | -------------------------------------- |
| 1   | As it ships               | `0 12px 28px` of `--background` at 45 %                                                    | 0.4 % / 4.34 → 0.5 % / 4.66     | `css/dark-register.css:1587`                                                                                                                                                  | —      | the one to replace                     |
| 2   | Black with more depth     | the same geometry, `hsl(from var(--background) h s 0%)` at 60 %                            | 24.2 % / 7.07 → 23.2 % / 7.07   | [Material: shadows are less effective on a dark theme](https://github.com/material-components/material-components-android/blob/master/docs/theming/Dark.md)                   | small  | measurably the weakest of the four     |
| 3   | The oxide film's colour   | `--kp-iris` blurred behind the panel; four fixed shadows where a pseudo-element is clipped | 88.3 % / 29.84 → 86.9 % / 30.23 | `themes/dark/anatomy.md` (the film), [MDN `drop-shadow()`](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/drop-shadow)                                      | large  | the loudest; three shapes for one idea |
| 4   | A hard offset plate       | `drop-shadow(6px 6px 0 var(--border))`, no blur, following the cut                         | 10.7 % / 11.74 → 10.4 % / 11.74 | the package's own `--fx-shadow-offset` knob (`css/components.css:772`, brutalism's signature, `0px` in dark)                                                                  | small  | runner-up: crisp, resolution-proof     |
| 5   | An edge line and a shadow | 1px of the ink at 22 % round the silhouette (four chained drop-shadows) plus black at 50 % | 18.5 % / 29.48 → 17.4 % / 29.48 | [MDN `box-shadow` spread](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow), [CIE ΔE and the just-noticeable step](https://en.wikipedia.org/wiki/Color_difference) | medium | **recommended**                        |

Cost: _small_ is one declaration in the dialog's rule and one in the popover family's; _medium_ adds the four chained drop-shadows that give
a filter the spread it does not have (one box-shadow with a 1px spread does the same on the unclipped popover); _large_ is option 3, which
needs a pseudo-element on the panels that can carry one, a four-shadow approximation on the popover family **and** another on the modal
dialog — and the film only turns with the pointer in the first of the three. On top of any of them, the card needs the dialog's
plate-on-a-pseudo-element restructure before it can cast anything; `.kp-alert` carries the same chamfer and the same limit.

No option shifts a box (the spec measures every panel in all five options against option 1), none animates (`document.getAnimations()` is
empty), none clips the chamfer — every shape follows the cut, because a zero-blur or blurred drop-shadow shadows the silhouette — and none
names a colour: every stop is a token or a relative colour of one (DI9).

## Recommendation

**5 · An edge line and a soft shadow.** The measurement makes the argument that looking alone does not: on a ground at 5 % lightness a
_darker_ shadow has almost nowhere to go. Pure black at 60 % — option 2, the obvious answer — lifts the dialog where the pointer's pool of
light happens to be (24.2 % of the band) and is worth almost nothing away from it: on the popover it peaks at ΔL\* 5.04 and darkens 0.2 % of
the band. That is the same conclusion Material reached for dark themes, and their answer is to lighten the raised surface rather than to
darken under it. Option 5 does both: a one-pixel line of the ink hugs the cut edge — including the top edge, where no shadow ever reaches —
and the black shadow sits under it, so the panel is separated by light where the ground is dark and by dark where the grid is light. It
reads at ΔL\* 29 on every surface, it costs one box-shadow on the popover family, it survives the top layer, and it suits the theme's story:
a machined part catches a line of light on its chamfer.

**Runner-up: 4 · the hard offset plate.** It is the cheapest of the four, it cannot soften at any device pixel ratio (no blur at all), it
repeats the chamfer, and it speaks the package's existing `--fx-shadow-offset` language. Two reasons it is second: a hard riser is
brutalism's signature, and dark would be borrowing another theme's voice; and on the rounded popover it reads less like a milled part than
like a second panel.

**Option 3** is the most beautiful of the five on the frozen copies and the one I would drop first. It separates most (88 % of the band),
and it is the theme's own mechanism — but it needs three different implementations, two of which are a fixed four-shadow imitation that does
not follow the pointer, and the one surface this round is about, the modal dialog, is the surface that gets the imitation. If Kenny wants
colour there anyway, the honest version is the four-shadow one everywhere, which is then option 2 in colour: cheap, uniform, and no longer
"the film".
