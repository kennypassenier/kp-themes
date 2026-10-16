# research/kpadopt4-ideas: seven new components, in formal

Kenny approved seven new kp-themes components on 2026-10-16 19:32, all marked "Onmisbaar". Each is built from the
package's own parts and shown in [`demo.html`](demo.html), **formal only** (`data-review-themes="formal"`), one review
topic per component, every state (loading, empty, error, disabled, busy, long text, phone width) on the page with an
"Expected:" block.

- Package: every `kp-` class and every script under `js/`. Mock: the sample data (fixed up to 16/10/2026), the frames,
  the event readouts and the controls marked "demo" (`demo.js`, `demo.css`).

| Need           | What the package offers now                                                   | Built from                                          | Cost   | Status   |
| -------------- | ----------------------------------------------------------------------------- | --------------------------------------------------- | ------ | -------- |
| uptime-strip   | `.kp-uptime`, `js/uptime.js` (`setUptime`, `kp-uptime-pick`)                  | heat grid fills, hover card, busy card, skeleton    | medium | built    |
| type-confirm   | `data-kp-confirm-type` on the confirmation (extended), `data-kp-type-confirm` | the confirmation dialog, kp-field, kp-badge, button | small  | extended |
| command-block  | `.kp-command`, `js/command.js` (`attachCommands`)                             | copy button (js/patterns.js), kp-badge, `pre`       | small  | built    |
| visual-timer   | `.kp-timer-disc`, `js/timer-disc.js` (`attachTimerDiscs`)                     | kp buttons, the state word, the countdown's clock   | medium | built    |
| numeric timer  | `.kp-countdown`, `js/countdown.js` (`attachCountdowns`, `countdownClock`)     | kp buttons, the state word                          | medium | built    |
| range-picker   | `.kp-range`, `js/range.js` (`attachRanges`, `kp-range-change`)                | segmented control, date picker, popover, buttons    | medium | built    |
| compare-slider | `.kp-compare`, `js/compare.js` (`attachCompares`, `kp-compare-change`)        | skeleton, the theme's ink and motion tokens         | medium | built    |

Why each is what it is:

- **uptime-strip** is a new component, not a heat grid option: the heat grid is rows by columns with a label column and
  an axis, where the strip is one thin row that must never wrap, shows fewer cells on a phone and carries its own
  summary. It reuses the heat grid's fills and patterns, so a state reads the same in both.
- **type-confirm** extends the approved confirmation (`js/components.js`, no new import, so the closure chassis-rs
  vendors stays as it is); without `data-kp-confirm-type` the dialog is unchanged. The homelab action dialog's rule
  (`nameTyped`, `pressGate` in `admin/web/js/actionforms.js`) is the reference: trimmed, capitals count.
- **command-block** builds on the package's copy button (`[data-kp-copy]`) rather than a copy of its own.
- **The two timers** are separate components, as asked, on one clock (`countdownClock()`). They are named
  `.kp-timer-disc` and `.kp-countdown` so they do not collide with the recipes branch's named kitchen timers, which may
  run on the same clock.
- **range-picker** composes the segmented control, the date picker and the popover plate; Custom… is a button beside the
  radio group, so the arrow keys never open the panel by moving over it.
- **compare-slider** cuts each pane with `clip-path`, so a live pane is only hit where it shows.

Not shown and why: a timer has no loading state (nothing is fetched), and a command block, a typed confirmation and a
compare slider have no disabled state of their own (the typed confirmation shows its button held off instead).

The two ideas Kenny marked "Later" (nudge-card, notification-log) are written down in
[`../IDEAS_LATER.md`](../IDEAS_LATER.md).

Recommendation: approve in formal, then answer each component in the fifteen other themes' registers (they are on
`gates/register-pending.json` until then).
