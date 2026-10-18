# kpadopt56 findings: faults in the package (css/, js/, themes/) seen on the 11 part pages

Collected 2026-10-18 in Firefox with `research/_review/measure-gaps.mjs <port> <page> <eleven themes> 1280,390` and `research/kpadopt56/measure-overflow.mjs`, per theme and at 1280 and 390 px. Nothing here was fixed: these sit in the package (a `kp-*` part or a theme register), not in the demo pages, and go to the designers. `check-kit.mjs` printed clear on all eleven parts.

Tier B can also come from a wide sample the formal-approved demo markup draws (the version-states table, the request inspector and auto-refresh bars at 390 px); each line names the `kp-*` part that sticks out, which is where a designer should start. A "cell" below is one section x theme x width. Tier A and B are measured faults; tier C is a weaker signal (a part with text squeezed under 40 px wide or 10 px high, which is often an inline label that wraps, so it needs an eye before it is called a fault).

## Summary

| theme | A: text gaps (cells) | B: sticks out / scrolls sideways (cells) | C: squeezed signals (cells) |
|---|---|---|---|
| dark | 6 | 4 | 12 |
| cyberpunk | 4 | 4 | 14 |
| synthwave | 9 | 3 | 19 |
| pastel | 3 | 4 | 17 |
| forest | 2 | 4 | 17 |
| blueprint | 7 | 7 | 17 |
| solstice | 3 | 4 | 19 |
| brutalism | 15 | 6 | 12 |
| deco | 9 | 4 | 12 |
| nostromo | 10 | 5 | 17 |
| titanium | 8 | 5 | 19 |
| **all** | **76** | **50** | **175** |

| part | A | B | C |
|---|---|---|---|
| schedule | 23 | 0 | 4 |
| choose | 18 | 1 | 0 |
| fields | 2 | 0 | 44 |
| updates | 4 | 32 | 44 |
| confirm | 3 | 2 | 2 |
| lists | 4 | 11 | 28 |
| status | 3 | 0 | 0 |
| calm | 13 | 0 | 12 |
| charts | 1 | 0 | 12 |
| media | 1 | 4 | 9 |
| people | 4 | 0 | 20 |
| **all** | **76** | **50** | **175** |

Text-gap lines (measure-gaps prints one per text): 360. 1280 px: 67, 390 px: 293. Themes with no finding at all: none.

## Known cause

- **blueprint, section `question` (part confirm), 1280 and 390:** every `.kp-question` card is `position: absolute`, 34 px wide at the right edge, stacked on top of each other, so the frozen states and the phone frame look empty and measure-gaps reports 110 overlaps. Cause: `[data-theme="blueprint"] [data-kp-measure]` in `css/blueprint-register.css` matches the question card's own `data-kp-measure="ring|text"` attribute (an unrelated blueprint hook with the same name). Seen on every card of the section; `.kp-question__head` sticks out 493 px.

## Tier A: text closer than 4 px to a neighbour or to the edge of its plate (measure-gaps)

part | item | theme | width | what | measured
---|---|---|---|---|---
schedule | sentence | brutalism | 390 | "Mon", "Sun", "Thu", "Wed" against edge of button.kp-segmented__item | 4 text(s), gap 2.0 to 3.9 px (minimum is 4)
schedule | sentence | deco | 390 | "Mon", "Wed" against edge of button.kp-segmented__item | 2 text(s), gap 2.0 to 3.2 px (minimum is 4)
schedule | sentence-states | dark | 390 | "Mon", "Sun", "Thu", "Wed" against edge of button.kp-segmented__item | 4 text(s), gap 2.2 to 3.9 px (minimum is 4)
schedule | sentence-states | synthwave | 390 | "Mon", "Wed" against edge of button.kp-segmented__item | 2 text(s), gap 3.3 to 3.3 px (minimum is 4)
schedule | sentence-states | brutalism | 390 | "Mon", "Sat", "Sun", "Thu" and 2 more against edge of button.kp-segmented__item | 10 text(s), gap 0.1 to 3.9 px (minimum is 4)
schedule | sentence-states | deco | 390 | "Mon", "Sun", "Thu", "Wed" against edge of button.kp-segmented__item | 6 text(s), gap 0.1 to 3.3 px (minimum is 4)
schedule | sentence-states | titanium | 390 | "Fri", "Mon", "Sat", "Sun" and 3 more against edge of button.kp-segmented__item | 7 text(s), gap 3.8 to 3.8 px (minimum is 4)
schedule | weekdays | dark | 390 | "Last" against edge of button.kp-segmented__item | 1 text(s), gap 2.7 to 2.7 px (minimum is 4)
schedule | weekdays | synthwave | 390 | "Last" against edge of button.kp-segmented__item | 1 text(s), gap 3.3 to 3.3 px (minimum is 4)
schedule | weekdays | blueprint | 390 | "Last" against edge of button.kp-segmented__item | 1 text(s), gap 2.9 to 2.9 px (minimum is 4)
schedule | weekdays | brutalism | 390 | "Last", "Mon", "Sun", "Thu" and 1 more against edge of button.kp-segmented__item | 5 text(s), gap 0.6 to 3.9 px (minimum is 4)
schedule | weekdays | deco | 390 | "Last", "Mon", "Wed" against edge of button.kp-segmented__item | 3 text(s), gap 2.0 to 3.2 px (minimum is 4)
schedule | weekdays | nostromo | 390 | "Last" against edge of button.kp-segmented__item | 1 text(s), gap 2.0 to 2.0 px (minimum is 4)
schedule | weekdays | titanium | 390 | "Last" against edge of button.kp-segmented__item | 1 text(s), gap 1.1 to 1.1 px (minimum is 4)
schedule | weekdays-states | dark | 390 | "Last", "Mon", "Sun", "Thu" and 1 more against edge of button.kp-segmented__item | 5 text(s), gap 0.8 to 3.9 px (minimum is 4)
schedule | weekdays-states | cyberpunk | 390 | "Last" against edge of button.kp-segmented__item | 1 text(s), gap 2.4 to 2.4 px (minimum is 4)
schedule | weekdays-states | synthwave | 390 | "Last", "Mon", "Wed" against edge of button.kp-segmented__item | 3 text(s), gap 1.4 to 3.3 px (minimum is 4)
schedule | weekdays-states | blueprint | 390 | "Last" against edge of button.kp-segmented__item | 1 text(s), gap 1.1 to 1.1 px (minimum is 4)
schedule | weekdays-states | brutalism | 1280 | "Last" against edge of button.kp-segmented__item | 1 text(s), gap 3.4 to 3.4 px (minimum is 4)
schedule | weekdays-states | brutalism | 390 | "Last", "Mon", "Sat", "Sun" and 3 more against edge of button.kp-segmented__item | 11 text(s), gap -2.4 to 3.9 px (minimum is 4)
schedule | weekdays-states | deco | 390 | "Last", "Mon", "Sun", "Thu" and 1 more against edge of button.kp-segmented__item | 7 text(s), gap 0.1 to 3.3 px (minimum is 4)
schedule | weekdays-states | nostromo | 390 | "Last" against edge of button.kp-segmented__item | 1 text(s), gap 0.1 to 0.1 px (minimum is 4)
schedule | weekdays-states | titanium | 390 | "Fri", "Mon", "Sat", "Sun" and 3 more against edge of button.kp-segmented__item | 7 text(s), gap 3.8 to 3.8 px (minimum is 4)
choose | dated | cyberpunk | 390 | 3 text(s) overlap another text or part: "1 day ago", "12 results", "16/10/2026 04:00" | overlap (gap below 0 px)
choose | dated | synthwave | 390 | 1 text(s) overlap another text or part: "16/10/2026 04:00" | overlap (gap below 0 px)
choose | dated | pastel | 390 | 1 text(s) overlap another text or part: "16/10/2026 04:00" | overlap (gap below 0 px)
choose | dated | blueprint | 390 | 3 text(s) overlap another text or part: "1 day ago", "12 results", "16/10/2026 04:00" | overlap (gap below 0 px)
choose | dated | brutalism | 390 | 2 text(s) overlap another text or part: "1 day ago", "12 results" | overlap (gap below 0 px)
choose | dated | deco | 390 | 3 text(s) overlap another text or part: "1 day ago", "12 results", "16/10/2026 04:00" | overlap (gap below 0 px)
choose | dated | nostromo | 390 | 2 text(s) overlap another text or part: "12 results", "17/10/2026 04:00" | overlap (gap below 0 px)
choose | shortcut-engine | dark | 390 | 4 text(s) overlap another text or part: "Jump to the usual choices", "Keyboard shortcuts", "No shortcuts on this page" | overlap (gap below 0 px)
choose | shortcut-engine | cyberpunk | 390 | 2 text(s) overlap another text or part: "Jump to the usual choices", "No shortcuts on this page" | overlap (gap below 0 px)
choose | shortcut-engine | synthwave | 390 | 5 text(s) overlap another text or part: "Filters", "Jump to the usual choices", "Keyboard shortcuts", "No shortcuts on this page" | overlap (gap below 0 px)
choose | shortcut-engine | pastel | 390 | 6 text(s) overlap another text or part: "Jump to the usual choices", "Keyboard shortcuts", "Keys that belong to a page s", "No shortcuts on this page" and 1 more | overlap (gap below 0 px)
choose | shortcut-engine | forest | 390 | 6 text(s) overlap another text or part: "Filters", "Jump to the usual choices", "Keyboard shortcuts", "Keys that belong to a page s" and 2 more | overlap (gap below 0 px)
choose | shortcut-engine | blueprint | 390 | 8 text(s) overlap another text or part: "Alt U", "Filters", "Jump to the usual choices", "Keyboard shortcuts" and 3 more | overlap (gap below 0 px)
choose | shortcut-engine | solstice | 390 | 6 text(s) overlap another text or part: "Alt U", "Jump to the usual choices", "Keyboard shortcuts", "Keys that belong to a page s" and 1 more | overlap (gap below 0 px)
choose | shortcut-engine | brutalism | 390 | 6 text(s) overlap another text or part: "Alt U", "Jump to the usual choices", "Keyboard shortcuts", "Keys that belong to a page s" and 1 more | overlap (gap below 0 px)
choose | shortcut-engine | deco | 390 | 4 text(s) overlap another text or part: "Jump to the usual choices", "Keyboard shortcuts", "No shortcuts on this page" | overlap (gap below 0 px)
choose | shortcut-engine | nostromo | 390 | 10 text(s) overlap another text or part: "Alt U", "Filters", "Jump to the usual choices", "Keyboard shortcuts" and 3 more | overlap (gap below 0 px)
choose | shortcut-engine | titanium | 390 | 8 text(s) overlap another text or part: "Alt U", "Jump to the usual choices", "Keyboard shortcuts", "Keys that belong to a page s" and 2 more | overlap (gap below 0 px)
choose | shortcut-engine | titanium | 390 | "Turn Warning on or off" against "Keys that belong to a page s" | 1 text(s), gap 0.7 to 0.7 px (minimum is 4)
choose | shortcut-engine | titanium | 390 | "Keys that belong to a page s" against "Turn Warning on or off" | 1 text(s), gap 0.7 to 0.7 px (minimum is 4)
fields | rating-states | brutalism | 390 | 2 text(s) overlap another text or part: "2", "Not rated yet" | overlap (gap below 0 px)
fields | rating-states | titanium | 390 | 2 text(s) overlap another text or part: "2", "Not rated yet" | overlap (gap below 0 px)
updates | version-states | dark | 1280 | "9a8b7c6d5e4f3a2b1c0d9e8f7a6b" against edge of span.kp-badge | 1 text(s), gap 2.0 to 2.0 px (minimum is 4)
updates | version-states | pastel | 1280 | "9a8b7c6d5e4f3a2b1c0d9e8f7a6b" against edge of span.kp-badge | 1 text(s), gap -3.4 to -3.4 px (minimum is 4)
updates | version-states | forest | 1280 | "3f9c1a2b7d4e8a6f0c5b9d1e2f3a" against edge of span.kp-badge | 1 text(s), gap -7.0 to -7.0 px (minimum is 4)
updates | version-states | solstice | 1280 | "9a8b7c6d5e4f3a2b1c0d9e8f7a6b" against edge of span.kp-badge | 1 text(s), gap -3.4 to -3.4 px (minimum is 4)
confirm | question | blueprint | 1280 | 55 text(s) overlap another text or part: "Allow", "Allowed. The operation goes ", "Deletes the 14 old backups (", "Dismiss" and 9 more | overlap (gap below 0 px)
confirm | question | blueprint | 390 | 55 text(s) overlap another text or part: "Allow", "Allowed. The operation goes ", "Deletes the 14 old backups (", "Dismiss" and 9 more | overlap (gap below 0 px)
confirm | selection-bar | solstice | 390 | "Updating" against edge of div.k5-scroll | 1 text(s), gap 1.9 to 1.9 px (minimum is 4)
lists | payload-cell | synthwave | 390 | "Show all 6 lines" against edge of button.kp-button | 1 text(s), gap 2.1 to 2.1 px (minimum is 4)
lists | payload-cell | brutalism | 390 | "Show all 24 lines", "Show all 38 lines" against edge of button.kp-button | 2 text(s), gap -0.0 to -0.0 px (minimum is 4)
lists | payload-cell | nostromo | 390 | "Show all 24 lines", "Show all 38 lines", "Show all 6 lines" against edge of button.kp-button | 4 text(s), gap -6.4 to 2.6 px (minimum is 4)
lists | payload-cell | titanium | 390 | "Show all 6 lines" against edge of button.kp-button | 1 text(s), gap 0.0 to 0.0 px (minimum is 4)
status | explain-lede | brutalism | 390 | "Failed" against edge of div.kp-segmented | 1 text(s), gap 2.9 to 2.9 px (minimum is 4)
status | explain-lede | deco | 390 | "Failed" against edge of div.kp-segmented | 1 text(s), gap -1.0 to -1.0 px (minimum is 4)
status | explain-lede | titanium | 390 | "Failed" against edge of div.kp-segmented | 1 text(s), gap 3.3 to 3.3 px (minimum is 4)
calm | calm-mode | dark | 390 | "Everything" against edge of div.kp-segmented | 1 text(s), gap -1.0 to -1.0 px (minimum is 4)
calm | calm-mode | cyberpunk | 390 | "Everything" against edge of div.kp-segmented | 1 text(s), gap -1.0 to -1.0 px (minimum is 4)
calm | calm-mode | synthwave | 390 | "Everything" against edge of div.kp-segmented | 1 text(s), gap -1.0 to -1.0 px (minimum is 4)
calm | calm-mode | blueprint | 390 | "Everything" against edge of div.kp-segmented | 1 text(s), gap -1.0 to -1.0 px (minimum is 4)
calm | calm-mode | brutalism | 390 | "Everything" against edge of div.kp-segmented | 1 text(s), gap -3.0 to -3.0 px (minimum is 4)
calm | calm-mode | deco | 390 | "Everything" against edge of div.kp-segmented | 1 text(s), gap -1.0 to -1.0 px (minimum is 4)
calm | calm-mode | nostromo | 390 | "Everything" against edge of div.kp-segmented | 1 text(s), gap -1.0 to -1.0 px (minimum is 4)
calm | calm-mode | titanium | 390 | "Everything" against edge of div.kp-segmented | 1 text(s), gap -1.0 to -1.0 px (minimum is 4)
calm | calm-tones-states | brutalism | 390 | "01", "02", "03", "04" and 27 more against edge of button.kp-calendar__day | 31 text(s), gap 3.8 to 3.9 px (minimum is 4)
calm | focus-states | brutalism | 390 | 1 text(s) overlap another text or part: "Back" | overlap (gap below 0 px)
calm | focus-states | deco | 390 | "Back" against span | 1 text(s), gap 0.8 to 0.8 px (minimum is 4)
calm | quote | nostromo | 1280 | 2 text(s) overlap another text or part: "Show all", "Vandaag was een zware dag. I" | overlap (gap below 0 px)
calm | quote | nostromo | 390 | 2 text(s) overlap another text or part: "Show all", "Vandaag was een zware dag. I" | overlap (gap below 0 px)
charts | availability-grid | nostromo | 390 | 2 text(s) overlap another text or part: "Kenny (you)", "✓ Can" | overlap (gap below 0 px)
charts | availability-grid | nostromo | 390 | "Kenny (you)" against "× Cannot" | 1 text(s), gap 3.3 to 3.3 px (minimum is 4)
charts | availability-grid | nostromo | 390 | "× Cannot" against "Kenny (you)" | 1 text(s), gap 3.3 to 3.3 px (minimum is 4)
media | print-checklist | nostromo | 390 | "Hotel booking" against "check-in after 15:00, refere" | 2 text(s), gap 3.5 to 3.6 px (minimum is 4)
media | print-checklist | nostromo | 390 | "check-in after 15:00, refere" against "Hotel booking" | 2 text(s), gap 3.5 to 3.6 px (minimum is 4)
people | avatar | synthwave | 1280 | "AL", "AT", "GH", "KJ" against edge of span.kp-idmark | 4 text(s), gap 2.7 to 3.4 px (minimum is 4)
people | avatar | synthwave | 390 | "AL", "AT", "GH", "KJ" against edge of span.kp-idmark | 4 text(s), gap 2.7 to 3.4 px (minimum is 4)
people | avatar | brutalism | 1280 | "GH" against edge of span.kp-idmark | 1 text(s), gap 3.1 to 3.1 px (minimum is 4)
people | avatar | brutalism | 390 | "GH" against edge of span.kp-idmark | 1 text(s), gap 3.1 to 3.1 px (minimum is 4)

## Tier B: a part sticks out of its section, or the section scrolls sideways (measure-overflow)

part | item | theme | width | what | measured
---|---|---|---|---|---
choose | intent-states | brutalism | 390 | the section scrolls sideways | scroll width 7 px over
updates | auto-refresh | dark | 390 | div.kp-refresh__bar sticks out of the section | 261 px past the right edge; scroll width 262 px over
updates | auto-refresh | cyberpunk | 390 | div.kp-refresh__bar sticks out of the section | 249 px past the right edge; scroll width 250 px over
updates | auto-refresh | synthwave | 390 | div.kp-refresh__bar sticks out of the section | 277 px past the right edge; scroll width 278 px over
updates | auto-refresh | pastel | 390 | div.kp-refresh__bar sticks out of the section | 188 px past the right edge; scroll width 189 px over
updates | auto-refresh | forest | 390 | div.kp-refresh__bar sticks out of the section | 186 px past the right edge; scroll width 187 px over
updates | auto-refresh | blueprint | 390 | div.kp-refresh__bar sticks out of the section | 268 px past the right edge; scroll width 269 px over
updates | auto-refresh | solstice | 390 | div.kp-refresh__bar sticks out of the section | 186 px past the right edge; scroll width 187 px over
updates | auto-refresh | brutalism | 390 | div.kp-refresh__bar sticks out of the section | 299 px past the right edge; scroll width 300 px over
updates | auto-refresh | deco | 390 | div.kp-refresh__bar sticks out of the section | 310 px past the right edge; scroll width 311 px over
updates | auto-refresh | nostromo | 390 | div.kp-refresh__bar sticks out of the section | 303 px past the right edge; scroll width 304 px over
updates | auto-refresh | titanium | 390 | div.kp-refresh__bar sticks out of the section | 329 px past the right edge; scroll width 330 px over
updates | version-states | dark | 1280 | the section scrolls sideways | scroll width 2 px over
updates | version-states | dark | 390 | span.kp-version__to sticks out of the section | 161 px past the right edge; scroll width 162 px over
updates | version-states | cyberpunk | 1280 | span.kp-version__to sticks out of the section | 86 px past the right edge; scroll width 87 px over
updates | version-states | cyberpunk | 390 | span.kp-version__to sticks out of the section | 249 px past the right edge; scroll width 250 px over
updates | version-states | synthwave | 390 | span.kp-version__to sticks out of the section | 117 px past the right edge; scroll width 118 px over
updates | version-states | pastel | 1280 | span.kp-version__to sticks out of the section | 2 px past the right edge; scroll width 3 px over
updates | version-states | pastel | 390 | span.kp-version__to sticks out of the section | 165 px past the right edge; scroll width 166 px over
updates | version-states | forest | 1280 | span.kp-version__to sticks out of the section | 19 px past the right edge; scroll width 20 px over
updates | version-states | forest | 390 | span.kp-version__to sticks out of the section | 182 px past the right edge; scroll width 183 px over
updates | version-states | blueprint | 1280 | span.kp-version__from sticks out of the section | 53 px past the right edge; scroll width 54 px over
updates | version-states | blueprint | 390 | span.kp-version__from sticks out of the section | 216 px past the right edge; scroll width 217 px over
updates | version-states | solstice | 1280 | span.kp-version__to sticks out of the section | 2 px past the right edge; scroll width 3 px over
updates | version-states | solstice | 390 | span.kp-version__to sticks out of the section | 165 px past the right edge; scroll width 166 px over
updates | version-states | brutalism | 1280 | span.kp-version__to sticks out of the section | 103 px past the right edge; scroll width 104 px over
updates | version-states | brutalism | 390 | span.kp-version__to sticks out of the section | 266 px past the right edge; scroll width 267 px over
updates | version-states | deco | 1280 | span.kp-version__to sticks out of the section | 74 px past the right edge; scroll width 75 px over
updates | version-states | deco | 390 | span.kp-version__to sticks out of the section | 237 px past the right edge; scroll width 238 px over
updates | version-states | nostromo | 1280 | span.kp-version__from sticks out of the section | 70 px past the right edge; scroll width 71 px over
updates | version-states | nostromo | 390 | span.kp-version__from sticks out of the section | 233 px past the right edge; scroll width 234 px over
updates | version-states | titanium | 1280 | span.kp-version__to sticks out of the section | 46 px past the right edge; scroll width 47 px over
updates | version-states | titanium | 390 | span.kp-version__to sticks out of the section | 209 px past the right edge; scroll width 210 px over
confirm | question | blueprint | 1280 | div.kp-question__head sticks out of the section | 493 px past the right edge
confirm | question | blueprint | 390 | div.kp-question__head sticks out of the section | 493 px past the right edge
lists | request-inspector | dark | 390 | div.kp-inspector__bar sticks out of the section | 103 px past the right edge; scroll width 104 px over
lists | request-inspector | cyberpunk | 390 | div.kp-inspector__bar sticks out of the section | 105 px past the right edge; scroll width 106 px over
lists | request-inspector | synthwave | 390 | button.kp-button sticks out of the section | 120 px past the right edge; scroll width 121 px over
lists | request-inspector | pastel | 390 | div.kp-inspector__bar sticks out of the section | 93 px past the right edge; scroll width 94 px over
lists | request-inspector | forest | 390 | div.kp-inspector__bar sticks out of the section | 91 px past the right edge; scroll width 92 px over
lists | request-inspector | blueprint | 390 | div.kp-inspector__bar sticks out of the section | 93 px past the right edge; scroll width 94 px over
lists | request-inspector | solstice | 390 | div.kp-inspector__bar sticks out of the section | 91 px past the right edge; scroll width 92 px over
lists | request-inspector | brutalism | 390 | div.kp-inspector__bar sticks out of the section | 132 px past the right edge; scroll width 133 px over
lists | request-inspector | deco | 390 | div.kp-inspector__bar sticks out of the section | 126 px past the right edge; scroll width 127 px over
lists | request-inspector | nostromo | 390 | div.kp-inspector__bar sticks out of the section | 108 px past the right edge; scroll width 109 px over
lists | request-inspector | titanium | 390 | div.kp-inspector__bar sticks out of the section | 115 px past the right edge; scroll width 116 px over
media | print-checklist | blueprint | 390 | section.kp-checklist__group sticks out of the section | 32 px past the right edge; scroll width 33 px over
media | print-checklist | brutalism | 390 | section.kp-checklist__group sticks out of the section | 39 px past the right edge; scroll width 40 px over
media | print-checklist | nostromo | 390 | section.kp-checklist__group sticks out of the section | 14 px past the right edge; scroll width 15 px over
media | print-checklist | titanium | 390 | section.kp-checklist__group sticks out of the section | 61 px past the right edge; scroll width 62 px over

## Tier C: text squeezed to a sliver (weaker signal, check by eye)

part | item | themes (1280 / 390) | what | measured
---|---|---|---|---
schedule | runs | - / cyberpunk,synthwave | span.kp-runs__rel ("in 1 day") squeezed to 39-39 px | 2 cells
schedule | runs-states | - / cyberpunk,synthwave | span.kp-runs__rel ("in 1 day") squeezed to 39-39 px | 2 cells
fields | rating | cyberpunk,synthwave / cyberpunk,synthwave | span.kp-rating__caption ("4.5 (12)") squeezed to 37-39 px | 8 cells
fields | rating | dark,cyberpunk,synthwave,pastel,forest,blueprint,solstice,brutalism,deco,nostromo,titanium / dark,cyberpunk,synthwave,pastel,forest,blueprint,solstice,brutalism,deco,nostromo,titanium | span.kp-rating__foot ("3 of 5ClearSave ratingCa") squeezed to 30-37 px | 26 cells
fields | rating-states | dark,cyberpunk,synthwave,pastel,forest,blueprint,solstice,brutalism,deco,nostromo,titanium / dark,cyberpunk,synthwave,pastel,forest,blueprint,solstice,brutalism,deco,nostromo,titanium | span.kp-rating__foot ("4 of 5ClearSave ratingCa") squeezed to 30-37 px | 24 cells
updates | version | dark,cyberpunk,synthwave,pastel,forest,blueprint,solstice,brutalism,deco,nostromo,titanium / dark,cyberpunk,synthwave,pastel,forest,blueprint,solstice,brutalism,deco,nostromo,titanium | a.kp-version__to ("12.1 (release notes, ope") squeezed to 22-35 px | 22 cells
updates | version | deco,titanium / deco,titanium | span.kp-version__from ("1.118.2") squeezed to 37-39 px | 4 cells
updates | version | deco / deco | span.kp-version__to ("1.119.0") squeezed to 39-39 px | 2 cells
updates | version-states | dark,cyberpunk,synthwave,pastel,forest,blueprint,solstice,brutalism,deco,nostromo,titanium / dark,cyberpunk,synthwave,pastel,forest,blueprint,solstice,brutalism,deco,nostromo,titanium | a.kp-version__to ("12.1 (release notes, ope") squeezed to 22-35 px | 22 cells
confirm | question | blueprint / blueprint | article.kp-question ("Remove the 14 old backup") squeezed to 34-34 px | 2 cells
confirm | question | blueprint / blueprint | span.kp-question__default ("If nobody answers: Stop.") squeezed to 0-0 px | 2 cells
lists | claim-row | dark,cyberpunk,synthwave / dark,cyberpunk,synthwave | span.kp-checklist__detail ("2 x 10 l") squeezed to 36-40 px | 6 cells
lists | claim-row | dark,cyberpunk,synthwave,pastel,forest,blueprint,solstice,brutalism,deco,nostromo,titanium / dark,cyberpunk,synthwave,pastel,forest,blueprint,solstice,brutalism,deco,nostromo,titanium | span.kp-claim__person ("BVBo Vandenbroucke-Lemme") squeezed to 24-24 px | 22 cells
lists | payload-cell | pastel,forest,solstice / pastel,forest,solstice | span.kp-code__meta ("6 lines") squeezed to 35-35 px | 6 cells
calm | calm-tones | synthwave,solstice / synthwave,solstice | span.kp-heat__label-text ("Stretch") squeezed to 36-39 px | 6 cells
calm | focus | nostromo,titanium / nostromo,titanium | div.kp-focus-steps__tools ("Screen may dimRead aloud") squeezed to 0-0 px | 4 cells
calm | focus-states | nostromo,titanium / nostromo,titanium | div.kp-focus-steps__tools ("Screen may dimRead aloud") squeezed to 0-0 px | 4 cells
charts | availability-grid | cyberpunk,synthwave,nostromo / dark,cyberpunk,synthwave,brutalism,deco,nostromo | span.kp-availability__column-name ("Kenny (you)") squeezed to 0-39 px | 9 cells
charts | trace | - / synthwave | time.kp-steplist__time ("allowed") squeezed to 38-38 px | 1 cells
charts | trace-states | synthwave / synthwave | time.kp-steplist__time ("allowed") squeezed to 38-38 px | 2 cells
media | print-checklist | - / dark,pastel,forest,blueprint,solstice,brutalism,deco,nostromo,titanium | span.kp-checklist__label ("Hotel booking") squeezed to 0-25 px | 9 cells
people | entity | pastel,forest,blueprint,solstice,titanium / pastel,forest,blueprint,solstice,titanium | div.kp-menu-button ("+2no healthcheckport 844") squeezed to 28-35 px | 10 cells
people | entity-states | pastel,forest,blueprint,solstice,titanium / pastel,forest,blueprint,solstice,titanium | div.kp-menu-button ("+3pinned imageno healthc") squeezed to 26-35 px | 13 cells
