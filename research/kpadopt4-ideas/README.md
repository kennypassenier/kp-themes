# research/kpadopt4-ideas: seven new components, in formal

Kenny approved seven new kp-themes components on 2026-10-16 19:32, all marked "Onmisbaar". Each is built from the
package's own parts and shown in [`demo.html`](demo.html), **formal only** (`data-review-themes="formal"`), one review
topic per component, every state (loading, empty, error, disabled, busy, long text, phone width) on the page with an
"Expected:" block.

- Package: every `kp-` class and every script under `js/`. Mock: the sample data (fixed up to 16/10/2026), the frames,
  the event readouts and the controls marked "demo" (`demo.js`, `demo.css`).

| Need          | What the package offers now                                                   | Built from                                          | Cost   | Status   |
| ------------- | ----------------------------------------------------------------------------- | --------------------------------------------------- | ------ | -------- |
| uptime-strip  | `.kp-uptime`, `js/uptime.js` (`setUptime`, `kp-uptime-pick`)                  | heat grid fills, hover card, busy card, skeleton    | medium | built    |
| type-confirm  | `data-kp-confirm-type` on the confirmation (extended), `data-kp-type-confirm` | the confirmation dialog, kp-field, kp-badge, button | small  | extended |
| command-block | `.kp-command`, `js/command.js` (`attachCommands`)                             | copy button (js/patterns.js), kp-badge, `pre`       | small  | built    |
| visual-timer  | `.kp-timer-disc`, `js/timer-disc.js` (`attachTimerDiscs`)                     | kp buttons, the state word, the countdown's clock   | medium | built    |
| numeric timer | `.kp-countdown`, `js/countdown.js` (`attachCountdowns`, `countdownClock`)     | kp buttons, the state word                          | medium | built    |
