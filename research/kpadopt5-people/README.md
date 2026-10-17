# research/kpadopt5-people: the fifth adoption round, people

Four components the apps still draw themselves, built in the package and shown in formal only until Kenny has judged them (Kenny, 2026-10-17):

- **Avatar** (`kp-idmark` with `data-kp-idmark-src`, `-status`, `-alt`, `-loading`, `-frame`; `setIdmarkGroup` with a "+N" that opens the hidden names). Choice: the photo's frame (edge, ring, mount).
- **Ways to sign in** (`kp-passkeys`, `js/passkeys.js`): rows with Rename and Remove, the only way in refused by default (`data-kp-protect-last`). Choice: how the refusal reads (button held off, or a note).
- **Conversation** (`kp-thread`, `js/thread.js`): bubbles, day dividers, system lines, attachments, folding (`data-kp-thread-fold`: newest whole by default, or after N lines, or full). Choice: how the two sides are told apart.
- **Chart markers** (`js/chart.js`): event kinds with a key, bands (`until`), edge counts, median line, runs, "too few readings". Choice: how a window is drawn.

One page, `demo.html`, one review topic per component. Round `people-<uuid>`, nothing received yet (`VERDICTS.json`).

Round 2 (2026-10-17): only the conversation is back. Its options (`data-kp-thread-fold`, `-order`, `-avatar`, `-days`,
`-bubble`, `-group`, `-fold-lines`) redraw the thread when the attribute changes; the default look is yours on a wash of the
primary colour. The avatar frame (edge in the name's colour), the passkey refusal (remove stays, held off, with the reason) and
the chart window (a wash across the plot) are the defaults of their components. The round-1 page is in `_previous/`.

Page round id: `people-a203e400-3d47-4628-bd20-da306b111179`, received: `people-18670859-e679-4566-8bad-e8fd47298900`.
