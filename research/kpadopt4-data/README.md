# research/kpadopt4-data: data pieces every app drew itself, one page

Seven needs from the component survey of 2026-10-16 (G1, G4, G12, G17, G18, G20, G24), built in the package first and shown in
**formal only** until Kenny approves them: [`demo.html`](demo.html), eight sections in five review topics, `data-review-themes="formal"`.

- Package: every `kp-` class (css/components.css, the block "Data pieces every app drew itself") and js/idmark.js, js/stackbar.js,
  js/bullets.js, js/code.js, js/tick.js. The registers do not answer them yet (gates/register-pending.json): every theme draws them from
  its tokens, formal's own skeleton, meter, spinner and busy card included.
- Mock: the sample data, the state buttons, the readouts, the kv loading swap (the page keeps each value's height) and the 390 px frames.

| Need | What it is for                                      | Seen in                                               | What the package offers now                                                                 | Cost   | Recommendation |
| ---- | --------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------ | -------------- |
| G1   | a plate made from a name                            | homelab `stackMark`, JobTracker `Mark`                | `.kp-idmark` (letters, `--pattern`, `--round`, `--glyph`, five sizes), `idmarkFor`, `idmarkColours` | medium | Adopt          |
| G4   | parts of one whole with a legend                    | homelab `hk-stack-bar`                                | `.kp-stackbar`, `setStackbar` (hover card, arrow keys, Other, over the whole, marks)         | medium | Adopt          |
| G12  | a value against a threshold, per row               | JobTracker follow-up clock                            | `.kp-bullets`, `setBullets` on the meter with its mark; busy card while loading            | medium | Adopt          |
| G17  | freshness line and page header with meta           | JobTracker `PageHeader`, `Freshness`                  | already `.kp-page-header` and `[data-kp-ago]`; new opt-in `__heading` / `__line` / `__lead` / `__meta` | small  | Adopt the line |
| G18  | key-value grid; label, control, aside rows         | homelab `st-set`, `hl-kv`, JobTracker `Row`, chassis `dl` | `.kp-kv` (`--lines`, `--stack`, `--columns`), `.kp-formrows` / `.kp-formrow` (`--top`, `--wide`) | small  | Adopt          |
| G20  | a payload or code block                             | kyu `pre.snippet`, chassis requests                   | `.kp-code`, `setCode` (Pretty/Raw, Wrap, Copy, lines, fold, truncated, states)             | medium | Adopt          |
| G24  | a live number that ticks                            | JobTracker `TickNumber`                               | `[data-kp-count]` already counts up once; new `[data-kp-tick]`, `tickTo`                   | small  | Adopt          |

Not built: a vertical share bar, a sticky page header and in-place threshold editing (no app asked for them in code). The share bar is one figure,
like the meter, so its loading is its own pulsing bar and not the busy card; the bullet list and the code block lay the busy card.

Measured in Firefox (playwright-core, firefox-1538) at 1280 and 390 px, on the page and in the review dialog: no console errors, no text touching a
neighbour, a graphic or an edge, no sideways scroll, every component the same height in every state (bullets, share bar, code block, kv), loading
animating (busy card in the bullets and code block), Copy the same width as Copied, the tick landing exactly on the written text.
