# research/synth-alert-buttons: buttons on a red alert in synthwave

**Decided (2026-10-19 00:50):** Kenny approved "Dark keys on every red alert (as approved on 18/10)", the current package behaviour; scope-94's "Alleen Try again" is superseded for buttons on a red alert. Recorded in `VERDICTS.json`; the page is not offered again.

Round `synth-alert-buttons-f2c3df02-8748-49b9-acc1-00323b8593cd` (2026-10-19): 1 section, 1 pair (synthwave).

Two rulings of Kenny's disagree about the buttons on a synthwave red alert (`.kp-alert--destructive`):

- **2026-09-15, scope-94, "Alleen Try again":** only the data table's Try again takes the red alert's ink as its frame; every other
  button on a red alert keeps its pink frame (docs/SCOPE.md, css/synthwave-register.css ~1434).
- **2026-10-18, round t56 ([t56-coralkeys-1018], commit 186895bd, approved in the eleven-theme review):** buttons on a coral plate are
  dark keys with a near-white frame. Its selector (css/synthwave-register.css ~6108) covers every red alert, so the plain Try again of
  the empty-table example (catalogue/table.html, `#empty`) is a dark key too. The suite's row 72 (SUITE_11_0_0_TRIAGE.md, group 6)
  holds the scope-94 half and fails.

The page shows every red-alert button context one under the other, with one component option, "Buttons on a red alert":
"Dark keys on every red alert (as approved on 18/10)" (the package as it is, the default) or "Dark keys only on the plates named on
18/10, the rest pink (scope-94)". The second option is a scoped rule in `page.css` of this demo only; nothing in `css/` changed.
Kenny's answer decides which becomes the package (a), or whether the selector is narrowed (b); the test follows.

Not touched: css/, js/, the t56 demo. Hand-written page; the markup of each plate is the package's own (js/state-plate.js,
js/question-card.js, catalogue/table.html).
