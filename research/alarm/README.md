# The alarm: a full-screen dramatic alert (`kp-alarm`)

**Decided (scope-94):** archived; the decision and what was built from it are in `docs/SCOPE.md`.

Kenny asked (2026-09-15) for something bigger than a toast: a full-screen popup with animated red text, "ACCESS DENIED" as a film shows a
hacking attempt. The words come from the caller. It either needs a real click or goes away by itself after a number of seconds. Demo:
[`demo.html`](demo.html) (77989 bytes, `wc -c`). It is listed in the catalogue under "Research to look at", opens in cyberpunk, and links
the cyberpunk, nostromo, terminal, synthwave, formal and light registers. A firefox check sits beside it: [`verify.spec.mjs`](verify.spec.mjs)
with [`playwright.config.mjs`](playwright.config.mjs), run as
`KP_TEST_PORT=4605 npx playwright test -c research/alarm/playwright.config.mjs`.

**What the prototype is.** `showAlarm({ title, detail, code, mode, seconds, escape, action, drama, motion })` builds a
`<dialog class="kp-alarm" role="alertdialog">`, opens it with `showModal()` and returns a promise that resolves to `ack`, `timeout` or
`escape`. The native modal dialog gives the top layer, an inert page, the focus trap and focus returning to the trigger; the package's dialogs
already rely on it. Reused from the package: the tokens, the registers' button shapes, `.kp-button`, `.kp-field`, `.kp-fieldset`,
`.kp-sr-only`, `applyTheme` and `GLYPHS` from `js/effects.js`. Mock, written on the page: every `kp-alarm` rule, 13 keyframes and the function.

## References

| Name                                                    | What it is for                                                           | Reference                                                                                                                                                                                                  | What the package can reuse                                                              | Build cost | Recommendation                 |
| ------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ---------- | ------------------------------ |
| Film and game FUI archive                               | Catalogue of fictional interfaces: lockouts, warnings, security consoles | [HUDS+GUIS](https://www.hudsandguis.com/), [Blade Runner 2049 UI](https://www.hudsandguis.com/home/2018/blade-runner-2049)                                                                                 | The vocabulary only: a code line, one huge word, hazard framing, a single action        | —          | Reference for the look         |
| Jurassic Park lockout ("you didn't say the magic word") | A lockout after failed attempts that blocks the whole console            | [Sci-fi interfaces: Jurassic Park](https://scifiinterfaces.com/category/jurassic-park-1993/)                                                                                                               | The idea that an alarm owns the whole screen until it is dealt with (`mode: 'ack'`)     | small      | Basis of `ack`                 |
| Fallout terminal lockout                                | A timed lockout after four wrong guesses that then clears by itself      | [Fallout wiki: Hacking, Fallout 4](https://fallout.fandom.com/wiki/Hacking_%28Fallout_4%29)                                                                                                                | A lockout that ends on a timer, shown counting down (`mode: 'auto'`)                    | small      | Basis of `auto`                |
| Alien: Isolation terminals                              | Low-tech sci-fi screens: duotone, scanlines, big blocky type             | [HUDS+GUIS: Alien Isolation](https://www.hudsandguis.com/home/2014/06/04/alien-isolation)                                                                                                                  | Scanlines and vignette as one static layer; nostromo's own display face                 | small      | The nostromo reading           |
| WAI-ARIA alert dialog pattern                           | A modal that interrupts with an urgent message and wants a response      | [APG alertdialog](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/), [example](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/examples/alertdialog/)                                            | `role="alertdialog"`, `aria-labelledby`, `aria-describedby`, focus on the action        | small      | Follow it                      |
| `<dialog closedby>`                                     | Declares whether Escape or a click outside may close a dialog            | [MDN closedBy](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/closedBy)                                                                                                                | `closedby="none"` for ack without Escape; a `cancel` listener as the fallback           | small      | Use both                       |
| WCAG 2.3.1 Three Flashes                                | No more than three flashes in any second, or under the flash thresholds  | [Understanding 2.3.1](https://www.w3.org/WAI/WCAG21/Understanding/three-flashes-or-below-threshold.html), [red flash definition](https://www.w3.org/TR/UNDERSTANDING-WCAG20/seizure-does-not-violate.html) | The house gate already pins it (`gates/check-motion.mjs`, `TIMINGS` in `js/effects.js`) | small      | Rows in `TIMINGS` per keyframe |
| WCAG 2.2.1 Timing Adjustable, 2.3.3 Animation           | Time limits the user can turn off; motion that can be switched off       | [Understanding 2.2.1](https://www.w3.org/TR/UNDERSTANDING-WCAG20/time-limits-required-behaviors.html), [Understanding 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) | "Keep open" turns the timer off; `prefers-reduced-motion` gives the still version       | small      | Keep both                      |

## Options

| Option    | Values                        | Default       | What it does                                                                                       |
| --------- | ----------------------------- | ------------- | -------------------------------------------------------------------------------------------------- |
| `title`   | text                          | required      | The huge word(s). Accessible name via a `.kp-sr-only` copy; the animated copy is `aria-hidden`     |
| `detail`  | text                          | empty         | The second line, part of the description                                                           |
| `code`    | text                          | empty         | The small line above the title ("Security protocol 7 · lockout")                                   |
| `mode`    | `ack`, `auto`                 | `ack`         | `ack`: only the button closes it (click, Enter, Space). `auto`: closes after `seconds`, with a bar |
| `seconds` | number                        | 8             | Auto only. A shrinking bar and "Closes in N s"; announced once as "Closes by itself in N seconds"  |
| `escape`  | boolean                       | `false`       | Ack only: Escape closes it as well. Auto always accepts Escape                                     |
| `action`  | text                          | `Acknowledge` | The button label. It gets focus on open                                                            |
| `drama`   | `theme`, `full`, `restrained` | `theme`       | `theme` reads the `--kp-alarm-drama` custom property                                               |
| `motion`  | `system`, `still`             | `system`      | `still` forces what reduced motion shows                                                           |

In auto mode the dialog itself takes focus, so an Enter meant for the page presses nothing. The first Tab reaches **Keep open**, which turns
the alarm into an ack alarm. A click outside the words never closes either mode.

## Accessibility constraints, and what was measured

- **Flashes (2.3.1).** The worst second is the first. The panel flickers 0 → 1 → 0.3 → 1 (three changes, 1.5 flashes), and each letter cell
  shows blank, a noise glyph, a second glyph, then the letter, once. After that: a 1 → 0.6 → 1 jitter every 5 s, the glow breathing one
  half-cycle per 1.4 s, a one-cell caret at 1/s, stripes moving one period per 1.6 s, and an 8% band every 6 s. **Measured** in firefox at
  1024×768: every animation paused and stepped through 6 s at 30 frames per second, screenshots cut into 170×128 px tiles (25% of the
  341×256 px field), and flashes counted per tile per 1 s window. Worst result: cyberpunk 1.5, synthwave 1.5, nostromo 1, terminal 0.
  Red flashes were 0 in all four: no state reaches R/(R+G+B) ≥ 0.8. This is an approximation, not a Harding analyser. A first version
  unscrambled the headline in JavaScript at about 22 glyph swaps per second. Measured runs of that version disagreed (1 and 2.5), so it was
  replaced by the CSS decode, which changes each cell at most three times and can be measured.
- **Reduced motion.** Under `prefers-reduced-motion: reduce` no animation or transition runs inside the alarm (`document.getAnimations()`
  is empty). The words are there at once. The drama comes from the plate, the glow at full strength, the frame, the bars and the size.
- **Contrast** (measured on the composited ground): the headline reads 5.32 (cyberpunk), 5.58 (nostromo), 5.55 (terminal), 5.82
  (synthwave), 6.8 (formal) and 6.48 (light). The detail line reads 12.81 to 17.2.
- **Checked in firefox (11 tests, all green).** No console errors in the six themes. Ack ignores Escape, a click outside and 1.5 s of
  waiting, and Tab stays inside. Enter and a click on the button close it. Auto closes between 1.9 and 3.5 s when set to 2 s. Keep open
  stops the timer. Focus returns to the trigger every time. `npm run gates` exits 0.

## Per-theme proposal

Two levels, chosen by a token rather than by theme names in the component: `--kp-alarm-drama: full | restrained`.

- **Full**: cyberpunk, synthwave, terminal, nostromo, and (proposed, not shown) titanium and phantom. The ground is a near-black taken from
  `--destructive`, the ink is `--destructive` raised to at least 60% lightness, and the split colour comes from `--primary`. On top sit a
  hairline frame, hazard bars and scanlines. The theme speaks through its own display and mono faces and its button shape (cyberpunk's
  notch, nostromo's dot); terminal adds a `>` before the code line.
- **Restrained**: the other sixteen. The page dims to its own background, and a plain panel sits between two 0.5 rem `--destructive` rules
  with the headline in `--destructive`. It fades in once, with no flicker, scanlines or bars. high-contrast gets an opaque ground.

**Recommendation.** Build `kp-alarm` as its own component, not a toast variant: a toast is polite, positioned and stackable, and an alarm is
none of those. Base it on `<dialog>` with `role="alertdialog"`. Ship both modes and the token-driven two-level drama, and put every keyframe
in `TIMINGS` so the motion gate holds the flash budget. Cost: medium (CSS about the size of the mock block, one `js/alarm.js`, one
`components/Alarm.jsx`, 22 register answers that are mostly one custom property, and tests on the dialog suite's pattern).

## Open questions for Kenny

1. Two levels by theme (full for the sci-fi themes, restrained for the calm ones), or one dramatic look in every theme?
2. Should titanium and phantom get full drama? Should brutalism and retro get a flavour of their own (a slammed stamp, a 1995 error box)?
3. Should the alarm take the whole screen in auto mode too, blocking the page for N seconds? Or should auto be a non-modal band that leaves
   the page usable?
4. Should hovering or focusing the alarm pause the countdown, besides the Keep open button?
5. Is a sound or a vibration in scope? It is left out here; autoplay rules and a mute option would come with it.
6. Should the flicker, decode and jitter be knobs a consumer can turn off one by one, or stay one `motion` switch?
