# research/leftover-looks

Two visual findings of the package review (research/PACKAGE_FINDINGS.md, Phantom and Deco), shown as proposals before the
package changes (Kenny, 2026-10-15 01:42, "leftovers: In 10.1.0"). The package CSS and JS are untouched; every proposal
lives in this folder.

| Question | Now | Options (recommendation first) |
| -------- | --- | ------------------------------ |
| Phantom: the deep red second plate of cut-paper parts (card, menu, dialog, toast) | `clip-path` clips the part's own `box-shadow`, so the plate is declared and never seen | 1 one hard plate (the clip widened to let the part's own shadow out, plus a corner triangle for the bottom-end cut) · 2 the plate as a halftone screen · 3 the plate as a slash out of the end edge |
| Deco: where a menu's gold inlay starts | the middle of the menu's top edge, whichever button opened it | under the button (js/menu-button.js writes `--kp-menu-anchor-x`, deco reads it as `--kp-sig-deco-at`) · as today |

- `demo.html` is written by `build.mjs` from one description; `demo.css` holds the proposals, `demo.js` stands in for the
  proposed `js/menu-button.js` hook and drives the page's own buttons.
- `shots.mjs` photographs both sections at 1280 and 390 px in Firefox. Not a test; no gate runs it.

Round 2 (2026-10-15 02:12, Kenny: the deco menu "is not the menu I approved"): two causes, both fixed.
- The page's root was `formal`, and formal's menu rules (higher specificity) reached into the deco stage: formal's ruling clip and
  Instrument Sans instead of deco's arrival and Poiret/Josefin. The root is now `light` and fixed, with no formal register linked.
- The review dialog is a `.kp-dialog`, and deco's "a menu inside a plate is not a second plate" rule took the plate off a menu a
  menu button opens (bare words). That rule now leaves `.kp-menu-button > .kp-menu` alone (css/deco-register.css).
