# The scope-25 gestures beside what ships

**Decided (scope-101): sepia's two gestures built; the pointer light is built in the shade pair.**

Kenny, scope-100 (2026-09-16), "Eerst een demo": the gestures approved at scope-25 were never built, and he wants to see them next to the
shipped blocks before choosing. No register changes until he does. Demo: [`demo.html`](demo.html) (56396 bytes, `wc -c`), in the catalogue
under "Research to look at". A firefox check sits beside it: [`verify.spec.mjs`](verify.spec.mjs) with
[`playwright.config.mjs`](playwright.config.mjs), run as `KP_TEST_PORT=4654 npx playwright test -c research/scope25-gestures/playwright.config.mjs`
(9 tests, 9 passed).

**What scope-25 said** (2026-09-11, verbatim): sepia takes "the ink spreading into the paper on a press and the rule that is thickest in the
middle"; shade-light and shade-dark take "the pointer is the light, and the light half throws its shade away from it while the dark half is
lifted out of shade by it".

**What ships** (read from the registers). sepia: the marginal bracket on hover (scope-12); a press sets `--primary-active`
(`hsl(26, 100%, 18%)`, rgb(92, 40, 0)) on the primary and an inset shadow `0 1px 3px` on every button; the divider is two 1px
`--border-strong` lines at 32% and 68%, the heading rule a straight 6rem × 2px bar. shade-light and shade-dark: one fixed light at the top
left (scope-12), on the plain button only (`1px 2px 3px`, `2px 3px 5px` in shade-dark); cards carry no shadow (S49); nothing reads the
pointer.

**How the demo is built.** Every block shows CURRENT (the register, untouched, no `sg-` class on anything it styles) beside PROPOSED (the
same markup inside `.sg-proposed`). Every proposal rule starts with `[data-theme='<theme>'] .sg-proposed` and moves into the register by
dropping `.sg-proposed`; the two scripts would move into `js/effects.js`. Blocks follow the theme menu instead of pinning a theme per block,
because a block pinned inside a page of another theme also matches that theme's register and would not show the register untouched. In any
other theme CURRENT and PROPOSED are identical. Mock: the switcher, captions, the "held" copies and the live line counter.

## The gestures

| Gesture                          | What PROPOSED does                                                                                                                                                                                                                                    | Reference                                                                                                                                                                                                     | Cost (code lines, `wc`-style count without comments)                                       | Risk                                                                                                                                                                                                         | Recommendation                             |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| 1 · sepia · ink on a press       | A `::after` 12px larger than the button grows four offset blots of `--primary` from the press point, feathered by a fractal-noise mask outside the button and smooth under the label; 240ms in, 900ms settling out, on a registered `--kp-ink-spread` | [Dot gain, prepressure.com](https://www.prepressure.com/design/basics/dot-gain)                                                                                                                               | small: 74 CSS + 14 JS (98 and 18 with comments); JS only places the press point            | Stain reaches 12px past the button and can touch a neighbour; needs `@property` (Firefox 128+) at the file's top level; reduced motion shows the full stain at once. Label contrast held: 9.52 / 7.41 / 7.79 | **build the gesture**                      |
| 2 · sepia · the swelled rule     | One untiled SVG mask stretched with `preserveAspectRatio='none'`: 0.5px at both ends, 3px in the middle, in `--primary`; the same shape 6rem long under a heading, keeping the register's scaleX reveal                                               | [Butterick, rules and borders](https://practicaltypography.com/rules-and-borders.html), [Starshaped Press on a swelled rule](https://www.starshaped.com/weekendprinterblog/2018/2/11/exceptionthatprovesrule) | small: 20 CSS (29 with comments), no JS                                                    | Heading rule grows 2px taller, text under it moves down 2px at rest. At devicePixelRatio 2.222: middle 6.14 device px of ink, ends 0.89; no seam at 1280 and 997px (a planted 0.45px gap was caught at both) | **build the gesture**                      |
| 3a · shade-light · shade away    | Plain button, cards, dossier and headline cast their shadow along the vector from the pointer to their centre (full length past 240px, shrinking to none under the pointer); hover and press keep today's lift and inset, turned the same way         | [DynamicWebShadows](https://github.com/tsibiski/DynamicWebShadows), [CodePen: cursor as light source](https://codepen.io/phipix01/pen/xwxEQP)                                                                 | medium: 26 CSS (42) + one shared script of 70 JS lines (76), rAF-throttled, on-screen only | Pointer-following motion: off under reduced motion, touch and Tab; cards gain a rest shadow S49 left out. Text is untouched: lit 5.17 = CURRENT 5.17; plain button lit and hovered 7.30                      | **build the gesture**, cards on Kenny's go |
| 3b · shade-dark · lifted into it | The same vector for the shadow, scaled by lift (0.6 + nearness); the surface nearest the pointer takes a `--foreground` wash at 6% (card), 8% (button), 6% (hero) centred on the pointer                                                              | [Material dark theme, elevation as lighter surface](https://m2.material.io/design/color/dark-theme.html)                                                                                                      | medium: 42 CSS (47) + the same script                                                      | The wash lowers the card text from 5.12 to 4.64 at its brightest (a 9% wash measured 4.37 and was cut back); lit, hovered button 5.38. Same motion guards as 3a                                              | **build the gesture**                      |

Without a pointer every fallback is scope-12's fixed light (`x 1, y 1, lift 1, near 0`), which computes exactly what the register paints
on today's button. The spec proves: the card's shadow x offset is positive with the pointer at its left edge and negative at its right in
both themes, while CURRENT's computed shadow and background do not change; under reduced motion nothing is written and the shadow stays at
the top-left light; the sepia press darkens the paper 10px above the press point by more than 7% while the label and button boxes stay
identical to the pixel, and CURRENT's paper does not change. Contrast is read from rendered pixels with the text made transparent, lowest
pixel under the text.

## Recommendation

**Build all three; they are cheap and each is what its sentence says.** The swelled rule is the safest: twenty lines, no script, no
motion, and it reads as print where the double line reads as a form. The ink press is the most characterful and the only one where a
click leaves a trace you see after the finger lifts, which the shipped press does not (a darker fill for one frame). Keep the marginal
bracket beside it; they do not collide. For the shade pair, the pointer light is the first thing that makes the two themes behave as one
law on two materials, and the script is shared. Two points are Kenny's: whether cards take a shadow at rest (S49 said no; the variant is
to light the plain button and the headline only, and keep cards flat), and whether shade-dark's wash may take the card text from 5.12 to
4.64, still above 4.5.
