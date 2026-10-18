# research/findings-1019: four package faults found while the components page was checked

**Decided (2026-10-19 01:52):** Kenny approved every pair. Recorded in `VERDICTS.json`; the page is not offered again.

Round `findings-a0354fda-34dc-4617-b1ce-91ca20d2329a` (2026-10-19): 4 sections, 48 pairs (each in the twelve themes). They change
components Kenny had approved, so they come back through the review dialog with a "What changed since you approved it" text
(DEMO_RULES ch. 7 and 9). Fixes are in the package (css/components.css, js/), published with the next patch after 11.0.0.

1. **command-narrow**: Copy of a `.kp-command` broke per letter at about 270 px with the admin badge (dark, cyberpunk, synthwave; brutalism,
   deco and nostromo a few px narrower). Cause: `.kp-button` has `overflow-wrap: anywhere`, so its min-content is one letter and the head's
   flex row squeezed the copy slot below the word. Fix: the head wraps (Copy goes under the name and badge), the slot does not shrink and
   Copy is `nowrap`.
2. **focus-nav-narrow**: Back and Next of the check-in broke per letter in a column of 242 to 270 px. Cause: two `minmax(0, 1fr)` columns
   with the same `overflow-wrap: anywhere`. Fix: a wrapping flex row, each button `flex: 1 1 0` with `min-inline-size: max-content` and
   `nowrap`; side by side where both fit, stacked at full width where they do not.
3. **flash-grow**: `data-kp-width="grow"` set by hand removed the rest and busy faces and the ghosts for good: an empty button. Fix: the
   faces go only while a result stands (success or refused); `js/flash.js` also keeps a width a page set by hand after a refusal on the
   button. `keep` and the refusal on the button are unchanged.
4. **lede-fold-link**: `data-kp-lede-collapsible` with `data-kp-lede-link` never folded: the link was appended first, so
   `childElementCount` was 1 and the text read as empty. Fix: the text is read before the link; the link stays at the end, after the
   folded part.

**Generated** by `node research/findings-1019/build.mjs` (edit the builder, never the page). Measured before/after in Firefox with a
scratch script (not a test); numbers are in the session report.
