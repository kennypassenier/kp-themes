# research/hover-wheel-1019: touch for the hover card, a kiosk and an answer card for the wheel

**Not yet judged.** Bundled into the review `round-3-1019` (see `VERDICTS.json`); this page is not offered on its own.

Round `hoverwheel-<uuid>` (see `demo.html`, 2026-10-19): 4 sections, 4 pairs (formal only; nothing here differs per theme). Found by the
AuDHD recipes thread (audhd-recepten 8, 9, 18), fixed in the package. They change approved components (hover card, wheel), so they come
back through the review dialog with a "What changed" text. See CHANGELOG.md "Unreleased".

1. **hovercard-touch**: a tap opens the card, a tap outside closes it, a tap inside keeps it (js/hovercard.js). Keyboard unchanged.
2. **wheel-kiosk**: `data-kp-wheel-kiosk`, no button, the wheel is the control (js/wheel.js, css/components.css).
3. **wheel-resting**: item `resting: true`, stays on the disc marked, never drawn while another is awake.
4. **wheel-answer**: item `tag` and `data-kp-wheel-answer`, the built-in answer card.

**Generated** by `node research/hover-wheel-1019/build.mjs` (edit the builder, never the page).
