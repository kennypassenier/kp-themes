# research/kpadopt4-recipes: six calm components for a recipe app

The recipe app (parked until after the Life task app; its concept may still change) is for someone with AuDHD. The
AuDHD-recipes thread listed six components kp-themes lacked, each with its options and quality-of-life wishes
(2026-10-16 19:25). Each is built as a general kp component, useful beyond recipes, and shown on one page,
[`demo.html`](demo.html), **formal only** (`data-review-themes="formal"`), until Kenny approves it. The other fifteen
registers do not answer the new roots yet (gates/register-pending.json); each does once it is judged in its theme.

- Package: every `kp-` class and every script under `js/`. Mock: the sample data, the frames, the event logs and the
  buttons that drive a section (`demo.js`, `kit.js`, `sec-*.js`, `demo.css`).

| Need                 | What the package offers now                      | Built how                                                                                |
| -------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| 1 · wheel            | `.kp-wheel`, js/wheel.js                         | new, from the theme's primary button, chart colours, busy card and size motion           |
| 2 · cook mode        | `.kp-focus-steps`, js/focus-steps.js             | new, from `.kp-button`, the progress bar, the alert, the busy card and the timer starter |
| 3 · timers           | `.kp-timers`, `.kp-timer`, js/timer.js           | new, from `.kp-button`, the progress bar and the theme's arrival and leave               |
| 4 · quantity         | `.kp-quantity`, js/quantity.js                   | new, from `.kp-button` and the field                                                     |
| 5 · checklist        | `.kp-checklist`, js/checklist.js                 | new, from the field's checkbox, `.kp-button`, the busy card and the theme's size motion  |
| 6 · three-way filter | `data-kp-segmented="tri"` on the segmented chips | an opt-in mode of the approved segmented chips; the facet list stays checkboxes          |

What the thread listed as already covered (cards, segmented, facets, combobox, upload, steplist, wizard, datepicker,
week, chart, toasts, dialogs) needed nothing.

For the review, AuDHD choices made on purpose: no motion that is not the result of a press (the wheel turns only on
Spin; a checklist row glides only to show where it went; nothing pulses or loops but the loading cards); every state is
a word and a shape as well as a colour; targets are at least 44 px (48 on touch, 64 for cook mode's two buttons); text
and controls keep their places in every state (reserved lines, held widths). Two questions for the per-theme round, not
for formal: whether a theme gives the wheel's settle its own curve (`--kp-wheel-ease`; titanium's "metal does not
ease" would stop a wheel dead), and how each theme draws an ended timer (`--kp-timer-done-*`; formal draws its red-ink
entry).
