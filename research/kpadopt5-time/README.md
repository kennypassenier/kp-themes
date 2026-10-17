# research/kpadopt5-time: the fifth adoption round, wave "time"

**Decided (2026-10-18 00:28):** Kenny approved every pair in formal. Recorded in `VERDICTS.json`; the part is not offered again.

Seven new parts, formal only (Kenny, 2026-10-17 20:18 answers to the option design): weekday picker (`js/weekdays.js`), next-runs list
(`js/runs.js`), snooze picker (`js/snooze.js`), dated option picker (`js/dated-options.js`), sentence form (`js/sentence.js`),
slider (`js/slider.js`) and unsaved-changes bar (`js/unsaved.js`). One page, `demo.html`, one review topic per component; the page
holds a fixed clock (Saturday 17/10/2026 14:05, Europe/Brussels) so nothing reads the real time. Hand-written: edit the page itself.
The other themes are asked after Kenny's formal verdict.

Round 2 (2026-10-17): only the sentence form and the slider (with their states) are back. The opened list of a sentence's select
wears the popover's surface and ink (it was the browser's black); `data-kp-look`, `data-kp-sentence-size` and
`data-kp-slider-value` are options that follow an attribute change; the slider's bubble is off by default; a disabled slider or
weekday picker takes the line in its reason anchor, so the reason wraps by words. The round-1 page is in `_previous/`.

Page round id: `time-c1323c49-63e2-41c1-8a1e-20419bf2678f`, received: `time-f7d1cbc1-7727-45af-8279-033f39184101`.
