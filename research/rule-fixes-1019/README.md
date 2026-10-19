# research/rule-fixes-1019: nine faults against the text rules

**Decided (2026-10-19 06:43):** Kenny approved every pair. Recorded in `VERDICTS.json`; the page is not offered again.

Round `rulefixes-<uuid>` (see `demo.html`, 2026-10-19): 9 sections, 11 pairs (formal; the wheel also in dark and cyberpunk). Found by the
project threads (chassis-rs 3, 4, 6; HTTPSwitchboard 14, 15, 16; kyu 4, 12; AuDHD recipes 17), confirmed in the code, fixed in the package.
They change approved components, so they come back through the review dialog with a "What changed" text. See CHANGELOG.md "Unreleased".

1. **tabbar-badge**: the count sat over its icon. Fix: it starts 0.25rem past the icon's end edge (css/components.css).
2. **palette-keys**: a chord wrapped. Fix: `nowrap`, `flex: none`.
3. **dialog-edge**: section text at 0 px from the section's rule. Fix: the section is wider than the column by `--kp-dialog-section-inset` and pads it back; brutalism, synthwave and deco danger sections the same.
4. **code-long**: a long line was cut at the plate's edge. Fix: the `code` scrolls inside the body's padding (js/code.js moves the tabindex to it).
5. **code-punct**: `},` was two spans at 0 px. Fix: one span per run of punctuation (js/code.js).
6. **empty-card**: formal's card empty state drew a double rule and three floating ruled lines. Fix: none inside a card (css/formal-register.css).
7. **newpill-gap**: reserved second digit left a gap before the count. Fix: the pill is as wide as its words.
8. **heat-label**: row names ended in an ellipsis. Fix: they wrap.
9. **wheel-label**: thin slices cut names with an ellipsis. Fix: largest type, two lines, `short`, else not drawn (js/wheel.js).

**Generated** by `node research/rule-fixes-1019/build.mjs` (edit the builder, never the page).
