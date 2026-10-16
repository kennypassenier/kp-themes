# research/kpadopt4-recipes: six calm components for a recipe app

The recipe app (parked until after the Life task app; its concept may still change) is for someone with AuDHD. The
AuDHD-recipes thread listed six components kp-themes lacked, each with its options and quality-of-life wishes
(2026-10-16 19:25). Each is built as a general kp component, useful beyond recipes, and shown on one page,
[`demo.html`](demo.html), **formal only** (`data-review-themes="formal"`), until Kenny approves it.

- Package: every `kp-` class and every script under `js/`. Mock: the sample data, the frames, the event logs and the
  buttons that drive a section (`demo.js`, `kit.js`, `sec-*.js`, `demo.css`).

| Need                 | What the package offers now                                        | Built how                            |
| -------------------- | ------------------------------------------------------------------ | ------------------------------------ |
| 6 · three-way filter | `data-kp-segmented="tri"` on the segmented chips (js/segmented.js) | an opt-in mode of an approved one    |
| 4 · quantity         | `.kp-quantity`, js/quantity.js                                     | new, from `.kp-button` and the field |
